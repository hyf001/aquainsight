import request from './request'

// ==================== 站点管理 ====================

export type Site = {
  id: number
  siteCode: string
  siteName: string
  siteType: string | null
  siteTag: string | null
  longitude: string | null
  latitude: string | null
  address: string | null
  enterpriseId: number | null
  enterpriseName: string | null
  isAutoUpload: number
  createTime: string
  updateTime: string
}

export type CreateSiteRequest = {
  siteCode: string
  siteName: string
  siteType?: string
  siteTag?: string
  longitude?: string
  latitude?: string
  address?: string
  enterpriseId?: number
  isAutoUpload?: number
}

export type UpdateSiteRequest = {
  siteName?: string
  siteType?: string
  siteTag?: string
  longitude?: string
  latitude?: string
  address?: string
  enterpriseId?: number
  isAutoUpload?: number
}

export type PageResult<T> = {
  list: T[]
  total: number
  pageNum: number
  pageSize: number
  pages: number
}

// 获取站点列表（分页）
export const getSiteList = (pageNum: number = 1, pageSize: number = 10, siteType?: string, enterpriseId?: number) => {
  return request.get<any, PageResult<Site>>('/monitoring/sites', {
    params: { pageNum, pageSize, siteType, enterpriseId }
  })
}

// 创建站点
export const createSite = (data: CreateSiteRequest) => {
  return request.post<any, Site>('/monitoring/sites', data)
}

// 更新站点
export const updateSite = (id: number, data: UpdateSiteRequest) => {
  return request.put<any, Site>(`/monitoring/sites/${id}`, data)
}

// 删除站点
export const deleteSite = (id: number) => {
  return request.delete(`/monitoring/sites/${id}`)
}

// 获取站点详情
export const getSiteDetail = (id: number) => {
  return request.get<any, Site>(`/monitoring/sites/${id}`)
}

// ==================== 设备型号管理 ====================

export type DeviceModel = {
  id: number
  modelCode: string
  modelName: string
  deviceType: string | null
  manufacturer: string | null
  description: string | null
  specifications?: string | null  // 规格参数
  factorId?: number  // 关联的因子ID (多对一关系)
  factor?: Factor  // 关联的因子对象（用于显示）
  createTime: string
  updateTime: string
}

export type CreateDeviceModelRequest = {
  modelCode: string
  modelName: string
  deviceType?: string
  manufacturer?: string
  description?: string
  specifications?: string  // 规格参数
  factorId?: number  // 关联因子ID (多对一关系)
}

export type UpdateDeviceModelRequest = {
  modelName?: string
  deviceType?: string
  manufacturer?: string
  description?: string
  specifications?: string  // 规格参数
  factorId?: number  // 关联因子ID (多对一关系)
}

// 获取设备型号列表（分页）
export const getDeviceModelList = (pageNum: number = 1, pageSize: number = 10, deviceType?: string) => {
  return request.get<any, PageResult<DeviceModel>>('/monitoring/device-models', {
    params: { pageNum, pageSize, deviceType }
  })
}

// 获取所有设备型号（不分页）
export const getAllDeviceModels = () => {
  return request.get<any, DeviceModel[]>('/monitoring/device-models/all')
}

// 创建设备型号
export const createDeviceModel = (data: CreateDeviceModelRequest) => {
  return request.post<any, DeviceModel>('/monitoring/device-models', data)
}

// 更新设备型号
export const updateDeviceModel = (id: number, data: UpdateDeviceModelRequest) => {
  return request.put<any, DeviceModel>(`/monitoring/device-models/${id}`, data)
}

// 删除设备型号
export const deleteDeviceModel = (id: number) => {
  return request.delete(`/monitoring/device-models/${id}`)
}

// ==================== 设备实例管理 ====================

export type Device = {
  id: number
  deviceCode: string
  deviceName: string
  siteId: number
  siteName: string | null
  deviceModelId: number
  modelName: string | null
  serialNumber: string | null
  installLocation: string | null
  status: number
  installDate: string | null
  maintenanceDate: string | null
  createTime: string
  updateTime: string
  manufacturer: string | null  // 制造商
  range: string | null  // 量程
  factorId: number | null  // 关联因子ID
  factorName: string | null  // 关联因子名称
}

export type CreateDeviceRequest = {
  deviceCode: string
  deviceName: string
  siteId: number
  deviceModelId: number
  serialNumber?: string
  installLocation?: string
  status?: number
  installDate?: string
  maintenanceDate?: string
}

export type UpdateDeviceRequest = {
  deviceName?: string
  serialNumber?: string
  installLocation?: string
  installDate?: string
  maintenanceDate?: string
}

// 获取设备列表（分页）
export const getDeviceList = (pageNum: number = 1, pageSize: number = 10, siteId?: number, deviceModelId?: number) => {
  return request.get<any, PageResult<Device>>('/monitoring/devices', {
    params: { pageNum, pageSize, siteId, deviceModelId }
  })
}

// 创建设备
export const createDevice = (data: CreateDeviceRequest) => {
  return request.post<any, Device>('/monitoring/devices', data)
}

// 更新设备
export const updateDevice = (id: number, data: UpdateDeviceRequest) => {
  return request.put<any, Device>(`/monitoring/devices/${id}`, data)
}

// 删除设备
export const deleteDevice = (id: number) => {
  return request.delete(`/monitoring/devices/${id}`)
}

// 设置设备在线
export const setDeviceOnline = (id: number) => {
  return request.put<any, Device>(`/monitoring/devices/${id}/status/online`)
}

// 设置设备离线
export const setDeviceOffline = (id: number) => {
  return request.put<any, Device>(`/monitoring/devices/${id}/status/offline`)
}

// 设置设备故障
export const setDeviceFault = (id: number) => {
  return request.put<any, Device>(`/monitoring/devices/${id}/status/fault`)
}

// ==================== 监测因子管理 ====================

export type Factor = {
  id: number
  factorCode: string
  nationalCode: string | null
  factorName: string
  shortName: string | null
  deviceModelId: number
  modelName: string | null
  category: string | null
  unit: string | null
  upperLimit: string | null
  lowerLimit: string | null
  precisionDigits: number
  createTime: string
  updateTime: string
}

export type CreateFactorRequest = {
  factorCode: string
  nationalCode?: string
  factorName: string
  shortName?: string
  deviceModelId: number
  category?: string
  unit?: string
  upperLimit?: string
  lowerLimit?: string
  precisionDigits?: number
}

export type UpdateFactorRequest = {
  factorName?: string
  shortName?: string
  category?: string
  unit?: string
  upperLimit?: string
  lowerLimit?: string
  precisionDigits?: number
}

// 获取监测因子列表（分页）
export const getFactorList = (pageNum: number = 1, pageSize: number = 10, category?: string, deviceModelId?: number) => {
  return request.get<any, PageResult<Factor>>('/monitoring/factors', {
    params: { pageNum, pageSize, category, deviceModelId }
  })
}

// 获取所有监测因子（不分页）
export const getAllFactors = () => {
  return request.get<any, Factor[]>('/monitoring/factors/all')
}

// 创建监测因子
export const createFactor = (data: CreateFactorRequest) => {
  return request.post<any, Factor>('/monitoring/factors', data)
}

// 更新监测因子
export const updateFactor = (id: number, data: UpdateFactorRequest) => {
  return request.put<any, Factor>(`/monitoring/factors/${id}`, data)
}

// 删除监测因子
export const deleteFactor = (id: number) => {
  return request.delete(`/monitoring/factors/${id}`)
}
