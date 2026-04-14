<template>
  <div class="vrviews-container">
    <ul class="vrviews-list">
      <li>
        <!-- 使用template ref数组收集视频元素 -->
        <video controls autoplay muted loop preload="auto" poster="@/assets/img/ehai.jpg" playsinline>
          <!-- 使用source标签明确指定视频格式 -->
          <source src="@/assets/video/vr.mp4" type="video/mp4">
          您的浏览器不支持HTML5视频播放。
        </video>
      </li>
    </ul>
    <el-button type="primary" round size="large" @click="handleClick">点击全屏观看</el-button>
    <div class="back" @click="handleBackClick">
      <i class="iconfont icon-left"></i>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
// 点击事件处理函数
const handleClick = () => {
  const video = document.querySelector('video');
  if (video) {
    video.requestFullscreen();
  }
};
// 返回事件处理函数
const handleBackClick = () => {
  router.push({ name: 'scenicdetail' })
};
</script>

<style scoped lang="scss">
.vrviews-container {
  height: 100vh;
  width: 100%;
  position: relative;
  background-color: #000;
}

.vrviews-list {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 100vh;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  /* 为每个列表项添加样式，使视频垂直居中 */
  li {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    //透视距离
    perspective: 1000px;
    // 视频旋转角度
    transform-style: preserve-3d;

    video {
      /* 修改视频尺寸，让它填充整个容器并保持宽高比 */
      width: 80%;
      height: auto;
      min-height: 290px;
      /* 确保视频至少有一定高度显示 */
      /* 保持视频比例，完全显示在容器内 */
      object-fit: contain;
      transition: all 3s linear;
      opacity: 1;
      visibility: visible;
      display: block; /* 确保视频作为块级元素显示 */
      background-color: transparent; /* 避免背景色影响 */
    }
  }

  // 为中间的视频应用椭圆样式
  //li video {
   // -webkit-clip-path: ellipse(46% 39% at 47% 55%);
    //clip-path: ellipse(46% 39% at 47% 55%);
  //}
}
.el-button {
  position: absolute;
  top: 90%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.back {
  position: absolute;
  top: 3%;
  left: 3%;
  transform: translate(-50%, -50%);
  .icon-left {
    font-size: 40px;
    color: #fff;
  }
}
</style>
