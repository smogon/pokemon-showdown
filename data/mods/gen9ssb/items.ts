export const Items: {[k: string]: ModdedItemData} = {
	// Lord of Extinction
	blacklotus: {
		name: "Black Lotus",
		spritenum: 158,
		onTakeItem: false,
		desc: "HP >= 33%: All of holder's stats are x1.33. Cannot be taken or removed.",
		gen: 9,
		onModifyAtkPriority: 1,
		onModifyAtk(atk, pokemon) {
			if (pokemon.hp >= (pokemon.hp / 3)) {
				return this.chainModify(1.33);
			}
		},
		onModifySpaPriority: 1,
		onModifySpa(spa, pokemon) {
			if (pokemon.hp >= (pokemon.hp / 3)) {
				return this.chainModify(1.33);
			}
		},
		onModifyDefPriority: 1,
		onModifyDef(def, pokemon) {
			if (pokemon.hp >= (pokemon.hp / 3)) {
				return this.chainModify(1.33);
			}
		},
		onModifySpdPriority: 1,
		onModifySpd(spd, pokemon) {
			if (pokemon.hp >= (pokemon.hp / 3)) {
				return this.chainModify(1.33);
			}
		},
		onModifySpePriority: 1,
		onModifySpe(spe, pokemon) {
			if (pokemon.hp >= (pokemon.hp / 3)) {
				return this.chainModify(1.33);
			}
		},
		onSourceModifyAccuracyPriority: 1,
		onSourceModifyAccuracy(accuracy, source) {
			if (typeof accuracy !== 'number') return;
			if (source.hp >= (source.hp / 3)) {
				return this.chainModify([5448, 4096]);
			}
		},
		onModifyAccuracyPriority: -1,
		onModifyAccuracy(accuracy, source) {
			if (typeof accuracy !== 'number') return;
			if (source.hp >= (source.hp / 3)) {
				return this.chainModify([3072, 4096]);
			}
		},
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
