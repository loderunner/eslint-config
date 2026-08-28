// This file is deliberately plain JavaScript (not TypeScript). The fourteen
// eslint:recommended members below are turned "off" by the typescript
// preset's `overrides` entry scoped to `**/*.ts`, `**/*.tsx`, `**/*.mts`,
// `**/*.cts` (they are superseded by TypeScript's own compiler checks on
// TS files - see plan Part 4, "@typescript-eslint/eslint-recommended
// adjustments"). They remain on (via `categories.correctness`) for plain
// JS files, which is what this fixture demonstrates - one violation per
// rule, grouped in a single file since they are all simple, independent
// correctness-level eslint:recommended checks. `no-with` needs sloppy
// (non-module) script mode, which this ESM file cannot provide - see
// `base-no-with.cjs` instead.

class Base {}

class ThisBeforeSuper extends Base {
  constructor() {
    console.log(this); // no-this-before-super
    super();
  }
}

class NoConstructorSuper extends Base {
  constructor() {
    // no call to super() at all - constructor-super
  }
}

function makeGetterWithoutReturn() {
  return {
    get value() {
      // getter-return: no return statement
    },
  };
}

class ClassAssign {}
ClassAssign = class {}; // no-class-assign

const CONST_VALUE = 1;
CONST_VALUE = 2; // no-const-assign

class DupeMembers {
  method() {
    return 1;
  }
  method() {
    // no-dupe-class-members
    return 2;
  }
}

const dupeKeyObject = {
  key: 1,
  key: 2, // no-dupe-keys
};

function funcAssign() {}
funcAssign = function replaced() {}; // no-func-assign

import * as fsNamespace from 'node:fs';
fsNamespace.readFileSync = () => ''; // no-import-assign

function newNativeNonconstructor() {
  return new Symbol('broken'); // no-new-native-nonconstructor
}

function objCalls() {
  return Math(); // no-obj-calls
}

const setterReturnsValue = {
  set value(v) {
    return v; // no-setter-return
  },
};

function unreachable() {
  return 1;
  console.log('never runs'); // no-unreachable
}

function unsafeNegation(value) {
  // prettier-ignore
  return !value in {}; // no-unsafe-negation
}

export {
  makeGetterWithoutReturn,
  newNativeNonconstructor,
  objCalls,
  setterReturnsValue,
  unreachable,
  unsafeNegation,
};
