<!--
Author: zusheng
Date: 2022-05-10 11:02:19
LastEditTime: 2022-05-15 00:52:07
Description: 评论详情页面
FilePath: \uni-preset-vue-vite-ts\src\pages\detail\comment.vue
-->

<script lang="ts" setup>
import TheNavBar from '@/components/TheNavBar.vue'
import { onLoad, onReachBottom } from '@dcloudio/uni-app'
import { convertCount } from '@/common/util'
import { useStore } from '@/store'
import { reactive } from 'vue'

const store = useStore()
const data = reactive<any>({
  title: '全部评论',
  // 当前页面id
  id: '',
  // 当前页面类型
  // 0: 歌曲
  // 1: mv
  // 2: 歌单
  // 3: 专辑
  // 4: 电台
  // 5: 视频
  // 6: 动态
  type: '',
  // 当前页数
  pageNo: 1,
  // 是否是楼层评论
  floor: 0,
  // 父评论id，在floor=1时才有
  parentCommentId: '',
  // 父评论数据
  ownerComment: {},

  // 评论数据列表
  comment: [],

  // 分类方式列表
  sortTypeList: [],

  // sortTypeList数组的下标
  sortType: 99,

  // 是否还有更多
  more: true,

  // 总数
  total: 0
})

store.setTheme('raw')

onLoad((query: any) => {
  // payload id
  // type 类型
  // floor 是否是楼层评论
  const { payload, type, floor = 0, parentCommentId } = query
  data.id = payload
  data.type = type
  data.floor = Number(floor)
  data.title = data.floor === 0 ? '全部评论' : '回复'
  data.parentCommentId = parentCommentId
  getData()
})

// 获取数据
function getData() {
  uni.showLoading({
    title: '加载中'
  })
  if (data.floor === 0) {
    store
      .getCommentPlaylist({ id: data.id, pageNo: data.pageNo++, sortType: data.sortType })
      .then((res: any) => {
        data.comment = res.data.comments
        data.more = res.data.hasMore
        data.total = res.data.totalCount
        data.sortTypeList = res.data.sortTypeList.map((v: any) => {
          if (v.sortTypeName.indexOf('推荐') > -1) {
            v.sortTypeName = '推荐'
          } else if (v.sortTypeName.indexOf('热度') > -1) {
            v.sortTypeName = '热度'
          } else if (v.sortTypeName.indexOf('时间') > -1) {
            v.sortTypeName = '时间'
          }
          return v
        })

        uni.hideLoading()
      })
  } else {
    store.getCommentFloor(data.parentCommentId, data.id, data.type).then((res: any) => {
      uni.hideLoading()
      data.ownerComment = res.data.ownerComment
      data.more = res.data.hasMore
      data.comment = res.data.comments
      data.total = res.data.totalCount
    })
  }
}

onReachBottom(() => {
  if (data.more) {
    store
      .getCommentPlaylist({ id: data.id, pageNo: data.pageNo++, sortType: 2 })
      .then((res: any) => {
        data.comment.push(...res.data.comments)
        data.more = res.data.hasMore
      })
  }
})

// 改变排序方式
function sortTypeChange(sortType: number) {
  data.sortType = sortType
  data.pageNo = 1
  data.more = true
  getData()
}

// 点赞评论
function commentLike(t: boolean, cid: number, idx: number) {
  const likeT = t ? 1 : 0
  store.getCommentLike(data.id, cid, likeT, data.type).then((res: any) => {
    if (res.code === 200) {
      data.comment[idx].liked = !data.comment[idx].liked
    } else {
      uni.showToast({
        title: '出了点问题'
      })
    }
  })
}

// 显示更多parentCommentId: number
function toMore(item: any) {
  uni.navigateTo({
    url: `./comment?payload=${data.id}&type=2&floor=1&parentCommentId=${item.commentId}`
  })
}

// 点击跳转到作者详情页
function toArtistDetail(id: number) {
  uni.navigateTo({
    url: `./artist?payload=${id}&type=user`
  })
}

// 长按复制评论
function copy(content: string) {
  uni.setClipboardData({
    data: content,
    success: function () {}
  })
}
</script>

