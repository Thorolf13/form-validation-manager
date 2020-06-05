export default function custom(callback: HasErrorCallback) {
  return new Validator('custom', callback);
}
