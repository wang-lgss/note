const express = require('express');
const router = express.Router();
const { createAIProvider, getSupportedModels } = require('../services/aiProviders');

// 创建 AI 补全端点
router.post('/complete', async (req, res) => {
  try {
    const { text, provider, apiKey, model, endpoint } = req.body;

    // 验证必需参数
    if (!provider) {
      return res.status(400).json({ error: 'Provider is required' });
    }

    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }

    if (!model) {
      return res.status(400).json({ error: 'Model is required' });
    }

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text to complete is required' });
    }

    // 创建对应的 AI provider
    const aiProvider = createAIProvider(provider, apiKey, model, endpoint);

    // 调用补全
    const completed = await aiProvider.complete(text);

    res.json({ completed });
  } catch (err) {
    console.error('AI completion error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 获取支持的模型列表
router.get('/models', (req, res) => {
  try {
    const { provider } = req.query;

    if (!provider) {
      return res.status(400).json({ error: 'Provider is required' });
    }

    const models = getSupportedModels(provider);
    res.json({ models });
  } catch (err) {
    console.error('Error getting models:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
