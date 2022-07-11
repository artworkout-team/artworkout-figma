const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const ReactRefreshTypeScript = require('react-refresh-typescript').default
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

module.exports = (env, argv) => ({
  mode: argv.mode === 'production' ? 'production' : 'development',

  // This is necessary because Figma's 'eval' works differently than normal eval
  devtool: argv.mode === 'production' ? false : 'inline-source-map',

  entry: {
    ui: './src/app/index.tsx',
    code: './src/plugin/index.ts',
  },

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    open: true,
    openPage: '/ui.html',
    hot: true,
    inline: true,
    historyApiFallback: true,
    port: 9000,
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              getCustomTransformers: () => ({
                before: argv.PREVIEW_ENV === 'browser ' ? [ReactRefreshTypeScript()] : [],
              }),
            },
          },
        ].filter(Boolean),
      },

      // Enables including CSS by doing "import './file.css'" in your TypeScript code
      { test: /\.css$/, use: ['style-loader', { loader: 'css-loader' }] },

      // Allows you to use "<%= require('./file.svg') %>" in your HTML code to get a data URI
      { test: /\.(png|jpg|gif|webp|svg)$/, loader: 'url-loader' },
    ],
  },

  resolve: { extensions: ['.tsx', '.ts', '.jsx', '.js'] },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },

  plugins: [
    argv.PREVIEW_ENV === 'browser' && new ReactRefreshPlugin(),
    argv.PREVIEW_ENV === 'browser' && new ForkTsCheckerWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/app/index.html',
      filename: 'ui.html',
      inlineSource: '.(js)$',
      chunks: ['ui'],
    }),
    argv.PREVIEW_ENV !== 'browser' && new HtmlWebpackInlineSourcePlugin(),
    new webpack.DefinePlugin({
      'process.env':  {
        PREVIEW_ENV: JSON.stringify(argv.PREVIEW_ENV),
      },
    }),
  ].filter(Boolean),
})
