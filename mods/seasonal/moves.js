'use strict';

/** @type {{[k: string]: ModdedMoveData}} */
let BattleMovedex = {
	/*
	// Example
	"moveid": {
		accuracy: 100, // a number or true for always hits
		basePower: 100, // Not used for Status moves, base power of the move, number
		category: "Physical", // "Physical", "Special", or "Status"
		desc: "", // long description
		shortDesc: "", // short description, shows up in /dt
		id: "moveid",
		name: "Move Name",
		pp: 10, // unboosted PP count
		priority: 0, // move priority, -6 -> 6
		flags: {}, // Move flags https://github.com/Zarel/Pokemon-Showdown/blob/master/data/moves.js#L1-L27
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
		zMoveEffect: '', // for status moves, what happens when this is used as a Z move? check data/moves.js for examples
		zMoveBoost: {atk: 2}, // for status moves, stat boost given when used as a z move
		critRatio: 2, // The higher the number (above 1) the higher the ratio, lowering it lowers the crit ratio
		drain: [1, 2], // recover first num / second num % of the damage dealt
		heal: [1, 2], // recover first num / second num % of the target's HP
	},
	*/
	// Please keep sets organized alphabetically based on staff member name!
	// eternally
	quack: {
		accuracy: 100,
		category: "Status",
		desc: "",
		shortDesc: "",
		id: "quack",
		name: "Quack",
		pp: 5,
		priority: 0,
		flags: {mirror: 1, snatch: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Feather Dance', source);
			this.add('-anim', source, 'Aqua Ring', source);
		},
		boosts: {spa: 1, def: 1},
		secondary: null,
		target: "self",
		type: "Flying",
	},
	//hoeenhero
	scripting: {
		accuracy: 100,
		category: "Status",
		desc: "",
		shortDesc: "",
		id: "scripting",
		name: "Scripting",
		pp: 5,
		priority: 0,
		flags: {mirror: 1, snatch: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Calm Mind', source);
			this.add('-anim', source, 'Geomancy', source);
		},
		weather: 'raindance',
		boosts: {spa: 1},
		secondary: null,
		target: "self",
		type: "Psychic",
	},
	// MacChaeger
	naptime: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user falls asleep for the next turn and restores 50% of its HP, curing itself of any major status condition. If the user falls asleep in this way, all other active Pokemon that are not asleep or frozen also try to use Nap Time. Fails if the user has full HP, is already asleep, or if another effect is preventing sleep.",
		shortDesc: "All active Pokemon sleep 1 turn, restore HP & status.",
		id: "naptime",
		isNonstandard: true,
		name: "Nap Time",
		pp: 5,
		priority: 0,
		flags: {snatch: 1, heal: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Rest", target);
			this.add('-anim', source, "Aromatic Mist", target);
		},
		onTryMove: function (pokemon) {
			if (pokemon.hp < pokemon.maxhp && pokemon.status !== 'slp' && !pokemon.hasAbility('comatose')) return;
			this.add('-fail', pokemon);
			return null;
		},
		onHit: function (target, source, move) {
			let napWeather = this.pseudoWeather['naptime'];
			// Trigger sleep clause if not the original user
			// @ts-ignore
			if (!target.setStatus('slp', napWeather.source, move)) return false;
			target.statusData.time = 2;
			target.statusData.startTime = 2;
			this.heal(target.maxhp / 2); //Aesthetic only as the healing happens after you fall asleep in-game
			this.add('-status', target, 'slp', '[from] move: Rest');
			// @ts-ignore
			if (napWeather.source === target) {
				for (let i = 0; i < this.sides.length; i++) {
					for (let j = 0; j < this.sides[i].active.length; j++) {
						let curMon = this.sides[i].active[j];
						if (curMon === source) continue;
						if (curMon && curMon.hp && curMon.status !== 'slp' && curMon.status !== 'frz' && !curMon.hasAbility('comatose')) {
							this.add('-anim', source, "Yawn", curMon);
							this.useMove(move, curMon, curMon, move);
						}
					}
				}
			}
			this.removePseudoWeather('naptime');
		},
		pseudoWeather: 'naptime',
		effect: {
			duration: 1,
		},
		target: "self",
		type: "Fairy",
		zMoveEffect: 'clearnegativeboosts',
	},
};

exports.BattleMovedex = BattleMovedex;
