import React, { useState, useEffect } from 'react'
import {
  CubeIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  BuildingOfficeIcon,
  BeakerIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'
import { useForm } from 'react-hook-form'
import {
  Card,
  CardBody,
  Button,
  Input,
  TextArea,
  Table,
  type TableColumn,
  Modal,
  Form,
  FormField,
  Select,
  type SelectOption,
  Tag,
  Popconfirm,
  Pagination,
} from '@/components/ui'
import {
  getDeviceModelList,
  createDeviceModel,
  updateDeviceModel,
  deleteDeviceModel,
  getAllFactors,
  type DeviceModel,
  type Factor,
} from '@/services/monitoring'
import { toast } from '@/utils/toast'

const DeviceModels: React.FC = () => {
  const [deviceModels, setDeviceModels] = useState<DeviceModel[]>([])
  const [allFactors, setAllFactors] = useState<Factor[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingModel, setEditingModel] = useState<DeviceModel | null>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [filters, setFilters] = useState({
    modelName: '',
    deviceType: '',
  })

  const form = useForm()

  // Load all factors for selection
  const loadAllFactors = async () => {
    try {
      const data = await getAllFactors()
      setAllFactors(data)
    } catch (error) {
      console.error('加载监测因子失败:', error)
    }
  }

  // Load device models
  const loadDeviceModels = async (pageNum: number = 1, pageSize: number = 10) => {
    setLoading(true)
    try {
      const data = await getDeviceModelList(pageNum, pageSize, filters.deviceType)
      setDeviceModels(data.list)
      setPagination({ current: data.pageNum, pageSize: data.pageSize, total: data.total })
    } catch (error) {
      console.error('加载设备型号失败:', error)
      toast.error('加载设备型号失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDeviceModels(1, 10)
    loadAllFactors()
  }, [])

  // Open create/edit modal
  const openModal = (model?: DeviceModel) => {
    setEditingModel(model || null)
    if (model) {
      form.reset({
        modelCode: model.modelCode,
        modelName: model.modelName,
        deviceType: model.deviceType || undefined,
        manufacturer: model.manufacturer || undefined,
        description: model.description || undefined,
        specifications: model.specifications || undefined,
        factorId: model.factorId || undefined,
      })
    } else {
      form.reset()
    }
    setModalVisible(true)
  }

  // Save device model
  const handleSaveModel = async (values: any) => {
    try {
      if (editingModel) {
        await updateDeviceModel(editingModel.id, values)
        toast.success('更新成功')
      } else {
        await createDeviceModel(values)
        toast.success('创建成功')
      }
      setModalVisible(false)
      loadDeviceModels(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('保存设备型号失败:', error)
      toast.error('保存失败')
    }
  }

  // Delete device model
  const handleDeleteModel = async (id: number) => {
    try {
      await deleteDeviceModel(id)
      toast.success('删除成功')
      loadDeviceModels(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('删除设备型号失败:', error)
      toast.error('删除失败')
    }
  }

  // Delete multiple device models
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      toast.warning('请选择要删除的设备型号')
      return
    }
    try {
      for (const id of selectedRowKeys) {
        await deleteDeviceModel(id as number)
      }
      toast.success('批量删除成功')
      setSelectedRowKeys([])
      loadDeviceModels(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('批量删除失败:', error)
      toast.error('批量删除失败')
    }
  }

  // Handle filter
  const handleFilter = () => {
    loadDeviceModels(1, 10)
  }

  // Filter models by model name
  const filteredModels = filters.modelName.trim()
    ? deviceModels.filter(
        (m) => m.modelName?.includes(filters.modelName) || m.modelCode?.includes(filters.modelName)
      )
    : deviceModels

  // Factor options for select
  const factorOptions: SelectOption[] = allFactors.map((factor) => ({
    value: factor.id,
    label: `${factor.factorName}（${factor.factorCode}）`,
  }))

  // Table columns
  const columns: TableColumn<DeviceModel>[] = [
    {
      title: '序号',
      key: 'index',
      width: '60px',
      render: (_, __, index) => (
        <span className="text-sm text-gray-600">
          {(pagination.current - 1) * pagination.pageSize + index + 1}
        </span>
      ),
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
            description="确定要删除该设备型号吗？"
            onConfirm={() => handleDeleteModel(record.id)}
            okType="danger"
          >
            <Button
              variant="ghost"
              size="sm"
              icon={<TrashIcon className="w-4 h-4 text-red-500" />}
            >
              删除
            </Button>
          </Popconfirm>
        </div>
      ),
    },
    {
      title: '简称',
      dataIndex: 'modelCode',
      key: 'modelCode',
      width: '100px',
      render: (code) => <span className="font-mono text-sm text-gray-600">{code as string}</span>,
    },
    {
      title: '设备类别',
      dataIndex: 'deviceType',
      key: 'deviceType',
      render: (text) => (
        <span className="text-sm text-gray-600">{text ? (text as string) : '-'}</span>
      ),
    },
    {
      title: '型号名称',
      dataIndex: 'modelName',
      key: 'modelName',
      render: (name) => <span className="font-medium text-gray-900">{name as string}</span>,
    },
    {
      title: '规格参数',
      key: 'specifications',
      dataIndex: 'specifications',
      render: (text) => (
        <span className="text-sm text-gray-600 line-clamp-2">
          {text ? (text as string) : '-'}
        </span>
      ),
    },
    {
      title: '关联因子',
      key: 'factor',
      render: (_, record) => {
        if (!record.factor) {
          return <span className="text-gray-400">-</span>
        }
        return <Tag color="primary">{record.factor.factorName}</Tag>
      },
    },
    {
      title: '生产厂商',
      dataIndex: 'manufacturer',
      key: 'manufacturer',
      render: (text) => (
        <span className="text-sm text-gray-600">{text ? (text as string) : '-'}</span>
      ),
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardBody>
          {/* 搜索栏 */}
          <div className="mb-6 grid grid-cols-3 gap-4">
            <Input
              placeholder="型号名称/代码"
              value={filters.modelName}
              onChange={(e) => setFilters({ ...filters, modelName: e.target.value })}
              prefix={<CubeIcon className="w-4 h-4 text-gray-400" />}
            />
            <Input
              placeholder="设备类别"
              value={filters.deviceType}
              onChange={(e) => setFilters({ ...filters, deviceType: e.target.value })}
              prefix={<BeakerIcon className="w-4 h-4 text-gray-400" />}
            />
            <Button
              variant="primary"
              icon={<MagnifyingGlassIcon className="w-4 h-4" />}
              onClick={handleFilter}
              className="w-full"
            >
              查询
            </Button>
          </div>

          {/* 操作按钮 */}
          <div className="mb-6 flex items-center gap-3">
            <Button
              variant="primary"
              icon={<PlusIcon className="w-4 h-4" />}
              onClick={() => openModal()}
            >
              新增
            </Button>
            <Popconfirm
              title="确认删除"
              description={`确定要删除选中的 ${selectedRowKeys.length} 个设备型号吗？`}
              onConfirm={handleBatchDelete}
              okType="danger"
            >
              <Button
                variant="danger"
                icon={<TrashIcon className="w-4 h-4" />}
                disabled={selectedRowKeys.length === 0}
              >
                删除 {selectedRowKeys.length > 0 && `(${selectedRowKeys.length})`}
              </Button>
            </Popconfirm>
          </div>

          {/* 设备型号表格 */}
          <Table
            columns={columns}
            dataSource={filteredModels}
            rowKey="id"
            loading={loading}
            rowSelection={{
              selectedRowKeys,
              onChange: setSelectedRowKeys,
            }}
            size="small"
          />

          {/* 分页 */}
          {filteredModels.length > 0 && (
            <div className="mt-4 flex justify-end">
              <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onChange={(page, pageSize) => {
                  loadDeviceModels(page, pageSize)
                }}
                showSizeChanger
                showTotal
              />
            </div>
          )}
        </CardBody>
      </Card>

      {/* 新增/编辑弹窗 */}
      <Modal
        open={modalVisible}
        onClose={() => {
          setModalVisible(false)
          form.reset()
        }}
        title={editingModel ? '编辑设备型号' : '新增设备型号'}
        width={800}
      >
        <Form form={form} onSubmit={handleSaveModel}>
          <div className="space-y-4">
            <FormField
              name="modelCode"
              label="设备代码(简称)"
              required
              rules={{ required: '请输入设备代码' }}
            >
              {({ field }) => (
                <Input
                  {...field}
                  placeholder="请输入设备代码，如：WQ-2000"
                  className="font-mono"
                />
              )}
            </FormField>

            <FormField
              name="modelName"
              label="型号名称"
              required
              rules={{ required: '请输入型号名称' }}
            >
              {({ field }) => (
                <Input
                  {...field}
                  placeholder="请输入型号名称，如：水质在线监测仪-2000型"
                  prefix={<CubeIcon className="w-4 h-4 text-gray-400" />}
                />
              )}
            </FormField>

            <FormField name="deviceType" label="设备类别">
              {({ field }) => (
                <Input
                  {...field}
                  placeholder="请输入设备类别，如：水质监测"
                  prefix={<BeakerIcon className="w-4 h-4 text-gray-400" />}
                />
              )}
            </FormField>

            <FormField name="manufacturer" label="生产厂商">
              {({ field }) => (
                <Input
                  {...field}
                  placeholder="请输入生产厂商，如：XX环保科技"
                  prefix={<BuildingOfficeIcon className="w-4 h-4 text-gray-400" />}
                />
              )}
            </FormField>

            <FormField name="specifications" label="规格参数">
              {({ field }) => (
                <TextArea
                  {...field}
                  placeholder="请输入规格参数，如：测量范围：0-100mg/L；精度：±2%；供电：220V AC"
                  rows={3}
                />
              )}
            </FormField>

            <FormField name="factorId" label="关联因子">
              {({ field }) => (
                <Select
                  {...field}
                  placeholder="请选择关联的监测因子"
                  options={factorOptions}
                  showSearch
                />
              )}
            </FormField>

            <FormField name="description" label="描述">
              {({ field }) => (
                <TextArea
                  {...field}
                  placeholder="请输入设备描述，如：可监测PH、COD、TOC、TP、氨氮、总镍等水质指标"
                  rows={3}
                />
              )}
            </FormField>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setModalVisible(false)
                form.reset()
              }}
            >
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

export default DeviceModels
