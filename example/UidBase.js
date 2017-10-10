// let uuid = require('uuid')
let shortid = require('shortid')
let _ = require('lodash')

// https://github.com/dylang/shortid#shortidworkerinteger
// https://github.com/Unitech/pm2/issues/1143#issuecomment-90945849
let workerId = process.env.NODE_APP_INSTANCE || process.env.NODE_UNIQUE_ID || 0
shortid.worker(workerId)

module.exports = B => {
  let C = class UidBase extends B {
    static genDocUid () {
      // https://***REMOVED***/order/order-food/issues/37
      // return uuid().substr(0, 8) // 截取uuid前n位不够用
      return shortid.generate()
    }
  }

  let uidProp = { type: String, default: C.genDocUid }
  C.uidProp = uidProp

  let bSchemaCopy = _.clone(B.schema)
  C.schema = _.assign(bSchemaCopy, {
    uid: uidProp
  })

  return C
}
