const Enum = require('../../common/enum')

module.exports = {
  // factor
  VARIABLE: new Enum('VARIABLE', Symbol('VARIABLE')),
  SCALAR: new Enum('SCALAR', Symbol('SCALAR')),

  // 一元、二元表达式
  BIN_EXP: new Enum('BIN_EXP', Symbol('BIN_EXP')),
  UNARY_EXP: new Enum('UNARY_EXP', Symbol('UNARY_EXP')),

  // statement
  BLOCK: new Enum('BLOCK', Symbol('BLOCK')),
  IF_STMT: new Enum('IF_STMT', Symbol('IF_STMT')),
  WHILE_STMT: new Enum('WHILE_STMT', Symbol('WHILE_STMT')),
  FOR_STMT: new Enum('FOR_STMT', Symbol('FOR_STMT')),
  DECL_STMT: new Enum('DECL_STMT', Symbol('DECL_STMT')),

  // func
  FUNC_DECL_STMT: new Enum('FUNC_DECL_STMT', Symbol('FUNC_DECL_STMT')),
  FUNC_ARGS: new Enum('FUNC_ARGS', Symbol('FUNC_ARGS')),
  CALL_EXPR: new Enum('CALL_EXPR', Symbol('CALL_EXPR')),
  RETURN_STMT: new Enum('RETURN_STMT', Symbol('RETURN_STMT')),
}
