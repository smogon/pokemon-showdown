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
	aquagtothepast: {
		noCopy: true,
		onStart() {
			this.add(`c:|${getName('A Quag To The Past')}|I'm coming out of my cage and I've been doing just fine`);
		},
		onSwitchOut() {
			this.add(`c:|${getName('A Quag To The Past')}|so true`);
		},
		onFoeSwitchIn(pokemon) {
			if (pokemon.name === 'Aeonic') {
				this.add(`c:|${getName('A Quag To The Past')}|!randpoke natdex`);
				this.add(`c:|${getName('Aeonic')}|!randpoke natdex`);
			}
		},
		onFaint() {
			const lines = [
				'Anger he felt',
				'Before Showderp he knelt',
				'A moderator so quiet',
				'Inventing his riot',
				'[[]]',
				'Onward he gazed',
				'As his cattle had grazed',
				'Wolves on the hills',
				'Mom paying his bills',
				'[[]]',
				'His keyboard he used',
				'His power: abused',
				'"Silent as me"',
				'"You must be"',
				'[[]]',
				'The chatroom is dead',
				'Yet quickly he fled',
				'Before retaliation, he made fast',
				'A Quag To The Past',
			];
			for (const line of lines) {
				this.add(`c:|${getName('A Quag To The Past')}|${line}`);
			}
		},
	},
	breadloeuf: {
		noCopy: true,
		onStart() {
			this.add(`c:|${getName('BreadLoeuf')}|I loeuf you <3`);
		},
		// onSwitchOut implemented in ability instead
		onFaint() {
			this.add(`c:|${getName('BreadLoeuf')}|Oh, ma vie... c'est 'pitable'...`);
		},
		onFoeFaint(target, source, effect) {
			if (source === this.effectState.target && effect?.name === 'Painful Exit') {
				this.add(`c:|${getName('BreadLoeuf')}|Ashes to ashes, crust to crust.`);
			} else {
				this.add(`c:|${getName('BreadLoeuf')}|Ope, someone's swallowing fishes.`);
			}
		},
	},
	kennedy: {
		noCopy: true,
		innateName: "Battle Bond",
		shortDesc: "After KOing a Pokemon: becomes Cinderace-Gmax.",
		onStart(target, source, effect) {
			const message = this.sample(['Justice for the 97', 'up the reds']);
			this.add(`c:|${getName('Kennedy')}|${message}`);
			if (source && source.name === 'Clementine') {
				if (source.volatiles['flipped']) {
					source.removeVolatile('flipped');
					this.add(`c:|${getName('Kennedy')}|┬──┬◡ﾉ(° -°ﾉ)`);
				} else {
					source.addVolatile('flipped', target, this.effect);
					this.add(`c:|${getName('Kennedy')}|(╯°o°）╯︵ ┻━┻`);
				}
			}
			if (target.species.id === 'cinderacegmax' && !target.terastallized) {
				this.add('-start', target, 'typechange', target.getTypes(true, true).join('/'), '[silent]');
			}
		},
		onSwitchOut() {
			this.add(`c:|${getName('Kennedy')}|!lastfm`); // TODO replace
			this.add(`c:|${getName('Kennedy')}|Whilst I'm gone, stream this ^`);
		},
		onFoeSwitchIn(pokemon) {
			switch ((pokemon.illusion || pokemon).name) {
			case 'Links':
				this.add(`c:|${getName('Kennedy')}|Blue and white shite, blue and white shite, hello, hello.`);
				this.add(`c:|${getName('Kennedy')}|Blue and white shite, blue and white shite, hello, hello.`);
				break;
			case 'Clementine':
				this.add(`c:|${getName('Kennedy')}|Not the Fr*nch....`);
				break;
			case 'Kris':
				this.add(`c:|${getName('Kennedy')}|fuck that`);
				this.effectState.target.faint();
				this.add('message', 'Kennedy fainted mysteriously.....');
				break;
			}
		},
		onFaint() {
			this.add(`c:|${getName('Kennedy')}|FUCK OFF, REALLY?????`);
		},
		onSourceAfterFaint(length, target, source, effect) {
			const message = this.sample(['ALLEZZZZZ', 'VAMOSSSSS', 'FORZAAAAA', 'LET\'S GOOOOO']);
			this.add(`c:|${getName('Kennedy')}|${message}`);
			if (source.species.id === 'cinderace' && this.field.pseudoWeather['anfieldatmosphere'] &&
				!source.transformed && effect?.effectType === 'Move' && source.hp && source.side.foePokemonLeft()) {
				this.add('-activate', source, 'ability: Battle Bond');
				source.formeChange('Cinderace-Gmax', this.effect, true);
				source.baseMaxhp = Math.floor(Math.floor(
					2 * source.species.baseStats['hp'] + source.set.ivs['hp'] + Math.floor(source.set.evs['hp'] / 4) + 100
				) * source.level / 100 + 10);
				const newMaxHP = source.volatiles['dynamax'] ? (2 * source.baseMaxhp) : source.baseMaxhp;
				source.hp = newMaxHP - (source.maxhp - source.hp);
				source.maxhp = newMaxHP;
				this.add('-heal', source, source.getHealth, '[silent]');
			}
		},
		onUpdate(pokemon) {
			if (pokemon.volatiles['attract']) {
				this.add(`c:|${getName('Kennedy')}|NAAA FUCK OFF, I'd rather be dead`);
				pokemon.faint();
				this.add('message', 'Kennedy would have been infatuated but fainted mysteriously');
			}
		},
		onSourceCriticalHit(pokemon, source, move) {
			this.add(`c:|${getName('Kennedy')}|LOOOOOOL ffs`);
		},
		onFlinch(pokemon) {
			if (pokemon.illusion) return;
			this.add(`c:|${getName('Kennedy')}|LOOOOOOL ffs`);
		},
	},
	mia: {
		noCopy: true,
		onStart() {
			this.add(`c:|${getName('Mia')}|git pull ps mia`);
		},
		onSwitchOut() {
			this.add(`c:|${getName('Mia')}|git switch`);
		},
		onFaint() {
			this.add(`c:|${getName('Mia')}|git checkout --detach HEAD && git commit -m "war crimes"`);
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
