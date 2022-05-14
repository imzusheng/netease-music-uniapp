<script setup lang="ts">
import { createPlayer } from '@/common/player'
import { useStore as useMainStore } from '@/store'
import { useStore as usePlayerStore } from '@/store/player'
import { useStore as useUserStore } from '@/store/user'
import { onLaunch } from '@dcloudio/uni-app'

const mainStore = useMainStore()
const playerStore = usePlayerStore()
const userStore = useUserStore()

onLaunch(() => {
  initPlayer()
  initUserAuth()
})

/**
 * 若保存了cookie，获取用户信息
 */
function initUserAuth() {
  if (userStore.getIsAuth) userStore.getUserAccount()
}

/**
 * 初始化播放器
 */
function initPlayer() {
  // 初始化播放器
  createPlayer()

  // 监听播放器事件
  uni.$on('popupOpen', () => mainStore.setPageMetaOverflow(true))
  uni.$on('popupClose', () => mainStore.setPageMetaOverflow(false))

  uni.$on('onPlay', () => playerStore.setPlayerStatus({ paused: false }))

  uni.$on('onPause', () => playerStore.setPlayerStatus({ paused: true }))

  uni.$on('onCanplay', () => playerStore.setLoading(false))

  uni.$on('onEnded', () => playerStore.setPlayerNext())

  uni.$on('onPrev', () => playerStore.setPlayerPrev())

  uni.$on('onNext', () => playerStore.setPlayerNext())

  uni.$on('onTimeUpdate', player => {
    playerStore.setLoading(false)
    playerStore.setPlayerStatus({
      currentTime: player.currentTime,
      duration: player.duration
    })
  })

  // 监听系统主题状态变化
  uni.onThemeChange(res => {
    console.log(res)
  })
}
</script>

<style lang="less">
page,
html,
body {
  // 主题色
  --theme-color: #f9343d;

  // 自定义导航栏高度
  --nav-tab-height-custom: 84.6rpx;

  // tabbar高度
  // --tabbar-height-custom: 50px;
  --tabbar-height-custom: 0;

  // 播放器高度
  --player-height-custom: 54px;

  font-family: open sans, Helvetica, Arial, sans-serif;
  background-color: #fff;
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
}

/* #ifdef H5 */
.uni-tabbar-bottom {
  bottom: 0 !important;
}
/* #endif */

::-webkit-scrollbar {
  display: none;
  width: 0 !important;
  height: 0 !important;
  -webkit-appearance: none;
  background: transparent;
}

// 文字省略 单行
.text-ellipsis-single {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

// 文字省略 多行
.text-ellipsis-multi {
  white-space: pre-line;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.fixed-top {
  padding-top: calc(var(--status-bar-height) + var(--nav-tab-height-custom));
  box-sizing: border-box;
}

/* #ifdef H5 */
.fixed-bottom {
  // 底部占位
  padding-bottom: calc(var(--window-bottom) + var(--player-height-custom));
  box-sizing: border-box;
}
/* #endif */

/* #ifndef H5 */
.fixed-bottom {
  padding-bottom: calc(
    var(--window-bottom) + var(--player-height-custom) + constant(safe-area-inset-bottom)
  );
  padding-bottom: calc(
    var(--window-bottom) + var(--player-height-custom) + env(safe-area-inset-bottom)
  );
  box-sizing: border-box;
}
/* #endif */

.fixed-placeholder {
  width: 100%;
  background-color: transparent;
  height: constant(safe-area-inset-bottom);
  height: env(safe-area-inset-bottom);
}

// 隐形占位，用于observerAPI
.observer-placeholder {
  width: 100%;
  height: 100px;
  position: absolute;
  top: 0;
  left: 0;
  visibility: hidden;
}
</style>
