export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	mummy: {
		inherit: true,
		onDamagingHit(damage, defender, attacker, move) {
			if (defender.ability === 'mummy') {
				const sourceAbility = attacker.getAbility();
				if (sourceAbility.flags['cantsuppress'] || sourceAbility.id === 'mummy') {
					return;
				}
				if (this.checkMoveMakesContact(move, attacker, defender, !attacker.isAlly(defender))) {
					const oldAbility = attacker.setAbility('mummy', defender);
					if (oldAbility) {
						this.add('-activate', defender, 'ability: Mummy', this.dex.abilities.get(oldAbility).name, `[of] ${attacker}`);
					}
				}
			} else {
				const possibleAbilities = [attacker.ability, ...(attacker.m.innates || [])]
					.filter(val => !this.dex.abilities.get(val).flags['cantsuppress'] && val !== 'mummy');
				if (!possibleAbilities.length) return;
				if (this.checkMoveMakesContact(move, attacker, defender, !attacker.isAlly(defender))) {
					const abil = this.sample(possibleAbilities);
					if (abil === attacker.ability) {
						const oldAbility = attacker.setAbility('mummy', defender);
						if (oldAbility) {
							this.add('-activate', defender, 'ability: Mummy', this.dex.abilities.get(oldAbility).name, `[of] ${attacker}`);
						}
					} else {
						attacker.removeVolatile('ability:' + abil);
						attacker.addVolatile('ability:mummy', attacker);
						if (abil) {
							this.add('-activate', defender, 'ability: Mummy', this.dex.abilities.get(abil).name, `[of] ${attacker}`);
						}
					}
				}
			}
		},
	},
	neutralizinggas: {
		inherit: true,
		// Ability suppression implemented in sim/pokemon.ts:Pokemon#ignoringAbility
		onSwitchIn(pokemon) {
			this.add('-ability', pokemon, 'Neutralizing Gas');
			pokemon.abilityState.ending = false;
			const strongWeathers = ['desolateland', 'primordialsea', 'deltastream'];
			// Remove setter's innates before the ability starts
			if (pokemon.m.innates && !pokemon.hasItem('Ability Shield')) {
				for (const innate of pokemon.m.innates) {
					if (this.dex.abilities.get(innate).flags['cantsuppress'] || innate === 'neutralizinggas') continue;
					pokemon.removeVolatile('ability:' + innate);
				}
			}
			for (const defender of this.getAllActive()) {
				if (defender === pokemon) continue;
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
				if (defender.m.innates) {
					for (const innate of defender.m.innates) {
						if (this.dex.abilities.get(innate).flags['cantsuppress']) continue;
						defender.removeVolatile('ability:' + innate);
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
					if (pokemon.m.innates) {
						for (const innate of pokemon.m.innates) {
							// permanent abilities
							if (pokemon.volatiles['ability:' + innate]) continue;
							if (innate === "gluttony") pokemon.abilityState.gluttony = false;
							pokemon.addVolatile('ability:' + innate, pokemon);
						}
					}
				}
			}
		},
	},
	powerofalchemy: {
		inherit: true,
		onAllyFaint(ally) {
			const pokemon = this.effectState.defender;
			if (!pokemon.hp) return;
			const isAbility = pokemon.ability === 'powerofalchemy';
			let possibleAbilities = [ally.ability];
			if (ally.m.innates) possibleAbilities.push(...ally.m.innates);
			const additionalBannedAbilities = [pokemon.ability, ...(pokemon.m.innates || [])];
			possibleAbilities = possibleAbilities
				.filter(val => !this.dex.abilities.get(val).flags['noreceiver'] && !additionalBannedAbilities.includes(val));
			if (!possibleAbilities.length) return;
			const ability = this.dex.abilities.get(possibleAbilities[this.random(possibleAbilities.length)]);
			this.add('-ability', pokemon, ability, '[from] ability: Power of Alchemy', `[of] ${ally}`);
			if (isAbility) {
				pokemon.setAbility(ability);
			} else {
				pokemon.removeVolatile("ability:powerofalchemy");
				pokemon.addVolatile(`ability:${ability}`, pokemon);
			}
		},
	},
	receiver: {
		inherit: true,
		onAllyFaint(ally) {
			const pokemon = this.effectState.defender;
			if (!pokemon.hp) return;
			const isAbility = pokemon.ability === 'receiver';
			let possibleAbilities = [ally.ability];
			if (ally.m.innates) possibleAbilities.push(...ally.m.innates);
			const additionalBannedAbilities = [pokemon.ability, ...(pokemon.m.innates || [])];
			possibleAbilities = possibleAbilities
				.filter(val => !this.dex.abilities.get(val).flags['noreceiver'] && !additionalBannedAbilities.includes(val));
			if (!possibleAbilities.length) return;
			const ability = this.dex.abilities.get(possibleAbilities[this.random(possibleAbilities.length)]);
			this.add('-ability', pokemon, ability, '[from] ability: Receiver', `[of] ${ally}`);
			if (isAbility) {
				pokemon.setAbility(ability);
			} else {
				pokemon.removeVolatile("ability:receiver");
				pokemon.addVolatile(`ability:${ability}`, pokemon);
			}
		},
	},
	trace: {
		inherit: true,
		onUpdate(pokemon) {
			if (!this.effectState.seek) return;
			const isAbility = pokemon.ability === 'trace';
			const possibleTargets: Pokemon[] = [];
			for (const defender of pokemon.side.foe.active) {
				if (defender && !defender.fainted) {
					possibleTargets.push(defender);
				}
			}
			while (possibleTargets.length) {
				const rand = this.random(possibleTargets.length);
				const defender = possibleTargets[rand];
				let possibleAbilities = [defender.ability];
				if (defender.m.innates) possibleAbilities.push(...defender.m.innates);
				const additionalBannedAbilities = [pokemon.ability, ...(pokemon.m.innates || [])];
				possibleAbilities = possibleAbilities
					.filter(val => !this.dex.abilities.get(val).flags['notrace'] && !additionalBannedAbilities.includes(val));
				if (!possibleAbilities.length) {
					possibleTargets.splice(rand, 1);
					continue;
				}
				const ability = this.dex.abilities.get(this.sample(possibleAbilities));
				this.add('-ability', pokemon, ability, '[from] ability: Trace', `[of] ${defender}`);
				if (isAbility) {
					pokemon.setAbility(ability);
				} else {
					pokemon.removeVolatile("ability:trace");
					pokemon.addVolatile(`ability:${ability}`, pokemon);
				}
				return;
			}
		},
	},
	wanderingspirit: {
		inherit: true,
		onDamagingHit(damage, defender, attacker, move) {
			const isAbility = defender.ability === 'wanderingspirit';
			if (isAbility) {
				if (attacker.getAbility().flags['failskillswap'] || defender.volatiles['dynamax']) return;

				if (this.checkMoveMakesContact(move, attacker, defender)) {
					const sourceAbility = attacker.setAbility('wanderingspirit', defender);
					if (!sourceAbility) return;
					if (defender.isAlly(attacker)) {
						this.add('-activate', defender, 'Skill Swap', '', '', `[of] ${attacker}`);
					} else {
						this.add('-activate', defender, 'ability: Wandering Spirit', this.dex.abilities.get(sourceAbility).name, 'Wandering Spirit', `[of] ${attacker}`);
					}
					defender.setAbility(sourceAbility);
				}
			} else {
				// Make Wandering Spirit replace a random ability
				const possibleAbilities = [attacker.ability, ...(attacker.m.innates || [])]
					.filter(val => !this.dex.abilities.get(val).flags['failskillswap']);
				if (!possibleAbilities.length || defender.volatiles['dynamax']) return;
				if (move.flags['contact']) {
					const sourceAbility = this.sample(possibleAbilities);
					if (sourceAbility === attacker.ability) {
						if (!attacker.setAbility('wanderingspirit', defender)) return;
					} else {
						attacker.removeVolatile('ability:' + sourceAbility);
						attacker.addVolatile('ability:wanderingspirit', attacker);
					}
					if (defender.isAlly(attacker)) {
						this.add('-activate', defender, 'Skill Swap', '', '', `[of] ${attacker}`);
					} else {
						this.add('-activate', defender, 'ability: Wandering Spirit', this.dex.abilities.get(sourceAbility).name, 'Wandering Spirit', `[of] ${attacker}`);
					}
					if (sourceAbility === attacker.ability) {
						defender.setAbility(sourceAbility);
					} else {
						defender.removeVolatile('ability:wanderingspirit');
						defender.addVolatile('ability:' + sourceAbility, defender);
					}
				}
			}
		},
	},
};
