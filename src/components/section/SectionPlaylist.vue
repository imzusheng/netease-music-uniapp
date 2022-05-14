<!--
Author: zusheng
Date: 2022-04-30 21:25:28
LastEditTime: 2022-05-11 22:49:06
Description: 首页分区-播放列表卡片
FilePath: \uni-preset-vue-vite-ts\src\components\section\SectionPlaylist.vue
-->

<script lang="ts" setup>
import SectionFrame from '@/components/section/SectionFrame.vue'
import SectionFrameScroll from '@/components/section/SectionFramePlaylistScroll.vue'
import SectionFrameItem from '@/components/section/SectionFramePlaylistItem.vue'

const props = defineProps<{
  // 分区标题
  title: string

  data: {
    list: Array<any>

    scrollList: Array<any>
  }
}>()
</script>

<template>
  <section-frame :title="props.title" :more="true">
    <template #default>
      <!-- 歌单列表 -->
      <scroll-view class="section-card__main" :scroll-x="true" :enable-flex="true">
        <view
          class="section-card__main-spacing-left"
          :class="{ 'playlist-scroll-show': props.data.scrollList.length > 0 }"
        >
          <!-- 滚动歌单列表 -->
          <section-frame-scroll
            class="section-card__main-spacing-scroll"
            v-if="props.data.scrollList.length > 0"
            :list="props.data.scrollList"
          />

          <!-- 歌单列表 -->
          <template v-for="(item, idx) in props.data.list" :key="`section-card-${idx}`">
            <section-frame-item
              :class="{ 'playlist-item-last': props.data.list.length - 1 === idx }"
              :data="item"
            />
          </template>
        </view>
      </scroll-view>
    </template>
  </section-frame>
</template>

<style lang="less" scoped>
// 歌单列表栏 scroll-view
.section-card__main {
  // 单项的宽度、封面宽高
  --item-size: 211.5rpx;

  // 单项之间的间距
  --item-spacing: 9.6rpx;

  white-space: nowrap;
  margin-top: 12rpx;

  .playlist-scroll-show {
    padding-left: calc(var(--item-size) + var(--item-spacing) * 2);
  }

  .section-card__main-spacing-left {
    position: relative;
    margin-left: calc(var(--page-spacing) - var(--item-spacing));
    .section-card__main-spacing-scroll {
      position: absolute;
      top: 0;
      left: 0;
    }
    // 最后一项
    .playlist-item-last {
      margin-right: var(--page-spacing);
      position: relative;
    }
  }
}
</style>
