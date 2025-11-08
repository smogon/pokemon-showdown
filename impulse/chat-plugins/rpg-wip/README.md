# RPG System

A comprehensive Pokemon-style RPG system for Pokemon Showdown.

## Overview

This RPG system recreates the classic Pokemon experience with:
- 8 Gym Leaders with themed teams
- Elite Four challenge
- Champion battle
- Wild Pokemon encounters
- Trainer battles
- Story progression system
- Item management
- PC storage
- Pokemon evolution and leveling

## Quick Start

1. Start your journey: `/rpg start`
2. Choose your starter Pokemon
3. Explore locations, battle trainers, collect badges
4. Challenge the Elite Four and become Champion!

## Documentation

For complete implementation details and a step-by-step guide to creating a Pokemon Crystal-style story, see:

**[POKEMON_CRYSTAL_STORY_GUIDE.md](./POKEMON_CRYSTAL_STORY_GUIDE.md)**

This comprehensive guide includes:
- System architecture and file structure
- Complete story progression flow
- How to create locations, trainers, and events
- Battle system integration
- Advanced features and customization
- Command reference
- Testing and debugging guide

## File Structure

```
rpg-wip/
├── README.md                           - This file
├── POKEMON_CRYSTAL_STORY_GUIDE.md     - Complete implementation guide
├── core.ts                            - Core game logic
├── commands.ts                        - User command handlers
├── interface.ts                       - Type definitions
├── data.ts                            - Static game data
├── locations.ts                       - Location definitions
├── trainers.ts                        - Trainer definitions
├── npcs.ts                            - NPC dialogue
├── story-events.ts                    - Story event definitions
├── scripted-events.ts                 - Event handling logic
├── battle-*.ts                        - Battle system components
├── items.ts                           - Item database
├── shop.ts                            - Shop system
├── abilities.ts                       - Pokemon abilities
├── utils.ts                           - Utility functions
├── html.ts                            - UI generation
└── MANUAL_*.ts                        - Manual data overrides
```

## Key Features

### Battle System
- Single and double battles
- Full move mechanics with 700+ moves
- Status conditions and stat stages
- Weather and terrain effects
- Abilities and held items
- Comprehensive type chart

### Story System
- Location-based progression
- Badge-gated areas
- Story flags for event tracking
- Scripted encounters and events
- NPC interactions
- Dialogue system

### Pokemon Management
- Party system (up to 6 Pokemon)
- PC storage (unlimited)
- Evolution system
- Move learning and forgetting
- IV and EV system
- Nature system
- Shiny Pokemon

### Items
- Pokeballs for catching Pokemon
- Healing items (Potions, Full Restores, etc.)
- Status healers
- Vitamins for EV training
- Evolution items
- Held items for battle
- TMs and HMs

### Economy
- Money system
- Tiered shops (8 tiers)
- Battle rewards
- Item buying and selling

## Getting Started as a Developer

1. **Read the full guide**: [POKEMON_CRYSTAL_STORY_GUIDE.md](./POKEMON_CRYSTAL_STORY_GUIDE.md)
2. **Understand the architecture**: Review the file structure and data flow
3. **Study existing content**: Look at locations.ts, trainers.ts, and npcs.ts
4. **Create your content**: Add new locations, trainers, and events
5. **Test thoroughly**: Use the debugging commands to verify

## Example: Creating a New Location

```typescript
// In locations.ts
'mynewcity': {
    id: 'mynewcity',
    name: 'My New City',
    type: 'city',
    description: 'A bustling city with many opportunities.',
    connectedLocations: [
        { id: 'route1', name: 'Route 1' },
        { id: 'route2', name: 'Route 2', requiredBadge: 'My Badge' }
    ],
    buildings: [
        {
            id: 'mynewcity_pokecenter',
            name: 'Pokemon Center',
            type: 'pokecenter',
            npcs: ['nursejoymycity']
        }
    ],
    encounterZones: ['mynewcity_grass']
}
```

## Example: Creating a Gym Leader

```typescript
// In trainers.ts
'gymnewleader': {
    name: 'Gym Leader Name',
    money: 4200,
    party: [
        { 
            species: 'pokemon1', 
            level: 30,
            moves: ['move1', 'move2', 'move3', 'move4']
        },
        { 
            species: 'pokemon2', 
            level: 35,
            moves: ['move1', 'move2', 'move3', 'move4'],
            item: 'sitrusberry'
        }
    ],
    dialogue: {
        start: "Challenge accepted!",
        win: "You've earned the badge!",
        lose: "Better luck next time!"
    }
}
```

## Commands

### Player Commands
- `/rpg start` - Begin your journey
- `/rpg menu` - View main menu
- `/rpg battle` - Start a wild battle
- `/rpg party` - View your party
- `/rpg items` - View inventory
- `/rpg shop` - Visit the shop
- `/rpg heal` - Heal at Pokemon Center
- `/rpg explore` - View current location
- `/rpg profile` - View trainer profile

For a complete command reference, see the [full guide](./POKEMON_CRYSTAL_STORY_GUIDE.md#command-reference).

## Testing

Run the RPG test suite:
```bash
npm test -- test/rpg-suite.js
```

## Contributing

When adding new content:
1. Follow existing patterns and conventions
2. Test thoroughly
3. Update documentation as needed
4. Ensure proper TypeScript typing
5. Maintain backward compatibility

## Support

For questions or issues:
1. Check the [comprehensive guide](./POKEMON_CRYSTAL_STORY_GUIDE.md)
2. Review existing implementations in the codebase
3. Open an issue in the repository

## Credits

This RPG system is part of the Pokemon Showdown Impulse fork.

## License

See the main repository LICENSE file.
