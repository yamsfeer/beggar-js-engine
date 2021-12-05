const ASTNodeType = require('./ASTNodeType');
const Stmt = require('./Stmt');

class ForStmt extends Stmt {
  constructor() {
    super(ASTNodeType.FOR_STMT, 'for')
  }
}

module.exports = ForStmt
