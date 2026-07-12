# Gen 9 Random Battle tensors

`battle-tensors.ts` encodes a `[Gen 9] Random Battle` decision from one side's
perspective. It returns four one-dimensional tensors:

- `continuous`: normalized numeric features such as HP, PP, boosts, and durations.
- `categorical`: stable integer tokens intended for embedding layers.
- `binary`: presence, visibility, knowledge, and boolean state flags.
- `actionMask`: legal policy actions in the order specified by the manifest.

The checked-in contract is `data/random-battles/gen9/tensor-manifest.json`. It
contains every tensor label in order, all categorical vocabularies, normalization
constants, supported formats, action labels, and a SHA-256 hash. Token `0` means
not applicable or absent. Token `1` means that a value exists but is unknown to
the observing player. Real vocabulary entries start at token `2`.

The encoder reads the public HP/details representation for the opponent and does
not expose hidden item, ability, Tera type, or moves in player mode. The binary
`*Known` and `move*.revealed` fields distinguish unknown values from known empty
values. `encodeOmniscientBattleState` is only for simulator diagnostics and
determinized search; it must not be used as a player's policy/value observation.

Player mode's direct `Battle` encoder is a privacy-safe snapshot. Inactive
opponent details that cannot be reconstructed safely from the live simulator
object are marked unknown, even if they were revealed earlier.

For a complete player information state, construct a
`Gen9RandomBattleObservationTracker` for `p1` or `p2` and pass it every chunk
from the matching stream returned by `getPlayerStreams`. `receive` returns an
observation when the chunk contains a new choice request; `encode` returns the
latest observation at any later point. The tracker only consumes public battle
messages and that player's private request, retaining revealed opponent facts
across switches without reading the simulator's hidden state. Its
`decodeAction` method maps a legal policy index back to a simulator command.

## Updating the schema

Build the simulator, update `SCHEMA_VERSION` in the generator, and regenerate the
manifest:

```sh
node build
node tools/generate-gen9-randombattle-tensor-manifest.js
```

Any change to a vocabulary, field order, normalization constant, or action label
changes `schemaHash`. Model checkpoints and replay data must store both
`schemaVersion` and `schemaHash` and reject mismatches.

The generator includes all current Random Battle set species and their formes,
all set moves and abilities, and all Gen 9/Past standard items. New Random Battle
set data intentionally fails the vocabulary coverage test until the manifest is
regenerated under a new schema version.
