# Simulate

`simulate.js` allows for running multiple random simulations of Pokemon battles
for testing or benchmarking purposes. Without any arguments, `simulate.js` will
run 100 random battles and report any errors that occur.

Using any flag will trigger [minimist](https://github.com/substack/minimist) to
be installed if it has not been already.

## multi

The `multi` subcommand (alias: `random`) allows for configuring the amount of
battles played, which formats are used, how they are run, and what to output.

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
    additional memory.

**TODO**: Add support for running battles in `--parallel` on muliple cores with
[`worker_threads`](https://nodejs.org/api/worker_threads.html).

## exhaustive

The `exhaustive` subcommand cycles through all generations and game types,
attempting to use as many different effects as possible in the battles it
randomly simulates. This can be useful as a form of
['smoke testing'](https://en.wikipedia.org/wiki/Smoke_testing_\(software\)), a
form of sanity testing/build verification which can be used to expose obvious
critical issues with the application. Making it through a successful cycle of
smoke tests does *not* mean the application is without bugs, or even that it is
crash free - it simply provides some confidence that the application is less
likely to catch fire.

### Flags

-   **`--format`** / **`--formats`**: play the specified format(s) instead of
    iterating through all possible formats. If multiple formats are specified,
    separate each format with a comma (eg. `format1,format2`).
-   **`--cycles`**: exhaust the pools of effects `--cycles` times instead of
    just once. If `--cycles` is negative, `--forever` is implied.
-   **`--forever`**: continue iterating through formats infinitely, exhausting
    each `--cycles` times.
-   **`--seed`**: PRNG seed to use (eg. `'1234,5678,9012,3456'`).
-   **`--maxFailures`**: exit early if this many failures have occured.
