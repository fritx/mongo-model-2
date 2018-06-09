let _ = require('lodash')
let Promise = require('bluebird')

module.exports = B => {
  let C = class PaginBase extends B {
    // list 便于分页场景的find
    static async list ({ pagin, filter, fields }) {
      let { sort, skip, limit } = pagin || {}
      let [total, docs] = await Promise.all([
        this.count({ filter }), // 获取总个数
        this.find({ filter, fields, sort, skip, limit })
      ])
      return { total, docs }
    }
  }

  C.koaPagin = koaPagin
  return C
}

async function koaPagin (ctx, next) {
  if (ctx.method === 'GET') {
    let { page, skip, limit } = ctx.query
    if (limit == 0) {
      limit = 0 // 如果指定0 则为0 不限制数量
    } else {
      limit = parseInt(limit) || 10
    }
    if ('skip' in ctx.query) {
      skip = parseInt(skip) || 0
    } else {
      page = parseInt(page) || 1
      skip = limit * (page - 1)
    }
    // todo: 可多个字段 组合sort传入
    // 默认按日期逆序
    // let sort = [['createdAt', -1], ['_id', -1]]
    let sort = { _id: -1 }
    ctx.state.pagin = { skip, limit, sort }
  }
  await next()
}
