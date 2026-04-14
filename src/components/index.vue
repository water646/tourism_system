<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <div class="nav-container">
          <div class="header">
            <a href="/">
              <img src="@/assets/img/logo.png" alt="logo" class="logo">
            </a>
            <h2>云境智游</h2>
          </div>
          <div class="header-l">
            <ul>
              <li>
                <router-link to="/" active-class="active" custom v-slot="{ href, navigate, isActive }">
                  <a :href="href" @click="navigate" :class="{ active: isActive }">
                    首页
                  </a>
                </router-link>
              </li>
              <li>
                <!-- <router-link to="/desc" active-class="active" custom v-slot="{ href, navigate, isActive }"> -->
                  <a :href="href" @click="navigate" :class="{ active: isActive }">
                    简介
                  </a>
                <!-- </router-link> -->
              </li>
              <li>
                <!-- <router-link to="/about" active-class="active" custom v-slot="{ href, navigate, isActive }"> -->
                  <a :href="href" @click="navigate" :class="{ active: isActive }">
                    关于我们
                  </a>
                <!-- </router-link> -->
              </li>
            </ul>
          </div>
          <div class="header-r">
            <p v-if="username" style="margin:10px; display: flex;">欢迎，{{ username }}</p>
            <el-button v-if="username" type="danger" @click="handleLogout">退出</el-button>
            <el-button type="primary" @click="handleRegister">注册</el-button>
            <el-button type="success" @click="handleLogin">登录</el-button>
          </div>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <!-- 侧边栏菜单 -->
          <el-menu :default-active="activeMenu" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
            <el-menu-item index="1" @click="$router.push('/')">
              <el-icon>
                <location />
              </el-icon>

              <span>全部</span>
            </el-menu-item>
            <el-menu-item index="2" @click="$router.push('/scenic')">
              <el-icon>
                <Picture />
              </el-icon>
              <span>风景胜地</span>
            </el-menu-item>
            <el-menu-item index="3" @click="$router.push('/goods')">
              <el-icon>
                <goods />
              </el-icon>
              <span>特产产品</span>
            </el-menu-item>
            <el-menu-item index="4" @click="$router.push('/traffic')">
              <el-icon>
                <Location />
              </el-icon>
              <span>交通出行</span>
            </el-menu-item>
            <el-menu-item index="5" @click="$router.push('/national')">
              <el-icon>
                <avatar />
              </el-icon>
              <span>民族特色</span>
            </el-menu-item>
            <el-menu-item index="6" @click="$router.push('/seasons')">
              <el-icon>
                <calendar />
              </el-icon>
              <span>季节限定</span>
            </el-menu-item>
            <el-menu-item index="7" @click="$router.push('/adventure')">
              <el-icon>
                <compass />
              </el-icon>
              <span>探险旅行</span>
            </el-menu-item>
            <el-menu-item index="8" @click="$router.push('/')">
              <el-icon>
                <ticket />
              </el-icon>
              <span>活动体验</span>
            </el-menu-item>
            <div class="label-list">
              <span class="label-title">热门标签:</span>
              <el-tag type="success" class="label-tag">雪山</el-tag>
              <el-tag type="success" class="label-tag">云海</el-tag>
              <el-tag type="success" class="label-tag">雨林</el-tag>
              <el-tag type="success" class="label-tag">湖泊</el-tag>
              <el-tag type="success" class="label-tag">大理</el-tag>
              <el-tag type="success" class="label-tag">丽江</el-tag>
              <el-tag type="success" class="label-tag">西双版纳</el-tag>
              <el-tag type="success" class="label-tag">民族文化</el-tag>
            </div>
          </el-menu>
        </el-aside>
        <el-main>
          <!-- 主内容区域 -->
          <div class="content-wrapper">

            <!-- 子路由内容区域 -->
            <router-view />
          </div>
        </el-main>

      </el-container>
    </el-container>
  </div>
</template>

<script setup>
// import axios from 'axios'
import { ref, onMounted, watch } from 'vue'
// import { Location, IconMenu, Goods, Map, Avatar, Calendar, Compass, Ticket } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const username = ref('')
const activeMenu = ref('1')
const router = useRouter()
const route = useRoute()

// 根据路由设置侧边栏激活状态
const setActiveMenu = () => {
  const path = route.path
  if (path === '/' || path === '/home') {
    activeMenu.value = '1'
  } else if (path.startsWith('/scenic')) {
    activeMenu.value = '2'
  } else if (path.startsWith('/goods')) {
    activeMenu.value = '3'
  } else if (path.startsWith('/traffic')) {
    activeMenu.value = '4'
  } else if (path.startsWith('/national')) {
    activeMenu.value = '5'
  } else if (path.startsWith('/seasons')) {
    activeMenu.value = '6'
  } else if (path.startsWith('/adventure')) {
    activeMenu.value = '7'
  } else if (path.startsWith('/activity')) {
    activeMenu.value = '8'
  }
}

