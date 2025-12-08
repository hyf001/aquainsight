// pages/alarm/alarm.ts
import { alarmApi } from '../../utils/api'

interface IAlarmData {
  activeTab: number
  alarmList: IAlarm[]
}

Page<IAlarmData>({
  data: {
    activeTab: 0,
    alarmList: [
      {
        id: 1,
        level: 'high',
        levelText: '严重',
        title: '水质异常告警',
        description: '1号监测点水质检测超标，pH值异常',
        source: '水质监测系统',
        time: '10:05',
        status: 'pending',
        statusText: '未处理'
      },
      {
        id: 2,
        level: 'medium',
        levelText: '警告',
        title: '设备运行异常',
        description: '2号泵站设备运行参数异常，需要检查',
        source: '设备监控系统',
        time: '09:32',
        status: 'processing',
        statusText: '处理中'
      },
      {
        id: 3,
        level: 'low',
        levelText: '提示',
        title: '数据采集延迟',
        description: '3号站点数据采集延迟超过5分钟',
        source: '数据采集系统',
        time: '08:15',
        status: 'resolved',
        statusText: '已处理'
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

    this.fetchAlarmList()
  },

  onShow() {
    this.fetchAlarmList()
  },

  onPullDownRefresh() {
    this.fetchAlarmList()
    wx.stopPullDownRefresh()
  },

  /**
   * 标签切换
   */
  onTabChange(e: WechatMiniprogram.BaseEvent) {
    const { index } = e.currentTarget.dataset
    this.setData({
      activeTab: Number(index)
    })
    this.fetchAlarmList()
  },

  /**
   * 获取告警列表
   */
  async fetchAlarmList() {
    const { activeTab } = this.data

    let status: string | undefined
    if (activeTab === 1) {
      status = 'pending'
    } else if (activeTab === 2) {
      status = 'resolved'
    }

    try {
      const res = await alarmApi.getList({ status })
      this.setData({
        alarmList: res.data || []
      })
    } catch (err) {
      console.error('获取告警列表失败', err)
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  },

  /**
   * 告警项点击
   */
  onAlarmTap(e: WechatMiniprogram.BaseEvent) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/alarm-detail/alarm-detail?id=${id}`,
      fail: () => {
        wx.showToast({
          title: '详情页面开发中',
          icon: 'none'
        })
      }
    })
  }
})
