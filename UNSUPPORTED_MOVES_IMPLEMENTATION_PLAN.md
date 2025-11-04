# Implementation Plan for Unsupported Moves

## Executive Summary

**Current Status:** 934/944 moves supported (98.9% coverage)  
**Unsupported Moves:** 10 moves  
**Reason:** Complex game state requirements or gimmick mechanics

This document provides a detailed implementation plan for the 10 remaining unsupported moves in the RPG battle system.

---

## Unsupported Moves Overview

| Move | Difficulty | Priority | Estimated Effort |
|------|-----------|----------|------------------|
| Sleep Talk | Medium | High | 4-6 hours |
| Copycat | Medium | Medium | 6-8 hours |
| Mirror Move | Medium | Medium | 6-8 hours |
| Mimic | Medium-High | Medium | 8-10 hours |
| Assist | Medium | Low | 6-8 hours |
| Nature Power | Medium | Low | 4-6 hours |
| Snatch | High | Low | 10-12 hours |
| Transform | Very High | Low | 20-30 hours |
| Sketch | Very High | Very Low | 15-20 hours |
| Metronome | Medium | Very Low | 6-8 hours |

**Total Estimated Effort:** 85-116 hours (10-15 working days)

---

## Move 1: Sleep Talk

### Description
Uses a random move from the user's moveset while asleep.

### Current Status
❌ Not Implemented

### Requirements
1. Check if user is asleep
2. Select random move from moveset (excluding Sleep Talk itself)
3. Execute the selected move
4. Handle PP correctly (use Sleep Talk's PP, not the called move's PP)

### Implementation Strategy

**Data Structure Changes:**
- No new data structures needed
- Uses existing `status` and `moves` fields

**Code Changes:**

```typescript
// TODO: Implement Sleep Talk
// Location: rpg-refactor.ts, around line 1800-1850
// Add to special move handling in executeMoveEffects()

if (move.id === 'sleeptalk') {
    // Must be asleep to use
    if (attackerSlot.status !== 'slp') {
        messageLog.push(`But it failed!`);
        return;
    }
    
    // Get available moves (excluding Sleep Talk itself)
    const availableMoves = attacker.moves
        .filter(m => m.id !== 'sleeptalk' && m.pp > 0)
        .map(m => m.id);
    
    if (availableMoves.length === 0) {
        messageLog.push(`But it failed!`);
        return;
    }
    
    // Select random move
    const selectedMoveId = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    const selectedMove = getMove(selectedMoveId);
    
    messageLog.push(`${attacker.species} used ${selectedMove.name} via Sleep Talk!`);
    
    // Execute the selected move
    // NOTE: Don't deduct PP from the called move, only from Sleep Talk
    executeMoveWithoutPPDeduction(battle, attackerSlot, defenderSlot, selectedMove, messageLog);
    
    return;
}
```

**Testing:**
- [ ] Sleep Talk fails when user is not asleep
- [ ] Sleep Talk calls a random move when asleep
- [ ] Called move doesn't lose PP
- [ ] Sleep Talk itself loses PP
- [ ] Sleep Talk can't call itself

**Priority:** High (commonly used move)

---

## Move 2: Copycat

### Description
Copies the last move used by any Pokémon in battle.

### Current Status
❌ Not Implemented

### Requirements
1. Track last move used in battle
2. Copy and execute that move
3. Handle cases where no move has been used yet
4. Handle uncopyable moves

**Data Structure Changes:**

```typescript
// Add to BattleState interface
interface BattleState {
    // ... existing fields ...
    lastMoveUsed?: {
        moveId: string;
        userName: string;
        turn: number;
    };
}
```

**Code Changes:**

