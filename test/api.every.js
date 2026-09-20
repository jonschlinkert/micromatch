'use strict';

const assert = require('assert');
const mm = require('..');

describe('.every()', () => {

  it('should return true if every string matches any pattern', () => {
    let fixtures = ['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'];
    // '*/*' matches every fixture even though 'z' matches none (OR semantics)
    assert(mm.every(fixtures, ['z', '*/*']));
  });

  it('should return false when not all strings match', () => {
    let fixtures = ['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'];
    assert(!mm.every(fixtures, ['a/*', 'x/*']));
    assert(mm.every(fixtures, ['(a|b)/*', '*/*']));
  });

  it('should arrayify a string value', () => {
    assert(mm.every('a', '*'));
  });

  it('should treat patterns as a set (any positive / negation), not AND (#208)', () => {
    // Permission-style globs: each string needs to match *any* pattern
    assert(mm.every(['customer:read:self'], ['application:*', 'customer:*']));
    assert(mm.every(
      ['customer:read:self', 'application:write'],
      ['application:*', 'customer:*']
    ));
    assert(!mm.every(
      ['customer:read:self', 'unknown:write'],
      ['application:*', 'customer:*']
    ));
  });

  it('should honor negation patterns in the set', () => {
    assert(!mm.every(['foo.js', 'bar.js'], ['*.js', '!foo.js']));
    assert(!mm.every(['foo.js'], ['*.js', '!foo.js']));
    assert(mm.every(['bar.js'], ['*.js', '!foo.js']));
  });
});
