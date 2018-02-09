'use strict';

const debug = require('debug')('http:server-test');
const server = require('../../lib/server');
const superagent = require('superagent');
require('jest');

describe('DELETE Integration', function() {
  beforeAll(() => server.start(process.env.PORT), () => console.log(process.env.PORT));
  afterAll(() => server.stop());
  
  describe('Valid requests', () => {

    beforeAll(()=> {
      return  superagent.post(':4000/api/v1/note')
        .send({subject: 'hello', comment: 'Funkn-A'})
        .then( res => {
          this.resPost = res;
        })
        .catch(err => {
          debug('superagent error ', err);
        });
    });

    describe('DELETE /api/v1/note/someid => whack', () => {
      
      beforeAll(() => {
        return superagent.delete(`:4000/api/v1/note/${this.resPost.body.id}`)
          .then(res => this.deleteRes = res);       
      });
      beforeAll(() => {
        return superagent.get(`:4000/api/v1/note/${this.resPost.body.id}`)
          .catch(err => this.deleteGet = err);       
      });

      it('should return status 404', () => {
        debug('this.deleteGet.body', this.deleteGet.status);
        expect(this.deleteGet.status).toEqual(404);
      });
      it('should return status code 204', () => {
        expect(this.deleteRes.status).toEqual(204);
      });
    });
  });

});