import { Validator } from "./validator";

export type ValidatorTree<T> = {
  [K in keyof T]?: Validator | ValidatorTree<T[K]>;
};
