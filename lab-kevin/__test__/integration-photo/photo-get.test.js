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


  this.url = `:${process.env.PORT}/api/v1`;
  
  // afterAll(() => {
  //   del(this.photo_data.file);
  // });
 
  describe('Valid requests', () => {
   
    beforeAll(() => {
      return mock.photo.create_photo()
        .then(photo => { 
          this.photo = photo;
        });
    });
  
    beforeAll(() => {
      return  superagent.get(`${this.url}/photo/${this.photo_id}`)
        .set('Authorization', `Bearer ${this.photo.user.token}`)
        .then( res => {
          this.resGet = res;
        })
        .catch(err => {
          debug('superagent error ', err);
        });
    });

    it.only('should return status code 200', () => {
      debug ('this.photo', this.photo);
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