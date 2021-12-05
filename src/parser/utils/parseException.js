class ParseException extends Error {
  constructor(msg) {
    super(msg)
  }

  static fromToken(token) {
    return new ParseException(`syntax error, unexpected token ${ token.value }`)
  }
}

module.exports = ParseException
