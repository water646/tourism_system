<template>
  <div class="login-container">
    <a href="/">首页</a>
    <div class="login-content">
      <h2>登录</h2>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="请输入密码" type="password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" class="login-button">登录</el-button>
          <el-button type="link" @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import axios from 'axios';
import { ElMessage } from 'element-plus';
const router = useRouter()

const form = ref({
  username: '',
  password: ''
})

const formRef = ref(null)

const rules = ref({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
})

const handleLogin = async() => {
  const res = await axios.post('/api/login',{usn:form.value.username,pwd:form.value.password})
  if (res.data.status=='success'){
    ElMessage.success('登录成功')
  }
  else{
    alert('用户名或密码错误！')
    return
  }

  router.push('/')
}
// 取消登录
const handleCancel = () => {
  // 清空表单数据
  form.value.username = ''
  form.value.password = ''
  // 重置表单校验状态
  formRef.value.resetFields()
}
// 首页点击事件
// const handleHomeClick = () => {
//   router.push('/')
// }
</script>
<style scoped lang="scss">
.login-container {
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background: url('@/assets/img/home.png') no-repeat center center/cover;
}
// 首页链接
.login-container a {
  display: block;
  position: absolute;
  top: 20px;
  right: 50px;
  font-size: 18px;
  font-weight: 500;
  color:#000;
  text-decoration: none;
  width: 50px;
  height: 50px;
  //渐变背景
  background-color: rgba(0, 0, 0, 0.1);
  // padding: 5px 10px;
  border-radius: 25px;
  transition: all 0.3s ease;
  text-align: center;
  line-height: 50px;
}
.login-container a:hover {
  background-color: rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
}
.login-content {
  width: 400px;
  padding-right: 50px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin: 333px 300px;
}
.login-content h2 {
  // text-align: center;
  margin-left: 150px;
  margin-top: 20px;
  letter-spacing: 50px;
  font-size: 30px;
  font-weight: 500;
}
.login-content .el-form-item {
  margin: 25px auto;
  display: flex;
  justify-content: center;
}
// 登录按钮两个按钮之间间距变大
.login-button {
  margin-right: 68px;
}


</style>
