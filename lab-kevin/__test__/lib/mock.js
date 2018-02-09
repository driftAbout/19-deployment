'use strict';

const faker = require('faker');
const Auth = require('../../model/auth');
const Gallery = require('../../model/gallery');
const Photo = require('../../model/photo');
const tempDir = `${__dirname}/../temp`;
const tempProdDir = `${__dirname}/../../temp`;
const debug = require('debug')('http:mock');
const uuid = require('uuid/v4');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'), {suffix: 'Prom'});

debug('mocks');

const mock = module.exports = {};

mock.auth = {};
mock.gallery = {};
mock.photo = {};

mock.user = {
  username: `${faker.name.prefix()}${faker.hacker.adjective()}`.replace(/[.\s]/, ''),
  email: `${faker.internet.email()}`,
  password:`${faker.hacker.adjective()}${faker.hacker.noun()}`.replace(/[.\s]/, ''),
};

mock.auth.createUser = () => {
  let auth_data = {};
  auth_data.password = mock.user.password;
  let newUser = Auth({username: mock.user.username, email: mock.user.email});
  return newUser.createHashedpassword(auth_data.password)
    .then(() => newUser.save())
    .then(() => newUser.createToken())
    .then(token =>{
      auth_data.user = newUser;
      auth_data.user_token = token;
      return auth_data;
    })
    .catch(console.err);
};

mock.removeUsers = () => Promise.all([Auth.remove()]); 
mock.removeGalleries = () => Promise.all([Gallery.remove()]);
mock.removePhotos = () => Promise.all([Photo.remove()]);


mock.gallery.new_gallery_data = () => {
  let newGallery_data = {};
  newGallery_data.title = `${faker.hacker.adjective()} ${faker.random.locale()}`;
  newGallery_data.description = `${faker.company.catchPhraseDescriptor()}`;
  return mock.auth.createUser()
    .then(user_data => {
      newGallery_data.user_data = user_data;
      return newGallery_data;
    });
};  

mock.gallery.create_gallery = () => {
  let new_gallery = {};
  return mock.gallery.new_gallery_data()
    .then(gallery_data => {
      new_gallery.user_data = gallery_data.user_data;
      let gallery_obj = {title: gallery_data.title, description: gallery_data.description, user_id: gallery_data.user_data.user._id};
      return gallery_obj;
    })
    .then(gallery_obj => new Gallery(gallery_obj).save())
    .then(gallery => {
      new_gallery.gallery = gallery;
      return new_gallery;
    })
    .catch(console.error);
};


mock.photo.create_photo = () => {
  let reqPhoto = {};
  return mock.photo.photo_data()
    .then(photo_data => {
      let uuid_name = uuid();
      reqPhoto.user = {_id: photo_data.user_id.toString()},
      reqPhoto.file =  {
        filename: uuid_name,
        path: `${tempProdDir}/${uuid_name}`,
        originalname: photo_data.file.split('/').slice(-1).join(''),
      };
      reqPhoto.body = {
        name: photo_data.name,
        description: photo_data.description,
        gallery_id: photo_data.gallery_id,
      };
      return photo_data;
    })
    .then(photo_data => {
      debug('reqPhoto', reqPhoto);
      return fs.copyFileProm(photo_data.file, reqPhoto.file.path);
    })
    .then(() => reqPhoto);
};

// req.file.path
// req.file.originalname
// req.file.filename
// req.body.description
// req.body.gallery_id,

mock.photo.photo_data = () => {
  return mock.gallery.create_gallery()
    .then(new_gallery => {
      let photo_data = {
        name: `${faker.hacker.noun()}`,
        description: `${faker.hacker.adjective()}${faker.hacker.noun()}`,
        user_id: new_gallery.user_data.user._id,
        gallery_id: new_gallery.gallery._id.toString(),
        file: `${tempDir}/${uuid()}.jpg`,
      };
      photo_data.user_data = new_gallery.user_data;
      return mock.photo.write_photo(photo_data);
    })
    .catch(err => err);

};

mock.photo.write_photo = (data) => {
  let file = data.file;
  return fs.writeFileProm(file, file)
    .then(() => data)
    .catch(err => err);
};
