/**
 * AquaInsight UI Design System - Eco Industrial Edition
 *
 * Design Philosophy: Industrial structure with eco-water colors
 * Color Palette: Deep cyan, teal, nature green, industrial steel
 * Typography: Space Grotesk (display) + JetBrains Mono (functional)
 */

import React, { useState } from 'react'
import { clsx, type ClassValue } from 'clsx'

// ============================================================================
// DESIGN TOKENS - ECO INDUSTRIAL
// ============================================================================

export const tokens = {
  colors: {
    // Water cyan palette (水青色 - 主色)
    water: {
      50: '#ecfeff',
      100: '#cffafe',
      200: '#a5f3fc',
      300: '#67e8f9',
      400: '#22d3ee',
      500: '#06b6d4',    // 明亮水蓝
      600: '#0891b2',    // 标准水蓝
      700: '#0e7490',    // 深水蓝
      800: '#155e75',    // 更深
      900: '#164e63',    // 最深
      950: '#083344',    // 近黑
    },
    // Nature green (自然绿 - 强调)
    nature: {
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
    },
    // Steel palette (冷灰色调 - 工业结构)
    steel: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    // Alert colors
    rust: {
      400: '#fb923c',
      500: '#f97316',
      600: '#ea580c',
    },
    // Semantic
    success: '#22c55e',
    warning: '#eab308',
    error: '#ef4444',
    info: '#06b6d4',
  },
  fonts: {
    display: "'Space Grotesk', 'Roboto Condensed', system-ui, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  shadows: {
    hard: '4px 4px 0px 0px rgba(6, 182, 212, 0.3)',
    hardSm: '2px 2px 0px 0px rgba(6, 182, 212, 0.3)',
    hardLg: '6px 6px 0px 0px rgba(6, 182, 212, 0.4)',
  },
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

// ============================================================================
// LAYOUT COMPONENTS
// ============================================================================

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-steel-50 text-steel-900 font-sans selection:bg-water-500 selection:text-white">
      {children}
    </div>
  )
}

export const Sidebar: React.FC = () => {
  const menuItems = [
    { icon: 'dashboard', label: '仪表盘', active: true, badge: '3' },
    { icon: 'sites', label: '站点管理' },
    { icon: 'tasks', label: '任务调度' },
    { icon: 'alerts', label: '告警中心', badge: '12' },
    { icon: 'reports', label: '数据报表' },
    { icon: 'settings', label: '系统设置' },
  ]

  const getIcon = (name: string) => {
    const icons: Record<string, JSX.Element> = {
      dashboard: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
      sites: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
      tasks: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>
      ),
      alerts: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
      reports: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
      settings: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
      ),
    }
    return icons[name] || icons.dashboard
  }

  return (
    <aside className="w-64 bg-water-950 text-white border-r-3 border-water-700 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b-2 border-water-800 bg-water-900">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-water-400 to-nature-500 flex items-center justify-center shadow-hard">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="font-display text-lg font-bold tracking-tight">
            AQUA<span className="text-water-400">INSIGHT</span>
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3 font-medium transition-all',
              'border-l-3',
              item.active
                ? 'bg-water-800/80 text-white border-water-400'
                : 'text-water-200 hover:bg-water-800/50 hover:text-white hover:border-water-600'
            )}
          >
            <span className={item.active ? 'text-water-400' : ''}>{getIcon(item.icon)}</span>
            <span>{item.label}</span>
            {item.badge && (
              <span className="ml-auto px-2 py-0.5 text-xs font-mono bg-rust-500 text-white">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* User section */}
      <div className="p-4 border-t-2 border-water-800 bg-water-900">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-water-800 flex items-center justify-center text-water-400 font-mono font-bold border-2 border-water-600">
            OP
          </div>
          <div>
            <p className="text-sm font-medium text-white">操作员</p>
            <p className="text-xs text-water-400 font-mono">admin@aqua.local</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

// ============================================================================
// HEADER COMPONENT
// ============================================================================

export const Header: React.FC = () => {
  return (
    <header className="h-16 bg-white border-b-2 border-steel-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h1 className="font-display text-xl font-bold text-water-900 uppercase tracking-wide">
          Dashboard
        </h1>
        <div className="h-6 w-px bg-steel-300" />
        <span className="px-3 py-1 bg-water-100 text-water-700 font-mono text-xs uppercase">
          v2.0 Eco Industrial
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="SEARCH..."
            className="w-64 px-4 py-2 bg-steel-50 border-2 border-steel-200 text-steel-900 font-mono text-sm placeholder:text-steel-400 focus:outline-none focus:border-water-500 focus:ring-2 focus:ring-water-200 transition-all"
          />
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-water-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </div>

        {/* Notification */}
        <button className="relative p-2 bg-water-50 border-2 border-steel-200 hover:border-water-400 hover:bg-water-100 transition-all">
          <svg className="w-5 h-5 text-water-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-rust-500 text-white text-xs font-bold flex items-center justify-center border-2 border-white">
            3
          </span>
        </button>
      </div>
    </header>
  )
}

// ============================================================================
// STAT CARD
// ============================================================================

interface StatCardProps {
  title: string
  value: string | number
  change?: { value: number; positive: boolean }
  icon?: React.ReactNode
  className?: string
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-white border-2 border-steel-200 p-5 relative',
        'shadow-hard hover:shadow-hardLg hover:-translate-y-1 transition-all',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-mono text-steel-500 uppercase tracking-wider mb-1">{title}</p>
          <p className="text-3xl font-display font-bold text-water-900">{value}</p>
          {change && (
            <div className="flex items-center gap-1 mt-2">
              <span className={cn(
                'text-sm font-mono font-bold',
                change.positive ? 'text-nature-500' : 'text-rust-500'
              )}>
                {change.positive ? '↑' : '↓'} {Math.abs(change.value)}%
              </span>
              <span className="text-xs text-steel-400">vs yesterday</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="w-12 h-12 bg-water-50 border-2 border-water-200 flex items-center justify-center text-water-500">
            {icon}
          </div>
        )}
      </div>

      {/* Decorative corner */}
      <div className="absolute bottom-0 right-0 w-4 h-4 bg-gradient-to-tl from-water-400 to-nature-500" />
    </div>
  )
}

