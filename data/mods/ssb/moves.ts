export const BattleMovedex: {[k: string]: ModdedMoveData} = {
	/*
	// Example
	"moveid": {
		accuracy: 100, // a number or true for always hits
		basePower: 100, // Not used for Status moves, base power of the move, number
		category: "Physical", // "Physical", "Special", or "Status"
		desc: "", // long description
		shortDesc: "", // short description, shows up in /dt
		name: "Move Name",
		pp: 10, // unboosted PP count
		priority: 0, // move priority, -6 -> 6
		flags: {}, // Move flags https://github.com/smogon/pokemon-showdown/blob/master/data/moves.js#L1-L27
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
	"mechomnism": {
		accuracy: 95,
		basePower: 90,
		category: "Special",
		desc: "Heals 33% of damage dealt. 15% chance to raise Special Attack by 1 stage.",
		shortDesc: "Heals 33% of damage dealt. 15% chance to raise SpA by 1.",
		name: "MechOMnism",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		drain: [1, 3],
		onTryHit(target, source) {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Mirror Shot', source);
			this.add('-anim', source, 'Refresh', source);
		},
		onHit: function () {
			this.add(`c|@OM~!|Bang Bang`);
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
};
