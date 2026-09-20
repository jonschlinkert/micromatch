'use strict';

const assert = require('assert');
const mm = require('..');

describe('issue #212 - brace ranges with dots in the pattern', () => {
  it('should match numeric brace ranges after a literal dot', () => {
    assert(mm.isMatch('a.b', 'a.b'));
    assert(mm.isMatch('a.000', 'a.000'));
    assert(mm.isMatch('a.000', 'a.00{0,1}'));
    assert(mm.isMatch('a.000', 'a.00{0..1}'), 'dot-range should match like enum');
    assert(mm.isMatch('a.001', 'a.00{0..1}'));
    assert(!mm.isMatch('a.002', 'a.00{0..1}'));
    assert(mm.isMatch('a000', 'a00{0..1}'));
  });

  it('should compile makeRe that keeps the prefix before the brace range', () => {
    const re = mm.makeRe('a.00{0..1}');
    assert(re.test('a.000'));
    assert(re.test('a.001'));
    assert(!re.test('a.002'));
    assert(!re.test('.000'), 'must not drop the leading a');
  });

  it('should respect nobrace and leave the pattern unchanged', () => {
    assert(!mm.isMatch('a.000', 'a.00{0..1}', { nobrace: true }));
  });
});
