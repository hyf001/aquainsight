# AquaInsight Ant Design 到 Tailwind CSS 迁移记录

## 项目信息

- **项目名称**: AquaInsight 水质监测平台
- **迁移开始时间**: 2026-01-08
- **技术栈变更**: Ant Design 6.0 + LESS → Tailwind CSS 3.4 + Ocean Depths 主题

## 迁移策略

- **方式**: 分阶段渐进式迁移
- **主题**: 只保留 Ocean Depths 单一主题（移除多主题切换）
- **范围**: 完全替换所有 Ant Design 组件为 Tailwind CSS 原生实现

---

## 已完成阶段

### ✅ 阶段 1: 基础设施搭建（已完成）

**完成时间**: 2026-01-08

#### 安装的依赖

```bash
# 核心依赖
tailwindcss@^3.4.0
postcss@^8.4.0
autoprefixer@^10.4.0

# UI 组件库
@headlessui/react@^2.0.0
@heroicons/react@^2.1.0

# 工具库
clsx@^2.1.0
react-hook-form@^7.51.0
react-day-picker@^8.10.0
date-fns@^3.0.0
```

#### 新建的配置文件

1. **tailwind.config.js** - Tailwind 配置
   - Ocean Depths 主题完整配色定义
   - 自定义颜色 (ocean-navy, ocean-teal, ocean-seafoam, ocean-cream)
   - 字体、间距、阴影等设计令牌

2. **postcss.config.js** - PostCSS 配置
   - Tailwind CSS 插件
   - Autoprefixer 插件

3. **src/styles/tailwind.css** - Tailwind 样式入口
   - @tailwind base/components/utilities
   - 自定义滚动条样式
   - Ocean Depths 渐变工具类

#### 新建的工具文件

- **src/utils/cn.ts** - className 合并工具函数

#### 新建的基础 UI 组件

所有组件位于 `src/components/ui/`：

1. **Button.tsx** - 按钮组件
   - 6 种变体：primary, secondary, accent, outline, ghost, danger
   - 3 种尺寸：sm, md, lg
   - 支持 loading 状态和图标

2. **Card.tsx** - 卡片组件
   - Card, CardHeader, CardBody, CardFooter
   - 可选边框、阴影、悬停效果

3. **Input.tsx** - 输入框组件
   - Input, TextArea
   - 支持前缀/后缀图标
   - 错误状态

4. **Badge.tsx** - 徽章组件
   - 7 种颜色变体
   - 3 种尺寸
   - 支持圆点模式

5. **index.ts** - 组件库导出文件

#### 修改的文件

1. **src/main.tsx**
   - ✅ 添加 `import './styles/tailwind.css'`

2. **package.json**
   - ✅ 新增所有依赖

#### 验证结果

- ✅ Tailwind CSS 正常工作
- ✅ 开发服务器成功启动
- ✅ 基础组件可以正常渲染
- ✅ Ant Design 仍可正常使用（渐进式迁移）

---

### ✅ 阶段 2: 核心布局迁移（已完成）

**完成时间**: 2026-01-08

#### 新建的 UI 组件

所有组件位于 `src/components/ui/`：

1. **Spin.tsx** - 加载动画组件
   - 3 种尺寸：sm, md, lg
   - 支持 tip 文本
   - 支持包裹子元素

2. **Avatar.tsx** - 头像组件
   - 4 种尺寸：sm, md, lg, xl
   - 2 种形状：circle, square
   - 支持图片、图标、文字

3. **Dropdown.tsx** - 下拉菜单组件（基于 @headlessui/react）
   - Dropdown, DropdownItem, DropdownDivider
   - 4 种位置：bottom-start, bottom-end, top-start, top-end
   - 支持危险项、禁用项

4. **Menu.tsx** - 菜单组件
   - Menu, Menu.Item, Menu.SubMenu
   - 支持垂直/横向模式
   - 支持多选、展开/折叠

5. **Tabs.tsx** - 标签组件
   - 2 种类型：line, card
   - 3 种尺寸：sm, md, lg
   - 支持可关闭标签、额外内容

