// BDSP team generation logic is currently largely shared with Swsh

import {PRNG, PRNGSeed} from '../../../sim/prng';
import {MoveCounter, RandomGen8Teams, OldRandomBattleSpecies} from '../gen8/random-teams';

export class RandomBDSPTeams extends RandomGen8Teams {
	randomData: {[species: string]: OldRandomBattleSpecies} = require('./random-data.json');

	constructor(format: Format | string, prng: PRNG | PRNGSeed | null) {
		super(format, prng);
		this.noStab = [...this.noStab, 'gigaimpact'];
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
		if (moves.has('solarbeam') && !(moves.has('sunnyday') || ability === 'Drought' || teamDetails.sun)) return 'Power Herb';
		if (moves.has('shellsmash')) return 'White Herb';
		// Species-specific item assigning
		if (species.name === 'Farfetch\u2019d') return 'Leek';
		if (species.name === 'Latios' || species.name === 'Latias') return 'Soul Dew';
		if (species.name === 'Lopunny') return 'Toxic Orb';
		if (species.baseSpecies === 'Marowak') return 'Thick Club';
		if (species.baseSpecies === 'Pikachu') return 'Light Ball';
		if (species.name === 'Shedinja' || species.name === 'Smeargle') return 'Focus Sash';
		if (species.name === 'Shuckle' && moves.has('stickyweb')) return 'Mental Herb';
		if (ability !== 'Sniper' && (ability === 'Super Luck' || moves.has('focusenergy'))) return 'Scope Lens';
		if (species.name === 'Wobbuffet' && moves.has('destinybond')) return 'Custap Berry';
		if (species.name === 'Scyther' && counter.damagingMoves.size > 3) return 'Choice Band';
		if ((moves.has('bellydrum') || moves.has('tailglow')) && moves.has('substitute')) return 'Salac Berry';

		// Ability based logic and miscellaneous logic
		if (species.name === 'Wobbuffet' || ability === 'Ripen' || ability === 'Harvest') return 'Sitrus Berry';
		if (ability === 'Gluttony') return this.sample(['Aguav', 'Figy', 'Iapapa', 'Mago', 'Wiki']) + ' Berry';
		if (ability === 'Imposter') return 'Choice Scarf';
		if (ability === 'Guts' && counter.get('Physical') > 2) {
			return types.has('Fire') ? 'Toxic Orb' : 'Flame Orb';
		}
		if (ability === 'Quick Feet' && moves.has('facade')) return 'Toxic Orb';
		if (ability === 'Toxic Boost' || ability === 'Poison Heal') return 'Toxic Orb';
		if (ability === 'Magic Guard' && counter.damagingMoves.size > 1) {
			return moves.has('counter') ? 'Focus Sash' : 'Life Orb';
		}
		if (ability === 'Sheer Force' && counter.get('sheerforce')) return 'Life Orb';
		if (ability === 'Unburden') return (moves.has('closecombat') || moves.has('curse')) ? 'White Herb' : 'Sitrus Berry';

		if (!moves.has('fakeout') && (moves.has('trick') || moves.has('switcheroo'))) {
			if (species.baseStats.spe >= 60 && species.baseStats.spe <= 108 && !counter.get('priority')) {
				return 'Choice Scarf';
			} else {
				return (counter.get('Physical') > counter.get('Special')) ? 'Choice Band' : 'Choice Specs';
			}
		}
		if (moves.has('auroraveil') || moves.has('lightscreen') && moves.has('reflect')) return 'Light Clay';
		const statusCuringAbility = (
			ability === 'Shed Skin' ||
			ability === 'Natural Cure' ||
			(ability === 'Hydration' && moves.has('raindance'))
		);
		const restWithoutSleepTalk = (moves.has('rest') && !moves.has('sleeptalk'));
		if (restWithoutSleepTalk && !statusCuringAbility) return 'Chesto Berry';
		if (moves.has('bellydrum')) return 'Sitrus Berry';
	}

