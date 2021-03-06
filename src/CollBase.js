let { ObjectID } = require('mongodb')
let _ = require('lodash')

module.exports = B => {
  let C = class CollBase extends B {
    static async find ({ one, filter, fields, sort, skip, limit }) {
      let coll = await this.getColl()
      let method = one ? 'findOne' : 'find'
      fields = this.toFieldsObj(fields)

      let promise = coll[method](filter, {
        fields, sort, skip, limit
      })
      if (!one) {
        promise = promise.toArray()
      }
      return promise
    }
    static toFieldsObj (arr) { // 是否有用??
      let obj = arr.reduce((acc, v) => {
        acc[v] = 1
        return acc
      }, {})
      obj = _.defaults({}, obj, { _id: 0 }) // 默认不显示_id
      return obj
    }

    static async count ({ filter, skip, limit }) {
      let coll = await this.getColl()
      return coll.count(filter, { skip, limit })
    }

    static async insert ({ doc, docs }) {
      let coll = await this.getColl()
      let method
      let prune = d => {
        // return this.prune({ data: d, exclude: ['_id'] })
        return this.prune({ data: d })
      }

      if (docs) {
        method = 'insertMany'
        docs = docs.map(prune)
      } else {
        method = 'insertOne'
        doc = prune(doc)
      }
      return coll[method](docs || doc)
    }

    // 为了数据安全 remove为高危方法 添加dangerously语义
    // 日常使用delete 修改状态
    static async dangerouslyDelete ({ many, filter }) {
      let coll = await this.getColl()
      let method = many ? 'deleteMany' : 'deleteOne'
      return coll[method](filter)
    }

    static async dangerouslyDrop () {
      let coll = await this.getColl()
      try {
        // return coll.drop() // 无法捕获 需要await
        return await coll.drop()
      } catch (e) {
        // ignore
      }
    }

    // 暂时只支持validate set参数
    // 其他$操作符的validate环节 负担太重 暂不支持
    // mutation暂时只允许$set以外的操作符 如$inc
    static async update ({ many, filter, set, mutation = {} }) {
      let coll = await this.getColl()
      if (set) {
        set = this.prune({ data: set, partial: true })
        mutation.$set = set
      }
      let method = many ? 'updateMany' : 'updateOne'
      return coll[method](filter, mutation)
    }

    static async getColl () {
      let collName = this.getCollName()
      let db = await this.getDb()
      return db.collection(collName)
    }
    // 用于定制collName映射关系
    static getCollName () {
      return this.name
    }
  }

  C.schema = _.assign({}, B.schema, {
    _id: {
      type: ObjectID,
      default: () => new ObjectID()
    }
  })
  return C
}
