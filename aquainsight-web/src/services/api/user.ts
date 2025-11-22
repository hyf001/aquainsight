import request from '../request'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface User {
  id: string
  username: string
  name: string
  avatar?: string
}

export const userApi = {
  login: (data: LoginRequest) => request.post<LoginResponse>('/user/login', data),
  getUserInfo: () => request.get<User>('/user/info'),
}
