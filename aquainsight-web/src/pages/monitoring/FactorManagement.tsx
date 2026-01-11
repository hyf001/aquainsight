import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Filter, Edit2, Trash2, Activity, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { factorApi, type FactorVO, type CreateFactorRequest, type UpdateFactorRequest } from '@/services/monitoring'

const categories = [
  { value: '水环境质量', label: '水环境质量' },
  { value: '大气环境质量', label: '大气环境质量' },
  { value: '土壤环境质量', label: '土壤环境质量' },
  { value: '噪声', label: '噪声' },
  { value: '辐射', label: '辐射' },
]

export default function FactorManagement() {
  const [searchQuery, setSearchQuery] = useState('')
  const [factors, setFactors] = useState<FactorVO[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10, total: 0 })
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'create' | 'edit'>('create')
  const [editingFactor, setEditingFactor] = useState<FactorVO | null>(null)
  const [formData, setFormData] = useState<CreateFactorRequest>({
    factorCode: '',
    nationalCode: '',
    factorName: '',
    shortName: '',
    category: '水环境质量',
    unit: '',
    upperLimit: undefined,
    lowerLimit: undefined,
    precisionDigits: 2,
  })

  // 获取因子列表
  const fetchFactors = async () => {
    setLoading(true)
    try {
      const res = await factorApi.getFactors({
        pageNum: pagination.pageNum,
        pageSize: pagination.pageSize,
      })
      setFactors(res.list || [])
      setPagination(prev => ({ ...prev, total: res.total || 0 }))
    } catch (error) {
      console.error('获取因子列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFactors()
  }, [pagination.pageNum, pagination.pageSize])

  const filteredFactors = factors.filter(
    (factor) =>
      factor.factorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      factor.factorCode?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleOpenModal = (type: 'create' | 'edit', factor?: FactorVO) => {
    setModalType(type)
    if (type === 'edit' && factor) {
      setEditingFactor(factor)
      setFormData({
        factorCode: factor.factorCode,
        nationalCode: factor.nationalCode || '',
        factorName: factor.factorName,
        shortName: factor.shortName || '',
        category: factor.category || '水环境质量',
        unit: factor.unit || '',
        upperLimit: factor.upperLimit,
        lowerLimit: factor.lowerLimit,
        precisionDigits: factor.precisionDigits,
      })
    } else {
      setEditingFactor(null)
      setFormData({
        factorCode: '',
        nationalCode: '',
        factorName: '',
        shortName: '',
        category: '水环境质量',
        unit: '',
        upperLimit: undefined,
        lowerLimit: undefined,
        precisionDigits: 2,
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingFactor(null)
  }

  const handleSubmit = async () => {
    try {
      if (modalType === 'create') {
        await factorApi.createFactor(formData)
      } else if (editingFactor) {
        const updateData: UpdateFactorRequest = {
          factorName: formData.factorName,
          shortName: formData.shortName,
          category: formData.category,
          unit: formData.unit,
          upperLimit: formData.upperLimit,
          lowerLimit: formData.lowerLimit,
          precisionDigits: formData.precisionDigits,
        }
        await factorApi.updateFactor(editingFactor.id, updateData)
      }
      handleCloseModal()
      fetchFactors()
    } catch (error) {
      console.error('保存因子失败:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('确定要删除该因子吗？')) {
      try {
        await factorApi.deleteFactor(id)
        fetchFactors()
      } catch (error) {
        console.error('删除因子失败:', error)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-clean-900">因子管理</h1>
          <p className="text-clean-500 mt-1">管理监测因子信息和配置</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => handleOpenModal('create')}>
          <Plus className="w-4 h-4" />
          新增因子
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-clean-400" />
            <Input
              type="text"
              placeholder="搜索因子名称、因子代码..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            筛选
          </Button>
        </div>
      </Card>

      {/* Factors Grid */}
      {loading ? (
        <Card className="p-12 text-center">
          <div className="w-8 h-8 border-2 border-nature-200 border-t-nature-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-clean-500">加载中...</p>
        </Card>
      ) : filteredFactors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFactors.map((factor, index) => (
            <motion.div
              key={factor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-soft-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-nature-100 flex items-center justify-center">
                      <Activity className="w-6 h-6 text-nature-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-clean-900">{factor.factorName}</h3>
                      <p className="text-sm text-clean-500">{factor.factorCode}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-clean-500">国标代码</span>
                    <span className="text-clean-700 font-medium">{factor.nationalCode || '-'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-clean-500">类别</span>
                    <span className="text-clean-700 font-medium">{factor.category || '-'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-clean-500">单位</span>
                    <span className="text-clean-700 font-medium">{factor.unit || '-'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-clean-500">范围</span>
                    <span className="text-clean-700 font-medium">
                      {factor.lowerLimit !== undefined && factor.upperLimit !== undefined
                        ? `${factor.lowerLimit} ~ ${factor.upperLimit}`
                        : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-clean-500">精度</span>
                    <span className="text-clean-700 font-medium">{factor.precisionDigits !== undefined ? `${factor.precisionDigits}位` : '-'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-6 pt-4 border-t border-clean-100">
                  <Button variant="outline" size="sm" className="flex-1 flex items-center justify-center gap-2" onClick={() => handleOpenModal('edit', factor)}>
                    <Edit2 className="w-3 h-3" />
                    编辑
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center justify-center gap-2 text-red-500 hover:text-red-600 hover:border-red-500" onClick={() => factor.id && handleDelete(factor.id)}>
                    <Trash2 className="w-3 h-3" />
                    删除
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-clean-500">未找到匹配的因子</p>
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
                {modalType === 'create' ? '新增因子' : '编辑因子'}
              </h2>
              <button onClick={handleCloseModal} className="p-2 rounded-lg text-clean-400 hover:text-clean-900 hover:bg-clean-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="因子编码"
                  value={formData.factorCode}
                  onChange={(e) => setFormData({ ...formData, factorCode: e.target.value })}
                  placeholder="请输入因子编码"
                />
                <Input
                  label="因子名称"
                  value={formData.factorName}
                  onChange={(e) => setFormData({ ...formData, factorName: e.target.value })}
                  placeholder="请输入因子名称"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="国标代码"
                  value={formData.nationalCode}
                  onChange={(e) => setFormData({ ...formData, nationalCode: e.target.value })}
                  placeholder="请输入国标代码"
                />
                <Input
                  label="简称"
                  value={formData.shortName}
                  onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                  placeholder="请输入简称"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="类别"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  options={categories}
                />
                <Input
                  label="单位"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="请输入单位"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="下限"
                  type="number"
                  value={formData.lowerLimit ?? ''}
                  onChange={(e) => setFormData({ ...formData, lowerLimit: e.target.value ? parseFloat(e.target.value) : undefined })}
                  placeholder="请输入"
                />
                <Input
                  label="上限"
                  type="number"
                  value={formData.upperLimit ?? ''}
                  onChange={(e) => setFormData({ ...formData, upperLimit: e.target.value ? parseFloat(e.target.value) : undefined })}
                  placeholder="请输入"
                />
                <Input
                  label="精度位数"
                  type="number"
                  value={formData.precisionDigits ?? ''}
                  onChange={(e) => setFormData({ ...formData, precisionDigits: e.target.value ? parseInt(e.target.value) : undefined })}
                  placeholder="请输入"
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
