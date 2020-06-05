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
	gxs: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('GXS')}|Upl0ad1ng V1ru$ BzZT!!`);
		},
		onSwitchOut() {
			this.add(`c|${getName('GXS')}|Buff3r1ng BzZT!!`);
		},
		onFaint() {
			this.add(`c|${getName('GXS')}|A Critical Error Has Occurred. Would You Like To Send A Report? Sending Report.`);
		},
	},
	mitsuki: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Mitsuki')}|alguem quer batalha?????`);
		},
		onSwitchOut(source) {
			this.add(`c|${getName('Mitsuki')}|You're weak, ${source.side.foe.name}. Why? Because you lack... hatred.`);
		},
		onFaint() {
			this.add(`c|${getName('Mitsuki')}|THIS WORLD SHALL KNOW P A I N`);
		},
	},
	overneat: {
		noCopy: true,
		onStart(source) {
			this.add(`c|${getName('Overneat')}|Lets end this ${source.side.foe.name}!!`);
			if (source.species.id !== 'absolmega' || source.illusion) return;
			this.add('-start', source, 'typeadd', 'Fairy');
		},
		onSwitchOut() {
			this.add(`c|${getName('Overneat')}|I can do better!`);
		},
		onFaint() {
			this.add(`c|${getName('Overneat')}|I was to cocky...`);
		},
	},
	om: {
		noCopy: true,
		onStart(source) {
			this.add(`c|${getName('OM~!')}|What's up gamers?`);
			if (source.illusion) return;
			this.add('-start', source, 'typeadd', 'Flying');
		},
		onSwitchOut() {
			this.add(`c|${getName('OM~!')}|Let me just ${['host murder for the 100th time', 'clean out scum zzz', 'ladder mnm rq'][this.random(3)]}`);
		},
		onFaint() {
			this.add(`c|${getName('OM~!')}|ugh, I ${['rolled a 1, damnit.', 'got killed night 1, seriously?', 'got critfroze by ice beam asfgegkhalfewgihons'][this.random(3)]}`);
		},
	},
	paradise: {
        noCopy: true,
        onStart() {
            this.add(`c|${getName('Paradise ╱╲☼')}|You ever notice that the first thing a PS tryhard does is put their PS auth in their smogon signature?`);
        },
        onSwitchOut() {
            this.add(`c|${getName('Paradise ╱╲☼')}|Pokemon Showdown copypastas have to be among the worst I've seen on any website. People spam garbage over and over until eventually the mods get fed up and clamp down on spam. I don't blame them for it. Have you ever seen a copypasta fail as hard as the dead memes on this website? There are mods on here who still think that "Harambe" and "Damn Daniel" are the peak of comedy. Not to mention that there are rooms on here that don't even talk about pokemon lol. Yeah, I don't see this website lasting more than 2 years, I'd suggest becoming a mod somewhere else.`);
        },
        onFaint(pokemon) {
            this.add(`c|${getName('Paradise ╱╲☼')}|Paradise has been kicked, not banned, therefore you could still potentially invite them back. However, do not do this @${pokemon.side.name}, unless of course, you want to be banned too, because if you invite them back you and Paradise will both be banned.`);
        },
    },
	perishsonguser: {
		noCopy: true,
		onStart(target, source) {
			this.add(`c|${getName('Perish Song')}|From the Ghastly Eyrie I can see to the ends of the world, and from this vantage point I declare with utter certainty that this one is in the bag!`);
			if (source.illusion) return;
			this.add('-start', source, 'typeadd', 'Ice');
		},
		onSwitchOut() {
			this.add(`c|${getName('Perish Song')}|This isn't the end.`);
		},
		onFaint() {
			this.add(`c|${getName('Perish Song')}|Perished.`);
		},
	},
	phiwings99: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('phiwings99')}|I'm boated.`);
		},
		onSwitchOut() {
			this.add(`c|${getName('phiwings99')}|The fact you're switching this out means you probably didn't use the Z-Move right.`);
		},
		onFaint() {
			this.add(`c|${getName('phiwings99')}|God, Nalei is fucking terrible at this game.`);
		},
	},
	// Snowstorm status support for Perish Song's ability
	snowstorm: {
		name: 'Snowstorm',
		effectType: 'Weather',
		duration: 0,
		onTryMovePriority: 1,
		onTryMove(attacker, defender, move) {
			if (move.type === 'Dark' && move.category !== 'Status') {
				this.debug('Snowstorm dark suppress');
				this.add('-fail', attacker, move, '[from] Snowstorm');
				this.attrLastMove('[still]');
				return null;
			}
		},
		onStart(battle, source, effect) {
			this.add('-weather', 'Snowstorm', '[from] ability: ' + effect, '[of] ' + source);
		},
		onResidualOrder: 1,
		onResidual() {
			this.add('-weather', 'Snowstorm', '[upkeep]');
			this.eachEvent('Weather');
		},
		onWeather(target) {
			if (!target.hasType('Ice')) this.damage(target.baseMaxhp / 16);
		},
		onEnd() {
			this.add('-weather', 'none');
		},
	},
};
