import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { X } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// 修复 Leaflet 图标问题
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

interface SiteMapModalProps {
  siteName: string
  longitude: string
  latitude: string
  address: string
  onClose: () => void
}

export function SiteMapModal({ siteName, longitude, latitude, address, onClose }: SiteMapModalProps) {
  const lng = parseFloat(longitude)
  const lat = parseFloat(latitude)

  if (isNaN(lng) || isNaN(lat)) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">{siteName} - 位置信息</h3>
            <button onClick={onClose} className="p-2 hover:bg-clean-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-8 text-center text-clean-500">
            暂无位置信息
          </div>
        </div>
      </div>
    )
  }

  const position: [number, number] = [lat, lng]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="text-lg font-semibold">{siteName}</h3>
            <p className="text-sm text-clean-500">{address || '暂无地址信息'}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-clean-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="h-96">
          <MapContainer
            center={position}
            zoom={15}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.amap.com/">高德地图</a>'
              url="https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}"
              subdomains={['1', '2', '3', '4']}
            />
            <Marker position={position}>
              <Popup>
                <div className="text-center">
                  <strong>{siteName}</strong>
                  <br />
                  经度: {longitude}°, 纬度: {latitude}°
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
        <div className="p-4 bg-clean-50 text-sm text-clean-600">
          坐标: {longitude}°, {latitude}°
        </div>
      </div>
    </div>
  )
}
