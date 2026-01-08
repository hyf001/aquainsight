import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTabsStore } from '@/stores/useTabsStore'
import { XMarkIcon, ArrowPathIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'
import { Tabs } from '@/components/ui'

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

  const handleTabRemove = (key: string) => {
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

  const tabItems = tabs.map(tab => ({
    key: tab.key,
    label: (
      <div className="flex items-center gap-2">
        <span>{tab.label}</span>
        {tab.closable && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleTabRemove(tab.key)
            }}
            className="hover:bg-gray-200 rounded p-0.5 transition-colors"
          >
            <XMarkIcon className="w-3 h-3" />
          </button>
        )}
      </div>
    ),
  }))

  return (
    <div className="flex items-center bg-white border-b border-gray-200 px-2">
      <div className="flex-1 overflow-hidden">
        <Tabs
          type="card"
          size="sm"
          activeKey={activeKey}
          items={tabItems}
          onChange={handleTabChange}
        />
      </div>
      <div className="flex items-center gap-2 px-2 border-l border-gray-200">
        <button
          onClick={handleRefresh}
          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
          title="刷新"
        >
          <ArrowPathIcon className="w-4 h-4 text-gray-600" />
        </button>
        <button
          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
          title="设置"
        >
          <Cog6ToothIcon className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  )
}

export default TabsBar
