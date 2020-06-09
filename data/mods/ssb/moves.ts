import {getName} from './statuses';

export const BattleMovedex: {[k: string]: ModdedMoveData} = {
	/*
	// Example
	moveid: {
		accuracy: 100, // a number or true for always hits
		basePower: 100, // Not used for Status moves, base power of the move, number
		category: "Physical", // "Physical", "Special", or "Status"
		desc: "", // long description
		shortDesc: "", // short description, shows up in /dt
		name: "Move Name",
		pp: 10, // unboosted PP count
		priority: 0, // move priority, -6 -> 6
		flags: {}, // Move flags https://github.com/smogon/pokemon-showdown/blob/master/data/moves.js#L1-L27
		onTryMovePriority: 100,
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
	// Aethernum
	lilypadoverflow: {
		accuracy: 100,
		basePower: 60,
		basePowerCallback(source, target, move) {
			if (!source.volatiles['raindrop'] || !source.volatiles['raindrop'].layers) return move.basePower;
			return move.basePower + (source.volatiles['raindrop'].layers * 20);
		},
		category: "Special",
		desc: "Power is equal to 60 + (Number of Raindrops collected * 20). Whether or not this move is successful, the user's Defense and Special Defense decrease by as many stages as Raindrop had increased them, and the user's Raindrop count resets to 0.",
		shortDesc: "More power with more collected Raindrops.",
		name: "Lilypad Overflow",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMovePriority: 100,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Water Spout', target);
			this.add('-anim', source, 'Max Geyser', target);
		},
		onAfterMove(pokemon) {
			if (pokemon.volatiles['raindrop']) pokemon.removeVolatile('raindrop');
		},
		secondary: null,
		target: "normal",
		type: "Water",
	},

	// cant say
	neverlucky: {
		accuracy: 85,
		basePower: 110,
		category: "Special",
		desc: "Doubles base power if statused. Has a 10% chance to boost every stat 1 stage. High Crit Ratio.",
		shortDesc: "Doubles base power if statused. Has a 10% chance to boost every stat 1 stage. High Crit Ratio.",
		name: "Never Lucky",
		pp: 10,
		priority: 0,
		flags: {protect: 1},
		onTryMovePriority: 100,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Overheat', target);
		},
		onBasePower(basePower, pokemon) {
			if (pokemon.status && pokemon.status !== 'slp') {
				return this.chainModify(2);
			}
		},
		secondary: {
			chance: 10,
			self: {
				boosts: {
					atk: 1,
					def: 1,
					spa: 1,
					spd: 1,
					spe: 1,
				},
			},
		},
		critRatio: 2,
		target: "normal",
		type: "Fire",
	},

	// Darth
	archangelsrequiem: {
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "This move type is always the user's secondary typing. If this move is successful, both the target and the user ar forced out, and the user's replacement gets 1/3 of its maximum health restored.",
		shortDesc: "Type=2nd type,both mons switch,replacement: heal.",
		name: "Archangel's Requiem",
		pp: 10,
		priority: -5,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Roost', source);
			this.add('-anim', source, 'Whirlwind', target);
			this.add('-anim', source, 'Whirlwind', source);
		},
		onModifyType(move, pokemon) {
			let type = pokemon.types[1] ? pokemon.types[1] : pokemon.types[0];
			move.type = type;
		},
		onHit(target, source, move) {
			if (source && source !== target && target.hp) {
				if (!this.canSwitch(target.side) || target.forceSwitchFlag) return;
					if (source.switchFlag === true) return;
					target.switchFlag = true;
			}
		},
		effect: {
			onSwap(target) {
				if (!target.fainted && target.hp < target.maxhp) {
					target.heal(target.maxhp);
					this.add('-heal', target, 33, '[from] move: Archangel\'s Requiem')
				}
			},
		},
		selfSwitch: true,
		target: "normal", 
		type: "Normal", 
	},

	// drampa's grandpa
	getoffmylawn: {
		accuracy: 100,
		basePower: 78,
		category: "Special",
		desc: "If this move is successful and the user has not fainted, the user switches out even if it is trapped and is replaced immediately by a selected party member. The user does not switch out if there are no unfainted party members, or if the target switched out using an Eject Button or through the effect of the Emergency Exit or Wimp Out Abilities.",
		shortDesc: "User switches out after damaging the target.",
		name: "GET OFF MY LAWN!",
		pp: 10,
		priority: -6,
		flags: {protect: 1, sound: 1, authentic: 1},
		onTryMovePriority: 100,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Boomburst', target);
		},
		onHit() {
			this.add(`c|${getName('drampa\'s grandpa')}|GET OFF MY LAWN!!!`);
		},
		secondary: null,
		selfSwitch: true,
		target: "normal",
		type: "Normal",
	},

	// Elgino
	navisgrace: {
		accuracy: 100,
		basePower: 90,
		category: "Special",
		desc: "This move is super effective on Steel- and Poison-type Pokemon.",
		shortDesc: "Super effective on Steel and Poison types.",
		name: "Navi's Grace",
		pp: 15,
		priority: 0,
		flags: {protect: 1},
		secondary: null,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Dazzling Gleam', target);
			this.add('-anim', source, 'Earth Power', target);
		},
		onEffectiveness(typeMod, target, type) {
			if (type === 'Poison' || type === 'Steel') return 1;
		},
		target: 'normal',
		type: 'Fairy',
	},

	// Flare
	krisenbon: {
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		desc: "If the target is a Flying type that has not used Roost this turn or a Pokemon with the Levitate Ability, it loses its immunity to Ground-type attacks and the Arena Trap Ability as long as it remains active. This move's type effectiveness against Water is changed to be neutral no matter what this move's type is.",
		shortDesc: "Grounds target. Neutral on Water.",
		name: "Kōri Senbon",
		pp: 5,
		priority: 1,
		flags: {protect: 1, mirror: 1, nonsky: 1},
		volatileStatus: 'smackdown',
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Ice Shard', target);
		},
		onEffectiveness(typeMod, target, type) {
			if (type === 'Water') return 0;
		},
		secondary: null,
		target: "normal",
		type: "Ice",
	},

	// frostyicelad
	frostywave: {
		accuracy: 100,
		basePower: 95,
		category: "Special",
		desc: "This move and its effects ignore the Abilities of other Pokemon.",
		shortDesc: "Ignores abilities. Hits adjacent opponents.",
		name: "Frosty Wave",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1, authentic: 1},
		ignoreAbility: true,
		onTryMovePriority: 100,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Boomburst', target);
			this.add('-anim', source, 'Blizzard', target);
		},
		secondary: null,
		target: "allAdjacentFoes",
		type: "Ice",
	},

	// GXS
	datacorruption: {
		accuracy: 90,
		basePower: 110,
		category: "Special",
		desc: "Has a 30% chance to randomly lower one of the target's stats by 1 stage.",
		shortDesc: "30% chance to randomly lower a foe's stat.",
		name: "Data Corruption",
		pp: 5,
		priority: 0,
		flags: {protect: 1},
		secondary: {
			chance: 30,
			onHit(target) {
				const stats: BoostName[] = [];
				let stat: BoostName;
				for (stat in target.boosts) {
					if (stat === 'evasion' || stat === 'accuracy') continue;
					if (target.boosts[stat] > -6) {
						stats.push(stat);
					}
				}
				if (stats.length) {
					const randomStat = this.sample(stats);
					const boost: SparseBoostsTable = {};
					boost[randomStat] = -1;
					this.boost(boost);
				} else {
					return false;
				}
			},
		},
		target: "normal",
		type: "Normal",
	},

	// Instruct
	hypergoner: {
		accuracy: 85,
		basePower: 130,
		category: "Physical",
		desc: "Always Super Effective. Will leave opponent on 1 HP.",
		shortDesc: "Always Super Effective. Will leave opponent on 1 HP.",
		name: "Hyper Goner",
		pp: 5,
		priority: 0,
		flags: {protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Prismatic Laser', target);
		},
		onEffectiveness(typeMod, target, type) {
			return 1;
		},
		noFaint: true,
		secondary: null,
		target: "normal",
		type: "???",
	},

	// Kaiju Bunny
	cozycuddle: {
		accuracy: 95,
		basePower: 0,
		category: "Status",
		desc: "Traps the target and lowers its Attack and Defense by two stages.",
		shortDesc: "Target: trapped, Atk and Def lowered by 2.",
		name: "Cozy Cuddle",
		pp: 20,
		priority: 0,
		flags: {},
		volatileStatus: 'cozycuddle',
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onTryHit(target, source, move) {
			if (target.volatiles['cozycuddle']) return false;
			if (target.volatiles['trapped']) {
				delete move.volatileStatus;
			}
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Flatter', target);
			this.add('-anim', source, 'Let\'s Snuggle Forever', target);
		},
		onHit(target, source, move) {
			this.boost({atk: -2, def: -2}, target, target);
		},
		effect: {
			onStart(pokemon, source) {
				this.add('-start', pokemon, 'move: Cozy Cuddle', '[of]' + source.name);
			},
			onTrapPokemon(pokemon) {
				if (this.effectData.source?.isActive) pokemon.tryTrap();
			},
		},
		secondary: null,
		target: "normal",
		type: "Fairy",
	},

	// Jho
	genrechange: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "If the user is a Toxtricity, it changes into its Low-Key forme and Nasty Plot and Overdrive change to Aura Sphere and Boomburst, respectively. If the user is a Toxtricity in its Low-Key forme, it changes into its Amped forme and Aura Sphere and Boomburst turn into Nasty Plot and Overdrive, respectively. Raises the user's Speed by 1 stage.",
		shortDesc: "Toxtricity: +1 Speed. Changes forme.",
		name: "Genre Change",
		pp: 5,
		priority: 0,
		flags: {sound: 1},
		onTryMove(pokemon, target, move) {
			this.attrLastMove('[still]');
			if (pokemon.species.baseSpecies === 'Toxtricity') {
				return;
			}
			this.add('-fail', pokemon, 'move: Genre Change');
			this.hint("Only a Pokemon whose form is Toxtricity or Toxtricity-Low-Key can use this move.");
			return null;
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Screech', source);
			// The transform animation is done via `formeChange`
		},
		onHit(pokemon) {
			if (pokemon.species.forme === 'Low-Key') {
				pokemon.formeChange(`toxtricity`, this.effect);
				pokemon.moveSlots = pokemon.moveSlots.map(slot => {
					const newMoves: {[k: string]: string} = {
						boomburst: 'overdrive',
						aurasphere: 'nastyplot',
					};
					if (slot.id in newMoves) {
						const move = this.dex.getMove(newMoves[slot.id]);
						const newSlot = {
							id: move.id,
							move: move.name,
							// Luckily, both slots have the same number of PP
							pp: slot.pp,
							maxpp: move.pp * 8 / 5,
							disabled: slot.disabled,
							used: false,
						};
						return newSlot;
					}
					return slot;
				});
			} else {
				pokemon.formeChange(`toxtricitylowkey`, this.effect);
				pokemon.setAbility('venomize');
				pokemon.moveSlots = pokemon.moveSlots.map(slot => {
					const newMoves: {[k: string]: string} = {
						overdrive: 'boomburst',
						nastyplot: 'aurasphere',
					};
					if (slot.id in newMoves) {
						const move = this.dex.getMove(newMoves[slot.id]);
						const newSlot = {
							id: move.id,
							move: move.name,
							// Luckily, both slots have the same number of PP
							pp: slot.pp,
							maxpp: move.pp * 8 / 5,
							disabled: slot.disabled,
							used: false,
						};
						return newSlot;
					}
					return slot;
				});
			}
		},
		boosts: {
			spe: 1,
		},
		secondary: null,
		target: "self",
		type: "Normal",
	},

	// Kris
	ebhewbnjgwegaer: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user changes into a random Pokemon with a first name letter that matches the forme Unown is currently in (A -> Alakazam, etc) that has base stats that would benefit from Unown's EV/IV/Nature spread and moves. Using it while in a forme that is not Unown will make it revert back to the Unown forme it transformed in (If an Unown transforms into Alakazam, it'll transform back to Unown-A when used again). Light of Ruin becomes Strange Steam, Psystrike becomes Psyshock, Secret Sword becomes Aura Sphere, Mind Blown becomes Flamethrower, and Seed Flare becomes Apple Acid while in a non-Unown forme.",
		shortDesc: "Transform into Unown. Unown: Transform into mon.",
		name: "ebhewbnjgWEGAER",
		pp: 20,
		priority: 0,
		flags: {},
		onTryMovePriority: 100,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'All-Out Pummeling', source);
			this.add('-anim', source, 'Perish Song', source);
			this.add('-anim', source, 'Roar of Time', source);
		},
		onHit(target) {
			if (!target) return;
			if (target.species.id.startsWith('unown')) {
				const monList = Object.keys(this.dex.data.Pokedex).filter(speciesid => {
					const species = this.dex.getSpecies(speciesid);
					if (species.isGigantamax) return false;
					if (species.id.startsWith('unown')) return false;
					if (species.isNonstandard === 'Unobtainable') return false;
					if (['Arceus', 'Silvally'].includes(species.baseSpecies) && species.types[0] !== 'Normal') return false;
					if (species.baseStats.spa < 80) return false;
					if (species.baseStats.spe < 80) return false;
					const unownLetter = target.species.id.charAt(5) || 'a';
					if (!species.id.startsWith(unownLetter.trim().toLowerCase())) return false;
					return true;
				});
				target.formeChange(this.sample(monList), this.effect, true);
				target.setAbility('Protean');
				target.moveSlots = target.moveSlots.map(slot => {
					const newMoves: {[k: string]: string} = {
						lightofruin: 'strangesteam',
						psystrike: 'psyshock',
						secretsword: 'aurasphere',
						mindblown: 'flamethrower',
						seedflare: 'appleacid',
					};
					if (slot.id in newMoves) {
						const newMove = this.dex.getMove(newMoves[slot.id]);
						const newSlot = {
							id: newMove.id,
							move: newMove.name,
							pp: newMove.pp * 8 / 5,
							maxpp: newMove.pp * 8 / 5,
							disabled: slot.disabled,
							used: false,
						};
						return newSlot;
					}
					return slot;
				});
			} else {
				let transformingLetter = target.species.id[0];
				if (transformingLetter === 'a') transformingLetter = '';
				target.formeChange(`unown${transformingLetter}`, this.effect, true);
				target.moveSlots = target.moveSlots.map(slot => {
					const newMoves: {[k: string]: string} = {
						strangesteam: 'lightofruin',
						psyshock: 'psystrike',
						aurasphere: 'secretsword',
						flamethrower: 'mindblown',
						appleacid: 'seedflare',
					};
					if (slot.id in newMoves) {
						const newMove = this.dex.getMove(newMoves[slot.id]);
						const newSlot = {
							id: newMove.id,
							move: newMove.name,
							pp: newMove.pp * 8 / 5,
							maxpp: newMove.pp * 8 / 5,
							disabled: slot.disabled,
							used: false,
						};
						return newSlot;
					}
					return slot;
				});
			}
		},
		secondary: null,
		target: "self",
		type: "Bird",
	},

	// Majorbowman
	corrosivecloud: {
		accuracy: true,
		basePower: 90,
		category: "Special",
		desc: "Has a 30% chance to burn the target. This move's type effectiveness against Steel is changed to be super effective no matter what this move's type is.",
		shortDesc: "30% chance to burn. Super effective on Steel.",
		name: "Corrosive Cloud",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Poison Gas', target);
			this.add('-anim', source, 'Fire Spin', target);
		},
		onEffectiveness(typeMod, target, type) {
			if (type === 'Steel') return 1;
		},
		ignoreImmunity: {'Poison': true},
		secondary: {
			chance: 30,
			status: 'brn',
		},
		target: "normal",
		type: "Poison",
	},

	// Mitsuki
	terraforming: {
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		desc: "Upon use, this move sets up Stealth Rock on the target's side of the field, as well as setting up Grassy Terrain.",
		shortDesc: "Sets up Grassy Terrain and Stealth Rock.",
		name: "Terraforming",
		pp: 15,
		priority: 0,
		flags: {protect: 1},
		onTryMovePriority: 100,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Rock Slide', target);
			this.add('-anim', source, 'Ingrain', target);
			this.add('-anim', source, 'Stealth Rock', target);
		},
		terrain: 'grassyterrain',
		sideCondition: 'stealthrock',
		secondary: null,
		target: "normal",
		type: "Rock",
	},

	// OM~!
	mechomnism: {
		accuracy: 95,
		basePower: 90,
		category: "Special",
		desc: "Heals 33% of damage dealt. 15% chance to raise Special Attack by 1 stage.",
		shortDesc: "Heals 33% of damage dealt. 15% chance to raise SpA by 1.",
		name: "MechOMnism",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, heal: 1},
		drain: [1, 3],
		onTryMovePriority: 100,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Mirror Shot', target);
			this.add('-anim', source, 'Refresh', source);
		},
		secondary: {
			chance: 15,
			self: {
				boosts: {
					spa: 1,
				},
			},
		},
		target: "normal",
		type: "Steel",
	},

	// Overneat
	healingyou: {
		accuracy: 100,
		basePower: 117,
		category: "Physical",
		desc: "Heals foe 50% and eliminates any status problem but it lowers Defense and Special Defense stat by 1 stage, then proceeds to attack the foe.",
		shortDesc: "Heals foe and gets rid of their status but the foe's Def and SpD by 1, attacks the foe.",
		name: "Healing you?",
		pp: 5,
		priority: 0,
		onTryMovePriority: 100,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Heal Pulse', target);
			this.heal(Math.ceil(target.baseMaxhp * 0.5));
			target.cureStatus();
			this.boost({def: -1, spd: -1}, target);
			this.add('-anim', source, 'Close Combat', target);
		},
		flags: {mirror: 1, protect: 1},
		secondary: null,
		target: "normal",
		type: "Dark",
	},

	// Paradise
	"rapidturn": {
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		desc: "Removes hazards then user switches out after dealing damage",
		shortDesc: "Removes hazards then switches out",
		name: "Rapid Turn",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onTryMovePriority: 100,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Rapid Spin', target);
			this.add('-anim', source, 'U-turn', target);
		},
		onAfterHit(target, pokemon) {
			const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
			for (const condition of sideConditions) {
				if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
					this.add('-sideend', pokemon.side, this.dex.getEffect(condition).name, '[from] move: Rapid Turn', '[of] ' + pokemon);
				}
			}
			if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
				pokemon.removeVolatile('partiallytrapped');
			}
		},
		onAfterSubDamage(damage, target, pokemon) {
			const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
			for (const condition of sideConditions) {
				if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
					this.add('-sideend', pokemon.side, this.dex.getEffect(condition).name, '[from] move: Rapid Turn', '[of] ' + pokemon);
				}
			}
			if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
				pokemon.removeVolatile('partiallytrapped');
			}
		},
		selfSwitch: true,
		secondary: null,
		target: "normal",
		type: "Normal",
	},

	// Perish Song
	sinistergaze: {
		accuracy: 90,
		basePower: 65,
		basePowerCallback(pokemon, target, move) {
			if (target.status || target.hasAbility('comatose')) return move.basePower * 2;
			return move.basePower;
		},
		category: "Special",
		desc: "Power doubles if the target has a major status condition. This move has a 40% chance to randomly burn, paralyze, or poison the target after each use if the target is not already inflicted with a status move.",
		shortDesc: "40% chance BRN/PAR/PSN. 2x power if foe status.",
		name: "Sinister Gaze",
		pp: 15,
		priority: 0,
		flags: {protect: 1},
		onTryMovePriority: 100,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Mean Look', target);
			this.add('-anim', source, 'Black Hole Eclipse', target);
		},
		secondary: {
			chance: 40,
			onHit(target, source) {
				const result = this.random(3);
				if (result === 0) {
					target.trySetStatus('brn', source);
				} else if (result === 1) {
					target.trySetStatus('par', source);
				} else {
					target.trySetStatus('psn', source);
				}
			},
		},
		target: "normal",
		type: "Ghost",
	},

	// phiwings99
	ghostof1v1past: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Imprisons and traps the target, and then transforms into them.",
		shortDesc: "Imprison + Mean Look + Transform.",
		name: "Ghost of 1v1 Past",
		pp: 1,
		priority: 0,
		flags: {},
		onTryMovePriority: 100,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Imprison', source);
			this.add('-anim', source, 'Mean Look', target);
			this.add('-anim', source, 'Transform', target);
		},
		onHit(target, pokemon, move) {
			target.addVolatile('trapped', pokemon, move, 'trapper');
			pokemon.addVolatile('imprison', pokemon, move);
			if (!pokemon.transformInto(target)) {
				return false;
			}
		},
		isZ: "boatiumz",
		secondary: null,
		target: "normal",
		type: "Ghost",
	},

	// Rabia
	psychodrive: {
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Has a 30% chance to boost the user's Speed by 1 stage.",
		shortDesc: "30% chance to boost the user's Spe by 1.",
		name: "Psycho Drive",
		pp: 15,
		priority: 0,
		flags: {protect: 1},
		onTryMovePriority: 100,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Genesis Supernova', target);
		},
		secondary: {
			chance: 30,
			self: {
				boosts: {spe: 1},
			},
		},
		target: "normal",
		type: "Psychic",
	},

	// Segmr
	disconnect: {
		accuracy: 100,
		basePower: 150,
		category: "Special",
		desc: "Deals damage two turns after this move is used. At the end of that turn, the damage is calculated at that time and dealt to the Pokemon at the position the target had when the move was used. If the user is no longer active at the time, damage is calculated based on the user's natural Special Attack stat, types, and level, with no boosts from its held item or Ability. Fails if this move, Doom Desire, or Future Sight is already in effect for the target's position. Switches the user out.",
		shortDesc: "Hits 2 turns after use. User switches out.",
		name: "Disconnect",
		pp: 5,
		priority: 0,
		flags: {},
		isFutureMove: true,
		onTryMovePriority: 100,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Doom Desire', target);
		},
		onTry(source, target) {
			if (!target.side.addSlotCondition(target, 'futuremove')) {
				source.switchFlag = 'disconnect' as ID;
			} else {
				Object.assign(target.side.slotConditions[target.position]['futuremove'], {
					move: 'disconnect',
					source: source,
					moveData: {
						id: 'disconnect',
						name: "Disconnect",
						accuracy: 100,
						basePower: 150,
						category: "Special",
						priority: 0,
						flags: {},
						effectType: 'Move',
						isFutureMove: true,
						type: 'Fairy',
					},
				});
				this.add('-start', source, 'Disconnect');
				this.add(`c|%Segmr|Lemme show you this`);
				source.switchFlag = 'disconnect' as ID;
				return null;
			}
		},
		secondary: null,
		target: "normal",
		type: "Fairy",
	},

	// Zodiax
	bigstormcoming: {
		accuracy: 100,
		basePower: 0,
		category: "Special",
		desc: "Uses Hurricane, Thunder, Blizzard, and Weather Ball at 30% power.",
		shortDesc: "30% power: Hurricane, Thunder, Blizzard, Weather Ball.",
		name: "Big Storm Coming",
		pp: 10,
		priority: 0,
		flags: {},
		onTryMovePriority: 100,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onTry(pokemon, target) {
			pokemon.m.bigstormcoming = true;
			this.useMove("Hurricane", pokemon);
			this.useMove("Thunder", pokemon);
			this.useMove("Blizzard", pokemon);
			this.useMove("Weather Ball", pokemon);
			pokemon.m.bigstormcoming = false;
		},
		secondary: null,
		target: "normal",
		type: "Flying",
	},
	// These moves need modified to support Snowstorm (Perish Song's ability)
	auroraveil: {
		inherit: true,
		desc: "For 5 turns, the user and its party members take 0.5x damage from physical and special attacks, or 0.66x damage if in a Double Battle; does not reduce damage further with Reflect or Light Screen. Critical hits ignore this protection. It is removed from the user's side if the user or an ally is successfully hit by Brick Break, Psychic Fangs, or Defog. Brick Break and Psychic Fangs remove the effect before damage is calculated. Lasts for 8 turns if the user is holding Light Clay. Fails unless the weather is Hail or Snowstorm.",
		shortDesc: "For 5 turns, damage to allies is halved. Hail and Snowstorm only.",
		onTryHitSide() {
			if (!this.field.isWeather(['hail', 'snowstorm'])) return false;
		},
	},
	blizzard: {
		inherit: true,
		desc: "Has a 10% chance to freeze the target. If the weather is Hail or Snowstorm, this move does not check accuracy.",
		shortDesc: "10% freeze foe(s). Can't miss in Hail or Snowstorm.",
		onModifyMove(move) {
			if (this.field.isWeather(['hail', 'snowstorm'])) move.accuracy = true;
		},
	},
	dig: {
		inherit: true,
		effect: {
			duration: 2,
			onImmunity(type, pokemon) {
				if (['sandstorm', 'hail', 'snowstorm'].includes(type)) return false;
			},
			onInvulnerability(target, source, move) {
				if (['earthquake', 'magnitude'].includes(move.id)) {
					return;
				}
				return false;
			},
			onSourceModifyDamage(damage, source, target, move) {
				if (move.id === 'earthquake' || move.id === 'magnitude') {
					return this.chainModify(2);
				}
			},
		},
	},
	dive: {
		inherit: true,
		effect: {
			duration: 2,
			onImmunity(type, pokemon) {
				if (['sandstorm', 'hail', 'snowstorm'].includes(type)) return false;
			},
			onInvulnerability(target, source, move) {
				if (['surf', 'whirlpool'].includes(move.id)) {
					return;
				}
				return false;
			},
			onSourceModifyDamage(damage, source, target, move) {
				if (move.id === 'surf' || move.id === 'whirlpool') {
					return this.chainModify(2);
				}
			},
		},
	},
	moonlight: {
		inherit: true,
		desc: "The user restores 1/2 of its maximum HP if Delta Stream or no weather conditions are in effect or if the user is holding Utility Umbrella, 2/3 of its maximum HP if the weather is Desolate Land or Sunny Day, and 1/4 of its maximum HP if the weather is Hail, Primordial Sea, Rain Dance, Sandstorm, or Snowstorm, all rounded half down.",
		onHit(pokemon) {
			let factor = 0.5;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				factor = 0.667;
				break;
			case 'raindance':
			case 'primordialsea':
			case 'sandstorm':
			case 'hail':
			case 'snowstorm':
				factor = 0.25;
				break;
			}
			return !!this.heal(this.modify(pokemon.maxhp, factor));
		},
	},
	morningsun: {
		inherit: true,
		desc: "The user restores 1/2 of its maximum HP if Delta Stream or no weather conditions are in effect or if the user is holding Utility Umbrella, 2/3 of its maximum HP if the weather is Desolate Land or Sunny Day, and 1/4 of its maximum HP if the weather is Hail, Primordial Sea, Rain Dance, Sandstorm, or Snowstorm, all rounded half down.",
		onHit(pokemon) {
			let factor = 0.5;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				factor = 0.667;
				break;
			case 'raindance':
			case 'primordialsea':
			case 'sandstorm':
			case 'hail':
			case 'snowstorm':
				factor = 0.25;
				break;
			}
			return !!this.heal(this.modify(pokemon.maxhp, factor));
		},
	},
	solarbeam: {
		inherit: true,
		desc: "This attack charges on the first turn and executes on the second. Power is halved if the weather is Snowstorm, Hail, Primordial Sea, Rain Dance, or Sandstorm and the user is not holding Utility Umbrella. If the user is holding a Power Herb or the weather is Desolate Land or Sunny Day, the move completes in one turn. If the user is holding Utility Umbrella and the weather is Desolate Land or Sunny Day, the move still requires a turn to charge.",
		onBasePower(basePower, pokemon, target) {
			if (['raindance', 'primordialsea', 'sandstorm', 'hail', 'snowstorm'].includes(pokemon.effectiveWeather())) {
				this.debug('weakened by weather');
				return this.chainModify(0.5);
			}
		},
	},
	solarblade: {
		inherit: true,
		desc: "This attack charges on the first turn and executes on the second. Power is halved if the weather is Snowstorm, Hail, Primordial Sea, Rain Dance, or Sandstorm and the user is not holding Utility Umbrella. If the user is holding a Power Herb or the weather is Desolate Land or Sunny Day, the move completes in one turn. If the user is holding Utility Umbrella and the weather is Desolate Land or Sunny Day, the move still requires a turn to charge.",
		onBasePower(basePower, pokemon, target) {
			if (['raindance', 'primordialsea', 'sandstorm', 'hail', 'snowstorm'].includes(pokemon.effectiveWeather())) {
				this.debug('weakened by weather');
				return this.chainModify(0.5);
			}
		},
	},
	synthesis: {
		inherit: true,
		desc: "The user restores 1/2 of its maximum HP if Delta Stream or no weather conditions are in effect or if the user is holding Utility Umbrella, 2/3 of its maximum HP if the weather is Desolate Land or Sunny Day, and 1/4 of its maximum HP if the weather is Hail, Primordial Sea, Rain Dance, Sandstorm, or Snowstorm, all rounded half down.",
		onHit(pokemon) {
			let factor = 0.5;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				factor = 0.667;
				break;
			case 'raindance':
			case 'primordialsea':
			case 'sandstorm':
			case 'hail':
			case 'snowstorm':
				factor = 0.25;
				break;
			}
			return !!this.heal(this.modify(pokemon.maxhp, factor));
		},
	},
	weatherball: {
		inherit: true,
		desc: "Power doubles if a weather condition other than Delta Stream is active, and this move's type changes to match. Ice type during Hail, Water type during Primordial Sea or Rain Dance, Rock type during Sandstorm, and Fire type during Desolate Land or Sunny Day. If the user is holding Utility Umbrella and uses Weather Ball during Primordial Sea, Rain Dance, Desolate Land, or Sunny Day, the move is still Normal-type and does not have a base power boost.",
		onModifyType(move, pokemon) {
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				move.type = 'Fire';
				break;
			case 'raindance':
			case 'primordialsea':
				move.type = 'Water';
				break;
			case 'sandstorm':
				move.type = 'Rock';
				break;
			case 'hail':
			case 'snowstorm':
				move.type = 'Ice';
				break;
			}
		},
		onModifyMove(move, pokemon) {
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				move.basePower *= 2;
				break;
			case 'raindance':
			case 'primordialsea':
				move.basePower *= 2;
				break;
			case 'sandstorm':
				move.basePower *= 2;
				break;
			case 'hail':
			case 'snowstorm':
				move.basePower *= 2;
				break;
			}
		},
	},
	// Modified move descriptions for support of Segmr's move
	doomdesire: {
		inherit: true,
		desc: "Deals damage two turns after this move is used. At the end of that turn, the damage is calculated at that time and dealt to the Pokemon at the position the target had when the move was used. If the user is no longer active at the time, damage is calculated based on the user's natural Special Attack stat, types, and level, with no boosts from its held item or Ability. Fails if this move, Disconnect, or Future Sight is already in effect for the target's position.",
	},
	futuresight: {
		inherit: true,
		desc: "Deals damage two turns after this move is used. At the end of that turn, the damage is calculated at that time and dealt to the Pokemon at the position the target had when the move was used. If the user is no longer active at the time, damage is calculated based on the user's natural Special Attack stat, types, and level, with no boosts from its held item or Ability. Fails if this move, Doom Desire, or Disconnect is already in effect for the target's position.",
	},
};
