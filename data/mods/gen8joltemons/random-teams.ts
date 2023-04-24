import {Species} from '../../../sim/dex-species';
import {MoveCounter, RandomGen8Teams, OldRandomBattleSpecies} from '../gen8/random-teams';

export class RandomJoltemonsTeams extends RandomGen8Teams {
	randomData: {[species: string]: OldRandomBattleSpecies} = require('./random-data.json');

	shouldCullAbility(
		ability: string,
		types: Set<string>,
		moves: Set<string>,
		abilities: Set<string>,
		counter: MoveCounter,
		movePool: string[],
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isDoubles: boolean,
		isNoDynamax: boolean
	): boolean {
		if ([
			'Immunity', 'Innards Out', 'Insomnia', 'Misty Surge',
			'Quick Feet', 'Snow Cloak', 'Steadfast', 'Steam Engine',
		].includes(ability)) return true;

		switch (ability) {
		// Abilities which are primarily useful for certain moves
		case 'Contrary': case 'Serene Grace': case 'Skill Link': case 'Strong Jaw':
			return !counter.get(this.dex.toID(ability));
		case 'Analytic':
			return (moves.has('rapidspin') || species.nfe || isDoubles);
		case 'Blaze':
			return (isDoubles && abilities.has('Solar Power')) || (!isDoubles && !isNoDynamax && species.id === 'charizard');
		case 'Buzz Off':
			return !counter.has('Bug');
		case 'Chlorophyll':
			return (species.baseStats.spe > 100 || !counter.get('Fire') && !moves.has('sunnyday') && !teamDetails.sun);
		case 'Cloud Nine':
			return (!isNoDynamax || species.id !== 'golduck');
		case 'Competitive':
			return (counter.get('Special') < 2 || (moves.has('rest') && moves.has('sleeptalk')));
		case 'Compound Eyes': case 'No Guard':
			return !counter.get('inaccurate');
		case 'Cursed Body':
			return abilities.has('Infiltrator');
		case 'Defiant':
			return !counter.get('Physical');
		case 'Download':
			return (counter.damagingMoves.size < 3 || moves.has('trick'));
		case 'Early Bird':
			return (types.has('Grass') && isDoubles);
		case 'Flash Fire':
			return (this.dex.getEffectiveness('Fire', species) < -1 || abilities.has('Drought'));
		case 'Frisk':
			return abilities.has('Light Power') && counter.get('Physical') < 2 || abilities.has('Optimistic');
		case 'Gluttony':
			return !moves.has('bellydrum');
		case 'Guts':
			return (!moves.has('facade') && !moves.has('sleeptalk') && !species.nfe);
		case 'Harvest': case 'Pastel Veil':
			return (abilities.has('Frisk') && !isDoubles) || abilities.has('Optimistic');
		case 'Hustle': case 'Inner Focus':
			return (counter.get('Physical') < 2 || abilities.has('Iron Fist'));
		case 'Infiltrator':
			return (moves.has('rest') && moves.has('sleeptalk')) || (isDoubles && abilities.has('Clear Body'));
		case 'Intimidate':
			if (species.id === 'salamence' && moves.has('dragondance')) return true;
			return ['bodyslam', 'bounce', 'tripleaxel'].some(m => moves.has(m));
		case 'Iron Fist':
			return (counter.get('ironfist') < 2 || moves.has('dynamicpunch'));
		case 'Justified':
			return (isDoubles && abilities.has('Inner Focus'));
		case 'Light Power':
			return abilities.has('Beast Boost') || counter.get('Physical') > 2;
		case 'Lightning Rod':
			return (species.types.includes('Ground') || (!isNoDynamax && counter.setupType === 'Physical'));
		case 'Limber':
			return species.types.includes('Electric') || moves.has('facade');
		case 'Liquid Voice':
			return !moves.has('hypervoice');
		case 'Magic Guard':
			// For Sigilyph
			return (abilities.has('Tinted Lens') && !counter.get('Status') && !isDoubles);
		case 'Mold Breaker':
			return (
				abilities.has('Adaptability') || abilities.has('Scrappy') || (abilities.has('Unburden') && !!counter.setupType) ||
				(abilities.has('Sheer Force') && !!counter.get('sheerforce'))
			);
		case 'Moxie':
			return (counter.get('Physical') < 2 || moves.has('stealthrock') || moves.has('defog'));
		case 'Overgrow':
			return !counter.get('Grass');
		case 'Own Tempo':
			return !moves.has('petaldance') || abilities.has('Swift Swim');
		case 'Power Construct':
			return (species.forme === '10%' && !isDoubles);
		case 'Prankster':
			return !counter.get('Status');
		case 'Pressure':
			return (!!counter.setupType || counter.get('Status') < 2 || isDoubles);
		case 'Refrigerate':
			return !counter.get('Normal');
		case 'Regenerator':
			// For Reuniclus
			return abilities.has('Magic Guard');
		case 'Reckless':
			return !counter.get('recoil') || moves.has('curse');
		case 'Rock Head':
			return !counter.get('recoil');
		case 'Sand Force': case 'Sand Veil':
			return !teamDetails.sand;
		case 'Sand Rush':
			return (!teamDetails.sand && (isNoDynamax || !counter.setupType || !counter.get('Rock') || moves.has('rapidspin')));
		case 'Sap Sipper':
			// For Drampa, which wants Berserk with Roost
			return moves.has('roost');
		case 'Scrappy':
			return (moves.has('earthquake') && species.id === 'miltank');
		case 'Screen Cleaner':
			return !!teamDetails.screens;
		case 'Shed Skin':
			// For Scrafty
			return moves.has('dragondance');
		case 'Sheer Force':
			return (!counter.get('sheerforce') || abilities.has('Guts') || (species.id === 'druddigon' && !isDoubles));
		case 'Shell Armor':
			return (
				(counter.setupType && abilities.has('Optimistic')) ||
				(species.id === 'omastar' && (moves.has('spikes') || moves.has('stealthrock')))
			);
		case 'Slush Rush':
			return (!teamDetails.hail && !abilities.has('Swift Swim'));
		case 'Sniper':
			// Inteleon wants Torrent unless it is Gmax
			return (species.name === 'Inteleon' || (counter.get('Water') > 1 && !moves.has('focusenergy')));
		case 'Solar Power':
			return (isNoDynamax && !teamDetails.sun);
		case 'Soul Link':
			return abilities.has('Light Power') && counter.get('Physical') < 2;
		case 'Speed Boost':
			return (isNoDynamax && species.id === 'ninjask');
		case 'Steely Spirit':
			return (moves.has('fakeout') && !isDoubles);
		case 'Sturdy':
			return (moves.has('bulkup') || !!counter.get('recoil') || (!isNoDynamax && abilities.has('Solid Rock')));
		case 'Swarm':
			return (!counter.get('Bug') || !!counter.get('recovery'));
		case 'Sweet Veil':
			return types.has('Grass');
		case 'Swift Swim':
			if (isNoDynamax) {
				const neverWantsSwim = !moves.has('raindance') && [
					'Intimidate', 'Rock Head', 'Water Absorb',
				].some(m => abilities.has(m));
				const noSwimIfNoRain = !moves.has('raindance') && [
					'Cloud Nine', 'Lightning Rod', 'Intimidate', 'Rock Head', 'Sturdy', 'Water Absorb', 'Weak Armor',
				].some(m => abilities.has(m));
				return teamDetails.rain ? neverWantsSwim : noSwimIfNoRain;
			}
			return (!moves.has('raindance') && (
				['Intimidate', 'Rock Head', 'Slush Rush', 'Water Absorb'].some(abil => abilities.has(abil)) ||
				(abilities.has('Lightning Rod') && !counter.setupType)
			));
		case 'Synchronize':
			return counter.get('Status') < 3;
		case 'Technician':
			return (
				!counter.get('technician') ||
				moves.has('tailslap') ||
				abilities.has('Punk Rock') ||
				// For Doubles Alolan Persian
				movePool.includes('snarl')
			);
		case 'Tinted Lens':
			return (
				// For Sigilyph
				moves.has('defog') ||
				// For Butterfree
				(moves.has('hurricane') && abilities.has('Compound Eyes')) ||
				(counter.get('Status') > 2 && !counter.setupType)
			);
		case 'Torrent':
			// For Inteleon-Gmax and Primarina
			return (moves.has('focusenergy') || moves.has('hypervoice'));
		case 'Tough Claws':
			// For Perrserker
			return (types.has('Steel') && !moves.has('fakeout'));
		case 'Unaware':
			// For Swoobat and Clefable
			return (!!counter.setupType || moves.has('fireblast'));
		case 'Unburden':
			return (abilities.has('Prankster') || !counter.setupType && !isDoubles);
		case 'Vapor Control':
			return !teamDetails.sun;
		case 'Volt Absorb':
			return (this.dex.getEffectiveness('Electric', species) < -1);
		case 'Water Absorb':
			return (
				moves.has('raindance') ||
				['Drizzle', 'Strong Jaw', 'Unaware', 'Volt Absorb'].some(abil => abilities.has(abil))
			);
		case 'Weak Armor':
			// The Speed less than 50 case is intended for Cursola, but could apply to any slow Pokémon.
			return (
				(!isNoDynamax && species.baseStats.spe > 50) ||
				species.id === 'skarmory' ||
				moves.has('shellsmash') || moves.has('rapidspin')
			);
		}

		return false;
	}

