<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref, watch } from 'vue'
import { userRegisterService, userLoginService } from '@/api/user'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'
const isRegister = ref(false)
const form = ref()
const ruleForm = ref({
  username: '',
  password: '',
  repassword: ''
})
//调用useRouter()来访问路由器
const router = useRouter()

//监听isRegister清空表单数据
watch(isRegister, () => {
  ruleForm.value = {
    username: '',
    password: '',
    repassword: ''
  }
})

//注册的预校验和信息提交
const register = async () => {
  await form.value.validate()
  await userRegisterService(ruleForm.value)
  ElMessage.success('注册成功')
  // 切换到登录
  isRegister.value = false
}

//登陆的预校验和信息提交
const useStore = useUserStore()
const login = async () => {
  await form.value.validate()
  const res = await userLoginService(ruleForm.value)
  useStore.setToken(res.data.token)
  ElMessage.success('登陆成功')
  router.push('/')
}

//自定义2次密码校验
const repassword = (rule, value, callback) => {
  if (value !== ruleForm.value.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

//校验规则
const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { pattern: /^\S{6,11}$/, message: '长度在 6-11 个字符', trigger: 'blur' }
  ],
  repassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { pattern: /^\S{6,11}$/, message: '长度在 6-11 个字符', trigger: 'blur' },
    { validator: repassword, trigger: 'blur' }
  ]
})

//监听回车键
document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    login()
  }
})
</script>

<template>
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <!-- 注册模块 -->
      <el-form :model="ruleForm" :rules="rules" ref="form" size="large" v-if="isRegister">
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="ruleForm.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="ruleForm.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            v-model="ruleForm.repassword"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入再次密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="register" class="button" type="primary" auto-insert-space>
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false"> ← 返回 </el-link>
        </el-form-item>
      </el-form>
      <!-- 登陆模块 -->
      <el-form :model="ruleForm" :rules="rules" ref="form" size="large" autocomplete="off" v-else>
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="ruleForm.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="ruleForm.password"
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item>
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            @keydown.enter="login"
            @click="login"
            class="button"
            type="primary"
            auto-insert-space
            >登录</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-link type="info" :underline="false" @click="isRegister = true"> 注册 → </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
  .bg {
    background:
      url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
      url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
