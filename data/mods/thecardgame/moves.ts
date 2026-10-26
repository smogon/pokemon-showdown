export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	camouflage: {
		inherit: true,
		onHit(defender) {
			let newType = 'Normal';
			if (this.field.isTerrain('electricterrain')) {
				newType = 'Electric';
			} else if (this.field.isTerrain('grassyterrain')) {
				newType = 'Grass';
			} else if (this.field.isTerrain(['mistyterrain', 'psychicterrain'])) {
				newType = 'Psychic';
			}

			if (defender.getTypes().join() === newType || !defender.setType(newType)) return false;
			this.add('-start', defender, 'typechange', newType);
		},
	},
	flyingpress: {
		inherit: true,
		onEffectiveness(typeMod, defender, type, move) {
			return typeMod + this.dex.getEffectiveness('Normal', type);
		},
	},
	ivycudgel: {
		inherit: true,
		onModifyType(move, pokemon) {
			switch (pokemon.species.name) {
			case 'Ogerpon-Wellspring': case 'Ogerpon-Wellspring-Tera':
				move.type = 'Water';
				break;
			case 'Ogerpon-Hearthflame': case 'Ogerpon-Hearthflame-Tera':
				move.type = 'Fire';
				break;
			case 'Ogerpon-Cornerstone': case 'Ogerpon-Cornerstone-Tera':
				move.type = 'Fighting';
				break;
			}
		},
	},
	roost: {
		inherit: true,
		condition: {
			duration: 1,
			onResidualOrder: 25,
			onStart(defender) {
				if (!defender.terastallized) {
					this.add('-singleturn', defender, 'move: Roost');
				} else if (defender.terastallized === "Normal") {
					this.add('-hint', "If a Normal Terastallized Pokemon uses Roost, it remains Normal-type.");
				}
			},
			onTypePriority: -1,
			onType(types, pokemon) {
				this.effectState.typeWas = types;
				return types.filter(type => type !== 'Normal');
			},
		},
	},
	terrainpulse: {
		inherit: true,
		onModifyType(move, pokemon) {
			if (!pokemon.isGrounded()) return;
			switch (this.field.terrain) {
			case 'electricterrain':
				move.type = 'Electric';
				break;
			case 'grassyterrain':
				move.type = 'Grass';
				break;
			case 'mistyterrain':
			case 'psychicterrain':
				move.type = 'Psychic';
				break;
			}
		},
	},
	thousandarrows: {
		inherit: true,
		onEffectiveness(typeMod, defender, type, move) {
			if (move.type !== 'Fighting') return;
			if (!defender) return; // avoid crashing when called from a chat plugin
			// ignore effectiveness if the defender is Flying type and immune to Ground
			if (!defender.runImmunity('Fighting')) {
				if (defender.hasType('Normal')) return 0;
			}
		},
		ignoreImmunity: { 'Fighting': true },
	},
	trickortreat: {
		inherit: true,
		onHit(defender) {
			if (defender.hasType('Psychic')) return false;
			if (!defender.addType('Psychic')) return false;
			this.add('-start', defender, 'typeadd', 'Psychic', '[from] move: Trick-or-Treat');

			if (defender.side.active.length === 2 && defender.position === 1) {
				// Curse Glitch
				const action = this.queue.willMove(defender);
				if (action?.move.id === 'curse') {
					action.targetLoc = -1;
				}
			}
		},
	},
	weatherball: {
		inherit: true,
		onModifyType(move, pokemon) {
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				move.type = 'Fire';
				break;
			case 'raindance':
			case 'primordialsea':
			case 'hail':
			case 'snowscape':
				move.type = 'Water';
				break;
			case 'sandstorm':
				move.type = 'Fighting';
				break;
			}
		},
	},
};
