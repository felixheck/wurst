const chai = require('chai');
const oloo = require('../src/oloo');

const expect = chai.expect;

const mockObj_1 = {
  foo: 'foo'
};

const mockObj_2 = {
  bar: 'bar'
};

describe('oloo', () => {
  it('returns null', () => {
    expect(oloo('foo', 42)).to.equal(null);
  });

  it('merges objects', () => {
    expect(oloo(mockObj_1, mockObj_2)).to.eql({
      foo: 'foo',
      bar: 'bar'
    })
  });

  it('defines first object as prototype', () => {
    const merged = oloo(mockObj_1, mockObj_2);

    expect(Object.getPrototypeOf(merged)).to.eql(mockObj_1);
  });
});
