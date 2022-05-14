<!--
Author: zusheng
Date: 2022-04-29 19:40:15
LastEditTime: 2022-05-13 19:34:38
Description: 歌曲列表-虚拟无限滚动列表
FilePath: \uni-preset-vue-vite-ts\src\components\ThePlayerQueueInfinite.vue
-->

<script lang="ts" setup>
import { Song } from '@/types'
import { useStore as usePlayerStore } from '@/store/player'
import { computed, reactive, watchEffect, nextTick, getCurrentInstance, ref } from 'vue'

const props = defineProps<{
  // 列表数据
  songs: Array<Song>

  // 父组件的scroll-view滚动条高度
  scrollTop: number
}>()

const playerStore = usePlayerStore()
const instance = getCurrentInstance()
const selector = uni.createSelectorQuery().in(instance)
const systemInfo = uni.getSystemInfoSync()
const loading = ref<boolean>(true)
const data = reactive<any>({
  // 截取数组的下标
  startIdx: 0,
  endIdx: 1,

  // 一页能显示的个数
  screenCount: 0,

  // 整个列表的总高度
  listHeight: '100%',

  // 每个li的高度
  unitHeight: 0,

  // 列表距离顶部的距离
  viewScrollTop: 0,

  // 滚动区域的高度
  scrollViewHeight: 0
})

watchEffect(() => {
  if (props.songs.length > 0) {
    nextTick(() => {
      selector
        .select('.infinite__list')
        .boundingClientRect((res: any) => {
          data.scrollViewHeight = res.height
        })
        .exec()

      // 获取每首歌li的高度
      selector
        .select('.infinite__item')
        .boundingClientRect((res: any) => {
          data.viewScrollTop =
            res.top > systemInfo.screenHeight ? systemInfo.screenHeight - res.top : res.top
          data.unitHeight = res.height
          data.listHeight = res.height * props.songs.length + 'px'
          data.screenCount = data.endIdx = Math.ceil(data.scrollViewHeight / data.unitHeight)
          nextTick(() =>
            setTimeout(() => {
              loading.value = false
            }, 100)
          )
        })
        .exec()
    })
  }
})

const songs = computed(() => {
  return props.songs.slice(data.startIdx, data.endIdx)
})

const pdTop = computed(() => {
  const paddingTop = data.unitHeight * data.startIdx
  return `${paddingTop}px`
})

function scrollHandler(e: any) {
  const scrollTop = (e.scrollTop * 1000 - data.viewScrollTop * 1000) / 1000

  // 提前渲染数量
  const preload = Math.ceil(data.screenCount / 2)

  let startIdx
  let endIdx

  if (scrollTop >= 0) {
    endIdx = Math.floor(scrollTop / data.unitHeight) + data.screenCount + preload
    if (endIdx > props.songs.length) endIdx = props.songs.length

    startIdx = endIdx - data.screenCount - 1 - preload * 2
    if (startIdx < 0) startIdx = 0
  } else {
    startIdx = 0
    endIdx = data.screenCount + preload
  }

  if (startIdx !== data.startIdx) data.startIdx = startIdx
  if (endIdx !== data.endIdx) data.endIdx = endIdx
}

/**
 * 播放单曲
 */
function toPlayer(data: Song) {
  playerStore.setPlayerInfo(data.payload)
}

watchEffect(() => {
  if (props.scrollTop) {
    scrollHandler({ scrollTop: props.scrollTop })
  }
})
</script>

<template>
  <view :style="{ position: 'absolute', height: data.listHeight }">
    <slot name="title"></slot>
  </view>

  <!-- 虚拟无限滚动列表 s -->
  <view
    class="infinite__list"
    :style="{
      opacity: loading ? 0 : 1,
      height: data.listHeight,
      'padding-top': pdTop
    }"
  >
    <!-- items s -->
    <view
      v-for="item in songs"
      :key="item.payload"
      class="player-detail__queue-li infinite__item"
      :class="{ 'queue-li-active': item.payload === playerStore.playerInfo.payload }"
      @tap="toPlayer(item)"
    >
      <image
        v-if="item.payload === playerStore.playerInfo.payload"
        class="player-detail__queue-li__poster"
        src="@/static/equaliser.svg"
        mode="aspectFit"
      />
      <image
        v-else
        class="player-detail__queue-li__poster"
        :src="item.picUrl + '?param=50y50'"
        mode="aspectFit"
      />
      <view class="player-detail__queue-li__info text-ellipsis-single">
        <view class="player-detail__queue-li__info-title text-ellipsis-single">
          {{ item.title }}
        </view>
        <view class="player-detail__queue-li__info-artist text-ellipsis-single">
          {{ item.artist }}
        </view>
      </view>
      <view class="player-detail__queue-li__handle" />
    </view>
    <!-- items e -->
  </view>
  <!-- 虚拟无限滚动列表 e -->
</template>

<style lang="less">
.infinite__list {
  box-sizing: border-box;
  transition: opacity 0.3s;
}

.player-detail__queue-li {
  height: 92rpx;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 7.7rpx 0;
  // 封面
  .player-detail__queue-li__poster {
    height: 92rpx;
    width: 92rpx;
    padding: 0;
    border-radius: 10rpx;
  }
  // 歌曲信息
  .player-detail__queue-li__info {
    flex: 1;
    padding: 0 33rpx;
    box-sizing: border-box;
    line-height: 1.6;
    .player-detail__queue-li__info-title {
      font-size: 32rpx;
      color: #fff;
      font-weight: 400;
    }
    .player-detail__queue-li__info-artist {
      font-size: 24rpx;
      color: rgb(232, 232, 232);
      font-weight: 400;
    }
  }
  // 拖动把手
  .player-detail__queue-li__handle {
    height: 92rpx;
    width: 92rpx;
    background-color: rgb(232, 232, 232);
    mask-size: 40%;
    mask-position: right center;
    mask-repeat: no-repeat;
    mask-image: url('@/static/ed5.png');
  }
}

// 正在播放的样式
.queue-li-active {
  // 封面
  .player-detail__queue-li__poster {
    height: 92rpx;
    width: 92rpx;
    border-radius: 10rpx;
    padding: 28rpx;
    box-sizing: border-box;
  }

  // 歌曲信息
  .player-detail__queue-li__info {
    .player-detail__queue-li__info-title {
      color: var(--theme-color);
    }
    .player-detail__queue-li__info-artist {
      color: var(--theme-color);
    }
  }
}
</style>
