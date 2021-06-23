Nonstandard Dex data
====================

Pokémon Showdown's data files and Dex API give access to a lot of nonstandard information, some of which you probably want to filter out before using for your own purposes.

Especially if you want to use the lists in `Dex.moves.all()`, `Dex.items.all()`, `Dex.abilities.all()`, or `Dex.species.all()`, make sure to read this file so you know to filter out the information you don't want!

Filtering out `effect.isNonstandard` will filter out most of what you don't want, but there are a lot of subtleties, so please read on for sure.


CAP
---

Our data includes data on fanmade Pokémon, moves, and abilities from Smogon's Create-A-Pokémon Project.

Examples include:

- pokemon: Astrolotl
- move: Paleo Wave
- ability: Mountaineer

These have `thing.isNonstandard === 'CAP'`.


Things from other games
-----------------------

All of our data for specific games also contains Pokémon, items, etc from every other game. This makes it easy to stage "what-if" battles using mechanics from one game but Pokémon from another game, such as the NatDex format.

Examples include:

- pokemon: Pichu-Spiky-eared (only exists in Gen 4 games)
- item: Berserk Gene (only exists in Gen 2 games)
- move: Hidden Power (only exists in Gen 2-7 games)

These have `thing.isNonstandard === 'Past' || thing.isNonstandard === 'Future' || thing.isNonstandard === 'LGPE'`.


Pokéstar Pokémon
----------------

Gen 5 had a minigame called ["Pokéstar Studios"](https://bulbapedia.bulbagarden.net/wiki/Pok%C3%A9star_Studios), where you could fight robots and aliens and other non-Pokémon in Pokémon battles. These are treated as Pokémon in the Black 2 and White 2 game data.

Examples include:

- Pokestar Giant
- Pokestar Smeargle (NOT considered the same species as a real Smeargle)

These have `species.isNonstandard === 'Pokestar'`.


Unobtainable things
-------------------

Sometimes, Game Freak adds game data, clearly planning for something to be released later, but then never releases it. They can still be obtained by hacking, or by trading with someone who's hacked their game.

Examples include:

- Floette-Eternal
- Fire Gem (in Gen 6)

These have `thing.isNonstandard === 'Unobtainable'` in the game whose code they appear in. They're marked as `Past` or `Future` as appropriate, in other games.


Unobtainable Hidden Abilities
-----------------------------

In Gen 5, the game data contained a lot of Hidden Abilities, such as Volt Absorb Zapdos, which ended up never getting released, and were later retconned.

Pokémon with never-released Gen 5 Hidden Abilities have `species.unreleasedHidden` set to `true` in Gen 5.


Typed Hidden Powers
-------------------

The data contains information for moves named "Hidden Power Fire", "Hidden Power Ice", etc. These are provided for convenience: when building teams (to set the move to "Hidden Power" and change IVs), when running damage calculations, and when exporting or sending movesets.

These are matched with `move.realMove === "Hidden Power"`. Since no other move has this feature, you can also check `move.realMove` for existence.


Max moves
---------

Max moves cannot be learned normally, and behave weirdly if hacked into a Pokémon's moveset.

They are matched with `move.isMax`. `move.isNonstandard === null` for Max moves.


G-Max moves
-----------

Unlike Max moves, G-Max moves aren't "real" moves, and don't even have an entry in the in-game moves database, meaning they can't be hacked onto Pokémon at all.

They are matched with `move.isNonstandard === 'Gigantamax'`.


Z-moves
-------

Z-moves cannot be learned normally, and behave weirdly if hacked onto a Pokémon's moveset.

Damaging and Pokémon-specific Z moves are matched with `move.isZ`. `move.isNonstandard === null` for Z moves.


Z-status moves
--------------

Unlike regular Z-moves, Z-status moves aren't considered "real" moves, and don't even have an entry in the in-game moves database, meaning they can't be hacked onto Pokémon at all.

They do not appear in `Dex.moves.all()`. Information about them is available in `move.zMove` for the underlying status move.


Damage information on Hidden Power, Return, and Frustration
-----------------------------------------------------------

The sim will sometimes send move names like `Hidden Power Fire 58` or `Frustration 12` or `Return 50`, in generations where these moves have variable base power. This is used to convey information about move power. These are not considered separate moves.

These don't exist in `Dex.moves.all()`, so you do not need to filter them out.


Gigantamax and other "questionable" formes
------------------------------------------

Gigantamax sprites are not considered actual Pokémon formes by the game data. For ease of selection and sprite viewing, we treat them as formes.

Filter them out with `species.forme === 'Gmax'`.

For more information on formes whose status as "real" is controversial, see [data/FORMES.md](./../data/FORMES.md)


"No Ability"
------------

There is an Ability named "-" in Gen 8, and "No Ability" in some older games, which can't be obtained except by hacking. Note that Gastro Acid does not change your ability to this, it simply sets a volatile status that prevents your ability from having an effect.

Pokémon Showdown always calls it "No Ability".

No Ability has `ability.isNonstandard === 'Past'` in Gen 3+. In Gen 1-2, No Ability is considered the only legal ability, and will have `ability.isNonstandard === null`.


Items with no competitive effect
--------------------------------

We do not carry information about all holdable items. Players wishing to hold an item with no competitive effect can simply hold a "Poke Ball".

`Dex.items.all()` only contains information about items that are competitively relevant. Do not rely on this not to have any given item; "competitively relevant" is not an objective metric and may change (especially since Fling does have an effect for most items we currently consider irrelevant).
