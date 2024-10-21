// eslint-disable-next-line ts/no-require-imports
const swcDefaultConfig = require('@nestjs/cli/lib/compiler/defaults/swc-defaults').swcDefaultsFactory().swcOptions

module.exports = {
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        loader: 'builtin:swc-loader',
        options: swcDefaultConfig,
        type: 'javascript/auto',
      },
    ],
  },
}
