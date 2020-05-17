<div align="center">
<h1>React Hooks Form Validator</h1>

<a href="https://www.joypixels.com/profiles/emoji/martial-arts-uniform">
  <img
    height="80"
    width="80"
    alt="martial arts uniform"
    src="https://raw.githubusercontent.com/balavishnuvj/react-hooks-form-validator/master/other/uniform.png"
  />
</a>

<p>Simple, extensible and config based form validation.</p>
</div>

**Small.** 9 KB (minified and gzipped).
[Size Limit](https://github.com/ai/size-limit) controls the size.

## Table of Contents

- [The problem](#the-problem)
- [This solution](#this-solution)
- [Installation](#installation)
- [Examples](#examples)
  - [Basic Example](#basic-example)
  - [Complex Example](#complex-example)
  - [More Examples](#more-examples)
- [API Reference](#api-reference)
- [LICENSE](#license)

## The problem
You want to write simple and maintainable form validations. As part of this goal, you want your validations to be simple yet accomadate your specifc needs. Be it in `React Web` or `React Native`. You should be able to add validations to more complicated components like Multi-Select, Date Time Picker. This also means it should easy to add validations with any design library you use,like [MATERIAL-UI](https://material-ui.com/), [Ant-D](https://ant.design/), [React Bootstrap](https://react-bootstrap.github.io/) etc. or even if you don't use one. You should be able to validate form from your server or any async validations for that matter.


## This solution

The `React Use Form` is a very lightweight solution for validating forms. It provides react hooks to configure your form, in a way that encourages simpler way to validate form. It doesn't assume anything about your design. 

## Installation

This module is distributed via [npm](https://www.npmjs.com/) which is bundled with [node](https://nodejs.org/) and
should be installed as one of your project's `dependencies`:

```
npm install --save react-hooks-form-validator

yarn add react-hooks-form-validator
```

This library has `peerDependencies` listings for `react` and `react-dom`.

> **NOTE: The minimum supported version of `react` is `^16.9.0`.**


## Examples

### Basic Example

```jsx
import React from "react";
import useForm from "react-hooks-form-validator";
import { FormItem, Input, Button } from "antd";

const formConfig = {
  username: {
    required: true,
    min: 6
  },
  password: {
    min: 6,
    max: 20,
    required: true
  }
};

function FormComponent() {
  const [fields, formData] = useForm(formConfig);
  async function handleLogin() {
    await login({
      username: fields.username.value,
      password: fields.password.value
    });
  }

  return (
    <form>
      <FormItem errorMsg={fields.username.errorMsg} required>
        <Input
          id="username"
          size="large"
          placeholder="Enter your Email"
          onTextChange={fields.username.setValue}
          value={fields.username.value}
          hasFeedback
        />
      </FormItem>
      <FormItem errorMsg={fields.password.errorMsg} required>
        <Input
          type="password"
          id="password"
          size="large"
          placeholder="Enter Your Password"
          onTextChange={fields.password.setValue}
          value={fields.password.value}
        />
      </FormItem>
      <Button
        disabled={!formData.isValid}
        onClick={handleLogin}
        size="large"
        block
      >
        Login
      </Button>
    </form>
  );
}

export default FormComponent;

```

### Complex Example

```jsx
import React from "react";
import useForm from "react-hooks-form-validator";
import { FormItem, Input, Button } from "antd";

const formConfig = {
  username: {
    required: true,
    min: 6,
    patterns: [
      {
        regex: new RegExp(/[a-zA-Z0-9]+/),
        errorMsg: "Please enter a only alpha numeric username"
      }
    ]
  },
  password: {
    min: 6,
    max: 20,
    required: true
  },
  confirmPassword: {
    validationFns: [
      (fieldValue, formValue) => {
        const isPasswordSame = formValue.password === fieldValue;
        return [isPasswordSame, "Password and confirm password should be same"];
      }
    ]
  }
};

function FormComponent() {
  const [fields, formData] = useForm(formConfig);
  async function handleLogin() {
    await login({
      username: fields.username.value,
      password: fields.password.value
    });
  }

  return (
    <form>
      <FormItem errorMsg={fields.username.errorMsg} required>
        <Input
          id="username"
          size="large"
          placeholder="Enter your Email"
          onTextChange={fields.username.setValue}
          value={fields.username.value}
          hasFeedback
        />
      </FormItem>
      <FormItem errorMsg={fields.password.errorMsg} required>
        <Input
          type="password"
          id="password"
          size="large"
          placeholder="Enter Your Password"
          onTextChange={fields.password.setValue}
          value={fields.password.value}
        />
      </FormItem>
      <FormItem errorMsg={fields.confirmPassword.errorMsg} required>
        <Input
          type="password"
          id="confirmPassword"
          size="large"
          placeholder="Confirm Your Password"
          onTextChange={fields.confirmPassword.setValue}
          value={fields.confirmPassword.value}
        />
      </FormItem>
      <Button
        disabled={!formData.isValid}
        onClick={handleLogin}
        size="large"
        block
      >
        Sign-Up
      </Button>
    </form>
  );
}

export default FormComponent;

```

### More Examples

You'll find runnable examples in [the `react-hooks-form-validator-examples` codesandbox](https://codesandbox.io/s/react-hooks-form-validator-examples-609ze).


## API Reference
Basic usage is like

`const` `[`[`fieldObject`](#field-object)`, `[`formObject`](#form-object)`] = useForm(`[`formConfig`](#field-config)`);`

`formConfig` is object with key as `fieldName` and value as `fieldConfig`
### Example for config
```js
{
    field1: config1,
    field2: config2,
    field3: config3,
}
```

### Field Config

|      key   | What it does? | Type  | Example |
| ------------- |:-------------:| :-------------:| -----:|
| defaultValue  | Default value of the field | `any` | `''`, `[]`|
| required     | To set the field as required      |   `Boolean` or `{ errorMsg : String }` | `true` or `{errorMsg: 'This is required field' }` |
| min     | To set minimun length of field      |   `Number` or `{ errorMsg : String, length: Number}` | `5` or `{errorMsg: 'minimum of 5 character', length: 5}` |
| max     | To set maximum length of field      |   `Number` or `{ errorMsg : String, length: Number}` | `5` or `{errorMsg: 'maximim of 5 character', length: 5}` |
| patterns | To validate against array of patterns    |    `Array` of `{regex : RegExp, errorMsg: String}` | `[{regex: new RegExp(/[a-zA-Z0-9]+/), errorMsg: "Please enter a only alpha numeric username" }]`|
| validationFns | To validate against array of functions/promises    |   `Array` of functions/promises `(fieldValue,formState) => [isValid, errorMessage]`  | ` [(fieldValue, formState) => [!!formState.country.id, 'Country id is mandatory']]`|


### Field Object

|      key   | What it does? | Type  | 
| ------------- |:-------------:| -----:|
| value  | Current value of the field | any |
| errorMsg     | Error message of the field      |`String` | 
| isValid     | Validity of the field      |   `Boolean` |
| setValue     | Function to set value and validate field   |   `(value) => {}`|
| updateConfig | Function to partially update a fields config    | `(curentFieldConfig) => partialFieldConfig`|
| validate | Function to validate the field |   `() => {}`|
| setValueOnly | Function only set value without validating |   `(value) => {}`|


### Form Object

|      key   | What it does? | Type  | Example |
| ------------- |:-------------:|:-------------:| -----:|
| isValid     | Validity of the form      |   `Boolean` | |
| validate | Function to validate the form |   `() => {}`| |
| addFieldConfig  | Dynamically add a field | `fn(fieldName, fieldConfig)` or `fn(fieldName, (formState)) => fieldConfig`| `formObject.addFieldConfig('useraname', { required: true })` or `formObject.addFieldConfig('useraname', (formState) => { required: !formState.email })` |
| removeFieldConfig  | Dynamically remove a field | `fn(fieldName)`| `formObject.removeFieldConfig('useraname')`|
| reset     | Resets the form config before adding or removing fields      |`() => {}` | |
| config     | Current form config   |   `{}`|

## LICENSE

[MIT](LICENSE)