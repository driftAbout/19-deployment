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
   
  describe('Valid requests', () => {
   
    beforeAll(() => {
      return mock.photo.create_photo()
        .then(data => { 
          this.data = data;
        });
    });

    describe('photo DELETE /api/v1/note/:id?', () => {
      
      beforeAll(() => {
        return  superagent.delete(`${this.url}/photo/${this.data.photo._id}`)
          .set('Authorization', `Bearer ${this.data.user_data.user_token}`)
          .then(res => this.deleteRes = res);       
      });
      //beforeAll(() => {
      //   return superagent.get(`:4000/api/v1/note/${this.resPost.body.id}`)
      //     .catch(err => this.deleteGet = err);       
      // });

      // it('should return status 404', () => {
      //   debug('this.deleteGet.body', this.deleteGet.status);
      //   expect(this.deleteGet.status).toEqual(404);
      // });

      it.only('should return status code 204', () => {
        expect(this.deleteRes.status).toEqual(204);
      });
    });
  });

});