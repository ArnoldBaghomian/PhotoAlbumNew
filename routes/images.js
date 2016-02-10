'use strict';
//require('dotenv').config(); // Loads environment variables
var express = require('express');
var router = express.Router();

console.log(' routes images');
/*
console.log('aws username ', process.env.AWS_USERNAME);
console.log('aws AWS_ACCESS_KEY_ID ', process.env.AWS_ACCESS_KEY_ID);
console.log('aws AWS_SECRET_ACCESS_KEY ', process.env.AWS_SECRET_ACCESS_KEY);
console.log('aws AWS BUCKET ', process.env.AWS_BUCKET);
console.log('aws JWT SECRET ', process.env.JWT_SECRET);
console.log('aws MONGOLAB_URI ', process.env.MONGOLAB_URI);
*/


var authMiddleware = require('../config/auth.js');
var uuid = require('node-uuid');
var Firebase = require("firebase");
var Album = require('../models/album');
var User = require('../models/user');
var mongoose = require('mongoose');
var multer = require('multer');
var upload = multer({storage: multer.memoryStorage()});
var Image = require('../models/image');
var ref = new Firebase('https://arnoldportfolio.firebaseio.com/');
var AWS = require('aws-sdk');
var s3 = new AWS.S3();
require('dotenv').config();

router.get('/getalbumimages/:albumId', authMiddleware, function (req, res, next) {
    var albumMongoId = req.params.albumId;
    Album.findById(albumMongoId, function (err, album) {
        var userImagesArray = album.photos;
        res.send(userImagesArray);
    }).populate('photos');
});





router.post('/uploadimage/:albumId', upload.array('images'), function(req, res) {
    var albumId = req.params.albumId;
    console.log('images post');

    Image.uploadImage(req.files, function(err, imagesArray) {
        Image.albumUpdate(imagesArray, albumId, function(err, album) {
            console.log('images post upload');
            res.redirect('/album/showAlbum/' + req.params.albumId + '/' + album.name + '/' + album.description);
            //res.redirect('/albums/editshowdetailspage/' + albumId);
        });
    });

});




router.delete('/:imageId/:albumId/:imageIndex', function(req, res, next) {
    Image.findById(req.params.imageId, function(err, image) {
        var albumMongoId = req.params.albumId;
        Album.findById(albumMongoId, function(err, album){
            var userImagesArray = album.photos;
            album.photos.splice(req.params.imageIndex, 1);
            album.save(function(err, data){
                image.remove(function(err){
                    res.status(err ? 400:200).send(err||null);
                    console.log('image REMOVED SUCCESSFULLY');
                });
            });
        });
    });
});

router.get('/viewPhoto/:id', authMiddleware, function (req, res, next){
    Image.findById(req.params.id, function(err,image) {
        res.render('viewPhoto',{url:image.url});
    });
});


module.exports = router;