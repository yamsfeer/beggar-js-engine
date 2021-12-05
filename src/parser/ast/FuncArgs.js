const ASTNode = require('./ASTNode')
const ASTNodeType = require('./ASTNodeType')

class FuncArgs extends ASTNode {
  constructor() {
    super(ASTNodeType.FUNC_ARGS, 'funcArgs')
  }

}

module.exports = FuncArgs

const { Factor } = require('./index')

// int a, int b, char c
FuncArgs.parse = it => {
  const args = new FuncArgs()

  while(it.peek().isType()) {
    const type = it.next()
    const variable = Factor.parse(it)
    variable.setTypeLexeme(type)

    args.addChild(variable)

    if (it.peek().value !== ')') {
      it.nextMatch(',')
    }
  }

  return args
}
