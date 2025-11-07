# Location System Refactor - Complete Summary

## Overview
This refactor transforms the RPG location system to exactly match Pokemon games, with support for towns having buildings, multiple route connections, scripted events, and special NPCs.

## What Changed

### Before
- Simple location objects with boolean flags (hasPokeCenter, hasPokeMart, hasGym)
- No building system
- No scripted events
- Basic NPC system
- Routes connected locations but had limited metadata

### After
- **Full building system** - Towns/cities have actual explorable buildings
- **Scripted event system** - Events trigger automatically when entering locations
- **Enhanced NPC system** - Special NPCs with services (Move Deleter, Name Rater, Move Tutors, Traders)
- **Rich location metadata** - Weather, music, type classification
- **Better route structure** - Multiple connections with requirements

## New Systems

### 1. Buildings
Towns and cities now have buildings you can enter:
- Pokemon Center
- Poke Mart / Department Store
- Gym
- Houses
- Labs
- Museums
- Game Corner

Each building has:
- Description
- NPCs inside
- Type-specific properties (gym leader, shop tier)
- Access control (flags/badges)

**Command:** `/rpg building <id>` to enter

### 2. Scripted Events
Events automatically trigger when entering a location based on conditions:

**Event Types:**
- `dialogue` - Show text
- `item` - Give items
- `pokemon` - Gift Pokemon
- `trainer` - Force trainer battle
- `wildbattle` - Scripted wild encounter

**Conditions:**
- `triggerOnce` - One-time vs repeatable
- `requiredBadgeCount` - Min badges needed
- `maxBadgeCount` - Max badges allowed
- `requiredFlag` - Must have flag
- `preventIfFlag` - Won't trigger if flag present
- `setFlag` - Set flag after completion

**Examples:**
```typescript
// First visit dialogue
{
  id: 'welcome',
  triggerOnce: true,
  type: 'dialogue',
  dialogue: 'Welcome to Route 1!',
}

// Return with badge - rival battle
{
  id: 'rival_return',
  triggerOnce: true,
  requiredBadgeCount: 1,
  type: 'trainer',
  trainerId: 'rival1',
  dialogue: 'You got stronger! Let\'s battle!',
}

// Legendary encounter
{
  id: 'moltres',
  triggerOnce: true,
  requiredBadgeCount: 8,
  type: 'wildbattle',
  pokemon: {
    species: 'moltres',
    level: 50,
    moves: ['fireblast', 'airslash', 'heatwave', 'roost'],
  },
}
```

### 3. Special NPCs
New NPC types with special functions:

- **Move Deleter** - Remove unwanted moves
- **Name Rater** - Rename Pokemon
- **Move Tutor** - Teach moves for money
- **Trade NPCs** - In-game Pokemon trades

NPCs can have complex actions:
- Give items/Pokemon
- Exchange items
- Trade Pokemon
- Teach moves

### 4. Weather System
Locations can have permanent weather:
- sun, rain, sandstorm, hail, fog
- Ready for battle integration

## Files Changed

### Core Files Modified
1. **interface.ts**
   - Added `Location` interface
   - Added `Building` interface
   - Added `ScriptedEvent` interface
   - Enhanced `NPCData` and `NPCAction`
   - Added weather and music support

2. **data.ts**
   - Completely rewrote `LOCATIONS` with new structure
   - Added 16 locations with buildings
   - Added scripted events to multiple locations
   - Added special NPCs (Move Deleter, Name Rater, Move Tutors, Traders)
   - Added example scripted wild encounters

3. **commands.ts**
   - Updated `explore` command for building system
   - Added `building` command to enter buildings
   - Updated `travel` command with scripted event handling
   - Added `scriptedbattle` command for scripted wild encounters
   - Updated `heal` command for new structure
   - Updated `npc` and `npcaction` commands for buildings

### Documentation Added
1. **LOCATION_SYSTEM.md** - Complete guide to location system
2. **MISSING_FEATURES.md** - Analysis of Pokemon features
3. **REFACTOR_SUMMARY.md** - This file

## Examples Added

### Route 1 - Progressive Events
- First visit: Welcome dialogue (badge 0)
- Return with badge: Rival battle (badge 1+)
- After rival: Item gift

### Route 2 - Repeatable Event
- Warning message (repeats every visit)
- Rival encounter (one-time)
- Gift after rival (one-time, requires flag)

### Cerulean City - Red Gyarados
- Guaranteed shiny scripted encounter
- Triggers with 2+ badges

### Route 7 - Snorlax
- Blocking Pokemon encounter
- Triggers with 7+ badges

### Victory Road - Moltres
- Legendary encounter
- Triggers with 8 badges

## Backwards Compatibility

### Breaking Changes
- Old `hasPokeCenter`, `hasPokeMart`, `hasGym` properties removed
- Now use `buildings` array

### Migration
All existing locations were updated to use the new structure. The `heal` command checks for Pokemon Center buildings dynamically.

## Testing

### Validation Tests
Created test scripts to verify:
- ✅ Buildings exist in locations
- ✅ Scripted events are properly configured
- ✅ One-time events have `triggerOnce`
- ✅ Conditional events have proper requirements
- ✅ Repeatable events work

### Manual Testing Needed
- Enter buildings and verify NPCs
- Trigger scripted events at different badge counts
- Test scripted wild battles
- Verify weather display (when battle system integrates)

## Performance Considerations

### Efficient Design
- Events checked only when traveling (not constantly)
- Flag system prevents re-triggering one-time events
- PC temporarily stores scripted wild Pokemon (cleaned up after battle)

### Scalability
- Easy to add new locations
- Easy to add new buildings
- Easy to add new scripted events
- No performance impact on existing systems

## Future Enhancements

### Ready to Implement
1. **Badge Obedience** - Pokemon disobey if over-leveled
2. **Fishing** - Special water encounters
3. **Fossil Revival** - Lab NPC revives fossils
4. **HM Field Moves** - Surf, Fly, Cut for access

### Requires More Work
5. Day Care / Breeding
6. Battle Facilities
7. Multi-floor buildings
8. Time-based events
9. Safari Zone special mechanics

See `MISSING_FEATURES.md` for full analysis.

## Commands

### For Players
- `/rpg explore` - View current location
- `/rpg building <id>` - Enter a building
- `/rpg travel` - View connected locations
- `/rpg travel <location>` - Travel to location
- `/rpg npc` - Talk to NPCs
- `/rpg npc <id>` - Talk to specific NPC
- `/rpg scriptedbattle <id>` - Battle scripted wild Pokemon

### Location Navigation
1. Player uses `/rpg travel <location>`
2. System checks if scripted events should trigger
3. If event triggers, shows event screen
4. Player can then explore or continue

## Conclusion

The location system refactor is **complete and feature-rich**:

✅ **Buildings** - Full Pokemon Center, Mart, Gym system
✅ **Scripted Events** - Powerful conditional event system
✅ **Special NPCs** - Move services, trading
✅ **Wild Encounters** - Both random and scripted
✅ **Weather** - Ready for battle integration
✅ **Documentation** - Comprehensive guides

This matches Pokemon games in structure and feel while being extensible for future features.
