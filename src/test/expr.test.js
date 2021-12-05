const Parser = require('../parser/parser')
const { assert } = require('chai')
const arrayToGenerator = require('../common/arrayToGenerator')
const Lexer = require('../lexer/lexer')
const PeekTokenIterator = require('../parser/utils/peekTokenIterator')
const ASTNodeType = require('../parser/ast/ASTNodeType')
const tokenType = require('../lexer/tokenType')
const Expr = require('../parser/ast/Expr')
const ParseUtils = require('../parser/utils/parseUtils')

function createExpr(source) {
  const code = arrayToGenerator(source)

  // 词法分析
  const lexer = new Lexer()
  const tokens = lexer.analyse(code)
  // 语法分析
  const it = new PeekTokenIterator(arrayToGenerator(tokens))
  const ast = Expr.parse(it)

  return ast
}

describe('Expr', () => {
  it('parse expr', () => {
    // 测试表达式解析和优先级
    const expr = createExpr(`1 + 2 + 3 + 4\0`)

    assert.equal(ParseUtils.postOrderTravel(expr), '1 2 3 4 + + +')
  })

  it('parse expr2', () => {
    const expr = createExpr(`'1' == '2'\0`)
    assert.equal(ParseUtils.postOrderTravel(expr), `'1' '2' ==`)
  })

  it('parse expr priority', () => {
    const expr2 = createExpr(`1 * 2 + 3\0`)
    assert.equal(ParseUtils.postOrderTravel(expr2), '1 2 * 3 +')
  })
})
