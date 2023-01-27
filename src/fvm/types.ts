import { Validator } from "../validators/validator";

export type ValidatorsTree = {
  [x: string]: Validator | ValidatorsTree;
}

export type EventsList = 'pending' | 'done' | 'error';

export type Indexes = { length: number; } & Record<string | number, number>
