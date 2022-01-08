export const Scripts: ModdedBattleScriptsData = {
	init() {
		for (const i in this.data.Moves) {
			if (!(this.data.Moves[i].isNonstandard && this.data.Moves[i].isNonstandard === 'Past') ||
				this.data.Moves[i].isZ) continue;
			this.modData('Moves', i).isNonstandard = undefined;
		}
	},
	// included for Aura Break
	pokemon: {
		ignoringAbility() {
			// Check if any active pokemon have the ability Neutralizing Gas
			let neutralizinggas = false;
			let aurabreak = false;
			const aurabreakAbilities = ["adaptability", "aerilate", "analytic", "darkaura", "flareboost", "fairyaura", "galvanize",
				"guts", "hustle", "ironfist", "packleader", "pixilate", "poisontouch", "punkrock", "refrigerate", "sandforce", "shadowworld",
				"sheerforce", "solarpower", "steelworker", "strongjaw", "technician", "toughclaws", "transistor", "waterbubble", "watercycle"];
			for (const pokemon of this.battle.getAllActive()) {
				// can't use hasAbility because it would lead to infinite recursion
				if (pokemon.ability === ('neutralizinggas' as ID) && !pokemon.volatiles['gastroacid'] &&
					!pokemon.transformed && !pokemon.abilityState.ending) {
					neutralizinggas = true;
					break;
				}
				if (pokemon.ability === ('aurabreak' as ID) && !pokemon.volatiles['gastroacid'] &&
					!pokemon.transformed) {
					aurabreak = true;
				}
			}

			return !!(
				(this.battle.gen >= 5 && !this.isActive) ||
				((this.volatiles['gastroacid'] || (neutralizinggas && this.ability !== ('neutralizinggas' as ID)) ||
					(aurabreak && aurabreakAbilities.includes(this.ability))) &&
				!this.getAbility().isPermanent
				)
			);
		},
	},
};
