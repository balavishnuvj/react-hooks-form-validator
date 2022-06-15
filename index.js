'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/react-hooks-form-validator.cjs');
} else {
  module.exports = require('./src/index.js');
}
