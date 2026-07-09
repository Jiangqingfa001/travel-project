<template>
  <div class="login-container">
    <van-nav-bar title="登录" left-arrow @click-left="$router.back()" />
    <div class="login-form">
      <div class="form-header">
        <h2>欢迎回来</h2>
        <p>登录您的账号，开始智能旅行</p>
      </div>
      <van-form @submit="handleLogin">
        <van-field
          v-model="form.phone"
          name="phone"
          label="手机号"
          placeholder="请输入手机号"
          :rules="[{ required: true, message: '请输入手机号' }, { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }]"
        />
        <van-field
          v-model="form.password"
          type="password"
          name="password"
          label="密码"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请输入密码' }, { min: 6, message: '密码至少6位' }]"
        />
        <div class="btn-wrapper">
          <van-button round block type="primary" native-type="submit" :loading="loading">
            登录
          </van-button>
        </div>
      </van-form>
      <div class="link-wrapper">
        <span class="link" @click="$router.push('/register')">还没有账号？立即注册</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { post } from '../utils/request'
import { setToken, setUser, findMockUserByPhone } from '../utils/auth'

const router = useRouter()
const loading = ref(false)

const form = reactive({
  phone: '',
  password: ''
})

const handleLogin = async () => {
  loading.value = true
  try {
    const res = await post('user/login', {
      phone: form.phone,
      password: form.password
    })
    if (res.code === 200) {
      setToken(res.data.token)
      setUser(res.data.user)
      showToast('登录成功')
      router.push('/profile')
    } else {
      showToast(res.message || '登录失败')
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      const mockUser = findMockUserByPhone(form.phone)
      const nickname = mockUser ? mockUser.nickname : form.phone
      setToken('mock_token_' + Date.now())
      setUser({ nickname, phone: form.phone })
      showToast('登录成功（Mock模式）')
      router.push('/profile')
    } else {
      showToast('网络错误，请稍后重试')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: #f7f8fa;
}

.login-form {
  padding: 20px 16px;
}

.form-header {
  text-align: center;
  margin-bottom: 30px;
}

.form-header h2 {
  font-size: 24px;
  color: #323233;
  margin-bottom: 8px;
}

.form-header p {
  font-size: 14px;
  color: #969799;
}

.btn-wrapper {
  margin: 24px 16px 0;
}

.link-wrapper {
  text-align: center;
  margin-top: 20px;
}

.link {
  color: #1989fa;
  font-size: 14px;
}
</style>