import Validator from "fastest-validator";

const validator = new Validator({
  messages: {
    regex: "The '{field}' field must be an valid regex! Actual: {actual}",
  },
});

// Register a custom 'regex' validator
// validator.add("regex", (value) => {
//   if (!(value instanceof RegExp))
//     return validator.makeError("regex", null, value);
//   return true;
// });
validator.add("regex", function ({ schema, messages }, path, context) {
  return {
    source: `
          if (!(value instanceof RegExp))
              ${this.makeError({
                type: "regex",
                actual: "value",
                messages,
              })}

          return value;
      `,
  };
});
export function getSchemaValidator(schema) {
  return validator.compile(schema);
}
