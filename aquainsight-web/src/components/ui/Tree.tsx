import React, { useState } from 'react'
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { cn } from '@/utils/cn'

export interface TreeNode {
  /** 节点键 */
  key: string | number
  /** 节点标题 */
  title: React.ReactNode
  /** 子节点 */
  children?: TreeNode[]
  /** 是否禁用 */
  disabled?: boolean
  /** 是否可选 */
  selectable?: boolean
  /** 图标 */
  icon?: React.ReactNode
}

export interface TreeProps {
  /** 树数据 */
  treeData: TreeNode[]
  /** 默认展开的节点 */
  defaultExpandedKeys?: React.Key[]
  /** 展开的节点（受控） */
  expandedKeys?: React.Key[]
  /** 展开事件 */
  onExpand?: (expandedKeys: React.Key[]) => void
  /** 选中的节点 */
  selectedKeys?: React.Key[]
  /** 选中事件 */
  onSelect?: (selectedKeys: React.Key[], info: { node: TreeNode }) => void
  /** 是否显示连接线 */
  showLine?: boolean
  /** 自定义类名 */
  className?: string
}

interface TreeNodeComponentProps {
  node: TreeNode
  level: number
  expandedKeys: React.Key[]
  selectedKeys: React.Key[]
  onToggle: (key: React.Key) => void
  onSelect: (node: TreeNode) => void
  showLine?: boolean
}

const TreeNodeComponent: React.FC<TreeNodeComponentProps> = ({
  node,
  level,
  expandedKeys,
  selectedKeys,
  onToggle,
  onSelect,
  showLine,
}) => {
  const hasChildren = node.children && node.children.length > 0
  const isExpanded = expandedKeys.includes(node.key)
  const isSelected = selectedKeys.includes(node.key)

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-1 py-1 px-2 rounded cursor-pointer transition-colors',
          isSelected && 'bg-ocean-teal/10 text-ocean-teal',
          !isSelected && 'hover:bg-gray-50',
          node.disabled && 'opacity-50 cursor-not-allowed'
        )}
        style={{ paddingLeft: `${level * 24 + 8}px` }}
        onClick={() => !node.disabled && onSelect(node)}
      >
        {/* 展开/收起图标 */}
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggle(node.key)
            }}
            className="flex-shrink-0 p-0.5 hover:bg-gray-200 rounded transition-colors"
          >
            {isExpanded ? (
              <ChevronDownIcon className="w-4 h-4" />
            ) : (
              <ChevronRightIcon className="w-4 h-4" />
            )}
          </button>
        ) : (
          <span className="w-5" /> // 占位符，保持对齐
        )}

        {/* 节点图标 */}
        {node.icon && <span className="flex-shrink-0">{node.icon}</span>}

        {/* 节点标题 */}
        <span className="flex-1 text-sm truncate">{node.title}</span>
      </div>

      {/* 子节点 */}
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <TreeNodeComponent
              key={child.key}
              node={child}
              level={level + 1}
              expandedKeys={expandedKeys}
              selectedKeys={selectedKeys}
              onToggle={onToggle}
              onSelect={onSelect}
              showLine={showLine}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const Tree: React.FC<TreeProps> = ({
  treeData,
  defaultExpandedKeys = [],
  expandedKeys: controlledExpandedKeys,
  onExpand,
  selectedKeys = [],
  onSelect,
  showLine = false,
  className,
}) => {
  const [internalExpandedKeys, setInternalExpandedKeys] = useState<React.Key[]>(defaultExpandedKeys)

  const expandedKeys = controlledExpandedKeys !== undefined ? controlledExpandedKeys : internalExpandedKeys

  const handleToggle = (key: React.Key) => {
    const newExpandedKeys = expandedKeys.includes(key)
      ? expandedKeys.filter((k) => k !== key)
      : [...expandedKeys, key]

    if (controlledExpandedKeys === undefined) {
      setInternalExpandedKeys(newExpandedKeys)
    }
    onExpand?.(newExpandedKeys)
  }

  const handleSelect = (node: TreeNode) => {
    if (node.disabled || node.selectable === false) return
    onSelect?.([node.key], { node })
  }

  return (
    <div className={cn('text-gray-900', className)}>
      {treeData.map((node) => (
        <TreeNodeComponent
          key={node.key}
          node={node}
          level={0}
          expandedKeys={expandedKeys}
          selectedKeys={selectedKeys}
          onToggle={handleToggle}
          onSelect={handleSelect}
          showLine={showLine}
        />
      ))}
    </div>
  )
}

Tree.displayName = 'Tree'

export default Tree
