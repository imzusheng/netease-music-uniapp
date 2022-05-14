<!--
Author: zusheng
Date: 2022-05-01 23:49:11
LastEditTime: 2022-05-14 16:41:40
Description: 选择登录方式
FilePath: \uni-preset-vue-vite-ts\src\components\ThePopupLogin.vue
-->

<script lang="ts" setup>
import ThePopupFrame from './ThePopupFrame.vue'

function toLogin(data: any) {
  close()
  uni.navigateTo({
    url: `../../pages/login/phone`
  })
}

function close() {
  uni.$emit('popupClose')
}
</script>

<template>
  <the-popup-frame>
    <template #default="{ popupData }">
      <view class="the-popup-container-title">
        <view class="the-popup-container-back" @tap.stop.prevent="close" />
      </view>

      <view class="popup-list">
        <view
          @tap.stop.prevent="toLogin(idx)"
          class="popup-item"
          v-for="(item, idx) in popupData"
          :key="`artist-${idx}`"
          :hover-class="'item-hover'"
          :hover-start-time="50"
        >
          <view> {{ item.name }}</view>
        </view>
      </view>
    </template>
  </the-popup-frame>
</template>

<style lang="less" scoped>
.the-popup-container-title {
  width: 100%;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  .the-popup-container-back {
    height: 72rpx;
    width: 72rpx;
    flex-shrink: 0;
    margin-left: 20.5rpx;
    background: rgba(51, 51, 52, 0.25);
    mask-size: 40rpx auto;
    mask-repeat: no-repeat;
    mask-image: url('@/static/icon-arrow-bottom.png');
    mask-position: center;
  }
}

.popup-list {
  height: 100%;
  width: 100%;
  margin: 30rpx 0;

  .popup-item {
    padding: 32rpx 15rpx;
    border-radius: 10rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .item-hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
</style>
