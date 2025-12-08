# Aquainsight中心小程序 (TypeScript版本)

Aquainsight中心的微信小程序客户端，采用 TypeScript 开发，提供系统监控、告警管理、任务分发等功能。

## 技术栈

- **微信小程序原生开发**
- **TypeScript** - 类型安全的 JavaScript 超集
- **ES2020** - 现代 JavaScript 特性
- **模块化开发** - ES6 模块系统

## 功能特性

### 首页
- 系统状态实时监控
- 告警统计展示
- 快捷功能菜单（系统监控、自动告警、任务分发、远程协助、运维建设、生产协助）

### 告警管理
- 告警列表查看（全部、未处理、已处理）
- 告警详情查看
- 告警处理功能
- 告警级别标识（严重、警告、提示）

### 任务管理
- 任务列表查看（待办、进行中、已完成）
- 任务详情查看
- 任务创建和分配
- 任务状态更新

### 个人中心
- 用户信息展示
- 个人统计（告警数、任务数、完成数）
- 消息通知
- 收藏管理
- 系统设置

## 项目结构

```
aquainsight-miniapp/
├── pages/              # 页面目录
│   ├── index/         # 首页
│   │   ├── index.wxml
│   │   ├── index.wxss
│   │   ├── index.ts   # TypeScript 文件
│   │   └── index.json
│   ├── alarm/         # 告警页面
│   ├── task/          # 任务页面
│   └── mine/          # 我的页面
├── components/        # 组件目录
├── utils/            # 工具函数
│   ├── request.ts    # API请求封装 (TypeScript)
│   ├── util.ts       # 通用工具函数 (TypeScript)
│   └── api.ts        # API接口定义 (TypeScript)
├── typings/          # 类型定义目录
│   ├── index.d.ts    # 全局类型入口
│   └── types.d.ts    # 业务类型定义
├── images/           # 图片资源
├── app.ts            # 小程序入口文件 (TypeScript)
├── app.json          # 小程序配置
├── app.wxss          # 全局样式
├── tsconfig.json     # TypeScript 配置
├── package.json      # 项目依赖配置
└── project.config.json  # 项目配置
```

## 开发指南

### 1. 环境准备

- 安装 Node.js (建议 v14 以上)
- 安装微信开发者工具
- 下载地址: https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html

### 2. 安装依赖

```bash
cd aquainsight-miniapp
npm install
```

### 3. TypeScript 编译

项目使用微信开发者工具内置的 TypeScript 编译器，无需手动编译。

如需在命令行编译：

```bash
# 单次编译
npm run tsc

# 监听模式
npm run watch
```

### 4. 导入项目

1. 打开微信开发者工具
2. 选择"导入项目"
3. 选择项目目录: `aquainsight-miniapp`
4. 填写AppID（没有可以使用测试号）
5. 工具会自动识别 TypeScript 并进行编译

### 5. 配置说明

#### API地址配置

修改 `app.ts` 中的 `apiBaseUrl`：

```typescript
globalData: {
  apiBaseUrl: 'http://your-api-server.com/api'
}
```

#### TypeScript 配置

`tsconfig.json` 已配置好严格模式和类型检查：

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020",
    "module": "CommonJS",
    ...
  }
}
```

### 6. 类型定义

项目提供了完整的类型定义，位于 `typings/` 目录：

```typescript
// 使用示例
interface IUserInfo {
  name: string
  role: string
  avatar: string
}

// API 响应类型
interface IApiResponse<T> {
  code: number
  message: string
  data: T
}
```

### 7. API 使用示例

```typescript
import { alarmApi } from '../../utils/api'

// 获取告警列表，带类型提示
const res = await alarmApi.getList({ status: 'pending' })
// res.data 的类型为 IAlarm[]

// 处理告警
await alarmApi.handle(id, { remark: '已处理' })
```

## TypeScript 优势

1. **类型安全** - 编译时捕获错误，减少运行时错误
2. **智能提示** - IDE 提供完整的代码提示和自动补全
3. **代码重构** - 更安全的代码重构，自动更新引用
4. **文档化** - 类型定义即文档，减少注释需求
5. **团队协作** - 统一的类型约束，提高代码质量

## 开发建议

1. **严格模式** - 项目启用了 TypeScript 严格模式，确保类型安全
2. **类型注解** - 为函数参数和返回值添加类型注解
3. **接口定义** - 使用 interface 定义数据结构
4. **避免 any** - 尽量避免使用 any 类型
5. **类型推断** - 利用 TypeScript 的类型推断能力

## 常见问题

### Q: 编译报错怎么办？

A: 检查 TypeScript 版本和 tsconfig.json 配置，确保微信开发者工具已更新到最新版本。

### Q: 如何添加新的类型定义？

A: 在 `typings/types.d.ts` 中添加新的接口定义：

```typescript
interface INewType {
  // 属性定义
}
```

### Q: 如何处理第三方库的类型？

A: 安装对应的 @types 包：

```bash
npm install --save-dev @types/xxx
```

## 图标资源

请参考 `images/图标说明.txt` 准备所需的图标文件。

## 后续开发计划

- [ ] 完善告警详情页面
- [ ] 完善任务详情页面
- [ ] 实现消息推送功能
- [ ] 添加数据可视化图表
- [ ] 实现离线缓存
- [ ] 添加暗黑模式支持
- [ ] 完善单元测试

## 注意事项

1. TypeScript 文件（.ts）会被自动编译为 JavaScript
2. 请求域名需要在微信公众平台配置服务器域名
3. 开发时可以在开发者工具中勾选"不校验合法域名"
4. 发布前需要配置正式的API服务器地址
5. 确保所有类型定义准确，避免运行时错误

## 相关文档

- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)
- [微信小程序 TypeScript 支持](https://developers.weixin.qq.com/miniprogram/dev/devtools/codecompile.html#typescript-%E6%94%AF%E6%8C%81)

## 联系方式

如有问题，请联系开发团队。
