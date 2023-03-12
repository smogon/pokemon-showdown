export const Moves: {[k: string]: ModdedMoveData} = {
	camouflage: {
		inherit: true,
		onHit(target) {
			let newType = 'Normal';
			if (this.field.isTerrain('electricterrain')) {
				newType = 'Electric';
			} else if (this.field.isTerrain('grassyterrain')) {
				newType = 'Grass';
			} else if (this.field.isTerrain(['mistyterrain', 'psychicterrain'])) {
				newType = 'Psychic';
			}

			if (target.getTypes().join() === newType || !target.setType(newType)) return false;
			this.add('-start', target, 'typechange', newType);
		},
	},
	flyingpress: {
		inherit: true,
		onEffectiveness(typeMod, target, type, move) {
			return typeMod + this.dex.getEffectiveness('Normal', type);
		},
	},
	roost: {
		inherit: true,
		condition: {
			duration: 1,
			onResidualOrder: 25,
			onStart(target) {
				if (!target.terastallized) {
					this.add('-singleturn', target, 'move: Roost');
				} else if (target.terastallized === "Normal") {
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
		onEffectiveness(typeMod, target, type, move) {
			if (move.type !== 'Fighting') return;
			if (!target) return; // avoid crashing when called from a chat plugin
			// ignore effectiveness if the target is Flying type and immune to Ground
			if (!target.runImmunity('Fighting')) {
				if (target.hasType('Normal')) return 0;
			}
		},
		ignoreImmunity: {'Fighting': true},
	},
	trickortreat: {
		inherit: true,
		onHit(target) {
			if (target.hasType('Psychic')) return false;
			if (!target.addType('Psychic')) return false;
			this.add('-start', target, 'typeadd', 'Psychic', '[from] move: Trick-or-Treat');

			if (target.side.active.length === 2 && target.position === 1) {
				// Curse Glitch
				const action = this.queue.willMove(target);
				if (action && action.move.id === 'curse') {
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
			case 'snow':
				move.type = 'Water';
				break;
			case 'sandstorm':
				move.type = 'Fighting';
				break;
			}
		},
	},
};
