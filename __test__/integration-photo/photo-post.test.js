'use strict';

const debug = require('debug')('http:photo-post-test');
const server = require('../../lib/server');
const superagent = require('superagent');
const mock = require('../lib/mock');
const del = require('del');
require('jest');

debug('photo-post-test');

describe('photo POST Integration', function() {
  beforeAll(() => server.start());
  afterAll(() => server.stop());
  afterAll(mock.removeUsers);
  afterAll(mock.removeGalleries);
 
  this.url = `:${process.env.PORT}/api/v1`;
  describe('Valid requests', () => {

    beforeAll(() => {
      return mock.photo.photo_data()
        .then(photo_data => {
          this.photo_data = photo_data;
        })
        .catch(console.error);
    });

    beforeAll(() => {
      return superagent.post(`${this.url}/photo`)
        .set('Authorization', `Bearer ${this.photo_data.user_data.user_token}`)
        .field('name', this.photo_data.name)
        .field('description', this.photo_data.description)
        .field('gallery_id', this.photo_data.gallery_id)
        .attach('image', this.photo_data.file)
        .then( res => {
          this.resPost = res;
          debug('resPost.body', this.resPost.body);
        })
        .catch(console.error);
    });

    afterAll(() => del(this.photo_data.file));

    debug('this.photo_data', this.photo_data);

    it('should post with 201', () => {
      expect(this.resPost.status).toEqual(201);
    });
    it('should should have image data in the body', () => {
      expect(this.resPost.body.user_id).toEqual(this.photo_data.user_data.user._id.toString());
      expect(this.resPost.body.gallery_id).toEqual(this.photo_data.gallery_id);
      expect(this.resPost.body.image_url).not.toBeNull;
    });

    it('should should have an image url that contains the key in the body', () => {
      let key = new RegExp(this.resPost.body.cloud_key); 
      expect(this.resPost.body.image_url).toMatch(key);
    });

    it('should have created a record in the database', () => {
      return mock.photo.find_photo({_id: this.resPost.body._id})
        .then(img => {
          expect(img._id).toBeDefined();
        });
    });

  });

  describe('invalid requests', () => {

    it('should return 404 for a post to a bad path', () => {
      return superagent.post(`${this.url}/photoError`)
        .set('Authorization', `Bearer ${this.photo_data.user_data.user_token}`)
        .catch(err => expect(err.response.status).toEqual(404));
    });

    it('should return 401 for a post with bad credentials', () => {
      return superagent.post(`${this.url}/photo`)
        .set('Authorization', `Bearer error${this.photo_data.user_data.user_token}`)
        .catch(err => expect(err.response.status).toEqual(401));
    });

    it('should return 404 for a post missing an image', () => {
      return superagent.post(`${this.url}/photo`)
        .set('Authorization', `Bearer ${this.photo_data.user_data.user_token}`)
        .field('name', this.photo_data.name)
        .field('description', this.photo_data.description)
        .field('gallery_id', this.photo_data.gallery_id)
        .catch(err => expect(err.response.status).toEqual(401));
    });

  });

});
