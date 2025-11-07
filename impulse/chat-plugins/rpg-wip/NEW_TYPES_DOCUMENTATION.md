# New RPG Types Documentation

This document describes all the newly added types for NPCs, NPC Actions, Buildings, Locations, and Scripted Events.

**Note:** This is a **single-player RPG system**. All multiplayer-related types have been excluded.

---

## Table of Contents
1. [NPC Action Types](#npc-action-types)
2. [NPC Types](#npc-types)
3. [Building Types](#building-types)
4. [Location Types](#location-types)
5. [Scripted Event Types](#scripted-event-types)

---

## NPC Action Types

Extended from 8 types to **25 types**. New action types added:

### New Action Types (17 added)

#### 1. `fossilrevival`
Revive fossil items into Pokemon.

**Properties:**
- `fossils`: Array of accepted fossil item IDs
- `revivalCost`: Money cost to revive
- `pokemon`: Resulting Pokemon data

**Example:**
```typescript
action: {
  type: 'fossilrevival',
  fossils: ['helixfossil', 'domefossil', 'oldamber'],
  revivalCost: 1500,
}
```

#### 2. `dailyreward`
Give rewards to players on a daily basis (daily login bonuses).

**Properties:**
- `rewards`: Array of items with quantities and day requirements
- `lastClaimTime`: Timestamp tracking

**Example:**
```typescript
action: {
  type: 'dailyreward',
  rewards: [
    { itemId: 'rarecandy', quantity: 1, days: 7 },
    { itemId: 'masterball', quantity: 1, days: 30 }
  ]
}
```

#### 3. `battlerequest`
NPC challenges player to a battle with cooldown.

**Properties:**
- `trainerId`: Trainer to battle
- `battleCooldown`: Hours between battles
- `battleReward`: Items or money for winning

**Example:**
```typescript
action: {
  type: 'battlerequest',
  trainerId: 'dailychallenge_ace',
  battleCooldown: 24,
  battleReward: { money: 5000, itemId: 'rarecandy' }
}
```

#### 4. `questchain`
Multi-stage quest system with progression tracking.

**Properties:**
- `questId`: Unique quest identifier
- `questStages`: Array of quest stages with requirements
- `currentStage`: Progress tracker

**Example:**
```typescript
action: {
  type: 'questchain',
  questId: 'legendary_birds',
  questStages: [
    { stage: 1, description: 'Find the three legendary birds', requiredFlag: 'seen_articuno' },
    { stage: 2, description: 'Defeat all three birds', requiredFlag: 'caught_all_birds', reward: { itemId: 'masterball' } }
  ]
}
```

#### 5. `itemcraft`
Combine items to create new items.

**Properties:**
- `recipes`: Array of crafting recipes with inputs/outputs

**Example:**
```typescript
action: {
  type: 'itemcraft',
  recipes: [
    {
      inputs: [{ itemId: 'potion', quantity: 3 }],
      output: { itemId: 'superpotion', quantity: 1 }
    }
  ]
}
```

#### 6. `berryplant`
Plant berries that grow over time.

**Properties:**
- `berryId`: Berry to plant
- `growthTime`: Hours to grow
- `yieldQuantity`: Berries harvested

**Example:**
```typescript
action: {
  type: 'berryplant',
  berryId: 'oranberry',
  growthTime: 48,
  yieldQuantity: 5
}
```

#### 7. `pokemongrooming`
Groom Pokemon to increase friendship.

**Properties:**
- `groomingCost`: Money cost
- `friendshipBoost`: Friendship increase amount

**Example:**
```typescript
action: {
  type: 'pokemongrooming',
  groomingCost: 500,
  friendshipBoost: 10
}
```

#### 8. `fortuneteller`
Tell fortunes that provide temporary boosts.

**Properties:**
- `fortuneTypes`: Types of fortunes available
- `fortuneDuration`: Hours fortune lasts

**Example:**
```typescript
action: {
  type: 'fortuneteller',
  fortuneTypes: ['luck', 'battle', 'catch'],
  fortuneDuration: 24
}
```

#### 9. `pokemonbreeder`
Breed Pokemon to produce eggs.

**Properties:**
- `breedingCost`: Cost per breeding
- `eggGroupCompatibility`: Check egg groups

**Example:**
```typescript
action: {
  type: 'pokemonbreeder',
  breedingCost: 10000,
  eggGroupCompatibility: true
}
```

#### 10. `moverelearner`
Relearn previously learned moves or egg moves.

**Properties:**
- `relearnerCost`: Cost per move
- `allowEggMoves`: Can relearn egg moves

**Example:**
```typescript
action: {
  type: 'moverelearner',
  relearnerCost: 2000,
  allowEggMoves: true
}
```

#### 11. `abilitycapsule`
Change Pokemon's ability.

**Properties:**
- `capsuleCost`: Cost to change ability

**Example:**
```typescript
action: {
  type: 'abilitycapsule',
  capsuleCost: 20000
}
```

#### 12. `evtrainer`
Train specific EVs (Effort Values).

**Properties:**
- `evStat`: Stat to train (atk, def, spa, spd, spe, hp)
- `evCost`: Cost per EV point
- `evAmount`: Number of EVs to add

**Example:**
```typescript
action: {
  type: 'evtrainer',
  evStat: 'atk',
  evCost: 100,
  evAmount: 10
}
```

#### 13. `ivchecker`
Check Pokemon's IVs (Individual Values).

**Properties:**
- `showIVs`: Display exact IV numbers

**Example:**
```typescript
action: {
  type: 'ivchecker',
  showIVs: true
}
```

#### 14. `mysterygift`
Distribute special mystery gifts.

**Properties:**
- `mysteryGiftId`: Unique gift ID
- `giftContents`: Pokemon or items in gift

**Example:**
```typescript
action: {
  type: 'mysterygift',
  mysteryGiftId: 'event2024_mewtwo',
  giftContents: { pokemon: { species: 'mewtwo', level: 70, shiny: true } }
}
```

#### 15. `lottery`
Run lottery system with prizes.

**Properties:**
- `lotteryTicketCost`: Cost per ticket
- `lotteryPrizes`: Possible prizes with chances

**Example:**
```typescript
action: {
  type: 'lottery',
  lotteryTicketCost: 1000,
  lotteryPrizes: [
    { itemId: 'masterball', chance: 0.01 },
    { itemId: 'rarecandy', chance: 0.1 },
    { itemId: 'potion', chance: 0.5 }
  ]
}
```

#### 16. `masseuse`
Give Pokemon massages for friendship.

**Properties:**
- `massageCost`: Cost for massage
- `massageFriendshipBoost`: Friendship increase

**Example:**
```typescript
action: {
  type: 'masseuse',
  massageCost: 800,
  massageFriendshipBoost: 15
}
```

#### 17. `haircutter`
Give Pokemon haircuts for friendship.

**Properties:**
- `haircutCost`: Cost for haircut
- `haircutFriendshipBoost`: Friendship increase

**Example:**
```typescript
action: {
  type: 'haircutter',
  haircutCost: 600,
  haircutFriendshipBoost: 12
}
```

#### 18. `photographer`
Take photos of Pokemon for rewards.

**Properties:**
- `photographyCost`: Cost to take photo
- `photoReward`: Reward for taking photo

**Example:**
```typescript
action: {
  type: 'photographer',
  photographyCost: 500,
  photoReward: { itemId: 'photoalbum', quantity: 1 }
}
```

---

## NPC Types

Extended from 5 types to **42 types**. New NPC types added:

### Original Types (5)
- `normal` - Standard NPCs with dialogue
- `movetutor` - Teaches moves
- `movedeleter` - Deletes moves
- `namerater` - Renames Pokemon
- `nurse` - Heals Pokemon

### New Types (37 added)

#### Service NPCs
- `shopkeeper` - Runs shops
- `daycareworker` - Manages day care
- `fossildiscoverer` - Revives fossils
- `trader` - Trades items/Pokemon
- `breeder` - Breeds Pokemon
- `photographer` - Takes photos

#### Battle-Related NPCs
- `gymleader` - Gym leader battles
- `elitefoura` - Elite Four members
- `champion` - Champion battles
- `rival` - Rival character
- `gymtrainer` - Trainers in gyms
- `cooltrainer` - Cool trainer class
- `veteran` - Veteran trainer class
- `battlefacilityhost` - Hosts battle facilities

#### Story NPCs
- `professor` - Professor character
- `scientist` - Lab scientists
- `questgiver` - Gives quests
- `storyteller` - Tells stories/lore
- `teamrocket` - Team Rocket grunts
- `teamadmin` - Team admins
- `teamboss` - Team boss

#### Specialist NPCs
- `collector` - Collects items
- `ranger` - Pokemon ranger
- `sage` - Wise character
- `mystic` - Mystical character
- `fortuneteller` - Tells fortunes
- `artist` - Artist character
- `musician` - Musician character
- `chef` - Chef character
- `fashiondesigner` - Fashion designer
- `journalist` - Journalist character
- `athlete` - Athletic character
- `contestjudge` - Judges contests

#### Authority NPCs
- `policeOfficer` - Police officer
- `detective` - Detective
- `guard` - Security guard
- `gatekeeper` - Gate keeper

---

## Building Types

Extended from 8 types to **47 types**. New building types added:

### Original Types (8)
- `pokecenter` - Pokemon Center
- `pokemart` - Poke Mart
- `gym` - Gym
- `house` - Generic house
- `lab` - Research lab
- `museum` - Museum
- `gameCorner` - Game corner
- `department` - Department store

### New Types (39 added)

#### Pokemon Services
- `daycare` - Pokemon day care
- `battlefacility` - Battle facility (generic)
- `battletower` - Battle Tower
- `battlefrontier` - Battle Frontier
- `contesthall` - Contest hall
- `salon` - Pokemon salon
- `spa` - Pokemon spa
- `fossillab` - Fossil revival lab
- `pokemoncenter_mega` - Large Pokemon Center
- `tradestation` - Trading station (NPC-only trades)
- `incubator` - Egg incubator
- `pokeathalon` - Pokeathalon dome
- `ranchhouse` - Pokemon ranch

#### Commercial
- `cafe` - Cafe
- `restaurant` - Restaurant
- `hotel` - Hotel
- `berry_shop` - Berry shop
- `movetutorshop` - Move tutor shop
- `arcade` - Arcade
- `casino` - Casino
- `theater` - Theater

#### Educational/Cultural
- `library` - Library
- `school` - Pokemon school
- `radio` - Radio station
- `tvstation` - TV station

#### Training
- `dojo` - Training dojo
- `gym_training` - Gym training area

#### Spiritual
- `temple` - Temple
- `shrine` - Shrine

#### Industrial
- `powerplant` - Power plant
- `factory` - Factory
- `warehouse` - Warehouse
- `lighthouse` - Lighthouse
- `windmill` - Windmill

#### Special/Misc
- `secretbase` - Secret base
- `pokemonfancyclub` - Pokemon Fan Club
- `namereater` - Name Rater house
- `movedeleterhouse` - Move Deleter house
- `hideout` - Secret hideout
- `abandonedbuilding` - Abandoned building
- `ruins` - Ancient ruins
- `tower` - Tower building

---

## Location Types

Extended from 4 types to **40 types**. New location types added:

### Original Types (4)
- `town` - Small town
- `city` - Large city
- `route` - Path/route
- `special` - Special location

### New Types (36 added)

#### Natural Environments
- `cave` - Cave system
- `forest` - Forest area
- `mountain` - Mountain area
- `beach` - Beach area
- `island` - Island
- `desert` - Desert area
- `volcano` - Volcanic area
- `lake` - Lake area
- `river` - River area
- `ocean` - Ocean area
- `underwater` - Underwater area
- `meadow` - Meadow/grassland
- `swamp` - Swamp area
- `tundra` - Tundra area
- `glacier` - Glacier area
- `ravine` - Ravine/gorge
- `plateau` - Plateau area
- `canyon` - Canyon area
- `oasis` - Oasis

#### Sky & Space
- `sky` - Sky area (flying)
- `space` - Outer space

#### Mystical
- `distortionworld` - Distortion World
- `dreamworld` - Dream World

#### Recreational
- `safari` - Safari Zone
- `park` - Park area

#### Structures
- `ruins` - Ancient ruins
- `dungeon` - Dungeon
- `tower` - Tower structure
- `powerplant` - Power plant location
- `factory` - Factory location
- `mansion` - Mansion location
- `castle` - Castle location
- `bridge` - Bridge
- `tunnel` - Tunnel

#### Terrain Features
- `pathway` - Pathway
- `graveyard` - Graveyard/cemetery

#### Battle Locations
- `battlefield` - Battlefield
- `colosseum` - Colosseum
- `stadium` - Stadium

---

## Scripted Event Types

Extended from 5 types to **50 types**. New event types added:

### Original Types (5)
- `trainer` - Trainer battle
- `dialogue` - Display dialogue
- `item` - Give item
- `pokemon` - Gift Pokemon
- `wildbattle` - Wild Pokemon encounter

### New Types (42 added)

#### Battle Events
- `bossbattle` - Special boss battle with phases
- `tournament` - Tournament event (single-player vs AI)
- `ambush` - Ambush battle
- `defense` - Defense battle

#### Interactive Events
- `choice` - Player makes a choice
- `quiz` - Quiz/trivia event
- `puzzle` - Puzzle solving
- `riddle` - Riddle solving
- `minigame` - Mini-game event
- `scavengerhunt` - Scavenger hunt
- `investigation` - Investigation event
- `race` - Racing event
- `contest` - Pokemon contest

#### Story Events
- `cutscene` - Cinematic cutscene
- `revelation` - Story revelation
- `betrayal` - Betrayal event
- `alliance` - Form alliance
- `negotiation` - Negotiation event
- `discovery` - Discovery event
- `prophecy` - Prophecy event

#### Action Events
- `stealth` - Stealth mission
- `escape` - Escape sequence
- `rescue` - Rescue mission

#### Natural Events
- `weather_change` - Weather changes
- `earthquake` - Earthquake event
- `explosion` - Explosion event
- `flood` - Flood event
- `meteor` - Meteor strike
- `eclipse` - Eclipse event

#### Pokemon-Specific Events
- `pokemonswarm` - Pokemon swarm appears
- `evolution_ceremony` - Special evolution
- `legendary_awakening` - Legendary awakens
- `transformation` - Pokemon transformation

#### Mystical Events
- `timewarp` - Time travel event
- `dimensionrift` - Dimension rift
- `portal_opening` - Portal opens
- `dimension_merge` - Dimensions merge
- `timeloop` - Time loop event
- `ancient_seal` - Ancient seal event

---

## Summary Statistics

### Total Types Added
- **NPC Action Types:** 8 → 25 (+17 new types, 312% increase)
- **NPC Types:** 5 → 42 (+37 new types, 840% increase)
- **Building Types:** 8 → 46 (+38 new types, 575% increase)
- **Location Types:** 4 → 40 (+36 new types, 1000% increase)
- **Scripted Event Types:** 5 → 47 (+42 new types, 940% increase)

### Total New Types: **170 new types added**

**Note:** Multiplayer-related types removed:
- Removed from Building Types: `globaltradestation` (1 type)
- Removed from Scripted Event Types: `multibattle`, `massbattle`, `raidbattle`, `siege` (4 types)

---

## Implementation Notes

### For Developers

1. **Type Safety**: All new types are defined in TypeScript interfaces for type checking
2. **Backwards Compatibility**: Original types remain unchanged
3. **Optional Properties**: New properties are optional to avoid breaking existing code
4. **Extensibility**: Types can be further extended without breaking changes

### Usage Guidelines

1. Not all types need to be implemented immediately
2. Types serve as a roadmap for future features
3. Implement types based on priority and game design needs
4. Document implementations as they are added

### Priority Recommendations

**High Priority (Core Gameplay):**
- `fossilrevival` - Fits Pokemon theme well
- `dailyreward` - Player engagement
- `battlerequest` - Replayability
- `bossbattle` - Battle variety with phases
- `tournament` - Single-player tournament progression

**Medium Priority (Enhancement):**
- `questchain` - Story depth
- `pokemonbreeder` - Pokemon diversity
- `evtrainer` - Competitive features
- `cutscene` - Story presentation
- `tournament` - Structured competition

**Low Priority (Polish):**
- `fortuneteller` - Fun but not essential
- `photographer` - Nice-to-have
- `haircutter` - Cosmetic feature
- `eclipse` - Rare events
- `timeloop` - Complex mechanics

---

## Examples of Combined Usage

### Example 1: Fossil Revival Lab
```typescript
// Location
{
  id: 'cinnabar_lab',
  type: 'lab',
  buildings: [{
    id: 'fossil_revival',
    type: 'fossillab',
    npcs: ['fossil_scientist']
  }]
}

// NPC
{
  id: 'fossil_scientist',
  name: 'Fossil Researcher',
  npcType: 'fossildiscoverer',
  action: {
    type: 'fossilrevival',
    fossils: ['helixfossil', 'domefossil', 'oldamber'],
    revivalCost: 2000
  }
}
```

### Example 2: Daily Challenge
```typescript
// Building
{
  id: 'battle_facility',
  type: 'battlefacility',
  npcs: ['daily_challenger']
}

// NPC
{
  id: 'daily_challenger',
  name: 'Battle Master',
  npcType: 'battlefacilityhost',
  action: {
    type: 'battlerequest',
    trainerId: 'master_trainer',
    battleCooldown: 24,
    battleReward: { money: 10000, itemId: 'rarecandy' }
  }
}
```

### Example 3: Legendary Event Chain
```typescript
// Event 1: Discovery
{
  id: 'legend_discovery',
  type: 'discovery',
  dialogue: 'Ancient texts speak of three legendary birds...',
  setFlag: 'legend_quest_started'
}

// Event 2: Investigation
{
  id: 'legend_investigation',
  type: 'investigation',
  requiredFlag: 'legend_quest_started',
  clues: ['feather1', 'feather2', 'feather3'],
  setFlag: 'legend_quest_clues'
}

// Event 3: Awakening
{
  id: 'legend_awakening',
  type: 'legendary_awakening',
  requiredFlag: 'legend_quest_clues',
  pokemon: { species: 'articuno', level: 50 }
}
```

---

## Conclusion

The RPG type system has been significantly expanded with **174 new types** across all major categories. This provides a comprehensive framework for building a rich, diverse Pokemon RPG experience with many gameplay possibilities.

The types are designed to be:
- ✅ **Flexible** - Can be combined in many ways
- ✅ **Extensible** - Easy to add more in the future
- ✅ **Type-safe** - Full TypeScript support
- ✅ **Documented** - Clear usage examples
- ✅ **Backwards Compatible** - Doesn't break existing code

Implement these types gradually based on game design priorities and player engagement metrics.
