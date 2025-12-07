import React, { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Input,
  Select,
  Button,
  Row,
  Col,
  message,
  Space,
  Tag,
  DatePicker,
  Modal,
  Form,
} from 'antd'
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import {
  getSiteJobInstancePage,
  createManualJobInstance,
  type SiteJobInstance,
} from '@/services/maintenance'
import { getAllDepartments, type Department } from '@/services/organization'
import { getEnterpriseSiteTree, type EnterpriseSiteTree } from '@/services/monitoring'
import { getSchemeList, type Scheme } from '@/services/maintenance'

const { RangePicker } = DatePicker

// 任务状态映射
const STATUS_MAP: { [key: string]: { text: string; color: string } } = {
  PENDING: { text: '待处理', color: 'default' },
  IN_PROGRESS: { text: '进行中', color: 'processing' },
  COMPLETED: { text: '已完成', color: 'success' },
  OVERDUE: { text: '已逾期', color: 'error' },
  CANCELLED: { text: '已取消', color: 'warning' },
  EXPIRING: { text: '即将逾期', color: 'warning' },
}

const TaskExecution: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [jobInstances, setJobInstances] = useState<SiteJobInstance[]>([])
  const [total, setTotal] = useState(0)
  const [pageNum, setPageNum] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // 部门列表
  const [departments, setDepartments] = useState<Department[]>([])

  // 新建任务弹窗相关
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [createForm] = Form.useForm()

  // 站点树列表
  const [enterpriseSiteTree, setEnterpriseSiteTree] = useState<EnterpriseSiteTree[]>([])
  // 方案列表
  const [schemes, setSchemes] = useState<Scheme[]>([])

  // 搜索条件（表单输入）
  const [searchForm, setSearchForm] = useState({
    siteName: '',
    status: undefined as string | undefined,
    startTime: undefined as string | undefined,
    endTime: undefined as string | undefined,
    creator: '',
    departmentId: undefined as number | undefined,
  })

  // 实际查询条件（点击查询后生效）
  const [queryParams, setQueryParams] = useState({
    siteName: undefined as string | undefined,
    status: undefined as string | undefined,
    startTime: undefined as string | undefined,
    endTime: undefined as string | undefined,
    creator: undefined as string | undefined,
    departmentId: undefined as number | undefined,
  })

  // 加载任务实例列表
  const loadJobInstances = async () => {
    setLoading(true)
    try {
      const response = await getSiteJobInstancePage({
        pageNum,
        pageSize,
        ...queryParams,
      })

      setJobInstances(response.list || [])
      setTotal(response.total || 0)
    } catch (error) {
      console.error('加载任务实例列表失败:', error)
      message.error('加载任务实例列表失败')
    } finally {
      setLoading(false)
    }
  }

  // 加载部门列表
  const loadDepartments = async () => {
    try {
      const data = await getAllDepartments()
      setDepartments(data)
    } catch (error) {
      console.error('加载部门列表失败:', error)
    }
  }

  // 加载站点树
  const loadEnterpriseSiteTree = async () => {
    try {
      const data = await getEnterpriseSiteTree()
      setEnterpriseSiteTree(data)
    } catch (error) {
      console.error('加载站点列表失败:', error)
    }
  }

  // 加载方案列表
  const loadSchemes = async () => {
    try {
      const data = await getSchemeList()
      setSchemes(data)
    } catch (error) {
      console.error('加载方案列表失败:', error)
    }
  }

  // 初始化加载部门列表
  useEffect(() => {
    loadDepartments()
  }, [])

  // 当分页或查询参数变化时重新加载数据
  useEffect(() => {
    loadJobInstances()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNum, pageSize, queryParams])

  // 搜索处理
  const handleSearch = () => {
    setPageNum(1)
    setQueryParams({
      siteName: searchForm.siteName || undefined,
      status: searchForm.status,
      startTime: searchForm.startTime,
      endTime: searchForm.endTime,
      creator: searchForm.creator || undefined,
      departmentId: searchForm.departmentId,
    })
  }

  // 重置处理
  const handleReset = () => {
    const emptyForm = {
      siteName: '',
      status: undefined,
      startTime: undefined,
      endTime: undefined,
      creator: '',
      departmentId: undefined,
    }
    setSearchForm(emptyForm)
    setQueryParams({
      siteName: undefined,
      status: undefined,
      startTime: undefined,
      endTime: undefined,
      creator: undefined,
      departmentId: undefined,
    })
    setPageNum(1)
  }

  // 时间范围变化
  const handleTimeRangeChange = (dates: any) => {
    if (dates && dates.length === 2) {
      setSearchForm({
        ...searchForm,
        startTime: dates[0].format('YYYY-MM-DD HH:mm:ss'),
        endTime: dates[1].format('YYYY-MM-DD HH:mm:ss'),
      })
    } else {
      setSearchForm({
        ...searchForm,
        startTime: undefined,
        endTime: undefined,
      })
    }
  }

  // 打开新建任务弹窗
  const handleOpenCreateModal = () => {
    loadEnterpriseSiteTree()
    loadSchemes()
    setCreateModalVisible(true)
  }

  // 关闭新建任务弹窗
  const handleCloseCreateModal = () => {
    setCreateModalVisible(false)
    createForm.resetFields()
  }

  // 提交新建任务
  const handleCreateSubmit = async () => {
    try {
      const values = await createForm.validateFields()
      setCreateLoading(true)

      await createManualJobInstance({
        siteId: values.siteId,
        schemeId: values.schemeId,
        departmentId: values.departmentId,
      })

      message.success('任务创建成功')
      handleCloseCreateModal()
      // 重新加载列表
      loadJobInstances()
    } catch (error: any) {
      if (error.errorFields) {
        // 表单验证错误，不显示消息
        return
      }
      console.error('创建任务失败:', error)
      message.error(error.message || '创建任务失败')
    } finally {
      setCreateLoading(false)
    }
  }

  // 表格列定义
  const columns: ColumnsType<SiteJobInstance> = [
    {
      title: '序号',
      width: 60,
      fixed: 'left',
      render: (_, __, index) => (pageNum - 1) * pageSize + index + 1,
    },
    {
      title: '站点任务',
      dataIndex: 'siteName',
      width: 180,
      fixed: 'left',
      ellipsis: {
        showTitle: true,
      },
    },
    {
      title: '任务状态',
      dataIndex: 'status',
      width: 100,
      render: (status) => {
        const statusInfo = STATUS_MAP[status] || { text: status, color: 'default' }
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
      },
    },
    {
      title: '任务期限',
      dataIndex: 'expiredTime',
      width: 160,
      render: (text) => text || '-',
    },
    {
      title: '所属客户',
      dataIndex: 'enterpriseName',
      width: 200,
      ellipsis: {
        showTitle: true,
      },
      render: (text) => text || '-',
    },
    {
      title: '运维方案',
      dataIndex: 'schemeName',
      width: 150,
      ellipsis: {
        showTitle: true,
      },
      render: (text) => text || '-',
    },
    {
      title: '任务项量',
      dataIndex: 'taskItemCount',
      width: 100,
      align: 'center',
      render: (count) => count || 0,
    },
    {
      title: '运维小组',
      dataIndex: 'departmentName',
      width: 150,
      ellipsis: {
        showTitle: true,
      },
      render: (text) => text || '-',
    },
    {
      title: '发布者',
      dataIndex: 'creator',
      width: 120,
      render: (text) => text || '-',
    },
    {
      title: '派发时间',
      dataIndex: 'triggerTime',
      width: 160,
      render: (text) => text || '-',
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      render: () => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => {
              message.info('查看详情功能待开发')
            }}
          >
            查看
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: '0 24px' }}>
      <Card title="任务执行" bodyStyle={{ padding: '16px' }}>
        {/* 筛选条件 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Input
              placeholder="请输入站点名称"
              value={searchForm.siteName}
              onChange={(e) => setSearchForm({ ...searchForm, siteName: e.target.value })}
              onPressEnter={handleSearch}
              allowClear
            />
          </Col>
          <Col span={6}>
            <Select
              placeholder="请选择任务状态"
              value={searchForm.status}
              onChange={(value) => setSearchForm({ ...searchForm, status: value })}
              allowClear
              style={{ width: '100%' }}
            >
              <Select.Option value="PENDING">待处理</Select.Option>
              <Select.Option value="IN_PROGRESS">进行中</Select.Option>
              <Select.Option value="COMPLETED">已完成</Select.Option>
              <Select.Option value="OVERDUE">已逾期</Select.Option>
              <Select.Option value="CANCELLED">已取消</Select.Option>
            </Select>
          </Col>
          <Col span={6}>
            <RangePicker
              placeholder={['开始时间', '结束时间']}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              onChange={handleTimeRangeChange}
              style={{ width: '100%' }}
              value={
                searchForm.startTime && searchForm.endTime
                  ? [dayjs(searchForm.startTime), dayjs(searchForm.endTime)]
                  : null
              }
            />
          </Col>
          <Col span={6}>
            <Input
              placeholder="请输入创建人"
              value={searchForm.creator}
              onChange={(e) => setSearchForm({ ...searchForm, creator: e.target.value })}
              onPressEnter={handleSearch}
              allowClear
            />
          </Col>
        </Row>

        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Select
              placeholder="请选择运维小组"
              value={searchForm.departmentId}
              onChange={(value) => setSearchForm({ ...searchForm, departmentId: value })}
              allowClear
              style={{ width: '100%' }}
            >
              {departments.map((dept) => (
                <Select.Option key={dept.id} value={dept.id}>
                  {dept.name}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col span={18}>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                查询
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenCreateModal}>
                新建任务
              </Button>
            </Space>
          </Col>
        </Row>

        {/* 任务实例表格 */}
        <Table
          columns={columns}
          dataSource={jobInstances}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pageNum,
            pageSize,
            total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onChange: (page, size) => {
              setPageNum(page)
              setPageSize(size || 20)
            },
          }}
          size="small"
          scroll={{ x: 1600, y: 'calc(100vh - 340px)' }}
        />
      </Card>

      {/* 新建任务弹窗 */}
      <Modal
        title="新建任务"
        open={createModalVisible}
        onOk={handleCreateSubmit}
        onCancel={handleCloseCreateModal}
        confirmLoading={createLoading}
        width={600}
      >
        <Form
          form={createForm}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            label="选择站点"
            name="siteId"
            rules={[{ required: true, message: '请选择站点' }]}
          >
            <Select
              placeholder="请选择站点"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            >
              {enterpriseSiteTree.map((enterprise) => (
                <Select.OptGroup key={enterprise.enterpriseId} label={enterprise.enterpriseName}>
                  {enterprise.sites.map((site) => (
                    <Select.Option key={site.id} value={site.id} label={site.siteName}>
                      {site.siteName}
                    </Select.Option>
                  ))}
                </Select.OptGroup>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="运维小组"
            name="departmentId"
            rules={[{ required: true, message: '请选择运维小组' }]}
          >
            <Select placeholder="请选择运维小组">
              {departments.map((dept) => (
                <Select.Option key={dept.id} value={dept.id}>
                  {dept.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="运维方案"
            name="schemeId"
            rules={[{ required: true, message: '请选择运维方案' }]}
          >
            <Select placeholder="请选择运维方案">
              {schemes.map((scheme) => (
                <Select.Option key={scheme.id} value={scheme.id}>
                  {scheme.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default TaskExecution
