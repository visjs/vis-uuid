import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import { generateHeader } from 'vis-dev-utils'

const banner = generateHeader()

const babelConfingBase = {
  extensions: ['.ts', '.js'],
  runtimeHelpers: true,
}
const resolveConfig = {
  extensions: [...babelConfingBase.extensions, '.json'],
}

export default [
  {
    input: 'src/index.ts',
    output: {
      banner,
      file: 'dist/esm.js',
      format: 'esm',
    },
    plugins: [resolve(resolveConfig), babel(babelConfingBase)],
  },
  {
    input: 'src/index.ts',
    output: {
      banner,
      file: 'dist/umd.js',
      format: 'umd',
      exports: 'named',
      name: 'visUUID',
      extend: true,
    },
    plugins: [resolve(resolveConfig), babel(babelConfingBase)],
  },
]
