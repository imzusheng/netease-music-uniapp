<!--
Author: zusheng
Date: 2022-05-05 16:03:52
LastEditTime: 2022-05-15 00:51:49
Description: 艺人、用户详情页
FilePath: \uni-preset-vue-vite-ts\src\pages\detail\artist.vue
-->

<script lang="ts" setup>
import ThePlayerBottomBar from '@/components/ThePlayerBottomBar.vue'
import SectionFrame from '@/components/section/SectionFrame.vue'
import TheNavBar from '@/components/TheNavBar.vue'
import ListSongs from '@/components/ListSongs.vue'
import { onLoad } from '@dcloudio/uni-app'
import { reactive, ref, computed, toRaw, onMounted } from 'vue'
import { convertCount } from '@/common/util'
import { useStore as useUserStore } from '@/store/user'
import { useStore } from '@/store'

const store = useStore()
const userStore = useUserStore()
const detailArtistRef = ref<any>()
const data = reactive<any>({
  artist: {
    // 歌手的单曲
    trackIds: [],
    // 当前分类下标
    curCateIdx: 0,
    // 分类列表
    cate: [
      {
        disabled: false,
        title: '歌曲',
        key: 'musicSize'
      },
      {
        disabled: false,
        title: '专辑',
        key: 'albumSize'
      },
      {
        disabled: true,
        title: '动态',
        key: 'eventCount'
      }
    ]
  },
  user: {
    // 歌单
    playlist: [],
    // 当前分类下标
    curCateIdx: 0,
    // 分类列表
    cate: [
      {
        disabled: false,
        title: '主页'
      },
      {
        disabled: true,
        title: '动态',
        key: 'eventCount'
      }
    ]
  },
  simi: []
})

store.setTheme('raw')

// 显示导航栏
const navShow = ref<boolean>(false)

// 当前页面标题
const curPageTitle = computed(() => {
  return data.type === 'artist' ? data.artist.name : data.user.name || ''
})

const curCateIdx = computed(() => {
  const curCateIdx = data.type === 'artist' ? data.artist.curCateIdx : data.user.curCateIdx
  return curCateIdx
})

const playlist = computed(() => {
  return data.type === 'artist' ? data.artist.playlist : data.user.playlist
})

const listTitle = computed(() => {
  return data.type === 'artist' ? '专辑' : '创建的歌单'
})

onLoad((query: any) => {
  const { payload: id, type } = query

  data.type = type

  if (type === 'user') {
    // 用户相关信息 s
    Promise.allSettled([userStore.getUserDetail(id), userStore.getUserPlaylist(id)]).then(
      resArr => {
        resArr.forEach(res => {
          if (res.status === 'fulfilled') {
            Object.assign(data.user, res.value.data)
          } else {
            uni.showToast({
              title: res.reason.message,
              icon: 'error',
              duration: 5000
            })
          }
        })
      }
    )
    // e
  } else if (type === 'artist') {
    // 歌手相关信息 s
    Promise.allSettled([
      userStore.getArtistDetail(id),
      userStore.getArtistFans(id),
      userStore.getSimiArtist(id),
      userStore.getArtistSong(id),
      userStore.getArtistAlbum(id)
    ]).then(function (resArr: any) {
      resArr.forEach((res: any) => {
        if (res.status === 'fulfilled') {
          if (res.value.type === 'SimiArtist') {
            data.simi = res.value.data
          } else {
            Object.assign(data.artist, res.value.data)
          }
        } else {
          uni.showToast({
            title: res.reason.message,
            icon: 'error',
            duration: 5000
          })
        }
      })
    })
    // e
  } else {
    uni.showToast({
      title: '参数错误',
      icon: 'error',
      duration: 3000
    })
  }
})

// 前往相似歌手主页
function toSimiDetail(payload: number) {
  uni.redirectTo({
    url: `./artist?payload=${payload}&type=artist`
  })
}

// 前往歌单页面
function toPlaylist(data: any) {
  uni.navigateTo({ url: `../detail/playlist?id=${data.payload}&type=playlist` })
}

// 切换分类
function switchCate(item: any, idx: number) {
  if (item.disabled)
    return uni.showToast({
      title: '需要登录',
      duration: 2000,
      icon: 'none'
    })

  data[data.type].curCateIdx = idx
}

