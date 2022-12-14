Dex
===

`Dex` is a library for getting information about Pokémon, moves, items, abilities, natures, stats, etc.

By default, `Dex` gets information about the latest games (currently Pokémon Sword and Shield), but `Dex.mod` can be used to get information about other games.

```js
const {Dex} = require('pokemon-showdown');

const tackle = Dex.moves.get('Tackle');

console.log(tackle.basePower); // prints 40
```


Nonstandard information
-----------------------

The Dex API gives access to a lot of nonstandard data (from other games, from CAP, unreleased things, etc). You often want to filter it out before using it.

For details, see [sim/NONSTANDARD.md](./NONSTANDARD.md).

Nonstandard things will still have `exists: true`, but things we don't have information for at all (for instance, if you typo) will have `exists: false`.

`isNonstandard` will be `null` for normal things.

```js
const {Dex} = require('pokemon-showdown');

const frobnicate = Dex.moves.get('frobnicate');
console.log(frobnicate.exists); // prints false
console.log(frobnicate.isNonstandard); // prints 'Custom'

const tomohawk = Dex.species.get('tomohawk');
console.log(tomohawk.exists); // prints true
console.log(tomohawk.isNonstandard); // prints 'CAP'

const pikachu = Dex.species.get('pikachu');
console.log(pikachu.exists); // prints true
console.log(pikachu.isNonstandard); // prints null
```


`Dex.mod`
---------

`Dex.mod(modName: string): ModdedDex`

* `Dex` by itself is an object for getting latest-generation information. To get information about another generation, replace `Dex` with `Dex.mod(modName)`. For instance, to get information about Pokémon Yellow, replace `Dex` with `Dex.mod('gen1')`.

  In the rest of this page, `dex` will refer to any instance of `ModdedDex`, either `Dex` or the return value of `Dex.mod`.

  ```js
  const {Dex} = require('pokemon-showdown');

  const tackle = Dex.mod('gen1').moves.get('Tackle');

  console.log(tackle.basePower); // prints 35
  ```


Return values
-------------

Return values have not been stabilized yet. Use the TypeScript definitions if you'd like, but you should probably pin a specific dependency version.


`dex: ModdedDex`
----------------

Remember: `dex` refers to either `Dex` or `Dex.mod(modID)`.

`dex.moves.get(moveName: string): Move`

* Gets information about a move. `moveName` can have any capitalization or whitespace. [This includes nonstandard information](#nonstandard-information).

`dex.moves.all(): Move[]`

* Lists all moves we have information for. [This includes nonstandard information](#nonstandard-information).

`dex.species.get(speciesName: string): Species`

* Gets information about a Pokémon species or forme. `speciesName` can have any capitalization or whitespace. [This includes nonstandard information](#nonstandard-information).

  Forme information is documented in [data/FORMES.md](./../data/FORMES.md)

`dex.species.all(): Species[]`

* Lists all Pokémon species we have information for. [This includes nonstandard information](#nonstandard-information).

`dex.abilities.get(abilitysName: string): Ability`

* Gets information about an ability. `abilitysName` can have any capitalization or whitespace. [This includes nonstandard information](#nonstandard-information).

`dex.abilities.all(): Ability[]`

* Lists all abilities we have information for. [This includes nonstandard information](#nonstandard-information).

`dex.items.get(itemName: string): Item`

* Gets information about an item. `itemName` can have any capitalization or whitespace. [This includes nonstandard information](#nonstandard-information).

`dex.items.all(): Item[]`

* Lists all items we have information for. [This includes nonstandard information](#nonstandard-information).

