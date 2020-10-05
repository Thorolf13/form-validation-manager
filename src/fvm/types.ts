import { Validator } from "..";
import { AsyncValidator } from "..";

export type Component = any;

export type ValidatorsTree = {
  [x: string]: Validator | AsyncValidator | ValidatorsTree;
}

export type EventsList = 'pending' | 'done';
