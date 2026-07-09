<template>
  <div class="register-container">
    <van-nav-bar title="注册" left-arrow @click-left="$router.back()" />
    <div class="register-form">
      <div class="form-header">
        <h2>创建账号</h2>
        <p>注册后即可享受智能旅行服务</p>
      </div>
      <van-form @submit="handleRegister">
        <van-field
          v-model="form.nickname"
          name="nickname"
          label="昵称"
          placeholder="请输入昵称"
          :rules="[{ required: true, message: '请输入昵称' }]"
        />
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
          placeholder="请输入密码（至少6位）"
          :rules="[{ required: true, message: '请输入密码' }, { min: 6, message: '密码至少6位' }]"
        />
        <van-field
          v-model="form.confirmPassword"
          type="password"
          name="confirmPassword"
          label="确认密码"
          placeholder="请再次输入密码"
          :rules="[{ required: true, message: '请确认密码' }, { validator: checkPassword, message: '两次密码不一致' }]"
        />
        <div class="btn-wrapper">
          <van-button round block type="primary" native-type="submit" :loading="loading">
            注册
          </van-button>
        </div>
      </van-form>
      <div class="link-wrapper">
        <span class="link" @click="$router.push('/login')">已有账号？立即登录</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { post } from '../utils/request'
import { setToken, setUser, saveMockUser } from '../utils/auth'

const router = useRouter()
const loading = ref(false)

const form = reactive({
  nickname: '',
  phone: '',
  password: '',
  confirmPassword: ''
})

const checkPassword = (val) => {
  return val === form.password
}

const handleRegister = async () => {
  loading.value = true
  try {
    const res = await post('user/register', {
      nickname: form.nickname,
      phone: form.phone,
      password: form.password
    })
    if (res.code === 200) {
      setToken(res.data.token)
      setUser(res.data.user)
      showToast('注册成功')
      router.push('/profile')
    } else {
      showToast(res.message || '注册失败')
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      const mockUser = { nickname: form.nickname, phone: form.phone, password: form.password }
      saveMockUser(mockUser)
      setToken('mock_token_' + Date.now())
      setUser({ nickname: form.nickname, phone: form.phone })
      showToast('注册成功（Mock模式）')
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
.register-container {
  min-height: 100vh;
  background: #f7f8fa;
}

.register-form {
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