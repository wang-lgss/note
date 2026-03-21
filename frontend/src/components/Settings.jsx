import React, { useState, useEffect } from 'react';
import { configManager } from '../utils/configManager';
import { applyTheme } from '../themes/themes';
import './Settings.css';

function Settings({ isOpen, onClose }) {
  const [config, setConfig] = useState(configManager.get());
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setConfig(configManager.get());
    }
  }, [isOpen]);

  const handleSave = () => {
    const validation = configManager.validate(config);

    if (!validation.valid) {
      setSaveMessage('错误: ' + validation.errors.join(', '));
      setTimeout(() => setSaveMessage(''), 3000);
      return;
    }

    configManager.save(config);
    applyTheme(config.theme);
    setSaveMessage('保存成功！');
    setTimeout(() => {
      setSaveMessage('');
      onClose();
    }, 1000);
  };

  const handleThemeChange = (theme) => {
    setConfig({ ...config, theme });
  };

  if (!isOpen) return null;

  return (
    <div className="settings-overlay">
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>设置</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="settings-content">
          {/* AI 配置 */}
          <section className="settings-section">
            <h3>AI 配置</h3>

            <div className="form-group">
              <label>API 密钥</label>
              <input
                type="password"
                value={config.ai.apiKey}
                onChange={(e) => setConfig({
                  ...config,
                  ai: { ...config.ai, apiKey: e.target.value }
                })}
                placeholder="输入 API 密钥"
              />
            </div>

            <div className="form-group">
              <label>模型名称</label>
              <input
                type="text"
                value={config.ai.model}
                onChange={(e) => setConfig({
                  ...config,
                  ai: { ...config.ai, model: e.target.value }
                })}
                placeholder="例如: claude-opus-4-5, gpt-4, deepseek-chat 等"
              />
            </div>

            <div className="form-group">
              <label>API 端点</label>
              <input
                type="text"
                value={config.ai.endpoint}
                onChange={(e) => setConfig({
                  ...config,
                  ai: { ...config.ai, endpoint: e.target.value }
                })}
                placeholder="https://api.example.com/v1"
              />
            </div>
          </section>

          {/* 主题设置 */}
          <section className="settings-section">
            <h3>主题</h3>
            <div className="theme-options">
              <label className={`theme-option ${config.theme === 'light' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={config.theme === 'light'}
                  onChange={(e) => handleThemeChange(e.target.value)}
                />
                <span>☀️ 亮色模式</span>
              </label>
              <label className={`theme-option ${config.theme === 'dark' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={config.theme === 'dark'}
                  onChange={(e) => handleThemeChange(e.target.value)}
                />
                <span>🌙 深色模式</span>
              </label>
            </div>
          </section>
        </div>

        <div className="settings-footer">
          {saveMessage && (
            <span className={`save-message ${saveMessage.includes('错误') ? 'error' : 'success'}`}>
              {saveMessage}
            </span>
          )}
          <button className="btn btn-save" onClick={handleSave}>保存</button>
          <button className="btn btn-cancel" onClick={onClose}>取消</button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
