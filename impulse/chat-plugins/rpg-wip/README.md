# Pokemon RPG Plugin

A comprehensive RPG system for Pokemon Showdown featuring wild encounters, trainer battles, item management, and more.

## Module Structure

The codebase is organized into focused, maintainable modules:

### Core Modules

#### `types.ts`
Type definitions for the entire RPG system.
- **RPGPokemon**: Pokemon data structure with stats, moves, IVs, EVs
- **BattleState**: Complete battle state including doubles support
- **ActivePokemonSlot**: In-battle Pokemon with volatile status conditions
- **PlayerData**: Player profile, party, PC, inventory
- **TrainerSpec**: Trainer battle configuration
- **EncounterZone**: Wild encounter area definitions

#### `constants.ts`
Static configuration data and game balance.
- **ITEMS_DATABASE**: 100+ items with descriptions and categories
- **TYPE_CHART**: Complete type effectiveness chart (18 types)
- **NATURES**: 25 natures with stat modifications
- **ENCOUNTER_ZONES**: Wild Pokemon areas with level ranges
- **TRAINER_DATABASE**: Trainer battles with parties and dialogue
- **SHOP_INVENTORY**: Available items and prices

#### `utils.ts`
Core utility functions used throughout the system.
- **Pokemon Creation**: `createPokemon()` with automatic learnset
- **Stat Calculation**: `calculateStats()` with IV/EV/nature support
- **Experience**: `calculateTotalExpForLevel()` for all growth rates
- **Inventory Management**: Add/remove items, PC storage
- **Move Loading**: Integration with custom moves and Dex

#### `rpg-refactor.ts` (Main File)
Command handlers and game loop coordination.
- All `/rpg` commands
- Battle action routing
- UI generation coordination
- State management

### External Data Files

- **MANUAL_CATCH_RATES.ts**: Custom catch rates for Pokemon
- **MANUAL_BASE_EXP.ts**: Custom experience yields
- **MANUAL_EV_YIELDS.ts**: Custom EV yields
- **MANUAL_EVOLUTIONS.ts**: Custom evolution chains
- **MANUAL_LEARNSETS.ts**: Custom move learnsets
- **CUSTOM_MOVES.ts**: Custom move implementations

## Features

### Battle System
- **Single Battles**: 1v1 wild encounters and trainer battles
- **Double Battles**: 2v2 battles with targeting and spread moves
- **Advanced Mechanics**: 
  - Weather, terrain, trick room
  - Entry hazards, screens, guards
  - Pivot moves (U-turn, Volt Switch, Baton Pass)
  - Delayed moves (Future Sight, Doom Desire)
  - Complex status conditions and volatile effects

### Pokemon Management
- **Party System**: Up to 6 Pokemon in active party
- **PC Storage**: Unlimited Pokemon storage
- **Stats**: Full IV/EV system with nature effects
- **Moves**: 4-move limit with PP management
- **Items**: Held items with battle effects

### Progression
- **Experience**: Multiple growth rates (Fast, Slow, Erratic, etc.)
- **Leveling**: Automatic stat recalculation
- **Move Learning**: Level-up moves with replacement UI
- **Evolution**: Support for level-based evolution

### Items & Economy
- **Pokeballs**: 14 different ball types with special effects
- **Medicine**: Potions, full heals, status cures
- **Berries**: 30+ berries with various effects
- **Held Items**: 40+ items affecting battles
- **Shop System**: Buy/sell items with money management

## Usage

### Player Commands

```
/rpg start              - Begin your adventure
/rpg menu               - Main menu
/rpg profile            - View your trainer profile
/rpg party              - View your Pokemon party
/rpg summary [id]       - View detailed Pokemon info
/rpg pc                 - Access Pokemon storage
/rpg items              - View your inventory
/rpg shop               - Visit the Poke Mart
/rpg explore            - Explore current area
/rpg heal               - Heal at Pokemon Center
```

### Battle Commands

```
/rpg wildpokemon [zone] - Start wild encounter
/rpg challenge [trainer]- Challenge a trainer
/rpg battleaction move  - Use a move in battle
/rpg battleaction switch- Switch Pokemon
/rpg battleaction catch - Attempt to catch
/rpg battleaction run   - Flee from battle
```

### Item Management

```
/rpg giveitem [id] [item] - Give held item to Pokemon
/rpg takeitem [id]        - Take held item from Pokemon
/rpg buy [item] [qty]     - Purchase items
/rpg nickname [id], [name]- Rename Pokemon
```

## Technical Details

### Dependencies
- Pokemon Showdown Dex (species, moves, abilities)
- Manual data files for customization
- Custom move system for RPG-specific mechanics

### Data Structures

#### Pokemon Stats
- **IVs**: 0-31 per stat (random on creation)
- **EVs**: 0-252 per stat (gained from battles)
- **Nature**: +10%/-10% to two stats
- **Level**: 1-100 with experience thresholds

#### Battle State
- Turn counter and battle type (wild/trainer)
- Player and opponent slots (up to 2 each)
- Field effects (weather, terrain, rooms)
- Hazards and screens per side
- Pending actions and pivots

### Type System
Complete TypeScript types for:
- Type safety across all modules
- IntelliSense support
- Compile-time error checking
- Self-documenting code

## Extending the System

### Adding New Items
1. Add entry to `ITEMS_DATABASE` in `constants.ts`
2. Add price to `ITEM_PRICES`
3. Add to appropriate `SHOP_INVENTORY` category
4. Implement effects in battle logic if needed

### Adding New Trainers
1. Create entry in `TRAINER_DATABASE`
2. Specify party Pokemon with levels and moves
3. Add dialogue for start/win/lose
4. Set prize money and battle type

### Adding New Zones
1. Add entry to `ENCOUNTER_ZONES`
2. Specify wild Pokemon species
3. Set level range
4. Choose single or double battle type

### Custom Moves
1. Define move in `CUSTOM_MOVES.ts`
2. Implement logic in move handler
3. Add to manual learnsets if needed

## Code Quality

### Principles
- **Single Responsibility**: Each module has one clear purpose
- **DRY**: Shared logic extracted to utilities
- **Type Safety**: Full TypeScript coverage
- **Testability**: Functions designed for unit testing

### File Organization
- Small, focused modules (~200-400 lines)
- Clear separation of concerns
- Minimal dependencies between modules
- Easy to navigate and understand

### Performance
- Efficient damage calculation
- Minimal object allocations in battle loop
- Caching of calculated values where appropriate
- Fast UI generation with template strings

## Future Enhancements

### Planned Features
- More trainer battles and gym leaders
- Breeding system with egg moves
- Online battles between players
- Trading system
- Achievement system
- Quest system
- Mini-games

### Technical Improvements
- Comprehensive unit tests
- Integration tests for battles
- Performance profiling
- Database persistence
- Save/load system

## Contributing

When modifying this code:
1. Maintain the module structure
2. Add TypeScript types for new features
3. Update constants for game balance
4. Test battle mechanics thoroughly
5. Document complex logic
6. Follow existing code style

## License

Part of the Pokemon Showdown impulse fork.
