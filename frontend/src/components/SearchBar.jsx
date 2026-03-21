import React, { useState } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch, tags }) {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('text');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query, searchType);
    }
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSearch}>
        <div className="search-type">
          <label>
            <input
              type="radio"
              value="text"
              checked={searchType === 'text'}
              onChange={(e) => setSearchType(e.target.value)}
            />
            全文搜索
          </label>
          <label>
            <input
              type="radio"
              value="tag"
              checked={searchType === 'tag'}
              onChange={(e) => setSearchType(e.target.value)}
            />
            标签搜索
          </label>
        </div>
        {searchType === 'text' ? (
          <input
            type="text"
            placeholder="搜索笔记..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
        ) : (
          <select
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-select"
          >
            <option value="">选择标签...</option>
            {tags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        )}
        <button type="submit" className="search-btn">搜索</button>
      </form>
    </div>
  );
}

export default SearchBar;
