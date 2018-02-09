'use strict';

const debug = require('debug')('http:server-test');
const server = require('../../lib/server');
const superagent = require('superagent');
require('jest');

describe('PUT Integration', function() {
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

    describe('PUT /api/v1/note/someid => update', () => {
      this.mock_data = {subject: 'goodbye', comment: 'Funkn-B'};
      beforeAll(() => {
        return superagent.put(`:4000/api/v1/note/${this.resPost.body.id}`)
          .send(this.mock_data)
          .then(res => this.put = res);       
      });
      beforeAll(() => {
        return superagent.get(`:4000/api/v1/note/${this.resPost.body.id}`)
          .then(res => this.putGet = res);       
      });

      it('should subject should be new', () => {
        debug('this.putGet.body', this.putGet.body);
        let body = JSON.parse(this.putGet.text);
        expect(body.subject).toEqual(this.mock_data.subject);
      });
      it('should return status code 204', () => {
        expect(this.put.status).toEqual(204);
      });
    });

  
  });

});