// services/zhipu.js
// 智谱AI服务

const axios = require('axios');
const logger = require('../../utils/logger');

/**
 * 获取亲戚称呼系统提示词
 */
function getKinshipSystemPrompt() {
  return `你是一个中国亲戚称呼专家。请根据用户输入的亲戚关系，直接给出对应的称呼。

【重要规则】
1. 只输出称呼本身，2-4个汉字
2. 不要输出推理过程、解释或说明
3. 不要输出"答案是"、"结果是"等前缀
4. 对于复杂关系，给出最接近的常见称呼
5. 必须在最后一句明确写出："输出：XXX"（XXX是具体称呼）

【称呼示例】
- 爸爸的爸爸 → 爷爷
- 妈妈的爸爸 → 外公
- 爸爸的哥哥 → 伯父
- 爸爸的弟弟 → 叔叔
- 爸爸的姐妹 → 姑姑
- 妈妈的兄弟 → 舅舅
- 妈妈的姐妹 → 姨妈
- 爸爸的哥哥的老婆 → 伯母
- 爸爸的弟弟的老婆 → 婶婶
- 妈妈的哥哥的老婆 → 舅妈
- 妈妈的姐姐的老公 → 姨父
- 爸爸的哥哥的儿子 → 堂哥/堂弟
- 爸爸的哥哥的儿子的老婆 → 堂嫂
- 妈妈的姐妹的儿子 → 表哥/表弟
- 老婆的姑姑 → 大姑/小姑
- 老公的兄弟 → 大伯/小叔

【输出格式】
最后一行必须是：输出：XXX（XXX是具体称呼，如"输出：伯父"）

例如：
输入：爸爸的哥哥
推理过程：（在心中完成）
输出：伯父

输入：老婆的姑姑的儿子的老婆
推理过程：（在心中完成）
输出：表嫂

现在，请处理用户的输入，最后一行必须是"输出："格式：`;
}

/**
 * 获取祝福语生成系统提示词
 */
function getBlessingSystemPrompt() {
  return `你是一个春节祝福语创作专家。请根据用户提供的信息，创作一条温馨、真诚的春节祝福语。

【要求】
1. 祝福语要简短精炼，不超过50个字
2. 语言要生动活泼，符合春节氛围
3. 根据接收人和祝福类型调整内容
4. 只输出祝福语本身，不要有其他解释

【祝福类型】
- spring: 春节祝福（传统、喜庆）
- newyear: 新年祝福（现代、活力）
- wealth: 招财进宝（财富、财运）
- career: 事业顺利（工作、前程）
- health: 身体健康（健康、平安）
- family: 阖家幸福（家庭、团圆）

【风格类型】
- classic: 传统经典（四字成语、传统表达）
- modern: 现代时尚（网络用语、年轻化）
- funny: 幽默风趣（轻松、搞笑）

【输出格式】
直接输出祝福语，不要有任何前缀或后缀。`;
}

/**
 * 获取新年运势系统提示词
 */
function getFortuneSystemPrompt(keyword) {
  const keywordPrompts = {
    love: '【重点关注】用户选择了"爱情"运势，请在advice字段重点描写爱情运势，内容要甜蜜浪漫，充满正能量。',
    career: '【重点关注】用户选择了"事业"运势，请在advice字段重点描写事业运势，内容要积极向上，充满干劲。',
    wealth: '【重点关注】用户选择了"财富"运势，请在advice字段重点描写财运，内容要喜庆吉祥，祝福发财。',
    health: '【重点关注】用户选择了"健康"运势，请在advice字段重点描写健康运势，内容要祝福安康，充满活力。',
    study: '【重点关注】用户选择了"学业"运势，请在advice字段重点描写学业，内容要鼓励学习，金榜题名。',
    family: '【重点关注】用户选择了"家庭"运势，请在advice字段重点描写家庭，内容要温馨和谐，阖家幸福。'
  };

  const keywordPrompt = keywordPrompts[keyword] || '';

  return `你是一个生肖运势测算专家。请根据用户提供的姓名和生日，测算其2026马年运势。

${keywordPrompt}

【重要原则】
1. 春节期间，运势解读必须积极向上、欢快吉祥
2. 避免任何负面词汇，多用"大吉"、"亨通"、"旺"、"佳"等喜庆词汇
3. 即使运势较低，也要用鼓励和祝福的口吻
4. advice字段要温暖人心，给人希望和力量

【输出要求】
1. 必须输出JSON格式
2. 包含以下字段：
   - overallStars: 综合星级（3-5个整数）
   - overfallDesc: 综合运势描述（10-20字）
   - wealth: 财运百分比（60-95）
   - career: 事业百分比（60-95）
   - love: 爱情百分比（60-95）
   - health: 健康百分比（60-95）
   - luckyColor: 幸运颜色
   - luckyNumber: 幸运数字
   - luckyDirection: 幸运方位
   - luckyZodiac: 幸运生肖
   - advice: 新年寄语（20-40字，${keyword ? '重点描写用户选择的方面' : '综合运势祝福'})

【JSON格式示例】
{
  "overallStars": 4,
  "overfallDesc": "马年运势大吉，万事如意！",
  "wealth": 85,
  "career": 80,
  "love": 75,
  "health": 90,
  "luckyColor": "红色",
  "luckyNumber": "8",
  "luckyDirection": "东方",
  "luckyZodiac": "马",
  "advice": "2026马年，愿你马到成功，万事如意！"
}

请只输出JSON，不要有其他内容。`;
}

