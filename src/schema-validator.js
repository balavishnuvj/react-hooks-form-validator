import Validator from "fastest-validator";

const validator = new Validator({
  messages: {
    regex: "The '{field}' field must be an valid regex! Actual: {actual}",
  },
});

validator.add("regex", function ({ messages }) {
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
