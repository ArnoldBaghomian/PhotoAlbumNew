var express = require('express');
var router = express.Router();
var Album = require('../models/album');
var jwt = require('jwt-simple');
// var authMiddleware = require('../config/auth');

// router.use(authMiddleware);

/* GET home page. */

console.log("IM REQUIRED")
router.get('/', function(req, res, next) {
  console.log("IN THE GET FUNCTION")

  res.render('addAlbum');
});

router.post('/', function(req, res, next) {
  console.log(req.cookies.mytoken)
  var info = jwt.decode(req.cookies.mytoken, process.env.JWT_SECRET);
  console.log(info);
  var album = new Album(req.body);
  album.owner = info._id;
  album.save(function(err, savedAlbum){
    console.log(savedAlbum || err)
    res.send(savedAlbum);
  }); 
});


module.exports = router;