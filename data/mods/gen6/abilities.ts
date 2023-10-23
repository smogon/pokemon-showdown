export const Abilities: {[k: string]: ModdedAbilityData} = {
	aerilate: {
		inherit: true,
		onBasePower(basePower, pokemon, target, move) {
			if (move.typeChangerBoosted === this.effect) return this.chainModify([5325, 4096]);
		},
		rating: 4.5,
	},
	aftermath: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (move.flags['contact'] && !target.hp) {
				this.damage(source.baseMaxhp / 4, source, target, null, true);
			}
		},
	},
	galewings: {
		inherit: true,
		onModifyPriority(priority, pokemon, target, move) {
			if (move && move.type === 'Flying') return priority + 1;
		},
		rating: 4,
	},
	ironbarbs: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (move.flags['contact']) {
				this.damage(source.baseMaxhp / 8, source, target, null, true);
			}
		},
	},
	liquidooze: {
		inherit: true,
		onSourceTryHeal(damage, target, source, effect) {
			this.debug("Heal is occurring: " + target + " <- " + source + " :: " + effect.id);
			const canOoze = ['drain', 'leechseed'];
			if (canOoze.includes(effect.id)) {
				this.damage(damage, null, null, null, true);
				return 0;
			}
		},
	},
	magicguard: {
		inherit: true,
		onDamage(damage, target, source, effect) {
			if (effect.effectType !== 'Move') return false;
		},
	},
	normalize: {
		inherit: true,
		onModifyMovePriority: 1,
		onModifyMove(move) {
			if (move.id !== 'struggle' && this.dex.moves.get(move.id).type !== 'Normal') {
				move.type = 'Normal';
			}
		},
		rating: -1,
	},
	parentalbond: {
		inherit: true,
		// Damage modifier implemented in BattleActions#modifyDamage()
		rating: 5,
	},
	pixilate: {
		inherit: true,
		onBasePower(basePower, pokemon, target, move) {
			if (move.typeChangerBoosted === this.effect) return this.chainModify([5325, 4096]);
		},
		rating: 4.5,
	},
	refrigerate: {
		inherit: true,
		onBasePower(basePower, pokemon, target, move) {
			if (move.typeChangerBoosted === this.effect) return this.chainModify([5325, 4096]);
		},
		rating: 4.5,
	},
	roughskin: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (move.flags['contact']) {
				this.damage(source.baseMaxhp / 8, source, target, null, true);
			}
		},
	},
	stancechange: {
		inherit: true,
		onBeforeMovePriority: 11,
		onBeforeMove(attacker, defender, move) {
			if (attacker.species.baseSpecies !== 'Aegislash' || attacker.transformed) return;
			if (move.category === 'Status' && move.id !== 'kingsshield') return;
			const targetForme = (move.id === 'kingsshield' ? 'Aegislash' : 'Aegislash-Blade');
			if (attacker.species.name !== targetForme) attacker.formeChange(targetForme);
		},
		onModifyMove() {},
	},
	symbiosis: {
		inherit: true,
		onAllyAfterUseItem(item, pokemon) {
			const source = this.effectState.target;
			const myItem = source.takeItem();
			if (!myItem) return;
			if (
				!this.singleEvent('TakeItem', myItem, source.itemState, pokemon, source, this.effect, myItem) ||
				!pokemon.setItem(myItem)
			) {
				source.item = myItem.id;
				return;
			}
			this.add('-activate', source, 'ability: Symbiosis', myItem, '[of] ' + pokemon);
		},
	},
	weakarmor: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (move.category === 'Physical') {
				this.boost({def: -1, spe: 1}, target, target);
			}
		},
		rating: 0.5,
	},
	zenmode: {
		inherit: true,
		isPermanent: false,
	},
};
