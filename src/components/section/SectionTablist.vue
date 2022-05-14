<!--
Author: zusheng
Date: 2022-05-01 10:48:15
LastEditTime: 2022-05-15 00:03:10
Description: 首页分区-tab歌曲列表
FilePath: \uni-preset-vue-vite-ts\src\components\section\SectionTablist.vue
-->

<script lang="ts" setup>
import SectionFrame from '@/components/section/SectionFrame.vue'
import { ref } from 'vue'

const props = defineProps<{
  title: Array<any>
  data: Array<any>
}>()

const curIdx = ref<number>(0)

function tapTab(e: number) {
  curIdx.value = e
}
</script>

<template>
  <section-frame :title="''" :more="true">
    <template #title>
      <!-- 标题 -->
      <view class="section-card__title">
        <view class="section-card__title-tablist">
          <text
            v-for="(titleItem, titleIdx) in props.title"
            :key="titleItem"
            class="section-card__title-tablist-item"
            @tap.stop.prevent="tapTab(titleIdx)"
            :class="{ 'title-tablist-item-checked': curIdx === titleIdx }"
          >
            {{ titleItem }}
          </text>
        </view>
        <!-- 查看更多按钮 -->
        <view class="section-card__title-btn">
          <text>更多</text>
          <!-- 更多图标 -->
          <view class="section-card__title-btn-icon" />
        </view>
      </view>
    </template>
    <template #default>
      <swiper
        class="section-card__songs"
        easing-function="easeOutCubic"
        :indicator-dots="false"
        :autoplay="false"
        :duration="500"
        next-margin="58rpx"
      >
        <!-- 一列歌曲（三行） -->
        <swiper-item
          v-for="(column, columnIdx) in props.data[curIdx]"
          :key="`songs-page-${columnIdx}`"
          class="songs-column"
        >
          <view
            class="songs-column-item"
            v-for="(columnItem, columnIdx) in column"
            :key="`songs-item-${columnIdx}`"
          >
            <image
              v-if="columnItem.picUrl"
              :class="`songs-column-item-poster ${columnItem.type}`"
              :src="`${columnItem.picUrl}?param=100y100`"
              mode="widthFix"
            />
            <view class="songs-column-item-info text-ellipsis-single">
              <view class="songs-title text-ellipsis-single">
                <text class="songs-title-name text-ellipsis-single">{{ columnItem.title }}</text>
                <text class="songs-title-artist text-ellipsis-single" v-if="columnItem.artist">
                  &nbsp;-&nbsp;{{ columnItem.artist }}
                </text>
              </view>
              <view class="songs-subTitle text-ellipsis-single">
                <view class="songs-tags text-ellipsis-single" v-if="columnItem.tags">{{
                  columnItem.tags
                }}</view>
                <text class="songs-main text-ellipsis-single">{{ columnItem.subTitle }}</text>
              </view>
            </view>
            <view
              v-if="columnItem.videoInfo.status"
              :data-id="columnItem.videoInfo.vid"
              class="songs-column-item-video"
            />
          </view>
        </swiper-item>
      </swiper>
    </template>
  </section-frame>
</template>

<style lang="less">
// 标题栏
.section-card__title {
  // 标题高度
  --title-height: 48rpx;

  height: var(--title-height);
  width: 100%;
  font-size: 34.5rpx;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0 var(--page-spacing);
  .section-card__title-tablist-item {
    padding: 0 25rpx;
    border-right: 1px solid var(--theme-border-color);
    color: var(--theme-text-sub-color);
    &:first-child {
      padding-left: 0;
    }
    &:last-child {
      padding-right: 0;
      border: none;
    }
  }

  .title-tablist-item-checked {
    color: var(--theme-text-title-color);
  }

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

.section-card__songs {
  height: calc((92rpx + 24rpx) * 3);
  margin-top: 12rpx;

  .songs-column {
    margin-left: var(--page-spacing);
    .songs-column-item {
      display: flex;
      align-items: center;
      position: relative;

      // 歌曲封面
      .songs-column-item-poster {
        height: 92rpx;
        width: 92rpx;
        flex-shrink: 0;
        border-radius: 8rpx;
        position: relative;
      }

      .song {
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

      // 歌曲描述
      .songs-column-item-info {
        margin-right: 38rpx;
        margin-left: 16rpx;
        // width: 545rpx;
        width: 100%;
        height: 92rpx;
        padding: 12rpx 0;
        border-bottom: 1px solid var(--theme-border-color);
        display: flex;
        flex-direction: column;
        justify-content: center;
        line-height: 1.6;
        //  标题
        .songs-title {
          color: rgb(150, 150, 150);
          padding-right: 72rpx;
          width: 100%;
          .songs-title-name {
            font-size: 30rpx;
            font-weight: 600;
            color: var(--theme-text-title-color);
          }
          .songs-title-artist {
            font-size: 24rpx;
            font-weight: 400;
            color: rgb(150, 150, 150);
          }
        }
        .songs-subTitle {
          display: flex;
          align-items: center;
          //tags
          .songs-tags {
            font-size: 16rpx;
            padding: 4rpx 10rpx;
            line-height: 30rpx;
            background-color: rgba(201, 113, 73, 0.1);
            color: #ff7c3a;
            display: inline-block;
            margin-right: 10rpx;
            border-radius: 4rpx;
            flex-shrink: 0;
          }
          // 小标题
          .songs-main {
            font-size: 20rpx;
            color: rgb(150, 150, 150);
          }
        }
      }

      // 播放按钮
      .songs-column-item-video {
        height: 48rpx;
        width: 48rpx;
        position: absolute;
        right: 48rpx;
        top: 50%;
        transform: translate(0, -50%);
        background-color: rgb(180, 180, 180);
        mask-image: url('@/static/t_actionbar_video_selected.png');
        mask-position: center;
        mask-repeat: no-repeat;
        mask-size: 80%;
      }
    }
  }
}
</style>
