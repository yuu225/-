<template>
  <div class="layout-container">
    <!-- 左侧边栏 -->
    <div class="left-sidebar" v-show="isSidebarVisible" :style="{ transform: sidebarTransform }">
      <h3 class="sidebar-title">系统菜单</h3>
      <ul class="menu">
        <li class="menu-item" @click="navigateTo('/home')">
          <div class="menu-item-content">
            <span class="menu-text">首页</span>
          </div>
        </li>
        <li class="menu-item">
          <div class="menu-item-content" @click="togglePermissionMenu">
            <span class="menu-text">权限管理</span>
            <span class="arrow-icon" :class="{ rotated: showPermissionSubMenu }"></span>
          </div>
          <ul v-show="showPermissionSubMenu" class="sub-menu">
            <li @click="navigateTo('/teacher')">
              <span>教师管理</span>
            </li>
            <li @click="navigateTo('/student')">
              <span>学生管理</span>
            </li>
          </ul>
        </li>
        <li class="menu-item" @click="navigateTo('/score')">
          <div class="menu-item-content">
            <span class="menu-text">成绩管理</span>
          </div>
        </li>
      </ul>
    </div>

    <!-- 右侧主内容区 -->
    <div class="right-main" :style="{ marginLeft: isSidebarVisible ? '220px' : '0' }">
      <!-- 顶部用户区 -->
      <div class="top-user-area">
        <div class="menu-icon" @click="toggleSidebar()">
          <span :class="{ 'top-line-active': !isSidebarVisible }"></span>
          <span :class="{ 'middle-line-active': !isSidebarVisible }"></span>
          <span :class="{ 'bottom-line-active': !isSidebarVisible }"></span>
        </div>
        <div class="user-info">
          <span class="username" @click="toggleDropdown">
            <el-icon><User /></el-icon>
            <div class="dropdown-content" :class="{ show: isDropdownVisible }">
              <div @click="" class="userCenter">用户中心</div>
              <div @click="" class="userCenter">设置</div>
              <el-button @click="handleLogout"> 退出登录 </el-button>
            </div>
          </span>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="right-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElButton, ElIcon } from 'element-plus'
import { User } from '@element-plus/icons-vue'

export default defineComponent({
  name: 'Layout',
  components: {
    ElButton,
    ElIcon,
    User,
  },
  setup() {
    const router = useRouter()
    const showPermissionSubMenu = ref(false)
    const isSidebarVisible = ref(true)
    const isDropdownVisible = ref(false)

    const handleLogout = () => {
      localStorage.removeItem('isAuthenticated')
      router.push('/login')
      window.location.reload()
    }

    const togglePermissionMenu = () => {
      showPermissionSubMenu.value = !showPermissionSubMenu.value
    }

    const navigateTo = (path: string) => {
      router.push(path)
    }

    const toggleSidebar = () => {
      isSidebarVisible.value = !isSidebarVisible.value
    }

    const sidebarTransform = computed(() => {
      return isSidebarVisible.value ? 'translateX(0)' : 'translateX(-200px)'
    })

    const toggleDropdown = () => {
      isDropdownVisible.value = !isDropdownVisible.value
    }

    const closeDropdownOnClickOutside = (event: MouseEvent) => {
      const dropdownContent = document.querySelector('.dropdown-content') as HTMLElement
      const usernameSpan = document.querySelector('.username') as HTMLElement
      if (dropdownContent && usernameSpan) {
        if (
          !usernameSpan.contains(event.target as Node) &&
          !dropdownContent.contains(event.target as Node)
        ) {
          isDropdownVisible.value = false
        }
      }
    }

    onMounted(() => {
      window.addEventListener('click', closeDropdownOnClickOutside)
    })

    onUnmounted(() => {
      window.removeEventListener('click', closeDropdownOnClickOutside)
    })

    return {
      handleLogout,
      isSidebarVisible,
      toggleSidebar,
      sidebarTransform,
      User,
      isDropdownVisible,
      toggleDropdown,
      navigateTo,
      showPermissionSubMenu,
      togglePermissionMenu,
    }
  },
})
</script>

<style scoped>
/* 保持原有的样式不变 */
.left-sidebar {
  width: 220px;
  height: 100vh;
  background: linear-gradient(to bottom, #1e456c, #0f2d4a);
  padding: 0;
  border-right: 1px solid #3e75ac;
  box-shadow: 3px 0 15px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: fixed;
  left: 0;
  z-index: 1000;
}

.sidebar-title {
  color: #fff;
  padding: 20px 0;
  margin: 0;
  text-align: center;
  font-size: 20px;
  font-weight: 500;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.menu {
  list-style-type: none;
  padding: 10px 0;
  margin: 0;
  text-align: center;
}

.menu-item {
  margin: 0;
  width: 100%;
  cursor: pointer;
  box-sizing: border-box;
  transition: background-color 0.3s;
}

.menu-item-content {
  display: flex;
  align-items: center;
  padding: 14px 20px;
  color: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
}

.menu-item:hover .menu-item-content {
  background: rgba(138, 175, 227, 0.3);
  color: #f4f4cf;
}

.menu-icon {
  margin-right: 12px;
  font-size: 16px;
}

.menu-text {
  flex-grow: 1;
  font-size: 14px;
}

.arrow-icon {
  transition: transform 0.3s ease;
  font-size: 18px;
}

.arrow-icon.rotated {
  transform: rotate(90deg);
}

.sub-menu {
  padding: 0;
  margin: 0;
  list-style-type: none;
  background: rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.sub-menu li {
  align-items: center;
  padding: 15px 15px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.sub-menu li:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #f4f4cf;
}

.right-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-left: 220px;
}

.top-user-area {
  height: 60px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  padding: 0 20px;
  justify-content: space-between;
}

.menu-icon {
  width: 50px;
  height: 44px;
  padding: 4px 8px;
  background: white;
  box-sizing: border-box;
  cursor: pointer;
}

.menu-icon span {
  width: 100%;
  height: 4px;
  display: block;
  background: #3e75ac;
  margin: 6px 0;
  transition: 0.5s;
  transform-origin: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.right-content {
  padding: 0;
  margin: 0;
  background: #f5f7fa;
  flex: 1;
  position: relative;
  min-height: calc(100vh - 60px);
}

.el-icon {
  margin: 20px;
  font-size: 18px;
  cursor: pointer;
}

.dropdown-content {
  right: 20px;
  display: none;
  position: absolute;
  padding: 0;
  min-width: 150px;
  background: white;
  border-radius: 8px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  flex-direction: column;
  min-height: 80px;
}
.dropdown-content.show {
  display: flex;
}

.top-line-active {
  transform: translateY(10px) rotate(45deg);
}

.middle-line-active {
  opacity: 0;
}

.bottom-line-active {
  transform: translateY(-10px) rotate(-45deg);
}

.userCenter {
  padding: 10px 16px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.2s;
  color: #333;
  flex-grow: 1;
}

.el-button {
  border: none;
  background: transparent;
  color: #333;
  padding: 20px 16px;
  width: 100%;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 16px;
  margin: 0;
  border-radius: 0;
  border-radius: 0 0 8px 8px;
}
.el-button:hover {
  background-color: #f5f5f5;
  color: #f56c6c;
}
</style>
