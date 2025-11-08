# Pokemon Crystal Story Implementation Guide

## Complete Documentation: Creating a Pokemon Crystal-Style Story 1:1 via the RPG System

This comprehensive guide documents every step of creating a Pokemon Crystal-inspired story through the RPG system. This system recreates the classic Pokemon experience with locations, trainers, gym leaders, story progression, and the Elite Four challenge.

---

## Table of Contents

1. [System Architecture Overview](#system-architecture-overview)
2. [Core Components](#core-components)
3. [Story Progression Structure](#story-progression-structure)
4. [Step-by-Step Implementation Guide](#step-by-step-implementation-guide)
5. [Location Creation](#location-creation)
6. [Trainer & Gym Leader Setup](#trainer--gym-leader-setup)
7. [Story Events & Scripted Encounters](#story-events--scripted-encounters)
8. [Game Progression Flow](#game-progression-flow)
9. [Battle System Integration](#battle-system-integration)
10. [Advanced Features](#advanced-features)

---

## System Architecture Overview

The RPG system is built with a modular architecture consisting of several interconnected TypeScript files:

### File Structure
```
rpg-wip/
├── core.ts                 - Core game logic, player data management
├── commands.ts             - User command handlers (Controller layer)
├── interface.ts            - Type definitions for all game objects
├── data.ts                 - Static game data (type chart, starters)
├── locations.ts            - Location definitions & encounter zones
├── trainers.ts             - Trainer and gym leader definitions
├── npcs.ts                 - NPC dialogue and actions
├── story-events.ts         - Story event definitions
├── scripted-events.ts      - Event handling logic
├── battle-*.ts             - Battle system components
├── items.ts                - Item database and usage logic
├── shop.ts                 - Shop inventory and tiers
├── abilities.ts            - Pokemon ability implementations
├── utils.ts                - Utility functions
├── html.ts                 - UI generation
└── MANUAL_*.ts             - Manual data overrides
```

### Data Flow
```
User Command → commands.ts → core.ts/battle-engine.ts → HTML Response
                    ↓              ↓
              locations.ts    trainers.ts
              story-events.ts  npcs.ts
```

---

## Core Components

### 1. Player Data Structure (`interface.ts`)

```typescript
interface PlayerData {
    id: string;                          // User ID
    name: string;                        // Player name
    level: number;                       // Trainer level
    experience: number;                  // Trainer experience
    badges: number;                      // Badge count (0-8)
    party: RPGPokemon[];                // Active Pokemon (max 6)
    location: string;                    // Current location ID
    money: number;                       // In-game currency
    inventory: Map<string, InventoryItem>;
    pc: Map<string, RPGPokemon>;        // PC storage
    storyFlags: Set<string>;            // Story progression flags
    defeatedTrainers: Set<string>;      // Defeated trainer IDs
    obtainedBadges: string[];           // Badge names collected
    visitedLocations: Set<string>;      // Visited location IDs
    lastPokemonCenter?: string;         // Last heal point
    completedNPCActions: Set<string>;   // One-time NPC interactions
}
```

### 2. Location Structure

```typescript
interface Location {
    id: string;                         // Unique identifier
    name: string;                       // Display name
    type: 'town' | 'city' | 'route' | 'special';
    description: string;                // Location description
    weather?: string;                   // Weather effects
    connectedLocations: Array<{
        id: string;
        name: string;
        requiredBadge?: string;         // Badge needed to access
        requiredFlag?: string;          // Flag needed to access
    }>;
    buildings?: Array<{                 // Buildings in location
        id: string;
        name: string;
        type: string;
        description: string;
        gymLeaderId?: string;           // For gyms
        shopTier?: number;              // For shops
        npcs?: string[];                // NPCs in building
    }>;
    encounterZones?: string[];          // Wild Pokemon areas
    scriptedEvents?: ScriptedEvent[];   // Special events
}
```

### 3. Trainer Structure

```typescript
interface TrainerSpec {
    name: string;                       // Trainer name
    money: number;                      // Reward money
    party: Array<{                      // Trainer's Pokemon
        species: string;
        level: number;
        moves?: string[];               // Custom moves
        item?: string;                  // Held item
    }>;
    dialogue: {                         // Battle dialogue
        start: string;                  // Before battle
        win: string;                    // When defeated
        lose: string;                   // When player loses
    };
}
```

---

## Story Progression Structure

### Badge Progression System

The game follows the classic 8-gym badge structure:

1. **Boulder Badge** (Pewter City - Brock) - Rock-type
2. **Cascade Badge** (Cerulean City - Misty) - Water-type
3. **Thunder Badge** (Vermilion City - Lt. Surge) - Electric-type
4. **Rainbow Badge** (Celadon City - Erika) - Grass-type
5. **Soul Badge** (Fuchsia City - Koga) - Poison-type
6. **Volcano Badge** (Cinnabar Island - Blaine) - Fire-type
7. **Marsh Badge** (Saffron City - Sabrina) - Psychic-type
8. **Earth Badge** (Viridian City - Giovanni) - Ground-type

### Location Gating

Locations use badge requirements to control progression:

```typescript
// Example from locations.ts
connectedLocations: [
    { id: 'pewtercity', name: 'Pewter City' },
    { id: 'route2', name: 'Route 2', requiredBadge: 'Boulder Badge' }
]
```

### Story Flags System

Story flags track player progress and enable/disable events:

```typescript
// Key story flags used:
'game_started'              // Player has begun
'first_badge_earned'        // Earned first badge
'route1_rival_defeated'     // Defeated rival on Route 1
'red_gyarados_encountered'  // Met the shiny Gyarados
'all_badges'                // Collected all 8 badges
'champion'                  // Defeated Champion
'game_complete'             // Finished main story
```

---

## Step-by-Step Implementation Guide

### Step 1: Initial Setup (Starter Town)

**Location Definition** (`locations.ts`):

```typescript
'startertown': {
    id: 'startertown',
    name: 'Starter Town',
    type: 'town',
    weather: 'sun',
    description: 'A peaceful town where your journey begins.',
    connectedLocations: [
        { id: 'route1', name: 'Route 1' }
    ],
    buildings: [
        {
            id: 'startertown_pokecenter',
            name: 'Pokemon Center',
            type: 'pokecenter',
            npcs: ['nursejoystartertown']
        },
        {
            id: 'startertown_pokemart',
            name: 'Poke Mart',
            type: 'pokemart',
            shopTier: 1
        },
        {
            id: 'startertown_lab',
            name: 'Professor\'s Lab',
            type: 'lab',
            npcs: ['professor']
        }
    ],
    encounterZones: ['startertown_grass', 'startertown_pond'],
    scriptedEvents: [
        {
            id: 'welcome_to_startertown',
            name: 'Professor Oak\'s Welcome',
            triggerOnce: true,
            type: 'dialogue',
            dialogue: 'Welcome to Starter Town! I\'m Professor Oak...'
        }
    ]
}
```

**Encounter Zone** (`locations.ts`):

```typescript
'startertown_grass': {
    name: 'Tall Grass',
    pokemon: ['pidgey', 'rattata', 'caterpie', 'weedle'],
    levelRange: [2, 5],
    battleType: 'single'
}
```

**NPC Definition** (`npcs.ts`):

```typescript
'professor': {
    id: 'professor',
    name: 'Professor Oak',
    location: 'startertown_lab',
    dialogue: "Welcome! I research Pokémon as a profession..."
}
```

### Step 2: First Route & Trainer Battles (Route 1)

**Route Location**:

```typescript
'route1': {
    id: 'route1',
    name: 'Route 1',
    type: 'route',
    description: 'A scenic route filled with tall grass.',
    connectedLocations: [
        { id: 'startertown', name: 'Starter Town' },
        { id: 'pewtercity', name: 'Pewter City' }
    ],
    encounterZones: ['route1_grass', 'route1_forest'],
    scriptedEvents: [
        {
            id: 'route1_first_visit',
            name: 'First Route Experience',
            triggerOnce: true,
            maxBadgeCount: 0,
            type: 'dialogue',
            dialogue: 'This is your first route! Wild Pokémon hide in the tall grass.'
        },
        {
            id: 'route1_return_with_badge',
            name: 'Rival Returns',
            triggerOnce: true,
            requiredBadgeCount: 1,
            type: 'trainer',
            trainerId: 'rival1',
            dialogue: 'Hey! I heard you beat Brock!',
            setFlag: 'route1_rival_defeated'
        }
    ]
}
```

**Basic Trainer** (`trainers.ts`):

```typescript
'youngsterjoey': {
    name: 'Youngster Joey',
    money: 240,
    party: [
        { species: 'rattata', level: 6 }
    ],
    dialogue: {
        start: "My Rattata is in the top percentage of Rattata!",
        win: "My Rattata needs more training...",
        lose: "See? Top percentage!"
    }
}
```

### Step 3: First Gym (Pewter City)

**City Location**:

```typescript
'pewtercity': {
    id: 'pewtercity',
    name: 'Pewter City',
    type: 'city',
    description: 'A city known for its stone and rock Pokemon.',
    connectedLocations: [
        { id: 'route1', name: 'Route 1' },
        { id: 'route2', name: 'Route 2', requiredBadge: 'Boulder Badge' }
    ],
    buildings: [
        {
            id: 'pewtercity_gym',
            name: 'Pewter City Gym',
            type: 'gym',
            description: 'The Pewter City Gym...',
            gymLeaderId: 'gymbrock'
        }
    ]
}
```

**Gym Leader** (`trainers.ts`):

```typescript
'gymbrock': {
    name: 'Gym Leader Brock',
    money: 1680,
    party: [
        { 
            species: 'geodude', 
            level: 12, 
            moves: ['tackle', 'defensecurl', 'rockthrow', 'rollout']
        },
        { 
            species: 'onix', 
            level: 14, 
            moves: ['tackle', 'rockthrow', 'bind', 'rockpolish'], 
            item: 'sitrusberry' 
        }
    ],
    dialogue: {
        start: "I'm Brock! I'm Pewter's Gym Leader!",
        win: "I took you for granted. Here's the Boulder Badge!",
        lose: "The best offense is a good defense!"
    }
}
```

### Step 4: Progression Through All 8 Gyms

**Route 2** (Post-Brock):
- Requires Boulder Badge to access
- Features stronger wild Pokemon (level 10-14)
- Rival battle event
- Cave areas with Rock/Ground types

**Cerulean City** (Gym 2 - Misty):
- Water-type specialist
- Cascade Badge reward
- Special shiny Gyarados event after defeating Misty

**Vermilion City** (Gym 3 - Lt. Surge):
- Electric-type specialist
- Thunder Badge requirement for Route 4
- Port-themed location

**Celadon City** (Gym 4 - Erika):
- Grass-type specialist
- Largest city with Department Store (shop tier 4)
- Game Corner building

**Fuchsia City** (Gym 5 - Koga):
- Poison-type specialist
- Safari Zone with rare Pokemon
- Soul Badge unlocks Route 6

**Cinnabar Island** (Gym 6 - Blaine):
- Fire-type specialist
- Volcanic area with Fire Pokemon
- Research Lab building

**Saffron City** (Gym 7 - Sabrina):
- Psychic-type specialist
- Marsh Badge reward

**Viridian City** (Gym 8 - Giovanni):
- Ground-type specialist
- Final gym before Elite Four
- Earth Badge grants access to Victory Road

### Step 5: Victory Road & Pokemon League

**Victory Road**:

```typescript
'victoryroad': {
    id: 'victoryroad',
    name: 'Victory Road',
    type: 'special',
    description: 'A treacherous cave filled with powerful trainers.',
    connectedLocations: [
        { id: 'viridiancity', name: 'Viridian City' },
        { id: 'pokemonleague', name: 'Pokemon League' }
    ],
    encounterZones: ['victoryroad_cave', 'victoryroad_doubles'],
    scriptedEvents: [
        {
            id: 'moltres_encounter',
            name: 'Legendary Bird',
            triggerOnce: true,
            requiredBadgeCount: 8,
            type: 'wildbattle',
            pokemon: {
                species: 'moltres',
                level: 50,
                moves: ['fireblast', 'airslash', 'heatwave', 'roost']
            },
            dialogue: 'A legendary bird Pokemon appears!'
        }
    ]
}
```

**Elite Four** (`trainers.ts`):

```typescript
// Elite Four Member 1 - Lorelei (Ice)
'elitelorelei': {
    name: 'Elite Four Lorelei',
    money: 10000,
    party: [
        { species: 'dewgong', level: 54, moves: [...], item: 'chestoberry' },
        { species: 'cloyster', level: 54, moves: [...], item: 'focussash' },
        { species: 'slowbro', level: 54, moves: [...], item: 'leftovers' },
        { species: 'jynx', level: 56, moves: [...], item: 'lifeorb' },
        { species: 'lapras', level: 58, moves: [...], item: 'sitrusberry' }
    ],
    dialogue: { ... }
}

// Elite Four Member 2 - Bruno (Fighting)
'elitebruno': { ... }

// Elite Four Member 3 - Agatha (Poison/Ghost)
'eliteagatha': { ... }

// Elite Four Member 4 - Lance (Dragon)
'elitelance': { ... }

// Champion - Blue
'championblue': {
    name: 'Champion Blue',
    money: 15000,
    party: [
        { species: 'pidgeot', level: 61, moves: [...] },
        { species: 'alakazam', level: 61, moves: [...] },
        { species: 'rhydon', level: 61, moves: [...] },
        { species: 'exeggutor', level: 63, moves: [...] },
        { species: 'gyarados', level: 63, moves: [...] },
        { species: 'blastoise', level: 65, moves: [...] }
    ],
    dialogue: {
        start: "I've been waiting for you! I'm Blue, the Champion!",
        win: "What!? I lost!? You are the new Champion!",
        lose: "I'm the Champion for a reason!"
    }
}
```

### Step 6: Story Event Triggers

**Story Events** (`story-events.ts`):

```typescript
export const STORY_EVENTS: Record<string, StoryEvent> = {
    'welcome': {
        id: 'welcome',
        name: 'Welcome to the World',
        trigger: 'manual',
        flagsSet: ['game_started'],
        dialogue: 'Welcome to the world of Pokémon!'
    },
    'first_badge': {
        id: 'first_badge',
        name: 'First Badge Earned',
        trigger: 'badge_obtain',
        badgeName: 'Boulder Badge',
        flagsSet: ['first_badge_earned'],
        dialogue: 'Congratulations on earning your first badge!'
    },
    'all_badges': {
        id: 'all_badges',
        name: 'All Badges Obtained',
        trigger: 'badge_obtain',
        badgeName: 'Earth Badge',
        flagsSet: ['all_badges'],
        dialogue: 'You have all eight badges! Victory Road awaits.'
    },
    'championdefeated': {
        id: 'championdefeated',
        name: 'Champion Defeated',
        trigger: 'trainer_defeat',
        trainerId: 'championblue',
        flagsSet: ['champion', 'game_complete'],
        dialogue: "Congratulations! You are the new Champion!"
    }
}
```

---

## Location Creation

### Creating a New Location

1. **Define Location Object** in `locations.ts`:

```typescript
'newcity': {
    id: 'newcity',                      // Unique ID (lowercase, no spaces)
    name: 'New City',                   // Display name
    type: 'city',                       // town/city/route/special
    description: 'A bustling metropolis...',
    weather: 'rain',                    // Optional: sun/rain/sandstorm/hail
    connectedLocations: [
        { id: 'previouslocation', name: 'Previous Location' },
        { 
            id: 'nextlocation', 
            name: 'Next Location',
            requiredBadge: 'Some Badge'  // Optional gate
        }
    ],
    buildings: [
        {
            id: 'newcity_pokecenter',
            name: 'Pokemon Center',
            type: 'pokecenter',
            description: 'Heal your Pokemon here.',
            npcs: ['nursejoynewcity']
        },
        {
            id: 'newcity_gym',
            name: 'New City Gym',
            type: 'gym',
            description: 'Challenge the gym leader!',
            gymLeaderId: 'gymnewleader'
        }
    ],
    encounterZones: ['newcity_grass'],
    scriptedEvents: [/* Optional events */]
}
```

2. **Create Encounter Zones**:

```typescript
'newcity_grass': {
    name: 'City Outskirts',
    pokemon: ['species1', 'species2', 'species3'],
    levelRange: [20, 25],
    battleType: 'single'  // or 'double'
}
```

3. **Add NPCs** in `npcs.ts`:

```typescript
'nursejoynewcity': {
    id: 'nursejoynewcity',
    name: 'Nurse Joy',
    location: 'newcity_pokecenter',
    dialogue: "Welcome to the Pokémon Center!"
}
```

---

## Trainer & Gym Leader Setup

### Creating a Regular Trainer

```typescript
'trainername': {
    name: 'Trainer Name',
    money: 500,                         // Reward amount
    party: [
        { 
            species: 'pokemon1', 
            level: 15 
        },
        { 
            species: 'pokemon2', 
            level: 17,
            moves: ['move1', 'move2', 'move3', 'move4'],  // Optional
            item: 'oranberry'                              // Optional
        }
    ],
    dialogue: {
        start: "Let's battle!",
        win: "I lost...",
        lose: "I won!"
    }
}
```

### Creating a Gym Leader

Gym leaders follow the same structure but typically have:
- Higher reward money (based on badge number: badgeNum × 840)
- Stronger Pokemon with held items
- Strategic move sets
- Type-themed teams

```typescript
'gymnewleader': {
    name: 'Gym Leader Name',
    money: 4200,                        // For 5th gym: 5 × 840
    party: [
        { 
            species: 'pokemon1', 
            level: 30,
            moves: ['stab1', 'coverage1', 'setup', 'utility']
        },
        { 
            species: 'pokemon2', 
            level: 32,
            moves: ['stab2', 'coverage2', 'status', 'priority'],
            item: 'sitrusberry'
        },
        { 
            species: 'acepokemon', 
            level: 35,
            moves: ['bestmove1', 'bestmove2', 'bestmove3', 'bestmove4'],
            item: 'focussash'              // Ace usually has best item
        }
    ],
    dialogue: {
        start: "I am [Name], master of [Type]-type Pokemon!",
        win: "You've earned the [Badge Name]!",
        lose: "[Type]-types are the strongest!"
    }
}
```

---

## Story Events & Scripted Encounters

### Types of Scripted Events

1. **Dialogue Events** - Simple text display
2. **Trainer Events** - Forced trainer battles
3. **Wild Battle Events** - Special wild Pokemon encounters
4. **Item Events** - Receive items
5. **Cutscene Events** - Cinematic sequences
6. **Choice Events** - Player makes decisions

### Event Properties

```typescript
interface ScriptedEvent {
    id: string;                         // Unique identifier
    name: string;                       // Display name
    triggerOnce?: boolean;              // Only happens once
    type: 'dialogue' | 'trainer' | 'wildbattle' | 'item' | ...;
    
    // Conditions
    requiredBadgeCount?: number;        // Min badges needed
    maxBadgeCount?: number;             // Max badges allowed
    requiredFlag?: string;              // Flag must be set
    requiredFlags?: string[];           // All flags must be set
    
    // Actions
    dialogue?: string;                  // Text to display
    trainerId?: string;                 // Trainer to battle
    pokemon?: {...};                    // Wild Pokemon spec
    itemId?: string;                    // Item to receive
    itemQuantity?: number;              // Amount of item
    setFlag?: string;                   // Flag to set after
}
```

### Example: Legendary Pokemon Encounter

```typescript
{
    id: 'legendary_bird',
    name: 'Legendary Encounter',
    triggerOnce: true,
    requiredBadgeCount: 7,
    type: 'wildbattle',
    pokemon: {
        species: 'articuno',
        level: 50,
        moves: ['blizzard', 'airslash', 'icebeam', 'roost'],
        shiny: false                    // Can be true for guaranteed shiny
    },
    dialogue: 'A magnificent icy bird appears before you!',
    setFlag: 'articuno_encountered'
}
```

### Example: Rival Battle

```typescript
{
    id: 'rival_route5',
    name: 'Rival Battle',
    triggerOnce: true,
    requiredBadgeCount: 4,
    type: 'trainer',
    trainerId: 'rival3',
    dialogue: "You're still here? Let's see if you can keep up!",
    setFlag: 'rival3_defeated'
}
```

### Example: Gift Item

```typescript
{
    id: 'old_man_gift',
    name: 'Old Man\'s Gift',
    triggerOnce: true,
    requiredFlag: 'helped_old_man',
    type: 'item',
    itemId: 'masterball',
    itemQuantity: 1,
    dialogue: 'Thank you for your help! Please accept this rare item!'
}
```

---

## Game Progression Flow

### Complete Playthrough Path

```
1. Start Game
   └─> Choose Starter Pokemon (Fire/Water/Grass type)
   
2. Starter Town
   └─> Explore town, visit Pokemon Center, Mart, Lab
   └─> Talk to Professor Oak
   └─> Battle wild Pokemon in grass (Level 2-5)
   
3. Route 1
   └─> First route dialogue event
   └─> Battle wild Pokemon (Level 5-8)
   └─> Optional trainer battles
   
4. Pewter City (Badge 1)
   └─> Heal at Pokemon Center
   └─> Talk to museum NPC for strategy tips
   └─> Challenge Gym Leader Brock (Rock-type)
   └─> Earn Boulder Badge
   └─> Route 2 unlocked
   
5. Route 2
   └─> Rival battle (triggered by having 1 badge)
   └─> Stronger wild Pokemon (Level 10-14)
   └─> Cave encounters (Zubat, Geodude, Onix)
   
6. Cerulean City (Badge 2)
   └─> Challenge Gym Leader Misty (Water-type)
   └─> Earn Cascade Badge
   └─> Shiny Gyarados event (Level 30)
   └─> Route 3 unlocked
   
7. Vermilion City (Badge 3)
   └─> Challenge Gym Leader Lt. Surge (Electric-type)
   └─> Earn Thunder Badge
   └─> Route 4 unlocked
   
8. Celadon City (Badge 4)
   └─> Visit Department Store (Tier 4 shop)
   └─> Challenge Gym Leader Erika (Grass-type)
   └─> Earn Rainbow Badge
   └─> Route 5 unlocked
   
9. Fuchsia City (Badge 5)
   └─> Explore Safari Zone (rare Pokemon)
   └─> Challenge Gym Leader Koga (Poison-type)
   └─> Earn Soul Badge
   └─> Route 6 unlocked
   
10. Cinnabar Island (Badge 6)
    └─> Visit Pokemon Lab
    └─> Challenge Gym Leader Blaine (Fire-type)
    └─> Earn Volcano Badge
    └─> Route 7 unlocked
    
11. Saffron City (Badge 7)
    └─> Challenge Gym Leader Sabrina (Psychic-type)
    └─> Earn Marsh Badge
    
12. Route 7
    └─> Snorlax blocking path (Level 45 battle)
    └─> Strong wild Pokemon (Level 43-47)
    
13. Viridian City (Badge 8)
    └─> Challenge Gym Leader Giovanni (Ground-type)
    └─> Earn Earth Badge
    └─> All 8 badges collected!
    └─> Victory Road unlocked
    
14. Victory Road
    └─> Toughest wild Pokemon (Level 48-54)
    └─> Moltres legendary encounter (Level 50)
    └─> Multiple strong trainers
    
15. Pokemon League
    └─> Final Pokemon Center and Shop
    └─> Elite Four Battle Sequence:
        a. Lorelei (Ice-type, Level 54-58)
        b. Bruno (Fighting-type, Level 55-58)
        c. Agatha (Poison/Ghost-type, Level 55-60)
        d. Lance (Dragon-type, Level 56-62)
    └─> Champion Battle:
        └─> Blue (Mixed team, Level 61-65)
    
16. Game Complete!
    └─> Become Champion
    └─> 'game_complete' flag set
```

---

## Battle System Integration

### How Battles Are Triggered

1. **Wild Encounters**:
   - Player uses `/rpg battle` command
   - System selects random Pokemon from current location's encounter zones
   - Level determined by zone's levelRange
   - Battle type (single/double) based on zone configuration

2. **Trainer Battles**:
   - Player uses `/rpg trainer <trainerid>` command
   - Or triggered automatically by scripted events
   - Trainer Pokemon loaded from trainer definition
   - Badge gates prevent early battles

3. **Gym Battles**:
   - Player must be at gym location
   - Special command: `/rpg challenge <gymleaderid>`
   - Rewards badge on victory
   - Unlocks next area

### Battle State Management

```typescript
interface BattleState {
    playerId: string;
    turn: number;
    zoneId: string;                     // For wild battles
    
    // Active Pokemon
    playerSlots: ActivePokemonSlot[];
    opponentSlots: ActivePokemonSlot[];
    
    // Field conditions
    playerHazards: string[];            // Stealth Rock, Spikes, etc.
    opponentHazards: string[];
    weather?: { type: string, turns: number };
    trickRoomTurns: number;
    
    // Trainer battle specific
    isTrainerBattle?: boolean;
    trainerId?: string;
    trainerName?: string;
    trainerMoney?: number;
}
```

### Battle Commands

- `/rpg move <moveindex>` - Use a move (1-4)
- `/rpg switch <pokemonindex>` - Switch Pokemon
- `/rpg catch` - Attempt to catch (wild battles only)
- `/rpg run` - Attempt to flee (wild battles only)
- `/rpg item <itemname>` - Use an item

---

## Advanced Features

### 1. Scripted Event Types

**Cutscene Events**:
```typescript
{
    id: 'opening_cutscene',
    type: 'cutscene',
    cutsceneScript: [
        "Scene 1: Professor Oak's lab",
        "Oak: Welcome to the world of Pokemon!",
        "Oak: This world is inhabited by creatures called Pokemon.",
        "Scene 2: Your journey begins..."
    ]
}
```

**Choice Events**:
```typescript
{
    id: 'moral_choice',
    type: 'choice',
    dialogue: "A trainer is being attacked! What do you do?",
    choices: [
        {
            text: "Help the trainer",
            resultFlag: 'helped_trainer',
            resultDialogue: "The trainer thanks you!"
        },
        {
            text: "Walk away",
            resultFlag: 'ignored_trainer',
            resultDialogue: "You continue on your way..."
        }
    ]
}
```

**Quiz Events**:
```typescript
{
    id: 'pokemon_quiz',
    type: 'quiz',
    question: "What type is super effective against Water?",
    answers: ["Fire", "Grass", "Rock", "Normal"],
    correctAnswer: 1,                   // Index of correct answer (Grass)
    rewardItem: 'nugget'
}
```

### 2. Weather System

Locations can have permanent weather that affects battles:

```typescript
weather: 'sun'      // Boosts Fire moves, weakens Water
weather: 'rain'     // Boosts Water moves, weakens Fire
weather: 'sandstorm' // Damages non-Rock/Ground/Steel types
weather: 'hail'     // Damages non-Ice types
```

### 3. Shop Tiers

Shops unlock better items as you progress:

```
Tier 1 (Starter Town, Pewter): Basic Pokeballs, Potions
Tier 2 (Cerulean): Great Balls, Super Potions
Tier 3 (Vermilion): Full Heals, Revives
Tier 4 (Celadon): Ultra Balls, Hyper Potions
Tier 5 (Fuchsia): Max Potions, Elixirs
Tier 6 (Cinnabar): Full Restores
Tier 7 (Viridian): Rare items
Tier 8 (Pokemon League): Ultimate items
```

### 4. NPC Actions

NPCs can have one-time actions:

```typescript
action: {
    type: 'giveitem',
    itemId: 'potion',
    quantity: 5,
    onceOnly: true                      // Only triggers once
}
```

### 5. Double Battles

Some encounter zones support double battles:

```typescript
battleType: 'double'                    // Player uses 2 Pokemon simultaneously
```

### 6. Shiny Pokemon

Events can spawn guaranteed shiny Pokemon:

```typescript
pokemon: {
    species: 'gyarados',
    level: 30,
    shiny: true                         // Red Gyarados event
}
```

### 7. Move Learning System

Pokemon learn moves by:
- **Level-up**: Defined in `MANUAL_LEARNSETS.ts`
- **TM/HM**: Items that teach moves
- **Egg Moves**: Special tutor items
- **Move Reminder**: NPC that reteaches moves

### 8. Evolution System

Pokemon evolve based on:
- **Level**: Most common method
- **Item**: Evolution stones
- **Trade**: Special evolution items
- **Friendship**: High friendship level

Defined in `MANUAL_EVOLUTIONS.ts`

### 9. PC Storage System

Players can:
- Store unlimited Pokemon in PC
- Withdraw Pokemon to party (max 6)
- Organize and manage collection
- Access PC at any Pokemon Center

### 10. Experience & Leveling

- Defeating wild Pokemon grants experience
- Defeating trainers grants more experience
- Experience formula considers level differences
- Stats recalculated on level-up
- Move learning prompts at specific levels

---

## Command Reference

### Player Commands

**Getting Started**:
- `/rpg start` - Begin your journey
- `/rpg choosetype <fire/water/grass>` - Select starter type
- `/rpg choosestarter <pokemon>` - Choose your starter

**Navigation**:
- `/rpg menu` - Main menu
- `/rpg explore` - View current location
- `/rpg travel <location>` - Move to connected location

**Battle**:
- `/rpg battle` - Start wild battle
- `/rpg trainer <trainerid>` - Challenge trainer
- `/rpg challenge <gymleader>` - Challenge gym leader
- `/rpg move <1-4>` - Use move in battle
- `/rpg switch <pokemonid>` - Switch Pokemon
- `/rpg catch` - Throw Pokeball
- `/rpg run` - Attempt to flee

**Party Management**:
- `/rpg party` - View your party
- `/rpg pokemon <pokemonid>` - View Pokemon details
- `/rpg pc` - Access PC storage
- `/rpg deposit <pokemonid>` - Store Pokemon
- `/rpg withdraw <pokemonid>` - Retrieve Pokemon

**Items**:
- `/rpg items` - View inventory
- `/rpg use <item> <pokemonid>` - Use item on Pokemon
- `/rpg shop` - View shop inventory
- `/rpg buy <item> <quantity>` - Purchase items
- `/rpg sell <item> <quantity>` - Sell items

**Information**:
- `/rpg profile` - View trainer profile
- `/rpg badges` - View badge collection
- `/rpg pokedex` - View caught Pokemon

**Utility**:
- `/rpg heal` - Heal party at Pokemon Center
- `/rpg save` - Export save data
- `/rpg load <savedata>` - Import save data

---

## Implementation Checklist

When creating a Pokemon Crystal-style story, ensure you have:

- [ ] **Locations**: 15+ locations with proper connections
- [ ] **Badges**: 8 gym leaders with themed teams
- [ ] **Routes**: Multiple routes between cities
- [ ] **Encounter Zones**: Diverse wild Pokemon for each area
- [ ] **Trainers**: 20+ regular trainers across routes
- [ ] **Rival**: 3-5 rival battles throughout journey
- [ ] **Elite Four**: 4 Elite Four members
- [ ] **Champion**: Final boss battle
- [ ] **NPCs**: Helper NPCs with tips and items
- [ ] **Story Flags**: Progression tracking system
- [ ] **Scripted Events**: Special encounters and cutscenes
- [ ] **Badge Gates**: Proper location gating
- [ ] **Pokemon Centers**: Healing locations in each major city
- [ ] **Shops**: Tiered shop system
- [ ] **Legendary Pokemon**: Special encounters for post-game
- [ ] **Victory Road**: Challenging final dungeon
- [ ] **Level Curve**: Proper difficulty scaling (Level 5 → 65)

---

## Testing Your Story

### Test Cases

1. **Start to Finish**: Complete playthrough from starter to champion
2. **Badge Gates**: Verify locations properly locked/unlocked
3. **Trainer Battles**: Test all trainer dialogue and teams
4. **Wild Encounters**: Verify Pokemon appear at correct levels
5. **Story Flags**: Ensure events trigger correctly
6. **Item Economy**: Balance shop prices and rewards
7. **Level Curve**: Ensure smooth difficulty progression
8. **Edge Cases**: Test party full, no money, all Pokemon fainted

### Debugging Commands

Use these to test specific features:
- `/rpg debug setflag <flagname>` - Set story flag
- `/rpg debug addbadge <badgename>` - Add badge
- `/rpg debug givemoney <amount>` - Add money
- `/rpg debug setlevel <pokemonid> <level>` - Set Pokemon level

---

## Conclusion

This RPG system provides a complete framework for implementing a Pokemon Crystal-inspired story. The modular architecture allows for:

- **Easy expansion**: Add new locations, trainers, and events
- **Customization**: Modify dialogue, teams, and rewards
- **Story branching**: Use flags for multiple story paths
- **Rich gameplay**: Wild battles, trainer battles, gym challenges, and Elite Four

The system handles all the technical details (battle mechanics, stat calculations, move effects, abilities) while allowing creators to focus on story design and content creation.

For questions or issues, consult the individual file comments or the broader repository documentation.

---

**Document Version**: 1.0  
**Last Updated**: Based on current rpg-wip implementation  
**Files Referenced**: All files in `/impulse/chat-plugins/rpg-wip/`
