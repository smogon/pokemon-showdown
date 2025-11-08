# RPG System - Work in Progress

A comprehensive Pokemon-style RPG system for Impulse with location-based gameplay, NPC interactions, trainer battles, and dynamic events.

## 📁 Repository Structure

### Core Implementation Files
- **`commands.ts`** - Main command handlers for RPG gameplay
- **`core.ts`** - Core RPG data structures and utilities
- **`data.ts`** - Game data (NPCs, locations, trainers, items)
- **`interface.ts`** - TypeScript type definitions
- **`utils.ts`** - Helper functions

### Battle System
- **`battle-core.ts`** - Core battle mechanics
- **`battle-engine.ts`** - Battle engine logic
- **`battle-flow.ts`** - Battle flow control
- **`battle-moves.ts`** - Move execution
- **`battle-eot.ts`** - End-of-turn effects (including weather restoration)
- **`battle-shared.ts`** - Shared battle utilities

### Game Features
- **`npcs.ts`** - NPC definitions
- **`npc-actions.ts`** - NPC action handlers (34+ handlers)
- **`trainers.ts`** - Trainer battle definitions
- **`locations.ts`** - Location data
- **`items.ts`** - Item database
- **`abilities.ts`** - Pokemon abilities
- **`scripted-events.ts`** - Event handlers (58+ handlers)
- **`story-events.ts`** - Story progression
- **`shop.ts`** - Shop system

### UI and Display
- **`html.ts`** - HTML generation for UI
- **`interface.ts`** - Type definitions for all systems

### Manual Data Files
- **`MANUAL_BASE_EXP.ts`** - Base experience values
- **`MANUAL_CATCH_RATES.ts`** - Catch rate data
- **`MANUAL_EVOLUTIONS.ts`** - Evolution chains
- **`MANUAL_EV_YIELDS.ts`** - EV yield data
- **`MANUAL_LEARNSETS.ts`** - Pokemon move learnsets
- **`CUSTOM_MOVES.ts`** - Custom move definitions

## 📖 Documentation

### Essential Documentation
1. **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Complete implementation overview, handler counts, and key features
2. **[INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)** - Step-by-step guide for integrating new handlers into commands
3. **[NEW_TYPES_DOCUMENTATION.md](NEW_TYPES_DOCUMENTATION.md)** - Complete reference for all 240+ types (NPCs, actions, events)
4. **[WEATHER_SYSTEM_DOCUMENTATION.md](WEATHER_SYSTEM_DOCUMENTATION.md)** - Location-based weather system with restoration
5. **[LOCATION_SYSTEM.md](LOCATION_SYSTEM.md)** - Location system architecture and design
6. **[MISSING_FEATURES.md](MISSING_FEATURES.md)** - Feature tracking and implementation status

### Quick Reference
- **Start Here**: Read `IMPLEMENTATION_SUMMARY.md` for overview
- **Adding Features**: Follow `INTEGRATION_GUIDE.md` 
- **Type Reference**: Check `NEW_TYPES_DOCUMENTATION.md`
- **Weather System**: See `WEATHER_SYSTEM_DOCUMENTATION.md`

## 🎮 Key Features

### Location System
- 15+ unique locations (towns, cities, routes, special areas)
- Building system (Pokemon Centers, Marts, Gyms, Labs, etc.)
- Conditional access (badges, story flags)
- Weather-based locations (sun, rain, sandstorm, hail)

### Battle System
- Wild Pokemon encounters with level scaling
- Trainer battles with AI
- 8 Gym Leaders + Elite Four + Champion
- Special legendary encounters
- Location-based weather (automatic application and restoration)
- Weather move/ability overrides

### NPC System
- 34+ NPC action types (giving items, trading, teaching moves, etc.)
- 42+ trainer class types (covering all Pokemon games)
- Service NPCs (Nurse Joy, Move Tutor, Name Rater, etc.)
- Special NPCs (fossil revival, daily rewards, battle requests, etc.)

### Event System
- 58+ scripted event types
- Conditional triggers (flags, badges, one-time events)
- Interactive events (cutscenes, choices, quizzes)
- Battle events (tournaments, boss battles, rival encounters)
- Natural events (weather changes, earthquakes, swarms)
- Special events (legendary awakenings, time warps)

