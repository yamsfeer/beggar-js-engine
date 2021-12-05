const ASTNodeType = require('./ASTNodeType');
const Stmt = require('./Stmt');

class WhileStmt extends Stmt {
  constructor() {
    super(ASTNodeType.WHILE_STMT, 'while')
  }
}

module.exports = WhileStmt
