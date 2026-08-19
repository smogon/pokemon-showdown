# battle-recreate

Recreates a real Pokémon Showdown battle's state at the *start* of turn N by
applying its battle log directly to a fresh `Battle` object — bypassing the
choice/RNG simulation engine entirely for turns `1..N-1` — then plays turn N
onward with real random legal choices, so the game genuinely diverges from
what actually happened.

## Why direct application, not re-simulation

A downloaded replay log only contains the *output* protocol stream
(`|move|`, `|-damage|`, `|switch|`, ...), not the *input* log (`>p1 move 1`)
and PRNG seed that would be needed to deterministically re-simulate the game
via the normal engine. Even if we had those, re-running the full simulation
introduces its own AI/RNG noise. Instead, this applies each log line as a
direct state mutation — the same category of primitive Pokémon Showdown's
own `/editbattle` debug command uses (see `sim/battle-stream.ts`
`editbattle()`): `Pokemon#sethp`, direct `boosts` arithmetic, `setStatus`,
`addVolatile`, `Side#addSideCondition`, `Field#setWeather`/`setTerrain`,
plus a hand-rolled minimal switch-in (position bookkeeping only, no
entry-hazard/onSwitchIn event pipeline, since those effects are already
present as their own log lines).

## Files

- `event-log.js` — parses/serializes an EventLog: `{ header, turns }`,
  where `turns[i]` holds turn `i+1`'s log lines (its own `|turn|` marker
  plus every result line up to the next marker). "State at the start of
  turn N" = `header` + `turns[0..N-2]` applied, i.e. everything strictly
  before `turns[N-1]`.
- `apply.js` — `LogApplier`, the direct-mutation dispatcher. Unhandled/rare
  commands are reported via `onUnhandled` rather than throwing, so odd log
  lines degrade gracefully instead of aborting the whole replay.
- `random-choice.js` — pure `request -> choice string` logic (ported from
  `sim/tools/random-player-ai.ts`), used to play turn N onward.
- `state-snapshot.js` — plain-JSON snapshot of visible battle state, used
  by the test harness to compare reconstructed vs. live state.
- `recreate.js` — the CLI script.
- `test-recreate.js` — end-to-end self-test (see below).

## Usage

```
node battle-recreate/recreate.js <format> <logFile> <turnN> <paste1> <paste2> \
  [--seed=a,b,c,d] [--max-turns=N] [--quiet]
```

- `format` — a format id, e.g. `gen9championsvgc2026regma`. "Champions
  M-B" doesn't exist yet in this fork (only `...regma` / Reg M-A is
  defined in `config/formats.ts`); add the regulation there once it
  exists, or pass an existing id for testing.
- `logFile` — a real battle log: either raw protocol text (one `|...`
  line per line, as downloaded from a replay) or a JSON replay object
  with a string `log` field.
- `turnN` — recreate state at the start of this turn.
- `paste1`, `paste2` — Pokepaste/Showdown-export text files for the two
  teams, **in the same order the teams were originally submitted in**
  (see "bring N, pick M" note below).

## Testing

`node battle-recreate/test-recreate.js` plays a full random Champions VGC
game live, captures its log plus a ground-truth state snapshot at each
turn boundary, then:

1. Feeds the captured log through `recreateAtTurn()` and asserts the
   reconstructed state at turn N exactly matches the live ground truth
   (HP is compared to the nearest percentage point, since a real replay
   log only ever shows spectators HP as a rounded percentage — see
   `sim/SIM-PROTOCOL.md`'s `-damage`/`switch` HP field — so bit-exact
   HP isn't recoverable from a real log in the first place).
2. Branches two independent continuations from turn N with different
   seeds and asserts they diverge in actions and/or final state.

Run it repeatedly (`for i in $(seq 1 20); do node battle-recreate/test-recreate.js; done`)
since each run plays a different random game exercising different move/
ability combinations. Set `DUMP_DIR=/some/path` to save the log, both
pokepastes, and the tested turn number on that run for offline debugging.

As of this writing, this passes on ~90%+ of random games, excluding the
one known gap below that dominates the remainder.

## Known limitations

- **`stall` (Protect/Detect/Endure success counter)**: never logged at all
  (see `data/conditions.ts` `stall` — no `battle.add()` call anywhere in
  its lifecycle). Not reconstructible from a log by any means; if turn N
  falls right after a Protect chain, the reconstructed Pokémon won't have
  the diminishing-returns counter applied. This is the most common
  remaining test failure by a wide margin.
- **Illusion (Zoroark/Zorua)**: not modeled. The disguised Pokémon's log
  entries report a fake identity until the `|replace|` reveal, which this
  tool doesn't currently distinguish from a real switch — expect
  misattributed roster state around any Illusion user.
- **`As One` (Calyrex-Ice/Shadow)**: the compound ability
  (Unnerve + Chilling Neigh/Grim Neigh) can be revealed under either its
  full id or a component ability's name; not normalized.
- **"Bring N, pick M" team preview** (VGC/BSS): a real replay log never
  mentions Pokémon that were picked but never sent out. Picked-but-unused
  teammates are inferred by taking every species actually seen in the log
  plus backfilling remaining slots from the *pokepaste's own order*
  (mirroring `Side#chooseTeam`'s own "too small, fill in the rest"
  fallback for an unspecified/default pick) — this is only correct if the
  provided pokepaste lists Pokémon in the same order they were
  originally submitted in.
- **`choicelock`** (Choice item move-lock) is inferred, not logged
  (same silence as `stall`): any active Pokémon holding a Choice item
  that has used a move since switching in is assumed locked into that
  move, except when the move was Trick/Switcheroo itself (using them to
  hand yourself the item doesn't lock you into repeating them).
- A handful of other conditions (e.g. `unburden`, triggered by
  `onAfterUseItem`/`onTakeItem` ability hooks rather than any `-start` log
  line at all) have no direct textual signal in the log either; only
  `stall` and `choicelock` currently have inference logic, so others in
  this category will simply be missing after reconstruction.
- Full protocol coverage is broad but not exhaustive — see the `default:`
  case in `apply.js`'s `LogApplier#apply` for anything reported via
  `onUnhandled` during a real run.
