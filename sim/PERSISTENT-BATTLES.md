# Persistent Battle Formats

This document describes the persistent battle system in Pokemon Showdown, which allows HP, PP, and status conditions to persist between consecutive battles.

## Overview

The persistent battle system enables custom formats where Pokemon state carries over from one battle to the next. This is useful for:

- **Gauntlet Challenges**: One player faces multiple opponents in succession with their Pokemon's state persisting
- **Tournament Formats**: Both players' Pokemon states persist across multiple rounds
- **Endurance Battles**: Strategic gameplay where resource management (HP, PP) matters across multiple matches

## Architecture

### Battle Persistence Manager

The core of the system is the `BattlePersistenceManager` class (`sim/battle-persistence.ts`), which:

- Captures Pokemon state (HP, PP, status conditions)
- Stores state keyed by format ID, player ID, and player name
- Restores state to Pokemon at the start of subsequent battles
- Validates state to prevent exploits (e.g., HP/PP exceeding maximums)

### Persistent Pokemon State

Each Pokemon's persistent state includes:

```typescript
interface PersistentPokemonState {
  identifier: string;      // Pokemon name
  hp: number;              // Current HP
  maxhp: number;           // Maximum HP
  status: ID;              // Status condition ('par', 'brn', 'slp', etc.)
  movepp: number[];        // Current PP for each move
  movemaxpp: number[];     // Maximum PP for each move
  moveids: ID[];           // Move IDs for validation
}
```

## Rulesets

Three rulesets are provided for persistent battles:

### 1. Persistent Battles

**Rule ID**: `persistentbattles`

Both players' Pokemon states persist between battles.

```javascript
ruleset: ['Standard', 'Persistent Battles']
```

**Use Case**: Tournament-style battles where both players face each other multiple times, and resource management matters.

### 2. Persistent Battles P1

**Rule ID**: `persistentbattlesp1`

Only Player 1's Pokemon state persists. Player 2 starts fresh each battle.

```javascript
ruleset: ['Standard', 'Persistent Battles P1']
```

**Use Case**: Gauntlet challenges where one player faces a series of fresh opponents.

### 3. Clear Persistent State

**Rule ID**: `clearpersistentstate`

Clears all persistent state at the start of the battle.

```javascript
ruleset: ['Clear Persistent State', 'Team Preview', 'Cancel Mod']
```

**Use Case**: Reset button for gauntlet challenges or to clear state before starting a new series.

## Example Formats

Several example formats are provided in `config/formats.ts`:

### [Gen 9] Gauntlet Challenge

```javascript
{
  name: "[Gen 9] Gauntlet Challenge",
  desc: "Your Pokemon's HP, PP, and status persist between battles.",
  mod: 'gen9',
  searchShow: false,
  challengeShow: true,
  ruleset: ['Standard', 'Persistent Battles P1'],
}
```

### [Gen 9] Persistent Battle

```javascript
{
  name: "[Gen 9] Persistent Battle",
  desc: "All Pokemon HP, PP, and status persist between battles for both players.",
  mod: 'gen9',
  searchShow: false,
  challengeShow: true,
  ruleset: ['Standard', 'Persistent Battles'],
}
```

### [Gen 9] Persistent Random Battle

```javascript
{
  name: "[Gen 9] Persistent Random Battle",
  desc: "Random Battle where HP, PP, and status persist between consecutive matches.",
  mod: 'gen9',
  team: 'random',
  searchShow: false,
  challengeShow: true,
  ruleset: ['Obtainable', 'Species Clause', 'HP Percentage Mod', 'Cancel Mod', 
            'Sleep Clause Mod', 'Illusion Level Mod', 'Persistent Battles'],
}
```

## Usage Examples

### Creating a Persistent Battle via API

