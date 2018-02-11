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

    describe('Valid requests all galleries', () => {

      beforeAll(() => {
        return  superagent.get(`${this.url}/gallery`)
          .set('Authorization', `Bearer ${this.gallery_data.user_data.user_token}`)
          .then( res => {
            this.resGet = res;
          })
          .catch(err =>  {
            debug('superagent error ', err);
            return err;
          });   
      });

      it('Should return an array of galleries', () => {
        expect(this.resGet.body).toBeInstanceOf(Array);
        expect(this.resGet.body.length).not.toBe(0);
        expect(this.resGet.body).toEqual(expect.arrayContaining([this.gallery_data.gallery._id.toString()]));
      });
    });
    
  });

  describe('Inalid requests', () => {

    beforeAll(() => {
      return mock.gallery.create_gallery()
        .then(gallery_data => { 
          this.new_gallery_data = gallery_data ;
          return mock.gallery.delete_one_gallery(gallery_data.gallery._id);
        });
    });

    it('should return status code 404', () => {
      return  superagent.get(`${this.url}/galleryError/${this.gallery_data.gallery._id}`)
        .catch(err => expect(err.status).toEqual(404));
    });

    it('should return status code 401 when making a get request with bad user data', () => {
      return  superagent.get(`${this.url}/gallery/${this.gallery_data.gallery._id}`)
        .set('Authorization', `Bearer ${this.gallery_data.user_data.user_token}error`)
        .then( res => {
          this.resGet = res;
        })
        .catch(err => expect(err.status).toEqual(401));
    });

    it('should return status code 404 for a gallery that does not exist', () => {
      return  superagent.get(`${this.url}/gallery/${this.new_gallery_data.gallery._id}`)
        .set('Authorization', `Bearer ${this.gallery_data.user_data.user_token}`)
        .catch(err => expect(err.status).toEqual(404));
    });

    it('should return status code 401 for a gallery request that does belong to the requestor', () => {
      return  superagent.get(`${this.url}/gallery/${this.gallery_data.gallery._id}`)
        .set('Authorization', `Bearer ${this.new_gallery_data.user_data.user_token}`)
        .catch(err => expect(err.status).toEqual(401));
    });

    it('should return status code 400 for a galleries request when there are no galleries', () => {
      return  superagent.get(`${this.url}/gallery`)
        .set('Authorization', `Bearer ${this.new_gallery_data.user_data.user_token}`)
        .catch(err => expect(err.status).toEqual(400));
    });
  });

});