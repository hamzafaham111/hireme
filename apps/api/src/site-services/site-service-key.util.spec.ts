import assert from 'node:assert/strict'
import test from 'node:test'
import { formatServiceKey, parseMaxServiceKeyIndex } from './site-service-key.util'

test('parseMaxServiceKeyIndex ignores junk and finds max SS-xx', () => {
  assert.equal(
    parseMaxServiceKeyIndex(['nope', 'SS-01', 'ss-10', 'SS-02']),
    10,
  )
})

test('formatServiceKey pads to two digits for small numbers', () => {
  assert.equal(formatServiceKey(1), 'SS-01')
  assert.equal(formatServiceKey(100), 'SS-100')
})
