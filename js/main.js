// =====================================================================
//  心のパスポート  ―  設定はこの COUNTRIES を編集するだけでOK
// =====================================================================
//  ・新しい国を足すときは、この配列に1つ追加してください
//  ・password … 有料記事の中に書く「合言葉」（小文字・全角半角に注意）
//  ・line … スタンプを押したとき出る、詩的なひとこと
//  ・list … 旅のおみやげ（要点）。何行でもOK
// =====================================================================
const COUNTRIES = [
  {
    id: "se",
    name: "スウェーデン",
    en: "SWEDEN",
    no: "01",                      // 便名（FLIGHT 01）
    sub: "Lagom ― 心がほどける北欧の生き方",
    bg: "assets/se-bg.png",        // メッセージ画面の背景（ストックホルムの朝焼け）
    status: "active",              // active / soon / locked
    password: "lagom",             // ← あとで自由に変更できます
    line: "スウェーデンで出会った“ちょうどいい”を、あなたの毎日に。",
    list: [
      "時には、人に頼ってみる",
      "あえて、何も考えずに歩く",
      "頭の中にも、“ちょうどいい”を",
      "そして、一杯のフィーカを",
    ],
  },
  // ここから先は「これから」の枠（スウェーデンと合わせて全10枠）
  // ※次の行き先が決まったら、下のどれかを イタリアの例のように書き換えるだけ：
  //   { id:"it", name:"イタリア", en:"ITALY", sub:"...", status:"active", password:"...", line:"...", list:[...] }
  { id: "q1", status: "locked" },
  { id: "q2", status: "locked" },
  { id: "q3", status: "locked" },
  { id: "q4", status: "locked" },
  { id: "q5", status: "locked" },
  { id: "q6", status: "locked" },
  { id: "q7", status: "locked" },
  { id: "q8", status: "locked" },
  { id: "q9", status: "locked" },
];

// ===== 保存まわり（この端末のブラウザに記録） =====
// ファイルを直接開いた場合など localStorage が使えない環境でも
// 止まらないよう、使えないときは「その場かぎりのメモリ」に退避する。
const KEY_NAME = "kokoro_passport_name";
const KEY_STAMPS = "kokoro_passport_stamps"; // { se: "2026-07-23", ... }

const _mem = {};
function lsGet(k) { try { const v = localStorage.getItem(k); return v === null ? (k in _mem ? _mem[k] : null) : v; } catch { return k in _mem ? _mem[k] : null; } }
function lsSet(k, v) { try { localStorage.setItem(k, v); } catch { _mem[k] = v; } }
function lsRemove(k) { try { localStorage.removeItem(k); } catch {} delete _mem[k]; }

const loadName = () => lsGet(KEY_NAME) || "";
const saveName = (n) => lsSet(KEY_NAME, n);
const loadStamps = () => {
  try { return JSON.parse(lsGet(KEY_STAMPS)) || {}; }
  catch { return {}; }
};
const saveStamps = (s) => lsSet(KEY_STAMPS, JSON.stringify(s));

// ===== 要素 =====
const $ = (sel) => document.querySelector(sel);
const screenCover = $("#screen-cover");
const screenBook = $("#screen-book");
const grid = $("#stamp-grid");
const modal = $("#modal");
const modalBody = $("#modal-body");

// ===== 画面の切り替え =====
function showCover() { screenCover.hidden = false; screenBook.hidden = true; }
function showBook() {
  screenCover.hidden = true; screenBook.hidden = false;
  $("#owner-name").textContent = loadName();
  renderGrid();
}

