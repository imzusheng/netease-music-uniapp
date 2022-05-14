<!-- 列表单项 -->
<script lang="ts" setup>
import CardPoster from '@/components/CardPoster.vue'

const props = defineProps<{
  data: any
}>()

function toDetail(data: any) {
  uni.navigateTo({
    url: '../detail/playlist?id=' + data.payload
  })
}
</script>

<template>
  <view class="section-card__item" @click="toDetail(props.data)">
    <view class="section-card__item-spacing">
      <!-- 1.显示播放次数 + 2.歌单封面  -->
      <card-poster
        v-if="props.data.picUrl"
        class="section-card__poster"
        :pic-url="`${props.data.picUrl}?param=200y200`"
        :play-count="props.data.playCount"
      />
      <!-- 3.小标题 -->
      <text class="section-card__item-title text-ellipsis-multi">{{ props.data.title }}</text>
    </view>
  </view>
</template>

<style lang="less">
// 列表单项
.section-card__item {
  display: inline-block;
  width: var(--item-size);
  padding-top: 9rpx;
  position: relative;
  margin: 0 var(--item-spacing);
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, 0);
    width: calc(var(--item-size) * 0.86);
    height: calc(var(--item-size) * 0.86);
    background: rgb(243, 246, 245);
    border-radius: 19.2rpx;
    z-index: 1;
  }

  // 包裹
  .section-card__item-spacing {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    z-index: 2;

    .section-card__poster {
      width: var(--item-size);
      height: var(--item-size);
      border-radius: 19.2rpx;
    }
    // 3.小标题
    .section-card__item-title {
      font-size: 24rpx;
      margin-top: 14rpx;
    }
  }
}
</style>
