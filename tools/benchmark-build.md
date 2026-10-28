# Build benchmarks

The build uses Rolldown's native Oxc pipeline for TypeScript, JSX, CommonJS, and
source maps. A persistent cache in `dist/.build-cache.json` skips unchanged,
previously validated builds and compiles only changed entries on rebuilds.

## Results

Measured on 2026-10-28 with Node 26.12.1 on an Apple M4 (10 logical CPUs), macOS
arm64. Baseline: esbuild master `1242c1e2d`.

| Build | esbuild median | Oxc + cache median | Change |
| --- | ---: | ---: | ---: |
| Unchanged | 814.0 ms | 67.1 ms | 12.1× faster |
| Edit `server/chat-commands/info.ts` | 806.4 ms | 305.9 ms | 2.6× faster |
| Clean | 867.0 ms | 972.1 ms | 105.1 ms slower |

Each mode uses two warmups and seven alternating measured rounds in separate
installed archive copies, without concurrent tests or benchmarks. Timings include
fresh Node startup, discovery, compilation, output writes, asset copying, and
validation when required. Source edits and removal of `dist` happen outside the
timer. Filesystem caches are warm; these are local measurements, not guarantees.

Clean builds pay for establishing input hashes and an output snapshot. The review
fixes changed medians by less than 1% against the preceding cache implementation:
906.7→910.9 ms clean, 67.8→68.1 ms unchanged, and 309.6→311.7 ms after an edit.
These differences are within the observed run-to-run variation.

## Compatibility

All imports stay external, tree shaking is disabled, and each source retains its
CommonJS module path. Content-based runtime helper names let changed entries
coexist with unchanged output. Obsolete helpers are removed only after successful
compilation, so a syntax error preserves the helpers used by the previous build.

Rolldown is pinned to **1.2.0** because a later release changed namespace imports
by adding a synthetic default export to named-only `__esModule` modules. See
[Rolldown PR #10453](https://github.com/rolldown/rolldown/pull/10453).

The cache checks inputs, build/compiler settings, and the output inventory;
failed builds cannot reuse a successful manifest. Symlinked output and tsconfig
extensions/references disable reuse. Builds assume one writer per checkout.
`node build --force` recompiles and revalidates; `node build --decl` also runs the
existing TypeScript declaration emitter.

## Reproduce

Prepare disposable baseline and candidate directories and run `npm ci` in each:

```sh
npm run benchmark-build -- /path/to/baseline /path/to/candidate --clean --json
npm run benchmark-build -- /path/to/baseline /path/to/candidate --json
npm run benchmark-build -- /path/to/baseline /path/to/candidate --edit=server/chat-commands/info.ts --json
```

`--clean` deletes `dist` before each build. `--edit` appends a distinct harmless
comment and restores the source bytes afterward, including after build failure;
compiled output can retain the comment until the next build. The flags cannot be
combined. `--runs=N` and `--warmups=N` change sample counts; both copies use the
same Node executable. `--json` saves every sample and the environment metadata.

## Validation

`npm run full-test` passes on Node 22.18.0 and Node 26.12.1: 2,752 passing,
76 pending, zero lint warnings, and npm-package type checks passing.
`npm run tsc` also passes. No new tests are included in this change.
