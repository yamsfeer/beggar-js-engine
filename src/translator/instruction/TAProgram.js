const TAInstruction = require('./instruction')
const TAInstructionType = require('./instructionType')

const SymbolType = require('../symbol/symbolType')
const StaticSymbolTable = require('../symbol/staticSymbolTable.js')

class TAProgram {
  constructor() {
    this.instructions = []
    this.labelCounter = 0
    this.staticSymbolTable = new StaticSymbolTable()
  }

  toString() {
    return this.instructions
      .map(ins => ins.toString())
      .join('\n')
  }

  add(instruc) {
    this.instructions.push(instruc)
  }

  addLabel() {
    const label = `L${this.labelCounter++}`
    const instruc = new TAInstruction(TAInstructionType.LABEL, null, null, label)

    this.add(instruc)
    return instruc
  }

  // 筛选 symbolTable 中的直接量，放入 staticSymbolTable
  setStaticSymbols(symbolTable) {
    for (const symbol of symbolTable.symbols) {
      if (symbol.type === SymbolType.IMMEDIATE_SYMBOL) {
        this.staticSymbolTable.add(symbol)
      }
    }

    for (const child of symbolTable) {
      this.setStaticSymbols(child)
    }

  }
}

module.exports = TAProgram
