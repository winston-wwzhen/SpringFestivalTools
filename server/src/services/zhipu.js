// services/zhipu.js
// 智谱AI服务

const axios = require('axios');
const logger = require('../../utils/logger');

/**
 * 获取系统提示词
 */
function getKinshipSystemPrompt() {
  return `计算亲戚称呼。

输入：爸爸的哥哥
输出：伯父

输入：妈妈的爸爸
输出：外公

输入：爸爸的弟弟
输出：叔叔`;
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

    // 查找常见模式，提取最终答案
    const patterns = [
      /应该称呼为[\""]([^\""]+)[\""]/,
      /对应的输出是[\""]([^\""]+)[\""]/,
      /是[\""]?([伯叔姑舅爷奶妈爸外][^，。\n]{0,3})/,
      /输出[\""]([^\""]+)[\""]/
    ];

    for (const pattern of patterns) {
      const match = result.match(pattern);
      if (match && match[1]) {
        finalResult = match[1];
        break;
      }
    }

    // 如果结果过长，尝试提取最后2-4个字的答案
    if (finalResult.length > 10) {
      const shortMatch = finalResult.match(/([伯叔姑舅爷奶妈爸外][^，。\n]{1,3})/);
      if (shortMatch) {
        finalResult = shortMatch[1];
      }
    }

    return finalResult;
  } catch (error) {
    logger.error('Kinship calculation failed:', error);
    throw new Error('计算失败，请稍后重试');
  }
}

module.exports = {
  calculateKinship
};
