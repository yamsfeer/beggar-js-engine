const SymbolType = require('./symbolType')

class Symbol {
  constructor(type) {
    this._type = type

    this._label = null
    this._lexeme = null
    this._parent = null

    this._offset = 0 // 地址的相对偏移量
    this._layerOffset = 0 // 符号表层级

  }

  copy() {
    const symbol = new Symbol(this.type)
    symbol.label = this._label
    symbol.lexeme = this._lexeme
    symbol.parent = this._parent
    symbol.offset = this._offset
    symbol.layerOffset = this._layerOffset

    return symbol
  }

  get type() {
    return this._type
  }
  get label() {
    return this._label
  }
  get lexeme() {
    return this._lexeme
  }
  get parent() {
    return this._parent
  }
  get offset() {
    return this._offset
  }
  get layerOffset() {
    return this._layerOffset
  }

  set type(type) {
    this._type = type
  }
  set label(label) {
    this._label = label
  }
  set lexeme(lexeme) {
    this._lexeme = lexeme
  }
  set parent(parent) {
    this._parent = parent
  }
  set offset(offset) {
    this._offset = offset
  }
  set layerOffset(layerOffset) {
    this._layerOffset = layerOffset
  }

  toString() {
    if (this.type === SymbolType.LABEL_SYMBOL) {
      return this.label
    }
    return this.lexeme.value
  }

  static createAddrSymb(lexeme, offset) {
    const symbol = new Symbol(SymbolType.ADDRESS_SYMBOL)
    symbol.lexeme = lexeme
    symbol.offset = offset

    return symbol
  }

  static createImmediateSymb(lexeme) {
    const symbol = new Symbol(SymbolType.IMMEDIATE_SYMBOL)
    symbol.lexeme = lexeme

    return symbol
  }

  static createLabelSymb(lexeme, label) {
    const symbol = new Symbol(SymbolType.LABEL_SYMBOL)
    symbol.lexeme = lexeme
    symbol.label = label

    return symbol
  }
}

module.exports = Symbol
