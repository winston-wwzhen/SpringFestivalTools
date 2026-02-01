// controllers/kinship.js
// 亲戚称呼控制器

const zhipuService = require('../services/zhipu');
const logger = require('../../utils/logger');

class KinshipController {
  /**
   * 计算称呼（使用智谱AI）
   */
  async calculate(req, res) {
    try {
      const { input } = req.body;

      if (!input) {
        return res.status(400).json({
          success: false,
          message: '请输入关系描述'
        });
      }

      logger.info('[Kinship] Calculating with Zhipu AI:', { input });

      const result = await zhipuService.calculateKinship(input);

      res.json({
        success: true,
        data: {
          result: result,
          input: input
        }
      });
    } catch (error) {
      logger.error('[Kinship] Calculate error:', error);

      res.status(500).json({
        success: false,
        message: error.message || '计算失败，请稍后重试'
      });
    }
  }

  /**
   * 搜索称呼（保留原有功能）
   */
  async search(req, res) {
    try {
      const { keyword } = req.query;

      // 简单的模拟搜索
      const commonRelations = [
        { name: '爸爸', relation: '父亲的称呼' },
        { name: '妈妈', relation: '母亲的称呼' },
        { name: '爷爷', relation: '父亲的父亲' },
        { name: '奶奶', relation: '父亲的母亲' },
        { name: '外公', relation: '母亲的父亲' },
        { name: '外婆', relation: '母亲的母亲' }
      ];

      let results = commonRelations;
      if (keyword) {
        results = results.filter(r =>
          r.name.includes(keyword) || r.relation.includes(keyword)
        );
      }

      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      logger.error('[Kinship] Search error:', error);
      res.status(500).json({
        success: false,
        message: '搜索失败'
      });
    }
  }

  /**
   * 获取关系图（保留原有接口）
   */
  async getChart(req, res) {
    try {
      // 返回简单的关系图数据
      const chartData = {
        me: { name: '我', id: 'me' },
        relations: [
          { id: 'f', name: '父亲', to: 'me' },
          { id: 'm', name: '母亲', to: 'me' },
          { id: 'gf', name: '爷爷', to: 'f' },
          { id: 'gm', name: '奶奶', to: 'f' },
          { id: 'gf_m', name: '外公', to: 'm' },
          { id: 'gm_m', name: '外婆', to: 'm' }
        ]
      };

      res.json({
        success: true,
        data: chartData
      });
    } catch (error) {
      logger.error('[Kinship] Get chart error:', error);
      res.status(500).json({
        success: false,
        message: '获取关系图失败'
      });
    }
  }
}

module.exports = new KinshipController();
