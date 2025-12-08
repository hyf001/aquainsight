# 项目结构

```
aquainsight-miniapp/
├── pages/                      # 页面目录
│   ├── index/                 # 首页
│   │   ├── index.wxml        # 页面结构
│   │   ├── index.wxss        # 页面样式
│   │   ├── index.ts          # 页面逻辑 (TypeScript)
│   │   └── index.json        # 页面配置
│   ├── alarm/                 # 告警页面
│   │   ├── alarm.wxml
│   │   ├── alarm.wxss
│   │   ├── alarm.ts
│   │   └── alarm.json
│   ├── task/                  # 任务页面
│   │   ├── task.wxml
│   │   ├── task.wxss
│   │   ├── task.ts
│   │   └── task.json
│   └── mine/                  # 我的页面
│       ├── mine.wxml
│       ├── mine.wxss
│       ├── mine.ts
│       └── mine.json
│
├── utils/                      # 工具类目录
│   ├── api.ts                 # API 接口定义 (TypeScript)
│   ├── request.ts             # 网络请求封装 (TypeScript)
│   └── util.ts                # 通用工具函数 (TypeScript)
│
├── typings/                    # TypeScript 类型定义
│   ├── index.d.ts            # 类型入口
│   └── types.d.ts            # 业务类型定义
│
├── components/                 # 自定义组件目录
│
├── images/                     # 图片资源目录
│   └── menu/                  # 菜单图标
│
├── app.ts                      # 应用入口 (TypeScript)
├── app.json                    # 应用配置
├── app.wxss                    # 全局样式
│
├── tsconfig.json              # TypeScript 配置
├── package.json               # npm 依赖配置
├── project.config.json        # 项目配置
├── sitemap.json               # 站点地图配置
│
├── README.md                   # 项目说明文档
├── QUICK_START.md             # 快速开始指南
├── MIGRATION_GUIDE.md         # 迁移指南
└── PROJECT_STRUCTURE.md       # 本文件 (项目结构说明)
```

## 文件说明

### 核心配置文件

| 文件 | 说明 |
|------|------|
| `app.ts` | 小程序入口文件，定义全局数据和生命周期 |
| `app.json` | 小程序全局配置，包括页面路由、窗口表现、底部导航等 |
| `app.wxss` | 全局样式文件 |
| `tsconfig.json` | TypeScript 编译配置 |
| `package.json` | npm 依赖和脚本配置 |
| `project.config.json` | 开发者工具项目配置 |

### 页面文件

每个页面包含四个文件：

- `.wxml` - 页面结构（类似 HTML）
- `.wxss` - 页面样式（类似 CSS）
- `.ts` - 页面逻辑（TypeScript）
- `.json` - 页面配置

### 工具类

| 文件 | 说明 |
|------|------|
| `utils/api.ts` | 封装所有 API 接口调用方法 |
| `utils/request.ts` | 封装 wx.request，支持拦截器和统一错误处理 |
| `utils/util.ts` | 通用工具函数（时间格式化、防抖节流等） |

### 类型定义

| 文件 | 说明 |
|------|------|
| `typings/types.d.ts` | 业务数据类型定义（用户、告警、任务等） |
| `typings/index.d.ts` | 类型定义入口文件 |

## 技术栈

- **开发语言**: TypeScript
- **框架**: 微信小程序原生框架
- **编译工具**: 微信开发者工具内置的 TypeScript 编译器
- **包管理**: npm

## 特点

✅ **纯 TypeScript** - 所有逻辑代码均使用 TypeScript 编写
✅ **类型安全** - 完整的类型定义和检查
✅ **模块化** - 清晰的目录结构和模块划分
✅ **规范化** - 统一的代码风格和命名规范
