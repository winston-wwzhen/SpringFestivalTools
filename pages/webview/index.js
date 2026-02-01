// pages/webview/index.js
Page({
  data: {
    url: ''
  },

  onLoad(options) {
    // 获取传入的URL
    const { url } = options
    if (url) {
      this.setData({
        url: decodeURIComponent(url)
      })
    }
  },

  handleMessage(e) {
    // 处理 web-view 发送的消息
    console.log('收到消息:', e.detail.data)
  }
})
