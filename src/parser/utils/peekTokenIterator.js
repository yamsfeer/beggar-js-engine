const PeekIterator = require('../../common/peekIterator')
const ParseException = require('./parseException')

class PeekTokenIterator extends PeekIterator {
  constructor(it) {
    super(it)
  }

  // 匹配下一个token
  nextMatch(value) {
    const token = this.next()
    if (token.value !== value) {
      throw ParseException.fromToken(token)
    }
    return token
  }

  // 匹配下一个token
  nextMatchTokenType(type) {
    const token = this.next()
    if (token.type !== type) {
      throw ParseException.fromToken(token)
    }
    return token
  }
}

module.exports = PeekTokenIterator
