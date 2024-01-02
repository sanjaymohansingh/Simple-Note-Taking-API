const Note = require("../models/noteModel");

// Create a new note
const createNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ error: "Title and content are required fields" });
    }

    const newNote = new Note({
      title,
      content,
    });

    const savedNote = await newNote.save();

    res.status(201).json(savedNote);
  } catch (error) {
    next(error);
  }
};

// Retrieve all notes
const getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find();
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

// Retrieve a single note by ID
const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

// Update the content of an existing note
const updateNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    // Validate if both title and content are missing
    if (!title && !content) {
      return res
        .status(400)
        .json({ error: "Title or content is required for update" });
    }

    const updateFields = {
      title: title || undefined,
      content: content || undefined,
      lastModifiedAt: new Date(),
    };

    // Find note by ID and update only the provided fields
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
};

// Delete a note from the database
const deleteNote = async (req, res, next) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);

    if (!deletedNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.status(200).json(deletedNote);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
};
