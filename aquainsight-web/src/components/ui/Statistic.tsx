import React from 'react'
import { cn } from '@/utils/cn'

export interface StatisticProps {
  /** 标题 */
  title?: React.ReactNode
  /** 数值 */
  value?: string | number
  /** 前缀 */
  prefix?: React.ReactNode
  /** 后缀 */
  suffix?: React.ReactNode
  /** 精度（小数位数） */
  precision?: number
  /** 自定义数值样式 */
  valueStyle?: React.CSSProperties
  /** 自定义类名 */
  className?: string
  /** 数值渲染函数 */
  formatter?: (value?: string | number) => React.ReactNode
  /** 加载状态 */
  loading?: boolean
}

const Statistic: React.FC<StatisticProps> = ({
  title,
  value,
  prefix,
  suffix,
  precision,
  valueStyle,
  className,
  formatter,
  loading = false,
}) => {
  const formatValue = (val?: string | number): React.ReactNode => {
    if (val === undefined || val === null) return '-'

    if (formatter) {
      return formatter(val)
    }

    if (typeof val === 'number' && precision !== undefined) {
      return val.toFixed(precision)
    }

    return val
  }

  return (
    <div className={cn('flex flex-col', className)}>
      {title && (
        <div className="text-sm text-gray-500 mb-1">
          {title}
        </div>
      )}
      <div
        className={cn(
          'text-2xl font-semibold text-gray-900',
          loading && 'animate-pulse text-gray-400'
        )}
        style={valueStyle}
      >
        {prefix && <span className="mr-1">{prefix}</span>}
        {loading ? (
          <span className="inline-block w-20 h-8 bg-gray-200 rounded"></span>
        ) : (
          <span>{formatValue(value)}</span>
        )}
        {suffix && <span className="ml-1">{suffix}</span>}
      </div>
    </div>
  )
}

Statistic.displayName = 'Statistic'

export default Statistic
