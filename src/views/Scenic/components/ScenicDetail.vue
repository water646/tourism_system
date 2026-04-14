<template>
  <el-page-header :icon="ArrowLeft" title="返回" class="header" @click="handleBack" />
  <div class="scenic-detail-container">
    <div class="scenicvideo">
      <video ref="videoRef" src="@/assets/img/erhai.mp4" autoplay muted loop></video>
    </div>
    <div class="scenic-vr">
      <h3>VR体验</h3>
      <img :src="img"  alt="" v-if="img">
      <img src="@/assets/img/vr-bg.png" alt="" v-else>
      <button @click="handleVRClick">进入VR</button>
    </div>
    <div class="wayplan">
      <h3>地理位置</h3>
      <img src="@/assets/img/erhailocation.png" alt="">
      <button @click="handleWayplanClick">查看路线</button>
    </div>
    <div class="locationevaluate">
      <h3>用户评价</h3>
      <div class="evaluation-scroll">
        <div class="evaluation-item" v-for="(item) in evaluations" :key="item.comment_id">
          <div class="user-info">
            <!-- <img :src="item.avatar" alt="用户头像" class="avatar"> -->
            <div class="user-details">
              <span class="username">{{ item.username }}</span>
              <!-- <div class="rating">
                <i class="iconfont icon-star" v-for="n in item.rating" :key="n"></i>
              </div> -->
            </div>
          </div>
          <p class="comment">{{ item.content }}</p>
          <span class="time">{{ item.time }}</span>
        </div>
      </div>
      <button @click="handleEvaluationClick">查看全部评价</button>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter,useRoute } from 'vue-router'
import { getScenicDetail } from '@/apis/scenic'
const router = useRouter()
const route = useRoute()
const img=ref('')
const evaluations = ref([])
const placeMap={
  1:'玉龙雪山',
  2:'丽江古城',
  3:'洱海'
}
const getEvaluation = async () => {
  const res = await getScenicDetail(route.params.id)
  evaluations.value = res.data.comments
  img.value=res.data.image
}


// 模拟用户评价数据
// const evaluations = ref([
//   {
//     username: '旅行者小A',
//     avatar: 'https://randomuser.me/api/portraits/women/42.jpg',
//     rating: 5,
//     comment: '洱海的风景真的太美了，湖水清澈见底，蓝天白云倒映在水中，宛如仙境一般。强烈推荐大家来这里旅游！',
//     time: '2024-05-15'
//   },
//   {
//     username: '摄影爱好者小张',
//     avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
//     rating: 5,
//     comment: '作为一个摄影爱好者，洱海给了我无数创作灵感。日出日落时分的光线特别美，拍出的照片都不用怎么后期处理。',
//     time: '2024-05-10'
//   },
//   {
//     username: '背包客小李',
//     avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
//     rating: 4,
//     comment: '环湖骑行是一种很棒的体验，沿途风景如画。不过旅游旺季人有点多，建议错峰出行。',
//     time: '2024-05-05'
//   },
//   {
//     username: '文化探索者王先生',
//     avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
//     rating: 5,
//     comment: '除了自然风光，洱海周边的白族文化也很有特色。当地的民宿很有味道，推荐大家小住几天慢慢感受。',
//     time: '2024-04-28'
//   },
//   {
//     username: '美食爱好者小陈',
//     avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
//     rating: 4,
//     comment: '洱海边的美食也很值得品尝，特别是当地的酸辣鱼和乳扇。湖水很干净，环境维护得很好。',
//     time: '2024-04-20'
//   }
// ])

// 页面加载时启动自动滚动
onMounted(() => {
  getEvaluation()
  const scrollContainer = document.querySelector('.evaluation-scroll')
  if (scrollContainer) {
    let scrollPosition = 0
    const scrollSpeed = 1
    const itemHeight = 200 // 每个评价项的大致高度
    const itemsCount = evaluations.value.length
    const totalHeight = itemsCount * itemHeight
    function autoScroll() {
      scrollPosition += scrollSpeed
      if (scrollPosition > totalHeight - 300) { // 当滚动到底部附近时重置
        scrollPosition = 0
      }
      scrollContainer.scrollTop = scrollPosition
      requestAnimationFrame(autoScroll)
    }

    // 延迟启动自动滚动，确保DOM已完全渲染
    setTimeout(() => {
      autoScroll()
    }, 2000)
  }
})

