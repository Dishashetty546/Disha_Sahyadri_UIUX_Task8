const express = require("express");
const Book = require("../models/bookModel.js");
const router = express.Router();

router.get("/", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

// Add a book
router.post("/", async (req, res) => {
  try {
    const newBook = await Book.create(req.body);
    res.status(201).json(newBook);

    const io = req.app.get("io");
    io.emit("book-added", newBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a book
router.put("/:id", async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedBook);

    const io = req.app.get("io");
    io.emit("book-updated", updatedBook); // Real-time event
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a book
router.delete("/:id", async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Book deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
