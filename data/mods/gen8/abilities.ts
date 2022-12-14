export const Abilities: {[k: string]: ModdedAbilityData} = {
	battlebond: {
		inherit: true,
		onSourceAfterFaint(length, target, source, effect) {
			if (effect?.effectType !== 'Move') {
				return;
			}
			if (source.species.id === 'greninja' && source.hp && !source.transformed && source.side.foePokemonLeft()) {
				this.add('-activate', source, 'ability: Battle Bond');
				source.formeChange('Greninja-Ash', this.effect, true);
			}
		},
		onModifyMovePriority: -1,
		onModifyMove(move, attacker) {
			if (move.id === 'watershuriken' && attacker.species.name === 'Greninja-Ash' &&
				!attacker.transformed) {
				move.multihit = 3;
			}
		},
	},
	dauntlessshield: {
		inherit: true,
		onStart(pokemon) {
			this.boost({def: 1}, pokemon);
		},
	},
	intrepidsword: {
		inherit: true,
		onStart(pokemon) {
			this.boost({atk: 1}, pokemon);
		},
	},
	libero: {
		inherit: true,
		onPrepareHit(source, target, move) {
			if (move.hasBounced || move.isFutureMove || move.sourceEffect === 'snatch') return;
			const type = move.type;
			if (type && type !== '???' && source.getTypes().join() !== type) {
				if (!source.setType(type)) return;
				this.add('-start', source, 'typechange', type, '[from] ability: Libero');
			}
		},
		onSwitchIn() {},
	},
	protean: {
		inherit: true,
		onPrepareHit(source, target, move) {
			if (move.hasBounced || move.isFutureMove || move.sourceEffect === 'snatch') return;
			const type = move.type;
			if (type && type !== '???' && source.getTypes().join() !== type) {
				if (!source.setType(type)) return;
				this.add('-start', source, 'typechange', type, '[from] ability: Protean');
			}
		},
		onSwitchIn() {},
	},
	snowwarning: {
		inherit: true,
		onStart(source) {
			this.field.setWeather('hail');
		},
	},
};
