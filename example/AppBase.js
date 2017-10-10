let decamelize = require('decamelize')
let pluralize = require('pluralize')

module.exports = B => {
  let C = class AppBase extends B {
    // 提供更贴近用户的语义名词 去驼峰+复数
    static getResName () {
      return pluralize(decamelize(this.name, '-'))
    }
    static getCollName () {
      return this.getResName()
    }
  }

  return C
}
