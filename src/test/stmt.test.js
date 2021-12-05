const Lexer = require('../lexer/lexer')
const { assert } = require('chai')
const arrayToGenerator = require('../common/arrayToGenerator')
const ParserUtils = require('../parser/utils/parseUtils')
const { AssignStmt, DeclStmt, IfStmt, Stmt } = require('../parser/ast/Index')
const PeekTokenIterator = require('../parser/utils/peekTokenIterator')

const path = require('path')
const ASTNodeType = require('../parser/ast/ASTNodeType')

function createTokenIt(source) {
  const lexer = new Lexer()
  const tokens = lexer.analyse(arrayToGenerator(source))
  const tokenIt = new PeekTokenIterator(arrayToGenerator(tokens))

  return tokenIt
}

describe('Stmts', () => {
  it('assign stmt', () => {
    const it = createTokenIt(`a = b * c\0`)
    const stmt = AssignStmt.parse(it)
    assert.equal('a b c * =', ParserUtils.postOrderTravel(stmt))
  })

  it('decl stmt', () => {
    const it = createTokenIt(`var a = b * c\0`)
    const stmt = DeclStmt.parse(it)
    assert.equal('a b c * =', ParserUtils.postOrderTravel(stmt))
  })

  it('if stmt', () => {
    const it = createTokenIt(`if (a == b) { a = c }\0`)

    const stmt = IfStmt.parse(it)
    const expr = stmt.getExpr()

    const block = stmt.getBlock()
    const blockStmt = block.getChild(0)

    const elseBlock = stmt.getElseIfStmt()

    assert.equal(stmt.getLexeme().value, 'if')
    assert.equal(expr.getLexeme().value, '==')
    assert.equal(blockStmt.getLexeme().value, '=')
    assert.equal(elseBlock, null)
  })

  it('if else stmt', () => {
    const it = createTokenIt(`if (a == b) { a = c } else { a = d }\0`)

    const stmt = IfStmt.parse(it)
    const elseBlock = stmt.getElseIfStmt()
    const elseBlockStmt = elseBlock.getChild(0)

    assert.equal(elseBlockStmt.label, 'assign')
    assert.equal(elseBlockStmt.getChild(0).label, 'a')
    assert.equal(elseBlockStmt.getLexeme().value, '=')
    assert.equal(elseBlockStmt.getChild(1).label, 'd')
  })

  it('func stmt', () => {
    // func foo(int a, int b) int { var a = bar }
    const filePath = path.resolve(__dirname, '../../example/func.tnjs')
    const tokens = Lexer.fromFile(filePath)
    const it = new PeekTokenIterator(arrayToGenerator(tokens))

    const funcStmt = Stmt.parse(it)
    const args = funcStmt.getArgs()

    assert.equal(args.getChild(0).getLexeme().value, 'a')
    assert.equal(args.getChild(1).getLexeme().value, 'b')

    const type = funcStmt.getFuncType()
    assert.equal(type, 'int')

    const funcVar = funcStmt.getFuncVar()
    assert.equal(funcVar.getLexeme().value, 'foo')

    const block = funcStmt.getFuncBody()
    assert.equal(block.getChild(0).label, 'decl')
    assert.equal(block.getChild(0).getLexeme().value, '=')
  })
})
