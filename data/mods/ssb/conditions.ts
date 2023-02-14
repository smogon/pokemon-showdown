import {getName} from './scripts';

export const Conditions: {[k: string]: ModdedConditionData & {innateName?: string}} = {
	/*
	// Example:
	userid: {
		noCopy: true,
		onStart() {
			this.add(`c:|${getName('Username')}|Switch In Message`);
		},
		onSwitchOut() {
			this.add(`c:|${getName('Username')}|Switch Out Message`);
		},
		onFaint() {
			this.add(`c:|${getName('Username')}|Faint Message`);
		},
		// Innate effects go here
	},
	IMPORTANT: Obtain the username from getName
	*/
	// Please keep statuses organized alphabetically based on staff member name!
	aeonic: {
		noCopy: true,
		onStart() {
			this.add(`c:|${getName('Kris')}|aeo you need to submit your switch in and out messages`);
		},
		onSwitchOut() {
			this.add(`c:|${getName('Kris')}|aeo forgot to fill out his switch messages so I'm here instead.`);
		},
		onFaint() {
			this.add(`c:|${getName('Aeonic')}|i guess they never miss huh`);
		},
	},
	traceuser: {
		noCopy: true,
		onStart() {
			this.add(`c:|${getName('trace')}|I'm both the beginning and the end.`);
		},
		onSwitchOut() {
			this.add(`c:|${getName('trace')}|Why does the violence never end?`);
		},
		onFaint() {
			this.add(`c:|${getName('trace')}|How disappointingly short a dream lasts.`);
		},
	},
};
