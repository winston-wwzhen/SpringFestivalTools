// pages/toolbox/fortune/index.js
const api = require('../../../api/index')
const logger = require('../../../utils/logger')

Page({
  data: {
    keyword: '',
    drawing: false,
    loading: false,
    fortuneResult: null
  },

  onLoad() {
  },

  /**
   * 关键字选择
   */
  onKeywordSelect(e) {
    const keyword = e.currentTarget.dataset.keyword
    // 如果点击已选中的，则取消选择
    this.setData({
      keyword: this.data.keyword === keyword ? '' : keyword
    })
  },

  /**
   * 抽签获取运势
   */
  async drawFortune() {
    this.setData({ drawing: true })

    // 播放动画1.5秒
    await new Promise(resolve => setTimeout(resolve, 1500))

    try {
      // 调用后端接口
      const result = await api.kinship.calculate({
        type: 'fortune',
        keyword: this.data.keyword
      })

      // 处理结果，添加签文等级
      const fortune = result.data || result
      fortune.rank = this.getFortuneRank(fortune.overallStars)
      fortune.rankClass = this.getRankClass(fortune.overallStars)

      this.setData({
        fortuneResult: fortune,
        drawing: false,
        loading: false
      })

      wx.vibrateShort()
    } catch (error) {
      logger.error('测算失败:', error)
      // 使用本地算法
      const localResult = this.calculateLocalFortune(this.data.keyword)
      this.setData({
        fortuneResult: localResult,
        drawing: false,
        loading: false
      })
      wx.vibrateShort()
    }
  },

  /**
   * 根据星级获取签文等级
   */
  getFortuneRank(stars) {
    const ranks = {
      5: '上上签',
      4: '中吉签',
      3: '吉签'
    }
    return ranks[stars] || '吉签'
  },

  /**
   * 获取签文等级样式类
   */
  getRankClass(stars) {
    const classes = {
      5: 'rank-excellent',
      4: 'rank-good',
      3: 'rank-normal'
    }
    return classes[stars] || 'rank-normal'
  },

  /**
   * 本地运势算法（接口失败时使用）
   */
  calculateLocalFortune(keyword) {
    // 生成随机种子
    const seed = Date.now() + Math.random() * 10000

    // 伪随机数生成器
    const random = (seed) => {
      const x = Math.sin(seed) * 10000
      return x - Math.floor(x)
    }

    // 根据关键字调整基础运势值
    let keywordBonus = { wealth: 0, career: 0, love: 0, health: 0 }
    if (keyword) {
      const bonuses = {
        love: { love: 15 },
        career: { career: 15 },
        wealth: { wealth: 15 },
        health: { health: 15 },
        study: { career: 10 },
        family: { love: 10, health: 5 }
      }
      keywordBonus = bonuses[keyword] || {}
    }

    // 生成各项运势 (60-95)
    const wealth = Math.min(95, Math.floor(60 + random(seed + 1) * 35 + keywordBonus.wealth))
    const career = Math.min(95, Math.floor(60 + random(seed + 2) * 35 + keywordBonus.career))
    const love = Math.min(95, Math.floor(60 + random(seed + 3) * 35 + keywordBonus.love))
    const health = Math.min(95, Math.floor(60 + random(seed + 4) * 35 + keywordBonus.health))

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
      '马年运势渐好，把握机遇！',
      '马年一帆风顺，前程似锦！'
    ]
    const overallDesc = overallDescs[Math.floor(random(seed + 9) * overallDescs.length)]

    // 新年寄语（根据关键字定制）
    let advice
    if (keyword === 'love') {
      const loveAdvices = [
        '2026马年，愿你桃花朵朵开，遇见真爱，甜甜蜜蜜！',
        '马年爱情运势旺，愿你脱单成功，幸福美满！',
        '新春祝福，愿你与爱人情深意浓，白头偕老！'
      ]
      advice = loveAdvices[Math.floor(random(seed + 10) * loveAdvices.length)]
    } else if (keyword === 'career') {
      const careerAdvices = [
        '2026马年，愿你职场如骏马奔腾，升职加薪！',
        '马年事业运势佳，愿你步步高升，前程似锦！',
        '新春大吉，愿你工作顺利，大展宏图！'
      ]
      advice = careerAdvices[Math.floor(random(seed + 10) * careerAdvices.length)]
    } else if (keyword === 'wealth') {
      const wealthAdvices = [
        '2026马年，愿你财源滚滚，钱包鼓鼓！',
        '马年财运亨通，愿你日进斗金，发大财！',
        '新春恭喜发财，愿你金银满屋，富贵有余！'
      ]
      advice = wealthAdvices[Math.floor(random(seed + 10) * wealthAdvices.length)]
    } else if (keyword === 'health') {
      const healthAdvices = [
        '2026马年，愿你身体健康，百病不侵！',
        '马年健康运势佳，愿你活力满满，精神焕发！',
        '新春安康，愿你平安喜乐，福寿双全！'
      ]
      advice = healthAdvices[Math.floor(random(seed + 10) * healthAdvices.length)]
    } else if (keyword === 'study') {
      const studyAdvices = [
        '2026马年，愿你学业有成，金榜题名！',
        '马年学习运佳，愿你聪明伶俐，考试满分！',
        '新春学业进步，愿你才华横溢，前程无量！'
      ]
      advice = studyAdvices[Math.floor(random(seed + 10) * studyAdvices.length)]
    } else if (keyword === 'family') {
      const familyAdvices = [
        '2026马年，愿你阖家欢乐，团团圆圆！',
        '马年家庭运势旺，愿你家和万事兴，幸福美满！',
        '新春阖家安康，愿你亲人平安，其乐融融！'
      ]
      advice = familyAdvices[Math.floor(random(seed + 10) * familyAdvices.length)]
    } else {
      const advices = [
        '2026马年，愿你马到成功，万事如意！',
        '马年大吉，愿你前程似锦，步步高升！',
        '马年行大运，愿你身体健康，阖家幸福！',
        '马年如意，愿你心想事成，财源滚滚！',
        '新春大吉，愿你福星高照，好运连连！'
      ]
      advice = advices[Math.floor(random(seed + 10) * advices.length)]
    }

    const fortune = {
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
      advice,
      rank: this.getFortuneRank(overallStars),
      rankClass: this.getRankClass(overallStars)
    }

    return fortune
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
