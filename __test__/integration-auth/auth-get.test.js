'use strict';

const debug = require('debug')('http:auth-get-test');
const server = require('../../lib/server');
const superagent = require('superagent');
const mock = require('../lib/mock');
require('jest');

describe('GET Integration', function() {
  beforeAll(() => server.start());
  afterAll(() => server.stop());
  afterAll(mock.removeUsers);

  this.url = `:${process.env.PORT}/api/v1`;
  
  describe('Valid requests', () => {
   
    beforeAll(() => {
      return mock.auth.createUser()
        .then(data => {
          this.user_data = data;
        });
    });
  
    beforeAll(()=> {
      debug('userinfo', `${this.user_data.user.username}:${this.user_data.password}`);
      return  superagent.get(`${this.url}/signin`)
        .auth(`${this.user_data.user.username}:${this.user_data.password}`)
        .then( res => {
          this.resGet = res;
        })
        .catch(err => {
          debug('superagent error ', err);
        });
    });

    it('should return status code 200', () => {
      expect(this.resGet.status).toEqual(200);
    });

    it('should not contain a password in the req.auth', () => {
      expect(this.resGet.res.req.auth).toBeUndefined();
    });
    
    it('should should have a token in the response body that can be parsed and decoded', () => {
      let tokenObj = Buffer.from(this.resGet.body.split('.')[1], 'base64').toString();
      debug('tokenObj', tokenObj);
      expect(JSON.parse(tokenObj).hasOwnProperty('jwt')).toBe(true);
    });
    
  });

  describe('Invalid requests', () => {
    it('should return a 404 for a bad route', () => {
      return  superagent.get(`${this.url}/signinError`)
        .catch(err => expect(err.status).toBe(404));
    });

    it('should return a 401 for an invalid username', () => {
      return  superagent.get(`${this.url}/signin`)
        .auth(`${this.user_data.user.username}error:${this.user_data.password}`)
        .catch(err => expect(err.status).toBe(401));
    });

    it('should return a 401 for an invalid password', () => {
      return  superagent.get(`${this.url}/signin`)
        .auth(`${this.user_data.user.username}:${this.user_data.password}error`)
        .catch(err => expect(err.status).toBe(401));
    });

  });
});