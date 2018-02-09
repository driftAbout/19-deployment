'use strict';
const fs = require('fs');
const del = require('del');
const path = require('path');
const tempDir = `${__dirname}/../temp`;
const aws3 = require('../lib/aws-sdk');
const mongoose = require('mongoose');
const debug = require('debug')('http:photo');

debug('photo model');

const Photo = mongoose.Schema({
  image_url: {type: String, required: true, unique: true},
  name: {type: String, required: true},
  description: {type: String, required: true},
  user_id: {type: mongoose.Schema.Types.ObjectId, required: true, unique: true, ref: 'auth'},
  gallery_id: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'gallery'},
  cloud_key: {type: String, required: true, unique: true},
},
{timestamps: true}
); 

Photo.statics.upload = function(req) {
  return new Promise((resolve, reject) => {
    if(!req.file) return  reject(new Error('Multi-part form data error: missing file data'));
    if(!req.file.path) return  reject(new Error('Multi-part form data error: missing file path'));

    let metadata =  {
      'x-amz-meta-original_filename': `${req.file.originalname}`,
      'x-amz-meta-original_user_id': `${req.user._id}`,
    };
    
    let params = {
      ACL: 'public-read',
      Bucket: process.env.AWS_BUCKET,
      Key: `${req.file.filename}${path.extname(req.file.originalname)}`,
      Body: fs.createReadStream(req.file.path),
      Metadata: metadata,
    };
    return(aws3.uploadProm(params))
      .then(data =>{

        del(`${tempDir}/${req.file.filename}`);

        let photoData = {
          image_url: data.Location,
          name: req.body.name,
          description: req.body.description,
          user_id: req.user._id,
          gallery_id: req.body.gallery_id,
          cloud_key: data.key,
        };
        resolve(photoData);
      })
      .catch(reject);
  });
 
};

Photo.methods.delete = function() {
  return new Promise((resolve, reject) => {

    let params = {
      ACL: 'public-read',
      Bucket: process.env.AWS_BUCKET,
      Key: this.cloud_key,
    };

    return(aws3.deleteProm(params))
      .then(this.remove())
      .then(resolve)
      .catch(reject);
  });
 
};

module.exports = mongoose.model('photo', Photo);