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
  afterAll(mock.removeGalleries);

  this.url = ':4000/api/v1';
  
  describe('Valid requests', () => {
   
    
    beforeAll(() => {
      return mock.gallery.create_gallery()
        .then(gallery_data => { 
          this.gallery_data = gallery_data ;
        });
    });
  
    beforeAll(() => {
      debug('gallery_data', this.gallery_data);
      return  superagent.get(`${this.url}/gallery/${this.gallery_data.gallery._id}`)
        .set('Authorization', `Bearer ${this.gallery_data.user_data.user_token}`)
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