import React, { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { cn } from '@/utils/cn'

export interface DropdownProps {
  trigger: React.ReactNode
  children: React.ReactNode
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'
  className?: string
}

const Dropdown: React.FC<DropdownProps> = ({ trigger, children, placement = 'bottom-end', className }) => {
  const placementStyles = {
    'bottom-start': 'origin-top-left left-0 mt-2',
    'bottom-end': 'origin-top-right right-0 mt-2',
    'top-start': 'origin-bottom-left left-0 bottom-full mb-2',
    'top-end': 'origin-bottom-right right-0 bottom-full mb-2',
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button as={Fragment}>{trigger}</Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={cn(
            'absolute z-50 min-w-[12rem] rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
            placementStyles[placement],
            className
          )}
        >
          <div className="py-1">{children}</div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export interface DropdownItemProps {
  children: React.ReactNode
  onClick?: () => void
  icon?: React.ReactNode
  danger?: boolean
  disabled?: boolean
}

export const DropdownItem: React.FC<DropdownItemProps> = ({ children, onClick, icon, danger, disabled }) => {
  return (
    <Menu.Item disabled={disabled}>
      {({ active }) => (
        <button
          onClick={onClick}
          className={cn(
            'group flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors',
            active && !danger && 'bg-ocean-cream text-ocean-navy',
            active && danger && 'bg-red-50 text-red-700',
            !active && danger && 'text-red-600',
            !active && !danger && 'text-gray-700',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          disabled={disabled}
        >
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
        </button>
      )}
    </Menu.Item>
  )
}

export const DropdownDivider: React.FC = () => {
  return <div className="my-1 border-t border-gray-200" />
}

export default Dropdown
