// Custom item definitions.

export const Items: import('../../../sim/dex-items').ModdedItemDataTable = {
	remnant: {
		name: "Remnant",
		spritenum: 0,
		fling: {
			basePower: 30,
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Steel' || move.type === 'Ghost') {
				return this.chainModify(1.25);
			}
		},
		onSourceBasePower(basePower, attacker, defender, move) {
			if (move.type === 'Fire') {
				return this.chainModify(1.25);
			}
		},
		num: -1,
		isNonstandard: "FNAF",
		shortDesc: "Steel and Ghost moves: 1.25x power. Weaker to Fire.",
		desc: "Holder's Steel- and Ghost-type moves have 1.25x power. The power of Fire-type moves is multiplied by 1.25 when used on the holder.",
	},
	illusiondisc: {
		name: "Illusion Disc",
		spritenum: 0,
		fling: {
			basePower: 100,
		},
		onBeforeSwitchIn(pokemon) {
			pokemon.illusion = null;
			pokemon.addVolatile('illusiondisc');
			// yes, you can Illusion an active pokemon but only if it's to your right
			for (let i = pokemon.side.pokemon.length - 1; i > pokemon.position; i--) {
				const possibleTarget = pokemon.side.pokemon[i];
				if (!possibleTarget.fainted) {
					// If Ogerpon is in the last slot while the Illusion Pokemon is Terastallized
					// Illusion will not disguise as anything
					if (!pokemon.terastallized || !['Ogerpon', 'Terapagos'].includes(possibleTarget.species.baseSpecies)) {
						pokemon.illusion = possibleTarget;
					}
					break;
				}
			}
		},
		onDamagingHit(damage, target, source, move) {
			target.useItem();
			if (target.illusion) {
				this.singleEvent('End', this.dex.abilities.get('Illusion'), target.abilityState, target, source, move);
			}
			target.removeVolatile('illusiondisc');
		},
		onEnd(pokemon) {
			if (pokemon.illusion && !pokemon.beingCalledBack) {
				this.debug('illusion cleared');
				pokemon.illusion = null;
				const details = pokemon.getUpdatedDetails();
				this.add('replace', pokemon, details);
				this.add('-end', pokemon, 'Illusion');
				if (this.ruleTable.has('illusionlevelmod')) {
					this.hint("Illusion Level Mod is active, so this Pok\u00e9mon's true level was hidden.", true);
				}
			}
		},
		onFaint(pokemon) {
			pokemon.illusion = null;
		},
		num: -2,
		isNonstandard: "FNAF",
		desc: "When this holder switches in, it appears as the last unfainted Pokemon in its party until it takes direct damage from another Pokemon's attack or until the end of the turn, upon either of which this item is consumed. This Pokemon's actual level and HP are displayed instead of those of the mimicked Pokemon.",
		shortDesc: "Holder appears as last Pokemon in party until taking damage or end of turn. Single use.",
	},
	musicbox: {
		name: "Music Box",
		spritenum: 0,
		onSwitchIn(pokemon) {
			pokemon.trySetStatus('slp', pokemon);
			if (pokemon.status === 'slp') {
				this.boost({ atk: 1, spa: 1, spe: 1 }, pokemon);
			}
		},
		num: -3,
		isNonstandard: "FNAF",
		desc: "When the holder switches in, it falls asleep. Then, its Attack, Special Attack, and Speed rise by 1 stage if it is asleep.",
		shortDesc: "On switch-in: holder falls asleep; +1 Atk, SpA, and Spe",
	},
};
