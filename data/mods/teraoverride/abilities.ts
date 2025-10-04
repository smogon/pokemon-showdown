export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	aerilate: {
		inherit: true,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.type === pokemon.teraType && (!noModifyType.includes(move.id) || this.activeMove?.isMax) &&
				!(move.isZ && move.category !== 'Status') && !(move.name === 'Tera Blast' && pokemon.terastallized)) {
				move.type = pokemon.teraType;
				move.typeChangerBoosted = this.effect;
			}
		},
	},
	blaze: {
		inherit: true,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === attacker.teraType && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Blaze boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === attacker.teraType && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Blaze boost');
				return this.chainModify(1.5);
			}
		},
	},
	darkaura: {
		inherit: true,
		onAnyBasePower(basePower, source, target, move) {
			if (target === source || move.category === 'Status' || move.type !== source.teraType) return;
			if (!move.auraBooster?.hasAbility('Dark Aura')) move.auraBooster = this.effectState.target;
			if (move.auraBooster !== this.effectState.target) return;
			return this.chainModify([move.hasAuraBreak ? 3072 : 5448, 4096]);
		},
	},
	dragonsmaw: {
		inherit: true,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === attacker.teraType) {
				this.debug('Dragon\'s Maw boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === attacker.teraType) {
				this.debug('Dragon\'s Maw boost');
				return this.chainModify(1.5);
			}
		},
	},
	dryskin: {
		inherit: true,
		onTryHit(target, source, move) {
			if (target !== source && move.type === target.teraType) {
				if (!this.heal(target.baseMaxhp / 4)) {
					this.add('-immune', target, '[from] ability: Dry Skin');
				}
				return null;
			}
		},
		onSourceBasePower(basePower, attacker, defender, move) {
			if (move.type === defender.teraType) {
				return this.chainModify(1.25);
			}
		},
	},
	eartheater: {
		inherit: true,
		onTryHit(target, source, move) {
			if (target !== source && move.type === target.teraType) {
				if (!this.heal(target.baseMaxhp / 4)) {
					this.add('-immune', target, '[from] ability: Earth Eater');
				}
				return null;
			}
		},
	},
	fairyaura: {
		inherit: true,
		onAnyBasePower(basePower, source, target, move) {
			if (target === source || move.category === 'Status' || move.type !== source.teraType) return;
			if (!move.auraBooster?.hasAbility('Fairy Aura')) move.auraBooster = this.effectState.target;
			if (move.auraBooster !== this.effectState.target) return;
			return this.chainModify([move.hasAuraBreak ? 3072 : 5448, 4096]);
		},
	},
	flashfire: {
		inherit: true,
		onTryHit(target, source, move) {
			if (target !== source && move.type === target.teraType) {
				move.accuracy = true;
				if (!target.addVolatile('flashfire')) {
					this.add('-immune', target, '[from] ability: Flash Fire');
				}
				return null;
			}
		},
		condition: {
			noCopy: true, // doesn't get copied by Baton Pass
			onStart(target) {
				this.add('-start', target, 'ability: Flash Fire');
			},
			onModifyAtkPriority: 5,
			onModifyAtk(atk, attacker, defender, move) {
				if (move.type === attacker.teraType && attacker.hasAbility('flashfire')) {
					this.debug('Flash Fire boost');
					return this.chainModify(1.5);
				}
			},
			onModifySpAPriority: 5,
			onModifySpA(atk, attacker, defender, move) {
				if (move.type === attacker.teraType && attacker.hasAbility('flashfire')) {
					this.debug('Flash Fire boost');
					return this.chainModify(1.5);
				}
			},
			onEnd(target) {
				this.add('-end', target, 'ability: Flash Fire', '[silent]');
			},
		},
	},
	flowerveil: {
		inherit: true,
		onAllyTryBoost(boost, target, source, effect) {
			if ((source && target === source) || !target.hasType(this.effectState.target.teraType)) return;
			let showMsg = false;
			let i: BoostID;
			for (i in boost) {
				if (boost[i]! < 0) {
					delete boost[i];
					showMsg = true;
				}
			}
			if (showMsg && !(effect as ActiveMove).secondaries) {
				const effectHolder = this.effectState.target;
				this.add('-block', target, 'ability: Flower Veil', `[of] ${effectHolder}`);
			}
		},
		onAllySetStatus(status, target, source, effect) {
			if (target.hasType(this.effectState.target.teraType) && source && target !== source && effect && effect.id !== 'yawn') {
				this.debug('interrupting setStatus with Flower Veil');
				if (effect.name === 'Synchronize' || (effect.effectType === 'Move' && !effect.secondaries)) {
					const effectHolder = this.effectState.target;
					this.add('-block', target, 'ability: Flower Veil', `[of] ${effectHolder}`);
				}
				return null;
			}
		},
		onAllyTryAddVolatile(status, target, source) {
			if (target.hasType(this.effectState.target.teraType) && status.id === 'yawn') {
				this.debug('Flower Veil blocking yawn');
				const effectHolder = this.effectState.target;
				this.add('-block', target, 'ability: Flower Veil', `[of] ${effectHolder}`);
				return null;
			}
		},
	},
	fluffy: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			let mod = 1;
			if (move.type === target.teraType) mod *= 2;
			if (move.flags['contact']) mod /= 2;
			return this.chainModify(mod);
		},
	},
	galewings: {
		inherit: true,
		onModifyPriority(priority, pokemon, target, move) {
			if (move?.type === pokemon.teraType && pokemon.hp === pokemon.maxhp) return priority + 1;
		},
	},
	galvanize: {
		inherit: true,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.type === pokemon.teraType && (!noModifyType.includes(move.id) || this.activeMove?.isMax) &&
				!(move.isZ && move.category !== 'Status') && !(move.name === 'Tera Blast' && pokemon.terastallized)) {
				move.type = pokemon.teraType;
				move.typeChangerBoosted = this.effect;
			}
		},
	},
	heatproof: {
		inherit: true,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === defender.teraType) {
				this.debug('Heatproof Atk weaken');
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === defender.teraType) {
				this.debug('Heatproof SpA weaken');
				return this.chainModify(0.5);
			}
		},
	},
	justified: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (move.type === target.teraType) {
				this.boost({ atk: 1 });
			}
		},
	},
	lightningrod: {
		inherit: true,
		onTryHit(target, source, move) {
			if (target !== source && move.type === target.teraType) {
				if (!this.boost({ spa: 1 })) {
					this.add('-immune', target, '[from] ability: Lightning Rod');
				}
				return null;
			}
		},
		onAnyRedirectTarget(target, source, source2, move) {
			if (move.type !== this.effectState.target.teraType || move.flags['pledgecombo']) return;
			const redirectTarget = ['randomNormal', 'adjacentFoe'].includes(move.target) ? 'normal' : move.target;
			if (this.validTarget(this.effectState.target, source, redirectTarget)) {
				if (move.smartTarget) move.smartTarget = false;
				if (this.effectState.target !== target) {
					this.add('-activate', this.effectState.target, 'ability: Lightning Rod');
				}
				return this.effectState.target;
			}
		},
	},
	liquidvoice: {
		inherit: true,
		onModifyType(move, pokemon) {
			if (move.flags['sound'] && !pokemon.volatiles['dynamax']) { // hardcode
				move.type = pokemon.teraType;
			}
		},
	},
	magnetpull: {
		inherit: true,
		onFoeTrapPokemon(pokemon) {
			if (pokemon.hasType(this.effectState.target.teraType) && pokemon.isAdjacent(this.effectState.target)) {
				pokemon.tryTrap(true);
			}
		},
		onFoeMaybeTrapPokemon(pokemon, source) {
			if (!source) source = this.effectState.target;
			if (!source || !pokemon.isAdjacent(source)) return;
			if (!pokemon.knownType || pokemon.hasType(source.teraType)) {
				pokemon.maybeTrapped = true;
			}
		},
	},
	mindseye: {
		inherit: true,
		onModifyMove(move, pokemon) {
			move.ignoreEvasion = true;
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity[pokemon.teraType] = true;
			}
		},
	},
	motordrive: {
		inherit: true,
		onTryHit(target, source, move) {
			if (target !== source && move.type === target.teraType) {
				if (!this.boost({ spe: 1 })) {
					this.add('-immune', target, '[from] ability: Motor Drive');
				}
				return null;
			}
		},
	},
	normalize: {
		inherit: true,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'hiddenpower', 'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'struggle', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (!(move.isZ && move.category !== 'Status') &&
				// TODO: Figure out actual interaction
				(!noModifyType.includes(move.id) || this.activeMove?.isMax) && !(move.name === 'Tera Blast' && pokemon.terastallized)) {
				move.type = pokemon.teraType;
				move.typeChangerBoosted = this.effect;
			}
		},
	},
	overgrow: {
		inherit: true,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === attacker.teraType && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Overgrow boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === attacker.teraType && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Overgrow boost');
				return this.chainModify(1.5);
			}
		},
	},
	pixilate: {
		inherit: true,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.type === pokemon.teraType && (!noModifyType.includes(move.id) || this.activeMove?.isMax) &&
				!(move.isZ && move.category !== 'Status') && !(move.name === 'Tera Blast' && pokemon.terastallized)) {
				move.type = pokemon.teraType;
				move.typeChangerBoosted = this.effect;
			}
		},
	},
	purifyingsalt: {
		inherit: true,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === defender.teraType) {
				this.debug('Purifying Salt weaken');
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpA(spa, attacker, defender, move) {
			if (move.type === defender.teraType) {
				this.debug('Purifying Salt weaken');
				return this.chainModify(0.5);
			}
		},
	},
	rattled: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if ([target.teraType].includes(move.type)) {
				this.boost({ spe: 1 });
			}
		},
	},
	refrigerate: {
		inherit: true,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.type === pokemon.teraType && (!noModifyType.includes(move.id) || this.activeMove?.isMax) &&
				!(move.isZ && move.category !== 'Status') && !(move.name === 'Tera Blast' && pokemon.terastallized)) {
				move.type = pokemon.teraType;
				move.typeChangerBoosted = this.effect;
			}
		},
	},
	rockypayload: {
		inherit: true,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === attacker.teraType) {
				this.debug('Rocky Payload boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === attacker.teraType) {
				this.debug('Rocky Payload boost');
				return this.chainModify(1.5);
			}
		},
	},
	sandforce: {
		inherit: true,
		onBasePower(basePower, attacker, defender, move) {
			if (this.field.isWeather('sandstorm')) {
				if (move.type === attacker.teraType) {
					this.debug('Sand Force boost');
					return this.chainModify([5325, 4096]);
				}
			}
		},
	},
	sapsipper: {
		inherit: true,
		onTryHit(target, source, move) {
			if (target !== source && move.type === target.teraType) {
				if (!this.boost({ atk: 1 })) {
					this.add('-immune', target, '[from] ability: Sap Sipper');
				}
				return null;
			}
		},
		onAllyTryHitSide(target, source, move) {
			if (source === this.effectState.target || !target.isAlly(source)) return;
			if (move.type === this.effectState.target.teraType) {
				this.boost({ atk: 1 }, this.effectState.target);
			}
		},
	},
	scrappy: {
		inherit: true,
		onModifyMove(move, pokemon) {
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity[pokemon.teraType] = true;
			}
		},
	},
	steamengine: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if ([target.teraType].includes(move.type)) {
				this.boost({ spe: 6 });
			}
		},
	},
	steelworker: {
		inherit: true,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === attacker.teraType) {
				this.debug('Steelworker boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === attacker.teraType) {
				this.debug('Steelworker boost');
				return this.chainModify(1.5);
			}
		},
	},
	steelyspirit: {
		inherit: true,
		onAllyBasePower(basePower, attacker, defender, move) {
			if (move.type === this.effectState.target.teraType) {
				this.debug('Steely Spirit boost');
				return this.chainModify(1.5);
			}
		},
	},
	stormdrain: {
		inherit: true,
		onTryHit(target, source, move) {
			if (target !== source && move.type === target.teraType) {
				if (!this.boost({ spa: 1 })) {
					this.add('-immune', target, '[from] ability: Storm Drain');
				}
				return null;
			}
		},
		onAnyRedirectTarget(target, source, source2, move) {
			if (move.type !== this.effectState.target.teraType || move.flags['pledgecombo']) return;
			const redirectTarget = ['randomNormal', 'adjacentFoe'].includes(move.target) ? 'normal' : move.target;
			if (this.validTarget(this.effectState.target, source, redirectTarget)) {
				if (move.smartTarget) move.smartTarget = false;
				if (this.effectState.target !== target) {
					this.add('-activate', this.effectState.target, 'ability: Storm Drain');
				}
				return this.effectState.target;
			}
		},
	},
	swarm: {
		inherit: true,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === attacker.teraType && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Swarm boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === attacker.teraType && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Swarm boost');
				return this.chainModify(1.5);
			}
		},
	},
	thermalexchange: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (move.type === target.teraType) {
				this.boost({ atk: 1 });
			}
		},
	},
	thickfat: {
		inherit: true,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === defender.teraType) {
				this.debug('Thick Fat weaken');
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === defender.teraType) {
				this.debug('Thick Fat weaken');
				return this.chainModify(0.5);
			}
		},
	},
	torrent: {
		inherit: true,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === attacker.teraType && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Torrent boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === attacker.teraType && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Torrent boost');
				return this.chainModify(1.5);
			}
		},
	},
	transistor: {
		inherit: true,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === attacker.teraType) {
				this.debug('Transistor boost');
				return this.chainModify([5325, 4096]);
			}
		},
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === attacker.teraType) {
				this.debug('Transistor boost');
				return this.chainModify([5325, 4096]);
			}
		},
	},
	voltabsorb: {
		inherit: true,
		onTryHit(target, source, move) {
			if (target !== source && move.type === target.teraType) {
				if (!this.heal(target.baseMaxhp / 4)) {
					this.add('-immune', target, '[from] ability: Volt Absorb');
				}
				return null;
			}
		},
	},
	waterabsorb: {
		inherit: true,
		onTryHit(target, source, move) {
			if (target !== source && move.type === target.teraType) {
				if (!this.heal(target.baseMaxhp / 4)) {
					this.add('-immune', target, '[from] ability: Water Absorb');
				}
				return null;
			}
		},
	},
	waterbubble: {
		inherit: true,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === defender.teraType) {
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === defender.teraType) {
				return this.chainModify(0.5);
			}
		},
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === attacker.teraType) {
				return this.chainModify(2);
			}
		},
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === attacker.teraType) {
				return this.chainModify(2);
			}
		},
	},
	watercompaction: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (move.type === target.teraType) {
				this.boost({ def: 2 });
			}
		},
	},
	wellbakedbody: {
		inherit: true,
		onTryHit(target, source, move) {
			if (target !== source && move.type === target.teraType) {
				if (!this.boost({ def: 2 })) {
					this.add('-immune', target, '[from] ability: Well-Baked Body');
				}
				return null;
			}
		},
	},
	mountaineer: {
		inherit: true,
		onTryHit(target, source, move) {
			if (move.type === target.teraType && !target.activeTurns) {
				this.add('-immune', target, '[from] ability: Mountaineer');
				return null;
			}
		},
	},
};
