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
	// aegii
	equipaegislash: {
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		shortDesc: "50% +1 Atk, 50% +1 Def, eats berry.",
		name: "Equip Aegislash",
		gen: 9,
		pp: 10,
		priority: 2,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Shadow Sneak', target);
			this.add('-anim', source, 'Swords Dance', source);
			this.add('-anim', source, 'Iron Defense', source);
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
			onHit(target, source) {
				if (!source.getItem().isBerry) return;
				source.eatItem(true);
			},
		},
		secondary: null,
		target: "normal",
		type: "Steel",
	},

	// Aelita
	smelt: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "User protects, burns itself, and gains +2 Spe/+1 Atk.",
		name: "Smelt",
		gen: 9,
		pp: 10,
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
			pokemon.trySetStatus('brn');
			this.add('-anim', pokemon, 'Shift Gear', pokemon);
			this.boost({spe: 2, atk: 1});
		},
		secondary: null,
		target: "self",
		type: "Steel",
	},

	// Akir
	freeswitchbutton: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Haze + Parting Shot + Replacement heals 33%.",
		name: "Free Switch Button",
		gen: 9,
		pp: 10,
		priority: 0,
		flags: {},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onHit(target, source, move) {
			this.add('-clearallboost');
			for (const pokemon of this.getAllActive()) {
				pokemon.clearBoosts();
			}
			const foe = source.foes()[0];
			if (!foe) return;
			const success = this.boost({atk: -1, spa: -1}, foe, source);
			if (!success && !foe.hasAbility('mirrorarmor')) {
				delete move.selfSwitch;
			}
		},
		// the foe cannot be set as the target in move properties because it breaks the 33% replacement heal
		selfSwitch: true,
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Haze', source);
		},
		slotCondition: 'freeswitchbutton',
		condition: {
			onSwap(target) {
				if (!target.fainted && (target.hp < target.maxhp)) {
					target.heal(target.maxhp / 3);
					this.add('-heal', target, target.getHealth, '[from] move: Free Switch Button');
					target.side.removeSlotCondition(target, 'freeswitchbutton');
				}
			},
		},
		secondary: null,
		target: "self",
		type: "Water",
	},

	// Alex
	spicierextract: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Leech Seed + Heal Block + Infestation",
		name: "Spicier Extract",
		pp: 15,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1, powder: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Leafage', target);
			this.add('-anim', source, 'Stun Spore', target);
		},
		onHit(target, source) {
			let success = false;
			if (target.addVolatile('partiallytrapped', source)) success = true;
			if (target.addVolatile('leechseed', source)) success = true;
			if (target.addVolatile('healblock', source)) success = true;
			return success;
		},
		secondary: null,
		target: "normal",
		type: "Grass",
	},

	// Alexander489
	scumhunt: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Uses a random damaging, non-resisted move.",
		name: "Scumhunt",
		pp: 10,
		priority: 0,
		flags: {protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source, move) {
			const nresTypes = [];
			for (const i of this.dex.types.names()) {
				if (i === "Stellar") continue;
				if (target) {
					const effect = this.dex.getEffectiveness(i, target.types);
					const immune = this.dex.getImmunity(i, target.types);
					if (effect >= 0 && immune) {
						nresTypes.push(i);
					}
				}
			}
			if (!nresTypes.length) return;
			const netType = this.sample(nresTypes);
			const moves = this.dex.moves.all().filter(m => (
				(![2, 4].includes(this.gen) || !source.moves.includes(m.id)) &&
				(!m.isNonstandard || m.isNonstandard === 'Unobtainable') &&
				m.flags['metronome'] && m.type === netType && m.category !== "Status"
			));
			let randomMove = '';
			if (moves.length) {
				moves.sort((a, b) => a.num - b.num);
				randomMove = this.sample(moves).id;
			}
			if (!randomMove) return false;
			source.side.lastSelectedMove = this.toID(randomMove);
			this.add('-anim', source, 'Spite', target);
			this.add('-anim', source, 'Grudge', target);
			this.add('-anim', source, 'Metronome', source);
			this.actions.useMove(randomMove, source);
		},
		target: "normal",
		type: "???",
	},

	// Appletun a la Mode
	extracourse: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Recycles held berry and boosts 2 random stats (-acc/eva) by 1.",
		name: "Extra Course",
		gen: 9,
		pp: 5,
		priority: 0,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Recycle', target);
		},
		flags: {snatch: 1},
		onHit(pokemon) {
			if (!pokemon.item && pokemon.lastItem) {
				const item = pokemon.lastItem;
				pokemon.lastItem = '';
				this.add('-item', pokemon, this.dex.items.get(item), '[from] move: Extra Course');
				pokemon.setItem(item);
			}
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
			if (randomStat) boost[randomStat] = 1;
			stats = [];
			for (statPlus in pokemon.boosts) {
				if (statPlus === 'accuracy' || statPlus === 'evasion') continue;
				if (pokemon.boosts[statPlus] < 6 && statPlus !== randomStat) {
					stats.push(statPlus);
				}
			}
			randomStat = stats.length ? this.sample(stats) : undefined;
			if (randomStat) boost[randomStat] = 1;
			this.boost(boost, pokemon, pokemon);
		},
		target: "self",
		type: "Normal",
	},

	// aQrator
	torisstori: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		shortDesc: "Confuses the foe and deals 1/6th of its max HP for 4-5 turns.",
		name: "Tori's Stori",
		gen: 9,
		pp: 5,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Water Spout', target);
			this.add('-anim', source, 'Confuse Ray', target);
		},
		volatileStatus: 'torisstori',
		condition: {
			duration: 5,
			durationCallback(target, source) {
				if (source?.hasItem('gripclaw')) return 8;
				return this.random(5, 6);
			},
			onStart(target) {
				this.add('-start', target, 'Tori\'s Stori');
			},
			onResidualOrder: 6,
			onResidual(pokemon) {
				this.damage(pokemon.baseMaxhp / 6);
			},
			onEnd(target) {
				this.add('-end', target, 'Tori\'s Stori');
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
		flags: {failcopycat: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Max Guard', source);
			if (source.species.name === 'Quagsire') {
				this.add('-anim', source, 'Protect', source);
				return !!this.queue.willAct() && this.runEvent('StallMove', source);
			} else {
				this.add('-anim', source, 'Recover', source);
			}
		},
		volatileStatus: 'protect',
		onModifyMove(move, pokemon) {
			if (pokemon.species.name === 'Clodsire') {
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
		secondary: null,
		target: "self",
		type: "Ground",
	},

	// Archas
	aurarain: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Cures status conditions and heals 25% HP for entire party except the user.",
		name: "Aura Rain",
		pp: 1,
		priority: 0,
		flags: {},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Rain Dance', source);
			this.add('-anim', source, 'Water Sport', source);
			this.add('-anim', source, 'Aromatherapy', source);
		},
		onHit(pokemon) {
			this.add('-message', 'An alleviating aura rains down on the field!');
			let success = false;
			const allies = [...pokemon.side.pokemon, ...pokemon.side.allySide?.pokemon || []];
			for (const ally of allies) {
				if (ally === pokemon) continue;
				if (ally.heal(this.modify(ally.maxhp, 0.25))) {
					this.add('-heal', ally, ally.getHealth);
					success = true;
				}
				if (ally.cureStatus()) success = true;
			}
			return success;
		},
		isZ: "lilligantiumz",
		secondary: null,
		target: "allyTeam",
		type: "Grass",
	},

	// Arcueid
	funnyvamp: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Changes user's forme, effects vary with forme.",
		name: "Funny Vamp",
		gen: 9,
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, failcopycat: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Moonlight', target);
			this.add('-anim', source, 'Quiver Dance', target);
			this.add('-anim', source, 'Geomancy', target);
			const img = "https://i.ibb.co/3N3V3Nf/ZR0qNHd.gif";
			this.add(`c:|${getName('Arcueid')}|/html <img src="${img}" width="32" height="32" />`);
		},
		onHit(target, source, move) {
			if (source.species.name === "Deoxys-Defense") {
				changeSet(this, source, ssbSets['Arcueid-Attack'], true);
				let randMove = this.random(3) - 1;
				if (randMove < 0) randMove = 0;
				this.actions.useMove(source.moveSlots[randMove].id, target);
			} else {
				changeSet(this, source, ssbSets['Arcueid'], true);
				for (let i = 0; i < 2; i++) {
					const stats: BoostID[] = [];
					const boost: SparseBoostsTable = {};
					let statPlus: BoostID;
					for (statPlus in source.boosts) {
						if (statPlus === 'accuracy' || statPlus === 'evasion') continue;
						if (source.boosts[statPlus] < 6) {
							stats.push(statPlus);
						}
					}
					const randomStat: BoostID | undefined = stats.length ? this.sample(stats) : undefined;
					if (randomStat) boost[randomStat] = 1;
					this.boost(boost, source, source);
				}
				this.heal(source.baseMaxhp / 2, source);
			}
		},
		secondary: null,
		target: "self",
		type: "Psychic",
	},

	// Arsenal
	megidolaon: {
		accuracy: 100,
		basePower: 200,
		category: "Special",
		shortDesc: "No additional effect.",
		name: "Megidolaon",
		gen: 9,
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Hyper Beam', target);
			this.add('-anim', source, 'Earthquake', target);
		},
		secondary: null,
		target: "normal",
		type: "???",
	},

	// Artemis
	automatedresponse: {
		accuracy: 100,
		basePower: 90,
		category: "Special",
		shortDesc: "Changes the move's and user's type to deal super effective damage. 10% false positive rate.",
		name: "Automated Response",
		pp: 20,
		priority: 0,
		flags: {protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source, move) {
			const seTypes = [];
			const nveTypes = [];
			let netType = "";
			for (const i of this.dex.types.names()) {
				if (target) {
					const effect = this.dex.getEffectiveness(i, target.types);
					const immune = this.dex.getImmunity(i, target.types);
					if (effect > 0 && immune) {
						seTypes.push(i);
					} else if (effect < 0 && immune) {
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
				this.add('-message', `${getName((target.illusion || target).name)} triggered a false-positive and caused ${move.name} to become not-very effective!`);
			}
			source.setType(netType);
			this.add('-start', source, 'typechange', netType);
			if (move) {
				move.type = netType;
			}
			this.add('-anim', source, 'Techno Blast', target);
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
		name: "Anyone can be killed",
		pp: 10,
		priority: 0,
		flags: {protect: 1, sound: 1, bypasssub: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		self: {
			volatileStatus: 'anyonecanbekilled',
		},
		condition: {
			duration: 3,
			onResidualOrder: 3,
			onStart(target, source, sourceEffect) {
				this.boost({spa: 2}, source);
			},
			onEnd(target) {
				this.boost({spa: -2}, target);
			},
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Dragon Dance', target);
			this.add('-anim', source, 'Earth Power', target);
		},
		target: "normal",
		type: "Ground",
	},

	// autumn
	seasonssmite: {
		accuracy: 100,
		basePower: 90,
		category: "Special",
		shortDesc: "+1 Defense if Protosynthesis is active.",
		name: "Season's Smite",
		gen: 9,
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', target, 'Morning Sun', target);
		},
		secondary: {
			chance: 100,
			onHit(target, source, move) {
				if (source.volatiles['protosynthesis']) {
					this.boost({def: 1}, source, source, move);
				}
			},
		},
		target: "normal",
		type: "Ghost",
	},

	// ausma
	sigilsstorm: {
		accuracy: 90,
		basePower: 15,
		category: "Special",
		shortDesc: "Hits 5 times, each hit has a 20% chance to inflict status.",
		name: "Sigil's Storm",
		pp: 5,
		multihit: 5,
		priority: 0,
		flags: {snatch: 1, metronome: 1, protect: 1, failcopycat: 1},
		onTry(source) {
			if (source.illusion || source.name === 'ausma') {
				return;
			}
			this.attrLastMove('[still]');
			this.add('-fail', source, 'move: Sigil\'s Storm');
			this.hint("Only a Pokemon whose nickname is \"ausma\" can use this move.");
			return null;
		},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Geomancy', source);
			this.add('-anim', source, 'Blood Moon', target);
		},
		secondary: {
			chance: 20,
			onHit(target, source, move) {
				move.willCrit = false;
				const chance = this.random(100);
				if (chance <= 10) {
					target.trySetStatus('psn', target);
				} else if (chance <= 20) {
					target.trySetStatus('tox', target);
				} else if (chance <= 30) {
					target.trySetStatus('brn', target);
				} else if (chance <= 50) {
					const stats: BoostID[] = [];
					const boost: SparseBoostsTable = {};
					let statPlus: BoostID;
					const recipient = this.randomChance(1, 2) ? source : target;
					for (statPlus in recipient.boosts) {
						if (statPlus === 'accuracy' || statPlus === 'evasion') continue;
						if (chance <= 40 && recipient.boosts[statPlus] > -6) {
							stats.push(statPlus);
						} else if (chance <= 50 && recipient.boosts[statPlus] < 6) {
							stats.push(statPlus);
						}
					}
					const randomStat: BoostID | undefined = stats.length ? this.sample(stats) : undefined;
					if (randomStat) {
						boost[randomStat] = 1;
						if (chance < 40) {
							boost[randomStat] = -1;
						}
					}
					this.boost(boost, recipient, recipient);
				} else if (chance <= 60) {
					move.willCrit = true;
				} else if (chance <= 70) {
					target.addVolatile('taunt', source);
				} else if (chance <= 80) {
					target.addVolatile('torment', source);
				} else if (chance <= 90) {
					target.addVolatile('confusion', source);
				} else if (chance <= 98) {
					const mistyExplosion = this.dex.getActiveMove('mistyexplosion');
					mistyExplosion.basePower = 75;
					this.actions.useMove(mistyExplosion, source);
				} else {
					changeSet(this, target, ssbSets["ausma-Fennekin"], true);
					this.add(`c:|${getName('ausma')}|oh shit i posted to the wrong account`);
				}
			},
		},
		target: "normal",
		type: "Fairy",
	},

	// AuzBat
	preptime: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Raises the user's Sp. Atk by 2 and Speed by 1.",
		name: "Prep Time",
		pp: 5,
		priority: 0,
		flags: {snatch: 1, metronome: 1},
		boosts: {
			spa: 2,
			spe: 1,
		},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Tidy Up', source);
		},
		target: "self",
		type: "Psychic",
	},

	// avarice
	yugiohreference: {
		accuracy: 90,
		basePower: 105,
		category: "Special",
		shortDesc: "40% chance to force the foe out.",
		name: "yu-gi-oh reference",
		pp: 5,
		priority: -6,
		flags: {protect: 1, bullet: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Never-Ending Nightmare', target);
		},
		secondary: {
			chance: 40,
			onHit(target, source, move) {
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
		shortDesc: "+3 priority if target uses custom move. +3 Atk if it KOs.",
		name: "Buzzer Stinger Counter",
		gen: 9,
		pp: 10,
		priority: 1,
		flags: {contact: 1, protect: 1, mirror: 1},
		onModifyPriority(priority, pokemon) {
			const move = this.queue.willMove(pokemon.foes()[0])?.moveid;
			if (move && pokemon.foes()[0].moves.indexOf(move) === pokemon.foes()[0].moves.length - 1) {
				this.debug('BSC priority boost');
				return priority + 2;
			}
		},
		onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.boost({atk: 3}, pokemon, pokemon, move);
		},
		secondary: null,
		target: "normal",
		type: "Bug",
	},

	// berry
	whatkind: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Eats berry, gives random new berry, heals 25%.",
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
		secondary: null,
		target: "self",
		type: "Water",
	},

	// Billo
	hackcheck: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "80%: Change into Lunala, else Solgaleo.",
		name: "Hack Check",
		gen: 9,
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1, bypasssub: 1, failcopycat: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onHit(target, source, move) {
			if (this.randomChance(1, 5)) {
				changeSet(this, source, ssbSets['Billo-Solgaleo'], true);
				source.addVolatile('trapped', source, move, 'trapper');
				source.addVolatile('perishsong');
				this.add('-start', source, 'perish3', '[silent]');
				this.boost({atk: 1}, source, source, move);
				this.add(`c:|${getName('Billo')}|This is a streamer mon, you're banned from the room.`);
			} else {
				changeSet(this, source, ssbSets['Billo-Lunala'], true);
				source.addVolatile('focusenergy');
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
		shortDesc: "Protects user, disables foes that strike the protection.",
		name: "Veto",
		gen: 9,
		pp: 10,
		priority: 3,
		flags: {noassist: 1, failcopycat: 1},
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
			onStart(target) {
				this.add('-singleturn', target, 'move: Protect');
			},
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
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
				if (!source.volatiles['disable']) {
					source.addVolatile('disable', this.effectState.target);
				}
				return this.NOT_FAIL;
			},
			onHit(target, source, move) {
				if (move.isZOrMaxPowered && !source.volatiles['disable']) {
					source.addVolatile('disable', this.effectState.target);
				}
			},
		},
		secondary: null,
		target: "self",
		type: "Normal",
	},

	// Blitz
	geyserblast: {
		accuracy: 95,
		basePower: 100,
		category: "Special",
		shortDesc: "Combines Fire in its type effectiveness; Ignores weather.",
		name: "Geyser Blast",
		gen: 9,
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit() {
			this.attrLastMove('[anim] Steam Eruption');
		},
		onEffectiveness(typeMod, target, type, move) {
			return typeMod + this.dex.getEffectiveness('Fire', type);
		},
		secondary: null,
		target: "normal",
		type: "Water",
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

	// Cake
	rolesystem: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Protects user, changes set. Can't be used consecutively.",
		// it was easier to do it this way rather than implement failing on consecutive uses
		name: "Role System",
		gen: 9,
		pp: 40,
		priority: 6,
		flags: {protect: 1, mirror: 1, cantusetwice: 1, failcopycat: 1},
		onTry(source) {
			if (source.species.baseSpecies === 'Dunsparce') {
				return;
			}
			this.attrLastMove('[still]');
			this.add('-fail', source, 'move: Role System');
			this.hint("Only a Pokemon whose form is Dunsparce can use this move.");
			return null;
		},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Haze', target);
		},
		onHit(target, source, move) {
			if (this.randomChance(1, 256)) {
				this.add('-activate', target, 'move: Celebrate');
			} else {
				target.clearBoosts();
				this.add('-clearboost', target);
				target.addVolatile('protect');
				const set = Math.floor(Math.random() * 4);
				const newMoves = [];
				let role = '';
				switch (set) {
				case 0:
					newMoves.push('hyperdrill', 'combattorque', 'extremespeed');
					role = 'Fast Attacker';
					this.boost({atk: 2, spe: 4});
					break;
				case 1:
					newMoves.push('coil', 'bodyslam', 'healorder');
					role = 'Bulky Setup';
					this.boost({atk: 1, def: 1, spd: 2});
					break;
				case 2:
					const varMoves = ['Ceaseless Edge', 'Stone Axe', 'Mortal Spin', 'G-Max Steelsurge'];
					const move1 = this.sample(varMoves);
					const move2 = this.sample(varMoves.filter(i => i !== move1));
					newMoves.push('healorder', move1, move2);
					role = 'Bulky Support';
					this.boost({def: 2, spd: 2});
					break;
				case 3:
					newMoves.push('bloodmoon', 'bloodmoon', 'bloodmoon');
					role = 'Wallbreaker';
					this.boost({spa: 6});
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
						target: replacement.target,
						disabled: false,
						used: false,
					};
					source.moveSlots[i] = replacementMove;
					source.baseMoveSlots[i] = replacementMove;
				}
			}
		},
		secondary: null,
		target: "self",
		type: "Normal",
		// bird type crashes during testing (runStatusImmunity for Bird at sim\pokemon.ts:2101:10). no-go.
	},

	// chaos
	outage: {
		accuracy: 95,
		basePower: 110,
		category: "Special",
		shortDesc: "Clear Smog + Taunt + Embargo.",
		name: "Outage",
		gen: 9,
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Dark Pulse', target);
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
				onHit(target) {
					target.clearBoosts();
					this.add('-clearboost', target);
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
		shortDesc: "Sets Grassy Terrain before attack. -50% HP if it misses.",
		name: "De Todas las Flores",
		gen: 9,
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, gravity: 1},
		hasCrashDamage: true,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.field.setTerrain('grassyterrain');
			this.add('-anim', source, 'High Jump Kick', target);
		},
		onMoveFail(target, source, move) {
			this.damage(source.baseMaxhp / 2, source, source, this.dex.conditions.get('High Jump Kick'));
		},
		secondary: null,
		target: "normal",
		type: "Grass",
	},

	// ciran
	summonmonsterviiifiendishmonstrouspiplupedecolossal: {
		accuracy: 90,
		basePower: 60,
		basePowerCallback(pokemon, target, move) {
			if (move.hit === 1) return 60;
			if (move.hit === 2) return 0;
			return 20;
		},
		category: "Physical",
		shortDesc: "60 BP Bite -> Toxic -> 2-5 multihit w/ 20 BP each.",
		name: "Summon Monster VIII: Fiendish monstrous Piplupede, Colossal",
		gen: 9,
		pp: 15,
		priority: 0,
		flags: {protect: 1, contact: 1, mirror: 1},
		multihit: [3, 7],
		self: {
			volatileStatus: 'summonmonsterviiifiendishmonstrouspiplupedecolossal',
		},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Crunch', target);
			this.add('-anim', source, 'Fury Swipes', target);
		},
		condition: {
			duration: 1,
			noCopy: true,
			onAccuracy(accuracy, target, source, move) {
				if (move.hit <= 2) return 100;
				return 90;
			},
		},
		secondaries: [
			{
				chance: 20,
				onHit(target, source, move) {
					if (move.hit !== 1) return;
					target.addVolatile('flinch', source, move);
				},
			},
			{
				chance: 100,
				onHit(target, source, move) {
					if (move.hit !== 2) return;
					target.trySetStatus('tox', source, move);
				},
			},
		],
		onAfterMove(source, target, move) {
			this.add(`c:|${getName((source.illusion || source).name)}|There's no way this'll faint in one punch!`);
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
		name: "Giveaway!",
		gen: 9,
		pp: 10,
		priority: 0,
		flags: {metronome: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Teleport', target);
			this.add('-anim', source, 'Baton Pass', target);
		},
		// Baton Pass clones are stupid client side so we're doing this
		onHit(target) {
			this.actions.useMove('batonpass', target);
		},
		secondary: null,
		target: "self",
		type: "Normal",
	},

	// Clementine
	o: {
		accuracy: 100,
		basePower: 100,
		category: "Special",
		shortDesc: "Phys if Atk > SpA. Flips user.",
		name: "(╯°o°）╯︵ ┻━┻",
		pp: 10,
		priority: 0,
		flags: {protect: 1, failcopycat: 1},
		noSketch: true,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Malicious Moonsault', target);
			this.add('-anim', source, 'Blizzard', target);
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
		onEffectiveness(typeMod, target, type) {
			if (target?.name === 'Kennedy') return 1;
		},
		onHit(target, source, move) {
			if (source.illusion || source.baseSpecies.name !== 'Avalugg') return;
			if (source.volatiles['flipped']) {
				source.removeVolatile('flipped');
				changeSet(this, source, ssbSets['Clementine']);
			} else {
				source.addVolatile('flipped', source, move);
				changeSet(this, source, ssbSets['Clementine-Flipped']);
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
		name: "Stockholm Syndrome",
		pp: 5,
		priority: 0,
		flags: {bypasssub: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Curse', target);
			this.add('-anim', source, 'Block', target);
		},
		onHit(target, source, move) {
			let success = false;
			if (!target.volatiles['curse']) {
				this.directDamage(source.maxhp / 2, source, source);
				target.addVolatile('curse');
				success = true;
			}
			return target.addVolatile('trapped', source, move, 'trapper') || success;
		},
		zMove: {effect: 'heal'},
		secondary: null,
		target: "normal",
		type: "Ghost",
	},

	// Clouds
	windsofchange: {
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		shortDesc: "Tailwind + U-turn.",
		name: "Winds of Change",
		pp: 15,
		priority: 0,
		flags: {protect: 1},
		self: {
			sideCondition: 'tailwind',
		},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Tailwind', target);
			this.add('-anim', source, 'U-turn', target);
		},
		selfSwitch: true,
		secondary: null,
		target: "normal",
		type: "Flying",
	},

	// Coolcodename
	haxerswill: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		shortDesc: "70% boost Spa/Spe by 1 & Focus Energy, else lose boosts.",
		name: "Haxer's Will",
		gen: 9,
		pp: 15,
		priority: 0,
		flags: {},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Clangorous Soul', source);
			this.add('-anim', source, 'Focus Energy', source);
		},
		onHit(pokemon) {
			if (this.randomChance(7, 10)) {
				this.boost({spa: 1, spe: 1});
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
		name: "Monkey Beat Up",
		gen: 9,
		pp: 10,
		priority: 0,
		multihit: [4, 5],
		flags: {protect: 1, contact: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Beat Up', target);
			this.add('-anim', source, 'Wood Hammer', target);
		},
		onModifyPriority(priority, source, target, move) {
			if (this.field.isTerrain('grassyterrain') && source.isGrounded()) {
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
		shortDesc: "Fire/Electric/Ice depending on turn. Sets Reflect. Cannot be used by Necrozma-Ultra.",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMove(target, source, move) {
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
		shortDesc: "User heals 25% HP; Target +2 Atk/SpA + Taunt.",
		name: "Super Ego Inflation",
		gen: 9,
		pp: 5,
		priority: -7,
		flags: {protect: 1, mirror: 1, bypasssub: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Follow Me', source);
			this.add('-anim', target, 'Swords Dance', target);
			this.add('-anim', target, 'Nasty Plot', target);
		},
		onHit(target, source) {
			this.heal(source.maxhp / 4, source);
			this.boost({atk: 2, spa: 2});
			target.addVolatile('taunt');
		},
		target: "normal",
		type: "Normal",
	},

	// deftinwolf
	trivialpursuit: {
		accuracy: 100,
		basePower: 70,
		basePowerCallback(pokemon, target, move) {
			// You can't get here unless the pursuit succeeds
			if (target.beingCalledBack || target.switchFlag) {
				this.debug('Trivial Pursuit damage boost');
				return move.basePower * 2;
			}
			return move.basePower;
		},
		category: "Physical",
		shortDesc: "If foe is switching out, 2x power. Doesn't KO.",
		name: "Trivial Pursuit",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit() {
			this.attrLastMove('[anim] Pursuit');
		},
		beforeTurnCallback(pokemon) {
			for (const side of this.sides) {
				if (side.hasAlly(pokemon)) continue;
				side.addSideCondition('trivialpursuit', pokemon);
				const data = side.getSideConditionData('trivialpursuit');
				if (!data.sources) {
					data.sources = [];
				}
				data.sources.push(pokemon);
			}
		},
		onModifyMove(move, source, target) {
			if (target?.beingCalledBack || target?.switchFlag) move.accuracy = true;
		},
		onTryHit(target, pokemon) {
			target.side.removeSideCondition('trivialpursuit');
		},
		condition: {
			duration: 1,
			onBeforeSwitchOut(pokemon) {
				this.debug('Trivial Pursuit start');
				let alreadyAdded = false;
				pokemon.removeVolatile('destinybond');
				for (const source of this.effectState.sources) {
					if (!source.isAdjacent(pokemon) || !this.queue.cancelMove(source) || !source.hp) continue;
					if (!alreadyAdded) {
						this.add('-activate', pokemon, 'move: Pursuit');
						alreadyAdded = true;
					}
					// Run through each action in queue to check if the Pursuit user is supposed to Mega Evolve this turn.
					// If it is, then Mega Evolve before moving.
					if (source.canMegaEvo || source.canUltraBurst) {
						for (const [actionIndex, action] of this.queue.entries()) {
							if (action.pokemon === source && action.choice === 'megaEvo') {
								this.actions.runMegaEvo(source);
								this.queue.list.splice(actionIndex, 1);
								break;
							}
						}
					}
					this.actions.runMove('trivialpursuit', source, source.getLocOf(pokemon));
				}
			},
		},
		onDamagePriority: -20,
		onDamage(damage, target, source, effect) {
			if (damage >= target.hp) return target.hp - 1;
		},
		secondary: null,
		target: "normal",
		type: "Dark",
	},

	// dhelmise
	bioticorb: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: ">1/2 HP: Damage orb on foe side. Else heal orb on user side.",
		name: "Biotic Orb",
		gen: 9,
		pp: 10,
		priority: 0,
		flags: {reflectable: 1, mustpressure: 1},
		sideCondition: 'bioticorb',
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			if (source.hp < source.maxhp / 2) {
				this.add('-anim', source, 'Wish', source);
			} else {
				this.add('-anim', source, 'Shadow Ball', target);
			}
		},
		onModifyMove(move, pokemon, target) {
			if (pokemon.hp < pokemon.maxhp / 2) {
				move.target = "allySide";
				move.flags['heal'] = 1;
				delete move.flags['reflectable'];
				delete move.flags['mustpressure'];
			}
		},
		onModifyType(move, pokemon, target) {
			if (pokemon.hp < pokemon.maxhp / 2) {
				move.type = "Psychic";
			}
		},
		condition: {
			duration: 4,
			onSideStart(side, source) {
				this.effectState.source = source;
				this.effectState.sourceSide = side === source.side;
				this.add('-sidestart', side, 'move: Biotic Orb');
			},
			onResidualOrder: 5,
			onResidualSubOrder: 1,
			onResidual(target) {
				const source = this.effectState.source;
				let quotes: string[] = [];
				if (this.effectState.sourceSide === source.side) {
					quotes = [
						`A cure for all that ails.`,
						`A sip for the parched.`,
						`Be nourished!`,
						`I offer something more.`,
						`Receive my aid.`,
						`Be nurtured.`,
						`Know mother's kindness.`,
						`A salve for all that ails.`,
						`An eldritch blessing.`,
						`Flourish.`,
						`Now feast.`,
						`Recover your strength.`,
					];
					if (target.hp) {
						let amount = 65;
						if (this.effectState.duration === 4) amount = 40;
						this.heal(amount, target, source, this.dex.getActiveMove('bioticorb'));
					}
				} else {
					quotes = [
						`A taste of poison.`,
						`Misery made manifest`,
						`Pain is inevitable.`,
						`You cannot escape me!`,
						`Your end is within my reach.`,
						`Bí ag stangadh leat.`,
						`Ruination is imminent.`,
						`The weak can fend for themselves.`,
						`Know darkness.`,
						`Let shadow consume you.`,
						`Your pain will be endless.`,
					];
					if (target.hp) {
						this.damage(50, target, source, this.dex.getActiveMove('bioticorb'));
					}
					if (!target.hp || target.hp <= 0) {
						quotes = [
							`Expect the unexpected.`,
							`In chaos lies opportunity.`,
							`Mind your surroundings.`,
							`Perhaps next time you should not stand in the way of the orb.`,
							`A torturous gift.`,
							`The darkness will find them.`,
							`The gloom takes you.`,
						];
						source.m.bioticOrbKO = true;
					}
				}
				if (quotes.length) {
					this.add(`c:|${getName((source.illusion || source).name)}|${this.sample(quotes)}`);
				}
			},
			onSideResidualOrder: 26,
			onSideResidualSubOrder: 5,
			onSideEnd(side) {
				this.add('-sideend', side, 'move: Biotic Orb');
			},
		},
		secondary: null,
		target: "foeSide",
		type: "Poison",
	},

	// Elliot
	teaparty: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Heals 50% HP and cures status. 7/8 chance of Boiled forme, 1/8 for Beefed forme.",
		name: "Tea Party",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1, heal: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Milk Drink', source);
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
				target: replacement.target,
				disabled: false,
				used: false,
			};
			pokemon.moveSlots[teaIndex] = newMoveSlot;
		},
		secondary: null,
		target: 'self',
		type: "Flying",
	},

	// Elly
	sustainedwinds: {
		accuracy: 90,
		basePower: 20,
		category: "Special",
		shortDesc: "Hits 5x. Heals 20% of damage dealt on each hit.",
		name: "Sustained Winds",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, heal: 1, wind: 1},
		onPrepareHit() {
			this.attrLastMove('[anim] Bleakwind Storm');
		},
		drain: [1, 5],
		multihit: 5,
		secondary: null,
		target: 'normal',
		type: "Flying",
	},

	// Emboar02
	insertboarpunhere: {
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		shortDesc: "Has 33% recoil. Switch after using.",
		name: "Insert boar pun here",
		pp: 20,
		priority: 0,
		flags: {protect: 1, contact: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Collision Course', target);
			this.add('-anim', source, 'U-turn', target);
		},
		selfSwitch: true,
		recoil: [33, 100],
		secondary: null,
		target: 'normal',
		type: "Fighting",
	},

	// eva
	asoulforasoul: {
		accuracy: 100,
		basePower: 0,
		category: "Physical",
		shortDesc: "KOes foe + user if ally was KOed prev. turn.",
		name: "A Soul for a Soul",
		pp: 5,
		priority: 1,
		flags: {protect: 1, contact: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Explosion', target);
			this.add('-anim', source, 'Final Gambit', target);
		},
		onTry(source, target) {
			if (!source.side.faintedLastTurn) return false;
			source.faint(source);
			target?.faint(source);
		},
		ignoreImmunity: true,
		secondary: null,
		target: "normal",
		type: "Ghost",
	},

	// Fame
	solidarity: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		shortDesc: "Creates a substitute and inflicts Leech Seed on the foe.",
		name: "Solidarity",
		pp: 15,
		priority: 0,
		flags: {},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Substitute');
			this.add('-anim', source, 'Leech Seed', target);
		},
		onHit(target, source) {
			if (target.hasType('Grass')) return null;
			target.addVolatile('leechseed', source);
		},
		self: {
			onHit(target, source) {
				if (source.volatiles['substitute']) return;
				if (source.hp <= source.maxhp / 4 || source.maxhp === 1) { // Shedinja clause
					this.add('-fail', source, 'move: Substitute', '[weak]');
				} else {
					source.addVolatile('substitute');
					this.directDamage(source.maxhp / 4);
				}
			},
		},
		secondary: null,
		target: 'normal',
		type: "Grass",
	},

	// Felucia
	riggeddice: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		shortDesc: "Stat changes: inverts, else Taunt. User switches.",
		name: "Rigged Dice",
		pp: 10,
		priority: 0,
		flags: {},
		selfSwitch: true,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Smart Strike', source);
		},
		onHit(target, source) {
			let success = false;
			let i: BoostID;
			for (i in target.boosts) {
				if (target.boosts[i] === 0) continue;
				target.boosts[i] = -target.boosts[i];
				success = true;
			}
			if (success) {
				this.add('-invertboost', target, '[from] move: Rigged Dice');
			} else {
				target.addVolatile('taunt', source);
			}
		},
		secondary: null,
		target: 'normal',
		type: "Bug",
	},

	// Froggeh
	cringedadjoke: {
		accuracy: 90,
		basePower: 90,
		category: "Physical",
		shortDesc: "Confuses the foe. Confusion self-hits raise user's Atk/Def.",
		name: "Cringe Dad Joke",
		pp: 10,
		priority: 0,
		flags: {protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Dizzy Punch', target);
			this.add('-anim', source, 'Bulk Up', source);
		},
		secondary: {
			chance: 100,
			volatileStatus: 'confusion',
		},
		target: 'normal',
		type: "Fighting",
		// confusion self-hit stat bonus implemented as an innate because it doesn't work as a move effect
	},

	// Frostyicelad
	puffyspikydestruction: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "+1 Attack, +1 Speed. Protects, sets Toxic Spikes. First turn only. Loses poison type.",
		name: "Puffy Spiky Destruction",
		pp: 5,
		priority: 0,
		flags: {},
		sideCondition: 'toxicspikes',
		onTry(source) {
			if (source.activeMoveActions > 1) {
				this.hint("Puffy Spiky Destruction only works on your first turn out.");
				return false;
			}
		},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Quiver Dance', source);
			this.add('-anim', source, 'Spiky Shield', source);
			this.add('-anim', source, 'Toxic Spikes', target);
		},
		self: {
			volatileStatus: 'spikyshield',
			onHit(target, source, move) {
				source.setType(source.getTypes(true).filter(type => type !== "Poison"));
				this.add('-start', source, 'typechange', source.getTypes().join('/'), '[from] move: Puffy Spiky Destruction');
			},
			boosts: {
				spe: 1,
				atk: 1,
			},
		},
		secondary: null,
		target: 'normal',
		type: "Poison",
	},

	// Frozoid
	flatoutfalling: {
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		shortDesc: "Typeless. Sets Gravity.",
		name: "Flat out falling",
		pp: 5,
		priority: 0,
		flags: {protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Head Smash', target);
			this.add('-anim', source, 'Gravity', target);
		},
		self: {
			onHit(source) {
				this.field.addPseudoWeather('gravity', source);
			},
		},
		secondary: null,
		target: 'normal',
		type: "???",
	},

	// Ganjafin
	wigglingstrike: {
		accuracy: 95,
		basePower: 10,
		category: "Physical",
		shortDesc: "Salt cures the target and sets a layer of spikes.",
		name: "Wiggling Strike",
		gen: 9,
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Water Pulse', target);
			this.add('-anim', target, 'Aqua Ring', target);
		},
		self: {
			onHit(source) {
				for (const side of source.side.foeSidesWithConditions()) {
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

	// Goro Yagami
	shadowambush: {
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		shortDesc: "-1 Def/SpD, gives Slow Start, user switches.",
		name: "Shadow Ambush",
		gen: 9,
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Spectral Thief', target);
		},
		secondary: {
			chance: 100,
			volatileStatus: 'slowstart',
			boosts: {
				def: -1,
				spd: -1,
			},
		},
		selfSwitch: true,
		target: "normal",
		type: "Ghost",
	},

	// Haste Inky
	hastyrevolution: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		shortDesc: "Clear target stats+copies neg stats+inverts on user.",
		name: "Hasty Revolution",
		pp: 10,
		priority: 4,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Pain Split', target);
		},
		onHit(target, source, move) {
			target.clearBoosts();
			this.add('-clearboost', target);
			let i: BoostID;
			for (i in source.boosts) {
				if (source.boosts[i] < 0) {
					target.boosts[i] += source.boosts[i];
					source.boosts[i] = -source.boosts[i];
				}
			}
			this.add('-copyboost', target, source, '[from] move: Hasty Revolution');
			this.add('-invertboost', source, '[from] move: Hasty Revolution');
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
		shortDesc: "Disables the target's last move and pivots out.",
		name: "Augur of Ebrietas",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit() {
			this.attrLastMove('[anim] Spirit Shackle');
		},
		onAfterHit(source, target, move) {
			this.add(`c:|${getName((source.illusion || source).name)}|as you once did for the vacuous Rom,`);
		},
		selfSwitch: true,
		volatileStatus: 'disable',
		target: "normal",
		type: "Ghost",
	},

	// Hecate
	testinginproduction: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "A description has not been added yet",
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
		secondary: null,
		target: "self",
		type: "Electric",
	},

	// HiZo
	scapegoat: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "A party member is selected and faints, raising the user's Attack, Special Attack, and Speed by 1 if the party member's hp is below 33%, by 2 if the party member's hp is between 33% and 66%, and by 3 if the party member's hp is above 66%. Fails if there are no useable Pokemon on that side besides the user.",
		shortDesc: "Faints a teammate, raises Atk, SpA, Spe depending on teammate HP.",
		name: "Scapegoat",
		gen: 9,
		pp: 5,
		priority: 0,
		flags: {},
		onTryHit(source) {
			if (!this.canSwitch(source.side)) {
				this.attrLastMove('[still]');
				this.add('-fail', source);
				return this.NOT_FAIL;
			}
		},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Swords Dance', source);
		},
		onHit(target, source) {
			this.add('message', `A sacrifice is needed.`);
		},
		slotCondition: 'scapegoat',
		// fake switch a la revival blessing
		selfSwitch: true,
		condition: {
			duration: 1,
			// reviving implemented in side.ts, kind of
		},
		secondary: null,
		target: "self",
		type: "Dark",
	},

	// HoeenHero
	reprogram: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		shortDesc: "Rain or Lock-On or typeless Toxic.",
		name: "Re-Program",
		pp: 10,
		priority: 0,
		flags: {protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Calm Mind', source);
			this.add('-anim', source, 'Geomancy', target);
		},
		onModifyMove(move, pokemon, target) {
			const BLOCKING_WEATHERS = ['stormsurge', 'raindance', 'desolateland', 'primordialsea', 'deltastream'];
			if (!BLOCKING_WEATHERS.includes(this.field.getWeather().id) && this.randomChance(1, 3)) {
				move.target = 'self';
			}
		},
		onHit(target, source, move) {
			this.add('-message', 'HoeenHero reprograms the battle to be more beneficial to them!');
			if (move.target === 'self') {
				// Set weather to rain
				this.add('-message', 'HoeenHero made the environment easier to work with!');
				this.field.setWeather('raindance', source, move);
			} else {
				if (target.getVolatile('virus') || this.randomChance(1, 2)) {
					// Lock on to target
					this.add('-message', 'HoeenHero double checked their work and fixed any errors!');
					this.add('-activate', source, 'move: Lock-On', '[of] ' + target);
					source.addVolatile('lockon', target);
				} else {
					// Deploy virus
					this.add('-message', `HoeenHero launched a virus at ${target.name} to weaken them!`);
					target.trySetStatus('virus', source, move);
				}
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
		shortDesc: "No dmg rest of turn. Next turn user moves -1 prio.",
		name: "Wonder Wing",
		pp: 5,
		priority: -1,
		flags: {contact: 1},
		// No negative contact effects implemented in Battle#checkMovesMakeContact
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Electric Terrain', source);
			this.add('-anim', source, 'Giga Impact', target);
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
			onRestart(target, source, sourceEffect) {
				target.removeVolatile('wonderwing');
			},
			onDamage(damage, target, source, effect) {
				if (this.effectState.duration < 2) return;
				this.add('-activate', source, 'move: Wonder Wing');
				return false;
			},
			onModifyPriority(relayVar, source, target, move) {
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
		shortDesc: "70% +1 SpA, 50% prz, +water effectiveness. Tera-ed: Water-type, 80% +1 SpA, 60% to Soak, super-effective against Water",
		pp: 20,
		priority: 1,
		flags: {protect: 1, mirror: 1},
		onModifyMove(move, source, target) {
			if (source.terastallized) {
				move.type = 'Water';
			}
		},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			if (!source.terastallized) this.add('-anim', source, 'Charge Beam', source);
			else this.add('-anim', source, 'Water Pulse', target);
		},
		onEffectiveness(typeMod, target, type, move) {
			if (move.type === 'Electric') return typeMod + this.dex.getEffectiveness('Water', type);
			else if (type === 'Water' && move.type === 'Water') return 1;
		},
		secondary: {
			chance: 100,
			onHit(target, source, move) {
				// None of these stack with Serene Grace
				if (!source.terastallized) {
					if (this.randomChance(70, 100)) {
						this.boost({spa: 1}, source);
					}
					if (this.randomChance(50, 100)) {
						if (target.isActive) target.trySetStatus('par', source, this.effect);
					}
				} else {
					if (this.randomChance(80, 100)) {
						this.boost({spa: 1}, source);
					}
					if (this.randomChance(60, 100)) {
						// Soak
						if (target.getTypes().join() !== 'Water' && target.setType('Water')) {
							this.add('-start', target, 'typechange', 'Water');
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
		shortDesc: "Hits 3 times, 3rd hit always crits. sets Safeguard.",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		basePowerCallback(pokemon, target, move) {
			return [10, 20, 40][move.hit - 1];
		},
		onTryHit(target, source, move) {
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
		secondary: null,
		multihit: 3,
		target: "normal",
		type: "Ground",
	},

	// ironwater
	jirachibanhammer: {
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		shortDesc: "Prevents the target from switching out.",
		name: "Jirachi Ban Hammer",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit() {
			this.attrLastMove('[anim] Gigaton Hammer');
		},
		secondary: {
			chance: 100,
			onHit(target, source, move) {
				if (source.isActive) target.addVolatile('trapped', source, move, 'trapper');
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
		shortDesc: "Changes target to a Randbats set.",
		name: "Bibbidi-Bobbidi-Rands",
		gen: 9,
		pp: 1,
		priority: 0,
		flags: {protect: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[anim] Doom Desire');
		},
		onHit(target, source) {
			const formats = ['gen9randombattle', 'gen9hackmonscup', 'gen9challengecup1v1', 'gen9computergeneratedteams'];
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
			case 'gen9computergeneratedteams':
				msg = "We asked an AI to make a randbats set. YOU WON'T BELIEVE WHAT IT CAME UP WITH N.N";
				break;
			}
			let team = [] as PokemonSet[];
			const unModdedDex = Dex.mod('base');
			let depth = 0;
			while (!team.length) {
				team = Teams.generate(randFormat, {name: target.side.name});
				if (depth >= 50) break; // Congrats you won the lottery!
				team = team.filter(p =>
					Object.keys(unModdedDex.species.get(p.species).baseStats).every(k =>
						unModdedDex.species.get(p.species).baseStats[k as StatID] === this.dex.species.get(p.species).baseStats[k as StatID]));
				depth++;
			}

			this.addMove('-anim', target, 'Wish', target);
			target.clearBoosts();
			this.add('-clearboost', target);
			// @ts-ignore set wants a sig but randbats sets don't have one
			changeSet(this, target, team[0], true);
			this.add(`c:|${getName((source.illusion || source).name)}|${msg}`);
		},
		isZ: "irpatuziniumz",
		secondary: null,
		target: "normal",
		type: "Fairy",
	},

	// Isaiah
	simplegameplan: {
		accuracy: true,
		basePower: 120,
		category: "Physical",
		name: "Simple Gameplan",
		shortDesc: "No additional effect.",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[anim] High Jump Kick');
		},
		secondary: null,
		target: "allAdjacent",
		type: "Psychic",
	},

	// J0rdy004
	snowysamba: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Snowy Samba",
		shortDesc: "Sets Snow, raises user's Sp. Atk by 1 stage and Speed by 2 stages.",
		pp: 15,
		priority: 0,
		flags: {snatch: 1, metronome: 1},
		boosts: {
			spe: 2,
			spa: 1,
		},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Agility', target);
			this.add('-anim', source, 'Snowscape', target);
		},
		weather: 'snow',
		secondary: null,
		target: "self",
		type: "Ice",
	},

	// Kalalokki
	knotweak: {
		accuracy: 80,
		basePower: 150,
		category: "Physical",
		name: "Knot Weak",
		shortDesc: "Deals 50% recoil.",
		pp: 5,
		flags: {contact: 1, protect: 1, mirror: 1, metronome: 1},
		recoil: [1, 2],
		secondary: null,
		priority: 0,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Focus Punch', target);
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
		pp: 5,
		priority: 0,
		flags: {protect: 1, metronome: 1, noparentalbond: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		secondary: null,
		target: "normal",
		type: "Fighting",
	},

	// ken
	ac: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Does something random.",
		name: ", (ac)",
		pp: 15,
		priority: 0,
		flags: {reflectable: 1, mustpressure: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Fling', target);
		},
		secondary: {
			chance: 100,
			onHit(target, source, move) {
				let success = false;
				while (!success) {
					const effect = this.random(100);
					if (effect < 10) {
						if (target.trySetStatus('psn', target)) {
							success = true;
						}
					} else if (effect < 20) {
						if (target.trySetStatus('par', target)) {
							success = true;
						}
					} else if (effect < 30) {
						if (target.trySetStatus('par', target)) {
							success = true;
						}
					} else if (effect < 33) {
						if (target.trySetStatus('slp', target)) {
							success = true;
						}
					} else if (effect < 35) {
						if (target.trySetStatus('frz', target)) {
							success = true;
						}
					} else if (effect < 40) {
						if (!target.volatiles['confusion']) {
							target.addVolatile('confusion', source);
							success = true;
						}
					} else if (effect < 45) {
						if (!target.volatiles['attract']) {
							target.addVolatile('attract', source);
							success = true;
						}
					} else if (effect < 50) {
						if (!target.volatiles['taunt']) {
							target.addVolatile('taunt', source);
							success = true;
						}
					} else if (effect < 55) {
						if (target.lastMove && !target.volatiles['encore']) {
							target.addVolatile('encore', source);
							success = true;
						}
					} else if (effect < 60) {
						if (!target.volatiles['torment']) {
							target.addVolatile('torment', source);
							success = true;
						}
					} else if (effect < 65) {
						if (!target.volatiles['healblock']) {
							target.addVolatile('healblock', source);
							success = true;
						}
					} else if (effect < 70) {
						if (target.side.addSideCondition('stealthrock')) {
							success = true;
						}
					} else if (effect < 75) {
						if (target.side.addSideCondition('stickyweb')) {
							success = true;
						}
					} else if (effect < 80) {
						if (target.side.addSideCondition('spikes')) {
							success = true;
						}
					} else if (effect < 85) {
						if (target.side.addSideCondition('toxicspikes')) {
							success = true;
						}
					} else if (effect < 90) {
						const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
						for (const condition of sideConditions) {
							if (source.side.removeSideCondition(condition)) {
								success = true;
								this.add('-sideend', source.side, this.dex.conditions.get(condition).name, '[from] move: , (ac)', '[of] ' + source);
							}
						}
					} else if (effect < 95) {
						const bestStat = target.getBestStat(true, true);
						this.boost({[bestStat]: -1}, target);
						success = true;
					} else {
						if (this.canSwitch(source.side)) {
							this.actions.useMove("teleport", source);
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
		shortDesc: "Sets Stealth Rock. Lowers foe Def/Spe by 1.",
		name: "Stone Faced",
		pp: 15,
		priority: 0,
		flags: {reflectable: 1, mustpressure: 1},
		sideCondition: 'stealthrock',
		onPrepareHit(target, source) {
			this.attrLastMove('[anim] Scary Face');
			this.attrLastMove('[anim] Stone Axe');
		},
		boosts: {
			def: -1,
			spe: -1,
		},
		secondary: null,
		target: "normal",
		type: "Rock",
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
		onTryHit(target, source, move) {
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
				if (effect.id === 'anfieldatmosphere') return;
				if (status.id === 'slp' && !target.isSemiInvulnerable()) {
					this.add('-activate', target, 'move: Anfield Atmosphere');
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
					this.add('-activate', target, 'move: Anfield Atmosphere');
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

	// keys
	protectoroftheskies: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Forces both Pokemon out. Can't be blocked.",
		name: "Protector of the Skies",
		pp: 10,
		priority: -1,
		flags: {},
		onTryMove(source, target, move) {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source, move) {
			for (const pokemon of this.getAllActive()) {
				this.add('-anim', source, 'Whirlwind', pokemon);
			}
		},
		onModifyPriority(priority, source, target, move) {
			if (target && Object.values(target.boosts).some(x => x !== 0)) {
				return priority + 1;
			}
		},
		onHit(target, source, move) {
			for (const pokemon of this.getAllActive()) {
				if (pokemon.hp <= 0 || pokemon.fainted) continue;
				pokemon.forceSwitchFlag = true;
			}
		},
		secondary: null,
		target: "all",
		type: "Flying",
	},

	// kingbaruk
	platinumrecord: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Heals 50% HP and restores 1 PP for all other moves.",
		name: "Platinum Record",
		pp: 5,
		priority: 0,
		flags: {sound: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Sing', target);
			this.add('-anim', source, 'Iron Defense', target);
		},
		onHit(target, source) {
			this.heal(source.maxhp / 2);
			for (const moveSlot of source.moveSlots) {
				if (moveSlot.pp < moveSlot.maxpp) moveSlot.pp += 1;
			}
		},
		target: "self",
		type: "Normal",

	},

	// Kiwi
	madmanifest: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Curses foe without self-damage, 50% chance for brn/par/psn. Raises Speed by 1 stage.",
		name: "Mad Manifest",
		pp: 10,
		priority: 0,
		flags: {},
		volatileStatus: 'curse',
		onHit(target, source) {
			const result = this.random(3);
			if (result === 0) {
				target.trySetStatus('psn', target);
			} else if (result === 1) {
				target.trySetStatus('par', target);
			} else {
				target.trySetStatus('brn', target);
			}
			this.boost({spe: 1}, source);
		},
		onPrepareHit(target, source) {
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
		name: "The Better Water Shuriken",
		pp: 30,
		priority: 1,
		flags: {protect: 1, mirror: 1, metronome: 1},
		multihit: [2, 5],
		secondary: null,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Water Shuriken', target);
			this.add('-anim', source, 'Electro Shot', target);
		},
		target: "normal",
		type: "Water",
	},

	// Kry
	attackofopportunity: {
		accuracy: 100,
		basePower: 60,
		basePowerCallback(pokemon, target, move) {
			if (target.beingCalledBack || target.switchFlag) {
				this.debug('Attack of Opportunity damage boost');
				return move.basePower * 1.5;
			}
			return move.basePower;
		},
		category: "Physical",
		shortDesc: "Power: x2 if opponent switches out. Damages on switch-out. +2 Attack on switch KO.",
		name: "Attack of Opportunity",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Pursuit', target);
			this.add('-anim', source, 'Behemoth Blade', target);
		},
		beforeTurnCallback(pokemon) {
			for (const side of this.sides) {
				if (side.hasAlly(pokemon)) continue;
				side.addSideCondition('attackofopportunity', pokemon);
				const data = side.getSideConditionData('attackofopportunity');
				if (!data.sources) {
					data.sources = [];
				}
				data.sources.push(pokemon);
			}
		},
		onModifyMove(move, source, target) {
			if (target?.beingCalledBack || target?.switchFlag) {
				move.accuracy = true;
				move.onAfterMoveSecondarySelf = function (s, t, m) {
					if (!t || t.fainted || t.hp <= 0) {
						this.boost({atk: 1}, s, s, m);
					}
				};
			}
		},
		onTryHit(target, pokemon) {
			target.side.removeSideCondition('attackofopportunity');
		},
		condition: {
			duration: 1,
			onBeforeSwitchOut(pokemon) {
				this.debug('Attack of Opportunity start');
				let alreadyAdded = false;
				pokemon.removeVolatile('destinybond');
				for (const source of this.effectState.sources) {
					if (!source.isAdjacent(pokemon) || !this.queue.cancelMove(source) || !source.hp) continue;
					if (!alreadyAdded) {
						this.add('-activate', pokemon, 'move: Pursuit');
						alreadyAdded = true;
					}
					if (source.canMegaEvo) {
						for (const [actionIndex, action] of this.queue.entries()) {
							if (action.pokemon === source && action.choice === 'megaEvo') {
								this.actions.runMegaEvo(source);
								this.queue.list.splice(actionIndex, 1);
								break;
							}
						}
					}
					this.actions.runMove('attackofopportunity', source, source.getLocOf(pokemon));
				}
			},
		},
		secondary: null,
		target: "normal",
		type: "Steel",
		contestType: "Clever",
	},

	// Lasen
	riseabove: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Magnet Rise + Aqua Ring",
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
		onTry(source, target, move) {
			if (target.volatiles['smackdown'] || target.volatiles['ingrain']) return false;

			// Additional Gravity check for Z-move variant
			if (this.field.getPseudoWeather('Gravity')) {
				this.add('cant', source, 'move: Gravity', move);
				return null;
			}
		},
		condition: {
			duration: 5,
			onStart(target) {
				this.add('-start', target, 'Rise Above');
			},
			onImmunity(type) {
				if (type === 'Ground') return false;
			},
			onResidualOrder: 6,
			onResidual(pokemon) {
				this.heal(pokemon.baseMaxhp / 16);
			},
			onEnd(target) {
				this.add('-end', target, 'Rise Above');
			},
		},
		secondary: null,
		target: "self",
		type: "Electric",
	},

	// Lets go shuckles
	shucklepower: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Trick Room + Power Trick.",
		name: "Shuckle Power",
		pp: 5,
		priority: -6,
		flags: {},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Power Trick', source);
		},
		pseudoWeather: 'trickroom',
		volatileStatus: 'powertrick',
		secondary: null,
		target: "self",
		type: "Psychic",
	},

	// Lily
	recharge: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Recharge",
		shortDesc: "Heals 50% HP. Heals 3% more for every fainted ally.",
		pp: 5,
		priority: 0,
		flags: {heal: 1},
		onModifyMove(move, source, target) {
			const fntAllies = source.side.pokemon.filter(ally => ally !== source && ally.fainted);
			if (move.heal) move.heal[0] = 50 + (3 * fntAllies.length);
		},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(pokemon) {
			this.add('-anim', pokemon, 'Shore Up', pokemon);
			this.add('-anim', pokemon, 'Charge', pokemon);
			this.add('-anim', pokemon, 'Moonlight', pokemon);
		},
		heal: [50, 100],
		secondary: null,
		target: "self",
		type: "Electric",
	},

	// Lionyx
	superrollout: {
		accuracy: 90,
		basePower: 30,
		basePowerCallback(pokemon, target, move) {
			if (!pokemon.volatiles['superrollout'] || move.hit === 1) {
				pokemon.addVolatile('superrollout');
			}
			let bp = move.basePower * pokemon.volatiles['superrollout'].multiplier;
			if (pokemon.volatiles['defensecurl']) {
				bp *= 2;
			}
			this.debug('BP: ' + bp);
			return bp;
		},
		category: "Physical",
		shortDesc: "BP doubles after each hit. 2x if Defense Curl.",
		name: "Super Rollout",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, metronome: 1, noparentalbond: 1},
		condition: {
			duration: 2,
			onStart() {
				this.effectState.multiplier = 1;
			},
			onRestart() {
				if (this.effectState.multiplier < 4) {
					this.effectState.multiplier <<= 1;
				}
				this.effectState.duration = 2;
			},
		},
		secondary: null,
		target: "normal",
		type: "Rock",
	},

	// Loethalion
	darkmooncackle: {
		accuracy: 100,
		basePower: 30,
		basePowerCallback(pokemon, target, move) {
			const bp = move.basePower + 20 * pokemon.positiveBoosts();
			this.debug('BP: ' + bp);
			return bp;
		},
		category: "Special",
		desc: "Power is equal to 30+(X*20), where X is the user's total stat stage changes that are greater than 0. Has a 100% chance to raise the user's Special Attack by 1 stage.",
		shortDesc: "+20 bp for each user's stat boost. 100% chance +1 SpA.",
		name: "Darkmoon Cackle",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1, bypasssub: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Bulk Up', source);
			this.add('-anim', source, 'Cosmic Power', source);
			this.add('-anim', source, 'Moonblast', target);
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
		basePower: 60,
		basePowerCallback(pokemon, target, move) {
			if (target.status || target.hasAbility('comatose')) return move.basePower * 2;
			return move.basePower;
		},
		category: "Physical",
		shortDesc: "30% burn. 2x power if target is already statused.",
		name: "Mystical Bonfire",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Infernal Parade', target);
			this.add('-anim', source, 'Fury Attack', target);
		},
		secondary: {
			chance: 30,
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
		name: "Praise the Moon",
		pp: 10,
		priority: 0,
		flags: {charge: 1, protect: 1, mirror: 1},
		onTryMove(attacker, defender, move) {
			this.attrLastMove('[still]');
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name);
			this.boost({spa: 1}, attacker, attacker, move);
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
		secondary: null,
		hasSheerForce: true,
		onPrepareHit(target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Lunar Dance', target);
			this.add('-anim', source, 'Moongeist Beam', target);
		},
		target: "normal",
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
				this.add(`c:|${getName((pokemon.illusion || pokemon).name)}|Ope! Wrong button, sorry.`);
				this.boost({atk: -1, def: -1, spa: -1, spd: -1, spe: -1, accuracy: -1, evasion: -1}, pokemon);
			}
		},
		secondary: null,
		target: "self",
		type: "Normal",
	},

	// marillvibes
	goodvibesonly: {
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		shortDesc: "Raises the user's Speed by 1 stage.",
		name: "Good Vibes Only",
		gen: 9,
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, contact: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Aqua Step', target);
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

	// maroon
	metalblast: {
		accuracy: 90,
		basePower: 90,
		category: "Physical",
		shortDesc: "Sets Steelsurge Spikes on the foe's side.",
		name: "Metal Blast",
		gen: 9,
		pp: 10,
		priority: 0,
		flags: {protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Steel Beam', target);
			this.add('-anim', source, 'G-max Steelsurge', target);
		},
		onAfterHit(target, source, move) {
			if (!move.hasSheerForce && source.hp) {
				for (const side of source.side.foeSidesWithConditions()) {
					side.addSideCondition('gmaxsteelsurge');
				}
			}
		},
		onAfterSubDamage(damage, target, source, move) {
			if (!move.hasSheerForce && source.hp) {
				for (const side of source.side.foeSidesWithConditions()) {
					side.addSideCondition('gmaxsteelsurge');
				}
			}
		},
		secondary: {}, // Sheer Force-boosted
		target: "normal",
		type: "Steel",
	},

	// Mathy
	breakingchange: {
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		shortDesc: "Ignores target's Ability; disables it on hit.",
		name: "Breaking Change",
		gen: 9,
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit() {
			this.attrLastMove('[anim] Salt Cure');
		},
		onHit(target, source) {
			if (target.getAbility().flags['cantsuppress']) return;
			if (!target.addVolatile('gastroacid')) return;
			this.add(`c:|${getName((source.illusion || source).name)}|Sorry i tried to fix smth but accidentally broke your ability :( will fix it next week`);
		},
		ignoreAbility: true,
		secondary: null,
		target: "normal",
		type: "Normal",
	},

	// Meteordash
	plagiarism: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Plagiarism",
		shortDesc: "Steals and uses the foe's sig move, imprisons.",
		pp: 1,
		noPPBoosts: true,
		priority: 1,
		flags: {failencore: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1, failmimic: 1},
		onPrepareHit() {
			this.attrLastMove('[anim] Mimic');
			this.attrLastMove('[anim] Imprison');
		},
		onHit(target, source) {
			const sigMoveName = ssbSets[target.name].signatureMove;
			const move = this.dex.getActiveMove(sigMoveName);
			if (move.flags['failcopycat'] || move.noSketch) {
				return false;
			}
			const plagiarismIndex = source.moves.indexOf('plagiarism');
			if (plagiarismIndex < 0) return false;
			this.add(`c:|${getName((source.illusion || source).name)}|yoink`);
			const plagiarisedMove = {
				move: move.name,
				id: move.id,
				pp: move.pp,
				maxpp: move.pp,
				target: move.target,
				disabled: false,
				used: false,
			};
			source.moveSlots[plagiarismIndex] = plagiarisedMove;
			source.baseMoveSlots[plagiarismIndex] = plagiarisedMove;
			this.add('-activate', source, 'move: Plagiarism', move.name);
			this.add('-message', `${source.name} plagiarised ${target.name}'s ${move.name}!`);
			this.actions.useMove(move.id, source, target);
			delete target.volatiles['imprison'];
			source.addVolatile('imprison', source);
		},
		noSketch: true,
		secondary: null,
		target: "normal",
		type: "Dark",
	},

	// Mex
	timeskip: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Time Skip",
		shortDesc: "Clears hazards. +10 turns.",
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
						this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] move: Time Skip', '[of] ' + pokemon);
					}
				}
				// 9 turn addition so the +1 from nextTurn totals to 10 turns
				this.turn += 9;
			},
		},
		secondary: null,
		target: "all",
		type: "Dragon",
	},

	// Monkey
	bananabreakfast: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "2 random stats +1; Lock-On/Laser Focus/Charge.",
		name: "Banana Breakfast",
		gen: 9,
		pp: 10,
		priority: 2,
		flags: {mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Fire Fang', target);
			this.add('-anim', source, 'Belly Drum', target);
		},
		onHit(target, source) {
			const stats: BoostID[] = [];
			const boost: SparseBoostsTable = {};
			let statPlus: BoostID;
			for (statPlus in source.boosts) {
				if (statPlus === 'accuracy' || statPlus === 'evasion') continue;
				if (source.boosts[statPlus] < 6) {
					stats.push(statPlus);
				}
			}
			const randomStat: BoostID | undefined = stats.length ? this.sample(stats) : undefined;
			const randomStat2: BoostID | undefined = stats.length ? this.sample(stats) : undefined;
			if (randomStat) boost[randomStat] = 1;
			if (randomStat2 && randomStat === randomStat2) boost[randomStat] = 2;
			else if (randomStat2) boost[randomStat2] = 1;
			this.boost(boost, source);
			const result = this.random(3);
			if (result === 0) {
				this.actions.useMove("laserfocus", target);
			} else if (result === 1) {
				this.actions.useMove("lockon", target);
			} else {
				this.actions.useMove("charge", target);
			} // This is easier than implementing each condition manually
		},
		secondary: null,
		target: "self",
		type: "grass",
	},

	// MyPearl
	eonassault: {
		accuracy: 100,
		basePower: 35,
		category: "Special",
		shortDesc: "Hits twice. 20% chance to lower foe's Sp. Atk or Sp. Def.",
		name: "Eon Assault",
		gen: 9,
		pp: 15,
		priority: 0,
		flags: {protect: 1},
		multihit: 2,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Mist Ball', target);
			this.add('-anim', source, 'Luster Purge', target);
		},
		secondaries: [
			{
				chance: 20,
				boosts: {
					spa: -1,
				},
			}, {
				chance: 20,
				boosts: {
					spd: -1,
				},
			},
		],
		target: "normal",
		type: "Psychic",
	},

	// Ney
	shadowdance: {
		accuracy: 90,
		basePower: 110,
		category: "Physical",
		shortDesc: "100% chance to raise the user's Attack by 1.",
		name: "Shadow Dance",
		gen: 9,
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, dance: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Poltergeist', target);
			this.add('-anim', source, 'Dragon Dance', source);
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
		shortDesc: "Haze and then +1 Attack.",
		name: "~nyaa",
		gen: 9,
		pp: 10,
		priority: 0,
		flags: {bypasssub: 1},
		onPrepareHit(target, source) {
			this.attrLastMove('[anim] Haze');
			this.attrLastMove('[anim] Sweet Kiss');
			this.attrLastMove('[anim] Baton Pass');
		},
		onHitField(target, source, move) {
			this.add('-clearallboost');
			for (const pokemon of this.getAllActive()) {
				pokemon.clearBoosts();
			}
			this.boost({atk: 1, def: 1}, source, source, move);
		},
		slotCondition: 'nyaa',
		condition: {
			onSwap(target) {
				const source = this.effectState.source;
				if (!target.fainted) {
					this.add(`c:|${getName((source.illusion || source).name)}|~nyaa ${target.name}`);
					this.add(`c:|${getName('Jeopard-E')}|**It is now ${target.name}'s turn to ask a question.**`);
					target.side.removeSlotCondition(target, 'nyaa');
				}
			},
		},
		secondary: null,
		target: "all",
		type: "Steel",
	},

	// nya
	'3': {
		accuracy: 100,
		basePower: 40,
		category: "Special",
		shortDesc: "Moves first. 50% chance to backfire. 40% infatuates.",
		name: ":3",
		gen: 9,
		pp: 5,
		priority: 1,
		flags: {protect: 1},
		onTry(pokemon, target, move) {
			if (move.sourceEffect !== '3' && this.randomChance(1, 2)) {
				this.add('-message', "The move backfired!");
				this.actions.useMove('3', target, pokemon);
				return null;
			}
		},
		onPrepareHit() {
			this.attrLastMove('[anim] Attract');
		},
		secondary: {
			volatileStatus: 'attract',
			chance: 40,
		},
		target: "normal",
		type: "Fairy",
	},

	// Nyx
	cottoncandycrush: {
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		shortDesc: "Uses Sp. Def over Attack in damage calculation.",
		name: "Cotton Candy Crush",
		overrideOffensiveStat: "spd",
		gen: 9,
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Fusion Bolt', target);
			this.add('-anim', source, 'Fleur Cannon', target);
		},
		target: "normal",
		type: "Fairy",
	},

	// PartMan
	alting: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Alting",
		shortDesc: "Switch out+protect if moving first, Shiny: 69BP typeless move instead",
		pp: 5,
		priority: 0,
		flags: {snatch: 1},
		stallingMove: true,
		sideCondition: 'alting',
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Memento', target);

			this.add(`l|${getName((source.illusion || source).name).split('|')[1]}`);
			this.add(`j|FakePart`);
		},
		onModifyMove(move, source, target) {
			move.type = "???";
			if (source.set?.shiny) {
				move.accuracy = 100;
				move.basePower = 69;
				move.category = "Special";
				move.flags = {protect: 1, bypasssub: 1};
				move.target = "normal";

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
			onSideStart(target, source) {
				this.add('-singleturn', source, 'Alting');
			},
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				if (!move.flags['protect']) {
					if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id)) return;
					if (move.isZ || move.isMax) target.getMoveHitData(move).zBrokeProtect = true;
					return;
				}
				if (move && (move.target === 'self' || move.category === 'Status')) return;
				this.add('-activate', target, 'move: Alting', move.name);
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
		selfSwitch: true,
		target: "allySide",
		type: "Ghost", // Updated to ??? in onModifyMove
	},

	// Peary
	"1000gears": {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "1000 Gears",
		shortDesc: "Heals 100% HP,cures status,+1 def/spd,+5 levels",
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
		onHit(target, pokemon, move) {
			this.heal(pokemon.maxhp, pokemon, pokemon, move);
			pokemon.cureStatus();
			this.boost({def: 1, spd: 1});
			(pokemon as any).level += 5;
			pokemon.details = pokemon.species.name + (pokemon.level === 100 ? '' : ', L' + pokemon.level) +
				(pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
			this.add('-anim', pokemon, 'Geomancy', pokemon);
			this.add('replace', pokemon, pokemon.details);
			this.add('-message', `${pokemon.name} gained 5 levels!`);
		},
		isZ: "pearyumz",
		secondary: null,
		target: "self",
		type: "Steel",
	},

	// PenQuin
	splashnluckyblaze: {
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		name: "Splash n' Lucky Blaze",
		shortDesc: "Raises the user's Attack by 1 stage and burns the foe.",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Jet Punch', target);
			this.add('-anim', source, 'Flare Blitz', target);
		},
		secondary: {
			chance: 100,
			status: 'brn',
			self: {
				boosts: {
					atk: 1,
				},
			},
		},
		target: "normal",
		type: "Water",
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

	// Pissog
	asongoficeandfire: {
		accuracy: 100,
		basePower: 100,
		category: "Special",
		name: "A Song of Ice and Fire",
		shortDesc: "Type depends on form. Switches form.",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, failcopycat: 1},
		noSketch: true,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source, move) {
			if (source.species.name === 'Volcarona') {
				this.add('-anim', source, 'Blizzard', target);
			} else {
				this.add('-anim', source, 'Fiery Dance', target);
			}
		},
		onModifyType(move, pokemon) {
			if (pokemon.species.name === 'Volcarona') {
				move.type = "Ice";
			} else {
				move.type = "Fire";
			}
		},
		onHit(target, source, move) {
			if (source.species.name === 'Volcarona') {
				changeSet(this, source, ssbSets['Pissog-Frosmoth'], true);
			} else if (source.species.name === 'Frosmoth') {
				changeSet(this, source, ssbSets['Pissog'], true);
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
		desc: "A random move is selected for use, and then the user's other three moves are replaced with random moves. Aura Wheel, Dark Void, Explosion, Final Gambit, Healing Wish, Hyperspace Fury, Lunar Dance, Memento, Misty Explosion, Revival Blessing, and Self-Destruct cannot be selected.",
		shortDesc: "Replace target's 3 moves with random moves.",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Nasty Plot', source);
			this.add('-anim', source, 'Metronome', target);
			this.add('-anim', source, 'Explosion', target);
		},
		onHit(target, source) {
			const bannedList = [
				'aurawheel', 'darkvoid', 'explosion', 'finalgambit', 'healingwish', 'hyperspacefury',
				'lunardance', 'memento', 'mistyexplosion', 'revivalblessing', 'selfdestruct',
			];
			const moves = this.dex.moves.all().filter(move => (
				!source.moves.includes(move.id) &&
				(!move.isNonstandard || move.isNonstandard === 'Unobtainable')
			));
			for (const i of target.moveSlots.keys()) {
				if (i > 2) break;
				const randomMove = this.sample(moves.filter(x => !bannedList.includes(x.id)));
				bannedList.push(randomMove.id);
				const replacement = {
					move: randomMove.name,
					id: randomMove.id,
					pp: randomMove.pp,
					maxpp: randomMove.pp,
					target: randomMove.target,
					disabled: false,
					used: false,
				};
				target.moveSlots[i] = target.baseMoveSlots[i] = replacement;
			}
		},
		target: "self",
		type: "Normal",
	},

	// ptoad
	pleek: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Pleek...",
		shortDesc: "+4 Attack + inflict Perish Song on self.",
		pp: 10,
		priority: 0,
		flags: {sound: 1, bypasssub: 1},
		onTry(source) {
			if (source.m.usedPleek) {
				this.hint("Pleek... only works once per switch-in.");
				return false;
			}
		},
		onPrepareHit() {
			this.attrLastMove('[anim] Hyper Voice');
			this.attrLastMove('[anim] Splash');
		},
		onHit(target, source, move) {
			this.add(`c:|${getName((source.illusion || source).name)}|Pleek...`);
			this.boost({atk: 4}, source, source, move);
			source.addVolatile('perishsong');
			this.add('-start', source, 'perish3', '[silent]');
			source.m.usedPleek = true;
		},
		target: "self",
		type: "Fairy",
	},

	// PYRO
	meatgrinder: {
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		name: "Meat Grinder",
		shortDesc: "Deals 1/8 max HP each turn; 1/4 on Fairy, Normal. Heals user 1/8 each turn.",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit() {
			this.attrLastMove('[anim] Guillotine');
		},
		condition: {
			noCopy: true,
			onStart(pokemon) {
				this.add('-start', pokemon, 'Meat Grinder');
			},
			onResidualOrder: 13,
			onResidual(pokemon, source) {
				this.damage(pokemon.baseMaxhp / (pokemon.hasType(['Normal', 'Fairy']) ? 4 : 8));

				const target = this.getAtSlot(pokemon.volatiles['meatgrinder'].sourceSlot);
				if (!pokemon || pokemon.fainted || pokemon.hp <= 0) {
					this.add(`c:|${getName((target.illusion || target).name)}|Tripping off the beat kinda, dripping off the meat grinder`);
				}
				if (!target || target.fainted || target.hp <= 0) {
					this.debug('Nothing to heal');
					return;
				}
				this.heal(target.baseMaxhp / 8, target, pokemon);
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
		shortDesc: "+1 SpA. Type varies based on user's primary type.",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1, bypasssub: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Tidy Up', source);
			this.add('-anim', source, 'Bug Buzz', target);
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
		shortDesc: "Foe becomes a random monotype, user gains +1 SpA.",
		pp: 10,
		priority: 0,
		flags: {},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Reflect Type', target);
		},
		onHit(target, source, move) {
			const type = this.sample(this.dex.types.names().filter(i => i !== 'Stellar'));
			target.setType(type);
			this.add('-start', target, 'typechange', type, '[from] move: Reshape');
			this.boost({spa: 1}, source);
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
		pp: 5,
		priority: 0,
		flags: {},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Explosion', target);
		},
		onHit(target, source, move) {
			const displayText = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
			for (const targetCondition of Object.keys(target.side.sideConditions)) {
				if (target.side.removeSideCondition(targetCondition) && displayText.includes(targetCondition)) {
					this.add('-sideend', target, this.dex.conditions.get(targetCondition).name, '[from] move: Magic Trick', '[of] ' + source);
				}
			}
			for (const sideCondition of Object.keys(source.side.sideConditions)) {
				if (source.side.removeSideCondition(sideCondition) && displayText.includes(sideCondition)) {
					this.add('-sideend', source.side, this.dex.conditions.get(sideCondition).name, '[from] move: Magic Trick', '[of] ' + source);
				}
			}
			this.field.clearTerrain();
			this.field.clearWeather();
			for (const pseudoWeather of Object.keys(this.field.pseudoWeather)) {
				this.field.removePseudoWeather(pseudoWeather);
			}
		},
		self: {
			onHit(target, source, move) {
				return !!this.canSwitch(source.side);
			},
		},
		selfSwitch: true,
		secondary: null,
		target: "normal",
		type: "Normal",
	},

	// Rainshaft
	"hatsunemikusluckyorb": {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Hatsune Miku's Lucky Orb",
		shortDesc: "Boosts a random stat by 3 stages, then uses Baton Pass.",
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
		onHit(target, pokemon, move) {
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
				this.boost({[randomStat]: 3}, pokemon, pokemon, move);
				this.actions.useMove('Baton Pass', target);
			}
		},
		isZ: "rainiumz",
		secondary: null,
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
		pp: 5,
		priority: 0,
		flags: {protect: 1},
		terrain: 'psychicterrain',
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Photon Geyser', target);
		},
		secondary: null,
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
		pp: 5,
		priority: -7,
		flags: {},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Trick', target);
			this.add('-anim', source, 'Trick Room', target);
			this.add('-anim', source, 'Nasty Plot', target);
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

	// RSB
	confiscate: {
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		name: "Confiscate",
		shortDesc: "First turn only. Steals boosts and screens.",
		pp: 5,
		priority: 2,
		flags: {contact: 1, protect: 1, mirror: 1},
		onTry(source) {
			if (source.activeMoveActions > 1) {
				this.hint("Confiscate only works on your first turn out.");
				return false;
			}
		},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Crunch', target);
			this.add('-anim', source, 'Thief', target);
		},
		onTryHit(target, source) {
			this.add(`c:|${getName((source.illusion || source).name)}|Contraband detected, confiscating.`);
			for (const condition of ['reflect', 'lightscreen', 'auroraveil']) {
				if (target.side.removeSideCondition(condition)) {
					source.side.addSideCondition(condition);
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
		shortDesc: "+1 Special Attack on hit.",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Memento', target);
			this.add('-anim', source, 'Brutal Swing', target);
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
		type: "Dark",
	},

	// Scotteh
	purification: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Heals 50% of max HP. Cures status.",
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

	// SexyMalasada
	hexadecimalfire: {
		accuracy: 100,
		basePower: 75,
		category: "Special",
		shortDesc: "20% burn, 20% spite, 20% 1/4th recoil.",
		name: "Hexadecimal Fire",
		pp: 15,
		priority: 0,
		flags: {heal: 1, bypasssub: 1, allyanim: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Sacred Fire', target);
			this.add('-anim', source, 'Hex', target);
		},
		secondaries: [
			{
				chance: 20,
				status: 'brn',
			},
			{
				chance: 20,
				onHit(target) {
					if (!target.hp) return;
					let move: Move | ActiveMove | null = target.lastMove;
					if (!move || move.isZ) return;
					if (move.isMax && move.baseMove) move = this.dex.moves.get(move.baseMove);
					const ppDeducted = target.deductPP(move.id, 4);
					if (!ppDeducted) return;
					this.add('-activate', target, 'move: Hexadecimal Fire', move.name, ppDeducted);
				},
			},
			{
				chance: 20,
				onHit(target, source, move) {
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

	// Siegfried
	boltbeam: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		shortDesc: "Uses Thunderbolt and Ice Beam in succession, at half power.",
		name: "BoltBeam",
		pp: 15,
		priority: 0,
		flags: {},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onTryHit(target) {
			const tbolt = this.dex.getActiveMove('thunderbolt');
			tbolt.basePower = 45;
			const icebeam = this.dex.getActiveMove('icebeam');
			icebeam.basePower = 45;
			this.actions.useMove(tbolt, target);
			this.actions.useMove(icebeam, target);
			return null;
		},
		secondary: null,
		target: "self",
		type: "Electric",
	},

	// Sificon
	grassgaming: {
		accuracy: 100,
		basePower: 100,
		category: "Special",
		shortDesc: "Knock Off + Sappy Seed + Burning Jealousy but poison.",
		name: "Grass Gaming",
		pp: 15,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'G-Max Vine Lash', target);
		},
		onBasePower(basePower, source, target, move) {
			const item = target.getItem();
			if (!this.singleEvent('TakeItem', item, target.itemState, target, target, move, item)) return;
			if (item.id) {
				return this.chainModify(1.5);
			}
		},
		onAfterHit(target, source) {
			if (source.hp) {
				const item = target.takeItem();
				if (item) {
					this.add('-enditem', target, item.name, '[from] move: Grass Gaming', '[of] ' + source);
				}
			}
		},
		onHit(target, source, move) {
			if (target?.statsRaisedThisTurn) {
				target.trySetStatus('psn', source, move);
			}
			if (!target.hasType('Grass')) {
				target.addVolatile('leechseed', source);
			}
		},
		secondary: null,
		target: "normal",
		type: "Grass",
	},

	// skies
	like: {
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		shortDesc: "Recycle + Seed Bomb + Leech Seed.",
		name: "Like..?",
		pp: 5,
		priority: 0,
		flags: {},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Recycle', target);
			this.add('-anim', source, 'Seed Bomb', target);
			this.add('-anim', source, 'Leech Seed', target);
		},
		onHit(target, source) {
			if (target.hasType('Grass')) return null;
			target.addVolatile('leechseed', source);
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
		secondary: null,
		target: "normal",
		type: "Grass",
	},

	// snake
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
			this.add('-anim', source, 'Mortal Spin', target);
			this.add('-anim', source, 'Spikes', target);
			this.add('-anim', source, 'U-turn', target);
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

	// Soft Flex
	adaptivebeam: {
		accuracy: 100,
		basePower: 45,
		basePowerCallback(pokemon, target, move) {
			if (target && pokemon.positiveBoosts() < target.positiveBoosts()) {
				return move.basePower * 2;
			}
			return move.basePower;
		},
		category: "Special",
		shortDesc: "Power doubles if the target has more raised stats than the user.",
		name: "Adaptive Beam",
		pp: 15,
		priority: 0,
		flags: {sound: 1, protect: 1, bypasssub: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Flash Cannon', target);
			if (source.positiveBoosts() < target.positiveBoosts()) {
				this.add('-anim', source, 'Extreme Evoboost', source);
			}
		},
		onHit(target, source, move) {
			if (source.positiveBoosts() < target.positiveBoosts()) {
				const stats: BoostID[] = [];
				let stat: BoostID;
				for (stat in target.boosts) {
					if (stat === 'accuracy' || stat === 'evasion') continue;
					if (target.boosts[stat] > -6) {
						stats.push(stat);
					}
				}
				if (stats.length) {
					const randomStat = this.sample(stats);
					this.boost({[randomStat]: -1}, target, target, move);
				}
				const stats2: BoostID[] = [];
				let stat2: BoostID;
				for (stat2 in source.boosts) {
					if (stat2 === 'accuracy' || stat2 === 'evasion') continue;
					if (source.boosts[stat2] < 6) {
						stats2.push(stat2);
					}
				}
				if (stats2.length) {
					const randomStat = this.sample(stats2);
					this.boost({[randomStat]: 1}, source, source, move);
				}
			}
		},
		secondary: null,
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
		name: "Mind Melt",
		gen: 9,
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Burn Up', target);
		},
		secondary: null,
		target: "normal",
		type: "Fire",
	},

	// spoo
	cardiotraining: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Boosts Atk, Def and Sp. Def by 1 stage.",
		name: "Cardio Training",
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source, move) {
			this.add('-anim', source, 'Geomancy', source);
		},
		gen: 9,
		pp: 5,
		priority: 0,
		flags: {snatch: 1, dance: 1, metronome: 1},
		boosts: {
			atk: 1,
			def: 1,
			spd: 1,
		},
		secondary: null,
		target: "self",
		type: "Fire",
	},

	// Steorra
	phantomweapon: {
		accuracy: 100,
		basePower: 65,
		category: "Physical",
		name: "Phantom Weapon",
		shortDesc: "Double power if user is holding item; destroys item.",
		pp: 20,
		priority: 0,
		onModifyPriority(priority, pokemon) {
			if (!pokemon.item) return priority + 1;
		},
		flags: {protect: 1, mirror: 1},
		onModifyMove(move, pokemon, target) {
			if (!pokemon.item) {
				move.flags['contact'] = 1;
				move.flags['mirror'] = 1;
			}
		},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source, move) {
			this.add('-anim', source, 'Shadow Force', target);
			if (!source.item || source.ignoringItem()) return;
			const item = source.getItem();
			if (!this.singleEvent('TakeItem', item, source.itemState, source, source, move, item)) return;
			move.basePower *= 2;
			source.addVolatile('phantomweapon');
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
		secondary: null,
		target: "normal",
		type: "Ghost",
	},

	// Struchni
	randfact: {
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		shortDesc: "Random type.",
		name: "~randfact",
		gen: 9,
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source, move) {
			move.type = this.sample(this.dex.types.names().filter(i => i !== 'Stellar'));
			this.add('-anim', source, 'Nasty Plot', source);
			this.add('-anim', source, 'Head Smash', target);
		},
		secondary: null,
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
		desc: "Power is equal to 60+(X*20), where X is the total number of times the user has been hit by a damaging attack during the battle, even if the user did not lose HP from the attack. X cannot be greater than 4 and does not reset upon switching out or fainting. Each hit of a multi-hit attack is counted, but confusion damage is not counted.",
		shortDesc: "+20 power for each time user was hit. Max 4 hits.",
		name: "Vengeful Mood",
		gen: 9,
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Aura Sphere', source);
		},
		secondary: null,
		target: "normal",
		type: "Fighting",
	},

	// Swiffix
	stinkbomb: {
		accuracy: 85,
		basePower: 10,
		category: "Special",
		desc: "Hits ten times. This move checks accuracy for each hit, and the attack ends if the target avoids a hit. If one of the hits breaks the target's substitute, it will take damage for the remaining hits. If the user has the Skill Link Ability, this move will always hit ten times. If the user is holding Loaded Dice, this move hits four to ten times at random without checking accuracy between hits.",
		shortDesc: "Hits 10 times. Each hit can miss.",
		name: "Stink Bomb",
		gen: 9,
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Population Bomb', target);
			this.add('-anim', source, 'Venoshock', target);
		},
		multihit: 10,
		multiaccuracy: true,
		secondary: null,
		target: "normal",
		type: "Poison",
	},

	// Teclis
	risingsword: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		shortDesc: "Boosts Attack, Speed and Crit ratio by 1.",
		name: "Rising Sword",
		pp: 5,
		priority: 0,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onHit(pokemon) {
			const success = !!this.boost({atk: 1, spe: 1});
			return pokemon.addVolatile('risingsword') || success;
		},
		condition: {
			onStart(pokemon, source) {
				this.add('-start', pokemon, 'move: Rising Sword');
			},
			onModifyCritRatio(critRatio, source) {
				return critRatio + 1;
			},
		},
		flags: {},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Focus Energy', target);
			this.add('-anim', source, 'Agility', target);
		},
		secondary: null,
		target: "self",
		type: "Psychic",
	},

	// Tenshi
	sandeat: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		shortDesc: "Protects user, changes type and gains a new move.",
		name: "SAND EAT",
		pp: 10,
		priority: 4,
		flags: {noassist: 1},
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
				target: replacement.target,
				disabled: false,
				used: false,
			};
			pokemon.moveSlots[replacementIndex] = replacementMove;
			pokemon.baseMoveSlots[replacementIndex] = replacementMove;
			pokemon.addType(newType);
			this.add('-start', pokemon, 'typeadd', newType, '[from] move: SAND EAT');
			this.add(`c:|${getName((pokemon.illusion || pokemon).name)}|omg look HE EAT`);
		},
		onPrepareHit(pokemon, source) {
			this.add('-anim', source, 'Dig', pokemon);
			this.add('-anim', source, 'Odor Sleuth', pokemon);
			this.add('-anim', source, 'Stuff Cheeks', pokemon);
			this.add(`c:|${getName((pokemon.illusion || pokemon).name)}|he do be searching for rocks tho`);
			return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
		},
		secondary: null,
		target: "self",
		type: "Ground",
	},

	// Theia
	bodycount: {
		accuracy: 100,
		basePower: 50,
		basePowerCallback(pokemon, target, move) {
			return 50 + 50 * pokemon.side.totalFainted;
		},
		category: "Special",
		shortDesc: "+50 power for each time a party member fainted.",
		name: "Body Count",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit() {
			this.attrLastMove('[anim] Core Enforcer');
		},
		secondary: null,
		target: "normal",
		type: "Ghost",
	},

	// Tico
	eternalwish: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Wish + Aromatherapy + Defog.",
		name: "Eternal Wish",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(source, target) {
			this.add('-anim', target, 'Wish', target);
			this.add('-anim', target, 'Aromatherapy', target);
			this.add('-anim', target, 'Defog', target);
		},
		onHit(target, source, move) {
			let success = false;
			if (!target.volatiles['substitute'] || move.infiltrates) success = !!this.boost({evasion: -1});
			const removeTarget = [
				'reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist', 'spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge',
			];
			const removeAll = [
				'spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge',
			];
			for (const targetCondition of removeTarget) {
				if (target.side.removeSideCondition(targetCondition)) {
					if (!removeAll.includes(targetCondition)) continue;
					this.add('-sideend', target.side, this.dex.conditions.get(targetCondition).name, '[from] move: Eternal Wish', '[of] ' + source);
					success = true;
				}
			}
			for (const sideCondition of removeAll) {
				if (source.side.removeSideCondition(sideCondition)) {
					this.add('-sideend', source.side, this.dex.conditions.get(sideCondition).name, '[from] move: Eternal Wish', '[of] ' + source);
					success = true;
				}
			}
			this.field.clearTerrain();
			return success;
		},
		self: {
			slotCondition: 'Wish',
			onHit(target, source, move) {
				this.add('-activate', source, 'move: Eternal Wish');
				let success = false;
				const allies = [...source.side.pokemon, ...source.side.allySide?.pokemon || []];
				for (const ally of allies) {
					if (ally !== source && ((ally.hasAbility('sapsipper')) ||
						(ally.volatiles['substitute'] && !move.infiltrates))) {
						continue;
					}
					if (ally.cureStatus()) success = true;
				}
				return success;
			},
		},
		secondary: null,
		target: "normal",
		type: "Ghost",
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
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Morning Sun', source);
			this.add('-anim', source, 'Lovely Kiss', target);
		},
		onHit(target, source) {
			target.addVolatile('attract', source);
			target.addVolatile('confusion', source);
		},
		secondary: null,
		target: "normal",
		type: "Normal",
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

	// Two of Roses
	dillydally: {
		accuracy: 90,
		basePower: 40,
		category: "Physical",
		shortDesc: "2 hits, +1 random stat/hit. Type = User 2nd type.",
		name: "Dilly Dally",
		pp: 20,
		priority: 0,
		multihit: 2,
		flags: {protect: 1, contact: 1},
		type: "???",
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onModifyType(move, pokemon) {
			let type = pokemon.getTypes()[pokemon.getTypes().length - 1];
			if (type === "Bird" || type === undefined) type = "???";
			if (type === "Stellar") type = pokemon.getTypes()[pokemon.getTypes(false, true).length - 1];
			move.type = type;
		},
		secondary: {
			chance: 100,
			onHit(target, source, move) {
				const stats: BoostID[] = [];
				const boost: SparseBoostsTable = {};
				let statPlus: BoostID;
				for (statPlus in source.boosts) {
					if (statPlus === 'accuracy' || statPlus === 'evasion') continue;
					if (source.boosts[statPlus] < 6) {
						stats.push(statPlus);
					}
				}
				const randomStat: BoostID | undefined = stats.length ? this.sample(stats) : undefined;
				if (randomStat) boost[randomStat] = 1;
				this.boost(boost, source, source);
			},
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Volt Tackle', source);
			this.add('-anim', source, 'Extreme Speed', target);
		},
		target: "normal",
	},


	// UT
	myboys: {
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		shortDesc: "Uses two status moves, then pivots out.",
		name: "My Boys",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			const varMoves = ['Feather Dance', 'Growl', 'Rain Dance', 'Sunny Day', 'Tailwind', 'Taunt', 'Will-O-Wisp'];
			const move1 = this.sample(varMoves);
			const move2 = this.sample(varMoves.filter(i => i !== move1));
			this.add('-message', `Fletchling used ${move1}!`);
			this.actions.useMove(move1, source);
			this.add('-message', `Taillow used ${move2}!`);
			this.actions.useMove(move2, source);
			this.add('-message', `Talonflame attacked!`);
			this.add('-anim', source, 'U-Turn', target);
		},
		selfSwitch: true,
		secondary: null,
		target: "normal",
		type: "Flying",
	},

	// umowu
	hangten: {
		accuracy: 100,
		basePower: 75,
		category: "Special",
		name: "Hang Ten",
		shortDesc: "User sets Electric Terrain on hit.",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Stoked Sparksurfer', target);
			this.add('-anim', source, 'Surf', target);
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

	// Valerian
	firststrike: {
		accuracy: 100,
		basePower: 25,
		category: "Physical",
		name: "First Strike",
		shortDesc: "Turn 1: 100% flinch. +1 NVE, +2 NE, +3 SE Atk.",
		pp: 15,
		priority: 3,
		flags: {contact: 1, protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Fake Out", target);
		},
		onTry(source) {
			if (source.activeMoveActions > 1) {
				this.hint("First Strike only works on your first turn out.");
				return false;
			}
		},
		onAfterMoveSecondarySelf(pokemon, target, move) {
			let boost = 2;
			const typeMod = target.getMoveHitData(move).typeMod;
			if (typeMod > 0) {
				boost = 3;
			} else if (typeMod < 0) {
				boost = 1;
			}
			this.boost({atk: boost}, pokemon, pokemon, move);
		},
		secondary: {
			chance: 100,
			volatileStatus: 'flinch',
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
		pp: 15,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1, bypasssub: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Esper Wing", target);
			this.add('-anim', source, "Defog", source);
		},
		onHit(target, source, move) {
			let success = false;
			if (!target.volatiles['substitute'] || move.infiltrates) success = !!target.trySetStatus('tox', source);
			const removeTarget = [
				'reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist', 'spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge',
			];
			const removeAll = [
				'spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge',
			];
			for (const targetCondition of removeTarget) {
				if (target.side.removeSideCondition(targetCondition)) {
					if (!removeAll.includes(targetCondition)) continue;
					this.add('-sideend', target.side, this.dex.conditions.get(targetCondition).name, '[from] move: Your Crippling Interest', '[of] ' + source);
					success = true;
				}
			}
			for (const sideCondition of removeAll) {
				if (source.side.removeSideCondition(sideCondition)) {
					this.add('-sideend', source.side, this.dex.conditions.get(sideCondition).name, '[from] move: Your Crippling Interest', '[of] ' + source);
					success = true;
				}
			}
			this.field.clearTerrain();
			return success;
		},
		ignoreAbility: true,
		secondary: null,
		target: "normal",
		type: "Flying",
	},

	// Violet
	buildingcharacter: {
		accuracy: 95,
		basePower: 50,
		basePowerCallback(pokemon, target, move) {
			if (target?.terastallized) {
				this.debug('BP doubled from tera');
				return move.basePower * 2;
			}
			return move.basePower;
		},
		category: "Physical",
		shortDesc: "vs Tera'd opponent: 0 prio, 2x bp, removes Tera.",
		name: "building character",
		gen: 9,
		pp: 10,
		priority: 1,
		onModifyPriority(move, pokemon, target) {
			if (target?.terastallized) return 0;
		},
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			if (target?.terastallized) this.add('-anim', source, "Block", target);
			this.add('-anim', source, "Wicked Blow", target);
		},
		onHit(pokemon, source) {
			// TODO: Client support for removing tera without fainting
			if (pokemon?.terastallized) {
				this.add(`c:|${getName((source.illusion || source).name)}|lol never do that ever again thanks`);
				this.add('custom', '-endterastallize', pokemon);
				delete pokemon.terastallized;
				const details = pokemon.species.name + (pokemon.level === 100 ? '' : ', L' + pokemon.level) +
					(pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
				this.add('detailschange', pokemon, details);
			}
		},
		secondary: null,
		target: "normal",
		type: "Grass",
	},

	// vmnunes
	gracideasblessing: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		shortDesc: "Uses Wish, switches out. Recipient gets Aqua Ring.",
		name: "Gracidea's Blessing",
		pp: 10,
		priority: 0,
		flags: {},
		secondary: null,
		selfSwitch: true,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Morning Sun', source);
			this.add('-anim', source, 'Seed Flare', target);
		},
		slotCondition: 'gracideasblessing',
		condition: {
			duration: 2,
			onStart(pokemon, source) {
				this.effectState.hp = source.maxhp / 2;
			},
			onResidualOrder: 4,
			onEnd(target) {
				if (target && !target.fainted) {
					this.heal(this.effectState.hp, target, target);
					target.addVolatile('aquaring', target);
				}
			},
		},
		target: "self",
		type: "Grass",
	},

	// WarriorGallade - TODO: Fix animations
	fruitfullongbow: {
		accuracy: 90,
		basePower: 160,
		category: "Special",
		shortDesc: "Hit off higher atk, eats berry, Dragon/Fly eff.",
		name: "Fruitful Longbow",
		gen: 9,
		pp: 15,
		priority: 0,
		flags: {charge: 1, protect: 1, mirror: 1, slicing: 1, wind: 1},
		critRatio: 2,
		onEffectiveness(typeMod, target, type, move) {
			return typeMod + this.dex.getEffectiveness('Dragon', type);
		},
		onModifyMove(move, pokemon, target) {
			if (pokemon.getStat('atk') > pokemon.getStat('spa')) {
				move.overrideOffensiveStat = 'atk';
			}
		},
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				this.attrLastMove('[anim] Signal Beam');
				this.attrLastMove('[anim] Twister');
				this.attrLastMove('[anim] Psycho Cut');
				return;
			}
			this.add('-prepare', attacker, move.name);
			this.attrLastMove('[anim] Tailwind');
			this.add('-message', `${attacker.name} whipped up an intense whirlwind and began to glow a vivine green!`);
			if (attacker.getItem().isBerry) {
				attacker.eatItem(true);
				this.heal(attacker.maxhp / 4, attacker);
			}
			if (['sunnyday', 'desolateland'].includes(attacker.effectiveWeather())) {
				this.attrLastMove('[still]');
				this.attrLastMove('[anim] Signal Beam');
				this.attrLastMove('[anim] Twister');
				this.attrLastMove('[anim] Psycho Cut');
				return;
			}
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		secondary: null,
		target: "normal",
		type: "Flying",
	},

	// Waves
	torrentialdrain: {
		accuracy: 100,
		basePower: 100,
		category: "Special",
		shortDesc: "+1 Priority. Recovers 50% of damage dealt.",
		name: "Torrential Drain",
		pp: 10,
		priority: 1,
		flags: {protect: 1, mirror: 1, heal: 1, metronome: 1},
		drain: [1, 2],
		secondary: null,
		target: "allAdjacent",
		type: "Water",
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Aqua Ring', source);
			this.add('-anim', source, 'Origin Pulse', target);
			this.add('-anim', source, 'Parabolic Charge', target);
		},
	},

	// WigglyTree
	perfectmimic: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Endures hit and hits opponent with 1.5x power.",
		name: "Perfect Mimic",
		gen: 9,
		pp: 10,
		priority: 4,
		flags: {},
		volatileStatus: 'perfectmimic',
		onTryMove() {
			this.attrLastMove('[anim] Endure');
		},
		onDisableMove(pokemon) {
			if (pokemon.lastMove?.id === 'perfectmimic') pokemon.disableMove('perfectmimic');
		},
		condition: {
			duration: 1,
			onStart(target) {
				this.add('-singleturn', target, 'move: Endure');
			},
			onDamagePriority: -10,
			onDamage(damage, target, source, effect) {
				if (effect?.effectType === 'Move') {
					this.effectState.move = effect.id;
					if (damage >= target.hp) {
						this.add('-activate', target, 'move: Endure');
						return target.hp - 1;
					}
				}
			},
			onSourceAfterMove(source, target) {
				if (source === this.effectState.target || target !== this.effectState.target) return;
				if (!source.hp || !this.effectState.move) return;
				const move = this.dex.moves.get(this.effectState.move);
				if (move.isZ || move.isMax || move.category === 'Status') return;
				this.add('-message', target.name + ' tried to copy the move!');
				this.add('-anim', target, "Me First", source);
				this.actions.useMove(move, target, source);
				delete this.effectState.move;
			},
			onBasePowerPriority: 12,
			onBasePower() {
				return this.chainModify(1.5);
			},
		},
		secondary: null,
		target: "self",
		type: "Normal",
	},

	// XpRienzo
	scorchingtruth: {
		accuracy: 100,
		basePower: 90,
		category: "Special",
		shortDesc: "Always hits at least neutral. Ignores Rain/Primordial Sea.",
		name: "Scorching Truth",
		gen: 9,
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		hasCrashDamage: true,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Focus Energy', source);
			this.add('-anim', source, 'Fusion Flare', target);
		},
		onEffectiveness(typeMod, target, type, move) {
			if (typeMod < 0) return 0;
		},
		secondary: null,
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
		pp: 10,
		priority: -6,
		flags: {reflectable: 1, mirror: 1, bypasssub: 1, allyanim: 1, metronome: 1, noassist: 1, failcopycat: 1, wind: 1},
		forceSwitch: true,
		status: 'tox',
		secondary: null,
		target: "normal",
		type: "Poison",
	},

	// Yellow Paint
	whiteout: {
		accuracy: 85,
		basePower: 70,
		category: "Special",
		shortDesc: "Sets up Snow. Target's ability becomes Normalize.",
		name: "Whiteout",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1, bullet: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Weather Ball", target);
			this.add('-anim', source, "Snowscape", source);
		},
		onHit(target, source) {
			this.field.setWeather('snow');
			if (target.setAbility('normalize')) {
				this.add('-ability', target, 'Normalize', '[from] move: Whiteout');
			}
			this.add(`c:|${getName((source.illusion || source).name)}|A blank canvas.`);
		},
		secondary: null,
		target: "normal",
		type: "Ice",
	},

	// YveltalNL
	highground: {
		accuracy: 100,
		basePower: 90,
		category: "Special",
		shortDesc: "If user is taller than the opponent, boosts Sp. Atk by 1 stage.",
		name: "High Ground",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 100,
			onHit(target, source, move) {
				if (this.dex.species.get(source.species).heightm > this.dex.species.get(target.species).heightm) {
					this.boost({spa: 1}, source);
				}
			},
		},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Dragon Ascent", target);
			this.add('-anim', source, "Scorching Sands", target);
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
		name: "Dud ur a fish",
		pp: 5,
		priority: 0,
		flags: {heal: 1, snatch: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', target, "Recover", source);
			this.add('-anim', target, "Aqua Ring", source);
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
		secondary: null,
		target: "self",
		type: "Water",
	},

	// za
	shitpost: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Shitpost",
		shortDesc: "Confuses and paralyzes the foe.",
		pp: 20,
		priority: 0,
		flags: {protect: 1},
		volatileStatus: 'confusion',
		status: 'par',
		ignoreImmunity: false,
		onTryMove(pokemon, target, move) {
			this.attrLastMove('[still]');
			if (this.randomChance(1, 256)) {
				this.add('-fail', pokemon);
				return false;
			}
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Hex", target);
		},
		onMoveFail() {
			this.add('-message', '(In Gen 1, moves with 100% accuracy have a 1/256 chance to miss.)');
		},
		secondary: null,
		target: "normal",
		type: "Normal",
	},

	// Zarel
	tsignore: {
		accuracy: 100,
		basePower: 100,
		category: "Special",
		shortDesc: "Bypasses everything. Uses Higher Atk. ",
		name: "@ts-ignore",
		gen: 9,
		pp: 5,
		priority: 0,
		flags: {},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Conversion", source);
			this.add('-anim', source, "Techno Blast", target);
		},
		onModifyMove(move, pokemon, target) {
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
		secondary: null,
		target: "normal",
		type: "Normal",
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

	// zoro
	darkestnight: {
		accuracy: 100,
		basePower: 95,
		category: "Physical",
		shortDesc: "Literally just Foul Play.",
		name: "Darkest Night",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, metronome: 1},
		overrideOffensivePokemon: 'target',
		secondary: null,
		target: "normal",
		type: "Dark",
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Foul Play", target);
		},
	},

	// Modified moves
	bleakwindstorm: {
		inherit: true,
		onModifyMove(move, pokemon, target) {
			if (target && ['raindance', 'primordialsea', 'stormsurge'].includes(target.effectiveWeather())) {
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
		condition: {
			duration: 2,
			onImmunity(type, pokemon) {
				if (type === 'sandstorm' || type === 'deserteddunes' || type === 'hail') return false;
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
	dreameater: {
		inherit: true,
		onTryImmunity(target) {
			return target.status === 'slp' || target.hasAbility(['comatose', 'mensiscage']);
		},
	},
	electroshot: {
		inherit: true,
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name);
			this.boost({spa: 1}, attacker, attacker, move);
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
	gmaxsteelsurge: {
		inherit: true,
		condition: {
			onSideStart(side) {
				this.add('-sidestart', side, 'move: G-Max Steelsurge');
			},
			onEntryHazard(pokemon) {
				if (pokemon.hasItem('heavydutyboots') || pokemon.hasAbility('eternalgenerator')) return;
				// Ice Face and Disguise correctly get typed damage from Stealth Rock
				// because Stealth Rock bypasses Substitute.
				// They don't get typed damage from Steelsurge because Steelsurge doesn't,
				// so we're going to test the damage of a Steel-type Stealth Rock instead.
				const steelHazard = this.dex.getActiveMove('Stealth Rock');
				steelHazard.type = 'Steel';
				const typeMod = this.clampIntRange(pokemon.runEffectiveness(steelHazard), -6, 6);
				this.damage(pokemon.maxhp * Math.pow(2, typeMod) / 8);
			},
		},
	},
	hex: {
		inherit: true,
		basePowerCallback(pokemon, target, move) {
			if (target.status || target.hasAbility(['comatose', 'mensiscage'])) {
				this.debug('BP doubled from status condition');
				return move.basePower * 2;
			}
			return move.basePower;
		},
	},
	hurricane: {
		inherit: true,
		onModifyMove(move, pokemon, target) {
			switch (target?.effectiveWeather()) {
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
		basePowerCallback(pokemon, target, move) {
			if (target.status || target.hasAbility(['comatose', 'mensiscage'])) return move.basePower * 2;
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
			onDragOut(pokemon, source, move) {
				if (source && this.queue.willMove(source)?.moveid === 'protectoroftheskies') return;
				this.add('-activate', pokemon, 'move: Ingrain');
				return null;
			},
		},
	},
	mistyterrain: {
		inherit: true,
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasItem('terrainextender')) {
					return 8;
				}
				return 5;
			},
			onSetStatus(status, target, source, effect) {
				if (!target.isGrounded() || target.isSemiInvulnerable()) return;
				if (effect && ((effect as Move).status || effect.id === 'yawn')) {
					this.add('-activate', target, 'move: Misty Terrain');
				}
				return false;
			},
			onTryHitPriority: 4,
			onTryHit(target, source, effect) {
				if (effect && effect.name === "Puffy Spiky Destruction") {
					this.add('-activate', target, 'move: Misty Terrain');
					return null;
				}
			},
			onTryAddVolatile(status, target, source, effect) {
				if (!target.isGrounded() || target.isSemiInvulnerable()) return;
				if (status.id === 'confusion') {
					if (effect.effectType === 'Move' && !effect.secondaries) this.add('-activate', target, 'move: Misty Terrain');
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
			onFieldStart(field, source, effect) {
				if (effect?.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Misty Terrain', '[from] ability: ' + effect.name, '[of] ' + source);
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
			case 'snow':
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
			case 'snow':
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
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasItem('terrainextender')) {
					return 8;
				}
				return 5;
			},
			onTryHitPriority: 4,
			onTryHit(target, source, effect) {
				if (effect && (effect.priority <= 0.1 || effect.target === 'self') && effect.name !== "Puffy Spiky Destruction") {
					return;
				}
				if (target.isSemiInvulnerable() || target.isAlly(source)) return;
				if (!target.isGrounded()) {
					const baseMove = this.dex.moves.get(effect.id);
					if (baseMove.priority > 0) {
						this.hint("Psychic Terrain doesn't affect Pokémon immune to Ground.");
					}
					return;
				}
				this.add('-activate', target, 'move: Psychic Terrain');
				return null;
			},
			onBasePowerPriority: 6,
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Psychic' && attacker.isGrounded() && !attacker.isSemiInvulnerable()) {
					this.debug('psychic terrain boost');
					return this.chainModify([5325, 4096]);
				}
			},
			onFieldStart(field, source, effect) {
				if (effect?.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Psychic Terrain', '[from] ability: ' + effect.name, '[of] ' + source);
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
		onTry(source) {
			if (source.status === 'slp' || source.hasAbility(['comatose', 'mensiscage'])) return false;

			if (source.hp === source.maxhp) {
				this.add('-fail', source, 'heal');
				return null;
			}
			if (source.hasAbility(['insomnia', 'vitalspirit'])) {
				this.add('-fail', source, '[from] ability: ' + source.getAbility().name, '[of] ' + source);
				return null;
			}
		},
	},
	sandsearstorm: {
		inherit: true,
		onModifyMove(move, pokemon, target) {
			if (target && ['raindance', 'primordialsea', 'stormsurge'].includes(target.effectiveWeather())) {
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
		onTry(source) {
			return source.status === 'slp' || source.hasAbility(['comatose', 'mensiscage']);
		},
	},
	snore: {
		inherit: true,
		onTry(source) {
			return source.status === 'slp' || source.hasAbility(['comatose', 'mensiscage']);
		},
	},
	solarbeam: {
		inherit: true,
		onBasePower(basePower, pokemon, target) {
			const weakWeathers = ['raindance', 'primordialsea', 'stormsurge', 'sandstorm', 'deserteddunes', 'hail', 'snow'];
			if (weakWeathers.includes(pokemon.effectiveWeather())) {
				this.debug('weakened by weather');
				return this.chainModify(0.5);
			}
		},
	},
	solarblade: {
		inherit: true,
		onBasePower(basePower, pokemon, target) {
			const weakWeathers = ['raindance', 'primordialsea', 'stormsurge', 'sandstorm', 'deserteddunes', 'hail', 'snow'];
			if (weakWeathers.includes(pokemon.effectiveWeather())) {
				this.debug('weakened by weather');
				return this.chainModify(0.5);
			}
		},
	},
	spikes: {
		inherit: true,
		condition: {
			// this is a side condition
			onSideStart(side) {
				this.add('-sidestart', side, 'Spikes');
				this.effectState.layers = 1;
			},
			onSideRestart(side) {
				if (this.effectState.layers >= 3) return false;
				this.add('-sidestart', side, 'Spikes');
				this.effectState.layers++;
			},
			onEntryHazard(pokemon) {
				if (!pokemon.isGrounded() || pokemon.hasItem('heavydutyboots') || pokemon.hasAbility('eternalgenerator')) return;
				const damageAmounts = [0, 3, 4, 6]; // 1/8, 1/6, 1/4
				this.damage(damageAmounts[this.effectState.layers] * pokemon.maxhp / 24);
			},
		},
	},
	stealthrock: {
		inherit: true,
		condition: {
			// this is a side condition
			onSideStart(side) {
				this.add('-sidestart', side, 'move: Stealth Rock');
			},
			onEntryHazard(pokemon) {
				if (pokemon.hasItem('heavydutyboots') || pokemon.hasAbility('eternalgenerator')) return;
				const typeMod = this.clampIntRange(pokemon.runEffectiveness(this.dex.getActiveMove('stealthrock')), -6, 6);
				this.damage(pokemon.maxhp * Math.pow(2, typeMod) / 8);
			},
		},
	},
	stickyweb: {
		inherit: true,
		condition: {
			onSideStart(side) {
				this.add('-sidestart', side, 'move: Sticky Web');
			},
			onEntryHazard(pokemon) {
				if (!pokemon.isGrounded() || pokemon.hasItem('heavydutyboots') || pokemon.hasAbility('eternalgenerator')) return;
				this.add('-activate', pokemon, 'move: Sticky Web');
				this.boost({spe: -1}, pokemon, pokemon.side.foe.active[0], this.dex.getActiveMove('stickyweb'));
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
			case 'snow':
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
		onModifyMove(move, pokemon, target) {
			switch (target?.effectiveWeather()) {
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
	toxicspikes: {
		inherit: true,
		condition: {
			// this is a side condition
			onSideStart(side) {
				this.add('-sidestart', side, 'move: Toxic Spikes');
				this.effectState.layers = 1;
			},
			onSideRestart(side) {
				if (this.effectState.layers >= 2) return false;
				this.add('-sidestart', side, 'move: Toxic Spikes');
				this.effectState.layers++;
			},
			onEntryHazard(pokemon) {
				if (!pokemon.isGrounded()) return;
				if (pokemon.hasType('Poison')) {
					this.add('-sideend', pokemon.side, 'move: Toxic Spikes', '[of] ' + pokemon);
					pokemon.side.removeSideCondition('toxicspikes');
				} else if (pokemon.hasType('Steel') || pokemon.hasItem('heavydutyboots') || pokemon.hasAbility('eternalgenerator')) {
					return;
				} else if (this.effectState.layers >= 2) {
					pokemon.trySetStatus('tox', pokemon.side.foe.active[0]);
				} else {
					pokemon.trySetStatus('psn', pokemon.side.foe.active[0]);
				}
			},
		},
	},
	wakeupslap: {
		inherit: true,
		basePowerCallback(pokemon, target, move) {
			if (target.status === 'slp' || target.hasAbility(['comatose', 'mensiscage'])) {
				this.debug('BP doubled on sleeping target');
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
			case 'snow':
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
			case 'snow':
				move.basePower *= 2;
				break;
			}
			this.debug('BP: ' + move.basePower);
		},
	},
	wildboltstorm: {
		inherit: true,
		onModifyMove(move, pokemon, target) {
			if (target && ['raindance', 'primordialsea', 'stormsurge'].includes(target.effectiveWeather())) {
				move.accuracy = true;
			}
		},
	},
	gravity: {
		inherit: true,
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasAbility('persistent')) {
					this.add('-activate', source, 'ability: Persistent', '[move] Gravity');
					return 7;
				}
				return 5;
			},
			onFieldStart(target, source) {
				if (source?.hasAbility('persistent')) {
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

						if (pokemon.volatiles['skydrop'].source) {
							this.add('-end', pokemon.volatiles['twoturnmove'].source, 'Sky Drop', '[interrupt]');
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
			onBeforeMove(pokemon, target, move) {
				if (move.flags['gravity'] && !move.isZ) {
					this.add('cant', pokemon, 'move: Gravity', move);
					return false;
				}
			},
			onModifyMove(move, pokemon, target) {
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
};
