import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';

export default {
  input: 'src/index.js',
  plugins: [
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
    }),
    terser(),
  ],
  external: ['react'],

  output: [
    {
      file: `dist/${pkg.name}.umd.js`,
      format: 'umd',
      globals: {
        react: 'React',
      },
      name: pkg.name,
      esModule: false,
    },
    {
      file: `dist/${pkg.name}.cjs.js`,
      format: 'cjs',
      exports: 'named',
    },
    {
      file: `dist/${pkg.name}.es.js`,
      format: 'esm',
    },
  ],
};
