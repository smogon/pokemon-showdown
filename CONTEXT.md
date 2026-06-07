# Fork context

Domain vocabulary for **this fork's** customisations on top of `smogon/pokemon-showdown`.
Upstream source is never edited; everything below is additive. Use these terms in
architecture reviews and commit messages so the seam between our code and upstream
stays legible.

## Where our changes live

- **`config/formats.ts`** — the custom-format list. Our formats sit in the
  `surfnWOB Customs` and `Yak Attack` sections; each declares a `mod` that points
  at a directory under `data/mods/`.
- **`data/mods/<modid>/`** — a **mod**: `scripts.ts` (`inherit: '<parent>'`, `gen: N`)
  plus optional `formats-data.ts` (per-species `tier`) and other data tables. A mod
  inherits its parent's data and overrides selectively. A `formats-data.ts` entry
  *without* `inherit: true` **replaces** the parent species entry; *with* `inherit: true`
  it **merges** over it (see the merge loop in `sim/dex.ts`). A species the child
  doesn't list is inherited unchanged.
- **`test/sim/misc/fork-customs.js`** — the fork's test net (Candidate D): a broad
  ruleTable/mod-data smoke check across every custom format, plus targeted behavior
  tests that pin the engine seams our patches touch.

## Custom mods / concepts

- **gen3subzu** — the mod backing the `[Gen 3] SU` and `[Gen 3] IU` formats. It
  inherits `gen3` and reclassifies 17 mons out of upstream ZU into the fork's
  **sub-ZU tier ladder**: **SU** (*Sub-zero Used*, the tier below ADV ZU) and
  **IU** (*Incredibly Used*, below SU). Keeping the ladder in its own mod is the
  point — before, these tier flips lived in the shared `data/mods/gen3/` and leaked
  into stock Gen 3 formats. The SU/IU banlists ban by tier *tag*, so the tier data
  and the format banlist are coupled: a mon's ladder tier must live in the mod the
  format declares.

- **bonustypemod** — a ruleset (used by `[Gen 3] Tera`) that enables Gen-3
  Terastallization. The engine restricts Tera to Gen 9; the fork keeps a visible
  1-line gate in `sim/side.ts` (`chooseMove`) that also allows Tera when the
  ruleTable has `bonustypemod`. This is a **patch on an upstream seam**, re-applied
  on every rebuild-sync and guarded by the `gen3tera` behavior test — chosen over a
  297-line `Scripts.side` override that would silently drift from upstream.

- **PSS split** — `gen3pss` inherits gen4's per-move physical/special split;
  `gen4nopss` reassigns move category by *type* (the classic gen1–3 split). Pinned
  by the PSS behavior test.
