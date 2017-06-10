# mongo-model-2

```plain
npm i -S mongodb@2.x
npm i -S mongo-model-2
```

```js
// model/Order.js
let Product = require('./Product')
let User = require('./User')
let B = require('./Base')
let _ = require('lodash')

let C = class Order extends B {
  // todo
}

let bSchemaCopy = _.clone(B.schema)
C.schema = _.assign(bSchemaCopy, {
  product: { ref: Product },
  // price: Product.priceProp,
  amount: { type: Number, range: [1, 99], step: 1 },
  sum: { type: Number, range: [0, null] },
  user: { ref: User },
  address: { type: String }
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
