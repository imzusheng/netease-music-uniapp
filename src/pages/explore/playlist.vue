<!--
Author: zusheng
Date: 2022-05-03 14:49:21
LastEditTime: 2022-05-15 00:52:42
Description: 歌单广场
-->

<script lang="ts" setup>
import TheNavBar from '@/components/TheNavBar.vue'
import SectionFrame from '@/components/section/SectionFrame.vue'
import SectionFramePlaylistItem from '@/components/section/SectionFramePlaylistItem.vue'
import { onReachBottom, onReady } from '@dcloudio/uni-app'
import { computed, reactive, watchEffect, toRaw } from 'vue'
import { useStore as useMainStore } from '@/store'
import ThePopupCates from '@/components/ThePopupCates.vue'

const mainStore = useMainStore()

const data = reactive<any>({
  list: [],

  // 当前页数
  curPage: 0,

  // 总数
  total: undefined,

  // 是否还有更多
  more: false,

  // 加载状态
  loading: true,

  // 精品歌单获取更多的参数
  before: undefined
})

// 分类列表
const cate = reactive<any>({
  curTitle: '推荐',
  // 显示在顶部的分类
  list: [
    {
      // 分类名称
      title: '推荐',
      // 是否为热点
      hot: false,
      // 获取数据的函数
      func: () => getrecommendsFunc()
    },
    {
      title: '官方',
      hot: false,
      func: () => getOfficialPlaylistFunc()
    },
    {
      title: '精品',
      hot: false,
      func: () => getPlaylistHqFunc()
    },
    {
      title: '华语',
      hot: false,
      func: () => getPlaylistTopFunc('华语')
    }
  ],
  // 所有分类，扁平化
  allCategoryFlat: [],
  // 所有分类,结构型
  allCategory: {
    list: [],
    categories: []
  }
})

mainStore.setTheme('raw')

onReady(() => {
  getrecommendsFunc()
  // 获取所有分类
  mainStore.getPlaylistCatlist().then((res: any) => {
    const obj: any = {}
    res.sub.forEach((sub: any) => {
      if (obj[sub.category]) {
        obj[sub.category].push({
          title: sub.name,
          hot: sub.hot,
          func: (title: string) => getPlaylistTopFunc(title)
        })
      } else {
        obj[sub.category] = []
      }
    })
    cate.allCategoryFlat = [...cate.list, ...Object.values(obj)].flat()
    cate.list.push(...obj[1].slice(0, 5))
    cate.allCategory.list = obj
    cate.allCategory.categories = res.categories
  })
})

// 触底加载
onReachBottom(() => {
  if (data.more) {
    data.curPage += 1

    const { func } = cate.allCategoryFlat.find((item: any) => item.title === cate.curTitle)
    func()
  }
})

// 获取分类歌单
function getPlaylistTopFunc(cate: string) {
  const limit = 30

  mainStore.getPlaylistTop({ limit, offset: data.curPage * limit, cat: cate }).then((res: any) => {
    data.total = res.total
    data.list.push(...res.data)
    data.more = res.more
    data.loading = false
    console.log(toRaw(data))
  })
}
// 推荐
function getrecommendsFunc() {
  const limit = 1000
  mainStore.getRcmdPlaylist(limit).then((res: any) => {
    data.total = res.total
    data.list.push(...res.data)
    data.more = res.more
    data.loading = false
  })
}
// 精品歌单
function getPlaylistHqFunc() {
  const limit = 30
  mainStore.getPlaylistHq({ limit, before: data.before }).then((res: any) => {
    data.before = res.updateTime
    data.total = res.total
    data.list.push(...res.data)
    data.more = res.more
    data.loading = false
  })
}
// 获取官方歌单
function getOfficialPlaylistFunc() {
  const limit = 30
  mainStore.getOfficialPlaylist({ limit: 30, offset: data.curPage * limit }).then((res: any) => {
    data.total = res.total
    data.list.push(...res.data)
    data.more = res.more
    data.loading = false
  })
}

// 切换分类
function switchCate(item: any) {
  data.loading = true
  cate.curTitle = item.title
  data.curPage = 0
  data.total = 0
  data.list = []
  if (item.func) item.func(item.title)
}

// 打开所有分类
function popDisplayChange() {
  uni.$emit('popupOpen', cate.allCategory)
  uni.$once('selectCate', (res: any) => {
    switchCate(res)
    uni.$emit('popupClose')
  })
}

// 列表标题
const cateSectionTitle = computed(() => {
  if (data.total) {
    return `${cate.curTitle} - 共${data.total}张`
  } else {
    return cate.curTitle
  }
})

watchEffect(() => {
  if (data.loading) {
    uni.showLoading({
      title: '加载中'
    })
  } else {
    uni.hideLoading()
  }
})

const pageStyle = computed(() => mainStore.getPageMetaStyle)
</script>

