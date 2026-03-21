const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs').promises;
const notesRouter = require('./routes/notes');
const searchRouter = require('./routes/search');
const aiRouter = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 5000;
const NOTES_DIR = path.join(__dirname, '../notes');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/notes', notesRouter);
app.use('/api/search', searchRouter);
app.use('/api/ai', aiRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
