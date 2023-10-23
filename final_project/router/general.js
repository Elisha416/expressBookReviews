const express = require('express');
const http = require('http');
const { isValid, users } = require("./auth_users.js");
const public_users = express.Router();

// Registration Route
public_users.post("/register", (req, res) => {
  // Implement user registration logic here
  return res.status(200).json({ message: "User registered successfully" });
});

// Helper function to make HTTP requests using promises
function makeHttpRequest(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (response) => {
      let data = '';

      // A chunk of data has been received
      response.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received
      response.on('end', () => {
        resolve(JSON.parse(data));
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

// GET Routes for Books
public_users.get('/', async function (req, res) {
  try {
    const books = await makeHttpRequest('http://localhost:5000/books');
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const book = await makeHttpRequest(`http://localhost:5000/books/${isbn}`);
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const books = await makeHttpRequest(`http://localhost:5000/books?author=${author}`);
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const books = await makeHttpRequest(`http://localhost:5000/books?title=${title}`);
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book && book.reviews) {
    const reviews = book.reviews;
    res.send(reviews);
  } else {
    res.status(404).json({ error: 'Book not found or no reviews available.' });
  }
});

module.exports.general = public_users;
