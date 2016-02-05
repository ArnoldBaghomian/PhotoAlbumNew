'use strict';
//require('dotenv').config(); // Loads environment variables
var express = require('express');
var router = express.Router();
var authMiddleware = require('../config/auth.js');
var uuid = require('node-uuid');
var Album = require('../models/album');
var User = require('../models/user');
var mongoose = require('mongoose');
var multer = require('multer');
var upload = multer({storage: multer.memoryStorage()});
var Image = require('../models/image');
var ref = new Firebase('https://arnoldportfolio.firebaseio.com/');
var AWS = require('aws-sdk');
var s3 = new AWS.S3();

router.get('/getalbumimages/:albumId', authMiddleware, function (req, res, next) {
    var albumMongoId = req.params.albumId;
    Album.findById(albumMongoId, function (err, album) {
        var userImagesArray = album.photos;
        res.send(userImagesArray);
    }).populate('photos');
});

router.post('/uploadimage/:albumId', upload.array('images'), function (req, res) {
    var albumId = req.params.albumId;
    async.each(req.files, function (file, cb) {


        var filename = req.file.originalname;
        var imageBuffer = req.file.buffer;

        var ext = filename.match(/\.\w+$/)[0] || '';
        var key = uuid.v1() + ext;  // Guarantee a unique name. + ext to account for different types of files
        var imageToUpload = {
            Bucket: process.env.AWS_BUCKET,
            Key: key,
            Body: imageBuffer
        };

        s3.putObject(imageToUpload, function (err, data) {  // uploads to s3
            var url = process.env.AWS_URL + process.env.AWS_BUCKET + '/' + key;

            var image = new Image({
                key: key,
                url: url,
                name: filename
            });

            image.save(function (err, image) { // save to MongoDb
                if (err) res.send(err);
                Album.findById(albumId, function (err, album) {
                    album.photos.push(image);
                    album.save(function (err, data) {
                        if (err) res.send(err)
                        res.send('image saved');
                    });
                });
            });
        });


    });
});


module.exports = router;