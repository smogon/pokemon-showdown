/**
 * This is the theorymon mod for OU Theorymon (http://www.smogon.com/forums/threads/the-ou-theorymon-project-psychic-fairy-cresselia.3499219/)
 * Each month about 8 Pokémon are changed to fit the OU metagame and tested within.
 */
exports.BattleScripts = {
	gen: 6,
	init: function() {
		this.modData('Pokedex', 'ampharosmega').abilities = {0: 'Regenerator'};
		this.modData('Pokedex', 'mismagius').types = ['Ghost', 'Fairy'];
		this.modData('Learnsets', 'empoleon').learnset.roost = ['6L100'];
		this.modData('Pokedex', 'altaria').types = ['Dragon', 'Fairy'];
		this.modData('Learnsets', 'scrafty').learnset.partingshot = ['6L100'];
		this.modData('Pokedex', 'metagross').abilities = {0: 'Bulletproof'};
		this.modData('Pokedex', 'cresselia').types = ['Psychic', 'Fairy'];
	}
};