onMounted(() => {
  const options = {
    observeAll: false,
    thresholds: [0.8],
    initialRatio: 1
  }
  uni
    .createIntersectionObserver(detailArtistRef.value, options)
    .relativeToViewport({ bottom: 0 })
    .observe(`.observer-placeholder`, (res: any) => {
      const show = res.intersectionRatio < 0.8
      navShow.value = show

      uni.setNavigationBarColor({
        frontColor: show ? '#000000' : '#ffffff',
        backgroundColor: '#fff'
      })
    })
})
const pageStyle = computed(() => store.getPageMetaStyle)
</script>

<template>
  <page-meta :page-style="pageStyle" />

  <!-- 自定义导航 -->
  <the-nav-bar :back="true" :title="navShow ? curPageTitle : ''" :filter="false" :bg="navShow" />

  <!-- ↓ 播放器 -->
  <the-player-bottom-bar />

  <view ref="detailArtistRef" class="detail-Artist fixed-bottom">
    <!-- 背景 -->
    <view class="detail-Artist__bg">
      <image
        v-if="data.artist.backgroundUrl || data.user.backgroundUrl"
        :src="`${data.artist.backgroundUrl || data.user.backgroundUrl}?param=800y800`"
        class="detail-Artist__bg-image"
        mode="aspectFill"
      />
    </view>

    <!-- 信息面板 -->
    <view class="detail-Artist__main">
      <!-- 占位，见函数observeSection() -->
      <view class="observer-placeholder" />

      <!-- 面板-信息展示 -->
      <view class="detail-Artist__main-section-user">
        <!-- 头像 -->
        <image
          v-if="data.user.avatarUrl || data.artist.avatarUrl"
          :src="`${data.user.avatarUrl || data.artist.avatarUrl}?param=100y100`"
          class="detail-Artist__main-section-user__avatar"
          mode="aspectFit"
        />
        <!-- 名 -->
        <view class="detail-Artist__main-section-user__name">
          {{ data.user.name || data.artist.name }}
        </view>
        <!-- 描述 分artist、user -->
        <view class="detail-Artist__main-section-user__sub">
          <template v-if="data.type === 'artist'">
            {{ convertCount(data.artist.followeds) }} 粉丝
          </template>
          <template v-else>
            {{ data.user.follows }} 关注&nbsp;&nbsp;&nbsp;
            {{ convertCount(data.user.followeds) }} 粉丝&nbsp;&nbsp;&nbsp; Lv.{{ data.user.level }}
          </template>
        </view>
        <!-- 标签 -->
        <view class="detail-Artist__main-section-user__tags text-ellipsis-multi">
          {{ data.artist.tags || data.user.baseInfo?.signature || ' ' }}
        </view>

        <!-- 相似歌手列表 -->
        <scroll-view class="detail-Artist__main-section-user__semi" :scroll-x="true">
          <view
            @tap.stop.prevent="toSimiDetail(simiItem.payload)"
            v-for="(simiItem, simiIdx) in data.simi"
            :key="`simi-${simiIdx}`"
            class="main-section-user__semi-item text-ellipsis-single"
          >
            <image
              v-if="simiItem.picUrl"
              class="main-section-user__semi-item__avatar"
              :src="`${simiItem.picUrl}?param=100y100`"
              mode="aspectFit"
            />
            <view class="main-section-user__semi-item__name text-ellipsis-single">
              {{ simiItem.name }}
            </view>
            <view class="main-section-user__semi-item__sub text-ellipsis-single">
              {{ convertCount(simiItem.sub) + ' 粉丝' || '&nbsp;' }}
            </view>
            <view class="main-section-user__semi-item__action"> 主页</view>
          </view>
        </scroll-view>
      </view>

      <!-- 面板-动态信息 -->
      <view class="detail-Artist__main-section-desc">
        <!-- tab栏 -->
        <view class="detail-Artist__main-section-desc-tab">
          <view
            v-for="(cateItem, cateIdx) in data.type === 'artist'
              ? data.artist.cate
              : data.user.cate"
            :key="cateItem.title"
            :class="{ 'item-disabled': cateItem.disabled }"
            class="main-section-desc-tab__item"
            @tap.stop.prevent="switchCate(cateItem, cateIdx)"
          >
            <text
              class="main-section-desc-tab__item-text"
              :class="{ 'item-text-checked': curCateIdx === cateIdx }"
            >
              <text class="main-section-desc-tab__item-text-inner">
                {{ cateItem.title }}
              </text>
            </text>
            <!-- 显示动态数量 -->
            <text v-if="cateItem.key" class="main-section-desc-tab__item-text-badge">
              &nbsp;
              <template v-if="data.type === 'artist'">
                {{ data.artist[cateItem.key] }}
              </template>
              <template v-else> {{ data.user[cateItem.key] }}</template>
            </text>
          </view>
        </view>

        <view class="detail-Artist__main-section-desc-main">
          <!-- ↓ 歌曲列表 -->
          <list-songs
            v-if="data.artist.trackIds?.length > 0 && data.artist.curCateIdx === 0"
            :trackIds="data.artist.trackIds"
            :infinite="false"
            action-bg="248, 248, 248, 1"
          />

          <!-- ↓ 专辑、歌单列表 s -->
          <view
            v-if="
              (data.type === 'artist' && data.artist.curCateIdx === 1) ||
              (data.type === 'user' && data.user.curCateIdx === 0)
            "
            class="detail-Artist__main-section-desc__user"
          >
            <view class="detail-Artist__main-section-desc__user-spacing">
              <section-frame
                :title="`${listTitle} (${data[data.type].playlist.length})`"
                :more="false"
              >
                <template #default>
                  <view class="detail-Artist__playlist-spacing">
                    <view
                      class="detail-Artist__playlist"
                      v-for="item in playlist"
                      :key="item.payload"
                      @tap.stop.prevent="toPlaylist(item)"
                    >
                      <image
                        class="detail-Artist__playlist-image"
                        :src="`${item.picUrl}?param=100y100`"
                        mode="aspectFit"
                      />
                      <view class="detail-Artist__playlist-desc text-ellipsis-single">
                        <view class="detail-Artist__playlist-title text-ellipsis-single">
                          {{ item.title }}
                        </view>
                        <view class="detail-Artist__playlist-sub text-ellipsis-single">
                          <template v-if="data.type === 'user'">
                            {{ item.trackCount }} 首，播放 {{ convertCount(item.playCount) }} 次
                          </template>
                          <template v-else>
                            {{ item.publishTime }}&nbsp;&nbsp;&nbsp;{{ item.size }} 首
                          </template>
                        </view>
                      </view>
                    </view>
                  </view>
                </template>
              </section-frame>
            </view>
          </view>
          <!-- ↑ 专辑、歌单列表 e -->
        </view>
      </view>

      <view class="fixed-placeholder" />
    </view>
  </view>
