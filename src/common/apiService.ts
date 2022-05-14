/*
 * @Author: zusheng
 * @Date: 2022-04-24 14:43:26
 * @LastEditTime: 2022-05-13 21:07:03
 * @Description:API服务
 * @FilePath: \uni-preset-vue-vite-ts\src\common\apiService.ts
 */

const baseURL = 'https://music.zusheng.club'

uni.addInterceptor('request', {
  invoke(args) {
    args.url = baseURL + args.url
  }
})

let cookie: any = ''

/**
 *
 * @param url url
 * @param params 参数
 * @param requireCookie 是否手动传递cookie
 * @param noCache 是否在url后添加时间戳，防止缓存
 */
export const get = (
  url: string,
  params: any,
  requireCookie?: boolean,
  noCache?: boolean
): Promise<any> => {
  if (!cookie) cookie = uni.getStorageSync('cookie')

  return new Promise(resolve => {
    const data = params
    if (noCache) data.time = Date.now()
    if (requireCookie && cookie) data.cookie = encodeURIComponent(cookie)

    const uniReq: any = uni.request({
      url,
      data,
      method: 'GET',
      // withCredentials: true,
      sslVerify: true,
      header: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
        // 'Set-Cookie': 'SameSite=None; '
      }
    })

    uniReq
      .then((res: any) => {
        resolve(res.data)
      })
      .catch((err: any) => {
        resolve(err)
      })
  })
}
