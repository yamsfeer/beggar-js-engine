const { Stmt, Expr, Scalar} = require('./ast/index')
const Lexer = require('../lexer/lexer')
const ASTNodeType = require('./ast/ASTNodeType')
const arrayToGenerator = require('../common/arrayToGenerator')
const PeekTokenIterator = require('./utils/peekTokenIterator')
const ASTNode = require('./ast/ASTNode')

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

  static parse(source) {
    const lexer = new Lexer()
    const tokens = lexer.analyse(arrayToGenerator(source))
    const tokenIt = new PeekTokenIterator(arrayToGenerator(tokens))
    const ast = Stmt.parse(tokenIt)

    const program = new ASTNode()
    program.addChild(ast)

    return program
  }
}

module.exports = Parser
