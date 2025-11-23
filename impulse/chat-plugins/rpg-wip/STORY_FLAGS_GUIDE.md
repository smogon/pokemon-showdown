# RPG Plugin: Story Flags & Progression Guide

## Overview

Story flags are a string-based tagging system used to track player progress, choices, and world state. They are stored in the player's save data as a `Set<string>`.

## How Flags Work

Flags are simply unique strings (e.g., `'starter_chosen'`, `'gym_1_beaten'`, `'visited_volcano'`).

- **Storage**: They are stored in `player.storyFlags`.
- **Persistence**: They are saved to the MongoDB database and persist across sessions.
- **Manipulation**: They are primarily added via `player.storyFlags.add('flag_name')` and checked via `player.storyFlags.has('flag_name')`.

## Using Flags for Blocking Movement

To restrict access to buildings or map connections based on flags, you modify the `LOCATIONS` object in `game-locations.ts`.

### 1. Blocking Building Access

You can add conditions to building objects. While the current schema in `game-locations.ts` uses `accessible: true`, you can extend this logic in your movement handling code (likely in `commands.ts` or `core.ts` where movement is processed, though not explicitly shown in the interface files, this is the pattern to implement).

**Recommended Implementation Strategy:**

Add a `requiredFlag` or `blockers` property to your location/building definitions.

```typescript
// Example: Editing game-locations.ts
'startingroom': {
    // ...
    buildings: [
        {
            id: 'gym',
            name: 'Pewter Gym',
            type: 'gym',
            // Only allow entry if 'boulder_badge' is NOT obtained (or some other logic)
            // Or typically:
            requiredFlag: 'route_1_cleared', // Custom property to check before entry
            blockMessage: ' The gym leader is out for lunch.'
        }
    ]
}
```

Then, in your movement command handler:

```typescript
// logic to handle entering a building
const building = location.buildings.find(b => b.id === targetId);
if (building.requiredFlag && !player.storyFlags.has(building.requiredFlag)) {
    return user.sendTo(room, `|uhtml|rpg-${user.id}|<div class="error">${building.blockMessage || "Locked."}</div>`);
}
```

### 2. Blocking Route Travel

Similarly, for `connectedLocations`, you can enforce flags.

```typescript
// Example: Editing game-locations.ts
connectedLocations: [
    {
        id: 'forest_entrance',
        name: 'Dark Forest',
        requiredFlag: 'flashlight_obtained', // Player needs this flag
        blockMessage: 'It is too dark to enter without a light source.'
    }
]
```

## Setting Flags via Events

Flags are typically set when a player completes an action, such as:

1.  **Talking to an NPC**:
    In `game-npcs.ts` or `scripted-events.ts`, you can define dialogue options that add a flag.

    ```typescript
    // In scripted-events.ts
    if (choice.resultFlag) {
        player.storyFlags.add(choice.resultFlag);
    }
    ```

2.  **Defeating a Trainer/Gym Leader**:
    When a battle ends (in `battle-core.ts` or `battle-flow.ts`), you can push a flag.

    ```typescript
    // Example logic in post-battle handling
    if (winner === player && opponent.isGymLeader) {
        player.storyFlags.add('badge_1_obtained');
    }
    ```

3.  **Item Interaction**:
    Picking up a key item can trigger a flag.

## Best Practices

*   **Naming Convention**: Use snake_case for flags (e.g., `defeated_brock`, `has_delivered_parcel`).
*   **Granularity**: Use specific flags for specific steps (e.g., `quest_start`, `quest_step_1`, `quest_complete`) rather than reusing generic ones.
*   **cleanup**: If a flag is temporary, remember to `delete` it when it's no longer needed, though most story flags are permanent.

## Example Workflow: The "Gatekeeper"

1.  **Define the Flag**: decide on `gate_pass_obtained`.
2.  **Restrict the Location**:
    In `game-locations.ts`, add the requirement to the destination.
    ```typescript
    { id: 'city_gate', name: 'High City', requiredFlag: 'gate_pass_obtained' }
    ```
3.  **Create the Giver NPC**:
    In `game-npcs.ts`, create a guard who checks the flag.
    If `!has('gate_pass_obtained')`, they say "You shall not pass!".
    Create a Quest Giver who gives the item/flag.
    ```typescript
    // NPC dialogue result
    player.storyFlags.add('gate_pass_obtained');
    ```
4.  **Verify**:
    Player tries to enter -> Blocked.
    Player talks to Quest Giver -> Flag added.
    Player tries to enter -> Allowed.
