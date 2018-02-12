'use strict';

const errorHandler = require('./error-handler');
const jsonWebToken = require('jsonwebtoken');
const Auth = require('../model/auth');
const debug = require('debug')('http:bearer');

const ERROR_MESSAGE = 'Authorization Failed';

module.exports = function (req, res, next) {

  let auth_headers = req.headers.authorization;
  if (!auth_headers) return errorHandler(new Error (ERROR_MESSAGE), res);

  let token = auth_headers.split(/\s/)[1];
  if (!token) return errorHandler(new Error (ERROR_MESSAGE), res);

  debug('token', token);
 
  return jsonWebToken.verify(token, process.env.APP_SECRET, (err, value) => {
    if(err){
      err.message = ERROR_MESSAGE;
      return errorHandler(err, res);
    }

    debug('jwt value', value);

    Auth.findOne({compHash: value.jwt})
      .then(user => {
        if (!user) return Promise.reject(new Error (ERROR_MESSAGE));
        req.user = user;
        next();
      })
      .catch(err => errorHandler(err, res));
      
  });

};