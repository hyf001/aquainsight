import React from 'react'
import { cn } from '@/utils/cn'

export interface EmptyProps {
  description?: React.ReactNode
  image?: React.ReactNode
  className?: string
}

const Empty: React.FC<EmptyProps> = ({ description = '暂无数据', image, className }) => {
  return (
    <div className={cn('flex flex-col items-center justify-center py-8 px-4', className)}>
      {image || (
        <svg
          className="w-16 h-16 text-gray-300 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      )}
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  )
}

export default Empty
