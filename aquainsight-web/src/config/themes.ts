// 主题配置
export interface ThemeConfig {
  key: string
  name: string
  primaryColor: string
  headerBg: string
  siderBg: string
  contentBg: string
  menuBg: string
  menuActiveBg: string
  menuHoverBg: string
  textColor: string
  textLightColor: string
  menuTextColor: string
  menuTextLightColor: string
}

// 预定义的主题
export const themes: Record<string, ThemeConfig> = {
  blue: {
    key: 'blue',
    name: '蓝色主题',
    primaryColor: '#1890ff',
    headerBg: '#2c3e50',
    siderBg: '#34495e',
    contentBg: '#f0f2f5',
    menuBg: '#34495e',
    menuActiveBg: 'rgba(255, 255, 255, 0.15)',
    menuHoverBg: 'rgba(255, 255, 255, 0.08)',
    textColor: '#000000d9',
    textLightColor: '#00000073',
    menuTextColor: 'rgba(255, 255, 255, 0.85)',
    menuTextLightColor: 'rgba(255, 255, 255, 0.65)',
  },
  cyan: {
    key: 'cyan',
    name: '青色主题',
    primaryColor: '#13c2c2',
    headerBg: '#006d75',
    siderBg: '#00474d',
    contentBg: '#f0f2f5',
    menuBg: '#00474d',
    menuActiveBg: 'rgba(255, 255, 255, 0.15)',
    menuHoverBg: 'rgba(255, 255, 255, 0.08)',
    textColor: '#000000d9',
    textLightColor: '#00000073',
    menuTextColor: 'rgba(255, 255, 255, 0.85)',
    menuTextLightColor: 'rgba(255, 255, 255, 0.65)',
  },
  green: {
    key: 'green',
    name: '绿色主题',
    primaryColor: '#52c41a',
    headerBg: '#135200',
    siderBg: '#274916',
    contentBg: '#f0f2f5',
    menuBg: '#274916',
    menuActiveBg: 'rgba(255, 255, 255, 0.15)',
    menuHoverBg: 'rgba(255, 255, 255, 0.08)',
    textColor: '#000000d9',
    textLightColor: '#00000073',
    menuTextColor: 'rgba(255, 255, 255, 0.85)',
    menuTextLightColor: 'rgba(255, 255, 255, 0.65)',
  },
  orange: {
    key: 'orange',
    name: '橙色主题',
    primaryColor: '#fa8c16',
    headerBg: '#613400',
    siderBg: '#7c4a03',
    contentBg: '#f0f2f5',
    menuBg: '#7c4a03',
    menuActiveBg: 'rgba(255, 255, 255, 0.15)',
    menuHoverBg: 'rgba(255, 255, 255, 0.08)',
    textColor: '#000000d9',
    textLightColor: '#00000073',
    menuTextColor: 'rgba(255, 255, 255, 0.85)',
    menuTextLightColor: 'rgba(255, 255, 255, 0.65)',
  },
  purple: {
    key: 'purple',
    name: '紫色主题',
    primaryColor: '#722ed1',
    headerBg: '#22075e',
    siderBg: '#391085',
    contentBg: '#f0f2f5',
    menuBg: '#391085',
    menuActiveBg: 'rgba(255, 255, 255, 0.15)',
    menuHoverBg: 'rgba(255, 255, 255, 0.08)',
    textColor: '#000000d9',
    textLightColor: '#00000073',
    menuTextColor: 'rgba(255, 255, 255, 0.85)',
    menuTextLightColor: 'rgba(255, 255, 255, 0.65)',
  },
  gold: {
    key: 'gold',
    name: '金色主题',
    primaryColor: '#faad14',
    headerBg: '#874d00',
    siderBg: '#ad6800',
    contentBg: '#f0f2f5',
    menuBg: '#ad6800',
    menuActiveBg: 'rgba(255, 255, 255, 0.15)',
    menuHoverBg: 'rgba(255, 255, 255, 0.08)',
    textColor: '#000000d9',
    textLightColor: '#00000073',
    menuTextColor: 'rgba(255, 255, 255, 0.85)',
    menuTextLightColor: 'rgba(255, 255, 255, 0.65)',
  },
}

export const defaultTheme = themes.blue
