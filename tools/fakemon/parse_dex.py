"""Parse the Fakemon Dex PDF into structured JSON.

Colour semantics are defined by the PDF's own legend (page 1):
  #FFCB30 / #F7EB00 (yellow) -> guaranteed-learned moves & signature moves
  #2FEBD2 (cyan)             -> possible abilities of the evolution line
  #3396FF (blue)             -> ability of the Mega form
  #252525 (dark)             -> "Name>Types" species headers and prose
"""
import json, re, sys, unicodedata

COLOR_KIND = {
    0xFFCB30: 'move', 0xF7EB00: 'move',
    0x2FEBD2: 'ability',
    0x3396FF: 'megaability',
    0x252525: 'text', 0x1F1F1F: 'text',
}

TYPE_DE = {
    'normal': 'Normal', 'feuer': 'Fire', 'wasser': 'Water', 'pflanze': 'Grass',
    'elektro': 'Electric', 'eis': 'Ice', 'kampf': 'Fighting', 'gift': 'Poison',
    'boden': 'Ground', 'flug': 'Flying', 'psycho': 'Psychic', 'kafer': 'Bug',
    'käfer': 'Bug', 'stein': 'Rock', 'geist': 'Ghost', 'drache': 'Dragon',
    'unlicht': 'Dark', 'stahl': 'Steel', 'fee': 'Fairy',
    # English spellings also occur in the source
    'fire': 'Fire', 'water': 'Water', 'grass': 'Grass', 'electric': 'Electric',
    'ice': 'Ice', 'fighting': 'Fighting', 'poison': 'Poison', 'ground': 'Ground',
    'flying': 'Flying', 'psychic': 'Psychic', 'bug': 'Bug', 'rock': 'Rock',
    'ghost': 'Ghost', 'dragon': 'Dragon', 'dark': 'Dark', 'steel': 'Steel',
    'fairy': 'Fairy',
}


def load_spans(path):
    import pymupdf
    doc = pymupdf.open(path)
    spans = []
    for i, page in enumerate(doc):
        for b in page.get_text("dict")["blocks"]:
            if b["type"] != 0:
                continue
            for line in b["lines"]:
                for s in line["spans"]:
                    if not s["text"].strip():
                        continue
                    spans.append({"pg": i + 1, "color": s["color"], "text": s["text"]})
    return spans


def merge(spans):
    """Merge wrapped spans back into logical entries."""
    out = []
    cur = None
    for s in spans:
        kind = COLOR_KIND.get(s["color"], "text")
        t = s["text"]
        # A ">" at the start of a coloured run marks a new bullet; a "Name>Type"
        # line in the dark colour marks a new species header.
        new = t.lstrip().startswith('>') or (kind == 'text' and '>' in t and not t.lstrip().startswith('('))
        if cur is None or kind != cur["kind"] or new:
            cur = {"kind": kind, "pg": s["pg"], "text": t}
            out.append(cur)
        else:
            cur["text"] += t
    for e in out:
        e["text"] = ' '.join(e["text"].split())
    return out


def norm(s):
    return unicodedata.normalize('NFC', s).strip()


def parse_types(raw):
    types = []
    for w in raw.replace('/', ' ').split():
        w = re.sub(r'[^A-Za-zÄÖÜäöüß]', '', w)
        if not w:
            continue
        t = TYPE_DE.get(w.lower())
        if t and t not in types:
            types.append(t)
    return types


