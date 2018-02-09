'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const debug = require('debug')('http:Auth');

debug('Auth');

const Auth = mongoose.Schema({
  username: {type: 'string', required: true, unique: true},
  password: {type: 'string', required: true},
  email: {type: 'string', required: true},
  compHash: {type: 'string', unique: true},
},
{timestamps: true}
);

Auth.methods.createHashedpassword = function(password){
  if(!password) return Promise.reject(new Error('Authorization Error: password required'));
  debug('password arg:', password);
  return bcrypt.hash(password, 10)
    .then(hash => this.password = hash)
    .catch(err => err);
};

Auth.methods.comparePasswords = function(password) {
  debug('password', password);
  return bcrypt.compare(password, this.password)
    .then(valid => {
      debug('valid before:', valid);
      if(!valid) return new Error('Authorization Error: invalid password');
      debug('valid after:', valid);
      return this;
    })
    .catch(err => err);
};

Auth.methods.createCompHash = function() {
  debug('create compHash');
  this.compHash = crypto.randomBytes(32).toString('hex');
  debug('this.compHash', this.compHash);
  return this.save()
    .then(() => this.compHash)
    .catch(err => err);
};

Auth.methods.createToken = function() {
  debug('SECRET:', process.env.APP_SECRET);
  return this.createCompHash()
    .then(cmpHsh => jwt.sign({jwt: cmpHsh}, process.env.APP_SECRET))
    .catch(err => err);
};


module.exports = mongoose.model('auth', Auth);