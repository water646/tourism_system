<template>
  <div class="wayplan-container">
    <!-- 搜索面板 -->
    <div class="search-panel">
      <div class="search-item">
        <div class="icon">📍</div>
        <input v-model="startAddress" type="text" placeholder="输入出发地" class="search-input"
          @keyup.enter="handleStartSearch" />
        <button v-if="startAddress && !startPoint" class="locate-btn" @click="handleStartSearch">定位</button>
      </div>
      <div class="search-item">
        <div class="icon">🎯</div>
        <input v-model="endAddress" type="text" placeholder="输入目的地" class="search-input" @keyup.enter="handleSearch"
          @input="handleEndInput" @focus="showSuggestions = true" />
        <div v-if="searchSuggestions.length > 0 && showSuggestions" class="suggestions-list">
          <div v-for="item in searchSuggestions" :key="item.id" class="suggestion-item" @click="selectEndPoint(item)">
            <div class="suggestion-name">{{ item.name }}</div>
            <div class="suggestion-address">{{ item.address }}</div>
          </div>
        </div>
      </div>

      <div class="route-type">
        <button v-for="type in routeTypes" :key="type.value"
          :class="['route-type-btn', { active: currentRouteType === type.value }]" @click="switchRouteType(type.value)">
          {{ type.label }}
        </button>
      </div>

      <div class="button-group">
        <button class="search-btn" @click="handleSearch">搜索路线</button>
        <button class="clear-btn" @click="handleClear">清除</button>
      </div>
    </div>

    <div id="map" ref="mapContainer"></div>

    <div v-if="routeInfo" class="route-info">
      <div class="info-item">
        <span>{{ getRouteIcon(currentRouteType) }} 距离：{{ routeInfo.distance }}</span>
      </div>
      <div class="info-item">
        <span>⏱️ 时间：{{ routeInfo.duration }}</span>
      </div>
      <div v-if="routeInfo.cost" class="info-item">
        <span>💰 费用：{{ routeInfo.cost }}</span>
      </div>
    </div>

    <div v-if="pathList.length > 0" class="route-steps">
      <div class="steps-header">
        {{ getRouteTypeName(currentRouteType) }}路线详情
        <button class="close-steps" @click="pathList = []">✕</button>
      </div>
      <div class="steps-list">
        <div v-for="(path, index) in pathList" :key="index" class="path-item">
          <div class="path-title" @click="togglePath(index)">
            <span>方案 {{ index + 1 }}：{{ formatDistance(path.distance) }}，约{{ formatDuration(path.duration) }}</span>
            <span class="toggle-icon">{{ expandedPath === index ? '▼' : '▶' }}</span>
          </div>
          <div v-show="expandedPath === index" class="steps-container">
            <div v-if="currentRouteType === 'transit' && path.cost" class="transit-summary">
              步行{{ formatDistance(path.walking_distance) }}，票价{{ path.cost }}元
            </div>
            <div v-for="(step, stepIndex) in path.steps" :key="stepIndex" class="step-item">
              <div class="step-icon">{{ getStepIcon(step) }}</div>
              <div class="step-content">
                <div class="step-instruction">{{ step.instruction }}</div>
                <div v-if="step.road" class="step-road">{{ step.road }}</div>
                <div v-if="step.distance" class="step-distance">{{ formatDistance(step.distance) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner">{{ loadingText }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()

const startAddress = ref('')
const endAddress = ref('')
const currentRouteType = ref('driving')
const routeInfo = ref(null)
const mapContainer = ref(null)
const isLoading = ref(false)
const loadingText = ref('规划路线中...')
const searchSuggestions = ref([])
const showSuggestions = ref(false)
const startPoint = ref(null)
const endPoint = ref(null)
const isMapReady = ref(false)
const pathList = ref([])
const expandedPath = ref(0)

let map = null
let geocoder = null
let currentPolyline = null
let placeSearch = null
let searchTimer = null

const JS_API_KEY = 'cc1dd9bc16c042b9a19b0f3d56587e41'
const WEB_SERVICE_KEY = '3b4596159ce765412ef81c8f5ec50833'

const routeTypes = [
  { label: '🚗 驾车', value: 'driving' },
  { label: '🚌 公交', value: 'transit' },
  { label: '🚶 步行', value: 'walking' },
  { label: '🚲 骑行', value: 'bicycling' }
]

const getRouteTypeName = (type) => {
  const names = { driving: '驾车', transit: '公交', walking: '步行', bicycling: '骑行' }
  return names[type] || type
}

const getRouteIcon = (type) => {
  const icons = { driving: '🚗', transit: '🚌', walking: '🚶', bicycling: '🚲' }
  return icons[type] || '🚗'
}

const formatDistance = (distance) => {
  if (!distance) return '0米'
  const d = parseInt(distance)
  if (d >= 1000) return (d / 1000).toFixed(1) + '公里'
  return d + '米'
}

const formatDuration = (duration) => {
  if (!duration) return '0分钟'
  const d = parseInt(duration)
  if (d >= 60) {
    const hours = Math.floor(d / 60)
    const minutes = d % 60
    return hours + '小时' + (minutes > 0 ? minutes + '分钟' : '')
  }
  return d + '分钟'
}

const togglePath = (index) => {
  expandedPath.value = expandedPath.value === index ? -1 : index
}

const getStepIcon = (step) => {
  if (currentRouteType.value === 'transit') {
    if (step.bus) return '🚌'
    if (step.railway) return '🚆'
    if (step.subway) return '🚇'
    return '🚶'
  }
  return '📍'
}

// 修正后的预设位置坐标（经度, 纬度）
const presetLocations = {
  // 大理周边
  '洱海': [100.23685, 25.63432],
  '大理': [100.22567, 25.60648],
  '大理古城': [100.16251, 25.68983],
  '双廊': [100.24567, 25.95345],
  '喜洲': [100.11234, 25.85678],
  '下关': [100.21802, 25.58862],
  '大理火车站': [100.25044, 25.59194],
  '大理机场': [100.31833, 25.65167],
  '崇圣寺三塔': [100.14578, 25.70473],
  '天龙八部影视城': [100.17695, 25.69482],
  '蝴蝶泉': [100.08565, 25.90241],
  '小普陀': [100.27345, 25.72345],
  '南诏风情岛': [100.25678, 25.89123],
  '挖色': [100.27654, 25.82345],
  '海东': [100.31567, 25.68456],
  '老太庙': [100.24831, 25.72229],

  // 丽江周边 - 修正坐标
  '玉龙雪山': [100.23682, 27.03547],
  '丽江古城': [100.23706, 26.87211],
  '束河古镇': [100.20731, 26.92547],
  '白沙古镇': [100.21856, 26.96234],
  '拉市海': [100.14723, 26.87234],
  '虎跳峡': [100.12845, 27.19823],

  // 香格里拉周边
  '香格里拉': [99.70623, 27.82567],
  '普达措': [99.98734, 27.82345],
  '松赞林寺': [99.70345, 27.86523],
  '梅里雪山': [98.68345, 28.43712],

  // 其他热门景点
  '泸沽湖': [100.79934, 27.68823],
  '沙溪古镇': [99.85234, 26.31567],
  '诺邓古村': [99.37845, 25.92734],
  '巍山古城': [100.30723, 25.22789],
  '鸡足山': [100.39712, 25.95567]
}

// 验证坐标是否有效
const isValidCoordinate = (coord) => {
  if (!coord || !Array.isArray(coord) || coord.length !== 2) return false
  const [lng, lat] = coord
  return typeof lng === 'number' && typeof lat === 'number'
    && !isNaN(lng) && !isNaN(lat)
    && lng >= -180 && lng <= 180
    && lat >= -90 && lat <= 90
}

const initMap = () => {
  return new Promise((resolve, reject) => {
    try {
      // 默认使用洱海坐标作为中心
      const defaultCenter = [100.23685, 25.63432]

      map = new window.AMap.Map('map', {
        zoom: 11,
        center: defaultCenter,
        viewMode: '3D'
      })

      map.addControl(new window.AMap.ToolBar({ position: 'LT' }))
      map.addControl(new window.AMap.Scale())

      geocoder = new window.AMap.Geocoder()

      window.AMap.plugin(['AMap.PlaceSearch'], () => {
        placeSearch = new window.AMap.PlaceSearch({ pageSize: 10, pageIndex: 1 })
      })

      map.on('complete', () => {
        isMapReady.value = true
        console.log('地图加载完成')
      })

      resolve(map)
    } catch (error) {
      console.error('地图初始化失败:', error)
      reject(error)
    }
  })
}

const searchAddressByPlaceSearch = (address) => {
  return new Promise((resolve, reject) => {
    if (!placeSearch) {
      reject(new Error('地点搜索服务未初始化'))
      return
    }

    placeSearch.search(address, (status, result) => {
      if (status === 'complete' && result.poiList && result.poiList.pois.length > 0) {
        const poi = result.poiList.pois[0]
        resolve({
          location: [poi.location.lng, poi.location.lat],
          name: poi.name,
          address: poi.address
        })
      } else {
        reject(new Error(`未找到地点: ${address}`))
      }
    })
  })
}

const addressToLngLat = async (address) => {
  if (!address || address.trim() === '') {
    throw new Error('地址不能为空')
  }

  // 精确匹配预设位置
  if (presetLocations[address]) {
    const coord = presetLocations[address]
    if (isValidCoordinate(coord)) {
      console.log(`精确匹配预设坐标: ${address} -> [${coord}]`)
      return coord
    } else {
      console.warn(`预设坐标无效: ${address}`)
    }
  }

  // 模糊匹配预设位置
  for (const [key, value] of Object.entries(presetLocations)) {
    if ((address.includes(key) || key.includes(address)) && isValidCoordinate(value)) {
      console.log(`模糊匹配预设坐标: ${key} -> [${value}]`)
      return value
    }
  }

  // 尝试使用地点搜索
  try {
    const result = await Promise.race([
      searchAddressByPlaceSearch(address),
      new Promise((_, reject) => setTimeout(() => reject(new Error('地点搜索超时')), 8000))
    ])
    if (isValidCoordinate(result.location)) {
      return result.location
    }
  } catch (searchError) {
    console.log('地点搜索失败，尝试地理编码:', searchError)
  }

  // 尝试地理编码
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('地理编码超时')), 8000)

    geocoder.getLocation(address, (status, result) => {
      clearTimeout(timeout)
      if (status === 'complete' && result.info === 'OK') {
        const lngLat = result.geocodes[0].location
        const coord = [lngLat.lng, lngLat.lat]
        if (isValidCoordinate(coord)) {
          resolve(coord)
        } else {
          reject(new Error(`无效坐标: ${address}`))
        }
      } else {
        reject(new Error(`无法定位: ${address}`))
      }
    })
  })
}

