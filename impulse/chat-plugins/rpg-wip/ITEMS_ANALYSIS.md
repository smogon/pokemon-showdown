# RPG Items Analysis & Implementation Plan

**Date:** 2025-11-22  
**Status:** Planning Phase

## Executive Summary

The RPG WIP system currently implements **109 items** out of **564 total items** available in the Pokémon Showdown Dex. This leaves **455 items** not yet implemented (80.7% remaining).

### Current Implementation Status

| Category | Implemented | Not Implemented | Total | % Complete |
|----------|-------------|-----------------|-------|-----------|
| **Custom Medicine/Misc Items** | 55 | 0 | 55 | 100% |
| **Pokeballs** | 4 | 24 | 28 | 14.3% |
| **Berries** | 42 | 45 | 87 | 48.3% |
| **Held Items** | ~8 | ~386 | ~394 | ~2% |
| **TOTAL** | **109** | **455** | **564** | **19.3%** |

---

## Currently Implemented Items (109 Total)

### Custom Medicine Items (40 items)
These are custom items defined in `items.ts` with healing/status cure effects:

**HP Healing (13):**
- Potion, Super Potion, Hyper Potion, Max Potion, Full Restore
- Fresh Water, Soda Pop, Lemonade, Moomoo Milk, Tea
- Energy Root, EnergyPowder, Berry Juice

**Status Cure (8):**
- Antidote, Paralyze Heal, Awakening, Burn Heal, Ice Heal, Full Heal, Heal Powder
- Sacred Ash (revives all)

**Revival (4):**
- Revive, Max Revive, Revival Herb, Sacred Ash

**PP Restore (4):**
- Ether, Max Ether, Elixir, Max Elixir

**Battle Stat Boost (8):**
- X Attack, X Defense, X Sp. Atk, X Sp. Def, X Speed, X Accuracy, Dire Hit, Guard Spec.

**Vitamins/EVs (6):**
- HP Up, Protein, Iron, Calcium, Zinc, Carbos

### Custom Misc Items (8 items)

**EXP/Level (6):**
- Rare Candy, Exp. Candy XS, Exp. Candy S, Exp. Candy M, Exp. Candy L, Exp. Candy XL

**Other (2):**
- Tera Shard, Egg Move Tutor

### Pokeballs (4 items)
- Poké Ball, Great Ball, Ultra Ball, Master Ball

### Berries (42 items implemented)

**Flavor Berries (5):**
- Figy Berry, Wiki Berry, Mago Berry, Aguav Berry, Iapapa Berry

**Type Resist Berries (18):**
- Babiri, Charti, Chilan, Chople, Coba, Colbur, Haban, Kasib, Kebia, Occa, Passho, Payapa, Rindo, Roseli, Shuca, Tanga, Wacan, Yache

**Stat Boost Berries (5):**
- Liechi (ATK), Ganlon (DEF), Salac (SPE), Petaya (SPA), Apicot (SPD)

**Misc Berries (14):**
- Sitrus Berry, Oran Berry, Starf Berry, Lum Berry (from viable held items)

### Viable Held Items (41 items)
Items recognized for competitive battle use (defined in `VIABLE_HELD_ITEMS`):
- Leftovers, Black Sludge, Shell Bell, Life Orb
- Choice Band, Choice Specs, Choice Scarf
- Expert Belt, Quick Claw, Focus Sash, Assault Vest
- Heavy-Duty Boots, Rocky Helmet, Air Balloon, Shed Shell
- Clear Amulet, Mental Herb, White Herb, Power Herb
- Weakness Policy, Flame Orb, Toxic Orb, Sticky Barb
- Various berries (included in berry count above)

---

## NOT IMPLEMENTED Items (455 Total)

### Priority 1: ESSENTIAL - Must Implement First

#### 1.1 Pokeballs (24 items) 
**Implementation Difficulty:** LOW  
**Estimated Time:** 1-2 weeks

Most Pokeballs just need metadata and catch rate modifiers. Implementation order by complexity:

