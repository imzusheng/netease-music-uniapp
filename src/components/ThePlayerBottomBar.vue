<!--
Author: zusheng
Date: 2022-04-27 10:34:18
LastEditTime: 2022-05-13 00:14:24
Description: 底部小播放器
FilePath: \uni-preset-vue-vite-ts\src\components\ThePlayerBottomBar.vue
-->
<script lang="ts" setup>
import { useStore as usePlayerStore } from '@/store/player'

const playerStore = usePlayerStore()

function tapPlayerHandler() {
  uni.navigateTo({
    url: '../../pages/player/index?type=poster'
  })
}

function toQueue() {
  uni.navigateTo({
    url: '../../pages/player/index?type=queue'
  })
}

function playSong(status: boolean) {
  !status ? playerStore.setPlayerPause() : playerStore.setPlayerPlay()
}
</script>

<template>
  <view
    class="bottom-bar-player"
    @tap.stop.prevent="tapPlayerHandler"
    v-if="playerStore.playerInfo.payload"
  >
    <!-- → bottombar播放器 -->
    <view class="bottom-bar-player-spacing">
      <!-- 歌曲封面 -->
      <view class="bottom-bar-player__poster">
        <image
          class="bottom-bar-player__poster-image"
          :src="`${playerStore.playerInfo.picUrl}?param=100y100`"
          mode="aspectFit"
        />
      </view>
      <view class="bottom-bar-player__main">
        <view class="bottom-bar-player__main-info text-ellipsis-single">
          <!-- 标题 -->
          <text class="bottom-bar-player__main-title text-ellipsis-single">
            {{ playerStore.playerInfo.title }}
          </text>
          <!-- 作者 -->
          <text class="bottom-bar-player__main-artist text-ellipsis-single">
            &nbsp;-&nbsp;{{ playerStore.playerInfo.artist }}
          </text>
        </view>
        <!-- 按钮栏 -->
        <view class="bottom-bar-player__main-action">
          <view
            v-if="playerStore.playerStatus.paused"
            @tap.stop.prevent="playSong(true)"
            class="bottom-bar-player__main-action-play"
          />
          <view
            v-else
            @tap.stop.prevent="playSong(false)"
            class="bottom-bar-player__main-action-pause"
          />
          <!-- 播放队列按钮 -->
          <view class="bottom-bar-player__main-action-queue" @tap.stop.prevent="toQueue" />
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="less">
.bottom-bar-player {
  width: 100%;
  // 播放器高度
  height: var(--player-height-custom);
  position: fixed;
  z-index: 999;
  left: 0;
  right: 0;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  bottom: var(--window-bottom);
  background: rgba(252, 252, 252, 0.7);
  backdrop-filter: saturate(200%) blur(20px);

  .bottom-bar-player-spacing {
    width: 100%;
    height: 100%;
    padding: 0 30rpx;
    box-sizing: border-box;
    display: flex;
    align-items: center;

    // 封面
    .bottom-bar-player__poster {
      flex-shrink: 0;
      width: 83.3rpx;
      height: 83.3rpx;
      border-radius: 50%;
      margin-top: -16.5rpx;
      background: url('@/static/crc.png') center center no-repeat;
      background-size: 100%;
      position: relative;

      .bottom-bar-player__poster-image {
        width: 62%;
        height: 62%;
        top: 50%;
        left: 50%;
        position: absolute;
        border-radius: 50%;
        transform: translate(-50%, -50%);
      }
    }

    // 歌曲信息
    .bottom-bar-player__main {
      height: 100%;
      width: calc(100% - 83.3rpx - 23rpx);
      margin-left: 23rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      // 歌曲信息
      .bottom-bar-player__main-info {
        display: flex;
        align-items: center;
        width: calc(100% - 138rpx);
        height: 100%;
        box-sizing: border-box;
        padding-right: 30rpx;
        white-space: nowrap;
        .bottom-bar-player__main-title,
        .bottom-bar-player__main-artist {
          white-space: nowrap;
        }
        .bottom-bar-player__main-title {
          font-size: 24rpx;
          color: rgb(60, 60, 60);
        }
        .bottom-bar-player__main-artist {
          font-size: 19.2rpx;
          color: rgb(105, 105, 105);
        }
      }
      // 按钮栏
      .bottom-bar-player__main-action {
        width: 138rpx;
        height: 100%;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        // 播放按钮
        .bottom-bar-player__main-action-play,
        .bottom-bar-player__main-action-pause,
        .bottom-bar-player__main-action-queue {
          background-color: rgb(50, 51, 51);
          mask-size: 100%;
          mask-repeat: no-repeat;
          mask-position: center;
        }
        .bottom-bar-player__main-action-play {
          width: 52.5rpx;
          height: 52.5rpx;
          mask-image: url('@/static/c4n.png');
        }
        .bottom-bar-player__main-action-pause {
          width: 52.5rpx;
          height: 52.5rpx;
          mask-image: url('@/static/ew6.png');
        }
        .bottom-bar-player__main-action-queue {
          width: 35.9rpx;
          height: 35.9rpx;
          mask-image: url('@/static/eys.png');
          margin-left: 46.15rpx;
        }
      }
    }
  }
}
</style>