const searchPlaceSuggestions = (keyword) => {
  if (!keyword || keyword.trim().length === 0) {
    searchSuggestions.value = []
    return
  }

  if (searchTimer) clearTimeout(searchTimer)

  searchTimer = setTimeout(() => {
    // 优先匹配预设位置
    const matchedPresets = Object.entries(presetLocations)
      .filter(([name, coord]) => (name.includes(keyword) || keyword.includes(name)) && isValidCoordinate(coord))
      .map(([name, location]) => ({
        id: `preset-${name}`,
        name: name,
        address: '云南省',
        location: location
      }))

    if (matchedPresets.length > 0) {
      searchSuggestions.value = matchedPresets.slice(0, 10)
      return
    }

    // 使用地点搜索
    if (placeSearch) {
      placeSearch.search(keyword, (status, result) => {
        if (status === 'complete' && result.poiList && result.poiList.pois) {
          searchSuggestions.value = result.poiList.pois.slice(0, 10).map(poi => ({
            id: poi.id,
            name: poi.name,
            address: poi.address || poi.pname || '',
            location: [poi.location.lng, poi.location.lat]
          }))
        } else {
          searchSuggestions.value = []
        }
      })
    }
  }, 300)
}

watch(endAddress, (newVal) => {
  if (newVal) {
    searchPlaceSuggestions(newVal)
  } else {
    searchSuggestions.value = []
  }
})

