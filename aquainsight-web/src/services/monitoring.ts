import request from './request'

// 类型定义
export interface SiteVO {
  id: number
  siteCode: string
  siteName: string
  siteType: string
  siteTag: string
  longitude: string
  latitude: string
  address: string
  enterpriseId: number
  enterpriseName: string
  isAutoUpload: boolean
  createTime: string
  updateTime: string
}

export interface CreateSiteRequest {
  siteCode: string
  siteName: string
  siteType: string
  siteTag?: string
  longitude?: string
  latitude?: string
  address?: string
  enterpriseId?: number
  isAutoUpload?: boolean
}

export interface UpdateSiteRequest {
  siteName?: string
  siteType?: string
  siteTag?: string
  longitude?: string
  latitude?: string
  address?: string
  enterpriseId?: number
  isAutoUpload?: boolean
}

export interface DeviceModelVO {
  id: number
  modelCode: string
  modelName: string
  deviceType: string
  manufacturer: string
  description: string
  specifications?: string
  factorId: number
  factor?: FactorVO
  createTime: string
  updateTime: string
}

export interface CreateDeviceModelRequest {
  modelCode: string
  modelName: string
  deviceType: string
  manufacturer: string
  description?: string
  specifications?: string
  factorId?: number
}

export interface UpdateDeviceModelRequest {
  modelName?: string
  deviceType?: string
  manufacturer?: string
  description?: string
  specifications?: string
  factorId?: number
}

export interface DeviceVO {
  id: number
  deviceCode: string
  deviceName: string
  siteId: number
  siteName: string
  deviceModelId: number
  modelName: string
  serialNumber?: string
  installLocation?: string
  status: number
  installDate?: string
  maintenanceDate?: string
  createTime: string
  updateTime: string
  manufacturer?: string
  range?: string
  factorId?: number
  factorName?: string
}

export interface CreateDeviceRequest {
  deviceCode: string
  deviceName: string
  siteId: number
  deviceModelId: number
  serialNumber?: string
  installLocation?: string
  status?: string
  installDate?: string
  maintenanceDate?: string
}

export interface UpdateDeviceRequest {
  deviceName?: string
  serialNumber?: string
  installLocation?: string
  installDate?: string
  maintenanceDate?: string
}

export interface FactorVO {
  id: number
  factorCode: string
  nationalCode?: string
  factorName: string
  shortName?: string
  deviceModelId: number
  modelName?: string
  category?: string
  unit?: string
  upperLimit?: number
  lowerLimit?: number
  precisionDigits?: number
  createTime: string
  updateTime: string
}

export interface CreateFactorRequest {
  factorCode: string
  nationalCode?: string
  factorName: string
  shortName?: string
  deviceModelId?: number
  category?: string
  unit?: string
  upperLimit?: number
  lowerLimit?: number
  precisionDigits?: number
}

export interface UpdateFactorRequest {
  factorName?: string
  shortName?: string
  category?: string
  unit?: string
  upperLimit?: number
  lowerLimit?: number
  precisionDigits?: number
}

export interface EnterpriseSiteTreeVO {
  enterpriseId: number
  enterpriseName: string
  enterpriseCode: string
  enterpriseTag?: string
  sites: SiteVO[]
  siteCount: number
}

// 分页结果
export interface PageResult<T> {
  list: T[]
  total: number
  pageNum: number
  pageSize: number
}

// ==================== Site API ====================

export const siteApi = {
  // 获取站点分页列表
  getSites: (params: {
    pageNum?: number
    pageSize?: number
    siteType?: string
    enterpriseId?: number
    name?: string
  }) => {
    return request.get<PageResult<SiteVO>>('/monitoring/sites', { params })
  },

  // 获取站点详情
  getSiteById: (id: number) => {
    return request.get<SiteVO>(`/monitoring/sites/${id}`)
  },

  // 创建站点
  createSite: (data: CreateSiteRequest) => {
    return request.post<SiteVO>('/monitoring/sites', data)
  },

  // 更新站点
  updateSite: (id: number, data: UpdateSiteRequest) => {
    return request.put<SiteVO>(`/monitoring/sites/${id}`, data)
  },

  // 删除站点
  deleteSite: (id: number) => {
    return request.delete(`/monitoring/sites/${id}`)
  },

  // 获取企业-站点树形结构
  getEnterpriseSiteTree: (params?: {
    enterpriseName?: string
    siteName?: string
  }) => {
    return request.get<EnterpriseSiteTreeVO[]>('/monitoring/sites/tree', { params })
  },
}

