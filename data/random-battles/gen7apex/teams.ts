import {RandomGen7Teams, ZeroAttackHPIVs} from '../gen7/teams';

const POWERFUL_ABILITIES = [
	'Adaptability', 'Aftermath', 'Analytic', 'Arena Trap', 'Beast Boost', 'Berserk', 'Comatose', 'Competitive',
	'Compound Eyes', 'Contrary', 'Cursed Body', 'Defiant', 'Desolate Land', 'Download', 'Drizzle', 'Drought', 'Dry Skin',
	'Effect Spore', 'Filter', 'Flame Body', 'Flash Fire', 'Fluffy', 'Fur Coat', 'Gooey', 'Grassy Surge', 'Heatproof',
	'Huge Power', 'Hustle', 'Illusion', 'Imposter', 'Innards Out', 'Intimidate', 'Iron Barbs', 'Levitate', 'Lightning Rod',
	'Magic Bounce', 'Magic Guard', 'Marvel Scale', 'Mold Breaker', 'Moody', 'Motor Drive', 'Moxie', 'Multiscale',
	'Natural Cure', 'Neuroforce', 'Parental Bond', 'Poison Point', 'Poison Touch', 'Prankster', 'Primordial Sea', 'Prism Armor',
	'Protean', 'Pure Power', 'Regenerator', 'Rough Skin', 'Sand Stream', 'Sap Sipper', 'Serene Grace',
	'Shadow Shield', 'Shadow Tag', 'Shed Skin', 'Sheer Force', 'Shield Dust', 'Simple', 'Snow Warning', 'Solid Rock',
	'Soul-Heart', 'Speed Boost', 'Stakeout', 'Stamina', 'Static', 'Storm Drain', 'Sturdy', 'Tangling Hair', 'Technician',
	'Teravolt', 'Thick Fat', 'Tinted Lens', 'Tough Claws', 'Trace', 'Triage', 'Turboblaze', 'Unaware', 'Volt Absorb',
	'Water Absorb', 'Water Bubble', 'Wonder Guard',
];

