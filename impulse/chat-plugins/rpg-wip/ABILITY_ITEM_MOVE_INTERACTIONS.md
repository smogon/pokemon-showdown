# Ability-Item-Move Interaction Matrix

## Overview
This document maps all interactions between abilities, held items, and moves to ensure comprehensive coverage.

## Critical Interactions

### 1. Ability + Item Interactions

#### Klutz + All Held Items
- **Status**: ❌ NOT IMPLEMENTED
- **Expected**: Pokemon with Klutz cannot use held items
- **Action Required**: Add Klutz check before all item effects

#### Unburden + Item Consumption
- **Status**: ⚠️ PARTIALLY IMPLEMENTED
- **Expected**: Speed doubles when item is consumed
- **Current**: Item consumption tracked, speed boost not applied
- **Action Required**: Apply speed boost when items consumed

#### Sticky Hold + Item Removal Moves
- **Status**: ✅ IMPLEMENTED
- **Verified**: Blocks Knock Off, Thief, Covet, Trick, Switcheroo

#### Magic Guard + Life Orb/Items
- **Status**: ❌ NOT IMPLEMENTED
- **Expected**: Prevents Life Orb recoil, Sticky Barb damage, etc.
- **Action Required**: Check Magic Guard before indirect damage

#### Multitype + Plates
- **Status**: ❌ NOT IMPLEMENTED
- **Expected**: Arceus changes type based on plate held
- **Action Required**: Special form-change logic

#### Prankster + Lagging Tail/Full Incense
- **Status**: ❌ NOT IMPLEMENTED
- **Expected**: Priority modifier affects turn order
- **Action Required**: Apply to turn order calculation

### 2. Ability + Move Type Interactions

#### Normalize + STAB/Effectiveness
- **Status**: ⚠️ PARTIALLY IMPLEMENTED
- **Current**: Type conversion works, but STAB might be incorrect
- **Action Required**: Verify STAB applies to converted Normal-type

#### Pixilate/Aerilate/Refrigerate/Galvanize + Power Boost
- **Status**: ⚠️ PARTIALLY IMPLEMENTED
- **Current**: Type conversion works
- **Action Required**: Add 1.2x power boost to converted moves

#### Wonder Guard + Super-Effective Check
- **Status**: ❌ NOT IMPLEMENTED
- **Expected**: Only super-effective moves hit
- **Action Required**: Add effectiveness check in immunity function

#### Adaptability + All Same-Type Moves
- **Status**: ✅ IMPLEMENTED
- **Verified**: STAB is 2.0x instead of 1.5x

#### Sand Force + Weather + Type
- **Status**: ✅ IMPLEMENTED
- **Verified**: Boosts Rock/Ground/Steel in sandstorm

### 3. Ability + Move Category Interactions

#### Fur Coat + Physical Moves
- **Status**: ✅ IMPLEMENTED
- **Verified**: Halves physical damage

#### Guts + Burn + Physical Moves
- **Status**: ⚠️ PARTIALLY IMPLEMENTED
- **Current**: Guts boosts Attack when statused
- **Action Required**: Verify burn's physical move nerf is properly overridden

#### Huge Power/Pure Power + Physical Moves
- **Status**: ⚠️ NEEDS VERIFICATION
- **Current**: Stat modifier exists
- **Action Required**: Apply in stat calculation, not just display

#### Assault Vest + Status Moves (via item)
- **Status**: ✅ IMPLEMENTED
- **Verified**: Blocks status moves when held

### 4. Ability + Move Flag Interactions

#### Bulletproof + Ball/Bomb Moves
- **Status**: ✅ IMPLEMENTED
- **Verified**: Blocks bullet-flagged moves

#### Soundproof + Sound Moves
- **Status**: ✅ IMPLEMENTED
- **Verified**: Blocks sound-flagged moves

#### Overcoat + Powder Moves
- **Status**: ✅ IMPLEMENTED
- **Verified**: Blocks powder-flagged moves

#### Iron Fist + Punch Moves
- **Status**: ✅ IMPLEMENTED
- **Verified**: Boosts punch-flagged moves

#### Strong Jaw + Bite Moves
- **Status**: ✅ IMPLEMENTED
- **Verified**: Boosts bite-flagged moves

#### Mega Launcher + Pulse Moves
- **Status**: ✅ IMPLEMENTED
- **Verified**: Boosts pulse-flagged moves

