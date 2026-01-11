import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, Building2, Phone, MapPin, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { enterpriseApi, type EnterpriseVO, type CreateEnterpriseRequest, type UpdateEnterpriseRequest } from '@/services/enterprise'

export default function EnterpriseManagement() {
  const [searchQuery, setSearchQuery] = useState('')
  const [enterprises, setEnterprises] = useState<EnterpriseVO[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10, total: 0 })
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'create' | 'edit'>('create')
  const [editingEnterprise, setEditingEnterprise] = useState<EnterpriseVO | null>(null)
  const [formData, setFormData] = useState<CreateEnterpriseRequest>({
    enterpriseCode: '',
    enterpriseName: '',
    enterpriseTag: '',
    contactPerson: '',
    contactPhone: '',
    address: '',
    description: '',
  })

  // 获取企业列表
  const fetchEnterprises = async () => {
    setLoading(true)
    try {
      const res = await enterpriseApi.getEnterprises({
        pageNum: pagination.pageNum,
        pageSize: pagination.pageSize,
        enterpriseName: searchQuery,
      })
      setEnterprises(res.list || [])
      setPagination(prev => ({ ...prev, total: res.total || 0 }))
    } catch (error) {
      console.error('获取企业列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEnterprises()
  }, [pagination.pageNum, pagination.pageSize, searchQuery])

  const handleOpenModal = (type: 'create' | 'edit', enterprise?: EnterpriseVO) => {
    setModalType(type)
    if (type === 'edit' && enterprise) {
      setEditingEnterprise(enterprise)
      setFormData({
        enterpriseCode: enterprise.enterpriseCode,
        enterpriseName: enterprise.enterpriseName,
        enterpriseTag: enterprise.enterpriseTag || '',
        contactPerson: enterprise.contactPerson || '',
        contactPhone: enterprise.contactPhone || '',
        address: enterprise.address || '',
        description: enterprise.description || '',
      })
    } else {
      setEditingEnterprise(null)
      setFormData({
        enterpriseCode: '',
        enterpriseName: '',
        enterpriseTag: '',
        contactPerson: '',
        contactPhone: '',
        address: '',
        description: '',
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingEnterprise(null)
    setError(null)
  }

  const handleSubmit = async () => {
    setError(null)
    try {
      if (modalType === 'create') {
        await enterpriseApi.create(formData)
      } else if (editingEnterprise) {
        const updateData: UpdateEnterpriseRequest = {
          enterpriseName: formData.enterpriseName,
          enterpriseTag: formData.enterpriseTag,
          contactPerson: formData.contactPerson,
          contactPhone: formData.contactPhone,
          address: formData.address,
          description: formData.description,
        }
        await enterpriseApi.update(editingEnterprise.id, updateData)
      }
      handleCloseModal()
      fetchEnterprises()
    } catch (err: any) {
      const message = err.message || '操作失败'
      setError(message)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('确定要删除该企业吗？')) {
      setError(null)
      try {
        await enterpriseApi.delete(id)
        fetchEnterprises()
      } catch (err: any) {
        const message = err.message || '删除失败'
        setError(message)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-clean-900">企业管理</h1>
          <p className="text-clean-500 mt-1">管理企业信息和联系方式</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => handleOpenModal('create')}>
          <Plus className="w-4 h-4" />
          新增企业
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-clean-400" />
            <Input
              type="text"
              placeholder="搜索企业名称..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </Card>

      {/* Enterprises List */}
      {loading ? (
        <Card className="p-12 text-center">
          <div className="w-8 h-8 border-2 border-nature-200 border-t-nature-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-clean-500">加载中...</p>
        </Card>
      ) : enterprises.length > 0 ? (
        <div className="space-y-4">
          {enterprises.map((enterprise, index) => (
            <motion.div
              key={enterprise.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-soft-lg transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-nature-100 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-8 h-8 text-nature-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-clean-900">{enterprise.enterpriseName}</h3>
                        <p className="text-sm text-clean-500 mt-1 font-mono">{enterprise.enterpriseCode}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-nature-100 text-nature-600">
                        {enterprise.enterpriseTag || '-'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 text-sm text-clean-500 mb-1">
                          <Phone className="w-3 h-3" />
                          <span>联系人</span>
                        </div>
                        <p className="text-sm text-clean-900 font-medium">
                          {enterprise.contactPerson || '-'} {enterprise.contactPhone ? `- ${enterprise.contactPhone}` : ''}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-sm text-clean-500 mb-1">
                          <Building2 className="w-3 h-3" />
                          <span>站点数量</span>
                        </div>
                        <p className="text-sm text-clean-900 font-medium">{enterprise.siteCount} 个站点</p>
                      </div>
                      <div className="md:col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-2 text-sm text-clean-500 mb-1">
                          <MapPin className="w-3 h-3" />
                          <span>地址</span>
                        </div>
                        <p className="text-sm text-clean-600">{enterprise.address || '-'}</p>
                      </div>
                    </div>

                    {enterprise.description && (
                      <div className="mb-4">
                        <p className="text-sm text-clean-500 mb-1">企业描述</p>
                        <p className="text-sm text-clean-600">{enterprise.description}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-4 border-t border-clean-100">
                      <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => handleOpenModal('edit', enterprise)}>
                        <Edit2 className="w-3 h-3" />
                        编辑
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-2 text-red-500 hover:text-red-600 hover:border-red-500" onClick={() => enterprise.id && handleDelete(enterprise.id)}>
                        <Trash2 className="w-3 h-3" />
                        删除
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-clean-500">未找到匹配的企业</p>
        </Card>
      )}

      {/* Pagination */}
      {pagination.total > 0 && (
        <div className="flex items-center justify-between px-4 py-3 bg-clean-50 border border-clean-200 rounded-xl">
          <span className="text-sm text-clean-500">
            共 <span className="text-clean-900">{pagination.total}</span> 条记录
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.pageNum === 1}
              onClick={() => setPagination(prev => ({ ...prev, pageNum: prev.pageNum - 1 }))}
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
            className="bg-white border border-clean-200 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-clean-100">
              <h2 className="text-xl font-semibold text-clean-900">
                {modalType === 'create' ? '新增企业' : '编辑企业'}
              </h2>
              <button onClick={handleCloseModal} className="p-2 rounded-lg text-clean-400 hover:text-clean-900 hover:bg-clean-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="企业编码"
                  value={formData.enterpriseCode}
                  onChange={(e) => setFormData({ ...formData, enterpriseCode: e.target.value })}
                  placeholder="请输入企业编码"
                />
                <Input
                  label="企业名称"
                  value={formData.enterpriseName}
                  onChange={(e) => setFormData({ ...formData, enterpriseName: e.target.value })}
                  placeholder="请输入企业名称"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="企业标签"
                  value={formData.enterpriseTag}
                  onChange={(e) => setFormData({ ...formData, enterpriseTag: e.target.value })}
                  options={[
                    { value: '', label: '请选择' },
                    { value: '国控', label: '国控' },
                    { value: '非国控', label: '非国控' },
                  ]}
                />
                <Input
                  label="联系电话"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  placeholder="请输入联系电话"
                />
              </div>
              <Input
                label="联系人"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="请输入联系人"
              />
              <Input
                label="地址"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="请输入地址"
              />
              <div>
                <label className="block text-sm text-clean-500 mb-2">描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="请输入描述"
                  rows={3}
                  className="w-full px-4 py-3 border border-clean-200 rounded-xl text-clean-900 focus:outline-none focus:border-nature-500 focus:ring-2 focus:ring-nature-500/20 resize-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-clean-100">
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
