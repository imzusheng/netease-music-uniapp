<!--
Author: zusheng
Date: 2022-05-08 16:47:28
LastEditTime: 2022-05-14 22:37:56
Description: 用户主页
FilePath: \uni-preset-vue-vite-ts\src\pages\index\user.vue
-->
<script lang="ts" setup>
import TheNavBar from '@/components/TheNavBar.vue'
import ThePopupLogin from '@/components/ThePopupLogin.vue'
import SectionFrame from '@/components/section/SectionFrame.vue'
import ThePlayerBottomBar from '@/components/ThePlayerBottomBar.vue'
import { convertCount } from '@/common/util'
// import TheNotRegister from '@/components/TheNotRegister.vue'
import { onHide, onShow, onReady } from '@dcloudio/uni-app'
import { reactive, ref } from 'vue'
import { useStore as useUserStore } from '@/store/user'
import { useStore } from '@/store'

const store = useStore()
const userStore = useUserStore()
const navShow = ref<boolean>()
const userWrapRef = ref<any>()
const data = reactive<any>({
  // 初始化状态
  init: false,

  // 公共组件是否显示
  curPageShow: false,
  // 用户信息
  user: {},

  // 用户歌单信息
  UserPlaylist: {
    more: true,
    // 创建的歌单
    listCreator: [],
    // 喜欢的歌单
    listLike: []
  }
})

onShow(() => {
  data.curPageShow = true
})

onHide(() => {
  data.curPageShow = false
})

onReady(() => {
  init()
})
// 初始化
async function init() {
  if (userStore.getIsAuth) {
    uni.showLoading({
      title: `加载中`
    })

    observeSection()
    data.init = true

    // 如果store中不存在用户id，则重新获取账户信息
    if (userStore.userId === 0) await userStore.getUserAccount()

    const userId: number = userStore.userId
    const funcMatch: any = {
      UserPlaylist: (data: any) => userPlaylistHandler(data),
      UserDetail: (data: any) => userDetailHandler(data)
    }

    Promise.allSettled([userStore.getUserPlaylist(userId), userStore.getUserDetail(userId)]).then(
      (resArr: any) => {
        resArr.forEach((res: any) => {
          if (res.status === 'fulfilled') {
            const resData = res.value

            const func = funcMatch[resData.type]
            if (typeof func === 'function') funcMatch[resData.type](resData)
          }
        })
        uni.hideLoading()
      }
    )
  }
}

// 赋值用户歌单
function userPlaylistHandler(args: any) {
  data.UserPlaylist.more = args.more

  args.data.playlist.forEach((v: any) => {
    if (v.creator.userId === userStore.userId) {
      data.UserPlaylist.listCreator.push(v)
    } else {
      data.UserPlaylist.listLike.push(v)
    }
  })
}

// 赋值 用户详情
function userDetailHandler(args: any) {
  console.log('\n\n\n', '已登录', args.data, '\n\n\n')
  data.user = args.data
}

// 前往歌单页面
function toPlaylist(args: any) {
  const type = args.specialType === 5 ? 'likeList' : 'playlist'
  uni.navigateTo({ url: `../detail/playlist?id=${args.payload}&type=${type}` })
}

// 观察
function observeSection() {
  uni
    .createIntersectionObserver(userWrapRef.value, {
      observeAll: false,
      // 微信小程序似乎不支持 thresholds: 1
      thresholds: [0.999],
      initialRatio: 0
    })
    .relativeToViewport({ top: -100 })
    .observe('.user-main-info', (res: any) => {
      navShow.value = res.intersectionRatio < 0.999
      uni.setNavigationBarColor({
        frontColor: navShow.value ? '#000000' : '#ffffff',
        backgroundColor: '#fff'
      })
    })
}

function openPopup() {
  if (!userStore.getIsAuth)
    uni.$emit('popupOpen', [{ name: '手机登录' }, { name: '邮箱登录' }, { name: '二维码登录' }])
}
</script>