// ==================== DeviceModel API ====================

export const deviceModelApi = {
  // 获取设备型号分页列表
  getDeviceModels: (params: {
    pageNum?: number
    pageSize?: number
    deviceType?: string
  }) => {
    return request.get<PageResult<DeviceModelVO>>('/monitoring/device-models', { params })
  },

  // 获取所有设备型号（不分页）
  getAllDeviceModels: () => {
    return request.get<DeviceModelVO[]>('/monitoring/device-models/all')
  },

  // 获取设备型号详情
  getDeviceModelById: (id: number) => {
    return request.get<DeviceModelVO>(`/monitoring/device-models/${id}`)
  },

  // 创建设备型号
  createDeviceModel: (data: CreateDeviceModelRequest) => {
    return request.post<DeviceModelVO>('/monitoring/device-models', data)
  },

  // 更新设备型号
  updateDeviceModel: (id: number, data: UpdateDeviceModelRequest) => {
    return request.put<DeviceModelVO>(`/monitoring/device-models/${id}`, data)
  },

  // 删除设备型号
  deleteDeviceModel: (id: number) => {
    return request.delete(`/monitoring/device-models/${id}`)
  },
}

// ==================== Device API ====================

export const deviceApi = {
  // 获取设备分页列表
  getDevices: (params: {
    pageNum?: number
    pageSize?: number
    siteId?: number
    deviceModelId?: number
  }) => {
    return request.get<PageResult<DeviceVO>>('/monitoring/devices', { params })
  },

  // 获取设备详情
  getDeviceById: (id: number) => {
    return request.get<DeviceVO>(`/monitoring/devices/${id}`)
  },

  // 创建设备
  createDevice: (data: CreateDeviceRequest) => {
    return request.post<DeviceVO>('/monitoring/devices', data)
  },

  // 更新设备
  updateDevice: (id: number, data: UpdateDeviceRequest) => {
    return request.put<DeviceVO>(`/monitoring/devices/${id}`, data)
  },

  // 设置设备在线
  setDeviceOnline: (id: number) => {
    return request.put<DeviceVO>(`/monitoring/devices/${id}/status/online`)
  },

  // 设置设备离线
  setDeviceOffline: (id: number) => {
    return request.put<DeviceVO>(`/monitoring/devices/${id}/status/offline`)
  },

  // 设置设备故障
  setDeviceFault: (id: number) => {
    return request.put<DeviceVO>(`/monitoring/devices/${id}/status/fault`)
  },

  // 删除设备
  deleteDevice: (id: number) => {
    return request.delete(`/monitoring/devices/${id}`)
  },
}

// ==================== Factor API ====================

export const factorApi = {
  // 获取因子分页列表
  getFactors: (params: {
    pageNum?: number
    pageSize?: number
    category?: string
  }) => {
    return request.get<PageResult<FactorVO>>('/monitoring/factors', { params })
  },

  // 获取所有因子（不分页）
  getAllFactors: () => {
    return request.get<FactorVO[]>('/monitoring/factors/all')
  },

  // 获取因子详情
  getFactorById: (id: number) => {
    return request.get<FactorVO>(`/monitoring/factors/${id}`)
  },

  // 创建因子
  createFactor: (data: CreateFactorRequest) => {
    return request.post<FactorVO>('/monitoring/factors', data)
  },

  // 更新因子
  updateFactor: (id: number, data: UpdateFactorRequest) => {
    return request.put<FactorVO>(`/monitoring/factors/${id}`, data)
  },

  // 删除因子
  deleteFactor: (id: number) => {
    return request.delete(`/monitoring/factors/${id}`)
  },
}
