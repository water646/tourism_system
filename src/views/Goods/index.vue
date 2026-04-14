<template>
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleChange">
    <el-tab-pane label="云南特产" name="first">
      <ul class="goods-list">
        <li v-for="item of pageInfo.filter(item => item.type === '云南特产')" :key="item.name"  class="goods-item" @click="handleDetail(item)">
          <!-- <img src="https://img2.baidu.com/it/u=3522225222,2825748222&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500" alt=""> -->

            <img :src=item.picture alt="">
            <div class="goods-info">
              <p class="goods-name">{{ item.name }}</p>
              <p class="goods-desc">
                {{ item.brief }}
              </p>
              <p class="goods-price">
                <span>参考价格：</span>
                <span>{{ '￥'+item.price}}</span>
              </p>
            </div>  
          
        </li>
      </ul>
    </el-tab-pane>
    <el-tab-pane label="手工艺品" name="second">
      <ul class="goods-list">
        <li v-for="item of pageInfo.filter(item => item.type === '手工艺品')" :key="item.name" class="goods-item" @click="handleDetail(item)">
          <!-- <img src="https://img2.baidu.com/it/u=3522225222,2825748222&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500" alt=""> -->
          <img :src="item.picture" alt="">
          <div class="goods-info">
            <p class="goods-name">{{ item.name }}</p>
            <p class="goods-desc">
              {{ item.brief }}
            </p>
            <p class="goods-price">
              <span>参考价格：</span>
              <span>{{ '￥' + item.price }}</span>
            </p>
          </div>
        </li>
      </ul>
    </el-tab-pane>
    <el-tab-pane label="文创周边" name="third">
      <ul class="goods-list">
        <li v-for="item of pageInfo.filter(item => item.type === '文创周边')" :key="item.name" class="goods-item" @click="handleDetail(item)">
          <img :src="item.picture" alt="">
          <div class="goods-info">
            <p class="goods-name">{{ item.name }}</p>
            <p class="goods-desc">
              {{ item.brief }}
            </p>
            <p class="goods-price">
              <span>参考价格：</span>
              <span>{{ '￥' + item.price }}</span>
            </p>
          </div>
        </li>
      </ul>
    </el-tab-pane>
  </el-tabs>
  <div class="divider">
    <el-button type="primary" round @click="">查看更多</el-button>
  </div>
</template>

<script setup>
import http from '@/utils/https'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const activeName = ref('first')

const handleClick = () => {
  router.push('/goods/all')
}

const handleDetail = (item) => {
  
  router.push({
    path: '/goods/detail',
    query: {
      id: item.id
    },
  })
}

const pageInfo = ref([])

const loadResouce = async() =>{
  const res = await http.get('/api/goodsDisplay')
  pageInfo.value = res.data
}

onMounted(()=>{
  loadResouce();
})
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
  img{
      width: 100%;
      max-width: 310px;
      height: 180px;
      object-fit: cover;
      border-radius: 4px;
      /* margin-bottom: 12px; */
      /* //图片居中 */
      margin: 12px auto ;

  }
  .goods-info{
    padding-left: 5px;
  }
  .goods-name{
    font-size: 20px;
    font-weight: 500;
    color: #333;
  }
  .goods-desc{
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    color: #ccc;
    margin-top: -21px;
  }
  .goods-price{
    font-size: 14px;
    font-weight: bold;
    /* color: #f00; */
    margin-top: 10px;
    margin-left: 212px;
    color: #f56c6c;
  }
}
.goods-item:hover{
    transform:translateY(-8px);
  }
.divider{
  width: 100%;
  height: 2px;
 position: relative;
 /* 背景颜色为渐变 */
  background: linear-gradient(to right, rgb(160, 207, 255), rgb(198, 226, 255));
  margin: 40px 0;
  .el-button{
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