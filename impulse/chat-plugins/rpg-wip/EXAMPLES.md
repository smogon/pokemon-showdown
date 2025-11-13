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

### Battle Types
- `battlegauntlet` - Consecutive battle series
- `battlearena` - Repeatable ranked battles
- `trainingbattle` - Practice battles
- `battlechallenge` - Special condition battles
- `survivalbattle` - Win streak system
- `rematchtracker` - Trainer rematches
- `hordebattle` - Multiple Pokemon at once
- `inversebattle` - Reversed type effectiveness
- `raidbattle` - Cooperative battles
- `championdefense` - Title defense battles
- `warbattle` - Multi-wave large battles

---

## Battle Handler Examples

### Battle Gauntlet

Create a series of consecutive battles:

```typescript
// In npcs.ts
{
  id: 'gauntlet_master',
  name: 'Gauntlet Master',
  location: 'pokemonleague_hall',
  dialogue: "Face five trainers in a row without healing!",
  action: {
    type: 'battlegauntlet',
    gauntletTrainers: ['trainer1', 'trainer2', 'trainer3', 'trainer4', 'trainer5'],
  },
}
```

### Battle Arena

Repeatable battles with ranking system:

```typescript
{
  id: 'arena_champion',
  name: 'Arena Champion',
  location: 'battlearena',
  dialogue: "Welcome to the Battle Arena!",
  action: {
    type: 'battlearena',
    arenaOpponents: [
      'novice_trainer',
      'skilled_trainer',
      'veteran_trainer',
      'expert_trainer',
      'master_trainer',
      'champion_trainer',
    ],
  },
}
```

### Survival Battle

Win streak challenge:

```typescript
{
  id: 'survival_host',
  name: 'Survival Challenge Host',
  location: 'battlefrontier',
  dialogue: "How long can you survive?",
  action: {
    type: 'survivalbattle',
    survivalOpponents: [
      'weak_trainer',
      'medium_trainer',
      'strong_trainer',
      'very_strong_trainer',
      'ultimate_trainer',
    ],
  },
}
```

### Training Battle

Practice battles for story:

```typescript
{
  id: 'training_coach',
  name: 'Battle Coach',
  location: 'startertown_gym',
  dialogue: "Let's practice! You can battle me up to 10 times.",
  action: {
    type: 'trainingbattle',
    trainerId: 'coach_team',
    maxAttempts: 10,
  },
}
```

### Battle Challenge

Special condition battles:

```typescript
{
  id: 'challenge_master',
  name: 'Challenge Master',
  location: 'celadoncity_dojo',
  dialogue: "Can you win under these special rules?",
  action: {
    type: 'battlechallenge',
    trainerId: 'challenge_opponent',
    challengeRules: ['no_items', 'level_cap', 'monotype'],
    levelCap: 50,
  },
}
```

### Rematch Tracker

Scaling difficulty rematches:

```typescript
{
  id: 'rival_rematch',
  name: 'Rival',
  location: 'pokemonleague',
  dialogue: "Want to battle again? I've gotten stronger!",
  action: {
    type: 'rematchtracker',
    trainerId: 'rival_advanced',
    baseLevel: 50,
    levelIncrease: 5,
    maxRematches: 10,
  },
}
```

### Horde Battle Event

Face multiple Pokemon at once:

```typescript
// In locations.ts
{
  id: 'route_horde',
  name: 'Pokemon Horde',
  triggerOnce: false,
  type: 'hordebattle',
  hordeSpecies: ['zubat', 'zubat', 'zubat', 'zubat', 'zubat'],
  hordeSize: 5,
  dialogue: 'A horde of Zubat swarms you!',
}
```

### Raid Battle Event

Cooperative boss battle:

```typescript
{
  id: 'legendary_raid',
  name: 'Legendary Raid',
  triggerOnce: true,
  requiredBadgeCount: 8,
  type: 'raidbattle',
  raidBoss: {
    species: 'mewtwo',
    level: 70,
    moves: ['psychic', 'aurasphere', 'recover', 'calmmind'],
  },
  raidLevel: 5,
  maxPlayers: 4,
  dialogue: 'A legendary raid has appeared!',
}
```

### Inverse Battle

Type effectiveness reversed:

```typescript
{
  id: 'inverse_battle_event',
  name: 'Distorted Battle',
  triggerOnce: true,
  type: 'inversebattle',
  trainerId: 'inverse_specialist',
  dialogue: 'The battlefield warps! Everything is backwards!',
}
```

### War Battle

Multi-wave epic battle:

```typescript
{
  id: 'team_rocket_invasion',
  name: 'Team Rocket Invasion',
  triggerOnce: true,
  type: 'warbattle',
  warWaves: [
    { trainers: ['grunt1', 'grunt2'] },
    { trainers: ['grunt3', 'grunt4', 'grunt5'] },
    { trainers: ['admin1', 'admin2'] },
    { trainers: ['boss'] },
  ],
  dialogue: 'Team Rocket is invading! Defend the city!',
  setFlag: 'defended_city',
}
```

### Champion Defense

Defend your title:

```typescript
{
  id: 'champion_challengers',
  name: 'Title Defense',
  type: 'championdefense',
  requiredFlag: 'became_champion',
  challengers: [
    'challenger1',
    'challenger2',
    'challenger3',
    'elite_challenger',
    'legendary_challenger',
  ],
  dialogue: 'A challenger approaches to take your title!',
}
```

### Battle Test

Trial with special conditions:

```typescript
{
  id: 'skill_test',
  name: 'Battle Mastery Test',
  triggerOnce: true,
  type: 'battletest',
  testType: 'speed',
  testRequirements: ['Win in 5 turns or less'],
  dialogue: 'Prove your battle mastery!',
  setFlag: 'passed_battle_test',
}
```

### Sky Battle

Flying-type only:

```typescript
{
  id: 'sky_trainer_battle',
  name: 'Sky Battle',
  triggerOnce: false,
  type: 'skybattle',
  trainerId: 'sky_trainer',
  dialogue: 'Take to the skies! Flying-types only!',
}
```

### Triple Battle

3v3 simultaneous:

```typescript
{
  id: 'triple_challenge',
  name: 'Triple Battle',
  type: 'triplebattle',
  trainerId: 'triple_trainer',
  dialogue: 'A triple battle! Three Pokemon at once!',
}
```

### Battle Royale

Four-way free-for-all:

```typescript
{
  id: 'royale_event',
  name: 'Battle Royale',
  type: 'battleroyale',
  opponentIds: ['trainer1', 'trainer2', 'trainer3'],
  dialogue: 'Four trainers enter, one leaves victorious!',
}
```

---

For more information, see:
- `README.md` - Full architecture guide
- `npc-actions.ts` - All NPC action handlers
- `scripted-events.ts` - All event handlers
- `locations.ts` - Location data structure
- `npcs.ts` - NPC data structure
