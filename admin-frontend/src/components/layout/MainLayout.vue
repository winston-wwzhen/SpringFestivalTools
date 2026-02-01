<template>
  <el-container class="main-layout">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '200px'" class="sidebar">
      <div class="logo">
        <span v-if="!isCollapse">春节攻略</span>
        <span v-else>春节</span>
      </div>

      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :unique-opened="true"
        router
      >
        <el-menu-item index="/dashboard">
          <el-icon><DataBoard /></el-icon>
          <template #title>仪表盘</template>
        </el-menu-item>

        <el-menu-item index="/audit">
          <el-icon><Document /></el-icon>
          <template #title>待审核</template>
        </el-menu-item>

        <el-sub-menu index="content">
          <template #title>
            <el-icon><Folder /></el-icon>
            <span>内容管理</span>
          </template>
          <el-menu-item index="/content/redpack">红包活动</el-menu-item>
          <el-menu-item index="/content/gala">春晚节目</el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/crawler">
          <el-icon><Connection /></el-icon>
          <template #title>爬虫管理</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主体内容 -->
    <el-container class="main-content">
      <!-- 顶部导航栏 -->
      <el-header class="header">
        <div class="header-left">
          <el-icon class="collapse-btn" @click="toggleCollapse">
            <Fold v-if="!isCollapse" />
            <Expand v-else />
          </el-icon>
        </div>

        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <div class="user-info">
              <el-avatar :size="32" icon="UserFilled" />
              <span class="username">{{ authStore.userInfo?.realName || '管理员' }}</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item disabled>角色：{{ roleText }}</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 页面内容 -->
      <el-main class="page-main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isCollapse = ref(false)
const activeMenu = ref(route.path)

// 监听路由变化
watch(
  () => route.path,
  (path) => {
    activeMenu.value = path
  }
)

// 角色文本
const roleText = computed(() => {
  const roleMap: Record<string, string> = {
    super_admin: '超级管理员',
    admin: '管理员',
    editor: '编辑员'
  }
  return roleMap[authStore.userInfo?.role || ''] || '未知'
})

// 切换侧边栏
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

// 处理下拉菜单命令
const handleCommand = (command: string) => {
  if (command === 'logout') {
    ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      authStore.logout()
      router.push('/login')
    })
  }
}
</script>

<style scoped lang="scss">
.main-layout {
  width: 100%;
  height: 100vh;
}

.sidebar {
  background: #304156;
  transition: width 0.3s;

  .logo {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: bold;
    color: #fff;
    background: rgba(0, 0, 0, 0.1);
  }

  .el-menu {
    border-right: none;
  }
}

.main-content {
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border-bottom: 1px solid #eee;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;

  .collapse-btn {
    font-size: 20px;
    cursor: pointer;
    color: #666;

    &:hover {
      color: #333;
    }
  }
}

.header-right {
  .user-info {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 4px;
    transition: background 0.3s;

    &:hover {
      background: #f5f5f5;
    }

    .username {
      font-size: 14px;
      color: #333;
    }
  }
}

.page-main {
  background: #f5f5f5;
  overflow-y: auto;
}

// 页面切换动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
