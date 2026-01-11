import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, MapPin, Upload, X, Check, Eye } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { cn } from '@/utils/cn'
import { siteApi, type SiteVO, type CreateSiteRequest, type UpdateSiteRequest } from '@/services/monitoring'
import { enterpriseApi, type EnterpriseVO } from '@/services/enterprise'
import { SiteMapModal } from '@/components/SiteMapModal'

const siteTypes = [
  { value: '污水', label: '污水' },
  { value: '雨水', label: '雨水' },
  { value: '水质', label: '水质' },
  { value: '大气', label: '大气' },
  { value: '土壤', label: '土壤' },
]

export default function SiteManagement() {
  const [sites, setSites] = useState<SiteVO[]>([])
  const [enterprises, setEnterprises] = useState<EnterpriseVO[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10, total: 0 })
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'create' | 'edit'>('create')
  const [editingSite, setEditingSite] = useState<SiteVO | null>(null)
  const [showMapModal, setShowMapModal] = useState(false)
  const [mapSite, setMapSite] = useState<SiteVO | null>(null)
  const [filters, setFilters] = useState({
    enterpriseId: '',
    siteName: '',
    siteType: '',
  })
  const [formData, setFormData] = useState<CreateSiteRequest>({
    siteCode: '',
    siteName: '',
    siteType: '污水',
    siteTag: '',
    longitude: '',
    latitude: '',
    address: '',
    enterpriseId: undefined,
    isAutoUpload: false,
  })

  // 获取站点列表
  const fetchSites = async () => {
    setLoading(true)
    try {
      const res = await siteApi.getSites({
        pageNum: pagination.pageNum,
        pageSize: pagination.pageSize,
        siteType: filters.siteType || undefined,
        enterpriseId: filters.enterpriseId ? parseInt(filters.enterpriseId) : undefined,
        name: filters.siteName || undefined,
      })
      setSites(res.list || [])
      setPagination(prev => ({ ...prev, total: res.total || 0 }))
    } catch (error) {
      console.error('获取站点列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 获取企业列表
  const fetchEnterprises = async () => {
    try {
      const res = await enterpriseApi.getAll()
      setEnterprises(res || [])
    } catch (error) {
      console.error('获取企业列表失败:', error)
    }
  }

  // 筛选变化时只更新筛选条件，不重置页码
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  // 检索：重置页码并获取数据
  const handleSearch = () => {
    setPagination(prev => ({ ...prev, pageNum: 1 }))
    fetchSites()
  }

  useEffect(() => {
    fetchSites()
    fetchEnterprises()
  }, [pagination.pageNum, pagination.pageSize])

  const getSiteTypeColor = (type: string) => {
    switch (type) {
      case '污水':
        return 'bg-ocean-100 text-ocean-700'
      case '雨水':
        return 'bg-aqua-100 text-aqua-700'
      case '水质':
        return 'bg-nature-100 text-nature-700'
      case '大气':
        return 'bg-sky-100 text-sky-700'
      case '土壤':
        return 'bg-amber-100 text-amber-700'
      default:
        return 'bg-clean-100 text-clean-700'
    }
  }

  const handleOpenModal = (type: 'create' | 'edit', site?: SiteVO) => {
    setModalType(type)
    if (type === 'edit' && site) {
      setEditingSite(site)
      setFormData({
        siteCode: site.siteCode,
        siteName: site.siteName,
        siteType: site.siteType,
        siteTag: site.siteTag || '',
        longitude: site.longitude || '',
        latitude: site.latitude || '',
        address: site.address || '',
        enterpriseId: site.enterpriseId,
        isAutoUpload: site.isAutoUpload,
      })
    } else {
      setEditingSite(null)
      setFormData({
        siteCode: '',
        siteName: '',
        siteType: '污水',
        siteTag: '',
        longitude: '',
        latitude: '',
        address: '',
        enterpriseId: undefined,
        isAutoUpload: false,
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingSite(null)
  }

  const handleSubmit = async () => {
    try {
      if (modalType === 'create') {
        await siteApi.createSite(formData)
      } else if (editingSite) {
        const updateData: UpdateSiteRequest = {
          siteName: formData.siteName,
          siteType: formData.siteType,
          siteTag: formData.siteTag,
          longitude: formData.longitude,
          latitude: formData.latitude,
          address: formData.address,
          enterpriseId: formData.enterpriseId,
          isAutoUpload: formData.isAutoUpload,
        }
        await siteApi.updateSite(editingSite.id, updateData)
      }
      handleCloseModal()
      fetchSites()
    } catch (error) {
      console.error('保存站点失败:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('确定要删除该站点吗？')) {
      try {
        await siteApi.deleteSite(id)
        fetchSites()
      } catch (error) {
        console.error('删除站点失败:', error)
      }
    }
  }

  const handleViewMap = (site: SiteVO) => {
    setMapSite(site)
    setShowMapModal(true)
  }

  const handleCloseMap = () => {
    setShowMapModal(false)
    setMapSite(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-clean-900">站点管理</h1>
          <p className="text-clean-500 mt-1">管理监测站点信息和配置</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => handleOpenModal('create')}>
          <Plus className="w-4 h-4" />
          新增站点
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="py-4">
          <div className="grid grid-cols-5 gap-4">
            <Input
              placeholder="站点名称"
              value={filters.siteName}
              onChange={(e) => handleFilterChange('siteName', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Select
              value={filters.enterpriseId}
              onChange={(e) => handleFilterChange('enterpriseId', e.target.value)}
              options={[
                { value: '', label: '全部企业' },
                ...enterprises.map(e => ({ value: e.id.toString(), label: e.enterpriseName })),
              ]}
            />
            <Select
              value={filters.siteType}
              onChange={(e) => handleFilterChange('siteType', e.target.value)}
              options={[
                { value: '', label: '全部类型' },
                ...siteTypes,
              ]}
            />
            <div className="flex gap-2">
              <Button variant="secondary" className="flex-1" onClick={() => {
                setFilters({ enterpriseId: '', siteName: '', siteType: '' })
                handleSearch()
              }}>
                重置
              </Button>
              <Button className="flex-1" onClick={handleSearch}>
                <Search className="w-4 h-4 mr-2" />
                搜索
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sites Grid */}
      {loading ? (
        <Card className="p-12 text-center">
          <div className="w-8 h-8 border-2 border-nature-200 border-t-nature-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-clean-500">加载中...</p>
        </Card>
      ) : sites.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sites.map((site, index) => (
            <motion.div
              key={site.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-soft-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-nature-100 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-nature-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-clean-900">{site.siteName}</h3>
                      <p className="text-sm text-clean-500">{site.siteCode}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'px-3 py-1 rounded-full text-xs font-medium',
                      getSiteTypeColor(site.siteType)
                    )}>
                      {site.siteType}
                    </span>
                    {site.isAutoUpload && (
                      <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600" title="自动上传">
                        <Upload className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-clean-500">站点标签</p>
                    <p className="text-sm text-clean-700 font-medium mt-1">{site.siteTag || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-clean-500">所属企业</p>
                    <p className="text-sm text-clean-700 font-medium mt-1">{site.enterpriseName || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-clean-500">地址</p>
                    <p className="text-sm text-clean-600 mt-1">{site.address || '-'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-clean-500">经度</p>
                      <p className="text-sm text-clean-700 font-mono mt-1">{site.longitude ? `${site.longitude}°` : '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-clean-500">纬度</p>
                      <p className="text-sm text-clean-700 font-mono mt-1">{site.latitude ? `${site.latitude}°` : '-'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-6 pt-4 border-t border-clean-100">
                  <Button variant="outline" size="sm" className="flex-1 flex items-center justify-center gap-2" onClick={() => handleViewMap(site)}>
                    <Eye className="w-3 h-3" />
                    查看
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 flex items-center justify-center gap-2" onClick={() => handleOpenModal('edit', site)}>
                    <Edit2 className="w-3 h-3" />
                    编辑
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center justify-center gap-2 text-red-500 hover:text-red-600 hover:border-red-500" onClick={() => site.id && handleDelete(site.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-clean-500">未找到匹配的站点</p>
        </Card>
      )}

      {/* Pagination */}
      {pagination.total > 0 && (
        <div className="flex items-center justify-between px-4 py-3 bg-clean-50 border border-clean-200 rounded-xl">
          <span className="text-sm text-clean-500">
            共 <span className="text-clean-900">{pagination.total}</span> 条记录
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.pageNum === 1}
              onClick={() => setPagination(prev => ({ ...prev, pageNum: prev.pageNum - 1 }))}
            >
              上一页
            </Button>
            <span className="text-sm text-clean-900 px-2">
              {pagination.pageNum} / {Math.ceil(pagination.total / pagination.pageSize)}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.pageNum >= Math.ceil(pagination.total / pagination.pageSize)}
              onClick={() => setPagination(prev => ({ ...prev, pageNum: prev.pageNum + 1 }))}
            >
              下一页
            </Button>
          </div>
        </div>
      )}

      {/* Map Modal */}
      {showMapModal && mapSite && (
        <SiteMapModal
          siteName={mapSite.siteName}
          longitude={mapSite.longitude || ''}
          latitude={mapSite.latitude || ''}
          address={mapSite.address || ''}
          onClose={handleCloseMap}
        />
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-clean-200 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-clean-100">
              <h2 className="text-xl font-semibold text-clean-900">
                {modalType === 'create' ? '新增站点' : '编辑站点'}
              </h2>
              <button onClick={handleCloseModal} className="p-2 rounded-lg text-clean-400 hover:text-clean-900 hover:bg-clean-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="站点编码"
                  value={formData.siteCode}
                  onChange={(e) => setFormData({ ...formData, siteCode: e.target.value })}
                  placeholder="请输入站点编码"
                />
                <Input
                  label="站点名称"
                  value={formData.siteName}
                  onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                  placeholder="请输入站点名称"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="站点类型"
                  value={formData.siteType}
                  onChange={(e) => setFormData({ ...formData, siteType: e.target.value })}
                  options={siteTypes}
                />
                <Select
                  label="站点标签"
                  value={formData.siteTag}
                  onChange={(e) => setFormData({ ...formData, siteTag: e.target.value })}
                  options={[
                    { value: '国控', label: '国控' },
                    { value: '非国控', label: '非国控' },
                  ]}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="经度"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  placeholder="请输入经度"
                />
                <Input
                  label="纬度"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  placeholder="请输入纬度"
                />
              </div>
              <Input
                label="地址"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="请输入地址"
              />
              <Select
                label="所属企业"
                value={formData.enterpriseId?.toString() || ''}
                onChange={(e) => setFormData({ ...formData, enterpriseId: e.target.value ? parseInt(e.target.value) : undefined })}
                options={[{ value: '', label: '请选择企业' }, ...enterprises.map(e => ({ value: e.id.toString(), label: e.enterpriseName }))]}
              />
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isAutoUpload}
                  onChange={(e) => setFormData({ ...formData, isAutoUpload: e.target.checked })}
                  className="w-5 h-5 rounded border-clean-300 bg-white text-nature-500 focus:ring-nature-500"
                />
                <span className="text-clean-700">自动上传</span>
              </label>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-clean-100">
              <Button variant="outline" onClick={handleCloseModal}>
                取消
              </Button>
              <Button onClick={handleSubmit} className="flex items-center gap-2">
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