<template>
  <page-meta :page-style="store.getPageMetaStyle" />

  <!-- ↓ 自定义导航 -->
  <the-nav-bar
    :title="navShow ? data.user.name : ''"
    :back="false"
    :filter="false"
    :bg="(navShow as boolean)"
  />

  <the-popup-login />

  <!-- ↓ 播放器 -->
  <the-player-bottom-bar />

  <view class="user-wrap fixed-top fixed-bottom" ref="userWrapRef">
    <image
      v-if="data.user.backgroundUrl"
      class="user-wrap-bg"
      :src="data.user.backgroundUrl"
      mode="aspectFill"
    />

    <view class="user-main">
      <!-- ↓ 用户信息 -->
      <view @tap="openPopup" class="user-main-info">
        <!-- 头像 -->
        <image
          v-if="data.user.avatarUrl"
          :src="`${data.user.avatarUrl}?param=100y100`"
          class="user-main-info__user-avatar"
          mode="aspectFit"
        />
        <image
          v-else
          src="@/static/fbs.png"
          class="user-main-info__user-avatar user-avatar-not-register"
          mode="aspectFit"
        />
        <!-- 名 -->
        <view class="user-main-info__user-name">
          {{ userStore.getIsAuth ? data.user.name : '点击登录' }}
        </view>
        <!-- 描述 -->
        <view class="user-main-info__user-sub">
          <template v-if="userStore.getIsAuth">
            {{ data.user.follows }} 关注&nbsp;&nbsp;&nbsp;
            {{ convertCount(data.user.followeds) }} 粉丝&nbsp;&nbsp;&nbsp; Lv.{{ data.user.level }}
          </template>
          <template v-else> 登录体验更多精彩 </template>
        </view>
      </view>

      <!-- ↓ 创建的歌单 -->
      <view class="user-main__playlist-wrap">
        <view class="user-main__playlist-wrap-spacing">
          <section-frame
            :title="`创建的歌单 (${data.UserPlaylist.listCreator.length}个)`"
            :more="false"
          >
            <template #default>
              <view
                v-if="data.UserPlaylist.listCreator.length > 0"
                class="user-main__playlist-spacing"
              >
                <view
                  @tap.stop.prevent="toPlaylist(item)"
                  class="user-main__playlist"
                  v-for="item in data.UserPlaylist.listCreator"
                  :key="item.payload"
                >
                  <image
                    class="user-main__playlist-image"
                    :src="`${item.picUrl}?param=100y100`"
                    mode="aspectFit"
                  />
                  <view class="user-main__playlist-desc text-ellipsis-single">
                    <view class="user-main__playlist-title text-ellipsis-single">{{
                      item.title
                    }}</view>
                    <view class="user-main__playlist-sub text-ellipsis-single">
                      {{ item.trackCount }} 首，播放 {{ convertCount(item.playCount) }} 次
                    </view>
                  </view>
                </view>
              </view>

              <view v-else class="user-main__playlist-spacing-empty"> 暂无创建的歌单 </view>
            </template>
          </section-frame>
        </view>
      </view>

      <!-- ↓ 收藏的歌单 -->
      <view v-if="data.UserPlaylist.listLike.length > 0" class="user-main__playlist-wrap">
        <view class="user-main__playlist-wrap-spacing">
          <section-frame
            :title="`收藏的歌单 (${data.UserPlaylist.listLike.length}个)`"
            :more="false"
          >
            <template #default>
              <view class="user-main__playlist-spacing">
                <view
                  @tap.stop.prevent="toPlaylist(item)"
                  class="user-main__playlist"
                  v-for="item in data.UserPlaylist.listLike"
                  :key="item.payload"
                >
                  <image
                    class="user-main__playlist-image"
                    :src="`${item.picUrl}?param=100y100`"
                    mode="aspectFit"
                  />
                  <view class="user-main__playlist-desc text-ellipsis-single">
                    <view class="user-main__playlist-title text-ellipsis-single">{{
                      item.title
                    }}</view>
                    <view class="user-main__playlist-sub text-ellipsis-single">
                      {{ item.trackCount }} 首，播放 {{ convertCount(item.playCount) }} 次
                    </view>
                  </view>
                </view>
              </view>
            </template>
          </section-frame>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="less" scoped>
.user-wrap {
  width: 100%;
  min-height: calc(100vh - var(--window-bottom));
  box-sizing: border-box;
  background: linear-gradient(
    to bottom,
    var(--theme-background-color),
    var(--theme-background-color)
  );
  position: relative;

  .user-wrap-bg {
    z-index: 1;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(136.5rpx / 2 + 61.4rpx + var(--status-bar-height) + var(--nav-tab-height-custom));
    clip-path: ellipse(220% 100% at 50% 0);
    filter: brightness(50%);
  }

  .user-main {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100%;
    margin-top: calc(136.5rpx / 2 + 30.7rpx);
    box-sizing: border-box;
    padding: 0 30.7rpx;

    // 用户信息
    .user-main-info {
      width: 100%;
      background-color: var(--theme-background-color-card);
      border-radius: 28.85rpx;
      position: relative;
      box-sizing: border-box;
      padding-top: calc(136.5rpx / 2);
      padding-bottom: 38.5rpx;

      //  头像
      .user-avatar-not-register {
        background-color: var(--theme-background-color-card);
        border-radius: 50%;
      }
      .user-main-info__user-avatar {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%, -50%);
        height: 136.5rpx;
        width: 136.5rpx;
        border-radius: 50%;
      }

      //   名字
      .user-main-info__user-name {
        width: 100%;
        height: 82.7rpx;
        font-size: 36.5rpx;
        line-height: 82.7rpx;
        font-weight: 600;
        text-align: center;
        color: var(--theme-text-title-color);
      }

      // 描述
      .user-main-info__user-sub {
        font-size: 32rpx;
        color: var(--theme-text-sub-color);
        margin-bottom: 14rpx;
        text-align: center;
      }
    }

    // 歌单
    .user-main__playlist-wrap {
      width: 100%;
      box-sizing: border-box;
      margin-top: 30.7rpx;
      .user-main__playlist-wrap-spacing {
        padding: 0 30rpx;
        box-sizing: border-box;
        border-radius: 33rpx;
        background-color: var(--theme-background-color-card);

        // 为空
        .user-main__playlist-spacing-empty {
          padding: 48rpx 0;
          color: rgba(0, 0, 0, 0.5);
          text-align: center;
        }

        //  歌单列表容器 s
        .user-main__playlist-spacing {
          margin-top: 20rpx;
          // 歌单列表
          .user-main__playlist {
            display: flex;
            align-items: center;
            margin: 16rpx 0 0;
            .user-main__playlist-image {
              width: 96.15rpx;
              height: 96.15rpx;
              border-radius: 12rpx;
              flex-shrink: 0;
            }

            .user-main__playlist-desc {
              width: calc(100% - 96.15rpx);
              height: 100%;
              padding-left: 18rpx;
              line-height: 1.6;
              .user-main__playlist-title {
                font-size: 30.7rpx;
                width: 100%;
                color: var(--theme-text-title-color);
              }
              .user-main__playlist-sub {
                font-size: 23rpx;
                width: 100%;
                color: var(--theme-text-sub-color);
              }
            }
          }
        }
        // 歌单列表容器 e
      }
    }
  }
}
</style>

