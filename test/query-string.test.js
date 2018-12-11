import { parse, stringify } from '../lib';
import { expect } from 'chai';

describe('QueryString', () => {
  describe('#parse()', () => {
    it('should parse it as one pair of key-value', () => {
      const obj = { a: '1' };
      expect(parse('a=1')).to.deep.eq(obj);
    });

    it('should parse it as two pairs of key-value', () => {
      const obj = { a: '1', b: 's' };
      expect(parse('a=1&b=s')).to.deep.eq(obj);
    });

    it('should parse the same name key as an array', () => {
      const obj = { a: '1', b: ['s', 's2'] };
      expect(parse('a=1&b=s&b=s2')).to.deep.eq(obj);
    });

    it('should ignore the key without value', () => {
      const obj = { a: '1', b: 's' };
      expect(parse('a=1&b=s&c')).to.deep.eq(obj);
    });

    it('should parse search from URL', () => {
      const obj = { a: '1', b: 's' };
      expect(parse('http://foo.com?a=1&b=s')).to.deep.eq(obj);
    });

    it('should parse it when if value is encoded', () => {
      const obj = { test: 'test &* test' };
      expect(parse('test=test%20%26*%20test')).to.deep.eq(obj);
    });

    it('should parse it when if key and value are encoded', () => {
      const obj = { 'test=': 'test &* test' };
      expect(parse('test%3D=test%20%26*%20test')).to.deep.eq(obj);
    });

    it('should parse it when if sep and eq are specified', () => {
      const obj = { a: '1', b: ['s', 's2'] };
      expect(parse('a#1|b#s|b#s2', '|', '#')).to.deep.eq(obj);
    });

    it('should parse it for customize value', () => {
      const fn = (key, value) => {
        if (key === 'b') return +value;
        if (key === 'c') return { on: true, off: false }[value];
        return value;
      };
      const obj = { a: 'test', b: 1, c: true };
      expect(parse('a=test&b=1&c=on', null, null, fn)).to.deep.eq(obj);
    });
  });

  describe('#stringify()', () => {
    it('should stringify one pair key-value', () => {
      expect(stringify({ a: '1' })).to.eq('a=1');
    });

    it('should stringify two pairs key-value', () => {
      expect(stringify({ a: '1', b: 's' })).to.eq('a=1&b=s');
    });

    it('should stringify the array to same name key', () => {
      expect(stringify({ a: '1', b: ['s', 's2'] })).to.eq('a=1&b=s&b=s2');
    });

    it('should stringify the boolean value', () => {
      expect(stringify({ a: '1', b: 's', c: false })).to.eq('a=1&b=s&c=false');
    });

    it('should stringify it when if the value need to encoded', () => {
      const str = 'test=test%20%26*%20test';
      expect(stringify({ test: 'test &* test' })).to.eq(str);
    });

    it('should stringify it when if the key and value need to encoded', () => {
      const str = 'test%3D=test%20%26*%20test';
      expect(stringify({ 'test=': 'test &* test' })).to.eq(str);
    });

    it('should stringify it when if sep and eq are specified', () => {
      const str = 'a#1|b#s|b#s2';
      expect(stringify({ a: '1', b: ['s', 's2'] }, '|', '#')).to.eq(str);
    });

    it('should stringify it for customize value', () => {
      const fn = (key, value) => {
        if (key === 'c') return value ? 'on' : 'off';
        return value;
      };
      const obj = { a: 'test', b: 1, c: true };
      const str = 'a=test&b=1&c=on';
      expect(stringify(obj, null, null, fn)).to.deep.eq(str);
    });
  });
});
