import React from 'react'
import { useForm } from 'react-hook-form'
import { UserIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { userApi } from '@/services/api/user'
import type { LoginRequest } from '@/services/api/user'
import { useUserStore } from '@/stores/useUserStore'
import { Form, FormField, Input, Password, Button, Card, CardBody } from '@/components/ui'
import { toast } from '@/utils/toast'
import logoImg from '@/assets/logo.svg'

const Login: React.FC = () => {
  const navigate = useNavigate()
  const { setUser, setToken } = useUserStore()

  const form = useForm<LoginRequest>({
    defaultValues: {
      phone: '',
      password: '',
    },
  })

  const onSubmit = async (values: LoginRequest) => {
    try {
      const result: any = await userApi.login(values)
      setToken(result.token)
      setUser(result.user)
      localStorage.setItem('token', result.token)
      toast.success('登录成功')
      navigate('/dashboard')
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  const isLoading = form.formState.isSubmitting

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#7e8ba3] relative overflow-hidden">
      {/* 背景装饰动画 */}
      <div
        className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] animate-move-background"
        style={{
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* 登录卡片 */}
      <Card className="w-[400px] p-10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] rounded-2xl bg-white/95 backdrop-blur-[10px] border border-white/30 animate-fade-in-up relative z-10">
        <CardBody>
          {/* Logo 和标题 */}
          <div className="text-center mb-8">
            <div className="mb-4 animate-fade-in [animation-delay:0.2s] [animation-fill-mode:both]">
              <img
                src={logoImg}
                alt="AquaInsight"
                className="w-20 h-20 mx-auto object-contain transition-transform duration-300 hover:scale-110 hover:rotate-[5deg]"
              />
            </div>
            <h1 className="text-[32px] font-bold mb-2 bg-gradient-to-r from-[#1e3c72] to-[#2a5298] bg-clip-text text-transparent animate-slide-in-down [animation-delay:0.4s] [animation-fill-mode:both]">
              AquaInsight
            </h1>
            <p className="text-gray-600 text-sm m-0 animate-fade-in [animation-delay:0.6s] [animation-fill-mode:both]">
              环境运维管理系统
            </p>
          </div>

          {/* 登录表单 */}
          <Form form={form} onSubmit={onSubmit}>
            <FormField
              name="phone"
              rules={{ required: '请输入手机号' }}
            >
              {({ field }) => (
                <Input
                  {...field}
                  prefix={<UserIcon className="w-5 h-5" />}
                  placeholder="手机号"
                  className="h-12 text-base rounded-lg transition-all duration-300 hover:border-[#2a5298] hover:shadow-[0_0_0_2px_rgba(42,82,152,0.1)] focus:border-[#2a5298] focus:shadow-[0_0_0_2px_rgba(42,82,152,0.2)]"
                />
              )}
            </FormField>

            <FormField
              name="password"
              rules={{ required: '请输入密码' }}
            >
              {({ field }) => (
                <Password
                  {...field}
                  prefix={<LockClosedIcon className="w-5 h-5" />}
                  placeholder="密码"
                  className="h-12 text-base rounded-lg transition-all duration-300 hover:border-[#2a5298] hover:shadow-[0_0_0_2px_rgba(42,82,152,0.1)] focus:border-[#2a5298] focus:shadow-[0_0_0_2px_rgba(42,82,152,0.2)]"
                />
              )}
            </FormField>

            <Button
              type="submit"
              loading={isLoading}
              className="w-full h-12 rounded-lg text-base font-medium bg-gradient-to-r from-[#1e3c72] to-[#2a5298] border-none transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(42,82,152,0.4)] hover:from-[#2a5298] hover:to-[#1e3c72] active:translate-y-0 animate-fade-in [animation-delay:0.8s] [animation-fill-mode:both]"
            >
              登录
            </Button>
          </Form>
        </CardBody>
      </Card>
    </div>
  )
}

export default Login
