/*! Cluma · Website design price benchmark · v1.3.0 · cluma.design
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
    { key: 'copy',  label: 'Copywriting',              perPage: [60, 300],      src: 'S4' },
    { key: 'build', label: 'Development (build)',      range: [3000, 10000], scale: true, src: 'S4' },
    { key: 'seo',   label: 'SEO setup',                range: [2000, 10000], src: 'S4' },
    { key: 'shop',  label: 'E-commerce functionality', range: [5000, 25000], src: 'S4' }
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
      used.S4 = true;
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
    if (p < 10) return ['Below the market', 'This is under almost every comparable project we can find. As a buyer, ask what has been left out. As a designer, you are almost certainly underpricing.'];
    if (p < 30) return ['Low end', 'Cheaper than most comparable work. Reasonable for a lean scope or a provider building a portfolio; check the assumptions before assuming it is a bargain.'];
    if (p < 70) return ['In the typical range', 'Where most comparable projects land. Differences from here are about scope and assumptions, not about whether the price is fair.'];
    if (p < 90) return ['Upper range', 'More than most comparable projects. Justified by senior ownership, a design system or a demanding brand; ask what specifically earns the premium.'];
    return ['Above the market', 'Above nearly every comparable project. Either the scope is bigger than configured here, or this is a premium studio. Worth a direct conversation either way.'];
  }

  /* ---------- UI ---------- */
  var CSS = '.cwdpb{--a:#a344ab;--d:#37033b;--d2:#2a0230;--p:#ffb4ba;--g:#f7f5fa;--t:#1c1826;--m:#6b6577;--l:#e2dde9;font-family:inherit;color:var(--t);margin:2.4rem 0}'
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
  + '.cwdpb .chk{display:flex;flex-wrap:wrap;gap:8px}.cwdpb .chk label{display:inline-flex;align-items:center;gap:7px;font-size:.9rem;font-weight:500;color:var(--t);background:#fff;border:1px solid var(--l);border-radius:999px;padding:8px 13px;margin:0;cursor:pointer}.cwdpb .chk input{margin:0;accent-color:var(--a)}.cwdpb .chk label:has(input:checked){border-color:var(--a);background:#f7ecf7;color:var(--d)}'
  + '.cwdpb .qrow{display:flex;gap:9px;align-items:center}.cwdpb .qrow .cur{color:var(--m);font-size:1.05rem}'
  + '.cwdpb .note{font-size:.78rem;color:var(--m);line-height:1.5;margin:2px 0 0}.cwdpb .note a{color:var(--a)}'
  + '.cwdpb .out{background:var(--d);color:#fff;display:flex;flex-direction:column}'
  + '.cwdpb .hero{margin:14px 0 0;font-weight:600;line-height:.95;letter-spacing:-.02em;font-variant-numeric:tabular-nums;font-size:clamp(3.1rem,8vw,4.6rem)}'
  + '.cwdpb .hero small{font-size:.3em;font-weight:500;letter-spacing:0;opacity:.75;margin-left:.35em;letter-spacing:.01em}'
  + '.cwdpb .verdict{margin:10px 0 0;font-size:.95rem;line-height:1.5;opacity:.92}.cwdpb .verdict b{opacity:1}'
  + '.cwdpb .bar{position:relative;height:8px;border-radius:999px;background:linear-gradient(90deg,#5f2f70,#a344ab 55%,#ffb4ba);margin:22px 0 0}.cwdpb .bar i{position:absolute;top:-6px;width:20px;height:20px;border-radius:50%;background:#fff;border:3px solid var(--d);transform:translateX(-50%);transition:left .28s cubic-bezier(.4,0,.2,1);box-shadow:0 2px 6px rgba(0,0,0,.35)}'
  + '.cwdpb .rows{margin:14px 0 0}'
  + '.cwdpb .row{display:flex;justify-content:space-between;align-items:baseline;gap:12px;padding:13px 0;border-top:1px solid rgba(255,255,255,.14)}'
  + '.cwdpb .row span{font-size:.9rem;opacity:.72}.cwdpb .row b{font-size:1.45rem;font-weight:600;font-variant-numeric:tabular-nums;letter-spacing:-.01em}'
  + '.cwdpb .cta{margin:18px 0 0;padding-top:16px;border-top:1px solid rgba(255,255,255,.14);font-size:.92rem;line-height:1.5}.cwdpb .cta a{color:var(--p);text-decoration:underline;font-weight:500}'
  + '.cwdpb .src{margin:14px 0 0;font-size:.76rem;opacity:.6;line-height:1.5}.cwdpb .src a{color:#fff;text-decoration:underline}'
  + '.cwdpb .spacer{flex:1 1 auto;min-height:8px}';

  function opts(list) { return list.map(function (o) { return '<option value="' + o.key + '">' + o.label + '</option>'; }).join(''); }
  function build(host) {
    if (!document.getElementById(ID + '-css')) { var st = document.createElement('style'); st.id = ID + '-css'; st.textContent = CSS; document.head.appendChild(st); }
    var el = document.createElement('div'); el.className = 'cwdpb'; el.id = ID; el.setAttribute('role', 'region'); el.setAttribute('aria-label', 'Website design price benchmark');
    el.innerHTML =
      '<div class="split">' +
      '<div class="card cfg">' +
      '<p class="eyebrow">Configure the project</p>' +
      '<div><label for="' + ID + '-scope">Scope</label><select id="' + ID + '-scope">' + opts(SCOPE) + '</select></div>' +
      '<div><label for="' + ID + '-cx">Design approach</label><select id="' + ID + '-cx">' + opts(COMPLEXITY) + '</select></div>' +
      '<div><label for="' + ID + '-pv">Who is doing it</label><select id="' + ID + '-pv">' + opts(PROVIDER) + '</select></div>' +
      '<div><label for="' + ID + '-rg">Where they are based</label><select id="' + ID + '-rg">' + opts(REGION) + '</select></div>' +
      '<div><label>Included beyond design</label><div class="chk">' + ADDONS.map(function (a) { return '<label><input type="checkbox" data-addon="' + a.key + '"> ' + a.label + '</label>'; }).join('') + '</div></div>' +
      '<div><label for="' + ID + '-q">The quote you gave or received (USD)</label><div class="qrow"><span class="cur">$</span><input id="' + ID + '-q" type="number" min="0" step="50" inputmode="numeric" placeholder="e.g. 4200"></div></div>' +
      '<p class="note">Design work only unless you add development. Low and high are the 10th and 90th percentile for this configuration. USD, 2026. <a href="#how-this-is-calculated">How this is calculated</a>.</p>' +
      '</div>' +
      '<div class="card out" aria-live="polite"></div>' +
      '</div>';
    host.parentNode.replaceChild(el, host);
    var q = function (s) { return el.querySelector(s); };
    var sel = { scope: q('#' + ID + '-scope'), complexity: q('#' + ID + '-cx'), provider: q('#' + ID + '-pv'), region: q('#' + ID + '-rg') };
    sel.complexity.value = 'custom'; sel.provider.value = 'freelancer'; sel.scope.value = 'mid';
    function cfg() {
      var a = {}; el.querySelectorAll('[data-addon]').forEach(function (c) { a[c.getAttribute('data-addon')] = c.checked; });
      return { scope: sel.scope.value, complexity: sel.complexity.value, provider: sel.provider.value, region: sel.region.value, addons: a };
    }
    var OFFER = 'https://cal.com/cluma/intro-call';
    function cta(p, c) {
      var link = '<a href="' + OFFER + '" target="_blank" rel="noopener">Get an offer from Cluma</a>';
      if (c.provider === 'marketplace') return 'Marketplace rates buy hours, not senior ownership. ' + link + ' for the same scope.';
      if (p >= 70) return 'Paying at the top of the market? ' + link + ' for the same scope and compare.';
      if (p < 30) return 'A low number usually means something was left out. ' + link + ' for the same scope and see what is included.';
      return 'Want a second number for the same scope? ' + link + '.';
    }
    function render() {
      var c = cfg(), b = band(c), out = q('.out'), x = parseFloat(q('#' + ID + '-q').value);
      sel.region.disabled = !PROVIDER.filter(function (p) { return p.key === c.provider; })[0].regional;
      var srcs = Object.keys(b.used).filter(function (k) { return b.used[k] && SOURCES[k]; }).sort().map(function (k) { return '<a href="' + SOURCES[k].url + '" target="_blank" rel="noopener">' + k + '</a>'; }).join(', ');
      var rows, head, marker = '';
      if (!(x > 0)) {
        head = '<p class="eyebrow">Typical for this configuration</p>' +
               '<div class="hero">' + fmt.format(b.med) + '<small>median</small></div>' +
               '<p class="verdict">What comparable projects cost. Enter a quote to see where it sits.</p>';
        rows = '<div class="rows"><div class="row"><span>Low, 10th percentile</span><b>' + fmt.format(b.lo) + '</b></div>' +
               '<div class="row"><span>High, 90th percentile</span><b>' + fmt.format(b.hi) + '</b></div></div>';
        out.innerHTML = head + '<div class="bar"></div>' + rows + '<div class="spacer"></div><div class="src">Sources for this configuration: ' + srcs + '</div>';
        return;
      }
      var p = Math.max(1, Math.min(99, pct(x, b.lo, b.hi))), v = verdict(p);
      head = '<p class="eyebrow">' + fmt.format(x) + ' for this scope</p>' +
             '<div class="hero">' + p + ordinal(p) + '<small>percentile</small></div>' +
             '<p class="verdict"><b>' + v[0] + '.</b> ' + v[1] + '</p>';
      marker = '<i style="left:' + p + '%"></i>';
      rows = '<div class="rows">' +
             '<div class="row"><span>Low, 10th percentile</span><b>' + fmt.format(b.lo) + '</b></div>' +
             '<div class="row"><span>Median</span><b>' + fmt.format(b.med) + '</b></div>' +
             '<div class="row"><span>High, 90th percentile</span><b>' + fmt.format(b.hi) + '</b></div></div>';
      out.innerHTML = head + '<div class="bar">' + marker + '</div>' + rows +
        '<div class="cta">' + cta(p, c) + '</div><div class="spacer"></div>' +
        '<div class="src">Sources: ' + srcs + '. The percentile assumes a log-normal spread between the low and high figures.</div>';
    }
    function ordinal(n) { var s = ['th', 'st', 'nd', 'rd'], v = n % 100; return s[(v - 20) % 10] || s[v] || s[0]; }
    el.addEventListener('input', render); el.addEventListener('change', render); render();
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
