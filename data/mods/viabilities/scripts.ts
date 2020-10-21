export const Scripts: ModdedBattleScriptsData = {
	init() {
		const newMoves = (mon: string, moves: string[]) => {
			for (const move of moves) {
				this.modData('Learnsets', this.toID(mon)).learnset[this.toID(move)] = ["8M"];
			}
		};
		newMoves('alcremie', ['earthpower', 'rapidspin', 'powergem']);
		newMoves('aromatisse', ['mysticalfire', 'softboiled', 'defog']);
		newMoves('barbaracle', ['highhorsepower', 'closecombat']);
		newMoves('beheeyem', ['aurasphere', 'nastyplot', 'icebeam']);
		newMoves('bewear', ['circlethrow', 'fakeout', 'poweruppunch']);
		newMoves('boltund', ['energyball', 'shadowball', 'paraboliccharge']);
		newMoves('cofagrigus', ['flashcannon', 'powergem']);
		newMoves('crustle', ['leechlife']);
		newMoves('dunsparce', ['firstimpression', 'snaptrap']);
		newMoves('espeon', ['highhorsepower', 'earthpower', 'playrough']);
		newMoves('falinks', ['gunkshot', 'stoneedge']);
		newMoves('flareon', ['highhorsepower', 'earthpower', 'playrough', 'wildcharge']);
		newMoves('garbodor', ['knockoff', 'stickyweb', 'taunt']);
		newMoves('gardevoir', ['sparklingaria', 'fireblast']);
		newMoves('glaceon', ['highhorsepower', 'earthpower', 'playrough']);
		newMoves('golurk', ['shadowsneak', 'shadowclaw', 'swordsdance']);
		newMoves('goodra', ['poisongas']);
		newMoves('gourgeist', ['bodypress', 'spectralthief', 'headsmash']);
		// newMoves('gourgeistlarge', ['bodypress', 'spectralthief', 'headsmash']);
		// newMoves('gourgeistsmall', ['bodypress', 'spectralthief', 'headsmash']);
		// newMoves('gourgeistsuper', ['bodypress', 'spectralthief', 'headsmash']);
		newMoves('grapploct', ['recover', 'flipturn', 'throatchop']);
		newMoves('greedent', ['recycle', 'curse', 'doubleedge']);
		newMoves('hatterene', ['ancientpower', 'cosmicpower']);
		newMoves('hitmonchan', ['hammerarm', 'knockoff', 'taunt']);
		newMoves('jolteon', ['nastyplot', 'spikes', 'highhorsepower', 'earthpower', 'playrough']);
		newMoves('kingler', ['poisonjab', 'earthquake']);
		newMoves('lanturn', ['slackoff', 'calmmind', 'nastyplot']);
		newMoves('lapras', ['scald', 'recover', 'calmmind', 'irondefense']);
		newMoves('leafeon', ['highhorsepower', 'earthpower', 'playrough']);
		newMoves('ludicolo', ['teleport', 'rapidspin', 'strengthsap']);
		newMoves('musharna', ['boomburst', 'teleport', 'slackoff']);
		newMoves('orbeetle', ['triattack', 'rapidspin', 'fakeout', 'hypervoice', 'spikes', 'explosion']);
		newMoves('pincurchin', ['voltswitch', 'spikyshield', 'paraboliccharge']);
		newMoves('rapidash', ['superpower']);
		newMoves('rapidashgalar', ['uturn', 'knockoff', 'blazekick']);
		newMoves('skuntank', ['slackoff', 'toxicspikes', 'earthquake']);
		newMoves('sylveon', ['highhorsepower', 'earthpower']);
		newMoves('toxicroak', ['highjumpkick']);
		newMoves('umbreon', ['highhorsepower', 'earthpower', 'playrough']);
		newMoves('vaporeon', ['highhorsepower', 'earthpower', 'playrough']);
		newMoves('vespiquen', ['suckerpunch', 'stickyweb', 'earthquake']);
	},
};
