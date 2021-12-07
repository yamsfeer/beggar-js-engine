const Symbol = require('./symbol')
const Token = require('../../lexer/token')
const TokenType = require('../../lexer/TokenType')

class SymbolTable {
  constructor() {
    this.parent = null
    this._symbols = []
    this._children = []

    this.tmpIndex = 0 // 给变量起名，不重复即可，比如 p0,p1,p2...
    this.offsetIndex = 0 // 地址偏移量

    this.level = 0 // 当前 symbolTable 在 SymbolTable 树中的节点层数
  }

  get symbols() {
    return this._symbols
  }
  get children() {
    return this._children
  }

  addSymbol(symbol) {
    this.symbols.push(symbol)
    symbol.parent = this
  }
  addChild(childTable) {
    childTable.parent = this
    childTable.level = this.level + 1
    this.children.push(childTable)
  }

  createLabel(lexeme, label) {
    const symbol = Symbol.createLabelSymb(lexeme, label)
    this.addSymbol(symbol)
  }

  createVar() {
    const lexeme = new Token(TokenType.VARIABLE, `p${this.tmpIndex ++}`)
    const symbol = Symbol.createAddrSymb(lexeme, this.offsetIndex ++)

    this.addSymbol(symbol)
    return symbol
  }

  exists(lexeme) {
    const symbol = this.symbols.find(symbol => symbol.lexeme.value === lexeme.value)

    if (symbol) {
      return true
    }

    if (this.parent !== null) {
      return this.parent.exists(lexeme)
    }
    return false
  }

  // 在 symbol table tree 中查找复制 symbol
  /*
    var a
    {
      b = a + 1 // 这里需要克隆外层作用域中的 a
    }
  */
  cloneSymbol(lexeme, layerOffset) {
    let symbol = this.symbols.find(symbol => symbol.lexeme.value === lexeme.value)

    if (symbol) {
      symbol = symbol.copy()
      symbol.layerOffset = layerOffset
      return symbol
    }

    if (this.parent !== null) {
      return this.parent.cloneSymbol(lexeme, layerOffset + 1)
    }

    return null
  }

  createSymbol(lexeme) {
    let symbol = null

    if (lexeme.isScalar()) { // 直接量
      symbol = Symbol.createImmediateSymb(lexeme)
    } else {
      // 先查找是否在父级作用域中存在该变量
      symbol = this.cloneSymbol(lexeme, 0)

      if (symbol === null) {
        // 创建新变量 offset 要自增
        symbol = Symbol.createAddrSymb(lexeme, this.offsetIndex ++)
      }
    }

    this.addSymbol(symbol)
    return symbol
  }

  localSize() {
    return this.offsetIndex // 占用内存的变量的数量
  }
}

module.exports = SymbolTable