```typescript
// TODO: Track last move used
// Location: rpg-refactor.ts, in processTurn() after each move execution
// Add after successful move execution:

battle.lastMoveUsed = {
    moveId: move.id,
    userName: attacker.species,
    turn: battle.turn
};

// TODO: Implement Copycat
// Location: rpg-refactor.ts, around line 1850-1900

if (move.id === 'copycat') {
    if (!battle.lastMoveUsed) {
        messageLog.push(`But it failed!`);
        return;
    }
    
    const copiedMoveId = battle.lastMoveUsed.moveId;
    const copiedMove = getMove(copiedMoveId);
    
    // Check if move is copyable
    const uncopyableMoves = ['copycat', 'mimic', 'sketch', 'transform', 'struggle'];
    if (uncopyableMoves.includes(copiedMoveId)) {
        messageLog.push(`But it failed!`);
        return;
    }
    
    messageLog.push(`${attacker.species} copied ${battle.lastMoveUsed.userName}'s ${copiedMove.name}!`);
    
    // Execute the copied move
    executeMoveWithoutPPDeduction(battle, attackerSlot, defenderSlot, copiedMove, messageLog);
    
    return;
}
```

**Testing:**
- [ ] Copycat fails when no move has been used
- [ ] Copycat copies the last move used
- [ ] Copycat can't copy uncopyable moves
- [ ] Copycat works in both singles and doubles

**Priority:** Medium

---

## Move 3: Mirror Move

### Description
Copies the last move used by the target.

### Current Status
❌ Not Implemented

### Requirements
1. Track last move used by each Pokémon
2. Copy move from specific target
3. Handle uncopyable moves

**Data Structure Changes:**

```typescript
// Add to ActivePokemonSlot interface
interface ActivePokemonSlot {
    // ... existing fields ...
    lastMoveUsed?: string; // Move ID of last move this Pokemon used
}
```

**Code Changes:**

```typescript
// TODO: Track last move per Pokemon
// Location: rpg-refactor.ts, in processTurn() after each move execution

attackerSlot.lastMoveUsed = move.id;

// TODO: Implement Mirror Move
// Location: rpg-refactor.ts, around line 1900-1950

if (move.id === 'mirrormove') {
    const targetSlot = getSlotFromIndex(battle, targetSlotIndex);
    
    if (!targetSlot || !targetSlot.lastMoveUsed) {
        messageLog.push(`But it failed!`);
        return;
    }
    
    const mirroredMoveId = targetSlot.lastMoveUsed;
    const mirroredMove = getMove(mirroredMoveId);
    
    // Check if move is mirrorable
    const unmirrorableMoves = ['mirrormove', 'struggle'];
    if (unmirrorableMoves.includes(mirroredMoveId)) {
        messageLog.push(`But it failed!`);
        return;
    }
    
    messageLog.push(`${attacker.species} mirrored ${targetSlot.pokemon.species}'s ${mirroredMove.name}!`);
    
    // Execute the mirrored move back at the original user
    const originalAttackerIndex = battle.opponentSlots.indexOf(targetSlot);
    executeMoveWithTarget(battle, attackerSlot, originalAttackerIndex, mirroredMove, messageLog);
    
    return;
}
```

**Testing:**
- [ ] Mirror Move fails when target hasn't used a move
- [ ] Mirror Move copies target's last move
- [ ] Mirror Move targets the original user
- [ ] Mirror Move can't copy unmirrorable moves

**Priority:** Medium

---

## Move 4: Mimic

### Description
Temporarily replaces one of the user's moves with target's last used move.

### Current Status
❌ Not Implemented

### Requirements
1. Track target's last move
2. Replace user's move temporarily (until switch)
3. Store original move to restore later
4. Handle PP

**Data Structure Changes:**

```typescript
// Add to ActivePokemonSlot interface
interface ActivePokemonSlot {
    // ... existing fields ...
    mimickedMove?: {
        originalSlot: number; // Which move slot was replaced (0-3)
        originalMoveId: string;
        mimickedMoveId: string;
    };
}
```

**Code Changes:**

```typescript
// TODO: Implement Mimic
// Location: rpg-refactor.ts, around line 1950-2050

