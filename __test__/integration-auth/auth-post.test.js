'use strict';

const debug = require('debug')('http:post-test');
const server = require('../../lib/server');
const superagent = require('superagent');
const mock = require('../lib/mock');
const Auth = require('../../model/auth');
require('jest');

describe('POST Integration', function() {
  beforeAll(() => server.start());
  afterAll(() => server.stop());
  
  this.url = ':4000/api/v1';
  
  describe('Valid requests', () => {

    beforeAll(() => {
      this.user = mock.user;
      debug('this.user', this.user);
      return  superagent.post(`${this.url}/signup`)
        .send(this.user)
        .then( res => {
          this.resPost = res;
        })
        .catch(err => {
          debug('superagent error ', err);
        });
    });

    afterAll(mock.removeUsers);
   
    describe('POST /api/v1/signup', () => {

      it('should post with 201', () => {
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