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
  lms-launcher-cli d           Download class resources
  lms-launcher-cli a           Record attendance

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

##### `$ npx lms-launcher-cli c remove`

`remove`オプションをつけると、保存されてあるユーザーデータを設定ファイルごと削除します。

#### `$ npx lms-launcher-cli l`

<img width="725" alt="login" src="https://user-images.githubusercontent.com/62370527/131256749-1e3cc0e8-0efe-418b-8a5f-4f880654fea9.png">

設定したユーザーデータで Open LMS にログインします。Google Chrome を使用しますので、事前にインストールを行ってください。<br>ログインが完了すると、自動的にダッシュボードのページが開かれます。

Open LMS を終了する場合はコンソールで y キーを入力してください。

#### `$ npx lms-launcher-cli d`

<img width="727" alt="downloading" src="https://user-images.githubusercontent.com/62370527/133895295-f9bdd355-d454-464b-a1aa-84a636bf38b3.png">

講義の資料をダウンロードします。<br>

<img width="728" alt="className" src="https://user-images.githubusercontent.com/62370527/131659359-bb458b46-dbf3-4c97-ad2d-9795fa644a23.png">

コマンドを実行すると、まず科目名を訊かれるので入力してください。部分一致で検索されるので正式名称を入力する必要はありません。

<img width="726" alt="selectClass" src="https://user-images.githubusercontent.com/62370527/131660319-0cb3787a-493a-48d1-8577-a2647afb33fa.png">

検索で合致した科目の一覧が表示されます。目的の科目の番号を入力してください。

<img width="729" alt="selectSection" src="https://user-images.githubusercontent.com/62370527/131783789-88020cde-77c3-45b5-b5ab-9fb41271a1b4.png">

セクションの一覧が表示されます。目的のセクションの番号を入力してください。なお、第 00 回というのはセクションに限らず常に表示される部分のことです。

<img width="728" alt="selectResource" src="https://user-images.githubusercontent.com/62370527/131784544-95f946a7-6d62-4927-b595-6cfbfc8b95e1.png">

資料の一覧が表示されます。ダウンロードしたい資料の番号を入力してください。0 を入力すると選択を終了します。

<img width="728" alt="continue" src="https://user-images.githubusercontent.com/62370527/131786130-07435343-4105-4f01-b2f4-48f30f010958.png">

複数の資料を同時にダウンロードすることもできます。Y を入力すると再度選択に移行します。

<img width="728" alt="downloaded" src="https://user-images.githubusercontent.com/62370527/131786409-5c732c21-679b-46a8-9cbe-760a387d7e7e.png">

選択したすべての資料のダウンロードが完了すると実行を終了します。

#### `$ npx lms-launcher-cli a`

出席登録をします。<br>

Download と同様に科目とセクションを選択してください。<br>

なお、出席期間外のものは登録できません。

## Future Plans

- ~~課題の提出をできるようにする~~

## Author

- Github: [airRnot1106](https://github.com/airRnot1106)

## LICENSE

This project is licensed under the MIT License - see the [LICENSE](https://github.com/airRnot1106/lms-launcher-cli/blob/main/LICENSE) file for details.
