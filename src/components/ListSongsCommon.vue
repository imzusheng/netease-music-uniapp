<!--
Author: zusheng
Date: 2022-04-29 12:41:58
LastEditTime: 2022-05-14 20:55:00
Description: 歌曲列表-普通滚动列表
FilePath: \uni-preset-vue-vite-ts\src\components\ListSongsCommon.vue
-->

<script lang="ts" setup>
import { computed } from 'vue'
import { useStore as usePlayerStore } from '@/store/player'

const playerStore = usePlayerStore()
const props = defineProps<{
  // 列表数据
  songs: Array<any>
}>()

// 播放单曲
function tapHandler(e: any, data: any) {
  const datasetKeys = Object.keys(e.target.dataset)
  if (datasetKeys.includes('onMore')) {
  } else {
    // 添加歌曲信息到播放器
    playerStore.setPlayerInfo(data.payload)
    // 打开播放器
    uni.navigateTo({
      url: `../../pages/player/index?type=poster&payload=${data.payload}`
    })
  }
}

const songs = computed(() => {
  return props.songs
})
</script>

<template>
  <view class="list-songs__ul">
    <!-- items s -->
    <view
      :class="`list-songs__li infinite__item infinite__item-${item.idx}`"
      v-for="item in songs"
      :key="item.payload"
      @tap.stop.prevent="tapHandler($event, item)"
      :data-idx="item.idx"
    >
      <!-- 序号 -->
      <view class="list-songs__li-idx">{{ item.idx }}</view>
      <!-- 歌曲信息和按钮 -->
      <view
        class="list-songs__li-main"
        :hover-class="'infinite__item-hover'"
        :hover-start-time="100"
      >
        <view class="list-songs__li-main-info">
          <!-- 歌曲名 -->
          <view class="list-songs__li-main-info-title text-ellipsis-single">{{ item.title }}</view>
          <!-- 作者 -->
          <view class="list-songs__li-main-info-desc">
            <!-- 图标 -->
            <image
              v-if="item.maxQ === 'sq'"
              class="list-songs__li-main-info-icon"
              src="@/static/edg.png"
              mode="aspectFit"
            />
            <image
              v-else-if="item.maxQ === 'h'"
              class="list-songs__li-main-info-icon"
              src="@/static/ed0.png"
              mode="aspectFit"
            />
            <image
              v-if="['1'].includes(item.fee.toString())"
              class="list-songs__li-main-info-icon"
              src="@/static/edm.png"
              mode="aspectFit"
            />
            <image
              v-if="['1'].includes(item.fee.toString())"
              class="list-songs__li-main-info-icon"
              src="@/static/edi.png"
              mode="aspectFit"
            />
            <image
              v-else-if="item.fee.toString() === '4'"
              class="list-songs__li-main-info-icon"
              src="@/static/ecs.png"
              mode="aspectFit"
            />
            <text class="text-ellipsis-single">{{ item.artist }} - {{ item.album }}</text>
          </view>
        </view>
      </view>
      <!-- mv按钮 -->
      <view class="list-songs__li-main-btn">
        <!-- <view class="list-songs__li-main-btn__mv" v-if="item.mv" /> -->
        <view class="list-songs__li-main-btn__more" data-on-more />
      </view>
    </view>
    <!-- items e -->
  </view>
</template>

<style lang="less">
// 歌曲列表
.list-songs__ul {
  box-sizing: border-box;
  width: 100%;
  transition: opacity 0.3s;
  .list-songs__li {
    display: flex;
    height: 111.5rpx;
    width: 100%;

    // 1.序号
    .list-songs__li-idx {
      flex-shrink: 0;
      width: 38.5rpx;
      height: 100%;
      margin-right: 10rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 24.3rpx;
      color: rgb(153, 153, 153);
    }

    // 2.一首歌曲
    .list-songs__li-main {
      padding-left: 10.5rpx;
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      line-height: 1.6;
      border-radius: 10rpx;

      // 歌曲信息
      .list-songs__li-main-info {
        width: 505rpx;
        .list-songs__li-main-info-title {
          font-size: 32rpx;
          color: #000000;
        }
        .list-songs__li-main-info-desc {
          font-size: 24rpx;
          display: flex;
          align-items: center;
          color: rgb(128, 128, 128);
          .list-songs__li-main-info-icon {
            flex-shrink: 0;
            height: 20rpx;
            width: 33.33rpx;
            margin-right: 9rpx;
          }
        }
      }
    }

    // MV按钮
    .list-songs__li-main-btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;

      .list-songs__li-main-btn__mv {
        height: 100%;
        width: 37.2rpx;
        background-color: rgb(179, 179, 179);
        mask-repeat: no-repeat;
        mask-image: url('@/static/t_actionbar_video_selected.png');
        mask-position: center;
        mask-size: 37.2rpx auto;
        // margin: 0 15rpx;
      }
      .list-songs__li-main-btn__more {
        height: 100%;
        width: 37.2rpx;
        background-color: rgb(179, 179, 179);
        mask-repeat: no-repeat;
        mask-image: url('@/static/ffh.png');
        mask-position: center;
        mask-size: 37.2rpx auto;
        padding: 0 15rpx;
      }
    }
  }

  .infinite__item-hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
}
</style>
