// pages/index/index.ts
import { systemApi, alarmApi } from '../../utils/api'

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
    pendingTaskCount: 12,
    menuItems: [
      {
        id: 1,
        name: '系统监控',
        icon: '../../images/menu/monitor.png',
        bgColor: '#e8f5e9',
        path: '/pages/monitor/monitor'
      },
      {
        id: 2,
        name: '自动告警',
        icon: '../../images/menu/bell.png',
        bgColor: '#fff3e0',
        path: '/pages/alarm/alarm'
      },
      {
        id: 3,
        name: '任务分发',
        icon: '../../images/menu/task-distribute.png',
        bgColor: '#e3f2fd',
        path: '/pages/task/task'
      },
      {
        id: 4,
        name: '远程协助',
        icon: '../../images/menu/remote.png',
        bgColor: '#f3e5f5',
        path: '/pages/remote/remote'
      },
      {
        id: 5,
        name: '运维建设',
        icon: '../../images/menu/ops.png',
        bgColor: '#e0f2f1',
        path: '/pages/ops/ops'
      },
      {
        id: 6,
        name: '生产协助',
        icon: '../../images/menu/production.png',
        bgColor: '#fce4ec',
        path: '/pages/production/production'
      }
    ]
  },

  onLoad() {
    // 检查是否已登录
    const token = wx.getStorageSync('token')
    if (!token) {
      wx.redirectTo({
        url: '/pages/login/login'
      })
      return
    }

    this.fetchData()
  },

  onShow() {
    // 页面显示时刷新数据
    this.fetchData()
  },

  onPullDownRefresh() {
    // 下拉刷新
    this.fetchData()
    wx.stopPullDownRefresh()
  },

  /**
   * 获取页面数据
   */
  fetchData() {
    this.getSystemStatus()
    this.getAlarmStats()
  },

  /**
   * 获取系统状态
   */
  async getSystemStatus() {
    try {
      const res = await systemApi.getStatus()
      this.setData({
        systemStatus: res.data.status || '正常运行'
      })
    } catch (err) {
      console.error('获取系统状态失败', err)
    }
  },

  /**
   * 获取告警统计
   */
  async getAlarmStats() {
    try {
      const res = await alarmApi.getStats()
      this.setData({
        todayAlarmCount: res.data.todayCount || 0,
        pendingTaskCount: res.data.pendingCount || 0
      })
    } catch (err) {
      console.error('获取告警统计失败', err)
    }
  },

  /**
   * 菜单点击事件
   */
  onMenuTap(e: WechatMiniprogram.BaseEvent) {
    const { path } = e.currentTarget.dataset
    if (path) {
      wx.navigateTo({
        url: path,
        fail: () => {
          wx.showToast({
            title: '页面开发中',
            icon: 'none'
          })
        }
      })
    }
  },

  /**
   * 更多按钮点击
   */
  onMoreTap() {
    wx.showToast({
      title: '更多功能开发中',
      icon: 'none'
    })
  },

  /**
   * 设置按钮点击
   */
  onSettingsTap() {
    wx.navigateTo({
      url: '/pages/settings/settings',
      fail: () => {
        wx.showToast({
          title: '设置页面开发中',
          icon: 'none'
        })
      }
    })
  }
})
