import React, { useState } from 'react'
import { cn } from '@/utils/cn'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

export interface MenuProps {
  mode?: 'vertical' | 'horizontal'
  selectedKeys?: string[]
  openKeys?: string[]
  onSelect?: (key: string) => void
  onOpenChange?: (openKeys: string[]) => void
  className?: string
  children: React.ReactNode
}

export interface MenuItemProps {
  itemKey: string
  icon?: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  children: React.ReactNode
}

export interface SubMenuProps {
  itemKey: string
  icon?: React.ReactNode
  title: React.ReactNode
  children: React.ReactNode
}

const MenuContext = React.createContext<{
  selectedKeys: string[]
  openKeys: string[]
  onSelect: (key: string) => void
  onOpenChange: (key: string) => void
}>({
  selectedKeys: [],
  openKeys: [],
  onSelect: () => {},
  onOpenChange: () => {},
})

export const Menu: React.FC<MenuProps> & {
  Item: React.FC<MenuItemProps>
  SubMenu: React.FC<SubMenuProps>
} = ({ mode = 'vertical', selectedKeys = [], openKeys = [], onSelect, onOpenChange, className, children }) => {
  const [internalOpenKeys, setInternalOpenKeys] = useState<string[]>(openKeys)

  const handleOpenChange = (key: string) => {
    const newOpenKeys = internalOpenKeys.includes(key)
      ? internalOpenKeys.filter((k) => k !== key)
      : [...internalOpenKeys, key]
    setInternalOpenKeys(newOpenKeys)
    onOpenChange?.(newOpenKeys)
  }

  const handleSelect = (key: string) => {
    onSelect?.(key)
  }

  return (
    <MenuContext.Provider
      value={{
        selectedKeys,
        openKeys: internalOpenKeys,
        onSelect: handleSelect,
        onOpenChange: handleOpenChange,
      }}
    >
      <div className={cn('flex flex-col', mode === 'horizontal' && 'flex-row', className)}>{children}</div>
    </MenuContext.Provider>
  )
}

const MenuItem: React.FC<MenuItemProps> = ({ itemKey, icon, onClick, disabled, children }) => {
  const { selectedKeys, onSelect } = React.useContext(MenuContext)
  const isSelected = selectedKeys.includes(itemKey)

  const handleClick = () => {
    if (disabled) return
    onClick?.()
    onSelect(itemKey)
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        'flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors cursor-pointer',
        isSelected && 'bg-ocean-teal text-white',
        !isSelected && 'text-gray-700 hover:bg-ocean-cream hover:text-ocean-navy',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {icon && <span className="flex-shrink-0 w-5 h-5">{icon}</span>}
      <span className="flex-1 truncate">{children}</span>
    </div>
  )
}

const SubMenu: React.FC<SubMenuProps> = ({ itemKey, icon, title, children }) => {
  const { openKeys, onOpenChange } = React.useContext(MenuContext)
  const isOpen = openKeys.includes(itemKey)

  const handleToggle = () => {
    onOpenChange(itemKey)
  }

  return (
    <div>
      <div
        onClick={handleToggle}
        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 transition-colors cursor-pointer hover:bg-ocean-cream hover:text-ocean-navy"
      >
        {icon && <span className="flex-shrink-0 w-5 h-5">{icon}</span>}
        <span className="flex-1 truncate">{title}</span>
        <ChevronDownIcon
          className={cn('w-4 h-4 transition-transform', isOpen && 'transform rotate-180')}
        />
      </div>
      {isOpen && <div className="pl-4">{children}</div>}
    </div>
  )
}

Menu.Item = MenuItem
Menu.SubMenu = SubMenu

export default Menu
