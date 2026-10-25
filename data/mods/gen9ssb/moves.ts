import { ssbSets } from "./random-teams";
import { PSEUDO_WEATHERS, changeSet, getName } from "./scripts";
import { Teams } from '../../../sim/teams';

export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	/*
	// Example
	moveid: {
		accuracy: 100, // a number or true for always hits
		basePower: 100, // Not used for Status moves, base power of the move, number
		category: "Physical", // "Physical", "Special", or "Status"
		shortDesc: "", // short description, shows up in /dt
		desc: "", // long description
		name: "Move Name",
		gen: 8,
		pp: 10, // unboosted PP count
		priority: 0, // move priority, -6 -> 6
		flags: {}, // Move flags https://github.com/smogon/pokemon-showdown/blob/master/data/moves.js#L1-L27
		onTryMove() {
			this.attrLastMove('[still]'); // For custom animations
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Move Name 1', attacker);
			this.add('-anim', attacker, 'Move Name 2', attacker);
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
		heal: [1, 2], // recover first num / second num % of the defender's HP
	},
	*/
	// Please keep sets organized alphabetically based on staff member name!
	// aegii
	equipaegislash: {
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		shortDesc: "50% +1 Atk, 50% +1 Def, eats berry.",
		desc: "This move has a 50% chance to raise the user's Attack by 1 stage and a 50% chance to raise the user's Defense by 1 stage. After using the move, the user eats its berry if holding one.",
		name: "Equip Aegislash",
		gen: 9,
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Shadow Sneak', defender);
			this.add('-anim', attacker, 'Swords Dance', attacker);
			this.add('-anim', attacker, 'Iron Defense', attacker);
		},
		secondaries: [
			{
				chance: 50,
				self: {
					boosts: {
						atk: 1,
					},
				},
			}, {
				chance: 50,
				self: {
					boosts: {
						def: 1,
					},
				},
			},
		],
		self: {
			onHit(defender, attacker) {
				if (!attacker.getItem().isBerry) return;
				attacker.eatItem(true);
			},
		},
		target: "normal",
		type: "Steel",
	},

	// Aelita
	smelt: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "User burns itself and gains +2 Spe/+1 Atk.",
		desc: "This move burns the user, raises their Speed by 2 stages, and raises their Attack by 1 stage.",
		name: "Smelt",
		gen: 9,
		pp: 10,
		priority: 0,
		flags: {},
		onPrepareHit(pokemon) {
			this.attrLastMove('[still]');
		},
		onHit(pokemon) {
			pokemon.trySetStatus('brn');
			this.add('-anim', pokemon, 'Shift Gear', pokemon);
			this.boost({ spe: 2, atk: 1 });
		},
		target: "self",
		type: "Steel",
	},

	// Aethernum
	iamatomic: {
		accuracy: 100,
		basePower: 140,
		category: "Special",
		shortDesc: "Lowers user's Def, Sp. Atk and Speed by 2 stages.",
		desc: "Lowers the user's Defense, Special Attack, and Speed by 2 stages.",
		name: "I. AM. ATOMIC.",
		gen: 9,
		pp: 5,
		priority: 0,
		flags: { protect: 1 },
		onPrepareHit(defender, attacker, move) {
			this.add('-anim', attacker, 'Trick Room', defender);
			this.add('-anim', attacker, 'Clangerous Soul', attacker);
			this.add('-anim', attacker, 'Flash', defender);
			this.add(`c:|${getName((attacker.illusion || attacker).name)}|I`);
			this.add(`c:|${getName((attacker.illusion || attacker).name)}|AM`);
			this.add(`c:|${getName((attacker.illusion || attacker).name)}|ATOMIC.`);
		},
		self: {
			boosts: {
				spe: -2,
				def: -2,
				spa: -2,
			},
		},
		target: "normal",
		type: "Ghost",
	},

	// Akir
	freeswitchbutton: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Haze + Parting Shot + Replacement heals 33%.",
		desc: "Resets the stat stages of all active Pokemon to 0, then lowers the foe's Attack and Special Attack by 1 stage each while switching out. The Pokemon that switches in heals 33% of its maximum HP. This move bypasses all Protect-like effects.",
		name: "Free Switch Button",
		gen: 9,
		pp: 10,
		priority: 0,
		flags: {},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onHit(defender, attacker, move) {
			this.add('-clearallboost');
			for (const pokemon of this.getAllActive()) {
				pokemon.clearBoosts();
			}
			const foe = attacker.foes()[0];
			if (!foe) return;
			const success = this.boost({ atk: -1, spa: -1 }, foe, attacker);
			if (!success && !foe.hasAbility('mirrorarmor')) {
				delete move.selfSwitch;
			}
		},
		// the foe cannot be set as the defender in move properties because it breaks the 33% replacement heal
		selfSwitch: true,
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Haze', attacker);
		},
		slotCondition: 'freeswitchbutton',
		condition: {
			onSwitchIn(defender) {
				if (!defender.fainted && (defender.hp < defender.maxhp)) {
					defender.heal(defender.maxhp / 3);
					this.add('-heal', defender, defender.getHealth, '[from] move: Free Switch Button');
					defender.side.removeSlotCondition(defender, 'freeswitchbutton');
				}
			},
		},
		target: "self",
		type: "Water",
	},

	// Alex
	spicierextract: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Leech Seed + Heal Block + Infestation",
		desc: "Applies the effects of Leech Seed, Heal Block, and partial trapping to the defender, causing the user to steal 1/8 of the defender's maximum HP at the end of each turn until the defender switches out, preventing the defender from using any moves, items, or Abilities that heal HP for 5 turns, and preventing the defender from switching out while damaging it for an additional 1/8 of its maximum HP at the end of each turn for 4-5 turns. If the defender uses Baton Pass, the effects of Leech Seed, Heal Block, and partial trapping will remain in effect for the replacement.",
		name: "Spicier Extract",
		pp: 15,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, powder: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Leafage', defender);
			this.add('-anim', attacker, 'Stun Spore', defender);
		},
		onHit(defender, attacker) {
			let success = false;
			if (defender.addVolatile('partiallytrapped', attacker)) success = true;
			if (defender.addVolatile('leechseed', attacker)) success = true;
			if (defender.addVolatile('healblock', attacker)) success = true;
			return success;
		},
		target: "normal",
		type: "Grass",
	},

	// Alexander489
	scumhunt: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Uses a random damaging, non-resisted move.",
		desc: "A random damaging non-resisted move is selected for use, other than moves uncallable by Metronome and moves originating from Super Staff Bros Ultimate.",
		name: "Scumhunt",
		pp: 10,
		priority: 0,
		flags: { protect: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker, move) {
			const nresTypes = [];
			for (const i of this.dex.types.names()) {
				if (i === "Stellar") continue;
				if (defender) {
					const effect = this.dex.getEffectiveness(i, defender);
					const immune = !this.dex.getImmunity(i, defender);
					if (effect >= 0 && !immune) {
						nresTypes.push(i);
					}
				}
			}
			if (!nresTypes.length) return;
			const netType = this.sample(nresTypes);
			const moves = this.dex.moves.all().filter(m => (
				(![2, 4].includes(this.gen) || !attacker.moves.includes(m.id)) &&
				(!m.isNonstandard || m.isNonstandard === 'Unobtainable') &&
				m.flags['metronome'] && m.type === netType && m.category !== "Status"
			));
			let randomMove = '';
			if (moves.length) {
				moves.sort((a, b) => a.num - b.num);
				randomMove = this.sample(moves).id;
			}
			if (!randomMove) return false;
			attacker.side.lastSelectedMove = this.toID(randomMove);
			this.add('-anim', attacker, 'Spite', defender);
			this.add('-anim', attacker, 'Grudge', defender);
			this.add('-anim', attacker, 'Metronome', attacker);
			this.actions.useMove(randomMove, attacker);
		},
		target: "normal",
		type: "???",
	},

	// Apple
	woppleorflopple: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Confuse; +2 SpA/D. Fail=Confuse self; -1 SpA/D.",
		desc: "Usually moves first. This move has a 50% chance of confusing the defender and raising the user's Special Attack and Special Defense by 2 stages. Otherwise, it will confuse the user and lower the user's Special Attack and Special Defense by 1 stage.",
		name: "Wopple or Flopple",
		gen: 9,
		pp: 10,
		priority: 1,
		flags: { protect: 1, reflectable: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Moonlight', attacker);
		},
		onHit(defender, attacker, move) {
			if (this.randomChance(1, 2)) {
				defender.addVolatile('confusion');
				this.boost({ spa: 2, spd: 2 }, attacker);
			} else {
				attacker.addVolatile('confusion');
				this.boost({ spa: -1, spd: -1 }, attacker);
			}
		},
		target: "normal",
		type: "Normal",
	},

	// Appletun a la Mode
	extracourse: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Recycles berry, +1 to 3 random stats (-acc/eva).",
		desc: "The user regains the item it last used, and then boosts two random stats by 1 stage each, except Accuracy and Evasion. If the user is currently holding an item or has had their item forcibly removed, the stat boosts occur without the Recycle effect.",
		name: "Extra Course",
		gen: 9,
		pp: 5,
		priority: 0,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Recycle', defender);
		},
		flags: { snatch: 1 },
		onHit(pokemon) {
			if (!pokemon.item && pokemon.lastItem) {
				const item = pokemon.lastItem;
				pokemon.lastItem = '';
				this.add('-item', pokemon, this.dex.items.get(item), '[from] move: Extra Course');
				pokemon.setItem(item);
			}
			const boost: SparseBoostsTable = {};
			const boostedStats: BoostID[] = [];
			for (let i = 0; i < 3; i++) {
				const stats: BoostID[] = [];
				let statPlus: BoostID;
				for (statPlus in pokemon.boosts) {
					if (statPlus === 'accuracy' || statPlus === 'evasion' || boostedStats.includes(statPlus)) continue;
					if (pokemon.boosts[statPlus] < 6) {
						stats.push(statPlus);
					}
				}
				const randomStat: BoostID | undefined = stats.length ? this.sample(stats) : undefined;
				if (randomStat) {
					boost[randomStat] = 1;
					boostedStats.push(randomStat);
				}
			}
			this.boost(boost, pokemon, pokemon);
		},
		target: "self",
		type: "Normal",
	},

	// April
	herbaldagger: {
		accuracy: 95,
		basePower: 95,
		category: "Physical",
		shortDesc: "No additional effect.",
		name: "Herbal Dagger",
		gen: 9,
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, slicing: 1, contact: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Flower Trick', defender);
			this.add('-anim', attacker, 'Flower Trick', defender);
		},
		target: "normal",
		type: "Grass",
	},

	// aQrator
	torisstori: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		shortDesc: "Confuses foe & deals 1/6th max HP for 4-5 turns.",
		desc: "Causes the defender to become confused. If this move is successful, the defender takes damage equal to 1/6th of its maximum HP at the end of each turn for 4-5 turns.",
		name: "Tori's Stori",
		gen: 9,
		pp: 5,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Water Spout', defender);
			this.add('-anim', attacker, 'Confuse Ray', defender);
		},
		volatileStatus: 'torisstori',
		condition: {
			duration: 5,
			durationCallback(defender, attacker) {
				if (attacker?.hasItem('gripclaw')) return 8;
				return this.random(5, 6);
			},
			onStart(defender) {
				this.add('-start', defender, 'Tori\'s Stori');
			},
			onResidualOrder: 6,
			onResidual(pokemon) {
				this.damage(pokemon.baseMaxhp / 6);
			},
			onEnd(defender) {
				this.add('-end', defender, 'Tori\'s Stori');
			},
		},
		secondary: {
			chance: 100,
			volatileStatus: 'confusion',
		},
		target: "normal",
		type: "Water",
	},

	// A Quag To The Past
	sireswitch: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Quag: Protect; Clod: Recover. Switch sires.",
		desc: "Nearly always moves first. If the user is Quagsire, the user is protected from most attacks made by other Pokemon during this turn and then transforms into Clodsire. If the user is Clodsire, the user recovers 1/2 of its maximum HP and then transforms into Quagsire. This move fails if the user is neither Quagsire nor Clodsire.",
		name: "Sire Switch",
		gen: 9,
		pp: 20,
		priority: 4,
		onTry(attacker) {
			if (['Quagsire', 'Clodsire'].includes(attacker.species.name)) {
				return;
			}
			this.hint("Only Clodsire and Quagsire can use this move.");
			this.attrLastMove('[still]');
			this.add('-fail', attacker, 'move: Sire Switch');
			return null;
		},
		onModifyPriority(relayVar, attacker, defender, move) {
			if (attacker.species.name === 'Clodsire') {
				return -6;
			}
		},
		flags: { failcopycat: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Max Guard', attacker);
			if (attacker.species.name === 'Quagsire') {
				this.add('-anim', attacker, 'Protect', attacker);
				return !!this.queue.willAct() && this.runEvent('StallMove', attacker);
			} else {
				this.add('-anim', attacker, 'Recover', attacker);
			}
		},
		volatileStatus: 'protect',
		onModifyMove(move, pokemon) {
			if (pokemon.species.name === 'Clodsire') {
				move.flags['heal'] = 1;
				move.heal = [1, 2];
				delete move.volatileStatus;
			}
		},
		onHit(pokemon) {
			if (pokemon.species.name === 'Quagsire') {
				pokemon.addVolatile('stall');
				changeSet(this, pokemon, ssbSets['A Quag To The Past-Clodsire'], true);
			} else {
				changeSet(this, pokemon, ssbSets['A Quag To The Past'], true);
			}
		},
		target: "self",
		type: "Ground",
	},

	// Archas
	aurarain: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Cures team status, all heal 75% max HP.",
		desc: "Z-Move that requires Lilligantium Z. Every Pokemon in the user's party is cured of its non-volatile status condition. With the exception of the user, every Pokemon in the user's party heals for 1/2 of their maximum HP. This effect cannot revive fainted Pokemon.",
		name: "Aura Rain",
		pp: 1,
		priority: 0,
		flags: {},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Rain Dance', attacker);
			this.add('-anim', attacker, 'Water Sport', attacker);
			this.add('-anim', attacker, 'Aromatherapy', attacker);
		},
		onHit(pokemon) {
			this.add('-message', 'An alleviating aura rains down on the field!');
			let success = false;
			const allies = [...pokemon.side.pokemon, ...pokemon.side.allySide?.pokemon || []];
			for (const ally of allies) {
				if (ally.heal(this.modify(ally.maxhp, 0.75))) {
					this.add('-heal', ally, ally.getHealth);
					success = true;
				}
				if (ally.cureStatus()) success = true;
			}
			return success;
		},
		isZ: "lilligantiumz",
		target: "self",
		type: "Grass",
	},

	// Archfaewild
	breathoftiamat: {
		accuracy: 95,
		basePower: 20,
		category: "Special",
		shortDesc: "5 hits: Fire, Ice, Poison, Elec, Poison. Is STAB.",
		desc: "This move hits 5 times. The first hit is Fire-type, the second is Ice-type, the third is Poison-type, the fourth is Electric-type, and the fifth is Poison-type. Each move checks accuracy individually, and if one hit misses, the attack stops. If the defender is immune to one or more of the hits, the rest will still execute as normal. This move will always have Same-Type Attack Bonus.",
		name: "Breath of Tiamat",
		pp: 20,
		priority: 0,
		flags: { protect: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker, move) {
			if (defender.runImmunity('Fire')) {
				this.add('-anim', attacker, 'Flamethrower', defender);
			}
		},
		onHit(defender, attacker, move) {
			const moveTypes = ['Fire', 'Ice', 'Poison', 'Electric', 'Poison'];
			const hitTypes = moveTypes.filter(x => defender.runImmunity(x));
			if (move.hit >= hitTypes.length) {
				move.basePower = 0;
				move.category = 'Status';
				/* Problem here - we can't retroactively change the multihit parameter.
				With this specific code, the move functions as intended, but will display the incorrect
				number of hits if a defender is immune to any of them. Even if you try to return false, null, etc
				during this step, it will not interrupt the move. Nor will a this.add(-fail) do so either.
				This seems to be the only way to get it to work and is a decent enough compromise for now. */
			} else {
				move.type = hitTypes[move.hit];
				const moveAnims = ['Flamethrower', 'Ice Beam', 'Gunk Shot', 'Charge Beam', 'Sludge Bomb'];
				const hitAnims = [];
				for (const [i, anim] of moveAnims.entries()) {
					const index2 = Math.min(i, hitTypes.length - 1);
					if (moveTypes[i] === hitTypes[index2]) {
						hitAnims.push(anim);
					}
				}
				this.add('-anim', attacker, hitAnims[move.hit], defender);
			}
		},
		multihit: 5,
		multiaccuracy: true,
		forceSTAB: true,
		defender: 'normal',
		type: "Fire",
	},

	// Arcueid
	funnyvamp: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Changes user's forme, effects vary with forme.",
		desc: "If the user is Deoxys-Defense, it transforms into Deoxys-Attack and uses a random move from its moveset. If the user is Deoxys-Attack, it transforms into Deoxys-Defense and boosts two random stats by 1 stage each, except Accuracy and Evasion.",
		name: "Funny Vamp",
		gen: 9,
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, failcopycat: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Moonlight', defender);
			this.add('-anim', attacker, 'Quiver Dance', defender);
			this.add('-anim', attacker, 'Geomancy', defender);
			this.add(`c:|${getName('Arcueid')}|I've got nine lives 🐈. You knew that about cats, right, 😹? That means I haven't lost until you beat me nine times 🙀!`);
		},
		onHit(defender, attacker, move) {
			if (attacker.species.name === "Deoxys-Defense") {
				changeSet(this, attacker, ssbSets['Arcueid-Attack'], true);
				let randMove = this.random(3) - 1;
				if (randMove < 0) randMove = 0;
				this.actions.useMove(attacker.moveSlots[randMove].id, defender);
			} else {
				changeSet(this, attacker, ssbSets['Arcueid'], true);
				for (let i = 0; i < 2; i++) {
					const stats: BoostID[] = [];
					const boost: SparseBoostsTable = {};
					let statPlus: BoostID;
					for (statPlus in attacker.boosts) {
						if (statPlus === 'accuracy' || statPlus === 'evasion') continue;
						if (attacker.boosts[statPlus] < 6) {
							stats.push(statPlus);
						}
					}
					const randomStat: BoostID | undefined = stats.length ? this.sample(stats) : undefined;
					if (randomStat) boost[randomStat] = 1;
					this.boost(boost, attacker, attacker);
				}
				this.heal(attacker.baseMaxhp / 2, attacker);
			}
		},
		target: "self",
		type: "Psychic",
	},

	// Arsenal
	megidolaon: {
		accuracy: 100,
		basePower: 210,
		category: "Special",
		shortDesc: "Flinches if resulting in a critical hit.",
		name: "Megidolaon",
		gen: 9,
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Hyper Beam', defender);
			this.add('-anim', attacker, 'Earthquake', defender);
		},
		volatileStatus: 'flinch',
		target: "normal",
		type: "???",
	},

	// Artemis
	automatedresponse: {
		accuracy: 100,
		basePower: 80,
		category: "Special",
		shortDesc: "Change move/user's type to SE. 25% NVE instead.",
		desc: "Randomly changes the move's and user's type to deal super effective damage. There is a 25% chance that this move has a false positive and changes the move's and user's type to deal not very effective damage instead.",
		name: "Automated Response",
		pp: 10,
		priority: 0,
		flags: { protect: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		beforeTurnCallback(attacker, defender) {
			const seTypes = [];
			const nveTypes = [];
			let netType = "";
			for (const i of this.dex.types.names()) {
				if (defender) {
					const effect = this.dex.getEffectiveness(i, defender);
					const isImmune = !this.dex.getImmunity(i, defender);
					if (effect > 0 && !isImmune) {
						seTypes.push(i);
					} else if (effect < 0 && !isImmune) {
						nveTypes.push(i);
					}
				}
			}
			let falsePositive = false;
			if (!seTypes.length) seTypes.push('Electric');
			if (!nveTypes.length) nveTypes.push('Electric');
			if (this.randomChance(75, 100)) {
				netType = this.sample(seTypes);
			} else { // false positive
				falsePositive = true;
				netType = this.sample(nveTypes);
			}
			if (falsePositive) {
				this.add('-message', `${(defender.illusion || defender).name} triggered a false-positive and caused Automated Response to become not-very effective!`);
			}
			if (attacker.setType(netType)) {
				this.add('-start', attacker, 'typechange', netType);
			}
			attacker.m.artemisMoveType = netType;
		},
		onPrepareHit(defender, attacker, move) {
			this.add('-anim', attacker, 'Techno Blast', defender);
		},
		onModifyType(move, pokemon, defender) {
			if (pokemon.m.artemisMoveType) {
				move.type = pokemon.m.artemisMoveType;
			}
		},
		self: {
			boosts: {
				spa: -2,
			},
		},
		target: "normal",
		type: "Electric",
	},

	// Arya
	anyonecanbekilled: {
		accuracy: 95,
		basePower: 80,
		category: "Special",
		shortDesc: "+2 SpA for 2 turns.",
		desc: "The user's Special Attack is boosted by 2 stages for 2 turns and is restored to its original value at the end. Does not stack with itself.",
		name: "Anyone can be killed",
		pp: 10,
		priority: 0,
		flags: { protect: 1, sound: 1, bypasssub: 1, mirror: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		self: {
			volatileStatus: 'anyonecanbekilled',
		},
		condition: {
			duration: 3,
			onResidualOrder: 3,
			onStart(defender, attacker, sourceEffect) {
				this.boost({ spa: 2 }, attacker);
			},
			onEnd(defender) {
				this.boost({ spa: -2 }, defender);
			},
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Dragon Dance', defender);
			this.add('-anim', attacker, 'Earth Power', defender);
		},
		target: "normal",
		type: "Ground",
	},

	// Audiino
	thinkinginprogress: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Cure status, +1 Def/SpD, +2 SpA.",
		name: "Thinking In Progress",
		gen: 9,
		pp: 20,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Calm Mind', attacker);
		},
		onHit(defender, attacker, move) {
			attacker.cureStatus();
		},
		boosts: {
			def: 1,
			spa: 2,
			spd: 1,
		},
		target: "self",
		type: "Psychic",
	},

	// autumn
	seasonssmite: {
		accuracy: 100,
		basePower: 90,
		category: "Special",
		shortDesc: "+1 Defense if Protosynthesis is active.",
		desc: "Raises the user's Defense by 1 stage if the user is under the effect of the Protosynthesis Ability.",
		name: "Season's Smite",
		gen: 9,
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', defender, 'Morning Sun', defender);
		},
		secondary: {
			chance: 100,
			onHit(defender, attacker, move) {
				if (attacker.volatiles['protosynthesis']) {
					this.boost({ def: 1 }, attacker, attacker, move);
				}
			},
		},
		target: "normal",
		type: "Ghost",
	},

	// ausma
	sigilsstorm: {
		accuracy: 100,
		basePower: 123,
		category: "Special",
		shortDesc: "If hit, Trick Room. Else, attack+random effect.",
		desc: "Begins to charge an attack at the start of the turn. Nearly always moves last. If the user is directly damaged while charging, Trick Room is set instead, making the slower Pokemon move first for 5 turns. The Trick Room effect occurs before Cascade if both would activate on the same turn. If the user was not directly damaged while charging, the attack executes and one random effect will occur from the following: poison; burn; paralysis; confusion; the user recovers HP equal to 75% of damage dealt; all entry hazards are removed from the field; a random entry hazard is set, except G-Max Steelsurge; two random stats of the user are raised by 1 stage each, except Accuracy and Evasion; two random stats of the defender are lowered by 1 stage each, except Accuracy and Evasion; or the defender transforms into a Fennekin with Ember, Scratch, and Growl until they switch out.",
		name: "Sigil's Storm",
		pp: 20,
		priority: -6,
		onModifyPriority(priority, attacker, defender, move) {
			if (attacker.species.id === 'mismagius') return priority + 6;
		},
		flags: { snatch: 1, metronome: 1, protect: 1, failcopycat: 1 },
		priorityChargeCallback(pokemon) {
			if (pokemon.species.id === 'mismagius') return;
			pokemon.addVolatile('sigilsstorm');
			this.add('-anim', pokemon, 'Calm Mind', pokemon);
		},
		beforeMoveCallback(pokemon) {
			if (pokemon.species.id === 'mismagius') return;
			if (pokemon.volatiles['sigilsstorm']?.lostFocus) {
				this.add('cant', pokemon, 'sigilsstorm', 'sigilsstorm');
				this.actions.useMove('trickroom', pokemon);
				this.add(`c:|${getName('ausma')}|dog can you not`);
				return true;
			}
		},
		onModifyType(move, pokemon, defender) {
			if (pokemon.species.id === 'mismagius') {
				move.type = 'Ghost';
			}
		},
		condition: {
			duration: 1,
			onStart(pokemon) {
				this.add('-singleturn', pokemon, 'move: Sigil\'s Storm');
			},
			onHit(pokemon, attacker, move) {
				if (move.category !== 'Status') {
					this.effectState.lostFocus = true;
				}
			},
			onTryAddVolatile(status, pokemon) {
				if (status.id === 'flinch') return null;
			},
		},
		onTry(attacker) {
			if (attacker.illusion || attacker.name === 'ausma') {
				return;
			}
			this.attrLastMove('[still]');
			this.add('-fail', attacker, 'move: Sigil\'s Storm');
			this.hint("Only a Pokemon whose nickname is \"ausma\" can use this move.");
			return null;
		},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Geomancy', attacker);
			this.add('-anim', attacker, 'Blood Moon', defender);
		},
		secondary: {
			chance: 100,
			onHit(defender, attacker, move) {
				const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
				const chance = this.random(100);
				if (chance <= 10) {
					defender.trySetStatus('psn', defender);
				} else if (chance <= 20) {
					defender.trySetStatus('par', defender);
				} else if (chance <= 30) {
					defender.trySetStatus('brn', defender);
				} else if (chance <= 50) {
					const stats: BoostID[] = [];
					const boost: SparseBoostsTable = {};
					let statPlus: BoostID;
					const statTarget = chance <= 40 ? defender : attacker;
					for (statPlus in statTarget.boosts) {
						if (statPlus === 'accuracy' || statPlus === 'evasion') continue;
						if (chance <= 40 && statTarget.boosts[statPlus] > -6) {
							stats.push(statPlus);
						} else if (chance <= 50 && statTarget.boosts[statPlus] < 6) {
							stats.push(statPlus);
						}
					}
					const randomStat: BoostID | undefined = stats.length ? this.sample(stats) : undefined;
					const randomStat2: BoostID | undefined = stats.length ? this.sample(stats.filter(s => s !== randomStat)) : undefined;
					if (randomStat && randomStat2) {
						if (chance <= 40) {
							boost[randomStat] = -1;
							boost[randomStat2] = -1;
						} else {
							boost[randomStat] = 1;
							boost[randomStat2] = 1;
						}
						this.boost(boost, statTarget, statTarget);
					}
				} else if (chance <= 60) {
					defender.addVolatile('confusion', attacker);
				} else if (chance <= 70) {
					for (const condition of sideConditions) {
						if (attacker.side.removeSideCondition(condition)) {
							this.add('-sideend', attacker.side, this.dex.conditions.get(condition).name, '[from] move: Sigil\'s Storm', `[of] ${attacker}`);
						}
					}
				} else if (chance <= 80) {
					defender.side.addSideCondition(this.sample(sideConditions.filter(hazard => !defender.side.getSideCondition(hazard))));
				} else if (chance <= 90) {
					move.drain = [3, 4];
				} else {
					changeSet(this, defender, ssbSets["ausma-Fennekin"], true);
					this.add(`c:|${getName('ausma')}|oh shit i posted to the wrong account`);
				}
			},
		},
		target: "normal",
		type: "Psychic",
	},

	// AuzBat
	preptime: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "+2 SpA, +1 Def/SpD/Spe.",
		desc: "The user's Special Attack is boosted by 2 stages, and its Defense, Special Defense, and Speed are boosted by 1 stage.",
		name: "Prep Time",
		pp: 5,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		boosts: {
			def: 1,
			spa: 2,
			spd: 1,
			spe: 1,
		},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Tidy Up', attacker);
		},
		target: "self",
		type: "Psychic",
	},

	// avarice
	yugiohreference: {
		accuracy: 90,
		basePower: 110,
		category: "Special",
		shortDesc: "50% chance to force the foe out.",
		desc: "Nearly always moves last. If this attack is successful, there is a 50% chance that the defender is forced to switch out and be replaced with a random unfainted ally.",
		name: "yu-gi-oh reference",
		pp: 5,
		priority: -6,
		flags: { protect: 1, bullet: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Never-Ending Nightmare', defender);
		},
		secondary: {
			chance: 50,
			onHit(defender, attacker, move) {
				move.forceSwitch = true;
			},
		},
		target: "normal",
		type: "Ghost",
	},

	// Beowulf
	buzzerstingercounter: {
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		shortDesc: "+3 prio if foe uses custom move. +2 Atk on KO.",
		desc: "This move will nearly always move first (+3 priority) if the defender would use a custom move from Super Staff Bros Ultimate this turn. Raises the user's Attack by 2 stages if this move knocks out the defender.",
		name: "Buzzer Stinger Counter",
		gen: 9,
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		onModifyPriority(priority, pokemon, defender) {
			if (!defender) return;
			const move = this.queue.willMove(defender)?.moveid;
			if (move && defender.moves.indexOf(move) === defender.moves.length - 1) {
				this.debug('BSC priority boost');
				return priority + 3;
			}
		},
		onAfterMoveSecondarySelf(pokemon, defender, move) {
			if (!defender || defender.fainted || defender.hp <= 0) this.boost({ atk: 2 }, pokemon, pokemon, move);
		},
		target: "normal",
		type: "Bug",
	},

	// berry
	whatkind: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Eats berry, gives random new berry, heals 25%.",
		desc: "The user consumes its held berry if it is holding one, heals 25% of its maximum HP, and then gains a random item from the following: Iapapa Berry, Leppa Berry, Lum Berry, Maranga Berry, Ganlon Berry, Starf Berry, Liechi Berry, or Enigma Berry.",
		name: "what kind",
		gen: 9,
		pp: 10,
		priority: 0,
		flags: {},
		onPrepareHit() {
			this.attrLastMove('[anim] Nasty Plot');
		},
		onHit(pokemon, qwerty, move) {
			if (pokemon.item && pokemon.getItem().isBerry) {
				pokemon.eatItem(true);
			}
			pokemon.lastItem = '';
			const berries = ['iapapa', 'leppa', 'lum', 'maranga', 'ganlon', 'starf', 'liechi', 'enigma'];
			const item = this.dex.items.get(this.sample(berries) + 'berry');
			pokemon.setItem(item, pokemon, move);
			this.add('-item', pokemon, item, '[from] move: what kind');
			this.heal(pokemon.baseMaxhp / 4, pokemon);
		},
		target: "self",
		type: "Water",
	},

	// Bert122
	shatterandscatter: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Protect, hit=-1 Atk/SpA/or Spe, user swap.",
		desc: "Nearly always moves first. This move can only be used by Mega Sableye. The user is protected from most attacks made by other Pokemon during this turn. If a targeted move is blocked during this effect, the attacker's stats are lowered depending on the move used. If the attacker used a physical attack, their Attack is lowered by 1 stage. If the attacker used a special attack, their Special Attack is lowered by 1 stage. If the attacker used a status move, their Speed is lowered by 1 stage. If this move successfully decreases a Pokemon's stat stages, this Pokemon's Mega Evolution is removed, and it immediately switches out and is replaced by a selected party member. This move fails if the user moves last, and has an increasing chance to fail when used consecutively.",
		name: "Shatter and Scatter",
		pp: 10,
		priority: 4,
		flags: { failinstruct: 1, failcopycat: 1 },
		stallingMove: true,
		volatileStatus: 'shatterandscatter',
		onTry(attacker) {
			if (attacker.species.name === 'Sableye-Mega') {
				return;
			}
			this.hint("Only Sableye-Mega can use this move.");
			this.attrLastMove('[still]');
			this.add('-fail', attacker, 'move: Shatter and Scatter');
			return null;
		},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(pokemon) {
			this.add('-anim', pokemon, 'Protect', pokemon);
			this.add('-anim', pokemon, 'Rock Polish', pokemon);
			return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
		},
		onHit(pokemon) {
			pokemon.addVolatile('stall');
		},
		condition: {
			duration: 1,
			onStart(defender) {
				this.add('-singleturn', defender, 'Protect');
			},
			onTryHitPriority: 3,
			onTryHit(defender, attacker, move) {
				if (this.checkMoveBypassesProtect(move, attacker, defender)) return;
				if (move.smartTarget) {
					move.smartTarget = false;
				} else {
					this.add('-activate', defender, 'move: Protect');
				}
				const lockedmove = attacker.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (attacker.volatiles['lockedmove'].duration === 2) {
						delete attacker.volatiles['lockedmove'];
					}
				}
				let statDebuff = 'spe';
				if (move.category === 'Special') statDebuff = 'spa';
				if (move.category === 'Physical') statDebuff = 'atk';
				const success = this.boost({ [statDebuff]: -1 }, attacker, defender, this.dex.getActiveMove("Shatter and Scatter"));
				if (success) {
					defender.formeChange('Sableye', this.dex.getActiveMove('Shatter and Scatter'), true);
					defender.canMegaEvo = 'Sableye-Mega';
					defender.switchFlag = 'shatterandscatter' as ID;
				}
				return this.NOT_FAIL;
			},
			onHit(defender, attacker, move) {
				if (move.isZOrMaxPowered) {
					let statDebuff = 'spe';
					if (move.category === 'Special') statDebuff = 'spa';
					if (move.category === 'Physical') statDebuff = 'atk';
					const success = this.boost({ [statDebuff]: -2 }, attacker, defender, this.dex.getActiveMove("Shatter and Scatter"));
					if (success) {
						defender.formeChange('Sableye', this.dex.getActiveMove('Shatter and Scatter'), true);
						defender.canMegaEvo = 'Sableye-Mega';
						defender.switchFlag = 'shatterandscatter' as ID;
					}
				}
			},
		},
		target: "self",
		type: "Dark",
	},

	// Billo
	hackcheck: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Cosmog: 80%: Change into Lunala, else Solgaleo.",
		desc: "This move has an 80% chance of transforming the user into Lunala. It has a 20% chance of instead transforming the user into Solgaleo, boosting its Attack by 1 stage, preventing it from switching out,  and causing it to faint after three turns, akin to Perish Song. This move cannot be used successfully unless the user's current form, while considering Transform, is Cosmog.",
		name: "Hack Check",
		gen: 9,
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, bypasssub: 1, failcopycat: 1 },
		onTry(attacker) {
			if (attacker.species.name === 'Cosmog') {
				return;
			}
			this.hint("Only Cosmog can use this move.");
			this.attrLastMove('[still]');
			this.add('-fail', attacker, 'move: Hack Check');
			return null;
		},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onHit(defender, attacker, move) {
			if (this.randomChance(1, 5)) {
				changeSet(this, attacker, ssbSets['Billo-Solgaleo'], true);
				attacker.addVolatile('trapped', attacker, move, 'trapper');
				attacker.addVolatile('perishsong');
				this.add('-start', attacker, 'perish3', '[silent]');
				this.boost({ atk: 1 }, attacker, attacker, move);
				this.add(`c:|${getName('Billo')}|This is a streamer mon, you're banned from the room.`);
			} else {
				changeSet(this, attacker, ssbSets['Billo-Lunala'], true);
				this.add(`c:|${getName('Billo')}|Everything checks out, remember to report any suspicious mons to staff!`);
			}
		},
		target: "self",
		type: "Normal",
	},

	// blazeofvictory
	veto: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Protects user, Disables attackers.",
		desc: "Nearly always moves first. The user is protected from most attacks made by other Pokemon during this turn. If a targeted move is blocked during this effect, the move used by the defender is disabled and cannot be selected for 4 turns. This move cannot disable more than one move at a time. This move fails if the user moves last, and has an increasing chance to fail when used consecutively.",
		name: "Veto",
		gen: 9,
		pp: 10,
		priority: 3,
		flags: { noassist: 1, failcopycat: 1 },
		stallingMove: true,
		volatileStatus: 'veto',
		onPrepareHit(pokemon) {
			return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
		},
		onHit(pokemon) {
			pokemon.addVolatile('stall');
		},
		condition: {
			duration: 1,
			onStart(defender) {
				this.add('-singleturn', defender, 'move: Protect');
			},
			onTryHitPriority: 3,
			onTryHit(defender, attacker, move) {
				if (this.checkMoveBypassesProtect(move, attacker, defender)) return;
				if (move.smartTarget) {
					move.smartTarget = false;
				} else {
					this.add('-activate', defender, 'move: Protect');
				}
				const lockedmove = attacker.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (attacker.volatiles['lockedmove'].duration === 2) {
						delete attacker.volatiles['lockedmove'];
					}
				}
				if (!attacker.volatiles['disable']) {
					attacker.addVolatile('disable', this.effectState.defender);
				}
				return this.NOT_FAIL;
			},
			onHit(defender, attacker, move) {
				if (move.isZOrMaxPowered && !attacker.volatiles['disable']) {
					attacker.addVolatile('disable', this.effectState.defender);
				}
			},
		},
		target: "self",
		type: "Normal",
	},

	// Blitz
	geyserblast: {
		accuracy: 95,
		basePower: 100,
		category: "Special",
		shortDesc: "Fire + Water-type attack. Ignores weather.",
		desc: "This move combines Fire in its type effectiveness against the defender and does not increase or decrease damage dealt based on the current weather condition.",
		name: "Geyser Blast",
		gen: 9,
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onPrepareHit() {
			this.attrLastMove('[anim] Steam Eruption');
		},
		onEffectiveness(typeMod, defender, type, move) {
			return typeMod + this.dex.getEffectiveness('Fire', type);
		},
		target: "normal",
		type: "Water",
	},

	// Breadey
	bakersdouzeoff: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Wake up -> Wish + Substitute -> Baton Pass.",
		desc: "The user wakes up if it is asleep. Then, the user uses the moves Wish, Substitute, and Baton Pass in that order. If the user does not have enough HP to set a Substitute, the rest of the effects of the move will still occur.",
		name: "Baker's Douze Off",
		gen: 9,
		pp: 15,
		priority: 1,
		flags: {},
		sleepUsable: true,
		slotCondition: 'Wish',
		volatileStatus: 'substitute',
		onPrepareHit(pokemon) {
			this.attrLastMove('[anim] Teleport');
			if (pokemon.status === 'slp') pokemon.cureStatus();
		},
		onTry(attacker, defender, move) {
			if (attacker.volatiles['substitute'] ||
				attacker.hp <= attacker.maxhp / 4 || attacker.maxhp === 1) { // Shedinja clause
				delete move.volatileStatus;
			}
		},
		onHit(defender, attacker, move) {
			if (move.volatileStatus) this.directDamage(defender.maxhp / 4);
		},
		onAfterMoveSecondarySelf(attacker) {
			if (this.canSwitch(attacker.side)) {
				this.actions.useMove('batonpass', attacker);
				attacker.skipPursuit = false;
			}
		},
		target: "self",
		type: "Normal",
	},

	// Cake
	rolesystem: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Protects, changes set. Can't use twice in a row.",
		// it was easier to do it this way rather than implement failing on consecutive uses
		desc: "Nearly always moves first. This move cannot be selected if it was the last move used by this Pokemon. The user is protected from most attacks made by other Pokemon during this turn, and all of the user's stat changes are set to 0. Then, the user gains varying stat boosts and changes its moveset based on the role it picks. Fast Attacker: +2 Attack, +4 Speed with Hyper Drill, Combat Torque, and Extreme Speed. Bulky Setup: +1 Attack, +1 Defense, +2 Special Defense with Coil, Body Slam, and Heal Order. Bulky Support: +2 Defense, +2 Special Defense with Heal Order and any two of Ceaseless Edge, Stone Axe, Mortal Spin, and G-Max Steelsurge. Wallbreaker: +6 Special Attack with Blood Moon.",
		name: "Role System",
		gen: 9,
		pp: 40,
		priority: 6,
		flags: { protect: 1, mirror: 1, cantusetwice: 1, failcopycat: 1 },
		onTry(attacker) {
			if (attacker.species.baseSpecies === 'Dunsparce') {
				return;
			}
			this.attrLastMove('[still]');
			this.add('-fail', attacker, 'move: Role System');
			this.hint("Only a Pokemon whose form is Dunsparce can use this move.");
			return null;
		},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Haze', defender);
		},
		onHit(defender, attacker, move) {
			if (this.randomChance(1, 256)) {
				this.add('-activate', defender, 'move: Celebrate');
			} else {
				defender.clearBoosts();
				this.add('-clearboost', defender);
				defender.addVolatile('protect');
				const set = this.random(4);
				const newMoves = [];
				let role = '';
				switch (set) {
				case 0:
					newMoves.push('hyperdrill', 'combattorque', 'extremespeed');
					role = 'Fast Attacker';
					this.boost({ atk: 2, spe: 4 });
					break;
				case 1:
					newMoves.push('coil', 'bodyslam', 'healorder');
					role = 'Bulky Setup';
					this.boost({ atk: 1, def: 1, spd: 2 });
					break;
				case 2:
					const varMoves = ['Ceaseless Edge', 'Stone Axe', 'Mortal Spin', 'G-Max Steelsurge'];
					const move1 = this.sample(varMoves);
					const move2 = this.sample(varMoves.filter(i => i !== move1));
					newMoves.push('healorder', move1, move2);
					role = 'Bulky Support';
					this.boost({ def: 2, spd: 2 });
					break;
				case 3:
					newMoves.push('bloodmoon', 'bloodmoon', 'bloodmoon');
					role = 'Wallbreaker';
					this.boost({ spa: 6 });
					break;
					// removing moveslots becomes very messy so this was the next best thing
				}
				this.add('-message', `Cake takes up the role of ${role}!`);
				for (let i = 0; i < 3; i++) {
					const replacement = this.dex.moves.get(newMoves[i]);
					const replacementMove = {
						move: replacement.name,
						id: replacement.id,
						pp: replacement.pp,
						maxpp: replacement.pp,
						defender: replacement.defender,
						disabled: false,
						used: false,
					};
					attacker.moveSlots[i] = replacementMove;
					attacker.baseMoveSlots[i] = replacementMove;
				}
			}
		},
		target: "self",
		type: "Normal",
		// bird type crashes during testing (runStatusImmunity for Bird at sim\pokemon.ts:2101:10). no-go.
	},

	// calmvibes
	goodvibesonly: {
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		shortDesc: "Raises the user's Speed by 1 stage.",
		desc: "Has a 100% chance to raise the user's Speed by 1 stage.",
		name: "Good Vibes Only",
		gen: 9,
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, contact: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Aqua Step', defender);
		},
		secondary: {
			chance: 100,
			self: {
				boosts: {
					spe: 1,
				},
			},
		},
		target: "normal",
		type: "Fairy",
	},

	// Cassiopeia
	testinginproduction: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "+2, -2 to random stats, small chance of harm.",
		desc: "The user boosts a random stat by 2 stages, and the user lowers a random stat by 2 stages. These can be the same stat, and cannot include Accuracy or Evasion. Independently, there is a 10% chance for the user to lose 10% of their maximum HP, and there is a 5% chance for the user to gain a random non-volatile status condition.",
		name: "Testing in Production",
		gen: 9,
		pp: 5,
		priority: 0,
		flags: {},
		onPrepareHit() {
			this.attrLastMove('[anim] Curse');
		},
		onHit(pokemon) {
			this.add(`c:|${getName((pokemon.illusion || pokemon).name)}|Please don't break...`);
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
					this.add(`c:|${getName((pokemon.illusion || pokemon).name)}|Well. Guess that broke. Time to roll back.`);
					return;
				} else {
					boost[randomStat] = -2;
				}
			}

			this.boost(boost, pokemon, pokemon);
		},
		onAfterMove(pokemon) {
			if (this.randomChance(1, 10)) {
				this.add(`c:|${getName((pokemon.illusion || pokemon).name)}|Ouch! That crash is really getting on my nerves...`);
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

				this.add(`c:|${getName((pokemon.illusion || pokemon).name)}|Darn. A bug ${statusText} me. Guess I should have tested this first.`);
				pokemon.setStatus(status);
			}
		},
		target: "self",
		type: "Electric",
	},

	// chaos
	outage: {
		accuracy: 95,
		basePower: 110,
		category: "Special",
		shortDesc: "Clear Smog + Taunt + Embargo.",
		desc: "If this move is successful, the defender has all stat stages reset to 0, cannot use status moves for the next 3 turns, and cannot gain any effect from held items for 5 turns. Z-Crystals and forme-changing items are unaffected.",
		name: "Outage",
		gen: 9,
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Dark Pulse', defender);
		},
		secondaries: [
			{
				chance: 100,
				volatileStatus: 'taunt',
			}, {
				chance: 100,
				volatileStatus: 'embargo',
			},
			{
				chance: 100,
				onHit(defender) {
					defender.clearBoosts();
					this.add('-clearboost', defender);
				},
			},
		],
		target: "normal",
		type: "Dark",
	},

	// Chloe
	detodaslasflores: {
		accuracy: 90,
		basePower: 90,
		category: "Physical",
		shortDesc: "Sets Grassy Terrain before. -50% HP on miss.",
		desc: "Before attacking, this move will set Grassy Terrain for 5 turns. If the attack is not successful, the user loses half of its maximum HP, rounded down, as crash damage.",
		name: "De Todas las Flores",
		gen: 9,
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, gravity: 1 },
		hasCrashDamage: true,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.field.setTerrain('grassyterrain');
			this.add('-anim', attacker, 'High Jump Kick', defender);
		},
		onMoveFail(defender, attacker, move) {
			this.damage(attacker.baseMaxhp / 2, attacker, attacker, this.dex.conditions.get('High Jump Kick'));
		},
		target: "normal",
		type: "Grass",
	},

	// Chris
	antidote: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Antidote",
		shortDesc: "Heal 50% HP + 3 turn Magnet Rise.",
		desc: "The user restores 1/2 of its maximum HP, rounded half up. If the user is not currently under the effect of Magnet Rise, it gains the effect of Magnet Rise for 3 turns, causing it to be immune to all Ground-type moves except Thousand Arrows for the duration.",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, heal: 1, gravity: 1, metronome: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(pokemon) {
			this.add('-anim', pokemon, 'Recover', pokemon);
			this.add('-anim', pokemon, 'Magnet Rise', pokemon);
		},
		onTry(attacker, defender, move) {
			if (defender.volatiles['smackdown'] || defender.volatiles['ingrain']) return false;

			// Additional Gravity check for Z-move variant
			if (this.field.getPseudoWeather('Gravity')) {
				this.add('cant', attacker, 'move: Gravity', move);
				return null;
			}
		},
		onHit(defender, attacker, move) {
			const success = !!this.heal(this.modify(attacker.maxhp, 0.25));
			return attacker.addVolatile('magnetrise', attacker, move) || success;
		},
		target: "self",
		type: "Normal",
	},

	// ciran
	summonmonsterviiifiendishmonstrouspiplupedecolossal: {
		accuracy: 90,
		basePower: 60,
		basePowerCallback(pokemon, defender, move) {
			if (move.hit === 1) return 60;
			if (move.hit === 2) return 0;
			return 22;
		},
		category: "Physical",
		shortDesc: "60 BP Bite->Toxic->2-5 multihit w/ 20 BP each.",
		desc: "The user calls the following effects in order: a 100% accurate 60 Base Power Poison-type attack with a 20% chance to cause the defender to flinch; 100% accurate Toxic; and 2-5 90% accurate 20 Base Power Poison-type attacks.",
		name: "Summon Monster VIII: Fiendish monstrous Piplupede, Colossal",
		gen: 9,
		pp: 15,
		priority: 1,
		flags: { protect: 1, contact: 1, mirror: 1 },
		multihit: [3, 7],
		self: {
			volatileStatus: 'summonmonsterviiifiendishmonstrouspiplupedecolossal',
		},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Crunch', defender);
			this.add('-anim', attacker, 'Fury Swipes', defender);
		},
		condition: {
			duration: 1,
			noCopy: true,
			onAccuracy(accuracy, defender, attacker, move) {
				if (move.hit <= 2) return 100;
				return 90;
			},
		},
		secondaries: [
			{
				chance: 20,
				onHit(defender, attacker, move) {
					if (move.hit !== 1) return;
					defender.addVolatile('flinch', attacker, move);
				},
			},
			{
				chance: 100,
				onHit(defender, attacker, move) {
					if (move.hit !== 2) return;
					defender.trySetStatus('tox', attacker, move);
				},
			},
		],
		onAfterMove(attacker, defender, move) {
			this.add(`c:|${getName((attacker.illusion || attacker).name)}|There's no way this'll faint in one punch!`);
		},
		target: "allAdjacentFoes",
		type: "Poison",
	},

	// Clefable
	giveaway: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "User switches, passing stat changes and more.",
		desc: "The user is replaced with another Pokemon in its party. The selected Pokemon has the user's stat stage changes, confusion, and certain move effects transferred to it.",
		name: "Giveaway!",
		gen: 9,
		pp: 10,
		priority: 1,
		flags: { metronome: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Teleport', defender);
			this.add('-anim', attacker, 'Baton Pass', defender);
		},
		// Baton Pass clones are stupid client side so we're doing this
		onHit(defender) {
			this.actions.useMove('batonpass', defender);
		},
		target: "self",
		type: "Normal",
	},

	// Clem
	o: {
		accuracy: 100,
		basePower: 120,
		category: "Special",
		shortDesc: "Phys if Atk > SpA. Flips user.",
		desc: "This move becomes a physical attack if the user's Attack is greater than its Special Attack, including stat stage changes. This move's type depends on the user's primary type. If this move is successful and the user is an Avalugg, it either gains or loses the Flipped condition, changing its moveset and base stats. When under the Flipped condition, Avalugg's Base Stats are 95/46/44/184/116/95 and its moveset changes to Earth Power, Volt Switch, and Heal Pulse. This move is super effective against Kennedy.",
		name: "(╯°o°）╯︵ ┻━┻",
		pp: 10,
		priority: 0,
		flags: { protect: 1, failcopycat: 1, nosketch: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Malicious Moonsault', defender);
			this.add('-anim', attacker, 'Blizzard', defender);
		},
		onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
		onModifyType(move, pokemon) {
			let type = pokemon.getTypes()[0];
			if (type === "Bird") type = "???";
			if (type === "Stellar") type = pokemon.getTypes(false, true)[0];
			move.type = type;
		},
		onEffectiveness(typeMod, defender, type) {
			if (defender?.name === 'Kennedy') return 1;
		},
		onHit(defender, attacker, move) {
			if (attacker.illusion || attacker.baseSpecies.baseSpecies !== 'Avalugg') return;
			if (attacker.volatiles['flipped']) {
				attacker.removeVolatile('flipped');
				changeSet(this, attacker, ssbSets['Clem']);
			} else {
				attacker.addVolatile('flipped', attacker, move);
				changeSet(this, attacker, ssbSets['Clem-Flipped']);
			}
		},
		target: "normal",
		type: "Normal",
	},

	// clerica
	stockholmsyndrome: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Curses and traps foe. User loses 1/2 HP.",
		desc: "The user loses 1/2 of its maximum HP, rounded down and even if it would cause fainting, in exchange for the defender losing 1/4 of its maximum HP, rounded down, at the end of each turn while it is active and becoming unable to switch out.",
		name: "Stockholm Syndrome",
		pp: 5,
		priority: 0,
		flags: { bypasssub: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Curse', defender);
			this.add('-anim', attacker, 'Block', defender);
		},
		onHit(defender, attacker, move) {
			let success = false;
			if (!defender.volatiles['curse']) {
				this.directDamage(attacker.maxhp / 2, attacker, attacker);
				defender.addVolatile('curse');
				success = true;
			}
			return defender.addVolatile('trapped', attacker, move, 'trapper') || success;
		},
		zMove: { effect: 'heal' },
		target: "normal",
		type: "Ghost",
	},

	// Clouds
	windsofchange: {
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		shortDesc: "User sets Tailwind and switches out.",
		desc: "If this attack is successful and the user has not fainted, the user switches out even if it is trapped and is replaced immediately by a selected party member, and its party members have their Speed doubled for 4 turns.",
		name: "Winds of Change",
		pp: 15,
		priority: 0,
		flags: { protect: 1 },
		self: {
			sideCondition: 'tailwind',
		},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Tailwind', defender);
			this.add('-anim', attacker, 'U-turn', defender);
		},
		selfSwitch: true,
		target: "normal",
		type: "Flying",
	},

	// Coolcodename
	haxerswill: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		shortDesc: "70% +1 SpA/Spe & Focus Energy, else lose boosts.",
		desc: "This move has a 70% chance to boost the user's Special Attack and Speed by 1 stage and grant the user an increased chance of dealing critical hits. If it does not do this, the user's positive stat stage changes will instead be removed.",
		name: "Haxer's Will",
		gen: 9,
		pp: 15,
		priority: 0,
		flags: {},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Clangorous Soul', attacker);
			this.add('-anim', attacker, 'Focus Energy', attacker);
		},
		onHit(pokemon) {
			if (this.randomChance(7, 10)) {
				this.boost({ spa: 1, spe: 1 });
				pokemon.addVolatile('focusenergy');
			} else {
				pokemon.clearBoosts();
				this.add('-clearboost', pokemon);
			}
		},
		target: "self",
		type: "Normal",
	},

	// Corthius
	monkeybeatup: {
		accuracy: 100,
		basePower: 20,
		category: "Physical",
		shortDesc: "Hits 4-5 times. +1 priority under Grassy Terrain.",
		desc: "Usually moves first when Grassy Terrain is in effect. This move has a 50% chance to hit 4 times and a 50% chance to hit 5 times.",
		name: "Monkey Beat Up",
		gen: 9,
		pp: 10,
		priority: 0,
		multihit: [4, 5],
		flags: { protect: 1, contact: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Beat Up', defender);
			this.add('-anim', attacker, 'Wood Hammer', defender);
		},
		onModifyPriority(priority, attacker, defender, move) {
			if (this.field.isTerrain('grassyterrain') && attacker.isGrounded()) {
				return priority + 1;
			}
		},
		target: "normal",
		type: "Grass",
	},

	// Dawn of Artemis
	magicalfocus: {
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Magical Focus",
		shortDesc: "Move type cycles. Sets Reflect. Fail if Ultra.",
		desc: "This move's type cycles between Fire, Electric, and Ice depending on the current turn number, starting at Fire on turn 1, Electric on turn 2, Ice on turn 3, and repeating this pattern on future turns. For 5 turns, all Pokemon on the user's side of the field take 0.5x damage from physical attacks. This move fails if the user is Necrozma-Ultra.",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onTryMove(defender, attacker, move) {
			switch (move.type) {
			case 'Fire':
				this.attrLastMove('[anim] Flamethrower');
				break;
			case 'Electric':
				this.attrLastMove('[anim] Thunderbolt');
				break;
			case 'Ice':
				this.attrLastMove('[anim] Ice Beam');
				break;
			default:
				this.attrLastMove('[anim] Hyper Beam');
				break;
			}
		},
		onModifyType(move) {
			if (this.turn % 3 === 1) {
				move.type = 'Fire';
			} else if (this.turn % 3 === 2) {
				move.type = 'Electric';
			} else {
				move.type = 'Ice';
			}
		},
		onDisableMove(pokemon) {
			if (pokemon.species.id === 'necrozmaultra') pokemon.disableMove('magicalfocus');
		},
		self: {
			sideCondition: 'reflect',
		},
		target: "normal",
		type: "Normal",
	},

	// DaWoblefet
	superegoinflation: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "User heals 25% HP; Target: +2 Atk/SpA + Taunt.",
		desc: "The user heals 1/4 of its maximum HP. The defender's Attack and Special Attack are raised by 2 stages each, and the defender cannot use status moves for 3 turns.",
		name: "Super Ego Inflation",
		gen: 9,
		pp: 5,
		priority: -7,
		flags: { protect: 1, mirror: 1, bypasssub: 1, reflectable: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Follow Me', attacker);
			this.add('-anim', defender, 'Swords Dance', defender);
			this.add('-anim', defender, 'Nasty Plot', defender);
		},
		onHit(defender, attacker) {
			this.heal(attacker.maxhp / 4, attacker);
			this.boost({ atk: 2, spa: 2 });
			defender.addVolatile('taunt');
		},
		target: "normal",
		type: "Normal",
	},

	// deftinwolf
	trivialpursuit: {
		accuracy: 100,
		basePower: 70,
		basePowerCallback(pokemon, defender, move) {
			// You can't get here unless the pursuit succeeds
			if (defender.beingCalledBack || defender.switchFlag) {
				this.debug('Trivial Pursuit damage boost');
				return move.basePower * 2;
			}
			return move.basePower;
		},
		category: "Physical",
		shortDesc: "If foe is switching out, 2x power. Doesn't KO.",
		desc: "If an opposing Pokemon switches out this turn, this move hits that Pokemon before it leaves the field, even if it was not the original defender. If the user moves after an opponent using Flip Turn, Parting Shot, Teleport, U-turn, or Volt Switch, but not Baton Pass, it will hit that opponent before it leaves the field. Power doubles and no accuracy check is done if the user hits an opponent switching out, and the user's turn is over. Leaves the defender with at least 1 HP.",
		name: "Trivial Pursuit",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		onPrepareHit() {
			this.attrLastMove('[anim] Pursuit');
		},
		beforeTurnCallback(pokemon) {
			pokemon.addVolatile(
				'trivialpursuit', pokemon, this.dex.getActiveMove('trivialpursuit')
			);
		},
		onModifyMove(move, attacker, defender) {
			if (defender?.beingCalledBack || defender?.switchFlag) {
				move.accuracy = true;
				move.tracksTarget = true;
			}
		},
		condition: {
			duration: 1,
			onFoeBeforeSwitchOut(pokemon) {
				const attacker: Pokemon = this.effectState.attacker;
				this.debug('Trivial Pursuit start');
				if (!attacker.isAdjacent(pokemon) || !attacker.hp ||
					(attacker.volatiles['encore'] && attacker.volatiles['encore'].move !== 'trivialpursuit') ||
					!this.queue.cancelMove(attacker)) return;
				// Run through each action in queue to check if the Pursuit user is supposed to Mega Evolve this turn.
				// If it is, then Mega Evolve before moving.
				if (attacker.canMegaEvo || attacker.canUltraBurst || attacker.canTerastallize) {
					for (const [actionIndex, action] of this.queue.entries()) {
						if (action.pokemon === attacker) {
							if (action.choice === 'megaEvo') {
								this.actions.runMegaEvo(attacker);
							} else if (action.choice === 'terastallize') {
								this.actions.terastallize(attacker);
							} else {
								continue;
							}
							this.queue.list.splice(actionIndex, 1);
							break;
						}
					}
				}
				pokemon.removeVolatile('destinybond');
				this.actions.runMove(
					'trivialpursuit', attacker, attacker.getLocOf(pokemon),
					{ sourceEffect: this.effectState.sourceEffect }
				);
			},
		},
		onDamagePriority: -20,
		onDamage(damage, defender, attacker, effect) {
			if (damage >= defender.hp) return defender.hp - 1;
		},
		target: "normal",
		type: "Dark",
	},

	// dhelmise
	emp: {
		accuracy: true,
		basePower: 0,
		damageCallback(pokemon, defender) {
			return this.clampIntRange(Math.floor(defender.getUndynamaxedHP() / 3), 1);
		},
		category: "Special",
		shortDesc: "Hacks defender, trapping + disabling a move.",
		desc: "Inflicts the defender with the Hacked volatile status. When a Pokemon is inflicted with Hacked, they become trapped for 3 turns and have 1 of their moves disabled at random.",
		name: "EMP",
		gen: 9,
		pp: 5,
		priority: 0,
		ignoreImmunity: true,
		flags: {},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Boomburst', defender);
		},
		onTryHit(defender, attacker, move) {
			if (defender?.volatiles['hacked']) {
				this.attrLastMove('[still]');
				this.add('-fail', attacker);
				return this.NOT_FAIL;
			}
		},
		onHit(defender, attacker, move) {
			if (attacker.m.stealth) {
				attacker.m.stealth = false;
				this.add('-end', attacker, 'stealth');
			}
			defender.addVolatile('hacked');
		},
		target: "normal",
		type: "Ghost",
	},

	// EasyOnTheHills
	snacktime: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Charges.Turn 2: +2 Atk/Def, heal 33% for 3 turns.",
		desc: "Boosts the user's Attack and Defense by 2 stages, and heals the user for 1/3 of its maximum HP at the end of each turn for 3 turns. This attack charges on the first turn and executes on the second. This move will fail if it is already in effect.",
		name: "Snack Time",
		pp: 10,
		priority: 0,
		flags: {},
		volatileStatus: 'snack',
		onTryMove(attacker, defender, move) {
			if (attacker.volatiles['snack']) {
				this.add('-fail', attacker, 'move: Snack Time');
				this.attrLastMove('[still]');
				return null;
			}
			if (attacker.removeVolatile(move.id)) {
				this.attrLastMove('[still]');
				this.add('-anim', attacker, 'Shell Smash', attacker);
				return;
			}
			this.attrLastMove('[still]');
			this.add('-anim', attacker, 'Geomancy', attacker);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		boosts: {
			atk: 2,
			def: 2,
		},
		// passive recovery implemented in conditions.ts
		target: "self",
		type: "Normal",
	},

	// Elliot
	teaparty: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Recover & Refresh. 7/8 get Boiled, 1/8 Beefed.",
		desc: "The user heals 1/2 of its maximum HP and cures its non-volatile status condition. The user has a 7/8 chance of gaining the Boiled condition, removing all previously-added extra types, adding a Water typing to the user, replacing its ability with Speed Boost, and replacing Teatime or Body Press with Steam Eruption if it exists on the set; and a 1/8 chance of gaining the Beefed condition, removing all previously-added extra types, adding a Fighting typing to the user, replacing its ability with Stamina, and replacing Teatime or Steam Eruption with Body Press.",
		name: "Tea Party",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, heal: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Milk Drink', attacker);
		},
		onHit(pokemon) {
			this.heal(pokemon.baseMaxhp / 2);
			pokemon.cureStatus();
			let newMove = "";
			let backupMove = "";
			if (this.randomChance(7, 8)) { // get boiled
				pokemon.removeVolatile('beefed');
				pokemon.addVolatile('boiled');
				pokemon.setAbility("Speed Boost");
				newMove = 'steameruption';
				backupMove = 'bodypress';
				if (!pokemon.hasType('Water') && pokemon.addType('Water')) {
					this.add('-start', pokemon, 'typeadd', 'Water', '[from] move: Tea Party');
				}
				this.add(`c:|${getName((pokemon.illusion || pokemon).name)}|Just tea, thank you`);
			} else { // get beefed
				pokemon.removeVolatile('boiled');
				pokemon.addVolatile('beefed');
				pokemon.setAbility("Stamina");
				newMove = 'bodypress';
				backupMove = 'steameruption';
				if (!pokemon.hasType('Fighting') && pokemon.addType('Fighting')) {
					this.add('-start', pokemon, 'typeadd', 'Fighting', '[from] move: Tea Party');
				}
				this.add(`c:|${getName((pokemon.illusion || pokemon).name)}|BOVRIL TIME`);
			}
			// -start for beefed and boiled is not necessary, i put it in there for an indicator
			// as to what form sinistea is currently using. backupMove also eases the form switch
			let teaIndex = pokemon.moves.indexOf('teatime');
			const replacement = this.dex.moves.get(newMove);
			if (teaIndex < 0) {
				if (pokemon.moves.includes(backupMove)) {
					teaIndex = pokemon.moves.indexOf(backupMove);
				} else {
					return;
				}
			}
			const newMoveSlot = {
				move: replacement.name,
				id: replacement.id,
				pp: replacement.pp,
				maxpp: replacement.pp,
				defender: replacement.defender,
				disabled: false,
				used: false,
			};
			pokemon.moveSlots[teaIndex] = newMoveSlot;
		},
		defender: 'self',
		type: "Flying",
	},

	// Elly
	sustainedwinds: {
		accuracy: 90,
		basePower: 20,
		category: "Special",
		shortDesc: "Hits 5 times.",
		name: "Sustained Winds",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, wind: 1 },
		onPrepareHit() {
			this.attrLastMove('[anim] Bleakwind Storm');
		},
		multihit: 5,
		defender: 'normal',
		type: "Flying",
	},

	// Emboar02
	insertboarpunhere: {
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		shortDesc: "Has 33% recoil. Switch after using.",
		desc: "If the defender lost HP, the user takes recoil damage equal to 33% of the HP lost by the defender, rounded half up, but not less than 1 HP. If this move is successful and the user has not fainted, the user switches out even if it is trapped and is replaced immediately by a selected party member. The user does not switch out if there are no unfainted party members, or if the defender switched out using an Eject Button or through the effect of the Emergency Exit or Wimp Out Abilities.",
		name: "Insert boar pun here",
		pp: 20,
		priority: 0,
		flags: { protect: 1, contact: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Collision Course', defender);
			this.add('-anim', attacker, 'U-turn', defender);
		},
		selfSwitch: true,
		recoil: [33, 100],
		defender: 'normal',
		type: "Fighting",
	},

	// Fame
	solidarity: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		shortDesc: "Creates a Substitute and sets Leech Seed.",
		desc: "The user takes 1/6 of its maximum HP, rounded down, and puts it into a substitute to take its place in battle. The Pokemon at the user's position steals 1/8 of the defender's maximum HP, rounded down, at the end of each turn. If either of the affected Pokemon uses Baton Pass, its respective effect will remain for its replacement.",
		name: "Solidarity",
		pp: 15,
		priority: 0,
		flags: { protect: 1, reflectable: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Substitute');
			this.add('-anim', attacker, 'Leech Seed', defender);
		},
		onHit(defender, attacker) {
			if (defender.hasType('Grass') || defender.isProtected()) return null;
			defender.addVolatile('leechseed', attacker);
		},
		self: {
			onHit(defender, attacker) {
				if (attacker.volatiles['substitute']) return;
				if (attacker.hp <= attacker.maxhp / 6 || attacker.maxhp === 1) { // Shedinja clause
					this.add('-fail', attacker, 'move: Substitute', '[weak]');
				} else {
					attacker.addVolatile('substitute');
					this.directDamage(attacker.maxhp / 6);
				}
			},
		},
		defender: 'normal',
		type: "Grass",
	},

	// Felucia
	riggeddice: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		shortDesc: "Stat changes: inverts, else Taunt. User switches.",
		desc: "If the defender has any stat stage changes, the defender's positive stat stages become negative and vice versa. If the defender does not have any stat stage changes, the defender cannot use status moves for 3 turns. If this move is successful, the user switches out even if it is trapped and is replaced immediately by a selected party member. The user does not switch out if there are no unfainted party members.",
		name: "Rigged Dice",
		pp: 10,
		priority: 0,
		flags: { protect: 1, reflectable: 1 },
		selfSwitch: true,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Smart Strike', attacker);
		},
		onHit(defender, attacker) {
			let success = false;
			let i: BoostID;
			for (i in defender.boosts) {
				if (defender.boosts[i] === 0) continue;
				defender.boosts[i] = -defender.boosts[i];
				success = true;
			}
			if (success) {
				this.add('-invertboost', defender, '[from] move: Rigged Dice');
			} else {
				defender.addVolatile('taunt', attacker);
			}
		},
		defender: 'normal',
		type: "Bug",
	},

	// Froggeh
	cringedadjoke: {
		accuracy: 90,
		basePower: 90,
		category: "Physical",
		shortDesc: "Confuses the foe. Foe self-hits: +1 Atk/Def.",
		desc: "Confuses the defender. When the defender hits itself in confusion from this move, the user's Attack and Defense are boosted by 1 stage.",
		name: "Cringe Dad Joke",
		pp: 10,
		priority: 0,
		flags: { protect: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Dizzy Punch', defender);
			this.add('-anim', attacker, 'Bulk Up', attacker);
		},
		self: {
			volatileStatus: 'cringedadjoke',
		},
		secondary: {
			chance: 100,
			volatileStatus: 'confusion',
		},
		defender: 'normal',
		type: "Fighting",
		// confusion self-hit stat bonus implemented as an innate because it doesn't work as a move effect
	},

	// Frostyicelad
	puffyspikydestruction: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Turn 1 out: DDance, TSpikes, -Psn type.",
		desc: "Nearly always moves first. Removes the user's Poison typing if it has one, and boosts the user's Attack and Speed by 1 stage. Sets one layer of Toxic Spikes on the opposing side of the field, poisoning all grounded, non-Poison-type Pokemon that switch in. Fails unless it's the user's first turn on the field.",
		name: "Puffy Spiky Destruction",
		pp: 5,
		priority: 4,
		flags: {},
		onTry(attacker) {
			if (attacker.activeMoveActions > 1) {
				this.hint("Puffy Spiky Destruction only works on your first turn out.");
				return false;
			}
		},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Quiver Dance', attacker);
			this.add('-anim', attacker, 'Spiky Shield', attacker);
			this.add('-anim', attacker, 'Toxic Spikes', defender);
		},
		onHit(defender, attacker, move) {
			attacker.setType(attacker.getTypes(true).filter(type => type !== "Poison"));
			this.add('-start', attacker, 'typechange', attacker.getTypes().join('/'), '[from] move: Puffy Spiky Destruction');
			const foeSide = attacker.side.foe;
			if (!foeSide.sideConditions['toxicspikes'] || foeSide.sideConditions['toxicspikes'].layers < 2) {
				foeSide.addSideCondition('toxicspikes', attacker, move);
			}
		},
		boosts: {
			spe: 1,
			atk: 1,
		},
		defender: 'self',
		type: "Poison",
	},

	// Frozoid
	flatoutfalling: {
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		shortDesc: "Sets Gravity.",
		desc: "Sets Gravity for 5 turns, multiplying the evasiveness of all active Pokemon by 0.6 and grounding them.",
		name: "Flat out falling",
		pp: 5,
		priority: 0,
		flags: { protect: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Head Smash', defender);
			this.add('-anim', attacker, 'Gravity', defender);
		},
		self: {
			onHit(attacker) {
				this.field.addPseudoWeather('gravity', attacker);
			},
		},
		defender: 'normal',
		type: "???",
	},

	// Ganjafin
	wigglingstrike: {
		accuracy: 95,
		basePower: 40,
		category: "Physical",
		shortDesc: "Applies Salt Cure and sets a layer of spikes.",
		desc: "Causes damage to the defender equal to 1/8 of its maximum HP (1/4 if the defender is Steel or Water type), rounded down, at the end of each turn during effect. This effect ends when the defender is no longer active. Sets a layer of Spikes on the defender's side of the field, damaging grounded foes when they switch in.",
		name: "Wiggling Strike",
		gen: 9,
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Water Pulse', defender);
			this.add('-anim', defender, 'Aqua Ring', defender);
		},
		self: {
			onHit(attacker) {
				for (const side of attacker.side.foeSidesWithConditions()) {
					side.addSideCondition('spikes');
				}
			},
		},
		secondary: {
			chance: 100,
			volatileStatus: 'saltcure',
		},
		target: "normal",
		type: "Water",
	},

	// Haste Inky
	hastyrevolution: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		shortDesc: "Clear foe stats+copies neg stats+inverts on user.",
		desc: "Resets the stat stages of the defender to 0. Then, the defender receives a copy of the user's negative stat stage changes, and the user's negative stat stage changes become positive.",
		name: "Hasty Revolution",
		pp: 10,
		priority: 4,
		flags: { protect: 1, mirror: 1, noassist: 1, failcopycat: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Pain Split', defender);
			return !!this.queue.willAct() && this.runEvent('StallMove', attacker);
		},
		onHit(defender, attacker, move) {
			attacker.addVolatile('stall');
			defender.clearBoosts();
			this.add('-clearboost', defender);
			let i: BoostID;
			for (i in attacker.boosts) {
				if (attacker.boosts[i] < 0) {
					defender.boosts[i] += attacker.boosts[i];
					this.add('-setboost', defender, i as string, defender.boosts[i], '[silent]');
					attacker.boosts[i] = -attacker.boosts[i];
					this.add('-setboost', attacker, i as string, attacker.boosts[i], '[silent]');
				}
			}
			this.add('-message', `${defender.name} received ${attacker.name}'s negative stat boosts!'`);
			this.add('-message', `${attacker.name} inverted their negative stat boosts!`);
		},
		stallingMove: true,
		self: {
			volatileStatus: 'protect',
		},
		target: "normal",
		type: "Normal",
	},

	// havi
	augurofebrietas: {
		accuracy: 100,
		basePower: 70,
		category: "Special",
		shortDesc: "Disables the defender's last move and switches.",
		desc: "The defender's last used move is disabled and cannot be selected for 4 turns. This move cannot disable more than one move at a time. The user then switches out even if it is trapped and is replaced immediately by a selected party member. The user does not switch out if there are no unfainted party members.",
		name: "Augur of Ebrietas",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onPrepareHit() {
			this.attrLastMove('[anim] Spirit Shackle');
		},
		onAfterHit(defender, attacker, move) {
			this.add(`c:|${getName((attacker.illusion || attacker).name)}|as you once did for the vacuous Rom,`);
		},
		selfSwitch: true,
		volatileStatus: 'disable',
		target: "normal",
		type: "Ghost",
	},

	// HiZo
	scapegoat: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "KO a teammate; gain more Atk/SpA/Spe if healthy.",
		desc: "A party member is selected and faints, raising the user's Attack, Special Attack, and Speed by 2 stages if the party member's HP is below 33%, by 3 stages if the party member's HP is between 33% and 66%, and by 4 stages if the party member's HP is above 66%. Fails if there are no non-fainted Pokemon on the user's side.",
		name: "Scapegoat",
		gen: 9,
		pp: 5,
		priority: 0,
		flags: {},
		onTryHit(attacker) {
			if (!this.canSwitch(attacker.side)) {
				this.attrLastMove('[still]');
				this.add('-fail', attacker);
				return this.NOT_FAIL;
			}
		},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Swords Dance', attacker);
		},
		onHit(defender, attacker) {
			this.add(`c:|${getName((attacker.illusion || attacker).name)}|Ok I have a stupid idea, just hear me out`);
			this.add('message', `A sacrifice is needed.`);
		},
		slotCondition: 'scapegoat',
		// fake switch a la revival blessing
		selfSwitch: true,
		condition: {
			duration: 1,
			// reviving implemented in side.ts, kind of
		},
		target: "self",
		type: "Dark",
	},

	// HoeenHero
	reprogram: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		shortDesc: "Rain Dance + Lock-On.",
		name: "Re-Program",
		pp: 10,
		priority: 0,
		flags: { protect: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Calm Mind', attacker);
			this.add('-anim', attacker, 'Geomancy', defender);
		},
		onHit(defender, attacker, move) {
			let success = false;
			if (this.field.setWeather('raindance', attacker, move)) {
				this.add('-message', 'HoeenHero made the environment easier to work with!');
				success = true;
			}
			if (attacker.addVolatile('lockon', defender)) {
				this.add('-message', 'HoeenHero double checked their work and fixed any errors!');
				this.add('-activate', attacker, 'move: Lock-On', `[of] ${defender}`);
				success = true;
			}
			if (success) {
				this.add('-message', 'HoeenHero reprograms the battle to be more beneficial to them!');
			}
		},
		target: "normal",
		type: "Psychic",
	},

	// hsy
	wonderwing: {
		accuracy: 90,
		basePower: 150,
		category: "Physical",
		shortDesc: "No dmg rest of turn. Next turn user has -1 prio.",
		desc: "Usually moves last. The user becomes immune to all damage sources for the rest of the turn. The turn after this move is used, the user's moves all gain -1 priority. This move ignores all negative effects associated with contact moves.",
		name: "Wonder Wing",
		pp: 5,
		priority: 0,
		flags: { contact: 1 },
		// No negative contact effects implemented in Battle#checkMovesMakeContact
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Electric Terrain', attacker);
			this.add('-anim', attacker, 'Giga Impact', defender);
		},
		self: {
			volatileStatus: 'wonderwing',
		},
		condition: {
			noCopy: true,
			duration: 2,
			onStart(pokemon) {
				this.add('-start', pokemon, 'Wonder Wing');
			},
			onRestart(defender, attacker, sourceEffect) {
				defender.removeVolatile('wonderwing');
			},
			onDamage(damage, defender, attacker, effect) {
				if (this.effectState.duration! < 2) return;
				this.add('-activate', attacker, 'move: Wonder Wing');
				return false;
			},
			onModifyPriority(relayVar, attacker, defender, move) {
				return -1;
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Wonder Wing', '[silent]');
			},
		},
		target: "normal",
		type: "Flying",
	},

	// Hydrostatics
	hydrostatics: {
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Hydrostatics",
		shortDesc: "70%:+1 SpA,50%:prz,Elec/Water. Differs when Tera.",
		desc: "If the user has not Terastallized, this move has a 70% chance to raise the user's Special Attack by 1 stage, has a 50% chance to paralyze the defender, and combines the Water type in its type effectiveness. When the user has Terastallized, this move is a purely Water-type attack that gains Same-Type Attack Bonus with Water-types, and it has an 80% chance to raise the user's Special Attack by 1 stage, has a 60% chance to change the defender's typing to Water, and is super effective against Water.",
		pp: 20,
		priority: 1,
		flags: { protect: 1, mirror: 1 },
		onModifyMove(move, attacker, defender) {
			if (attacker.terastallized) {
				move.type = 'Water';
			}
		},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			if (!attacker.terastallized) this.add('-anim', attacker, 'Charge Beam', attacker);
			else this.add('-anim', attacker, 'Water Pulse', defender);
		},
		onEffectiveness(typeMod, defender, type, move) {
			if (move.type === 'Electric') return typeMod + this.dex.getEffectiveness('Water', type);
			else if (type === 'Water' && move.type === 'Water') return 1;
		},
		secondary: {
			chance: 100,
			onHit(defender, attacker, move) {
				// None of these stack with Serene Grace
				if (!attacker.terastallized) {
					if (this.randomChance(70, 100)) {
						this.boost({ spa: 1 }, attacker);
					}
					if (this.randomChance(50, 100)) {
						if (defender.isActive) defender.trySetStatus('par', attacker, this.effect);
					}
				} else {
					if (this.randomChance(80, 100)) {
						this.boost({ spa: 1 }, attacker);
					}
					if (this.randomChance(60, 100)) {
						// Soak
						if (defender.getTypes().join() !== 'Water' && defender.setType('Water')) {
							this.add('-start', defender, 'typechange', 'Water');
						}
					}
				}
			},
		},
		target: "normal",
		type: "Electric",
	},

	// in the hills
	"102040": {
		accuracy: 100,
		basePower: 10,
		category: "Physical",
		name: "10-20-40",
		shortDesc: "Hits 3 times, 3rd hit crits. sets Safeguard.",
		desc: "Hits three times. Power increases to 20 for the second hit and 40 for the third. The third hit is always a critical hit unless the defender is under the effect of Lucky Chant or has the Battle Armor or Shell Armor Abilities. If this move deals damage, it applies the effect of Safeguard for 5 turns, protecting the user's team from confusion and non-volatile status conditions.",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		basePowerCallback(pokemon, defender, move) {
			return [10, 20, 40][move.hit - 1];
		},
		onTryHit(defender, attacker, move) {
			if (move.hit === 3) {
				move.willCrit = true;
			}
		},
		onPrepareHit() {
			this.attrLastMove('[anim] Triple Kick');
		},
		self: {
			sideCondition: 'safeguard',
		},
		multihit: 3,
		target: "normal",
		type: "Ground",
	},

	// ironwater
	jirachibanhammer: {
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		shortDesc: "Prevents the defender from switching out.",
		desc: "Prevents the defender from switching out. The defender can still switch out if it is holding Shed Shell or uses Baton Pass, Flip Turn, Parting Shot, Teleport, U-turn, or Volt Switch. If the defender leaves the field using Baton Pass, the replacement will remain trapped. The effect ends if the user leaves the field.",
		name: "Jirachi Ban Hammer",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		onPrepareHit() {
			this.attrLastMove('[anim] Gigaton Hammer');
		},
		secondary: {
			chance: 100,
			onHit(defender, attacker, move) {
				if (attacker.isActive) defender.addVolatile('trapped', attacker, move, 'trapper');
			},
		},
		target: "normal",
		type: "Steel",
	},

	// Irpachuza
	bibbidibobbidirands: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Changes defender to a Randbats set.",
		desc: "Z-Move requiring Irpatuzinium Z. Nearly always moves first. Permanently transforms the defender into a randomized Pokemon that would be generated in one of the following formats: Gen 9 Random Battle, Gen 9 Hackmons Cup, or Gen 9 Challenge Cup. In the vast majority of circumstances, this also prevents the defender from acting this turn.",
		name: "Bibbidi-Bobbidi-Rands",
		gen: 9,
		pp: 1,
		priority: 0,
		flags: { protect: 1 },
		onPrepareHit(defender, attacker) {
			this.attrLastMove('[anim] Doom Desire');
		},
		onHit(defender, attacker) {
			const formats = ['gen9randombattle', 'gen9hackmonscup', 'gen9challengecup1v1'];
			const randFormat = this.sample(formats);
			let msg;
			switch (randFormat) {
			case 'gen9randombattle':
				msg = "Ta-dah! You are now blessed with a set from the most popular format on the sim, hope you like it! n.n";
				break;
			case 'gen9hackmonscup':
				msg = "Hackmons Cup is like Rands but scrambled eggs, cheese and pasta. I'm sure you'll love it too n.n";
				break;
			case 'gen9challengecup1v1':
				msg = "The only difference between a Challenge Cup Pokémon and my in-game one is that the former actually surpassed lvl. 60, enjoy n.n";
				break;
			}
			let team = [] as PokemonSet[];
			const unModdedDex = this.dex.mod('gen9');
			let depth = 0;
			while (!team.length) {
				team = Teams.generate(randFormat, { name: defender.side.name });
				if (depth >= 50) break; // Congrats you won the lottery!
				team = team.filter(p => {
					const baseSpecies = unModdedDex.species.get(p.species);
					const curSpecies = this.dex.species.get(p.species);
					if (Object.values(baseSpecies.baseStats).join() !== Object.values(curSpecies.baseStats).join()) {
						return false;
					}
					if (Object.values(baseSpecies.abilities).join() !== Object.values(curSpecies.abilities).join()) {
						return false;
					}
					if (baseSpecies.types.join() !== curSpecies.types.join()) {
						return false;
					}
					return true;
				});
				depth++;
			}

			this.addMove('-anim', defender, 'Wish', defender);
			defender.clearBoosts();
			this.add('-clearboost', defender);
			// @ts-expect-error set wants a sig but randbats sets don't have one
			changeSet(this, defender, team[0], true);
			this.add(`c:|${getName((attacker.illusion || attacker).name)}|${msg!}`);
		},
		isZ: "irpatuziniumz",
		target: "normal",
		type: "Fairy",
	},

	// Isaiah
	simplegameplan: {
		accuracy: 100,
		basePower: 95,
		category: "Physical",
		name: "Simple Gameplan",
		shortDesc: "No additional effect.",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		onPrepareHit(defender, attacker) {
			this.attrLastMove('[anim] High Jump Kick');
		},
		target: "allAdjacent",
		type: "Psychic",
	},

	// J0rdy004
	snowysamba: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Snowy Samba",
		shortDesc: "Sets Snow, +1 Sp. Atk, +2 Speed.",
		desc: "Raises the user's Special Attack by 1 stage and Speed by 2 stages, and changes the weather to Snow, boosting the defense of Ice-types by 1.5x for 5 turns. Snow will not be set if the weather cannot be changed or if the weather is already Snow.",
		pp: 15,
		priority: 1,
		flags: { snatch: 1, metronome: 1 },
		boosts: {
			spe: 2,
			spa: 1,
		},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Agility', defender);
			this.add('-anim', attacker, 'Snowscape', defender);
		},
		weather: 'snowscape',
		target: "self",
		type: "Ice",
	},

	// Kalalokki
	knotweak: {
		accuracy: 80,
		basePower: 150,
		category: "Physical",
		name: "Knot Weak",
		shortDesc: "Has 1/2 recoil.",
		desc: "If the defender lost HP, the user takes recoil damage equal to 1/2 the HP lost by the defender, rounded half up, but not less than 1 HP.",
		pp: 5,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		recoil: [1, 2],
		priority: 0,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Focus Punch', defender);
		},
		target: "normal",
		type: "Fighting",
	},

	// Karthik
	salvagedsacrifice: {
		accuracy: 100,
		basePower: 0,
		damageCallback(pokemon) {
			this.add('-anim', pokemon, 'Roost', pokemon);
			this.heal(this.modify(pokemon.maxhp, 0.25), pokemon, pokemon, this.dex.getActiveMove('Salvaged Sacrifice'));
			const damage = pokemon.hp;
			this.add('-anim', pokemon, 'Final Gambit', this.activeTarget);
			pokemon.faint();
			return damage;
		},
		selfdestruct: "ifHit",
		category: "Physical",
		name: "Salvaged Sacrifice",
		shortDesc: "Heals 25% HP, then uses Final Gambit.",
		desc: "The user heals 1/4 of its maximum HP, then deals damage to the defender equal to the user's current HP. If this attack is successful, the user faints.",
		pp: 5,
		priority: 0,
		flags: { protect: 1, metronome: 1, noparentalbond: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		target: "normal",
		type: "Fighting",
	},

	// ken
	ac: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Does something random.",
		desc: "This move performs exactly one of the following at random, ignoring options that would do nothing: 10% chance to burn the defender; 10% chance to paralyze the defender; 10% chance to poison the defender; 3% chance to put the defender to sleep; 2% chance to freeze the defender; 5% chance each to confuse, infatuate, Taunt, Encore, Torment, or Heal Block the defender; 5% chance each to set Stealth Rock, Spikes, Toxic Spikes, or Sticky Web; 5% chance to remove entry hazards from the user's side of the field; 5% chance to lower the foe's highest stat by 2 stages; and a 5% chance to switch out.",
		name: ", (ac)",
		pp: 15,
		priority: 0,
		flags: { reflectable: 1, mustpressure: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Fling', defender);
		},
		secondary: {
			chance: 100,
			onHit(defender, attacker, move) {
				let success = false;
				while (!success) {
					const effect = this.random(100);
					if (effect < 10) {
						if (defender.trySetStatus('psn', defender)) {
							success = true;
						}
					} else if (effect < 20) {
						if (defender.trySetStatus('par', defender)) {
							success = true;
						}
					} else if (effect < 30) {
						if (defender.trySetStatus('par', defender)) {
							success = true;
						}
					} else if (effect < 33) {
						if (defender.trySetStatus('slp', defender)) {
							success = true;
						}
					} else if (effect < 35) {
						if (defender.trySetStatus('frz', defender)) {
							success = true;
						}
					} else if (effect < 40) {
						if (!defender.volatiles['confusion']) {
							defender.addVolatile('confusion', attacker);
							success = true;
						}
					} else if (effect < 45) {
						if (!defender.volatiles['attract']) {
							defender.addVolatile('attract', attacker);
							success = true;
						}
					} else if (effect < 50) {
						if (!defender.volatiles['taunt']) {
							defender.addVolatile('taunt', attacker);
							success = true;
						}
					} else if (effect < 55) {
						if (defender.lastMove && !defender.volatiles['encore']) {
							defender.addVolatile('encore', attacker);
							success = true;
						}
					} else if (effect < 60) {
						if (!defender.volatiles['torment']) {
							defender.addVolatile('torment', attacker);
							success = true;
						}
					} else if (effect < 65) {
						if (!defender.volatiles['healblock']) {
							defender.addVolatile('healblock', attacker);
							success = true;
						}
					} else if (effect < 70) {
						if (defender.side.addSideCondition('stealthrock')) {
							success = true;
						}
					} else if (effect < 75) {
						if (defender.side.addSideCondition('stickyweb')) {
							success = true;
						}
					} else if (effect < 80) {
						if (defender.side.addSideCondition('spikes')) {
							success = true;
						}
					} else if (effect < 85) {
						if (defender.side.addSideCondition('toxicspikes')) {
							success = true;
						}
					} else if (effect < 90) {
						const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
						for (const condition of sideConditions) {
							if (attacker.side.removeSideCondition(condition)) {
								success = true;
								this.add('-sideend', attacker.side, this.dex.conditions.get(condition).name, '[from] move: , (ac)', `[of] ${attacker}`);
							}
						}
					} else if (effect < 95) {
						const bestStat = defender.getBestStat(true, true);
						this.boost({ [bestStat]: -2 }, defender);
						success = true;
					} else {
						if (this.canSwitch(attacker.side)) {
							this.actions.useMove("teleport", attacker);
							success = true;
						}
					}
				}
			},
		},
		target: "normal",
		type: "Psychic",
	},

	// kenn
	stonefaced: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Sets Stealth Rock. Target: -1 Defense/Speed.",
		desc: "Lowers the defender's Defense and Speed by 1 stage, and sets Stealth Rock on the defender's side of the field, damaging Pokemon as they switch in. If Stealth Rock is already on the defender's side of the field, the move will not set Stealth Rock but the other effects will still occur.",
		name: "Stone Faced",
		pp: 15,
		priority: 0,
		flags: { reflectable: 1, mustpressure: 1 },
		sideCondition: 'stealthrock',
		onPrepareHit(defender, attacker) {
			this.attrLastMove('[anim] Scary Face');
			this.attrLastMove('[anim] Stone Axe');
		},
		boosts: {
			def: -1,
			spe: -1,
		},
		target: "normal",
		type: "Rock",
	},

	// Kennedy
	hattrick: {
		accuracy: 98,
		basePower: 19,
		category: "Physical",
		shortDesc: "3 hits. Third hit crits. 3.5% chance to curse.",
		desc: "Hits three times. The third hit is always a critical hit unless the defender is under the effect of Lucky Chant or has the Battle Armor or Shell Armor Abilities. Each hit has a 3.5% chance to apply the Curse effect to the defender, causing them to take damage equal to 25% of their maximum HP at the end of each turn until they switch out.",
		name: "Hat-Trick",
		gen: 9,
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Focus Energy', attacker);
			this.add('-anim', attacker, 'High Jump Kick', defender);
			this.add('-anim', defender, 'Boomburst', attacker);
			this.add('-anim', attacker, 'Aqua Step', defender);
			this.add('-anim', attacker, 'Aqua Step', defender);
		},
		onTryHit(defender, attacker, move) {
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
		shortDesc: "No weather/sleep,share statuses,halve hazard dmg.",
		desc: "For 6 turns, sets a field effect. Negates all weather conditions. Prevents Pokemon from falling asleep. Any status conditions and volatile status conditions applied to one Pokemon will also apply to all Pokemon on the field. Halves entry hazard damage.",
		pp: 5,
		priority: 0,
		flags: { mirror: 1 },
		pseudoWeather: 'anfieldatmosphere',
		condition: {
			duration: 6,
			durationCallback(attacker, effect) {
				if (attacker?.hasAbility('persistent')) {
					this.add('-activate', attacker, 'ability: Persistent', '[move] Anfield Atmosphere');
					return 8;
				}
				return 6;
			},
			onUpdate(pokemon) {
				if (pokemon.volatiles['confusion']) {
					pokemon.removeVolatile('confusion');
				}
			},
			onFieldStart(defender, attacker) {
				if (attacker?.hasAbility('persistent')) {
					this.add('-fieldstart', 'move: Anfield Atmosphere', `[of] ${attacker}`, '[persistent]');
				} else {
					this.add('-fieldstart', 'move: Anfield Atmosphere', `[of] ${attacker}`);
				}
				for (const pokemon of this.getAllActive()) {
					if (pokemon.volatiles['confusion']) {
						pokemon.removeVolatile('confusion');
					}
				}
			},
			onFieldRestart(defender, attacker) {
				this.field.removePseudoWeather('anfieldatmosphere');
			},
			onAnySetWeather(defender, attacker, weather) {
				return false;
			},
			onSetStatus(status, defender, attacker, effect) {
				if (effect.id === 'anfieldatmosphere') return;
				if (status.id === 'slp' && !defender.isSemiInvulnerable()) {
					this.add('-activate', defender, 'move: Anfield Atmosphere');
					return false;
				}
				for (const pokemon of this.getAllActive()) {
					if (!pokemon.hp || pokemon.fainted) continue;
					pokemon.trySetStatus(status, attacker, this.effect);
				}
			},
			onTryAddVolatile(status, defender) {
				if (defender.isSemiInvulnerable()) return;
				if (status.id === 'yawn' || status.id === 'confusion') {
					this.add('-activate', defender, 'move: Anfield Atmosphere');
					return null;
				}
			},
			onDamage(damage, defender, attacker, effect) {
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
		target: "all",
		type: "Psychic",
	},

	// keys
	protectoroftheskies: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Forces both Pokemon out. Can't be blocked.",
		desc: "Both the defender and the user are forced to switch out and be replaced with random unfainted allies. This effect cannot be blocked by any means other than having no valid allies that can be sent out.",
		name: "Protector of the Skies",
		pp: 10,
		priority: -1,
		flags: {},
		onTryMove(attacker, defender, move) {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker, move) {
			for (const pokemon of this.getAllActive()) {
				this.add('-anim', attacker, 'Whirlwind', pokemon);
			}
		},
		onModifyPriority(priority, attacker, defender, move) {
			const foe = attacker.foes()[0];
			if (foe && Object.values(foe.boosts).some(x => x !== 0)) {
				return priority + 1;
			}
		},
		onHitField(defender, attacker, move) {
			for (const pokemon of this.getAllActive()) {
				if (pokemon.hp <= 0 || pokemon.fainted) continue;
				pokemon.forceSwitchFlag = true;
			}
		},
		target: "all",
		type: "Flying",
	},

	// kingbaruk
	platinumrecord: {
		accuracy: true,
		basePower: 70,
		category: "Special",
		shortDesc: "Heals 50% HP, restores 1-3 PP for all other moves.",
		desc: "Heals the user for 1/2 of their maximum HP, and restores 1 to 3 PP to all moves on the user's set other than Platinum Record.",
		name: "Platinum Record",
		pp: 10,
		priority: 0,
		flags: { sound: 1, heal: 1, protect: 1, mirror: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Sing', defender);
			this.add('-anim', attacker, 'Iron Defense', defender);
		},
		onHit(defender, attacker, move) {
			this.heal(attacker.maxhp / 2, attacker, attacker, move);
			for (const moveSlot of attacker.moveSlots) {
				if (moveSlot.id === move.id) continue;
				if (moveSlot.pp < moveSlot.maxpp) moveSlot.pp += this.sample([1, 2, 3]);
			}
		},
		target: "normal",
		type: "Fairy",

	},

	// Kiwi
	madmanifest: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "User: +1 Spe, Foe:Free Curse, 50% brn/par/psn.",
		desc: "Applies the Curse effect to the defender, causing them to take damage equal to 25% of their maximum HP at the end of each turn until they switch out. Has a 50% chance to cause the defender to either become burned, become poisoned, or become paralyzed. Raises the user's Speed by 1 stage.",
		name: "Mad Manifest",
		pp: 10,
		priority: 0,
		flags: {},
		volatileStatus: 'curse',
		onHit(defender, attacker) {
			const status = this.sample(['psn', 'par', 'brn']);
			defender.trySetStatus(status, attacker);
			this.boost({ spe: 1 }, attacker);
		},
		onPrepareHit(defender, attacker) {
			this.attrLastMove('[anim] Dark Void');
		},
		target: "normal",
		type: "Fairy",

	},

	// Klmondo
	thebetterwatershuriken: {
		accuracy: 100,
		basePower: 20,
		category: "Physical",
		shortDesc: "+1 Priority. Hits 2-5 times.",
		desc: "Usually moves first. Hits two to five times. Has a 35% chance to hit two or three times and a 15% chance to hit four or five times. If one of the hits breaks the defender's substitute, it will take damage for the remaining hits. If the user has the Skill Link Ability, this move will always hit five times.",
		name: "The Better Water Shuriken",
		pp: 30,
		priority: 1,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		multihit: [2, 5],
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Water Shuriken', defender);
			this.add('-anim', attacker, 'Electro Shot', defender);
		},
		target: "normal",
		type: "Water",
	},

	// kolohe
	hangten: {
		accuracy: 100,
		basePower: 75,
		category: "Special",
		name: "Hang Ten",
		shortDesc: "User sets Electric Terrain on hit.",
		desc: "If this move is successful, the terrain becomes Electric Terrain.",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Stoked Sparksurfer', defender);
			this.add('-anim', attacker, 'Surf', defender);
		},
		secondary: {
			chance: 100,
			self: {
				onHit() {
					this.field.setTerrain('electricterrain');
				},
			},
		},
		target: "normal",
		type: "Water",
	},

	// Kry
	attackofopportunity: {
		accuracy: 100,
		basePower: 60,
		basePowerCallback(pokemon, defender, move) {
			if (defender.beingCalledBack || defender.switchFlag) {
				this.debug('Attack of Opportunity damage boost');
				return move.basePower * 1.5;
			}
			return move.basePower;
		},
		category: "Physical",
		shortDesc: "Pursuit, +2 Attack when KOing on switch.",
		desc: "If an opposing Pokemon switches out this turn, this move hits that Pokemon before it leaves the field. Power is multiplied by 1.5x and no accuracy check is done if the user hits an opponent switching out, and the user's turn is over; if an opponent faints from this, the user's Attack is boosted by 2 stages and the replacement Pokemon does not become active until the end of the turn. If the user moves after an opponent using Flip Turn, Parting Shot, Teleport, U-turn, or Volt Switch, but not Baton Pass, it will hit that opponent before it leaves the field.",
		name: "Attack of Opportunity",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Pursuit', defender);
			this.add('-anim', attacker, 'Behemoth Blade', defender);
		},
		beforeTurnCallback(pokemon) {
			pokemon.addVolatile(
				'attackofopportunity', pokemon, this.dex.getActiveMove('attackofopportunity')
			);
		},
		onModifyMove(move, attacker, defender) {
			if (defender?.beingCalledBack || defender?.switchFlag) {
				move.accuracy = true;
				move.tracksTarget = true;
				move.onAfterMoveSecondarySelf = function (s, t, m) {
					if (!t || t.fainted || t.hp <= 0) {
						this.boost({ atk: 1 }, s, s, m);
					}
				};
			}
		},
		condition: {
			duration: 1,
			onFoeBeforeSwitchOut(pokemon) {
				const attacker: Pokemon = this.effectState.attacker;
				this.debug('Attack of Opportunity start');
				if (!attacker.isAdjacent(pokemon) || !attacker.hp ||
					(attacker.volatiles['encore'] && attacker.volatiles['encore'].move !== 'attackofopportunity') ||
					!this.queue.cancelMove(attacker)) return;
				if (attacker.canMegaEvo || attacker.canUltraBurst || attacker.canTerastallize) {
					for (const [actionIndex, action] of this.queue.entries()) {
						if (action.pokemon === attacker) {
							if (action.choice === 'megaEvo') {
								this.actions.runMegaEvo(attacker);
							} else if (action.choice === 'terastallize') {
								this.actions.terastallize(attacker);
							} else {
								continue;
							}
							this.queue.list.splice(actionIndex, 1);
							break;
						}
					}
				}
				pokemon.removeVolatile('destinybond');
				this.actions.runMove(
					'attackofopportunity', attacker, attacker.getLocOf(pokemon),
					{ sourceEffect: this.effectState.sourceEffect }
				);
			},
		},
		target: "normal",
		type: "Steel",
		contestType: "Clever",
	},

	// Lasen
	riseabove: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Magnet Rise + Aqua Ring.",
		desc: "For 5 turns, the user is immune to Ground-type attacks and effects as long as it remains active, and the user will recover 1/16th of their maximum HP at the end of each turn as long as it remains active. If the user uses Baton Pass, the replacement will gain the effects.",
		name: "Rise Above",
		gen: 9,
		pp: 5,
		priority: 0,
		flags: {},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(pokemon) {
			this.add('-anim', pokemon, 'Magnet Rise', pokemon);
			this.add('-anim', pokemon, 'Quiver Dance', pokemon);
		},
		volatileStatus: 'riseabove',
		onTry(attacker, defender, move) {
			if (defender.volatiles['smackdown'] || defender.volatiles['ingrain']) return false;

			// Additional Gravity check for Z-move variant
			if (this.field.getPseudoWeather('Gravity')) {
				this.add('cant', attacker, 'move: Gravity', move);
				return null;
			}
		},
		condition: {
			duration: 5,
			onStart(defender) {
				this.add('-start', defender, 'Rise Above');
			},
			onImmunity(type) {
				if (type === 'Ground') return false;
			},
			onResidualOrder: 6,
			onResidual(pokemon) {
				this.heal(pokemon.baseMaxhp / 16);
			},
			onEnd(defender) {
				this.add('-end', defender, 'Rise Above');
			},
		},
		target: "self",
		type: "Electric",
	},

	// Lets go shuckles
	shucklepower: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Trick Room + Power Trick.",
		desc: "Until the user switches out, it swaps its Attack and Defense stats, and stat stage changes remain on their respective stats. Sets Trick Room for 5 turns, making the slower Pokemon move first.",
		name: "Shuckle Power",
		pp: 5,
		priority: -6,
		flags: {},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Power Trick', attacker);
		},
		pseudoWeather: 'trickroom',
		volatileStatus: 'powertrick',
		target: "self",
		type: "Psychic",
	},

	// Loethalion
	darkmooncackle: {
		accuracy: 100,
		basePower: 30,
		basePowerCallback(pokemon, defender, move) {
			const bp = move.basePower + 20 * pokemon.positiveBoosts();
			this.debug(`BP: ${bp}`);
			return bp;
		},
		category: "Special",
		desc: "Power is equal to 30+(X*20), where X is the user's total stat stage changes that are greater than 0. Has a 100% chance to raise the user's Special Attack by 1 stage.",
		shortDesc: "+20 bp per stat boost. 100% chance +1 SpA.",
		name: "Darkmoon Cackle",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Bulk Up', attacker);
			this.add('-anim', attacker, 'Cosmic Power', attacker);
			this.add('-anim', attacker, 'Moonblast', defender);
		},
		secondary: {
			chance: 100,
			self: {
				boosts: {
					spa: 1,
				},
			},
		},
		target: "normal",
		type: "Normal",
	},

	// Lumari
	mysticalbonfire: {
		accuracy: 100,
		basePower: 100,
		basePowerCallback(pokemon, defender, move) {
			if (defender.status || defender.hasAbility(['comatose', 'mensiscage'])) {
				this.debug('BP doubled from status condition');
				return move.basePower * 1.5;
			}
			return move.basePower;
		},
		category: "Physical",
		shortDesc: "50% burn. 1.5x power if defender is already statused.",
		desc: "This move has a 50% chance to give the defender a burn. This move's power is 1.5x stronger if the defender has a non-volatile status condition.",
		name: "Mystical Bonfire",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Infernal Parade', defender);
			this.add('-anim', attacker, 'Fury Attack', defender);
		},
		secondary: {
			chance: 50,
			status: 'brn',
		},
		target: "normal",
		type: "Psychic",
	},

	// Lunell
	praisethemoon: {
		accuracy: 90,
		basePower: 120,
		category: "Special",
		shortDesc: "First turn: +1 SpA. No charge in Gravity.",
		desc: "This attack charges on the first turn and executes on the second. Raises the user's Special Attack by 1 stage on the first turn. If the user is holding a Power Herb or Gravity is active, the move completes in one turn.",
		name: "Praise the Moon",
		pp: 10,
		priority: 0,
		flags: { charge: 1, protect: 1, mirror: 1 },
		onTryMove(attacker, defender, move) {
			this.attrLastMove('[still]');
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.boost({ spa: 1 }, attacker, attacker, move);
			if (this.field.pseudoWeather['gravity']) {
				this.attrLastMove('[still]');
				this.addMove('-anim', attacker, move.name, defender);
				return;
			}
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		hasSheerForceBoost: true,
		onPrepareHit(defender, attacker) {
			this.attrLastMove('[still]');
			this.add('-anim', attacker, 'Lunar Dance', defender);
			this.add('-anim', attacker, 'Moongeist Beam', defender);
		},
		target: "normal",
		type: "Fairy",
	},

	// Lyna
	wrathoffrozenflames: {
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		shortDesc: "80% gain Ice type, 20% gain Fire type.",
		desc: "After using the move, there is an 80% chance the user gains an additional Ice typing, and a 20% chance the user gains an additional Fire typing.",
		name: "Wrath of Frozen Flames",
		gen: 9,
		pp: 10,
		priority: 0,
		flags: { protect: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Clangorous Soulblaze', defender);
		},
		onHit(defender, attacker, move) {
			if (attacker.terastallized) return;
			if (this.randomChance(8, 10)) {
				attacker.addType('Ice');
				this.add('-start', attacker, 'typeadd', 'Ice', '[from] move: Wrath of Frozen Flames');
			} else {
				attacker.addType('Fire');
				this.add('-start', attacker, 'typeadd', 'Fire', '[from] move: Wrath of Frozen Flames');
			}
		},
		target: "normal",
		type: "Dragon",
	},

	// Maia
	bodycount: {
		accuracy: 100,
		basePower: 50,
		basePowerCallback(pokemon, defender, move) {
			return 50 + 50 * pokemon.side.totalFainted;
		},
		category: "Special",
		shortDesc: "+50 power for each time a party member fainted.",
		desc: "Power is equal to 50+(X*50), where X is the total number of times any Pokemon has fainted on the user's side, and X cannot be greater than 100.",
		name: "Body Count",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onPrepareHit() {
			this.attrLastMove('[anim] Core Enforcer');
		},
		target: "normal",
		type: "Ghost",
	},

	// Mathy
	breakingchange: {
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		shortDesc: "Ignores defender's Ability; disables it on hit.",
		desc: "This move and its effects ignore the Abilities of other Pokemon. When this move hits the defender, the defender's Ability is suppressed until it switches out. Innate Abilities are unaffected.",
		name: "Breaking Change",
		gen: 9,
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onPrepareHit() {
			this.attrLastMove('[anim] Salt Cure');
		},
		onHit(defender, attacker) {
			if (defender.getAbility().flags['cantsuppress']) return;
			if (!defender.addVolatile('gastroacid')) return;
			this.add(`c:|${getName((attacker.illusion || attacker).name)}|Sorry i tried to fix smth but accidentally broke your ability :( will fix it next week`);
		},
		ignoreAbility: true,
		target: "normal",
		type: "Normal",
	},

	// Merritty
	newbracket: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Forces both Pokemon out. Can't be blocked.",
		desc: "Both the defender and the user are forced to switch out and be replaced with random unfainted allies. This effect cannot be blocked by any means other than having no valid allies that can be sent out.",
		name: "New Bracket",
		pp: 10,
		priority: 0,
		flags: {},
		onTryMove(attacker, defender, move) {
			this.attrLastMove('[still]');
			if (attacker.side.pokemonLeft === 1) {
				this.add('-fail', attacker);
				return false;
			}
			if (!attacker.hasAbility('endround')) {
				this.add('-fail', attacker);
				this.hint(`The user's ability needs to be End Round for New Bracket to work.`);
				return false;
			}
			this.attrLastMove(`[anim] Trick Room`);
		},
		onHitField(defender, attacker, move) {
			for (const pokemon of this.getAllActive()) {
				if (pokemon.hp <= 0 || pokemon.fainted || pokemon.isSemiInvulnerable()) {
					continue;
				}
				pokemon.forceSwitchFlag = true;
			}
		},
		target: "all",
		type: "Electric",
	},

	// Meteordash
	plagiarism: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Plagiarism",
		shortDesc: "Steal+use foe sig move+imprison. Fail: +1 stats.",
		desc: "User copies opponent's signature move and adds it to its own movepool, replacing this move. The user then uses the copied move immediately and gains the Imprison condition, preventing foes from using moves in the user's moveset. The PP of the copied move will be adjusted to match the PP the copied signature move is supposed to have. If the copied custom move would fail if used in this manner, Plagiarism fails and the user boosts all stats by 1 stage, except Accuracy and Evasion.",
		pp: 5,
		priority: 1,
		flags: { failencore: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1, failmimic: 1, nosketch: 1 },
		onTry(attacker) {
			if (attacker.m.usedPlagiarism) {
				this.hint("Plagiarism only works once per switch-in.");
				return false;
			}
		},
		onPrepareHit() {
			this.attrLastMove('[anim] Mimic');
			this.attrLastMove('[anim] Imprison');
		},
		onHit(defender, attacker, m) {
			let sigMoveName = ssbSets[(defender.illusion || defender).name]?.signatureMove;
			if (!sigMoveName) sigMoveName = defender.moveSlots[defender.moveSlots.length - 1].id;
			const move = this.dex.getActiveMove(sigMoveName);
			if (!defender || this.queue.willSwitch(defender) || defender.beingCalledBack ||
				move.flags['failcopycat'] || move.flags['nosketch']) {
				this.boost({ spa: 1, spd: 1, spe: 1 }, attacker, attacker, m);
				return;
			}
			const plagiarismIndex = attacker.moves.indexOf('plagiarism');
			if (plagiarismIndex < 0) return false;
			this.add(`c:|${getName((attacker.illusion || attacker).name)}|yoink`);
			const plagiarisedMove = {
				move: move.name,
				id: move.id,
				pp: move.pp,
				maxpp: move.pp,
				defender: move.defender,
				disabled: false,
				used: false,
			};
			attacker.moveSlots[plagiarismIndex] = plagiarisedMove;
			this.add('-activate', attacker, 'move: Plagiarism', move.name);
			this.add('-message', `${attacker.name} plagiarised ${defender.name}'s ${move.name}!`);
			this.actions.useMove(move.id, attacker, { defender });
			delete defender.volatiles['imprison'];
			attacker.addVolatile('imprison', attacker);
			attacker.m.usedPlagiarism = true;
		},
		target: "normal",
		type: "Dark",
	},

	// Mex
	timeskip: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Time Skip",
		shortDesc: "Clears hazards. +10 turns. +1 Spe.",
		desc: "Removes all entry hazards from the user's side of the field, increases the turn counter by 10, and boosts the user's Speed by 1 stage.",
		pp: 10,
		priority: 0,
		flags: {},
		onPrepareHit() {
			this.attrLastMove('[anim] Trick Room');
		},
		self: {
			onHit(pokemon) {
				const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
				for (const condition of sideConditions) {
					if (pokemon.side.removeSideCondition(condition)) {
						this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] move: Time Skip', `[of] ${pokemon}`);
					}
				}
				// 9 turn addition so the +1 from endTurn totals to 10 turns
				this.turn += 9;
			},
			boosts: {
				spe: 1,
			},
		},
		target: "all",
		type: "Dragon",
	},

	// Miojo
	vruuuuuum: {
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		shortDesc: "Super effective on Water.",
		desc: "This move's type effectiveness against Water is changed to be super effective no matter what this move's type is.",
		name: "vruuuuuum",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Shift Gear', attacker);
			this.add('-anim', attacker, 'Ice Spinner', defender);
		},
		onEffectiveness(typeMod, defender, type) {
			if (type === 'Water') return 1;
		},
		target: "normal",
		type: "Ice",
	},

	// Monkey
	bananabreakfast: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "2 random stats +2; Lock-On/Laser Focus/Charge.",
		desc: "Boosts 2 random stats of the user by 2 stage each, except Accuracy and Evasion. These stats can be the same. Applies one of Lock-On, Laser Focus, or Charge to the user at random.",
		name: "Banana Breakfast",
		gen: 9,
		pp: 10,
		priority: 2,
		flags: { mirror: 1, heal: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Fire Fang', defender);
			this.add('-anim', attacker, 'Belly Drum', defender);
		},
		onHit(defender, attacker) {
			const stats: BoostID[] = [];
			const boost: SparseBoostsTable = {};
			let statPlus: BoostID;
			for (statPlus in attacker.boosts) {
				if (statPlus === 'accuracy' || statPlus === 'evasion') continue;
				if (attacker.boosts[statPlus] < 6) {
					stats.push(statPlus);
				}
			}
			const randomStat: BoostID | undefined = stats.length ? this.sample(stats) : undefined;
			const randomStat2: BoostID | undefined = stats.length ? this.sample(stats) : undefined;
			if (randomStat) boost[randomStat] = 2;
			if (randomStat2 && randomStat === randomStat2) boost[randomStat] = 4;
			else if (randomStat2) boost[randomStat2] = 2;
			this.boost(boost, attacker);
			// This is easier than implementing each condition manually
			const move = this.sample(['lockon', 'laserfocus', 'charge']);
			this.actions.useMove(move, defender);
			this.heal(defender.maxhp / 4, defender, defender, this.effect);
		},
		target: "self",
		type: "Grass",
	},

	// MyPearl
	eonassault: {
		accuracy: 100,
		basePower: 45,
		category: "Special",
		shortDesc: "Hits twice. 40% -1 Sp. Atk, 40% -1 Sp. Def.",
		desc: "Hits 2 times. Each hit has a 40% chance to lower Special Attack by 1 stage, and a 40% chance to lower Special Defense by 1 stage.",
		name: "Eon Assault",
		gen: 9,
		pp: 15,
		priority: 0,
		flags: { protect: 1 },
		multihit: 2,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Mist Ball', defender);
			this.add('-anim', attacker, 'Luster Purge', defender);
		},
		secondaries: [
			{
				chance: 40,
				boosts: {
					spa: -1,
				},
			}, {
				chance: 40,
				boosts: {
					spd: -1,
				},
			},
		],
		target: "normal",
		type: "Psychic",
	},

	// Neko
	qualitycontrolzoomies: {
		accuracy: 100,
		basePower: 50,
		basePowerCallback(pokemon, defender, move) {
			if (pokemon.side.pokemonLeft === 1) return move.basePower + 30;
			return move.basePower;
		},
		category: "Physical",
		shortDesc: "Pivot; switchin: Booster Energy. If last: 80BP.",
		desc: "If this move is successful and the user has not fainted, the user switches out even if it is trapped and is replaced immediately by a selected party member. The replacement party member gains a Cat Stamp of Approval with the effect of Booster Energy, boosting its highest stat by 1.3x, or 1.5x in the case of Speed. The user does not switch out if there are no unfainted party members, or if the defender switched out using an Eject Button or through the effect of the Emergency Exit or Wimp Out Abilities. If there are no unfainted party members, the move's Base Power is increased to 80 and the user gains the Cat Stamp of Approval boost instead.",
		name: "Quality Control Zoomies",
		gen: 9,
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Ice Spinner', defender);
			this.add('-anim', attacker, 'Chilly Reception', attacker);
		},
		self: {
			slotCondition: 'qualitycontrolzoomies',
		},
		condition: {
			onSwitchIn(defender) {
				if (!defender.fainted) {
					defender.addVolatile('catstampofapproval');
					defender.side.removeSlotCondition(defender, 'qualitycontrolzoomies');
				}
			},
		},
		onHit(defender, attacker, move) {
			let message = 'Meow has no other options, so ;w;';
			if (attacker.side.pokemonLeft > 1) {
				message = 'Meow is not the right Pokemon to be an example here, swap meow out please.';
			}
			this.add(`c:|${getName('Neko')}|${message}`);
		},
		onModifyMove(move, pokemon, defender) {
			if (pokemon.side.pokemonLeft === 1) {
				move.self = {
					onHit(t, attacker, m) {
						attacker.addVolatile('catstampofapproval');
					},
				};
				delete move.condition;
			}
		},
		selfSwitch: true,
		target: "normal",
		type: "Ice",
	},

	// Ney
	shadowdance: {
		accuracy: 90,
		basePower: 110,
		category: "Physical",
		shortDesc: "Raises the user's Attack by 1 stage.",
		desc: "100% chance to raise the user's Attack by 1 stage.",
		name: "Shadow Dance",
		gen: 9,
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, dance: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Poltergeist', defender);
			this.add('-anim', attacker, 'Dragon Dance', attacker);
		},
		secondary: {
			chance: 100,
			self: {
				boosts: {
					atk: 1,
				},
			},
		},
		target: "normal",
		type: "Ghost",
	},

	// Notater517
	nyaa: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Haze and then +1 Atk / Def.",
		desc: "Resets the stat stages of all active Pokemon to 0, and then raises the user's Attack and Defense by 1 stage.",
		name: "~nyaa",
		gen: 9,
		pp: 10,
		priority: 0,
		flags: { bypasssub: 1 },
		onPrepareHit(defender, attacker) {
			this.attrLastMove('[anim] Haze');
			this.attrLastMove('[anim] Sweet Kiss');
			this.attrLastMove('[anim] Baton Pass');
		},
		onHitField(defender, attacker, move) {
			this.add('-clearallboost');
			for (const pokemon of this.getAllActive()) {
				pokemon.clearBoosts();
			}
			this.boost({ atk: 1, def: 1 }, attacker, attacker, move);
		},
		slotCondition: 'nyaa',
		condition: {
			onSwitchIn(defender) {
				const attacker = this.effectState.attacker;
				if (!defender.fainted) {
					this.add(`c:|${getName((attacker.illusion || attacker).name)}|~nyaa ${defender.name}`);
					this.add(`c:|${getName('Jeopard-E')}|**It is now ${defender.name}'s turn to ask a question.**`);
					defender.side.removeSlotCondition(defender, 'nyaa');
				}
			},
		},
		target: "all",
		type: "Steel",
	},

	// nya
	'3': {
		accuracy: 100,
		basePower: 70,
		category: "Special",
		shortDesc: "40% infatuates. 10% backfire chance.",
		desc: "This move has a 40% chance to infatuate the defender, regardless of gender, but this move has a 10% chance to be used by the defender at the user instead.",
		name: ":3",
		gen: 9,
		pp: 5,
		priority: 0,
		flags: { protect: 1 },
		onTry(pokemon, defender, move) {
			if (move.sourceEffect !== '3' && this.randomChance(1, 10)) {
				this.add('-message', "The move backfired!");
				const activeMove = this.dex.getActiveMove(':3');
				activeMove.hasBounced = true;
				this.actions.useMove(activeMove, defender, { defender: pokemon });
				return null;
			}
		},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Attract', defender);
		},
		secondary: {
			volatileStatus: 'attract',
			chance: 40,
		},
		target: "normal",
		type: "Fairy",
	},

	// pants
	eerieapathy: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Eerie Apathy",
		shortDesc: "Wish + Taunts the foe.",
		pp: 15,
		priority: 0,
		flags: { snatch: 1, heal: 1, protect: 1, reflectable: 1, mirror: 1, bypasssub: 1 },
		self: {
			slotCondition: 'Wish',
		},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Memento', defender);
		},
		onHit(defender, attacker, move) {
			if (!defender.volatiles['taunt']) {
				defender.addVolatile('taunt', attacker, move);
			}
		},
		target: "normal",
		type: "Ghost",
	},

	// PartMan
	alting: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Alting",
		shortDesc: "Switch+Protect, Shiny: 69BP ???-type atk instead.",
		desc: "If the user is not shiny, it switches out even if it is trapped and is replaced immediately by a selected party member, and if the user moved first this turn, the selected party member will be protected from most attacks made by other Pokemon this turn. If the user is shiny, this move instead becomes a 69 Base Power ???-type special attack.",
		pp: 5,
		priority: 0,
		flags: { snatch: 1 },
		stallingMove: true,
		sideCondition: 'alting',
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Memento', defender);

			this.add(`l|${getName((attacker.illusion || attacker).name).split('|')[1]}`);
			this.add(`j|FakePart`);
		},
		onModifyMove(move, attacker, defender) {
			move.type = "???";
			if (attacker.set?.shiny) {
				move.accuracy = 100;
				move.basePower = 69;
				move.category = "Special";
				move.flags = { protect: 1, bypasssub: 1 };
				move.defender = "normal";

				delete move.selfSwitch;
				delete move.stallingMove;
				delete move.sideCondition;
				delete move.condition;

				// Note: Taunt will disable all forms of Alting, including the damaging one.
				// This is intentional.
			}
		},
		condition: {
			duration: 1,
			onSideStart(defender, attacker) {
				this.add('-singleturn', attacker, 'Alting');
			},
			onTryHitPriority: 3,
			onTryHit(defender, attacker, move) {
				if (move.defender === 'self') return;
				if (this.checkMoveBypassesProtect(move, attacker, defender, false)) return;
				this.add('-activate', defender, 'move: Alting', move.name);
				const lockedmove = attacker.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (attacker.volatiles['lockedmove'].duration === 2) {
						delete attacker.volatiles['lockedmove'];
					}
				}
				return this.NOT_FAIL;
			},
		},
		selfSwitch: true,
		target: "allySide",
		type: "Ghost", // Updated to ??? in onModifyMove
	},

	// Pastor Gigas
	calltorepentance: {
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		shortDesc: "Applies Heal Block and Taunt.",
		desc: "If this move deals damage, the defender is prevented from using any status moves for 3 turns or restoring any HP for 5 turns, with both effects ending if the defender switches out. During the effect, status moves and draining moves are unusable, and Abilities and items that grant healing will not heal the user. If an affected Pokemon uses Baton Pass, the replacement will remain unable to restore its HP or use status moves. The Regenerator Ability is unaffected, and Pokemon with Oblivious are immune to the Taunt effect.",
		name: "Call to Repentance",
		gen: 9,
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Hyper Voice', defender);
			this.add('-anim', attacker, 'Judgment', defender);
		},
		secondaries: [
			{
				chance: 100,
				volatileStatus: 'healblock',
			}, {
				chance: 100,
				volatileStatus: 'taunt',
			},
		],
		target: "normal",
		type: "Normal",
	},

	// Peary
	"1000gears": {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "1000 Gears",
		shortDesc: "Heals 100% HP,cures status,+1 Def/SpD/Spe,+10 levels.",
		desc: "Z-Move requiring Pearyum Z. Heals the user for 100% of its maximum HP, cures its non-volatile status effects, boosts its Defense and Special Defense by 1 stage, and raises its level by 10.",
		pp: 1,
		priority: 0,
		flags: {},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(pokemon) {
			this.add('-anim', pokemon, 'Shift Gear', pokemon);
			this.add('-anim', pokemon, 'Belly Drum', pokemon);
		},
		onHit(defender, pokemon, move) {
			this.heal(pokemon.maxhp, pokemon, pokemon, move);
			pokemon.cureStatus();
			this.boost({ def: 1, spd: 1, spe: 1 });
			(pokemon as any).level += 10;
			pokemon.details = pokemon.getUpdatedDetails();
			this.add('-anim', pokemon, 'Geomancy', pokemon);
			this.add('replace', pokemon, pokemon.details);
			this.add('-message', `${pokemon.name} gained 10 levels!`);
		},
		isZ: "pearyumz",
		target: "self",
		type: "Steel",
	},

	// phoopes
	gen1blizzard: {
		accuracy: 90,
		basePower: 120,
		category: "Special",
		name: "Gen 1 Blizzard",
		desc: "Has a 10% chance to freeze the defender.",
		shortDesc: "10% chance to freeze the defender.",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
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

	// Pissog
	asongoficeandfire: {
		accuracy: 100,
		basePower: 100,
		category: "Special",
		name: "A Song of Ice and Fire",
		shortDesc: "Type depends on form. Switches form.",
		desc: "If the user is Volcarona, this move is Ice-type and, after dealing damage, transforms the user into a Snow Warning Frosmoth with Blizzard, Chilly Reception, and Aurora Veil. If the user is Frosmoth, this move is Fire-type and, after dealing damage, transforms the user into a Drought Volcarona with Torch Song, Morning Sun, and Solar Beam. This move fails if the user is neither Frosmoth nor Volcarona.",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, failcopycat: 1, nosketch: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker, move) {
			if (attacker.species.name === 'Volcarona') {
				this.add('-anim', attacker, 'Blizzard', defender);
			} else {
				this.add('-anim', attacker, 'Fiery Dance', defender);
			}
		},
		onModifyType(move, pokemon) {
			if (pokemon.species.name === 'Volcarona') {
				move.type = "Ice";
			} else {
				move.type = "Fire";
			}
		},
		onHit(defender, attacker, move) {
			if (attacker.species.name === 'Volcarona') {
				changeSet(this, attacker, ssbSets['Pissog-Frosmoth'], true);
			} else if (attacker.species.name === 'Frosmoth') {
				changeSet(this, attacker, ssbSets['Pissog'], true);
			}
		},
		target: "normal",
		type: "Fire",
	},

	// pokemonvortex
	roulette: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Roulette",
		shortDesc: "Use 2 random moves, and get a random moveset.",
		desc: "A random move is selected for use, and then the user's other three moves are replaced with random moves. Aura Wheel, Dark Void, Explosion, Final Gambit, Healing Wish, Hyperspace Fury, Lunar Dance, Memento, Misty Explosion, Revival Blessing, and Self-Destruct cannot be selected.",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Nasty Plot', attacker);
			this.add('-anim', attacker, 'Metronome', defender);
			this.add('-anim', attacker, 'Explosion', defender);
		},
		onHit(defender, attacker) {
			const bannedList = [
				'aurawheel', 'darkvoid', 'explosion', 'finalgambit', 'healingwish', 'hyperspacefury',
				'lunardance', 'memento', 'mistyexplosion', 'revivalblessing', 'selfdestruct',
			];
			const moves = this.dex.moves.all().filter(move => (
				!attacker.moves.includes(move.id) &&
				(!move.isNonstandard || move.isNonstandard === 'Unobtainable')
			));
			this.actions.useMove(this.sample(moves.filter(x => !bannedList.includes(x.id))), defender);
			this.actions.useMove(this.sample(moves.filter(x => !bannedList.includes(x.id))), defender);
			for (const i of defender.moveSlots.keys()) {
				if (i > 2) break;
				const randomMove = this.sample(moves.filter(x => !bannedList.includes(x.id)));
				bannedList.push(randomMove.id);
				const replacement = {
					move: randomMove.name,
					id: randomMove.id,
					pp: randomMove.pp,
					maxpp: randomMove.pp,
					defender: randomMove.defender,
					disabled: false,
					used: false,
				};
				defender.moveSlots[i] = defender.baseMoveSlots[i] = replacement;
			}
		},
		target: "self",
		type: "Normal",
	},

	// Princess Autumn
	cottoncandycrush: {
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		shortDesc: "Uses Sp. Def over Attack in damage calculation.",
		desc: "Damage is calculated using the user's Special Defense stat as its Attack, including stat stage changes. Other effects that modify the Attack stat are used as normal.",
		name: "Cotton Candy Crush",
		overrideOffensiveStat: "spd",
		gen: 9,
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Fusion Bolt', defender);
			this.add('-anim', attacker, 'Fleur Cannon', defender);
		},
		target: "normal",
		type: "Fairy",
	},

	// ptoad
	pleek: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Pleek...",
		shortDesc: "+8 Attack + inflict Perish Song on the user.",
		desc: "Raises the user's Attack by 8 stages. Inflicts the Perish Song effect on the user, causing it to faint in three turns at the end of the turn.",
		pp: 10,
		priority: 0,
		flags: { sound: 1, bypasssub: 1 },
		onTry(attacker) {
			if (attacker.m.usedPleek) {
				this.hint("Pleek... only works once per switch-in.");
				return false;
			}
		},
		onPrepareHit() {
			this.attrLastMove('[anim] Hyper Voice');
			this.attrLastMove('[anim] Splash');
		},
		onHit(defender, attacker, move) {
			this.add(`c:|${getName((attacker.illusion || attacker).name)}|Pleek...`);
			this.boost({ atk: 8 }, attacker, attacker, move);
			attacker.addVolatile('perishsong');
			this.add('-start', attacker, 'perish3', '[silent]');
			attacker.m.usedPleek = true;
		},
		target: "self",
		type: "Fairy",
	},

	// Pulse_kS
	luckpulse: {
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Luck Pulse",
		shortDesc: "Random type. 40% random effect. High crit.",
		desc: "This move's typing is chosen randomly between the 18 standard types, and each type has a 40% chance to apply a status effect to the defender specific to that type. This move has an increased chance to result in a critical hit. The list of effects per type are as follows: Normal can apply drowsy; Fire can apply burn; Water can apply Aqua Ring; Grass can apply Leech Seed; Flying can apply confusion; Fighting can apply partial trapping; Poison can apply Toxic poison; Electric can apply paralysis; Ground can apply No Retreat, trapping the defender without granting boosts; Rock can apply Salt Cure; Psychic can apply sleep; Ice can apply freeze; Bug can apply poison; Ghost can apply Disable; Steel can cause the defender to flinch; Dragon can cause the defender to recharge on their next turn, as if they had just used Hyper Beam; Dark can apply Taunt; and Fairy can apply infatuation.",
		critRatio: 2,
		pp: 10,
		priority: 0,
		flags: { pulse: 1, protect: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker, move) {
			this.add('-anim', attacker, 'Tera Blast ' + move.type, defender);
		},
		onModifyType(move, pokemon, defender) {
			const type = this.sample(this.dex.types.names().filter(i => i !== 'Stellar'));
			move.type = type;
		},
		onTryHit(defender, attacker, move) {
			const messages = [
				'Kai Shinden',
				'Kaio Sama',
				'Kaiba, Seto',
				'Kairyu-Shin',
				'Kaito Shizuki',
				'Kanga Skhan',
				'KanSas',
				'Karakuri Shogun',
				'Kate Stewart',
				'Kendo Spirit',
				'Keratan sulfate',
				'Kernel streaming',
				'Key Stage',
				'Kids Suck',
				'KillSteal',
				'Kilometers / Second',
				'Kilosecond',
				'King of the Swamp',
				'King\'s Shield',
				'Kirk/Spock',
				'Klingon Security',
				'Kuroudo (Cloud) Strife',
				'Kyouko Sakura',
				'KyrgyzStan',
				'Kpop Star',
				'Kartana Swords dance',
			];
			this.add(`c:|${getName((attacker.illusion || attacker).name)}|The kS stands for ${this.sample(messages)}`);
		},
		secondary: {
			chance: 40,
			onHit(defender, attacker, move) {
				const table: { [k: string]: { volatileStatus?: string, status?: string } } = {
					Normal: { volatileStatus: 'yawn' },
					Fire: { status: 'brn' },
					Water: { volatileStatus: 'aquaring' },
					Grass: { volatileStatus: 'leechseed' },
					Flying: { volatileStatus: 'confusion' },
					Fighting: { volatileStatus: 'partiallytrapped' },
					Poison: { status: 'tox' },
					Electric: { status: 'par' },
					Ground: { volatileStatus: 'trapped' },
					Rock: { volatileStatus: 'saltcure' },
					Psychic: { status: 'slp' },
					Ice: { status: 'frz' },
					Bug: { status: 'psn' },
					Ghost: { volatileStatus: 'disable' },
					Steel: { volatileStatus: 'flinch' },
					Dark: { volatileStatus: 'mustrecharge' },
					Dragon: { volatileStatus: 'taunt' },
					Fairy: { volatileStatus: 'attract' },
				};
				let condition = table[move.type];
				if (!condition) condition = table['Normal'];
				if (condition.status) {
					defender.trySetStatus(condition.status);
				} else if (condition.volatileStatus) {
					defender.addVolatile(condition.volatileStatus);
				}
			},
		},
		target: "normal",
		type: "???",
	},

	// PYRO
	meatgrinder: {
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		name: "Meat Grinder",
		shortDesc: "User:+1/8 HP/turn;Foe:-1/10 HP/turn,Nrm/Fairy 1/5.",
		desc: "Causes damage to the defender equal to 1/10 of its maximum HP (1/5 if the defender is Normal or Fairy type), rounded down, and heals the user equal to 1/8 of its maximum HP, both at the end of each turn during effect. This effect ends when the defender is no longer active.",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onPrepareHit() {
			this.attrLastMove('[anim] Guillotine');
		},
		condition: {
			noCopy: true,
			onStart(pokemon) {
				this.add('-start', pokemon, 'Meat Grinder');
			},
			onResidualOrder: 13,
			onResidual(pokemon, attacker) {
				this.damage(pokemon.baseMaxhp / (pokemon.hasType(['Normal', 'Fairy']) ? 5 : 10));

				const defender = this.getAtSlot(pokemon.volatiles['meatgrinder'].sourceSlot);
				if (!pokemon || pokemon.fainted || pokemon.hp <= 0) {
					this.add(`c:|${getName((defender.illusion || defender).name)}|Tripping off the beat kinda, dripping off the meat grinder`);
				}
				if (!defender || defender.fainted || defender.hp <= 0) {
					this.debug('Nothing to heal');
					return;
				}
				this.heal(defender.baseMaxhp / 8, defender, pokemon);
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Meat Grinder');
			},
		},
		secondary: {
			chance: 100,
			volatileStatus: 'meatgrinder',
		},
		target: "normal",
		type: "Steel",
	},

	// Quite Quiet
	worriednoises: {
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "*Worried Noises*",
		shortDesc: "+2 SpA. Type varies based on user's primary type.",
		desc: "Has a 100% chance to raise the user's Special Attack by 1 stage. This move's type depends on the user's primary type. If the user's primary type is typeless, this move's type is the user's secondary type if it has one, otherwise the added type from effects that add extra typings. This move is typeless if the user's type is typeless alone.",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Tidy Up', attacker);
			this.add('-anim', attacker, 'Bug Buzz', defender);
		},
		onModifyType(move, pokemon) {
			let type = pokemon.getTypes()[0];
			if (type === "Bird") type = "???";
			move.type = type;
		},
		secondary: {
			chance: 100,
			self: {
				boosts: {
					spa: 1,
				},
			},
		},
		target: "normal",
		type: "Normal",
	},

	// quziel
	reshape: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Reshape",
		shortDesc: "User: +1 SpA. Target becomes a random monotype.",
		desc: "Raises the user's Special Attack by 1 stage and changes the defender's typing to any one of the 18 standard types at random, replacing their old typing.",
		pp: 10,
		priority: 0,
		flags: {},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Reflect Type', defender);
		},
		onHit(defender, attacker, move) {
			const type = this.sample(this.dex.types.names().filter(i => i !== 'Stellar'));
			defender.setType(type);
			this.add('-start', defender, 'typechange', type, '[from] move: Reshape');
			this.boost({ spa: 1 }, attacker);
		},
		target: "normal",
		type: "Normal",
	},

	// R8
	magictrick: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Magic Trick",
		shortDesc: "Teleport + Clears field effects.",
		desc: "Removes any terrain, weather, entry hazard, or other removable field condition, and then causes the user to switch out even if it is trapped and be replaced immediately by a selected party member. The user does not switch out if there are no unfainted party members, and the user will still attempt to switch out if there are no active field conditions.",
		pp: 5,
		priority: 0,
		flags: { bypasssub: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Explosion', defender);
		},
		onHit(defender, attacker, move) {
			let success = false;
			const displayText = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
			for (const player of this.sides) {
				for (const targetCondition of Object.keys(player.sideConditions)) {
					if (player.removeSideCondition(targetCondition)) {
						success = true;
						if (displayText.includes(targetCondition)) {
							this.add('-sideend', player, this.dex.conditions.get(targetCondition).name, '[from] move: Magic Trick', `[of] ${attacker}`);
						}
					}
				}
			}
			if (this.field.clearTerrain()) success = true;
			if (this.field.clearWeather()) success = true;
			for (const pseudoWeather of PSEUDO_WEATHERS) {
				if (this.field.removePseudoWeather(pseudoWeather)) success = true;
			}
			return success || !!this.canSwitch(attacker.side);
		},
		selfSwitch: true,
		target: "self",
		type: "Normal",
	},

	// Rainshaft
	"hatsunemikusluckyorb": {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Hatsune Miku's Lucky Orb",
		shortDesc: "Gains +3 to random stat, then uses Baton Pass.",
		desc: "Z-Move requiring Rainium Z. Boosts a random stat (except Accuracy and Evasion) by 3 stages, then the user is replaced with another Pokemon in its party. The selected Pokemon has the user's stat stage changes, confusion, and certain move effects transferred to it.",
		pp: 1,
		priority: 0,
		flags: {},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(pokemon) {
			this.add('-anim', pokemon, 'Life Dew', pokemon);
			this.add('-anim', pokemon, 'Geomancy', pokemon);
		},
		onHit(defender, pokemon, move) {
			const stats: BoostID[] = [];
			let stat: BoostID;
			for (stat in defender.boosts) {
				if (stat === 'accuracy' || stat === 'evasion') continue;
				if (defender.boosts[stat] < 6) {
					stats.push(stat);
				}
			}
			if (stats.length) {
				const randomStat = this.sample(stats);
				this.boost({ [randomStat]: 3 }, pokemon, pokemon, move);
				this.actions.useMove('Baton Pass', defender);
			}
		},
		isZ: "rainiumz",
		target: "self",
		type: "Water",
	},

	// Ransei
	floodoflore: {
		accuracy: 100,
		basePower: 100,
		category: "Special",
		name: "Flood of Lore",
		shortDesc: "Sets Psychic Terrain.",
		desc: "If this move is successful, the terrain becomes Psychic Terrain.",
		pp: 5,
		priority: 0,
		flags: { protect: 1 },
		terrain: 'psychicterrain',
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Photon Geyser', defender);
		},
		target: "normal",
		type: "Psychic",
	},

	// ReturnToMonkey
	monkemagic: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Monke Magic",
		shortDesc: "Sets Trick Room; user SpA +1.",
		desc: "Nearly always goes last. Raises the user's Special Attack by 1 stage and sets Trick Room for 5 turns, making the slower Pokemon move first for the duration.",
		pp: 5,
		priority: -7,
		flags: {},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Trick', defender);
			this.add('-anim', attacker, 'Trick Room', defender);
			this.add('-anim', attacker, 'Nasty Plot', defender);
		},
		pseudoWeather: 'trickroom',
		self: {
			boosts: {
				spa: 1,
			},
		},
		target: "all",
		type: "Psychic",
	},

	// Rio Vidal
	metalblast: {
		accuracy: 90,
		basePower: 90,
		category: "Physical",
		shortDesc: "Sets G-Max Steelsurge on the foe's side.",
		desc: "If this move is successful, it sets up G-Max Steelsurge on the opposing side of the field, damaging each opposing Pokemon that switches in. Foes lose 1/32, 1/16, 1/8, 1/4, or 1/2 of their maximum HP, rounded down, based on their weakness to the Steel type; 0.25x, 0.5x, neutral, 2x, or 4x, respectively. Can be removed from the opposing side if any opposing Pokemon uses Rapid Spin or Defog successfully, or is hit by Defog.",
		name: "Metal Blast",
		gen: 9,
		pp: 10,
		priority: 0,
		flags: { protect: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Steel Beam', defender);
			this.add('-anim', attacker, 'G-max Steelsurge', defender);
		},
		onAfterHit(defender, attacker, move) {
			if (!move.hasSheerForce && attacker.hp) {
				for (const side of attacker.side.foeSidesWithConditions()) {
					side.addSideCondition('gmaxsteelsurge');
				}
			}
		},
		onAfterSubDamage(damage, defender, attacker, move) {
			if (!move.hasSheerForce && attacker.hp) {
				for (const side of attacker.side.foeSidesWithConditions()) {
					side.addSideCondition('gmaxsteelsurge');
				}
			}
		},
		secondary: {}, // Sheer Force-boosted
		target: "normal",
		type: "Steel",
	},

	// Rissoux
	callofthewild: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Call of the Wild",
		shortDesc: "Boosts Atk, Spe, and accuracy by 1 stage.",
		pp: 5,
		priority: 0,
		flags: { sound: 1 },
		boosts: {
			atk: 1,
			spe: 1,
			accuracy: 1,
		},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Dragon Dance', attacker);
			this.add('-anim', attacker, 'Lock-On', attacker);
		},
		target: "self",
		type: "Fire",
	},

	// RSB
	confiscate: {
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		name: "Confiscate",
		shortDesc: "First turn only. Steals boosts and screens.",
		desc: "Nearly always moves first. The defender's stat stages greater than 0 are stolen from it and applied to the user, and any present effects of Reflect, Light Screen, and Aurora Veil are moved from the defender's side of the field to the user's, before dealing damage. Fails unless it is the user's first turn on the field.",
		pp: 5,
		priority: 2,
		flags: { contact: 1, protect: 1, mirror: 1, bite: 1 },
		onTry(attacker) {
			if (attacker.activeMoveActions > 1) {
				this.hint("Confiscate only works on your first turn out.");
				return false;
			}
		},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Crunch', defender);
			this.add('-anim', attacker, 'Thief', defender);
		},
		onTryHit(defender, attacker) {
			this.add(`c:|${getName((attacker.illusion || attacker).name)}|Contraband detected, confiscating.`);
			for (const condition of ['reflect', 'lightscreen', 'auroraveil']) {
				if (defender.side.removeSideCondition(condition)) {
					attacker.side.addSideCondition(condition);
				}
			}
		},
		stealsBoosts: true,
		target: "normal",
		type: "Dark",
	},

	// Rumia
	midnightbird: {
		accuracy: 100,
		basePower: 85,
		category: "Special",
		name: "Midnight Bird",
		shortDesc: "100% chance to raise the user's Sp. Atk by 2.",
		desc: "Has a 100% chance to raise the user's Special Attack by 2 stages.",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Memento', defender);
			this.add('-anim', attacker, 'Brutal Swing', defender);
		},
		secondary: {
			chance: 100,
			self: {
				boosts: {
					spa: 2,
				},
			},
		},
		target: "normal",
		type: "Dark",
	},

	// Scotteh
	purification: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Heals 50% of max HP. Cures status.",
		desc: "Heals the user for 1/2 of their maximum HP and removes any non-volatile status effect from the user.",
		name: "Purification",
		pp: 5,
		priority: 0,
		flags: { heal: 1, bypasssub: 1, allyanim: 1 },
		onPrepareHit() {
			this.attrLastMove('[anim] Moonlight');
		},
		onHit(pokemon) {
			const success = !!this.heal(this.modify(pokemon.maxhp, 0.5));
			return pokemon.cureStatus() || success;
		},
		target: "self",
		type: "Water",
	},

	// SexyMalasada
	hexadecimalfire: {
		accuracy: 100,
		basePower: 75,
		category: "Special",
		shortDesc: "20% burn, 20% spite, 20% 1/4th recoil.",
		desc: "This move independently has a 20% chance to leave the defender with a burn, a 20% chance to reduce the PP of the defender's last used move by 4, and a 20% chance to cause the user to take damage equal to 1/4 of the damage dealt to the defender.",
		name: "Hexadecimal Fire",
		pp: 15,
		priority: 0,
		flags: { heal: 1, bypasssub: 1, allyanim: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Sacred Fire', defender);
			this.add('-anim', attacker, 'Hex', defender);
		},
		secondaries: [
			{
				chance: 20,
				status: 'brn',
			},
			{
				chance: 20,
				onHit(defender) {
					if (!defender.hp) return;
					let move: Move | ActiveMove | null = defender.lastMove;
					if (!move || move.isZ) return;
					if (move.isMax && move.baseMove) move = this.dex.moves.get(move.baseMove);
					const ppDeducted = defender.deductPP(move.id, 4);
					if (!ppDeducted) return;
					this.add('-activate', defender, 'move: Hexadecimal Fire', move.name, ppDeducted);
				},
			},
			{
				chance: 20,
				onHit(defender, attacker, move) {
					move.recoil = [25, 100];
				},
			},
		],
		target: "normal",
		type: "Ghost",
	},

	// sharp_claw
	treacheroustraversal: {
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		shortDesc: "Clears hazards, sets spikes, switches out.",
		desc: "Removes all entry hazards and active terrains from the field, then sets one layer of Spikes if the user is Sneasel or Toxic Spikes otherwise. If this move is successful and the user has not fainted, the user switches out even if it is trapped and is replaced immediately by a selected party member. The user does not switch out if there are no unfainted party members, or if the defender switched out using an Eject Button or through the effect of the Emergency Exit or Wimp Out Abilities.",
		name: "Treacherous Traversal",
		gen: 9,
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Defog', attacker);
			this.add('-anim', attacker, 'Extreme Speed', defender);
		},
		selfSwitch: true,
		self: {
			onHit(attacker) {
				let success = false;
				const removeTarget = [
					'reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist', 'spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge',
				];
				const removeAll = [
					'spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge',
				];
				const targetSide = attacker.side.foe;
				for (const targetCondition of removeTarget) {
					if (targetSide.removeSideCondition(targetCondition)) {
						if (!removeAll.includes(targetCondition)) continue;
						this.add('-sideend', targetSide, this.dex.conditions.get(targetCondition).name, '[from] move: Treacherous Traversal', `[of] ${attacker}`);
						success = true;
					}
				}
				for (const sideCondition of removeAll) {
					if (attacker.side.removeSideCondition(sideCondition)) {
						this.add('-sideend', attacker.side, this.dex.conditions.get(sideCondition).name, '[from] move: Treacherous Traversal', `[of] ${attacker}`);
						success = true;
					}
				}
				success = this.field.clearTerrain();
				for (const side of attacker.side.foeSidesWithConditions()) {
					if (attacker.species.name === 'Sneasel') {
						success = side.addSideCondition('spikes');
					} else {
						success = side.addSideCondition('toxicspikes');
					}
				}
				return success;
			},
		},
		secondary: {}, // allows sheer force to trigger
		target: "normal",
		type: "Rock",
	},

	// Siegfried
	boltbeam: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		shortDesc: "Calls 45 BP Thunderbolt + 45 BP Ice Beam.",
		desc: "When used, calls a 45 Base Power Thunderbolt for use, and then calls a 45 Base Power Ice Beam for use. If one move fails, the other will still execute.",
		name: "BoltBeam",
		pp: 15,
		priority: 0,
		flags: {},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onTryHit(defender) {
			const tbolt = this.dex.getActiveMove('thunderbolt');
			tbolt.basePower = 45;
			const icebeam = this.dex.getActiveMove('icebeam');
			icebeam.basePower = 45;
			this.actions.useMove(tbolt, defender);
			this.actions.useMove(icebeam, defender);
			return null;
		},
		target: "self",
		type: "Electric",
	},

	// Sificon
	grassgaming: {
		accuracy: 100,
		basePower: 100,
		category: "Special",
		shortDesc: "Remove item, Leech Seed, Psn if stat raised.",
		desc: "If the user has not fainted, the defender loses its held item. This move cannot cause Pokemon with the Sticky Hold Ability or Pokemon holding Z-Crystals or Mega Stones to lose their held items. This move summons Leech Seed on the foe. Has a 100% chance to poison the defender if it had a stat stage raised this turn.",
		name: "Grass Gaming",
		pp: 15,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'G-Max Vine Lash', defender);
		},
		onBasePower(basePower, attacker, defender, move) {
			const item = defender.getItem();
			if (!this.singleEvent('TakeItem', item, defender.itemState, defender, defender, move, item)) return;
			if (item.id) {
				return this.chainModify(1.5);
			}
		},
		onAfterHit(defender, attacker) {
			if (attacker.hp) {
				const item = defender.takeItem();
				if (item) {
					this.add('-enditem', defender, item.name, '[from] move: Grass Gaming', `[of] ${attacker}`);
				}
			}
		},
		onHit(defender, attacker, move) {
			if (defender?.statsRaisedThisTurn) {
				defender.trySetStatus('psn', attacker, move);
			}
			if (!defender.hasType('Grass')) {
				defender.addVolatile('leechseed', attacker);
			}
		},
		target: "normal",
		type: "Grass",
	},

	// skies
	like: {
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		shortDesc: "The user recycles their item.",
		desc: "If this attack is successful, the user regains its last used held item, unless it was forcibly removed.",
		name: "Like..?",
		pp: 5,
		priority: 0,
		flags: { reflectable: 1, protect: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Recycle', defender);
			this.add('-anim', attacker, 'Seed Bomb', defender);
		},
		self: {
			onHit(pokemon) {
				if (!pokemon.item && pokemon.lastItem) {
					const item = pokemon.lastItem;
					pokemon.lastItem = '';
					this.add('-item', pokemon, this.dex.items.get(item), '[from] move: Recycle');
					pokemon.setItem(item);
				}
			},
		},
		target: "normal",
		type: "Grass",
	},

	// snake
	conceptrelevant: {
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		shortDesc: "Sets up 2 random hazards+psn foe. Switch.",
		desc: "If this move is successful, all entry hazards are removed from the user's side of the field, the defender becomes poisoned, and two random entry hazards are set on the defender's side. If this move is successful and the user has not fainted, the user switches out even if it is trapped and is replaced immediately by a selected party member. The user does not switch out if there are no unfainted party members, or if the defender switched out using an Eject Button or through the effect of the Emergency Exit or Wimp Out Abilities.",
		name: "Concept Relevant",
		gen: 9,
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Mortal Spin', defender);
			this.add('-anim', attacker, 'Spikes', defender);
			this.add('-anim', attacker, 'U-turn', defender);
		},
		onAfterHit(defender, pokemon) {
			if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
				this.add('-end', pokemon, 'Leech Seed', '[from] move: Concept Relevant', `[of] ${pokemon}`);
			}
			const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
			for (const condition of sideConditions) {
				if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
					this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] move: Concept Relevant', `[of] ${pokemon}`);
				}
			}
			if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
				pokemon.removeVolatile('partiallytrapped');
			}
			for (let i = 0; i < 2; i++) {
				const usableSideConditions = sideConditions.filter(condition => {
					if (condition === 'spikes') {
						return !defender.side.sideConditions[condition] || defender.side.sideConditions[condition].layers < 3;
					}
					if (condition === 'toxicspikes') {
						return !defender.side.sideConditions[condition] || defender.side.sideConditions[condition].layers < 2;
					}
					return !defender.side.sideConditions[condition];
				});
				if (usableSideConditions.length) {
					defender.side.addSideCondition(this.sample(usableSideConditions));
				}
			}
		},
		onAfterSubDamage(damage, defender, pokemon) {
			if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
				this.add('-end', pokemon, 'Leech Seed', '[from] move: Concept Relevant', `[of] ${pokemon}`);
			}
			const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
			for (const condition of sideConditions) {
				if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
					this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] move: Concept Relevant', `[of] ${pokemon}`);
				}
			}
			if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
				pokemon.removeVolatile('partiallytrapped');
			}
			for (let i = 0; i < 2; i++) {
				const usableSideConditions = sideConditions.filter(condition => {
					if (condition === 'spikes') {
						return !defender.side.sideConditions[condition] || defender.side.sideConditions[condition].layers < 3;
					}
					if (condition === 'toxicspikes') {
						return !defender.side.sideConditions[condition] || defender.side.sideConditions[condition].layers < 2;
					}
					return !defender.side.sideConditions[condition];
				});
				if (usableSideConditions.length) {
					defender.side.addSideCondition(this.sample(usableSideConditions));
				}
			}
		},
		secondary: {
			chance: 100,
			status: 'psn',
		},
		selfSwitch: true,
		target: "normal",
		type: "Bug",
	},

	// Soft Flex
	adaptivebeam: {
		accuracy: 100,
		basePower: 90,
		category: "Special",
		shortDesc: "If defender has boosts, steals them, +1 prio, 0 BP.",
		desc: "If the defender of this move has positive stat stage changes, this move will usually move first, and on use the attack deals no damage and instead moves all positive stat stage changes from the defender to the user.",
		name: "Adaptive Beam",
		pp: 15,
		priority: 0,
		flags: { sound: 1, protect: 1, bypasssub: 1 },
		stealsBoosts: true,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Flash Cannon', defender);
			if (defender.positiveBoosts()) {
				this.add('-anim', attacker, 'Extreme Evoboost', attacker);
			}
		},
		onModifyMove(move, pokemon, defender) {
			if (defender?.positiveBoosts()) {
				move.basePower = 0;
				move.category = 'Status';
			}
		},
		onModifyPriority(priority, attacker, defender, move) {
			if (defender?.positiveBoosts()) return priority + 1;
			return priority;
		},
		target: "normal",
		type: "Steel",
	},

	// Solaros & Lunaris
	mindmelt: {
		accuracy: 100,
		basePower: 100,
		category: "Special",
		overrideDefensiveStat: 'def',
		shortDesc: "Target's the foe's Def instead of Sp. Def.",
		desc: "Deals damage to the defender based on its Defense instead of Special Defense.",
		name: "Mind Melt",
		gen: 9,
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Burn Up', defender);
		},
		target: "normal",
		type: "Fire",
	},

	// Spiderz
	shepherdofthemafiaroom: {
		accuracy: 90,
		basePower: 65,
		category: "Physical",
		shortDesc: "Sets Sticky Web. 1.3x power if moves first.",
		desc: "If this move deals damage, it sets up a hazard on the opposing side of the field. This hazard lowers the Speed of each opposing Pokemon that switches in by 1 stage, unless it is a Flying-type Pokemon or has the Levitate Ability. This move's damage is multiplied by 1.3 if the user is the first Pokemon to move during the turn.",
		name: "Shepherd of the Mafia Room",
		gen: 9,
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker, move) {
			this.add('-anim', attacker, 'Explosion', attacker);
			this.add('-anim', attacker, 'Explosion', attacker);
			this.add('-anim', attacker, 'Explosion', attacker);
			this.add('-anim', attacker, 'Explosion', attacker);
			this.add('-anim', attacker, 'Explosion', attacker);
			this.add('-anim', attacker, 'Explosion', attacker);
		},
		onBasePower(relayVar, attacker, defender, move) {
			if (attacker.getStat('spe', false, true) > defender.getStat('spe', false, true)) {
				return this.chainModify([5325, 4096]);
			}
		},
		onAfterHit(defender, attacker, move) {
			if (!move.hasSheerForce && attacker.hp) {
				for (const side of attacker.side.foeSidesWithConditions()) {
					side.addSideCondition('stickyweb');
				}
			}
		},
		onAfterSubDamage(damage, defender, attacker, move) {
			if (!move.hasSheerForce && attacker.hp) {
				for (const side of attacker.side.foeSidesWithConditions()) {
					side.addSideCondition('stickyweb');
				}
			}
		},
		secondary: {}, // Sheer Force-boosted
		target: "normal",
		type: "Dark",
	},

	// spoo
	cardiotraining: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Boosts Atk, Def, and Sp. Def by 1 stage.",
		desc: "Boosts the user's Attack, Defense, and Special Defense by 1 stage.",
		name: "Cardio Training",
		gen: 9,
		pp: 5,
		priority: 0,
		flags: { snatch: 1, dance: 1, metronome: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker, move) {
			this.add('-anim', attacker, 'Geomancy', attacker);
		},
		boosts: {
			atk: 1,
			def: 1,
			spd: 1,
		},
		target: "self",
		type: "Fire",
	},

	// Steorra
	phantomweapon: {
		accuracy: 100,
		basePower: 65,
		category: "Physical",
		name: "Phantom Weapon",
		shortDesc: "2x power if user is holding item; destroys item.",
		desc: "If the user is holding an item, this move will deal double damage and the user's held item will be removed.",
		pp: 20,
		priority: 0,
		onModifyPriority(priority, pokemon) {
			if (!pokemon.item) return priority + 1;
		},
		flags: { protect: 1, mirror: 1 },
		onModifyMove(move, pokemon, defender) {
			if (!pokemon.item) {
				move.flags['contact'] = 1;
				move.flags['mirror'] = 1;
			}
		},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker, move) {
			this.add('-anim', attacker, 'Shadow Force', defender);
			if (!attacker.item || attacker.ignoringItem()) return;
			const item = attacker.getItem();
			if (!this.singleEvent('TakeItem', item, attacker.itemState, attacker, attacker, move, item)) return;
			move.basePower *= 2;
			attacker.addVolatile('phantomweapon');
		},
		condition: {
			onUpdate(pokemon) {
				const item = pokemon.getItem();
				pokemon.setItem('');
				pokemon.lastItem = item.id;
				pokemon.usedItemThisTurn = true;
				this.add('-enditem', pokemon, item.name, '[from] move: Phantom Weapon');
				this.runEvent('AfterUseItem', pokemon, null, null, item);
				pokemon.removeVolatile('phantomweapon');
			},
		},
		target: "normal",
		type: "Ghost",
	},

	// Struchni
	randfact: {
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		shortDesc: "Random type.",
		desc: "This move's typing is chosen randomly between the 18 standard types.",
		name: "~randfact",
		gen: 9,
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker, move) {
			move.type = this.sample(this.dex.types.names().filter(i => i !== 'Stellar'));
			this.add('-anim', attacker, 'Nasty Plot', attacker);
			this.add('-anim', attacker, 'Head Smash', defender);
		},
		target: "normal",
		type: "Steel",
	},

	// Sulo
	vengefulmood: {
		accuracy: 100,
		basePower: 60,
		basePowerCallback(pokemon) {
			return Math.min(140, 60 + 20 * pokemon.timesAttacked);
		},
		category: "Special",
		shortDesc: "+20 power for each time user was hit. Max 4 hits.",
		desc: "Power is equal to 60+(X*20), where X is the total number of times the user has been hit by a damaging attack during the battle, even if the user did not lose HP from the attack. X cannot be greater than 4 and does not reset upon switching out or fainting. Each hit of a multi-hit attack is counted, but confusion damage is not counted.",
		name: "Vengeful Mood",
		gen: 9,
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Aura Sphere', attacker);
		},
		target: "normal",
		type: "Fighting",
	},

	// Swiffix
	stinkbomb: {
		accuracy: 85,
		basePower: 10,
		category: "Special",
		shortDesc: "Hits 10 times. Each hit can miss.",
		desc: "Hits ten times. This move checks accuracy for each hit, and the attack ends if the defender avoids a hit. If one of the hits breaks the defender's substitute, it will take damage for the remaining hits. If the user has the Skill Link Ability, this move will always hit ten times. If the user is holding Loaded Dice, this move hits four to ten times at random without checking accuracy between hits.",
		name: "Stink Bomb",
		gen: 9,
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Population Bomb', defender);
			this.add('-anim', attacker, 'Venoshock', defender);
		},
		multihit: 10,
		multiaccuracy: true,
		target: "normal",
		type: "Poison",
	},

	// Syrinix
	asoulforasoul: {
		accuracy: 100,
		basePower: 0,
		category: "Physical",
		shortDesc: "KOes foe + user if ally was KOed prev. turn.",
		desc: "If one of the user's party members fainted last turn, this move results in a guaranteed KO for both the defender and the user. This move can hit Normal-type Pokemon. Fails if one of the user's party members did not faint last turn.",
		name: "A Soul for a Soul",
		pp: 5,
		priority: 1,
		flags: { protect: 1, contact: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Explosion', defender);
			this.add('-anim', attacker, 'Final Gambit', defender);
		},
		onTry(attacker, defender) {
			if (!attacker.side.faintedLastTurn) return false;
			attacker.faint(attacker);
			defender?.faint(attacker);
		},
		ignoreImmunity: true,
		target: "normal",
		type: "Ghost",
	},

	// Teclis
	risingsword: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		shortDesc: "Boosts Attack, Speed, and Crit ratio by 1.",
		desc: "Boosts the user's Attack and Speed by 1 stage and increases the user's chance of landing a critical hit.",
		name: "Rising Sword",
		pp: 5,
		priority: 0,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onHit(pokemon) {
			const success = !!this.boost({ atk: 1, spe: 1 });
			return pokemon.addVolatile('risingsword') || success;
		},
		condition: {
			noCopy: true,
			onStart(defender, attacker, effect) {
				this.effectState.layers = 1;
				if (!['costar', 'imposter', 'psychup', 'transform'].includes(effect?.id)) {
					this.add('-start', defender, 'move: Rising Sword');
				}
			},
			onRestart(defender, attacker, effect) {
				if (this.effectState.layers >= 3) return false;
				this.effectState.layers++;
				if (!['costar', 'imposter', 'psychup', 'transform'].includes(effect?.id)) {
					this.add('-start', defender, 'move: Rising Sword');
				}
			},
			onModifyCritRatio(critRatio) {
				return critRatio + this.effectState.layers;
			},
		},
		flags: {},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Focus Energy', defender);
			this.add('-anim', attacker, 'Agility', defender);
		},
		target: "self",
		type: "Psychic",
	},

	// Tenshi
	sandeat: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		shortDesc: "Protects user, changes type and gains a new move.",
		desc: "Nearly always moves first. The user protects itself from most attacks made by other Pokemon this turn and gains a random type. If the user has Dynamic Punch, Pyro Ball, Triple Axel, Stone Edge, or Aqua Tail, it will also replace that move with a new move based on the type gained. It can gain Fire type and Pyro Ball, Ice type and Triple Axel, Rock type and Stone Edge, and Water type and Aqua Tail. This move fails entirely if the user moved last this turn or if the foe switches out, and this move has an increasing chance to fail when used consecutively.",
		name: "SAND EAT",
		pp: 10,
		priority: 4,
		flags: { noassist: 1 },
		stallingMove: true,
		volatileStatus: 'protect',
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onHit(pokemon) {
			pokemon.addVolatile('stall');
			const types = ['Fire', 'Water', 'Ice', 'Rock'];
			const moves = ['pyroball', 'aquatail', 'tripleaxel', 'stoneedge'];
			const newType = this.sample(types.filter(i => !pokemon.hasType(i)));
			const newMove = moves[types.indexOf(newType)];
			const replacementIndex = Math.max(
				pokemon.moves.indexOf('dynamicpunch'),
				pokemon.moves.indexOf('pyroball'),
				pokemon.moves.indexOf('aquatail'),
				pokemon.moves.indexOf('tripleaxel'),
				pokemon.moves.indexOf('stoneedge')
			);
			if (replacementIndex < 0) {
				return;
			}
			const replacement = this.dex.moves.get(newMove);
			const replacementMove = {
				move: replacement.name,
				id: replacement.id,
				pp: replacement.pp,
				maxpp: replacement.pp,
				defender: replacement.defender,
				disabled: false,
				used: false,
			};
			pokemon.moveSlots[replacementIndex] = replacementMove;
			pokemon.baseMoveSlots[replacementIndex] = replacementMove;
			pokemon.addType(newType);
			this.add('-start', pokemon, 'typeadd', newType, '[from] move: SAND EAT');
			this.add(`c:|${getName((pokemon.illusion || pokemon).name)}|omg look HE EAT`);
		},
		onPrepareHit(pokemon, attacker) {
			this.add('-anim', attacker, 'Dig', pokemon);
			this.add('-anim', attacker, 'Odor Sleuth', pokemon);
			this.add('-anim', attacker, 'Stuff Cheeks', pokemon);
			this.add(`c:|${getName((pokemon.illusion || pokemon).name)}|he do be searching for rocks tho`);
			return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
		},
		target: "self",
		type: "Ground",
	},

	// Tico
	eternalwish: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Wish + Aromatherapy + Defog.",
		desc: "Sets a Wish on the user's side, healing the active Pokemon for 50% of the user's maximum HP at the end of the next turn. Lowers the defender's evasiveness by 1 stage. If this move is successful and whether or not the defender's evasiveness was affected, the effects of Reflect, Light Screen, Aurora Veil, Safeguard, Mist, Spikes, Toxic Spikes, Stealth Rock, G-Max Steelsurge, and Sticky Web end for the defender's side, and for the user's side all team members' non-volatile status conditions and the effects of Spikes, Toxic Spikes, Stealth Rock, G-Max Steelsurge, and Sticky Web are removed. Ignores a defender's substitute, although a substitute will still block the lowering of evasiveness. If there is a terrain active and this move is successful, the terrain will be cleared.",
		name: "Eternal Wish",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(attacker, defender) {
			this.add('-anim', defender, 'Wish', defender);
			this.add('-anim', defender, 'Aromatherapy', defender);
			this.add('-anim', defender, 'Defog', defender);
		},
		onHit(defender, attacker, move) {
			let success = false;
			if (!defender.volatiles['substitute'] || move.infiltrates) success = !!this.boost({ evasion: -1 });
			const removeTarget = [
				'reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist', 'spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge',
			];
			const removeAll = [
				'spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge',
			];
			for (const targetCondition of removeTarget) {
				if (defender.side.removeSideCondition(targetCondition)) {
					if (!removeAll.includes(targetCondition)) continue;
					this.add('-sideend', defender.side, this.dex.conditions.get(targetCondition).name, '[from] move: Eternal Wish', `[of] ${attacker}`);
					success = true;
				}
			}
			for (const sideCondition of removeAll) {
				if (attacker.side.removeSideCondition(sideCondition)) {
					this.add('-sideend', attacker.side, this.dex.conditions.get(sideCondition).name, '[from] move: Eternal Wish', `[of] ${attacker}`);
					success = true;
				}
			}
			this.field.clearTerrain();
			return success;
		},
		self: {
			slotCondition: 'Wish',
			onHit(defender, attacker, move) {
				this.add('-activate', attacker, 'move: Eternal Wish');
				let success = false;
				const allies = [...attacker.side.pokemon, ...attacker.side.allySide?.pokemon || []];
				for (const ally of allies) {
					if (ally !== attacker && ((ally.hasAbility('sapsipper')) ||
						(ally.volatiles['substitute'] && !move.infiltrates))) {
						continue;
					}
					if (ally.cureStatus()) success = true;
				}
				return success;
			},
		},
		target: "normal",
		type: "Ghost",
	},

	// TheJesucristoOsAma
	theloveofchrist: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		shortDesc: "Infatuates and confuses the defender.",
		desc: "Causes the defender to become confused and infatuated, regardless of gender. This move cannot ever have more than 1 PP.",
		name: "The Love Of Christ",
		gen: 9,
		pp: 1,
		noPPBoosts: true,
		priority: 0,
		flags: { protect: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Morning Sun', attacker);
			this.add('-anim', attacker, 'Lovely Kiss', defender);
		},
		onHit(defender, attacker) {
			defender.addVolatile('attract', attacker);
			defender.addVolatile('confusion', attacker);
		},
		target: "normal",
		type: "Normal",
	},

	// trace
	chronostasis: {
		accuracy: 90,
		basePower: 80,
		category: "Special",
		shortDesc: "If defender is KOed, user boosts random stat by 2.",
		desc: "If this move knocks out the defender, the user boosts a random stat, except Accuracy and Evasion, by 2 stages.",
		name: "Chronostasis",
		gen: 9,
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onPrepareHit() {
			this.attrLastMove('[anim] Future Sight');
		},
		onAfterMoveSecondarySelf(pokemon, defender, move) {
			if (!defender || defender.fainted || defender.hp <= 0) {
				const stats: BoostID[] = [];
				let stat: BoostID;
				for (stat in defender.boosts) {
					if (stat === 'accuracy' || stat === 'evasion') continue;
					if (defender.boosts[stat] < 6) {
						stats.push(stat);
					}
				}
				if (stats.length) {
					const randomStat = this.sample(stats);
					this.boost({ [randomStat]: 2 }, pokemon, pokemon, move);
				}
			}
		},
		target: "normal",
		type: "Psychic",
	},

	// Tuthur
	symphonieduzero: {
		accuracy: 100,
		basePower: 80,
		category: "Special",
		shortDesc: "Deals an additional 12.5% HP at end of turn.",
		desc: "If this move deals damage, at the end of the turn, the defender will take an additional 12.5% of its maximum HP in non-attack damage if it is still on the field.",
		name: "Symphonie du Ze\u0301ro",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Alluring Voice', defender);
		},
		volatileStatus: 'symphonieduzero',
		condition: {
			noCopy: true,
			onStart(pokemon) {
				this.add('-start', pokemon, 'Symphonie du Ze\u0301ro');
			},
			onResidualOrder: 13,
			onResidual(pokemon) {
				this.damage(pokemon.baseMaxhp / 8);
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Symphonie du Ze\u0301ro');
			},
		},
		target: "normal",
		type: "Fairy",
	},

	// Two of Roses
	dillydally: {
		accuracy: 90,
		basePower: 30,
		category: "Physical",
		shortDesc: "3 hits, 50% +1 stat/hit. Type=User 2nd type.",
		desc: "This move hits 3 times. For each successful hit, the user boosts a random stat, except Accuracy and Evasion, by 1 stage. The typing of this move is equal to the user's secondary type; it will instead use the user's primary type if the user lacks a secondary type.",
		name: "Dilly Dally",
		pp: 20,
		priority: 0,
		multihit: 3,
		flags: { protect: 1, contact: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Volt Tackle', attacker);
			this.add('-anim', attacker, 'Extreme Speed', defender);
		},
		onModifyType(move, pokemon) {
			let type = pokemon.getTypes()[pokemon.getTypes().length - 1];
			if (type === "Bird" || type === undefined) type = "???";
			if (type === "Stellar") type = pokemon.getTypes()[pokemon.getTypes(false, true).length - 1];
			move.type = type;
		},
		secondary: {
			chance: 50,
			onHit(defender, attacker, move) {
				const stats: BoostID[] = [];
				const boost: SparseBoostsTable = {};
				let statPlus: BoostID;
				for (statPlus in attacker.boosts) {
					if (statPlus === 'accuracy' || statPlus === 'evasion') continue;
					if (attacker.boosts[statPlus] < 6) {
						stats.push(statPlus);
					}
				}
				const randomStat: BoostID | undefined = stats.length ? this.sample(stats) : undefined;
				if (randomStat) boost[randomStat] = 1;
				this.boost(boost, attacker, attacker);
			},
		},
		target: "normal",
		type: "???",
	},

	// UT
	myboys: {
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		shortDesc: "Uses two status moves, then switches out.",
		desc: "The user uses two, at random, of: Feather Dance, Growl, Rain Dance, Sunny Day, Tailwind and Taunt. After these moves execute, the user switches out even if it is trapped and is replaced immediately by a selected party member. The user does not switch out if there are no unfainted party members out.",
		name: "My Boys",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			const varMoves = ['Feather Dance', 'Growl', 'Rain Dance', 'Sunny Day', 'Tailwind', 'Taunt', 'Will-O-Wisp'];
			const move1 = this.sample(varMoves);
			const move2 = this.sample(varMoves.filter(i => i !== move1));
			this.add('-message', `Fletchling used ${move1}!`);
			this.actions.useMove(move1, attacker);
			this.add('-message', `Taillow used ${move2}!`);
			this.actions.useMove(move2, attacker);
			this.add('-message', `Talonflame attacked!`);
			this.add('-anim', attacker, 'U-Turn', defender);
		},
		selfSwitch: true,
		target: "normal",
		type: "Flying",
	},

	// Valerian
	firststrike: {
		accuracy: 100,
		basePower: 25,
		category: "Physical",
		name: "First Strike",
		shortDesc: "Turn 1 only. Atk: +1 NVE, +2 NE, +3 SE.",
		desc: "Boosts the user's Attack by 1 stage if the attack is not very effective, 2 stages if the attack is neutral, and 3 stages if the attack is super effective. Fails unless it is the user's first turn on the field.",
		pp: 15,
		priority: 3,
		flags: { contact: 1, protect: 1, mirror: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, "Fake Out", defender);
		},
		onTry(attacker) {
			if (attacker.activeMoveActions > 1) {
				this.hint("First Strike only works on your first turn out.");
				return false;
			}
		},
		onAfterMoveSecondarySelf(pokemon, defender, move) {
			let boost = 2;
			const typeMod = defender.getMoveHitData(move).typeMod;
			if (typeMod > 0) {
				boost = 3;
			} else if (typeMod < 0) {
				boost = 1;
			}
			this.boost({ atk: boost }, pokemon, pokemon, move);
		},
		target: "normal",
		type: "Steel",
	},

	// Venous
	yourcripplinginterest: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Your Crippling Interest",
		shortDesc: "Tox; clears terrain and hazards on both sides.",
		desc: "The defender becomes badly poisoned, and all entry hazards and terrain effects are removed from both sides of the field. If the defender already has a non-volatile status condition, the removal effect can still occur.",
		pp: 15,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, bypasssub: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, "Esper Wing", defender);
			this.add('-anim', attacker, "Defog", attacker);
		},
		onHit(defender, attacker, move) {
			let success = false;
			if (!defender.volatiles['substitute'] || move.infiltrates) success = !!defender.trySetStatus('tox', attacker);
			const removeTarget = [
				'reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist', 'spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge',
			];
			const removeAll = [
				'spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge',
			];
			for (const targetCondition of removeTarget) {
				if (defender.side.removeSideCondition(targetCondition)) {
					if (!removeAll.includes(targetCondition)) continue;
					this.add('-sideend', defender.side, this.dex.conditions.get(targetCondition).name, '[from] move: Your Crippling Interest', `[of] ${attacker}`);
					success = true;
				}
			}
			for (const sideCondition of removeAll) {
				if (attacker.side.removeSideCondition(sideCondition)) {
					this.add('-sideend', attacker.side, this.dex.conditions.get(sideCondition).name, '[from] move: Your Crippling Interest', `[of] ${attacker}`);
					success = true;
				}
			}
			this.field.clearTerrain();
			return success;
		},
		ignoreAbility: true,
		target: "normal",
		type: "Flying",
	},

	// Violet
	buildingcharacter: {
		accuracy: 100,
		basePower: 50,
		basePowerCallback(pokemon, defender, move) {
			if (defender?.terastallized) {
				this.debug('BP doubled from tera');
				return move.basePower * 2;
			}
			return move.basePower;
		},
		category: "Physical",
		shortDesc: "Vs Tera'd defender: 0 prio, 2x BP, removes Tera.",
		desc: "Usually moves first. If the defender has Terastallized, this move becomes +0 priority and does double damage. If this move is successful against a Terastallized defender, the defender's Terastallization effect is permanently removed.",
		name: "building character",
		gen: 9,
		pp: 10,
		priority: 1,
		onModifyPriority(priority, pokemon, defender, move) {
			if (defender?.terastallized) return 0;
		},
		flags: { protect: 1, mirror: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			if (defender?.terastallized) this.add('-anim', attacker, "Block", defender);
			this.add('-anim', attacker, "Wicked Blow", defender);
		},
		onHit(pokemon, attacker) {
			if (pokemon?.terastallized) {
				this.add(`c:|${getName((attacker.illusion || attacker).name)}|lol never do that ever again thanks`);
				this.add('custom', '-endterastallize', pokemon);
				delete pokemon.terastallized;
				const details = pokemon.getUpdatedDetails();
				this.add('detailschange', pokemon, details);
			}
		},
		target: "normal",
		type: "Grass",
	},

	// Vistar
	virtualavatar: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Changes to Idol forme and sets a substitute.",
		desc: "If the user is a Zeraora, the user's ability changes to Virtual Idol and its full moveset becomes Overdrive, Sparkling Aria, Torch Song, and Teeter Dance, replacing every currently present move. The user takes 1/4 of its maximum HP, rounded down, and puts it into a substitute to take its place in battle.",
		name: "Virtual Avatar",
		pp: 10,
		priority: 0,
		flags: { sound: 1, failcopycat: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onTry(attacker) {
			if (attacker.species.name === 'Zeraora') {
				return;
			}
			this.hint("Only Zeraora can use this move.");
			this.attrLastMove('[still]');
			this.add('-fail', attacker, 'move: Virtual Avatar');
			return null;
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Morning Sun', attacker);
			this.add('-anim', attacker, 'Seed Flare', defender);
		},
		onHit(defender, attacker) {
			changeSet(this, defender, ssbSets['Vistar-Idol'], true);
			this.add(`c:|${getName((attacker.illusion || attacker).name)}|Finally, I'm making my debut`);
			if (attacker.volatiles['substitute']) return;
			if (attacker.hp <= attacker.maxhp / 4 || attacker.maxhp === 1) { // Shedinja clause
				this.add('-fail', attacker, 'move: Substitute', '[weak]');
			} else {
				attacker.addVolatile('substitute');
				this.directDamage(attacker.maxhp / 4);
			}
		},
		target: "self",
		type: "Normal",
	},

	// vmnunes
	gracideasblessing: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		shortDesc: "Uses Wish, switches out. Recipient gets Aqua Ring.",
		desc: "Sets a Wish on the user's side, healing the active Pokemon for 50% of the user's maximum HP at the end of the next turn. If this move is successful, the user switches out even if it is trapped and is replaced immediately by a selected party member, which will gain the Aqua Ring effect. The user does not switch out if there are no unfainted party members.",
		name: "Gracidea's Blessing",
		pp: 10,
		priority: 0,
		flags: {},
		selfSwitch: true,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Morning Sun', attacker);
			this.add('-anim', attacker, 'Seed Flare', defender);
		},
		slotCondition: 'gracideasblessing',
		condition: {
			duration: 2,
			onStart(pokemon, attacker) {
				this.effectState.hp = attacker.maxhp / 2;
			},
			onSwitchIn(defender) {
				if (!defender.fainted) defender.addVolatile('aquaring', defender);
			},
			onResidualOrder: 4,
			onEnd(defender) {
				if (defender && !defender.fainted) {
					this.heal(this.effectState.hp, defender, defender);
				}
			},
		},
		target: "self",
		type: "Grass",
	},

	// WarriorGallade
	fruitfullongbow: {
		accuracy: 90,
		basePower: 160,
		category: "Special",
		shortDesc: "Hit off higher atk, eats berry, Dragon/Fly eff.",
		desc: "Uses the user's higher attack stat in damage calculation. Does not need to charge in sun. If this move is successful and the user is holding a berry, the user consumes its held berry and restores 25% of its maximum HP. This move combines Dragon in its type effectiveness.",
		name: "Fruitful Longbow",
		gen: 9,
		pp: 15,
		priority: 0,
		flags: { charge: 1, protect: 1, mirror: 1, slicing: 1, wind: 1 },
		critRatio: 2,
		onEffectiveness(typeMod, defender, type, move) {
			return typeMod + this.dex.getEffectiveness('Dragon', type);
		},
		onModifyMove(move, pokemon, defender) {
			if (pokemon.getStat('atk') > pokemon.getStat('spa')) {
				move.overrideOffensiveStat = 'atk';
			}
		},
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				this.attrLastMove('[still]');
				this.add('-anim', attacker, 'Signal Beam', defender);
				this.add('-anim', attacker, 'Twister', defender);
				this.add('-anim', attacker, 'Psycho Cut', defender);
				return;
			}
			this.add('-anim', attacker, 'Tailwind', attacker);
			this.add('-message', `${attacker.name} whipped up an intense whirlwind and began to glow a vivine green!`);
			if (attacker.getItem().isBerry) {
				attacker.eatItem(true);
				this.heal(attacker.maxhp / 4, attacker);
			}
			if (['sunnyday', 'desolateland'].includes(attacker.effectiveWeather())) {
				this.attrLastMove('[still]');
				this.add('-anim', attacker, 'Signal Beam', defender);
				this.add('-anim', attacker, 'Twister', defender);
				this.add('-anim', attacker, 'Psycho Cut', defender);
				return;
			}
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		target: "normal",
		type: "Flying",
	},

	// Waves
	torrentialdrain: {
		accuracy: 100,
		basePower: 60,
		category: "Special",
		shortDesc: "Recovers 50% of damage dealt.",
		desc: "The user recovers 1/2 the HP lost by the defender, rounded half up.",
		name: "Torrential Drain",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, heal: 1, metronome: 1 },
		drain: [1, 2],
		target: "allAdjacent",
		type: "Water",
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Aqua Ring', attacker);
			this.add('-anim', attacker, 'Origin Pulse', defender);
			this.add('-anim', attacker, 'Parabolic Charge', defender);
		},
	},

	// WigglyTree
	perfectmimic: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Endure + Me First. Copied move hits off Atk.",
		desc: "Nearly always moves first. The user uses the move the defender chose for use this turn against it, if possible, with its power multiplied by 1.5. The move must be a damaging move usable by Me First. The user also activates the Endure effect on itself, preventing it from falling below 1 HP through direct attacks this turn. Ignores the defender's substitute for the purpose of copying the move. The move will fail entirely if the user did not move first this turn, or if the defender switched out. If the defender would use a move not usable by Me First, the Endure effect still occurs. This move has an increasing chance of failing when used in succession.",
		name: "Perfect Mimic",
		gen: 9,
		pp: 10,
		priority: 4,
		flags: {},
		volatileStatus: 'perfectmimic',
		onTryMove() {
			this.attrLastMove('[anim] Endure');
		},
		condition: {
			duration: 1,
			onStart(defender) {
				this.add('-singleturn', defender, 'move: Endure');
			},
			onDamagePriority: -10,
			onDamage(damage, defender, attacker, effect) {
				if (effect?.effectType === 'Move') {
					this.effectState.move = effect.id;
					if (damage >= defender.hp) {
						this.add('-activate', defender, 'move: Endure');
						return defender.hp - 1;
					}
				}
			},
			onSourceAfterMove(defender, attacker) {
				if (defender === this.effectState.defender || attacker !== this.effectState.defender) return;
				if (!defender.hp || !this.effectState.move) return;
				const move = this.dex.getActiveMove(this.effectState.move);
				if (move.isZ || move.isMax || move.category === 'Status') return;
				this.add('-message', attacker.name + ' tried to copy the move!');
				this.add('-anim', attacker, "Me First", defender);
				move.overrideOffensiveStat = 'atk';
				this.actions.useMove(move, attacker, { defender });
				delete this.effectState.move;
			},
			onBasePowerPriority: 12,
			onBasePower() {
				return this.chainModify(1.5);
			},
		},
		target: "self",
		type: "Normal",
	},

	// XpRienzo
	scorchingtruth: {
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Damage is increased by 75% if this move is not very effective against the defender.",
		shortDesc: "Deals 1.75x damage with resisted hits.",
		name: "Scorching Truth",
		gen: 9,
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, 'Focus Energy', attacker);
			this.add('-anim', attacker, 'Fusion Flare', defender);
		},
		onBasePower(basePower, attacker, defender, move) {
			if (defender.runEffectiveness(move) < 0) {
				this.debug(`Scorching truth resisted buff`);
				return this.chainModify(1.75);
			}
		},
		target: "normal",
		type: "Fire",
	},

	// xy01
	poisonouswind: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Poisonous Wind",
		shortDesc: "Badly poisons the foe and forces them out.",
		desc: "Badly poisons the defender. If the infliction of status is successful, the defender is forced to switch out and be replaced with a random unfainted ally. Fails if the defender is the last unfainted Pokemon in its party, or if the defender used Ingrain previously or has the Suction Cups Ability. This move will fail entirely if the defender has a non-volatile status condition.",
		pp: 10,
		priority: -6,
		flags: { reflectable: 1, mirror: 1, bypasssub: 1, allyanim: 1, metronome: 1, noassist: 1, failcopycat: 1, wind: 1 },
		forceSwitch: true,
		status: 'tox',
		target: "normal",
		type: "Poison",
	},

	// yeet dab xd
	topkek: {
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		shortDesc: "Gives foe Miracle Seed. Cycles Treasure Bag.",
		desc: "If the defender is holding an item that can be removed from it, it is replaced with a Miracle Seed. Cycles Treasure Bag.",
		name: "top kek",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, "Thief", defender);
			this.add('-anim', attacker, "Trick", defender);
			this.add('-anim', attacker, "Nasty Plot", attacker);
		},
		onAfterHit(defender, attacker, move) {
			if (attacker.hp) {
				if (!defender.hasItem('Miracle Seed')) {
					const item = defender.takeItem();
					if (item) {
						this.add('-enditem', defender, item.name, '[from] move: top kek', `[of] ${attacker}`);
						defender.setItem('Miracle Seed', attacker, move);
					}
				}
			}
		},
		target: "normal",
		type: "Dark",
	},

	// Yellow Paint
	whiteout: {
		accuracy: 85,
		basePower: 70,
		category: "Special",
		shortDesc: "Sets up Snow. Target's ability becomes Normalize.",
		desc: "If this move is successful, the current weather becomes snow, boosting the Defense of Ice-types by 1.5x for 5 turns, and the defender's ability is replaced with Normalize.",
		name: "Whiteout",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, bullet: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, "Weather Ball", defender);
			this.add('-anim', attacker, "Snowscape", attacker);
		},
		onHit(defender, attacker) {
			this.field.setWeather('snowscape');
			if (defender.setAbility('normalize')) {
				this.add('-ability', defender, 'Normalize', '[from] move: Whiteout');
			}
			this.add(`c:|${getName((attacker.illusion || attacker).name)}|A blank canvas.`);
		},
		target: "normal",
		type: "Ice",
	},

	// yuki
	tagyoureit: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Switch out; replacement: Focus Energy, +1 Spe.",
		desc: "The user switches out even if it is trapped and is replaced immediately by a selected party member. The replacement's Speed is boosted by 1 stage, and its critical hit rate is boosted by 2 stages. The user does not switch out if there are no unfainted party members.",
		name: "Tag, You're It!",
		pp: 5,
		priority: 0,
		flags: {},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, "Baton Pass", defender);
		},
		slotCondition: 'tagyoureit',
		condition: {
			onSwitchIn(defender) {
				if (defender && !defender.fainted) {
					this.add('-anim', defender, "Baton Pass", defender);
					defender.addVolatile('focusenergy');
					this.boost({ spe: 1 }, defender, this.effectState.attacker, this.dex.getActiveMove('tagyoureit'));
					defender.side.removeSlotCondition(defender, 'tagyoureit');
				}
			},
		},
		selfSwitch: true,
		target: "self",
		type: "Dark",
	},

	// YveltalNL
	highground: {
		accuracy: 100,
		basePower: 90,
		category: "Special",
		shortDesc: "If the user is taller than the defender, +1 SpA.",
		desc: "If the user's height as listed on its Pokedex data is greater than the defender's height, the user's Special Attack is boosted by 1 stage.",
		name: "High Ground",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		secondary: {
			chance: 100,
			onHit(defender, attacker, move) {
				if (this.dex.species.get(attacker.species).heightm > this.dex.species.get(defender.species).heightm) {
					this.boost({ spa: 1 }, attacker);
				}
			},
		},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, "Dragon Ascent", defender);
			this.add('-anim', attacker, "Scorching Sands", defender);
		},
		target: "normal",
		type: "Ground",
	},

	// Zalm
	dudurafish: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Heals 25% HP and sets Aqua Ring.",
		desc: "The user recovers 1/4 of its maximum HP and gains the Aqua Ring effect, healing it for 1/16th of its maximum HP at the end of each turn. The healing effect will still occur if the user already has Aqua Ring active.",
		name: "Dud ur a fish",
		pp: 5,
		priority: 0,
		flags: { heal: 1, snatch: 1 },
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', defender, "Recover", attacker);
			this.add('-anim', defender, "Aqua Ring", attacker);
		},
		onHit(pokemon) {
			let didSomething: boolean;
			if (pokemon.hasType("Water")) {
				didSomething = !!this.heal(this.modify(pokemon.baseMaxhp, 1, 2));
				didSomething = pokemon.cureStatus() || didSomething;
			} else {
				didSomething = !!this.heal(this.modify(pokemon.baseMaxhp, 1, 4));
			}
			didSomething = pokemon.addVolatile('aquaring') || didSomething;
			return didSomething;
		},
		target: "self",
		type: "Water",
	},

	// za
	shitpost: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Shitpost",
		shortDesc: "Confuses and paralyzes the defender.",
		pp: 20,
		priority: 0,
		flags: { protect: 1, reflectable: 1 },
		onTryMove(pokemon, defender, move) {
			this.attrLastMove('[still]');
			if (this.randomChance(1, 256)) {
				this.add('-fail', pokemon);
				this.add('-message', '(In Gen 1, moves with 100% accuracy have a 1/256 chance to miss.)');
				return false;
			}
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, "Hex", defender);
		},
		onHit(defender, attacker, move) {
			if (!defender.volatiles['confusion']) {
				defender.addVolatile('confusion', attacker, move);
			}
			defender.trySetStatus('par', attacker, move);
		},
		target: "normal",
		type: "Normal",
	},

	// Zarel
	tsignore: {
		accuracy: 100,
		basePower: 100,
		category: "Special",
		shortDesc: "Bypasses everything. Uses Higher Atk.",
		desc: "This move will bypass any negative effect on the field or the defender that would impede its ability to deal damage, including type-based immunities. This move is physical if the user's Attack is higher than its Special Attack.",
		name: "@ts-ignore",
		gen: 9,
		pp: 5,
		priority: 0,
		flags: {},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, "Conversion", attacker);
			this.add('-anim', attacker, "Techno Blast", defender);
		},
		onModifyMove(move, pokemon, defender) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) {
				move.category = 'Physical';
			}
		},
		onModifyType(move, pokemon) {
			if (pokemon.species.baseSpecies === 'Meloetta' && pokemon.terastallized) {
				move.type = 'Stellar';
			}
		},
		ignoreAbility: true,
		ignoreImmunity: true,
		ignoreDefensive: true,
		ignoreNegativeOffensive: true,
		breaksProtect: true,
		ignoreAccuracy: true,
		target: "normal",
		type: "Normal",
	},

	// zee
	solarsummon: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		shortDesc: "Sunny Day, Substitute, +1 Sp. Def.",
		desc: "Raises the user's Special Defense by 1 stage. Sets sun, powering up Fire-type moves and weakening Water-type moves for 5 turns. The user takes 1/4 of its maximum HP, rounded down, and puts it into a substitute to take its place in battle. If one part of this move is already in effect, the other part will still be attempted.",
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
		self: {
			boosts: {
				spd: 1,
			},
		},
		target: "self",
		type: "Fire",
	},

	// zoro
	darkestnight: {
		accuracy: 100,
		basePower: 95,
		category: "Physical",
		shortDesc: "Literally just Foul Play.",
		desc: "Damage is calculated using the defender's Attack stat, including stat stage changes. The user's Ability, item, and burn are used as normal.",
		name: "Darkest Night",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		overrideOffensivePokemon: 'defender',
		target: "normal",
		type: "Dark",
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, "Foul Play", defender);
		},
	},

	// Modified moves
	bleakwindstorm: {
		inherit: true,
		onModifyMove(move, pokemon, defender) {
			if (defender && ['raindance', 'primordialsea', 'stormsurge'].includes(defender.effectiveWeather())) {
				move.accuracy = true;
			}
		},
	},
	dig: {
		inherit: true,
		condition: {
			duration: 2,
			onImmunity(type, pokemon) {
				if (type === 'sandstorm' || type === 'deserteddunes' || type === 'hail') return false;
			},
			onInvulnerability(defender, attacker, move) {
				if (['earthquake', 'magnitude'].includes(move.id)) {
					return;
				}
				return false;
			},
			onSourceModifyDamage(damage, attacker, defender, move) {
				if (move.id === 'earthquake' || move.id === 'magnitude') {
					return this.chainModify(2);
				}
			},
		},
	},
	dive: {
		inherit: true,
		condition: {
			duration: 2,
			onImmunity(type, pokemon) {
				if (type === 'sandstorm' || type === 'deserteddunes' || type === 'hail') return false;
			},
			onInvulnerability(defender, attacker, move) {
				if (['surf', 'whirlpool'].includes(move.id)) {
					return;
				}
				return false;
			},
			onSourceModifyDamage(damage, attacker, defender, move) {
				if (move.id === 'surf' || move.id === 'whirlpool') {
					return this.chainModify(2);
				}
			},
		},
	},
	dreameater: {
		inherit: true,
		onTryImmunity(defender) {
			return defender.status === 'slp' || defender.hasAbility(['comatose', 'mensiscage']);
		},
	},
	electroshot: {
		inherit: true,
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name);
			this.boost({ spa: 1 }, attacker, attacker, move);
			if (['raindance', 'primordialsea', 'stormsurge'].includes(attacker.effectiveWeather())) {
				this.attrLastMove('[still]');
				this.addMove('-anim', attacker, move.name, defender);
				return;
			}
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
	},
	hex: {
		inherit: true,
		basePowerCallback(pokemon, defender, move) {
			if (defender.status || defender.hasAbility(['comatose', 'mensiscage'])) {
				this.debug('BP doubled from status condition');
				return move.basePower * 2;
			}
			return move.basePower;
		},
	},
	hurricane: {
		inherit: true,
		onModifyMove(move, pokemon, defender) {
			switch (defender?.effectiveWeather()) {
			case 'raindance':
			case 'primordialsea':
			case 'stormsurge':
				move.accuracy = true;
				break;
			case 'sunnyday':
			case 'desolateland':
				move.accuracy = 50;
				break;
			}
		},
	},
	infernalparade: {
		inherit: true,
		basePowerCallback(pokemon, defender, move) {
			if (defender.status || defender.hasAbility(['comatose', 'mensiscage'])) return move.basePower * 2;
			return move.basePower;
		},
	},
	ingrain: {
		inherit: true,
		condition: {
			onStart(pokemon) {
				this.add('-start', pokemon, 'move: Ingrain');
			},
			onResidualOrder: 7,
			onResidual(pokemon) {
				this.heal(pokemon.baseMaxhp / 16);
			},
			onTrapPokemon(pokemon) {
				pokemon.tryTrap();
			},
			// groundedness implemented in battle.engine.js:BattlePokemon#isGrounded
			onDragOut(pokemon, attacker, move) {
				if (attacker && this.queue.willMove(attacker)?.moveid === 'protectoroftheskies') return;
				this.add('-activate', pokemon, 'move: Ingrain');
				return null;
			},
		},
	},
	mistyterrain: {
		inherit: true,
		condition: {
			effectType: 'Terrain',
			duration: 5,
			durationCallback(attacker, effect) {
				if (attacker?.hasItem('terrainextender')) {
					return 8;
				}
				return 5;
			},
			onSetStatus(status, defender, attacker, effect) {
				if (!defender.isGrounded() || defender.isSemiInvulnerable()) return;
				if (effect && ((effect as Move).status || effect.id === 'yawn')) {
					this.add('-activate', defender, 'move: Misty Terrain');
				}
				return false;
			},
			onTryHitPriority: 4,
			onTryHit(defender, attacker, effect) {
				if (effect?.name === "Puffy Spiky Destruction") {
					this.add('-activate', defender, 'move: Misty Terrain');
					return null;
				}
			},
			onTryAddVolatile(status, defender, attacker, effect) {
				if (!defender.isGrounded() || defender.isSemiInvulnerable()) return;
				if (status.id === 'confusion') {
					if (effect.effectType === 'Move' && !effect.secondaries) this.add('-activate', defender, 'move: Misty Terrain');
					return null;
				}
			},
			onBasePowerPriority: 6,
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Dragon' && defender.isGrounded() && !defender.isSemiInvulnerable()) {
					this.debug('misty terrain weaken');
					return this.chainModify(0.5);
				}
			},
			onFieldStart(field, attacker, effect) {
				if (effect?.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Misty Terrain', '[from] ability: ' + effect.name, `[of] ${attacker}`);
				} else {
					this.add('-fieldstart', 'move: Misty Terrain');
				}
			},
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 7,
			onFieldEnd() {
				this.add('-fieldend', 'Misty Terrain');
			},
		},
	},
	moonlight: {
		inherit: true,
		onHit(pokemon) {
			let factor = 0.5;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				factor = 0.667;
				break;
			case 'raindance':
			case 'primordialsea':
			case 'stormsurge':
			case 'sandstorm':
			case 'deserteddunes':
			case 'hail':
			case 'snowscape':
				factor = 0.25;
				break;
			}
			const success = !!this.heal(this.modify(pokemon.maxhp, factor));
			if (!success) {
				this.add('-fail', pokemon, 'heal');
				return this.NOT_FAIL;
			}
			return success;
		},
	},
	morningsun: {
		inherit: true,
		onHit(pokemon) {
			let factor = 0.5;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				factor = 0.667;
				break;
			case 'raindance':
			case 'primordialsea':
			case 'stormsurge':
			case 'sandstorm':
			case 'deserteddunes':
			case 'hail':
			case 'snowscape':
				factor = 0.25;
				break;
			}
			const success = !!this.heal(this.modify(pokemon.maxhp, factor));
			if (!success) {
				this.add('-fail', pokemon, 'heal');
				return this.NOT_FAIL;
			}
			return success;
		},
	},
	nightmare: {
		inherit: true,
		condition: {
			noCopy: true,
			onStart(pokemon) {
				if (pokemon.status !== 'slp' && !pokemon.hasAbility(['comatose', 'mensiscage'])) {
					return false;
				}
				this.add('-start', pokemon, 'Nightmare');
			},
			onResidualOrder: 11,
			onResidual(pokemon) {
				this.damage(pokemon.baseMaxhp / 4);
			},
		},
	},
	psychicterrain: {
		inherit: true,
		condition: {
			effectType: 'Terrain',
			duration: 5,
			durationCallback(attacker, effect) {
				if (attacker?.hasItem('terrainextender')) {
					return 8;
				}
				return 5;
			},
			onTryHitPriority: 4,
			onTryHit(defender, attacker, effect) {
				if (effect && (effect.priority <= 0.1 || effect.defender === 'self') && effect.name !== "Puffy Spiky Destruction") {
					return;
				}
				if (defender.isSemiInvulnerable() || defender.isAlly(attacker)) return;
				if (!defender.isGrounded()) {
					const baseMove = this.dex.moves.get(effect.id);
					if (baseMove.priority > 0) {
						this.hint("Psychic Terrain doesn't affect airborne Pokémon.");
					}
					return;
				}
				this.add('-activate', defender, 'move: Psychic Terrain');
				return null;
			},
			onBasePowerPriority: 6,
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Psychic' && attacker.isGrounded() && !attacker.isSemiInvulnerable()) {
					this.debug('psychic terrain boost');
					return this.chainModify([5325, 4096]);
				}
			},
			onFieldStart(field, attacker, effect) {
				if (effect?.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Psychic Terrain', '[from] ability: ' + effect.name, `[of] ${attacker}`);
				} else {
					this.add('-fieldstart', 'move: Psychic Terrain');
				}
			},
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 7,
			onFieldEnd() {
				this.add('-fieldend', 'move: Psychic Terrain');
			},
		},
	},
	rest: {
		inherit: true,
		onTry(attacker) {
			if (attacker.status === 'slp' || attacker.hasAbility(['comatose', 'mensiscage'])) return false;

			if (attacker.hp === attacker.maxhp) {
				this.add('-fail', attacker, 'heal');
				return null;
			}
			if (attacker.hasAbility(['insomnia', 'vitalspirit'])) {
				this.add('-fail', attacker, '[from] ability: ' + attacker.getAbility().name, `[of] ${attacker}`);
				return null;
			}
		},
	},
	sandsearstorm: {
		inherit: true,
		onModifyMove(move, pokemon, defender) {
			if (defender && ['raindance', 'primordialsea', 'stormsurge'].includes(defender.effectiveWeather())) {
				move.accuracy = true;
			}
		},
	},
	shoreup: {
		inherit: true,
		onHit(pokemon) {
			let factor = 0.5;
			if (this.field.isWeather(['sandstorm', 'deserteddunes'])) {
				factor = 0.667;
			}
			const success = !!this.heal(this.modify(pokemon.maxhp, factor));
			if (!success) {
				this.add('-fail', pokemon, 'heal');
				return this.NOT_FAIL;
			}
			return success;
		},
	},
	sleeptalk: {
		inherit: true,
		onTry(attacker) {
			return attacker.status === 'slp' || attacker.hasAbility(['comatose', 'mensiscage']);
		},
	},
	snore: {
		inherit: true,
		onTry(attacker) {
			return attacker.status === 'slp' || attacker.hasAbility(['comatose', 'mensiscage']);
		},
	},
	solarbeam: {
		inherit: true,
		onBasePower(basePower, pokemon, defender) {
			const weakWeathers = ['raindance', 'primordialsea', 'stormsurge', 'sandstorm', 'deserteddunes', 'hail', 'snowscape'];
			if (weakWeathers.includes(pokemon.effectiveWeather())) {
				this.debug('weakened by weather');
				return this.chainModify(0.5);
			}
		},
	},
	solarblade: {
		inherit: true,
		onBasePower(basePower, pokemon, defender) {
			const weakWeathers = ['raindance', 'primordialsea', 'stormsurge', 'sandstorm', 'deserteddunes', 'hail', 'snowscape'];
			if (weakWeathers.includes(pokemon.effectiveWeather())) {
				this.debug('weakened by weather');
				return this.chainModify(0.5);
			}
		},
	},
	stickyweb: {
		inherit: true,
		condition: {
			onSideStart(side) {
				this.add('-sidestart', side, 'move: Sticky Web');
			},
			onSwitchIn(pokemon) {
				if (!pokemon.isGrounded() || pokemon.hasItem('heavydutyboots') || pokemon.hasAbility('eternalgenerator')) return;
				this.add('-activate', pokemon, 'move: Sticky Web');
				this.boost({ spe: -1 }, pokemon, pokemon.side.foe.active[0], this.dex.getActiveMove('stickyweb'));
			},
		},
	},
	synthesis: {
		inherit: true,
		onHit(pokemon) {
			let factor = 0.5;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				factor = 0.667;
				break;
			case 'raindance':
			case 'primordialsea':
			case 'stormsurge':
			case 'sandstorm':
			case 'deserteddunes':
			case 'hail':
			case 'snowscape':
				factor = 0.25;
				break;
			}
			const success = !!this.heal(this.modify(pokemon.maxhp, factor));
			if (!success) {
				this.add('-fail', pokemon, 'heal');
				return this.NOT_FAIL;
			}
			return success;
		},
	},
	thunder: {
		inherit: true,
		onModifyMove(move, pokemon, defender) {
			switch (defender?.effectiveWeather()) {
			case 'raindance':
			case 'primordialsea':
			case 'stormsurge':
				move.accuracy = true;
				break;
			case 'sunnyday':
			case 'desolateland':
				move.accuracy = 50;
				break;
			}
		},
	},
	wakeupslap: {
		inherit: true,
		basePowerCallback(pokemon, defender, move) {
			if (defender.status === 'slp' || defender.hasAbility(['comatose', 'mensiscage'])) {
				this.debug('BP doubled on sleeping defender');
				return move.basePower * 2;
			}
			return move.basePower;
		},
	},
	weatherball: {
		inherit: true,
		onModifyType(move, pokemon) {
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				move.type = 'Fire';
				break;
			case 'raindance':
			case 'primordialsea':
			case 'stormsurge':
				move.type = 'Water';
				break;
			case 'sandstorm':
			case 'deserteddunes':
				move.type = 'Rock';
				break;
			case 'hail':
			case 'snowscape':
				move.type = 'Ice';
				break;
			}
		},
		onModifyMove(move, pokemon) {
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
			case 'raindance':
			case 'primordialsea':
			case 'stormsurge':
			case 'sandstorm':
			case 'deserteddunes':
			case 'hail':
			case 'snowscape':
				move.basePower *= 2;
				break;
			}
			this.debug(`BP: ${move.basePower}`);
		},
	},
	wildboltstorm: {
		inherit: true,
		onModifyMove(move, pokemon, defender) {
			if (defender && ['raindance', 'primordialsea', 'stormsurge'].includes(defender.effectiveWeather())) {
				move.accuracy = true;
			}
		},
	},
	gravity: {
		inherit: true,
		condition: {
			duration: 5,
			durationCallback(attacker, effect) {
				if (attacker?.hasAbility('persistent')) {
					this.add('-activate', attacker, 'ability: Persistent', '[move] Gravity');
					return 7;
				}
				return 5;
			},
			onFieldStart(defender, attacker) {
				if (attacker?.hasAbility('persistent')) {
					this.add('-fieldstart', 'move: Gravity', '[persistent]');
				} else {
					this.add('-fieldstart', 'move: Gravity');
				}
				for (const pokemon of this.getAllActive()) {
					let applies = false;
					if (pokemon.removeVolatile('bounce') || pokemon.removeVolatile('fly')) {
						applies = true;
						this.queue.cancelMove(pokemon);
						pokemon.removeVolatile('twoturnmove');
					}
					if (pokemon.volatiles['skydrop']) {
						applies = true;
						this.queue.cancelMove(pokemon);

						if (pokemon.volatiles['skydrop'].attacker) {
							this.add('-end', pokemon.volatiles['twoturnmove'].attacker, 'Sky Drop', '[interrupt]');
						}
						pokemon.removeVolatile('skydrop');
						pokemon.removeVolatile('twoturnmove');
					}
					if (pokemon.volatiles['magnetrise']) {
						applies = true;
						delete pokemon.volatiles['magnetrise'];
					}
					if (pokemon.volatiles['riseabove']) {
						applies = true;
						delete pokemon.volatiles['riseabove'];
					}
					if (pokemon.volatiles['telekinesis']) {
						applies = true;
						delete pokemon.volatiles['telekinesis'];
					}
					if (applies) this.add('-activate', pokemon, 'move: Gravity');
				}
			},
			onModifyAccuracy(accuracy) {
				if (typeof accuracy !== 'number') return;
				return this.chainModify([6840, 4096]);
			},
			onDisableMove(pokemon) {
				for (const moveSlot of pokemon.moveSlots) {
					if (this.dex.moves.get(moveSlot.id).flags['gravity']) {
						pokemon.disableMove(moveSlot.id);
					}
				}
			},
			// groundedness implemented in battle.engine.js:BattlePokemon#isGrounded
			onBeforeMovePriority: 6,
			onBeforeMove(pokemon, defender, move) {
				if (move.flags['gravity'] && !move.isZ) {
					this.add('cant', pokemon, 'move: Gravity', move);
					return false;
				}
			},
			onModifyMove(move, pokemon, defender) {
				if (move.flags['gravity'] && !move.isZ) {
					this.add('cant', pokemon, 'move: Gravity', move);
					return false;
				}
			},
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 2,
			onFieldEnd() {
				this.add('-fieldend', 'move: Gravity');
			},
		},
	},
	magnetrise: {
		inherit: true,
		condition: {
			duration: 5,
			durationCallback(defender, attacker, effect) {
				if (effect?.name === 'Antidote') return 3;
				return 5;
			},
			onStart(defender) {
				this.add('-start', defender, 'Magnet Rise');
			},
			onImmunity(type) {
				if (type === 'Ground') return false;
			},
			onResidualOrder: 18,
			onEnd(defender) {
				this.add('-end', defender, 'Magnet Rise');
			},
		},
	},

	// Try playing Staff Bros with dynamax clause and see what happens
	supermetronome: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Uses 2-5 random moves. Does not include 1-Base Power Z-Moves, Super Metronome, Metronome, or 10-Base Power Max moves.",
		shortDesc: "Uses 2-5 random moves.",
		name: "Super Metronome",
		isNonstandard: "Custom",
		pp: 100,
		noPPBoosts: true,
		priority: 0,
		flags: {},
		onTryMove(pokemon) {
			this.attrLastMove('[still]');
		},
		onPrepareHit(defender, attacker) {
			this.add('-anim', attacker, "Metronome", attacker);
		},
		onHit(defender, attacker, effect) {
			const moves = [];
			for (const move of this.dex.moves.all()) {
				if (move.placeholderFor || move.id.includes('metronome')) continue;
				// Calling 1 BP move is somewhat lame and disappointing. However,
				// signature Z moves are fine, as they actually have a base power.
				if (move.isZ && move.basePower === 1) continue;
				if (move.gen > this.gen) continue;
				if (move.isMax) continue;
				moves.push(move.name);
			}
			let randomMove: string;
			if (moves.length) {
				randomMove = this.sample(moves);
			} else {
				return false;
			}
			this.actions.useMove(randomMove, defender);
		},
		multihit: [2, 5],
		target: "self",
		type: "???",
	},
};
