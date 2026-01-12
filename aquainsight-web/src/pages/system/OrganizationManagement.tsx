import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, X, Check, Building2, Users, ChevronRight, ChevronDown, UserPlus, Crown, UserMinus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { cn } from '@/utils/cn'
import { organizationApi, type DepartmentVO, type DepartmentRequest } from '@/services/organization'
import { type UserInfoVO } from '@/services/user'

export default function OrganizationManagement() {
  const [departments, setDepartments] = useState<DepartmentVO[]>([])
  const [flatDepartments, setFlatDepartments] = useState<DepartmentVO[]>([])
  const [employees, setEmployees] = useState<UserInfoVO[]>([])
  const [allEmployees, setAllEmployees] = useState<UserInfoVO[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentVO | null>(null)
  const [expandedDepts, setExpandedDepts] = useState<Set<number>>(new Set())

  // 部门弹窗
  const [showDeptModal, setShowDeptModal] = useState(false)
  const [deptModalType, setDeptModalType] = useState<'create' | 'edit'>('create')
  const [editingDept, setEditingDept] = useState<DepartmentVO | null>(null)
  const [deptFormData, setDeptFormData] = useState<DepartmentRequest>({
    name: '',
    parentId: undefined,
    sort: 0,
  })

  // 添加员工弹窗
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false)
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null)
  const [isLeader, setIsLeader] = useState(false)

  // 获取部门树
  const fetchDepartmentTree = async () => {
    setLoading(true)
    try {
      const res = await organizationApi.getDepartmentTree()
      setDepartments(res || [])
      // 默认展开所有部门
      const allIds = new Set<number>()
      const collectIds = (depts: DepartmentVO[]) => {
        depts.forEach(d => {
          allIds.add(d.id)
          if (d.children) collectIds(d.children)
        })
      }
      collectIds(res || [])
      setExpandedDepts(allIds)
    } catch (error) {
      console.error('获取部门树失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 获取所有部门（平铺）
  const fetchFlatDepartments = async () => {
    try {
      const res = await organizationApi.getDepartments()
      setFlatDepartments(res || [])
    } catch (error) {
      console.error('获取部门列表失败:', error)
    }
  }

  // 获取所有员工
  const fetchAllEmployees = async () => {
    try {
      const res = await organizationApi.getAllEmployees()
      setAllEmployees(res || [])
    } catch (error) {
      console.error('获取所有员工失败:', error)
    }
  }

  // 获取部门员工
  const fetchDepartmentEmployees = async (departmentId: number) => {
    try {
      const res = await organizationApi.getEmployeesByDepartment(departmentId)
      setEmployees(res || [])
    } catch (error) {
      console.error('获取部门员工失败:', error)
    }
  }

  useEffect(() => {
    fetchDepartmentTree()
    fetchFlatDepartments()
    fetchAllEmployees()
  }, [])

  useEffect(() => {
    if (selectedDepartment) {
      fetchDepartmentEmployees(selectedDepartment.id)
    } else {
      setEmployees([])
    }
  }, [selectedDepartment])

  const toggleExpand = (deptId: number) => {
    setExpandedDepts(prev => {
      const next = new Set(prev)
      if (next.has(deptId)) {
        next.delete(deptId)
      } else {
        next.add(deptId)
      }
      return next
    })
  }

  const handleSelectDepartment = (dept: DepartmentVO) => {
    setSelectedDepartment(dept)
  }

  // 部门弹窗操作
  const handleOpenDeptModal = (type: 'create' | 'edit', dept?: DepartmentVO, parentId?: number) => {
    setDeptModalType(type)
    if (type === 'edit' && dept) {
      setEditingDept(dept)
      setDeptFormData({
        name: dept.name,
        parentId: dept.parentId,
        sort: dept.sort,
      })
    } else {
      setEditingDept(null)
      setDeptFormData({
        name: '',
        parentId: parentId,
        sort: 0,
      })
    }
    setShowDeptModal(true)
  }

  const handleCloseDeptModal = () => {
    setShowDeptModal(false)
    setEditingDept(null)
  }

  const handleSubmitDept = async () => {
    try {
      if (deptModalType === 'create') {
        await organizationApi.createDepartment(deptFormData)
      } else if (editingDept) {
        await organizationApi.updateDepartment(editingDept.id, deptFormData)
      }
      handleCloseDeptModal()
      fetchDepartmentTree()
      fetchFlatDepartments()
    } catch (error) {
      console.error('保存部门失败:', error)
    }
  }

  const handleDeleteDept = async (id: number) => {
    if (window.confirm('确定要删除该部门吗？删除后部门下的员工将被移出。')) {
      try {
        await organizationApi.deleteDepartment(id)
        if (selectedDepartment?.id === id) {
          setSelectedDepartment(null)
        }
        fetchDepartmentTree()
        fetchFlatDepartments()
      } catch (error) {
        console.error('删除部门失败:', error)
      }
    }
  }

  // 员工操作
  const handleOpenAddEmployeeModal = () => {
    setSelectedEmployeeId(null)
    setIsLeader(false)
    setShowAddEmployeeModal(true)
  }

  const handleCloseAddEmployeeModal = () => {
    setShowAddEmployeeModal(false)
    setSelectedEmployeeId(null)
    setIsLeader(false)
  }

  const handleAddEmployee = async () => {
    if (!selectedDepartment || !selectedEmployeeId) return
    try {
      await organizationApi.addEmployeeToDepartment(selectedEmployeeId, selectedDepartment.id, isLeader)
      handleCloseAddEmployeeModal()
      fetchDepartmentEmployees(selectedDepartment.id)
    } catch (error) {
      console.error('添加员工失败:', error)
    }
  }

  const handleRemoveEmployee = async (userId: number) => {
    if (!selectedDepartment) return
    if (window.confirm('确定要将该员工从部门中移除吗？')) {
      try {
        await organizationApi.removeEmployeeFromDepartment(userId, selectedDepartment.id)
        fetchDepartmentEmployees(selectedDepartment.id)
      } catch (error) {
        console.error('移除员工失败:', error)
      }
    }
  }

  const handleSetLeader = async (userId: number) => {
    if (!selectedDepartment) return
    try {
      await organizationApi.setLeader(userId, selectedDepartment.id)
      fetchDepartmentEmployees(selectedDepartment.id)
    } catch (error) {
      console.error('设置负责人失败:', error)
    }
  }

  const handleUnsetLeader = async (userId: number) => {
    if (!selectedDepartment) return
    try {
      await organizationApi.unsetLeader(userId, selectedDepartment.id)
      fetchDepartmentEmployees(selectedDepartment.id)
    } catch (error) {
      console.error('取消负责人失败:', error)
    }
  }

  // 渲染部门树
  const renderDepartmentTree = (depts: DepartmentVO[], level: number = 0) => {
    return depts.map(dept => {
      const hasChildren = dept.children && dept.children.length > 0
      const isExpanded = expandedDepts.has(dept.id)
      const isSelected = selectedDepartment?.id === dept.id

      return (
        <div key={dept.id}>
          <div
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors',
              isSelected ? 'bg-nature-100 text-nature-700' : 'hover:bg-clean-100 text-clean-700',
            )}
            style={{ paddingLeft: `${12 + level * 16}px` }}
            onClick={() => handleSelectDepartment(dept)}
          >
            {hasChildren ? (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleExpand(dept.id)
                }}
                className="p-0.5 rounded hover:bg-clean-200"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            ) : (
              <span className="w-5" />
            )}
            <Building2 className="w-4 h-4 text-nature-500" />
            <span className="flex-1 text-sm font-medium truncate">{dept.name}</span>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleOpenDeptModal('create', undefined, dept.id)
                }}
                className="p-1 rounded hover:bg-nature-200 text-nature-600"
                title="添加子部门"
              >
                <Plus className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleOpenDeptModal('edit', dept)
                }}
                className="p-1 rounded hover:bg-nature-200 text-nature-600"
                title="编辑"
              >
                <Edit2 className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteDept(dept.id)
                }}
                className="p-1 rounded hover:bg-red-100 text-red-500"
                title="删除"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
          {hasChildren && isExpanded && renderDepartmentTree(dept.children!, level + 1)}
        </div>
      )
    })
  }

  // 过滤掉已在当前部门的员工
  const availableEmployees = allEmployees.filter(
    emp => !employees.some(e => e.id === emp.id)
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-clean-900">组织管理</h1>
          <p className="text-clean-500 mt-1">管理部门结构和员工分配</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => handleOpenDeptModal('create')}>
          <Plus className="w-4 h-4" />
          新增部门
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Tree */}
        <Card className="lg:col-span-1 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-clean-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-nature-500" />
              部门结构
            </h2>
          </div>
          {loading ? (
            <div className="py-8 text-center">
              <div className="w-6 h-6 border-2 border-nature-200 border-t-nature-500 rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-clean-500">加载中...</p>
            </div>
          ) : departments.length > 0 ? (
            <div className="space-y-1 group">
              {renderDepartmentTree(departments)}
            </div>
          ) : (
            <div className="py-8 text-center text-clean-500 text-sm">
              暂无部门，请先创建
            </div>
          )}
        </Card>

        {/* Department Employees */}
        <Card className="lg:col-span-2 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-clean-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-nature-500" />
              {selectedDepartment ? `${selectedDepartment.name} - 员工列表` : '请选择部门'}
            </h2>
            {selectedDepartment && (
              <Button size="sm" className="flex items-center gap-1" onClick={handleOpenAddEmployeeModal}>
                <UserPlus className="w-4 h-4" />
                添加员工
              </Button>
            )}
          </div>

          {selectedDepartment ? (
            employees.length > 0 ? (
              <div className="space-y-3">
                {employees.map((employee, index) => (
                  <motion.div
                    key={employee.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-clean-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-nature-100 flex items-center justify-center">
                        <Users className="w-5 h-5 text-nature-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-clean-900">{employee.name}</span>
                          {employee.isLeader === 1 && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 flex items-center gap-1">
                              <Crown className="w-3 h-3" />
                              负责人
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-clean-500">{employee.phone || '-'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {employee.isLeader === 1 ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUnsetLeader(employee.id)}
                          className="text-amber-600 hover:text-amber-700"
                        >
                          取消负责人
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetLeader(employee.id)}
                        >
                          <Crown className="w-3 h-3 mr-1" />
                          设为负责人
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveEmployee(employee.id)}
                        className="text-red-600 hover:text-red-700 hover:border-red-300 hover:bg-red-50"
                      >
                        <UserMinus className="w-3 h-3" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-clean-500">
                该部门暂无员工
              </div>
            )
          ) : (
            <div className="py-12 text-center text-clean-500">
              请在左侧选择一个部门查看员工
            </div>
          )}
        </Card>
      </div>

      {/* Department Modal */}
      {showDeptModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border rounded-2xl w-full max-w-md"
          >
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-clean-900">
                {deptModalType === 'create' ? '新增部门' : '编辑部门'}
              </h2>
              <button onClick={handleCloseDeptModal} className="p-2 rounded-lg text-clean-500 hover:text-clean-900">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <Input
                label="部门名称"
                value={deptFormData.name}
                onChange={(e) => setDeptFormData({ ...deptFormData, name: e.target.value })}
                placeholder="请输入部门名称"
                className="text-clean-900"
              />
              <Select
                label="上级部门"
                value={deptFormData.parentId?.toString() || ''}
                onChange={(e) => setDeptFormData({ ...deptFormData, parentId: e.target.value ? parseInt(e.target.value) : undefined })}
                options={[
                  { value: '', label: '无（顶级部门）' },
                  ...flatDepartments
                    .filter(d => d.id !== editingDept?.id)
                    .map(d => ({ value: d.id.toString(), label: d.name }))
                ]}
                className="text-clean-900"
              />
              <Input
                label="排序号"
                type="number"
                value={deptFormData.sort?.toString() || '0'}
                onChange={(e) => setDeptFormData({ ...deptFormData, sort: parseInt(e.target.value) || 0 })}
                placeholder="请输入排序号"
                className="text-clean-900"
              />
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t">
              <Button variant="outline" onClick={handleCloseDeptModal}>
                取消
              </Button>
              <Button onClick={handleSubmitDept} className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                确定
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddEmployeeModal && selectedDepartment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border rounded-2xl w-full max-w-md"
          >
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-clean-900">
                添加员工到 {selectedDepartment.name}
              </h2>
              <button onClick={handleCloseAddEmployeeModal} className="p-2 rounded-lg text-clean-500 hover:text-clean-900">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <Select
                label="选择员工"
                value={selectedEmployeeId?.toString() || ''}
                onChange={(e) => setSelectedEmployeeId(e.target.value ? parseInt(e.target.value) : null)}
                options={[
                  { value: '', label: '请选择员工' },
                  ...availableEmployees.map(e => ({ value: e.id.toString(), label: `${e.name} (${e.phone || '-'})` }))
                ]}
                className="text-clean-900"
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isLeader"
                  checked={isLeader}
                  onChange={(e) => setIsLeader(e.target.checked)}
                  className="w-4 h-4 rounded border-clean-300 text-nature-600 focus:ring-nature-500"
                />
                <label htmlFor="isLeader" className="text-sm text-clean-700">
                  设为部门负责人
                </label>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t">
              <Button variant="outline" onClick={handleCloseAddEmployeeModal}>
                取消
              </Button>
              <Button onClick={handleAddEmployee} disabled={!selectedEmployeeId} className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                确定
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
