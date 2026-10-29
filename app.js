/* MultiHelp — сайт-каталог мастеров. Этот файл подгружают Тильда (multihelp.es) и GitHub Pages.
   Правки делаются здесь, в репозитории; Тильду трогать не нужно. */
(function(){
if (window.__mhLoaded) return; window.__mhLoaded = true;

/* ============================================================
   НАСТРОЙКИ САЙТА — меняются только три строки ниже.
   Вставляйте ссылки между кавычками '...'
   ============================================================ */
window.MULTIHELP = window.MULTIHELP || {
  // 1. Ссылка на опубликованную Google Таблицу в формате CSV
  //    (Файл → Поделиться → Опубликовать в интернете → CSV).
  //    Пока пусто — сайт показывает демо-мастеров.
  SHEET_CSV_URL: '',

  // 2. Ссылки на анкеты для мастеров (Google Формы) на трёх языках.
  //    Сайт сам откроет анкету на языке телефона посетителя.
  FORM_URL_ES: '',
  FORM_URL_RU: '',
  FORM_URL_EN: '',

  // 3. Ваш WhatsApp для связи с мастерами и жалоб (только цифры с кодом страны),
  //    например '34600000000'. Можно оставить пустым.
  CONTACT_WA: ''
};

var root = document.getElementById('mh-root');
if (!root) { root = document.createElement('div'); root.id = 'mh-root'; document.body.appendChild(root); }
var head = document.head;
function add(tag, attrs){ var e = document.createElement(tag); for (var k in attrs) e.setAttribute(k, attrs[k]); head.appendChild(e); return e; }
if (!document.querySelector('meta[name=viewport]')) add('meta', {name:'viewport', content:'width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1'});
add('link', {rel:'preconnect', href:'https://fonts.googleapis.com'});
add('link', {rel:'stylesheet', href:'https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600&display=swap'});
var st = document.createElement('style'); st.textContent = "\n  :root{\n    --bg:#ffffff; --ink:#0b0b0b; --muted:#6b6b6b; --hair:#e8e6e1; --soft:#f2f1ed; --glass:rgba(255,255,255,.92);\n    --block:#0b0b0b; --on-block:#ffffff; --block-muted:#a3a3a3; --block-line:#2c2c2c;\n    --ok:#1f8a4c; --warn:#b4540e;\n    --ease:cubic-bezier(.2,.75,.2,1); --ease2:cubic-bezier(.77,0,.18,1);\n    --safe-b:env(safe-area-inset-bottom,0px); --safe-t:env(safe-area-inset-top,0px);\n  }\n  @media (prefers-color-scheme: dark){\n    :root{\n      --bg:#0b0b0b; --ink:#f4f3ef; --muted:#9a9a9a; --hair:#262626; --soft:#181818; --glass:rgba(11,11,11,.9);\n      --block:#1a1a1a; --on-block:#f4f3ef; --block-muted:#8a8a8a; --block-line:#333;\n      --ok:#45c97a; --warn:#f0a35e;\n    }\n  }\n  #mh-root *{-webkit-tap-highlight-color:transparent}\n  html,body{margin:0;height:100%}\n  #mh-root{position:fixed;inset:0;z-index:9990;overflow:hidden;background:var(--bg);font-family:'Jost',system-ui,sans-serif;color:var(--ink);-webkit-font-smoothing:antialiased;text-align:left;line-height:normal}\n  #mh-root *{box-sizing:border-box}\n  body{font-family:'Jost',system-ui,sans-serif;color:var(--ink);background:var(--bg);-webkit-font-smoothing:antialiased;overscroll-behavior:none}\n  button{font:inherit;color:inherit;border:0;background:none;padding:0;cursor:pointer}\n  a{color:inherit;text-decoration:none}\n  img,video{display:block;width:100%;height:100%;object-fit:cover}\n  svg{flex:0 0 auto}\n  .caps{font-size:11px;letter-spacing:.14em;text-transform:uppercase}\n  .muted{color:var(--muted)}\n  .press{transition:transform .18s var(--ease),opacity .18s}\n  .press:active{transform:scale(.96)}\n\n  /* ---------- shell ---------- */\n  .stage{height:100%;display:flex;align-items:center;justify-content:center;gap:64px}\n  .app{position:relative;width:100%;height:100dvh;overflow:hidden;overflow:clip;background:var(--bg)}\n  .side{display:none}\n  @media (min-width:760px){\n    body,#mh-root{background:#e9e8e4}\n    .app{width:390px;height:min(844px,calc(100vh - 48px));border-radius:44px;box-shadow:0 0 0 10px #0b0b0b,0 40px 80px rgba(0,0,0,.25)}\n    .side{display:flex;flex-direction:column;gap:18px;max-width:340px;color:#0b0b0b}\n    .side h1{margin:0;font-weight:300;font-size:64px;line-height:.9;letter-spacing:-.04em;text-transform:uppercase}\n    .side p{margin:0;color:#444;line-height:1.6}\n    .side a{text-decoration:underline;text-underline-offset:4px}\n  }\n  @media (min-width:760px) and (prefers-color-scheme: dark){ body,#mh-root{background:#161616} .side{color:#f4f3ef} .side p{color:#aaa} .app{box-shadow:0 0 0 10px #2a2a2a,0 40px 80px rgba(0,0,0,.6)} }\n\n  .screens{position:absolute;inset:0 0 calc(64px + var(--safe-b)) 0}\n  .screen{position:absolute;inset:0;overflow-y:auto;overflow-x:hidden;opacity:0;transform:translateY(14px);pointer-events:none;transition:opacity .35s ease,transform .45s var(--ease);scrollbar-width:none}\n  .screen::-webkit-scrollbar{display:none}\n  .screen.active{opacity:1;transform:none;pointer-events:auto}\n\n  .topbar{position:sticky;top:0;z-index:5;background:var(--glass);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);display:flex;align-items:center;justify-content:space-between;gap:12px;padding:calc(12px + var(--safe-t)) 18px 10px;transition:box-shadow .3s}\n  .topbar.shadow{box-shadow:0 1px 0 var(--hair)}\n  .brand{font-weight:500;font-size:18px;letter-spacing:-.01em;display:flex;align-items:center;gap:8px}\n  .brand i{font-style:normal;color:var(--muted);font-weight:400}\n  .demo{font-size:10px;letter-spacing:.08em;text-transform:uppercase;border:1px solid var(--muted);color:var(--muted);border-radius:6px;padding:2px 6px;font-weight:500}\n  .city{display:flex;align-items:center;gap:6px;min-height:40px;padding:0 12px;border:1px solid var(--ink);border-radius:999px;font-size:13px;white-space:nowrap}\n\n  /* ---------- home ---------- */\n  .hello{padding:14px 18px 0}\n  .hello h1{margin:0;font-weight:300;font-size:44px;line-height:.95;letter-spacing:-.03em;text-transform:uppercase}\n  .hello h1 .l{display:block;overflow:hidden}\n  .hello h1 .l span{display:block;transform:translateY(105%);animation:up .9s var(--ease) .75s forwards}\n  .hello h1 .l:nth-child(2) span{animation-delay:.83s}\n  @keyframes up{to{transform:none}}\n  .fake-search{margin:18px 18px 0;display:flex;align-items:center;gap:12px;width:calc(100% - 36px);min-height:54px;padding:0 16px;background:var(--soft);border-radius:16px;color:var(--muted);font-size:15px;text-align:left}\n  .quick{display:flex;gap:8px;overflow-x:auto;padding:12px 18px 0;scrollbar-width:none}\n  .quick::-webkit-scrollbar{display:none}\n  .sec-t{display:flex;justify-content:space-between;align-items:baseline;padding:30px 18px 12px}\n  .sec-t h2{margin:0;font-weight:500;font-size:18px;letter-spacing:-.01em}\n  .sec-t button{font-size:13px;color:var(--muted);min-height:32px}\n\n  .hscroll{display:flex;gap:10px;overflow-x:auto;padding:0 18px;scroll-snap-type:x mandatory;scrollbar-width:none;scroll-padding:0 18px}\n  .hscroll::-webkit-scrollbar{display:none}\n  .hscroll > *{scroll-snap-align:start;flex:0 0 auto}\n\n  .cat{width:104px;display:flex;flex-direction:column;gap:8px;text-align:left}\n  .cat .im{height:132px;border-radius:18px;overflow:hidden;background:var(--soft)}\n  .cat .im img{filter:grayscale(1);transition:filter .4s}\n  .cat:active .im img{filter:none}\n  .cat span{font-size:12px;line-height:1.2}\n\n  .card{width:240px;display:flex;flex-direction:column;gap:10px;text-align:left;cursor:pointer}\n  .card .im{position:relative;height:300px;border-radius:22px;overflow:hidden;background:var(--soft)}\n  .card .im::after{content:\"\";position:absolute;inset:auto 0 0 0;height:45%;background:linear-gradient(to top,rgba(0,0,0,.55),transparent);pointer-events:none}\n  .card .im img{transition:transform .6s var(--ease)}\n  .card:active .im img{transform:scale(1.04)}\n  .card .ava{position:absolute;left:12px;bottom:12px;z-index:2;display:flex;align-items:center;gap:8px;color:#fff;font-size:13px;font-weight:500}\n  .ava-i{width:34px;height:34px;border-radius:50%;overflow:hidden;border:2px solid #fff;background:#d9d7d1;color:#0b0b0b;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:500;flex:0 0 auto}\n  .noimg{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-weight:300;font-size:64px;letter-spacing:-.04em;color:var(--muted);background:var(--soft)}\n  .pill{position:absolute;left:12px;top:12px;z-index:2;display:flex;align-items:center;gap:6px;background:#fff;color:#0b0b0b;border-radius:999px;padding:6px 10px;font-size:11px;font-weight:500}\n  .vid-pill{position:absolute;right:58px;top:12px;z-index:2;display:flex;align-items:center;gap:5px;background:rgba(0,0,0,.6);color:#fff;border-radius:999px;padding:6px 10px;font-size:11px}\n  .dot{width:7px;height:7px;border-radius:50%;background:var(--ok);display:inline-block;flex:0 0 auto}\n  .pill .dot{background:#1f8a4c}\n  .heart{position:absolute;right:10px;top:10px;z-index:2;width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.94);display:flex;align-items:center;justify-content:center}\n  .heart svg path{stroke:#0b0b0b}\n  .heart.on svg path{fill:#0b0b0b}\n  .pop{animation:pop .45s var(--ease)}\n  @keyframes pop{40%{transform:scale(1.3)}}\n  .card .t{display:flex;justify-content:space-between;gap:8px;font-weight:500;font-size:15px}\n  .card .s{display:flex;align-items:center;gap:6px;font-size:13px;color:var(--muted);margin-top:-6px}\n  .star{display:inline-flex;align-items:center;gap:3px;color:var(--ink);font-weight:500}\n\n  .promo{margin:30px 18px 0;background:var(--block);color:var(--on-block);border-radius:24px;padding:22px;display:flex;flex-direction:column;gap:10px;text-align:left;width:calc(100% - 36px);position:relative;overflow:hidden}\n  .promo b{font-weight:300;font-size:30px;line-height:1;text-transform:uppercase;letter-spacing:-.02em;position:relative}\n  .promo span{color:var(--block-muted);font-size:14px;position:relative}\n  .promo .big{position:absolute;right:-6px;bottom:-28px;font-weight:300;font-size:120px;letter-spacing:-.06em;color:var(--block-line)}\n\n  .list{display:flex;flex-direction:column;padding:0 18px 24px}\n  .row{display:flex;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid var(--hair);text-align:left;width:100%;opacity:0;transform:translateY(12px);animation:rowin .5s var(--ease) forwards}\n  @keyframes rowin{to{opacity:1;transform:none}}\n  .row .th{position:relative;width:64px;height:64px;border-radius:16px;overflow:hidden;flex:0 0 auto;background:var(--soft)}\n  .row .th .noimg{font-size:22px}\n  .row .tx{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}\n  .row .tx b{font-weight:500;font-size:15px;display:flex;align-items:center;gap:6px}\n  .row .tx span{font-size:13px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:flex;align-items:center;gap:6px}\n  .row .pr{font-size:14px;font-weight:500;white-space:nowrap;text-align:right}\n\n  .skel{background:linear-gradient(90deg,var(--soft) 0%,var(--hair) 50%,var(--soft) 100%);background-size:200% 100%;animation:sh 1.2s infinite}\n  @keyframes sh{to{background-position:-200% 0}}\n  .skel-card{width:240px;height:340px;border-radius:22px}\n  .skel-row{height:64px;border-radius:16px;margin:12px 0}\n\n  /* ---------- search ---------- */\n  .search-bar{display:flex;align-items:center;gap:10px;min-height:52px;padding:0 16px;margin:0 18px;background:var(--soft);border-radius:16px}\n  .search-bar input{flex:1;min-width:0;border:0;outline:0;background:transparent;font:inherit;font-size:16px;color:var(--ink)}\n  .search-bar input::-webkit-search-cancel-button{display:none}\n  .chips{display:flex;gap:8px;overflow-x:auto;padding:12px 18px 0;scrollbar-width:none}\n  .chips::-webkit-scrollbar{display:none}\n  .chips + .chips{padding-top:8px;padding-bottom:6px}\n  .chip{flex:0 0 auto;display:inline-flex;align-items:center;gap:6px;min-height:38px;padding:0 15px;border-radius:999px;border:1px solid var(--hair);font-size:13px;transition:background .25s,color .25s,border-color .25s}\n  .chip.on{background:var(--ink);color:var(--bg);border-color:var(--ink)}\n  .chip.on .dot{background:var(--bg)}\n  .empty{padding:50px 30px;text-align:center;display:flex;flex-direction:column;gap:12px;align-items:center;color:var(--muted)}\n  .empty b{color:var(--ink);font-weight:300;font-size:28px;text-transform:uppercase;letter-spacing:-.02em;line-height:1.05}\n  .btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:54px;padding:0 22px;border-radius:16px;font-weight:500;font-size:15px;white-space:nowrap}\n  .btn.dark{background:var(--ink);color:var(--bg)}\n  .btn.line{border:1px solid var(--ink)}\n  .btn.full{width:100%}\n\n  /* ---------- for pros ---------- */\n  .hero-pro{margin:8px 18px 0;background:var(--block);color:var(--on-block);border-radius:28px;padding:26px 22px;display:flex;flex-direction:column;gap:16px}\n  .hero-pro h2{margin:0;font-weight:300;font-size:34px;line-height:1;text-transform:uppercase;letter-spacing:-.02em}\n  .hero-pro .price{display:flex;align-items:baseline;gap:10px;border-top:1px solid var(--block-line);padding-top:14px}\n  .hero-pro .price b{font-weight:300;font-size:72px;line-height:.85;letter-spacing:-.05em}\n  .hero-pro .btn{background:var(--on-block);color:var(--block)}\n  .steps{padding:0 18px;display:flex;flex-direction:column}\n  .step{display:flex;gap:16px;padding:16px 0;border-bottom:1px solid var(--hair)}\n  .step .n{font-weight:300;font-size:30px;line-height:1;width:40px;flex:0 0 auto}\n  .step b{font-weight:500;display:block;margin-bottom:4px}\n  .step span{font-size:14px;color:var(--muted);line-height:1.5}\n  .menu-list{padding:0 18px 30px}\n  .menu-list button,.menu-list a{width:100%;display:flex;justify-content:space-between;align-items:center;min-height:56px;border-bottom:1px solid var(--hair);font-size:15px;text-align:left}\n\n  /* ---------- detail ---------- */\n  .dimmer{position:absolute;inset:0;z-index:19;background:#000;opacity:0;pointer-events:none;transition:opacity .5s}\n  .dimmer.on{opacity:.3}\n  .detail{position:absolute;inset:0;z-index:20;background:var(--bg);transform:translateX(100%);visibility:hidden;transition:transform .5s var(--ease2),visibility 0s linear .5s;display:flex;flex-direction:column}\n  .detail.open{transform:none;visibility:visible;transition:transform .5s var(--ease2),visibility 0s}\n  .detail.drag{transition:none}\n  .d-head{position:absolute;left:0;right:0;top:0;z-index:5;display:flex;align-items:center;gap:8px;padding:calc(10px + var(--safe-t)) 12px 10px;transition:background .3s,box-shadow .3s}\n  .d-head .ttl{flex:1;min-width:0;font-weight:500;font-size:16px;opacity:0;transform:translateY(6px);transition:opacity .3s,transform .3s var(--ease);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n  .d-head.solid{background:var(--glass);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);box-shadow:0 1px 0 var(--hair)}\n  .d-head.solid .ttl{opacity:1;transform:none}\n  .circ{width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,.95);display:flex;align-items:center;justify-content:center;transition:background .3s}\n  .circ svg path{stroke:#0b0b0b}\n  .d-head.solid .circ{background:transparent}\n  .d-head.solid .circ svg path{stroke:var(--ink)}\n  .d-head .circ.heart{position:static}\n  .d-head .circ.heart.on svg path{fill:#0b0b0b}\n  .d-head.solid .circ.heart.on svg path{fill:var(--ink)}\n\n  .d-scroll{flex:1;overflow-y:auto;scrollbar-width:none}\n  .d-scroll::-webkit-scrollbar{display:none}\n  .gallery{position:relative;height:480px;background:#111;overflow:hidden}\n  .g-track{display:flex;height:100%;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none}\n  .g-track::-webkit-scrollbar{display:none}\n  .g-track > button{position:relative;flex:0 0 100%;height:100%;scroll-snap-align:start}\n  .gallery::after{content:\"\";position:absolute;inset:auto 0 0 0;height:55%;background:linear-gradient(to top,rgba(0,0,0,.7),transparent);pointer-events:none}\n  .g-info{position:absolute;left:18px;right:18px;bottom:40px;z-index:2;color:#fff;pointer-events:none}\n  .g-info .who{display:flex;align-items:center;gap:12px}\n  .g-info .ava-i{width:48px;height:48px;font-size:16px}\n  .g-info h2{margin:0;font-weight:300;font-size:36px;line-height:1;text-transform:uppercase;letter-spacing:-.02em}\n  .g-info .r{margin-top:6px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;opacity:.85}\n  .dots{position:absolute;right:18px;bottom:44px;z-index:3;display:flex;gap:5px}\n  .dots i{width:6px;height:6px;border-radius:999px;background:rgba(255,255,255,.5);transition:width .35s var(--ease),background .35s}\n  .dots i.on{width:20px;background:#fff}\n  .g-empty{height:100%;display:flex;align-items:center;justify-content:center;color:#777;font-size:13px}\n  .g-vtag{position:absolute;left:16px;top:70px;z-index:2;display:flex;align-items:center;gap:5px;height:26px;padding:0 10px;border-radius:999px;background:rgba(0,0,0,.55);color:#fff;font-size:11px;pointer-events:none}\n  .play{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:1}\n  .play span{width:36px;height:36px;border-radius:50%;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center}\n\n  .d-body{position:relative;margin-top:-22px;background:var(--bg);border-radius:24px 24px 0 0;padding:20px 18px 30px;display:flex;flex-direction:column;gap:20px}\n  .stats{display:grid;grid-template-columns:repeat(2,1fr);border:1px solid var(--hair);border-radius:18px}\n  .stats div{padding:14px 10px;text-align:center;display:flex;flex-direction:column;gap:2px}\n  .stats div + div{border-left:1px solid var(--hair)}\n  .stats b{font-weight:500;font-size:18px;display:inline-flex;align-items:center;justify-content:center;gap:4px}\n  .stats span{font-size:11px;color:var(--muted)}\n  .newbie{border:1px solid var(--hair);border-radius:18px;padding:14px 16px;font-size:14px;display:flex;gap:10px;align-items:center}\n  .avail{display:flex;align-items:center;gap:10px;font-size:14px;font-weight:500}\n  .avail .dot{width:9px;height:9px;box-shadow:0 0 0 4px color-mix(in srgb,var(--ok) 20%,transparent);animation:pulse 2s infinite}\n  @keyframes pulse{50%{box-shadow:0 0 0 7px color-mix(in srgb,var(--ok) 0%,transparent)}}\n  .facts{display:flex;flex-direction:column;gap:12px}\n  .facts div{display:flex;align-items:center;gap:12px;font-size:14px}\n  .facts svg{width:20px;height:20px}\n  .about{margin:0;font-size:15px;line-height:1.6;opacity:.85;white-space:pre-line}\n  .about.clamp{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}\n  .more{align-self:flex-start;font-size:13px;font-weight:500;text-decoration:underline;text-underline-offset:4px;margin-top:-12px;min-height:32px}\n  .h3{display:flex;justify-content:space-between;align-items:baseline}\n  .h3 b{font-weight:500;font-size:18px}\n  .h3 span{font-size:13px;color:var(--muted)}\n  .pf-tabs{display:flex;gap:18px;margin-top:-6px}\n  .pf-tabs button{font-size:13px;color:var(--muted);min-height:36px;border-bottom:1px solid transparent}\n  .pf-tabs button.on{color:var(--ink);border-color:var(--ink)}\n  .pf{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:3px;margin:0 -18px}\n  .pf > *{position:relative;aspect-ratio:1;overflow:hidden;background:var(--soft)}\n  .pf > .hide{display:none}\n  .pf img{transition:transform .5s var(--ease)}\n  .pf > *:active img{transform:scale(1.05)}\n  .ext{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;background:var(--block)!important;color:var(--on-block);font-size:11px;text-align:center;padding:8px}\n  .ext .mono{border-color:var(--on-block)}\n  .mono{width:36px;height:36px;border-radius:50%;border:1px solid var(--ink);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;letter-spacing:.02em;flex:0 0 auto}\n  .socials{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;margin:0 -18px;padding:0 18px}\n  .socials::-webkit-scrollbar{display:none}\n  .soc{flex:0 0 auto;display:flex;align-items:center;gap:10px;min-height:52px;padding:0 16px 0 8px;border:1px solid var(--hair);border-radius:999px;font-size:14px}\n  .soc small{display:block;font-size:11px;color:var(--muted)}\n  .svc{border-top:1px solid var(--ink)}\n  .svc button{width:100%;display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:1px solid var(--hair);text-align:left;font-size:15px}\n  .svc button span:first-child{flex:1}\n  .svc .go{width:30px;height:30px;border-radius:50%;background:var(--soft);display:flex;align-items:center;justify-content:center;flex:0 0 auto}\n  .svc-note{font-size:12px;color:var(--muted);margin-top:-10px}\n  .rv-sum{display:flex;align-items:center;gap:16px}\n  .rv-sum b{font-weight:300;font-size:48px;line-height:1;letter-spacing:-.03em}\n  .stars{display:inline-flex;gap:2px}\n  .rv{background:var(--soft);border-radius:18px;padding:16px;display:flex;flex-direction:column;gap:8px}\n  .rv .top{display:flex;justify-content:space-between;align-items:center;font-size:13px}\n  .rv .top b{font-weight:500;font-size:14px}\n  .rv p{margin:0;font-size:14px;line-height:1.55;opacity:.85}\n  .rv .svcn{font-size:12px;color:var(--muted)}\n  .report{align-self:center;font-size:12px;color:var(--muted);min-height:40px}\n\n  .d-cta{display:flex;gap:10px;align-items:center;padding:12px 18px calc(14px + var(--safe-b));border-top:1px solid var(--hair);background:var(--bg)}\n  .round{width:54px;height:54px;border-radius:50%;border:1px solid var(--ink);display:flex;align-items:center;justify-content:center;flex:0 0 auto}\n  .d-cta .btn.dark{flex:1}\n\n  /* ---------- lightbox ---------- */\n  .lb{position:absolute;inset:0;z-index:45;background:#000;display:flex;flex-direction:column;opacity:0;pointer-events:none;visibility:hidden;transition:opacity .3s,visibility 0s linear .3s}\n  .lb.on{opacity:1;pointer-events:auto;visibility:visible;transition:opacity .3s,visibility 0s}\n  .lb-top{position:absolute;left:0;right:0;top:0;z-index:2;display:flex;justify-content:space-between;align-items:center;padding:calc(12px + var(--safe-t)) 14px 0;color:#fff}\n  .lb-top button{width:44px;height:44px;display:flex;align-items:center;justify-content:center}\n  .lb-track{flex:1;display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;transition:transform .3s var(--ease)}\n  .lb-track::-webkit-scrollbar{display:none}\n  .lb-track > div{flex:0 0 100%;scroll-snap-align:start;display:flex;align-items:center;justify-content:center}\n  .lb-track img,.lb-track video{height:auto;max-height:100%;object-fit:contain;background:#000}\n  .lb-track iframe{width:100%;aspect-ratio:16/9;border:0;max-height:100%}\n  .lb-track iframe.tall{aspect-ratio:9/16;height:80%;width:auto;max-width:100%}\n  .lb-cap{position:absolute;left:0;right:0;bottom:calc(20px + var(--safe-b));text-align:center;color:#aaa;font-size:12px;pointer-events:none}\n\n  /* ---------- tabbar ---------- */\n  .tabbar{position:absolute;left:0;right:0;bottom:0;z-index:10;height:calc(64px + var(--safe-b));padding-bottom:var(--safe-b);background:var(--glass);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-top:1px solid var(--hair);display:grid;grid-template-columns:repeat(4,1fr)}\n  .tab{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;font-size:10px;letter-spacing:.06em;color:var(--muted);transition:color .3s;position:relative}\n  .tab.on{color:var(--ink)}\n  .tab svg{transition:transform .35s var(--ease)}\n  .tab.on svg{transform:translateY(-2px)}\n  .tab .cnt{position:absolute;top:8px;left:calc(50% + 6px);min-width:16px;height:16px;border-radius:999px;background:var(--ink);color:var(--bg);font-size:10px;display:none;align-items:center;justify-content:center;padding:0 4px;letter-spacing:0}\n  .tab .cnt.show{display:flex}\n  .ind{position:absolute;top:-1px;left:0;height:2px;width:25%;background:var(--ink);transition:transform .45s var(--ease)}\n\n  /* ---------- sheets / toast / splash ---------- */\n  .sheet-bg{position:absolute;inset:0;z-index:50;background:rgba(0,0,0,0);pointer-events:none;transition:background .35s}\n  .sheet-bg.on{background:rgba(0,0,0,.4);pointer-events:auto}\n  .sheet{position:absolute;left:0;right:0;bottom:0;background:var(--bg);border-radius:26px 26px 0 0;padding:10px 18px calc(20px + var(--safe-b));transform:translateY(100%);transition:transform .45s var(--ease);max-height:80%;overflow-y:auto}\n  .sheet-bg.on .sheet{transform:none}\n  .grab{width:40px;height:4px;border-radius:9px;background:var(--hair);margin:0 auto 14px}\n  .sheet h3{margin:0 0 6px;font-weight:300;font-size:26px;text-transform:uppercase;letter-spacing:-.02em}\n  .sheet button.opt{width:100%;display:flex;justify-content:space-between;align-items:center;min-height:54px;border-bottom:1px solid var(--hair);font-size:16px}\n  .toast{position:absolute;left:50%;bottom:calc(84px + var(--safe-b));z-index:60;transform:translate(-50%,20px);opacity:0;background:var(--ink);color:var(--bg);border-radius:999px;padding:12px 18px;font-size:13px;white-space:nowrap;max-width:calc(100% - 32px);overflow:hidden;text-overflow:ellipsis;transition:all .35s var(--ease);pointer-events:none}\n  .toast.on{opacity:1;transform:translate(-50%,0)}\n  .splash{position:absolute;inset:0;z-index:70;background:#0b0b0b;color:#fff;display:flex;align-items:center;justify-content:center;transition:transform .8s var(--ease2) .2s}\n  .splash.go{transform:translateY(-100%)}\n  .splash b{font-weight:300;font-size:46px;letter-spacing:-.03em;text-transform:uppercase;overflow:hidden;display:block}\n  .splash b span{display:block;transform:translateY(100%);animation:up .8s var(--ease) .1s forwards}\n\n  @media (prefers-reduced-motion:reduce){\n    *,*::before,*::after{animation-duration:.01ms!important;animation-delay:0s!important;animation-iteration-count:1!important;transition-duration:.01ms!important}\n  }\n"; head.appendChild(st);
root.innerHTML = "<div class=\"stage\">\n  <div class=\"side\">\n    <span class=\"caps\" style=\"opacity:.6\">multihelp.es</span>\n    <h1>Откройте на телефоне</h1>\n    <p>MultiHelp работает как приложение: на телефоне нажмите «Поделиться» → «На экран Домой», и появится иконка.</p>\n    <p>Вы мастер? Размещение сейчас бесплатное — <a href=\"#\" data-form>заполните анкету</a>.</p>\n  </div>\n\n  <div class=\"app\" id=\"app\">\n    <div class=\"splash\" id=\"splash\"><b><span>MultiHelp</span></b></div>\n\n    <div class=\"screens\">\n      <!-- HOME -->\n      <section class=\"screen active\" data-tab=\"home\" id=\"s-home\">\n        <div class=\"topbar\">\n          <div class=\"brand\">MultiHelp<i>.es</i><span class=\"demo\" id=\"demoBadge\" hidden>демо</span></div>\n          <button class=\"city press\" data-open-city aria-label=\"Выбрать город\">\n            <svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z\"/><circle cx=\"12\" cy=\"10\" r=\"2.5\"/></svg>\n            <span class=\"city-name\">Вся Испания</span>\n            <svg width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" aria-hidden=\"true\"><path d=\"M6 9l6 6 6-6\"/></svg>\n          </button>\n        </div>\n        <div class=\"hello\"><h1><span class=\"l\"><span>Кто нужен</span></span><span class=\"l\"><span>сегодня?</span></span></h1></div>\n        <button class=\"fake-search press\" data-go-search>\n          <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" aria-hidden=\"true\"><circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"M20 20l-3.5-3.5\"/></svg>\n          <span id=\"typing\">Сантехник, тренер, видео…</span>\n        </button>\n        <div class=\"quick\">\n          <button class=\"chip press\" data-quick=\"today\"><span class=\"dot\"></span>Свободны сегодня</button>\n          <button class=\"chip press\" data-quick=\"urgent\">Срочный выезд</button>\n          <button class=\"chip press\" data-quick=\"video\">Есть видео</button>\n        </div>\n\n        <div class=\"sec-t\"><h2>Категории</h2></div>\n        <div class=\"hscroll\" id=\"homeCats\"></div>\n\n        <div class=\"sec-t\"><h2>Рядом с вами</h2><button data-go-search>Все →</button></div>\n        <div class=\"hscroll\" id=\"nearby\"></div>\n\n        <button class=\"promo press\" data-tab-go=\"me\">\n          <span class=\"big\" aria-hidden=\"true\">0€</span>\n          <span class=\"caps\">Для специалистов</span>\n          <b>Вы мастер?<br>Клиенты найдут вас</b>\n          <span>Размещение бесплатно на время запуска →</span>\n        </button>\n\n        <div class=\"sec-t\"><h2>Новые специалисты</h2></div>\n        <div class=\"list\" id=\"newList\"></div>\n      </section>\n\n      <!-- SEARCH -->\n      <section class=\"screen\" data-tab=\"search\" id=\"s-search\">\n        <div class=\"topbar\" style=\"flex-direction:column;align-items:stretch;gap:0;padding-left:0;padding-right:0\">\n          <label class=\"search-bar\">\n            <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" aria-hidden=\"true\" style=\"color:var(--muted)\"><circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"M20 20l-3.5-3.5\"/></svg>\n            <input id=\"q\" type=\"search\" placeholder=\"Что нужно сделать?\" autocomplete=\"off\" aria-label=\"Поиск\">\n            <button id=\"clearQ\" aria-label=\"Очистить\" style=\"display:none;width:32px;height:32px;align-items:center;justify-content:center\"><svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" aria-hidden=\"true\"><path d=\"M6 6l12 12M18 6L6 18\"/></svg></button>\n          </label>\n          <div class=\"chips\" id=\"chips\"></div>\n          <div class=\"chips\" id=\"flags\"></div>\n        </div>\n        <div class=\"sec-t\" style=\"padding-top:14px\"><h2 id=\"resCount\">Специалисты</h2><button data-open-city><span class=\"city-name\">Вся Испания</span> ▾</button></div>\n        <div class=\"list\" id=\"results\"></div>\n      </section>\n\n      <!-- FAVS -->\n      <section class=\"screen\" data-tab=\"fav\" id=\"s-fav\">\n        <div class=\"topbar\"><div class=\"brand\">Избранное</div></div>\n        <div class=\"list\" id=\"favList\"></div>\n      </section>\n\n      <!-- FOR PROS -->\n      <section class=\"screen\" data-tab=\"me\" id=\"s-me\">\n        <div class=\"topbar\"><div class=\"brand\">Для специалистов</div></div>\n        <div class=\"hero-pro\">\n          <span class=\"caps\" style=\"color:var(--block-muted)\">Ваша страница на MultiHelp</span>\n          <h2>Клиенты находят вас сами</h2>\n          <div class=\"price\"><b>0€</b><span class=\"caps\">на время запуска</span></div>\n          <span style=\"color:var(--block-muted);font-size:14px\">Размещение бесплатное. Без комиссий с заказов — клиенты пишут вам напрямую.</span>\n          <a class=\"btn press\" href=\"#\" data-form>Заполнить анкету</a>\n        </div>\n        <div class=\"sec-t\"><h2>Как это работает</h2></div>\n        <div class=\"steps\">\n          <div class=\"step\"><span class=\"n\">01</span><div><b>Заполните анкету</b><span>Фото работ, видео, услуги и цены, соцсети, WhatsApp — около 10 минут.</span></div></div>\n          <div class=\"step\"><span class=\"n\">02</span><div><b>Мы проверим профиль</b><span>Обычно за 1–2 дня. Если что-то нужно поправить — напишем.</span></div></div>\n          <div class=\"step\"><span class=\"n\">03</span><div><b>Получайте клиентов</b><span>Ваша страница появится в каталоге. Делитесь ссылкой на неё в Instagram и WhatsApp.</span></div></div>\n        </div>\n        <div class=\"sec-t\"><h2>Уже на сайте?</h2></div>\n        <div class=\"menu-list\">\n          <a class=\"press\" href=\"#\" data-contact=\"edit\">Изменить мой профиль <span>→</span></a>\n          <a class=\"press\" href=\"#\" data-contact=\"hide\">Скрыть профиль <span>→</span></a>\n          <a class=\"press\" href=\"#\" data-contact=\"help\">Связаться с MultiHelp <span>→</span></a>\n        </div>\n      </section>\n    </div>\n\n    <!-- DETAIL -->\n    <div class=\"dimmer\" id=\"dimmer\"></div>\n    <section class=\"detail\" id=\"detail\" aria-hidden=\"true\">\n      <div class=\"d-head\" id=\"dHead\">\n        <button class=\"circ press\" id=\"back\" aria-label=\"Назад\"><svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M15 5l-7 7 7 7\"/></svg></button>\n        <div class=\"ttl\" id=\"dTitle\"></div>\n        <button class=\"circ press\" id=\"share\" aria-label=\"Поделиться\"><svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M12 3v13M7 8l5-5 5 5M5 14v6h14v-6\"/></svg></button>\n        <button class=\"circ press heart\" id=\"dHeart\" aria-label=\"В избранное\"><svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke-width=\"1.8\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z\"/></svg></button>\n      </div>\n      <div class=\"d-scroll\" id=\"dScroll\">\n        <div class=\"gallery\">\n          <div class=\"g-track\" id=\"gTrack\"></div>\n          <div class=\"g-info\" id=\"gInfo\"></div>\n          <div class=\"dots\" id=\"dots\"></div>\n        </div>\n        <div class=\"d-body\" id=\"dBody\"></div>\n      </div>\n      <div class=\"d-cta\">\n        <button class=\"round press\" id=\"callBtn\" aria-label=\"Позвонить\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2\"/></svg></button>\n        <button class=\"btn dark press\" id=\"waBtn\">\n          <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3.5 20.5l1.3-4.2A8.5 8.5 0 1112 20.5a8.4 8.4 0 01-4.3-1.2z\"/><path d=\"M9 9.5c0 2.5 2 5 5 5.5l1-1.3-1.6-1-.9.7c-.9-.4-1.6-1.1-2-2l.7-.9-1-1.6z\"/></svg>\n          Написать в WhatsApp\n        </button>\n      </div>\n    </section>\n\n    <!-- LIGHTBOX -->\n    <div class=\"lb\" id=\"lb\" role=\"dialog\" aria-label=\"Работы\">\n      <div class=\"lb-top\"><span id=\"lbCount\" style=\"font-size:13px\"></span><button id=\"lbClose\" aria-label=\"Закрыть\"><svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"1.6\" stroke-linecap=\"round\" aria-hidden=\"true\"><path d=\"M5 5l14 14M19 5L5 19\"/></svg></button></div>\n      <div class=\"lb-track\" id=\"lbTrack\"></div>\n      <div class=\"lb-cap\">Листайте в сторону · смахните вниз, чтобы закрыть</div>\n    </div>\n\n    <!-- TABBAR -->\n    <nav class=\"tabbar\" id=\"tabbar\" aria-label=\"Навигация\">\n      <span class=\"ind\" id=\"ind\"></span>\n      <button class=\"tab on\" data-tab-go=\"home\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z\"/></svg>Главная</button>\n      <button class=\"tab\" data-tab-go=\"search\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" aria-hidden=\"true\"><circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"M20 20l-3.5-3.5\"/></svg>Поиск</button>\n      <button class=\"tab\" data-tab-go=\"fav\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z\"/></svg>Избранное<span class=\"cnt\" id=\"favCnt\">0</span></button>\n      <button class=\"tab\" data-tab-go=\"me\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"8\" r=\"4\"/><path d=\"M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6\"/></svg>Я мастер</button>\n    </nav>\n\n    <!-- SHEETS -->\n    <div class=\"sheet-bg\" id=\"sheetBg\">\n      <div class=\"sheet\" role=\"dialog\" aria-label=\"Выбор города\">\n        <div class=\"grab\"></div>\n        <h3>Город</h3>\n        <div id=\"cityOpts\"></div>\n      </div>\n    </div>\n    <div class=\"sheet-bg\" id=\"callBg\">\n      <div class=\"sheet\" role=\"dialog\" aria-label=\"Звонок\">\n        <div class=\"grab\"></div>\n        <h3 id=\"callName\">Позвонить</h3>\n        <p class=\"muted\" style=\"margin:0 0 16px;font-size:14px;line-height:1.5\">Скажите, что нашли мастера на MultiHelp — так он быстрее ответит.</p>\n        <a class=\"btn dark press full\" href=\"#\" id=\"callNum\">Позвонить</a>\n        <button class=\"btn press full\" style=\"margin-top:6px\" data-close-sheet>Отмена</button>\n      </div>\n    </div>\n\n    <div class=\"toast\" id=\"toast\"></div>\n  </div>\n</div>";

(() => {
  const CFG = window.MULTIHELP || {};
  const $ = s => document.querySelector(s), $$ = s => document.querySelectorAll(s);
  const U = (id, w=700) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const LS = {
    get(k, d){ try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch(e){ return d; } },
    set(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} }
  };

  /* ---------- media helpers ---------- */
  const driveId = u => { const m = String(u).match(/(?:\/d\/|[?&]id=)([\w-]{20,})/); return /drive\.google|docs\.google|googleusercontent/.test(u) && m ? m[1] : null; };
  const driveImg = (id, w) => `https://drive.google.com/thumbnail?id=${id}&sz=w${w}`;
  const ytId = u => { const m = String(u).match(/(?:youtu\.be\/|[?&]v=|shorts\/|embed\/|live\/)([\w-]{11})/); return /youtu/.test(u) && m ? m[1] : null; };
  const P = id => ({type:'photo', src:U(id,1400), thumb:U(id,500)});
  const V = id => ({type:'video', src:`https://assets.mixkit.co/videos/${id}/${id}-360.mp4`, thumb:`https://assets.mixkit.co/videos/${id}/${id}-thumb-360-0.jpg`});
  const YT = id => ({type:'embed', thumb:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`, embed:`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1`, tall: false});
  const splitUrls = s => String(s || '').split(/[\s,;]+/).map(x => x.trim()).filter(x => /^https?:\/\//i.test(x) || /^(www\.|[\w-]+\.(com|es|net|org|me|be|tv|io|so|link)\b)/i.test(x)).map(x => /^https?:/i.test(x) ? x : 'https://' + x);

  function photoFrom(u){
    const id = driveId(u);
    if (id) return {type:'photo', src:driveImg(id,1600), thumb:driveImg(id,600)};
    if (/\.(jpe?g|png|webp|gif|avif)(\?|$)/i.test(u) || /images\.unsplash|googleusercontent/.test(u)) return {type:'photo', src:u, thumb:u};
    return null;
  }
  function videoFrom(u){
    const y = ytId(u); if (y) { const m = YT(y); if (/shorts\//.test(u)) m.tall = true; return m; }
    const id = driveId(u); if (id) return {type:'embed', thumb:driveImg(id,600), embed:`https://drive.google.com/file/d/${id}/preview`, tall:false};
    if (/\.(mp4|webm|mov)(\?|$)/i.test(u)) return {type:'video', src:u, thumb:null};
    const v = /vimeo\.com\/(\d+)/.exec(u); if (v) return {type:'embed', thumb:null, embed:`https://player.vimeo.com/video/${v[1]}?autoplay=1`, tall:false};
    const s = socInfo(u); return {type:'ext', url:u, label:s.name, mono:s.mono};
  }

  /* ---------- social helpers ---------- */
  const PLAT = [
    ['instagram.com','Instagram','IG'],['tiktok.com','TikTok','TT'],['youtube.com','YouTube','YT'],['youtu.be','YouTube','YT'],
    ['facebook.com','Facebook','FB'],['fb.com','Facebook','FB'],['t.me','Telegram','TG'],['telegram.me','Telegram','TG'],
    ['linkedin.com','LinkedIn','in'],['vimeo.com','Vimeo','Vi'],['behance.net','Behance','Be'],['pinterest.','Pinterest','Pi'],['x.com','X','X'],['twitter.com','X','X']
  ];
  function normSocial(u){
    u = String(u).trim(); if (!u) return null;
    if (/^@[\w.]+$/.test(u)) u = 'https://instagram.com/' + u.slice(1);
    if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
    try { const x = new URL(u); return x.hostname.includes('.') ? x.href : null; } catch(e){ return null; }
  }
  function socInfo(url){
    let host = '', path = '';
    try { const x = new URL(url); host = x.hostname.replace(/^www\./,''); path = x.pathname.split('/').filter(Boolean)[0] || ''; } catch(e){}
    const p = PLAT.find(([d]) => host.includes(d));
    if (p) { const clean = path.replace(/^@/, ''); return {name:p[1], mono:p[2], handle: clean ? (['IG','TT','X','TG','YT'].includes(p[2]) ? '@' + clean : clean) : host}; }
    return {name:'Сайт', mono:'www', handle:host};
  }

  /* ---------- categories ---------- */
  const CATS = [
    {id:'repair', n:'Ремонт и сантехника', img:'1676210134190-3f2c0d5cf58d', kw:'сантехник электрик ремонт мастер на час засор бойлер сборка'},
    {id:'video',  n:'Фото и видео',       img:'1611784728558-6c7d9b409cdf', kw:'видеограф фотограф видео съёмка монтаж свадьба'},
    {id:'sport',  n:'Спорт',              img:'1534258936925-c58bed479fcb', kw:'тренер фитнес спорт зал похудение йога'},
    {id:'beauty', n:'Красота',            img:'1632345031435-8727f6897d53', kw:'маникюр педикюр красота ногти парикмахер визаж брови ресницы'},
    {id:'edu',    n:'Обучение',           img:'1580894732444-8ecded7900cd', kw:'репетитор английский испанский учитель язык dele музыка'},
    {id:'home',   n:'Дом и уборка',       img:'1683115099191-51e617fc5ff1', kw:'уборка клининг няня сад бассейн переезд грузчики'},
    {id:'other',  n:'Другое',             img:'1454165804606-c3d57bc86b40', kw:''}
  ];
  const CAT_SYN = {
    repair:['ремонт','сантех','reforma','fontaner','manitas','electric','reparaci','repair','plumb','handyman'],
    video:['фото','видео','foto','vídeo','video','photo'],
    sport:['спорт','фитнес','deporte','fitness','entrenad','sport','trainer'],
    beauty:['красот','belleza','estética','estetica','uñas','peluquer','beauty','nail','hair'],
    edu:['обуч','репетит','clases','formación','formacion','profesor','idiomas','lesson','tutor','teach'],
    home:['дом','уборк','hogar','limpieza','mudanza','jardín','jardin','home','clean','moving','garden'],
  };
  const catOf = txt => { const t = String(txt).toLowerCase().trim(); if (!t) return 'other';
    const hit = Object.keys(CAT_SYN).find(k => CAT_SYN[k].some(w => t.includes(w)));
    return hit || 'other'; };

  /* ---------- demo data (used only when no sheet link is set) ---------- */
  const DEMO = [
    {id:'d1', n:'Алексей К.', r:'Сантехник', c:'Аликанте', area:'Аликанте, Сан-Висенте, Эль-Кампельо', cat:'repair', ava:U('1568602471122-7832951cc4c5',160), urgent:true, today:true,
      media:[P('1749532125405-70950966b0e5'),P('1676210134188-4c05dd172f89'),P('1676210133055-eab6ef033ce3'),P('1542013936693-884638332954')],
      rating:4.9, reviews:37, years:12, langs:'Русский, испанский', from:40,
      about:'Сантехник с 12-летним опытом. Устраняю протечки и засоры, меняю смесители, ставлю бойлеры. Привожу материалы, даю гарантию 6 месяцев. Выезд в день обращения.',
      svc:[['Вызов и диагностика',40],['Замена смесителя',60],['Устранение засора',70],['Установка бойлера',120]], social:['https://facebook.com/alexey.santehnik'],
      rev:[{n:'Ольга',d:'сентябрь 2026',s:'Устранение засора',t:'Приехал через час после звонка, всё сделал за 40 минут и убрал за собой.'}]},
    {id:'d2', n:'Мария С.', r:'Видеограф', c:'Валенсия', area:'Валенсия и побережье', cat:'video', ava:U('1544005313-94ddf0286df2',160),
      media:[V('40601'),V('40627'),P('1625690303837-654c9666d2d0'),V('40591'),V('5223'),P('1611784728558-6c7d9b409cdf')],
      rating:5.0, reviews:22, years:7, langs:'Русский, английский, испанский', from:250,
      about:'Снимаю свадьбы, love story и короткие ролики для бизнеса. Свой свет и дрон. Ролик — через 7–10 дней, Reels — за 48 часов.',
      svc:[['Reels для бизнеса (3 шт.)',250],['Свадебный фильм',1200],['Монтаж ролика',90]],
      social:['https://instagram.com/maria.films','https://youtube.com/@mariafilms'], rev:[]},
    {id:'d3', n:'Давид Р.', r:'Фитнес-тренер', c:'Аликанте', area:'Аликанте, зал в центре или онлайн', cat:'sport', ava:U('1656338997878-279d71d48f6e',160), today:true,
      media:[P('1571019614242-c5c5dee9f50b'),V('52112'),P('1534258936925-c58bed479fcb'),V('52099')],
      years:9, langs:'Русский, английский', from:35, about:'Персональные тренировки на снижение веса и силу. Можно в зале или онлайн.',
      svc:[['Персональная тренировка',35],['Пакет 10 тренировок',300]], social:['https://instagram.com/david.fit'], rev:[]},
    {id:'d4', n:'Лаура М.', r:'Мастер маникюра', c:'Аликанте', area:'Выезд по Аликанте', cat:'beauty', ava:U('1534528741775-53994a69daeb',160), today:true,
      media:[P('1604654894610-df63bc536371'),P('1610992015762-45dca7fa3a85'),P('1607779097040-26e80aa78e66'),P('1612887390768-fb02affea7a6'),P('1519014816548-bf5fe059798b'),P('1571290274554-6a2eaa771e5f')],
      years:6, langs:'Испанский, английский', from:25, about:'Маникюр и педикюр с выездом на дом. Покрытие держится 3–4 недели.',
      svc:[['Маникюр с покрытием',30],['Педикюр',35],['Дизайн ногтей',10]], social:['https://instagram.com/laura.nails.alc','https://tiktok.com/@lauranails'], rev:[]}
  ].map(p => ({...p, today:!!p.today, urgent:!!p.urgent, rev:p.rev||[]}));

  /* ---------- CSV → masters ---------- */
  function parseCSV(t){
    const rows = []; let row = [], f = '', q = false;
    for (let i = 0; i < t.length; i++) {
      const c = t[i];
      if (q) { if (c === '"') { if (t[i+1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
      else if (c === '"') q = true;
      else if (c === ',') { row.push(f); f = ''; }
      else if (c === '\n') { row.push(f); rows.push(row); row = []; f = ''; }
      else if (c !== '\r') f += c;
    }
    if (f !== '' || row.length) { row.push(f); rows.push(row); }
    return rows;
  }
  // Column headers are matched by keywords — order matters (first match wins).
  const FIELDS = [
    // фото и видео — раньше остальных, чтобы «Фото профиля» не перепутать с «Фото работ»
    ['ava','фото профиля'],['ava','foto de perfil'],
    ['photos','фото работ'],['photos','fotos de trabajo'],
    ['vlinks','ссылки на видео'],['vlinks','enlaces a v'],['vlinks','enlaces de v'],
    ['videos','видео работ'],['videos','deos de trabajo'],
    ['from','цена от'],['from','precio desde'],
    ['svc','услуг'],['svc','servicio'],
    ['name','имя'],['name','nombre'],
    ['role','професси'],['role','profesi'],
    ['cat','категор'],['cat','categor'],
    ['city','город'],['city','ciudad'],
    ['area','район'],['area','zona'],
    ['langs','язык'],['langs','idioma'],
    ['about','о себе'],['about','sobre ti'],['about','sobre mí'],['about','descripci'],
    ['years','опыт'],['years','experiencia'],
    ['urgent','срочн'],['urgent','urgente'],
    ['social','соцсет'],['social','redes sociales'],
    ['wa','whatsapp'],
    ['phone','телефон'],['phone','teléfono'],['phone','telefono'],
    ['show','показ'],['show','mostrar'],
    ['today','свободен'],['today','disponible hoy'],
    ['rating','рейтинг'],['rating','valoraci'],
    ['reviews','отзыв'],['reviews','reseña'],
    ['ts','отметка времени'],['ts','timestamp'],['ts','marca temporal']
  ];
  const truthy = v => /^(да|yes|y|sí|si|true|1|✓|✔|x|истина|verdadero|вкл|activado)$/i.test(String(v).trim());
  const num = v => { const m = String(v).replace(',', '.').match(/\d+(\.\d+)?/); return m ? +m[0] : 0; };
  function hashId(s){ let h = 0; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) | 0; return 'm' + Math.abs(h).toString(36); }
  function parseServices(s){
    return String(s || '').split(/\n|;/).map(l => l.trim().replace(/^[-•·*\d.)\s]+(?=\D)/, '')).filter(Boolean).map(l => {
      const m = l.match(/^(.*?)[\s]*[—–\-:=]+\s*(?:от\s*|desde\s*)?(\d[\d\s]*(?:[.,]\d+)?)\s*(?:€|eur|euros?|евро)?\.?\s*$/i)
             || l.match(/^(.*?)\s+(\d[\d\s]*(?:[.,]\d+)?)\s*(?:€|eur|euros?|евро)\.?\s*$/i);
      return m ? [m[1].trim(), num(m[2].replace(/\s/g,''))] : [l, 0];
    }).slice(0, 15);
  }
  function rowsToMasters(rows){
    if (!rows.length) return [];
    const head = rows[0].map(h => h.toLowerCase().trim());
    const idx = {};
    head.forEach((h, i) => { if (h === 'id') { idx.id = i; return; } const f = FIELDS.find(([k, kw]) => idx[k] === undefined && h.includes(kw)); if (f) idx[f[0]] = i; });
    const get = (r, k) => idx[k] === undefined ? '' : (r[idx[k]] || '').trim();
    const out = [];
    rows.slice(1).forEach(r => {
      const n = get(r,'name'), role = get(r,'role');
      if (!n || !role || /^#/.test(n)) return;
      if (idx.show !== undefined && !truthy(get(r,'show'))) return;
      const media = [];
      splitUrls(get(r,'photos')).forEach(u => { const m = photoFrom(u); if (m) media.push(m); });
      splitUrls(get(r,'videos')).forEach(u => media.push(videoFrom(u)));
      splitUrls(get(r,'vlinks')).forEach(u => media.push(videoFrom(u)));
      // keep a photo/video first so the cover is visual
      media.sort((a, b) => (a.type === 'ext') - (b.type === 'ext'));
      const avaU = splitUrls(get(r,'ava'))[0];
      const avaM = avaU ? photoFrom(avaU) : null;
      const svc = parseServices(get(r,'svc'));
      const social = String(get(r,'social')).split(/[\s,;]+/).map(normSocial).filter(Boolean).slice(0, 8);
      const id = get(r,'id') || hashId((get(r,'ts') || '') + n + role);
      out.push({
        id, n, r:role, c:get(r,'city') || 'Испания', area:get(r,'area') || get(r,'city'), cat:catOf(get(r,'cat')),
        ava: avaM ? avaM.thumb.replace(/sz=w\d+/, 'sz=w240') : null,
        today: truthy(get(r,'today')), urgent: truthy(get(r,'urgent')) || /^(да|s[ií]\b)/i.test(get(r,'urgent')),
        media, rating: num(get(r,'rating')) || null, reviews: num(get(r,'reviews')) || 0, years: num(get(r,'years')) || null,
        langs:get(r,'langs'), from: num(get(r,'from')) || (svc.find(s => s[1]) || [0,0])[1],
        about:get(r,'about'), svc, social, rev:[], wa:get(r,'wa'), phone:get(r,'phone')
      });
    });
    return out.reverse(); // newest first
  }

  /* ---------- state ---------- */
  let MASTERS = [], mode = 'loading';
  let city = 'Все города', cat = 'all', q = '';
  const flags = {today:false, urgent:false, video:false};
  let favs = new Set(LS.get('mh_favs', []).map(String));
  const saveFavs = () => LS.set('mh_favs', [...favs]);
  const byId = id => MASTERS.find(p => String(p.id) === String(id));
  const isVideo = m => m.type !== 'photo';
  const hasVideo = p => p.media.some(isVideo);
  const initials = n => String(n).split(/\s+/).filter(Boolean).slice(0,2).map(s => s[0]).join('').toUpperCase() || '?';
  const avaHTML = p => p.ava ? `<img src="${esc(p.ava)}" alt="" onerror="this.replaceWith(document.createTextNode('${esc(initials(p.n))}'))">` : esc(initials(p.n));
  const cities = () => ['Все города', ...[...new Set(MASTERS.map(p => p.c).filter(Boolean))].sort((a,b) => a.localeCompare(b,'ru'))];

  /* ---------- icons ---------- */
  const ICON = {
    heart:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z"/></svg>',
    star:(s=13)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg>`,
    pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    lang:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z"/><path d="M8 10h8M8 13h5"/></svg>',
    shield:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/></svg>',
    bolt:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 3L5 14h6l-1 7 8-11h-6z"/></svg>',
    clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    arrow:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    play:(s=14)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>`,
    ext:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/></svg>',
    check:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l4 4L19 6"/></svg>'
  };
  const starsRow = r => `<span class="stars">${[1,2,3,4,5].map(i => `<span style="opacity:${i <= Math.round(r) ? 1 : .25}">${ICON.star(12)}</span>`).join('')}</span>`;
  const inCity = p => city === 'Все города' || p.c === city;
  const rate = p => p.rating ? p.rating.toFixed(1).replace('.', ',') : null;
  const yearsTxt = n => { const a = n % 10, b = n % 100; return n + ' ' + (a === 1 && b !== 11 ? 'год' : a >= 2 && a <= 4 && (b < 10 || b >= 20) ? 'года' : 'лет'); };

  function tileHTML(m, opts={}){
    const play = opts.noPlay ? '' : `<span class="play"><span>${ICON.play(13)}</span></span>`;
    if (m.type === 'photo') return `<img loading="lazy" src="${esc(m.thumb)}" alt="" onerror="this.style.opacity=0">`;
    if (m.type === 'ext') return `<span class="mono">${esc(m.mono)}</span><span>Смотреть в ${esc(m.label)}</span>`;
    if (m.thumb) return `<img loading="lazy" src="${esc(m.thumb)}" alt="" onerror="this.style.opacity=0">${play}`;
    if (m.type === 'video') return `<video src="${esc(m.src)}#t=0.1" muted playsinline preload="metadata"></video>${play}`;
    return `<span class="noimg" style="background:#111">${ICON.play(22)}</span>`;
  }
  const coverOf = p => p.media.find(m => m.type !== 'ext');

  /* ---------- render: lists ---------- */
  const rowHTML = (p, i) => { const m = coverOf(p); return `
    <button class="row press" data-pro="${esc(p.id)}" style="animation-delay:${Math.min(i,10)*0.05}s">
      <div class="th">${m ? tileHTML(m) : `<span class="noimg">${esc(initials(p.n))}</span>`}</div>
      <div class="tx">
        <b>${esc(p.n)}${p.today ? '<span class="dot" title="Свободен сегодня"></span>' : ''}</b>
        <span>${esc(p.r)} · ${esc(p.c)}</span>
        <span>${p.rating ? `<span class="star">${ICON.star(12)}${rate(p)}</span>(${p.reviews})` : 'Новый'}${hasVideo(p) ? ' · видео' : ''}${p.urgent ? ' · срочно' : ''}</span>
      </div>
      <div class="pr">${p.from ? `от ${p.from} €` : ''}</div>
    </button>`; };

  function cardHTML(p){
    const m = coverOf(p);
    return `
      <div class="card press" data-pro="${esc(p.id)}" role="button" tabindex="0" aria-label="${esc(p.n)}, ${esc(p.r)}">
        <div class="im">${m ? tileHTML(m, {noPlay:true}) : `<span class="noimg">${esc(initials(p.n))}</span>`}
          ${p.today ? '<span class="pill"><span class="dot"></span>Свободен сегодня</span>' : ''}
          ${hasVideo(p) ? `<span class="vid-pill">${ICON.play(10)}Видео</span>` : ''}
          <button class="heart ${favs.has(String(p.id))?'on':''}" data-fav="${esc(p.id)}" aria-label="В избранное">${ICON.heart}</button>
          <div class="ava"><div class="ava-i">${avaHTML(p)}</div>${esc(p.n)}</div>
        </div>
        <div class="t"><span>${esc(p.r)}</span><span>${p.from ? `от ${p.from} €` : ''}</span></div>
        <div class="s">${p.rating ? `<span class="star">${ICON.star(12)}${rate(p)}</span>· ${p.reviews} отзывов` : 'Новый на MultiHelp'} · ${esc(p.c)}</div>
      </div>`;
  }
    const emptyCatalog = `
    <div class="empty" style="padding-top:20px">
      <b>Скоро здесь появятся мастера</b>
      <span>Мы только запускаемся. Вы специалист? Разместитесь первым — это бесплатно.</span>
      <a class="btn dark press" href="#" data-form style="margin-top:8px">Заполнить анкету</a>
    </div>`;

  function renderHome(){
    if (mode === 'loading') {
      $('#nearby').innerHTML = '<div class="skel skel-card"></div><div class="skel skel-card"></div>';
      $('#newList').innerHTML = '<div class="skel skel-row"></div><div class="skel skel-row"></div><div class="skel skel-row"></div>';
      return;
    }
    const used = new Set(MASTERS.map(p => p.cat));
    const cats = MASTERS.length ? CATS.filter(c => used.has(c.id)) : CATS.filter(c => c.id !== 'other');
    $('#homeCats').innerHTML = cats.map(c => `
      <button class="cat press" data-cat-go="${c.id}">
        <div class="im"><img loading="lazy" src="${U(c.img,300)}" alt=""></div><span>${c.n}</span>
      </button>`).join('');
    if (!MASTERS.length) { $('#nearby').innerHTML = ''; $('#newList').innerHTML = emptyCatalog; return; }
    const near = MASTERS.filter(inCity);
    $('#nearby').innerHTML = (near.length ? near : MASTERS).slice(0, 12).map(cardHTML).join('');
    $('#newList').innerHTML = MASTERS.slice(0, 15).map(rowHTML).join('');
  }

  function renderChips(){
    $('#chips').innerHTML = [{id:'all',n:'Все'}, ...CATS].map(c =>
      `<button class="chip ${cat===c.id?'on':''}" data-chip="${c.id}">${c.n}</button>`).join('');
    $('#flags').innerHTML = `
      <button class="chip ${flags.today?'on':''}" data-flag="today"><span class="dot"></span>Свободны сегодня</button>
      <button class="chip ${flags.urgent?'on':''}" data-flag="urgent">Срочный выезд</button>
      <button class="chip ${flags.video?'on':''}" data-flag="video">Есть видео</button>`;
  }

  function renderResults(){
    if (mode === 'loading') { $('#results').innerHTML = '<div class="skel skel-row"></div><div class="skel skel-row"></div>'; return; }
    if (!MASTERS.length) { $('#resCount').textContent = 'Специалисты'; $('#results').innerHTML = emptyCatalog; return; }
    const qq = q.trim().toLowerCase();
    const res = MASTERS.filter(p => {
      if (!inCity(p)) return false;
      if (cat !== 'all' && p.cat !== cat) return false;
      if (flags.today && !p.today) return false;
      if (flags.urgent && !p.urgent) return false;
      if (flags.video && !hasVideo(p)) return false;
      if (!qq) return true;
      const c = CATS.find(x => x.id === p.cat) || {kw:'',n:''};
      return (p.n+' '+p.r+' '+p.about+' '+p.area+' '+p.svc.map(s=>s[0]).join(' ')+' '+c.kw+' '+c.n).toLowerCase().includes(qq);
    }).sort((a,b) => (b.today - a.today) || ((b.rating||0) - (a.rating||0)));
    $('#resCount').textContent = res.length ? `Найдено: ${res.length}` : 'Ничего не найдено';
    $('#results').innerHTML = res.length ? res.map(rowHTML).join('') :
      `<div class="empty"><b>Пока никого</b><span>Попробуйте убрать фильтры или выбрать другой город</span><button class="btn line press" id="resetF" style="margin-top:6px">Сбросить фильтры</button></div>`;
  }

  function renderFavs(){
    const list = MASTERS.filter(p => favs.has(String(p.id)));
    $('#favList').innerHTML = list.length ? list.map(rowHTML).join('') : `
      <div class="empty">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round" aria-hidden="true" style="color:var(--ink)"><path d="M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z"/></svg>
        <b>Пока пусто</b><span>Нажимайте на сердечко, чтобы сохранять мастеров</span>
        <button class="btn dark press" data-tab-go="home" style="margin-top:8px">Смотреть специалистов</button>
      </div>`;
    const n = list.length, cnt = $('#favCnt');
    cnt.textContent = n; cnt.classList.toggle('show', n > 0);
  }

  function renderCities(){
    $('#cityOpts').innerHTML = cities().map(c => `
      <button class="opt" data-city="${esc(c)}"><span>${c === 'Все города' ? 'Вся Испания' : esc(c)}</span>${c===city?ICON.check:''}</button>`).join('');
    $$('.city-name').forEach(e => e.textContent = city === 'Все города' ? 'Вся Испания' : city);
  }
  const renderAll = () => { renderHome(); renderResults(); renderFavs(); renderCities(); };

  /* ---------- tabs ---------- */
  const order = ['home','search','fav','me'];
  let current = 'home';
  function go(tab){
    if (openPro) closeDetail();
    if (tab === current) { $('#s-'+tab).scrollTo({top:0,behavior:'smooth'}); return; }
    current = tab;
    $$('.screen').forEach(s => s.classList.toggle('active', s.dataset.tab === tab));
    $$('.tab').forEach(t => t.classList.toggle('on', t.dataset.tabGo === tab));
    $('#ind').style.transform = `translateX(${order.indexOf(tab)*100}%)`;
    if (tab === 'fav') renderFavs();
    if (tab === 'search') renderResults();
  }

  /* ---------- contacts ---------- */
  const phoneDigits = s => { let d = String(s || '').replace(/[^\d+]/g, ''); if (d.startsWith('+')) d = d.slice(1); else if (d.startsWith('00')) d = d.slice(2); else if (/^[6789]\d{8}$/.test(d)) d = '34' + d; return d; };
  function wa(p, service){
    const first = p.n.split(' ')[0];
    const txt = service
      ? `Здравствуйте, ${first}! Нашёл(ла) вас на MultiHelp. Интересует: «${service}». Когда сможете?`
      : `Здравствуйте, ${first}! Нашёл(ла) вас на MultiHelp. Хочу уточнить детали.`;
    const num = phoneDigits(p.wa || p.phone);
    if (!num && mode !== 'demo') { toast('Мастер не указал WhatsApp'); return; }
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(txt)}`, '_blank');
  }
  function contactUs(text){
    const n = phoneDigits(CFG.CONTACT_WA);
    if (!n) { toast('Контакт MultiHelp скоро появится'); return; }
    window.open(`https://wa.me/${n}?text=${encodeURIComponent(text)}`, '_blank');
  }
  function formUrl(){
    const langs = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'es']).map(l => String(l).slice(0,2).toLowerCase());
    const pick = { es: CFG.FORM_URL_ES, ca: CFG.FORM_URL_ES, gl: CFG.FORM_URL_ES, eu: CFG.FORM_URL_ES, ru: CFG.FORM_URL_RU, uk: CFG.FORM_URL_RU, be: CFG.FORM_URL_RU, en: CFG.FORM_URL_EN };
    for (const l of langs) if (pick[l]) return pick[l];
    return CFG.FORM_URL_ES || CFG.FORM_URL_EN || CFG.FORM_URL_RU || CFG.FORM_URL || '';
  }
  function openForm(){
    const u = formUrl();
    if (!u) { toast('Анкета скоро появится'); return; }
    window.open(u, '_blank');
  }

  /* ---------- detail ---------- */
  const detail = $('#detail'), dimmer = $('#dimmer'), dHead = $('#dHead'), dScroll = $('#dScroll');
  let openPro = null, viewable = [];
  function openDetail(id, fromHash){
    const p = byId(id); if (!p) return;
    openPro = p;
    viewable = p.media.filter(m => m.type !== 'ext');
    if (!fromHash) history.replaceState(null, '', '#m=' + encodeURIComponent(p.id));
    document.title = `${p.n} — ${p.r} · MultiHelp`;
    $('#dTitle').textContent = p.n;
    const top = viewable.slice(0, 5);
    $('#gTrack').innerHTML = top.length ? top.map((m,k) => {
      const inner = m.type === 'video'
        ? `<video src="${esc(m.src)}" ${m.thumb ? `poster="${esc(m.thumb)}"` : ''} muted loop playsinline autoplay preload="metadata"></video><span class="g-vtag">${ICON.play(10)}Видео · нажмите, чтобы смотреть со звуком</span>`
        : m.type === 'embed' ? `${tileHTML(m)}<span class="g-vtag">${ICON.play(10)}Видео</span>` : tileHTML(m);
      return `<button data-lb="${k}" aria-label="Открыть работу ${k+1}">${inner}</button>`;
    }).join('') : `<div class="g-empty"><span class="noimg" style="background:transparent;font-size:120px;color:#333">${esc(initials(p.n))}</span></div>`;
    $('#gTrack').scrollLeft = 0;
    $('#dots').innerHTML = top.length > 1 ? top.map((_,i) => `<i class="${i?'':'on'}"></i>`).join('') : '';
    $('#gInfo').innerHTML = `<div class="who"><div class="ava-i">${avaHTML(p)}</div><div><h2>${esc(p.n)}</h2><div class="r">${esc(p.r)} · ${esc(p.c)}</div></div></div>`;
    const dh = $('#dHeart'); dh.classList.toggle('on', favs.has(String(p.id))); dh.dataset.fav = p.id;

    const nPh = p.media.filter(m => m.type === 'photo').length, nV = p.media.length - nPh;
    const long = p.about.length > 160;
    let li = -1;
    $('#dBody').innerHTML = `
      ${p.rating ? `<div class="stats"><div><b>${ICON.star(16)}${rate(p)}</b><span>${p.reviews} отзывов</span></div><div><b>${p.years || '—'}</b><span>лет опыта</span></div></div>`
                 : `<div class="newbie">${ICON.star(16)}<span>Новый специалист на MultiHelp</span></div>`}
      ${p.today ? `<div class="avail"><span class="dot"></span>Свободен сегодня</div>` : ''}
      <div class="facts">
        ${p.area ? `<div>${ICON.pin}<span>${esc(p.area)}</span></div>` : ''}
        ${p.langs ? `<div>${ICON.lang}<span>${esc(p.langs)}</span></div>` : ''}
        ${!p.rating && p.years ? `<div>${ICON.clock}<span>Опыт: ${yearsTxt(p.years)}</span></div>` : ''}
        ${p.urgent ? `<div>${ICON.bolt}<span>Срочный выезд в день обращения</span></div>` : ''}
        ${mode === 'live' ? `<div>${ICON.shield}<span>Профиль проверен модератором MultiHelp</span></div>` : ''}
      </div>
      ${p.about ? `<p class="about ${long ? 'clamp' : ''}" id="about">${esc(p.about)}</p>${long ? '<button class="more" id="more">Читать полностью</button>' : ''}` : ''}
      ${p.media.length ? `
        <div class="h3"><b>Работы</b><span>${nPh ? nPh + ' фото' : ''}${nPh && nV ? ' · ' : ''}${nV ? nV + ' видео' : ''}</span></div>
        ${nPh && nV ? `<div class="pf-tabs"><button class="on" data-pf="all">Все</button><button data-pf="photo">Фото</button><button data-pf="video">Видео</button></div>` : ''}
        <div class="pf" id="pf">${p.media.map(m => m.type === 'ext'
          ? `<a class="ext press" href="${esc(m.url)}" target="_blank" rel="noopener" data-kind="video">${tileHTML(m)}</a>`
          : `<button data-lb="${++li}" data-kind="${m.type === 'photo' ? 'photo' : 'video'}" aria-label="Открыть работу ${li+1}">${tileHTML(m)}</button>`).join('')}</div>` : ''}
      ${p.social.length ? `
        <div class="h3"><b>Соцсети и сайт</b></div>
        <div class="socials">${p.social.map(u => { const so = socInfo(u); return `<a class="soc press" href="${esc(u)}" target="_blank" rel="noopener"><span class="mono">${esc(so.mono)}</span><span>${esc(so.name)}<small>${esc(so.handle)}</small></span>${ICON.ext}</a>`; }).join('')}</div>` : ''}
      ${p.svc.length ? `
        <div class="h3"><b>Услуги и цены</b></div>
        <div class="svc">${p.svc.map(s => `<button class="press" data-svc-wa="${esc(s[0])}"><span>${esc(s[0])}</span><span>${s[1] ? s[1] + ' €' : 'по запросу'}</span><span class="go">${ICON.arrow}</span></button>`).join('')}</div>
        <div class="svc-note">Нажмите на услугу — откроется WhatsApp с готовым сообщением</div>` : ''}
      ${p.rating ? `
        <div class="h3"><b>Отзывы</b></div>
        <div class="rv-sum"><b>${rate(p)}</b><div>${starsRow(p.rating)}<div class="muted" style="font-size:13px;margin-top:4px">на основе ${p.reviews} отзывов</div></div></div>
        ${p.rev.map(r => `<div class="rv"><div class="top"><b>${esc(r.n)}</b><span class="muted">${esc(r.d)}</span></div>${starsRow(5)}<p>${esc(r.t)}</p><span class="svcn">${esc(r.s)}</span></div>`).join('')}` : ''}
      <button class="report">Пожаловаться на профиль</button>`;
    dScroll.scrollTop = 0; dHead.classList.remove('solid');
    detail.classList.add('open'); detail.setAttribute('aria-hidden','false');
    dimmer.classList.add('on');
  }
  function closeDetail(){
    detail.classList.remove('open'); detail.setAttribute('aria-hidden','true');
    dimmer.classList.remove('on'); detail.style.transform = '';
    $$('#gTrack video').forEach(v => v.pause());
    openPro = null;
    document.title = 'MultiHelp — специалисты рядом';
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  }
  $('#back').onclick = closeDetail;
  dimmer.onclick = closeDetail;
  dScroll.addEventListener('scroll', () => dHead.classList.toggle('solid', dScroll.scrollTop > 380), {passive:true});
  $('#gTrack').addEventListener('scroll', e => {
    const t = e.target, i = Math.round(t.scrollLeft / t.clientWidth);
    $$('#dots i').forEach((d,k) => d.classList.toggle('on', k === i));
  }, {passive:true});

  /* swipe-back */
  let sx = null, dx = 0;
  detail.addEventListener('touchstart', e => { const x = e.touches[0].clientX - detail.getBoundingClientRect().left; if (x < 28) { sx = e.touches[0].clientX; detail.classList.add('drag'); } }, {passive:true});
  detail.addEventListener('touchmove', e => { if (sx === null) return; dx = Math.max(0, e.touches[0].clientX - sx); detail.style.transform = `translateX(${dx}px)`; }, {passive:true});
  detail.addEventListener('touchend', () => { if (sx === null) return; detail.classList.remove('drag'); if (dx > 90) closeDetail(); else detail.style.transform = ''; sx = null; dx = 0; });

  /* ---------- lightbox ---------- */
  const lb = $('#lb'), lbTrack = $('#lbTrack');
  let lbIdx = -1;
  function openLB(k){
    if (!openPro) return;
    $$('#gTrack video').forEach(v => v.pause());
    lbTrack.innerHTML = viewable.map((m, i) => {
      if (m.type === 'photo') return `<div><img src="${esc(m.src)}" alt=""></div>`;
      if (m.type === 'video') return `<div><video src="${esc(m.src)}" ${m.thumb ? `poster="${esc(m.thumb)}"` : ''} controls playsinline preload="metadata"></video></div>`;
      return `<div data-embed="${i}"></div>`;
    }).join('');
    lb.classList.add('on'); lbIdx = -1;
    requestAnimationFrame(() => { lbTrack.scrollLeft = lbTrack.clientWidth * k; updLB(); });
  }
  function updLB(){
    const i = Math.round(lbTrack.scrollLeft / lbTrack.clientWidth);
    $('#lbCount').textContent = `${i+1} / ${viewable.length}`;
    if (i === lbIdx) return; lbIdx = i;
    [...lbTrack.children].forEach((slide, k) => {
      const v = slide.querySelector('video');
      if (v) { if (k === i) v.play().catch(() => {}); else v.pause(); }
      if (slide.dataset.embed !== undefined) {
        const m = viewable[+slide.dataset.embed];
        slide.innerHTML = k === i ? `<iframe class="${m.tall ? 'tall' : ''}" src="${esc(m.embed)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen title="Видео"></iframe>` : '';
      }
    });
  }
  function closeLB(){ lb.classList.remove('on'); lbTrack.style.transform = ''; lbTrack.innerHTML = ''; if (openPro) $$('#gTrack video').forEach(v => v.play().catch(() => {})); }
  let lbScrollT;
  lbTrack.addEventListener('scroll', () => { $('#lbCount').textContent = `${Math.round(lbTrack.scrollLeft / lbTrack.clientWidth)+1} / ${viewable.length}`; clearTimeout(lbScrollT); lbScrollT = setTimeout(updLB, 90); }, {passive:true});
  $('#lbClose').onclick = closeLB;
  let ly = null, ldy = 0;
  lbTrack.addEventListener('touchstart', e => { if (e.target.closest('video,iframe')) { ly = null; return; } ly = e.touches[0].clientY; ldy = 0; lbTrack.style.transition = 'none'; }, {passive:true});
  lbTrack.addEventListener('touchmove', e => { if (ly === null) return; ldy = e.touches[0].clientY - ly; if (ldy > 0) { lbTrack.style.transform = `translateY(${ldy}px)`; lb.style.background = `rgba(0,0,0,${Math.max(.3, 1 - ldy/400)})`; } }, {passive:true});
  lbTrack.addEventListener('touchend', () => { lbTrack.style.transition = ''; lb.style.background = ''; if (ly !== null && ldy > 120) closeLB(); else lbTrack.style.transform = ''; ly = null; });

  /* ---------- favs ---------- */
  function toggleFav(id){
    id = String(id);
    if (favs.has(id)) { favs.delete(id); toast('Убрано из избранного'); } else { favs.add(id); toast('Сохранено в избранное'); }
    saveFavs();
    $$('[data-fav]').forEach(b => { if (b.dataset.fav !== id) return; b.classList.toggle('on', favs.has(id)); b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); });
    renderFavs();
  }

  /* ---------- sheets & toast ---------- */
  $$('.sheet-bg').forEach(bg => bg.addEventListener('click', e => { if (e.target === bg) bg.classList.remove('on'); }));
  let tt;
  function toast(t){ const el = $('#toast'); el.textContent = t; el.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => el.classList.remove('on'), 2200); }

  /* ---------- clicks ---------- */
  document.addEventListener('click', e => {
    const t = e.target;
    const fav = t.closest('[data-fav]');
    if (fav) { e.stopPropagation(); e.preventDefault(); return toggleFav(fav.dataset.fav); }
    if (t.closest('.soc, .ext')) return;
    if (t.closest('[data-form]')) { e.preventDefault(); return openForm(); }
    const ct = t.closest('[data-contact]');
    if (ct) { e.preventDefault(); return contactUs({edit:'Здравствуйте! Хочу изменить свой профиль на MultiHelp. Моё имя: ', hide:'Здравствуйте! Прошу скрыть мой профиль на MultiHelp. Моё имя: ', help:'Здравствуйте! У меня вопрос по MultiHelp: '}[ct.dataset.contact]); }
    const tg = t.closest('[data-tab-go]'); if (tg) return go(tg.dataset.tabGo);
    const gs = t.closest('[data-go-search]'); if (gs) { go('search'); setTimeout(() => $('#q').focus(), 350); return; }
    const qk = t.closest('[data-quick]'); if (qk) { Object.keys(flags).forEach(k => flags[k] = false); flags[qk.dataset.quick] = true; cat = 'all'; renderChips(); go('search'); renderResults(); return; }
    const cg = t.closest('[data-cat-go]'); if (cg) { cat = cg.dataset.catGo; renderChips(); go('search'); renderResults(); return; }
    const ch = t.closest('[data-chip]'); if (ch) { cat = ch.dataset.chip; renderChips(); renderResults(); return; }
    const fl = t.closest('[data-flag]'); if (fl) { flags[fl.dataset.flag] = !flags[fl.dataset.flag]; renderChips(); renderResults(); return; }
    if (t.closest('#resetF')) { cat = 'all'; Object.keys(flags).forEach(k => flags[k] = false); q = ''; $('#q').value = ''; city = 'Все города'; renderChips(); renderAll(); return; }
    const pfTab = t.closest('[data-pf]');
    if (pfTab) { $$('[data-pf]').forEach(b => b.classList.toggle('on', b === pfTab)); $$('#pf > *').forEach(b => b.classList.toggle('hide', pfTab.dataset.pf !== 'all' && b.dataset.kind !== pfTab.dataset.pf)); return; }
    const lbBtn = t.closest('[data-lb]'); if (lbBtn) return openLB(+lbBtn.dataset.lb);
    const sv = t.closest('[data-svc-wa]'); if (sv && openPro) return wa(openPro, sv.dataset.svcWa);
    if (t.closest('#more')) { $('#about').classList.remove('clamp'); t.closest('#more').remove(); return; }
    const pr = t.closest('[data-pro]'); if (pr) return openDetail(pr.dataset.pro);
    if (t.closest('[data-open-city]')) { renderCities(); $('#sheetBg').classList.add('on'); return; }
    const cy = t.closest('[data-city]'); if (cy) { city = cy.dataset.city; renderAll(); setTimeout(() => $('#sheetBg').classList.remove('on'), 180); toast(city === 'Все города' ? 'Показываем всю Испанию' : 'Город: ' + city); return; }
    if (t.closest('[data-close-sheet]')) { t.closest('.sheet-bg').classList.remove('on'); return; }
    if (t.closest('#callBtn') && openPro) {
      const num = phoneDigits(openPro.phone || openPro.wa);
      if (!num) { toast(mode === 'demo' ? 'В демо номер скрыт' : 'Мастер не указал телефон'); return; }
      $('#callName').textContent = 'Позвонить · ' + openPro.n;
      $('#callNum').setAttribute('href', 'tel:+' + num);
      $('#callBg').classList.add('on'); return;
    }
    if (t.closest('#callNum')) { $('#callBg').classList.remove('on'); return; }
    if (t.closest('#waBtn') && openPro) return wa(openPro);
    if (t.closest('#share') && openPro) {
      const url = location.origin + location.pathname + '#m=' + encodeURIComponent(openPro.id);
      const data = {title:'MultiHelp — ' + openPro.n, text: openPro.n + ', ' + openPro.r.toLowerCase() + ' · ' + openPro.c, url};
      if (navigator.share) navigator.share(data).catch(() => {});
      else { try { navigator.clipboard.writeText(url); toast('Ссылка на страницу скопирована'); } catch(err) { toast(url); } }
      return;
    }
    if (t.closest('.report') && openPro) { contactUs(`Жалоба на профиль на MultiHelp: ${openPro.n} (${openPro.r}). Причина: `); return; }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.matches('.card')) openDetail(e.target.dataset.pro);
    if (e.key === 'Escape') { if (lb.classList.contains('on')) return closeLB(); if (openPro) closeDetail(); $$('.sheet-bg').forEach(b => b.classList.remove('on')); }
  });
  addEventListener('hashchange', () => { const m = /^#m=(.+)$/.exec(location.hash); if (m && (!openPro || openPro.id !== decodeURIComponent(m[1]))) openDetail(decodeURIComponent(m[1]), true); });

  /* search input */
  const qi = $('#q'), clr = $('#clearQ');
  qi.addEventListener('input', () => { q = qi.value; clr.style.display = q ? 'flex' : 'none'; renderResults(); });
  clr.addEventListener('click', e => { e.preventDefault(); qi.value = q = ''; clr.style.display = 'none'; renderResults(); qi.focus(); });

  $$('.screen').forEach(s => s.addEventListener('scroll', () => { const tb = s.querySelector('.topbar'); if (tb) tb.classList.toggle('shadow', s.scrollTop > 4); }, {passive:true}));

  /* typing hint */
  const hints = ['Нужен сантехник?','Видеограф на свадьбу?','Маникюр на дому?','Тренер по фитнесу?','Репетитор по английскому?'];
  let hi = 0, ci = 0, del = false;
  (function type(){
    const h = hints[hi]; ci += del ? -1 : 1;
    $('#typing').textContent = h.slice(0, ci) || ' ';
    let d = del ? 30 : 65;
    if (!del && ci === h.length) { del = true; d = 1500; }
    if (del && ci === 0) { del = false; hi = (hi+1) % hints.length; d = 250; }
    setTimeout(type, d);
  })();

  /* ---------- load data ---------- */
  function setMasters(list, m){
    MASTERS = list; mode = m;
    $('#demoBadge').hidden = m !== 'demo';
    if (!cities().includes(city)) city = 'Все города';
    renderAll();
    const h = /^#m=(.+)$/.exec(location.hash);
    if (h && !openPro) openDetail(decodeURIComponent(h[1]), true);
  }
  async function load(){
    if (!CFG.SHEET_CSV_URL) { setMasters(DEMO, 'demo'); return; }
    const cached = LS.get('mh_cache', null);
    if (cached && cached.csv) { try { setMasters(rowsToMasters(parseCSV(cached.csv)), 'live'); } catch(e){} }
    else renderAll();
    try {
      const url = CFG.SHEET_CSV_URL + (CFG.SHEET_CSV_URL.includes('?') ? '&' : '?') + '_=' + Date.now();
      const res = await fetch(url, {cache:'no-store'});
      if (!res.ok) throw new Error(res.status);
      const csv = await res.text();
      if (/<html/i.test(csv.slice(0, 200))) throw new Error('not csv');
      LS.set('mh_cache', {csv, at:Date.now()});
      setMasters(rowsToMasters(parseCSV(csv)), 'live');
    } catch(e) {
      if (!cached) { setMasters([], 'live'); toast('Не удалось загрузить каталог. Проверьте интернет'); }
    }
  }
  renderChips(); renderAll(); load();
  setTimeout(() => $('#splash').classList.add('go'), 700);
})();

})();
