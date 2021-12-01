const { assert, expect } = require('chai')
const arrayToGenerator = require('../common/arrayToGenerator')
const PeekIterator = require('../common/peekIterator')
const LexicalException = require('../lexer/lexicalException')
const Token = require('../lexer/token')
const TokenType = require('../lexer/tokenType')

function assertToken(token, value, type) {
  assert.equal(token.type, type)
  assert.equal(token.value, value)
}
describe('token', () => {
  it('make varorkeyword', () => {
    let it = new PeekIterator(arrayToGenerator('if abc'))
    let token1 = Token.makeVarOrKeyword(it)
    it.next()
    let token2 = Token.makeVarOrKeyword(it)

    assertToken(token1, 'if', TokenType.KEYWORD)
    assertToken(token2, 'abc', TokenType.VARIABLE)

    let it2 = new PeekIterator(arrayToGenerator('true d'))
    let token3 = Token.makeVarOrKeyword(it2)
    it2.next()
    let token4 = Token.makeVarOrKeyword(it2)

    assertToken(token3, 'true', TokenType.BOOLEAN)
    assertToken(token4, 'd', TokenType.VARIABLE)
  })

  it('make string', () => {
    const tests = ['"123"', '\'ddd\'']

    for (const test of tests) {
      let it = new PeekIterator(arrayToGenerator(test))
      const token = Token.makeString(it)

      assertToken(token, test, TokenType.STRING)
    }
  })

  it('make string throw error', () => {
    let it = new PeekIterator(arrayToGenerator('ccc'))
    assert.throws(() => Token.makeString(it), LexicalException, 'unexpected error');
  })

  it('make operator', () => {
    let tests = [
      ['+ dd', '+'], ['++ dd', '++'], ['+= dd', '+='],
      ['- dd', '-'], ['-- dd', '--'], ['-= dd', '-='],
      ['* dd', '*'], ['*= dd', '*='],
      ['/ dd', '/'], ['/= dd', '/='],

      ['& dd', '&'], ['&= dd', '&='], ['&& dd', '&&'],
      ['| dd', '|'], ['|= dd', '|='], ['|| dd', '||'],
      ['! dd', '!'], ['!= dd', '!='],

      ['> dd', '>'], ['>= dd', '>='], ['>> dd', '>>'],
      ['< dd', '<'], ['<= dd', '<='], ['<< dd', '<<'],
      ['= dd', '='], ['== dd', '=='],

      ['^ dd', '^'], ['^= dd', '^='],
      ['% dd', '%'], ['%= dd', '%='],

      [', dd', ','], ['; dd', ';'],
    ]

    for (const test of tests) {
      let [input, expected] = test
      let it = new PeekIterator(arrayToGenerator(input))

      let token = Token.makeOp(it)
      assertToken(token, expected, TokenType.OPERATOR)
    }
  })

  it('make operator error', () => {
    let it = new PeekIterator(arrayToGenerator('no op here'))
    assert.throws(() => Token.makeOp(it), LexicalException, 'unexpected error');
  })

  it('make number', () => {
    const tests = [
      ['0 dd', '0', TokenType.INTEGER],
      ['0. dd', '0.', TokenType.FLOAT],
      ['0.99 dd', '0.99', TokenType.FLOAT],
      ['99.99 dd', '99.99', TokenType.FLOAT],

      ['+9 dd', '+9', TokenType.INTEGER],
      ['-9 dd', '-9', TokenType.INTEGER],
      ['-.9 dd', '-.9', TokenType.FLOAT],
      ['+0.9 dd', '+0.9', TokenType.FLOAT],
      ['+0.99 dd', '+0.99', TokenType.FLOAT],
      ['-0.9 dd', '-0.9', TokenType.FLOAT],
      ['-0.0 dd', '-0.0', TokenType.FLOAT],
      ['+99.99 dd', '+99.99', TokenType.FLOAT],

      ['.999 dd', '.999', TokenType.FLOAT],
      ['.000 dd', '.000', TokenType.FLOAT]
    ]

    for (const test of tests) {
      let [input, expected, tokenType] = test
      let it = new PeekIterator(arrayToGenerator(input))

      let token = Token.makeNumber(it)
      assertToken(token, expected, tokenType)
    }
  })
  it('make number error', () => {
    const tests = ['0..', '+99..', '+d', '.d', '--', '.99.', 'dd']

    for (const input of tests) {
      let it = new PeekIterator(arrayToGenerator(input))
      assert.throws(() => Token.makeNumber(it), LexicalException)
    }
  })
})