**Tier 1 - Condition-Based Balls (8 items):**
1. **Quick Ball** - Higher catch rate on first turn
2. **Timer Ball** - Catch rate increases with turn count
3. **Repeat Ball** - Better catch rate if species already caught
4. **Nest Ball** - Better for low-level Pokémon
5. **Dusk Ball** - Better at night or in caves
6. **Net Ball** - Better for Water/Bug types
7. **Dive Ball** - Better when fishing/diving
8. **Heal Ball** - Heals Pokémon after catch

**Implementation Steps:**
- Add pokeball metadata to CUSTOM_ITEMS_DATABASE with catch rate modifiers
- Update catch logic in battle/wild encounter system
- Add condition checks (time, location, pokemon type, level, species)
- Test each ball type

**Tier 2 - Apricorn Balls (7 items):**
1. **Fast Ball** - Better for fast Pokémon (Speed > 100)
2. **Level Ball** - Better if player's Pokémon higher level
3. **Heavy Ball** - Better for heavy Pokémon
4. **Love Ball** - Better if same species, opposite gender
5. **Lure Ball** - Better when fishing
6. **Moon Ball** - Better for Moon Stone evolution Pokémon
7. **Friend Ball** - Sets friendship to 200

**Tier 3 - Premium Balls (5 items):**
1. **Luxury Ball** - Increases friendship gain
2. **Premier Ball** - Same as Poké Ball (cosmetic)
3. **Dream Ball** - Better for sleeping Pokémon
4. **Safari Ball** - Used in Safari Zones
5. **Park Ball** - Always catches (Park-specific)

**Tier 4 - Special Event Balls (4 items):**
1. **Beast Ball** - Better for Ultra Beasts
2. **Cherish Ball** - Event-only (cosmetic)
3. **Sport Ball** - Bug Catching Contest
4. **Strange Ball** - Special mechanics

---

#### 1.2 Status Healing Berries (7 items)
**Implementation Difficulty:** LOW  
**Estimated Time:** 3-5 days

These berries cure status conditions, similar to existing medicine items. Priority order:

1. **Cheri Berry** - Cures paralysis (most common status)
2. **Pecha Berry** - Cures poison
3. **Rawst Berry** - Cures burn
4. **Aspear Berry** - Cures freeze
5. **Chesto Berry** - Cures sleep
6. **Leppa Berry** - Restores 10 PP (very useful!)
7. **Persim Berry** - Cures confusion

**Implementation Steps:**
1. Add to CUSTOM_ITEMS_DATABASE with appropriate `statusCure` effects
2. Set category to 'berry' and appropriate prices
3. Leverage existing `useHealingItem` function
4. Add to shops and wild encounters
5. Test each berry

---

#### 1.3 Evolution Stones (13 items)
**Implementation Difficulty:** MEDIUM  
**Estimated Time:** 1-2 weeks

Evolution stones trigger evolution for specific Pokémon. Requires integration with evolution system.

**Tier 1 - Common Stones (5 items):**
1. **Fire Stone** - Vulpix, Growlithe, Eevee, Pansear
2. **Water Stone** - Poliwhirl, Shellder, Staryu, Eevee, Lombre, Panpour
3. **Thunder Stone** - Pikachu, Eevee, Eelektrik
4. **Leaf Stone** - Gloom, Weepinbell, Exeggcute, Nuzleaf, Pansage
5. **Moon Stone** - Nidorina, Nidorino, Clefairy, Jigglypuff, Skitty, Munna

**Tier 2 - Modern Stones (5 items):**
1. **Sun Stone** - Gloom, Sunkern, Cottonee, Petilil, Helioptile
2. **Shiny Stone** - Togetic, Roselia, Minccino, Floette
3. **Dusk Stone** - Murkrow, Misdreavus, Lampent, Doublade
4. **Dawn Stone** - Male Kirlia, Female Snorunt
5. **Ice Stone** - Alolan Sandshrew, Alolan Vulpix, Eevee, Galarian Darumaka

