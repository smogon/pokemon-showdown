# Battle Engine Split Documentation

## Overview

The `battle-engine.ts` file was split into two smaller files to improve maintainability and reduce file size:

- **Original file**: `battle-engine.ts` (146KB, 4213 lines)
- **Split into**:
  - `battle-core.ts` (82KB, 2352 lines)
  - `battle-effects.ts` (66KB, 1909 lines)
  - `battle-engine.ts` (537 bytes, re-export file)

## File Organization

### battle-core.ts
Contains core battle mechanics and calculations:
- Type effectiveness calculations (`getPokemonTypes`, `getCustomEffectiveness`)
- Catch mechanics (`performCatchAttempt`, `getBallBonus`)
- Stat calculations (`getStatMultiplier`, `getCriticalHitChance`)
- Experience and EV gain (`gainExperience`, `gainEffortValues`)
- Damage calculation system (`calculateDamage`, `getDamageBasePower`, `getDamageOffense`, `getDamageDefense`)
- Move execution (`executeMove`, `handleDamagingMove`, `handleStatusMove`)
- Status move handlers (`handleGenericBoostMove`, `handleGenericStatusInflictMove`, etc.)
- Cross-referenced utility functions (`applySynchronize`, `checkMentalHerb`, `handleHPDropEffects`, `activateUnburden`)

### battle-effects.ts
Contains end-of-turn effects, battle flow, and state management:
- End-of-turn effects (`applyEOTStatusDamage`, `applyEOTItemEffects`, `applyEOTVolatileStatusDamage`)
- Healing effects (`applyEOTHealingEffects`, `applyEOTLeechSeedDamage`)
- Counter decrements (`decrementEOTVolatileCounters`)
- Battle flow control (`handleOpponentFaint`, `handlePlayerFaint`, `checkForWinLoss`, `checkBattleEndCondition`)
- Turn processing (`processTurn`, `processEndOfTurn`, `handlePreTurnChecks`)
- Switch-in effects (`applyHazardEffectsOnSwitchIn`, `handleMirrorHerb`)
- Weather and terrain effects (`handleEndOfTurnWeather`, `handleEndOfTurnFieldEffects`)
- Utility functions (`createActivePokemonSlot`, `getSlotFromIndex`, `getMoveTargets`, `validateMoveAction`)

### battle-engine.ts (Re-export File)
A thin wrapper that re-exports everything from both files:
```typescript
export * from './battle-core';
export * from './battle-effects';
```

This maintains backwards compatibility - all existing imports from `battle-engine.ts` continue to work without changes.

## Import Dependencies

### battle-core.ts imports from:
- `../../../sim/dex` (Dex, toID)
- `./abilities` (RPGAbilities)
- `./utils` (utility functions)
- `./interface` (types)
- `./items` (ITEMS_DATABASE, ITEM_PRICES)
- `./data` (BERRY_FLAVORS, TYPE_CHART, etc.)
- `./core` (playerData, activeBattles)
- `./html` (HTML generators)
- `./MANUAL_CATCH_RATES`
- `./MANUAL_BASE_EXP`
- `./MANUAL_EV_YIELDS`

### battle-effects.ts imports from:
- All of the above
- `./battle-core` (specific functions it needs)

## Cross-Referenced Functions

To avoid circular dependencies, these functions were kept in `battle-core.ts` even though they're primarily used by end-of-turn effects, because they're also called directly by move execution functions:

- `applySynchronize` - Applied when status moves afflict status (Synchronize ability)
- `checkMentalHerb` - Checks if Mental Herb should activate
- `handleHPDropEffects` - Handles berry consumption when HP drops
- `activateUnburden` - Activates Unburden ability when item is consumed

## Usage

### For Developers

Import from `battle-engine.ts` as before:
```typescript
import { calculateDamage, processTurn, executeMove } from './battle-engine';
```

Or import directly from specific files if you only need functions from one:
```typescript
import { calculateDamage } from './battle-core';
import { processTurn } from './battle-effects';
```

### External Files

Only `commands.ts` imports from `battle-engine.ts`. No changes are required to this file.

## Benefits

1. **Reduced file size**: Each file is now ~70-80KB instead of 146KB
2. **Improved organization**: Clear separation between calculation/execution and effects/flow
3. **Better maintainability**: Easier to find and modify specific functionality
4. **No breaking changes**: All existing imports continue to work

## Testing

After the split:
- No duplicate exports between files
- All cross-references resolved
- All imports validated
- No circular dependencies

## Future Improvements

Consider further splitting if files grow too large:
- `battle-damage.ts`: Damage calculation only
- `battle-moves.ts`: Move execution only
- `battle-status.ts`: Status move handlers only
- `battle-eot.ts`: End-of-turn effects only

