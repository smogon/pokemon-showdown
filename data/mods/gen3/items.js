'use strict';

/**@type {{[k: string]: ModdedItemData}} */
let BattleItems = {
	"aguavberry": {
		inherit: true,
		onUpdate() {},
		onResidualOrder: 5,
		onResidual(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				pokemon.eatItem();
			}
		},
	},
	"apicotberry": {
		inherit: true,
		onUpdate() {},
		onResidualOrder: 5,
		onResidual(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4) {
				pokemon.eatItem();
			}
		},
	},
	"berryjuice": {
		inherit: true,
		isUnreleased: true,
		onUpdate() {},
		onResidualOrder: 5,
		onResidual(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				if (this.runEvent('TryHeal', pokemon) && pokemon.useItem()) {
					this.heal(20);
				}
			}
		},
	},
	"blackbelt": {
		inherit: true,
		desc: "Holder's Fighting-type attacks have 1.1x power.",
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Fighting') {
				return basePower * 1.1;
			}
		},
	},
	"blackglasses": {
		inherit: true,
		desc: "Holder's Dark-type attacks have 1.1x power.",
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Dark') {
				return basePower * 1.1;
			}
		},
	},
	"charcoal": {
		inherit: true,
		desc: "Holder's Fire-type attacks have 1.1x power.",
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Fire') {
				return basePower * 1.1;
			}
		},
	},
	"dragonfang": {
		inherit: true,
		desc: "Holder's Dragon-type attacks have 1.1x power.",
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Dragon') {
				return basePower * 1.1;
			}
		},
	},
	"enigmaberry": {
		id: "enigmaberry",
		name: "Enigma Berry",
		desc: "No competitive use.",
		isUnreleased: true,
		spritenum: 124,
		isBerry: true,
		num: 208,
		gen: 3,
	},
	"figyberry": {
		inherit: true,
		onUpdate() {},
		onResidualOrder: 5,
		onResidual(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				pokemon.eatItem();
			}
		},
	},
	"ganlonberry": {
		inherit: true,
		onUpdate() {},
		onResidualOrder: 5,
		onResidual(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4) {
				pokemon.eatItem();
			}
		},
	},
	"hardstone": {
		inherit: true,
		desc: "Holder's Rock-type attacks have 1.1x power.",
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Rock') {
				return basePower * 1.1;
			}
		},
	},
	"iapapaberry": {
		inherit: true,
		onUpdate() {},
		onResidualOrder: 5,
		onResidual(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				pokemon.eatItem();
			}
		},
	},
	"kingsrock": {
		inherit: true,
		onModifyMove(move) {
			let affectedByKingsRock = ['aerialace', 'aeroblast', 'aircutter', 'armthrust', 'barrage', 'beatup', 'bide', 'bind', 'blastburn', 'bonerush', 'bonemerang', 'bounce', 'brickbreak', 'bulletseed', 'clamp', 'cometpunch', 'crabhammer', 'crosschop', 'cut', 'dig', 'dive', 'doublekick', 'doubleslap', 'doubleedge', 'dragonbreath', 'dragonclaw', 'dragonrage', 'drillpeck', 'earthquake', 'eggbomb', 'endeavor', 'eruption', 'explosion', 'extremespeed', 'falseswipe', 'feintattack', 'firespin', 'flail', 'fly', 'frenzyplant', 'frustration', 'furyattack', 'furycutter', 'furyswipes', 'gust', 'hiddenpower', 'highjumpkick', 'hornattack', 'hydrocannon', 'hydropump', 'hyperbeam', 'iceball', 'iciclespear', 'jumpkick', 'karatechop', 'leafblade', 'lowkick', 'machpunch', 'magicalleaf', 'magnitude', 'megakick', 'megapunch', 'megahorn', 'meteormash', 'mudshot', 'muddywater', 'nightshade', 'outrage', 'overheat', 'payday', 'peck', 'petaldance', 'pinmissile', 'poisontail', 'pound', 'psychoboost', 'psywave', 'quickattack', 'rage', 'rapidspin', 'razorleaf', 'razorwind', 'return', 'revenge', 'reversal', 'rockblast', 'rockthrow', 'rollingkick', 'rollout', 'sandtomb', 'scratch', 'seismictoss', 'selfdestruct', 'shadowpunch', 'shockwave', 'signalbeam', 'silverwind', 'skullbash', 'skyattack', 'skyuppercut', 'slam', 'slash', 'snore', 'solarbeam', 'sonicboom', 'spikecannon', 'spitup', 'steelwing', 'strength', 'struggle', 'submission', 'surf', 'swift', 'tackle', 'takedown', 'thrash', 'tickle', 'triplekick', 'twister', 'uproar', 'vicegrip', 'vinewhip', 'vitalthrow', 'volttackle', 'watergun', 'waterpulse', 'waterfall', 'weatherball', 'whirlpool', 'wingattack', 'wrap'];
			if (affectedByKingsRock.includes(move.id)) {
				if (!move.secondaries) move.secondaries = [];
				move.secondaries.push({
					chance: 10,
					volatileStatus: 'flinch',
				});
			}
		},
	},
	"lansatberry": {
		inherit: true,
		onUpdate() {},
		onResidualOrder: 5,
		onResidual(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4) {
				pokemon.eatItem();
			}
		},
	},
	"laxincense": {
		inherit: true,
		desc: "The accuracy of attacks against the holder is 0.95x.",
		onModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			this.debug('lax incense - decreasing accuracy');
			return accuracy * 0.95;
		},
	},
	"liechiberry": {
		inherit: true,
		onUpdate() {},
		onResidualOrder: 5,
		onResidual(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4) {
				pokemon.eatItem();
			}
		},
	},
	"lightball": {
		inherit: true,
		desc: "If held by a Pikachu, its Special Attack is doubled.",
		onModifyAtk() {},
	},
	"magnet": {
		inherit: true,
		desc: "Holder's Electric-type attacks have 1.1x power.",
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Electric') {
				return basePower * 1.1;
			}
		},
	},
	"magoberry": {
		inherit: true,
		onUpdate() {},
		onResidualOrder: 5,
		onResidual(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				pokemon.eatItem();
			}
		},
	},
	"metalcoat": {
		inherit: true,
		desc: "Holder's Steel-type attacks have 1.1x power.",
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Steel') {
				return basePower * 1.1;
			}
		},
	},
	"miracleseed": {
		inherit: true,
		desc: "Holder's Grass-type attacks have 1.1x power.",
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Grass') {
				return basePower * 1.1;
			}
		},
	},
	"mysticwater": {
		inherit: true,
		desc: "Holder's Water-type attacks have 1.1x power.",
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Water') {
				return basePower * 1.1;
			}
		},
	},
	"nevermeltice": {
		inherit: true,
		desc: "Holder's Ice-type attacks have 1.1x power.",
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Ice') {
				return basePower * 1.1;
			}
		},
	},
	"oranberry": {
		inherit: true,
		onUpdate() {},
		onResidualOrder: 5,
		onResidual(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				pokemon.eatItem();
			}
		},
	},
	"petayaberry": {
		inherit: true,
		onUpdate() {},
		onResidualOrder: 5,
		onResidual(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4) {
				pokemon.eatItem();
			}
		},
	},
	"poisonbarb": {
		inherit: true,
		desc: "Holder's Poison-type attacks have 1.1x power.",
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Poison') {
				return basePower * 1.1;
			}
		},
	},
	"quickclaw": {
		inherit: true,
		onModifyPriority(priority, pokemon) {
			if (this.randomChance(1, 5)) {
				return Math.round(priority) + 0.1;
			}
		},
	},
	"salacberry": {
		inherit: true,
		onUpdate() {},
		onResidualOrder: 5,
		onResidual(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4) {
				pokemon.eatItem();
			}
		},
	},
	"seaincense": {
		inherit: true,
		desc: "Holder's Water-type attacks have 1.05x power.",
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Water') {
				return basePower * 1.05;
			}
		},
	},
	"sharpbeak": {
		inherit: true,
		desc: "Holder's Flying-type attacks have 1.1x power.",
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Flying') {
				return basePower * 1.1;
			}
		},
	},
	"silkscarf": {
		inherit: true,
		desc: "Holder's Normal-type attacks have 1.1x power.",
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Normal') {
				return basePower * 1.1;
			}
		},
	},
	"silverpowder": {
		inherit: true,
		desc: "Holder's Bug-type attacks have 1.1x power.",
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Bug') {
				return basePower * 1.1;
			}
		},
	},
	"sitrusberry": {
		inherit: true,
		desc: "Restores 30 HP when at 1/2 max HP or less. Single use.",
		onUpdate() {},
		onResidualOrder: 5,
		onResidual(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			this.heal(30);
		},
	},
	"softsand": {
		inherit: true,
		desc: "Holder's Ground-type attacks have 1.1x power.",
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Ground') {
				return basePower * 1.1;
			}
		},
	},
	"spelltag": {
		inherit: true,
		desc: "Holder's Ghost-type attacks have 1.1x power.",
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Ghost') {
				return basePower * 1.1;
			}
		},
	},
	"starfberry": {
		inherit: true,
		onUpdate() {},
		onResidualOrder: 5,
		onResidual(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4) {
				pokemon.eatItem();
			}
		},
	},
	"twistedspoon": {
		inherit: true,
		desc: "Holder's Psychic-type attacks have 1.1x power.",
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Psychic') {
				return basePower * 1.1;
			}
		},
	},
	"wikiberry": {
		inherit: true,
		onUpdate() {},
		onResidualOrder: 5,
		onResidual(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				pokemon.eatItem();
			}
		},
	},
};

exports.BattleItems = BattleItems;
