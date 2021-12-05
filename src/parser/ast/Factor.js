const ASTNode = require('./ASTNode')
const TokenType = require('../../lexer/tokenType')
const ASTNodeType = require('./ASTNodeType')

class Factor extends ASTNode{
  constructor(it) {
    super()
    const token = it.next()

    this.type = token.type === TokenType.VARIABLE
      ? ASTNodeType.VARIABLE
      : ASTNodeType.SCALAR

    this.label = token.value
    this.lexeme = token
  }
}

module.exports = Factor

// module.export 之后再 require，防止循环引用
Factor.parse = it => {
  const { Variable, Scalar } = require('./index')
  const token = it.peek()
  const type = token.type

  if (type === TokenType.VARIABLE) {
    return new Variable(it)
  } else if (token.isScalar()) {
    return new Scalar(it)
  }
  return null
}
