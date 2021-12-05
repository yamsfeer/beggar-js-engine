const TokenType = require('./tokenType')
const AlphaHelper = require('../common/alphaHelper')
const LexicalException = require('./lexicalException')

const avaliableType = new Set([
  'int', 'float', 'string', 'bool', 'func'
])

const keywords = new Set([
  'var', 'if', 'else', 'for', 'while', 'break', 'func', 'return',
  ...avaliableType
])

class Token {
  constructor(type, value) {
    this._type = type
    this._value = value
  }

  get type() {
    return this._type
  }

  get value() {
    return this._value
  }

  isVariable() {
    return this._type === TokenType.VARIABLE
  }

  isScalar() {
    return this._type === TokenType.INTEGER || this._type === TokenType.FLOAT ||
      this._type === TokenType.BOOLEAN || this._type === TokenType.STRING
  }

  isType() {
    return avaliableType.has(this._value)
  }

  toString() {
    return `type: ${this._type.type}, value: ${this._value}`
  }

  static makeVarOrKeyword(it) {
    let s = ''

    while (it.hasNext()) {
      const c = it.peek()
      if (AlphaHelper.isLiteral(c)) {
        s += c
      } else {
        break
      }

      it.next()
    }

    if (keywords.has(s)) {
      return new Token(TokenType.KEYWORD, s)
    }
    if (s === 'true' || s === 'false') {
      return new Token(TokenType.BOOLEAN, s)
    }

    return new Token(TokenType.VARIABLE, s)
  }

  static makeString(it) {
    const START        = Symbol('START')
    const DOUBLE_QUOTE = Symbol('DOUBLE_QUOTE')
    const SINGLE_QUOTE = Symbol('SINGLE_QUOTE')

    let s = ''
    let state = START

    while(it.hasNext()) {
      let c = it.next()
      switch (state) {
        case START:
          c === '\"'
            ? state = DOUBLE_QUOTE
            : state = SINGLE_QUOTE
          s += c
          break
        case DOUBLE_QUOTE:
          if (c === '\"') {
            return new Token(TokenType.STRING, s + c)
          } else {
            s += c
          }
          break
        case SINGLE_QUOTE:
          if (c === '\'') {
            return new Token(TokenType.STRING, s + c)
          } else {
            s += c
          }
          break
      }
    } // end while

    throw new LexicalException('unexpected error')
  }