**Tier 3 - Trade Evolution Items (3 items):**
1. **Metal Coat** - Onix, Scyther (when traded)
2. **Dragon Scale** - Seadra (when traded)
3. **Up-Grade** - Porygon (when traded)

**Implementation Steps:**
1. Add stone items to CUSTOM_ITEMS_DATABASE with category 'evolution'
2. Create `useEvolutionItem` function in items.ts
3. Check Pokémon species compatibility with stone
4. Trigger evolution using existing `checkEvolution` flow
5. Handle special cases (gender requirements for Dawn Stone)
6. Add stones to shops at appropriate locations
7. Test with each compatible Pokémon

---

### Priority 2: HIGH PRIORITY - Core Gameplay Enhancement

#### 2.1 Competitive Held Items (11 items)
**Implementation Difficulty:** LOW-MEDIUM  
**Estimated Time:** 1 week

These items significantly impact battle strategy and are commonly used competitively:

1. **Focus Band** (LOW) - 10% chance to survive fatal hit with 1 HP
2. **Scope Lens** (LOW) - Increases critical hit ratio by 1 stage
3. **Wide Lens** (LOW) - Increases move accuracy by 10%
4. **Zoom Lens** (LOW) - Accuracy boost by 20% when moving second
5. **Muscle Band** (LOW) - Boosts power of physical moves by 10%
6. **Wise Glasses** (LOW) - Boosts power of special moves by 10%
7. **Metronome** (MEDIUM) - Boosts damage of consecutively used same move
8. **King's Rock** (LOW) - 10% chance to make target flinch
9. **Light Ball** (LOW) - Doubles Pikachu's Attack and Sp. Atk
10. **Thick Club** (LOW) - Doubles Cubone/Marowak's Attack
11. **Leek** (LOW) - Increases Farfetch'd's critical hit ratio by 2 stages

**Implementation Notes:**
- Most of these already work via `ITEMS_DATABASE` proxy (Dex integration)
- Need to verify battle system handles their effects properly
- Species-specific items (Light Ball, Thick Club, Leek) need species checks
- Add to shop inventories and rare drops
- Test in battle scenarios

---

#### 2.2 Type Enhancing Items (18 items)
**Implementation Difficulty:** LOW  
**Estimated Time:** 3-5 days

Items that boost specific move types by 20%. Already work via Dex, just need shop integration:

**Tier 1 - Common Types (5 items):**
1. **Charcoal** - Fire moves
2. **Mystic Water** - Water moves
3. **Miracle Seed** - Grass moves
4. **Magnet** - Electric moves
5. **Never-Melt Ice** - Ice moves

**Tier 2 - Physical Types (7 items):**
1. **Black Belt** - Fighting moves
2. **Sharp Beak** - Flying moves
3. **Poison Barb** - Poison moves
4. **Hard Stone** - Rock moves
5. **Soft Sand** - Ground moves
6. **Silver Powder** - Bug moves
7. **Metal Coat** - Steel moves (also evolution item)

**Tier 3 - Special Types (6 items):**
1. **Spell Tag** - Ghost moves
2. **Dragon Fang** - Dragon moves
3. **Black Glasses** - Dark moves
4. **Twisted Spoon** - Psychic moves
5. **Silk Scarf** - Normal moves
6. **Pixie Plate** or **Pink Bow** - Fairy moves

**Implementation Steps:**
1. Verify Dex data is correct for all items
2. Add to appropriate shop inventories based on location/theme
3. Add as rewards from type-specialist gym leaders
4. Add to wild Pokémon held items (rare drops)
5. Test battle damage calculations

---

### Priority 3: MEDIUM PRIORITY - Enhanced Features

#### 3.1 Weather/Terrain Items (6 items)
**Implementation Difficulty:** MEDIUM  
**Estimated Time:** 1 week

These items extend weather/terrain duration in battle:

1. **Heat Rock** - Extends Sunny weather to 8 turns
2. **Damp Rock** - Extends Rain to 8 turns
3. **Smooth Rock** - Extends Sandstorm to 8 turns
4. **Icy Rock** - Extends Hail/Snow to 8 turns
5. **Light Clay** - Extends Light Screen/Reflect to 8 turns
6. **Terrain Extender** - Extends terrain to 8 turns

