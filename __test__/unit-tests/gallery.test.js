'use strict';

const Gallery = require('../../model/gallery'); 
const mock = require('../lib/mock');
const debug = require('debug')('http:Auth-unit-test');
const server = require('../../lib/server');
//const Auth = require('../../model/Auth'); 

describe('Gallery unit testing', function() {
  beforeAll(() => server.start());
  afterAll(() => server.stop());

  describe('Test object', function() {
  
    beforeAll(() => {
      return mock.gallery.new_gallery_data()
        .then(gallery_data => { 
          this.gallery_data = gallery_data ;
          let user_id = this.gallery_data.user_data.user._id;
          let gallery_title = this.gallery_data.title;
          let gallery_description = this.gallery_data.description;
          this.user_token = this.gallery_data.user_data.user_token;
          let gallery_obj = {title: gallery_title, description: gallery_description, user_id: user_id};
          debug('gallery_obj', gallery_obj );
          return gallery_obj; 
        })
        .then(gallery_obj => new Gallery(gallery_obj).save()) 
        .then(gallery => {
          debug('Gallery', gallery);
          return this.gallery = gallery;
        });
    });

    afterAll(() => mock.removeGalleries());   
    afterAll(() => mock.removeUsers());
    
    it('should be an object', () => {
      debug('Gallery',this.gallery);
      expect (this.gallery).toBeInstanceOf(Object);
    });

    it('should have an _id', () => {
      expect (this.gallery._id.toString()).toMatch(/^[0-9a-fA-F]{24}$/);
    });

    it('should have an _id', () => {
      expect (this.gallery.user_id).toEqual(this.gallery_data.user_data.user._id);
    });

    it('should have properties with values', () => {
      expect(this.gallery.title).not.toBeNull();
      expect(this.gallery.description).not.toBeNull();
      expect(this.gallery.user_id).not.toBeNull();
    });
  });
});