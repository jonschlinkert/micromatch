'use strict';

const assert = require('assert');
const mm = require('..');

describe('issue-related tests', () => {
  it('micromatch issue #140', () => {
    let a = ['a/b/some/c.md', 'a/b/c.md', 'a/b-b/c.md', 'a/bb/c.md', 'a/bbc/c.md'];
    assert.deepEqual(mm(a, '**/b/**/c.md'), ['a/b/some/c.md', 'a/b/c.md']);

    let b = ['packages/foo-foo/package.json', 'packages/foo/package.json'];
    assert.deepEqual(mm(b, '**/foo/**/package.json'), ['packages/foo/package.json']);
  });

  it('micromatch issue#15', () => {
    assert(mm.isMatch('a/b-c/d/e/z.js', 'a/b-*/**/z.js'));
    assert(mm.isMatch('z.js', 'z*'));
    assert(mm.isMatch('z.js', '**/z*'));
    assert(mm.isMatch('z.js', '**/z*.js'));
    assert(mm.isMatch('z.js', '**/*.js'));
    assert(mm.isMatch('foo', '**/foo'));
  });

  it('micromatch issue#23', () => {
    assert(!mm.isMatch('zzjs', 'z*.js'));
    assert(!mm.isMatch('zzjs', '*z.js'));
  });

  it('micromatch issue#24', () => {
    assert(!mm.isMatch('a/b/c/d/', 'a/b/**/f'));
    assert(mm.isMatch('a', 'a/**'));
    assert(mm.isMatch('a', '**'));
    assert(mm.isMatch('a/', '**'));
    assert(mm.isMatch('a/b/c/d', '**'));
    assert(mm.isMatch('a/b/c/d/', '**'));
    assert(mm.isMatch('a/b/c/d/', '**/**'));
    assert(mm.isMatch('a/b/c/d/', '**/b/**'));
    assert(mm.isMatch('a/b/c/d/', 'a/b/**'));
    assert(mm.isMatch('a/b/c/d/', 'a/b/**/'));
    assert(mm.isMatch('a/b/c/d/e.f', 'a/b/**/**/*.*'));
    assert(mm.isMatch('a/b/c/d/e.f', 'a/b/**/*.*'));
    assert(mm.isMatch('a/b/c/d/g/e.f', 'a/b/**/d/**/*.*'));
    assert(mm.isMatch('a/b/c/d/g/g/e.f', 'a/b/**/d/**/*.*'));
  });

  it('micromatch issue#58 - only match nested dirs when `**` is the only thing in a segment', () => {
    assert(!mm.isMatch('a/b/c', 'a/b**'));
    assert(!mm.isMatch('a/c/b', 'a/**b'));
  });

  it('micromatch issue#63 (dots)', () => {
    assert(!mm.isMatch('/aaa/.git/foo', '/aaa/**/*'));
    assert(!mm.isMatch('/aaa/bbb/.git', '/aaa/bbb/*'));
    assert(!mm.isMatch('/aaa/bbb/.git', '/aaa/bbb/**'));
    assert(!mm.isMatch('/aaa/bbb/ccc/.git', '/aaa/bbb/**'));
    assert(!mm.isMatch('aaa/bbb/.git', 'aaa/bbb/**'));
    assert(mm.isMatch('/aaa/.git/foo', '/aaa/**/*', { dot: true }));
    assert(mm.isMatch('/aaa/bbb/', '/aaa/bbb/**'));
    assert(mm.isMatch('/aaa/bbb/.git', '/aaa/bbb/*', { dot: true }));
    assert(mm.isMatch('/aaa/bbb/.git', '/aaa/bbb/**', { dot: true }));
    assert(mm.isMatch('/aaa/bbb/ccc/.git', '/aaa/bbb/**', { dot: true }));
    assert(mm.isMatch('/aaa/bbb/foo', '/aaa/bbb/**'));
    assert(mm.isMatch('aaa/bbb/.git', 'aaa/bbb/**', { dot: true }));
  });

  it('micromatch issue#79', () => {
    assert(mm.isMatch('a/foo.js', '**/foo.js'));
    assert(mm.isMatch('foo.js', '**/foo.js'));
    assert(mm.isMatch('a/foo.js', '**/foo.js', { dot: true }));
    assert(mm.isMatch('foo.js', '**/foo.js', { dot: true }));
  });

  // https://github.com/micromatch/micromatch/issues/300
  it('micromatch issue#300 - zero-padded and stepped brace ranges', () => {
    assert.deepEqual(mm.braces('file{01..05}.txt', { expand: true }), [
      'file01.txt',
      'file02.txt',
      'file03.txt',
      'file04.txt',
      'file05.txt'
    ]);

    assert(mm.isMatch('file04.txt', 'file{01..05}.txt'));
    assert(mm.isMatch('file01.txt', 'file{01..05}.txt'));
    assert(mm.isMatch('file05.txt', 'file{01..05}.txt'));
    assert(!mm.isMatch('file00.txt', 'file{01..05}.txt'));
    assert(!mm.isMatch('file06.txt', 'file{01..05}.txt'));

    assert.deepEqual(mm(['file01.txt', 'file04.txt', 'file99.txt'], 'file{01..05}.txt'), [
      'file01.txt',
      'file04.txt'
    ]);

    assert(mm.isMatch('4', '{2..10..2}'));
    assert(mm.isMatch('10', '{2..10..2}'));
    assert(!mm.isMatch('3', '{2..10..2}'));
    assert(!mm.isMatch('5', '{2..10..2}'));

    // plain ranges still work
    assert(mm.isMatch('file4.txt', 'file{1..5}.txt'));
    assert(mm.isMatch('b', '{a..c}'));

    assert(mm.makeRe('file{01..05}.txt').test('file04.txt'));
    assert(mm.makeRe('{2..10..2}').test('4'));
    assert(!/01\.\.05/.test(mm.makeRe('file{01..05}.txt').source));
  });
});
