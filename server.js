const express = require('express');
const mongoose = require('mongoose');
const Note = require('./models/note');

const DB_URL = process.env.DB_URL || "mongodb+srv://mhmmdshaikh10_db_user:lkxZEYIDaBCFfjYn@cluster0.lab83ws.mongodb.net/notes-db?retryWrites=true&w=majority";
const PORT = process.env.PORT || 8081;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Welcome route
app.get('/', (req, res) => {
    res.send("<h1>Welcome to Note taking application - Week06 Exercise</h1>");
});

// 1. GET all notes
app.get('/api/notes', async (req, res) => {
    try {
        const notes = await Note.find();
        res.status(200).json(notes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. GET a single note by ID
app.get('/api/notes/:id', async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.status(200).json(note);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. POST (Create) a new note
app.post('/api/notes', async (req, res) => {
    try {
        const { noteTitle, noteDescription, priority } = req.body;
        const newNote = new Note({
            noteTitle,
            noteDescription,
            priority
        });
        const savedNote = await newNote.save();
        res.status(201).json(savedNote);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 4. PUT (Update) an existing note
app.put('/api/notes/:id', async (req, res) => {
    try {
        const { noteTitle, noteDescription, priority } = req.body;
        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            { noteTitle, noteDescription, priority },
            { new: true, runValidators: true }
        );
        if (!updatedNote) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.status(200).json(updatedNote);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 5. DELETE a note
app.delete('/api/notes/:id', async (req, res) => {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        if (!deletedNote) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.status(200).json({ message: "Note deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Connect to the database and start the server
mongoose.connect(DB_URL)
    .then(() => {
        console.log("Successfully connected to MongoDB Atlas");
        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        });
    })
    .catch(err => {
        console.log('Could not connect to the database. Exiting now...', err);
        process.exit();
    });
