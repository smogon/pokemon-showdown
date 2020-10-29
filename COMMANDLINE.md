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

Note: Commands that ask for a team want the team in [packed team format][packed-teams] or JSON format. Teambuilder export format is not supported.

  [packed-teams]: https://github.com/smogon/pokemon-showdown/blob/master/PROTOCOL.md#team-format

`./pokemon-showdown start [--skip-build] [PORT]`

: Starts a PS server on the specified port
: (Defaults to the port setting in config/config.js)
: (The port setting in config/config.js defaults to 8000)

: Using Pokémon Showdown as a server is documented at:
: https://github.com/smogon/pokemon-showdown/blob/master/server/README.md

: (You do not need to use `./build` when using PS as a server; it will
: be run automatically for you unless you use `--skip-build`.)

`./pokemon-showdown generate-team [FORMAT-ID [RANDOM-SEED]]`

: Generates a random team, and writes it to stdout in packed team format
: (Format defaults to "gen7randombattle")

`./pokemon-showdown validate-team [FORMAT-ID]`

: Reads a team from stdin, and validates it
: - If valid: exits with code 0
: - If invalid: writes errors to stderr, exits with code 1

`./pokemon-showdown simulate-battle`

: Simulates a battle, taking input to stdin and writing output to stdout

: Using Pokémon Showdown as a command-line simulator is documented at:
: https://github.com/smogon/pokemon-showdown/blob/master/sim/README.md

`./pokemon-showdown unpack-team`

: Reads a team from stdin, writes the unpacked JSON to stdout

`./pokemon-showdown pack-team`

: Reads a JSON team from stdin, writes the packed team to stdout

`./pokemon-showdown help`

: Displays this reference
