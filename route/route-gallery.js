'use strict';

const bodyParser = require('body-parser').json();
const Gallery = require('../model/gallery');
const bearer_auth_middleware = require('../lib/bear-auth-middleware');
const errorHandler = require('../lib/error-handler');
const debug  = require('debug')('http:route-gallery');

module.exports = function(router) {

  debug('route_gallery');

  router.route('/gallery/:id?')

    .post(bearer_auth_middleware, bodyParser, (req, res) => {
      req.body.user_id = req.user._id;
      return new Gallery(req.body).save()
        .then(gallery => res.status(201).json(gallery))
        .catch(err => errorHandler(err, res));
    })

    .get(bearer_auth_middleware, (req, res) => {
      if(req.params.id){
        return Gallery.findById(req.params.id)
          .then(gallery => {
            if(!gallery) return new Error('Bad request');
            if (gallery.user_id !== req.user._id) return new Error('Authorization Failed: permission denied');
            return gallery;
          })
          .then(gallery => res.status(200).json(gallery))
          .catch(err => errorHandler(err, res));
      }

      return Gallery.find({
        user_id: req.user._id,
        _id: req.params.id,
      })
        .then(galleries => {
          if(!galleries.length) return new Error('Bad request');
          res.status(200).json(galleries.map(gallery => gallery._id));
        })
        .catch(err => errorHandler(err, res));
    })

    .put(bearer_auth_middleware, bodyParser, (req, res) => {
      return Gallery.findOne({
        user_id: req.user._id,
        _id: req.params.id,
      })
        .then(gallery => {
          if(!gallery) return new Error('Bad request');
          if (!req.body.title && !req.body.description) return new Error('Validation Error: invalid update');
          return gallery.set(req.body).save();
        })
        .catch(err => errorHandler(err, res));
    })

    .delete(bearer_auth_middleware, (req, res) => {
      return Gallery.findById(req.params.id)
        .then(gallery => {
          if(!gallery) return new Error('Bad request');
          if (gallery.user_id !== req.user._id) return new Error('Authorization Failed: permission denied');
          return gallery.remove();
        })
        .catch(err => errorHandler(err, res));
    });

};