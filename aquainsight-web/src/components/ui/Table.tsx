import { cn } from '@/utils/cn'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'

interface Column<T> {
  key: string
  title: string
  width?: string | number
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  render?: (value: any, record: T, index: number) => React.ReactNode
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  rowKey?: string | ((record: T) => string)
  loading?: boolean
  emptyText?: string
  striped?: boolean
  hoverable?: boolean
  bordered?: boolean
  compact?: boolean
  sortColumn?: string
  sortDirection?: 'asc' | 'desc'
  onSort?: (column: string, direction: 'asc' | 'desc') => void
  onRowClick?: (record: T, index: number) => void
  className?: string
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  rowKey = 'id',
  loading = false,
  emptyText = '暂无数据',
  striped = false,
  hoverable = true,
  bordered = false,
  compact = false,
  sortColumn,
  sortDirection,
  onSort,
  onRowClick,
  className,
}: TableProps<T>) {
  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record)
    }
    return record[rowKey] ?? index.toString()
  }

  const handleSort = (column: Column<T>) => {
    if (!column.sortable || !onSort) return

    const newDirection: 'asc' | 'desc' =
      sortColumn === column.key && sortDirection === 'asc' ? 'desc' : 'asc'
    onSort(column.key, newDirection)
  }

  const alignStyles = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  const cellPadding = compact ? 'px-4 py-2' : 'px-6 py-4'

  return (
    <div className={cn('w-full overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={cn(
              'bg-clean-50 border-b border-clean-200',
              bordered && 'border-t'
            )}>
              {columns.map((column) => (
                <th
                  key={column.key}
                  style={{ width: column.width }}
                  className={cn(
                    cellPadding,
                    'text-sm font-semibold text-clean-700',
                    alignStyles[column.align || 'left'],
                    column.sortable && 'cursor-pointer select-none hover:bg-clean-100 transition-colors',
                    bordered && 'border-x border-clean-200 first:border-l-0 last:border-r-0'
                  )}
                  onClick={() => handleSort(column)}
                >
                  <div className={cn(
                    'flex items-center gap-2',
                    column.align === 'center' && 'justify-center',
                    column.align === 'right' && 'justify-end'
                  )}>
                    <span>{column.title}</span>
                    {column.sortable && (
                      <span className="flex flex-col">
                        {sortColumn === column.key ? (
                          sortDirection === 'asc' ? (
                            <ChevronUp className="w-4 h-4 text-nature-600" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-nature-600" />
                          )
                        ) : (
                          <ChevronsUpDown className="w-4 h-4 text-clean-400" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-clean-100">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className={cn(cellPadding, 'text-center')}>
                  <div className="flex items-center justify-center gap-3 py-8">
                    <div className="w-5 h-5 border-2 border-nature-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-clean-500">加载中...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className={cn(cellPadding, 'text-center')}>
                  <div className="py-12 text-clean-400">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-clean-100 flex items-center justify-center">
                      <svg className="w-8 h-8 text-clean-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <p>{emptyText}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((record, index) => (
                <tr
                  key={getRowKey(record, index)}
                  className={cn(
                    'transition-colors duration-150',
                    striped && index % 2 === 1 && 'bg-clean-50/50',
                    hoverable && 'hover:bg-nature-50/50',
                    onRowClick && 'cursor-pointer',
                    bordered && 'border-b border-clean-200 last:border-b-0'
                  )}
                  onClick={() => onRowClick?.(record, index)}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        cellPadding,
                        'text-sm text-clean-800',
                        alignStyles[column.align || 'left'],
                        bordered && 'border-x border-clean-200 first:border-l-0 last:border-r-0'
                      )}
                    >
                      {column.render
                        ? column.render(record[column.key], record, index)
                        : record[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// 分页组件
interface PaginationProps {
  current: number
  total: number
  pageSize: number
  onChange: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  showTotal?: boolean
  showPageSize?: boolean
  pageSizeOptions?: number[]
  className?: string
}

export function Pagination({
  current,
  total,
  pageSize,
  onChange,
  onPageSizeChange,
  showTotal = true,
  showPageSize = true,
  pageSizeOptions = [10, 20, 50, 100],
  className,
}: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize)

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const showPages = 5

    if (totalPages <= showPages + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      if (current > 3) {
        pages.push('...')
      }

      const start = Math.max(2, current - 1)
      const end = Math.min(totalPages - 1, current + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (current < totalPages - 2) {
        pages.push('...')
      }

      pages.push(totalPages)
    }

    return pages
  }

  if (total === 0) return null

  return (
    <div className={cn(
      'flex flex-wrap items-center justify-between gap-4 py-4',
      className
    )}>
      <div className="flex items-center gap-4 text-sm text-clean-600">
        {showTotal && (
          <span>共 <span className="font-medium text-clean-800">{total}</span> 条</span>
        )}
        {showPageSize && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span>每页</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="px-2 py-1 border border-clean-300 rounded-lg text-sm focus:outline-none focus:border-nature-400 focus:ring-1 focus:ring-nature-100"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <span>条</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(current - 1)}
          disabled={current === 1}
          className={cn(
            'px-3 py-1.5 rounded-lg text-sm transition-colors',
            current === 1
              ? 'text-clean-300 cursor-not-allowed'
              : 'text-clean-600 hover:bg-clean-100'
          )}
        >
          上一页
        </button>

        {getPageNumbers().map((page, index) => (
          typeof page === 'number' ? (
            <button
              key={page}
              onClick={() => onChange(page)}
              className={cn(
                'min-w-[36px] px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                current === page
                  ? 'bg-nature-500 text-white shadow-sm'
                  : 'text-clean-600 hover:bg-clean-100'
              )}
            >
              {page}
            </button>
          ) : (
            <span key={`ellipsis-${index}`} className="px-2 text-clean-400">
              {page}
            </span>
          )
        ))}

        <button
          onClick={() => onChange(current + 1)}
          disabled={current === totalPages}
          className={cn(
            'px-3 py-1.5 rounded-lg text-sm transition-colors',
            current === totalPages
              ? 'text-clean-300 cursor-not-allowed'
              : 'text-clean-600 hover:bg-clean-100'
          )}
        >
          下一页
        </button>
      </div>
    </div>
  )
}
