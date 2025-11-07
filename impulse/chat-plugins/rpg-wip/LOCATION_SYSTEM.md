# Location System Documentation

## Overview

The RPG location system has been refactored to match the Pokemon games more closely, with support for:
- Towns/cities with multiple buildings (Pokemon Center, Poke Mart, Gym, Houses, etc.)
- Routes with wild Pokemon encounters
- Scripted events that trigger when entering locations
- Conditional events based on game progression

## Location Structure

### Location Types
- `town` - Small settlements with basic facilities
- `city` - Larger settlements with more buildings
- `route` - Paths connecting locations with wild Pokemon
- `special` - Unique locations (Victory Road, Pokemon League, etc.)

### Buildings

Buildings are structures within towns and cities that players can enter:

```typescript
{
  id: 'startertown_pokecenter',
  name: 'Pokemon Center',
  type: 'pokecenter', // pokecenter, pokemart, gym, house, lab, museum, department, gameCorner
  description: 'A place to heal your Pokemon and access your PC.',
  npcs: ['nursejoy_startertown'], // NPCs found in this building
  gymLeaderId: 'gymbrock', // For gyms only
  shopTier: 1, // For shops only
  accessible: true, // Can be locked
  requiredFlag: 'some_flag', // Optional: flag required to enter
}
```

## Scripted Events

Scripted events are automatic encounters/dialogues/gifts that trigger when entering a location.

### Event Types

1. **dialogue** - Display text to the player
2. **trainer** - Initiate a trainer battle
3. **item** - Give an item to the player
4. **pokemon** - Give a Pokemon to the player (gift)
5. **wildbattle** - Trigger a scripted wild Pokemon encounter

### Event Properties

```typescript
{
  id: 'route1_rival_battle',
  name: 'Rival Encounter',
  triggerOnce: true, // If true, only triggers once
  requiredFlag: 'beat_first_gym', // Only triggers if player has this flag
  requiredBadgeCount: 1, // Only triggers if player has >= 1 badge
  maxBadgeCount: 3, // Only triggers if player has <= 3 badges
  preventIfFlag: 'rival_defeated', // Won't trigger if player has this flag
  type: 'trainer',
  trainerId: 'rival1',
  dialogue: 'Let\'s battle!',
  setFlag: 'rival_defeated', // Flag to set after event
}
```

### Conditional Events

Events can be configured to trigger based on various conditions:

#### One-Time Events
```typescript
{
  id: 'welcome_message',
  triggerOnce: true, // Will only trigger once
  type: 'dialogue',
  dialogue: 'Welcome!',
}
```

#### Badge-Based Events
```typescript
{
  id: 'return_with_badge',
  triggerOnce: true,
  requiredBadgeCount: 1, // Triggers when player returns with 1+ badges
  type: 'trainer',
  trainerId: 'rival2',
}
```

#### Flag-Based Events (Chained Events)
```typescript
// Event 1: Sets a flag
{
  id: 'defeat_rival',
  triggerOnce: true,
  type: 'trainer',
  trainerId: 'rival1',
  setFlag: 'rival1_defeated',
}

// Event 2: Requires the flag from Event 1
{
  id: 'gift_after_rival',
  triggerOnce: true,
  requiredFlag: 'rival1_defeated', // Only triggers after defeating rival
  type: 'item',
  itemId: 'potion',
  itemQuantity: 5,
}
```

#### Early-Game Only Events
```typescript
{
  id: 'early_tutorial',
  triggerOnce: true,
  maxBadgeCount: 0, // Only triggers before getting first badge
  type: 'dialogue',
  dialogue: 'Here\'s a beginner tip...',
}
```

#### Repeatable Events
```typescript
{
  id: 'route_warning',
  // No triggerOnce property - will repeat every time!
  type: 'dialogue',
  dialogue: 'Be careful in this area!',
}
```

## Behavior Summary

### Event Triggering Rules

1. **triggerOnce: true** → Event happens only once, even if player re-enters
2. **No triggerOnce** (or false) → Event repeats every time player enters
3. **requiredBadgeCount** → Player must have at least this many badges
4. **maxBadgeCount** → Player must have at most this many badges
5. **requiredFlag** → Player must have this flag set
6. **preventIfFlag** → Event won't trigger if player has this flag
7. **setFlag** → Flag is set after event completes

### Multiple Events Per Location

A location can have multiple scripted events. They are checked in order, and the FIRST matching event is triggered.

