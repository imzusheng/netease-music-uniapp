<!--
Author: zusheng
Date: 2022-05-09 13:57:08
LastEditTime: 2022-05-14 14:58:12
Description: 验证码页面
FilePath: \uni-preset-vue-vite-ts\src\pages\login\verify.vue
-->

<script lang="ts" setup>
import TheNavBar from '@/components/TheNavBar.vue'
import { onLoad } from '@dcloudio/uni-app'
import { useStore } from '@/store'
import { useStore as useUserStore } from '@/store/user'
import { useStore as useLoginStore } from '@/store/login'
import { reactive } from 'vue'

const store = useStore()
const userStore = useUserStore()
const loginStore = useLoginStore()
const data = reactive<any>({
  // 输入验证码
  inputCode: '',

  // 上次发送时间
  lastTime: '',

  // 距离下次发送的时间 单位秒
  nextTime: 0,

  timer: 0
})

onLoad(() => {
  setCodeInterval()
})

function setCodeInterval() {
  // 从缓存中恢复
  uni.getStorage({
    key: 'codeLasttime',
    success: function (res) {
      data.lastTime = res.data
      data.timer = setInterval(() => {
        const seconds = ((Date.now() - Number(data.lastTime)) / 1000).toFixed(0)
        if (60 - Number(seconds) <= 0) {
          clearInterval(data.timer)
          data.nextTime = 0
        } else {
          data.nextTime = 60 - Number(seconds)
        }
      }, 1000)
    },
    fail() {}
  })
}

// 输入验证码
function inputCode(e: any) {
  data.inputCode = e.detail.value
}

// 1. 开始校验
function toNext() {
  if (loginStore.phone && data.inputCode) {
    uni.showLoading({ title: '请稍后', mask: true })
    loginStore.getVerifyCode(loginStore.phone, data.inputCode).then((res: any) => {
      uni.hideLoading()
      if (res.code === 200 && res.data) {
        loginStore.code = data.inputCode
        // 验证成功
        toLogin()
      } else {
        uni.showToast({
          title: '校验失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  } else {
    uni.showToast({
      title: '请输入验证码',
      icon: 'none',
      duration: 2000
    })
  }
}

// 2. 校验成功，开始登录
function toLogin() {
  if (loginStore.phone && data.inputCode) {
    loginStore
      .getLogin({
        phone: loginStore.phone,
        code: data.inputCode
      })
      .then((res: any) => {
        if (res.code === 200) {
          // 设置登录状态
          userStore.auth = true
          uni.setStorageSync('cookie', res.cookie)
          uni.reLaunch({ url: `../../pages/index/user` })
        } else if (res.code === 410) {
          // 账号未注册，跳转到注册页补充信息
          uni.navigateTo({ url: `../../pages/login/signup` })
        } else {
          uni.showToast({
            title: res.message,
            icon: 'error',
            duration: 5000
          })
        }
      })
  }
}

// 重新发送验证码
function reSendCode() {
  if (loginStore.phone && data.nextTime === 0) {
    uni.showLoading({ title: '发送中' })
    loginStore
      .getSendCode(loginStore.phone)
      .then((res: any) => {
        if (!res.data) {
          uni.showToast({
            title: '发送失败',
            icon: 'error',
            duration: 5000
          })
        }
        setCodeInterval()
        uni.hideLoading()
      })
      .catch((error: any) => {
        uni.hideLoading()
        uni.showToast({
          title: '发送失败',
          icon: 'error',
          duration: 5000
        })
        console.error(error)
      })
  } else {
    uni.showToast({
      title: '发送频率过快',
      icon: 'none',
      duration: 2000
    })
  }
}
</script>

<template>
  <page-meta :page-style="store.getPageMetaStyle" />

  <!-- ↓ 自定义导航 -->
  <the-nav-bar
    :title="'手机号登陆'"
    :back="true"
    :filter="false"
    title-color="black"
    theme-color="0,0,0,0"
  />

  <view class="login-at-phone">
    <view class="login-at-phone__main">
      <!-- 描述 -->
      <view class="login-at-phone__main-title-h2">
        <text>输入验证码</text>
      </view>
      <view class="login-at-phone__main-title-p">
        <text>已经发送至 {{ loginStore.phone }}</text>
        <view @tap.stop.prevent="reSendCode" :class="{ 'can-send-code': data.nextTime === 0 }">
          <template v-if="data.nextTime > 0"> {{ data.nextTime }}s&nbsp; </template>
          重新发送
        </view>
      </view>

      <!-- 手机号输入框 -->
      <view class="login-at-phone__main-input">
        <input
          @input="inputCode"
          class="login-at-phone__main-input-content"
          type="number"
          placeholder=""
          maxlength="6"
          :focus="true"
          :adjust-position="false"
        />
      </view>

      <!-- 下一步 -->
      <view class="login-at-phone__main-next">
        <view class="login-at-phone__main-next__verify" @tap="toNext"> 下一步 </view>
      </view>
    </view>
  </view>
</template>

<style lang="less">
.login-at-phone {
  width: 100%;
  overflow: hidden;
  padding: calc(var(--status-bar-height) + var(--nav-tab-height-custom)) 0 0;

  .login-at-phone__main {
    margin-top: 73rpx;
    height: 200px;
    width: 100%;
    padding: 0 33rpx;
    box-sizing: border-box;

    .login-at-phone__main-title-h2 {
      font-size: 33.3rpx;
      font-weight: 700;
      color: rgb(50, 51, 51);
      line-height: 1;
    }

    .login-at-phone__main-title-p {
      margin-top: 24.4rpx;
      font-size: 25.64rpx;
      color: rgb(153, 153, 153);
      line-height: 1;
      display: flex;
      justify-content: space-between;
      .can-send-code {
        color: var(--theme-color);
      }
    }

    .login-at-phone__main-input {
      height: 83.4rpx;
      width: 100%;
      border-bottom: 1px solid rgb(232, 232, 232);
      display: flex;
      align-items: center;
      margin-top: 16rpx;

      .login-at-phone__main-input-content {
        height: 32rpx;
        width: 100%;
      }
    }

    .login-at-phone__main-next {
      margin-top: 77rpx;
      width: 100%;
      line-height: 80rpx;
      text-align: center;
      opacity: 1;

      .login-at-phone__main-next__verify {
        color: #fff;
        width: 100%;
        height: 80rpx;
        border-radius: 80rpx;
        background-color: var(--theme-color);
      }
    }
  }
}
</style>
