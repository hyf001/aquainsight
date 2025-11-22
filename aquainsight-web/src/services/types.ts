export interface Response<T = any> {
  code: string
  message: string
  data: T
}

export interface PageRequest {
  pageNum: number
  pageSize: number
}

export interface PageResponse<T = any> {
  list: T[]
  total: number
  pageNum: number
  pageSize: number
}
