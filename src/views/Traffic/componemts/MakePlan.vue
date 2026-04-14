<template>
  <div class="make-plan-container">
    <div class="plan-header">
      <h2> 行程规划</h2>
      <p class="subtitle">输入起点和途经点，为您生成最佳旅行路线</p>
    </div>

    <div class="plan-form">
      <!-- 起点输入 -->
      <div class="form-section">
        <h3 class="section-title">
          <span class="icon"></span>
          起点
        </h3>
        <div class="input-group">
          <input
            type="text"
            placeholder="请输入起点位置"
            class="location-input"
            v-model="startPlace"
          />
        </div>
      </div>

      <!-- 途经点输入 -->
      <div class="form-section">
        <div class="section-header">
          <h3 class="section-title">
            <span class="icon"></span>
            途经点
          </h3>
          <button class="add-btn" @click="addWaypoint">
            <span>+</span> 添加途经点
          </button>
        </div>

        <div class="waypoints-list">
          <div v-for="(waypoint, index) in waypoints" :key="waypoint.id" class="waypoint-item">
            <div class="waypoint-order">{{ index + 1 }}</div>
            <input
              type="text"
              :placeholder="`途经点 ${index + 1}`"
              class="location-input"
              v-model="waypoint.name"
            />
            <button class="remove-btn" @click="removeWaypoint(index)" :disabled="waypoints.length <= 1">
              ✕
            </button>
          </div>
        </div>
      </div>

      <!-- 终点输入 -->
      <div class="form-section">
        <h3 class="section-title">
          <span class="icon"></span>
          终点
        </h3>
        <div class="input-group">
          <input
            type="text"
            placeholder="请输入终点位置"
            class="location-input"
            v-model="endPlace"
          />
        </div>
      </div>

      <!-- 路线偏好选择 -->
      <div class="form-section">
        <h3 class="section-title">
          <span class="icon"></span>
          路线偏好
        </h3>
        <div class="preference-options">
          <label class="preference-label">
            <input type="radio" name="preference" value="fastest" checked />
            <span class="option-text">最快路线</span>
          </label>
          <label class="preference-label">
            <input type="radio" name="preference" value="shortest" />
            <span class="option-text">最短距离</span>
          </label>
          <label class="preference-label">
            <input type="radio" name="preference" value="scenic" />
            <span class="option-text">风景最优</span>
          </label>
        </div>
      </div>

      <!-- 生成按钮 -->
      <div class="button-section">
        <button class="generate-btn" @click="generatePlan">
          <span class="btn-icon">🎲</span>
          生成行程
        </button>
        <button class="reset-btn" @click="resetForm">重置</button>
      </div>
    </div>

    <!-- 行程预览区域 -->
    <div class="plan-preview" v-if="showPreview">
      <div class="preview-header">
        <h3 class="preview-title">
          <span class="icon">📋</span>
          行程规划
        </h3>
      </div>

      <div class="route-summary">
        <!-- 地点列表 -->
        <div class="places-info">
          <div class="places-label">途经路线</div>
          <div class="places-path">
            <span v-for="(place, index) in routePlaces" :key="index" class="place-item">
              {{ place }}
              <span v-if="index < routePlaces.length - 1" class="arrow">→</span>
            </span>
          </div>
        </div>
      </div>

      <!-- AI生成的行程规划内容 -->
      <div class="ai-answer" v-if="answer">
        <div class="answer-header">
          <span class="answer-icon">🤖</span>
          <span class="answer-title">智能规划建议</span>
        </div>
        <div class="answer-content">
          {{ answer }}
        </div>
      </div>

      <!-- 路线步骤 -->
      <div class="route-steps">
        <div v-for="(place, index) in routePlaces" :key="index" class="step-item">
          <div class="step-number">{{ index + 1 }}</div>
          <div class="step-content">
            <div class="step-location">{{ place }}</div>
            <div class="step-info">{{ getPlaceLabel(index) }}</div>
          </div>
          <div class="step-distance">{{ index === 0 ? '0 km' : '---' }}</div>
        </div>
      </div>
    </div>

    <!-- 推荐景点 -->
    <div class="recommendations">
      <h3 class="recommend-title">
        <span class="icon"></span>
        沿途推荐景点
      </h3>
      <div class="recommend-list">
        <div v-for="(spot, index) in recommendations" :key="index" class="recommend-item">
          <div class="spot-image">
            <img :src="spot.image" :alt="spot.name" />
          </div>
          <div class="spot-info">
            <h4>{{ spot.name }}</h4>
            <p class="spot-desc">{{ spot.description }}</p>
            <div class="spot-tags">
              <span v-for="tag in spot.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import {getPlan} from "@/apis/traffic.js"
