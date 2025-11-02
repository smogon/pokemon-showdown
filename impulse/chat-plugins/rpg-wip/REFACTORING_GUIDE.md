# RPG Plugin Refactoring Guide

## Overview

This document describes the refactoring of `rpg-refactor.ts` from a single ~6600 line file into maintainable, modular components.

## Current State (Before Refactoring)

### File Structure
```
rpg-refactor.ts (~6600 lines)
├── Imports (7 lines)
├── Type Definitions (~200 lines)
│   ├── RPGPokemon, PlayerData, BattleState
│   ├── ActivePokemonSlot, InventoryItem
│   └── TrainerSpec, Stats
├── Constants & Configuration (~500 lines)
│   ├── ITEMS_DATABASE (100+ items)
│   ├── TYPE_CHART (18 types)
│   ├── NATURES (25 natures)
│   ├── ENCOUNTER_ZONES
│   ├── TRAINER_DATABASE
│   └── Various prices, shop inventory, berry data
├── Core Utility Functions (~400 lines)
│   ├── calculateStats, createPokemon
│   ├── calculateTotalExpForLevel
│   ├── addItemToInventory, removeItemFromInventory
│   ├── storePokemonInPC, withdrawPokemonFromPC
│   └── getPlayerData, generateUniqueId
├── Battle Mechanics (~2000 lines)
│   ├── calculateDamage (500+ lines)
│   ├── getCustomEffectiveness
│   ├── getCriticalHitChance
│   ├── getBallBonus, performCatchAttempt
│   ├── processTurn (1000+ lines)
│   ├── generateAiAction
│   ├── handleMoveExecution
│   ├── applyEndOfTurnEffects
│   └── Many helper functions for specific moves/abilities
├── UI/HTML Generation (~1500 lines)
│   ├── generateBattleHTML
│   ├── generatePartyHTML
│   ├── generateShopHTML
│   ├── generateInventoryHTML
│   ├── generatePokemonInfoHTML
│   └── Various menu and status HTML generators
└── Command Handlers (~900 lines)
    ├── /rpg start, menu, profile
    ├── /rpg party, pc, items
    ├── /rpg battle, wildpokemon, challenge
    ├── /rpg battleaction (move, switch, catch, run)
    └── /rpg heal, shop, buy, giveitem, etc.
```

### Problems with Current Structure

1. **Single Responsibility Principle Violation**: One file handles types, data, logic, UI, and commands
2. **Hard to Navigate**: 6600+ lines makes finding specific functionality difficult
3. **Difficult to Test**: Tightly coupled code makes unit testing nearly impossible
4. **Hard to Maintain**: Changes to one feature risk breaking unrelated features
5. **Code Duplication**: Similar logic repeated in multiple places
6. **Poor Reusability**: Functions are tightly coupled to specific contexts

## Proposed Module Structure

### Phase 1: Type Definitions (✓ Complete)
**File**: `types.ts` (~230 lines)
- All TypeScript interfaces and type aliases
- No dependencies on other modules
- Pure type definitions

### Phase 2: Constants & Configuration (✓ Complete)
**File**: `constants.ts` (~370 lines)
- All static configuration data
- Item database, type chart, natures
- Encounter zones, trainer database
- Shop inventory, prices

### Phase 3: Utility Functions (✓ Complete)
**File**: `utils.ts` (~230 lines)
- Core utility functions used throughout
- Pokemon creation and stat calculation
- Inventory management
- Experience calculation
- No battle-specific logic

### Phase 4: Battle Logic (In Progress)
**File**: `battle-logic.ts` (~1500 lines)
```typescript
// Battle mechanics and calculations
- calculateDamage
- getCustomEffectiveness
- getCriticalHitChance
- getBallBonus, performCatchAttempt
- processTurn
- generateAiAction
- handleMoveExecution
- applyEndOfTurnEffects
- All move-specific handlers
- All ability-specific handlers
```

### Phase 5: UI Generators (Planned)
**File**: `ui-generators.ts` (~1000 lines)
```typescript
// HTML generation for all UI elements
- generateBattleHTML
- generatePartyHTML
- generateShopHTML
- generateInventoryHTML
- generatePokemonInfoHTML
- generateMenuHTML
- generateStatusHTML
```

### Phase 6: Player Data Management (Planned)
**File**: `player-data.ts` (~200 lines)
```typescript
// Player state management
- getPlayerData
- savePlayerData
- playerData Map
- activeBattles Map
- Battle state helpers
```

### Phase 7: Main File (Planned)
**File**: `rpg-refactor.ts` (~800 lines)
```typescript
// Command handlers only
- Import all modules
- Define command structure
- Route commands to appropriate handlers
- Minimal logic, mostly delegation
```

## Refactoring Benefits

### 1. Improved Maintainability
- Each module has a single, clear responsibility
- Changes are localized to relevant modules
- Easier to understand and modify

### 2. Better Testability
- Functions can be tested in isolation
- Mock dependencies easily
- Clear interfaces between modules

### 3. Enhanced Readability
- Shorter files are easier to navigate
- Related functionality grouped together
- Clear module boundaries

### 4. Code Reusability
- Functions can be imported where needed
- Avoid duplication
- Share common logic

### 5. Easier Collaboration
- Multiple developers can work on different modules
- Reduced merge conflicts
- Clear ownership of functionality

## Migration Strategy

### Phase 1-3 (✓ Complete)
1. Create new module files
2. Copy relevant code
3. Fix imports and types
4. Test compilation

### Phase 4-6 (In Progress)
1. Extract functions one module at a time
2. Update imports in main file
3. Test each extraction
4. Verify functionality unchanged

### Phase 7 (Final)
1. Update main file to use all modules
2. Remove extracted code
3. Add comprehensive tests
4. Update documentation

## Testing Strategy

### Unit Tests
- Test individual functions in isolation
- Mock dependencies
- Cover edge cases

### Integration Tests
- Test module interactions
- Verify data flow
- Test battle scenarios end-to-end

### Regression Tests
- Ensure refactored code behaves identically
- Test all command paths
- Verify battle mechanics unchanged

## File Organization

```
impulse/chat-plugins/rpg-wip/
├── types.ts                    # Type definitions
├── constants.ts                # Configuration data
├── utils.ts                    # Utility functions
├── battle-logic.ts            # Battle mechanics (TODO)
├── ui-generators.ts           # HTML generation (TODO)
├── player-data.ts             # State management (TODO)
├── rpg-refactor.ts            # Main command handlers (TODO: update)
├── MANUAL_*.ts                # External data files (unchanged)
├── CUSTOM_MOVES.ts            # Custom move definitions (unchanged)
└── REFACTORING_GUIDE.md       # This document
```

## Notes

- All refactoring maintains 100% backward compatibility
- No changes to command syntax or behavior
- TypeScript compilation errors are pre-existing (ES2015/2017 features)
- Runtime behavior unchanged
- Globals (Dex, toID) available from Pokemon Showdown environment

## Next Steps

1. Extract battle logic to `battle-logic.ts`
2. Extract UI generators to `ui-generators.ts`
3. Extract player data management to `player-data.ts`
4. Update main file to import and use modules
5. Add comprehensive testing
6. Update documentation
