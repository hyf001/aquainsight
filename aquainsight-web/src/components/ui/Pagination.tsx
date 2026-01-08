import React from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { cn } from '@/utils/cn'

export interface PaginationProps {
  /** 当前页 */
  current?: number
  /** 每页条数 */
  pageSize?: number
  /** 数据总数 */
  total?: number
  /** 页码改变回调 */
  onChange?: (page: number, pageSize: number) => void
  /** 每页条数改变回调 */
  onShowSizeChange?: (current: number, size: number) => void
  /** 是否显示每页条数选择器 */
  showSizeChanger?: boolean
  /** 每页条数选项 */
  pageSizeOptions?: number[]
  /** 是否显示总数 */
  showTotal?: boolean | ((total: number, range: [number, number]) => React.ReactNode)
  /** 自定义类名 */
  className?: string
}

const Pagination: React.FC<PaginationProps> = ({
  current = 1,
  pageSize = 10,
  total = 0,
  onChange,
  onShowSizeChange,
  showSizeChanger = false,
  pageSizeOptions = [10, 20, 50, 100],
  showTotal,
  className,
}) => {
  const totalPages = Math.ceil(total / pageSize)

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === current) return
    onChange?.(page, pageSize)
  }

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(e.target.value)
    const newCurrent = Math.min(current, Math.ceil(total / newSize))
    onShowSizeChange?.(newCurrent, newSize)
    onChange?.(newCurrent, newSize)
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 7

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      if (current <= 3) {
        for (let i = 2; i <= 5; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (current >= totalPages - 2) {
        pages.push('...')
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push('...')
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
  }

  const start = (current - 1) * pageSize + 1
  const end = Math.min(current * pageSize, total)

  return (
    <div className={cn('flex items-center justify-between gap-4', className)}>
      {/* 总数显示 */}
      {showTotal && (
        <div className="text-sm text-gray-600">
          {typeof showTotal === 'function'
            ? showTotal(total, [start, end])
            : `共 ${total} 条`}
        </div>
      )}

      <div className="flex items-center gap-2">
        {/* 每页条数选择器 */}
        {showSizeChanger && (
          <select
            value={pageSize}
            onChange={handleSizeChange}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-teal focus:border-transparent"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size} 条/页
              </option>
            ))}
          </select>
        )}

        {/* 上一页 */}
        <button
          onClick={() => handlePageChange(current - 1)}
          disabled={current === 1}
          className={cn(
            'px-2 py-1.5 rounded-lg border border-gray-300 transition-colors',
            current === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:text-ocean-teal hover:border-ocean-teal'
          )}
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>

        {/* 页码 */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-3 py-1.5 text-sm text-gray-400">...</span>
              ) : (
                <button
                  onClick={() => handlePageChange(page as number)}
                  className={cn(
                    'min-w-[32px] px-3 py-1.5 text-sm rounded-lg border transition-colors',
                    page === current
                      ? 'bg-ocean-teal text-white border-ocean-teal'
                      : 'text-gray-700 border-gray-300 hover:text-ocean-teal hover:border-ocean-teal'
                  )}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* 下一页 */}
        <button
          onClick={() => handlePageChange(current + 1)}
          disabled={current === totalPages}
          className={cn(
            'px-2 py-1.5 rounded-lg border border-gray-300 transition-colors',
            current === totalPages
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:text-ocean-teal hover:border-ocean-teal'
          )}
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

Pagination.displayName = 'Pagination'

export default Pagination
