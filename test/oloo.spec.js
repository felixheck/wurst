const test = require('tape').test;
const oloo = require('../src/oloo');

const mockObj_1 = {
  foo: 'foo'
};

const mockObj_2 = {
  bar: 'bar'
};

test('oloo >> returns null', assert => {
  assert.equal(oloo('foo', 42), null);
  assert.end();
});

test('oloo >> merges objects', assert => {
  const merged = oloo(mockObj_1, mockObj_2);

  assert.equal(merged.foo, 'foo');
  assert.equal(merged.bar, 'bar');
  assert.end();
});

test('oloo >> defines first object as prototype', assert => {
  const merged = oloo(mockObj_1, mockObj_2);

  assert.deepEqual(Object.getPrototypeOf(merged), mockObj_1);
  assert.end();
});