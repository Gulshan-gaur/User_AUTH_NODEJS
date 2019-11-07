var express = require('express');
var routes = express.Router();

var loggedin = function (req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect('/login')
  }
}

/* GET home page. */
routes.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});


routes.get('/login', function (req, res, next) {
  //res.render('login');
  res.send("hi there")
});


routes.get('/signup', function (req, res, next) {
  res.render('signup');
});


routes.get('/profile', loggedin, function (req, res, next) {
  res.render('profile', {
    user: req.user
  })
});


routes.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/')
})
module.exports = routes;