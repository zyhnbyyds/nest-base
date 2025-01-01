import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'ts/consistent-type-imports': 'off',
    'node/prefer-global/process': 'off',
    'test/no-import-node-test': 'off',
  },
  ignores: [
    'packages/mongo',
    'packages/mysql',
  ],
})
