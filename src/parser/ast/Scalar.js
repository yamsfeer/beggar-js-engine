const ASTNodeType = require('./ASTNodeType')
const Factor = require('./Factor')

class Scalar extends Factor {
  constructor(it) {
    super(it)
  }
}

module.exports = Scalar
