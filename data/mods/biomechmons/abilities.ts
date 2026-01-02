export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	magician: {
		inherit: true,
		onAfterMoveSecondarySelf(source, target, move) {
			if (!move || source.switchFlag === true || !move.hitTargets || source.item || source.volatiles['gem'] ||
				move.id === 'fling' || move.category === 'Status') return;
			const hitTargets = move.hitTargets;
			this.speedSort(hitTargets);
			for (const pokemon of hitTargets) {
				if (pokemon !== source) {
					const yourItem = pokemon.takeItem(source);
					if (!yourItem) continue;
					if (!source.setItem(yourItem)) {
						if (!this.dex.items.get(yourItem.id).exists) {
							pokemon.setItem(yourItem.id);
							continue;
						}
						pokemon.item = yourItem.id; // bypass setItem so we don't break choicelock or anything
						continue;
					}
					this.add('-item', source, yourItem, '[from] ability: Magician', `[of] ${pokemon}`);
					return;
				}
			}
		},
	},
	neutralizinggas: {
		inherit: true,
		onSwitchIn(pokemon) {
			this.add('-ability', pokemon, 'Neutralizing Gas');
			pokemon.abilityState.ending = false;
			const strongWeathers = ['desolateland', 'primordialsea', 'deltastream'];
			for (const target of this.getAllActive()) {
				if (target.hasItem('Ability Shield')) {
					this.add('-block', target, 'item: Ability Shield');
					continue;
				}
				// Can't suppress a Tatsugiri inside of Dondozo already
				if (target.volatiles['commanding']) {
					continue;
				}
				if (target.illusion) {
					this.singleEvent('End', this.dex.abilities.get('Illusion'), target.abilityState, target, pokemon, 'neutralizinggas');
				}
				if (target.volatiles['slowstart']) {
					delete target.volatiles['slowstart'];
					this.add('-end', target, 'Slow Start', '[silent]');
				}
				if (strongWeathers.includes(target.getAbility().id)) {
					this.singleEvent('End', this.dex.abilities.get(target.getAbility().id), target.abilityState, target, pokemon, 'neutralizinggas');
				}
				if (!this.dex.abilities.get(target.ability).exists) {
					const isItem = (target.m.scrambled.items as { inSlot: string }[]).findIndex(e => e.inSlot === 'Ability');
					if (isItem >= 0) {
						target.removeVolatile('item:' + this.toID(target.m.scrambled.items[isItem].thing));
					} else if ((target.m.scrambled.moves as { inSlot: string }[]).findIndex(e => e.inSlot === 'Ability') >= 0) {
						const isMove = (target.m.scrambled.moves as { inSlot: string }[]).findIndex(e => e.inSlot === 'Ability');
						const indexOfMove = target.moveSlots.findIndex(m => this.toID(target.m.scrambled.moves[isMove].thing) === m.id);
						if (indexOfMove >= 0) target.moveSlots.splice(indexOfMove, 1);
					}
				}
			}
		},
		onEnd(source) {
			if (source.transformed) return;
			for (const pokemon of this.getAllActive()) {
				if (pokemon !== source && pokemon.hasAbility('Neutralizing Gas')) {
					return;
				}
			}
			this.add('-end', source, 'ability: Neutralizing Gas');

			// FIXME this happens before the pokemon switches out, should be the opposite order.
			// Not an easy fix since we cant use a supported event. Would need some kind of special event that
			// gathers events to run after the switch and then runs them when the ability is no longer accessible.
			// (If you're tackling this, do note extreme weathers have the same issue)

			// Mark this pokemon's ability as ending so Pokemon#ignoringAbility skips it
			if (source.abilityState.ending) return;
			source.abilityState.ending = true;
			const sortedActive = this.getAllActive();
			this.speedSort(sortedActive);
			for (const pokemon of sortedActive) {
				if (pokemon !== source) {
					if (pokemon.getAbility().flags['cantsuppress']) continue; // does not interact with e.g Ice Face, Zen Mode
					if (pokemon.hasItem('abilityshield')) continue; // don't restart abilities that weren't suppressed

					// Will be suppressed by Pokemon#ignoringAbility if needed
					this.singleEvent('Start', pokemon.getAbility(), pokemon.abilityState, pokemon);
					if (pokemon.ability === "gluttony") {
						pokemon.abilityState.gluttony = false;
					}
				}
				if (!this.dex.abilities.get(pokemon.ability).exists) {
					const isItem = (pokemon.m.scrambled.items as { inSlot: string }[]).findIndex(e => e.inSlot === 'Ability');
					if (isItem >= 0) {
						pokemon.addVolatile('item:' + this.toID(pokemon.m.scrambled.items[isItem].thing));
					} else if ((pokemon.m.scrambled.moves as { inSlot: string }[]).findIndex(e => e.inSlot === 'Ability') >= 0) {
						const findMove = (pokemon.m.scrambled.moves as { inSlot: string }[]).findIndex(e => e.inSlot === 'Ability');
						const findSlot = pokemon.baseMoveSlots.find(e => e.id === this.toID(pokemon.m.scrambled.moves[findMove].thing));
						pokemon.moveSlots.push(this.dex.deepClone(findSlot));
					}
				}
			}
		},
	},
	pickpocket: {
		inherit: true,
		onAfterMoveSecondary(target, source, move) {
			if (source && source !== target && move?.flags['contact']) {
				if (target.item || target.switchFlag || target.forceSwitchFlag || source.switchFlag === true) {
					return;
				}
				const yourItem = source.takeItem(target);
				if (!yourItem) {
					return;
				}
				if (!target.setItem(yourItem)) {
					if (!this.dex.items.get(yourItem.id).exists) {
						target.setItem(yourItem.id);
						return;
					}
					source.item = yourItem.id;
					return;
				}
				this.add('-enditem', source, yourItem, '[silent]', '[from] ability: Pickpocket', `[of] ${source}`);
				this.add('-item', target, yourItem, '[from] ability: Pickpocket', `[of] ${source}`);
			}
		},
	},
	trace: {
		inherit: true,
		onStart(pokemon) {
			this.effectState.seek = true;
			// n.b. only affects Hackmons
			// interaction with No Ability is complicated: https://www.smogon.com/forums/threads/pokemon-sun-moon-battle-mechanics-research.3586701/page-76#post-7790209
			if (pokemon.adjacentFoes().some(foeActive => foeActive.ability === 'noability')) {
				this.effectState.seek = false;
			}
			// interaction with Ability Shield is similar to No Ability
			if (pokemon.hasItem('Ability Shield') && this.toID(pokemon.ability) === 'trace') {
				this.add('-block', pokemon, 'item: Ability Shield');
				this.effectState.seek = false;
			}
			if (this.effectState.seek) {
				this.singleEvent('Update', this.effect, this.effectState, pokemon);
			}
		},
		onUpdate(pokemon) {
			if (!this.effectState.seek) return;

			const possibleTargets = pokemon.adjacentFoes().filter(
				target => !target.getAbility().flags['notrace'] && target.ability !== 'noability'
			);
			if (!possibleTargets.length) return;

			const target = this.sample(possibleTargets);
			const ability = target.getAbility();
			if (this.toID(pokemon.item) === 'trace') {
				this.add('-ability', pokemon, ability.name, 'Trace');
				pokemon.setItem(ability.name);
				return;
			} else if (pokemon.volatiles['ability:trace']?.inSlot === 'Move') {
				if (this.dex.abilities.get(ability.name).exists) {
					pokemon.removeVolatile('ability:trace');
					pokemon.m.scrambled.abilities.splice(
						(pokemon.m.scrambled.abilities as { thing: string, inSlot: string }[]).findIndex(e =>
							this.toID(e.thing) === 'trace' && e.inSlot === 'Move'), 1);
					this.add('-ability', pokemon, ability.name, 'Trace');
					pokemon.addVolatile(`ability:${ability.id}`);
					pokemon.m.scrambled.abilities.push({ thing: ability.name, inSlot: 'Move' });
				} else if (this.dex.items.get(ability.name).exists) {
					pokemon.removeVolatile('ability:trace');
					pokemon.m.scrambled.abilities.splice(
						(pokemon.m.scrambled.abilities as { thing: string, inSlot: string }[]).findIndex(e =>
							this.toID(e.thing) === 'trace' && e.inSlot === 'Move'), 1);
					this.add('-ability', pokemon, ability.name, 'Trace');
					pokemon.addVolatile(`item:${ability.id}`);
					pokemon.m.scrambled.items.push({ thing: this.dex.items.get(ability.name).name, inSlot: 'Move' });
				} else {
					const move = this.dex.moves.get(ability.name);
					if (move.exists) {
						pokemon.removeVolatile('ability:trace');
						pokemon.m.scrambled.abilities.splice(
							(pokemon.m.scrambled.abilities as { thing: string, inSlot: string }[]).findIndex(e =>
								this.toID(e.thing) === 'trace' && e.inSlot === 'Move'), 1);
						this.add('-ability', pokemon, move.name, 'Trace');
						const newMove = {
							move: move.name,
							id: move.id,
							pp: move.noPPBoosts ? move.pp : move.pp * 8 / 5,
							maxpp: move.noPPBoosts ? move.pp : move.pp * 8 / 5,
							target: move.target,
							disabled: false,
							used: false,
						};
						pokemon.baseMoveSlots.push(newMove);
						pokemon.moveSlots.push(newMove);
					}
				}
				return;
			}
			pokemon.setAbility(ability, target);
		},
	},
};
