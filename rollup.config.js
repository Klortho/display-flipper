import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';


const config = {
  input: 'src/main.js',
  output: {
    name: 'Flipper',
    file: 'build/display-flipper.js',
    format: 'umd',
    sourcemap: true,
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**'
    }),
  ],
};

export default config;
