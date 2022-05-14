<!--
Author: zusheng
Date: 2022-05-01 23:49:11
LastEditTime: 2022-05-15 00:02:04
Description: 多个歌手时弹出选择
FilePath: \uni-preset-vue-vite-ts\src\components\ThePopupArtist.vue
-->

<script lang="ts" setup>
import ThePopupFrame from './ThePopupFrame.vue'

function toArtistDetail(data: any) {
  close()
  uni.navigateTo({
    url: `../../pages/detail/artist?payload=${data.id}&type=artist`
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

      <scroll-view class="the-popup-container-scroll" :scroll-y="true">
        <view class="artist-list">
          <view
            @tap.stop.prevent="toArtistDetail(item)"
            class="artist-item"
            v-for="(item, idx) in popupData"
            :key="`artist-${idx}`"
            :hover-class="'item-hover'"
            :hover-start-time="50"
          >
            <view> {{ item.name }}</view>
            <view class="artist-item-btn">主页</view>
          </view>
        </view>
        <view class="fixed-placeholder"></view>
      </scroll-view>
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
    background: var(--theme-text-sub-color);
    mask-size: 40rpx auto;
    mask-repeat: no-repeat;
    mask-image: url('@/static/icon-arrow-bottom.png');
    mask-position: center;
  }
}

.the-popup-container-scroll {
  width: 100%;
  height: 100%;

  .artist-list {
    width: 100%;

    .artist-item {
      padding: 15rpx 15rpx;
      border-radius: 10rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .artist-item-btn {
        height: 52rpx;
        width: 100rpx;
        border-radius: 26rpx;
        font-size: 20.5rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgb(255, 58, 57);
        border: 1px solid rgba(255, 58, 57, 0.5);
      }
    }

    .item-hover {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
}
</style>
