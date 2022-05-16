<!--
Author: zusheng
Date: 2022-04-30 21:25:28
LastEditTime: 2022-05-15 20:03:19
Description: 主页列表通用框架
FilePath: \uni-preset-vue-vite-ts\src\components\section\SectionFrame.vue
-->

<script lang="ts" setup>
const props = defineProps<{
  // 分区标题
  title: string

  // 显示更多按钮
  more: boolean
}>()

const emit = defineEmits(['more'])
</script>

<template>
  <view class="section-card">
    <slot name="title">
      <!-- 标题 -->
      <view class="section-card__title">
        <text class="text-ellipsis-single">{{ props.title }}</text>
        <!-- 查看更多按钮 -->
        <view class="section-card__title-btn" v-if="props.more" @tap="emit('more')">
          <text class="text-ellipsis-single">更多</text>
          <!-- 更多图标 -->
          <view class="section-card__title-btn-icon" />
        </view>
      </view>
    </slot>

    <!-- main slot s -->
    <slot></slot>
    <!-- main slot e -->
  </view>
</template>

<style lang="less">
.section-card {
  // 标题高度
  --title-height: 48rpx;

  background-color: var(--theme-background-color-card);
  padding: 28.8rpx 0 38.4rpx;
  margin-bottom: 19rpx;
  border-radius: 24rpx;
  position: relative;

  // 标题栏
  .section-card__title {
    height: var(--title-height);
    width: 100%;
    font-size: 34.5rpx;
    font-weight: 600;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 var(--page-spacing);
    color: var(--theme-text-title-color);
    // 更多按钮
    .section-card__title-btn {
      height: var(--title-height);
      padding: 0 24rpx;
      color: var(--theme-text-title-color);
      font-size: 22rpx;
      font-weight: 400;
      border-radius: 24rpx;
      border: 1px solid var(--theme-border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
      // 按钮图标
      .section-card__title-btn-icon {
        height: 18rpx;
        width: 18rpx;
        margin-left: 4rpx;
        background-color: var(--theme-text-title-color);
        mask-image: url('@/static/icon-arrow-right.png');
        mask-size: auto 100%;
        mask-position: center;
        mask-repeat: no-repeat;
      }
    }
  }
}
</style>
