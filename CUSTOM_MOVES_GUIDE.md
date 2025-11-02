# Custom Moves System - Complete Guide

## Overview

The RPG system now supports **custom moves** in addition to the standard Pokemon Showdown Dex moves. Custom moves are defined in the same format as Dex moves, making them fully compatible with all existing battle mechanics.

**File Location:** `/impulse/chat-plugins/battletower-test/CUSTOM_MOVES.ts`

---

## How It Works

### 1. Move Resolution System

When the battle system requests a move (e.g., `getMove('thunderbolt')`), it follows this priority:

```
1. Check CUSTOM_MOVES first
   ↓ (if not found)
2. Fall back to Dex.moves.get()
   ↓
3. Return move data
```

This means **custom moves override Dex moves** if they have the same ID.

### 2. Integration Points

The custom moves system integrates at these key points:

```typescript
// rpg-refactor.ts line ~802
function getMove(moveId: string): any {
    if (isCustomMove(moveId)) {
        return { ...getCustomMove(moveId), exists: true };
    }
    return Dex.moves.get(moveId);
}
```

All 25+ locations that previously used `Dex.moves.get()` now use `getMove()`, automatically checking custom moves first.

---

## Adding Custom Moves

### Step 1: Open CUSTOM_MOVES.ts

Navigate to: `/impulse/chat-plugins/battletower-test/CUSTOM_MOVES.ts`

### Step 2: Add Your Move to the CUSTOM_MOVES Object

```typescript
export const CUSTOM_MOVES: Record<string, CustomMove> = {
    // ... existing moves ...
    
    'yourmove': {
        id: 'yourmove',              // Must match the key (lowercase, no spaces)
        name: 'Your Move',            // Display name
        basePower: 80,                // 0 for status moves
        category: 'Physical',         // Physical, Special, or Status
        type: 'Fire',                 // Pokemon type
        accuracy: 100,                // 1-100 or true (never misses)
        pp: 15,                       // Power Points
        priority: 0,                  // 0 = normal, +1 = faster, -1 = slower
        target: 'normal',             // See Target Options below
        flags: {                      // See Flag Options below
            protect: 1,
            mirror: 1,
            contact: 1,
        },
        // Optional properties below
        secondary: {                  // Secondary effects
            chance: 30,               // 30% chance
            volatileStatus: 'flinch',
        },
    },
};
```

### Step 3: Save and Restart Server

Custom moves are loaded when the plugin initializes. Restart the server to load new moves.

---

## Move Properties Reference

### Required Properties

| Property | Type | Description | Example |
|----------|------|-------------|---------|
| `id` | string | Unique identifier (lowercase, no spaces) | `'shadowstrike'` |
| `name` | string | Display name | `'Shadow Strike'` |
| `basePower` | number | Damage (0 for status moves) | `80` |
| `category` | string | Physical, Special, or Status | `'Physical'` |
| `type` | string | Pokemon type | `'Dark'` |
| `accuracy` | number\|true | Hit chance (1-100) or true (always hits) | `95` or `true` |
| `pp` | number | Power Points (max uses) | `15` |
| `priority` | number | Speed tier (-7 to +5) | `0` |
| `target` | string | Who the move targets | `'normal'` |
| `flags` | object | Move properties | `{ protect: 1 }` |

### Optional Properties

| Property | Type | Description | Example |
|----------|------|-------------|---------|
| `secondary` | object | Secondary effects with chance | See Secondary Effects |
| `boosts` | object | Stat changes | `{ atk: 2 }` |
| `status` | string | Inflicts status | `'brn'` |
| `volatileStatus` | string | Inflicts volatile status | `'confusion'` |
| `drain` | [number, number] | Heals based on damage | `[1, 2]` = 50% |
| `recoil` | [number, number] | Takes recoil damage | `[1, 4]` = 25% |
| `heal` | [number, number] | Heals user | `[1, 2]` = 50% HP |
| `multihit` | number\|array | Hits multiple times | `[2, 5]` = 2-5 hits |
| `weather` | string | Sets weather | `'rain'` |
| `terrain` | string | Sets terrain | `'electric'` |
| `pseudoWeather` | string | Sets room/field effect | `'trickroom'` |
| `sideCondition` | string | Sets entry hazard | `'spikes'` |
| `selfSwitch` | boolean\|string | Switches after move | `true` or `'copyvolatile'` |
| `selfdestruct` | string | Faints user | `'always'` or `'ifHit'` |
| `ohko` | string | One-hit KO | `'Normal'` |
| `breaksProtect` | boolean | Ignores Protect | `true` |
| `self` | object | Self-inflicted effects | `{ boosts: { def: -1 } }` |

