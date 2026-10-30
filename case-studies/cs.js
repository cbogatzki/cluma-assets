/* Cluma case study popup v1 for /our-work. Source: cbogatzki/cluma-assets case-studies/, served via jsDelivr.
   One script tag: it loads cs.css next to itself, injects the dialog and opens it for any element with
   data-open-case="kaasai|inkt|tradecaddy". Images resolve relative to this file. */
(function () {
  'use strict';
  if (window.__clumaCS) return;
  window.__clumaCS = true;
  var me = document.currentScript, BASE = me && me.src ? me.src.replace(/[^\/]*$/, '') : '';
  var css = document.createElement('link'); css.rel = 'stylesheet'; css.href = BASE + 'cs.css'; document.head.appendChild(css);
  var holder = document.createElement('div');
  holder.innerHTML = '<div class="cs" id="cs" hidden data-lenis-prevent>\n' +
    '  <div class="cs-backdrop" data-close></div>\n' +
    '  <div class="cs-dialog" role="dialog" aria-modal="true" aria-labelledby="cs-title" aria-describedby="cs-help" tabindex="-1">\n' +
    '    <p id="cs-help" class="sr-only">Case study gallery. Use the left and right arrow keys to move through it. Press Escape to close.</p>\n' +
    '\n' +
    '    <header class="cs-head">\n' +
    '      <span class="cs-count" id="cs-count">Case 1 of 3</span>\n' +
    '      <div class="cs-head-actions">\n' +
    '        <button type="button" class="cs-case-btn" id="cs-prev-case"><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg><span class="lbl"></span></button>\n' +
    '        <button type="button" class="cs-case-btn" id="cs-next-case"><span class="lbl"></span><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></button>\n' +
    '        <button type="button" class="cs-close" id="cs-close" aria-label="Close case study" data-close><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 3l10 10M13 3 3 13" stroke="currentColor" stroke-width="1.6"/></svg></button>\n' +
    '      </div>\n' +
    '    </header>\n' +
    '\n' +
    '    <div class="cs-body" id="cs-body">\n' +
    '      <div class="cs-track" id="cs-track" role="region" aria-roledescription="gallery" aria-label="Case study gallery" tabindex="0"></div>\n' +
    '\n' +
    '      <footer class="cs-strip" id="cs-strip">\n' +
    '        <h2 class="cs-title" id="cs-title"></h2>\n' +
    '        <p class="cs-summary" id="cs-summary"></p>\n' +
    '        <div class="cs-nav">\n' +
    '          <button type="button" class="cs-arrow" id="cs-prev" aria-label="Scroll gallery back"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></button>\n' +
    '          <button type="button" class="cs-arrow" id="cs-next" aria-label="Scroll gallery forward"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></button>\n' +
    '        </div>\n' +
    '      </footer>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</div>';
  document.body.appendChild(holder.firstElementChild);

  // Gallery = columns. A column is one full-height tile or two stacked tiles.
  // w = column width as a ratio of gallery height. mar = tile aspect ratio on mobile.
  var CASES = [
    {
      id: 'kaasai', name: 'Kaasai', logo: 'assets/logo-kaasai-wide.webp', thumb: 'assets/kaasai-photo.avif',
      title: 'Energy intelligence,<br><span class="serif">made legible.</span>',
      tags: ['Product design', 'Design system', 'Dashboard UI'],
      summary: 'A dashboard for an AI energy platform backed by Microsoft. Cost, CO₂e, renewables and AI optimization on one screen, without overwhelming the operator.',
      cols: [
        { w: 1.34, tiles: [{ t: 'scene', src: 'assets/v5/k-cobalt.webp', alt: 'Kaasai Production Overview on a tablet held over a sunlit cobalt blue wall', mar: '4/3' }] },
        { w: 0.9, tiles: [{ t: 'wg', bg: '#0e1729', mar: '9/10', alt: 'Kaasai KPI cards counting up: total production cost 18.6 million dollars, 4,320 tonnes CO2e, 64 percent renewable', items: [
          { w: 'kpi', x: '7%', y: '4%', sw: '68%', z: 1, icon: 'cost', label: 'Total Production Cost', delta: '27%', dn: 1, val: 18.6, pre: '$', suf: 'M', rows: [['Carbon cost', '$1.47M'], ['Total cost saved', '$6.2M']] },
          { w: 'kpi', x: '18%', y: '36%', sw: '68%', z: 2, icon: 'co2', label: 'Total Production CO<sub>2</sub>e', delta: '18%', dn: 1, val: 4320, suf: ' t', rows: [['Gross emissions', '15,980 t'], ['Reduction vs diesel', '−73%']] },
          { w: 'kpi', x: '29%', y: '68%', sw: '68%', z: 3, icon: 'leaf', label: 'Total % Renewable', delta: '6%', val: 64, suf: '%', rows: [['Diesel avoided', '1,240,000 L'], ['Carbon credits', '12.6k']] }] }] },
        { w: 0.62, tiles: [{ t: 'text', key: 'Approach', h: 'Density solved in <span class="serif">wireframes.</span>', p: 'Research first, then structure. The final UI came from a token-based system, on a deadline with no room for rework.', bg: '#eef4fb', fg: '#0e1729' }] },
        { w: 1.0, tiles: [
          { t: 'scene', src: 'assets/v5/k-velvet.webp', alt: 'Kaasai Production Overview on a laptop on a navy velvet ottoman in hard sunlight', op: '40% 35%', mar: '16/10' },
          { t: 'draw', src: 'assets/v2/k-area.webp', alt: 'Production cost stacked area chart drawing in', bg: '#1d5fd6', iw: '128%', x: '7%', y: '14%', box: ['5.4%', '16%', '93.5%', '70%'], mar: '16/10' }] },
        { w: 1.25, tiles: [{ t: 'pan', src: 'assets/v5/k-overview-l.webp', alt: 'Camera moving slowly across the Kaasai Production Overview screen', bg: '#dce9f6', mar: '4/3' }] },
        { w: 0.75, tiles: [{ t: 'scene', src: 'assets/v5/k-cushion.webp', alt: 'Kaasai Production Overview on a tablet leaning on navy velvet cushions against a blue wall', mar: '3/4' }] },
        { w: 0.8, tiles: [{ t: 'wg', bg: '#3d5a80', mar: '4/5', alt: 'Kaasai asset cards: BESS units online and a diesel and HVO generator on standby, values counting up', items: [
          { w: 'asset', x: '6%', y: '6%', sw: '86%', z: 1, icon: 'bat', name: 'BESS Units', sub: '200 / 140 / 60 kW', status: 'Online', sc: '#22a06b', rows: [['Delivered', 6820, ' kWh'], ['System uptime', 99.3, '%'], ['Energy contribution', 38, '%'], ['Fallbacks prevented', 7, '']] },
          { w: 'asset', x: '16%', y: '46%', sw: '86%', z: 2, icon: 'drop', name: 'Diesel / HVO Generator', sub: 'Legacy power / fallback', status: 'Standby', sc: '#d6922a', rows: [['Fuel consumed', 3980, ' L'], ['Produced', 10420, ' kWh'], ['Emission', 2.41, ' t CO₂e'], ['Fallback triggers', 3, '']] }] }] },
        { w: 0.62, tiles: [{ t: 'text', key: 'Outcome', h: 'The numbers that change a decision <span class="serif">come first.</span>', bg: '#1aa3ec', fg: '#fff' }] },
        { w: 0.6, tiles: [{ t: 'logos', key: 'Backers and partners', bg: '#fff', fg: '#0e1729', items: [
          { src: 'assets/logo-microsoft.svg', alt: 'Microsoft' }, { src: 'assets/logo-mod.jpg', alt: 'Ministry of Defence', tall: true }, { src: 'assets/logo-desnz.jpg', alt: 'Department for Energy Security and Net Zero', tall: true }] }] },
        { w: 0.66, tiles: [{ t: 'quote', q: 'Pleasure working with Cluma on a tight deadline. They delivered and we got the result we wanted!', name: 'Maryann Chen', bg: '#0e1729', fg: '#fff' }] }
      ]
    },
    {
      id: 'inkt', name: 'Inkt', logo: 'assets/logo-inkt.avif', thumb: 'assets/inkt-photo.avif',
      title: 'Creator platform<br><span class="serif">brand and app</span>',
      tags: ['Brand identity', 'Mobile app', 'Design system'],
      summary: 'A brand identity and mobile app for creators, founded by Sony Music’s SVP of Sales. One identity carried from brand into every screen.',
      cols: [
        { w: 0.75, tiles: [{ t: 'scene', src: 'assets/v5/i-hand.webp', alt: 'Inkt splash screen on a phone held against a sunlit terracotta wall', mar: '3/4' }] },
        { w: 1.0, tiles: [{ t: 'pattern', src: 'assets/v5/i-super.svg', logo: 'assets/v5/i-wordmark.svg', alt: 'The Inkt wordmark supergraphic drifting slowly across brand orange', bg: '#f4751b', mar: '1/1' }] },
        { w: 0.62, tiles: [{ t: 'text', key: 'Approach', h: 'One system, <span class="serif">not two.</span>', p: 'Identity, design system, flows and final UI owned end to end, so brand and interface never needed reconciling.', bg: '#f6efe4', fg: '#141414' }] },
        { w: 1.34, tiles: [{ t: 'scene', src: 'assets/v5/i-velvet.webp', alt: 'Inkt home screen on a phone lying on orange velvet under a palm shadow', mar: '4/3' }] },
        { w: 0.62, tiles: [{ t: 'feed', src: 'assets/v5/i-guest.webp', alt: 'The Inkt guest home screen with the featured story and suggested experts, floating gently', bg: '#f6efe4', mar: '3/4' }] },
        { w: 1.34, tiles: [{ t: 'scene', src: 'assets/v5/i-cards.webp', alt: 'Inkt business cards in brand orange with the white wordmark on travertine', mar: '4/3' }] },
        { w: 0.62, tiles: [{ t: 'flow', a: 'assets/v5/i-onb.webp', b: 'assets/v5/i-homescr.webp', alt: 'A tap on Find experts moves from the Inkt welcome screen to the home feed', bg: '#fcd9bd', mar: '3/4' }] },
        { w: 1.0, tiles: [{ t: 'scene', src: 'assets/v5/i-cream.webp', alt: 'Inkt supergraphic poster on a sunlit cream wall above an orange sofa', op: '50% 45%', mar: '1/1' }] },
        { w: 0.62, tiles: [{ t: 'text', key: 'System', h: 'Trust in <span class="serif">five tiers.</span>', p: 'A five-tier trust model separates new members from verified experts without adding friction.', bg: '#141414', fg: '#f6efe4' }] },
        { w: 0.95, tiles: [{ t: 'stack2', motion: 'in fl', bg: '#efe4d6', mar: '19/20', items: [
          { src: 'assets/v5/i-hero2.webp', alt: 'Featured card: Explore beautiful work, made on inkt', x: '62%', y: '26%', sw: '96%', z: 1 },
          { src: 'assets/v2/i-banner.webp', alt: 'Save your place banner with a sign up button', x: '41%', y: '57%', sw: '72%', z: 2 },
          { src: 'assets/v2/i-expert.webp', alt: 'Expert listing card: Aria Chen, mastering', x: '72%', y: '84%', sw: '48%', z: 3 }] }] },
        { w: 0.66, tiles: [{ t: 'quote', q: 'Cluma was fantastic to work with and very communicative throughout the process. They listened and made recommendations based on our priorities.', name: 'Martin Schöneberger', bg: '#f47820', fg: '#fff' }] }
      ]
    },
    {
      id: 'tradecaddy', name: 'TradeCaddy', logo: 'assets/logo-tradecaddy.webp', thumb: 'assets/tc-photo.avif',
      title: 'Crypto trading<br><span class="serif">interface</span>',
      tags: ['Product design', 'Competitor research', 'Component library'],
      summary: 'An algo-trading platform for bot-first traders: DCA, Grid and Signal bots plus a manual terminal. The tools are genuinely complex. The interface could not be.',
      cols: [
        { w: 1.34, tiles: [{ t: 'scene', src: 'assets/v5/t-yellow.webp', alt: 'TradeCaddy analytics screen on a laptop on a sunlit yellow desk beside a navy notebook', mar: '4/3' }] },
        { w: 0.8, tiles: [
          { t: 'wg', bg: '#f5b400', mar: '16/10', alt: 'DCA win rate gauge filling to 71 percent', items: [
            { w: 'gauge', x: '18%', y: '13%', sw: '64%', z: 1, label: 'DCA Win Rate', val: 71, note: 'Across all active bots' }] },
          { t: 'wg', bg: '#cfe4f7', mar: '16/10', alt: 'Top strategies sliding in: ETH/USDT DCA plus 74.2 percent ROI, BTC/USDT DCA plus 52.8 percent, DOGE/USDT plus 28.3 percent', items: [
            { w: 'strat', x: '7%', y: '9%', sw: '80%', z: 1, from: 'r', name: 'ETH/USDT DCA', roi: 74.2, meta: '12 orders · 3.2% avg gain' },
            { w: 'strat', x: '15%', y: '38%', sw: '80%', z: 2, from: 'r', name: 'BTC/USDT DCA', roi: 52.8, meta: '8 orders · 2.1% avg gain' },
            { w: 'strat', x: '23%', y: '67%', sw: '80%', z: 3, from: 'r', name: 'DOGE/USDT', roi: 28.3, meta: '6 orders · 1.8% avg gain' }] }] },
        { w: 0.62, tiles: [{ t: 'text', key: 'Research', h: 'A dozen apps, <span class="serif">one library.</span>', p: 'Competing trading apps benchmarked for density and labels. The winning patterns became one component library across every bot.', bg: '#0a1a26', fg: '#fff' }] },
        { w: 0.9, tiles: [{ t: 'draw', src: 'assets/v2/t-chart.webp', alt: 'ETH/USDT candlestick chart drawing in', bg: '#0a1a26', iw: '116%', x: '-18%', y: '10%', box: ['0%', '9%', '88%', '84%'], mar: '4/5' }] },
        { w: 1.34, tiles: [{ t: 'scene', src: 'assets/v5/t-navy.webp', alt: 'TradeCaddy DCA bot screen on a monitor in a navy room lit by a yellow desk lamp', mar: '4/3' }] },
        { w: 0.6, tiles: [{ t: 'wg', bg: '#16a974', mar: '3/4', alt: 'A cursor taps Review Bot in the DCA bot configuration panel: ETH/USDT on Binance Futures, long, 20 USDT per trade, 2.4 percent take profit', items: [
          { w: 'config', x: '8%', b: '6%', sw: '84%', z: 1 }] }] },
        { w: 1.1, tiles: [
          { t: 'wg', bg: '#3c9be6', mar: '16/9', alt: 'Daily profit and loss bar chart for February 2026, bars growing from the zero line', items: [
            { w: 'bars', x: '7%', y: '12%', sw: '104%', z: 1, title: 'Daily P/L', month: 'February 2026',
              v: [75, -14, 90, 102, 55, 78, -8, 118, 85, 52, -25, 92, 62, 108, 34, -38, 82, 56, 70, 16, -40] }] },
          { t: 'wg', bg: '#e6eef5', mar: '16/9', alt: 'Stat cards counting up: 71 percent win rate of 98 trades, 2.4x profit factor, 4.2 hour average hold time', items: [
            { w: 'stat', x: '6%', y: '20%', sw: '40%', z: 1, label: 'Win rate', val: 71, suf: '%', note: 'of 98 trades', green: 1 },
            { w: 'stat', x: '36%', y: '40%', sw: '40%', z: 2, label: 'Profit factor', val: 2.4, suf: 'x', note: 'Above avg' },
            { w: 'stat', x: '66%', y: '60%', sw: '40%', z: 3, label: 'Avg hold time', val: 4.2, suf: 'h', note: 'per trade' }] }] },
        { w: 0.62, tiles: [{ t: 'text', key: 'Outcome', h: 'Beginners not overwhelmed. Pros <span class="serif">not slowed down.</span>', bg: '#f5b400', fg: '#0a1a26' }] },
        { w: 0.66, tiles: [{ t: 'quote', q: 'Cluma’s approach to the design process has helped in making design decisions simple and understanding why we should or shouldn’t design things in certain ways.', name: 'Max Niederlücke', bg: '#0a1a26', fg: '#fff' }] }
      ]
    }
  ];

  (function fix(o) { for (var k in o) { if (typeof o[k] === 'string' && o[k].indexOf('assets/') === 0) o[k] = BASE + o[k]; else if (o[k] && typeof o[k] === 'object') fix(o[k]); } })(CASES);

  // ---------- helpers ----------
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var strip = function (s) { return s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); };
  var mqMobile = window.matchMedia('(max-width: 767px)');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  var root = $('#cs'), dialog = $('.cs-dialog', root), track = $('#cs-track'), body = $('#cs-body'), inerted = [];
  var btnPrev = $('#cs-prev'), btnNext = $('#cs-next'), btnPrevCase = $('#cs-prev-case'), btnNextCase = $('#cs-next-case');
  var current = 0, lastTrigger = null, cols = [];

  // ---------- render ----------
  function tileHTML(x, idx) {
    var style = '--tb:' + (x.bg || '#eee') + ';' + (x.fg ? 'color:' + x.fg + ';' : '') + (x.mar ? '--mar:' + x.mar + ';' : '') +
      (x.rot != null ? '--rot:' + x.rot + 'deg;' : '') + (x.pad ? '--pad:' + x.pad + ';' : '') +
      (x.ry != null ? '--ry:' + x.ry + 'deg;' : '') + (x.rx != null ? '--rx:' + x.rx + 'deg;' : '') + (x.rz != null ? '--rz:' + x.rz + 'deg;' : '');
    var img = function (lazy) { return '<img src="' + x.src + '" alt="' + esc(x.alt) + '" draggable="false"' + (lazy ? ' loading="lazy"' : '') + '>'; };
    switch (x.t) {
      case 'stack2': return '<figure class="tile stack2' + (x.motion ? ' anim' : '') + '" style="' + style + '">' + x.items.map(function (it, k) {
          return '<span class="it ' + (x.motion || '') + '" style="--x:' + it.x + ';--y:' + it.y + ';--sw:' + it.sw + ';--rot:' + (it.rot || 0) + 'deg;--ry:' + (it.ry || 0) + 'deg;--z:' + (it.z || 1) + ';--d:' + (k * 0.16) + 's;--fd:' + (-k * 2.1) + 's"><span class="mv">' +
            '<img src="' + it.src + '" alt="' + esc(it.alt) + '" draggable="false" loading="lazy"' + (it.cls ? ' class="' + it.cls + '"' : '') + '></span></span>';
        }).join('') + '</figure>';
      case 'wg': return widgetTile(x, style);
      case 'draw': return '<figure class="tile draw anim" style="' + style + '--x:' + x.x + ';--y:' + x.y + ';--iw:' + x.iw + ';"><div class="dw">' + img(true) +
        '<i class="cv" aria-hidden="true" style="--cl:' + x.box[0] + ';--ct:' + x.box[1] + ';--cw:' + x.box[2] + ';--ch:' + x.box[3] + ';--cc:' + (x.cover || '#fff') + '"></i></div></figure>';
      case 'count': return '<figure class="tile count anim" style="' + style + '--sw:' + (x.sw || '78%') + '"><div class="cw">' + img(true) +
        '<span class="num" data-count="' + x.val + '" data-suffix="' + (x.suffix || '') + '" aria-hidden="true" style="--nl:' + x.box[0] + ';--nt:' + x.box[1] + ';--nw:' + x.box[2] + ';--nh:' + x.box[3] + ';--nf:' + (x.nf || '9cqw') + '">' + x.val + (x.suffix || '') + '</span></div></figure>';
      case 'pan': return '<figure class="tile pan anim" style="' + style + '"><div class="win">' + img(true) + '</div></figure>';
      case 'feed': return '<figure class="tile feed anim" style="' + style + '--rz:' + (x.rz || 0) + 'deg" role="img" aria-label="' + esc(x.alt) + '"><div class="ph"><div class="scr">' +
        '<img class="full" src="' + x.src + '" alt="" loading="lazy"></div></div></figure>';
      case 'flow': return '<figure class="tile flow anim" style="' + style + '--rz:' + (x.rz || 0) + 'deg" role="img" aria-label="' + esc(x.alt) + '"><div class="ph"><div class="scr">' +
        '<img class="full" src="' + x.a + '" alt="" loading="lazy"><img class="full b" src="' + x.b + '" alt="" loading="lazy"><i class="hi" aria-hidden="true"></i>' +
        '<div class="trk" style="--trk:v5-trk-inkt;--sx:78%;--sy:92%"><span class="rip"></span><span class="dot"></span></div></div></div></figure>';
      case 'tap': return '<figure class="tile tap anim" style="' + style + '"><div class="cw">' + img(true) +
        '<i class="press" aria-hidden="true" style="--bl:' + x.btn[0] + ';--bt:' + x.btn[1] + ';--bw:' + x.btn[2] + ';--bh:' + x.btn[3] + '"></i>' +
        '<div class="trk" style="--trk:v5-trk-tc;--sx:82%;--sy:58%"><span class="rip"></span><svg class="cur" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 2.5v17.2l4.6-4.4 3 6.6 3-1.4-3-6.4h6.3z" fill="#fff" stroke="#0a1a26" stroke-width="1.4" stroke-linejoin="round"/></svg></div></div></figure>';
      case 'pattern': return '<figure class="tile pattern anim" style="' + style + '" role="img" aria-label="' + esc(x.alt) + '"><div class="sg"><img src="' + x.src + '" alt="" loading="lazy"></div><img class="wm" src="' + x.logo + '" alt=""></figure>';
      case 'scene': return '<figure class="tile scene" style="' + style + (x.op ? '--op:' + x.op + ';' : '') + '">' + img(false) + '</figure>';
      case 'stack': return '<figure class="tile stack" style="' + style + '">' + x.items.map(function (it) {
          return '<img src="' + it.src + '" alt="' + esc(it.alt) + '" draggable="false" loading="lazy"' + (it.cls ? ' class="' + it.cls + '"' : '') + ' style="--x:' + it.x + ';--y:' + it.y + ';--sw:' + it.sw + ';--rot:' + (it.rot || 0) + 'deg;--ry:' + (it.ry || 0) + 'deg;--z:' + (it.z || 1) + '">';
        }).join('') + '</figure>';
      case 'zoom': return '<figure class="tile zoom" style="' + style + '--iw:' + x.iw + ';--x:' + x.x + ';--y:' + x.y + ';">' + img(true) + '</figure>';
      case 'photo': return '<figure class="tile photo" style="' + style + '">' + img(false) + '</figure>';
      case 'ui': return '<figure class="tile ui ' + (x.cls || '') + '" style="' + style + '">' + img(true) + '</figure>';
      case 'phone': return '<figure class="tile device phone" style="' + style + '">' + img(true) + '</figure>';
      case 'device': return '<figure class="tile device" style="' + style + '"><div class="tab">' + img(true) + '</div></figure>';
      case 'text': return '<section class="tile text" style="' + style + '" aria-label="' + esc(x.key) + '"><p class="key">' + esc(x.key) + '</p><div class="grp"><h3>' + x.h + '</h3>' + (x.p ? '<p class="body">' + esc(x.p) + '</p>' : '') + '</div></section>';
      case 'quote': return '<section class="tile text quote" style="' + style + '" aria-label="Client quote"><blockquote>“' + esc(x.q) + '”</blockquote><p class="name">' + esc(x.name) + '</p></section>';
      case 'logos': return '<section class="tile text logos" style="' + style + '" aria-label="' + esc(x.key) + '"><p class="key">' + esc(x.key) + '</p><ul>' +
        x.items.map(function (l) { return '<li' + (l.tall ? ' class="tall"' : '') + '><img src="' + l.src + '" alt="' + esc(l.alt) + '"></li>'; }).join('') + '</ul></section>';
      case 'cta': return '<section class="tile text cta" style="--mar:auto" aria-label="Next steps"><p class="key">Your product next</p><div class="grp"><h3>Want this for <span class="serif">your product?</span></h3>' +
        '<a class="cs-btn" href="https://cal.com/cluma/intro-call" target="_blank" rel="noopener">Book a call</a></div>' +
        '<button type="button" class="next" data-goto-case="' + x.next + '">Next case: ' + esc(CASES[x.next].name) + ' <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></button></section>';
    }
  }

  // ---------- live widgets: real UI from the Figma files, rebuilt in HTML so numbers, bars and arcs can move ----------
  var ICON = {
    cost: '<path d="M12 3v18M16.5 7.5c-.6-1.5-2.3-2.5-4.5-2.5-2.6 0-4.5 1.4-4.5 3.4 0 4.6 9 2.4 9 7.2 0 2-2 3.4-4.5 3.4-2.3 0-4.1-1-4.7-2.7" />',
    co2: '<path d="M7 18a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 9.5a4.25 4.25 0 0 1-.5 8.5z" />',
    leaf: '<path d="M5 19c0-8 5.5-13 14-14 0 8.5-5 14-12.5 14M5 19l6-6" />',
    bat: '<rect x="3" y="8" width="16" height="8" rx="2" /><path d="M21 11v2M7 11v2" />',
    drop: '<path d="M12 3.5c3 3.8 5.5 7 5.5 10a5.5 5.5 0 0 1-11 0c0-3 2.5-6.2 5.5-10z" />'
  };
  var ico = function (k) { return '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">' + ICON[k] + '</svg>'; };
  var dec = function (v) { return (String(v).split('.')[1] || '').length; };
  var fmt = function (v, d, sep) { var t = (+v).toFixed(d); return sep ? t.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : t; };
  // A number that counts up when its tile first comes into view. Final value is in the markup, so no-JS and reduced motion read it straight.
  var cnt = function (v, pre, suf, delay) {
    var d = dec(v), sep = Math.abs(v) >= 1000 ? 1 : 0;
    return '<span class="n" data-count="' + v + '" data-pre="' + esc(pre || '') + '" data-suffix="' + esc(suf || '') + '" data-sep="' + sep + '" data-delay="' + (delay || 0) + '">' + esc((pre || '') + fmt(v, d, sep) + (suf || '')) + '</span>';
  };
  var ARROW = { up: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" /></svg>', dn: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3v10M3.5 8.5 8 13l4.5-4.5" /></svg>' };
  var WIDGET = {
    kpi: function (o, ms) {
      return '<div class="wc kpi"><div class="hd">' + ico(o.icon) + '<span class="lb">' + o.label + '</span><span class="dl">' + (o.dn ? ARROW.dn : ARROW.up) + o.delta + '</span></div>' +
        '<div class="big">' + cnt(o.val, o.pre, o.suf, ms) + '</div><div class="rw">' +
        o.rows.map(function (r) { return '<div><span>' + esc(r[0]) + '</span><b>' + esc(r[1]) + '</b></div>'; }).join('') + '</div></div>';
    },
    asset: function (o, ms) {
      return '<div class="wc asset"><div class="hd">' + ico(o.icon) + '<div class="nm"><b>' + esc(o.name) + '</b><span>' + esc(o.sub) + '</span></div>' +
        '<span class="st" style="--sc:' + o.sc + '"><i></i>' + esc(o.status) + '</span></div><div class="rw">' +
        o.rows.map(function (r, k) { return '<div><span>' + esc(r[0]) + '</span><b>' + cnt(r[1], '', r[2], ms + 120 * k) + '</b></div>'; }).join('') + '</div></div>';
    },
    stat: function (o, ms) {
      return '<div class="wc stat"><span class="lb">' + esc(o.label) + '</span><div class="vl"><b' + (o.green ? ' class="g"' : '') + '>' + cnt(o.val, '', o.suf, ms) + '</b><span>' + esc(o.note) + '</span></div></div>';
    },
    strat: function (o, ms) {
      return '<div class="wc strat"><svg class="si" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="5" width="10" height="5" rx="1.5" /><rect x="5" y="13" width="10" height="5" rx="1.5" /><path d="M20 8.5 17.5 11l2.5 2.5" /></svg>' +
        '<div><b class="t">' + esc(o.name) + ' <span class="g">+' + cnt(o.roi, '', '%', ms) + '</span> ROI</b><span class="m">' + esc(o.meta) + '</span><span class="cp">Copy →</span></div></div>';
    },
    config: function () {
      var f = function (lb, inner) { return '<div class="f"><span class="fl">' + lb + '</span><div class="in">' + inner + '</div></div>'; };
      return '<div class="wc config"><span class="ttl">DCA Bot Configuration</span>' +
        f('Name', 'ETH/USDT Classic DCA') +
        f('Exchange', '<i class="bx"></i>Binance Futures<em class="live">LIVE</em>') +
        f('Pair', '<svg class="mg" viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.5" /><path d="m10.5 10.5 3 3" /></svg>ETH/USDT') +
        '<div class="f"><span class="fl">Direction</span><div class="seg"><b>Long</b><span>Short</span></div></div>' +
        f('Amount per trade', '20<em>USDT</em>') + f('Take profit', '2.4<em>%</em>') +
        '<div class="req">Required <b>~86 USDT</b></div><div class="go">Review Bot<i class="press"></i>' +
        '<span class="tp" aria-hidden="true"><span class="rip"></span><svg class="cur" viewBox="0 0 24 24"><path d="M5 2.5v17.2l4.6-4.4 3 6.6 3-1.4-3-6.4h6.3z" fill="#fff" stroke="#0a1a26" stroke-width="1.4" stroke-linejoin="round"/></svg></span></div>' +
        '<span class="cs2">Customize strategy ›</span></div>';
    },
    gauge: function (o, ms) {
      // 210 degree arc from 9 o'clock over the top to 4 o'clock, like the Figma gauge
      return '<div class="wc gauge"><span class="lb">' + esc(o.label) + '</span><div class="ga"><svg viewBox="0 0 200 150" aria-hidden="true">' +
        '<path class="tr" d="M30 100A70 70 0 1 1 160.62 135" pathLength="100" />' +
        '<path class="fg" d="M30 100A70 70 0 1 1 160.62 135" pathLength="100" style="--to:' + (100 - o.val) + '" /></svg>' +
        '<div class="gv">' + cnt(o.val, '', '%', ms) + '</div></div><span class="nt">' + esc(o.note) + '</span></div>';
    },
    bars: function (o) {
      var max = 210, min = -70, span = max - min;
      var grid = [210, 140, 70, 0, -70].map(function (g) { return '<i style="--gy:' + ((max - g) / span * 100) + '%"><em>' + g + '</em></i>'; }).join('');
      var bars = o.v.map(function (v, k) {
        return '<span class="' + (v < 0 ? 'ng' : 'ps') + '" style="--h:' + (Math.abs(v) / span * 100) + '%;--bd:' + (0.3 + k * 0.045).toFixed(3) + 's"></span>';
      }).join('');
      var days = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28].map(function (d) { return '<em>' + d + '</em>'; }).join('');
      return '<div class="wc bars"><div class="hd"><b>' + esc(o.title) + '</b><span>' + esc(o.month) + '</span></div>' +
        '<div class="pl" style="--z0:' + (max / span * 100) + '%">' + grid + '<div class="bs">' + bars + '</div></div><div class="xs">' + days + '</div></div>';
    }
  };
  function widgetTile(x, style) {
    return '<figure class="tile wg anim" style="' + style + '" role="img" aria-label="' + esc(x.alt) + '">' + x.items.map(function (o, k) {
      var ms = 350 + k * 160;
      return '<div class="wi in from-' + (o.from || 'b') + '" aria-hidden="true" style="--x:' + o.x + ';' + (o.b ? 'top:auto;bottom:' + o.b : '--y:' + o.y) + ';--sw:' + o.sw + ';--z:' + (o.z || 1) + ';--d:' + (k * 0.16) + 's"><div class="mv">' + WIDGET[o.w](o, ms) + '</div></div>';
    }).join('') + '</figure>';
  }

  function render(c, idx) {
    var nextIdx = (idx + 1) % CASES.length;
    var list = c.cols.concat([{ w: 0.56, tiles: [{ t: 'cta', next: nextIdx }] }]);
    track.innerHTML = list.map(function (col) {
      return '<div class="col" style="--w:' + col.w + '">' + col.tiles.map(tileHTML).join('') + '</div>';
    }).join('') + '<div class="col-end" aria-hidden="true"></div>';
    cols = Array.prototype.slice.call(track.querySelectorAll('.col'));
    track.scrollLeft = 0; body.scrollTop = 0;

    $('#cs-title').innerHTML = c.title;
    $('#cs-summary').textContent = c.summary;
    $('#cs-count').textContent = 'Case ' + (idx + 1) + ' of ' + CASES.length;
    var pc = CASES[(idx - 1 + CASES.length) % CASES.length], nc = CASES[nextIdx];
    btnPrevCase.querySelector('.lbl').innerHTML = '<b>' + esc(pc.name) + '</b>';
    btnNextCase.querySelector('.lbl').innerHTML = '<b>' + esc(nc.name) + '</b>';
    btnPrevCase.setAttribute('aria-label', 'Previous case: ' + pc.name);
    btnNextCase.setAttribute('aria-label', 'Next case: ' + nc.name);
    track.setAttribute('aria-label', c.name + ' case study gallery');
    update();
    motionStart();
  }

  // ---------- motion: only while the tile is visible and the popup is open ----------
  var io = null;
  function countUp(el) {
    var end = parseFloat(el.getAttribute('data-count')), pre = el.getAttribute('data-pre') || '', suf = el.getAttribute('data-suffix') || '';
    var sep = el.getAttribute('data-sep') === '1', d = dec(end), wait = +(el.getAttribute('data-delay') || 0), t0 = 0, dur = 1400;
    var show = function (v) { el.textContent = pre + fmt(v, d, sep) + suf; };
    function f(t) { if (!t0) t0 = t; var k = Math.min(1, (t - t0) / dur); k = 1 - Math.pow(1 - k, 3);
      show(end * k); if (k < 1 && !root.hidden) requestAnimationFrame(f); else show(end); }
    show(0);
    setTimeout(function () { requestAnimationFrame(f); }, wait);
  }
  function motionStop() {
    if (io) { io.disconnect(); io = null; }
    Array.prototype.forEach.call(track.querySelectorAll('.tile.on'), function (t) { t.classList.remove('on'); });
  }
  function motionStart() {
    motionStop();
    var tiles = track.querySelectorAll('.tile.anim');
    if (reduce.matches || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(tiles, function (t) { t.classList.add('played'); });
      return;
    }
    Array.prototype.forEach.call(tiles, function (t) { t.classList.add('armed'); });
    io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var t = e.target;
        if (e.isIntersecting && !root.hidden) {
          t.classList.add('on');
          if (!t.classList.contains('played')) {
            t.classList.add('played');
            Array.prototype.forEach.call(t.querySelectorAll('[data-count]'), countUp);
          }
        } else t.classList.remove('on');
      });
    }, { threshold: 0.35 });
    Array.prototype.forEach.call(tiles, function (t) { io.observe(t); });
  }

  // ---------- progress ----------
  function isVertical() { return mqMobile.matches; }
  function update() {
    if (isVertical()) return;
    var maxH = track.scrollWidth - track.clientWidth;
    btnPrev.disabled = track.scrollLeft <= 2;
    btnNext.disabled = track.scrollLeft >= maxH - 2;
  }
  var raf = 0;
  var onScroll = function () { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
  track.addEventListener('scroll', onScroll, { passive: true });
  body.addEventListener('scroll', onScroll, { passive: true });

  function colLeft(el) { return el.offsetLeft - track.offsetLeft - 24; }
  function goCol(i) {
    i = Math.max(0, Math.min(cols.length - 1, i));
    track.scrollTo({ left: Math.max(0, colLeft(cols[i])), behavior: reduce.matches ? 'auto' : 'smooth' });
  }
  function step(dir) {
    // Forward: the first column that is not fully visible. Back: the column that sits about one view earlier.
    var left = track.scrollLeft, w = track.clientWidth, i;
    if (dir > 0) {
      for (i = 0; i < cols.length; i++) if (colLeft(cols[i]) + cols[i].offsetWidth > left + w + 2) break;
      goCol(i);
    } else {
      var target = left - w * 0.85;
      for (i = 0; i < cols.length; i++) if (colLeft(cols[i]) >= target - 2) break;
      goCol(Math.min(i, cols.length - 1));
    }
  }
  btnPrev.addEventListener('click', function () { step(-1); });
  btnNext.addEventListener('click', function () { step(1); });

  // ---------- wheel: vertical wheel drives horizontal scroll (desktop) ----------
  track.addEventListener('wheel', function (e) {
    if (isVertical() || e.ctrlKey) return;
    var dx = e.deltaX, dy = e.deltaY;
    if (Math.abs(dy) > Math.abs(dx)) {
      e.preventDefault();
      var mult = e.deltaMode === 1 ? 32 : e.deltaMode === 2 ? track.clientWidth : 1;
      track.scrollLeft += dy * mult;
    } // horizontal trackpad swipes and shift+wheel arrive as deltaX and scroll natively
  }, { passive: false });
  // The strip under the gallery forwards wheel too, so the whole popup feels like one horizontal surface.
  $('#cs-strip').addEventListener('wheel', function (e) {
    if (isVertical() || e.ctrlKey || Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    e.preventDefault(); track.scrollLeft += e.deltaY;
  }, { passive: false });

  // ---------- drag to scroll (mouse / pen; touch uses native swipe) ----------
  var drag = null;
  track.addEventListener('pointerdown', function (e) {
    if (isVertical() || e.pointerType === 'touch' || e.button !== 0) return;
    if (e.target.closest('a,button')) return;
    drag = { x: e.clientX, left: track.scrollLeft, moved: false, v: 0, lastX: e.clientX, lastT: performance.now() };
  });
  window.addEventListener('pointermove', function (e) {
    if (!drag) return;
    var dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) > 4) { drag.moved = true; track.classList.add('is-dragging'); }
    if (drag.moved) {
      track.scrollLeft = drag.left - dx;
      var now = performance.now();
      drag.v = (e.clientX - drag.lastX) / Math.max(1, now - drag.lastT);
      drag.lastX = e.clientX; drag.lastT = now;
    }
  });
  window.addEventListener('pointerup', function () {
    if (!drag) return;
    var d = drag; drag = null;
    if (!d.moved) return;
    setTimeout(function () { track.classList.remove('is-dragging'); }, 0);
    if (!reduce.matches && Math.abs(d.v) > 0.2) {
      track.scrollTo({ left: track.scrollLeft - Math.max(-480, Math.min(480, d.v * 320)), behavior: 'smooth' });
    }
  });

  // ---------- keyboard + focus trap ----------
  root.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key === 'Tab') { trap(e); return; }
    if (isVertical()) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); step(1); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); step(-1); }
    else if (e.key === 'Home') { e.preventDefault(); goCol(0); }
    else if (e.key === 'End') { e.preventDefault(); goCol(cols.length - 1); }
  });
  function focusables() {
    return Array.prototype.filter.call(dialog.querySelectorAll('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])'),
      function (el) { return el.offsetParent !== null || el === track; });
  }
  function trap(e) {
    var f = focusables(); if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === dialog)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  track.addEventListener('focusin', function (e) {
    var c = e.target.closest('.col'); if (!c || isVertical()) return;
    var l = colLeft(c);
    if (l < track.scrollLeft || l + c.offsetWidth > track.scrollLeft + track.clientWidth) goCol(cols.indexOf(c));
  });

  // ---------- open / close / switch ----------
  var scrollY = 0;
  function lockPage() {
    // Live site: Lenis is stopped while the popup is open and the popup carries data-lenis-prevent,
    // so Lenis never intercepts wheel or touch inside it. Native overflow lock is the fallback.
    if (window.lenis && window.lenis.stop) window.lenis.stop();
    scrollY = window.scrollY;
    var sbw = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.paddingRight = sbw + 'px';
    inerted = Array.prototype.filter.call(document.body.children, function (el) { return el !== root && el.tagName !== 'SCRIPT' && !el.hasAttribute('inert'); });
    inerted.forEach(function (el) { el.setAttribute('inert', ''); el.setAttribute('aria-hidden', 'true'); });
  }
  function unlockPage() {
    document.documentElement.style.overflow = '';
    document.body.style.paddingRight = '';
    inerted.forEach(function (el) { el.removeAttribute('inert'); el.removeAttribute('aria-hidden'); }); inerted = [];
    window.scrollTo(0, scrollY);
    if (window.lenis && window.lenis.start) window.lenis.start();
  }
  function indexOfId(id) { for (var i = 0; i < CASES.length; i++) if (CASES[i].id === id) return i; return 0; }

  function open(idx, trigger) {
    lastTrigger = trigger || document.activeElement;
    current = idx;
    root.hidden = false;             // unhide first so scroll reset and measurements apply
    render(CASES[idx], idx);
    lockPage();
    requestAnimationFrame(function () { root.classList.add('is-open'); dialog.focus({ preventScroll: true }); });
    history.replaceState(null, '', '#case-' + CASES[idx].id);
  }
  function close() {
    if (root.hidden) return;
    root.classList.remove('is-open');
    motionStop();
    var done = function () { root.hidden = true; unlockPage(); if (lastTrigger && lastTrigger.focus) lastTrigger.focus({ preventScroll: true }); };
    if (reduce.matches) done(); else setTimeout(done, 300);
    history.replaceState(null, '', location.pathname + location.search);
  }
  function switchCase(idx) {
    idx = (idx + CASES.length) % CASES.length;
    if (idx === current) return;
    current = idx;
    track.classList.add('is-swapping');
    setTimeout(function () {
      render(CASES[idx], idx);
      track.classList.remove('is-swapping');
      var h = $('#cs-title'); h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true });
      history.replaceState(null, '', '#case-' + CASES[idx].id);
    }, reduce.matches ? 0 : 220);
  }
  btnPrevCase.addEventListener('click', function () { switchCase(current - 1); });
  btnNextCase.addEventListener('click', function () { switchCase(current + 1); });
  root.addEventListener('click', function (e) {
    if (e.target.closest('[data-close]')) { close(); return; }
    var g = e.target.closest('[data-goto-case]');
    if (g) { switchCase(+g.getAttribute('data-goto-case')); return; }
  });

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-open-case]');
    if (!t || root.contains(t)) return;
    e.preventDefault();
    open(indexOfId(t.getAttribute('data-open-case')), t);
  });
  // Webflow triggers are divs or href="#" links: make them keyboard buttons
  Array.prototype.forEach.call(document.querySelectorAll('[data-open-case]'), function (t) {
    if (t.tagName === 'BUTTON') return;
    if (t.tagName !== 'A') { t.setAttribute('role', 'button'); t.setAttribute('tabindex', '0'); }
    t.style.cursor = 'pointer';
    t.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); t.click(); } });
  });
  window.addEventListener('resize', function () { if (!root.hidden) update(); });

  var m = location.hash.match(/^#case-([\w-]+)/);
  if (m) open(indexOfId(m[1]));

  // hook for checks and for other scripts (open('inkt'))
  window.__cs = { open: function (id) { open(indexOfId(id)); }, goCol: goCol, close: close, cols: function () { return cols.length; } };
})();
