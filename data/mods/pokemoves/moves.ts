export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	conversion: {
		inherit: true,
		onHit(target) {
			const moveSlotID = target.moveSlots[0].id;
			let type = this.dex.moves.get(moveSlotID).type;
			if (this.dex.species.get(moveSlotID).exists) {
				type = this.dex.species.get(moveSlotID).types[0];
			}
			if (target.hasType(type) || !target.setType(type)) return false;
			this.add('-start', target, 'typechange', type);
		},
	},
	gastroacid: {
		inherit: true,
		condition: {
			// Ability suppression implemented in Pokemon.ignoringAbility() within sim/pokemon.js
			onStart(pokemon) {
				this.add('-endability', pokemon);
				this.singleEvent('End', pokemon.getAbility(), pokemon.abilityState, pokemon, pokemon, 'gastroacid');
				const keys = Object.keys(pokemon.volatiles).filter(x => x.startsWith("ability:"));
				if (keys.length) {
					for (const abil of keys) {
						pokemon.removeVolatile(abil);
					}
				}
			},
		},
	},
};
