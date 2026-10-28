"""Pull OEWS wage estimates for the employee cost calculator from the official BLS API.

Usage: python3 pull_bls.py [--areas national|states|metros|all] [--key-file PATH]

Fills bls-cache.json (series id -> annual USD, or null when BLS publishes no estimate) and only
asks for series not cached yet, so a run that hits the daily limit resumes where it stopped.
Without a key BLS allows 25 queries a day of 25 series; with a free registration key, 500 queries
of 50 series. The key is read from the key file (a line BLS_API_KEY=...) and never printed.
"""
import argparse, json, os, sys, time, urllib.request
from datetime import datetime, timezone

HERE = os.path.dirname(os.path.abspath(__file__))
CFG = json.load(open(os.path.join(HERE, "config.json")))
CACHE_PATH = os.path.join(HERE, "bls-cache.json")
API = "https://api.bls.gov/publicAPI/v2/timeseries/data/"


def series_id(area_type, area, occ, datatype):
    return f"OEU{area_type}{area}000000{occ}{datatype}"


def areas(which, only=None):
    out = []
    if which in ("national", "all"):
        out.append(("N", "0000000"))
    if which in ("states", "all"):
        out += [("S", f"{fips}00000") for fips in CFG["states"]]
    if which in ("metros", "all"):
        out += [("M", f"00{cbsa}") for cbsa in CFG["metros"]]
    if only:
        out = [x for x in out if x[1] in only]
    return out


def wanted(which, only=None):
    pct = list(CFG["percentiles"].values())
    role_socs = {r["soc"] for r in CFG["roles"]}
    ids = []
    for at, area in areas(which, only):
        for soc in sorted(role_socs):
            ids += [series_id(at, area, soc, d) for d in pct]
        for soc in sorted(set(CFG["support_occupations"]) - role_socs):
            ids.append(series_id(at, area, soc, "13"))
    return ids


def read_key(path):
    if not path or not os.path.exists(path):
        return None
    for line in open(path):
        if line.startswith("BLS_API_KEY="):
            return line.split("=", 1)[1].strip().strip('"') or None
    return None


def fetch(batch, key):
    body = {"seriesid": batch, "latest": True}
    if key:
        body["registrationkey"] = key
    req = urllib.request.Request(API, data=json.dumps(body).encode(), headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.load(r)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--areas", default="national")
    ap.add_argument("--key-file")
    ap.add_argument("--max-queries", type=int, default=None)
    ap.add_argument("--only", help="comma-separated state FIPS or metro CBSA codes, to pull a few areas")
    a = ap.parse_args()
    key = read_key(a.key_file)
    size, limit = (50, 500) if key else (25, 25)
    limit = a.max_queries or limit
    cache = json.load(open(CACHE_PATH)) if os.path.exists(CACHE_PATH) else {"series": {}, "meta": {}}
    only = None
    if a.only:
        only = {f"{c}00000" if len(c) == 2 else f"00{c}" for c in a.only.split(",")}
    todo = [s for s in wanted(a.areas, only) if s not in cache["series"]]
    print(f"{len(todo)} series to fetch, {'registered' if key else 'unregistered'} limits", file=sys.stderr)
    queries = 0
    for i in range(0, len(todo), size):
        if queries >= limit:
            print("query limit reached; run again tomorrow or with a key", file=sys.stderr)
            break
        batch = todo[i:i + size]
        res = fetch(batch, key)
        queries += 1
        if res.get("status") != "REQUEST_SUCCEEDED":
            print("BLS:", res.get("status"), res.get("message"), file=sys.stderr)
            break
        got = {}
        for s in res["Results"]["series"]:
            val = None
            for d in s.get("data", []):
                if d.get("value") not in (None, "", "-", "*", "#"):
                    try:
                        val = float(d["value"])
                        cache["meta"].setdefault("year", d.get("year"))
                    except ValueError:
                        val = None
                    break
            got[s["seriesID"]] = val
        for s in batch:
            cache["series"][s] = got.get(s)
        cache["meta"]["fetched_at"] = datetime.now(timezone.utc).isoformat(timespec="seconds")
        json.dump(cache, open(CACHE_PATH, "w"), indent=0, sort_keys=True)
        time.sleep(1)
    n = sum(1 for v in cache["series"].values() if v is not None)
    print(f"cache: {len(cache['series'])} series, {n} with values, {queries} queries used", file=sys.stderr)


if __name__ == "__main__":
    main()
