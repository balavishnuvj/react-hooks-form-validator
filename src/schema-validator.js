import Validator from 'fastest-validator';

const validator = new Validator();

// Register a custom 'regex' validator
validator.add('regex', (value) => {
  if (!(value instanceof RegExp))
    return validator.makeError('regex', null, value);
  return true;
});
export function getSchemaValidator(schema) {
  return validator.compile(schema);
}
