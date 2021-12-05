const ASTNodeType = require('../ast/ASTNodeType')

class ParseUtils {
  // 后序遍历一个 ast
  static postOrderTravel(ast) {
    if (
      ast.type === ASTNodeType.VARIABLE ||
      ast.type === ASTNodeType.SCALAR
    ) {
      return ast.lexeme.value
    }

    let [lchild, rchild] = ast.children
    let l = ParseUtils.postOrderTravel(lchild)
    let r = ParseUtils.postOrderTravel(rchild)
    let op = ast.lexeme.value

    return `${l} ${r} ${op}`
  }
}

module.exports = ParseUtils
