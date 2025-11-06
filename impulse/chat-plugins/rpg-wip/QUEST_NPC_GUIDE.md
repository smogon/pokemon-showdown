# Quest and NPC System Guide

This guide explains how to create and manage quests and NPCs in the RPG system.

## Table of Contents
1. [Quest System Overview](#quest-system-overview)
2. [Creating Quests](#creating-quests)
3. [NPC System Overview](#npc-system-overview)
4. [Creating NPCs](#creating-npcs)
5. [Quest Objective Types](#quest-objective-types)
6. [Examples](#examples)

## Quest System Overview

The quest system allows players to:
- Accept and track multiple quests simultaneously
- Complete objectives that are automatically tracked
- Receive rewards (money, items, badges) upon completion
- Follow quest prerequisites (required quests, badges)

### Quest Structure

A quest consists of:
- **ID**: Unique identifier
- **Name**: Display name
- **Type**: 'main' or 'side'
- **Description**: Brief description
- **Objectives**: Array of objectives to complete
- **Rewards**: Items, money, badges, etc.
- **Prerequisites**: Required quests or badges
- **Location**: Where the quest is available
- **Giver**: NPC who gives the quest
- **Dialogue**: Start, progress, and complete messages

## Creating Quests

### Step 1: Define the Quest in QUEST_DATABASE

Add your quest to the `QUEST_DATABASE` object in `/impulse/chat-plugins/rpg-wip/quests.ts`:

```typescript
export const QUEST_DATABASE: Record<string, Quest> = {
	'your_quest_id': {
		id: 'your_quest_id',
		name: 'Quest Name',
		type: 'main', // or 'side'
		description: 'Brief description of the quest',
		objectives: [
			{
				id: 'objective_1',
				type: 'defeat_trainer', // see Quest Objective Types below
				description: 'Defeat the gym leader',
				target: 'gym_leader_id', // depends on objective type
				targetCount: 1,
				currentCount: 0,
				completed: false,
			},
		],
		rewards: {
			money: 1000,
			badges: 1,
			items: [
				{ id: 'potion', quantity: 5 },
				{ id: 'pokeball', quantity: 3 },
			],
		},
		prerequisiteQuests: ['previous_quest_id'], // optional
		prerequisiteBadges: 0, // optional
		location: 'Starter Town',
		givenBy: 'npc_id', // optional
		dialogue: {
			start: 'Quest start dialogue',
			progress: 'Quest in progress dialogue', // optional
			complete: 'Quest complete dialogue',
		},
	},
	// ... more quests
};
```

### Step 2: Create an NPC to Give the Quest (Optional)

If you want an NPC to give the quest, add the NPC to `NPC_DATABASE` in `/impulse/chat-plugins/rpg-wip/npcs.ts`:

```typescript
export const NPC_DATABASE: Record<string, NPC> = {
	'npc_id': {
		id: 'npc_id',
		name: 'NPC Name',
		location: 'Starter Town',
		dialogue: 'Default NPC dialogue',
		actions: [
			{
				type: 'give_quest',
				questId: 'your_quest_id',
				dialogue: 'Would you like to accept this quest?',
				requirements: {
					doesNotHaveQuest: 'your_quest_id', // prevent duplicate
					questCompleted: 'prerequisite_quest', // optional
				},
			},
			// ... more actions
		],
	},
};
```

## Quest Objective Types

### 1. defeat_trainer
Tracks when a specific trainer is defeated in battle.

```typescript
{
	id: 'defeat_gym_leader',
	type: 'defeat_trainer',
	description: 'Defeat Gym Leader Brock',
	target: 'gym_brock', // trainer ID
	targetCount: 1,
	currentCount: 0,
	completed: false,
}
```

### 2. catch_pokemon
Tracks when Pokemon are caught.

```typescript
{
	id: 'catch_pikachu',
	type: 'catch_pokemon',
	description: 'Catch a Pikachu',
	target: 'pikachu', // species ID (optional, omit for "any pokemon")
	targetCount: 1,
	currentCount: 0,
	completed: false,
}
```

### 3. collect_item
Checks player's inventory for specific items.

```typescript
{
	id: 'collect_potions',
	type: 'collect_item',
	description: 'Collect 5 Potions',
	target: 'potion', // item ID
	targetCount: 5,
	currentCount: 0,
	completed: false,
}
```

### 4. defeat_wild_pokemon
Tracks defeats of wild Pokemon (not trainers).

```typescript
{
	id: 'defeat_wild',
	type: 'defeat_wild_pokemon',
	description: 'Defeat 10 wild Pokemon',
	// No target needed - counts all wild Pokemon
	targetCount: 10,
	currentCount: 0,
	completed: false,
}
```

### 5. talk_to_npc
Tracks interactions with specific NPCs.

```typescript
{
	id: 'talk_to_professor',
	type: 'talk_to_npc',
	description: 'Talk to Professor Oak',
	target: 'professor', // NPC ID
	targetCount: 1,
	currentCount: 0,
	completed: false,
}
```

### 6. have_pokemon_in_party
Checks the number of Pokemon in the player's party.

```typescript
{
	id: 'get_starter',
	type: 'have_pokemon_in_party',
	description: 'Get your starter Pokemon',
	targetCount: 1, // Check for at least 1 Pokemon
	currentCount: 0,
	completed: false,
}
```

### 7. reach_location
Checks if player is in a specific location. (Not yet fully implemented)

```typescript
{
	id: 'reach_pewter',
	type: 'reach_location',
	description: 'Reach Pewter City',
	target: 'Pewter City', // location name
	targetCount: 1,
	currentCount: 0,
	completed: false,
}
```

## NPC System Overview

NPCs can:
- Give quests
- Give/take items
- Start battles
- Heal Pokemon
- Open shops
- Have dialogue-only interactions

### NPC Structure

An NPC consists of:
- **ID**: Unique identifier
- **Name**: Display name
- **Location**: Where the NPC is located
- **Dialogue**: Default dialogue when talking to them
- **Actions**: Array of actions the NPC can perform
- **oneTimeOnly**: If true, can only interact once (optional)

## Creating NPCs

Add your NPC to the `NPC_DATABASE` in `/impulse/chat-plugins/rpg-wip/npcs.ts`:

```typescript
export const NPC_DATABASE: Record<string, NPC> = {
	'npc_id': {
		id: 'npc_id',
		name: 'NPC Name',
		location: 'Starter Town',
		dialogue: 'Hello! How can I help you?',
		actions: [
			// Action 1: Give a quest
			{
				type: 'give_quest',
				questId: 'quest_id',
				dialogue: 'Would you like to help me?',
				requirements: {
					doesNotHaveQuest: 'quest_id',
				},
			},
			// Action 2: Give an item
			{
				type: 'give_item',
				giveItem: { id: 'potion', quantity: 1 },
				dialogue: 'Here, take this Potion!',
				requirements: {
					questCompleted: 'some_quest',
				},
			},
			// Action 3: Heal party
			{
				type: 'heal_party',
				dialogue: 'Let me heal your Pokemon!',
			},
			// Default dialogue (always available)
			{
				type: 'dialogue_only',
				dialogue: 'Have a nice day!',
			},
		],
		oneTimeOnly: false, // Can interact multiple times
	},
};
```

### NPC Action Types

#### 1. give_quest
Gives a quest to the player.

```typescript
{
	type: 'give_quest',
	questId: 'quest_id',
	dialogue: 'Accept this quest?',
	requirements: {
		doesNotHaveQuest: 'quest_id', // Don't show if already has quest
		questCompleted: 'prerequisite_quest', // Optional: require another quest
	},
}
```

#### 2. give_item
Gives items to the player.

```typescript
{
	type: 'give_item',
	giveItem: { id: 'pokeball', quantity: 5 },
	dialogue: 'Here are some Poke Balls!',
	requirements: {
		minBadges: 1, // Optional: require badges
	},
}
```

#### 3. take_item
Takes items from the player (for quest turn-ins).

```typescript
{
	type: 'take_item',
	takeItem: { id: 'potion', quantity: 3 },
	dialogue: 'Thank you for the potions!',
	requirements: {
		hasItem: { id: 'potion', quantity: 3 },
		hasQuest: 'delivery_quest',
	},
}
```

#### 4. start_battle
Starts a trainer battle.

```typescript
{
	type: 'start_battle',
	trainerId: 'gym_leader_id',
	dialogue: 'Let\'s battle!',
	requirements: {
		minBadges: 0,
	},
}
```

#### 5. heal_party
Heals all Pokemon in the player's party.

```typescript
{
	type: 'heal_party',
	dialogue: 'Your Pokemon are fully healed!',
}
```

#### 6. shop
Opens the shop interface.

```typescript
{
	type: 'shop',
	dialogue: 'Welcome to my shop!',
}
```

#### 7. dialogue_only
Just shows dialogue (no other effect).

```typescript
{
	type: 'dialogue_only',
	dialogue: 'Have a great day!',
}
```

### NPC Requirements

Requirements determine when an action is available:

```typescript
requirements: {
	hasItem: { id: 'item_id', quantity: 3 }, // Player must have item
	hasQuest: 'quest_id', // Player must have active quest
	questCompleted: 'quest_id', // Player must have completed quest
	minBadges: 2, // Player must have at least X badges
	doesNotHaveQuest: 'quest_id', // Player must NOT have this quest (active or completed)
}
```

## Examples

### Example 1: Simple Fetch Quest

```typescript
// Quest
'fetch_berries': {
	id: 'fetch_berries',
	name: 'Berry Collection',
	type: 'side',
	description: 'Collect 10 Oran Berries',
	objectives: [
		{
			id: 'collect_berries',
			type: 'collect_item',
			description: 'Collect 10 Oran Berries',
			target: 'oranberry',
			targetCount: 10,
			currentCount: 0,
			completed: false,
		},
	],
	rewards: {
		money: 500,
		items: [{ id: 'sitrusberry', quantity: 3 }],
	},
	location: 'Berry Forest',
	givenBy: 'berry_picker',
	dialogue: {
		start: 'I need Oran Berries! Can you help?',
		complete: 'Thank you! Here\'s your reward!',
	},
},

// NPC
'berry_picker': {
	id: 'berry_picker',
	name: 'Berry Picker',
	location: 'Berry Forest',
	dialogue: 'I love berries!',
	actions: [
		{
			type: 'give_quest',
			questId: 'fetch_berries',
			dialogue: 'Can you collect some berries for me?',
			requirements: {
				doesNotHaveQuest: 'fetch_berries',
			},
		},
		{
			type: 'dialogue_only',
			dialogue: 'Thanks for your help!',
		},
	],
},
```

### Example 2: Multi-Stage Quest

```typescript
'defeat_team_rocket': {
	id: 'defeat_team_rocket',
	name: 'Stop Team Rocket!',
	type: 'main',
	description: 'Defeat three Team Rocket members',
	objectives: [
		{
			id: 'defeat_grunt_1',
			type: 'defeat_trainer',
			description: 'Defeat Team Rocket Grunt #1',
			target: 'rocket_grunt_1',
			targetCount: 1,
			currentCount: 0,
			completed: false,
		},
		{
			id: 'defeat_grunt_2',
			type: 'defeat_trainer',
			description: 'Defeat Team Rocket Grunt #2',
			target: 'rocket_grunt_2',
			targetCount: 1,
			currentCount: 0,
			completed: false,
		},
		{
			id: 'defeat_admin',
			type: 'defeat_trainer',
			description: 'Defeat Team Rocket Admin',
			target: 'rocket_admin',
			targetCount: 1,
			currentCount: 0,
			completed: false,
		},
	],
	rewards: {
		money: 2000,
		items: [
			{ id: 'hyperpotion', quantity: 5 },
			{ id: 'revive', quantity: 2 },
		],
	},
	prerequisiteQuests: ['main_first_badge'],
	location: 'Rocket Hideout',
	dialogue: {
		start: 'Team Rocket is causing trouble! Stop them!',
		complete: 'You saved the day! Thank you!',
	},
},
```

## Testing Your Quest/NPC

1. Start the game: `/rpg start`
2. Choose a starter if needed: `/rpg choosestarter pikachu`
3. Go to explore: `/rpg explore`
4. Click "Talk to NPCs": Shows NPCs in your location
5. Talk to your NPC: `/rpg talknpc npc_id`
6. Accept the quest and complete objectives
7. Check quest progress: `/rpg quests`

## Tips

1. **Quest IDs**: Use descriptive IDs like `main_first_gym` or `side_catch_tutorial`
2. **NPC Locations**: Match NPC locations to quest locations
3. **Requirements**: Use requirements to create logical quest chains
4. **Dialogue**: Write engaging dialogue that fits the Pokemon universe
5. **Testing**: Test your quests thoroughly before deploying
6. **Balance**: Make sure rewards are appropriate for quest difficulty
