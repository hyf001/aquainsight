import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Filter, Edit2, Trash2, Cpu, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { deviceModelApi, type DeviceModelVO, type CreateDeviceModelRequest, type UpdateDeviceModelRequest, factorApi, type FactorVO } from '@/services/monitoring'

const deviceTypes = [
 { value: '水质监测', label: '水质监测' },
 { value: '大气监测', label: '大气监测' },
 { value: '土壤监测', label: '土壤监测' },
 { value: '噪声监测', label: '噪声监测' },
 { value: '综合监测', label: '综合监测' },
]

export default function DeviceModelManagement() {
 const [searchQuery, setSearchQuery] = useState('')
 const [deviceModels, setDeviceModels] = useState<DeviceModelVO[]>([])
 const [factors, setFactors] = useState<FactorVO[]>([])
 const [loading, setLoading] = useState(false)
 const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10, total: 0 })
 const [showModal, setShowModal] = useState(false)
 const [modalType, setModalType] = useState<'create' | 'edit'>('create')
 const [editingModel, setEditingModel] = useState<DeviceModelVO | null>(null)
 const [formData, setFormData] = useState<CreateDeviceModelRequest>({
 modelCode: '',
 modelName: '',
 deviceType: '水质监测',
 manufacturer: '',
 description: '',
 specifications: '',
 factorId: undefined,
 })

 // 获取设备型号列表
 const fetchDeviceModels = async () => {
 setLoading(true)
 try {
 const res = await deviceModelApi.getDeviceModels({
 pageNum: pagination.pageNum,
 pageSize: pagination.pageSize,
 })
 setDeviceModels(res.list || [])
 setPagination(prev => ({ ...prev, total: res.total || 0 }))
 } catch (error) {
 console.error('获取设备型号列表失败:', error)
 } finally {
 setLoading(false)
 }
 }

 // 获取因子列表
 const fetchFactors = async () => {
 try {
 const res = await factorApi.getAllFactors()
 setFactors(res || [])
 } catch (error) {
 console.error('获取因子列表失败:', error)
 }
 }

 useEffect(() => {
 fetchDeviceModels()
 fetchFactors()
 }, [pagination.pageNum, pagination.pageSize])

 const filteredModels = deviceModels.filter(
 (model) =>
 model.modelName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
 model.modelCode?.toLowerCase().includes(searchQuery.toLowerCase())
 )

 const handleOpenModal = (type: 'create' | 'edit', model?: DeviceModelVO) => {
 setModalType(type)
 if (type === 'edit' && model) {
 setEditingModel(model)
 setFormData({
 modelCode: model.modelCode,
 modelName: model.modelName,
 deviceType: model.deviceType,
 manufacturer: model.manufacturer || '',
 description: model.description || '',
 specifications: model.specifications || '',
 factorId: model.factorId,
 })
 } else {
 setEditingModel(null)
 setFormData({
 modelCode: '',
 modelName: '',
 deviceType: '水质监测',
 manufacturer: '',
 description: '',
 specifications: '',
 factorId: undefined,
 })
 }
 setShowModal(true)
 }

 const handleCloseModal = () => {
 setShowModal(false)
 setEditingModel(null)
 }

 const handleSubmit = async () => {
 try {
 if (modalType === 'create') {
 await deviceModelApi.createDeviceModel(formData)
 } else if (editingModel) {
 const updateData: UpdateDeviceModelRequest = {
  modelName: formData.modelName,
  deviceType: formData.deviceType,
  manufacturer: formData.manufacturer,
  description: formData.description,
  specifications: formData.specifications,
  factorId: formData.factorId,
 }
 await deviceModelApi.updateDeviceModel(editingModel.id, updateData)
 }
 handleCloseModal()
 fetchDeviceModels()
 } catch (error) {
 console.error('保存设备型号失败:', error)
 }
 }

 const handleDelete = async (id: number) => {
 if (window.confirm('确定要删除该设备型号吗？')) {
 try {
 await deviceModelApi.deleteDeviceModel(id)
 fetchDeviceModels()
 } catch (error) {
 console.error('删除设备型号失败:', error)
 }
 }
 }

 const factorOptions = factors.map(f => ({ value: f.id.toString(), label: `${f.factorName} (${f.factorCode})` }))

 return (
 <div className="space-y-6">
 {/* Header */}
 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
 <div>
  <h1 className="text-2xl font-display font-bold text-clean-900">设备型号管理</h1>
  <p className="text-clean-500 mt-1">管理监测设备型号信息</p>
 </div>
 <Button className="flex items-center gap-2" onClick={() => handleOpenModal('create')}>
  <Plus className="w-4 h-4" />
  新增型号
 </Button>
 </div>

 {/* Search and Filter */}
 <Card className="p-4 ">
 <div className="flex flex-col sm:flex-row gap-4">
  <div className="flex-1 relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-clean-500" />
  <Input
  type="text"
  placeholder="搜索型号名称、型号代码..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  className="pl-10 text-clean-900 "
  />
  </div>
  <Button variant="outline" className="flex items-center gap-2 hover:bg-nature-100">
  <Filter className="w-4 h-4" />
  筛选
  </Button>
 </div>
 </Card>

 {/* Device Models List */}
 {loading ? (
 <Card className="p-12 text-center ">
  <div className="w-8 h-8 border-2 border-aqua-200 border-t-aqua-500 rounded-full animate-spin mx-auto mb-4" />
  <p className="text-clean-500">加载中...</p>
 </Card>
 ) : filteredModels.length > 0 ? (
 <div className="space-y-4">
  {filteredModels.map((model, index) => (
  <motion.div
  key={model.id}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.1 }}
  >
  <Card className="p-6 hover:border-aqua/30 transition-all duration-300">
  <div className="flex items-start gap-4">
   <div className="w-16 h-16 rounded-xl bg-nature-100 flex items-center justify-center flex-shrink-0">
   <Cpu className="w-8 h-8 text-aqua" />
   </div>
   <div className="flex-1">
   <div className="flex items-start justify-between mb-3">
   <div>
   <h3 className="text-lg font-semibold text-clean-900">{model.modelName}</h3>
   <p className="text-sm text-clean-500 mt-1">型号: {model.modelCode}</p>
   </div>
   <span className="px-3 py-1 rounded-full text-xs font-medium bg-nature-100 text-nature-600">
   {model.deviceType}
   </span>
   </div>

   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
   <div>
   <p className="text-sm text-clean-500">制造商</p>
   <p className="text-sm text-clean-900 font-medium mt-1">{model.manufacturer || '-'}</p>
   </div>
   <div>
   <p className="text-sm text-clean-500">关联因子</p>
   <p className="text-sm text-clean-900 font-medium mt-1">{model.factor?.factorName || '-'}</p>
   </div>
   <div className="md:col-span-2">
   <p className="text-sm text-clean-500">描述</p>
   <p className="text-sm text-clean-600 mt-1">{model.description || '-'}</p>
   </div>
   </div>

   <div className="flex items-center gap-2 pt-4 border-t ">
   <Button variant="outline" size="sm" className="flex items-center gap-2 hover:bg-nature-100" onClick={() => handleOpenModal('edit', model)}>
   <Edit2 className="w-3 h-3" />
   编辑
   </Button>
   <Button variant="outline" size="sm" className="flex items-center gap-2 text-red-400 hover:text-red-300 hover:border-red-500 hover:bg-red-500/10" onClick={() => model.id && handleDelete(model.id)}>
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
 <Card className="p-12 text-center ">
  <p className="text-clean-500">未找到匹配的设备型号</p>
 </Card>
 )}

 {/* Pagination */}
 {pagination.total > 0 && (
 <div className="flex items-center justify-between px-4 py-3 bg-clean-30 rounded-xl">
  <span className="text-sm text-clean-500">
  共 <span className="text-clean-900">{pagination.total}</span> 条记录
  </span>
  <div className="flex items-center gap-2">
  <Button
  variant="outline"
  size="sm"
  disabled={pagination.pageNum === 1}
  onClick={() => setPagination(prev => ({ ...prev, pageNum: prev.pageNum - 1 }))}
  className=" hover:bg-nature-100 disabled:opacity-50"
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
  className=" hover:bg-nature-100 disabled:opacity-50"
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
  className="bg-clean-50 border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
  >
  <div className="flex items-center justify-between p-6 border-b ">
  <h2 className="text-xl font-semibold text-clean-900">
  {modalType === 'create' ? '新增设备型号' : '编辑设备型号'}
  </h2>
  <button onClick={handleCloseModal} className="p-2 rounded-lg text-clean-500 hover:text-clean-900 hover:bg-nature-100">
  <X className="w-5 h-5" />
  </button>
  </div>
  <div className="p-6 space-y-4">
  <div className="grid grid-cols-2 gap-4">
  <Input
   label="型号编码"
   value={formData.modelCode}
   onChange={(e) => setFormData({ ...formData, modelCode: e.target.value })}
   placeholder="请输入型号编码"
   className=" text-clean-900 "
  />
  <Input
   label="型号名称"
   value={formData.modelName}
   onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
   placeholder="请输入型号名称"
   className=" text-clean-900 "
  />
  </div>
  <div className="grid grid-cols-2 gap-4">
  <Select
   label="设备类型"
   value={formData.deviceType}
   onChange={(e) => setFormData({ ...formData, deviceType: e.target.value })}
   options={deviceTypes}
   className=" text-clean-900"
  />
  <Select
   label="关联因子"
   value={formData.factorId?.toString() || ''}
   onChange={(e) => setFormData({ ...formData, factorId: e.target.value ? parseInt(e.target.value) : undefined })}
   options={[{ value: '', label: '请选择因子' }, ...factorOptions]}
   className=" text-clean-900"
  />
  </div>
  <Input
  label="制造商"
  value={formData.manufacturer}
  onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
  placeholder="请输入制造商"
  className=" text-clean-900 "
  />
  <Input
  label="规格参数"
  value={formData.specifications}
  onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
  placeholder="请输入规格参数"
  className=" text-clean-900 "
  />
  <div>
  <label className="block text-sm text-clean-500 mb-2">描述</label>
  <textarea
   value={formData.description}
   onChange={(e) => setFormData({ ...formData, description: e.target.value })}
   placeholder="请输入描述"
   rows={3}
   className="w-full px-4 py-3 border rounded-xl text-clean-900 focus:outline-none focus:border-aqua focus:ring-2 focus:ring-aqua/20 resize-none"
  />
  </div>
  </div>
  <div className="flex items-center justify-end gap-3 p-6 border-t ">
  <Button variant="outline" onClick={handleCloseModal} className=" hover:bg-nature-100">
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
