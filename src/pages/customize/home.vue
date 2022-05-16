<!--
Author: zusheng
Date: 2022-05-08 16:47:28
LastEditTime: 2022-05-16 22:49:45
Description: 用户主页
FilePath: \uni-preset-vue-vite-ts\src\pages\customize\home.vue
-->
<script lang="ts" setup>
import TheNavBar from '@/components/TheNavBar.vue'
import { reactive, ref, computed, nextTick } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useStore } from '@/store'

const store = useStore()
const data = reactive<any>({
  homePageConfig: {},

  /**
   * 当前正在拖动的单位名字
   */
  curName: '',

  /**
   * 拖动结束时的高度
   */
  curTop: 0,

  /**
   * 是否可拖拽
   */
  disabled: true
})

onShow(() => store.setTheme('raw'))

let obj: any = {}
Object.values(store.getHomePageConfig).forEach((val: any) => {
  val.time = Date.now() + val.order
  val.top = (val.order - 1) * 50
  obj[val.order] = val
})
data.homePageConfig = obj
obj = null

const movableStyleZidx = computed(() => {
  return function (item: any) {
    return data.curName === item.name ? 99 : 1
  }
})

const movableStyleBg = computed(() => {
  return function (item: any) {
    return data.curName === item.name && !data.disabled
  }
})

function movableChangeY(e: any, item: any) {
  data.curName = data.disabled ? '' : item.name
  data.curTop = e.detail.y
}

/**
 * 更新列表 time
 * @param homePageConfig
 */
function orderList(homePageConfig: any) {
  let obj: any = {}
  Object.values(homePageConfig).forEach((v: any, idx: number) => {
    v.time = Date.now() + v.order
    v.top = (v.order - 1) * 50
    obj[idx + 1] = v
  })

  data.homePageConfig = obj

  obj = {}
  Object.values(data.homePageConfig).forEach((v: any, idx: number) => {
    obj[v.code] = v
  })

  uni.setStorageSync('homePageConfig', obj)
}

/**
 * 拖动结束
 */
function touchEndHandler(item: any) {
  if (data.disabled) return
  setTimeout(() => {
    data.curName = ''
    // 移动后的序号，不是下标
    const curCount = Math.floor(data.curTop / 50) + 1
    const homePageConfig = JSON.parse(JSON.stringify(data.homePageConfig))

    if (item.order > curCount) {
      // 向上拖动
      orderToUp(homePageConfig, item, curCount)
    } else if (item.order < curCount) {
      // 向下
      orderToLow(homePageConfig, item, curCount)
    } else {
      // 不动
      orderList(homePageConfig)
    }
    nextTick(() => (data.disabled = true))
  }, 100)
}
/**
 * 上级，向上滚动
 */
function orderToUp(homePageConfig: any, item: any, curCount: number) {
  let obj: any = {}
  Object.values(homePageConfig).forEach((v: any) => {
    if (v.order === item.order) {
      v.order = curCount + 1
    } else if (item.order > v.order && v.order > curCount) {
      v.order += 1
    }
    v.time = Date.now() + v.order
    v.top = (v.order - 1) * 50
    obj[v.order] = v
  })

  data.homePageConfig = obj

  obj = {}
  Object.values(data.homePageConfig).forEach((v: any, idx: number) => {
    obj[v.code] = v
  })
  uni.setStorageSync('homePageConfig', obj)
}

/**
 * 降级，向下拖动
 */
function orderToLow(homePageConfig: any, item: any, curCount: number) {
  let obj: any = {}
  Object.values(homePageConfig).forEach((v: any) => {
    if (v.order === item.order) {
      v.order = curCount
    } else if (item.order < v.order && v.order <= curCount) {
      v.order -= 1
    }
    v.top = (v.order - 1) * 50
    v.time = Date.now() + v.order
    obj[v.order] = v
  })

  data.homePageConfig = obj

  obj = {}
  Object.values(data.homePageConfig).forEach((v: any, idx: number) => {
    obj[v.code] = v
  })
  uni.setStorageSync('homePageConfig', obj)
}

/**
 * 允许拖动
 */
function touchStartHandler(item: any) {
  data.disabled = false
  data.curName = item.name
  uni.vibrateShort({
    fail: () => {}
  })
}

/**
 * 隐藏项目
 */
function setDisabled(item: any) {
  data.homePageConfig[item.order].disable = true
  orderList(data.homePageConfig)
}

