import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, RefreshCw, CheckCircle, X, Clock, AlertCircle } from 'lucide-react'
import { cn } from '@/utils/cn'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { Table, Pagination } from '@/components/ui/Table'
import {
  alertRecordApi,
  AlertRecordVO,
  AlertStatisticsVO,
  AlertLevel,
  AlertStatus,
  AlertTargetType,
  alertLevelMap,
  alertStatusMap,
  alertTargetTypeMap,
} from '@/services/alert'

export default function AlertRecords() {
  const [loading, setLoading] = useState(false)
  const [records, setRecords] = useState<AlertRecordVO[]>([])
  const [statistics, setStatistics] = useState<AlertStatisticsVO | null>(null)
  const [ignoreModalOpen, setIgnoreModalOpen] = useState(false)
  const [ignoreReason, setIgnoreReason] = useState('')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [processingId, setProcessingId] = useState<number | null>(null)

  // 筛选条件
  const [statusFilter, setStatusFilter] = useState<AlertStatus | ''>('')
  const [levelFilter, setLevelFilter] = useState<AlertLevel | ''>('')
  const [targetTypeFilter, setTargetTypeFilter] = useState<AlertTargetType | ''>('')
  const [searchKeyword, setSearchKeyword] = useState('')

  // 分页
  const [pageNum, setPageNum] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)

  // 加载告警记录
  const loadRecords = async () => {
    setLoading(true)
    try {
      const result = await alertRecordApi.getRecords({
        pageNum,
        pageSize,
        status: statusFilter || undefined,
        alertLevel: levelFilter || undefined,
        targetType: targetTypeFilter || undefined,
      })
      setRecords(result.list || [])
      setTotal(result.total || 0)
    } catch (error) {
      console.error('加载告警记录失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 加载统计数据
  const loadStatistics = async () => {
    try {
      const result = await alertRecordApi.getStatistics()
      setStatistics(result)
    } catch (error) {
      console.error('加载统计数据失败:', error)
    }
  }

  useEffect(() => {
    loadRecords()
    loadStatistics()
  }, [pageNum, pageSize, statusFilter, levelFilter, targetTypeFilter])

  // 认领告警
  const handleClaim = async (id: number) => {
    setProcessingId(id)
    try {
      await alertRecordApi.claimRecord(id)
      loadRecords()
      loadStatistics()
    } catch (error) {
      console.error('认领告警失败:', error)
    } finally {
      setProcessingId(null)
    }
  }

  // 开始处理
  const handleStartProcess = async (id: number) => {
    setProcessingId(id)
    try {
      await alertRecordApi.startProcess(id)
      loadRecords()
      loadStatistics()
    } catch (error) {
      console.error('开始处理失败:', error)
    } finally {
      setProcessingId(null)
    }
  }

  // 忽略告警
  const handleIgnore = async () => {
    if (!selectedId || !ignoreReason.trim()) return
    setProcessingId(selectedId)
    try {
      await alertRecordApi.ignoreRecord(selectedId, ignoreReason)
      setIgnoreModalOpen(false)
      setIgnoreReason('')
      setSelectedId(null)
      loadRecords()
      loadStatistics()
    } catch (error) {
      console.error('忽略告警失败:', error)
    } finally {
      setProcessingId(null)
    }
  }

  // 格式化时间
  const formatTime = (time: string) => {
    if (!time) return '-'
    return new Date(time).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // 过滤记录
  const filteredRecords = records.filter((record) => {
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase()
      return (
        record.alertMessage.toLowerCase().includes(keyword) ||
        record.targetName.toLowerCase().includes(keyword)
      )
    }
    return true
  })

  // 表格列定义
  const columns = [
    {
      key: 'alertLevel',
      title: '级别',
      width: 80,
      render: (value: AlertLevel) => (
        <span
          className={cn(
            'px-2 py-1 text-xs rounded-full',
            alertLevelMap[value]?.bgColor,
            alertLevelMap[value]?.color
          )}
        >
          {alertLevelMap[value]?.label || value}
        </span>
      ),
    },
    {
      key: 'alertMessage',
      title: '告警信息',
      width: 280,
      render: (value: string, record: AlertRecordVO) => (
        <div className="max-w-[260px]">
          <p className="font-medium text-clean-900 truncate" title={value}>{value}</p>
          <p className="text-xs text-clean-500 mt-0.5 truncate" title={`${alertTargetTypeMap[record.targetType]}: ${record.targetName}`}>
            {alertTargetTypeMap[record.targetType]}: {record.targetName}
          </p>
        </div>
      ),
    },
    {
      key: 'status',
      title: '状态',
      width: 100,
      render: (value: AlertStatus) => {
        const statusInfo = alertStatusMap[value]
        const icon =
          value === 'RECOVERED' ? (
            <CheckCircle className="w-3.5 h-3.5" />
          ) : value === 'IGNORED' ? (
            <X className="w-3.5 h-3.5" />
          ) : value === 'IN_PROGRESS' ? (
            <Clock className="w-3.5 h-3.5" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5" />
          )
        return (
          <span
            className={cn(
              'inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full',
              statusInfo?.bgColor,
              statusInfo?.color
            )}
          >
            {icon}
            {statusInfo?.label || value}
          </span>
        )
      },
    },
    {
      key: 'handler',
      title: '处理人',
      width: 100,
      render: (value: string) => value || '-',
    },
    {
      key: 'createTime',
      title: '告警时间',
      width: 160,
      render: (value: string) => formatTime(value),
    },
    {
      key: 'id',
      title: '操作',
      width: 200,
      render: (_: number, record: AlertRecordVO) => (
        <div className="flex items-center gap-2">
          {record.status === 'PENDING' && (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleClaim(record.id)}
                loading={processingId === record.id}
              >
                认领
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSelectedId(record.id)
                  setIgnoreModalOpen(true)
                }}
              >
                忽略
              </Button>
            </>
          )}
          {record.status === 'IN_PROGRESS' && (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleStartProcess(record.id)}
                loading={processingId === record.id}
              >
                已处理
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSelectedId(record.id)
                  setIgnoreModalOpen(true)
                }}
              >
                忽略
              </Button>
            </>
          )}
          {(record.status === 'RECOVERED' || record.status === 'IGNORED') && (
            <span className="text-clean-400 text-sm">-</span>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: '未认领',
            value: statistics?.pendingCount ?? 0,
            color: 'text-red-600',
            bgColor: 'bg-red-50 border-red-100',
          },
          {
            label: '处理中',
            value: statistics?.inProgressCount ?? 0,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50 border-blue-100',
          },
          {
            label: '紧急告警',
            value: statistics?.urgentCount ?? 0,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50 border-orange-100',
          },
          {
            label: '今日处理',
            value: statistics?.todayHandledCount ?? 0,
            color: 'text-green-600',
            bgColor: 'bg-green-50 border-green-100',
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn('rounded-xl p-4 text-center border', stat.bgColor)}
          >
            <p className={cn('text-3xl font-semibold', stat.color)}>{stat.value}</p>
            <p className="text-clean-600 text-sm mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-clean-400" />
          <input
            type="text"
            placeholder="搜索告警信息..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-clean-300 rounded-xl focus:outline-none focus:border-nature-400 focus:ring-2 focus:ring-nature-100"
          />
        </div>
        <div className="w-32">
          <Select
            placeholder="状态"
            value={statusFilter}
            onChange={(v) => {
              setStatusFilter(v as AlertStatus | '')
              setPageNum(1)
            }}
            options={[
              { value: '', label: '全部状态' },
              { value: 'PENDING', label: '未认领' },
              { value: 'IN_PROGRESS', label: '处理中' },
              { value: 'RECOVERED', label: '已恢复' },
              { value: 'IGNORED', label: '已忽略' },
            ]}
          />
        </div>
        <div className="w-32">
          <Select
            placeholder="级别"
            value={levelFilter}
            onChange={(v) => {
              setLevelFilter(v as AlertLevel | '')
              setPageNum(1)
            }}
            options={[
              { value: '', label: '全部级别' },
              { value: 'URGENT', label: '紧急' },
              { value: 'IMPORTANT', label: '重要' },
              { value: 'NORMAL', label: '一般' },
              { value: 'INFO', label: '提示' },
            ]}
          />
        </div>
        <div className="w-32">
          <Select
            placeholder="类型"
            value={targetTypeFilter}
            onChange={(v) => {
              setTargetTypeFilter(v as AlertTargetType | '')
              setPageNum(1)
            }}
            options={[
              { value: '', label: '全部类型' },
              { value: 'site', label: '站点' },
              { value: 'device', label: '设备' },
              { value: 'task', label: '任务' },
            ]}
          />
        </div>
        <Button
          variant="secondary"
          icon={<RefreshCw className="w-4 h-4" />}
          onClick={() => {
            loadRecords()
            loadStatistics()
          }}
          loading={loading}
        >
          刷新
        </Button>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-clean-200 overflow-hidden"
      >
        <Table columns={columns} data={filteredRecords} loading={loading} />
      </motion.div>

      {/* Pagination */}
      {total > 0 && (
        <div className="bg-white rounded-xl border border-clean-200 px-4">
          <Pagination
            current={pageNum}
            total={total}
            pageSize={pageSize}
            onChange={setPageNum}
            onPageSizeChange={(size) => {
              setPageSize(size)
              setPageNum(1)
            }}
          />
        </div>
      )}

      {/* Ignore Modal */}
      <Modal
        open={ignoreModalOpen}
        onClose={() => {
          setIgnoreModalOpen(false)
          setIgnoreReason('')
        }}
        title="忽略告警"
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setIgnoreModalOpen(false)
                setIgnoreReason('')
              }}
            >
              取消
            </Button>
            <Button
              onClick={handleIgnore}
              loading={processingId === selectedId}
              disabled={!ignoreReason.trim()}
            >
              确认忽略
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-clean-600 text-sm">请输入忽略原因：</p>
          <textarea
            value={ignoreReason}
            onChange={(e) => setIgnoreReason(e.target.value)}
            placeholder="请输入忽略原因..."
            className="w-full px-4 py-3 border border-clean-300 rounded-xl focus:outline-none focus:border-nature-400 focus:ring-2 focus:ring-nature-100 resize-none"
            rows={3}
          />
        </div>
      </Modal>
    </div>
  )
}
