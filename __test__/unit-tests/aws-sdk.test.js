'use strict'

const aws3 = require('../../lib/aws-sdk');
const server = require('../../lib/server');
const mock = require('../lib/mock');
const superagent = require('superagent');
const debug = require('debug')('http:aws-sdk-test');

debug('aws-sdk');

describe('aws unit test', () => {
  beforeAll(() => server.start(process.env.PORT), () => console.log(process.env.PORT));
  afterAll(() => server.stop());
  afterAll(mock.removeUsers);
  afterAll(mock.removeGalleries);

  beforeAll(() => {
    return  mock.photo.create_photo() 
      .then(photo_data => {
        debug('photo_data', photo_data);
        this.photo_data = photo_data;
      })
      .catch(err => debug('err', err));
  });
  describe('upload valid  input', () => {
    beforeAll(() => {
      return superagent.get(this.photo_data.photo.image_url)
        .then(res => this.res = res)
        .catch(err => debug('err', err));
    });
  

    it('Should exist in aws', () => {
      expect(this.res.status).toBe(200);
    });

  });

  describe('upload', () => {
    beforeAll(() => {
      let params = {
        Bucket: process.env.AWS_BUCKET,
        Key: this.photo_data.photo.cloud_key,
      };

      return aws3.deleteProm(params)
        .catch(err => debug('ERR', err));
    });

    beforeAll(() => {
      return superagent.get(this.photo_data.photo.image_url)
        .then(res => this.delRes = res)
        .catch(err =>  this.err = err);
    });
  

    it('Should exist in aws', () => {
      expect(this.err.status).toBe(403);
    });

  });

  describe('upload invalid  input', () => {
    beforeAll(() => {
      return aws3.deleteProm()
        .catch(err => this.delErr = err);
    });

    beforeAll(() => {
      return aws3.uploadProm()
        .catch(err => this.upErr = err);
    });

   
    it('Should throw an error for undefined params', () => {
      expect(this.delErr.toString()).toMatch(/MissingRequiredParameter/i);
    });

    it('Should throw an error for undefined params', () => {
      expect(this.upErr.toString()).toMatch(/params/);
    });
  });

});
