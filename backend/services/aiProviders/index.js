const ClaudeProvider = require('./claudeProvider');
const OpenAIProvider = require('./openaiProvider');
const CustomProvider = require('./customProvider');

// AI Provider 工厂函数
function createAIProvider(provider, apiKey, model, endpoint = null) {
  switch (provider) {
    case 'claude':
      return new ClaudeProvider(apiKey, model);
    case 'openai':
      return new OpenAIProvider(apiKey, model);
    case 'custom':
      if (!endpoint) {
        throw new Error('Endpoint is required for custom provider');
      }
      return new CustomProvider(apiKey, model, endpoint);
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

// 获取支持的模型列表
function getSupportedModels(provider) {
  switch (provider) {
    case 'claude':
      return ClaudeProvider.getSupportedModels();
    case 'openai':
      return OpenAIProvider.getSupportedModels();
    case 'custom':
      return CustomProvider.getSupportedModels();
    default:
      return [];
  }
}

module.exports = {
  createAIProvider,
  getSupportedModels
};
