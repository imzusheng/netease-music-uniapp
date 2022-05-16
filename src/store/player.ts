import { defineStore } from 'pinia'
import { getPlayer, setInfo } from '@/common/player'
import { getRandomIndex } from '@/common/util'
import { useStore as useMainStore } from '@/store'
import { Song } from '@/types'

type PlayerStatus = {
  /**
   * 当前播放时长
   */
  currentTime: number
  /**
   * 歌曲时长
   */
  duration: number
  /**
   * 暂停状态
   */
  paused: boolean
  /**
   * 播放模式
   *
   * 1.listRepeat列表循环
   *
   * 2.list列表播放（播完即停）
   *
   * 3.random随机播放
   *
   * 4.repeat单曲循环
   */
  mode: number
}

const playerInfoStorage = uni.getStorageSync('playerInfo')
const playerStatusStorage = uni.getStorageSync('playerStatus')
const playerQueueStorage = uni.getStorageSync('playerQueue')

export const useStore = defineStore('player', {
  state: () => {
    return {
      /**
       * 歌曲是否正在加载
       */
      loading: false,

      /**
       * 播放队列
       */
      queue: (playerQueueStorage || []) as Array<Song>,

      /**
       * 当前播放歌曲信息
       */
      playerInfo: (playerInfoStorage || {}) as Song,

      /**
       * 播放器状态信息
       */
      playerStatus: (playerStatusStorage || {
        currentTime: 0,
        duration: 0,
        paused: true,
        mode: 1
      }) as PlayerStatus
    }
  },
  actions: {
    // 加载歌曲,store内自己调用
    load() {
      this.loading = true
      const mainStore = useMainStore()

      if (this.playerInfo.payload) {
        // 当存在播放记录，但播放器没有初始化src时
        mainStore.getSongUrl(this.playerInfo.payload).then(url => {
          if (url) setInfo({ ...this.playerInfo, url })
        })
      }
    },

    /**
     * 选歌，获取歌曲信息
     */
    setPlayerInfo(id: number) {
      this.loading = true
      const mainStore = useMainStore()

      // 如果上一首歌是插队列表的歌，把他的插队标记取消
      const curSongIdx = this.queue.findIndex(v => v.payload === this.playerInfo.payload)
      if (this.queue[curSongIdx]?.preference) {
        this.queue[curSongIdx].preference = false
      }
      uni.setStorageSync('playerQueue', this.queue)

      mainStore.getSongsDetail([id]).then(res => {
        const songInfo = res[0]
        this.playerInfo = songInfo
        uni.setStorageSync('playerInfo', songInfo)
        this.load()
      })
    },

    /**
     * 更改播放器状态
     */
    setPlayerStatus(args: {
      currentTime?: number
      duration?: number
      paused?: boolean
      mode?: number
    }) {
      Object.assign(this.playerStatus, args)
      const jsonPlayerStatus = JSON.parse(JSON.stringify(this.playerStatus))
      uni.setStorageSync('playerStatus', Object.assign(jsonPlayerStatus, { paused: true }))
    },

    /**
     * 开始播放
     */
    setPlayerPlay() {
      uni.vibrateShort({
        fail: () => {}
      })
      const player = getPlayer()
      if (player.src) player.play()
      else this.load()
    },

    /**
     * 暂停播放
     */
    setPlayerPause() {
      uni.vibrateShort({
        fail: () => {}
      })
      const player = getPlayer()
      if (player.src) player.pause()
      else this.load()
    },

    /**
     * 调整进度
     */
    seek(time: number) {
      const player = getPlayer()
      if (player.src) {
        player.seek(time)
        player.play()
      } else {
        //调整歌曲事件时，歌曲在加载状态，等待加载完成后再设置
        uni.$once('onCanplay', () => player.seek(time))
        this.load()
      }
    },

    /**
     * 播放队列
     */
    setQueue(songList: Array<Song>) {
      this.queue.push(...songList)
      uni.setStorageSync('playerQueue', this.queue)
    },
    /**
     * 插播
     */
    setPreference(songList: Array<Song>) {
      songList.forEach((song: Song) => {
        const curSongIdx = this.queue.findIndex(v => v.payload === song.payload)
        if (curSongIdx > -1) {
          this.queue[curSongIdx].preference = true
        } else {
          this.queue.unshift({ ...song, preference: true })
        }
      })

      uni.setStorageSync('playerQueue', this.queue)
    },

    /**
     * 清空队列
     */
    clearQueue() {
      this.queue = []
      uni.removeStorageSync('playerQueue')
      uni.showToast({ title: '已清空队列', icon: 'none', duration: 2000 })
    },

    /**
     * 设置加载状态
     */
    setLoading(status: boolean) {
      this.loading = status
    },

    // 切歌处理 setPlayerPrev, setPlayerNext
    changAirHandler() {
      if (this.queue.length > 0) {
        // 有没有歌曲需要插队
        const preferenceList = this.queue.filter(v => {
          return v?.preference && v.payload !== this.playerInfo?.payload
        })
        if (preferenceList.length > 0) return preferenceList
        else return this.queue
      } else {
        uni.showToast({
          title: '代播清单为空',
          duration: 2000,
          icon: 'none'
        })
        return undefined
      }
    },

    // 上一首
    setPlayerPrev() {
      const list = this.changAirHandler()
      if (list !== undefined) {
        const curSongId = this.playerInfo.payload
        const curSongIdx = list.findIndex(v => v.payload === curSongId)
        // 下一首歌的下标
        const nextSongIdx = curSongIdx === 0 ? list.length - 1 : curSongIdx - 1
        const curSongPayload = list[nextSongIdx].payload
        this.setPlayerInfo(curSongPayload)
      }
    },

    // 下一首
    setPlayerNext() {
      const list = this.changAirHandler()
      if (list !== undefined) {
        // 判断当前播放模式
        const curMode = this.playerStatus.mode
        // 队列长度
        const queueLength = list.length
        // 当前播放歌曲ID
        const curSongId = this.playerInfo.payload
        // 当前播放歌曲在队列中的下标
        const curSongIdx = list.findIndex(v => v.payload === curSongId)
        // 下一首歌的下标
        let nextSongIdx: undefined | number
        if (curMode === 1) {
          // listRepeat列表循环
          nextSongIdx = curSongIdx >= queueLength - 1 ? 0 : curSongIdx + 1
        } else if (curMode === 2) {
          // list列表播放（播完即停）
          nextSongIdx = curSongIdx >= queueLength - 1 ? undefined : curSongIdx + 1
        } else if (curMode === 3) {
          // random随机播放
          nextSongIdx = getRandomIndex(0, queueLength - 1)
        } else if (curMode === 4) {
          // repeat单曲循环
          nextSongIdx = curSongIdx
        }

        // 开始切歌
        if (nextSongIdx !== undefined) {
          // 下一首歌的ID
          const nextSongId = list[nextSongIdx].payload
          this.setPlayerInfo(nextSongId)
        } else {
          uni.showToast({
            title: '已经是最后一首了',
            duration: 2000,
            icon: 'none'
          })
        }
      }
    }
  }
})
