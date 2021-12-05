const ASTNodeType = require('./ASTNodeType');
const { Stmt } = require('./index');

class AssignStmt extends Stmt {
  constructor() {
    super(ASTNodeType.AssignStmt, 'assign')
  }
}

module.exports = AssignStmt

const { Factor, Expr } = require('./index')
const ParseException = require('../utils/parseException')

// AssignStmt -> Factor = Expr
AssignStmt.parse = it => {
  let token = it.peek()
  let factor = Factor.parse(it)

  if (factor === null) {
    throw ParseException.fromToken(token)
  }

  let stmt = new AssignStmt()
  let lexeme = it.nextMatch('=')
  let expr = Expr.parse(it)

  stmt.setLexeme(lexeme)
  stmt.addChild(factor)
  stmt.addChild(expr)

  return stmt
}
