<template>
  <div class="scenic-container">
    <ul class="scenic-list">
      <li v-for="item in scenicList" :key="item.id" @click="handleClick(item.id)">
        <img :src="item.image" alt="景点1">
        <h3>{{ item.name }}</h3>
        <p>{{ item.introduction }}</p>
      </li>
    </ul>
    <el-pagination
    size="small"
    background
    layout="prev, pager, next"
    :total="50"
    class="mt-4"
  />
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { getScenic } from '@/apis/scenic'
import { useRouter } from 'vue-router'
const router = useRouter()
const handleClick = (id) => {
  router.push({
    path: `/scenic/detail/${id}`,
  })
}
const scenicList = ref([])
const getScenicList = async () => {
  const res = await getScenic()
  scenicList.value = res.data
}
onMounted(() => {
  getScenicList()
})
</script>
<style scoped lang="scss" >
  .scenic-container {
    position: relative;
    background: url('@/assets/img/luguhu.jpg') no-repeat center center/cover;
    height: 100vh;
    width: 100%;
  }
  .scenic-list {
    position: absolute;
    top:70%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: grid;
    grid-template-columns: repeat(4, auto);
    gap: 30px;
    padding: 20px;
  }
  .scenic-list li {
    text-align: center;
    width: 250px;
    //height: 250px;
    border: 1px solid #000;
    border-radius: 10px;
    background-color: #fff;
    padding: 10px;
  }
  .scenic-list li img {
    width: 250px;
    height: 110px;
    margin-bottom: 10px;
    border-radius: 10px;
  }
  //将分页器定位到右下角
  .mt-4 {
    position: absolute;
    top: 95%;
    right: 0px;
    transform: translate(-50%, -50%);
  }
</style>
