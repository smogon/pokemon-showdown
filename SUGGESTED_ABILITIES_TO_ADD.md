# Suggested Popular Abilities to Add

**Date:** 2025-11-04  
**Current Abilities Implemented:** 81

This document suggests **popular, straightforward abilities** that would enhance the RPG system without requiring major changes or overly complex implementations.

---

## High Priority - Very Popular Abilities

These abilities are commonly used in competitive play and are relatively simple to implement:

### 1. **Intimidate** ⭐⭐⭐⭐⭐
**Popularity:** Extremely High  
**Complexity:** Low  
**Already Partially Implemented:** Yes (in applySwitchInAbilities)

**Current Status:** Already implemented in `applySwitchInAbilities()`  
**Note:** Just needs to be added to exported lists if not already there.

```typescript
// Already in applySwitchInAbilities() at line 1148-1165
```

---

### 2. **Thick Fat** ⭐⭐⭐⭐⭐
**Popularity:** Very High  
**Complexity:** Low  
**Category:** Damage Modifier

**Effect:** Halves damage from Fire and Ice-type moves

**Implementation:**
```typescript
// Add to DAMAGE_MODIFIER_ABILITIES or modify applyDamageModifier
'thickfat': (ctx, damage) => {
    if (ctx.move.type === 'Fire' || ctx.move.type === 'Ice') {
        return Math.floor(damage * 0.5);
    }
    return damage;
}
```

**Usage:** Very common on defensive Pokemon (Snorlax, Mamoswine, Azumarill)

---

### 3. **Moxie** ⭐⭐⭐⭐⭐
**Popularity:** Very High  
**Complexity:** Low  
**Category:** On KO Effect

**Effect:** Raises Attack by 1 stage when KOing an opponent

**Implementation:**
```typescript
// Add to applyContactAbilityEffects or create ON_KO_ABILITIES
export const ON_KO_ABILITIES = {
    'moxie': {
        onKO: (slot: ActivePokemonSlot, messageLog: string[]) => {
            if (slot.statStages.atk < 6) {
                slot.statStages.atk++;
                messageLog.push(`${slot.pokemon.species}'s Moxie raised its Attack!`);
            }
        }
    }
};
```

**Usage:** Extremely popular on offensive sweepers (Gyarados, Salamence, Heracross)

---

### 4. **Defiant** ⭐⭐⭐⭐
**Popularity:** High  
**Complexity:** Low  
**Category:** Stat Drop Response

**Effect:** Raises Attack by 2 stages when stats are lowered by opponent

**Implementation:**
```typescript
// Add to STAT_RESPONSE_ABILITIES
export const STAT_RESPONSE_ABILITIES = {
    'defiant': {
        onStatDrop: (slot: ActivePokemonSlot, messageLog: string[]) => {
            if (slot.statStages.atk < 6) {
                slot.statStages.atk = Math.min(6, slot.statStages.atk + 2);
                messageLog.push(`${slot.pokemon.species}'s Defiant raised its Attack!`);
            }
        }
    }
};
```

**Usage:** Popular on offensive Pokemon weak to Intimidate (Bisharp, Braviary)

---

### 5. **Competitive** ⭐⭐⭐⭐
**Popularity:** High  
**Complexity:** Low  
**Category:** Stat Drop Response

**Effect:** Raises Sp. Atk by 2 stages when stats are lowered by opponent

**Implementation:**
```typescript
// Add to STAT_RESPONSE_ABILITIES
'competitive': {
    onStatDrop: (slot: ActivePokemonSlot, messageLog: string[]) => {
        if (slot.statStages.spa < 6) {
            slot.statStages.spa = Math.min(6, slot.statStages.spa + 2);
            messageLog.push(`${slot.pokemon.species}'s Competitive raised its Sp. Atk!`);
        }
    }
}
```

**Usage:** Popular on special attackers (Milotic, Serperior)

---

### 6. **Speed Boost** ⭐⭐⭐⭐⭐
**Popularity:** Very High  
**Complexity:** Low  
**Category:** End of Turn Effect

**Effect:** Raises Speed by 1 stage at the end of each turn

**Implementation:**
```typescript
// Add to END_OF_TURN_ABILITIES
export const END_OF_TURN_ABILITIES = {
    'speedboost': {
        onEndOfTurn: (slot: ActivePokemonSlot, messageLog: string[]) => {
            if (slot.statStages.spe < 6) {
                slot.statStages.spe++;
                messageLog.push(`${slot.pokemon.species}'s Speed Boost raised its Speed!`);
            }
        }
    }
};
```

**Usage:** Extremely popular (Blaziken, Ninjask, Scolipede)

---

### 7. **Poison Heal** ⭐⭐⭐⭐
**Popularity:** High  
**Complexity:** Low  
**Category:** Status Interaction

**Effect:** Heals 1/8 HP instead of taking damage when poisoned

**Implementation:**
```typescript
// Modify status damage handler
function applyEndOfTurnStatusDamage(slot: ActivePokemonSlot, messageLog: string[]) {
    const ability = toID(slot.pokemon.ability || '');
    
    if (slot.status === 'psn' || slot.status === 'tox') {
        if (ability === 'poisonheal') {
            const healAmount = Math.floor(slot.pokemon.maxHp / 8);
            slot.pokemon.hp = Math.min(slot.pokemon.maxHp, slot.pokemon.hp + healAmount);
            messageLog.push(`${slot.pokemon.species} was healed by its Poison Heal!`);
            return;
        }
        // Normal poison damage...
    }
}
```

**Usage:** Popular on Gliscor, Breloom

---

### 8. **Truant** ⭐⭐⭐
**Popularity:** Moderate (Niche but iconic)  
**Complexity:** Low  
**Category:** Turn Skipping

**Effect:** Pokemon can only attack every other turn

**Implementation:**
```typescript
// Add turn counter to slot
interface ActivePokemonSlot {
    truantTurn?: boolean;
}

