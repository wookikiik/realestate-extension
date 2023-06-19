import CopyWebpackPlugin from 'copy-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import webpack from 'webpack'
import { fileURLToPath } from 'node:url'
import { VueLoaderPlugin } from 'vue-loader'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

/** @type {import('webpack').Configuration} */
const options = {
  devtool: 'cheap-module-source-map',
  mode: process.env.NODE_ENV || 'development',
  entry: {
    service_worker: fileURLToPath(
      new URL('./src/background/service_worker.ts', import.meta.url),
    ),
    'scripts/naver_content': fileURLToPath(
      new URL('./src/contents/naver_content.ts', import.meta.url),
    ),
    'scripts/naver_adapter': fileURLToPath(
      new URL('./src/resources/naver_adapter.ts', import.meta.url),
    ),
    'scripts/sidepanel': fileURLToPath(
      new URL('./src/sidepanel/index.ts', import.meta.url),
    ),
    'scripts/overview': fileURLToPath(
      new URL('./src/sidepanel/overview.ts', import.meta.url),
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
    extensions: ['.ts', '.js', '.css'],
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
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
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
    new MiniCssExtractPlugin({
      filename: ({ chunk }) => {
        const name = chunk.name.replace(/^(.*\/)?([^/]+)$/, '$2')
        return `styles/${name}.css`
      },
    }),
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
    new HtmlWebpackPlugin({
      template: fileURLToPath(new URL('./src/sidepanel/index.html', import.meta.url)),
      filename: 'sidepanel.html',
      chunks: ['scripts/sidepanel'],
      cache: false,
    }),
    new HtmlWebpackPlugin({
      template: fileURLToPath(new URL('./src/sidepanel/overview.html', import.meta.url)),
      filename: 'overview.html',
      chunks: ['scripts/overview'],
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
