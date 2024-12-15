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

// Promise to get the book list available in the shop
function getBooks() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(books);
      }, 1000);
    });
  }
// Get the book list available in the shop
public_users.get('/',function (req, res) {
    getBooks()
    .then((bookList) => {
      res.send(JSON.stringify(bookList, null, 4));
    })
    .catch((error) => {
      res.status(500).send("Error fetching books");
    });
});

//Promise to get book details based on ISBN
function getBookByISBN(isbn) {
    return new Promise((resolve, reject) => {
      const booksArray = Object.values(books);
      const filteredBooks = booksArray.filter((book) => book.isbn === isbn);
      setTimeout(() => {
        if (filteredBooks.length > 0) {
          resolve(filteredBooks); 
        } else {
          reject("Book not found"); 
        }
      }, 1000); 
    });
  }

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const ISBN = req.params.isbn;
    const booksArray = Object.values(books);
    let filtered_books = booksArray.filter((book) => book.isbn === ISBN);
    if (filtered_books.length > 0) {
        res.send(filtered_books);
    } else {
        res.status(404).send({ message: "Book not found" });
    }
 });

//Promise to get book details based on author
 function getBooksByAuthor(author) {
    return new Promise((resolve, reject) => {
      const booksArray = Object.values(books);
      const filteredBooks = booksArray.filter((book) => book.author === author);
      setTimeout(() => {
        if (filteredBooks.length > 0) {
          resolve(filteredBooks); 
        } else {
          reject("Book not found"); 
        }
      }, 1000); 
    });
  }
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    getBooksByAuthor(author)
      .then((filteredBooks) => {
        res.send(filteredBooks); 
      })
      .catch((error) => {
        res.status(404).send({ message: error });
      });
});
//Promise to get all books based on title
function getBooksByTitle(title) {
    return new Promise((resolve, reject) => {
      const booksArray = Object.values(books);
      const filteredBooks = booksArray.filter((book) => book.title === title);
      setTimeout(() => {
        if (filteredBooks.length > 0) {
          resolve(filteredBooks); 
        } else {
          reject("Book not found");
        }
      }, 1000);
    });
  }
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    getBooksByTitle(title)
      .then((filteredBooks) => {
        res.send(filteredBooks); 
      })
      .catch((error) => {
        res.status(404).send({ message: error }); 
      });
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
