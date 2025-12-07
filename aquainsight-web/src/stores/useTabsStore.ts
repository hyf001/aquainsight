import { create } from 'zustand'

export interface TabItem {
  key: string
  label: string
  path: string
  closable?: boolean
}

interface TabsState {
  tabs: TabItem[]
  activeKey: string
  addTab: (tab: TabItem) => void
  removeTab: (key: string) => void
  setActiveTab: (key: string) => void
  clearTabs: () => void
}

export const useTabsStore = create<TabsState>((set, get) => ({
  tabs: [],
  activeKey: '',

  addTab: (tab: TabItem) => {
    const { tabs } = get()
    const existTab = tabs.find(t => t.key === tab.key)

    if (!existTab) {
      set({
        tabs: [...tabs, { ...tab, closable: tab.closable !== false }],
        activeKey: tab.key
      })
    } else {
      set({ activeKey: tab.key })
    }
  },

  removeTab: (key: string) => {
    const { tabs, activeKey } = get()
    const newTabs = tabs.filter(t => t.key !== key)

    let newActiveKey = activeKey
    if (activeKey === key && newTabs.length > 0) {
      const index = tabs.findIndex(t => t.key === key)
      const nextTab = newTabs[index] || newTabs[index - 1]
      newActiveKey = nextTab?.key || ''
    }

    set({ tabs: newTabs, activeKey: newActiveKey })
  },

  setActiveTab: (key: string) => {
    set({ activeKey: key })
  },

  clearTabs: () => {
    set({ tabs: [], activeKey: '' })
  },
}))
