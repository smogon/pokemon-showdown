Simulator
=========

Pokémon Showdown's simulator API is implemented as a `ReadWriteStream`. You write player choices to it, and you read protocol messages from it.

```js
const Sim = require('Pokemon-Showdown/sim');
stream = new Sim.BattleStream();

(async () => {
    let output;
    while ((output = await stream.read())) {
        console.log(output);
    }
})();

stream.write(`>start {"formatid":"gen7randombattle"}`);
stream.write(`>player p1 {"name":"Alice"}`);
stream.write(`>player p2 {"name":"Bob"}`);
```

The stream can be accessed from other programming languages using standard IO:

```bash
echo '>start {"formatid":"gen7randombattle"}
>player p1 {"name":"Alice"}
>player p2 {"name":"Bob"}
' | ./pokemon-showdown simulate-battle
```


Writing to the simulator
------------------------

In a standard battle, what you write to the simulator looks something like this:

```
>start {"formatid":"gen7ou"}
>player p1 {"name":"Alice","team":"insert packed team here"}
>player p2 {"name":"Bob","team":"insert packed team here"}
>p1 team 123456
>p2 team 123456
>p1 move 1
>p2 switch 3
>p1 move 3
>p2 move 2
```

(In a data stream, messages should be delimited by `\n`; in an object stream, `\n` will be implicitly added after every message.)

Notice that every line starts with `>`. Lines not starting with `>` are comments, so that input logs can be mixed with output logs and/or normal text easily.

Note that the text after `>p1` or `>p2` can be untrusted input directly from the player, and should be treated accordingly.

Possible message types include:

```
>start OPTIONS
```

Starts a battle:

`OPTIONS` is a JSON object containing the following properties (optional, except `formatid`):

- `formatid` - a string representing the format ID

- `seed` - an array of four numbers representing a seed for the random number generator (defaults to a random seed)

- `p1` - `PLAYEROPTIONS` for player 1 (defaults to no player; player options must then be passed with `>player p1`)

- `p2` - `PLAYEROPTIONS` for player 2 (defaults to no player; player options must then be passed with `>player p2`)

If `p1` and `p2` are specified, the battle will begin immediately. Otherwise, they must be specified with `>player` before the battle will begin.

See documentation of `>player` (below) for `PLAYEROPTIONS`.

```
>player PLAYERID PLAYEROPTIONS
```

Sets player information:

`PLAYERID` is either `p1` or `p2`

`PLAYEROPTIONS` is a JSON object containing the following properties (all optional):

- `name` is a string for the player name (defaults to "Player 1" or "Player 2")

- `avatar` is a string for the player avatar (defaults to "")

- `team` is a team (either in JSON or a string in packed format)

```
>p1 CHOICE
>p2 CHOICE
```

Makes a choice for a player. [Possible choices are documented in `SIM-PROTOCOL.md`][possible-choices].

  [possible-choices]: https://github.com/Zarel/Pokemon-Showdown/blob/master/sim/SIM-PROTOCOL.md#possible-choices


Reading from the simulator
--------------------------

The simulator will send back messages. In a data stream, they're delimited by `\n\n`. In an object stream, they will just be sent as separate strings.

Messages start with a message type followed by `\n`. A message will never have two `\n` in a row, so that `\n\n` always delimits a  They look like:

    update
    MESSAGES

An update which should be sent to all players and spectators.

[The messages the simulator sends back are documented in `SIM-PROTOCOL.md`][sim-protocol]. You can also look at a replay log for examples.

  [sim-protocol]: https://github.com/Zarel/Pokemon-Showdown/blob/master/sim/SIM-PROTOCOL.md

One message type that only appears here is `|split`. This splits the next four lines into `spectator`, `p1`, `p2`, and `omniscient` messages. The `p1` and `p2` logs will have exact HP values only for the corresponding player, while the `spectator` log will not have exact HP values for either player, and the `omniscient` logs will have exact HP values for both.

    sideupdate
    PLAYERID
    MESSAGES

Send messages to only one player. `|split` will never appear here.

`PLAYERID` will be either `p1` or `p2`.

Note that choice requests (updates telling the player what choices they have for using moves or switching pokemon) are sent this way.

[Choice requests are documented in "Choice requests" in `SIM-PROTOCOL.md`][choice-requests].

  [choice-requests]: https://github.com/Zarel/Pokemon-Showdown/blob/master/sim/SIM-PROTOCOL.md#choice-requests

    end
    LOGDATA

Sent at the end of a battle. `LOGDATA` is a JSON object that has various information you might find useful but are too lazy to extract from the update messages, such as turn count and winner name.

