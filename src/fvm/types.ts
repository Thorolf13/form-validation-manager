import { Validator } from "..";

export type Component = any;

export type ValidatorsTree = {
  [x: string]: Validator | ValidatorsTree;
}
