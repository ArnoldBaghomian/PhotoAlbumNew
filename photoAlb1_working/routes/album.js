var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Album = require('../models/album');
var authMiddleware = require('../config/auth.js');




router.get('/showAlbum/:id/:name/:desc', authMiddleware, function(req, res, next) {
  var albumId = req.params.id;
  var albumName = req.params.name;
  var albumDescription = req.params.desc;
  console.log('showalbum');

  res.render('showAlbum', {albumId: albumId, albumName:albumName, albumDescription:albumDescription});
});

router.get('/getalbums', authMiddleware, function(req, res, next) {

  var userMongoId = req.user._id;
  User.findById(userMongoId, function(err, userObject) {

    var albums = userObject.albums;
    res.send(albums);
  }).populate('albums');
});


router.post('/createalbum', authMiddleware, function(req, res, next) {
  var userMongoId = req.user._id;
  console.log('create album');
  User.findById(userMongoId, function(err, userObject) {  
    var album = new Album(req.body);
    album.save(function(err, savedAlbum) {
      userObject.albums.push(savedAlbum);
      userObject.save(function(err, savedUserObject) {
        res.send(savedUserObject);
      });    
    });
  });
});



router.delete('/:albumId/:albumIndex', authMiddleware,function(req, res, next) {
  console.log('inside delete album router file');
  var id = req.user._id;
  Album.findById(req.params.albumId, function(err, album) {
    User.findById(id, function(err, user){
      console.log('before remove', user.albums);
      user.albums.splice(req.params.albumIndex, 1);
      console.log('after remove', user.albums);

      user.save(function(err, data){
        album.remove(function(err){
          res.status(err ? 400:200).send(err||null);
          console.log('album REMOVED SUCCESSFULLY');
        });
      });
    });
  });
});

module.exports = router;




