const express = require('express');
const router = express.Router();
const fs = require('../middleware/fileSystem');

// 全文搜索
router.get('/text', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    const notes = await fs.getAllNotes();
    const searchTerm = q.toLowerCase();
    const results = notes.filter(note =>
      note.title.toLowerCase().includes(searchTerm) ||
      note.content.toLowerCase().includes(searchTerm)
    );

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 按标签搜索
router.get('/tags', async (req, res) => {
  try {
    const { tag } = req.query;
    if (!tag) {
      return res.status(400).json({ error: 'Query parameter "tag" is required' });
    }

    const notes = await fs.getAllNotes();
    const results = notes.filter(note =>
      note.tags.includes(tag)
    );

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 获取所有标签
router.get('/all-tags', async (req, res) => {
  try {
    const notes = await fs.getAllNotes();
    const tags = new Set();
    notes.forEach(note => {
      note.tags.forEach(tag => tags.add(tag));
    });

    res.json(Array.from(tags));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
