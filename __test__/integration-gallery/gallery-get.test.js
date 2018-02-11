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

  this.url = `:${process.env.PORT}/api/v1`;
  
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

    it('should return status code 200', () => {
      expect(this.resGet.status).toEqual(200);
    });

    it('should not contain an object with data from a gallery in the req.body', () => {
      debug('this.resGet.body.', this.resGet.body);
      expect(this.resGet.body.title).toEqual(this.gallery_data.gallery.title);
      expect(this.resGet.body.description).toEqual(this.gallery_data.gallery.description);
    });
    
    it('should should have the id of the user making thr request in the body', () => {
      expect(this.resGet.body.user_id.toString()).toEqual(this.gallery_data.user_data.user._id.toString());
    });
    
  });

});