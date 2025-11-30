import React, { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Tabs,
  Radio,
  Checkbox,
  Row,
  Col,
  Tag,
} from 'antd'
import {
  SearchOutlined,
  SettingOutlined,
  ExportOutlined,
  FileTextOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { getSiteList, type Site } from '@/services/monitoring'
import { getAllDepartments, type Department } from '@/services/organization'
import {
  getSchemeList,
  type Scheme,
  configureSiteJobPlan,
  getSiteJobPlanBySiteId,
  getSitesWithJobPlans,
  type SiteJobPlan,
  type ConfigureSiteJobPlanRequest,
} from '@/services/maintenance'

const { TabPane } = Tabs

// 星期选项
const WEEKDAYS = [
  { label: '星期一', value: 1 },
  { label: '星期二', value: 2 },
  { label: '星期三', value: 3 },
  { label: '星期四', value: 4 },
  { label: '星期五', value: 5 },
  { label: '星期六', value: 6 },
  { label: '星期日', value: 7 },
]

type SiteWithConfig = Site & {
  jobPlan?: SiteJobPlan
}

type ConfigStep = 'department' | 'scheme' | 'period'

// 工具函数：从位图解码为数组
const decodeBitmap = (bitmap: number): number[] => {
  const result: number[] = []
  for (let i = 1; i <= 31; i++) {
    if (bitmap & Math.pow(2, i)) {
      result.push(i)
    }
  }
  return result
}

const SiteConfiguration: React.FC = () => {
  const [sites, setSites] = useState<SiteWithConfig[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedSiteIds, setSelectedSiteIds] = useState<number[]>([])
  const [filters, setFilters] = useState({
    siteName: '',
    siteType: undefined as string | undefined,
    departmentId: undefined as number | undefined,
  })

  // 配置相关状态
  const [configModalVisible, setConfigModalVisible] = useState(false)
  const [configStep, setConfigStep] = useState<ConfigStep>('department')
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | undefined>()
  const [selectedSchemeId, setSelectedSchemeId] = useState<number | undefined>()
  const [periodType, setPeriodType] = useState<'INTERVAL' | 'WEEK' | 'MONTH'>('WEEK')
  const [intervalN, setIntervalN] = useState<number>(7)
  const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>([])
  const [selectedDays, setSelectedDays] = useState<number[]>([])

  // 数据源
  const [departments, setDepartments] = useState<Department[]>([])
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [searchSchemeName, setSearchSchemeName] = useState('')

  // 加载站点列表
  const loadSites = async () => {
    setLoading(true)
    try {
      // 使用新的合并接口，一次性获取站点和任务计划
      const response = await getSitesWithJobPlans(1, 1000, filters.siteType)

      // 将后端返回的数据转换为前端需要的格式
      const sitesWithConfig = response.list.map((item: any) => {
        const site: Site = {
          id: item.id,
          siteCode: item.siteCode,
          siteName: item.siteName,
          siteType: item.siteType,
          siteTag: item.siteTag,
          longitude: item.longitude,
          latitude: item.latitude,
          address: item.address,
          isAutoUpload: item.isAutoUpload,
          enterpriseId: item.enterpriseId,
          enterpriseName: item.enterpriseName,
          createTime: item.createTime,
          updateTime: item.updateTime,
        }

        // 如果有任务计划信息，添加到site对象
        if (item.jobPlanId) {
          const jobPlan: SiteJobPlan = {
            id: item.jobPlanId,
            siteId: item.id,
            siteName: item.siteName,
            departmentId: item.departmentId,
            departmentName: item.departmentName,
            schemeId: item.schemeId,
            schemeName: item.schemeName,
            schemeCode: item.schemeCode,
            periodConfig: item.periodConfig,
            jobPlanState: item.jobPlanState,
            creator: item.jobPlanCreator,
            createTime: item.jobPlanCreateTime,
            updater: item.jobPlanUpdater,
            updateTime: item.jobPlanUpdateTime,
          }
          return { ...site, jobPlan }
        }

        return site
      })

      setSites(sitesWithConfig)
    } catch (error) {
      console.error('加载站点列表失败:', error)
      message.error('加载站点列表失败')
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

  // 加载方案列表
  const loadSchemes = async (name?: string) => {
    try {
      const data = await getSchemeList(name)
      setSchemes(data)
    } catch (error) {
      console.error('加载方案列表失败:', error)
    }
  }

  useEffect(() => {
    loadSites()
    loadDepartments()
    loadSchemes()
  }, [])

  // 打开配置弹窗
  const openConfigModal = (type: '运维小组' | '运维方案' | '运维计划') => {
    if (selectedSiteIds.length === 0) {
      message.warning('请先选择站点')
      return
    }

    // 重置状态
    setSelectedDepartmentId(undefined)
    setSelectedSchemeId(undefined)
    setPeriodType('WEEK')
    setIntervalN(7)
    setSelectedWeekdays([])
    setSelectedDays([])

    // 设置初始步骤
    if (type === '运维小组') {
      setConfigStep('department')
    } else if (type === '运维方案') {
      setConfigStep('scheme')
    } else {
      setConfigStep('period')
    }

    setConfigModalVisible(true)
  }

  // 提交配置
  const handleConfigSubmit = async () => {
    try {
      // 根据当前步骤验证
      if (configStep === 'department' && !selectedDepartmentId) {
        message.warning('请选择运维小组')
        return
      }
      if (configStep === 'scheme' && !selectedSchemeId) {
        message.warning('请选择运维方案')
        return
      }
      if (configStep === 'period') {
        if (periodType === 'INTERVAL' && !intervalN) {
          message.warning('请输入间隔天数')
          return
        }
        if (periodType === 'WEEK' && selectedWeekdays.length === 0) {
          message.warning('请选择运维星期')
          return
        }
        if (periodType === 'MONTH' && selectedDays.length === 0) {
          message.warning('请选择运维日期')
          return
        }
      }

      // 批量配置所有选中的站点
      let successCount = 0
      let failCount = 0

      for (const siteId of selectedSiteIds) {
        try {
          // 查询该站点是否已有配置
          let existingPlan: SiteJobPlan | null = null
          try {
            existingPlan = await getSiteJobPlanBySiteId(siteId)
          } catch (error) {
            // 站点没有配置，忽略错误
          }

          // 确定要使用的部门ID和方案ID
          let deptId = selectedDepartmentId
          let schId = selectedSchemeId

          // 如果当前步骤不是配置部门/方案，则使用已有配置的值
          if (configStep === 'period') {
            if (!deptId && existingPlan) {
              deptId = existingPlan.departmentId
            }
            if (!schId && existingPlan) {
              schId = existingPlan.schemeId
            }
          } else if (configStep === 'department') {
            // 配置部门时，使用已有的方案
            if (!schId && existingPlan) {
              schId = existingPlan.schemeId
            }
          } else if (configStep === 'scheme') {
            // 配置方案时，使用已有的部门
            if (!deptId && existingPlan) {
              deptId = existingPlan.departmentId
            }
          }

          // 如果还是缺少必要信息，记录警告但继续尝试提交（让后端处理）
          if (!deptId || !schId) {
            console.warn(`站点 ${siteId} 缺少部分配置信息: deptId=${deptId}, schId=${schId}`)
          }

          // 根据周期类型构建不同的配置
          let periodConfig: any = { periodType }

          if (periodType === 'INTERVAL') {
            periodConfig.n = intervalN
          } else if (periodType === 'WEEK') {
            // 对于周计划，使用位图方式: 将选中的星期几编码到一个整数中
            periodConfig.n = selectedWeekdays.reduce((acc, day) => acc + Math.pow(2, day), 0)
          } else if (periodType === 'MONTH') {
            // 对于月计划，同样使用位图方式编码
            periodConfig.n = selectedDays.reduce((acc, day) => acc + Math.pow(2, day), 0)
          }

          const request: ConfigureSiteJobPlanRequest = {
            siteId,
            departmentId: deptId!,
            schemeId: schId!,
            periodConfig,
          }
          await configureSiteJobPlan(request)
          successCount++
        } catch (error) {
          console.error(`配置站点 ${siteId} 失败:`, error)
          failCount++
        }
      }

      // 显示配置结果
      if (failCount === 0) {
        message.success(`配置成功！共配置 ${successCount} 个站点`)
      } else if (successCount === 0) {
        message.error(`配置失败！共 ${failCount} 个站点配置失败`)
      } else {
        message.warning(
          `部分配置成功！成功 ${successCount} 个，失败 ${failCount} 个`
        )
      }

      setConfigModalVisible(false)
      loadSites() // 重新加载站点数据
      setSelectedSiteIds([])
    } catch (error: any) {
      console.error('配置失败:', error)
      message.error(error.response?.data?.message || '配置失败')
    }
  }

  // 渲染周期配置内容
  const renderPeriodContent = () => {
    if (periodType === 'INTERVAL') {
      return (
        <div style={{ padding: '20px 0' }}>
          <Form.Item label="间隔天数">
            <Input
              type="number"
              value={intervalN}
              onChange={(e) => setIntervalN(Number(e.target.value))}
              placeholder="请输入间隔天数"
              style={{ width: 200 }}
            />
          </Form.Item>
        </div>
      )
    } else if (periodType === 'WEEK') {
      return (
        <div style={{ padding: '20px 0' }}>
          <Table
            columns={[
              {
                title: '单选',
                width: 80,
                render: (_, record: any) => (
                  <Checkbox
                    checked={selectedWeekdays.includes(record.value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedWeekdays([...selectedWeekdays, record.value])
                      } else {
                        setSelectedWeekdays(selectedWeekdays.filter((v) => v !== record.value))
                      }
                    }}
                  />
                ),
              },
              { title: '序号', width: 80, render: (_, __, index) => index + 1 },
              { title: '运维星期', dataIndex: 'label' },
            ]}
            dataSource={WEEKDAYS}
            rowKey="value"
            pagination={false}
            size="small"
          />
        </div>
      )
    } else if (periodType === 'MONTH') {
      const days = Array.from({ length: 31 }, (_, i) => ({
        value: i + 1,
        label: `${i + 1}日`,
      }))
      return (
        <div style={{ padding: '20px 0' }}>
          <Checkbox.Group
            value={selectedDays}
            onChange={(values) => setSelectedDays(values as number[])}
          >
            <Row gutter={[16, 16]}>
              {days.map((day) => (
                <Col span={4} key={day.value}>
                  <Checkbox value={day.value}>{day.label}</Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </div>
      )
    }
  }

  // 配置弹窗标题
  const getConfigModalTitle = () => {
    if (configStep === 'department') return '站点配置运维小组'
    if (configStep === 'scheme') return '站点配置运维方案'
    return '站点配置运维计划'
  }

  // 表格列定义
  const columns: ColumnsType<SiteWithConfig> = [
    { title: '序号', width: 80, render: (_, __, index) => index + 1 },
    { title: '站点名称', dataIndex: 'siteName', width: 150 },
    { title: '所属客户', dataIndex: 'enterpriseName', width: 150, render: (text) => text || '-' },
    {
      title: '站点类型',
      dataIndex: 'siteType',
      width: 100,
      render: (text) => {
        if (text === 'wastewater') return '污水'
        if (text === 'rainwater') return '雨水'
        return text || '-'
      },
    },
    { title: '站点标签', dataIndex: 'siteTag', width: 120, render: (text) => text || '-' },
    {
      title: '运维小组',
      width: 120,
      render: (_, record) => record.jobPlan?.departmentName || '-',
    },
    {
      title: '运维方案',
      width: 120,
      render: (_, record) => record.jobPlan?.schemeName || '-',
    },
    {
      title: '运维周期',
      width: 150,
      render: (_, record) => {
        if (!record.jobPlan || !record.jobPlan.periodConfig) return '-'
        const config = record.jobPlan.periodConfig

        if (config.periodType === 'WEEK' && config.n) {
          // 周计划：显示"每周一、三、五"
          const weekdays = decodeBitmap(config.n)
          const weekdayNames = weekdays
            .map((w) => WEEKDAYS.find((d) => d.value === w)?.label.replace('星期', ''))
            .join('、')
          return `每周${weekdayNames}`
        }

        if (config.periodType === 'MONTH' && config.n) {
          // 月计划：显示"每月1、15、30日"
          const days = decodeBitmap(config.n)
          return `每月${days.join('、')}日`
        }

        if (config.periodType === 'INTERVAL' && config.n) {
          // 间隔计划：显示"每隔5天"
          return `每隔${config.n}天`
        }

        return '-'
      },
    },
    {
      title: '状态',
      width: 100,
      render: (_, record) => {
        const state = record.jobPlan?.jobPlanState
        if (!state) {
          return <Tag color="default">未配置</Tag>
        }
        // 根据 jobPlanState 显示不同的状态
        return <Tag color="success">{state}</Tag>
      },
    },
    {
      title: '是否强制生成周期任务',
      width: 150,
      render: () => '否',
    },
  ]

  const rowSelection = {
    selectedRowKeys: selectedSiteIds,
    onChange: (keys: React.Key[]) => {
      setSelectedSiteIds(keys as number[])
    },
  }

  return (
    <div>
      <Card>
        <Tabs defaultActiveKey="config">
          <TabPane tab="运维概况" key="overview" />
          <TabPane tab="站点配置" key="config">
            {/* 搜索栏 */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={6}>
                <Input
                  placeholder="请输入站点名称"
                  value={filters.siteName}
                  onChange={(e) => setFilters({ ...filters, siteName: e.target.value })}
                />
              </Col>
              <Col span={6}>
                <Select
                  placeholder="请选择站点类型"
                  allowClear
                  value={filters.siteType}
                  onChange={(value) => setFilters({ ...filters, siteType: value })}
                  options={[
                    { label: '污水', value: 'wastewater' },
                    { label: '雨水', value: 'rainwater' },
                  ]}
                  style={{ width: '100%' }}
                />
              </Col>
              <Col span={6}>
                <Select
                  placeholder="请选择运维小组"
                  allowClear
                  value={filters.departmentId}
                  onChange={(value) => setFilters({ ...filters, departmentId: value })}
                  options={departments.map((d) => ({ label: d.name, value: d.id }))}
                  style={{ width: '100%' }}
                />
              </Col>
              <Col span={6}>
                <Button type="primary" icon={<SearchOutlined />} onClick={loadSites}>
                  查询
                </Button>
              </Col>
            </Row>

            {/* 操作按钮 */}
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Button
                  type="primary"
                  icon={<SettingOutlined />}
                  onClick={() => openConfigModal('运维小组')}
                >
                  配置运维小组
                </Button>
                <Button
                  type="primary"
                  icon={<SettingOutlined />}
                  onClick={() => openConfigModal('运维方案')}
                >
                  配置运维方案
                </Button>
                <Button
                  type="primary"
                  icon={<SettingOutlined />}
                  onClick={() => openConfigModal('运维计划')}
                >
                  配置运维计划
                </Button>
                <Button icon={<ExportOutlined />}>批量暂停运维</Button>
                <Button icon={<ExportOutlined />}>批量恢复运维</Button>
                <Button icon={<FileTextOutlined />}>批量设置非强制生成任务</Button>
                <Button icon={<FileTextOutlined />}>批量设置强制生成任务</Button>
                <Button
                  type="link"
                  icon={<ExportOutlined />}
                  onClick={() => message.info('导出站点信息功能开发中')}
                >
                  导出站点信息
                </Button>
              </Space>
            </div>

            {/* 站点表格 */}
            <Table
              columns={columns}
              dataSource={sites}
              rowKey="id"
              loading={loading}
              rowSelection={rowSelection}
              size="small"
              scroll={{ x: 1800 }}
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条`,
              }}
            />
          </TabPane>
          <TabPane tab="运维计划" key="plan" />
          <TabPane tab="绩效分析" key="performance" />
          <TabPane tab="成本分析" key="cost" />
          <TabPane tab="运维任务" key="task" />
        </Tabs>
      </Card>

      {/* 配置弹窗 */}
      <Modal
        title={getConfigModalTitle()}
        open={configModalVisible}
        onCancel={() => setConfigModalVisible(false)}
        onOk={handleConfigSubmit}
        width={800}
        okText="配置"
        cancelText="关闭"
      >
        <div style={{ marginBottom: 16 }}>
          <span>配置站点数量: {selectedSiteIds.length}个</span>
        </div>

        {/* 配置运维小组 */}
        {configStep === 'department' && (
          <div>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <Input placeholder="请输入运维小组" />
              </Col>
              <Col span={12}>
                <Button type="primary" icon={<SearchOutlined />}>
                  查询
                </Button>
              </Col>
            </Row>
            <Table
              columns={[
                {
                  title: '单选',
                  width: 80,
                  render: (_, record: Department) => (
                    <Radio
                      checked={selectedDepartmentId === record.id}
                      onChange={() => setSelectedDepartmentId(record.id)}
                    />
                  ),
                },
                { title: '序号', width: 80, render: (_, __, index) => index + 1 },
                { title: '运维小组', dataIndex: 'name' },
                { title: '隶属部门', render: () => '运维部' },
              ]}
              dataSource={departments}
              rowKey="id"
              pagination={{
                pageSize: 20,
                showTotal: (total) => `共 ${total} 条`,
              }}
              size="small"
            />
          </div>
        )}

        {/* 配置运维方案 */}
        {configStep === 'scheme' && (
          <div>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <Input
                  placeholder="请输入方案名称"
                  value={searchSchemeName}
                  onChange={(e) => setSearchSchemeName(e.target.value)}
                />
              </Col>
              <Col span={12}>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={() => loadSchemes(searchSchemeName)}
                >
                  查询
                </Button>
              </Col>
            </Row>
            <Table
              columns={[
                {
                  title: '单选',
                  width: 80,
                  render: (_, record: Scheme) => (
                    <Radio
                      checked={selectedSchemeId === record.id}
                      onChange={() => setSelectedSchemeId(record.id)}
                    />
                  ),
                },
                { title: '序号', width: 80, render: (_, __, index) => index + 1 },
                { title: '方案名称', dataIndex: 'name' },
                { title: '任务项数', render: () => '-' },
                { title: '状态', render: () => <Tag color="success">启用</Tag> },
              ]}
              dataSource={schemes}
              rowKey="id"
              pagination={{
                pageSize: 20,
                showTotal: (total) => `共 ${total} 条`,
              }}
              size="small"
            />
          </div>
        )}

        {/* 配置运维计划 */}
        {configStep === 'period' && (
          <div>
            <Tabs activeKey={periodType} onChange={(key) => setPeriodType(key as any)}>
              <TabPane tab="周计划" key="WEEK">
                {renderPeriodContent()}
              </TabPane>
              <TabPane tab="月计划" key="MONTH">
                {renderPeriodContent()}
              </TabPane>
              <TabPane tab="间隔周期计划" key="INTERVAL">
                {renderPeriodContent()}
              </TabPane>
            </Tabs>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default SiteConfiguration
