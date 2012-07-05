exports.BattleItems = {
	"burndrive": {
		id: "burndrive",
		name: "Burn Drive",
		spritenum: 103,
		fling: {
			basePower: 70
		},
		onStart: function (pokemon) {
			if (pokemon.species === 'Genesect') {
				this.add('-item', pokemon, 'Burn Drive');
				if (pokemon.transformInto('Genesect-Burn')) {
					this.add('-formechange', pokemon, 'Genesect-Burn');
				}
			}
		},
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Bug' || move.type === 'Fire') {
				return basePower * 1.2;
			}
		},
		onDrive: 'Fire',
		desc: "Changes Genesect to Genesect-Burn."
	},
	"chilldrive": {
		id: "chilldrive",
		name: "Chill Drive",
		spritenum: 103,
		fling: {
			basePower: 70
		},
		onStart: function (pokemon) {
			if (pokemon.species === 'Genesect') {
				this.add('-item', pokemon, 'Chill Drive');
				if (pokemon.transformInto('Genesect-Chill')) {
					this.add('-formechange', pokemon, 'Genesect-Chill');
				}
			}
		},
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Bug' || move.type === 'Ice') {
				return basePower * 1.2;
			}
		},
		onDrive: 'Ice',
		desc: "Changes Genesect to Genesect-Chill."
	},
	"dousedrive": {
		id: "dousedrive",
		name: "Douse Drive",
		spritenum: 103,
		fling: {
			basePower: 70
		},
		onStart: function (pokemon) {
			if (pokemon.species === 'Genesect') {
				this.add('-item', pokemon, 'Douse Drive');
				if (pokemon.transformInto('Genesect-Douse')) {
					this.add('-formechange', pokemon, 'Genesect-Douse');
				}
			}
		},
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Bug' || move.type === 'Water') {
				return basePower * 1.2;
			}
		},
		onDrive: 'Water',
		desc: "Changes Genesect to Genesect-Douse."
	},
	"shockdrive": {
		id: "shockdrive",
		name: "Shock Drive",
		spritenum: 103,
		fling: {
			basePower: 70
		},
		onStart: function (pokemon) {
			if (pokemon.species === 'Genesect') {
				this.add('-item', pokemon, 'Shock Drive');
				if (pokemon.transformInto('Genesect-Shock')) {
					this.add('-formechange', pokemon, 'Genesect-Shock');
				}
			}
		},
		onBasePower: function(basePower, user, target, move) {
			if (move.type === 'Bug' || move.type === 'Electric') {
				return basePower * 1.2;
			}
		},
		onDrive: 'Electric',
		desc: "Changes Genesect to Genesect-Shock."
	}
};
