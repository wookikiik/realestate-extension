import CopyWebpackPlugin from 'copy-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import webpack from 'webpack'
import { fileURLToPath } from 'node:url'

/** @type {import('webpack').Configuration} */
const options = {
  devtool: 'cheap-module-source-map',
  mode: process.env.NODE_ENV || 'development',
  entry: {
    'service-worker': fileURLToPath(new URL('./src/service-worker.ts', import.meta.url)),
    'content-script': fileURLToPath(
      new URL('./src/scripts/content-script.ts', import.meta.url),
    ),
    'web-resource': fileURLToPath(
      new URL('./src/scripts/web-resource.ts', import.meta.url),
    ),
  },
  output: {
    path: fileURLToPath(new URL('./dist', import.meta.url)),
    filename: '[name].js',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader'],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      verbose: true,
    }),
    new webpack.ProgressPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/manifest.json',
          to: fileURLToPath(new URL('./dist/manifest.json', import.meta.url)),
          transform: content => {
            const manifest = JSON.parse(content.toString())
            delete manifest['$schema']
            return Buffer.from(JSON.stringify(manifest))
          },
        },
      ],
    }),
  ],
}

if (process.env.NODE_ENV === 'production') {
  delete options.devtool
} else {
  options.watch = true
}

export default options
