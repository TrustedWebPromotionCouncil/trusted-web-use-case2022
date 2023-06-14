# wallet backend

## setting

本システムではデータベースに supabase を採用しています。
supabase で migration した上で環境変数に以下を設定してください。
データベースの初期化 sql は packages/db に格納されています。

```.env
SUPABASE_PROJECT_URL=<project-url>
SUPABASE_PROJECT_SERVICE_KEY=<project-service-key>
```

## run

バックエンドのサーバを立てるには以下のコードを実行してください。

```
$ yarn start
```
