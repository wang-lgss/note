import React from 'react';
import './NoteList.css';

function NoteList({ notes, onSelectNote, selectedNote }) {
  return (
    <div className="note-list">
      <h3>笔记列表</h3>
      <div className="notes">
        {notes.length === 0 ? (
          <div className="empty">没有笔记</div>
        ) : (
          notes.map(note => (
            <div
              key={note.id}
              className={`note-item ${selectedNote?.id === note.id ? 'active' : ''}`}
              onClick={() => onSelectNote(note)}
            >
              <div className="note-title">{note.title}</div>
              <div className="note-meta">
                <span className="word-count">{note.wordCount} 字</span>
                <span className="update-time">
                  {new Date(note.updatedAt).toLocaleDateString()}
                </span>
              </div>
              {note.tags.length > 0 && (
                <div className="note-tags">
                  {note.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NoteList;
