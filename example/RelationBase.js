let Promise = require('bluebird')
let _ = require('lodash')

// 基于 UidBase 以及 PaginBase
module.exports = B => {
  let C = class RelationBase extends B {
    static validate ({ schema, data, partial }) {
      schema = schema || this.schema
      schema = _.clone(schema)
      _.each(schema, (r, k) => {
        if (r.ref) {
          schema[k] = r.ref.schema.uid
        }
      })
      return super.validate({ schema, data, partial })
    }

    // list 添加relation功能
    static async list ({ pagin, filter, fields, relation }) {
      let { total, docs } = await super.list({
        pagin, filter, fields
      })

      let refs = {}
      if (relation) { // todo: 支持'.'嵌套外链
        let keys = _.keys(relation)
        await Promise.each(keys, async k => {
          let rel = relation[k]
          let M = this.schema[k].ref
          let uids = _.map(docs, k)
          uids = _.compact(uids)
          uids = _.uniq(uids)
          let { docs: ds } = await M.list({
            fields: rel.fields,
            filter: { uid: { $in: uids } }
          })
          refs[M.name] = ds
        })
      }
      return { total, docs, refs }
    }
  }

  return C
}
