// API请求封装
const app = getApp<IAppOption>()

/**
 * 通用请求方法
 */
const request = <T = any>(options: IRequestOptions): Promise<IApiResponse<T>> => {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token')

    wx.request({
      url: `${app.globalData.apiBaseUrl}${options.url}`,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        'X-TOKEN': token || '',  // 后端需要的token header字段
        ...options.header
      },
      success: (res) => {
        if (res.statusCode === 200) {
          const data = res.data as IApiResponse<T>

          // 后端返回code为"0000"表示成功
          if (data.code === '0000') {
            resolve(data)
          } else if (data.code === '401' || data.code === '1001') {
            // 未授权，跳转到登录页
            wx.removeStorageSync('token')
            wx.removeStorageSync('userInfo')
            wx.showToast({
              title: '请先登录',
              icon: 'none'
            })
            setTimeout(() => {
              wx.redirectTo({
                url: '/pages/login/login',
                fail: () => {
                  console.error('跳转登录页失败')
                }
              })
            }, 1500)
            reject(data)
          } else {
            // 其他错误
            wx.showToast({
              title: data.message || '请求失败',
              icon: 'none'
            })
            reject(data)
          }
        } else {
          wx.showToast({
            title: `网络请求失败(${res.statusCode})`,
            icon: 'none'
          })
          reject(res)
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '网络连接失败',
          icon: 'none'
        })
        reject(err)
      }
    })
  })
}

/**
 * GET请求
 */
const get = <T = any>(url: string, data?: any, options?: Partial<IRequestOptions>): Promise<IApiResponse<T>> => {
  return request<T>({
    url,
    method: 'GET',
    data,
    ...options
  })
}

/**
 * POST请求
 */
const post = <T = any>(url: string, data?: any, options?: Partial<IRequestOptions>): Promise<IApiResponse<T>> => {
  return request<T>({
    url,
    method: 'POST',
    data,
    ...options
  })
}

/**
 * PUT请求
 */
const put = <T = any>(url: string, data?: any, options?: Partial<IRequestOptions>): Promise<IApiResponse<T>> => {
  return request<T>({
    url,
    method: 'PUT',
    data,
    ...options
  })
}

/**
 * DELETE请求
 */
const del = <T = any>(url: string, data?: any, options?: Partial<IRequestOptions>): Promise<IApiResponse<T>> => {
  return request<T>({
    url,
    method: 'DELETE',
    data,
    ...options
  })
}

export {
  request,
  get,
  post,
  put,
  del
}
