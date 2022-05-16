<!--
Author: zusheng
Date: 2022-05-08 16:47:28
LastEditTime: 2022-05-15 21:35:05
Description: 用户主页
FilePath: \uni-preset-vue-vite-ts\src\pages\index\setting.vue
-->
<script lang="ts" setup>
import TheNavBar from '@/components/TheNavBar.vue'
import ThePlayerBottomBar from '@/components/ThePlayerBottomBar.vue'
import { reactive, ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useStore } from '@/store'
import { useStore as useUserStore } from '@/store/user'

const store = useStore()
const userStore = useUserStore()
const data = reactive<any>({
  // 初始化状态
})

onShow(() => store.setTheme('raw'))

const pageStyle = computed(() => store.getPageMetaStyle)
const themeDark = computed(() => store.themeConfig.theme === 'dark')
const loginStatus = computed(() => userStore.getIsAuth)
function themeChange(e: any) {
  if (e.detail.value) {
    store.setTheme('dark')
  } else {
    store.setTheme('light')
  }
}

// 退出登录
function exit() {
  uni.removeStorageSync('cookie')
  userStore.$reset()
  setTimeout(() => uni.reLaunch({ url: `./user` }), 0)
}

// 前往登录
function login() {
  uni.switchTab({ url: './user' })
}

// 前往自定义主页
function toSettingHome() {
  uni.navigateTo({ url: '../customize/home' })
}
</script>

<template>
  <page-meta :page-style="pageStyle" />

  <!-- ↓ 自定义导航 -->
  <the-nav-bar title="设置" :back="false" :filter="false" :bg="true" />

  <!-- ↓ 播放器 -->
  <the-player-bottom-bar />

  <view class="setting-wrap fixed-top fixed-bottom">
    <!-- 设置列表 -->
    <view class="setting-list">
      <view class="setting-list-item">
        <view class="setting-list-item-title">夜间模式</view>
        <switch
          class="setting-switch-btn"
          color="#D1403C"
          @change="themeChange"
          :checked="themeDark"
        />
      </view>
      <view class="setting-list-item">
        <view class="setting-list-item-title">青少年模式</view>
        <switch class="setting-switch-btn" color="#D1403C" />
      </view>
      <view class="setting-list-item" @tap="toSettingHome">
        <view class="setting-list-item-title">自定义主页</view>
      </view>
    </view>

    <!-- 退出登录 -->
    <view class="setting-login">
      <view v-if="loginStatus" class="setting-exit-btn" @tap="exit">退出登录</view>
      <view v-else class="setting-login-btn" @tap="login">未登录</view>
    </view>
  </view>
</template>

<style lang="less" scoped>
.setting-wrap {
  width: 100%;
  min-height: calc(100vh - var(--window-bottom));
  box-sizing: border-box;
  position: relative;

  .setting-list {
    overflow: hidden;
    margin: 32rpx;
    background-color: var(--theme-background-color-card);
    border-radius: 12rpx;

    .setting-list-item {
      width: 100%;
      height: 96rpx;
      padding: 0 32rpx;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: var(--theme-text-title-color);

      .setting-switch-btn {
        transform: scale(0.8);
      }
    }
  }

  .setting-login {
    width: 100%;
    height: 96rpx;
    padding: 0 32rpx;
    box-sizing: border-box;

    .setting-login-btn,
    .setting-exit-btn {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12rpx;
    }

    .setting-login-btn {
      color: var(--theme-text-title-color);
      background-color: var(--theme-background-color-card);
    }

    .setting-exit-btn {
      color: #fff;
      background-color: var(--theme-color);
    }
  }
}
</style>

