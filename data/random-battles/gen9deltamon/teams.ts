import { RandomTeams, type MoveCounter } from '../gen9/teams';

export class RandomDelta extends RandomTeams {
	override randomSets: { [species: string]: RandomTeamsTypes.RandomSpeciesData } = require('./sets.json');

	randomDeltaTeam() {
		this.enforceNoDirectCustomBanlistChanges();

		const seed = this.prng.getSeed();
		const ruleTable = this.dex.formats.getRuleTable(this.format);
		const pokemon: RandomTeamsTypes.RandomSet[] = [];

		// For Monotype
		const isMonotype = !!this.forceMonotype || ruleTable.has('sametypeclause');
		const isDoubles = this.format.gameType !== 'singles';
		const typePool = this.dex.types.names().filter(name => name !== "Stellar");
		const type = this.forceMonotype || this.sample(typePool);

		const baseFormes: { [k: string]: number } = {};

		const typeCount: { [k: string]: number } = {};
		const typeComboCount: { [k: string]: number } = {};
		const typeWeaknesses: { [k: string]: number } = {};
		const typeDoubleWeaknesses: { [k: string]: number } = {};
		const teamDetails: RandomTeamsTypes.TeamDetails = {};

		let pokemonList = Object.keys(this.randomSets);
		const CAPTiers = ["CAP", "CAP NFE", "CAP LC"];
		if (pokemonList.filter(mon => CAPTiers.includes(this.dex.species.get(mon).tier)).length >= 6) {
			if (ruleTable.has("+tag:cap"))
				pokemonList = pokemonList.filter(mon => CAPTiers.includes(this.dex.species.get(mon).tier));
			else
				pokemonList = pokemonList.filter(mon => !CAPTiers.includes(this.dex.species.get(mon).tier));
		}
		const [pokemonPool, baseSpeciesPool] = this.getPokemonPool(type, pokemon, isMonotype, pokemonList);

		// const leadsRemaining = this.format.gameType === 'doubles' ? 2 : 1;
		while (baseSpeciesPool.length && pokemon.length < this.maxTeamSize) {
			const baseSpecies = this.sampleNoReplace(baseSpeciesPool);
			const species = this.dex.species.get(this.sample(pokemonPool[baseSpecies]));
			if (!species.exists) continue;

			// Limit to one of each species (Species Clause)
			if (baseFormes[species.baseSpecies]) continue;

			// Treat Ogerpon formes and Terapagos like the Tera Blast user role; reject if team has one already
			if (['ogerpon', 'ogerponhearthflame', 'terapagos'].includes(species.id) && teamDetails.teraBlast) continue;

			// Illusion shouldn't be on the last slot
			if (species.baseSpecies === 'Zoroark' && pokemon.length >= (this.maxTeamSize - 1)) continue;

			const types = species.types;
			const typeCombo = types.slice().sort().join();
			const weakToFreezeDry = (
				this.dex.getEffectiveness('Ice', species) > 0 ||
				(this.dex.getEffectiveness('Ice', species) > -2 && types.includes('Water'))
			);
			// Dynamically scale limits for different team sizes. The default and minimum value is 1.
			const limitFactor = Math.round(this.maxTeamSize / 6) || 1;

			if (!isMonotype && !this.forceMonotype) {
				let skip = false;

				// Limit two of any type
				for (const typeName of types) {
					if (typeCount[typeName] >= 2 * limitFactor) {
						skip = true;
						break;
					}
				}
				if (skip) continue;

				// Limit three weak to any type, and one double weak to any type
				for (const typeName of this.dex.types.names()) {
					// it's weak to the type
					if (this.dex.getEffectiveness(typeName, species) > 0) {
						if (!typeWeaknesses[typeName]) typeWeaknesses[typeName] = 0;
						if (typeWeaknesses[typeName] >= 3 * limitFactor) {
							skip = true;
							break;
						}
					}
					if (this.dex.getEffectiveness(typeName, species) > 1) {
						if (!typeDoubleWeaknesses[typeName]) typeDoubleWeaknesses[typeName] = 0;
						if (typeDoubleWeaknesses[typeName] >= limitFactor) {
							skip = true;
							break;
						}
					}
				}
				if (skip) continue;

				// Count Dry Skin/Fluffy as Fire weaknesses
				if (
					this.dex.getEffectiveness('Fire', species) === 0 &&
					Object.values(species.abilities).filter(a => ['Dry Skin', 'Fluffy'].includes(a)).length
				) {
					if (!typeWeaknesses['Fire']) typeWeaknesses['Fire'] = 0;
					if (typeWeaknesses['Fire'] >= 3 * limitFactor) continue;
				}

				// Limit four weak to Freeze-Dry
				if (weakToFreezeDry) {
					if (!typeWeaknesses['Freeze-Dry']) typeWeaknesses['Freeze-Dry'] = 0;
					if (typeWeaknesses['Freeze-Dry'] >= 4 * limitFactor) continue;
				}

				// Check compatibility with team
				if (!this.getPokemonCompatibility(species, pokemon, isDoubles)) continue;
			}

			// Limit three of any type combination in Monotype
			if (!this.forceMonotype && isMonotype && (typeComboCount[typeCombo] >= 3 * limitFactor)) continue;

			const set = this.randomSet(species, teamDetails, false, isDoubles);
			pokemon.push(set);

			// No more than one Z-move user
			if (set.name === 'Z-move user') {
				if (teamDetails.zMove = 1) continue;
				teamDetails.zMove = 1;
			}

			// Parsnik depends on sun
			if (species.id === 'parsnik' && teamDetails.sun !== 1) continue;

			// Don't bother tracking details for the last Pokemon
			if (pokemon.length === this.maxTeamSize) break;

			// Now that our Pokemon has passed all checks, we can increment our counters
			baseFormes[species.baseSpecies] = 1;

			// Increment type counters
			for (const typeName of types) {
				if (typeName in typeCount) {
					typeCount[typeName]++;
				} else {
					typeCount[typeName] = 1;
				}
			}
			if (typeCombo in typeComboCount) {
				typeComboCount[typeCombo]++;
			} else {
				typeComboCount[typeCombo] = 1;
			}

			// Increment weakness counter
			for (const typeName of this.dex.types.names()) {
				// it's weak to the type
				if (this.dex.getEffectiveness(typeName, species) > 0) {
					typeWeaknesses[typeName]++;
				}
				if (this.dex.getEffectiveness(typeName, species) > 1) {
					typeDoubleWeaknesses[typeName]++;
				}
			}
			// Count Dry Skin/Fluffy as Fire weaknesses
			if (['Dry Skin', 'Fluffy'].includes(set.ability) && this.dex.getEffectiveness('Fire', species) === 0) {
				typeWeaknesses['Fire']++;
			}
			if (weakToFreezeDry) typeWeaknesses['Freeze-Dry']++;

			// Track what the team has
			if (set.ability === 'Drizzle' || set.moves.includes('raindance')) teamDetails.rain = 1;
			if (set.ability === 'Drought' || set.ability === 'Orichalcum Pulse' || set.moves.includes('sunnyday')) {
				teamDetails.sun = 1;
			}
			if (set.ability === 'Sand Stream') teamDetails.sand = 1;
			if (set.ability === 'Snow Warning' || set.moves.includes('snowscape') || set.moves.includes('chillyreception')) {
				teamDetails.snow = 1;
			}
			if (set.moves.includes('healbell')) teamDetails.statusCure = 1;
			if (set.moves.includes('spikes') || set.moves.includes('ceaselessedge')) {
				teamDetails.spikes = (teamDetails.spikes || 0) + 1;
			}
			if (set.moves.includes('toxicspikes') || set.ability === 'Toxic Debris') teamDetails.toxicSpikes = 1;
			if (set.moves.includes('stealthrock') || set.moves.includes('stoneaxe')) teamDetails.stealthRock = 1;
			if (set.moves.includes('stickyweb')) teamDetails.stickyWeb = 1;
			if (set.moves.includes('defog')) teamDetails.defog = 1;
			if (set.moves.includes('rapidspin') || set.moves.includes('mortalspin')) teamDetails.rapidSpin = 1;
			if (set.moves.includes('auroraveil') || (set.moves.includes('reflect') && set.moves.includes('lightscreen'))) {
				teamDetails.screens = 1;
			}
			if (set.role === 'Tera Blast user' || ['ogerpon', 'ogerponhearthflame', 'terapagos'].includes(species.id)) {
				teamDetails.teraBlast = 1;
			}
		}
		if (pokemon.length < this.maxTeamSize && pokemon.length < 12) { // large teams sometimes cannot be built
			throw new Error(`Could not build a random team for ${this.format} (seed=${seed})`);
		}

		return pokemon;
	};

