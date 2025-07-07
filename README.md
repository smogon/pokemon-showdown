# A PokeBedrock Fork of Pokémon Showdown

This library has been gutted, and changed a bit. The main things that are changed have to do with usability
with Minecraft Bedrocks Script API. For example use of `set` as a property name does not work in ESM format, breaking
most of Pokemon Showdown. Because of this all reference to `Pokemon.set` has been changed to `Pokemon.pokemonSet`.

## Current Changes:

### Core System Changes:
- **Reworked Config**: Modified to not use reading/writing to files as script api doesn't support that.
- **Better Type Safety**: Added more specific type definitions throughout the codebase.
- **ESM Compatibility**: Fixed compatibility issues with Minecraft Bedrock's Script API.

### Pokemon Data & Features:
- **UUID System**: Added a whole UUID system which allows pokemon to be searched easily by interpreter.
- **Cosmetic Forms**: Added extensive cosmetic forme support for many Pokemon including:
  - Pikachu variants (Witch, Captain, Santa, Detective, Doll)
  - Halloween forms (Sandshrew, Sandslash, Gastly, Haunter, Gengar, Celebi, Darkrai, Trubbish, Garbodor, Golett, Golurk, Gible, Gabite, Garchomp, Zoroark)
  - Christmas forms (Mew, Gardevoir, Gallade, Comfey, Snorlax)
  - Seasonal forms (Torterra-StPatrick, Spheal-Watermelon)
  - Spinda pattern variants
  - Vivillon Valentine pattern

### Evolution System Enhancements:
- **Enhanced Evolution Properties**: Added better properties to describe evolutions in pokedex:
  - `evoTime`: Specifies time of day for evolution (day/night/evening)
  - `evoGender`: Required gender for evolution
  - `evoPartySpecies`: Required species in party for evolution
  - `evoTradeSpecies`: Required trade partner species
  - `evoPartyType`: Required type in party for evolution
  - `evoKnownMoveType`: Required move type for evolution
  - `evoMinAffection`: Minimum affection required for evolution
  - `evoRelativePhysicalStats`: Stat comparison requirements for evolution
  - `evoStatusEffect`: Required status condition for evolution
  - `evoBiomes`: Required biomes for evolution
  - `evoPriority`: Evolution priority system
  - `evoType`: Enhanced evolution type system
  - `changeEvent`: Event that triggers forme changes

### Battle System:
- **Bag Item System**: Added comprehensive bag items with actions for:
  - Healing items (Potion, Super Potion, Hyper Potion, Max Potion, Full Restore)
  - Revival items (Revive, Max Revive)
  - Status cure items (Pecha Berry, Cheri Berry, etc.)
  - PP restoration (Leppa Berry with move-specific targeting)
  - Stat-boosting berries (Sitrus Berry, Oran Berry, etc.)
- **Revive System**: Added `revive()` function for Pokemon to handle revival mechanics.
- **Enhanced Heal Messages**: Added `DETAILS` to `-heal` instruction so we can read the pokemon being healed.
- **Critical Hit Enhancement**: Added source parameter to `-crit` messages for better tracking.

### Protocol & Communication:
- **New Instructions**: Added simulator protocol instructions:
  - `bag-item`: For using bag items on Pokemon
  - `used-ball`: For tracking ball usage
  - `forceforme`: For forcing Pokemon forme changes/evolutions
- **Enhanced Details**: Send `detailschange` after mega evolution so it will look good.
- **Kill Tracking**: Added `-killed` instruction to send messages when a pokemon is killed.

### Move & Battle Mechanics:
- **PP System**: Enhanced PP tracking with current/max PP support from movesInfo.
- **Move Targeting**: Better type safety for move targets.
- **Status Effects**: Enhanced status effect handling for bag items and berries.

### Technical Improvements:
- **Type Definitions**: Improved TypeScript definitions throughout the codebase.
- **Const Assertions**: Added `as const` to data tables for better type inference.
- **Error Handling**: Enhanced error handling for bag items and forme changes.
