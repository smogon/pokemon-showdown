# iPad + GitHub Codespacesでfoul-playと対戦する

このリポジトリは、Pokemon Showdownサーバー、foul-play Bot、ブラウザ用クライアント中継を同じCodespace内で起動する構成です。通常はコマンド入力を必要としません。

## 初回起動

1. このリポジトリからCodespaceを作成します。
2. 既存のCodespaceでこの設定を取り込んだ場合は、`git pull` のあと `bash scripts/showdown-ai.sh restart` を実行します。
3. 初回だけNode.jsとPythonの依存関係、およびRust製の探索エンジンをインストールします。
4. セットアップ後、Showdownサーバー、foul-play、入口ページ兼クライアント中継が自動起動します。
5. ブラウザで入口ページが開かなければ、VS Codeの **PORTS** タブからポート `3000` の地球アイコンを押します。
6. 入口ページの **Showdownを開く** を押します。
7. 入口ページに表示されたBot名へ `gen9randombattle` で対戦を申し込みます。

## 通信構成

ブラウザはPrivateの3000番ポートだけへ接続します。3000番のNode.jsプロキシが、公式Showdownクライアントの静的ファイルと、Codespace内部の8000番ShowdownサーバーへのHTTP/WebSocket通信を中継します。

そのため、8000番ポートをPublicにする必要はありません。8000番はPrivateのまま利用します。

## VS Codeのタスク

コマンドパレットから **Tasks: Run Task** を開くと、次を選択できます。

- `Showdown AI: Start`
- `Showdown AI: Stop`
- `Showdown AI: Restart`
- `Showdown AI: Status`
- `Showdown AI: Logs`

## Botの強さを調整する

Codespacesの環境変数またはSecretsで次を設定し、`Showdown AI: Restart` を実行します。

| 変数 | 既定値 | 意味 |
| --- | ---: | --- |
| `FOUL_PLAY_FORMAT` | `gen9randombattle` | 対戦形式 |
| `FOUL_PLAY_SEARCH_TIME_MS` | `500` | 1状態あたりの探索時間。大きいほど強くなりやすいが遅くなる |
| `FOUL_PLAY_SEARCH_PARALLELISM` | `1` | 並列探索数 |
| `FOUL_PLAY_SEARCH_THREADS` | `1` | 各探索で使うスレッド数 |
| `FOUL_PLAY_USERNAME` | 自動生成 | Botの表示名 |
| `FOUL_PLAY_PASSWORD` | 未設定 | 登録済みBotアカウントを使う場合のみ設定 |

2コアのCodespaceでは、まず既定値で動作確認してください。探索時間を上げる場合は `1000` 前後から試すのが安全です。

## セキュリティ

入口とクライアントはCodespacesのPrivateな3000番ポートで提供されます。Showdown本体の8000番ポートは外部公開しません。Codespaceを他人へ共有していない限り、従来のPublicポート構成より安全です。

## トラブル時

まず `Showdown AI: Logs` を実行します。手動コマンドは次のとおりです。

```bash
bash scripts/showdown-ai.sh status
bash scripts/showdown-ai.sh logs
bash scripts/showdown-ai.sh restart
```

Python環境やサブモジュールが壊れた場合は、次を再実行します。

```bash
bash scripts/codespaces-setup.sh
```
