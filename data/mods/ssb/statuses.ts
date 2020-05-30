import {FS} from '../../../lib/fs';

// Similar to User.usergroups. Cannot import here due to users.ts requiring Chat
// This also acts as a cache, meaning ranks will only update when a hotpatch/restart occurs
const usergroups: {[userid: string]: string} = {};
const data = FS('config/usergroups.csv').readIfExistsSync().split('\n');
for (const row of data) {
	if (!toID(row)) continue;

	const cells = row.split(',');
	usergroups[toID(cells[0])] = cells[1] || ' ';
}

function getName(name: string): string {
	const userid = toID(name);
	if (!userid) throw new Error('No/Invalid name passed to getSymbol');

	const group = usergroups[userid] || ' ';
	return group + name;
}

export const BattleStatuses: {[k: string]: ModdedPureEffectData} = {
	/*
	// Example:
	userid: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Username')}|Switch In Message`);
		},
		onSwitchOut() {
			this.add(`c|${getName('Username')}|Switch Out Message`);
		},
		onFaint() {
			this.add(`c|${getName('Username')}|Faint Message`);
		},
		// Innate effects go here
	},
	IMPORTANT: Obtain the username from getName
	*/
	// Please keep statuses organized alphabetically based on staff member name!
};
