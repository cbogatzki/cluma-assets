"""Build tools/employee-cost-calculator.js from the source template and the pulled data.

Inputs (all in this folder): config.json, bls-cache.json (pull_bls.py), ecec.json (BLS ECEC via API),
suta.json (US DOL 2026 estimated rates), constants.json (SSA/IRS/SHRM figures with their sources).
The data is inlined so the published tool is one self-contained file.
"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
TOOLS = os.path.dirname(os.path.dirname(HERE))
load = lambda n: json.load(open(os.path.join(HERE, n)))

cfg, cache, ecec, suta, const = (load(n) for n in ("config.json", "bls-cache.json", "ecec.json", "suta.json", "constants.json"))
series = cache["series"]
PCT = [cfg["percentiles"][k] for k in ("junior", "mid", "senior", "lead")]


def sid(at, area, soc, d):
    return f"OEU{at}{area}000000{soc}{d}"


def area_values(at, area):
    out = {}
    role_socs = {r["soc"] for r in cfg["roles"]}
    for soc in sorted(role_socs | set(cfg["support_occupations"])):
        if soc in role_socs:
            vals = [series.get(sid(at, area, soc, d)) for d in PCT]
        else:
            vals = [None, series.get(sid(at, area, soc, "13")), None, None]
        if any(v is not None for v in vals):
            out[soc] = [int(v) if v is not None else None for v in vals]
    return out


USPS = {"01":"AL","02":"AK","04":"AZ","05":"AR","06":"CA","08":"CO","09":"CT","10":"DE","11":"DC","12":"FL","13":"GA","15":"HI","16":"ID","17":"IL","18":"IN","19":"IA","20":"KS","21":"KY","22":"LA","23":"ME","24":"MD","25":"MA","26":"MI","27":"MN","28":"MS","29":"MO","30":"MT","31":"NE","32":"NV","33":"NH","34":"NJ","35":"NM","36":"NY","37":"NC","38":"ND","39":"OH","40":"OK","41":"OR","42":"PA","44":"RI","45":"SC","46":"SD","47":"TN","48":"TX","49":"UT","50":"VT","51":"VA","53":"WA","54":"WV","55":"WI","56":"WY"}
areas, wages = {}, {}
areas["US"] = {"label": "United States (average)", "type": "us", "state": "US"}
wages["US"] = area_values("N", "0000000")
for fips, name in cfg["states"].items():
    w = area_values("S", f"{fips}00000")
    if w:
        areas["S" + fips] = {"label": name, "type": "state", "state": fips}
        wages["S" + fips] = w
for cbsa, m in cfg["metros"].items():
    w = area_values("M", f"00{cbsa}")
    if w:
        areas["M" + cbsa] = {"label": m["name"].split(",")[0] + ", " + USPS[m["state"]] + " metro", "type": "metro", "state": m["state"]}
        wages["M" + cbsa] = w


def ratios(g):
    s = {k: v["usd_per_hour"] for k, v in ecec["groups"][g]["series"].items()}
    base = s["wages and salaries"] + s["paid leave"]
    return {
        "insurance": round(s["insurance"] / base, 6),
        "retirement": round(s["retirement and savings"] / base, 6),
        "supplemental": round(s["supplemental pay"] / base, 6),
        "workers_comp": round(s["workers' compensation"] / base, 6),
        "period": ecec["groups"][g]["period"],
    }


data = {
    "version": const["version"],
    "wage_year": f"May {cache['meta']['year']}",
    "groups": {g: ratios(g) for g in ecec["groups"]},
    "taxes": const["taxes"],
    "suta": {k: {"base": v["taxable_wage_base"], "rate": round(v["avg_rate_taxable_pct"] / 100, 6)} for k, v in suta["states"].items()},
    "hiring": const["hiring"],
    "roles": [{k: r[k] for k in ("key", "label", "soc", "group", "tier", "manager")} for r in cfg["roles"]],
    "occupations": cfg["support_occupations"],
    "areas": areas,
    "wages": wages,
    "sources": const["sources"],
}

src = open(os.path.join(HERE, "calculator.src.js")).read()
out = src.replace("/*__DATA__*/null", json.dumps(data, separators=(",", ":")))
out = out.replace("__VERSION__", const["version"])
assert "__DATA__" not in out
dest = os.path.join(TOOLS, "employee-cost-calculator.js")
open(dest, "w").write(out)
missing = [(a, r["soc"]) for a in wages for r in cfg["roles"] if r["soc"] not in wages[a]]
print(f"wrote {dest}: {len(out)//1024} KB, {len(areas)} areas, {len(missing)} area-role gaps (fallback to state/US)")
