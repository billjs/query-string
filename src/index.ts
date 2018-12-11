/**
 * A simple and lightweight EventEmitter by TypeScript for Node.js or Browsers.
 *
 * @author billjs
 * @see https://github.com/billjs/query-string
 * @license MIT(https://github.com/billjs/query-string/blob/master/LICENSE)
 */

export type QueryObject = Record<string, any>;

export type ParseFunction = (key: string, value: string) => any;
export type StringifyFunction = (key: string, value: any) => any;

/**
 * parse the string to an object.
 * support the parsing of multiple keys with the same name, and parse them into arrays.
 * the parsed keys and values are decoded by `decodeURIComponent` function.
 * if you specified the `fn` argument, that means you can to use it for customize value.
 *
 * @export
 * @param {string} str source string
 * @param {string | null} [sep='&'] group separator, default `&`
 * @param {string | null} [eq='='] key-value separator, default `=`
 * @param {ParseFunction} [fn] a function, it can be used to customize return values.
 * @returns {QueryObject}
 * @example
 *  // 1. parse a normal query-string
 *  parse('a=1&b=s');
 *  // ==> { a: '1', b: 's' }
 *  // 2. parse the search from URL
 *  parse('http://foo.com?a=1&b=s');
 *  // ==> { a: '1', b: 's' }
 *  // 3. specified seq and eq
 *  parse('a#test|b#1', '|', '#');
 *  // ==> { a: 'test', b: '1' }
 *  // 4. parse a encoded query-string
 *  parse('a=test1%26test2');
 *  // ==> { a: 'test1 & test2' }
 *  // 5. customize value
 *  parse('a=test&b=1&c=on', null, null, (key, value) => {
 *    if (key === 'b') return +value;
 *    if (key === 'c') return { on: true, off: false }[value];
 *    return value;
 *  });
 *  // ==> { a: 'test', b: 1, c: true }
 *  // 6. parse a query-string have same keys
 *  parse('a=test1&b=1&a=test2');
 *  // => { a: ['test1', 'test2'], b: '1' }
 */
export function parse(
  str: string,
  sep?: string | null,
  eq?: string | null,
  fn?: ParseFunction
) {
  const obj: QueryObject = {};
  if (!str || typeof str !== 'string') return obj;

  if (!sep) sep = '&';
  if (!eq) eq = '=';

  if (!fn || typeof fn !== 'function') {
    fn = (key: string, value: string) => value;
  }

  // stripping the query preceding part of the URL
  str = str.replace(/.*?\?/, '');

  const groups = str.split(sep);

  for (const group of groups) {
    const keyValue = group.split(eq);

    // if it is a invalid key-value, ignore it.
    if (keyValue.length !== 2) continue;

    // call decodeURIComponent function to decode key and value
    const key = decodeURIComponent(keyValue[0]);
    let value: string | number | boolean = decodeURIComponent(keyValue[1]);

    // if the `fn` argument is passed,
    // then call it and replace the value with the returned.
    value = fn(key, value);

    // if the key is the same name, it's treated as an array.
    if (obj[key] !== void 0) {
      if (!Array.isArray(obj[key])) obj[key] = [obj[key]];
      obj[key].push(value);
      continue;
    }

    obj[key] = value;
  }

  return obj;
}

/**
 * stringify the object to a string.
 * support the stringifying of arrays into keys of the same name.
 * the stringified keys and values are encoded by `encodeURIComponent` function.
 * if you specified the `fn` argument, that means you can to use it for customize value.
 *
 * @export
 * @param {QueryObject} obj object
 * @param {(string | null)} [sep='&'] group separator, default `&`
 * @param {(string | null)} [eq='='] key-value separator, default `=`
 * @param {StringifyFunction} [fn] a function, it can be used to customize return values.
 * @returns {string}
 * @example
 *  // 1. stringify an object
 *  stringify({ a: 'test', b: '1' });
 *  // ==> 'a=test&b=1'
 *  // 2. specified seq and eq
 *  stringify({ a: 'test', b: '1' }, '|', '#');
 *  // ==> 'a#test|b#1'
 *  // 3. encode key or value
 *  stringify({ a: 'test1 & test2' });
 *  // ==> 'a=test1%26test2'
 *  // 4. customize value
 *  stringify({ a: 'test', b: 1, c: true }, null, null, (key, value) => {
 *    if (key === 'c') return value ? 'on' : 'off';
 *    return value;
 *  });
 *  // ==> 'a=test&b=1&c=on'
 *  // 5. stringify the array to same name key
 *  stringify({ a: ['test1', 'test2'], b: '1' });
 *  // => 'a=test1&a=test2&b=1'
 */
export function stringify(
  obj: QueryObject,
  sep?: string | null,
  eq?: string | null,
  fn?: StringifyFunction
) {
  if (obj == null || !isObject(obj)) return '';

  if (!sep) sep = '&';
  if (!eq) eq = '=';

  if (!fn || typeof fn !== 'function') {
    fn = (key: string, value: any) => value;
  }

  const qs: string[] = [];
  const keys = Object.keys(obj);

  for (const key of keys) {
    const _key = encodeURIComponent(key);
    let value = obj[key];

    // if it is a undefined value, ignore it.
    if (value === void 0) continue;

    // if value is an array, expand it into multiple key-values by the same name key.
    if (Array.isArray(value)) {
      for (let val of value) {
        val = fn(key, val);
        qs.push([_key, encodeURIComponent(val)].join(eq));
      }
      continue;
    }

    // if the `fn` argument is passed,
    // then call it and replace the value with the returned.
    value = fn(key, value);
    qs.push([_key, encodeURIComponent(value)].join(eq));
  }

  return qs.join(sep);
}

function isObject(obj: QueryObject) {
  const type = typeof obj;
  return (obj && (type === 'object' || type === 'function')) || false;
}
