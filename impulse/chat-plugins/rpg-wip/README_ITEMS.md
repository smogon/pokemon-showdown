# RPG Items Documentation

This directory contains comprehensive documentation about the item system in the RPG WIP project.

## 📄 Documentation Files

### 1. **ITEMS_ANALYSIS.md** (~600 lines)
Complete implementation plan and analysis document.

**Contents:**
- Executive summary with statistics
- Complete breakdown of all 109 implemented items
- Detailed categorization of 504 not-implemented items
- 4-phase implementation roadmap
- Complexity assessments for each category
- Step-by-step implementation guides
- Time estimates and dependencies
- Technical implementation patterns

**Use this document for:** Planning implementation, understanding complexity, and getting detailed implementation steps.

---

### 2. **ITEMS_REFERENCE.md** (~630 lines)
Quick reference lists for all items.

**Contents:**
- Alphabetical list of all 109 implemented items
- Alphabetical list of all 504 not-implemented items
- Clear marking of custom items vs Dex items

**Use this document for:** Quick lookups to see if an item is implemented or not.

---

## 📊 Quick Statistics

| Metric | Value |
|--------|-------|
| **Total Items in Dex** | 564 |
| **Total Items (including custom)** | 613 |
| **Implemented** | 109 (19.3% of Dex, 17.8% total) |
| **Not Implemented** | 504 (80.7%) |

### Implementation Breakdown

**Implemented (109 items):**
- 49 Custom Items (Potions, Vitamins, Candies, etc.)
- 4 Pokeballs (Poké, Great, Ultra, Master)
- 42 Berries (Type resist, stat boost, flavor)
- 14 Held Items (via VIABLE_HELD_ITEMS list)

**Not Implemented (504 items):**
- 24 Pokeballs
- 45 Berries
- 13 Evolution Stones
- 49 Mega Stones
- 30 Z-Crystals
- 100 TRs (Technical Records)
- 243 Other Items (held items, evolution items, etc.)

---

## 🎯 Implementation Priority

### ⭐ Phase 1: Essential Foundations (47 items, 2-3 weeks)
**Highest Priority - Start Here**

1. **Pokeballs (24 items)** - LOW complexity
   - Quick Ball, Timer Ball, Repeat Ball, Dusk Ball, etc.
   - Just need catch rate modifiers and condition checks

2. **Status Healing Berries (7 items)** - LOW complexity
   - Cheri, Pecha, Rawst, Aspear, Chesto, Leppa, Persim
   - Use existing healing system

3. **Evolution Stones (13 items)** - MEDIUM complexity
   - Fire/Water/Thunder/Leaf/Moon Stone, etc.
   - Need evolution trigger system

4. **Type Enhancers (3 items)** - LOW complexity
   - Charcoal, Mystic Water, Miracle Seed
   - Already work via Dex

---

### ⭐⭐ Phase 2: Competitive Enhancement (29 items, 2-3 weeks)

1. **Competitive Held Items (11 items)** - LOW-MEDIUM complexity
   - Focus Band, Scope Lens, Muscle Band, etc.

2. **Remaining Type Enhancers (15 items)** - LOW complexity
   - Black Belt, Sharp Beak, Spell Tag, etc.

3. **EV Training Items (7 items)** - LOW complexity
   - Macho Brace, Power Weight, Power Band, etc.

---

### ⭐⭐⭐ Phase 3: Battle Mechanics (20 items, 2-3 weeks)

1. **Weather/Terrain Items (6 items)** - MEDIUM complexity
   - Heat Rock, Damp Rock, Light Clay, etc.

2. **Utility Berries (7 items)** - MEDIUM complexity
   - Kee, Maranga, Custap, Enigma, etc.

3. **Priority Evolution Items (7 items)** - MEDIUM complexity
   - Electirizer, Magmarizer, Protector, etc.

---

### ⏸️ Phase 4: Advanced Features (339+ items, DEFERRED)

**These require new systems to be designed first:**

- ⚠️ Mega Stones (49) - Need Mega Evolution system
- ⚠️ Z-Crystals (30) - Need Z-Move system
- ⚠️ TRs (100) - Need TR learning system
- ⚠️ Fossils - Need fossil revival system
- Other specialized items

---

## 🔧 Current Item System Architecture

### Item Storage & Retrieval

```typescript
// Custom items with hardcoded effects
CUSTOM_ITEMS_DATABASE: Record<string, ItemData>
  - 55 items with custom logic (potions, vitamins, etc.)
  
// Lists of supported items
VIABLE_HELD_ITEMS: string[]
  - 41 competitive held items
  
BERRY_FLAVORS: Record<string, BerryData>
  - 5 flavor-based berries
  
TYPE_RESIST_BERRIES: Record<string, string>
  - 18 type-resistance berries

// Dynamic Dex access
ITEMS_DATABASE: Proxy
  - Automatically loads any item from Dex
  - Falls back to custom items
```

### Usage Functions

```typescript
// Medicine items
useHealingItem(player, pokemon, itemId)
useRevivalItem(player, pokemon, itemId)
useVitaminItem(player, pokemon, itemId)

// Experience/Leveling
useRareCandyItem(player, pokemon, room, user)
useExpCandyItem(player, pokemon, itemId, room, user)

// Special items
useSacredAsh(player) // Revives all fainted

// Battle items
useBattleHealingItem(pokemon, itemId)
useBattleRevivalItem(pokemon, itemId)
canUseItemInBattle(itemId)
getBattleUsableItems(player)
```

---

## 🚀 Getting Started with Implementation

### Step 1: Choose a Phase
Start with **Phase 1** items as they provide the most value with least complexity.

### Step 2: Read the Analysis Document
Open `ITEMS_ANALYSIS.md` and find your chosen item category for detailed implementation steps.

### Step 3: Follow the Pattern

```typescript
// 1. Add to CUSTOM_ITEMS_DATABASE if custom logic needed
// 2. Create usage function if new item type
// 3. Integrate with battle system if battle-usable
// 4. Add to shops/NPCs/drops
// 5. Test thoroughly
```

### Step 4: Test Checklist
- [ ] Item can be obtained
- [ ] Item appears in inventory
- [ ] Item can be used correctly
- [ ] Item effect works as intended
- [ ] Edge cases handled
- [ ] Price is balanced

---

## 📖 Related Files

**Implementation Files:**
- `items.ts` - Main item system (533 lines)
- `game-shops.ts` - Shop inventories
- `npc-actions.ts` - NPC rewards
- `battle-core.ts` - Battle item effects
- `utils.ts` - Helper functions

**Interface Files:**
- `interface.ts` - Type definitions for items

---

## 🤝 Contributing

When implementing new items:

1. Read `ITEMS_ANALYSIS.md` for your item category
2. Follow the complexity guidelines
3. Use existing patterns from `items.ts`
4. Test with the checklist
5. Update shop inventories appropriately
6. Document any new patterns

---

## 📞 Questions?

Refer to:
- `ITEMS_ANALYSIS.md` for detailed implementation guidance
- `ITEMS_REFERENCE.md` for quick item lookup
- `items.ts` for existing implementation patterns

---

**Last Updated:** 2025-11-22  
**Status:** Documentation Complete, Ready for Implementation
