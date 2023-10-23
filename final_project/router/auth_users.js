const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = []

const doesExist = (username) => {
    let usersWithSameName = users.filter((user) => {
        return user.username === username;
    });
    return usersWithSameName.length > 0;
}

const authenticatedUser = (username, password) => {
    // Write code to check if username and password match the one we have in records.
    // For example, check against a database of registered users
    // Return true if authenticated, false otherwise
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    // Check if the user is registered and the password is correct
    if (authenticatedUser(username, password)) {
        // Generate a JWT token for authentication
        const token = jwt.sign({ username }, 'your_secret_key'); // Replace 'your_secret_key' with a secret key for signing the token

        return res.status(200).json({ message: 'Login successful.', token });
    } else {
        return res.status(401).json({ error: 'Invalid username or password.' });
    }
});

// Add a book review for authenticated users
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;

    // Check if the user is authenticated (you can verify the JWT token here)
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized. Please log in to add a review.' });
    }

    jwt.verify(token, 'your_secret_key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized. Invalid token.' });
        }

        const { username } = decoded;
        // Check if the book with the provided ISBN exists in your database
        if (books[isbn]) {
            // Add the review to the book's reviews array
            books[isbn].reviews.push({ username, review });
            return res.status(200).json({ message: 'Review added successfully.' });
        } else {
            return res.status(404).json({ error: 'Book not found.' });
        }
    });
});

module.exports.authenticated = regd_users;
module.exports.doesExist = doesExist;
module.exports.users = users;
