let { MongoClient } = require('mongodb')

// 确保在多个子类中 只有一份cache
// 存在该局部变量中 保护起来
let cachedDbs = {}

module.exports = B => {
  let C = class DbBase extends B {
    static async getDb () {
      let { url, host, port, db: dbName } = this.mongoConfig
      url = url || `mongodb://${host}:${port}/${dbName}`
      let db = cachedDbs[url]
      if (db) return db

      let prom = MongoClient.connect(url)
      cachedDbs[url] = prom
      db = await prom
      cachedDbs[url] = db
      return db
    }

    static async closeDb () {
      let db = await this.getDb()
      return db.close()
    }
  }

  // 可以在子类Base中覆盖配置
  C.mongoConfig = {
    // 或者 url: 'mongodb://localhost:27017/example',
    host: 'localhost',
    port: 27017,
    db: 'example'
  }
  return C
}
