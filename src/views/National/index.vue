<template>
  <div class="national-container">
    <div class="bg"></div>
    <div class="content">
      <div class="clothes common" v-for="item in nationalList" :key="item.id" @click="handleClick(item.id)">
        <i class="el-icon-clothes"></i>
        <h3>{{ item.name }}</h3>
        <img :src="getImagePath(item.id)" alt="">
        <div class="brief">
          <p>{{ item.brief }}</p>
        </div>
      </div>
    </div>

  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getNational } from '@/apis/national'
const router = useRouter()
const nationalList = ref([])
const defaultList = ref([
  { id: 1, name: "民族服饰", picture: new URL('@/assets/img/clothes.png', import.meta.url).href, router: "clothes" },
  { id: 2, name: "民族节日", picture: new URL('@/assets/img/festival.png', import.meta.url).href, router: "clothes" },
  { id: 3, name: "民族表演", picture: new URL('@/assets/img/perform.png', import.meta.url).href, router: "clothes" },
  { id: 4, name: "民族历史", picture: new URL('@/assets/img/history.png', import.meta.url).href, router: "clothes" },
])
const getNationalList = async () => {
  const res = await getNational()
  nationalList.value = res.data

}
onMounted(() => {
  getNationalList()
})

const handleClick = (id) => {
  router.push({ name: defaultList.value.find((item) => item.id === id)?.router })
}
const getImagePath = (id) => {
  const imageItem = defaultList.value.find(imgItem => imgItem.id === id)
  return imageItem ? imageItem.picture : new URL('@/assets/img/clothes.png', import.meta.url).href
}


</script>
<style scoped lang="scss">
.national-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.bg {
  width: 100%;
  height: 100vh;
  background-image: url('@/assets/img/national.png');
  background-size: cover;
}

.content {
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.common {
  width: 306px;
  height: 306px;
  background-color: rgba(255, 255, 255);
  border-radius: 50%;
  padding: 20px;
  box-sizing: border-box;
  text-align: center;

  h3 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  img {
    width: 100%;
    height: 120px;
    margin-bottom: 10px;
    //图片左上角超出部分隐藏
    border-radius: 50% 50% 0 0;
  }

  .brief {
    font-size: 14px;
    line-height: 21px;
  }
}
</style>
