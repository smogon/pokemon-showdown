export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	flashfire: {
		inherit: true,
		onEnd(pokemon) {
			pokemon.removeVolatile('flashfire');
		},
		condition: {
			onModifyAtk(atk, attacker, defender, move) {
				if (move.type === 'Fire' && attacker.hasAbility('flashfire')) {
					this.debug('Flash Fire boost');
					return this.chainModify(1.5);
				}
			},
			onModifySpA(atk, attacker, defender, move) {
				if (move.type === 'Fire' && attacker.hasAbility('flashfire')) {
					this.debug('Flash Fire boost');
					return this.chainModify(1.5);
				}
			},
		},
	},
	stalwart: {
		inherit: true,
		onModifyMove(move) {
			// most of the implementation is in Battle#getTarget
			move.tracksTarget = move.target !== 'scripted';
		},
	},
};
