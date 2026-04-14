<template>
  <div class="traffic-container">
    <div class="bg">
    </div>
    <div class="content" @click="handleStyle">
      交通出行
    </div>
    <div class="plan" @click="handlePlan">定制行程</div>
    <div class="air common">
      <i class="iconfont icon-feiji"></i>
      <h3>航空</h3>
      <img src="@/assets/img/air.png" alt="">
      <div class="brief">
        <p>航空是指通过空气交通进行移动和运输的活动，通常包括飞机、直升机、民航等。</p>
      </div>
    </div>
    <div class="train common">
      <i class="iconfont icon-huoche"></i>
      <h3>火车</h3>
      <img src="@/assets/img/train.png" alt="">
      <div class="brief">
        <p>火车是一种用于移动和运输的交通工具，通常由一个或多个轮子、发动机、座椅、门和其他组件组成。</p>
      </div>
    </div>
    <div class="car common">
      <i class="iconfont icon-icon"></i>
      <h3>汽车</h3>
      <img src="@/assets/img/car.png" alt="">
      <div class="brief">
        <p>汽车是一种用于移动和运输的交通工具，通常由一个或多个轮子、发动机、座椅、门和其他组件组成。</p>
      </div>
    </div>
    <div class="drive common">
      <i class="iconfont icon-zijia"></i>
      <h3>自驾</h3>
      <img src="@/assets/img/car1.png" alt="">
      <div class="brief">
        <p>自驾是指个人在没有专业驾驶执照的情况下，通过自己的能力和技能，在没有任何监督的情况下，独立驾驶汽车前往目的地的行为。</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import {useRouter} from 'vue-router'
const router = useRouter()
const handlePlan = () => {
  router.push({ name: 'plan' })
}
</script>
<style scoped lang="scss">
.traffic-container {
  position: relative;
  width: 100%;
  height: 100%;
  //开启透视
  perspective: 1000px;
}

.bg {
  width: 100%;
  height: 100vh;
  //背景色径向渐变
  background: radial-gradient(circle,rgb(56, 187, 244) 0%, rgba(1, 178, 247) 100%);
  position: relative;
}
.content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 50px;
  //背景颜色渐变
  background: linear-gradient(to right, rgba(20,250,186) 0%, rgba(1,178,247) 100%);
  line-height: 50px;
  text-align: center;
  color: #fff;
  font-size: 20px;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  border-radius: 25px;
}
.plan {
  position: absolute;
  top: 265px;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 50px;
  //背景颜色渐变
  background: linear-gradient(to right, rgba(20,250,186) 0%, rgba(1,178,247) 100%);
  line-height: 50px;
  text-align: center;
  color: #fff;
  font-size: 20px;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  border-radius: 25px;
  cursor: pointer;
  animation: animatePlan .5s linear forwards;
}
.common{
    width: 300px;
    background-color: rgba(255, 255, 255, 0.2);
    text-align: center;
    border-radius: 25px;
   box-shadow: 0 0 8px rgba(233, 231, 231, 0.926);
}
.common i {
  font-size: 40px;
  color: #fff;
}
.common h3 {
  color: #fff;
    font-size: 31px;
    letter-spacing: 31px;
    font-weight: 500;
    margin-top: 10px;
    text-align: center;
}
.common img {
  width: 85%;
  height: 150px;
  margin:0 auto 15px;
  border-radius: 25px;
  box-shadow: 0 0 8px rgba(233, 231, 231, 0.926);
}
.common .brief {
  margin: 10px auto;
  font-size: 13px;
  color: #fff;
  line-height: 20px;
}
.air {
  position: absolute;
  top: 170px;
  left: 25%;
  animation: animate .5s linear forwards;
}
.train {
  position: absolute;
  top: 537px;
  left: 25%;
  animation: animate .5s linear forwards;
}
.car {
  position: absolute;
  top: 170px;
  left: 78%;
  animation: animate .5s linear forwards;
}
.drive {
  position: absolute;
  top: 537px;
  left: 78%;
  animation: animate .5s linear forwards;
}
//添加动画
@keyframes animate {
  0% {
    transform: translate(-50%, -50%) rotateY(180deg);
  }

  50% {
    transform: translate(-50%, -50%) rotateY(90deg);
  }

  100% {
    transform: translate(-50%, -50%) rotateY(0deg);
  }
}
//给plan添加动画
@keyframes animatePlan {
  0% {
    opacity: 0;
  }


  100% {
    opacity: 1;
  }
}
</style>