**Implementation Requirements:**
- Battle system must track weather/terrain turn counters
- Check held item when weather/terrain is set
- Modify turn counter accordingly
- Test with each weather/terrain type

---

#### 3.2 Utility Berries (7 items)
**Implementation Difficulty:** MEDIUM  
**Estimated Time:** 1 week

Berries with special battle effects:

1. **Kee Berry** - Raises Defense when hit by physical move
2. **Maranga Berry** - Raises Sp. Def when hit by special move
3. **Custap Berry** - Allows first move when HP < 25%
4. **Micle Berry** - Boosts accuracy of next move when HP < 25%
5. **Enigma Berry** - Restores 25% HP when hit by super effective move
6. **Jaboca Berry** - Damages attacker when hit by physical move
7. **Rowap Berry** - Damages attacker when hit by special move

**Implementation Requirements:**
- Battle system must trigger held item on specific conditions
- Implement stat boost, damage, or priority changes
- Test each trigger condition

---

#### 3.3 EV Training Items (7 items)
**Implementation Difficulty:** LOW  
**Estimated Time:** 2-3 days

Items that affect EV gain:

1. **Macho Brace** - Doubles EV gain, halves Speed in battle
2. **Power Weight** - Adds +8 HP EVs after battle
3. **Power Bracer** - Adds +8 Attack EVs after battle
4. **Power Belt** - Adds +8 Defense EVs after battle
5. **Power Lens** - Adds +8 Sp. Atk EVs after battle
6. **Power Band** - Adds +8 Sp. Def EVs after battle
7. **Power Anklet** - Adds +8 Speed EVs after battle

**Implementation Steps:**
1. Add items to CUSTOM_ITEMS_DATABASE or let Dex handle
2. Modify EV calculation in post-battle rewards
3. Check for held item and apply bonus EVs
4. Implement Macho Brace speed penalty in battle
5. Test EV gains

---

#### 3.4 Other Evolution Items (38+ items)
**Implementation Difficulty:** MEDIUM-HIGH  
**Estimated Time:** 2-3 weeks

Various evolution-triggering items:

**Tier 1 - Trade Evolution Items (10 items):**
1. Electirizer, Magmarizer, Protector, Reaper Cloth
2. Prism Scale, Razor Claw, Razor Fang, Dubious Disc
3. Sachet, Whipped Dream

**Tier 2 - Held Evolution Items (8 items):**
Items that trigger evolution when leveling up while held:
1. King's Rock (Poliwhirl, Slowpoke)
2. Deep Sea items, Oval Stone, etc.

**Tier 3 - Fossils (10+ items):**
Require fossil revival system:
- Helix Fossil, Dome Fossil, Old Amber, etc.
- Need NPC/machine to revive fossils into Pokémon

**Tier 4 - Special Items (10+ items):**
- Sweet Apple, Tart Apple (Applin evolution)
- Cracked Pot, Chipped Pot (Sinistea evolution)
- Galarica items, etc.

**Implementation Notes:**
- Trade evolutions can be adapted to item-use evolution
- Held evolution items need level-up trigger checks
- Fossils require new fossil revival mechanic
- Many require specific Pokémon checks

---

### Priority 4: LOW PRIORITY - Optional/Advanced Features

#### 4.1 Mega Stones (49+ items)
**Implementation Difficulty:** HIGH  
**Estimated Time:** 3-4 weeks  
**Status:** ⚠️ DEFERRED - Requires Mega Evolution System

All Mega Evolution stones require complete Mega Evolution battle system:
- Venusaurite, Charizardite X/Y, Blastoisinite, etc.
- Requires Key Stone for trainer
- Requires in-battle Mega Evolution mechanics
- Requires Mega form stats, abilities, types

**Recommendation:** Design full Mega Evolution system before implementing stones.

---

