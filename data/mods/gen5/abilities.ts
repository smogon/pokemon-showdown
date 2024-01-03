export const Abilities: {[k: string]: ModdedAbilityData} = {
	anticipation: {
		inherit: true,
		onStart(pokemon) {
			for (const target of pokemon.foes()) {
				for (const moveSlot of target.moveSlots) {
					const move = this.dex.moves.get(moveSlot.move);
					if (move.category !== 'Status' && (
						this.dex.getImmunity(move.type, pokemon) && this.dex.getEffectiveness(move.type, pokemon) > 0 ||
						move.ohko
					)) {
						this.add('-ability', pokemon, 'Anticipation');
						return;
					}
				}
			}
		},
	},
	frisk: {
		inherit: true,
		onStart(pokemon) {
			const target = pokemon.side.randomFoe();
			if (target?.item) {
				this.add('-item', target, target.getItem().name, '[from] ability: Frisk', '[of] ' + pokemon);
			}
		},
	},
	infiltrator: {
		inherit: true,
		rating: 1.5,
	},
	keeneye: {
		inherit: true,
		onModifyMove() {},
	},
	oblivious: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.volatiles['attract']) {
				pokemon.removeVolatile('attract');
				this.add('-end', pokemon, 'move: Attract', '[from] ability: Oblivious');
			}
		},
		onTryHit(pokemon, target, move) {
			if (move.id === 'captivate') {
				this.add('-immune', pokemon, '[from] Oblivious');
				return null;
			}
		},
		rating: 0.5,
	},
	overcoat: {
		inherit: true,
		onTryHit() {},
		flags: {},
		rating: 0.5,
	},
	sapsipper: {
		inherit: true,
		onAllyTryHitSide() {},
	},
	serenegrace: {
		inherit: true,
		onModifyMove(move) {
			if (move.secondaries && move.id !== 'secretpower') {
				this.debug('doubling secondary chance');
				for (const secondary of move.secondaries) {
					if (secondary.chance) secondary.chance *= 2;
				}
			}
		},
	},
	soundproof: {
		inherit: true,
		onAllyTryHitSide() {},
	},
};
