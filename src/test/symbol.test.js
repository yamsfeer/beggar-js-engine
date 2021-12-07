const SymbolTable = require('../translator/symbol/symbolTable')
const Token = require('../lexer/token')
const TokenType = require('../lexer/tokenType')
const { assert } = require('chai')

describe('symbol', () => {
  it('create', () => {
    const symbolTable = new SymbolTable()
    symbolTable.createLabel(new Token(TokenType.VARIABLE, 'label'), 'LO')
    symbolTable.createVar() // p0
    symbolTable.createSymbol(new Token(TokenType.VARIABLE, 'a'))

    assert.equal(symbolTable.localSize(), 2)
  })

  it('chain', () => {
    const parent = new SymbolTable()
    const child = new SymbolTable()
    const grandson = new SymbolTable()

    parent.addChild(child)
    child.addChild(grandson)

    const varToken = new Token(TokenType.VARIABLE, 'a')
    parent.createSymbol(varToken)

    assert.equal(child.exists(varToken), true)
    assert.equal(grandson.exists(varToken), true)
  })

  it('offset', () => {
    const parent = new SymbolTable()
    const child = new SymbolTable()
    parent.addChild(child)

    parent.createSymbol(new Token(TokenType.INTEGER, '1')) // 直接量 symbol 不使用偏移量
    const parentA = parent.createSymbol(new Token(TokenType.VARIABLE, 'a'))
    const parentB = parent.createSymbol(new Token(TokenType.VARIABLE, 'b'))
    const childB = child.createSymbol(new Token(TokenType.VARIABLE, 'b'))
    const childC = child.createSymbol(new Token(TokenType.VARIABLE, 'c'))

    assert.equal(parentA.offset, 0)
    assert.equal(parentB.offset, 1)

    assert.equal(childB.offset, 1) // childB 是从 parent clone 生成的
    assert.equal(childB.layerOffset, 1)

    assert.equal(childC.offset, 0)
    assert.equal(childC.layerOffset, 0)

  })
})
