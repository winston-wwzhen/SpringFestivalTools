// pages/toolbox/fortune/index.js
const api = require('../../../api/index')

Page({
  data: {
    name: '',
    birthday: '',
    gender: '',
    currentDate: '',
    loading: false,
    fortuneResult: null
  },

  onLoad() {
    // 设置当前日期
    const now = new Date()
    this.setData({
      currentDate: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    })
  },

  /**
   * 姓名输入
   */
  onNameInput(e) {
    this.setData({
      name: e.detail.value
    })
  },

  /**
   * 生日选择
   */
  onBirthdayChange(e) {
    this.setData({
      birthday: e.detail.value
    })
  },

  /**
   * 性别选择
   */
  onGenderSelect(e) {
    const gender = e.currentTarget.dataset.gender
    this.setData({
      gender
    })
  },

  /**
   * 测算运势
   */
  async calculateFortune() {
    const { name, birthday, gender } = this.data

    // 验证输入
    if (!name) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
      return
    }

    if (!birthday) {
      wx.showToast({
        title: '请选择出生日期',
        icon: 'none'
      })
      return
    }

    if (!gender) {
      wx.showToast({
        title: '请选择性别',
        icon: 'none'
      })
      return
    }

    this.setData({ loading: true })

    try {
      // 调用后端AI接口
      const result = await api.kinship.calculate({
        type: 'fortune',
        name,
        birthday,
        gender
      })

      this.setData({
        fortuneResult: result.data,
        loading: false
      })
    } catch (error) {
      console.error('测算失败:', error)
      // 使用本地算法
      const localResult = this.calculateLocalFortune(name, birthday, gender)
      this.setData({
        fortuneResult: localResult,
        loading: false
      })
      wx.showToast({
        title: '使用本地算法',
        icon: 'none'
      })
    }
  },

  /**
   * 本地运势算法（AI失败时使用）
   */
  calculateLocalFortune(name, birthday, gender) {
    // 基于姓名和生日生成随机但固定的结果
    const seed = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) +
                 new Date(birthday).getTime()

    // 伪随机数生成器
    const random = (seed) => {
      const x = Math.sin(seed) * 10000
      return x - Math.floor(x)
    }

    const r = random(seed)

    // 生成各项运势 (60-95)
    const wealth = Math.floor(60 + random(seed + 1) * 35)
    const career = Math.floor(60 + random(seed + 2) * 35)
    const love = Math.floor(60 + random(seed + 3) * 35)
    const health = Math.floor(60 + random(seed + 4) * 35)

    // 综合星级 (3-5)
    const avg = (wealth + career + love + health) / 4
    const overallStars = avg > 85 ? 5 : avg > 75 ? 4 : 3

    // 幸运元素
    const colors = ['红色', '金色', '紫色', '蓝色', '绿色', '橙色']
    const numbers = ['6', '8', '9', '66', '88', '168']
    const directions = ['东方', '南方', '西方', '北方', '东南', '西南']
    const zodiacs = ['马', '龙', '蛇', '鸡', '鼠', '牛']

    const luckyColor = colors[Math.floor(random(seed + 5) * colors.length)]
    const luckyNumber = numbers[Math.floor(random(seed + 6) * numbers.length)]
    const luckyDirection = directions[Math.floor(random(seed + 7) * directions.length)]
    const luckyZodiac = zodiacs[Math.floor(random(seed + 8) * zodiacs.length)]

    // 运势描述
    const overallDescs = [
      '马年运势大吉，万事如意！',
      '马年运势亨通，事业顺利！',
      '马年运势平稳，稳中求进！',
      '马年运势渐好，把握机遇！'
    ]
    const overallDesc = overallDescs[Math.floor(random(seed + 9) * overallDescs.length)]

    // 新年寄语
    const advices = [
      '2026马年，愿你马到成功，万事如意！',
      '马年大吉，愿你前程似锦，步步高升！',
      '马年行大运，愿你身体健康，阖家幸福！',
      '马年如意，愿你心想事成，财源滚滚！'
    ]
    const advice = advices[Math.floor(random(seed + 10) * advices.length)]

    return {
      name,
      overallStars,
      overfallDesc: overallDesc,
      wealth,
      career,
      love,
      health,
      luckyColor,
      luckyNumber,
      luckyDirection,
      luckyZodiac,
      advice
    }
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    return {
      title: '测算你的2026马年运势',
      path: '/pages/toolbox/fortune/index'
    }
  }
})
