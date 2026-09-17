/* eslint-disable eqeqeq, @typescript-eslint/unbound-method, @typescript-eslint/ban-types */
import type {ID} from './data/interface';

export function toID(text: any): ID {
  const lcase = ('' + text).toLowerCase();
  if (lcase === 'flabébé') {
    return 'flabebe' as ID;
  }
  return lcase.replace(/[^a-z0-9]+/g, '') as ID;
}

export function error(err: boolean, msg: string) {
  if (err) {
    throw new Error(msg);
  } else {
    console.log(msg);
  }
}

export function assignWithout(
  a: {[key: string]: any}, b: {[key: string]: any}, exclude: Set<string>
) {
  for (const key in b) {
    if (Object.prototype.hasOwnProperty.call(b, key) && !exclude.has(key)) {
      a[key] = b[key];
    }
  }
}

// https://github.com/krzkaczor/ts-essentials v6.0.5
// MIT License Copyright 2018-2019 Chris Kaczor
export type Primitive = string | number | boolean | bigint | symbol | undefined | null;
export type Builtin = Primitive | Function | Date | Error | RegExp;

export type IsTuple<T> =
  T extends [infer A] ? T
  : T extends [infer A, infer B] ? T
  : T extends [infer A, infer B, infer C] ? T
  : T extends [infer A, infer B, infer C, infer D] ? T
  : T extends [infer A, infer B, infer C, infer D, infer E] ? T
  : never;

export type DeepPartial<T> =
  T extends Builtin ? T
  : T extends Map<infer K, infer V> ? Map<DeepPartial<K>, DeepPartial<V>>
  : T extends ReadonlyMap<infer K, infer V> ? ReadonlyMap<DeepPartial<K>, DeepPartial<V>>
  : T extends Set<infer U> ? Set<DeepPartial<U>>
  : T extends ReadonlySet<infer U> ? ReadonlySet<DeepPartial<U>>
  : T extends Array<infer U> ? T extends IsTuple<T>
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : Array<DeepPartial<U>>
  : T extends Promise<infer U> ? Promise<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

// jQuery JavaScript Library v2.0.3
// Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
const class2Type: {[c: string]: string} = {
  '[object Boolean]': 'boolean',
  '[object Number]': 'number',
  '[object String]': 'string',
  '[object Function]': 'function',
  '[object Array]': 'array',
  '[object Date]': 'date',
  '[object RegExp]': 'regexp',
  '[object Object]': 'object',
  '[object Error]': 'error',
};

const coreToString = class2Type.toString;
const coreHasOwn = class2Type.hasOwnProperty;

function isFunction(obj: any) {
  return getType(obj) === 'function';
}

function isWindow(obj: any) {
  return obj != null && obj === obj.window;
}

function getType(obj: any) {
  if (obj == null) {
    return String(obj);
  }
  return typeof obj === 'object' || typeof obj === 'function'
    ? class2Type[coreToString.call(obj)] || 'object'
    : typeof obj;
}

function isPlainObject(obj: any) {
  if (getType(obj) !== 'object' || obj.nodeType || isWindow(obj)) {
    return false;
  }

  try {
    if (obj.constructor && !coreHasOwn.call(obj.constructor.prototype, 'isPrototypeOf')) {
      return false;
    }
  } catch (e) {
    return false;
  }

  return true;
}

export function extend(this: any, ...args: any[]) {
  let options, name, src, copy, copyIsArray, clone;
  let target = args[0] || {};
  let i = 1;
  let deep = false;
  const length = args.length;

  if (typeof target === 'boolean') {
    deep = target;
    target = args[1] || {};
    i = 2;
  }

  if (typeof target !== 'object' && !isFunction(target)) {
    target = {};
  }

  if (length === i) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    target = this;
    --i;
  }

  for (; i < length; i++) {
    if ((options = args[i]) != null) {
      // tslint:disable-next-line: forin
      for (name in options) {
        src = target[name];
        copy = options[name];

        if (target === copy) {
          continue;
        }

        if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
          if (copyIsArray) {
            copyIsArray = false;
            clone = src && Array.isArray(src) ? src : [];
          } else {
            clone = src && isPlainObject(src) ? src : {};
          }

          target[name] = extend(deep, clone, copy);
        } else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  }

  return target;
}
