<!--
Author: zusheng
Date: 2022-04-30 21:47:29
LastEditTime: 2022-05-14 20:55:30
Description: 首页分区-播放列表卡片(滚动列表)
FilePath: \uni-preset-vue-vite-ts\src\components\section\SectionSonglist.vue
-->

<script lang="ts" setup>
import SectionFrame from '@/components/section/SectionFrame.vue'
import { useStore as usePlayerStore } from '@/store/player'

const playerStore = usePlayerStore()
const props = defineProps<{
  // 分区标题
  title: string

  data: {
    list: Array<any>

    scrollList?: Array<any>
  }
}>()

function tapHandler(e: any) {
  // 添加歌曲信息到播放器
  playerStore.setPlayerInfo(e.payload)
  // 打开播放器
  uni.navigateTo({
    url: `../../pages/player/index?type=poster&payload=${e.payload}`
  })
}
</script>

<template>
  <section-frame :title="props.title" :more="true">
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
          v-for="(column, columnIdx) in props.data.list"
          :key="`songs-page-${columnIdx}`"
          class="songs-column"
        >
          <view
            @tap.stop.prevent="tapHandler(columnItem)"
            class="songs-column-item"
            v-for="(columnItem, columnIdx) in column"
            :key="`songs-item-${columnIdx}`"
          >
            <image
              v-if="columnItem.picUrl"
              class="songs-column-item-poster"
              :src="`${columnItem.picUrl}?param=100y100`"
              mode="aspectFit"
            />
            <view class="songs-column-item-info">
              <view class="songs-title text-ellipsis-single">
                <text class="songs-title-name text-ellipsis-single">{{ columnItem.title }}</text>
                <text class="songs-title-artist text-ellipsis-single">
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
            <view v-if="columnItem.mv" :data-id="columnItem.mv" class="songs-column-item-video" />
          </view>
        </swiper-item>
      </swiper>
    </template>
  </section-frame>
</template>

<style lang="less" scoped>
.section-card__songs {
  height: calc((92rpx + 24rpx) * 3);
  margin-top: 12rpx;

  .songs-column {
    margin-left: var(--page-spacing);
    .songs-column-item {
      display: flex;
      align-items: center;
      position: relative;
      width: 100%;

      // 歌曲封面
      .songs-column-item-poster {
        flex-shrink: 0;
        height: 92rpx;
        width: 92rpx;
        position: relative;
        border-radius: 8rpx;
        // &::before {
        //   content: '';
        //   position: absolute;
        //   top: 0;
        //   left: 0;
        //   height: 92rpx;
        //   width: 92rpx;
        //   z-index: 2;
        //   background-image: linear-gradient(rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.1));
        // }
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
        width: calc(100% - 92rpx - 54rpx);
        height: 92rpx;
        padding: 12rpx 0;
        border-bottom: 1px solid rgb(230, 230, 230);
        display: flex;
        flex-direction: column;
        justify-content: center;
        line-height: 1.6;

        //  标题
        .songs-title {
          color: rgb(150, 150, 150);
          padding-right: 72rpx;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex-shrink: 0;

          .songs-title-name {
            font-size: 30rpx;
            font-weight: 600;
            color: rgb(0, 0, 0);
          }
          .songs-title-artist {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 24rpx;
            font-weight: 400;
            color: rgb(150, 150, 150);
          }
        }
        .songs-subTitle {
          display: flex;
          align-items: center;
          padding-right: 72rpx;
          //tags
          .songs-tags {
            font-size: 16rpx;
            padding: 4rpx 10rpx;
            background-color: #fff9f6;
            color: #ff7c3a;
            display: inline-block;
            margin-right: 10rpx;
            border-radius: 4rpx;
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
