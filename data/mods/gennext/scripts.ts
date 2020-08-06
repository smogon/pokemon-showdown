export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen6',
	init() {
		this.modData('Pokedex', 'cherrimsunshine').types = ['Grass', 'Fire'];

		// Give Hurricane to all the Bug/Flying Quiver-dancers
		// Precedent: Volcarona
		this.modData('Learnsets', 'masquerain').learnset.hurricane = ['5L100'];
		this.modData('Learnsets', 'butterfree').learnset.hurricane = ['5L100'];
		this.modData('Learnsets', 'beautifly').learnset.hurricane = ['5L100'];
		this.modData('Learnsets', 'mothim').learnset.hurricane = ['5L100'];

		// Masquerain also gets Surf because we want it to be viable
		this.modData('Learnsets', 'masquerain').learnset.surf = ['5M'];

		// Roserade gets Sludge
		this.modData('Learnsets', 'roserade').learnset.sludge = ['5L100'];

		// Meloetta: Fiery Dance
		this.modData('Learnsets', 'meloetta').learnset.fierydance = ['5L100'];

		// Galvantula: Zap Cannon
		this.modData('Learnsets', 'galvantula').learnset.zapcannon = ['5L100'];

		// Virizion: Horn Leech
		this.modData('Learnsets', 'virizion').learnset.hornleech = ['5L100'];

		// Scolipede, Milotic, Steelix: Coil
		this.modData('Learnsets', 'milotic').learnset.coil = ['5L100'];
		this.modData('Learnsets', 'scolipede').learnset.coil = ['5L100'];
		this.modData('Learnsets', 'steelix').learnset.coil = ['5L100'];

		// Rotoms: lots of moves
		this.modData('Learnsets', 'rotomwash').learnset.bubblebeam = ['5L100'];
		this.modData('Learnsets', 'rotomfan').learnset.hurricane = ['5L100'];
		this.modData('Learnsets', 'rotomfan').learnset.twister = ['5L100'];
		this.modData('Learnsets', 'rotomfrost').learnset.frostbreath = ['5L100'];
		this.modData('Learnsets', 'rotomheat').learnset.heatwave = ['5L100'];
		this.modData('Learnsets', 'rotommow').learnset.magicalleaf = ['5L100'];

		// Zororark: much wider movepool
		this.modData('Learnsets', 'zoroark').learnset.earthquake = ['5M'];
		this.modData('Learnsets', 'zoroark').learnset.stoneedge = ['5M'];
		this.modData('Learnsets', 'zoroark').learnset.icebeam = ['5M'];
		this.modData('Learnsets', 'zoroark').learnset.xscissor = ['5M'];
		this.modData('Learnsets', 'zoroark').learnset.gigadrain = ['5T'];
		this.modData('Learnsets', 'zoroark').learnset.superpower = ['5T'];

		// Mantine: lots of moves
		this.modData('Learnsets', 'mantine').learnset.recover = ['5L100'];
		this.modData('Learnsets', 'mantine').learnset.whirlwind = ['5L100'];
		this.modData('Learnsets', 'mantine').learnset.batonpass = ['5L100'];
		this.modData('Learnsets', 'mantine').learnset.wish = ['5L100'];
		this.modData('Learnsets', 'mantine').learnset.soak = ['5L100'];
		this.modData('Learnsets', 'mantine').learnset.lockon = ['5L100'];
		this.modData('Learnsets', 'mantine').learnset.acidspray = ['5L100'];
		this.modData('Learnsets', 'mantine').learnset.octazooka = ['5L100'];
		this.modData('Learnsets', 'mantine').learnset.stockpile = ['5L100'];

		// eggSketch! :D
		this.modData('Learnsets', 'aipom').learnset.sketch = ['5E'];
		this.modData('Learnsets', 'spinda').learnset.sketch = ['5E'];
		this.modData('Learnsets', 'mimejr').learnset.sketch = ['5E'];

		// Tail Glow :D
		this.modData('Learnsets', 'finneon').learnset.tailglow = ['5L100'];
		this.modData('Learnsets', 'lumineon').learnset.tailglow = ['5L100'];
		this.modData('Learnsets', 'mareep').learnset.tailglow = ['5L100'];
		this.modData('Learnsets', 'ampharos').learnset.tailglow = ['5L100'];
		this.modData('Learnsets', 'chinchou').learnset.tailglow = ['5L100'];
		this.modData('Learnsets', 'lanturn').learnset.tailglow = ['5L100'];

		// Spinda: Contrary
		this.modData('Learnsets', 'spinda').learnset.vcreate = ['5L100'];
		this.modData('Learnsets', 'spinda').learnset.superpower = ['5L100'];
		this.modData('Learnsets', 'spinda').learnset.closecombat = ['5L100'];
		this.modData('Learnsets', 'spinda').learnset.overheat = ['5L100'];
		this.modData('Learnsets', 'spinda').learnset.leafstorm = ['5L100'];
		this.modData('Learnsets', 'spinda').learnset.dracometeor = ['5L100'];

		// Venusaur
		this.modData('Pokedex', 'venusaur').abilities['1'] = 'Leaf Guard';
		// Charizard
		this.modData('Pokedex', 'charizard').abilities['1'] = 'Flame Body';
		// Blastoise
		this.modData('Pokedex', 'blastoise').abilities['1'] = 'Shell Armor';
		// Meganium
		this.modData('Pokedex', 'meganium').abilities['1'] = 'Harvest';
		// Typhlosion
		this.modData('Pokedex', 'typhlosion').abilities['1'] = 'Magma Armor';
		// Feraligatr
		this.modData('Pokedex', 'feraligatr').abilities['1'] = 'Strong Jaw';
		// Sceptile
		this.modData('Pokedex', 'sceptile').abilities['1'] = 'Limber';
		// Blaziken
		this.modData('Pokedex', 'blaziken').abilities['1'] = 'Reckless';
		// Swampert
		this.modData('Pokedex', 'swampert').abilities['1'] = 'Hydration';
		// Torterra
		this.modData('Pokedex', 'torterra').abilities['1'] = 'Weak Armor';
		// Infernape
		this.modData('Pokedex', 'infernape').abilities['1'] = 'No Guard';
		// Empoleon
		this.modData('Pokedex', 'empoleon').abilities['1'] = 'Ice Body';
		// Serperior
		this.modData('Pokedex', 'serperior').abilities['1'] = 'Own Tempo';
		// Emboar
		this.modData('Pokedex', 'emboar').abilities['1'] = 'Sheer Force';
		// Samurott
		this.modData('Pokedex', 'samurott').abilities['1'] = 'Technician';
		// Chesnaught
		this.modData('Pokedex', 'chesnaught').abilities['1'] = 'Battle Armor';
		// Delphox
		this.modData('Pokedex', 'delphox').abilities['1'] = 'Magic Guard';
		// Greninja
		this.modData('Pokedex', 'greninja').abilities['1'] = 'Pickpocket';

		// Levitate mons
		this.modData('Pokedex', 'unown').abilities['1'] = 'Shadow Tag';
		this.modData('Pokedex', 'flygon').abilities['1'] = 'Compound Eyes';
		this.modData('Pokedex', 'flygon').abilities['H'] = 'Sand Rush';
		this.modData('Pokedex', 'weezing').abilities['1'] = 'Aftermath';
		this.modData('Pokedex', 'eelektross').abilities['1'] = 'Poison Heal';
		this.modData('Pokedex', 'claydol').abilities['1'] = 'Filter';
		this.modData('Pokedex', 'mismagius').abilities['1'] = 'Cursed Body';
		this.modData('Pokedex', 'cryogonal').abilities['1'] = 'Ice Body';
		this.modData('Pokedex', 'mesprit').abilities['1'] = 'Serene Grace';
		this.modData('Pokedex', 'uxie').abilities['1'] = 'Synchronize';
		this.modData('Pokedex', 'azelf').abilities['1'] = 'Steadfast';
		this.modData('Pokedex', 'hydreigon').abilities['1'] = 'Sheer Force';
		// Rotoms
		this.modData('Pokedex', 'rotom').abilities['1'] = 'Trace';
		this.modData('Pokedex', 'rotomwash').abilities['1'] = 'Trace';
		this.modData('Pokedex', 'rotomheat').abilities['1'] = 'Trace';
		this.modData('Pokedex', 'rotommow').abilities['1'] = 'Trace';
		this.modData('Pokedex', 'rotomfrost').abilities['1'] = 'Trace';
		this.modData('Pokedex', 'rotomfan').abilities['1'] = 'Trace';

		// Adaptability change
		this.modData('Pokedex', 'crawdaunt').abilities['H'] = 'Tough Claws';

		// Vespiquen
		this.modData('Pokedex', 'vespiquen').abilities['1'] = 'Swarm';
	},
};
