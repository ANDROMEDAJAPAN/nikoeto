# 衛藤仁胡 | Eto Niko — 公式ギャラリーサイト

書家・衛藤仁胡(Eto Niko)さんの作品を紹介するギャラリーサイト。
既存のBASEショップ「online shop niko」の構成をもとに、作品一点一点が際立つ「動と静」をコンセプトとした静的サイトです。

## 構成

```
index.html            サイト本体(1ページ構成)
css/style.css         スタイル
js/main.js            演出・ライトボックス・動/静切替
assets/img/           作品画像・ヒーロー画像
assets/video/         墨が動き出す映像3点(舞・円相・感謝)※Actionsで取り込み
docs/PROPOSAL.md      書道家さまへの提案書
.github/workflows/    動画アセット取り込み用ワークフロー
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

## デザインコンセプト「動と静」

- 和紙(生成り)・墨・朱(落款の赤)を基調とした配色
- 明朝体(Shippori Mincho)+ 縦書き・円相などの書のモチーフ
- スクロールに応じて作品が一点ずつ現れる「舞台」構成
- 作品写真から生成した「墨が動き出す」映像セクション
- ヘッダーの「動/静」ボタンで、すべての動きを止めて静かに鑑賞するモードに切替可能
  (OSの「視差効果を減らす」設定にも自動対応)

## 作品映像について

`assets/video/` の3本は、作品写真をもとにAI(Higgsfield / Seedance 2.0)で生成した映像表現です。実物の作品は静止した書作品であり、サイト上にもその旨を明記しています。