const selectEndPoint = (item) => {
  endAddress.value = item.name
  endPoint.value = item.location
  searchSuggestions.value = []
  showSuggestions.value = false

  if (startPoint.value) {
    setTimeout(() => handleSearch(), 100)
  } else {
    ElMessage.warning('请先定位起点')
  }
}

const handleEndInput = () => {
  showSuggestions.value = true
  searchPlaceSuggestions(endAddress.value)
}

const handleStartSearch = async () => {
  if (!startAddress.value) {
    ElMessage.warning('请输入出发地')
    return
  }

  loadingText.value = '定位起点中...'
  isLoading.value = true

  try {
    const lngLat = await addressToLngLat(startAddress.value)

    if (!isValidCoordinate(lngLat)) {
      throw new Error('获取的坐标无效')
    }

    startPoint.value = lngLat

    map.setCenter(lngLat)
    map.setZoom(14)
    map.clearMap()
    addMarker(lngLat, 'start', startAddress.value)

    ElMessage.success(`起点定位成功: ${startAddress.value}`)

    if (endPoint.value) {
      setTimeout(() => handleSearch(), 100)
    }
  } catch (error) {
    ElMessage.error(error.message || '起点定位失败')
  } finally {
    isLoading.value = false
  }
}

const switchRouteType = (type) => {
  currentRouteType.value = type
  if (startPoint.value && endPoint.value) {
    handleSearch()
  }
}

