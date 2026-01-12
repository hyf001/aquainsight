import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Leaf, Eye, EyeOff, ArrowRight, Loader2, Globe, Activity } from 'lucide-react'
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
    <div className="min-h-screen flex relative overflow-hidden bg-nature-50">
      {/* Shared Background Elements for better coordination */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.3, 0.15],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] left-[40%] w-[1000px] h-[1000px] bg-gradient-to-br from-nature-200/30 to-sky-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.25, 0.1],
            x: [0, -100, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[10%] right-[10%] w-[800px] h-[800px] bg-gradient-to-tr from-sky-200/20 to-nature-200/20 rounded-full blur-3xl"
        />
      </div>

      {/* Left side - Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        {/* Content Container */}
        <div className="relative z-10 w-full h-full flex flex-col p-12 xl:p-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-nature-500 to-nature-600 flex items-center justify-center shadow-lg shadow-nature-500/20">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-nature-900 tracking-tight">AquaInsight</h1>
              <p className="text-nature-600/80 text-xs font-medium tracking-wider uppercase">Smart Environment Monitor</p>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col justify-center max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="font-display text-5xl xl:text-6xl font-bold text-nature-900 leading-[1.15] tracking-tight mb-8">
                守护绿水青山<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-nature-600 to-sky-600">
                  共建美好家园
                </span>
              </h2>
              <p className="text-nature-700/80 text-lg leading-relaxed mb-12 max-w-md">
                利用先进的物联网与AI技术，为您提供全方位的环境监测解决方案，让每一次呼吸都更清新。
              </p>
            </motion.div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { title: '实时监测', desc: '全天候数据采集', icon: Activity, color: 'text-nature-600', bg: 'bg-nature-100/50' },
                { title: '智能预警', desc: 'AI驱动风险识别', icon: Leaf, color: 'text-sky-600', bg: 'bg-sky-100/50' },
                { title: '多维分析', desc: '可视化数据看板', icon: Globe, color: 'text-water-600', bg: 'bg-water-100/50' },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="bg-white/40 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors", feature.bg)}>
                    <feature.icon className={cn("w-5 h-5", feature.color)} />
                  </div>
                  <div className="space-y-1">
                    <p className="font-display text-lg font-bold text-nature-900 group-hover:text-nature-700 transition-colors">
                      {feature.title}
                    </p>
                    <p className="text-sm text-nature-600/60 font-medium">
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex items-center gap-6 text-sm text-nature-600/70"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>www.aquainsight.com</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-nature-300" />
            <span>© 2024 AquaInsight Inc.</span>
          </motion.div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
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
          <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-[2.5rem] p-8 xl:p-10 shadow-2xl shadow-nature-900/5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="font-display text-3xl font-bold text-nature-900">欢迎回来</h2>
              <p className="text-nature-600/70 mt-2">请登录您的账户</p>
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

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-semibold text-nature-900 mb-2 ml-1">手机号</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="请输入手机号"
                  className="w-full bg-white/50 border-white/50 focus:bg-white focus:border-nature-500/50 rounded-2xl px-4 py-3.5 outline-none transition-all duration-300 placeholder:text-nature-300 text-nature-900"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-semibold text-nature-900 mb-2 ml-1">密码</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="请输入密码"
                    className="w-full bg-white/50 border-white/50 focus:bg-white focus:border-nature-500/50 rounded-2xl px-4 py-3.5 outline-none transition-all duration-300 placeholder:text-nature-300 text-nature-900 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-nature-400 hover:text-nature-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-between px-1"
              >
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-nature-200 text-nature-600 focus:ring-nature-500/20"
                  />
                  <span className="text-sm text-nature-600 group-hover:text-nature-900 transition-colors font-medium">记住我</span>
                </label>
                <a href="#" className="text-sm font-semibold text-nature-600 hover:text-nature-500 transition-colors">
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
                  className="w-full bg-gradient-to-r from-nature-600 to-nature-500 hover:from-nature-500 hover:to-nature-400 text-white font-bold py-4 rounded-2xl shadow-xl shadow-nature-500/30 flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98] disabled:opacity-70"
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
              className="mt-8 pt-6 border-t border-nature-100"
            >
              <p className="text-center text-nature-600 font-medium text-sm">
                还没有账号?{' '}
                <a href="#" className="text-nature-600 hover:text-nature-500 font-bold transition-colors">
                  立即注册
                </a>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
