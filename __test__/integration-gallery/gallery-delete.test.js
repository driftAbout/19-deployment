'use strict';

const debug = require('debug')('http:gallery-delete-test');
const server = require('../../lib/server');
const superagent = require('superagent');
const mock = require('../lib/mock');
require('jest');

debug('gallery-delete-test');

describe('DELETE Integration', function() {
  beforeAll(() => server.start(process.env.PORT), () => console.log(process.env.PORT));
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
      return  superagent.delete(`${this.url}/gallery/${this.gallery_data.gallery._id}`)
        .set('Authorization', `Bearer ${this.gallery_data.user_data.user_token}`)
        .then(res => this.deleteRes = res)
        .catch(err => debug('superagent error', err));       
    });

    beforeAll(() => {
      return  mock.gallery.find_gallery({_id: this.gallery_data.gallery._id})
        .then(gallery => this.gallery = gallery)
        .catch(err => err);
    });

    it('should return status code 204', () => {
      expect(this.deleteRes.status).toEqual(204);
    });

    it('should have an empty body', () => {
      expect(Object.keys(this.deleteRes.body).length).toEqual(0);
    });

    it('should no longer be in the database', () => {
      expect(this.gallery).toBeNull();
    });

  });
 

});