// pages/login/login.ts
import { userApi } from '../../utils/api'

Page({
  data: {
    phone: '',
    password: '',
    loading: false
  },

  onLoad() {
    // 检查是否已登录
    const token = wx.getStorageSync('token')
    if (token) {
      // 已登录，跳转到首页
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
  },

  /**
   * 手机号输入
   */
  onPhoneInput(e: any) {
    this.setData({
      phone: e.detail.value
    })
  },

  /**
   * 密码输入
   */
  onPasswordInput(e: any) {
    this.setData({
      password: e.detail.value
    })
  },

  /**
   * 处理登录
   */
  async handleLogin() {
    const { phone, password } = this.data

    // 表单验证
    if (!phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return
    }

    if (!/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none'
      })
      return
    }

    if (!password) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      })
      return
    }

    // 开始登录
    this.setData({ loading: true })

    try {
      const response = await userApi.login({ phone, password })

      if (response.code === '0000' && response.data) {
        const { token, user } = response.data

        // 保存token和用户信息
        wx.setStorageSync('token', token)
        wx.setStorageSync('userInfo', user)

        // 更新全局数据
        const app = getApp<IAppOption>()
        app.globalData.userInfo = user

        wx.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 1500
        })

        // 延迟跳转到首页
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/index/index'
          })
        }, 1500)
      } else {
        wx.showToast({
          title: response.message || '登录失败',
          icon: 'none'
        })
      }
    } catch (error: any) {
      console.error('登录失败:', error)
      wx.showToast({
        title: error.message || '登录失败，请重试',
        icon: 'none'
      })
    } finally {
      this.setData({ loading: false })
    }
  }
})
