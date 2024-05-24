<template>
  <div id = "outer">
    
    <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
    <!-- <KG_ingredient /> -->
    <!-- <KG_categories /> -->
    <!-- <KG_categories_benefits /> -->
    <!-- <CosmeticList /> -->
    <!-- <div class="page-container"> -->
    <router-view />
    <button @click="downloadAsPNG">下载 PNG 图片</button>

    <!-- </div> -->
  </div>
</template>

<script>
import html2canvas from 'html2canvas'

export default {
  name: 'MyComponent',
  methods: {
    downloadAsPNG() {
      // 获取需要渲染的 DOM 元素
      const element = this.$el

      // 使用 HTML2Canvas 将元素渲染为 Canvas
      html2canvas(element, {
        // 设置透明背景
        backgroundColor: null
      }).then(canvas => {
        // 将 Canvas 转换为 PNG 图片并下载
        const link = document.createElement('a')
        link.download = 'screenshot.png'
        link.href = canvas.toDataURL('image/png')
        link.click()
      })
    }
  }
}
</script>

<style scoped>
</style>