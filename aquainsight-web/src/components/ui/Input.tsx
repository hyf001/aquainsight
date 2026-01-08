import React, { useState } from 'react'
import { cn } from '@/utils/cn'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  prefix?: React.ReactNode
  suffix?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, prefix, suffix, disabled, ...props }, ref) => {
    const hasPrefix = !!prefix
    const hasSuffix = !!suffix

    const inputElement = (
      <input
        ref={ref}
        className={cn(
          'w-full px-4 py-2 text-base text-gray-900 bg-white border rounded-lg transition-base',
          'placeholder:text-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-ocean-teal focus:border-transparent',
          'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300',
          (hasPrefix || hasSuffix) && 'px-3',
          className
        )}
        disabled={disabled}
        {...props}
      />
    )

    if (!hasPrefix && !hasSuffix) {
      return inputElement
    }

    return (
      <div className="relative flex items-center">
        {prefix && (
          <div className="absolute left-3 flex items-center pointer-events-none text-gray-400">
            {prefix}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-2 text-base text-gray-900 bg-white border rounded-lg transition-base',
            'placeholder:text-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-ocean-teal focus:border-transparent',
            'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
            error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300',
            hasPrefix && 'pl-10',
            hasSuffix && 'pr-10',
            className
          )}
          disabled={disabled}
          {...props}
        />
        {suffix && (
          <div className="absolute right-3 flex items-center pointer-events-none text-gray-400">
            {suffix}
          </div>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, error, disabled, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'w-full px-4 py-2 text-base text-gray-900 bg-white border rounded-lg transition-base resize-none',
          'placeholder:text-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-ocean-teal focus:border-transparent',
          'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300',
          className
        )}
        disabled={disabled}
        {...props}
      />
    )
  }
)

TextArea.displayName = 'TextArea'

export interface PasswordProps extends Omit<InputProps, 'type'> {
  visibilityToggle?: boolean
}

export const Password = React.forwardRef<HTMLInputElement, PasswordProps>(
  ({ visibilityToggle = true, prefix, ...props }, ref) => {
    const [visible, setVisible] = useState(false)

    const toggleVisibility = () => {
      setVisible(!visible)
    }

    const suffix = visibilityToggle ? (
      <button
        type="button"
        onClick={toggleVisibility}
        className="cursor-pointer hover:text-gray-600 transition-colors"
        tabIndex={-1}
      >
        {visible ? (
          <EyeSlashIcon className="w-5 h-5" />
        ) : (
          <EyeIcon className="w-5 h-5" />
        )}
      </button>
    ) : undefined

    return (
      <Input
        ref={ref}
        type={visible ? 'text' : 'password'}
        prefix={prefix}
        suffix={suffix}
        {...props}
      />
    )
  }
)

Password.displayName = 'Password'

export default Input
