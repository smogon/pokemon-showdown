import RandomTeams from '../../random-battles/gen9/teams';

export interface SSBSet {
	species: string;
	ability: string | string[];
	item: string | string[];
	gender: GenderName | GenderName[];
	moves: (string | string[])[];
	signatureMove: string;
	evs?: { hp?: number, atk?: number, def?: number, spa?: number, spd?: number, spe?: number };
	ivs?: { hp?: number, atk?: number, def?: number, spa?: number, spd?: number, spe?: number };
	nature?: string | string[];
	shiny?: number | boolean;
	level?: number;
	happiness?: number;
	skip?: string;
	teraType?: string | string[];
}
interface SSBSets { [k: string]: SSBSet }

export const ssbSets: SSBSets = {
	/*
	// Example:
	Username: {
		species: 'Species', ability: 'Ability', item: 'Item', gender: '',
		moves: ['Move Name', ['Move Name', 'Move Name']],
		signatureMove: 'Move Name',
		evs: {stat: number}, ivs: {stat: number}, nature: 'Nature', teraType: 'Type',
	},
	// Species, ability, and item need to be captialized properly ex: Ludicolo, Swift Swim, Life Orb
	// Gender can be M, F, N, or left as an empty string
	// each slot in moves needs to be a string (the move name, captialized properly ex: Hydro Pump), or an array of strings (also move names)
	// signatureMove also needs to be capitalized properly ex: Scripting
	// You can skip Evs (defaults to 84 all) and/or Ivs (defaults to 31 all), or just skip part of the Evs (skipped evs are 0) and/or Ivs (skipped Ivs are 31)
	// You can also skip shiny, defaults to false. Level can be skipped (defaults to 100).
	// Nature needs to be a valid nature with the first letter capitalized ex: Modest
	*/

	Finger: {
		species: 'Reuniclus', ability: 'Absolute Zen', item: 'Matter Mirror', gender: 'M',
		moves: ['Luster Purge', 'Teleport', 'Recover'],
		signatureMove: 'Mega Metronome',
		evs: { hp: 252, spa: 252, def: 4 }, nature: 'Modest',
	},
	Pablo: {
		species: 'Smeargle', ability: 'Artist Block', item: 'Sketchbook', gender: 'M',
		moves: ['Sketch', 'Copycat', 'Assist'],
		signatureMove: 'Plagiarize',
		evs: { hp: 252, spe: 252, spa: 4 }, nature: 'Naive',
	},
	Trey: {
		species: "Decidueye-Hisui", ability: "Concentration", item: "Yoichi's Bow", gender: "M",
		moves: ["Triple Arrows", "Pursuit", "Trop Kick"],
		signatureMove: "Burst Delta",
		evs: { hp: 8, atk: 252, spe: 248 }, nature: "Adamant",
	},
	'Yukari Yakumo': {
		species: 'Lunala', ability: 'Spiriting Away', item: 'Choice Scarf', gender: 'F',
		moves: ['Rest', 'Future Sight', 'Dark Pulse'],
		signatureMove: 'Shikigami Ran',
		evs: { def: 4, spa: 252, spe: 252 }, ivs: { atk: 0 }, nature: 'Timid',
	},
	Aeri: {
		species: 'Butterfree-Gmax', ability: 'Woven Together, Cohere Forever', item: 'Fleeting Winds', gender: 'F',
		moves: ['U-turn', 'Nature\'s Madness', 'Mist'],
		signatureMove: 'Blissful Breeze',
		evs: { hp: 252, spa: 4, spe: 252 }, nature: 'Timid',
	},
	Gizmo: {
		species: 'Gimmighoul-Roaming', ability: 'Head-On Battery', item: 'Inconspicuous Coin', gender: 'M',
		moves: ['Shadow Punch', 'Nuzzle', 'Charge'],
		signatureMove: 'Coin Clash',
		evs: { hp: 252, atk: 252, def: 252, spa: 252, spd: 252, spe: 252 }, nature: 'Jolly',
	},
	Gadget: {
		species: 'Gimmighoul', ability: 'Cash Grab', item: 'Everythingamajig', gender: 'M',
		moves: ['Pay Day', 'Make It Rain'],
		signatureMove: 'Capital Cannon',
		evs: { hp: 252, atk: 252, def: 252, spa: 252, spd: 252, spe: 252 }, nature: 'Rash',
	},
	Mima: {
		species: 'Mismagius', ability: 'Vengeful Spirit', item: 'Crescent Staff', gender: 'F',
		moves: ['Destiny Bond', 'Secret Sword', 'Shadow Ball'],
		signatureMove: 'Complete Darkness',
		evs: { spa: 252, spd: 4, spe: 252 }, ivs: { atk: 0 }, nature: 'Timid',
	},
	Sariel: {
		species: 'Yveltal', ability: 'Angel of Death', item: 'Leftovers', gender: 'N',
		moves: ['Recover', 'Protect', 'Foul Play'],
		signatureMove: 'Civilization of Magic',
		evs: { hp: 252, def: 4, spe: 252 }, ivs: { atk: 0 }, nature: 'Timid',
	},
	Urabrask: {
		species: 'Smokomodo', ability: 'Praetor\'s Grasp', item: 'Braid of Fire', gender: 'M',
		moves: ['Fire Lash', 'Headlong Rush', 'Spikes'],
		signatureMove: 'Terrorize the Peaks',
		evs: { atk: 252, spa: 4, spe: 252 }, nature: 'Naive',
	},
	Kozuchi: {
		species: 'Tinkaton', ability: 'Scrapworker', item: 'Forged Hammer', gender: 'F',
		moves: ['Gigaton Hammer', 'Play Rough', 'High Horsepower'],
		signatureMove: 'Weapon Enhancement',
		evs: { hp: 4, atk: 252, spe: 252 }, nature: 'Jolly',
	},
	'Prince Smurf': {
		species: 'Kecleon', ability: 'Quick Camo', item: 'Smurf\'s Crown', gender: 'M',
		moves: ['Psyshield Bash', 'Drain Punch', 'Comeuppance'],
		signatureMove: 'You Filthy Peasant',
		evs: { hp: 252, def: 196, spd: 60 }, nature: 'Careful',
	},
	'Sanae Kochiya': {
		species: 'Togekiss', ability: 'Wind Priestess', item: 'Leftovers', gender: 'F',
		moves: ['Revival Blessing', 'Sparkly Swirl', 'Oblivion Wing'],
		signatureMove: 'Miracle',
		evs: { hp: 252, def: 4, spa: 252 }, ivs: { atk: 0 }, nature: 'Modest',
	},
	'Cyclommatic Cell': {
		species: 'Vikavolt-Totem', ability: 'Battery Life', item: 'Apparatus', gender: 'N',
		moves: ['Parabolic Charge', 'Bug Buzz', 'Techno Blast'],
		signatureMove: 'Galvanic Web',
		evs: { hp: 252, spa: 252, spd: 4 }, ivs: { spe: 29 }, nature: 'Modest',
	},
	Fblthp: {
		species: 'Poliwhirl', ability: 'Lost and Found', item: 'Bubble Wand', gender: 'M',
		moves: ['Bouncy Bubble', 'Yawn', 'Helping Hand'],
		signatureMove: 'Blow and Go',
		evs: { hp: 248, spa: 140, spd: 120 }, nature: 'Modest',
	},
	Luminous: {
		species: 'Necrozma', ability: 'Blinding Light', item: 'Spectral Prism', gender: 'N',
		moves: ['Photon Geyser', 'Light of Ruin', 'Moonlight'],
		signatureMove: 'Rainbow Maxifier',
		evs: { hp: 140, def: 56, spa: 60, spd: 252 }, nature: 'Calm', shiny: true,
	},
	'Luminous-N': {
		species: 'Necrozma-Ultra', ability: 'Blinding Light', item: 'Spectral Prism', gender: 'N',
		moves: ['Photon Geyser', 'Light of Ruin', 'Moonlight'],
		signatureMove: 'Rainbow Maxifier',
		evs: { hp: 140, def: 56, spa: 60, spd: 252 }, nature: 'Calm', shiny: true, skip: 'Luminous',
	},
	'Shifu Robot': {
		species: 'Iron Thorns', ability: 'Auto Repair', item: 'Absorptive Shell', gender: 'N',
		moves: ['Techno Blast', 'Flash Cannon', 'Explosion'],
		signatureMove: 'Turbocharge',
		evs: { hp: 128, spa: 128, spe: 252 }, nature: 'Hasty',
	},
	'Kaiser Dragon': {
		species: 'Rayquaza', ability: 'Elemental Shift', item: 'Leftovers', gender: 'N',
		moves: ['Splash', 'Celebrate', 'Hold Hands'],
		signatureMove: 'Struggle',
		evs: { hp: 252, spd: 4, spe: 252 }, nature: 'Hasty', shiny: true,
	},
	'Marisa Kirisame': {
		species: 'Hatterene', ability: 'Ordinary Magician', item: '', gender: 'F',
		moves: ['Volt Switch', 'Overheat', 'Freezy Frost'],
		signatureMove: 'Orb Shield',
		evs: { hp: 248, def: 8, spa: 252 }, ivs: { atk: 0, spe: 0 }, nature: 'Quiet',
	},
	Zeeb: {
		species: 'Aipom', ability: 'Nutcracker', item: 'Slingshot', gender: 'M',
		moves: ['Fake Out', 'Tidy Up', 'False Surrender'],
		signatureMove: 'Super-Knuckle Shuffle',
		evs: { def: 128, spd: 128, spe: 252 }, ivs: { atk: 0, spa: 0 }, nature: 'Jolly',
	},
	Emerl: {
		species: 'Genesect', ability: 'Perfect Copy', item: 'Choice Scarf', gender: 'N',
		moves: ['U-turn', 'Leech Life', 'Flash Cannon'],
		signatureMove: 'Awakened Mode',
		evs: { atk: 252, spa: 252, spe: 4 }, nature: 'Hasty',
	},
	'Sakuya Izayoi': {
		species: 'Magearna', ability: 'The World', item: 'Stopwatch', gender: 'F',
		moves: ['Dazzling Gleam', 'Doom Desire', 'Fleur Cannon'],
		signatureMove: 'Killing Doll',
		evs: { hp: 252, def: 4, spa: 252 }, ivs: { atk: 0, spe: 0 }, nature: 'Quiet',
	},
	'Suika Ibuki': {
		species: 'Ogerpon', ability: 'Density Manipulation', item: 'Ibuki Gourd', gender: 'F',
		moves: ['Pursuit', 'Switcheroo', 'Drain Punch'],
		signatureMove: 'Demi',
		evs: { atk: 252, spd: 4, spe: 252 }, nature: 'Jolly',
	},
	Morax: {
		species: 'Landorus', ability: 'Herald of Order', item: 'Hadean Soil', gender: 'M',
		moves: ['Land\'s Wrath', 'Bleakwind Storm', 'Paleo Wave'],
		signatureMove: 'Dominus Lapidis',
		evs: { hp: 248, def: 92, spd: 168 }, nature: 'Jolly',
	},
	Aevum: {
		species: 'Calyrex', ability: 'Temporal Domain', item: 'Rewind Watch', gender: 'M',
		moves: ['Matcha Gotcha', 'Freezing Glare', 'Earth Power'],
		signatureMove: 'Genesis Ray',
		evs: { hp: 4, spa: 252, spe: 252 }, nature: 'Timid',
	},
	'Rooci Caxa': {
		species: 'Trevenant', ability: 'Horrors of the Forest', item: 'Spirit Berry', gender: 'M',
		moves: ['Strength Sap', 'Phantom Force', 'Sacred Fire'],
		signatureMove: 'Root Reaper',
		evs: { hp: 252, def: 4, spd: 252 }, nature: 'Careful',
	},
	'Saint Deli': {
		species: 'Delibird', ability: 'Generosity', item: 'Gift Sack', gender: 'N',
		moves: ['Baton Pass', 'Present', 'Life Dew'],
		signatureMove: 'Gift of Fortune',
		evs: { hp: 4, spa: 252, spe: 252 }, nature: 'Timid',
	},
	Flufi: {
		species: 'Pikachu-Starter', ability: 'Force of Will', item: 'EpiPen', gender: 'M',
		moves: ['Plasma Fists', 'Triple Axel', 'No Retreat'],
		signatureMove: 'Cranberry Cutter',
		evs: { hp: 160, atk: 240, spe: 108 }, nature: 'Jolly',
	},
	Tao: {
		species: 'Kubfu', ability: 'Shangqing', item: 'Zhuyou', gender: 'M',
		moves: ['Triple Kick', 'Circle Throw', 'Taiji'],
		signatureMove: 'Wuji',
		evs: { hp: 120, atk: 136, spe: 252 }, ivs: { spa: 0 }, nature: 'Jolly',
	},
	Marvin: {
		species: 'Darmanitan-Galar-Zen', ability: 'Murderous Mimic', item: 'The Happy Knife', gender: 'M',
		moves: ['Ice Spinner', 'Pyro Ball', 'Mimic'],
		signatureMove: 'Emergency Meltdown',
		evs: { hp: 120, atk: 136, spe: 252 }, ivs: { spa: 0 }, nature: 'Jolly',
	},
	Varnava: {
		species: 'Zygarde-Complete', ability: 'Cell Deconstruct', item: 'Varnavium Z', gender: 'M',
		moves: ['Core Enforcer', 'Thousand Arrows', 'Coil'],
		signatureMove: 'Ecosystem Drain',
		evs: { hp: 252, atk: 252, spd: 4 }, nature: 'Adamant',
	},
	'Varnava-50': {
		species: 'Zygarde', ability: 'Cell Deconstruct', item: 'Varnavium Z', gender: 'M',
		moves: ['Core Enforcer', 'Thousand Arrows', 'Coil'],
		signatureMove: 'Ecosystem Drain',
		evs: { hp: 252, atk: 252, spd: 4 }, nature: 'Adamant', skip: 'Varnava',
	},
	'Varnava-25': {
		species: 'Zygarde-10%', ability: 'Cell Deconstruct', item: 'Varnavium Z', gender: 'M',
		moves: ['Core Enforcer', 'Thousand Arrows', 'Coil'],
		signatureMove: 'Ecosystem Drain',
		evs: { hp: 252, atk: 252, spd: 4 }, nature: 'Adamant', skip: 'Varnava',
	},
	PokeKart: {
		species: 'Revavroom', ability: 'Chain Drift', item: 'Flame Flyer', gender: 'N',
		moves: ['Spin Out', 'Blazing Torque', 'U-turn'],
		signatureMove: 'Item Box',
		evs: { hp: 252, def: 4, spe: 252 }, nature: 'Jolly',
	},
	Cinque: {
		species: 'Marowak', ability: 'Cheerleader', item: 'Moogle Plushie', gender: 'F',
		moves: ['Magnitude', 'Payback', 'Stone Edge'],
		signatureMove: 'Homerun Swing - Windup',
		evs: { hp: 252, atk: 252, spd: 4 }, ivs: { spa: 0 }, nature: 'Adamant',
	},
	Quetzalcoatl: {
		species: 'Zapdos', ability: 'Peal of Thunder', item: 'Leftovers', gender: 'N',
		moves: ['Oblivion Wing', 'Whirlwind', 'Glare'],
		signatureMove: 'Big Thunder',
		evs: { hp: 252, spa: 252, spe: 4 }, ivs: { atk: 0 }, nature: 'Modest',
	},
	Mink: {
		species: 'Venusaur-Mega', ability: 'Sickening Stench', item: 'Corpse Lily', gender: 'M',
		moves: ['Leaf Tornado', 'Earth Power', 'Venoshock'],
		signatureMove: 'Transfuse Toxin',
		evs: { hp: 252, def: 108, spd: 148 }, ivs: { atk: 0 }, nature: 'Bold',
	},
	/*
	Miraju: {
		species: 'Wynaut', ability: 'Illusive Energy', item: 'Eviolite', gender: 'N',
		moves: ['Hyperspace Hole', 'Glare', 'Memento'],
		signatureMove: 'Close Combat',
		evs: {hp: 252, def: 4, spe: 252}, ivs: {atk: 0}, nature: 'Timid',
	},
	Ingrid: {
		species: 'Doublade', ability: 'Caliber Conversion', item: 'Odin\'s Sheath', gender: 'F',
		moves: ['Smart Strike', 'Shadow Sneak', 'Swords Dance'],
		signatureMove: 'Equip Spectre',
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Adamant',
	},
	Gadget: {
		species: 'Gimmighoul', ability: 'Coin Collector', item: 'Everythingamajig', gender: 'M',
		moves: ['Heavy Slam', 'Pay Day', 'Iron Defense'],
		signatureMove: 'Capital Cannon',
		evs: {}, nature: 'Bashful',
	},
	Kusanali: {
		species: 'Shaymin', ability: 'On All Things Meditated', item: 'Seed of Stored Knowledge', gender: 'F',
		moves: ['Seed Flare', 'Earth Power', 'Heat Wave'],
		signatureMove: 'Happy Hour',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Timid',
	},
	Morte: {
		species: 'Mimikyu', ability: 'Dollkeeper', item: 'Malediction', gender: 'M',
		moves: ['Magical Torque', 'Shadow Force', 'Thousand Waves'],
		signatureMove: 'Omen of Defeat',
		evs: {hp: 252, atk: 4, spe: 252}, nature: 'Jolly',
	},
	Genus: {
		species: 'Dusclops', ability: 'Lucky Charm', item: 'Gachium Z', gender: 'N',
		moves: ['Substitute', 'Roar', 'Recover'],
		signatureMove: 'Star Pull',
		evs: {hp: 252, def: 4, spe: 252}, nature: 'Serious', shiny: true,
	},
	Toshinori: {
		species: 'Machamp-Gmax', ability: 'One for All', item: 'Dying Embers', gender: 'M',
		moves: ['All-Out Pummeling', 'Continental Crush', 'Flying Press'],
		evs: {hp: 132, atk: 252, spe: 124}, nature: 'Brave',
	},
	Journeyman: {
		species: 'Stonjourner', ability: 'Love of the Journey', item: 'Colossus Carrier', gender: 'M',
		moves: ['Mighty Cleave', 'Trailblaze', 'Court Change'],
		signatureMove: 'New Beginnings',
		evs: {atk: 188, spd: 104, spe: 216}, ivs: {spa: 0}, nature: 'Adamant',
	},
	  Shorikai: {
		species: 'Corviknight-Gmax', ability: 'Iridium Ironworks', item: 'Genesis Engine', gender: 'N',
		moves: ['Metal Burst', 'King\'s Shield', 'Spikes'],
		signatureMove: 'Sanguine Shuriken',
		evs: {hp: 248, spd: 8, spe: 252}, nature: 'Jolly', shiny: true,
	},
	Croupier: {
		species: 'Hoopa', ability: 'Fair Play', item: 'Staufen\'s Die', gender: 'M',
		moves: ['Photon Geyser', 'Ominous Wind', 'Tap Out'],
		signatureMove: 'Roll the Dice',
		evs: {hp: 252, spa: 4, spe: 252}, nature: 'Hasty',
	},
	Faust: {
		species: 'Hoopa-Unbound', ability: 'The Devil Is In The Details', item: 'Crossroads Blues', gender: 'M',
		moves: ['Eerie Spell', 'Topsy Turvy', 'Kniffel'],
		signatureMove: 'Faustian Bargain',
		evs: {hp: 252, spa: 4, spe: 252}, nature: 'Hasty', skip: 'Croupier',
	},
	*/
};

