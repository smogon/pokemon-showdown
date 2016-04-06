"use strict";

exports.BattleMovedex = {
	// Eevee General
	adminthings: {
		accuracy: 100,
		category: "Status",
		id: "adminthings",
		isNonstandard: true,
		name: "Admin Things",
		pp: 5,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1, authentic: 1},
		selfSwitch: true,
		boosts: {atk: -1, spa: -1},
		secondary: false,
		onHit: function (target, source) {
			target.trySetStatus('tox', source);  // Doesn't use the status property to prevent the move
			target.addVolatile('taunt', source); // from failing before executing all actions.
			if (source.name === 'Eevee General') this.add("c|~Eevee General|Sorry but I have to go! Please submit your request in <<adminrequests>> and we'll look at it soon.");
		},
		target: "normal",
		type: "Normal",
	},
	// Aurora
	aerialfury: {
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		id: "aerialfury",
		isNonstandard: true,
		name: "Aerial Fury",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, gravity: 1},
		secondary: false,
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Defog", source);
			this.add('-anim', source, "Bounce", target);
		},
		target: "normal",
		type: "Flying",
	},
	// Albert
	aestheticallypleasing: {
		accuracy: 100,
		basePower: 90,
		category: "Special",
		id: "aestheticallypleasing",
		isNonstandard: true,
		name: "Aesthetically Pleasing",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Mist Ball", target);
		},
		secondary: {
			chance: 40,
			status: 'par',
		},
		target: "normal",
		type: "Dragon",
	},
	// awu
	ancestorsrage: {
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		id: "ancestorsrage",
		isNonstandard: true,
		isViable: true,
		name: "Ancestor's Rage",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			volatileStatus: 'confusion',
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Torment", source);
			this.add('-anim', source, "Psystrike", target);
		},
		target: "normal",
		type: "Fairy",
	},
	// spacebass
	armyofmushrooms: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "armyofmushrooms",
		isNonstandard: true,
		isViable: true,
		name: "Army of Mushrooms",
		pp: 5,
		priority: -1,
		flags: {snatch: 1},
		beforeTurnCallback: function (pokemon) {
			this.boost({def: 1, spd: 1}, pokemon, pokemon, 'mushroom army');
		},
		onHit: function (pokemon) {
			this.useMove("sleeppowder", pokemon);
			this.useMove("leechseed", pokemon);
			this.useMove("powder", pokemon);
		},
		secondary: false,
		target: "self",
		type: "Grass",
	},
	// Eyan
	attackofthetoucan: {
		accuracy: 100,
		basePower: 65,
		basePowerCallback: function (pokemon, target) {
			if (target.status) return 130;
			return 65;
		},
		category: "Special",
		id: "attackofthetoucan",
		isNonstandard: true,
		isViable: true,
		name: "Attack of the TOUCAN",
		pp: 10,
		priority: 1,
		flags: {mirror: 1, protect: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Bubble Beam", target);
		},
		onHit: function (target, source) {
			source.cureStatus();
		},
		secondary: false,
		target: "normal",
		type: "Fighting",
	},
	// boTTT
	automoderation: {
		accuracy: true,
		basePower: 40,
		basePowerCallback: function (pokemon, target) {
			let boosts = target.positiveBoosts();
			if (boosts) {
				this.add('-message', target.name + " was " + ['warned', 'muted', 'roombanned', 'locked', 'blacklisted', 'banned', 'permabanned'][(boosts < 8 ? boosts - 1 : 6)] + " by boTTT. (Automated moderation: spamming boosts)");
			}
			return 40 * Math.pow(1.5, boosts);
		},
		category: "Physical",
		id: "automoderation",
		isNonstandard: true,
		isViable: true,
		name: "Auto-Moderation",
		pp: 35,
		priority: 3,
		flags: {authentic: 1, mirror: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Luster Purge", target);
		},
		ignoreDefensive: true,
		secondary: false,
		target: "normal",
		type: "Ghost",
	},
	// Always
	backtothebenchagain: {
		accuracy: true,
		basePower: 70,
		category: "Special",
		id: "backtothebenchagain",
		isNonstandard: true,
		isViable: true,
		name: "Back to the bench again?",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source) {
			source.oldspaboosts = source.boosts["spa"];
			source.boosts["spa"] = 0;
			source.oldatkboosts = source.boosts["atk"];
			source.boosts["spa"] = 0;
		},
		onAfterHit: function (target, source) {
			source.boosts["spa"] = source.oldspaboosts || source.boosts["spa"];
			source.boosts["atk"] = source.oldatkboosts || source.boosts["atk"];
		},
		ignoreDefensive: true,
		selfSwitch: true,
		secondary: false,
		target: "normal",
		type: "Dragon",
	},
	// shrang
	banword: {
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		id: "banword",
		isNonstandard: true,
		isViable: true,
		name: ".banword",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Draco Meteor", target);
		},
		onHit: function (target) {
			let targets = target.side.pokemon.filter(pokemon => !(pokemon.fainted || pokemon === target));
			targets.sort(() => (Math.round(Math.random()) - 0.5));
			let lowestpct = 1, pokemon = target, candidate;
			for (let i = 0; i < targets.length; i++) {
				candidate = targets[i];
				if (candidate.hp / candidate.maxhp <= lowestpct && candidate.hp / candidate.maxhp >= 0.11) {
					lowestpct = candidate.hp / candidate.maxhp;
					pokemon = candidate;
				}
			}
			if (pokemon !== target) {
				this.add('message', "On " + target.side.name + "'s bench, " + pokemon.name + " was hit by the wake of the attack!");
				if (pokemon.hasAbility('Magic Guard')) {
					this.add('message', "But it resisted the effect using its Magic Guard!");
				} else {
					pokemon.hp -= Math.floor(pokemon.maxhp / 10);
					this.add('message', "It took slight collateral damage!");
				}
				if (!pokemon.hp) pokemon.hp = 1;
			}
		},
		secondary: {
			chance: 20,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Normal",
	},
	// Fireburn
	barnall: {
		accuracy: 90,
		basePower: 75,
		onBasePower: function (basePower, source, target) {
			if (target.status === 'brn') {
				return this.chainModify(2);
			}
		},
		category: "Physical",
		id: "barnall",
		isNonstandard: true,
		isViable: true,
		name: "BARN ALL",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1, defrost: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Overheat", target);
		},
		secondary: false,
		target: "normal",
		type: "Fire",
	},
	// Ace
	bignarstie: {
		accuracy: 100,
		basePower: 85,
		category: "Physical",
		id: "bignarstie",
		isNonstandard: true,
		isViable: true,
		name: "Big Narstie",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit: function (target, source) {
			if (source.name === 'Ace') {
				this.add('c|@Ace|AAAUAUUUGOGOOHOOHOHOHOHOHOHOHOOHOH');
			}
			this.attrLastMove('[still]');
			this.add('-anim', source, "Dragon Rush", target);
		},
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "normal",
		type: "Dragon",
	},
	// atomicllamas
	bitchycomment: {
		accuracy: 95,
		basePower: 100,
		category: "Special",
		id: "bitchycomment",
		isNonstandard: true,
		isViable: true,
		name: "Bitchy Comment",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1, authentic: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Metal Sound", target);
			this.add('-anim', source, "Torment", target);
		},
		secondary: {
			chance: 50,
			status: 'brn',
		},
		target: "normal",
		type: "Psychic",
	},
	// HeaLnDeaL
	boobersoblivion: {
		accuracy: 100,
		basePower: 80,
		category: "Special",
		id: "boobersoblivion",
		isViable: true,
		isNonstandard: true,
		name: "Boober's Oblivion",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, heal: 1},
		drain: [3, 4],
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Eruption", target);
		},
		secondary: {
			chance: 30,
			status: 'brn',
		},
		self: {volatileStatus: 'boobersoblivion'},
		effect: {
			onStart: function () {
				this.effectData.numConsecutive = 0;
				this.effectData.lastMove = 'boobersoblivion';
			},
			onBeforeMove: function (source, target, move) {
				if (this.effectData.lastMove === 'boobersoblivion') {
					this.effectData.numConsecutive++;
					if (move.id === this.effectData.lastMove && this.effectData.numConsecutive > 1) {
						source.faint();
					}
				} else {
					this.effectData.numConsecutive = 0;
				}
				this.effectData.lastMove = move.id;
			},
		},
		target: "any",
		type: "Fire",
	},
	// CoolStoryBrobat
	bravebat: {
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		id: "bravebat",
		isNonstandard: true,
		isViable: true,
		name: "Brave Bat",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, gravity: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Brave Bird", target);
		},
		critRatio: 2,
		secondary: false,
		target: "normal",
		type: "Flying",
	},
	// Teremiare
	brokenmirror: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "brokenmirror",
		isViable: true,
		isNonstandard: true,
		name: "Broken Mirror",
		pp: 10,
		priority: 4,
		flags: {},
		stallingMove: true,
		volatileStatus: 'brokenmirror',
		onTryHit: function (pokemon) {
			return !!this.willAct() && this.runEvent('StallMove', pokemon);
		},
		onHit: function (pokemon) {
			pokemon.addVolatile('stall');
		},
		effect: {
			duration: 1,
			onStart: function (target) {
				this.add('-singleturn', target, 'Protect');
			},
			onTryHitPriority: 3,
			onTryHit: function (target, source, move) {
				if (!move.flags['protect'] || move.category === 'Status') return;
				this.add('-activate', target, 'Protect');
				let lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				let sourceBoosts = {};
				for (let i in source.boosts) {
					source.boosts[i] = -source.boosts[i];
				}
				source.setBoost(sourceBoosts);
				this.add('-invertboost', source, '[from] move: Broken Mirror');
				return null;
			},
		},
		secondary: false,
		target: "self",
		type: "Dark",
	},
	// Kid Wizard
	brokenwand: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "brokenwand",
		isViable: true,
		isNonstandard: true,
		name: "Broken Wand",
		pp: 10,
		priority: 0,
		flags: {mirror: 1, snatch: 1},
		onHit: function (target, source) {
			let dice = this.random(7);
			if (dice === 3) {
				this.add('-message', "Broken Wand backfired!");
				this.damage(source.maxhp / 2, source, source, 'brokenwand');
				return false;
			}
			this.useMove('thunderbolt', source);
			this.heal(source.maxhp * 0.10, source, source);
			this.useMove('icebeam', source);
			this.useMove('calmmind', source);
			this.useMove('spikes', source);
		},
		secondary: false,
		target: "self",
		type: "Psychic",
	},
	// Raven
	buckfastbuzz: {
		accuracy: 100,
		basePower: 80,
		category: "Special",
		id: "buckfastbuzz",
		isViable: true,
		isNonstandard: true,
		name: "Buckfast Buzz",
		pp: 30,
		priority: 0,
		flags: {protect: 1, mirror: 1, heal: 1},
		drain: [3, 4],
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Oblivion Wing", target);
			if (toId(source.name) === 'raven') {
				this.add('c|&Raven|*hic* Ah\'ve had mah tonic wine and ah\'m ready tae batter yeh like a Mars bar ye wee Sassenach.');
			}
		},
		onAfterMoveSecondarySelf: function (source) {
			if (source.types[1]) {
				if (source.types[1] === 'Flying') {
					source.types = [source.types[0], 'Electric'];
					this.add('-start', source, 'typechange', source.types[0] + '/Electric');
				} else if (source.types[1] === 'Electric') {
					source.types = [source.types[0], 'Flying'];
					this.add('-start', source, 'typechange', source.types[0] + '/Flying');
				}
			}
		},
		secondary: false,
		target: "normal",
		type: "Flying",
	},
	// Phable (Paradise)
	burnspikes: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "burnspikes",
		isViable: true,
		isNonstandard: true,
		name: "Burn Spikes",
		pp: 20,
		priority: 0,
		flags: {reflectable: 1, nonsky: 1},
		sideCondition: 'burnspikes',
		effect: {
			// this is a side condition
			onStart: function () {
				this.add('-message', 'The Burn Spikes on the field will burn grounded Pokemon!');
			},
			onSwitchIn: function (pokemon) {
				if (!pokemon.isGrounded()) return;
				if (!pokemon.runImmunity('Fire')) return;
				if (pokemon.hasType('Fire')) {
					this.add('-message', 'The Burn Spikes on the field was absorbed!');
					pokemon.side.removeSideCondition('burnspikes');
				} else {
					pokemon.trySetStatus('brn', pokemon.side.foe.active[0]);
				}
			},
		},
		secondary: false,
		target: "foeSide",
		type: "Fire",
	},
	// grimAuxiliatrix
	buzzaxerampage: {
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		id: "buzzaxerampage",
		isNonstandard: true,
		isViable: true,
		name: "Buzz Axe Rampage",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Night Slash", target);
		},
		onHit: function (target, source) {
			if (source.hp) {
				const sideConditions = {'spikes': 1, 'toxicspikes': 1, 'burnspikes': 1, 'stealthrock': 1, 'stickyweb': 1};
				for (let i in sideConditions) {
					if (source.side.removeSideCondition(i)) {
						this.add('-sideend', source.side, this.getEffect(i).name, '[from] move: Buzz Axe Rampage', '[of] ' + source);
						target.side.addSideCondition(i, source);
					}
				}
			}
		},
		recoil: [33, 100],
		secondary: false,
		target: "normal",
		type: "Dark",
	},
	// Beowulf
	buzzingoftheswarm: {
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		id: "buzzingoftheswarm",
		isViable: true,
		isNonstandard: true,
		name: "Buzzing of the Swarm",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1, authentic: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Bug Buzz", target);
		},
		secondary: {
			chance: 10,
			boosts: {
				volatileStatus: 'flinch',
			},
		},
		target: "normal",
		type: "Bug",
	},
	// Zebraiken
	bzzt: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "bzzt",
		isViable: true,
		isNonstandard: true,
		name: "bzzt",
		pp: 5,
		noPPBoosts: true,
		priority: 4,
		flags: {sound: 1},
		self: {boosts: {spa:1, atk:1}},
		stallingMove: true,
		volatileStatus: 'protect',
		onPrepareHit: function (pokemon) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Parabolic Charge", pokemon);
			return !!this.willAct() && this.runEvent('StallMove', pokemon);
		},
		onHit: function (pokemon) {
			pokemon.addVolatile('stall');
		},
		secondary: false,
		target: "self",
		type: "Fighting",
	},
	// Snobalt
	capbust: {
		accuracy: 100,
		basePower: 90,
		category: "Special",
		defensiveCategory: "Physical",
		id: "capbust",
		isViable: true,
		isNonstandard: true,
		name: "Cap Bust",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Psyshock", target);
		},
		onEffectiveness: function (typeMod, type) {
			if (type === 'Fairy') return 1;
		},
		secondary: false,
		target: "normal",
		type: "Fighting",
	},
	// iplaytennislol
	cathy: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "cathy",
		isViable: true,
		isNonstandard: true,
		name: "Cathy",
		pp: 10,
		priority: 0.1,
		flags: {heal: 1, mirror: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Judgment", target);
		},
		onHit: function (target) {
			let stats = [];
			for (let stat in target.boosts) {
				if (target.boosts[stat] < 6) {
					stats.push(stat);
				}
			}
			if (stats.length) {
				let randomStat = stats[this.random(stats.length)];
				let boost = {};
				boost[randomStat] = 2;
				this.boost(boost);
			} else {
				return false;
			}
		},
		heal: [13, 20],
		secondary: false,
		target: "self",
		type: "Normal",
	},
	// LJ
	chaoswheel: {
		accuracy: true,
		basePower: 100,
		category: "Physical",
		id: "chaoswheel",
		isViable: true,
		isNonstandard: true,
		name: "Chaos Wheel",
		pp: 15,
		priority: 0,
		flags: {contact: 1, mirror: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Shadow Force", target);
		},
		secondary: false,
		target: "normal",
		type: "Ghost",
	},
	// Bondie
	clawguard: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "clawguard",
		isViable: true,
		isNonstandard: true,
		name: "Claw Guard",
		pp: 5,
		noPPBoosts: true,
		priority: 4,
		flags: {},
		stallingMove: true,
		volatileStatus: 'protect',
		onPrepareHit: function (pokemon) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Agility", pokemon);
			return !!this.willAct() && this.runEvent('StallMove', pokemon);
		},
		onHit: function (pokemon) {
			pokemon.addVolatile('rage');
			pokemon.addVolatile('stall');
		},
		boosts: {
			atk: 1,
			def: 1,
			accuracy: 1,
		},
		secondary: false,
		target: "self",
		type: "Normal",
	},
	// Steamroll
	conflagration: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "conflagration",
		isViable: true,
		isNonstandard: true,
		name: "Conflagration",
		pp: 40,
		priority: 4,
		flags: {},
		volatileStatus: 'protect',
		onPrepareHit: function (pokemon) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Sacred Fire", pokemon);
			return !!this.willAct();
		},
		onTry: function (pokemon) {
			if (pokemon.activeTurns > 1) {
				this.add('-fail', pokemon);
				this.add('-hint', "Conflagration only works on your first turn out.");
				return null;
			}
		},
		boosts: {
			atk: 2,
			def: 2,
			spa: 2,
			spd: 2,
			spe: 2,
		},
		secondary: false,
		target: "self",
		type: "Fire",
	},
	// Sailor Cosmos
	cosmosray: {
		accuracy: 100,
		basePower: 90,
		category: "Special",
		defensiveCategory: "Physical",
		id: "cosmosray",
		isNonstandard: true,
		name: "Cosmos Ray",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Cosmic Power', source);
			this.add('-anim', source, 'Freeze Shock', target);
		},
		secondary: {
			chance: 80,
			onHit: function (target, source) {
				if (this.random(2) === 1) {
					target.trySetStatus('par', source);
				} else {
					target.addVolatile('confusion', source);
				}
			},
		},
		target: "normal",
		type: "Water",
	},
	// Vexen IV
	debilitate: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "debilitate",
		isViable: true,
		isNonstandard: true,
		name: "Debilitate",
		pp: 5,
		priority: 1,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Night Shade", target);
		},
		boosts: {
			def: -1,
			spd: -1,
			spe: -1,
		},
		secondary: false,
		target: "allAdjacentFoes",
		type: "Dark",
	},
	// TONE114
	desolationpulse: {
		accuracy: 90,
		basePower: 50,
		category: "Special",
		id: "desolationpulse",
		name: "Desolation Pulse",
		pp: 5,
		priority: 0,
		isViable: true,
		isNonstandard: true,
		flags: {pulse: 1, protect: 1, mirror: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Dark Pulse", source);
			this.add('-anim', source, "Origin Pulse", target);
		},
		onHit: function (target, pokemon) {
			pokemon.addVolatile('desolationpulse');
		},
		effect: {
			duration: 1,
			onAfterMoveSecondarySelf: function (pokemon, target, move) {
				if (!target || target.fainted || target.hp <= 0) this.boost({spa:1, spd:1, spe:1}, pokemon, pokemon, move);
				pokemon.removeVolatile('desolationpulse');
			},
		},
		willCrit: true,
		secondary: false,
		target: "normal",
		type: "Water",
	},
	// Blast Chance
	doesntthisjustwin: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "doesntthisjustwin",
		isViable: true,
		isNonstandard: true,
		name: "Doesn\'t this just win?",
		pp: 5,
		noPPBoosts: true,
		priority: 0,
		flags: {},
		sleepUsable: true,
		onPrepareHit: function () {
			this.attrLastMove('[still]');
		},
		onTryHit: function (pokemon) {
			if (pokemon.status !== 'slp') return false;
		},
		onHit: function (pokemon) {
			for (let j = 0; j < 2; j++) {
				let moves = [];
				for (let i = 0; i < pokemon.moveset.length; i++) {
					let move = pokemon.moveset[i].id;
					let noSleepTalk = {
						assist:1, belch:1, bide:1, chatter:1, copycat:1, focuspunch:1, mefirst:1, metronome:1, mimic:1, mirrormove:1, naturepower:1, sketch:1, sleeptalk:1, uproar:1, doesntthisjustwin:1,
					};
					if (move && !(noSleepTalk[move] || this.getMove(move).flags['charge'])) {
						moves.push(move);
					}
				}
				let randomMove = '';
				if (moves.length) randomMove = moves[this.random(moves.length)];
				if (!randomMove) {
					return false;
				}
				if (randomMove === "rest" && pokemon.hp < pokemon.maxhp) {
					pokemon.cureStatus();
				}
				this.useMove(randomMove, pokemon);
			}
		},
		secondary: false,
		target: "self",
		type: "Psychic",
	},
	// galbia
	dog: {
		accuracy: 80,
		basePower: 120,
		category: "Physical",
		id: "dog",
		isNonstandard: true,
		name: "(dog)",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onModifyMove: function (move) {
			if (this.isWeather('sandstorm')) move.accuracy = true;
		},
		ignoreImmunity: true,
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Outrage", target);
		},
		secondary: false,
		target: "normal",
		type: "Normal",
	},
	// anty
	doubleedgy: {
		accuracy: true,
		basePower: 90,
		category: "Physical",
		id: "doubleedgy",
		isNonstandard: true,
		name: "Double-Edgy",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		recoil: [1, 3],
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Brave Bird", target);
		},
		secondary: false,
		target: "normal",
		type: "Steel",
	},
	// Mizuhime
	doublelaser: {
		accuracy: 95,
		basePower: 75,
		category: "Special",
		id: "doublelaser",
		isNonstandard: true,
		name: "Double Laser",
		pp: 40,
		priority: 0,
		flags: {pulse: 1, protect: 1, mirror: 1},
		multihit: 2,
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Water Pulse", target);
		},
		secondary: false,
		target: "normal",
		type: "Water",
	},
	// Galom
	dragonslayer: {
		accuracy: 100,
		basePower: 110,
		category: "Physical",
		id: "dragonslayer",
		isNonstandard: true,
		isViable: true,
		name: "Dragon Slayer",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Night Slash", target);
		},
		onEffectiveness: function (typeMod, type) {
			if (type === 'Dragon') return 1;
		},
		secondary: false,
		target: "normal",
		type: "Steel",
	},
	// Aelita
	energyfield: {
		accuracy: 90,
		basePower: 150,
		category: "Special",
		id: "energyfield",
		isNonstandard: true,
		isViable: true,
		name: "Energy Field",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onModifyMove: function (move) {
			if (this.isWeather(['raindance', 'primordialsea'])) {
				move.accuracy = true;
			} else if (this.isWeather(['sunnyday', 'desolateland'])) {
				move.accuracy = 50;
			}
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Parabolic Charge", source);
			this.add('-anim', source, "Parabolic Charge", source);
			this.add('-anim', source, "Ion Deluge", target);
		},
		self: {boosts:{spa:-1, spd:-1, spe:-1}},
		secondary: {
			chance: 40,
			status: 'par',
		},
		target: "normal",
		type: "Electric",
	},
	// Giagantic
	eternalashes: {
		accuracy: 85,
		basePower: 0,
		category: "Status",
		id: "eternalashes",
		isNonstandard: true,
		isViable: true,
		name: "Eternal Ashes",
		pp: 5,
		noPPBoosts: true,
		priority: 0,
		flags: {reflectable: 1, protect: 1, powder: 1, mirror: 1, defrost: 1},
		onTryHit: function (target) {
			if (!target.runStatusImmunity('powder')) {
				this.add('-immune', target, '[msg]');
				return null;
			}
		},
		onPrepareHit: function (target) {
			this.attrLastMove('[still]');
			this.add('-anim', target, "Spore", target);
		},
		onHit: function (target, source) {
			target.trySetStatus('brn');
			target.addVolatile('eternalashes', source);
		},
		effect: {
			onStart: function (pokemon) {
				this.add('-start', pokemon, 'Eternal Ashes', '[silent]');
				this.add('-message', 'Eternal Ashes will weaken the power of moves!');
			},
			onBasePowerPriority: 99,
			onBasePower: function () {
				this.add('-message', 'Eternal Ashes weakened the power of moves!');
				return this.chainModify(0.8);
			},
		},
		secondary: false,
		target: "normal",
		type: "Fire",
	},
	// MattL
	evaporatingsurge: {
		accuracy: 85,
		basePower: 110,
		category: "Physical",
		id: "evaporatingsurge",
		isNonstandard: true,
		isViable: true,
		name: "Evaporating Surge",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onEffectiveness: function (typeMod, type) {
			if (type === 'Water') return 1;
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Bolt Strike", target);
		},
		secondary: false,
		target: "allAdjacentFoes",
		type: "Water",
	},
	// Juanma
	exception: {
		accuracy: true,
		basePower: 110,
		category: "Special",
		id: "exception",
		isViable: true,
		isNonstandard: true,
		name: "\\Exception",
		pp: 5,
		priority: 0,
		flags: {mirror: 1, authentic: true},
		onTryHit: function (target, source) {
			this.add('-message', "PHP Fatal error: Uncaught exception 'Exception' with message 'The requested file does not exists.' in \\your\\moms\\basement:1\nStack trace:\n#0 {main}\nthrown in \\your\\moms\\basement on line 1.");
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Moonlight", source);
			this.add('-anim', source, "Draco Meteor", target);
		},
		onHit: function (target, source) {
			target.addVolatile('torment');
			target.addVolatile('confusion');
		},
		secondary: {
			chance: 66,
			status: 'brn',
		},
		self: {boosts: {spe: -1}},
		target: "allAdjacentFoes",
		type: "Fire",
	},
	// Marshmallon
	excuse: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		id: "excuse",
		isNonstandard: true,
		isViable: true,
		name: "Excuse",
		pp: 10,
		priority: 2,
		flags: {protect: 1, reflectable: 1, mirror: 1, authentic: 1},
		onHit: function (pokemon) {
			pokemon.addVolatile('confusion');
			pokemon.addVolatile('taunt');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Agility", source);
		},
		secondary: false,
		target: "normal",
		type: "Dark",
	},
	// Dirpz
	fairytypesong: {
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		defensiveCategory: "Special",
		id: "fairytypesong",
		isNonstandard: true,
		isViable: true,
		name: "Fairy Type Song",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1, authentic: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Fairy Lock", target);
			this.add('-anim', source, "Relic Song", target);
		},
		onHit: function (target, source) {
			if (toId(source.name) === 'dirpz') {
				this.add('c|+Dirpz|https://www.youtube.com/watch?v=9fGCVb6eS6A');
			}
		},
		secondary: {
			chance: 100,
			volatileStatus: 'confusion',
		},
		target: "normal",
		type: "Fairy",
	},
	// Feliburn
	falconpunch: {
		accuracy: 85,
		basePower: 150,
		category: "Physical",
		id: "falconpunch",
		isViable: true,
		isNonstandard: true,
		name: "Falcon Punch",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
		onPrepareHit: function (target, source) {
			if (toId(source.name) === 'feliburn') {
				this.add('c|@Feliburn|FAALCOOOOOOON');
			}
			this.attrLastMove('[still]');
			this.add('-anim', source, "Dynamic Punch", target);
		},
		onHit: function (target, source) {
			if (toId(source.name) === 'feliburn') {
				this.add('c|@Feliburn|PUUUUUNCH!!');
			}
		},
		self: {
			boosts: {
				atk: -1,
				def: -1,
				spd: -1,
			},
		},
		secondary: false,
		target: "normal",
		type: "Fire",
	},
	// Winry
	fighttothedeath: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "fighttothedeath",
		isNonstandard: true,
		isViable: true,
		name: "Fight to the Death",
		pp: 3,
		noPPBoosts: true,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function () {
			this.attrLastMove('[still]');
		},
		onHit: function (target, source) {
			this.useMove(['Guillotine', 'Fissure', 'Sheer Cold', 'Horn Drill'][this.random(4)], source);
		},
		secondary: false,
		target: "normal",
		type: "Fighting",
	},
	// Sunfished
	flatjoke: {
		accuracy: 80,
		basePower: 0,
		category: "Status",
		id: "flatjoke",
		isViable: true,
		isNonstandard: true,
		name: "Flat Joke",
		pp: 20,
		priority: -9,
		flags: {protect: 1, reflectable: 1, mirror: 1, sound: 1, authentic: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Metal Sound", source);
		},
		onHit: function () {
			this.add('message', "......");
			this.add('message', "(sweatdrop)");
			this.add('message', "......");
		},
		forceSwitch: true,
		sideCondition: 'flatjoke',
		self: {
			forceSwitch: true,
			sideCondition: 'flatjoke',
		},
		effect: {
			onSwitchIn: function (pokemon) {
				pokemon.side.removeSideCondition('flatjoke');
			},
			onResidual: function (side) {
				if (side.active.length && side.active[0].hp) side.removeSideCondition('flatjoke');
			},
			onEnd: function (side) {
				if (side.active.length && side.active[0].hp) {
					side.active[0].addVolatile('taunt', side.active[0]);
				}
			},
		},
		secondary: false,
		target: "normal",
		type: "Dark",
	},
	// chaos
	forcewin: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		id: "forcewin",
		isViable: true,
		isNonstandard: true,
		name: "Forcewin",
		pp: 15,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Taunt", source);
		},
		onHit: function (pokemon) {
			pokemon.addVolatile('taunt');
			pokemon.addVolatile('embargo');
			pokemon.addVolatile('torment');
			pokemon.addVolatile('confusion');
			pokemon.addVolatile('healblock');
		},
		secondary: false,
		target: "normal",
		type: "Dark",
	},
	// Former Hope
	formerlyformer: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "formerlyformer",
		isViable: true,
		isNonstandard: true,
		name: "Formerly Former",
		pp: 5,
		priority: 0,
		flags: {authentic: 1},
		onPrepareHit: function (target) {
			this.attrLastMove('[still]');
			this.add('-anim', target, "Grudge", target);
		},
		onHit: function (target, source) {
			const targetBoosts = {};
			const sourceBoosts = {};

			for (let i in target.boosts) {
				targetBoosts[i] = target.boosts[i];
				sourceBoosts[i] = source.boosts[i];
			}

			target.setBoost(sourceBoosts);
			source.setBoost(targetBoosts);

			this.add('-swapboost', source, target, '[from] move: Heart Swap');
		},
		self: {
			volatileStatus: 'destinybond',
		},
		secondary: false,
		target: "normal",
		type: "Ghost",
	},
	// GoodMorningEspeon
	fridgeoff: {
		accuracy: 70,
		basePower: 120,
		category: "Special",
		defensiveCategory: "Physical",
		id: "fridgeoff",
		isViable: true,
		isNonstandard: true,
		name: "FRIDGE OFF",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Avalanche", target);
		},
		secondary: {
			chance: 30,
			volatileStatus: 'confusion',
		},
		target: "normal",
		type: "Ice",
	},
	// bumbadadabum
	freesoftware: {
		accuracy: 95,
		basePower: 110,
		category: "Special",
		id: "freesoftware",
		isNonstandard: true,
		isViable: true,
		name: "Free Software",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {chance: 30, status: 'par'},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Electro Ball", source);
		},
		onHit: function (target, source) {
			if (source.name === 'bumbadadabum') {
				this.add('c|@bumbadadabum|I\'d just like to interject for a moment. What you\'re referring to as Linux, is in fact, GNU/Linux, or as I\'ve recently taken to calling it, GNU plus Linux. Linux is not an operating system unto itself, but rather another free component of a fully functioning GNU system made useful by the GNU corelibs, shell utilities and vital system components comprising a full OS as defined by POSIX.');
				this.add('c|@bumbadadabum|Many computer users run a modified version of the GNU system every day, without realizing it. Through a peculiar turn of events, the version of GNU which is widely used today is often called Linux, and many of its users are not aware that it is basically the GNU system, developed by the GNU Project.');
				this.add('c|@bumbadadabum|There really is a Linux, and these people are using it, but it is just a part of the system they use. Linux is the kernel: the program in the system that allocates the machine\'s resources to the other programs that you run. The kernel is an essential part of an operating system, but useless by itself; it can only function in the context of a complete operating system. Linux is normally used in combination with the GNU operating system: the whole system is basically GNU with Linux added, or GNU/Linux. All the so-called Linux distributions are really distributions of GNU/Linux!');
			}
		},
		target: "normal",
		type: "Electric",
	},
	// flying kebab
	frozenkebabskewers: {
		accuracy: 100,
		basePower: 20,
		category: "Physical",
		id: "frozenkebabskewers",
		isViable: true,
		isNonstandard: true,
		name: "Frozen Kebab Skewers",
		pp: 5,
		noPPBoosts: true,
		priority: 1,
		flags: {authentic: 1, mirror: 1},
		multihit: 2,
		ignoreDefensive: true,
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Icicle Spear", target);
		},
		onTryHit: function (target, source) {
			if (source.boosts['atk'] < 2) this.boost({atk: 1}, source, source);
			this.boost({spe: 1}, source, source);
		},
		onEffectiveness: function (typeMod, type) {
			return typeMod + this.getEffectiveness('Rock', type);
		},
		secondary: {
			chance: 10,
			status: 'frz',
		},
		target: "normal",
		type: "Ice",
	},
	// biggie
	foodrush: {
		accuracy: 90,
		basePower: 100,
		category: "Physical",
		id: "foodrush",
		isNonstandard: true,
		isViable: true,
		name: "Food Rush",
		pp: 10,
		priority: -6,
		flags: {contact: 1, protect: 1, mirror: 1},
		forceSwitch: true,
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Brave Bird", target);
		},
		self: {boosts: {evasion: -1}},
		target: "normal",
		type: "Normal",
	},
	// Imanalt
	freegenvbh: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "freegenvbh",
		isNonstandard: true,
		isViable: true,
		name: "FREE GENV BH",
		pp: 20,
		priority: 0,
		flags: {mirror: 1},
		onTryHit: function (target, source) {
			this.attrLastMove('[still]');
			this.useMove('earthquake', source);
			return null;
		},
		secondary: false,
		target: "self",
		type: "Normal",
	},
	// Sigilyph
	gammarayburst: {
		accuracy: 90,
		basePower: 350,
		category: "Special",
		id: "gammarayburst",
		isNonstandard: true,
		isViable: true,
		name: "Gamma Ray Burst",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		ignoreImmunity: {'Psychic': true},
		onPrepareHit: function (target, source) {
			if (toId(source.name) === 'sigilyph') {
				this.add('c|@Sigilyph|**SOOOOGOOOOLOOOOPH**');
			}
			this.attrLastMove('[still]');
			this.add('-anim', source, "Cosmic Power", source);
			this.add('-anim', source, "Explosion", source);
			this.add('-anim', source, "Light of Ruin", target);
		},
		selfdestruct: true,
		secondary: false,
		target: "allAdjacent",
		type: "Psychic",
	},
	// Joim
	gasterblaster: {
		accuracy: 100,
		basePower: 165,
		category: "Special",
		id: "gasterblaster",
		isNonstandard: true,
		name: "Gaster Blaster",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onEffectiveness: function (typeMod, type, move) {
			return typeMod + this.getEffectiveness('Ice', type);
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Hyper Beam", target);
		},
		onAfterHit: function (target, source) {
			if (target.hp > 0) {
				source.addVolatile('mustrecharge');
			} else {
				this.add("c|~Joim|You are wearing the expression of someone who's fainted a few times. Let's make it one more.");
			}
		},
		secondary: false,
		target: "normal",
		type: "Electric",
	},
	// Scotteh
	geomagneticstorm: {
		accuracy: 100,
		basePower: 140,
		category: "Special",
		id: "geomagneticstorm",
		isViable: true,
		isNonstandard: true,
		name: "Geomagnetic Storm",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Discharge", target);
		},
		secondary: false,
		target: "allAdjacent",
		type: "Electric",
	},
	// xfix
	glitchdimension: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "glitchdimension",
		isNonstandard: true,
		name: "(Glitch Dimension)",
		pp: 10,
		priority: 0,
		multihit: [2, 5],
		flags: {},
		onHit: function (target, source) {
			// The PP could be increased properly, instead of this silly hack,
			// but I like this hack, so it stays. It's intentionally buggy move, after all.
			const ppData = source.getMoveData('glitchdimension');
			if (ppData && ppData.pp) {
				ppData.pp = Math.round(ppData.pp * 10 + this.random(3) + 5) / 10;
			}
			const moves = Object.keys(exports.BattleMovedex);
			this.useMove(moves[this.random(moves.length)], target);
		},
		onTryHit: function (target, source, effect) {
			if (!source.isActive) return null;
			// This easter egg shouldn't happen too often.
			// The values here are meaningful, but I will provide the exercise in
			// figuring them out to whoever reads the code. Don't want to spoil
			// the fun in that.
			if (this.random(722) === 66) {
				this.addPseudoWeather('glitchdimension', source, effect, '[of] ' + source);
			}
		},
		effect: {
			duration: 5,
			onStart: function (target, source) {
				// Why do I make way too complex easter eggs that nobody will
				// notice? I don't know, but I did that in previous Super Staff
				// Bros., so let's continue with the tradition.
				const colors = [
					// CSS basic colors
					"black (is that even a color)", "silver", "gray", "white",
					"maroon", "red", "purple", "fuchsia", "green", "lime",
					"olive", "yellow", "navy", "blue", "teal", "aqua", "orange",
					// Pokemon Games
					"gold", "crystal", "ruby", "sapphire", "emerald", "diamond",
					"pearl", "platinum", "X", "Y",
					// PMD gummis (some don't make sense as colors, but whatever)
					"brown", "clear", "grass", "pink", "royal", "sky", "wander", "wonder",
					// Game Boy Color colors
					"strawberry", "grape", "kiwi", "dandelion", "atomic purple", "Pikachu & Pichu",
					// Game Boy Color palettes
					"dark brown", "pastel mix", "dark blue", "dark green", "reverse",
					// Why not?
					"shiny", "randomly", "'); DROP TABLE colors; --", "Ho-Oh", "blue screen",
				];
				const colorText = [];
				const times = this.random(3) + 1;
				for (let i = 0; i < times; i++) {
					const dice = this.random(colors.length);
					colorText.push(colors[dice]);
					colors.splice(dice, 1);
				}
				this.add('-message', "Ho-Oh is now colored " + colorText.join(" and ") + "! As well as every other \u3069\u25C0mon.");
			},
			onEffectiveness: function () {
				return this.random(3) - 1;
			},
			onEnd: function () {
				this.add('-message', "Ho-Oh is no longer colored!");
			},
		},
		secondary: false,
		target: "self",
		type: "Normal",
	},
	// Sonired
	godturn: {
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		id: "godturn",
		isViable: true,
		isNonstandard: true,
		name: "God Turn",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "U-turn", target);
		},
		onAfterMoveSecondarySelf: function (source) {
			this.useMove('batonpass', source);
		},
		// selfSwitch: 'copyvolatile' does not work with targeted moves.
		secondary: false,
		target: "normal",
		type: "Bug",
	},
	// xShiba
	goindalikelinda: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "goindalikelinda",
		isNonstandard: true,
		isViable: true,
		name: "Go Inda Like Linda",
		pp: 30,
		priority: 0,
		flags: {snatch: 1},
		boosts: {
			spe: 2,
			atk: 2,
		},
		secondary: false,
		target: "self",
		type: "Flying",
	},
	// Hashtag
	gottagostrats: {
		accuracy: 85,
		basePower: 130,
		category: "Physical",
		id: "gottagostrats",
		isNonstandard: true,
		isViable: true,
		name: "GOTTA GO STRATS",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Last Resort", target);
		},
		onHit: function (target, pokemon) {
			pokemon.addVolatile('fellstinger');
		},
		secondary: false,
		target: "normal",
		type: "Normal",
	},
	// pluviometer
	grammarhammer: {
		accuracy: 100,
		basePower: 104, // Pixilate
		category: "Special",
		id: "grammarhammer",
		isNonstandard: true,
		isViable: true,
		name: "Grammar Hammer",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, defrost: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', target, "Fusion Flare", target);
		},
		secondary: {
			chance: 100,
			status: 'brn',
		},
		target: "normal",
		type: "Fairy",
	},
	// Lyto
	gravitystorm: {
		accuracy: 100,
		basePower: 100,
		category: "Special",
		id: "gravitystorm",
		isNonstandard: true,
		isViable: true,
		name: "Gravity Storm",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', target, "Ion Deluge", target);
			this.add('-anim', source, "Magnet Rise", source);
		},
		onHit: function (target, source) {
			if (!(source.volatiles['magnetrise'] || this.pseudoWeather['gravity'])) {
				source.addVolatile('magnetrise');
				this.boost({accuracy: -1, evasion: -1}, source, source);
			}
		},
		secondary: false,
		target: "normal",
		type: "Electric",
	},
	// Snowy
	hailwhitequeen: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "hailwhitequeen",
		isNonstandard: true,
		isViable: true,
		name: "Hail Whitequeen",
		pp: 5,
		priority: 4,
		flags: {},
		stallingMove: true,
		volatileStatus: 'hailwhitequeen',
		onTryHit: function (pokemon) {
			return !!this.willAct() && this.runEvent('StallMove', pokemon);
		},
		onPrepareHit: function () {
			this.attrLastMove('[still]');
		},
		onHit: function (pokemon) {
			pokemon.addVolatile('stall');
		},
		effect: {
			duration: 1,
			onStart: function (target) {
				this.add('-singleturn', target, 'Protect');
			},
			onTryHitPriority: 3,
			onTryHit: function (target, source, move) {
				if (!move.flags['protect'] || move.category === 'Status') return;
				this.add('-activate', target, 'Protect');
				let lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				if (move.flags['contact'] && move.category === 'Physical') {
					for (let i = 0; i < source.side.pokemon.length; i++) {
						let pokemon = source.side.pokemon[i];
						if (pokemon.status === 'frz') return null;
					}
					source.trySetStatus('frz');
				}
				return null;
			},
		},
		secondary: false,
		target: "self",
		type: "Ice",
	},
	// nv
	hamsterdance: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		id: "hamsterdance",
		isNonstandard: true,
		isViable: true,
		name: "Hamster Dance",
		pp: 30,
		priority: 0,
		flags: {authentic: 1, protect: 1, mirror: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Dragon Dance", source);
		},
		onHit: function (target, source) {
			target.addVolatile('confusion', source);
			let reset = false;
			for (let boost in target.boosts) {
				if (target.boosts[boost] !== 0) {
					target.boosts[boost] = 0;
					this.add('-setboost', target, boost, 0);
					reset = true;
				}
			}
			if (reset) this.add('message', 'Hamster Dance has reset stat changes!');
		},
		secondary: false,
		target: "normal",
		type: "Normal",
	},
	// Anttya
	hax: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "hax",
		isNonstandard: true,
		isViable: true,
		name: "Hax",
		pp: 10,
		priority: 0,
		flags: {},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Agility", target);
		},
		onModifyMove: function (move) {
			let rand = this.random(10);
			if (rand < 1) {
				move.onHit = function (pokemon) {
					this.damage(this.getDamage(pokemon, pokemon, 40), pokemon, pokemon, {
						id: 'confused',
						effectType: 'Move',
						type: '???',
					});
				};
			} else if (rand < 3) {
				move.boosts = {
					spa: 2,
					spd: 2,
					spe: 2,
				};
			} else {
				move.target = "normal";
				if (rand < 5) {
					move.onPrepareHit = function (target, source) {
						this.attrLastMove('[still]');
						this.add('-anim', source, "Fairy Lock", target);
					};
					move.onHit = function (target, source) {
						source.trySetStatus('par');
						source.addVolatile('confusion');
						target.trySetStatus('par');
						target.addVolatile('confusion');
					};
				} else {
					move.accuracy = 90;
					move.basePower = 80;
					move.category = "Special";
					move.flags = {protect: 1};
					move.willCrit = true;
					move.onPrepareHit = function (target, source) {
						this.attrLastMove('[still]');
						this.add('-anim', source, "Mist Ball", target);
					};
				}
			}
		},
		secondary: false,
		target: "self",
		type: "Normal",
	},
	// Hippopotas
	hazardpass: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		id: "hazardpass",
		isNonstandard: true,
		isViable: true,
		name: "Hazard Pass",
		pp: 20,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		selfSwitch: true,
		onHit: function (pokemon) {
			let hazards = ['stealthrock', 'spikes', 'toxicspikes', 'stickyweb'];
			pokemon.side.addSideCondition(hazards.splice(this.random(hazards.length), 1)[0]);
			pokemon.side.addSideCondition(hazards.splice(this.random(hazards.length), 1)[0]);
		},
		secondary: false,
		target: "normal",
		type: "Dark",
	},
	// qtrx
	hiddenpowernormal: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "hiddenpowernormal",
		isNonstandard: true,
		isViable: true,
		name: "Hidden Power Normal",
		pp: 65,
		priority: 0,
		flags: {snatch: 1, authentic: 1},
		onModifyMove: function (move, source) {
			if (source.template.isMega) {
				move.name = "SUPER GLITCH";
				if (this.p1.pokemon.filter(mon => !mon.fainted).length > 1 && this.p2.pokemon.filter(mon => !mon.fainted).length > 1) {
					source.addVolatile('hiddenpowernormal');
					move.forceSwitch = true;
					move.selfSwitch = true;
				}
			} else {
				move.name = "KEYBOARD SMASH";
			}
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Fairy Lock", target);
			this.add('-anim', target, "Fairy Lock", target); // DRAMATIC FLASHING
		},
		onHit: function (target, source) {
			if (!source.template.isMega) {
				let gibberish = '';
				let hits = 0;
				let hps = ['hiddenpowerbug', 'hiddenpowerdark', 'hiddenpowerdragon', 'hiddenpowerelectric', 'hiddenpowerfighting', 'hiddenpowerfire', 'hiddenpowerflying', 'hiddenpowerghost', 'hiddenpowergrass', 'hiddenpowerground', 'hiddenpowerice', 'hiddenpowerpoison', 'hiddenpowerpsychic', 'hiddenpowerrock', 'hiddenpowersteel', 'hiddenpowerwater'];
				let hitcount = [3, 4, 4, 4, 4, 5, 5, 6, 6][this.random(9)];
				if (source.name === 'qtrx') this.add('c|@qtrx|/me slams face into keyboard!');
				source.isDuringAttack = true; // Prevents the user from being kicked out in the middle of using Hidden Powers.
				for (let i = 0; i < hitcount; i++) {
					if (target.hp !== 0) {
						let len = 16 + this.random(35);
						gibberish = '';
						for (let j = 0; j < len; j++) gibberish += String.fromCharCode(48 + this.random(79));
						this.add('-message', gibberish);
						this.useMove(hps[this.random(16)], source, target);
						hits++;
					}
				}
				this.add('-message', 'Hit ' + hits + (hits === 1 ? ' time!' : ' times!'));
				source.isDuringAttack = false;
			} else if (source.volatiles['ingrain'] || target.volatiles['ingrain']) {
				// Avoid weirdness with trade prompts when trading is not possible
				source.removeVolatile('hiddenpowernormal');
				this.useMove("perishsong", source, target);
			} else if (source.volatiles['hiddenpowernormal']) {
				target.swapping = true;
				source.swapping = true;
			} else {
				this.useMove("explosion", source, target);
			}
		},
		effect: {
			duration: 1,
			onAfterMoveSecondarySelf: function (source, target) {
				if (source.swapping && target.swapping) {
					this.add("raw|<div class=\"broadcast-blue\"><b>" + source.side.name + " will trade " + source.name + " for " + target.side.name + "'s " + target.name + ".</b></div>");
					this.add('message', "Link standby... Please wait.");
				} else {
					this.add('message', "Trade cancelled.");
				}
			},
		},
		secondary: false,
		target: "normal",
		type: "Normal",
	},
	// SpecsMegaBeedrill
	highfive: {
		accuracy: 100,
		basePower: 30,
		category: "Special",
		id: "highfive",
		isViable: true,
		isNonstandard: true,
		name: "High Five",
		pp: 35,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		multihit: 5,
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Pin Missile", target);
		},
		target: "normal",
		type: "Bug",
	},
	// Albacore
	hitandrun: {
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		id: "hitandrun",
		isViable: true,
		isNonstandard: true,
		name: "Hit-And-Run",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "U-turn", target);
		},
		selfSwitch: true,
		secondary: {
			chance: 100,
			volatileStatus: 'confusion',
		},
		target: "normal",
		type: "Psychic",
	},
	// Ciran
	hmu: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "hmu",
		isNonstandard: true,
		isViable: true,
		name: "HMU",
		pp: 40,
		priority: 4,
		flags: {},
		stallingMove: true,
		volatileStatus: 'protect',
		onModifyMove: function (move) {
			move.name = 'HMU (Hold My Unicorn)';
		},
		onPrepareHit: function (pokemon) {
			this.attrLastMove('[still]');
			return !!this.willAct() && this.runEvent('StallMove', pokemon);
		},
		onHit: function (pokemon) {
			pokemon.addVolatile('stall');
			const foeactive = pokemon.side.foe.active;
			for (let i = 0; i < foeactive.length; i++) {
				if (!foeactive[i] || foeactive[i].fainted) continue;
				if (foeactive[i].item) {
					this.add('-item', foeactive[i], foeactive[i].getItem().name, '[from] ability: Frisk', '[of] ' + pokemon, '[identify]');
				}
			}
		},
		secondary: false,
		target: "self",
		type: "Fairy",
	},
	// E4 Flint
	holographicdragonstorm: {
		accuracy: 75,
		basePower: 150,
		category: "Special",
		id: "holographicdragonstorm",
		isNonstandard: true,
		isViable: true,
		name: "Holographic Dragon Storm",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Night Shade", source);
			this.add('-anim', source, "Wish", source);
			this.add('-anim', source, "Draco Meteor", target);
		},
		onHit: function (target, source) {
			if (!source.volatiles['substitute'] && source.hp > source.maxhp / 4 && source.addVolatile('substitute', source)) {
				this.directDamage(source.maxhp / 4, source, source);
			}
		},
		self: {
			boosts: {
				spa: -2,
			},
		},
		secondary: false,
		target: "normal",
		type: "Dragon",
	},
	// urkerab
	holyorders: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "holyorders",
		isNonstandard: true,
		isViable: true,
		name: "Holy Orders",
		pp: 10,
		priority: 0,
		flags: {},
		onPrepareHit: function () {
			this.attrLastMove('[still]');
		},
		onHit: function (target, source) {
			this.useMove("healorder", source);
			this.useMove("defendorder", source);
			this.useMove("attackorder", source);
		},
		secondary: false,
		target: "self",
		type: "Fighting",
	},
	// Clefairy
	hyperspaceearrape: {
		accuracy: true,
		basePower: 140,
		category: "Special",
		id: "hyperspaceearrape",
		isViable: true,
		isNonstandard: true,
		name: "Hyperspace Earrape",
		pp: 5,
		priority: 0,
		flags: {mirror: 1, authentic: 1, sound: 1},
		breaksProtect: true,
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Cosmic Power", source);
			this.add('-anim', source, "Boomburst", target);
		},
		self: {
			boosts: {
				def: -1,
				spa: -1,
				spd: -1,
			},
		},
		secondary: false,
		target: "normal",
		type: "Dark",
	},
	// ih8ih8sn0w
	imprisonform: {
		accuracy: 85,
		basePower: 0,
		category: "Status",
		id: "imprisonform",
		isNonstandard: true,
		isViable: true,
		name: "Imprisonform",
		pp: 3,
		noPPBoosts: true,
		priority: 0,
		flags: {},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Heal Block", source);
			this.add('-anim', target, "Heal Block", target);
		},
		onHit: function (target, source) {
			if (!source.transformInto(target, source)) {
				return false;
			}
		},
		self: {volatileStatus: 'Imprison'},
		secondary: false,
		target: "normal",
		type: "Dark",
	},
	// talkingtree
	iwantyouback: {
		accuracy: 100,
		basePower: 96,
		category: "Physical",
		id: "iwantyouback",
		isViable: true,
		isNonstandard: true,
		name: "I Want You Back",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, heal: 1},
		sideCondition: 'stealthrock',
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Smack Down", target);
		},
		drain: [3, 4],
		secondary: false,
		target: "normal",
		type: "Rock",
	},
	// sirDonovan
	ladiesfirst: {
		accuracy: 100,
		basePower: 120,
		category: 'Special',
		id: 'ladiesfirst',
		isNonstandard: true,
		isViable: true,
		name: 'Ladies First',
		pp: 20,
		priority: 0,
		flags: {protect: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Sing", target);
		},
		onHit: function (target, pokemon) {
			let decision = this.willMove(pokemon);
			if (decision && target.gender === 'F') {
				this.cancelMove(pokemon);
				this.queue.unshift(decision);
				this.add('-activate', pokemon, 'move: Ladies First');
			}
		},
		self: {boosts: {spe: 1}},
		secondary: false,
		target: 'normal',
		type: 'Fairy',
	},
	// Rekeri
	landbeforetime: {
		accuracy: 90,
		basePower: 125,
		category: "Physical",
		id: "landbeforetime",
		isViable: true,
		isNonstandard: true,
		name: "Land Before Time",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: {chance: 35, volatileStatus: 'flinch'},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Precipice Blades", target);
		},
		target: "normal",
		type: "Rock",
	},
	// Crestfall
	lightofunruin: {
		accuracy: 85,
		basePower: 110,
		category: "Special",
		id: "lightofunruin",
		isNonstandard: true,
		isViable: true,
		name: "Light of Unruin",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		isUnreleased: true,
		drain: [1, 2],
		self: {boosts: {def: -1, spd: -1}},
		secondary: false,
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Light Of Ruin", target);
		},
		target: "normal",
		type: "Fairy",
	},
	// scpinion
	lolroom: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "lolroom",
		isNonstandard: true,
		pp: 5,
		priority: 0,
		flags: {mirror: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Agility", target);
		},
		onHit: function (target, source, effect) {
			if (this.pseudoWeather['trickroom']) {
				this.removePseudoWeather('trickroom', source, effect, '[of] ' + source);
			} else {
				this.addPseudoWeather('trickroom', source, effect, '[of] ' + source);
			}
		},
		volatileStatus: 'lolroom',
		effect: {
			onStart: function (pokemon) {
				this.add('-start', pokemon, 'LOL! Room');
				let newatk = pokemon.stats.spd;
				let newdef = pokemon.stats.spa;
				pokemon.stats.spa = newatk;
				pokemon.stats.spd = newdef;
			},
			onCopy: function (pokemon) {
				this.add('-start', pokemon, 'LOL! Room');
				let newatk = pokemon.stats.spd;
				let newdef = pokemon.stats.spa;
				pokemon.stats.spa = newatk;
				pokemon.stats.spd = newdef;
			},
			onEnd: function (pokemon) {
				this.add('-end', pokemon, 'LOL! Room');
				let newatk = pokemon.stats.spd;
				let newdef = pokemon.stats.spa;
				pokemon.stats.spa = newatk;
				pokemon.stats.spd = newdef;
			},
			onRestart: function (pokemon) {
				pokemon.removeVolatile('LOL! Room');
			},
		},
		secondary: false,
		target: "self",
		type: "Psychic",
	},
	// Kalalokki
	maelstrm: {
		accuracy: 85,
		basePower: 100,
		category: "Special",
		id: "maelstrm",
		isNonstandard: true,
		name: "Maelström",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Surf", target);
			this.add('-anim', source, "Dark Void", target);
		},
		onHit: function (target, source) {
			target.addVolatile('maelstrm', source);
		},
		effect: {
			duration: 5,
			durationCallback: function (target, source) {
				if (source.hasItem('gripclaw')) return 8;
				return this.random(5, 7);
			},
			onStart: function () {
				this.add('message', 'It became trapped in an enormous maelström!');
			},
			onResidualOrder: 11,
			onResidual: function (pokemon) {
				if (this.effectData.source.hasItem('bindingband')) {
					this.damage(pokemon.maxhp / 6);
				} else {
					this.damage(pokemon.maxhp / 8);
				}
			},
			onEnd: function () {
				this.add('message', 'The maelström dissipated.');
			},
			onTrapPokemon: function (pokemon) {
				pokemon.tryTrap();
			},
		},
		secondary: false,
		target: "normal",
		type: "Water",
	},
	// Jetpack
	malicioushypnosis: {
		accuracy: 90,
		basePower: 100,
		category: "Special",
		id: "malicioushypnosis",
		isViable: true,
		isNonstandard: true,
		name: "Malicious Hypnosis",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Hypnosis", target);
		},
		secondary: {
			chance: 40,
			status: 'slp',
		},
		target: "normal",
		type: "Psychic",
	},
	// Omega-Xis
	memecannon: {
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		id: 'memecannon',
		isViable: true,
		isNonstandard: true,
		name: "Meme Cannon",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTry: function (pokemon) {
			if (pokemon.activeTurns > 1) {
				this.add('c|+Omega-Xis|good shit go౦ԁ sHit thats ✔ some goodshit rightthere right✔there ✔✔if i do ƽaү so my self i say so thats what im talking about right there right there (chorus: ʳᶦᵍʰᵗ ᵗʰᵉʳᵉ) mMMMMᎷМ НO0ОଠOOOOOОଠଠOoooᵒᵒᵒᵒᵒᵒᵒᵒᵒ Good shit');
			} else {
				this.add('c|+Omega-Xis|Jet fuel can’t melt steel beams.');
			}
		},
		onTryHit: function (target, source) {
			let oldAbility = source.setAbility('flashfire');
			if (oldAbility) {
				this.add('-ability', source, this.getAbility(source.ability).name, '[from] move: Meme Cannon', '[of] ' + target);
			}
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Flash Cannon", target);
		},
		secondary: false,
		target: "normal",
		type: "Steel",
	},
	// Hollywood
	mememime: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "mememime",
		isViable: true,
		isNonstandard: true,
		name: "Meme Mime",
		pp: 5,
		priority: 0,
		flags: {snatch: 1},
		boosts: {
			atk: 1,
			def: 1,
			spa: 1,
			spd: 1,
			spe: 1,
			accuracy: 1,
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Geomancy", target);
		},
		secondary: false,
		target: "self",
		type: "Psychic",
	},
	// Spy
	mineralpulse: {
		accuracy: 100,
		basePower: 95,
		category: "Special",
		id: "mineralpulse",
		isViable: true,
		isNonstandard: true,
		name: "Mineral Pulse",
		pp: 20,
		priority: 0,
		flags: {protect: 1, pulse: 1, mirror: 1, distance: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Flash Cannon", target);
		},
		secondary: {
			chance: 20,
			volatileStatus: 'confusion',
		},
		target: "any",
		type: "Steel",
	},
	// Death on Wings
	monoflying: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "monoflying",
		isNonstandard: true,
		name: "Mono Flying",
		pp: 20,
		priority: 0,
		flags: {mirror: 1, gravity: 1},
		onHit: function (target, source) {
			if (this.pseudoWeather['monoflying']) {
				this.removePseudoWeather('monoflying', source);
			} else {
				this.addPseudoWeather('monoflying', source);
			}
		},
		effect: {
			duration: 5,
			onStart: function () {
				this.add('message', 'All active Pokemon became pure Flying-type!');
				// Only aesthetic; actual implementation below
				for (let s in this.sides) {
					const thisSide = this.sides[s];
					for (let p in thisSide.active) {
						const pokemon = thisSide.active[p];
						if ((pokemon.types[0] === 'Flying' && !pokemon.types[1]) || !pokemon.hp) continue;
						pokemon.setType('Flying', true);
						this.add('-start', pokemon, 'typechange', 'Flying');
					}
				}
			},
			onResidualOrder: 90,
			onUpdate: function (pokemon) {
				if ((pokemon.types[0] === 'Flying' && !pokemon.types[1]) || !pokemon.hp) return;
				pokemon.setType('Flying', true);
				this.add('-start', pokemon, 'typechange', 'Flying');
			},
			onSwitchIn: function (pokemon) {
				if ((pokemon.types[0] === 'Flying' && !pokemon.types[1]) || !pokemon.hp) return;
				pokemon.setType('Flying', true);
				this.add('-start', pokemon, 'typechange', 'Flying');
			},
			onEnd: function () {
				this.add('message', 'Active Pokemon are no longer forced to be pure Flying-type.');
				for (let s in this.sides) {
					const thisSide = this.sides[s];
					for (let p in thisSide.active) {
						const pokemon = thisSide.active[p];
						if ((pokemon.types[0] === 'Flying' && !pokemon.types[1]) || !pokemon.hp) continue;
						pokemon.setType(pokemon.template.types, true);
						this.add('-end', pokemon, 'typechange');
					}
				}
			},
		},
		secondary: false,
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Defog", source);
		},
		target: "self",
		type: "Flying",
	},
	// gangnam style
	motherfathergentleman: {
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		id: "motherfathergentleman",
		isNonstandard: true,
		name: "Mother, Father, Gentleman",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		multihit: 3,
		secondary: false,
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Agility", source);
			this.add('-anim', source, "Sky Drop", source);
		},
		target: "normal",
		type: "Dark",
	},
	// Overneat
	neattokick: {
		accuracy: 90,
		basePower: 130,
		category: "Physical",
		id: "neattokick",
		isNonstandard: true,
		isViable: true,
		name: "Neatto Kick",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, gravity: 1},
		hasCustomRecoil: true,
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "High Jump Kick", target);
		},
		onMoveFail: function (target, source) {
			this.damage(source.maxhp / 2, source, source, 'highjumpkick');
		},
		secondary: {
			chance: 50,
			status: 'par',
		},
		target: "normal",
		type: "Fighting",
	},
	// Acast
	needsmorescreens: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "needsmorescreens",
		isNonstandard: true,
		isViable: true,
		name: "Needs More Screens",
		pp: 5,
		noPPBoosts: true,
		priority: 0,
		self: {volatileStatus: 'magiccoat'},
		flags: {},
		onPrepareHit: function () {
			this.attrLastMove('[still]');
		},
		onHit: function (target, source) {
			source.side.addSideCondition('reflect', source);
			source.side.addSideCondition('lightscreen', source);
			source.side.addSideCondition('safeguard', source);
		},
		secondary: false,
		target: "self",
		type: "Normal",
	},
	// Level 51
	nextlevelstrats: {
		accuracy: true,
		category: "Status",
		id: "nextlevelstrats",
		isNonstandard: true,
		name: "Next Level Strats",
		pp: 5,
		noPPBoosts: true,
		priority: 0,
		flags: {protect: 1, mirror: 1, snatch: 1},
		boosts: {spe: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Follow Me", target);
		},
		onTryHit: function (pokemon) {
			if (pokemon.level >= 200) return false;
		},
		onHit: function (pokemon) {
			pokemon.level += 10;
			if (pokemon.level > 200) pokemon.level = 200;
			this.add('-message', 'Level 51 advanced 10 levels! It is now level ' + pokemon.level + '!');
		},
		secondary: false,
		target: "self",
		type: "Normal",
	},
	// Golui
	notfriezaenough: {
		accuracy: 100,
		basePower: 120,
		category: "Special",
		id: "notfriezaenough",
		isViable: true,
		isNonstandard: true,
		name: "Not Frieza Enough",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onEffectiveness: function (typeMod, type) {
			if (type === 'Water') return 1;
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Sheer Cold", target);
		},
		onHit: function () {
			this.setWeather('Hail');
		},
		secondary: {
			chance: 10,
			status: 'frz',
		},
		self: {
			boosts: {
				spa: -1,
				spd: -1,
			},
		},
		target: "normal",
		type: "Ice",
	},
	// McMeghan
	oddpunch: {
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		id: "oddpunch",
		isNonstandard: true,
		name: "Odd Punch",
		pp: 15,
		priority: 1,
		flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Bullet Punch", target);
		},
		secondary: {
			chance: 100,
			onHit: function (target, source) {
				if (this.random(10) < 7) target.trySetStatus('par');
				if (this.random(10) < 4) target.addVolatile('flinch', source);
			},
		},
		target: "normal",
		type: "Fighting",
	},
	// uselesstrainer
	ofcurse: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "ofcurse",
		isNonstandard: true,
		isViable: true,
		name: "Of Curse",
		pp: 40,
		priority: 0,
		flags: {authentic: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Torment", source);
			this.add('-anim', source, "Grudge", source);
			this.add('-anim', source, "Explosion", source);
		},
		effect: {
			duration: 2,
			onStart: function (pokemon) {
				this.add('-start', pokemon, 'Of Curse');
				this.add('message', 'Of curse you cannot switch.');
			},
			onEnd: function (pokemon) {
				this.add('-end', pokemon, 'Of Curse');
			},
			onTrapPokemon: function (pokemon) {
				pokemon.tryTrap();
			},
		},
		boosts: {
			atk: -2,
			spa: -2,
		},
		selfdestruct: true,
		secondary: false,
		target: "normal",
		type: "Ghost",
	},
	// starry
	oh: {
		accuracy: 100,
		category: "Status",
		id: "oh",
		isNonstandard: true,
		name: "oh",
		pp: 30,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		boosts: {atk: -1, spa: -1},
		self: {boosts: {spe: 1}},
		secondary: false,
		target: "normal",
		type: "Dark",
	},
	// ajhockeystar
	ohcanada: {
		accuracy: 55,
		category: "Status",
		id: "ohcanada",
		isNonstandard: true,
		isViable: true,
		name: "OH CANADA",
		pp: 35,
		priority: 0,
		flags: {reflectable: 1, protect: 1, mirror: 1},
		secondary: false,
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Icy Wind", target);
			this.add('-anim', source, "Haze", source);
		},
		onHit: function (target, source) {
			if (target.setStatus('frz')) {
				this.add('-message', source.name + " has become trapped in sticky maple syrup!");
				this.boost({spe: -2}, source, source);
			}
		},
		onMoveFail: function (target, source) {
			this.add('-message', source.name + " has become trapped in sticky maple syrup!");
			this.boost({spe: -1}, source, source);
		},
		target: 'normal',
		type: "Ice",
	},
	// Andy (AndrewGoncel)
	pilfer: {
		accuracy: true,
		basePower: 70,
		category: "Physical",
		id: "pilfer",
		isNonstandard: true,
		name: "Pilfer",
		pp: 15,
		priority: 1,
		flags: {protect: 1, authentic: 1},
		onTryHit: function (target, pokemon) {
			let decision = this.willMove(target);
			if (decision) {
				let noMeFirst = {
					mefirst:1,
				};
				let move = this.getMoveCopy(decision.move.id);
				if (move.category === 'Status' && !noMeFirst[move]) {
					this.useMove(move, pokemon);
					this.attrLastMove('[still]');
					this.add('-anim', pokemon, "Night Slash", target);
					return;
				}
			}
			return false;
		},
		secondary: false,
		pressureTarget: "foeSide",
		target: "normal",
		type: "Dark",
	},
	// sparktrain
	pillfrenzy: {
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		id: "pillfrenzy",
		isViable: true,
		isNonstandard: true,
		name: "Pill Frenzy",
		pp: 30,
		priority: 0,
		flags: {bullet: 1, protect: 1, mirror: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Spike Cannon", target);
		},
		multihit: [2, 5],
		secondary: {
			chance: 100,
			self: {
				boosts: {
					spe: 1,
					evasion: -1,
				},
			},
		},
		target: "normal",
		type: "Water",
	},
	// Layell
	pixelprotection: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "pixelprotection",
		isViable: true,
		isNonstandard: true,
		name: "Pixel Protection",
		pp: 10,
		priority: 4,
		flags: {},
		stallingMove: true,
		volatileStatus: 'protect',
		self: {boosts: {def:4, spd:2}},
		onPrepareHit: function (pokemon) {
			return !!this.willAct() && this.runEvent('StallMove', pokemon);
		},
		onTryHit: function (pokemon) {
			if (pokemon.volatiles['pixels']) {
				this.add('-hint', "Pixel Protection only works once per outing.");
				return false;
			}
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Moonblast", pokemon);
			return !!this.willAct() && this.runEvent('StallMove', pokemon);
		},
		onHit: function (pokemon) {
			if (pokemon.volatiles['pixels']) return false;
			pokemon.addVolatile('pixels');
			pokemon.addVolatile('stall');
		},
		effect: {
			duration: 1,
			onStart: function (target) {
				this.add('-singleturn', target, 'Protect');
			},
			onTryHitPriority: 3,
			onTryHit: function (target, source, move) {
				if (!move.flags['protect']) return;
				this.add('-activate', target, 'Protect');
				let lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				return null;
			},
		},
		secondary: false,
		target: "self",
		type: "Normal",
	},
	// Megazard
	playdead: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		id: "playdead",
		isNonstandard: true,
		name: "Play Dead",
		pp: 25,
		priority: -3,
		flags: {},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Grudge", target);
		},
		volatileStatus: 'playdead',
		effect: {
			duration: 3,
			onStart: function (pokemon) {
				this.add('-start', pokemon, 'Play Dead');
				this.add('message', 'Playing Dead causes its moves to all turn into Ghost-type!');
			},
			onModifyMove: function (move) {
				if (move.id !== 'struggle') {
					move.type = 'Ghost';
				}
			},
			onEnd: function (pokemon) {
				this.add('-end', pokemon, 'Play Dead');
			},
		},
		secondary: false,
		target: "normal",
		type: "Fairy",
	},
	// AM
	predator: {
		accuracy: 100,
		basePower: 40,
		basePowerCallback: function (pokemon, target) {
			if (target.beingCalledBack) {
				return 120;
			}
			return 60;
		},
		category: "Physical",
		id: "predator",
		isNonstandard: true,
		isViable: true,
		name: "Predator",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		boosts: {atk:-1, spa:-1, accuracy:-2},
		beforeTurnCallback: function (pokemon, target) {
			target.side.addSideCondition('predator', pokemon);
			if (!target.side.sideConditions['predator'].sources) {
				target.side.sideConditions['predator'].sources = [];
			}
			target.side.sideConditions['predator'].sources.push(pokemon);
		},
		onModifyMove: function (move, source, target) {
			if (target && target.beingCalledBack) move.accuracy = true;
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Pursuit", target);
		},
		onTryHit: function (target, pokemon) {
			target.side.removeSideCondition('predator');
		},
		effect: {
			duration: 1,
			onBeforeSwitchOut: function (pokemon) {
				this.debug('Pursuit start');
				let sources = this.effectData.sources;
				this.add('-activate', pokemon, 'move: Pursuit');
				for (let i = 0; i < sources.length; i++) {
					if (sources[i].moveThisTurn || sources[i].fainted) continue;
					this.cancelMove(sources[i]);
					// Run through each decision in queue to check if the Pursuit user is supposed to Mega Evolve this turn.
					// If it is, then Mega Evolve before moving.
					if (sources[i].canMegaEvo) {
						for (let j = 0; j < this.queue.length; j++) {
							if (this.queue[j].pokemon === sources[i] && this.queue[j].choice === 'megaEvo') {
								this.runMegaEvo(sources[i]);
								break;
							}
						}
					}
					this.runMove('predator', sources[i], pokemon);
				}
			},
		},
		secondary: false,
		target: "normal",
		type: "Dark",
	},
	// Blitzamirin
	pneumarelinquish: {
		accuracy: 100,
		basePower: 0,
		damageCallback: function (source, target) {
			return target.hp / 2;
		},
		category: "Special",
		id: "pneumarelinquish",
		isNonstandard: true,
		isViable: true,
		name: "Pneuma Relinquish",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, heal: 1},
		drain: [3, 4],
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Roar of Time", target);
		},
		secondary: {
			chance: 100,
			volatileStatus: 'gastroacid',
		},
		target: "normal",
		type: "Ghost",
	},
	// Antemortem
	postmortem: {
		accuracy: 85,
		basePower: 110,
		category: "Special",
		id: "postmortem",
		isNonstandard: true,
		name: "Postmortem",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, heal: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Moonblast", target);
		},
		secondary: {chance: 50, self: {boosts: {spa: 1, spe: 1}}},
		target: "normal",
		type: "Fairy",
	},
	// rssp1
	praiserufflets: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "praiserufflets",
		isViable: true,
		isNonstandard: true,
		name: "Praise Rufflets",
		pp: 40,
		priority: 4,
		flags: {},
		volatileStatus: 'protect',
		onPrepareHit: function (pokemon) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Growth", pokemon);
			return !!this.willAct();
		},
		onTry: function (pokemon) {
			if (pokemon.activeTurns > 1) {
				this.add('-fail', pokemon);
				this.add('-hint', "Praise Rufflets only works on your first turn out.");
				return null;
			}
		},
		boosts: {
			atk: 2,
			def: 2,
		},
		secondary: false,
		target: "self",
		type: "Flying",
	},
	// Haund
	psychokinesis: {
		accuracy: 100,
		basePower: 90,
		category: "Special",
		id: "psychokinesis",
		isNonstandard: true,
		isViable: true,
		name: "Psychokinesis",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Aura Sphere", target);
		},
		secondary: {
			chance: 100,
			onHit: function (target, source) {
				let stolen = false;
				for (let boost in target.boosts) {
					if (target.boosts[boost] > 0) {
						stolen = true;
						source.boosts[boost] += target.boosts[boost];
						if (source.boosts[boost] > 6) source.boosts[boost] = 6;
						target.boosts[boost] = 0;
						this.add('-setboost', source, boost, source.boosts[boost]);
						this.add('-setboost', target, boost, target.boosts[boost]);
					}
				}
				if (stolen) {
					this.add('-message', "Boosts were psychokinetically stolen!");
				}
			},
		},
		target: "normal",
		type: "Fighting",
	},
	// Zero Lux Given
	punray: {
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		id: "punray",
		isNonstandard: true,
		isViable: true,
		name: "Pun Ray",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1, distance: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Freeze Shock", target);
		},
		secondary: {
			chance: 100,
			volatileStatus: 'confusion',
		},
		target: "any",
		type: "Flying",
	},
	// Pikachuun
	pureskill: {
		accuracy: true,
		basePower: 0,
		category: "Special",
		id: "pureskill",
		isNonstandard: true,
		isViable: true,
		name: "Pure Skill",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onModifyMove: function (move) {
			move.type = "???";
			const rand = this.random(20);
			if (rand < 9) {
				move.damageCallback = function (source, target) {
					return Math.max(target.hp / 2, target.maxhp / 4);
				};
			} else if (rand < 11) {
				move.onHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Explosion", target);
					this.damage(source.maxhp, source, source);
					if (toId(source.name) === 'pikachuun') {
						this.add('c|+Pikachuun|i\'ve been outskilled');
					}
					return true;
				};
			} else {
				move.basePower = 255;
				move.self = {boosts: {spa: -1, accuracy: -1}};
			}
		},
		secondary: false,
		target: "normal",
		type: "Normal",
	},
	// Raseri
	purifysoul: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "purifysoul",
		isNonstandard: true,
		isViable: true,
		name: "Purify Soul",
		pp: 10,
		priority: 0,
		flags: {snatch: 1, heal: 1},
		heal: [1, 2],
		boosts: {spa:1, spd:1},
		secondary: false,
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Dazzling Gleam", source);
		},
		target: "self",
		type: "Normal",
	},
	// Duck
	quattack: {
		accuracy: 95,
		basePower: 95,
		category: "Physical",
		id: "quattack",
		isNonstandard: true,
		isViable: true,
		name: "QUAttaCK",
		pp: 5,
		priority: 1,
		critRatio: 2,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Quick Attack", target);
		},
		secondary: false,
		target: "normal",
		type: "Normal",
	},
	// Innovamania
	ragequit: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "ragequit",
		isNonstandard: true,
		name: "Rage Quit",
		pp: 40,
		priority: 0,
		flags: {gravity: 1},
		onHit: function (pokemon) {
			pokemon.faint();
		},
		secondary: false,
		target: "self",
		type: "Normal",
	},
	// DMT
	reallybigswordsdance: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Attack by 2 stages.",
		shortDesc: "Raises the user's Attack by 2.",
		id: "reallybigswordsdance",
		isNonstandard: true,
		isViable: true,
		name: "Really Big Swords Dance",
		pp: 20,
		priority: 0,
		flags: {snatch: 1},
		boosts: {atk: 4},
		secondary: false,
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Growth", source);
			this.add('-anim', source, "Swords Dance", source);
			this.add('-anim', source, "Swords Dance", source);
		},
		target: "self",
		type: "Normal",
	},
	// Zarel
	relicsongdance: {
		accuracy: 100,
		basePower: 60,
		multihit: 2,
		category: "Special",
		id: "relicsongdance",
		isViable: true,
		isNonstandard: true,
		name: "Relic Song Dance",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1, authentic: 1},
		negateSecondary: true,
		affectedByImmunities: false,
		onTryHit: function (target, pokemon) {
			this.attrLastMove('[still]');
			let move = pokemon.template.speciesid === 'meloettapirouette' ? 'Brick Break' : 'Relic Song';
			this.add('-anim', pokemon, move, target);
		},
		onHit: function (target, pokemon, move) {
			if (pokemon.template.speciesid === 'meloettapirouette' && pokemon.formeChange('Meloetta')) {
				this.add('-formechange', pokemon, 'Meloetta', '[msg]');
			} else if (pokemon.formeChange('Meloetta-Pirouette')) {
				this.add('-formechange', pokemon, 'Meloetta-Pirouette', '[msg]');
				// Modifying the move outside of the ModifyMove event? BLASPHEMY
				move.category = 'Physical';
				move.type = 'Fighting';
			}
		},
		onAfterMove: function (pokemon) {
			// Ensure Meloetta goes back to standard form after using the move
			if (pokemon.template.speciesid === 'meloettapirouette' && pokemon.formeChange('Meloetta')) {
				this.add('-formechange', pokemon, 'Meloetta', '[msg]');
			}
		},
		effect: {
			duration: 1,
			onAfterMoveSecondarySelf: function (pokemon, target, move) {
				if (pokemon.template.speciesid === 'meloettapirouette' && pokemon.formeChange('Meloetta')) {
					this.add('-formechange', pokemon, 'Meloetta', '[msg]');
				} else if (pokemon.formeChange('Meloetta-Pirouette')) {
					this.add('-formechange', pokemon, 'Meloetta-Pirouette', '[msg]');
				}
				pokemon.removeVolatile('relicsong');
			},
		},
		target: "allAdjacentFoes",
		type: "Psychic",
	},
	// Quite Quiet
	retreat: {
		accuracy: 100,
		basePower: 60,
		category: "Special",
		id: "retreat",
		isNonstandard: true,
		isViable: true,
		name: "Retreat",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onEffectiveness: function (typeMod, type, move) {
			return 1;
		},
		selfSwitch: true,
		secondary: false,
		ignoreImmunity: true,
		target: "normal",
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Volt Switch", target);
		},
		type: "Electric",
	},
	// Jasmine
	reversetransform: {
		accuracy: true,
		category: "Status",
		id: "reversetransform",
		isNonstandard: true,
		name: "Reverse Transform",
		pp: 1,
		noPPBoosts: true,
		priority: 0,
		flags: {protect: 1, mirror: 1, authentic: 1},
		onHit: function (target, source) {
			if (!target.transformInto(source, target)) {
				return false;
			}
			target.canMegaEvo = false;
		},
		target: "normal",
		type: "Normal",
	},
	// macle
	ribbit: {
		accuracy: true,
		basePower: 90,
		category: "Physical",
		id: "ribbit",
		isNonstandard: true,
		isViable: true,
		name: "Ribbit",
		pp: 40,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1, authentic: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Boomburst", target);
			if (source.name === 'macle') {
				this.add("c|+macle|Follow the Frog Blog - https://gonefroggin.wordpress.com/");
			}
		},
		secondary: {
			chance: 100,
			onHit: function (pokemon) {
				let oldAbility = pokemon.setAbility('soundproof');
				if (oldAbility) {
					this.add('-endability', pokemon, oldAbility, '[from] move: Ribbit');
					this.add('-ability', pokemon, 'Soundproof', '[from] move: Ribbit');
					return;
				}
			},
		},
		target: "normal",
		type: "Water",
	},
	// Starmei
	rkoouttanowhere: {
		accuracy: 100,
		basePower: 0,
		damageCallback: function (pokemon) {
			return (this.random(50, 151) * pokemon.level) / 100;
		},
		category: "Special",
		id: "rkoouttanowhere",
		isNonstandard: true,
		name: "RKO Outta Nowhere",
		pp: 35,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Surf", target);
		},
		secondary: false,
		target: "normal",
		type: "Water",
	},
	// Trickster
	sacredspearexplosion: {
		accuracy: 100,
		basePower: 100,
		category: "Special",
		desc: "No additional effect.",
		shortDesc: "No additional effect. Hits adjacent foes.",
		id: "sacredspearexplosion",
		isNonstandard: true,
		isViable: true,
		name: "Sacred Spear Explosion",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Megahorn", target);
			this.add('-anim', target, "Explosion", source);
			// Resets sprite after explosion
			this.add('-formechange', target, target.template.species, '');
		},
		onEffectiveness: function (typeMod, type, move) {
			return typeMod + this.getEffectiveness('Steel', type);
		},
		secondary: {chance: 30, status: 'brn'},
		target: "allAdjacentFoes",
		type: "Fairy",
	},
	// Halite
	saltstorm: {
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		id: "saltstorm",
		isViable: true,
		isNonstandard: true,
		name: "Saltstorm",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Icy Wind", target);
		},
		selfSwitch: true,
		self: {sideCondition: 'saltstorm'},
		effect: {
			onSwitchIn: function (pokemon) {
				pokemon.side.removeSideCondition('saltstorm');
			},
			onResidual: function (side) {
				if (side.active.length && side.active[0].hp) side.removeSideCondition('saltstorm');
			},
			onEnd: function (side) {
				if (!(side.active.length && side.active[0].hp)) return;
				const pokemon = side.active[0];
				pokemon.addVolatile('saltguard');
				pokemon.addVolatile('focusenergy');
			},
		},
		secondary: false,
		target: "normal",
		type: "Ice",
	},
	// Freeroamer
	screwthismatchup: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "screwthismatchup",
		isNonstandard: true,
		isViable: true,
		name: "Screw This Matchup",
		pp: 5,
		priority: 0,
		flags: {},
		boosts: {atk: 2},
		secondary: false,
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Barrier", source);
		},
		onHit: function (target, source) {
			if (!source.types[1]) return true;
			const foes = source.side.foe.active;
			if (foes.length && foes[0].hp) {
				const opponent = foes[0];
				if (opponent.types[0] === source.types[1]) {
					source.setType(source.types[0], true);
					this.add('-start', source, 'typechange', source.types[0]);
				} else if (opponent.types[0] === source.types[0]) {
					if (opponent.types[1]) {
						if (opponent.types[1] === source.types[1]) {
							opponent.setType(source.types[1], true);
							this.add('-start', opponent, 'typechange', opponent.types[0]);
						} else {
							opponent.types = [source.types[1], opponent.types[1]];
							this.add('-start', opponent, 'typechange', opponent.types[0] + '/' + opponent.types[1]);
						}
					} else {
						opponent.setType(source.types[1], true);
						this.add('-start', opponent, 'typechange', opponent.types[0]);
					}
					source.setType(source.types[0], true);
					this.add('-start', source, 'typechange', source.types[0]);
				} else {
					const mytype = source.types[1];
					source.types = [source.types[0], opponent.types[0]];
					this.add('-start', source, 'typechange', source.types[0] + '/' + source.types[1]);
					if (opponent.types[1]) {
						if (opponent.types[1] === mytype) {
							opponent.setType(mytype, true);
							this.add('-start', opponent, 'typechange', opponent.types[0]);
						} else {
							opponent.types = [mytype, opponent.types[1]];
							this.add('-start', opponent, 'typechange', opponent.types[0] + '/' + opponent.types[1]);
						}
					} else {
						opponent.setType(mytype, true);
						this.add('-start', opponent, 'typechange', opponent.types[0]);
					}
				}
			}
		},
		target: "self",
		type: "Normal",
	},
	// Lemonade
	seemsgood: {
		accuracy: 100,
		basePower: 0,
		basePowerCallback: function (pokemon, target) {
			let targetWeight = target.getWeight();
			if (targetWeight >= 200) {
				return 120;
			}
			if (targetWeight >= 100) {
				return 100;
			}
			if (targetWeight >= 50) {
				return 80;
			}
			if (targetWeight >= 25) {
				return 60;
			}
			if (targetWeight >= 10) {
				return 40;
			}
			return 20;
		},
		category: "Physical",
		id: "seemsgood",
		isViable: true,
		isNonstandard: true,
		name: "Seems Good",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Low Kick", target);
		},
		secondary: false,
		target: "normal",
		type: "Fighting",
	},
	// f(x)
	shakethatbrass: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "shakethatbrass",
		isNonstandard: true,
		name: "shake that brass",
		pp: 20,
		priority: 0,
		onTryHit: function (target, pokemon) {
			const moveSet = pokemon.moveset.map(x => x.id).filter(x => x !== 'shakethatbrass');
			const move = moveSet[this.random(moveSet.length)];
			pokemon.addVolatile('shakethatbrass');
			this.useMove(move, pokemon, target);
			return null;
		},
		flags: {protect: 1, authentic: 1},
		effect: {
			duration: 1,
			onBasePowerPriority: 4,
			onBasePower: function (basePower) {
				return this.chainModify(1.5);
			},
			onAccuracy: function (accuracy) {
				return 100;
			},
		},
		secondary: false,
		target: "adjacentFoe",
		type: "Normal",
	},
	// Legitimate Username
	shellfortress: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "shellfortress",
		isNonstandard: true,
		isViable: true,
		name: "Shell Fortress",
		pp: 15,
		priority: 0,
		flags: {snatch: 1},
		boosts: {def:2, spd:2, atk:-4, spa:-4, spe:-4},
		secondary: false,
		target: "self",
		type: "Normal",
	},
	// GeoffBruedly
	shitpostparadise: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "shitpostparadise",
		isNonstandard: true,
		name: "Shitpost Paradise",
		pp: 10,
		priority: 0,
		flags: {mirror: 1},
		onHitField: function (target, source, effect) {
			if (this.pseudoWeather['shitpostparadise']) {
				this.removePseudoWeather('shitpostparadise', source, effect, '[of] ' + source);
			} else {
				this.addPseudoWeather('shitpostparadise', source, effect, '[of] ' + source);
			}
		},
		effect: {
			duration: 5,
			onStart: function (target, source) {
				this.add('-fieldstart', 'move: Shitpost Paradise', '[silent]');
				this.add('message', 'Female Pokemon have gained additional priority to their moves!');
			},
			onResidualOrder: 25,
			onEnd: function () {
				this.add('-fieldend', 'move: Shitpost Paradise', '[silent]');
				this.add('message', 'The altered priorities returned to normal.');
			},
			onModifyPriority: function (priority, pokemon, target, move) {
				if (pokemon && pokemon.gender === 'F') {
					return priority + 2;
				}
			},
		},
		secondary: false,
		target: "all",
		type: "Psychic",
	},
	// Orda-Y
	shockswitch: {
		accuracy: 100,
		basePower: 90,
		category: "Special",
		id: "shockswitch",
		isViable: true,
		isNonstandard: true,
		name: "Shock Switch",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Ice Beam", target);
		},
		selfSwitch: true,
		forceSwitch: true,
		secondary: false,
		target: "normal",
		type: "Ice",
	},
	// The Immortal
	sleepwalk: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "sleepwalk",
		isNonstandard: true,
		isViable: true,
		name: "Sleep Walk",
		pp: 10,
		priority: 0,
		flags: {},
		sleepUsable: true,
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Healing Wish", target);
		},
		onHit: function (pokemon, source) {
			if (pokemon.status !== 'slp') {
				if (pokemon.hp >= pokemon.maxhp) return false;
				if (!pokemon.setStatus('slp')) return false;
				pokemon.statusData.time = 3;
				pokemon.statusData.startTime = 3;
				this.heal(pokemon.maxhp);
				this.add('-status', pokemon, 'slp', '[from] move: Rest');
			}
			let moves = [];
			for (let i = 0; i < pokemon.moveset.length; i++) {
				let move = pokemon.moveset[i].id;
				if (move && move !== 'sleepwalk') moves.push(move);
			}
			let move = '';
			if (moves.length) move = moves[this.random(moves.length)];
			if (!move) return false;
			this.useMove(move, pokemon);
			if (!pokemon.informed && source.name === 'The Immortal') {
				this.add('c|~The Immortal|I don\'t really sleep walk...');
				pokemon.informed = true;
			}
		},
		secondary: false,
		target: "self",
		type: "Normal",
	},
	// Scyther NO Swiping
	sniperswipes: {
		accuracy: true,
		basePower: 35,
		category: "Physical",
		id: "sniperswipes",
		isNonstandard: true,
		name: "Sniper Swipes",
		pp: 10,
		priority: 0,
		critRatio: 2,
		flags: {contact: 1, protect: 1, mirror: 1},
		onBeforeMove: function (source, target, move) {
			move.hits = 0;
		},
		onTryHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "X-Scissor", target);
			move.hits++;
		},
		onAfterMoveSecondarySelf: function (source, target, move) {
			if (move.hits && move.hits === 3 && toId(source.name) === 'scythernoswiping') {
				this.add('c|%Scyther NO Swiping|Oh baby a triple!!!');
			}
		},
		onEffectiveness: function (typeMod) {
			return -typeMod;
		},
		multihit: 3,
		hits: 0,
		target: "normal",
		type: "Bug",
	},
	// HiMyNamesL
	solarstorm: {
		accuracy: 100,
		basePower: 120,
		category: "Special",
		id: "solarstorm",
		isViable: true,
		isNonstandard: true,
		name: "Solar Storm",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryHit: function () {
			this.setWeather("sunnyday");
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Solar Beam', target);
			this.add('-anim', target, 'Overheat', target);
		},
		self: {
			volatileStatus: 'lockedmove',
		},
		onAfterMove: function (pokemon) {
			if (pokemon.volatiles['lockedmove'] && pokemon.volatiles['lockedmove'].duration === 1) {
				pokemon.removeVolatile('lockedmove');
			}
		},
		secondary: false,
		target: "randomNormal",
		type: "Fire",
	},
	// Hannah
	sparklerain: {
		accuracy: 100,
		basePower: 75,
		category: "Special",
		id: "sparklerain",
		isNonstandard: true,
		isViable: true,
		name: "Sparkle Rain",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Misty Terrain', target);
			this.add('-anim', source, 'Powder', target);
		},
		onEffectiveness: function (typeMod, type) {
			return typeMod + this.getEffectiveness('Fire', type);
		},
		secondary: {
			chance: 30,
			status: 'slp',
		},
		target: "normal",
		type: "Normal",
	},
	// Ascriptmaster
	spectrumtripletbeam: {
		accuracy: 100,
		basePower: 30,
		stab: 1,
		category: "Special",
		id: "spectrumtripletbeam",
		isNonstandard: true,
		isViable: true,
		name: "Spectrum Triplet Beam",
		pp: 30,
		priority: 0,
		multihit: 3,
		flags: {protect: 1, mirror: 1},
		typechart: [
			'Bug', 'Dark', 'Dragon', 'Electric', 'Fairy', 'Fighting',
			'Fire', 'Flying', 'Ghost', 'Grass', 'Ground', 'Ice',
			'Normal', 'Poison', 'Psychic', 'Rock', 'Steel', 'Water',
		],
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[anim] Tri Attack');
			move.types = move.typechart.slice();
			Tools.shuffle(move.types);
			move.types.splice(3);
			this.add("c|@Ascriptmaster|Go! " + move.types.join(', ') + "! Spectrum Triplet Beam!!!");
			move.hitcount = 0;
		},
		onTryHit: function (target, source, move) {
			move.type = move.types[move.hitcount++];
		},
		willCrit: true,
		ignoreImmunity: true,
		secondary: false,
		target: "allAdjacentFoes",
		type: "Normal",
	},
	// Bummer
	speedpaint: {
		accuracy: true,
		category: "Status",
		id: "speedpaint",
		isNonstandard: true,
		name: "Speedpaint",
		pp: 10,
		priority: 1,
		flags: {protect: 1, authentic: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Agility", target);
		},
		onTryHit: function (target, pokemon) {
			let decision = this.willMove(target);
			if (decision && !(decision.move.id === 'speedpaint')) {
				let noMeFirst = {
					chatter:1, counter:1, covet:1, focuspunch:1, mefirst:1, metalburst:1, mirrorcoat:1, struggle:1, thief:1,
				};
				let move = this.getMoveCopy(decision.move.id);
				if (!noMeFirst[move]) {
					this.useMove(move, pokemon, target);
					return null;
				}
			}
			return false;
		},
		secondary: false,
		pressureTarget: "foeSide",
		target: "normal",
		type: "Normal",
	},
	// unfixable
	spikeyrain: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "spikeyrain",
		isNonstandard: true,
		name: "SPIKEY RAIN",
		pp: 10,
		priority: 0,
		terrain: 'spikeyrain',
		flags: {},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Grassy Terrain", source);
			this.add('-anim', source, "Spikes", source);
			this.add('-anim', source, "Grassy Terrain", source);
		},
		effect: {
			duration: 5,
			onBasePower: function (basePower, attacker, defender, move) {
				if (move.type === 'Grass') {
					return this.chainModify(1.5);
				}
			},
			onModifyPriority: function (priority, pokemon, target, move) {
				if (move && move.type === 'Grass') {
					return priority + 2;
				}
			},
			onModifyDef: function (def, pokemon) {
				if (pokemon.hasType('Grass')) {
					return this.chainModify(1.5);
				}
			},
			onModifySpD: function (spd, pokemon) {
				if (pokemon.hasType('Grass')) {
					return this.chainModify(1.5);
				}
			},
			onStart: function () {
				this.add('-fieldstart', 'move: Spikey Rain');
				this.add('message', 'Cactus spikes pour down from the heavens, boosting Grass-type moves, granting them priority, and shielding Grass-type Pokemon!');
			},
			onEnd: function () {
				this.add('-fieldend', 'move: Spikey Rain');
			},
		},
		secondary: false,
		target: "all",
		type: "Grass",
	},
	// bludz
	splatter: {
		accuracy: 100,
		basePower: 200,
		category: "Special",
		id: "splatter",
		isViable: true,
		isNonstandard: true,
		name: "Splatter",
		pp: 40,
		priority: 1,
		flags: {protect: 1, mirror: 1},
		selfdestruct: true,
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Explosion", source);
			this.add('-anim', target, "Rototiller", target);
		},
		volatileStatus: 'splatter',
		effect: {
			duration: 2,
			onStart: function (pokemon) {
				this.add('-start', pokemon, 'Splatter');
				this.add('message', 'The sticky splatter prevents switching!');
				this.boost({spe: -1}, pokemon);
			},
			onEnd: function (pokemon) {
				this.add('-end', pokemon, 'Splatter');
			},
			onTrapPokemon: function (pokemon) {
				pokemon.tryTrap();
			},
		},
		secondary: false,
		target: "allAdjacentFoes",
		type: "Bug",
	},
	// Jack Higgins
	splinters: {
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		id: "splinters",
		isViable: true,
		isNonstandard: true,
		name: "Splinters",
		pp: 10,
		multihit: 3,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Spikes", target);
		},
		onHit: function (target, source, move) {
			target.side.addSideCondition(['spikes', 'toxicspikes'][this.random(2)], source, move);
		},
		onAfterMove: function (source, target) {
			target.addVolatile('splinters', source);
		},
		effect: {
			onStart: function (target) {
				this.add('message', 'Painful splinters lodged into ' + target.name + '!');
				this.effectData.stage = 1;
			},
			onRestart: function (target) {
				if (this.effectData.stage < 4) {
					this.add('message', 'More painful splinters lodged into ' + target.name + '!');
					this.effectData.stage++;
				}
			},
			onEnd: function (target) {
				this.add('message', 'The splinters were dislodged from ' + target.name + '.');
			},
			onResidualOrder: 98,
			onResidual: function (pokemon) {
				this.damage(this.clampIntRange(pokemon.maxhp / 16, 1) * this.effectData.stage);
			},
		},
		secondary: false,
		target: "normal",
		type: "Rock",
	},
	// Temporaryanonymous
	spoopyedgecut: {
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		id: "spoopyedgecut",
		isViable: true,
		isNonstandard: true,
		name: "SPOOPY EDGE CUT",
		pp: 30,
		priority: 1,
		flags: {contact: 1, protect: 1, mirror: 1},
		onTryHit: function (target, source) {
			this.add('-message', '*@Temporaryanonymous teleports behind you*');
			this.attrLastMove('[still]');
			this.add('-anim', source, "Night Shade", target);
		},
		onHit: function (pokemon) {
			if (pokemon.hp <= 0 || pokemon.fainted) {
				this.add('c|@Temporaryanonymous|YOU ARE ALREADY DEAD *unsheathes glorious cursed nippon steel katana and cuts you in half with it* heh......nothing personnel.........kid......................');
			}
		},
		onMoveFail: function (target, source, move) {
			this.add('-message', '*@Temporaryanonymous teleports behind you*');
			this.add('c|@Temporaryanonymous|YOU ARE ALREADY DEAD *misses* Tch......not bad.........kid......................');
		},
		secondary: false,
		self: {boosts: {accuracy: -2}},
		target: "normal",
		type: "Ghost",
	},
	// Zodiax
	standingfull: {
		accuracy: true,
		basePower: 100,
		category: "Physical",
		id: "standingfull",
		isNonstandard: true,
		name: "Standing Full",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Splash", source);
		},
		secondary: {
			chance: 100,
			onHit: function (target, source) {
				if (target.lastDamage > 0 && source.lastAttackedBy && source.lastAttackedBy.thisTurn && source.lastAttackedBy.pokemon === target) {
					if (this.random(100) < 30) {
						target.addVolatile('confusion');
					}
				} else {
					target.addVolatile('confusion');
				}
			},
		},
		target: "normal",
		type: "Fighting",
	},
	// Astara
	starboltdesperation: {
		accuracy: 75,
		basePower: 0,
		category: "Physical",
		id: "starboltdesperation",
		isViable: true,
		isNonstandard: true,
		name: 'Star Bolt Desperation',
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1},
		typechart: [
			'Bug', 'Dark', 'Dragon', 'Electric', 'Fairy', 'Fighting',
			'Fire', 'Flying', 'Ghost', 'Grass', 'Ground', 'Ice',
			'Normal', 'Poison', 'Psychic', 'Rock', 'Steel', 'Water',
		],
		damageCallback: function (pokemon, target) {
			return target.hp * 0.75;
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Grudge", target);
			this.add('-anim', source, "Dragon Ascent", target);
		},
		onHit: function (target, source) {
			const boosts = {};
			const stats = ['atk', 'def', 'spa', 'spd', 'spe', 'accuracy'];
			const increase = stats[this.random(6)];
			const decrease = stats[this.random(6)];
			boosts[increase] = 1;
			boosts[decrease] = -1;
			this.boost(boosts, source, source);
		},
		onModifyMove: function (move) {
			move.type = move.typechart[this.random(18)];
		},
		secondary: {
			chance: 100,
			onHit: function (target) {
				if (this.random(2) === 1) {
					const status = ['par', 'brn', 'frz', 'psn', 'tox', 'slp'][this.random(6)];
					if (status === 'frz') {
						let freeze = true;
						for (let i = 0; i < target.side.pokemon.length; i++) {
							const pokemon = target.side.pokemon[i];
							if (pokemon.status === 'frz') freeze = false;
						}
						if (freeze) target.trySetStatus('frz');
					} else {
						target.trySetStatus(status);
					}
				}
				if (this.random(2) === 1) target.addVolatile('confusion');
			},
		},
		target: "normal",
		type: "Normal",
	},
	// manu 11
	surskitenergy: {
		accuracy: 95,
		basePower: 130,
		category: "Special",
		id: "surskitenergy",
		isViable: true,
		isNonstandard: true,
		name: "Surskit Energy",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onEffectiveness: function (typeMod, type) {
			return typeMod + this.getEffectiveness('Bug', type);
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Rototiller", target);
			this.add('-anim', source, "Origin Pulse", target);
		},
		secondary: {
			chance: 100,
			sideCondition: 'stickyweb',
		},
		target: "normal",
		type: "Water",
	},
	// RosieTheVenusaur
	swagplant: {
		accuracy: 90,
		basePower: 150,
		category: "Physical",
		id: "swagplant",
		isViable: true,
		isNonstandard: true,
		name: "Swag Plant",
		pp: 5,
		priority: 0,
		flags: {recharge: 1, protect: 1, mirror: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Taunt", target);
			this.add('-anim', source, "Frenzy Plant", target);
		},
		self: {
			volatileStatus: 'mustrecharge',
			boosts: {
				atk: 1,
				def: 1,
			},
		},
		secondary: {
			chance: 100,
			volatileStatus: 'confusion',
		},
		target: "normal",
		type: "Grass",
	},
	// Dream Eater Gengar
	sweetdreams: {
		accuracy: 90,
		basePower: 0,
		category: "Status",
		id: "sweetdreams",
		isViable: true,
		isNonstandard: true,
		name: "Sweet Dreams",
		pp: 25,
		priority: 0,
		flags: {reflectable: 1, protect: 1, mirror: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Dark Void", target);
		},
		onHit: function (target, source) {
			let highcost = false;
			if (target.status !== 'slp') {
				if (!target.trySetStatus("slp", source)) return false;
				highcost = true;
			} else if (target.volatiles["nightmare"] && target.volatiles["sweetdreams"]) {
				return false;
			}
			this.directDamage(this.modify(source.maxhp, (highcost ? 0.5 : 0.25)), source, source);
			target.addVolatile("nightmare");
			target.addVolatile("sweetdreams", source);
		},
		effect: {
			onStart: function (pokemon) {
				if (pokemon.status !== 'slp') {
					return false;
				}
				this.add('-start', pokemon, 'Sweet Dreams');
			},
			onResidualOrder: 8,
			onResidual: function (pokemon) {
				let target = this.effectData.source.side.active[pokemon.volatiles['sweetdreams'].sourcePosition];
				if (!target || target.fainted || target.hp <= 0) {
					return;
				}
				let damage = this.damage(pokemon.maxhp / 8, pokemon, target);
				if (damage) {
					this.heal(damage, target, pokemon);
				}
			},
			onUpdate: function (pokemon) {
				if (pokemon.status !== 'slp') {
					pokemon.removeVolatile('sweetdreams');
					this.add('-end', pokemon, 'Sweet Dreams', '[silent]');
				}
			},
		},
		secondary: {
			chance: 100,
			self: {
				boosts: {def: -1, spd: -1},
			},
		},
		target: "normal",
		type: "Ghost",
	},
	// imas234
	sweg: {
		accuracy: 100,
		basePower: 90,
		category: "Special",
		id: "sweg",
		isViable: true,
		isNonstandard: true,
		name: "Sweg",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Follow Me", target);
			this.add('-anim', source, "Roar of Time", target);
			this.add('-anim', source, "Torment", target);
		},
		onHit: function (target, source) {
			this.boost({atk: 2}, target, source);
			target.addVolatile('confusion', source);
		},
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "normal",
		type: "Dragon",
	},
	// Iyarito
	tomalawey: {
		accuracy: true,
		basePower: 0,
		id: "tomalawey",
		isViable: true,
		isNonstandard: true,
		name: "Tomala wey",
		pp: 5,
		noPPBoosts: true,
		priority: 4,
		flags: {},
		stallingMove: true,
		volatileStatus: 'protect',
		onPrepareHit: function (pokemon) {
			this.attrLastMove('[still]');
			return !!this.willAct() && this.runEvent('StallMove', pokemon);
		},
		onHit: function (pokemon) {
			pokemon.addVolatile('stall');
		},
		boosts: {
			spa: 1,
			spd: 1,
			spe: 1,
		},
		secondary: false,
		target: "self",
		type: "Ground",
	},
	// Articuno
	truesupport: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "truesupport",
		isViable: true,
		isNonstandard: true,
		name: "True Support",
		pp: 10,
		priority: -6,
		flags: {reflectable: 1, mirror: 1, authentic: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Whirlwind", target);
		},
		onHit: function (target) {
			this.useMove('substitute', target);
		},
		forceSwitch: true,
		secondary: false,
		target: "normal",
		type: "Normal",
	},
	// Skitty
	ultimatedismissal: {
		accuracy: 100,
		basePower: 20,
		basePowerCallback: function (pokemon) {
			return 40 + 20 * (Math.log(Math.max(pokemon.positiveBoosts(), 1)) / Math.log(1.5));
		},
		category: "Special",
		id: "ultimatedismissal",
		isNonstandard: true,
		name: "Ultimate Dismissal",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Swift", target);
		},
		onDamage: function (damage, target, source) {
			if (damage > 0) {
				this.heal(Math.ceil((damage * 0.25) * 100 / target.maxhp), source, source);
			}
		},
		secondary: false,
		target: "normal",
		type: "Normal",
	},
	// Sweep
	wave: {
		accuracy: 100,
		basePower: 120,
		category: "Special",
		id: "wave",
		isViable: true,
		isNonstandard: true,
		name: "(wave(",
		pp: 35,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Water Spout", target);
		},
		secondary: {
			chance: 20,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Water",
	},
	// Brandon (Brrandon)
	waveofindifference: {
		accuracy: 95,
		basePower: 140,
		category: "Special",
		id: "waveofindifference",
		isViable: true,
		isNonstandard: true,
		name: "Wave of Indifference",
		pp: 10,
		priority: 0,
		flags: {mirror: 1, protect: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Swift", target);
		},
		onEffectiveness: function () {
			return 0;
		},
		secondary: false,
		target: "normal",
		type: "Psychic",
	},
	// Vapo
	wetwork: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "wetwork",
		isViable: true,
		isNonstandard: true,
		name: "Wetwork",
		pp: 10,
		priority: -7,
		flags: {heal: 1, mirror: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Water Pulse", target);
		},
		onHit: function (target, source) {
			let moved = false;
			if (!this.pseudoWeather['trickroom']) {
				this.addPseudoWeather('trickroom', source);
				moved = true;
			}
			if (source.maxhp !== source.hp) {
				this.heal(this.modify(target.maxhp, 0.4), target, source);
				moved = true;
			}
			if (!moved) return false;
		},
		secondary: false,
		target: "self",
		type: "Water",
	},
	// Solaris Fox
	wonderbark: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "wonderbark",
		isNonstandard: true,
		name: "Wonder Bark",
		pp: 1,
		noPPBoosts: true,
		priority: 3,
		flags: {reflectable: 1, sound: 1, authentic: 1},
		volatileStatus: 'flinch',
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Cosmic Power", target);
			this.add('-anim', source, "Hyper Voice", source);
		},
		onHit: function (pokemon, source) {
			this.add('-message', 'You hear a sound echo across the universe. Things seem different now.');
			let newMoves = ['boomburst', 'flamethrower', 'freezedry', 'thunderbolt', 'steameruption', 'gigadrain', 'bugbuzz',
				'darkpulse', 'psychic', 'shadowball', 'flashcannon', 'dragonpulse', 'moonblast', 'focusblast', 'aeroblast',
				'earthpower', 'sludgebomb', 'paleowave', 'bodyslam', 'flareblitz', 'iciclecrash', 'volttackle', 'waterfall',
				'leafblade', 'xscissor', 'knockoff', 'shadowforce', 'ironhead', 'outrage', 'playrough', 'closecombat',
				'bravebird', 'earthquake', 'stoneedge', 'extremespeed', 'stealthrock', 'spikes', 'toxicspikes', 'stickyweb',
				'quiverdance', 'shellsmash', 'dragondance', 'recover', 'toxic', 'willowisp', 'leechseed',
			];
			for (let i = 0; i < pokemon.moveset.length; i++) {
				let moveData = Tools.getMove(this.sampleNoReplace(newMoves));
				let moveBuffer = {
					move: moveData.name,
					id: moveData.id,
					pp: moveData.pp,
					maxpp: moveData.pp,
					target: moveData.target,
					disabled: false,
					used: false,
				};
				pokemon.moveset[i] = moveBuffer;
				pokemon.baseMoveset[i] = moveBuffer;
				pokemon.moves[i] = toId(moveData.name);
			}
		},
		secondary: false,
		target: "normal",
		type: "Dark",
	},
	// xJoelituh
	xhaxlituh: {
		accuracy: 90,
		basePower: 20,
		category: "Physical",
		id: "xhaxlituh",
		isViable: true,
		isNonstandard: true,
		name: "xHaxlituh",
		pp: 35,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		critRatio: 2,
		multihit: [2, 5],
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Bonemerang", target);
		},
		secondary: {
			chance: 100,
			onHit: function (target, source) {
				if (this.random(20) === 10) {
					const status = ['par', 'brn', 'frz', 'psn', 'tox', 'slp'][this.random(6)];
					let prompt = false;
					if (status === 'frz') {
						let freeze = true;
						for (let i = 0; i < target.side.pokemon.length; i++) {
							const pokemon = target.side.pokemon[i];
							if (pokemon.status === 'frz') freeze = false;
						}
						if (freeze && target.trySetStatus('frz') && toId(source.name) === 'xjoelituh') {
							prompt = true;
						}
					} else if (target.trySetStatus(status) && toId(source.name) === 'xjoelituh') {
						prompt = true;
					}
					if (prompt) {
						this.add('c|+xJoelituh|That didn\'t mattered, I had everything calc\'d');
						this.add('c|+xJoelituh|!calc');
						this.add('raw|<div class="infobox">Pokémon Showdown! damage calculator. (Courtesy of Honko) <br> - <a href="https://pokemonshowdown.com/damagecalc/">Damage Calculator</a></br></div>');
					}
				}
			},
		},
		target: "normal",
		type: "Ground",
	},
	// jdarden
	wyvernswind: {
		accuracy: 90,
		basePower: 80,
		category: "Special",
		id: "wyvernswind",
		isViable: true,
		isNonstandard: true,
		name: "Wyvern's Wind",
		pp: 10,
		priority: -6,
		flags: {protect: 1, mirror: 1},
		forceSwitch: true,
		onTryHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Boomburst", target);
		},
		target: "normal",
		type: "Flying",
	},
	// Frysinger
	zapconfirmed: {
		accuracy: 100,
		basePower: 25,
		category: "Special",
		id: "zapconfirmed",
		isViable: true,
		isNonstandard: true,
		name: "ZAP Confirmed",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		multihit: 4,
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Charge Beam", target);
		},
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "normal",
		type: "Electric",
	},

	// Modified moves
	"defog": {
		inherit: true,
		onHit: function (target, source, move) {
			if (!target.volatiles['substitute'] || move.infiltrates) this.boost({evasion:-1});
			let removeTarget = {reflect:1, lightscreen:1, safeguard:1, mist:1, spikes:1, toxicspikes:1, burnspikes:1, stealthrock:1, stickyweb:1};
			let removeAll = {spikes:1, toxicspikes:1, burnspikes:1, stealthrock:1, stickyweb:1};
			for (let targetCondition in removeTarget) {
				if (target.side.removeSideCondition(targetCondition)) {
					if (!removeAll[targetCondition]) continue;
					this.add('-sideend', target.side, this.getEffect(targetCondition).name, '[from] move: Defog', '[of] ' + target);
				}
			}
			for (let sideCondition in removeAll) {
				if (source.side.removeSideCondition(sideCondition)) {
					this.add('-sideend', source.side, this.getEffect(sideCondition).name, '[from] move: Defog', '[of] ' + source);
				}
			}
		},
	},
	"rapidspin": {
		inherit: true,
		self: {
			onHit: function (pokemon) {
				if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
					this.add('-end', pokemon, 'Leech Seed', '[from] move: Rapid Spin', '[of] ' + pokemon);
				}
				let sideConditions = {spikes:1, toxicspikes:1, burnspikes:1, stealthrock:1, stickyweb:1};
				for (let i in sideConditions) {
					if (pokemon.hp && pokemon.side.removeSideCondition(i)) {
						this.add('-sideend', pokemon.side, this.getEffect(i).name, '[from] move: Rapid Spin', '[of] ' + pokemon);
					}
				}
				if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
					pokemon.removeVolatile('partiallytrapped');
				}
				if (pokemon.hp && pokemon.volatiles['maelstrm']) {
					pokemon.removeVolatile('maelstrm');
				}
				if (pokemon.hp && pokemon.volatiles['splinters']) {
					pokemon.removeVolatile('splinters');
				}
			},
		},
	},
	"hypnosis": {
		inherit: true,
		accuracy: 45,
	},
};
