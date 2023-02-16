import { Validator } from "fvm-validators";

export type ValidatorsTree<T> = {
  [K in keyof T]?: Validator | ValidatorsTree<T[K]>;
};
