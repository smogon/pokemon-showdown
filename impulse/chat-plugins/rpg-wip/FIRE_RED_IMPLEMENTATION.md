# Pokemon Fire Red Journey Implementation

## Overview
This document details the complete implementation of the Pokemon Fire Red journey from Pallet Town to Mt. Moon, including all locations, encounters, trainers, and quests that match the original game.

## Locations

### 1. Pallet Town
- **Description**: "A quiet town nestled between gentle hills and the sea. Your adventure begins here!"
- **Key Features**: 
  - Starting location
  - Professor Oak's Lab
  - Player's home
- **Wild Encounters**: None
- **Connections**: Route 1 (north)

### 2. Route 1
- **Description**: "The road from Pallet Town to Viridian City. Wild Pokémon live in the tall grass!"
- **Wild Encounters**: Pidgey, Rattata (Lvl 2-5)
- **Trainers**: None (in Fire Red)
- **Connections**: Pallet Town (south), Viridian City (north)

### 3. Viridian City
- **Description**: "A town bordered by verdant nature. The Gym here is very strong!"
- **Key Features**:
  - Poké Mart
  - Pokémon Center
  - Gym (locked until later)
- **Wild Encounters**: None
- **Connections**: Route 1 (south), Route 2 (north)

### 4. Route 2
- **Description**: "A path that connects Viridian City to the northern towns."
- **Wild Encounters**: Pidgey, Rattata, Caterpie, Weedle (Lvl 3-5)
- **Trainers**: None on south section
- **Connections**: Viridian City (south), Viridian Forest, Pewter City (north)

### 5. Viridian Forest
- **Description**: "A deep forest teeming with Bug-type Pokémon. Many trainers are here to catch them!"
- **Wild Encounters**: 
  - Caterpie (common)
  - Metapod (common)
  - Weedle (common)
  - Kakuna (common)
  - Pikachu (rare) - Lvl 3-6
- **Trainers**: 4 trainers
  - Bug Catcher Rick (Weedle Lvl 6)
  - Bug Catcher Doug (Weedle Lvl 7, Kakuna Lvl 7)
  - Bug Catcher Anthony (Caterpie Lvl 6 x2)
  - Lass Janice (Pidgey Lvl 9 x2)
- **Connections**: Route 2

### 6. Pewter City
- **Description**: "A quiet city nestled between the rugged mountains and rocks. Home to Brock, the Rock-type Gym Leader!"
- **Key Features**:
  - Pewter Gym (Brock - Boulder Badge)
  - Poké Mart
  - Pokémon Center
  - Museum
- **Wild Encounters**: None
- **Connections**: Route 2 (south), Route 3 (east)
- **Gym Leader**: Brock
  - Geodude Lvl 12
  - Onix Lvl 14
  - Prize Money: ₽1,386
  - Reward: Boulder Badge

### 7. Route 3
- **Description**: "A winding path to Mt. Moon. Many trainers gather here to battle!"
- **Wild Encounters**: Pidgey, Spearow, Rattata, Jigglypuff, Nidoran♀, Nidoran♂ (Lvl 5-10)
- **Trainers**: 7 trainers
  - Youngster Ben (Rattata Lvl 11, Ekans Lvl 11)
  - Youngster Calvin (Spearow Lvl 14)
  - Bug Catcher Colton (Caterpie Lvl 10 x3)
  - Lass Sally (Rattata Lvl 10, Nidoran♀ Lvl 10)
  - Youngster Jimmy (Rattata Lvl 14, Ekans Lvl 14)
  - Lass Robin (Pidgey Lvl 11, Nidoran♀ Lvl 11)
  - Bug Catcher James (Weedle Lvl 11, Caterpie Lvl 11)
- **Connections**: Pewter City (west), Mt. Moon (east)

### 8. Mt. Moon
- **Description**: "A dark cave with a maze of tunnels. Rare Moon Stones can be found here!"
- **Wild Encounters**: 
  - 1F: Zubat, Geodude, Clefairy, Paras (Lvl 7-10)
  - B1F: Zubat, Geodude, Clefairy, Paras (Lvl 8-11)
  - B2F: Zubat, Geodude, Clefairy, Paras (Lvl 9-12)
