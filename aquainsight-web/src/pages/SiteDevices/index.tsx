import React, { useState, useEffect } from 'react'
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import { useForm } from 'react-hook-form'
import {
  Card,
  CardHeader,
  CardBody,
  Table,
  type TableColumn,
  Button,
  Modal,
  Form,
  FormField,
  Input,
  Select,
  type SelectOption,
  Popconfirm,
  DatePicker,
  Pagination,
} from '@/components/ui'
import { toast } from '@/utils/toast'
import { format } from 'date-fns'
import {
  getDeviceList,
  createDevice,
  updateDevice,
  deleteDevice,
  getAllDeviceModels,
  getSiteList,
  type Device,
  type DeviceModel,
  type Site,
} from '@/services/monitoring'

const SiteDevices: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([])
  const [deviceModels, setDeviceModels] = useState<DeviceModel[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingDevice, setEditingDevice] = useState<Device | null>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [filters, setFilters] = useState({
    enterpriseName: '',
    siteId: undefined as number | undefined,
    deviceModelId: undefined as number | undefined,
  })

  const searchForm = useForm()
  const deviceForm = useForm()

  // Load devices
  const loadDevices = async (pageNum: number = 1, pageSize: number = 10) => {
    setLoading(true)
    try {
      const data = await getDeviceList(
        pageNum,
        pageSize,
        filters.siteId,
        filters.deviceModelId
      )
      setDevices(data.list)
      setPagination({ current: data.pageNum, pageSize: data.pageSize, total: data.total })
    } catch (error) {
      console.error('加载设备列表失败:', error)
      toast.error('加载设备列表失败')
    } finally {
      setLoading(false)
    }
  }

  // Load device models
  const loadDeviceModels = async () => {
    try {
      const data = await getAllDeviceModels()
      setDeviceModels(data)
    } catch (error) {
      console.error('加载设备型号失败:', error)
    }
  }

  // Load sites
  const loadSites = async () => {
    try {
      const data = await getSiteList(1, 100)
      setSites(data.list)
    } catch (error) {
      console.error('加载站点列表失败:', error)
    }
  }

  useEffect(() => {
    loadDevices(1, 10)
    loadDeviceModels()
    loadSites()
  }, [])

  // Open create/edit modal
  const openModal = (device?: Device) => {
    setEditingDevice(device || null)
    if (device) {
      deviceForm.reset({
        deviceCode: device.deviceCode,
        deviceName: device.deviceName,
        siteId: device.siteId,
        deviceModelId: device.deviceModelId,
        serialNumber: device.serialNumber || undefined,
        installLocation: device.installLocation || undefined,
        status: device.status,
        installDate: device.installDate ? new Date(device.installDate) : undefined,
        maintenanceDate: device.maintenanceDate ? new Date(device.maintenanceDate) : undefined,
      })
    } else {
      deviceForm.reset({
        deviceCode: '',
        deviceName: '',
        siteId: undefined,
        deviceModelId: undefined,
        serialNumber: '',
        installLocation: '',
        status: 1,
        installDate: undefined,
        maintenanceDate: undefined,
      })
    }
    setModalVisible(true)
  }

  // Save device
  const handleSaveDevice = async (values: any) => {
    try {
      const data = {
        ...values,
        installDate: values.installDate ? format(values.installDate, 'yyyy-MM-dd') : undefined,
        maintenanceDate: values.maintenanceDate ? format(values.maintenanceDate, 'yyyy-MM-dd') : undefined,
      }

      if (editingDevice) {
        await updateDevice(editingDevice.id, data)
        toast.success('更新成功')
      } else {
        await createDevice(data)
        toast.success('创建成功')
      }
      setModalVisible(false)
      loadDevices(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('保存设备失败:', error)
      toast.error('保存设备失败')
    }
  }

  // Delete device
  const handleDeleteDevice = async (id: number) => {
    try {
      await deleteDevice(id)
      toast.success('删除成功')
      loadDevices(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('删除设备失败:', error)
      toast.error('删除设备失败')
    }
  }

  // Delete multiple devices
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      toast.warning('请选择要删除的设备')
      return
    }
    try {
      for (const id of selectedRowKeys) {
        await deleteDevice(id as number)
      }
      toast.success('批量删除成功')
      setSelectedRowKeys([])
      loadDevices(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('批量删除失败:', error)
      toast.error('批量删除失败')
    }
  }

  // Handle filter
  const handleFilter = () => {
    const values = searchForm.getValues()
    setFilters({
      enterpriseName: values.enterpriseName,
      siteId: values.siteId,
      deviceModelId: values.deviceModelId,
    })
    loadDevices(1, 10)
  }

  // Site options
  const siteOptions: SelectOption[] = sites.map((s) => ({
    label: s.siteName,
    value: s.id,
  }))

  // Device model options
  const deviceModelOptions: SelectOption[] = deviceModels.map((m) => ({
    label: m.modelName,
    value: m.id,
  }))

  // Status options
  const statusOptions: SelectOption[] = [
    { label: '在线', value: 1 },
    { label: '离线', value: 0 },
    { label: '故障', value: 2 },
  ]

  // Table columns
  const columns: TableColumn<Device>[] = [
    {
      title: '序号',
      key: 'index',
      width: '60px',
      render: (_, __, index) => <span className="text-sm text-gray-600">{index + 1}</span>,
    },
    {
      title: '操作',
      key: 'action',
      width: '150px',
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={<PencilIcon className="w-4 h-4" />}
            onClick={() => openModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            description="确定要删除该设备吗？"
            onConfirm={() => handleDeleteDevice(record.id)}
          >
            <Button variant="ghost" size="sm" danger icon={<TrashIcon className="w-4 h-4" />}>
              删除
            </Button>
          </Popconfirm>
        </div>
      ),
    },
    {
      title: '设备编号',
      dataIndex: 'deviceCode',
      key: 'deviceCode',
      width: '120px',
      render: (code) => <span className="font-mono text-sm">{code as string}</span>,
    },
    {
      title: '所在站点',
      dataIndex: 'siteName',
      key: 'siteName',
      render: (text) => <span className="text-sm text-gray-600">{(text as string) || '-'}</span>,
    },
    {
      title: '设备类型',
      dataIndex: 'modelName',
      key: 'modelName',
      render: (text) => <span className="text-sm text-gray-600">{(text as string) || '-'}</span>,
    },
    {
      title: '量程',
      dataIndex: 'range',
      key: 'range',
      render: (text) => <span className="text-sm text-gray-600">{(text as string) || '-'}</span>,
    },
    {
      title: '关联因子',
      dataIndex: 'factorName',
      key: 'factorName',
      render: (text) => <span className="text-sm text-gray-600">{(text as string) || '-'}</span>,
    },
    {
      title: '规格参数',
      dataIndex: 'serialNumber',
      key: 'serialNumber',
      render: (text) => <span className="text-sm text-gray-600">{(text as string) || '-'}</span>,
    },
    {
      title: '制造商',
      dataIndex: 'manufacturer',
      key: 'manufacturer',
      render: (text) => <span className="text-sm text-gray-600">{(text as string) || '-'}</span>,
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">设备信息管理</h2>
        </CardHeader>
        <CardBody>
          {/* Search bar */}
          <Form form={searchForm} onSubmit={handleFilter}>
            <div className="mb-6 grid grid-cols-4 gap-4">
              <FormField name="enterpriseName" label="企业名称">
                {({ field }) => <Input {...field} placeholder="请输入企业名称" />}
              </FormField>

              <FormField name="siteId" label="选择站点">
                {({ field }) => (
                  <Select {...field} placeholder="请选择站点" options={siteOptions} allowClear />
                )}
              </FormField>

              <FormField name="deviceModelId" label="设备类型">
                {({ field }) => (
                  <Select
                    {...field}
                    placeholder="请选择设备类型"
                    options={deviceModelOptions}
                    allowClear
                  />
                )}
              </FormField>

              <div className="flex items-end gap-2">
                <Button
                  type="submit"
                  variant="primary"
                  icon={<MagnifyingGlassIcon className="w-4 h-4" />}
                >
                  查询
                </Button>
              </div>
            </div>
          </Form>

          {/* Action buttons */}
          <div className="mb-4 flex items-center gap-2">
            <Button
              variant="primary"
              icon={<PlusIcon className="w-4 h-4" />}
              onClick={() => openModal()}
            >
              新增
            </Button>
            <Popconfirm
              title="确认删除"
              description="确定要删除选中的设备吗？"
              onConfirm={handleBatchDelete}
            >
              <Button variant="outline" danger icon={<TrashIcon className="w-4 h-4" />}>
                删除
              </Button>
            </Popconfirm>
          </div>

          {/* Table */}
          <Table
            columns={columns}
            dataSource={devices}
            rowKey="id"
            loading={loading}
            rowSelection={{
              selectedRowKeys,
              onChange: setSelectedRowKeys,
            }}
            size="small"
          />

          <div className="mt-4 flex justify-end">
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={(page, pageSize) => {
                loadDevices(page, pageSize)
                setPagination({ ...pagination, current: page, pageSize })
              }}
              showSizeChanger
              showTotal
            />
          </div>
        </CardBody>
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingDevice ? '编辑设备' : '新增设备'}
        open={modalVisible}
        onClose={() => setModalVisible(false)}
        width={600}
      >
        <Form form={deviceForm} onSubmit={handleSaveDevice}>
          <div className="space-y-4">
            <FormField
              name="deviceCode"
              label="设备编号"
              rules={{ required: '请输入设备编号' }}
            >
              {({ field }) => <Input {...field} placeholder="请输入设备编号" />}
            </FormField>

            <FormField
              name="deviceName"
              label="设备名称"
              rules={{ required: '请输入设备名称' }}
            >
              {({ field }) => <Input {...field} placeholder="请输入设备名称" />}
            </FormField>

            <FormField name="siteId" label="所在站点" rules={{ required: '请选择站点' }}>
              {({ field }) => (
                <Select {...field} placeholder="请选择站点" options={siteOptions} />
              )}
            </FormField>

            <FormField
              name="deviceModelId"
              label="设备类型"
              rules={{ required: '请选择设备类型' }}
            >
              {({ field }) => (
                <Select {...field} placeholder="请选择设备类型" options={deviceModelOptions} />
              )}
            </FormField>

            <FormField name="serialNumber" label="序列号">
              {({ field }) => <Input {...field} placeholder="请输入序列号" />}
            </FormField>

            <FormField name="installLocation" label="安装位置">
              {({ field }) => <Input {...field} placeholder="请输入安装位置" />}
            </FormField>

            <FormField name="status" label="状态">
              {({ field }) => (
                <Select {...field} placeholder="请选择状态" options={statusOptions} />
              )}
            </FormField>

            <FormField name="installDate" label="安装日期">
              {({ field }) => (
                <DatePicker
                  {...field}
                  placeholder="请选择安装日期"
                  format="yyyy-MM-dd"
                  allowClear
                />
              )}
            </FormField>

            <FormField name="maintenanceDate" label="维护日期">
              {({ field }) => (
                <DatePicker
                  {...field}
                  placeholder="请选择维护日期"
                  format="yyyy-MM-dd"
                  allowClear
                />
              )}
            </FormField>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setModalVisible(false)}>
              取消
            </Button>
            <Button type="submit" variant="primary">
              确定
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}

export default SiteDevices
