const SymbolTable = require('./symbol/symbolTable')
const SymbolType = require('./symbol/symbolType')

const Token = require('../lexer/token')
const TokenType = require('../lexer/tokenType')

const TAInstruc = require('./instruction/instruction')
const TAInstrucType = require('./instruction/instructionType')

const Expr = require('../parser/ast/Expr')
const ParseException = require('../parser/utils/parseException')

const ASTNodeType = require('../parser/ast/ASTNodeType')
const TAProgram = require('./instruction/TAProgram')

class Translator {
  constructor() {}

  translate(ast) {
    const program = new TAProgram()
    const symbolTable = new SymbolTable()

    for (const child of ast.children) {
      this.translateStmt(program, child, symbolTable)
    }

    program.setStaticSymbols(symbolTable)

    return program
  }

  translateStmt(program, node, symbolTable) {
    const args = [program, node, symbolTable]

    switch(node.type) {
      case ASTNodeType.ASSIGN_STMT:
        return this.translateAssign(...args)
      case ASTNodeType.DECL_STMT:
        return this.translateDecl(...args)
      case ASTNodeType.BLOCK:
        return this.translateBlock(...args)
      case ASTNodeType.IF_STMT:
        return this.translateIfStmt(...args)
      case ASTNodeType.FUNC_DECL_STMT:
        return this.translateFuncDeclStmt(...args)
      case ASTNodeType.RETURN_STMT:
        return this.translateReturnStmt(...args)
      case ASTNodeType.CALL_EXPR:
        return this.translateCallExpr(...args)
    }

    throw new Error(`translator error type ${node.type}`)
  }

  translateFuncDeclStmt(program, node, symbolTable) {}
  translateReturnStmt(program, node, symbolTable) {}
  translateCallExpr(program, node, symbolTable) {}

  translateIfStmt(program, node, symbolTable) {}
  translateBlock(program, node, symbolTable) {}

  translateAssign(program, node, symbolTable) {
    // var foo = expr
    const assignSymbol = symbolTable.createSymbol(node.getChild(0).lexeme)
    const expr = node.getChild(1)
    const addr = this.translateExpr(program, expr, symbolTable)

    const instruc = new TAInstruc(TAInstrucType.ASSIGN, assignSymbol, '=', addr)
    program.add(instruc)
  }

  translateDecl(program, node, symbolTable) {
    // var a = b
    const lexeme = node.getChild(0).lexeme
    if (symbolTable.exists(lexeme)) { // 重复声明
      throw new ParseException(`syntax error, Identifier ${lexeme.value}`)
    }

    const assignSymbol = symbolTable.createSymbol(lexeme)
    const expr = node.getChild(1)
    const addr = this.translateExpr(program, expr, symbolTable)

    const instruc = new TAInstruc(TAInstrucType.ASSIGN, assignSymbol, '=', addr)
    program.add(instruc)
  }

  translateExpr(program, node, symbolTable) {
    if (node.isValueType()) {
      const addr = symbolTable.createSymbol(node.lexeme)
      node.addr = addr
      return addr
    } else if (node.type === ASTNodeType.CALL_EXPR) {
      throw new Error('error in CALL_EXPR')
    }

    for (const child of node.children) {
      this.translateExpr(program, child, symbolTable)
    }

    if (node.addr === null) {
      node.addr = symbolTable.createVar()
    }

    const instruc = new TAInstruc(
      TAInstrucType.ASSIGN,
      node.addr,
      node.lexeme.value,
      node.getChild(0).addr,
      node.getChild(1).addr,
    )

    program.add(instruc)
    return instruc
  }
}

module.exports = Translator
