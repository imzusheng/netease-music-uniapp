<!--
Author: zusheng
Date: 2022-04-26 23:52:31
LastEditTime: 2022-05-15 01:18:08
Description: 歌曲列表
FilePath: \uni-preset-vue-vite-ts\src\components\ListSongs.vue
-->

<script lang="ts" setup>
import ListSongsInfinite from '@/components/ListSongsInfinite.vue'
import ListSongsCommon from '@/components/ListSongsCommon.vue'
import { Song } from '@/types'
import { onReachBottom } from '@dcloudio/uni-app'
import { reactive, watchEffect } from 'vue'
import { useStore as useMainStore } from '@/store'
import { useStore as usePlayerStore } from '@/store/player'

const store = useMainStore()
const playerStore = usePlayerStore()
const props = defineProps<{
  // 歌曲所有id数组
  trackIds: Array<number>

  // 是否用虚拟滚动列表
  infinite: boolean

  // 播放全部按钮背景色，rgba
  actionBg: string
}>()

const data = reactive<any>({
  songs: [] as Array<Song>,

  // 已经请求的次数
  trackRequestCount: 0
})

onReachBottom(() => getData())

const stopWatcher = watchEffect(() => {
  if (props?.trackIds?.length > 0) {
    getData()
    setTimeout(() => stopWatcher(), 0)
  }
})

/**
 * 获取数据
 */
function getData() {
  // 一次加载数量
  const onceLoadCount = 300

  // 当已经请求的数量小于总数量时
  if (data.trackRequestCount <= Math.floor(props.trackIds?.length / onceLoadCount)) {
    if (props.trackIds?.length >= onceLoadCount) {
      // 当歌曲数量过多，需要分段加载时
      const startIdx = data.trackRequestCount * onceLoadCount
      data.trackRequestCount++
      const endIdx = data.trackRequestCount * onceLoadCount
      uni.showLoading({ title: `加载中` })
      store.getSongsDetail(props.trackIds.slice(startIdx, endIdx)).then((res: Array<Song>) => {
        data.songs.push(...res)
        // 歌曲序号
        data.songs.map((v: any, i: number) => {
          v.idx = i + 1
          return v
        })
        uni.hideLoading()
      })
    } else {
      // 一次加载
      uni.showLoading({ title: `加载中` })
      data.trackRequestCount++
      store.getSongsDetail(props.trackIds).then((res: Array<Song>) => {
        data.songs = res.map((v, i) => {
          v.idx = i + 1
          return v
        })
        uni.hideLoading()
      })
    }
  }
}

/**
 * 播放全部
 */
function playAll() {
  const nextSongId = data.songs[0].payload
  playerStore.setPlayerInfo(nextSongId)
  uni.showToast({
    title: '正在加入队列',
    icon: 'loading',
    duration: 2000
  })
  store.getSongsDetail(props.trackIds).then((res: Array<Song>) => {
    playerStore.setQueue(res)
    uni.showToast({
      title: '已添加至队列',
      icon: 'success',
      duration: 2000
    })
  })
  uni.navigateTo({
    url: `../../pages/player/index?type=poster&payload=${data.payload}`
  })
}
</script>

<template>
  <view class="list-songs">
    <!-- 播放全部按钮 -->
    <view class="list-songs__action">
      <!-- 左侧 按钮 -->
      <view class="list-songs__action-left" @tap.stop.prevent="playAll">
        <view class="list-songs__action-left-play" />
        <view class="list-songs__action-left-desc">
          <text class="action-left-desc__text-1">播放全部</text>
          <text class="action-left-desc__text-2">({{ props.trackIds.length }})</text>
        </view>
      </view>
      <!-- 右侧（搁置） 下载和选中 -->
      <view class="list-songs__action-right">
        <view class="list-songs__action-right-download"></view>
        <view class="list-songs__action-right-opt" />
      </view>
    </view>

    <!-- 歌单列表 s -->
    <list-songs-infinite v-if="props.infinite" :songs="data.songs" />
    <list-songs-common v-else :songs="data.songs" />
    <!-- 歌单列表 e -->
  </view>
</template>

<style lang="less" scoped>
// 歌单列表
.list-songs {
  width: 100%;
  height: 100%;
  flex: 1;
  position: relative;
  // background: #fff;
  padding: 0 23rpx;
  z-index: 1;
  box-sizing: border-box;
  margin-bottom: 54px;

  // 播放全部按钮
  .list-songs__action {
    z-index: 2;
    position: sticky;
    top: calc(var(--nav-tab-height-custom) + var(--status-bar-height) - 1px);
    left: 0;
    height: 102.5rpx;
    width: 100vw;
    // padding: 0 23rpx;
    // margin-left: -23rpx;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--theme-background-color-card);

    .list-songs__action-left,
    .list-songs__action-right {
      height: 38.5rpx;
      display: flex;
      align-items: center;
    }

    .list-songs__action-left {
      // 播放按钮
      .list-songs__action-left-play {
        width: 38.5rpx;
        height: 38.5rpx;
        border-radius: 50%;
        background-size: 40%;
        background-position: center;
        background-repeat: no-repeat;
        background-color: var(--theme-color);
        background-image: url('@/static/icon-play-square.png');
        margin-right: 20.5rpx;
      }
      //
      .list-songs__action-left-desc {
        .action-left-desc__text-1 {
          font-size: 32rpx;
          font-weight: 600;
          color: var(--theme-text-title-color);
          margin-right: 16rpx;
        }
        .action-left-desc__text-2 {
          font-size: 21.7rpx;
          font-weight: 400;
          color: rgb(153, 153, 153);
        }
      }
    }
  }
}
</style>