# Species header lines that the PDF's text layer glues together or leaves blank.
# Resolved by rendering the affected pages (15, 32, 45, 55) and reading them.
HEADER_FIXUPS = {
    'Elevoltörnchen>ElektroElerolltörnchen':
        ['Elevoltörnchen>Elektro', 'Elerolltörnchen SplitEvo3/1>Elektro'],
    'SplitEvo3/1>ElektroEleblitörnchen Split': [],
    'Evo3/2>Elektro': ['Eleblitörnchen SplitEvo3/2>Elektro'],
    'Shroofo SplitEvo1/2>Pflanze PsychoShroomogaar':
        ['Shroofo SplitEvo1/2>Pflanze Psycho'],
    'SplitEvo1/3>Pflanze Gift': ['Shroomogaar SplitEvo1/3>Pflanze Gift'],
    'Pilzogaar SplitEvo2/3>Pflanze Gift UnlichtPilzogaar-Mega':
        ['Pilzogaar SplitEvo2/3>Pflanze Gift Unlicht'],
    'SplitEvo2/3>Pflanze Gift Unlicht': ['Pilzogaar-Mega SplitEvo2/3>Pflanze Gift Unlicht'],
    # p45: the whole Tigitz line is a work-in-progress stub with no types given.
    'Tigitz-Kampf-Geist>Normal Kampf♂️/Normal Fee♀️': ['Tigitz>Normal Fighting'],
    ('Tigraith SplitEvo1/1>Tigraith SplitEvo1/1-neue FormTigraith SplitEvo1/1-neue '
     'Form2Tigraxe SplitEvo1/2Tigraxe SplitEvo1/2-neue FormTigraxe SplitEvo1/2-neue Form2'):
        ['Tigraith SplitEvo1/1>Normal Fighting', 'Tigraxe SplitEvo1/2>Normal Fairy'],
    'Metafly/Formen>Käfer+[Elektro,Fee,Feuer,Eis,Gift]': [
        'Metafly>Käfer Elektro', 'Metafly-Fairy>Käfer Fee', 'Metafly-Fire>Käfer Feuer',
        'Metafly-Ice>Käfer Eis', 'Metafly-Poison>Käfer Gift',
    ],
    'Slagmite 1>Drache Stein': ['Slagmite>Drache Stein'],
    'Orbital-Mega>Stein Psycho': ['Orbitail-Mega>Stein Psycho'],
}


def split_header(text):
    text = norm(text)
    if text in HEADER_FIXUPS:
        return HEADER_FIXUPS[text]
    return [text]


def parse_bullet(text):
    """'> Name(description)' -> (name, description)."""
    t = norm(text)
    t = t.lstrip('>').strip()
    m = re.match(r'^([^(]+?)\s*\((.*)\)\s*$', t, re.S)
    if m:
        return norm(m.group(1)), norm(m.group(2))
    m = re.match(r'^([^(]+?)\s*\(\s*$', t)
    if m:
        return norm(m.group(1)), ''
    return norm(t), ''


def main(pdf, out):
    entries = merge(load_spans(pdf))
    families = []
    fam = None
    started = False
    for e in entries:
        if e["pg"] <= 2:
            continue  # legend
        if e["kind"] == 'text':
            if '>' not in e["text"]:
                continue
            if fam is None or fam["_seen_effects"]:
                fam = {"species": [], "moves": [], "abilities": [], "megaAbilities": [],
                       "page": e["pg"], "_seen_effects": False}
                families.append(fam)
            for header in split_header(e["text"]):
                name, _, rawtypes = header.partition('>')
                name = norm(name)
                # strip evolution-stage annotations, keep them as metadata
                split = None
                m = re.search(r'SplitEvo(\d)/(\d)', name)
                if m:
                    split = [int(m.group(1)), int(m.group(2))]
                    name = norm(name[:m.start()])
                if not name:
                    continue
                fam["species"].append({
                    "name": name, "types": parse_types(rawtypes),
                    "rawTypes": norm(rawtypes), "splitEvo": split,
                })
            started = True
        else:
            if not started or fam is None:
                continue
            fam["_seen_effects"] = True
            name, desc = parse_bullet(e["text"])
            if not name:
                continue
            key = {"move": "moves", "ability": "abilities", "megaability": "megaAbilities"}[e["kind"]]
            fam[key].append({"name": name, "desc": desc, "page": e["pg"],
                             "crossRef": desc.strip() in ('...', '')})
    for f in families:
        del f["_seen_effects"]
    families = [f for f in families if f["species"]]
    json.dump(families, open(out, "w"), ensure_ascii=False, indent=1)
    ns = sum(len(f["species"]) for f in families)
    print(f"families={len(families)} species={ns} "
          f"moves={sum(len(f['moves']) for f in families)} "
          f"abilities={sum(len(f['abilities']) for f in families)} "
          f"megaAbilities={sum(len(f['megaAbilities']) for f in families)}")


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
