// utils/page-mixin.js - 页面混入，提供通用功能

/**
 * 请求管理混入
 * 自动处理页面卸载时的请求取消
 */
const requestMixin = {
  // 存储页面中的请求任务
  _requestTasks: [],

  /**
   * 发送请求并自动管理
   * @param {Object} options 请求配置
   * @returns {Promise}
   */
  $request(options) {
    const request = require('./request')
    const requestId = `page_${this.route}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // 保存请求ID
    this._requestTasks.push(requestId)
    
    // 发起请求
    return request.request({
      ...options,
      requestId
    }).finally(() => {
      // 请求完成后从列表中移除
      const index = this._requestTasks.indexOf(requestId)
      if (index > -1) {
        this._requestTasks.splice(index, 1)
      }
    })
  },

  /**
   * 取消页面所有请求
   */
  $abortAllRequests() {
    const request = require('./request')
    this._requestTasks.forEach(requestId => {
      request.abortRequest(requestId)
    })
    this._requestTasks = []
  },

  // 页面卸载时自动取消所有请求
  onUnload() {
    this.$abortAllRequests()
  }
}

/**
 * 加载状态管理混入
 */
const loadingMixin = {
  data: {
    _loadingCount: 0
  },

  /**
   * 显示加载
   * @param {String} title 标题
   */
  $showLoading(title = '加载中...') {
    this.setData({ _loadingCount: this.data._loadingCount + 1 })
    if (this.data._loadingCount === 1) {
      wx.showLoading({ title, mask: true })
    }
  },

  /**
   * 隐藏加载
   */
  $hideLoading() {
    this.setData({ _loadingCount: Math.max(0, this.data._loadingCount - 1) })
    if (this.data._loadingCount <= 0) {
      wx.hideLoading()
    }
  },

  /**
   * 包装异步函数，自动显示/隐藏加载
   * @param {Function} fn 异步函数
   * @param {String} loadingText 加载提示文字
   */
  $withLoading(fn, loadingText = '加载中...') {
    return async (...args) => {
      this.$showLoading(loadingText)
      try {
        return await fn.apply(this, args)
      } finally {
        this.$hideLoading()
      }
    }
  }
}

/**
 * 分页管理混入
 */
const paginationMixin = {
  data: {
    pagination: {
      page: 1,
      limit: 20,
      hasMore: true,
      list: [],
      loading: false
    }
  },

  /**
   * 初始化分页
   */
  $initPagination(options = {}) {
    const config = require('../config/index')
    this.setData({
      pagination: {
        page: options.page || config.CONSTANTS.PAGINATION.DEFAULT_PAGE,
        limit: options.limit || config.CONSTANTS.PAGINATION.DEFAULT_LIMIT,
        hasMore: true,
        list: [],
        loading: false
      }
    })
  },

  /**
   * 处理分页数据
   * @param {Array} newList 新数据
   * @param {Boolean} isRefresh 是否刷新
   */
  $handlePaginationData(newList, isRefresh = false) {
    const { pagination } = this.data
    const list = isRefresh ? newList : [...pagination.list, ...newList]
    
    this.setData({
      pagination: {
        ...pagination,
        list,
        page: isRefresh ? 1 : pagination.page + 1,
        hasMore: newList.length >= pagination.limit,
        loading: false
      }
    })
    
    return list
  },

  /**
   * 检查是否可以加载更多
   */
  $canLoadMore() {
    const { pagination } = this.data
    return pagination.hasMore && !pagination.loading
  },

  /**
   * 获取分页参数
   */
  $getPaginationParams() {
    const { pagination } = this.data
    return {
      page: pagination.page,
      limit: pagination.limit
    }
  }
}

/**
 * 空状态和错误处理混入
 */
const statusMixin = {
  data: {
    pageStatus: 'loading' // loading | error | empty | content
  },

  /**
   * 设置页面状态
   * @param {String} status 状态
   * @param {Object} options 额外选项
   */
  $setPageStatus(status, options = {}) {
    this.setData({ pageStatus: status })
    
    if (status === 'error' && options.showToast !== false) {
      wx.showToast({
        title: options.errorMsg || '加载失败，请重试',
        icon: 'none'
      })
    }
  },

  /**
   * 显示空状态
   * @param {String} message 空状态提示
   */
  $showEmpty(message = '暂无数据') {
    this.setData({
      pageStatus: 'empty',
      emptyMessage: message
    })
  },

  /**
   * 重试加载
   * @param {Function} retryFn 重试函数
   */
  $retry(retryFn) {
    this.$setPageStatus('loading')
    if (typeof retryFn === 'function') {
      retryFn()
    } else if (typeof this.loadData === 'function') {
      this.loadData()
    }
  }
}

module.exports = {
  requestMixin,
  loadingMixin,
  paginationMixin,
  statusMixin
}
