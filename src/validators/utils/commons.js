export const req = function (value) {
  if (value === null || value === undefined) {
    return 'NULL_UNDEFINED';
  }

  if (Array.isArray(value) && !value.length) {
    return 'ARRAY_EMPTY';
  }

  if (value instanceof Date && isNaN(value.getTime())) {
    // invalid date won't pass
    return 'DATE_INVALID';
  }

  if (typeof value === 'object' && Object.keys(value).length === 0) {
    return 'OBJECT_EMPTY';
  }

  if (typeof value === 'string' && value.trim() === '') {
    return 'STRING_EMPTY';
  }

  return false;
};