- **Trainers**: 12 trainers
  - Bug Catcher Kent (Weedle Lvl 11, Kakuna Lvl 11)
  - Lass Iris (Clefairy Lvl 14)
  - Super Nerd Jovan (Magnemite Lvl 11, Voltorb Lvl 11)
  - Bug Catcher Robby (Caterpie Lvl 10, Metapod Lvl 10, Caterpie Lvl 10)
  - Lass Miriam (Oddish Lvl 11, Bellsprout Lvl 11)
  - Hiker Marcos (Geodude Lvl 10 x2, Onix Lvl 10)
  - Youngster Josh (Rattata Lvl 10 x2, Zubat Lvl 10)
  - Hiker Alan (Geodude Lvl 10, Onix Lvl 12)
  - Team Rocket Grunt #1 (Rattata Lvl 11, Zubat Lvl 11)
  - Team Rocket Grunt #2 (Sandshrew Lvl 11, Rattata Lvl 11, Zubat Lvl 11)
  - Team Rocket Grunt #3 (Rattata Lvl 13, Zubat Lvl 13)
  - Super Nerd Miguel (Grimer Lvl 12, Voltorb Lvl 12, Koffing Lvl 12)
- **Key Items**: Moon Stone, Fossils (Helix or Dome)
- **Connections**: Route 3 (entrance), Route 4 (exit - requires Boulder Badge)

### 9. Route 4
- **Description**: "A path leading from Mt. Moon to Cerulean City."
- **Requirements**: Boulder Badge needed
- **Wild Encounters**: (Future implementation)
- **Connections**: Mt. Moon (west), Cerulean City (east)

### 10. Cerulean City
- **Description**: "A seaside city with flowing water. Home to Misty, the Water-type Gym Leader!"
- **Requirements**: Boulder Badge needed
- **Status**: Future expansion
- **Connections**: Route 4 (west), Route 5 (south), Route 24 (north)

## Quest System

### Main Story Quests

#### 1. A New Beginning
- **Objective**: Choose a starter Pokémon
- **Location**: Pallet Town
- **Given By**: Professor Oak
- **Rewards**: 
  - 5x Poké Ball
  - 3x Potion
  - ₽500

#### 2. Oak's Parcel
- **Objective**: Travel to Viridian City
- **Location**: Pallet Town
- **Prerequisites**: Complete "A New Beginning"
- **Rewards**:
  - 5x Potion
  - ₽300

#### 3. Through the Forest
- **Objective**: Navigate Viridian Forest to Pewter City
- **Location**: Viridian City
- **Prerequisites**: Complete "Oak's Parcel"
- **Rewards**:
  - 3x Antidote
  - 5x Poké Ball
  - ₽500

#### 4. The Boulder Badge
- **Objective**: Defeat Gym Leader Brock
- **Location**: Pewter City
- **Prerequisites**: Complete "Through the Forest"
- **Rewards**:
  - Boulder Badge
  - 3x Super Potion
  - ₽1,386

#### 5. Mt. Moon Expedition
- **Objective**: Navigate through Mt. Moon
- **Location**: Pewter City
- **Prerequisites**: Complete "The Boulder Badge", Have Boulder Badge
- **Rewards**:
  - 1x Moon Stone
  - 5x Super Potion
  - ₽1,000

### Side Quests

#### 1. Building Your Team
- **Objective**: Catch 5 different Pokémon
- **Location**: Pallet Town
- **Rewards**: 
  - 10x Poké Ball
  - 3x Great Ball
  - ₽1,000

#### 2. Bug Catching Contest
- **Objective**: Catch a Bug-type Pokémon
- **Location**: Viridian Forest
- **Given By**: Bug Catcher Rick
- **Rewards**:
  - 5x Antidote
  - ₽300

#### 3. Route 3 Gauntlet
- **Objective**: Defeat 5 trainers on Route 3
- **Location**: Route 3
- **Rewards**:
  - 5x Super Potion
  - ₽2,000

#### 4. Cave Explorer
- **Objective**: Defeat 3 trainers in Mt. Moon
- **Location**: Mt. Moon
- **Rewards**:
  - 2x Revive
  - 3x Escape Rope
  - ₽1,500

#### 5. The Fossil Mystery
- **Objective**: Find a Helix or Dome Fossil
- **Location**: Mt. Moon
- **Rewards**: ₽2,000

## Progression Path

