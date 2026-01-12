import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, X, Check, User, Phone, Mail, Shield, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { cn } from '@/utils/cn'
import { userApi, type UserInfoVO, type CreateUserRequest, type UpdateUserRequest } from '@/services/user'

const roleOptions = [
  { value: 'admin', label: '管理员' },
  { value: 'user', label: '普通用户' },
  { value: 'operator', label: '运维人员' },
]

const genderOptions = [
  { value: 'male', label: '男' },
  { value: 'female', label: '女' },
]

const statusOptions = [
  { value: '1', label: '启用' },
  { value: '0', label: '禁用' },
]

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('')
  const [users, setUsers] = useState<UserInfoVO[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10, total: 0 })
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'create' | 'edit'>('create')
  const [editingUser, setEditingUser] = useState<UserInfoVO | null>(null)
  const [formData, setFormData] = useState<CreateUserRequest>({
    password: '',
    name: '',
    phone: '',
    email: '',
    role: 'user',
    gender: 'male',
  })

  // 获取用户列表
  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await userApi.getUsers({
        pageNum: pagination.pageNum,
        pageSize: pagination.pageSize,
      })
      setUsers(res.list || [])
      setPagination(prev => ({ ...prev, total: res.total || 0 }))
    } catch (error) {
      console.error('获取用户列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [pagination.pageNum, pagination.pageSize])

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'admin':
        return { color: 'text-purple-600 bg-purple-100', text: '管理员' }
      case 'operator':
        return { color: 'text-blue-600 bg-blue-100', text: '运维人员' }
      default:
        return { color: 'text-clean-600 bg-clean-100', text: '普通用户' }
    }
  }

  const getStatusInfo = (status: number) => {
    return status === 1
      ? { color: 'text-emerald-600 bg-emerald-100', text: '启用' }
      : { color: 'text-red-600 bg-red-100', text: '禁用' }
  }

  const handleOpenModal = (type: 'create' | 'edit', user?: UserInfoVO) => {
    setModalType(type)
    if (type === 'edit' && user) {
      setEditingUser(user)
      setFormData({
        password: '',
        name: user.name,
        phone: user.phone,
        email: user.email || '',
        role: user.role || 'user',
        gender: user.gender || 'male',
      })
    } else {
      setEditingUser(null)
      setFormData({
        password: '',
        name: '',
        phone: '',
        email: '',
        role: 'user',
        gender: 'male',
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingUser(null)
  }

  const handleSubmit = async () => {
    try {
      if (modalType === 'create') {
        await userApi.createUser(formData)
      } else if (editingUser) {
        const updateData: UpdateUserRequest = {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          gender: formData.gender,
        }
        await userApi.updateUser(editingUser.id, updateData)
      }
      handleCloseModal()
      fetchUsers()
    } catch (error) {
      console.error('保存用户失败:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('确定要删除该用户吗？')) {
      try {
        await userApi.deleteUser(id)
        fetchUsers()
      } catch (error) {
        console.error('删除用户失败:', error)
      }
    }
  }

  const handleResetPassword = async (id: number) => {
    if (window.confirm('确定要重置该用户的密码吗？')) {
      try {
        await userApi.resetPassword(id)
        alert('密码已重置')
      } catch (error) {
        console.error('重置密码失败:', error)
      }
    }
  }

  const handleSetRole = async (id: number, role: string) => {
    try {
      await userApi.setRole(id, { role })
      fetchUsers()
    } catch (error) {
      console.error('设置角色失败:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-clean-900">用户管理</h1>
          <p className="text-clean-500 mt-1">管理系统用户信息和权限</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => handleOpenModal('create')}>
          <Plus className="w-4 h-4" />
          新增用户
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-clean-500" />
            <Input
              type="text"
              placeholder="搜索用户名、手机号、邮箱..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-clean-900"
            />
          </div>
        </div>
      </Card>

      {/* Users Grid */}
      {loading ? (
        <Card className="p-12 text-center">
          <div className="w-8 h-8 border-2 border-nature-200 border-t-nature-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-clean-500">加载中...</p>
        </Card>
      ) : filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredUsers.map((user, index) => {
            const roleInfo = getRoleInfo(user.role)
            const statusInfo = getStatusInfo(user.status)
            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6 hover:border-nature-300 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-nature-100 flex items-center justify-center">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full rounded-xl object-cover" />
                        ) : (
                          <User className="w-6 h-6 text-nature-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-clean-900">{user.name}</h3>
                        <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', roleInfo.color)}>
                          {roleInfo.text}
                        </span>
                      </div>
                    </div>
                    <span className={cn('px-2 py-1 rounded-full text-xs font-medium', statusInfo.color)}>
                      {statusInfo.text}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-clean-600">
                      <Phone className="w-4 h-4 text-clean-400" />
                      <span>{user.phone || '-'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-clean-600">
                      <Mail className="w-4 h-4 text-clean-400" />
                      <span>{user.email || '-'}</span>
                    </div>
                    <div className="text-xs text-clean-400 mt-2">
                      创建时间: {user.createTime || '-'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-clean-100">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 flex items-center justify-center gap-1"
                      onClick={() => handleOpenModal('edit', user)}
                    >
                      <Edit2 className="w-3 h-3" />
                      编辑
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center justify-center gap-1"
                      onClick={() => handleResetPassword(user.id)}
                    >
                      <RefreshCw className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center justify-center gap-1 text-red-600 hover:text-red-700 hover:border-red-300 hover:bg-red-50"
                      onClick={() => handleDelete(user.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-clean-500">未找到匹配的用户</p>
        </Card>
      )}

      {/* Pagination */}
      {pagination.total > 0 && (
        <div className="flex items-center justify-between px-4 py-3 bg-clean-50/50 rounded-xl">
          <span className="text-sm text-clean-500">
            共 <span className="text-clean-900">{pagination.total}</span> 条记录
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.pageNum === 1}
              onClick={() => setPagination(prev => ({ ...prev, pageNum: prev.pageNum - 1 }))}
              className="disabled:opacity-50"
            >
              上一页
            </Button>
            <span className="text-sm text-clean-900 px-2">
              {pagination.pageNum} / {Math.ceil(pagination.total / pagination.pageSize)}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.pageNum >= Math.ceil(pagination.total / pagination.pageSize)}
              onClick={() => setPagination(prev => ({ ...prev, pageNum: prev.pageNum + 1 }))}
              className="disabled:opacity-50"
            >
              下一页
            </Button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-clean-900">
                {modalType === 'create' ? '新增用户' : '编辑用户'}
              </h2>
              <button onClick={handleCloseModal} className="p-2 rounded-lg text-clean-500 hover:text-clean-900">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="姓名"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="请输入姓名"
                  className="text-clean-900"
                />
                <Select
                  label="性别"
                  value={formData.gender || ''}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  options={[{ value: '', label: '请选择性别' }, ...genderOptions]}
                  className="text-clean-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="手机号"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="请输入手机号"
                  className="text-clean-900"
                />
                <Input
                  label="邮箱"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="请输入邮箱"
                  className="text-clean-900"
                />
              </div>
              {modalType === 'create' && (
                <Input
                  label="密码"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="请输入密码"
                  className="text-clean-900"
                />
              )}
              <Select
                label="角色"
                value={formData.role || ''}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                options={[{ value: '', label: '请选择角色' }, ...roleOptions]}
                className="text-clean-900"
              />
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t">
              <Button variant="outline" onClick={handleCloseModal}>
                取消
              </Button>
              <Button onClick={handleSubmit} className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                确定
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
