# Hardcoded Abilities Analysis and Updated Suggestions

**Date:** 2025-11-04  
**Purpose:** Identify abilities hardcoded in rpg-refactor.ts and provide updated implementation suggestions

---

## Executive Summary

**14 abilities are hardcoded** directly in rpg-refactor.ts that should be moved to abilities.ts for better organization and maintainability.

**Current Status:**
- 81 abilities in abilities.ts (organized by category)
- 14 abilities hardcoded in rpg-refactor.ts (scattered throughout code)
- 8 abilities are duplicated (exist in both files)

**Recommendation:** Move hardcoded abilities to abilities.ts and update suggestions accordingly.

---

## Hardcoded Abilities Found

### ✗ NOT in abilities.ts (Should be moved - 14 abilities)

1. **angerpoint** - Max Attack on critical hit (line 1457)
2. **beastboost** - Highest stat +1 on KO (line 2989)
3. **chillingneigh** - +1 Attack on KO (line 2987)
4. **competitive** - +2 Sp.Atk when stats lowered (lines 1842, 3043)
5. **contrary** - Reverses stat changes (lines 1590, 1669, 1882, 2529, 2559, 3400)
6. **defiant** - +2 Attack when stats lowered (lines 1837, 3043)
7. **disguise** - Blocks first damaging attack (line 4404)
8. **download** - +1 Attack or Sp.Atk on switch-in (line 3279)
9. **frisk** - Reveals opponent's item (line 3270)
10. **hydration** - Cures status in rain (line 3690)
11. **moxie** - +1 Attack on KO (line 2987)
12. **poisonheal** - Heals 1/8 HP when poisoned (line 2711)
13. **pressure** - Forces extra PP usage (line 4882)
14. **simple** - Doubles stat changes (lines 3404, 3408)
15. **speedboost** - +1 Speed each turn (line 2926)
16. **trace** - Copies opponent ability (line 3293)

### ✓ Already in abilities.ts (8 abilities)

These are implemented in both places (should consolidate):
1. **analytic** - 1.3x power when moving last
2. **dryskin** - Heals from Water, hurt by Fire
3. **icebody** - Heals in hail
4. **lightningrod** - Absorbs Electric moves
5. **raindish** - Heals in rain
6. **solarpower** - 1.5x Sp.Atk in sun, takes damage
7. **stormdrain** - Absorbs Water moves
8. **unburden** - Doubles Speed after item consumption

---

## Location Details in rpg-refactor.ts

### On-KO Abilities (lines 2987-2990)
```typescript
if (ability === 'moxie' || ability === 'chillingneigh') {
    // +1 Attack
} else if (ability === 'beastboost') {
    // +1 to highest stat
}
```

### Stat Drop Response (lines 1837-1847, 3043)
```typescript
if (ability === 'defiant') {
    // +2 Attack when stats lowered
} else if (ability === 'competitive') {
    // +2 Sp.Atk when stats lowered
}
```

### Contrary (multiple locations)
```typescript
if (toID(attacker.ability || '') === 'contrary') {
    // Reverse stat changes
}
```

### Simple (lines 3404, 3408)
```typescript
if (ability === 'simple') {
    stages *= 2; // Double stat changes
}
```

### Speed Boost (line 2926)
```typescript
if (ability === 'speedboost' && slot.statStages.spe < 6) {
    slot.statStages.spe++;
}
```

### Poison Heal (line 2711)
```typescript
if (ability === 'poisonheal' && pokemon.hp < pokemon.maxHp) {
    // Heal instead of taking poison damage
}
```

### Weather Healing (lines 3678-3690)
```typescript
if (battle.weather!.type === 'rain' && ability === 'raindish') {
    // Heal in rain
} else if (battle.weather!.type === 'hail' && ability === 'icebody') {
    // Heal in hail
} else if (battle.weather!.type === 'rain' && ability === 'hydration') {
    // Cure status in rain
}
```

### Switch-In Abilities (lines 3270-3293)
```typescript
if (ability === 'frisk') {
    // Reveal opponent's item
}
if (ability === 'download') {
    // +1 Attack or Sp.Atk based on opponent's defense
}
if (ability === 'trace') {
    // Copy opponent's ability
}
```

### Other Locations
- **angerpoint** (line 1457) - Max Attack on critical hit
- **disguise** (line 4404) - First hit immunity
- **pressure** (line 4882) - Extra PP consumption
- **unburden** (line 4438) - Speed boost after item loss

---

## Updated Implementation Recommendations

### Priority 1: Move Hardcoded Abilities to abilities.ts (HIGHEST PRIORITY)

These are **already implemented** in rpg-refactor.ts and just need to be **organized** into abilities.ts:

