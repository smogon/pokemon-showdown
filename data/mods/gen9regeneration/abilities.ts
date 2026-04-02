export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	// new
	wingsofvictory: {
		onStart(pokemon) {
			if (pokemon.side.foe.totalFainted) {
				this.add('-activate', pokemon, 'ability: Wings of Victory');
				const fallen = Math.min(pokemon.side.foe.totalFainted, 5);
				this.add('-start', pokemon, `fallen${fallen}`, '[silent]');
				this.effectState.fallen = fallen;
			}
		},
		onEnd(pokemon) {
			this.add('-end', pokemon, `fallen${this.effectState.fallen}`, '[silent]');
		},
		onBasePowerPriority: 21,
		onBasePower(basePower, attacker, defender, move) {
			if (this.effectState.fallen) {
				const powMod = [4096, 4506, 4915, 5325, 5734, 6144];
				this.debug(`Wings of Victory boost: ${powMod[this.effectState.fallen]}/4096`);
				return this.chainModify([powMod[this.effectState.fallen], 4096]);
			}
		},
		name: "Wings of Victory",
		shortDesc: "This Pokemon's moves have 10% more power for each fainted foe, up to 5 foes.",
		rating: 3.5,
	},
	galaxybrain: {
		onStart(pokemon) {
			let totalatk = 0;
			let totalspa = 0;
			for (const target of pokemon.side.foe.active) {
				if (!target || target.fainted) continue;
				totalatk += target.getStat('atk', false, true);
				totalspa += target.getStat('spa', false, true);
			}
			if (totalatk && totalatk >= totalspa) {
				this.boost({ def: 1 });
			} else if (totalspa) {
				this.boost({ spd: 1 });
			}
		},
		name: "Galaxy Brain",
		shortDesc: "On switch-in, Defense or Sp. Def is raised 1 stage based on the foes' stronger offense.",
		rating: 4,
	},
	blackout: {
		onStart(source) {
			this.field.addPseudoWeather('magicroom', source);
			/* let activated = false;
			for (const pokemon of this.getAllActive()) {
				if (!activated) {
					this.add('-ability', source, 'Blackout');
				}
				activated = true;
				if (!pokemon.volatiles['embargo']) {
					pokemon.addVolatile('embargo');
				}
			} */
		},
		/* onAnySwitchIn(pokemon) {
			if (!pokemon.volatiles['embargo']) {
				pokemon.addVolatile('embargo');
			}
		}, */
		onEnd(pokemon) {
			this.field.removePseudoWeather('magicroom');
			/* for (const target of this.getAllActive()) {
				if (target === pokemon) continue;
				if (target.hasAbility('blackout')) return;
			}
			for (const target of this.getAllActive()) {
				target.removeVolatile('embargo');
			} */
		},
		name: "Blackout",
		shortDesc: "While this Pokemon is active, all held items are disabled.",
		rating: 5,
	},
	excavate: {
		onSwitchIn(pokemon) {
			let activated = false;
			for (const sideCondition of ['spikes', 'stealthrock']) {
				if (pokemon.side.getSideCondition(sideCondition) && !pokemon.side.getSideCondition('excavate')) {
					if (!activated) {
						this.add('-activate', pokemon, 'ability: Excavate');
						activated = true;
					}
				}
				if (pokemon.side.getSideCondition('spikes') && !pokemon.side.getSideCondition('excavate')) {
					this.add('-sideend', pokemon.side, 'move: Spikes', `[of] ${pokemon}`);
					pokemon.side.removeSideCondition('spikes');
					this.boost({ def: 1 }, pokemon);
					pokemon.side.addSideCondition('excavate');
				}
				if (pokemon.side.getSideCondition('stealthrock') && !pokemon.side.getSideCondition('excavate')) {
					this.add('-sideend', pokemon.side, 'move: Stealth Rock', `[of] ${pokemon}`);
					pokemon.side.removeSideCondition('stealthrock');
					this.boost({ def: 1 }, pokemon);
					pokemon.side.addSideCondition('excavate');
				}
			}
		},
		condition: {
			onSideStart(side) {
				this.add('-sidestart', side, 'move: Excavate Used');
			},
		},
		name: "Excavate",
		shortDesc: "Once per game. Removes Stealth Rock and Spikes on switch-in, +1 Def for each hazard removed.",
		rating: 4,
	},
	lifeguard: {
		onDamagingHit(damage, target, source, move) {
			if (move.type === 'Water') {
				this.boost({ def: 1 });
			}
		},
		onModifySecondaries(secondaries, target, source, move) {
			if (move.type === 'Water') return;
			this.debug('Lifeguard prevent secondary');
			return secondaries.filter(effect => !!effect.self);
		},
		name: "Lifeguard",
		shortDesc: "Boosts Defense when hit by a Water move; blocks additional effects of Water moves.",
		rating: 3,
	},
	ballooning: {
		onDamage(damage, target, source, effect) {
			if (
				effect.effectType === "Move" &&
				!effect.multihit &&
				!(effect.hasSheerForce && source.hasAbility('sheerforce'))
			) {
				this.effectState.checkedBallooning = false;
			} else {
				this.effectState.checkedBallooning = true;
			}
		},
		onTryEatItem(item) {
			const healingItems = [
				'aguavberry', 'enigmaberry', 'figyberry', 'iapapaberry',
				'magoberry', 'sitrusberry', 'wikiberry', 'oranberry', 'berryjuice',
			];
			if (healingItems.includes(item.id)) {
				return this.effectState.checkedBallooning;
			}
			return true;
		},
		onAfterMoveSecondary(target, source, move) {
			this.effectState.checkedBallooning = true;
			if (!source || source === target || !target.hp || !move.totalDamage) return;
			const lastAttackedBy = target.getLastAttackedBy();
			if (!lastAttackedBy) return;
			const damage = move.multihit ? move.totalDamage : lastAttackedBy.damage;
			if (target.hp <= target.maxhp / 2 && target.hp + damage > target.maxhp / 2) {
				this.boost({ atk: 1, spa: 1, spe: 1 }, target, target);
				target.addVolatile('perishsong');
			}
		},
		name: "Ballooning",
		shortDesc: "At 1/2 or less of this Pokemon's max HP: +1 Atk, Sp. Atk, Spe, and gains the Perish Song effect.",
		rating: 4,
	},
	ofafeather: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Flying') {
				this.debug('Of A Feather boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Flying') {
				this.debug('Of A Feather boost');
				return this.chainModify(1.5);
			}
		},
		name: "Of A Feather",
		rating: 3.5,
		shortDesc: "This Pokemon's Flying-type moves have 1.5x power.",
	},
	patriarch: {
		onStart(pokemon) {
			if (pokemon.side.pokemon.filter(ally => ally === pokemon || !ally.fainted && !ally.status)) {
				this.add('-activate', pokemon, 'ability: Patriarch');
				const healthy = Math.min(pokemon.side.pokemon
					.filter(ally => ally === pokemon || !ally.fainted && !ally.status).length, 5);
				this.add('-start', pokemon, `healthy{healthy}`, '[silent]');
				this.effectState.healthy = healthy;
			}
		},
		onEnd(pokemon) {
			this.add('-end', pokemon, `healthy${this.effectState.healthy}`, '[silent]');
		},
		onBasePowerPriority: 21,
		onBasePower(basePower, attacker, defender, move) {
			if (this.effectState.healthy) {
				const powMod = [4096, 4506, 4915, 5325, 5734, 6144];
				this.debug(`Patriach boost: ${powMod[this.effectState.healthy]}/4096`);
				return this.chainModify([powMod[this.effectState.healthy], 4096]);
			}
		},
		name: "Patriarch",
		shortDesc: "This Pokemon's moves have 10% more power for each of its healthy allies.",
		rating: 3.5,
	},
	violentabandon: {
		onAfterUseItem(item, pokemon) {
			if (
				pokemon !== this.effectState.target &&
				pokemon.baseSpecies.baseSpecies !== 'Gyarados' ||
				pokemon.transformed
			) {
				return;
			}
			if (pokemon.species.forme !== 'Mega') {
				pokemon.formeChange('Gyarados-Mega', this.effect, true);
			}
		},
		onTakeItem(item, pokemon) {
			if (
				pokemon !== this.effectState.target &&
				pokemon.baseSpecies.baseSpecies !== 'Gyarados' ||
				pokemon.transformed
			) {
				return;
			}
			if (pokemon.species.forme !== 'Mega') {
				pokemon.formeChange('Gyarados-Mega', this.effect, true);
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
		name: "Violent Abandon",
		shortDesc: "This Pokemon transforms into Mega Gyarados whenever its item is used or lost.",
		rating: 3.5,
	},
	tropicalcurrent: {
		onDamagePriority: 1,
		onDamage(damage, target, source, effect) {
			if (effect.id === 'brn') {
				this.heal(target.baseMaxhp / 8);
				return false;
			}
		},
		name: "Tropical Current",
		shortDesc: "This Pokemon restored 1/8 of its max HP per turn if it's burned. Ignores burn attack drop.",
		rating: 4,
	},
	bullspirit: {
		onAfterMoveSecondarySelf(source, target, move) {
			if (!move || source.switchFlag === true || !move.hitTargets || move.type !== 'Normal') return;
			this.add('-ability', source, 'Bull Spirit');
			this.add('-message', `${source.name}'s next attack will be physical!`);
			source.addVolatile('bullspirit');
		},
		condition: {
			onStart(target) {
				this.add('-start', target, 'ability: Bull Spirit');
			},
			duration: 2,
			onModifyMovePriority: 8,
			onModifyMove(move, pokemon) {
				if (move.category !== "Status") {
					move.category = "Physical";
				}
			},
			onEnd(target) {
				this.add('-end', target, 'ability: Bull Spirit', '[silent]');
			},
		},
		flags: {},
		name: "Bull Spirit",
		rating: 1,
		shortDesc: "After using a Normal-type move, the user's next attack will always be physical.",
	},
};
