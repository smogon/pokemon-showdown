# Generated randbats data

The `generated/` directory is the canonical server-owned source for
`gen3megascaprandombattle` tooltip data. It contains the same options and
statistics shapes published by [`pkmn/randbats`](https://github.com/pkmn/randbats):

- `generated/gen3megascaprandombattle.json` contains the union of possible options.
- `generated/stats/gen3megascaprandombattle.json` contains conditional frequencies
  observed while generating teams.

Regenerate both files from the compiled server and this format's merged
`RandomGen3MegasCAPTeams.randomSets`:

```sh
npm run generate-gen3megascap-randbats
```

The command deterministically samples 100,000 teams with the Showdown PRNG seed
`1,2,3,4`. Check that committed files are current without rewriting them:

```sh
npm run check-gen3megascap-randbats-data
```

The generator is adapted from the MIT-licensed `pkmn/randbats` update program.
Copyright (c) 2020-2024 pkmn contributors. The applicable license is preserved
at `tools/generate-gen3megascap-randbats.LICENSE`.
