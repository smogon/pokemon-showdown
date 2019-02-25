'use strict';

/**@type {{[k: string]: ModdedAbilityData}} */
exports.BattleAbilities = {
	powerofalchemy: {
		inherit: true,
		onAllyFaint(ally) {
			let pokemon = this.effectData.target;
			if (!pokemon.hp) return;
			let isAbility = pokemon.ability === 'powerofalchemy';
			/**@type {string[]} */
			let possibleAbilities = [ally.ability];
			if (ally.innates) possibleAbilities = possibleAbilities.concat(ally.innates);
			let bannedAbilities = ['battlebond', 'comatose', 'disguise', 'flowergift', 'forecast', 'illusion', 'imposter', 'multitype', 'powerconstruct', 'powerofalchemy', 'receiver', 'rkssystem', 'schooling', 'shieldsdown', 'stancechange', 'trace', 'wonderguard', 'zenmode'];
			bannedAbilities.push(pokemon.ability);
			if (pokemon.innates) bannedAbilities = bannedAbilities.concat(pokemon.innates);
			possibleAbilities = possibleAbilities.filter(val => !bannedAbilities.includes(val));
			if (!possibleAbilities.length) return;
			let ability = this.getAbility(possibleAbilities[this.random(possibleAbilities.length)]);
			this.add('-ability', pokemon, ability, '[from] ability: Power of Alchemy', '[of] ' + ally);
			if (isAbility) {
				pokemon.setAbility(ability);
			} else {
				pokemon.removeVolatile("abilitypowerofalchemy");
				pokemon.addVolatile("ability" + ability, pokemon);
			}
		},
	},
	receiver: {
		inherit: true,
		onAllyFaint(ally) {
			let pokemon = this.effectData.target;
			if (!pokemon.hp) return;
			let isAbility = pokemon.ability === 'receiver';
			/**@type {string[]} */
			let possibleAbilities = [ally.ability];
			if (ally.innates) possibleAbilities = possibleAbilities.concat(ally.innates);
			let bannedAbilities = ['battlebond', 'comatose', 'disguise', 'flowergift', 'forecast', 'illusion', 'imposter', 'multitype', 'powerconstruct', 'powerofalchemy', 'receiver', 'rkssystem', 'schooling', 'shieldsdown', 'stancechange', 'trace', 'wonderguard', 'zenmode'];
			bannedAbilities.push(pokemon.ability);
			if (pokemon.innates) bannedAbilities = bannedAbilities.concat(pokemon.innates);
			possibleAbilities = possibleAbilities.filter(val => !bannedAbilities.includes(val));
			if (!possibleAbilities.length) return;
			let ability = this.getAbility(possibleAbilities[this.random(possibleAbilities.length)]);
			this.add('-ability', pokemon, ability, '[from] ability: Receiver', '[of] ' + ally);
			if (isAbility) {
				pokemon.setAbility(ability);
			} else {
				pokemon.removeVolatile("abilityreceiver");
				pokemon.addVolatile("ability" + ability, pokemon);
			}
		},
	},
	trace: {
		inherit: true,
		onUpdate(pokemon) {
			if (!pokemon.isStarted) return;
			let isAbility = pokemon.ability === 'trace';
			/**@type {Pokemon[]} */
			let possibleTargets = [];
			for (let target of pokemon.side.foe.active) {
				if (target && !target.fainted) {
					possibleTargets.push(target);
				}
			}
			while (possibleTargets.length) {
				let rand = this.random(possibleTargets.length);
				let target = possibleTargets[rand];
				/**@type {string[]} */
				let possibleAbilities = [target.ability];
				if (target.innates) possibleAbilities = possibleAbilities.concat(target.innates);
				let bannedAbilities = ['battlebond', 'comatose', 'disguise', 'flowergift', 'forecast', 'illusion', 'imposter', 'multitype', 'powerconstruct', 'powerofalchemy', 'receiver', 'rkssystem', 'schooling', 'shieldsdown', 'stancechange', 'trace', 'zenmode'];
				bannedAbilities.push(pokemon.ability);
				if (pokemon.innates) bannedAbilities = bannedAbilities.concat(pokemon.innates);
				possibleAbilities = possibleAbilities.filter(val => !bannedAbilities.includes(val));
				if (!possibleAbilities.length) {
					possibleTargets.splice(rand, 1);
					continue;
				}
				let ability = this.getAbility(this.sample(possibleAbilities));
				this.add('-ability', pokemon, ability, '[from] ability: Trace', '[of] ' + target);
				if (isAbility) {
					pokemon.setAbility(ability);
				} else {
					pokemon.removeVolatile("abilitytrace");
					pokemon.addVolatile("ability" + ability, pokemon);
				}
				return;
			}
		},
	},
};
