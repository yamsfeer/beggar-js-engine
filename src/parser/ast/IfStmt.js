const ASTNodeType = require('./ASTNodeType');
const Stmt = require('./Stmt');

class IfStmt extends Stmt {
  constructor() {
    super(ASTNodeType.IF_STMT, 'if')
  }

  getExpr() {
    return this.getChild(0)
  }
  getBlock() {
    return this.getChild(1)
  }
  getElseIfStmt() {
    const block = this.getChild(2)
    if (block instanceof BlockStmt) {
      return block
    }
    return null
  }
}

module.exports = IfStmt

const { Expr, Block } = require('./index');
const BlockStmt = require('./Block');

// ifStmt -> if (expr) Block ifTail
IfStmt.parse = it => {
  const lexeme = it.nextMatch('if')

  it.nextMatch('(')
  const expr = Expr.parse(it)
  it.nextMatch(')')

  const block = Block.parse(it)

  const stmt = new IfStmt()
  stmt.setLexeme(lexeme)
  stmt.addChild(expr)
  stmt.addChild(block)

  const tail = IfStmt.parseTail(it)
  if (tail !== null) {
    stmt.addChild(tail)
  }

  return stmt
}

// ifTail -> else Block | else ifStmt
IfStmt.parseTail = it => {
  if (!it.hasNext() || it.peek().value !== 'else') {
    return null
  }

  it.nextMatch('else')
  const lookahead = it.peek()

  if (lookahead.value === '{') {
    return Block.parse(it)
  } else if (lookahead.value === 'if') {
    return IfStmt.parse(it)
  } else {
    return null
  }
}
