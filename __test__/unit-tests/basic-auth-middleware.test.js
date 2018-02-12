'use strict';

const basicAuth = require('../../lib/basic-auth-middleware');
const mock = require('../lib/mock');
const debug = require('debug')('http:basic-auth-unit-test');

describe('Basic Auth unit testing', function() {  

  this.res = { status: function(stat){this.statusCode = stat; return this; }, send: function(msg){this.message  = msg; return this;}};

  this.next = (req, res) => {
    this.authReq = req;
    this.authReqs= res;
  };

  beforeAll(() => {
    this.user = mock.new_user()
    let basic = Buffer.from(`${this.user.username}:${this.user.password}`).toString('base64');
    this.req = {
      headers: {
        authorization: `Basic ${basic}`,
      },
    };
  });

  describe('Valid input', () => {
    beforeAll( () => {
      return basicAuth(this.req, this.res, this.next);
    });
  
    it('should have a req.auth object', () => {
      expect(this.req.auth).toBeDefined();
    });

    it('should have a req.auth object with username', () => {
      expect(this.req.auth.username).toEqual(this.user.username);
    });

    it('should have a req.auth object with password', () => {
      expect(this.req.auth.password).toEqual(this.user.password);
    });
    
  });

  describe('invalid input', () => {

    describe('no auth header', () => {
      beforeAll( () => {
        return basicAuth({headers:{}}, this.res, this.next);
      });
      it('should should have a response code of 401 for no header auth', () => {
        expect(this.res.statusCode).toEqual(401);
      });
    });
  

    describe('incomplete auth header', () => {
      beforeAll( () => {
        this.req = {
          headers: {
            authorization: 'Basic ',
          },
        };
        return basicAuth(this.req, this.res, this.next);
      });
      it('should should have a response code of 401 for no header auth', () => {
        expect(this.res.statusCode).toEqual(401);
      });
    });

    describe('missing password auth header', () => {
      beforeAll( () => {
        let basic = Buffer.from(`${this.user.username}:`.toString('base64'));
        this.req = {
          headers: {
            authorization: `Basic ${basic}`,
          },
        };
        return basicAuth(this.req, this.res, this.next);
      });
      it('should should have a response code of 401 for no header auth', () => {
        expect(this.res.statusCode).toEqual(401);
      });
    });

  });

});