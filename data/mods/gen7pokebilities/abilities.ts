export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	mummy: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (target.ability === 'mummy') {
				const sourceAbility = source.getAbility();
				if (sourceAbility.flags['cantsuppress'] || sourceAbility.id === 'mummy') {
					return;
				}
				if (this.checkMoveMakesContact(move, source, target, !source.isAlly(target))) {
					const oldAbility = source.setAbility('mummy', target);
					if (oldAbility) {
						this.add('-activate', target, 'ability: Mummy', this.dex.abilities.get(oldAbility).name, '[of] ' + source);
					}
				}
			} else {
				const possibleAbilities = [source.ability, ...(source.m.innates || [])]
					.filter(val => !this.dex.abilities.get(val).flags['cantsuppress'] && val !== 'mummy');
				if (!possibleAbilities.length) return;
				if (this.checkMoveMakesContact(move, source, target, !source.isAlly(target))) {
					const abil = this.sample(possibleAbilities);
					if (abil === source.ability) {
						const oldAbility = source.setAbility('mummy', target);
						if (oldAbility) {
							this.add('-activate', target, 'ability: Mummy', this.dex.abilities.get(oldAbility).name, '[of] ' + source);
						}
					} else {
						source.removeVolatile('ability:' + abil);
						source.addVolatile('ability:mummy', source);
						if (abil) {
							this.add('-activate', target, 'ability: Mummy', this.dex.abilities.get(abil).name, '[of] ' + source);
						}
					}
				}
			}
		},
	},
	powerofalchemy: {
		inherit: true,
		onAllyFaint(ally) {
			const pokemon = this.effectState.target;
			if (!pokemon.hp) return;
			const isAbility = pokemon.ability === 'powerofalchemy';
			let possibleAbilities = [ally.ability];
			if (ally.m.innates) possibleAbilities.push(...ally.m.innates);
			const additionalBannedAbilities = [pokemon.ability, ...(pokemon.m.innates || [])];
			possibleAbilities = possibleAbilities
				.filter(val => !this.dex.abilities.get(val).flags['noreceiver'] && !additionalBannedAbilities.includes(val));
			if (!possibleAbilities.length) return;
			const ability = this.dex.abilities.get(possibleAbilities[this.random(possibleAbilities.length)]);
			this.add('-ability', pokemon, ability, '[from] ability: Power of Alchemy', '[of] ' + ally);
			if (isAbility) {
				pokemon.setAbility(ability);
			} else {
				pokemon.removeVolatile("ability:powerofalchemy");
				pokemon.addVolatile("ability:" + ability, pokemon);
			}
		},
	},
	receiver: {
		inherit: true,
		onAllyFaint(ally) {
			const pokemon = this.effectState.target;
			if (!pokemon.hp) return;
			const isAbility = pokemon.ability === 'receiver';
			let possibleAbilities = [ally.ability];
			if (ally.m.innates) possibleAbilities.push(...ally.m.innates);
			const additionalBannedAbilities = [pokemon.ability, ...(pokemon.m.innates || [])];
			possibleAbilities = possibleAbilities
				.filter(val => !this.dex.abilities.get(val).flags['noreceiver'] && !additionalBannedAbilities.includes(val));
			if (!possibleAbilities.length) return;
			const ability = this.dex.abilities.get(possibleAbilities[this.random(possibleAbilities.length)]);
			this.add('-ability', pokemon, ability, '[from] ability: Receiver', '[of] ' + ally);
			if (isAbility) {
				pokemon.setAbility(ability);
			} else {
				pokemon.removeVolatile("ability:receiver");
				pokemon.addVolatile("ability:" + ability, pokemon);
			}
		},
	},
	trace: {
		inherit: true,
		onUpdate(pokemon) {
			if (!this.effectState.seek) return;
			const isAbility = pokemon.ability === 'trace';
			const possibleTargets: Pokemon[] = [];
			for (const target of pokemon.side.foe.active) {
				if (target && !target.fainted) {
					possibleTargets.push(target);
				}
			}
			while (possibleTargets.length) {
				const rand = this.random(possibleTargets.length);
				const target = possibleTargets[rand];
				let possibleAbilities = [target.ability];
				if (target.m.innates) possibleAbilities.push(...target.m.innates);
				const additionalBannedAbilities = [pokemon.ability, ...(pokemon.m.innates || [])];
				possibleAbilities = possibleAbilities
					.filter(val => !this.dex.abilities.get(val).flags['notrace'] && !additionalBannedAbilities.includes(val));
				if (!possibleAbilities.length) {
					possibleTargets.splice(rand, 1);
					continue;
				}
				const ability = this.dex.abilities.get(this.sample(possibleAbilities));
				this.add('-ability', pokemon, ability, '[from] ability: Trace', '[of] ' + target);
				if (isAbility) {
					pokemon.setAbility(ability);
				} else {
					pokemon.removeVolatile("ability:trace");
					pokemon.addVolatile("ability:" + ability, pokemon);
				}
				return;
			}
		},
	},
};
