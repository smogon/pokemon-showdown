import {FS} from '../../../lib/fs';

// Similar to User.usergroups. Cannot import here due to users.ts requiring Chat
// This also acts as a cache, meaning ranks will only update when a hotpatch/restart occurs
const usergroups: {[userid: string]: string} = {};
const usergroupData = FS('config/usergroups.csv').readIfExistsSync().split('\n');
for (const row of usergroupData) {
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
	cantsay: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('cant say')}|haha volc go brrrr`);
		},
		onSwitchOut() {
			this.add(`c|${getName('cant say')}|lol CTed`);
		},
		onFaint() {
			this.add(`c|${getName('cant say')}|${['imagine taking pokemon seriously when you can just get haxed', '/me plays curb your enthusiasm theme', 'bad players always get lucky'][this.random(3)]}`);
		},
		// Magic Guard Innate
		onDamage(damage, target, source, effect) {
			if (effect.effectType !== 'Move') {
				if (effect.effectType === 'Ability') this.add('-activate', source, 'ability: ' + effect.name);
				return false;
			}
		},
	},
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
	kris: {
		noCopy: true,
		onStart(source) {
			const foeName = source.side.foe.active[0].illusion ?
				source.side.foe.active[0].illusion.name : source.side.foe.active[0].name;
			this.add(`c|${getName('Kris')}|hi ${foeName}`);
		},
		onSwitchOut(source) {
			const foeName = source.side.foe.active[0].illusion ?
				source.side.foe.active[0].illusion.name : source.side.foe.active[0].name;
			this.add(`c|${getName('Kris')}|bye ${foeName}`);
		},
		onFaint() {
			this.add(`c|${getName('Kris')}|Fortnite Battle Royale`);
		},
		// phuck innate
		onDamage(damage, target, source, effect) { // Magic Guard
			if (!source || !source.species.id.startsWith('unown') || source.illusion) return;
			if (effect.effectType !== 'Move') {
				if (effect.effectType === 'Ability') this.add('-activate', source, 'ability: ' + effect.name);
				return false;
			}
		},
		onResidual(pokemon) {
			if (!pokemon.species.id.startsWith('unown') || pokemon.illusion) return;
			// So this doesn't activate upon switching in
			if (pokemon.activeTurns < 1) return;
			const unownLetters = 'abcdefghijklmnopgrstuvwxyz'.split('');
			const currentFormeID = toID(pokemon.set.species);
			const currentLetter = currentFormeID.charAt(5) || 'a';
			const chosenLetter = this.sample(unownLetters.filter(letter => {
				return letter !== currentLetter;
			}));
			// Change is permanent so when you switch out you keep the letter
			this.add(`c|${getName('Kris')}|watch this`);
			if (chosenLetter === 'w') {
				this.add('-activate', pokemon, 'ability: phuck');
				pokemon.formeChange(`unownw`, this.effect, true);
				this.add(`c|${getName('Kris')}|W? More like L`);
				this.add('-activate', pokemon, 'ability: phuck');
				pokemon.formeChange(`unownl`, this.effect, true);
				this.hint(`There are no W Pokemon that work with Kris's signature move, so we're counting this as a loss`);
			} else if (chosenLetter === 'u') {
				this.add('-activate', pokemon, 'ability: phuck');
				pokemon.formeChange(`unownu`, this.effect, true);
				this.add(`c|${getName('Kris')}|U? I'm already an Unown, no`);
				this.add('-activate', pokemon, 'ability: phuck');
				const chosenLetter2 = this.sample(unownLetters.filter(letter => {
					return letter !== 'u' && letter !== 'w';
				}));
				pokemon.formeChange(`unown${chosenLetter2}`, this.effect, true);
				this.hint(`There are no U Pokemon that work with Kris's signature move, so we're counting this as a loss`);
			} else {
				this.add('-activate', pokemon, 'ability: phuck');
				pokemon.formeChange(`unown${chosenLetter === 'a' ? '' : chosenLetter}`, this.effect, true);
			}
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
	rabia: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Rabia')}|eternally`);
		},
		onSwitchOut() {
			this.add(`c|${getName('Rabia')}|rabia`);
		},
		onFaint() {
			this.add(`c|${getName('Rabia')}|im top 500 in relevant tiers and lead gp, i have 8 badges, im fine, gg`);
		},
	},
	segmr: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Segmr')}|*awakens conquerors haki* Greetings.`);
		},
		onSwitchOut(pokemon) {
			if (!pokemon.switchFlag || pokemon.switchFlag !== 'disconnect') {
				this.add(`c|${getName('Segmr')}|The beauty of a stable internet connection is it allows you to`);
			}
			this.add(`l|Segmr`);
		},
		onFaint(pokemon) {
			const name = pokemon.side.foe.active[0].illusion ?
				pokemon.side.foe.active[0].illusion.name : pokemon.side.foe.active[0].name;
			this.add(`c|${getName('Segmr')}|I'm sorry ${name} but could you please stop talking to me`);
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
			this.add('-weather', 'Snowstorm');
		},
	},
	// Modified futuremove support for Segmr's move (Disconnect)
	futuremove: {
		// this is a slot condition
		name: 'futuremove',
		duration: 3,
		onResidualOrder: 3,
		onEnd(target) {
			const data = this.effectData;
			// time's up; time to hit! :D
			const move = this.dex.getMove(data.move);
			if (target.fainted || target === data.source) {
				this.hint(`${move.name} did not hit because the target is ${(data.fainted ? 'fainted' : 'the user')}.`);
				return;
			}

			this.add('-end', target, 'move: ' + move.name);
			target.removeVolatile('Protect');
			target.removeVolatile('Endure');

			if (data.source.hasAbility('infiltrator') && this.gen >= 6) {
				data.moveData.infiltrates = true;
			}
			if (data.source.hasAbility('normalize') && this.gen >= 6) {
				data.moveData.type = 'Normal';
			}
			if (data.source.hasAbility('adaptability') && this.gen >= 6) {
				data.moveData.stab = 2;
			}
			// @ts-ignore
			const hitMove: ActiveMove = new this.dex.Data.Move(data.moveData);

			this.trySpreadMoveHit([target], data.source, hitMove);
			// Support for Segmr's custom move
			if (move.name === 'Disconnect') {
				this.add(`j|${getName('Segmr')}`);
				this.add(`c|${getName('Segmr')}|so as i was saying, then move hits`);
			}
		},
	},
};
