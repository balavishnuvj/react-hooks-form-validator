'use strict';

if (process.env.NODE_ENV === 'development') {
  module.exports = require('./src/index.js');
} else {
  module.exports = require('./dist/react-hooks-form-validator.cjs');
}