```javascript
const { BattleStream, getPlayerStreams } = require('pokemon-showdown');

// First battle
const streams1 = getPlayerStreams(new BattleStream());
streams1.omniscient.write(`>start {"formatid":"gen9gauntletchallenge"}`);
streams1.omniscient.write(`>player p1 {"name":"Player 1","team":"..."}`);
streams1.omniscient.write(`>player p2 {"name":"Opponent 1","team":"..."}`);

// ... battle plays out ...

// Second battle - Player 1's state will be restored
const streams2 = getPlayerStreams(new BattleStream());
streams2.omniscient.write(`>start {"formatid":"gen9gauntletchallenge"}`);
streams2.omniscient.write(`>player p1 {"name":"Player 1","team":"..."}`);  // Same name
streams2.omniscient.write(`>player p2 {"name":"Opponent 2","team":"..."}`);

// Player 1's Pokemon will start with HP, PP, and status from first battle
```

### Programmatic Access

```javascript
const { globalPersistenceManager } = require('pokemon-showdown/sim/battle-persistence');

// Save state manually
globalPersistenceManager.saveBattleState(battle, side);

// Load state manually
const state = globalPersistenceManager.loadBattleState(formatid, playerid, playername);
if (state) {
  globalPersistenceManager.restoreBattleState(side, state);
}

// Clear specific state
globalPersistenceManager.clearBattleState(formatid, playerid, playername);

// Clear all states
globalPersistenceManager.clearAll();
```

## Implementation Details

### State Capture (onEnd)

When a battle ends with a persistent battles ruleset:

1. The `onEnd` hook in the ruleset captures each side's Pokemon states
2. State includes: HP, max HP, status, move PP, max PP, and move IDs
3. State is stored in memory keyed by format ID + player ID + player name

### State Restoration (onBegin)

When a battle begins with a persistent battles ruleset:

1. The `onBegin` hook attempts to load state for each player
2. If state exists and Pokemon names match, state is restored
3. HP and PP are capped at current maximums to prevent exploits
4. Battle log shows which Pokemon have reduced HP or status conditions

### Validation

The system includes several validation checks:

- **Name Matching**: Pokemon names must match between battles
- **HP Capping**: Restored HP cannot exceed current max HP
- **PP Capping**: Restored PP cannot exceed current max PP
- **Move Verification**: Moves are verified by ID before restoring PP

## Creating Custom Persistent Formats

To create your own persistent format:

1. Add a new format entry to `config/formats.ts` or `config/custom-formats.ts`
2. Include one of the persistent battle rulesets
3. Customize other rules as needed

Example:

```javascript
{
  name: "[Gen 9] My Custom Gauntlet",
  desc: "Custom rules with persistent battles",
  mod: 'gen9',
  searchShow: false,
  ruleset: [
    'Standard',
    'Persistent Battles P1',
    // Add your custom rules here
  ],
  banlist: [
    // Add bans here
  ],
}
```

## Limitations and Considerations

### Current Limitations

1. **Memory Storage**: States are stored in memory and lost on server restart
2. **No Persistence Layer**: There's no database or file-based persistence
3. **Team Changes**: If a player's team composition changes between battles, state restoration may fail
4. **Forme Changes**: Pokemon forme changes between battles may cause issues

### Future Enhancements

Possible improvements:

- Database or file-based persistence for long-term storage
- Support for league/tournament systems with scheduled matches
- Healing stations or rest phases between battles
- Configurable persistence rules (e.g., persist HP but not status)
- Support for persistent items and other battle state

## Testing

Tests are provided in `test/sim/battle-persistence.js`:

```bash
npm test -- test/sim/battle-persistence.js
```

Tests cover:
- HP persistence
- Status condition persistence
- Move PP persistence
- Multi-Pokemon state management
- Player separation
- Validation and edge cases
- Consecutive battle scenarios

## Security Considerations

The persistent battle system includes safeguards against:

- **HP Inflation**: Restored HP is capped at current max HP
- **PP Inflation**: Restored PP is capped at current max PP
- **Name Spoofing**: State is keyed by player name for basic protection
- **Invalid State**: Pokemon and move validation before restoration

For production use, additional authentication and authorization should be implemented at the server level.

## Credits

This persistent battle system was designed to support gauntlet-style challenges and tournament formats where resource management matters across multiple battles.

## License

MIT License - Same as Pokemon Showdown