/**
 * 显示项目
 */
function setUnDisabled(item: any) {
  data.homePageConfig[item.order].disable = false
  orderList(data.homePageConfig)
}

const listData: any = computed(() => Object.values(data.homePageConfig))

const pageStyle = computed(() => store.getPageMetaStyle)
</script>

<template>
  <page-meta :page-style="pageStyle" />

  <!-- ↓ 自定义导航 -->
  <the-nav-bar title="自定义主页" :back="true" :filter="false" :bg="true" />

  <view class="setting-home-wrap fixed-top">
    <view style="width: 100%; height: 30.7rpx"></view>
    <view
      style="
        width: 100%;
        height: 30.7rpx;
        color: var(--theme-text-sub-color);
        text-align: right;
        font-size: 28rpx;
      "
    >
      仅小程序支持拖拽排序，重启小程序后生效
    </view>
    <view style="width: 100%; height: 30.7rpx"></view>
    <movable-area
      class="setting-home-wrap__movable-area"
      :style="{ height: `${listData.length * 50}px` }"
    >
      <movable-view
        v-for="(item, idx) in listData"
        :key="`${item.time}-${item.order}`"
        class="setting-home-wrap__movable-view"
        :class="{ 'movable-active': movableStyleBg(item), 'movable-disable': item.disable }"
        :style="{
          'z-index': movableStyleZidx(item)
        }"
        :damping="60"
        :y="item.top"
        :inertia="false"
        :data-order="item.top"
        :direction="'all'"
        :out-of-bounds="false"
        :disabled="data.disabled"
        @longpress="touchStartHandler(item)"
        @change="movableChangeY($event, item)"
        @touchend="touchEndHandler(item)"
      >
        <view class="movable-view__spacing">
          <view class="movable-view__spacing-left">
            <view
              v-if="!item.disable"
              class="movable-view__spacing-left-image-wrap"
              @tap="setDisabled(item)"
            >
              <image
                class="movable-view__spacing-left-image"
                src="@/static/f2l.png"
                mode="aspectFit"
              />
            </view>
            <view v-else class="movable-view__spacing-left-image-wrap" @tap="setUnDisabled(item)">
              <image
                class="movable-view__spacing-left-image"
                src="@/static/c2v_.png"
                mode="aspectFit"
              />
            </view>
            {{ item.name }}
          </view>
          <view class="movable-view__spacing-right" />
        </view>
      </movable-view>
    </movable-area>

    <view style="width: 100%; height: 30.7rpx"></view>
  </view>
</template>

<style lang="less" scoped>
.setting-home-wrap {
  width: 100%;
  height: 100%;
  min-height: calc(100vh - var(--window-bottom));
  box-sizing: border-box;
  position: relative;
  padding-left: 30.7rpx;
  padding-right: 30.7rpx;
  background-color: var(--theme-background-color);

  // 正在拖动的样式
  .movable-active {
    .movable-view__spacing {
      background-color: var(--theme-background-color-clear) !important;
    }
  }

  // 隐藏的样式
  .movable-disable {
    opacity: 0.5;
  }

  .setting-home-wrap__movable-area {
    width: 100%;
    background-color: var(--theme-background-color-card);
    border-radius: 24rpx;
    overflow: hidden;
  }

  .setting-home-wrap__movable-view {
    width: 100%;
    height: 50px;
    z-index: 1;
    background-color: var(--theme-background-color-card);

    .movable-view__spacing {
      width: 100%;
      height: 50px;
      // padding: 30.7rpx;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      background-color: var(--theme-background-color-card);
      border-radius: 12rpx;
      align-items: center;

      .movable-view__spacing-left {
        font-size: 16px;
        color: var(--theme-text-title-color);
        display: flex;
        align-items: center;
        .movable-view__spacing-left-image-wrap {
          padding: 30.7rpx;
          height: 15px;
          width: 15px;
          .movable-view__spacing-left-image {
            height: 15px;
            width: 15px;
            margin-right: 32rpx;
          }
        }
      }

      .movable-view__spacing-right {
        width: 50px;
        height: 50px;
        background-color: var(--theme-text-sub-color);
        mask-size: 16px auto;
        mask-position: center;
        mask-repeat: no-repeat;
        mask-image: url('@/static/ed5.png');
      }
    }
  }
}
</style>

