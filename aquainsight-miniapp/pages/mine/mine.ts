// pages/mine/mine.ts
import { userApi } from '../../utils/api'

interface IMineData {
  userInfo: IUserInfo
  stats: IStats
  menuList: IMenuItem[]
}

Page<IMineData>({
  data: {
    userInfo: {
      name: '',
      role: '',
      avatar: ''
    },
    stats: {
      alarmCount: 0,
      taskCount: 0,
      completedCount: 0
    },
    menuList: [
      {
        id: 1,
        name: '消息通知',
        icon: '../../images/menu/notification.png',
        path: '/pages/notification/notification'
      },
      {
        id: 2,
        name: '我的收藏',
        icon: '../../images/menu/favorite.png',
        path: '/pages/favorite/favorite'
      },
      {
        id: 3,
        name: '设置',
        icon: '../../images/menu/settings.png',
        path: '/pages/settings/settings'
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

    this.loadUserInfo()
    this.fetchStats()
  },

  onShow() {
    this.loadUserInfo()
    this.fetchStats()
  },

  /**
   * 加载用户信息
   */
  loadUserInfo() {
    const app = getApp<IAppOption>()
    const userInfo = app.globalData.userInfo
    if (userInfo) {
      this.setData({
        userInfo
      })
    }
  },

  /**
   * 获取统计数据
   */
  async fetchStats() {
    try {
      const res = await userApi.getUserStats()
      this.setData({
        stats: res.data || {}
      })
    } catch (err) {
      console.error('获取统计数据失败', err)
    }
  },

  /**
   * 用户信息点击
   */
  onUserInfoTap() {
    if (this.data.userInfo.name) {
      wx.navigateTo({
        url: '/pages/user-profile/user-profile',
        fail: () => {
          wx.showToast({
            title: '页面开发中',
            icon: 'none'
          })
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
        fail: () => {
          wx.showToast({
            title: '登录页面开发中',
            icon: 'none'
          })
        }
      })
    }
  },

  /**
   * 统计项点击
   */
  onStatTap(e: WechatMiniprogram.BaseEvent) {
    const { type } = e.currentTarget.dataset
    let url = ''

    switch (type) {
      case 'alarm':
        url = '/pages/alarm/alarm'
        break
      case 'task':
        url = '/pages/task/task'
        break
      case 'completed':
        url = '/pages/task/task?tab=2'
        break
    }

    if (url) {
      wx.navigateTo({
        url,
        fail: () => {
          wx.switchTab({
            url
          })
        }
      })
    }
  },

  /**
   * 菜单项点击
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
   * 关于我们点击
   */
  onAboutTap() {
    wx.navigateTo({
      url: '/pages/about/about',
      fail: () => {
        wx.showToast({
          title: '页面开发中',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 退出登录
   */
  onLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除token和用户信息
          const app = getApp<IAppOption>()
          app.globalData.userInfo = null
          wx.removeStorageSync('token')
          wx.removeStorageSync('userInfo')

          wx.showToast({
            title: '已退出登录',
            icon: 'success',
            duration: 1500
          })

          // 跳转到登录页
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/login/login'
            })
          }, 1500)
        }
      }
    })
  }
})
