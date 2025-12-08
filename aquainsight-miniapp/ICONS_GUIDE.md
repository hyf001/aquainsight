# 图标准备指南

## 当前状态

为了让小程序能够正常启动，我已经暂时移除了底部导航栏的图标配置。现在底部导航栏只显示文字，没有图标。

## 需要准备的图标

### 底部导航栏图标（必需）

需要准备 8 个图标文件，放在 `images/` 目录：

| 图标文件 | 说明 | 建议尺寸 |
|---------|------|---------|
| `images/home.png` | 首页图标（未选中） | 81px × 81px |
| `images/home-active.png` | 首页图标（选中） | 81px × 81px |
| `images/alarm.png` | 告警图标（未选中） | 81px × 81px |
| `images/alarm-active.png` | 告警图标（选中） | 81px × 81px |
| `images/task.png` | 任务图标（未选中） | 81px × 81px |
| `images/task-active.png` | 任务图标（选中） | 81px × 81px |
| `images/mine.png` | 我的图标（未选中） | 81px × 81px |
| `images/mine-active.png` | 我的图标（选中） | 81px × 81px |

### 功能菜单图标（可选）

这些图标用于首页的功能菜单，放在 `images/menu/` 目录：

| 图标文件 | 说明 | 建议尺寸 |
|---------|------|---------|
| `images/menu/monitor.png` | 系统监控 | 56px × 56px |
| `images/menu/bell.png` | 自动告警 | 56px × 56px |
| `images/menu/task-distribute.png` | 任务分发 | 56px × 56px |
| `images/menu/remote.png` | 远程协助 | 56px × 56px |
| `images/menu/ops.png` | 运维建设 | 56px × 56px |
| `images/menu/production.png` | 生产协助 | 56px × 56px |
| `images/menu/notification.png` | 消息通知 | 56px × 56px |
| `images/menu/favorite.png` | 收藏 | 56px × 56px |
| `images/menu/settings.png` | 设置 | 56px × 56px |
| `images/menu/about.png` | 关于 | 56px × 56px |

### 其他图标（可选）

| 图标文件 | 说明 | 建议尺寸 |
|---------|------|---------|
| `images/more.png` | 更多按钮 | 44px × 44px |
| `images/settings.png` | 设置按钮 | 44px × 44px |
| `images/arrow-right.png` | 右箭头 | 32px × 32px |
| `images/empty.png` | 空状态图标 | 200px × 200px |
| `images/default-avatar.png` | 默认头像 | 120px × 120px |
| `images/avatar.png` | 示例头像 | 120px × 120px |

## 图标要求

1. **格式**: PNG 格式（支持透明背景）
2. **尺寸**: 按照上表建议尺寸准备
3. **颜色**:
   - 未选中状态：灰色 (#999999)
   - 选中状态：绿色 (#07c160)
4. **背景**: 透明背景

## 如何添加图标

### 方法 1: 准备好图标后恢复配置

1. 将准备好的图标文件放到对应目录
2. 编辑 [app.json](app.json)，恢复图标配置：

```json
{
  "tabBar": {
    "color": "#999999",
    "selectedColor": "#07c160",
    "backgroundColor": "#ffffff",
    "borderStyle": "black",
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "首页",
        "iconPath": "images/home.png",
        "selectedIconPath": "images/home-active.png"
      },
      {
        "pagePath": "pages/alarm/alarm",
        "text": "告警",
        "iconPath": "images/alarm.png",
        "selectedIconPath": "images/alarm-active.png"
      },
      {
        "pagePath": "pages/task/task",
        "text": "任务",
        "iconPath": "images/task.png",
        "selectedIconPath": "images/task-active.png"
      },
      {
        "pagePath": "pages/mine/mine",
        "text": "我的",
        "iconPath": "images/mine.png",
        "selectedIconPath": "images/mine-active.png"
      }
    ]
  }
}
```

### 方法 2: 使用 iconfont 图标库

1. 访问 [iconfont.cn](https://www.iconfont.cn/)
2. 搜索需要的图标（home、alarm、task、user等）
3. 下载 PNG 格式
4. 调整为所需尺寸
5. 放到项目对应目录

### 方法 3: 使用在线工具生成

可以使用以下在线工具生成简单的图标：

- [Flaticon](https://www.flaticon.com/)
- [IconFinder](https://www.iconfinder.com/)
- [Icons8](https://icons8.com/)

## 临时方案

目前小程序使用纯文字导航栏，可以正常运行。等图标准备好后再添加即可。

## 注意事项

⚠️ **重要**: 微信小程序对 tabBar 图标有严格要求：
- 图标大小限制在 40kb 以内
- 建议尺寸：81px × 81px
- 必须是本地图片，不能使用网络图片
- 不支持 SVG 格式

## 快速开始

如果你想快速体验，可以先不添加图标，当前配置已经可以正常运行。
