# Fakemon assets

Placeholder images for the custom Pokémon system. Replace them with your own art
at any time — **no code changes are needed**.

## Where the paths come from

Every image path in the project comes from one file:
[`data/mods/fakemon/assets.ts`](../data/mods/fakemon/assets.ts).
Change `ASSET_ROOT` there to move everything (for example to a CDN).

## Folder layout

```
assets/
  placeholder.png        shown whenever a specific image is missing
  manifest.json          the expected path of every Pokémon, move, ability and stone
  pokemon/               full artwork / battle sprites   (hallowisp.png)
  pokemon-icons/         small teambuilder icons          (hallowisp.png)
  moves/                 signature move icons             (sugarcrush.png)
  abilities/             ability icons                    (grassstarter.png)
  items/                 item icons                       (sugarberry.png)
  mega/                  Mega Stone icons                 (hallowispite.png)
  ui/                    interface art (mega-icon.png …)
```

## Naming rule

A file is named after the entry's **ID**: lowercase, letters and digits only.

| Entry | File |
| --- | --- |
| `Hallowisp` | `assets/pokemon/hallowisp.png` |
| `Hallowisp-Mega` | `assets/pokemon/hallowispmega.png` |
| `Sugar Pile` | `assets/abilities/sugarpile.png` |
| `Hallowispite` | `assets/mega/hallowispite.png` |

`manifest.json` lists all 733 expected paths, so you can work through them
one by one. Drop a file in with the right name and it is picked up
automatically; anything still missing keeps using `placeholder.png`.

## Sizes

These are what the placeholders use — match them and nothing needs resizing:

* `pokemon/` — 96×96 (larger is fine, it scales down)
* `pokemon-icons/` — 40×30
* everything else — 32×32
