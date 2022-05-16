<!--
Author: zusheng
Date: 2022-05-11 20:12:08
LastEditTime: 2022-05-16 22:46:24
Description: 主页
FilePath: \uni-preset-vue-vite-ts\src\pages\index\home.vue
-->
<script lang="ts" setup>
import { getActionBtn, getHomePageHandler } from '@/common/requestHandler'
import TheNavBar from '@/components/TheNavBar.vue'
import ThePlayerBottomBar from '@/components/ThePlayerBottomBar.vue'
import SectionBanner from '@/components/section/SectionBanner.vue'
import SectionActionBall from '@/components/section/SectionActionBall.vue'
import SectionPlaylist from '@/components/section/SectionPlaylist.vue'
import SectionSonglist from '@/components/section/SectionSonglist.vue'
import SectionTopic from '@/components/section/SectionTopic.vue'
import SectionTablist from '@/components/section/SectionTablist.vue'
import SectionMusicCalendar from '@/components/section/SectionMusicCalendar.vue'
import { onPullDownRefresh, onReachBottom, onShow } from '@dcloudio/uni-app'
import { reactive, computed, toRaw } from 'vue'
import { useStore } from '@/store'

const store = useStore()
const data = reactive<any>({
  loading: true,
  offset: 0,
  more: true,
  // 是否正在请求所有数据，防止onReachBottom多次触发
  getAllData: false,
  // 获取的原始blocks数据
  blocks: [],
  /**
   * 主页action按钮
   */
  actionBall: []
})

const homePageConfig = store.getHomePageConfig

// 下拉刷新
onPullDownRefresh(() => {
  uni.vibrateShort({
    fail: () => {}
  })
  Object.assign(data, {
    offset: 0,
    more: true
  })
  init()
})

// 触底加载
onReachBottom(() => {
  uni.vibrateShort({
    fail: () => {}
  })
  if (!data.getAllData) {
    getAllData()
  }
})

onShow(() => {
  store.setTheme('raw')
})

init()
// 加载首屏数据
function init() {
  uni.showLoading({
    title: '加载中',
    mask: true
  })

  store.getHomePage(data.offset).then((res: any) => {
    store.getHomeBall().then(res => (data.actionBall = getActionBtn(res)))
    data.more = res.more
    data.offset = res.offset

    const homePageRes = getHomePageHandler(res.data)
    const homePageResKeys = Object.keys(homePageRes)

    Object.keys(homePageConfig).forEach((key: string) => {
      if (homePageResKeys.includes(homePageConfig[key]?.code) && !homePageConfig[key].disable) {
        data[key] = Object.assign(homePageConfig[key], homePageRes[key])
        console.log(JSON.parse(JSON.stringify(data)))
      }
    })

    uni.hideLoading()
    uni.stopPullDownRefresh()
  })
}

async function getAllData() {
  data.getAllData = true
  const res: any = await store.getHomePage(data.offset)
  data.more = res.more
  data.offset = res.offset
  data.blocks.push(...res.data)
  if (data.more) {
    // 还有更多，继续加载
    getAllData()
  } else {
    // 加载完了全部
    const homePageRes = getHomePageHandler(toRaw(data.blocks))
    const homePageResKeys = Object.keys(homePageRes)

    Object.keys(homePageConfig).forEach((key: string) => {
      if (homePageResKeys.includes(homePageConfig[key]?.code) && !homePageConfig[key].disable) {
        data[key] = Object.assign(homePageConfig[key], homePageRes[key])
      }
    })

    uni.hideLoading()
    data.blocks = []
    data.loading = false
  }
}

// 推荐歌单查看更多-前往歌单广告
function rcmdToMore() {
  uni.navigateTo({ url: '../explore/playlist' })
}

const pageStyle = computed(() => {
  return store.getPageMetaStyle
})
</script>

