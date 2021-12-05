const ASTNodeType = require('./ASTNodeType');
const Stmt = require('./Stmt');

class DeclStmt extends Stmt {
  constructor() {
    super(ASTNodeType.DECL_STMT, 'decl')
  }
}

module.exports = DeclStmt

const { Factor, Expr } = require('./index')
const ParseException = require('../utils/parseException')

// DeclStmt -> var Factor = Expr
DeclStmt.parse = it => {
  it.next() // consume var
  let token = it.peek()
  let factor = Factor.parse(it)

  if (factor === null) {
    throw ParseException.fromToken(token)
  }

  let stmt = new DeclStmt()
  let lexeme = it.nextMatch('=')
  let expr = Expr.parse(it)

  stmt.setLexeme(lexeme)
  stmt.addChild(factor)
  stmt.addChild(expr)

  return stmt
}
