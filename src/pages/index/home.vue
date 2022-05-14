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
import { onPullDownRefresh } from '@dcloudio/uni-app'
import { reactive, computed } from 'vue'
import { useStore } from '@/store'

const store = useStore()
const data = reactive<any>({
  loading: true,
  offset: 0,
  more: true,
  // 数据
  blocks: [],
  actionBall: [],
  homepage_banner: [],
  homepage_block_hot_topic: [],
  homepage_block_playlist_rcmd: {},
  homepage_block_new_album_new_song: {},
  homepage_block_official_playlist: {},
  homepage_block_style_rcmd: {},
  homepage_music_calendar: {},
  homepage_voicelist_rcmd: {}
})

store.setTheme('raw')

onPullDownRefresh(() => {
  Object.assign(data, {
    offset: 0,
    more: true
  })
  init()
})

init()

function init() {
  uni.showLoading({
    title: '加载中',
    mask: true
  })
  store.getHomeBall().then(res => {
    data.actionBall = getActionBtn(res)
  })
  store.getHomePage(data.offset).then(res => {
    data.more = res.more
    data.offset = res.offset
    data.blocks.push(...res.data)
    Object.assign(data, getHomePageHandler(data.blocks))
    uni.hideLoading()
    uni.stopPullDownRefresh()
    getAllData()
  })
}

async function getAllData() {
  const res: any = await store.getHomePage(data.offset)
  data.more = res.more
  data.offset = res.offset
  data.blocks.push(...res.data)
  if (data.more) {
    // 还有更多，继续加载
    getAllData()
  } else {
    // 加载完了全部
    Object.assign(data, getHomePageHandler(data.blocks))
    uni.hideLoading()
    data.blocks = []
    data.loading = false
  }
}

const pageStyle = computed(() => store.getPageMetaStyle)
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
      <section-banner :list="data.homepage_banner" />

      <!-- 入口按钮 -->
      <section-action-ball :data="data.actionBall" />
    </view>

    <!-- ↓ 分区 - 推荐歌单 -->
    <section-playlist
      v-if="data.homepage_block_playlist_rcmd?.list"
      title="推荐歌单"
      :data="{
        scrollList: data.homepage_block_playlist_rcmd.scrollList,
        list: data.homepage_block_playlist_rcmd.list
      }"
    />

    <!-- ↓ 分区 个性推荐单曲 -->
    <section-songlist
      v-if="data.homepage_block_style_rcmd?.list"
      :title="data.homepage_block_style_rcmd.title"
      :data="{
        list: data.homepage_block_style_rcmd.list
      }"
    />

    <!-- ↓ 分区 热门话题 -->
    <section-topic
      v-if="data.homepage_block_hot_topic?.length > 0"
      title="热门话题"
      :data="{
        list: data.homepage_block_hot_topic
      }"
    />

    <!-- ↓ 分区 - 新歌、新碟、新专辑 -->
    <section-tablist
      v-if="data.homepage_block_new_album_new_song?.newSongs"
      :title="['新歌', '新碟', '新专辑']"
      :data="[
        data.homepage_block_new_album_new_song.newSongs,
        data.homepage_block_new_album_new_song.newAlbum,
        data.homepage_block_new_album_new_song.newDigital
      ]"
    />

    <!-- ↓ 分区 - 音乐日历 -->
    <section-music-calendar
      v-if="data.homepage_music_calendar?.list"
      :title="data.homepage_music_calendar.title"
      :data="{
        list: data.homepage_music_calendar.list
      }"
    />

    <!-- ↓ 分区 - 网易云音乐的雷达歌单 -->
    <section-playlist
      v-if="data.homepage_block_mgc_playlist?.list"
      title="网易云音乐的雷达歌单"
      :data="{
        scrollList: [],
        list: data.homepage_block_mgc_playlist.list
      }"
    />

    <!-- ↓ 分区 - 专属场景歌单 -->
    <section-playlist
      v-if="data.homepage_block_official_playlist?.list"
      title="专属场景歌单"
      :data="{
        scrollList: [],
        list: data.homepage_block_official_playlist.list
      }"
    />

    <!-- ↓ 分区 - 热门博客、有声书 -->
    <section-tablist
      v-if="data.homepage_voicelist_rcmd?.bodcastList"
      :title="['热门播客', '有声书']"
      :data="[data.homepage_voicelist_rcmd.bodcastList, data.homepage_voicelist_rcmd.voiceList]"
    />

    <view v-if="data.loading" class="loading">加载中...</view>
  </view>
</template>

<style lang="less" scoped>
.home {
  // 两边距
  --page-spacing: 32rpx;
  width: 100%;
  min-height: 100vh;
  background: var(--theme-background-color);
  transition: opacity 0.5s;

  .loading {
    width: 100%;
    text-align: center;
    margin-top: 30rpx;
    color: rgba(200, 200, 200);
  }

  .home-banner {
    background: linear-gradient(
      var(--theme-background-color-card),
      var(--theme-background-color-card)
    );
    overflow: hidden;
  }
}
</style>