<template>
  <page-meta :page-style="pageStyle" />

  <!-- ↓ 自定义导航 -->
  <the-nav-bar :title="'现在就听'" :back="false" :filter="true" :bg="true" />

  <!-- ↓ 播放器 -->
  <the-player-bottom-bar />

  <view class="home fixed-top fixed-bottom">
    <!-- ↓ 首页banner和入口栏 -->
    <view class="home-banner">
      <!-- banner -->
      <section-banner v-if="data.homepage_banner?.data" :list="data.homepage_banner.data" />

      <!-- 入口按钮 -->
      <section-action-ball :data="data.actionBall" />
    </view>

    <!-- 用于排序 -->
    <view class="home-order-wrap">
      <!-- ↓ 分区 - 推荐歌单 -->
      <section-playlist
        :style="{ order: data.homepage_block_playlist_rcmd.order }"
        v-if="data.homepage_block_playlist_rcmd?.list"
        title="推荐歌单"
        :data="{
          scrollList: data.homepage_block_playlist_rcmd.scrollList,
          list: data.homepage_block_playlist_rcmd.list
        }"
        @more="rcmdToMore"
      />

      <!-- ↓ 分区 个性推荐单曲 -->
      <section-songlist
        :style="{ order: data.homepage_block_style_rcmd.order }"
        v-if="data.homepage_block_style_rcmd?.list"
        :title="data.homepage_block_style_rcmd.title"
        :data="{
          list: data.homepage_block_style_rcmd.list
        }"
      />

      <!-- ↓ 分区 DJ专区 -->
      <section-songlist
        :style="{ order: data.homepage_block_zone_dj.order }"
        v-if="data.homepage_block_zone_dj?.list"
        :title="data.homepage_block_zone_dj.title"
        :data="{
          list: data.homepage_block_zone_dj.list
        }"
      />

      <!-- ↓ 分区 经典专区 -->
      <section-songlist
        :style="{ order: data.homepage_block_zone_classic.order }"
        v-if="data.homepage_block_zone_classic?.title"
        :title="data.homepage_block_zone_classic.title"
        :data="{
          list: data.homepage_block_zone_classic.list
        }"
      />

      <!-- ↓ 分区 热门话题 -->
      <section-topic
        :style="{ order: data.homepage_block_hot_topic.order }"
        v-if="data.homepage_block_hot_topic?.title"
        :title="data.homepage_block_hot_topic.title"
        :data="{
          list: data.homepage_block_hot_topic.list
        }"
      />

      <!-- ↓ 分区 - 音乐视频 -->
      <section-playlist
        :style="{ order: data.homepage_block_video_playlist.order }"
        v-if="data.homepage_block_video_playlist?.title"
        :title="data.homepage_block_video_playlist.title"
        :data="{
          scrollList: [],
          list: data.homepage_block_video_playlist.list
        }"
      />

      <!-- ↓ 分区 - 网易云音乐的雷达歌单 -->
      <section-playlist
        :style="{ order: data.homepage_block_mgc_playlist.order }"
        v-if="data.homepage_block_mgc_playlist?.title"
        :title="data.homepage_block_mgc_playlist.title"
        :data="{
          scrollList: [],
          list: data.homepage_block_mgc_playlist.list
        }"
      />

      <!-- ↓ 分区 - 专属场景歌单 -->
      <section-playlist
        :style="{ order: data.homepage_block_official_playlist.order }"
        v-if="data.homepage_block_official_playlist?.title"
        :title="data.homepage_block_official_playlist.title"
        :data="{
          scrollList: [],
          list: data.homepage_block_official_playlist.list
        }"
      />

      <!-- ↓ 分区 - 新歌、新碟、新专辑 -->
      <section-tablist
        :style="{ order: data.homepage_block_new_album_new_song.order }"
        v-if="data.homepage_block_new_album_new_song?.title"
        :title="data.homepage_block_new_album_new_song.title"
        :data="data.homepage_block_new_album_new_song.data"
      />

      <!-- ↓ 分区 - 音乐日历 -->
      <section-music-calendar
        :style="{ order: data.homepage_music_calendar.order }"
        v-if="data.homepage_music_calendar?.title"
        :title="data.homepage_music_calendar.title"
        :data="{
          list: data.homepage_music_calendar.list
        }"
      />

      <!-- ↓ 分区 爵士专区 -->
      <section-songlist
        :style="{ order: data.homepage_block_zone_jazz.order }"
        v-if="data.homepage_block_zone_jazz?.title"
        :title="data.homepage_block_zone_jazz.title"
        :data="{
          list: data.homepage_block_zone_jazz.list
        }"
      />

      <!-- ↓ 分区 古典专区 -->
      <section-songlist
        :style="{ order: data.homepage_block_zone_classical.order }"
        v-if="data.homepage_block_zone_classical?.title"
        :title="data.homepage_block_zone_classical.title"
        :data="{
          list: data.homepage_block_zone_classical.list
        }"
      />

      <!-- ↓ 分区 说唱专区 -->
      <section-songlist
        :style="{ order: data.homepage_block_zone_hiphop.order }"
        v-if="data.homepage_block_zone_hiphop?.title"
        :title="data.homepage_block_zone_hiphop.title"
        :data="{
          list: data.homepage_block_zone_hiphop.list
        }"
      />

      <!-- ↓ 分区 摇滚专区 -->
      <section-songlist
        :style="{ order: data.homepage_block_zone_rock.order }"
        v-if="data.homepage_block_zone_rock?.title"
        :title="data.homepage_block_zone_rock.title"
        :data="{
          list: data.homepage_block_zone_rock.list
        }"
      />

      <!-- ↓ 分区 - 热门博客、有声书 -->
      <section-tablist
        :style="{ order: data.homepage_voicelist_rcmd.order }"
        v-if="data.homepage_voicelist_rcmd?.title"
        :title="data.homepage_voicelist_rcmd.title"
        :data="data.homepage_voicelist_rcmd.data"
      />

      <!-- ↓ 分区 - 电音专区 -->
      <section-playlist
        :style="{ order: data.homepage_block_zone_electronic.order }"
        v-if="data.homepage_block_zone_electronic?.title"
        :title="data.homepage_block_zone_electronic.title"
        :data="{
          scrollList: [],
          list: data.homepage_block_zone_electronic.list
        }"
      />

      <!-- ↓ 分区 - 相声曲艺 -->
      <section-playlist
        :style="{ order: data.homepage_block_comic_opera.order }"
        v-if="data.homepage_block_comic_opera?.title"
        :title="data.homepage_block_comic_opera.title"
        :data="{
          scrollList: [],
          list: data.homepage_block_comic_opera.list
        }"
      />

      <!-- ↓ 分区 - 助眠解压 -->
      <section-playlist
        :style="{ order: data.homepage_block_sleeping.order }"
        v-if="data.homepage_block_sleeping?.title"
        :title="data.homepage_block_sleeping.title"
        :data="{
          scrollList: [],
          list: data.homepage_block_sleeping.list
        }"
      />

      <!-- ↓ 分区 - 有声剧场 -->
      <section-playlist
        :style="{ order: data.homepage_block_theater.order }"
        v-if="data.homepage_block_theater?.title"
        :title="data.homepage_block_theater.title"
        :data="{
          scrollList: [],
          list: data.homepage_block_theater.list
        }"
      />
    </view>

    <view v-if="data.loading" class="loading-placeholder">加载中...</view>
  </view>
</template>

<style lang="less" scoped>
.home {
  // 两边距
  --page-spacing: 32rpx;
  width: 100%;
  min-height: calc(100vh - var(--window-bottom));
  background: var(--theme-background-color);
  overflow: hidden;

  .home-banner {
    background: linear-gradient(
      var(--theme-background-color-card),
      var(--theme-background-color-card)
    );
    overflow: hidden;
  }

  // 排序容器
  .home-order-wrap {
    display: flex;
    flex-direction: column;
  }

  .loading-placeholder {
    width: 100%;
    text-align: center;
    padding-top: 30rpx;
    box-sizing: border-box;
    background-color: transparent;
    height: calc(constant(safe-area-inset-bottom) + var(--player-height-custom));
    height: calc(env(safe-area-inset-bottom) + var(--player-height-custom));
    color: var(--theme-text-sub-color);
  }
}
</style>