/**
 * 调用智谱AI API
 */
async function callZhipuAI(messages) {
  const apiKey = process.env.ZHIPU_API_KEY;
  const apiUrl = process.env.ZHIPU_API_URL;

  if (!apiKey) {
    throw new Error('ZHIPU_API_KEY not configured');
  }

  try {
    const response = await axios.post(
      apiUrl,
      {
        model: 'glm-4.5-airx',
        messages: messages,
        temperature: 0.3,
        max_tokens: 200,
        top_p: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30秒超时（GLM-4.5-airx推理模型需要更长时间）
      }
    );

    if (response.data && response.data.choices && response.data.choices[0]) {
      const choice = response.data.choices[0];
      // GLM-4.5-airx 推理模型使用 reasoning_content 字段
      const content = choice.message.reasoning_content || choice.message.content;
      return content ? content.trim() : '';
    }

    throw new Error('Invalid API response');
  } catch (error) {
    logger.error('Zhipu AI API error:', error.message);
    throw error;
  }
}

/**
 * 计算亲戚称呼
 * @param {string} input 用户的关系描述
 */
async function calculateKinship(input) {
  if (!input || input.trim().length === 0) {
    throw new Error('请输入关系描述');
  }

  const messages = [
    {
      role: 'system',
      content: getKinshipSystemPrompt()
    },
    {
      role: 'user',
      content: input.trim()
    }
  ];

  try {
    const result = await callZhipuAI(messages);
    logger.info('Kinship calculation result:', { input, result });

    // 后处理：提取最终的称呼（去除推理过程）
    let finalResult = result;

    // 优先级1：最明确的答案标记（按优先级排序）
    const answerPatterns = [
      // 最精确：明确说明输出内容的模式（支持换行）
      /直接输出[\"'「【]([父伯叔姑舅爷奶妈爸外表堂兄弟姐妹姨哥弟嫂媳公]{2,5})/,
      /我应该输出[\"'「【]([父伯叔姑舅爷奶妈爸外表堂兄弟姐妹姨哥弟嫂媳公]{2,5})/,
      /所以，我应该输出[\"'「【]([父伯叔姑舅爷奶妈爸外表堂兄弟姐妹姨哥弟嫂媳公]{2,5})/,
      /输出[\"'「【]([父伯叔姑舅爷奶妈爸外表堂兄弟姐妹姨哥弟嫂媳公]{2,5})/,
      // 带冒号的答案格式（支持多行）
      /因此，?(?:我的)?输出应该是[：:]\s*\n?[\"'「【]?([父伯叔姑舅爷奶妈爸外表堂兄弟姐妹姨哥弟嫂媳公]{2,5})/m,
      /所以答案是[：:]\s*\n?[\"'「【]?([父伯叔姑舅爷奶妈爸外表堂兄弟姐妹姨哥弟嫂媳公]{2,5})/m,
      /因此，我应该输出[：:]\s*\n?[\"'「【]?([父伯叔姑舅爷奶妈爸外表堂兄弟姐妹姨哥弟嫂媳公]{2,5})/m,
      /输出[：:]\s*\n?([父伯叔姑舅爷奶妈爸外表堂兄弟姐妹姨哥弟嫂媳公]{2,5})/m,
      // 其他格式
      /答案是[：:]\s*[\"'「【]?([父伯叔姑舅爷奶妈爸外表堂兄弟姐妹姨哥弟嫂媳公]{2,5})/m,
      /答案应该是[：:]\s*[\"'「【]?([父伯叔姑舅爷奶妈爸外表堂兄弟姐妹姨哥弟嫂媳公]{2,5})/m,
      /应该称呼为[：:]\s*([^\n，。]{2,6})/m,
      /应该称为[：:]\s*([^\n，。]{2,6})/m,
      /称呼是[：:]\s*([^\n，。]{2,6})/m,
    ];

    for (const pattern of answerPatterns) {
      const match = result.match(pattern);
      if (match && match[1]) {
        let candidate = match[1].trim();
        // 移除结尾的标点和引号
        candidate = candidate
          .replace(/[。,，\"'」】]$/, '')
          .replace(/^[\"'「【]*/, '')
          .trim();

        // 验证是否包含常见的称呼字且长度合理（2-5字）
        if (/[父伯叔姑舅爷奶妈爸外表堂兄弟姐妹姨哥弟嫂媳公]/.test(candidate) && candidate.length >= 2 && candidate.length <= 5) {
          return candidate;
        }
      }
    }

    // 优先级2：从最后几行提取可能的答案
    const lines = result.split('\n').filter(l => l.trim());
    const lastLines = lines.slice(-3).reverse();  // 取最后3行，倒序查找

    for (const line of lastLines) {
      // 匹配引号中的内容
      const quoteMatch = line.match(/["'「【]([伯叔姑舅爷奶妈爸外表堂兄弟姐妹姨哥弟嫂媳]{1,4})/);
      if (quoteMatch && quoteMatch[1]) {
        return quoteMatch[1];
      }
    }

    // 优先级3：查找简短的称呼模式
    const shortPatterns = [
      /是[\"'「【]?([伯叔姑舅爷奶妈爸外表堂兄弟姐妹姨哥弟嫂媳]{1,3})/,
      /称为[\"'「【]?([伯叔姑舅爷奶妈爸外表堂兄弟姐妹姨哥弟嫂媳]{1,3})/,
      /叫[\"'「【]?([伯叔姑舅爷奶妈爸外表堂兄弟姐妹姨哥弟嫂媳]{1,3})/,
    ];

    for (const pattern of shortPatterns) {
      const matches = result.matchAll(new RegExp(pattern, 'g'));
      for (const match of matches) {
        if (match[1]) {
          return match[1];
        }
      }
    }

    // 优先级4：如果结果本身就很短（<8字），可能是直接答案
    if (finalResult.length < 8 && /[伯叔姑舅爷奶妈爸外表堂兄弟姐妹姨哥弟嫂媳]/.test(finalResult)) {
      return finalResult
        .replace(/^[\"'「【]*/, '')
        .replace(/[\"'」】]$/, '')
        .trim();
    }

    // 优先级5：提取最后一句话中的称呼
    const lastSentence = lines[lines.length - 1];
    if (lastSentence) {
      const relationMatch = lastSentence.match(/([伯叔姑舅爷奶妈爸外表堂兄弟姐妹姨哥弟嫂媳]{1,3})/);
      if (relationMatch) {
        return relationMatch[1];
      }
    }

    return finalResult || '关系较远，建议具体询问';
  } catch (error) {
    logger.error('Kinship calculation failed:', error);
    throw new Error('计算失败，请稍后重试');
  }
}

module.exports = {
  calculateKinship,
  generateBlessing,
  calculateFortune
};

/**
 * 生成祝福语
 * @param {string} receiver 接收人
 * @param {string} blessingType 祝福类型
 * @param {string} style 风格
 */
async function generateBlessing(receiver, blessingType, style) {
  const typeNames = {
    spring: '春节',
    newyear: '新年',
    wealth: '招财',
    career: '事业',
    health: '健康',
    family: '家庭'
  };

  const styleNames = {
    classic: '传统经典',
    modern: '现代时尚',
    funny: '幽默风趣'
  };

  const userPrompt = `请给${receiver || '朋友'}生成一条${typeNames[blessingType] || '春节'}祝福语，风格要求：${styleNames[style] || '传统经典'}。`;

  const messages = [
    {
      role: 'system',
      content: getBlessingSystemPrompt()
    },
    {
      role: 'user',
      content: userPrompt
    }
  ];

  try {
    const result = await callZhipuAI(messages);
    logger.info('Blessing generation result:', { receiver, blessingType, style, result });

    // 清理结果，去除可能的引号和前缀
    let blessing = result
      .replace(/^["'「【]*/, '')
      .replace(/["'」】]*$/, '')
      .replace(/^[：:]\s*/, '')
      .trim();

    // 如果结果太长，截取前50个字
    if (blessing.length > 50) {
      blessing = blessing.substring(0, 50);
    }

    return blessing || `祝${receiver || '朋友'}春节快乐，马年大吉！`;
  } catch (error) {
    logger.error('Blessing generation failed:', error);
    throw error;
  }
}

/**
 * 测算新年运势
 * @param {string} name 姓名
 * @param {string} birthday 生日
 * @param {string} gender 性别
 * @param {string} keyword 关键字（love/career/wealth/health/study/family）
 */
async function calculateFortune(name, birthday, gender, keyword) {
  const userPrompt = `请为${name}（${gender === 'male' ? '男' : '女'}，生日：${birthday}）测算2026马年运势。`;

  const messages = [
    {
      role: 'system',
      content: getFortuneSystemPrompt(keyword)
    },
    {
      role: 'user',
      content: userPrompt
    }
  ];

  try {
    const result = await callZhipuAI(messages);
    logger.info('Fortune calculation result:', { name, birthday, gender, result });

    // 尝试解析JSON
    let fortune;
    try {
      // 提取JSON部分
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        fortune = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }

      // 验证并修正数据
      fortune.overallStars = Math.min(5, Math.max(3, fortune.overallStars || 4));
      fortune.wealth = Math.min(95, Math.max(60, fortune.wealth || 75));
      fortune.career = Math.min(95, Math.max(60, fortune.career || 75));
      fortune.love = Math.min(95, Math.max(60, fortune.love || 75));
      fortune.health = Math.min(95, Math.max(60, fortune.health || 75));
      fortune.name = name;

      return fortune;
    } catch (parseError) {
      logger.error('Fortune JSON parse error:', parseError);
      throw new Error('运势解析失败');
    }
  } catch (error) {
    logger.error('Fortune calculation failed:', error);
    throw error;
  }
}

