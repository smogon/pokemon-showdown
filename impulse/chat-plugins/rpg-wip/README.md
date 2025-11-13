# RPG System Architecture

This directory contains the RPG game mode implementation for Pokemon Showdown.

## File Organization

### Data Files (Primary Configuration)
These are the main files you'll edit to add new content:

- **`locations.ts`** - Define all game locations, buildings, encounter zones, and location-based scripted events
- **`npcs.ts`** - Define all NPCs, their dialogues, and actions
- **`story-events.ts`** - Define story events triggered by badges, trainers, or locations
- **`trainers.ts`** - Define trainer battles and their Pokemon teams
- **`items.ts`** - Define items, their effects, and prices

### Handler Files (Implementation)
These files implement the game logic and should rarely need modification:

- **`npc-actions.ts`** - Implements 40+ NPC action handlers (heal, give items, quests, etc.)
- **`scripted-events.ts`** - Implements 60+ scripted event handlers (cutscenes, battles, puzzles, etc.)
- **`handlers.ts`** - Central export file for all handlers (convenience import)

### Core System Files
- **`commands.ts`** - Command handlers for user input
- **`core.ts`** - Player data management, Pokemon creation
- **`battle-engine.ts`** - Battle system implementation
- **`battle-core.ts`**, **`battle-flow.ts`**, **`battle-moves.ts`** - Battle subsystems
- **`interface.ts`** - TypeScript type definitions
- **`utils.ts`** - Utility functions
- **`html.ts`** - HTML generation for UI

## Adding New Content

### Adding a New Location

Edit `locations.ts`:

```typescript
export const LOCATIONS: Record<string, Location> = {
  'mynewlocation': {
    id: 'mynewlocation',
    name: 'My New Location',
    type: 'town',
    description: 'A beautiful new place to explore.',
    connectedLocations: [
      { id: 'existinglocation', name: 'Existing Location' },
    ],
    buildings: [
      {
        id: 'mynewlocation_pokecenter',
        name: 'Pokemon Center',
        type: 'pokecenter',
        description: 'Heal your Pokemon here.',
        npcs: ['nursejoymynewlocation'],
      },
    ],
    encounterZones: ['mynewlocation_grass'],
    scriptedEvents: [
      {
        id: 'mynewlocation_arrival',
        name: 'Welcome',
        triggerOnce: true,
        type: 'dialogue',
        dialogue: 'Welcome to My New Location!',
      },
    ],
  },
};
```

### Adding a New NPC

Edit `npcs.ts`:

```typescript
export const NPC_DATABASE: Record<string, NPCData> = {
  'mynpc': {
    id: 'mynpc',
    name: 'Friendly NPC',
    location: 'mynewlocation_pokecenter',
    dialogue: "Hello! I have something for you!",
    action: {
      type: 'giveitem',
      itemId: 'potion',
      quantity: 5,
      onceOnly: true,
    },
  },
};
```

### Adding a Scripted Event

Edit the location in `locations.ts`:

```typescript
scriptedEvents: [
  {
    id: 'special_encounter',
    name: 'Rare Pokemon',
    triggerOnce: true,
    requiredBadgeCount: 3,
    type: 'wildbattle',
    pokemon: {
      species: 'pikachu',
      level: 30,
      shiny: true,
      moves: ['thunderbolt', 'quickattack', 'irontail', 'thunderwave'],
    },
    dialogue: 'A rare shiny Pikachu appears!',
    setFlag: 'caught_shiny_pikachu',
  },
];
```

## Available NPC Action Types

See `npc-actions.ts` header for complete list. Common types:

- `heal` - Heal all Pokemon (Pokemon Centers)
- `choosestarter` - Starter Pokemon selection
- `giveitem` - Give items to player
- `givepokemon` - Give Pokemon to player
- `exchangeitems` - Trade items
- `tradepokemon` - Trade Pokemon
- `movetutor` - Teach moves for money
- `dailyreward` - Daily login rewards
- `questchain` - Multi-stage quests
- `fossilrevival` - Revive fossils
- `pokemonbreeder` - Breed Pokemon

## Available Scripted Event Types

See `scripted-events.ts` header for complete list. Common types:

- `dialogue` - Simple message
- `item` - Give items
- `pokemon` - Give Pokemon
- `wildbattle` - Wild Pokemon encounter
- `trainer` - Trainer battle
- `cutscene` - Cinematic scene
- `choice` - Player choice
- `quiz` - Quiz question
- `pokemonswarm` - Pokemon swarm
- `bossbattle` - Boss battle
- `tournament` - Tournament

## Event Conditions

Both scripted events and NPC actions support various conditions:

- `triggerOnce` - Only trigger once per player
- `requiredFlag` - Player must have this flag set
- `requiredBadgeCount` - Minimum number of badges
- `maxBadgeCount` - Maximum number of badges
- `preventIfFlag` - Skip if player has this flag
- `setFlag` - Set this flag when triggered
- `onceOnly` - Action can only be completed once

## Importing Handlers

If you need to use handlers in custom code:

```typescript
// Import all handlers as namespaces
import * as Handlers from './handlers';
const result = Handlers.NPC.handleHeal(player);
const result = Handlers.Events.handleCutscene(player, event);

// Or import specific handlers
import { handleHeal, handleChooseStarter } from './npc-actions';
import { handleCutscene, handlePokemonSwarm } from './scripted-events';
```

## Handler Implementation

All handlers follow a consistent pattern:

```typescript
export function handleActionName(
  player: PlayerData,
  action: NPCAction | ScriptedEvent,
  ...additionalParams
): { success: boolean, message: string, ...additionalData } {
  // Validate conditions
  if (!meetsConditions) {
    return { success: false, message: 'Error message' };
  }
  
  // Perform action
  // ...
  
  return {
    success: true,
    message: 'Success message',
    // Additional data specific to this handler
  };
}
```

## Adding a New Handler

If you need to add a completely new handler type:

1. Add the handler function to `npc-actions.ts` or `scripted-events.ts`
2. Export it from the file
3. Add it to the re-export list in `handlers.ts`
4. Document it in the file header
5. Wire it up in `commands.ts` if needed for user interaction

## File Dependencies

```
Data Files (locations, npcs, story-events)
    ↓
Handler Files (npc-actions, scripted-events)
    ↓
Core System (core, battle-engine, items)
    ↓
Commands (commands.ts) ← User Input
    ↓
HTML (html.ts) ← Display
```

## Best Practices

1. **Keep data in data files** - Don't hardcode locations, NPCs, or events in handler files
2. **Use handlers for logic** - All game logic should be in handler functions
3. **Set flags for progression** - Use flags to track player progress and unlock content
4. **Test conditions thoroughly** - Make sure badge counts, flags, and requirements work correctly
5. **Document new content** - Add comments explaining complex events or quests

## Testing

Test your changes by:
1. Building the project: `npm run build`
2. Starting the server: `npm start`
3. Testing in-game with `/rpg` commands
4. Checking for TypeScript errors: `npm run tsc`

## Getting Help

- Check existing locations, NPCs, and events for examples
- Read handler function comments for parameter details
- Review the interface.ts file for type definitions
- Test incrementally as you add new content