if (move.id === 'mimic') {
    const targetSlot = getSlotFromIndex(battle, targetSlotIndex);
    
    if (!targetSlot || !targetSlot.lastMoveUsed) {
        messageLog.push(`But it failed!`);
        return;
    }
    
    const mimicMoveId = targetSlot.lastMoveUsed;
    const mimicMove = getMove(mimicMoveId);
    
    // Check if already knows the move
    if (attacker.moves.some(m => m.id === mimicMoveId)) {
        messageLog.push(`But it failed!`);
        return;
    }
    
    // Find Mimic's slot
    const mimicSlotIndex = attacker.moves.findIndex(m => m.id === 'mimic');
    if (mimicSlotIndex === -1) {
        messageLog.push(`But it failed!`);
        return;
    }
    
    // Store original move info
    attackerSlot.mimickedMove = {
        originalSlot: mimicSlotIndex,
        originalMoveId: 'mimic',
        mimickedMoveId: mimicMoveId
    };
    
    // Replace Mimic with the new move
    attacker.moves[mimicSlotIndex] = {
        id: mimicMoveId,
        pp: 5 // Mimic gives 5 PP
    };
    
    messageLog.push(`${attacker.species} learned ${mimicMove.name}!`);
    
    return;
}

// TODO: Restore Mimic on switch
// Location: rpg-refactor.ts, in switch handling
// When a Pokemon switches out, restore original move:

if (switchingSlot.mimickedMove) {
    const { originalSlot, originalMoveId } = switchingSlot.mimickedMove;
    switchingSlot.pokemon.moves[originalSlot] = {
        id: originalMoveId,
        pp: getMove(originalMoveId).pp
    };
    switchingSlot.mimickedMove = undefined;
}
```

**Testing:**
- [ ] Mimic replaces itself with target's move
- [ ] Mimicked move has 5 PP
- [ ] Mimic fails if already knows the move
- [ ] Original move is restored on switch

**Priority:** Medium

---

## Move 5: Assist

### Description
Calls a random move from a party member's moveset.

### Current Status
❌ Not Implemented

### Requirements
1. Access to full party (not just active Pokemon)
2. Select random move from party members
3. Exclude uncallable moves
4. Execute selected move

**Data Structure Changes:**
- No changes needed (party already accessible)

**Code Changes:**

```typescript
// TODO: Implement Assist
// Location: rpg-refactor.ts, around line 2050-2150

if (move.id === 'assist') {
    const player = getPlayerData(battle.playerId);
    
    // Get all moves from party members (excluding self)
    const partyMoves: string[] = [];
    for (const pokemon of player.party) {
        if (pokemon.id === attacker.id) continue; // Skip self
        
        for (const move of pokemon.moves) {
            partyMoves.push(move.id);
        }
    }
    
    if (partyMoves.length === 0) {
        messageLog.push(`But it failed!`);
        return;
    }
    
    // Filter out uncallable moves
    const uncallableMoves = [
        'assist', 'banefulbunker', 'bide', 'bounce', 'chatter', 'copycat',
        'counter', 'covet', 'destinybond', 'detect', 'dig', 'dive',
        'endure', 'feint', 'fly', 'focuspunch', 'followme', 'helpinghand',
        'kingsshield', 'matblock', 'mimic', 'mirrorcoat', 'mirrormove',
        'phantomforce', 'protect', 'ragepowder', 'shadowforce', 'sketch',
        'sleeptalk', 'snatch', 'spikyshield', 'struggle', 'switcheroo',
        'thief', 'transform', 'trick'
    ];
    
    const callableMoves = partyMoves.filter(m => !uncallableMoves.includes(m));
    
    if (callableMoves.length === 0) {
        messageLog.push(`But it failed!`);
        return;
    }
    
    // Select random move
    const assistMoveId = callableMoves[Math.floor(Math.random() * callableMoves.length)];
    const assistMove = getMove(assistMoveId);
    
    messageLog.push(`${attacker.species} used ${assistMove.name} via Assist!`);
    
    // Execute the move
    executeMoveWithoutPPDeduction(battle, attackerSlot, defenderSlot, assistMove, messageLog);
    
    return;
}
```

**Testing:**
- [ ] Assist calls random party member's move
- [ ] Assist doesn't call uncallable moves
- [ ] Assist fails if no callable moves available
- [ ] Assist works with party of various sizes

**Priority:** Low

---

## Move 6: Nature Power

### Description
Turns into different moves based on the terrain/location.

### Current Status
❌ Not Implemented

### Requirements
1. Terrain/location context
2. Map location to appropriate move
3. Execute the selected move

**Data Structure Changes:**

```typescript
// Add to BattleState if not already present
interface BattleState {
    // ... existing fields ...
    battleLocation?: string; // e.g., 'cave', 'grass', 'water', 'building', etc.
}
```

**Code Changes:**

```typescript
// TODO: Implement Nature Power
// Location: rpg-refactor.ts, around line 2150-2250

