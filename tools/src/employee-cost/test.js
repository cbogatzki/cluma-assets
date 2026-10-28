/* Recomputes sample cases from the raw ledger files (not from the built data) and compares them
   with the published tool. Run: node tools/src/employee-cost/test.js (after build.py). */
'use strict';
var assert = require('assert');
var path = require('path');
var tool = require(path.join(__dirname, '../../employee-cost-calculator.js'));
var cache = require('./bls-cache.json').series;
var ecec = require('./ecec.json').groups;
var suta = require('./suta.json').states;
var K = require('./constants.json');

function sid(at, area, soc, d) { return 'OEU' + at + area + '000000' + soc + d; }
function g(group) {
  var s = ecec[group].series, h = function (k) { return s[k].usd_per_hour; };
  var base = h('wages and salaries') + h('paid leave');
  return { ins: h('insurance') / base, ret: h('retirement and savings') / base, sup: h('supplemental pay') / base, wc: h("workers' compensation") / base };
}
function ledger(S, group, state, bonuses) {
  var r = g(group), u = suta[state];
  var sup = bonuses ? S * r.sup : 0, pay = S + sup;
  var B = S * r.ins + S * r.ret + sup;
  var T = 0.062 * Math.min(pay, 184500) + 0.0145 * pay + 42 + u.avg_rate_taxable_pct / 100 * Math.min(pay, u.taxable_wage_base) + S * r.wc;
  return S + B + T;
}
function near(a, b, msg) { assert.ok(Math.abs(a - b) < 1, msg + ': ' + a.toFixed(2) + ' vs ' + b.toFixed(2)); }
var n = 0;
function test(name, fn) { fn(); n++; console.log('ok', name); }

test('software engineer, US, mid, SHRM median', function () {
  var S = cache[sid('N', '0000000', '151252', '13')];
  assert.strictEqual(S, 135980);
  var r = tool.calc({ role: 'software-engineer', area: 'US', level: 'mid' });
  near(r.employee, ledger(S, 'mp', 'US', false), 'employee');
  assert.strictEqual(r.hiring, K.hiring.median.nonexec);
  near(r.total, ledger(S, 'mp', 'US', false) + 1200, 'total');
  near(r.after, r.employee, 'every year after');
  assert.strictEqual(r.timeToFill, 44);
});

test('customer support, California, junior, with bonuses (sales and office group)', function () {
  var S = cache[sid('S', '0600000', '434051', '12')];
  var r = tool.calc({ role: 'customer-support', area: 'S06', level: 'junior', bonuses: true });
  assert.strictEqual(r.S, S);
  near(r.employee, ledger(S, 'so', '06', true), 'employee');
  near(r.taxes.suta, 0.0346 * 7000, 'California SUTA');
});

test('engineering manager, New York, lead, SHRM average, Social Security capped', function () {
  var S = cache[sid('S', '3600000', '113021', '15')];
  assert.ok(S > 184500);
  var r = tool.calc({ role: 'engineering-manager', area: 'S36', level: 'lead', shrmHigh: true });
  near(r.taxes.social_security, 0.062 * 184500, 'Social Security cap');
  assert.strictEqual(r.hiring, 35879);
  assert.strictEqual(r.hiringMode, 'average');
  near(r.total, ledger(S, 'mp', '36', false) + 35879, 'total');
});

test('graphic designer, San Francisco metro, senior, itemized hiring', function () {
  var S = cache[sid('M', '0041860', '271024', '14')];
  var hrS = cache[sid('M', '0041860', '131071', '13')];
  var hr = ledger(hrS, 'mp', '06', false) / 2080;
  var role = ledger(cache[sid('M', '0041860', '271024', '13')], 'mp', '06', false) / 2080;
  var r = tool.calc({ role: 'graphic-designer', area: 'M41860', level: 'senior', lines: {
    hr: { hours: 10 }, iv: { people: 3, hours: 1.5 }, agency: { pct: 20 }, equip: { amount: '2,000' }, mgr: { hours: 4, rate: 100 }
  } });
  near(r.employee, ledger(S, 'mp', '06', false), 'employee uses California SUTA');
  assert.strictEqual(r.hiringMode, 'itemized');
  near(r.hiring, 10 * hr + 3 * 1.5 * role + 0.2 * S + 2000 + 4 * 100, 'itemized hiring process');
  near(r.total, r.employee + r.hiring, 'total');
});

test('suppressed estimates fall back metro to state to US, and no line filled keeps SHRM', function () {
  // BLS publishes no median for web and digital interface designers in the Riverside metro: California is used
  var r = tool.calc({ role: 'ux-designer', area: 'M40140', level: 'mid' });
  assert.strictEqual(r.area, 'M40140');
  assert.strictEqual(r.wageFrom, 'S06');
  assert.strictEqual(r.S, cache[sid('S', '0600000', '151255', '13')]);
  // none for software developers in Alaska: the US figure is used
  r = tool.calc({ role: 'software-engineer', area: 'S02', level: 'mid' });
  assert.strictEqual(r.area, 'S02');
  assert.strictEqual(r.wageFrom, 'US');
  assert.strictEqual(r.S, cache[sid('N', '0000000', '151252', '13')]);
  // an area that is not in the data at all also lands on the US
  r = tool.calc({ role: 'accountant', area: 'S99', level: 'mid', lines: { ads: { amount: '' }, hr: { rate: 50 } } });
  assert.strictEqual(r.area, 'US');
  assert.strictEqual(r.S, cache[sid('N', '0000000', '132011', '13')]);
  assert.strictEqual(r.hiringMode, 'median');
});

