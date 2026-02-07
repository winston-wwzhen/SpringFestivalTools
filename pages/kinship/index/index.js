// pages/kinship/index/index.js
const api = require('../../../api/index')
const app = getApp()

Page({
  data: {
    input: '',
    result: null,
    loading: false
  },

  onLoad(options) {
    console.log('[KinshipIndex] onLoad, options:', options)
    if (options.keyword) {
      this.setData({ input: options.keyword })
    }
  },

  /**
   * 输入变化
   */
  onInputChange(e) {
    this.setData({ input: e.detail.value })
  },

  /**
   * 计算称呼（调用智谱AI）
   */
  async calculate() {
    const input = this.data.input.trim()

    if (!input) {
      wx.showToast({
        title: '请输入关系描述',
        icon: 'none'
      })
      return
    }

    this.setData({ loading: true })

    try {
      console.log('[KinshipIndex] Calling AI API with input:', input)

      const res = await api.kinship.calculate({ input })
      console.log('[KinshipIndex] AI response:', res)

      if (res.success && res.data) {
        this.setData({
          result: {
            icon: this.getIconByRelation(res.data.result),
            name: res.data.result,
            description: `"${input}" 的称呼是：${res.data.result}`
          },
          loading: false
        })
        wx.vibrateShort()
      } else {
        throw new Error(res.message || '计算失败')
      }
    } catch (error) {
      console.error('[KinshipIndex] Calculate error:', error)

      this.setData({
        result: {
          icon: '❌',
          name: '计算失败',
          description: error.message || '请稍后重试'
        },
        loading: false
      })

      wx.showToast({
        title: error.message || '计算失败，请重试',
        icon: 'none'
      })
    }
  },

  /**
   * 快捷示例
   */
  useExample(e) {
    const example = e.currentTarget.dataset.example
    this.setData({ input: example })
    this.calculate()
  },

  /**
   * 根据称呼获取图标
   */
  getIconByRelation(name) {
    // 使用非人头像的春节主题图标
    if (!name) return '🏮'

    // 长辈 - 灯笼
    if (name.includes('爷') || name.includes('公') || name.includes('父') ||
        name.includes('舅') || name.includes('伯') || name.includes('叔') ||
        name.includes('奶') || name.includes('婆') || name.includes('母') ||
        name.includes('妈') || name.includes('婶') || name.includes('姨')) {
      return '🏮'
    }

    // 同辈 - 烟花
    if (name.includes('哥') || name.includes('兄') || name.includes('姐') || name.includes('妹')) {
      return '🎆'
    }

    // 晚辈 - 红包
    if (name.includes('子') || name.includes('孙') || name.includes('弟') ||
        name.includes('女') || name.includes('媳')) {
      return '🧧'
    }

    return '✨'
  },

  /**
   * 清空输入
   */
  clearInput() {
    this.setData({
      input: '',
      result: null
    })
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    return {
      title: '亲戚称呼计算器 - 智能AI解答',
      path: '/pages/kinship/index/index'
    }
  }
})
