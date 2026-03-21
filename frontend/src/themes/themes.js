// 主题配置
export const themes = {
  light: {
    '--bg-primary': '#ffffff',
    '--bg-secondary': '#f5f5f5',
    '--bg-tertiary': '#f9f9f9',
    '--text-primary': '#333333',
    '--text-secondary': '#666666',
    '--text-tertiary': '#999999',
    '--border-color': '#e0e0e0',
    '--accent-color': '#4CAF50',
    '--accent-hover': '#45a049',
    '--danger-color': '#f44336',
    '--info-color': '#2196F3',
    '--warning-color': '#FF9800',
    '--shadow': 'rgba(0, 0, 0, 0.1)',
    '--shadow-hover': 'rgba(0, 0, 0, 0.15)',
  },
  dark: {
    '--bg-primary': '#2b2b2b',
    '--bg-secondary': '#333333',
    '--bg-tertiary': '#3a3a3a',
    '--text-primary': '#e0e0e0',
    '--text-secondary': '#b0b0b0',
    '--text-tertiary': '#808080',
    '--border-color': '#404040',
    '--accent-color': '#66BB6A',
    '--accent-hover': '#5cb860',
    '--danger-color': '#ef5350',
    '--info-color': '#42A5F5',
    '--warning-color': '#FFA726',
    '--shadow': 'rgba(0, 0, 0, 0.3)',
    '--shadow-hover': 'rgba(0, 0, 0, 0.4)',
  }
};

// 应用主题
export const applyTheme = (theme) => {
  const root = document.documentElement;
  const themeColors = themes[theme] || themes.light;

  Object.entries(themeColors).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  root.setAttribute('data-theme', theme);
};

// 获取当前主题
export const getCurrentTheme = () => {
  return document.documentElement.getAttribute('data-theme') || 'light';
};
