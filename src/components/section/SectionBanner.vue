<!--
Author: zusheng
Date: 2022-04-24 17:04:40
LastEditTime: 2022-05-14 17:41:27
Description: 首页分区-banner
FilePath: \uni-preset-vue-vite-ts\src\components\section\SectionBanner.vue
-->

<script lang="ts" setup>
import { ref } from 'vue'
import { onShow, onHide } from '@dcloudio/uni-app'
const props = defineProps<{
  list: Array<any>
}>()

const autoplay = ref<boolean>(true)

onShow(() => {
  autoplay.value = true
})

onHide(() => {
  autoplay.value = false
})

function toDetail(item: any) {
  console.log(item)
  // uni.redirectTo({
  //   url: encodeURIComponent(url)
  // })
}
</script>

<template>
  <swiper
    v-if="props.list.length > 0"
    class="section-banner"
    :indicator-dots="true"
    :autoplay="autoplay"
    :interval="3000"
    :duration="500"
    :circular="true"
  >
    <swiper-item v-for="bannerItem in props.list" :key="bannerItem.bannerId">
      <image
        class="section-banner-image"
        :src="bannerItem.pic"
        mode="aspectFit"
        @tap.stop.prevent="toDetail(bannerItem)"
      />
    </swiper-item>
  </swiper>
</template>

<style lang="less">
// banner
.section-banner {
  height: 270rpx;
  width: calc(100% - (var(--page-spacing) * 2));
  margin: 38rpx auto;
  clip-path: inset(0 round 19.2rpx);

  .section-banner-image {
    width: 100%;
    height: 100%;
  }
}
</style>
