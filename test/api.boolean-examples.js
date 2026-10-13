'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const mm = require('..');

describe('boolean matching documentation', () => {
  const source = fs.readFileSync(path.join(__dirname, '../index.js'), 'utf8');

  for (const name of ['some', 'every', 'all']) {
    it(`should produce the documented results for .${name}()`, () => {
      const declaration = source.indexOf(`micromatch.${name} =`);
      const comment = source.slice(source.lastIndexOf('/**', declaration), declaration);
      const example = comment.match(/```js\n([\s\S]*?)\n \* ```/)[1]
        .replace(/^ \* ?/gm, '');
      const expected = [];
      example.replace(/^\/\/ (true|false)$/gm, (line, value) => {
        expected.push(value === 'true');
        return line;
      });
      const actual = [];
      vm.runInNewContext(example, {
        require: name => {
          assert.strictEqual(name, 'micromatch');
          return mm;
        },
        console: { log: value => actual.push(value) }
      });
      assert(expected.length > 0);
      assert.deepStrictEqual(actual, expected);
    });
  }
});
