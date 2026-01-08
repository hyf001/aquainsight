import { clsx, type ClassValue } from 'clsx'

/**
 * className 合并工具函数
 * 用于合并 Tailwind CSS 类名，自动处理冲突
 *
 * @example
 * cn('px-2 py-1', 'px-4') // => 'py-1 px-4'
 * cn('text-red-500', condition && 'text-blue-500') // => 'text-blue-500' (if condition is true)
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}
