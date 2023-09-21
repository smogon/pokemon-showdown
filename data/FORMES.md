Pokémon formes
==============

Officially, in media from The Pokémon Company, "form" (_sugata_ in Japanese) usually refers to same-species variants of non-legendary Pokémon, and "forme" (_foomu_ in Japanese) usually refers to same-species variants of legendary Pokémon. A number of variations are not called anything at all.

The fandom is inconsistent about what it calls these variations, and because we need _some_ word as an umbrella term for all of them, PS chooses to call all these variations "forme".

In code, an instance of `Species` refers to a specific forme, which can be accessed with `species.forme`.


"Regular" formes
----------------

At its most simplest, a forme is like a different species, just with the same species name and dex number. You can't convert between formes, they can have their own learnset, type, Abilities, etc.

A good example of this would be Wormadam-Plant vs Wormadam-Sandy.

In PS's data files, we designate one of these formes as "the base forme", to be used when you try to access the species without specifying the forme.

So Wormadam-Plant would be:

`{name: "Wormadam", forme: "", baseForme: "Plant", baseSpecies: "Wormadam", otherFormes: ["wormadamsandy", "wormadamtrash"]}`

And then Wormadam-Sandy would be:

`{name: "Wormadam-Sandy", forme: "Sandy", baseForme: "", baseSpecies: "Wormadam", otherFormes: null}`

Note that `otherFormes` only exists on the dex entry for the _base_ forme.

Examples include:

- Wormadam
- all Galarian and Alolan regional formes


Cosmetic formes
---------------

Cosmetic formes have no competitive difference from their base forme whatsoever, besides appearance. They are identical in stats, types, learnable moves, ability, and everything else besides appearance.

These include:

- Unown
- Vivillon (patterns) (except Poké Ball Pattern and Fancy Pattern)
- Deerling/Sawsbuck
- Gastrodon
- Flabébé, Floette (except Eternal Flower), Florges
- Minior (colors)

Cosmetic formes are not listed in the `otherFormes` array, only in the `cosmeticFormes` array.

`{name: "Gastrodon", baseForme: "West", cosmeticFormes: ["gastodoneast"]}`

You will still be able to get a data entry for a cosmetic forme with `Dex.species.get` as normal, though, such as `Dex.species.get('gastrodon-east')`:

`{name: "Gastrodon-East", forme: "East", baseSpecies: "Gastrodon"}`


Visual formes
-------------

Some formes are _nearly_ cosmetic formes, but they have differences in what moves they can learn (or whether they can be shiny) due to the existence of events that only distribute one visual forme.

Other formes are nearly cosmetic formes, but require a specific held item to attain that forme.

The games themselves consider them the same as cosmetic formes, but PS considers them non-cosmetic because they affect move legality and team validation.

Polteageist (Antique Form) is considered a visual forme, but with some special treatment planned to make it a visually indistinguishable forme.

Learnset-based visual formes include:

- Polteageist
- Vivillon (Fancy Pattern)
- Vivillon (Poké Ball Pattern)
- Keldeo (Resolute Forme)
- all totems

Item-based visual formes include:

- Genesect
- Arceus

Arceus formes are listed as having the type enforced by Multitype. For instance, Arceus-Flying is listed to have Flying type, rather than Normal type. This is purely a convenience to display the type a user would expect: its actual type is still Normal type because it's a visual forme of Arceus-Normal (it having Flying-type in-game is an effect of the Multitype ability, not a property of the forme).

Visual formes in PS are implemented as regular formes.


Formes changeable out-of-battle
-------------------------------

Some Pokémon can change forme out-of-battle. These include:

- Rotom
- Arceus
- Genesect
- Giratina

PS establishes one of their formes as the "original forme", and gives the others a `changesFrom` property pointing to the original forme.

If a held item is required for a Pokémon to start battle with that forme, the `requiredItem` property will track this.

`{name: "Giratina-Origin", forme: "Origin", baseSpecies: "Giratina", changesFrom: "Giratina", requiredItem: "Griseous Orb"}`

Some changeable formes (like Arceus) are visual formes. See "Visual formes" above for more information.

Changeable formes are otherwise treated identically to regular formes.


In-battle formes
----------------

Some Pokémon change forme in the middle of a battle. These forme changes do reset stats and type.

List of all in-battle forme changes:

- Ash-Greninja (Battle Bond)
- Mimikyu (Disguise)
- Cherrim (Flower Gift)
- Castform (Forecast)
- Cramorant (Gulp Missile)
- Morpeko (Hunger Switch)
- Eiscue (Ice Face)
- Zygarde (Power Construct)
- Wishiwashi (Schooling)
- Minior (Shields Down)
- Aegislash (Stance Change)
- Darmanitan (Zen Mode)
- Meloetta (Relic Song)
- Shaymin-Sky (Frozen status)
- Mega evolutions
- Primal reversions
- Ultra Burst

PS treats these identically to regular formes, but gives them a `battleOnly` property noting what forme they would be in at the start of battle:

`{name: "Meloetta-Pirouette", forme: "Pirouette", battleOnly: "Meloetta", requiredMove: "Relic Song"}`

These may or may not also have a `requiredItem`, `requiredAbility`, or `requiredMove` property, which notes anything required for the in-battle forme transformation.


Visual in-battle formes
-----------------------

Some Pokémon change their appearance mid-battle, but not in a way that changes their base stats, Ability, or type. These include:

- Cherrim
- Cramorant
- Mimikyu

PS treats these like regular in-battle formes.


"Fake" visual in-battle formes
------------------------------

Dynamax/Gigantamax can be thought of as visual in-battle formes, but they're different in one major way: They're not considered "real" forme changes, so the change doesn't reset types and stats changed by Reflect Type, Power Split, Power Trick, etc.

These include:

- all Dynamax and Gigantamax changes

PS has dex entries for Gigantamax Pokémon (to make their sprites easier to access) but not Dynamax Pokémon.


Event-only Ability formes
-------------------------

Some Pokémon have have separate forme in the game code, purely to support having an event-only Ability. These formes look identical to their base forme, and have the same type, stats, and level-up/TM/tutor moves. The only difference is their Ability and which events you can get them from.

These include:

- Rockruff (with Own Tempo)
- Greninja (with Battle Bond)
- Zygarde (10% Forme) (with Power Construct)
- Zygarde (50% Forme) (with Power Construct)

Greninja in the game code has three formes: regular, Battle Bond, and Ash-Greninja. Battle Bond is an event-only ability forme, and Ash-Greninja is an in-battle forme of the the event-only ability forme.

Zygarde works the same way, with five formes: regular 50% Zygarde, event-only Power Construct 50% Zygarde, regular 10% Zygarde, event-only Power Construct 10% Zygarde, Zygarde Complete being an in-battle only forme of either event-only Power Construct 10% Zygarde or event-only Power Construct 50% Zygarde.

PS's current implementation of this is weird and will be changed in a few days; do not rely on its current implementation.


Not formes
----------

Alcremie garnishes and Spinda spot patterns aren't considered formes by the games themselves. PS doesn't support them at all.

Dynamax and Gigantamax are not considered formes by the games themselves. PS implements them correctly in the simulator as volatile statuses, but does have dex entries for Gigantamax Pokémon (treating them as in-battle formes) to make their sprites easier to access, and to make Gigantamax-capable Pokémon easier to select in the teambuilder.


`pokedex.js`
------------

All the data shown here is information available from `Dex.species.get`. Data in `pokedex.js` will not necessarily contain the same information.

Most importantly, note that cosmetic formes are not listed in `pokedex.js`, but generated automatically from their base forme entry.
