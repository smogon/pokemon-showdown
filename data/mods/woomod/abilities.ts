export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	vesselofsigma: {
		onStart(pokemon) {
			if (this.suppressingAbility(pokemon)) return;
			this.add('-ability', pokemon, 'Vessel of Sigma');
		},
		// @ts-expect-error
		onAnyModifySpe(spe, source, target) {
			if (source.hasAbility('Vessel of Sigma')) return;
			// @ts-expect-error
			return this.chainModify(0.75);
		},
		flags: {},
		name: "Vessel of Sigma",
		shortDesc: "Active Pokemon without this Ability have their Speed multiplied by 0.75.",
	},
	tacticalretreat: {
		onAfterBoost(boosts, target, source, move) {
			if (!target || !source.hp || target !== source) return;
			if (Object.values(boosts).some(boost => boost < 0)) {
				target.switchFlag = true;
				this.add('-ability', target, 'Tactical Retreat');
			};
		},
		flags: {},
		name: "Tactical Retreat",
		shortDesc: "This Pokemon switches out after using a move that lowers stats.",
	},
	forbiddenjuice: {
		onStart(pokemon) {
			if (pokemon.side.sideConditions['toxicspikes']) {
				this.add('-sideend', pokemon.side, 'move: Toxic Spikes', `[of] ${pokemon}`);
				pokemon.side.removeSideCondition('toxicspikes');
				this.boost({ def: 1 });
			}
		},
		onTryHitPriority: 1,
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Poison') {
				if (!this.boost({ def: 1 })) {
					this.add('-immune', target, '[from] ability: Forbidden Juice');
				}
				return null;
			}
		},
		flags: {},
		name: "Forbidden Juice",
		shortDesc: "This Pokemon absorbs Poison-type moves and Toxic Spikes to raise its Def by 1.",
	},
	typhoon: {
		onDamagingHit(damage, target, source, move) {
			if (move.category === 'Physical') {
				target.setAbility('deltastream', target);
			}
			if (move.category === 'Special') {
				if (!target.hasType('Flying')) return;
				const newType = target.getTypes().filter(t => t !== 'Flying');
				if (target.setType(newType)) {
					this.add('-start', target, 'typechange', newType.join('/'), '[silent]');
				}
			}
		},
		flags: {},
		name: "Typhoon",
		shortDesc: "When hit by a physical move, set Delta Stream. When hit by a special move, lose Flying.",
	},
	deltastream: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (move.category === 'Special') {
				if (!target.hasType('Flying')) return;
				const newType = target.getTypes().filter(t => t !== 'Flying');
				if (target.setType(newType)) {
					this.add('-start', target, 'typechange', newType.join('/'), '[silent]');
				}
			}
		},
		onEnd(pokemon) {
			if (this.field.weatherState.source !== pokemon) return;
			for (const target of this.getAllActive()) {
				if (target === pokemon) continue;
				if (target.hasAbility('deltastream')) {
					this.field.weatherState.source = target;
					return;
				}
			}
			this.field.clearWeather();
			pokemon.setAbility('typhoon');
		},
	},
	protectiveaura: {
		onSourceModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Ghost' || move.type === 'Dark') {
				this.debug('Thick Fat weaken');
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Ghost' || move.type === 'Dark') {
				this.debug('Thick Fat weaken');
				return this.chainModify(0.5);
			}
		},
		onAllyTryAddVolatile(status, target, source, effect) {
			if (['confusion', 'taunt', 'healblock', 'torment'].includes(status.id)) {
				if (effect.effectType === 'Move') {
					const effectHolder = this.effectState.target;
					this.add('-block', target, 'ability: Protective Aura', '[of] ' + effectHolder);
				}
				return null;
			}
		},
		flags: { breakable: 1 },
		name: "Protective Aura",
		shortDesc: "This Pokemon takes 0.5x damage from Ghost/Dark attacks. Immune to confusion/Taunt/Heal Block/Torment.",
	},
	asoneklang: {
		onSwitchInPriority: 1,
		onStart(pokemon) {
			this.add('-ability', pokemon, 'As One (Klang)');
			this.add('-message', 'Baltoy-Gear-Rider has two Abilities!');
			this.add('-ability', pokemon, 'Levitate');
			this.add('-ability', pokemon, 'Clear Body');
		},
		onTryBoost(boost, target, source, effect) {
			if (source && target === source) return;
			let showMsg = false;
			let i: BoostID;
			for (i in boost) {
				if (boost[i]! < 0) {
					delete boost[i];
					showMsg = true;
				}
			}
			if (showMsg && !(effect as ActiveMove).secondaries && effect.id !== 'octolock') {
				this.add("-fail", target, "unboost", "[from] ability: Clear Body", `[of] ${target}`);
			}
		},
		flags: {},
		name: "As One (Klang)",
		shortDesc: "Effects of Levitate and Clear Body.",
	},
	asoneseadra: {
		onStart(pokemon) {
			this.add('-ability', pokemon, 'As One (Seadra)');
			this.add('-message', 'Baltoy-Water-Rider has two Abilities!');
			this.add('-ability', pokemon, 'Levitate');
			this.add('-ability', pokemon, 'Sniper');
		},
		onModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).crit) {
				this.debug('Sniper boost');
				return this.chainModify(1.5);
			}
		},
		flags: {},
		name: "As One (Seadra)",
		shortDesc: "Effects of Levitate and Sniper.",
	},
	raincurse: {
		onSwitchOut(pokemon) {
			this.field.setWeather('raindance');
		},
		onSourceModifyDamagePriority: 17,
		onSourceModifyDamage(basePower, attacker, defender, move) {
			if (['raindance', 'primordialsea'].includes(defender.effectiveWeather())) {
				return this.chainModify(2);
			}
		},
		flags: {},
		name: "Rain Curse",
		shortDesc: "This Pokemon sets Rain when switching out. Takes 2x damage in rain.",
	},
	spicycream: {
		onSetStatus(status, pokemon, source, effect) {
			if (pokemon.baseSpecies.baseSpecies !== 'Vanillite') return;
			if (status.id === 'brn' && pokemon.species.forme !== 'Melted') {
				pokemon.formeChange('Vanillite-Melted', effect, true);
			}
		},
		flags: {},
		name: "Spicy Cream",
		shortDesc: "When Vanillite gets burned, it changes to Melted forme.",
	},
	pyromorphosis: {
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) {
			if (!target.getVolatile('pyromorphosis')) target.addVolatile('pyromorphosis');
		},
		condition: {
			onStart(pokemon, source, effect) {
				this.add('-start', pokemon, 'Pyromorphosis', this.activeMove!.name, '[from] ability: ' + effect.name);
			},
			onRestart(pokemon, source, effect) {
				this.add('-start', pokemon, 'Pyromorphosis', this.activeMove!.name, '[from] ability: ' + effect.name);
			},
			onBasePowerPriority: 9,
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Fire') {
					this.debug('pyromorphosis boost');
					return this.chainModify(2);
				}
			},
			onMoveAborted(pokemon, target, move) {
				if (move.type === 'Fire' && move.id !== 'pyromorphosis') {
					pokemon.removeVolatile('pyromorphosis');
				}
			},
			onAfterMove(pokemon, target, move) {
				if (move.type === 'Fire' && move.id !== 'pyromorphosis') {
					pokemon.removeVolatile('pyromorphosis');
				}
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Pyromorphosis', '[silent]');
			},
		},
		flags: {},
		name: "Pyromorphosis",
		shortDesc: "When this Pokemon is damaged by an attack, its next Fire move has doubled power.",
	},
	lastcall: {
		onDamagingHit(damage, target, source, move) {
			if (!target.hp) {
				this.add('-ability', target, 'LAST CALL');
				this.actions.useMove(target.moveSlots[target.moveSlots.length - 1].id, target);
			}
		},
		flags: {},
		name: "LAST CALL",
		shortDesc: "When this Pokemon faints, it uses the last move in its moveset.",
	},
	narcissus: {
		onSwitchIn(pokemon) {
			const target = pokemon.side.foe.active[pokemon.side.foe.active.length - 1 - pokemon.position];
			if (target) {
				target.transformInto(pokemon, this.dex.abilities.get('narcissus'));
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1 },
		name: "Narcissus",
		shortDesc: "On switch-in, the foe transforms into this Pokemon.",
	},
	magicbag: {
		onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			const flingable = this.dex.items.all().filter(item => item.fling);
			const currentItem = pokemon.item;
			const newItem = this.sample(flingable);
			pokemon.setItem(newItem);
			this.actions.useMove('fling', pokemon);
			pokemon.setItem(currentItem);
		},
		flags: {},
		name: "Magic Bag",
		shortDesc: "This Pokemon flings a random item at the end of each turn.",
	},
	perseverance: {
		onModifyCritRatio(critRatio, source, target) {
			let drops = 0;
			let boost: BoostID;
			for (boost in source.boosts) {
				if (source.boosts[boost] < 0) drops -= source.boosts[boost];
			}
			return critRatio + drops;
		},
		flags: {},
		name: "Perseverance",
		shortDesc: "This Pokemon's crit ratio increases by 1 for each stat drop it has.",
	},
	phantomchute: {
		onSwitchOut(pokemon) {
			pokemon.side.addSlotCondition(pokemon, 'phantomchute');
			this.add('-ability', pokemon, 'Phantom Chute');
		},
		condition: {
			duration: 1,
			onSwap(pokemon) {
				if (!pokemon.fainted) pokemon.side.removeSlotCondition(pokemon, 'phantomchute');
			},
		},
		flags: {},
		name: "Phantom Chute",
		shortDesc: "When this Pokemon switches out, its replacement is immune to hazards.",
	},
	masquerade: {
		onStart(pokemon) {
			let newType = '';
			switch (pokemon.item) {
			case 'hearthflamemask':
				newType = 'Fire';
				break;
			case 'wellspringmask':
				newType = 'Water';
				break;
			case 'cornerstonemask':
				newType = 'Rock';
				break;
			case 'stormbringermask':
				newType = 'Electric';
				break;
			case 'leek':
				newType = 'Grass';
				break;
			}
			this.add('-ability', pokemon, 'Masquerade');
			if (pokemon.addType(newType)) this.add('-start', pokemon, 'typeadd', newType);
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1 },
		name: "Masquerade",
		shortDesc: "Farfetch'd gains a secondary typing according to its held Ogerpon mask/Leek.",
	},
	debilitate: {
		shortDesc: "On switch-in, this Pokemon lowers the Special Attack of adjacent foes.",
		onStart(pokemon) {
			let activated = false;
			for (const target of pokemon.adjacentFoes()) {
				if (!activated) {
					this.add('-ability', pokemon, 'Debilitate', 'boost');
					activated = true;
				}
				if (target.volatiles['substitute']) {
					this.add('-immune', target);
				} else {
					this.boost({ spa: -1 }, target, pokemon, null, true);
				}
			}
		},
		name: "Debilitate",
	},
	metallize: {
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.type === 'Normal' && !noModifyType.includes(move.id) &&
				!(move.isZ && move.category !== 'Status') && !(move.name === 'Tera Blast' && pokemon.terastallized)) {
				move.type = 'Steel';
				move.typeChangerBoosted = this.effect;
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (move.typeChangerBoosted === this.effect) return this.chainModify([4915, 4096]);
		},
		flags: {},
		name: "Metallize",
		shortDesc: "This Pokemon's Normal-type moves become Steel type and have 1.2x power.",
	},
	maliciousroots: {
		onUpdate(pokemon) {
			for (const target of pokemon.adjacentFoes()) {
				if (target.status && !target.volatiles['leechseed']) {
					this.add('-ability', pokemon, 'Malicious Roots');
					target.addVolatile('leechseed', pokemon);
				}
			}
		},
		flags: {},
		name: "Malicious Roots",
		shortDesc: "While this Pokemon is active, statused Pokemon are inflicted with Leech Seed.",
	},

	// Slate 2
	alpinist: {
		onDamage(damage, target, source, effect) {
			if (effect?.id === 'stealthrock') {
				return false;
			}
		},
		onTryHit(target, source, move) {
			if (move.type === 'Rock' && !target.activeTurns) {
				this.add('-activate', target, 'ability: Alpinist');
				this.add('-immune', target, '[from] ability: Alpinist');
				return null;
			}
		},
		flags: { breakable: 1 },
		name: "Alpinist",
		shortDesc: "Immune to Stealth Rock damage and Rock type moves on switch-in.",
	},
	honeygather: {
		inherit: true,
		shortDesc: "Heals 1/16 max HP at the end of every turn.",
		onResidual(pokemon) {
			this.heal(pokemon.baseMaxhp / 16);
		},
	},
	poisonpuppeteer: {
		inherit: true,
		shortDesc: "If this Pokémon inflicts poison, it also confuses the target.",
		onAnyAfterSetStatus(status, target, source, effect) {
			if (source !== this.effectState.target || target === source || effect.effectType !== 'Move') return;
			if (status.id === 'psn' || status.id === 'tox') {
				target.addVolatile('confusion');
			}
		},
		name: "Poison Puppeteer",
	},
	seismicsensor: {
		onSwitchIn(pokemon) {
			pokemon.addVolatile('seismicsensor');
		},
		condition: {
			duration: 1,
			onTryHit(target, source, move) {
				if (target === source || move.type !== 'Ground' || move.category === 'Status' || move.hasBounced) {
					return;
				}
				this.add('-activate', target, 'ability: Seismic Sensor');
				const newMove = this.dex.getActiveMove(move.id);
				newMove.hasBounced = true;
				newMove.pranksterBoosted = false;
				this.actions.useMove(newMove, target, { target: source });
				return null;
			},
		},
		flags: {},
		name: "Seismic Sensor",
		shortDesc: "On switch: if targeted by a Ground-type attack, take no damage and use the move on the opponent.",
	},
	soothingpresence: {
		// I don't know how this works, but it does
		onStart(pokemon) {
			// @ts-expect-error
			const last = pokemon.side.lastSwitchedOut;
			if (last && last !== pokemon && !last.fainted && last.status) {
				const status = last.status;
				last.cureStatus();
				this.add('-activate', pokemon, 'ability: Soothing Presence');
				this.add('-curestatus', last, status, '[from] ability: Soothing Presence');
			}
			// @ts-expect-error
			pokemon.side.lastSwitchedOut = null;
		},
		onTryHit(target, source, move) {
			if (target !== this.effectState.target) return;
			if (move.type === 'Poison') {
				this.add('-immune', target, '[from] ability: Soothing Presence');
				return null;
			}
		},
		onSetStatus(status, target, source, effect) {
			if (target !== this.effectState.target) return;
			if (status.id === 'psn' || status.id === 'tox') {
				this.add('-immune', target, '[from] ability: Soothing Presence');
				return false;
			}
		},
		flags: {},
		name: "Soothing Presence",
		shortDesc: "Immune to poison. On switch-in, cures the status of the Pokemon it replaced.",
	},

	hoothootability: {
		onStart(pokemon) {
			for (const allMons of this.getAllActive()) {
				if (allMons.hasType('Normal') || !allMons.addType('Normal')) continue;
				this.add('-start', allMons, 'typeadd', 'Normal', '[from] ability: Hoothoot Ability');
			}
		},
		onUpdate(pokemon) {
			for (const allMons of this.getAllActive()) {
				if (allMons.hasType('Normal') || !allMons.addType('Normal')) continue;
				this.add('-start', allMons, 'typeadd', 'Normal', '[from] ability: Hoothoot Ability');
			}
		},
		onModifyTypePriority: 1,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'hiddenpower', 'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'struggle', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (!(move.isZ && move.category !== 'Status') &&
				// TODO: Figure out actual interaction
				(!noModifyType.includes(move.id) || this.activeMove?.isMax) && !(move.name === 'Tera Blast' && pokemon.terastallized)) {
				move.type = 'Normal';
				move.typeChangerBoosted = this.effect;
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (move.typeChangerBoosted === this.effect) return this.chainModify([4915, 4096]);
		},
		flags: {},
		name: "Hoothoot Ability",
		shortDesc: "Effects of Normalize + Adds the Normal type to all Pokemon on the field.",
	},
	mitosis: {
		onAfterMove(source, target, move) {
			if (!source.hp || !move.multihit) return;
			// this is a horrible implementation, but it works
			this.add('-ability', source, 'Mitosis');
			source.baseStoredStats.atk = Math.min(255, source.baseStoredStats.atk + 4);
			source.baseStoredStats.def = Math.min(255, source.baseStoredStats.def + 4);
			source.baseStoredStats.spa = Math.min(255, source.baseStoredStats.spa + 4);
			source.baseStoredStats.spd = Math.min(255, source.baseStoredStats.spd + 4);
			source.baseStoredStats.spe = Math.min(255, source.baseStoredStats.spe + 4);

			// Recalculate new stats
			source.storedStats.atk = source.baseStoredStats.atk;
			source.storedStats.def = source.baseStoredStats.def;
			source.storedStats.spa = source.baseStoredStats.spa;
			source.storedStats.spd = source.baseStoredStats.spd;
			source.storedStats.spe = source.baseStoredStats.spe;
			source.speed = source.storedStats.spe;

			// Apply new stats
			this.add('-setboost', source, 'basestats', 'atk', source.baseStoredStats.atk, '[silent]');
			this.add('-setboost', source, 'basestats', 'def', source.baseStoredStats.def, '[silent]');
			this.add('-setboost', source, 'basestats', 'spa', source.baseStoredStats.spa, '[silent]');
			this.add('-setboost', source, 'basestats', 'spd', source.baseStoredStats.spd, '[silent]');
			this.add('-setboost', source, 'basestats', 'spe', source.baseStoredStats.spe, '[silent]');
		},
		flags: {},
		name: "Mitosis",
		shortDesc: "When this Pokemon uses a multi-hit move, its stats increase by 4.",
	},
};
