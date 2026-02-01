// services/zhipu.js
// 智谱AI服务

const axios = require('axios');
const logger = require('../utils/logger');

/**
 * 获取系统提示词
 */
function getKinshipSystemPrompt() {
  return `你是一个专业的中国亲戚称呼计算助手。你的任务是根据用户输入的关系，准确计算出对应的称呼。

规则：
1. 只返回称呼结果，格式简洁，不要有多余解释
2. 如果关系太复杂无法确定，返回"关系太复杂，建议具体咨询"
3. 使用中国传统称呼，如：爷爷、奶奶、外公、外婆、伯父、叔叔、姑姑、舅舅、姨妈、堂哥、表妹等
4. 对于不明确的关系，可以给出最可能的称呼
5. 回复格式：直接返回称呼，不要有其他文字

示例：
输入：爸爸 的 爸爸
输出：爷爷

输入：妈妈 的 哥哥
输出：舅舅`;
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
        model: 'glm-4-flash',
        messages: messages,
        temperature: 0.3,
        max_tokens: 50,
        top_p: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10秒超时
      }
    );

    if (response.data && response.data.choices && response.data.choices[0]) {
      return response.data.choices[0].message.content.trim();
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
    return result;
  } catch (error) {
    logger.error('Kinship calculation failed:', error);
    throw new Error('计算失败，请稍后重试');
  }
}

module.exports = {
  calculateKinship
};
