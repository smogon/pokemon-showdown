# Harness

`harness.js` allows for running multiple random simulations of Pokemon battles
for testing or benchmarking purposes. Without any arguments, `harness.js` will
run 100 random battles and report any errors that occurred. The number of
battles run can be configured through by passing the number as the sole argument
to `harness.js`, or through the `--num` flag (see below).

## Flags

Using any flag will trigger [minimist](https://github.com/substack/minimist) to
be installed if it has not been already.

### General

-   **`--num`**: play a specific number of games for a format instead of the
    default 100.
-   **`--seed`**: PRNG seed to use (eg. `'1234,5678,9012,3456'`).
-   **`--verbose`**: makes the harness display the _output_ logs of each battle
    it runs, unless `--silent` is also used.
-   **`--logs`**: dump the battle _input_ logs if an error occurs, unless
    `--silent` is also used.
-   **`--silent`**: never output anything (ie. rely purely on the harness's
    process exit code).

### Format

By default, the harness will select the format of the next game it runs randomly
based on its initial `--seed`. Alternatively, it can run games all in the same
format, or run all formats.

-   **`--format`**: play the specified format for each of the games it runs.
    Note that the harness only supports formats where the team can be randomly
    generated.
-   **`--all`**: plays *every* supported format. In this mode, *each* format is
    run `--num` times.

### Concurrency

The harness runs games sequentially by default, but can be configured to run
games asynchronously.

-   **`--async`**: runs each game concurrently instead of waiting for the
    previous game to complete before starting the next. Note that since battles
    should not be blocking to begin with, this mode is not expected to have
    performance benefits over the default sequential mode, requires extra memory
    (run with `node --max-old-space-size=<SIZE> --stack-size=<SIZE>` if you
    encounter issues) and should not be used with `--benchmark` as it makes the
    results less repeatable.

**TODO**: Add support for running battles in `--parallel` on muliple cores with
[`worker_threads`](https://nodejs.org/api/worker_threads.html).

## Benchmarking

The benchmarking mode of the harness can be triggered through the `--benchmark`
flag. Using the benchamarking mode will trigger
[trakkr](https://github.com/scheibo/trakkr) to be installed if it has not been
already.

By default, benchmarking will only record coarse timing information about how
long a battle took to play out. For further insight, the simulator needs to be
instrumented with `time` and `count` calls to the [trakr API][1]. In most cases,
this simply involves calling `this.battle.timer.time('method')(method(...))` or
`this.battle.timer.count('event')` in the approriate places (or
`this.timer.timer` / `this.timer.count` in `Battle`). Because there is no way to
strip this profiling code during a release it cannot be checked in - Typescript
(`timer` is declared to be of type `null` to cause the typechecker to complain
if anyone calls it) and our unit tests (where `timer` calls `throw`) should help
guard against this.

In general, benchmarks should be run with:

```
  $ node dev-tools/harness 1000 --benchmark --warmup --fixed
```

See trakr's [`BENCHMARK.md`][2] for more useful information about benchmarking
and performance optimization in Javascript in particular. In general - be very
conscious about the possible overhead introduced by the trakr library and be
careful to structure comparisions to minimize skew due to overhead.

-   **`--benchmark`**: configures a predetermined `--seed` (overriding any
    manually specified value) and forces sequential mode for repeatable results.
-   **`--warmup`**: runs a configurable number of additional battles and
    discards the results before actually recording profiling information. The
    harness already preloads all `Dex` mods/data before any runs, but running a
    warmup can prepopulate the various caches used by the simulator and gives V8
    a chance to optimize common paths.
-   **`--fixed`**: preallocate a configurable fixed size buffer for profiling
    events. Preallocating can help minimize the benchmarking library's overhead
    by avoiding allocs and GCs in the critical path, though creates the risk of
    overrunning the buffer if not allocated correctly. The default preallocation
    of 1 MiB is enough for > 100k events - if you're overrunning the buffer with
    this configuration you're probably doing something wrong.
-   **`--trace`**: causes timer calls to create 'trace events' which can then be
    visualized in `chrome://tracing` (see [trakr documentation][2] for more
    details). Tracing adds non-trivial overhead which will likely skew the
    results of the benchmark compared to non-`--trace` runs.

### Output

By default, profiling statistics are output as human readable tables, but can be
configured to include additional information or use a different display format.

-   **`--full`**: include `min`, `max`, `avg` and `std` in output (however, see
    [trakr documentation][2] regarding [robust statistics][3] to determine why
    `avg` might not be the correct metric to focus on).
-   **`--output`**: instead of the default `'table'` output, results can be
    displayed as `'csv'` or `'tsv'` (`--csv` and `--tsv` accomplish the same
    thing).

[1]: https://github.com/scheibo/trakr/README.md
[2]: https://github.com/scheibo/trakr/BENCHMARKING.md
[3]: https://en.wikipedia.org/wiki/Robust_statistics
