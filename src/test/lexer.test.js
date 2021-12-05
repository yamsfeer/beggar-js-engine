const Lexer = require('../lexer/lexer')
const { assert } = require('chai')
const arrayToGenerator = require('../common/arrayToGenerator')
const TokenType = require('../lexer/tokenType')
const LexicalException = require('../lexer/lexicalException')

function assertToken(token, value, type) {
  assert.equal(token.type, type)
  assert.equal(token.value, value)
}

describe('lexer', () => {
  it('test lexer', () => {
    let source = `
      if (a == 0.13) {
        var _foo = 'bar'
      } else {
        foo = true
      }\0
    `
    let lexer = new Lexer()
    let tokens = lexer.analyse(arrayToGenerator(source))
    const expecteds = [
      ['if', TokenType.KEYWORD], ['(', TokenType.BRACKET],
      ['a', TokenType.VARIABLE], ['==', TokenType.OPERATOR],
      ['0.13', TokenType.FLOAT], [')', TokenType.BRACKET],
      ['{', TokenType.BRACKET], ['var', TokenType.KEYWORD],
      ['_foo', TokenType.VARIABLE], ['=', TokenType.OPERATOR],
      ['\'bar\'', TokenType.STRING], ['}', TokenType.BRACKET],
      ['else', TokenType.KEYWORD], ['{', TokenType.BRACKET],
      ['foo', TokenType.VARIABLE], ['=', TokenType.OPERATOR],
      ['true', TokenType.BOOLEAN], ['}', TokenType.BRACKET],
    ]

    assert.equal(tokens.length, 18)

    for (let i = 0; i < expecteds.length; i++) {
      let [value, type] = expecteds[i]
      assertToken(tokens[i], value, type)
    }
  })

  it('test func', () => {
    let source = `
      func foo(a, b) {
        var foo = bar
      }
      foo()\0
    `
    let lexer = new Lexer()
    let tokens = lexer.analyse(arrayToGenerator(source))

    const expecteds = [
      ['func', TokenType.KEYWORD], ['foo', TokenType.VARIABLE],
      ['(', TokenType.BRACKET], ['a', TokenType.VARIABLE],
      [',', TokenType.OPERATOR], ['b', TokenType.VARIABLE],
      [')', TokenType.BRACKET], ['{', TokenType.BRACKET],
      ['var', TokenType.KEYWORD], ['foo', TokenType.VARIABLE],
      ['=', TokenType.OPERATOR], ['bar', TokenType.VARIABLE],
      ['}', TokenType.BRACKET], ['foo', TokenType.VARIABLE],
      ['(', TokenType.BRACKET], [')', TokenType.BRACKET],
    ]

    assert.equal(tokens.length, 16)

    for (let i = 0; i < expecteds.length; i++) {
      let [value, type] = expecteds[i]
      assertToken(tokens[i], value, type)
    }
  })

  it('test comment', () => {
    let source = `
      foo = bar
      // comment
      foo
      /* comment
         commentxxx */
     bar\0
    `
    let lexer = new Lexer()
    let tokens = lexer.analyse(arrayToGenerator(source))

    assert.equal(tokens.length, 5)
  })

  it('test comment error', () => {
    let source = `
      /* comment
         commentxxx /\0
    `
    let lexer = new Lexer()
    assert.throws(
      () => lexer.analyse(arrayToGenerator(source)),
      LexicalException,
      'comment unmatch'
    )
  })
})