if (move.id === 'naturepower') {
    // Determine move based on terrain or location
    let naturePowerMove = 'triattack'; // Default
    
    // Check active terrain first
    if (battle.terrain) {
        switch (battle.terrain.type) {
            case 'electric':
                naturePowerMove = 'thunderbolt';
                break;
            case 'grassy':
                naturePowerMove = 'energyball';
                break;
            case 'misty':
                naturePowerMove = 'moonblast';
                break;
            case 'psychic':
                naturePowerMove = 'psychic';
                break;
        }
    }
    // Check location/zone if no terrain
    else if (battle.zoneId) {
        const zoneName = battle.zoneId.toLowerCase();
        
        if (zoneName.includes('grass') || zoneName.includes('forest')) {
            naturePowerMove = 'energyball';
        } else if (zoneName.includes('water') || zoneName.includes('pond') || zoneName.includes('ocean')) {
            naturePowerMove = 'hydropump';
        } else if (zoneName.includes('cave') || zoneName.includes('mountain')) {
            naturePowerMove = 'powergem';
        } else if (zoneName.includes('building') || zoneName.includes('town') || zoneName.includes('city')) {
            naturePowerMove = 'triattack';
        } else if (zoneName.includes('desert') || zoneName.includes('sand')) {
            naturePowerMove = 'earthpower';
        } else if (zoneName.includes('snow') || zoneName.includes('ice')) {
            naturePowerMove = 'icebeam';
        }
    }
    
    const selectedMove = getMove(naturePowerMove);
    messageLog.push(`${attacker.species} used ${selectedMove.name} via Nature Power!`);
    
    // Execute the move
    executeMoveWithoutPPDeduction(battle, attackerSlot, defenderSlot, selectedMove, messageLog);
    
    return;
}
```

**Testing:**
- [ ] Nature Power uses correct move for each terrain
- [ ] Nature Power uses correct move for each location
- [ ] Nature Power defaults to Tri Attack in neutral areas

**Priority:** Low

---

## Move 7: Snatch

### Description
Steals and uses beneficial moves targeted at opponents before they can use them.

### Current Status
❌ Not Implemented

### Requirements
1. Priority move (+4)
2. Intercept beneficial moves
3. Redirect move to user
4. Handle timing correctly

**Data Structure Changes:**

```typescript
// Add to ActivePokemonSlot interface
interface ActivePokemonSlot {
    // ... existing fields ...
    isSnatchActive?: boolean; // Active for one turn
}
```

**Code Changes:**

```typescript
// TODO: Implement Snatch
// Location: rpg-refactor.ts, around line 2250-2350

if (move.id === 'snatch') {
    attackerSlot.isSnatchActive = true;
    messageLog.push(`${attacker.species} is waiting to snatch a move!`);
    return;
}

// TODO: Add Snatch interception logic
// Location: rpg-refactor.ts, before executing beneficial status moves

