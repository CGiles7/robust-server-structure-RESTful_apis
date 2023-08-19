const express = require("express");
const app = express();

const notes = require("./data/notes-data");
app.use(express.json());

// GET /notes/:noteId
app.get("/notes/:noteId", (req, res) => {
  const noteId = Number(req.params.noteId);
  const foundNote = notes.find((note) => note.id === noteId);
  if (!foundNote) {
    return res.status(404).json({ error: `Note id not found: ${noteId}` });
  }
  res.json({ data: foundNote });
});

// GET /notes
app.get("/notes", (req, res) => {
  res.json({ data: notes });
});

// POST /notes
let lastNoteId = notes.length > 0 ? Math.max(...notes.map((note) => note.id)) : 0;

app.post("/notes", (req, res) => {
  const { data: { text } = {} } = req.body;
  if (text) {
    const newNote = {
      id: ++lastNoteId,
      text,
    };
    notes.push(newNote);
    res.status(201).json({ data: newNote });
  } else {
    res.sendStatus(400);
  }
});

// Not found handler
app.use((req, res, next) => {
  res.status(404).json({ error: `Not found: ${req.originalUrl}` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

module.exports = app;
