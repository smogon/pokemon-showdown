# RPG Battle System - Moves Implementation

## Quick Reference

This README provides a quick reference for the moves implementation in the RPG system.

For detailed analysis, see: `/RPG_MOVES_ANALYSIS.md` in the root directory.

---

## Files Overview

| File | Purpose | Lines |
|------|---------|-------|
| `battle-moves.ts` | Move execution and special mechanics | ~1,302 |
| `CUSTOM_MOVES.ts` | Custom move definitions and templates | ~368 |
| `battle-engine.ts` | Damage calculation engine | - |
| `battle-flow.ts` | Battle turn flow and move selection | - |
| `battle-eot.ts` | End-of-turn effects processing | - |
| `battle-core.ts` | Core battle initialization | - |
| `battle-shared.ts` | Shared battle utilities | - |
| `utils.ts` | Utility functions including getMove() | ~283 |
| `data.ts` | Static game data | - |
| `interface.ts` | Type definitions | - |

---

## Move Support Summary

### Total Moves Available
- **2,522** moves from Pokemon Showdown Dex
- **15** custom moves defined in CUSTOM_MOVES.ts
- **75** moves with specific implementations
- **~2,490** total unique move types supported

### Move Categories
- **Physical**: 425 moves (44.1%)
- **Special**: 261 moves (27.1%)
- **Status**: 271 moves (28.1%)

### Move Types (Pokemon Types)
All 18 Pokemon types supported:
- Normal (202), Psychic (80), Grass (63), Fighting (58), Water (54), Dark (54), Electric (51), Fire (51), Steel (40), Poison (37), Ghost (36), Bug (35), Fairy (34), Ice (34), Dragon (33), Flying (32), Ground (32), Rock (28)

---

## Implemented Move Categories

### 1. Damage Moves
- ✅ Standard Physical/Special attacks
- ✅ Variable base power (20+ moves)
- ✅ Multi-hit moves (31+ moves)
- ✅ Charging/two-turn moves (10+ moves)
- ✅ OHKO moves (4 moves)
- ✅ Counter/reactive moves (2 moves)

### 2. Status & Effects
- ✅ Major status (PSN, BRN, PAR, SLP, FRZ)
- ✅ Volatile status (15+ types)
- ✅ Stat changes (176+ moves)
- ✅ Healing moves (43+ moves)

### 3. Field Effects
- ✅ Weather (4 types: sun, rain, sand, hail)
- ✅ Terrain (4 types: electric, grassy, misty, psychic)
- ✅ Pseudo-weather (8 types: rooms, gravity, etc.)
- ✅ Entry hazards (4 types: spikes, toxic spikes, stealth rock, sticky web)
- ✅ Screens (3 types: reflect, light screen, aurora veil)

### 4. Special Mechanics
- ✅ HP drain (13 moves)
- ✅ Recoil (12 moves)
- ✅ Item-based (5 moves)
- ✅ Protection (5 types)
- ✅ Unique mechanics (21+ moves)

---

## Key Functions

### `getMove(moveId: string)` - utils.ts
Primary function for retrieving move data:
1. Checks custom moves first
2. Falls back to Dex.moves.get()
3. Returns move object with all properties

### Move Handlers - battle-moves.ts

#### Damage Calculation
- `getDamageBasePower()` - Calculate effective base power
- `handleDamagingMovePreamble()` - Pre-damage checks and effects

#### Status/Effect Handlers
- `handleGenericBoostMove()` - Stat stage changes
- `handleGenericStatusInflictMove()` - Major status (burn, paralyze, etc.)
- `handleGenericVolatileMove()` - Volatile status (confusion, taunt, etc.)
- `handleGenericHealMove()` - Self-healing moves

#### Field Effect Handlers
- `handleGenericFieldMove()` - Weather, terrain, pseudo-weather
- `handleGenericSideMove()` - Hazards, screens, protective moves

#### Special Handlers
- `handleSpecificStatusMove()` - 21+ moves with unique mechanics
- `handleChargingMove()` - Two-turn charging moves

---

## Custom Moves

### Adding a Custom Move

1. Add to `CUSTOM_MOVES` object in `CUSTOM_MOVES.ts`:

```typescript
'yourmove': {
    id: 'yourmove',
    name: 'Your Move',
    basePower: 80,
    category: 'Physical',
    type: 'Normal',
    accuracy: 100,
    pp: 15,
    priority: 0,
    target: 'normal',
    flags: { protect: 1, mirror: 1, contact: 1 },
    // Add special properties as needed
},
```

2. If special handling needed, add case to `handleSpecificStatusMove()` in `battle-moves.ts`

3. Custom moves automatically integrate with the battle system via `getMove()`

### Custom Move Examples

See `CUSTOM_MOVES.ts` for 15 example custom moves demonstrating:
- Variable power moves
- Multi-hit moves
- Priority moves
- Drain/recoil moves
- Status moves
- Weather/terrain moves
- Entry hazards
- OHKO moves
- Charging moves

