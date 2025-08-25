export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	thickfat: {
		// prevents burning
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.status === 'brn') {
				this.add('-activate', pokemon, 'ability: Thick Fat');
				pokemon.cureStatus();
			}
		},
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'brn') return;
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Thick Fat');
			}
			return false;
		},
		shortDesc: "Fire-/Ice-type moves against this Pokemon deal 1/2 damage. Burn immune.",
	},
	callillumise: {
		onDamagePriority: -30,
		onDamage(damage, target, source, effect) {
			if (damage >= target.hp) {
				this.add('-ability', target, 'Call Illumise');
				this.effectState.callillumise = true;
				return target.hp - 1;
			}
		},
		onUpdate(pokemon) {
			if (!this.effectState.callillumise) return;

			this.add('-message', `Volbeat calls upon Illumise for aid!`);
			// Define new moves
			const newMoves = ['bugbuzz', 'icebeam', 'thunderbolt', 'quiverdance'];
			// Update move slots
			pokemon.moveSlots = newMoves.map(move => {
				const moveData = this.dex.moves.get(move);
				return {
					move: moveData.name,
					id: moveData.id,
					pp: moveData.pp,
					maxpp: moveData.pp,
					target: moveData.target,
					disabled: false,
					used: false,
				};
			});
			// this forces the UI to update move slots visually
			(pokemon as any).baseMoveSlots = pokemon.moveSlots.slice();
			// removes status/boosts
			pokemon.cureStatus();
			pokemon.clearBoosts();
			// forces the UI to update part II
			this.add('-clearboost', pokemon, '[from] ability: Call Illumise', '[silent]');
			for (const volatile in pokemon.volatiles) {
				this.add('-end', pokemon, volatile);
			}
			pokemon.clearVolatile(true);
			// form change + heal
			pokemon.formeChange('Illumise', null, true);
			this.heal(pokemon.maxhp);
			// sets new ability
			pokemon.setAbility('Tinted Lens', null, null, true);
			pokemon.baseAbility = pokemon.ability;
			this.add('-ability', pokemon, 'Tinted Lens');
		},
		flags: {
			breakable: 1, failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1,
		},
		name: "Call Illumise",
		rating: 5,
		num: -100,
		shortDesc: "When Volbeat gets low on HP, it calls Illumise for aid.",
	},
	callvolbeat: {
		onDamagePriority: -30,
		onDamage(damage, target, source, effect) {
			if (damage >= target.hp) {
				this.add('-ability', target, 'Call Volbeat');
				this.effectState.callvolbeat = true;
				return target.hp - 1;
			}
		},
		onUpdate(pokemon) {
			if (!this.effectState.callvolbeat) return;

			this.add('-message', `Illumise calls upon Volbeat for aid!`);
			// Define new moves
			const newMoves = ['victorydance', 'lunge', 'mightycleave', 'earthquake'];
			// Update move slots
			pokemon.moveSlots = newMoves.map(move => {
				const moveData = this.dex.moves.get(move);
				return {
					move: moveData.name,
					id: moveData.id,
					pp: moveData.pp,
					maxpp: moveData.pp,
					target: moveData.target,
					disabled: false,
					used: false,
				};
			});
			// this forces the UI to update move slots visually
			(pokemon as any).baseMoveSlots = pokemon.moveSlots.slice();
			// removes status/boosts
			pokemon.cureStatus();
			pokemon.clearBoosts();
			// forces the UI to update part II
			this.add('-clearboost', pokemon, '[from] ability: Call Volbeat', '[silent]');
			for (const volatile in pokemon.volatiles) {
				this.add('-end', pokemon, volatile);
			}
			pokemon.clearVolatile(true);
			// form change + heal
			pokemon.formeChange('Volbeat', null, true);
			this.heal(pokemon.maxhp);
			// sets new ability
			pokemon.setAbility('Dancer', null, null, true);
			pokemon.baseAbility = pokemon.ability;
			this.add('-ability', pokemon, 'Dancer');
		},
		flags: {
			breakable: 1, failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1,
		},
		name: "Call Volbeat",
		rating: 5,
		num: -101,
		shortDesc: "When Illumise gets low on HP, it calls Volbeat for aid.",
	},
	shortfuse: {
		onDamagePriority: -30,
		onDamage(damage, target, source, effect) {
			if (damage >= target.hp) {
				this.add('-ability', target, 'Short Fuse');
				this.effectState.shortfuse = true;
				return target.hp - 1;
			}
		},
		onUpdate(pokemon) {
			if (this.effectState.shortfuse) {
				delete this.effectState.shortfuse;
				this.actions.useMove('explosion', pokemon);
			}
		},
		flags: {
			breakable: 1, failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1,
		},
		name: "Short Fuse",
		rating: 5,
		num: -102,
		shortDesc: "When this Pokemon would be KOed, it instead uses Explosion.",
	},
	hydroelectricdam: {
		// Copied from the code for Sand Spit
		onDamagingHit(damage, target, source, move) {
			this.field.setWeather('raindance');
		},
		flags: {},
		name: "Hydroelectric Dam",
		rating: 5,
		num: -103,
		shortDesc: "When this Pokemon is hit by an attack, the effect of Rain Dance begins.",
	},
	frozenarmor: {
		onTryHit(target, source, move) {
			if (move.category !== 'Status') {
				this.add('-ability', target, 'Frozen Armor');
				// reduces base power of incoming moves by 20 (math.max prevents base power from reducing below 0)
				move.basePower = Math.max(move.basePower - 20, 0);
			}
		},
		onSwitchInPriority: -1,
		onUpdate(pokemon) {
			// checks if Glastrier is below 50% HP, if so transforms into Caly-Ice and sets ability to As One
			if (pokemon.species.id !== 'glastrier' || !pokemon.hp) return;
			if (pokemon.hp < pokemon.maxhp / 2) {
				if (pokemon.species.id !== 'calyrexice' && pokemon.ability === 'frozenarmor') {
					pokemon.formeChange('Calyrex-Ice', null, true);
					this.add('-message', `Glastrier's Frozen Armor has shattered!`);
					// pokemon.setAbility('As One (Glastrier)');
					pokemon.baseAbility = pokemon.ability;
					// this.add('-ability', pokemon, 'As One');
				}
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1 },
		name: "Frozen Armor",
		rating: 5,
		num: -105,
		shortDesc: "Incoming attacks have their BP reduced by 20. This Pokemon transforms into Calyrex-Ice below 50% HP.",
	},
	flipflop: {
		onDamagingHitOrder: 1,
		onTryHit(target, source, move) {
			if (move.flags['contact']) {
				let flipFlopBoosts = false;
				const invertedBoosts: SparseBoostsTable = {};
				for (const stat in source.boosts) {
					if (source.boosts[stat as BoostID] > 0) {
						// checks for boosts on source of move, inverts boosts and adds them to invertedBoosts table
						invertedBoosts[stat as BoostID] = -2 * source.boosts[stat as BoostID];
						if (!flipFlopBoosts) {
							this.add('-ability', target, 'Flip Flop');
							flipFlopBoosts = true;
						}
					}
				}
				// applies boosts
				this.boost(invertedBoosts, source, target);
			}
		},
		flags: {},
		name: "Flip Flop",
		rating: 5,
		num: -104,
		shortDesc: "When hit by a contact move, the attacker’s stat changes are inverted.",
	},

	grasspelt: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			this.field.setTerrain('grassyterrain');
		},
		shortDesc: "Starts Grassy Terrain on hit. 1.5x Def in Grassy Terrain.",
	},
	aquaveil: {
		onSwitchInPriority: -1,
		// fakes the effect of aqua ring volatile lel
		onStart(pokemon) {
			this.add('-start', pokemon, 'Aqua Ring');
		},
		// provides effects of Water Bubble because Aqua Ring is modified to provide Water Bubble.
		onResidualOrder: 6,
		onResidual(pokemon) {
			this.heal(pokemon.baseMaxhp / 16);
		},
		onSourceModifyAtkPriority: 5,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				return this.chainModify(0.5);
			}
		},
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Water') {
				return this.chainModify(2);
			}
		},
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Water') {
				return this.chainModify(2);
			}
		},
		// this ability is supposed to just add Aqua Ring (the volatile) to the Pokemon on switch in
		flags: { cantsuppress: 1 },
		name: "Aqua Veil",
		rating: 5,
		num: -106,
		shortDesc: "Starts Aqua Ring on switch in.",
	},
	// unaware + water absorb
	stillwater: {
		onAnyModifyBoost(boosts, pokemon) {
			const unawareUser = this.effectState.target;
			if (unawareUser === pokemon) return;
			if (unawareUser === this.activePokemon && pokemon === this.activeTarget) {
				boosts['def'] = 0;
				boosts['spd'] = 0;
				boosts['evasion'] = 0;
			}
			if (pokemon === this.activePokemon && unawareUser === this.activeTarget) {
				boosts['atk'] = 0;
				boosts['def'] = 0;
				boosts['spa'] = 0;
				boosts['accuracy'] = 0;
			}
		},
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Water') {
				if (!this.heal(target.baseMaxhp / 4)) {
					this.add('-immune', target, '[from] ability: Still Water');
				}
				return null;
			}
		},
		flags: { breakable: 1 },
		name: "Still Water",
		rating: 5,
		num: -107,
		shortDesc: "Unaware + Water Absorb",
	},
	kingofthehill: {
		// sharpness + mountaineer + prevents hazard immunity
		onDamage(damage, target, source, effect) {
			if (effect && effect.id === 'stealthrock') {
				return false;
			}
		},
		onTryHit(target, source, move) {
			if (move.type === 'Rock' && !target.activeTurns) {
				this.add('-immune', target, '[from] ability: King of the Hill');
				return null;
			}
		},
		// sharpness
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['slicing']) {
				this.debug('Sharpness boost');
				return this.chainModify(1.5);
			}
		},
		// starts side condition for foes, side condition interacts with hazard effects
		onStart(pokemon) {
			this.add('-ability', pokemon, 'King of the Hill');
			for (const side of pokemon.side.foeSidesWithConditions()) {
				side.addSideCondition('kingofthehill');
			}
		},
		onEnd(pokemon) {
			for (const side of pokemon.side.foeSidesWithConditions()) {
				if (side.getSideCondition('kingofthehill')) {
					side.removeSideCondition('kingofthehill');
				}
			}
		},
		condition: {},
		flags: { breakable: 1 },
		name: "King of the Hill",
		rating: 5,
		num: -108,
		shortDesc: "Mountaineer + Sharpness. Prevents opposing Pokemon from ignoring hazard damage.",
	},
	// stockpile on hit
	omnivore: {
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) {
			if (!target.hp) return;
			this.add('-activate', target, 'ability: Omnivore');
			target.addVolatile('stockpile');
		},
		flags: {},
		name: "Omnivore",
		rating: 5,
		num: -109,
		shortDesc: "This Pokemon gains a Stockpile charge upon being hit by a damaging attack.",
	},
	// disguise clone
	pseudowoodo: {
		onDamagePriority: 1,
		onDamage(damage, target, source, effect) {
			if (effect?.effectType === 'Move' && ['sudowoodo'].includes(target.species.id)) {
				this.add('-activate', target, 'ability: Pseudowoodo');
				this.effectState.rock = true;
				return 0;
			}
		},
		onCriticalHit(target, source, move) {
			if (!target) return;
			if (!['sudowoodo'].includes(target.species.id)) {
				return;
			}
			const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
			if (hitSub) return;

			if (!target.runImmunity(move.type)) return;
			return false;
		},
		onEffectiveness(typeMod, target, type, move) {
			if (!target || move.category === 'Status') return;
			if (!['sudowoodo'].includes(target.species.id)) {
				return;
			}

			const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
			if (hitSub) return;

			if (!target.runImmunity(move.type)) return;
			return 0;
		},
		onUpdate(pokemon) {
			if (['sudowoodo'].includes(pokemon.species.id) && this.effectState.rock) {
				const speciesid = 'Sudowoodo-Rock';
				pokemon.formeChange(speciesid, this.effect, true);
				this.damage(pokemon.baseMaxhp / 8, pokemon, pokemon, this.dex.species.get(speciesid));
			}
		},
		flags: {
			failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1,
			breakable: 1, notransform: 1,
		},
		name: "Pseudowoodo",
		rating: 5,
		num: -110,
		shortDesc: "The first hit it takes is blocked, and it takes 1/8 HP damage instead and becomes Rock type.",
	},
	magicguard: {
		onDamage(damage, target, source, effect) {
			// prevents magic guard from blocking hazard damage while King of the Hill is active
			if (target.side.getSideCondition('kingofthehill')) {
				const hazards = ['stealthrock', 'spikes', 'toxicspikes', 'stickyweb'];
				if (effect && hazards.includes(effect.id)) {
					return;
				}
			}
			if (effect.effectType !== 'Move') {
				if (effect.effectType === 'Ability') this.add('-activate', source, 'ability: ' + effect.name);
				return false;
			}
		},
		flags: {},
		name: "Magic Guard",
		rating: 4,
		num: 98,
	},
	disguise: {
		onDamagePriority: 1,
		onDamage(damage, target, source, effect) {
			if (effect?.effectType === 'Move' && ['mimikyu', 'mimikyutotem'].includes(target.species.id)) {
				this.add('-activate', target, 'ability: Disguise');
				this.effectState.busted = true;
				return 0;
			}
		},
		onCriticalHit(target, source, move) {
			if (!target) return;
			if (!['mimikyu', 'mimikyutotem'].includes(target.species.id)) {
				return;
			}
			const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
			if (hitSub) return;

			if (!target.runImmunity(move.type)) return;
			return false;
		},
		onEffectiveness(typeMod, target, type, move) {
			if (!target || move.category === 'Status') return;
			if (!['mimikyu', 'mimikyutotem'].includes(target.species.id)) {
				return;
			}

			const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
			if (hitSub) return;

			if (!target.runImmunity(move.type)) return;
			return 0;
		},
		onUpdate(pokemon) {
			if (['mimikyu', 'mimikyutotem'].includes(pokemon.species.id) && this.effectState.busted) {
				const speciesid = pokemon.species.id === 'mimikyutotem' ? 'Mimikyu-Busted-Totem' : 'Mimikyu-Busted';
				pokemon.formeChange(speciesid, this.effect, true);
				this.damage(pokemon.baseMaxhp / 8, pokemon, pokemon, this.dex.species.get(speciesid));
			}
			// sets ability to perish body
			if (pokemon.species.id === 'mimikyubusted' && pokemon.ability === 'disguise') {
				pokemon.setAbility("Perish Body");
				pokemon.baseAbility = pokemon.ability;
			}
		},
		// cantsuppress flag removed to allow for ability change
		flags: {
			failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1,
			breakable: 1, notransform: 1,
		},
		name: "Disguise",
		rating: 3.5,
		num: 209,
	},
	gulpmissile: {
		inherit: true,
		onTryHit(target, source, move) {
			// Storm Drain effect while cramorant-gulping
			if (target !== source && move.type === 'Water' && target.species.id === 'cramorantgulping') {
				if (!this.boost({ spa: 1 })) {
					this.add('-immune', target, '[from] ability: Gulp Missile');
				}
				return null;
			}
			// Lightning Rod effect while cramorant-gorging
			if (target !== source && move.type === 'Electric' && target.species.id === 'cramorantgorging') {
				if (!this.boost({ spa: 1 })) {
					this.add('-immune', target, '[from] ability: Gulp Missile');
				}
				return null;
			}
			return;
		},
	},
	asoneglastrier: {
		inherit: true,
		// removing these flags allows Frozen Armor to correctly set Caly-Ice ability as As One
		flags: {},
	},
	protean: {
		inherit: true,
		onPrepareHit(source, target, move) {
			if (move.hasBounced || move.flags['futuremove'] || move.sourceEffect === 'snatch' || move.callsMove) return;
			const type = move.type;
			if (type && type !== '???' && source.getTypes().join() !== type) {
				if (!source.setType(type)) return;
				this.add('-start', source, 'typechange', type, '[from] ability: Protean');
			}
		},
		rating: 4.5,
		shortDesc: "This Pokemon's type changes to the type of the move it is using.",
	},
	berserk: {
		onUpdate(pokemon) {
			if (pokemon.species.id !== 'infernape' || !pokemon.hp || pokemon.m.triggeredBerserk) return;
			if (pokemon.hp < pokemon.maxhp / 2) {
				this.boost({ spa: 1 }, pokemon, pokemon);
				pokemon.m.triggeredBerserk = true;
			}
		},
		flags: {},
		name: "Berserk",
		rating: 2,
		num: 201,
	},
	bloodsoakedcrescent: {
		// modifies atk
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Blood-Soaked Crescent');
		},
		onModifyAtkPriority: 1,
		onModifyAtk(atk, pokemon) {
			if (pokemon.volatiles['dynamax']) return;
			this.debug('bsc Attack boost');
			return this.chainModify(1.5);
		},
		// ends move lock properly
		onAfterMove(pokemon) {
			if (pokemon.volatiles['bloodsoakedcrescent']?.duration === 1) {
				pokemon.removeVolatile('bloodsoakedcrescent');
				this.add('-end', pokemon, 'Blood-Soaked Rage');
			}
		},
		// applies move lock
		onAfterMoveSecondarySelf(pokemon, source, move) {
			if (move.id === 'dragondance') return;
			if (!pokemon.volatiles['bloodsoakedcrescent']) {
				this.add('-start', pokemon, 'Blood-Soaked Rage');
			}
			pokemon.addVolatile('bloodsoakedcrescent');
		},
		// condition is just lockedmove with some changes
		condition: {
			// Outrage, Thrash, Petal Dance...
			duration: 2,
			onResidual(target) {
				if (target.status === 'slp') {
					// don't lock, and bypass confusion for calming
					delete target.volatiles['bloodsoakedcrescent'];
				}
				this.effectState.trueDuration--;
			},
			onStart(target, source, effect) {
				this.effectState.trueDuration = this.random(2, 4);
				this.effectState.move = this.activeMove;
			},
			onRestart() {
				if (this.effectState.trueDuration >= 2) {
					this.effectState.duration = 2;
				}
			},
			onEnd(target) {
				if (this.effectState.trueDuration > 1) return;
				target.addVolatile('confusion');
			},
			onLockMove(pokemon) {
				if (pokemon.volatiles['dynamax']) return;
				return this.effectState.move;
			},
		},
		flags: {},
		name: "Blood-Soaked Crescent",
		rating: 5,
		num: -111,
		shortDesc: "1.5x Attack, but attacks have the Outrage effect.",
	},
	powerspot: {
		onChargeMove(pokemon, target, move) {
			this.debug('power spot - remove charge turn for ' + move.id);
			this.attrLastMove('[still]');
			this.addMove('-anim', pokemon, move.name, target);
			return false; // skip charge turn
		},
		onAfterMoveSecondarySelf(pokemon, target, move) {
			if (pokemon.getVolatile('mustrecharge')) {
				pokemon.removeVolatile('mustrecharge');
				this.add('-end', pokemon, 'mustrecharge');
			}
		},
		flags: {},
		name: "Power Spot",
		rating: 5,
		num: 249,
		shortDesc: "Moves ignore charge/recharge turns.",
	},
	biogenesis: {
		onSwitchInPriority: -1,
		onBeforeSwitchIn(pokemon) {
			if (pokemon.m.didRandomMoves) return;
			const moves = this.dex.moves.all();
			const newMoves = [];
			while (newMoves.length < 8) {
				const newMove = this.sample(moves);
				if (newMove.basePower === 1) continue;
				if (newMove.isMax === true) continue;
				if (newMove.isNonstandard === "Gigantamax") continue;
				if (newMoves.map(x => x.id).includes(newMove.id)) continue;
				newMoves.push(newMove);
			}
			// Update move slots
			pokemon.moveSlots = newMoves.map(move => {
				const moveData = this.dex.moves.get(move);
				return {
					move: moveData.name,
					id: moveData.id,
					pp: moveData.pp,
					maxpp: moveData.pp,
					target: moveData.target,
					disabled: false,
					used: false,
				};
			});
			// this forces the UI to update move slots visually
			(pokemon as any).baseMoveSlots = pokemon.moveSlots.slice();
			pokemon.m.didRandomMoves = true;
		},
		onSwitchIn(pokemon) {
			if (!pokemon) return; // Chat command
			if (!pokemon.m.hasTypeChanged) {
				this.add('-ability', pokemon, 'Biogenesis');
				this.add('-anim', pokemon, 'Growth', pokemon);
				this.add('-message', `Mew evolves into a new form with its Biogenesis!`);
			}
			const attackingMoves = pokemon.baseMoveSlots
				.map(slot => this.dex.moves.get(slot.id))
				.filter(move => move.category !== "Status");

			// pick types of first 2 attacking moves (failsafe if there are none)
			const types = attackingMoves.length ?
				[...new Set(attackingMoves.slice(0, 2).map(move => move.type))] :
				pokemon.types;
			pokemon.setType(types);
			pokemon.baseTypes = pokemon.types;
			pokemon.m.hasTypeChanged = true;
			this.add('-start', pokemon, 'typechange', (pokemon.illusion || pokemon).getTypes(true).join('/'), '[silent]');
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1,
			breakable: 1, notransform: 1, cantsuppress: 1 },
		name: "Biogenesis",
		rating: 5,
		num: -112,
		shortDesc: "This Pokemon receives 8 completely random moves at the start of the game.",
	},
	orichalcumpulse: {
		onStart(pokemon) {
			pokemon.updateMaxHp();
			if (this.field.setWeather('sunnyday')) {
				this.add('-activate', pokemon, 'Orichalcum Pulse', '[source]');
			} else if (this.field.isWeather('sunnyday')) {
				this.add('-activate', pokemon, 'ability: Orichalcum Pulse');
			}
		},
		onModifyAtkPriority: 5,
		onModifyAtk(atk, pokemon) {
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				this.debug('Orichalcum boost');
				return this.chainModify([5461, 4096]);
			}
		},
		flags: {},
		name: "Orichalcum Pulse",
		rating: 4.5,
		num: 288,
	},
	hailmary: {
		onStart(pokemon) {
			this.add('-activate', pokemon, 'ability: Hail Mary');
		},
		onModifySpe(spe, pokemon) {
			if (this.field.isWeather(['hail', 'snowscape'])) {
				this.debug('hail mary spe boost');
				return this.chainModify(2);
			}
		},
		onModifyAtkPriority: 5,
		onModifyAtk(atk, pokemon) {
			if (this.field.isWeather(['hail', 'snowscape'])) {
				this.debug('hail mary atk boost');
				return this.chainModify(1.5);
			}
		},
		onSourceModifyAccuracyPriority: -1,
		onSourceModifyAccuracy(accuracy, target, source, move) {
			if (this.field.isWeather(['hail', 'snowscape'])) {
				if (move.category === 'Physical' && typeof accuracy === 'number') {
					return this.chainModify([3277, 4096]);
				}
			}
		},
		flags: {},
		name: "Hail Mary",
		rating: 5,
		num: -113,
		shortDesc: "In Snowscape: 2x Speed, 1.5x Attack, 0.8x accuracy.",
	},
	brainfreeze: {
		onModifyCritRatio(critRatio, source, target) {
			if (target && (target.status === 'frostbite' || this.field.isWeather('snowscape'))) return 5;
		},
		flags: {},
		name: "Brain Freeze",
		rating: 5,
		num: -114,
		shortDesc: "This Pokemon's attacks are critical hits if the target is frostbitten or Snow is active.",
	},
	neutralizinggas: {
		inherit: true,
		onStart(pokemon) {
			// this makes Neutralizing Gas properly show as activated in the client when Typhlosion Mega evolves
			this.add('-ability', pokemon, 'Neutralizing Gas');
		},
	},
	terawheel: {
		// copied from SSB High Performance Computing
		onResidualOrder: 6,
		onResidual(source) {
			const type = this.sample(this.dex.types.names().filter(i => i !== source.getTypes()[0]));
			if (source.setType(type)) {
				this.add('-start', source, 'typechange', type, '[from] ability: Tera Wheel');
			}
		},
		flags: {},
		name: "Tera Wheel",
		rating: 5,
		num: -115,
		shortDesc: "At the end of each turn, this Pokemon switches to a random type (including Stellar).",
	},
};
