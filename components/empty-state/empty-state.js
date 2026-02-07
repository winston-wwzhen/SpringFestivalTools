// components/empty-state/empty-state.js
Component({
  properties: {
    // 空状态图片
    image: {
      type: String,
      value: ''
    },
    // 标题
    title: {
      type: String,
      value: '暂无数据'
    },
    // 描述
    description: {
      type: String,
      value: ''
    },
    // 是否显示按钮
    showButton: {
      type: Boolean,
      value: false
    },
    // 按钮文字
    buttonText: {
      type: String,
      value: '重新加载'
    }
  },

  methods: {
    onButtonTap() {
      this.triggerEvent('tap')
    }
  }
})
