import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import "../style/BookList.css";

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const socket = io(BACKEND_URL);

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: "", author: "" });

  useEffect(() => {
    fetchBooks();

    socket.on("book-added", (book) => {
      setBooks((prevBooks) => [...prevBooks, book]);
    });

    socket.on("book-updated", (updatedBook) => {
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book._id === updatedBook._id ? updatedBook : book
        )
      );
    });

    return () => {
      socket.off("book-added");
      socket.off("book-updated");
    };
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/books`);
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BACKEND_URL}/books`, newBook);
      setNewBook({ title: "", author: "" });
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="heading">📚 Real-Time Book Manager</h1>

        <form onSubmit={handleAddBook} className="form">
          <input
            type="text"
            className="input"
            placeholder="Enter Book Title"
            value={newBook.title}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            required
          />
          <input
            type="text"
            className="input"
            placeholder="Enter Author Name"
            value={newBook.author}
            onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
            required
          />
          <button type="submit" className="btn">
            ➕ Add Book
          </button>
        </form>

        <div className="book-list">
          {books.map((book) => (
            <div key={book._id} className="book">
              <h2 className="book-title">{book.title}</h2>
              <p className="book-author">✍️ Author: {book.author}</p>
            </div>
          ))}
        </div>

        {books.length === 0 && (
          <p className="empty">📭 No books found. Start by adding one above!</p>
        )}
      </div>
    </div>
  );
}
