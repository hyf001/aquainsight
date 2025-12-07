import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { themes, defaultTheme, type ThemeConfig } from '@/config/themes'

interface ThemeState {
  currentTheme: ThemeConfig
  setTheme: (themeKey: string) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      currentTheme: defaultTheme,
      setTheme: (themeKey: string) => {
        const theme = themes[themeKey] || defaultTheme
        set({ currentTheme: theme })
      },
    }),
    {
      name: 'theme-storage',
    }
  )
)
