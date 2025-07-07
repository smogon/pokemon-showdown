# A PokeBedrock Fork of Pokémon Showdown

This library has been gutted, and changed a bit. The main things that are changed have to do with usability
with Minecraft Bedrocks Script API. For example use of `set` as a property name does not work in ESM format, breaking
most of Pokemon Showdown. Because of this all reference to `Pokemon.set` has been changed to `Pokemon.pokemonSet`.

## Current Changes:
- Added `DETAILS` to `-heal` instruction.
  This is so we can read the pokemon that is being healed by the interpreter.
- Added Bag items that have a system designed to handle bag item actions.
- Added a whole UUID system which allows pokemon to be searched easily by interpreter.
- Added some better typing to code.
- Reworked Config to not use reading/writing to files as script api doesn't support that.
- Added new skins the pokedex
- Added better properties to describe evolutions in pokedex:
  - `evoKnownMoveType`
  - `evoMinAffection`
  - `evoPartySpecies`
  - `evoTradeSpecies`
  - `evoPartyType`
- Send `detailschange` after mega evolution so it will look good.
- Added `-killed` instruction to send a messages when a pokemon is killed.
- Added `used-ball` instruction to send a messages when a ball is used.
- Added `forceforme` instruction to send a messages when a pokemon is forced to change its forme.
