<!--
Author: zusheng
Date: 2022-05-11 10:36:02
LastEditTime: 2022-05-13 22:30:01
Description: 完整版播放器界面
FilePath: \uni-preset-vue-vite-ts\src\pages\player\index.vue
-->

<script lang="ts" setup>
import ThePopupArtist from '@/components/ThePopupArtist.vue'
import ThePlayerPoster from '@/components/ThePlayerPoster.vue'
import ThePlayerQueue from '@/components/ThePlayerQueue.vue'
import { computed, ref } from 'vue'
import { useStore as useMainStore } from '@/store'
import { useStore as usePlayerStore } from '@/store/player'
import { onLoad } from '@dcloudio/uni-app'

const mainStore = useMainStore()
const playerStore = usePlayerStore()
const playMode = computed(() => {
  return playerStore.playerStatus.mode || 1
})
const pageType = ref<string>('poster')

onLoad((query: any) => {
  const { payload, type = 'poster' } = query
  pageType.value = type
})

// 暂停/开始
function playerStatusChange() {
  if (playerStore.playerStatus.paused) {
    playerStore.setPlayerPlay()
  } else {
    playerStore.setPlayerPause()
  }
}

// 上一首歌
function playerPrev() {
  playerStore.setPlayerPrev()
}

// 下一首
function playerNext() {
  playerStore.setPlayerNext()
}

// 切换模式
function setPlayerMode() {
  const modeArray = ['', '列表循环', '列表播放', '随机播放', '单曲循环']
  let currentMode = playMode.value + 1
  if (currentMode > 4) currentMode = 1
  uni.hideToast()
  uni.showToast({
    title: modeArray[currentMode],
    icon: 'none',
    duration: 2000
  })
  playerStore.setPlayerStatus({ mode: currentMode })
}

// 打开代播列表
function toQueue() {
  pageType.value = pageType.value === 'poster' ? 'queue' : 'poster'
}

// 前往歌手详情页
function toDetailArtist() {
  uni.$emit('popupOpen', playerStore.playerInfo.ar)
}

// 退出页面
function back() {
  const curPages = getCurrentPages()
  // 当没有上一页的时候直接返回主页
  if (curPages.length === 1) {
    uni.switchTab({
      url: '../index/home'
    })
  } else {
    uni.navigateBack({ delta: 1 })
  }
}

// 背景加载完成
const backgroundLoad = ref<boolean>(false)
</script>

<template>
  <page-meta :page-style="mainStore.getPageMetaStyle" />

  <the-popup-artist />

  <!-- ↓ 播放器详情 -->
  <view class="detail-player">
    <image
      :style="{ opacity: backgroundLoad ? '1' : '0' }"
      class="detail-player__bg-image"
      @load="backgroundLoad = true"
      :src="`${playerStore.playerInfo.picUrl}?param=200y200`"
      mode="aspectFill"
    />

    <view class="detail-player__bg-filter" />

    <!-- ↓ 主页内容 -->
    <view class="detail-player__main">
      <!-- ↓ 导航栏 -->
      <view class="detail-player__main-nav">
        <view class="detail-player__main-nav__back" @tap.stop.prevent="back" />
        <view class="detail-player__main-nav__info">
          <view class="detail-player__main-nav__title text-ellipsis-single">
            {{ playerStore.playerInfo.title }}
          </view>

          <view
            class="detail-player__main-nav__subTitle text-ellipsis-single"
            @tap.stop.prevent="toDetailArtist"
          >
            {{ playerStore.playerInfo.artist }}
          </view>
        </view>
        <view class="detail-player__main-nav__search"></view>
      </view>

      <!-- ↓ 页面路由 -->
      <view class="detail-player__main-pages">
        <template v-if="pageType === 'poster'">
          <!-- page1.封面页 -->
          <the-player-poster />
        </template>
        <template v-else-if="pageType === 'queue'">
          <!-- page2.播放列表页面 -->
          <the-player-queue />
        </template>
      </view>

      <!-- ↓ 操作栏 -->
      <view class="detail-player__main-action">
        <view class="detail-player__main-action-opt">
          <!-- 播放模式按钮 -->
          <view @tap.stop.prevent="setPlayerMode" class="detail-player__main-action-opt__common">
            <view v-if="playMode === 1" class="icon-mode icon mode-listRepeat" />
            <view v-else-if="playMode === 2" class="icon-mode icon mode-list" />
            <view v-else-if="playMode === 3" class="icon-mode icon mode-random" />
            <view v-else-if="playMode === 4" class="icon-mode icon mode-repeat" />
          </view>

          <!-- 上一首按钮 -->
          <view @tap.stop.prevent="playerPrev" class="detail-player__main-action-opt__common">
            <view class="icon-prev icon" />
          </view>

          <template v-if="!playerStore.loading">
            <!-- 开始按钮 -->
            <view
              v-if="playerStore.playerStatus.paused"
              @tap.stop.prevent="playerStatusChange"
              class="detail-player__main-action-opt__common"
            >
              <view class="icon-play icon" />
            </view>
            <!-- 暂停按钮 -->
            <view
              v-else
              @tap.stop.prevent="playerStatusChange"
              class="detail-player__main-action-opt__common"
            >
              <view class="icon-pause icon" />
            </view>
          </template>

          <!-- 加载 -->
          <view v-else class="detail-player__main-action-opt__common">
            <view class="icon-loading icon" />
          </view>

          <!-- 下一首按钮 -->
          <view @tap.stop.prevent="playerNext" class="detail-player__main-action-opt__common">
            <view class="icon-next icon" />
          </view>

          <!-- 播放队列按钮 -->
          <view @tap.stop.prevent="toQueue" class="detail-player__main-action-opt__common">
            <view class="icon-checked" v-show="pageType === 'queue'" />
            <view class="icon-queue icon" />
          </view>
        </view>
      </view>
    </view>
    <!-- ↑ 主页内容 -->
  </view>
