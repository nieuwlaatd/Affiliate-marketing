"""Weekly catalog-sync differ v2. Reads vendor-snapshot.json + db-catalog.json,
writes diff.json.

Improvements over v1:
- Accessory filter matches title AND handle for a long list of parts words.
- Score treats EXACT handle equality separately (1.0); substring gets modest bonus.
- Assignment is greedy 1:1: sort all (db, vendor) score pairs desc; each side used
  at most once. Base `l20` cannot pair with `l20-boost` if base `engwe-l20` claims it.
- Bundle listings ("Combo") are filtered so a base row can't be matched to a bundle price.
- Discontinued: only proposed here; deciding whether to auto-apply happens against the log.
"""
import json, re, difflib
from pathlib import Path

ROOT = Path(__file__).resolve().parent
VENDOR_PATH = ROOT / 'vendor-snapshot.json'
DB_PATH = ROOT / 'db-catalog.json'
DIFF_PATH = ROOT / 'diff.json'

TITLE_REJECT = re.compile(
    r'\b('
    r'combo|bundle|charger|helmet|goggles|gloves|kit|rack|trailer|wagon|utility vehicle|'
    r'e-?scooter|electric scooter|kids|trike|tricycle|gift card|pre[- ]owned|ship to \w+|'
    r'add[- ]?on|rain cover|controller|throttle|freewheel|flywheel|brake pad|brake lever|'
    r'brake disc|saddle|seatpost|seat tube|headlight|taillight|tail light|light strip|'
    r'fender|mudguard|hubcap|mirror|handlebar|grip|kickstand|holder|frame only|motor only|'
    r'extra battery|spare battery|removable battery|replacement battery|main battery|'
    r'secondary battery|third battery|extended warranty|surcharge|protection|part[s]?\b|'
    r'accessory|thermos|tail bag|travel bag|tank bag|storage|foot peg|foot plate|'
    r'lampshade|pas sensor|remote|conversion|carbon fiber|armor|lock|anti-theft|windscreen|'
    r'crankset|crank arm|light and horn|light & horn|hand and leg|control box|turn signal|'
    r'charging station|wheel set|stem|repair kit|tyre|tire cover|wheel cover|c(?:up|age)|'
    r'water bottle|air pump|bike pump|carbon|cable|surround|connection|passenger seat|'
    r'integrated seat|longer seat|normal seat|flowing turn|combo helmet|led headlight|'
    r'fixed foot|dorado plus|battery for|for flash|for meta|for defender|for hs|for cargo'
    r')\b',
    re.I,
)
# Reject if handle ends with an accessory suffix or contains obvious accessory phrases.
HANDLE_SUFFIX_REJECT = re.compile(
    r'-(battery|charger|kit|combo|bundle|cover|lock|mirror|controller|throttle|freewheel|'
    r'flywheel|mount|holder|brake|saddle|basket|headlight|taillight|tail-light|fender|'
    r'mudguard|hubcap|handlebar|grip|kickstand|part|parts|tyre|pedals|crankset|fork|stem|'
    r'rack|trailer|wagon|scooter|e-scooter|electric-scooter|goggles|helmet|gloves|add-on|'
    r'pack|motor|armor|bag|cup|cage|bottle|pump|goggles|gift-card|surcharge|shipping|'
    r'protection|spokes|surround|pedals-crankset|foot-peg|foot-plate|lampshade|pas-sensor|'
    r'remote|conversion|windscreen|control-box|turn-signal|charging-station|wheel-set|'
    r'reflective-tire|tire-cover)$',
    re.I,
)
HANDLE_CONTAINS_REJECT = re.compile(
    r'(battery-add-on|spare-battery|extra-battery|main-battery|secondary-battery|'
    r'replacement-battery|third-battery|-combo-|-bundle-|-battery-pack|-battery-lock|'
    r'ship-to-uk|ship-to-eu|ship-to-canada|pre-owned|gift-?card|extended-warranty|'
    r'utility-vehicle|foldable-e-bike-e-scooter|-scooter-|essential-accessory|abus-|'
    r'dyu-lithium|ekids-\d+|s500-|s1000-|new-trike|one-trike|t1-recumbent|'
    r'safety-charging|hailong-plus|reention-dorado|48v14ah|48v15ah|48v16ah|48v17ah|'
    r'52v14ah|52v16ah|52v17ah|52v21ah|-16ah-17ah|dyu-campx|hunter-x9-battery|'
    r'-secondary|-third-battery|48v-6a-8a|-thermos-|-tyre-|-headlight$|-taillight$)',
    re.I,
)
BIKE_POS_REGEX = re.compile(r'(e-?bike|electric bike|electric bicycle|motorcycle|moped|mtb|ebicycle|bicycle|bike)', re.I)

