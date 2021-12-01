class AlphaHelper {
  static ptnLetter = /^[a-zA-Z]$/
  static ptnNumber = /^[0-9]$/
  static ptnLiteral = /^[_a-zA-Z0-9]$/
  static ptnOperator = /^[\*+-/><=&|!^%]$/

  static isLetter(c) {
    return AlphaHelper.ptnLetter.test(c)
  }
  static isNumber(c) {
    return AlphaHelper.ptnNumber.test(c)
  }
  static isLiteral(c) {
    return AlphaHelper.ptnLiteral.test(c)
  }
  static isOperator(c) {
    return AlphaHelper.ptnOperator.test(c)
  }
}

module.exports = AlphaHelper
