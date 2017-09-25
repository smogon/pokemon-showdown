'use strict';

exports.BattleItems = {
	"berryjuice": {
		inherit: true,
		isUnreleased: true,
	},
	"blackbelt": {
		inherit: true,
		desc: "Holder's Fighting-type attacks have 1.1x power.",
		onBasePower: function (basePower, user, target, move) {
			if (move && move.type === 'Fighting') {
				return basePower * 1.1;
			}
		},
	},
	"blackglasses": {
		inherit: true,
		desc: "Holder's Dark-type attacks have 1.1x power.",
		onBasePower: function (basePower, user, target, move) {
			if (move && move.type === 'Dark') {
				return basePower * 1.1;
			}
		},
	},
	"charcoal": {
		inherit: true,
		desc: "Holder's Fire-type attacks have 1.1x power.",
		onBasePower: function (basePower, user, target, move) {
			if (move && move.type === 'Fire') {
				return basePower * 1.1;
			}
		},
	},
	"dragonfang": {
		inherit: true,
		desc: "Holder's Dragon-type attacks have 1.1x power.",
		onBasePower: function (basePower, user, target, move) {
			if (move && move.type === 'Dragon') {
				return basePower * 1.1;
			}
		},
	},
	"hardstone": {
		inherit: true,
		desc: "Holder's Rock-type attacks have 1.1x power.",
		onBasePower: function (basePower, user, target, move) {
			if (move && move.type === 'Rock') {
				return basePower * 1.1;
			}
		},
	},
	"kingsrock": {
		inherit: true,
		onModifyMove: function (move) {
			if (move.category !== "Status") {
				if (move.secondaries && move.secondaries.length) return;
				move.secondaries = [{
					chance: 10,
					volatileStatus: 'flinch',
				}];
			}
		},
	},
	"laxincense": {
		inherit: true,
		desc: "The accuracy of attacks against the holder is 0.95x.",
		onModifyAccuracy: function (accuracy) {
			if (typeof accuracy !== 'number') return;
			this.debug('lax incense - decreasing accuracy');
			return accuracy * 0.95;
		},
	},
	"lightball": {
		inherit: true,
		desc: "If held by a Pikachu, its Special Attack is doubled.",
		onModifyAtk: function () {},
	},
	"magnet": {
		inherit: true,
		desc: "Holder's Electric-type attacks have 1.1x power.",
		onBasePower: function (basePower, user, target, move) {
			if (move.type === 'Electric') {
				return basePower * 1.1;
			}
		},
	},
	"metalcoat": {
		inherit: true,
		desc: "Holder's Steel-type attacks have 1.1x power.",
		onBasePower: function (basePower, user, target, move) {
			if (move.type === 'Steel') {
				return basePower * 1.1;
			}
		},
	},
	"miracleseed": {
		inherit: true,
		desc: "Holder's Grass-type attacks have 1.1x power.",
		onBasePower: function (basePower, user, target, move) {
			if (move.type === 'Grass') {
				return basePower * 1.1;
			}
		},
	},
	"mysticwater": {
		inherit: true,
		desc: "Holder's Water-type attacks have 1.1x power.",
		onBasePower: function (basePower, user, target, move) {
			if (move.type === 'Water') {
				return basePower * 1.1;
			}
		},
	},
	"nevermeltice": {
		inherit: true,
		desc: "Holder's Ice-type attacks have 1.1x power.",
		onBasePower: function (basePower, user, target, move) {
			if (move.type === 'Ice') {
				return basePower * 1.1;
			}
		},
	},
	"poisonbarb": {
		inherit: true,
		desc: "Holder's Poison-type attacks have 1.1x power.",
		onBasePower: function (basePower, user, target, move) {
			if (move.type === 'Poison') {
				return basePower * 1.1;
			}
		},
	},
	"quickclaw": {
		inherit: true,
		onModifyPriority: function (priority, pokemon) {
			if (this.random(5) === 0) {
				return Math.round(priority) + 0.1;
			}
		},
	},
	"seaincense": {
		inherit: true,
		desc: "Holder's Water-type attacks have 1.05x power.",
		onBasePower: function (basePower, user, target, move) {
			if (move && move.type === 'Water') {
				return basePower * 1.05;
			}
		},
	},
	"sharpbeak": {
		inherit: true,
		desc: "Holder's Flying-type attacks have 1.1x power.",
		onBasePower: function (basePower, user, target, move) {
			if (move && move.type === 'Flying') {
				return basePower * 1.1;
			}
		},
	},
	"silkscarf": {
		inherit: true,
		desc: "Holder's Normal-type attacks have 1.1x power.",
		onBasePower: function (basePower, user, target, move) {
			if (move.type === 'Normal') {
				return basePower * 1.1;
			}
		},
	},
	"silverpowder": {
		inherit: true,
		desc: "Holder's Bug-type attacks have 1.1x power.",
		onBasePower: function (basePower, user, target, move) {
			if (move.type === 'Bug') {
				return basePower * 1.1;
			}
		},
	},
	"sitrusberry": {
		inherit: true,
		desc: "Restores 30 HP when at 1/2 max HP or less. Single use.",
		onEat: function (pokemon) {
			this.heal(30);
		},
	},
	"softsand": {
		inherit: true,
		desc: "Holder's Ground-type attacks have 1.1x power.",
		onBasePower: function (basePower, user, target, move) {
			if (move.type === 'Ground') {
				return basePower * 1.1;
			}
		},
	},
	"spelltag": {
		inherit: true,
		desc: "Holder's Ghost-type attacks have 1.1x power.",
		onBasePower: function (basePower, user, target, move) {
			if (move.type === 'Ghost') {
				return basePower * 1.1;
			}
		},
	},
	"twistedspoon": {
		inherit: true,
		desc: "Holder's Psychic-type attacks have 1.1x power.",
		onBasePower: function (basePower, user, target, move) {
			if (move.type === 'Psychic') {
				return basePower * 1.1;
			}
		},
	},
};
