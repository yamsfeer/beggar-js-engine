// 延迟解析，解决循环引用的问题
module.exports = {
  get AssignStmt() { return require('./AssignStmt') },
  get Block() { return require('./Block') },
  get DeclStmt() { return require('./DeclStmt') },
  get Expr() { return require('./Expr') },
  get Factor() { return require('./Factor') },
  get ForStmt() { return require('./ForStmt') },
  get FuncDeclStmt() { return require('./FuncDeclStmt') },
  get FuncArgs() { return require('./FuncArgs') },
  get IfStmt() { return require('./IfStmt') },
  get Scalar() { return require('./Scalar') },
  get Stmt() { return require('./Stmt') },
  get Variable() { return require('./Variable') },
  get WhileStmt() { return require('./WhileStmt') },
}
