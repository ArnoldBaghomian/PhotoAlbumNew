'use strict';

var mongoose = require('mongoose');
console.log('models images');

var Album = require('../models/album');
//var dotenv = require('dotenv').config('');

/*
console.log('aws username ', process.env.AWS_USERNAME);
console.log('aws AWS_ACCESS_KEY_ID ', process.env.AWS_ACCESS_KEY_ID);
console.log('aws AWS_SECRET_ACCESS_KEY ', process.env.AWS_SECRET_ACCESS_KEY);
console.log('aws AWS BUCKET ', process.env.AWS_BUCKET);
console.log('aws AWS URL ', process.env.AWS_URL);
console.log('aws JWT SECRET ', process.env.JWT_SECRET);
console.log('aws MONGOLAB_URI ', process.env.MONGOLAB_URI);
*/

var AWS = require('aws-sdk');
var s3 = new AWS.S3();
var mongoose = require('mongoose');
var uuid = require('node-uuid');
var multer = require('multer');
var async = require('async');
//require('dotenv').config();

var imageSchema = new mongoose.Schema({
    key: {type: String},
    url: {type: String},
    name: {type: String},
    description: {type: String},
});



imageSchema.statics.uploadImage = function (files, doneCallback) {
    async.map(files, imageUpload, doneCallback);
};




imageSchema.statics.albumUpdate = function (imagesArray, albumId, callback) {
    console.log('update album');
    Album.findById(albumId, function (err, album) {
        album.photos = album.photos.concat(imagesArray);
        album.save(function (err, savedAlbum) {
            if (err) return callback(err);
            callback(err, savedAlbum);
        });
    }); // Album.findById
    console.log('update album end');
}


function imageUpload(file, callback) {
    console.log('upload image');
    var filename = file.originalname;
    var imageBuffer = file.buffer;
    // $ : last , + : one or more
    var ext = filename.match(/\.\w+$/)[0] || '';
    var key = uuid.v1() + ext;// Guarantee a unique name. + ext to account for different types of files

    var imageObject = {
        Bucket: process.env.AWS_BUCKET,
        Key: key,
        Body: imageBuffer
    };


    s3.putObject(imageObject, function (err, data) {  // uploads to s3
        var url = process.env.AWS_URL + process.env.AWS_BUCKET + '/' + key;

        var image = new Image({
            key: key,
            url: url,
            name: filename
        });
        image.save(function (err, savedImage) { // save to MongoDb
            if (err) return callback(err);
            callback(null, savedImage);
        });
    });
    console.log('upload image end');
}




var Image = mongoose.model('Image', imageSchema);

module.exports = Image;
