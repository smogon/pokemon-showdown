# Ability Implementation Guide

## Overview
This document describes the comprehensive ability system for the Pokemon RPG plugin. All abilities are organized by category and utilize Dex data where possible.

## Implementation Status

### Total Abilities in Dex: 634
### Currently Implemented: 100+

## Ability Categories

### 1. Immunity Abilities (15 abilities)
These abilities grant complete immunity to certain move types or effects:

| Ability | Effect | Interacts With |
|---------|--------|----------------|
| **Soundproof** | Immune to sound moves | Bug Buzz, Boomburst, Hyper Voice, etc. |
| **Overcoat** | Immune to powder moves | Spore, Sleep Powder, Stun Spore, etc. |
| **Levitate** | Immune to Ground moves (can be negated by Gravity) | Earthquake, Earth Power, etc. |
| **Water Absorb** | Immune to Water moves, heals 25% HP | Water Gun, Surf, Hydro Pump, etc. |
| **Volt Absorb** | Immune to Electric moves, heals 25% HP | Thunderbolt, Thunder, etc. |
| **Flash Fire** | Immune to Fire moves, boosts Fire moves | Flamethrower, Fire Blast, etc. |
| **Sap Sipper** | Immune to Grass moves, boosts Attack | Energy Ball, Leaf Storm, etc. |
| **Storm Drain** | Draws Water moves, boosts Sp. Atk | All Water-type moves |
| **Lightning Rod** | Draws Electric moves, boosts Sp. Atk | All Electric-type moves |
| **Motor Drive** | Immune to Electric moves, boosts Speed | All Electric-type moves |
| **Dry Skin** | Immune to Water moves, heals HP | All Water-type moves |
| **Wonder Guard** | Only super-effective moves hit | All moves (effectiveness-based) |
| **Bulletproof** | Immune to ball/bomb moves | Shadow Ball, Aura Sphere, etc. |

### 2. Power Modifier Abilities (20 abilities)
These abilities modify the base power of moves:

| Ability | Effect | Move Types Affected |
|---------|--------|---------------------|
| **Iron Fist** | +20% power to punch moves | Mach Punch, Drain Punch, Ice Punch, etc. |
| **Strong Jaw** | +50% power to bite moves | Crunch, Fire Fang, Thunder Fang, etc. |
| **Mega Launcher** | +50% power to pulse moves | Aura Sphere, Water Pulse, etc. |
| **Technician** | +50% power to moves ≤60 BP | Quick Attack, Bullet Seed, etc. |
| **Sheer Force** | +30% power to moves with secondary effects | Flamethrower, Ice Beam, etc. |
| **Reckless** | +20% power to recoil moves | Double-Edge, Brave Bird, etc. |
| **Tough Claws** | +30% power to contact moves | Most physical moves |
| **Adaptability** | STAB becomes 2.0x instead of 1.5x | All same-type moves |
| **Sand Force** | +30% power to Rock/Ground/Steel in sand | Rock Slide, Earthquake, etc. |
| **Blaze** | +50% power to Fire moves at ≤1/3 HP | All Fire-type moves |
| **Torrent** | +50% power to Water moves at ≤1/3 HP | All Water-type moves |
| **Overgrow** | +50% power to Grass moves at ≤1/3 HP | All Grass-type moves |
| **Swarm** | +50% power to Bug moves at ≤1/3 HP | All Bug-type moves |

### 3. Type Modifier Abilities (5 abilities)
These abilities change the type of moves:

| Ability | Effect | Original Type → New Type |
|---------|--------|--------------------------|
| **Normalize** | All moves become Normal | Any → Normal |
| **Pixilate** | Normal moves become Fairy | Normal → Fairy (1.2x power) |
| **Refrigerate** | Normal moves become Ice | Normal → Ice (1.2x power) |
| **Aerilate** | Normal moves become Flying | Normal → Flying (1.2x power) |
| **Galvanize** | Normal moves become Electric | Normal → Electric (1.2x power) |

### 4. Stat Modifier Abilities (10 abilities)
These abilities modify Pokemon stats:

| Ability | Stat Modified | Effect |
|---------|---------------|--------|
| **Huge Power** | Attack | Doubles Attack stat |
| **Pure Power** | Attack | Doubles Attack stat |
| **Guts** | Attack | +50% Attack when statused |
| **Marvel Scale** | Defense | +50% Defense when statused |
| **Quick Feet** | Speed | +50% Speed when statused |
| **Slow Start** | Attack, Speed | Halves both for 5 turns |

### 5. Weather Abilities (10 abilities)
Abilities that interact with weather conditions:

