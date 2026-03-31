# 五子棋网页版

一个功能完整的五子棋网页应用，支持人机对战、本地双人对战和远程联机对战。

## 功能特性

- ✨ 三种游戏模式：人机对战、本地双人、远程联机
- 🤖 智能AI算法，支持三种难度级别（简单、中等、困难）
- 👥 远程联机：通过6位房间号与好友在线对战
- 📱 响应式设计，完美适配PC和移动端
- 🎨 精美的UI设计，流畅的动画效果
- ⏮️ 支持悔棋功能
- 🏆 自动胜负判定

## 技术栈

- **前端**: React 18 + TypeScript + Tailwind CSS
- **实时通信**: Supabase Realtime
- **构建工具**: Vite
- **部署**: 腾讯云EdgeOne Pages / Vercel + Supabase

## 本地运行

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
复制 `.env.local.example` 为 `.env.local`，并填写你的Supabase项目配置：
```env
VITE_SUPABASE_URL=你的Supabase项目URL
VITE_SUPABASE_ANON_KEY=你的Supabase匿名密钥
```

### 3. 启动开发服务器
```bash
npm run dev
```
访问 http://localhost:5173 即可使用。

### 4. 构建生产版本
```bash
npm run build
```

## 部署指南

### 方案一：部署到腾讯云EdgeOne Pages（推荐，国内访问快）
1. Fork本项目到你的GitHub/Gitee账号
2. 登录腾讯云控制台，进入EdgeOne Pages服务
3. 新建项目，关联你的代码仓库
4. 配置构建命令：`npm run build`
5. 配置发布目录：`dist`
6. 配置环境变量：
   - `VITE_SUPABASE_URL`：你的Supabase项目URL
   - `VITE_SUPABASE_ANON_KEY`：你的Supabase匿名密钥
7. 点击部署，完成后即可获得CNAME域名，绑定自己的域名即可访问

### 方案二：部署到Vercel
1. Fork本项目到你的GitHub账号
2. 在Vercel中导入项目
3. 配置环境变量
4. 点击部署，完成后即可获得访问域名

### Supabase配置（两种部署方案都需要）
1. 创建Supabase项目（推荐选择新加坡节点，国内访问速度不错）
2. 在SQL编辑器中执行以下SQL创建rooms表：
```sql
create table rooms (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  player1 text not null,
  player2 text,
  current_player int not null default 1,
  board jsonb not null,
  status text not null default 'waiting',
  winner int,
  last_move jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 开启实时订阅
alter publication supabase_realtime add table rooms;
```
3. 在项目设置中获取URL和匿名密钥，配置到环境变量中

## 项目结构
```
src/
├── components/     # UI组件
│   ├── Board.tsx          # 棋盘组件
│   ├── Piece.tsx          # 棋子组件
│   ├── GameControls.tsx   # 游戏控制组件
│   └── RoomModal.tsx      # 房间弹窗组件
├── constants/      # 常量定义
│   └── game.ts
├── hooks/          # 自定义Hook
│   ├── useGame.ts         # 游戏状态管理
│   └── useMultiplayer.ts  # 联机功能
├── pages/          # 页面
│   ├── Home.tsx          # 首页
│   └── Game.tsx          # 游戏页
├── types/          # TypeScript类型定义
│   └── index.ts
├── utils/          # 工具函数
│   └── gameLogic.ts      # 游戏核心逻辑和AI算法
├── App.tsx         # 主应用
└── main.tsx        # 入口文件
```

## 许可证
MIT
