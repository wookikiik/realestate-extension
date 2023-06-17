import CopyWebpackPlugin from 'copy-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import webpack from 'webpack'
import { fileURLToPath } from 'node:url'
import { VueLoaderPlugin } from 'vue-loader'

/** @type {import('webpack').Configuration} */
const options = {
  devtool: 'cheap-module-source-map',
  mode: process.env.NODE_ENV || 'development',
  entry: {
    service_worker: fileURLToPath(
      new URL('./src/public/service_worker.ts', import.meta.url),
    ),
    content_script: fileURLToPath(
      new URL('./src/public/scripts/content_script.ts', import.meta.url),
    ),
    naver_adapter: fileURLToPath(
      new URL('./src/public/scripts/naver_adapter.ts', import.meta.url),
    ),
    sidepanel: fileURLToPath(
      new URL('./src/public/side_panel/sidepanel.ts', import.meta.url),
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
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/],
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      verbose: true,
    }),
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
    }),
    new webpack.ProgressPlugin(),
    new VueLoaderPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/public/manifest.json',
          to: fileURLToPath(new URL('./dist/manifest.json', import.meta.url)),
          transform: content => {
            const manifest = JSON.parse(content.toString())
            delete manifest['$schema']
            return Buffer.from(JSON.stringify(manifest))
          },
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: fileURLToPath(
        new URL('./src/public/side_panel/sidepanel.html', import.meta.url),
      ),
      filename: 'sidepanel.html',
      chunks: ['sidepanel'],
      cache: false,
    }),
  ],
}

if (process.env.NODE_ENV === 'production') {
  delete options.devtool
} else {
  options.watch = true
}

export default options
