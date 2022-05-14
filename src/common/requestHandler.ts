import { pickUpName } from './util'
// 处理请求返回的数据

import { convertCount } from '@/common/util'
import moment from 'moment'

export const getHomePageHandler = (blocks: any) => {
  const startTime = Date.now()
  const data: any = {}
  try {
    blocks.forEach((block: any) => {
      const key = block.blockCode.toLowerCase()

      switch (block.blockCode) {
        case 'HOMEPAGE_BANNER':
          data[key] = getBanner(block)
          break

        case 'HOMEPAGE_BLOCK_PLAYLIST_RCMD':
          // 推荐歌单
          data[key] = getRcmdPlaylist(block)
          break

        case 'HOMEPAGE_BLOCK_STYLE_RCMD':
          // 个性推荐-单曲
          data[key] = getRcmdStyleSong(block)
          break

        case 'HOMEPAGE_BLOCK_NEW_ALBUM_NEW_SONG':
          //  新歌、新碟、新专辑
          data[key] = getNewAlbumSongs(block)
          break

        case 'HOMEPAGE_BLOCK_HOT_TOPIC':
          // 热门话题
          data[key] = getHotTopic(block)
          break

        case 'HOMEPAGE_MUSIC_CALENDAR':
          // 音乐日历
          data[key] = getMusicCalendar(block)
          break

        case 'HOMEPAGE_BLOCK_MGC_PLAYLIST':
          // 网易云音乐的雷达歌单 HOMEPAGE_BLOCK_MGC_PLAYLIST
          data[key] = getMgcPlaylist(block)
          break

        case 'HOMEPAGE_BLOCK_OFFICIAL_PLAYLIST':
          // 专属场景歌单
          data[key] = getOfcPlaylist(block)
          break

        case 'HOMEPAGE_VOICELIST_RCMD':
          // 热门博客|有声书
          data[key] = getRcmdVoiceList(block)
          break
      }
    })
  } catch (e) {
    //TODO handle the exception
    console.warn(e)
  }

  function getBanner(block: any) {
    return block.extInfo.banners
  }

  // 推荐歌单
  function getRcmdPlaylist(block: any) {
    const title = block.uiElement.subTitle.title
    const scrollList = block.creatives[0].resources.map((resource: any): any => {
      const uiElement = resource.uiElement
      const playCount = convertCount(resource.resourceExtInfo.playCount) || 0
      return {
        payload: resource.resourceId,
        type: resource.resourceType,
        playCount: playCount,
        title: uiElement.mainTitle.title,
        picUrl: uiElement.image.imageUrl,
        subTitle: uiElement.subTitle?.title,
        tags: uiElement.labelTexts
      }
    })
    const list = block.creatives.slice(1).map((creative: any) => {
      const uiElement = creative.uiElement
      const resource = creative.resources[0]
      const playCount = convertCount(resource.resourceExtInfo.playCount) || 0
      return {
        payload: resource.resourceId,
        type: resource.resourceType,
        playCount: playCount,
        title: uiElement.mainTitle.title,
        picUrl: uiElement.image.imageUrl,
        subTitle: uiElement.subTitle?.title,
        tags: uiElement.labelTexts
      }
    })

    return {
      title,
      scrollList,
      list
    }
  }

  // 个性推荐-单曲
  function getRcmdStyleSong(block: any) {
    const title = block.uiElement.subTitle.title
    const rawlist = block.creatives.map((creative: any) => {
      return creative.resources.map((resource: any) => {
        const uiElement = resource.uiElement
        return {
          title: uiElement.mainTitle.title,
          mv: resource.resourceExtInfo.song.mv,
          artist: pickUpName(resource.resourceExtInfo.artists),
          picUrl: uiElement.image.imageUrl,
          payload: resource.resourceId,
          subTitle:
            uiElement?.subTitle?.titleType !== 'songRcmdTag' ? uiElement?.subTitle?.title : '',
          tags: uiElement?.subTitle?.titleType === 'songRcmdTag' ? uiElement?.subTitle?.title : ''
        }
      })
    })
    return {
      title,
      list: rawlist
    }
  }

  // 热门话题 HOMEPAGE_BLOCK_HOT_TOPIC
  function getHotTopic(block: any) {
    const list = block.creatives.map((creative: any) => {
      // creative 一页三条
      return creative.resources.map((resource: any) => {
        // resource 一条数据
        const uiElement = resource.uiElement
        return {
          title: uiElement.mainTitle.title,
          picUrl: uiElement.mainTitle.titleImgUrl,
          subTitle: uiElement.subTitle.title,
          labelUrls: uiElement.labelUrls
        }
      })
    })

    return list
  }

  //  新歌、新碟、新专辑
  function getNewAlbumSongs(block: any) {
    const data: any = {
      newSongs: [],
      newAlbum: [],
      newDigital: []
    }

    block.creatives.forEach((creative: any) => {
      const creativeType = creative.creativeType
      let target
      if (creativeType === 'NEW_SONG_HOMEPAGE') {
        target = 'newSongs'
      } else if (creativeType === 'NEW_ALBUM_HOMEPAGE') {
        target = 'newAlbum'
      } else if (creativeType === 'DIGITAL_ALBUM_HOMEPAGE') {
        target = 'newDigital'
      }
      if (target) {
        const listData = creative.resources.map((resource: any) => {
          const uiElement = resource.uiElement
          return {
            videoInfo: {
              status: false
            },
            payload: resource.resourceId,
            type: resource.resourceType,
            artist: resource.resourceExtInfo.artists.map((v: any) => v.name).join('/'),
            title: uiElement.mainTitle.title,
            subTitle: uiElement?.subTitle?.title,
            picUrl: uiElement.image.imageUrl,
            tags: uiElement.labelTexts
          }
        })

        data[target].push(listData)
      }
    })

    return data
  }

  // 音乐日历 HOMEPAGE_MUSIC_CALENDAR
  function getMusicCalendar(block: any) {
    const title = block.uiElement.subTitle.title
    const list = block.creatives.map((creative: any) => {
      const resource = creative.resources[0]
      const subTitle = moment().calendar(resource.resourceExtInfo.startTime, {
        sameDay: '[今天]',
        nextDay: '[明天]',
        nextWeek: 'dddd',
        lastDay: '[昨天]',
        lastWeek: '[上个] dddd',
        sameElse: (e: any) => {
          return moment(e).fromNow()
        }
      })
      return {
        payload: resource.resourceId,
        type: resource.resourceType,
        title: resource.uiElement.mainTitle.title,
        subTitle,
        picUrl: resource.uiElement.image.imageUrl
      }
    })

    return {
      title,
      list
    }
  }

  // 网易云音乐的雷达歌单 HOMEPAGE_BLOCK_MGC_PLAYLIST
  function getMgcPlaylist(block: any) {
    const title = block.uiElement.subTitle.title
    const list = block.creatives.map((creative: any) => {
      const resource = creative.resources[0]
      const uiElement = creative.uiElement
      const playCount = convertCount(resource.resourceExtInfo.playCount) || 0
      return {
        playCount,
        payload: resource.resourceId,
        type: resource.resourceType,
        title: uiElement.mainTitle.title,
        picUrl: uiElement.image.imageUrl
      }
    })

    return {
      title,
      list
    }
  }

  // 专属场景歌单 HOMEPAGE_BLOCK_OFFICIAL_PLAYLIST
  function getOfcPlaylist(block: any) {
    const title = block.uiElement.subTitle.title
    const list = block.creatives.map((creative: any) => {
      const resource = creative.resources[0]
      const uiElement = creative.uiElement
      const playCount = convertCount(resource.resourceExtInfo.playCount) || 0
      return {
        playCount,
        payload: resource.resourceId,
        type: resource.resourceType,
        title: uiElement.mainTitle.title,
        picUrl: uiElement.image.imageUrl
      }
    })

    return {
      title,
      list
    }
  }

  // 热门博客|有声书  HOMEPAGE_VOICELIST_RCMD
  function getRcmdVoiceList(block: any) {
    const data: any = {
      voiceList: [],
      bodcastList: []
    }

    block.creatives.forEach((creative: any) => {
      const creativeType = creative.creativeType
      let target
      if (creativeType === 'VOICE_LIST_HOMEPAGE') {
        target = 'voiceList'
      } else if (creativeType === 'PODCAST_LIST_HOMEPAGE') {
        target = 'bodcastList'
      }
      if (target) {
        const listData = creative.resources.map((resource: any) => {
          const uiElement = resource.uiElement
          return {
            videoInfo: {
              status: false
            },
            payload: resource.resourceId,
            type: resource.resourceType,
            artist: resource.resourceExtInfo?.djProgram?.dj?.nickname,
            title: uiElement.mainTitle.title,
            subTitle: uiElement?.subTitle?.title,
            picUrl: uiElement.image.imageUrl,
            tags: uiElement.labelTexts[0]
          }
        })

        data[target].push(listData)
      }
    })

    return data
  }
  return data
}

