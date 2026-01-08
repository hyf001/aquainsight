import React, { useState, useEffect } from 'react'
import {
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  LinkIcon,
  TagIcon,
  PhoneIcon,
  UserIcon as UserIconOutline,
  MapPinIcon,
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
  Tooltip,
  Pagination,
} from '@/components/ui'
import {
  getEnterpriseList,
  createEnterprise,
  updateEnterprise,
  deleteEnterprise,
  type Enterprise,
} from '@/services/enterprise'
import { toast } from '@/utils/toast'

const ENTERPRISE_TAGS: SelectOption[] = [
  { label: '非国控', value: '非国控' },
  { label: '国控', value: '国控' },
]

const Enterprises: React.FC = () => {
  const [enterprises, setEnterprises] = useState<Enterprise[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingEnterprise, setEditingEnterprise] = useState<Enterprise | null>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [filters, setFilters] = useState({
    enterpriseName: '',
    enterpriseTag: undefined as string | undefined,
  })

  const form = useForm()
  const searchForm = useForm()

  // 加载企业列表
  const loadEnterprises = async (pageNum: number = 1, pageSize: number = 10) => {
    setLoading(true)
    try {
      const data = await getEnterpriseList(
        pageNum,
        pageSize,
        filters.enterpriseName,
        filters.enterpriseTag
      )
      setEnterprises(data.list)
      setPagination({ current: data.pageNum, pageSize: data.pageSize, total: data.total })
    } catch (error) {
      console.error('加载企业列表失败:', error)
      toast.error('加载企业列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEnterprises(1, 10)
  }, [])

  // 打开创建/编辑对话框
  const openModal = (enterprise?: Enterprise) => {
    setEditingEnterprise(enterprise || null)
    if (enterprise) {
      form.reset({
        enterpriseName: enterprise.enterpriseName,
        enterpriseCode: enterprise.enterpriseCode,
        enterpriseTag: enterprise.enterpriseTag || undefined,
        contactPerson: enterprise.contactPerson || undefined,
        contactPhone: enterprise.contactPhone || undefined,
        address: enterprise.address || undefined,
        description: enterprise.description || undefined,
      })
    } else {
      form.reset()
    }
    setModalVisible(true)
  }

  // 保存企业
  const handleSaveEnterprise = async (values: any) => {
    try {
      if (editingEnterprise) {
        await updateEnterprise(editingEnterprise.id, values)
        toast.success('企业更新成功')
      } else {
        await createEnterprise(values)
        toast.success('企业创建成功')
      }

      setModalVisible(false)
      loadEnterprises(pagination.current, pagination.pageSize)
    } catch (error: any) {
      console.error('保存企业失败:', error)
      toast.error(error.message || '保存企业失败')
    }
  }

  // 删除企业
  const handleDeleteEnterprise = async (id: number) => {
    try {
      await deleteEnterprise(id)
      toast.success('企业删除成功')
      loadEnterprises(pagination.current, pagination.pageSize)
    } catch (error: any) {
      console.error('删除企业失败:', error)
      toast.error(error.message || '删除企业失败')
    }
  }

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      toast.warning('请选择要删除的企业')
      return
    }

    try {
      await Promise.all(selectedRowKeys.map((id) => deleteEnterprise(id as number)))
      toast.success('批量删除成功')
      setSelectedRowKeys([])
      loadEnterprises(pagination.current, pagination.pageSize)
    } catch (error: any) {
      console.error('批量删除失败:', error)
      toast.error(error.message || '批量删除失败')
    }
  }

  // 搜索
  const handleSearch = () => {
    const values = searchForm.getValues()
    setFilters(values)
    loadEnterprises(1, pagination.pageSize)
  }

  // 重置搜索
  const handleReset = () => {
    searchForm.reset({
      enterpriseName: '',
      enterpriseTag: undefined,
    })
    setFilters({
      enterpriseName: '',
      enterpriseTag: undefined,
    })
    setTimeout(() => {
      loadEnterprises(1, pagination.pageSize)
    }, 0)
  }

  // 表格列定义
  const columns: TableColumn<Enterprise>[] = [
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
      title: '企业名称',
      dataIndex: 'enterpriseName',
      key: 'enterpriseName',
      width: '200px',
      render: (name) => <span className="font-medium text-gray-900">{name as string}</span>,
    },
    {
      title: '统一社会信用编码',
      dataIndex: 'enterpriseCode',
      key: 'enterpriseCode',
      width: '180px',
      render: (code) => <span className="text-sm text-gray-600 font-mono">{code as string}</span>,
    },
    {
      title: '站点数量',
      dataIndex: 'siteCount',
      key: 'siteCount',
      width: '100px',
      render: (count) => (
        <span className="inline-flex items-center justify-center w-8 h-8 text-sm font-medium text-ocean-teal bg-ocean-seafoam/20 rounded-full">
          {count as number}
        </span>
      ),
    },
    {
      title: '企业标签',
      dataIndex: 'enterpriseTag',
      key: 'enterpriseTag',
      width: '100px',
      render: (tag) =>
        tag ? (
          <Tag color={tag === '国控' ? 'error' : 'primary'}>
            {tag as string}
          </Tag>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      title: '联系人',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
      width: '120px',
      render: (person) => <span className="text-sm text-gray-600">{person as string}</span>,
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
      key: 'contactPhone',
      width: '140px',
      render: (phone) => <span className="text-sm text-gray-600">{phone as string}</span>,
    },
    {
      title: '操作',
      key: 'action',
      width: '200px',
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
          <Tooltip title="相关站点">
            <Button
              variant="ghost"
              size="sm"
              icon={<LinkIcon className="w-4 h-4" />}
              onClick={() => {
                // TODO: 跳转到相关���点页面
                toast.info('查看相关站点功能开发中')
              }}
            />
          </Tooltip>
          <Popconfirm
            title="确认删除"
            description="确定要删除这个企业吗？"
            onConfirm={() => handleDeleteEnterprise(record.id)}
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
  ]

  return (
    <div className="p-6 space-y-6">
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardBody>
          {/* 搜索表单 */}
          <Form form={searchForm} onSubmit={handleSearch}>
            <div className="mb-6 flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">企业名称：</span>
                <FormField name="enterpriseName">
                  {({ field }) => (
                    <Input
                      {...field}
                      placeholder="请输入企业名称"
                      className="w-48"
                      prefix={<BuildingOfficeIcon className="w-4 h-4 text-gray-400" />}
                    />
                  )}
                </FormField>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">企业标签：</span>
                <FormField name="enterpriseTag">
                  {({ field }) => (
                    <Select
                      {...field}
                      placeholder="请选择企业标签"
                      options={ENTERPRISE_TAGS}
                      className="w-36"
                    />
                  )}
                </FormField>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  icon={<MagnifyingGlassIcon className="w-4 h-4" />}
                >
                  查询
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  重置
                </Button>
              </div>
            </div>
          </Form>

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
              description={`确定要删除选中的 ${selectedRowKeys.length} 个企业吗？`}
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

          {/* 企业表格 */}
          <Table
            rowSelection={{
              selectedRowKeys,
              onChange: setSelectedRowKeys,
            }}
            columns={columns}
            dataSource={enterprises}
            rowKey="id"
            loading={loading}
            size="middle"
          />

          {/* 分页 */}
          <div className="mt-4 flex justify-end">
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={(page, pageSize) => {
                loadEnterprises(page, pageSize)
              }}
              showSizeChanger
              showTotal
            />
          </div>
        </CardBody>
      </Card>

      {/* 创建/编辑对话框 */}
      <Modal
        open={modalVisible}
        onClose={() => {
          setModalVisible(false)
          form.reset()
        }}
        title={editingEnterprise ? '编辑企业' : '新增企业'}
        width={600}
      >
        <Form form={form} onSubmit={handleSaveEnterprise}>
          <div className="space-y-4">
            <FormField
              name="enterpriseName"
              label="企业名称"
              required
              rules={{ required: '请输入企业名称' }}
            >
              {({ field }) => (
                <Input
                  {...field}
                  placeholder="请输入企业名称"
                  prefix={<BuildingOfficeIcon className="w-4 h-4 text-gray-400" />}
                />
              )}
            </FormField>

            <FormField
              name="enterpriseCode"
              label="统一社会信用编码"
              required
              rules={{
                required: '请输入统一社会信用编码',
                minLength: { value: 18, message: '统一社会信用编码应为18位' },
                maxLength: { value: 18, message: '统一社会信用编码应为18位' },
              }}
            >
              {({ field }) => (
                <Input
                  {...field}
                  placeholder="请输入18位统一社会信用编码"
                  maxLength={18}
                  disabled={!!editingEnterprise}
                  className="font-mono"
                />
              )}
            </FormField>

            <FormField name="enterpriseTag" label="企业标签">
              {({ field }) => (
                <Select
                  {...field}
                  placeholder="请选择企业标签"
                  options={ENTERPRISE_TAGS}
                  prefix={<TagIcon className="w-4 h-4 text-gray-400" />}
                />
              )}
            </FormField>

            <FormField name="contactPerson" label="联系人">
              {({ field }) => (
                <Input
                  {...field}
                  placeholder="请输入联系人"
                  prefix={<UserIconOutline className="w-4 h-4 text-gray-400" />}
                />
              )}
            </FormField>

            <FormField name="contactPhone" label="联系电话">
              {({ field }) => (
                <Input
                  {...field}
                  placeholder="请输入联系电话"
                  prefix={<PhoneIcon className="w-4 h-4 text-gray-400" />}
                />
              )}
            </FormField>

            <FormField name="address" label="企业地址">
              {({ field }) => (
                <Input
                  {...field}
                  placeholder="请输入企业地址"
                  prefix={<MapPinIcon className="w-4 h-4 text-gray-400" />}
                />
              )}
            </FormField>

            <FormField name="description" label="企业描述">
              {({ field }) => (
                <TextArea
                  {...field}
                  placeholder="请输入企业描述"
                  rows={4}
                  maxLength={500}
                  showCount
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

export default Enterprises
