const items: {[k: string]: ModdedItemData} = {
	chilanberry: {
		inherit: true,
		desc: "Blocks damage taken from a Normal-type attack. Single use.",
		onSourceModifyDamage(damage, source, target, move) {},
		onDamage(damage, target, source, effect) {
			const move = effect;
			if (!move || move.effectType !== 'Move') return;
			if (
				move.type === 'Normal' &&
				(!target.volatiles['substitute'] || move.flags['authentic'] || (move.infiltrates && this.gen >= 6))
			) {
				if (target.eatItem()) {
					this.debug('no damage');
					this.add('-enditem', target, this.effect, '[weaken]');
					return 0;
				}
			}
		},
	},
	enigmaberry: {
		inherit: true,
		desc: "Restores 100% max HP after holder is hit by a supereffective move. Single use.",
		onHit(target, source, move) {
			if (move && target.getMoveHitData(move).typeMod > 0) {
				if (target.eatItem()) {
					this.heal(target.baseMaxhp);
				}
			}
		},
	},
	lansatberry: {
		inherit: true,
		desc: "Holder gains +4 Critical Hit ratio when at 1/4 max HP or less. Single use.",
		onEat(pokemon) {
			pokemon.addVolatile('lansatberry');
		},
		condition: {
			onStart(target, source, effect) {
				if (effect?.id === 'zpower') {
					this.add('-start', target, 'move: Lansat Berry', '[zeffect]');
				} else if (effect && (['imposter', 'psychup', 'transform'].includes(effect.id))) {
					this.add('-start', target, 'move: Lansat Berry', '[silent]');
				} else {
					this.add('-start', target, 'move: Lansat Berry');
				}
			},
			onModifyCritRatio(critRatio) {
				return critRatio + 4;
			},
		},
	},
	leppaberry: {
		inherit: true,
		desc: "Restores the first of the holder's moves to reach 0 PP to maximum PP. Single use.",
		onEat(pokemon) {
			const moveSlot = pokemon.moveSlots.find(move => move.pp === 0) ||
				pokemon.moveSlots.find(move => move.pp < move.maxpp);
			if (!moveSlot) return;
			moveSlot.pp = moveSlot.maxpp;
			this.add('-activate', pokemon, 'item: Leppa Berry', moveSlot.move, '[consumed]');
		},
	},
	micleberry: {
		inherit: true,
		desc: "Holder's next move can't miss when at 1/4 max HP or less. Single use.",
		condition: {
			duration: 2,
			onSourceAccuracy(accuracy, target, source, move) {
				if (!move.ohko) {
					this.add('-enditem', source, 'Micle Berry');
					source.removeVolatile('micleberry');
					if (typeof accuracy === 'number') {
						return true;
					}
				}
			},
		},
	},
	starfberry: {
		inherit: true,
		desc: "Raises a random stat by 12 when at 1/4 max HP or less (not acc/eva). Single use.",
		onEat(pokemon) {
			const stats: BoostName[] = [];
			let stat: BoostName;
			for (stat in pokemon.boosts) {
				if (stat !== 'accuracy' && stat !== 'evasion' && pokemon.boosts[stat] < 6) {
					stats.push(stat);
				}
			}
			if (stats.length) {
				const randomStat = this.sample(stats);
				const boost: SparseBoostsTable = {};
				boost[randomStat] = 12;
				this.boost(boost);
			}
		},
	},
};

const berries = {
	heal: ['oran', 'sitrus'],
	supereffective: [
		['occa', 'Fire'],
		['passho', 'Water'],
		['wacan', 'Electric'],
		['rindo', 'Grass'],
		['yache', 'Ice'],
		['chople', 'Fighting'],
		['kebia', 'Poison'],
		['shuca', 'Ground'],
		['coba', 'Flying'],
		['payapa', 'Psychic'],
		['tanga', 'Bug'],
		['charti', 'Rock'],
		['kasib', 'Ghost'],
		['haban', 'Dragon'],
		['colbur', 'Dark'],
		['babiri', 'Steel'],
		['roseli', 'Fairy'],
	],
	pinchheal: [
		['figy', 'Atk'],
		['iapapa', 'Def'],
		['wiki', 'SpA'],
		['aguav', 'SpD'],
		['Mago', 'Spe'],
	],
	pinchstat: [
		['liechi', 'atk', 'Attack'],
		['ganlon', 'def', 'Defense'],
		['petaya', 'spa', 'Sp. Atk'],
		['apicot', 'spd', 'Sp. Def'],
		['salac', 'spe', 'Speed'],
	],
	keemaranga: [
		['kee', 'def', 'Defense'],
		['maranga', 'spd', 'Sp. Def'],
	],
	jabocarowap: [
		['jaboca', 'physical'],
		['rowap', 'special'],
	],
};

for (const berry of berries.heal) {
	items[`${berry}berry`] = {
		inherit: true,
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp);
		},
		desc: `Restores 100% max HP when at 1/2 max HP or less. Single use.`,
	};
}

for (const [berry, type] of berries.supereffective) {
	items[`${berry}berry`] = {
		inherit: true,
		desc: `Blocks damage taken from a supereffective ${type}-type attack. Single use.`,
		onSourceModifyDamage(damage, source, target, move) {},
		onDamage(damage, target, source, effect) {
			const move = effect;
			if (!move || move.effectType !== 'Move') return;
			if (move.type === type && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-100% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return 0;
				}
			}
		},
	};
}

for (const [berry, stat] of berries.pinchheal) {
	items[`${berry}berry`] = {
		inherit: true,
		desc: `Restores 100% max HP at 1/4 max HP or less; confuses if -${stat} Nature. Single use.`,
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp);
			if (pokemon.getNature().minus === this.toID(stat)) {
				pokemon.addVolatile('confusion');
			}
		},
	};
}

for (const [berry, stat, statName] of berries.pinchstat) {
	items[`${berry}berry`] = {
		inherit: true,
		desc: `Raises holder's ${statName} by 12 stages when at 1/4 max HP or less. Single use.`,
		onEat(pokemon) {
			this.boost({[stat]: 12});
		},
	};
}

for (const [berry, stat, statName] of berries.keemaranga) {
	items[`${berry}berry`] = {
		inherit: true,
		desc: `Raises holder's ${statName} by 12 stages after it is hit by a ${statName.startsWith('S') ? 'Special' : 'Physical'} attack. Single use.`,
		onEat(pokemon) {
			this.boost({[stat]: 12});
		},
	};
}

for (const [berry, category] of berries.jabocarowap) {
	items[`${berry}berry`] = {
		inherit: true,
		desc: `If holder is hit by a ${category} move, attacker loses 100% of its HP. Single use.`,
		onDamagingHit(damage, target, source, move) {
			if (move.category === category[0].toUpperCase() + category.slice(1)) {
				if (target.eatItem()) {
					this.damage(source.baseMaxhp, source, target);
				}
			}
		},
	};
}

export const Items = items;
