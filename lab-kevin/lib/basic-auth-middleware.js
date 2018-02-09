'use strict';

const errorHandler = require('./error-handler');
const debug = require('debug')('http:basic-auth-middleware');

module.exports = function(req, res, next) {

  let auth_headers = req.headers.authorization;
  if(!auth_headers) return errorHandler(new Error('Authorization Required'), res);

  debug('auth_headers', auth_headers);

  let authVal = auth_headers.split(/basic[\s]+/i)[1];

  debug('authVal', authVal);

  if (!authVal) return errorHandler(new Error('Authorization Failure:  Username and password required'), res);
  let [username, password] = Buffer.from(authVal, 'base64').toString().split(':');
  
  req.auth = {username, password};

  debug('req.auth', req.auth);

  if(!req.auth.username || !req.auth.password ) return errorHandler(new Error('Authorization Failure:  Username and password required'), res);

  next();

};