def to_price(v):
    try:
        return float(v)
    except Exception:
        return None

def norm(s):
    return re.sub(r'[^a-z0-9]+', ' ', (s or '').lower()).strip()

def norm_alpha_digits(s):
    return re.sub(r'[^a-z0-9]+', '', (s or '').lower())

def tokens(s):
    n = norm(s)
    stop = {
        'electric','bike','ebike','bicycle','ebikes','the','and','with','for','pro',
        'plus','max','lite','mini','fat','tire','tires','folding','all','terrain',
        'urban','city','mountain','commuter','fast','powerful','high','v','w','ah','wh',
        'mph','black','white','red','green','blue','silver','grey','gray','antelope',
        'foldable','custom','ships','ship','uk','eu','us','usa','free',
        'nm','torque','removable','battery','moped','style','retro','long','range',
        'boost','ii','iii','i','plate','plates',
    }
    return [t for t in n.split() if t and t not in stop]

def token_f1(a, b):
    ta, tb = set(tokens(a)), set(tokens(b))
    if not ta or not tb:
        return 0.0
    inter = ta & tb
    if not inter:
        return 0.0
    p = len(inter) / len(tb)
    r = len(inter) / len(ta)
    return 2*p*r / (p+r)

def seq_ratio(a, b):
    return difflib.SequenceMatcher(None, norm(a), norm(b)).ratio()


def is_accessory(product):
    handle = (product.get('handle') or '').lower()
    title = (product.get('title') or '').lower()
    if TITLE_REJECT.search(title):
        return True
    if HANDLE_SUFFIX_REJECT.search(handle):
        return True
    if HANDLE_CONTAINS_REJECT.search(handle):
        return True
    # Title ends with "Battery" / "Batteries" / "Battery Pack" / "Battery(Add-on)" etc.
    if re.search(r'\bbatter(?:y|ies)\b\s*(pack|add[- ]?on)?\s*[\)）]?\s*$', title):
        return True
    # Title starts with "Battery " (i.e. is a battery product) or "Batteries "
    if re.search(r'^\s*batter(?:y|ies)\b', title):
        return True
    return False


def price_gate_ok(vendor_price):
    # Bikes are >= $250 at this vendor pool (cheapest confirmed in DB is $429).
    return vendor_price is not None and vendor_price >= 250


def cheapest_variant_price(product):
    prices = []
    for v in product.get('variants', []) or []:
        p = to_price(v.get('price'))
        if p is not None and p > 0:
            prices.append(p)
    return min(prices) if prices else None


def score_pair(db_slug, db_model, v_handle, v_title):
    # exact handle equality (vendor to bare-brand-stripped db)?
    dh = norm_alpha_digits(db_slug)
    vh = norm_alpha_digits(v_handle)
    # strip any leading brand prefix in db_slug like 'engwe-'
    for bp in ('engwe', 'eunorau', 'walfisk', 'walfiske', 'duotts', 'samebike', 'dyu', 'vtuvia'):
        if dh.startswith(bp):
            dh_stripped = dh[len(bp):]
            break
    else:
        dh_stripped = dh
    if vh and dh_stripped and vh == dh_stripped:
        exact = 1.0
    elif vh and dh_stripped and (vh in dh_stripped or dh_stripped in vh) and abs(len(vh) - len(dh_stripped)) <= 4:
        exact = 0.9
    elif vh and dh_stripped and (vh in dh_stripped or dh_stripped in vh):
        exact = 0.75
    else:
        exact = 0.0

    t1 = token_f1(db_model, v_title)
    t2 = token_f1(db_slug, v_handle)
    sm = seq_ratio(db_slug, v_handle)
    blend = 0.5*max(t1,t2) + 0.5*sm
    return max(exact, blend)


def greedy_assign(db_rows, vendor_products):
    """1:1 greedy match. Returns list of (db_row, vendor_product|None, score)."""
    pairs = []
    for i, db in enumerate(db_rows):
        for j, p in enumerate(vendor_products):
            s = score_pair(db['slug'], db['model'], p['handle'], p['title'])
            pairs.append((s, i, j))
    pairs.sort(reverse=True)
    db_used = set()
    v_used = set()
    match_by_i = {}
    for s, i, j in pairs:
        if s < 0.55:
            break
        if i in db_used or j in v_used:
            continue
        db_used.add(i); v_used.add(j)
        match_by_i[i] = (j, s)
    out = []
    for i, db in enumerate(db_rows):
        if i in match_by_i:
            j, s = match_by_i[i]
            out.append((db, vendor_products[j], round(s, 3)))
        else:
            out.append((db, None, 0.0))
    return out, v_used


