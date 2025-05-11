<template>
  <div class="home-view">
    <div class="welcome-time">
      <p class="welcome-message">欢迎使用本系统！</p>
      <p class="current-time">{{ currentTime }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'

export default defineComponent({
  name: 'HomeView',
  setup() {
    const currentTime = ref(new Date().toLocaleTimeString())

    const updateTime = () => {
      currentTime.value = new Date().toLocaleTimeString()
    }

    let intervalId: number | null = null

    onMounted(() => {
      intervalId = setInterval(updateTime, 1000)
    })

    onUnmounted(() => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    })

    return {
      currentTime,
    }
  },
})
</script>

<style scoped>
.welcome-time {
  padding: 20px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  margin: 20px;
  border-radius: 8px;
}

.welcome-message {
  font-size: 18px;
  font-weight: 500;
  color: #333;
  margin-bottom: 10px;
}

.current-time {
  font-size: 16px;
  color: #666;
}
</style>