#### 1. **Moxie** ⭐⭐⭐⭐⭐ (Already Implemented)
**Status:** Hardcoded in rpg-refactor.ts line 2987  
**Action:** Move to ON_KO_ABILITIES in abilities.ts

```typescript
// Currently at line 2987 in rpg-refactor.ts
if (ability === 'moxie' || ability === 'chillingneigh') {
    if (participantSlot.statStages.atk < 6) {
        participantSlot.statStages.atk++;
        messageLog.push(`${participantSlot.pokemon.species}'s ${participantSlot.pokemon.ability} raised its Attack!`);
    }
}
```

**Move to abilities.ts:**
```typescript
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

#### 2. **Speed Boost** ⭐⭐⭐⭐⭐ (Already Implemented)
**Status:** Hardcoded in rpg-refactor.ts line 2926  
**Action:** Move to END_OF_TURN_ABILITIES in abilities.ts

```typescript
// Currently at line 2926
if (ability === 'speedboost' && slot.statStages.spe < 6) {
    slot.statStages.spe++;
    messageLog.push(`${pokemon.species}'s Speed Boost raised its Speed!`);
}
```

#### 3. **Defiant** ⭐⭐⭐⭐ (Already Implemented)
**Status:** Hardcoded in rpg-refactor.ts lines 1837, 3043  
**Action:** Move to STAT_DROP_RESPONSE_ABILITIES in abilities.ts

```typescript
// Currently at line 1837, 3043
if (ability === 'defiant') {
    if (targetSlot.statStages.atk < 6) {
        targetSlot.statStages.atk = Math.min(6, targetSlot.statStages.atk + 2);
        messageLog.push(`${targetSlot.pokemon.species}'s Defiant raised its Attack!`);
    }
}
```

#### 4. **Competitive** ⭐⭐⭐⭐ (Already Implemented)
**Status:** Hardcoded in rpg-refactor.ts lines 1842, 3043  
**Action:** Move to STAT_DROP_RESPONSE_ABILITIES in abilities.ts

#### 5. **Poison Heal** ⭐⭐⭐⭐ (Already Implemented)
**Status:** Hardcoded in rpg-refactor.ts line 2711  
**Action:** Move to STATUS_INTERACTION_ABILITIES in abilities.ts

#### 6. **Contrary** ⭐⭐⭐⭐ (Already Implemented)
**Status:** Hardcoded in multiple locations (1590, 1669, 1882, 2529, 2559, 3400)  
**Action:** Move to STAT_CHANGE_MODIFYING_ABILITIES in abilities.ts

#### 7. **Simple** ⭐⭐⭐ (Already Implemented)
**Status:** Hardcoded in rpg-refactor.ts lines 3404, 3408  
**Action:** Move to STAT_CHANGE_MODIFYING_ABILITIES in abilities.ts

#### 8. **Chillingneigh** ⭐⭐⭐ (Already Implemented)
**Status:** Hardcoded in rpg-refactor.ts line 2987  
**Action:** Move to ON_KO_ABILITIES in abilities.ts (similar to Moxie)

#### 9. **Beast Boost** ⭐⭐⭐ (Already Implemented)
**Status:** Hardcoded in rpg-refactor.ts line 2989  
**Action:** Move to ON_KO_ABILITIES in abilities.ts

#### 10. **Hydration** ⭐⭐⭐ (Already Implemented)
**Status:** Hardcoded in rpg-refactor.ts line 3690  
**Action:** Move to WEATHER_ABILITIES in abilities.ts

#### 11. **Anger Point** ⭐⭐ (Already Implemented)
**Status:** Hardcoded in rpg-refactor.ts line 1457  
**Action:** Move to CRITICAL_HIT_ABILITIES in abilities.ts

#### 12. **Download** ⭐⭐⭐ (Already Implemented)
**Status:** Hardcoded in rpg-refactor.ts line 3279  
**Action:** Move to switch-in abilities

#### 13. **Frisk** ⭐⭐ (Already Implemented)
**Status:** Hardcoded in rpg-refactor.ts line 3270  
**Action:** Move to switch-in abilities

#### 14. **Pressure** ⭐⭐⭐ (Already Implemented)
**Status:** Hardcoded in rpg-refactor.ts line 4882  
**Action:** Move to PP_INTERACTION_ABILITIES in abilities.ts

#### 15. **Disguise** ⭐⭐⭐⭐ (Already Implemented - COMPLEX)
**Status:** Hardcoded in rpg-refactor.ts line 4404  
**Action:** Keep hardcoded (form change mechanic, very complex)

#### 16. **Trace** ⭐⭐⭐ (Already Implemented - COMPLEX)
**Status:** Hardcoded in rpg-refactor.ts line 3293  
**Action:** Keep hardcoded or move to specialized category (copies abilities)

---

## Updated Suggestions with Priorities

### Tier 1: Already Implemented, Just Need Organization (HIGHEST PRIORITY)

**Action Required:** Move from rpg-refactor.ts to abilities.ts

1. ✅ **Moxie** - Already working (line 2987)
2. ✅ **Speed Boost** - Already working (line 2926)
3. ✅ **Defiant** - Already working (lines 1837, 3043)
4. ✅ **Competitive** - Already working (lines 1842, 3043)
5. ✅ **Poison Heal** - Already working (line 2711)
6. ✅ **Contrary** - Already working (multiple lines)
7. ✅ **Simple** - Already working (lines 3404, 3408)
8. ✅ **Chillingneigh** - Already working (line 2987)
9. ✅ **Beast Boost** - Already working (line 2989)
10. ✅ **Hydration** - Already working (line 3690)
11. ✅ **Anger Point** - Already working (line 1457)
12. ✅ **Download** - Already working (line 3279)
13. ✅ **Frisk** - Already working (line 3270)
14. ✅ **Pressure** - Already working (line 4882)

**Effort:** 8-12 hours to organize (mostly copy-paste and testing)

### Tier 2: New Abilities to Add (From Previous Suggestions)

These were in the original suggestions and should still be added:

1. **Thick Fat** - Halves Fire/Ice damage (NEW)
2. **Inner Focus** - Prevents flinching (NEW)
3. **Unaware** - Ignores stat stages (NEW)
4. **Gorilla Tactics** - 1.5x Attack, locked to first move (NEW)
5. **Steelworker** - 1.5x Steel-type moves (NEW)
6. **Truant** - Can only move every other turn (NEW)
7. **Scrappy** - Normal/Fighting hit Ghost (NEW)
8. **Shed Skin** - 30% cure status end of turn (NEW)
9. **Poison Touch** - 30% poison on contact (NEW)
10. **Harvest** - 50% restore berry (NEW)

**Effort:** 10-15 hours for new implementations

### Tier 3: Complex Abilities (Keep Hardcoded or Don't Add)

These should stay hardcoded due to complexity:

1. **Disguise** - Keep hardcoded (form change)
2. **Trace** - Keep hardcoded or special category (ability copying)

---

## Recommended Implementation Plan

### Phase 1: Organization (Week 1 - 8-12 hours)

**Move hardcoded abilities to abilities.ts with proper categories:**

1. Create new categories in abilities.ts:
   ```typescript
   export const ON_KO_ABILITIES: Record<string, OnKOHandler> = {
       'moxie': { ... },
       'chillingneigh': { ... },
       'beastboost': { ... }
   };
   
   export const STAT_DROP_RESPONSE_ABILITIES: Record<string, StatDropHandler> = {
       'defiant': { ... },
       'competitive': { ... }
   };
   
   export const STAT_CHANGE_MODIFYING_ABILITIES: Record<string, StatChangeModifier> = {
       'contrary': { ... },
       'simple': { ... }
   };
   
   export const STATUS_INTERACTION_ABILITIES: Record<string, StatusHandler> = {
       'poisonheal': { ... },
       'hydration': { ... }
   };
   
   export const PP_INTERACTION_ABILITIES: Record<string, PPHandler> = {
       'pressure': { ... }
   };
   ```

2. Update rpg-refactor.ts to use abilities.ts functions:
   ```typescript
   // Instead of:
   if (ability === 'moxie') { ... }
   
   // Use:
   if (ON_KO_ABILITIES[ability]) {
       ON_KO_ABILITIES[ability].onKO(slot, messageLog);
   }
   ```

3. Add integration points in rpg-refactor.ts:
   - KO detection → ON_KO_ABILITIES
   - End of turn → END_OF_TURN_ABILITIES (already exists)
   - Stat drops → STAT_DROP_RESPONSE_ABILITIES
   - Status damage → STATUS_INTERACTION_ABILITIES

4. Test all moved abilities in singles and doubles

### Phase 2: New Abilities (Week 2 - 10-15 hours)

Add the remaining popular abilities from Tier 2.

---

## Code Structure Example

### New Categories Needed

```typescript
// In abilities.ts

