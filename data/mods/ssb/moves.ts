import {ssbSets} from "./random-teams";
import {changeSet, getName} from "./scripts";
import {Teams} from '../../../sim/teams';

export const Moves: {[k: string]: ModdedMoveData} = {
	/*
	// Example
	moveid: {
		accuracy: 100, // a number or true for always hits
		basePower: 100, // Not used for Status moves, base power of the move, number
		category: "Physical", // "Physical", "Special", or "Status"
		desc: "", // long description
		shortDesc: "", // short description, shows up in /dt
		name: "Move Name",
		gen: 8,
		pp: 10, // unboosted PP count
		priority: 0, // move priority, -6 -> 6
		flags: {}, // Move flags https://github.com/smogon/pokemon-showdown/blob/master/data/moves.js#L1-L27
		onTryMove() {
			this.attrLastMove('[still]'); // For custom animations
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Move Name 1', source);
			this.add('-anim', source, 'Move Name 2', source);
		}, // For custom animations
		secondary: {
			status: "tox",
			chance: 20,
		}, // secondary, set to null to not use one. Exact usage varies, check data/moves.js for examples
		target: "normal", // What does this move hit?
		// normal = the targeted foe, self = the user, allySide = your side (eg light screen), foeSide = the foe's side (eg spikes), all = the field (eg raindance). More can be found in data/moves.js
		type: "Water", // The move's type
		// Other useful things
		noPPBoosts: true, // add this to not boost the PP of a move, not needed for Z moves, dont include it otherwise
		isZ: "crystalname", // marks a move as a z move, list the crystal name inside
		zMove: {effect: ''}, // for status moves, what happens when this is used as a Z move? check data/moves.js for examples
		zMove: {boost: {atk: 2}}, // for status moves, stat boost given when used as a z move
		critRatio: 2, // The higher the number (above 1) the higher the ratio, lowering it lowers the crit ratio
		drain: [1, 2], // recover first num / second num % of the damage dealt
		heal: [1, 2], // recover first num / second num % of the target's HP
	},
	*/
	// Please keep sets organized alphabetically based on staff member name!
	// Aeonic
	memesthatburnthesky: {
		accuracy: 100,
		basePower: 140,
		category: "Special",
		shortDesc: "No additional effect.",
		name: "Memes That Burn The Sky",
		gen: 9,
		pp: 5,
		priority: 0,
		flags: {protect: 1, recharge: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[anim] Light That Burns The Sky');
			this.attrLastMove('[anim] Rock Wrecker');
		},
		secondary: null,
		target: "normal",
		type: "Rock",
	},

	// A Quag To The Past
	sireswitch: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Quag: Protect; Clod: Recover. Switch to other sire.",
		name: "Sire Switch",
		gen: 9,
		pp: 20,
		priority: 4,
		onModifyPriority(relayVar, source, target, move) {
			if (source.species.name === 'Clodsire') {
				return -6;
			}
		},
		flags: {},
		onPrepareHit(pokemon) {
			this.attrLastMove('[anim] Max Guard');
			if (pokemon.species.name === 'Quagsire') {
				this.attrLastMove('[anim] Protect');
				return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
			} else {
				this.attrLastMove('[anim] Recover');
			}
		},
		secondary: null,
		volatileStatus: 'sireswitch',
		onHit(pokemon) {
			if (pokemon.species.name === 'Quagsire') {
				pokemon.addVolatile('stall');
				changeSet(this, pokemon, ssbSets['A Quag To The Past-Clodsire'], true);
			} else {
				this.heal(pokemon.maxhp / 2, pokemon, pokemon, this.effect);
				changeSet(this, pokemon, ssbSets['A Quag To The Past'], true);
			}
		},
		condition: {
			duration: 1,
			onStart(target) {
				if (target.species.name !== 'Quagsire') return;
				this.add('-singleturn', target, 'Protect');
			},
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				if (target.species.name !== 'Quagsire') return;
				if (!move.flags['protect']) {
					if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id)) return;
					if (move.isZ || move.isMax) target.getMoveHitData(move).zBrokeProtect = true;
					return;
				}
				if (move.smartTarget) {
					move.smartTarget = false;
				} else {
					this.add('-activate', target, 'move: Protect');
				}
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				return this.NOT_FAIL;
			},
		},
		target: "self",
		type: "Ground",
	},

	// BreadLoeuf
	bakersdouzeoff: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "User wakes up, then switches out.",
		name: "Baker's Douze Off",
		gen: 9,
		pp: 15,
		priority: 0,
		flags: {},
		sleepUsable: true,
		onTry(pokemon) {
			return !!this.canSwitch(pokemon.side);
		},
		onPrepareHit(pokemon) {
			this.attrLastMove('[anim] Teleport');
			if (pokemon.status === 'slp') pokemon.cureStatus();
		},
		selfSwitch: true,
		secondary: null,
		target: "self",
		type: "Normal",
	},

	// Irpachuza
	bibbidibobbidirands: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Changes target to a Randbats set.",
		name: "Bibbidi-Bobbidi-Rands",
		gen: 9,
		pp: 1,
		priority: 0,
		flags: {protect: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[anim] Doom Desire');
		},
		onHit(target) {
			const formats = ['gen9randombattle', 'gen9hackmonscup', 'gen9challengecup', 'gen9computergeneratedteams'];
			const randFormat = this.sample(formats);
			let msg;
			switch (randFormat) {
			case 'gen9randombattle':
				msg = "Ta-dah! You are now blessed with a set from the most popular format on the sim, hope you like it! n.n";
				break;
			case 'gen9hackmonscup':
				msg = "Hackmons Cup is like Rands but scrambled eggs, cheese and pasta. I'm sure you'll love it too n.n";
				break;
			case 'gen9challengecup':
				msg = "The only difference between a Challenge Cup Pokémon and my in-game one is that the former actually surpassed lvl. 60, enjoy n.n";
				break;
			case 'gen9computergeneratedteams':
				msg = "We asked an AI to make a randbats set. YOU WON'T BELIEVE WHAT IT CAME UP WITH N.N";
				break;
			}
			// TODO: ban mons with custom stats
			const team = Teams.generate(randFormat, {name: target.side.name});
			this.addMove('-anim', target, 'Wish', target);
			// @ts-ignore set wants a sig but randbats sets don't have one
			changeSet(this, target, team[0], true);
			this.add(`c:|${getName('Irpachuza!')}|${msg}`);
		},
		isZ: "irpatuziniumz",
		secondary: null,
		target: "normal",
		type: "Fairy",
	},

	// Kennedy
	hattrick: {
		accuracy: 98,
		basePower: 19,
		category: "Physical",
		shortDesc: "3 hits. Last always crits. 3.5% chance to curse.",
		name: "Hat-Trick",
		gen: 9,
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Focus Energy', source);
			this.add('-anim', source, 'High Jump Kick', target);
			this.add('-anim', target, 'Boomburst', source);
			this.add('-anim', source, 'Aqua Step', target);
			this.add('-anim', source, 'Aqua Step', target);
		},
		onHit(target, source, move) {
			if (move.hit === 3) {
				move.willCrit = true;
			}
		},
		secondary: {
			chance: 3.5,
			volatileStatus: 'curse',
		},
		multihit: 3,
		target: "normal",
		type: "Ice",
	},
	anfieldatmosphere: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Anfield Atmosphere",
		pp: 5,
		priority: 0,
		flags: {mirror: 1},
		pseudoWeather: 'anfieldatmosphere',
		condition: {
			duration: 6,
			durationCallback(source, effect) {
				if (source?.hasAbility('persistent')) {
					this.add('-activate', source, 'ability: Persistent', '[move] Anfield Atmosphere');
					return 8;
				}
				return 6;
			},
			onFieldStart(target, source) {
				if (source?.hasAbility('persistent')) {
					this.add('-fieldstart', 'move: Anfield Atmosphere', '[of] ' + source, '[persistent]');
				} else {
					this.add('-fieldstart', 'move: Anfield Atmosphere', '[of] ' + source);
				}
			},
			onFieldRestart(target, source) {
				this.field.removePseudoWeather('anfieldatmosphere');
			},
			onAnySetWeather(target, source, weather) {
				return false;
			},
			onSetStatus(status, target, source, effect) {
				if (status.id === 'slp' && !target.isSemiInvulnerable()) {
					this.add('-activate', target, 'move: Anfield Terrain');
					return false;
				}
				for (const pokemon of this.getAllActive()) {
					if (!pokemon.hp || pokemon.fainted) continue;
					pokemon.trySetStatus(status, source, this.effect);
				}
			},
			onTryAddVolatile(status, target) {
				if (target.isSemiInvulnerable()) return;
				if (status.id === 'yawn') {
					this.add('-activate', target, 'move: Anfield Terrain');
					return null;
				}
			},
			onDamage(damage, target, source, effect) {
				if (effect && ['stealthrock', 'spikes', 'gmaxsteelsurge'].includes(effect.id)) {
					return damage / 2;
				}
			},
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 1,
			onFieldEnd() {
				this.add('-fieldend', 'move: Anfield Atmosphere');
			},
		},
		secondary: null,
		target: "all",
		type: "Psychic",
	},

	// Kris
	ok: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "20% Atk -> SpA/Spe; else SpA boosts -> other stats.",
		name: "ok",
		gen: 9,
		pp: 15,
		priority: 4,
		flags: {},
		stallingMove: true,
		volatileStatus: 'protect',
		// TODO move anims
		onPrepareHit(pokemon) {
			return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
		},
		onHit(pokemon) {
			pokemon.addVolatile('stall');
			if (this.random(100) > 20) {
				if (!pokemon.boosts['spa'] || pokemon.boosts['spa'] < 0) return null;
				const spaBoosts = pokemon.boosts['spa'];
				let modifiableSpaBoosts = spaBoosts;
				const randomStat: SparseBoostsTable = {};
				while (modifiableSpaBoosts > 0) {
					const randomStatID: BoostID = this.sample(['atk', 'def', 'spd', 'spe']);
					if (!randomStat[randomStatID]) randomStat[randomStatID] = 0;
					randomStat[randomStatID]! += 1;
					modifiableSpaBoosts -= 1;
				}
				this.boost({spa: -spaBoosts, ...randomStat}, pokemon, pokemon, this.effect);
			} else {
				if (!pokemon.volatiles['ok']) pokemon.addVolatile('ok');
			}
		},
		condition: {
			noCopy: true,
			onStart(pokemon) {
				this.add('-start', pokemon, 'ok');
				this.effectState.atk = pokemon.storedStats.atk;
				this.effectState.spa = pokemon.storedStats.spa;
				this.effectState.spe = pokemon.storedStats.spe;
				pokemon.storedStats.spa = Math.floor(pokemon.storedStats.atk / 10) + pokemon.storedStats.spa;
				pokemon.storedStats.spe = Math.floor(pokemon.storedStats.atk * 9 / 10) + pokemon.storedStats.spe;
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'ok');
				pokemon.storedStats.spa = this.effectState.spa;
				pokemon.storedStats.spe = this.effectState.spe;
			},
			onRestart(pokemon) {
				pokemon.removeVolatile('ok');
			},
		},
		secondary: null,
		target: "self",
		type: "Fairy",
	},

	// Mad Monty
	stormshelter: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Storm Shelter",
		shortDesc: "User protects and sets up a substitute.",
		pp: 5,
		priority: 4,
		flags: {},
		stallingMove: true,
		volatileStatus: 'protect',
		onPrepareHit(pokemon) {
			this.attrLastMove('[anim] Protect');
			return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
		},
		onHit(pokemon) {
			pokemon.addVolatile('stall');
			if (!pokemon.volatiles['substitute']) {
				if (pokemon.hp <= pokemon.maxhp / 4 || pokemon.maxhp === 1) { // Shedinja clause
					this.add('-fail', pokemon, 'move: Substitute', '[weak]');
				} else {
					pokemon.addVolatile('substitute');
					this.directDamage(pokemon.maxhp / 4);
				}
			}
			if (!Object.values(pokemon.boosts).some(x => x >= 6)) {
				this.boost({atk: 1, def: 1, spa: 1, spd: 1, spe: 1, accuracy: 1, evasion: 1}, pokemon);
				this.add(`c:|${getName('Mad Monty')}|Ope! Wrong button, sorry.`);
				this.boost({atk: -1, def: -1, spa: -1, spd: -1, spe: -1, accuracy: -1, evasion: -1}, pokemon);
			}
		},
		secondary: null,
		target: "self",
		type: "Normal",
	},

	// Mia
	testinginproduction: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Testing in Production",
		gen: 9,
		pp: 5,
		priority: 0,
		flags: {},
		onPrepareHit() {
			this.attrLastMove('[anim] Curse');
		},
		onHit(pokemon) {
			this.add(`c:|${getName('Mia')}|Please don't break...`);
			let stats: BoostID[] = [];
			const boost: SparseBoostsTable = {};
			let statPlus: BoostID;
			for (statPlus in pokemon.boosts) {
				if (statPlus === 'accuracy' || statPlus === 'evasion') continue;
				if (pokemon.boosts[statPlus] < 6) {
					stats.push(statPlus);
				}
			}
			let randomStat: BoostID | undefined = stats.length ? this.sample(stats) : undefined;
			if (randomStat) boost[randomStat] = 2;

			stats = [];
			let statMinus: BoostID;
			for (statMinus in pokemon.boosts) {
				if (statMinus === 'accuracy' || statMinus === 'evasion') continue;
				if (pokemon.boosts[statMinus] > -6) {
					stats.push(statMinus);
				}
			}
			randomStat = stats.length ? this.sample(stats) : undefined;
			if (randomStat) {
				if (boost[randomStat]) {
					boost[randomStat] = 0;
					this.add(`c:|${getName('Mia')}|Well. Guess that broke. Time to roll back.`);
					return;
				} else {
					boost[randomStat] = -2;
				}
			}

			this.boost(boost, pokemon, pokemon);
		},
		onAfterMove(pokemon) {
			if (this.randomChance(1, 10)) {
				this.add(`c:|${getName('Mia')}|Ouch! That crash is really getting on my nerves...`);
				this.damage(pokemon.baseMaxhp / 10);
				if (pokemon.hp <= 0) return;
			}

			if (this.randomChance(1, 20)) {
				const status = this.sample(['frz', 'brn', 'psn', 'par']);
				let statusText = status;
				if (status === 'frz') {
					statusText = 'froze';
				} else if (status === 'brn') {
					statusText = 'burned';
				} else if (status === 'par') {
					statusText = 'paralyzed';
				} else if (status === 'psn') {
					statusText = 'poisoned';
				}

				this.add(
					`c:|${getName('Mia')}|` +
					`Darn. A bug ${statusText} me. Guess I should have tested this first.`
				);
				pokemon.setStatus(status);
			}
		},
		secondary: null,
		target: "self",
		type: "Electric",
	},

	// phoopes
	gen1blizzard: {
		accuracy: 90,
		basePower: 120,
		category: "Special",
		name: "Gen 1 Blizzard",
		desc: "Has a 10% chance to freeze the target.",
		shortDesc: "10% chance to freeze the target.",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit() {
			this.attrLastMove('[anim] Blizzard');
		},
		secondary: {
			chance: 10,
			status: 'frz',
		},
		target: "normal",
		type: "Ice",
	},

	// Scotteh
	purification: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Purification",
		pp: 5,
		priority: 0,
		flags: {heal: 1, bypasssub: 1, allyanim: 1},
		onPrepareHit() {
			this.attrLastMove('[anim] Moonlight');
		},
		onHit(pokemon) {
			const success = !!this.heal(this.modify(pokemon.maxhp, 0.5));
			return pokemon.cureStatus() || success;
		},
		secondary: null,
		target: "self",
		type: "Water",
	},

	// sharp_claw
	treacheroustraversal: {
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		shortDesc: "Clears hazards, sets spikes, and pivots out.",
		name: "Treacherous Traversal",
		gen: 9,
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Defog', source);
			this.add('-anim', source, 'Extreme Speed', target);
		},
		selfSwitch: true,
		self: {
			onHit(source) {
				for (const side of source.side.foeSidesWithConditions()) {
					if (source.species.name === 'Sneasel') {
						side.addSideCondition('spikes');
					} else {
						side.addSideCondition('toxicspikes');
					}
				}
			},
		},
		secondary: {}, // allows sheer force to trigger
		target: "normal",
		type: "Rock",
	},

	// TheJesucristoOsAma
	theloveofchrist: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		shortDesc: "Attracts and confuses the target.",
		name: "The Love Of Christ",
		gen: 9,
		pp: 1,
		noPPBoosts: true,
		priority: 0,
		flags: {protect: 1},
		onPrepareHit() {
			this.attrLastMove('[anim] Morning Sun');
			this.attrLastMove('[anim] Lovely Kiss');
		},
		onHit(target, source) {
			target.addVolatile('attract', source);
			target.addVolatile('confusion', source);
		},
		secondary: null,
		target: "normal",
		type: "Normal",
	},

	// snake_rattler
	conceptrelevant: {
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		shortDesc: "Psn + clears hazards, sets spikes, then switches out.",
		name: "Concept Relevant",
		gen: 9,
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.attrLastMove('[anim] Mortal Spin');
			this.attrLastMove('[anim] Spikes');
			this.attrLastMove('[anim] U-turn');
		},
		onAfterHit(target, pokemon) {
			if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
				this.add('-end', pokemon, 'Leech Seed', '[from] move: Concept Relevant', '[of] ' + pokemon);
			}
			const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
			for (const condition of sideConditions) {
				if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
					this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] move: Concept Relevant', '[of] ' + pokemon);
				}
			}
			if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
				pokemon.removeVolatile('partiallytrapped');
			}
			target.side.addSideCondition('spikes');
		},
		onAfterSubDamage(damage, target, pokemon) {
			if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
				this.add('-end', pokemon, 'Leech Seed', '[from] move: Concept Relevant', '[of] ' + pokemon);
			}
			const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
			for (const condition of sideConditions) {
				if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
					this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] move: Concept Relevant', '[of] ' + pokemon);
				}
			}
			if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
				pokemon.removeVolatile('partiallytrapped');
			}
			target.side.addSideCondition('spikes');
		},
		secondary: {
			chance: 100,
			status: 'psn',
		},
		selfSwitch: true,
		target: "normal",
		type: "Bug",
	},

	// trace
	chronostasis: {
		accuracy: 90,
		basePower: 80,
		category: "Special",
		shortDesc: "If target is KOed, user boosts a random stat by 2.",
		name: "Chronostasis",
		gen: 9,
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit() {
			this.attrLastMove('[anim] Future Sight');
		},
		onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) {
				const stats: BoostID[] = [];
				let stat: BoostID;
				for (stat in target.boosts) {
					if (stat === 'accuracy' || stat === 'evasion') continue;
					if (target.boosts[stat] < 6) {
						stats.push(stat);
					}
				}
				if (stats.length) {
					const randomStat = this.sample(stats);
					this.boost({[randomStat]: 2}, pokemon, pokemon, move);
				}
			}
		},
		secondary: null,
		target: "normal",
		type: "Psychic",
	},

	// UT
	wingover: {
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		shortDesc: "Damages foe and pivots out.",
		name: "Wingover",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit() {
			this.attrLastMove('[anim] U-turn');
		},
		selfSwitch: true,
		secondary: null,
		target: "normal",
		type: "Flying",
	},

	// zee
	solarsummon: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		shortDesc: "Sets up Sunny Day and creates a Substitute.",
		name: "Solar Summon",
		gen: 9,
		pp: 5,
		priority: 0,
		flags: {},
		onPrepareHit() {
			this.attrLastMove('[anim] Sunny Day');
		},
		onHit(pokemon) {
			let success = false;
			if (this.field.setWeather('sunnyday')) success = true;
			if (!pokemon.volatiles['substitute']) {
				if (pokemon.hp <= pokemon.maxhp / 4 || pokemon.maxhp === 1) { // Shedinja clause
					this.add('-fail', pokemon, 'move: Substitute', '[weak]');
				} else {
					pokemon.addVolatile('substitute');
					this.directDamage(pokemon.maxhp / 4);
					success = true;
				}
			}
			return success;
		},
		secondary: null,
		target: "self",
		type: "Fire",
	},
};
