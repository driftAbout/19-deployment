'use strict';

const bearerAuth = require('../../lib/bear-auth-middleware');
const mock = require('../lib/mock');
const server = require('../../lib/server');
const debug = require('debug')('http:bearer-auth-unit-test');

debug('bearer-auth-middleware'); 

describe('Bearer Auth unit testing', function() {  
  beforeAll(() => server.start());
  afterAll(() => server.stop());  
  afterAll(() => mock.removeUsers());

  this.res = { status: function(stat){this.statusCode = stat; return this; }, send: function(msg){this.message  = msg; return this;}};

  beforeAll(() => {
    return mock.auth.createUser()
      .then(user_data => {
        this.user_data = user_data;
        this.req = {
          headers: {
            authorization: `Bearer ${user_data.user_token}`,
          },
        };
      })
      .catch(err=> err);
  });


  describe('Valid input', () => {
    it('should create a req.user object', () => {
      bearerAuth(this.req, this.res, () => {
        expect(this.req.user).toBeDefined();
        expect(this.req.user.username).toEqual(this.user_data.user.username);
        expect(this.req.user._id.toString()).toEqual(this.user_data.user._id.toString());
      });
    });
  }); 

  describe('invalid input', () => {

    describe('no auth header', () => {
      beforeAll( () => {
        this.req = {headers:{}};
        return bearerAuth(this.req, this.res);
      });
      it('should should have a response code of 401 for no header auth', () => {
        debug('res', this.res);
        expect(this.res.statusCode).toEqual(401);
      });
    });
  

    describe('incomplete auth header', () => {
      beforeAll( () => {
        this.req = {
          headers: {
            authorization: 'Bearer ',
          },
        };
        return bearerAuth(this.req, this.res);
      });
      it('should should have a response code of 401 for no header auth', () => {
        expect(this.res.statusCode).toEqual(401);
      });
    });

    describe('bad token in header', () => {
      beforeAll( () => {
        this.req = {
          headers: {
            authorization: 'Bearer error',
          },
        };
        return bearerAuth(this.req, this.res);
      });
      it('should should have a response code of 401 for no header auth', () => {
        expect(this.res.statusCode).toEqual(401);
      });
    });
  });
});