const getApiUrl = (type) => {
  const urls = {
    driving: 'https://restapi.amap.com/v3/direction/driving',
    walking: 'https://restapi.amap.com/v3/direction/walking',
    bicycling: 'https://restapi.amap.com/v4/direction/bicycling',
    transit: 'https://restapi.amap.com/v3/direction/transit/integrated'
  }
  return urls[type] || urls.driving
}

const parsePolyline = (polylineStr) => {
  if (!polylineStr) return []
  const paths = []
  const points = polylineStr.split(',').map(Number)
  for (let i = 0; i < points.length; i += 2) {
    if (!isNaN(points[i]) && !isNaN(points[i + 1])) {
      paths.push([points[i], points[i + 1]])
    }
  }
  return paths
}

const extractPolylineFromSteps = (steps) => {
  if (!steps || steps.length === 0) return ''
  let polylineStr = ''
  steps.forEach(step => {
    if (step.polyline) {
      polylineStr += step.polyline + ';'
    }
  })
  return polylineStr
}

const drawRouteFromPath = (path) => {
  clearRoute()

  let polylineStr = ''
  if (path.polyline) {
    polylineStr = path.polyline
  } else if (path.steps) {
    polylineStr = extractPolylineFromSteps(path.steps)
  }

  if (!polylineStr) return

  const paths = []
  const polylines = polylineStr.split(';').filter(p => p)

  polylines.forEach(polyline => {
    const segmentPaths = parsePolyline(polyline)
    paths.push(...segmentPaths)
  })

  if (paths.length === 0) return

  const polyline = new window.AMap.Polyline({
    path: paths,
    strokeColor: currentRouteType.value === 'transit' ? '#00B96B' : '#0091FF',
    strokeWeight: 6,
    strokeOpacity: 0.8,
    borderWeight: 2,
    borderColor: '#FFF'
  })

  map.add(polyline)
  currentPolyline = polyline
}

const fetchRouteInfo = async (origin, destination) => {
  const url = getApiUrl(currentRouteType.value)

  const params = new URLSearchParams({
    key: WEB_SERVICE_KEY,
    origin: origin.join(','),
    destination: destination.join(','),
    extensions: 'all',
    strategy: '0'
  })

  if (currentRouteType.value === 'transit') {
    params.append('city', '大理白族自治州')
    params.append('cityd', '大理白族自治州')
  }

  const response = await fetch(`${url}?${params.toString()}`)
  const data = await response.json()

  console.log(`${currentRouteType.value}路线API响应:`, data)

  if (data.status === '1') {
    if (data.route?.paths) {
      return data.route.paths
    } else if (data.route?.transits) {
      return data.route.transits
    } else if (data.data?.paths) {
      return data.data.paths
    }
  }
  throw new Error(data.info || '路线规划失败')
}

const planRoute = async (startLngLat, endLngLat) => {
  try {
    pathList.value = []
    expandedPath.value = 0

    const paths = await fetchRouteInfo(startLngLat, endLngLat)

    if (paths && paths.length > 0) {
      pathList.value = paths
      drawRouteFromPath(paths[0])

      const path = paths[0]
      const distance = formatDistance(path.distance)
      const duration = formatDuration(path.duration)
      let cost = null

      if (currentRouteType.value === 'driving' && path.tolls) {
        cost = path.tolls + '元'
      } else if (currentRouteType.value === 'transit' && path.cost) {
        cost = path.cost + '元'
      }

      routeInfo.value = { distance, duration, cost }
      ElMessage.success(`${getRouteTypeName(currentRouteType.value)}路线规划成功`)
    } else {
      throw new Error('未找到路线')
    }
  } catch (error) {
    console.error('路线规划失败:', error)
    drawStraightLine(startLngLat, endLngLat)
    pathList.value = []
    ElMessage.warning(error.message || '路线规划失败，显示直线距离')
  }
}

