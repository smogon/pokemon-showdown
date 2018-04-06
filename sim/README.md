Simulator
=========

Pokémon Showdown's new simulator API is designed to be relatively more straightforward to use than the old one.

It is implemented as a `ReadWriteStream`. You write to it player choices, and you read protocol messages from it.

```js
const Sim = require('Pokemon-Showdown/sim');
stream = new Sim.BattleStream();

(async () => {
    let output;
    while ((output = await stream.read())) {
        console.log(output);
    }
})();

stream.write(`>start {"format":"gen7randombattle"}`);
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
>start {"format":"gen7ou"}
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

Makes a choice for a player (see "Choice specification")


Choice specification
--------------------

Using the Pokémon Showdown client, you can specify choices with `/choose CHOICE`, or, for move and switch choices, just `/CHOICE` works as well.

Using the simulator API, you would write `>p1 CHOICE` or `>p2 CHOICE` into the battle stream.

You can see the syntax in action by looking at the console when playing a battle in the Pokémon Showdown client.

As an overview:

- `switch Pikachu`, `switch pikachu`, or `switch 2` are all valid `CHOICE` strings to switch to a Pikachu in slot 2.

- `move Focus Blast`, `move focusblast`, or `move 4` are all valid `CHOICE` strings to use Focus Blast, your active Pokemon's 4th move.

In Doubles, decisions are delimited by `,`. If you have a Manectric and a Cresselia, `move Thunderbolt 1 mega, move Helping Hand -1` will make the Manectric mega evolve and use Thunderbolt at the opponent in slot 1, while Cresselia will use Helping Hand at Manectric.

To be exact, `CHOICE` is one of:

- `team TEAMSPEC`, during Team Preview, where `TEAMSPEC` is a list of pokemon slots.
  - For instance, `team 213456` will swap the first two Pokemon and keep all other pokemon in order.
  - `TEAMSPEC` does not have to be all pokemon: `team 5231` might be a choice in VGC.
  - `TEAMSPEC` does not need separators unless you have over 10 Pokémon, but in custom games, separate slots with `,`. For instance: `team 2, 1, 3, 4, 5, 6, 7, 8, 9, 10`

- `default`, to auto-choose a decision. This will be the first possible legal choice. This is what's used in VGC if you run out of Move Time.

- `undo`, to cancel a previously-made choice. This can only be done if the another player needs to make a choice and hasn't done so yet (or if you are calling `side.choose()` directly, which doesn't auto-continue when both players have made a choice).

- `POKEMONCHOICE` in Singles

- `POKEMONCHOICE, POKEMONCHOICE` in Doubles

`POKEMONCHOICE` is one of:

- `default`, to auto-choose a decision

- `pass`, to skip a slot in Doubles/Triples that doesn't need a decision (never required, but can be useful for readability, to mean "the pokemon in this slot is fainted and won't be making a move")

- `move MOVESPEC`, to make a move

- `move MOVESPEC mega`, to mega-evolve and make a move

- `move MOVESPEC zmove`, to use a z-move version of a move

- `switch SWITCHSPEC`, to make a switch

`MOVESPEC` is:

- `MOVESLOTSPEC` or `MOVESLOTSPEC TARGETSPEC`
  - `MOVESLOTSPEC` is a move name (capitalization/spacing-insensitive) or 1-based move slot number
  - `TARGETSPEC` is a 1-based target slot number. Add a `-` in front of it to refer to allies. Remember that slots oppose each other, so in a battle, the slots go as follows:

     Triples    Doubles    Singles
     3  2  1     2  1         1
    -1 -2 -3    -1 -2        -1

(But note that slot numbers are unnecessary in Singles: you can never choose a target in Singles.)

`SWITCHSPEC` is:

- a pokemon nickname or 1-based slot number
  - Note that if you have multiple Pokémon with the same nickname, using the nickname will select the first unfainted one. If you want another Pokémon, you'll need to specify it by slot number.

Once a choice has been set for all players who need to make a choice, the battle will continue.


Reading from the simulator
--------------------------

The simulator will send back messages. In a data stream, they're delimited by `\n\n`. In an object stream, they will just be sent as separate strings.

Messages start with a message type followed by `\n`. A message will never have two `\n` in a row, so that `\n\n` always delimits a  They look like:

    update
    MESSAGES

An update which should be sent to all players and spectators.

The messages the simulator sends back are documented in `PROTOCOL.md`. You can also look at a replay log for examples.

https://github.com/Zarel/Pokemon-Showdown/blob/master/PROTOCOL.md#battle-messages

One message type that only appears here is `|split`. This splits the next four lines into `spectator`, `p1`, `p2`, and `omniscient` messages. The `p1` and `p2` logs will have exact HP values only for the corresponding player, while the `spectator` log will not have exact HP values for either player, and the `omniscient` logs will have exact HP values for both.

    sideupdate
    PLAYERID
    MESSAGES

Send messages to only one player. `|split` will never appear here.

`PLAYERID` will be either `p1` or `p2`.

Note that choice requests (updates telling the player what choices they have for using moves or switching pokemon) are sent this way. Choice requests are documented in:

https://github.com/Zarel/Pokemon-Showdown/blob/master/PROTOCOL.md#battle-progress

    end
    LOGDATA

Sent at the end of a battle. `LOGDATA` is a JSON object that has various information you might find useful but are too lazy to extract from the update messages, such as turn count and winner name.