export class RandomGen7ApexTeams extends RandomGen7Teams {
	randomSet(
		species: string | Species,
		teamDetails: RandomTeamsTypes.TeamDetails = {},
		isLead = false
	): RandomTeamsTypes.RandomSet {
		species = this.dex.species.get(species);
		const forme = this.getForme(species);
		const sets = this.randomSets[species.id]["sets"];
		const possibleSets = [];
		// Check if the Pokemon has a Z-Move user set
		let canZMove = false;
		for (const set of sets) {
			if (!teamDetails.zMove && set.role === 'Z-Move user') canZMove = true;
		}
		for (const set of sets) {
			// Prevent multiple Z-Move users
			if (teamDetails.zMove && set.role === 'Z-Move user') continue;
			// Prevent Setup Sweeper and Bulky Setup if Z-Move user is available
			if (canZMove && ['Setup Sweeper', 'Bulky Setup'].includes(set.role)) continue;
			possibleSets.push(set);
		}
		const set = this.sampleIfArray(possibleSets);
		const role = set.role;
		const movePool: string[] = Array.from(set.movepool);
		const preferredTypes = set.preferredTypes;
		const preferredType = this.sampleIfArray(preferredTypes) || '';

		let ability = '';
		let item = undefined;

		const evs = {hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85};
		const ivs = {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31};

		const types = species.types;
		const baseAbilities = set.abilities!;
		// Use the mega's ability for moveset generation
		const abilities = (species.battleOnly && !species.requiredAbility) ? Object.values(species.abilities) : baseAbilities;

		// Get moves
		const moves = this.randomMoveset(types, abilities, teamDetails, species, isLead, movePool,
			preferredType, role);
		const counter = this.newQueryMoves(moves, species, preferredType, abilities);

		// Get ability
		ability = this.getAbility(new Set(types), moves, baseAbilities, counter, movePool, teamDetails, species,
			preferredType, role);

		// Get items
		item = this.getPriorityItem(ability, types, moves, counter, teamDetails, species, isLead, preferredType, role);
		if (item === undefined) {
			item = this.getItem(ability, types, moves, counter, teamDetails, species, isLead, preferredType, role);
		}

		// For Trick / Switcheroo
		if (item === 'Leftovers' && types.includes('Poison')) {
			item = 'Black Sludge';
		}

		const level = this.getLevel(species);

		// Minimize confusion damage, including if Foul Play is its only physical attack
		if (
			(!counter.get('Physical') || (counter.get('Physical') <= 1 && (moves.has('foulplay') || moves.has('rapidspin')))) &&
			!moves.has('copycat') && !moves.has('transform')
		) {
			evs.atk = 0;
			ivs.atk = 0;
		}

		// Override regular ability with a random "powerful" ability
		ability = this.sample(POWERFUL_ABILITIES);

		if (ability === 'Beast Boost' && !counter.get('Special')) {
			evs.spa = 0;
			ivs.spa = 0;
		}

		// We use a special variable to track Hidden Power
		// so that we can check for all Hidden Powers at once
		let hasHiddenPower = false;
		for (const move of moves) {
			if (move.startsWith('hiddenpower')) hasHiddenPower = true;
		}

		// Fix IVs for non-Bottle Cap-able sets
		if (hasHiddenPower && level < 100) {
			let hpType;
			for (const move of moves) {
				if (move.startsWith('hiddenpower')) hpType = move.substr(11);
			}
			if (!hpType) throw new Error(`hasHiddenPower is true, but no Hidden Power move was found.`);
			const HPivs = ivs.atk === 0 ? ZeroAttackHPIVs[hpType] : this.dex.types.get(hpType).HPivs;
			let iv: StatID;
			for (iv in HPivs) {
				ivs[iv] = HPivs[iv]!;
			}
		}

		// Prepare optimal HP
		const srImmunity = ability === 'Magic Guard';
		const srWeakness = srImmunity ? 0 : this.dex.getEffectiveness('Rock', species);
		while (evs.hp > 1) {
			const hp = Math.floor(Math.floor(2 * species.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100) * level / 100 + 10);
			if (moves.has('substitute') && !['Black Sludge', 'Leftovers'].includes(item)) {
				if (item === 'Sitrus Berry') {
					// Two Substitutes should activate Sitrus Berry
					if (hp % 4 === 0) break;
				} else {
					// Should be able to use Substitute four times from full HP without fainting
					if (hp % 4 > 0) break;
				}
			} else if (moves.has('bellydrum') && (item === 'Sitrus Berry')) {
				// Belly Drum should activate Sitrus Berry
				if (hp % 2 === 0) break;
			} else if (['highjumpkick', 'jumpkick'].some(m => moves.has(m))) {
				// Crash damage move users want an odd HP to survive two misses
				if (hp % 2 > 0) break;
			} else {
				// Maximize number of Stealth Rock switch-ins
				if (srWeakness <= 0 || ability === 'Regenerator') break;
				if (srWeakness === 1 && ['Black Sludge', 'Leftovers', 'Life Orb'].includes(item)) break;
				if (item !== 'Sitrus Berry' && hp % (4 / srWeakness) > 0) break;
				// Minimise number of Stealth Rock switch-ins to activate Sitrus Berry
				if (item === 'Sitrus Berry' && hp % (4 / srWeakness) === 0) break;
			}
			evs.hp -= 4;
		}

		if (['gyroball', 'metalburst', 'trickroom'].some(m => moves.has(m))) {
			evs.spe = 0;
			ivs.spe = (hasHiddenPower && level < 100) ? ivs.spe - 30 : 0;
		}

		// shuffle moves to add more randomness to camomons
		const shuffledMoves = Array.from(moves);
		this.prng.shuffle(shuffledMoves);

		// Z-Conversion Porygon-Z should have Shadow Ball first if no Recover, otherwise Thunderbolt
		if (species.id === 'porygonz' && role === 'Z-Move user') {
			const firstMove = (moves.has('shadowball') ? 'shadowball' : 'thunderbolt');
			this.fastPop(shuffledMoves, shuffledMoves.indexOf(firstMove));
			shuffledMoves.unshift(firstMove);
		}

		return {
			name: species.baseSpecies,
			species: forme,
			gender: species.baseSpecies === 'Greninja' ? 'M' : species.gender,
			shiny: this.randomChance(1, 1024),
			level,
			moves: shuffledMoves,
			ability,
			evs,
			ivs,
			item,
			role,
		};
	}
}

export default RandomGen7ApexTeams;