</template>

<style lang="less" scoped>
.detail-Artist {
  width: 100%;
  position: relative;
  background: linear-gradient(
    to top,
    var(--theme-background-color),
    var(--theme-background-color-card)
  );

  .detail-Artist__bg {
    width: 100%;
    height: 675rpx;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    clip-path: ellipse(220% 100% at 50% 0);

    .detail-Artist__bg-image {
      width: 100%;
      height: 100%;
      position: absolute;

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
        // background: linear-gradient(rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0) 100%);
        background: linear-gradient(rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0) 100%);
      }
    }
  }

  .detail-Artist__main {
    width: 100%;
    height: auto;
    box-sizing: border-box;
    padding: 625rpx 0 0;
    min-height: 100vh;
    position: relative;
    z-index: 1;

    .observe-placeholder {
      position: absolute;
      top: 100rpx;
      left: 0;
      width: 100%;
      height: 136.5rpx;
    }

    // 信息面板
    .detail-Artist__main-section-user {
      //   height: 333rpx;
      width: calc(100% - 60rpx);
      background: linear-gradient(
        var(--theme-filter-color) 0%,
        var(--theme-background-color-card) 30%
      );
      backdrop-filter: saturate(130%) blur(30px);
      border-radius: 33rpx;
      position: relative;
      display: flex;
      padding: calc(136.5rpx / 2) 18.6rpx 28.2rpx;
      flex-direction: column;
      box-sizing: border-box;
      align-items: center;
      margin: 0 auto;

      //  头像
      .detail-Artist__main-section-user__avatar {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%, -50%);
        height: 136.5rpx;
        width: 136.5rpx;
        border-radius: 50%;
      }

      //   名字
      .detail-Artist__main-section-user__name {
        width: 100%;
        height: 82.7rpx;
        font-size: 36.5rpx;
        line-height: 82.7rpx;
        font-weight: 600;
        text-align: center;
        color: var(--theme-text-title-color);
      }

      // 描述
      .detail-Artist__main-section-user__sub {
        font-size: 32rpx;
        color: var(--theme-text-title-color);
        opacity: 0.7;
        margin-bottom: 14rpx;
      }

      // 标签
      .detail-Artist__main-section-user__tags {
        width: 100%;
        text-align: center;
        font-size: 23rpx;
        color: var(--theme-text-title-color);
        opacity: 0.4;
        line-height: 1.5;
        padding: 0 30rpx;
        box-sizing: border-box;
        text-indent: 46rpx;
        -webkit-line-clamp: 3 !important;
      }

      // 相似歌手
      .detail-Artist__main-section-user__semi {
        width: 100%;
        white-space: nowrap;
        margin-top: 28.2rpx;

        .main-section-user__semi-item {
          height: 100%;
          width: 180rpx;
          margin: 0 9.6rpx;
          background-color: rgba(248, 248, 248, 1);
          border-radius: 17rpx;
          display: inline-block;
          padding: 18rpx;
          box-sizing: border-box;
          font-size: 20.5rpx;
          line-height: 1;

          // 头像
          .main-section-user__semi-item__avatar {
            width: 86.5rpx;
            height: 86.5rpx;
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            margin: 0 auto 18rpx;
          }

          // 名
          .main-section-user__semi-item__name {
            margin-bottom: 18rpx;
            width: 100%;
            text-align: center;
          }

          //  描述
          .main-section-user__semi-item__sub {
            margin-bottom: 18rpx;
            color: rgba(152, 152, 152, 1);
            width: 100%;
            text-align: center;
          }

          .main-section-user__semi-item__action {
            width: 100%;
            height: 51.3rpx;
            border-radius: 26rpx;
            font-size: 20.5rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            color: rgb(255, 58, 57);
            border: 1px solid rgba(255, 58, 57, 0.5);
          }
        }
      }
    }

    // 动态信息面板
    .detail-Artist__main-section-desc {
      width: 100%;
      margin-top: 19.2rpx;

      .detail-Artist__main-section-desc-tab {
        height: 92rpx;
        width: 100%;
        display: flex;

        // 不可点击的状态
        .item-disabled {
          opacity: 0.3;
        }

        .main-section-desc-tab__item {
          flex: 1;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;

          // 标记数量的徽标
          .main-section-desc-tab__item-text-badge {
            color: var(--theme-text-sub-color);
            font-size: 15rpx;
          }

          .main-section-desc-tab__item-text {
            position: relative;

            .main-section-desc-tab__item-text-inner {
              position: relative;
              z-index: 2;
              font-size: 27rpx;
              color: var(--theme-text-sub-color);
            }
          }

          // 选中样式
          .item-text-checked {
            .main-section-desc-tab__item-text-inner {
              color: var(--theme-text-title-color);
              font-weight: 600;
              position: relative;
              z-index: 2;
            }

            &::after {
              content: '';
              z-index: 1;
              position: absolute;
              bottom: -7rpx;
              left: 0;
              width: 120%;
              height: 14rpx;
              transform: translate(-10%, 0);
              background: linear-gradient(to right, rgba(255, 59, 60, 1), rgba(255, 59, 60, 0.6));
              border-radius: 14rpx;
            }
          }
        }
      }

      .detail-Artist__main-section-desc-main {
        width: 100%;
        border-radius: 33rpx;
        padding: 0 7rpx;
        box-sizing: border-box;

        .detail-Artist__main-section-desc__user {
          padding: 0 23rpx;
          box-sizing: border-box;
          overflow: hidden;

          .detail-Artist__main-section-desc__user-spacing {
            padding: 0 30rpx;
            background: var(--theme-background-color-card);
            box-sizing: border-box;
            border-radius: 33rpx;

            //  歌单列表容器 s
            .detail-Artist__playlist-spacing {
              // 歌单列表
              .detail-Artist__playlist {
                display: flex;
                align-items: center;
                margin: 16rpx 0 0;

                .detail-Artist__playlist-image {
                  width: 96.15rpx;
                  height: 96.15rpx;
                  border-radius: 12rpx;
                  flex-shrink: 0;
                }

                .detail-Artist__playlist-desc {
                  width: calc(100% - 96.15rpx);
                  height: 100%;
                  padding-left: 18rpx;
                  line-height: 1.6;

                  .detail-Artist__playlist-title {
                    font-size: 30.7rpx;
                    width: 100%;
                    color: var(--theme-text-title-color);
                  }

                  .detail-Artist__playlist-sub {
                    font-size: 23rpx;
                    width: 100%;
                    color: var(--theme-text-title-color);
                    opacity: 0.4;
                  }
                }
              }
            }

            // 歌单列表容器 e
          }
        }
      }
    }
  }
}
</style>

