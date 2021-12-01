const Linklisted = require('linkedlist')

const CACHE_SIZE = 10

class PeekIterator {
  constructor(it, endToken = null) {
    this.it = it
    this.endToken = endToken

    this.stackPutBacks = new Linklisted()
    this.queueCache = new Linklisted()
  }

  _hasPutBackVal() {
    return this.stackPutBacks.length > 0
  }

  peek() {
    if (this._hasPutBackVal()) {
      return this.stackPutBacks.tail
    }

    let val = this.next()
    this.putBack()
    return val
  }

  putBack() {
    if (this.queueCache.length > 0) {
      this.stackPutBacks.push(this.queueCache.pop())
    }
  }

  hasNext() {
    return this.endToken || !!this.peek()
  }

  next() {
    let val = null

    if (this._hasPutBackVal()) {
      val = this.stackPutBacks.pop()
    } else {
      val = this.it.next().value
      if (val === undefined) {
        const tmp = this.endToken
        this.endToken = null
        return tmp
      }
    }

    // 入队前判断是否溢出
    while(this.queueCache.length > CACHE_SIZE - 1) {
      this.queueCache.shift()
    }
    this.queueCache.push(val)

    return val
  }
}

module.exports = PeekIterator
