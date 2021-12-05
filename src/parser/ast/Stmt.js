const ASTNode = require('./ASTNode');

class Stmt extends ASTNode {
  constructor(type, label) {
    super(type, label)
  }
}

module.exports = Stmt

Stmt.parse = it => {
  if (!it.hasNext()) {
    return null
  }

  const {
    AssignStmt,
    DeclStmt,
    IfStmt,
    FuncDeclStmt,
    WhileStmt,
    Expr
  } = require('./index');

  const token = it.next()
  const lookahead = it.peek()
  it.putBack()

  if (token.isVariable() && lookahead.value === '=') {
    return AssignStmt.parse(it)
  } else if (token.value === 'var') {
    return DeclStmt.parse(it)
  } else if (token.value === 'if') {
    return IfStmt.parse(it)
  } else if (token.value === 'func') {
    return FuncDeclStmt.parse(it)
  }
  return null
}