function canBeSnatchedBy(move: Move, attackerSlot: ActivePokemonSlot, battle: BattleState): ActivePokemonSlot | null {
    // List of snatchable moves (beneficial status moves)
    const snatchableMoves = [
        'amnesia', 'aromatherapy', 'bellydrum', 'bulkup', 'calmmind',
        'camouflage', 'cosmicpower', 'cottonguard', 'curse', 'defensecurl',
        'doubleteam', 'dragondance', 'growth', 'harden', 'healbell',
        'honeclaws', 'howl', 'irondefense', 'meditate', 'milkdrink',
        'minimize', 'nastyplot', 'recover', 'rest', 'rockpolish',
        'roost', 'sharpen', 'shellsmash', 'shiftgear', 'slackoff',
        'softboiled', 'stockpile', 'substitute', 'swordsdance', 'tailwind',
        'workup'
    ];
    
    if (!snatchableMoves.includes(move.id)) {
        return null;
    }
    
    // Check if any opponent has Snatch active
    const isPlayerMove = battle.playerSlots.some(s => s?.pokemon.id === attackerSlot.pokemon.id);
    const opponentSlots = isPlayerMove ? battle.opponentSlots : battle.playerSlots;
    
    for (const slot of opponentSlots) {
        if (slot?.isSnatchActive) {
            return slot;
        }
    }
    
    return null;
}

// In executeMoveEffects, before applying beneficial move:
const snatcher = canBeSnatchedBy(move, attackerSlot, battle);
if (snatcher) {
    messageLog.push(`${snatcher.pokemon.species} snatched the move!`);
    snatcher.isSnatchActive = false;
    // Apply move effects to snatcher instead of original user
    applySelfBoosts(snatcher, move.boosts, messageLog);
    return;
}
```

**Testing:**
- [ ] Snatch has +4 priority
- [ ] Snatch intercepts beneficial moves
- [ ] Snatched move affects the snatcher
- [ ] Snatch only works for one turn
- [ ] Snatch doesn't affect damaging moves

**Priority:** Low (rarely used, complex)

---

## Move 8: Transform

### Description
Transforms into the target, copying all stats, moves, ability, and appearance.

### Current Status
❌ Not Implemented

### Requirements
1. Copy all relevant stats
2. Copy moves with 5 PP each
3. Copy ability and types
4. Maintain HP and status
5. Reset stat stages
6. Handle Ditto's Imposter ability

**Data Structure Changes:**

```typescript
// Add to ActivePokemonSlot interface
interface ActivePokemonSlot {
    // ... existing fields ...
    transformed?: {
        originalSpecies: string;
        originalMoves: { id: string, pp: number }[];
        originalAbility: string;
        originalStats: Stats;
    };
}
```

**Code Changes:**

```typescript
// TODO: Implement Transform
// Location: rpg-refactor.ts, around line 2350-2500

if (move.id === 'transform') {
    const targetSlot = getSlotFromIndex(battle, targetSlotIndex);
    
    if (!targetSlot) {
        messageLog.push(`But it failed!`);
        return;
    }
    
    const target = targetSlot.pokemon;
    
    // Can't transform into already transformed Pokemon or certain forms
    if (targetSlot.transformed) {
        messageLog.push(`But it failed!`);
        return;
    }
    
    // Store original data
    attackerSlot.transformed = {
        originalSpecies: attacker.species,
        originalMoves: [...attacker.moves],
        originalAbility: attacker.ability,
        originalStats: {
            maxHp: attacker.maxHp,
            atk: attacker.atk,
            def: attacker.def,
            spa: attacker.spa,
            spd: attacker.spd,
            spe: attacker.spe
        }
    };
    
    // Transform!
    attacker.species = target.species;
    attacker.ability = target.ability;
    
    // Copy stats (except HP)
    attacker.atk = target.atk;
    attacker.def = target.def;
    attacker.spa = target.spa;
    attacker.spd = target.spd;
    attacker.spe = target.spe;
    // Keep current HP and maxHp
    
    // Copy moves with 5 PP each
    attacker.moves = target.moves.map(m => ({
        id: m.id,
        pp: 5
    }));
    
    // Reset stat stages
    attackerSlot.statStages = {
        atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0
    };
    
    // Copy target's stat stages
    attackerSlot.statStages = { ...targetSlot.statStages };
    
    messageLog.push(`${attackerSlot.transformed.originalSpecies} transformed into ${target.species}!`);
    
    return;
}

// TODO: Revert Transform on switch
// Location: rpg-refactor.ts, in switch handling

