# Build compiler benchmark

The selected implementation uses Rolldown's native Oxc pipeline for TypeScript,
JSX, CommonJS output, and source maps. It removes esbuild and Babel. Running
Oxc separately before Rolldown would add a redundant parse and print pass.

## Results

Measured on 2026-10-28, Apple M4 (10 logical CPUs), macOS arm64, Node 26.12.1.
Baseline: master `1242c1e2d`, esbuild 0.25.0. Candidate: Rolldown 1.2.0.

| Build | esbuild median | Rolldown median | Time reduction |
| --- | ---: | ---: | ---: |
| Clean | 811.8 ms | 747.8 ms | 7.9% |
| Rebuild with existing output | 818.9 ms | 713.2 ms | 12.9% |

Each mode used two warmups and seven measured builds per compiler, alternating
execution order, with no other test or benchmark jobs running. Rolldown was
faster in all seven paired samples in each mode. Clean-build ranges were
775.8–867.1 ms for esbuild and 704.9–768.3 ms for Rolldown; rebuild ranges were
734.4–861.1 ms and 698.2–738.9 ms respectively. These are local measurements,
not a guarantee across platforms or Node versions.

Both copies came from the same master archive, with the candidate's build and
package files overlaid, and dependencies installed with `npm ci`. Archives
exclude `.git` traversal from both sides. Each measurement starts a fresh Node
process and runs plain `node build`, including source discovery, compilation,
writing JavaScript/source maps, asset copying, and loading text data. The clean
mode removes `dist` outside the timed interval. OS filesystem caches remain
warm after the warmups; this is not a cold-machine test. Both implementations
recompile all 524 TypeScript/TSX inputs on every invocation.

[Raw measurements and diagnostic profiles](benchmark-build-results.json)
include every sample and environment metadata. Revision fields inside archived
checkouts are null; the baseline revision is recorded at the top of the file.

## Alternatives evaluated

These experiments ran separately, each with its own alternating esbuild baseline.

| Candidate | Candidate clean median | Paired esbuild median | Samples |
| --- | ---: | ---: | ---: |
| oxc-transform 0.156.0 + Babel 7.29.7 | 16,219.1 ms | 945.9 ms | 7 |
| oxc-transform + SWC 1.16.20, synchronous | 3,706 ms | 914 ms | 3 |
| oxc-transform + SWC, four concurrent workers | 1,403 ms | 851 ms | 3 |

An instrumented Oxc/Babel build spent 521.9 ms in Oxc and 13,355.6 ms in Babel
(91% of transpilation), across 524 source files. Read/write operations and map
serialization together took 678.0 ms. The largest learnset data files dominated
Babel's second parsing, traversal, and printing pass. A separate diagnostic run
with Babel's source-map generation/composition disabled still spent 10,676.1 ms
in Babel. Removing maps therefore does not solve the main bottleneck; the final
implementation retains maps. These phase profiles are individual diagnostic
runs, separate from the repeated end-to-end benchmarks.

## Compatibility and version pin

Rolldown is pinned exactly to **1.2.0**. A later release intentionally changed
external namespace interoperability, adding a synthetic `default` export even
for named-only modules marked `__esModule`. That differs from this repository's
previous output and fails the compatibility fixture. See
[Rolldown PR #10453](https://github.com/rolldown/rolldown/pull/10453).
Any upgrade must preserve these tested behaviors; the version pin is intentional.

All source files remain explicit entry points, all imports remain external,
tree shaking is disabled, and module paths/exports remain available for runtime
`require()` and hotpatching. CommonJS output uses named exports, `__esModule`,
and strict mode. Rolldown writes its small runtime helper inside `dist`, so no
separate runtime dependency is needed.

The tests cover live exports and cycles, namespace/default/CommonJS interop,
strict execution, configured JSX factories, class-field assignment semantics,
asset copying, source-map stack traces, syntax errors, and CLI failure status.

[Oxc isolated declarations](https://oxc.rs/docs/guide/usage/transformer/isolated-declarations.html)
emit `.d.ts` files. They do not supply CommonJS JavaScript output and are not
part of the ordinary build measured here. Declaration generation remains with
the existing TypeScript commands.

## Validation

- Node 26.12.1 full Mocha suite, including slow tests: **2,761 passing, 76 pending**.
- Node 22.18.0 full suite: **2,756 passing, 76 pending, five failures**. Untouched
  esbuild master has the identical five translation-test failures (2,747 passing).
  The existing test/assert.js overrides Node's legacy assert.match, which breaks
  assert.strict.match on Node 22. This is independent of the compiler change.
- All nine new compiler/CLI compatibility tests pass on Node 22 and Node 26.
- Project and npm-package TypeScript checks pass. Changed JavaScript files pass
  lint with zero warnings; the repository-wide lint has existing warnings in
  unchanged tests.
- Clean npm installs succeed, package.json and package-lock.json agree, and
  existing unrelated dependency versions are unchanged.

## Reproduce

Prepare two disposable directories, one from the baseline commit and one from
this branch, and run `npm ci` in each. Then run:

```sh
npm run benchmark-build -- /path/to/baseline /path/to/candidate --clean --json
npm run benchmark-build -- /path/to/baseline /path/to/candidate --json
```

`--clean` deletes each directory's `dist` before every build. Do not use it for
outputs you need to keep. Optional `--runs=N` and `--warmups=N` change the sample
counts. The same Node executable is used for both candidates. Avoid `--force`:
the existing build script also invokes declaration emission for that flag,
which would measure additional work.
