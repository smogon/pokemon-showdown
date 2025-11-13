/*
* Pokemon Showdown
* RPG Story Events Data
*
* This file contains story event definitions triggered at specific points in the game.
*
* Story events are triggered based on player actions like entering locations,
* defeating trainers, or obtaining badges. They're separate from location-based
* scriptedEvents and are managed by the story system.
*
* Story Event Triggers:
*   - location_enter: When player enters a specific location
*   - trainer_defeat: When player defeats a specific trainer
*   - badge_obtain: When player obtains a specific badge
*   - manual: Manually triggered by code
*
* Story Event Configuration:
*   - id: Unique event identifier
*   - name: Display name of the event
*   - description: Brief description
*   - trigger: Trigger type (see above)
*   - location: Location ID (for location_enter)
*   - trainerId: Trainer ID (for trainer_defeat)
*   - badgeName: Badge name (for badge_obtain)
*   - flagsRequired: Flags that must be set
*   - flagsSet: Flags to set when event triggers
*   - dialogue: Message to display
*
* All scripted event handlers from scripted-events.ts can be used
* with story events as well.
*
* Example:
*   {
*     id: 'first_badge',
*     name: 'First Badge Earned',
*     description: 'You earned your first gym badge',
*     trigger: 'badge_obtain',
*     badgeName: 'Boulder Badge',
*     flagsSet: ['first_badge_earned'],
*     dialogue: 'Congratulations on earning your first badge!',
*   }
*/

export interface StoryEvent {
	id: string;
	name: string;
	description: string;
	trigger: 'location_enter' | 'trainer_defeat' | 'badge_obtain' | 'manual';
	location?: string;
	trainerId?: string;
	badgeName?: string;
	flagsRequired?: string[];
	flagsSet?: string[];
	dialogue?: string;
}

export const STORY_EVENTS: Record<string, StoryEvent> = {
	'welcome': {
		id: 'welcome',
		name: 'Welcome to the World',
		description: 'Your journey begins',
		trigger: 'manual',
		flagsSet: ['game_started'],
		dialogue: 'Welcome to the world of Pokémon! Your adventure is about to begin!',
	},
	'first_badge': {
		id: 'first_badge',
		name: 'First Badge Earned',
		description: 'You earned your first gym badge',
		trigger: 'badge_obtain',
		badgeName: 'Boulder Badge',
		flagsSet: ['first_badge_earned'],
		dialogue: 'Congratulations on earning your first badge! The road ahead will be challenging, but I believe in you!',
	},
	'halfway_badges': {
		id: 'halfway_badges',
		name: 'Four Badges',
		description: 'You have earned four badges',
		trigger: 'manual',
		flagsRequired: [],
		flagsSet: ['halfway_badges'],
		dialogue: "You're halfway to the Pokémon League! Keep training and you'll make it!",
	},
	'all_badges': {
		id: 'all_badges',
		name: 'All Badges Obtained',
		description: 'You have earned all eight gym badges',
		trigger: 'badge_obtain',
		badgeName: 'Earth Badge',
		flagsSet: ['all_badges'],
		dialogue: 'You have all eight badges! Victory Road awaits. The Elite Four will test everything you have learned!',
	},
	'elitefourready': {
		id: 'elitefourready',
		name: 'Ready for Elite Four',
		description: 'Entered the Pokémon League',
		trigger: 'location_enter',
		location: 'pokemonleague',
		flagsRequired: ['all_badges'],
		dialogue: 'This is it! The Elite Four await. Only the strongest trainers make it past here. Are you ready?',
	},
	'championdefeated': {
		id: 'championdefeated',
		name: 'Champion Defeated',
		description: 'You defeated the Champion and became the new Champion',
		trigger: 'trainer_defeat',
		trainerId: 'championblue',
		flagsSet: ['champion', 'game_complete'],
		dialogue: "Congratulations! You are the new Pokémon League Champion! You've proven yourself as one of the greatest trainers!",
	},
};
