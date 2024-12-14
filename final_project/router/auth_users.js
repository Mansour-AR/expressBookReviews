const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
 return !users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
  // Filter the users array for any user with the same username and password
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
});
// Return true if any valid user is found, otherwise false
if (validusers.length > 0) {
    return true;
} else {
    return false;
}
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    if (authenticatedUser(username, password)) {
        const accessToken = jwt.sign({ username }, "access", { expiresIn: "1h" });
        req.session.authorization = { accessToken, username };

        // Debug: Log session data after login
        console.log("Session after login:", req.session);

        return res.status(200).json({ message: "Login successful" });
    } else {
        return res.status(401).json({ message: "Invalid credentials" });
    }
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.reviews;
    const username = req.session.authorization?.username;

    // Check if the user is logged in
    if (!username) {
        return res.status(401).json({ message: "Unauthorized: Please log in to add a review." });
    }

    // Check if the review content is provided
    if (!review) {
        return res.status(400).json({ message: "Review content is required." });
    }

    // Find the book by ISBN
    const book = Object.values(books).find(book => book.isbn === isbn);

    // Check if the book exists in the database
    if (!book) {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
    }

    // Add or update the review for the book
    if (!book.reviews) {
        book.reviews = {}; // Initialize reviews object if it doesn't exist
    }

    book.reviews[username] = review; // Add or update the review

    return res.status(200).json({
        message: `Review for book with ISBN ${isbn} has been added/updated by user ${username}.`,
        reviews: book.reviews
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
