const ASTNodeType = require('./ASTNodeType')

class ASTNode {
  constructor(type, label) {
    this.children = []

    this.lexeme = null
    this.type = type
    this.label = label
  }

  getChild(index) {
    return this.children[index]
  }

  addChild(node) {
    node.parent = this
    this.children.push(node)
    return this
  }

  getLexeme() {
    return this.lexeme
  }
  setLexeme(lexeme) {
    this.lexeme = lexeme
  }

  isValueType() {
    return this.type === ASTNodeType.VARIABLE ||
      this.type === ASTNodeType.SCALAR
  }
}

module.exports = ASTNode
