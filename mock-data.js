// mock-data.js - 模拟数据模块

// 由于数据量较大，这里先导出一个空数组
// 实际使用时，列表页会使用自己的 getMockData 方法
function getMockData() {
  return []
}

module.exports = {
  getMockData
}
