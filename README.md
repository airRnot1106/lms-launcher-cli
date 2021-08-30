# lms-launcher-cli

[![build](https://github.com/airRnot1106/lms-launcher-cli/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/airRnot1106/lms-launcher-cli/actions/workflows/node.js.yml) ![npm](https://img.shields.io/npm/dt/lms-launcher-cli) <img src="https://img.shields.io/badge/-Node.js-339933.svg?logo=node.js&style=plastic"> <img src="https://img.shields.io/badge/-Npm-CB3837.svg?logo=npm&style=plastic"> ![NPM](https://img.shields.io/npm/l/lms-launcher-cli)

<img width="725" alt="overview" src="https://user-images.githubusercontent.com/62370527/131255227-4733176e-15fd-458d-b8a2-a8aff71c9e0f.png">

lms-launcher-cli は、東海大学生のための Node CLI です。<br>CLI を使うことで、ブラウザを開き、Open LMS にログインするまでの流れを自動で行うことができます。<br>

## Install

```console
$ npm install -g lms-launcher-cli
```

## Usage

Install コマンドを実行する前に、Node と Google Chrome をインストールする必要があります。<br>Node のインストール方法はさまざまなサイトで解説されていますので、[そちら](https://www.google.com/search?q=node+%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB)を参考にしてください。<br>Node のインストールが完了したら、上記の Install コマンドを実行してください。<br>

```console
$ npx lms-launcher-cli
```

インストールが完了していれば、上記のコマンドが実行できるようになります。

```console
$ npx lms-launcher-cli --help
lms-launcher-cli <command>

Commands:
  lms-launcher-cli c [remove]  Configure user data. The option --remove will
                               destroy the saved configuration
  lms-launcher-cli l           Login to LMS

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
```

`--help`オプションをつけると、コマンドとオプションの一覧を見ることができます。

### Commands

#### `$ npx lms-launcher-cli c`

<img width="727" alt="config" src="https://user-images.githubusercontent.com/62370527/131256471-46157ad7-40b0-4046-82f9-ddcea8cdc380.png">

Open LMS のユーザーデータを設定します。初回時は必ず実行してください。<br>

以下を入力してください:

`Enter your username`: 学籍番号<br>`Enter your password`: パスワード<br>`Reinput a same one to confirm it`: 確認のため、再度パスワード<br>

設定が完了するとユーザーデータがローカルに保存されますが、パスワードは暗号化されるため覗かれる心配はありません。

##### `$ npx lms-launcher-cli c --remove`

`--remove`オプションをつけると、保存されてあるユーザーデータを設定ファイルごと削除します。

#### `$ npx lms-launcher-cli l`

<img width="725" alt="login" src="https://user-images.githubusercontent.com/62370527/131256749-1e3cc0e8-0efe-418b-8a5f-4f880654fea9.png">

設定したユーザーデータで Open LMS にログインします。Google Chrome を使用しますので、事前にインストールを行ってください。<br>ログインが完了すると、自動的にダッシュボードのページが開かれます。

Open LMS を終了する場合はコンソールで y キーを入力してください。

## Future Plans

- CLI 上で出席登録をできるようにする
- 課題の提出をできるようにする
- 資料のダウンロードをできるようにする

## Author

- Github: [airRnot1106](https://github.com/airRnot1106)

## LICENSE

This project is licensed under the MIT License - see the [LICENSE](https://github.com/airRnot1106/lms-launcher-cli/blob/main/LICENSE) file for details.
