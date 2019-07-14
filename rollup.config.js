import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'

const babelConfingBase = {
  extensions: ['.ts', '.js'],
}
const resolveConfig = {
  extensions: [...babelConfingBase.extensions, '.json'],
}

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/esm.js',
      format: 'esm',
    },
    plugins: [resolve(resolveConfig), babel(babelConfingBase)],
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/umd.js',
      format: 'umd',
      name: 'visUUID',
    },
    plugins: [resolve(resolveConfig), babel(babelConfingBase)],
  },
]
