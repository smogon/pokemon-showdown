'use strict';

/**@type {{[k: string]: ModdedEffectData}} */
let BattleStatuses = {
	/*
	// Example:
	userid: {
		noCopy: true,
		onStart: function () {
			this.add(`c|+Username|Switch In Message`);
		},
		onSwitchOut: function () {
			this.add(`c|+Username|Switch Out Message`);
		},
		onFaint: function () {
			this.add(`c|+Username|Faint Message`);
		},
		// Innate effects go here
	},
	*/
	// Please keep statuses organized alphabetically based on staff member name!
	aelita: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@Aelita|Transfer, Aelita! Scanner, Aelita! Virtualization!`);
		},
		onSwitchOut: function () {
			this.add(`c|@Aelita|I have a tower to deactivate. See ya!`);
		},
		onFaint: function () {
			this.add(`c|@Aelita|CODE: LYOKO . Tower deactivated... Return to the past, now!`);
		},
	},
	ant: {
		noCopy: true,
		onStart: function () {
			this.add(`c|&ant|the superior ant is here`);
		},
		onSwitchOut: function () {
			this.add(`c|&ant|hasta la vista baby`);
		},
		onFaint: function () {
			this.add(`c|&ant|I'M NOT ANTEMORTEM`);
		},
	},
	akir: {
		noCopy: true,
		onStart: function () {
			this.add(`c|%Akir|hey whats up`);
		},
		onSwitchOut: function () {
			this.add(`c|%Akir|sorry need to build more`);
		},
		onFaint: function () {
			this.add(`c|%Akir|too sleepy, c ya`);
		},
		onSourceModifyDamage: function (damage, source, target, move) {
			if (move.typeMod > 0) {
				this.debug('Solid Rock neutralize');
				return this.chainModify(0.75);
			}
		},
	},
	beowulf: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@Beowulf|/me BUZZES LOUDLY`);
		},
		onSwitchOut: function () {
			this.add(`c|@Beowulf|/me BUZZES LOUDLY`);
		},
		onFaint: function () {
			this.add(`c|@Beowulf|BUZZ BUZZ BUZZ BUZZ`);
		},
	},
	cc: {
		noCopy: true,
		onStart: function () {
			this.add(`c|%cc|Yo guys! :]`);
		},
		onSwitchOut: function () {
			this.add(`c|%cc|Gotta go brb`);
		},
		onFaint: function () {
			this.add(`c|%cc|Unfort`);
		},
	},
	cerberax: {
		noCopy: true,
		onStart: function () {
			this.add(`c|%Cerberax|(╯°□°)╯︵ ┻━┻`);
		},
		onSwitchOut: function () {
			this.add(`c|%Cerberax|┬─┬ ノ( ゜-゜ノ)`);
		},
		onFaint: function () {
			this.add(`c|%Cerberax|┬─┬ ︵ /(.□. \\）`);
		},
	},
	ceteris: {
		noCopy: true,
		onStart: function () {
			this.add(`c|%Ceteris|Your loss is inevitable, you best forfeit the battle if you know what's good for you. ╰(⇀︿⇀)つ-]═───`);
		},
		onSwitchOut: function (source) {
			this.add(`c|%Ceteris|Saving the best for last, ${source.side.name}, a wise choice my friend.`);
		},
		onFaint: function () {
			this.add(`c|%Ceteris|IMPOSSIBLE!! THIS IS AN OUTRAGE!! I WILL EXACT MY REVENGE ON YOU ONE DAY (◣_◢)`);
		},
	},
	chloe: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@Chloe|hlelo`);
		},
		onSwitchOut: function () {
			this.add(`c|@Chloe|bubye`);
		},
		onFaint: function () {
			this.add(`c|@Chloe|aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`);
		},
	},
	deg: {
		noCopy: true,
		onStart: function () {
			this.add(`c|%deg|rof`);
		},
		onSwitchOut: function () {
			this.add(`c|%deg|rof`);
		},
		onFaint: function () {
			this.add(`c|%deg|Dream Eater Gengar is an unset.`);
		},
	},
	dragonwhale: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@DragonWhale|i would switch to chomper here`);
		},
	},
	e4flint: {
		noCopy: true,
		onStart: function (target, source) {
			this.add(`c|@E4 Flint|How many Fire-Types do I have now`);
			// Mega evo right away and display unique typing
			this.runMegaEvo(source);
			this.add('-start', source, 'typeadd', 'Fire');
		},
		onFaint: function () {
			this.add(`c|@E4 Flint|lul ok`);
		},
	},
	eien: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@Eien|umu!`);
		},
		onFaint: function () {
			this.add(`c|@Eien|This game is Bad Civilization...`);
		},
	},
	eternally: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@eternally|quack`);
		},
		onFaint: function () {
			this.add(`c|@eternally|quack`);
		},
	},
	ev: {
		onStart: function (target) {
			this.add(`c|~EV|Behold! The power of EVOLUTION!`);

			let formes = {
				'flareon': ['Icicle Crash', 'Earthquake', 'Baton Pass', 'Evoblast'],
				'jolteon': ['Ice Beam', 'Flamethrower', 'Baton Pass', 'Evoblast'],
				'vaporeon': ['Recover', 'Heal Bell', 'Baton Pass', 'Evoblast'],
				'espeon': ['Aura Sphere', 'Lovely Kiss', 'Baton Pass', 'Evoblast'],
				'umbreon': ['Knock Off', 'Toxic', 'Baton Pass', 'Evoblast'],
				'leafeon': ['Synthesis', 'Hi Jump Kick', 'Baton Pass', 'Evoblast'],
				'glaceon': ['Blue Flare', 'Agility', 'Baton Pass', 'Evoblast'],
				'sylveon': ['Earth Power', 'Calm Mind', 'Baton Pass', 'Evoblast'],
			};
			let forme = Object.keys(formes)[this.random(8)];
			this.add(`-anim`, target, 'Geomancy', target);
			target.formeChange(forme);
			target.setAbility('Anticipation');
			// Update movepool
			target.moveSlots = [];
			for (let i = 0; i < formes[forme].length; i++) {
				let moveid = formes[forme][i];
				let move = this.getMove(moveid);
				if (!move.id) continue;
				target.moveSlots.push({
					move: move.name,
					id: move.id,
					// @ts-ignore hacky change for EV's set
					pp: Math.floor(((move.noPPBoosts || move.isZ) ? move.pp : move.pp * 8 / 5) * (target.ppPercentages ? target.ppPercentages[i] : 1)),
					maxpp: ((move.noPPBoosts || move.isZ) ? move.pp : move.pp * 8 / 5),
					target: move.target,
					disabled: false,
					used: false,
					virtual: true,
				});
				target.moves.push(move.id);
			}
		},
		onBeforeSwitchOut: function (pokemon) {
			// @ts-ignore hacky change for EV's set
			pokemon.ppPercentages = pokemon.moveSlots.slice().map(m => {
				return m.pp / m.maxpp;
			});
		},
		onSwitchOut: function () {
			this.add(`c|~EV|We'll be back.`);
		},
		onFaint: function () {
			this.add(`c|~EV|If you __say__ EV it sounds like Eevee. It's actually quite simple.`);
		},
	},
	kalalokki: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@Kalalokki|(•_•)`);
			this.add(`c|@Kalalokki|( •_•)>⌐■-■`);
			this.add(`c|@Kalalokki|(⌐■_■)`);
			this.setWeather('raindance');
		},
		onFaint: function () {
			this.add(`c|@Kalalokki|(⌐■_■)`);
			this.add(`c|@Kalalokki|( •_•)>⌐■-■`);
			this.add(`c|@Kalalokki|(x_x)`);
		},
	},
	hippopotas: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@Hippopotas|Something broke. If you're seeing this message, please PM a staff member about it.`);
		},
		onSwitchOut: function () {
			this.add(`c|@Hippopotas|Something broke. If you're seeing this message, please PM a staff member about it.`);
		},
		onFaint: function () {
			this.add(`c|@Hippopotas|Something broke. If you're seeing this message, please PM a staff member about it.`);
		},
	},
	hoeenhero: {
		noCopy: true,
		onStart: function () {
			this.add(`c|&HoeenHero|I'll script my way to victory!`);
		},
		onSwitchOut: function () {
			this.add(`c|&HoeenHero|I need to look something up, hold on...`);
		},
		onFaint: function () {
			this.add(`c|&HoeenHero|NO! There must of been a bug in my script ;-;`);
		},
	},
	iyarito: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@Iyarito|Iyarito is always right`);
		},
		onSwitchOut: function () {
			this.add(`c|@Iyarito|It's all Iyarito's fault`);
		},
		onFaint: function () {
			this.add(`c|@Iyarito|RIP Patrona`);
		},
	},
	kay: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@Kay|Every kiss begins with Kay`);
		},
		onSwitchOut: function () {
			this.add(`c|@Kay|くコ:彡`);
		},
		onFaint: function () {
			this.add(`c|@Kay|'kay bye!くコ:彡`);
		},
		// Simple Innate
		onBoost: function (boost, target, source, effect) {
			if (effect && effect.id === 'zpower') return;
			for (let i in boost) {
				// @ts-ignore
				boost[i] *= 2;
			}
		},
	},
	kingswordyt: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@KingSwordYT|You're the master of your destiny, take destiny by the horns and have fun!`);
		},
		onSwitchOut: function () {
			this.add(`c|@KingSwordYT|I eat when im upset, and i gotta eat`);
		},
		onFaint: function () {
			this.add(`c|@KingSwordYT|BUAAAAAA IYA AYÚDAME :(`);
		},
	},
	level51: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@Level 51|Calculating chance of victory!`);
		},
		onSwitchOut: function () {
			this.add(`c|@Level 51|chance_victory < 1. Recalibrating...`);
		},
		onFaint: function () {
			this.add(`c|@Level 51|**IndexError**: list index out of range`);
		},
	},
	lifeisdank: {
		noCopy: true,
		onStart: function (target) {
			this.add(`c|&LifeisDANK|!!!ლ(⁰⊖⁰ლ) Peent Peent.`);
			this.boost({spe: 2}, target);
		},
		onSwitchOut: function () {
			this.add(`c|&LifeisDANK|!(•⌔• ) Peent Peent.`);
		},
		onFaint: function () {
			this.add(`c|&LifeisDANK|(•⌔•. ) Peent.`);
		},
		// Aerilate innate
		onModifyMovePriority: -1,
		onModifyMove: function (move, pokemon) {
			if (move.type === 'Normal' && !['judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'weatherball'].includes(move.id) && !(move.isZ && move.category !== 'Status')) {
				move.type = 'Flying';
				move.aerilateBoosted = true;
			}
		},
		onBasePowerPriority: 8,
		onBasePower: function (basePower, pokemon, target, move) {
			if (move.aerilateBoosted) return this.chainModify([0x1333, 0x1000]);
		},
	},
	macchaeger: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@MacChaeger|What are you gonna do with that big bat? Gonna hit me? Better make it count. Better make it hurt. Better kill me in one shot.`);
		},
		onFaint: function () {
			this.add(`c|@MacChaeger|im gonna pyuk`);
		},
	},
	martha: {
		noCopy: true,
		onStart: function () {
			this.add(`c|%martha|in to lose r1`);
		},
		onSwitchOut: function () {
			this.add(`c|%martha|bad`);
		},
	},
	marty: {
		noCopy: true,
		// No phrases provided
	},
	megazard: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@Megazard|Almond top of the world!`);
		},
		onSwitchOut: function () {
			this.add(`c|@Megazard|Change of plants`);
		},
		onFaint: function () {
			this.add(`c|@Megazard|Better luck next thyme`);
		},
	},
	mickthespud: {
		noCopy: true,
		onStart: function () {
			this.add(`c|%MicktheSpud|Woah!`);
		},
		onSwitchOut: function () {
			this.add(`c|%MicktheSpud|Woah!`);
		},
		onFaint: function () {
			this.add(`c|%MicktheSpud|Woah!`);
		},
	},
	moo: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@moo|/me moo`);
		},
		onSwitchOut: function () {
			this.add(`c|@moo|/me moo`);
		},
		onFaint: function () {
			this.add(`c|@moo|/me moo`);
		},
	},
	omroom: {
		noCopy: true,
		onStart: function (target, source) {
			source.types = ["Fire", "Fairy"];
			this.add(`c|%OM Room|use shift gear`);
			this.add('-start', source, 'typeadd', 'Fairy');
		},
		onSwitchOut: function () {
			this.add(`c|%OM Room|Ok brb I'm gonna ${["ladder Mix and Mega", "roll battle some surv regs real quick"][this.random(2)]}`);
		},
		onFaint: function () {
			this.add(`c|%OM Room|Oh god I rolled a 1`);
		},
	},
	quitequiet: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@Quite Quiet|spooky :d`);
		},
		onFaint: function () {
			this.add(`c|@Quite Quiet|:'(`);
		},
		onModifyDefPriority: 6,
		onModifyDef: function (def, pokemon) {
			if (!pokemon.transformed) {
				return this.chainModify(2);
			}
		},
		onModifySpDPriority: 6,
		onModifySpD: function (spd, pokemon) {
			if (!pokemon.transformed) {
				return this.chainModify(2);
			}
		},
	},
	shiba: {
		noCopy: true,
		onStart: function () {
			this.add(`c|%Shiba|LINDA IS INDA`);
		},
		onSwitchOut: function () {
			this.add(`c|%Shiba|gotta buy an alt rq brb`);
		},
	},
	teremiare: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@Teremiare|<('o'<)`);
		},
		onFaint: function () {
			this.add(`c|@Teremiare|(>'o')>`);
		},
	},
	theimmortal: {
		noCopy: true,
		onStart: function () {
			this.add(`c|~The Immortal|h-hi`);
		},
		onSwitchOut: function () {
			this.add(`c|~The Immortal|ok`);
		},
		onFaint: function () {
			this.add(`c|~The Immortal|zzz`);
		},
	},
	tiksi: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@Tiksi|Hakkaa päälle! For the King of the Woodland!`);
		},
		onSwitchOut: function () {
			this.add(`c|@Tiksi|TI rigged this ok`);
		},
		onFaint: function (pokemon) {
			this.add(`c|@Tiksi|You rotten ${pokemon.side.foe.name}! I'll send you to the Tiksi branch!`);
		},
	},
	torkool: {
		noCopy: true,
		onStart: function () {
			this.add(`c|%torkool|:peepodetective:`);
		},
		onSwitchOut: function () {
			this.add(`c|%torkool|i cba`);
		},
		onFaint: function () {
			this.add(`c|%torkool|I don't deserve this...`);
		},
	},
	trickster: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@Trickster|(◕‿◕✿)`);
		},
		onSwitchOut: function () {
			this.add(`c|@Trickster|(◠﹏◠✿)`);
		},
		onFaint: function () {
			this.add(`c|@Trickster|(✖﹏✖✿)`);
		},
	},
	yuki: {
		noCopy: true,
		onStart: function () {
			this.add(`c|%Yuki|My ice may be a little __cold__, but your plan has been put completely on __hold__!`);
		},
		onSwitchOut: function () {
			this.add(`c|%Yuki|I-It's too hot in here!`);
		},
		onFaint: function () {
			this.add(`c|%Yuki|I'm melting...`);
		},
	},
	// Custom effect for Yuki
	cutietrap: {
		duration: 5,
		noCopy: true,
		onStart: function (pokemon, source) {
			if (!this.runEvent('Attract', pokemon, source)) {
				this.debug('Attract event failed');
				return false;
			}
			this.add('-start', pokemon, 'Attract', '[from] move: Cutie Trap', '[of] ' + source);
			this.add('-message', `${pokemon.name} was trapped by love!`);
		},
		onBeforeMovePriority: 2,
		onBeforeMove: function (pokemon, target, move) {
			this.add('-activate', pokemon, 'move: Attract', '[of] ' + this.effectData.source);
			if (this.randomChance(1, 2)) {
				this.add('cant', pokemon, 'Attract');
				return false;
			}
		},
		onTrapPokemon: function (pokemon) {
			pokemon.tryTrap();
		},
		onEnd: function (pokemon) {
			this.add('-end', pokemon, 'Attract', '[silent]');
			this.add('-message', `${pokemon.name} is no longer trapped by love.`);
		},
	},
	// Modified hail for Yuki
	hail: {
		inherit: true,
		onStart: function (battle, source, effect) {
			if (effect && effect.effectType === 'Ability') {
				if (this.gen <= 5 || effect.id === 'snowstorm') this.effectData.duration = 0;
				this.add('-weather', 'Hail', '[from] ability: ' + effect, '[of] ' + source);
			} else {
				this.add('-weather', 'Hail');
			}
		},
	},
};

exports.BattleStatuses = BattleStatuses;
