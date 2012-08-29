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
		this.data.Learnsets.shuckle.learnset.leechseed = ['5L100'];

		// Roserade gets Smog
		this.data.Learnsets.roserade.learnset.smog = ['5L100'];

		// Volcarona nerf: Tail Glow instead of Quiver Dance
		delete this.data.Learnsets.volcarona.learnset.quiverdance;
		this.data.Learnsets.volcarona.learnset.tailglow = ['5L100'];

		// Meloetta: Fiery Dance
		this.data.Learnsets.meloetta.learnset.fierydance = ['5L100'];

		// Scolipede, Milotic: Coil
		this.data.Learnsets.milotic.learnset.coil = ['5L100'];
		this.data.Learnsets.scolipede.learnset.coil = ['5L100'];

		// Every DW ability that isn't Shadow Tag becomes released
		for (var i in this.data.FormatsData) {
			if (i !== 'chandelure' && i !== 'gothitelle') {
				this.data.FormatsData[i].dreamWorldRelease = true;
			}
		}
	}
};
