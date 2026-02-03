// 新年模拟器剧本数据
const scripts = {
  career: {
    id: 'career',
    name: '事业精英',
    icon: '💼',
    desc: '专注职场发展，冲刺事业高峰',
    baseStats: { wealth: 50, career: 70, love: 40, health: 60, happiness: 50 },
    events: [
      {
        month: 1,
        title: '新年新机遇',
        content: '年初，公司宣布启动一个重要项目，正在招募核心成员。这是一个展现能力的绝佳机会，但工作压力会很大。',
        options: [
          { text: '主动请缨加入', stats: { career: 15, health: -5, happiness: 5 } },
          { text: '观望一下再说', stats: { career: 5, happiness: -5 } },
          { text: '推荐同事参加', stats: { happiness: 10, career: -5 } }
        ]
      },
      {
        month: 2,
        title: '春节加班',
        content: '项目进度紧张，春节期间需要加班赶工。家人希望你能回家团聚。',
        options: [
          { text: '留下加班', stats: { career: 20, wealth: 10, happiness: -10, love: -15 } },
          { text: '回家过年', stats: { happiness: 15, love: 10, career: -10 } },
          { text: '远程办公', stats: { career: 5, health: -5, happiness: 5 } }
        ]
      },
      {
        month: 3,
        title: '领导赏识',
        content: '你的工作表现得到了领导的高度认可，暗示有晋升的机会。',
        options: [
          { text: '表达感谢并争取', stats: { career: 15, happiness: 10 } },
          { text: '谦虚低调', stats: { career: 5, happiness: 5 } },
          { text: '与同事分享功劳', stats: { happiness: 15, career: 5 } }
        ]
      },
      {
        month: 4,
        title: '工作冲突',
        content: '与同事在工作方案上产生分歧，双方各执己见，气氛紧张。',
        options: [
          { text: '坚持己见', stats: { career: 10, happiness: -10 } },
          { text: '寻求妥协', stats: { happiness: 10, career: 5 } },
          { text: '向上级汇报', stats: { career: -5, happiness: -5 } }
        ]
      },
      {
        month: 5,
        title: '跳槽机会',
        content: '猎头联系你，有一家竞争对手公司开出更高的薪资邀请你加入。',
        options: [
          { text: '接受 offer', stats: { wealth: 20, career: 10, happiness: -10 } },
          { text: '拒绝并留在原公司', stats: { career: 10, happiness: 10 } },
          { text: '与原公司谈加薪', stats: { wealth: 15, career: 5 } }
        ]
      },
      {
        month: 6,
        title: '年中考核',
        content: '年中绩效考核到来，这决定了下半年的发展机会。',
        options: [
          { text: '全力以赴准备', stats: { career: 15, health: -10 } },
          { text: '正常发挥', stats: { career: 5, happiness: 5 } },
          { text: '寻求同事帮助', stats: { career: 10, happiness: 10 } }
        ]
      },
      {
        month: 7,
        title: '团建活动',
        content: '公司组织团建活动，是增进同事关系的好机会。',
        options: [
          { text: '积极参加', stats: { happiness: 15, career: 5 } },
          { text: '找借口不参加', stats: { happiness: -5 } },
          { text: '组织活动', stats: { career: 15, happiness: 10, health: -5 } }
        ]
      },
      {
        month: 8,
        title: '新技能学习',
        content: '公司组织新技术培训，学习会让工作更高效，但需要占用休息时间。',
        options: [
          { text: '认真学习', stats: { career: 20, health: -10, happiness: -5 } },
          { text: '简单了解', stats: { career: 5 } },
          { text: '放弃学习', stats: { happiness: 5, career: -10 } }
        ]
      },
      {
        month: 9,
        title: '项目成功',
        content: '经过大半年的努力，你负责的项目取得了巨大成功，公司准备庆功。',
        options: [
          { text: '享受荣耀', stats: { career: 20, happiness: 20 } },
          { text: '低调处理', stats: { career: 10, happiness: 5 } },
          { text: '感谢团队', stats: { happiness: 25, career: 15 } }
        ]
      },
      {
        month: 10,
        title: '升职机会',
        content: '部门经理职位空缺，你被列为候选人之一。',
        options: [
          { text: '全力争取', stats: { career: 25, health: -10, happiness: -10 } },
          { text: '顺其自然', stats: { career: 10, happiness: 5 } },
          { text: '支持同事', stats: { happiness: 20, career: -5 } }
        ]
      },
      {
        month: 11,
        title: '年终压力',
        content: '年底工作压力巨大，多个项目并行，身体开始发出警报。',
        options: [
          { text: '坚持工作', stats: { career: 20, health: -20, happiness: -10 } },
          { text: '适当休息', stats: { health: 15, happiness: 10, career: -10 } },
          { text: '寻求帮助', stats: { career: 5, happiness: 10, health: 10 } }
        ]
      },
      {
        month: 12,
        title: '年终总结',
        content: '一年的工作即将结束，公司举办年会庆祝，你获得了"优秀员工"奖项！',
        options: [
          { text: '发表获奖感言', stats: { career: 20, happiness: 20 } },
          { text: '谦逊接受', stats: { career: 10, happiness: 10 } },
          { text: '庆祝一下', stats: { happiness: 25, health: -5, wealth: -10 } }
        ]
      }
    ]
  },

  love: {
    id: 'love',
    name: '浪漫情缘',
    icon: '💕',
    desc: '寻找真爱，体验甜蜜恋爱',
    baseStats: { wealth: 50, career: 50, love: 30, health: 60, happiness: 60 },
    events: [
      {
        month: 1,
        title: '新年邂逅',
        content: '在朋友的聚会上，你遇到了一个很合眼的人，你们聊得很开心。',
        options: [
          { text: '主动要联系方式', stats: { love: 20, happiness: 10 } },
          { text: '等待对方主动', stats: { love: 5 } },
          { text: '保持距离', stats: { love: -5, happiness: -5 } }
        ]
      },
      {
        month: 2,
        title: '情人节',
        content: '情人节快到了，你和TA刚开始接触，不知道要不要送礼物。',
        options: [
          { text: '精心准备礼物', stats: { love: 20, wealth: -10, happiness: 15 } },
          { text: '简单表示', stats: { love: 10, wealth: -5 } },
          { text: '保持朋友关系', stats: { love: -10, happiness: -5 } }
        ]
      },
      {
        month: 3,
        title: '初次约会',
        content: 'TA约你周末一起看电影，这是第一次正式约会！',
        options: [
          { text: '精心打扮前往', stats: { love: 15, happiness: 15, wealth: -10 } },
          { text: '自然前往', stats: { love: 10, happiness: 10 } },
          { text: '委婉拒绝', stats: { love: -20, happiness: -10 } }
        ]
      },
      {
        month: 4,
        title: '确定关系',
        content: '经过几个月的相处，TA暗示想要确定关系。你内心也有好感。',
        options: [
          { text: '欣然同意', stats: { love: 30, happiness: 25 } },
          { text: '需要时间考虑', stats: { love: 5, happiness: -5 } },
          { text: '婉转拒绝', stats: { love: -25, happiness: -15 } }
        ]
      },
      {
        month: 5,
        title: '见家长',
        content: '恋爱稳定后，TA提出想带你回家见父母。',
        options: [
          { text: '愉快答应', stats: { love: 20, happiness: 15 } },
          { text: '有些紧张但同意', stats: { love: 10, happiness: 5 } },
          { text: '觉得太快了', stats: { love: -10, happiness: -5 } }
        ]
      },
      {
        month: 6,
        title: '小矛盾',
        content: '因为一件小事，你和TA发生了争吵，气氛有些尴尬。',
        options: [
          { text: '主动道歉', stats: { love: 15, happiness: 10 } },
          { text: '等待对方道歉', stats: { love: -10, happiness: -10 } },
          { text: '冷静沟通', stats: { love: 20, happiness: 15 } }
        ]
      },
      {
        month: 7,
        title: '甜蜜时光',
        content: '你们的关系越来越好，开始计划一起旅行。',
        options: [
          { text: '精心策划旅行', stats: { love: 25, happiness: 25, wealth: -20 } },
          { text: '简单安排', stats: { love: 15, happiness: 15, wealth: -10 } },
          { text: '暂时取消', stats: { love: -15, happiness: -10 } }
        ]
      },
      {
        month: 8,
        title: '未来规划',
        content: '聊起未来，TA问你对这段感情的规划。',
        options: [
          { text: '表达长远想法', stats: { love: 25, happiness: 20 } },
          { text: '顺其自然', stats: { love: 5, happiness: 5 } },
          { text: '转移话题', stats: { love: -15, happiness: -10 } }
        ]
      },
      {
        month: 9,
        title: '同居话题',
        content: 'TA提出想要同居，这标志着关系的进一步发展。',
        options: [
          { text: '欣然同意', stats: { love: 30, happiness: 25, wealth: -10 } },
          { text: '需要考虑', stats: { love: 10, happiness: 5 } },
          { text: '暂时不想', stats: { love: -15, happiness: -5 } }
        ]
      },
      {
        month: 10,
        title: '意外惊喜',
        content: 'TA为你准备了一个惊喜生日派对，邀请了所有好朋友。',
        options: [
          { text: '感动接受', stats: { love: 25, happiness: 30 } },
          { text: '有些害羞', stats: { love: 15, happiness: 20 } },
          { text: '觉得太隆重', stats: { love: 5, happiness: 10 } }
        ]
      },
      {
        month: 11,
        title: '求婚准备',
        content: '你开始策划求婚，想要给TA一个难忘的回忆。',
        options: [
          { text: '精心准备惊喜', stats: { love: 30, happiness: 30, wealth: -20 } },
          { text: '简单浪漫', stats: { love: 20, happiness: 20, wealth: -10 } },
          { text: '暂时不求婚', stats: { love: 5, happiness: 5 } }
        ]
      },
      {
        month: 12,
        title: '幸福终点',
        content: '在跨年夜的烟花下，你成功求婚！TA含泪答应了。2026是幸福的一年！',
        options: [
          { text: '拥抱庆祝', stats: { love: 40, happiness: 40 } },
          { text: '感动落泪', stats: { love: 35, happiness: 35 } },
          { text: '默默珍惜', stats: { love: 30, happiness: 30 } }
        ]
      }
    ]
  },

  wealth: {
    id: 'wealth',
    name: '财富梦想',
    icon: '💰',
    desc: '创业投资，追求财务自由',
    baseStats: { wealth: 40, career: 50, love: 40, health: 60, happiness: 50 },
    events: [
      {
        month: 1,
        title: '创业想法',
        content: '新年伊始，你有了一个创业的想法，但需要投入大量积蓄。',
        options: [
          { text: '果断启动', stats: { wealth: -30, career: 20, happiness: 15 } },
          { text: '先做市场调研', stats: { career: 10, wealth: -5 } },
          { text: '暂时放弃', stats: { happiness: -10 } }
        ]
      },
      {
        month: 2,
        title: '寻找合伙人',
        content: '创业需要团队，你开始寻找合适的合伙人。',
        options: [
          { text: '邀请朋友加入', stats: { career: 15, happiness: 15, wealth: -10 } },
          { text: '独自创业', stats: { career: 10, happiness: 5 } },
          { text: '寻找投资人', stats: { wealth: 20, career: 10 } }
        ]
      },
      {
        month: 3,
        title: '产品开发',
        content: '产品进入开发阶段，需要在质量和速度间做选择。',
        options: [
          { text: '追求完美', stats: { career: 15, wealth: -15, health: -10 } },
          { text: '快速迭代', stats: { career: 10, wealth: -10 } },
          { text: '平衡发展', stats: { career: 10, happiness: 10 } }
        ]
      },
      {
        month: 4,
        title: '资金紧张',
        content: '创业初期资金紧张，需要想办法渡过难关。',
        options: [
          { text: '追加投资', stats: { wealth: -25, career: 15 } },
          { text: '寻找贷款', stats: { wealth: 15, career: 10, happiness: -10 } },
          { text: '精打细算', stats: { happiness: -5, health: -5 } }
        ]
      },
      {
        month: 5,
        title: '产品发布',
        content: '产品终于发布，市场反应如何还未知晓。',
        options: [
          { text: '大力宣传', stats: { wealth: -20, career: 20 } },
          { text: '自然增长', stats: { career: 10 } },
          { text: '收集反馈', stats: { career: 15, happiness: 10 } }
        ]
      },
      {
        month: 6,
        title: '首批客户',
        content: '终于迎来了第一批付费客户，虽然不多，但意义重大！',
        options: [
          { text: '用心服务', stats: { wealth: 15, career: 20, happiness: 20 } },
          { text: '扩大宣传', stats: { wealth: 20, career: 15, health: -10 } },
          { text: '改进产品', stats: { career: 20, wealth: -10 } }
        ]
      },
      {
        month: 7,
        title: '竞争压力',
        content: '竞争对手出现，他们有更多资源和经验。',
        options: [
          { text: '正面竞争', stats: { career: 20, wealth: -15, health: -10 } },
          { text: '差异化定位', stats: { career: 15, happiness: 10 } },
          { text: '寻求合作', stats: { career: 10, happiness: 15 } }
        ]
      },
      {
        month: 8,
        title: '投资机会',
        content: '有人看好你的项目，提出投资意向。',
        options: [
          { text: '接受投资', stats: { wealth: 40, career: 25, happiness: 20 } },
          { text: '犹豫观望', stats: { wealth: 10, career: 10 } },
          { text: '拒绝投资', stats: { happiness: 10, career: -10 } }
        ]
      },
      {
        month: 9,
        title: '团队扩张',
        content: '业务发展顺利，需要扩大团队规模。',
        options: [
          { text: '快速招人', stats: { career: 20, wealth: -20 } },
          { text: '谨慎扩张', stats: { career: 15, wealth: -10 } },
          { text: '保持现状', stats: { career: 5, happiness: -5 } }
        ]
      },
      {
        month: 10,
        title: '盈利突破',
        content: '经过大半年努力，公司终于实现盈利！',
        options: [
          { text: '庆祝一番', stats: { happiness: 25, wealth: -10, health: 5 } },
          { text: '再接再厉', stats: { career: 20, wealth: 20 } },
          { text: '分享利润', stats: { happiness: 30, career: 15 } }
        ]
      },
      {
        month: 11,
        title: '新的挑战',
        content: '成功引来新的挑战，需要应对更复杂的市场环境。',
        options: [
          { text: '勇敢面对', stats: { career: 25, wealth: 15, health: -15 } },
          { text: '稳中求进', stats: { career: 15, wealth: 10 } },
          { text: '寻求帮助', stats: { career: 10, happiness: 15 } }
        ]
      },
      {
        month: 12,
        title: '年终盘点',
        content: '一年创业结束，你实现了财务自由的初步目标！2026是丰收的一年！',
        options: [
          { text: '规划未来', stats: { wealth: 30, career: 25, happiness: 25 } },
          { text: '享受成果', stats: { happiness: 35, health: 10 } },
          { text: '回馈社会', stats: { happiness: 40, wealth: -20 } }
        ]
      }
    ]
  },

  health: {
    id: 'health',
    name: '健康达人',
    icon: '🏃',
    desc: '关注健康，养成良好习惯',
    baseStats: { wealth: 50, career: 50, love: 50, health: 40, happiness: 60 },
    events: [
      {
        month: 1,
        title: '健康计划',
        content: '新年新开始，你决定制定一个健康计划，改善身体状况。',
        options: [
          { text: '严格计划', stats: { health: 25, happiness: 10 } },
          { text: '适度计划', stats: { health: 15, happiness: 15 } },
          { text: '随性而为', stats: { health: 5, happiness: 10 } }
        ]
      },
      {
        month: 2,
        title: '春节饮食',
        content: '春节期间美食诱惑很多，需要控制饮食。',
        options: [
          { text: '严格控制', stats: { health: 20, happiness: -10 } },
          { text: '适度享受', stats: { health: 10, happiness: 15 } },
          { text: '尽情享受', stats: { health: -15, happiness: 25 } }
        ]
      },
      {
        month: 3,
        title: '运动习惯',
        content: '开始养成运动习惯，每天坚持锻炼。',
        options: [
          { text: '高强度训练', stats: { health: 25, happiness: 5 } },
          { text: '适中运动', stats: { health: 20, happiness: 15 } },
          { text: '轻松运动', stats: { health: 10, happiness: 20 } }
        ]
      },
      {
        month: 4,
        title: '体检报告',
        content: '年度体检结果显示健康状况有所改善，但仍有提升空间。',
        options: [
          { text: '制定改善计划', stats: { health: 25, happiness: 10 } },
          { text: '保持现状', stats: { health: 10, happiness: 15 } },
          { text: '不太在意', stats: { health: -10, happiness: 5 } }
        ]
      },
      {
        month: 5,
        title: '户外活动',
        content: '天气转暖，适合户外运动，朋友邀请你一起去爬山。',
        options: [
          { text: '欣然前往', stats: { health: 20, happiness: 20 } },
          { text: '犹豫后同意', stats: { health: 15, happiness: 15 } },
          { text: '委婉拒绝', stats: { happiness: -10 } }
        ]
      },
      {
        month: 6,
        title: '睡眠问题',
        content: '工作压力导致睡眠质量下降，需要调整作息。',
        options: [
          { text: '严格调整', stats: { health: 20, career: -10 } },
          { text: '逐步改善', stats: { health: 15, happiness: 10 } },
          { text: '顺其自然', stats: { health: -5 } }
        ]
      },
      {
        month: 7,
        title: '饮食调整',
        content: '夏天到了，开始注意饮食健康，多吃蔬菜水果。',
        options: [
          { text: '坚持健康饮食', stats: { health: 25, wealth: -10 } },
          { text: '适度调整', stats: { health: 15, happiness: 10 } },
          { text: '偶尔放纵', stats: { health: 5, happiness: 20 } }
        ]
      },
      {
        month: 8,
        title: '运动瓶颈',
        content: '进入运动瓶颈期，效果不如之前明显，有些灰心。',
        options: [
          { text: '调整训练计划', stats: { health: 20, happiness: 15 } },
          { text: '降低强度', stats: { health: 10, happiness: 10 } },
          { text: '暂时休息', stats: { health: -5, happiness: 5 } }
        ]
      },
      {
        month: 9,
        title: '健康知识',
        content: '参加健康讲座，学到了很多养生知识。',
        options: [
          { text: '认真实践', stats: { health: 25, happiness: 15 } },
          { text: '选择性采纳', stats: { health: 15, happiness: 10 } },
          { text: '听听而已', stats: { health: 5 } }
        ]
      },
      {
        month: 10,
        title: '身体状况',
        content: '坚持大半年后，身体状况明显改善，精力充沛。',
        options: [
          { text: '继续保持', stats: { health: 25, happiness: 20 } },
          { text: '稍微放松', stats: { health: 10, happiness: 25 } },
          { text: '庆祝进步', stats: { happiness: 30, wealth: -10, health: -5 } }
        ]
      },
      {
        month: 11,
        title: '冬季锻炼',
        content: '天气转冷，户外运动变得困难，需要寻找替代方案。',
        options: [
          { text: '室内健身', stats: { health: 20, wealth: -10 } },
          { text: '减少运动', stats: { health: 5, happiness: 10 } },
          { text: '坚持户外', stats: { health: 25, happiness: 15 } }
        ]
      },
      {
        month: 12,
        title: '年度总结',
        content: '一年的健康计划圆满完成，你感觉前所未有的好！2026是健康的一年！',
        options: [
          { text: '制定明年计划', stats: { health: 30, happiness: 25 } },
          { text: '享受成就感', stats: { happiness: 35, health: 20 } },
          { text: '分享经验', stats: { happiness: 40, health: 15 } }
        ]
      }
    ]
  },

  balance: {
    id: 'balance',
    name: '精彩人生',
    icon: '🌟',
    desc: '平衡发展，体验多彩人生',
    baseStats: { wealth: 50, career: 50, love: 50, health: 50, happiness: 50 },
    events: [
      {
        month: 1,
        title: '新年规划',
        content: '2026年到来了，你决定在新的一年里平衡发展各个方面。',
        options: [
          { text: '制定详细计划', stats: { happiness: 20, health: 10, career: 10 } },
          { text: '设定大致方向', stats: { happiness: 15, health: 5 } },
          { text: '顺其自然', stats: { happiness: 10 } }
        ]
      },
      {
        month: 2,
        title: '春节回家',
        content: '春节回家过年，陪伴父母，享受家庭时光。',
        options: [
          { text: '精心准备礼物', stats: { love: 25, happiness: 25, wealth: -15 } },
          { text: '简单回家', stats: { love: 15, happiness: 15, wealth: -5 } },
          { text: '工作优先', stats: { career: 20, love: -15, happiness: -10 } }
        ]
      },
      {
        month: 3,
        title: '学习计划',
        content: '报名参加一个兴趣班，丰富生活的同时学习新技能。',
        options: [
          { text: '积极学习', stats: { career: 15, happiness: 20, wealth: -10 } },
          { text: '轻松参与', stats: { happiness: 15, wealth: -5 } },
          { text: '太忙放弃', stats: { happiness: -10 } }
        ]
      },
      {
        month: 4,
        title: '社交活动',
        content: '朋友邀请参加各种社交活动，扩展人脉。',
        options: [
          { text: '积极参加', stats: { career: 15, happiness: 20, love: 10 } },
          { text: '选择性参加', stats: { happiness: 10, career: 10 } },
          { text: '婉拒大部分', stats: { happiness: -5 } }
        ]
      },
      {
        month: 5,
        title: '健康检查',
        content: '定期体检，关注身体状况，及时发现潜在问题。',
        options: [
          { text: '全面检查', stats: { health: 25, wealth: -10 } },
          { text: '基础检查', stats: { health: 15, wealth: -5 } },
          { text: '暂不检查', stats: { health: -5 } }
        ]
      },
      {
        month: 6,
        title: '年中调整',
        content: '半年过去，回顾上半年的表现，调整下半年的计划。',
        options: [
          { text: '认真复盘调整', stats: { happiness: 20, career: 15, health: 10 } },
          { text: '简单回顾', stats: { happiness: 10, career: 5 } },
          { text: '继续现状', stats: { happiness: 5 } }
        ]
      },
      {
        month: 7,
        title: '旅行计划',
        content: '利用年假出去旅行，放松身心，开阔眼界。',
        options: [
          { text: '精心规划长途游', stats: { happiness: 30, health: 15, wealth: -25 } },
          { text: '短途轻松游', stats: { happiness: 20, health: 10, wealth: -10 } },
          { text: '宅家休息', stats: { happiness: 10, health: 5 } }
        ]
      },
      {
        month: 8,
        title: '感情发展',
        content: '在旅行中结识了有趣的人，开始了一段暧昧关系。',
        options: [
          { text: '积极发展', stats: { love: 25, happiness: 25 } },
          { text: '慢慢了解', stats: { love: 15, happiness: 15 } },
          { text: '保持距离', stats: { love: 5, happiness: 5 } }
        ]
      },
      {
        month: 9,
        title: '工作挑战',
        content: '工作中遇到挑战，需要在工作和生活间找到平衡。',
        options: [
          { text: '努力克服', stats: { career: 25, health: -10, happiness: -5 } },
          { text: '寻求帮助', stats: { career: 15, happiness: 10, love: 5 } },
          { text: '降低预期', stats: { career: 10, happiness: 15 } }
        ]
      },
      {
        month: 10,
        title: '家庭时间',
        content: '父母来看望你，享受温馨的家庭时光。',
        options: [
          { text: '精心安排', stats: { love: 30, happiness: 30, wealth: -15 } },
          { text: '简单陪伴', stats: { love: 20, happiness: 20, wealth: -5 } },
          { text: '工作繁忙', stats: { career: 20, love: -20, happiness: -10 } }
        ]
      },
      {
        month: 11,
        title: '感恩节',
        content: '感恩节到了，回顾一年的收获，感恩身边的人和事。',
        options: [
          { text: '表达感谢', stats: { happiness: 35, love: 25 } },
          { text: '默默感恩', stats: { happiness: 25, love: 15 } },
          { text: '平常对待', stats: { happiness: 10 } }
        ]
      },
      {
        month: 12,
        title: '年终总结',
        content: '2026年即将结束，回顾这一年，你在各方面都有所收获！2026是精彩的一年！',
        options: [
          { text: '庆祝丰收', stats: { happiness: 40, health: 10, wealth: -15 } },
          { text: '规划明年', stats: { career: 20, happiness: 25 } },
          { text: '感恩生活', stats: { happiness: 45, love: 20 } }
        ]
      }
    ]
  }
}

