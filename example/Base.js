let list = [
  'mongo-model-2/src/SchemaBase',
  'mongo-model-2/src/DbBase',
  'mongo-model-2/src/CollBase',
  'mongo-model-2/src/DateBase',
  'mongo-model-2/src/IndexBase',
  './AppBase'
].map(require)

// 将list循环继承 出一个最终的Base类
let Base = list.reduce((B, fn) => {
  let C = fn(B)
  return C
}, null)

module.exports = Base

let { mongo } = require('../../config')
Object.assign(Base.mongoConfig, mongo)
