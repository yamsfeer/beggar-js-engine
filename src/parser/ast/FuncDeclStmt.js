const ASTNodeType = require('./ASTNodeType');
const Stmt = require('./Stmt');
const ParseException = require('../utils/parseException')

class FuncDeclStmt extends Stmt {
  constructor() {
    super(ASTNodeType.FUNC_DECL_STMT, 'func')
  }

  getFuncVar() {
    return this.getChild(0)
  }
  getArgs() {
    return this.getChild(1)
  }
  getFuncType() {
    return this.getFuncVar().getTypeLexeme().value
  }
  getFuncBody() {
    return this.getChild(2)
  }
}

module.exports = FuncDeclStmt

const { Factor, FuncArgs, Block } = require('./index');
const TokenType = require('../../lexer/tokenType');

// func foo() int {}
FuncDeclStmt.parse = it => {
  it.nextMatch('func')
  const func = new FuncDeclStmt()

  const funcVar = Factor.parse(it)
  func.setLexeme(funcVar.getLexeme())
  func.addChild(funcVar)

  it.nextMatch('(')
  const args = FuncArgs.parse(it)
  func.addChild(args)
  it.nextMatch(')')

  // 函数返回类型
  const returnType = it.nextMatchTokenType(TokenType.KEYWORD)
  if (!returnType.isType()) {
    throw ParseException.fromToken(returnType)
  }

  funcVar.setTypeLexeme(returnType)

  const block = Block.parse(it)
  func.addChild(block)

  return func
}
