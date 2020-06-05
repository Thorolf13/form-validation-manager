import and from './logic/and';
import lt from './lt';
import lte from './lte';
import gt from './gt';
import gte from './gte';

export default function between(min: number, max: number, exclusive = false) {
  return new Validator('between', (value, context) => {
    return and(
      exclusive ? lt(max) : lte(max),
      exclusive ? gt(min) : gte(min),
    ).hasError(value, context);
  });
}
