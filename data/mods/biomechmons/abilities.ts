export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	magician: {
		inherit: true,
		onAfterMoveSecondarySelf(attacker, defender, move) {
			if (!move || attacker.switchFlag === true || !move.hitTargets || attacker.item || attacker.volatiles['gem'] ||
				move.id === 'fling' || move.category === 'Status') return;
			const hitTargets = move.hitTargets;
			this.speedSort(hitTargets);
			for (const pokemon of hitTargets) {
				if (pokemon !== attacker) {
					const yourItem = pokemon.takeItem(attacker);
					if (!yourItem) continue;
					if (!attacker.setItem(yourItem)) {
						if (!this.dex.items.get(yourItem.id).exists) {
							pokemon.setItem(yourItem.id);
							continue;
						}
						pokemon.item = yourItem.id; // bypass setItem so we don't break choicelock or anything
						continue;
					}
					this.add('-item', attacker, yourItem, '[from] ability: Magician', `[of] ${pokemon}`);
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
			for (const defender of this.getAllActive()) {
				if (defender.hasItem('Ability Shield')) {
					this.add('-block', defender, 'item: Ability Shield');
					continue;
				}
				// Can't suppress a Tatsugiri inside of Dondozo already
				if (defender.volatiles['commanding']) {
					continue;
				}
				if (defender.illusion) {
					this.singleEvent('End', this.dex.abilities.get('Illusion'), defender.abilityState, defender, pokemon, 'neutralizinggas');
				}
				if (defender.volatiles['slowstart']) {
					delete defender.volatiles['slowstart'];
					this.add('-end', defender, 'Slow Start', '[silent]');
				}
				if (strongWeathers.includes(defender.getAbility().id)) {
					this.singleEvent('End', this.dex.abilities.get(defender.getAbility().id), defender.abilityState, defender, pokemon, 'neutralizinggas');
				}
				if (!this.dex.abilities.get(defender.ability).exists) {
					const isItem = (defender.m.scrambled.items as { inSlot: string }[]).findIndex(e => e.inSlot === 'Ability');
					if (isItem >= 0) {
						defender.removeVolatile('item:' + this.toID(defender.m.scrambled.items[isItem].thing));
					} else if ((defender.m.scrambled.moves as { inSlot: string }[]).findIndex(e => e.inSlot === 'Ability') >= 0) {
						const isMove = (defender.m.scrambled.moves as { inSlot: string }[]).findIndex(e => e.inSlot === 'Ability');
						const indexOfMove = defender.moveSlots.findIndex(m => this.toID(defender.m.scrambled.moves[isMove].thing) === m.id);
						if (indexOfMove >= 0) defender.moveSlots.splice(indexOfMove, 1);
					}
				}
			}
		},
		onEnd(attacker) {
			if (attacker.transformed) return;
			for (const pokemon of this.getAllActive()) {
				if (pokemon !== attacker && pokemon.hasAbility('Neutralizing Gas')) {
					return;
				}
			}
			this.add('-end', attacker, 'ability: Neutralizing Gas');

			// FIXME this happens before the pokemon switches out, should be the opposite order.
			// Not an easy fix since we cant use a supported event. Would need some kind of special event that
			// gathers events to run after the switch and then runs them when the ability is no longer accessible.
			// (If you're tackling this, do note extreme weathers have the same issue)

			// Mark this pokemon's ability as ending so Pokemon#ignoringAbility skips it
			if (attacker.abilityState.ending) return;
			attacker.abilityState.ending = true;
			const sortedActive = this.getAllActive();
			this.speedSort(sortedActive);
			for (const pokemon of sortedActive) {
				if (pokemon !== attacker) {
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
		onAfterMoveSecondary(defender, attacker, move) {
			if (attacker && attacker !== defender && move?.flags['contact']) {
				if (defender.item || defender.switchFlag || defender.forceSwitchFlag || attacker.switchFlag === true) {
					return;
				}
				const yourItem = attacker.takeItem(defender);
				if (!yourItem) {
					return;
				}
				if (!defender.setItem(yourItem)) {
					if (!this.dex.items.get(yourItem.id).exists) {
						defender.setItem(yourItem.id);
						return;
					}
					attacker.item = yourItem.id;
					return;
				}
				this.add('-enditem', attacker, yourItem, '[silent]', '[from] ability: Pickpocket', `[of] ${attacker}`);
				this.add('-item', defender, yourItem, '[from] ability: Pickpocket', `[of] ${attacker}`);
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
				defender => !defender.getAbility().flags['notrace'] && defender.ability !== 'noability'
			);
			if (!possibleTargets.length) return;

			const defender = this.sample(possibleTargets);
			const ability = defender.getAbility();
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
						const ppUps = move.noPPBoosts ? 0 : 3;
						const basePP = this.calculatePP(move, ppUps);
						const newMove = {
							move: move.name,
							id: move.id,
							pp: basePP,
							maxpp: basePP,
							defender: move.defender,
							disabled: false,
							used: false,
						};
						pokemon.baseMoveSlots.push(newMove);
						pokemon.moveSlots.push(newMove);
						pokemon.ppUps.push(ppUps);
					}
				}
				return;
			}
			pokemon.setAbility(ability, defender);
		},
	},
};
