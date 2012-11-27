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

		// Roserade gets Sludge
		this.data.Learnsets.roserade.learnset.sludge = ['5L100'];

		// Meloetta: Fiery Dance
		this.data.Learnsets.meloetta.learnset.fierydance = ['5L100'];

		// Galvantula: Zap Cannon
		this.data.Learnsets.galvantula.learnset.zapcannon = ['5L100'];

		// Scolipede, Milotic, Steelix: Coil
		this.data.Learnsets.milotic.learnset.coil = ['5L100'];
		this.data.Learnsets.scolipede.learnset.coil = ['5L100'];
		this.data.Learnsets.steelix.learnset.coil = ['5L100'];

		// Rotoms: lots of moves
		this.data.Learnsets.rotomwash.learnset.bubblebeam = ['5L100'];
		this.data.Learnsets.rotomfan.learnset.hurricane = ['5L100'];
		this.data.Learnsets.rotomfan.learnset.twister = ['5L100'];
		this.data.Learnsets.rotomfrost.learnset.frostbreath = ['5L100'];
		this.data.Learnsets.rotomheat.learnset.heatwave = ['5L100'];
		this.data.Learnsets.rotommow.learnset.magicalleaf = ['5L100'];

		// Zororark: much wider movepool
		this.data.Learnsets.zoroark.learnset.earthquake = ['5M'];
		this.data.Learnsets.zoroark.learnset.stoneedge = ['5M'];
		this.data.Learnsets.zoroark.learnset.icebeam = ['5M'];
		this.data.Learnsets.zoroark.learnset.xscissor = ['5M'];
		this.data.Learnsets.zoroark.learnset.gigadrain = ['5T'];
		this.data.Learnsets.zoroark.learnset.superpower = ['5T'];

		// Aipom: eggSketch! :D
		this.data.Learnsets.aipom.learnset.sketch = ['5E'];

		// Azumarill: free Belly Drum
		this.data.Learnsets.azumarill.learnset.bellydrum = ['5L100'];

		// Every DW ability that isn't Shadow Tag becomes released
		for (var i in this.data.FormatsData) {
			if (i !== 'chandelure' && i !== 'gothitelle') {
				this.data.FormatsData[i].dreamWorldRelease = true;
			}
		}
	}
};
