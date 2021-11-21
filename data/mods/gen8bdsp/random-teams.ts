// BDSP team generation logic is currently largely shared with Swsh

import {PRNG, PRNGSeed} from '../../../sim/prng';
import {MoveCounter, RandomTeams} from '../../random-teams';

export class RandomBDSPTeams extends RandomTeams {
	constructor(format: Format | string, prng: PRNG | PRNGSeed | null) {
		super(format, prng);
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
		// not undefined — we want "no item" not "go find a different item"
		if (moves.has('acrobatics')) return '';
		if (moves.has('solarbeam') && !(moves.has('sunnyday') || teamDetails.sun)) return 'Power Herb';
		if (moves.has('shellsmash')) return 'White Herb';
		// Species-specific item assigning
		if (species.name === 'Farfetch\u2019d') return 'Leek';
		if (species.name === 'Latios' || species.name === 'Latias') return 'Soul Dew';
		if (species.name === 'Lopunny') return 'Toxic Orb';
		if (species.baseSpecies === 'Marowak') return 'Thick Club';
		if (species.baseSpecies === 'Pikachu') return 'Light Ball';
		if (species.name === 'Shedinja') return 'Focus Sash';
		if (species.name === 'Shuckle' && moves.has('stickyweb')) return 'Mental Herb';
		if (['Sniper', 'Super Luck'].includes(ability) || moves.has('focusenergy')) return 'Scope Lens';
		if (species.name === 'Wobbuffet' && moves.has('destinybond')) return 'Custap Berry';
		if (species.name === 'Scyther' && counter.damagingMoves.size > 3) return 'Choice Band';
		if ((moves.has('bellydrum') || moves.has('tailglow')) && moves.has('substitute')) return 'Salac Berry';

		// Ability based logic and miscellaneous logic
		if (species.name === 'Wobbuffet' || ability === 'Ripen') return 'Sitrus Berry';
		if (ability === 'Gluttony') return this.sample(['Aguav', 'Figy', 'Iapapa', 'Mago', 'Wiki']) + ' Berry';
		if (ability === 'Imposter') return 'Choice Scarf';
		if (ability === 'Guts' && counter.get('Physical') > 2) {
			return types.has('Fire') ? 'Toxic Orb' : 'Flame Orb';
		}
		if (ability === 'Magic Guard' && counter.damagingMoves.size > 1) {
			return moves.has('counter') ? 'Focus Sash' : 'Life Orb';
		}
		if (ability === 'Sheer Force' && counter.get('sheerforce')) return 'Life Orb';
		if (ability === 'Unburden') return (moves.has('closecombat') || moves.has('curse')) ? 'White Herb' : 'Sitrus Berry';

		if (moves.has('trick') || moves.has('switcheroo')) {
			if (species.baseStats.spe >= 60 && species.baseStats.spe <= 108 && !counter.get('priority')) {
				return 'Choice Scarf';
			} else {
				return (counter.get('Physical') > counter.get('Special')) ? 'Choice Band' : 'Choice Specs';
			}
		}
		if (moves.has('auroraveil') || moves.has('lightscreen') && moves.has('reflect')) return 'Light Clay';
		if (moves.has('rest') && !moves.has('sleeptalk') && ability !== 'Shed Skin') return 'Chesto Berry';
		if (moves.has('bellydrum')) return 'Sitrus Berry';
	}

	getMediumPriorityItem(
		ability: string,
		moves: Set<string>,
		counter: MoveCounter,
		species: Species,
		isLead: boolean,
		isDoubles: boolean,
		isNoDynamax: boolean
	): string | undefined {
		// Choice items
		if (
			counter.get('Physical') >= 4 && ability !== 'Serene Grace' &&
			['fakeout', 'flamecharge', 'rapidspin'].every(m => !moves.has(m))
		) {
			const scarfReqs = (
				(species.baseStats.atk >= 100 || ability === 'Huge Power') &&
				species.baseStats.spe >= 60 && species.baseStats.spe <= 108 &&
				ability !== 'Speed Boost' && !counter.get('priority') &&
				['bounce', 'aerialace'].every(m => !moves.has(m))
			);
			return (scarfReqs && this.randomChance(2, 3)) ? 'Choice Scarf' : 'Choice Band';
		}
		if (moves.has('sunnyday')) return 'Heat Rock';
		if (moves.has('raindance')) return 'Damp Rock';
		if (counter.get('Special') >= 3 && !moves.has('uturn')) {
			const scarfReqs = (
				species.baseStats.spa >= 100 &&
				species.baseStats.spe >= 60 && species.baseStats.spe <= 108 &&
				ability !== 'Tinted Lens' && !counter.get('Physical')
			);
			return (scarfReqs && this.randomChance(2, 3)) ? 'Choice Scarf' : 'Choice Specs';
		}
		if (counter.get('Physical') >= 3 && !moves.has('rapidspin')) return 'Choice Band';
		if (
			((counter.get('Physical') >= 3 && moves.has('defog')) || (counter.get('Special') >= 3 && moves.has('healingwish'))) &&
			!counter.get('priority') && !moves.has('uturn')
		) return 'Choice Scarf';

		// Other items
		if (
			moves.has('raindance') || moves.has('sunnyday') ||
			(ability === 'Speed Boost' && !counter.get('hazards'))
		) return 'Life Orb';
		if (
			['clearsmog', 'curse', 'haze', 'healbell', 'protect', 'sleeptalk'].some(m => moves.has(m)) &&
			ability === 'Moody'
		) return 'Leftovers';
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
	): string | undefined {
		const defensiveStatTotal = species.baseStats.hp + species.baseStats.def + species.baseStats.spd;

		if (
			isLead &&
			ability !== 'Sturdy' && !moves.has('substitute') &&
			!counter.get('drain') && !counter.get('recoil') && !counter.get('recovery') &&
			((defensiveStatTotal <= 250 && counter.get('hazards')) || defensiveStatTotal <= 210)
		) return 'Focus Sash';
		if (
			counter.damagingMoves.size >= 3 &&
			!counter.get('damage') &&
			ability !== 'Sturdy' &&
			(species.baseStats.spe >= 90 || !moves.has('voltswitch')) &&
			['foulplay', 'rapidspin', 'substitute', 'uturn'].every(m => !moves.has(m)) && (
				counter.get('speedsetup') ||
				// No Dynamax Buzzwole doesn't want Life Orb with Bulk Up + 3 attacks
				(counter.get('drain') && moves.has('roost')) ||
				moves.has('trickroom') || moves.has('psystrike') ||
				(species.baseStats.spe > 40 && defensiveStatTotal < 275)
			)
		) return 'Life Orb';
		if (
			counter.damagingMoves.size >= 4 &&
			!counter.get('Dragon') && !counter.get('Normal')
		) {
			return 'Expert Belt';
		}
		if (
			!moves.has('substitute') &&
			(moves.has('dragondance') || moves.has('swordsdance')) &&
			(moves.has('outrage') || (
				['Bug', 'Fire', 'Ground', 'Normal', 'Poison'].every(type => !types.has(type)) &&
				ability !== 'Storm Drain'
			))
		) return 'Lum Berry';
	}
}

export default RandomBDSPTeams;
