import React from 'react'
import { Tabs } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useTabsStore } from '@/stores/useTabsStore'
import { CloseOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons'
import './styles.less'

const TabsBar: React.FC = () => {
  const navigate = useNavigate()
  const { tabs, activeKey, setActiveTab, removeTab } = useTabsStore()

  const handleTabChange = (key: string) => {
    const tab = tabs.find(t => t.key === key)
    if (tab) {
      setActiveTab(key)
      navigate(tab.path)
    }
  }

  const handleTabRemove = (key: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const targetTab = tabs.find(t => t.key === key)
    if (!targetTab) return

    removeTab(key)

    // 如果删除的是当前激活标签，导航到新的激活标签
    if (activeKey === key && tabs.length > 1) {
      const index = tabs.findIndex(t => t.key === key)
      const nextTab = tabs[index + 1] || tabs[index - 1]
      if (nextTab && nextTab.key !== key) {
        navigate(nextTab.path)
      }
    }
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  if (tabs.length === 0) return null

  return (
    <div className="tabs-bar">
      <div className="tabs-bar-content">
        <Tabs
          type="card"
          activeKey={activeKey}
          onChange={handleTabChange}
          hideAdd
          items={tabs.map(tab => ({
            key: tab.key,
            label: (
              <div className="tab-label">
                <span className="tab-title">{tab.label}</span>
                {tab.closable && (
                  <CloseOutlined
                    className="tab-close-icon"
                    onClick={(e) => handleTabRemove(tab.key, e)}
                  />
                )}
              </div>
            ),
          }))}
        />
        <div className="tabs-bar-actions">
          <ReloadOutlined className="action-icon" onClick={handleRefresh} title="刷新" />
          <SettingOutlined className="action-icon" title="设置" />
        </div>
      </div>
    </div>
  )
}

export default TabsBar