if (switchingSlot.transformed) {
    const { originalSpecies, originalMoves, originalAbility, originalStats } = switchingSlot.transformed;
    
    // Restore original data
    switchingSlot.pokemon.species = originalSpecies;
    switchingSlot.pokemon.ability = originalAbility;
    switchingSlot.pokemon.moves = originalMoves;
    switchingSlot.pokemon.atk = originalStats.atk;
    switchingSlot.pokemon.def = originalStats.def;
    switchingSlot.pokemon.spa = originalStats.spa;
    switchingSlot.pokemon.spd = originalStats.spd;
    switchingSlot.pokemon.spe = originalStats.spe;
    // HP stays the same
    
    switchingSlot.transformed = undefined;
}
```

**Testing:**
- [ ] Transform copies target's species
- [ ] Transform copies target's stats (except HP)
- [ ] Transform copies target's moves with 5 PP
- [ ] Transform copies target's ability
- [ ] Transform copies stat stages
- [ ] Transform reverts on switch
- [ ] Transform fails on already-transformed Pokemon

**Priority:** Low (complex, rarely used)

**Estimated Effort:** 20-30 hours

---

## Move 9: Sketch

### Description
Permanently learns the target's last used move.

### Current Status
❌ Not Implemented

### Requirements
1. Track target's last move
2. Permanently replace Sketch with learned move
3. Save to Pokemon data (permanent change)
4. Handle edge cases

**Data Structure Changes:**
- No interface changes needed
- Requires permanent modification to Pokemon's moves array

**Code Changes:**

```typescript
// TODO: Implement Sketch
// Location: rpg-refactor.ts, around line 2500-2650

if (move.id === 'sketch') {
    const targetSlot = getSlotFromIndex(battle, targetSlotIndex);
    
    if (!targetSlot || !targetSlot.lastMoveUsed) {
        messageLog.push(`But it failed!`);
        return;
    }
    
    const sketchedMoveId = targetSlot.lastMoveUsed;
    const sketchedMove = getMove(sketchedMoveId);
    
    // Can't Sketch certain moves
    const unsketchableMoves = ['sketch', 'struggle', 'chatter'];
    if (unsketchableMoves.includes(sketchedMoveId)) {
        messageLog.push(`But it failed!`);
        return;
    }
    
    // Check if already knows the move
    if (attacker.moves.some(m => m.id === sketchedMoveId)) {
        messageLog.push(`But it failed!`);
        return;
    }
    
    // Find Sketch's slot
    const sketchSlotIndex = attacker.moves.findIndex(m => m.id === 'sketch');
    if (sketchSlotIndex === -1) {
        messageLog.push(`But it failed!`);
        return;
    }
    
    // PERMANENTLY replace Sketch with the new move
    attacker.moves[sketchSlotIndex] = {
        id: sketchedMoveId,
        pp: sketchedMove.pp || 5
    };
    
    messageLog.push(`${attacker.species} sketched ${sketchedMove.name}!`);
    
    // NOTE: This change is permanent and will persist after battle
    // because attacker is a reference to the Pokemon in the player's party
    
    return;
}
```

**Testing:**
- [ ] Sketch permanently learns target's move
- [ ] Sketch fails if target hasn't used a move
- [ ] Sketch can't sketch unsketchable moves
- [ ] Sketched move persists after battle
- [ ] Sketch fails if already knows the move

**Priority:** Very Low (extremely rare, permanent changes)

**Estimated Effort:** 15-20 hours

---

## Move 10: Metronome

### Description
Calls a random move from nearly all moves in the game.

### Current Status
❌ Not Implemented

### Requirements
1. Access to full Dex moves list
2. Filter out uncallable moves
3. Select random move
4. Execute selected move

**Data Structure Changes:**
- No changes needed

**Code Changes:**

```typescript
// TODO: Implement Metronome
// Location: rpg-refactor.ts, around line 2650-2800