| Ability | Weather Effect | Interactions |
|---------|----------------|--------------|
| **Drought** | Sets harsh sunlight on entry | Boosts Fire moves, weakens Water moves |
| **Drizzle** | Sets rain on entry | Boosts Water moves, weakens Fire moves |
| **Sand Stream** | Sets sandstorm on entry | Damages non-Rock/Ground/Steel types |
| **Snow Warning** | Sets hail on entry | Damages non-Ice types |
| **Cloud Nine** | Suppresses all weather effects | Negates weather move bonuses |
| **Air Lock** | Suppresses all weather effects | Negates weather move bonuses |
| **Swift Swim** | Doubles Speed in rain | Movement priority |
| **Chlorophyll** | Doubles Speed in sun | Movement priority |
| **Sand Rush** | Doubles Speed in sandstorm | Movement priority |
| **Slush Rush** | Doubles Speed in hail | Movement priority |

### 6. Terrain Abilities (8 abilities)
Abilities that interact with terrain:

| Ability | Terrain Effect | Interactions |
|---------|----------------|--------------|
| **Electric Surge** | Sets Electric Terrain | Boosts Electric moves, prevents sleep |
| **Grassy Surge** | Sets Grassy Terrain | Boosts Grass moves, heals grounded Pokemon |
| **Misty Surge** | Sets Misty Terrain | Reduces Dragon moves, prevents status |
| **Psychic Surge** | Sets Psychic Terrain | Boosts Psychic moves, prevents priority |
| **Surge Surfer** | Doubles Speed in Electric Terrain | Movement priority |

### 7. Contact Abilities (8 abilities)
Abilities that trigger when hit by contact moves:

| Ability | Effect | Trigger Rate |
|---------|--------|--------------|
| **Static** | May paralyze attacker | 30% |
| **Flame Body** | May burn attacker | 30% |
| **Poison Point** | May poison attacker | 30% |
| **Effect Spore** | May poison/paralyze/sleep attacker | 30% |
| **Cute Charm** | May infatuate attacker | 30% |
| **Rough Skin** | Damages attacker 1/8 max HP | 100% |
| **Iron Barbs** | Damages attacker 1/8 max HP | 100% |

### 8. Status Prevention Abilities (6 abilities)
Abilities that prevent specific status conditions:

| Ability | Prevents | Works With |
|---------|----------|------------|
| **Immunity** | Poison | All poison-inducing moves |
| **Water Veil** | Burn | All burn-inducing moves |
| **Limber** | Paralysis | All paralysis-inducing moves |
| **Insomnia** | Sleep | All sleep-inducing moves |
| **Vital Spirit** | Sleep | All sleep-inducing moves |
| **Magma Armor** | Freeze | All freeze-inducing moves |

### 9. Item Interaction Abilities (3 abilities)
Abilities that interact with held items:

| Ability | Effect | Interactions |
|---------|--------|--------------|
| **Sticky Hold** | Prevents item removal | Knock Off, Thief, Covet, Trick |
| **Unburden** | Doubles Speed when item consumed | All item-consuming mechanics |
| **Klutz** | Cannot use held items | All held item effects |

### 10. Critical Hit Abilities (2 abilities)
Abilities that modify critical hits:

| Ability | Effect | Interactions |
|---------|--------|--------------|
| **Super Luck** | +1 critical hit stage | All moves |
| **Sniper** | Critical hits deal 2.25x instead of 1.5x | All moves |

### 11. Priority Abilities (2 abilities)
Abilities that modify move priority:

| Ability | Effect | Move Types Affected |
|---------|--------|---------------------|
| **Prankster** | +1 priority to status moves | Thunder Wave, Will-O-Wisp, etc. |
| **Gale Wings** | +1 priority to Flying moves at full HP | Brave Bird, Acrobatics, etc. |

### 12. Accuracy/Evasion Abilities (5 abilities)
Abilities that modify accuracy or evasion:

| Ability | Effect | Impact |
|---------|--------|--------|
| **Compound Eyes** | +30% accuracy | All moves |
| **Hustle** | +50% Attack, -20% accuracy | Physical moves only |
| **Sand Veil** | Boosts evasion in sandstorm | All moves targeting this Pokemon |
| **Snow Cloak** | Boosts evasion in hail | All moves targeting this Pokemon |
| **Tangled Feet** | Boosts evasion when confused | All moves targeting this Pokemon |

### 13. Secondary Effect Modifier Abilities (1 ability)
Abilities that modify secondary effect chances:

| Ability | Effect | Interactions |
|---------|--------|--------------|
| **Serene Grace** | Doubles secondary effect chance | Moves with flinch, stat changes, status, etc. |

### 14. Damage Reduction Abilities (4 abilities)
Abilities that reduce incoming damage:

| Ability | Effect | Conditions |
|---------|--------|------------|
| **Multiscale** | Halves damage at full HP | Only at 100% HP |
| **Shadow Shield** | Halves damage at full HP | Only at 100% HP |
| **Filter** | Reduces super-effective damage by 25% | Only for super-effective moves |
| **Solid Rock** | Reduces super-effective damage by 25% | Only for super-effective moves |
| **Fur Coat** | Halves physical damage | All physical moves |
| **Punk Rock** | Halves sound move damage | All sound moves |

