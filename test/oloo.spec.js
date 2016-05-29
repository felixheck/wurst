const test = require('tape').test;
const oloo = require('../src/oloo');

const mockObj_1 = {
  foo: 'foo'
};

const mockObj_2 = {
  bar: 'bar'
};

test('oloo >> returns null', t => {
  t.equal(oloo('foo', 42), null);
  t.end();
});

test('oloo >> merges objects', t => {
  const merged = oloo(mockObj_1, mockObj_2);

  t.equal(merged.foo, 'foo');
  t.equal(merged.bar, 'bar');
  t.end();
});

test('oloo >> defines first object as prototype', t => {
  const merged = oloo(mockObj_1, mockObj_2);

  t.deepEqual(Object.getPrototypeOf(merged), mockObj_1);
  t.end();
});