### Progression System
- Badge collection (8 gyms)
- Story flags for progression
- Elite Four gauntlet
- Hall of Fame
- Post-game content

## 🚀 Getting Started

### For Players
Use the following commands:
- `/rpg start` - Begin your RPG adventure
- `/rpg travel <location>` - Travel to a new location
- `/rpg explore` - Trigger random encounters
- `/rpg npc <npc_id>` - Interact with NPCs
- `/rpg battle` - Challenge trainers
- `/rpg party` - View your Pokemon party
- `/rpg pc` - Access PC storage

### For Developers
1. Read `IMPLEMENTATION_SUMMARY.md` for system overview
2. Review `interface.ts` for type definitions
3. Check `INTEGRATION_GUIDE.md` for adding new handlers
4. See `NEW_TYPES_DOCUMENTATION.md` for available types
5. Test changes with existing implementations

## 🔧 Technical Details

### Handler Counts
- **NPC Actions**: 34+ handlers implemented
- **Scripted Events**: 58+ handlers implemented
- **Total Types**: 240+ type definitions
- **Trainer Classes**: 42+ types

### Weather System
- Automatic weather application from location
- Weather restoration when temporary weather expires
- Support for: sun, rain, sandstorm, hail (fog excluded)
- Integration with moves and abilities
- Permanent location weather (9999 turns)

### State Management
- Player flags (`storyFlags`) for progression
- Timestamp-based cooldowns
- Inventory management
- Party and PC storage
- Badge tracking

## 📦 Integration Status

### ✅ Fully Integrated
- Wild Pokemon encounters with weather
- Trainer battles with weather
- Scripted battles with weather
- Basic NPC actions (give item, give pokemon, exchange items, take item)
- Basic script events (dialogue, item, pokemon, wild battle, trainer)
- Move Deleter, Move Tutor, Name Rater, Trading
- Weather system (automatic application and restoration)

### ⚠️ Ready for Integration (Handlers Implemented)
- 30+ additional NPC action handlers
- 53+ additional scripted event handlers
- All handlers are production-ready
- Integration requires adding case statements in `commands.ts`

## 🎯 Development Priority

### High Priority
1. Weather system - ✅ **COMPLETE**
2. Badge obedience system - Handler logic can be added
3. Fishing mechanics - Handler ready, needs UI integration
4. Fossil revival - Handler ready, needs UI integration

### Medium Priority
5. HM field moves - Design required
6. Day Care/Breeding - Handler ready
7. Battle facilities - Handler ready
8. Safari Zone mechanics - Handler ready

### Low Priority
9. Time-based events - Complex system
10. Contest halls - Different game mode
11. Secret bases - UI intensive

## 🧪 Testing

### Manual Testing
- Travel between locations
- Battle wild Pokemon in different weather
- Challenge trainers
- Interact with NPCs
- Use weather moves (Rain Dance, Sunny Day, etc.)
- Verify weather restoration after temporary weather

### Automated Testing
- See `test/rpg-suite.js` for weather system tests
- All edge cases covered
- Build and lint passing

## 📝 Contributing

When adding new features:
1. Define types in `interface.ts`
2. Implement handlers in appropriate files
3. Add case statements in `commands.ts`
4. Update documentation
5. Add tests for new functionality
6. Follow existing patterns and conventions

## 🔗 Related Systems

- **Main Server**: Integration with Pokemon Showdown server
- **Battle Simulator**: Uses existing PS battle engine
- **Data**: Uses Pokemon Showdown Dex for species/moves/abilities
- **Chat Commands**: Accessible via chat interface

## 📄 License

Part of the Impulse project. See main repository for license details.

## 🤝 Support

For questions or issues:
1. Review documentation in this directory
2. Check existing implementations for examples
3. Refer to `INTEGRATION_GUIDE.md` for step-by-step help
4. See `MISSING_FEATURES.md` for current limitations

---

**Last Updated**: 2025-11-08  
**Status**: Active development, core systems complete, handlers ready for integration
