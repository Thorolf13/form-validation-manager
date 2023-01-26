import pick from "./pick";
import { Validator } from '../validator';

export default function length(validator: Validator) {
  return pick('length', validator)
}