// ===== 日付を「2026.07.23」の形に =====
function today() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())}`;
}

// ===== スタンプのSVG（二重リング＋飛行機＋コンパス星＋帯にSWEDEN／日付） =====
function stampSVG(country, date) {
  const id = country.id;
  return `
  <svg class="stamp-mark" viewBox="0 0 120 120" role="img" aria-label="${country.name}のスタンプ">
    <defs>
      <filter id="ink-${id}" x="-12%" y="-12%" width="124%" height="124%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="n"/>
        <feDisplacementMap in="SourceGraphic" in2="n" scale="1.5"/>
      </filter>
      <!-- 文字を乗せる帯（上＝国名／下＝日付） -->
      <path id="top-${id}" d="M17,60 A43,43 0 0 1 103,60" fill="none"/>
      <path id="bot-${id}" d="M18,60 A42,42 0 0 0 102,60" fill="none"/>
    </defs>

    <!-- 図形（かすれインク） -->
    <g filter="url(#ink-${id})" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-linecap="round">
      <circle cx="60" cy="60" r="56" stroke-width="2.6"/>
      <circle cx="60" cy="60" r="50" stroke-width="1"/>
      <circle cx="60" cy="60" r="33" stroke-width="1"/>
      <!-- 飛行機（右上へ上昇・塗り） -->
      <path fill="currentColor" stroke="none" transform="translate(60,52) rotate(-32) scale(1.18)"
        d="M0,-9 C1.7,-9 2.4,-5.5 2.4,-1.5 L8.5,3 8.5,5 2.4,3 2.4,7 4.6,9 4.6,10.4 0,9.2 -4.6,10.4 -4.6,9 -2.4,7 -2.4,3 -8.5,5 -8.5,3 -2.4,-1.5 C-2.4,-5.5 -1.7,-9 0,-9 Z"/>
      <!-- コンパスの星 -->
      <path fill="currentColor" stroke="none" transform="translate(60,73)"
        d="M0,-6.5 L1.5,-1.5 6.5,0 1.5,1.5 0,6.5 -1.5,1.5 -6.5,0 -1.5,-1.5 Z"/>
      <!-- 帯の左右のドット -->
      <circle cx="17" cy="60" r="1.5" fill="currentColor" stroke="none"/>
      <circle cx="103" cy="60" r="1.5" fill="currentColor" stroke="none"/>
    </g>

    <!-- 帯の文字（くっきり） -->
    <g fill="currentColor" font-family="'Cormorant Garamond',serif">
      <text font-weight="600" font-size="12.5" letter-spacing="4">
        <textPath href="#top-${id}" startOffset="50%" text-anchor="middle">${country.en}</textPath>
      </text>
      <text font-size="10.5" letter-spacing="2.5">
        <textPath href="#bot-${id}" startOffset="50%" text-anchor="middle">${date}</textPath>
      </text>
    </g>
  </svg>`;
}

// ===== スタンプ帳を描く =====
function renderGrid() {
  const stamps = loadStamps();
  const got = COUNTRIES.filter((c) => stamps[c.id]).length;
  $("#stamp-count").textContent = got;

  grid.innerHTML = "";
  COUNTRIES.forEach((c) => {
    const cell = document.createElement("button");
    cell.className = "stamp-cell";
    cell.type = "button";

    if (stamps[c.id]) {
      // 取得済み
      cell.classList.add("is-stamped");
      cell.innerHTML = `${stampSVG(c, stamps[c.id])}<span class="cell-name">${c.name}</span>`;
      cell.addEventListener("click", () => openRecord(c));
    } else if (c.status === "active") {
      // これから押せる
      cell.classList.add("is-active");
      cell.innerHTML = `<span class="cell-plus">＋</span><span class="cell-name">${c.name}</span><span class="cell-hint">入国する</span>`;
      cell.addEventListener("click", () => openStampInput(c));
    } else if (c.status === "soon") {
      cell.classList.add("is-soon");
      cell.innerHTML = `<span class="cell-mark">✈</span><span class="cell-name">${c.name}</span><span class="cell-hint">Coming Soon</span>`;
      cell.addEventListener("click", () => toast(`${c.name}は、次の便で登場します✈️`));
    } else {
      cell.classList.add("is-locked");
      cell.innerHTML = `<span class="cell-mark">?</span><span class="cell-hint">Coming Soon</span>`;
      cell.addEventListener("click", () => toast("次の行き先は、おたのしみに🌍"));
    }
    grid.appendChild(cell);
  });
}

// ===== モーダル =====
function openModal(html) { modalBody.innerHTML = html; modal.hidden = false; }
function closeModal() { modal.hidden = true; modalBody.innerHTML = ""; }

// 合言葉の入力
function openStampInput(c) {
  openModal(`
    <p class="m-eyebrow">${c.en}</p>
    <h2 class="m-title">${c.name}に入国する</h2>
    <p class="m-sub">記事の中に書かれた「合言葉」を入れてください。</p>
    <form id="pw-form" class="pw-form">
      <input id="pw-input" type="text" autocomplete="off" placeholder="合言葉" required />
      <button type="submit" class="btn btn-primary">スタンプを押す</button>
    </form>
    <p class="pw-error" id="pw-error" hidden>合言葉がちがうようです。記事をもう一度確かめてみてください🌷</p>
  `);
  const form = $("#pw-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = $("#pw-input").value.trim().toLowerCase();
    if (val === String(c.password).toLowerCase()) {
      const stamps = loadStamps();
      stamps[c.id] = today();
      saveStamps(stamps);
      openRecord(c, true); // 押したてはお祝い表示
      renderGrid();
    } else {
      $("#pw-error").hidden = false;
    }
  });
  setTimeout(() => $("#pw-input").focus(), 50);
}

// 記録（詩的な一言＋おみやげ）を表示
function openRecord(c, justStamped = false) {
  const stamps = loadStamps();
  const date = stamps[c.id] || today();
  const listHTML = (c.list || []).map((t) => `<li>${t}</li>`).join("");
  // その国らしい背景（写真があれば重ねる。無ければ北欧グラデーションのまま）
  const bgStyle = c.bg
    ? ` style="background-image:url('${c.bg}'), linear-gradient(165deg,#cfe0ec,#eef4ee,#f4ecdf)"`
    : "";
  openModal(`
    <div class="record-bg"${bgStyle}></div>
    ${justStamped ? '<p class="m-congrats">入国スタンプを押しました！</p>' : ""}
    <div class="record-stamp ${justStamped ? "pop" : ""}">${stampSVG(c, date)}</div>
    <p class="m-eyebrow">${c.en}・${date}</p>
    <h2 class="m-title">${c.name}</h2>
    <p class="record-line">${c.line || ""}</p>
    <p class="record-heading">旅のおみやげ</p>
    <ul class="record-list">${listHTML}</ul>
    <button class="btn btn-ghost" id="rec-close">パスポートに戻る</button>
  `);
  $("#rec-close").addEventListener("click", closeModal);
}

// かんたんな通知
let toastTimer;
function toast(msg) {
  let el = $(".toast");
  if (!el) { el = document.createElement("div"); el.className = "toast"; document.body.appendChild(el); }
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
}

// ===== イベント =====
$("#name-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const n = $("#name-input").value.trim();
  if (!n) return;
  saveName(n);
  showBook();
});
$("#modal-close").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
$("#btn-reset").addEventListener("click", () => {
  if (confirm("パスポートをリセットします。集めたスタンプが消えますが、よろしいですか？\n（記事の合言葉を入れれば、また押せます）")) {
    lsRemove(KEY_NAME);
    lsRemove(KEY_STAMPS);
    showCover();
  }
});

// ===== 起動 =====
try {
  if (loadName()) showBook(); else showCover();
} catch (err) {
  showCover(); // 何かあっても、表紙だけは必ず出す
  console.error(err);
}
