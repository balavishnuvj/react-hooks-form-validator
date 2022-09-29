import { renderHook, act } from '@testing-library/react-hooks';
import useForm from '../use-form';

describe('Unit Test cases for use-form hook', () => {
  test.skip('form config cannot be null or undefined', async () => {
    try {
      renderHook(() => useForm());
    } catch (error) {
      expect(error).toEqual(
        new Error(`Field configuration can't be null/undefined`),
      );
    }
  });
  describe('cases for automatic field validation', () => {
    it('should validate field having a required field', async () => {
      const { result } = renderHook(() =>
        useForm({ name: { required: true } }),
      );
      expect(result.current[0].name.isValid).toBe(false);
      expect(result.current[1].isValid).toBe(false);
      const text = 'sample';
      await act(async () => {
        await result.current[0].name.setValue(text);
      });
      expect(result.current[0].name.value).toBe(text);
      expect(result.current[0].name.isValid).toBe(true);
      expect(result.current[1].isValid).toBe(true);
    });
    it('should validate field having a required custom required field', async () => {
      const { result } = renderHook(() =>
        useForm({
          name: {
            required: { errorMsg: 'This is custom required error message' },
            defaultValue: 'text',
          },
        }),
      );
      await act(async () => {
        await result.current[0].name.setValue('');
      });
      expect(result.current[0].name.isValid).toBe(false);
      expect(result.current[0].name.errorMsg).toBe(
        'This is custom required error message',
      );
      expect(result.current[1].isValid).toBe(false);
      const text = 'sample';
      await act(async () => {
        await result.current[0].name.setValue(text);
      });
      expect(result.current[0].name.value).toBe(text);
      expect(result.current[0].name.isValid).toBe(true);
      expect(result.current[1].isValid).toBe(true);
    });
    it('should validate field having a minimum length limit', async () => {
      const { result } = renderHook(() => useForm({ name: { min: 5 } }));
      expect(result.current[0].name.isValid).toBe(true);
      expect(result.current[1].isValid).toBe(true);
      const incorrectSpaceTextAtStart = '     text';
      await act(async () => {
        await result.current[0].name.setValue(incorrectSpaceTextAtStart);
      });
      expect(result.current[0].name.value).toBe(incorrectSpaceTextAtStart);
      expect(result.current[0].name.isValid).toBe(false);
      expect(result.current[1].isValid).toBe(false);
      const incorrectSpaceTextAtEnd = 'text    ';
      await act(async () => {
        await result.current[0].name.setValue(incorrectSpaceTextAtEnd);
      });
      expect(result.current[0].name.value).toBe(incorrectSpaceTextAtEnd);
      expect(result.current[0].name.isValid).toBe(false);
      expect(result.current[1].isValid).toBe(false);
      const incorrectText = 'text';
      await act(async () => {
        await result.current[0].name.setValue(incorrectText);
      });
      expect(result.current[0].name.value).toBe(incorrectText);
      expect(result.current[0].name.isValid).toBe(false);
      expect(result.current[1].isValid).toBe(false);
      const correctText = 'superlongtext';
      await act(async () => {
        await result.current[0].name.setValue(correctText);
      });
      expect(result.current[0].name.value).toBe(correctText);
      expect(result.current[0].name.isValid).toBe(true);
      expect(result.current[1].isValid).toBe(true);
    });
    it('should validate field having a minimum length(custom error message)', async () => {
      const { result } = renderHook(() =>
        useForm({
          name: {
            min: { length: 5, errorMsg: 'This is custom error message' },
          },
        }),
      );
      expect(result.current[0].name.isValid).toBe(true);
      expect(result.current[1].isValid).toBe(true);
      const incorrectSpaceTextAtStart = '     text';
      await act(async () => {
        await result.current[0].name.setValue(incorrectSpaceTextAtStart);
      });
      expect(result.current[0].name.value).toBe(incorrectSpaceTextAtStart);
      expect(result.current[0].name.isValid).toBe(false);
      expect(result.current[1].isValid).toBe(false);
      expect(result.current[0].name.errorMsg).toBe(
        'This is custom error message',
      );
      const incorrectSpaceTextAtEnd = 'text    ';
      await act(async () => {
        await result.current[0].name.setValue(incorrectSpaceTextAtEnd);
      });
      expect(result.current[0].name.value).toBe(incorrectSpaceTextAtEnd);
      expect(result.current[0].name.isValid).toBe(false);
      expect(result.current[1].isValid).toBe(false);
      expect(result.current[0].name.errorMsg).toBe(
        'This is custom error message',
      );
      const incorrectText = 'text';
      await act(async () => {
        await result.current[0].name.setValue(incorrectText);
      });
      expect(result.current[0].name.value).toBe(incorrectText);
      expect(result.current[0].name.isValid).toBe(false);
      expect(result.current[0].name.errorMsg).toBe(
        'This is custom error message',
      );
      expect(result.current[1].isValid).toBe(false);
      const correctText = 'superlongtext';
      await act(async () => {
        await result.current[0].name.setValue(correctText);
      });
      expect(result.current[0].name.value).toBe(correctText);
      expect(result.current[0].name.isValid).toBe(true);
      expect(result.current[1].isValid).toBe(true);
    });
    it('should validate field having a maximum length limit', async () => {
      const { result } = renderHook(() => useForm({ name: { max: 5 } }));
      expect(result.current[0].name.isValid).toBe(true);
      expect(result.current[1].isValid).toBe(true);
      const incorrectSpaceTextAtStart = '     text';
      await act(async () => {
        await result.current[0].name.setValue(incorrectSpaceTextAtStart);
      });
      expect(result.current[0].name.value).toBe(incorrectSpaceTextAtStart);
      expect(result.current[0].name.isValid).toBe(true);
      expect(result.current[1].isValid).toBe(true);
      const incorrectSpaceTextAtEnd = 'textWithSpace    ';
      await act(async () => {
        await result.current[0].name.setValue(incorrectSpaceTextAtEnd);
      });
      expect(result.current[0].name.value).toBe(incorrectSpaceTextAtEnd);
      expect(result.current[0].name.isValid).toBe(false);
      expect(result.current[1].isValid).toBe(false);
      const incorrectText = 'superlongtext';
      await act(async () => {
        await result.current[0].name.setValue(incorrectText);
      });
      expect(result.current[0].name.value).toBe(incorrectText);
      expect(result.current[0].name.isValid).toBe(false);
      expect(result.current[1].isValid).toBe(false);
      const correctText = 'text';
      await act(async () => {
        result.current[0].name.setValue(correctText);
      });
      expect(result.current[0].name.value).toBe(correctText);
      expect(result.current[0].name.isValid).toBe(true);
      expect(result.current[1].isValid).toBe(true);
    });
    it('should validate field having a maximum length limit(custom error message)', async () => {
      const { result } = renderHook(() =>
        useForm({
          name: {
            max: { length: 5, errorMsg: 'This is custom error message' },
          },
        }),
      );
      expect(result.current[0].name.isValid).toBe(true);
      expect(result.current[1].isValid).toBe(true);
      const incorrectSpaceTextAtStart = '     text';
      await act(async () => {
        await result.current[0].name.setValue(incorrectSpaceTextAtStart);
      });
      expect(result.current[0].name.value).toBe(incorrectSpaceTextAtStart);
      expect(result.current[0].name.isValid).toBe(true);
      expect(result.current[1].isValid).toBe(true);
      const incorrectSpaceTextAtEnd = 'textWithSpace    ';
      await act(async () => {
        await result.current[0].name.setValue(incorrectSpaceTextAtEnd);
      });
      expect(result.current[0].name.value).toBe(incorrectSpaceTextAtEnd);
      expect(result.current[0].name.isValid).toBe(false);
      expect(result.current[1].isValid).toBe(false);
      expect(result.current[0].name.errorMsg).toBe(
        'This is custom error message',
      );
      const incorrectText = 'superlongtext';
      await act(async () => {
        await result.current[0].name.setValue(incorrectText);
      });
      expect(result.current[0].name.value).toBe(incorrectText);
      expect(result.current[0].name.isValid).toBe(false);
      expect(result.current[0].name.errorMsg).toBe(
        'This is custom error message',
      );
      expect(result.current[1].isValid).toBe(false);
      const correctText = 'text';
      await act(async () => {
        result.current[0].name.setValue(correctText);
      });
      expect(result.current[0].name.value).toBe(correctText);
      expect(result.current[0].name.isValid).toBe(true);
      expect(result.current[1].isValid).toBe(true);
    });
    it('should validate field having a patten match', async () => {
      const { result } = renderHook(() =>
        useForm({
          name: {
            patterns: [
              {
                regex: new RegExp('a{3}', 'g'),
                errorMsg: 'All three characters should be `aaa`',
              },
            ],
          },
        }),
      );
      expect(result.current[0].name.isValid).toBe(true);
      expect(result.current[1].isValid).toBe(true);
      const incorrectText = 'bbb';
      await act(async () => {
        await result.current[0].name.setValue(incorrectText);
      });
      expect(result.current[0].name.value).toBe(incorrectText);
      expect(result.current[0].name.isValid).toBe(false);
      expect(result.current[1].isValid).toBe(false);
      const correctText = 'aaa';
      await act(async () => {
        result.current[0].name.setValue(correctText);
      });
      expect(result.current[0].name.value).toBe(correctText);
      expect(result.current[0].name.isValid).toBe(true);
      expect(result.current[1].isValid).toBe(true);
    });
    it('should validate field having functions as validation', async () => {
      const { result } = renderHook(() =>
        useForm({
          name: {
            validate: (nameValue, formValues) => [
              formValues.name && formValues.name.startsWith('a'),
              'Should is required field',
            ],
          },
        }),
      );
      expect(result.current[0].name.isValid).toBe(false);
      expect(result.current[1].isValid).toBe(false);
      const incorrectText = 'bbb';
      await act(async () => {
        await result.current[0].name.setValue(incorrectText);
      });
      expect(result.current[0].name.value).toBe(incorrectText);
      expect(result.current[0].name.isValid).toBe(false);
      expect(result.current[1].isValid).toBe(false);
      const correctText = 'aaa';
      await act(async () => {
        result.current[0].name.setValue(correctText);
      });
      expect(result.current[0].name.value).toBe(correctText);
      expect(result.current[0].name.isValid).toBe(true);
      expect(result.current[1].isValid).toBe(true);
    });
    it('should validate field when empty value is set', async () => {
      const { result } = renderHook(() =>
        useForm({
          name: {
            validate: (nameValue, formValues) => [
              formValues.name && formValues.name.startsWith('a'),
              'Is a required is required field, should start with a',
            ],
          },
        }),
      );
      expect(result.current[0].name.isValid).toBe(false);
      expect(result.current[1].isValid).toBe(false);
      const correctText = 'aaa';
      const incorrectText = '';
      await act(async () => {
        result.current[0].name.setValue(correctText);
      });
      expect(result.current[0].name.value).toBe(correctText);
      expect(result.current[0].name.isValid).toBe(true);
      expect(result.current[1].isValid).toBe(true);
      await act(async () => {
        await result.current[0].name.setValue(incorrectText);
      });
      expect(result.current[0].name.value).toBe(incorrectText);
      expect(result.current[0].name.isValid).toBe(false);
      expect(result.current[1].isValid).toBe(false);
    });
    it('should validate field having functions throws error', async () => {
      const { result } = renderHook(() =>
        useForm({
          name: {
            validate: jest.fn(() => {
              new Error('Async error');
            }),
          },
        }),
      );
      expect(result.current[0].name.isValid).toBe(false);
      expect(result.current[1].isValid).toBe(false);
      const incorrectText = 'bbb';
      await act(async () => {
        await result.current[0].name.setValue(incorrectText);
      });
      expect(result.current[0].name.value).toBe(incorrectText);
      expect(result.current[0].name.isValid).toBe(false);
      expect(result.current[1].isValid).toBe(false);
      const correctText = 'aaa';
      await act(async () => {
        result.current[0].name.setValue(correctText);
      });
      expect(result.current[0].name.value).toBe(correctText);
      expect(result.current[0].name.isValid).toBe(false);
      expect(result.current[1].isValid).toBe(false);
    });
    it('should validate field has a function as validation', async () => {
      const { result } = renderHook(() =>
        useForm({
          name: {
            validate: (nameValue, formValues) => [
              formValues.name && formValues.name.startsWith('a'),
              'Should is required field',
            ],
          },
        }),
      );
      expect(result.current[0].name.isValid).toBe(false);
      expect(result.current[1].isValid).toBe(false);
      const incorrectText = 'bbb';
      await act(async () => {
        await result.current[0].name.setValue(incorrectText);
      });
      expect(result.current[0].name.value).toBe(incorrectText);
      expect(result.current[0].name.isValid).toBe(false);
      expect(result.current[1].isValid).toBe(false);
      const correctText = 'aaa';
      await act(async () => {
        result.current[0].name.setValue(correctText);
      });
      expect(result.current[0].name.value).toBe(correctText);
      expect(result.current[0].name.isValid).toBe(true);
      expect(result.current[1].isValid).toBe(true);
    });
    it('should be able to manually set error on field', async () => {
      const { result } = renderHook(() => useForm({ name: {} }));
      expect(result.current[0].name.isValid).toBe(true);
      expect(result.current[1].isValid).toBe(true);
      const errorText = 'Invalid Field';
      act(() => {
        result.current[0].name.setError(errorText);
      });
      expect(result.current[0].name.isValid).toBe(false);
      expect(result.current[0].name.errorMsg).toBe(errorText);
      expect(result.current[1].isValid).toBe(false);
    });
  });

  describe('Cases of use-form on demand validations', () => {
    it('validate field on demand', async () => {
      const { result } = renderHook(() =>
        useForm({ name: { required: true } }),
      );
      expect(result.current[0].name.isValid).toBe(false);
      expect(result.current[1].isValid).toBe(false);
      const text = 'sample';
      act(() => {
        result.current[0].name.setValueOnly(text);
      });
      expect(result.current[0].name.value).toBe(text);
      expect(result.current[0].name.isValid).toBe(false);
      expect(result.current[1].isValid).toBe(false);
      await act(async () => {
        await result.current[0].name.validate();
      });
      expect(result.current[0].name.isValid).toBe(true);
      expect(result.current[1].isValid).toBe(true);
    });
    it('validate form on demand', async () => {
      const { result } = renderHook(() =>
        useForm({ name: { required: true } }),
      );
      expect(result.current[0].name.isValid).toBe(false);
      expect(result.current[1].isValid).toBe(false);
      const text = 'sample';
      act(() => {
        result.current[0].name.setValueOnly(text);
      });
      expect(result.current[0].name.value).toBe(text);
      expect(result.current[0].name.isValid).toBe(false);
      expect(result.current[1].isValid).toBe(false);
      let returnedValue;
      await act(async () => {
        returnedValue = await result.current[1].validate();
      });
      expect(result.current[0].name.isValid).toBe(true);
      expect(result.current[1].isValid).toBe(true);
      expect(returnedValue).toMatchInlineSnapshot(`
        Array [
          true,
          Object {
            "name": Object {
              "errorMsg": "",
              "isValid": true,
            },
          },
        ]
      `);
    });
  });
  describe('Cases of use-form on demand config change', () => {
    it('should set error only if field has value', async () => {
      const { result } = renderHook(() => useForm({ name: {} }));
      expect(result.current[0].name.isValid).toBe(true);
      expect(result.current[1].isValid).toBe(true);
      const text = 'sample';
      await act(async () => {
        await result.current[0].name.updateConfig(() => ({ required: true }));
      });
      expect(result.current[0].name.isValid).toBe(false);
      expect(result.current[1].isValid).toBe(false);
      await act(async () => {
        await result.current[0].name.setValue(text);
      });
      expect(result.current[0].name.value).toBe(text);
      expect(result.current[0].name.isValid).toBe(true);
      expect(result.current[1].isValid).toBe(true);
    });
    it('should throw error  if field has invalid config', async () => {
      const { result } = renderHook(() => useForm({ name: {} }));
      expect(result.current[0].name.isValid).toBe(true);
      expect(result.current[1].isValid).toBe(true);
      await act(async () => {
        await expect(
          result.current[0].name.updateConfig(() => ({
            unexpectedKey: true,
          })),
        ).rejects.toEqual(Error('Invalid schema for field configuration'));
      });
    });
  });
  describe('Cases for adding new field configuration', () => {
    it('should have field config added', async () => {
      const { result } = renderHook(() => useForm({ name: {} }));
      await act(async () => {
        await result.current[1].addFieldConfig('newlyAddedField', () => ({}));
      });
      expect(result.current[0].newlyAddedField).toBeDefined();
    });
    it('should accept field config as object', async () => {
      const { result } = renderHook(() => useForm({ name: {} }));
      await act(async () => {
        await result.current[1].addFieldConfig('newlyAddedField', {
          defaultValue: 'Hello',
        });
      });
      expect(result.current[0].newlyAddedField).toBeDefined();
      expect(result.current[0].newlyAddedField.value).toBe('Hello');
    });
    it('should throw error field config already present', async () => {
      const { result } = renderHook(() => useForm({ name: {} }));
      await act(async () => {
        await expect(() =>
          result.current[1].addFieldConfig('name', () => ({})),
        ).toThrow(
          Error('name already exists. Please use name.updateConfig instead'),
        );
      });
    });
    it('should invalidate a valid form if default value in invalid', async () => {
      const { result } = renderHook(() => useForm({ name: {} }));
      expect(result.current[1].isValid).toBe(true);
      await act(async () => {
        await result.current[1].addFieldConfig('newlyAddedField', () => ({
          required: true,
        }));
      });
      expect(result.current[1].isValid).toBe(false);
      expect(result.current[0].newlyAddedField.isValid).toBe(false);
    });
    it('should have have value field set', async () => {
      const { result } = renderHook(() => useForm({ name: {} }));
      expect(result.current[1].isValid).toBe(true);
      await act(async () => {
        await result.current[1].addFieldConfig('newlyAddedField', () => ({
          required: true,
          defaultValue: 'hello',
        }));
      });
      expect(result.current[1].isValid).toBe(true);
      expect(result.current[0].newlyAddedField.isValid).toBe(true);
      expect(result.current[0].newlyAddedField.value).toBe('hello');
    });
  });
  describe('Cases for removing a field', () => {
    it('should be able to delete field', async () => {
      const { result } = renderHook(() => useForm({ name: {} }));
      expect(result.current[0].name).toBeDefined();
      await act(async () => {
        await result.current[1].removeFieldConfig('name', () => ({}));
      });
      expect(result.current[0].name).toBeUndefined();
    });
    it('should be a valid form when invalid field is removed', async () => {
      const { result } = renderHook(() =>
        useForm({ name: { required: true } }),
      );
      expect(result.current[1].isValid).toBe(false);
      await act(async () => {
        await result.current[1].removeFieldConfig('name', () => ({}));
      });
      expect(result.current[1].isValid).toBe(true);
    });
    it('should throw error if field is not present', async () => {
      // eslint-disable-next-line no-console
      const originalWarn = console.warn;
      const mockedWarn = jest.fn();
      // eslint-disable-next-line no-console
      console.warn = mockedWarn;
      const { result } = renderHook(() => useForm({ name: {} }));
      await act(async () => {
        await result.current[1].removeFieldConfig('randomField', () => ({}));
      });
      expect(mockedWarn).toBeCalledWith(
        `randomField doesn't exist. Please use addFieldConfig to add`,
      );
      // eslint-disable-next-line no-console
      console.warn = originalWarn;
    });
  });
  describe('Cases for reseting the form', () => {
    it('should reset the values', async () => {
      const { result } = renderHook(() =>
        useForm({ name: { defaultValue: 'hello' } }),
      );
      expect(result.current[1].isValid).toBe(true);
      await act(async () => {
        await result.current[0].name.setValue('test');
      });
      expect(result.current[0].name.value).toBe('test');
      await act(async () => {
        await result.current[1].reset();
      });
      expect(result.current[0].name.value).toBe('hello');
    });
    it('should reset the errors', async () => {
      const { result } = renderHook(() =>
        useForm({ name: { required: true } }),
      );
      expect(result.current[1].isValid).toBe(false);
      await act(async () => {
        await result.current[0].name.setValue('test');
      });
      expect(result.current[0].name.isValid).toBe(true);
      await act(async () => {
        await result.current[1].reset();
      });
      expect(result.current[1].isValid).toBe(false);
    });
    it('should remove the added fields', async () => {
      const { result } = renderHook(() => useForm({ name: {} }));
      expect(result.current[1].isValid).toBe(true);
      await act(async () => {
        await result.current[1].addFieldConfig('newlyAddedField', () => ({
          required: true,
        }));
      });
      expect(result.current[0].newlyAddedField).toBeDefined();
      expect(result.current[1].isValid).toBe(false);
      await act(async () => {
        await result.current[1].reset();
      });
      expect(result.current[0].newlyAddedField).toBeUndefined();
      expect(result.current[1].isValid).toBe(true);
    });
    it('should add back the removed fields', async () => {
      const { result } = renderHook(() =>
        useForm({ name: {}, other: { defaultValue: 'hello' } }),
      );
      expect(result.current[1].isValid).toBe(true);
      await act(async () => {
        await result.current[1].removeFieldConfig('other');
      });
      expect(result.current[0].other).toBeUndefined();
      expect(result.current[1].isValid).toBe(true);
      await act(async () => {
        await result.current[1].reset();
      });
      expect(result.current[0].other).toBeDefined();
      expect(result.current[1].isValid).toBe(true);
      expect(result.current[0].other.value).toBe('hello');
    });
  });
  describe('Cases for immutabilty of the form config', () => {
    const formConfig = { name: {} };
    it('should have field config added', async () => {
      const { result } = renderHook(() => useForm(formConfig));
      await act(async () => {
        await result.current[1].addFieldConfig('newlyAddedField', () => ({}));
      });
      expect(formConfig.newlyAddedField).toBeUndefined();
    });
  });
});
