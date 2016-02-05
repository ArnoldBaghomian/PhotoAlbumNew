'use strict';

var Firebase = require('firebase');
var express = require('express');
var router = express.Router();

var authMiddleware = require('../config/auth');

var User = require('../models/user');

var ref = new Firebase('https://arnoldportfolio.firebaseio.com/');

router.get('/logout', function(req, res, next) {
  res.clearCookie('mytoken').redirect('/');
});

router.get('/albumsList', function(req, res){
  res.render('albumsList');
});


router.post('/register', function(req, res, next) {
  ref.createUser(req.body, function(err, userData) {
    if(err) return res.status(400).send(err);
    console.log(userData)
    var user = {};
    user.uid = userData.uid;
    user.email = req.body.email
    console.log(user)
    User.create(user, function(err, savedUser) {
      console.log(err || savedUser)
      res.send(err || savedUser);
    });
  });
});

router.post('/login', function(req, res, next) {
  ref.authWithPassword(req.body, function(err, authData) {
    if(err) return res.status(400).send(err);
    console.log(authData.password);
    User.findOne({uid: authData.uid}, function(err, user) {
      if(err){
        console.log(err)
      }
      if(!user){
        console.log(user)
      }

      var token = user.generateToken();
      res.cookie('mytoken', token).send();
      
    });
  });
});



module.exports = router;
