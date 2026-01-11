import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Filter, Edit2, Trash2, Wifi, WifiOff, Settings, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { cn } from '@/utils/cn'
import { deviceApi, type DeviceVO, type CreateDeviceRequest, type UpdateDeviceRequest, siteApi, type SiteVO, deviceModelApi, type DeviceModelVO } from '@/services/monitoring'

const deviceStatuses = [
  { value: '0', label: '离线' },
  { value: '1', label: '在线' },
  { value: '2', label: '故障' },
]

export default function DeviceManagement() {
  const [searchQuery, setSearchQuery] = useState('')
  const [devices, setDevices] = useState<DeviceVO[]>([])
  const [sites, setSites] = useState<SiteVO[]>([])
  const [deviceModels, setDeviceModels] = useState<DeviceModelVO[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10, total: 0 })
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'create' | 'edit'>('create')
  const [editingDevice, setEditingDevice] = useState<DeviceVO | null>(null)
  const [formData, setFormData] = useState<CreateDeviceRequest>({
    deviceCode: '',
    deviceName: '',
    siteId: undefined,
    deviceModelId: undefined,
    serialNumber: '',
    installLocation: '',
    status: '0',
    installDate: '',
    maintenanceDate: '',
  })

  // 获取设备列表
  const fetchDevices = async () => {
    setLoading(true)
    try {
      const res = await deviceApi.getDevices({
        pageNum: pagination.pageNum,
        pageSize: pagination.pageSize,
      })
      setDevices(res.list || [])
      setPagination(prev => ({ ...prev, total: res.total || 0 }))
    } catch (error) {
      console.error('获取设备列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 获取站点列表
  const fetchSites = async () => {
    try {
      const res = await siteApi.getSites({ pageSize: 1000 })
      setSites((res.list || []).map(s => ({ ...s, value: s.id, label: s.siteName })))
    } catch (error) {
      console.error('获取站点列表失败:', error)
    }
  }

  // 获取设备型号列表
  const fetchDeviceModels = async () => {
    try {
      const res = await deviceModelApi.getAllDeviceModels()
      setDeviceModels(res || [])
    } catch (error) {
      console.error('获取设备型号列表失败:', error)
    }
  }

  useEffect(() => {
    fetchDevices()
    fetchSites()
    fetchDeviceModels()
  }, [pagination.pageNum, pagination.pageSize])

  const filteredDevices = devices.filter(
    (device) =>
      device.deviceName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.deviceCode?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusInfo = (status: number) => {
    switch (status) {
      case 1:
        return { color: 'text-emerald-600 bg-emerald-100', text: '在线', icon: Wifi }
      case 2:
        return { color: 'text-red-600 bg-red-100', text: '故障', icon: Settings }
      default:
        return { color: 'text-clean-400 bg-clean-100', text: '离线', icon: WifiOff }
    }
  }

  const handleOpenModal = (type: 'create' | 'edit', device?: DeviceVO) => {
    setModalType(type)
    if (type === 'edit' && device) {
      setEditingDevice(device)
      setFormData({
        deviceCode: device.deviceCode,
        deviceName: device.deviceName,
        siteId: device.siteId,
        deviceModelId: device.deviceModelId,
        serialNumber: device.serialNumber || '',
        installLocation: device.installLocation || '',
        status: device.status?.toString() || '0',
        installDate: device.installDate || '',
        maintenanceDate: device.maintenanceDate || '',
      })
    } else {
      setEditingDevice(null)
      setFormData({
        deviceCode: '',
        deviceName: '',
        siteId: undefined,
        deviceModelId: undefined,
        serialNumber: '',
        installLocation: '',
        status: '0',
        installDate: '',
        maintenanceDate: '',
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingDevice(null)
  }

  const handleSubmit = async () => {
    try {
      if (modalType === 'create') {
        await deviceApi.createDevice(formData)
      } else if (editingDevice) {
        const updateData: UpdateDeviceRequest = {
          deviceName: formData.deviceName,
          serialNumber: formData.serialNumber,
          installLocation: formData.installLocation,
          installDate: formData.installDate,
          maintenanceDate: formData.maintenanceDate,
        }
        await deviceApi.updateDevice(editingDevice.id, updateData)
      }
      handleCloseModal()
      fetchDevices()
    } catch (error) {
      console.error('保存设备失败:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('确定要删除该设备吗？')) {
      try {
        await deviceApi.deleteDevice(id)
        fetchDevices()
      } catch (error) {
        console.error('删除设备失败:', error)
      }
    }
  }

  const handleSetStatus = async (id: number, status: 'online' | 'offline' | 'fault') => {
    try {
      if (status === 'online') {
        await deviceApi.setDeviceOnline(id)
      } else if (status === 'offline') {
        await deviceApi.setDeviceOffline(id)
      } else {
        await deviceApi.setDeviceFault(id)
      }
      fetchDevices()
    } catch (error) {
      console.error('设置设备状态失败:', error)
    }
  }

  const siteOptions = sites.map(s => ({ value: s.id.toString(), label: s.siteName || '' }))
  const modelOptions = deviceModels.map(m => ({ value: m.id.toString(), label: m.modelName || '' }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-clean-900">设备管理</h1>
          <p className="text-clean-500 mt-1">管理监测设备信息和状态</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => handleOpenModal('create')}>
          <Plus className="w-4 h-4" />
          新增设备
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-clean-500" />
            <Input
              type="text"
              placeholder="搜索设备名称、设备编码..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-clean-900"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            筛选
          </Button>
        </div>
      </Card>

      {/* Devices Grid */}
      {loading ? (
        <Card className="p-12 text-center">
          <div className="w-8 h-8 border-2 border-aqua-200 border-t-aqua-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-clean-500">加载中...</p>
        </Card>
      ) : filteredDevices.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDevices.map((device, index) => {
            const statusInfo = getStatusInfo(device.status)
            const StatusIcon = statusInfo.icon
            return (
              <motion.div
                key={device.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:border-aqua/30 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center',
                        device.status === 1 ? 'bg-emerald-100' : device.status === 2 ? 'bg-red-100' : 'bg-clean-100'
                      )}>
                        <StatusIcon className={cn(
                          'w-6 h-6',
                          device.status === 1 ? 'text-emerald-600' : device.status === 2 ? 'text-red-600' : 'text-clean-400'
                        )} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-clean-900">{device.deviceName}</h3>
                        <p className="text-sm text-clean-500">{device.deviceCode}</p>
                      </div>
                    </div>
                    <span className={cn(
                      'px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1',
                      statusInfo.color
                    )}>
                      <StatusIcon className="w-3 h-3" />
                      {statusInfo.text}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-clean-500">设备型号</p>
                      <p className="text-sm text-clean-900 font-medium mt-1">{device.modelName || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-clean-500">所属站点</p>
                      <p className="text-sm text-clean-900 font-medium mt-1">{device.siteName || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-clean-500">安装位置</p>
                      <p className="text-sm text-clean-600 mt-1">{device.installLocation || '-'}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-clean-500">安装日期</p>
                        <p className="text-sm text-clean-900 mt-1">{device.installDate || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-clean-500">序列号</p>
                        <p className="text-sm text-clean-900 font-mono mt-1">{device.serialNumber || '-'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-6 pt-4 border-t/50">
                    <Button variant="outline" size="sm" className="flex-1 flex items-center justify-center gap-2" onClick={() => handleSetStatus(device.id!, 'online')}>
                      <Wifi className="w-3 h-3" />
                      上线
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 flex items-center justify-center gap-2" onClick={() => handleSetStatus(device.id!, 'offline')}>
                      <WifiOff className="w-3 h-3" />
                      离线
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 flex items-center justify-center gap-2" onClick={() => handleOpenModal('edit', device)}>
                      <Edit2 className="w-3 h-3" />
                      编辑
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center justify-center gap-2 text-red-600 hover:text-red-300 hover:border-red-500 hover:bg-red-500/10" onClick={() => device.id && handleDelete(device.id)}>
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
          <p className="text-clean-500">未找到匹配的设备</p>
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
              className=" disabled:opacity-50"
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
              className=" disabled:opacity-50"
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
                {modalType === 'create' ? '新增设备' : '编辑设备'}
              </h2>
              <button onClick={handleCloseModal} className="p-2 rounded-lg text-clean-500 hover:text-clean-900">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="设备编码"
                  value={formData.deviceCode}
                  onChange={(e) => setFormData({ ...formData, deviceCode: e.target.value })}
                  placeholder="请输入设备编码"
                  className=" text-clean-900"
                />
                <Input
                  label="设备名称"
                  value={formData.deviceName}
                  onChange={(e) => setFormData({ ...formData, deviceName: e.target.value })}
                  placeholder="请输入设备名称"
                  className=" text-clean-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="所属站点"
                  value={formData.siteId?.toString() || ''}
                  onChange={(e) => setFormData({ ...formData, siteId: e.target.value ? parseInt(e.target.value) : undefined })}
                  options={[{ value: '', label: '请选择站点' }, ...siteOptions]}
                  className=" text-clean-900"
                />
                <Select
                  label="设备型号"
                  value={formData.deviceModelId?.toString() || ''}
                  onChange={(e) => setFormData({ ...formData, deviceModelId: e.target.value ? parseInt(e.target.value) : undefined })}
                  options={[{ value: '', label: '请选择型号' }, ...modelOptions]}
                  className=" text-clean-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="序列号"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  placeholder="请输入序列号"
                  className=" text-clean-900"
                />
                <Input
                  label="安装位置"
                  value={formData.installLocation}
                  onChange={(e) => setFormData({ ...formData, installLocation: e.target.value })}
                  placeholder="请输入安装位置"
                  className=" text-clean-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="安装日期"
                  type="date"
                  value={formData.installDate}
                  onChange={(e) => setFormData({ ...formData, installDate: e.target.value })}
                  className=" text-clean-900"
                />
                <Input
                  label="维护日期"
                  type="date"
                  value={formData.maintenanceDate}
                  onChange={(e) => setFormData({ ...formData, maintenanceDate: e.target.value })}
                  className=" text-clean-900"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t">
              <Button variant="outline" onClick={handleCloseModal} className="">
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
