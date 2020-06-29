import { get } from '../../commons/lodash';
import { Validator } from '../validator';

export default function revalidate(...paths: string[]) {
  let lock = false;

  return new Validator('revalidate', (value, context) => {
    if (lock) {
      return false;
    }

    lock = true;
    setTimeout(() => {
      lock = false;
    }, 100);


    try {
      for (const path of paths) {
        get(context.component._fvm.validation, path).validate();
      }
      context.component.$forceUpdate();
    } catch (e) { };
    return false;

  });
}
