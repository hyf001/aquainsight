import React, { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  message,
  Popconfirm,
  Upload,
  Avatar,
  Tooltip,
} from 'antd'
import type { UploadProps, TablePaginationConfig } from 'antd'
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  KeyOutlined,
  UserOutlined,
  UploadOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import {
  getUserList,
  createUser,
  updateUser,
  deleteUser,
  setUserRole,
  resetUserPassword,
} from '@/services/organization'
import type { UserInfo } from '@/services/organization'

const Personnel: React.FC = () => {
  const [users, setUsers] = useState<UserInfo[]>([])
  const [loading, setLoading] = useState(false)
  const [searchName, setSearchName] = useState('')
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  // 分页状态
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })

  // 弹窗状态
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [roleModalVisible, setRoleModalVisible] = useState(false)
  const [avatarModalVisible, setAvatarModalVisible] = useState(false)
  const [editingUser, setEditingUser] = useState<UserInfo | null>(null)

  const [createForm] = Form.useForm()
  const [editForm] = Form.useForm()
  const [roleForm] = Form.useForm()

  // 加载用户列表
  const loadUsers = async (pageNum: number = 1, pageSize: number = 10) => {
    setLoading(true)
    try {
      const data = await getUserList(pageNum, pageSize)
      setUsers(data.list)
      setPagination({
        current: data.pageNum,
        pageSize: data.pageSize,
        total: data.total,
      })
    } catch (error) {
      console.error('加载用户失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  // 处理分页变化
  const handleTableChange = (paginationConfig: TablePaginationConfig) => {
    loadUsers(paginationConfig.current || 1, paginationConfig.pageSize || 10)
  }

  // 创建人员
  const handleCreate = async () => {
    try {
      const values = await createForm.validateFields()
      await createUser(values)
      message.success('创建成功')
      setCreateModalVisible(false)
      createForm.resetFields()
      loadUsers(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('创建失败:', error)
    }
  }

  // 编辑人员
  const openEditModal = (user: UserInfo) => {
    setEditingUser(user)
    editForm.setFieldsValue({
      name: user.name,
      gender: user.gender,
      phone: user.phone,
      email: user.email,
    })
    setEditModalVisible(true)
  }

  const handleEdit = async () => {
    if (!editingUser) return
    try {
      const values = await editForm.validateFields()
      await updateUser(editingUser.id, values)
      message.success('更新成功')
      setEditModalVisible(false)
      setEditingUser(null)
      loadUsers(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('更新失败:', error)
    }
  }

  // 删除人员
  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id)
      message.success('删除成功')
      loadUsers(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('删除失败:', error)
    }
  }

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的人员')
      return
    }
    try {
      for (const id of selectedRowKeys) {
        await deleteUser(id as number)
      }
      message.success('删除成功')
      setSelectedRowKeys([])
      loadUsers(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('删除失败:', error)
    }
  }

  // 设置角色
  const openRoleModal = (user: UserInfo) => {
    setEditingUser(user)
    roleForm.setFieldsValue({ role: user.role })
    setRoleModalVisible(true)
  }

  const handleSetRole = async () => {
    if (!editingUser) return
    try {
      const values = await roleForm.validateFields()
      await setUserRole(editingUser.id, values.role)
      message.success('设置成功')
      setRoleModalVisible(false)
      setEditingUser(null)
      loadUsers(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('设置角色失败:', error)
    }
  }

  // 重置密码
  const handleResetPassword = async (id: number) => {
    try {
      await resetUserPassword(id)
      message.success('密码已重置为 123456')
    } catch (error) {
      console.error('重置密码失败:', error)
    }
  }

  // 上传头像
  const openAvatarModal = (user: UserInfo) => {
    setEditingUser(user)
    setAvatarModalVisible(true)
  }

  const handleAvatarUpload: UploadProps['customRequest'] = async (options) => {
    if (!editingUser) return
    const { file, onSuccess, onError } = options
    const formData = new FormData()
    formData.append('file', file as File)

    try {
      // 模拟上传成功
      message.success('头像上传成功')
      onSuccess?.({})
      setAvatarModalVisible(false)
      loadUsers(pagination.current, pagination.pageSize)
    } catch (error) {
      onError?.(error as Error)
      message.error('上传失败')
    }
  }

  // 表格列
  const columns: ColumnsType<UserInfo> = [
    {
      title: '序号',
      key: 'index',
      width: 60,
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 80,
      render: (avatar) => (
        <Avatar src={avatar} icon={<UserOutlined />} />
      ),
    },
    {
      title: '姓名',
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
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: 100,
      render: (role) => {
        const roleMap: Record<string, { text: string; color: string }> = {
          admin: { text: '管理员', color: 'red' },
          manager: { text: '部门经理', color: 'blue' },
          user: { text: '普通用户', color: 'default' },
        }
        const info = roleMap[role] || { text: role || '普通用户', color: 'default' }
        return <Tag color={info.color}>{info.text}</Tag>
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status) => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="编辑">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => openEditModal(record)}
            />
          </Tooltip>
          <Tooltip title="设置角色">
            <Button
              type="text"
              size="small"
              icon={<TeamOutlined />}
              onClick={() => openRoleModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="确认重置密码"
            description="确定要重置该用户的密码为 123456 吗？"
            onConfirm={() => handleResetPassword(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="重置密码">
              <Button type="text" size="small" icon={<KeyOutlined />} />
            </Tooltip>
          </Popconfirm>
          <Tooltip title="上传头像">
            <Button
              type="text"
              size="small"
              icon={<UploadOutlined />}
              onClick={() => openAvatarModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="确认删除"
            description="确定要删除该用户吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="删除">
              <Button type="text" size="small" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Card>
      {/* 搜索栏 */}
      <div style={{ marginBottom: 16 }}>
        <Space>
          <span>人员名称/手机号：</span>
          <Input
            placeholder="请输入"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            style={{ width: 200 }}
          />
          <Button type="primary" icon={<SearchOutlined />}>
            查询
          </Button>
        </Space>
      </div>

      {/* 操作按钮 */}
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            新建人员
          </Button>
          <Popconfirm
            title="确认删除"
            description="确定要删除选中的人员吗？"
            onConfirm={handleBatchDelete}
            okText="确定"
            cancelText="取消"
          >
            <Button danger icon={<DeleteOutlined />}>
              批量删除
            </Button>
          </Popconfirm>
        </Space>
      </div>

      {/* 人员表格 */}
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
        }}
        size="small"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
        onChange={handleTableChange}
      />

      {/* 新建人员弹窗 */}
      <Modal
        title="新建人员"
        open={createModalVisible}
        onOk={handleCreate}
        onCancel={() => {
          setCreateModalVisible(false)
          createForm.resetFields()
        }}
        width={500}
      >
        <Form form={createForm} layout="vertical">
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="手机号"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1\d{10}$/, message: '请输入正确的手机号' },
            ]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item
            name="password"
            label="初始密码"
            rules={[{ required: true, message: '请输入初始密码' }]}
            initialValue="123456"
          >
            <Input.Password placeholder="请输入初始密码" />
          </Form.Item>
          <Form.Item name="gender" label="性别" initialValue="男">
            <Select
              options={[
                { label: '男', value: '男' },
                { label: '女', value: '女' },
              ]}
            />
          </Form.Item>
          <Form.Item name="email" label="邮箱">
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item name="role" label="角色" initialValue="user">
            <Select
              options={[
                { label: '管理员', value: 'admin' },
                { label: '部门经理', value: 'manager' },
                { label: '普通用户', value: 'user' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑人员弹窗 */}
      <Modal
        title="编辑人员"
        open={editModalVisible}
        onOk={handleEdit}
        onCancel={() => {
          setEditModalVisible(false)
          setEditingUser(null)
        }}
        width={500}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item name="gender" label="性别">
            <Select
              options={[
                { label: '男', value: '男' },
                { label: '女', value: '女' },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="phone"
            label="手机号"
            rules={[
              { pattern: /^1\d{10}$/, message: '请输入正确的手机号' },
            ]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item name="email" label="邮箱">
            <Input placeholder="请输入邮箱" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 设置角色弹窗 */}
      <Modal
        title="设置角色"
        open={roleModalVisible}
        onOk={handleSetRole}
        onCancel={() => {
          setRoleModalVisible(false)
          setEditingUser(null)
        }}
        width={400}
      >
        <Form form={roleForm} layout="vertical">
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select
              options={[
                { label: '管理员', value: 'admin' },
                { label: '部门经理', value: 'manager' },
                { label: '普通用户', value: 'user' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 上传头像弹窗 */}
      <Modal
        title="上传头像"
        open={avatarModalVisible}
        onCancel={() => {
          setAvatarModalVisible(false)
          setEditingUser(null)
        }}
        footer={null}
        width={400}
      >
        <div style={{ textAlign: 'center' }}>
          <Avatar
            size={100}
            src={editingUser?.avatar}
            icon={<UserOutlined />}
            style={{ marginBottom: 16 }}
          />
          <Upload
            accept="image/*"
            showUploadList={false}
            customRequest={handleAvatarUpload}
          >
            <Button icon={<UploadOutlined />}>选择图片上传</Button>
          </Upload>
        </div>
      </Modal>
    </Card>
  )
}

export default Personnel
