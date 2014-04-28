/**
 * This is the theorymon mod for OU Theorymon (http://www.smogon.com/forums/threads/the-ou-theorymon-project-psychic-fairy-cresselia.3499219/)
 * Each month about 8 Pokémon are changed to fit the OU metagame and tested within.
 */
exports.BattleScripts = {
	gen: 6,
	init: function () {
		// March theorymons
		this.modData('Pokedex', 'gourgeist').abilities = {0: 'Flash Fire'};
		this.modData('Pokedex', 'snorlax').abilities = {0: 'Poison Heal'};
		this.modData('Pokedex', 'drapion').abilities = {0: 'Tough Claws'};
		this.modData('Pokedex', 'milotic').types = ['Water', 'Fairy'];
		this.modData('Pokedex', 'registeel').abilities = {0: 'Regenerator'};

		// April theorymons
		this.modData('Pokedex', 'eelektross').types = ['Electric', 'Poison'];
		this.modData('Pokedex', 'escavalier').abilities = {0: 'Dry Skin'};
		this.modData('Pokedex', 'luxray').types = ['Electric', 'Dark'];
		this.modData('Pokedex', 'salamence').abilities = {0: 'Gale Wings'};
		this.modData('Pokedex', 'kyurem').abilities = {0: 'Snow Warning'};
	}
};
