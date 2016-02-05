var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Album = require('../models/album');
var authMiddleware = require('../config/auth.js');


router.get('/showAlbum/:albumId', authMiddleware, function(req, res, next) {
  var albumMongoId = req.params.albumId; //req.user._id;
  console.log('album mongo id is:', albumMongoId);
  res.render('showAlbum', {albumId: albumMongoId});
});


router.get('/getalbums', authMiddleware, function(req, res, next) {
  var userMongoId = req.user._id;
  User.findById(userMongoId, function(err, userObject) {
    var userAlbumsArray = userObject.albumsArray;
    res.send(userAlbumsArray);
  }).populate('albumsArray');
});


router.post('/createalbum', authMiddleware, function(req, res, next) {
  var userMongoId = req.user._id;
  User.findById(userMongoId, function(err, userObject) {  
    var album = new Album(req.body);
    album.save(function(err, savedAlbum) {
      userObject.albumsArray.push(savedAlbum);
      userObject.save(function(err, savedUserObject) {
        res.send(savedUserObject);
      });    
    });
  });
});


router.delete('/:itemId', function(req, res, next) {  
  Album.findById(req.params.itemId, function(err, album) {
    album.remove(function(err){
      if(!err) console.log('album removed successfully');
      res.status(err ? 400:200).send(err||null);
    });
  });
});

module.exports = router;




