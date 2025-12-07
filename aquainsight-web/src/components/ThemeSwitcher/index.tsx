import React from 'react'
import { Dropdown, Button } from 'antd'
import type { MenuProps } from 'antd'
import { BgColorsOutlined } from '@ant-design/icons'
import { useThemeStore } from '@/stores/useThemeStore'
import { themes } from '@/config/themes'
import './styles.less'

const ThemeSwitcher: React.FC = () => {
  const { currentTheme, setTheme } = useThemeStore()

  const menuItems: MenuProps['items'] = Object.values(themes).map(theme => ({
    key: theme.key,
    label: (
      <div className="theme-menu-item">
        <div
          className="theme-color-preview"
          style={{ backgroundColor: theme.primaryColor }}
        />
        <span>{theme.name}</span>
        {currentTheme.key === theme.key && <span className="theme-check">✓</span>}
      </div>
    ),
    onClick: () => setTheme(theme.key),
  }))

  return (
    <Dropdown
      menu={{ items: menuItems }}
      placement="bottomRight"
      trigger={['click']}
    >
      <Button
        type="text"
        icon={<BgColorsOutlined />}
        className="theme-switcher-btn"
      />
    </Dropdown>
  )
}

export default ThemeSwitcher