export class RandomStaffBrosTeams extends RandomTeams {
	randomStaffBrosTeam(options: { inBattle?: boolean } = {}) {
		this.enforceNoDirectCustomBanlistChanges();
		const team: PokemonSet[] = [];
		const debug: string[] = []; // Set this to a list of SSB sets to override the normal pool for debugging.
		const ruleTable = this.dex.formats.getRuleTable(this.format);
		const monotype = this.forceMonotype || (ruleTable.has('sametypeclause') ?
			this.sample([...this.dex.types.names().filter(x => x !== 'Stellar')]) : false);

		let pool = Object.keys(ssbSets);
		if (debug.length) {
			while (debug.length < 6) {
				const staff = this.sampleNoReplace(pool);
				if (debug.includes(staff) || ssbSets[staff].skip) continue;
				debug.push(staff);
			}
			pool = debug;
		}
		if (monotype && !debug.length) {
			pool = pool.filter(x => this.dex.species.get(ssbSets[x].species).types.includes(monotype));
		}
		if (global.Config?.disabledssbsets?.length) {
			pool = pool.filter(x => !global.Config.disabledssbsets.includes(this.dex.toID(x)));
		}
		const usePotD = global.Config && Config.ssbpotd;
		const potd = usePotD ? Config.ssbpotd : null;
		const typePool: { [k: string]: number } = {};
		let depth = 0;
		while (pool.length && team.length < this.maxTeamSize) {
			if (depth >= 200) throw new Error(`Infinite loop in Super Staff Bros team generation.`);
			depth++;
			let name = this.sampleNoReplace(pool);
			// if PotD is currently active, sets the second slot to that staffmon
			// if it naturally samples the PotD, skip it to avoid duplicates, as it's already guaranteed in the second slot
			if (name === Config.ssbpotd) continue;
			if (usePotD && team.length === 1) {
				if (ssbSets[Config.ssbpotd]) name = Config.ssbpotd;
			}
			let ssbSet: SSBSet = this.dex.deepClone(ssbSets[name]);
			if (ssbSet.skip) continue;

			// Enforce typing limits
			if (!(debug.length || monotype)) { // Type limits are ignored for debugging, monotype, or memes.
				const species = this.dex.species.get(ssbSet.species);

				const weaknesses = [];
				for (const type of this.dex.types.names()) {
					const typeMod = this.dex.getEffectiveness(type, species.types);
					if (typeMod > 0) weaknesses.push(type);
				}
				let rejected = false;
				for (const type of weaknesses) {
					if (typePool[type] === undefined) typePool[type] = 0;
					if (typePool[type] >= 3) {
						// Reject
						rejected = true;
						break;
					}
				}
				if (ssbSet.ability === 'Wonder Guard') {
					if (!typePool['wonderguard']) {
						typePool['wonderguard'] = 1;
					} else {
						rejected = true;
					}
				}
				if (rejected) continue;
				// Update type counts
				for (const type of weaknesses) {
					typePool[type]++;
				}
			}

			let teraType: string | undefined;
			if (ssbSet.teraType) {
				teraType = ssbSet.teraType === 'Any' ?
					this.sample(this.dex.types.names()) :
					this.sampleIfArray(ssbSet.teraType);
			}
			const moves: string[] = [];
			while (moves.length < 3 && ssbSet.moves.length > 0) {
				let move = this.sampleNoReplace(ssbSet.moves);
				if (Array.isArray(move)) move = this.sampleNoReplace(move);
				moves.push(this.dex.moves.get(move).name);
			}
			moves.push(this.dex.moves.get(ssbSet.signatureMove).name);
			const ivs = { ...{ hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 }, ...ssbSet.ivs };
			if (!moves.map(x => this.dex.moves.get(x)).some(x => x.category === 'Physical')) {
				ivs.atk = 0;
			}

			const set: PokemonSet = {
				name,
				species: ssbSet.species,
				item: this.sampleIfArray(ssbSet.item),
				ability: this.sampleIfArray(ssbSet.ability),
				moves,
				nature: ssbSet.nature ? Array.isArray(ssbSet.nature) ? this.sampleNoReplace(ssbSet.nature) : ssbSet.nature : 'Serious',
				gender: ssbSet.gender ? this.sampleIfArray(ssbSet.gender) : this.sample(['M', 'F', 'N']),
				evs: ssbSet.evs ? { ...{ hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }, ...ssbSet.evs } :
					{ hp: 84, atk: 84, def: 84, spa: 84, spd: 84, spe: 84 },
				ivs,
				level: this.adjustLevel || ssbSet.level || 100,
				happiness: typeof ssbSet.happiness === 'number' ? ssbSet.happiness : 255,
				shiny: typeof ssbSet.shiny === 'number' ? this.randomChance(1, ssbSet.shiny) : !!ssbSet.shiny,
			};

			// Any set specific tweaks occur here.

			// Prince Smurf - First moveslot always Psyshield Bash
			if (set.name === "Prince Smurf" && set.moves[0] !== "Psyshield Bash") {
				const swapMove = set.moves[0];
				const bashIndex = set.moves.indexOf("Psyshield Bash");
				set.moves[bashIndex] = swapMove;
				set.moves[0] = "Psyshield Bash";
			}

			if (teraType) set.teraType = teraType;
			team.push(set);

			// Team specific tweaks occur here
			// Swap last and second to last sets if last set has Illusion
			if (team.length === this.maxTeamSize && (set.ability === 'Illusion' || set.ability === 'Illusion Master')) {
				team[this.maxTeamSize - 1] = team[this.maxTeamSize - 2];
				team[this.maxTeamSize - 2] = set;
			}
		}
		return team;
	}
}

export default RandomStaffBrosTeams;