<template>
  <page-meta :page-style="pageStyle" />

  <the-popup-cates />

  <!-- 自定义导航 -->
  <the-nav-bar :title="'歌单广场'" :back="true" :filter="false" :bg="true" />

  <view class="explorePlaylist">
    <view class="explorePlaylist-main">
      <!-- 分类列表 -->
      <view class="explorePlaylist-main__cate">
        <!-- 滚动列表 -->
        <scroll-view :scroll-x="true">
          <view
            class="explorePlaylist-main__cate-item"
            v-for="(item, idx) in cate.list"
            :key="`cate-item-${idx}`"
            :class="{ 'cate-item-text-checked': item.title === cate.curTitle }"
            @click="switchCate(item)"
          >
            <view class="explorePlaylist-main__cate-item-spacing">
              <text class="explorePlaylist-main__cate-item-text">{{ item.title }}</text>
            </view>
          </view>
        </scroll-view>

        <!-- 显示所有分类 -->
        <view class="explorePlaylist-main__cate-all" @tap.stop.prevent="popDisplayChange" />
        <!-- 背景 -->
        <view class="explorePlaylist-main__cate-all-bg" />
      </view>

      <template v-if="cate.curTitle === `推荐`">
        <section-frame title="为你推荐" :more="false">
          <template #default>
            <view class="explorePlaylist-main__list">
              <view
                class="explorePlaylist-main__list-item"
                v-for="(item, idx) in data.list"
                :key="`list-item-${idx}`"
              >
                <section-frame-playlist-item :data="item" />
              </view>
            </view>
          </template>
        </section-frame>
      </template>

      <template v-else>
        <section-frame :title="cateSectionTitle" :more="false">
          <template #default>
            <view class="explorePlaylist-main__list">
              <view
                class="explorePlaylist-main__list-item"
                v-for="(item, idx) in data.list"
                :key="`list-item-${idx}`"
              >
                <section-frame-playlist-item :data="item" />
              </view>
            </view>
          </template>
        </section-frame>
      </template>

      <!-- 加载 observe -->
      <view class="explorePlaylist-main__list-loading">
        {{ data.more || data.loading ? ' 加载更多...' : '没有更多了' }}
      </view>

      <!-- end -->
    </view>
  </view>
</template>

<style lang="less">
.explorePlaylist {
  // 单项的宽度、封面宽高
  --item-size: calc((100vw - 100rpx) / 3);

  // 单项之间的间距
  --item-spacing: 9.6rpx;

  // 页间距
  --page-spacing: 30rpx;

  width: 100%;
  min-height: 100vh;
  background: var(--theme-background-color);

  .explorePlaylist-main {
    width: 100%;
    padding-top: calc(var(--status-bar-height) + var(--nav-tab-height-custom) + 64rpx);
    padding-bottom: calc(87.2rpx + 54px);
    // box-sizing: border-box;

    // 分类列表
    .explorePlaylist-main__cate {
      overflow: hidden;
      z-index: 3;
      width: 100%;
      height: 64rpx;
      line-height: 64rpx;
      position: fixed;
      white-space: nowrap;
      box-sizing: border-box;
      padding-right: 100rpx;
      margin-bottom: 10rpx;
      background-color: var(--theme-background-color-card);
      top: calc(var(--status-bar-height) + var(--nav-tab-height-custom) - 3px);

      // 显示所有分类
      .explorePlaylist-main__cate-all {
        z-index: 2;
        position: absolute;
        top: 0;
        right: 0;
        width: 98.7rpx;
        height: 64rpx;
        background-color: var(--theme-background-color-card);

        &::after {
          z-index: 2;
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 98.7rpx;
          height: 64rpx;
          background-color: var(--theme-text-sub-color);
          mask-size: auto 40rpx;
          mask-repeat: no-repeat;
          mask-position: center;
          mask-image: url('@/static/dr8.png');
        }
      }

      .explorePlaylist-main__cate-all-bg {
        z-index: 1;
        position: absolute;
        top: 16rpx;
        right: 0;
        width: 98.7rpx;
        height: 32rpx;
        box-shadow: -6rpx 0 30rpx -6rpx var(--theme-shadow-color);
      }

      .explorePlaylist-main__cate-item {
        display: inline-block;
        height: 100%;
        padding: 0 25rpx 0 30rpx;

        .explorePlaylist-main__cate-item-spacing {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 28.2rpx;
          font-weight: 400;
          color: var(--theme-text-sub-color);

          .explorePlaylist-main__cate-item-text {
            position: relative;
            z-index: 1;
          }
        }
      }

      // 选中状态
      .cate-item-text-checked > .explorePlaylist-main__cate-item-spacing {
        font-weight: 600;
        color: var(--theme-text-title-color);
        position: relative;

        &::before {
          content: '';
          position: absolute;
          left: 0;
          bottom: 14.1rpx;
          width: 100%;
          height: 12.8rpx;
          background: linear-gradient(to right, rgb(233, 120, 110), rgb(232, 82, 90));
          border-radius: 12.8rpx;
          z-index: 0;
        }
      }
    }

    // 列表
    .explorePlaylist-main__list {
      padding: 0 20.4rpx;

      .explorePlaylist-main__list-item {
        display: inline-block;
        margin-top: 26rpx;
      }
    }

    // 加载框
    .explorePlaylist-main__list-loading {
      margin-top: 32rpx;
      width: 100%;
      height: 64rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28rpx;
      color: rgb(99, 99, 99);
    }
  }
}
</style>
