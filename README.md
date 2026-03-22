# 笔记应用

一个功能完整的笔记应用，支持文件夹分类、全文搜索、标签系统、Markdown 编辑和 AI 补全功能。

## 功能特性

- 📁 **文件夹分类** - 按文件夹组织笔记
- 🔍 **全文搜索** - 快速搜索笔记内容
- 🏷️ **标签系统** - 为笔记添加多个标签
- ✍️ **Markdown 编辑** - 支持 Markdown 格式编辑和预览
- 🤖 **AI 补全** - 支持多种 AI 模型（Claude、OpenAI 等）
- 📊 **元数据显示** - 显示创建时间、修改时间和字数统计
- 🎨 **主题切换** - 支持亮色和深色模式

## 技术栈

- **前端**: React 18, Axios, React Markdown
- **后端**: Express.js, Node.js
- **存储**: 本地文件系统（Markdown 格式）
- **AI**: 支持 Claude、OpenAI 和自定义 API 端点

## 项目结构

```
notes-app/
├── backend/           # Express 后端服务
│   ├── routes/        # API 路由
│   ├── services/      # AI 服务提供商
│   ├── middleware/    # 中间件
│   └── server.js      # 服务器入口
├── frontend/          # React 前端应用
│   ├── src/
│   │   ├── components/  # React 组件
│   │   ├── themes/      # 主题配置
│   │   ├── utils/       # 工具函数
│   │   └── App.jsx      # 主应用
│   └── public/
├── notes/             # 笔记存储目录
└── start.bat          # Windows 启动脚本
```

## 快速开始

### 前置要求

- Node.js 14+ 和 npm
- AI API 密钥（可选，用于 AI 补全功能）

### 安装依赖

```bash
# 后端
cd backend
npm install

# 前端
cd frontend
npm install
```

### 启动应用

**方式 1：使用启动脚本（推荐）**

双击 `start.bat` 文件

**方式 2：手动启动**

终端 1 - 启动后端：
```bash
cd backend
npm start
```

终端 2 - 启动前端：
```bash
cd frontend
npm start
```

应用将在 `http://localhost:3000` 打开。

## 使用说明

### 基本操作

1. **创建笔记** - 在左侧选择文件夹，在编辑器中输入内容，点击"保存"
2. **编辑笔记** - 点击笔记列表中的笔记进行编辑
3. **添加标签** - 在标签输入框中输入标签名称，按 Enter 添加
4. **搜索笔记** - 使用搜索栏进行全文搜索或按标签搜索
5. **切换主题** - 点击右上角齿轮图标，在设置中切换亮色/深色模式

### 配置 AI 功能

1. 点击左上角的 ⚙️ 齿轮图标打开设置
2. 在"AI 配置"部分填写：
   - **API 密钥**: 你的 AI 服务 API 密钥
   - **模型名称**: 如 `claude-opus-4-5`、`gpt-4`、`deepseek-chat` 等
   - **API 端点**: 如 `https://api.anthropic.com/v1` 或 `https://api.openai.com/v1`
3. 点击"保存"

### 使用 AI 补全

1. 在编辑器中输入关键字或不完整的内容
2. 点击"AI 补全"按钮
3. AI 将自动生成补全内容并追加到笔记中

**注意**: 需要先在设置中配置完整的 AI 信息才能使用此功能。

## 笔记格式

笔记以 Markdown 格式存储，包含 YAML frontmatter 用于存储元数据：

```markdown
---
title: 笔记标题
tags: ["标签1", "标签2"]
createdAt: 2024-03-19T10:00:00.000Z
updatedAt: 2024-03-19T10:00:00.000Z
---

笔记内容...
```

## 常见问题

**Q: 笔记存储在哪里？**
A: 笔记存储在项目根目录的 `notes/` 文件夹中，以 Markdown 文件形式保存。

**Q: 如何备份笔记？**
A: 直接复制 `notes/` 文件夹即可备份所有笔记。

**Q: AI 补全功能需要付费吗？**
A: 需要有效的 AI API 密钥。根据服务提供商的定价政策，API 调用可能产生费用。

**Q: 支持哪些 AI 模型？**
A: 支持任何兼容 OpenAI API 格式的服务，包括 Claude、OpenAI、DeepSeek 等。

**Q: 如何删除笔记？**
A: 选择笔记后，点击编辑器中的"删除"按钮。

## 故障排除

**后端无法启动**
- 检查 Node.js 是否正确安装
- 检查端口 5000 是否被占用
- 查看终端错误信息

**前端无法启动**
- 检查 Node.js 是否正确安装
- 检查端口 3000 是否被占用
- 尝试删除 `node_modules` 文件夹并重新运行 `npm install`

**无法连接到后端**
- 确保后端服务器正在运行
- 检查防火墙设置
- 检查浏览器控制台的错误信息

**AI 补全不工作**
- 确认已在设置中配置完整的 AI 信息（API 密钥、模型名称、API 端点）
- 检查 API 密钥是否有效
- 查看浏览器控制台的错误信息

## 许可证

MIT
## main改动