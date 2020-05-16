import { getSchemaValidator } from './schema-validator'
import { PER_FIELD_SCHEMA, FIELD_CONFIG_SCHEMA } from './constants';

const fieldSchemaValidator = getSchemaValidator(
  FIELD_CONFIG_SCHEMA,
);

const perFieldSchemaValidator = getSchemaValidator(
  PER_FIELD_SCHEMA,
);

export function getDefaultValues(formFieldConfig) {
  const defaultValues = {};
  if (!formFieldConfig) {
    return defaultValues;
  }
  Object.entries(formFieldConfig).forEach(([fieldName, fieldConfig]) => {
    defaultValues[fieldName] = fieldConfig.defaultValue;
  });
  return defaultValues;
}

export function getDefaultErrors(formFieldConfig) {
  const defaultErrors = {};
  if (!formFieldConfig) {
    return defaultErrors;
  }
  Object.entries(formFieldConfig).forEach(([fieldName, fieldConfig]) => {
    defaultErrors[fieldName] = {
      isValid: !fieldConfig.required,
    };
  });
  return defaultErrors;
}

export async function getFieldError(formState, fieldName, formFieldConfig) {
  const { required, min, max, patterns, validationFns } = formFieldConfig[
    fieldName
  ];
  const fieldValue = formState[fieldName];
  if (validationFns && validationFns.length) {
    try {
      const validationResults = await Promise.all(
        validationFns.map((asyncValidationFn) =>
          asyncValidationFn(formState[fieldName], formState),
        ),
      );
      const [valid, errorMsg] = validationResults.find(
        ([validationStatus]) => !validationStatus,
      ) || [true];
      if (!valid) {
        return errorMsg || 'Invalid input';
      }
    } catch (error) {
      return `Couldn't validate`;
    }
  }
  if (!required && !fieldValue) {
    return '';
  }
  if (required && !fieldValue) {
    if (typeof required === 'object' && required.errorMsg) {
      return required.errorMsg;
    }
    return 'This is a required field';
  }
  if (min) {
    let minLength = min;
    let errorMsg = '';
    if (typeof min === 'object') {
      errorMsg = min.errorMsg;
      minLength = min.length;
    }
    if (fieldValue.length < minLength) {
      return errorMsg || `Atleast ${min} charecters required`;
    }
  }
  if (max) {
    let maxLength = max;
    let errorMsg = '';
    if (typeof max === 'object') {
      errorMsg = max.errorMsg;
      maxLength = max.length;
    }
    if (fieldValue.length > maxLength) {
      return errorMsg || `Should not be more than ${max} chatacters`;
    }
  }
  if (patterns) {
    const failedRegex = patterns.find(
      (pattern) => !pattern.regex.test(fieldValue),
    );
    if (failedRegex) {
      return failedRegex.errorMsg || `Required pattern doesn't match`;
    }
  }
  return '';
}

export function validatePerFieldSchema(fieldConfig) {
  if (!fieldConfig) {
    throw new Error(`Field configuration can't be null/undefined`);
  }
  const validationResult = perFieldSchemaValidator(fieldConfig);
  if (validationResult !== true) {
    const error = new Error('Invalid schema for field configuration');
    throw error;
  }
}

export function validateFieldConfig(formFieldConfig) {
  if (!formFieldConfig) {
    throw new Error(`Field configuration can't be null/undefined`);
  }
  const configs = Object.entries(formFieldConfig).map(([, config]) => config);
  const validationResult = fieldSchemaValidator({ configs });
  if (validationResult !== true) {
    const error = new Error('Invalid schema for field configuration');
    throw error;
  }
}

export function getFormValidity(formErrors) {
  return Object.entries(formErrors).every(
    ([, errorState]) => errorState.isValid,
  );
}

export async function getFormErrors(fieldConfig, formValues) {
  const errors = {};
  const allFieldsNames = Object.keys(fieldConfig);
  const validationResults = await Promise.all(
    allFieldsNames.map(async (fieldName) =>
      getFieldError(formValues, fieldName, fieldConfig),
    ),
  );
  validationResults.forEach((errorMsg, index) => {
    const fieldName = allFieldsNames[index];
    errors[fieldName] = {
      isValid: !errorMsg,
      errorMsg,
    };
  });
  return [getFormValidity(errors), errors];
}

export function twoLevelCopy(object) {
  const newObject = {};
  Object.entries(object).forEach(([key, value]) => {
    newObject[key] = { ...value };
  });
  return newObject;
}

export function getFieldConfig(config, hasConfigRef) {
  if (!hasConfigRef.current) {
    return twoLevelCopy(config);
  }
  return null;
}
