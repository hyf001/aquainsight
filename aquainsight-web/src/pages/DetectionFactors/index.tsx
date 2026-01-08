import React, { useState, useEffect } from 'react'
import {
  BeakerIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  ChartBarIcon,
  CubeIcon,
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
  Popconfirm,
  Pagination,
} from '@/components/ui'
import {
  getFactorList,
  createFactor,
  updateFactor,
  deleteFactor,
  type Factor,
} from '@/services/monitoring'
import { toast } from '@/utils/toast'
import { cn } from '@/utils/cn'

const CATEGORIES = [
  { key: 'water_quality', name: '水环境质量' },
  { key: 'air_quality', name: '大气环境质量' },
]

const DetectionFactors: React.FC = () => {
  const [factors, setFactors] = useState<Factor[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingFactor, setEditingFactor] = useState<Factor | null>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES[0].key)
  const [searchText, setSearchText] = useState('')

  const form = useForm()

  // Load factors
  const loadFactors = async (pageNum: number = 1, pageSize: number = 10) => {
    setLoading(true)
    try {
      const data = await getFactorList(pageNum, pageSize, selectedCategory)
      setFactors(data.list)
      setPagination({ current: data.pageNum, pageSize: data.pageSize, total: data.total })
    } catch (error) {
      console.error('加载监测因子失败:', error)
      toast.error('加载监测因子失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFactors(1, 10)
  }, [selectedCategory])

  // Change category
  const handleCategoryChange = (categoryKey: string) => {
    setSelectedCategory(categoryKey)
    setSelectedRowKeys([])
    setSearchText('')
  }

  // Open create/edit modal
  const openModal = (factor?: Factor) => {
    setEditingFactor(factor || null)
    if (factor) {
      form.reset({
        factorCode: factor.factorCode,
        nationalCode: factor.nationalCode || undefined,
        factorName: factor.factorName,
        shortName: factor.shortName || undefined,
        category: factor.category || selectedCategory,
        unit: factor.unit || undefined,
        upperLimit: factor.upperLimit || undefined,
        lowerLimit: factor.lowerLimit || undefined,
        precisionDigits: factor.precisionDigits || 2,
      })
    } else {
      form.reset({ category: selectedCategory, precisionDigits: 2 })
    }
    setModalVisible(true)
  }

  // Save factor
  const handleSaveFactor = async (values: any) => {
    try {
      if (editingFactor) {
        await updateFactor(editingFactor.id, values)
        toast.success('更新成功')
      } else {
        await createFactor(values)
        toast.success('创建成功')
      }
      setModalVisible(false)
      loadFactors(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('保存监测因子失败:', error)
      toast.error('保存失败')
    }
  }

  // Delete factor
  const handleDeleteFactor = async (id: number) => {
    try {
      await deleteFactor(id)
      toast.success('删除成功')
      loadFactors(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('删除监测因子失败:', error)
      toast.error('删除失败')
    }
  }

  // Delete multiple factors
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      toast.warning('请选择要删除的因子')
      return
    }
    try {
      for (const id of selectedRowKeys) {
        await deleteFactor(id as number)
      }
      toast.success('批量删除成功')
      setSelectedRowKeys([])
      loadFactors(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('批量删除失败:', error)
      toast.error('批量删除失败')
    }
  }

  // Handle search
  const handleSearch = () => {
    loadFactors(1, 10)
  }

  // Filter factors by search text
  const filteredFactors = searchText.trim()
    ? factors.filter(
        (f) =>
          f.factorCode?.includes(searchText) || f.factorName?.includes(searchText)
      )
    : factors

  // Category options for select
  const categoryOptions: SelectOption[] = CATEGORIES.map((c) => ({
    label: c.name,
    value: c.key,
  }))

  // Table columns
  const columns: TableColumn<Factor>[] = [
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
            description="确定要删除该因子吗？"
            onConfirm={() => handleDeleteFactor(record.id)}
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
      title: '因子代码',
      dataIndex: 'factorCode',
      key: 'factorCode',
      width: '120px',
      render: (code) => <span className="font-mono text-sm text-gray-600">{code as string}</span>,
    },
    {
      title: '国标代码',
      dataIndex: 'nationalCode',
      key: 'nationalCode',
      render: (text) => (
        <span className="text-sm text-gray-600">{text ? (text as string) : '-'}</span>
      ),
    },
    {
      title: '因子名称',
      dataIndex: 'factorName',
      key: 'factorName',
      render: (name) => <span className="font-medium text-gray-900">{name as string}</span>,
    },
    {
      title: '简称',
      dataIndex: 'shortName',
      key: 'shortName',
      render: (text) => (
        <span className="text-sm text-gray-600">{text ? (text as string) : '-'}</span>
      ),
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-12 gap-6">
        {/* 左侧因子类别 */}
        <div className="col-span-3">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardBody>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <ChartBarIcon className="w-5 h-5 text-ocean-teal" />
                因子类别
              </h3>
              <div className="space-y-2">
                {CATEGORIES.map((category) => (
                  <div
                    key={category.key}
                    className={cn(
                      'px-4 py-3 rounded-lg cursor-pointer transition-all duration-200',
                      selectedCategory === category.key
                        ? 'bg-ocean-teal text-white shadow-md'
                        : 'bg-gray-50 hover:bg-ocean-seafoam/20 text-gray-700 hover:text-ocean-teal'
                    )}
                    onClick={() => handleCategoryChange(category.key)}
                  >
                    <div className="flex items-center gap-2">
                      <BeakerIcon className="w-5 h-5" />
                      <span className="font-medium">{category.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* 右侧因子列表 */}
        <div className="col-span-9">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardBody>
              {/* 搜索栏 */}
              <div className="mb-6 flex items-center gap-4">
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  因子代码/名称：
                </span>
                <Input
                  placeholder="请输入因子代码或名称"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-64"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  prefix={<MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />}
                />
                <Button
                  variant="primary"
                  icon={<MagnifyingGlassIcon className="w-4 h-4" />}
                  onClick={handleSearch}
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
                  description={`确定要删除选中的 ${selectedRowKeys.length} 个因子吗？`}
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

              {/* 因子表格 */}
              <Table
                columns={columns}
                dataSource={filteredFactors}
                rowKey="id"
                loading={loading}
                rowSelection={{
                  selectedRowKeys,
                  onChange: setSelectedRowKeys,
                }}
                size="small"
              />

              {/* 分页 */}
              {filteredFactors.length > 0 && (
                <div className="mt-4 flex justify-end">
                  <Pagination
                    current={pagination.current}
                    pageSize={pagination.pageSize}
                    total={pagination.total}
                    onChange={(page, pageSize) => {
                      loadFactors(page, pageSize)
                    }}
                    showSizeChanger
                    showTotal
                  />
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* 新增/编辑弹窗 */}
      <Modal
        open={modalVisible}
        onClose={() => {
          setModalVisible(false)
          form.reset()
        }}
        title={editingFactor ? '编辑因子' : '新增因子'}
        width={600}
      >
        <Form form={form} onSubmit={handleSaveFactor}>
          <div className="space-y-4">
            <FormField
              name="factorCode"
              label="因子代码"
              required
              rules={{ required: '请输入因子代码' }}
            >
              {({ field }) => (
                <Input {...field} placeholder="请输入因子代码" className="font-mono" />
              )}
            </FormField>

            <FormField name="nationalCode" label="国标代码">
              {({ field }) => (
                <Input {...field} placeholder="请输入国标代码" className="font-mono" />
              )}
            </FormField>

            <FormField
              name="factorName"
              label="因子名称"
              required
              rules={{ required: '请输入因子名称' }}
            >
              {({ field }) => (
                <Input
                  {...field}
                  placeholder="请输入因子名称"
                  prefix={<BeakerIcon className="w-4 h-4 text-gray-400" />}
                />
              )}
            </FormField>

            <FormField name="shortName" label="简称">
              {({ field }) => <Input {...field} placeholder="请输入简称" />}
            </FormField>

            <FormField name="category" label="类别">
              {({ field }) => (
                <Select
                  {...field}
                  placeholder="请选择类别"
                  options={categoryOptions}
                  prefix={<ChartBarIcon className="w-4 h-4 text-gray-400" />}
                />
              )}
            </FormField>

            <FormField name="unit" label="单位">
              {({ field }) => (
                <Input
                  {...field}
                  placeholder="请输入单位"
                  prefix={<CubeIcon className="w-4 h-4 text-gray-400" />}
                />
              )}
            </FormField>

            <FormField name="upperLimit" label="上限">
              {({ field }) => (
                <Input {...field} type="number" placeholder="请输入上限值" />
              )}
            </FormField>

            <FormField name="lowerLimit" label="下限">
              {({ field }) => (
                <Input {...field} type="number" placeholder="请输入下限值" />
              )}
            </FormField>

            <FormField name="precisionDigits" label="精度">
              {({ field }) => (
                <Input
                  {...field}
                  type="number"
                  placeholder="请输入精度数字"
                  onChange={(e) => field.onChange(Number(e.target.value) || 2)}
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

export default DetectionFactors