<template>
  <page-meta :page-style="store.getPageMetaStyle" />

  <the-nav-bar
    :back="true"
    :title="`${data.title}（${convertCount(data.total)}）`"
    :filter="false"
    :bg="true"
  />

  <view class="detail-comment fixed-top">
    <!-- ↓ 父评论 -->
    <template v-if="data.ownerComment?.commentId">
      <view
        class="detail-comment-list-item owner-comment"
        v-for="(commentItem, commentIdx) in [data.ownerComment]"
        :key="commentItem.commentId"
      >
        <image
          class="detail-comment-list-item__image"
          :src="`${commentItem.user.avatarUrl}?param=50y50`"
          mode="aspectFit"
        />
        <!-- ↓ 评论内容块 -->
        <view class="detail-comment-list-item__content">
          <!-- ↓ 用户信息 -->
          <view class="detail-comment-list-item__content-info">
            <!-- ↓ 用户名和发布时间 -->
            <view class="detail-comment-list-item__content-info-user">
              <view class="detail-comment-list-item__content-info-user__name">
                {{ commentItem.user.nickname }}
              </view>
              <view class="detail-comment-list-item__content-info-user__time">
                {{ commentItem.timeStr }}
              </view>
            </view>
            <!-- ↓ 点赞 -->
            <view
              class="detail-comment-list-item__content-info-like"
              @tap="commentLike(!commentItem.liked, commentItem.commentId, commentIdx)"
            >
              <text class="content-info-like-text">{{ convertCount(commentItem.likedCount) }}</text>
              <view
                :class="`content-info-like-icon ${commentItem.liked ? 'like-icon-checked' : ''}`"
              />
            </view>
          </view>
          <!-- ↓ 评论内容 -->
          <view class="detail-comment-list-item__content-main">
            <text>{{ commentItem.content }}</text>
          </view>
          <view
            @tap="toMore(commentItem)"
            class="detail-comment-list-item__content-more"
            v-if="commentItem.replyCount > 0"
          >
            <!-- → 查看更多 -->
            {{ convertCount(commentItem.replyCount) }}条回复 <view class="content-more-icon" />
          </view>
        </view>
      </view>
    </template>

    <!-- ↓ 排序方式 -->
    <view v-if="data.floor === 0" class="detail-comment-sort-type">
      <view class="detail-comment-sort-type__title">评论区</view>
      <view class="detail-comment-sort-type__list">
        <view
          @tap="sortTypeChange(sortItem.sortType)"
          :class="`detail-comment-sort-type__list-item ${
            data.sortType === sortItem.sortType ? 'sort-type-checked' : ''
          }`"
          v-for="sortItem in data.sortTypeList"
          :key="sortItem.sortType"
        >
          {{ sortItem.sortTypeName }}
        </view>
      </view>
    </view>

    <view v-else class="detail-comment-sort-type">
      <view class="detail-comment-sort-type__title">全部回复</view>
    </view>

    <!-- ↓ 评论区 -->
    <view
      class="detail-comment-list-item"
      @longpress.stop.prevent="copy(commentItem.content)"
      v-for="(commentItem, commentIdx) in data.comment"
      :key="commentItem.commentId"
    >
      <image
        @tap="toArtistDetail(commentItem.user.userId)"
        class="detail-comment-list-item__image"
        :src="`${commentItem.user.avatarUrl}?param=50y50`"
        mode="aspectFit"
      />

      <!-- ↓ 评论内容块 -->
      <view class="detail-comment-list-item__content">
        <!-- ↓ 用户信息 -->
        <view class="detail-comment-list-item__content-info">
          <!-- ↓ 用户名和发布时间 -->
          <view
            class="detail-comment-list-item__content-info-user"
            @tap="toArtistDetail(commentItem.user.userId)"
          >
            <view class="detail-comment-list-item__content-info-user__name">
              {{ commentItem.user.nickname }}
            </view>
            <view class="detail-comment-list-item__content-info-user__time">
              {{ commentItem.timeStr }}
            </view>
          </view>
          <!-- ↓ 点赞 -->
          <view
            class="detail-comment-list-item__content-info-like"
            @tap="commentLike(!commentItem.liked, commentItem.commentId, commentIdx)"
          >
            <text class="content-info-like-text">{{ convertCount(commentItem.likedCount) }}</text>
            <view
              :class="`content-info-like-icon ${commentItem.liked ? 'like-icon-checked' : ''}`"
            />
          </view>
        </view>

        <!-- ↓ 评论内容 -->
        <view class="detail-comment-list-item__content-main">
          <text>{{ commentItem.content }}</text>
        </view>

        <view
          @tap="toMore(commentItem)"
          class="detail-comment-list-item__content-more"
          v-if="commentItem.replyCount > 0"
        >
          <!-- → 查看更多 -->
          {{ convertCount(commentItem.replyCount) }}条回复 <view class="content-more-icon" />
        </view>
      </view>
    </view>

    <!-- ↓ 加载更多 -->
    <view class="detail-comment-loading">{{ data.more ? '正在加载...' : '没有更多啦' }}</view>
  </view>
</template>

<style lang="less" scoped>
.detail-comment {
  width: 100%;
  min-height: 100vh;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  box-sizing: border-box;

  //   排序方式
  .detail-comment-sort-type {
    position: sticky;
    top: calc(var(--status-bar-height) + var(--nav-tab-height-custom));
    height: 75.6rpx;
    width: 100%;
    padding: 0 30.7rpx;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    z-index: 2;

    .detail-comment-sort-type__title {
      height: 75.6rpx;
      line-height: 75.6rpx;
      font-size: 26rpx;
      font-weight: 600;
    }
    .detail-comment-sort-type__list {
      height: 100%;
      display: flex;
      align-items: center;
      margin: 0 -22.4rpx;
      // 选中样式
      .sort-type-checked {
        color: #000 !important;
      }
      .detail-comment-sort-type__list-item {
        font-size: 26rpx;
        font-weight: 600;
        padding: 0 22.4rpx;
        color: #9a9a9a;

        &:not(:first-child):not(:last-child) {
          border-left: 1px solid #e6e6e6;
          border-right: 1px solid #e6e6e6;
        }
      }
    }
  }

  // 父评论
  .owner-comment {
    border-bottom: 16rpx solid rgb(242, 242, 242) !important;
    .detail-comment-list-item__content {
      border: none !important;
    }
  }

  .detail-comment-list-item {
    width: 100vw;
    padding: 30.7rpx 30.7rpx 0;
    box-sizing: border-box;
    display: flex;

    .detail-comment-list-item__image {
      height: 68rpx;
      width: 68rpx;
      margin-right: 18rpx;
      flex-shrink: 0;
      border-radius: 50%;
    }

    .detail-comment-list-item__content {
      height: 100%;
      min-height: 68rpx;
      width: calc(100vw - 60rpx - 86rpx);
      padding-bottom: 30.7rpx;
      border-bottom: 1px solid rgb(232, 232, 232);

      //  row1
      .detail-comment-list-item__content-info {
        display: flex;
        width: 100%;
        justify-content: space-between;

        .detail-comment-list-item__content-info-user__name {
          font-size: 24rpx;
          color: rgb(99, 99, 100);
          line-height: 1;
        }
        .detail-comment-list-item__content-info-user__time {
          margin-top: 16rpx;
          font-size: 20rpx;
          color: rgb(155, 155, 156);
          line-height: 1;
        }

        // 点赞
        .detail-comment-list-item__content-info-like {
          display: flex;
          align-items: center;
          color: rgb(151, 151, 152);
          font-size: 18rpx;
          .content-info-like-text {
            padding-top: 8rpx;
          }
          .content-info-like-icon {
            height: 100%;
            width: 57rpx;
            background: rgb(151, 151, 152);
            mask-image: url('@/static/ey7.png');
            mask-position: center;
            mask-repeat: no-repeat;
            mask-size: 100% auto;
          }
          .like-icon-checked {
            background: #ff3a3a;
            mask-image: url('@/static/ey9.png');
          }
        }
      }

      //  row2
      .detail-comment-list-item__content-main {
        margin-top: calc(27rpx - 29.5rpx / 1.5 / 2);
        font-size: 29.5rpx;
        color: rgb(51, 51, 52);
        line-height: 1.5;
        width: calc(100vw - 60rpx - 86rpx);
        padding-right: 30.7rpx;
        box-sizing: border-box;
        word-wrap: break-word;
      }

      // row3
      .detail-comment-list-item__content-more {
        font-size: 23.4rpx;
        line-height: 1;
        margin-top: 19.2rpx;
        color: rgb(91, 124, 155);
        display: flex;
        align-items: center;

        .content-more-icon {
          width: 23.4rpx;
          height: 23.4rpx;
          background-color: rgb(91, 124, 155);
          mask-image: url('@/static/icon-arrow-right.png');
          mask-position: center;
          mask-repeat: no-repeat;
          mask-size: auto 80%;
          margin-left: 4rpx;
        }
      }
    }
  }

  .detail-comment-loading {
    text-align: center;
    padding: 30.7rpx;
    box-sizing: border-box;
    width: 100%;
    font-size: 24rpx;
    color: rgba(0, 0, 0, 0.5);
  }
}
</style>

