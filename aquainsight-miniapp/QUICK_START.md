# 快速开始指南

## 第一步：安装依赖

```bash
npm install
```

这将安装以下依赖：
- `typescript`: TypeScript 编译器
- `miniprogram-api-typings`: 微信小程序 API 类型定义

## 第二步：配置 API 地址

编辑 [app.ts](app.ts#L10)，修改 API 服务器地址：

```typescript
globalData: {
  userInfo: null,
  apiBaseUrl: 'http://your-api-server.com/api'  // 修改为你的 API 地址
}
```

## 第三步：准备图标资源

参考 [images/图标说明.txt](../images/图标说明.txt)，将图标文件放到对应目录。

## 第四步：导入微信开发者工具

1. 打开微信开发者工具
2. 点击"导入项目"
3. 选择项目目录
4. 填写 AppID（没有可使用测试号）
5. 点击"导入"

## 第五步：配置项目

在微信开发者工具中：

1. **启用 TypeScript**：工具会自动识别并编译 .ts 文件
2. **不校验域名**（开发环境）：详情 → 本地设置 → 勾选"不校验合法域名..."
3. **启用 ES6 转 ES5**：详情 → 本地设置 → 勾选"ES6 转 ES5"

## 第六步：开始开发

现在你可以开始开发了！

### 主要文件说明

| 文件 | 说明 |
|------|------|
| [app.ts](app.ts) | 小程序入口 |
| [pages/index/index.ts](pages/index/index.ts) | 首页逻辑 |
| [pages/alarm/alarm.ts](pages/alarm/alarm.ts) | 告警页面 |
| [pages/task/task.ts](pages/task/task.ts) | 任务页面 |
| [pages/mine/mine.ts](pages/mine/mine.ts) | 我的页面 |
| [utils/api.ts](utils/api.ts) | API 接口定义 |
| [utils/request.ts](utils/request.ts) | 请求封装 |
| [typings/types.d.ts](typings/types.d.ts) | 类型定义 |

### TypeScript 开发提示

1. **享受类型提示**：在 VSCode 中编辑 .ts 文件时，会有完整的类型提示
2. **编译错误**：开发者工具会自动编译并显示错误
3. **查看类型**：将鼠标悬停在变量上可以查看其类型

### API 调用示例

```typescript
// pages/index/index.ts
import { alarmApi } from '../../utils/api'

// 获取告警统计
async getAlarmStats() {
  try {
    const res = await alarmApi.getStats()
    // res.data 类型为 IStats，有完整的类型提示
    this.setData({
      todayAlarmCount: res.data.todayCount || 0,
      pendingTaskCount: res.data.pendingCount || 0
    })
  } catch (err) {
    console.error('获取告警统计失败', err)
  }
}
```

## 常用命令

```bash
# 编译 TypeScript（通常不需要手动执行）
npm run tsc

# 监听文件变化自动编译
npm run watch
```

## 调试技巧

1. **Console 面板**：查看日志输出
2. **Network 面板**：查看网络请求
3. **Storage 面板**：查看本地存储
4. **断点调试**：在 Sources 面板设置断点

## 下一步

- 查看 [README-TS.md](README-TS.md) 了解详细信息
- 查看 [typings/types.d.ts](typings/types.d.ts) 了解类型定义
- 开始实现具体功能

## 遇到问题？

- 检查微信开发者工具是否为最新版本
- 确保 Node.js 版本 >= 14
- 查看开发者工具的"详情 → 调试基础库"是否正确
- 检查 TypeScript 编译错误提示

祝开发顺利！🚀