// 处理返回按钮点击事件
const handleBack = () => {
  router.push({ name: 'scenic' })
}

// 处理VR点击事件
const handleVRClick = () => {
  router.push({ name: 'vrstep' })
}

// 处理路线规划点击事件
const handleWayplanClick = () => {
  router.push({ name: 'wayplan',query:{ location: placeMap[route.params.id] } })
}
// 处理查看全部评价点击事件
const handleEvaluationClick = () => {
  router.push({ name: 'evaluation' })
}
</script>
<style scoped lang="scss">
.scenic-detail-container {
  height: 100vh;
  width: 100%;
  margin: 20px auto;
  position: relative;

  .scenicvideo {
    position: relative;
    margin-top: 20px;

    video {
      width: 100%;
      height: 100vh;
      // 将视频封面拉伸到与页面一样大
      object-fit: cover;
      // 视频居中显示
      position: absolute;
      // top: 0;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  .scenic-vr {
    position: absolute;
    top: 73%;
    left: 18%;
    transform: translate(-50%, -50%);
    z-index: 1;
    margin-top: 20px;
    width: 490px;
    height: 380px;
    border: 1px solid #007bff;
    border-radius: 5px;
    background-color: #fff;
    h3 {
      font-size: 42px;
      font-weight: 600;
      // color: #fff;
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
      letter-spacing: 3px;
    }
    img {
      width: 100%;
      height: 80%;
      border-radius: 10px;
    }

    button {
      padding: 10px 20px;
      background-color: #fff;
      color: #000;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      position: absolute;
      bottom: 1%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    &::before {
      content: '';
      position: absolute;
      top: 90%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      height: 75px;
      background: #007bff;
    }
  }

  .wayplan {
    position: absolute;
    top: 75%;
    left: 54%;
    transform: translate(-50%, -50%);
    z-index: 1;
    width: 490px;
    height: 380px;
    border: 1px solid #007bff;
    border-radius: 5px;
    padding: 20px;
    background: #fff;

    h3 {
      font-size: 28px;
      font-weight: 600;
      margin-left: 60px;
    }

    img {
      width: 70%;
      height: 60%;
      border-radius: 10px;
    }

    button {
      padding: 10px 20px;
      background-color: #fff;
      color: #000;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      position: absolute;
      bottom: 1%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    &::before {
      content: '';
      position: absolute;
      top: 90%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      height: 75px;
      background: #007bff;
    }
  }

  .locationevaluate {
    position: absolute;
    top: 75%;
    right: -202px;
    transform: translate(-50%, -50%);
    z-index: 1;
    width: 400px;
    height: 380px;
    border: 1px solid #007bff;
    border-radius: 5px;
    padding: 20px;
    background: #fff;

    h3 {
      font-size: 28px;
      font-weight: 600;
      margin-left: 60px;
      margin-bottom: 20px;
    }

    .evaluation-scroll {
      height: 280px;
      overflow-y: auto;
      padding-right: 10px;

      // 自定义滚动条样式
      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 3px;
      }

      &::-webkit-scrollbar-thumb {
        background: #007bff;
        border-radius: 3px;
      }

      &::-webkit-scrollbar-thumb:hover {
        background: #0056b3;
      }
    }

    .evaluation-item {
      padding: 15px;
      margin-bottom: 15px;
      background: #f9f9f9;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s ease;

      &:hover {
        transform: translateY(-2px);
      }
    }

    .user-info {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 12px;
      object-fit: cover;
    }

    .user-details {
      flex: 1;
    }

    .username {
      font-weight: 600;
      font-size: 14px;
      color: #333;
      display: block;
      margin-bottom: 4px;
    }

    .rating {
      display: flex;

      .icon-star {
        color: #ffc107;
        margin-right: 2px;
        font-size: 14px;
      }
    }

    .comment {
      font-size: 13px;
      line-height: 1.5;
      color: #555;
      margin-bottom: 8px;
      word-break: break-word;
    }

    .time {
      font-size: 12px;
      color: #999;
    }

    button {
      padding: 10px 20px;
      background-color: #fff;
      color: #000;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      position: absolute;
      bottom: 1%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    &::before {
      content: '';
      position: absolute;
      top: 90%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      height: 75px;
      background: #007bff;
    }
  }
}
</style>
