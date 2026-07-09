# 🧳 智游 — 智能旅游规划助手

> 基于大语言模型（LLM）的智能旅游规划系统。输入目的地、预算和天数，AI 自动生成完整行程计划，并支持流式多轮对话咨询。

[![Vue](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite)](https://vite.dev/)
[![Vant](https://img.shields.io/badge/Vant-4.9-07C160?logo=vant)](https://vant-ui.github.io/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)](https://nodejs.org/)
[![LangChain](https://img.shields.io/badge/LangChain.js-1.5-1C3C3C?logo=langchain)](https://js.langchain.com/)

---

## ✨ 功能特性

- 🤖 **AI 行程规划** — 输入城市、预算、天数，大模型自动生成每日景点安排、交通建议和预算明细
- 💬 **流式 AI 对话** — SSE 流式传输，token 级实时渲染，首字延迟 < 1s
- 🔄 **多模型切换** — 通过环境变量一键切换 DeepSeek / 硅基流动(Qwen)，架构解耦
- 📱 **移动端适配** — Vant 4 UI 组件库，仿原生 App 交互体验
- 👤 **用户系统** — 登录/注册/个人中心，含离线 Mock 模式
- 📋 **结构化输出** — Prompt Engineering 约束 LLM 输出 JSON，正则兜底解析

---

## 🏗️ 技术架构

```
┌─────────────────────────────────────────────────┐
│                    移动端 H5                      │
│         Vue 3 + Vite + Vant 4 + Vue Router        │
│         Axios / Fetch (SSE) + localStorage        │
└────────────────────┬────────────────────────────┘
                     │  HTTP / SSE
┌────────────────────▼────────────────────────────┐
│                 Node.js 服务层                    │
│           Express + CORS + 错误中间件              │
│           手写 SSE 工具 (createStreamResponse)      │
└────────────────────┬────────────────────────────┘
                     │  SDK 调用
┌────────────────────▼────────────────────────────┐
│                  AI 模型层                        │
│   LangChain.js (ChatOpenAI)                      │
│   DeepSeek-V3  │  硅基流动 Qwen3.6-35B           │
│   Prompt Engineering → 结构化 JSON                 │
└─────────────────────────────────────────────────┘
```

---

## 🛠️ 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端框架 | Vue 3 (Composition API) | `<script setup>` 语法 |
| 构建工具 | Vite 8 | HMR 极速热更新 |
| UI 组件库 | Vant 4 | 移动端组件库，按需引入 |
| 路由 | Vue Router 4 | 路由懒加载，query 参数传递 |
| HTTP 客户端 | Axios + Fetch | Axios 封装 REST API，Fetch 处理 SSE 流 |
| 后端框架 | Express 4 | Node.js 服务端 |
| AI 框架 | LangChain.js | ChatOpenAI 统一多模型调用 |
| 大语言模型 | DeepSeek / 硅基流动(Qwen) | 环境变量动态切换 |
| 流式传输 | SSE (Server-Sent Events) | HTTP 长连接，手写工具封装 |

---

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 1. 克隆项目

```bash
git clone https://github.com/Jiangqingfa001/travel-project.git
cd travel-project
```

### 2. 启动后端服务

```bash
cd travel-server
npm install
```

复制环境变量模板并填入你的 API 密钥：

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入你的大模型 API 密钥：

```env
PORT=3300
MODEL_PROVIDER=DEEPSEEK

# DeepSeek 配置
DEEPSEEK_API_KEY=你的DeepSeek密钥
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
DEEPSEEK_MODEL_URL=deepseek-chat

# 硅基流动 配置（备选）
SILICONFLOW_API_KEY=你的硅基流动密钥
SILICONFLOW_BASE_URL=https://api.siliconflow.cn/v1
SILICONFLOW_MODEL_URL=Qwen/Qwen3.6-35B-A3B
```

```bash
npm run dev
# 服务运行在 http://localhost:3300
```

### 3. 启动前端

```bash
cd ../travel-h5
npm install
npm run dev
# 打开浏览器访问 http://localhost:5173
```

### 4. 📱 移动端预览

在 Chrome 中按 `F12` → 点击设备工具栏图标（`Ctrl+Shift+M`）→ 选择移动设备视图，即可体验手机端效果。

---

## 📂 项目结构

```
travel-project/
├── travel-h5/                      # 前端项目
│   ├── src/
│   │   ├── views/                  # 页面组件
│   │   │   ├── Home.vue            # 首页 — 目的地选择、表单提交
│   │   │   ├── Detail.vue          # 行程详情 — 每日安排、预算明细
│   │   │   ├── Chat.vue            # AI 对话 — 流式聊天
│   │   │   ├── Login.vue           # 登录页（含 Mock 模式）
│   │   │   ├── Register.vue        # 注册页（含 Mock 模式）
│   │   │   └── Profile.vue         # 个人中心
│   │   ├── components/             # 公共组件
│   │   │   ├── ChatBubble.vue      # 聊天气泡（用户/AI 双样式）
│   │   │   ├── SpotItem.vue        # 景点信息卡片
│   │   │   └── BudgetTable.vue     # 预算明细表格
│   │   ├── router/index.js         # 路由配置（懒加载）
│   │   ├── utils/
│   │   │   ├── request.js          # Axios 封装 + SSE fetchStream
│   │   │   └── auth.js             # 用户认证（localStorage Mock）
│   │   └── main.js                 # 入口文件
│   ├── vite.config.js              # Vite 配置（Vant 按需引入）
│   └── package.json
│
├── travel-server/                  # 后端项目
│   ├── src/
│   │   ├── index.js                # Express 入口 + 中间件
│   │   ├── routes/travel.js        # 路由层（/recommend、/chat）
│   │   ├── services/trawelServices.js  # 业务层（LangChain + Prompt）
│   │   └── utils/steamUtiles.js    # SSE 流式响应工具
│   ├── .env.example                # 环境变量模板
│   └── package.json
│
└── README.md                       # 本文件
```

---

## 📡 API 接口

### `POST /api/travel/recommend`

生成行程规划。

**请求体：**
```json
{
  "city": "成都",
  "budget": 3000,
  "days": 3
}
```

**响应体：**
```json
{
  "success": true,
  "city": "成都",
  "days": 3,
  "totalBudget": 2800,
  "dailyItinerary": [
    {
      "day": 1,
      "morning": {
        "spot": "宽窄巷子",
        "duration": "2小时",
        "ticket": "免费",
        "transportation": "地铁2号线",
        "description": "成都最具代表性的历史文化街区..."
      },
      "afternoon": { "...": "..." },
      "evening": { "...": "..." }
    }
  ]
}
```

### `POST /api/travel/chat`

流式 AI 对话，返回 SSE 格式数据。

**请求体：**
```json
{
  "message": "成都有什么美食推荐？"
}
```

**响应：** SSE 流式传输，`data` 字段为 token 片段。

---

## 🔒 安全提示

- `.env` 文件包含你的 API 密钥，**切勿提交到 Git 仓库**
- 本项目已配置 `.gitignore` 自动忽略 `.env`、`node_modules`、`dist` 等敏感文件
- 如需分享项目，请参考 `.env.example` 模板文件填写环境变量
- 如果密钥意外泄露，请立即到对应平台（DeepSeek / 硅基流动）重置密钥

---

## 📄 许可证

MIT License
