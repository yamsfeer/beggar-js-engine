const { assert } = require('chai')
const Parser = require('../parser/parser')
const TAProgram = require('../translator/instruction/TAProgram')
const SymbolTable = require('../translator/symbol/symbolTable')
const Translator = require('../translator/translator')

describe('translator', () => {
  it('translate expr', () => {
    const source = `a+b+c+d+e\0`
    const ast = Parser.parse(source)
    const exprAst = ast.getChild(0)

    const translator = new Translator()
    const symbolTable = new SymbolTable()
    const program = new TAProgram()

    const expectedTAProgram = ``

    translator.translateExpr(program, exprAst, symbolTable)

    console.log(program.toString())
    assert.equal(program.toString(), expectedTAProgram)
  })
})
