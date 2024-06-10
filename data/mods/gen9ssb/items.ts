export const Items: {[k: string]: ModdedItemData} = {
	// Finger
	mattermirror: {
		name: "Matter Mirror",
		spritenum: 69,
		desc: "This Pokemon's physical attacks become special. Allows use of Fear the Finger.",
		gen: 9,
		onModifyMove(move, pokemon) {
			if (move.category === 'Physical') {
				move.category = 'Special';
			}
		},
		onTakeItem: false,
		zMove: "Fear the Finger",
		zMoveFrom: "Mega Metronome",
		itemUser: ["Reuniclus"],
	},
	// Pablo
	sketchbook: {
		name: "Sketchbook",
		spritenum: 200,
		desc: "On switch-in, this Pokemon copies the stat changes of the opposing Pokemon.",
		gen: 9,
		onStart(target, pokemon) {
			const boosts: SparseBoostsTable = {};
			let i: BoostID;
			for (i in target.boosts) {
				pokemon.boosts[i] = target.boosts[i];
			}
			this.add('-copyboost', pokemon, target, '[from] item: Sketchbook');
		},
	},
};
