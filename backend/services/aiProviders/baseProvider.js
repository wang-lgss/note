// AI Provider 基础接口类
class BaseAIProvider {
  constructor(apiKey, model) {
    this.apiKey = apiKey;
    this.model = model;
  }

  // 补全文本 - 子类必须实现
  async complete(text, options = {}) {
    throw new Error('complete() must be implemented by subclass');
  }

  // 验证配置
  validateConfig() {
    if (!this.apiKey || this.apiKey.trim() === '') {
      throw new Error('API key is required');
    }
    if (!this.model || this.model.trim() === '') {
      throw new Error('Model is required');
    }
  }

  // 获取支持的模型列表
  static getSupportedModels() {
    return [];
  }
}

module.exports = BaseAIProvider;