#### 4.2 Z-Crystals (30+ items)
**Implementation Difficulty:** HIGH  
**Estimated Time:** 2-3 weeks  
**Status:** ⚠️ DEFERRED - Requires Z-Move System

All Z-Move crystals require Z-Move battle system:
- Normalium Z, Fightinium Z, etc.
- Species-specific: Pikanium Z, Aloraichium Z, etc.
- Requires Z-Ring for trainer
- Requires Z-Move mechanics and animations

**Recommendation:** Design full Z-Move system before implementing crystals.

---

#### 4.3 Type Plates (18 items)
**Implementation Difficulty:** LOW  
**Estimated Time:** 3-5 days

Arceus form-changing items, also boost corresponding type moves by 20%:
- Flame Plate, Splash Plate, Zap Plate, Meadow Plate, etc.

**Implementation:**
- Similar to Type Enhancing items
- Add Arceus form change logic if Arceus is catchable
- Otherwise, just use as type boosting items

---

#### 4.4 Flavor/Cosmetic Berries (31+ items)
**Implementation Difficulty:** LOW  
**Estimated Time:** 1 week

Berries primarily for Pokéblock/Poffin making or minor effects:
- Pomeg, Kelpsy, Qualot, Hondew, Grepa, Tamato (EV-reducing)
- Razz, Bluk, Nanab, Wepear, Pinap, etc. (flavor berries)
- Old berries: Gold Berry, Berry, Bitter Berry, etc.

**Implementation Notes:**
- EV-reducing berries could be useful
- Flavor berries mostly for contests (if implemented)
- Lower priority unless contest system added

---

#### 4.5 TRs - Technical Records (100 items)
**Implementation Difficulty:** MEDIUM  
**Estimated Time:** 2-3 weeks  
**Status:** Requires TR Learning System

TR00 through TR99 - One-time use move teaching items:
- Similar to TMs but consumed on use
- Requires move teaching system integration
- Need to decide which moves map to which TRs

**Recommendation:** Implement after TM system is working.

---

#### 4.6 Miscellaneous Items (100+ items)

Various categories:
- **Incense Items** (12) - Breeding items, also boost type moves
- **Memory Items** (18) - Silvally type-changing items
- **Type Gems** (18) - One-time 30% type boost, consumed after use
- **Drives** (4) - Genesect form-changing items
- **Orbs** (6) - Legendary Pokémon items (Adamant, Lustrous, Griseous, etc.)
- **Event Items** - One-of-a-kind items for specific purposes
- **Selling Items** - Big Nugget, Nugget, Pearl, etc. (just for money)

**Implementation Priority:** Very low - implement as needed for specific features.

---

## Implementation Roadmap

### Phase 1: Essential Foundations (47 items)
**Duration:** 2-3 weeks  
**Goal:** Core item variety for catching, healing, and evolution

1. **Week 1:** All Pokeballs (24 items)
   - Implement catch rate modifiers and conditions
   - Test each ball type with different scenarios
   - Add to shops across game world

2. **Week 1-2:** Status Healing Berries (7 items)
   - Quick implementation using existing heal system
   - Add to wild encounters and berry trees

3. **Week 2-3:** Evolution Stones (13 items)
   - Create evolution item usage system
   - Test with all compatible Pokémon
   - Add to shops and special locations

4. **Week 3:** Initial Type Enhancers (3 items)
   - Charcoal, Mystic Water, Miracle Seed
   - Verify battle damage calculations
   - Add to shops

---

### Phase 2: Competitive Enhancement (29 items)
**Duration:** 2-3 weeks  
**Goal:** Expand battle strategy options

1. **Week 4:** Competitive Held Items (11 items)
   - Verify battle system integration
   - Test special cases (Light Ball, Thick Club, etc.)
   - Add to post-game shops and rare drops

2. **Week 4-5:** Remaining Type Enhancers (15 items)
   - Add all remaining type-boosting items
   - Distribute across type-themed locations

3. **Week 5:** EV Training Items (7 items)
   - Implement EV gain modifiers
   - Test Macho Brace speed penalty
   - Add to competitive-focused shops

