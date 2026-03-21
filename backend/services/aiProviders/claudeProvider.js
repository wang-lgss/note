const BaseAIProvider = require('./baseProvider');
const { Anthropic } = require('@anthropic-ai/sdk');

class ClaudeProvider extends BaseAIProvider {
  constructor(apiKey, model) {
    super(apiKey, model);
    this.client = new Anthropic({ apiKey: this.apiKey });
  }

  async complete(text, options = {}) {
    this.validateConfig();

    try {
      const message = await this.client.messages.create({
        model: this.model,
        max_tokens: options.maxTokens || 1024,
        messages: [
          {
            role: 'user',
            content: `请根据以下关键字或不完整的内容进行补全和扩展。保持原有的风格和格式，补全内容应该自然流畅。\n\n原内容：\n${text}\n\n请提供补全后的内容（只返回补全的部分，不包括原内容）：`
          }
        ]
      });

      const completed = message.content[0].type === 'text' ? message.content[0].text : '';
      return completed;
    } catch (error) {
      throw new Error(`Claude API error: ${error.message}`);
    }
  }

  static getSupportedModels() {
    return [
      'claude-opus-4-5',
      'claude-opus-4-6',
      'claude-sonnet-4-6',
      'claude-haiku-4-5'
    ];
  }
}

module.exports = ClaudeProvider;
