// 新年模拟器剧本数据
const scripts = {
  career: {
    id: 'career',
    name: '职场风云',
    icon: '💼',
    desc: '职场如戏，全靠演技！',
    baseStats: { wealth: 50, career: 70, love: 40, health: 60, happiness: 50 },
    events: [
      {
        month: 1,
        title: '老板的疯狂想法',
        content: '年初老板宣布要"All in 元宇宙"，整个公司都要转型！你被任命为项目负责人，但这明显是个坑...',
        options: [
          { text: '硬着头皮上', stats: { career: 20, health: -15, happiness: -10 } },
          { text: '装病拖延', stats: { happiness: 5, career: -10 } },
          { text: '甩锅给同事', stats: { career: 5, happiness: -15 } }
        ]
      },
      {
        month: 2,
        title: '春节惊魂',
        content: '加班到除夕夜，老板突然在群里@你："项目进展如何？"你发现手机没电了...',
        options: [
          { text: '连夜赶工', stats: { career: 25, health: -25, happiness: -20 } },
          { text: '假装失联', stats: { career: -20, happiness: 10 } },
          { text: '甩锅给供应商', stats: { career: 10, happiness: -5 } }
        ]
      },
      {
        month: 3,
        title: '办公室恋情',
        content: '公司新来的HR对你暗送秋波，但听说TA和老板关系不一般...',
        options: [
          { text: '接受暧昧', stats: { love: 25, career: -15, happiness: 15 } },
          { text: '保持距离', stats: { career: 10, love: -5 } },
          { text: '向老板举报', stats: { career: -10, happiness: -20 } }
        ]
      },
      {
        month: 4,
        title: '背锅侠',
        content: '项目出问题了，老板当众点名批评你。其实是你同事的锅，但他已经甩干净了...',
        options: [
          { text: '忍气吞声', stats: { happiness: -20, career: -10 } },
          { text: '公开撕逼', stats: { career: -20, happiness: 10, love: 15 } },
          { text: '阴阳怪气回怼', stats: { happiness: 20, career: -5 } }
        ]
      },
      {
        month: 5,
        title: '竞争对手挖角',
        content: '猎头开出double薪资挖你，但那家公司以996著称，而且刚裁员30%...',
        options: [
          { text: '跳槽！', stats: { wealth: 30, career: 15, health: -20, happiness: -10 } },
          { text: '留下来', stats: { career: 10, happiness: 10 } },
          { text: '用offer谈加薪', stats: { wealth: 25, career: -5, happiness: -10 } }
        ]
      },
      {
        month: 6,
        title: '年中考核惊魂',
        content: 'HR暗示你的绩效是C，可能被优化。但你知道老板的侄子刚入职，正缺位置...',
        options: [
          { text: '主动辞职', stats: { happiness: -15, wealth: -20, career: -10 } },
          { text: '抱老板大腿', stats: { career: 20, happiness: -10 } },
          { text: '收集证据准备仲裁', stats: { wealth: 15, happiness: 10, career: -15 } }
        ]
      },
      {
        month: 7,
        title: '团建醉酒事件',
        content: '团建时你喝多了，当着老板的面跳了段野狼disco，还唱了《我的滑板鞋》...',
        options: [
          { text: '社死到底', stats: { happiness: -25, career: -10 } },
          { text: '装失忆', stats: { happiness: 5 } },
          { text: '顺势成为团建之王', stats: { happiness: 30, career: 10 } }
        ]
      },
      {
        month: 8,
        title: '公司被收购',
        content: '公司突然被收购！新老板宣布要"组织优化"，N+1赔偿已经在路上了...',
        options: [
          { text: '主动被裁', stats: { wealth: 35, career: -15, happiness: 20 } },
          { text: '努力留下来', stats: { career: 20, health: -15, happiness: -10 } },
          { text: '创业', stats: { wealth: -30, career: 25, happiness: 15 } }
        ]
      },
      {
        month: 9,
        title: '新官上任',
        content: '你奇迹般地当上了部门经理！但下属都是老油条，没人听你的...',
        options: [
          { text: '铁腕管理', stats: { career: 25, happiness: -20, love: -15 } },
          { text: '怀柔政策', stats: { happiness: 20, career: 10 } },
          { text: '摆烂躺平', stats: { happiness: 15, career: -15 } }
        ]
      },
      {
        month: 10,
        title: '下属的秘密',
        content: '发现你最有能力的下属在偷偷准备跳槽，还把客户资料带走了...',
        options: [
          { text: '立即开除', stats: { career: 20, happiness: -10 } },
          { text: '谈心挽留', stats: { career: 15, happiness: 15 } },
          { text: '跟着他一起跳槽', stats: { career: -10, wealth: 20, happiness: 10 } }
        ]
      },
      {
        month: 11,
        title: '年终奖风波',
        content: '老板说今年业绩不好，年终奖取消。但你发现公司刚给老板的老婆买了一辆保时捷...',
        options: [
          { text: '联合同事抗议', stats: { career: -20, happiness: 25, love: 20 } },
          { text: '忍气吞声', stats: { happiness: -20 } },
          { text: '申请劳动仲裁', stats: { wealth: 30, career: -25, happiness: 20 } }
        ]
      },
      {
        month: 12,
        title: '年终反转',
        content: '年底你意外获得"年度最佳员工"，奖金10万！但老板暗示你需要"付出点什么"...',
        options: [
          { text: '拿钱跑路', stats: { wealth: 40, happiness: 30, career: -10 } },
          { text: '拒绝并辞职', stats: { happiness: 20, career: -20, wealth: 10 } },
          { text: '交易', stats: { wealth: 50, career: 30, happiness: -30 } }
        ]
      }
    ]
  },

  love: {
    id: 'love',
    name: '桃花劫',
    icon: '💕',
    desc: '桃花运太旺也是烦恼',
    baseStats: { wealth: 50, career: 50, love: 30, health: 60, happiness: 60 },
    events: [
      {
        month: 1,
        title: '新年桃花运爆棚',
        content: '跨年夜你同时被三个人表白：青梅竹马、上司、还有刚认识的主播...',
        options: [
          { text: '全都要！', stats: { love: 40, happiness: 30, health: -20 } },
          { text: '选择青梅竹马', stats: { love: 25, happiness: 20 } },
          { text: '统统拒绝', stats: { love: -10, happiness: -5 } }
        ]
      },
      {
        month: 2,
        title: '情人节修罗场',
        content: '情人节收到三份礼物！但不小心在朋友圈晒图时，被三个送礼人同时看到了...',
        options: [
          { text: '装被盗号', stats: { happiness: 10, love: -5 } },
          { text: '坦白从宽', stats: { love: -30, happiness: -20 } },
          { text: '说都是好朋友送的', stats: { love: 15, happiness: 5 } }
        ]
      },
      {
        month: 3,
        title: '前任回来了',
        content: '前任突然出现，说要复合。现任还不知道这件事...',
        options: [
          { text: '偷偷见前任', stats: { love: 20, happiness: -15, health: -10 } },
          { text: '拉黑前任', stats: { love: 15, happiness: 10 } },
          { text: '和现任坦白', stats: { love: -10, happiness: 20 } }
        ]
      },
      {
        month: 4,
        title: '意外发现',
        content: '你在现任的手机里发现，TA居然同时在和另外5个人聊天，而且叫你"宝贝6号"...',
        options: [
          { text: '当场暴走', stats: { love: -40, happiness: -30, health: -10 } },
          { text: '默默忍受', stats: { love: -20, happiness: -20 } },
          { text: '以其人之道还治其身', stats: { love: 10, happiness: 15, health: -10 } }
        ]
      },
      {
        month: 5,
        title: '父母突袭',
        content: '你爸妈突然出现，说要见见你的对象。但你同时应付着三段关系...',
        options: [
          { text: '雇人冒充', stats: { wealth: -20, love: -15, happiness: 5 } },
          { text: '坦白是单身', stats: { love: -25, happiness: -10 } },
          { text: '介绍最好的朋友', stats: { love: -10, happiness: 20 } }
        ]
      },
      {
        month: 6,
        title: '意外怀孕',
        content: '其中一位对象告诉你怀孕了！但你根本不记得发生过什么...',
        options: [
          { text: '负责到底', stats: { love: 30, wealth: -25, career: -20 } },
          { text: '要求DNA检测', stats: { love: -20, happiness: 10 } },
          { text: '玩失踪', stats: { love: -30, happiness: -20, wealth: -15 } }
        ]
      },
      {
        month: 7,
        title: '修罗场升级',
        content: '你的三个对象在同一个火锅店偶遇了！他们正在核对你的聊天记录...',
        options: [
          { text: '现场表演晕倒', stats: { health: -10, happiness: 20 } },
          { text: '当场跑路', stats: { love: -35, happiness: -15 } },
          { text: '坦诚我错了', stats: { love: -40, happiness: -25 } }
        ]
      },
      {
        month: 8,
        title: '神秘富豪',
        content: '一个神秘富豪说要包养你，每月给你20万零花钱，只需要偶尔陪陪TA...',
        options: [
          { text: '接受！', stats: { wealth: 50, love: -30, happiness: 10 } },
          { text: '拒绝', stats: { love: 20, happiness: 15 } },
          { text: '要价50万', stats: { wealth: 30, love: -20, happiness: 5 } }
        ]
      },
      {
        month: 9,
        title: '网络爆红',
        content: '你的"海王事迹"被发到网上，火了！有人找你拍真人秀...',
        options: [
          { text: '参加真人秀', stats: { wealth: 30, love: -20, happiness: 25 } },
          { text: '起诉造谣', stats: { wealth: -20, love: 10 } },
          { text: '享受流量', stats: { wealth: 20, happiness: 20, love: -10 } }
        ]
      },
      {
        month: 10,
        title: '真爱出现',
        content: '在你玩累了之后，遇到了一个真心对你好的人。但TA知道你的过去...',
        options: [
          { text: '坦白过去', stats: { love: 30, happiness: 25 } },
          { text: '隐瞒过去', stats: { love: 20, happiness: -10 } },
          { text: '因为自卑拒绝', stats: { love: -20, happiness: -15 } }
        ]
      },
      {
        month: 11,
        title: '前任们联盟',
        content: '你的前任们组建了一个"反你联盟"，在各个平台上曝光你的黑历史...',
        options: [
          { text: '公开道歉', stats: { love: 10, happiness: -15 } },
          { text: '反击爆料', stats: { love: -20, happiness: 20 } },
          { text: '注销账号跑路', stats: { love: -30, happiness: -20 } }
        ]
      },
      {
        month: 12,
        title: '年终抉择',
        content: '年底了，你终于决定收心。但就在这时，真爱的人向你求婚了，而你的富豪金主也向你求婚了...',
        options: [
          { text: '选择真爱', stats: { love: 50, happiness: 40, wealth: -20 } },
          { text: '选择富豪', stats: { wealth: 60, love: -20, happiness: 20 } },
          { text: '两个都吊着', stats: { love: 10, wealth: 30, happiness: -10 } }
        ]
      }
    ]
  },

  wealth: {
    id: 'wealth',
    name: '暴富之路',
    icon: '💰',
    desc: '要么暴富，要么破产',
    baseStats: { wealth: 40, career: 50, love: 40, health: 60, happiness: 50 },
    events: [
      {
        month: 1,
        title: '一夜暴富的机会',
        content: '一个神秘网友告诉你内幕消息，某只股票下周要涨10倍！但他要你先转5万块给他...',
        options: [
          { text: '梭哈！', stats: { wealth: -50, happiness: -20 } },
          { text: '谨慎投资', stats: { wealth: -10, happiness: 5 } },
          { text: '拉黑骗子', stats: { happiness: 10 } }
        ]
      },
      {
        month: 2,
        title: '币圈神话',
        content: '你买的一个山寨币突然暴涨100倍！现在是千万富翁了！',
        options: [
          { text: '立即套现', stats: { wealth: 60, happiness: 40 } },
          { text: '继续持有', stats: { wealth: 80, health: -20 } },
          { text: 'all in买入更多', stats: { wealth: -40, happiness: -30 } }
        ]
      },
      {
        month: 3,
        title: '真假投资',
        content: '一个"成功学大师"说带你项目投资，月收益30%。但需要先交10万学费...',
        options: [
          { text: '交学费', stats: { wealth: -40, happiness: -20 } },
          { text: '举报传销', stats: { wealth: 20, happiness: 25 } },
          { text: '假装加入套取信息', stats: { wealth: 10, happiness: 10 } }
        ]
      },
      {
        month: 4,
        title: '一夜返贫',
        content: '你发现那个山寨币是个骗局！平台跑路了，你的千万资产归零...',
        options: [
          { text: '报警', stats: { wealth: 5, happiness: -30 } },
          { text: '跳楼', stats: { health: -50, happiness: -40 } },
          { text: '从头再来', stats: { happiness: 20, career: 10 } }
        ]
      },
      {
        month: 5,
        title: '新机会',
        content: '穷困潦倒时，你发现了一个真正的商机：AI写作工具！但需要借钱开发...',
        options: [
          { text: '借高利贷', stats: { wealth: 30, health: -20, happiness: -10 } },
          { text: '找朋友投资', stats: { wealth: 20, love: -10 } },
          { text: '放弃创业', stats: { happiness: -10 } }
        ]
      },
      {
        month: 6,
        title: '产品爆火',
        content: '你的AI写作工具火了！一个月用户破百万！投资人排着队给你送钱...',
        options: [
          { text: '接受所有投资', stats: { wealth: 50, career: 30 } },
          { text: '精挑细选', stats: { wealth: 35, career: 20, happiness: 10 } },
          { text: '拒绝融资', stats: { wealth: 20, happiness: 20 } }
        ]
      },
      {
        month: 7,
        title: '被挖墙脚',
        content: '大厂想收购你的公司，出价5个亿！但条件是你必须离开公司...',
        options: [
          { text: '卖掉套现', stats: { wealth: 80, career: -30, happiness: 50 } },
          { text: '拒绝收购', stats: { wealth: 20, career: 30 } },
          { text: '讨价还价', stats: { wealth: 60, career: 10 } }
        ]
      },
      {
        month: 8,
        title: '合伙人背叛',
        content: '你发现合伙人偷偷把公司股权转到了自己名下！还挪用了公款...',
        options: [
          { text: '立即报警', stats: { wealth: -30, career: -20, happiness: -20 } },
          { text: '私下解决', stats: { wealth: 20, health: -20 } },
          { text: '装不知道', stats: { happiness: -10, wealth: -20 } }
        ]
      },
      {
        month: 9,
        title: '绝地反击',
        content: '你找到了合伙人挪用公款的证据！准备起诉他，但需要支付巨额律师费...',
        options: [
          { text: '卖房打官司', stats: { wealth: -40, career: 20, happiness: 20 } },
          { text: '私下和解', stats: { wealth: 15, happiness: -10 } },
          { text: '曝光媒体', stats: { wealth: 25, happiness: 30 } }
        ]
      },
      {
        month: 10,
        title: '东山再起',
        content: '官司赢了！你拿回了公司，还获得了巨额赔偿！',
        options: [
          { text: '卖掉退休', stats: { wealth: 70, happiness: 40 } },
          { text: '继续经营', stats: { career: 30, wealth: 50 } },
          { text: '做天使投资', stats: { wealth: 40, happiness: 35 } }
        ]
      },
      {
        month: 11,
        title: '新的危机',
        content: '公司被爆出数据泄露问题！用户集体起诉，赔偿金额可能让你再次破产...',
        options: [
          { text: '申请破产', stats: { wealth: -60, career: -30 } },
          { text: '变卖资产赔偿', stats: { wealth: -50, happiness: 10 } },
          { text: '强硬对抗', stats: { wealth: -20, happiness: -20, career: 10 } }
        ]
      },
      {
        month: 12,
        title: '年终意外',
        content: '年底你中了彩票！500万！但发现彩票被你的前合伙人偷走了...',
        options: [
          { text: '起诉追回', stats: { wealth: 60, happiness: -10 } },
          { text: '放弃', stats: { happiness: -30 } },
          { text: '找人帮忙', stats: { wealth: 50, happiness: 10 } }
        ]
      }
    ]
  },

  health: {
    id: 'health',
    name: '绝地求生',
    icon: '🏃',
    desc: '从亚健康到人生巅峰',
    baseStats: { wealth: 50, career: 50, love: 50, health: 40, happiness: 60 },
    events: [
      {
        month: 1,
        title: '体检惊魂',
        content: '年度体检报告出来了，医生说你：三高、脂肪肝、腰椎间盘突出...还问你有没有买保险...',
        options: [
          { text: '当场崩溃', stats: { health: -20, happiness: -30 } },
          { text: '痛改前非', stats: { health: 25, happiness: 10 } },
          { text: '换家医院检查', stats: { happiness: 5, wealth: -5 } }
        ]
      },
      {
        month: 2,
        title: '减肥大作战',
        content: '你决定减肥，办了健身卡买了私教课。但教练是个魔鬼，每节课都让你想死...',
        options: [
          { text: '坚持到底', stats: { health: 30, wealth: -20, happiness: -15 } },
          { text: '半途而废', stats: { wealth: -10, happiness: 5 } },
          { text: '起诉教练暴力', stats: { health: -10, wealth: 20, happiness: 10 } }
        ]
      },
      {
        month: 3,
        title: '健身房的桃花',
        content: '健身时一个身材超棒的小姐姐/小哥哥主动加你微信，说可以"一起锻炼"...',
        options: [
          { text: '欣然同意', stats: { love: 30, health: 15, happiness: 25 } },
          { text: '保持距离', stats: { health: 10, happiness: -5 } },
          { text: '怀疑是骗局', stats: { happiness: 5, health: -5 } }
        ]
      },
      {
        month: 4,
        title: '健康餐挑战',
        content: '你开始吃健康餐，连续一个月只能吃水煮菜和鸡胸肉。朋友们聚餐都叫你了...',
        options: [
          { text: '坚持吃', stats: { health: 25, happiness: -20, love: -10 } },
          { text: '偷偷作弊', stats: { health: 10, happiness: 10 } },
          { text: '放弃健康餐', stats: { health: -15, happiness: 20, love: 15 } }
        ]
      },
      {
        month: 5,
        title: '运动损伤',
        content: '你举铁时受伤了！医生说需要休养一个月，你的健身计划被打断...',
        options: [
          { text: '强行继续', stats: { health: -30, happiness: -15 } },
          { text: '乖乖休养', stats: { health: 15, happiness: -5 } },
          { text: '改做瑜伽', stats: { health: 20, happiness: 10 } }
        ]
      },
      {
        month: 6,
        title: '身材变化',
        content: '坚持半年后，你瘦了30斤！前任看到你的变化后突然联系你了...',
        options: [
          { text: '复合', stats: { love: 30, health: -10, happiness: 20 } },
          { text: '炫耀后拉黑', stats: { happiness: 25, love: -10 } },
          { text: '冷漠拒绝', stats: { happiness: 10, health: 5 } }
        ]
      },
      {
        month: 7,
        title: '网红之路',
        content: '你的减肥历程火了！有人找你做健身博主，月入过万...',
        options: [
          { text: '签约MCN', stats: { wealth: 30, career: 20, happiness: 20 } },
          { text: '自己做', stats: { wealth: 15, career: 25 } },
          { text: '拒绝', stats: { health: 10, happiness: -5 } }
        ]
      },
      {
        month: 8,
        title: '黑粉攻击',
        content: '网友说你的减肥经历是假的，还扒出你以前胖的照片...',
        options: [
          { text: '公开对线', stats: { happiness: -20, love: 10 } },
          { text: '晒证据', stats: { happiness: 20, wealth: 15 } },
          { text: '装死', stats: { happiness: -10 } }
        ]
      },
      {
        month: 9,
        title: '健身教练的秘密',
        content: '你的教练暗示可以给你"特殊服务"，只要你额外付费...',
        options: [
          { text: '接受', stats: { health: 15, love: 25, wealth: -20 } },
          { text: '拒绝', stats: { health: 5, happiness: -5 } },
          { text: '举报', stats: { wealth: 10, happiness: 20, career: -10 } }
        ]
      },
      {
        month: 10,
        title: '比赛机会',
        content: '有人邀请你参加健美比赛！但需要准备3个月，还要穿很暴露的衣服...',
        options: [
          { text: '参加', stats: { health: 25, career: 20, wealth: -15 } },
          { text: '犹豫后拒绝', stats: { happiness: -5 } },
          { text: '只做观众', stats: { happiness: 10 } }
        ]
      },
      {
        month: 11,
        title: '意外发现',
        content: '你发现健身房用的器材都是三无产品！很多人受伤了，要集体起诉...',
        options: [
          { text: '参与起诉', stats: { wealth: 25, health: 10, happiness: 15 } },
          { text: '观望', stats: { happiness: -5 } },
          { text: '换健身房', stats: { wealth: -10, health: 15 } }
        ]
      },
      {
        month: 12,
        title: '年终逆袭',
        content: '年底你参加了健美比赛！虽然没拿奖，但你的故事被媒体报道了！有人要拍你的电影...',
        options: [
          { text: '卖版权', stats: { wealth: 50, happiness: 40, health: 10 } },
          { text: '自己演', stats: { career: 30, happiness: 35, wealth: 20 } },
          { text: '拒绝', stats: { health: 20, happiness: 20 } }
        ]
      }
    ]
  },

  balance: {
    id: 'balance',
    name: '荒诞人生',
    icon: '🌟',
    desc: '人生如戏，全靠运气',
    baseStats: { wealth: 50, career: 50, love: 50, health: 50, happiness: 50 },
    events: [
      {
        month: 1,
        title: '外星人绑架',
        content: '你被外星人绑架了！他们说要带你去火星参加银河系选美大赛...',
        options: [
          { text: '激动地去', stats: { happiness: 40, health: -30, career: -20 } },
          { text: '拒绝', stats: { happiness: -20, health: 10 } },
          { text: '装疯卖傻', stats: { health: 5, happiness: 10 } }
        ]
      },
      {
        month: 2,
        title: '春节奇遇',
        content: '过年回家，你发现村口的老槐树下埋着宝藏！但需要先和看门的恶狗打一架...',
        options: [
          { text: '勇斗恶狗', stats: { health: -25, wealth: 50, happiness: 30 } },
          { text: '放弃宝藏', stats: { happiness: -10 } },
          { text: '偷走宝藏', stats: { wealth: 40, happiness: -15 } }
        ]
      },
      {
        month: 3,
        title: '身份错乱',
        content: '有人把你看成了明星，疯狂求合影！你顺势承认了，结果被邀请上综艺...',
        options: [
          { text: '上节目', stats: { wealth: 30, happiness: 35, career: 25 } },
          { text: '澄清真相', stats: { happiness: 10, love: 15 } },
          { text: '享受装明星', stats: { happiness: 25, love: -10 } }
        ]
      },
      {
        month: 4,
        title: '神秘快递',
        content: '收到一个神秘快递，里面是一张纸条："你知道得太多了"，还有一颗子弹...',
        options: [
          { text: '报警', stats: { health: -10, happiness: -20 } },
          { text: '逃亡', stats: { wealth: -30, health: -15, happiness: -25 } },
          { text: '当恶作剧', stats: { happiness: 10, health: -5 } }
        ]
      },
      {
        month: 5,
        title: '中奖风波',
        content: '你中了1000万！但领奖时发现彩票被人掉了包，而且对方还长着你的脸...',
        options: [
          { text: '报警', stats: { wealth: 20, happiness: -20 } },
          { text: '跟踪对方', stats: { health: -20, happiness: 10 } },
          { text: '相信科学', stats: { happiness: 15, health: 10 } }
        ]
      },
      {
        month: 6,
        title: '平行时空',
        content: '你穿越到了平行世界！那里的你是亿万富翁，但正在坐牢...',
        options: [
          { text: '替他坐牢', stats: { wealth: 50, happiness: -30, health: -20 } },
          { text: '花他的钱', stats: { wealth: 40, happiness: 30 } },
          { text: '想办法回来', stats: { happiness: 20, health: 10 } }
        ]
      },
      {
        month: 7,
        title: '超能力觉醒',
        content: '你发现自己有读心术！能听到别人的想法。但发现所有人都在骂你...',
        options: [
          { text: '用超能力赚钱', stats: { wealth: 40, happiness: -25, love: -20 } },
          { text: '封闭超能力', stats: { happiness: 15, health: 10 } },
          { text: '报复看不起你的人', stats: { happiness: 20, love: -30 } }
        ]
      },
      {
        month: 8,
        title: '武林高手',
        content: '你被一个神秘老头看中，说你是百年一遇的武学奇才，要收你为徒...',
        options: [
          { text: '拜师学艺', stats: { health: 30, career: -20, wealth: -10 } },
          { text: '拒绝', stats: { career: 10, happiness: 5 } },
          { text: '把老头送派出所', stats: { happiness: 10, love: -10 } }
        ]
      },
      {
        month: 9,
        title: '世界末日',
        content: '新闻说小行星要撞击地球！你有24小时时间，想做什么就做什么...',
        options: [
          { text: '表白', stats: { love: 40, happiness: 35 } },
          { text: '花钱', stats: { wealth: -50, happiness: 40 } },
          { text: '在家等待', stats: { happiness: -20, health: -10 } }
        ]
      },
      {
        month: 10,
        title: '虚惊一场',
        content: '小行星擦肩而过！你花的钱刷爆的卡都要还了，表白的人也把你拉黑了...',
        options: [
          { text: '努力还债', stats: { wealth: 30, career: 20, happiness: -25 } },
          { text: '申请破产', stats: { wealth: -40, career: -20 } },
          { text: '跑路', stats: { wealth: 20, happiness: -30, health: -15 } }
        ]
      },
      {
        month: 11,
        title: '外星人回来了',
        content: '外星人又来了！这次他们说你是地球的救世主，要带领人类对抗黑暗势力...',
        options: [
          { text: '接受使命', stats: { happiness: 50, health: -30, career: -25 } },
          { text: '拒绝', stats: { happiness: -15 } },
          { text: '要报酬', stats: { wealth: 50, happiness: 10 } }
        ]
      },
      {
        month: 12,
        title: '真相大白',
        content: '原来这一切都是一场真人秀！你是主角，全世界都在看你的表演...',
        options: [
          { text: '享受成名', stats: { wealth: 60, happiness: 50, career: 40 } },
          { text: '愤怒起诉', stats: { wealth: 30, happiness: -30 } },
          { text: '坦然接受', stats: { happiness: 40, love: 30 } }
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
