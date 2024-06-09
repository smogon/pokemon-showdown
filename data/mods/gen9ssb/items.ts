export const Items: {[k: string]: ModdedItemData} = {
	// Finger
	mattermirror: {
		name: "Matter Mirror",
		spritenum: 69,
		desc: "This Pokemon's physical attacks become special. Allows use of Fear the Finger.",
		gen: 9,
		onUpdate(pokemon) {
			for (const moveSlot of pokemon.moveSlots) {
				const move = this.dex.moves.get(moveSlot.id);
				if (move.category === 'Physical') {
					pokemon.disableMove(moveSlot.id);
					move.category = 'Special';
				}
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
		onStart(target, source) {
			let i: BoostID;
			for (i in target.boosts) {
				source.boosts[i] = target.boosts[i];
			}
			const volatilesToCopy = ['focusenergy', 'gmaxchistrike', 'laserfocus'];
			for (const volatile of volatilesToCopy) {
				if (target.volatiles[volatile]) {
					source.addVolatile(volatile);
					if (volatile === 'gmaxchistrike') source.volatiles[volatile].layers = target.volatiles[volatile].layers;
				} else {
					source.removeVolatile(volatile);
				}
			}
			this.add('-copyboost', source, target, '[from] item: Sketchbook');
		},
	},
};
