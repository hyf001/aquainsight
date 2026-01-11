import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Leaf, Eye, EyeOff, ArrowRight, Loader2, Globe } from 'lucide-react'
import { cn } from '@/utils/cn'
import request from '@/services/request'

interface LoginForm {
  phone: string
  password: string
}

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState<LoginForm>({ phone: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await request.post<{ token: string; user: any }>('/user/login', form)
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      navigate('/')
    } catch (err: any) {
      setError(err.message || '登录失败，请检查手机号和密码')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-nature-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-nature-200/30 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
            className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-sky-200/20 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"
          />
        </div>

        {/* Nature pattern */}
        <svg className="absolute bottom-0 left-0 w-full h-64 opacity-10" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <motion.path
            animate={{
              d: [
                'M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z',
                'M0,160L48,176C96,192,192,224,288,218.7C384,213,480,171,576,165.3C672,160,768,192,864,197.3C960,203,1056,181,1152,165.3C1248,149,1344,139,1392,133.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z',
              ],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            fill="#22c55e"
          />
        </svg>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-nature-500 flex items-center justify-center shadow-leaf">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-nature-800">AquaInsight</h1>
              <p className="text-nature-600 text-sm">智慧环境监测平台</p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 flex flex-col justify-center"
          >
            <h2 className="font-display text-4xl xl:text-5xl font-bold text-nature-800 leading-tight">
              守护绿水青山<br />
              <span className="text-nature-600">共建美好家园</span>
            </h2>
            <p className="mt-6 text-nature-600 text-lg max-w-md">
              实时监测环境数据，智能预警分析，为环境保护提供科学决策支持。
            </p>

            <div className="mt-10 flex items-center gap-8">
              {[
                { label: '监测站点', value: '500+' },
                { label: '合作单位', value: '200+' },
                { label: '注册用户', value: '10K+' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-display font-bold text-nature-700">{stat.value}</p>
                  <p className="text-nature-500 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-nature-500 text-sm flex items-center gap-2"
          >
            <Globe className="w-4 h-4" />
            © 2024 AquaInsight. All rights reserved.
          </motion.div>
        </motion.div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-clean-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-nature-500 flex items-center justify-center shadow-leaf">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-display text-2xl font-bold text-nature-800">AquaInsight</h1>
          </div>

          {/* Login card */}
          <div className="glass p-8 xl:p-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="font-display text-2xl font-bold text-clean-900">欢迎回来</h2>
              <p className="text-clean-500 mt-2">请登录您的账户</p>
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200"
                >
                  <p className="text-red-600 text-sm">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm text-clean-600 mb-2">手机号</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="请输入手机号"
                  className="input-field"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm text-clean-600 mb-2">密码</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="请输入密码"
                    className="input-field pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-clean-400 hover:text-clean-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-between"
              >
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-clean-300 text-nature-500 focus:ring-nature-400"
                  />
                  <span className="text-sm text-clean-500">记住我</span>
                </label>
                <a href="#" className="text-sm text-nature-600 hover:text-nature-500 transition-colors">
                  忘记密码?
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3.5 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      登录中...
                    </>
                  ) : (
                    <>
                      登录
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 pt-6 border-t border-clean-200"
            >
              <p className="text-center text-clean-500 text-sm">
                还没有账号?{' '}
                <a href="#" className="text-nature-600 hover:text-nature-500 transition-colors">
                  立即注册
                </a>
              </p>
            </motion.div>
          </div>

          {/* Demo credentials */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 p-4 rounded-xl bg-white/50 border border-clean-200"
          >
            <p className="text-clean-500 text-xs text-center">
              <span className="font-medium text-clean-600">演示账号:</span>{' '}
              手机号 13888888888 / 密码 123456
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
