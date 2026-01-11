import React, { forwardRef, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import type { DateRange } from 'react-day-picker'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { CalendarIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { cn } from '@/utils/cn'
import 'react-day-picker/dist/style.css'

export interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  format?: string
  allowClear?: boolean
}

export interface RangePickerProps {
  value?: [Date | undefined, Date | undefined]
  onChange?: (dates: [Date | undefined, Date | undefined]) => void
  placeholder?: [string, string]
  disabled?: boolean
  className?: string
  format?: string
  allowClear?: boolean
  showTime?: boolean
}

// Re-export DateRange type from react-day-picker
export type { DateRange } from 'react-day-picker'

// DatePicker Component
export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      value,
      onChange,
      placeholder = '选择日期',
      disabled = false,
      className,
      format: dateFormat = 'yyyy-MM-dd',
      allowClear = true,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false)
    const [selected, setSelected] = useState<Date | undefined>(value)

    React.useEffect(() => {
      setSelected(value)
    }, [value])

    const handleSelect = (date: Date | undefined) => {
      setSelected(date)
      onChange?.(date)
      setIsOpen(false)
    }

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation()
      setSelected(undefined)
      onChange?.(undefined)
    }

    return (
      <div ref={ref} className={cn('relative', className)}>
        <div
          className={cn(
            'flex items-center justify-between gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-colors',
            disabled
              ? 'bg-gray-100 cursor-not-allowed'
              : 'bg-white hover:border-ocean-teal focus-within:border-ocean-teal focus-within:ring-2 focus-within:ring-ocean-teal/20',
            'border-gray-300'
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <CalendarIcon className="w-4 h-4 text-gray-400" />
          <span className={cn('flex-1 text-sm', !selected && 'text-gray-400')}>
            {selected ? format(selected, dateFormat, { locale: zhCN }) : placeholder}
          </span>
          {allowClear && selected && !disabled && (
            <XMarkIcon
              className="w-4 h-4 text-gray-400 hover:text-gray-600"
              onClick={handleClear}
            />
          )}
        </div>

        {isOpen && !disabled && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
              <DayPicker
                mode="single"
                selected={selected}
                onSelect={handleSelect}
                locale={zhCN}
                className="p-3"
                classNames={{
                  months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                  month: 'space-y-4',
                  caption: 'flex justify-center pt-1 relative items-center',
                  caption_label: 'text-sm font-medium text-gray-900',
                  nav: 'space-x-1 flex items-center',
                  nav_button: cn(
                    'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                    'inline-flex items-center justify-center rounded-md text-sm font-medium',
                    'hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-50'
                  ),
                  nav_button_previous: 'absolute left-1',
                  nav_button_next: 'absolute right-1',
                  table: 'w-full border-collapse space-y-1',
                  head_row: 'flex',
                  head_cell: 'text-gray-500 rounded-md w-9 font-normal text-[0.8rem]',
                  row: 'flex w-full mt-2',
                  cell: cn(
                    'relative p-0 text-center text-sm focus-within:relative focus-within:z-20',
                    '[&:has([aria-selected])]:bg-ocean-seafoam/20'
                  ),
                  day: cn(
                    'h-9 w-9 p-0 font-normal rounded-md hover:bg-gray-100',
                    'aria-selected:opacity-100'
                  ),
                  day_selected: 'bg-ocean-teal text-white hover:bg-ocean-teal hover:text-white',
                  day_today: 'bg-ocean-seafoam/30 text-ocean-navy',
                  day_outside: 'text-gray-400 opacity-50',
                  day_disabled: 'text-gray-400 opacity-50',
                  day_hidden: 'invisible',
                }}
              />
            </div>
          </>
        )}
      </div>
    )
  }
)

DatePicker.displayName = 'DatePicker'

