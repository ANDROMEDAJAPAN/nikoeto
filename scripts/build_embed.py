#!/usr/bin/env python3
"""Google Sites 埋め込み用の単一HTMLを生成する。

index.html に css/style.css と js/main.js をインライン化し、
アセット参照を GitHub の公開 raw URL(絶対URL)へ書き換える。
出力: embed/googlesite-embed.html

使い方: python3 scripts/build_embed.py
"""
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
RAW_BASE = (
    "https://raw.githubusercontent.com/ANDROMEDAJAPAN/nikoeto/"
    "claude/calligraphy-site-redesign-rw7rq6/"
)

html = (ROOT / "index.html").read_text(encoding="utf-8")
css = (ROOT / "css/style.css").read_text(encoding="utf-8")
js = (ROOT / "js/main.js").read_text(encoding="utf-8")

# CSS内の相対URL(../assets/...)を絶対URLへ
css = css.replace('url("../assets/', f'url("{RAW_BASE}assets/')

# HTML内のアセット参照を絶対URLへ
html = re.sub(r'(src|href)="assets/', rf'\1="{RAW_BASE}assets/', html)

# ライトボックスがhrefから画像を引くため、data参照も絶対化(zoomable href は上で置換済み)

# CSS/JSをインライン化
html = html.replace(
    '<link rel="stylesheet" href="css/style.css">',
    "<style>\n" + css + "\n</style>",
)
html = html.replace(
    '<script src="js/main.js"></script>',
    "<script>\n" + js + "\n</script>",
)

# 埋め込み先(iframe)向けの注記
banner = (
    "<!--\n"
    "  Google Sites 埋め込み用 単一HTML(自動生成: scripts/build_embed.py)\n"
    "  Google サイト編集画面 → 挿入 → 埋め込む → 「埋め込みコード」にこのファイルの中身を全て貼り付け。\n"
    "  挿入後、埋め込みブロックを全幅に広げ、高さを十分に(目安 900px 以上)確保してください。\n"
    "-->\n"
)
html = html.replace("<!DOCTYPE html>", "<!DOCTYPE html>\n" + banner, 1)

out = ROOT / "embed/googlesite-embed.html"
out.parent.mkdir(exist_ok=True)
out.write_text(html, encoding="utf-8")
print(f"wrote {out} ({out.stat().st_size} bytes)")
