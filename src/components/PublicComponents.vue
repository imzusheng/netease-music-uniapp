<!--
Author: zusheng
Date: 2022-04-27 10:30:46
LastEditTime: 2022-05-12 12:04:05
Description: 引入所有全局组件
FilePath: \uni-preset-vue-vite-ts\src\components\PublicComponents.vue
-->

<script lang="ts" setup>
const props = defineProps<{
  // popup类型，决定弹出的模板
  type?: string

  // 弹窗是否显示
  popupDisplay?: boolean

  // 全局遮罩是否显示
  maskDisplay?: boolean

  // popup数据
  popupData?: any

  // 底部是否显示
  player?: boolean
}>()
</script>

<template>
  <!-- ↓ 公共组件 -->

  <!-- ↑ 公共组件 -->
</template>

<style lang="less"></style>
