<!--
Author: zusheng
Date: 2022-05-12 12:09:15
LastEditTime: 2022-05-17 09:31:28
Description: 歌单详情页
FilePath: \uni-preset-vue-vite-ts\src\pages\detail\playlist.vue
-->
<script lang="ts" setup>
import ListSongs from '@/components/ListSongs.vue'
import CardPoster from '@/components/CardPoster.vue'
import TheNavBar from '@/components/TheNavBar.vue'
import ThePopupSong from '@/components/ThePopupSong.vue'
import ThePlayerBottomBar from '@/components/ThePlayerBottomBar.vue'
import { onLoad, onPageScroll, onReachBottom, onShow } from '@dcloudio/uni-app'
import { reactive, computed, onMounted, ref } from 'vue'
import { useStore } from '@/store'

const backgroundShow = ref<boolean>(false)
const navShow = ref<boolean>(false)
const detailPlaylistRef = ref<any>()
const store = useStore()
const data = reactive<any>({
  // 歌单id，路由传过来的
  id: '',
  // 所有歌曲的ID
  trackIds: [],
  // type playlist|album
  type: ''
})

onShow(() => {
  store.setTheme('raw', {
    navigationBarColor: '#ffffff'
  })
})

onPageScroll(() => {})

onReachBottom(() => {})

onLoad(query => {
  const { id, type = 'playlist' } = query

  data.id = id
  data.type = type

  // 加载中
  uni.showLoading({
    title: '加载中'
  })

  if (data.type === 'playlist') {
    store.getPlaylistDetail(data.id).then(res => {
      uni.hideLoading()
      if (res !== undefined) {
        Object.assign(data, res)
        // console.log(toRaw(data))
      } else {
        uni.showToast({
          title: '加载失败',
          icon: 'error'
        })
      }
    })
  } else if (data.type === 'album') {
    store.getPlaylistDetail(data.id).then(res => {
      uni.hideLoading()
      if (res !== undefined) {
        Object.assign(data, res)
        // console.log(toRaw(data))
      } else {
        uni.showToast({
          title: '加载失败',
          icon: 'error'
        })
      }
    })
  }
})

// 点击跳转到作者详情页
function toArtistDetail() {
  uni.navigateTo({
    url: `./artist?payload=${data.creator.id}&type=user`
  })
}

// 跳转到评论页面
function toComment() {
  uni.navigateTo({
    url: `./comment?payload=${data.id}&type=2`
  })
}

// 订阅歌曲
function toSubscribe() {
  if (!data.subscribed) {
    store.getSubscribe(data.id, 1).then(res => {
      data.subscribed = !data.subscribed
      uni.showToast({
        title: '歌单已收藏',
        icon: 'none',
        duration: 2000
      })
    })
  } else {
    uni.showModal({
      content: '确定要取消收藏该歌单吗?',
      success: function (res) {
        if (res.confirm) {
          store.getSubscribe(data.id, 2).then(res => {
            data.subscribed = !data.subscribed
            uni.showToast({
              title: '歌单已收藏',
              icon: 'none',
              duration: 2000
            })
          })
        }
      }
    })
  }
}

onMounted(() => {
  const options = {
    observeAll: false,
    thresholds: [0.8],
    initialRatio: 1
  }

  uni
    .createIntersectionObserver(detailPlaylistRef.value, options)
    .relativeToViewport({ bottom: 0 })
    .observe(`.observer-placeholder`, (res: any) => {
      const show = res.intersectionRatio < 0.8
      navShow.value = show

      const navShowColor = store.themeConfig.theme === 'dark' ? '#ffffff' : '#000000'
      const navHideColor = store.themeConfig.theme === 'dark' ? '#ffffff' : '#000000'

      store.setTheme('raw', {
        navigationBarColor: navShow.value ? navShowColor : navHideColor
      })
    })
})

const pageStyle = computed(() => store.getPageMetaStyle)
const actionBgColor = computed(() => store.getCurTheme.backgroundColorCard)
</script>

