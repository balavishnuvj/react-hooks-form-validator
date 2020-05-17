const PER_FIELD_CONFIG = {
  defaultValue: { type: 'any', optional: true },
  required: [
    { type: 'boolean', optional: true },
    {
      type: 'object',
      optional: true,
      props: {
        errorMsg: { type: 'string' },
      },
    },
  ],
  min: [
    { type: 'number', optional: true, positive: true, integer: true },
    {
      type: 'object',
      optional: true,
      props: {
        errorMsg: { type: 'string' },
        length: { type: 'number', positive: true, integer: true },
      },
    },
  ],
  max: [
    { type: 'number', optional: true, positive: true, integer: true },
    {
      type: 'object',
      optional: true,
      props: {
        errorMsg: { type: 'string' },
        length: { type: 'number', positive: true, integer: true },
      },
    },
  ],
  patterns: {
    type: 'array',
    items: {
      type: 'object',
      props: {
        regex: { type: 'regex' },
        errorMsg: { type: 'string' },
      },
    },
    optional: true,
  },
  validationFns: { type: 'array', items: 'function', optional: true },
  extraInfo: { type: 'any', optional: true },
};

export const PER_FIELD_SCHEMA = {
  $$strict: true, // no additional properties allowed
  ...PER_FIELD_CONFIG,
};

export const FIELD_CONFIG_SCHEMA = {
  $$strict: true, // no additional properties allowed
  configs: {
    type: 'array',
    items: {
      type: 'object',
      props: PER_FIELD_CONFIG,
    },
  },
};
