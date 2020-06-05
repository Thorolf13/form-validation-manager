import pick from "./pick";

export default function length(validator: Validator) {
  return pick('length', validator)
}
