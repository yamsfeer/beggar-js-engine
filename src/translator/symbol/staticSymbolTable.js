class StaticSymbolTable {
  constructor() {
    this._symbols = []
    this.offsetMap = new Map() // 哈希表
    this.offsetCounter = 0
  }

  get symbols() {
    return this._symbols
  }

  get size() {
    return this.symbols.length
  }

  add(symbol) {
    const lexval = symbol.lexeme.value
    if (!this.offsetMap.has(lexval)) {
      this.offsetMap.set(lexval, symbol)
      symbol.setOffset(this.offsetCounter++)

      this.symbols.push(symbol)
    } else {
      const s = this.offsetMap.get(lexval)
      symbol.setOffset(s.offset)
    }
  }

}

module.exports = StaticSymbolTable
