'use strict';

const Photo = require('../../model/photo'); 
const mock = require('../lib/mock');
const debug = require('debug')('http:Photo-unit-test');
const server = require('../../lib/server');
const superagent = require('superagent');

describe('Photo model unit testing', function() {
  beforeAll(() => server.start());
  afterAll(() => server.stop());
  afterAll(() => mock.removeGalleries());   
  afterAll(() => mock.removeUsers());

  describe('Valid input', function() {
  
    beforeAll(() => {
      return mock.photo.create_photo()
        .then(photo_data => this.photo_data = photo_data)
        .catch(err => err);
    });

    beforeAll(() => {
      return Photo.findOne({user_id: this.photo_data.user_data.user._id, title: this.photo_data.title})
        .then(photo => this.photo = photo)
        .catch(console.error);
    });

    beforeAll(() => {
      return superagent.get(this.photo.image_url)
        .then(res => this.awsGet = res)
        .catch(err => err);
    });

    beforeAll(() => {
      return this.photo.delete();
    });

    beforeAll(() => {
      return superagent.get(this.photo.image_url)
        .catch(err => this.awsErr = err);
    });

    beforeAll(() => {
      return Photo.findOne({user_id: this.photo_data.user_data.user._id, title: this.photo_data.title})
        .then(photo => this.del_photo = photo)
        .catch(console.error);
    });


    it('should make an object in the database', () => {
      debug('photo', this.photo);
      expect(this.photo).toBeDefined();
      expect(this.photo.title).toEqual(this.photo_data.title);
      expect(this.photo.description).toEqual(this.photo_data.description);
    });

    it('should get uploaded to AWS', () => {
      expect(this.awsGet.status).toBe(200);
    });

    it('should delete from the aws and the database', () => {
      expect(this.awsErr.status).toBe(403);
      expect(this.del_photo).toBeNull();
    });
  });

  describe('inalid input', function() {

    beforeAll(() => {
      return Photo.upload({})
        .catch(err => this.noFile = err);
    });

    beforeAll(() => {
      return Photo.upload({file: 'file'})
        .catch(err => this.noPath = err);
    });

    it('Should throw an error to upload with out data', () => {
      expect(this.noFile.message).toMatch(/file data/i);
    });

    it('Should throw an error to upload with out data', () => {
      expect(this.noPath.message).toMatch(/file path/i);
    });

  });

});