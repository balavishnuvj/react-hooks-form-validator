import { useRef, useEffect, useCallback, useState, useMemo } from 'react';
import {
  getDefaultValues,
  getFieldError,
  validateFieldConfig,
  validatePerFieldSchema,
  getDefaultErrors,
  getFormValidity,
  getFormErrors,
  twoLevelCopy,
  getFieldConfig,
} from './utilities';

export default function useNewForm(fieldConfig) {
  const hasFieldConfigSet = useRef(false);
  const fieldConfigRef = useRef(getFieldConfig(fieldConfig, hasFieldConfigSet));
  const formValuesAsRef = useRef(getDefaultValues(fieldConfigRef.current));
  const intialStateRef = useRef();
  const [formValues, setFormValues] = useState(formValuesAsRef.current);
  const [isFormTouched, setIsFormTouched] = useState(false);
  const [formErrors, setFormErrors] = useState(() =>
    getDefaultErrors(fieldConfigRef.current),
  );

  const setFieldValue = useCallback((fieldName, value) => {
    formValuesAsRef.current[fieldName] = value;
    setFormValues((currentValues) => ({
      ...currentValues,
      [fieldName]: value,
    }));
    setIsFormTouched(true);
  }, []);

  const setFieldError = useCallback((fieldName, errorMsg) => {
    setFormErrors((currentErrors) => {
      if (
        currentErrors[fieldName].isValid !== !errorMsg ||
        currentErrors[fieldName].errorMsg !== errorMsg
      ) {
        return {
          ...currentErrors,
          [fieldName]: {
            isValid: !errorMsg,
            errorMsg,
          },
        };
      }
      return currentErrors;
    });
  }, []);

  const validateFieldAndSetErrorIfValueExists = useCallback(
    async (fieldName, currentFormValues) => {
      const errorMsg = await getFieldError(
        currentFormValues,
        fieldName,
        fieldConfigRef.current,
      );
      setFormErrors((currentErrors) => {
        if (
          !currentErrors[fieldName] ||
          currentErrors[fieldName].isValid !== !!errorMsg ||
          currentErrors[fieldName].errorMsg !== errorMsg
        ) {
          return {
            ...currentErrors,
            [fieldName]: {
              isValid: !errorMsg,
              errorMsg: currentFormValues[fieldName] ? errorMsg : '',
            },
          };
        }
        return currentErrors;
      });
    },
    [],
  );

  const validateFormFieldAndSetError = useCallback(
    async (fieldName) => {
      const fieldError = await getFieldError(
        formValuesAsRef.current,
        fieldName,
        fieldConfigRef.current,
      );
      setFieldError(fieldName, fieldError);
    },
    [setFieldError],
  );

  const setFieldValueAndValidate = useCallback(
    (fieldName, value) => {
      setFieldValue(fieldName, value);
      validateFormFieldAndSetError(fieldName);
    },
    [setFieldValue, validateFormFieldAndSetError],
  );

  const validateForm = useCallback(async () => {
    const [, errors] = await getFormErrors(
      fieldConfigRef.current,
      formValuesAsRef.current,
    );
    setFormErrors(errors);
  }, []);

  const updateFieldConfig = useCallback(
    async (fieldName, fieldConfigUpdater) => {
      const currentFieldConfig = fieldConfigRef.current[fieldName];
      const newFieldConfig = fieldConfigUpdater(
        currentFieldConfig,
        formValuesAsRef.current,
      );
      const hasConfigChanged = Object.keys(newFieldConfig).some(
        (name) => currentFieldConfig[name] !== newFieldConfig[name],
      );
      if (hasConfigChanged) {
        const newMergedConfig = {
          ...currentFieldConfig,
          ...newFieldConfig,
        };
        validatePerFieldSchema(newMergedConfig);
        fieldConfigRef.current[fieldName] = newMergedConfig;
        validateFieldAndSetErrorIfValueExists(
          fieldName,
          formValuesAsRef.current,
        );
      }
    },
    [validateFieldAndSetErrorIfValueExists],
  );

  const addFieldConfig = useCallback(
    async (fieldName, fieldConfigOrUpdater) => {
      const isFieldAlreadPresent = !!fieldConfigRef.current[fieldName];
      if (isFieldAlreadPresent) {
        const error = new Error(
          `${fieldName} already exists. Please use ${fieldName}.updateConfig instead`,
        );
        throw error;
      }

      let newFieldConfig = fieldConfigOrUpdater;
      if (typeof newFieldConfig === 'function') {
        newFieldConfig = fieldConfigOrUpdater(formValuesAsRef.current);
      }
      validatePerFieldSchema(newFieldConfig);
      fieldConfigRef.current[fieldName] = newFieldConfig;
      setFieldValue(fieldName, newFieldConfig.defaultValue);
      validateFieldAndSetErrorIfValueExists(fieldName, formValuesAsRef.current);
      return fieldConfigRef.current;
    },
    [setFieldValue, validateFieldAndSetErrorIfValueExists],
  );

  const removeFieldConfig = useCallback(async (fieldName) => {
    const isFieldAlreadPresent = !!fieldConfigRef.current[fieldName];
    if (!isFieldAlreadPresent) {
      // eslint-disable-next-line no-console
      console.warn(
        `${fieldName} doesn't exist. Please use addFieldConfig to add`,
      );
      return null;
    }
    delete fieldConfigRef.current[fieldName];
    delete formValuesAsRef.current[fieldName];
    setFormValues((currentValues) => {
      const values = { ...currentValues };
      delete values[fieldName];
      return values;
    });
    setFormErrors((currentErrors) => {
      const errors = { ...currentErrors };
      delete errors[fieldName];
      return errors;
    });
    return fieldConfigRef.current;
  }, []);

  const setFormErrorWithoutMessages = useCallback(async () => {
    const [, errorFields] = await getFormErrors(
      fieldConfigRef.current,
      formValuesAsRef.current,
    );
    setFormErrors(() => {
      const errorWithoutMsg = {};
      Object.entries(errorFields).forEach(([fieldName, errorState]) => {
        errorWithoutMsg[fieldName] = {
          isValid: errorState.isValid,
        };
      });

      return errorWithoutMsg;
    });
  }, []);

  const resetForm = useCallback(() => {
    fieldConfigRef.current = twoLevelCopy(intialStateRef.current.fieldConfig);
    formValuesAsRef.current = { ...intialStateRef.current.values };
    setFormErrorWithoutMessages();
    setFormValues({ ...intialStateRef.current.values });
  }, [setFormErrorWithoutMessages]);

  useEffect(() => {
    validateFieldConfig(fieldConfigRef.current);
    setFormErrorWithoutMessages();
  }, [setFormErrorWithoutMessages]);

  useEffect(() => {
    intialStateRef.current = {
      values: getDefaultValues(fieldConfigRef.current),
      fieldConfig: twoLevelCopy(fieldConfigRef.current),
    };
  }, []);

  const fieldsReturnValue = useMemo(() => {
    const fieldsIn = {};
    Object.keys(fieldConfigRef.current).forEach((fieldName) => {
      fieldsIn[fieldName] = {
        updateConfig: (config) => updateFieldConfig(fieldName, config),
        setValue: (value) => setFieldValueAndValidate(fieldName, value),
        validate: () => validateFormFieldAndSetError(fieldName),
        setError: (errorMsg) => setFieldError(fieldName, errorMsg),
        setValueOnly: (value) => setFieldValue(fieldName, value),
        get value() {
          return formValues[fieldName];
        },
        get errorMsg() {
          return formErrors[fieldName].errorMsg;
        },
        get isValid() {
          return formErrors[fieldName].isValid;
        },
      };
    });
    return fieldsIn;
  }, [
    formErrors,
    formValues,
    setFieldError,
    setFieldValue,
    setFieldValueAndValidate,
    updateFieldConfig,
    validateFormFieldAndSetError,
  ]);

  const formsReturnValue = useMemo(
    () => ({
      isTouched: isFormTouched,
      isValid: getFormValidity(formErrors),
      validate: validateForm,
      addFieldConfig,
      removeFieldConfig,
      reset: resetForm,
      config: fieldConfigRef.current,
    }),
    [
      addFieldConfig,
      formErrors,
      isFormTouched,
      removeFieldConfig,
      resetForm,
      validateForm,
    ],
  );
  return [fieldsReturnValue, formsReturnValue];
}
