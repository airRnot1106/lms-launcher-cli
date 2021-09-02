const webpack = require('webpack');
const path = require('path');
module.exports = {
  // モジュールバンドルを行う起点となるファイルの指定
  // 指定できる値としては、ファイル名の文字列や、それを並べた配列やオブジェクト
  // 下記はオブジェクトとして指定した例
  entry: {
    cli: './src/app.ts',
  },
  output: {
    // モジュールバンドルを行った結果を出力する場所やファイル名の指定
    // "__dirname"はこのファイルが存在するディレクトリを表すnode.jsで定義済みの定数
    path: path.join(__dirname, 'dist'),
    filename: '[name].js', // [name]はentryで記述した名前(この例ではcli）が入る
  },
  target: 'node',
  // モジュールとして扱いたいファイルの拡張子を指定する
  // 例えば「import Foo from './foo'」という記述に対して"foo.ts"という名前のファイルをモジュールとして探す
  // デフォルトは['.js', '.json']
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devServer: {
    // webpack-dev-serverの公開フォルダ
    contentBase: path.join(__dirname, 'dist'),
    open: false,
  },
  externals: [/node_modules/, 'bufferutil', 'utf-8-validate'],
  // モジュールに適用するルールの設定（ここではローダーの設定を行う事が多い）
  module: {
    rules: [
      {
        // 拡張子が.tsで終わるファイルに対して、TypeScriptコンパイラを適用する
        test: /\.ts$/,
        loader: 'ts-loader',
      },
    ],
  },
  plugins: [
    new webpack.BannerPlugin({ banner: '#!/usr/bin/env node', raw: true }),
  ],
};
