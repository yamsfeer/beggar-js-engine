const { assert } = require('chai')
const AlphaHelper = require('../common/alphaHelper')

describe('alphabetHelper', () => {
  it('test alphabet', () => {
    assert.equal(true, AlphaHelper.isLetter('f'))
    assert.equal(false, AlphaHelper.isLetter('0'))

    assert.equal(true, AlphaHelper.isLiteral('_'))
    assert.equal(true, AlphaHelper.isLiteral('9'))
    assert.equal(false, AlphaHelper.isLiteral('&'))

    assert.equal(true, AlphaHelper.isNumber('4'))

    assert.equal(true, AlphaHelper.isOperator('/'))
    assert.equal(true, AlphaHelper.isOperator('*'))
    assert.equal(true, AlphaHelper.isOperator('>'))
    assert.equal(true, AlphaHelper.isOperator('%'))
  })
})
