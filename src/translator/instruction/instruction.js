const TAInstructionType = require('./instructionType')

class TAInstruction {
  constructor(
    type,
    result = null,
    op = null,
    arg1 = null,
    arg2 = null
  ) {
    this._type = type
    this._result = result
    this._op = op
    this._arg1 = arg1
    this._arg2 = arg2
  }

  toString() {
    switch(this.type) {
      case TAInstructionType.ASSIGN:
        return this.arg2 !== null
          ? `${this.result} = ${this.arg1} ${this.op} ${this.arg2}`
          : `${this.result} = ${this.arg1}`
      case TAInstruction.IF:
        return `IF ${this.arg1} ELSE ${this.arg2}`
      case TAInstruction.GOTO:
        return `GOTO ${this.arg1}`
      case TAInstruction.LABEL:
        return `${this.arg1}`
      case TAInstruction.CALL:
        return `CALL ${this.arg1}`
      case TAInstruction.RETURN:
        return `RETURN ${this.arg1.label}`
      case TAInstruction.SP:
        return `SP ${this.arg1}`
      case TAInstruction.PARAM:
        return `PARAM ${this.arg1} ${this.arg2}`
    }

    throw new Error(`unkonwn instruction type ${this.type}`)
  }

  get type() {
    return this._type
  }
  get result(){
    return this._result
  }
  get op() {
    return this._op
  }
  get arg1() {
    return this._arg1
  }
  get arg2() {
    return this._arg2
  }

  set type(type) {
    this._type = type
  }
  set result(result) {
    this._result = result
  }
  set op(op) {
    this._op = op
  }
  set arg1(arg1) {
    this._arg1 = arg1
  }
  set arg2(arg2) {
    this._arg2 = arg2
  }

}

module.exports = TAInstruction
