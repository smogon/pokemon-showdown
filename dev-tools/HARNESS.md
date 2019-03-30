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
-   **`--output`**: makes the harness display the _output_ logs of each battle
    it runs.
-   **`--input`**: dump the battle _input_ logs of each battle it runs.
-   **`--error`**: dump the battle _input_ logs of each battle which errors.

### Format

By default, the harness will select the format of the next game it runs randomly
based on its initial `--seed`. Alternatively, it can run games all in the same
format, cycle through the formats or run all formats.

-   **`--format`**: play the specified format for each of the games it runs.
    Note that the harness only supports formats where the team can be randomly
    generated.
-   **`--cycle`**: cycles through the possible formats, playing one battle in
    each `--num` battles in total.
-   **`--all`**: plays every supported format `--num` times before moving on to
    the next format.

### Concurrency

The harness runs games sequentially by default, but can be configured to run
games asynchronously.

-   **`--async`**: runs each game concurrently instead of waiting for the
    previous game to complete before starting the next. Note that since battles
    run through the harness should not be blocking to begin with (battles
    naturally wait for players to make their decisions, but the AI's should be
    making decisions pretty much immediately), this mode is not expected to have
    large performance benefits over the default sequential mode and may require
    additional memory (run with `node --max-old-space-size=<SIZE>
    --stack-size=<SIZE>` if you encounter issues).

**TODO**: Add support for running battles in `--parallel` on muliple cores with
[`worker_threads`](https://nodejs.org/api/worker_threads.html).
