const Enum = require('../../common/enum')

module.exports = {
  ASSIGN: new Enum('ASSIGN', Symbol('ASSIGN')),
  GOTO: new Enum('GOTO', Symbol('GOTO')),
  IF: new Enum('IF', Symbol('IF')),
  LABEL: new Enum('LABEL', Symbol('LABEL')),
  CALL: new Enum('CALL', Symbol('CALL')),
  RETURN: new Enum('RETURN', Symbol('RETURN')),
  SP: new Enum('SP', Symbol('SP')),
  PARAM: new Enum('PARAM', Symbol('PARAM')),
}
