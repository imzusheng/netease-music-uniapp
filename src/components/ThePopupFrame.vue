<!--
Author: zusheng
Date: 2022-05-01 23:49:11
LastEditTime: 2022-05-16 00:16:29
Description: 弹出层框架
FilePath: \uni-preset-vue-vite-ts\src\components\ThePopupFrame.vue
-->

<script lang="ts" setup>
import { reactive, nextTick } from 'vue'
import { onDeactivated, onActivated } from 'vue'

const data = reactive<any>({
  display: false,

  active: false,

  popupData: {}
})

onEvent()

function onEvent() {
  uni.$on('popupOpen', (eventData: any) => {
    data.popupData = eventData
    if (data.display) return
    data.display = true
    nextTick(() => setTimeout(() => (data.active = true), 10))
  })

  uni.$on('popupClose', () => {
    close()
  })
}

function closeEvent() {
  uni.$off('popupOpen')
  uni.$off('popupClose')
}

onActivated(() => {
  onEvent()
})

onDeactivated(() => {
  closeEvent()
})

function close() {
  if (!data.active) return
  data.active = false
  nextTick(() => setTimeout(() => (data.display = false), 300))
}

function closePopup() {
  uni.$emit('popupClose')
}
</script>

<template>
  <view
    v-if="data.display"
    :class="`the-popup ${data.active ? 'the-popup-active' : 'the-popup-hide'}`"
  >
    <!-- 点击外部返回 -->
    <view class="the-popup-overlay" @tap.stop.prevent="closePopup" />

    <!-- 弹出内容 -->
    <view class="the-popup-container">
      <slot :popupData="data.popupData"></slot>
    </view>
  </view>
</template>

<style lang="less">
.the-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  z-index: 998;
  background: transparent;
  touch-action: none;
  color: var(--theme-text-title-color);

  .the-popup-overlay {
    z-index: 1;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    touch-action: none;
    transition: opacity 0.3s;
  }

  .the-popup-container {
    z-index: 2;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background: var(--theme-background-color-card);
    border-radius: 24rpx 24rpx 0 0;
    padding: 15rpx;
    box-sizing: border-box;
    transition: transform 0.3s;
  }
}

.the-popup-active {
  .the-popup-overlay {
    opacity: 1;
  }
  .the-popup-container {
    transform: translate(0, 0);
  }
}

.the-popup-hide {
  .the-popup-overlay {
    opacity: 0;
  }
  .the-popup-container {
    transform: translate(0, 100%);
  }
}
</style>
