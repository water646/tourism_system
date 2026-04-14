<template>
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleChange">
    <el-tab-pane label="云南特产" name="first">
      <ul class="goods-list">
        <li v-for="item in goodsList" class="goods-item" @click="handleDetail(item.id)" :key="item.id">
          <img :src="item.picture" alt="">
          <div class="goods-info">
            <p class="goods-name">{{ item.name }}</p>
            <p class="goods-desc">
              {{ item.brief }}
            </p>
            <p class="goods-price">
              <span>参考价格：</span>
              <span>￥{{ item.price }}</span>
            </p>
          </div>
        </li>
      </ul>
    </el-tab-pane>
    <!-- <el-tab-pane label="手工艺品" name="second">
      <ul class="goods-list">
        <li v-for="item in 6" class="goods-item" :key="item">
          <img src="@/assets/img/ping.jpg" alt="">
          <div class="goods-info">
            <p class="goods-name">鲜花饼</p>
            <p class="goods-desc">
              以云南特有的食用玫瑰为馅，花瓣饱满，香气浓郁。外皮酥脆，层层叠叠，内馅软糯，甜而不腻。其制作工艺考究，历史悠久，早在清代就已出现，曾是宫廷御点，如今更是深受大众喜爱，是云南的代表性美食之一
            </p>
            <p class="goods-price">
              <span>参考价格：</span>
              <span>￥50.00</span>
            </p>
          </div>
        </li>
      </ul>
    </el-tab-pane>
    <el-tab-pane label="文创周边" name="third">
      <ul class="goods-list">
        <li v-for="item in 6" class="goods-item" :key="item">
          <img src="@/assets/img/ping.jpg" alt="">
          <div class="goods-info">
            <p class="goods-name">鲜花饼</p>
            <p class="goods-desc">
              以云南特有的食用玫瑰为馅，花瓣饱满，香气浓郁。外皮酥脆，层层叠叠，内馅软糯，甜而不腻。其制作工艺考究，历史悠久，早在清代就已出现，曾是宫廷御点，如今更是深受大众喜爱，是云南的代表性美食之一
            </p>
            <p class="goods-price">
              <span>参考价格：</span>
              <span>￥50.00</span>
            </p>
          </div>
        </li>
      </ul>
    </el-tab-pane> -->
  </el-tabs>
  <div class="divider">
    <el-button type="primary" round @click="handleClick">查看更多</el-button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getGoods } from '@/apis/goods'
const goodsList = ref([])
const getGoodsList = async () => {
  const res = await getGoods()
  goodsList.value = res.data
}
onMounted(() => {
  getGoodsList()
})
const router = useRouter()

const activeName = ref('first')

const handleClick = () => {
  router.push('/goods/all')
}

const handleDetail = (item) => {
  router.push({
    path: `/goods/detail/${item}`
  })
}
</script>

<style>
.goods-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
  /* 响应式网格布局 */
  gap: 10px;
  /* 网格项水平居中 */
  padding: 20px;
  margin: 0 auto;
  width: 100%;
  max-width: 1200px;
}

.goods-item {

  height: 330px;
  border: 1px solid #e4e7ed;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  img {
    width: 100%;
    max-width: 310px;
    height: 180px;
    object-fit: cover;
    border-radius: 4px;
    /* margin-bottom: 12px; */
    /* //图片居中 */
    margin: 12px auto;

  }

  .goods-info {
    padding-left: 5px;
  }

  .goods-name {
    font-size: 20px;
    font-weight: 500;
    color: #333;
  }

  .goods-desc {
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    color: #ccc;
    margin-top: -21px;
  }

  .goods-price {
    font-size: 14px;
    font-weight: bold;
    /* color: #f00; */
    margin-top: 10px;
    margin-left: 212px;
    color: #f56c6c;
  }
}

.goods-item:hover {
  transform: translateY(-8px);
}

.divider {
  width: 100%;
  height: 2px;
  position: relative;
  /* 背景颜色为渐变 */
  background: linear-gradient(to right, rgb(160, 207, 255), rgb(198, 226, 255));
  margin: 40px 0;

  .el-button {
    position: absolute;
    left: 50%;
    top: -20px;
    transform: translateX(-50%);
    font-size: 17px;
    height: 40px;
    padding: 5px 15px;
    border-radius: 20px;
  }
}
</style>
