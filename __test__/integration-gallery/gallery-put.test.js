'use strict';

const debug = require('debug')('http:gallery-put-test');
const server = require('../../lib/server');
const superagent = require('superagent');
const mock = require('../lib/mock');
require('jest');

describe('PUT Integration', function() {
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

    beforeAll(()=> {
      debug('this.gallery_data', this.gallery_data )
      this.mock_data = {title: 'Hello', description: 'Funkn-A'};
      return  superagent.put(`${this.url}/gallery/${this.gallery_data.gallery._id}`)
        .set('Authorization', `Bearer ${this.gallery_data.user_data.user_token}`)
        .send(this.mock_data)
        .then( res => {
          this.resPost = res;
        })
        .catch(err => {
          debug('superagent error ', err);
        });
    });

    beforeAll(() => {
      return mock.gallery.find_gallery()
        .then(gallery => {
          this.gallery = gallery;
        });
    });

    it('should return a 204 for a successful put request', () => {
      expect(this.resPost.status).toEqual(204);
    });

    it('should have an empty response body for a successful put request', () => {
      expect(this.resPost.body._id).toBeUndefined();
    });

    it('should the data should change in the database', () => {
      expect(this.mock_data.title).toEqual(this.gallery.title);
      expect(this.mock_data.description).toEqual(this.gallery.description);
    });
  
  });

  describe('invalid requests', () => {

    beforeAll(() => {
      return mock.gallery.create_gallery()
        .then(gallery_data => { 
          this.new_gallery_data = gallery_data ;
          return mock.gallery.delete_one_gallery(gallery_data.gallery._id);
        });
    });

    it('should return a 404 for a put request to a bad path', () => {
      return  superagent.put(`${this.url}/galleryError/${this.gallery_data.gallery._id}`)
        .catch(err => expect(err.status).toEqual(404));
    });


    it('should return status code 404 for a gallery that does not exist', () => {
      return  superagent.put(`${this.url}/gallery/${this.new_gallery_data.gallery._id}`)
        .set('Authorization', `Bearer ${this.gallery_data.user_data.user_token}`)
        .send(this.mock_data)
        .catch(err => expect(err.status).toEqual(404));
    });

    it('should return status code 400 for a gallery put with out a proper body', () => {
      return  superagent.put(`${this.url}/gallery/${this.new_gallery_data.gallery._id}`)
        .set('Authorization', `Bearer ${this.gallery_data.user_data.user_token}`)
        .send({a: 'a', b: 'b'})
        .catch(err => expect(err.status).toEqual(404));
    });

  });

});