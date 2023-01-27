
import required from './validators/required';

import lt from './validators/numeric/lt';
import lte from './validators/numeric/lte';
import gt from './validators/numeric/gt';
import gte from './validators/numeric/gte';
import eq from './validators/eq';
import numeric from './validators/numeric/numeric';
import between from './validators/numeric/between';

import isString from './validators/string/is-string';
import isDate from './validators/string/is-date';
import regexp from './validators/string/regexp';
import includes from './validators/string/includes';
import email from './validators/string/email';

import withMessage from './validators/utils/with-message';
import custom from './validators/utils/custom';
import async from './validators/utils/async';
import revalidate from './validators/utils/revalidate';
import empty from './validators/utils/empty';
import pick from './validators/utils/pick';
import length from './validators/utils/length';

import or from './validators/logic/or';
import xor from './validators/logic/xor';
import and from './validators/logic/and';
import andSequence from './validators/logic/and_sequence';
import not from './validators/logic/not';
import _if from './validators/logic/if';
import optional from './validators/logic/optional';

import { Validator, Context } from './validators/validator'

import mixin from './vue-integration/mixin';
import { useFvm } from './vue-integration/use';


const Fvm = mixin;
const FormvalidationManager = mixin;

export {
  Fvm,
  FormvalidationManager,
  useFvm,

  required,
  eq,

  lt,
  lte,
  gt,
  gte,
  numeric,
  between,

  isDate,
  isString,
  regexp,
  includes,
  email,

  or,
  xor,
  and,
  andSequence,
  not,
  _if,
  optional,

  withMessage,
  custom,
  async,
  revalidate,
  empty,
  pick,
  length,

  Validator,
  Context
};
