const fs = require('fs').promises;
const path = require('path');
const matter = require('gray-matter');

const NOTES_DIR = path.join(__dirname, '../../notes');

// 确保笔记目录存在
async function ensureNotesDir() {
  try {
    await fs.mkdir(NOTES_DIR, { recursive: true });
  } catch (err) {
    console.error('Error creating notes directory:', err);
  }
}

// 获取所有笔记
async function getAllNotes() {
  await ensureNotesDir();
  const notes = [];

  async function walkDir(dir, relativePath = '') {
    const files = await fs.readdir(dir, { withFileTypes: true });

    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      const relPath = path.join(relativePath, file.name);

      if (file.isDirectory()) {
        await walkDir(fullPath, relPath);
      } else if (file.name.endsWith('.md')) {
        const content = await fs.readFile(fullPath, 'utf-8');
        const { data, content: body } = matter(content);
        notes.push({
          id: relPath.replace(/\\/g, '/').replace('.md', ''),
          title: data.title || file.name.replace('.md', ''),
          path: relPath.replace(/\\/g, '/'),
          folder: relativePath.replace(/\\/g, '/'),
          content: body,
          tags: data.tags || [],
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString(),
          wordCount: body.split(/\s+/).length
        });
      }
    }
  }

  await walkDir(NOTES_DIR);
  return notes;
}

// 获取文件夹结构
async function getFolderStructure() {
  await ensureNotesDir();
  const structure = {};

  async function walkDir(dir, obj) {
    const files = await fs.readdir(dir, { withFileTypes: true });

    for (const file of files) {
      const fullPath = path.join(dir, file.name);

      if (file.isDirectory()) {
        obj[file.name] = {};
        await walkDir(fullPath, obj[file.name]);
      } else if (file.name.endsWith('.md')) {
        if (!obj._files) obj._files = [];
        obj._files.push(file.name.replace('.md', ''));
      }
    }
  }

  await walkDir(NOTES_DIR, structure);
  return structure;
}

// 创建笔记
async function createNote(folder, title, content, tags = []) {
  await ensureNotesDir();
  const folderPath = path.join(NOTES_DIR, folder);
  await fs.mkdir(folderPath, { recursive: true });

  const fileName = `${title.replace(/[/\\?%*:|"<>]/g, '_')}.md`;
  const filePath = path.join(folderPath, fileName);

  const now = new Date().toISOString();
  const frontmatter = `---
title: ${title}
tags: [${tags.map(t => `"${t}"`).join(', ')}]
createdAt: ${now}
updatedAt: ${now}
---

${content}`;

  await fs.writeFile(filePath, frontmatter, 'utf-8');
  return {
    id: path.join(folder, fileName.replace('.md', '')).replace(/\\/g, '/'),
    title,
    path: path.join(folder, fileName).replace(/\\/g, '/'),
    folder,
    content,
    tags,
    createdAt: now,
    updatedAt: now,
    wordCount: content.split(/\s+/).length
  };
}

// 更新笔记
async function updateNote(notePath, title, content, tags = []) {
  const filePath = path.join(NOTES_DIR, notePath + '.md');
  const now = new Date().toISOString();

  const frontmatter = `---
title: ${title}
tags: [${tags.map(t => `"${t}"`).join(', ')}]
updatedAt: ${now}
---

${content}`;

  await fs.writeFile(filePath, frontmatter, 'utf-8');
  return {
    id: notePath,
    title,
    path: notePath + '.md',
    content,
    tags,
    updatedAt: now,
    wordCount: content.split(/\s+/).length
  };
}

// 删除笔记
async function deleteNote(notePath) {
  const filePath = path.join(NOTES_DIR, notePath + '.md');
  await fs.unlink(filePath);
}

// 获取单个笔记
async function getNote(notePath) {
  const filePath = path.join(NOTES_DIR, notePath + '.md');
  const content = await fs.readFile(filePath, 'utf-8');
  const { data, content: body } = matter(content);

  return {
    id: notePath,
    title: data.title || path.basename(notePath),
    path: notePath,
    content: body,
    tags: data.tags || [],
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    wordCount: body.split(/\s+/).length
  };
}

module.exports = {
  getAllNotes,
  getFolderStructure,
  createNote,
  updateNote,
  deleteNote,
  getNote,
  ensureNotesDir
};
