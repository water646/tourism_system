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
    <div class="goods-gallery">
      <div class="main-image">
        <img :src="selectedImage" :alt="goods.name" @click="showImageViewer = true" />
      </div>
      <div class="thumbnails">
        <div 
          v-for="(img, index) in goods.images" 
          :key="index"
          class="thumbnail-item"
          :class="{ active: selectedImageIndex === index }"
          @click="selectImage(index)"
        >
          <img :src="img" :alt="`${goods.name} 图片${index + 1}`" />
        </div>
      </div>
    </div>

    <!-- 商品基本信息 -->
    <div class="goods-info">
      <h2 class="goods-name">{{ goods.name }}</h2>
      <div class="price-section">
        <span class="price">¥{{ goods.price.toFixed(2) }}</span>
       
      </div>
    </div>

    <!-- 商品简介 -->
    <div class="section">
      <h3 class="section-title">商品简介</h3>
      <div class="intro-content">
        <p>{{ goods.intro }}</p>
      </div>
    </div>

    <!-- 制作方法 -->
    <div class="section">
      <h3 class="section-title">制作方法</h3>
      <div class="method-content">
        <ul class="steps-list">
          <li v-for="(step, index) in goods.manufacturingMethod" :key="index">
            <span class="step-number">{{ index + 1 }}</span>
            <span class="step-text">{{ step }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- 购买建议 -->
    <div class="section">
      <h3 class="section-title">购买建议</h3>
      <div class="suggestion-content">
        <ul class="suggestions-list">
          <li v-for="(suggestion, index) in goods.purchaseSuggestions" :key="index">
            <i class="iconfont icon-gou"></i>
            <span>{{ suggestion }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!--郭健城写的评价栏-->
    <!-- <div class="section">
      <h3 class="section-title">评价</h3>
      <el-input v-model="your_comment" size="large" type="textarea" :rows="5" placeholder="此处输入评价..."></el-input>
      <div style="display: flex; justify-content: flex-end; margin-top:10px;">
        <el-button @click="sendComment()">发送</el-button>
      </div>
    </div> -->

    <!-- 商品评价 -->
    <div class="section">
      <h3 class="section-title">用户评价 ({{ goods.reviews.length }})</h3>
      <div class="reviews-content">
        <div 
          v-for="(review, index) in goods.reviews" 
          :key="index"
          class="review-item"
        >
          <div class="review-header">
            <div class="reviewer-info">
              <div class="avatar">{{ review.user.charAt(0) }}</div>
              <div class="reviewer-name">{{ review.user }}</div>
            </div>
            <div class="review-rating">
              <i 
                v-for="star in 5" 
                :key="star"
                class="iconfont"
                :class="star <= review.rating ? 'icon-xingxing' : 'icon-xingxing1'"
              ></i>
            </div>
          </div>
          <div class="review-date">{{ review.date }}</div>
          <div class="review-content">{{ review.content }}</div>
          <div class="review-images" v-if="review.images && review.images.length > 0">
            <img 
              v-for="(img, imgIndex) in review.images" 
              :key="imgIndex"
              :src="img" 
              :alt="`用户评价图片${imgIndex + 1}`"
              class="review-img"
              @click="previewReviewImage(img)"
            />
          </div>
        </div>
      </div>
      <button class="load-more" @click="loadMoreReviews" v-if="showLoadMore">加载更多</button>
    </div>


    <!-- 图片查看器 -->
    <div class="image-viewer" v-if="showImageViewer" @click="closeImageViewer">
      <div class="viewer-content" @click.stop>
        <img :src="selectedImage" :alt="goods.name" />
        <button class="close-button" @click="closeImageViewer">×</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import http from '@/utils/https'
import goods1 from '@/assets/img/tea.jpg'
import goods2 from '@/assets/img/ping.jpg'
import goods3 from '@/assets/img/tianma.jpg'
import goods4 from '@/assets/img/huotui.jpg'
const route = useRoute()
const router = useRouter()

// 响应式数据
const selectedImageIndex = ref(0)
const selectedImage = ref('')
const showImageViewer = ref(false)
const showLoadMore = ref(true)
const your_comment = ref('')

// 商品数据
const defaultGoods = {
  id: 1,
  name: '云南少数民族特色手工布艺包',
  price: 128.00,
  originalPrice: 198.00,
  discount: '6.5',
  sales: 238,
  stock: 156,
  intro: '这是一款融合云南少数民族传统工艺的手工布艺包，采用优质天然面料精心缝制而成。包身图案源自彝族传统纹样，色彩鲜艳，寓意吉祥。手工刺绣工艺精湛，每一针每一线都展现了匠人的用心。包型设计时尚实用，内部空间充足，配有多个隔层，方便收纳各种物品。无论是日常使用还是旅行携带，都是彰显个性与品味的理想选择。',
  images: [
    goods1,
    goods2,
    goods3,
    goods4
  ],
  manufacturingMethod: [
    '选取优质天然棉麻面料，经过清洗、晾晒、熨烫处理',
    '根据传统图案设计，使用天然植物染料进行染色',
    '手工艺人采用平绣、锁绣等多种刺绣技法，在面料上绣制精美图案',
    '按照设计图纸裁剪布料，精心缝制包身各部分',
    '安装金属配件，进行最后的整理和质量检查'
  ],
  purchaseSuggestions: [
    '建议手洗或干洗，避免机洗损伤刺绣图案',
    '存放时请避开潮湿、阳光直射的环境',
    '搭配民族风服饰效果更佳，也可与现代服装混搭',
    '适合作为礼品赠送亲友，具有浓厚的文化特色',
    '如有轻微色差属于正常现象，每一件都是独一无二的手工艺品'
  ],
  reviews: [
    {
      id: 1,
      user: '旅行者小明',
      rating: 5,
      date: '2024-01-15',
      content: '包的质量非常好，刺绣很精美，图案也很有民族特色。容量够大，日常使用完全没问题。朋友看到都很喜欢，已经推荐给她们了。',
      images: []
    },
    {
      id: 2,
      user: '民族风爱好者',
      rating: 4,
      date: '2024-01-10',
      content: '手工工艺确实不错，图案很精致。唯一一点小遗憾是肩带有点短，希望能改进一下。不过整体来说还是很满意的一次购物。',
      images: [goods4]
    },
    {
      id: 3,
      user: '文艺青年',
      rating: 5,
      date: '2024-01-05',
      content: '超级喜欢这个包！面料舒适，做工精细，每次背出去都会有人问在哪里买的。传统文化与现代设计的完美结合，值得推荐！',
      images: [goods3,goods1]
    }
  ]
}
const goods = ref({ ...defaultGoods })

const normalizeListText = (text = '') => {
  return String(text)
    .split(/\r?\n/)
    .map(item => item.trim())
    .filter(Boolean)
}

const loadResource = async () => {
  const goodsId = route.query.id || route.params.id || 1
  try {
    const detailRes = await http.get('/api/goodsDetail', {
      params: { id: goodsId },
    })
    let apiImage = ''
    try {
      const displayRes = await http.get('/api/goodsDisplay')
      const displayList = Array.isArray(displayRes.data) ? displayRes.data : []
      const matched = displayList.find((item) => String(item.id) === String(goodsId))
      apiImage = matched?.picture || ''
    } catch (error) {
      apiImage = ''
    }

    const detail = detailRes.data || {}
    const comments = Array.isArray(detail.comment) ? detail.comment : []

    // 优先使用 API 图片，若无则回退默认本地图
    const imageList = apiImage ? [apiImage] : defaultGoods.images
    goods.value = {
      ...defaultGoods,
      id: detail.good_id ?? defaultGoods.id,
      name: detail.name ?? defaultGoods.name,
      price: Number(detail.price ?? defaultGoods.price),
      intro: detail.detail ?? defaultGoods.intro,
      images: imageList,
      manufacturingMethod: normalizeListText(detail.makemethod).length
        ? normalizeListText(detail.makemethod)
        : defaultGoods.manufacturingMethod,
      purchaseSuggestions: normalizeListText(detail.purchaseadvice).length
        ? normalizeListText(detail.purchaseadvice)
        : defaultGoods.purchaseSuggestions,
      reviews: comments.map((item) => ({
        id: item.comment_id,
        user: item.username || '匿名用户',
        rating: 5,
        date: item.time ? String(item.time).slice(0, 10) : '',
        content: item.content || '',
        images: [],
      })),
    }
  } catch (error) {
    goods.value = { ...defaultGoods }
  }

  if (goods.value.images && goods.value.images.length > 0) {
    selectedImage.value = goods.value.images[0]
    selectedImageIndex.value = 0
  }
}

// 选择图片
const selectImage = (index) => {
  selectedImageIndex.value = index
  selectedImage.value = goods.value.images[index]
}

// 关闭图片查看器
const closeImageViewer = () => {
  showImageViewer.value = false
}

// 预览评价图片
const previewReviewImage = (img) => {
  selectedImage.value = img
  showImageViewer.value = true
}

// 加载更多评价
const loadMoreReviews = () => {
  // 模拟加载更多评价
  showLoadMore.value = false
  alert('已经加载全部评价')
}



// 返回上一页
const handleBack = () => {
  router.back()
}

// 组件挂载时初始化
onMounted(() => {
  loadResource()
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