#### Tough Claws + Contact Moves
- **Status**: ✅ IMPLEMENTED
- **Verified**: Boosts contact moves

#### Reckless + Recoil Moves
- **Status**: ✅ IMPLEMENTED
- **Verified**: Boosts recoil moves

#### Rock Head + Recoil Moves
- **Status**: ⚠️ PARTIALLY IMPLEMENTED
- **Expected**: Prevents recoil damage
- **Action Required**: Check ability before applying recoil

#### Sheer Force + Secondary Effect Moves
- **Status**: ⚠️ PARTIALLY IMPLEMENTED
- **Current**: Boosts power
- **Action Required**: Remove secondary effects when Sheer Force active

### 5. Weather + Ability + Move Interactions

#### Chlorophyll + Sun + Any Move
- **Status**: ⚠️ PARTIALLY IMPLEMENTED
- **Current**: Speed modifier function exists
- **Action Required**: Apply in turn order calculation

#### Swift Swim + Rain + Any Move
- **Status**: ⚠️ PARTIALLY IMPLEMENTED
- **Current**: Speed modifier function exists
- **Action Required**: Apply in turn order calculation

#### Sand Rush + Sandstorm + Any Move
- **Status**: ⚠️ PARTIALLY IMPLEMENTED
- **Current**: Speed modifier function exists
- **Action Required**: Apply in turn order calculation

#### Solar Power + Sun + Special Moves
- **Status**: ❌ NOT IMPLEMENTED
- **Expected**: +50% Sp. Atk in sun, lose 1/8 HP per turn
- **Action Required**: Add to damage calculation and weather damage

#### Dry Skin + Rain/Sun
- **Status**: ⚠️ PARTIALLY IMPLEMENTED
- **Current**: Water immunity works
- **Action Required**: Add healing in rain, damage in sun

#### Ice Body + Hail
- **Status**: ❌ NOT IMPLEMENTED
- **Expected**: Heals 1/16 HP in hail instead of taking damage
- **Action Required**: Check ability in weather damage

#### Rain Dish + Rain
- **Status**: ❌ NOT IMPLEMENTED
- **Expected**: Heals 1/16 HP in rain
- **Action Required**: Add to weather healing

### 6. Terrain + Ability + Move Interactions

#### Surge Surfer + Electric Terrain + Speed
- **Status**: ⚠️ PARTIALLY IMPLEMENTED
- **Current**: Speed modifier function exists
- **Action Required**: Apply in turn order calculation

#### Grassy Surge + Grassy Terrain + Entry
- **Status**: ❌ NOT IMPLEMENTED
- **Expected**: Sets terrain on switch-in
- **Action Required**: Add to switch-in logic

#### Electric Surge + Electric Terrain + Entry
- **Status**: ❌ NOT IMPLEMENTED
- **Expected**: Sets terrain on switch-in
- **Action Required**: Add to switch-in logic

### 7. Contact Ability + Item + Move Interactions

#### Static + Rocky Helmet + Contact Move
- **Status**: ✅ IMPLEMENTED
- **Verified**: Both effects trigger independently

#### Flame Body + Jaboca Berry + Physical Contact
- **Status**: ✅ IMPLEMENTED
- **Verified**: Both can trigger

#### Rough Skin + Rocky Helmet
- **Status**: ⚠️ NEEDS VERIFICATION
- **Expected**: Should stack (both deal 1/8 damage)
- **Action Required**: Verify stacking behavior

### 8. Status Prevention: Ability + Type + Terrain

#### Immunity + Poison-Type + Toxic
- **Status**: ✅ IMPLEMENTED
- **Verified**: Multiple layers of immunity

#### Limber + Electric-Type + Thunder Wave
- **Status**: ✅ IMPLEMENTED
- **Verified**: Ability prevents paralysis

#### Insomnia + Electric Terrain + Sleep Moves
- **Status**: ✅ IMPLEMENTED
- **Verified**: Both prevent sleep independently

### 9. Item Boost + Ability Boost Stacking

#### Life Orb + Sheer Force
- **Status**: ❌ NOT IMPLEMENTED
- **Expected**: Sheer Force negates Life Orb recoil but keeps boost
- **Action Required**: Special interaction needed

#### Choice Band + Huge Power + Physical Move
- **Status**: ⚠️ NEEDS VERIFICATION
- **Expected**: Both boosts should stack (4x Attack)
- **Action Required**: Verify calculation order

