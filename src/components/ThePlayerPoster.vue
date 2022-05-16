<!--
Author: zusheng
Date: 2022-04-28 20:04:33
LastEditTime: 2022-05-15 23:31:24
Description: 播放器的封面显示页（首页的光碟转动）
FilePath: \uni-preset-vue-vite-ts\src\components\ThePlayerPoster.vue
-->

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
import { durationConvert } from '@/common/util'
import { useStore as usePlayerStore } from '@/store/player'

const seeking = ref<boolean>(false)
const loading = ref<boolean>(true)
const playerStore = usePlayerStore()
/**
 * 只有在打开了播放器页面时，才开启旋转动画
 */
const aps = computed(() => (!playerStore.playerStatus.paused ? 'running' : 'paused'))

/**
 * 调整进度
 */
function ratioChange(e: any) {
  const ratio = e.detail.value / 100
  const currentTime = Number(((playerStore.playerInfo.duration / 1000) * ratio).toFixed(2))
  playerStore.seek(currentTime)
}

const ratio = computed(() => {
  const durationRatio =
    playerStore.playerStatus.currentTime / playerStore.playerStatus.duration || 0
  return seeking.value ? undefined : Number((durationRatio * 100).toFixed(1))
})

const timeConver = computed(() => {
  return function (timeStamp: number) {
    return durationConvert(timeStamp)
  }
})

function ratioChanging() {
  seeking.value = true
}

onMounted(() => {
  setTimeout(() => (loading.value = false), 0)
})
</script>

<template>
  <view class="player-page-cd" :style="{ opacity: loading ? 0 : 1 }">
    <!-- 1. 留声机的唱针-->
    <view
      class="player-page-cd__stylus"
      :class="{ 'stylus-pause': playerStore.playerStatus.paused }"
    />

    <!-- 2. css半透明背景, 可有可无的装饰 -->
    <view class="player-page-cd__poster-bg" />

    <!-- 3. 唱片封面，播放时旋转 -->
    <view class="player-page-cd__poster">
      <image
        v-if="playerStore.playerInfo.picUrl"
        class="player-page-cd__poster-image"
        :style="{ 'animation-play-state': aps }"
        :src="`${playerStore.playerInfo.picUrl}?param=200y200`"
        mode="aspectFit"
      />
    </view>

    <!-- 4. 进度条 -->
    <view class="player-page-cd__progress">
      <!-- 当前时间 -->
      <view class="player-page-cd__progress-start">
        {{ timeConver(playerStore.playerStatus.currentTime) }}
      </view>

      <!-- 进度条轨道 -->
      <view class="player-page-cd__progress-spacing">
        <slider
          class="player-page-cd__progress-slider"
          :block-size="16"
          block-color="rgba(255,255,255,1)"
          activeColor="#E4E4E4"
          backgroundColor="rgba(255,255,255,0.3)"
          :value="ratio"
          :step="0.1"
          @changing="ratioChanging"
          @change="ratioChange"
        />
      </view>

      <!-- 总时间 -->
      <view class="player-page-cd__progress-end">
        {{ timeConver(playerStore.playerStatus.duration) }}
      </view>
    </view>
  </view>
</template>

<style lang="less" scoped>
.player-page-cd {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  transition: opacity 0.3s;

  // 唱针在音乐暂停时状态
  .stylus-pause {
    transform: translate3d(-30rpx, calc(320rpx * -1.5), 0) rotate(-30deg) !important;
  }

  // 1. 唱针
  .player-page-cd__stylus {
    z-index: 9999;
    position: absolute;
    top: 43%;
    left: 50%;
    width: calc(320rpx / 1.75);
    height: 320rpx;
    transition: transform 0.3s linear;
    transform-origin: 25.5rpx 25.5rpx;
    transform: translate3d(-30rpx, calc(320rpx * -1.5), 0) rotate(0deg);
    background: url('@/static/fd6.png') center center no-repeat;
    background-size: auto 100%;
  }
  // 2. 唱片封面css背景
  .player-page-cd__poster-bg {
    z-index: 9997;
    content: '';
    position: absolute;
    top: 43%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(255, 255, 255, 0.06);
    border: 2px solid rgba(255, 255, 255, 0.06);
    border-radius: 50%;
    width: 600rpx;
    height: 600rpx;
  }
  // 3. 唱片封面
  .player-page-cd__poster {
    z-index: 9998;
    position: absolute;
    top: 43%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(0);
    border-radius: 50%;
    width: 570rpx;
    height: 570rpx;
    background: url('@/static/ewj.png') center center no-repeat;
    background-size: 100%;

    // 唱片封面
    .player-page-cd__poster-image {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-192.5rpx, -192.5rpx);
      border-radius: 50%;
      width: 385rpx;
      height: 385rpx;
      animation: posterRotate 20s linear infinite forwards;
    }
    @keyframes posterRotate {
      0% {
        transform: translate(-192.5rpx, -192.5rpx) rotate(0);
      }

      100% {
        transform: translate(-192.5rpx, -192.5rpx) rotate(360deg);
      }
    }
  }
  // 4. 进度条
  .player-page-cd__progress {
    position: absolute;
    height: 13rpx;
    width: 100%;
    left: 0;
    bottom: 44rpx;
    padding: 0 48rpx;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: rgba(255, 255, 255, 0.6);
    font-size: 20rpx;

    .player-page-cd__progress-start {
      margin-right: 32rpx;
    }

    .player-page-cd__progress-end {
      margin-left: 32rpx;
    }

    .player-page-cd__progress-spacing {
      flex: 1;
      height: 60rpx;
      box-sizing: border-box;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;

      .player-page-cd__progress-slider {
        flex: 1;
        margin: 0;
      }
    }
  }
}
</style>
