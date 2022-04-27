export const req = function (value: any) {
  if (value === null || value === undefined) {
    return 'NULL_UNDEFINED';
  }

  if (Array.isArray(value)) {
    if (!value.length) {
      return 'ARRAY_EMPTY';
    }
    else {
      return false;
    }
  }

  if (value instanceof Date) {
    if (isNaN(value.getTime())) {
      // invalid date won't pass
      return 'DATE_INVALID';
    } else {
      return false;
    }
  }

  if (typeof value === 'object') {
    for (let i in value) return false; //fast check
    if (Object.keys(value).length === 0 && Object.getPrototypeOf(value) === Object.prototype) { //exhaustive check
      return 'OBJECT_EMPTY';
    } else {
      return false;
    }
  }

  if (typeof value === 'string') {
    if (value.trim() === '') {
      return 'STRING_EMPTY';
    } else {
      return false;
    }
  }

  return false;
};