---

### Phase 3: Battle Mechanics (20 items)
**Duration:** 2-3 weeks  
**Goal:** Advanced battle features

1. **Week 6:** Weather/Terrain Items (6 items)
   - Implement weather/terrain turn extension
   - Test with all weather/terrain types
   - Add to appropriate themed locations

2. **Week 6-7:** Utility Berries (7 items)
   - Implement berry trigger conditions
   - Test stat boosts and special effects
   - Add to berry trees and rare encounters

3. **Week 7:** Priority Evolution Items (7 items)
   - Implement held evolution triggers
   - Test with compatible Pokémon
   - Add to shops and rewards

---

### Phase 4: Polish & Advanced Features
**Duration:** Varies  
**Goal:** Complete remaining items as systems allow

1. **Advanced Evolution Items** - Fossils (requires revival system)
2. **Flavor Berries** - When needed for contests or friendship
3. **Type Plates** - When Arceus is available
4. **Mega Stones** - After Mega Evolution system designed
5. **Z-Crystals** - After Z-Move system designed
6. **TRs** - After TR move learning system designed

---

## Technical Implementation Guide

### General Pattern for New Items

```typescript
// 1. If custom logic needed, add to CUSTOM_ITEMS_DATABASE
const newItem = {
  id: 'itemid',
  name: 'Item Name',
  category: 'medicine' | 'berry' | 'pokeball' | 'held' | 'evolution' | 'misc',
  description: 'Item description',
  price: 1000,
  effects: {
    // Define effects based on item type
  }
};

// 2. Create usage function if needed
export function useNewItemType(player: PlayerData, pokemon: RPGPokemon, itemId: string) {
  // Implement item logic
  // Return { success: boolean, message: string }
}

// 3. Integrate into battle system if battle-usable
export function canUseItemInBattle(itemId: string): boolean {
  // Add checks for new item types
}

// 4. Add to shops, NPC rewards, wild drops
// See game-shops.ts, npc-actions.ts, wild encounters
```

### Testing Checklist for Each Item

- [ ] Item can be obtained (shop/NPC/drop)
- [ ] Item appears in inventory correctly
- [ ] Item can be used in appropriate context
- [ ] Item effect works as intended
- [ ] Edge cases handled (can't use on fainted, etc.)
- [ ] Price is balanced
- [ ] Description is clear and accurate

---

## Summary Statistics

| Phase | Items | Weeks | Difficulty | Dependencies |
|-------|-------|-------|------------|--------------|
| **Phase 1** | 47 | 2-3 | LOW-MEDIUM | Catch, heal, evolution systems |
| **Phase 2** | 29 | 2-3 | LOW-MEDIUM | Battle, EV systems |
| **Phase 3** | 20 | 2-3 | MEDIUM | Weather, trigger systems |
| **Phase 4** | 339+ | TBD | VARIES | Various advanced systems |
| **TOTAL** | 455 | ~8-12+ | VARIES | Multiple systems |

**Current Status:** 109/564 items (19.3%)  
**After Phase 1:** 156/564 items (27.7%)  
**After Phase 2:** 185/564 items (32.8%)  
**After Phase 3:** 205/564 items (36.3%)  

---

## Conclusion

This analysis provides a comprehensive roadmap for implementing the remaining 455 items. The phased approach prioritizes items by:

1. **Gameplay Impact** - Items that add the most value to player experience
2. **Implementation Complexity** - Starting with easier items to build momentum
3. **System Dependencies** - Implementing items that work with existing systems first
4. **Logical Grouping** - Completing item categories together

**Recommended Next Steps:**
1. Review and approve this implementation plan
2. Begin Phase 1 with Pokeballs implementation
3. Test thoroughly at each stage
4. Adjust timeline based on actual implementation speed
5. Defer advanced features (Mega Stones, Z-Crystals, TRs) until their systems are designed

The Phase 1 items (47 total) provide maximum gameplay value with minimal system complexity and should be the immediate focus.