// ============================================================================
// STATUS BADGE
// ============================================================================

type StatusType = 'success' | 'warning' | 'error' | 'info' | 'normal'

interface StatusBadgeProps {
  status: StatusType
  children: React.ReactNode
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, children }) => {
  const config: Record<StatusType, { bg: string; text: string; border: string }> = {
    success: { bg: 'bg-nature-500/10', text: 'text-nature-600', border: 'border-nature-500' },
    warning: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning' },
    error: { bg: 'bg-rust-500/10', text: 'text-rust-500', border: 'border-rust-500' },
    info: { bg: 'bg-water-500/10', text: 'text-water-600', border: 'border-water-500' },
    normal: { bg: 'bg-steel-100', text: 'text-steel-600', border: 'border-steel-300' },
  }

  const { bg, text, border } = config[status]

  return (
    <span className={cn(
      'inline-flex items-center px-2 py-1 text-xs font-mono font-bold uppercase border',
      bg,
      text,
      border
    )}>
      <span className={cn('w-2 h-2 mr-1.5 rounded-full', bg.replace('/10', '').replace('bg-', 'bg-'))} />
      {children}
    </span>
  )
}

// ============================================================================
// DATA TABLE
// ============================================================================

interface Column<T> {
  key: string
  title: string
  width?: string | number
  render?: (value: unknown, record: T, index: number) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  dataSource: T[]
  rowKey?: string | ((record: T) => string)
  title?: string
  actions?: React.ReactNode
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  dataSource,
  rowKey = 'id',
  title,
  actions,
}: DataTableProps<T>) {
  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record)
    }
    return (record[rowKey] ?? index) as string
  }

  return (
    <div className="bg-white border-2 border-steel-200">
      {title && (
        <div className="px-5 py-3 border-b-2 border-steel-200 flex items-center justify-between bg-gradient-to-r from-water-50 to-white">
          <h3 className="font-display font-bold text-water-900 uppercase tracking-wide">{title}</h3>
          {actions}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-water-800 to-water-700 text-white">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-5 py-3 text-left text-xs font-mono font-bold uppercase tracking-wider border-b-2 border-water-600"
                  style={{ width: column.width }}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-steel-100">
            {dataSource.map((record, rowIndex) => (
              <tr
                key={getRowKey(record, rowIndex)}
                className="hover:bg-water-50/50 transition-colors"
              >
                {columns.map((column) => {
                  const value = (record as Record<string, unknown>)[column.key]
                  return (
                    <td
                      key={column.key}
                      className="px-5 py-3 text-sm text-steel-700 font-mono"
                    >
                      {column.render
                        ? column.render(value, record, rowIndex)
                        : (value as React.ReactNode)}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ============================================================================
// BUTTON
// ============================================================================

type ButtonVariant = 'primary' | 'secondary' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}) => {
  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-gradient-to-r from-water-600 to-water-500 text-white border-water-500 hover:from-water-500 hover:to-water-400',
    secondary: 'bg-white text-water-700 border-water-300 hover:bg-water-50 hover:border-water-400',
    danger: 'bg-gradient-to-r from-rust-600 to-rust-500 text-white border-rust-500 hover:from-rust-500 hover:to-rust-400',
  }

  const sizes: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-mono font-bold uppercase tracking-wide border-2',
        'transition-all active:translate-y-0.5 active:shadow-none shadow-hard disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="animate-spin">⟳</span>
      ) : icon ? (
        icon
      ) : null}
      {children}
    </button>
  )
}

// ============================================================================
// PROGRESS BAR
// ============================================================================

interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showValue?: boolean
  color?: 'success' | 'warning' | 'error' | 'default' | 'water'
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showValue = true,
  color = 'water',
}) => {
  const percentage = Math.min((value / max) * 100, 100)

  const colors = {
    success: 'bg-gradient-to-r from-nature-500 to-nature-400',
    warning: 'bg-gradient-to-r from-warning to-yellow-400',
    error: 'bg-gradient-to-r from-rust-600 to-rust-500',
    default: 'bg-gradient-to-r from-steel-500 to-steel-400',
    water: 'bg-gradient-to-r from-water-600 to-water-400',
  }

  return (
    <div className="space-y-1">
      {(label || showValue) && (
        <div className="flex justify-between text-xs font-mono uppercase">
          {label && <span className="text-steel-600">{label}</span>}
          {showValue && <span className="text-water-700 font-bold">{value} / {max}</span>}
        </div>
      )}
      <div className="h-4 bg-steel-100 border border-steel-200 relative overflow-hidden">
        <div
          className={cn(
            'h-full transition-all duration-500',
            colors[color]
          )}
          style={{ width: `${percentage}%` }}
        />
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
      </div>
    </div>
  )
}

// ============================================================================
// SITE LIST
// ============================================================================

interface Site {
  id: number
  name: string
  status: StatusType
  waterQuality: number
  lastUpdate: string
}

interface SiteListProps {
  sites: Site[]
  onSelect?: (site: Site) => void
}

export const SiteList: React.FC<SiteListProps> = ({ sites, onSelect }) => {
  return (
    <div className="bg-white border-2 border-steel-200">
      <div className="px-5 py-3 border-b-2 border-steel-200 flex items-center justify-between bg-gradient-to-r from-water-50 to-white">
        <h3 className="font-display font-bold text-water-900 uppercase tracking-wide">站点状态</h3>
        <button className="text-xs font-mono text-water-600 hover:text-water-800 uppercase">
          View All →
        </button>
      </div>
      <div className="divide-y divide-steel-100">
        {sites.map((site) => (
          <button
            key={site.id}
            onClick={() => onSelect?.(site)}
            className="w-full flex items-center gap-4 p-4 hover:bg-water-50/50 transition-all text-left group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-water-100 to-water-200 border-2 border-water-300 flex items-center justify-center group-hover:border-water-500 transition-all">
              <svg className="w-5 h-5 text-water-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium text-steel-900 group-hover:text-water-700 transition-colors">{site.name}</p>
              <p className="text-xs font-mono text-steel-500 mt-0.5">
                水质 {site.waterQuality}% · {site.lastUpdate}
              </p>
            </div>
            <StatusBadge status={site.status}>
              {site.status === 'success' ? 'OK' : site.status === 'warning' ? 'ATTN' : 'ALERT'}
            </StatusBadge>
          </button>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// EMPTY STATE
// ============================================================================

interface EmptyProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export const Empty: React.FC<EmptyProps> = ({ title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-steel-300 bg-gradient-to-b from-white to-water-50/30">
      <div className="w-16 h-16 bg-gradient-to-br from-water-100 to-water-200 border-2 border-water-300 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-water-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M12 8v8M8 12h8" />
        </svg>
      </div>
      <p className="font-display font-bold text-water-900 uppercase mb-1">{title}</p>
      {description && <p className="text-sm text-steel-500 mb-4">{description}</p>}
      {action}
    </div>
  )
}

// ============================================================================
// STYLES
// ============================================================================

const style = document.createElement('style')
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    --water-500: #06b6d4;
    --water-600: #0891b2;
    --nature-500: #22c55e;
    --rust-500: #f97316;
    --steel-50: #f8fafc;
    --steel-100: #f1f5f9;
    --steel-200: #e2e8f0;
    --steel-300: #cbd5e1;
  }

  * {
    font-family: 'Space Grotesk', system-ui, sans-serif;
  }

  .font-display {
    font-family: 'Space Grotesk', system-ui, sans-serif;
  }

  .font-mono {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  .animate-shimmer {
    animation: shimmer 2s infinite;
  }

  /* Subtle grid pattern */
  .eco-pattern {
    background-image:
      linear-gradient(90deg, transparent 79px, #e2e8f0 79px, #e2e8f0 81px, transparent 81px),
      linear-gradient(#e2e8f0 1px, transparent 1px);
    background-size: 100% 30px, 30px 30px;
  }
`
document.head.appendChild(style)

export default {
  Layout,
  Sidebar,
  Header,
  StatCard,
  StatusBadge,
  DataTable,
  Button,
  ProgressBar,
  SiteList,
  Empty,
  tokens,
}
