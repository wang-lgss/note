const BaseAIProvider = require('./baseProvider');
const OpenAI = require('openai');

class OpenAIProvider extends BaseAIProvider {
  constructor(apiKey, model) {
    super(apiKey, model);
    this.client = new OpenAI({ apiKey: this.apiKey });
  }

  async complete(text, options = {}) {
    this.validateConfig();

    try {
      const response = await this.client.chat.completions.create({
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
      });

      const completed = response.choices[0]?.message?.content || '';
      return completed;
    } catch (error) {
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }

  static getSupportedModels() {
    return [
      'gpt-4',
      'gpt-4-turbo',
      'gpt-3.5-turbo'
    ];
  }
}

module.exports = OpenAIProvider;
