# Replay Then Roll

`recreate.js` touches one `Battle` object two different ways, in strict sequence, never both at once: first a `LogApplier` mutates it directly from the real log, entry by entry, with no dice involved — then, from turn N on, the real engine takes over and every choice is a genuine roll.

- **turns `1..N-1`** — direct mutation, no RNG
- **turn `N` onward** — real engine, real RNG

## The two-phase handoff

```mermaid
flowchart LR
    classDef replay fill:#dce7f2,stroke:#2e5c8a,color:#1a3a56,stroke-width:1.5px;
    classDef simulate fill:#f3e1d2,stroke:#b85526,color:#7a3814,stroke-width:1.5px;
    classDef neutral stroke-width:1.2px;

    L[logFile]:::neutral
    P1[paste1.txt]:::neutral
    P2[paste2.txt]:::neutral

    L --> Parse
    P1 --> Parse
    P2 --> Parse

    Parse["parse()<br/>parseLog<br/>entriesBeforeTurn<br/>Teams.import"]:::neutral
    Parse -->|entries array| DriverA
    Parse -->|teams x2| Construct

    Construct["construct()<br/>new BattleStream<br/>send &gt;start / &gt;player p1,p2"]:::neutral
    Construct -->|Battle object| SA

    DriverA["LogApplier.applyAll entries<br/>sethp . setStatus . addVolatile<br/>directSwitchIn . directFaint<br/>no RNG, no event pipeline"]:::replay
    DriverB["pickChoice then battle.choose<br/>commitChoices . turnLoop<br/>real RNG, full event pipeline"]:::simulate
    DriverA -->|"makeRequest('move'), turn = N"| DriverB

    subgraph Battle["Battle: Side p1, Side p2, Pokemon[]"]
        direction LR
        SA["turns 1..N-1"]:::replay
        SB["turn N onward"]:::simulate
        SA --- SB
    end

    DriverA -. mutates .-> SA
    DriverB -. mutates .-> SB

    SB -->|"preTurnLines + battle.log[...]"| Out1["combined log: --out FILE"]
    SB -->|snapshotState| Out2["state snapshot: stdout JSON"]
```

One `Battle`, two drivers. `LogApplier` (blue) walks the real log directly — `sethp`, `setStatus`, `addVolatile`, `directSwitchIn`, `directFaint` — writing state straight onto `Side` and `Pokemon` objects with no simulation involved. Once it reaches turn N, `battle.makeRequest('move')` generates a real choice request, and control passes to `playRandomly()` (amber), which feeds `pickChoice()`'s output through `battle.choose()` — the actual engine, actual dice, from there on.

Phase A never rolls dice; phase B never reads the original log again. The only thing that crosses the boundary is the `Battle` object itself, at exactly the point `makeRequest('move')` is called.

## File → object map

| file | exports | role |
|---|---|---|
| `event-log.js` | `parseLog`, `serializeLog`, `entriesBeforeTurn` | Real log text ↔ `EventLog` (`{header, turns}`); slices out everything before turn N. |
| `apply.js` | `LogApplier` | **Phase A.** Applies `EventLog` entries straight onto `Battle` / `Side` / `Pokemon`. No engine, no RNG. |
| `random-choice.js` | `pickChoice` | **Phase B.** Turns a `ChoiceRequest` into a legal move/switch string. Pure function, no side effects. |
| `recreate.js` | `recreateAtTurn`, `playRandomly`, `main` | Orchestrates all of the above — builds the `Battle`, runs the two phases, writes `--out`. CLI entry point. |
| `state-snapshot.js` | `snapshotState` | Reduces a live `Battle` to plain, comparable JSON — what gets printed to stdout. |
| `test-recreate.js` | *(script)* | Plays its own ground-truth game, then reuses `recreateAtTurn` / `playRandomly` and diffs `snapshotState` output against it. |
