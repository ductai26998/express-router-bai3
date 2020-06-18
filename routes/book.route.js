var express = require('express');
var router = express.Router();
const shortid = require('shortid');

var db = require('../db');

// our default array of dreams

// https://expressjs.com/en/starter/basic-routing.html
router.get("/", (request, response) => {
  response.render('books/index', {
    books: db.get('books').value()
  });
});

router.get('/search', (request, response) => {
  var q = request.query.q;
  var matchedBooks = db.get('books').value().filter(function(book) {
    return book.title.toLowerCase().indexOf(q.toLowerCase()) !== -1;
  });
  response.render('books/index', {
    books: matchedBooks
  });
});

router.get('/create', (request, response) => {
  response.render('books/create');
});

router.post('/create', (request, response) => {
  request.body.bookId = shortid.generate();
  db.get('books').push(request.body).write();
  response.redirect('/');
});

router.get("/:bookId/delete", (request, response) => {
  db.get('books').remove(request.params).write();
  response.redirect('/');
});

router.get('/:bookId/update', (request, response) => {
  response.render('books/update', {bookId: request.params.bookId});
});

router.post('/:bookId/update', (request, response) => {
  var bookId = request.params.bookId;
  db.get('books')
    .find({bookId: bookId})
    .assign({title: request.body.title})
    .write();
  response.redirect('/');
});


module.exports = router;