// 监听路由变化
watch(() => route.path, () => {
  setActiveMenu()
})

// 组件挂载时设置初始状态
onMounted(async() => {
  setActiveMenu()
  const res = await axios.get('/api/userinfo')
  console.log(res.data)
  if(res.data.username){
    username.value = res.data.username
  }
  else{
    return
  }
})

// onMounted(async() =>{
//   const res = await axios.get('/api/userinfo')
//   if(res.data.username){
//     username.value = res.data.username
//   }
//   else{
//     return
//   }
// })


const handleOpen = (key, keyPath) => {
  console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
}
// 注册
const handleRegister = () => {
  router.push('/register')
}
// 登录
const handleLogin = () => {
  router.push('/login')
}
// //登出
// const handleLogout = async() =>{
//    await axios.post('/api/logout')
//   router.go(0)
// }
</script>

<style scoped lang="scss">
.common-layout {
  width: 100%;
  height: 100vh;
}

// 导航栏样式
.el-header {
  // 为el-header添加吸顶效果
  position: sticky;
  top: 0;
  z-index: 1000; // 确保导航栏在最上层
  height: 60px; // 设置固定高度
  padding: 0; // 移除默认内边距
  background-color: white;
  border-bottom: 1px solid #e4e7ed;
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 40px;
}

// 导航栏logo
.nav-container .header {

  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-container .logo {
  width: 60px;
  height: 60px;
}

.nav-container h2 {
  font-size: 24px;
  font-weight: bold;
  color: #000;
  text-align: center;
  margin-top: 10px;
}

.header-l ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.header-l li {
  margin: 0 20px;
}

.header-l a {
  text-decoration: none;
  color: #333;
  font-size: 16px;
  font-weight: 500;
  padding: 5px 0;
  transition: all 0.3s ease;
  position: relative;
}

.header-l a:hover {
  color: #409eff;
}

.header-l a.active {
  color: #409eff;
  font-weight: 600;
}

.header-l a.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #409eff;
  transform: scaleX(1);
}

.header-l a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #409eff;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.header-l a:hover::after {
  transform: scaleX(1);
}

.header-r {
  display: flex;
  gap: 10px;
  align-items: center;
}

//侧边栏粘性定位
.el-aside {
  position: sticky;
  top: 60px; // 导航栏高度为60px，所以侧边栏顶部需要留出这个空间
  left: 0;
  z-index: 999; // 确保侧边栏在内容之上但在导航栏之下
  height: calc(100vh - 60px); // 减去导航栏高度
  overflow-y: auto; // 侧边栏内容过多时可以自己滚动
}

.sidechange {
  position: absolute;
  top: 50%;
  left: 190px;
  transform: translate(-50%, -50%);
  z-index: 999;

  .icon-left {
    font-size: 40px;
    color: #666;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      color: #409eff;
    }
  }
}

// 侧边栏样式
.el-menu-vertical-demo {
  height: 100%;
  border-right: none;
  background-color: #f5f5f5;
}

.el-menu-item {
  color: #666;
  font-size: 14px;
  padding-left: 20px !important;
  margin-bottom: 5px;
  transition: all 0.3s ease;
}

.el-menu-item:hover {
  color: #409eff !important;
  background-color: #e6f7ff !important;
}

.el-menu-item.is-active {
  color: #409eff !important;
  background-color: #e6f7ff !important;
  border-right: 3px solid #409eff;
}

// 主内容区域样式
.el-main {
  background-color: #fff;
  padding: 0;
  overflow: visible; // 允许内容正常显示
}

.content-wrapper {
  width: 100%;
  min-height: 100%;
  padding: 20px;
  overflow: auto; // 主内容区域可以独立滚动
}

// 热门标签样式
.label-list {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.label-title {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.label-tag {
  cursor: pointer;
  transition: all 0.3s ease;
  color: #409eff;
  background-color: #e6f7ff;
  transition: transform 0.3s ease;
  animation: animateLabel 5s ease infinite;
  /* 防止文字模糊 */
  transform-style: preserve-3d;
  perspective: 1000px;
}

.label-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

// 确保主内容区域正确显示
:deep(main) {
  width: 100%;
  height: auto;
  min-height: 100%;
  overflow: visible;
}

// 确保子路由内容正确显示
:deep(.home-container) {
  width: 100%;
  min-height: 100%;
}

//给label-tag添加动画
@keyframes animateLabel {
  0% {
    transform: translateY(-4px);
    /* 保持文字清晰 */
    will-change: transform;
  }

  100% {
    transform: translateY(0);
  }
}
</style>
