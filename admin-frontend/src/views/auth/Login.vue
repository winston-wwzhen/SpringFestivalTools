<template>
  <div class="login-page">
    <div class="login-box">
      <div class="login-header">
        <h1>春节攻略管理后台</h1>
        <p>Spring Festival Guide Admin</p>
      </div>

      <el-form
        ref="formRef"
        :model="loginForm"
        :rules="rules"
        class="login-form"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            size="large"
            placeholder="请输入用户名"
            prefix-icon="User"
            clearable
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            size="large"
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password
            clearable
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            class="login-btn"
            @click="handleLogin"
          >
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-footer">
        <p>默认账号: admin / admin123</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { login as loginApi } from '@/api/auth'
import type { LoginForm } from '@/types'

const router = useRouter()
const authStore = useAuthStore()

const formRef = ref<FormInstance>()
const loading = ref(false)

const loginForm = reactive<LoginForm>({
  username: '',
  password: ''
})

const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true

    try {
      const res = await loginApi(loginForm)

      // 保存认证信息
      authStore.login(res.token, res.userInfo)

      ElMessage.success('登录成功')

      // 跳转到首页
      router.push('/')
    } catch (error: any) {
      ElMessage.error(error.message || '登录失败')
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped lang="scss">
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  background-size: 200% 200%;
  animation: gradientShift 15s ease infinite;
  position: relative;
  overflow: hidden;

  &::before,
  &::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    animation: float 20s ease-in-out infinite;
  }

  &::before {
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    top: -300px;
    left: -300px;
  }

  &::after {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
    bottom: -200px;
    right: -200px;
    animation-delay: -10s;
  }
}

@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(30px, -30px) rotate(120deg);
  }
  66% {
    transform: translate(-20px, 20px) rotate(240deg);
  }
}

.login-box {
  width: 420px;
  padding: 48px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.8);
  position: relative;
  z-index: 1;
  animation: slideUp 0.6s ease-out;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 4px;
    background: linear-gradient(90deg, transparent 0%, #667eea 50%, transparent 100%);
    border-radius: 0 0 4px 4px;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 40px;

  h1 {
    font-size: 32px;
    font-weight: 800;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 12px;
    letter-spacing: -0.5px;
  }

  p {
    font-size: 14px;
    color: #666;
    font-weight: 500;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
}

.login-form {
  :deep(.el-form-item) {
    margin-bottom: 28px;

    .el-input {
      .el-input__wrapper {
        border-radius: 12px;
        padding: 12px 16px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        transition: all 0.3s;

        &:hover {
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
        }

        &.is-focus {
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.25);
          border-color: #667eea;
        }
      }

      .el-input__prefix-inner {
        font-size: 18px;
        color: #667eea;
      }
    }
  }

  .login-btn {
    width: 100%;
    height: 48px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 12px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    margin-top: 8px;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 24px rgba(102, 126, 234, 0.4);
    }

    &:active {
      transform: translateY(0);
    }

    &.is-loading {
      opacity: 0.8;
    }
  }
}

.login-footer {
  margin-top: 28px;
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);

  p {
    font-size: 13px;
    color: #666;
    font-weight: 500;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}
</style>
