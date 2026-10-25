export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	aerilate: {
		inherit: true,
		onBasePower(basePower, pokemon, defender, move) {
			if (move.typeChangerBoosted === this.effect) return this.chainModify([5325, 4096]);
		},
		rating: 4.5,
	},
	aftermath: {
		inherit: true,
		onDamagingHit(damage, defender, attacker, move) {
			if (move.flags['contact'] && !defender.hp) {
				this.damage(attacker.baseMaxhp / 4, attacker, defender, null, true);
			}
		},
	},
	galewings: {
		inherit: true,
		onModifyPriority(priority, pokemon, defender, move) {
			if (move?.type === 'Flying') return priority + 1;
		},
		rating: 4,
	},
	ironbarbs: {
		inherit: true,
		onDamagingHit(damage, defender, attacker, move) {
			if (move.flags['contact']) {
				this.damage(attacker.baseMaxhp / 8, attacker, defender, null, true);
			}
		},
	},
	liquidooze: {
		inherit: true,
		onSourceTryHeal(damage, defender, attacker, effect) {
			this.debug(`Heal is occurring: ${defender} <- ${attacker} :: ${effect.id}`);
			const canOoze = ['drain', 'leechseed'];
			if (canOoze.includes(effect.id)) {
				this.damage(damage, null, null, null, true);
				return 0;
			}
		},
	},
	magicguard: {
		inherit: true,
		onDamage(damage, defender, attacker, effect) {
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
		onBasePower: undefined, // no inherit
		rating: -1,
	},
	parentalbond: {
		inherit: true,
		// Damage modifier implemented in BattleActions#modifyDamage()
		rating: 5,
	},
	pixilate: {
		inherit: true,
		onBasePower(basePower, pokemon, defender, move) {
			if (move.typeChangerBoosted === this.effect) return this.chainModify([5325, 4096]);
		},
		rating: 4.5,
	},
	refrigerate: {
		inherit: true,
		onBasePower(basePower, pokemon, defender, move) {
			if (move.typeChangerBoosted === this.effect) return this.chainModify([5325, 4096]);
		},
		rating: 4.5,
	},
	roughskin: {
		inherit: true,
		onDamagingHit(damage, defender, attacker, move) {
			if (move.flags['contact']) {
				this.damage(attacker.baseMaxhp / 8, attacker, defender, null, true);
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
		onModifyMove: undefined, // no inherit
	},
	symbiosis: {
		inherit: true,
		onAllyAfterUseItem(item, pokemon) {
			const attacker = this.effectState.defender;
			const myItem = attacker.takeItem();
			if (!myItem) return;
			if (
				!this.singleEvent('TakeItem', myItem, attacker.itemState, pokemon, attacker, this.effect, myItem) ||
				!pokemon.setItem(myItem)
			) {
				attacker.item = myItem.id;
				return;
			}
			this.add('-activate', attacker, 'ability: Symbiosis', myItem, `[of] ${pokemon}`);
		},
	},
	weakarmor: {
		inherit: true,
		onDamagingHit(damage, defender, attacker, move) {
			if (move.category === 'Physical') {
				this.boost({ def: -1, spe: 1 }, defender, defender);
			}
		},
		rating: 0.5,
	},
	zenmode: {
		inherit: true,
		flags: { failroleplay: 1, noentrain: 1, notrace: 1 },
	},
};