// 起点
const startPlace = ref('')

// 终点
const endPlace = ref('')

// 途经点列表（包含地点名称）
const waypoints = ref([{ id: 1, name: '' }])

// 是否显示预览
const showPreview = ref(false)
const answer=ref("")
// 获取完整的行程地点数组（首项为起点，中间为途经点，末项为终点）
const routePlaces = computed(() => {
  const places = []

  // 添加起点（首项）
  if (startPlace.value) {
    places.push(startPlace.value)
  }

  // 添加途经点
  waypoints.value.forEach((waypoint) => {
    if (waypoint.name) {
      places.push(waypoint.name)
    }
  })

  // 添加终点
  if (endPlace.value) {
    places.push(endPlace.value)
  }

  return places
})

// 路线步骤（模拟数据）
const routeSteps = reactive([
  { location: '起点', info: '出发', distance: '0 km' },
  { location: '途经点1', info: '预计停留 1 小时', distance: '50 km' },
  { location: '途经点2', info: '预计停留 2 小时', distance: '30 km' },
  { location: '终点', info: '到达目的地', distance: '20 km' }
])

// 推荐景点（模拟数据）
const recommendations = reactive([
  {
    name: '洱海公园',
    description: '洱海畔的美丽公园，湖光山色尽收眼底',
    tags: ['自然', '拍照', '休闲'],
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop'
  },
  {
    name: '大理古城',
    description: '千年古城，感受历史文化底蕴',
    tags: ['历史', '文化', '美食'],
    image: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?w=300&h=200&fit=crop'
  },
  {
    name: '喜洲古镇',
    description: '白族民居建筑群，体验民族风情',
    tags: ['民族', '建筑', '美食'],
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop'
  }
])

// 添加途经点
const addWaypoint = () => {
  waypoints.value.push({ id: waypoints.value.length + 1, name: '' })
}

// 删除途经点
const removeWaypoint = (index) => {
  if (waypoints.value.length > 1) {
    waypoints.value.splice(index, 1)
    // 更新剩余途经点的id
    waypoints.value.forEach((item, i) => {
      item.id = i + 1
    })
  }
}

// 获取地点标签
const getPlaceLabel = (index) => {
  if (index === 0) {
    return '起点'
  } else if (index === routePlaces.value.length - 1) {
    return '终点'
  } else {
    return `途经点${index}`
  }
}

// 生成行程
const generatePlan = async() => {
  console.log('完整行程地点数组:', routePlaces.value)

  if (routePlaces.value.length < 2) {
    alert('请至少填写起点和终点')
    return
  }

  try {
    const res = await getPlan({ positionList: routePlaces.value })
    console.log('API响应:', res)
    if (res && res.data && res.data.answer) {
      answer.value = res.data.answer
    }
  } catch (error) {
    console.error('行程规划失败:', error)
    if (error.code === 'ECONNABORTED') {
      alert('请求超时，请检查网络连接或稍后重试')
    } else {
      alert('行程规划失败，请稍后重试')
    }
  }

  showPreview.value = true
}

// 重置表单
const resetForm = () => {
  startPlace.value = ''
  endPlace.value = ''
  waypoints.value = [{ id: 1, name: '' }]
  showPreview.value = false
}
</script>

<style lang="scss" scoped>
.make-plan-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px 20px;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.plan-header {
  text-align: center;
  margin-bottom: 30px;

  h2 {
    font-size: 28px;
    color: #333;
    margin: 0 0 10px 0;
  }

  .subtitle {
    font-size: 14px;
    color: #666;
    margin: 0;
  }
}

