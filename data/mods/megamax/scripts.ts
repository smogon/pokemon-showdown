export const BattleScripts: ModdedBattleScriptsData = {
	gen: 8,
	init() {
		for (const i in this.data.FormatsData) {
			if (i.endsWith('gmax')) this.modData('FormatsData', i).tier = "OU";
		}
		this.modData('FormatsData', 'melmetalgmax').isNonstandard = null;

		this.modData('Learnsets', 'venusaur').learnset.gunkshot = ["8M"];
		this.modData('Learnsets', 'charizard').learnset.lavaplume = ["8M"];
		this.modData('Learnsets', 'charizard').learnset.whirlwind = ["8M"];
		this.modData('Learnsets', 'butterfree').learnset.moonblast = ["8M"];
		this.modData('Learnsets', 'butterfree').learnset.moonlight = ["8M"];
		// Pikachu validation is handled in the base format's `checkLearnset` due to it being a middle-stage Pokemon
		// Meowth validation is handled in the base format's `checkLearnset` due to it being a middle-stage Pokemon
		this.modData('Learnsets', 'machamp').learnset.blazekick = ["8M"];
		this.modData('Learnsets', 'gengar').learnset.hypervoice = ["8M"];
		this.modData('Learnsets', 'gengar').learnset.spiritshackle = ["8M"];
		this.modData('Learnsets', 'kingler').learnset.crosspoison = ["8M"];
		this.modData('Learnsets', 'kingler').learnset.poisonjab = ["8M"];
		this.modData('Learnsets', 'kingler').learnset.sludgebomb = ["8M"];
		this.modData('Learnsets', 'lapras').learnset.auroraveil = ["8M"];
		this.modData('Learnsets', 'lapras').learnset.recover = ["8M"];
		// Eevee validation is handled in the base format's `checkLearnset` due to it being a middle-stage Pokemon
		this.modData('Learnsets', 'snorlax').learnset.mirrorcoat = ["8M"];
		this.modData('Learnsets', 'snorlax').learnset.playrough = ["8M"];
		this.modData('Learnsets', 'snorlax').learnset.woodhammer = ["8M"];
		this.modData('Learnsets', 'garbodor').learnset.stealthrock = ["8M"];
		this.modData('Learnsets', 'garbodor').learnset.earthquake = ["8M"];
		this.modData('Learnsets', 'garbodor').learnset.irondefense = ["8M"];
		this.modData('Learnsets', 'rillaboom').learnset.stealthrock = ["8M"];
		this.modData('Learnsets', 'rillaboom').learnset.headsmash = ["8M"];
		this.modData('Learnsets', 'cinderace').learnset.willowisp = ["8M"];
		this.modData('Learnsets', 'inteleon').learnset.nightslash = ["8M"];
		this.modData('Learnsets', 'inteleon').learnset.psychocut = ["8M"];
		this.modData('Learnsets', 'inteleon').learnset.crosspoison = ["8M"];
		this.modData('Learnsets', 'corviknight').learnset.whirlwind = ["8M"];
		this.modData('Learnsets', 'orbeetle').learnset.nastyplot = ["8M"];
		this.modData('Learnsets', 'orbeetle').learnset.teleport = ["8M"];
		this.modData('Learnsets', 'orbeetle').learnset.whirlwind = ["8M"];
		this.modData('Learnsets', 'drednaw').learnset.closecombat = ["8M"];
		this.modData('Learnsets', 'coalossal').learnset.doubleedge = ["8M"];
		this.modData('Learnsets', 'coalossal').learnset.headsmash = ["8M"];
		this.modData('Learnsets', 'flapple').learnset.earthquake = ["8M"];
		this.modData('Learnsets', 'appletun').learnset.earthpower = ["8M"];
		this.modData('Learnsets', 'appletun').learnset.flamethrower = ["8M"];
		this.modData('Learnsets', 'appletun').learnset.leafstorm = ["8M"];
		this.modData('Learnsets', 'sandaconda').learnset.bodyslam = ["8M"];
		this.modData('Learnsets', 'sandaconda').learnset.flamethrower = ["8M"];
		this.modData('Learnsets', 'sandaconda').learnset.shoreup = ["8M"];
		this.modData('Learnsets', 'toxtricity').learnset.dracometeor = ["8T"];
		this.modData('Learnsets', 'toxtricitylowkey').learnset.dracometeor = ["8T"];
		this.modData('Learnsets', 'centiskorch').learnset.earthquake = ["8M"];
		this.modData('Learnsets', 'centiskorch').learnset.magmastorm = ["8M"];
		this.modData('Learnsets', 'hatterene').learnset.moonblast = ["8M"];
		this.modData('Learnsets', 'hatterene').learnset.gravity = ["8M"];
		this.modData('Learnsets', 'grimmsnarl').learnset.yawn = ["8M"];
		this.modData('Learnsets', 'grimmsnarl').learnset.honeclaws = ["8M"];
		this.modData('Learnsets', 'alcremie').learnset.icebeam = ["8M"];
		this.modData('Learnsets', 'alcremie').learnset.moonblast = ["8M"];
		this.modData('Learnsets', 'alcremie').learnset.stockpile = ["8M"];
		this.modData('Learnsets', 'copperajah').learnset.gyroball = ["8M"];
		this.modData('Learnsets', 'copperajah').learnset.liquidation = ["8M"];
		this.modData('Learnsets', 'copperajah').learnset.coppermines = ["8M"];
		this.modData('Learnsets', 'duraludon').learnset.aurasphere = ["8M"];
		this.modData('Learnsets', 'duraludon').learnset.waterpulse = ["8M"];
		this.modData('Learnsets', 'urshifu').learnset.psychup = ["8M"];
	},
	canMegaEvo(pokemon) {
		const altForme = pokemon.baseSpecies.otherFormes && this.dex.getSpecies(pokemon.baseSpecies.otherFormes[0]);
		const item = pokemon.getItem();
		if (
			altForme?.isMega && altForme?.requiredMove &&
			pokemon.baseMoves.includes(toID(altForme.requiredMove)) && !item.zMove
		) {
			return altForme.name;
		}
		if (item.name === "Urshifusite" && pokemon.baseSpecies.name === "Urshifu-Rapid-Strike") {
			return "Urshifu-Rapid-Strike-Gmax";
		}
		if (item.name === "Toxtricitite" && pokemon.baseSpecies.name === "Toxtricity-Low-Key") {
			return "Toxtricity-Low-Key-Gmax";
		}
		if (item.megaEvolves !== pokemon.baseSpecies.name || item.megaStone === pokemon.species.name) {
			return null;
		}
		return item.megaStone;
	},
	runMegaEvo(pokemon) {
		const speciesid = pokemon.canMegaEvo || pokemon.canUltraBurst;
		if (!speciesid) return false;
		const side = pokemon.side;

		// Pokémon affected by Sky Drop cannot mega evolve. Enforce it here for now.
		for (const foeActive of side.foe.active) {
			if (foeActive.volatiles['skydrop'] && foeActive.volatiles['skydrop'].source === pokemon) {
				return false;
			}
		}

		pokemon.formeChange(speciesid, pokemon.getItem(), true);

		// Limit one mega evolution
		const wasMega = pokemon.canMegaEvo;
		for (const ally of side.pokemon) {
			if (wasMega) {
				ally.canMegaEvo = null;
			} else {
				ally.canUltraBurst = null;
			}
		}

		this.runEvent('AfterMega', pokemon);
		const baseTypes = this.dex.mod('gen8').getSpecies(pokemon.baseSpecies).types.join('/');
		if (pokemon.types.join('/') !== baseTypes) this.add('-start', pokemon, 'typechange', pokemon.types.join('/'));
		return true;
	},
};
