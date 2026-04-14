# SAC - Smart AI Production
## 静的HTMLデザイン雛形

**ONE PROMPT CHANGE THE WORLD**  
クリエイティブ制作の制約を、解放する。

---

## プロジェクト概要

| 項目 | 内容 |
|---|---|
| サイト名 | SAC / Smart AI Production |
| ローカルURL | http://sac.local |
| 本番URL | https://sac.epoch-inc.jp |
| 用途 | デザイン確認・静的プロトタイプ |

---

## フォルダ構成

```
デザイン/
├── assets/
│   ├── css/
│   │   ├── style.css     # CSS変数・リセット・基本スタイル・コンポーネント
│   │   └── layout.css    # グリッド・レイアウト・レスポンシブ
│   └── js/
│       └── main.js       # スクロール・アニメーション・フィルター等
├── index.html             # TOP
├── about.html             # ABOUT
├── service.html           # SERVICE
├── works.html             # WORKS（カテゴリフィルター付き）
├── management.html        # MANAGEMENT（メンバー5名）
├── info.html              # INFO
├── contact.html           # CONTACT
├── .gitignore
└── README.md
```

---

## ページ構成

| ファイル | ページ名 | 主な内容 |
|---|---|---|
| index.html | TOP | ヒーロー・WORKS Featured・SERVICE概要・INFO |
| about.html | ABOUT | フィロソフィー・会社概要 |
| service.html | SERVICE | サービス5項目 |
| works.html | WORKS | カテゴリフィルター・作品グリッド |
| management.html | MANAGEMENT | メンバー5名グリッド |
| info.html | INFO | ニュース一覧 |
| contact.html | CONTACT | お問い合わせフォーム |

---

## デザイン仕様

### カラーパレット
```
#FFFFFF  White  （背景・メイン）
#0A0A0A  Black  （テキスト・アクセント）
#888888  Gray   （サブテキスト・ボーダー）
#F5F5F5  Light Gray（セクション背景）
#CCCCCC  Mid Gray  （区切り線）
```

### フォント
- **欧文**：Inter（Google Fonts）- ロゴ・見出し・英語ラベル
- **和文**：Noto Sans JP（Google Fonts）- 本文・日本語テキスト

### ブレークポイント
```
Desktop:  1280px+
Tablet:   768px〜1279px
Mobile:   〜767px
```

---

## 開発手順

### 1. ブラウザで確認
```bash
# Live Serverなどのローカルサーバーで開く
# VS Code拡張 "Live Server" 推奨
open index.html
```

### 2. CSSのカスタマイズ
- デザイントークン（色・フォント・スペース）は `assets/css/style.css` の `:root` を編集
- レイアウト調整は `assets/css/layout.css` を編集

### 3. WPテーマへの反映
- デザイン確認後、`style.css` / `layout.css` の内容をWPテーマの `style.css` に反映
- WPテーマパス：`../htdocs/app/public/wp-content/themes/sac/`

---

## WORKSカテゴリ

```
ALL / MOVIE / WEB / GRAPHIC / INSTALLATION / EVENT / ANIME / OTHER
```

## 注意事項
- ダミー画像はグレー背景のdivで表現（本番実装時に実画像に置換）
- フォームは静的HTML（送信処理なし）
- `.env` ファイルは絶対にコミットしない
