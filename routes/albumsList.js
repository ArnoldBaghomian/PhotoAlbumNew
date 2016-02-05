var express = require('express');
var router = express.Router();
var Album = require('../models/album');
var jwt = require('jwt-simple');

// var authMiddleware = require('../config/auth');

// router.use(authMiddleware);

/* GET home page. */
router.get('/', function(req, res, next) {
  var token = req.cookies.mytoken;
  var info = jwt.decode(token, process.env.JWT_SECRET);
  Album.find({owner: info._id}, function(err, userAlbums){
  console.log(userAlbums);
  res.render('albumsList', {album: userAlbums});
  });
});



module.exports = router;