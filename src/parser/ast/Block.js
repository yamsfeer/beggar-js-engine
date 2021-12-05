const ASTNodeType = require('./ASTNodeType');
const Stmt = require('./Stmt');

class BlockStmt extends Stmt {
  constructor() {
    super(ASTNodeType.BLOCK, 'block')
  }
}

module.exports = BlockStmt

BlockStmt.parse = it => {
  const block = new BlockStmt()
  it.nextMatch('{')

  let stmt = null
  while ((stmt = Stmt.parse(it)) !== null) {
    block.addChild(stmt)

    // ’}‘ 再次被 Stmt.parse 有bug
    // it.peek() = null 后，再次 peek，’}‘再次出现
    if (it.hasNext() && it.peek().value === '}' ) {
      break
    }
  }

  it.nextMatch('}')

  return block
}