Example:
```typescript
scriptedEvents: [
  {
    id: 'first_visit',
    triggerOnce: true,
    maxBadgeCount: 0,
    type: 'dialogue',
    dialogue: 'First time here!',
  },
  {
    id: 'return_later',
    triggerOnce: true,
    requiredBadgeCount: 1,
    type: 'dialogue',
    dialogue: 'You came back!',
  },
]
```

Timeline:
1. First visit (0 badges) → "First time here!" triggers
2. Return with 1 badge → "You came back!" triggers
3. Third visit → No events trigger (both are triggerOnce)

## Examples

### Example 1: Route with Progressive Events

```typescript
'route1': {
  id: 'route1',
  name: 'Route 1',
  type: 'route',
  scriptedEvents: [
    // First visit
    {
      id: 'route1_first',
      triggerOnce: true,
      maxBadgeCount: 0,
      type: 'dialogue',
      dialogue: 'Welcome to Route 1!',
    },
    // Return with 1 badge
    {
      id: 'route1_rival',
      triggerOnce: true,
      requiredBadgeCount: 1,
      type: 'trainer',
      trainerId: 'rival1',
      setFlag: 'route1_rival_defeated',
    },
    // After defeating rival
    {
      id: 'route1_gift',
      triggerOnce: true,
      requiredFlag: 'route1_rival_defeated',
      type: 'item',
      itemId: 'superpotion',
      itemQuantity: 3,
    },
  ],
}
```

### Example 2: City with Buildings

```typescript
'pewtercity': {
  id: 'pewtercity',
  name: 'Pewter City',
  type: 'city',
  buildings: [
    {
      id: 'pewtercity_pokecenter',
      name: 'Pokemon Center',
      type: 'pokecenter',
      npcs: ['nursejoy_pewter'],
    },
    {
      id: 'pewtercity_gym',
      name: 'Pewter City Gym',
      type: 'gym',
      gymLeaderId: 'gymbrock',
    },
  ],
}
```

## Commands

### Player Commands
- `/rpg explore` - View buildings and features in current location
- `/rpg building <id>` - Enter a building
- `/rpg travel` - See connected locations
- `/rpg travel <location>` - Travel to a connected location

### Event Triggering
Events trigger automatically when using `/rpg travel <location>` to enter a new location.

### Scripted Wild Pokemon Encounters

Scripted wild Pokemon encounters are special battles against specific Pokemon that appear under certain conditions. Unlike random encounters, these are guaranteed encounters with pre-determined Pokemon.

```typescript
{
  id: 'legendary_encounter',
  name: 'Legendary Bird',
  triggerOnce: true,
  requiredBadgeCount: 8,
  type: 'wildbattle',
  pokemon: {
    species: 'moltres',
    level: 50,
    moves: ['fireblast', 'airslash', 'heatwave', 'roost'],
    shiny: false, // Can be set to true for guaranteed shiny
  },
  dialogue: 'A legendary Pokemon appears!',
  setFlag: 'moltres_encountered',
}
```

**Features:**
- Specific Pokemon with custom level and moves
- Can be guaranteed shiny (shiny: true)
- Perfect for legendary encounters, special events, or story battles
- Can be caught like normal wild Pokemon

**Examples:**

#### Blocking Pokemon (like Snorlax)
```typescript
{
  id: 'snorlax_encounter',
  name: 'Sleeping Snorlax',
  triggerOnce: true,
  type: 'wildbattle',
  pokemon: {
    species: 'snorlax',
    level: 45,
    moves: ['bodyslam', 'rest', 'snore', 'amnesia'],
  },
  dialogue: 'A huge Snorlax is blocking the path!',
}
```

#### Guaranteed Shiny
```typescript
{
  id: 'red_gyarados',
  name: 'Strange Pokemon',
  triggerOnce: true,
  requiredBadgeCount: 2,
  type: 'wildbattle',
  pokemon: {
    species: 'gyarados',
    level: 30,
    shiny: true, // Guaranteed shiny!
  },
  dialogue: 'A strange red Gyarados appears!',
}
```

#### Legendary with Conditions
```typescript
{
  id: 'mewtwo_encounter',
  name: 'The Ultimate Pokemon',
  triggerOnce: true,
  requiredFlag: 'defeated_elite_four',
  type: 'wildbattle',
  pokemon: {
    species: 'mewtwo',
    level: 70,
    moves: ['psychic', 'aurasphere', 'recover', 'calmmind'],
  },
  dialogue: 'The legendary Mewtwo stands before you!',
}
```

