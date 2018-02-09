'use strict';

const debug =  require('debug')('http:req-error-log');

module.exports = function(req, res, next) {

  debug('request:', req);

  next();
};

