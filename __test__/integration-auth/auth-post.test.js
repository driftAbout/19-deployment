'use strict';

const debug = require('debug')('http:auth-post-test');
const server = require('../../lib/server');
const superagent = require('superagent');
const mock = require('../lib/mock');
const Auth = require('../../model/auth');
require('jest');

describe('Auth POST Integration', function() {
  beforeAll(() => server.start());
  afterAll(() => server.stop());
  afterAll(mock.removeUsers);
  
  this.url = ':4000/api/v1';
  
  describe('Valid requests', () => {

    beforeAll(() => {
      this.user = mock.new_user();
    });

    beforeAll(() => {
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

    describe('auth POST valid input', () => {

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

    describe('auth POST valid input', () => {
      it('should return a 404 to a post to bad path', () => {
        return  superagent.post(`${this.url}/signupError`)
          .catch(err => expect(err.status).toBe(404));
      });

      it('should return a 404 to a auth post with no body', () => {
        return  superagent.post(`${this.url}/signup`)
          .catch(err => expect(err.status).toBe(400));
      });

      it('should throw an error if a user already exists', () => {
        return  superagent.post(`${this.url}/signup`)
          .send(this.user)
          .catch(err => expect(err.status).toBe(409));
      });
    });

  });

});