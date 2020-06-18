var express = require('express');
var router = express.Router();

var bookRoute = require('./book.route');
var userRoute = require('./user.route');

var db = require('../db');

router.get("/", (request, response) => {
  response.render('transactions/index', {
    transactions: db.get('transactions').value()
  });
});

router.get("/create", (request, response) => {
  response.render("transactions/create", {
    users: db.get('users').value(),
    books: db.get('books').value()
  })
});

router.post("/create", (request, response) => {
  
  db.get('transactions').push(request.body).write();
  response.redirect('/');
});

module.exports = router;