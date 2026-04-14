<template>
  <div class="goods-detail-container">
    <!-- 返回按钮 -->
    <div class="header">
      <div class="back-button" @click="handleBack">
        <i class="iconfont icon-fanhui2"></i>
      </div>
      <h1 class="page-title">商品详情</h1>
    </div>

    <!-- 商品图片展示区 -->
    <!-- <div class="goods-gallery">
      <div class="main-image">
        <img :src="selectedImage" :alt="goodsObj.name" @click="showImageViewer = true" />
      </div>
      <div class="thumbnails">
        <div v-for="(img, index) in goodsObj.images" :key="index" class="thumbnail-item"
          :class="{ active: selectedImageIndex === index }" @click="selectImage(index)">
          <img :src="img" :alt="`${goodsObj.name} 图片${index + 1}`" />
        </div>
      </div>
    </div> -->

    <!-- 商品基本信息 -->
    <div class="goods-info">
      <h2 class="goods-name">{{ goodsObj.name }}</h2>
      <div class="price-section">
        <span class="price">¥{{ goodsObj.price?.toFixed(2) }}</span>

      </div>
    </div>

    <!-- 商品简介 -->
    <div class="section">
      <h3 class="section-title">商品简介</h3>
      <div class="intro-content">
        <p>{{ goodsObj.detail }}</p>
      </div>
    </div>

    <!-- 制作方法 -->
    <div class="section">
      <h3 class="section-title">制作方法</h3>
      <div class="method-content">
        <ul class="steps-list">
          <li >
            {{ goodsObj.makemethod }}
          </li>
        </ul>
      </div>
    </div>

    <!-- 购买建议 -->
    <div class="section">
      <h3 class="section-title">购买建议</h3>
      <div class="suggestion-content">
        <ul class="suggestions-list">
          <li >
            <i class="iconfont icon-gou"></i>
            <span>{{ goodsObj.purchaseadvice }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- 商品评价 -->
    <div class="section">
      <h3 class="section-title">用户评价 ({{ goodsObj.comment?.length || 0 }})</h3>
      <div class="reviews-content">
        <div v-for="(item) in goodsObj.comment" :key="item.comment_id" class="review-item">
          <div class="review-header">
            <div class="reviewer-info">
              <div class="avatar">{{ item.time}}</div>
              <div class="reviewer-name">{{ item.username }}</div>
            </div>
          </div>
          <div class="review-content">{{ item.content }}</div>
          </div>
        </div>
      </div>
      <button class="load-more" @click="loadMoreReviews" v-if="showLoadMore">加载更多</button>
    </div>


    <!-- 图片查看器 -->
    <!-- <div class="image-viewer" v-if="showImageViewer" @click="closeImageViewer">
      <div class="viewer-content" @click.stop>
        <img :src="selectedImage" :alt="goodsObj.name" />
        <button class="close-button" @click="closeImageViewer">×</button>
      </div>
    </div> -->
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getGoodsDetail } from '@/apis/goods'
// import goods1 from '@/assets/img/tea.jpg'
// import goods2 from '@/assets/img/ping.jpg'
// import goods3 from '@/assets/img/tianma.jpg'
// import goods4 from '@/assets/img/huotui.jpg'
const route = useRoute()
const router = useRouter()

// 响应式数据
// const selectedImageIndex = ref(0)
const selectedImage = ref('')
// const showImageViewer = ref(false)
// const showLoadMore = ref(true)

// 商品数据
const goodsObj = ref({})
// 选择图片
// const selectImage = (index) => {
//   selectedImageIndex.value = index
//   selectedImage.value = goodsObj.value.images[index]
// }
const getDetail = async () => {
  const res = await getGoodsDetail(route.params.id)
  console.log(res)
  goodsObj.value = res.data
  // 如果有多个图片，默认选择第一张
  if (goodsObj.value.images && goodsObj.value.images.length > 0) {
    selectedImage.value = goodsObj.value.images[0]
  }
}
// 关闭图片查看器
// const closeImageViewer = () => {
//   showImageViewer.value = false
// }

// 预览评价图片
// const previewReviewImage = (img) => {
//   selectedImage.value = img
//   showImageViewer.value = true
// }

// 加载更多评价
// const loadMoreReviews = () => {
//   // 模拟加载更多评价
//   showLoadMore.value = false
//   alert('已经加载全部评价')
// }



// 返回上一页
const handleBack = () => {
  router.back()
}

// 组件挂载时初始化
onMounted(() => {
  getDetail()
})
</script>

