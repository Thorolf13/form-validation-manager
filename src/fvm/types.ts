import { AsyncValidator, Validator } from "../validators/validator";

export type ValidatorsTree = {
  [x: string]: Validator | AsyncValidator | ValidatorsTree;
}

export type EventsList = 'pending' | 'done' | 'error';

export type Indexes = { length: number; } & Record<string | number, number>