export const getActionBtn = (block: any) => {
  return block.map((v: any) => {
    switch (v.id) {
      // 每日推荐 (需要登录)
      case -1:
        v.disabled = true
        // v.func = () => {
        //   uni.navigateTo({ url: '../detail/DetailPlaylist?id=' + data.payload })
        // }
        v.func = () =>
          uni.showToast({
            title: '暂不可用',
            duration: 2000,
            icon: 'none'
          })
        break

      // 私人FM(需要登录)
      case -6:
        v.disabled = true
        v.func = () =>
          uni.showToast({
            title: '暂不可用',
            duration: 2000,
            icon: 'none'
          })
        break

      // 歌单
      case -2:
        v.disabled = false
        v.func = () =>
          uni.navigateTo({
            url: '../explore/playlist'
          })
        break

      // 排行榜
      case -3:
        v.disabled = false
        v.func = () =>
          uni.navigateTo({
            url: '../explore/toplist'
          })
        break

      // 直播
      case 11000:
        v.disabled = true
        v.func = () =>
          uni.showToast({
            title: '暂不可用',
            duration: 2000,
            icon: 'none'
          })
        break

      // 数字专辑
      case 13000:
        v.disabled = true
        v.func = () =>
          uni.showToast({
            title: '暂不可用',
            duration: 2000,
            icon: 'none'
          })
        break

      // 有声书
      case 1025001:
        v.disabled = true
        v.func = () =>
          uni.showToast({
            title: '暂不可用',
            duration: 2000,
            icon: 'none'
          })
        break

      // 关注新歌
      case 1025000:
        v.disabled = true
        v.func = () =>
          uni.showToast({
            title: '暂不可用',
            duration: 2000,
            icon: 'none'
          })
        break

      // 歌房
      case 19000:
        v.disabled = true
        v.func = () =>
          uni.showToast({
            title: '暂不可用',
            duration: 2000,
            icon: 'none'
          })
        break

      // 游戏专区
      case 18000:
        v.disabled = true
        v.func = () =>
          uni.showToast({
            title: '暂不可用',
            duration: 2000,
            icon: 'none'
          })
        break
    }

    return v
  })
  // .filter((v: any) => !v.disabled)
}
