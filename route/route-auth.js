'use strict';

const debug = require('debug')('http:route-auth');
const basicAuth = require('../lib/basic-auth-middleware');
const bodyParser = require('body-parser').json();
const errorHandler = require('../lib/error-handler');
const Auth = require('../model/auth');

debug('route-auth');

const ERROR_MESSAGE = 'Authorization Failed';

module.exports = function(router) {

  router.get('/signin', basicAuth, (req, res) => {
    Auth.findOne({username: req.auth.username})
      .then(user => {
        return user ? user.comparePasswords(req.auth.password) : Promise.reject(new Error(ERROR_MESSAGE));
      })
      .then(user => {
        delete req.headers.authorization;
        delete req.auth.password;
        return user;
      })
      .then(user => user.createToken())
      .then(jwt => {
        res.status(200).json(jwt);
      })
      .catch(err => errorHandler(err, res));
  });

  router.post('/signup', bodyParser, (req, res) => {
    debug('req.body', req.body);
    if(!req.body.username || !req.body.password) return errorHandler(new Error('Bad Request'),res);
    let pswd = req.body.password;
    delete req.body.password;
    let user = new Auth(req.body);
    user.createHashedpassword(pswd)
      .then(() => user.save())
      .then(() => user.createToken())
      .then(jwt => res.status(201).json(jwt))
      .catch(err => errorHandler(err,res));
  });
};

