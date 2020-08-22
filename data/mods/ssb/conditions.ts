import {FS} from '../../../lib/fs';
import {toID} from '../../../sim/dex-data';

// Used in many abilities, placed here to reduce the number of updates needed and to reduce the chance of errors
const STRONG_WEATHERS = ['desolateland', 'primordialsea', 'deltastream', 'heavyhailstorm', 'winterhail'];

// Similar to User.usergroups. Cannot import here due to users.ts requiring Chat
// This also acts as a cache, meaning ranks will only update when a hotpatch/restart occurs
const usergroups: {[userid: string]: string} = {};
const usergroupData = FS('config/usergroups.csv').readIfExistsSync().split('\n');
for (const row of usergroupData) {
	if (!toID(row)) continue;

	const cells = row.split(',');
	usergroups[toID(cells[0])] = cells[1] || ' ';
}

export function getName(name: string): string {
	const userid = toID(name);
	if (!userid) throw new Error('No/Invalid name passed to getSymbol');

	const group = usergroups[userid] || ' ';
	return group + name;
}

export const Conditions: {[k: string]: ModdedConditionData} = {
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
	adri: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Adri')}|This time will definitely be the one !`);
		},
		onSwitchOut() {
			this.add(`c|${getName('Adri')}|//afk`);
		},
		onFaint() {
			this.add(`c|${getName('Adri')}|Until next time...`);
		},
	},
	aelita: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Aelita')}|The Scyphozoa's absorbing Aelita's memories!`);
		},
		onSwitchOut() {
			this.add(`c|${getName('Aelita')}|We scared it away but it will be back. We can't let it get ahold of Aelita's memories.`);
		},
		onFaint() {
			this.add(`c|${getName('Aelita')}|X.A.N.A. is finally finished for good.`);
		},
	},
	aegii: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('aegii')}|${[`stream fiesta!!! https://youtu.be/eDEFolvLn0A`, `stream more&more!!! https://youtu.be/mH0_XpSHkZo`, `stream wannabe!!! https://youtu.be/fE2h3lGlOsk`, `stream love bomb!!! https://youtu.be/-SK6cvkK4c0`][this.random(4)]}`);
		},
		onSwitchOut() {
			this.add(`c|${getName('aegii')}|${[`brb, buying albums`, `brb, buying albums`, `brb, streaming mvs`, `brb, learning choreos`][this.random(4)]}`);
		},
		onFaint() {
			this.add(`c|${getName('aegii')}|i forgot to stan loona...`);
		},
	},
	aeonic: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Aeonic')}|What's bonkin?`);
		},
		onSwitchOut() {
			this.add(`c|${getName('Aeonic')}|I am thou, thou art I`);
		},
		onFaint() {
			this.add(`c|${getName('Aeonic')}|Guys the emoji movie wasn't __that bad__`);
		},
	},
	aethernum: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Aethernum')}|Hlelo ^_^ Lotad is so cute, don't you think? But don't underestimate him!`);
		},
		onSwitchOut() {
			this.add(`c|${getName('Aethernum')}|Sinking in this sea of possibilities for now...but i'll float back once again!`);
		},
		onFaint() {
			this.add(`c|${getName('Aethernum')}|Ok, ok, i have procrastinated enough here, time to go ^_^' See ya around!`);
		},
	},
	akir: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Akir')}|hey whats up`);
		},
		onSwitchOut() {
			this.add(`c|${getName('Akir')}|let me get back to you`);
		},
		onFaint() {
			this.add(`c|${getName('Akir')}|ah well maybe next time`);
		},
	},
	alpha: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Alpha')}|eccomi dimmi`);
		},
		onSwitchOut() {
			this.add(`c|${getName('Alpha')}|FRATM FACI FRIDDU`);
		},
		onFaint() {
			this.add(`c|${getName('Alpha')}|caio`);
		},
	},
	annika: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Annika')}|The circumstances of one's birth are irrelevant; it is what you do with the gift of life that determines who you are.`);
		},
		onSwitchOut() {
			this.add(`c|${getName('Annika')}|I'll be stronger when I'm back ^_^`);
		},
		onFaint() {
			this.add(`c|${getName('Annika')}|oh, I crashed the server again...`);
		},
	},
	aquagtothepast: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('A Quag To The Past')}|Whatever happens, happens.`);
		},
		onSwitchOut() {
			this.add(`c|${getName('A Quag To The Past')}|See you space cowboy...`);
		},
		onFaint() {
			this.add(`c|${getName('A Quag To The Past')}|You're gonna carry that weight.`);
		},
	},
	arandomduck: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('a random duck')}|Hey! Got any grapes??`);
		},
		onFaint() {
			this.add(`c|${getName('a random duck')}|and he waddled away... bum bum bum`);
		},
	},
	archastl: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('ArchasTL')}|Ready the main batteries, gentlemen! Hit ‘em hard and fast!`);
		},
		onSwitchOut() {
			this.add(`c|${getName('ArchasTL')}|Helmsman, full reverse at speed!`);
		},
		onFaint() {
			this.add(`c|${getName('ArchasTL')}|They say the captain always goes down with the ship...`);
		},
		onSwitchIn(pokemon) {
			if (pokemon.illusion) return;
			if (!pokemon.m.indomitableActivated) pokemon.m.indomitableActivated = false;
		},
	},
	arcticblast: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Arcticblast')}|words are difficult`);
		},
		onSwitchOut() {
			this.add(`c|${getName('Arcticblast')}|oh no`);
		},
		onFaint() {
			this.add(`c|${getName('Arcticblast')}|single battles are bad anyway, why am I here?`);
		},
	},
	averardo: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Averardo')}|o bella`);
		},
		onSwitchOut() {
			this.add(`c|${getName('Averardo')}|Condivido schermo cosi' guardiamo i tre porcellini?`);
		},
		onFaint() {
			this.add(`c|${getName('Averardo')}|BE... Ok mejo chiudere gioco... vedo documentario su Bibbia`);
		},
	},
	awauser: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('awa!')}|awa!`);
		},
		onSwitchOut() {
			this.add(`c|${getName('awa!')}|well, at least i didn't lose the game`);
			this.add(`c|${getName('awa!')}|or did i?`);
		},
		onFaint() {
			this.add(`c|${getName('awa!')}|awawa?! awa awawawa awawa >:(`);
		},
	},
	beowulf: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Beowulf')}|:^)`);
		},
		onSwitchOut() {
			this.add(`c|${getName('Beowulf')}|/me buzzes`);
		},
		onFaint() {
			this.add(`c|${getName('Beowulf')}|time for my own isekai`);
		},
		onSourceFaint() {
			this.add(`c|${getName('Beowulf')}|another one reincarnating into an isekai`);
		},
	},
	biggie: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('biggie')}|gonna take you for a ride`);
		},
		onSwitchOut() {
			this.add(`c|${getName('biggie')}|mahvel baybee!`);
		},
		onFaint() {
			this.add(`c|${getName('biggie')}|it was all a dream`);
		},
	},
	cake: {
		noCopy: true,
		onStart(target, pokemon) {
			this.add(`c|${getName('Cake')}|AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA`);
			// h innate
			if (pokemon.illusion) return;
			const typeList = Object.keys(this.dex.data.TypeChart);
			this.prng.shuffle(typeList);
			const firstType = typeList[0];
			this.prng.shuffle(typeList);
			const secondType = typeList[0];
			let newTypes = [];
			if (firstType === secondType) {
				newTypes = [firstType];
			} else {
				newTypes = [firstType, secondType];
			}
			this.add('html|<b>h</b>');
			this.add('-start', pokemon, 'typechange', newTypes.join('/'), '[silent]');
			pokemon.setType(newTypes);
		},
		onSwitchOut(pokemon) {
			this.add(`c|${getName('Cake')}|${pokemon.side.name} is a nerd`);
		},
		onFaint() {
			this.add(`c|${getName('Cake')}|Chowder was a good show`);
		},
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual(pokemon) {
			if (pokemon.illusion) return;
			if (pokemon.activeTurns) {
				const typeList = Object.keys(this.dex.data.TypeChart);
				this.prng.shuffle(typeList);
				const firstType = typeList[0];
				this.prng.shuffle(typeList);
				const secondType = typeList[0];
				let newTypes = [];
				if (firstType === secondType) {
					newTypes = [firstType];
				} else {
					newTypes = [firstType, secondType];
				}
				this.add('html|<b>h</b>');
				this.add('-start', pokemon, 'typechange', newTypes.join('/'), '[silent]');
				pokemon.setType(newTypes);
			}
		},
	},
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
	celine: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Celine')}|Support has arrived!`);
		},
		onSwitchOut() {
			this.add(`c|${getName('Celine')}|Brb writing`);
		},
		onFaint() {
			this.add(`c|${getName('Celine')}|'Tis only a flesh wound!`); // escape the quote?
		},
	},
	ckilgannon: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('c.kilgannon')}|Take a look to the sky just before you die`);
		},
		onSwitchOut() {
			this.add(`c|${getName('c.kilgannon')}|/me growls`);
		},
		onFaint() {
			this.add(`c|${getName('c.kilgannon')}|Your time will come.`);
		},
	},
	coconut: {
		noCopy: true,
		// no quotes
	},
	darth: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Darth')}|Let the Guardian Angel protect thee!`);
		},
		onFaint() {
			this.add(`c|${getName('Darth')}|Well, everyone needs a break at some point.`);
		},
	},
	drampasgrandpa: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('drampa\'s grandpa')}|Where are my glasses?`);
		},
		onSwitchOut() {
			this.add(`c|${getName('drampa\'s grandpa')}|Darn kids...`);
		},
		onFaint() {
			this.add(`c|${getName('drampa\'s grandpa')}|Bah humbug!`);
		},
	},
	dream: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('dream')}|It's Prime Time`);
		},
		onSwitchOut() {
			this.add(`c|${getName('dream')}|oh no please god tell me we're dreaming`);
		},
		onFaint() {
			this.add(`c|${getName('dream')}|perdemos`);
		},
	},
	elgino: {
		noCopy: true,
		onStart(target, pokemon) {
			this.add(`c|${getName('Elgino')}|Time to save Hyrule!`);
			if (pokemon.illusion) return;
			this.add('-start', pokemon, 'typechange', pokemon.types.join('/'), '[silent]');
		},
		onSwitchOut() {
			this.add(`c|${getName('Elgino')}|Hold on I need to stock up on ${this.sample(['Bombs', 'Arrows', 'Magic', 'Seeds'])}`);
		},
		onFaint() {
			this.add(`c|${getName('Elgino')}|I'm out of fairies D:!`);
		},
	},
	emeri: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Emeri')}|hey !`);
		},
		onSwitchOut() {
			this.add(`c|${getName('Emeri')}|//busy`);
		},
		onFaint() {
			this.add(`c|${getName('Emeri')}|don't forget to chall SFG or Agarica in gen8ou`);
		},
	},
	epicnikolai: {
		noCopy: true,
		onStart(source) {
			this.add(`c|${getName('EpicNikolai')}|I never give up until I get something right, which means destroying you ☜(ﾟヮﾟ☜)`);
			if (source.species.id !== 'garchompmega' || source.illusion) return;
			this.add('-start', source, 'typechange', source.types.join('/'), '[silent]');
		},
		onSwitchOut() {
			this.add(`c|${getName('EpicNikolai')}|This wasn't as fun as I thought it would be, I'm out ¯_( ͡~ ͜ʖ ͡°)_/¯`); // eslint-disable-line no-irregular-whitespace
		},
		onFaint() {
			this.add(`c|${getName('EpicNikolai')}|I like to keep a positive attitude even though it is hard sometimes <('o'<)~*/`);
		},
	},
	estarossa: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('estarossa')}|honestly best pairing for hazard coverage wtih molt is like molt + tsareena/dhelmise`);
		},
		onSwitchOut() {
			this.add(`c|${getName('estarossa')}|sand balance <333`);
		},
		onFaint() {
			this.add(`c|${getName('estarossa')}|*eurgh*`);
		},
	},
	explodingdaisies: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('explodingdaisies')}|Turn and run now, and I will mercifully pretend this never happened.`);
		},
		onSwitchOut() {
			this.add(`c|${getName('explodingdaisies')}|You are beneath me, and it shows.`);
		},
		onFaint() {
			this.add(`c|${getName('explodingdaisies')}|Unacceptable!`);
		},
	},
	fart: {
		noCopy: true,
		onStart(source) {
			let activeMon;
			activeMon = source.side.foe.active[0];
			activeMon = activeMon.illusion ? activeMon.illusion.name : activeMon.name;
			const family = ['aethernum', 'trickster', 'celestial', 'gimmick', 'zalm', 'aelita', 'biggie', 'sundar'];
			if (this.toID(activeMon) === 'hoeenhero') {
				this.add(`c|${getName('fart')}|🎵 it's friday, friday, gotta get down on friday 🎵`);
			} else if (this.toID(activeMon) === 'grimauxiliatrix') {
				this.add(`c|${getName('fart')}|howdy ho, neighbor`);
			} else if (this.toID(activeMon) === 'fart') {
				this.add(`c|${getName('fart')}|How Can Mirrors Be Real If Our Eyes Aren't Real`);
			} else if (family.includes(this.toID(activeMon))) {
				this.add(`c|${getName('fart')}|hey, hey, hey. ${activeMon} is OK`);
			} else {
				this.add(`c|${getName('fart')}|rats, rats, we are the rats`);
			}
		},
		onSwitchOut() {
			this.add(`c|${getName('fart')}|if I can't win this game, then I'll make it boring for everyone.`);
		},
		onFaint(pokemon) {
			let activeMon;
			activeMon = pokemon.side.foe.active[0];
			activeMon = this.toID(activeMon.illusion ? activeMon.illusion.name : activeMon.name);
			const family = ['aethernum', 'trickster', 'celestial', 'gimmick', 'zalm', 'aelita', 'biggie', 'sundar'];
			if (family.includes(activeMon)) {
				this.add(`c|${getName('fart')}|at least I wasn't boring, right?`);
			} else {
				this.add(`c|${getName('fart')}|oy, I die`);
			}
		},
	},
	felucia: {
		noCopy: true,
		onStart(source) {
			this.add(`c|${getName('Felucia')}|battlesignup! I dropped my dice somewhere and now all I can do is make you play with them (join using %join one)`);
			if (source.illusion) return;
			this.add('-start', source, 'typechange', source.types.join('/'), '[silent]');
		},
		onSwitchOut() {
			this.add(`c|${getName('Felucia')}|battlesignup: I lost connection to a player so I guess I'll get a new one (/me in to sub)`);
		},
		onFaint() {
			this.add(`c|${getName('Felucia')}|%remp Felucia`);
		},
	},
	frostyicelad: {
		noCopy: true,
		onStart(source) {
			this.add(`c|${getName('frostyicelad ❆')}|Oh i guess its my turn now! Time to sweep!`);
			if (source.species.id !== 'frosmothmega' || source.illusion) return;
			this.add('-start', source, 'typechange', source.types.join('/'), '[silent]');
		},
		onSwitchOut(source) {
			this.add(`c|${getName('frostyicelad ❆')}|Hey! ${source.side.name} why dont you keep me in and let me sweep? Mean.`);
		},
		onFaint() {
			this.add(`c|${getName('frostyicelad ❆')}|So c-c-cold`);
		},
	},
	grimauxiliatrix: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('grimAuxiliatrix')}|${['THE JUICE IS LOOSE', 'TOOTHPASTE\'S OUT OF THE TUBE', 'PREPARE TO DISCORPORATE'][this.random(3)]}`);
		},
		onFaint() {
			this.add(`c|${getName('grimAuxiliatrix')}|${['NOT LIKE THIS', 'HALT - MODULE CORE HEMORRHAGE', 'AAAAAAAAAAAAAAAAAAA'][this.random(3)]}`);
		},
	},
	hoeenhero: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('HoeenHero')}|A storm is brewing...`);
		},
		onSwitchOut() {
			this.add(`c|${getName('HoeenHero')}|The eye of the hurricane provides a brief respite from the storm.`);
		},
		onFaint() {
			this.add(`c|${getName('HoeenHero')}|All storms eventually disipate.`);
		},
	},
	hubriz: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Hubriz')}|Free hugs!`);
		},
		onSwitchOut() {
			this.add(`c|${getName('Hubriz')}|The soil's pH level is too high. I'm out!`);
		},
		onFaint() {
			this.add(`c|${getName('Hubriz')}|Delicate Flower Quest failed...`);
		},
	},
	hydro: {
		noCopy: true,
		onStart(pokemon) {
			this.add(`c|${getName('Hydro')}|Person reading this is a qt nerd and there is absolutely NOTHING u can do about it :)`);
			if (pokemon.illusion) return;
			this.add('-start', pokemon, 'typechange', pokemon.types.join('/'), '[silent]');
		},
		onSwitchOut() {
			this.add(`c|${getName('Hydro')}|brb, taking a break from ur nerdiness`);
		},
		onFaint() {
			this.add(`c|${getName('Hydro')}|RUUUUUDEEE`);
		},
	},
	inactive: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Inactive')}|Are you my nightmare? Or am I yours?`);
		},
		onSwitchOut() {
			this.add(`c|${getName('Inactive')}|This is not the end...`);
		},
		onFaint() {
			this.add(`c|${getName('Inactive')}|/me turns to stone and crumbles`);
		},
	},
	iyarito: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Iyarito')}|Madre de Dios, ¡es el Pollo Diablo!`);
		},
		onSwitchOut() {
			this.add(`c|${getName('Iyarito')}|Well, you're not taking me without a fight!`);
		},
		onFaint() {
			this.add(`c|${getName('Iyarito')}|RIP Patrona`);
		},
	},
	jettxx: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Jett x~x')}|It's a good day for a hunt.`);
		},
		onSwitchOut(source) {
			this.add(`c|${getName('Jett x~x')}|I'll be back for more.`);
		},
		onFaint() {
			this.add(`c|${getName('Jett x~x')}|They got lucky.`);
		},
	},
	jho: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Jho')}|Hey there party people`);
		},
		onSwitchOut() {
			this.add(`c|${getName('Jho')}|The Terminator(1984), 00:57:10`);
		},
		onFaint() {
			this.add(`c|${getName('Jho')}|Unfortunately, CAP no longer accepts custom elements`);
		},
	},
	jordy: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Jordy')}|I heard there's a badge here. Please give it to me immediately.`);
		},
		onSwitchOut() {
			this.add(`c|${getName('Jordy')}|Au Revoir. Was that right?`);
		},
		onFaint() {
			this.add(`c|${getName('Jordy')}|hjb`);
		},
	},
	kaijubunny: {
		noCopy: true,
		onStart(source) {
			this.add(`c|${getName('Kaiju Bunny')}|I heard SOMEONE wasn't getting enough affection! ￣( ÒㅅÓ)￣`);
			if (source.species.id !== 'lopunnymega' || source.illusion) return;
			this.add('-start', source, 'typechange', source.types.join('/'), '[silent]');
		},
		onSwitchOut() {
			this.add(`c|${getName('Kaiju Bunny')}|Brb, need more coffee ￣( =ㅅ=)￣`);
		},
		onFaint() {
			this.add(`c|${getName('Kaiju Bunny')}|Wow, okay, r00d ￣(ಥㅅಥ)￣`);
		},
	},
	kalalokki: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Kalalokki')}|(•_•)`);
			this.add(`c|${getName('Kalalokki')}|( •_•)>⌐■-■`);
			this.add(`c|${getName('Kalalokki')}|(⌐■_■)`);
		},
		onFaint() {
			this.add(`c|${getName('Kalalokki')}|(⌐■_■)`);
			this.add(`c|${getName('Kalalokki')}|( •_•)>⌐■-■`);
			this.add(`c|${getName('Kalalokki')}|(x_x)`);
		},
		onTryHit(pokemon, target, move) {
			if (move.ohko) {
				this.add('-immune', pokemon, '[from] ability: Sturdy');
				return null;
			}
		},
		onDamagePriority: -100,
		onDamage(damage, target, source, effect) {
			if (target.hp === target.maxhp && damage >= target.hp && effect && effect.effectType === 'Move') {
				this.add('-ability', target, 'Sturdy');
				return target.hp - 1;
			}
		},
	},
	kennedylfc: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('KennedyLFC')}|up the reds`);
		},
		onSwitchOut() {
			this.add(`c|${getName('KennedyLFC')}|brb Jayi is PMing me (again) -_-`);
		},
		onFaint() {
			this.add(`c|${getName('KennedyLFC')}|I'm not meant to score goals anyway, I'm a defensive striker.`);
		},
	},
	kingbaruk: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Kingbaruk')}|:cute:`);
		},
		onSwitchOut() {
			this.add(`c|${getName('Kingbaruk')}|//none`);
		},
		onFaint() {
			this.add(`c|${getName('Kingbaruk')}|Fijne avond nog`);
		},
	},
	kingswordyt: {
		noCopy: true,
		onStart(source) {
			this.add(`c|${getName('KingSwordYT')}|Mucho texto`);
		},
		onSwitchOut() {
			this.add(`c|${getName('KingSwordYT')}|Hasta la próximaaaa`);
		},
		onFaint() {
			this.add(`c|${getName('KingSwordYT')}|**__Se anula el host__**`);
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
			if (effect.id === 'heavyhailstorm') return;
			if (target.illusion) return;
			if (!target.species.id.includes('unown')) return;
			if (effect.effectType !== 'Move') {
				if (effect.effectType === 'Ability') this.add('-activate', source, 'ability: ' + effect.name);
				return false;
			}
		},
		onResidual(pokemon) {
			if (pokemon.illusion) return;
			if (!pokemon.species.id.includes('unown')) return;
			// So this doesn't activate upon switching in
			if (pokemon.activeTurns < 1) return;
			const unownLetters = 'abcdefghijklmnopgrstuvwxyz'.split('');
			const currentFormeID = this.toID(pokemon.set.species);
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
	lionyx: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Lionyx')}|Hi, this is ps-chan, how may I help you, user-kun? (｡◕‿‿◕｡)`);
		},
		onSwitchOut() {
			this.add(`c|${getName('Lionyx')}|Teclis au secours`);
		},
		onFaint() {
			this.add(`c|${getName('Lionyx')}|The cold never bothered me anyway...`);
		},
	},
	majorbowman: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('MajorBowman')}|Aaaand Cracktion!`);
		},
		onSwitchOut() {
			this.add(`c|${getName('MajorBowman')}|This isn't Maury Povich!`);
		},
		onFaint() {
			this.add(`c|${getName('MajorBowman')}|Never loved ya.`);
		},
	},
	marshmallon: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Marshmallon')}|I'm hungry. Are you edible? c:`);
		},
		onSwitchOut() {
			this.add(`c|${getName('Marshmallon')}|RAWWWR`);
		},
		onFaint() {
			this.add(`c|${getName('Marshmallon')}|I'm still hungry. rawr. :c`);
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
	morfent: {
		noCopy: true,
		onStart(target, source) {
			this.add(`c|${getName('Morfent ( _̀> ̀)')}|le le 9gag army has arrived`);
			if (source.illusion) return;
			this.add('-start', source, 'typechange', source.types.join('/'), '[silent]');
		},
		onFaint(source) {
			this.add(`c|${getName('Morfent ( _̀> ̀)')}|mods pls ban ${source.side.foe.name}!!! they're hacking into ${source.side.name}'s account and making awful plays`);
		},
		// Prankster innate
		onModifyPriority(priority, pokemon, target, move) {
			if (move?.category === 'Status') {
				move.pranksterBoosted = true;
				return priority + 1;
			}
		},
	},
	n10sit: {
		noCopy: true,
		onStart(source) {
			this.add(`c|${getName('n10siT')}|Heheheh... were you surprised?`);
		},
		onSwitchOut() {
			this.add(`c|${getName('n10siT')}|Heheheh... did I scare you?`);
		},
		onFaint() {
			this.add(`c|${getName('n10siT')}|Hoopa never saw one of those!`);
		},
	},
	nolali: {
		noCopy: true,
		onStart(source) {
			this.add(`c|${getName('Nolali')}|What's up nerds`);
		},
		onSwitchOut() {
			this.add(`c|${getName('Nolali')}|cya nerds later`);
		},
		onFaint() {
			this.add(`c|${getName('Nolali')}|nerd`);
		},
		// Innate Prankster and Eviolite
		onModifyPriority(priority, pokemon, target, move) {
			if (move?.category === 'Status') {
				move.pranksterBoosted = true;
				return priority + 1;
			}
		},
		onModifyDefPriority: 2,
		onModifyDef(def, pokemon) {
			if (pokemon.baseSpecies.nfe) {
				return this.chainModify(1.5);
			}
		},
		onModifySpDPriority: 2,
		onModifySpD(spd, pokemon) {
			if (pokemon.baseSpecies.nfe) {
				return this.chainModify(1.5);
			}
		},
	},
	overneat: {
		noCopy: true,
		onStart(source) {
			this.add(`c|${getName('Overneat')}|Lets end this ${source.side.foe.name}!!`);
			if (source.species.id !== 'absolmega' || source.illusion) return;
			this.add('-start', source, 'typechange', source.types.join('/'), '[silent]');
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
		onStart() {
			this.add(`c|${getName('OM~!')}|What's up gamers?`);
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
		onStart() {
			this.add(`c|${getName('Perish Song')}|(╯°□°）╯︵ ┻━┻`);
		},
		onSwitchOut() {
			this.add(`c|${getName('Perish Song')}|┬──┬◡ﾉ(° -°ﾉ)`);
		},
		onFaint() {
			this.add(`c|${getName('Perish Song')}|Thanks for coming to my TED talk.`);
		},
	},
	phiwings99: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('phiwings99')}|Pick.`);
		},
		onSwitchOut() {
			this.add(`c|${getName('phiwings99')}|The fact you're switching this out means you probably didn't use the Z-Move right.`);
		},
		onFaint() {
			this.add(`c|${getName('phiwings99')}|I'm boated.`);
		},
	},
	piloswinegripado: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('piloswine gripado')}|Suave?`);
		},
		onSwitchOut() {
			this.add(`c|${getName('piloswine gripado')}|cya frend :)`);
		},
		onFaint() {
			this.add(`c|${getName('piloswine gripado')}|This was lame :/`);
		},
	},
	pirateprincess: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('PiraTe Princess')}|Ahoy! o/`);
		},
		onSwitchOut() {
			this.add(`c|${getName('PiraTe Princess')}|brb making tea`);
		},
		onFaint() {
			this.add(`c|${getName('PiraTe Princess')}|I failed my death save`);
		},
		onHit(target, source, move) {
			if (move?.effectType === 'Move' && target.getMoveHitData(move).crit) {
				this.add(`c|${getName('PiraTe Princess')}|NATURAL 20!!!`);
			}
		},
	},
	quadrophenic: {
		noCopy: true,
		// No quotes requested
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
	rajshoot: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Raj.Shoot')}|Plaza Power!`);
		},
		onSwitchOut() {
			this.add(`c|${getName('Raj.Shoot')}|We'll be back!`);
		},
		onFaint() {
			this.add(`c|${getName('Raj.Shoot')}|You'll join me in the shadow realm soon....`);
		},
		onBeforeMove(source, target, move) {
			if (move.id === 'fanservice') {
				this.boost({atk: 1, spe: 1}, source, source, move);
			}
		},
	},
	ransei: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Ransei')}|Sup! This is Gen 8 so imma run an Eternamax set. Best of luck. You’ll need it :^)`);
		},
		onFaint(pokemon) {
			const target = pokemon.side.foe.active[0];
			if (!target || target.fainted || target.hp <= 0) {
				this.add(`c|${getName('Ransei')}|Ahah yes you got rekt! Welcome to Hackmons! gg m8!`);
			} else {
				this.add(`c|${getName('Ransei')}|ripsei... Ok look you might’ve won this time but I kid you not you’re losing next game!`);
			}
		},
	},
	robb576: {
		noCopy: true,
		onStart(target, pokemon) {
			if (pokemon.side.pokemonLeft === 1) {
				this.add(`c|${getName('Robb576')}|This is our last stand. Give it everything you got ${pokemon.side.name}!`);
			} else {
				this.add(`c|${getName('Robb576')}|1, 2, 3, 4, dunno how to count no more!`);
			}
		},
		onSwitchOut(pokemon) {
			if (pokemon.side.pokemonLeft === 1) { // pls contacc
				this.add(`c|${getName('Robb576')}|Something went wrong. Please contact HoeenHero to fix this`);
			} else {
				this.add(`c|${getName('Robb576')}|5, 7, 6, I will be right back into the mix!`);
			}
		},
		onFaint(pokemon) {
			if (pokemon.species.name === "Necrozma-Ultra") {
				this.add(`c|${getName('Robb576')}|gg better luck next time. Sorry I couldn't handle them all :^(`);
			} else {
				this.add(`c|${getName('Robb576')}|8, 9, 10, it has been a pleasure man!`);
			}
		},
	},
	sectoniaservant: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('SectoniaServant')}|I love one (1) queen bee`);
		},
		onSwitchOut(pokemon) {
			this.add(`c|${getName('SectoniaServant')}|My search for my lost queen continues....`);
		},
		onFaint(pokemon) {
			this.add(`c|${getName('SectoniaServant')}|NOOOOOO NOT THE JELLY BABY`);
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
	shadecession: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Shadecession')}|Better put on my Shadecessions`);
		},
		onSwitchOut(pokemon) {
			this.add(`c|${getName('Shadecession')}|⌐■_■`);
		},
		onFaint(pokemon) {
			this.add(`c|${getName('Shadecession')}|ah, gg fam`);
		},
	},
	struchni: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Struchni')}|~tt newgame`);
		},
		onSwitchOut(source) {
			this.add(`c|${getName('Struchni')}|~tt endgame`);
			if (source.m.typeEff) delete source.m.typeEff;
		},
		onFaint(pokemon) {
			this.add(`c|${getName('Struchni')}|**selfveto**`);
		},
		// Needed for Veto move
		onHit(target, source, move) {
			target.m.typeEff = target.getMoveHitData(move).typeMod;
		},
	},
	sunny: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Sunny')}|I will live up to the hopes of those who supported me. That's why I'm giving it everything I got, for everyone!`);
		},
		onSwitchOut() {
			this.add(`c|${getName('Sunny')}|I can't just keep getting help from others. I have to hurry and learn to control my powers.`);
		},
		onFaint() {
			this.add(`c|${getName('Sunny')}|All men are not created equal. That was the reality I learned about society in general.`);
		},
	},
	teclis: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Teclis')}|A little magic can go a long way.`);
		},
		onSwitchOut() {
			this.add(`c|${getName('Teclis')}|But magic can sometimes just be an illusion.`);
		},
		onFaint() {
			this.add(`c|${getName('Teclis')}|Magic never dies. It merely fades away.`);
		},
	},
	tennisace: {
		noCopy: true,
		// TODO: Replace text with corgi images, contact Hoeen about uploading some images for ssb
		onStart() {
			// this.add(`c|${getName('tennisace')}|Hi`);
		},
		onSwitchOut() {
			// this.add(`c|${getName('tennisace')}|Mmph`);
		},
		onFaint() {
			// this.add(`c|${getName('tennisace')}|Bye`);
		},
	},
	tenshi: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Tenshi')}|Hi gm`);
		},
		onSwitchOut() {
			this.add(`c|${getName('Tenshi')}|Ight Imma head out`);
		},
		onFaint() {
			this.add(`c|${getName('Tenshi')}|Grr bork bork :(`);
		},
	},
	tiki: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('tiki')}|just tiki.`);
		},
		onSwitchOut() {
			this.add(`c|${getName('tiki')}|`);
			this.add(`raw|<img src="https://www.smogon.com/forums/attachments/cat-custom-png.254830/" />`);
		},
		onFaint() {
			this.add(`c|${getName('tiki')}|aksfgkjag o k`);
		},
	},
	trace: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('trace')}|Daishouri!`);
		},
		onSwitchOut() {
			this.add(`c|${getName('trace')}|¯\\_(ツ)_/¯`);
		},
		onFaint() {
			this.add(`c|${getName('trace')}|sucks to sucks`);
		},
	},
	trickster: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Trickster')}|(¤﹏¤).`);
		},
		onSwitchOut() {
			this.add(`c|${getName('Trickster')}|(︶︹︺)`);
		},
		onFaint() {
			this.add(`c|${getName('Trickster')}|(ಥ﹏ಥ)`);
		},
	},
	vivalospride: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('vivalospride')}|hola mi amore`);
		},
		onSwitchOut() {
			this.add(`c|${getName('vivalospride')}|no hablo español`);
		},
		onFaint() {
			this.add(`c|${getName('vivalospride')}|classic honestly`);
		},
	},
	vooper: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('vooper')}|${['Paws out, claws out!', 'Ready for the prowl!'][this.random(2)]}`);
		},
		onSwitchOut() {
			this.add(`c|${getName('vooper')}|Must... eat... bamboo...`);
		},
		onFaint() {
			this.add(`c|${getName('vooper')}|I guess Kung Fu isn't for everyone...`);
		},
	},
	xjoelituh: {
		noCopy: true,
		onStart(source) {
			this.add(`c|${getName('xJoelituh')}|Hey, how can I help you?`);
		},
		onSwitchOut() {
			this.add(`c|${getName('xJoelituh')}|Hold on, I need a second opinion.`);
		},
		onFaint() {
			let str = '';
			for (let x = 0; x < 10; x++) str += String.fromCharCode(48 + this.random(79));
			this.add(`c|${getName('xJoelituh')}|${str} ok`);
		},
	},
	yuki: {
		noCopy: true,
		onStart(target, pokemon) {
			let bst = 0;
			for (const stat of Object.values(pokemon.species.baseStats)) {
				bst += stat;
			}
			let targetBst = 0;
			for (const stat of Object.values(target.species.baseStats)) {
				targetBst += stat;
			}
			let message: string;
			if (bst > targetBst) {
				message = 'You dare challenge me!?';
			} else {
				message = 'Sometimes, you go for it';
			}
			this.add(`c|${getName('yuki')}|${message}`);
		},
		onSwitchOut() {
			this.add(`c|${getName('yuki')}|Catch me if you can!`);
		},
		onFaint() {
			this.add(`c|${getName('yuki')}|You'll never extinguish our hopes!`);
		},
	},
	zalm: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Zalm')}|<(:O)000>`);
		},
		onSwitchOut(pokemon) {
			this.add(`c|${getName('Zalm')}|Run for the hills!`);
		},
		onFaint(pokemon) {
			this.add(`c|${getName('Zalm')}|Woah`);
		},
	},
	zarel: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Zarel')}|the melo-p represents PS's battles, and the melo-a represents PS's chatrooms`);
			this.add(`c|${getName('Zarel')}|THIS melo-a represents kicking your ass, though`);
		},
	},
	zodiax: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Zodiax')}|Zodiax is here to Zodihax`);
		},
		onSwitchOut() {
			this.add(`c|${getName('Zodiax')}|Don't worry I'll be back again`);
		},
		onFaint(pokemon) {
			const name = pokemon.side.foe.name;
			this.add(`c|${getName('Zodiax')}|${name}, Why would you hurt this poor little pompombirb :(`);
		},
		// Big Storm Coming base power reduction effect
		onBasePower(basePower, pokemon, target, move) {
			if (pokemon.m.bigstormcoming) {
				return this.chainModify([0x4CC, 0x1000]);
			}
		},
	},
	// Heavy Hailstorm status support for Alpha
	heavyhailstorm: {
		name: 'HeavyHailstorm',
		effectType: 'Weather',
		duration: 3,
		onTryMovePriority: 1,
		onTryMove(attacker, defender, move) {
			if (move.type === 'Steel' && move.category !== 'Status') {
				this.debug('Heavy Hailstorm Steel suppress');
				this.add('-fail', attacker, move, '[from] Heavy Hailstorm');
				this.attrLastMove('[still]');
				return null;
			}
		},
		onWeatherModifyDamage(damage, attacker, defender, move) {
			if (move.type === 'Ice') {
				this.debug('Heavy Hailstorm ice boost');
				return this.chainModify(1.5);
			}
		},
		onStart(battle, source, effect) {
			this.add('-weather', 'Heavy Hailstorm');
			this.effectData.source = source;
		},
		onModifyMove(move, pokemon, target) {
			if (!this.field.isWeather('heavyhailstorm')) return;
			if (move.category !== "Status") {
				this.debug('Adding Heavy Hailstorm freeze');
				if (!move.secondaries) move.secondaries = [];
				for (const secondary of move.secondaries) {
					if (secondary.status === 'frz') return;
				}
				move.secondaries.push({
					chance: 10,
					status: 'frz',
				});
			}
		},
		onAnySetWeather(target, source, weather) {
			if (this.field.getWeather().id === 'heavyhailstorm' && !STRONG_WEATHERS.includes(weather.id)) return false;
		},
		onResidualOrder: 1,
		onResidual() {
			this.add('-weather', 'Heavy Hailstorm', '[upkeep]');
			if (this.field.isWeather('heavyhailstorm')) this.eachEvent('Weather');
		},
		onWeather(target, source, effect) {
			if (target.side === this.effectData.source.side) return;
			// Hail is stronger from Heavy Hailstorm
			if (!target.hasType('Ice')) this.damage(target.baseMaxhp / 8);
		},
		onEnd() {
			this.add('-end', 'Heavy Hailstorm');
		},
	},
	// Forever Winter Hail support for piloswine gripado
	winterhail: {
		name: 'Winter Hail',
		effectType: 'Weather',
		duration: 0,
		onStart(battle, source, effect) {
			if (effect?.effectType === 'Ability') {
				this.add('-weather', 'Hail', '[from] ability: ' + effect, '[of] ' + source);
			} else {
				this.add('-weather', 'Hail');
			}
		},
		onModifySpe(spe, pokemon) {
			if (!pokemon.hasType('Ice')) return this.chainModify(0.5);
		},
		onResidualOrder: 1,
		onResidual() {
			this.add('-weather', 'Hail', '[upkeep]');
			if (this.field.isWeather('winterhail')) this.eachEvent('Weather');
		},
		onWeather(target) {
			if (target.hasType('Ice')) return;
			this.damage(target.baseMaxhp / 8);
		},
		onEnd() {
			this.add('-weather', 'none');
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

			// Support for Segmr's custom move
			if (move.name === 'Disconnect') this.add(`j|${getName('Segmr')}`);
			this.trySpreadMoveHit([target], data.source, hitMove);
			// Support for Segmr's custom move
			if (move.name === 'Disconnect') this.add(`c|${getName('Segmr')}|so as i was saying, then move hits`);
		},
	},
	raindrop: {
		name: 'Raindrop',
		noCopy: true,
		onStart(target) {
			if (target.activeTurns < 1) return;
			this.effectData.layers = 1;
			this.effectData.def = 0;
			this.effectData.spd = 0;
			this.add('-start', target, 'Raindrop');
			const [curDef, curSpD] = [target.boosts.def, target.boosts.spd];
			this.boost({def: 1, spd: 1}, target, target);
			if (curDef !== target.boosts.def) this.effectData.def--;
			if (curSpD !== target.boosts.spd) this.effectData.spd--;
		},
		onResidual(target) {
			if (this.effectData.def >= 6 && this.effectData.spd >= 6) return false;
			if (target.activeTurns < 1) return;
			this.effectData.layers++;
			this.add('-start', target, 'Raindrop');
			const curDef = target.boosts.def;
			const curSpD = target.boosts.spd;
			this.boost({def: 1, spd: 1}, target, target);
			if (curDef !== target.boosts.def) this.effectData.def--;
			if (curSpD !== target.boosts.spd) this.effectData.spd--;
		},
		onEnd(target) {
			if (this.effectData.def || this.effectData.spd) {
				const boosts: SparseBoostsTable = {};
				if (this.effectData.def) boosts.def = this.effectData.def;
				if (this.effectData.spd) boosts.spd = this.effectData.spd;
				this.boost(boosts, target, target);
			}
			this.add('-end', target, 'Raindrop');
			if (this.effectData.def !== this.effectData.layers * -1 || this.effectData.spd !== this.effectData.layers * -1) {
				this.hint("Raindrop keeps track of how many times it successfully altered each stat individually.");
			}
		},
	},
	// Custom side condition to allow the ability to track what mon was last in for Darth's Ability.
	tracker: {
		onStart(source) {
			const mon = source.active[0];
			if (mon.name !== 'Darth') {
				this.effectData.storedTypes = mon.getTypes();
			}
		},
		onSwitchIn(pokemon) {
			if (pokemon.name !== 'Darth') {
				this.effectData.storedTypes = pokemon.getTypes();
			}
		},
	},
	// Custom status for A Quag To The Past's signature move
	bounty: {
		name: 'bounty',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			if (sourceEffect.effectType === 'Ability') {
				this.add('-start', target, 'bounty', '[from] ability: ' + sourceEffect.name, '[of] ' + source);
			} else {
				this.add('-start', target, 'bounty');
			}
			// this.add('-start', target, 'bounty', '[silent]');
		},
		onSwitchIn(pokemon) {
			if (pokemon.status === 'bounty') {
				this.add('-start', pokemon, 'bounty');
			}
		},
		onFaint(target, source, effect) {
			if (effect.effectType !== 'Move') return;
			if (source) {
				this.add('-activate', target, 'ability: Bounty');
				this.boost({atk: 1, def: 1, spa: 1, spd: 1, spe: 1}, source, target, effect);
			}
		},
	},
	// Brilliant Condition for Arcticblast
	brilliant: {
		name: 'Brilliant',
		duration: 5,
		onStart(pokemon) {
			this.add('-start', pokemon, 'Brilliant');
		},
		onModifyAtk(atk, pokemon) {
			return this.chainModify(1.5);
		},
		onModifyDef(def, pokemon) {
			return this.chainModify(1.5);
		},
		onModifySpA(spa, pokemon) {
			return this.chainModify(1.5);
		},
		onModifySpD(spd, pokemon) {
			return this.chainModify(1.5);
		},
		onModifySpe(spe, pokemon) {
			return this.chainModify(1.5);
		},
		onUpdate(pokemon) {
			if (pokemon.volatiles['perishsong']) pokemon.removeVolatile('perishsong');
		},
		onTryAddVolatile(status, pokemon) {
			if (status.id === 'perishsong') return null;
			if (this.dex.getEffect(status.id).onDisableMove) return null;
		},
		onResidualOrder: 7,
		onResidual(pokemon) {
			this.heal(pokemon.baseMaxhp / 16);
		},
		onTrapPokemon(pokemon) {
			pokemon.tryTrap();
		},
		onDragOut(pokemon) {
			this.add('-activate', pokemon, 'move: Ingrain');
			return null;
		},
		onEnd(pokemon) {
			this.add('-end', pokemon, 'Brilliant');
		},
	},
	// Custom status for HoeenHero's move
	stormsurge: {
		name: "Storm Surge",
		duration: 2,
		durationCallback(target, source, effect) {
			const windSpeeds = [65, 85, 95, 115, 140];
			return windSpeeds.indexOf((effect as ActiveMove).basePower) + 2;
		},
		onStart(targetSide) {
			this.add('-sidestart', targetSide, 'Storm Surge');
			this.add('-message', `Storm Surge flooded the afflicted side of the battlefield!`);
		},
		onEnd(targetSide) {
			this.add('-sideend', targetSide, 'Storm Surge');
			this.add('-message', 'The Storm Surge receded.');
		},
		onModifySpe(spe, pokemon) {
			return this.chainModify(0.25);
		},
	},
};
