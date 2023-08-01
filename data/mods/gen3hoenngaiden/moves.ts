export const Moves: {[k: string]: ModdedMoveData} = {
	darkestlariat: {
		inherit: true,
		category: "Special",
		gen: 3,
	},
	circlethrow: {
		inherit: true,
		gen: 3,
	},
	fierywrath: {
		inherit: true,
		gen: 3,
	},
	boomburst: {
		inherit: true,
		category: "Physical",
		gen: 3,
	},
	bodypress: {
		inherit: true,
		gen: 3,
	},
	batonpass: {
		inherit: true,
		desc: "The user is replaced with another Pokemon in its party. The selected Pokemon has the user's stat stage deductions, confusion, and certain move effects transferred to it.",
		shortDesc: "Modified Baton Pass. Positive boosts are reset.",
	},
	weatherball: {
		inherit: true,
		shortDesc: "Damage doubles and type varies during weather.",
		onModifyMove(move) {
			switch (this.field.effectiveWeather()) {
			case 'sunnyday':
				move.type = 'Fire';
				move.category = 'Special';
				break;
			case 'desolateland':
				move.type = 'Fire';
				move.category = 'Special';
				break;
			case 'raindance':
				move.type = 'Water';
				move.category = 'Special';
				break;
			case 'sandstorm':
				move.type = 'Rock';
				break;
			case 'hail':
				move.type = 'Ice';
				move.category = 'Special';
				break;
			}
			if (this.field.effectiveWeather()) move.basePower *= 2;
		},
	},
	acrobatics: {
		inherit: true,
		gen: 3,
	},
	foulplay: {
		inherit: true,
		gen: 3,
	},
	gigadrain: {
		inherit: true,
		basePower: 75,
		pp: 10,
	},
	icehammer: {
		inherit: true,
		category: "Special",
		gen: 3,
	},
	iceshard: {
		inherit: true,
		category: "Special",
		gen: 3,
	},
	junglehealing: {
		inherit: true,
		gen: 3,
	},
	lunge: {
		inherit: true,
		basePower: 60,
		gen: 3,
	},
	multiattack: {
		inherit: true,
		gen: 3,
		basePower: 120,
		onModifyMove(move, pokemon) {
			if (pokemon.ignoringItem()) return;
			move.type = this.runEvent('Memory', pokemon, null, move, 'Normal');
			const specialTypes = ['Fire', 'Water', 'Grass', 'Ice', 'Electric', 'Dark', 'Psychic', 'Dragon'];
			move.category = specialTypes.includes(move.type) ? 'Special' : 'Physical';
		},
	},
	recover: {
		inherit: true,
		pp: 10,
	},
	spikyshield: {
		inherit: true,
		gen: 3,
	},
	spiritbreak: {
		inherit: true,
		type: "Fighting",
		gen: 3,
	},
	suckerpunch: {
		inherit: true,
		basePower: 70,
		category: "Special",
		gen: 3,
	},
	attackorder: {
		inherit: true,
		gen: 3,
	},
	defendorder: {
		inherit: true,
		gen: 3,
	},
	healorder: {
		inherit: true,
		gen: 3,
	},
};
