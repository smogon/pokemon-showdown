'use strict';

/**@type {ModdedBattleScriptsData} */
let BattleScripts = {
	init() {
		// MEGA POKEMON ABILITY MODS
		this.modData('Pokedex', 'houndoommega').abilities['0'] = 'Sheer Force';
		this.modData('Pokedex', 'audinomega').abilities['1'] = 'Regenerator';
		this.modData('Pokedex', 'steelixmega').abilities['1'] = 'Solid Rock';
		this.modData('Pokedex', 'slowbromega').abilities['1'] = 'Regenerator';

		// OTHER POKEMON ABILITY MODS
		this.modData('Pokedex', 'golisopod').abilities['1'] = 'Swift Swim';
		this.modData('Pokedex', 'golisopod').abilities['2'] = 'Intimidate';
		this.modData('Pokedex', 'volcanion').abilities['2'] = 'Chlorophyll';
		this.modData('Pokedex', 'rapidash').abilities['1'] = 'Chlorophyll';
		this.modData('Pokedex', 'moltres').abilities['2'] = 'Chlorophyll';
		this.modData('Pokedex', 'oddish').abilities['H'] = 'Regenerator';
		this.modData('Pokedex', 'gloom').abilities['H'] = 'Regenerator';
		this.modData('Pokedex', 'vileplume').abilities['2'] = 'Regenerator';
		this.modData('Pokedex', 'bellossom').abilities['H'] = 'Regenerator';
		this.modData('Pokedex', 'slaking').abilities['1'] = 'Scrappy';
		this.modData('Pokedex', 'archeops').abilities['0'] = 'Aerialate';

		// Zen Mode Darmanitan with Magic Guard: Needs Some Code Research
		// this.modData('Pokedex', 'darmanitanzen').abilities['H'] = 'magicguard';

		// ROTOM FORME ABILITY MODS
		this.modData('Pokedex', 'rotom').abilities['1'] = 'Adaptability';
		this.modData('Pokedex', 'rotomwash').abilities['1'] = 'Drizzle';
		this.modData('Pokedex', 'rotomheat').abilities['1'] = 'Drought';
		this.modData('Pokedex', 'rotomfan').abilities['1'] = 'Aerialate';
		this.modData('Pokedex', 'rotomfrost').abilities['1'] = 'Refridgerate';

		// Rotom Mow NOTE: To Be Fair, this Pokemon should have a different ability,
		// as Sap Sipper raise the Attack Stat, and Rotom Mow has Base Attack of 65...
		// Apparently it is a Serperior Check. (Ignore HP Fire)

		this.modData('Pokedex', 'rotommow').abilities['1'] = 'Sap Sipper';

		// LEARN SETS MODS
		this.modData('Learnsets', 'abomasnow').learnset.auroraveil = ['7L100'];
		this.modData('Learnsets', 'keldeo').learnset.icebeam = ['7L100'];
		this.modData('Learnsets', 'zapdos').learnset.hurricane = ['7L100'];
		this.modData('Learnsets', 'mantine').learnset.hurricane = ['7L100'];
		this.modData('Learnsets', 'tyranitar').learnset.knockoff = ['7L100'];
		this.modData('Learnsets', 'steelix').learnset.shiftgear = ['7L100'];
		this.modData('Learnsets', 'victreebel').learnset.solarblade = ['7L100'];
		this.modData('Learnsets', 'leafeon').learnset.solarblade = ['7L100'];
		this.modData('Learnsets', 'rotom').learnset.hypervoice = ['7L100'];
		this.modData('Learnsets', 'rotomwash').learnset.hypervoice = ['7L100'];
		this.modData('Learnsets', 'rotomheat').learnset.hypervoice = ['7L100'];
		this.modData('Learnsets', 'rotomfan').learnset.hypervoice = ['7L100'];
		this.modData('Learnsets', 'rotomfrost').learnset.hypervoice = ['7L100'];
		this.modData('Learnsets', 'rotommow').learnset.hypervoice = ['7L100'];

		// Ice Shard NOTE: Every Pokemon can learn it. This is rather easier,
		// but will take some time code, as I have to do each Pokemon individually.
		// As of now, only Kyurem Black has it. Everything else is low priority.

		this.modData('Learnsets', 'kyuremblack').learnset.iceshard = ['7L100'];

	// 	//MOD TEMPLATES
	// 	// 1 Type Mod
	// 	this.modData('Pokedex', 'POKEMON').types = ['TYPE1'];
	// 	// 2 Types Mod
	// 	this.modData('Pokedex', 'POKEMON').types = ['TYPE1', 'TYPE2'];
	// 	// Learn Set Mod
	// 	this.modData('Learnsets', 'POKEMON').learnset.MOVE = ['GEN#, L, LEVEL#'];
	// 	// Ability Mod
	// 	this.modData('Pokedex', 'POKEMON').abilities['2, 2, o rH'] = 'ABILITY';
	//
	},
};

exports.BattleScripts = BattleScripts;

