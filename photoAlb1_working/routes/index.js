var express = require('express');
var router = express.Router();


var authMiddleware = require('../config/auth');



router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/', function(req, res, next) {
  res.render('index', { title: "Kempton Photo Album" });
});

router.get('/secret', authMiddleware, function(req, res, next) {
  console.log('req.user:', req.user);
  res.send('Wooo!  Secret stuff!!!');
});

router.get('/register', function(req, res, next) {
  res.render('register');
});

module.exports = router;