### 15. Multi-Hit Abilities (2 abilities)
Abilities that affect multi-hit moves:

| Ability | Effect | Interactions |
|---------|--------|--------------|
| **Skill Link** | Multi-hit moves always hit 5 times | Bullet Seed, Icicle Spear, etc. |
| **Parental Bond** | Attacks hit twice (second at reduced power) | Most damaging moves |

### 16. Healing Abilities (2 abilities)
Abilities that heal the Pokemon:

| Ability | Effect | Trigger |
|---------|--------|---------|
| **Regenerator** | Heals 1/3 HP on switch-out | Every switch |
| **Natural Cure** | Heals status on switch-out | Every switch |

### 17. Move Prevention Abilities (2 abilities)
Abilities that prevent certain moves:

| Ability | Effect | Prevents |
|---------|--------|----------|
| **Dazzling** | Prevents priority moves | Quick Attack, Mach Punch, etc. |
| **Queenly Majesty** | Prevents priority moves | Quick Attack, Mach Punch, etc. |
| **Good as Gold** | Prevents all status moves | Thunder Wave, Will-O-Wisp, etc. |

### 18. Recoil/Indirect Damage Abilities (2 abilities)
Abilities that affect recoil or indirect damage:

| Ability | Effect | Interactions |
|---------|--------|--------------|
| **Rock Head** | Prevents recoil damage | Double-Edge, Brave Bird, etc. |
| **Magic Guard** | Prevents all indirect damage | Weather, poison, hazards, etc. |

## Move Interactions

### Physical Moves
- Affected by: Iron Fist, Tough Claws, Reckless, Guts, Hustle, Fur Coat
- Contact moves trigger: Static, Flame Body, Poison Point, Rough Skin, Iron Barbs

### Special Moves
- Affected by: Mega Launcher, Solar Power (in sun)
- Not affected by: Guts, Hustle (physical only)

### Status Moves
- Affected by: Prankster (priority), Taunt
- Prevented by: Good as Gold, Dazzling/Queenly Majesty (if priority)

### Sound Moves
- Blocked by: Soundproof
- Modified by: Punk Rock (attacker +30%, defender -50%)

### Powder Moves
- Blocked by: Overcoat, Grass-types

### Punch Moves
- Boosted by: Iron Fist (+20%)

### Bite Moves
- Boosted by: Strong Jaw (+50%)

### Pulse Moves
- Boosted by: Mega Launcher (+50%)

### Multi-Hit Moves
- Modified by: Skill Link (always 5 hits)

### Recoil Moves
- Boosted by: Reckless (+20%)
- Recoil negated by: Rock Head

### Priority Moves
- Modified by: Prankster (status moves), Gale Wings (Flying moves)
- Prevented by: Dazzling, Queenly Majesty, Psychic Terrain

### Type-Specific Interactions

#### Fire Moves
- Boosted by: Blaze (≤1/3 HP), Sun
- Weakened by: Rain
- Absorbed by: Flash Fire (immunity)

#### Water Moves
- Boosted by: Torrent (≤1/3 HP), Rain
- Weakened by: Sun
- Absorbed by: Water Absorb, Storm Drain, Dry Skin (immunity)

#### Grass Moves
- Boosted by: Overgrow (≤1/3 HP)
- Absorbed by: Sap Sipper (immunity)

#### Electric Moves
- Absorbed by: Volt Absorb, Lightning Rod, Motor Drive (immunity)

#### Ground Moves
- Immunity: Levitate, Flying-types, Air Balloon

## Testing Recommendations

### Test Cases for Each Ability
1. **Immunity Abilities**: Verify complete damage negation
2. **Power Modifiers**: Calculate exact damage multipliers
3. **Type Modifiers**: Verify type effectiveness changes
4. **Stat Modifiers**: Check stat calculation accuracy
5. **Weather/Terrain**: Test all weather/terrain combinations
6. **Contact Effects**: Verify trigger rates and effects
7. **Status Prevention**: Test all status conditions
8. **Item Interactions**: Test item removal/consumption
9. **Critical Hits**: Verify crit rate and damage
10. **Priority**: Test turn order changes

### Edge Cases to Test
- Multiple abilities interacting (e.g., Adaptability + STAB)
- Ability suppression (Gastro Acid, Neutralizing Gas)
- Ability changes (Role Play, Skill Swap)
- Weather/terrain changes during battle
- Status conditions applied to immune Pokemon
- Item removal on Pokemon with Sticky Hold
- Multi-hit moves with abilities

## Future Enhancements
- Ability suppression mechanics
- Ability-swapping moves
- More complex form-change abilities
- Ability-specific animations
- Ability tooltips in UI
- Ability change notifications

## Notes
- All abilities use Dex data where possible
- Hardcoded only when necessary for RPG-specific mechanics
- Abilities are organized by category for maintainability
- Type conversions use toID() for case-insensitive matching
- Ability effects stack with item effects appropriately
