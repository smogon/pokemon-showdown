export const Items: import('../../../sim/dex-items').ModdedItemDataTable = {
	boosterenergy: {
		inherit: true,
		desc: "Activates abilities with Protosynthesis or Quark Drive effects. Single use.",
		onUpdate(pokemon) {
			if (!this.effectState.started || pokemon.transformed || this.queue.peek(true)?.choice === 'runSwitch') return;
			if (!this.field.isWeather('sunnyday')) {
				for (const proto of ['protopyre', 'protoneuron', 'prototoxin', 'protolithos', 'protoavian',
					'protorefraction', 'protosynthesis']) {
					if (pokemon.hasAbility(proto)) {
						if (!pokemon.volatiles[proto] /* && !this.field.isWeather('sunnyday') */ && pokemon.useItem()) {
							pokemon.addVolatile(proto);
						}
						return;
					}
				}
			}
			if (!this.field.isTerrain('electricterrain')) {
				for (const quark of ['quarkdrive', 'jellyfilleddrive', 'winddrive', 'heavydrive', 'jadedrive', 'airdrive',
					'magicdrive', 'phantomdrive', 'toxicdrive']) {
					if (pokemon.hasAbility(quark)) {
						if (!pokemon.volatiles[quark] && pokemon.useItem()) {
							pokemon.addVolatile(quark);
						}
						return;
					}
				}
			}
		},
	},
	frostorb: {
		name: "Frost Orb",
		gen: 9,
		num: 1000,
		desc: "At the end of each turn, tries to freeze the holder.",
		shortDesc: "At the end of each turn, tries to freeze the holder.",
		fling: {
			basePower: 30,
			status: 'frz',
		},
		onResidualOrder: 26,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			pokemon.trySetStatus('frz', pokemon);
		},
	},
	arzurite: {
		name: "Arzurite",
		gen: 9,
		shortDesc: "If held by Arzuros, allows it to transform into Redhelm. (Mega-Evolution)",
		megaStone: "Redhelm Arzuros",
		megaEvolves: "Arzuros",
		itemUser: ["Arzuros", "Redhelm Arzuros"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		spritenum: 585,
	},
	astalite: {
		name: "Astalite",
		gen: 9,
		shortDesc: "If held by Asatalos, allows it to transform into Boltreaver. (Mega-Evolution)",
		megaStone: "Boltreaver Astalos",
		megaEvolves: "Astalos",
		itemUser: ["Astalos", "Boltreaver Astalos"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		spritenum: 613,
	},
	bazelnite: {
		name: "Bazelnite",
		gen: 9,
		shortDesc: "If held by Bazelgeuse, allows it to transform into Seething. (Mega-Evolution)",
		megaStone: "Seething Bazelgeuse",
		megaEvolves: "Bazelgeuse",
		itemUser: ["Bazelgeuse", "Seething Bazelgeuse"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		spritenum: 591,
	},
	bariothite: {
		name: "Bariothite",
		gen: 9,
		shortDesc: "If held by Barioth, allows it to transform into Frostfang. (Mega-Evolution)",
		megaStone: "Frostfang Barioth",
		megaEvolves: "Barioth",
		itemUser: ["Barioth", "Frostfang Barioth"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		spritenum: 685,
	},
	brachylite: {
		name: "Brachylite",
		gen: 9,
		shortDesc: "If held by Brachydios, allows it to transform into Raging. (Mega-Evolution)",
		megaStone: "Raging Brachydios",
		megaEvolves: "Brachydios",
		itemUser: ["Brachydios", "Raging Brachydios"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		spritenum: 613,
	},
	devilite: {
		name: "Devilite",
		gen: 9,
		shortDesc: "If held by Deviljho, allows it to transform into Savage. (Mega-Evolution)",
		megaStone: "Savage Deviljho",
		megaEvolves: "Deviljho",
		itemUser: ["Deviljho", "Savage Deviljho"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		spritenum: 584,
	},
	diablite: {
		name: "Diablite",
		gen: 9,
		shortDesc: "If held by Diablos, allows it to transform into Massacre. (Mega-Evolution)",
		megaStone: "Massacre Diablos",
		megaEvolves: "Diablos",
		itemUser: ["Diablos", "Massacre Diablos"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		spritenum: 589,
	},
	gammothite: {
		name: "Gammothite",
		gen: 9,
		shortDesc: "If held by Gammoth, allows her to transform into Elderfrost. (Mega-Evolution)",
		megaStone: "Elderfrost Gammoth",
		megaEvolves: "Gammoth",
		itemUser: ["Gammoth", "Elderfrost Gammoth"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		spritenum: 623,
	},
	garugite: {
		name: "Garugite",
		gen: 9,
		shortDesc: "If held by Yian Garuga, allows it to transform into Deadeye. (Mega-Evolution)",
		megaStone: "Deadeye Garuga",
		megaEvolves: "Yian Garuga",
		itemUser: ["Yian Garuga", "Deadeye Garuga"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		spritenum: 577,
	},
	harudomerite: {
		name: "Harudomerite",
		gen: 9,
		shortDesc: "If held by Harudomerugu, allows it to enter it's Zenith Form. (Mega-Evolution)",
		megaStone: "Harudomerugu-Z",
		megaEvolves: "Harudomerugu",
		itemUser: ["Harudomerugu", "Harudomerugu-Z"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		spritenum: 578,
	},
	inagamite: {
		name: "Inagamite",
		gen: 9,
		shortDesc: "If held by Inagami, allows it to enter it's Zenith Form. (Mega-Evolution)",
		megaStone: "Inagami-Z",
		megaEvolves: "Inagami",
		itemUser: ["Inagami", "Inagami-Z"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		spritenum: 613,
	},
	lagialite: {
		name: "Lagialite",
		gen: 9,
		shortDesc: "If held by Lagiacrus, allows it to transform into Abyssal. (Mega-Evolution)",
		megaStone: "Abyssal Lagiacrus",
		megaEvolves: "Lagiacrus",
		itemUser: ["Lagiacrus", "Abyssal Lagiacrus"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		spritenum: 585,
	},
	lagombite: {
		name: "Lagombite",
		gen: 9,
		shortDesc: "If held by Lagombi, allows it to transform into Snowbaron. (Mega-Evolution)",
		megaStone: "Snowbaron Lagombi",
		megaEvolves: "Lagombi",
		itemUser: ["Lagombi", "Snowbaron Lagombi"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		spritenum: 583,
	},
	magnamalite: {
		name: "Magnamalite",
		gen: 9,
		shortDesc: "If held by Magnamalo, allows it to transform into Scorned. (Mega-Evolution)",
		megaStone: "Scorned Magnamalo",
		megaEvolves: "Magnamalo",
		itemUser: ["Magnamalo", "Scorned Magnamalo"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		spritenum: 614,
	},
	malfestite: {
		name: "Malfestite",
		gen: 9,
		shortDesc: "If held by Malfestio, allows it to transform into Nightcloak. (Mega-Evolution)",
		megaStone: "Nightcloak Malfestio",
		megaEvolves: "Malfestio",
		itemUser: ["Malfestio", "Nightcloak Malfestio"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		spritenum: 577,
	},
	mizutsunite: {
		name: "Mizutsunite",
		gen: 9,
		shortDesc: "If held by Mizutsune, allows it to transform into Soulseer. (Mega-Evolution)",
		megaStone: "Soulseer Mizutsune",
		megaEvolves: "Mizutsune",
		itemUser: ["Mizutsune", "Soulseer Mizutsune"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		spritenum: 624,
	},
	narwanite: {
		name: "Narwanite",
		gen: 9,
		shortDesc: "If held by Narwa, allows it to transform into Allmother. (Mega-Evolution)",
		megaStone: "Allmother Narwa",
		megaEvolves: "Narwa",
		itemUser: ["Narwa", "Allmother Narwa"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		spritenum: 596,
	},
	plesite: {
		name: "Plesite",
		gen: 9,
		shortDesc: "If held by Plesioth, allows it to enter it's Zenith Form. (Mega-Evolution)",
		megaStone: "Plesioth-Z",
		megaEvolves: "Plesioth",
		itemUser: ["Plesioth", "Plesioth-Z"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		spritenum: 621,
	},
	rajanite: {
		name: "Rajanite",
		gen: 9,
		shortDesc: "If held by Rajang, allows it to transform into Furious. (Mega-Evolution)",
		megaStone: "Furious Rajang",
		megaEvolves: "Rajang",
		itemUser: ["Rajang", "Furious Rajang"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		spritenum: 602,
	},
	rathalosite: {
		name: "Rathalosite",
		gen: 9,
		shortDesc: "If held by Rathalos, allows it to transform into Dreadking. (Mega-Evolution)",
		megaStone: "Dreadking Rathalos",
		megaEvolves: "Rathalos",
		itemUser: ["Rathalos", "Dreadking Rathalos"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		spritenum: 586,
	},
	rathianite: {
		name: "Rathianite",
		gen: 9,
		shortDesc: "If held by Rathian, allows it to transform into Dreadqueen. (Mega-Evolution)",
		megaStone: "Dreadqueen Rathian",
		megaEvolves: "Rathian",
		itemUser: ["Rathian", "Dreadqueen Rathian"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		spritenum: 607,
	},
	risenitec: {
		name: "Risenite-C",
		gen: 9,
		shortDesc: "If held by Chameleos, allows it to enter it's Risen Form. (Mega-Evolution)",
		megaStone: "Risen Chameleos",
		megaEvolves: "Chameleos",
		itemUser: ["Chameleos", "Risen Chameleos"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		spritenum: 590,
	},
	risenitek: {
		name: "Risenite-K",
		gen: 9,
		shortDesc: "If held by Kushala, allows it to enter it's Risen Form. (Mega-Evolution)",
		megaStone: "Risen Kushala",
		megaEvolves: "Kushala Daora",
		itemUser: ["Kushala Daora", "Risen Kushala"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		spritenum: 590,
	},
	risenitet: {
		name: "Risenite-T",
		gen: 9,
		shortDesc: "If held by Teostra, allows it to enter it's Risen Form. (Mega-Evolution)",
		megaStone: "Risen Teostra",
		megaEvolves: "Teostra",
		itemUser: ["Teostra", "Risen Teostra"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		spritenum: 590,
	},
	risenites: {
		name: "Risenite-S",
		gen: 9,
		shortDesc: "If held by Shagaru Magala, allows it to enter it's Risen Form. (Mega-Evolution)",
		megaStone: "Risen Shagaru",
		megaEvolves: "Shagaru Magala",
		itemUser: ["Shagaru Magala", "Risen Shagaru"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		spritenum: 590,
	},
	tigrexite: {
		name: "Tigrexite",
		gen: 9,
		shortDesc: "If held by Tigrex, allows it to transform into Grimclaw. (Mega-Evolution)",
		megaStone: "Grimclaw Tigrex",
		megaEvolves: "Tigrex",
		itemUser: ["Tigrex", "Grimclaw Tigrex"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		spritenum: 619,
	},
	zinogrite: {
		name: "Zinogrite",
		gen: 9,
		shortDesc: "If held by Zinogre, allows it to transform into Thunderlord. (Mega-Evolution)",
		megaStone: "Thunderlord Zinogre",
		megaEvolves: "Zinogre",
		itemUser: ["Zinogre", "Thunderlord Zinogre"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		spritenum: 590,
	},
	kirinite: {
		name: "Kirinite",
		gen: 9,
		shortDesc: "If held by Kirin, allows it to transform into Emperor. (Mega-Evolution)",
		megaStone: "Emperor Kirin",
		megaEvolves: "Kirin",
		itemUser: ["Kirin", "Emperor Kirin"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		spritenum: 602,
	},
	uragaanite: {
		name: "Uragaanite",
		gen: 9,
		shortDesc: "If held by Uragaan, allows it to transform into Crystalbeard. (Mega-Evolution)",
		megaStone: "Crystalbeard Uragaan",
		megaEvolves: "Uragaan",
		itemUser: ["Uragaan", "Crystalbeard Uragaan"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		spritenum: 663,
	},
	daimyite: {
		name: "Daimyite",
		gen: 9,
		shortDesc: "If held by Daimyo Hermitaur, allows it to transform into Stonefist. (Mega-Evolution)",
		megaStone: "Stonefist Daimyo",
		megaEvolves: "Daimyo Hermitaur",
		itemUser: ["Daimyo Hermitaur", "Stonefist Daimyo"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		spritenum: 612,
	},
	glavenite: {
		name: "Glavenite",
		gen: 9,
		shortDesc: "If held by Glavenus, allows it to transform into Hellblade. (Mega-Evolution)",
		megaStone: "Hellblade Glavenus",
		megaEvolves: "Glavenus",
		itemUser: ["Glavenus", "Hellblade Glavenus"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		spritenum: 586,
	},
	/*
	Fatalis Orbs
	*/
	crimsongem: {
		name: "Crimson Gem",
		gen: 9,
		shortDesc: "If held by Fatalis, triggers its Crimson Form in battle. (Primal Reversion)",
		itemUser: ["Fatalis", "Crimson-Fatalis"],
		onSwitchIn(pokemon) {
			if (pokemon.isActive && pokemon.baseSpecies.name === 'Fatalis' && !pokemon.transformed) {
				pokemon.formeChange('Crimson-Fatalis', this.effect, true);
			}
		},
		onTakeItem(item, source) {
			if (source.baseSpecies.baseSpecies === 'Fatalis') return false;
			return true;
		},
	},
	whitegem: {
		name: "White Gem",
		gen: 9,
		shortDesc: "If held by Fatalis, triggers its Crimson Form in battle. (Primal Reversion)",
		itemUser: ["Fatalis", "White-Fatalis"],
		onSwitchIn(pokemon) {
			if (pokemon.isActive && pokemon.baseSpecies.name === 'Fatalis' && !pokemon.transformed) {
				pokemon.formeChange('White-Fatalis', this.effect, true);
			}
		},
		onTakeItem(item, source) {
			if (source.baseSpecies.baseSpecies === 'Fatalis') return false;
			return true;
		},
	},
};