</template>

<style lang="less" scoped>
.detail-player {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: fixed;
  background-color: rgba(39, 39, 39, 1);

  .detail-player__bg-image {
    transition: opacity 0.6s;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100vw;
    height: 100vh;
    /* #ifdef H5 */
    filter: saturate(115%) brightness(70%) blur(80px);
    /* #endif */
  }

  // 背景滤镜
  .detail-player__bg-filter {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100vw;
    height: 100vh;
    background-size: auto 100vh;
    background-repeat: no-repeat;
    background-position: center;
    // filter性能和兼容性比backdrop-filter好
    /* #ifndef H5 */
    backdrop-filter: saturate(115%) brightness(50%) blur(60px);
    /* #endif */
  }

  // 主要内容
  .detail-player__main {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
    padding-bottom: 64px;
    padding-top: var(--status-bar-height);
    box-sizing: border-box;

    // 1. 标题栏
    .detail-player__main-nav {
      width: 100%;
      height: 96.15rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      padding: 0 38.5rpx;

      //   返回按钮
      .detail-player__main-nav__back,
      .detail-player__main-nav__search {
        width: 96.15rpx;
        height: 96.15rpx;
        background-size: 20rpx auto;
        background-repeat: no-repeat;
        flex-shrink: 0;
      }

      .detail-player__main-nav__back {
        background-position: 0 center;
        background-image: url('@/static/icon-arrow-left.png');
      }

      // 标题
      .detail-player__main-nav__info {
        display: flex;
        width: calc(100% - 2 * 96.15rpx);
        justify-content: center;
        flex-direction: column;
        align-items: center;
        line-height: 1.5;
        flex: 1;
        padding: 0 30rpx;
        box-sizing: border-box;

        .detail-player__main-nav__title {
          color: #fff;
          font-weight: 600;
          font-size: 29.5rpx;
          width: 100%;
          text-align: center;
        }

        .detail-player__main-nav__subTitle {
          color: rgba(255, 255, 255, 0.7);
          font-weight: 600;
          font-size: 27rpx;
          width: 100%;
          text-align: center;
        }
      }
    }

    // 2. 内容
    .detail-player__main-pages {
      flex: 1;
      width: 100%;
      position: relative;
    }

    // 3. 操作栏
    .detail-player__main-action {
      width: 100%;

      .detail-player__main-action-opt {
        --main-action-opt-size: 115.4rpx;
        padding: 0 38.5rpx;
        box-sizing: border-box;
        width: 100%;
        height: var(--main-action-opt-size);
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .detail-player__main-action-opt__common {
          height: 100%;
          height: var(--main-action-opt-size);
          width: var(--main-action-opt-size);
          position: relative;
        }

        .icon {
          width: 100%;
          height: 100%;
          background-size: 100%;
          border-radius: 50%;
          background-color: rgb(228, 228, 228);
          mask-repeat: no-repeat;
        }

        .icon-checked {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 0;
          height: 68.5rpx;
          width: 68.5rpx;
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 10rpx;
        }

        .icon-mode {
          mask-position: center;
          mask-size: 38.5rpx;
        }

        // 不同的播放模式
        .mode-listRepeat {
          mask-image: url('@/static/exs.png');
        }

        .mode-list {
          mask-image: url('@/static/ey5.png');
        }

        .mode-random {
          mask-image: url('@/static/eyl.png');
        }

        .mode-repeat {
          mask-image: url('@/static/ey3.png');
        }

        .icon-prev {
          mask-position: center;
          mask-size: 38.5rpx;
          mask-image: url('@/static/c5m.png');
        }

        .icon-play {
          mask-position: center;
          mask-size: 100%;
          mask-image: url('@/static/c4n.png');
        }

        .icon-pause {
          mask-position: center;
          mask-size: 100%;
          mask-image: url('@/static/ew6.png');
        }

        .icon-loading {
          mask-position: center;
          mask-size: 80%;
          mask-image: url('@/static/loading.png');
          animation: loadingRotate 1s linear infinite forwards;
        }

        @keyframes loadingRotate {
          0% {
            transform: rotate(0);
          }

          100% {
            transform: rotate(-360deg);
          }
        }

        .icon-next {
          mask-position: center;
          mask-size: 38.5rpx;
          mask-image: url('@/static/c5n.png');
        }

        .icon-queue {
          mask-position: center;
          mask-size: 38.5rpx;
          mask-image: url('@/static/eys.png');
        }
      }
    }
  }
}
</style>