BRAND_MAP = {
    'ENGWE': ['ENGWE'],
    'Eunorau': ['Eunorau'],
    'Walfisk': ['Walfisk', 'Walfiske'],
    'DUOTTS': ['DUOTTS'],
    'SAMEBIKE': ['SAMEBIKE'],
    'DYU': ['DYU'],
    'VTUVIA': ['VTUVIA'],
}


def is_bundle(product):
    t = (product.get('title') or '').lower()
    return 'combo' in t or 'bundle' in t or ' + ' in t or ' & ' in t and ('combo' in t or 'bundle' in t)


def main():
    vendors = json.loads(VENDOR_PATH.read_text(encoding='utf-8'))
    db_rows = json.loads(DB_PATH.read_text(encoding='utf-8'))

    results = {}
    for vendor_name, products in vendors.items():
        db_here = [r for r in db_rows if r['brand'] in BRAND_MAP[vendor_name]]

        kept = []
        for p in products:
            if is_accessory(p):
                continue
            if is_bundle(p):
                continue
            price = cheapest_variant_price(p)
            if not price_gate_ok(price):
                continue
            p2 = dict(p)
            p2['_price'] = price
            kept.append(p2)

        matched, v_used = greedy_assign(db_here, kept)

        price_apply, price_defer = [], []
        discontinued_defer, returned_apply = [], []

        for db, v, s in matched:
            if v is None:
                if db['available'] is True:
                    discontinued_defer.append({'slug': db['slug'], 'model': db['model'], 'price': to_price(db['price']), 'reason': 'no vendor match'})
                continue
            v_price = v['_price']
            db_price = to_price(db['price'])
            delta_pct = abs(v_price - db_price) / db_price * 100 if db_price else 999
            if db['available'] is False:
                if s >= 0.85 and delta_pct <= 45:
                    returned_apply.append({'slug': db['slug'], 'model': db['model'], 'vendor_handle': v['handle'], 'vendor_title': v['title'], 'score': s, 'new_price': v_price, 'old_price': db_price})
                continue
            if db_price is not None and abs(v_price - db_price) >= 0.5:
                auto = (s >= 0.75 and delta_pct <= 35) or (s >= 0.85 and delta_pct <= 45)
                if 'et-7-1500w-3000w-rear-motor' in v['handle'] and 'et-7-3000w' in db['slug']:
                    auto = False
                entry = {'slug': db['slug'], 'model': db['model'], 'db_price': db_price, 'new_price': v_price, 'delta': round(v_price - db_price, 2), 'delta_pct': round(delta_pct, 1), 'vendor_handle': v['handle'], 'vendor_title': v['title'], 'score': s}
                if auto:
                    price_apply.append(entry)
                else:
                    price_defer.append(entry)

        new_candidates = []
        for j, p in enumerate(kept):
            if j in v_used:
                continue
            best = 0.0
            for db in db_here:
                s = score_pair(db['slug'], db['model'], p['handle'], p['title'])
                if s > best:
                    best = s
            new_candidates.append({'handle': p['handle'], 'title': p['title'], 'price': p['_price'], 'best_db_score': round(best, 2)})

        results[vendor_name] = {
            'vendor_kept': len(kept),
            'db_rows': len(db_here),
            'matches': [{'db_slug': db['slug'], 'db_model': db['model'], 'db_price': to_price(db['price']), 'vendor_handle': (v['handle'] if v else None), 'vendor_title': (v['title'] if v else None), 'vendor_price': (v['_price'] if v else None), 'score': s} for db, v, s in matched],
            'price_updates_apply': price_apply,
            'price_updates_defer': price_defer,
            'discontinued_defer': discontinued_defer,
            'returned_apply': returned_apply,
            'new_candidates': new_candidates,
        }

    DIFF_PATH.write_text(json.dumps(results, indent=2))
    for name, r in results.items():
        print(f"\n=== {name} ===")
        print(f"  vendor kept: {r['vendor_kept']}, DB rows: {r['db_rows']}")
        print(f"  price apply: {len(r['price_updates_apply'])}, price defer: {len(r['price_updates_defer'])}")
        print(f"  discontinued candidates: {len(r['discontinued_defer'])}")
        print(f"  returned apply: {len(r['returned_apply'])}")
        print(f"  new candidates (raw): {len(r['new_candidates'])}")

if __name__ == '__main__':
    main()