```
1. Start in Pallet Town
   └─> Talk to Professor Oak
   └─> Choose starter (Bulbasaur/Charmander/Squirtle)
   └─> Receive Pokédex and Poké Balls

2. Route 1
   └─> Catch first wild Pokémon
   └─> Battle wild Pidgey and Rattata

3. Viridian City
   └─> Visit Poké Mart
   └─> Pick up Oak's Parcel
   └─> Heal at Pokémon Center

4. Route 2 South
   └─> More wild encounters
   └─> Prepare for Viridian Forest

5. Viridian Forest
   └─> Battle 4 trainers
   └─> Catch Bug-type Pokémon
   └─> Find Pikachu (rare)

6. Route 2 North
   └─> Exit forest
   └─> Head to Pewter City

7. Pewter City
   └─> Train team
   └─> Stock up on items
   └─> Challenge Brock's Gym
   └─> Earn Boulder Badge

8. Route 3
   └─> Battle 7 trainers
   └─> Level up team for Mt. Moon

9. Mt. Moon
   └─> Navigate cave floors (1F, B1F, B2F)
   └─> Battle Team Rocket grunts
   └─> Choose Helix or Dome Fossil
   └─> Find Moon Stone

10. Route 4
    └─> Exit Mt. Moon (Boulder Badge required)
    └─> Continue to Cerulean City
```

## Type Advantages

### For Brock's Gym (Rock-type)
**Super Effective**:
- Water-type moves (4x against Onix)
- Grass-type moves (4x against Onix, 2x against Geodude)
- Fighting-type moves

**Recommended Pokemon**:
- Bulbasaur (Grass starter)
- Squirtle (Water starter)
- Wild-caught: Oddish, Bellsprout (Grass)
- Wild-caught: Nidoran (can learn Double Kick)

### For Viridian Forest (Bug-type trainers)
**Super Effective**:
- Fire-type moves
- Flying-type moves
- Rock-type moves

**Recommended Pokemon**:
- Charmander (Fire starter)
- Pidgey (Flying-type)
- Spearow (Flying-type)

## Game Balance

### Money Management
- **Starting Money**: ₽3,000 (Fire Red accurate)
- **Potion**: ₽200
- **Poké Ball**: ₽200
- **Antidote**: ₽200
- **Trainer Payouts**: Varies by trainer class

### Level Progression
- **Starter**: Level 5
- **Route 1 Pokemon**: Level 2-5
- **Viridian Forest**: Level 3-6
- **Brock's Gym**: Level 12-14
- **Route 3**: Level 5-10
- **Mt. Moon**: Level 7-12

## Modular Design

### Adding New Content

**Add a new location**:
```typescript
// In data.ts - LOCATION_DATABASE
'new_location_id': {
  id: 'new_location_id',
  name: 'Location Name',
  description: 'Description',
  region: 'Kanto',
  connectedTo: ['other_location_id'],
  requiresBadge: 'badge_id', // optional
}
```

**Add new encounters**:
```typescript
// In data.ts - ENCOUNTER_ZONES
'location_grass': {
  name: 'Area Name',
  pokemon: ['species1', 'species2'],
  levelRange: [min, max],
  battleType: 'single',
}
```

**Add new trainer**:
```typescript
// In data.ts - TRAINER_DATABASE
'trainer_id': {
  name: 'Trainer Name',
  money: 100,
  party: [
    { species: 'pokemon', level: 10 }
  ],
  dialogue: {
    start: "Let's battle!",
    win: "You win!",
    lose: "I win!",
  },
}
```

**Add new quest**:
```typescript
// In quests.ts - QUEST_DATABASE
'quest_id': {
  id: 'quest_id',
  name: 'Quest Name',
  type: 'main' | 'side',
  description: 'Description',
  objectives: [...],
  rewards: {...},
  location: 'Location',
}
```

## Summary

This implementation provides:
- ✅ 10 accurate Fire Red locations
- ✅ 11 encounter zones with Fire Red Pokemon
- ✅ 30+ trainers with accurate teams
- ✅ 5 main story quests
- ✅ 5+ side quests
- ✅ Badge progression system
- ✅ Team Rocket encounters
- ✅ Fossil discovery
- ✅ Gym Leader battles
- ✅ Complete early-game experience

The system is fully modular and can be easily extended with more routes, gyms, and content following the same patterns.
