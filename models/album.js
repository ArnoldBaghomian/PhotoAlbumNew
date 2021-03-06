'use strict';

var mongoose = require('mongoose');

var albumSchema = new mongoose.Schema({
  name:{type:String},
  description:{type:String},
  photos:[{type: mongoose.Schema.Types.ObjectId, ref: "Image"}]
});

var Album = mongoose.model('Album', albumSchema);

module.exports = Album;
