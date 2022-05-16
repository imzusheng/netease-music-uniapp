<!--
Author: zusheng
Date: 2022-05-08 16:47:28
LastEditTime: 2022-05-15 21:15:48
Description: 用户主页
FilePath: \uni-preset-vue-vite-ts\src\pages\customize\home.vue
-->
<script lang="ts" setup>
import TheNavBar from '@/components/TheNavBar.vue'
import { reactive, ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useStore } from '@/store'
import { useStore as useUserStore } from '@/store/user'

const store = useStore()

onShow(() => store.setTheme('raw'))

const pageStyle = computed(() => store.getPageMetaStyle)
</script>

<template>
  <page-meta :page-style="pageStyle" />

  <!-- ↓ 自定义导航 -->
  <the-nav-bar title="自定义主页" :back="true" :filter="false" :bg="true" />

  <view class="setting-home-wrap fixed-top fixed-bottom"> </view>
</template>

<style lang="less" scoped>
.setting-home-wrap {
  width: 100%;
  min-height: calc(100vh - var(--window-bottom));
  box-sizing: border-box;
  position: relative;
}
</style>

