# 衛藤仁胡 | Eto Niko — 公式ギャラリーサイト

書家・衛藤仁胡(Eto Niko)さんの作品を紹介するギャラリーサイト。
既存のBASEショップ「online shop niko」の構成をもとに、作品一点一点が際立つ静的サイトです。

## 構成

```
index.html            サイト本体(1ページ構成)
css/style.css         スタイル・モーションデザイン
js/main.js            演出(カスタムカーソル・入場アニメーション・ライトボックス等)
assets/img/           作品画像・ヒーロー画像
assets/img/textures/  生成テクスチャ(和紙・墨の一筆・墨のにじみ)※Actionsで取り込み
assets/video/         SNS用の生成映像素材(サイトには非掲載)
docs/PROPOSAL.md      書道家さまへの提案書
.github/workflows/    アセット取り込み用ワークフロー
```

## 公開前に設定が必要な項目

`js/main.js` 冒頭の `CONFIG` を実際のURLに書き換えてください。

```js
const CONFIG = {
  shopUrl: '',       // BASEショップURL (例: 'https://xxxx.thebase.in')
  instagramUrl: '',  // InstagramプロフィールURL
};
```

## ローカル確認

静的サイトなので、任意のHTTPサーバーで確認できます。

```
python3 -m http.server 8000
# → http://localhost:8000
```

## モーションデザイン

- ローディングシークエンス(円相の描画 → 屋号のフェード → 幕開け)
- 見出しは行マスクからのせり上がり、題字は一文字ずつの立ち上がり
- 作品画像はワイプ+スケールで登場、スクロールに応じたパララックス
- カスタムカーソル(作品上では「VIEW」に変化)・マグネティックボタン・3Dチルト
- 作品一覧はオンラインショップの佇まい(ホバーで拡大+「作品を見る」、価格・完売表示)
- ヘッダーの「動/静」ボタンで全演出を停止可能。OSの「視差効果を減らす」設定にも自動対応

## アセット取り込みワークフロー

コンテナ環境から生成アセットのCDNへ直接アクセスできないため、
`.github/asset-sources.json` にURLを記載してpushすると、GitHub Actions が
ダウンロード・最適化(ffmpeg)・コミットを行います。

`assets/video/` の3本は作品写真をもとにAI生成した映像素材で、Instagramリール等のSNS用です(サイトには掲載していません)。
