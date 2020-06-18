var express = require('express');
var router = express.Router();
const shortid = require('shortid');

var db = require('../db');

// https://expressjs.com/en/starter/basic-routing.html
router.get("/", (request, response) => {
  response.render('users/index', {
    users: db.get('users').value()
  });
});

router.get('/search', (request, response) => {
  var q = request.query.q;
  var matchedUsers = db.get('users').value().filter(function(user) {
    return user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
  });
  response.render('users/index', {
    users: matchedUsers
  });
});

router.get('/create', (request, response) => {
  response.render('users/create');
});

router.post('/create', (request, response) => {
  request.body.userId = shortid.generate();
  db.get('users').push(request.body).write();
  response.redirect('/users');
});

router.get("/:userId/delete", (request, response) => {
  // var id = request.params.id;
  db.get('users').remove(request.params).write();
  response.redirect('/users');
});

router.get('/:userId/update', (request, response) => {
  response.render('users/update', {userId: request.params.userId});
});

router.post('/:userId/update', (request, response) => {
  var userId = request.params.userId;
  db.get('users')
    .find({userId: userId})
    .assign({name: request.body.name})
    .write();
  response.redirect('/users');
});


module.exports = router;
