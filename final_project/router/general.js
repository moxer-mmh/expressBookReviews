const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
const booksArray = Object.values(books);
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
        return res.status(400).send("Username and password are required");
    }
  
    const userExists = users.find(user => user.username === username);
    if (userExists) {
        return res.status(409).send("Username already exists");
    }
  
    const newUser = { username, password };
    users.push(newUser);
  
    res.status(201).send(JSON.stringify({ message: "User registered successfully" }, null, 4));
});

// Task 10: Get the list of books available in the shop using async-await with Axios
public_users.get('/', async (req, res) => {
    try {
        const response = await axios.get('path/to/your/books/api');
        const books = response.data;

        if (!books.length) {
            return res.status(404).send('No books available');
        }
  
        res.status(200).send(JSON.stringify({ books }, null, 4));
    } catch (error) {
        res.status(500).send('Error fetching books');
    }
});

// Task 11: Get book details based on ISBN using async-await with Axios
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = parseInt(req.params.isbn); // Convert the ISBN to a number
    try {
        const response = await axios.get(`path/to/your/books/api/${isbn}`);
        const book = response.data;

        if (!book) {
            return res.status(404).send('Book not found');
        }

        res.status(200).send(JSON.stringify({ book }, null, 4));
    } catch (error) {
        res.status(500).send('Error fetching book details');
    }
});

// Task 12: Get book details based on Author using async-await with Axios
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
        const response = await axios.get(`path/to/your/books/api`);
        const books = response.data;
        const booksByAuthor = books.filter(book => book.author === author);

        if (!booksByAuthor.length) {
            return res.status(404).send('No books found by the author');
        }

        res.status(200).send(JSON.stringify({ books: booksByAuthor }, null, 4));
    } catch (error) {
        res.status(500).send('Error fetching books by author');
    }
});

// Task 13: Get book details based on Title using async-await with Axios
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title.toLowerCase();
    try {
        const response = await axios.get(`path/to/your/books/api`);
        const books = response.data;
        const booksByTitle = books.filter(book => book.title.toLowerCase().includes(title));

        if (!booksByTitle.length) {
            return res.status(404).send('No books found with the given title');
        }

        res.status(200).send(JSON.stringify({ books: booksByTitle }, null, 4));
    } catch (error) {
        res.status(500).send('Error fetching books by title');
    }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = parseInt(req.params.isbn);
    const book = books[isbn];
  
    if (!book) {
        return res.status(404).send('Book not found');
    }
  
    if (!book.reviews || Object.keys(book.reviews).length === 0) {
        return res.status(404).send('No reviews found for the book');
    }
  
    res.status(200).send(JSON.stringify({ reviews: book.reviews }, null, 4));
});

module.exports.general = public_users;
