'use strict';

const server = require('../../lib/server');


describe('Server tests', function(){

  beforeAll(() => server.start());
  afterAll(() => server.stop());

  describe('Server errors', () => {

    it('Should throw error on re-server', () => {
      return server.start().catch((err) => {
        expect(err.message).toMatch(/running/i);
      });
    });

    it('Should throw error on stopping stopped server', () => {
      server.stop();
      return server.stop().catch((err) => {
        expect(err.message).toMatch(/stopped/i);
      });
    });
  });


});