<template>
  <page-meta :page-style="pageStyle" />

  <!-- ↓ 自定义导航 -->
  <the-nav-bar :back="true" :title="navShow ? data.title : '歌单'" :filter="false" :bg="navShow" />

  <the-popup-song />

  <!-- ↓ 播放器 -->
  <the-player-bottom-bar />

  <view ref="detailPlaylistRef" class="detail-playlist fixed-bottom">
    <view class="observer-placeholder"></view>
    <!-- 主要内容 -->
    <view class="detail-playlist-container" v-if="data.picUrl">
      <!-- ↓ 背景滤镜 -->
      <view class="detail-playlist__main-bg-filter" />
      <!-- ↓ 模糊、饱和度滤镜- -->

      <!-- ↓ 背景颜色 -->
      <view class="detail-playlist__main-bg-color">
        <image
          @load="backgroundShow = true"
          :style="{ opacity: backgroundShow ? 1 : 0 }"
          class="detail-playlist__main-bg-image"
          :src="`${data.picUrl}?param=200y200`"
          mode="aspectFill"
        />
      </view>

      <!-- 歌单信息 -->
      <view class="detail-playlist__main">
        <!-- 歌单信息 -->
        <view class="detail-playlist__main-spacing">
          <!-- 封面 -->
          <card-poster
            class="detail-playlist__main-image"
            :pic-url="`${data.picUrl}?param=200y200`"
            :play-count="data.playCount"
          />
          <!-- 描述容器 -->
          <view class="detail-playlist__main-info">
            <!-- 歌单名字 -->
            <view class="detail-playlist__main-info__title">{{ data.title }}</view>

            <!-- 作者信息，点击跳转到作者详情页 -->
            <view class="detail-playlist__main-info__creator" @tap.stop.prevent="toArtistDetail">
              <!-- 作者头像 -->
              <image
                class="detail-playlist__main-info__creator-image"
                :src="data.creator.picUrl + '?param=50y50'"
                mode="aspectFit"
              />
              <!-- 作者名 -->
              <text>{{ data.creator.name }}</text>
            </view>
            <!-- 歌单描述 -->
            <view class="detail-playlist__main-info__desc text-ellipsis-single">
              {{ data.desc }}&nbsp;
              <!-- 小箭头 -->
              <view v-if="data.desc" class="detail-playlist__main-info__desc-arrow" />
            </view>
          </view>
        </view>
      </view>

      <!-- 订阅按钮 -->
      <view class="detail-playlist__action">
        <view class="detail-playlist__action-container">
          <view class="detail-playlist__action-spacing">
            <view class="detail-playlist__action-item" @tap="toSubscribe">
              <view v-if="data.subscribed" class="icon icon-subscribedCount-active"></view>
              <view v-else class="icon icon-subscribedCount"></view>
              <view class="detail-playlist__action-item-text">{{ data.subscribedCount }}</view>
            </view>
            <view class="detail-playlist__action-item" @tap="toComment">
              <view class="icon icon-commentCount"></view>
              <view class="detail-playlist__action-item-text">{{ data.commentCount }}</view>
            </view>
            <view class="detail-playlist__action-item" style="opacity: 0.3">
              <view class="icon icon-shareCount"></view>
              <view class="detail-playlist__action-item-text">{{ data.shareCount }}</view>
            </view>
          </view>
        </view>
        <view class="detail-playlist__action-shadow"></view>
      </view>

      <!-- vip提示 -->
      <view class="detail-playlist__vip">
        <view class="detail-playlist__vip-spacing">广告位招租</view>
        <!-- 14 首 VIP 歌曲已经无法畅享 -->
      </view>

      <!-- 歌单列表 -->
      <list-songs :track-ids="data.trackIds" :infinite="true" :action-bg="actionBgColor" />
    </view>
  </view>
</template>

