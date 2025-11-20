/*
* Pokemon Showdown
* RPG Story Events Data
*/

import { FIRST_BADGE_NAME, LAST_BADGE_NAME } from './badges';

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
    // Add global story events here
};
