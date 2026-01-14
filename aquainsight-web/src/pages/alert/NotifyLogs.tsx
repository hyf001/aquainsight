import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, RefreshCw, Mail, Smartphone, Bell, MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react'
import { cn } from '@/utils/cn'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Table, Pagination } from '@/components/ui/Table'
import {
  alertNotifyLogApi,
  AlertNotifyLogVO,
  NotifyType,
  NotifyStatus,
  notifyTypeMap,
} from '@/services/alert'

// 通知状态映射
const notifyStatusMap: Record<NotifyStatus, { label: string; color: string; bgColor: string }> = {
  PENDING: { label: '待发送', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  SUCCESS: { label: '已发送', color: 'text-green-600', bgColor: 'bg-green-100' },
  FAILED: { label: '发送失败', color: 'text-red-600', bgColor: 'bg-red-100' },
}

export default function NotifyLogs() {
  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState<AlertNotifyLogVO[]>([])

  // 筛选条件
  const [statusFilter, setStatusFilter] = useState<NotifyStatus | ''>('')
  const [typeFilter, setTypeFilter] = useState<NotifyType | ''>('')
  const [searchKeyword, setSearchKeyword] = useState('')

  // 分页
  const [pageNum, setPageNum] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)

  // 加载通知日志
  const loadLogs = async () => {
    setLoading(true)
    try {
      const result = await alertNotifyLogApi.getNotifyLogs({
        pageNum,
        pageSize,
        notifyStatus: statusFilter || undefined,
        notifyType: typeFilter || undefined,
      })
      setLogs(result.list || [])
      setTotal(result.total || 0)
    } catch (error) {
      console.error('加载通知日志失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLogs()
  }, [pageNum, pageSize, statusFilter, typeFilter])

  // 格式化时间
  const formatTime = (time: string) => {
    if (!time) return '-'
    return new Date(time).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  // 获取通知类型图标
  const getNotifyIcon = (type: NotifyType) => {
    switch (type) {
      case 'sms':
        return <Smartphone className="w-4 h-4" />
      case 'email':
        return <Mail className="w-4 h-4" />
      case 'push':
        return <Bell className="w-4 h-4" />
      case 'wechat':
        return <MessageSquare className="w-4 h-4" />
    }
  }

  // 获取状态图标
  const getStatusIcon = (status: NotifyStatus) => {
    switch (status) {
      case 'SUCCESS':
        return <CheckCircle className="w-3.5 h-3.5" />
      case 'FAILED':
        return <XCircle className="w-3.5 h-3.5" />
      case 'PENDING':
        return <Clock className="w-3.5 h-3.5" />
    }
  }

  // 过滤日志
  const filteredLogs = logs.filter((log) => {
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase()
      return (
        log.notifyTarget.toLowerCase().includes(keyword) ||
        log.notifyContent.toLowerCase().includes(keyword)
      )
    }
    return true
  })

  // 表格列定义
  const columns = [
    {
      key: 'notifyType',
      title: '通知方式',
      width: 120,
      render: (value: NotifyType) => (
        <span className="inline-flex items-center gap-2 text-clean-700">
          {getNotifyIcon(value)}
          {notifyTypeMap[value]}
        </span>
      ),
    },
    {
      key: 'notifyTarget',
      title: '接收目标',
      width: 180,
      render: (value: string) => (
        <span className="text-clean-800 font-medium">{value}</span>
      ),
    },
    {
      key: 'notifyContent',
      title: '通知内容',
      render: (value: string) => (
        <p className="text-clean-600 line-clamp-2 text-sm">{value}</p>
      ),
    },
    {
      key: 'notifyStatus',
      title: '状态',
      width: 120,
      render: (value: NotifyStatus) => {
        const statusInfo = notifyStatusMap[value]
        return (
          <span
            className={cn(
              'inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full',
              statusInfo?.bgColor,
              statusInfo?.color
            )}
          >
            {getStatusIcon(value)}
            {statusInfo?.label || value}
          </span>
        )
      },
    },
    {
      key: 'retryCount',
      title: '重试次数',
      width: 100,
      align: 'center' as const,
      render: (value: number) => (
        <span className={cn('text-sm', value > 0 ? 'text-orange-600' : 'text-clean-500')}>
          {value}
        </span>
      ),
    },
    {
      key: 'errorMessage',
      title: '错误信息',
      width: 200,
      render: (value: string) =>
        value ? (
          <p className="text-red-500 text-sm line-clamp-1" title={value}>
            {value}
          </p>
        ) : (
          <span className="text-clean-400">-</span>
        ),
    },
    {
      key: 'createTime',
      title: '发送时间',
      width: 180,
      render: (value: string) => (
        <span className="text-clean-500 text-sm">{formatTime(value)}</span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-clean-400" />
          <input
            type="text"
            placeholder="搜索接收目标或内容..."
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
              setStatusFilter(v as NotifyStatus | '')
              setPageNum(1)
            }}
            options={[
              { value: '', label: '全部状态' },
              { value: 'PENDING', label: '待发送' },
              { value: 'SUCCESS', label: '已发送' },
              { value: 'FAILED', label: '发送失败' },
            ]}
          />
        </div>
        <div className="w-32">
          <Select
            placeholder="通知方式"
            value={typeFilter}
            onChange={(v) => {
              setTypeFilter(v as NotifyType | '')
              setPageNum(1)
            }}
            options={[
              { value: '', label: '全部方式' },
              { value: 'sms', label: '短信' },
              { value: 'email', label: '邮件' },
              { value: 'push', label: '推送' },
              { value: 'wechat', label: '微信' },
            ]}
          />
        </div>
        <Button
          variant="secondary"
          icon={<RefreshCw className="w-4 h-4" />}
          onClick={loadLogs}
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
        <Table columns={columns} data={filteredLogs} loading={loading} />
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
    </div>
  )
}