if (move.id === 'metronome') {
    // Get all Dex moves
    const allMoveIds: string[] = [];
    for (const id in Dex.data.Moves) {
        const dexMove = Dex.moves.get(id);
        if (dexMove.exists && dexMove.num > 0) {
            allMoveIds.push(id);
        }
    }
    
    // Filter out uncallable moves
    const uncallableMoves = [
        'assist', 'banefulbunker', 'beakblast', 'belch', 'bestow',
        'celebrate', 'chatter', 'copycat', 'counter', 'covet',
        'craftyshield', 'destinybond', 'detect', 'diamondstorm',
        'dragonascent', 'endure', 'feint', 'focuspunch', 'followme',
        'freezeshock', 'happyhour', 'helpinghand', 'holdhands',
        'hyperspacefury', 'hyperspacehole', 'iceburn', 'kingsshield',
        'lightofruin', 'matblock', 'mefirst', 'metronome', 'mimic',
        'mirrorcoat', 'mirrormove', 'naturepower', 'originpulse',
        'precipiceblades', 'protect', 'quash', 'quickguard',
        'ragepowder', 'relicsong', 'secretsword', 'sketch', 'sleeptalk',
        'snarl', 'snatch', 'snore', 'spectralthief', 'spikyshield',
        'spotlight', 'steameruption', 'struggle', 'switcheroo',
        'technoblast', 'thief', 'thousandarrows', 'thousandwaves',
        'transform', 'trick', 'vcreate', 'wideguard'
    ];
    
    const callableMoves = allMoveIds.filter(id => !uncallableMoves.includes(id));
    
    if (callableMoves.length === 0) {
        messageLog.push(`But it failed!`);
        return;
    }
    
    // Select random move
    const metronomeMoveId = callableMoves[Math.floor(Math.random() * callableMoves.length)];
    const metronomeMove = getMove(metronomeMoveId);
    
    messageLog.push(`${attacker.species} waggles its finger...`);
    messageLog.push(`${attacker.species} used ${metronomeMove.name}!`);
    
    // Execute the random move
    executeMoveWithoutPPDeduction(battle, attackerSlot, defenderSlot, metronomeMove, messageLog);
    
    return;
}
```

**Testing:**
- [ ] Metronome calls a random move
- [ ] Metronome doesn't call uncallable moves
- [ ] Metronome can call damaging and status moves
- [ ] Metronome uses appropriate animations/messages

**Priority:** Very Low (gimmick move, rarely used competitively)

**Estimated Effort:** 6-8 hours

---

## Implementation Priority Recommendations

### Phase 1: High Priority (4-6 hours total)
1. **Sleep Talk** - Commonly used, relatively simple
2. **Nature Power** - Simple terrain-based logic

### Phase 2: Medium Priority (18-24 hours total)
3. **Copycat** - Requires move history tracking
4. **Mirror Move** - Similar to Copycat
5. **Mimic** - Temporary move replacement

### Phase 3: Low Priority (12-18 hours total)
6. **Assist** - Party access, filtering logic
7. **Metronome** - Random move selection

### Phase 4: Very Low Priority (45-62 hours total)
8. **Snatch** - Complex interception mechanics
9. **Transform** - Very complex stat/move copying
10. **Sketch** - Permanent move learning, requires save system

---

## Helper Functions Needed

These helper functions will be used by multiple moves:

```typescript
// TODO: Create helper function
// Location: rpg-refactor.ts, around line 600-700

/**
 * Execute a move without deducting PP from the move itself
 * Used by moves that call other moves (Sleep Talk, Copycat, etc.)
 */
function executeMoveWithoutPPDeduction(
    battle: BattleState,
    attackerSlot: ActivePokemonSlot,
    defenderSlot: ActivePokemonSlot,
    move: Move,
    messageLog: string[]
) {
    // Save original move
    const originalMove = attackerSlot.lastUsedMove;
    
    // Execute the move with all normal effects
    executeMoveEffects(battle, attackerSlot, defenderSlot, move, messageLog);
    
    // Restore original move (so PP isn't deducted from called move)
    attackerSlot.lastUsedMove = originalMove;
}

/**
 * Execute a move with a specific target
 * Used by moves that need to override target selection
 */