// Check before move execution
if (toID(attacker.ability) === 'truant') {
    if (attackerSlot.truantTurn) {
        messageLog.push(`${attacker.species} is loafing around!`);
        attackerSlot.truantTurn = false;
        return; // Skip turn
    }
    attackerSlot.truantTurn = true;
}
```

**Usage:** Slaking, meme strategies

---

## Medium Priority - Popular Competitive Abilities

### 9. **Contrary** ⭐⭐⭐⭐
**Popularity:** High  
**Complexity:** Medium  
**Category:** Stat Stage Reversal

**Effect:** Inverts stat changes

**Implementation:**
```typescript
// Modify stat change logic
function applyStatChange(slot: ActivePokemonSlot, stat: string, stages: number) {
    const ability = toID(slot.pokemon.ability || '');
    if (ability === 'contrary') {
        stages = -stages; // Reverse the change
    }
    slot.statStages[stat] = Math.max(-6, Math.min(6, slot.statStages[stat] + stages));
}
```

**Usage:** Extremely popular with Serperior (Leaf Storm), Malamar

---

### 10. **Unaware** ⭐⭐⭐⭐
**Popularity:** High  
**Complexity:** Low  
**Category:** Stat Stage Ignoring

**Effect:** Ignores opponent's stat stages when calculating damage

**Implementation:**
```typescript
// Modify damage calculation
'unaware': (ctx, damage) => {
    // When calculating damage, ignore target's defensive stat stages
    // This is handled in the stat stage multiplier calculation
    return damage;
}

// In getStatMultiplier:
if (toID(defender.ability) === 'unaware') {
    // Don't apply attacker's offensive stat stages
}
```

**Usage:** Popular on walls (Quagsire, Clefable)

---

### 11. **Simple** ⭐⭐⭐
**Popularity:** Moderate  
**Complexity:** Low  
**Category:** Stat Stage Doubling

**Effect:** Stat changes are doubled

**Implementation:**
```typescript
// Modify stat change logic
function applyStatChange(slot: ActivePokemonSlot, stat: string, stages: number) {
    const ability = toID(slot.pokemon.ability || '');
    if (ability === 'simple') {
        stages = stages * 2; // Double all changes
    }
    slot.statStages[stat] = Math.max(-6, Math.min(6, slot.statStages[stat] + stages));
}
```

**Usage:** Bibarel, Swoobat (niche but fun)

---

### 12. **Drought** (Rock Head variant) - **Already Implemented!** ✅

**Note:** Drought is already implemented. Same for Drizzle, Sand Stream, Snow Warning.

---

### 13. **Steelworker** ⭐⭐⭐
**Popularity:** Moderate  
**Complexity:** Low  
**Category:** Power Modifier

**Effect:** 1.5x power for Steel-type moves

**Implementation:**
```typescript
// Add to POWER_MODIFIER_ABILITIES
'steelworker': (ctx, basePower) => {
    if (ctx.move.type === 'Steel') {
        return Math.floor(basePower * 1.5);
    }
    return basePower;
}
```

**Usage:** Dhelmise (iconic), would be useful for steel types

---

### 14. **Gorilla Tactics** ⭐⭐⭐⭐
**Popularity:** High  
**Complexity:** Low  
**Category:** Choice-like Stat Modifier

**Effect:** 1.5x Attack but can only use first move (like Choice Band)

**Implementation:**
```typescript
// Add to STAT_MODIFIER_ABILITIES
'gorillatactics': (pokemon, stat, value, slot) => {
    if (stat === 'atk') {
        return Math.floor(value * 1.5);
    }
    return value;
}

