// app.ts
interface IAppOption {
  globalData: IAppGlobalData
  getUserInfo(): void
  checkUpdate(): void
}

App<IAppOption>({
  globalData: {
    userInfo: null,
    apiBaseUrl: 'http://192.168.3.215:8080/aquainsight/api'
  },

  onLaunch() {
    // 小程序启动时执行
    console.log('Aquainsight小程序启动')

    // 获取用户信息
    this.getUserInfo()

    // 检查更新
    this.checkUpdate()
  },

  onShow() {
    // 小程序显示时执行
  },

  onHide() {
    // 小程序隐藏时执行
  },

  getUserInfo() {
    const userInfo = wx.getStorageSync<IUserInfo>('userInfo')
    if (userInfo) {
      this.globalData.userInfo = userInfo
    }
  },

  checkUpdate() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()

      updateManager.onCheckForUpdate((res) => {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(() => {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: (res) => {
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })

          updateManager.onUpdateFailed(() => {
            wx.showModal({
              title: '更新提示',
              content: '新版本下载失败',
              showCancel: false
            })
          })
        }
      })
    }
  }
})
