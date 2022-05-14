<!--
Author: zusheng
Date: 2022-05-01 23:49:11
LastEditTime: 2022-05-15 01:12:48
Description: 弹出歌曲选项
FilePath: \uni-preset-vue-vite-ts\src\components\ThePopupSong.vue
-->

<script lang="ts" setup>
import { useStore as usePlayerStore } from '@/store/player'
import ThePopupFrame from './ThePopupFrame.vue'
import icon0 from '@/static/d5w_b.png'
import icon1 from '@/static/ex9_b.png'
import icon2 from '@/static/d5u_b.png'
import icon3 from '@/static/ex5_b.png'
import icon4 from '@/static/d5w_b.png'
import icon5 from '@/static/e9p_b.png'
import icon6 from '@/static/en0_b.png'
import icon7 from '@/static/ea9_b.png'
import icon8 from '@/static/e_6_b.png'
import icon9 from '@/static/e_1_b.png'
import icon10 from '@/static/eax_b.png'

const playerStore = usePlayerStore()

function close() {
  uni.$emit('popupClose')
}

// 添加到播放队列
function addQueue(data: any) {
  // 添加音乐到代播列表
  playerStore.setPreference([data])
  // 显示提示信息
  uni.showToast({
    title: '添加成功',
    icon: 'none',
    duration: 2000
  })
  close()
}

const rootCdn = 'http://cdn.zusheng.club/weixin/'
const itemList = [
  {
    // 标题
    title: '插队到下一首播放',
    // 图标
    icon: 'd5w_b.png',
    // 取值: 如歌手： (value)
    value: null,
    // 点击时触发的函数
    func: (data: any) => addQueue(data),
    // 是否可以跳转(显示跳转icon)
    canRedirect: false
  },
  {
    title: '收藏到歌单',
    disabled: true,
    icon: 'ex9_b.png',
    canRedirect: false
  },
  {
    title: '下载',
    disabled: true,
    icon: 'd5u_b.png',
    canRedirect: false
  },
  {
    title: '评论',
    disabled: false,
    icon: 'ex5_b.png',
    value: null,
    canRedirect: true
  },
  {
    title: '分享',
    disabled: true,
    icon: 'ewx_b.png',
    canRedirect: false
  },
  {
    title: '歌手：',
    disabled: false,
    icon: 'e9p_b.png',
    value: 'artist',
    canRedirect: true
  },
  {
    title: '创作者：',
    disabled: false,
    icon: 'en0_b.png',
    value: 'creator',
    canRedirect: true
  },
  {
    title: '云贝推歌',
    disabled: true,
    icon: 'ea9_b.png',
    value: null,
    canRedirect: false
  },
  {
    title: '相关视频',
    disabled: true,
    icon: 'e_6_b.png',
    canRedirect: true
  },
  {
    title: '更多乐谱',
    disabled: true,
    icon: 'e_1_b.png',
    canRedirect: true
  },
  {
    title: '解除屏蔽歌曲或歌手',
    disabled: true,
    icon: 'eax_b.png',
    canRedirect: false
  }
]
// .filter((v: any) => !v.disabled)
</script>

<template>
  <the-popup-frame>
    <template #default="{ popupData }">
      <view class="the-popup-container__spacing">
        <!-- 歌曲信息 -->
        <view class="the-popup-container__song">
          <!-- 封面 -->
          <image
            v-if="popupData.picUrl"
            class="the-popup-container__song-image"
            :src="`${popupData.picUrl}?param=100y100`"
            mode="aspectFit"
          />

          <!-- 歌曲信息 -->
          <view class="the-popup-container__song-info text-ellipsis-single">
            <view class="the-popup-container__song-info__title text-ellipsis-single">{{
              popupData.title
            }}</view>
            <view class="the-popup-container__song-info__artist text-ellipsis-single">{{
              popupData.artist
            }}</view>
          </view>

          <!-- 返回按钮 -->
          <view class="the-popup-container__song-back" @tap.stop.prevent="close" />
        </view>

        <!-- 列表项 -->
        <scroll-view class="the-popup-container__list" :scroll-y="true">
          <view
            :class="`the-popup-container__list-item  text-ellipsis-single ${
              item.disabled ? 'list-item-disabled' : ''
            }`"
            v-for="(item, idx) in itemList"
            :key="`the-popup-${idx}`"
            :hover-class="'list-item-hover'"
            :hover-start-time="100"
            @tap.stop.prevent="() => (item.func ? item.func(popupData) : false)"
          >
            <view class="the-popup-container__list-item-left text-ellipsis-single">
              <view
                class="the-popup-container__list-item-image"
                :style="{ maskImage: `url(${rootCdn + item.icon})` }"
              />
              <view class="text-ellipsis-single">
                {{ item.title }}{{ item.value ? popupData[item.value] : '' }}
              </view>
            </view>
            <!-- <view v-if="item.canRedirect" class="the-popup-container__list-item-right" /> -->
          </view>
          <view style="height: 34px"></view>
        </scroll-view>
      </view>
    </template>
  </the-popup-frame>
</template>

<style lang="less" scoped>
.the-popup-container__spacing {
  width: 100%;
  height: 1076rpx;

  .the-popup-container__song {
    width: 100%;
    height: 160rpx;
    padding: 30rpx;
    box-sizing: border-box;
    border-bottom: 1px solid var(--theme-border-color);
    display: flex;
    justify-content: space-between;

    .the-popup-container__song-image {
      height: 100rpx;
      width: 100rpx;
      flex-shrink: 0;
      border-radius: 10rpx;
    }

    .the-popup-container__song-info {
      height: 100%;
      width: calc(100% - 200rpx);
      flex: 1;
      margin-left: 20.5rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      line-height: 1.5;

      .the-popup-container__song-info__title {
        font-size: 28.8rpx;
        font-weight: 600;
        color: var(--theme-text-title-color);
      }

      .the-popup-container__song-info__artist {
        font-size: 24.5rpx;
        color: var(--theme-text-sub-color);
      }
    }

    .the-popup-container__song-back {
      height: 100rpx;
      width: 100rpx;
      flex-shrink: 0;
      margin-left: 20.5rpx;
      background: var(--theme-text-sub-color);
      mask-size: 40rpx auto;
      mask-repeat: no-repeat;
      mask-image: url('@/static/icon-arrow-bottom.png');
      mask-position: center;
    }
  }

  .the-popup-container__list {
    width: 100%;
    height: calc(100% - 160rpx);
    // 不可用按钮样式
    .list-item-disabled {
      opacity: 0.2 !important;
    }
    .the-popup-container__list-item {
      width: 100%;
      height: 96rpx;
      font-size: 32rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 38rpx;
      box-sizing: border-box;

      .the-popup-container__list-item-left {
        height: 100%;
        width: 100%;
        flex: 1;
        display: flex;
        align-items: center;
        color: var(--theme-text-title-color);

        .the-popup-container__list-item-image {
          flex-shrink: 0;
          width: 43rpx;
          height: 100%;
          margin-right: 26.5rpx;
          mask-size: 100%;
          mask-repeat: no-repeat;
          mask-position: center;
          background-color: var(--theme-text-title-color);
        }
      }

      .the-popup-container__list-item-right {
        height: 100%;
        width: 96rpx;
        margin-left: 38rpx;
        background: rgba(51, 51, 52, 0.35);
        mask-size: auto 30rpx;
        mask-repeat: no-repeat;
        mask-image: url('@/static/icon-arrow-right.png');
        mask-position: center;
      }
    }

    .list-item-hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }
}
</style>
