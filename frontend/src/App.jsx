import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FolderTree from './components/FolderTree';
import SearchBar from './components/SearchBar';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';
import Settings from './components/Settings';
import { configManager } from './utils/configManager';
import { applyTheme } from './themes/themes';
import './App.css';

const API_BASE = 'http://localhost:5000/api';

function App() {
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState({});
  const [selectedNote, setSelectedNote] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [allTags, setAllTags] = useState([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // 加载所有笔记和文件夹
  useEffect(() => {
    loadNotes();
    loadFolders();
    loadTags();

    // 初始化主题
    const theme = configManager.getTheme();
    applyTheme(theme);
  }, []);

  const loadNotes = async () => {
    try {
      const response = await axios.get(`${API_BASE}/notes`);
      setNotes(response.data);
    } catch (err) {
      console.error('Error loading notes:', err);
    }
  };

  const loadFolders = async () => {
    try {
      const response = await axios.get(`${API_BASE}/notes/folders`);
      setFolders(response.data);
    } catch (err) {
      console.error('Error loading folders:', err);
    }
  };

  const loadTags = async () => {
    try {
      const response = await axios.get(`${API_BASE}/search/all-tags`);
      setAllTags(response.data);
    } catch (err) {
      console.error('Error loading tags:', err);
    }
  };

  const handleSearch = async (query, searchType) => {
    try {
      if (searchType === 'text') {
        const response = await axios.get(`${API_BASE}/search/text`, {
          params: { q: query }
        });
        setSearchResults(response.data);
      } else if (searchType === 'tag') {
        const response = await axios.get(`${API_BASE}/search/tags`, {
          params: { tag: query }
        });
        setSearchResults(response.data);
      }
    } catch (err) {
      console.error('Error searching:', err);
    }
  };

  const handleSelectFolder = (folder) => {
    setSelectedFolder(folder);
    setSearchResults(null);
    setSelectedNote(null);
  };

  const handleSelectNote = (note) => {
    setSelectedNote(note);
  };

  const handleSaveNote = async (noteData) => {
    try {
      if (noteData.id) {
        // Update existing note
        await axios.put(`${API_BASE}/notes/${noteData.id}`, {
          title: noteData.title,
          content: noteData.content,
          tags: noteData.tags
        });
      } else {
        // Create new note
        await axios.post(`${API_BASE}/notes`, {
          folder: selectedFolder,
          title: noteData.title,
          content: noteData.content,
          tags: noteData.tags
        });
      }
      loadNotes();
      loadFolders();
      loadTags();
    } catch (err) {
      console.error('Error saving note:', err);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await axios.delete(`${API_BASE}/notes/${noteId}`);
      loadNotes();
      loadFolders();
      setSelectedNote(null);
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  const displayNotes = searchResults || (selectedFolder ? notes.filter(n => n.folder === selectedFolder) : notes);

  return (
    <div className="app">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>笔记</h2>
          <button
            className="settings-icon-btn"
            onClick={() => setIsSettingsOpen(true)}
            title="设置"
          >
            ⚙️
          </button>
        </div>
        <SearchBar onSearch={handleSearch} tags={allTags} />
        <FolderTree folders={folders} onSelectFolder={handleSelectFolder} />
      </div>
      <div className="main-content">
        <div className="notes-panel">
          <NoteList notes={displayNotes} onSelectNote={handleSelectNote} selectedNote={selectedNote} />
        </div>
        <div className="editor-panel">
          {selectedNote ? (
            <NoteEditor
              note={selectedNote}
              onSave={handleSaveNote}
              onDelete={handleDeleteNote}
              allTags={allTags}
            />
          ) : (
            <div className="empty-state">选择或创建一个笔记</div>
          )}
        </div>
      </div>
      <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}

export default App;
