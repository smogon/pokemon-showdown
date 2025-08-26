# Simulate

`index.js` allows running multiple random simulations of Pokemon battles for testing and benchmarking.  
Without any arguments, `index.js` will run 100 random battles and report any errors that occur.  

Using any flag will trigger [minimist](https://github.com/substack/minimist) to be installed if it has not been already.

---

## multi

The `multi` subcommand (alias: `random`) allows configuring the number of battles played, which formats are used, how they are run, and what to output.

### General

- **`--num`**: play a specific number of games for a format instead of the default 100.  
- **`--seed`**: PRNG seed to use (e.g. `'1234,5678,9012,3456'`).  
- **`--output`**: display the battle-output logs of each battle.  
- **`--input`**: display the battle-input logs of each battle.  
- **`--error`**: display the battle-input logs of battles that encounter errors.  

### Format

By default, the harness selects the format of the next game randomly based on the initial `--seed`.  
Alternatively, it can run games all in the same format, cycle through formats, or run all formats.  

- **`--format`**: play the specified format for each game. Only formats with randomly generated teams are supported.  
- **`--cycle`**: cycle through the possible formats, playing one battle in each until `--num` battles are completed.  
- **`--all`**: play every supported format `--num` times before moving on to the next.  

### Concurrency

The harness runs games sequentially by default but can be configured to run asynchronously.  

- **`--async`**: run each game concurrently instead of waiting for the previous game to complete.  
  > Note: Battles run through the harness should not be blocking to begin with (battles naturally wait for player decisions, but AIs usually act immediately).  
  > This mode is not expected to provide large performance benefits over sequential execution and may require additional memory.  

**TODO:** Add support for running battles in `--parallel` on multiple cores with [`worker_threads`](https://nodejs.org/api/worker_threads.html).  

---

## exhaustive

The `exhaustive` subcommand cycles through all generations and game types, attempting to trigger as many different effects as possible in its random simulations.  
This can be useful as a form of [smoke testing](https://en.wikipedia.org/wiki/Smoke_testing_(software)) — a sanity check to expose obvious critical issues.  

> Passing a full cycle of smoke tests does *not* mean the application is bug-free or even crash-free.  
> It only provides some confidence that the application is less likely to fail catastrophically.  

### Flags

- **`--format`** / **`--formats`**: play the specified format(s) instead of iterating through all formats. Multiple formats should be comma-separated (e.g. `format1,format2`).  
- **`--cycles`**: repeat the pool of effects `--cycles` times instead of once. Negative values imply `--forever`.  
- **`--forever`**: continuously iterate through formats, exhausting each `--cycles` times.  
- **`--seed`**: PRNG seed to use (e.g. `'1234,5678,9012,3456'`).  
- **`--maxFailures`**: exit early if this number of failures is reached.