export interface OnKOHandler {
    onKO: (slot: ActivePokemonSlot, messageLog: string[]) => void;
}

export interface StatDropHandler {
    onStatDrop: (slot: ActivePokemonSlot, stat: string, messageLog: string[]) => void;
}

export interface StatChangeModifier {
    modifyStatChange: (stages: number) => number;
}

export interface StatusHandler {
    handleStatus: (slot: ActivePokemonSlot, messageLog: string[]) => void;
}

export interface PPHandler {
    modifyPPUsage: (basePP: number) => number;
}
```

### Integration Example

```typescript
// In rpg-refactor.ts, after a Pokemon faints

// Check for KO abilities
const koAbility = toID(attackerSlot.pokemon.ability || '');
if (RPGAbilities.ON_KO_ABILITIES && RPGAbilities.ON_KO_ABILITIES[koAbility]) {
    RPGAbilities.ON_KO_ABILITIES[koAbility].onKO(attackerSlot, messageLog);
}
```

---

## Summary Table

| Ability | Status | Priority | Location | Action |
|---------|--------|----------|----------|--------|
| Moxie | ✅ Implemented | High | Line 2987 | Move to abilities.ts |
| Speed Boost | ✅ Implemented | High | Line 2926 | Move to abilities.ts |
| Defiant | ✅ Implemented | High | Lines 1837, 3043 | Move to abilities.ts |
| Competitive | ✅ Implemented | High | Lines 1842, 3043 | Move to abilities.ts |
| Poison Heal | ✅ Implemented | High | Line 2711 | Move to abilities.ts |
| Contrary | ✅ Implemented | High | Multiple | Move to abilities.ts |
| Simple | ✅ Implemented | Medium | Lines 3404, 3408 | Move to abilities.ts |
| Chillingneigh | ✅ Implemented | Medium | Line 2987 | Move to abilities.ts |
| Beast Boost | ✅ Implemented | Medium | Line 2989 | Move to abilities.ts |
| Hydration | ✅ Implemented | Medium | Line 3690 | Move to abilities.ts |
| Anger Point | ✅ Implemented | Medium | Line 1457 | Move to abilities.ts |
| Download | ✅ Implemented | Medium | Line 3279 | Move to abilities.ts |
| Frisk | ✅ Implemented | Low | Line 3270 | Move to abilities.ts |
| Pressure | ✅ Implemented | Medium | Line 4882 | Move to abilities.ts |
| Disguise | ✅ Implemented | Medium | Line 4404 | Keep hardcoded (complex) |
| Trace | ✅ Implemented | Low | Line 3293 | Keep hardcoded (complex) |
| **Thick Fat** | ❌ Not Implemented | High | N/A | Add new |
| **Inner Focus** | ❌ Not Implemented | High | N/A | Add new |
| **Unaware** | ❌ Not Implemented | High | N/A | Add new |
| **Gorilla Tactics** | ❌ Not Implemented | Medium | N/A | Add new |
| **Steelworker** | ❌ Not Implemented | Medium | N/A | Add new |

---

## Effort Breakdown

### Refactoring Hardcoded Abilities
- Create new categories: 2 hours
- Move 14 abilities: 4 hours
- Update rpg-refactor.ts integration: 2 hours
- Testing: 2 hours
- **Total: 10 hours**

### Adding New Abilities (Top 5)
- Thick Fat: 1 hour
- Inner Focus: 1 hour
- Unaware: 2 hours
- Gorilla Tactics: 2 hours
- Steelworker: 1 hour
- **Total: 7 hours**

### Grand Total: 17 hours (2-3 days)

---

## Benefits of Organization

### Before (Current State)
- ❌ Abilities scattered across 4000+ lines
- ❌ Hard to find ability implementations
- ❌ Difficult to add new abilities
- ❌ No clear structure for ability types
- ❌ Code duplication possible

### After (Organized)
- ✅ All abilities in one file (abilities.ts)
- ✅ Clear categories and structure
- ✅ Easy to add new abilities
- ✅ Consistent implementation pattern
- ✅ Better maintainability
- ✅ Easier to test

---

## Testing Checklist

For each moved ability:
- [ ] Test in singles battle
- [ ] Test in doubles battle
- [ ] Test edge cases
- [ ] Verify messages display correctly
- [ ] Confirm no regression in existing functionality

---

## Conclusion

**Current State:**
- 81 abilities in abilities.ts ✅
- 14 abilities hardcoded in rpg-refactor.ts ⚠️
- System works but organization could be improved

**Recommended Action:**
1. **Phase 1 (High Priority):** Move 14 hardcoded abilities to abilities.ts (10 hours)
2. **Phase 2 (Medium Priority):** Add 5-10 new popular abilities (7-15 hours)

**Total System After Implementation:**
- ~95-105 abilities properly organized in abilities.ts ✅
- Better code organization ✅
- Easier to maintain and extend ✅

---

**Document Version:** 1.0  
**Last Updated:** 2025-11-04  
**Status:** Ready for Implementation
