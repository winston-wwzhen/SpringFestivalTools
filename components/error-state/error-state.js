// components/error-state/error-state.js
Component({
  properties: {
    // 图标
    icon: {
      type: String,
      value: '⚠️'
    },
    // 标题
    title: {
      type: String,
      value: '加载失败'
    },
    // 描述
    description: {
      type: String,
      value: '网络异常，请检查网络设置后重试'
    },
    // 按钮文字
    buttonText: {
      type: String,
      value: '重新加载'
    }
  },

  methods: {
    onRetry() {
      this.triggerEvent('retry')
    }
  }
})
