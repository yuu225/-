<template>
  <div class="score-view">
    <h2>成绩管理界面</h2>
    <!-- 这里添加你的成绩管理内容 -->
    <p>这里是成绩管理的内容区域</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ScoreView',
})
</script>

<style scoped>
.score-view {
  padding: 20px;
  background: #fff;
  margin: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}
</style>
