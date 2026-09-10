/*! Cluma · Website design price benchmark · v3.0.0 · cluma.design
 *  Self-contained. No dependencies. Replaces the marker link
 *  <a href="#website-design-price-benchmark"> inside a Webflow rich text block.
 *  Every coefficient below cites a source in the "sources" table. Method: hours × hourly rate,
 *  low = p10, high = p90, log-normal in between. See "How this is calculated" on the page.
 *
 *  Hierarchy (from the design):
 *    Level 1, one per zone: the question, the figure, the offer.
 *    Level 2: the answer controls, the scale, the CTA line.
 *    Level 3: orientation and provenance. Never coloured, never bold.
 *  Accent purple is reserved for level 1 actions. Display type for the question and the figure only.
 */
(function () {
  'use strict';
  var ID = 'website-design-price-benchmark';
  if (window.__clumaWdpb) return; window.__clumaWdpb = true;

  /* ---------- Data (USD, 2026). Codes refer to the sources table. ---------- */
  var SOURCES = {
    S1: { name: 'Clutch, Design Agency Pricing Guide', note: 'verified client reviews, 79,000 agencies, updated Sep 2026', url: 'https://clutch.co/agencies/design/pricing' },
    S2: { name: 'DesignRush, Web Design Budget Guide', note: '400+ verified projects, Dec 2025', url: 'https://www.designrush.com/agency/website-design-development/trends/freelance-vs-web-design-agency-cost' },
    S3: { name: 'GoodFirms 2026 agency survey', note: '300+ firms, 31 countries', url: 'https://www.goodfirms.co/resources/web-design-cost' },
    S4: { name: 'WebFX, web design pricing study', note: '250 US marketing professionals, 2026', url: 'https://www.webfx.com/web-design/pricing/' },
    S6: { name: 'WhatShouldICharge, UI/UX designer rates', note: 'built on US BLS OEWS May 2024, updated Aug 2026', url: 'https://whatshouldicharge.io/ui-ux-designer' },
    S7: { name: 'Upwork published rate pages', note: 'marketplace medians, 2026', url: 'https://www.upwork.com/hire/web-designers/cost/' },
    S10: { name: 'Thumbtack, 2026 illustration rates', note: 'custom illustration $300–1,200 for headers and landing pages; average project $640', url: 'https://www.thumbtack.com/p/illustration-rates' },
    S11: { name: '2026 commercial photography pricing', note: '10–20 image package $300–1,200; commercial shoots $500–5,000', url: 'https://larsmillermedia.com/product-photography-pricing/' },
    S9: { name: '2026 web design pricing breakdown', note: 'freelancer vs boutique agency ranges by site type', url: 'https://www.munixstudio.com/learn/website-development/website-development-cost-breakdown-2026' },
    S8: { name: '2026 agency rate guides (US tiers)', note: 'mid-market $100–149/h, boutique $150–200/h, specialised $200–300/h', url: 'https://www.designstudiouiux.com/blog/ui-ux-design-project-cost/' }
  };

  /* Billed design hours by scope, design-only, custom: the hours implied by the cited project ranges
     at the cited hourly rates (S3, S6, S8, S9). Checked: freelancer US mid scope reproduces $2,400–10,100. */
  var SCOPE = [
    { key: 'landing', label: 'Landing page (1 page)',        hours: [10, 14] },
    { key: 'small',   label: 'Small site (2–5 pages)',       hours: [20, 40] },
    { key: 'mid',     label: 'Business site (6–10 pages)',   hours: [32, 52] },
    { key: 'large',   label: 'Larger site (11–20 pages)',    hours: [60, 130] },
    { key: 'xl',      label: 'Extensive site (21+ pages)',   hours: [100, 220] }
  ];
  var COMPLEXITY = [
    { key: 'template', label: 'Template-based, adapted',            mult: 0.6, src: 'S2' },
    { key: 'custom',   label: 'Custom design',                      mult: 1.0, src: 'S2' },
    { key: 'system',   label: 'Custom with a design system',        mult: 1.4, src: 'S6' }
  ];
  /* Hourly rate bands [p10, p90] for a US provider, USD. */
  var PROVIDER = [
    { key: 'freelancer',  label: 'Independent freelancer',               rate: [75, 195],  src: 'S6', regional: true },
    { key: 'boutique',    label: 'Boutique agency',                      rate: [100, 200], src: 'S8', regional: true },
    { key: 'agency',      label: 'Full-service agency',                  rate: [150, 300], src: 'S8', regional: true },
    { key: 'marketplace', label: 'Marketplace freelancer (Upwork, Fiverr)', rate: [15, 45], src: 'S7', regional: false }
  ];
  /* Regional multipliers from Clutch hourly bands (S1): US/AU 100–149 = 1.0 · CA/PL/ES 50–99 ≈ 0.6 · IN/PH/UA 25–49 ≈ 0.3 */
  var REGION = [
    { key: 'us',   label: 'US, Australia, UK',                 mult: 1.0,  src: 'S1' },
    { key: 'weu',  label: 'Western Europe, Canada',            mult: 0.8,  src: 'S1' },
    { key: 'eeu',  label: 'Eastern Europe, Spain, LatAm',      mult: 0.6,  src: 'S1' },
    { key: 'asia', label: 'South and Southeast Asia',          mult: 0.3,  src: 'S1' }
  ];
  /* Add-ons as flat ranges (S4), applied on top of design. */
  var ADDONS = [
    { key: 'copy',  label: 'Copywriting',   perPage: [60, 300],                src: 'S4' },
    { key: 'illu',  label: 'Illustrations', range: [300, 1200],  scale: true,  src: 'S10' },
    { key: 'photo', label: 'Imagery',       range: [300, 1200],  scale: true,  src: 'S11' },
    { key: 'build', label: 'Development',   range: [3000, 10000], scale: true, src: 'S4' },
    { key: 'seo',   label: 'SEO setup',     range: [2000, 10000],              src: 'S4' },
    { key: 'shop',  label: 'E-commerce',    range: [5000, 25000],              src: 'S4' }
  ];
  var PAGES_MID = { landing: 1, small: 4, mid: 8, large: 15, xl: 28 };

  /* ---------- Model ---------- */
  function band(cfg) {
    var sc = SCOPE.filter(function (s) { return s.key === cfg.scope; })[0];
    var cx = COMPLEXITY.filter(function (c) { return c.key === cfg.complexity; })[0];
    var pv = PROVIDER.filter(function (p) { return p.key === cfg.provider; })[0];
    var rg = REGION.filter(function (r) { return r.key === cfg.region; })[0];
    var rm = pv.regional ? rg.mult : 1;
    var lo = sc.hours[0] * cx.mult * pv.rate[0] * rm;
    var hi = sc.hours[1] * cx.mult * pv.rate[1] * rm;
    var used = { S1: pv.regional, S2: true, S3: true, S6: true, S9: true, S7: pv.key === 'marketplace', S8: pv.key !== 'marketplace' && pv.key !== 'freelancer', S4: false };
    var pages = PAGES_MID[sc.key];
    ADDONS.forEach(function (a) {
      if (!cfg.addons[a.key]) return;
      used[a.src] = true;
      if (a.perPage) { lo += a.perPage[0] * pages; hi += a.perPage[1] * pages; }
      else { var s = a.scale ? Math.max(0.5, Math.min(3, pages / 8)) : 1; lo += a.range[0] * s; hi += a.range[1] * s; }
    });
    return { lo: lo, hi: hi, med: Math.sqrt(lo * hi), used: used };
  }
  /* Percentile of x in a log-normal with p10 = lo, p90 = hi. */
  function pct(x, lo, hi) {
    var mu = (Math.log(lo) + Math.log(hi)) / 2, sigma = (Math.log(hi) - Math.log(lo)) / (2 * 1.2816);
    var z = (Math.log(x) - mu) / sigma;
    return Math.round(100 * 0.5 * (1 + erf(z / Math.SQRT2)));
  }
  function erf(x) { var t = 1 / (1 + 0.3275911 * Math.abs(x)); var y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return x < 0 ? -y : y; }
  var fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  /* ---------- Styles ---------- */
  var CSS = [
    '.cwdpb{',
    '--page:transparent;',
    '--panel-form:var(--_colors---background-fill,#f3f3f4);',
    '--panel-result:#f4dee2;',
    '--panel-cta:#f1dbc6;',
    '--field:#fff;--field-border:#e5e5e8;--field-border-hi:var(--_colors---primary,#a24daf);',
    '--ink-strong:var(--_colors---dark-purple,#3b0a3f);',
    '--ink-body:var(--_colors---text-black,#5f5f66);',
    '--ink-muted:var(--_colors---text-gray,#83838b);',
    '--ink-invert:#fff;',
    '--ink-rose:#3b0a3f;--ink-rose-soft:#7b5a80;--ink-rose-dim:#9a839e;',
    '--accent:var(--_colors---primary,#a24daf);--accent-press:var(--_colors---dark-purple,#8e3f9b);',
    '--track-empty:#e2e2e6;--progress-fill:#b79cbb;',
    '--scale-a:#3b0a3f;--scale-b:#9c74a5;--scale-c:#d8ae8a;',
    '--r-panel:26px;--r-field:13px;--r-pill:999px;',
    '--font-display:var(--_fonts---primary,"Josefin Sans",sans-serif);',
    '--font-text:var(--_fonts---secondary,Geist,-apple-system,BlinkMacSystemFont,sans-serif);',
    '--t-body:1.0625rem;--t-field:1.0625rem;--t-h1:2.25rem;--t-figure:clamp(2.5rem,4.2vw,4rem);',
    '--t-note:.9375rem;--t-fine:.875rem;',
    '--pad-panel:32px;--gap-panel:20px;--form-min:520px;',
    'font-family:var(--font-text);font-size:var(--t-body);line-height:1.5;color:var(--ink-body);',
    'margin:2.6rem 0;-webkit-font-smoothing:antialiased}',

    '.cwdpb *,.cwdpb *::before,.cwdpb *::after{box-sizing:border-box}',
    '.cwdpb button,.cwdpb input,.cwdpb select{font:inherit;color:inherit}',
    '.cwdpb :focus-visible{outline:2px solid var(--accent);outline-offset:3px}',
    '.cwdpb [hidden]{display:none!important}',
    '.cwdpb .u-vh{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}',

    /* shell */
    '.cwdpb .shell{display:grid;grid-template-columns:1fr 1fr;gap:var(--gap-panel);align-items:stretch}',
    '.cwdpb .column{display:grid;grid-template-rows:1fr auto;gap:var(--gap-panel);min-width:0}',
    '.cwdpb .panel{border-radius:var(--r-panel);padding:var(--pad-panel);display:flex;flex-direction:column;min-width:0}',
    '.cwdpb .panel--form{background:var(--panel-form);min-height:var(--form-min)}',
    '.cwdpb .panel--result{background:var(--panel-result);color:var(--ink-rose)}',
    '.cwdpb .panel--cta{background:var(--panel-cta);color:var(--ink-strong)}',

    /* level 3: orientation */
    '.cwdpb .meter{display:flex;align-items:center;gap:16px;margin-bottom:34px}',
    '.cwdpb .meter__track{flex:1;height:3px;border-radius:var(--r-pill);background:var(--track-empty);overflow:hidden}',
    '.cwdpb .meter__fill{height:100%;width:20%;background:var(--progress-fill);border-radius:var(--r-pill);transition:width .28s ease}',
    '.cwdpb .meter__count{flex:none;font-size:var(--t-fine);color:var(--ink-muted);font-variant-numeric:tabular-nums}',

    /* level 1: the question */
    '.cwdpb .step__title{font-family:var(--font-display);font-size:var(--t-h1);font-weight:600;line-height:1.12;letter-spacing:-.01em;color:var(--ink-strong);margin:0 0 14px;text-wrap:balance}',
    '.cwdpb .step__lede{margin:0 0 28px;max-width:34ch;font-size:var(--t-note);color:var(--ink-muted)}',

    /* level 2: the controls */
    '.cwdpb .select{position:relative;display:block}',
    '.cwdpb .select select{width:100%;appearance:none;-webkit-appearance:none;padding:16px 46px 16px 20px;font-size:var(--t-field);color:var(--ink-strong);background:var(--field);border:1px solid var(--field-border);border-radius:var(--r-field);cursor:pointer}',
    '.cwdpb .select select:focus-visible{outline:none;border-color:var(--field-border-hi);box-shadow:0 0 0 3px rgba(162,77,175,.22)}',
    '.cwdpb .select select:disabled{cursor:not-allowed;color:var(--ink-muted);background:#fafafb}',
    '.cwdpb .select::after{content:"";position:absolute;right:20px;top:50%;width:9px;height:9px;margin-top:-6px;border-right:1.5px solid var(--ink-muted);border-bottom:1.5px solid var(--ink-muted);transform:rotate(45deg);pointer-events:none}',

    '.cwdpb .options{border:0;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:10px}',
    '.cwdpb .pill{display:inline-flex;align-items:center;gap:11px;padding:12px 20px 12px 16px;background:var(--field);border:1px solid var(--field-border);border-radius:var(--r-pill);font-size:var(--t-field);color:var(--ink-body);cursor:pointer;line-height:1.2;transition:border-color .15s ease,color .15s ease}',
    '.cwdpb .pill:hover{border-color:#cfcfd6}',
    '.cwdpb .pill input{appearance:none;-webkit-appearance:none;width:18px;height:18px;margin:0;flex:none;border:1.5px solid #c2c2c9;border-radius:5px;background:var(--field);display:grid;place-content:center;cursor:pointer}',
    '.cwdpb .pill input::after{content:"";width:9px;height:5px;border-left:2px solid #fff;border-bottom:2px solid #fff;transform:rotate(-45deg) scale(0);transition:transform .12s ease}',
    '.cwdpb .pill input:checked{background:var(--accent);border-color:var(--accent)}',
    '.cwdpb .pill input:checked::after{transform:rotate(-45deg) scale(1)}',
    '.cwdpb .pill:has(input:checked){border-color:var(--accent);color:var(--ink-strong)}',
    '.cwdpb .pill input:focus-visible{outline:none}',
    '.cwdpb .pill:has(input:focus-visible){outline:2px solid var(--accent);outline-offset:2px}',

    '.cwdpb .amount{display:flex;align-items:center;gap:14px}',
    '.cwdpb .amount__symbol{font-size:var(--t-field);color:var(--ink-muted)}',
    '.cwdpb .amount input{flex:1;min-width:0;padding:16px 20px;font-size:var(--t-field);color:var(--ink-strong);background:var(--field);border:1px solid var(--field-border);border-radius:var(--r-field)}',
    '.cwdpb .amount input:focus-visible{outline:none;border-color:var(--field-border-hi);box-shadow:0 0 0 3px rgba(162,77,175,.22)}',

    /* actions */
    '.cwdpb .actions{display:flex;align-items:center;gap:12px;margin-top:30px}',
    '.cwdpb .btn{border:1px solid transparent;border-radius:var(--r-pill);padding:14px 30px;font-size:var(--t-field);line-height:1.2;cursor:pointer;transition:background-color .15s ease,border-color .15s ease,color .15s ease}',
    '.cwdpb .btn--primary{background:var(--accent);color:var(--ink-invert)}',
    '.cwdpb .btn--primary:hover{background:var(--accent-press)}',
    '.cwdpb .btn--back{background:transparent;padding:14px 12px;color:var(--accent)}',
    '.cwdpb .btn--back:hover{color:var(--accent-press)}',

    '.cwdpb .footnote{margin:auto 0 0;padding-top:36px;max-width:44ch;font-size:var(--t-fine);color:var(--ink-muted)}',
    '.cwdpb .footnote a{color:var(--accent)}',

    /* result: the figure wins */
    '.cwdpb .result__head{display:flex;justify-content:space-between;align-items:baseline;gap:16px;font-size:var(--t-fine);color:var(--ink-rose-soft)}',
    '.cwdpb .result__value{min-height:7.5rem}',
    '.cwdpb .result__figure{margin:10px 0 0;font-family:var(--font-display);font-size:var(--t-figure);font-weight:500;line-height:1;letter-spacing:-.02em;color:var(--ink-rose);font-variant-numeric:tabular-nums;text-wrap:balance}',
    '.cwdpb .result__caption{margin:10px 0 0;max-width:28ch;font-size:var(--t-note);color:var(--ink-rose-soft)}',
    '.cwdpb .panel--result.is-empty .result__verdict,.cwdpb .panel--result.is-empty .scale__knob{display:none}',

    '.cwdpb .scale{margin-top:48px}',
    '.cwdpb .scale__track{position:relative;height:6px;border-radius:var(--r-pill);background:linear-gradient(90deg,var(--scale-a),var(--scale-b) 55%,var(--scale-c))}',
    '.cwdpb .scale__knob{position:absolute;top:50%;left:22%;width:15px;height:15px;margin:-7.5px 0 0 -7.5px;border-radius:50%;background:var(--ink-rose);box-shadow:0 0 0 3px var(--panel-result);transition:left .28s ease}',
    '.cwdpb .scale__flag{position:absolute;bottom:18px;left:50%;transform:translateX(-50%);white-space:nowrap;font-size:var(--t-fine);color:var(--ink-rose);font-variant-numeric:tabular-nums}',
    '.cwdpb .scale__marks{display:grid;grid-template-columns:repeat(3,1fr);margin-top:14px}',
    '.cwdpb .mark:nth-child(2){text-align:center}.cwdpb .mark:nth-child(3){text-align:right}',
    '.cwdpb .mark__name{display:block;font-size:var(--t-fine);color:var(--ink-rose-dim)}',
    '.cwdpb .mark__value{display:block;margin-top:1px;font-size:var(--t-note);color:var(--ink-rose-soft);font-variant-numeric:tabular-nums}',

    '.cwdpb .sources{margin:auto 0 0;padding-top:36px;font-size:var(--t-fine);color:var(--ink-rose-dim)}',
    '.cwdpb .sources a{color:var(--accent)}',

    /* CTA: quiet until there is a result to act on */
    '.cwdpb .panel--cta{flex-direction:row;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:20px 24px;padding:26px var(--pad-panel)}',
    '.cwdpb .panel--cta>div{flex:1 1 260px;min-width:0}',
    '.cwdpb .cta__title{margin:0 0 4px;font-size:var(--t-body);font-weight:500;color:var(--ink-strong)}',
    '.cwdpb .cta__text{margin:0;max-width:34ch;font-size:var(--t-fine);color:var(--ink-body)}',
    '.cwdpb .btn--cta{flex:none;display:inline-block;text-decoration:none;background:transparent;border-color:var(--accent);color:var(--accent);padding:14px 28px}',
    '.cwdpb .btn--cta:hover{background:rgba(162,77,175,.1)}',
    '.cwdpb .btn--cta.is-ready{background:var(--accent);border-color:var(--accent);color:var(--ink-invert)}',
    '.cwdpb .btn--cta.is-ready:hover{background:var(--accent-press);border-color:var(--accent-press)}',

    /* responsive */
    '@media(max-width:900px){.cwdpb{--pad-panel:24px;--t-h1:1.85rem;--t-figure:clamp(2.1rem,8.5vw,3rem);--t-field:1rem;--r-panel:22px;--form-min:0px}',
    '.cwdpb .result__value{min-height:6rem}',
    '.cwdpb .shell{grid-template-columns:1fr}',
    '.cwdpb .column{order:-1;grid-template-rows:auto auto}',
    '.cwdpb .panel--cta{flex-direction:column;align-items:flex-start;gap:18px}',
    '.cwdpb .sources,.cwdpb .footnote{padding-top:26px}}',
    '@media(prefers-reduced-motion:reduce){.cwdpb *{transition:none!important}}'
  ].join('');

  /* ---------- Markup ---------- */
  var OFFER = 'https://cal.com/cluma/intro-call';
  var STEPS = [
    { h: 'How big is the site?',              s: 'Page count is the starting point for every estimate.' },
    { h: 'What is included beyond design?',   s: 'Everything the quote covers on top of the design work itself.' },
    { h: 'Who is doing the work?',            s: 'Provider type moves the price more than scope does.' },
    { h: 'Where are they based?',             s: 'The same scope carries very different rates by region.' },
    { h: 'What is the quote?',                s: 'The number you gave, or the one you received.' }
  ];
  var TOTAL = STEPS.length;
  function opts(list, sel) {
    return list.map(function (o) { return '<option value="' + o.key + '"' + (o.key === sel ? ' selected' : '') + '>' + o.label + '</option>'; }).join('');
  }

  function build(host) {
    if (!document.getElementById(ID + '-css')) {
      var st = document.createElement('style'); st.id = ID + '-css'; st.textContent = CSS; document.head.appendChild(st);
    }
    var el = document.createElement('div');
    el.className = 'cwdpb'; el.id = ID;
    el.setAttribute('role', 'region'); el.setAttribute('aria-label', 'Website design price benchmark');
    el.innerHTML =
      '<div class="shell">' +

      '<section class="panel panel--form">' +
        '<div class="meter"><div class="meter__track" role="presentation"><div class="meter__fill"></div></div><span class="meter__count">1 of ' + TOTAL + '</span></div>' +

        '<div class="step" data-step="1">' +
          '<h3 class="step__title"></h3><p class="step__lede"></p>' +
          '<label class="u-vh" for="' + ID + '-scope">Number of pages</label>' +
          '<div class="select"><select id="' + ID + '-scope">' + opts(SCOPE, 'mid') + '</select></div>' +
          '<div class="actions"><button type="button" class="btn btn--primary" data-go="2">Next</button></div>' +
        '</div>' +

        '<div class="step" data-step="2" hidden>' +
          '<h3 class="step__title"></h3><p class="step__lede"></p>' +
          '<fieldset class="options"><legend class="u-vh">Included beyond design</legend>' +
          ADDONS.map(function (a) { return '<label class="pill"><input type="checkbox" data-addon="' + a.key + '"> ' + a.label + '</label>'; }).join('') +
          '</fieldset>' +
          '<div class="actions"><button type="button" class="btn btn--primary" data-go="3">Next</button><button type="button" class="btn btn--back" data-go="1">Back</button></div>' +
        '</div>' +

        '<div class="step" data-step="3" hidden>' +
          '<h3 class="step__title"></h3><p class="step__lede"></p>' +
          '<label class="u-vh" for="' + ID + '-pv">Who is doing it</label>' +
          '<div class="select"><select id="' + ID + '-pv">' + opts(PROVIDER, 'freelancer') + '</select></div>' +
          '<div class="actions"><button type="button" class="btn btn--primary" data-go="4">Next</button><button type="button" class="btn btn--back" data-go="2">Back</button></div>' +
        '</div>' +

        '<div class="step" data-step="4" hidden>' +
          '<h3 class="step__title"></h3><p class="step__lede"></p>' +
          '<label class="u-vh" for="' + ID + '-rg">Where they are based</label>' +
          '<div class="select"><select id="' + ID + '-rg">' + opts(REGION, 'us') + '</select></div>' +
          '<div class="actions"><button type="button" class="btn btn--primary" data-go="5">Next</button><button type="button" class="btn btn--back" data-go="3">Back</button></div>' +
        '</div>' +

        '<div class="step" data-step="5" hidden>' +
          '<h3 class="step__title"></h3><p class="step__lede"></p>' +
          '<label class="u-vh" for="' + ID + '-q">The quote you gave or received in US dollars</label>' +
          '<div class="amount"><span class="amount__symbol" aria-hidden="true">$</span>' +
          '<input id="' + ID + '-q" type="text" inputmode="numeric" placeholder="3,200"></div>' +
          '<div class="actions"><button type="button" class="btn btn--back" data-go="4">Back</button></div>' +
        '</div>' +

        '<p class="footnote">Custom design, design only unless you add development. USD, 2026. ' +
        '<a href="#how-this-is-calculated">How this is calculated</a>.</p>' +
      '</section>' +

      '<div class="column">' +
        '<section class="panel panel--result is-empty" aria-live="polite">' +
          '<div class="result__head"><span class="result__scope"></span><span class="result__verdict"></span></div>' +
          '<div class="result__value"><p class="result__figure"></p><p class="result__caption"></p></div>' +
          '<div class="scale"><div class="scale__track">' +
            '<span class="scale__knob"><span class="scale__flag"></span></span>' +
          '</div><div class="scale__marks">' +
            '<span class="mark"><span class="mark__name">Low</span><span class="mark__value" data-lo></span></span>' +
            '<span class="mark"><span class="mark__name">Median</span><span class="mark__value" data-med></span></span>' +
            '<span class="mark"><span class="mark__name">High</span><span class="mark__value" data-hi></span></span>' +
          '</div></div>' +
          '<p class="sources">Sources: <span class="sources__list"></span></p>' +
        '</section>' +

        '<section class="panel panel--cta">' +
          '<div><h4 class="cta__title">Want a real number for this project?</h4><p class="cta__text"></p></div>' +
          '<a class="btn btn--cta" href="' + OFFER + '" target="_blank" rel="noopener">Get an offer</a>' +
        '</section>' +
      '</div>' +

      '</div>';

    host.parentNode.replaceChild(el, host);

    var q = function (s) { return el.querySelector(s); };
    var steps   = [].slice.call(el.querySelectorAll('.step'));
    var fill    = q('.meter__fill');
    var count   = q('.meter__count');
    var quoteEl = q('#' + ID + '-q');
    var scopeEl = q('#' + ID + '-scope');
    var pvEl    = q('#' + ID + '-pv');
    var rgEl    = q('#' + ID + '-rg');
    var panel   = q('.panel--result');
    var figure  = q('.result__figure');
    var caption = q('.result__caption');
    var verdict = q('.result__verdict');
    var headScope = q('.result__scope');
    var knob    = q('.scale__knob');
    var flag    = q('.scale__flag');
    var cta     = q('.btn--cta');
    var ctaText = q('.cta__text');
    var srcList = q('.sources__list');

    steps.forEach(function (s, i) {
      s.querySelector('.step__title').textContent = STEPS[i].h;
      s.querySelector('.step__lede').textContent  = STEPS[i].s;
    });

    function cfg() {
      var a = {};
      Array.prototype.forEach.call(el.querySelectorAll('[data-addon]'), function (c) { a[c.getAttribute('data-addon')] = c.checked; });
      return { scope: scopeEl.value, complexity: 'custom', provider: pvEl.value, region: rgEl.value, addons: a };
    }
    function scopeLabel() { return SCOPE.filter(function (s) { return s.key === scopeEl.value; })[0].label; }

    var current = 1;
    function show(n) {
      current = Math.max(1, Math.min(TOTAL, n));
      steps.forEach(function (s) { s.hidden = +s.getAttribute('data-step') !== current; });
      fill.style.width = (current / TOTAL * 100) + '%';
      count.textContent = current + ' of ' + TOTAL;
      cta.classList.toggle('is-ready', current === TOTAL);
      if (el.contains(document.activeElement)) {
        var f = steps[current - 1].querySelector('select:not(:disabled), input, button');
        if (f) f.focus({ preventScroll: true });
      }
    }

    function ctaLine(filled, p, c) {
      if (!filled) return 'Send the scope and get a fixed quote back, usually within a day.';
      if (c.provider === 'marketplace') return 'Marketplace rates buy hours, not senior ownership. See what the same scope costs with a senior team.';
      if (p >= 70) return 'At the top of the market it is worth putting a second number next to this one before you sign.';
      if (p < 30) return 'A low number usually means something was left out. Get a quote that lists what is included.';
      return 'A second number for the same scope is the fastest way to sanity-check this one.';
    }

    function render() {
      var c = cfg(), b = band(c);
      var regional = PROVIDER.filter(function (p) { return p.key === c.provider; })[0].regional;
      rgEl.disabled = !regional;
      steps[3].querySelector('.step__lede').textContent = regional
        ? STEPS[3].s
        : 'Marketplace rates are set globally, so location does not move this number.';

      q('[data-lo]').textContent  = fmt.format(b.lo);
      q('[data-med]').textContent = fmt.format(b.med);
      q('[data-hi]').textContent  = fmt.format(b.hi);

      srcList.innerHTML = Object.keys(b.used).filter(function (k) { return b.used[k] && SOURCES[k]; })
        .sort(function (m, n) { return +m.slice(1) - +n.slice(1); })
        .map(function (k) { return '<a href="' + SOURCES[k].url + '" target="_blank" rel="noopener" title="' + SOURCES[k].name + '">' + k + '</a>'; })
        .join(', ');

      var raw = String(quoteEl.value).replace(/[^0-9.]/g, '');
      var v = parseFloat(raw);
      var filled = raw !== '' && !isNaN(v) && v > 0;
      panel.classList.toggle('is-empty', !filled);

      if (!filled) {
        headScope.textContent = scopeLabel();
        figure.textContent  = fmt.format(b.med);
        caption.textContent = 'is the typical quote for this scope';
        ctaText.textContent = ctaLine(false);
        return;
      }

      var p = Math.max(1, Math.min(99, pct(v, b.lo, b.hi)));
      var gap = v - b.med;

      headScope.textContent = fmt.format(v) + ' for this scope';
      knob.style.left = p + '%';
      flag.textContent = fmt.format(v);
      verdict.textContent = p < 33 ? 'Low end' : p < 67 ? 'Mid range' : 'High end';

      if (Math.abs(gap) / b.med < 0.02) {
        figure.textContent  = 'On the money';
        caption.textContent = 'this is the typical quote for this scope';
      } else {
        figure.textContent  = fmt.format(Math.abs(gap)) + (gap < 0 ? ' under' : ' over');
        caption.textContent = 'the typical quote for this scope, which is ' + fmt.format(b.med);
      }
      ctaText.textContent = ctaLine(true, p, c);
    }

    el.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-go]') : null;
      if (t && el.contains(t)) show(+t.getAttribute('data-go'));
    });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && current < TOTAL && e.target.tagName !== 'BUTTON' && e.target.tagName !== 'A') {
        e.preventDefault(); show(current + 1);
      }
    });
    el.addEventListener('input', render);
    el.addEventListener('change', render);

    show(1); render();
  }

  function init() {
    var a = document.querySelector('.w-richtext a[href="#' + ID + '"], a[href="#' + ID + '"]');
    if (!a) return;
    build(a.closest('p') || a);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  window.ClumaTools = window.ClumaTools || {};
  window.ClumaTools.websiteDesignPriceBenchmark = { band: band, pct: pct, sources: SOURCES };
})();