<style scoped lang="scss">
.goods-detail-container {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 60px;

  // 头部样式
  .header {
    position: relative;
    padding: 15px 10px;
    background-color: #fff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 100;

    .back-button {
      position: absolute;
      top: 10px;
      left: 15px;
      font-size: 24px;
      color: #333;
      cursor: pointer;

      i {
        font-size: 24px;
      }
    }

    .page-title {
      text-align: center;
      margin: 0;
      font-size: 18px;
      color: #333;
      font-weight: 600;
    }
  }

  // 商品图片展示区
  .goods-gallery {
    background-color: #fff;
    padding: 15px;

    .main-image {
      width: 100%;
      height: 400px;
      margin-bottom: 15px;
      overflow: hidden;
      border-radius: 8px;
      cursor: pointer;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;

        &:hover {
          transform: scale(1.05);
        }
      }
    }

    .thumbnails {
      display: flex;
      gap: 10px;
      overflow-x: auto;
      padding-bottom: 5px;

      .thumbnail-item {
        flex: 0 0 80px;
        height: 80px;
        border-radius: 6px;
        overflow: hidden;
        cursor: pointer;
        border: 2px solid transparent;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        &.active {
          border-color: #ff6b6b;
        }
      }
    }
  }

  // 商品基本信息
  .goods-info {
    background-color: #fff;
    padding: 15px;
    margin-bottom: 10px;

    .goods-name {
      font-size: 20px;
      font-weight: 600;
      color: #333;
      margin: 0 0 10px 0;
    }

    .price-section {
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      .price {
        font-size: 24px;
        font-weight: 700;
        color: #ff6b6b;
        margin-right: 10px;
      }

      .original-price {
        font-size: 14px;
        color: #999;
        text-decoration: line-through;
        margin-right: 10px;
      }

      .discount {
        font-size: 14px;
        color: #fff;
        background-color: #ff6b6b;
        padding: 2px 6px;
        border-radius: 10px;
      }
    }

    .sales-info {
      font-size: 14px;
      color: #666;
    }
  }

  // 通用区块样式
  .section {
    background-color: #fff;
    margin-bottom: 10px;
    padding: 15px;

    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin: 0 0 15px 0;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        width: 50px;
        height: 3px;
        background-color: #ff6b6b;
      }
    }
  }

  // 商品简介
  .intro-content {
    p {
      font-size: 15px;
      line-height: 1.6;
      color: #666;
      margin: 0;
    }
  }

  // 制作方法
  .method-content {
    .steps-list {
      padding: 0;
      margin: 0;
      list-style: none;

      li {
        display: flex;
        align-items: flex-start;
        margin-bottom: 10px;
        font-size: 15px;
        line-height: 1.6;
        color: #666;

        .step-number {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          background-color: #ff6b6b;
          color: #fff;
          border-radius: 50%;
          font-size: 14px;
          margin-right: 10px;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .step-text {
          flex: 1;
        }
      }
    }
  }

  // 购买建议
  .suggestion-content {
    .suggestions-list {
      padding: 0;
      margin: 0;
      list-style: none;

      li {
        display: flex;
        align-items: flex-start;
        margin-bottom: 10px;
        font-size: 15px;
        line-height: 1.6;
        color: #666;

        i {
          color: #52c41a;
          margin-right: 10px;
          font-size: 16px;
        }
      }
    }
  }

  // 评价列表
  .reviews-content {
    .review-item {
      padding: 15px 0;
      border-bottom: 1px solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      .review-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;

        .reviewer-info {
          display: flex;
          align-items: center;

          .avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background-color: #ff6b6b;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 10px;
            font-weight: 600;
          }

          .reviewer-name {
            font-size: 15px;
            color: #333;
            font-weight: 500;
          }
        }

        .review-rating {
          i {
            font-size: 14px;
            margin-left: 2px;
          }

          .icon-xingxing {
            color: #ffd43b;
          }

          .icon-xingxing1 {
            color: #ddd;
          }
        }
      }

      .review-date {
        font-size: 12px;
        color: #999;
        margin-bottom: 8px;
      }

      .review-content {
        font-size: 15px;
        line-height: 1.6;
        color: #666;
        margin-bottom: 10px;
      }

      .review-images {
        display: flex;
        gap: 8px;

        .review-img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 6px;
          cursor: pointer;
        }
      }
    }
  }

  .load-more {
    width: 100%;
    padding: 12px;
    margin-top: 15px;
    background-color: #fff;
    border: 1px solid #eee;
    border-radius: 6px;
    color: #666;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background-color: #f5f5f5;
      color: #ff6b6b;
    }
  }

  // 底部购买栏
  .bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background-color: #fff;
    border-top: 1px solid #eee;
    display: flex;
    align-items: center;
    padding: 0 15px;
    z-index: 1000;

    .service-icons {
      display: flex;
      gap: 20px;
      margin-right: 15px;

      .icon-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 12px;
        color: #666;
        cursor: pointer;

        i {
          font-size: 20px;
          margin-bottom: 2px;
        }
      }
    }

    .action-buttons {
      flex: 1;
      display: flex;
      gap: 10px;

      button {
        flex: 1;
        height: 40px;
        border: none;
        border-radius: 20px;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .add-to-cart {
        background-color: #ff9800;
        color: #fff;
      }

      .buy-now {
        background-color: #ff6b6b;
        color: #fff;
      }

      button:hover {
        opacity: 0.9;
        transform: translateY(-2px);
      }
    }
  }

  // 图片查看器
  .image-viewer {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;

    .viewer-content {
      position: relative;
      max-width: 90%;
      max-height: 90%;

      img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }

      .close-button {
        position: absolute;
        top: -40px;
        right: -40px;
        width: 36px;
        height: 36px;
        background-color: rgba(0, 0, 0, 0.5);
        color: #fff;
        border: none;
        border-radius: 50%;
        font-size: 24px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  // 响应式设计
  @media (max-width: 768px) {
    .goods-gallery .main-image {
      height: 250px;
    }

    .image-viewer .viewer-content .close-button {
      top: 10px;
      right: 10px;
    }
  }
}
</style>
