const swcDefaultConfig = require('@nestjs/cli/lib/compiler/defaults/swc-defaults').swcDefaultsFactory().swcOptions

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  stats: {
    all: false,
    errors: true,
    warnings: true,
    timings: true,
    assets: true,
    builtAt: true,
    modules: false,
    colors: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'swc-loader',
          options: swcDefaultConfig,
        },
      },
    ],
  },
}
