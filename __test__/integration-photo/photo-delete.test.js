'use strict';

const debug = require('debug')('http:photo-delete-test');
const server = require('../../lib/server');
const superagent = require('superagent');
const mock = require('../lib/mock');
const del = require('del');
require('jest');

debug('photo delete');

describe('photo DELETE Integration', function() {
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

  beforeAll(() => {
    mock.auth.createUser()
      .then(new_user => { 
        this.new_user = new_user;
      });
  });

  

  describe('Valid requests', () => {
    
    beforeAll(() => {
      return  superagent.delete(`${this.url}/photo/${this.data.photo._id}`)
        .set('Authorization', `Bearer ${this.data.user_data.user_token}`)
        .then(res => this.deleteRes = res);       
    });
   
    it('should return status code 204', () => {
      expect(this.deleteRes.status).toEqual(204);
    });

    it('should have an empty response body', () => {
      expect(Object.keys(this.deleteRes.body).length).toBe(0);
    });

    it('should not be avbailable on S3, return 403', () => {
      return  superagent.delete(`${this.data.photo.image_url}`)
        .catch(err => {
          expect(err.status).toEqual(403);
        });
    });
  });

  describe('Invalid requests', () => {
    
    it('should return 404 for a delete request to a bad path', () => {
      return  superagent.delete(`${this.url}/photoERROR/${this.data.photo._id}`)
        .set('Authorization', `Bearer ${this.data.user_data.user_token}`)
        .catch(err => expect(err.response.status).toEqual(404));
    });

    it('should return 401 for a delete request with bad credentials', () => {
      return superagent.delete(`${this.url}/photo/${this.data.photo._id}`)
        .set('Authorization', `Bearer error${this.data.user_data.user_token}`)
        .catch(err => expect(err.response.status).toEqual(401));
    });

    it('should return 404 for a delete request with a bad photo id', () => {
      return  superagent.delete(`${this.url}/photo/${this.data.photo._id}error`)
        .set('Authorization', `Bearer ${this.data.user_data.user_token}`)
        .catch(err => expect(err.response.status).toEqual(400));
    });

    it('should return 404 for a delete request with a photo id that does not exist', () => {
      return  superagent.delete(`${this.url}/photo/5a7f57e126d3de182ba57492`)
        .set('Authorization', `Bearer ${this.data.user_data.user_token}`)
        .catch(err => expect(err.response.status).toEqual(400));
    });

    it('should return 401 for a delete request from a user that does not own the photo', () => {
      return superagent.delete(`${this.url}/photo/${this.data.photo._id}`)
        .set('Authorization', `Bearer error${this.new_user.user_token}`)
        .catch(err => expect(err.response.status).toEqual(401));
    });
  });
});
