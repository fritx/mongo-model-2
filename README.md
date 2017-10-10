# mongo-model-2

```plain
npm i -S mongodb@2.x
npm i -S mongo-model-2
```

```js
await Order.dangerouslyDrop()
await Order.setupIndexes()

docs = await Order.find({ filter })
doc = await Order.find({ filter, one: true })

ret = await Order.insert({ docs })
ret = await Order.insert({ doc })

ret = await Order.update({ filter, set })
ret = await Order.delete({ filter })

// pagination & relation
let { total, docs, refs } = await Order.list({
  filter, fields,
  pagin: { sort, skip, limit },
  relation: { user: { fields: ['uid', 'name'] } }
})
```

```js
// model/Order.js
let Product = require('./Product')
let User = require('./User')
let B = require('./Base')
let _ = require('lodash')

let C = class Order extends B {
  // ...
}

let sumProp = _.assign({}, Product.priceProp, { range: [0, null] })

C.schema = _.assign({}, B.schema, {
  product: { ref: Product },
  amount: { type: Number, range: [1, 99], step: 1 },
  sum: sumProp,
  user: { ref: User },
  address: { type: String }
})

C.indexes = _.assign({}, B.indexes, {
  user_1: [{ user: 1 }]
})

module.exports = C
```

```js
// model/Base.js
let list = [
  'mongo-model-2/src/SchemaBase',
  'mongo-model-2/src/DbBase',
  'mongo-model-2/src/CollBase',
  'mongo-model-2/src/DateBase',
  'mongo-model-2/example/UidBase',
  'mongo-model-2/example/PaginBase',
  'mongo-model-2/example/RelationBase',
  './AppBase'
].map(require)

// 将list循环继承 出一个最终的Base类
let Base = list.reduce((B, fn, i) => {
  let C = fn(B)
  return C
}, null)

module.exports = Base

Base.mongoConfig = {
  port: process.env.MONGO_PORT,
  dbName: process.env.MONGO_DBNAME
}
```
