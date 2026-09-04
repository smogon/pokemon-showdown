"""Parse the move sources.

Two sources describe the generic (non-signature) move pool:
  * the xlsx `Move_Database` sheet - 340 moves, fully structured (the authority)
  * the "Massive Erweiterung" PDF   - the same moves plus the Normal-type block,
    but only as loose text.
Per the user's conflict rules the more specific source wins, so the xlsx is used
wherever a move appears in both; the PDF only contributes moves the xlsx lacks.
"""
import json, re, sys
import openpyxl

XLSX_COLS = ['id', 'type', 'name', 'category', 'basePower', 'accuracy', 'effect',
             'statusChance', 'status', 'statChanges', 'priority', 'critRatio',
             'recoil', 'drain', 'multiHitMin', 'multiHitMax', 'trapping',
             'weightScaling', 'ignoreAccuracy', 'alwaysHits', 'conditionalPower',
             'duration']


def parse_xlsx(path):
    wb = openpyxl.load_workbook(path, data_only=True)
    ws = wb['Move_Database']
    rows = list(ws.iter_rows(min_row=2, values_only=True))
    out = []
    for r in rows:
        if r[2] is None:
            continue
        d = dict(zip(XLSX_COLS, r))
        for k in ('effect', 'status', 'statChanges', 'conditionalPower'):
            if d[k] in ('—', '-', ''):
                d[k] = None
        out.append(d)
    return out


TYPES = ['Normal', 'Fire', 'Water', 'Grass', 'Electric', 'Ice', 'Fighting', 'Poison',
         'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark',
         'Steel', 'Fairy']
CATS = ['Physical', 'Special', 'Status']
# Column x-origins of the move table in the "Massive Erweiterung" PDF.
PDF_COLS = [(81.0, 'num'), (147.8, 'type'), (214.5, 'name'), (281.2, 'category'),
            (348.0, 'basePower'), (414.8, 'accuracy'), (481.5, 'effect')]


def _col(x):
    best, bestd = None, 1e9
    for cx, key in PDF_COLS:
        d = abs(x - cx)
        if d < bestd:
            best, bestd = key, d
    return best if bestd < 30 else None


def parse_pdf(path):
    """Rebuild the table from span geometry: fixed column origins, rows delimited
    by each new entry in the '#' column. Fragments that do not end in a space are
    mid-word wraps and are joined without one."""
    import pymupdf
    doc = pymupdf.open(path)
    rows = []
    cur = None
    for page in doc:
        spans = []
        for b in page.get_text("dict")["blocks"]:
            if b["type"] != 0:
                continue
            for line in b["lines"]:
                for s in line["spans"]:
                    if s["text"].strip():
                        spans.append((round(s["bbox"][1], 1), s["bbox"][0], s["text"]))
        spans.sort(key=lambda s: (s[0], s[1]))
        for y, x, text in spans:
            key = _col(x)
            if key is None:
                continue
            if key == 'num' and re.match(r'^\s*\d+\s*$', text):
                cur = {k: [] for _, k in PDF_COLS}
                rows.append(cur)
            if cur is None:
                continue
            cur[key].append(text)

    def join(frags):
        out = ''
        for f in frags:
            if out and not out.endswith(' '):
                out += f          # mid-word wrap
            else:
                out += f
        return ' '.join(out.split())

    out = []
    for r in rows:
        name = join(r['name'])
        typ = join(r['type'])
        cat = join(r['category'])
        if not name or typ not in TYPES or cat not in CATS:
            continue
        power = join(r['basePower'])
        acc = join(r['accuracy'])
        out.append({
            'id': int(join(r['num'])), 'type': typ, 'name': name, 'category': cat,
            'basePower': int(power) if power.isdigit() else 0,
            'accuracy': int(acc) if acc.isdigit() else True,
            'effect': join(r['effect']).replace('\u2014', '').strip() or None,
        })
    return out


if __name__ == '__main__':
    xl = parse_xlsx(sys.argv[1])
    pdf = parse_pdf(sys.argv[2])
    json.dump({'xlsx': xl, 'pdf': pdf}, open(sys.argv[3], 'w'), ensure_ascii=False, indent=1)
    xn = {m['name'].lower() for m in xl}
    pn = {m['name'].lower() for m in pdf}
    print(f"xlsx={len(xl)} pdf={len(pdf)} shared={len(xn & pn)} pdf_only={len(pn - xn)} xlsx_only={len(xn - pn)}")
    from collections import Counter
    print('pdf types:', Counter(m['type'] for m in pdf))
    print('xlsx-only sample:', sorted(xn - pn)[:15])
