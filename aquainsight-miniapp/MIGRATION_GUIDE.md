# JavaScript 到 TypeScript 迁移指南

## 迁移概览

项目已完全迁移到 TypeScript，以下是主要变更：

## 文件对比

### 核心文件

| JavaScript 版本 | TypeScript 版本 | 说明 |
|----------------|-----------------|------|
| app.js | app.ts | 应用入口，添加了类型定义 |
| utils/request.js | utils/request.ts | 请求封装，添加泛型支持 |
| utils/util.js | utils/util.ts | 工具函数，完整的类型注解 |
| utils/api.js | utils/api.ts | API 定义，带类型的接口方法 |

### 页面文件

| JavaScript 版本 | TypeScript 版本 |
|----------------|-----------------|
| pages/index/index.js | pages/index/index.ts |
| pages/alarm/alarm.js | pages/alarm/alarm.ts |
| pages/task/task.js | pages/task/task.ts |
| pages/mine/mine.js | pages/mine/mine.ts |

## 主要改进

### 1. 类型安全

**之前 (JavaScript):**
```javascript
// 没有类型检查，容易出错
const getAlarmStats = () => {
  wx.request({
    url: `${app.globalData.apiBaseUrl}/alarm/stats`,
    success: (res) => {
      // res.data 是 any 类型
      this.setData({
        todayAlarmCount: res.data.data.todayCount
      })
    }
  })
}
```

**现在 (TypeScript):**
```typescript
// 有完整的类型提示和检查
async getAlarmStats() {
  try {
    const res = await alarmApi.getStats()
    // res.data 的类型是 IStats，编辑器会提示所有属性
    this.setData({
      todayAlarmCount: res.data.todayCount || 0,
      pendingTaskCount: res.data.pendingCount || 0
    })
  } catch (err) {
    console.error('获取告警统计失败', err)
  }
}
```

### 2. API 请求封装

**之前 (JavaScript):**
```javascript
// 没有类型提示
const request = (options) => {
  return new Promise((resolve, reject) => {
    wx.request({
      // ...
    })
  })
}

const get = (url, data = {}, options = {}) => {
  return request({ url, method: 'GET', data, ...options })
}
```

**现在 (TypeScript):**
```typescript
// 带泛型的请求方法，返回值类型明确
const request = <T = any>(options: IRequestOptions): Promise<IApiResponse<T>> => {
  return new Promise((resolve, reject) => {
    wx.request({
      // ...
    })
  })
}

const get = <T = any>(
  url: string,
  data?: any,
  options?: Partial<IRequestOptions>
): Promise<IApiResponse<T>> => {
  return request<T>({ url, method: 'GET', data, ...options })
}
```

### 3. 页面数据定义

**之前 (JavaScript):**
```javascript
Page({
  data: {
    systemStatus: '正常运行',
    todayAlarmCount: 3,
    // ...
  },
  onLoad() {
    // ...
  }
})
```

**现在 (TypeScript):**
```typescript
// 明确定义页面数据结构
interface IIndexData {
  systemStatus: string
  todayAlarmCount: number
  pendingTaskCount: number
  menuItems: IMenuItem[]
}

Page<IIndexData>({
  data: {
    systemStatus: '正常运行',
    todayAlarmCount: 3,
    // 如果数据类型不匹配，编译时会报错
  },
  onLoad() {
    // this.data 有完整的类型提示
  }
})
```

### 4. 事件处理

**之前 (JavaScript):**
```javascript
onMenuTap(e) {
  const path = e.currentTarget.dataset.path
  // ...
}
```

**现在 (TypeScript):**
```typescript
onMenuTap(e: WechatMiniprogram.BaseEvent) {
  const { path } = e.currentTarget.dataset
  // 参数类型明确，减少错误
}
```

### 5. API 调用

**之前 (JavaScript):**
```javascript
const api = require('../../utils/api.js')

// 调用时没有类型提示
api.alarm.getList({ status: 'pending' })
  .then(res => {
    // res 类型未知
  })
```

**现在 (TypeScript):**
```typescript
import { alarmApi } from '../../utils/api'

// 有完整的参数和返回值类型提示
const res = await alarmApi.getList({ status: 'pending' })
// res.data 的类型是 IAlarm[]
```

## 新增文件

### 1. TypeScript 配置

- **tsconfig.json** - TypeScript 编译配置
- **package.json** - 依赖管理

### 2. 类型定义

- **typings/index.d.ts** - 类型入口
- **typings/types.d.ts** - 业务类型定义

包含以下类型：
- `IAppGlobalData` - 应用全局数据
- `IUserInfo` - 用户信息
- `IApiResponse<T>` - API 响应
- `IAlarm` - 告警数据
- `ITask` - 任务数据
- `IStats` - 统计数据
- 等等...

### 3. 文档

- **README-TS.md** - TypeScript 版本详细文档
- **QUICK_START.md** - 快速开始指南
- **MIGRATION_GUIDE.md** - 本迁移指南
- **.gitignore** - Git 忽略配置

## 配置变更

### project.config.json

```json
{
  "setting": {
    "nodeModules": true,  // 启用 npm 支持
    "useCompilerPlugins": ["typescript"]  // 启用 TypeScript 编译
  }
}
```

## 开发体验提升

### 1. 智能提示

- 函数参数自动提示
- 对象属性自动补全
- API 方法签名提示

### 2. 错误检查

- 编译时类型检查
- 参数类型不匹配警告
- 拼写错误提示

### 3. 重构支持

- 安全的变量重命名
- 自动更新所有引用
- 查找所有使用位置

### 4. 文档化

- 类型即文档
- 减少注释需求
- 更好的代码可读性

## 迁移建议

如果你需要迁移其他 JavaScript 小程序项目到 TypeScript：

1. **安装依赖**
   ```bash
   npm install typescript miniprogram-api-typings --save-dev
   ```

2. **创建 tsconfig.json**
   ```json
   {
     "compilerOptions": {
       "target": "ES2020",
       "module": "CommonJS",
       "strict": true
     }
   }
   ```

3. **定义类型**
   - 在 `typings/` 目录创建类型定义文件
   - 定义业务数据结构

4. **逐步迁移**
   - 先迁移工具类 (utils)
   - 再迁移页面 (pages)
   - 最后迁移组件 (components)

5. **更新配置**
   - 修改 `project.config.json`
   - 启用 TypeScript 编译

## 注意事项

1. **保留 .js 文件**：微信开发者工具会将 .ts 编译为 .js
2. **类型声明**：确保所有接口都有类型定义
3. **严格模式**：项目启用了 strict 模式，类型检查更严格
4. **渐进式迁移**：可以 .js 和 .ts 文件共存

## 总结

迁移到 TypeScript 后的优势：

✅ **类型安全** - 编译时发现错误
✅ **智能提示** - 更好的开发体验
✅ **代码质量** - 更易维护和重构
✅ **团队协作** - 统一的代码规范
✅ **文档化** - 类型即文档

开始享受 TypeScript 带来的开发体验提升吧！🎉
