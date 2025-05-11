<script lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const router = useRouter()
    const username = ref('')
    const password = ref('')
    const message = ref('')
    const showMessage = ref(false)
    const messageType = ref('')
    const isLoading = ref(false)

    const mockUsers = [
      { username: 'admin', password: '123456' },
      { username: 'user', password: '654321' },
    ]

    const showToast = (text: string, type: 'success' | 'error') => {
      message.value = text
      messageType.value = type
      showMessage.value = true
      setTimeout(() => {
        showMessage.value = false
      }, 3000)
    }

    const handleLogin = async () => {
      isLoading.value = true

      try {
        const isValid = mockUsers.some(
          (user) => user.username === username.value && user.password === password.value,
        )

        if (isValid) {
          localStorage.setItem('isAuthenticated', 'true')
          showToast('登录成功！', 'success')

          const redirectPath = router.currentRoute.value.query.redirect?.toString() || '/home'
          await new Promise((resolve) => setTimeout(resolve, 500))
          await router.push(redirectPath)

          if (redirectPath === '/home') {
            window.location.reload()
          }
        } else {
          showToast('账号或密码错误！', 'error')
          localStorage.removeItem('isAuthenticated')
        }
      } catch (err) {
        showToast('登录异常: ' + (err as Error).message, 'error')
      } finally {
        isLoading.value = false
      }
    }

    return {
      username,
      password,
      handleLogin,
      message,
      showMessage,
      messageType,
      isLoading,
    }
  },
}
</script>

<template>
  <div class="background">
    <div class="title">后台管理系统</div>
    <div class="container">
      <div class="left"></div>
      <div class="right">
        <transition name="fade">
          <div v-if="showMessage" class="message-box" :class="messageType">
            {{ message }}
          </div>
        </transition>
        <div class="form">
          <form @submit.prevent="handleLogin">
            <div class="form1">
              <p>用户名</p>
              <el-input
                class="first_input"
                v-model="username"
                type="text"
                placeholder="请输入用户名"
                :disabled="isLoading"
              />
            </div>
            <p>密码</p>
            <el-input
              class="second_input"
              v-model="password"
              type="password"
              placeholder="请输入密码"
              show-password
              :disabled="isLoading"
            />
            <el-button type="primary" native-type="submit" class="submit-btn" :loading="isLoading">
              登录
            </el-button>
            <a href="#" class="forgot-link">忘记密码</a>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.background {
  height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0;
  background: url(src/assets/background1.jpg);
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.title {
  font-size: 40px;
  font-weight: 550;
  text-align: center;
  color: #d2da3b;
  padding: 20px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.container {
  width: 50%;
  height: 400px;
  background: white;
  margin: 0 auto;
  border: 2px solid #fff;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
  display: flex;
  border-radius: 10px;
  overflow: hidden;
}

.container .left {
  width: 50%;
  height: 100%;
  background: url(src/assets/background2.jpg);
  background-size: cover;
}

.container .right {
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.form {
  width: 80%;
  padding: 20px;
}

.form1 {
  margin: 0 0 20px;
}

.form p {
  margin: 5px 0;
  font-weight: bold;
  color: #a6af13;
}

.form input {
  width: 100%;
  margin-bottom: 20px;
  padding: 8px;
  box-sizing: border-box;
}

.submit-btn {
  width: 100%;
  height: 40px;
  color: #fff;
  background: #262626;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  margin-top: 20px;
}

.submit-btn:hover {
  background: #a6af13;
}

.forgot-link {
  display: block;
  text-align: center;
  margin-top: 10px;
  color: #262626;
  font-size: 12px;
  font-weight: bold;
  text-decoration: none;
  transition: color 0.3s;
}

.forgot-link:hover {
  color: #a6af13;
}

.message-box {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 24px;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  animation: slideIn 0.3s ease-out;
}

.message-box.success {
  background-color: #67c23a;
}

.message-box.error {
  background-color: #f56c6c;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
</style>
