<!--
Author: zusheng
Date: 2022-04-29 12:41:58
LastEditTime: 2022-05-13 17:13:04
Description: 歌曲列表-虚拟无限滚动列表
FilePath: \uni-preset-vue-vite-ts\src\components\ListSongsInfinite.vue
-->

<script lang="ts" setup>
import { Song } from '@/types'
import { computed, reactive, watchEffect, nextTick, getCurrentInstance, toRaw } from 'vue'
import { onPageScroll } from '@dcloudio/uni-app'
import { useStore as usePlayerStore } from '@/store/player'

const usePlayer = usePlayerStore()
const props = defineProps<{
  // 列表数据
  songs: Array<any>
}>()

const instance = getCurrentInstance()
const systemInfo = uni.getSystemInfoSync()
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
  viewScrollTop: undefined
})

watchEffect(() => {
  if (props.songs.length > 0) {
    nextTick(() => {
      // 初始化时只渲染一条数据，用来获取计算需要的信息。然后再渲染第一屏数据
      uni
        .createSelectorQuery()
        .in(instance)
        .select('.infinite__item')
        .boundingClientRect((res: any) => {
          if (data.viewScrollTop === undefined) {
            // 滚动区域距离屏幕顶部的距离
            data.viewScrollTop = res.top
            // 每首歌li的高度
            data.unitHeight = res.height
            // 所有数据的原始高度
            data.listHeight = res.height * props.songs.length + 'px'
            // 满屏可以显示多少条数据（设置后开始渲染一屏的数据）
            data.screenCount = data.endIdx = Math.ceil(systemInfo.screenHeight / data.unitHeight)
          } else {
            // 所有数据的原始高度
            data.listHeight = res.height * props.songs.length + 'px'
          }
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
  const preload = Math.ceil(data.screenCount * 2)

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

onPageScroll((e: any) => scrollHandler(e))

// 播放单曲
function tapHandler(e: any) {
  const curSongIdx = Math.floor((e.changedTouches[0].pageY - data.viewScrollTop) / data.unitHeight)
  const curSongInfo = props.songs[curSongIdx]

  if (Object.keys(e.target.dataset).includes('onMore')) {
    uni.$emit('popupOpen', curSongInfo)
  } else {
    usePlayer.setPlayerInfo(curSongInfo.payload)
    // 打开播放器
    uni.navigateTo({
      url: `../../pages/player/index?type=poster&payload=${data.payload}`
    })
  }
}
</script>

<template>
  <view
    id="infinite__ul"
    @tap.stop.prevent="tapHandler($event)"
    class="list-songs__ul infinite__list"
    :style="{
      height: data.listHeight,
      'padding-top': pdTop
    }"
  >
    <!-- 绝了，注释如果放在根节点，获取当前组件实例时就是#text，会把注释也算进去 -->
    <!-- items s -->
    <view
      class="list-songs__li infinite__item"
      v-for="item in songs"
      :key="item.payload"
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
        <view data-on-more class="list-songs__li-main-btn__more" />
      </view>
    </view>
    <!-- items e -->
  </view>
</template>

<style lang="less" scoped>
// 歌曲列表
.list-songs__ul {
  box-sizing: border-box;
  width: 100%;
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
