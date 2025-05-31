export const Items: import('../../../sim/dex-items').ModdedItemDataTable = {
	altarianite: {
		name: "Altarianite",
		spritenum: 615,
		megaStone: "Muktaria-Alola-Mega",
		megaEvolves: "Muktaria-Alola",
		itemUser: ["Muktaria-Alola"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 755,
		desc: "If held by an Alolan Muktaria, this item allows it to Mega Evolve in battle.",
	},
	metagrossite: {
		name: "Metagrossite",
		spritenum: 618,
		megaStone: "Iron Meta-Mega",
		megaEvolves: "Iron Meta",
		itemUser: ["Iron Meta"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 758,
		desc: "If held by an Iron Meta, this item allows it to Mega Evolve in battle.",
	},
	boosterenergy: {
		inherit: true,
		onUpdate(pokemon) {
			if (!this.effectState.started || pokemon.transformed || this.queue.peek(true)?.choice === 'runSwitch') return;
			if (!this.field.isWeather('sunnyday')) {
				for (const proto of [
					'protosynthesis', 'onceuponatime', 'primitive', 'openingact',
					'weightoflife', 'prehistorichunter', 'ancientmarble',
				]) {
					if (pokemon.hasAbility(proto)) {
						if (!(pokemon.volatiles['protosynthesis'] || pokemon.volatiles[proto]) && pokemon.useItem()) {
							pokemon.addVolatile(['openingact', 'weightoflife', 'prehistorichunter'].includes(proto) ? proto : 'protosynthesis');
						}
						return;
					}
				}
			}
			if (!this.field.isTerrain('electricterrain')) {
				for (const quark of [
					'quarkdrive', 'lightdrive', 'quarksurge', 'nanorepairs', 'circuitbreaker',
					'heatproofdrive', 'faultyphoton', 'firewall', 'innovate', 'baryonblade',
				]) {
					if (pokemon.hasAbility(quark)) {
						if (!(pokemon.volatiles['quarkdrive'] || pokemon.volatiles[quark]) && pokemon.useItem()) {
							pokemon.addVolatile(['lightdrive', 'baryonblade', 'circuitbreaker'].includes(quark) ? quark : 'quarkdrive');
						}
						return;
					}
				}
			}
		},
		desc: "Activates abilities with Protosynthesis or Quark Drive effects. Single use.",
	},
	absolite: {
		name: "Absolite",
		spritenum: 576,
		megaStone: "Sol Valiant-Mega",
		megaEvolves: "Sol Valiant",
		itemUser: ["Sol Valiant"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 677,
		desc: "If held by a Sol Valiant, this item allows it to Mega Evolve in battle.",
	},
	garchompite: {
		name: "Garchompite",
		spritenum: 589,
		megaStone: "Garpyuku-Mega",
		megaEvolves: "Garpyuku",
		itemUser: ["Garpyuku"],
		onTakeItem(item, source) {
			if ([item.megaEvolves, "Chomptry"].includes(source.baseSpecies.baseSpecies)) return false;
			return true;
		},
		num: 683,
		desc: "If held by a Garpyuku or Chomptry, this item allows it to Mega Evolve in battle.",
	},
	gengarite: {
		name: "Gengarite",
		spritenum: 588,
		megaStone: "Crygargonal-Mega",
		megaEvolves: "Crygargonal",
		itemUser: ["Crygargonal"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 656,
		desc: "If held by a Crygargonal, this item allows it to Mega Evolve in battle.",
	},
	ampharosite: {
		name: "Ampharosite",
		spritenum: 580,
		megaStone: "Amphamence-Mega-Y",
		megaEvolves: "Amphamence",
		itemUser: ["Amphamence"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 658,
		desc: "If held by an Amphamence, this item allows it to Mega Evolve in battle.",
	},
	salamencite: {
		name: "Salamencite",
		spritenum: 627,
		megaStone: "Amphamence-Mega-X",
		megaEvolves: "Amphamence",
		itemUser: ["Amphamence"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 769,
		desc: "If held by an Amphamence, this item allows it to Mega Evolve in battle.",
	},
	swampertite: {
		name: "Swampertite",
		spritenum: 612,
		megaStone: "Goopert-Hisui-Mega",
		megaEvolves: "Goopert-Hisui",
		itemUser: ["Goopert-Hisui"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 752,
		desc: "If held by a Hisuian Goopert, this item allows it to Mega Evolve in battle.",
	},
	tyranitarite: {
		name: "Tyranitarite",
		spritenum: 607,
		megaStone: "Tyranix-Mega-X",
		megaEvolves: "Tyranix",
		itemUser: ["Tyranix"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 669,
		desc: "If held by a Tyranix, this item allows it to Mega Evolve in battle.",
	},
	steelixite: {
		name: "Steelixite",
		spritenum: 621,
		megaStone: "Tyranix-Mega-Y",
		megaEvolves: "Tyranix",
		itemUser: ["Tyranix"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 761,
		desc: "If held by a Tyranix, this item allows it to Mega Evolve in battle.",
	},
	depletedultranecroziumz: {
		name: "Depleted Ultranecrozium Z",
		spritenum: 687,
		itemUser: ["Necrotrik-Dawn-Wings"],
		onTakeItem: false,
		num: -1001,
		desc: "If held by a Necrotrik-Dawn-Wings, this item allows it to Ultra Burst in battle. This does not allow it to use a Z-Move.",
	},
	alakazite: {
		name: "Alakazite",
		spritenum: 579,
		megaStone: "Mawlakazam-Mega-Y",
		megaEvolves: "Mawlakazam",
		itemUser: ["Mawlakazam"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 679,
		desc: "If held by a Mawlakazam, this item allows it to Mega Evolve in battle.",
	},
	mawilite: {
		name: "Mawilite",
		spritenum: 598,
		megaStone: "Mawlakazam-Mega-X",
		megaEvolves: "Mawlakazam",
		itemUser: ["Mawlakazam"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 681,
		desc: "If held by a Mawlakazam, this item allows it to Mega Evolve in battle.",
	},
	scizorite: {
		name: "Scizorite",
		spritenum: 605,
		megaStone: "Druddizor-Mega",
		megaEvolves: "Druddizor",
		itemUser: ["Druddizor"],
		onTakeItem(item, source) {
			if ([item.megaEvolves, "Tentazor"].includes(source.baseSpecies.baseSpecies)) return false;
			return true;
		},
		num: 670,
		desc: "If held by a Tentazor, this item allows it to Mega Evolve in battle.",
	},
	jabocaberry: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (move.category === 'Physical' &&
				source.hp && source.isActive && !source.hasAbility(['magicguard', 'overwhelming']) && target.eatItem()) {
				this.damage(source.baseMaxhp / (target.hasAbility('ripen') ? 4 : 8), source, target);
			}
		},
	},
	quickclaw: {
		inherit: true,
		onFractionalPriority(priority, pokemon, target, move) {
			if (move.category === "Status" && pokemon.hasAbility(["myceliummight", "galvanicrelay"])) return;
			if (priority <= 0 && this.randomChance(1, 5)) {
				this.add('-activate', pokemon, 'item: Quick Claw');
				return 0.1;
			}
		},
	},
	rowapberry: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (move.category === 'Special' && source.hp && source.isActive &&
				!source.hasAbility(['magicguard', 'overwhelming']) && target.eatItem()) {
				this.damage(source.baseMaxhp / (target.hasAbility('ripen') ? 4 : 8), source, target);
			}
		},
	},
	gyaradosite: {
		name: "Gyaradosite",
		spritenum: 589,
		megaStone: "Overgyara-Mega",
		megaEvolves: "Overgyara",
		itemUser: ["Overgyara"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 676,
		desc: "If held by an Overgyara, this item allows it to Mega Evolve in battle.",
	},
	aerodactylite: {
		name: "Aerodactylite",
		spritenum: 577,
		megaStone: "Aero Wake-Mega",
		megaEvolves: "Aero Wake",
		itemUser: ["Aero Wake"],
		onTakeItem(item, source) {
			if ([item.megaEvolves, "Aerodirge"].includes(source.baseSpecies.baseSpecies)) return false;
			return true;
		},
		num: 672,
		desc: "If held by an Aero Wake, this item allows it to Mega Evolve in battle.",
	},
	sharpedonite: {
		name: "Sharpedonite",
		spritenum: 619,
		megaStone: "Zoroshark-Hisui-Mega",
		megaEvolves: "Zoroshark-Hisui",
		itemUser: ["Zoroshark-Hisui"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 759,
		desc: "If held by a Hisuian Zoroshark, this item allows it to Mega Evolve in battle.",
	},
	cameruptite: {
		name: "Cameruptite",
		spritenum: 625,
		megaStone: "Wo-Rupt-Mega",
		megaEvolves: "Wo-Rupt",
		itemUser: ["Wo-Rupt"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 767,
		desc: "If held by a Wo-Rupt, this item allows it to Mega Evolve in battle.",
	},
	eviolite: {
		inherit: true,
		onModifyDefPriority: 2,
		onModifyDef(def, pokemon) {
			if (pokemon.baseSpecies.nfe || pokemon.baseSpecies.baseSpecies === 'Sneasel') {
				return this.chainModify(1.5);
			}
		},
		onModifySpDPriority: 2,
		onModifySpD(spd, pokemon) {
			if (pokemon.baseSpecies.nfe || pokemon.baseSpecies.baseSpecies === 'Sneasel') {
				return this.chainModify(1.5);
			}
		},
	},
	hearthflamemask: {
		name: "Hearthflame Mask",
		spritenum: 760,
		fling: {
			basePower: 60,
		},
		onStart(pokemon) {
			if (this.ruleTable.has('terastalclause')) {
				pokemon.canTerastallize = null;
			}
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (user.baseSpecies.name.startsWith('Hattepon-Hearthflame')) {
				return this.chainModify([4915, 4096]);
			}
		},
		onTakeItem(item, source) {
			if (source.baseSpecies.baseSpecies === 'Hattepon') return false;
			return true;
		},
		forcedForme: "Hattepon-Hearthflame",
		itemUser: ["Hattepon-Hearthflame"],
		num: 2408,
		gen: 9,
		desc: "Hattepon-Hearthflame: 1.2x power attacks; Terastallize to gain Embody Aspect.",
	},
	wellspringmask: {
		name: "Wellspring Mask",
		spritenum: 759,
		fling: {
			basePower: 60,
		},
		onStart(pokemon) {
			if (this.ruleTable.has('terastalclause')) {
				pokemon.canTerastallize = null;
			}
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (user.baseSpecies.name.startsWith('Hattepon-Wellspring')) {
				return this.chainModify([4915, 4096]);
			}
		},
		onTakeItem(item, source) {
			if (source.baseSpecies.baseSpecies === 'Hattepon') return false;
			return true;
		},
		forcedForme: "Hattepon-Wellspring",
		itemUser: ["Hattepon-Wellspring"],
		num: 2407,
		gen: 9,
		desc: "Hattepon-Wellspring: 1.2x power attacks; Terastallize to gain Embody Aspect.",
	},
	cornerstonemask: {
		name: "Cornerstone Mask",
		spritenum: 758,
		fling: {
			basePower: 60,
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (user.baseSpecies.name.startsWith('Hattepon-Cornerstone')) {
				return this.chainModify([4915, 4096]);
			}
		},
		onTakeItem(item, source) {
			if (source.baseSpecies.baseSpecies === 'Hattepon') return false;
			return true;
		},
		forcedForme: "Hattepon-Cornerstone",
		itemUser: ["Hattepon-Cornerstone"],
		num: 2406,
		gen: 9,
		desc: "Hattepon-Cornerstone: 1.2x power attacks; Terastallize to gain Embody Aspect.",
	},
	medichamite: {
		name: "Medichamite",
		spritenum: 599,
		megaStone: "Giracham-Origin-Mega",
		megaEvolves: "Giracham-Origin",
		itemUser: ["Giracham-Origin"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 665,
		desc: "If held by Giracham-Origin, this item allows it to Mega Evolve in battle.",
	},

	aggronite: {
		name: "Aggronite",
		spritenum: 578,
		megaStone: "Aggram-Mega",
		megaEvolves: "Aggram",
		itemUser: ["Aggram"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 667,
		isNonstandard: null,
		desc: "If held by an Aggram, this item allows it to Mega Evolve in battle.",
	},
};
