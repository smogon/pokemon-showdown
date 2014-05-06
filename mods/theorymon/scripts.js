/**
 * This is the mod for OU Theorymon (https://smogon.com/forums/threads/3499219/)
 * Each month roughly 6 Pokémon are changed to fit the OU metagame and tested within.
 */
exports.BattleScripts = {
	gen: 6,
	init: function () {
		// March theorymons
		this.modData('Pokedex', 'gourgeist').abilities['0'] = 'Flash Fire';
		this.modData('Pokedex', 'snorlax').abilities['0'] = 'Poison Heal';
		this.modData('Pokedex', 'drapion').abilities['1'] = 'Tough Claws';
		this.modData('Pokedex', 'milotic').types = ['Water', 'Fairy'];
		this.modData('Pokedex', 'registeel').abilities['0'] = 'Regenerator';

		// April theorymons
		this.modData('Pokedex', 'eelektross').types = ['Electric', 'Poison'];
		this.modData('Pokedex', 'escavalier').abilities['1'] = 'Dry Skin';
		this.modData('Pokedex', 'luxray').types = ['Electric', 'Dark'];
		this.modData('Pokedex', 'salamence').abilities['1'] = 'Gale Wings';
		this.modData('Pokedex', 'kyurem').abilities['1'] = 'Snow Warning';
		this.modData('Pokedex', 'togekiss').abilities['0'] = 'Thick Fat';
	}
};
