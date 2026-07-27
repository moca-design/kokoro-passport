# 心のパスポート（Heart Passport）

「旅のチケット」シリーズの読者が、読んだ国のスタンプを集める Web アプリ。
静的サイト（HTML/CSS/JS）で、スタンプは各自のブラウザに保存されます（ログイン不要）。

## 仕組み
1. 名前を入れて「パスポートをひらく」
2. 国の枠をタップ → 記事に書かれた「合言葉」を入力
3. スタンプが押され、その国の「旅のおみやげ（要点）」が記録される
4. 集めた記録は、いつでも見返せる（同じ端末のブラウザに保存）

※ 端末を替えると記録は消えますが、記事の合言葉を入れ直せば復活できます。

## 国・合言葉の設定
`js/main.js` の先頭の `COUNTRIES` 配列を編集するだけ。

```js
{
  id: "se",
  name: "スウェーデン",
  en: "SWEDEN",
  bg: "assets/se-bg.png",   // メッセージ画面の背景
  status: "active",
  password: "lagom",        // ← 記事に書く合言葉
  line: "詩的なひとこと",
  list: ["要点1", "要点2", ...],
}
```

新しい国を出すときは、`status:"locked"` の枠を上のように書き換えるだけ。

## 画像
- `assets/cover.png` … 表紙（HEART PASSPORT）
- `assets/se-bg.png` … スウェーデンのメッセージ背景（ストックホルム）

## 公開
GitHub（moca-design）→ Vercel に import して静的サイトとして公開。
Framework Preset は「Other」でOK（ビルド不要）。
