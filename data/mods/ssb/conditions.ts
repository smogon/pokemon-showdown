import {FS} from '../../../lib';
import {toID} from '../../../sim/dex-data';

// Similar to User.usergroups. Cannot import here due to users.ts requiring Chat
// This also acts as a cache, meaning ranks will only update when a hotpatch/restart occurs
const usergroups: {[userid: string]: string} = {};
const usergroupData = FS('config/usergroups.csv').readIfExistsSync().split('\n');
for (const row of usergroupData) {
	if (!toID(row)) continue;

	const cells = row.split(',');
	if (cells.length > 3) throw new Error(`Invalid entry when parsing usergroups.csv`);
	usergroups[toID(cells[0])] = cells[1].trim() || ' ';
}

export function getName(name: string): string {
	const userid = toID(name);
	if (!userid) throw new Error('No/Invalid name passed to getSymbol');

	const group = usergroups[userid] || ' ';
	return Math.floor(Date.now() / 1000) + '|' + group + name;
}

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
};
