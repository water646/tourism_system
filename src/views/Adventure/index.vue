<template>
  <div class="adventure-container">
    <ul class="adventure-content">
      <li v-for="(item, index) in tableData" :key="index">
        <img :src="item.img" alt="">
        <h3>{{ item.name }}</h3>
        <!-- //图标循环渲染 -->
        <i v-for="(item, index) in 5" :key="index" class="iconfont icon-wujiaoxing-"></i>
        <i class="iconfont icon-liulan"></i>
        <i class="iconfont icon-liuyan"></i>
        <p>{{ item.brief }}</p>
      </li>
    </ul>
    <div class="ranking">
      <h3>热门探险路线</h3>
      <el-table :data="tableData" stripe highlight-current-row>
        <el-table-column fixed prop="rank" label="排行" />
        <el-table-column prop="name" label="路线名称" />
      </el-table>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import xianggelila from '@/assets/img/xianggelila.jpg'
import nujiang from '@/assets/img/nujiang.jpg'
import yuantian from '@/assets/img/yuantian.jpg'
import xishuangbanna from '@/assets/img/xishuangbanna.jpg'
const tableData = [
  {
    rank: '1',
    name: '香格里拉普达措国家公园探险',
    brief:'香格里拉普达措国家公园以高原湖泊、原始森林和雪山景观闻名。徒步环湖或穿越草甸，可以欣赏碧塔海的宁静与属都湖的野性风光。这里海拔较高，空气清新，非常适合喜爱摄影和高山探险的游客。',
    img:xianggelila
  },
  {
    rank: '2',
    name: '怒江大峡谷探险',
    brief:'怒江大峡谷以险峻、原始和多民族文化闻名。沿江徒步或乘船，可欣赏悬崖峭壁、瀑布溪流及梯田风光。途经怒族、傈僳族等村寨，体验浓郁民俗风情，是挑战体力与探索自然的理想路线。',
    img:nujiang
  },
  {
    rank: '3',
    name: '元阳梯田徒步线路',
    brief:'元阳梯田以壮观的哈尼梯田闻名，春季水田映天，秋季金黄满坡。沿梯田小径徒步，可以近距离感受哈尼族智慧与自然和谐共生的景象。夜宿村寨还能体验民俗风情，是摄影与轻探险结合的路线。',
    img:yuantian
  },
  {
    rank: '4',
    name: '西双版纳热带雨林探险',
    brief:'西双版纳拥有丰富的热带雨林生态，徒步穿行原始林区，可观察野生动物、奇花异草。探险过程中还能体验傣族文化和泼水节风情。雨林中的吊桥、瀑布和河流，为冒险增添刺激与乐趣。',
    img:xishuangbanna
  },
]
</script>
<style scoped lang="scss">
.adventure-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.adventure-content {
  width: 70%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  li {
    width: 400px;
    border: 1px solid #ccc;
    box-shadow: 0 0 20px rgba(203, 222, 247, 0.955);
    border-radius: 10px;
    padding: 20px;
    background: rgba(81, 198, 247, 0.8);
    color: #fff;
    text-shadow: 0 0 10px #000;

    img {
      width: 100%;
      height: 280px;
      border-radius: 10px;
      margin-bottom: 20px;
    }

    h3 {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 10px;
      color: #fff;
    }

    .icon-wujiaoxing- {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 10px;
      margin-right: 5px;
      color: rgb(234, 149, 24);
    }
  
    .icon-liulan,
    .icon-liuyan {
      font-size: 20px;
      margin-left: 20px;
    }
    p {
      font-size: 16px;
      line-height: 1.5;
      text-indent: 2em;
    }
  }
}

.ranking {
  width: 30%;
  margin: 0 auto;

  h3 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
    text-align: center;
  }
}
</style>
