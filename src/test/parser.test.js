const Parser = require('../parser/parser')
const { assert } = require('chai')
const arrayToGenerator = require('../common/arrayToGenerator')
const Lexer = require('../lexer/lexer')
const PeekTokenIterator = require('../parser/utils/peekTokenIterator')
const ASTNodeType = require('../parser/ast/ASTNodeType')
const tokenType = require('../lexer/tokenType')
const Expr = require('../parser/ast/Expr')
const ParseUtils = require('../parser/utils/parseUtils')

function assertNode(node, expecteds = []) {
  let { type, label, lexeme } = node
  let [node_type, node_label, lexeme_type, lexeme_value] = expecteds
  assert.equal(type, node_type)
  assert.equal(label, node_label)
  assert.equal(lexeme.type, lexeme_type)
  assert.equal(lexeme.value, lexeme_value)
}

describe('parser', () => {
  it('simple parse expr', () => {
    const code = arrayToGenerator(`1 + 2 + 3 + 4 + 5\0`)
    // 词法分析
    const lexer = new Lexer()
    const tokens = lexer.analyse(code)
    // token 迭代器
    const it = new PeekTokenIterator(arrayToGenerator(tokens))
    const ast = Parser.smpleParse(it)

    /*  +
       / \
      1   +
         / \
        2   +
    */

    assertNode(ast, [ASTNodeType.BIN_EXP, '+', tokenType.OPERATOR, '+'])
    assertNode(ast.children[0], [ASTNodeType.SCALAR, '1', tokenType.INTEGER, '1'])
    assertNode(ast.children[1], [ASTNodeType.BIN_EXP, '+', tokenType.OPERATOR, '+'])
    assertNode(ast.children[1].children[0], [ASTNodeType.SCALAR, '2', tokenType.INTEGER, '2'])
  })
})
