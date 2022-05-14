<!--
Author: zusheng
Date: 2022-04-24 11:36:12
LastEditTime: 2022-05-14 17:41:17
Description: 滚动列表单项
FilePath: \uni-preset-vue-vite-ts\src\components\section\SectionFramePlaylistScroll.vue
-->

<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import { onShow, onHide } from '@dcloudio/uni-app'

const props = defineProps<{
  list: Array<any>
}>()

// 当前滚动的标题
const title = ref<string>('标题')
const scrollIdx = ref<number>(0)
const autoplay = ref<boolean>(true)

onShow(() => {
  autoplay.value = true
})

onHide(() => {
  autoplay.value = false
})

function idChange(e: any) {
  const curIdx: number = e.detail.current
  scrollIdx.value = curIdx
  title.value = props.list[curIdx].title
}

watchEffect(() => {
  if (props.list.length > 0) {
    title.value = props.list[0].title
  }
})

function toDetail() {
  const data = props.list[scrollIdx.value]
  uni.navigateTo({
    url: '../detail/playlist?id=' + data.payload
  })
}
</script>

<template>
  <view class="section-card__item" @click="toDetail">
    <view class="section-card__item-spacing">
      <!-- 1.显示播放次数 -->
      <image
        class="section-card__badge-infinite"
        src="@/static/icon-infinite.png"
        mode="aspectFit"
      />
      <!-- 2.滚动封面 -->
      <swiper
        class="section-card__scroll"
        @change="idChange"
        :autoplay="autoplay"
        :vertical="true"
        :disable-touch="true"
        :skip-hidden-item-layout="true"
        :interval="3000"
        :duration="500"
        :circular="true"
      >
        <swiper-item v-for="(item, idx) in props.list" :key="`scroll-item-${idx}`">
          <image
            class="section-card__scroll-image image-hide"
            :class="{ 'image-show': scrollIdx === idx }"
            :src="`${item.picUrl}?param=200y200`"
            mode="aspectFit"
          />
        </swiper-item>
      </swiper>
      <!-- 3.小标题 -->
      <text class="section-card__item-title text-ellipsis-multi">{{ title }}</text>
    </view>
  </view>
</template>

<style lang="less">
// 列表单项
.section-card__item {
  display: inline-block;
  width: var(--item-size);
  padding-top: 9rpx;
  margin: 0 var(--item-spacing);
  position: relative;

  // 包裹
  .section-card__item-spacing {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    // 1.无限滚动icon
    .section-card__badge-infinite {
      position: absolute;
      top: 0;
      right: -12rpx;
      height: 48rpx;
      width: 96rpx;
      z-index: 1;
    }
    // 2.滚动封面
    .section-card__scroll,
    .section-card__scroll-image {
      width: var(--item-size);
      height: var(--item-size);
      border-radius: 19.2rpx;
      transition: transform 0.3s;
    }
    .image-hide {
      transform: scale(0.8);
    }

    .image-show {
      transform: scale(1) !important;
    }
    // 3.小标题
    .section-card__item-title {
      font-size: 24rpx;
      margin-top: 14rpx;
    }
  }
}
</style>