	/* All items are generated in getItem, so we shouldn't override anything */
	override getPriorityItem(ability: string, types: Set<string>, moves: Set<string>,
		counter: MoveCounter, teamDetails: RandomTeamsTypes.TeamDetails, species: Species,
		isLead: boolean, teraType: string, role: RandomTeamsTypes.Role, isDoubles: boolean):
		string | undefined {
		return;
	};

	override getItem(
		ability: string,
		types: Set<string>,
		moves: Set<string>,
		counter: MoveCounter,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		teraType: string,
		role: RandomTeamsTypes.Role,
	): string {
		if (species.id === 'glyde' && role === 'Fast Support') return this.sample(['Leftovers', 'Heavy-Duty Boots']);
		if (species.id === 'doggo' && role === 'Fast Attacker') return this.sample(['Black Glasses', 'Silk Scarf']);
		if (species.id === 'napstablook' && role === 'Bulky Support') return this.sample(['Leftovers', 'Colbur Berry']);
		if (species.id === 'soundofjustice' && role === 'Setup Sweeper') return this.sample(['Leftovers', 'Sitrus Berry']);
		if (species.id === 'wicabel' && role === 'Bulky Attacker') return 'Leftovers';
		if (species.id === 'maddummy' && role === 'Setup Sweeper') return 'Sitrus Berry';
		if (species.id === 'seth' && role === 'Choice Item user') return 'Choice Specs';

		if (species.id === 'ambyulance' && role === 'Bulky Support') return this.sample(['Heavy-Duty Boots', 'Choice Specs']);
		if (species.id === 'aqua' && role === 'Fast Attacker') return this.sample(['Choice Scarf', 'Choice Band']);
		if (species.id === 'asgore' && role === 'Setup Sweeper') return this.sample(['Life Orb', 'Heavy-Duty Boots']);
		if (species.id === 'asgore' && role === 'Bulky Attacker') return this.sample(['Terrain Extender', 'Leftovers']);
		if (species.id === 'bibliox' && role === 'Fast Attacker') return this.sample(['Life Orb', 'Focus Sash']);
		if (species.id === 'blue' && role === 'Setup Sweeper') return this.sample(['Leftovers', 'Heavy-Duty Boots']);
		if (species.id === 'chaosking' && role === 'Bulky Attacker')
			return this.sample(['Leftovers', 'Life Orb', 'Black Glasses']);
		if (species.id === 'doggo' && role === 'Choice Item user') return this.sample(['Choice Band', 'Choice Scarf']);
		if (species.id === 'floradinn' && role === 'Bulky Support') return this.sample(['Heavy-Duty Boots', 'Black Sludge']);
		if (species.id === 'guei' && role === 'Choice Item user') return this.sample(['Choice Scarf', 'Choice Specs']);
		if (species.id === 'headhathy' && role === 'Bulky Support') return this.sample(['Heavy-Duty Boots', 'Leftovers']);
		if (species.id === 'jerry' && role === 'Staller') return this.sample(['Covert Cloak', 'Leftovers']);
		if (species.id === 'jevil' && role === 'Z-Move user') return this.sample(['Ghostium Z', 'Jester\'s Shadow Crystal']);
		if (species.id === 'jevil' && role === 'Choice Item user') return this.sample(['Choice Scarf', 'Choice Specs']);
		if (species.id === 'lemonbread' && role === 'Wallbreaker') return this.sample(['Choice Scarf', 'Life Orb']);
		if (species.id === 'maddummy' && role === 'Wallbreaker') return this.sample(['Choice Scarf', 'Choice Band']);
		if (species.id === 'mauswheel' && role === 'Fast Attacker') return 'Leftovers';
		if (species.id === 'moldbygg' && role === 'Bulky Attacker')
			return this.sample(['Rocky Helmet', 'Leftovers', 'Heavy-Duty Boots']);
		if (species.id === 'moldessa' && role === 'Choice Item user') return this.sample(['Choice Scarf', 'Choice Specs']);
		if (species.id === 'orange' && role === 'Setup Sweeper') return this.sample(['Sitrus Berry', 'Salac Berry']);
		if (species.id === 'organikk' && role === 'Bulky Support') return this.sample(['Terrain Extender', 'Leftovers']);
		if (species.id === 'pink' && role === 'Wallbreaker') return this.sample(['Life Orb', 'Leftovers', 'Fairy Feather']);
		if (species.id === 'pyrope' && role === 'Wallbreaker') return this.sample(['Life Orb', 'Choice Band']);
		if (species.id === 'reaperbird' && role === 'Choice Item user') return this.sample(['Choice Band', 'Choice Scarf']);
		if (species.id === 'roaringknight' && role === 'Choice Item user') return this.sample(['Choice Band', 'Choice Scarf']);
		if (species.id === 'rouxlskaard' && role === 'Bulky Attacker') return this.sample(['Choice Specs', 'Choice Scarf']);
		if (species.id === 'royalguard2' && role === 'Setup Sweeper')
			return this.sample(['Focus Sash', 'Chople Berry', 'Shuca Berry']);
		if (species.id === 'shinobeetle' && role === 'Fast Attacker') return this.sample(['Leftovers', 'Life Orb']);
		if (species.id === 'soundofjustice' && role === 'Choice Item user') return this.sample(['Choice Scarf', 'Choice Band']);
		if (species.id === 'susie' && role === 'Setup Sweeper') return this.sample(['Chople Berry', 'Leftovers']);
		if ((species.id === 'thrashmachine' || species.id === 'thrashmachineduck' ||
			species.id === 'thrashmachineflame' || species.id === 'thrashmachinelaser') &&
			role === 'Choice Item user') return this.sample(['Choice Scarf', 'Choice Band']);
		if (species.id === 'titanspawn' && role === 'Bulky Attacker')
			return this.sample(['Focus Sash', 'Leftovers', 'Black Glasses']);
		if (species.id === 'virovirokun' && role === 'Fast Support') return this.sample(['Black Sludge', 'Heavy-Duty Boots']);
		if (species.id === 'werewerewire' && role === 'Fast Attacker')
			return this.sample(['Heavy-Duty Boots', 'Leftovers', 'Booster Energy']);
		if (species.id === 'whimsalot' && role === 'Z-Move user') return this.sample(['Fightinium Z', 'Flyinium Z']);
		if (species.id === 'wicabel' && role === 'Choice Item user') return this.sample(['Choice Scarf', 'Choice Specs']);
		if (species.id === 'yellow' && role === 'Choice Item user') return this.sample(['Choice Scarf', 'Choice Specs']);
		if (species.id === 'shi' && role === 'Bulky Attacker') return this.sample(['Choice Band', 'Leftovers', 'Life Orb']);
		if (species.id === 'nubert' && role === 'Bulky Attacker') return this.sample(['Choice Band', 'Soft Sand']);
		if (
			(species.id === 'aaron' && role === 'Wallbreaker') ||
			(species.id === 'astigmatism' && role === 'Choice Item user') ||
			(species.id === 'cowboymike' && role === 'Choice Item user') ||
			(species.id === 'dogamy' && role === 'Choice Item user') ||
			(species.id === 'dogaressa' && role === 'Choice Item user') ||
			(species.id === 'flowery' && role === 'Choice Item user') ||
			(species.id === 'glyde' && role === 'Choice Item user') ||
			(species.id === 'icecap' && role === 'Wallbreaker') ||
			(species.id === 'icewolf' && role === 'Bulky Attacker') ||
			(species.id === 'kround' && role === 'Choice Item user') ||
			(species.id === 'lancer' && role === 'Choice Item user') ||
			(species.id === 'lemonbread' && role === 'Choice Item user') ||
			(species.id === 'mauswheel' && role === 'Choice Item user') ||
			(species.id === 'papyrus' && role === 'Choice Item user') ||
			(species.id === 'shinobeetle' && role === 'Choice Item user') ||
			(species.id === 'tsunderplane' && role === 'Choice Item user') ||
			(species.id === 'werewerewire' && role === 'Choice Item user')
		) return 'Choice Band';
		if (
			(species.id === 'abberant' && role === 'AV Pivot') ||
			(species.id === 'alphys' && role === 'Wallbreaker') ||
			(species.id === 'ambyulance' && role === 'AV Pivot') ||
			(species.id === 'missmizzle' && role === 'AV Pivot') ||
			(species.id === 'royalguard1' && role === 'AV Pivot')
		) return 'Assault Vest';
		if (
			(species.id === 'abberant' && role === 'Bulky Support') ||
			(species.id === 'winglade' && role === 'Bulky Support')
		) return 'Rocky Helmet';
		if (
			(species.id === 'aqua' && role === 'Setup Sweeper') ||
			(species.id === 'kris' && role === 'Setup Sweeper') ||
			(species.id === 'lesserdog' && role === 'Setup Sweeper') ||
			(species.id === 'mrsociety' && role === 'Wallbreaker') ||
			(species.id === 'parsnik' && role === 'Wallbreaker') ||
			(species.id === 'pipis' && role === 'Bulky Attacker') ||
			(species.id === 'sheary' && role === 'Wallbreaker') ||
			(species.id === 'shyren' && role === 'Wallbreaker') ||
			(species.id === 'tasquemanager' && role === 'Setup Sweeper') ||
			(species.id === 'tenna' && role === 'Wallbreaker') ||
			(species.id === 'thrashmachineduck' && role === 'Fast Attacker') ||
			(species.id === 'whitecloak' && role === 'Wallbreaker')
		) return 'Life Orb';
		if (species.id === 'aqua' && role === 'Z-Move user') return 'Cyan Omega Petal';
		if (
			(species.id === 'asriel' && role === 'Wallbreaker') ||
			(species.id === 'balthizard' && role === 'Bulky Support') ||
			(species.id === 'crystal' && role === 'Fast Support') ||
			(species.id === 'hacker' && role === 'Fast Support') ||
			(species.id === 'migospel' && role === 'Fast Support') ||
			(species.id === 'netskie' && role === 'Fast Attacker') ||
			(species.id === 'onionsan' && role === 'Bulky Support') ||
			(species.id === 'sans' && role === 'Wallbreaker') ||
			(species.id === 'shadowmantle' && role === 'Wallbreaker') ||
			(species.id === 'snowdrake' && role === 'Bulky Support') ||
			(species.id === 'swatch' && role === 'Bulky Support') ||
			(species.id === 'sweet' && role === 'Fast Support') ||
			(species.id === 'toriel' && role === 'Bulky Attacker')
		) return 'Heavy-Duty Boots';
		if (species.id === 'asrielhyperdeath' && role === 'Fast Attacker') return 'Soul Collective';
		if (species.id === 'berdly' && role === 'Wallbreaker') return 'Expert Belt';
		if (species.id === 'berdly' && role === 'Z-Move user') return 'Flyinium Z';
		if (
			(species.id === 'bloxer' && role === 'Bulky Attacker') ||
			(species.id === 'endogeny' && role === 'Bulky Support') ||
			(species.id === 'finalfroggit' && role === 'Fast Support') ||
			(species.id === 'flowey' && role === 'Fast Support') ||
			(species.id === 'gerson' && role === 'Bulky Support') ||
			(species.id === 'green' && role === 'Bulky Support') ||
			(species.id === 'jackenstein') ||
			(species.id === 'jevil' && role === 'Fast Support') ||
			(species.id === 'kawkaw' && role === 'Bulky Support') ||
			(species.id === 'kk' && role === 'Bulky Support') ||
			(species.id === 'knightknight' && role === 'Bulky Setup') ||
			(species.id === 'kround' && role === 'Bulky Setup') ||
			(species.id === 'pipis' && role === 'Staller') ||
			(species.id === 'ralsei' && role === 'Bulky Support') ||
			(species.id === 'ralsei' && role === 'Bulky Setup') ||
			(species.id === 'ramb' && role === 'Fast Support') ||
			(species.id === 'ribbick' && role === 'Bulky Support') ||
			(species.id === 'royalguard1' && role === 'Bulky Support') ||
			(species.id === 'rudinnranger' && role === 'Bulky Support') ||
			(species.id === 'seam' && role === 'Bulky Support') ||
			(species.id === 'seam' && role === 'Bulky Setup') ||
			(species.id === 'temmie' && role === 'Fast Support') ||
			(species.id === 'terakota' && role === 'Bulky Support') ||
			(species.id === 'titan' && role === 'Bulky Attacker') ||
			(species.id === 'titanspawn' && role === 'Bulky Support') ||
			(species.id === 'topchef' && role === 'Fast Attacker') ||
			(species.id === 'undyne' && role === 'Bulky Setup') ||
			(species.id === 'winglade' && role === 'Bulky Setup')
		) return 'Leftovers';
		if (species.id === 'blue' && role === 'Z-Move user') return 'Azure Omega Petal';
		if (
			(species.id === 'capn' && role === 'Wallbreaker') ||
			(species.id === 'carol' && role === 'Choice Item user') ||
			(species.id === 'chilldrake' && role === 'Choice Item user') ||
			(species.id === 'elnina' && role === 'Choice Item user') ||
			(species.id === 'kawkaw' && role === 'Choice Item user') ||
			(species.id === 'leafling' && role === 'Choice Item user') ||
			(species.id === 'mrsunshine' && role === 'Choice Item user') ||
			(species.id === 'vulkin' && role === 'Choice Item user') ||
			(species.id === 'watercooler' && role === 'Choice Item user')
		) return 'Choice Specs';
		if (
			(species.id === 'catmike' && role === 'Fast Attacker') ||
			(species.id === 'clover' && role === 'Setup Sweeper') ||
			(species.id === 'motormouthmike' && role === 'Setup Sweeper')
		) return 'Loaded Dice';
		if (species.id === 'cuptain' && role === 'Fast Attacker') return 'Wide Lens';
		if (species.id === 'elnina' && role === 'Bulky Support') return 'Damp Rock';
		if (species.id === 'finalfroggit' && role === 'Fast Attacker') return 'Toxic Orb';
		if (
			(species.id === 'flowery' && role === 'Setup Sweeper') ||
			(species.id === 'mrsunshine' && role === 'Wallbreaker')
		) return 'Booster Energy';
		if (species.id === 'floweymega' && role === 'Bulky Attacker') return 'Floweyite';
		if (species.id === 'gersonmega' && role === 'Fast Attacker') return 'Gersonite';
		if (species.id === 'greaterdog' && role === 'Bulky Attacker') return 'Flame Orb';
		if (species.id === 'jigsawjoe') return 'Toxic Orb';
		if (
			(species.id === 'green' && role === 'Fast Support') ||
			(species.id === 'noelle' && role === 'Fast Support') ||
			(species.id === 'poppup' && role === 'Bulky Support')
		) return 'Light Clay';
		if (
			(species.id === 'gyftrot' && role === 'Setup Sweeper') ||
			(species.id === 'leafling' && role === 'Setup Sweeper') ||
			(species.id === 'zapper' && role === 'Bulky Setup')
		) return 'Sitrus Berry';
		if (
			(species.id === 'kris' && role === 'Wallbreaker') ||
			(species.id === 'memoryhead' && role === 'Fast Attacker') ||
			(species.id === 'mrelegance' && role === 'Choice Item user') ||
			(species.id === 'napstablook' && role === 'Choice Item user') ||
			(species.id === 'netskie' && role === 'Wallbreaker') ||
			(species.id === 'organikk' && role === 'Choice Item user') ||
			(species.id === 'pippins' && role === 'Fast Attacker') ||
			(species.id === 'shadowguy' && role === 'Choice Item user') ||
			(species.id === 'shuttah' && role === 'Choice Item user') ||
			(species.id === 'starwalker' && role === 'Choice Item user') ||
			(species.id === 'swatch' && role === 'Choice Item user')
		) return 'Choice Scarf';
		if (
			(species.id === 'lancer' && role === 'Fast Support') ||
			(species.id === 'muffet' && role === 'Fast Support')
		) return 'Focus Sash';
		if (species.id === 'lanino' && role === 'Bulky Attacker') return 'Heat Rock';
		if (species.id === 'madjick' && role === 'Z-Move user') return 'Fightinium Z';
		if (species.id === 'mettaton' && role === 'Fast Bulky Setup') return 'Air Balloon';
		if (species.id === 'mettatonmegax' && role === 'Setup Sweeper') return 'Mettatonite X';
		if (species.id === 'mettatonmegay' && role === 'Fast Attacker') return 'Mettatonite Y';
		if (species.id === 'migospel' && role === 'Setup Sweeper') return 'Electrium Z';
		if (species.id === 'mrsunshine' && role === 'Z-Move user') return 'Firium Z';
		if (species.id === 'noelle' && role === 'Fast Attacker') return 'Thorn Ring';
		if (species.id === 'organikk' && role === 'Setup Sweeper') return 'Power Herb';
		if (species.id === 'papyrus' && role === 'Bulky Attacker') return 'Soft Sand';
		if (
			(species.id === 'queendelta' && role === 'Fast Attacker') ||
			(species.id === 'rabbick' && role === 'Bulky Support') ||
			(species.id === 'trashy' && role === 'Bulky Support')
		) return 'Black Sludge';
		if (species.id === 'queenmega' && role === 'Bulky Setup') return 'Queenite';
		if (species.id === 'reaperbird' && role === 'Z-Move user') return 'Ghostium Z';
		if (species.id === 'roaringknight' && role === 'Z-Move user') return 'Knight\'s Shadow Crystal';
		if (species.id === 'rouxlskaardmega' && role === 'Wallbreaker') return 'Kaardite';
		if (species.id === 'seth' && role === 'Z-Move user') return 'Violet Omega Petal';
		if (species.id === 'spamton' && role === 'Z-Move user') return 'Puppet\'s Shadow Crystal';
		if (species.id === 'spamtonmega' && role === 'Wallbreaker') return 'Spamtonite';
		if (species.id === 'undynemega' && role === 'Bulky Setup') return 'Undynite';
		if (species.id === 'woshua' && role === 'Setup Sweeper') return 'White Herb';
		if (species.id === 'yellow' && role === 'Z-Move user') return 'Golden Omega Petal';
		if (species.id === 'friend') return 'Leftovers';
		if (species.id === 'normalnpc') return 'Silk Scarf';
		// fallback
		return 'Life Orb';
	}
}

export default RandomDelta;
