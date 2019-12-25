Custom Rules
============

Pokémon Showdown supports custom rules in tournaments, as well as by editing `formats.js`.


Bans
----

Bans are just a `-` followed by the thing you want to ban.

### Individual bans

`- Blaziken` - ban a Pokémon

`- Blaziken-Mega` or `- Giratina-Altered` or `- Giratina-Base` - ban a specific Pokémon forme

`- Baton Pass` - ban a move

`- move: Metronome` - ban a move with an ambiguous name

`- Bright Powder` - ban an item

`- item: Metronome` - ban an item with an ambiguous name

### Group bans

`- OU` or `- DUU` - ban a tier

`- CAP` or `- Mega` - ban a pokemon category

`- LGPE` - ban things only available Let's Ge Pikachu/Eevee

`- Past` - ban things that only appear in a past generation (such as Berserk Gene in Gen 5, spiky-eared Pichu in Gen 5, or Unown in Gen 8)

`- Future` - ban things that only appears in a future generation (such as Arceus in Gen 1)

`- Custom` - ban made-up things other than CAP (such as Magikarp's Revenge, or Staff Bros moves)

`- Nonexistent` - catch-all to ban all nonexistent Pokémon, items, etc. Includes: `- CAP, - Past, - Future, - LGPE`

`- Unobtainable` - ban all things designed never to be released (Pokestars in Gen 5, Eternatus-E, Floette-E)

`- Unreleased` - ban all things that will probably be released eventually (Venusaur in Gen 8)

`- all items` - ban all items

`- all abilities, + No Ability` - ban all abilities (No Ability needs to be specifically allowed to allow Pokemon with no abilities)


Unbans
------

Unbans are just a `+` followed by the thing you want to unban.

Syntax is identical to bans, just replace `-` with `+`, like:

`+ Blaziken` - unban a Pokémon

`+ Past` - unban all past-generation-only things

More specific always trumps less specific:

`- all Pokemon, + Uber, - Giratina, + Giratina-Altered` - allow only Ubers other than Giratina-Origin

`- Nonexistent, + Necturna` - don't allow anything from outside the game, except the CAP Necturna

For equally specific rules, the last rule wins:

`- Pikachu, - Pikachu, + Pikachu` - allow Pikachu

`+ Pikachu, - Pikachu, + Pikachu, - Pikachu` - ban Pikachu


Whitelisting
------------

Instead of a banlist, you can have a list of allowed things:

`- all Pokemon, + Charmander, + Squirtle, + Bulbasaur` - allow only Kanto starters

`- all moves, + move: Metronome` - allow only the move Metronome

`- all abilities, + No Ability` - ban all abilities

`- all items, + item: Metronome` - allow only the item Metronome


Legality rules
--------------

Custom rules can have more complicated behavior. They can also include other rules.

### Obtainability rules

`Obtainable` - allow only things you can actually get in the game without glitches or hacks. Includes: `Obtainable Moves, Obtainable Abilities, Obtainable Formes, Obtainable Misc, -Unreleased, -Unobtainable, -Nonexistent`.

`Obtainable Moves` - allow only moves a pokemon can legitimately learn

`Obtainable Abilities` - allow only abilities a pokemon can naturally get (by itself, does not check unreleased abilities! use `-Unreleased` for that)

`Obtainable Formes` - don't allow starting the battle with formes that normally require an in-battle transformation (like megas) (does not check unreleased/nonexistent formes; use `-Nonexistent` etc)

`Obtainable Misc` - allow only legal EVs, IVs, levels, genders, and Hidden Power types

### Pokedex rules

`Hoenn Pokedex` - allow only Pokémon in the Hoenn Pokédex

`Sinnoh Pokedex` - allow only Pokémon in the Sinnoh Pokédex

`Kalos Pokedex` - allow only Pokémon in the Kalos Pokédex

`Alola Pokedex` - allow only Pokémon in the Alola Pokédex

(There is no `Galar Pokedex` rule, `-Nonexistent` covers it in Gen 8.)

`Little Cup` - allow only Pokémon that can evolve and aren't evolved

### Clauses

`Species Clause` - limit one Pokémon per dex number

`Nickname Clause` - limit one Pokémon per nickname

`Item Clause` - no two Pokémon can have the same item

`2 Ability Clause` - limit two Pokémon with the same ability

`OHKO Clause` - ban one-hit KO moves (Fissure, Sheer Cold, etc)

And more (TODO: finish this list)


In-battle rules
---------------

`Team Preview` - use Team Preview

`Blitz` - use the Blitz timer (30 second Team Preview, 10 seconds per turn)

`VGC Timer` - use the VGC timer (90 second Team Preview, 7 minutes Your Time, 1 minute per turn)

`Mega Rayquaza Clause` - prevent Rayquaza from Mega Evolving

`Sleep Clause Mod` - prevent Pokémon from falling asleep if they have sleeping allies

`Freeze Clause Mod` - prevent Pokémon from getting frozen if they have frozen allies

`Cancel Mod` - allow the Cancel button

`Inverse Mod` - inverse type effectiveness (like in Gen 6 Inverse Battles)


Removing rules
--------------

Put `!` in front of a rule to remove it, like:

`! Team Preview` - do not use Team Preview

You can use this to remove individual parts of rules, like:

`Obtainable, ! Obtainable Moves` - require pokemon to be obtained legitimately, except for moves, which they can use whatever
