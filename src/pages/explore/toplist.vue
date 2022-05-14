<!--
Author: zusheng
Date: 2022-05-05 10:07:43
LastEditTime: 2022-05-14 10:41:47
Description: 榜单
-->

<script lang="ts" setup>
import TheNavBar from '@/components/TheNavBar.vue'
import SectionFrame from '@/components/section/SectionFrame.vue'
import SectionFramePlaylistItem from '@/components/section/SectionFramePlaylistItem.vue'
import { provide, ref, reactive, toRaw, nextTick, computed } from 'vue'
import { onReady } from '@dcloudio/uni-app'
import { useStore as useMainStore } from '@/store'

const mainStore = useMainStore()
const explorePlaylist = ref<any>()

const data = reactive<any>({
  list: [],

  // 当前页数
  curPage: 0,

  // 总数
  total: undefined,

  // 是否还有更多
  more: false,

  // 加载状态
  loading: false,

  // 精品歌单获取更多的参数
  before: undefined,

  // 是否正在切换分类（切换有300ms动画）
  seek: false
})
// 榜单分类列表
const toplistCate = reactive<any>({
  curTitle: '官方',
  keywords: [
    ['飙升榜', '新歌榜', '热歌榜', '原创榜', '畅销榜', '最火视频榜'],
    [
      'Beatport全球电子舞曲榜',
      '云音乐ACG VOCALOID榜',
      '中国新乡村音乐排行榜',
      '云音乐ACG游戏榜',
      '云音乐ACG动画榜',
      '黑胶VIP爱听榜',
      '听歌识曲榜',
      '网络热歌榜',
      'BEAT排行榜',
      '潜力爆款榜',
      'KTV唛榜'
    ],
    [
      '云音乐说唱榜',
      '云音乐电音榜',
      '云音乐ACG榜',
      '云音乐摇滚榜',
      '云音乐国电榜',
      '云音乐民谣榜',
      '云音乐古典榜',
      '云音乐古风榜',
      '中文DJ榜'
    ],
    [
      '美国Billboard榜',
      'UK排行榜周榜',
      '日本Oricon榜',
      '法国 NRJ Vos Hits 周榜',
      '俄罗斯top hit流行音乐榜',
      '云音乐欧美新歌榜',
      '云音乐欧美热歌榜',
      '云音乐日语榜',
      '云音乐韩语榜',
      '越南语榜',
      '泰语榜',
      '俄语榜'
    ]
  ],
  initScroll: 0,
  data: [
    {
      scrollTop: undefined,
      title: '官方',
      list: []
    },
    {
      scrollTop: undefined,
      title: '精选',
      list: []
    },
    {
      scrollTop: undefined,
      title: '曲风',
      list: []
    },
    {
      scrollTop: undefined,
      title: '全球',
      list: []
    }
  ]
})

uni.showLoading({ title: '加载中' })

onReady(() => {
  mainStore.getToplistDetail().then((res: any) => {
    const keywordsValues: any = toRaw(toplistCate.keywords)
    // 给排行榜手动分类，分类列表（toplistCate）
    res.forEach((v: any) => {
      const findIdx: number = keywordsValues.findIndex((keywords: Array<string>) =>
        keywords.includes(v.title)
      )
      if (findIdx > -1) {
        toplistCate.data[findIdx].list.push(v)
      }
    })
    uni.hideLoading()
    nextTick(() => {
      toplistCate.data.forEach((v: any, idx: number) => {
        uni
          .createSelectorQuery()
          .in(explorePlaylist.value)
          .select(`.top-playlist-observer-${idx}`)
          .boundingClientRect((res: any) => {
            if (idx === 0) {
              toplistCate.initScroll = res.top
              toplistCate.data[idx].scrollTop = 0
              observeSection(res.top)
            } else {
              toplistCate.data[idx].scrollTop = res.top - toplistCate.initScroll
            }
          })
          .exec()
      })
    })
  })
})

function observeSection(scrollTop: number) {
  uni
    .createIntersectionObserver(explorePlaylist.value, {
      observeAll: true,
      // 微信小程序似乎不支持 thresholds: 1
      thresholds: [0.98],
      initialRatio: 0
    })
    .relativeToViewport({ top: scrollTop })
    .observe(`.top-playlist-observer`, (res: any) => {
      if (res.intersectionRatio >= 0.98 && !data.seek) {
        toplistCate.curTitle = res.dataset.title
      }
    })
}

// 切换分类
function switchCate(item: any) {
  toplistCate.curTitle = item.title
  data.seek = true

  uni.pageScrollTo({
    scrollTop: toplistCate.data[item.idx].scrollTop,
    duration: 200
  })
  setTimeout(() => (data.seek = false), 300)
}
</script>

<template>
  <page-meta :page-style="mainStore.getPageMetaStyle" />

  <!-- 自定义导航 -->
  <the-nav-bar
    :title="'排行榜'"
    :back="true"
    :filter="false"
    title-color="black"
    theme-color="255, 255, 255, 1"
  />

  <view class="explorePlaylist" ref="explorePlaylist">
    <view class="explorePlaylist-main">
      <!-- 分类列表 -->
      <view class="explorePlaylist-main__cate">
        <!-- 滚动列表 -->
        <scroll-view :scroll-x="true">
          <view
            class="explorePlaylist-main__cate-item"
            v-for="(item, idx) in toplistCate.data"
            :key="`cate-item-${idx}`"
            :class="{ 'cate-item-text-checked': item.title === toplistCate.curTitle }"
            @click="switchCate({ title: item.title, idx: idx })"
          >
            <view class="explorePlaylist-main__cate-item-spacing">
              <text class="explorePlaylist-main__cate-item-text">{{ item.title }}</text>
            </view>
          </view>
        </scroll-view>
      </view>

      <view
        v-for="(cateItem, cateIdx) in toplistCate.data"
        :key="`cate-py-${cateIdx}`"
        :data-title="cateItem.title"
        :class="`top-playlist-observer top-playlist-observer-${cateIdx}`"
      >
        <section-frame :title="cateItem.title + '榜'" :more="false">
          <template #default>
            <view class="explorePlaylist-main__list">
              <view
                class="explorePlaylist-main__list-item"
                v-for="(item, idx) in cateItem.list"
                :key="`list-item-${idx}`"
              >
                <section-frame-playlist-item :data="item" />
              </view>
            </view>
          </template>
        </section-frame>
      </view>

      <!-- 加载 observe -->
      <view class="explorePlaylist-main__list-loading">
        {{ data.more || data.loading ? ' 加载更多...' : '没有更多了' }}
      </view>

      <!-- end -->
    </view>
  </view>
</template>

<style lang="less" scoped>
.explorePlaylist {
  // 单项的宽度、封面宽高
  --item-size: calc((100vw - 100rpx) / 3);

  // 单项之间的间距
  --item-spacing: 9.6rpx;

  // 页间距
  --page-spacing: 30rpx;

  width: 100%;
  height: 100vh;
  background: linear-gradient(#fff, rgb(248, 248, 248));

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
      background-color: #fff;
      top: calc(var(--status-bar-height) + var(--nav-tab-height-custom) - 3px);

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
          color: rgb(99, 99, 99);

          .explorePlaylist-main__cate-item-text {
            position: relative;
            z-index: 1;
          }
        }
      }

      // 选中状态
      .cate-item-text-checked > .explorePlaylist-main__cate-item-spacing {
        font-weight: 600;
        color: rgb(51, 51, 51);
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
