import { defineStore } from 'pinia'
import API from '@/common/api'
import { get } from '@/common/apiService'
import { convertCount, pickUpName } from '@/common/util'
import { Playlist, Song } from '@/types'
import moment from 'moment'

type Theme = {
  // 状态栏字体颜色
  navigationBarColor: '#ffffff' | '#000000'
  // 主题色
  themeColor: string
  // 页面背景色
  backgroundColor: string
  // 内容卡片背景色
  backgroundColorCard: string
  // 稍微强调色
  backgroundColorClear: string
  // 标题色
  textTitleColor: string
  // 副标题辅助色
  textSubColor: string
  // 边框颜色
  borderColor: string
  // 半透滤镜颜色
  filterColor: string
  // 阴影颜色
  shadowColor: string
}

const dark: Theme = {
  navigationBarColor: '#ffffff',
  themeColor: '#D1403C',
  backgroundColor: '#0E0E0E',
  backgroundColorCard: '#151515',
  backgroundColorClear: '#212121',
  textTitleColor: '#ffffff',
  textSubColor: '#626262',
  borderColor: '#2A2A2A',
  filterColor: 'rgba(19, 19, 20, 0.7)',
  shadowColor: '#131313'
}

const light: Theme = {
  navigationBarColor: '#000000',
  themeColor: '#f9343d',
  backgroundColor: '#F8F8F8',
  backgroundColorCard: '#FFFFFF',
  backgroundColorClear: '#f8f8f8',
  textTitleColor: '#333333',
  textSubColor: '#969696',
  borderColor: '#E7E7E7',
  filterColor: 'rgba(252, 252, 253, 0.7)',
  shadowColor: '#F8F9FA'
}

Object.freeze(dark)
Object.freeze(light)

