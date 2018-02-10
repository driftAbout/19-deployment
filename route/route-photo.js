'use strict';

const Photo = require('../model/photo');
const bodyParser = require('body-parser').json();
const bearer_auth_middleware = require('../lib/bear-auth-middleware');
const errorHandler = require('../lib/error-handler');
const debug = require('debug')('http:route-photo');

//upload dependencies
const tempDir = `${__dirname}/../temp`;
const multer = require('multer');
//const upload = multer({dest: tempDir});
const upload = multer({dest: tempDir}).single('image');

debug('tempDir', tempDir);

module.exports = function(router) {

  router.route('/photo/:id?')

    // .post(bearer_auth_middleware, bodyParser, upload.single('image'), (req, res) => {
    //   return Photo.upload(req)
    //     .then(data =>new Photo(data).save())
    //     .then(img => res.status(201).json(img))
    //     .catch(err => errorHandler(err,res));
    // })

    .post(bearer_auth_middleware, bodyParser, (req, res) => {
      return upload(req, res, err => { 
        if(err) return errorHandler(err, res);
        return multiPart(req, res);
      });
      function multiPart(req, res) {
        if (!req.body.name || !req.body.description ||  !req.body.gallery_id) return errorHandler(new Error('Validation Error:  Required fields missing.'),res);
        Photo.upload(req)
          .then(data => {
            return new Photo(data).save();
          })
          .then(img => res.status(201).json(img))
          .catch(err => errorHandler(err,res));
      }
    })

    .get(bearer_auth_middleware, (req, res) => {
      if (req.params.id){
        return Photo.findById(req.params.id)
          .then(img => res.status(200).json(img))
          .catch(err => errorHandler(err,res));          
      }
      return Photo.find({user_id: req.user._id})
        .then(imgs => {
          return imgs.map(img => img._id);
        })
        .then(img_ids => res.status(200).json(img_ids))
        .catch(err => errorHandler(err, res));
    })

    .delete(bearer_auth_middleware, (req, res) => {
      return Photo.findById(req.params.id) //find one
        .then(img => {
          if (!img) return new Error('Error ENOENT: Resource does not exist');
          if (img.user_id.toString() !== req.user._id.toString()) return new Error('Authorization Error: permission denied');
          return img.delete();
        })
        .then(() => res.sendStatus(204))
        .catch(err => errorHandler(err, res));
    });

};
