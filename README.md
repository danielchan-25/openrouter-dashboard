# OpenRouter Dashboard

实时查看 OpenRouter API 额度、费用和使用明细。支持 Web 端和浏览器扩展。
Real-time dashboard for OpenRouter API credit limits, costs, and usage. Available as web app and browser extension.

## 功能 / Features

- 💳 **额度 / 费用 / 活动统计卡片** — Credit, cost & activity summary cards
- 🤖 **各模型用量表格**（按请求数排序）— Usage by model, sorted by requests
- 📜 **最近使用记录** — Recent activity log
- 🎨 **主题切换**（白天 / 夜晚 / 系统自动）— Light, dark & auto theme
- 🌐 **三语言支持**（简体中文 / 繁體中文 / English）— 3 languages
- ⏱ **自动刷新**（对齐 `:00` / `:30`）— Auto-refresh aligned to `:00` / `:30`
- ⚠️ **Key 过期提醒** — Key expiry warning (≤7 days / expired)
- 🔔 **扩展图标 Badge**（显示今日费用，仅扩展版）— Extension badge with today's cost
- 🚀 **Emoji 增强界面** — Emoji-enhanced UI

## 快速开始 / Quick Start

### Web 版（Cloudflare Pages）

1. Fork 本仓库 → 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. 选择你的仓库，构建命令留空（纯静态站点）
3. 部署完成后访问站点，输入 OpenRouter Management Key 即可

在线示例：<https://openrouter-dashboard-1d8.pages.dev/>

### 浏览器扩展（Chrome / Edge）

1. 克隆仓库：`git clone https://github.com/danielchan-25/openrouter-dashboard.git`
2. 打开 `chrome://extensions`，开启 **开发者模式**
3. 点击 **加载已解压的扩展程序**，选择 `extension/` 目录
4. 点击扩展图标 → 输入 Management Key → 保存

扩展图标会每分钟更新 Badge 显示今日费用。

## API 安全 / Security

- API Key 仅存储在浏览器本地（Web: `localStorage` / 扩展: `chrome.storage.local`）
- 不会发送到任何第三方服务器
- 仅用于向 `https://openrouter.ai/api/v1` 请求数据
- 使用普通 API Key 可查看部分数据；推荐使用 **Management Key** 获取完整功能

## 数据来源 / Data Sources

| Endpoint | 数据 | 权限 |
|---|---|---|
| `/key` | 额度限制、费用周期（日/周/月）、Key 过期时间 | 任意 Key |
| `/credits` | 账户信用额度（已购买 / 已消耗 / 剩余） | 需 Management Key |
| `/activity` | 使用明细（按日聚合，各模型用量，最近记录） | 需 Management Key |

> `/activity` 数据延迟约 1 天（仅返回已完成的 UTC 日）。

## 文件结构 / File Structure

```
openrouter-dashboard/
├── index.html              # Web 版（单页，内联 CSS + JS）
├── _headers                # Cloudflare Pages 安全头
├── robots.txt              # 禁止搜索引擎收录
├── .gitignore
├── README.md
└── extension/              # 浏览器扩展
    ├── manifest.json       # Manifest V3
    ├── popup.html          # 弹窗 UI
    ├── popup.js            # 全部 JS 逻辑
    ├── background.js       # Service worker（Badge 更新）
    └── icons/              # 16/48/128 PNG
```

## License

MIT
