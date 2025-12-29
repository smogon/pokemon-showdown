export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	// Remember, everything deals with SLOTS not with properties as they are!
	gastroacid: {
		inherit: true,
		condition: {
			// Ability suppression implemented in Pokemon.ignoringAbility() within sim/pokemon.js
			onStart(pokemon) {
				this.add('-endability', pokemon);
				this.singleEvent('End', pokemon.getAbility(), pokemon.abilityState, pokemon, pokemon, 'gastroacid');
				const keys = Object.keys(pokemon.volatiles).filter(x => x.startsWith("ability:"));
				if (keys.length) {
					for (const abil of keys) {
						pokemon.removeVolatile(abil);
					}
				}
			},
		},
	},
	skillswap: {
		inherit: true,
		onHit(target, source, move) {
			const targetAbility = target.getAbility();
			const sourceAbility = source.getAbility();
			const sourceIsBMM = this.dex.abilities.get(sourceAbility).exists;
			const targetIsBMM = this.dex.abilities.get(targetAbility).exists;
			if (target.isAlly(source)) {
				this.add('-activate', source, 'move: Skill Swap', '', '', `[of] ${target}`);
			} else {
				this.add('-activate', source, 'move: Skill Swap', targetAbility, sourceAbility, `[of] ${target}`);
			}
			this.singleEvent('End', sourceAbility, source.abilityState, source);
			if (sourceIsBMM) {
				const isItem = (source.m.scrambled.items as { inSlot: string }[]).findIndex(e => e.inSlot === 'Ability');
				if (isItem >= 0) {
					source.removeVolatile('item:' + this.toID(source.m.scrambled.items[isItem].thing));
					source.m.scrambled.items.splice(isItem, 1);
				} else if ((source.m.scrambled.moves as { inSlot: string }[]).findIndex(e => e.inSlot === 'Ability') >= 0) {
					const isMove = (source.m.scrambled.moves as { inSlot: string }[]).findIndex(e => e.inSlot === 'Ability');
					source.baseMoveSlots.splice(
						source.baseMoveSlots.findIndex(m => this.toID(source.m.scrambled.moves[isMove].thing) === m.id), 1);
					// this.moveSlots.splice(this.moveSlots.findIndex(m => this.battle.toID(this.m.scrambled.items[isMove].thing) === m.id), 1);
					source.m.scrambled.moves.splice(isMove, 1);
				}
			}
			this.singleEvent('End', targetAbility, target.abilityState, target);
			if (targetIsBMM) {
				const isItem = (target.m.scrambled.items as { inSlot: string }[]).findIndex(e => e.inSlot === 'Ability');
				if (isItem >= 0) {
					target.removeVolatile('item:' + this.toID(target.m.scrambled.items[isItem].thing));
					target.m.scrambled.items.splice(isItem, 1);
				} else if ((target.m.scrambled.moves as { inSlot: string }[]).findIndex(e => e.inSlot === 'Ability') >= 0) {
					const isMove = (target.m.scrambled.moves as { inSlot: string }[]).findIndex(e => e.inSlot === 'Ability');
					target.baseMoveSlots.splice(
						target.baseMoveSlots.findIndex(m => this.toID(target.m.scrambled.moves[isMove].thing) === m.id), 1);
					// this.moveSlots.splice(this.moveSlots.findIndex(m => this.battle.toID(this.m.scrambled.items[isMove].thing) === m.id), 1);
					target.m.scrambled.moves.splice(isMove, 1);
				}
			}

			source.ability = source.baseAbility = targetAbility.id;
			target.ability = target.baseAbility = sourceAbility.id;
			source.abilityState = this.initEffectState({ id: this.toID(source.ability), target: source });
			target.abilityState = this.initEffectState({ id: this.toID(target.ability), target });
			
			source.volatileStaleness = undefined;
			if (!target.isAlly(source)) target.volatileStaleness = 'external';
			
			this.singleEvent('Start', targetAbility, source.abilityState, source);
			if (targetIsBMM) {
				if (this.dex.items.get(targetAbility.id).exists) {
					source.m.scrambled.items.push({ thing: targetAbility.id, inSlot: 'Ability' });
					const effect = 'item:' + this.toID(targetAbility.id);
					source.addVolatile(effect);
					source.volatiles[effect].inSlot = 'Ability';
				} else {
					source.m.scrambled.moves.push({ thing: targetAbility.id, inSlot: 'Ability' });
					const move = Dex.moves.get(targetAbility.id);
					const newMove = {
						move: move.name,
						id: move.id,
						pp: move.noPPBoosts ? move.pp : move.pp * 8 / 5,
						maxpp: move.noPPBoosts ? move.pp : move.pp * 8 / 5,
						target: move.target,
						disabled: false,
						used: false,
					};
					source.baseMoveSlots.push(newMove);
				}
			}
			this.singleEvent('Start', sourceAbility, target.abilityState, target);
			if (sourceIsBMM) {
				if (this.dex.items.get(targetAbility.id).exists) {
					target.m.scrambled.items.push({ thing: targetAbility.id, inSlot: 'Ability' });
					const effect = 'item:' + this.toID(targetAbility.id);
					target.addVolatile(effect);
					target.volatiles[effect].inSlot = 'Ability';
				} else {
					target.m.scrambled.moves.push({ thing: targetAbility.id, inSlot: 'Ability' });
					const move = Dex.moves.get(targetAbility.id);
					const newMove = {
						move: move.name,
						id: move.id,
						pp: move.noPPBoosts ? move.pp : move.pp * 8 / 5,
						maxpp: move.noPPBoosts ? move.pp : move.pp * 8 / 5,
						target: move.target,
						disabled: false,
						used: false,
					};
					target.baseMoveSlots.push(newMove);
				}
			}
		},
	},
};
