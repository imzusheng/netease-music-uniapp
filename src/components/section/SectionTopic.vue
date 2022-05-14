<!--
Author: zusheng
Date: 2022-05-01 00:12:16
LastEditTime: 2022-05-12 15:59:44
Description: 首页分区-热门话题分区
FilePath: \uni-preset-vue-vite-ts\src\components\section\SectionTopic.vue
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
    :more="true"
  >
    <template #default>
      <!-- 热门话题 s -->
      <swiper
        class="home-section-main home-section-songs"
        easing-function="easeOutCubic"
        :indicator-dots="false"
        :autoplay="false"
        :duration="500"
        next-margin="58rpx"
      >
        <!-- 一列歌曲（三行） -->
        <swiper-item v-for="(column, columnIdx) in props.data.list" :key="`hot-topic-${columnIdx}`">
          <view
            @tap.stop.prevent="tapHandler"
            class="section-column-item"
            v-for="(columnItem, columnIdx) in column"
            :key="`column-item-${columnIdx}`"
          >
            <!-- 封面 -->
            <image
              class="section-column-item-poster"
              :src="`${columnItem.picUrl}?param=40y40`"
              mode="aspectFit"
            />
            <!-- 描述 -->
            <view class="section-column-item-info">
              <!-- 描述标题 -->
              <view class="item-title">
                <text class="item-title-text">{{ columnItem.title }}</text>
                <image
                  v-if="columnItem?.labelUrls?.length > 0"
                  class="item-title-lebel"
                  :src="columnItem?.labelUrls[0]"
                  mode="aspectFit"
                />
              </view>
              <!-- 副标题 -->
              <text class="item-subTitle">{{ columnItem.subTitle }}</text>
            </view>
          </view>
        </swiper-item>
      </swiper>
      <!-- 热门话题 e -->
    </template>
  </section-frame>
</template>

<style lang="less">
.home-section-main {
  // 一行高度
  --row-height: 77rpx;

  margin-top: 12rpx;
  height: calc(var(--row-height) * 3);

  .section-column-item {
    display: flex;
    align-items: center;
    // padding: 0 var(--page-spacing);
    margin-left: var(--page-spacing);

    // 封面
    .section-column-item-poster {
      height: 29rpx;
      width: 29rpx;
      margin-right: 15rpx;
    }

    // 描述
    .section-column-item-info {
      width: 545rpx;
      height: var(--row-height);
      padding-right: 38rpx;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      //  标题
      .item-title {
        font-size: 29rpx;
        font-weight: 400;
        color: rgb(0, 0, 0);
        display: flex;
        align-items: center;
        overflow: hidden;
        .item-title-text {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          flex: 1;
        }
        .item-title-lebel {
          height: 29rpx;
          width: 29rpx;
          margin: 0 36rpx 0 12rpx;
        }
      }

      // 小标题
      .item-subTitle {
        font-size: 20rpx;
        color: rgb(150, 150, 150);
        white-space: nowrap;
      }
    }
  }
}
</style>
