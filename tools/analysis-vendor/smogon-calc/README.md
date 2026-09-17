# Vendored @smogon/calc

The damage calculator from https://github.com/smogon/damage-calc (the `calc/` package, MIT license; see `LICENSE`), vendored for the DigiPen analysis tool (`tools/analysis-calc.ts`).

- **Upstream commit:** `fc17f51822249b44c9f4ff36c03ba40d0541a6e9` (2026-09-17)
- **Why vendored instead of npm:** the npm release (0.11.0) lacks Champions mechanics and the Nightmare/Charge field flags. Vendoring also avoids editing the server's upstream `package.json`.
- **Why TypeScript source:** the server build (`node build`, esbuild) only compiles `.ts` files into `dist/`, so vendored source is compiled like any other file. It passes the server's `tsc` settings unchanged.

## What's included

Only the files reachable from `src/adaptable.ts`, the entry point that takes a caller-provided `Generation`:
- **Top level:** `adaptable`, `calc`, `desc`, `field`, `items`, `move`, `pokemon`, `result`, `stats`, `util`, `state`.
- **`mechanics/`:** all files.
- **`data/`:** `interface.ts`.

The calc's built-in data (`src/data/*` other than `interface.ts`), tests, and bundle scripts are left out. `tools/analysis-calc.ts` supplies data from the battle's own dex instead.

**The files are unmodified.** Don't edit them. Work around calc behavior in `tools/analysis-calc.ts`, so updates stay a plain copy. This folder is excluded from ESLint in `eslint.config.mjs`.

## Updating

```sh
git clone https://github.com/smogon/damage-calc /tmp/damage-calc
cd /tmp/damage-calc && git log -1 --format=%H        # note the commit
SRC=/tmp/damage-calc/calc/src
DEST=<path to>/pokemon-showdown/tools/analysis-vendor/smogon-calc
for f in adaptable calc desc field items move pokemon result stats util state; do cp $SRC/$f.ts $DEST/; done
cp $SRC/mechanics/*.ts $DEST/mechanics/
cp $SRC/data/interface.ts $DEST/data/
cp /tmp/damage-calc/calc/LICENSE $DEST/
```

Then:
1. **Check for new imports.** If a file now imports something not listed above, copy it too. `npx tsc` in `pokemon-showdown` reports missing modules.
2. **Update the commit hash** in this README.
3. **Run the checks:** `npx tsc`, `node build`, and the analysis browser tests (`pokemon-showdown-client/analysis.pokemonshowdown.com/test/`).
