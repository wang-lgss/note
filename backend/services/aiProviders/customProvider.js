const BaseAIProvider = require('./baseProvider');
const axios = require('axios');

class CustomProvider extends BaseAIProvider {
  constructor(apiKey, model, endpoint) {
    super(apiKey, model);
    this.endpoint = endpoint;
  }

  validateConfig() {
    super.validateConfig();
    if (!this.endpoint || this.endpoint.trim() === '') {
      throw new Error('API endpoint is required for custom provider');
    }
  }

  async complete(text, options = {}) {
    this.validateConfig();

    try {
      // 使用 OpenAI 兼容的 API 格式
      const response = await axios.post(
        `${this.endpoint}/chat/completions`,
        {
          model: this.model,
          max_tokens: options.maxTokens || 1024,
          messages: [
            {
              role: 'system',
              content: '你是一个专业的写作助手，擅长根据用户提供的关键字或不完整内容进行补全和扩展。'
            },
            {
              role: 'user',
              content: `请根据以下关键字或不完整的内容进行补全和扩展。保持原有的风格和格式，补全内容应该自然流畅。\n\n原内容：\n${text}\n\n请提供补全后的内容（只返回补全的部分，不包括原内容）：`
            }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const completed = response.data.choices[0]?.message?.content || '';
      return completed;
    } catch (error) {
      throw new Error(`Custom API error: ${error.message}`);
    }
  }

  static getSupportedModels() {
    return []; // 自定义端点的模型由用户指定
  }
}

module.exports = CustomProvider;
