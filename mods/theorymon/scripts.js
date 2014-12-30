exports.BattleScripts = {
	init: function () {
			this.modData('Pokedex', 'archeops').abilities['1'] = 'Vital Spirit';
			this.modData('Pokedex', 'porygonz').types = ['Normal', 'Ghost'];
			this.modData('Pokedex', 'weezing').types = ['Poison', 'Steel'];
			this.modData('Pokedex', 'moltres').abilities['1'] = 'Magic Guard';
			this.modData('Pokedex', 'abomasnowmega').abilities['1'] = 'Technician';
			this.modData('Pokedex', 'cradily').abilities['1'] = 'Sand Stream';
			this.modData('Pokedex', 'froslass').abilities['1'] = 'Prankster';
			this.modData('Learnsets', 'absol').learnset.partingshot = ['5L1'];
			this.modData('Pokedex', 'goodra').abilities['1'] = 'Protean';
			this.modData('Pokedex', 'entei').abilities['1'] = 'Defiant';
			this.modData('Pokedex', 'milotic').abilities['1'] = 'Multiscale';
			this.modData('Pokedex', 'empoleon').abilities['1'] = 'Lightningrod';
			this.modData('Learnsets', 'reuniclus').learnset.voltswitch = ['5L1'];
		    this.modData('Pokedex', 'steelix-mega').abilities['1'] = 'Arena Trap';
		}
	};
