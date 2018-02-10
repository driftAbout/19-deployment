'use strict';

const debug = require('debug')('http:photo-get-test');
const server = require('../../lib/server');
const superagent = require('superagent');
const mock = require('../lib/mock');
const del = require('del');
require('jest');

describe('GET Integration', function() {
  beforeAll(() => server.start());
  afterAll(() => server.stop());
  afterAll(mock.removeUsers);
  afterAll(mock.removeGalleries);
  afterAll(() => del(this.data.file));

  this.url = `:${process.env.PORT}/api/v1`;

  beforeAll(() => {
    return mock.photo.create_photo()
      .then(data => { 
        this.data = data;
      });
  });

  describe('Valid requests', () => {
   
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

    it('should return status code 200', () => {
      expect(this.resGet.status).toEqual(200);
    });

    it('should should have image data in the body', () => {
      expect(this.resGet.body.user_id).toEqual(this.data.user_data.user._id.toString());
      expect(this.resGet.body.gallery_id).toEqual(this.data.gallery_id);
      expect(this.resGet.body.image_url).not.toBeNull;
    });

    describe('Valid requests get all', () => {
      beforeAll(() => {
        return  superagent.get(`${this.url}/photo`)
          .set('Authorization', `Bearer ${this.data.user_data.user_token}`)
          .then( res => {
            this.resGet = res;
            expect(this.resGet.body).toEqual(expect.arrayContaining([`${this.data.photo._id}`])); 
          })
          .catch(err => {
            debug('superagent error ', err);
          });
      });
    
      it('should should have an array of image data in the body', () => {  
        expect(this.resGet.body).toEqual(expect.arrayContaining([`${this.data.photo._id}`])); 
      });
    
    });

  });

  describe('invalid requests', () => {

    it('should return 404 for a get request to a bad path', () => {
      return  superagent.get(`${this.url}/photo/${this.data.photo._id}`)
        .set('Authorization', `Bearer ${this.data.user_data.user_token}`)
        .catch(err => expect(err.response.status).toEqual(404));
    });

    it('should return 401 for a get request with bad credentials', () => {
      return superagent.get(`${this.url}/photo/${this.data.photo._id}`)
        .set('Authorization', `Bearer error${this.data.user_data.user_token}`)
        .catch(err => expect(err.response.status).toEqual(401));
    });

    it('should return 404 for a get request with a bad photo id', () => {
      return  superagent.get(`${this.url}/photo/${this.data.photo._id.toString()}`)
        .set('Authorization', `Bearer ${this.data.user_data.user_token}`)
        .catch(err => expect(err.response.status).toEqual(401));
    });

  });
});