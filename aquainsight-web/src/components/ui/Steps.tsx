import React from 'react'
import { CheckIcon } from '@heroicons/react/24/solid'
import { cn } from '@/utils/cn'

export interface Step {
  title: string
  description?: string
  icon?: React.ReactNode
}

export interface StepsProps {
  current?: number
  items: Step[]
  direction?: 'horizontal' | 'vertical'
  status?: 'wait' | 'process' | 'finish' | 'error'
  size?: 'small' | 'default'
  className?: string
}

const Steps: React.FC<StepsProps> = ({
  current = 0,
  items,
  direction = 'horizontal',
  status = 'process',
  size = 'default',
  className,
}) => {
  const getStepStatus = (index: number) => {
    if (index < current) return 'finish'
    if (index === current) return status
    return 'wait'
  }

  const getStepColor = (stepStatus: string) => {
    switch (stepStatus) {
      case 'finish':
        return 'bg-ocean-teal border-ocean-teal text-white'
      case 'process':
        return 'bg-ocean-teal border-ocean-teal text-white'
      case 'error':
        return 'bg-red-500 border-red-500 text-white'
      default:
        return 'bg-white border-gray-300 text-gray-500'
    }
  }

  const getLineColor = (index: number) => {
    if (index < current) return 'bg-ocean-teal'
    return 'bg-gray-300'
  }

  const isHorizontal = direction === 'horizontal'
  const isSmall = size === 'small'

  return (
    <div
      className={cn(
        'flex',
        isHorizontal ? 'flex-row items-start' : 'flex-col',
        className
      )}
    >
      {items.map((item, index) => {
        const stepStatus = getStepStatus(index)
        const isLast = index === items.length - 1

        return (
          <div
            key={index}
            className={cn(
              'flex',
              isHorizontal ? 'flex-1 items-start' : 'items-start gap-4'
            )}
          >
            {/* Step Container */}
            <div className={cn('flex', isHorizontal ? 'flex-col items-center flex-1' : 'flex-row items-start')}>
              {/* Icon and Line Container */}
              <div className={cn('flex', isHorizontal ? 'flex-col items-center w-full' : 'flex-col items-center')}>
                {/* Icon */}
                <div
                  className={cn(
                    'flex items-center justify-center rounded-full border-2 transition-colors',
                    isSmall ? 'w-8 h-8' : 'w-10 h-10',
                    getStepColor(stepStatus)
                  )}
                >
                  {stepStatus === 'finish' ? (
                    <CheckIcon className={cn(isSmall ? 'w-4 h-4' : 'w-5 h-5')} />
                  ) : item.icon ? (
                    <div className={cn(isSmall ? 'w-4 h-4' : 'w-5 h-5')}>{item.icon}</div>
                  ) : (
                    <span className={cn('font-semibold', isSmall ? 'text-sm' : 'text-base')}>
                      {index + 1}
                    </span>
                  )}
                </div>

                {/* Line */}
                {!isLast && (
                  <div
                    className={cn(
                      'transition-colors',
                      isHorizontal
                        ? 'w-full h-0.5 my-5'
                        : 'w-0.5 h-12 mx-4',
                      getLineColor(index)
                    )}
                  />
                )}
              </div>

              {/* Content */}
              <div
                className={cn(
                  'flex flex-col',
                  isHorizontal ? 'items-center text-center mt-2 px-2' : 'ml-4 flex-1'
                )}
              >
                <h4
                  className={cn(
                    'font-medium transition-colors',
                    isSmall ? 'text-sm' : 'text-base',
                    stepStatus === 'finish' || stepStatus === 'process'
                      ? 'text-gray-900'
                      : 'text-gray-500'
                  )}
                >
                  {item.title}
                </h4>
                {item.description && (
                  <p
                    className={cn(
                      'mt-1 text-gray-500',
                      isSmall ? 'text-xs' : 'text-sm'
                    )}
                  >
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

Steps.displayName = 'Steps'

export default Steps
