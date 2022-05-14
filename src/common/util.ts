/*
 * @Author: zusheng
 * @Date: 2022-04-24 14:46:24
 * @LastEditTime: 2022-05-11 18:41:47
 * @Description:
 * @FilePath: \uni-preset-vue-vite-ts\src\common\util.ts
 */
import moment from 'moment'

/**
 * 转换时间戳为xx天前
 * @param timeStamp 时间戳
 * @returns 描述
 */
export const timeStampConvert = (timeStamp: number | string): string => {
  return `${moment.duration(timeStamp).days()}天前` ?? '刚刚'
}

/**
 * 时间转换为格式 04:31
 * @param time timeStamp时间戳
 * @returns
 */
export const durationConvert = (time: number | string) => {
  const _moment = moment.duration(time, 'second')
  return `${_moment.minutes() < 10 ? `0${_moment.minutes()}` : _moment.minutes()}:${
    _moment.seconds() < 10 ? `0${_moment.seconds()}` : _moment.seconds()
  }`
}

/**
 * 时间转换为格式 4分钟
 * @param time timeStamp时间戳
 * @returns
 */
export const durationConvertMinutes = (time: number | string) => {
  const _moment = moment.duration(time, 'second')
  return `${_moment.minutes()}分钟`
}

/**
 * 转换播放数量单位为：万
 * @param count 数量
 * @returns 转换后
 */
export const convertCount = (sum: number) => {
  if (sum >= 100000000) {
    return (sum / 100000000).toFixed(2) + '亿'
  } else if (sum >= 10000) {
    return (sum / 10000).toFixed(1) + '万'
  } else {
    return sum
  }
}

/**
 * 提取歌手名字
 * @param artists
 * @param Separator
 */
export const pickUpName = (artists: Array<any>, Separator = '/'): string => {
  // 判断是否是数组
  if (Object.prototype.toString.call(artists) === '[object Array]') {
    return artists.map(n => n.name || n.userName || n).join(Separator)
  } else {
    return ''
  }
}

/**
 * 获取 [min,max]的随机数
 * Math.floor(Math.random()*10) 可均衡获取 0 到 9 的随机整数
 * @param min
 * @param max
 */
export const getRandomIndex = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min) ?? 0
}
