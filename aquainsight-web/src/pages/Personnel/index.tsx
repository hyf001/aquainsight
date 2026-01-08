import React, { useState, useEffect } from 'react'
import {
  UserIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  KeyIcon,
  UserPlusIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline'
import { useForm } from 'react-hook-form'
import {
  Card,
  CardBody,
  Button,
  Input,
  Password,
  Table,
  type TableColumn,
  Modal,
  Form,
  FormField,
  Select,
  type SelectOption,
  Tag,
  Popconfirm,
  Avatar,
  Tooltip,
  Pagination,
} from '@/components/ui'
import {
  getUserList,
  createUser,
  updateUser,
  deleteUser,
  setUserRole,
  resetUserPassword,
} from '@/services/organization'
import type { UserInfo } from '@/services/organization'
import { toast } from '@/utils/toast'

const Personnel: React.FC = () => {
  const [users, setUsers] = useState<UserInfo[]>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
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
  const [uploadLoading, setUploadLoading] = useState(false)

  // 表单实例
  const createForm = useForm()
  const editForm = useForm()
  const roleForm = useForm()

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
      toast.error('加载用户列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  // 处理分页变化
  const handlePageChange = (page: number, pageSize: number) => {
    loadUsers(page, pageSize)
  }

  // 搜索过滤
  const filteredUsers = users.filter((user) => {
    if (!searchText) return true
    return (
      user.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.phone?.includes(searchText)
    )
  })

  // 创建人员
  const handleCreate = async (values: any) => {
    try {
      await createUser(values)
      toast.success('创建成功')
      setCreateModalVisible(false)
      createForm.reset()
      loadUsers(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('创建失败:', error)
      toast.error('创建失败')
    }
  }

  // 编辑人员
  const openEditModal = (user: UserInfo) => {
    setEditingUser(user)
    editForm.reset({
      name: user.name,
      gender: user.gender,
      phone: user.phone,
      email: user.email,
    })
    setEditModalVisible(true)
  }

  const handleEdit = async (values: any) => {
    if (!editingUser) return
    try {
      await updateUser(editingUser.id, values)
      toast.success('更新成功')
      setEditModalVisible(false)
      setEditingUser(null)
      loadUsers(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('更新失败:', error)
      toast.error('更新失败')
    }
  }

  // 删除人员
  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id)
      toast.success('删除成功')
      loadUsers(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('删除失败:', error)
      toast.error('删除失败')
    }
  }

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      toast.warning('请选择要删除的人员')
      return
    }
    try {
      for (const id of selectedRowKeys) {
        await deleteUser(id as number)
      }
      toast.success(`成功删除 ${selectedRowKeys.length} 条记录`)
      setSelectedRowKeys([])
      loadUsers(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('删除失败:', error)
      toast.error('删除失败')
    }
  }

  // 设置角色
  const openRoleModal = (user: UserInfo) => {
    setEditingUser(user)
    roleForm.reset({ role: user.role })
    setRoleModalVisible(true)
  }

  const handleSetRole = async (values: any) => {
    if (!editingUser) return
    try {
      await setUserRole(editingUser.id, values.role)
      toast.success('设置成功')
      setRoleModalVisible(false)
      setEditingUser(null)
      loadUsers(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('设置角色失败:', error)
      toast.error('设置角色失败')
    }
  }

  // 重置密码
  const handleResetPassword = async (id: number) => {
    try {
      await resetUserPassword(id)
      toast.success('密码已重置为 123456')
    } catch (error) {
      console.error('重置密码失败:', error)
      toast.error('重置密码失败')
    }
  }

  // 上传头像
  const openAvatarModal = (user: UserInfo) => {
    setEditingUser(user)
    setAvatarModalVisible(true)
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingUser) return
    const file = e.target.files?.[0]
    if (!file) return

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      toast.error('请选择图片文件')
      return
    }

    // 验证文件大小 (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('图片大小不能超过 2MB')
      return
    }

    setUploadLoading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      // 模拟上传成功
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success('头像上传成功')
      setAvatarModalVisible(false)
      loadUsers(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('上传失败:', error)
      toast.error('上传失败')
    } finally {
      setUploadLoading(false)
    }
  }

  // 角色选项
  const roleOptions: SelectOption[] = [
    { label: '管理员', value: 'admin' },
    { label: '部门经理', value: 'manager' },
    { label: '普通用户', value: 'user' },
  ]

  // 性别选项
  const genderOptions: SelectOption[] = [
    { label: '男', value: '男' },
    { label: '女', value: '女' },
  ]

  // 表格列
  const columns: TableColumn<UserInfo>[] = [
    {
      title: '序号',
      key: 'index',
      width: '60px',
      render: (_, __, index) => (
        <span className="text-sm text-gray-600">
          {(pagination.current - 1) * pagination.pageSize + index + 1}
        </span>
      ),
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar',
      width: '80px',
      render: (avatar) => (
        <Avatar
          src={avatar as string}
          icon={<UserIcon className="w-5 h-5" />}
          size="md"
        />
      ),
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (name) => <span className="font-medium text-gray-900">{name as string}</span>,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      width: '80px',
      render: (gender) => <span className="text-sm text-gray-600">{gender as string}</span>,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone) => <span className="text-sm text-gray-600">{phone as string}</span>,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      render: (email) => <span className="text-sm text-gray-600">{email as string}</span>,
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: '100px',
      render: (role) => {
        const roleMap: Record<string, { text: string; color: 'error' | 'primary' | 'default' }> =
          {
            admin: { text: '管理员', color: 'error' },
            manager: { text: '部门经理', color: 'primary' },
            user: { text: '普通用户', color: 'default' },
          }
        const info = roleMap[role as string] || { text: '普通用户', color: 'default' as const }
        return <Tag color={info.color}>{info.text}</Tag>
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: '80px',
      render: (status) => (
        <Tag color={status === 1 ? 'success' : 'error'}>
          {status === 1 ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: '200px',
      render: (_, record) => (
        <div className="flex items-center gap-1">
          <Tooltip title="编辑">
            <Button
              variant="ghost"
              size="sm"
              icon={<PencilIcon className="w-4 h-4" />}
              onClick={() => openEditModal(record)}
            />
          </Tooltip>
          <Tooltip title="设置角色">
            <Button
              variant="ghost"
              size="sm"
              icon={<UserPlusIcon className="w-4 h-4" />}
              onClick={() => openRoleModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="确认重置密码"
            description="确定要重置该用户的密码为 123456 吗？"
            onConfirm={() => handleResetPassword(record.id)}
            okType="primary"
          >
            <Tooltip title="重置密码">
              <Button variant="ghost" size="sm" icon={<KeyIcon className="w-4 h-4" />} />
            </Tooltip>
          </Popconfirm>
          <Tooltip title="上传头像">
            <Button
              variant="ghost"
              size="sm"
              icon={<PhotoIcon className="w-4 h-4" />}
              onClick={() => openAvatarModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="确认删除"
            description="确定要删除该用户吗？"
            onConfirm={() => handleDelete(record.id)}
            okType="danger"
          >
            <Tooltip title="删除">
              <Button
                variant="ghost"
                size="sm"
                icon={<TrashIcon className="w-4 h-4 text-red-500" />}
              />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardBody>
          {/* 搜索栏 */}
          <div className="mb-6 flex items-center gap-4">
            <span className="text-sm text-gray-600 whitespace-nowrap">人员名称/手机号：</span>
            <Input
              placeholder="请输入人员名称或手机号"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadUsers(1, pagination.pageSize)}
              prefix={<MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />}
              className="w-64"
            />
            <Button
              variant="primary"
              icon={<MagnifyingGlassIcon className="w-4 h-4" />}
              onClick={() => loadUsers(1, pagination.pageSize)}
            >
              查询
            </Button>
          </div>

          {/* 操作按钮 */}
          <div className="mb-6 flex items-center gap-3">
            <Button
              variant="primary"
              icon={<PlusIcon className="w-4 h-4" />}
              onClick={() => setCreateModalVisible(true)}
            >
              新建人员
            </Button>
            <Popconfirm
              title="确认删除"
              description={`确定要删除选中的 ${selectedRowKeys.length} 条记录吗？`}
              onConfirm={handleBatchDelete}
              okType="danger"
            >
              <Button
                variant="danger"
                icon={<TrashIcon className="w-4 h-4" />}
                disabled={selectedRowKeys.length === 0}
              >
                批量删除 {selectedRowKeys.length > 0 && `(${selectedRowKeys.length})`}
              </Button>
            </Popconfirm>
          </div>

          {/* 人员表格 */}
          <Table
            columns={columns}
            dataSource={filteredUsers}
            rowKey="id"
            loading={loading}
            rowSelection={{
              selectedRowKeys,
              onChange: (keys) => setSelectedRowKeys(keys),
            }}
            size="middle"
          />

          {/* 分页 */}
          <div className="mt-4 flex justify-end">
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={handlePageChange}
              showSizeChanger
              showTotal
            />
          </div>
        </CardBody>
      </Card>

      {/* 新建人员弹窗 */}
      <Modal
        open={createModalVisible}
        onClose={() => {
          setCreateModalVisible(false)
          createForm.reset()
        }}
        title="新建人员"
        width={520}
      >
        <Form form={createForm} onSubmit={handleCreate}>
          <div className="space-y-4">
            <FormField
              name="name"
              label="姓名"
              required
              rules={{ required: '请输入姓名' }}
            >
              {({ field }) => (
                <Input {...field} placeholder="请输入姓名" />
              )}
            </FormField>

            <FormField
              name="phone"
              label="手机号"
              required
              rules={{
                required: '请输入手机号',
                pattern: {
                  value: /^1\d{10}$/,
                  message: '请输入正确的手机号',
                },
              }}
            >
              {({ field }) => (
                <Input {...field} placeholder="请输入手机号" />
              )}
            </FormField>

            <FormField
              name="password"
              label="初始密码"
              required
              rules={{ required: '请输入初始密码' }}
            >
              {({ field }) => (
                <Password {...field} placeholder="请输入初始密码" />
              )}
            </FormField>

            <FormField name="gender" label="性别">
              {({ field }) => (
                <Select
                  {...field}
                  options={genderOptions}
                  placeholder="请选择性别"
                />
              )}
            </FormField>

            <FormField
              name="email"
              label="邮箱"
              rules={{
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: '请输入正确的邮箱地址',
                },
              }}
            >
              {({ field }) => (
                <Input {...field} placeholder="请输入邮箱" />
              )}
            </FormField>

            <FormField name="role" label="角色">
              {({ field }) => (
                <Select
                  {...field}
                  options={roleOptions}
                  placeholder="请选择角色"
                />
              )}
            </FormField>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setCreateModalVisible(false)
                createForm.reset()
              }}
            >
              取消
            </Button>
            <Button type="submit" variant="primary">
              确定
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 编辑人员弹窗 */}
      <Modal
        open={editModalVisible}
        onClose={() => {
          setEditModalVisible(false)
          setEditingUser(null)
        }}
        title="编辑人员"
        width={520}
      >
        <Form form={editForm} onSubmit={handleEdit}>
          <div className="space-y-4">
            <FormField
              name="name"
              label="姓名"
              required
              rules={{ required: '请输入姓名' }}
            >
              {({ field }) => (
                <Input {...field} placeholder="请输入姓名" />
              )}
            </FormField>

            <FormField name="gender" label="性别">
              {({ field }) => (
                <Select
                  {...field}
                  options={genderOptions}
                  placeholder="请选择性别"
                />
              )}
            </FormField>

            <FormField
              name="phone"
              label="手机号"
              rules={{
                pattern: {
                  value: /^1\d{10}$/,
                  message: '请输入正确的手机号',
                },
              }}
            >
              {({ field }) => (
                <Input {...field} placeholder="请输入手机号" />
              )}
            </FormField>

            <FormField
              name="email"
              label="邮箱"
              rules={{
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: '请输入正确的邮箱地址',
                },
              }}
            >
              {({ field }) => (
                <Input {...field} placeholder="请输入邮箱" />
              )}
            </FormField>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setEditModalVisible(false)
                setEditingUser(null)
              }}
            >
              取消
            </Button>
            <Button type="submit" variant="primary">
              确定
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 设置角色弹窗 */}
      <Modal
        open={roleModalVisible}
        onClose={() => {
          setRoleModalVisible(false)
          setEditingUser(null)
        }}
        title="设置角色"
        width={420}
      >
        <Form form={roleForm} onSubmit={handleSetRole}>
          <div className="space-y-4">
            <FormField
              name="role"
              label="角色"
              required
              rules={{ required: '请选择角色' }}
            >
              {({ field }) => (
                <Select
                  {...field}
                  options={roleOptions}
                  placeholder="请选择角色"
                />
              )}
            </FormField>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setRoleModalVisible(false)
                setEditingUser(null)
              }}
            >
              取消
            </Button>
            <Button type="submit" variant="primary">
              确定
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 上传头像弹窗 */}
      <Modal
        open={avatarModalVisible}
        onClose={() => {
          setAvatarModalVisible(false)
          setEditingUser(null)
        }}
        title="上传头像"
        width={420}
      >
        <div className="flex flex-col items-center gap-6 py-4">
          <Avatar
            src={editingUser?.avatar}
            icon={<UserIcon className="w-12 h-12" />}
            size="xl"
            className="shadow-lg"
          />

          <div className="text-center">
            <label
              htmlFor="avatar-upload"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-ocean-teal rounded-lg hover:bg-ocean-teal/90 transition-colors cursor-pointer"
            >
              <PhotoIcon className="w-5 h-5" />
              {uploadLoading ? '上传中...' : '选择图片上传'}
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
              disabled={uploadLoading}
            />
            <p className="mt-2 text-xs text-gray-500">
              支持 JPG、PNG 格式，大小不超过 2MB
            </p>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Personnel
