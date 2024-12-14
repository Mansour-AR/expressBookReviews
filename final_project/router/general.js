const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
   const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // Send JSON response with formatted books data
   res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  // Extract the ISBN parameter from the request URL
    const ISBN = req.params.isbn;
    const booksArray = Object.values(books);
    // Filter the users array to find books whose ISBN matches the extracted ISBN parameter
    let filtered_books = booksArray.filter((book) => book.isbn === ISBN);
    // First check whether Book exitst or not and Send the filtered_books array as the response to the client
    if (filtered_books.length > 0) {
        res.send(filtered_books);
    } else {
        res.status(404).send({ message: "Book not found" });
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
   // Extract the author parameter from the request URL
     const author = req.params.author;
     const booksArray = Object.values(books);
     // Filter the users array to find books whose author matches the extracted author parameter
     let filtered_books = booksArray.filter((book) => book.author === author);
     // First check whether Book exitst or not and Send the filtered_books array as the response to the client
     if (filtered_books.length > 0) {
         res.send(filtered_books);
     } else {
         res.status(404).send({ message: "Book not found" });
     }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
   // Extract the title parameter from the request URL
  const title = req.params.title;
  const booksArray = Object.values(books);
  // Filter the books array to find users whose title matches the extracted title parameter
  let filtered_books = booksArray.filter((book) => book.title === title);
  // First check whether Book exitst or not and Send the filtered_books array as the response to the client
  if (filtered_books.length > 0) {
      res.send(filtered_books);
  } else {
      res.status(404).send({ message: "Book not found" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
      const ISBN = req.params.isbn;
    // Convert books object to an array
    const booksArray = Object.values(books);
    // Find the book by ISBN
    let filtered_books = booksArray.find((book) => book.isbn === ISBN);
    // First check whether Book exitst or not and Send the filtered_books array as the response to the client
    if (filtered_books) {
        res.send({ reviews: filtered_books.reviews });
    } else {
        res.status(404).send({ message: "Book Review not found" });
    }
});

module.exports.general = public_users;