---

## Target Options

| Target | Description | Doubles Compatible |
|--------|-------------|-------------------|
| `'normal'` | Single adjacent target | ✓ |
| `'any'` | Any single Pokemon | ✓ |
| `'self'` | User only | ✓ |
| `'allAdjacentFoes'` | Both adjacent opponents | ✓ |
| `'allAdjacent'` | All adjacent Pokemon | ✓ |
| `'scripted'` | All Pokemon but user (like Earthquake) | ✓ |
| `'ally'` | Single ally | ✓ |
| `'allySide'` | User's entire team | ✓ |
| `'foeSide'` | Opponent's entire team | ✓ |
| `'all'` | All Pokemon in battle | ✓ |
| `'randomNormal'` | Random adjacent foe | ✓ |

---

## Flag Options

Flags define special properties of moves:

| Flag | Description |
|------|-------------|
| `protect: 1` | Blocked by Protect/Detect |
| `mirror: 1` | Affected by Mirror Move |
| `contact: 1` | Makes contact (triggers Rocky Helmet, etc.) |
| `charge: 1` | Two-turn move (charges first turn) |
| `sound: 1` | Sound-based (blocked by Soundproof) |
| `powder: 1` | Powder move (doesn't affect Grass types) |
| `punch: 1` | Punch move (boosted by Iron Fist) |
| `bite: 1` | Bite move (boosted by Strong Jaw) |
| `heal: 1` | Healing move |
| `metronome: 1` | Can be called by Metronome |

---

## Examples

### Example 1: Basic Damaging Move

```typescript
'flameburst': {
    id: 'flameburst',
    name: 'Flame Burst',
    basePower: 85,
    category: 'Special',
    type: 'Fire',
    accuracy: 100,
    pp: 15,
    priority: 0,
    target: 'normal',
    flags: { protect: 1, mirror: 1 },
}
```

**What it does:** Special Fire-type move dealing 85 base power

---

### Example 2: Move with Secondary Effect

```typescript
'icefang': {
    id: 'icefang',
    name: 'Ice Fang',
    basePower: 65,
    category: 'Physical',
    type: 'Ice',
    accuracy: 95,
    pp: 15,
    priority: 0,
    target: 'normal',
    flags: { protect: 1, mirror: 1, contact: 1, bite: 1 },
    secondary: {
        chance: 10,
        status: 'frz',
    },
}
```

**What it does:** Physical bite move with 10% chance to freeze

---

### Example 3: Stat-Boosting Move

```typescript
'dragonascent': {
    id: 'dragonascent',
    name: 'Dragon Ascent',
    basePower: 120,
    category: 'Physical',
    type: 'Dragon',
    accuracy: 100,
    pp: 5,
    priority: 0,
    target: 'normal',
    flags: { protect: 1, mirror: 1, contact: 1 },
    self: {
        boosts: {
            def: -1,
            spd: -1,
        },
    },
}
```

**What it does:** Strong attack that lowers user's Defense and Sp. Def

---

### Example 4: Drain Move

```typescript
'drainingkiss': {
    id: 'drainingkiss',
    name: 'Draining Kiss',
    basePower: 50,
    category: 'Special',
    type: 'Fairy',
    accuracy: 100,
    pp: 10,
    priority: 0,
    target: 'normal',
    flags: { protect: 1, mirror: 1, contact: 1, heal: 1 },
    drain: [3, 4], // Heals 75% of damage dealt
}
```

**What it does:** Heals user for 75% of damage dealt

---

### Example 5: Multi-Hit Move

```typescript
'bulletseed': {
    id: 'bulletseed',
    name: 'Bullet Seed',
    basePower: 25,
    category: 'Physical',
    type: 'Grass',
    accuracy: 100,
    pp: 30,
    priority: 0,
    target: 'normal',
    flags: { protect: 1, mirror: 1 },
    multihit: [2, 5], // Hits 2-5 times randomly
}
```

**What it does:** Hits 2-5 times (random)

---

### Example 6: Pivot Move

```typescript
'uturn': {
    id: 'uturn',
    name: 'U-turn',
    basePower: 70,
    category: 'Physical',
    type: 'Bug',
    accuracy: 100,
    pp: 20,
    priority: 0,
    target: 'normal',
    flags: { protect: 1, mirror: 1, contact: 1 },
    selfSwitch: true, // Switches out after attacking
}
```

**What it does:** Attacks then switches out

---

### Example 7: Weather Move

```typescript
'raindance': {
    id: 'raindance',
    name: 'Rain Dance',
    basePower: 0,
    category: 'Status',
    type: 'Water',
    accuracy: true,
    pp: 5,
    priority: 0,
    target: 'all',
    flags: {},
    weather: 'rain', // Sets rain for 5 turns
}
```

**What it does:** Sets rain weather

---

### Example 8: Entry Hazard

```typescript
'stealthrock': {
    id: 'stealthrock',
    name: 'Stealth Rock',
    basePower: 0,
    category: 'Status',
    type: 'Rock',
    accuracy: true,
    pp: 20,
    priority: 0,
    target: 'foeSide',
    flags: { mirror: 1 },
    sideCondition: 'stealthrock',
}
```

**What it does:** Sets Stealth Rock on opponent's side

---

### Example 9: Two-Turn Charge Move

```typescript
'skyattack': {
    id: 'skyattack',
    name: 'Sky Attack',
    basePower: 140,
    category: 'Physical',
    type: 'Flying',
    accuracy: 90,
    pp: 5,
    priority: 0,
    target: 'normal',
    flags: { charge: 1, protect: 1, mirror: 1 }, // Two-turn move
    secondary: {
        chance: 30,
        volatileStatus: 'flinch',
    },
}
```

**What it does:** Charges turn 1, attacks turn 2 with 30% flinch chance

---

### Example 10: Spread Move for Doubles

```typescript
'rockslide': {
    id: 'rockslide',
    name: 'Rock Slide',
    basePower: 75,
    category: 'Physical',
    type: 'Rock',
    accuracy: 90,
    pp: 10,
    priority: 0,
    target: 'allAdjacentFoes', // Hits both opponents in doubles
    flags: { protect: 1, mirror: 1 },
    secondary: {
        chance: 30,
        volatileStatus: 'flinch',
    },
}
```

**What it does:** Hits both opponents with 30% flinch chance (0.75x damage in doubles)

---

## Secondary Effects

Secondary effects occur with a certain probability:

```typescript
secondary: {
    chance: 30,              // 30% chance to trigger
    status: 'par',           // Inflict paralysis
    volatileStatus: 'flinch', // OR cause flinch
    boosts: {                // OR change stats
        def: -1,
    },
}
```

**Available Status Conditions:**
- `'psn'` - Poison
- `'brn'` - Burn
- `'par'` - Paralysis
- `'slp'` - Sleep
- `'frz'` - Freeze

**Available Volatile Status:**
- `'flinch'` - Flinch (prevents action this turn)
- `'confusion'` - Confusion
- `'trap'` - Trapped (can't switch)

---

## Stat Boosts

Stat changes are defined as:

```typescript
boosts: {
    atk: 2,    // Sharply raise Attack (+2 stages)
    def: 1,    // Raise Defense (+1 stage)
    spa: -1,   // Lower Sp. Attack (-1 stage)
    spd: -2,   // Harshly lower Sp. Def (-2 stages)
    spe: 1,    // Raise Speed (+1 stage)
    accuracy: 1,  // Raise Accuracy
    evasion: -1,  // Lower Evasion
}
```

**Stage Range:** -6 to +6

---

## How to Give Pokemon Custom Moves

### Option 1: Add to MANUAL_LEARNSETS.ts

```typescript
export const MANUAL_LEARNSETS: Record<string, string[]> = {
    'pikachu': [
        'thunderbolt',
        'quickattack',
        'thunderwave',
        'shadowstrike',  // Your custom move
    ],
};
```

### Option 2: Add via Move Tutor or TM System

Custom moves can be learned the same way as regular moves - through level-up, TMs, or move tutors.

---

## Testing Custom Moves

### 1. Create a Test Pokemon

```
/rpg menu
/rpg starter pikachu  (or use existing Pokemon)
```

### 2. Give Pokemon the Custom Move

Manually add the move ID to the Pokemon's moveset in the database, or add it to the learnset.

### 3. Start a Battle

```
/rpg wild
/rpg trainer
/rpg wild double
```

### 4. Use the Move

The move will appear in the battle UI if the Pokemon knows it.

### 5. Verify Behavior

- Check damage calculation
- Verify secondary effects trigger
- Test in both singles and doubles
- Confirm UI displays correctly

---

## Compatibility with Existing Features

Custom moves automatically work with:

✓ **Damage Calculation** - Uses standard formulas
✓ **Type Effectiveness** - Checks type chart
✓ **Status Effects** - Burns, paralysis, etc.
✓ **Stat Changes** - Swords Dance, etc.
✓ **Weather** - Sun, rain, etc. boost/reduce damage
✓ **Terrain** - Electric, Grassy, etc. effects
✓ **Abilities** - Levitate, Overgrow, etc.
✓ **Items** - Life Orb, Choice Band, etc.
✓ **Critical Hits** - High crit moves work
✓ **STAB** - Same-type attack bonus
✓ **Spread Damage** - 0.75x in doubles for multi-target
✓ **Protection** - Protect, Wide Guard, etc.
✓ **Entry Hazards** - Stealth Rock, Spikes, etc.
✓ **Screens** - Reflect, Light Screen
✓ **Priority** - Quick Attack, Mach Punch
✓ **Recoil** - Life Orb, Take Down, etc.
✓ **Drain** - Absorb HP from target
✓ **Multi-Hit** - 2-5 times
✓ **Two-Turn** - Charge first turn
✓ **Pivot** - Switch after attacking
✓ **Self-Switch** - Baton Pass, U-turn
✓ **Entry Effects** - On switch-in

---

## Advanced Examples

### Complex Move with Multiple Effects

```typescript
'mysticalfire': {
    id: 'mysticalfire',
    name: 'Mystical Fire',
    basePower: 75,
    category: 'Special',
    type: 'Fire',
    accuracy: 100,
    pp: 10,
    priority: 0,
    target: 'normal',
    flags: { protect: 1, mirror: 1 },
    secondary: {
        chance: 100,  // Always triggers
        boosts: {
            spa: -1,  // Lowers target's Sp. Attack
        },
    },
}
```

### Custom OHKO Move

```typescript
'finalgambit': {
    id: 'finalgambit',
    name: 'Final Gambit',
    basePower: 0,
    category: 'Special',
    type: 'Fighting',
    accuracy: 100,
    pp: 5,
    priority: 0,
    target: 'normal',
    flags: { protect: 1 },
    selfdestruct: 'always',  // User faints
    // Damage = user's current HP (special case in code)
}
```

### Status Move with Multiple Boosts

```typescript
'shellsmash': {
    id: 'shellsmash',
    name: 'Shell Smash',
    basePower: 0,
    category: 'Status',
    type: 'Normal',
    accuracy: true,
    pp: 15,
    priority: 0,
    target: 'self',
    flags: {},
    boosts: {
        atk: 2,
        spa: 2,
        spe: 2,
        def: -1,
        spd: -1,
    },
}
```

---

## Troubleshooting

### Move Doesn't Appear in Battle

**Problem:** Custom move doesn't show in Pokemon's move list

**Solutions:**
1. Check Pokemon's moveset in database
2. Verify move ID matches exactly (case-sensitive)
3. Ensure move is in CUSTOM_MOVES object
4. Restart server to reload moves

### Move Deals Wrong Damage

**Problem:** Damage calculation seems incorrect

**Solutions:**
1. Check `basePower` value
2. Verify `category` (Physical/Special/Status)
3. Check type effectiveness
4. Consider STAB, items, abilities

### Move Doesn't Work in Doubles

**Problem:** Move doesn't target correctly in doubles

**Solutions:**
1. Check `target` property
2. Verify spread moves have correct target (`allAdjacentFoes`, etc.)
3. Test target selection UI

### Secondary Effect Not Triggering

**Problem:** Secondary effect never happens

**Solutions:**
1. Check `chance` value (1-100)
2. Verify `secondary` object structure
3. Ensure Pokemon doesn't have Covert Cloak (blocks secondary effects)

---

## Best Practices

### 1. Balanced Power Levels
- Don't create moves significantly stronger than existing ones
- Consider: 120+ base power usually has drawbacks (recoil, charge turn, stat drops)

### 2. Appropriate Accuracy
- Most moves: 90-100
- Powerful moves: 70-85
- OHKO moves: 30

### 3. Reasonable PP
- Weak moves: 25-35 PP
- Standard moves: 10-20 PP
- Strong moves: 5-10 PP

### 4. Type-Appropriate Effects
- Fire moves can burn
- Electric moves can paralyze
- Ice moves can freeze
- Grass moves often drain HP

### 5. Testing
- Test in singles AND doubles
- Verify all edge cases
- Check interaction with abilities/items

---

## Conclusion

The custom moves system allows you to create any Pokemon move using the same format as official moves. All battle mechanics, UI elements, and special interactions work automatically.

**Key Files:**
- `/impulse/chat-plugins/battletower-test/CUSTOM_MOVES.ts` - Define custom moves here
- `/impulse/chat-plugins/battletower-test/rpg-refactor.ts` - Battle system (imports custom moves)

**Key Function:**
- `getMove(moveId)` - Gets move from custom moves or Dex

Happy move creating! 🎮