.plan-form {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 30px;
}

.form-section {
  margin-bottom: 25px;

  &:last-of-type {
    margin-bottom: 0;
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 15px 0;

  .icon {
    margin-right: 8px;
    font-size: 18px;
  }
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  span {
    font-size: 16px;
    font-weight: bold;
  }
}

.input-group {
  position: relative;
}

.location-input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 14px;
  transition: border-color 0.3s, box-shadow 0.3s;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #999;
  }
}

.waypoints-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.waypoint-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.waypoint-order {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
}

.remove-btn {
  width: 32px;
  height: 32px;
  background: #f5f5f5;
  border: none;
  border-radius: 50%;
  font-size: 14px;
  color: #999;
  cursor: pointer;
  transition: all 0.3s;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    background: #ff4757;
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.preference-options {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.preference-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;

  input[type="radio"] {
    width: 16px;
    height: 16px;
    accent-color: #667eea;
  }

  .option-text {
    font-size: 14px;
    color: #555;
  }
}

.button-section {
  display: flex;
  gap: 15px;
  margin-top: 30px;

  button {
    flex: 1;
    padding: 15px;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
  }
}

.generate-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }

  .btn-icon {
    font-size: 18px;
  }
}

.reset-btn {
  background: #f5f5f5;
  color: #666;
  border: 1px solid #e0e0e0;

  &:hover {
    background: #e8e8e8;
    border-color: #ccc;
  }
}

.plan-preview {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 30px;
  margin-top: 30px;
}

.preview-header {
  margin-bottom: 20px;
}

.preview-title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;

  .icon {
    margin-right: 8px;
  }
}

.route-summary {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
}

.places-info {
  text-align: center;
}

.places-label {
  font-size: 13px;
  color: #666;
  margin-bottom: 10px;
}

.places-path {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.place-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.arrow {
  color: #667eea;
  font-weight: bold;
}

/* AI回答区域 */
.ai-answer {
  background: linear-gradient(135deg, #fff9e6 0%, #fff3cd 100%);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  border-left: 4px solid #ffc107;
}

.answer-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
}

.answer-icon {
  font-size: 20px;
}

.answer-title {
  font-size: 16px;
  font-weight: 600;
  color: #856404;
}

.answer-content {
  font-size: 15px;
  line-height: 1.8;
  color: #333;
  white-space: pre-wrap;
}

.summary-item {
  text-align: center;

  .summary-label {
    display: block;
    font-size: 12px;
    color: #666;
    margin-bottom: 5px;
  }

  .summary-value {
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }
}

.route-steps {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #fafafa;
  border-radius: 10px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 15px;
    top: calc(100% + 7px);
    width: 2px;
    height: 7px;
    background: #ddd;

    &:last-child::before {
      display: none;
    }
  }
}

.step-number {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
}

.step-content {
  flex: 1;

  .step-location {
    font-size: 15px;
    font-weight: 600;
    color: #333;
    margin-bottom: 3px;
  }

  .step-info {
    font-size: 12px;
    color: #999;
  }
}

.step-distance {
  font-size: 13px;
  color: #667eea;
  font-weight: 500;
}

.recommendations {
  margin-top: 30px;
}

.recommend-title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;

  .icon {
    margin-right: 8px;
  }
}

.recommend-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.recommend-item {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
}

.spot-image {
  width: 100%;
  height: 150px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
  }

  &:hover img {
    transform: scale(1.05);
  }
}

.spot-info {
  padding: 15px;
}

.spot-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.spot-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  margin: 0 0 10px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.spot-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  padding: 4px 10px;
  background: #f0f4ff;
  color: #667eea;
  border-radius: 12px;
  font-size: 11px;
}

@media (max-width: 600px) {
  .make-plan-container {
    padding: 20px 15px;
  }

  .plan-form {
    padding: 20px;
  }

  .button-section {
    flex-direction: column;
  }

  .route-summary {
    flex-direction: column;
    gap: 15px;
  }

  .recommend-list {
    grid-template-columns: 1fr;
  }
}
</style>