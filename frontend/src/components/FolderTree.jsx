import React, { useState } from 'react';
import './FolderTree.css';

function FolderTree({ folders, onSelectFolder }) {
  const [expanded, setExpanded] = useState({});

  const toggleFolder = (path) => {
    setExpanded(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const renderFolder = (obj, path = '') => {
    return (
      <div key={path || 'root'} className="folder-item">
        {Object.keys(obj).map(key => {
          if (key === '_files') return null;
          const newPath = path ? `${path}/${key}` : key;
          const isExpanded = expanded[newPath];

          return (
            <div key={newPath}>
              <div
                className="folder-header"
                onClick={() => toggleFolder(newPath)}
              >
                <span className="folder-icon">{isExpanded ? '▼' : '▶'}</span>
                <span className="folder-name">{key}</span>
              </div>
              {isExpanded && (
                <div className="folder-content">
                  {obj[key]._files && obj[key]._files.map(file => (
                    <div
                      key={`${newPath}/${file}`}
                      className="file-item"
                      onClick={() => onSelectFolder(newPath)}
                    >
                      📄 {file}
                    </div>
                  ))}
                  {renderFolder(obj[key], newPath)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="folder-tree">
      <h3>文件夹</h3>
      {renderFolder(folders)}
    </div>
  );
}

export default FolderTree;
