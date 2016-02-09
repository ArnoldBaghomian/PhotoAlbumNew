var express = require('express');
var router = express.Router();
var Album = require('../models/album');
var jwt = require('jwt-simple');


router.get('/', function(req, res, next) {
  console.log('HITTING albumsList');

  var token = req.cookies.mytoken;
  var info = jwt.decode(token, process.env.JWT_SECRET);
  
  Album.find({owner: info._id}, function(err, userAlbums){
  console.log('USER ALBUM', userAlbums);
  res.render('albumsList', {album: userAlbums});
  });
});



module.exports = router;