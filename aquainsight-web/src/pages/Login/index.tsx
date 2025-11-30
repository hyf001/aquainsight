import React, { useState } from 'react'
import { Form, Input, Button, Card, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { userApi } from '@/services/api/user'
import type { LoginRequest } from '@/services/api/user'
import { useUserStore } from '@/stores/useUserStore'
import './styles.less'

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setUser, setToken } = useUserStore()

  const onFinish = async (values: LoginRequest) => {
    setLoading(true)
    try {
      const result: any = await userApi.login(values)
      setToken(result.token)
      setUser(result.user)
      localStorage.setItem('token', result.token)
      message.success('登录成功')
      navigate('/dashboard')
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <Card className="login-card">
        <div className="login-header">
          <h1>AquaInsight</h1>
          <p>环境运维管理系统</p>
        </div>
        <Form
          name="login"
          initialValues={{ phone: '', password: '' }}
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            name="phone"
            rules={[{ required: true, message: '请输入手机号' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="手机号" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Login
