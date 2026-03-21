// 配置管理工具
const CONFIG_KEY = 'notesAppConfig';
const OLD_API_KEY = 'claudeApiKey';

// 默认配置
const defaultConfig = {
  ai: {
    apiKey: '',
    model: '',
    endpoint: ''
  },
  theme: 'light'
};

// 配置管理器
export const configManager = {
  // 获取配置
  get: () => {
    try {
      const stored = localStorage.getItem(CONFIG_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);

        // 迁移：将旧的 provider 配置转换为新格式
        if (parsed.ai && parsed.ai.provider) {
          const migratedConfig = {
            ...defaultConfig,
            ai: {
              apiKey: parsed.ai.apiKey || '',
              model: parsed.ai.model || '',
              endpoint: parsed.ai.endpoint || ''
            },
            theme: parsed.theme || 'light'
          };
          configManager.save(migratedConfig);
          return migratedConfig;
        }

        return { ...defaultConfig, ...parsed };
      }

      // 迁移旧的 API 密钥
      const oldApiKey = localStorage.getItem(OLD_API_KEY);
      if (oldApiKey) {
        const migratedConfig = {
          ...defaultConfig,
          ai: {
            ...defaultConfig.ai,
            apiKey: oldApiKey
          }
        };
        configManager.save(migratedConfig);
        localStorage.removeItem(OLD_API_KEY);
        return migratedConfig;
      }

      return defaultConfig;
    } catch (err) {
      console.error('Error loading config:', err);
      return defaultConfig;
    }
  },

  // 保存配置
  save: (config) => {
    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    } catch (err) {
      console.error('Error saving config:', err);
    }
  },

  // 更新配置
  update: (updates) => {
    const current = configManager.get();
    const updated = {
      ...current,
      ...updates,
      ai: {
        ...current.ai,
        ...(updates.ai || {})
      }
    };
    configManager.save(updated);
    return updated;
  },

  // 验证配置
  validate: (config) => {
    const errors = [];

    // 只验证配置结构存在，不验证 AI 字段是否填写
    if (!config.ai) {
      errors.push('AI 配置缺失');
    }

    // 主题必须是有效值
    if (!config.theme || !['light', 'dark'].includes(config.theme)) {
      errors.push('主题配置无效');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  },

  // 获取 AI 配置
  getAIConfig: () => {
    const config = configManager.get();
    return config.ai;
  },

  // 获取主题
  getTheme: () => {
    const config = configManager.get();
    return config.theme;
  },

  // 设置主题
  setTheme: (theme) => {
    return configManager.update({ theme });
  }
};
