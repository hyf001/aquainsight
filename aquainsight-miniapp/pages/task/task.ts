// pages/task/task.ts
import { taskApi } from '../../utils/api'

interface ITaskData {
  activeTab: number
  taskList: ITask[]
}

Page<ITaskData>({
  data: {
    activeTab: 0,
    taskList: [
      {
        id: 1,
        priority: 'high',
        priorityText: '紧急',
        title: '处理水质异常告警',
        description: '1号监测点水质检测超标，需要立即处理',
        assigneeAvatar: '../../images/avatar.png',
        assigneeName: '张三',
        createTime: '10:05',
        status: 'pending',
        statusText: '待办'
      },
      {
        id: 2,
        priority: 'medium',
        priorityText: '普通',
        title: '检查设备运行状态',
        description: '2号泵站设备需要进行日常巡检',
        assigneeAvatar: '../../images/avatar.png',
        assigneeName: '李四',
        createTime: '昨天',
        status: 'processing',
        statusText: '进行中'
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

    this.fetchTaskList()
  },

  onShow() {
    this.fetchTaskList()
  },

  onPullDownRefresh() {
    this.fetchTaskList()
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
    this.fetchTaskList()
  },

  /**
   * 获取任务列表
   */
  async fetchTaskList() {
    const { activeTab } = this.data

    let status: 'pending' | 'processing' | 'completed' | undefined
    if (activeTab === 0) {
      status = 'pending'
    } else if (activeTab === 1) {
      status = 'processing'
    } else if (activeTab === 2) {
      status = 'completed'
    }

    try {
      const res = await taskApi.getList({ status })
      this.setData({
        taskList: res.data || []
      })
    } catch (err) {
      console.error('获取任务列表失败', err)
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  },

  /**
   * 任务项点击
   */
  onTaskTap(e: WechatMiniprogram.BaseEvent) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/task-detail/task-detail?id=${id}`,
      fail: () => {
        wx.showToast({
          title: '详情页面开发中',
          icon: 'none'
        })
      }
    })
  }
})
