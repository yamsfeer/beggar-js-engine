const Enum = require('../common/enum')

module.exports = {
  KEYWORD : new Enum('KEYWORD', Symbol('KEYWORD')),
  VARIABLE: new Enum('VARIABLE', Symbol('VARIABLE')),
  OPERATOR: new Enum('OPERATOR', Symbol('OPERATOR')),
  BRACKET : new Enum('BRACKET', Symbol('BRACKET')),
  INTEGER : new Enum('INTEGER', Symbol('INTEGER')),
  FLOAT   : new Enum('FLOAT', Symbol('FLOAT')),
  BOOLEAN : new Enum('BOOLEAN', Symbol('BOOLEAN')),
  STRING : new Enum('STRING', Symbol('STRING')),
}
