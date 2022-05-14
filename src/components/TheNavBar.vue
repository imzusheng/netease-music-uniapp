<script lang="ts" setup>
import { computed } from 'vue'
import { useStore } from '@/store'

const store = useStore()
const props = defineProps<{
  // 是否显示返回按钮
  back: boolean

  // 导航标题
  title: string

  // 背景是否开启滤镜
  filter: boolean

  // 背景是否显示
  bg: boolean
}>()

const filter = computed(() => {
  return props.filter
})
const titleColor = computed(() => {
  return store.getCurTheme.textTitleColor
})
const themeColor = computed(() => {
  return props.bg ? store.getCurTheme.backgroundColorCard : 'transparent'
})
const backBtn = computed(() => {
  return typeof props.back === 'boolean' ? props.back : true
})

// 返回上一页
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
</script>

<template>
  <view :class="`nav-bar ${filter ? 'nav-bar-filter' : ''}`" :style="{ background: themeColor }">
    <view
      class="nav-bar-spacing"
      :style="{ 'justify-content': backBtn ? 'space-between' : 'center' }"
    >
      <view
        v-if="backBtn"
        class="nav-bar__back"
        :style="{ 'background-color': titleColor }"
        @click="back"
      />
      <text class="nav-bar__title text-ellipsis-single" :style="{ color: titleColor || 'black' }">
        {{ props.title }}
      </text>
      <view v-if="props.back" class="nav-bar__search"></view>
    </view>
  </view>
</template>

<style lang="less" scoped>
.nav-bar {
  z-index: 1001;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding-top: var(--status-bar-height);
  height: var(--nav-tab-height-custom);
  overflow: hidden;

  .nav-bar-spacing {
    display: flex;
    align-items: center;
    width: 100%;
    height: var(--nav-tab-height-custom);
    box-sizing: border-box;
    position: relative;
    z-index: 1003;

    .nav-bar__title {
      z-index: 1003;
      color: var(--nav-title-color);
      font-weight: 700;
      font-size: 33.33rpx;
      line-height: 1.5;
      padding: 0 64rpx 0 32rpx;
      box-sizing: border-box;
    }

    .nav-bar__back,
    .nav-bar__search {
      flex-shrink: 0;
      z-index: 1003;
      height: 100%;
      width: 44.8rpx;
      padding: 0 30rpx;
      position: relative;
    }

    .nav-bar__back {
      mask-position: center;
      mask-repeat: no-repeat;
      mask-image: url('@/static/icon-arrow-left.png');
      mask-size: auto 44.8rpx;
    }
  }
}

.nav-bar-filter {
  backdrop-filter: saturate(200%) blur(20px) !important;
  /* #ifdef H5 */
  backdrop-filter: none !important;
  background: var(--theme-background-color-card) !important;
  /* #endif */
}
</style>
