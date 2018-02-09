'use strict';

const debug = require('debug')('http:gallery-post-test');
const server = require('../../lib/server');
const superagent = require('superagent');
const mock = require('../lib/mock');
const Auth = require('../../model/auth');
const del = require('del');
require('jest');

describe('Gallery POST Integration', function() {
  beforeAll(() => server.start());
  afterAll(() => server.stop());

  afterAll(mock.removeUsers);
  afterAll(mock.removeGalleries);

  beforeAll(() => {
    return mock.photo.photo_data()
      .then(photo_data => {
        this.photo_data = photo_data;
      })
      .catch(console.error);
  });
  
  this.url = `:${process.env.PORT}/api/v1`;
  
  describe('Valid requests', () => {

    beforeAll(() => {
      return superagent.post(`${this.url}/photo`)
        .set('Authorization', `Bearer ${this.photo_data.user_data.user_token}`)
        .field('name', this.photo_data.name)
        .field('description', this.photo_data.description)
        .field('gallery_id', this.photo_data.gallery_id)
        .attach('image', this.photo_data.file)
        .then( res => {
          this.resPost = res;
        })
        .catch(err => err);
    });

    afterAll(() => {
      del(this.photo_data.file);
    });

    describe('POST /api/v1/photo', () => {
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