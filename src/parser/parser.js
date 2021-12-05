const Expr = require('./ast/Expr')
const Scalar = require('./ast/Scalar')
const ASTNodeType = require('./ast/ASTNodeType')

class Parser {
  // Expr -> digit + Expr | digit
  // digit: [0-9]
  // 1 + 2 + 3 + ... + 9
  // 实验性的parse
  static smpleParse(it) {
    const expr = new Expr()
    const scalar = new Scalar(it)
    if (!it.hasNext()) {
      return scalar
    }

    expr.label = '+'
    expr.type = ASTNodeType.BIN_EXP
    expr.lexeme = it.nextMatch('+')

    expr.addChild(scalar).addChild(Parser.smpleParse(it))

    return expr
  }
}

module.exports = Parser
