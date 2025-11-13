# RPG Handler Usage Examples

This file provides practical examples of how to use the various NPC action and scripted event handlers in your RPG game.

## Table of Contents
- [Quest Handlers](#quest-handlers)
- [Story Handlers](#story-handlers)
- [NPC Interaction Handlers](#npc-interaction-handlers)
- [Progression Handlers](#progression-handlers)

---

## Quest Handlers

### Collection Quest

Have NPCs request specific items from the player:

```typescript
// In npcs.ts
{
  id: 'berry_collector',
  name: 'Berry Collector',
  location: 'startertown_house1',
  dialogue: "I need berries for my research! Can you bring me some?",
  action: {
    type: 'collectionquest',
    requiredItems: [
      { itemId: 'oranberry', quantity: 5 },
      { itemId: 'sitrusberry', quantity: 3 },
    ],
    questReward: {
      money: 5000,
      items: [{ itemId: 'rarecandy', quantity: 1 }],
    },
    onceOnly: true,
  },
}
```

### Delivery Quest

Create delivery missions between NPCs:

```typescript
// NPC who gives the delivery
{
  id: 'sender_npc',
  name: 'Package Sender',
  location: 'startertown_house1',
  dialogue: "Can you deliver this package to my friend in Pewter City?",
  action: {
    type: 'deliveryquest',
    deliveryItem: { itemId: 'mail', quantity: 1 },
    targetNpcId: 'receiver_npc',
    onceOnly: true,
  },
}

// NPC who receives the delivery
{
  id: 'receiver_npc',
  name: 'Package Receiver',
  location: 'pewtercity_house1',
  dialogue: "Did you bring a package for me?",
  action: {
    type: 'deliveryquest',
    deliveryItem: { itemId: 'mail', quantity: 1 },
    targetNpcId: 'receiver_npc', // Same as own ID for receiver
    questReward: { money: 2000 },
  },
}
```

### Escort Quest

Escort an NPC to a specific location:

```typescript
{
  id: 'scared_traveler',
  name: 'Scared Traveler',
  location: 'route1',
  dialogue: "I'm too scared to travel alone. Can you escort me to Pewter City?",
  action: {
    type: 'escortquest',
    escortDestination: 'pewtercity',
    questReward: { money: 3000 },
    onceOnly: true,
  },
}
```

---

## Story Handlers

### Flashback Event

Show a flashback revealing backstory:

```typescript
// In locations.ts scriptedEvents
{
  id: 'team_rocket_flashback',
  name: 'Giovanni\'s Past',
  triggerOnce: true,
  requiredFlag: 'met_giovanni',
  type: 'flashback',
  flashbackText: "Years ago, Giovanni was once a noble gym leader...",
  flashbackCharacters: ['Giovanni', 'Young Oak'],
  dialogue: 'You recall a story about Giovanni\'s past...',
}
```

### Branching Path Event

Create story branches based on player choice:

```typescript
{
  id: 'choose_starter_path',
  name: 'Rival\'s Challenge',
  triggerOnce: true,
  type: 'branchingpath',
  dialogue: 'Your rival challenges you to choose your path!',
  pathOptions: [
    {
      name: 'Path of Power',
      description: 'Focus on becoming the strongest trainer',
      pathFlag: 'power_path_chosen',
    },
    {
      name: 'Path of Friendship',
      description: 'Focus on bonding with Pokemon',
      pathFlag: 'friendship_path_chosen',
    },
  ],
  exclusivePaths: true, // Can only choose one
}
```

### Moral Choice Event

Track player karma/alignment:

```typescript
{
  id: 'help_injured_pokemon',
  name: 'Injured Pokemon',
  triggerOnce: true,
  type: 'moralchoice',
  dialogue: 'You find an injured Pokemon. What do you do?',
  moralChoices: [
    {
      text: 'Help the Pokemon (costs 500₽)',
      karmaChange: 10,
      resultFlag: 'helped_injured_pokemon',
      resultText: 'The Pokemon recovers! You feel good about helping.',
    },
    {
      text: 'Ignore it and move on',
      karmaChange: -5,
      resultFlag: 'ignored_injured_pokemon',
      resultText: 'You continue on your journey...',
    },
  ],
}
```

### Chapter Transition

Mark major story milestones:

```typescript
{
  id: 'chapter_2_start',
  name: 'The Journey Continues',
  triggerOnce: true,
  requiredBadgeCount: 3,
  type: 'chaptertransition',
  chapterNumber: 2,
  chapterTitle: 'The Rising Storm',
  dialogue: 'Your journey takes a darker turn...',
}
```

### Memory Restoration

Reveal plot through regained memories:

```typescript
{
  id: 'restore_memory_1',
  name: 'Forgotten Past',
  triggerOnce: true,
  type: 'memoryrestoration',
  memoryText: 'You suddenly remember... you were here before, years ago.',
  dialogue: 'A strange sensation washes over you...',
}
```

---

## NPC Interaction Handlers

### Conditional Dialogue

NPCs respond differently based on progress:

```typescript
{
  id: 'professor_oak',
  name: 'Professor Oak',
  location: 'startertown_lab',
  action: {
    type: 'conditionaldialogue',
    dialogueConditions: [
      {
        minBadges: 8,
        dialogue: "You've collected all 8 badges! I'm so proud of you!",
      },
      {
        minBadges: 4,
        maxBadges: 7,
        dialogue: "You're making great progress! Keep up the good work!",
      },
      {
        maxBadges: 3,
        dialogue: "How's your journey going? Remember to train hard!",
      },
      {
        requiredFlag: 'defeated_champion',
        dialogue: "Champion! You've made history!",
      },
    ],
    defaultDialogue: "Hello! Welcome to the world of Pokemon!",
  },
}
```

### Time-Based Actions

NPCs available at specific times:

```typescript
{
  id: 'night_shop_keeper',
  name: 'Night Shop Keeper',
  location: 'celadoncity_shop',
  dialogue: "Welcome to the Night Market!",
  action: {
    type: 'timebasedaction',
    availableHours: [20, 21, 22, 23, 0, 1, 2, 3, 4], // 8 PM to 4 AM
    shopTier: 5,
  },
}
```

### Reputation System

Track player standing with factions:

```typescript
// NPC that checks reputation
{
  id: 'faction_guard',
  name: 'Faction Guard',
  location: 'fuchsiacity_gate',
  dialogue: "Let me check your standing with us...",
  action: {
    type: 'reputation',
    factionId: 'silph_co',
  },
}

// Event that gives reputation
// In locations.ts
{
  id: 'help_silph_co',
  name: 'Silph Co Rescue',
  triggerOnce: true,
  type: 'reputationchange',
  factionId: 'silph_co',
  reputationChange: 50,
  dialogue: 'Silph Co thanks you for your help!',
}
```

### Achievement System

Track special accomplishments:

```typescript
{
  id: 'achievement_npc',
  name: 'Achievement Tracker',
  location: 'pokemonleague_hall',
  dialogue: "Let me check your achievements!",
  action: {
    type: 'achievement',
    achievements: {
      'catch_100_pokemon': {
        name: 'Pokemon Master',
        requiredFlag: 'caught_100_pokemon',
        reward: { itemId: 'masterball', quantity: 1 },
      },
      'win_50_battles': {
        name: 'Battle Legend',
        requiredFlag: 'won_50_battles',
        reward: { money: 50000 },
      },
    },
  },
}
```

---

## Progression Handlers

### Companion System

NPCs that join/leave the party:

```typescript
// Companion joins
{
  id: 'companion_joins',
  name: 'New Ally',
  triggerOnce: true,
  requiredBadgeCount: 2,
  type: 'companionjoin',
  companionId: 'rival',
  dialogue: 'I\'ll join you on your journey!',
}

// Companion leaves
{
  id: 'companion_leaves',
  name: 'Parting Ways',
  triggerOnce: true,
  requiredBadgeCount: 5,
  type: 'companionleave',
  companionId: 'rival',
  dialogue: 'I need to go my own way now. Thanks for everything!',
}
```

### Lore Discovery

Build world lore through discoveries:

```typescript
{
  id: 'ancient_tablet',
  name: 'Ancient Tablet',
  triggerOnce: true,
  type: 'lorediscovery',
  loreTitle: 'The Legend of Mew',
  loreText: 'Long ago, a powerful Pokemon known as Mew...',
  dialogue: 'You discover an ancient tablet with strange writing.',
}
```

### Collectible Items

Special items to find and collect:

```typescript
{
  id: 'find_rare_coin',
  name: 'Rare Coin',
  triggerOnce: true,
  type: 'collectibleitem',
  collectibleId: 'ancient_coin',
  collectibleCategory: 'rare_coins',
  dialogue: 'You found a rare ancient coin!',
  setFlag: 'found_ancient_coin_1',
}
```

### Voice From Above

Mysterious guidance system:

```typescript
{
  id: 'mysterious_voice',
  name: 'Guidance',
  triggerOnce: true,
  requiredBadgeCount: 6,
  type: 'voicefromabove',
  voiceText: 'A great challenge awaits you in the volcano. Prepare yourself.',
  dialogue: 'A mysterious voice echoes in your mind...',
}
```

### Dream Sequence

Foreshadowing through dreams:

```typescript
{
  id: 'prophetic_dream',
  name: 'Strange Dream',
  triggerOnce: true,
  type: 'dreamsequence',
  dreamText: 'You see a shadowy figure standing atop a mountain...',
  isNightmare: false,
  dialogue: 'That night, you have a strange dream...',
}
```

---

## Advanced Examples

### Multi-Stage Quest Chain

```typescript
// In npcs.ts
{
  id: 'quest_giver',
  name: 'Quest Master',
  location: 'celadoncity_house',
  dialogue: "I have a multi-stage quest for you!",
  action: {
    type: 'questchain',
    questId: 'legendary_search',
    questStages: [
      {
        description: 'Find the first clue in Pewter Museum',
        requiredFlag: 'found_clue_1',
      },
      {
        description: 'Decode the ancient text',
        requiredFlag: 'decoded_text',
      },
      {
        description: 'Battle the guardian',
        requiredFlag: 'defeated_guardian',
      },
    ],
  },
}
```

### Complex Story Path

Combine multiple handlers for rich storytelling:

```typescript
// In locations.ts
{
  id: 'story_arc_finale',
  name: 'The Final Confrontation',
  triggerOnce: true,
  requiredBadgeCount: 8,
  requiredFlag: 'completed_all_quests',
  type: 'cutscene',
  cutsceneScript: [
    'The sky darkens...',
    'A portal opens above the Pokemon League...',
    'The legendary Pokemon Mewtwo appears!',
  ],
  setFlag: 'mewtwo_appeared',
  dialogue: 'This is the moment you\'ve been training for!',
}
```

---

## Tips for Using Handlers

1. **Use Flags Wisely**: Flags track player progress. Name them descriptively like `defeated_gym_brock` or `saved_silph_co`.

2. **Chain Events**: Use `setFlag` in one event and `requiredFlag` in another to create sequences.

3. **Balance Rewards**: Make sure quest rewards are appropriate for the effort required.

4. **Test Conditions**: Always test your conditions (badge counts, flags) to ensure events trigger correctly.

5. **Provide Feedback**: Use clear dialogue to tell players what happened and what to do next.

6. **Consider Replayability**: Use `triggerOnce: false` for repeatable events and quests.

7. **Build World Lore**: Use flashbacks, dreams, and lore discoveries to create a rich world.

8. **Track Moral Choices**: Use karma system to influence how NPCs react to the player.

9. **Create Branching Stories**: Let player choices matter with branching paths.

10. **Reward Exploration**: Hide collectibles and lore in off-the-beaten-path locations.

---

## Handler Reference Quick Guide

### Quest Types
- `collectionquest` - Collect items
- `deliveryquest` - Deliver items  
- `escortquest` - Escort NPCs
- `questchain` - Multi-stage quests

### Story Types
- `flashback` - Show past events
- `dreamsequence` - Dreams and nightmares
- `branchingpath` - Story branches
- `moralchoice` - Karma-affecting choices
- `chaptertransition` - Chapter markers
- `epilogue` - Story endings

### Progression Types
- `reputation` - Faction standing
- `reputationchange` - Modify reputation
- `companionjoin/leave` - Party companions
- `achievement` - Track accomplishments
- `collectibleitem` - Special collectibles
- `lorediscovery` - World lore

### Utility Types
- `conditionaldialogue` - Dynamic NPC dialogue
- `timebasedaction` - Time-restricted actions
- `voicefromabove` - Mysterious guidance
- `memoryrestoration` - Plot reveals

---

For more information, see:
- `README.md` - Full architecture guide
- `npc-actions.ts` - All NPC action handlers
- `scripted-events.ts` - All event handlers
- `locations.ts` - Location data structure
- `npcs.ts` - NPC data structure
