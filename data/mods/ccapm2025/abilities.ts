export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	// Modified Abilities
	healer: {
		inherit: true,
		onResidual(pokemon) {
			for (const allyActive of pokemon.adjacentAllies()) {
				if (allyActive.status && this.randomChance(3, 10)) {
					this.add('-activate', pokemon, 'ability: Healer');
					(allyActive as any).cureStatus(false, pokemon);
				}
			}
		},
	},
	hydration: {
		inherit: true,
		onResidual(pokemon) {
			if (pokemon.status && ['raindance', 'primordialsea'].includes(pokemon.effectiveWeather())) {
				this.debug('hydration cure');
				this.add('-activate', pokemon, 'ability: Hydration');
				(pokemon as any).cureStatus?.(false, pokemon);
			}
		},
	},
	immunity: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.status === 'psn' || pokemon.status === 'tox') {
				this.add('-activate', pokemon, 'ability: Immunity');
				(pokemon as any).cureStatus(false, pokemon);
			}
		},
	},
	insomnia: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.status === 'slp') {
				this.add('-activate', pokemon, 'ability: Insomnia');
				(pokemon as any).cureStatus(false, pokemon);
			}
		},
	},
	limber: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.status === 'par') {
				this.add('-activate', pokemon, 'ability: Limber');
				(pokemon as any).cureStatus(false, pokemon);
			}
		},
	},
	magmaarmor: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.status === 'frz') {
				this.add('-activate', pokemon, 'ability: Magma Armor');
				(pokemon as any).cureStatus(false, pokemon);
			}
		},
	},
	naturalcure: {
		inherit: true,
		onSwitchOut(pokemon) {
			if (!pokemon.status) return;

			// if pokemon.showCure is undefined, it was skipped because its ability
			// is known
			if (pokemon.showCure === undefined) pokemon.showCure = true;

			if (pokemon.showCure) this.add('-curestatus', pokemon, pokemon.status, '[from] ability: Natural Cure');
			(pokemon as any).cureStatus(pokemon.showCure, pokemon);

			// only reset .showCure if it's false
			// (once you know a Pokemon has Natural Cure, its cures are always known)
			if (!pokemon.showCure) pokemon.showCure = undefined;
		},
	},
	pastelveil: {
		inherit: true,
		onStart(pokemon) {
			for (const ally of pokemon.alliesAndSelf()) {
				if (['psn', 'tox'].includes(ally.status)) {
					this.add('-activate', pokemon, 'ability: Pastel Veil');
					(ally as any).cureStatus(false, pokemon);
				}
			}
		},
		onUpdate(pokemon) {
			if (['psn', 'tox'].includes(pokemon.status)) {
				this.add('-activate', pokemon, 'ability: Pastel Veil');
				(pokemon as any).cureStatus(false, pokemon);
			}
		},
	},
	poisonheal: {
		inherit: true,
		onDamage(damage, target, source, effect) {
			if (effect.id === 'psn' || effect.id === 'tox') {
				const toHeal = Math.min(target.baseMaxhp / 8, target.baseMaxhp - target.hp);
				this.heal(toHeal);
				if (target.species.name === "Gliscor" && !this.ruleTable.tagRules.includes("+pokemontag:cap")) {
					if (!this.effectState.phCounter) this.effectState.phCounter = 0;
					this.effectState.phCounter += toHeal;
					if (this.effectState.phCounter >= target.baseMaxhp)
						target.formeChange('Gliscor-Sated', null, true);
				}
				return false;
			}
		},
	},
	shedskin: {
		inherit: true,
		onResidual(pokemon) {
			if (pokemon.hp && pokemon.status && this.randomChance(33, 100)) {
				this.debug('shed skin');
				this.add('-activate', pokemon, 'ability: Shed Skin');
				(pokemon as any).cureStatus(false, pokemon);
			}
		},
	},
	stench: {
		inherit: true,
		onModifyMove(move) {
			if (move.category !== "Status") {
				this.debug('Adding Stench flinch');
				if (!move.secondaries) move.secondaries = [];
				for (const secondary of move.secondaries) {
					if (secondary.volatileStatus === 'flinch') return;
				}
				if (!this.ruleTable.tagRules.includes("+pokemontag:cap")) {
					move.secondaries.push({
						chance: 20,
						volatileStatus: 'flinch',
						onHit(target, source, activeMove) {
							if (this.ruleTable.tagRules.includes("+pokemontag:cap")) return;
							if (source.species.name === 'Trubbish') {
								source.formeChange('Trubbish-Mega-Dragon', this.effect, true);
							}
						},
					});
				}
			}
		},
	},
	thermalexchange: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.status === 'brn') {
				this.add('-activate', pokemon, 'ability: Thermal Exchange');
				(pokemon as any).cureStatus(false, pokemon);
			}
		},
	},
	vitalspirit: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.status === 'slp') {
				this.add('-activate', pokemon, 'ability: Vital Spirit');
				(pokemon as any).cureStatus(false, pokemon);
			}
		},
	},
	waterbubble: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.status === 'brn') {
				this.add('-activate', pokemon, 'ability: Water Bubble');
				(pokemon as any).cureStatus(false, pokemon);
			}
		},
	},
	waterveil: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.status === 'brn') {
				this.add('-activate', pokemon, 'ability: Water Veil');
				(pokemon as any).cureStatus(false, pokemon);
			}
		},
	},
	wonderguard: {
		inherit: true,
		onTryHit(target, source, move) {
			if (target === source || move.category === 'Status' || move.id === 'struggle') return;
			if (move.id === 'skydrop' && !source.volatiles['skydrop']) return;
			this.debug('Wonder Guard immunity: ' + move.id);
			if (target.runEffectiveness(move) <= 0 || !target.runImmunity(move)) {
				if (move.smartTarget) {
					move.smartTarget = false;
				} else {
					this.add('-immune', target, '[from] ability: Wonder Guard');
					if (!this.ruleTable.tagRules.includes("+pokemontag:cap") && target.baseSpecies.name === 'Shedinja') {
						target.formeChange('Shedinja-Escaped', null, true);
						this.add('-activate', target, 'ability: Wonder Guard');
					}
				}
				return null;
			}
		},
	},

	// New Abilities
	geminfusion: {
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			const item = pokemon.getItem();
			if (move.type === 'Rock' && item?.isGem) {
				move.type = item.name.split(' ')[0];
			}
		},
		onUpdate(pokemon) {
			if (!pokemon.getItem()?.isGem) return;

			const type = pokemon.getItem().name.split(' ')[0];
			// map Rock to the new type, go through Set to delete duplicate entries
			const newTypes = [...new Set(pokemon.getTypes().map(t => t === 'Rock' ? type : t))];

			if (pokemon.getTypes().join() === newTypes.join() || !pokemon.setType(newTypes)) return;
			this.add('-start', pokemon, 'typechange', newTypes.join('/'), '[from] ability: Gem Infusion');
		},
		flags: {},
		name: "Gem Infusion",
		rating: 4,
		num: 1001,
	},
	embodyaspectpixiedust: {
		onStart(pokemon) {
			if (pokemon.baseSpecies.name === 'Ogerpon-Pixiedust-Tera' && pokemon.terastallized &&
				!this.effectState.embodied) {
				this.effectState.embodied = true;
				this.boost({ spd: 1 }, pokemon);
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1 },
		name: "Embody Aspect (Pixiedust)",
		rating: 3.5,
	},
	stancechange: {
		onModifyMovePriority: 1,
		onModifyMove(move, attacker, defender) {
			if (attacker.species.baseSpecies !== 'Aegislash' || attacker.transformed) return;
			if (move.category === 'Status' && move.id !== 'kingsshield') return;
			const targetForme = (move.id === 'soulboundslash' ? 'Aegislash-Soulbound' :
				(move.id === 'kingsshield' ? 'Aegislash' : 'Aegislash-Blade'));
			if (attacker.species.name !== targetForme) attacker.formeChange(targetForme);
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
		name: "Stance Change",
		rating: 4,
		num: 176,
	},
	stackshift: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				this.debug('Stack Shift boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				this.debug('Stack Shift boost');
				return this.chainModify(1.5);
			}
		},
		onModifyMovePriority: 1,
		onModifyMove(move, attacker, defender) {
			if (attacker.species.baseSpecies !== 'Stakataka' || attacker.transformed) return;
			if (move.category === 'Status' && move.id !== 'stackshield') return;
			const targetForme = (move.id === 'stackshield' ? 'Stakataka' : 'Stakataka-Missile');
			if (attacker.species.name !== targetForme) attacker.formeChange(targetForme);
			// attacker.setAbility('interdimensionalmissile', attacker);
		},
		// airborneness implemented in scripts.ts:Pokemon#isGrounded
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
		name: "Stack Shift",
		rating: 4,
		shortDesc: "Stakataka: Levitate + Fire moves 1.5x pow. Missile before attacks, Base before Stack Shield.",
	},
	interdimensionalmissile: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				this.debug('Interdimensional Missile boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				this.debug('Interdimensional Missile boost');
				return this.chainModify(1.5);
			}
		},
		onModifyMovePriority: 1,
		onModifyMove(move, attacker, defender) {
			if (attacker.species.baseSpecies !== 'Stakataka' || attacker.transformed) return;
			if (move.category === 'Status' && move.id !== 'stackshield') return;
			const targetForme = (move.id === 'stackshield' ? 'Stakataka' : 'Stakataka-Missile');
			if (attacker.species.name !== targetForme) attacker.formeChange(targetForme);
			attacker.setAbility('stackchange', attacker);
		},
		// airborneness implemented in scripts.ts:Pokemon#isGrounded
		flags: { breakable: 1, failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
		name: "Interdimensional Missile",
		rating: 3.5,
		shortDesc: "Effects of Levitate + Stack Shift + User's Fire moves deal 1.5x damage.",
	},
	wither: {
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Water') {
				if (!this.heal(target.baseMaxhp / 4)) {
					this.add('-immune', target, '[from] ability: Wither');
				}
				return null;
			}
		},
		onResidualOrder: 6,
		onResidual(pokemon) {
			this.damage(pokemon.baseMaxhp / 16);
		},
		flags: { breakable: 1 },
		name: "Wither",
		rating: 1.5,
		shortDesc: "User loses 1/16 of its max HP per turn. Heals TBD% HP when hit by Water.",
	},
	toughwings: {
		onModifyPriority(priority, pokemon, target, move) {
			if (move?.type === 'Flying') return priority + 1;
		},
		onBasePowerPriority: 21,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['contact']) {
				return this.chainModify([5325, 4096]);
			}
		},
		flags: {},
		name: "Tough Wings",
		rating: 5,
		shortDesc: "Effects Tough Claws + Gale Wings (Gen 6).",
	},
	victoryfinale: {
		onAnyModifyAccuracyPriority: -1,
		onAnyModifyAccuracy(accuracy, target, source) {
			if (source.isAlly(this.effectState.target) && typeof accuracy === 'number') {
				return this.chainModify([5325, 4096]);
			}
		},
		flags: {},
		name: "Victory Finale",
		rating: 3.5,
		shortDesc: "This Pokemon's and its allies' moves have their accuracy multiplied by 1.3.",
	},
	supercritical: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Water') {
				this.debug('Supercritical boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Water') {
				this.debug('Supercritical boost');
				return this.chainModify(1.5);
			}
		},
		onModifyMovePriority: -1,
		onModifyMove(move) {
			if (move.category !== "Status") {
				this.debug('Adding Supercritical suppress');
				if (!move.secondaries) move.secondaries = [];
				move.secondaries.push({
					chance: 100,
					volatileStatus: 'gastroacid',
				});
			}
		},
		onTryHit(pokemon, target, move) {
			if (move.type === 'Water') {
				this.add('-immune', pokemon, '[from] ability: Supercritical');
				return null;
			}
		},
		flags: { breakable: 1 },
		name: "Supercritical",
		rating: 3,
		shortDesc: "User's Water moves have 1.5x power and suppress the target's ability; Water immunity.",
	},
	bitterness: {
		onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			if (pokemon.baseSpecies.name !== 'Weavile-Frost') return;
			if (pokemon.activeTurns) {
				this.boost({ atk: 1 });
			}
		},
		flags: {},
		name: "Bitterness",
		rating: 5,
		shortDesc: "Weavile-Frost: Attack is raised by 1 stage at the end of each full turn it has been on the field.",
	},
	emergencycannon: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.flags['bullet']) {
				this.debug('Emergency Cannon boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.flags['bullet']) {
				this.debug('Emergency Cannon boost');
				return this.chainModify(1.5);
			}
		},
		onModifyMove(move) {
			if (move.flags['bullet']) {
				move.category = 'Physical';
				move.accuracy = true;
			}
		},
		flags: {},
		name: "Emergency Cannon",
		rating: 3.5,
		shortDesc: "User's bullet moves are physical, can't miss, and have 1.5x power.",
	},
	martialize: {
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.type === 'Normal' && (!noModifyType.includes(move.id) || this.activeMove?.isMax) &&
				!(move.isZ && move.category !== 'Status') && !(move.name === 'Tera Blast' && pokemon.terastallized)) {
				move.type = 'Fighting';
				move.typeChangerBoosted = this.effect;
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (move.typeChangerBoosted === this.effect) return this.chainModify([4915, 4096]);
		},
		flags: {},
		name: "Martialize",
		rating: 4,
		shortDesc: "This Pokemon's Normal-type moves become Fighting-type moves and have their power multiplied by 1.2.",
	},
	intoxicate: {
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.type === 'Normal' && (!noModifyType.includes(move.id) || this.activeMove?.isMax) &&
				!(move.isZ && move.category !== 'Status') && !(move.name === 'Tera Blast' && pokemon.terastallized)) {
				move.type = 'Poison';
				move.typeChangerBoosted = this.effect;
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (move.typeChangerBoosted === this.effect) return this.chainModify([4915, 4096]);
		},
		flags: {},
		name: "Intoxicate",
		rating: 4,
		shortDesc: "This Pokemon's Normal-type moves become Poison-type moves and have their power multiplied by 1.2.",
	},
	shroomndoom: {
		onStart(pokemon) {
			pokemon.addVolatile('torment');
		},
		onModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).typeMod <= 0) {
				this.debug('Shroom n Doom boost');
				return this.chainModify(1.5);
			}
		},
		flags: {},
		name: "Shroom n' Doom",
		rating: 2,
		shortDesc: "User is under the effects of Torment. Non-SE moves deal 1.5x damage.",
	},
	focusedfire: {
		onSourceModifyAccuracyPriority: -1,
		onSourceModifyAccuracy(accuracy) {
			this.debug('focusedfire - enhancing accuracy');
			return this.chainModify(10, 1);
		},
		onModifyPriority(priority, pokemon, target, move) {
			if (move) return priority - 1;
		},
		onModifyCritRatio(critRatio, source, target) {
			return 5;
		},
		flags: {},
		name: "Focused Fire",
		rating: 3,
		shortDesc: "User's attacks have -1 priority but can't miss and always crit.",
	},
	guidedmissiles: {
		onStart(pokemon) {
			pokemon.addVolatile('focusenergy');
		},
		onModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).crit) {
				this.debug('Sniper boost');
				return this.chainModify(1.5);
			}
		},
		flags: {},
		name: "Guided Missiles",
		rating: 5,
		shortDesc: "Effects of Sniper + Uses Focus Energy on switch-in.",
	},
	rampage: {
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (attacker.hp <= attacker.maxhp / 2) {
				this.debug('Rampage boost');
				return this.chainModify([5325, 4096]);
			} else if (attacker.hp <= attacker.maxhp / 3) {
				this.debug('Rampage boost');
				return this.chainModify([6799, 4096]);
			}
		},
		onModifySpe(spe, pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				this.debug('Rampage boost');
				return this.chainModify([5325, 4096]);
			} else if (pokemon.hp <= pokemon.maxhp / 3) {
				this.debug('Rampage boost');
				return this.chainModify([6799, 4096]);
			}
		},
		flags: {},
		name: "Rampage",
		rating: 3,
		shortDesc: "1.3x SpA & Spe when below 50% max HP, 1.66x SpA & Spe when below 33% max HP.",
	},
	spectralize: {
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.type === 'Normal' && (!noModifyType.includes(move.id) || this.activeMove?.isMax) &&
				!(move.isZ && move.category !== 'Status') && !(move.name === 'Tera Blast' && pokemon.terastallized)) {
				move.type = 'Ghost';
				move.typeChangerBoosted = this.effect;
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (move.typeChangerBoosted === this.effect) return this.chainModify([4915, 4096]);
		},
		flags: {},
		name: "Spectralize",
		rating: 4,
		shortDesc: "This Pokemon's Normal-type moves become Ghost-type moves and have their power multiplied by 1.2.",
	},
	overcharged: {
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Electric') {
				if (!this.heal(target.baseMaxhp / 4)) {
					this.add('-immune', target, '[from] ability: Overcharged');
				}
				return null;
			}
		},
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Electric') {
				this.debug('Overcharged boost');
				return this.chainModify([5325, 4096]);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Electric') {
				this.debug('Overcharged boost');
				return this.chainModify([5325, 4096]);
			}
		},
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) {
			target.addVolatile('charge');
		},
		flags: { breakable: 1 },
		name: "Overcharged",
		rating: 3.5,
		shortDesc: "Effects of Volt Absorb + Electromorphosis + Transistor.",
	},
	aurapartner: {
		onPrepareHit(source, target, move) {
			if (move.category === 'Status' || move.multihit || move.flags['noparentalbond'] || move.flags['charge'] ||
				move.flags['futuremove'] || move.spreadHit || move.isZ || move.isMax) return;
			move.multihit = 2;
			move.multihitType = 'parentalbond';
		},
		onSourceModifySecondaries(secondaries, target, source, move) {
			if (move.multihitType === 'parentalbond' && move.id === 'secretpower' && move.hit < 2) {
				// hack to prevent accidentally suppressing King's Rock/Razor Fang
				return secondaries.filter(effect => effect.volatileStatus === 'flinch');
			}
		},
		flags: {},
		name: "Aura Partner",
		rating: 4.5,
		shortDesc: "This Pokemon's damaging moves hit twice. The second hit has its damage halved and is Ghost-type.",
	},
	backbeat: {
		onBeforeMovePriority: 9,
		onBeforeMove(pokemon) {
			if (!pokemon.volatiles['backbeat']) {
				pokemon.addVolatile('backbeat');
			} else if (pokemon.volatiles['backbeat']) {
				pokemon.removeVolatile('backbeat');
			}
		},
		condition: {
			onStart(pokemon) {
				this.add('-activate', pokemon, 'ability: Backbeat');
				this.add('-start', pokemon, 'Backbeat');
			},
			onModifyDamage(damage, source, target, move) {
				return this.chainModify(1.5);
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Backbeat');
			},
		},
		flags: {},
		name: "Backbeat",
		rating: 3,
		shortDesc: "This Pokemon's attacks deal 1.5x damage every other turn.",
	},
	volcanicpalette: {
		onModifySTAB(stab, source, target, move) {
			if (move.forceSTAB || source.hasType(move.type)) {
				if (stab === 2) {
					return 2.25;
				}
				return 2;
			}
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).typeMod > 0) {
				this.debug('Volcanic Palette neutralize');
				return this.chainModify(0.75);
			}
		},
		flags: { breakable: 1 },
		name: "Volcanic Palette",
		rating: 4,
		shortDesc: "Effects of Solid Rock + Adaptability.",
	},
	wildpalette: {
		onModifySTAB(stab, source, target, move) {
			if (move.forceSTAB || source.hasType(move.type)) {
				if (stab === 2) {
					return 2.25;
				}
				return 2;
			}
		},
		onAllyTryBoost(boost, target, source, effect) {
			if ((source && target === source) || !target.hasType('Grass')) return;
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
				this.add('-block', target, 'ability: Wild Palette', `[of] ${effectHolder}`);
			}
		},
		onAllySetStatus(status, target, source, effect) {
			if (target.hasType('Grass') && source && target !== source && effect && effect.id !== 'yawn') {
				this.debug('interrupting setStatus with Flower Veil');
				if (effect.name === 'Synchronize' || (effect.effectType === 'Move' && !effect.secondaries)) {
					const effectHolder = this.effectState.target;
					this.add('-block', target, 'ability: Wild Palette', `[of] ${effectHolder}`);
				}
				return null;
			}
		},
		onAllyTryAddVolatile(status, target) {
			if (target.hasType('Grass') && status.id === 'yawn') {
				this.debug('Flower Veil blocking yawn');
				const effectHolder = this.effectState.target;
				this.add('-block', target, 'ability: Wild Palette', `[of] ${effectHolder}`);
				return null;
			}
		},
		flags: { breakable: 1 },
		name: "Wild Palette",
		rating: 4,
		shortDesc: "Effects of Flower Veil + Adaptability.",
	},
	luminiouspalette: {
		onModifySTAB(stab, source, target, move) {
			if (move.forceSTAB || source.hasType(move.type)) {
				if (stab === 2) {
					return 2.25;
				}
				return 2;
			}
		},
		onFoeTryMove(target, source, move) {
			const targetAllExceptions = ['perishsong', 'flowershield', 'rototiller'];
			if (move.target === 'foeSide' || (move.target === 'all' && !targetAllExceptions.includes(move.id))) {
				return;
			}
			const dazzlingHolder = this.effectState.target;
			if ((source.isAlly(dazzlingHolder) || move.target === 'all') && move.priority > 0.1) {
				this.attrLastMove('[still]');
				this.add('cant', dazzlingHolder, 'ability: Luminious Palette', move, `[of] ${target}`);
				return false;
			}
		},
		flags: { breakable: 1 },
		name: "Luminious Palette",
		rating: 4,
		shortDesc: "Effects of Dazzling + Adaptability.",
	},
	storybookpalette: {
		onModifySTAB(stab, source, target, move) {
			if (move.forceSTAB || source.hasType(move.type)) {
				if (stab === 2) {
					return 2.25;
				}
				return 2;
			}
		},
		onDamage(damage, target, source, effect) {
			if (effect.effectType !== 'Move') {
				if (effect.effectType === 'Ability') this.add('-activate', source, 'ability: ' + effect.name);
				return false;
			}
		},
		flags: {},
		name: "Storybook Palette",
		rating: 4,
		shortDesc: "Effects of Magic Guard + Adaptability.",
	},
	phasicpalette: {
		onModifySTAB(stab, source, target, move) {
			if (move.forceSTAB || source.hasType(move.type)) {
				if (stab === 2) {
					return 2.25;
				}
				return 2;
			}
		},
		onDamagingHit(damage, target, source, move) {
			if (move.type === 'Fire') {
				this.boost({ atk: 1 });
			}
		},
		onUpdate(pokemon) {
			if (pokemon.status === 'brn') {
				this.add('-activate', pokemon, 'ability: Phasic Palette');
				pokemon.cureStatus();
			}
		},
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'brn') return;
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Phasic Palette');
			}
			return false;
		},
		flags: { breakable: 1 },
		name: "Phasic Palette",
		rating: 4,
		shortDesc: "Effects of Thermal Exchange + Adaptability.",
	},
	ruffianpalette: {
		onModifySTAB(stab, source, target, move) {
			if (move.forceSTAB || source.hasType(move.type)) {
				if (stab === 2) {
					return 2.25;
				}
				return 2;
			}
		},
		onSourceAfterFaint(length, target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				this.boost({ atk: length }, source);
			}
		},
		flags: {},
		name: "Ruffian Palette",
		rating: 4,
		shortDesc: "Effects of Moxie + Adaptability.",
	},
	evileye: {
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Evil Eye');
		},
		onDeductPP(target, source) {
			if (target.isAlly(source)) return;
			return 2;
		},
		flags: {},
		name: "Evil Eye",
		rating: 4.5,
		shortDesc: "If this Pokemon is the target of a foe's move, that moves loses 2 additional PP.",
	},
	aeoliandrift: {
		onStart(source) {
			source.side.addSideCondition('tailwind');
		},
		flags: {},
		name: "Aeolian Drift",
		rating: 5,
		shortDesc: "On switch-in, this Pokemon summons Tailwind.",
	},
	darkmagic: {
		onDamagingHit(damage, target, source, move) {
			if (source.volatiles['disable']) return;
			if (!move.isMax && !move.flags['futuremove'] && move.id !== 'struggle') {
				if (this.randomChance(3, 10)) {
					source.addVolatile('disable', this.effectState.target);
				}
			}
		},
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Ghost' || move.type === 'Dragon') {
				this.debug('Dark Magic boost');
				return this.chainModify([5325, 4096]);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Ghost' || move.type === 'Dragon') {
				this.debug('Dark Magic boost');
				return this.chainModify([5325, 4096]);
			}
		},
		flags: {},
		name: "Dark Magic",
		rating: 4,
		shortDesc: "Effects of Cursed Body + User's Ghost and Dragon moves deal 1.3x damage.",
	},
	burnout: {
		onStart(pokemon) {
			pokemon.addVolatile('burnout');
		},
		condition: {
			duration: 3,
			onStart(pokemon) {
				this.add('-start', pokemon, 'Burnout');
			},
			onModifyAtkPriority: 5,
			onModifyAtk(atk, attacker, defender, move) {
				this.debug('Burnout boost');
				return this.chainModify(1.5);
			},
			onModifySpAPriority: 5,
			onModifySpA(atk, attacker, defender, move) {
				this.debug('Burnout boost');
				return this.chainModify(1.5);
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Burnout');
				this.add('-ability', pokemon, 'Burnout');
				pokemon.formeChange('Blaziken');
				pokemon.setAbility('toughclaws', pokemon);
				this.add('-activate', pokemon, 'ability: Tough Claws');
			},
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
		name: "Burnout",
		rating: 3.5,
		shortDesc: "Blaziken-Wildfire: 1.5x Atk & SpA. Reverts to base Blaziken after 2 turns.",
	},
	moltencore: {
		onSwitchInPriority: 2,
		onSwitchIn(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Magcargo') return;
			const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
			const activeHazards = sideConditions.filter(hazard => !pokemon.side.sideConditions[hazard]);
			if (activeHazards.length > 0) {
				const randomHazard = activeHazards[this.random(activeHazards.length)];
				this.add('-sideend', pokemon.side, this.dex.conditions.get(randomHazard).name, '[from] move: Rapid Spin', `[of] ${pokemon}`);
				// This should probably be one layer of (Toxic) Spikes. Not implemented for now
			}
			if (pokemon.species.forme !== 'Fractured') {
				this.add('-activate', pokemon, 'ability: Molten Core');
				pokemon.formeChange('Magcargo-Fractured', this.effect, false);
			}
		},
		name: "Molten Core",
		rating: 3.5,
		num: 307,
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
		shortDesc: "Magcargo: On switch-in, absorbs 1 layer of hazards and transforms; Hazard immunity.",
	},
	growingbitterness: {
		onStart(pokemon) {
			if (!this.effectState.counter) {
				this.add('-start', pokemon, 'ability: Growing Bitterness');
				this.effectState.counter = 8;
			}
		},
		onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			if (pokemon.activeTurns && this.effectState.counter) {
				this.effectState.counter--;
				if (!this.effectState.counter) {
					this.add('-end', pokemon, 'Growing Bitterness');
					delete this.effectState.counter;
					pokemon.formeChange('Weavile-Frost', null, true);
				}
			}
		},
		flags: {},
		name: "Growing Bitterness",
		rating: 0,
		num: 1112,
		shortDesc: "Weavile: Transforms into Weavile-Frost after being active for 8 turns.",
	},
	heartofcold: {
		onStart(pokemon) {
			this.add('-message', `${pokemon.species.name}'s heart has grown cold!`);
		},
		onModifyDefPriority: 6,
		onModifyDef(pokemon) {
			if (/* pokemon.hasType('Ice') && */ !this.field.isWeather(['hail', 'snowscape'])) {
				return this.chainModify(1.5);
			}
		},
		flags: { breakable: 1 },
		name: "Heart of Cold",
		rating: 0,
		shortDesc: "This Pokemon's moves and stats act as if snow is active.",
	},
	headon: {
		onDamage(damage, target, source, effect) {
			if (effect.effectType !== 'Move') {
				if (effect.effectType === 'Ability') this.add('-activate', source, 'ability: ' + effect.name);
				return false;
			}
		},
		onModifyMove(move) {
			delete move.flags['contact'];
		},
		onModifyAccuracyPriority: -1,
		onModifyAccuracy(accuracy) {
			if (this.effectState.headOn) return;
			this.effectState.headOn = true;
			this.debug('Head-On - decreasing accuracy');
			return 0;
		},
		flags: {},
		name: "Head-On",
		rating: 5,
		shortDesc: "Effects of Magic Guard and Long Reach. The first move to target this Pokemon always misses.",
	},
	// advent
	snowface: {
		onSwitchInPriority: -2,
		onStart(pokemon) {
			if (this.field.isWeather(['hail', 'snowscape']) && pokemon.species.id === 'eiscuesnowconenosnow') {
				this.add('-activate', pokemon, 'ability: Snow Face');
				this.effectState.busted = false;
				pokemon.formeChange('Eiscue-Snowcone', this.effect, true);
			}
		},
		onDamagePriority: 1,
		onDamage(damage, target, source, effect) {
			if (effect?.effectType === 'Move' && effect.category === 'Special' && target.species.id === 'eiscuesnowcone') {
				this.add('-activate', target, 'ability: Snow Face');
				this.effectState.busted = true;
				return 0;
			}
		},
		onCriticalHit(target, type, move) {
			if (!target) return;
			if (move.category !== 'Special' || target.species.id !== 'eiscuesnowcone') return;
			if (target.volatiles['substitute'] && !(move.flags['bypasssub'] || move.infiltrates)) return;
			if (!target.runImmunity(move)) return;
			return false;
		},
		onEffectiveness(typeMod, target, type, move) {
			if (!target) return;
			if (move.category !== 'Special' || target.species.id !== 'eiscuesnowcone') return;
			const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
			if (hitSub) return;
			if (!target.runImmunity(move)) return;
			return 0;
		},
		onUpdate(pokemon) {
			if (pokemon.species.id === 'eiscuesnowcone' && this.effectState.busted) {
				pokemon.formeChange('Eiscue-Snowcone-Nosnow', this.effect, true);
			}
		},
		onWeatherChange(pokemon, source, sourceEffect) {
			// snow/hail resuming because Cloud Nine/Air Lock ended does not trigger Ice Face
			if ((sourceEffect as Ability)?.suppressWeather) return;
			if (!pokemon.hp) return;
			if (this.field.isWeather(['hail', 'snowscape']) && pokemon.species.id === 'eiscuesnowconenosnow') {
				this.add('-activate', pokemon, 'ability: Snow Face');
				this.effectState.busted = false;
				pokemon.formeChange('Eiscue-Snowcone', this.effect, true);
			}
		},
		flags: {
			failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1,
			breakable: 1, notransform: 1,
		},
		name: "Snow Face",
		rating: 3,
		shortDesc: "Eiscue-Snowcone: The first special hit it takes deals 0 damage. Effect is restored in Snow.",
	},
	gingerstream: {
		onStart(source) {
			this.field.setWeather('gingerstorm');
		},
		flags: {},
		name: "Ginger Stream",
		rating: 4,
		shortDesc: "On switch-in, this Pokemon summons Gingerstorm.",
	},
	littlesoldier: {
		onModifyDamage(damage, source, target, move) {
			if (target.baseSpecies.bst > source.baseSpecies.bst) {
				this.debug('Little Soldier boost');
				return this.chainModify(1.3);
			}
		},
		flags: {},
		name: "Little Soldier",
		rating: 2,
		shortDesc: "This Pokemon's attacks do 1.3x damage to foes with a higher BST.",
	},
	chillingvoice: {
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			if (move.flags['sound'] && !pokemon.volatiles['dynamax']) { // hardcode
				move.type = 'Ice';
			}
		},
		flags: {},
		name: "Chilling Voice",
		rating: 1.5,
		shortDesc: "This Pokemon's sound moves become Ice-type.",
	},
	equalshare: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			const screens = [
				'lightscreen', 'reflect', 'auroraveil',
			];
			for (const screen of screens) {
				if (defender.side.getSideCondition(screen)) {
					this.debug('Equal Share boost');
					return this.chainModify(1.5);
				}
			}
			const yourSide = attacker.side;
			let allLayers = 0;
			if (yourSide.getSideCondition('stealthrock')) allLayers++;
			if (yourSide.getSideCondition('bristles')) allLayers++;
			if (yourSide.getSideCondition('stickyweb')) allLayers++;
			if (yourSide.sideConditions['spikes']) {
				allLayers += yourSide.sideConditions['spikes'].layers;
			}
			if (yourSide.sideConditions['toxicspikes']) {
				allLayers += yourSide.sideConditions['toxicspikes'].layers;
			}
			const theLayers = Math.min(allLayers, 5);
			const powMod = [4096, 4506, 4915, 5325, 5734, 6144];
			return this.chainModify([powMod[theLayers], 4096]);
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			const screens = [
				'lightscreen', 'reflect', 'auroraveil',
			];
			for (const screen of screens) {
				if (defender.side.getSideCondition(screen)) {
					this.debug('Equal Share boost');
					return this.chainModify(1.5);
				}
			}
			const yourSide = attacker.side;
			let allLayers = 0;
			if (yourSide.getSideCondition('stealthrock')) allLayers++;
			if (yourSide.getSideCondition('bristles')) allLayers++;
			if (yourSide.getSideCondition('stickyweb')) allLayers++;
			if (yourSide.sideConditions['spikes']) {
				allLayers += yourSide.sideConditions['spikes'].layers;
			}
			if (yourSide.sideConditions['toxicspikes']) {
				allLayers += yourSide.sideConditions['toxicspikes'].layers;
			}
			const theLayers = Math.min(allLayers, 5);
			const powMod = [4096, 4506, 4915, 5325, 5734, 6144];
			return this.chainModify([powMod[theLayers], 4096]);
		},
		flags: {},
		name: "Equal Share",
		rating: 2,
		shortDesc: "10% boost to offensive stats for each layer of hazards on user's side. 50% boost if the foe has screens.",
	},
	swindling: {
		// placeholder
		flags: {},
		name: "Swindling",
		rating: 1.5,
		shortDesc: "This Pokemon steals the items from Pokemon holding the same item.",
	},
	sweetfreezing: {
		onResidualOrder: 29,
		onResidual(pokemon) {
			this.heal(pokemon.baseMaxhp / 16);
		},
		flags: {},
		name: "Sweet Freezing",
		rating: 1,
		shortDesc: "User heals 1/16th of its max HP each turn.",
	},
	psychicsimmer: {
		onStart(source) {
			this.field.setTerrain('psychicterrain');
		},
		onSourceDamagingHit(damage, target, source, move) {
			// Despite not being a secondary, Shield Dust / Covert Cloak block Poison Touch's effect
			if (target.hasAbility('shielddust') || target.hasItem('covertcloak')) return;
			if (move.type === 'Psychic' && this.field.isTerrain('psychicterrain') && source.isGrounded()) {
				if (this.randomChance(2, 10)) {
					target.trySetStatus('brn', source);
				}
			}
		},
		flags: {},
		name: "Psychic Simmer",
		rating: 4,
		shortDesc: "Summons Psychic Terrain. Psychic moves in Psychic Terrain have a 20% burn chance.",
	},
	fragiliteshield: {
		onDamagingHit(damage, target, source, move) {
			this.field.setTerrain('mistyterrain');
		},
		flags: {},
		name: "Fragilite\u0301 Shield",
		rating: 2.5,
		shortDesc: "When this Pokemon is hit by an attack, the effect of Misty Terrain begins.",
	},
	bristle: {
		onDamage(damage, target, source, effect) {
			if (
				effect.effectType === "Move" &&
				!effect.multihit &&
				!(effect.hasSheerForce && source.hasAbility('sheerforce') &&
					effect.category === 'Physical')
			) {
				this.effectState.checkedBristle = false;
			} else {
				this.effectState.checkedBristle = true;
			}
		},
		onTryEatItem(item) {
			const healingItems = [
				'aguavberry', 'enigmaberry', 'figyberry', 'iapapaberry', 'magoberry', 'sitrusberry', 'wikiberry', 'oranberry', 'berryjuice',
			];
			if (healingItems.includes(item.id)) {
				return this.effectState.checkedBristle;
			}
			return true;
		},
		onAfterMoveSecondary(target, source, move) {
			this.effectState.checkedBristle = true;
			if (!source || source === target || !target.hp || !move.totalDamage) return;
			const lastAttackedBy = target.getLastAttackedBy();
			if (!lastAttackedBy) return;
			const damage = move.multihit && !move.smartTarget ? move.totalDamage : lastAttackedBy.damage;
			if (target.hp <= target.maxhp / 2 && target.hp + damage > target.maxhp / 2) {
				this.add('-activate', target, 'ability: Bristle');
				target.side.addSideCondition('bristles', target);
			}
		},
		flags: {},
		name: "Bristle",
		rating: 2,
		shortDesc: "If this Pokemon is brought below 50% HP by a physical move, sets up Bristles.",
	},
	angehalo: {
		gen: 9,
		shortDesc: "Foe have 1/16 (1/8 for Megas) of their max HP drained every turn.",
		onResidualOrder: 5,
		onResidualSubOrder: 4,
		onResidual(pokemon) {
			if (!pokemon.hp) return;
			const megaFoes = [];
			for (const target of pokemon.foes()) {
				if (target.baseSpecies.isMega) megaFoes.push(target);
			}
			if (megaFoes.length) {
				for (const target of megaFoes) {
					this.damage(target.baseMaxhp / 8, target, pokemon);
					this.heal(target.baseMaxhp / 8);
				}
			} else {
				for (const target of pokemon.foes()) {
					this.damage(target.baseMaxhp / 16, target, pokemon);
					this.heal(target.baseMaxhp / 16);
				}
			}
		},
		name: "Ange Halo",
	},
	shatteredreflection: {
		// placeholder, might have to be hardcoded into type changing effects?
		flags: {},
		name: "Shattered Reflection",
		rating: 1.5,
		shortDesc: "When this Pokemon's type is changed, imprisons foe and becomes center of attention.",
	},
	entrapment: {
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Entrapment');
			for (const target of pokemon.adjacentFoes()) {
				target.side.addSideCondition('spikes', target);
			}
		},
		flags: {},
		name: "Entrapment",
		rating: 5,
		shortDesc: "On switch-in, sets a layer of Spikes on the foe's side of the field.",
	},
	giftstealer: {
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
						pokemon.item = yourItem.id; // bypass setItem so we don't break choicelock or anything
						continue;
					}
					this.add('-item', source, yourItem, '[from] ability: Gift Stealer', `[of] ${pokemon}`);
					return;
				}
			}
		},
		onResidualOrder: 5,
		onResidualSubOrder: 4,
		onResidual(pokemon) {
			if (!pokemon.hp) return;
			this.actions.useMove("Fling", pokemon);
		},
		flags: {},
		name: "Gift Stealer",
		rating: 3,
		shortDesc: "Effects of Magician. This Pokemon uses Fling at the end of every turn.",
	},
	heartcage: {
		// placeholder
		/* const heartMoves = [
			'heartstamp', 'heartswap', 'takeheart',
		]; */
		onModifyDamage(damage, source, target, move) {
			if (move.id === 'heartstamp') {
				this.debug('Heart Cage boost');
				return this.chainModify(1.5);
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
		name: "Heart Cage",
		rating: 1.5,
		shortDesc: "Grincheart: Using 3 Heart moves changes for the Grincheart-Grown. Heart Stamp has 1.5x power.",
	},
	cashinfusion: {
		// placeholder, would have to add the in-game formula for this to pay day & make it rain
		flags: {},
		name: "Cash Infusion",
		rating: 1.5,
		shortDesc: "This Pokémon receives a damage boost equal to 2% of the Pokémon Dollars scattered throughout a battle.",
	},
	crystalize: {
		onAfterMoveSecondarySelf(source, target, move) {
			if (this.queue.willMove(target)) {
				source.addVolatile('crystalize');
			}
		},
		condition: {
			noCopy: true, // doesn't get copied by Baton Pass
			duration: 1,
			onStart(target) {
				this.add('-start', target, 'ability: Crystalize');
				this.effectState.damage = 0;
			},
			onDamagingHitOrder: 1,
			onDamagingHit(damage, target, source, move) {
				this.effectState.damage = 1.5 * damage;
				this.damage(this.effectState.damage, source, target);
			},
			onEnd(target) {
				this.add('-end', target, 'ability: Crystalize', '[silent]');
			},
		},
		flags: {},
		name: "Crystalize",
		rating: 3,
		shortDesc: "If this Pokémon uses a Rock-type move before the foe attacks, return 1.5x damage received to attackers for the rest of this turn.",
	},
	bellchoir: {
		onAfterMoveSecondarySelf(source, target, move) {
			if (move.flags['sound']) {
				this.field.setTerrain('mistyterrain');
			}
		},
		flags: {},
		name: "Bell Choir",
		rating: 3,
		shortDesc: "Summons Misty Terrain after using a sound move.",
	},
	socialretreat: {
		// placeholder
		flags: {},
		name: "Social Retreat",
		rating: 3,
		shortDesc: "Changes this Pokemon's secondary type to what best matches up against incoming moves.",
	},
	tryingmybest: {
		onSwitchIn(pokemon) {
			if (pokemon.side.pokemonLeft === 1) {
				if (pokemon.species.name === 'Luvdisc') {
					pokemon.formeChange('Luvdisc-Heartbreak', this.effect, true);
				}
			} else {
				const mon = pokemon as any;
				if (mon.timesSwitchedIn) mon.timesSwitchedIn++;
				else mon.timesSwitchedIn = 1;
			}
		},
		flags: {},
		name: "Trying My Best!",
		rating: 4,
		num: 1293,
	},
	primalshackle: {
		// placeholder, form change was implemented in rulesets.ts because we didn't
		// know that it was supposed to be an ability lol
		onDamage(damage, target, source, effect) {
			if (
				effect.effectType === "Move" &&
				!effect.multihit &&
				!(effect.hasSheerForce && source.hasAbility('sheerforce'))
			) {
				this.effectState.checkedPrimalShackle = false;
			} else {
				this.effectState.checkedPrimalShackle = true;
			}
		},
		onAfterMoveSecondary(target, source, move) {
			this.effectState.checkedBerserk = true;
			if (!source || source === target || !target.hp || !move.totalDamage) return;
			const lastAttackedBy = target.getLastAttackedBy();
			if (!lastAttackedBy) return;
			const damage = move.multihit && !move.smartTarget ? move.totalDamage : lastAttackedBy.damage;
			if (target.hp <= target.maxhp / 1.5 && target.hp + damage > target.maxhp / 2) {
				target.formeChange('Rayquaza-Untethered', null, true);
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
		name: "Primal Shackle",
		rating: 0,
		shortDesc: "Rayquaza: Changes to Untethered form below 67% of its max HP.",
	},
};
