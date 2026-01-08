import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  PlusIcon,
  TrashIcon,
  UserIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline'
import {
  Card,
  CardBody,
  Tree,
  Table,
  Button,
  Modal,
  Form,
  FormField,
  Input,
  Select,
  Tag,
  Popconfirm,
  Pagination,
} from '@/components/ui'
import type { TreeNode, TableColumn } from '@/components/ui'
import {
  getDepartmentTree,
  getAllEmployees,
  getEmployeesByDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  setLeader,
  unsetLeader,
  updateEmployeeDepartment,
  removeEmployeeFromDepartment,
} from '@/services/organization'
import type { Department, Employee } from '@/services/organization'
import { toast } from '@/utils/toast'
import { cn } from '@/utils/cn'

const Organization: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [selectedDeptId, setSelectedDeptId] = useState<number | null>(null)
  const [selectedDeptName, setSelectedDeptName] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [deptModalVisible, setDeptModalVisible] = useState(false)
  const [editingDept, setEditingDept] = useState<Department | null>(null)
  const [searchName, setSearchName] = useState('')
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [assignModalVisible, setAssignModalVisible] = useState(false)
  const [assignSearchName, setAssignSearchName] = useState('')
  const [allUsers, setAllUsers] = useState<Employee[]>([])
  const [assignSelectedKeys, setAssignSelectedKeys] = useState<React.Key[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [assignPage, setAssignPage] = useState(1)
  const [assignPageSize, setAssignPageSize] = useState(20)

  const form = useForm()

  // 加载部门树
  const loadDepartments = async () => {
    try {
      const data = await getDepartmentTree()
      setDepartments(data)
    } catch (error) {
      console.error('加载部门失败:', error)
    }
  }

  // 加载员工列表
  const loadEmployees = async (departmentId?: number) => {
    setLoading(true)
    try {
      let data: Employee[]
      if (departmentId) {
        data = await getEmployeesByDepartment(departmentId)
      } else {
        data = await getAllEmployees()
      }
      setEmployees(data)
    } catch (error) {
      console.error('加载员工失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDepartments()
    loadEmployees()
  }, [])

  // 转换为 Tree 数据
  const convertToTreeData = (depts: Department[]): TreeNode[] => {
    return depts.map((dept) => ({
      key: dept.id,
      title: (
        <div className="flex items-center justify-between group w-full pr-2">
          <span className="flex-1 text-sm font-medium">{dept.name}</span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation()
                openDeptModal(dept)
              }}
              className="p-1 hover:bg-ocean-teal/10 rounded transition-colors"
              title="编辑"
            >
              <PencilIcon className="w-4 h-4 text-ocean-teal" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                openAddSubDeptModal(dept)
              }}
              className="p-1 hover:bg-ocean-teal/10 rounded transition-colors"
              title="新建子部门"
            >
              <PlusCircleIcon className="w-4 h-4 text-ocean-teal" />
            </button>
            <Popconfirm
              title="确认删除"
              description="确定要删除该部门吗？"
              onConfirm={() => handleDeleteDept(dept.id)}
              okType="danger"
            >
              <button
                onClick={(e) => e.stopPropagation()}
                className="p-1 hover:bg-red-50 rounded transition-colors"
                title="删除"
              >
                <TrashIcon className="w-4 h-4 text-red-500" />
              </button>
            </Popconfirm>
          </div>
        </div>
      ),
      children: dept.children ? convertToTreeData(dept.children) : undefined,
    }))
  }

  // 选择部门
  const handleSelectDept = (selectedKeys: React.Key[], info: { node: TreeNode }) => {
    if (selectedKeys.length > 0) {
      const deptId = selectedKeys[0] as number
      setSelectedDeptId(deptId)
      // 从 title 中提取部门名称
      const titleElement = info.node.title as React.ReactElement
      const deptName = typeof titleElement === 'object' ?
        departments.find(d => findDeptById(d, deptId))?.name || '' :
        ''
      setSelectedDeptName(deptName)
      loadEmployees(deptId)
    } else {
      setSelectedDeptId(null)
      setSelectedDeptName('')
      loadEmployees()
    }
    setSelectedRowKeys([])
    setCurrentPage(1)
  }

  // 递归查找部门
  const findDeptById = (dept: Department, id: number): Department | null => {
    if (dept.id === id) return dept
    if (dept.children) {
      for (const child of dept.children) {
        const found = findDeptById(child, id)
        if (found) return found
      }
    }
    return null
  }

  // 打开新建子部门弹窗
  const openAddSubDeptModal = (parentDept: Department) => {
    setEditingDept(null)
    form.reset({ parentId: parentDept.id })
    setDeptModalVisible(true)
  }

  // 打开部门弹窗
  const openDeptModal = (dept?: Department) => {
    setEditingDept(dept || null)
    if (dept) {
      form.reset({
        name: dept.name,
        parentId: dept.parentId || undefined,
        sort: dept.sort,
      })
    } else {
      form.reset({
        parentId: selectedDeptId || undefined,
      })
    }
    setDeptModalVisible(true)
  }

  // 保存部门
  const handleSaveDept = async (values: any) => {
    try {
      if (editingDept) {
        await updateDepartment(editingDept.id, values)
        toast.success('更新成功')
      } else {
        await createDepartment(values)
        toast.success('创建成功')
      }
      setDeptModalVisible(false)
      loadDepartments()
    } catch (error) {
      console.error('保存部门失败:', error)
    }
  }

  // 删除部门
  const handleDeleteDept = async (id: number) => {
    try {
      await deleteDepartment(id)
      toast.success('删除成功')
      loadDepartments()
      if (selectedDeptId === id) {
        setSelectedDeptId(null)
        setSelectedDeptName('')
        loadEmployees()
      }
    } catch (error) {
      console.error('删除部门失败:', error)
    }
  }

  // 设置/取消负责人
  const handleToggleLeader = async () => {
    if (selectedRowKeys.length === 0) {
      toast.warning('请选择人员')
      return
    }
    if (selectedRowKeys.length > 1) {
      toast.warning('只能选择一个人员')
      return
    }
    if (!selectedDeptId) {
      toast.warning('请先选择部门')
      return
    }

    const selectedUserId = selectedRowKeys[0] as number
    const selectedUser = employees.find((emp) => emp.id === selectedUserId)

    if (!selectedUser) {
      toast.warning('未找到选中的人员')
      return
    }

    try {
      if (selectedUser.isLeader === 1) {
        await unsetLeader(selectedUserId, selectedDeptId)
        toast.success('已取消负责人')
      } else {
        await setLeader(selectedUserId, selectedDeptId)
        toast.success('设置成功')
      }
      loadEmployees(selectedDeptId)
      setSelectedRowKeys([])
    } catch (error) {
      console.error('操作失败:', error)
    }
  }

  // 移除人员
  const handleRemoveEmployees = async () => {
    if (selectedRowKeys.length === 0) {
      toast.warning('请选择要移除的人员')
      return
    }
    if (!selectedDeptId) {
      toast.warning('请先选择部门')
      return
    }
    try {
      for (const userId of selectedRowKeys) {
        await removeEmployeeFromDepartment(userId as number, selectedDeptId)
      }
      toast.success('移除成功')
      loadEmployees(selectedDeptId)
      setSelectedRowKeys([])
    } catch (error) {
      console.error('移除人员失败:', error)
    }
  }

  // 获取所有部门的平铺列表
  const flattenDepartments = (depts: Department[]): Department[] => {
    const result: Department[] = []
    const flatten = (items: Department[]) => {
      items.forEach((item) => {
        result.push(item)
        if (item.children) {
          flatten(item.children)
        }
      })
    }
    flatten(depts)
    return result
  }

  // 加载所有用户
  const loadAllUsers = async () => {
    try {
      const data = await getAllEmployees()
      setAllUsers(data)
    } catch (error) {
      console.error('加载用户失败:', error)
    }
  }

  // 配置人员到部门
  const handleAssignUsers = async () => {
    if (assignSelectedKeys.length === 0) {
      toast.warning('请选择要配置的人员')
      return
    }
    if (!selectedDeptId) {
      toast.warning('请先选择部门')
      return
    }
    try {
      for (const userId of assignSelectedKeys) {
        await updateEmployeeDepartment(userId as number, selectedDeptId)
      }
      toast.success('配置成功')
      setAssignModalVisible(false)
      setAssignSelectedKeys([])
      loadEmployees(selectedDeptId)
    } catch (error) {
      console.error('配置人员失败:', error)
    }
  }

  // 搜索员工
  const handleSearch = () => {
    setCurrentPage(1)
  }

  // 过滤后的员工列表
  const filteredEmployees = searchName.trim()
    ? employees.filter((emp) => emp.name?.includes(searchName))
    : employees

  // 分页后的员工列表
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  // 过滤后的配置人员列表
  const filteredAssignUsers = assignSearchName.trim()
    ? allUsers.filter((user) => user.name?.includes(assignSearchName))
    : allUsers

  // 分页后的配置人员列表
  const paginatedAssignUsers = filteredAssignUsers.slice(
    (assignPage - 1) * assignPageSize,
    assignPage * assignPageSize
  )

  // 员工表格列
  const columns: TableColumn<Employee>[] = [
    {
      title: '序号',
      key: 'index',
      width: 80,
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: '人员名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      width: 100,
    },
    {
      title: '所属部门',
      key: 'departmentName',
      render: () => selectedDeptName || '-',
    },
    {
      title: '是否负责人',
      dataIndex: 'isLeader',
      key: 'isLeader',
      width: 120,
      render: (value) => (
        <Tag color={value === 1 ? 'blue' : 'default'}>
          {value === 1 ? '是' : '否'}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (value) => (
        <Tag color={value === 1 ? 'success' : 'error'}>
          {value === 1 ? '启用' : '禁用'}
        </Tag>
      ),
    },
  ]

  // 配置人员表格列
  const assignColumns: TableColumn<Employee>[] = [
    {
      title: '序号',
      key: 'index',
      width: 80,
      render: (_, __, index) => (assignPage - 1) * assignPageSize + index + 1,
    },
    {
      title: '人员名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      width: 100,
    },
    {
      title: '所属机构',
      dataIndex: 'organizationName',
      key: 'organizationName',
      render: () => '江苏远畅环保',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (value) => (
        <Tag color={value === 1 ? 'success' : 'error'}>
          {value === 1 ? '启用' : '禁用'}
        </Tag>
      ),
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-12 gap-6">
        {/* 左侧部门树 */}
        <div className="col-span-3">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardBody>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <PlusCircleIcon className="w-5 h-5 text-ocean-teal" />
                部门架构
              </h3>
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                <Tree
                  treeData={convertToTreeData(departments)}
                  onSelect={handleSelectDept}
                  selectedKeys={selectedDeptId ? [selectedDeptId] : []}
                  defaultExpandedKeys={departments.map((d) => d.id)}
                />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* 右侧员工列表 */}
        <div className="col-span-9">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardBody>
              {/* 搜索栏 */}
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  人员名称：
                </span>
                <Input
                  placeholder="请输入人员名称"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="w-64"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearch()
                  }}
                />
                <Button
                  variant="primary"
                  onClick={handleSearch}
                  className="flex items-center gap-2"
                >
                  <MagnifyingGlassIcon className="w-4 h-4" />
                  查询
                </Button>
              </div>

              {/* 操作按钮 */}
              <div className="flex items-center gap-3 mb-4">
                <Button
                  variant="primary"
                  onClick={() => {
                    if (!selectedDeptId) {
                      toast.warning('请先选择部门')
                      return
                    }
                    setAssignModalVisible(true)
                    loadAllUsers()
                    setAssignPage(1)
                  }}
                  className="flex items-center gap-2"
                >
                  <PlusIcon className="w-4 h-4" />
                  新增人员
                </Button>

                <Popconfirm
                  title="确认移除"
                  description="确定要将选中的人员从该部门移除吗？"
                  onConfirm={handleRemoveEmployees}
                  okType="danger"
                >
                  <Button variant="danger" className="flex items-center gap-2">
                    <TrashIcon className="w-4 h-4" />
                    移除人员
                  </Button>
                </Popconfirm>

                <Button
                  variant="secondary"
                  onClick={handleToggleLeader}
                  className="flex items-center gap-2"
                >
                  <UserIcon className="w-4 h-4" />
                  {selectedRowKeys.length === 1 &&
                  employees.find((emp) => emp.id === selectedRowKeys[0])?.isLeader === 1
                    ? '取消负责人'
                    : '设为负责人'}
                </Button>
              </div>

              {/* 员工表格 */}
              <Table
                columns={columns}
                dataSource={paginatedEmployees}
                rowKey="id"
                loading={loading}
                rowSelection={{
                  selectedRowKeys,
                  onChange: (keys) => setSelectedRowKeys(keys),
                }}
                size="middle"
              />

              {/* 分页 */}
              {filteredEmployees.length > 0 && (
                <div className="mt-4">
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={filteredEmployees.length}
                    onChange={(page, size) => {
                      setCurrentPage(page)
                      setPageSize(size)
                    }}
                    showSizeChanger
                    showTotal
                  />
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* 部门编辑弹窗 */}
      <Modal
        open={deptModalVisible}
        onClose={() => setDeptModalVisible(false)}
        title={editingDept ? '编辑部门' : '新增部门'}
        onOk={handleSaveDept}
        confirmLoading={form.formState.isSubmitting}
      >
        <Form form={form} onSubmit={handleSaveDept}>
          <FormField
            name="name"
            label="部门名称"
            required
            rules={{ required: '请输入部门名称' }}
          >
            {({ field }) => <Input {...field} placeholder="请输入部门名称" />}
          </FormField>

          <FormField name="parentId" label="上级部门">
            {({ field }) => (
              <Select
                {...field}
                placeholder="请选择上级部门"
                options={flattenDepartments(departments).map((d) => ({
                  label: d.name,
                  value: d.id,
                }))}
              />
            )}
          </FormField>

          <FormField name="sort" label="排序号">
            {({ field }) => (
              <Input
                {...field}
                type="number"
                placeholder="请输入排序号"
                onChange={(e) => field.onChange(Number(e.target.value) || 0)}
              />
            )}
          </FormField>
        </Form>
      </Modal>

      {/* 配置人员弹窗 */}
      <Modal
        open={assignModalVisible}
        onClose={() => {
          setAssignModalVisible(false)
          setAssignSelectedKeys([])
          setAssignSearchName('')
          setAssignPage(1)
        }}
        title="配置人员"
        onOk={handleAssignUsers}
        width={900}
        okText="配置"
        cancelText="关闭"
      >
        <div className="flex items-center gap-4 mb-4">
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
            人员名称：
          </span>
          <Input
            placeholder="请输入人员名称"
            value={assignSearchName}
            onChange={(e) => setAssignSearchName(e.target.value)}
            className="w-64"
          />
          <Button variant="primary" className="flex items-center gap-2">
            <MagnifyingGlassIcon className="w-4 h-4" />
            查询
          </Button>
        </div>

        <Table
          columns={assignColumns}
          dataSource={paginatedAssignUsers}
          rowKey="id"
          rowSelection={{
            selectedRowKeys: assignSelectedKeys,
            onChange: (keys) => setAssignSelectedKeys(keys),
          }}
          size="middle"
        />

        {filteredAssignUsers.length > 0 && (
          <div className="mt-4">
            <Pagination
              current={assignPage}
              pageSize={assignPageSize}
              total={filteredAssignUsers.length}
              onChange={(page, size) => {
                setAssignPage(page)
                setAssignPageSize(size)
              }}
              showSizeChanger
              showTotal
            />
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Organization