---

## Move Properties

### Core Properties (from Dex)
```typescript
{
    id: string,              // Move identifier
    name: string,            // Display name
    type: string,            // Pokemon type
    category: 'Physical' | 'Special' | 'Status',
    basePower: number,       // Base damage
    accuracy: number | true, // Hit chance
    pp: number,              // Power points
    priority: number,        // Speed priority
    target: string,          // Target type
    flags: object,           // Move flags
}
```

### Special Properties
```typescript
{
    boosts?: object,         // Stat changes
    status?: string,         // Major status
    volatileStatus?: string, // Volatile status
    secondary?: object,      // Secondary effect
    drain?: [num, num],      // HP drain ratio
    recoil?: [num, num],     // Recoil ratio
    heal?: [num, num],       // Heal ratio
    multihit?: number | [num, num],
    weather?: string,
    terrain?: string,
    pseudoWeather?: string,
    sideCondition?: string,
    ohko?: string,
    selfdestruct?: string,
    selfSwitch?: boolean,
}
```

---

## Move Execution Flow

```
1. Move Selection (battle-flow.ts)
   ↓
2. Validation (PP, disabled, taunt check)
   ↓
3. Accuracy Check (stat stages applied)
   ↓
4. Move Execution (battle-moves.ts)
   ├─ Preamble checks
   ├─ Base power calculation
   ├─ Damage calculation
   ├─ Status/effect application
   └─ Secondary effects
   ↓
5. End of Turn (battle-eot.ts)
   └─ Passive effects (weather, status, etc.)
```

---

## Integration with Dex

### How It Works
1. All 2,522 Dex moves are accessible via `Dex.moves.get()`
2. Custom moves override Dex moves if same ID exists
3. Move handlers check for special cases, otherwise use generic logic
4. Generic handlers support most moves automatically

### Dex Properties Used
- Move stats (power, accuracy, PP, type, category)
- Flags (contact, protect, charge, sound, heal, etc.)
- Special properties (boosts, status, drain, recoil, etc.)
- Target information
- Priority information

### Extensibility
- Add custom moves without modifying Dex
- Add special handling for complex mechanics
- Generic handlers cover most cases
- Clean separation of concerns

---

## Move Type Examples

### Variable Base Power
- **reversal/flail**: Power based on user's HP (20-200)
- **gyroball**: Power based on speed difference (1-150)
- **grassknot/lowkick**: Power based on target weight (20-120)
- **eruption/waterspout**: Power based on user's HP (1-150)

### Charging Moves
- **solarbeam**: Charges turn 1, attacks turn 2 (instant in sun)
- **fly/dig/dive**: User becomes semi-invulnerable while charging
- **shadowforce/phantomforce**: Bypasses protection while charging

### Status Moves
- **thunderwave**: Paralyzes target (Electric types immune)
- **willowisp**: Burns target (Fire types immune)
- **toxic**: Badly poisons target (Poison/Steel immune)
- **sleeppowder**: Puts target to sleep (Grass types, Insomnia immune)

### Field Effects
- **stealthrock**: Entry hazard, damages based on Rock weakness
- **reflect**: Halves Physical damage for 5 turns (8 with Light Clay)
- **trickroom**: Reverses speed order for 5 turns
- **electricterrain**: Boosts Electric moves, prevents sleep for 5 turns

---

## Testing Moves

### Testing Individual Moves
1. Use the RPG battle commands to start a battle
2. Select moves to test their functionality
3. Check battle log for proper execution
4. Verify damage calculations, status effects, field effects

### Testing Custom Moves
1. Add custom move to `CUSTOM_MOVES.ts`
2. Add to a Pokemon's learnset in `MANUAL_LEARNSETS.ts`
3. Start battle and use the move
4. Verify it works as expected

### Common Issues
- **Move not found**: Check spelling of move ID
- **Wrong damage**: Check base power, type effectiveness, stat stages
- **Status not applying**: Check type immunities, abilities, terrain
- **Special effect not working**: May need custom implementation

---

## Future Enhancements

Potential areas for expansion:
- Z-Moves (Gen 7 mechanics)
- Max Moves (Gen 8 Dynamax)
- Move Tutors
- Move Deleter/Relearner
- PP restoration mechanics
- Move power-up items (Gems, Plates, type items)
- Additional custom moves
- More complex move interactions

---

## Related Documentation

- **Full Analysis**: `/RPG_MOVES_ANALYSIS.md` - Comprehensive move analysis
- **Custom Moves Guide**: `/CUSTOM_MOVES_GUIDE.md` - Guide for creating custom moves
- **Battle System**: See other files in this directory for battle mechanics
- **Dex Documentation**: See `/data/moves.ts` for all available Dex moves

---

**Last Updated**: November 6, 2025
**Version**: 1.0