// Add choice lock logic (similar to holding Choice Band)
```

**Usage:** Darmanitan-Galar

---

### 15. **Inner Focus** ⭐⭐⭐
**Popularity:** Moderate  
**Complexity:** Very Low  
**Category:** Flinch Immunity

**Effect:** Prevents flinching

**Implementation:**
```typescript
// In flinch check
function canFlinch(pokemon: RPGPokemon): boolean {
    const ability = toID(pokemon.ability || '');
    if (ability === 'innerfocus') {
        return false;
    }
    return true;
}
```

**Usage:** Common utility ability

---

## Lower Priority - Still Popular But Less Critical

### 16. **Shed Skin** ⭐⭐⭐
**Effect:** 30% chance to cure status at end of turn  
**Complexity:** Low

### 17. **Poison Touch** ⭐⭐⭐
**Effect:** 30% chance to poison on contact  
**Complexity:** Low  
**Note:** Similar to existing contact abilities

### 18. **Harvest** ⭐⭐⭐
**Effect:** 50% chance to restore berry at end of turn (100% in sun)  
**Complexity:** Medium (requires berry/item handling)

### 19. **Scrappy** ⭐⭐⭐
**Effect:** Fighting and Normal moves hit Ghost types  
**Complexity:** Low

### 20. **Telepathy** ⭐⭐
**Effect:** Avoid damage from allies in doubles  
**Complexity:** Low (already have doubles support)

---

## Excluded Abilities (Too Complex or Require Major Changes)

These abilities are NOT recommended due to complexity:

❌ **Imposter** - Requires Transform-like mechanics  
❌ **Protean** - Changes type before every move  
❌ **Libero** - Same as Protean  
❌ **Stance Change** - Already implemented but very complex  
❌ **Forecast** - Weather-based form changes  
❌ **Trace** - Copies opponent ability  
❌ **Mold Breaker** - Ignores opponent abilities (complex)  
❌ **Wonder Guard** - Already implemented (very complex logic)  
❌ **Moody** - Random stat changes (complex, banned in competitive)  
❌ **Illusion** - Disguise mechanic (very complex)  
❌ **Zen Mode** - HP-based form change (complex)

---

## Implementation Priority Ranking

### Tier 1 (Highest Impact, Easiest to Implement)
1. **Thick Fat** - Very common, trivial to implement
2. **Moxie** - Extremely popular, simple KO trigger
3. **Speed Boost** - Very popular, end-of-turn trigger
4. **Intimidate** - Already partially done
5. **Inner Focus** - Trivial implementation

### Tier 2 (High Impact, Moderate Effort)
6. **Defiant** - Popular, needs stat drop detection
7. **Competitive** - Same as Defiant
8. **Poison Heal** - Popular, modify status logic
9. **Contrary** - Very popular, modify stat logic
10. **Gorilla Tactics** - Popular, simple stat boost

### Tier 3 (Moderate Impact, Worth Adding)
11. **Unaware** - Good for walls, stat calc change
12. **Steelworker** - Simple power modifier
13. **Truant** - Iconic, turn counter
14. **Simple** - Fun ability, stat modifier
15. **Scrappy** - Useful utility

---

## Code Structure for New Abilities

### For KO Abilities (Moxie)
```typescript
export const ON_KO_ABILITIES: Record<string, { onKO: (slot: ActivePokemonSlot, messageLog: string[]) => void }> = {
    'moxie': {
        onKO: (slot, messageLog) => {
            if (slot.statStages.atk < 6) {
                slot.statStages.atk++;
                messageLog.push(`${slot.pokemon.species}'s Moxie raised its Attack!`);
            }
        }
    }
};
```

### For End of Turn Abilities (Speed Boost)
```typescript
export const END_OF_TURN_ABILITIES: Record<string, { onEndOfTurn: (slot: ActivePokemonSlot, messageLog: string[]) => void }> = {
    'speedboost': {
        onEndOfTurn: (slot, messageLog) => {
            if (slot.statStages.spe < 6) {
                slot.statStages.spe++;
                messageLog.push(`${slot.pokemon.species}'s Speed Boost raised its Speed!`);
            }
        }
    }
};
```

### For Stat Response Abilities (Defiant, Competitive)
```typescript
export const STAT_DROP_RESPONSE_ABILITIES: Record<string, { onStatDrop: (slot: ActivePokemonSlot, messageLog: string[]) => void }> = {
    'defiant': {
        onStatDrop: (slot, messageLog) => {
            if (slot.statStages.atk < 6) {
                slot.statStages.atk = Math.min(6, slot.statStages.atk + 2);
                messageLog.push(`${slot.pokemon.species}'s Defiant raised its Attack!`);
            }
        }
    },
    'competitive': {
        onStatDrop: (slot, messageLog) => {
            if (slot.statStages.spa < 6) {
                slot.statStages.spa = Math.min(6, slot.statStages.spa + 2);
                messageLog.push(`${slot.pokemon.species}'s Competitive raised its Sp. Atk!`);
            }
        }
    }
};
```

---

## Integration Points Needed

### 1. KO Detection
```typescript
// In damage calculation, after HP drops to 0
if (defender.hp <= 0) {
    const attackerAbility = toID(attacker.ability || '');
    if (ON_KO_ABILITIES[attackerAbility]) {
        ON_KO_ABILITIES[attackerAbility].onKO(attackerSlot, messageLog);
    }
}
```

### 2. End of Turn Processing
```typescript
// After each turn
function processEndOfTurn(battle: BattleState, messageLog: string[]) {
    for (const slot of [...battle.playerSlots, ...battle.opponentSlots]) {
        if (slot && slot.pokemon.hp > 0) {
            const ability = toID(slot.pokemon.ability || '');
            if (END_OF_TURN_ABILITIES[ability]) {
                END_OF_TURN_ABILITIES[ability].onEndOfTurn(slot, messageLog);
            }
        }
    }
}
```

### 3. Stat Drop Detection
```typescript
// When stats are lowered by opponent
function lowerStat(slot: ActivePokemonSlot, stat: string, stages: number, messageLog: string[]) {
    // Apply the stat drop
    slot.statStages[stat] = Math.max(-6, slot.statStages[stat] - stages);
    
    // Check for response abilities
    const ability = toID(slot.pokemon.ability || '');
    if (STAT_DROP_RESPONSE_ABILITIES[ability]) {
        STAT_DROP_RESPONSE_ABILITIES[ability].onStatDrop(slot, messageLog);
    }
}
```

---

## Estimated Implementation Time

| Tier | Abilities | Total Time |
|------|-----------|------------|
| Tier 1 (5 abilities) | Thick Fat, Moxie, Speed Boost, Intimidate, Inner Focus | 4-6 hours |
| Tier 2 (5 abilities) | Defiant, Competitive, Poison Heal, Contrary, Gorilla Tactics | 6-10 hours |
| Tier 3 (5 abilities) | Unaware, Steelworker, Truant, Simple, Scrappy | 5-8 hours |
| **Total (15 abilities)** | | **15-24 hours** |

---

## Testing Checklist

For each ability:
- [ ] Test in singles battle
- [ ] Test in doubles battle
- [ ] Test with multiple Pokemon having the ability
- [ ] Test edge cases (max stat stages, etc.)
- [ ] Test interaction with existing abilities
- [ ] Verify messages display correctly

---

## Summary

**Top 5 Recommended Abilities to Add First:**
1. ✅ **Thick Fat** - Trivial, very useful
2. ✅ **Moxie** - Very popular, simple
3. ✅ **Speed Boost** - Extremely popular, simple
4. ✅ **Defiant** - Common, useful counter
5. ✅ **Competitive** - Common, useful counter

These 5 abilities would:
- Be used by dozens of popular Pokemon
- Require minimal code changes
- Add significant strategic depth
- Be easy to test and maintain

**Avoid implementing:**
- Transform-like abilities (Imposter)
- Type-changing abilities (Protean, Libero)
- Ability-copying abilities (Trace)
- Complex form changes (Forecast)
- Banned abilities (Moody)

---

**Document Version:** 1.0  
**Last Updated:** 2025-11-04  
**Status:** Ready for Implementation
