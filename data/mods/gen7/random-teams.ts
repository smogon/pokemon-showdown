import {MoveCounter, RandomTeams, TeamData} from '../../random-teams';
import {PRNG, PRNGSeed} from '../../../sim/prng';
import {Utils} from '../../../lib';
import {toID} from '../../../sim/dex';

export interface BattleFactorySpecies {
	flags: {megaOnly?: 1, zmoveOnly?: 1, limEevee?: 1};
	sets: BattleFactorySet[];
}
interface BattleFactorySet {
	species: string;
	item: string;
	ability: string;
	nature: string;
	moves: string[];
	evs?: Partial<StatsTable>;
	ivs?: Partial<StatsTable>;
}

const ZeroAttackHPIVs: {[k: string]: SparseStatsTable} = {
	grass: {hp: 30, spa: 30},
	fire: {spa: 30, spe: 30},
	ice: {def: 30},
	ground: {spa: 30, spd: 30},
	fighting: {def: 30, spa: 30, spd: 30, spe: 30},
	electric: {def: 30, spe: 30},
	psychic: {spe: 30},
	flying: {spa: 30, spd: 30, spe: 30},
	rock: {def: 30, spd: 30, spe: 30},
};

export class RandomGen7Teams extends RandomTeams {
	constructor(format: Format | string, prng: PRNG | PRNGSeed | null) {
		super(format, prng);

		this.noStab = [...this.noStab, 'voltswitch'];

		this.moveEnforcementCheckers = {
			Bug: movePool => movePool.includes('megahorn') || movePool.includes('pinmissile'),
			Dark: (movePool, moves, abilities, types, counter, species) => (
				(!counter.get('Dark') && !abilities.has('Protean')) ||
				(moves.has('pursuit') && species.types.length > 1 && counter.get('Dark') === 1)
			),
			Dragon: (movePool, moves, abilities, types, counter) => (
				!counter.get('Dragon') &&
				!abilities.has('Aerilate') && !abilities.has('Pixilate') &&
				!moves.has('fly') && !moves.has('rest') && !moves.has('sleeptalk')
			),
			Electric: (movePool, moves, abilities, types, counter) => !counter.get('Electric') || movePool.includes('thunder'),
			Fairy: (movePool, moves, abilities, types, counter) => (
				(!counter.get('Fairy') && !types.has('Flying') && !abilities.has('Pixilate'))
			),
			Fighting: (movePool, moves, abilities, types, counter) => !counter.get('Fighting') || !counter.get('stab'),
			Fire: (movePool, moves, abilities, types, counter) => (
				!counter.get('Fire') || ['eruption', 'flareblitz', 'quiverdance'].some(m => movePool.includes(m))
			),
			Flying: (movePool, moves, abilities, types, counter, species) => (
				!counter.get('Flying') && (
					species.id === 'rotomfan' ||
					abilities.has('Gale Wings') ||
					abilities.has('Serene Grace') || (
						types.has('Normal') && (movePool.includes('beakblast') || movePool.includes('bravebird'))
					)
				)
			),
			Ghost: (movePool, moves, abilities, types, counter) => (
				(!counter.get('Ghost') || movePool.includes('spectralthief')) &&
				!types.has('Dark') &&
				!abilities.has('Steelworker')
			),
			Grass: (movePool, moves, abilities, types, counter, species) => (
				!counter.get('Grass') && (species.baseStats.atk >= 100 || movePool.includes('leafstorm'))
			),
			Ground: (movePool, moves, abilities, types, counter) => (
				!counter.get('Ground') && !moves.has('rest') && !moves.has('sleeptalk')
			),
			Ice: (movePool, moves, abilities, types, counter) => (
				!abilities.has('Refrigerate') && (
					!counter.get('Ice') ||
					movePool.includes('iciclecrash') ||
					(abilities.has('Snow Warning') && movePool.includes('blizzard'))
				)
			),
			Normal: movePool => movePool.includes('facade'),
			Poison: (movePool, moves, abilities, types, counter) => (
				!counter.get('Poison') &&
				(!!counter.setupType || abilities.has('Adaptability') || abilities.has('Sheer Force') || movePool.includes('gunkshot'))
			),
			Psychic: (movePool, moves, abilities, types, counter, species) => (
				!counter.get('Psychic') && (
					abilities.has('Psychic Surge') ||
					movePool.includes('psychicfangs') ||
					(!types.has('Flying') && !abilities.has('Pixilate') && counter.get('stab') < species.types.length)
				)
			),
			Rock: (movePool, moves, abilities, types, counter, species) => (
				!counter.get('Rock') &&
				!types.has('Fairy') &&
				(counter.setupType === 'Physical' || species.baseStats.atk >= 105 || abilities.has('Rock Head'))
			),
			Steel: (movePool, moves, abilities, types, counter, species) => (
				!counter.get('Steel') && (species.baseStats.atk >= 100 || abilities.has('Steelworker'))
			),
			Water: (movePool, moves, abilities, types, counter, species) => (
				(!counter.get('Water') && !abilities.has('Protean')) ||
				!counter.get('stab') ||
				movePool.includes('crabhammer') ||
				(abilities.has('Huge Power') && movePool.includes('aquajet'))
			),
			Adaptability: (movePool, moves, abilities, types, counter, species) => (
				!counter.setupType &&
				species.types.length > 1 &&
				(!counter.get(species.types[0]) || !counter.get(species.types[1]))
			),
			Contrary: (movePool, moves, abilities, types, counter, species) => (
				!counter.get('contrary') && species.name !== 'Shuckle'
			),
			'Slow Start': movePool => movePool.includes('substitute'),
		};
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
		isDoubles: boolean
	): {cull: boolean, isSetup?: boolean} {
		const hasRestTalk = moves.has('rest') && moves.has('sleeptalk');
		switch (move.id) {
		// Not very useful without their supporting moves
		case 'clangingscales': case 'electricterrain': case 'happyhour': case 'holdhands':
			return {
				cull: !!teamDetails.zMove || hasRestTalk,
				isSetup: move.id === 'happyhour' || move.id === 'holdhands',
			};
		case 'cottonguard': case 'defendorder':
			return {cull: !counter.get('recovery') && !moves.has('rest')};
		case 'bounce': case 'dig': case 'fly':
			return {cull: !!teamDetails.zMove || counter.setupType !== 'Physical'};
		case 'focuspunch':
			return {cull: !moves.has('substitute') || counter.damagingMoves.size < 2};
		case 'icebeam':
			return {cull: abilities.has('Tinted Lens') && !!counter.get('Status')};
		case 'perishsong':
			return {cull: !moves.has('protect')};
		case 'reflect':
			if (movePool.length > 1) {
				const screen = movePool.indexOf('lightscreen');
				if (screen >= 0) this.fastPop(movePool, screen);
			}
			return {cull: !moves.has('calmmind') && !moves.has('lightscreen')};
		case 'rest':
			return {cull: movePool.includes('sleeptalk')};
		case 'sleeptalk':
			if (movePool.length > 1) {
				const rest = movePool.indexOf('rest');
				if (rest >= 0) this.fastPop(movePool, rest);
			}
			return {cull: !moves.has('rest')};
		case 'storedpower':
			return {cull: !counter.setupType};
		case 'switcheroo': case 'trick':
			return {cull: (
				counter.get('Physical') + counter.get('Special') < 3 ||
				['electroweb', 'snarl', 'suckerpunch'].some(m => moves.has(m))
			)};

		// Set up once and only if we have the moves for it
		case 'bellydrum': case 'bulkup': case 'coil': case 'curse': case 'dragondance': case 'honeclaws': case 'swordsdance':
			return {cull: (
				counter.setupType !== 'Physical' ||
				counter.get('physicalsetup') > 1 ||
				(counter.get('Physical') + counter.get('physicalpool') < 2 && !hasRestTalk) ||
				(move.id === 'bulkup' && hasRestTalk) ||
				(move.id === 'bellydrum' && !abilities.has('Unburden') && !counter.get('priority'))
			), isSetup: true};
		case 'calmmind': case 'geomancy': case 'nastyplot': case 'quiverdance': case 'tailglow':
			if (types.has('Dark') && moves.has('darkpulse')) {
				counter.setupType = 'Special';
				return {cull: false, isSetup: true};
			}
			return {cull: (
				counter.setupType !== 'Special' ||
				counter.get('specialsetup') > 1 ||
				(counter.get('Special') + counter.get('specialpool') < 2 && !hasRestTalk)
			), isSetup: true};
		case 'growth': case 'shellsmash': case 'workup':
			return {cull: (
				counter.setupType !== 'Mixed' ||
				counter.get('mixedsetup') > 1 ||
				counter.damagingMoves.size + counter.get('physicalpool') + counter.get('specialpool') < 2 ||
				(move.id === 'growth' && !moves.has('sunnyday'))
			), isSetup: true};
		case 'agility': case 'autotomize': case 'rockpolish': case 'shiftgear':
			return {cull: counter.damagingMoves.size < 2 || hasRestTalk, isSetup: !counter.setupType};
		case 'flamecharge':
			return {cull: (
				moves.has('dracometeor') ||
				moves.has('overheat') ||
				(counter.damagingMoves.size < 3 && !counter.setupType)
			)};

		// Bad after setup
		case 'circlethrow': case 'dragontail':
			return {cull: (
				!!counter.get('speedsetup') ||
				(isDoubles && moves.has('superpower')) ||
				(!!counter.setupType && ((!moves.has('rest') && !moves.has('sleeptalk')) || moves.has('stormthrow'))) ||
				['encore', 'raindance', 'roar', 'trickroom', 'whirlwind'].some(m => moves.has(m)) ||
				(counter.get(move.type) > 1 && counter.get('Status') > 1) ||
				(abilities.has('Sheer Force') && !!counter.get('sheerforce'))
			)};
		case 'defog':
			return {cull: !!counter.setupType || moves.has('spikes') || moves.has('stealthrock') || !!teamDetails.defog};
		case 'fakeout': case 'tailwind':
			return {cull: !!counter.setupType || ['substitute', 'switcheroo', 'trick'].some(m => moves.has(m))};
		case 'foulplay':
			return {cull: (
				!!counter.setupType ||
				!!counter.get('speedsetup') ||
				counter.get('Dark') > 2 ||
				moves.has('clearsmog') ||
				counter.damagingMoves.size - 1 === counter.get('priority') ||
				hasRestTalk
			)};
		case 'haze': case 'spikes':
			return {cull: !!counter.setupType || !!counter.get('speedsetup') || moves.has('trickroom')};
		case 'healbell': case 'technoblast':
			return {cull: !!counter.get('speedsetup')};
		case 'healingwish': case 'memento':
			return {cull: !!counter.setupType || !!counter.get('recovery') || moves.has('substitute')};
		case 'helpinghand': case 'yawn':
			return {cull: !!counter.setupType};
		case 'icywind': case 'stringshot':
			return {cull: !!counter.get('speedsetup') || moves.has('trickroom')};
		case 'leechseed': case 'roar': case 'whirlwind':
			return {cull: (
				!!counter.setupType ||
				!!counter.get('speedsetup') ||
				moves.has('dragontail') ||
				(isDoubles && (movePool.includes('protect') || movePool.includes('spikyshield')))
			)};
		case 'protect':
			const doublesCondition = (
				moves.has('fakeout') ||
				(moves.has('tailwind') && moves.has('roost')) ||
				movePool.includes('bellydrum') ||
				movePool.includes('shellsmash')
			);
			const singlesCondition = counter.setupType && !moves.has('wish');
			return {cull: (
				(isDoubles ? doublesCondition : singlesCondition) ||
				!!counter.get('speedsetup') ||
				moves.has('rest') || moves.has('roar') || moves.has('whirlwind') ||
				(moves.has('lightscreen') && moves.has('reflect'))
			)};
		case 'pursuit':
			return {cull: (
				!!counter.setupType ||
				counter.get('Status') > 1 ||
				counter.get('Dark') > 2 ||
				(moves.has('knockoff') && !types.has('Dark'))
			)};
		case 'rapidspin':
			return {cull: !!counter.setupType || !!teamDetails.rapidSpin};
		case 'reversal':
			return {cull: moves.has('substitute') && !!teamDetails.zMove};
		case 'seismictoss': case 'superfang':
			return {cull: !abilities.has('Parental Bond') && (counter.damagingMoves.size > 1 || !!counter.setupType)};
		case 'stealthrock':
			return {cull: (
				!!counter.setupType ||
				!!counter.get('speedsetup') ||
				['rest', 'substitute', 'trickroom'].some(m => moves.has(m)) ||
				!!teamDetails.stealthRock
			)};
		case 'stickyweb':
			return {cull: !!teamDetails.stickyWeb};
		case 'toxicspikes':
			return {cull: !!counter.setupType || !!teamDetails.toxicSpikes};
		case 'trickroom':
			return {cull: (
				!!counter.setupType ||
				!!counter.get('speedsetup') ||
				counter.damagingMoves.size < 2 ||
				moves.has('lightscreen') ||
				moves.has('reflect')
			)};
		case 'uturn':
			return {cull: (
				(abilities.has('Speed Boost') && moves.has('protect')) ||
				(abilities.has('Protean') && counter.get('Status') > 2) ||
				!!counter.setupType ||
				!!counter.get('speedsetup') || (
					types.has('Bug') &&
					counter.get('stab') < 2 &&
					counter.damagingMoves.size > 2 &&
					!abilities.has('Adaptability') &&
					!abilities.has('Download')
				)
			)};
		case 'voltswitch':
			return {cull: (
				!!counter.setupType ||
				!!counter.get('speedsetup') ||
				['electricterrain', 'raindance', 'uturn'].some(m => moves.has(m))
			)};

		// Bit redundant to have both
		// Attacks:
		case 'bugbite': case 'bugbuzz': case 'infestation': case 'signalbeam':
			return {cull: moves.has('uturn') && !counter.setupType && !abilities.has('Tinted Lens')};
		case 'darkestlariat': case 'nightslash':
			return {cull: moves.has('knockoff') || moves.has('pursuit')};
		case 'darkpulse':
			return {cull: ['crunch', 'knockoff', 'hyperspacefury'].some(m => moves.has(m)) && counter.setupType !== 'Special'};
		case 'suckerpunch':
			return {cull: counter.damagingMoves.size < 2 || moves.has('glare') || !types.has('Dark') && counter.get('Dark') > 1};
		case 'dracometeor':
			return {cull: hasRestTalk};
		case 'dragonpulse': case 'spacialrend':
			return {cull: moves.has('dracometeor') || moves.has('outrage') || (moves.has('dragontail') && !counter.setupType)};
		case 'outrage':
			return {cull: (
				moves.has('dragonclaw') ||
				(moves.has('dracometeor') && counter.damagingMoves.size < 3) ||
				(moves.has('clangingscales') && !teamDetails.zMove)
			)};
		case 'thunderbolt':
			return {cull: ['discharge', 'voltswitch', 'wildcharge'].some(m => moves.has(m))};
		case 'moonblast':
			return {cull: isDoubles && moves.has('dazzlinggleam')};
		case 'aurasphere': case 'focusblast':
			return {cull: (
				hasRestTalk ||
				((moves.has('closecombat') || moves.has('superpower')) && counter.setupType !== 'Special')
			)};
		case 'drainpunch':
			return {cull: (
				(!moves.has('bulkup') && (moves.has('closecombat') || moves.has('highjumpkick'))) ||
				((moves.has('focusblast') || moves.has('superpower')) && counter.setupType !== 'Physical')
			)};
		case 'closecombat': case 'highjumpkick':
			return {cull: (
				(moves.has('bulkup') && moves.has('drainpunch')) ||
				(counter.setupType === 'Special' && ['aurasphere', 'focusblast'].some(m => moves.has(m) || movePool.includes(m)))
			)};
		case 'dynamicpunch': case 'vacuumwave':
			return {cull: (moves.has('closecombat') || moves.has('facade')) && counter.setupType !== 'Special'};
		case 'stormthrow':
			return {cull: moves.has('circlethrow') && hasRestTalk};
		case 'superpower':
			return {
				cull: (counter.get('Fighting') > 1 && !!counter.setupType) || (hasRestTalk && !abilities.has('Contrary')),
				isSetup: abilities.has('Contrary'),
			};
		case 'fierydance': case 'heatwave':
			return {cull: moves.has('fireblast') && (!!counter.get('Status') || isDoubles)};
		case 'firefang': case 'firepunch': case 'flamethrower':
			return {cull: (
				['blazekick', 'heatwave', 'overheat'].some(m => moves.has(m)) ||
				((moves.has('fireblast') || moves.has('lavaplume')) && counter.setupType !== 'Physical')
			)};
		case 'fireblast': case 'magmastorm':
			return {cull: (
				(moves.has('flareblitz') && counter.setupType !== 'Special') ||
				(moves.has('lavaplume') && !counter.setupType && !counter.get('speedsetup'))
			)};
		case 'lavaplume':
			return {cull: moves.has('firepunch') || moves.has('fireblast') && (!!counter.setupType || !!counter.get('speedsetup'))};
		case 'overheat':
			return {cull: ['fireblast', 'flareblitz', 'lavaplume'].some(m => moves.has(m))};
		case 'hurricane':
			return {cull: moves.has('bravebird') || moves.has('airslash') && !!counter.get('Status')};
		case 'hex':
			return {cull: !moves.has('thunderwave') && !moves.has('willowisp')};
		case 'shadowball':
			return {cull: moves.has('darkpulse') || (moves.has('hex') && moves.has('willowisp'))};
		case 'shadowclaw':
			return {cull: (
				moves.has('shadowforce') ||
				moves.has('shadowsneak') ||
				(moves.has('shadowball') && counter.setupType !== 'Physical')
			)};
		case 'shadowsneak':
			return {cull: (
				moves.has('trick') ||
				hasRestTalk ||
				(types.has('Ghost') && species.types.length > 1 && counter.get('stab') < 2)
			)};
		case 'gigadrain':
			return {cull: (
				moves.has('petaldance') ||
				moves.has('powerwhip') ||
				(!isDoubles && moves.has('seedbomb')) ||
				(moves.has('leafstorm') && counter.get('Special') < 4 && !counter.setupType && !moves.has('trickroom'))
			)};
		case 'leafblade': case 'woodhammer':
			return {cull: (
				(moves.has('gigadrain') && counter.setupType !== 'Physical') ||
				(moves.has('hornleech') && !!counter.setupType)
			)};
		case 'leafstorm':
			return {cull: (
				moves.has('trickroom') ||
				(isDoubles && moves.has('energyball')) ||
				(counter.get('Grass') > 1 && !!counter.setupType)
			)};
		case 'seedbomb':
			return {cull: moves.has('leafstorm') || isDoubles && moves.has('gigadrain')};
		case 'solarbeam':
			return {cull: (
				(!abilities.has('Drought') && !moves.has('sunnyday')) ||
				moves.has('gigadrain') ||
				moves.has('leafstorm')
			)};
		case 'bonemerang': case 'precipiceblades':
			return {cull: moves.has('earthquake')};
		case 'earthpower':
			return {cull: moves.has('earthquake') && counter.setupType !== 'Special'};
		case 'earthquake':
			return {cull: isDoubles && moves.has('highhorsepower')};
		case 'freezedry':
			return {cull: moves.has('icebeam') || moves.has('icywind') || counter.get('stab') < 2};
		case 'bodyslam': case 'return':
			return {cull: (
				moves.has('doubleedge') ||
				(moves.has('glare') && moves.has('headbutt')) ||
				(move.id === 'return' && moves.has('bodyslam'))
			)};
		case 'endeavor':
			return {cull: !isLead && !abilities.has('Defeatist')};
		case 'explosion':
			return {cull: (
				!!counter.setupType ||
				moves.has('wish') ||
				(abilities.has('Refrigerate') && (moves.has('freezedry') || movePool.includes('return')))
			)};
		case 'extremespeed': case 'skyattack':
			return {cull: moves.has('substitute') || counter.setupType !== 'Physical' && moves.has('vacuumwave')};
		case 'facade':
			return {cull: moves.has('bulkup') || hasRestTalk};
		case 'hiddenpower':
			return {cull: (
				moves.has('rest') ||
				(!counter.get('stab') && counter.damagingMoves.size < 2) ||
				// Force Moonblast on Special-setup Fairies
				(counter.setupType === 'Special' && types.has('Fairy') && movePool.includes('moonblast'))
			)};
		case 'hypervoice':
			return {cull: moves.has('blizzard')};
		case 'judgment':
			return {cull: counter.setupType !== 'Special' && counter.get('stab') > 1};
		case 'quickattack':
			return {cull: (
				!!counter.get('speedsetup') ||
				(types.has('Rock') && !!counter.get('Status')) ||
				moves.has('feint') ||
				(types.has('Normal') && !counter.get('stab'))
			)};
		case 'weatherball':
			return {cull: !moves.has('raindance') && !moves.has('sunnyday')};
		case 'poisonjab':
			return {cull: moves.has('gunkshot')};
		case 'acidspray': case 'sludgewave':
			return {cull: moves.has('poisonjab') || moves.has('sludgebomb')};
		case 'psychic':
			return {cull: moves.has('psyshock')};
		case 'psychocut': case 'zenheadbutt':
			return {cull: (
				((moves.has('psychic') || moves.has('psyshock')) && counter.setupType !== 'Physical') ||
				(abilities.has('Contrary') && !counter.setupType && !!counter.get('physicalpool'))
			)};
		case 'psyshock':
			const psychic = movePool.indexOf('psychic');
			if (psychic >= 0) this.fastPop(movePool, psychic);
			return {cull: false};
		case 'headsmash':
			return {cull: moves.has('stoneedge') || isDoubles && moves.has('rockslide')};
		case 'rockblast': case 'rockslide':
			return {cull: (moves.has('headsmash') || moves.has('stoneedge')) && !isDoubles};
		case 'stoneedge':
			return {cull: (
				moves.has('rockslide') ||
				(abilities.has('Guts') && !moves.has('dynamicpunch')) ||
				(isDoubles && moves.has('rockslide'))
			)};
		case 'bulletpunch':
			return {cull: types.has('Steel') && counter.get('stab') < 2 && !abilities.has('Technician')};
		case 'flashcannon':
			return {cull: (moves.has('ironhead') || moves.has('meteormash')) && counter.setupType !== 'Special'};
		case 'hydropump':
			return {cull: (
				moves.has('liquidation') ||
				moves.has('waterfall') ||
				hasRestTalk || (
					moves.has('scald') &&
					((counter.get('Special') < 4 && !moves.has('uturn')) || (species.types.length > 1 && counter.get('stab') < 3))
				)
			)};
		case 'muddywater':
			return {cull: isDoubles && (moves.has('scald') || moves.has('hydropump'))};
		case 'originpulse': case 'surf':
			return {cull: moves.has('hydropump') || moves.has('scald')};
		case 'scald':
			return {cull: ['liquidation', 'waterfall', 'waterpulse'].some(m => moves.has(m))};

		// Status:
		case 'electroweb': case 'stunspore': case 'thunderwave':
			return {cull: (
				!!counter.setupType ||
				!!counter.get('speedsetup') ||
				hasRestTalk ||
				['discharge', 'spore', 'toxic', 'trickroom', 'yawn'].some(m => moves.has(m))
			)};
		case 'glare': case 'headbutt':
			return {cull: moves.has('bodyslam') || !moves.has('glare')};
		case 'toxic':
			const otherStatus = ['hypnosis', 'sleeppowder', 'toxicspikes', 'willowisp', 'yawn'].some(m => moves.has(m));
			return {cull: otherStatus || !!counter.setupType || moves.has('flamecharge') || moves.has('raindance')};
		case 'willowisp':
			return {cull: moves.has('scald')};
		case 'raindance':
			return {cull: (
				counter.get('Physical') + counter.get('Special') < 2 ||
				hasRestTalk ||
				moves.has('rest') ||
				(!types.has('Water') && !counter.get('Water'))
			)};
		case 'sunnyday':
			const cull = (
				counter.get('Physical') + counter.get('Special') < 2 ||
				(!abilities.has('Chlorophyll') && !abilities.has('Flower Gift') && !moves.has('solarbeam')) ||
				hasRestTalk
			);

			if (cull && movePool.length > 1) {
				const solarbeam = movePool.indexOf('solarbeam');
				if (solarbeam >= 0) this.fastPop(movePool, solarbeam);
				if (movePool.length > 1) {
					const weatherball = movePool.indexOf('weatherball');
					if (weatherball >= 0) this.fastPop(movePool, weatherball);
				}
			}

			return {cull};
		case 'painsplit': case 'recover': case 'roost': case 'synthesis':
			return {cull: moves.has('leechseed') || moves.has('rest')};
		case 'substitute':
			return {cull: (
				moves.has('dracometeor') ||
				(moves.has('leafstorm') && !abilities.has('Contrary')) ||
				['encore', 'pursuit', 'rest', 'taunt', 'uturn', 'voltswitch', 'whirlwind'].some(m => moves.has(m)) ||
				movePool.includes('copycat')
			)};
		case 'powersplit':
			return {cull: moves.has('guardsplit')};
		case 'wideguard':
			return {cull: moves.has('protect')};
		case 'bravebird':
			// Hurricane > Brave Bird in the rain
			return {cull: (moves.has('raindance') || abilities.has('Drizzle')) && movePool.includes('hurricane')};
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
		isDoubles: boolean
	): boolean {
		switch (ability) {
		case 'Battle Bond': case 'Dazzling': case 'Flare Boost': case 'Hyper Cutter':
		case 'Ice Body': case 'Innards Out': case 'Moody': case 'Steadfast':
			return true;
		case 'Aerilate': case 'Galvanize': case 'Pixilate': case 'Refrigerate':
			return !counter.get('Normal');
		case 'Analytic': case 'Download':
			return species.nfe;
		case 'Battle Armor': case 'Sturdy':
			return (!!counter.get('recoil') && !counter.get('recovery'));
		case 'Chlorophyll': case 'Leaf Guard':
			return (
				species.baseStats.spe > 100 ||
				abilities.has('Harvest') ||
				(!moves.has('sunnyday') && !teamDetails.sun)
			);
		case 'Competitive':
			return (!counter.get('Special') || moves.has('sleeptalk') && moves.has('rest'));
		case 'Compound Eyes': case 'No Guard':
			return !counter.get('inaccurate');
		case 'Contrary': case 'Iron Fist': case 'Skill Link': case 'Strong Jaw':
			return !counter.get(toID(ability));
		case 'Defiant': case 'Justified': case 'Moxie':
			return !counter.get('Physical') || moves.has('dragontail');
		case 'Flash Fire':
			return abilities.has('Drought');
		case 'Gluttony':
			return !moves.has('bellydrum');
		case 'Harvest':
			return abilities.has('Frisk');
		case 'Hustle':
			return counter.get('Physical') < 2;
		case 'Hydration': case 'Rain Dish': case 'Swift Swim':
			return (species.baseStats.spe > 100 || !moves.has('raindance') && !teamDetails.rain);
		case 'Slush Rush': case 'Snow Cloak':
			return !teamDetails.hail;
		case 'Immunity': case 'Snow Warning':
			return (moves.has('facade') || moves.has('hypervoice'));
		case 'Intimidate':
			return (moves.has('bodyslam') || moves.has('rest') || abilities.has('Reckless') && counter.get('recoil') > 1);
		case 'Lightning Rod':
			return species.types.includes('Ground');
		case 'Limber':
			return species.types.includes('Electric');
		case 'Liquid Voice':
			return !counter.get('sound');
		case 'Magic Guard': case 'Speed Boost':
			return (abilities.has('Tinted Lens') && (!counter.get('Status') || moves.has('uturn')));
		case 'Magician':
			return moves.has('switcheroo');
		case 'Magnet Pull':
			return (!!counter.get('Normal') || !types.has('Electric') && !moves.has('earthpower'));
		case 'Mold Breaker':
			return (
				moves.has('acrobatics') || moves.has('sleeptalk') ||
				abilities.has('Adaptability') || abilities.has('Iron Fist') ||
				(abilities.has('Sheer Force') && !!counter.get('sheerforce'))
			);
		case 'Overgrow':
			return !counter.get('Grass');
		case 'Poison Heal':
			return (abilities.has('Technician') && !!counter.get('technician'));
		case 'Power Construct':
			return species.forme === '10%';
		case 'Prankster':
			return !counter.get('Status');
		case 'Pressure': case 'Synchronize':
			return (counter.get('Status') < 2 || !!counter.get('recoil') || !!species.isMega);
		case 'Regenerator':
			return abilities.has('Magic Guard');
		case 'Quick Feet':
			return moves.has('bellydrum');
		case 'Reckless': case 'Rock Head':
			return (!counter.get('recoil') || !!species.isMega);
		case 'Sand Force': case 'Sand Rush': case 'Sand Veil':
			return !teamDetails.sand;
		case 'Scrappy':
			return !species.types.includes('Normal');
		case 'Serene Grace':
			return (!counter.get('serenegrace') || species.name === 'Blissey');
		case 'Sheer Force':
			return (!counter.get('sheerforce') || moves.has('doubleedge') || abilities.has('Guts') || !!species.isMega);
		case 'Simple':
			return (!counter.setupType && !moves.has('flamecharge'));
		case 'Solar Power':
			return (!counter.get('Special') || !teamDetails.sun || !!species.isMega);
		case 'Swarm':
			return (!counter.get('Bug') || !!species.isMega);
		case 'Sweet Veil':
			return types.has('Grass');
		case 'Technician':
			return (!counter.get('technician') || moves.has('tailslap') || !!species.isMega);
		case 'Tinted Lens':
			return (
				moves.has('protect') || !!counter.get('damage') ||
				(counter.get('Status') > 2 && !counter.setupType) ||
				abilities.has('Prankster') ||
				(abilities.has('Magic Guard') && !!counter.get('Status'))
			);
		case 'Torrent':
			return (!counter.get('Water') || !!species.isMega);
		case 'Unaware':
			return (!!counter.setupType || abilities.has('Magic Guard'));
		case 'Unburden':
			return (!!species.isMega || abilities.has('Prankster') || !counter.setupType && !moves.has('acrobatics'));
		case 'Water Absorb':
			return moves.has('raindance') || ['Drizzle', 'Unaware', 'Volt Absorb'].some(abil => abilities.has(abil));
		case 'Weak Armor':
			return counter.setupType !== 'Physical';
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
	): string | undefined {
		if (species.requiredItems) {
			if (
				species.baseSpecies === 'Arceus' &&
				(moves.has('judgment') || !counter.get(species.types[0]) || teamDetails.zMove)
			) {
				// Judgment doesn't change type with Z-Crystals
				return species.requiredItems[0];
			}
			return this.sample(species.requiredItems);
		}

		// First, the extra high-priority items
		if (species.name === 'Dedenne') return moves.has('substitute') ? 'Petaya Berry' : 'Sitrus Berry';
		if (species.name === 'Deoxys-Attack') return (isLead && moves.has('stealthrock')) ? 'Focus Sash' : 'Life Orb';
		if (species.name === 'Farfetch\u2019d') return 'Stick';
		if (species.name === 'Genesect' && moves.has('technoblast')) return 'Douse Drive';
		if (species.baseSpecies === 'Marowak') return 'Thick Club';
		if (species.name === 'Pikachu') return 'Light Ball';
		if (species.name === 'Shedinja' || species.name === 'Smeargle') return 'Focus Sash';
		if (species.name === 'Unfezant' && counter.get('Physical') >= 2) return 'Scope Lens';
		if (species.name === 'Unown') return 'Choice Specs';
		if (species.name === 'Wobbuffet') return 'Custap Berry';
		if (ability === 'Harvest' || ability === 'Emergency Exit' && !!counter.get('Status')) return 'Sitrus Berry';
		if (ability === 'Imposter') return 'Choice Scarf';
		if (ability === 'Poison Heal') return 'Toxic Orb';
		if (species.nfe) return (ability === 'Technician' && counter.get('Physical') >= 4) ? 'Choice Band' : 'Eviolite';
		if (moves.has('switcheroo') || moves.has('trick')) {
			if (species.baseStats.spe >= 60 && species.baseStats.spe <= 108) {
				return 'Choice Scarf';
			} else {
				return (counter.get('Physical') > counter.get('Special')) ? 'Choice Band' : 'Choice Specs';
			}
		}
		if (moves.has('bellydrum')) {
			if (ability === 'Gluttony') {
				return `${this.sample(['Aguav', 'Figy', 'Iapapa', 'Mago', 'Wiki'])} Berry`;
			} else if (species.baseStats.spe <= 50 && !teamDetails.zMove && this.randomChance(1, 2)) {
				return 'Normalium Z';
			} else {
				return 'Sitrus Berry';
			}
		}
		if (moves.has('copycat') && counter.get('Physical') >= 3) return 'Choice Band';
		if (moves.has('geomancy') || moves.has('skyattack')) return 'Power Herb';
		if (moves.has('shellsmash')) {
			return (ability === 'Solid Rock' && !!counter.get('priority')) ? 'Weakness Policy' : 'White Herb';
		}
		if ((ability === 'Guts' || moves.has('facade')) && !moves.has('sleeptalk')) {
			return (types.has('Fire') || ability === 'Quick Feet' || ability === 'Toxic Boost') ? 'Toxic Orb' : 'Flame Orb';
		}
		if (
			(ability === 'Magic Guard' && counter.damagingMoves.size > 1) ||
			(ability === 'Sheer Force' && counter.get('sheerforce'))
		) {
			return 'Life Orb';
		}
		if (ability === 'Unburden') return moves.has('fakeout') ? 'Normal Gem' : 'Sitrus Berry';
		if (moves.has('acrobatics')) return '';
		if (moves.has('electricterrain') || ability === 'Electric Surge' && moves.has('thunderbolt')) return 'Electrium Z';
		if (
			moves.has('happyhour') ||
			moves.has('holdhands') ||
			(moves.has('encore') && ability === 'Contrary')
		) return 'Normalium Z';
		if (moves.has('raindance')) {
			if (species.baseSpecies === 'Castform' && !teamDetails.zMove) {
				return 'Waterium Z';
			} else {
				return (ability === 'Forecast') ? 'Damp Rock' : 'Life Orb';
			}
		}
		if (moves.has('sunnyday')) {
			if ((species.baseSpecies === 'Castform' || species.baseSpecies === 'Cherrim') && !teamDetails.zMove) {
				return 'Firium Z';
			} else {
				return (ability === 'Forecast') ? 'Heat Rock' : 'Life Orb';
			}
		}

		if (moves.has('solarbeam') && ability !== 'Drought' && !moves.has('sunnyday') && !teamDetails.sun) {
			return !teamDetails.zMove ? 'Grassium Z' : 'Power Herb';
		}

		if (moves.has('auroraveil') || moves.has('lightscreen') && moves.has('reflect')) return 'Light Clay';
		if (
			moves.has('rest') && !moves.has('sleeptalk') &&
			ability !== 'Natural Cure' && ability !== 'Shed Skin' && ability !== 'Shadow Tag'
		) {
			return 'Chesto Berry';
		}

		// Z-Moves
		if (!teamDetails.zMove) {
			if (species.name === 'Decidueye' && moves.has('spiritshackle') && counter.setupType) {
				return 'Decidium Z';
			}
			if (species.name === 'Kommo-o') return moves.has('clangingscales') ? 'Kommonium Z' : 'Dragonium Z';
			if (species.baseSpecies === 'Lycanroc' && moves.has('stoneedge') && counter.setupType) {
				return 'Lycanium Z';
			}
			if (species.name === 'Marshadow' && moves.has('spectralthief') && counter.setupType) {
				return 'Marshadium Z';
			}
			if (species.name === 'Necrozma-Dusk-Mane' || species.name === 'Necrozma-Dawn-Wings') {
				if (moves.has('autotomize') && moves.has('sunsteelstrike')) {
					return 'Solganium Z';
				} else if (moves.has('trickroom') && moves.has('moongeistbeam')) {
					return 'Lunalium Z';
				} else {
					return 'Ultranecrozium Z';
				}
			}

			if (species.name === 'Mimikyu' && moves.has('playrough') && counter.setupType) return 'Mimikium Z';
			if (species.name === 'Raichu-Alola' && moves.has('thunderbolt') && counter.setupType) return 'Aloraichium Z';
			if (moves.has('bugbuzz') && counter.setupType && species.baseStats.spa > 100) return 'Buginium Z';
			if (
				(moves.has('darkpulse') && ability === 'Fur Coat' && counter.setupType) ||
				(moves.has('suckerpunch') && ability === 'Moxie' && counter.get('Dark') < 2)
			) {
				return 'Darkinium Z';
			}
			if (moves.has('outrage') && counter.setupType && !moves.has('fly')) return 'Dragonium Z';
			if (moves.has('fleurcannon') && !!counter.get('speedsetup')) return 'Fairium Z';
			if (
				(moves.has('focusblast') && types.has('Fighting') && counter.setupType) ||
				(moves.has('reversal') && moves.has('substitute'))
			) {
				return 'Fightinium Z';
			}
			if (
				moves.has('fly') ||
				(moves.has('hurricane') && species.baseStats.spa >= 125 && (!!counter.get('Status') || moves.has('superpower'))) ||
				((moves.has('bounce') || moves.has('bravebird')) && counter.setupType)
			) {
				return 'Flyinium Z';
			}
			if (moves.has('shadowball') && counter.setupType && ability === 'Beast Boost') return 'Ghostium Z';
			if (
				moves.has('sleeppowder') && types.has('Grass') &&
				counter.setupType && species.baseStats.spe <= 70
			) {
				return 'Grassium Z';
			}
			if (moves.has('magmastorm')) return 'Firium Z';
			if (moves.has('dig')) return 'Groundium Z';
			if (moves.has('photongeyser') && counter.setupType) return 'Psychium Z';
			if (moves.has('stoneedge') && types.has('Rock') && moves.has('swordsdance')) return 'Rockium Z';
			if (moves.has('hydropump') && ability === 'Battle Bond' && moves.has('uturn')) return 'Waterium Z';
			if ((moves.has('hail') || (moves.has('blizzard') && ability !== 'Snow Warning'))) return 'Icium Z';
		}
	}

	getMediumPriorityItem(
		ability: string,
		moves: Set<string>,
		counter: MoveCounter,
		species: Species,
		isDoubles: boolean,
		isLead: boolean
	): string | undefined {
		const defensiveStatTotal = species.baseStats.hp + species.baseStats.def + species.baseStats.spd;

		if (
			(ability === 'Speed Boost' || ability === 'Stance Change' || species.name === 'Pheromosa') &&
			counter.get('Physical') + counter.get('Special') > 2 &&
			!moves.has('uturn')
		) {
			return 'Life Orb';
		}

		if (isDoubles && moves.has('uturn') && counter.get('Physical') === 4 && !moves.has('fakeout')) {
			return (
				species.baseStats.spe >= 60 && species.baseStats.spe <= 108 &&
				!counter.get('priority') && this.randomChance(1, 2)
			) ? 'Choice Scarf' : 'Choice Band';
		}
		if (isDoubles && counter.get('Special') === 4 && (moves.has('waterspout') || moves.has('eruption'))) {
			return 'Choice Scarf';
		}

		if (
			!isDoubles &&
			counter.get('Physical') >= 4 &&
			['bodyslam', 'dragontail', 'fakeout', 'flamecharge', 'rapidspin', 'suckerpunch'].every(m => !moves.has(m))
		) {
			return (
				(species.baseStats.atk >= 100 || ability === 'Huge Power') &&
				species.baseStats.spe >= 60 && species.baseStats.spe <= 108 &&
				!counter.get('priority') &&
				this.randomChance(2, 3)
			) ? 'Choice Scarf' : 'Choice Band';
		}
		if (
			!isDoubles &&
			(counter.get('Special') >= 4 || (counter.get('Special') >= 3 && moves.has('uturn'))) &&
			!moves.has('acidspray') && !moves.has('clearsmog')
		) {
			return (
				species.baseStats.spa >= 100 &&
				species.baseStats.spe >= 60 && species.baseStats.spe <= 108 &&
				ability !== 'Tinted Lens' &&
				!counter.get('Physical') && !counter.get('priority') &&
				this.randomChance(2, 3)
			) ? 'Choice Scarf' : 'Choice Specs';
		}
		if (
			!isDoubles &&
			counter.get('Physical') >= 3 &&
			moves.has('defog') &&
			!moves.has('foulplay') &&
			species.baseStats.spe >= 60 && species.baseStats.spe <= 108 &&
			!counter.get('priority')
		) {
			return 'Choice Scarf';
		}
		if (!isDoubles && (
			ability === 'Drizzle' ||
			ability === 'Slow Start' ||
			species.name.includes('Rotom-') ||
			['aromatherapy', 'bite', 'clearsmog', 'curse', 'protect', 'sleeptalk'].some(m => moves.has(m)))
		) {
			return 'Leftovers';
		}
		if (['endeavor', 'flail', 'reversal'].some(m => moves.has(m)) && ability !== 'Sturdy') {
			return (ability === 'Defeatist') ? 'Expert Belt' : 'Focus Sash';
		}
		if (moves.has('outrage') && counter.setupType) return 'Lum Berry';
		if (
			isDoubles &&
			counter.damagingMoves.size >= 3 &&
			species.baseStats.spe >= 70 &&
			ability !== 'Multiscale' && ability !== 'Sturdy' && [
				'acidspray', 'electroweb', 'fakeout', 'feint', 'flamecharge', 'icywind',
				'incinerate', 'naturesmadness', 'rapidspin', 'snarl', 'suckerpunch', 'uturn',
			].every(m => !moves.has(m))
		) {
			return defensiveStatTotal >= 275 ? 'Sitrus Berry' : 'Life Orb';
		}

		if (moves.has('substitute')) return counter.damagingMoves.size > 2 && !!counter.get('drain') ? 'Life Orb' : 'Leftovers';
		if (
			!isDoubles &&
			this.dex.getEffectiveness('Ground', species) >= 2 &&
			ability !== 'Levitate' &&
			!moves.has('magnetrise')
		) {
			return 'Air Balloon';
		}
		if ((ability === 'Iron Barbs' || ability === 'Rough Skin') && this.randomChance(1, 2)) return 'Rocky Helmet';
		if (
			counter.get('Physical') + counter.get('Special') >= 4 &&
			species.baseStats.spd >= 50 && defensiveStatTotal >= 235
		) {
			return 'Assault Vest';
		}
		if (species.name === 'Palkia' && (moves.has('dracometeor') || moves.has('spacialrend')) && moves.has('hydropump')) {
			return 'Lustrous Orb';
		}
		if (counter.damagingMoves.size >= 4) {
			return (counter.get('Dragon') || counter.get('Dark') || counter.get('Normal')) ? 'Life Orb' : 'Expert Belt';
		}
		if (counter.damagingMoves.size >= 3 && !!counter.get('speedsetup') && defensiveStatTotal >= 300) {
			return 'Weakness Policy';
		}
		if (
			!isDoubles && isLead &&
			!['Regenerator', 'Sturdy'].includes(ability) &&
			!counter.get('recoil') && !counter.get('recovery') &&
			defensiveStatTotal < 255
		) {
			return 'Focus Sash';
		}
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
		// This is the "REALLY can't think of a good item" cutoff
		if (moves.has('stickyweb') && ability === 'Sturdy') return 'Mental Herb';
		if (ability === 'Serene Grace' && moves.has('airslash') && species.baseStats.spe > 100) return 'Metronome';
		if (ability === 'Sturdy' && moves.has('explosion') && !counter.get('speedsetup')) return 'Custap Berry';
		if (ability === 'Super Luck') return 'Scope Lens';
		if (
			!isDoubles &&
			counter.damagingMoves.size >= 3 &&
			ability !== 'Sturdy' &&
			['acidspray', 'dragontail', 'foulplay', 'rapidspin', 'superfang', 'uturn'].every(m => !moves.has(m)) && (
				counter.get('speedsetup') ||
				moves.has('trickroom') ||
				(species.baseStats.spe > 40 && species.baseStats.hp + species.baseStats.def + species.baseStats.spd < 275)
			)
		) {
			return 'Life Orb';
		}
	}

	randomSet(
		species: string | Species,
		teamDetails: RandomTeamsTypes.TeamDetails = {},
		isLead = false,
		isDoubles = false
	): RandomTeamsTypes.RandomSet {
		species = this.dex.species.get(species);
		let forme = species.name;

		if (typeof species.battleOnly === 'string') {
			// Only change the forme. The species has custom moves, and may have different typing and requirements.
			forme = species.battleOnly;
		}
		if (species.cosmeticFormes) {
			forme = this.sample([species.name].concat(species.cosmeticFormes));
		}

		const randMoves = isDoubles ?
			(species.randomDoubleBattleMoves || species.randomBattleMoves) :
			species.randomBattleMoves;
		const movePool = (randMoves || Object.keys(Dex.species.getLearnset(species.id)!)).slice();
		if (this.format.gameType === 'multi') {
			// Random Multi Battle uses doubles move pools, but Ally Switch fails in multi battles
			const allySwitch = movePool.indexOf('allyswitch');
			if (allySwitch > -1) {
				if (movePool.length > this.maxMoveCount) {
					this.fastPop(movePool, allySwitch);
				} else {
					// Ideally, we'll never get here, but better to have a move that usually does nothing than one that always does
					movePool[allySwitch] = 'sleeptalk';
				}
			}
		}
		const rejectedPool = [];
		const moves = new Set<string>();
		let ability = '';

		const evs = {hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85};
		const ivs = {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31};

		const types = new Set(species.types);
		const abilities = new Set<string>();
		for (const abilityName of Object.values(species.abilities)) {
			if (abilityName === species.abilities.S || (species.unreleasedHidden && abilityName === species.abilities.H)) continue;
			abilities.add(abilityName);
		}

		let availableHP = 0;
		for (const moveid of movePool) {
			if (moveid.startsWith('hiddenpower')) availableHP++;
		}

		// These moves can be used even if we aren't setting up to use them:
		const SetupException = ['closecombat', 'diamondstorm', 'extremespeed', 'superpower', 'clangingscales'];

		let counter: MoveCounter;
		// We use a special variable to track Hidden Power
		// so that we can check for all Hidden Powers at once
		let hasHiddenPower = false;

		do {
			// Choose next 4 moves from learnset/viable moves and add them to moves list:
			while (moves.size < this.maxMoveCount && movePool.length) {
				const moveid = this.sampleNoReplace(movePool);
				if (moveid.startsWith('hiddenpower')) {
					availableHP--;
					if (hasHiddenPower) continue;
					hasHiddenPower = true;
				}
				moves.add(moveid);
			}
			while (moves.size < this.maxMoveCount && rejectedPool.length) {
				const moveid = this.sampleNoReplace(rejectedPool);
				if (moveid.startsWith('hiddenpower')) {
					if (hasHiddenPower) continue;
					hasHiddenPower = true;
				}
				moves.add(moveid);
			}

			counter = this.queryMoves(moves, species.types, abilities, movePool);
			const runEnforcementChecker = (checkerName: string) => {
				if (!this.moveEnforcementCheckers[checkerName]) return false;
				return this.moveEnforcementCheckers[checkerName](
					movePool, moves, abilities, types, counter, species as Species, teamDetails
				);
			};

			// Iterate through the moves again, this time to cull them:
			for (const moveid of moves) {
				const move = this.dex.moves.get(moveid);

				let {cull, isSetup} = this.shouldCullMove(
					move, types, moves, abilities, counter, movePool, teamDetails,
					species, isLead, isDoubles
				);

				// This move doesn't satisfy our setup requirements:
				if (
					(move.category === 'Physical' && counter.setupType === 'Special') ||
					(move.category === 'Special' && counter.setupType === 'Physical')
				) {
					// Reject STABs last in case the setup type changes later on
					const stabs = counter.get(species.types[0]) + (counter.get(species.types[1]) || 0);
					if (
						!SetupException.includes(moveid) &&
						(!types.has(move.type) || stabs > 1 || counter.get(move.category) < 2)
					) cull = true;
				}
				// Hidden Power isn't good enough
				if (
					counter.setupType === 'Special' &&
					moveid === 'hiddenpower' &&
					species.types.length > 1 &&
					counter.get('Special') <= 2 &&
					!types.has(move.type) &&
					!counter.get('Physical') &&
					counter.get('specialpool')
				) {
					cull = true;
				}

				const singlesEnforcement = (
					!['judgment', 'lightscreen', 'reflect', 'sleeptalk', 'toxic'].includes(moveid) && (
						move.category !== 'Status' ||
						// should allow Meganium to cull a recovery move for the sake of STAB
						!(move.flags.heal && species.id !== 'meganium')
					)
				);
				// Pokemon should have moves that benefit their Type/Ability/Weather, as well as moves required by its forme
				if (
					!cull &&
					!move.damage &&
					!isSetup &&
					!move.weather &&
					!move.stallingMove &&
					(isDoubles || singlesEnforcement) && (
						!counter.setupType || counter.setupType === 'Mixed' ||
						(move.category !== counter.setupType && move.category !== 'Status') ||
						(counter.get(counter.setupType) + counter.get('Status') > 3 && !counter.get('hazards'))
					) && (
						move.category === 'Status' ||
						!types.has(move.type) ||
						(move.basePower && move.basePower < 40 && !move.multihit)
					)
				) {
					if (
						(!counter.get('stab') && !moves.has('nightshade') && !moves.has('seismictoss') && (
							species.types.length > 1 ||
							(species.types[0] !== 'Normal' && species.types[0] !== 'Psychic') ||
							!moves.has('icebeam') ||
							species.baseStats.spa >= species.baseStats.spd
						)) || (
							moves.has('suckerpunch') && !abilities.has('Contrary') && counter.get('stab') < species.types.length
						) || (
							(['recover', 'roost', 'slackoff', 'softboiled'].some(m => movePool.includes(m))) &&
							counter.get('Status') &&
							!counter.setupType &&
							['healingwish', 'trick', 'trickroom'].every(m => !moves.has(m))
						) || (
							movePool.includes('milkdrink') ||
							movePool.includes('shoreup') ||
							(movePool.includes('stickyweb') && !counter.setupType && !teamDetails.stickyWeb)
						) || (
							isLead &&
							movePool.includes('stealthrock') &&
							counter.get('Status') && !counter.setupType &&
							!counter.get('speedsetup') && !moves.has('substitute')
						) || (
							species.requiredMove && movePool.includes(toID(species.requiredMove))
						) || (
							!counter.get('Normal') &&
							(abilities.has('Aerilate') || abilities.has('Pixilate') || (abilities.has('Refrigerate') && !moves.has('blizzard')))
						)
					) {
						cull = true;
					} else {
						for (const type of types) {
							if (runEnforcementChecker(type)) {
								cull = true;
							}
						}
						for (const abil of abilities) {
							if (runEnforcementChecker(abil)) {
								cull = true;
							}
						}
					}
				}

				// Sleep Talk shouldn't be selected without Rest
				if (moveid === 'rest' && cull) {
					const sleeptalk = movePool.indexOf('sleeptalk');
					if (sleeptalk >= 0) {
						if (movePool.length < 2) {
							cull = false;
						} else {
							this.fastPop(movePool, sleeptalk);
						}
					}
				}

				// Remove rejected moves from the move list
				const moveIsHP = moveid.startsWith('hiddenpower');
				if (cull && (
					movePool.length - availableHP ||
					(availableHP && (moveIsHP || !hasHiddenPower))
				)) {
					if (
						move.category !== 'Status' &&
						!move.damage &&
						!move.flags.charge &&
						(!moveIsHP || !availableHP)
					) {
						rejectedPool.push(moveid);
					}
					if (moveIsHP) hasHiddenPower = false;
					moves.delete(moveid);
					break;
				}

				if (cull && rejectedPool.length) {
					if (moveIsHP) hasHiddenPower = false;
					moves.delete(moveid);
					break;
				}
			}
		} while (moves.size < this.maxMoveCount && (movePool.length || rejectedPool.length));

		// Moveset modifications
		if (moves.has('autotomize') && moves.has('heavyslam')) {
			if (species.id === 'celesteela') {
				moves.delete('heavyslam');
				moves.add('flashcannon');
			} else {
				moves.delete('autotomize');
				moves.add('rockpolish');
			}
		}
		if (moves.has('raindance') && moves.has('thunderbolt') && !isDoubles) {
			moves.delete('thunderbolt');
			moves.add('thunder');
		}
		if (moves.has('workup') && !counter.get('Special') && species.id === 'zeraora') {
			moves.delete('workup');
			moves.add('bulkup');
		}

		const battleOnly = species.battleOnly && !species.requiredAbility;
		const baseSpecies: Species = battleOnly ? this.dex.species.get(species.battleOnly as string) : species;

		const abilityData = Object.values(baseSpecies.abilities).map(a => this.dex.abilities.get(a));
		Utils.sortBy(abilityData, abil => -abil.rating);

		if (abilityData[1]) {
			// Sort abilities by rating with an element of randomness
			if (abilityData[2] && abilityData[1].rating <= abilityData[2].rating && this.randomChance(1, 2)) {
				[abilityData[1], abilityData[2]] = [abilityData[2], abilityData[1]];
			}
			if (abilityData[0].rating <= abilityData[1].rating && this.randomChance(1, 2)) {
				[abilityData[0], abilityData[1]] = [abilityData[1], abilityData[0]];
			} else if (abilityData[0].rating - 0.6 <= abilityData[1].rating && this.randomChance(2, 3)) {
				[abilityData[0], abilityData[1]] = [abilityData[1], abilityData[0]];
			}
			ability = abilityData[0].name;

			while (this.shouldCullAbility(
				ability, types, moves, abilities, counter, movePool, teamDetails, species, isDoubles
			)) {
				if (ability === abilityData[0].name && abilityData[1].rating >= 1) {
					ability = abilityData[1].name;
				} else if (ability === abilityData[1].name && abilityData[2] && abilityData[2].rating >= 1) {
					ability = abilityData[2].name;
				} else {
					// Default to the highest rated ability if all are rejected
					ability = abilityData[0].name;
					break;
				}
			}

			if (
				abilities.has('Guts') &&
				ability !== 'Quick Feet' &&
				(moves.has('facade') || (moves.has('protect') && !isDoubles) || (moves.has('sleeptalk') && moves.has('rest')))
			) {
				ability = 'Guts';
			} else if (abilities.has('Moxie') && (counter.get('Physical') > 3 || moves.has('bounce')) && !isDoubles) {
				ability = 'Moxie';
			} else if (isDoubles) {
				if (abilities.has('Intimidate')) ability = 'Intimidate';
				if (abilities.has('Guts') && ability !== 'Intimidate') ability = 'Guts';
				if (abilities.has('Storm Drain')) ability = 'Storm Drain';
				if (abilities.has('Harvest')) ability = 'Harvest';
				if (abilities.has('Unburden') && ability !== 'Prankster' && !species.isMega) ability = 'Unburden';
			}
			if (species.name === 'Ambipom' && !counter.get('technician')) {
				// If it doesn't qualify for Technician, Skill Link is useless on it
				ability = 'Pickup';
			}
			if (species.name === 'Raticate-Alola') ability = 'Hustle';
			if (species.name === 'Altaria') ability = 'Natural Cure';
		} else {
			ability = abilityData[0].name;
		}

		if (species.name === 'Genesect' && moves.has('technoblast')) forme = 'Genesect-Douse';
		if (!isDoubles && species.id === 'pikachu') {
			const pikachuForme = this.sample(['', '-Original', '-Hoenn', '-Sinnoh', '-Unova', '-Kalos', '-Alola', '-Partner']);
			forme = `Pikachu${pikachuForme}`;
			if (forme !== 'Pikachu') ability = 'Static';
		}

		if (
			!moves.has('photongeyser') &&
			!teamDetails.zMove &&
			(species.name === 'Necrozma-Dusk-Mane' || species.name === 'Necrozma-Dawn-Wings')
		) {
			for (const moveid of moves) {
				const move = this.dex.moves.get(moveid);
				if (move.category === 'Status' || types.has(move.type)) continue;
				moves.delete(moveid);
				moves.add('photongeyser');
				break;
			}
		}

		let item = this.getHighPriorityItem(ability, types, moves, counter, teamDetails, species, isLead, isDoubles);
		if (item === undefined) item = this.getMediumPriorityItem(ability, moves, counter, species, isDoubles, isLead);
		if (item === undefined) {
			item = this.getLowPriorityItem(ability, types, moves, abilities, counter, teamDetails, species, isLead, isDoubles);
		}

		// fallback
		if (item === undefined) item = isDoubles ? 'Sitrus Berry' : 'Leftovers';
		// For Trick / Switcheroo
		if (item === 'Leftovers' && types.has('Poison')) {
			item = 'Black Sludge';
		}

		let level: number;
		if (this.adjustLevel) {
			level = this.adjustLevel;
		} else if (!isDoubles) {
			const levelScale: {[k: string]: number} = {uber: 76, ou: 80, uu: 82, ru: 84, nu: 86, pu: 88};
			const customScale: {[k: string]: number} = {
				// Banned Ability
				Dugtrio: 82, Gothitelle: 82, Pelipper: 84, Politoed: 84, Torkoal: 84, Wobbuffet: 82,
				// Holistic judgement
				'Castform-Rainy': 100, 'Castform-Snowy': 100, 'Castform-Sunny': 100, Delibird: 100, Luvdisc: 100, Spinda: 100, Unown: 100,
			};
			const tier = toID(species.tier).replace('bl', '');
			level = levelScale[tier] || (species.nfe ? 90 : 80);
			if (customScale[species.name]) level = customScale[species.name];
		} else {
			// We choose level based on BST. Min level is 70, max level is 99. 600+ BST is 70, less than 300 is 99. Calculate with those values.
			// Every 10.34 BST adds a level from 70 up to 99. Results are floored. Uses the Mega's stats if holding a Mega Stone
			const baseStats = species.baseStats;

			let bst = species.bst;
			// If Wishiwashi, use the school-forme's much higher stats
			if (species.baseSpecies === 'Wishiwashi') bst = this.dex.species.get('wishiwashischool').bst;
			// Adjust levels of mons based on abilities (Pure Power, Sheer Force, etc.) and also Eviolite
			// For the stat boosted, treat the Pokemon's base stat as if it were multiplied by the boost. (Actual effective base stats are higher.)
			const speciesAbility = (baseSpecies === species ? ability : species.abilities[0]);
			if (speciesAbility === 'Huge Power' || speciesAbility === 'Pure Power') {
				bst += baseStats.atk;
			} else if (speciesAbility === 'Parental Bond') {
				bst += 0.25 * (counter.get('Physical') > counter.get('Special') ? baseStats.atk : baseStats.spa);
			} else if (speciesAbility === 'Protean') {
				bst += 0.3 * (counter.get('Physical') > counter.get('Special') ? baseStats.atk : baseStats.spa);
			} else if (speciesAbility === 'Fur Coat') {
				bst += baseStats.def;
			} else if (speciesAbility === 'Slow Start') {
				bst -= baseStats.atk / 2 + baseStats.spe / 2;
			} else if (speciesAbility === 'Truant') {
				bst *= 2 / 3;
			}
			if (item === 'Eviolite') {
				bst += 0.5 * (baseStats.def + baseStats.spd);
			} else if (item === 'Light Ball') {
				bst += baseStats.atk + baseStats.spa;
			}
			level = 70 + Math.floor(((600 - Utils.clampIntRange(bst, 300, 600)) / 10.34));
		}

		// Prepare optimal HP
		const srWeakness = this.dex.getEffectiveness('Rock', species);
		while (evs.hp > 1) {
			const hp = Math.floor(Math.floor(2 * species.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100) * level / 100 + 10);
			if (moves.has('substitute') && moves.has('reversal')) {
				// Reversal users should be able to use four Substitutes
				if (hp % 4 > 0) break;
			} else if (moves.has('substitute') && (
				item === 'Petaya Berry' || item === 'Sitrus Berry' ||
				(ability === 'Power Construct' && item !== 'Leftovers')
			)) {
				// Three Substitutes should activate Petaya Berry for Dedenne
				// Two Substitutes should activate Sitrus Berry or Power Construct
				if (hp % 4 === 0) break;
			} else if (moves.has('bellydrum') && (item === 'Sitrus Berry' || ability === 'Gluttony')) {
				// Belly Drum should activate Sitrus Berry
				if (hp % 2 === 0) break;
			} else {
				// Maximize number of Stealth Rock switch-ins
				if (srWeakness <= 0 || hp % (4 / srWeakness) > 0) break;
			}
			evs.hp -= 4;
		}

		// Minimize confusion damage
		if (!counter.get('Physical') && !moves.has('copycat') && !moves.has('transform')) {
			evs.atk = 0;
			ivs.atk = 0;
		}

		// Ensure Nihilego's Beast Boost gives it Special Attack boosts instead of Special Defense
		if (forme === 'Nihilego') evs.spd -= 32;

		if (ability === 'Beast Boost' && counter.get('Special') < 1) {
			evs.spa = 0;
			ivs.spa = 0;
		}

		if (['gyroball', 'metalburst', 'trickroom'].some(m => moves.has(m))) {
			evs.spe = 0;
			ivs.spe = 0;
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

		return {
			name: species.baseSpecies,
			species: forme,
			gender: species.gender,
			shiny: this.randomChance(1, 1024),
			moves: Array.from(moves),
			ability,
			evs,
			ivs,
			item,
			level,
		};
	}

	randomTeam() {
		this.enforceNoDirectCustomBanlistChanges();

		const seed = this.prng.seed;
		const ruleTable = this.dex.formats.getRuleTable(this.format);
		const pokemon = [];

		// For Monotype
		const isMonotype = !!this.forceMonotype || ruleTable.has('sametypeclause');
		const typePool = this.dex.types.names();
		const type = this.forceMonotype || this.sample(typePool);

		const baseFormes: {[k: string]: number} = {};
		let hasMega = false;

		const tierCount: {[k: string]: number} = {};
		const typeCount: {[k: string]: number} = {};
		const typeComboCount: {[k: string]: number} = {};
		const teamDetails: RandomTeamsTypes.TeamDetails = {};

		// We make at most two passes through the potential Pokemon pool when creating a team - if the first pass doesn't
		// result in a team of six Pokemon we perform a second iteration relaxing as many restrictions as possible.
		for (const restrict of [true, false]) {
			if (pokemon.length >= this.maxTeamSize) break;
			const pokemonPool = this.getPokemonPool(type, pokemon, isMonotype);
			while (pokemonPool.length && pokemon.length < this.maxTeamSize) {
				const species = this.dex.species.get(this.sampleNoReplace(pokemonPool));

				// Check if the forme has moves for random battle
				if (this.format.gameType === 'singles') {
					if (!species.randomBattleMoves) continue;
				} else {
					if (!species.randomDoubleBattleMoves) continue;
				}
				if (!species.exists) continue;

				// Limit to one of each species (Species Clause)
				if (baseFormes[species.baseSpecies]) continue;

				// Limit one Mega per team
				if (hasMega && species.isMega) continue;

				// Adjust rate for species with multiple sets
				switch (species.baseSpecies) {
				case 'Arceus': case 'Silvally':
					if (this.randomChance(8, 9) && !isMonotype) continue;
					break;
				case 'Oricorio':
					if (this.randomChance(3, 4)) continue;
					break;
				case 'Castform': case 'Floette':
					if (this.randomChance(2, 3)) continue;
					break;
				case 'Aegislash': case 'Basculin': case 'Cherrim': case 'Gourgeist': case 'Groudon': case 'Kyogre': case 'Meloetta':
					if (this.randomChance(1, 2)) continue;
					break;
				case 'Greninja':
					if (this.gen >= 7 && this.randomChance(1, 2)) continue;
					break;
				}
				if (species.otherFormes && !hasMega && (
					species.otherFormes.includes(species.name + '-Mega') ||
					species.otherFormes.includes(species.name + '-Mega-X')
				)) {
					continue;
				}

				const tier = species.tier;
				const types = species.types;
				const typeCombo = types.slice().sort().join();
				// Dynamically scale limits for different team sizes. The default and minimum value is 1.
				const limitFactor = Math.round(this.maxTeamSize / 6) || 1;

				if (restrict && !species.isMega) {
					// Limit one Pokemon per tier, two for Monotype
					if (
						(tierCount[tier] >= (isMonotype || this.forceMonotype ? 2 : 1) * limitFactor) &&
						!this.randomChance(1, Math.pow(5, tierCount[tier]))
					) {
						continue;
					}

					if (!isMonotype && !this.forceMonotype) {
						// Limit two of any type
						let skip = false;
						for (const typeName of types) {
							if (typeCount[typeName] >= 2 * limitFactor) {
								skip = true;
								break;
							}
						}
						if (skip) continue;
					}

					// Limit one of any type combination, two in Monotype
					if (!this.forceMonotype && typeComboCount[typeCombo] >= (isMonotype ? 2 : 1) * limitFactor) continue;
				}

				const set = this.randomSet(
					species,
					teamDetails,
					pokemon.length === this.maxTeamSize - 1,
					this.format.gameType !== 'singles'
				);

				const item = this.dex.items.get(set.item);

				// Limit one Z-Move per team
				if (item.zMove && teamDetails.zMove) continue;

				// Zoroark copies the last Pokemon
				if (set.ability === 'Illusion') {
					if (pokemon.length < 1) continue;
					set.level = pokemon[pokemon.length - 1].level;
				}

				// Okay, the set passes, add it to our team
				pokemon.unshift(set);

				// Don't bother tracking details for the last Pokemon
				if (pokemon.length === this.maxTeamSize) break;

				// Now that our Pokemon has passed all checks, we can increment our counters
				baseFormes[species.baseSpecies] = 1;

				// Increment tier counter
				if (tierCount[tier]) {
					tierCount[tier]++;
				} else {
					tierCount[tier] = 1;
				}

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

				// Track what the team has
				if (item.megaStone) hasMega = true;
				if (item.zMove) teamDetails.zMove = 1;
				if (set.ability === 'Snow Warning' || set.moves.includes('hail')) teamDetails.hail = 1;
				if (set.moves.includes('raindance') || set.ability === 'Drizzle' && !item.onPrimal) teamDetails.rain = 1;
				if (set.ability === 'Sand Stream') teamDetails.sand = 1;
				if (set.moves.includes('sunnyday') || set.ability === 'Drought' && !item.onPrimal) teamDetails.sun = 1;
				if (set.moves.includes('spikes')) teamDetails.spikes = (teamDetails.spikes || 0) + 1;
				if (set.moves.includes('stealthrock')) teamDetails.stealthRock = 1;
				if (set.moves.includes('stickyweb')) teamDetails.stickyWeb = 1;
				if (set.moves.includes('toxicspikes')) teamDetails.toxicSpikes = 1;
				if (set.moves.includes('defog')) teamDetails.defog = 1;
				if (set.moves.includes('rapidspin')) teamDetails.rapidSpin = 1;
			}
		}
		if (pokemon.length < this.maxTeamSize && pokemon.length < 12) {
			throw new Error(`Could not build a random team for ${this.format} (seed=${seed})`);
		}

		return pokemon;
	}

	randomFactorySets: {[format: string]: {[species: string]: BattleFactorySpecies}} = require('./factory-sets.json');

	randomFactorySet(
		species: Species, teamData: RandomTeamsTypes.FactoryTeamDetails, tier: string
	): RandomTeamsTypes.RandomFactorySet | null {
		const id = toID(species.name);
		const setList = this.randomFactorySets[tier][id].sets;

		const itemsMax: {[k: string]: number} = {
			choicespecs: 1,
			choiceband: 1,
			choicescarf: 1,
		};
		const movesMax: {[k: string]: number} = {
			rapidspin: 1,
			batonpass: 1,
			stealthrock: 1,
			defog: 1,
			spikes: 1,
			toxicspikes: 1,
		};
		const requiredMoves: {[k: string]: string} = {
			stealthrock: 'hazardSet',
			rapidspin: 'hazardClear',
			defog: 'hazardClear',
		};
		const weatherAbilitiesRequire: {[k: string]: string} = {
			hydration: 'raindance', swiftswim: 'raindance',
			leafguard: 'sunnyday', solarpower: 'sunnyday', chlorophyll: 'sunnyday',
			sandforce: 'sandstorm', sandrush: 'sandstorm', sandveil: 'sandstorm',
			slushrush: 'hail', snowcloak: 'hail',
		};
		const weatherAbilities = ['drizzle', 'drought', 'snowwarning', 'sandstream'];

		// Build a pool of eligible sets, given the team partners
		// Also keep track of sets with moves the team requires
		let effectivePool: {set: AnyObject, moveVariants?: number[]}[] = [];
		const priorityPool = [];
		for (const curSet of setList) {
			if (this.forceMonotype && !species.types.includes(this.forceMonotype)) continue;

			const item = this.dex.items.get(curSet.item);
			if (teamData.megaCount && teamData.megaCount > 0 && item.megaStone) continue; // reject 2+ mega stones
			if (teamData.zCount && teamData.zCount > 0 && item.zMove) continue; // reject 2+ Z stones
			if (itemsMax[item.id] && teamData.has[item.id] >= itemsMax[item.id]) continue;

			const ability = this.dex.abilities.get(curSet.ability);
			if (weatherAbilitiesRequire[ability.id] && teamData.weather !== weatherAbilitiesRequire[ability.id]) continue;
			if (teamData.weather && weatherAbilities.includes(ability.id)) continue; // reject 2+ weather setters

			let reject = false;
			let hasRequiredMove = false;
			const curSetVariants = [];
			for (const move of curSet.moves) {
				const variantIndex = this.random(move.length);
				const moveId = toID(move[variantIndex]);
				if (movesMax[moveId] && teamData.has[moveId] >= movesMax[moveId]) {
					reject = true;
					break;
				}
				if (requiredMoves[moveId] && !teamData.has[requiredMoves[moveId]]) {
					hasRequiredMove = true;
				}
				curSetVariants.push(variantIndex);
			}
			if (reject) continue;
			effectivePool.push({set: curSet, moveVariants: curSetVariants});
			if (hasRequiredMove) priorityPool.push({set: curSet, moveVariants: curSetVariants});
		}
		if (priorityPool.length) effectivePool = priorityPool;

		if (!effectivePool.length) {
			if (!teamData.forceResult) return null;
			for (const curSet of setList) {
				effectivePool.push({set: curSet});
			}
		}

		const setData = this.sample(effectivePool);
		const moves = [];
		for (const [i, moveSlot] of setData.set.moves.entries()) {
			moves.push(setData.moveVariants ? moveSlot[setData.moveVariants[i]] : this.sample(moveSlot));
		}


		const item = this.sampleIfArray(setData.set.item);
		const ability = this.sampleIfArray(setData.set.ability);
		const nature = this.sampleIfArray(setData.set.nature);
		const level = this.adjustLevel || setData.set.level || (tier === "LC" ? 5 : 100);

		return {
			name: setData.set.name || species.baseSpecies,
			species: setData.set.species,
			gender: setData.set.gender || species.gender || (this.randomChance(1, 2) ? 'M' : 'F'),
			item: item || '',
			ability: ability || species.abilities['0'],
			shiny: typeof setData.set.shiny === 'undefined' ? this.randomChance(1, 1024) : setData.set.shiny,
			level,
			happiness: typeof setData.set.happiness === 'undefined' ? 255 : setData.set.happiness,
			evs: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0, ...setData.set.evs},
			ivs: {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31, ...setData.set.ivs},
			nature: nature || 'Serious',
			moves,
		};
	}

	randomFactoryTeam(side: PlayerOptions, depth = 0): RandomTeamsTypes.RandomFactorySet[] {
		this.enforceNoDirectCustomBanlistChanges();

		const forceResult = (depth >= 4);
		const isMonotype = !!this.forceMonotype || this.dex.formats.getRuleTable(this.format).has('sametypeclause');

		// The teams generated depend on the tier choice in such a way that
		// no exploitable information is leaked from rolling the tier in getTeam(p1).
		if (!this.factoryTier) {
			this.factoryTier = isMonotype ? 'Mono' : this.sample(['Uber', 'OU', 'UU', 'RU', 'NU', 'PU', 'LC']);
		} else if (isMonotype && this.factoryTier !== 'Mono') {
			// I don't think this can ever happen?
			throw new Error(`Can't generate a Monotype Battle Factory set in a battle with factory tier ${this.factoryTier}`);
		}

		const tierValues: {[k: string]: number} = {
			Uber: 5,
			OU: 4, UUBL: 4,
			UU: 3, RUBL: 3,
			RU: 2, NUBL: 2,
			NU: 1, PUBL: 1,
			PU: 0,
		};

		const pokemon = [];
		const pokemonPool = Object.keys(this.randomFactorySets[this.factoryTier]);

		const typePool = this.dex.types.names();
		const type = this.sample(typePool);

		const teamData: TeamData = {
			typeCount: {}, typeComboCount: {}, baseFormes: {}, megaCount: 0, zCount: 0,
			has: {}, forceResult: forceResult, weaknesses: {}, resistances: {},
		};
		const requiredMoveFamilies = ['hazardSet', 'hazardClear'];
		const requiredMoves: {[k: string]: string} = {
			stealthrock: 'hazardSet',
			rapidspin: 'hazardClear',
			defog: 'hazardClear',
		};
		const weatherAbilitiesSet: {[k: string]: string} = {
			drizzle: 'raindance',
			drought: 'sunnyday',
			snowwarning: 'hail',
			sandstream: 'sandstorm',
		};
		const resistanceAbilities: {[k: string]: string[]} = {
			dryskin: ['Water'], waterabsorb: ['Water'], stormdrain: ['Water'],
			flashfire: ['Fire'], heatproof: ['Fire'],
			lightningrod: ['Electric'], motordrive: ['Electric'], voltabsorb: ['Electric'],
			sapsipper: ['Grass'],
			thickfat: ['Ice', 'Fire'],
			levitate: ['Ground'],
		};

		while (pokemonPool.length && pokemon.length < this.maxTeamSize) {
			const species = this.dex.species.get(this.sampleNoReplace(pokemonPool));
			if (!species.exists) continue;

			// Lessen the need of deleting sets of Pokemon after tier shifts
			if (
				this.factoryTier in tierValues && species.tier in tierValues &&
				tierValues[species.tier] > tierValues[this.factoryTier]
			) continue;

			const speciesFlags = this.randomFactorySets[this.factoryTier][species.id].flags;

			// Limit to one of each species (Species Clause)
			if (teamData.baseFormes[species.baseSpecies]) continue;

			// Limit the number of Megas to one
			if (!teamData.megaCount) teamData.megaCount = 0;
			if (teamData.megaCount >= 1 && speciesFlags.megaOnly) continue;

			const set = this.randomFactorySet(species, teamData, this.factoryTier);
			if (!set) continue;

			const itemData = this.dex.items.get(set.item);

			// Actually limit the number of Megas to one
			if (teamData.megaCount >= 1 && itemData.megaStone) continue;

			// Limit the number of Z moves to one
			if (teamData.zCount && teamData.zCount >= 1 && itemData.zMove) continue;

			let types = species.types;
			// Dynamically scale limits for different team sizes. The default and minimum value is 1.
			const limitFactor = Math.round(this.maxTeamSize / 6) || 1;

			// Enforce Monotype
			if (isMonotype) {
				// Prevents Mega Evolutions from breaking the type limits
				if (itemData.megaStone) {
					const megaSpecies = this.dex.species.get(itemData.megaStone);
					if (types.length > megaSpecies.types.length) types = [species.types[0]];
					// Only check the second type because a Mega Evolution should always share the first type with its base forme.
					if (megaSpecies.types[1] && types[1] && megaSpecies.types[1] !== types[1]) {
						types = [megaSpecies.types[0]];
					}
				}
				if (!types.includes(type)) continue;
			} else {
				// If not Monotype, limit to two of each type
				let skip = false;
				for (const typeName of types) {
					if (teamData.typeCount[typeName] >= 2 * limitFactor && this.randomChance(4, 5)) {
						skip = true;
						break;
					}
				}
				if (skip) continue;

				// Limit 1 of any type combination
				let typeCombo = types.slice().sort().join();
				if (set.ability + '' === 'Drought' || set.ability + '' === 'Drizzle') {
				// Drought and Drizzle don't count towards the type combo limit
					typeCombo = set.ability + '';
				}
				if (teamData.typeComboCount[typeCombo] >= 1 * limitFactor) continue;
			}

			// Okay, the set passes, add it to our team
			pokemon.push(set);
			const typeCombo = types.slice().sort().join();
			// Now that our Pokemon has passed all checks, we can update team data:
			for (const typeName of types) {
				if (typeName in teamData.typeCount) {
					teamData.typeCount[typeName]++;
				} else {
					teamData.typeCount[typeName] = 1;
				}
			}
			teamData.typeComboCount[typeCombo] = (teamData.typeComboCount[typeCombo] + 1) || 1;

			teamData.baseFormes[species.baseSpecies] = 1;

			if (itemData.megaStone) teamData.megaCount++;
			if (itemData.zMove) {
				if (!teamData.zCount) teamData.zCount = 0;
				teamData.zCount++;
			}
			if (itemData.id in teamData.has) {
				teamData.has[itemData.id]++;
			} else {
				teamData.has[itemData.id] = 1;
			}

			const abilityState = this.dex.abilities.get(set.ability);
			if (abilityState.id in weatherAbilitiesSet) {
				teamData.weather = weatherAbilitiesSet[abilityState.id];
			}

			for (const move of set.moves) {
				const moveId = toID(move);
				if (moveId in teamData.has) {
					teamData.has[moveId]++;
				} else {
					teamData.has[moveId] = 1;
				}
				if (moveId in requiredMoves) {
					teamData.has[requiredMoves[moveId]] = 1;
				}
			}

			for (const typeName of this.dex.types.names()) {
				// Cover any major weakness (3+) with at least one resistance
				if (teamData.resistances[typeName] >= 1) continue;
				if (resistanceAbilities[abilityState.id]?.includes(typeName) || !this.dex.getImmunity(typeName, types)) {
					// Heuristic: assume that Pokémon with these abilities don't have (too) negative typing.
					teamData.resistances[typeName] = (teamData.resistances[typeName] || 0) + 1;
					if (teamData.resistances[typeName] >= 1) teamData.weaknesses[typeName] = 0;
					continue;
				}
				const typeMod = this.dex.getEffectiveness(typeName, types);
				if (typeMod < 0) {
					teamData.resistances[typeName] = (teamData.resistances[typeName] || 0) + 1;
					if (teamData.resistances[typeName] >= 1) teamData.weaknesses[typeName] = 0;
				} else if (typeMod > 0) {
					teamData.weaknesses[typeName] = (teamData.weaknesses[typeName] || 0) + 1;
				}
			}
		}
		if (pokemon.length < this.maxTeamSize) return this.randomFactoryTeam(side, ++depth);

		// Quality control
		if (!teamData.forceResult) {
			for (const requiredFamily of requiredMoveFamilies) {
				if (!teamData.has[requiredFamily]) return this.randomFactoryTeam(side, ++depth);
			}
			for (const typeName in teamData.weaknesses) {
				if (teamData.weaknesses[typeName] >= 3) return this.randomFactoryTeam(side, ++depth);
			}
		}

		return pokemon;
	}

	randomBSSFactorySets: AnyObject = require('./bss-factory-sets.json');

	randomBSSFactorySet(
		species: Species, teamData: RandomTeamsTypes.FactoryTeamDetails
	): RandomTeamsTypes.RandomFactorySet | null {
		const id = toID(species.name);
		// const flags = this.randomBSSFactorySets[tier][id].flags;
		const setList = this.randomBSSFactorySets[id].sets;

		const movesMax: {[k: string]: number} = {
			batonpass: 1,
			stealthrock: 1,
			spikes: 1,
			toxicspikes: 1,
			doubleedge: 1,
			trickroom: 1,
		};
		const requiredMoves: {[k: string]: number} = {};
		const weatherAbilitiesRequire: {[k: string]: string} = {
			swiftswim: 'raindance',
			sandrush: 'sandstorm', sandveil: 'sandstorm',
		};
		const weatherAbilities = ['drizzle', 'drought', 'snowwarning', 'sandstream'];

		// Build a pool of eligible sets, given the team partners
		// Also keep track of sets with moves the team requires
		let effectivePool: {set: AnyObject, moveVariants?: number[], itemVariants?: number, abilityVariants?: number}[] = [];
		const priorityPool = [];
		for (const curSet of setList) {
			if (this.forceMonotype && !species.types.includes(this.forceMonotype)) continue;

			const item = this.dex.items.get(curSet.item);
			if (teamData.megaCount && teamData.megaCount > 1 && item.megaStone) continue; // reject 3+ mega stones
			if (teamData.zCount && teamData.zCount > 1 && item.zMove) continue; // reject 3+ Z stones
			if (teamData.has[item.id]) continue; // Item clause

			const ability = this.dex.abilities.get(curSet.ability);
			if (weatherAbilitiesRequire[ability.id] && teamData.weather !== weatherAbilitiesRequire[ability.id]) continue;
			if (teamData.weather && weatherAbilities.includes(ability.id)) continue; // reject 2+ weather setters

			if (curSet.species === 'Aron' && teamData.weather !== 'sandstorm') continue; // reject Aron without a Sand Stream user

			let reject = false;
			let hasRequiredMove = false;
			const curSetVariants = [];
			for (const move of curSet.moves) {
				const variantIndex = this.random(move.length);
				const moveId = toID(move[variantIndex]);
				if (movesMax[moveId] && teamData.has[moveId] >= movesMax[moveId]) {
					reject = true;
					break;
				}
				if (requiredMoves[moveId] && !teamData.has[requiredMoves[moveId]]) {
					hasRequiredMove = true;
				}
				curSetVariants.push(variantIndex);
			}
			if (reject) continue;
			effectivePool.push({set: curSet, moveVariants: curSetVariants});
			if (hasRequiredMove) priorityPool.push({set: curSet, moveVariants: curSetVariants});
		}
		if (priorityPool.length) effectivePool = priorityPool;

		if (!effectivePool.length) {
			if (!teamData.forceResult) return null;
			for (const curSet of setList) {
				effectivePool.push({set: curSet});
			}
		}

		const setData = this.sample(effectivePool);
		const moves = [];
		for (const [i, moveSlot] of setData.set.moves.entries()) {
			moves.push(setData.moveVariants ? moveSlot[setData.moveVariants[i]] : this.sample(moveSlot));
		}

		return {
			name: setData.set.nickname || setData.set.name || species.baseSpecies,
			species: setData.set.species,
			gender: setData.set.gender || species.gender || (this.randomChance(1, 2) ? 'M' : 'F'),
			item: this.sampleIfArray(setData.set.item) || '',
			ability: setData.set.ability || species.abilities['0'],
			shiny: typeof setData.set.shiny === 'undefined' ? this.randomChance(1, 1024) : setData.set.shiny,
			level: setData.set.level || 50,
			happiness: typeof setData.set.happiness === 'undefined' ? 255 : setData.set.happiness,
			evs: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0, ...setData.set.evs},
			ivs: {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31, ...setData.set.ivs},
			nature: setData.set.nature || 'Serious',
			moves,
		};
	}

	randomBSSFactoryTeam(side: PlayerOptions, depth = 0): RandomTeamsTypes.RandomFactorySet[] {
		this.enforceNoDirectCustomBanlistChanges();

		const forceResult = (depth >= 4);

		const pokemon = [];

		const pokemonPool = Object.keys(this.randomBSSFactorySets);

		const teamData: TeamData = {
			typeCount: {}, typeComboCount: {}, baseFormes: {}, megaCount: 0, zCount: 0,
			eeveeLimCount: 0, has: {}, forceResult, weaknesses: {}, resistances: {},
		};
		const requiredMoveFamilies: string[] = [];
		const requiredMoves: {[k: string]: string} = {};
		const weatherAbilitiesSet: {[k: string]: string} = {
			drizzle: 'raindance',
			drought: 'sunnyday',
			snowwarning: 'hail',
			sandstream: 'sandstorm',
		};
		const resistanceAbilities: {[k: string]: string[]} = {
			waterabsorb: ['Water'],
			flashfire: ['Fire'],
			lightningrod: ['Electric'], voltabsorb: ['Electric'],
			thickfat: ['Ice', 'Fire'],
			levitate: ['Ground'],
		};

		while (pokemonPool.length && pokemon.length < this.maxTeamSize) {
			const species = this.dex.species.get(this.sampleNoReplace(pokemonPool));
			if (!species.exists) continue;

			const speciesFlags = this.randomBSSFactorySets[species.id].flags;
			if (!teamData.megaCount) teamData.megaCount = 0;

			// Limit to one of each species (Species Clause)
			if (teamData.baseFormes[species.baseSpecies]) continue;

			// Limit the number of Megas + Z-moves to 3
			if (teamData.megaCount + (teamData.zCount ? teamData.zCount : 0) >= 3 && speciesFlags.megaOnly) continue;

			// Dynamically scale limits for different team sizes. The default and minimum value is 1.
			const limitFactor = Math.round(this.maxTeamSize / 6) || 1;

			// Limit 2 of any type
			const types = species.types;
			let skip = false;
			for (const type of types) {
				if (teamData.typeCount[type] >= 2 * limitFactor && this.randomChance(4, 5)) {
					skip = true;
					break;
				}
			}
			if (skip) continue;

			// Restrict Eevee with certain Pokemon
			if (speciesFlags.limEevee) {
				if (!teamData.eeveeLimCount) teamData.eeveeLimCount = 0;
				teamData.eeveeLimCount++;
			}
			if (teamData.eeveeLimCount && teamData.eeveeLimCount >= 1 && speciesFlags.limEevee) continue;

			const set = this.randomBSSFactorySet(species, teamData);
			if (!set) continue;

			// Limit 1 of any type combination
			let typeCombo = types.slice().sort().join();
			if (set.ability === 'Drought' || set.ability === 'Drizzle') {
				// Drought and Drizzle don't count towards the type combo limit
				typeCombo = set.ability;
			}
			if (teamData.typeComboCount[typeCombo] >= 1 * limitFactor) continue;

			// Okay, the set passes, add it to our team
			pokemon.push(set);

			// Now that our Pokemon has passed all checks, we can update team data:
			for (const type of types) {
				if (type in teamData.typeCount) {
					teamData.typeCount[type]++;
				} else {
					teamData.typeCount[type] = 1;
				}
			}
			teamData.typeComboCount[typeCombo] = (teamData.typeComboCount[typeCombo] + 1) || 1;

			teamData.baseFormes[species.baseSpecies] = 1;

			// Limit Mega and Z-move
			const itemData = this.dex.items.get(set.item);
			if (itemData.megaStone) teamData.megaCount++;
			if (itemData.zMove) {
				if (!teamData.zCount) teamData.zCount = 0;
				teamData.zCount++;
			}
			teamData.has[itemData.id] = 1;

			const abilityState = this.dex.abilities.get(set.ability);
			if (abilityState.id in weatherAbilitiesSet) {
				teamData.weather = weatherAbilitiesSet[abilityState.id];
			}

			for (const move of set.moves) {
				const moveId = toID(move);
				if (moveId in teamData.has) {
					teamData.has[moveId]++;
				} else {
					teamData.has[moveId] = 1;
				}
				if (moveId in requiredMoves) {
					teamData.has[requiredMoves[moveId]] = 1;
				}
			}

			for (const typeName of this.dex.types.names()) {
				// Cover any major weakness (3+) with at least one resistance
				if (teamData.resistances[typeName] >= 1) continue;
				if (resistanceAbilities[abilityState.id]?.includes(typeName) || !this.dex.getImmunity(typeName, types)) {
					// Heuristic: assume that Pokémon with these abilities don't have (too) negative typing.
					teamData.resistances[typeName] = (teamData.resistances[typeName] || 0) + 1;
					if (teamData.resistances[typeName] >= 1) teamData.weaknesses[typeName] = 0;
					continue;
				}
				const typeMod = this.dex.getEffectiveness(typeName, types);
				if (typeMod < 0) {
					teamData.resistances[typeName] = (teamData.resistances[typeName] || 0) + 1;
					if (teamData.resistances[typeName] >= 1) teamData.weaknesses[typeName] = 0;
				} else if (typeMod > 0) {
					teamData.weaknesses[typeName] = (teamData.weaknesses[typeName] || 0) + 1;
				}
			}
		}
		if (pokemon.length < this.maxTeamSize) return this.randomBSSFactoryTeam(side, ++depth);

		// Quality control
		if (!teamData.forceResult) {
			for (const requiredFamily of requiredMoveFamilies) {
				if (!teamData.has[requiredFamily]) return this.randomBSSFactoryTeam(side, ++depth);
			}
			for (const type in teamData.weaknesses) {
				if (teamData.weaknesses[type] >= 3) return this.randomBSSFactoryTeam(side, ++depth);
			}
		}

		return pokemon;
	}
}

export default RandomGen7Teams;
