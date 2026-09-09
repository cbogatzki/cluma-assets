/*! Cluma · Website design price benchmark · v2.2.0 · cluma.design
 *  Self-contained. No dependencies. Replaces the marker link
 *  <a href="#website-design-price-benchmark"> inside a Webflow rich text block.
 *  Every coefficient below cites a source in the "sources" table. Method: hours × hourly rate,
 *  low = p10, high = p90, log-normal in between. See "How this is calculated" on the page.
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
    { key: 'marketplace', label: 'Marketplace freelancer (Upwork, Fiverr)', rate: [15, 45],   src: 'S7', regional: false },
    { key: 'freelancer',  label: 'Independent freelancer',               rate: [75, 195],  src: 'S6', regional: true },
    { key: 'boutique',    label: 'Boutique agency',                      rate: [100, 200], src: 'S8', regional: true },
    { key: 'agency',      label: 'Full-service agency',                  rate: [150, 300], src: 'S8', regional: true }
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
    { key: 'copy',  label: 'Copywriting',              perPage: [60, 300],                 src: 'S4' },
    { key: 'illu',  label: 'Illustrations',            range: [300, 1200],  scale: true,   src: 'S10' },
    { key: 'photo', label: 'Imagery',                  range: [300, 1200],  scale: true,   src: 'S11' },
    { key: 'build', label: 'Development',              range: [3000, 10000], scale: true,  src: 'S4' },
    { key: 'seo',   label: 'SEO setup',                range: [2000, 10000],               src: 'S4' },
    { key: 'shop',  label: 'E-commerce',               range: [5000, 25000],               src: 'S4' }
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
  function verdict(p) {
    if (p < 10) return ['Below the market', 'Ask what has been left out.'];
    if (p < 30) return ['Low end', 'Cheaper than most comparable work.'];
    if (p < 70) return ['Typical', 'Where most comparable projects land.'];
    if (p < 90) return ['Upper range', 'More than most comparable projects.'];
    return ['Above the market', 'Higher than almost every comparable project.'];
  }

  /* ---------- UI ---------- */
  var CSS = '.cwdpb{'+'--a:var(--_colors---primary,#a344ab);--d:var(--_colors---dark-purple,#37033b);'+'--p:var(--_colors---lite-pink,#e199ff);--g:var(--_colors---background-fill,whitesmoke);'+'--t:var(--_colors---text-black,#16181c);--m:var(--_colors---text-gray,#7a7f87);--l:#e4dfe9;'+'--fh:var(--_fonts---primary,"Josefin Sans",sans-serif);--fb:var(--_fonts---secondary,Geist,sans-serif);'+'font-family:var(--fb);color:var(--t);margin:2.4rem 0}'
  + '.cwdpb *{box-sizing:border-box}'
  + '.cwdpb .split{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px;align-items:stretch}'
  + '@media(max-width:820px){.cwdpb .split{grid-template-columns:1fr}}'
  + '.cwdpb .card{border-radius:16px;padding:26px 24px}'
  + '.cwdpb .cfg{background:var(--g);border:1px solid var(--l);display:flex;flex-direction:column;gap:16px}'
  + '.cwdpb .eyebrow{font-size:.74rem;letter-spacing:.1em;text-transform:uppercase;font-weight:600;color:var(--m);margin:0}'
  + '.cwdpb .out .eyebrow{color:rgba(255,255,255,.65)}'
  + '.cwdpb label{display:block;font-size:.85rem;color:var(--m);margin-bottom:6px;font-weight:500}'
  + '.cwdpb select,.cwdpb input[type=number]{width:100%;padding:12px 13px;border:1px solid var(--l);border-radius:9px;background:#fff;font:inherit;font-size:1rem;color:var(--t)}'
  + '.cwdpb select:focus,.cwdpb input:focus{outline:2px solid var(--a);outline-offset:1px;border-color:var(--a)}.cwdpb select:disabled{opacity:.45}'
  + '.cwdpb .chk{display:flex;flex-wrap:wrap;gap:8px}.cwdpb .chk label{display:inline-flex;align-items:center;gap:7px;font-size:.9rem;font-weight:500;color:var(--t);background:#fff;border:1px solid var(--l);border-radius:999px;padding:9px 14px;margin:0;cursor:pointer;line-height:1.3}.cwdpb .chk input{margin:0;accent-color:var(--a)}.cwdpb .chk label:has(input:checked){border-color:var(--a);background:#f7ecf7;color:var(--d)}'
  + '.cwdpb .qrow{display:flex;gap:9px;align-items:center}.cwdpb .qrow .cur{color:var(--m);font-size:1.05rem}'
  + '.cwdpb .note{font-size:.78rem;color:var(--m);line-height:1.5;margin:2px 0 0}.cwdpb .note a{color:var(--a)}'
  + '.cwdpb .out{background:var(--d);color:#fff;display:flex;flex-direction:column}'
  + '.cwdpb .topline{display:flex;justify-content:space-between;align-items:baseline;gap:12px}'
  + '.cwdpb .tag{font-size:.7rem;letter-spacing:.09em;text-transform:uppercase;font-weight:500;color:var(--p);white-space:nowrap}'
  + '.cwdpb .hero{font-family:var(--fh);margin:10px 0 0;font-weight:400;line-height:1;letter-spacing:-.02em;font-variant-numeric:tabular-nums;font-size:clamp(3.4rem,9vw,5rem)}'
  + '.cwdpb .heroSub{margin:6px 0 0;font-size:.92rem;opacity:.7;line-height:1.45}'
  + '.cwdpb .verdict{margin:10px 0 0;font-size:.95rem;line-height:1.5;opacity:.9}'
  + '.cwdpb .bar{position:relative;height:6px;border-radius:999px;background:linear-gradient(90deg,#5f2f70,#a344ab 55%,#ffb4ba);margin:26px 0 0}.cwdpb .bar i{position:absolute;top:-7px;width:20px;height:20px;border-radius:50%;background:#fff;border:3px solid var(--d);transform:translateX(-50%);transition:left .28s cubic-bezier(.4,0,.2,1)}'
  + '.cwdpb .bar i.ghost{background:rgba(255,255,255,.4);border-color:rgba(55,3,59,.9)}'
  + '.cwdpb .scale{display:flex;justify-content:space-between;gap:10px;margin:14px 0 0;font-size:.78rem;opacity:.6;font-variant-numeric:tabular-nums;letter-spacing:.01em}'
  + '.cwdpb .scale span:nth-child(2){text-align:center}.cwdpb .scale span:last-child{text-align:right}'
  + '.cwdpb .scale b{display:block;font-family:var(--fh);font-size:1.15rem;font-weight:400;opacity:1;margin-top:3px;letter-spacing:-.01em}'
  + '.cwdpb .cta{margin:22px 0 0;padding-top:20px;border-top:1px solid rgba(255,255,255,.15)}'
  + '.cwdpb .cta p{margin:0 0 12px;font-size:.92rem;opacity:.8;line-height:1.45}'
  + '.cwdpb .cta a{display:inline-block;background:var(--a);color:#fff;text-decoration:none;font-weight:400;font-size:16px;padding:.75rem 1.5rem;border-radius:56px;box-shadow:1.06px 1.06px 3.19px rgba(0,0,0,.12),4.25px 4.25px 15px rgba(0,0,0,.1),9.57px 9.57px 7.44px rgba(0,0,0,.06);transition:background .15s,transform .15s}'
  + '.cwdpb .cta a:hover{background:var(--p);color:var(--d)}.cwdpb .cta a:focus-visible{outline:2px solid #fff;outline-offset:3px}'
  + '.cwdpb .src{margin:18px 0 0;font-size:.74rem;opacity:.45;line-height:1.5}.cwdpb .src a{color:#fff;text-decoration:underline}'
  + '.cwdpb .prog{height:4px;border-radius:999px;background:var(--l);overflow:hidden;margin-bottom:16px}.cwdpb .prog i{display:block;height:100%;background:var(--a);border-radius:999px;transition:width .3s cubic-bezier(.4,0,.2,1)}'
  + '.cwdpb .stepno{font-size:.76rem;letter-spacing:.1em;text-transform:uppercase;font-weight:600;color:var(--m);margin:0}'
  + '.cwdpb .qh{font-family:var(--fh);font-size:1.75rem;line-height:1.2;font-weight:400;margin:8px 0 6px;color:var(--d);text-wrap:balance}'
  + '.cwdpb .qs{font-size:.9rem;color:var(--m);margin:0 0 4px;line-height:1.5}'
  + '.cwdpb .fields{display:flex;flex-direction:column;gap:16px}.cwdpb .fields[hidden]{display:none}'
  + '.cwdpb .nav{display:flex;align-items:center;gap:10px;margin-top:4px;flex-wrap:wrap}'
  + '.cwdpb button{font-family:var(--fb);font-size:16px;font-weight:400;border-radius:56px;padding:.75rem 1.5rem;cursor:pointer;border:1px solid var(--l);background:#fff;color:var(--t);transition:background .15s,border-color .15s}'
  + '.cwdpb button:hover{border-color:var(--a)}.cwdpb button:focus-visible{outline:2px solid var(--a);outline-offset:2px}'
  + '.cwdpb button.primary{background:var(--a);border-color:var(--a);color:#fff;box-shadow:1.06px 1.06px 3.19px rgba(0,0,0,.12),4.25px 4.25px 15px rgba(0,0,0,.1)}.cwdpb button.primary:hover{background:var(--d);border-color:var(--d)}'
  + '.cwdpb .kbd{font-size:.8rem;color:var(--m)}.cwdpb .kbd b{font-weight:600;color:var(--t)}'
  + '.cwdpb .spacer{flex:1 1 auto;min-height:8px}';

  function opts(list) { return list.map(function (o) { return '<option value="' + o.key + '">' + o.label + '</option>'; }).join(''); }
  function build(host) {
    if (!document.getElementById(ID + '-css')) { var st = document.createElement('style'); st.id = ID + '-css'; st.textContent = CSS; document.head.appendChild(st); }
    var el = document.createElement('div'); el.className = 'cwdpb'; el.id = ID; el.setAttribute('role', 'region'); el.setAttribute('aria-label', 'Website design price benchmark');
    el.innerHTML =
      '<div class="split">' +
      '<div class="card cfg">' +
      '<div class="prog"><i style="width:33.33%"></i></div>' +
      '<p class="stepno">Step <b class="stepcur">1</b> of 3</p>' +
      '<h4 class="qh"></h4><p class="qs"></p>' +
      '<div class="fields" data-step="1">' +
        '<div><label for="' + ID + '-scope">Number of pages</label><select id="' + ID + '-scope">' + opts(SCOPE) + '</select></div>' +
        '<div><label>Included beyond design</label><div class="chk">' + ADDONS.map(function (a) { return '<label><input type="checkbox" data-addon="' + a.key + '"> ' + a.label + '</label>'; }).join('') + '</div></div>' +
      '</div>' +
      '<div class="fields" data-step="2" hidden>' +
        '<div><label for="' + ID + '-pv">Who is doing it</label><select id="' + ID + '-pv">' + opts(PROVIDER) + '</select></div>' +
        '<div><label for="' + ID + '-rg">Where they are based</label><select id="' + ID + '-rg">' + opts(REGION) + '</select></div>' +
      '</div>' +
      '<div class="fields" data-step="3" hidden>' +
        '<div><label for="' + ID + '-q">The quote you gave or received (USD)</label><div class="qrow"><span class="cur">$</span><input id="' + ID + '-q" type="number" min="0" step="50" inputmode="numeric" placeholder="e.g. 4200"></div></div>' +
      '</div>' +
      '<div class="nav"><button type="button" class="back" hidden>Back</button><button type="button" class="next primary">Next</button><span class="kbd">Press <b>Enter</b></span></div>' +
      '<div class="spacer"></div>' +
      '<p class="note">Custom design, design only unless you add development. USD, 2026. <a href="#how-this-is-calculated">How this is calculated</a>.</p>' +
      '</div>' +
      '<div class="card out" aria-live="polite"></div>' +
      '</div>';
    host.parentNode.replaceChild(el, host);
    var q = function (s) { return el.querySelector(s); };
    var sel = { scope: q('#' + ID + '-scope'), provider: q('#' + ID + '-pv'), region: q('#' + ID + '-rg') };
    sel.provider.value = 'freelancer'; sel.scope.value = 'mid';
    function cfg() {
      var a = {}; el.querySelectorAll('[data-addon]').forEach(function (c) { a[c.getAttribute('data-addon')] = c.checked; });
      return { scope: sel.scope.value, complexity: 'custom', provider: sel.provider.value, region: sel.region.value, addons: a };
    }
    var OFFER = 'https://cal.com/cluma/intro-call';
    var OFFER = 'https://cal.com/cluma/intro-call';
    function ctaLine(p, c) {
      if (c.provider === 'marketplace') return 'Marketplace rates buy hours, not senior ownership.';
      if (p >= 70) return 'Paying at the top of the market?';
      if (p < 30) return 'A low number usually means something was left out.';
      return 'Want a second number for the same scope?';
    }
    function render() {
      var c = cfg(), b = band(c), out = q('.out'), x = parseFloat(q('#' + ID + '-q').value);
      sel.region.disabled = !PROVIDER.filter(function (p) { return p.key === c.provider; })[0].regional;
      var srcs = Object.keys(b.used).filter(function (k) { return b.used[k] && SOURCES[k]; })
        .sort(function (m, n) { return +m.slice(1) - +n.slice(1); })
        .map(function (k) { return '<a href="' + SOURCES[k].url + '" target="_blank" rel="noopener">' + k + '</a>'; }).join(', ');
      var scale = '<div class="scale"><span>Low<b>' + fmt.format(b.lo) + '</b></span><span>Median<b>' + fmt.format(b.med) + '</b></span><span>High<b>' + fmt.format(b.hi) + '</b></span></div>';
      var ctaBlock = function (line) { return '<div class="cta"><p>' + line + '</p><a href="' + OFFER + '" target="_blank" rel="noopener">Get an offer</a></div>'; };
      if (!(x > 0)) {
        out.innerHTML =
          '<div class="topline"><p class="eyebrow">Typical for this scope</p><span class="tag">Median</span></div>' +
          '<div class="hero">' + fmt.format(b.med) + '</div>' +
          '<p class="heroSub">Half of comparable projects cost less than this, half cost more. Add your quote in step 3 to see exactly where it sits.</p>' +
          '<div class="bar"><i class="ghost" style="left:50%"></i></div>' + scale +
          ctaBlock('Want a number for this scope?') +
          '<div class="spacer"></div><div class="src">' + srcs + '</div>';
        return;
      }
      var p = Math.max(1, Math.min(99, pct(x, b.lo, b.hi))), v = verdict(p);
      out.innerHTML =
        '<div class="topline"><p class="eyebrow">' + fmt.format(x) + ' for this scope</p><span class="tag">' + v[0] + '</span></div>' +
        '<div class="hero">' + p + '%</div>' +
        '<p class="heroSub">of comparable projects cost less than this quote. ' + v[1] + '</p>' +
        '<div class="bar"><i style="left:' + p + '%"></i></div>' + scale +
        ctaBlock(ctaLine(p, c)) +
        '<div class="spacer"></div><div class="src">' + srcs + '</div>';
    }
    function ordinal(n) { var s = ['th', 'st', 'nd', 'rd'], v = n % 100; return s[(v - 20) % 10] || s[v] || s[0]; }
    var STEPS = [
      { h: 'What is the scope?', s: 'How many pages, and everything the quote includes beyond design.' },
      { h: 'Who is doing the work, and where?', s: 'Provider type and location move the price more than anything else.' },
      { h: 'What is the quote?', s: 'The number you gave, or the one you received.' }
    ];
    var step = 1;
    function paint() {
      el.querySelector('.prog i').style.width = (step / 3 * 100) + '%';
      el.querySelector('.stepcur').textContent = step;
      el.querySelector('.qh').textContent = STEPS[step - 1].h;
      el.querySelector('.qs').textContent = STEPS[step - 1].s;
      Array.prototype.forEach.call(el.querySelectorAll('.fields'), function (f) { f.hidden = +f.getAttribute('data-step') !== step; });
      el.querySelector('.back').hidden = step === 1;
      el.querySelector('.next').hidden = step === 3;
      el.querySelector('.kbd').hidden = step === 3;
      var inside = el.contains(document.activeElement);
      var first = el.querySelector('.fields[data-step="' + step + '"] select, .fields[data-step="' + step + '"] input');
      if (first && inside) first.focus();
    }
    function go(n) { step = Math.max(1, Math.min(3, n)); paint(); }
    el.querySelector('.next').addEventListener('click', function () { go(step + 1); });
    el.querySelector('.back').addEventListener('click', function () { go(step - 1); });
    el.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); if (step < 3) go(step + 1); } });
    el.addEventListener('input', render); el.addEventListener('change', render);
    paint(); render();
  }
  function init() {
    var a = document.querySelector('.w-richtext a[href="#' + ID + '"], a[href="#' + ID + '"]');
    if (!a) return;
    var host = a.closest('p') || a;
    build(host);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  window.ClumaTools = window.ClumaTools || {}; window.ClumaTools.websiteDesignPriceBenchmark = { band: band, pct: pct, sources: SOURCES };
})();
