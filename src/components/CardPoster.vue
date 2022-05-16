<!--
Author: zusheng
Date: 2022-04-26 08:36:58
LastEditTime: 2022-05-15 18:59:57
Description: 封面卡片
FilePath: \uni-preset-vue-vite-ts\src\components\CardPoster.vue
-->

<script lang="ts" setup>
const props = defineProps<{
  playCount?: number | string

  picUrl?: string
}>()
</script>

<template>
  <view class="section-card__item-poster">
    <!-- 1.显示播放次数 -->
    <view class="section-card__item-badge">
      <view class="section-card__item-badge-icon"></view>
      <text>{{ props.playCount }}</text>
    </view>
    <!-- 2.歌单封面 -->
    <image class="section-card__item-image" :src="props.picUrl" mode="aspectFill" />
  </view>
</template>

<style lang="less">
.section-card__item-poster {
  width: 100%;
  height: 100%;
  position: relative;
  // 1.badge播放数量
  .section-card__item-badge {
    position: absolute;
    height: 32rpx;
    top: 10rpx;
    right: 10rpx;
    padding: 0 10rpx 0 32rpx;
    border-radius: 32rpx;
    font-size: 18rpx;
    color: rgba(254, 255, 253, 1);
    z-index: 2;
    display: flex;
    align-items: center;
    background-color: rgba(178, 179, 169, 0.2);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);

    .section-card__item-badge-icon {
      position: absolute;
      top: 8rpx;
      left: 10rpx;
      width: 16rpx;
      height: 16rpx;
      z-index: 2;
      background-color: rgba(254, 255, 253, 1);
      mask-size: 16rpx;
      mask-repeat: no-repeat;
      mask-position: center;
      mask-image: url('@/static/icon-play-white.png');
    }
  }
  // 2.封面
  .section-card__item-image {
    width: 100%;
    height: 100%;
    border-radius: 19.2rpx;
  }
}
</style>