// RangePicker Component
export const RangePicker = forwardRef<HTMLDivElement, RangePickerProps>(
  (
    {
      value,
      onChange,
      placeholder = ['开始日期', '结束日期'],
      disabled = false,
      className,
      format: dateFormat = 'yyyy-MM-dd',
      allowClear = true,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false)
    const [selected, setSelected] = useState<DateRange | undefined>(
      value ? { from: value[0], to: value[1] } : undefined
    )

    React.useEffect(() => {
      if (value) {
        setSelected({ from: value[0], to: value[1] })
      }
    }, [value])

    const handleSelect = (range: DateRange | undefined) => {
      setSelected(range)
      onChange?.([range?.from, range?.to])
      // Close when both dates are selected
      if (range?.from && range?.to) {
        setIsOpen(false)
      }
    }

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation()
      setSelected(undefined)
      onChange?.([undefined, undefined])
    }

    const formatRange = () => {
      if (!selected?.from) return placeholder.join(' ~ ')
      if (!selected.to) {
        return `${format(selected.from, dateFormat, { locale: zhCN })} ~ ${placeholder[1]}`
      }
      return `${format(selected.from, dateFormat, { locale: zhCN })} ~ ${format(
        selected.to,
        dateFormat,
        { locale: zhCN }
      )}`
    }

    return (
      <div ref={ref} className={cn('relative', className)}>
        <div
          className={cn(
            'flex items-center justify-between gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-colors',
            disabled
              ? 'bg-gray-100 cursor-not-allowed'
              : 'bg-white hover:border-ocean-teal focus-within:border-ocean-teal focus-within:ring-2 focus-within:ring-ocean-teal/20',
            'border-gray-300'
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <CalendarIcon className="w-4 h-4 text-gray-400" />
          <span
            className={cn('flex-1 text-sm', !selected?.from && 'text-gray-400')}
          >
            {formatRange()}
          </span>
          {allowClear && selected?.from && !disabled && (
            <XMarkIcon
              className="w-4 h-4 text-gray-400 hover:text-gray-600"
              onClick={handleClear}
            />
          )}
        </div>

        {isOpen && !disabled && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
              <DayPicker
                mode="range"
                selected={selected}
                onSelect={handleSelect}
                locale={zhCN}
                numberOfMonths={2}
                className="p-3"
                classNames={{
                  months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                  month: 'space-y-4',
                  caption: 'flex justify-center pt-1 relative items-center',
                  caption_label: 'text-sm font-medium text-gray-900',
                  nav: 'space-x-1 flex items-center',
                  nav_button: cn(
                    'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                    'inline-flex items-center justify-center rounded-md text-sm font-medium',
                    'hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-50'
                  ),
                  nav_button_previous: 'absolute left-1',
                  nav_button_next: 'absolute right-1',
                  table: 'w-full border-collapse space-y-1',
                  head_row: 'flex',
                  head_cell: 'text-gray-500 rounded-md w-9 font-normal text-[0.8rem]',
                  row: 'flex w-full mt-2',
                  cell: cn(
                    'relative p-0 text-center text-sm focus-within:relative focus-within:z-20',
                    '[&:has([aria-selected])]:bg-ocean-seafoam/20'
                  ),
                  day: cn(
                    'h-9 w-9 p-0 font-normal rounded-md hover:bg-gray-100',
                    'aria-selected:opacity-100'
                  ),
                  day_selected: 'bg-ocean-teal text-white hover:bg-ocean-teal hover:text-white',
                  day_today: 'bg-ocean-seafoam/30 text-ocean-navy',
                  day_outside: 'text-gray-400 opacity-50',
                  day_disabled: 'text-gray-400 opacity-50',
                  day_range_middle: 'aria-selected:bg-ocean-seafoam/30 aria-selected:text-gray-900',
                  day_hidden: 'invisible',
                }}
              />
            </div>
          </>
        )}
      </div>
    )
  }
)

RangePicker.displayName = 'RangePicker'

export default DatePicker
