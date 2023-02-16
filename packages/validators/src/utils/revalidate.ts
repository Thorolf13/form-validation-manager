import { Validator } from '../validator';

export default function revalidate (...paths: string[]) {
  let lock = false;

  return new Validator('revalidate', (value, context) => {
    if (lock) {
      return false;
    }

    lock = true;
    setTimeout(() => {
      lock = false;
    }, 100);

    return paths.map(path => '::revalidate::' + path);
  });
}