6. **Empty.tsx** - 空状态组件
   - 自定义描述和图标

#### 完全迁移的组件

1. **src/components/Layout/index.tsx** ⚠️ 重大变更

   **移除的导入**:
   ```typescript
   // ❌ 移除
   import { Layout as AntLayout, Menu, ConfigProvider, Avatar, Dropdown, Badge } from 'antd'
   import { BankOutlined, TeamOutlined, ... } from '@ant-design/icons'
   import { useThemeStore } from '@/stores/useThemeStore'
   import ThemeSwitcher from '@/components/ThemeSwitcher'
   ```

   **新增的导入**:
   ```typescript
   // ✅ 新增
   import { BuildingOfficeIcon, UserGroupIcon, ... } from '@heroicons/react/24/outline'
   import { Menu, Avatar, Dropdown, DropdownItem, DropdownDivider } from '@/components/ui'
   ```

   **主要变更**:
   - ✅ 完全使用 Tailwind CSS 类名
   - ✅ 所有图标替换为 Heroicons
   - ✅ 顶部导航栏应用 Ocean Depths 主题
   - ✅ 侧边菜单使用新的 Menu 组件
   - ✅ 用户下拉菜单使用新的 Dropdown 组件
   - ✅ 移除 ConfigProvider 和主题配置
   - ✅ 移除 ThemeSwitcher 组件引用

2. **src/components/TabsBar/index.tsx** ⚠️ 重大变更

   **移除的导入**:
   ```typescript
   // ❌ 移除
   import { Tabs } from 'antd'
   import { CloseOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons'
   import './styles.less'
   ```

   **新增的导入**:
   ```typescript
   // ✅ 新增
   import { XMarkIcon, ArrowPathIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'
   import { Tabs } from '@/components/ui'
   ```

   **主要变更**:
   - ✅ 使用新的 Tabs 组件
   - ✅ 图标替换为 Heroicons
   - ✅ 完全使用 Tailwind CSS 样式

3. **src/components/NotificationDropdown/index.tsx** ⚠️ 重大变更

   **移除的导入**:
   ```typescript
   // ❌ 移除
   import { Badge, Dropdown, Button, Empty, Spin } from 'antd'
   import { BellOutlined } from '@ant-design/icons'
   import './styles.less'
   ```

   **新增的导入**:
   ```typescript
   // ✅ 新增
   import { Badge, Dropdown, Spin, Empty, Button } from '@/components/ui'
   import { BellIcon } from '@heroicons/react/24/outline'
   import { cn } from '@/utils/cn'
   ```

   **主要变更**:
   - ✅ 使用新的 UI 组件
   - ✅ 完全重写样式为 Tailwind CSS
   - ✅ 优化通知列表布局和交互

#### 修改的文件

1. **src/App.tsx** ⚠️ 重大变更

   **变更前**:
   ```typescript
   import { ConfigProvider } from 'antd'
   import zhCN from 'antd/locale/zh_CN'

   return (
     <ConfigProvider locale={zhCN}>
       <RouterProvider router={router} />
     </ConfigProvider>
   )
   ```

   **变更后**:
   ```typescript
   // 完全移除 Ant Design
   return <RouterProvider router={router} />
   ```

2. **src/router/index.tsx** ⚠️ 部分变更

   **变更**:
   ```typescript
   // ❌ 移除
   import { Spin } from 'antd'

   // ✅ 新增
   import { Spin } from '@/components/ui'

   // 更新 PageLoading 组件使用 Tailwind CSS
   ```

3. **src/components/ui/index.ts** - 持续更新
   - 新增 Spin, Avatar, Dropdown, Menu, Tabs, Empty 导出

#### 删除的文件和目录