	getHighPriorityItem(
		ability: string,
		types: Set<string>,
		moves: Set<string>,
		counter: MoveCounter,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		isDoubles: boolean
	) {
		if (ability === 'Honey Gather') return 'Red Card';
		if (ability === 'Scavenge') return 'Soul Blade';
		if (ability === 'Sweet Veil') return 'Honey';

		if (['stakataka', 'buzzwole', 'donphan'].includes(species.id)) return 'Momentum Armor';
		if (['scyther', 'sneasel', 'magneton'].includes(species.id)) return 'Eviolith';
		if (species.id === 'appletun') return 'Sweet Apple';
		if (species.id.startsWith('darmanitan') && counter.get('Special') > 2) return 'Chill Pill';
		if (species.id === 'castform' && (moves.has('raindance') || moves.has('sunnyday'))) return 'Cursed Belt';
		if (species.id === 'cherrim') return 'Morning Blossom';
		if (species.id === 'flapple') return 'Tart Apple';
		if (species.id === 'meloetta' && counter.get('Physical') > 2) return 'Relic Charm';
		if (species.id === 'mimikyu') return 'Nightlight Ball';
		if (species.id === 'phione') return 'Seawater Bead';
		if (species.id === 'regigigas') return 'Sacred Ropes';
		if (species.id === 'swoobat') return 'Coal Engine';
		if (species.id === 'wishiwashi') return 'Graduation Scale';
		if ([
			'pikachu', 'raichu', 'raichualola', 'plusle', 'minun', 'pachirisu',
			'emolga', 'dedenne', 'togedemaru', 'morpeko',
		].includes(species.id)) return 'Light Ball';

		return super.getHighPriorityItem(ability, types, moves, counter, teamDetails, species, isLead, isDoubles);
	}

	getMediumPriorityItem(
		ability: string,
		moves: Set<string>,
		counter: MoveCounter,
		species: Species,
		isLead: boolean,
		isDoubles: boolean,
		isNoDynamax: boolean
	) {
		const item = super.getMediumPriorityItem(ability, moves, counter, species, isLead, isDoubles, isNoDynamax);
		if (counter.setupType === 'Physical' && counter.get('Status') < 2 && !item) return 'Cursed Belt';
		return item;
	}

	getLowPriorityItem(
		ability: string,
		types: Set<string>,
		moves: Set<string>,
		abilities: Set<string>,
		counter: MoveCounter,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		isDoubles: boolean,
		isNoDynamax: boolean
	) {
		const item = super.getLowPriorityItem(
			ability,
			types,
			moves,
			abilities,
			counter,
			teamDetails,
			species,
			isLead,
			isDoubles,
			isNoDynamax
		);
		if (item === 'Leftovers' && types.has('Ghost')) return 'Reaper Cloth';
		return item;
	}
}

export default RandomJoltemonsTeams;
