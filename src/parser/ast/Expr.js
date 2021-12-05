const ASTNode = require('./ASTNode')
const ASTNodeType = require('./ASTNodeType')
const Priority = require('../utils/priorityTable')

const Variable = require('./Variable')
const Scalar = require('./Scalar')

class Expr extends ASTNode {
  constructor() {
    super()
  }

  static fromToken(type, token) {
    const expr = new Expr()

    expr.lexeme = token
    expr.label = token.value
    expr.type = type

    return expr
  }

  /**
   * 左递归产生式: E(k) -> E(k) op(k) E(k + 1) | E(k + 1)
   * 消除左递归的产生式:
   *   E(k)  -> E(k + 1) E_(k)  // combine 型
   *   E_(k) -> op(k) E(k + 1) E_(k) | epsilon
   *   E(t)  -> F E_(t) | U E_(t)  // 或(|) 是 race型
   */
  static parse(it) {
    return Expr.E(it, 0)
  }

  // E(k)  -> E(k + 1) E_(k)
  // E(t)  -> F E_(t) | U E_(t)
  static E(it, k) {
    return k < Priority.length - 1
      ? Expr.combine(
          it,
          () => Expr.E(it, k + 1),
          () => Expr.E_(it, k),
        )
      : Expr.race(
          it,
          () => Expr.combine(
            it,
            () => Expr.F(it),
            () => Expr.E_(it, k)
          ),
          () => Expr.combine(
            it,
            () => Expr.U(it),
            () => Expr.E_(it, k)
          ),
        )
  }

  // E_(k) -> op(k) E(k + 1) E_(k) | epsilon
  static E_(it, k) {
    let expr = null

    const token = it.peek()
    const op = token.value

    if (Priority[k].includes(op)) {
      it.nextMatch(op)

      expr = Expr.fromToken(ASTNodeType.BIN_EXP, token)
      const child = Expr.combine(
        it,
        () => Expr.E(it, k + 1),
        () => Expr.E_(it, k),
      )
      expr.addChild(child)
    }

    return expr
  }

  static combine(it, funcA, funcB) {
    if (!it.hasNext()) {
      return null
    }

    const a = funcA()
    if (a === null) {
      return it.hasNext() ? funcB() : null
    }

    const b = it.hasNext() ? funcB() : null
    if (b === null) {
      return a
    }

    const expr = Expr.fromToken(ASTNodeType.BIN_EXPR, b.lexeme)
    expr.addChild(a)
    expr.addChild(b.getChild(0))

    return expr
  }

  static race(it, funcA, funcB) {
    if (!it.hasNext()) {
      return null
    }
    const a = funcA()
    return a === null ? funcB() : a
  }

  static F(it) {
    const token = it.peek()
    return token.isVariable()
      ? new Variable(it)
      : new Scalar(it)
  }
  static U(it) {
    const expr = null
    const token = it.peek()
    const value = token.value

    if (value === '(') {
      it.nextMatch('(')
      expr = Expr.parseExpr(it)
      it.nextMatch(')')
    } else if (
      value === '++' ||
      value === '--' ||
      value === '!'
    ) {
      it.nextMatch(value)
      expr = new Expr(ASTNodeType.UNARY_EXP, token)
      expr.addChild(Expr.parseExpr(it))
    }

    return expr
  }
}

module.exports = Expr
