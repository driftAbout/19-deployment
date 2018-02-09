'use strict';

const Auth = require('../../model/auth'); 
const debug = require('debug')('http:Auth-unit-test');

describe('NOTE unit testing', function() {
  describe('Test object', function() {
    beforeAll(() => {
      this.password = 'cattywampus';
      this.mockItem = {username: 'Matilda', email: 'biscut@gravy.com'};
      this.auth = new Auth(this.mockItem);
      return this.auth.createHashedpassword(this.password)
        .then(() => {
          this.auth.save();
          debug('post save auth', this.auth);
          return;
        })
        .then(() => this.auth.createToken())
        .then(jwt => this.token = jwt)
        .catch(console.err);
    }); 

    afterAll(() => {
      Auth.remove();
    });
    
    it('should be an object', () => {
      debug('Auth',this.auth);
      debug('jwt:', this.token);
      expect (this.auth).toBeInstanceOf(Object);
    });
    it('should have a uuid', () => {
      expect (this.auth.id).toMatch(/^[0-9a-fA-F]{24}$/);
    });
    it('should have a properties with values', () => {
      expect(this.auth.password).not.toBeNull();
      expect(this.auth.username).not.toBeNull();
      expect(this.auth.email).not.toBeNull();
    });

    it('should have a hashed password that does not match the original plain text password', () => {
      expect(this.auth.password).not.toEqual(this.password);
    });

    it('should return true when comparing hashed password to original with the comparePasswords method', () => {
      this.auth.comparePasswords(this.password)
        .then(valid => {
          expect(valid).toBe(true);
        });
    });
  }); 

  describe('Test object', function() {

    beforeEach(() => {
      this.password = 'cattywampus';
      this.mockItem = {username: 'Matilda', email: 'biscut@gravy.com'};
      this.auth = new Auth(this.mockItem);
    }); 
    afterEach(() => {
      Auth.remove();
    });

    it('Should create a hashed password', () => {
      return this.auth.createHashedpassword(this.password)
        .then(() => {
          debug('Hashed password', this.auth.password);
          expect(this.auth.password).not.toEqual(this.password);
          expect(this.auth.password).not.toBeNull();
        });
    });

    it('Should create a hashed token', () => {
      return this.auth.createHashedpassword(this.password)
        .then(() => {
          this.auth.save();
          return;
        })
        .then(() => this.auth.createToken())
        .then(jwt => {
          this.token = jwt;
          expect(this.token).not.toBeNull();
        });
    });

    it('Should create a compareHash', () => {
      return this.auth.createHashedpassword(this.password)
        .then(() => {
          this.auth.save();
          return;
        })
        .then(() => this.auth.createCompHash())
        .then(hash => {
          expect(hash).not.toBeNull();
        });
    });
  });

});