  static makeOp(it) {
    const START = Symbol('S'),
          ADD   = Symbol('+'), SUB = Symbol('-'), MUL   = Symbol('*'), DIV = Symbol('/'),
          AND   = Symbol('&'), OR  = Symbol('|'), NOT   = Symbol('!'),
          GT    = Symbol('>'), LT  = Symbol('<'), EQUAL = Symbol('='),
          POW   = Symbol('^'), MOD = Symbol('%')

    let state = START

    while (it.hasNext()) {
      let lookahead = it.next()
      switch (state) {
        case START:
          switch (lookahead) {
            case '+': state = ADD; break
            case '-': state = SUB; break
            case '*': state = MUL; break
            case '/': state = DIV; break
            case '&': state = AND; break
            case '|': state = OR; break
            case '!': state = NOT; break
            case '>': state = GT; break
            case '<': state = LT; break
            case '=': state = EQUAL; break
            case '^': state = POW; break
            case '%': state = MOD; break
            case ',': return new Token(TokenType.OPERATOR, ',')
            case ';': return new Token(TokenType.OPERATOR, ';')
          } break
        case ADD:
          if (lookahead === '+') {
            return new Token(TokenType.OPERATOR, '++')
          } else if (lookahead === '=') {
            return new Token(TokenType.OPERATOR, '+=')
          } else {
            it.putBack()
            return new Token(TokenType.OPERATOR, '+')
          }
        case SUB:
          if (lookahead === '-') {
            return new Token(TokenType.OPERATOR, '--')
          } else if (lookahead === '=') {
            return new Token(TokenType.OPERATOR, '-=')
          } else {
            it.putBack()
            return new Token(TokenType.OPERATOR, '-')
          }
        case MUL:
          if (lookahead === '=') {
            return new Token(TokenType.OPERATOR, '*=')
          } else {
            it.putBack()
            return new Token(TokenType.OPERATOR, '*')
          }
        case DIV:
          if (lookahead === '=') {
            return new Token(TokenType.OPERATOR, '/=')
          } else {
            it.putBack()
            return new Token(TokenType.OPERATOR, '/')
          }
        case AND:
          if (lookahead === '&') {
            return new Token(TokenType.OPERATOR, '&&')
          } else if (lookahead === '=') {
            return new Token(TokenType.OPERATOR, '&=')
          } else {
            it.putBack()
            return new Token(TokenType.OPERATOR, '&')
          }
        case OR:
          if (lookahead === '|') {
            return new Token(TokenType.OPERATOR, '||')
          } else if (lookahead === '=') {
            return new Token(TokenType.OPERATOR, '|=')
          } else {
            it.putBack()
            return new Token(TokenType.OPERATOR, '|')
          }
        case NOT:
          if (lookahead === '=') {
            return new Token(TokenType.OPERATOR, '!=')
          } else {
            it.putBack()
            return new Token(TokenType.OPERATOR, '!')
          }
        case GT:
          if (lookahead === '>') {
            return new Token(TokenType.OPERATOR, '>>')
          } else if (lookahead === '=') {
            return new Token(TokenType.OPERATOR, '>=')
          } else {
            it.putBack()
            return new Token(TokenType.OPERATOR, '>')
          }
        case LT:
          if (lookahead === '<') {
            return new Token(TokenType.OPERATOR, '<<')
          } else if (lookahead === '=') {
            return new Token(TokenType.OPERATOR, '<=')
          } else {
            it.putBack()
            return new Token(TokenType.OPERATOR, '<')
          }
        case EQUAL:
          if (lookahead === '=') {
            return new Token(TokenType.OPERATOR, '==')
          } else {
            it.putBack()
            return new Token(TokenType.OPERATOR, '=')
          }
        case POW:
          if (lookahead === '=') {
            return new Token(TokenType.OPERATOR, '^=')
          } else {
            it.putBack()
            return new Token(TokenType.OPERATOR, '^')
          }
        case MOD:
          if (lookahead === '=') {
            return new Token(TokenType.OPERATOR, '%=')
          } else {
            it.putBack()
            return new Token(TokenType.OPERATOR, '%')
          }
      }
    } // end while

    throw new LexicalException('unexpected error')
  }

  static makeNumber(it) {
    const START  = Symbol('S'),
          NUMBER = Symbol('1'), NUMBER_DOT = Symbol('4'),
          PN     = Symbol('2'),
          DOT    = Symbol('3'), DOT_NUMBER = Symbol('5')

    let s = ''
    let state = START

    while (it.hasNext()) {
      let lookahead = it.peek()

      switch (state) {
        case START:
          if (AlphaHelper.isNumber(lookahead)) {
            state = NUMBER
          } else if (lookahead === '+' || lookahead === '-') {
            state = PN
          } else if (lookahead === '.') {
            state = DOT
          } break
        case NUMBER:
          if (lookahead === '.') {
            state = NUMBER_DOT
          } else if (AlphaHelper.isNumber(lookahead)) {
          } else {
            return new Token(TokenType.INTEGER, s)
          } break
        case PN:
          if (AlphaHelper.isNumber(lookahead)) {
            state = NUMBER
          } else if (lookahead === '.') {
            state = DOT
          } else {
            throw LexicalException.fromChar(lookahead)
          } break
        case DOT:
          if (AlphaHelper.isNumber(lookahead)) {
            state = DOT_NUMBER
          } else {
            throw LexicalException.fromChar(lookahead)
          } break
        case NUMBER_DOT:
          if (AlphaHelper.isNumber(lookahead)) {
            state = DOT_NUMBER
          } else if (lookahead === '.') {
            throw LexicalException.fromChar(lookahead)
          } else {
            return new Token(TokenType.FLOAT, s)
          } break
        case DOT_NUMBER:
          if (AlphaHelper.isNumber(lookahead)) {
          } else if (lookahead === '.') {
            throw LexicalException.fromChar(lookahead)
          } else {
            return new Token(TokenType.FLOAT, s)
          } break
      } // end switch

      s += it.next()

    } // end while

    throw new LexicalException('unexpected error')
  }
}

module.exports = Token
