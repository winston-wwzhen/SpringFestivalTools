// pages/toolbox/blessing/index.js
const api = require('../../../api/index')

Page({
  data: {
    receiver: '',
    blessingType: 'spring',
    style: 'classic',
    loading: false,
    blessingResult: '',
    hotTemplates: [
      '龙马精神，马到成功！祝你2026年事事顺利！',
      '马年大吉，愿你像千里马一样奔腾向前，前程似锦！',
      '2026马年，祝你一马当先，马到成功，万事如意！',
      '春风得意马蹄疾，祝你新年事业有成，步步高升！',
      '马年行大运，愿你财源滚滚，阖家幸福！'
    ]
  },

  onLoad() {
  },

  /**
   * 接收人输入
   */
  onReceiverInput(e) {
    this.setData({
      receiver: e.detail.value
    })
  },

  /**
   * 类型选择
   */
  onTypeSelect(e) {
    const type = e.currentTarget.dataset.type
    this.setData({
      blessingType: type
    })
  },

  /**
   * 风格选择
   */
  onStyleSelect(e) {
    const style = e.currentTarget.dataset.style
    this.setData({
      style
    })
  },

  /**
   * 生成祝福语
   */
  async generateBlessing() {
    const { receiver, blessingType, style } = this.data

    this.setData({ loading: true })

    try {
      // 调用后端AI生成
      const result = await api.kinship.calculate({
        type: 'blessing',
        receiver: receiver || '朋友',
        blessingType,
        style
      })

      // 后端直接返回 { blessing: "xxx" } 或在 data 中
      const blessing = result.blessing || result.data?.blessing

      this.setData({
        blessingResult: blessing,
        loading: false
      })
    } catch (error) {
      console.error('生成失败:', error)
      // 使用本地模板
      const localBlessing = this.generateLocalBlessing(receiver, blessingType, style)
      this.setData({
        blessingResult: localBlessing,
        loading: false
      })
    }
  },

  /**
   * 本地生成祝福语
   */
  generateLocalBlessing(receiver, type, style) {
    const name = receiver || '朋友'

    // 祝福语模板
    const templates = {
      spring: {
        classic: [
          `${name}，春节快乐！祝你马年大吉，万事如意！`,
          `${name}，新春大吉！愿你马年行大运，阖家幸福！`,
          `祝${name}春节快乐，马年身体健康，心想事成！`
        ],
        modern: [
          `${name}，2026马年，愿你乘风破浪，勇往直前！`,
          `${name}，新年新气象，愿你马年一路狂飙！`,
          `祝${name}马年给力，牛气冲天，精彩无限！`
        ],
        funny: [
          `${name}，马年到了，愿你像脱缰的野马一样自由！`,
          `${name}，祝你马年发财数到手抽筋，笑到脸抽筋！`,
          `${name}，马年祝你：马上有钱，马上有对象，马上成功！`
        ]
      },
      newyear: {
        classic: [
          `${name}，新年快乐！祝你2026年事事顺心！`,
          `${name}，元旦快乐！愿你新年新气象，万事兴！`,
          `祝${name}新年吉祥，马年腾飞！`
        ],
        modern: [
          `${name}，2026，愿你刷新自己的记录！`,
          `${name}，新年快乐，愿你开启开挂模式！`,
          `祝${name}新年快乐，版本升级到2026至尊版！`
        ],
        funny: [
          `${name}，新年到了，愿你脱单脱贫脱脂！`,
          `${name}，祝你2026年：发财不胖，熬夜不秃！`,
          `${name}，新年快乐，愿你颜值和发量成正比！`
        ]
      },
      wealth: {
        classic: [
          `${name}，祝你财源滚滚，招财进宝！`,
          `${name}，马年大发财，金银满堂！`,
          `祝${name}财源广进，日进斗金！`
        ],
        modern: [
          `${name}，祝你钱包鼓鼓，数钱数到手软！`,
          `${name}，马年暴富，走上人生巅峰！`,
          `祝${name}财务自由，想买就买！`
        ],
        funny: [
          `${name}，祝你钱多得没处放，求你收留我的钱包！`,
          `${name}，马年发财，记得请我吃饭！`,
          `祝${name}成为有钱人，不差钱！`
        ]
      },
      career: {
        classic: [
          `${name}，祝你事业有成，步步高升！`,
          `${name}，马年事业腾飞，前程似锦！`,
          `祝${name}工作顺利，更上一层楼！`
        ],
        modern: [
          `${name}，祝你职场开挂，升职加薪！`,
          `${name}，马年事业C位出道！`,
          `祝${name}事业起飞，出任CEO！`
        ],
        funny: [
          `${name}，祝你不用加班，工资翻倍！`,
          `${name}，马年老板给你发大红包！`,
          `祝${name}摸鱼不被抓，奖金拿到手软！`
        ]
      },
      health: {
        classic: [
          `${name}，祝你身体健康，平安顺遂！`,
          `${name}，马年身体倍棒，吃嘛嘛香！`,
          `祝${name}健康长寿，福寿安康！`
        ],
        modern: [
          `${name}，祝你身体状态满格！`,
          `${name}，马年元气满满，活力四射！`,
          `祝${name}免疫力爆棚，百毒不侵！`
        ],
        funny: [
          `${name}，祝你吃不胖，熬夜不秃！`,
          `${name}，马年愿你狂吃不胖，躺赢人生！`,
          `祝${name}皮肤好好，头发多多！`
        ]
      },
      family: {
        classic: [
          `${name}，祝你阖家幸福，团团圆圆！`,
          `${name}，马年全家福，家和万事兴！`,
          `祝${name}家庭美满，幸福安康！`
        ],
        modern: [
          `${name}，祝你全家C位出道，幸福爆棚！`,
          `${name}，马年家庭团建，快乐无边！`,
          `祝${name}全家up up，幸福满格！`
        ],
        funny: [
          `${name}，祝你全家都是颜值担当！`,
          `${name}，马年全家一起发发发！`,
          `祝${name}家和谐不吵架，钱多多乐哈哈！`
        ]
      }
    }

    const typeTemplates = templates[type] || templates.spring
    const styleTemplates = typeTemplates[style] || typeTemplates.classic
    const randomIndex = Math.floor(Math.random() * styleTemplates.length)

    return styleTemplates[randomIndex]
  },

  /**
   * 复制祝福语
   */
  copyBlessing() {
    const { blessingResult } = this.data
    wx.setClipboardData({
      data: blessingResult,
      success: () => {
        wx.showToast({
          title: '已复制',
          icon: 'success'
        })
      }
    })
  },

  /**
   * 重新生成
   */
  regenerate() {
    this.generateBlessing()
  },

  /**
   * 使用模板
   */
  useTemplate(e) {
    const content = e.currentTarget.dataset.content
    this.setData({
      blessingResult: content
    })
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    return {
      title: '生成你的专属春节祝福语',
      path: '/pages/toolbox/blessing/index'
    }
  }
})
