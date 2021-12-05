const ASTNodeType = require('./ASTNodeType')
const Factor = require('./Factor')

class Variable extends Factor {
  constructor(it) {
    super(it)
    this.type = ASTNodeType.VARIABLE
    this.typeLexeme = null
  }

  getTypeLexeme() {
    return this.typeLexeme
  }
  setTypeLexeme(lexeme) {
    this.typeLexeme = lexeme
  }
}

module.exports = Variable