function executeMoveWithTarget(
    battle: BattleState,
    attackerSlot: ActivePokemonSlot,
    targetIndex: number,
    move: Move,
    messageLog: string[]
) {
    const targetSlot = getSlotFromIndex(battle, targetIndex);
    if (!targetSlot) {
        messageLog.push(`But it failed!`);
        return;
    }
    
    executeMoveWithoutPPDeduction(battle, attackerSlot, targetSlot, move, messageLog);
}
```

---

## Testing Strategy

### Unit Tests
Create test cases for each move in `/test/rpg-moves.test.ts`:

```typescript
// TODO: Add tests for unsupported moves
// Location: test/rpg-moves.test.ts

describe('Previously Unsupported Moves', () => {
    describe('Sleep Talk', () => {
        it('should fail when user is not asleep', () => { /* ... */ });
        it('should call a random move when asleep', () => { /* ... */ });
        it('should not deduct PP from called move', () => { /* ... */ });
    });
    
    describe('Copycat', () => {
        it('should fail when no move has been used', () => { /* ... */ });
        it('should copy the last move used', () => { /* ... */ });
        it('should not copy uncopyable moves', () => { /* ... */ });
    });
    
    // ... tests for each move
});
```

### Integration Tests
Test moves in actual battle scenarios:

1. Create test battles with specific setups
2. Execute moves and verify outcomes
3. Check edge cases (switching, status, etc.)

### Manual Testing Checklist
- [ ] Sleep Talk used while asleep
- [ ] Sleep Talk fails when awake
- [ ] Copycat copies opponent's move
- [ ] Mirror Move reflects move back
- [ ] Mimic replaces move temporarily
- [ ] Assist calls party member's move
- [ ] Nature Power changes with terrain
- [ ] Snatch steals beneficial moves
- [ ] Transform copies target completely
- [ ] Sketch permanently learns move
- [ ] Metronome calls random move

---

## Code Location Reference

All implementations should be added to:
- **File:** `/impulse/chat-plugins/rpg-wip/rpg-refactor.ts`
- **Section:** Special move implementations (around lines 1800-3000)
- **Pattern:** Add within `executeMoveEffects()` function

Each move should follow this pattern:

```typescript
if (move.id === 'movename') {
    // 1. Validation checks
    if (/* fail condition */) {
        messageLog.push(`But it failed!`);
        return;
    }
    
    // 2. Main effect logic
    // ... implementation ...
    
    // 3. Success message
    messageLog.push(`${attacker.species} used [move effect]!`);
    
    return;
}
```

---

## Dependencies and Prerequisites

Before implementing, ensure:

1. ✅ Build system is working (`npm run build`)
2. ✅ Test framework is set up
3. ✅ Dex is properly imported and accessible
4. ✅ getMove() helper function exists
5. ✅ All data structures are defined

---

## Timeline Estimate

| Phase | Duration | Cumulative |
|-------|----------|------------|
| Phase 1 | 1 day | 1 day |
| Phase 2 | 3 days | 4 days |
| Phase 3 | 2 days | 6 days |
| Phase 4 | 8 days | 14 days |
| Testing & Refinement | 1 day | 15 days |

**Total: 15 working days (3 weeks)**

---

## Success Criteria

Upon completion, the system should:

- ✅ Support 944/944 moves (100% coverage)
- ✅ Pass all unit tests
- ✅ Pass all integration tests
- ✅ Maintain backwards compatibility
- ✅ Have no performance regressions
- ✅ Be well-documented with examples

---

## Maintenance Notes

After implementing these moves:

1. Update `MOVE_IMPLEMENTATION_SUMMARY.md`
2. Update `check-moves.js` to reflect new status
3. Add moves to integration tests
4. Update any relevant documentation
5. Test in both singles and doubles battles

---

## Conclusion

This plan provides a roadmap to achieve **100% move coverage** in the RPG battle system. The moves are prioritized by:

1. **Usage frequency** (Sleep Talk is common, Sketch is rare)
2. **Implementation complexity** (Nature Power is simple, Transform is very complex)
3. **System impact** (Snatch affects turn order, Metronome is isolated)

Following this plan will bring move support from **98.9%** to **100%**, making the RPG system feature-complete for competitive Pokemon battles.

---

**Document Version:** 1.0  
**Last Updated:** 2025-11-04  
**Status:** Ready for Implementation
