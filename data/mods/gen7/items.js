'use strict';
/**@type {{[k: string]: ModdedItemData}} */
let BattleItems = {
	abomasite: {
		inherit: true,
		isNonstandard: null,
	},
	absolite: {
		inherit: true,
		isNonstandard: null,
	},
	aerodactylite: {
		inherit: true,
		isNonstandard: null,
	},
	aggronite: {
		inherit: true,
		isNonstandard: null,
	},
	aguavberry: {
		inherit: true,
		desc: "Restores 1/2 max HP at 1/4 max HP or less; confuses if -SpD Nature. Single use.",
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 2);
			if (pokemon.getNature().minus === 'spd') {
				pokemon.addVolatile('confusion');
			}
		},
	},
	alakazite: {
		inherit: true,
		isNonstandard: null,
	},
	altarianite: {
		inherit: true,
		isNonstandard: null,
	},
	aloraichiumz: {
		inherit: true,
		isNonstandard: null,
	},
	ampharosite: {
		inherit: true,
		isNonstandard: null,
	},
	audinite: {
		inherit: true,
		isNonstandard: null,
	},
	banettite: {
		inherit: true,
		isNonstandard: null,
	},
	beedrillite: {
		inherit: true,
		isNonstandard: null,
	},
	blastoisinite: {
		inherit: true,
		isNonstandard: null,
	},
	blazikenite: {
		inherit: true,
		isNonstandard: null,
	},
	blueorb: {
		inherit: true,
		isNonstandard: null,
	},
	buggem: {
		inherit: true,
		isNonstandard: null,
		isUnreleased: true,
	},
	buginiumz: {
		inherit: true,
		isNonstandard: null,
	},
	cameruptite: {
		inherit: true,
		isNonstandard: null,
	},
	charizarditex: {
		inherit: true,
		isNonstandard: null,
	},
	charizarditey: {
		inherit: true,
		isNonstandard: null,
	},
	custapberry: {
		id: "custapberry",
		name: "Custap Berry",
		spritenum: 86,
		isBerry: true,
		naturalGift: {
			basePower: 100,
			type: "Ghost",
		},
		onModifyPriorityPriority: -1,
		onModifyPriority(priority, pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && pokemon.hasAbility('gluttony'))) {
				if (pokemon.eatItem()) {
					this.add('-activate', pokemon, 'item: Custap Berry', '[consumed]');
					pokemon.removeVolatile('custapberry');
					return Math.round(priority) + 0.1;
				}
			}
		},
		onEat() { },
		num: 210,
		gen: 4,
		desc: "Holder moves first in its priority bracket when at 1/4 max HP or less. Single use.",
	},
	darkgem: {
		inherit: true,
		isNonstandard: null,
		isUnreleased: true,
	},
	darkiniumz: {
		inherit: true,
		isNonstandard: null,
	},
	decidiumz: {
		inherit: true,
		isNonstandard: null,
	},
	diancite: {
		inherit: true,
		isNonstandard: null,
	},
	dragongem: {
		inherit: true,
		isNonstandard: null,
		isUnreleased: true,
	},
	dragoniumz: {
		inherit: true,
		isNonstandard: null,
	},
	eeviumz: {
		inherit: true,
		isNonstandard: null,
	},
	electricgem: {
		inherit: true,
		isNonstandard: null,
		isUnreleased: true,
	},
	electriumz: {
		inherit: true,
		isNonstandard: null,
	},
	fairiumz: {
		inherit: true,
		isNonstandard: null,
	},
	fairygem: {
		inherit: true,
		isNonstandard: null,
		isUnreleased: true,
	},
	fightinggem: {
		inherit: true,
		isNonstandard: null,
		isUnreleased: true,
	},
	fightiniumz: {
		inherit: true,
		isNonstandard: null,
	},
	figyberry: {
		inherit: true,
		desc: "Restores 1/2 max HP at 1/4 max HP or less; confuses if -Atk Nature. Single use.",
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 2);
			if (pokemon.getNature().minus === 'atk') {
				pokemon.addVolatile('confusion');
			}
		},
	},
	firegem: {
		inherit: true,
		isNonstandard: null,
		isUnreleased: true,
	},
	firiumz: {
		inherit: true,
		isNonstandard: null,
	},
	flyinggem: {
		inherit: true,
		isNonstandard: null,
		isUnreleased: true,
	},
	flyiniumz: {
		inherit: true,
		isNonstandard: null,
	},
	galladite: {
		inherit: true,
		isNonstandard: null,
	},
	garchompite: {
		inherit: true,
		isNonstandard: null,
	},
	gardevoirite: {
		inherit: true,
		isNonstandard: null,
	},
	gengarite: {
		inherit: true,
		isNonstandard: null,
	},
	ghostgem: {
		inherit: true,
		isNonstandard: null,
		isUnreleased: true,
	},
	ghostiumz: {
		inherit: true,
		isNonstandard: null,
	},
	glalitite: {
		inherit: true,
		isNonstandard: null,
	},
	grassgem: {
		inherit: true,
		isNonstandard: null,
		isUnreleased: true,
	},
	grassiumz: {
		inherit: true,
		isNonstandard: null,
	},
	groundgem: {
		inherit: true,
		isNonstandard: null,
		isUnreleased: true,
	},
	groundiumz: {
		inherit: true,
		isNonstandard: null,
	},
	gyaradosite: {
		inherit: true,
		isNonstandard: null,
	},
	heracronite: {
		inherit: true,
		isNonstandard: null,
	},
	houndoominite: {
		inherit: true,
		isNonstandard: null,
	},
	iapapaberry: {
		inherit: true,
		desc: "Restores 1/2 max HP at 1/4 max HP or less; confuses if -Def Nature. Single use.",
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 2);
			if (pokemon.getNature().minus === 'def') {
				pokemon.addVolatile('confusion');
			}
		},
	},
	icegem: {
		inherit: true,
		isNonstandard: null,
		isUnreleased: true,
	},
	icestone: {
		inherit: true,
		desc: "Evolves Alolan Sandshrew into Alolan Sandslash and Alolan Vulpix into Alolan Ninetales when used.",
	},
	iciumz: {
		inherit: true,
		isNonstandard: null,
	},
	inciniumz: {
		inherit: true,
		isNonstandard: null,
	},
	jabocaberry: {
		inherit: true,
		isUnreleased: undefined,
	},
	kangaskhanite: {
		inherit: true,
		isNonstandard: null,
	},
	kommoniumz: {
		inherit: true,
		isNonstandard: null,
	},
	latiasite: {
		inherit: true,
		isNonstandard: null,
	},
	latiosite: {
		inherit: true,
		isNonstandard: null,
	},
	leafstone: {
		inherit: true,
		desc: "Evolves Gloom into Vileplume, Weepinbell into Victreebel, Exeggcute into Exeggutor or Alolan Exeggutor, Nuzleaf into Shiftry, and Pansage into Simisage when used.",
	},
	lopunnite: {
		inherit: true,
		isNonstandard: null,
	},
	lucarionite: {
		inherit: true,
		isNonstandard: null,
	},
	lunaliumz: {
		inherit: true,
		isNonstandard: null,
	},
	lycaniumz: {
		inherit: true,
		isNonstandard: null,
	},
	magoberry: {
		inherit: true,
		desc: "Restores 1/2 max HP at 1/4 max HP or less; confuses if -Spe Nature. Single use.",
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 2);
			if (pokemon.getNature().minus === 'spe') {
				pokemon.addVolatile('confusion');
			}
		},
	},
	manectite: {
		inherit: true,
		isNonstandard: null,
	},
	marshadiumz: {
		inherit: true,
		isNonstandard: null,
	},
	mawilite: {
		inherit: true,
		isNonstandard: null,
	},
	medichamite: {
		inherit: true,
		isNonstandard: null,
	},
	metagrossite: {
		inherit: true,
		isNonstandard: null,
	},
	mewniumz: {
		inherit: true,
		isNonstandard: null,
	},
	mewtwonitex: {
		inherit: true,
		isNonstandard: null,
	},
	mewtwonitey: {
		inherit: true,
		isNonstandard: null,
	},
	micleberry: {
		inherit: true,
		isUnreleased: undefined,
	},
	mimikiumz: {
		inherit: true,
		isNonstandard: null,
	},
	normaliumz: {
		inherit: true,
		isNonstandard: null,
	},
	pidgeotite: {
		inherit: true,
		isNonstandard: null,
	},
	pikaniumz: {
		inherit: true,
		isNonstandard: null,
	},
	pikashuniumz: {
		inherit: true,
		isNonstandard: null,
	},
	pinsirite: {
		inherit: true,
		isNonstandard: null,
	},
	poisongem: {
		inherit: true,
		isNonstandard: null,
		isUnreleased: true,
	},
	poisoniumz: {
		inherit: true,
		isNonstandard: null,
	},
	primariumz: {
		inherit: true,
		isNonstandard: null,
	},
	psychicgem: {
		inherit: true,
		isNonstandard: null,
		isUnreleased: true,
	},
	psychiumz: {
		inherit: true,
		isNonstandard: null,
	},
	quickclaw: {
		id: "quickclaw",
		onModifyPriorityPriority: -1,
		onModifyPriority(priority, pokemon) {
			if (this.randomChance(1, 5)) {
				this.add('-activate', pokemon, 'item: Quick Claw');
				return Math.round(priority) + 0.1;
			}
		},
		name: "Quick Claw",
		spritenum: 373,
		fling: {
			basePower: 80,
		},
		num: 217,
		gen: 2,
		desc: "Each turn, holder has a 20% chance to move first in its priority bracket.",
	},
	redorb: {
		inherit: true,
		isNonstandard: null,
	},
	rockgem: {
		inherit: true,
		isNonstandard: null,
		isUnreleased: true,
	},
	rockiumz: {
		inherit: true,
		isNonstandard: null,
	},
	rowapberry: {
		inherit: true,
		isUnreleased: undefined,
	},
	sablenite: {
		inherit: true,
		isNonstandard: null,
	},
	salamencite: {
		inherit: true,
		isNonstandard: null,
	},
	sceptilite: {
		inherit: true,
		isNonstandard: null,
	},
	scizorite: {
		inherit: true,
		isNonstandard: null,
	},
	sharpedonite: {
		inherit: true,
		isNonstandard: null,
	},
	slowbronite: {
		inherit: true,
		isNonstandard: null,
	},
	snorliumz: {
		inherit: true,
		isNonstandard: null,
	},
	solganiumz: {
		inherit: true,
		isNonstandard: null,
	},
	steelgem: {
		inherit: true,
		isNonstandard: null,
		isUnreleased: true,
	},
	steeliumz: {
		inherit: true,
		isNonstandard: null,
	},
	steelixite: {
		inherit: true,
		isNonstandard: null,
	},
	stick: {
		inherit: true,
		isNonstandard: null,
	},
	swampertite: {
		inherit: true,
		isNonstandard: null,
	},
	tapuniumz: {
		inherit: true,
		isNonstandard: null,
	},
	thunderstone: {
		inherit: true,
		desc: "Evolves Pikachu into Raichu or Alolan Raichu, Eevee into Jolteon, and Eelektrik into Eelektross when used.",
	},
	tyranitarite: {
		inherit: true,
		isNonstandard: null,
	},
	ultranecroziumz: {
		inherit: true,
		isNonstandard: null,
	},
	venusaurite: {
		inherit: true,
		isNonstandard: null,
	},
	watergem: {
		inherit: true,
		isNonstandard: null,
		isUnreleased: true,
	},
	wateriumz: {
		inherit: true,
		isNonstandard: null,
	},
	wikiberry: {
		inherit: true,
		isNonstandard: null,
		desc: "Restores 1/2 max HP at 1/4 max HP or less; confuses if -SpA Nature. Single use.",
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 2);
			if (pokemon.getNature().minus === 'spa') {
				pokemon.addVolatile('confusion');
			}
		},
	},
};
exports.BattleItems = BattleItems;
