export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	angershell: {
		inherit: true,
		onDamage(damage, target, source, effect) {
			this.effectState.checkedAngerShell = !(effect.effectType === "Move" && !effect.multihit);
		},
	},
	berserk: {
		inherit: true,
		onDamage(damage, target, source, effect) {
			this.effectState.checkedBerserk = !(effect.effectType === "Move" && !effect.multihit);
		},
	},
	dragonize: {
		inherit: true,
		isNonstandard: null,
	},
	eelevate: {
		inherit: true,
		isNonstandard: null,
	},
	firemane: {
		inherit: true,
		isNonstandard: null,
	},
	healer: {
		inherit: true,
		onResidual(pokemon) {
			for (const allyActive of pokemon.adjacentAllies()) {
				if (allyActive.status && this.randomChance(1, 2)) {
					this.add('-activate', pokemon, 'ability: Healer');
					allyActive.cureStatus();
				}
			}
		},
	},
	megasol: {
		inherit: true,
		isNonstandard: null,
	},
	naturalcure: {
		inherit: true,
		onCheckShow: undefined, // no inherit
		onSwitchOut(pokemon) {
			if (!pokemon.status || pokemon.status === 'fnt') return;

			this.add('-curestatus', pokemon, pokemon.status, '[from] ability: Natural Cure', '[silent]');
			pokemon.clearStatus();
		},
	},
	piercingdrill: {
		inherit: true,
		isNonstandard: null,
	},
	regenerator: {
		inherit: true,
		onSwitchOut(pokemon) {
			if (pokemon.heal(pokemon.baseMaxhp / 3)) {
				this.add('-heal', pokemon, pokemon.getHealth, '[from] ability: Regenerator', '[silent]');
			}
		},
	},
	runaway: {
		inherit: true,
		onTrapPokemonPriority: -10,
		onTrapPokemon(pokemon) {
			pokemon.trapped = false;
		},
		onMaybeTrapPokemonPriority: -10,
		onMaybeTrapPokemon(pokemon) {
			pokemon.maybeTrapped = false;
		},
	},
	spicyspray: {
		inherit: true,
		isNonstandard: null,
	},
	unseenfist: {
		inherit: true,
		onModifyMove: undefined, // no inherit
		onHitProtect(source, target, move) {
			if (move.flags['contact']) {
				target.getMoveHitData(move).bypassProtect = this.effect;
				return false;
			}
		},
	},
};
