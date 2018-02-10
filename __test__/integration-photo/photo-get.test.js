'use strict';

const debug = require('debug')('http:photo-get-test');
const server = require('../../lib/server');
const superagent = require('superagent');
const mock = require('../lib/mock');
const Auth = require('../../model/auth');
const del = require('del');
require('jest');

describe('GET Integration', function() {
  beforeAll(() => server.start());
  afterAll(() => server.stop());
  afterAll(mock.removeUsers);
  afterAll(mock.removeGalleries);
  afterAll(() => del(this.data.file));

  this.url = `:${process.env.PORT}/api/v1`;
   
  describe('Valid requests', () => {
   
    beforeAll(() => {
      return mock.photo.create_photo()
        .then(data => { 
          this.data = data;
        });
    });
  
    beforeAll(() => {
      return  superagent.get(`${this.url}/photo/${this.data.photo._id}`)
        .set('Authorization', `Bearer ${this.data.user_data.user_token}`)
        .then( res => {
          this.resGet = res;
        })
        .catch(err => {
          debug('superagent error ', err);
        });
    });

    it.only('should return status code 200', () => {
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

});