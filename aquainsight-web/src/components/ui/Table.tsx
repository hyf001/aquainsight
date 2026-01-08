import React from 'react'
import { cn } from '@/utils/cn'
import Spin from './Spin'
import Empty from './Empty'
import Checkbox from './Checkbox'

export interface TableColumn<T = any> {
  /** 列标题 */
  title: React.ReactNode
  /** 数据字段名 */
  dataIndex?: string
  /** 列键 */
  key?: string
  /** 自定义渲染 */
  render?: (value: any, record: T, index: number) => React.ReactNode
  /** 列宽度 */
  width?: string | number
  /** 列对齐方式 */
  align?: 'left' | 'center' | 'right'
  /** 是否固定列 */
  fixed?: 'left' | 'right'
  /** 自定义类名 */
  className?: string
}

export interface TableProps<T = any> {
  /** 列定义 */
  columns: TableColumn<T>[]
  /** 数据源 */
  dataSource?: T[]
  /** 行键 */
  rowKey?: string | ((record: T) => string)
  /** 加载状态 */
  loading?: boolean
  /** 是否显示边框 */
  bordered?: boolean
  /** 表格大小 */
  size?: 'small' | 'middle' | 'large'
  /** 是否支持行选择 */
  rowSelection?: {
    selectedRowKeys?: React.Key[]
    onChange?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void
  }
  /** 自定义类名 */
  className?: string
  /** 行点击事件 */
  onRow?: (record: T, index: number) => {
    onClick?: (e: React.MouseEvent) => void
  }
}

function Table<T extends Record<string, any> = any>({
  columns,
  dataSource = [],
  rowKey = 'id',
  loading = false,
  bordered = false,
  size = 'middle',
  rowSelection,
  className,
  onRow,
}: TableProps<T>) {
  const [selectedKeys, setSelectedKeys] = React.useState<React.Key[]>(
    rowSelection?.selectedRowKeys || []
  )

  React.useEffect(() => {
    if (rowSelection?.selectedRowKeys) {
      setSelectedKeys(rowSelection.selectedRowKeys)
    }
  }, [rowSelection?.selectedRowKeys])

  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record)
    }
    return record[rowKey] ?? index.toString()
  }

  const handleSelectAll = (checked: boolean) => {
    const keys = checked ? dataSource.map((record, index) => getRowKey(record, index)) : []
    setSelectedKeys(keys)
    rowSelection?.onChange?.(keys, checked ? dataSource : [])
  }

  const handleSelectRow = (record: T, index: number, checked: boolean) => {
    const key = getRowKey(record, index)
    const keys = checked
      ? [...selectedKeys, key]
      : selectedKeys.filter((k) => k !== key)
    setSelectedKeys(keys)
    const selectedRows = dataSource.filter((r, i) => keys.includes(getRowKey(r, i)))
    rowSelection?.onChange?.(keys, selectedRows)
  }

  const allSelected = dataSource.length > 0 && selectedKeys.length === dataSource.length
  const someSelected = selectedKeys.length > 0 && selectedKeys.length < dataSource.length

  const sizeClasses = {
    small: 'text-xs',
    middle: 'text-sm',
    large: 'text-base',
  }

  const paddingClasses = {
    small: 'px-2 py-1',
    middle: 'px-4 py-2',
    large: 'px-6 py-3',
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spin />
      </div>
    )
  }

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className={cn('w-full', sizeClasses[size])}>
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {rowSelection && (
              <th className={cn('border-gray-200', paddingClasses[size], bordered && 'border')}>
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
            )}
            {columns.map((column, index) => (
              <th
                key={column.key || column.dataIndex || index}
                className={cn(
                  'font-semibold text-gray-700 border-gray-200',
                  paddingClasses[size],
                  column.align === 'center' && 'text-center',
                  column.align === 'right' && 'text-right',
                  bordered && 'border',
                  column.className
                )}
                style={{ width: column.width }}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {dataSource.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (rowSelection ? 1 : 0)} className="py-8">
                <Empty />
              </td>
            </tr>
          ) : (
            dataSource.map((record, rowIndex) => {
              const key = getRowKey(record, rowIndex)
              const isSelected = selectedKeys.includes(key)
              const rowProps = onRow?.(record, rowIndex)

              return (
                <tr
                  key={key}
                  className={cn(
                    'hover:bg-gray-50 transition-colors',
                    isSelected && 'bg-blue-50',
                    rowProps?.onClick && 'cursor-pointer'
                  )}
                  onClick={rowProps?.onClick}
                >
                  {rowSelection && (
                    <td
                      className={cn('border-gray-200', paddingClasses[size], bordered && 'border')}
                    >
                      <Checkbox
                        checked={isSelected}
                        onChange={(e) => handleSelectRow(record, rowIndex, e.target.checked)}
                      />
                    </td>
                  )}
                  {columns.map((column, colIndex) => {
                    const value = column.dataIndex ? record[column.dataIndex] : undefined
                    const content = column.render
                      ? column.render(value, record, rowIndex)
                      : value

                    return (
                      <td
                        key={column.key || column.dataIndex || colIndex}
                        className={cn(
                          'text-gray-900 border-gray-200',
                          paddingClasses[size],
                          column.align === 'center' && 'text-center',
                          column.align === 'right' && 'text-right',
                          bordered && 'border',
                          column.className
                        )}
                      >
                        {content}
                      </td>
                    )
                  })}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}

Table.displayName = 'Table'

export default Table
