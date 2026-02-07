// components/skeleton/skeleton.js
Component({
  properties: {
    // 骨架屏类型：card | list | grid | article
    type: {
      type: String,
      value: 'list'
    },
    // 行数
    rows: {
      type: Number,
      value: 3
    },
    // 是否显示动画
    animate: {
      type: Boolean,
      value: true
    }
  },

  data: {
    // 用于循环的行数数组
    rowsArray: []
  },

  lifetimes: {
    attached() {
      this.updateRowsArray()
    }
  },

  observers: {
    'rows': function() {
      this.updateRowsArray()
    }
  },

  methods: {
    updateRowsArray() {
      const rowsArray = Array.from({ length: this.data.rows }, (_, i) => i)
      this.setData({ rowsArray })
    }
  }
})
