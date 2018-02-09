'use strict';

const Photo = require('../model/photo');
const bodyParser = require('body-parser').json();
const bearer_auth_middleware = require('../lib/bear-auth-middleware');
const errorHandler = require('../lib/error-handler');
const debug = require('debug')('http:route-photo');

//upload dependencies
const tempDir = `${__dirname}/../temp`;
const multer = require('multer');
const upload = multer({dest: tempDir});
//const upload = multer({dest: tempDir}).single('image');
//const reqLog = require('../lib/req-logger');

debug('tempDir', tempDir);

module.exports = function(router) {

  router.route('/photo/:id?')

    .post(bearer_auth_middleware, bodyParser, upload.single('image'), (req, res) => {
      // upload(req, res, err => err ? debug('multer error', err) : debug('cool'));
      debug('photo post', 'req');
      return Photo.upload(req)
        .then(data => new Photo(data).save())
        .then(img => res.status(201).json(img))
        .catch(err => errorHandler(err,res));
    })

    .get(bearer_auth_middleware, (req, res) => {
      if (req.params){
        return Photo.findById(req.params.id)
          .then(img => res.status(200).json(img))
          .catch(err => errorHandler(err,res));          
      }
      return Photo.find({user_id: req.user.user_id})
        .then(imgs => imgs.map(img => img._id))
        .then(img_ids => res.status(200).json(img_ids))
        .catch(err => errorHandler(err, res));
    })

    .delete(bearer_auth_middleware, (req, res) => {
      Photo.findById(req.params.id) //find one
        .then(img => {
          if (img.user_id !== req.user._id) return new Error('Authorization Error: permission denied');
          return img.delete();
        })
        .then(() => res.statusSend(204))
        .catch(err => errorHandler(err, res));
    });

};
