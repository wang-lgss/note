import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import { configManager } from '../utils/configManager';
import './NoteEditor.css';

function NoteEditor({ note, onSave, onDelete, allTags }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedText, setSelectedText] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags || []);
    }
  }, [note]);

  const handleSave = () => {
    onSave({
      id: note?.id,
      title,
      content,
      tags
    });
  };

  const handleDelete = () => {
    if (window.confirm('确定要删除这个笔记吗？')) {
      onDelete(note.id);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleAIComplete = async () => {
    // 获取 AI 配置
    const aiConfig = configManager.getAIConfig();

    if (!aiConfig.apiKey || !aiConfig.model || !aiConfig.endpoint) {
      alert('请先在设置中配置完整的 AI 信息（API 密钥、模型名称、API 端点）');
      return;
    }

    const textToComplete = selectedText || content;
    if (!textToComplete.trim()) {
      alert('请选择要补全的文本或确保笔记不为空');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/ai/complete', {
        text: textToComplete,
        provider: 'custom',
        apiKey: aiConfig.apiKey,
        model: aiConfig.model,
        endpoint: aiConfig.endpoint
      });

      const completedText = response.data.completed;
      if (selectedText) {
        // 替换选中的文本
        const start = content.indexOf(selectedText);
        const end = start + selectedText.length;
        setContent(
          content.substring(0, end) + '\n\n' + completedText + content.substring(end)
        );
      } else {
        // 追加到末尾
        setContent(content + '\n\n' + completedText);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      alert('AI 补全失败: ' + errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSelect = () => {
    const textarea = document.querySelector('.editor-textarea');
    if (textarea) {
      setSelectedText(textarea.value.substring(textarea.selectionStart, textarea.selectionEnd));
    }
  };

  return (
    <div className="note-editor">
      <div className="editor-header">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="笔记标题"
          className="editor-title"
        />
        <div className="editor-actions">
          <button onClick={handleSave} className="btn btn-save">保存</button>
          <button onClick={handleDelete} className="btn btn-delete">删除</button>
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="btn btn-preview"
          >
            {isPreview ? '编辑' : '预览'}
          </button>
        </div>
      </div>

      <div className="editor-tags">
        <div className="tag-list">
          {tags.map(tag => (
            <span key={tag} className="tag-item">
              {tag}
              <button onClick={() => handleRemoveTag(tag)} className="tag-remove">×</button>
            </span>
          ))}
        </div>
        <div className="tag-input-group">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            placeholder="添加标签..."
            className="tag-input"
            list="tag-suggestions"
          />
          <datalist id="tag-suggestions">
            {allTags.map(tag => (
              <option key={tag} value={tag} />
            ))}
          </datalist>
          <button onClick={handleAddTag} className="btn btn-add-tag">添加</button>
        </div>
      </div>

      <div className="editor-content">
        {isPreview ? (
          <div className="preview">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <div className="editor-input-group">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onMouseUp={handleTextSelect}
              onKeyUp={handleTextSelect}
              placeholder="输入笔记内容..."
              className="editor-textarea"
            />
            <button
              onClick={handleAIComplete}
              disabled={isLoading}
              className="btn btn-ai-complete"
            >
              {isLoading ? '补全中...' : 'AI 补全'}
            </button>
          </div>
        )}
      </div>

      <div className="editor-meta">
        <span>字数: {content.split(/\s+/).length}</span>
        <span>修改时间: {note?.updatedAt ? new Date(note.updatedAt).toLocaleString() : '新建'}</span>
      </div>
    </div>
  );
}

export default NoteEditor;
