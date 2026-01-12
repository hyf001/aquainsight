import { cn } from '@/utils/cn'
import { motion } from 'framer-motion'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'white' | 'gray'
  className?: string
}

const sizeStyles = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-3',
  xl: 'w-12 h-12 border-4',
}

const colorStyles = {
  primary: 'border-nature-500 border-t-transparent',
  white: 'border-white border-t-transparent',
  gray: 'border-clean-300 border-t-transparent',
}

export function Spinner({ size = 'md', color = 'primary', className }: SpinnerProps) {
  return (
    <div
      className={cn(
        'rounded-full animate-spin',
        sizeStyles[size],
        colorStyles[color],
        className
      )}
    />
  )
}

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  fullScreen?: boolean
  overlay?: boolean
  className?: string
}

export function Loading({
  size = 'md',
  text,
  fullScreen = false,
  overlay = false,
  className,
}: LoadingProps) {
  const spinnerSizes = {
    sm: 'sm' as const,
    md: 'md' as const,
    lg: 'lg' as const,
  }

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  const content = (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <Spinner size={spinnerSizes[size]} />
      {text && (
        <p className={cn('text-clean-500', textSizes[size])}>{text}</p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        {content}
      </div>
    )
  }

  if (overlay) {
    return (
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {content}
      </div>
    )
  }

  return content
}

// 页面加载骨架屏
interface PageSkeletonProps {
  type?: 'list' | 'detail' | 'dashboard'
}

export function PageSkeleton({ type = 'list' }: PageSkeletonProps) {
  if (type === 'dashboard') {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-clean-200 rounded-lg" />
            <div className="h-4 w-64 bg-clean-100 rounded" />
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-32 bg-clean-200 rounded-xl" />
            <div className="h-10 w-32 bg-clean-200 rounded-xl" />
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-6 bg-white rounded-2xl border border-clean-200">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 bg-clean-100 rounded-xl" />
                <div className="h-5 w-12 bg-clean-100 rounded" />
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-8 w-20 bg-clean-200 rounded" />
                <div className="h-4 w-16 bg-clean-100 rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 bg-white rounded-2xl border border-clean-200">
            <div className="h-6 w-32 bg-clean-200 rounded mb-6" />
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="p-4 bg-clean-50 rounded-xl">
                  <div className="h-4 w-16 bg-clean-200 rounded mb-2" />
                  <div className="h-6 w-12 bg-clean-100 rounded" />
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-clean-200">
            <div className="h-6 w-24 bg-clean-200 rounded mb-6" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 bg-clean-50 rounded-xl">
                  <div className="h-4 w-full bg-clean-200 rounded mb-2" />
                  <div className="h-3 w-2/3 bg-clean-100 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (type === 'detail') {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 bg-clean-200 rounded" />
          <div className="h-8 w-64 bg-clean-200 rounded-lg" />
        </div>
        <div className="p-6 bg-white rounded-2xl border border-clean-200">
          <div className="space-y-4">
            <div className="h-6 w-32 bg-clean-200 rounded" />
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-20 bg-clean-100 rounded" />
                  <div className="h-10 w-full bg-clean-50 rounded-xl" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // List type (default)
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-clean-200 rounded-lg" />
          <div className="h-4 w-64 bg-clean-100 rounded" />
        </div>
        <div className="h-10 w-32 bg-clean-200 rounded-xl" />
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="h-10 w-48 bg-clean-100 rounded-xl" />
        <div className="h-10 w-32 bg-clean-100 rounded-xl" />
        <div className="h-10 w-32 bg-clean-100 rounded-xl" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-clean-200 overflow-hidden">
        <div className="p-4 border-b border-clean-100 flex gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-4 flex-1 bg-clean-200 rounded" />
          ))}
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-4 border-b border-clean-100 flex gap-4">
            {[1, 2, 3, 4, 5].map((j) => (
              <div key={j} className="h-4 flex-1 bg-clean-100 rounded" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// 进度条组件
interface ProgressProps {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'success' | 'warning' | 'error'
  showLabel?: boolean
  className?: string
}

export function Progress({
  value,
  max = 100,
  size = 'md',
  color = 'primary',
  showLabel = false,
  className,
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  const sizeStyles = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }

  const colorStyles = {
    primary: 'bg-nature-500',
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
  }

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('w-full bg-clean-200 rounded-full overflow-hidden', sizeStyles[size])}>
        <motion.div
          className={cn('h-full rounded-full', colorStyles[color])}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1 text-xs text-clean-500">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  )
}

// 步骤指示器
interface Step {
  title: string
  description?: string
}

interface StepsProps {
  steps: Step[]
  current: number
  className?: string
}

export function Steps({ steps, current, className }: StepsProps) {
  return (
    <div className={cn('flex items-center', className)}>
      {steps.map((step, index) => {
        const isCompleted = index < current
        const isCurrent = index === current
        const isLast = index === steps.length - 1

        return (
          <div key={index} className="flex items-center">
            <div className="flex flex-col items-center">
              <motion.div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                  isCompleted && 'bg-nature-500 text-white',
                  isCurrent && 'bg-nature-100 text-nature-600 ring-2 ring-nature-500',
                  !isCompleted && !isCurrent && 'bg-clean-200 text-clean-500'
                )}
                initial={false}
                animate={isCompleted ? { scale: [1, 1.1, 1] } : {}}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </motion.div>
              <div className="mt-2 text-center">
                <p className={cn(
                  'text-sm font-medium',
                  isCurrent ? 'text-nature-600' : 'text-clean-600'
                )}>
                  {step.title}
                </p>
                {step.description && (
                  <p className="text-xs text-clean-400 mt-0.5">{step.description}</p>
                )}
              </div>
            </div>
            {!isLast && (
              <div className={cn(
                'w-16 h-0.5 mx-2 -mt-6',
                isCompleted ? 'bg-nature-500' : 'bg-clean-200'
              )} />
            )}
          </div>
        )
      })}
    </div>
  )
}
