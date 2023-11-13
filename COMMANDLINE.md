Pokémon Showdown command-line tools
===================================

Pokémon Showdown provides a command-line utility `pokemon-showdown`. You can access its help anytime with `pokemon-showdown -h`.


Setup
-----

Install Node.js, clone this repository and run `./build` from inside it. (Windows users should use `node build`, and replace all future mentions of `./` in this document with `node` followed by a space.)

Every time you update the code here (such as with `git pull`), run `./build` again. (If you get errors, try running `./build --force`.)

Afterwards, you can use any of the following commands:


Supported commands
------------------

Note: Commands that ask for a team want the team in [packed team format](./sim/TEAMS.md#packed-format) or JSON format. Teambuilder export format is not supported.

`./pokemon-showdown start [--skip-build] [PORT]`

- Starts a PS server on the specified port
  (Defaults to the port setting in config/config.js)
  (The port setting in config/config.js defaults to 8000)

  Using Pokémon Showdown as a server is documented at:
  [server/README.md](./server/README.md)

  (You do not need to use `./build` when using PS as a server; it will
  be run automatically for you unless you use `--skip-build`.)

`./pokemon-showdown generate-team [FORMAT-ID [RANDOM-SEED]]`

- Generates a random team, and writes it to stdout in packed team format
  (Format defaults to the latest Random Battles format)

`./pokemon-showdown validate-team [FORMAT-ID]`

- Reads a team in any format from stdin, and validates it
  - If valid: exits with code 0
  - If invalid: writes errors to stderr, exits with code 1

`./pokemon-showdown simulate-battle`

- Simulates a battle, taking input to stdin and writing output to stdout

  Using Pokémon Showdown as a command-line simulator is documented at:
  [sim/README.md](./sim/README.md)

`./pokemon-showdown json-team`

- Reads a team in any format from stdin, writes the unpacked JSON to stdout

`./pokemon-showdown pack-team`

- Reads a team in any format from stdin, writes the packed team to stdout

`./pokemon-showdown export-team`

- Reads a team in any format from stdin, writes the exported (human-readable) team to stdout

`./pokemon-showdown help`

- Displays this reference


Piping
------

These commands are very unixy (using stdin and stdout), so you can of course pipe them together:

```
$ ./pokemon-showdown generate-team gen8randombattle | ./pokemon-showdown export-team
Kartana @ Choice Band
Ability: Beast Boost
Level: 74
EVs: 85 HP / 85 Atk / 85 Def / 85 SpA / 85 SpD / 85 Spe
- Smart Strike
- Sacred Sword
- Knock Off
- Leaf Blade

Rotom (Rotom-Heat) @ Heavy-Duty Boots
Ability: Levitate
Level: 82
EVs: 85 HP / 85 Def / 85 SpA / 85 SpD / 85 Spe
IVs: 0 Atk
- Defog
- Will-O-Wisp
- Thunderbolt
- Overheat

Kingler @ Life Orb
Ability: Sheer Force
Level: 84
EVs: 85 HP / 85 Atk / 85 Def / 85 SpA / 85 SpD / 85 Spe
- Liquidation
- X-Scissor
- Superpower
- Rock Slide

Abomasnow @ Light Clay
Ability: Snow Warning
Level: 82
EVs: 85 HP / 85 Atk / 85 Def / 85 SpA / 85 SpD / 85 Spe
- Ice Shard
- Aurora Veil
- Earthquake
- Blizzard

Goodra @ Assault Vest
Ability: Sap Sipper
Level: 82
EVs: 85 HP / 85 Atk / 85 Def / 85 SpA / 85 SpD / 85 Spe
- Earthquake
- Power Whip
- Draco Meteor
- Fire Blast

Raikou @ Choice Specs
Ability: Pressure
Level: 80
EVs: 85 HP / 85 Def / 85 SpA / 85 SpD / 85 Spe
IVs: 0 Atk
- Scald
- Aura Sphere
- Thunderbolt
- Volt Switch
```

```
$ ./pokemon-showdown generate-team gen8randombattle | ./pokemon-showdown validate-team gen8ou
Your set for Coalossal is flagged as Gigantamax, but Gigantamaxing is disallowed
(If this was a mistake, disable Gigantamaxing on the set.)
Octillery's ability Moody is banned.
```
