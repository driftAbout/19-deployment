'use strict';

const debug = require('debug')('http:gallery-post-test');
const server = require('../../lib/server');
const superagent = require('superagent');
const mock = require('../lib/mock');
const Auth = require('../../model/auth');
require('jest');

describe('Gallery POST Integration', function() {
  beforeAll(() => server.start());
  afterAll(() => server.stop());

  afterAll(mock.removeUsers);
  afterAll(mock.removeGalleries);

  beforeAll(() => {
    return mock.gallery.new_gallery_data()
      .then(gallery_data => { 
        this.gallery_data = gallery_data ;
        // let user_id = this.gallery_data.user_data.user._id;
        // let gallery_title = this.gallery_data.title;
        // let gallery_description = this.gallery_data.description;
        // this.user_token = this.gallery_data.user_data.user_token;
        // let gallery_obj = {title: gallery_title, description: gallery_description, user_id: user_id};
        // debug('gallery_obj', gallery_obj );
        // return gallery_obj; 
      });
  });
  
  this.url = ':4000/api/v1';
  
  describe('Valid requests', () => {

   

    beforeAll(() => {
      debug('gallery_data', this.gallery_data.user_token);
      return  superagent.post(`${this.url}/gallery`)
        .send({title: this.gallery_data.title, description: this.gallery_data.description})
        .set('Authorization', `Bearer ${this.gallery_data.user_data.user_token}`)
        .then( res => {
          this.resPost = res;
        })
        .catch(err => {
          debug('superagent error ', err);
        });
    });

    describe('POST /api/v1/gallery', () => {

      it.only('should post with 201', () => {
        expect(this.resPost.status).toEqual(201);
      });
      it('should should have a token in the response body', () => {
        debug('this.resPost.body', this.resPost.body);
        expect(this.resPost.body).not.toBeNull;
      });

      it('should should have a token in the response body that can be parsed and decoded', () => {
        let tokenObj = Buffer.from(this.resPost.body.split('.')[1], 'base64').toString();
        debug('tokenObj', tokenObj);
        expect(JSON.parse(tokenObj).hasOwnProperty('jwt')).toBe(true);
      });

      it('should have created a record in the database', () => {
        debug(' this.user.username',  this.user.username);
        return Auth.findOne({username: this.user.username})
          .then(user => {
            debug('user.email', user.email);
            expect(user.email).toEqual(this.user.email);
          })
          .catch(console.error);

      });

    });

  });

});