	getMediumPriorityItem(
		ability: string,
		moves: Set<string>,
		counter: MoveCounter,
		species: Species,
		isLead: boolean,
		isDoubles: boolean,
	): string | undefined {
		// Choice items
		if (moves.size === 1) {
			switch (this.dex.moves.get([...moves][0]).category) {
			case 'Status':
				return 'Choice Scarf';
			case 'Physical':
				return 'Choice Band';
			case 'Special':
				return 'Choice Specs';
			}
		}

		const choiceOK = ['fakeout', 'flamecharge', 'rapidspin'].every(m => !moves.has(m));

		if (counter.get('Physical') >= 4 && ability !== 'Serene Grace' && choiceOK) {
			const scarfReqs = (
				(species.baseStats.atk >= 100 || ability === 'Huge Power') &&
				species.baseStats.spe >= 60 && species.baseStats.spe <= 108 &&
				ability !== 'Speed Boost' && !counter.get('priority') &&
				['bounce', 'aerialace'].every(m => !moves.has(m))
			);
			return (scarfReqs && this.randomChance(2, 3)) ? 'Choice Scarf' : 'Choice Band';
		}
		if (moves.has('sunnyday')) return 'Heat Rock';
		if (counter.get('Special') >= 4 || (counter.get('Special') >= 3 && moves.has('uturn'))) {
			const scarfReqs = (
				species.baseStats.spa >= 100 &&
				species.baseStats.spe >= 60 && species.baseStats.spe <= 108 &&
				ability !== 'Tinted Lens' && !counter.get('Physical')
			);
			return (scarfReqs && this.randomChance(2, 3)) ? 'Choice Scarf' : 'Choice Specs';
		}
		if (counter.get('Physical') >= 4 && choiceOK) return 'Choice Band';

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
		isDoubles: boolean
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

	shouldCullMove(
		move: Move,
		types: Set<string>,
		moves: Set<string>,
		abilities: Set<string>,
		counter: MoveCounter,
		movePool: string[],
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		isDoubles: boolean,
	): {cull: boolean, isSetup?: boolean} {
		if (isDoubles && species.baseStats.def >= 140 && movePool.includes('bodypress')) {
			// In Doubles, Pokémon with Defense stats >= 140 should always have body press
			return {cull: true};
		}
		if (species.id === 'entei' && movePool.includes('extremespeed')) {
			return {cull: true};
		}
		// Spore is really, really good and should be forced onto all sets.
		// zzzzzz
		// Substitute is a hardcode for Breloom.
		if (movePool.includes('spore') && move.id !== 'substitute') {
			return {cull: true};
		}

		const hasRestTalk = moves.has('rest') && moves.has('sleeptalk');

		// Reject moves that need support
		switch (move.id) {
		case 'fly':
			return {cull: !types.has(move.type) && !counter.setupType && !!counter.get('Status')};
		case 'healbell':
			return {cull: movePool.includes('protect') || movePool.includes('wish')};
		case 'fireblast':
			// Special case for Togekiss, which always wants Aura Sphere
			return {cull: abilities.has('Serene Grace') && (!moves.has('trick') || counter.get('Status') > 1)};
		case 'firepunch':
			// Special case for Darmanitan-Zen-Galar, which doesn't always want Fire Punch
			return {cull: moves.has('earthquake') && movePool.includes('substitute')};
		case 'flamecharge':
			return {cull: movePool.includes('swordsdance')};
		case 'focuspunch':
			return {cull: !moves.has('substitute')};
		case 'rest':
			const bulkySetup = !moves.has('sleeptalk') && ['bulkup', 'calmmind', 'coil', 'curse'].some(m => movePool.includes(m));
			// Registeel would otherwise get Curse sets without Rest, which are very bad generally
			return {cull: species.id !== 'registeel' && (movePool.includes('sleeptalk') || bulkySetup)};
		case 'sleeptalk':
			// Milotic always wants RestTalk
			if (species.id === 'milotic') return {cull: false};
			if (moves.has('stealthrock') || !moves.has('rest')) return {cull: true};
			if (movePool.length > 1 && !abilities.has('Contrary')) {
				const rest = movePool.indexOf('rest');
				if (rest >= 0) this.fastPop(movePool, rest);
			}
			break;
		case 'storedpower':
			return {cull: !counter.setupType};
		case 'switcheroo': case 'trick':
			// We cull Switcheroo + Fake Out because Switcheroo is often used with a Choice item
			return {cull: counter.get('Physical') + counter.get('Special') < 3 || moves.has('rapidspin') || moves.has('fakeout')};
		case 'trickroom':
			const webs = !!teamDetails.stickyWeb;
			return {cull:
				isLead || webs || !!counter.get('speedsetup') ||
				counter.damagingMoves.size < 2 || movePool.includes('nastyplot'),
			};

		// Set up once and only if we have the moves for it
		case 'bellydrum': case 'bulkup': case 'coil': case 'curse': case 'dragondance': case 'honeclaws': case 'swordsdance':
			if (counter.setupType !== 'Physical') return {cull: true}; // if we're not setting up physically this is pointless
			if (counter.get('Physical') + counter.get('physicalpool') < 2 && !hasRestTalk) return {cull: true};
			if (move.id === 'swordsdance' && moves.has('dragondance')) return {cull: true}; // Dragon Dance is judged as better

			return {cull: false, isSetup: true};
		case 'calmmind': case 'nastyplot':
			if (counter.setupType !== 'Special') return {cull: true};
			if (
				(counter.get('Special') + counter.get('specialpool')) < 2 &&
				!hasRestTalk &&
				!(moves.has('wish') && moves.has('protect'))
			) return {cull: true};
			if (moves.has('healpulse') || move.id === 'calmmind' && moves.has('trickroom')) return {cull: true};
			return {cull: false, isSetup: true};
		case 'quiverdance':
			return {cull: false, isSetup: true};
		case 'shellsmash': case 'workup':
			if (counter.setupType !== 'Mixed') return {cull: true};
			if (counter.damagingMoves.size + counter.get('physicalpool') + counter.get('specialpool') < 2) return {cull: true};
			return {cull: false, isSetup: true};
		case 'agility': case 'autotomize': case 'rockpolish':
			if (counter.damagingMoves.size < 2 || moves.has('rest')) return {cull: true};
			if (movePool.includes('calmmind') || movePool.includes('nastyplot')) return {cull: true};
			return {cull: false, isSetup: !counter.setupType};

		// Bad after setup
		case 'counter': case 'reversal':
			// Counter: special case for Alakazam, which doesn't want Counter + Nasty Plot
			return {cull: !!counter.setupType};
		case 'bulletpunch': case 'extremespeed': case 'rockblast':
			return {cull: (
				!!counter.get('speedsetup') ||
				(!isDoubles && moves.has('dragondance')) ||
				counter.damagingMoves.size < 2
			)};
		case 'closecombat': case 'flashcannon':
			const substituteCullCondition = (
				(moves.has('substitute') && !types.has('Fighting')) ||
				(moves.has('toxic') && movePool.includes('substitute'))
			);
			const preferHJKOverCCCullCondition = (
				move.id === 'closecombat' &&
				!counter.setupType &&
				(moves.has('highjumpkick') || movePool.includes('highjumpkick'))
			);
			return {cull: substituteCullCondition || preferHJKOverCCCullCondition};
		case 'defog':
			return {cull: (
				!!counter.setupType ||
				['healbell', 'toxicspikes', 'stealthrock', 'spikes'].some(m => moves.has(m)) ||
				!!teamDetails.defog
			)};
		case 'fakeout':
			return {cull: !!counter.setupType || ['protect', 'rapidspin', 'substitute', 'uturn'].some(m => moves.has(m))};
		case 'glare': case 'icywind': case 'tailwind': case 'waterspout':
			return {cull: !!counter.setupType || !!counter.get('speedsetup') || moves.has('rest')};
		case 'healingwish': case 'memento':
			return {cull: !!counter.setupType || !!counter.get('recovery') || moves.has('substitute') || moves.has('uturn')};
		case 'partingshot':
			return {cull: !!counter.get('speedsetup') || moves.has('bulkup') || moves.has('uturn')};
		case 'protect':
			if (!isDoubles && ((counter.setupType && !moves.has('wish')) || moves.has('rest'))) return {cull: true};
			if (
				!isDoubles &&
				counter.get('Status') < 2 &&
				['Guts', 'Quick Feet', 'Speed Boost', 'Moody'].every(m => !abilities.has(m))
			) return {cull: true};
			if (movePool.includes('leechseed') || (movePool.includes('toxic') && !moves.has('wish'))) return {cull: true};
			if (isDoubles && (
				['bellydrum', 'fakeout', 'shellsmash', 'spore'].some(m => movePool.includes(m)) ||
				moves.has('tailwind') || moves.has('waterspout')
			)) return {cull: true};
			return {cull: false};
		case 'rapidspin':
			const setup = ['curse', 'nastyplot', 'shellsmash'].some(m => moves.has(m));
			return {cull: !!teamDetails.rapidSpin || setup || (!!counter.setupType && counter.get('Fighting') >= 2)};
		case 'roar':
			// for Blastoise
			return {cull: moves.has('shellsmash')};
		case 'shadowsneak':
			const sneakIncompatible = ['substitute', 'trickroom', 'toxic'].some(m => moves.has(m));
			return {cull: hasRestTalk || sneakIncompatible || counter.setupType === 'Special'};
		case 'spikes':
			return {cull: !!counter.setupType || (!!teamDetails.spikes && teamDetails.spikes > 1)};
		case 'stealthrock':
			return {cull:
				!!counter.setupType ||
				!!counter.get('speedsetup') ||
				!!teamDetails.stealthRock ||
				['rest', 'substitute', 'trickroom', 'teleport'].some(m => moves.has(m)),
			};
		case 'stickyweb':
			return {cull: !!teamDetails.stickyWeb};
		case 'taunt':
			return {cull: moves.has('encore') || moves.has('nastyplot') || moves.has('swordsdance')};
		case 'thunderwave': case 'voltswitch':
			const cullInDoubles = isDoubles && (moves.has('electroweb') || moves.has('nuzzle'));
			return {cull: (
				!!counter.setupType ||
				!!counter.get('speedsetup') ||
				moves.has('shiftgear') ||
				moves.has('raindance') ||
				cullInDoubles
			)};
		case 'toxic':
			return {cull: !!counter.setupType || ['sludgewave', 'thunderwave', 'willowisp'].some(m => moves.has(m))};
		case 'toxicspikes':
			return {cull: !!counter.setupType || !!teamDetails.toxicSpikes};
		case 'uturn':
			const bugSwordsDanceCase = types.has('Bug') && counter.get('recovery') && moves.has('swordsdance');
			return {cull: (
				!!counter.get('speedsetup') ||
				(counter.setupType && !bugSwordsDanceCase) ||
				(abilities.has('Speed Boost') && moves.has('protect')) ||
				(isDoubles && moves.has('leechlife'))
			)};

		/**
		 * Ineffective to have both moves together
		 *
		 * These are sorted in order of:
		 * Normal>Fire>Water>Electric>Grass>Ice>Fighting>Poison>Ground>Flying>Psychic>Bug>Rock>Ghost>Dragon>Dark>Fairy
		 * and then subsorted alphabetically.
		 * This type order is arbitrary and referenced from https://pokemondb.net/type.
		 */
		case 'explosion':
			const otherMoves = ['curse', 'stompingtantrum', 'painsplit', 'wish'].some(m => moves.has(m));
			return {cull: !!counter.get('speedsetup') || !!counter.get('recovery') || otherMoves};
		case 'quickattack':
			return {cull: !!counter.get('speedsetup') || (types.has('Rock') && !!counter.get('Status'))};
		case 'flamethrower': case 'lavaplume':
			const otherFireMoves = ['heatwave', 'overheat'].some(m => moves.has(m));
			return {cull: (moves.has('fireblast') && counter.setupType !== 'Physical') || otherFireMoves};
		case 'overheat':
			return {cull: moves.has('flareblitz') || (isDoubles && moves.has('calmmind'))};
		case 'aquatail':
			return {cull: moves.has('aquajet') || !!counter.get('Status')};
		case 'hydropump':
			return {cull: moves.has('scald') && (
				(counter.get('Special') < 4 && !moves.has('uturn')) ||
				(species.types.length > 1 && counter.get('stab') < 3)
			)};
		case 'gigadrain':
			return {cull: types.has('Poison') && !counter.get('Poison')};
		case 'leafstorm':
			const leafBladePossible = movePool.includes('leafblade') || moves.has('leafblade');
			return {cull:
				(counter.setupType === 'Physical' && leafBladePossible) ||
				(moves.has('gigadrain') && !!counter.get('Status')) ||
				(isDoubles && moves.has('energyball')),
			};
		case 'freezedry':
			const betterIceMove = (
				(moves.has('blizzard') && !!counter.setupType) ||
				(moves.has('icebeam') && counter.get('Special') < 4)
			);
			const preferThunderWave = movePool.includes('thunderwave') && types.has('Electric');
			return {cull: betterIceMove || preferThunderWave || movePool.includes('bodyslam')};
		// Milotic always wants RestTalk
		case 'icebeam':
			return {cull: moves.has('dragontail')};
		case 'bodypress':
			const pressIncompatible = ['shellsmash', 'mirrorcoat', 'whirlwind'].some(m => moves.has(m));
			return {cull: pressIncompatible || counter.setupType === 'Special'};
		case 'drainpunch':
			return {cull: moves.has('closecombat') || (!types.has('Fighting') && movePool.includes('swordsdance'))};
		case 'facade':
			// Prefer Dynamic Punch when it can be a guaranteed-hit STAB move (mostly for Machamp)
			return {cull: moves.has('dynamicpunch') && species.types.includes('Fighting') && abilities.has('No Guard')};
		case 'focusblast':
			// Special cases for Blastoise and Regice; Blastoise wants Shell Smash, and Regice wants Thunderbolt
			return {cull: movePool.includes('shellsmash') || hasRestTalk};
		case 'superpower':
			return {
				cull: moves.has('hydropump') ||
					(counter.get('Physical') >= 4 && movePool.includes('uturn')) ||
					(moves.has('substitute') && !abilities.has('Contrary')),
				isSetup: abilities.has('Contrary'),
			};
		case 'poisonjab':
			return {cull: !types.has('Poison') && counter.get('Status') >= 2};
		case 'earthquake':
			const doublesCull = moves.has('earthpower') || moves.has('highhorsepower');
			const subToxicPossible = moves.has('substitute') && movePool.includes('toxic');
			return {cull: (isDoubles && doublesCull) || subToxicPossible || moves.has('bonemerang')};
		case 'airslash':
			return {cull: hasRestTalk || counter.setupType === 'Physical'};
		case 'hurricane':
			return {cull: counter.setupType === 'Physical'};
		case 'futuresight':
			return {cull: moves.has('psyshock') || moves.has('trick') || movePool.includes('teleport')};
		case 'psychic':
			return {cull: moves.has('psyshock') && (!!counter.setupType || isDoubles)};
		case 'psyshock':
			return {cull: moves.has('psychic')};
		case 'bugbuzz':
			return {cull: moves.has('uturn') && !counter.setupType && !abilities.has('Tinted Lens')};
		case 'leechlife':
			return {cull:
				(isDoubles && moves.has('lunge')) ||
				(moves.has('uturn') && !counter.setupType) ||
				movePool.includes('spikes'),
			};
		case 'stoneedge':
			const machampCullCondition = species.id === 'machamp' && !moves.has('dynamicpunch');
			const rockSlidePlusStatusPossible = counter.get('Status') && movePool.includes('rockslide');
			const otherRockMove = moves.has('rockblast') || moves.has('rockslide');
			const lucarioCull = species.id === 'lucario' && !!counter.setupType;
			return {cull: machampCullCondition || (!isDoubles && rockSlidePlusStatusPossible) || otherRockMove || lucarioCull};
		case 'shadowball':
			return {cull:
				(isDoubles && moves.has('phantomforce')) ||
				(!types.has('Ghost') && movePool.includes('focusblast')),
			};
		case 'shadowclaw':
			return {cull: types.has('Steel') && moves.has('shadowsneak') && counter.get('Physical') < 4};
		case 'dragonpulse': case 'spacialrend':
			return {cull: moves.has('dracometeor') && counter.get('Special') < 4};
		case 'darkpulse':
			const pulseIncompatible = ['foulplay', 'knockoff'].some(m => moves.has(m)) || (
				species.id === 'shiftry' && (moves.has('defog') || moves.has('suckerpunch'))
			);
			// Special clause to prevent bugged Shiftry sets with Sucker Punch + Nasty Plot
			const shiftryCase = movePool.includes('nastyplot') && !moves.has('defog');
			return {cull: pulseIncompatible && !shiftryCase && counter.setupType !== 'Special'};
		case 'suckerpunch':
			return {cull:
				moves.has('rest') ||
				counter.damagingMoves.size < 2 ||
				(counter.setupType === 'Special') ||
				(counter.get('Dark') > 1 && !types.has('Dark')),
			};
		case 'dazzlinggleam':
			return {cull: ['moonblast', 'petaldance'].some(m => moves.has(m))};

		// Status:
		case 'bodyslam': case 'clearsmog':
			const toxicCullCondition = moves.has('toxic') && !types.has('Normal');
			return {cull: moves.has('sludgebomb') || moves.has('trick') || movePool.includes('recover') || toxicCullCondition};
		case 'willowisp': case 'yawn':
			// Swords Dance is a special case for Rapidash
			return {cull: moves.has('thunderwave') || moves.has('toxic') || moves.has('swordsdance')};
		case 'painsplit': case 'recover': case 'synthesis':
			return {cull: moves.has('rest') || moves.has('wish') || (move.id === 'synthesis' && moves.has('gigadrain'))};
		case 'roost':
			return {cull:
				moves.has('throatchop') ||
				// Special cases for Salamence, Dynaless Dragonite, and Scizor to help prevent sets with poor coverage or no setup.
				(moves.has('dualwingbeat') && (moves.has('outrage') || species.id === 'scizor')),
			};
		case 'reflect': case 'lightscreen':
			return {cull: !!teamDetails.screens};
		case 'slackoff':
			// Special case to prevent Scaldless Slowking
			return {cull: species.id === 'slowking' && !moves.has('scald')};
		case 'substitute':
			const moveBasedCull = (
				// Breloom is OK with Substitute + Swords Dance (for subpunch sets)
				species.id !== 'breloom' &&
				['bulkup', 'nastyplot', 'painsplit', 'roost', 'swordsdance'].some(m => movePool.includes(m))
			);
			const shayminCase = abilities.has('Serene Grace') && movePool.includes('airslash') && !moves.has('airslash');
			return {cull: moves.has('rest') || moveBasedCull || shayminCase};
		case 'helpinghand':
			// Special case for Shuckle in Doubles, which doesn't want sets with no method to harm foes
			return {cull: moves.has('acupressure')};
		case 'wideguard':
			return {cull: moves.has('protect')};
		case 'grassknot':
			// Special case for Raichu
			return {cull: moves.has('surf')};
		}

		return {cull: false};
	}

	shouldCullAbility(
		ability: string,
		types: Set<string>,
		moves: Set<string>,
		abilities: Set<string>,
		counter: MoveCounter,
		movePool: string[],
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		preferredType: string,
		role: RandomTeamsTypes.Role,
		isDoubles: boolean,
	): boolean {
		if ([
			'Flare Boost', 'Hydration', 'Ice Body', 'Immunity', 'Insomnia', 'Rain Dish',
			'Snow Cloak', 'Steadfast',
		].includes(ability)) return true;

		switch (ability) {
		// Abilities which are primarily useful for certain moves
		case 'Contrary': case 'Serene Grace': case 'Skill Link':
			return !counter.get(ability.toLowerCase().replace(/\s/g, ''));
		case 'Analytic':
			return (moves.has('rapidspin') || species.nfe || isDoubles);
		case 'Blaze':
			return (isDoubles && abilities.has('Solar Power')) || (!isDoubles && species.id === 'charizard');
		case 'Chlorophyll':
			return (species.baseStats.spe > 100 || !counter.get('Fire') && !moves.has('sunnyday') && !teamDetails.sun);
		case 'Cloud Nine':
			return species.id !== 'golduck';
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
		case 'Gluttony':
			return !moves.has('bellydrum');
		case 'Guts':
			return (!moves.has('facade') && !moves.has('sleeptalk') && !species.nfe ||
				abilities.has('Quick Feet') && !!counter.setupType);
		case 'Harvest':
			return (abilities.has('Frisk') && !isDoubles);
		case 'Hustle': case 'Inner Focus':
			return (counter.get('Physical') < 2 || abilities.has('Iron Fist'));
		case 'Infiltrator':
			return (moves.has('rest') && moves.has('sleeptalk')) || (isDoubles && abilities.has('Clear Body'));
		case 'Intimidate':
			if (species.id === 'salamence' && moves.has('dragondance')) return true;
			return ['bodyslam', 'bounce', 'rockclimb', 'tripleaxel'].some(m => moves.has(m));
		case 'Iron Fist':
			return (counter.get('ironfist') < 2 || moves.has('dynamicpunch'));
		case 'Justified':
			return (isDoubles && abilities.has('Inner Focus'));
		case 'Lightning Rod':
			return (species.types.includes('Ground') || counter.setupType === 'Physical');
		case 'Limber':
			return species.types.includes('Electric') || moves.has('facade');
		case 'Mold Breaker':
			return (
				abilities.has('Adaptability') || abilities.has('Scrappy') || (abilities.has('Unburden') && !!counter.setupType) ||
				(abilities.has('Sheer Force') && !!counter.get('sheerforce'))
			);
		case 'Moody':
			return !!counter.setupType && abilities.has('Simple');
		case 'Moxie':
			return (counter.get('Physical') < 2 || moves.has('stealthrock') || moves.has('defog'));
		case 'Overgrow':
			return !counter.get('Grass');
		case 'Own Tempo':
			return !moves.has('petaldance');
		case 'Prankster':
			return !counter.get('Status');
		case 'Pressure':
			return (!!counter.setupType || counter.get('Status') < 2 || isDoubles);
		case 'Quick Feet':
			return !moves.has('facade');
		case 'Reckless':
			return !counter.get('recoil') || moves.has('curse');
		case 'Rock Head':
			return !counter.get('recoil');
		case 'Sand Force': case 'Sand Veil':
			return !teamDetails.sand;
		case 'Sand Rush':
			return (!teamDetails.sand && (!counter.setupType || !counter.get('Rock') || moves.has('rapidspin')));
		case 'Scrappy':
			return (moves.has('earthquake') && species.id === 'miltank');
		case 'Sheer Force':
			return (!counter.get('sheerforce') || abilities.has('Guts'));
		case 'Shell Armor':
			return (species.id === 'omastar' && (moves.has('spikes') || moves.has('stealthrock')));
		case 'Sniper':
			return counter.get('Water') > 1 && !moves.has('focusenergy');
		case 'Solar Power':
			return (!teamDetails.sun || abilities.has('Harvest'));
		case 'Speed Boost':
			return moves.has('uturn');
		case 'Sturdy':
			return (moves.has('bulkup') || !!counter.get('recoil') || abilities.has('Solid Rock'));
		case 'Swarm':
			return (!counter.get('Bug') || !!counter.get('recovery'));
		case 'Swift Swim':
			const neverWantsSwim = !moves.has('raindance') && [
				'Intimidate', 'Rock Head', 'Water Absorb',
			].some(m => abilities.has(m));
			const noSwimIfNoRain = !moves.has('raindance') && [
				'Cloud Nine', 'Lightning Rod', 'Intimidate', 'Rock Head', 'Sturdy', 'Water Absorb', 'Water Veil', 'Weak Armor',
			].some(m => abilities.has(m));
			return teamDetails.rain ? neverWantsSwim : noSwimIfNoRain;
		case 'Synchronize':
			return counter.get('Status') < 3;
		case 'Technician':
			return (
				!counter.get('technician') ||
				moves.has('tailslap') ||
				abilities.has('Punk Rock')
			);
		case 'Tinted Lens':
			return (
				// For Butterfree
				(moves.has('hurricane') && abilities.has('Compound Eyes')) ||
				(counter.get('Status') > 2 && !counter.setupType) ||
				// For Yanmega
				moves.has('protect')
			);
		case 'Unaware':
			return species.id === 'bibarel';
		case 'Unburden':
			return (
				abilities.has('Prankster') ||
				// intended for Hitmonlee
				abilities.has('Reckless') ||
				!counter.setupType && !isDoubles
			);
		case 'Volt Absorb':
			return (this.dex.getEffectiveness('Electric', species) < -1);
		case 'Water Absorb':
			return (
				moves.has('raindance') ||
				['Drizzle', 'Strong Jaw', 'Unaware', 'Volt Absorb'].some(abil => abilities.has(abil))
			);
		case 'Weak Armor':
			return (
				species.id === 'skarmory' ||
				moves.has('shellsmash') || moves.has('rapidspin')
			);
		}

		return false;
	}
}

export default RandomBDSPTeams;
