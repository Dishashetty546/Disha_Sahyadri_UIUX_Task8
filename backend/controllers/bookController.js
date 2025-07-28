import Book from "../models/bookModel.js";
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: "Error fetching books" });
  }
};

export const addBook = async (req, res) => {
  try {
    const newBook = new Book(req.body);
    const savedBook = await newBook.save();
    req.app.get("io").emit("bookAdded", savedBook); // Real-time socket update
    res.status(201).json(savedBook);
  } catch (err) {
    res.status(500).json({ error: "Error adding book" });
  }
};

export const updateBook = async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    req.app.get("io").emit("bookUpdated", updatedBook); // Real-time socket update
    res.status(200).json(updatedBook);
  } catch (err) {
    res.status(500).json({ error: "Error updating book" });
  }
};
