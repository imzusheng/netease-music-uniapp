/*
 * @Author: zusheng
 * @Date: 2022-04-27 12:11:07
 * @LastEditTime: 2022-05-13 11:42:34
 * @Description: 播放器
 * @FilePath: \uni-preset-vue-vite-ts\src\common\player.ts
 */

import { Song } from '@/types'

// 支持getBackgroundAudioManager API 或 innerAudioContext  API
let bgAudioManager: any

export const createPlayer = () => {
  bgAudioManager = uni.getBackgroundAudioManager
    ? uni.getBackgroundAudioManager()
    : uni.createInnerAudioContext()

  // 监听事件
  bgAudioManager.onStop(() => uni.$emit('onStop', bgAudioManager))

  bgAudioManager.onPlay(() => uni.$emit('onPlay', bgAudioManager))

  bgAudioManager.onPause(() => uni.$emit('onPause', bgAudioManager))

  bgAudioManager.onWaiting(() => uni.$emit('onCanplay', bgAudioManager))

  bgAudioManager.onTimeUpdate(() => uni.$emit('onTimeUpdate', bgAudioManager))

  bgAudioManager.onError(() => uni.$emit('onError', bgAudioManager))

  bgAudioManager.onEnded(() => uni.$emit('onEnded', bgAudioManager))

  // 监听系统操作中心切歌 仅IOS
  if (bgAudioManager.onPrev) {
    bgAudioManager.onPrev(() => uni.$emit('onPrev', bgAudioManager))
    bgAudioManager.onNext(() => uni.$emit('onNext', bgAudioManager))
  }
}

export const getPlayer = () => bgAudioManager

/**
 * @param {string} data: 设置歌曲信息
 */
export const setInfo = (data: Song) => {
  if (bgAudioManager?.src) bgAudioManager.stop()

  if (!!uni.getBackgroundAudioManager) {
    bgAudioManager.title = data.title
    bgAudioManager.singer = data.artist
    bgAudioManager.epname = data.album
    bgAudioManager.coverImgUrl = data.picUrl
  } else {
    bgAudioManager.obeyMuteSwitch = true
    bgAudioManager.volume = 0.3
    bgAudioManager.playbackRate = 'playback'
  }
  bgAudioManager.src = data.url
  bgAudioManager.play()
}