#### Expert Belt + Technician + Super-Effective Low BP
- **Status**: ⚠️ NEEDS VERIFICATION
- **Expected**: Both boosts apply
- **Action Required**: Verify stacking

### 10. Priority Modification: Ability + Item + Move

#### Prankster + Lagging Tail + Status Move
- **Status**: ❌ NOT IMPLEMENTED
- **Expected**: Lagging Tail overrides Prankster priority
- **Action Required**: Item priority check

#### Gale Wings + Full Incense + Flying Move
- **Status**: ❌ NOT IMPLEMENTED
- **Expected**: Full Incense prevents priority boost
- **Action Required**: Item priority check

#### Quick Claw + Stall (Ability)
- **Status**: ❌ NOT IMPLEMENTED
- **Expected**: Complex priority interaction
- **Action Required**: Rare interaction, low priority

## Missing Implementations by Priority

### HIGH PRIORITY
1. ❌ Klutz - Prevents all held item effects
2. ❌ Magic Guard - Prevents indirect damage (Life Orb, weather, etc.)
3. ❌ Wonder Guard - Only super-effective moves hit
4. ⚠️ Sheer Force - Remove secondary effects when active
5. ⚠️ Rock Head - Prevent recoil damage
6. ⚠️ Type-conversion abilities - Add 1.2x power boost
7. ⚠️ Guts + Burn - Verify physical move damage correct
8. ⚠️ Speed abilities - Apply to turn order

### MEDIUM PRIORITY
1. ❌ Weather-setting abilities on switch-in
2. ❌ Terrain-setting abilities on switch-in
3. ❌ Solar Power - Sun bonus and HP loss
4. ❌ Ice Body - Heal in hail
5. ❌ Rain Dish - Heal in rain
6. ❌ Dry Skin - Rain heal, sun damage
7. ⚠️ Unburden - Speed boost on item loss
8. ❌ Life Orb + Sheer Force interaction

### LOW PRIORITY
1. ❌ Multitype + Plates (Arceus-specific)
2. ❌ Form-change abilities
3. ❌ Lagging Tail/Full Incense priority negation
4. ❌ Quick Claw interaction with abilities
5. ❌ Regenerator - Heal on switch-out
6. ❌ Natural Cure - Remove status on switch-out

## Test Coverage Needed

### Item Interaction Tests
- [ ] Klutz prevents all item effects
- [ ] Magic Guard prevents Life Orb recoil
- [ ] Magic Guard prevents weather damage
- [ ] Sticky Hold blocks all item removal
- [ ] Unburden speed boost on consumption
- [ ] Choice items + Huge Power stacking

### Move Interaction Tests
- [ ] Wonder Guard blocks non-super-effective
- [ ] Sheer Force removes secondary effects
- [ ] Rock Head prevents recoil damage
- [ ] Type conversion + power boost (1.2x)
- [ ] Priority abilities affect turn order

### Weather/Terrain Tests
- [ ] Weather-setting on switch-in
- [ ] Terrain-setting on switch-in
- [ ] Speed doubling in weather
- [ ] Solar Power in sun
- [ ] Ice Body/Rain Dish healing
- [ ] Dry Skin rain/sun effects

### Complex Stacking Tests
- [ ] Choice item + stat-doubling ability
- [ ] Life Orb + Sheer Force
- [ ] Expert Belt + type boosts
- [ ] Multiple contact effects (Static + Rocky Helmet)
- [ ] Rough Skin + Rocky Helmet stacking

## Implementation Status Summary

| Category | Implemented | Partially | Not Implemented | Total |
|----------|-------------|-----------|-----------------|-------|
| Immunity Abilities | 13 | 2 | 0 | 15 |
| Power Modifiers | 13 | 2 | 0 | 15 |
| Type Modifiers | 5 | 5 | 0 | 10 |
| Stat Modifiers | 6 | 4 | 0 | 10 |
| Weather Abilities | 4 | 4 | 6 | 14 |
| Contact Abilities | 6 | 0 | 2 | 8 |
| Item Interactions | 1 | 1 | 3 | 5 |
| Priority/Speed | 0 | 8 | 2 | 10 |
| Status Prevention | 6 | 0 | 0 | 6 |
| **TOTAL** | **54** | **26** | **13** | **93** |

**Overall Progress: 58% Fully Implemented, 28% Partial, 14% Missing**