export const useStore = defineStore('main', {
  state: () => {
    return {
      // 是否防止滚动穿透
      overflow: false,

      /**
       * time 为了触发getPageMetaStyle更新，否则主题不会及时改变
       */
      time: Date.now(),

      /**
       * 主题颜色配置
       */
      themeConfig: {
        theme: 'light' as 'dark' | 'light',
        dark: {
          navigationBarColor: '#ffffff',
          themeColor: '#D1403C',
          backgroundColor: '#0E0E0E',
          backgroundColorCard: '#151515',
          backgroundColorClear: '#212121',
          textTitleColor: '#ffffff',
          textSubColor: '#626262',
          borderColor: '#2A2A2A',
          filterColor: 'rgba(19, 19, 20, 0.7)',
          shadowColor: '#131313'
        },
        light: {
          navigationBarColor: '#000000',
          themeColor: '#f9343d',
          backgroundColor: '#F8F8F8',
          backgroundColorCard: '#FFFFFF',
          backgroundColorClear: '#f8f8f8',
          textTitleColor: '#333333',
          textSubColor: '#969696',
          borderColor: '#E7E7E7',
          filterColor: 'rgba(252, 252, 253, 0.7)',
          shadowColor: '#F8F9FA'
        }
      } as any
    }
  },
  getters: {
    getPageMetaStyle(): string {
      const systemInfo = uni.getSystemInfoSync()
      const statusBarHeight = systemInfo.statusBarHeight === 0 ? 10 : systemInfo.statusBarHeight
      const volume = `--status-bar-height: ${statusBarHeight}px; `

      const overflow: string = this.overflow ? 'overflow: hidden; ' : 'overflow: visible; '

      const curTheme: any = this.themeConfig[this.themeConfig.theme]
      const themeColor: string = `--theme-background-color-clear: ${curTheme.backgroundColorClear}; background-color: ${curTheme.backgroundColor}; --theme-shadow-color: ${curTheme.shadowColor}; --theme-filter-color: ${curTheme.filterColor}; --theme-color: ${curTheme.themeColor}; --theme-background-color: ${curTheme.backgroundColor}; --theme-background-color-card: ${curTheme.backgroundColorCard}; --theme-text-title-color: ${curTheme.textTitleColor}; --theme-text-sub-color: ${curTheme.textSubColor}; --theme-border-color: ${curTheme.borderColor};`

      return `--update-time: ${this.time}; ` + overflow + volume + themeColor
    },
    getCurTheme(): Theme {
      return this.themeConfig[this.themeConfig.theme]
    }
  },
  actions: {
    /**
     *
     * @param theme raw表示主题不变，但是重新执行以下setTabBarStyle、setBackgroundColor....
     * @param options 有的页面颜色需要特殊情况，通过此处传入合并
     */
    setTheme(theme: 'dark' | 'light' | 'raw', options?: Theme | object): void {
      this.time = Date.now()

      if (theme !== 'raw') {
        this.themeConfig.theme = theme
        uni.setStorageSync('theme', theme)
      }

      if (!!options) {
        Object.assign(this.themeConfig[this.themeConfig.theme], options)
      } else {
        this.themeConfig.dark = Object.assign({}, dark)
        this.themeConfig.light = Object.assign({}, light)
      }
      const mergeOptions = this.getCurTheme

      if (typeof uni.setTabBarStyle === 'function') {
        uni.setTabBarStyle({
          color: mergeOptions.textSubColor,
          selectedColor: mergeOptions.themeColor,
          backgroundColor: mergeOptions.backgroundColorCard,
          fail: () => {}
        })
      }

      if (typeof uni.setBackgroundColor === 'function') {
        uni.setBackgroundColor({
          backgroundColor: mergeOptions.backgroundColor,
          backgroundColorTop: mergeOptions.backgroundColor,
          backgroundColorBottom: mergeOptions.backgroundColor,
          fail: () => {}
        })
      }

      if (typeof uni.setNavigationBarColor === 'function') {
        uni.setNavigationBarColor({
          frontColor: mergeOptions.navigationBarColor,
          backgroundColor: '#fff',
          fail: () => {}
        })
      }
    },

    setPageMetaOverflow(status: boolean) {
      this.overflow = status
    },

    // 获取首页数据 (可选登录)
    async getHomePage(offset: number): Promise<any> {
      const res = await get(API.GET_HOME_PAGE, { cursor: { offset }, refresh: '' }, true, false)
      const cursor = res?.data?.cursor ? JSON.parse(res.data.cursor) : ''
      return {
        offset: cursor.offset ? cursor.offset : 0,
        more: res.data.hasMore,
        data: res.data.blocks
      }
    },

    // 获取首页入口按钮数据 (可选登录)
    async getHomeBall(): Promise<Array<any>> {
      const res = await get(API.GET_HOME_BALL, {}, true, false)
      return res.data
    },

    /**
     *  ↓ 歌单
     */

    /**
     * 收藏/取消收藏歌单 (登录)
     * @param id 资源 id
     * @param t 1收藏，2取消收藏
     */
    async getSubscribe(id: number, t: number): Promise<any> {
      const args: any = { id, t }
      return await get(API.PLAYLIST.GET_PLAYLIST_SUBSCRIBE, args, true, false)
    },

    // 歌单-获取所有歌单分类
    async getPlaylistCatlist(): Promise<any> {
      return await get(API.PLAYLIST.GET_PLAYLIST_CATLIST, {})
    },

    // 歌单-今日推荐, 不支持offset
    async getRcmdPlaylist(limit: number = 6): Promise<{ data: Array<any>; more: boolean }> {
      const resJson = await get(API.PLAYLIST.GET_RECOMMENDS, { limit })

      const data = resJson.result.map((v: any) => {
        const playCount = convertCount(v.playCount) || 0
        return {
          payload: v.id,
          // 可能是专辑、歌单、数字专辑等
          type: 'list',
          // 播放数量
          playCount,
          // 标题
          title: v.name,
          // 小标题
          subTitle: '',
          // 封面链接
          picUrl: v.picUrl
        }
      })

      return {
        data,
        more: false
      }
    },

    // 歌单分类列表
    async getPlaylistTop({
      limit = 30,
      offset = 0,
      cat = '华语'
    }): Promise<{ data: Array<Playlist>; type: string; more: boolean; total: number }> {
      const resJson = await get(API.PLAYLIST.GET_PLAYLIST_TOP, { limit, offset, cat })
      const data: Array<any> = resJson.playlists.map((v: any): any => {
        const playCount = convertCount(v.playCount) || 0
        return {
          payload: v.id,
          // 可能是专辑、歌单、数字专辑等
          type: 'list',
          // 播放数量
          playCount,
          // 标题
          title: v.name,
          // 小标题
          subTitle: '',
          // 封面链接
          picUrl: v.coverImgUrl
        }
      })
      return {
        data,
        total: resJson.total,
        more: data.length > 0,
        type: 'PlaylistTop'
      }
    },

    // 精品歌单 before 分页参数,取上一页最后一个歌单的 updateTime 获取下一页数据
    async getPlaylistHq({ limit = 6, before = undefined }): Promise<{
      data: Array<any>
      type: string
      more: boolean
      total: number
      updateTime: number
    }> {
      const args: any = { limit }
      if (before) args.before = before
      const resJson = await get(API.PLAYLIST.GET_PLAYLIST_HQ, args)

      const data = resJson.playlists.map((v: any) => {
        const playCount = convertCount(v.playCount) || 0
        return {
          payload: v.id,
          // 可能是专辑、歌单、数字专辑等
          type: 'list',
          // 播放数量
          playCount,
          // 标题
          title: v.name,
          // 小标题
          subTitle: '',
          // 封面链接
          picUrl: v.coverImgUrl
        }
      })
      return {
        data,
        total: resJson.total,
        more: data.length > 0,
        type: 'PlaylistHq',
        // 分页参数,取上一页最后一个歌单的 updateTime 获取下一页数据
        updateTime: resJson.lasttime
      }
    },

    // 获取网易云官方歌单，通过官方账号uid获取用户歌单
    async getOfficialPlaylist({
      limit = 30,
      offset = 0
    }): Promise<{ data: any; type: string; more: boolean; total: number }> {
      const resJson = await get(API.USER.GET_USER_PLAYLIST, { uid: 1463586082, limit, offset })
      const data = resJson.playlist
        .map((v: any) => {
          const playCount = convertCount(v.playCount) || 0
          return {
            payload: v.id,
            // 可能是专辑、歌单、数字专辑等
            type: 'list',
            // 播放数量
            playCount,
            // 标题
            title: v.name,
            // 小标题
            subTitle: '',
            // 封面链接
            picUrl: v.coverImgUrl
          }
        })
        .slice(1)

      return {
        data,
        total: resJson.total,
        more: data.length > 0,
        type: 'OfficialPlaylist'
      }
    },

    // 获取歌单详情 (可选登录)
    async getPlaylistDetail(id: number): Promise<Playlist | undefined> {
      const data = await get(API.PLAYLIST.GET_PLAYLIST_DETAIL, { id }, true, true)

      if (data.code !== 200) {
        console.error(data)
        return undefined
      } else {
        return {
          payload: data.playlist.id,
          // 作者信息
          creator: {
            // 作者封面
            picUrl: data.playlist.creator.avatarUrl,
            // 作者名
            name: data.playlist.creator.nickname,
            // 作者id
            id: data.playlist.creator.userId
          },
          // 是否订阅了歌单
          subscribed: data.playlist.subscribed,
          // 歌曲数量
          trackCount: data.playlist.trackCount,
          // 订阅数量
          subscribedCount: convertCount(data.playlist.subscribedCount) as string,
          // 播放数量
          playCount: convertCount(data.playlist.playCount) as string,
          // 评论数量
          commentCount: convertCount(data.playlist.commentCount) as string,
          // 分享数量
          shareCount: convertCount(data.playlist.shareCount) as string,
          // 发布日期
          createTime: moment(data.playlist.createTime).format('YYYY年M月D日'),
          // 歌曲id集合
          trackIds: data.playlist.trackIds.map((v: any) => v.id),
          // 歌名
          title: data.playlist.name,
          // 歌曲描述
          desc: data.playlist.description,
          // 歌曲封面
          picUrl: data.playlist.coverImgUrl
        }
      }
    },

    // 所有榜单详情
    async getToplistDetail(): Promise<any> {
      const resJson = await get(API.GET_TOPLIST_DETAIL, {})
      const data = resJson.list.map((item: any) => {
        return {
          payload: item.id,
          // 可能是专辑、歌单、数字专辑等
          type: 'list',
          // 播放数量
          playCount: item.updateFrequency,
          // 标题
          title: item.name,
          // 封面链接
          picUrl: item.coverImgUrl
        }
      })

      return data
    },

    /**
     * ↓ 单曲
     */

    // 获取单曲详情
    async getSongsDetail(trackIds: Array<number>): Promise<Array<Song>> {
      // 切割ids为100个一组 [ [...ids], [...ids], [...ids] ]
      const ids = JSON.parse(JSON.stringify(trackIds))
      function sliceArray(newArr: Array<any>, ids: Array<number>): Array<Array<number>> {
        const newIds = ids
        if (ids.length > 100) {
          newArr.push(newIds.splice(0, 100))
          return sliceArray(newArr, newIds)
        } else {
          newArr.push(ids)
          return newArr
        }
      }

      return new Promise<Array<Song>>(resolve => {
        // 切割好的ids
        const idsChunks = sliceArray([], ids)

        // 发起所有请求
        const requestQueue = idsChunks.map(idsArr => {
          return get(API.SONG.GET_SONG_DETAIL, { ids: idsArr.toString() })
        })

        const result: Array<Song> = []

        // 接收所有结果
        Promise.allSettled(requestQueue).then(resArr => {
          resArr.forEach(res => {
            if (res.status === 'fulfilled' && res.value.code === 200) {
              const data: Array<Song> = res.value.songs.map((v: any) => {
                // 找到支持的最高音质
                const quality: Array<string> = ['sq', 'h', 'l', 'm']
                const maxQIdx = [!!v.sq, !!v.h, !!v.l, !!v.m].indexOf(true)
                // 译名
                const tns = v.tns

                return {
                  // 最高音质
                  maxQ: quality[maxQIdx],

                  // id
                  payload: v.id,

                  // MV
                  mv: v.mv === 0 ? null : v.mv,

                  // 作者名
                  artist: pickUpName(v.ar),

                  ar: v.ar,

                  // 创作者(多人)
                  creator: pickUpName(v.ar),

                  // 歌曲封面
                  picUrl: v.al.picUrl,

                  // 歌曲名
                  title: tns ? `${v.name}（${tns}）` : v.name,

                  // 来自专辑
                  album: v.al.name,

                  // 发布时间 年
                  publishTime: v.publishTime ? moment(v.publishTime).year().toString() : '',

                  // 歌曲时长，单位分钟
                  duration: v.dt,

                  // 是否需要会员
                  fee: v.fee.toString()
                }
              })
              result.push(...data)
            }
          })

          resolve(result)
        })
      })
    },

    // 获取单曲url
    async getSongUrl(id: number): Promise<string | undefined> {
      const resJson = await get(API.SONG.GET_SONG_URL, { id })
      if (!resJson.data[0].url) {
        uni.showToast({
          title: '似乎不能播放',
          duration: 2000,
          icon: 'none'
        })
        return undefined
      } else {
        return resJson.data[0].url
      }
    },

    /**
     * 评论
     */
    /**
     * 获取歌单评论
     * @param options.pageNo 分页参数,第 N 页,默认为 1
     * @param options.pageSize 分页参数,每页多少条数据,默认 30
     * @param options.sortType 排序方式, 1:按推荐排序, 2:按热度排序, 3:按时间排序
     * @param options.cursor 当sortType为 3 时且页数不是第一页时需传入,值为上一条数据的 time
     *
     */
    async getCommentPlaylist({
      id = 0,
      pageNo = 1,
      pageSize = 100,
      sortType = 1,
      cursor = undefined
    }): Promise<any> {
      const args: any = { id, pageNo, pageSize, sortType, type: 2 }
      if (cursor) args.cursor = cursor
      return await get(API.COMMENT.GET_COMMENT_NEW, args, true, true)
    },
    /**
     * 点赞评论（登录）
     * @param id 资源 id
     * @param cid 评论id
     * @param t 1点赞，0取消点赞
     * @param type 数字 , 资源类型 , 对应歌曲 , mv, 专辑 , 歌单 , 电台, 视频对应以下类型
     */
    async getCommentLike(id: number, cid: number, t: number, type: number): Promise<any> {
      const args: any = { id, cid, t, type }
      return await get(API.COMMENT.GET_COMMENT_LIKE, args, true, false)
    },
    /**
     * 楼层评论
     * @param parentCommentId 楼层评论id
     * @param id 资源id
     * @param type 0: 歌曲 1: mv 2: 歌单 3: 专辑 4: 电台 5: 视频
     */
    async getCommentFloor(parentCommentId: number, id: number, type: number): Promise<any> {
      const args: any = { id, parentCommentId, type }
      return await get(API.COMMENT.GET_COMMENT_FLOOR, args, false, false)
    }
  }
})
