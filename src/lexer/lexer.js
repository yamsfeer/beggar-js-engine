const AlphaHelper = require('../common/alphaHelper')
const PeekIterator = require('../common/peekIterator')
const LexicalException = require('./lexicalException')
const Token = require('./token')
const tokenType = require('./tokenType')

class Lexer {
  constructor() {}

  analyse(source, endToken = '\0') {
    const tokens = []
    const it = new PeekIterator(source, endToken)

    while (it.hasNext()) {
      let c = it.next()
      let lookahead = it.peek()

      if (c === '1') debugger

      if (c === endToken) break
      if (c === ' ' || c === '\n') continue

      // 括号
      if (['{', '(', ')', '}'].includes(c)) {
        tokens.push(new Token(tokenType.BRACKET, c))
        continue
      }

      // 注释
      if (c === '/') {
        if (lookahead === '/') {
          while (it.hasNext() && (c = it.next()) !== '\n') { }
          continue
        } else if (lookahead === '*') {
          let valid = false

          while (it.hasNext()) {
            let p = it.next()
            if (p === '*' && it.peek() === '/') {
              valid = true
              it.next()
              break
            }
          }

          if (!valid) {
            throw new LexicalException('comment unmatch')
          }

          continue
        }
      }

      if (c === '"' || c === '\'') {
        it.putBack()
        tokens.push(Token.makeString(it))
        continue
      }

      if (AlphaHelper.isLiteral(c) && !AlphaHelper.isNumber(c)) {
        it.putBack()
        tokens.push(Token.makeVarOrKeyword(it))
        continue
      }

      if (AlphaHelper.isOperator(c)) {
        it.putBack()
        tokens.push(Token.makeOp(it))
        continue
      }

      if (AlphaHelper.isNumber(c)) {
        it.putBack()
        tokens.push(Token.makeNumber(it))
        continue
      }

      throw LexicalException.fromChar(c)
    } // end while

    return tokens
  }
}

module.exports = Lexer
