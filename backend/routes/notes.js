const express = require('express');
const router = express.Router();
const fs = require('../middleware/fileSystem');

// 获取所有笔记
router.get('/', async (req, res) => {
  try {
    const notes = await fs.getAllNotes();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 获取文件夹结构
router.get('/folders', async (req, res) => {
  try {
    const structure = await fs.getFolderStructure();
    res.json(structure);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 获取单个笔记
router.get('/:id', async (req, res) => {
  try {
    const note = await fs.getNote(req.params.id);
    res.json(note);
  } catch (err) {
    res.status(404).json({ error: 'Note not found' });
  }
});

// 创建笔记
router.post('/', async (req, res) => {
  try {
    const { folder, title, content, tags } = req.body;
    const note = await fs.createNote(folder, title, content, tags);
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 更新笔记
router.put('/:id', async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const note = await fs.updateNote(req.params.id, title, content, tags);
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 删除笔记
router.delete('/:id', async (req, res) => {
  try {
    await fs.deleteNote(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
