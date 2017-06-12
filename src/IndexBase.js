let _ = require('lodash')

module.exports = B => {
  let C = class IndexBase extends B {
    static async ensureIndex (spec, options) {
      let coll = await this.getColl()
      return coll.ensureIndex(spec, options)
    }

    static async dropIndex (name, options) {
      let coll = await this.getColl()
      return coll.dropIndex(name, options)
    }

    static async listIndexes (options) {
      let coll = await this.getColl()
      let ret = []
      try {
        ret = await coll.listIndexes(options).toArray()
      } catch (err) {
        // MongoError: no collection
        // https://npmdoc.github.io/node-npmdoc-monq/build/apidoc.html
        if (err.code === 26) {
          ret = []
        } else {
          throw err
        }
      }
      return ret
    }

    static async setupIndexes () {
      let indexes = this.indexes
      let existed = await this.listIndexes()
      // drop多余的index
      for (let item of existed) {
        let need = _.has(indexes, item.name)
        if (!need) {
          await this.dropIndex(item.name)
        }
      }
      // ensure需要的index
      for (let name of _.keys(indexes)) {
        let item = indexes[name]
        let opts = _.assign({}, item[1], { name })
        await this.ensureIndex(item[0], opts)
      }
    }
  }

  C.indexes = {
    // _id_不需要添加`unique:true`
    // The field 'unique' is not valid for an _id index specification
    _id_: [{ _id: 1 }]
  }
  return C
}
