import React, { useState, useEffect } from 'react'
import {
  Card,
  Row,
  Col,
  Tree,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Tag,
  message,
  Popconfirm,
} from 'antd'
import {
  PlusOutlined,
  DeleteOutlined,
  UserOutlined,
  SearchOutlined,
  EditOutlined,
  SubnodeOutlined,
} from '@ant-design/icons'
import type { DataNode } from 'antd/es/tree'
import type { ColumnsType } from 'antd/es/table'
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
import './styles.less'

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
  const [form] = Form.useForm()

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

  // 根据ID查找部门
  const findDepartmentById = (depts: Department[], id: number): Department | null => {
    for (const dept of depts) {
      if (dept.id === id) return dept
      if (dept.children) {
        const found = findDepartmentById(dept.children, id)
        if (found) return found
      }
    }
    return null
  }

  // 打开新建子部门弹窗
  const openAddSubDeptModal = (parentDept: Department) => {
    setEditingDept(null)
    form.resetFields()
    form.setFieldsValue({ parentId: parentDept.id })
    setDeptModalVisible(true)
  }

  // 转换为 Tree 数据
  const convertToTreeData = (depts: Department[]): DataNode[] => {
    return depts.map((dept) => ({
      key: dept.id,
      title: (
        <span className="tree-node-title">
          <span className="dept-name">{dept.name}</span>
          <span className="dept-actions" onClick={(e) => e.stopPropagation()}>
            <a onClick={() => openDeptModal(dept)} title="编辑"><EditOutlined /></a>
            <a onClick={() => openAddSubDeptModal(dept)} title="新建子部门"><SubnodeOutlined /></a>
            <Popconfirm
              title="确认删除"
              description="确定要删除该部门吗？"
              onConfirm={() => handleDeleteDept(dept.id)}
              okText="确定"
              cancelText="取消"
            >
              <a style={{ color: '#ff4d4f' }} title="删除部门"><DeleteOutlined /></a>
            </Popconfirm>
          </span>
        </span>
      ),
      children: dept.children ? convertToTreeData(dept.children) : undefined,
    }))
  }

  // 选择部门
  const handleSelectDept = (selectedKeys: React.Key[], info: any) => {
    if (selectedKeys.length > 0) {
      const deptId = selectedKeys[0] as number
      setSelectedDeptId(deptId)
      setSelectedDeptName(info.node.title as string)
      loadEmployees(deptId)
    } else {
      setSelectedDeptId(null)
      setSelectedDeptName('')
      loadEmployees()
    }
    setSelectedRowKeys([])
  }

  // 打开部门弹窗
  const openDeptModal = (dept?: Department) => {
    setEditingDept(dept || null)
    if (dept) {
      form.setFieldsValue({
        name: dept.name,
        parentId: dept.parentId || undefined,
        sort: dept.sort,
      })
    } else {
      form.resetFields()
      if (selectedDeptId) {
        form.setFieldsValue({ parentId: selectedDeptId })
      }
    }
    setDeptModalVisible(true)
  }

  // 保存部门
  const handleSaveDept = async () => {
    try {
      const values = await form.validateFields()
      if (editingDept) {
        await updateDepartment(editingDept.id, values)
        message.success('更新成功')
      } else {
        await createDepartment(values)
        message.success('创建成功')
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
      message.success('删除成功')
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
      message.warning('请选择人员')
      return
    }
    if (selectedRowKeys.length > 1) {
      message.warning('只能选择一个人员')
      return
    }
    if (!selectedDeptId) {
      message.warning('请先选择部门')
      return
    }

    const selectedUserId = selectedRowKeys[0] as number
    const selectedUser = employees.find(emp => emp.id === selectedUserId)

    if (!selectedUser) {
      message.warning('未找到选中的人员')
      return
    }

    try {
      // 如果已经是负责人，则取消；否则设为负责人
      if (selectedUser.isLeader === 1) {
        await unsetLeader(selectedUserId, selectedDeptId)
        message.success('已取消负责人')
      } else {
        await setLeader(selectedUserId, selectedDeptId)
        message.success('设置成功')
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
      message.warning('请选择要移除的人员')
      return
    }
    if (!selectedDeptId) {
      message.warning('请先选择部门')
      return
    }
    try {
      for (const userId of selectedRowKeys) {
        await removeEmployeeFromDepartment(userId as number, selectedDeptId)
      }
      message.success('移除成功')
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

  // 加载所有用户（用于配置人员）
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
      message.warning('请选择要配置的人员')
      return
    }
    if (!selectedDeptId) {
      message.warning('请先选择部门')
      return
    }
    try {
      // 批量更新员工部门
      for (const userId of assignSelectedKeys) {
        await updateEmployeeDepartment(userId as number, selectedDeptId)
      }
      message.success('配置成功')
      setAssignModalVisible(false)
      setAssignSelectedKeys([])
      loadEmployees(selectedDeptId)
    } catch (error) {
      console.error('配置人员失败:', error)
    }
  }

  // 搜索员工
  const handleSearch = () => {
    if (searchName.trim()) {
      const filtered = employees.filter(emp =>
        emp.name?.includes(searchName)
      )
      setEmployees(filtered)
    } else {
      loadEmployees(selectedDeptId || undefined)
    }
  }

  // 过滤后的员工列表
  const filteredEmployees = searchName.trim()
    ? employees.filter(emp =>
        emp.name?.includes(searchName)
      )
    : employees

  // 员工表格列
  const columns: ColumnsType<Employee> = [
    {
      title: '序号',
      key: 'index',
      width: 60,
      render: (_, __, index) => index + 1,
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
      width: 80,
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
      width: 100,
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
      width: 80,
      render: (value) => (
        <Tag color={value === 1 ? 'green' : 'red'}>
          {value === 1 ? '启用' : '禁用'}
        </Tag>
      ),
    },
  ]

  // 表格选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => {
      setSelectedRowKeys(keys)
    },
  }

  return (
    <div>
      <Row gutter={16}>
        {/* 左侧部门树 */}
        <Col span={6}>
          <Card
            title="部门架构"
            size="small"
            bodyStyle={{ padding: '8px 16px' }}
          >
            <Tree
              treeData={convertToTreeData(departments)}
              onSelect={handleSelectDept}
              selectedKeys={selectedDeptId ? [selectedDeptId] : []}
              defaultExpandAll
            />
          </Card>
        </Col>

        {/* 右侧员工列表 */}
        <Col span={18}>
          <Card size="small" bodyStyle={{ padding: 16 }}>
            {/* 搜索栏 */}
            <div style={{ marginBottom: 16 }}>
              <Space>
                <span>人员名称：</span>
                <Input
                  placeholder="请输入人员名称"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  style={{ width: 200 }}
                  onPressEnter={handleSearch}
                />
                <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                  查询
                </Button>
              </Space>
            </div>

            {/* 操作按钮 */}
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                  if (!selectedDeptId) {
                    message.warning('请先选择部门')
                    return
                  }
                  setAssignModalVisible(true)
                  loadAllUsers()
                }}>
                  新增人员
                </Button>
                <Popconfirm
                  title="确认移除"
                  description="确定要将选中的人员从该部门移除吗？"
                  onConfirm={handleRemoveEmployees}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button danger icon={<DeleteOutlined />}>
                    移除人员
                  </Button>
                </Popconfirm>
                <Button
                  type="primary"
                  icon={<UserOutlined />}
                  onClick={handleToggleLeader}
                >
                  {selectedRowKeys.length === 1 &&
                   employees.find(emp => emp.id === selectedRowKeys[0])?.isLeader === 1
                    ? '取消负责人'
                    : '设为负责人'}
                </Button>
              </Space>
            </div>

            {/* 员工表格 */}
            <Table
              columns={columns}
              dataSource={filteredEmployees}
              rowKey="id"
              loading={loading}
              rowSelection={rowSelection}
              size="small"
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条`,
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* 部门编辑弹窗 */}
      <Modal
        title={editingDept ? '编辑部门' : '新增部门'}
        open={deptModalVisible}
        onOk={handleSaveDept}
        onCancel={() => setDeptModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="部门名称"
            rules={[{ required: true, message: '请输入部门名称' }]}
          >
            <Input placeholder="请输入部门名称" />
          </Form.Item>
          <Form.Item name="parentId" label="上级部门">
            <Select
              placeholder="请选择上级部门"
              allowClear
              options={flattenDepartments(departments).map((d) => ({
                label: d.name,
                value: d.id,
              }))}
            />
          </Form.Item>
          <Form.Item name="sort" label="排序号">
            <InputNumber
              placeholder="请输入排序号"
              style={{ width: '100%' }}
              min={0}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 配置人员弹窗 */}
      <Modal
        title="配置人员"
        open={assignModalVisible}
        onOk={handleAssignUsers}
        onCancel={() => {
          setAssignModalVisible(false)
          setAssignSelectedKeys([])
          setAssignSearchName('')
        }}
        width={900}
        okText="配置"
        cancelText="关闭"
      >
        <div style={{ marginBottom: 16 }}>
          <Space>
            <span>人员名称：</span>
            <Input
              placeholder="请输入人员名称"
              value={assignSearchName}
              onChange={(e) => setAssignSearchName(e.target.value)}
              style={{ width: 200 }}
            />
            <Button type="primary" icon={<SearchOutlined />}>
              查询
            </Button>
          </Space>
        </div>

        <Table
          columns={[
            {
              title: '序号',
              key: 'index',
              width: 60,
              render: (_, __, index) => index + 1,
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
              width: 80,
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
              width: 80,
              render: (value) => (
                <Tag color={value === 1 ? 'green' : 'red'}>
                  {value === 1 ? '启用' : '禁用'}
                </Tag>
              ),
            },
          ]}
          dataSource={
            assignSearchName.trim()
              ? allUsers.filter(user =>
                  user.name?.includes(assignSearchName)
                )
              : allUsers
          }
          rowKey="id"
          rowSelection={{
            selectedRowKeys: assignSelectedKeys,
            onChange: (keys) => setAssignSelectedKeys(keys),
          }}
          size="small"
          pagination={{
            showSizeChanger: true,
            defaultPageSize: 20,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Modal>
    </div>
  )
}

export default Organization
