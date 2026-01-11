import request from './request'

export interface LoginParams {
  phone: string
  password: string
}

export interface LoginResult {
  token: string
  user: {
    id: string
    name: string
    avatar: string
    role: string
  }
}

export interface UserInfo {
  id: string
  name: string
  avatar: string
  role: string
}

export const authService = {
  async login(params: LoginParams): Promise<LoginResult> {
    return request.post('/user/login', params)
  },

  async logout(): Promise<void> {
    return request.post('/user/logout')
  },

  async getUserInfo(): Promise<UserInfo> {
    return request.get('/user/info')
  },
}