// 结局数据
const endings = {
  wealth: {
    title: '商业大亨',
    desc: '2026年，你在商业领域取得了巨大成功，财富自由，令人羡慕！',
    icon: '👑'
  },
  career: {
    title: '职场精英',
    desc: '2026年，你的事业蒸蒸日上，成为行业内的佼佼者！',
    icon: '🏆'
  },
  love: {
    title: '爱情美满',
    desc: '2026年，你找到了真爱，收获了甜蜜的爱情！',
    icon: '💕'
  },
  health: {
    title: '健康达人',
    desc: '2026年，你的身体状态极佳，充满活力！',
    icon: '💪'
  },
  happiness: {
    title: '人生赢家',
    desc: '2026年，你各方面都很圆满，真正的人生赢家！',
    icon: '🌟'
  },
  balanced: {
    title: '精彩人生',
    desc: '2026年，你平衡发展，生活丰富多彩，不留遗憾！',
    icon: '🎊'
  }
}

// 根据最终属性值获取结局
function getEnding(stats) {
  const { wealth, career, love, health, happiness } = stats
  const maxStat = Math.max(wealth, career, love, health, happiness)

  // 如果某个属性特别突出（>85），返回对应结局
  if (wealth > 85) return { ...endings.wealth, stats }
  if (career > 85) return { ...endings.career, stats }
  if (love > 85) return { ...endings.love, stats }
  if (health > 85) return { ...endings.health, stats }
  if (happiness > 85) return { ...endings.happiness, stats }

  // 如果各项都比较均衡（都在60-80之间），返回平衡结局
  const avg = (wealth + career + love + health + happiness) / 5
  if (avg > 60) return { ...endings.balanced, stats }

  // 否则根据最高属性返回对应结局
  if (maxStat === wealth) return { ...endings.wealth, stats }
  if (maxStat === career) return { ...endings.career, stats }
  if (maxStat === love) return { ...endings.love, stats }
  if (maxStat === health) return { ...endings.health, stats }
  return { ...endings.happiness, stats }
}

module.exports = {
  scripts,
  getEnding
}