1. **src/components/ThemeSwitcher/** - 整个目录
   - index.tsx
   - styles.less

2. **src/config/themes.ts** - 主题配置文件

3. **src/stores/useThemeStore.ts** - 主题状态管理

4. **所有 styles.less 文件**
   - src/components/Layout/styles.less
   - src/components/TabsBar/styles.less
   - src/components/NotificationDropdown/styles.less

#### Ocean Depths 主题应用

**主题配色**:
```css
ocean-navy:    #1a2332  /* 深海军蓝 - 主色 */
ocean-teal:    #2d8b8b  /* 青色 - 强调色 */
ocean-seafoam: #a8dadc  /* 海泡绿 - 辅助色 */
background:    #f1faee  /* 米白 - 背景色 */
```

**应用位置**:
- ✅ 顶部导航栏：bg-ocean-navy
- ✅ 激活菜单项：bg-ocean-teal
- ✅ 悬停效果：hover:bg-ocean-seafoam
- ✅ 页面背景：bg-background
- ✅ 侧边菜单选中：bg-ocean-teal

#### 图标迁移统计

**完全替换的图标**:
- BankOutlined → BuildingOfficeIcon
- TeamOutlined → UserGroupIcon
- EnvironmentOutlined → MapPinIcon
- ToolOutlined → WrenchScrewdriverIcon
- ExperimentOutlined → BeakerIcon
- DesktopOutlined → ComputerDesktopIcon
- BellOutlined → BellIcon
- MailOutlined → EnvelopeIcon
- SettingOutlined → Cog6ToothIcon
- LogoutOutlined → ArrowRightOnRectangleIcon
- UserOutlined → UserIcon
- CloseOutlined → XMarkIcon
- ReloadOutlined → ArrowPathIcon

#### 验证结果

- ✅ 布局组件完全迁移
- ✅ 所有核心 UI 组件正常工作
- ✅ 主题切换功能已移除
- ✅ 所有 LESS 样式文件已清理
- ✅ Ant Design 仅在未迁移的页面中使用

---

## 当前项目状态

### 已迁移的部分

| 组件/模块 | 状态 | 说明 |
|---------|------|------|
| Tailwind 基础设施 | ✅ 完成 | 配置文件、样式入口、工具函数 |
| 基础 UI 组件库 | ✅ 完成 | Button, Card, Input, Badge, Spin, Avatar, Password |
| 高级 UI 组件库 | ✅ 完成 | Dropdown, Menu, Tabs, Empty |
| 表单组件 | ✅ 完成 | Form, FormField, Select, Checkbox, Radio, Switch |
| 数据展示组件 | ✅ 完成 | Table, Pagination, Tree, Statistic, Divider, Tag |
| 反馈组件 | ✅ 完成 | Modal, Tooltip, Popconfirm, Toast |
| Layout 主布局 | ✅ 完成 | 顶部导航、侧边菜单、用户菜单 |
| TabsBar 标签栏 | ✅ 完成 | 多标签页管理 |
| NotificationDropdown | ✅ 完成 | 告警通知下拉 |
| Login 登录页 | ✅ 完成 | React Hook Form + 动画效果 |
| Dashboard 仪表板 | ✅ 完成 | 响应式卡片布局 |
| 主题系统 | ✅ 简化 | Ocean Depths 单一主题 |
| App.tsx | ✅ 完成 | 移除 ConfigProvider |
| router/index.tsx | ✅ 完成 | Spin 组件已替换 |

**UI 组件总数**: 27 个

### 未迁移的部分

| 组件/模块 | 状态 | 优先级 |
|---------|------|-------|
| 业务页面 (20+ 页面) | ❌ 待迁移 | 高 - 阶段 4-5 |
| 特殊组件 | ❌ 待迁移 | 中 - 阶段 5 |

**需要迁移的页面**:
- Organization (组织管理) - 使用 Tree
- Personnel (人员管理) - 使用 Table + Modal
- Sites (站点管理) - 使用 Table + Modal
- Enterprise (企业管理) - 使用 Table + Modal
- DetectionFactors (检测因子) - 使用 Table
- SiteDevices (设备信息) - 使用 Table
- DeviceModels (设备管理) - 使用 Table
- Task (任务管理) - 使用 Table + Steps
- AlertRules (告警规则) - 使用 Table + Modal
- AlertRecords (告警记录) - 使用 Table
- AlertNotifications (消息通知) - 使用 Table
- StepTemplates (步骤模版) - 使用 Table
- TaskTemplates (任务模版) - 使用 Table
- SiteConfiguration (站点任务调度) - 使用 Table
- Analysis (数据分析) - 图表为主
- Knowledge (知识库) - 使用 Table
- Material (物资管理) - 使用 Table
- Monitor (监控) - 自定义界面
- System (系统设置) - 使用 Form

### Ant Design 使用情况

**仍在使用 Ant Design 的文件数**: 约 20 个页面组件

**仍需迁移的 Ant Design 组件**:
- DatePicker (日期选择器) - 阶段 5
- Steps (步骤条) - 阶段 5
- Upload (文件上传) - 阶段 5
- Progress (进度条) - 阶段 5
- Drawer (抽屉) - 可选
- Alert (警告提示) - 阶段 5

**已完成替换的组件**:
- ✅ Form, Input, Select (表单相关)
- ✅ Table, Pagination (数据表格)
- ✅ Modal (对话框)
- ✅ Tree (树形控件)
- ✅ Switch, Checkbox, Radio (表单控件)
- ✅ Tag (标签)
- ✅ Tooltip, Popconfirm (提示)
- ✅ Button, Card, Badge, Spin, Avatar
- ✅ Divider, Statistic

---

## 下一步计划

### 阶段 4-5: 业务页面迁移（进行中）

**目标**: 使用已创建的 UI 组件库迁移所有业务页面

**优先级顺序**:

1. **高优先级** - 核心管理页面（使用频率高）
   - Organization (组织管理) - Tree + Table
   - Personnel (人员管理) - Table + Modal + Form
   - Sites (站点管理) - Table + Modal + Form
   - Enterprise (企业管理) - Table + Modal + Form

2. **中优先级** - 基础数据管理
   - DetectionFactors (检测因子) - Table + Modal
   - SiteDevices (设备信息) - Table + Modal
   - DeviceModels (设备管理) - Table + Modal

3. **中优先级** - 任务和告警管理
   - Task (任务管理) - Table + Steps (需创建)
   - AlertRules (告警规则) - Table + Modal
   - AlertRecords (告警记录) - Table
   - AlertNotifications (消息通知) - Table

4. **低优先级** - 其他功能页面
   - StepTemplates (步骤模版) - Table
   - TaskTemplates (任务模版) - Table
   - SiteConfiguration (站点任务调度) - Table
   - Analysis (数据分析) - 图表 + Card
   - Knowledge (知识库) - Table
   - Material (物资管理) - Table
   - Monitor (监控) - 自定义
   - System (系统设置) - Form

**预计工作量**: 每个页面 0.5-2 小时，总计 20-40 小时

---

### 阶段 6: 特殊组件和清理（计划中）

**需要创建的特殊组件**:
- DatePicker - 日期选择器（使用 react-day-picker）
- Steps - 步骤条组件
- Upload - 上传组件
- Progress - 进度条组件
- Alert - 警告提示组件
- Drawer - 抽屉组件（可选）

**清理任务**:
- [ ] 卸载 Ant Design 依赖
- [ ] 删除所有剩余 LESS 文件
- [ ] 代码审查和优化
- [ ] 性能优化
- [ ] 更新开发文档

**预计工作量**: 2-3 天

---

## 技术决策记录

### 为什么选择这些库？

1. **@headlessui/react**
   - 无样式、可访问的 UI 组件
   - 与 Tailwind CSS 完美集成
   - 提供 Dropdown、Modal 等复杂组件的基础

2. **@heroicons/react**
   - Tailwind CSS 官方图标库
   - 与 Tailwind 设计系统一致
   - 体积小、性能好

3. **React Hook Form**
   - 性能优秀（非受控组件）
   - TypeScript 友好
   - 内置验证
   - 易于集成自定义组件

4. **react-day-picker**
   - 轻量级日期选择器
   - 可定制性强
   - 与 date-fns 集成

### 为什么移除多主题功能？

1. **简化维护**: 单一主题减少维护成本
2. **品牌一致性**: Ocean Depths 主题完美契合水质监测主题
3. **减少复杂度**: 移除主题切换逻辑和状态管理

### Ocean Depths 主题设计理念

- **深海军蓝**: 稳重、专业，适合企业级应用
- **青色**: 水的象征，与水质监测主题契合
- **海泡绿**: 清新、活力，提供视觉亮点
- **米白**: 柔和的背景色，减少视觉疲劳

---

## 风险和注意事项

### 已知问题

1. **react-day-picker 与 React 19 兼容性**
   - 使用 --legacy-peer-deps 安装
   - 实际运行正常，仅 peer dependencies 警告

2. **样式冲突风险**
   - 在过渡期 Ant Design 和 Tailwind 共存
   - 已验证：无明显冲突

### 待解决问题

1. **表格组件实现**
   - 需要决定：原生实现 vs TanStack Table
   - 建议：简单表格用原生，复杂表格用 TanStack Table

2. **表单验证**
   - 需要集成 React Hook Form
   - 需要设计统一的错误展示

3. **日期选择器本地化**
   - 需要配置 react-day-picker 中文语言包
   - 需要保持 dayjs 中文支持

---

## 开发规范

### 组件开发规范

1. **使用 React.forwardRef**
   ```typescript
   const Component = React.forwardRef<HTMLDivElement, Props>(...)
   ```

2. **使用 cn 工具合并类名**
   ```typescript
   import { cn } from '@/utils/cn'
   className={cn('base-class', conditionalClass && 'active', className)}
   ```

3. **统一使用 Heroicons**
   ```typescript
   import { IconName } from '@heroicons/react/24/outline'
   <IconName className="w-5 h-5" />
   ```

4. **组件导出规范**
   ```typescript
   // 默认导出组件
   export default Component
   // 命名导出类型
   export type { ComponentProps }
   ```

### Tailwind CSS 规范

1. **优先使用主题色**
   ```typescript
   // ✅ 推荐
   bg-ocean-navy text-ocean-cream

   // ❌ 避免
   bg-blue-900 text-white
   ```

2. **使用语义化类名**
   ```typescript
   // ✅ 推荐
   <button className="btn-primary">

   // ❌ 避免
   <button className="bg-blue-500 px-4 py-2">
   ```

3. **响应式设计**
   ```typescript
   className="text-sm md:text-base lg:text-lg"
   ```

---

## 附录

### 文件变更统计

**新增文件**: 38+ 个
- 配置文件: 2 个 (tailwind.config.js, postcss.config.js)
- UI 组件: 27 个 (Button, Card, Input, Badge, Spin, Avatar, Dropdown, Menu, Tabs, Empty, Divider, Statistic, Form, FormField, Password, Tooltip, Modal, Select, Tag, Switch, Checkbox, Radio, Popconfirm, Table, Pagination, Tree)
- 工具文件: 2 个 (cn.ts, toast.ts)
- 样式文件: 1 个 (tailwind.css)
- 导出文件: 1 个 (ui/index.ts)
- 文档文件: 5 个 (MIGRATION_LOG.md 等)

**修改文件**: 10+ 个
- 核心文件: 3 个 (App.tsx, main.tsx, router/index.tsx)
- 组件文件: 3 个 (Layout, TabsBar, NotificationDropdown)
- 页面文��: 2 个 (Login, Dashboard)
- 配置文件: 2 个 (package.json, tailwind.config.js)
- 工具文件: 1 个 (request.ts)

**删除文件**: 10+ 个
- 组件目录: 1 个 (ThemeSwitcher)
- 配置文件: 1 个 (themes.ts)
- Store 文件: 1 个 (useThemeStore.ts)
- 样式文件: 5+ 个 (Layout/styles.less, TabsBar/styles.less, NotificationDropdown/styles.less, Login/styles.less, Dashboard/styles.less)
- 其他 LESS 文件: 若干

### 依赖包体积对比

**Ant Design** (移除后):
- antd: ~2.3MB (gzipped: ~600KB)
- @ant-design/icons: ~800KB (gzipped: ~200KB)
- less: ~300KB

**新增依赖**:
- @headlessui/react: ~50KB (gzipped: ~15KB)
- @heroicons/react: ~1MB (gzipped: ~50KB, tree-shaking 后更小)
- react-hook-form: ~40KB (gzipped: ~12KB)
- clsx: ~2KB

**预计优化**: 打包体积减少约 1.5-2MB

---

## 更新日志

### 2026-01-08

**阶段 1 完成**:
- ✅ 安装所有必需依赖
- ✅ 配置 Tailwind CSS
- ✅ 创建基础 UI 组件库 (Button, Card, Input, Badge)
- ✅ 验证环境配置

**阶段 2 完成**:
- ✅ 创建高级 UI 组件 (Spin, Avatar, Dropdown, Menu, Tabs, Empty)
- ✅ 迁移 Layout 主布局
- ✅ 迁移 TabsBar 标签栏
- ✅ 迁移 NotificationDropdown 通知下拉
- ✅ 移除主题切换功能
- ✅ 清理 LESS 样式文件
- ✅ 更新 App.tsx 和 router

**阶段 3 完成**:
- ✅ 创建 Toast 消息提示系统
- ✅ 创建表单组件 (Form, FormField, Password)
- ✅ 创建数据展示组件 (Divider, Statistic)
- ✅ 迁移 Login 登录页
- ✅ 迁移 Dashboard 仪表板
- ✅ 更新 request.ts 使用 toast

**阶段 4 UI 组件完成**:
- ✅ 创建 Tooltip 提示框组件
- ✅ 创建 Modal 模态框组件
- ✅ 创建 Select 下拉选择组件
- ✅ 创建 Tag 标签组件
- ✅ 创建 Switch 开关组件
- ✅ 创建 Checkbox 复选框组件
- ✅ 创建 Radio 单选框组件
- ✅ 创建 Popconfirm 确认弹框组件
- ✅ 创建 Table 表格组件
- ✅ 创建 Pagination 分页组件
- ✅ 创建 Tree 树形组件
- ✅ 更新组件导出文件
- ✅ 更新 MIGRATION_LOG.md 文档

**组件库统计**:
- 已创建组件: 27 个
- 已迁移页面: 2 个 (Login, Dashboard)
- 待迁移页面: 20+ 个

---

### ✅ 阶段 3: 登录页和仪表板迁移（已完成）

**完成时间**: 2026-01-08

#### 新建的工具和组件

1. **src/utils/toast.ts** - Toast 消息提示系统
   - 替换 antd.message
   - 支持 success/error/warning/info 类型
   - 自动消失和手动关闭
   - 兼容 antd.message API

2. **src/components/ui/Divider.tsx** - 分割线组件
   - 支持水平/垂直方向
   - 支持带文字的分割线
   - 支持虚线样式

3. **src/components/ui/Statistic.tsx** - 统计数字组件
   - 支持前缀/后缀
   - 支持精度控制
   - 支持加载状态

4. **src/components/ui/Form.tsx** - 表单组件
   - 集成 React Hook Form
   - 支持水平/垂直布局
   - Context API 状态共享

5. **src/components/ui/FormField.tsx** - 表单字段组件
   - 验证和错误展示
   - 支持标签和描述
   - 支持必填标识

6. **src/components/ui/Input.tsx** - 新增 Password 组件
   - 密码可见性切换
   - Eye/EyeSlash 图标

#### 完全迁移的页面

1. **src/pages/Login/index.tsx** - 登录页
   - ✅ 使用 React Hook Form
   - ✅ Ocean Depths 主题渐变背景
   - ✅ 动画背景装饰
   - ✅ 所有图标替换为 Heroicons
   - ✅ 删除 styles.less

2. **src/pages/Dashboard/index.tsx** - 仪表板
   - ✅ 响应式网格布局
   - ✅ 替换 12+ 图标
   - ✅ 卡片悬停效果
   - ✅ 4 个统计区域
   - ✅ 删除 styles.less

#### 修改的文件

1. **tailwind.config.js** - 新增动画
   - fadeInUp, slideInDown, moveBackground

2. **src/services/request.ts** - 使用 toast
   - 所有 message.error() → toast.error()

3. **src/components/ui/index.ts** - 导出新组件

#### 验证结果

- ✅ 登录页功能正常
- ✅ 表单验证正确工作
- ✅ 仪表板数据正常显示
- ✅ Toast 消息正常弹出

---

### ✅ 阶段 4: 数据表格和表单组件（UI 组件已完成）

**完成时间**: 2026-01-08

#### 新建的 UI 组件

所有组件位于 `src/components/ui/`：

1. **Tooltip.tsx** - 提示框组件
   - 4 种位置：top/bottom/left/right
   - 自动定位
   - 悬停触发

2. **Modal.tsx** - 模态框组件（基于 @headlessui/react）
   - 支持标题、内容、底部
   - 支持自定义宽度
   - 遮罩点击关闭
   - 确认/取消回调
   - 加载状态

3. **Select.tsx** - 下拉选择组件（基于 @headlessui/react）
   - 支持选项列表
   - 支持禁用选项
   - 键盘导航
   - 选中状态标识

4. **Tag.tsx** - 标签组件
   - 10 种颜色变体
   - 可关闭
   - 关闭回调

5. **Switch.tsx** - 开关组件（基于 @headlessui/react）
   - 平滑过渡动画
   - 支持禁用
   - Ocean Depths 主题色

6. **Checkbox.tsx** - 复选框组件
   - 支持半选状态
   - 支持标签文字
   - 支持禁用

7. **Radio.tsx** - 单选框组件
   - RadioGroup 和 Radio
   - 使用 @headlessui/react
   - 支持禁用

8. **Popconfirm.tsx** - 确认弹框组件
   - 4 种位置
   - 确认/取消回调
   - 支持异步确认
   - 加载状态

9. **Table.tsx** - 表格组件
   - 支持列定义
   - 支持行选择
   - 支持自定义渲染
   - 3 种尺寸：small/middle/large
   - 加载状态
   - 空状态展示

10. **Pagination.tsx** - 分页组件
    - 页码跳转
    - 每页条数选择
    - 总数显示
    - 智能页码显示（省略号）

11. **Tree.tsx** - 树形组件
    - 展开/收起
    - 选中状态
    - 支持图标
    - 支持禁用
    - 多级嵌套

#### 修改的文件

1. **src/components/ui/index.ts** - 新增导出
   - 导出所有 11 个新组件及其类型

#### 图标迁移统计（阶段 3 + 4）

**新增图标**（除阶段 2 已有）:
- UserIcon → 用户
- LockClosedIcon → 锁
- XMarkIcon → 关闭
- CheckIcon → 选中
- ChevronUpDownIcon → 上下箭头
- ChevronLeftIcon → 左箭头
- ChevronRightIcon → 右箭头
- ChevronDownIcon → 下箭头
- ExclamationTriangleIcon → 警告（多处使用）
- EyeIcon/EyeSlashIcon → 显示/隐藏密码

#### 验证结果

- ✅ 所有 UI 组件创建完成
- ✅ 组件正确导出
- ✅ TypeScript 类型完整
- ✅ 样式与 Ocean Depths 主题一致

#### 未完成部分

- ⏳ 业务页面迁移（待进行）
  - Organization (组织管理)
  - Personnel (人员管理)
  - Sites (站点管理)
  - Enterprise (企业管理)
  - DetectionFactors (检测因子)
  - SiteDevices (设备信息)
  - DeviceModels (设备管理)

---

**最后更新**: 2026-01-08
**当前阶段**: 阶段 4 UI 组件完成，准备迁移业务页面
**整体进度**: 约 40% 完成（基础架构和核心组件已完成）
