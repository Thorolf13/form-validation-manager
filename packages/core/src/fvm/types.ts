import { Validator } from "fvm-validators";

export type ValidatorsTree = {
  [x: string]: Validator | ValidatorsTree;
}

export type EventsList = 'pending' | 'done' | 'error';