const drawStraightLine = (start, end) => {
  clearRoute()

  if (!isValidCoordinate(start) || !isValidCoordinate(end)) {
    console.error('无效坐标，无法绘制直线')
    return
  }

  const polyline = new window.AMap.Polyline({
    path: [start, end],
    strokeColor: "#FF33FF",
    strokeWeight: 6,
    strokeOpacity: 0.8,
    strokeDasharray: [10, 10],
    strokeStyle: "dashed"
  })

  map.add(polyline)
  currentPolyline = polyline

  const distance = calculateDistance(start, end)
  routeInfo.value = {
    distance: distance.toFixed(1) + '公里',
    duration: '无法计算',
    cost: null
  }
}

const calculateDistance = (start, end) => {
  const [lng1, lat1] = start
  const [lng2, lat2] = end
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

const handleSearch = async () => {
  if (!startAddress.value) {
    ElMessage.warning('请输入出发地')
    return
  }

  if (!endAddress.value) {
    ElMessage.warning('请输入目的地')
    return
  }

  loadingText.value = '规划路线中...'
  isLoading.value = true
  showSuggestions.value = false

  try {
    clearRoute()
    pathList.value = []

    if (!startPoint.value) {
      loadingText.value = '获取起点坐标...'
      startPoint.value = await addressToLngLat(startAddress.value)
    }

    if (!endPoint.value) {
      loadingText.value = '获取终点坐标...'
      endPoint.value = await addressToLngLat(endAddress.value)
    }

    if (!isValidCoordinate(startPoint.value) || !isValidCoordinate(endPoint.value)) {
      throw new Error('坐标无效')
    }

    console.log('起点:', startPoint.value, '终点:', endPoint.value)

    await planRoute(startPoint.value, endPoint.value)
    addMarkers(startPoint.value, endPoint.value)
    map.setFitView()
  } catch (error) {
    console.error('搜索失败:', error)
    ElMessage.error(error.message || '搜索失败')
  } finally {
    isLoading.value = false
  }
}

const addMarker = (position, type, title) => {
  if (!isValidCoordinate(position)) {
    console.error('无效坐标，无法添加标记')
    return
  }

  const iconConfig = type === 'start'
    ? {
      size: new window.AMap.Size(25, 34),
      image: 'https://webapi.amap.com/theme/v1.3/markers/n/start.png',
      imageSize: new window.AMap.Size(25, 34)
    }
    : {
      size: new window.AMap.Size(25, 34),
      image: 'https://webapi.amap.com/theme/v1.3/markers/n/end.png',
      imageSize: new window.AMap.Size(25, 34)
    }

  new window.AMap.Marker({
    map: map,
    position: position,
    title: title,
    icon: new window.AMap.Icon(iconConfig)
  })
}

const addMarkers = (start, end) => {
  map.clearMap()
  addMarker(start, 'start', startAddress.value)
  addMarker(end, 'end', endAddress.value)
}

const clearRoute = () => {
  if (currentPolyline) {
    map.remove(currentPolyline)
    currentPolyline = null
  }
  routeInfo.value = null
}

const handleClear = () => {
  startAddress.value = ''
  endAddress.value = ''
  startPoint.value = null
  endPoint.value = null
  clearRoute()
  map.clearMap()
  searchSuggestions.value = []
  showSuggestions.value = false
  pathList.value = []
  ElMessage.info('已清除路线')
}

const locateToPosition = async (address) => {
  loadingText.value = '定位中...'
  isLoading.value = true

  try {
    let retryCount = 0
    while (!isMapReady.value && retryCount < 30) {
      await new Promise(resolve => setTimeout(resolve, 100))
      retryCount++
    }

    const lngLat = await addressToLngLat(address)

    if (!isValidCoordinate(lngLat)) {
      throw new Error('获取的坐标无效')
    }

    startPoint.value = lngLat
    startAddress.value = address

    map.setCenter(lngLat)
    map.setZoom(14)
    map.clearMap()
    addMarker(lngLat, 'start', address)

    ElMessage.success(`已定位到: ${address}`)
    console.log(`定位成功: ${address} -> [${lngLat}]`)
  } catch (error) {
    ElMessage.error(error.message || `定位失败: ${address}`)
  } finally {
    isLoading.value = false
  }
}

const loadMapScript = () => {
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${JS_API_KEY}&plugin=AMap.Geocoder,AMap.ToolBar,AMap.Scale,AMap.PlaceSearch`
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

const handleRouteParams = async () => {
  const { location } = route.query

  if (location) {
    const decodedLocation = decodeURIComponent(location)
    console.log('接收到位置参数:', decodedLocation)
    // 延迟执行，确保地图已初始化
    setTimeout(() => locateToPosition(decodedLocation), 1000)
  }
}

onMounted(async () => {
  try {
    await loadMapScript()
    await initMap()
    await handleRouteParams()
  } catch (error) {
    console.error('初始化失败:', error)
    ElMessage.error('地图加载失败')
  }
})

onBeforeUnmount(() => {
  if (searchTimer) clearTimeout(searchTimer)
  if (map) {
    map.destroy()
    map = null
  }
})
</script>
 <style scoped>
.wayplan-container {
  width: 100%;
  height: 100vh;
  position: relative;
}

.search-panel {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
  width: 90%;
  max-width: 500px;
}

.search-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  padding: 0 10px;
  position: relative;
}

.search-item:focus-within {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

.icon {
  margin-right: 10px;
}

.search-input {
  flex: 1;
  border: none;
  padding: 12px 0;
  font-size: 14px;
  outline: none;
}

.locate-btn {
  background: #1890ff;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  font-size: 12px;
  cursor: pointer;
  margin-left: 5px;
}

.locate-btn:hover {
  background: #40a9ff;
}

.suggestions-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 101;
  margin-top: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.suggestion-item {
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s;
}

.suggestion-item:hover {
  background: #f5f5f5;
}

.suggestion-name {
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.suggestion-address {
  font-size: 12px;
  color: #999;
}

.route-type {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.route-type-btn {
  flex: 1;
  padding: 8px;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  background: white;
  color: #333;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 60px;
}

.route-type-btn:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.route-type-btn.active {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
}

.button-group {
  display: flex;
  gap: 10px;
}

.search-btn {
  flex: 1;
  background: #1890ff;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.search-btn:hover {
  background: #40a9ff;
}

.clear-btn {
  flex: 1;
  background: #f5f5f5;
  color: #333;
  border: 1px solid #d9d9d9;
  padding: 12px;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.clear-btn:hover {
  border-color: #40a9ff;
  color: #40a9ff;
}

#map {
  width: 100%;
  height: 100%;
}

.route-info {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 15px 20px;
  border-radius: 8px;
  z-index: 100;
  display: flex;
  gap: 30px;
  font-size: 14px;
  backdrop-filter: blur(5px);
}

.info-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.route-steps {
  position: absolute;
  bottom: 300px;
  right: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 99;
  width: 350px;
  max-height: 400px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.steps-header {
  background: #1890ff;
  color: white;
  padding: 12px 15px;
  font-weight: bold;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-steps {
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 0 5px;
}

.steps-list {
  overflow-y: auto;
  max-height: 350px;
}

.path-item {
  border-bottom: 1px solid #f0f0f0;
}

.path-title {
  padding: 12px 15px;
  font-weight: bold;
  color: #333;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fafafa;
}

.path-title:hover {
  background: #f0f0f0;
}

.toggle-icon {
  color: #999;
  font-size: 12px;
}

.steps-container {
  padding: 10px 0;
}

.transit-summary {
  padding: 8px 15px;
  background: #e6f7ff;
  color: #1890ff;
  font-size: 12px;
  margin-bottom: 5px;
}

.step-item {
  padding: 8px 15px;
  display: flex;
  gap: 10px;
  border-bottom: 1px dashed #f0f0f0;
}

.step-icon {
  font-size: 16px;
  width: 24px;
  text-align: center;
}

.step-content {
  flex: 1;
}

.step-instruction {
  font-size: 13px;
  color: #333;
  margin-bottom: 3px;
}

.step-road {
  font-size: 11px;
  color: #999;
}

.step-distance {
  font-size: 11px;
  color: #1890ff;
  margin-top: 2px;
}

.loading-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 15px 20px;
  border-radius: 8px;
  z-index: 200;
  backdrop-filter: blur(5px);
}

@media (max-width: 768px) {
  .search-panel {
    width: 95%;
    padding: 15px;
  }

  .route-type-btn {
    padding: 6px;
    font-size: 11px;
  }

  .button-group {
    flex-direction: column;
  }

  .route-info {
    flex-direction: column;
    gap: 10px;
    font-size: 12px;
    padding: 10px 15px;
  }

  .route-steps {
    bottom: 80px;
    right: 10px;
    left: 10px;
    width: auto;
  }
}
</style>