test('overrides: salary, benefits in dollars and percent, one benefits total', function () {
  var base = tool.calc({ role: 'software-engineer', area: 'US', level: 'mid' });
  var r = tool.calc({ role: 'software-engineer', area: 'US', level: 'mid', overrides: { salary: '150,000' } });
  assert.strictEqual(r.S, 150000);
  near(r.employee, ledger(150000, 'mp', 'US', false), 'employee on my salary');
  assert.ok(r.mine.salary && !r.mine.insurance);
  assert.strictEqual(r.defaults.S, base.S);
  r = tool.calc({ role: 'software-engineer', area: 'US', level: 'mid', overrides: { benUnit: 'usd', insurance: '12000', retirement: '' } });
  assert.strictEqual(r.benefits.insurance, 12000);
  near(r.benefits.retirement, base.benefits.retirement, 'empty field keeps the default');
  r = tool.calc({ role: 'software-engineer', area: 'US', level: 'mid', overrides: { benUnit: 'pct', retirement: '5' } });
  near(r.benefits.retirement, 0.05 * base.S, 'retirement as % of salary');
  r = tool.calc({ role: 'software-engineer', area: 'US', level: 'mid', overrides: { benUnit: 'usd', benefitsTotal: '20000' } });
  near(r.benefits.insurance + r.benefits.retirement, 20000, 'one total');
  near(r.benefits.insurance / r.benefits.retirement, base.benefits.insurance / base.benefits.retirement, 'total split like the defaults');
  r = tool.calc({ role: 'software-engineer', area: 'US', level: 'mid', bonuses: true, overrides: { bonus: '10000' } });
  assert.strictEqual(r.benefits.bonuses, 10000);
  near(r.taxes.medicare, 0.0145 * (base.S + 10000), 'bonus is taxed');
});

test('overrides: payroll tax rates and bases, SUTA and workers comp', function () {
  var base = tool.calc({ role: 'customer-support', area: 'S06', level: 'mid' });
  assert.strictEqual(base.defaults.assumptions.suta_base, 7000);
  var r = tool.calc({ role: 'customer-support', area: 'S06', level: 'mid', overrides: { suta_rate: '5.4', wc_rate: '1', ss_base: '50000', futa_rate: '0' } });
  near(r.taxes.suta, 0.054 * 7000, 'my SUTA rate');
  near(r.taxes.workers_comp, 0.01 * r.S, 'my workers comp rate');
  near(r.taxes.social_security, 0.062 * Math.min(r.S, 50000), 'my Social Security cap');
  assert.strictEqual(r.taxes.futa, 0);
  near(r.taxes.medicare, base.taxes.medicare, 'untouched Medicare');
  assert.ok(r.mine.suta_rate && r.mine.wc_rate && r.mine.ss_base && r.mine.futa_rate && !r.mine.medicare_rate);
  near(r.employee - base.employee, (r.T - base.T), 'only taxes moved');
});

test('overrides: hiring mode, own lines, time to fill and ramp-up', function () {
  var opt = { role: 'graphic-designer', area: 'US', level: 'mid' };
  var lines = { ads: { amount: '500' } };
  var r = tool.calc(Object.assign({ hiring: 'average', lines: lines }, opt));
  assert.strictEqual(r.hiringMode, 'average');
  assert.strictEqual(r.hiring, K.hiring.average.nonexec);
  r = tool.calc(Object.assign({ hiring: 'median', lines: lines }, opt));
  assert.strictEqual(r.hiring, K.hiring.median.nonexec, 'lines do not count unless own costs are chosen');
  r = tool.calc(Object.assign({ hiring: 'own', lines: lines }, opt));
  assert.strictEqual(r.hiringMode, 'itemized');
  assert.strictEqual(r.hiring, 500);
  r = tool.calc(Object.assign({ hiring: 'own', lines: {} }, opt));
  assert.strictEqual(r.hiring, 0, 'own costs with nothing filled');
  r = tool.calc(Object.assign({ overrides: { rampWeeks: '8' } }, opt));
  assert.strictEqual(r.ramp, 0, 'ramp needs both fields');
  r = tool.calc(Object.assign({ overrides: { rampWeeks: '8', rampPct: '50', timeToFill: '60' } }, opt));
  near(r.ramp, r.S / 52 * 8 * 0.5, 'ramp-up');
  near(r.total, r.employee + r.hiring + r.ramp, 'total includes ramp');
  near(r.after, r.employee, 'ramp is first year only');
  assert.strictEqual(r.timeToFill, 60);
  assert.ok(r.mine.timeToFill);
});

test('the tool names Cluma only in the offer card, and has no em dashes or stock phrases', function () {
  var src = require('fs').readFileSync(path.join(__dirname, '../../employee-cost-calculator.js'), 'utf8');
  // the offer card is the one place that may name the company; everything else stays neutral
  var parts = src.split(/\/\* offer-copy:(?:start|end) \*\//);
  assert.strictEqual(parts.length, 3, 'offer copy is fenced');
  assert.ok(/Cluma/.test(parts[1]), 'the offer card names Cluma');
  assert.ok(!/cluma/i.test((parts[0] + parts[2]).replace(/ClumaTools|_colors---|cluma\.design's stylesheet/g, '')), 'no Cluma outside the offer card');
  assert.ok(!/—/.test(src), 'no em dashes');
  assert.ok(!/\bquick\b|happy to|15 minutes|off your plate|no strings/i.test(parts[1]), 'no stock phrases in the offer copy');
});
console.log(n + ' tests passed');
