import React, { useState, useEffect } from 'react'
import {
  MapPinIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  BuildingOfficeIcon,
  TagIcon,
} from '@heroicons/react/24/outline'
import { useForm } from 'react-hook-form'
import {
  Card,
  CardBody,
  Button,
  Input,
  Table,
  type TableColumn,
  Modal,
  Form,
  FormField,
  Select,
  type SelectOption,
  Tag,
  Popconfirm,
  Tooltip,
  Pagination,
  Checkbox,
} from '@/components/ui'
import {
  getSiteList,
  createSite,
  updateSite,
  deleteSite,
  type Site,
} from '@/services/monitoring'
import { getAllEnterprises, type Enterprise } from '@/services/enterprise'
import { toast } from '@/utils/toast'

const SITE_TYPES: SelectOption[] = [
  { label: '污水', value: 'wastewater' },
  { label: '雨水', value: 'rainwater' },
]

const Sites: React.FC = () => {
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingSite, setEditingSite] = useState<Site | null>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [filters, setFilters] = useState({
    siteType: undefined as string | undefined,
    enterpriseId: undefined as number | undefined,
  })
  const [enterprises, setEnterprises] = useState<Enterprise[]>([])

  const form = useForm()

  // Load sites
  const loadSites = async (pageNum: number = 1, pageSize: number = 10) => {
    setLoading(true)
    try {
      const data = await getSiteList(pageNum, pageSize, filters.siteType, filters.enterpriseId)
      setSites(data.list)
      setPagination({ current: data.pageNum, pageSize: data.pageSize, total: data.total })
    } catch (error) {
      console.error('加载站点列表失败:', error)
      toast.error('加载站点列表失败')
    } finally {
      setLoading(false)
    }
  }

  // Load enterprises
  const loadEnterprises = async () => {
    try {
      const data = await getAllEnterprises()
      setEnterprises(data)
    } catch (error) {
      console.error('加载企业列表失败:', error)
      toast.error('加载企业列表失败')
    }
  }

  useEffect(() => {
    loadSites(1, 10)
    loadEnterprises()
  }, [])

  // Handle pagination
  const handlePageChange = (page: number, pageSize: number) => {
    loadSites(page, pageSize)
  }

  // Open create/edit modal
  const openModal = (site?: Site) => {
    setEditingSite(site || null)
    if (site) {
      form.reset({
        siteCode: site.siteCode,
        siteName: site.siteName,
        siteType: site.siteType || undefined,
        siteTag: site.siteTag || undefined,
        longitude: site.longitude || undefined,
        latitude: site.latitude || undefined,
        address: site.address || undefined,
        enterpriseId: site.enterpriseId || undefined,
        isAutoUpload: site.isAutoUpload === 1,
      })
    } else {
      form.reset({
        isAutoUpload: false,
      })
    }
    setModalVisible(true)
  }

  // Save site
  const handleSaveSite = async (values: any) => {
    try {
      const data = {
        ...values,
        isAutoUpload: values.isAutoUpload ? 1 : 0,
        longitude: values.longitude ? Number(values.longitude) : undefined,
        latitude: values.latitude ? Number(values.latitude) : undefined,
      }

      if (editingSite) {
        await updateSite(editingSite.id, data)
        toast.success('更新成功')
      } else {
        await createSite(data)
        toast.success('创建成功')
      }
      setModalVisible(false)
      loadSites(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('保存站点失败:', error)
      toast.error('保存站点失败')
    }
  }

  // Delete site
  const handleDeleteSite = async (id: number) => {
    try {
      await deleteSite(id)
      toast.success('删除成功')
      loadSites(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('删除站点失败:', error)
      toast.error('删除站点失败')
    }
  }

  // Delete multiple sites
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      toast.warning('请选择要删除的站点')
      return
    }
    try {
      for (const id of selectedRowKeys) {
        await deleteSite(id as number)
      }
      toast.success(`成功删除 ${selectedRowKeys.length} 条记录`)
      setSelectedRowKeys([])
      loadSites(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('批量删除失败:', error)
      toast.error('批量删除失败')
    }
  }

  // Handle filter
  const handleFilter = () => {
    loadSites(1, 10)
  }

  // Enterprise options
  const enterpriseOptions: SelectOption[] = enterprises.map((e) => ({
    label: e.enterpriseName,
    value: e.id,
  }))

  // Table columns
  const columns: TableColumn<Site>[] = [
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
      width: '120px',
      render: (_, record) => (
        <div className="flex items-center gap-1">
          <Tooltip title="编辑">
            <Button
              variant="ghost"
              size="sm"
              icon={<PencilIcon className="w-4 h-4" />}
              onClick={() => openModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="确认删除"
            description="确定要删除该站点吗？"
            onConfirm={() => handleDeleteSite(record.id)}
            okType="danger"
          >
            <Tooltip title="删除">
              <Button
                variant="ghost"
                size="sm"
                icon={<TrashIcon className="w-4 h-4 text-red-500" />}
              />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
    {
      title: '站点编码',
      dataIndex: 'siteCode',
      key: 'siteCode',
      width: '120px',
      render: (code) => <span className="font-medium text-gray-900">{code as string}</span>,
    },
    {
      title: '站点名称',
      dataIndex: 'siteName',
      key: 'siteName',
      render: (name) => <span className="text-gray-900">{name as string}</span>,
    },
    {
      title: '站点类型',
      dataIndex: 'siteType',
      key: 'siteType',
      width: '100px',
      render: (type) => {
        if (type === 'wastewater')
          return <Tag color="primary">污水</Tag>
        if (type === 'rainwater')
          return <Tag color="info">雨水</Tag>
        return <span className="text-gray-400">-</span>
      },
    },
    {
      title: '站点标签',
      dataIndex: 'siteTag',
      key: 'siteTag',
      width: '120px',
      render: (tag) =>
        tag ? (
          <Tag color="default">{tag as string}</Tag>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      title: '所属企业',
      dataIndex: 'enterpriseName',
      key: 'enterpriseName',
      render: (name) => (
        <span className="text-sm text-gray-600">{(name as string) || '-'}</span>
      ),
    },
    {
      title: '经度',
      dataIndex: 'longitude',
      key: 'longitude',
      width: '100px',
      render: (value) => (
        <span className="text-sm text-gray-600">{value ? Number(value).toFixed(6) : '-'}</span>
      ),
    },
    {
      title: '纬度',
      dataIndex: 'latitude',
      key: 'latitude',
      width: '100px',
      render: (value) => (
        <span className="text-sm text-gray-600">{value ? Number(value).toFixed(6) : '-'}</span>
      ),
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      render: (addr) => (
        <span className="text-sm text-gray-600">{(addr as string) || '-'}</span>
      ),
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardBody>
          {/* 搜索栏 */}
          <div className="mb-6 grid grid-cols-12 gap-4">
            <div className="col-span-3">
              <Select
                value={filters.siteType}
                onChange={(value) => setFilters({ ...filters, siteType: value })}
                options={SITE_TYPES}
                placeholder="选择站点类型"
              />
            </div>
            <div className="col-span-4">
              <Select
                value={filters.enterpriseId}
                onChange={(value) => setFilters({ ...filters, enterpriseId: value as number })}
                options={enterpriseOptions}
                placeholder="选择企业"
              />
            </div>
            <div className="col-span-5">
              <Button
                variant="primary"
                icon={<MagnifyingGlassIcon className="w-4 h-4" />}
                onClick={handleFilter}
              >
                查询
              </Button>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="mb-6 flex items-center gap-3">
            <Button
              variant="primary"
              icon={<PlusIcon className="w-4 h-4" />}
              onClick={() => openModal()}
            >
              新增站点
            </Button>
            <Popconfirm
              title="确认删除"
              description={`确定要删除选中的 ${selectedRowKeys.length} 条记录吗？`}
              onConfirm={handleBatchDelete}
              okType="danger"
            >
              <Button
                variant="danger"
                icon={<TrashIcon className="w-4 h-4" />}
                disabled={selectedRowKeys.length === 0}
              >
                批量删除 {selectedRowKeys.length > 0 && `(${selectedRowKeys.length})`}
              </Button>
            </Popconfirm>
          </div>

          {/* 站点表格 */}
          <Table
            columns={columns}
            dataSource={sites}
            rowKey="id"
            loading={loading}
            rowSelection={{
              selectedRowKeys,
              onChange: (keys) => setSelectedRowKeys(keys),
            }}
            size="middle"
          />

          {/* 分页 */}
          <div className="mt-4 flex justify-end">
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={handlePageChange}
              showSizeChanger
              showTotal
            />
          </div>
        </CardBody>
      </Card>

      {/* 新增/编辑弹窗 */}
      <Modal
        open={modalVisible}
        onClose={() => {
          setModalVisible(false)
          setEditingSite(null)
        }}
        title={
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-5 h-5 text-ocean-teal" />
            {editingSite ? '编辑站点' : '新增站点'}
          </div>
        }
        width={640}
      >
        <Form form={form} onSubmit={handleSaveSite}>
          <div className="space-y-4">
            {/* 第一行：站点编码和站点名称 */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="siteCode"
                label="站点编码"
                required
                rules={{ required: '请输入站点编码' }}
              >
                {({ field }) => (
                  <Input
                    {...field}
                    placeholder="请输入站点编码"
                    prefix={<TagIcon className="w-4 h-4 text-gray-400" />}
                  />
                )}
              </FormField>

              <FormField
                name="siteName"
                label="站点名称"
                required
                rules={{ required: '请输入站点名称' }}
              >
                {({ field }) => (
                  <Input
                    {...field}
                    placeholder="请输入站点名称"
                    prefix={<MapPinIcon className="w-4 h-4 text-gray-400" />}
                  />
                )}
              </FormField>
            </div>

            {/* 第二行：站点类型和站点标签 */}
            <div className="grid grid-cols-2 gap-4">
              <FormField name="siteType" label="站点类型">
                {({ field }) => (
                  <Select {...field} options={SITE_TYPES} placeholder="请选择站点类型" />
                )}
              </FormField>

              <FormField name="siteTag" label="站点标签">
                {({ field }) => (
                  <Input {...field} placeholder="请输入站点标签" />
                )}
              </FormField>
            </div>

            {/* 第三行：经度和纬度 */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="longitude"
                label="经度"
                rules={{
                  pattern: {
                    value: /^-?((0|[1-9]\d?|1[0-7]\d)(\.\d+)?|180(\.0+)?)$/,
                    message: '请输入有效的经度 (-180 到 180)',
                  },
                }}
              >
                {({ field }) => (
                  <Input {...field} placeholder="请输入经度" type="number" step="0.000001" />
                )}
              </FormField>

              <FormField
                name="latitude"
                label="纬度"
                rules={{
                  pattern: {
                    value: /^-?((0|[1-8]?\d)(\.\d+)?|90(\.0+)?)$/,
                    message: '请输入有效的纬度 (-90 到 90)',
                  },
                }}
              >
                {({ field }) => (
                  <Input {...field} placeholder="请输入纬度" type="number" step="0.000001" />
                )}
              </FormField>
            </div>

            {/* 第四行：地址 */}
            <FormField name="address" label="地址">
              {({ field }) => (
                <Input {...field} placeholder="请输入地址" />
              )}
            </FormField>

            {/* 第五行：所属企业 */}
            <FormField name="enterpriseId" label="所属企业">
              {({ field }) => (
                <Select
                  {...field}
                  options={enterpriseOptions}
                  placeholder="请选择企业"
                />
              )}
            </FormField>

            {/* 第六行：自动上传开关 */}
            <FormField name="isAutoUpload">
              {({ field }) => (
                <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                  启用自动上传
                </Checkbox>
              )}
            </FormField>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setModalVisible(false)
                setEditingSite(null)
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

export default Sites