<style lang="less" scoped>
.detail-playlist {
  // 封面尺寸
  --poster-main-size: 230rpx;

  // 评论、收藏胶囊的高度
  --pl-action-height: 86.5rpx;

  // 歌单信息高度
  --playlist-banner-height: 450rpx;

  background-color: var(--theme-background-color-card);
  position: relative;
  min-height: calc(100vh - var(--window-bottom));

  // 容器
  .detail-playlist-container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  // 模糊、饱和度滤镜
  .detail-playlist__main-bg-filter {
    position: absolute;
    z-index: 2;
    width: 100%;
    height: calc(var(--playlist-banner-height) + var(--status-bar-height));
    backdrop-filter: saturate(120%) brightness(90%) blur(60px);
    clip-path: ellipse(220% 100% at 50% 0);
    /* #ifdef H5 */
    // firefox对backdrop-filter使用有限制，h5关闭
    display: none;
    /* #endif */
  }
  // 背景图片
  .detail-playlist__main-bg-color {
    position: absolute;
    z-index: 1;
    width: 100%;
    height: calc(var(--playlist-banner-height) + var(--status-bar-height));
    clip-path: ellipse(220% 100% at 50% 0);
    overflow: hidden;
    background-color: rgb(51, 51, 52);
    .detail-playlist__main-bg-image {
      position: absolute;
      width: 100%;
      height: 100%;
      transition: opacity 1s;
      /* #ifdef H5 */
      transition: none;
      filter: saturate(120%) brightness(90%) blur(60px);
      transform: scale(2);
      /* #endif */
    }
  }

  // 歌单头部信息
  .detail-playlist__main {
    z-index: 2;
    position: relative;
    width: 100%;
    box-sizing: border-box;
    height: calc(var(--playlist-banner-height) + var(--status-bar-height));
    padding-top: calc(28rpx + var(--status-bar-height) + var(--nav-tab-height-custom));

    // 歌单信息
    // 高度： 7.7 + 230rpx
    .detail-playlist__main-spacing {
      z-index: 1;
      position: relative;
      margin-right: 30rpx;
      box-sizing: border-box;
      padding: 7.7rpx 30rpx 0;
      display: flex;

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: calc(30rpx + (var(--poster-main-size) * 0.14) / 2);
        width: calc(var(--poster-main-size) * 0.86);
        height: calc(var(--poster-main-size) * 0.86);
        background: rgba(100, 100, 100, 0.3);
        border-radius: 19.2rpx;
        z-index: 10;
      }

      // 歌单封面
      .detail-playlist__main-image {
        flex-shrink: 0;
        width: var(--poster-main-size);
        height: var(--poster-main-size);
        border-radius: 21rpx;
        margin-right: 29.5rpx;
        z-index: 12;
      }

      // 描述容器
      .detail-playlist__main-info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        overflow: hidden;
        flex: 1;

        // 歌单标题
        .detail-playlist__main-info__title {
          font-size: 30.7rpx;
          font-weight: 600;
          color: #fff;
          line-height: 1.5;
        }
        .detail-playlist__main-info__creator {
          color: rgba(255, 255, 255, 0.65);
          font-size: 24rpx;
          display: flex;
          align-items: center;
          font-weight: 600;
          // 作者的头像
          .detail-playlist__main-info__creator-image {
            width: 50rpx;
            height: 50rpx;
            border-radius: 50%;
            margin-right: 11.5rpx;
          }
        }

        // 歌单描述
        .detail-playlist__main-info__desc {
          color: rgba(255, 255, 255, 0.65);
          font-weight: 600;
          font-size: 24rpx;
          padding-right: 24rpx;
          box-sizing: border-box;
          position: relative;
          // 小箭头
          .detail-playlist__main-info__desc-arrow {
            position: absolute;
            top: 0;
            right: 0;
            height: 100%;
            width: 24rpx;
            background-color: rgba(255, 255, 255, 0.65);
            mask-position: center;
            mask-repeat: no-repeat;
            mask-size: auto calc(24rpx / 1.25);
            mask-image: url('@/static/icon-arrow-right.png');
          }
        }
      }
    }
  }

  // 评论、收藏数量按钮
  .detail-playlist__action {
    z-index: 4;
    width: 100%;
    height: var(--pl-action-height);
    margin: calc(var(--pl-action-height) / -2) 0 0 50%;
    transform: translate(-50%, 0);
    position: relative;

    .detail-playlist__action-shadow {
      overflow: hidden;
      position: absolute;
      // opacity: 0;
      z-index: 3;
      width: 554rpx;
      height: var(--pl-action-height);
      margin: 0 0 0 50%;
      transform: translate(-50%, 0);
      z-index: 3;
      background: transparent;
      border-radius: var(--pl-action-height);
      box-shadow: 8rpx calc(var(--pl-action-height) / 4) 16rpx var(--theme-shadow-color),
        -16rpx calc(var(--pl-action-height) / 4) 16rpx var(--theme-shadow-color);

      /* #ifdef H5 */
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        z-index: 3;
        width: 100%;
        height: 100%;
        filter: blur(20px);
        transform: scale(2);
        background: var(--theme-background-color);
      }
      /* #endif */
    }

    .detail-playlist__action-container {
      position: absolute;
      left: 50%;
      width: 554rpx;
      display: flex;
      z-index: 4;
      align-items: center;
      transform: translate(-50%, 0);
      height: var(--pl-action-height);
      clip-path: inset(0 round var(--pl-action-height));
      backdrop-filter: blur(20px);
      background: var(--theme-filter-color);

      .detail-playlist__action-spacing {
        height: 38.4rpx;
        width: 100%;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: rgb(50, 51, 50);
        font-size: 23rpx;
        // 中间分割线
        .detail-playlist__action-commentCount {
          border-left: 1px solid rgb(222, 222, 222);
          border-right: 1px solid rgb(222, 222, 222);
        }
        .detail-playlist__action-item {
          width: calc(100% / 3);
          display: flex;
          align-items: center;
          justify-content: center;

          .detail-playlist__action-item-text {
            height: 38.4rpx;
            line-height: 2;
            color: var(--theme-text-title-color);
          }
          .icon {
            height: 38.4rpx;
            width: 38.4rpx;
            margin-right: 8rpx;
            background-color: var(--theme-text-title-color);
            mask-position: center;
            mask-size: 80%;
            mask-repeat: no-repeat;
            mask-mode: alpha;
          }
          .icon-subscribedCount {
            mask-image: url('@/static/ex9_.png');
          }

          .icon-subscribedCount-active {
            mask-image: url('@/static/ex9_1.png');
          }

          .icon-commentCount {
            mask-image: url('@/static/ex6_.png');
          }

          .icon-shareCount {
            mask-image: url('@/static/ewx_.png');
          }
        }
      }
    }
  }

  // vip提示
  .detail-playlist__vip {
    z-index: 1;
    position: relative;
    box-sizing: border-box;
    height: 84.6rpx;
    width: 705rpx;
    border: 1px solid var(--theme-border-color);
    background: var(--theme-background-color-card);
    margin: 32rpx auto 16.2rpx;
    padding: 0 20.5rpx;
    border-radius: 20.5rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    .detail-playlist__vip-spacing {
      height: 27rpx;
      width: 100%;
      font-size: 27rpx;
      font-weight: 600;
      line-height: 1;
      color: var(--theme-text-sub-color);
    }
  }
}
</style>

