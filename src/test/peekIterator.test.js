const PeekIterator = require('../common/peekIterator')
const arrayToGenerator = require('../common/arrayToGenerator')

const { assert } = require('chai')

describe('peekIterator', () => {
  it('peek', () => {
    const it = new PeekIterator(arrayToGenerator('abcdefg'))

    assert.equal(it.next(), 'a')
    assert.equal(it.next(), 'b')
    assert.equal(it.peek(), 'c')
    assert.equal(it.peek(), 'c')
    assert.equal(it.next(), 'c')
    assert.equal(it.peek(), 'd')
  })

  it('putback', () => {
    const it = new PeekIterator(arrayToGenerator('abcdefg'))

    assert.equal(it.next(), 'a')
    assert.equal(it.next(), 'b')
    assert.equal(it.next(), 'c')
    it.putBack()
    it.putBack()
    assert.equal(it.peek(), 'b')
    assert.equal(it.next(), 'b')
    assert.equal(it.peek(), 'c')
    assert.equal(it.next(), 'c')
  })

  it('endToken', () => {
    const it = new PeekIterator(arrayToGenerator('abcdefg'), '\0')
    for (let i = 0; i < 8; i++) {
      if (i === 7) {
        assert.equal(it.next(), '\0')
      } else {
        assert.equal(it.next(), 'abcdefg'[i])
      }

    }

  })
})
