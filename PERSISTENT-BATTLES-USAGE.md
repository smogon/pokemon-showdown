# Persistent Battles - Usage Guide

## Quick Start

This guide shows you how to use the persistent battle system to create formats where Pokemon HP, PP, and status conditions carry over between battles.

## What is a Persistent Battle?

In a persistent battle format:
- Pokemon HP remains at its current value between battles (damaged Pokemon stay damaged)
- Move PP carries over (used moves have reduced PP in the next battle)
- Status conditions persist (paralyzed Pokemon stay paralyzed)

This creates **gauntlet-style challenges** where resource management matters across multiple battles.

## Use Cases

### 1. Gauntlet Challenge
One player faces multiple fresh opponents in succession. Only the challenger's Pokemon state persists.

**Example**: "Can you defeat 5 trainers in a row with the same team?"

### 2. Endurance Tournament
Both players face each other multiple times. Both players' Pokemon states persist.

**Example**: "Best of 5 series where damage accumulates"

### 3. Storyline Battles
Create a narrative where battles against different trainers feel connected.

**Example**: "Journey through a gym where your Pokemon get worn down"

## How to Use

### Option 1: Use Pre-Made Formats

The easiest way is to use the pre-configured formats:

#### From the Game Client:
1. Challenge a friend or start a battle
2. Select format: **"[Gen 9] Gauntlet Challenge"** or **"[Gen 9] Persistent Battle"**
3. Battle as normal
4. After the battle ends, start a new battle with the **same player name**
5. Your Pokemon will have the same HP, PP, and status as before!

### Option 2: Create Custom Format

Add persistent battles to any custom format:

**In `config/custom-formats.ts`:**

```javascript
{
  name: "[Gen 9] My Custom Gauntlet",
  mod: 'gen9',
  ruleset: [
    'Standard',
    'Persistent Battles P1',  // Add this line
    // ... your other rules
  ],
}
```

**Ruleset Options:**
- `'Persistent Battles'` - Both players' states persist
- `'Persistent Battles P1'` - Only Player 1's state persists
- `'Clear Persistent State'` - Reset all persistent state

### Option 3: Programmatic API

Use the persistence system in your own code:

```javascript
const { Battle, globalPersistenceManager } = require('pokemon-showdown');

// After a battle ends
globalPersistenceManager.saveBattleState(battle, side);

// At the start of the next battle
const state = globalPersistenceManager.loadBattleState(
  formatid,
  playerid,
  playername
);

if (state) {
  globalPersistenceManager.restoreBattleState(side, state);
}
```

## Complete Example

### Gauntlet Challenge Scenario

**Setup:**
```javascript
// Battle 1: Player vs Opponent 1
Format: "[Gen 9] Gauntlet Challenge"
Player: "Ash"
Team: Pikachu (100% HP), Charizard (100% HP), Blastoise (100% HP)

// Battle ends - Pikachu at 40% HP, Charizard fainted, Thunder out of PP
```

**Battle 2:**
```javascript
// Battle 2: Player vs Opponent 2
Format: "[Gen 9] Gauntlet Challenge"
Player: "Ash" (SAME NAME - important!)
Team: Same team

// Battle starts with:
// - Pikachu at 40% HP, Thunder has 0 PP
// - Charizard still fainted
// - Blastoise at 100% HP (wasn't used)
```

## Important Notes

### State Persists When:
✓ **Same format ID** - Must use the same format
✓ **Same player name** - Name must match exactly
✓ **Same team order** - Pokemon must be in the same positions

### State Does NOT Persist:
✗ Different format
✗ Different player name
✗ Server restart (state is in memory only)
✗ Using "Clear Persistent State" format

## Resetting State

### Method 1: Use Reset Format
Play one battle in the **"[Gen 9] Reset Persistent State"** format to clear all state.

### Method 2: Change Player Name
Simply use a different name in your next battle.

### Method 3: Programmatic
```javascript
const { globalPersistenceManager } = require('pokemon-showdown');

// Clear specific player
globalPersistenceManager.clearBattleState(formatid, playerid, playername);

// Clear all
globalPersistenceManager.clearAll();
```

## Strategy Tips

### For Gauntlet Challenges:
1. **Conserve HP** - Avoid unnecessary damage
2. **Manage PP** - Don't spam your strongest moves
3. **Status is Permanent** - Avoid getting burned/paralyzed
4. **Healing is Limited** - Use Wish/Regenerator strategically
5. **Sacrifice Wisely** - Sometimes sacrificing one Pokemon saves the team

### For Endurance Tournaments:
1. **Chip Damage Adds Up** - Even small hits matter long-term
2. **Stall Matters More** - Defensive play becomes more valuable
3. **Status Warfare** - Inflicting burn/toxic has lasting impact
4. **PP Pressure** - Forcing opponent to use moves drains their resources

## Advanced: Creating Healing Stations

You can create a custom ruleset that heals between battles:

```javascript
healingstation: {
  effectType: 'Rule',
  name: 'Healing Station',
  desc: "Pokemon are healed 50% between battles",
  onBegin() {
    const manager = (this.constructor as any).persistenceManager;
    if (!manager) return;

    for (const side of this.sides) {
      const state = manager.loadBattleState(
        this.format.id,
        side.id,
        side.name
      );

      if (state) {
        // Heal 50% before restoring
        for (const pokemonState of state.pokemon) {
          pokemonState.hp = Math.min(
            pokemonState.hp + Math.floor(pokemonState.maxhp * 0.5),
            pokemonState.maxhp
          );
        }
        manager.restoreBattleState(side, state);
      }
    }

    // Save on battle end (same as Persistent Battles)
    const originalWin = this.win.bind(this);
    this.win = function (side?: any) {
      for (const s of this.sides) {
        manager.saveBattleState(this, s);
      }
      return originalWin(side);
    };
  },
}
```

## Troubleshooting

### Q: State isn't persisting between battles
**A:** Check that:
1. Player name is exactly the same
2. Using the same format (or format with same ID)
3. Server hasn't restarted

### Q: Pokemon have full HP when they shouldn't
**A:** You might have used "Clear Persistent State" format, or changed the player name.

### Q: Can I persist state across server restarts?
**A:** Not currently - state is stored in memory. For long-term persistence, you'd need to implement database storage.

### Q: Does this work in random battles?
**A:** Yes! Try **"[Gen 9] Persistent Random Battle"**

## Examples Repository

See `/sim/examples/persistent-battle-example.ts` for complete working examples of:
- Gauntlet challenges
- Persistent tournaments
- Programmatic usage

## Further Reading

- **[Full Documentation](./sim/PERSISTENT-BATTLES.md)** - Complete technical documentation
- **[Implementation Details](./sim/battle-persistence.ts)** - Source code
- **[Test Cases](./test/sim/battle-persistence.js)** - Example usage in tests

## Community Formats

Here are some fun format ideas using persistent battles:

1. **"Elite Four Challenge"** - Face 4 trainers + Champion with no healing
2. **"Nuzlocke Mode"** - Fainted Pokemon can't be used in future battles
3. **"Marathon Battle"** - First to win 10 battles in persistent format
4. **"Battle Tower"** - Face increasingly difficult opponents
5. **"War of Attrition"** - Both players battle until all Pokemon faint

---

**Ready to create your own persistent battle format?**

Start with the pre-made formats, then customize the rulesets to create unique challenges!
