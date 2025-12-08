// 工具函数

/**
 * 格式化时间
 */
export const formatTime = (date: Date): string => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('-')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

/**
 * 格式化日期
 */
export const formatDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return `${[year, month, day].map(formatNumber).join('-')}`
}

/**
 * 数字补零
 */
const formatNumber = (n: number): string => {
  const s = n.toString()
  return s[1] ? s : `0${s}`
}

/**
 * 相对时间格式化
 */
export const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now()
  const diff = now - timestamp
  const minute = 60 * 1000
  const hour = minute * 60
  const day = hour * 24
  const week = day * 7

  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`
  } else if (diff < day * 2) {
    return '昨天'
  } else if (diff < week) {
    return `${Math.floor(diff / day)}天前`
  } else {
    return formatDate(new Date(timestamp))
  }
}

/**
 * 防抖函数
 */
export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 500
): ((...args: Parameters<T>) => void) => {
  let timer: number | null = null
  return function (this: any, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay) as unknown as number
  }
}

/**
 * 节流函数
 */
export const throttle = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 500
): ((...args: Parameters<T>) => void) => {
  let lastTime = 0
  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now()
    if (now - lastTime >= delay) {
      fn.apply(this, args)
      lastTime = now
    }
  }
}

/**
 * 显示加载提示
 */
export const showLoading = (title: string = '加载中...'): void => {
  wx.showLoading({
    title,
    mask: true
  })
}

/**
 * 隐藏加载提示
 */
export const hideLoading = (): void => {
  wx.hideLoading()
}

/**
 * 显示成功提示
 */
export const showSuccess = (title: string = '操作成功'): void => {
  wx.showToast({
    title,
    icon: 'success',
    duration: 2000
  })
}

/**
 * 显示错误提示
 */
export const showError = (title: string = '操作失败'): void => {
  wx.showToast({
    title,
    icon: 'none',
    duration: 2000
  })
}

/**
 * 显示确认对话框
 */
export const showConfirm = (content: string, title: string = '提示'): Promise<void> => {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title,
      content,
      success: (res) => {
        if (res.confirm) {
          resolve()
        } else {
          reject()
        }
      },
      fail: reject
    })
  })
}

/**
 * 获取存储数据
 */
export const getStorage = <T = any>(key: string): T | undefined => {
  try {
    return wx.getStorageSync<T>(key)
  } catch (e) {
    console.error('getStorage error:', e)
    return undefined
  }
}

/**
 * 设置存储数据
 */
export const setStorage = (key: string, data: any): void => {
  try {
    wx.setStorageSync(key, data)
  } catch (e) {
    console.error('setStorage error:', e)
  }
}

/**
 * 删除存储数据
 */
export const removeStorage = (key: string): void => {
  try {
    wx.removeStorageSync(key)
  } catch (e) {
    console.error('removeStorage error:', e)
  }
}

/**
 * 清空存储数据
 */
export const clearStorage = (): void => {
  try {
    wx.clearStorageSync()
  } catch (e) {
    console.error('clearStorage error:', e)
  }
}
