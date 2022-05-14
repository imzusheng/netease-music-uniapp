<!--
Author: zusheng
Date: 2022-05-01 13:00:48
LastEditTime: 2022-05-12 16:00:17
Description: 首页分区-音乐日历
FilePath: \uni-preset-vue-vite-ts\src\components\section\SectionMusicCalendar.vue
-->

<script lang="ts" setup>
import SectionFrame from '@/components/section/SectionFrame.vue'

const props = defineProps<{
  // 分区标题
  title: string
  data: {
    list: Array<any>
  }
}>()

function tapHandler(e: any) {
  console.log(e)
  uni.showToast({
    title: '哎呀，这里不行',
    icon: 'none',
    duration: 2000
  })
}
</script>

<template>
  <section-frame
    v-if="props.title && props.data.list?.length > 0"
    :title="props.title"
    :more="false"
  >
    <template #default>
      <view class="section-card__main">
        <view
          class="section-card__main-item"
          v-for="item in data.list"
          :key="item.payload"
          @tap.stop.prevent="tapHandler"
        >
          <view class="section-card__main-item-main">
            <view class="section-card__main-item-main__title">{{ item.subTitle }}</view>
            <view class="section-card__main-item-main__desc text-ellipsis-single">
              {{ item.title }}
            </view>
          </view>
          <image
            class="section-card__main-item-poster"
            :src="`${item.picUrl}?param=100y100`"
            mode="aspectFit"
          />
        </view>
      </view>
    </template>
  </section-frame>
</template>

<style lang="less">
.section-card__main {
  margin-top: 18rpx;
  .section-card__main-item {
    border-top: 1px solid #f8f5f8;
    // border-top: 1px solid #ccc;
    padding: 19.2rpx 0;
    width: 100%;
    height: 92rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:last-child {
      padding-bottom: 0;
    }

    .section-card__main-item-main {
      margin-left: var(--page-spacing);
      width: calc(100% - 92rpx - 115rpx);
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      line-height: 1.6;

      .section-card__main-item-main__title {
        font-size: 23rpx;
        color: #9c999c;
      }

      .section-card__main-item-main__desc {
        font-size: 28.9rpx;
        width: 100%;
      }
    }

    // 歌曲封面
    .section-card__main-item-poster {
      margin-right: var(--page-spacing);
      flex-shrink: 0;
      height: 92rpx;
      width: 92rpx;
      position: relative;
      border-radius: 8rpx;
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        // height: 92rpx;
        // width: 92rpx;
        width: 100%;
        height: 100%;
        z-index: 1;
        background-color: rgba(255, 255, 255, 0.8);
        mask-image: url('@/static/icon-play-square.png');
        mask-size: 24rpx;
        mask-position: center;
        mask-repeat: no-repeat;
      }
    }
  }
}
</style>
