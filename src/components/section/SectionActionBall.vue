<!--
Author: zusheng
Date: 2022-04-24 16:47:20
LastEditTime: 2022-05-14 15:05:52
Description: 首页分区-入口按钮
FilePath: \uni-preset-vue-vite-ts\src\components\section\SectionActionBall.vue
-->
<script lang="ts" setup>
defineProps<{
  data: Array<any>
}>()
</script>

<template>
  <!-- 入口按钮 -->
  <scroll-view v-if="data.length > 0" class="section-action" :scroll-x="true" :enable-flex="true">
    <view
      @tap.stop.prevent="actionItem.func ? actionItem.func() : false"
      :class="`section-action-item ${actionItem.disabled ? 'item-disabled' : null}`"
      v-for="actionItem in data"
      :key="actionItem.id"
    >
      <!-- 图标 -->
      <view class="section-action-item__image">
        <view
          v-if="actionItem.iconUrl"
          class="section-action-item__image-icon"
          :style="`--mask-image-url: url(${actionItem.iconUrl})`"
        />
        <view class="section-action-item__image-text" v-if="actionItem.id === -1">21</view>
      </view>
      <!-- 标题 -->
      <text class="section-action-item__title">{{ actionItem.name }}</text>
    </view>
  </scroll-view>
</template>

<style lang="less">
.section-action {
  white-space: nowrap;
  padding-bottom: 36.5rpx;
  border-bottom: 1px solid rgb(230, 230, 230);

  // 不可用的项目
  .item-disabled {
    opacity: 0.3;
  }

  // 列表项
  .section-action-item {
    // action按钮图标尺寸
    --action-image-item-size: 88rpx;

    display: inline-block;
    margin-right: 50rpx;

    &:first-child {
      margin-left: var(--page-spacing);
    }

    &:last-child {
      margin-right: var(--page-spacing);
    }

    // 小标题
    .section-action-item__title {
      color: rgb(126, 117, 127);
      font-size: 22rpx;
      display: block;
      text-align: center;
      margin: 10rpx 0 0;
    }

    // 图标
    .section-action-item__image {
      position: relative;
      width: var(--action-image-item-size);
      height: var(--action-image-item-size);
      overflow: hidden;
      border-radius: 50%;
      background-color: #fff5f5;

      .section-action-item__image-text {
        position: absolute;
        top: 2rpx;
        left: 1rpx;
        width: var(--action-image-item-size);
        height: var(--action-image-item-size);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2;
        font-size: 16rpx;
        font-weight: 600;
        color: #fff;
      }

      .section-action-item__image-icon {
        width: 100%;
        height: 100%;
        // margin-left: -100%;
        // background-repeat: no-repeat;
        // background-position: center center;
        // background-size: calc(100% - 10rpx);
        // filter: drop-shadow(var(--action-image-item-size) 0 #f9343d);
        // -webkit-filter: drop-shadow(var(--action-image-item-size) 0 #f9343d);
        background-color: #f9343d;
        mask-position: center;
        mask-size: calc(100% - 10rpx);
        mask-image: var(--mask-image-url);
      }
    }
  }
}
</style>
