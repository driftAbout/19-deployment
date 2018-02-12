'use strict';

//app dependencies
const express = require('express');
const debug = require('debug')('http:server');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const errorHandler = require('./error-handler');

//App setup
const app = express();
const router = express.Router() ;
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

debug('PORT', PORT, 'MONGODB_URI', MONGODB_URI);

app.use(cors());
app.use('/api/v1', router);
require('../route/route-auth')(router);
require('../route/route-photo')(router);
require('../route/route-gallery')(router);
app.use('/*', (req, res) => errorHandler(new Error('Path Error: Requested path not found'), res));


const server = module.exports = {};

server.start = () => {
  return new Promise((resolve, reject) => {
    if(server.isOn) return reject (new Error('Server Error: Server is already running.')); 
    server.isOn = true;
    mongoose.connect(MONGODB_URI);
    server.http = app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
    return resolve(server);
  });
};

server.stop = () => {
  return new Promise((resolve, reject) => {
    if(!server.isOn) return reject(new Error('Server Error: Server is already stopped.')); 
    server.isOn = false; 
    server.http.close(() => { 
      console.log('Server has stopped listening');
      setTimeout( function () {
        mongoose.disconnect(() => console.log('Mongoose connection closed'));
      }, 500);
    });
  });
};