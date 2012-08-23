exports.BattleScripts = {
	init: function() {
		// Give Hurricane to all the Bug/Flying Quiver-dancers
		// Precedent: Volcarona
		this.data.Learnsets.masquerain.learnset.hurricane = ['5L100'];
		this.data.Learnsets.butterfree.learnset.hurricane = ['5L100'];
		this.data.Learnsets.beautifly.learnset.hurricane = ['5L100'];
		this.data.Learnsets.mothim.learnset.hurricane = ['5L100'];

		// Masquerain also gets Surf because we want it to be viable
		this.data.Learnsets.masquerain.learnset.surf = ['5M'];

		// Aerodactyl gets Brave Bird
		this.data.Learnsets.aerodactyl.learnset.bravebird = ['5L100'];

		// Shuckle gets Leech Seed
		this.data.Learnsets.aerodactyl.learnset.leechseed = ['5L100'];
	}
}
