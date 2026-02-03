// controllers/kinship.js
// 亲戚称呼控制器

const kinshipService = require('../services/kinship');
const logger = require('../../utils/logger');

class KinshipController {
  /**
   * 统一计算接口（支持亲戚称呼、祝福语、运势）
   */
  async calculate(req, res) {
    try {
      const params = req.body;
      const { type } = params;

      logger.info('[Kinship] Calculate request:', { type, params });

      let result;

      switch (type) {
        case 'fortune':
          // 新年运势测算
          const { name, birthday, gender } = params;
          if (!name || !birthday || !gender) {
            return res.status(400).json({
              success: false,
              message: '请填写完整信息'
            });
          }
          result = await kinshipService.calculate({ type, name, birthday, gender });
          break;

        case 'blessing':
          // 祝福语生成
          const { receiver, blessingType, style } = params;
          result = await kinshipService.calculate({ type, receiver, blessingType, style });
          break;

        default:
          // 亲戚称呼计算（兼容旧版）
          const { input } = params;
          if (!input) {
            return res.status(400).json({
              success: false,
              message: '请输入关系描述'
            });
          }
          result = await kinshipService.calculate({ type: 'kinship', relation: input });
          // 转换为旧版格式
          result = {
            result: result.title
          };
          break;
      }

      res.json({
        success: true,
        data: result
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
