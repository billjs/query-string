# query-string [![Travis-ci Status](https://api.travis-ci.org/billjs/query-string.svg?branch=master)](https://travis-ci.org/billjs/query-string) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/billjs/query-string/blob/master/LICENSE) ![typescript | javascript | node.js](https://img.shields.io/badge/language-typescript%20%7C%20javascript%20%7C%20node.js-yellow.svg) [![Npm Version](https://img.shields.io/npm/v/@billjs/query-string.svg)](https://www.npmjs.com/package/@billjs/query-string) [![NPM Download](https://img.shields.io/npm/dm/@billjs/query-string.svg)](https://npmcharts.com/compare/@billjs/query-string?minimal=true)

A simple and lightweight QueryString library by TypeScript for node.js or browsers.

## Installation

Installation is done using the `npm install` command:

```shell
npm install -S @billjs/query-string
```

## Overview

- [parse](#parse)
- [stringify](#stringify)

## API

### parse

Parse the string to an object. Support the parsing of multiple keys with the same name, and parse them into arrays.
The parsed keys and values are decoded by `decodeURIComponent` function.
If you specified the `fn` argument, that means you can to use it for customize value.

- **str** (`string`) source string
- _**[sep]**_ (`string` | `null` `optional`) group separator, default `&`
- _**[eq]**_ (`string` | `null` `optional`) key-value separator, default `=`
- _**[fn]**_ ([ParseFunction](#parsefunction)) a function, it can be used to customize return values.
- **return** (`object`)

Parse a normal query-string.

```typescript
const data = parse('a=1&b=s');
console.log(data); // ==> { a: '1', b: 's' }
```

Parse the search from URL.

```typescript
const data = parse('http://foo.com?a=1&b=s');
console.log(data); // ==> { a: '1', b: 's' }
```

Parse it when if key or value is encoded.

```typescript
const data = parse('test%3D=test%20%26*%20test');
console.log(data); // ==> { 'test=': 'test &* test' }
```

Parse it when if sep and eq are specified.

```typescript
const data = parse('a#1|b#s|b#s2', '|', '#');
console.log(data); // ==> { a: '1', b: ['s', 's2'] }
```

Parse the same name key as an array.

```typescript
const data = parse('a=1&b=s1&b=s2');
console.log(data); // ==> { a: '1', b: ['s1', 's2'] }
```

Parse it for customize value.

```typescript
const fn = (key: string, value: string) => {
  if (key === 'b') return +value;
  if (key === 'c') return { on: true, off: false }[value];
  return value;
};
const data = parse('a=test&b=1&c=on', null, null, fn);
console.log(data); // ==> { a: 'test', b: 1, c: true }
```

### stringify

Stringify the object to a string. Support the stringifying of arrays into keys of the same name.
The stringified keys and values are encoded by `encodeURIComponent` function.
If you specified the `fn` argument, that means you can to use it for customize value.

- **obj** (`object`) source object
- _**[sep]**_ (`string` | `null` `optional`) group separator, default `&`
- _**[eq]**_ (`string` | `null` `optional`) key-value separator, default `=`
- _**[fn]**_ ([StringifyFunction](#stringifyfunction)) a function, it can be used to customize return values.
- **return** (`string`)

Stringify an object.

```typescript
const query = stringify({ a: '1', b: 's' });
console.log(query); // ==> 'a=1&b=s'
```

Stringify the array to same name key.

```typescript
const query = stringify({ a: '1', b: ['s1', 's2'] });
console.log(query); // ==> 'a=1&b=s1&b=s2'
```

Stringify the boolean value.

```typescript
const query = stringify({ a: '1', b: 's', c: false });
console.log(query); // ==> 'a=1&b=s&c=false'
```

Stringify it when if the key or value need to encoded.

```typescript
const query = stringify({ 'test=': 'test &* test' });
console.log(query); // ==> 'test%3D=test%20%26*%20test'
```

Stringify it when if sep and eq are specified.

```typescript
const query = stringify({ a: '1', b: ['s', 's2'] }, '|', '#');
console.log(query); // ==> 'a#1|b#s|b#s2'
```

Stringify it for customize value.

```typescript
const fn = (key, value) => {
  if (key === 'c') return value ? 'on' : 'off';
  return value;
};
const obj = { a: 'test', b: 1, c: true };
const query = stringify(obj, null, null, fn);
console.log(query); // ==> 'a=test&b=1&c=on'
```

### ParseFunction

A function for customize parse.

The declaration is like this:

```typescript
type ParseFunction = (key: string, value: string) => any;
```

### StringifyFunction

A function for customize stringify.

The declaration is like this:

```typescript
type StringifyFunction = (key: string, value: any) => any;
```

## License

[MIT License](LICENSE)
