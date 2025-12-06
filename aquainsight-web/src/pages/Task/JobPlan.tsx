import React, { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Input,
  Select,
  Button,
  Row,
  Col,
  Tree,
  message,
  Space,
  Tag,
  Modal,
  DatePicker,
  Form,
} from 'antd'
import {
  BuildOutlined,
  EnvironmentOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { DataNode } from 'antd/es/tree'
import {
  getSiteJobPlanPage,
  backfillJobInstances,
  type SiteJobPlan,
  type BackfillJobInstancesRequest,
} from '@/services/maintenance'
import {
  getEnterpriseSiteTree,
} from '@/services/monitoring'
import { getAllDepartments, type Department } from '@/services/organization'

const { RangePicker } = DatePicker

// 星期映射
const WEEKDAYS_MAP: { [key: number]: string } = {
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六',
  7: '日',
}

// 扩展的任务计划类型
type SiteJobPlanExtended = SiteJobPlan & {
  enterpriseId?: number
  enterpriseName?: string
  siteCode?: string
}

const JobPlan: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [jobPlans, setJobPlans] = useState<SiteJobPlanExtended[]>([])
  const [total, setTotal] = useState(0)
  const [pageNum, setPageNum] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // 树形数据
  const [treeData, setTreeData] = useState<DataNode[]>([])
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([])

  // 搜索条件
  const [filters, setFilters] = useState({
    siteName: '',
    enterpriseName: '',
    departmentId: undefined as number | undefined,
  })

  // 当前选中的企业或站点
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState<number | undefined>()
  const [selectedSiteId, setSelectedSiteId] = useState<number | undefined>()

  // 部门列表
  const [departments, setDepartments] = useState<Department[]>([])

  // 补任务弹窗
  const [backfillModalVisible, setBackfillModalVisible] = useState(false)
  const [backfillLoading, setBackfillLoading] = useState(false)
  const [currentJobPlan, setCurrentJobPlan] = useState<SiteJobPlanExtended | null>(null)
  const [backfillForm] = Form.useForm()

  // 加载企业-站点树
  const loadEnterpriseTree = async () => {
    try {
      const data = await getEnterpriseSiteTree(filters.enterpriseName, filters.siteName)

      // 转换为树形结构数据
      const treeNodes: DataNode[] = data.map((enterprise) => ({
        key: `enterprise-${enterprise.enterpriseId}`,
        title: (
          <span>
            <BuildOutlined style={{ marginRight: 8 }} />
            {enterprise.enterpriseName}
          </span>
        ),
        children: enterprise.sites.map((site) => ({
          key: `site-${site.id}`,
          title: (
            <span>
              <EnvironmentOutlined style={{ marginRight: 8 }} />
              {site.siteName}
            </span>
          ),
          isLeaf: true,
        })),
      }))

      setTreeData(treeNodes)

      // 默认展开第一个企业
      if (treeNodes.length > 0) {
        setExpandedKeys([treeNodes[0].key])
      }
    } catch (error) {
      console.error('加载企业站点树失败:', error)
      message.error('加载企业站点树失败')
    }
  }

  // 加载任务计划列表
  const loadJobPlans = async () => {
    setLoading(true)
    try {
      const response = await getSiteJobPlanPage({
        pageNum,
        pageSize,
        siteName: filters.siteName || undefined,
        enterpriseId: selectedEnterpriseId,
        siteId: selectedSiteId,
        departmentId: filters.departmentId,
      })

      setJobPlans(response.list || [])
      setTotal(response.total || 0)
    } catch (error) {
      console.error('加载任务计划列表失败:', error)
      message.error('加载任务计划列表失败')
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

  // 初始化加载
  useEffect(() => {
    loadEnterpriseTree()
    loadDepartments()
  }, [])

  // 当筛选条件或分页变化时重新加载
  useEffect(() => {
    loadJobPlans()
  }, [pageNum, pageSize, selectedEnterpriseId, selectedSiteId, filters.departmentId])

  // 树节点选择事件
  const handleTreeSelect = (keys: React.Key[]) => {
    setSelectedKeys(keys)

    if (keys.length === 0) {
      setSelectedEnterpriseId(undefined)
      setSelectedSiteId(undefined)
      return
    }

    const key = keys[0].toString()

    if (key.startsWith('enterprise-')) {
      // 选中企业
      const enterpriseId = parseInt(key.replace('enterprise-', ''))
      setSelectedEnterpriseId(enterpriseId)
      setSelectedSiteId(undefined)
    } else if (key.startsWith('site-')) {
      // 选中站点
      const siteId = parseInt(key.replace('site-', ''))
      setSelectedEnterpriseId(undefined)
      setSelectedSiteId(siteId)
    }
  }

  // 解析周期配置为可读文本
  const formatPeriodConfig = (plan: SiteJobPlanExtended) => {
    if (!plan.periodConfig) return '-'

    const { periodType, n } = plan.periodConfig

    if (periodType === 'WEEK' && n) {
      // 解析位图
      const weekdays: number[] = []
      for (let i = 1; i <= 7; i++) {
        if (n & Math.pow(2, i)) {
          weekdays.push(i)
        }
      }
      const weekdayNames = weekdays.map(w => WEEKDAYS_MAP[w]).join('、')
      return `星期${weekdayNames}`
    }

    if (periodType === 'MONTH' && n) {
      // 解析位图
      const days: number[] = []
      for (let i = 1; i <= 31; i++) {
        if (n & Math.pow(2, i)) {
          days.push(i)
        }
      }
      return `每月${days.join('、')}日`
    }

    if (periodType === 'INTERVAL' && n) {
      return `每隔${n}天`
    }

    return '-'
  }

  // 打开补任务弹窗
  const handleOpenBackfill = (record: SiteJobPlanExtended) => {
    setCurrentJobPlan(record)
    setBackfillModalVisible(true)
    backfillForm.resetFields()
  }

  // 提交补任务
  const handleBackfillSubmit = async () => {
    try {
      const values = await backfillForm.validateFields()

      if (!currentJobPlan) {
        message.error('未选择任务计划')
        return
      }

      setBackfillLoading(true)

      const [startTime, endTime] = values.dateRange
      const request: BackfillJobInstancesRequest = {
        siteJobPlanId: currentJobPlan.id,
        startTime: startTime.format('YYYY-MM-DD HH:mm:ss'),
        endTime: endTime.format('YYYY-MM-DD HH:mm:ss'),
      }

      const result = await backfillJobInstances(request)

      message.success(`成功补齐 ${result.totalCount} 个任务实例`)
      setBackfillModalVisible(false)
      backfillForm.resetFields()

    } catch (error: any) {
      console.error('补任务失败:', error)
      if (error.errorFields) {
        // 表单验证错误
        return
      }
      message.error(error.message || '补任务失败')
    } finally {
      setBackfillLoading(false)
    }
  }

  // 表格列定义
  const columns: ColumnsType<SiteJobPlanExtended> = [
    {
      title: '序号',
      width: 80,
      render: (_, __, index) => (pageNum - 1) * pageSize + index + 1,
    },
    {
      title: '运维周期',
      width: 150,
      ellipsis: {
        showTitle: true,
      },
      render: (_, record) => formatPeriodConfig(record),
    },
    {
      title: '站点名称',
      dataIndex: 'siteName',
      width: 180,
      ellipsis: {
        showTitle: true,
      },
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
      title: '运维小组',
      dataIndex: 'departmentName',
      width: 150,
      ellipsis: {
        showTitle: true,
      },
      render: (text) => text || '-',
    },
    {
      title: '状态',
      dataIndex: 'jobPlanState',
      width: 100,
      render: (state) => {
        if (state === '进行中') {
          return <Tag color="success">{state}</Tag>
        }
        if (state === '暂停') {
          return <Tag color="warning">{state}</Tag>
        }
        return <Tag>{state}</Tag>
      },
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<PlusOutlined />}
            onClick={() => handleOpenBackfill(record)}
          >
            补任务
          </Button>
        </Space>
      ),
    },
  ]

  // 搜索处理
  const handleSearch = () => {
    setPageNum(1)
    loadEnterpriseTree()
    loadJobPlans()
  }

  return (
    <div style={{ padding: '0 24px' }}>
      <Card title="任务计划" bodyStyle={{ padding: 0 }}>
        <Row gutter={0} style={{ minHeight: 'calc(100vh - 200px)' }}>
          {/* 左侧：企业-站点树 */}
          <Col span={5} style={{ borderRight: '1px solid #f0f0f0' }}>
            <div style={{ padding: '16px' }}>
              <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 16 }}>全部站点</div>

              {/* 搜索框 */}
              <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
                <Input
                  placeholder="请输入企业名称"
                  value={filters.enterpriseName}
                  onChange={(e) => setFilters({ ...filters, enterpriseName: e.target.value })}
                  onPressEnter={handleSearch}
                />
                <Input
                  placeholder="请输入站点名称"
                  value={filters.siteName}
                  onChange={(e) => setFilters({ ...filters, siteName: e.target.value })}
                  onPressEnter={handleSearch}
                />
              </Space>

              {/* 树形结构 */}
              <div style={{ maxHeight: 'calc(100vh - 380px)', overflow: 'auto' }}>
                <Tree
                  treeData={treeData}
                  expandedKeys={expandedKeys}
                  selectedKeys={selectedKeys}
                  onExpand={(keys) => setExpandedKeys(keys)}
                  onSelect={handleTreeSelect}
                  showLine
                />
              </div>
            </div>
          </Col>

          {/* 右侧：任务计划列表 */}
          <Col span={19}>
            <div style={{ padding: '16px' }}>
              {/* 筛选条件 */}
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={8}>
                  <Select
                    placeholder="请选择运维小组"
                    allowClear
                    value={filters.departmentId}
                    onChange={(value) => {
                      setFilters({ ...filters, departmentId: value })
                      setPageNum(1)
                    }}
                    style={{ width: '100%' }}
                  >
                    {departments.map((dept) => (
                      <Select.Option key={dept.id} value={dept.id}>
                        {dept.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Col>
              </Row>

              {/* 任务计划表格 */}
              <Table
                columns={columns}
                dataSource={jobPlans}
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
                scroll={{ x: 1200, y: 'calc(100vh - 340px)' }}
              />
            </div>
          </Col>
        </Row>
      </Card>

      {/* 补任务弹窗 */}
      <Modal
        title="补齐任务实例"
        open={backfillModalVisible}
        onOk={handleBackfillSubmit}
        onCancel={() => {
          setBackfillModalVisible(false)
          backfillForm.resetFields()
        }}
        confirmLoading={backfillLoading}
        width={600}
      >
        <div style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8, color: '#666' }}>
            <strong>站点名称：</strong>{currentJobPlan?.siteName || '-'}
          </div>
          <div style={{ marginBottom: 8, color: '#666' }}>
            <strong>运维周期：</strong>{currentJobPlan ? formatPeriodConfig(currentJobPlan) : '-'}
          </div>
          <div style={{ marginBottom: 8, color: '#666' }}>
            <strong>运维方案：</strong>{currentJobPlan?.schemeName || '-'}
          </div>
        </div>

        <Form
          form={backfillForm}
          layout="vertical"
        >
          <Form.Item
            label="时间范围"
            name="dateRange"
            rules={[{ required: true, message: '请选择时间范围' }]}
          >
            <RangePicker
              style={{ width: '100%' }}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder={['开始时间', '结束时间']}
            />
          </Form.Item>

          <div style={{ padding: '12px', background: '#f0f2f5', borderRadius: 4, marginTop: 16 }}>
            <div style={{ fontSize: 12, color: '#666', lineHeight: '20px' }}>
              <div>💡 说明：</div>
              <div>• 系统会根据任务计划的周期配置，自动计算时间范围内应存在的所有任务</div>
              <div>• 仅会补齐缺失的任务实例，已存在的任务不会重复生成</div>
              <div>• 生成的任务状态为"待处理"，过期时间根据方案配置自动计算</div>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  )
}

export default JobPlan
