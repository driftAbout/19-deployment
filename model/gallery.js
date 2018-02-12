'use strict';

const mongoose = require('mongoose');

const Gallery = mongoose.Schema({ 
  title: {type: String, required:true, unique: true }, 
  description: {type: String, required: true },  
  user_id: {type: mongoose.Schema.Types.ObjectId , required: true, ref: 'auth'},
},
{timestamps: true}
);

module.exports = mongoose.model('galleries', Gallery);