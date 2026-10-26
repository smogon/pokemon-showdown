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
		onSetStatus(status, defender, attacker, effect) {
			if (status.id !== 'brn') return;
			if ((effect as Move)?.status) {
				this.add('-immune', defender, '[from] ability: Thick Fat');
			}
			return false;
		},
		shortDesc: "-50% damage from Fire and Ice. Burn immune.",
	},
	callillumise: {
		onDamagePriority: -30,
		onDamage(damage, defender, attacker, effect) {
			if (damage >= defender.hp && !defender.m.called) {
				this.add('-ability', defender, 'Call Illumise');
				this.effectState.callillumise = true;
				return defender.hp - 1;
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
					defender: moveData.defender,
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
			pokemon.m.called = true;
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
		onDamage(damage, defender, attacker, effect) {
			if (damage >= defender.hp && !defender.m.called) {
				this.add('-ability', defender, 'Call Volbeat');
				this.effectState.callvolbeat = true;
				return defender.hp - 1;
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
					defender: moveData.defender,
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
			pokemon.m.called = true;
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
		onDamage(damage, defender, attacker, effect) {
			if (damage >= defender.hp) {
				this.add('-ability', defender, 'Short Fuse');
				this.effectState.shortfuse = true;
				return defender.hp - 1;
			}
		},
		onUpdate(pokemon) {
			if (this.effectState.shortfuse) {
				delete this.effectState.shortfuse;
				this.actions.useMove('explosion', pokemon);
			}
			this.checkFainted();
		},
		flags: {
			breakable: 1, failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1,
		},
		name: "Short Fuse",
		rating: 5,
		num: -102,
		shortDesc: "If KO'd, use Explosion instead.",
	},
	hydroelectricdam: {
		// Copied from the code for Sand Spit
		onDamagingHit(damage, defender, attacker, move) {
			this.field.setWeather('raindance');
		},
		flags: {},
		name: "Hydroelectric Dam",
		rating: 5,
		num: -103,
		shortDesc: "Starts Rain Dance when hit by an attack.",
	},
	frozenarmor: {
		onTryHit(defender, attacker, move) {
			if (move.category !== 'Status') {
				this.add('-ability', defender, 'Frozen Armor');
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
		shortDesc: "-20 BP on attacks targeting Glastrier, at 50% HP become Calyrex-Ice.",
	},
	flipflop: {
		onDamagingHitOrder: 1,
		onTryHit(defender, attacker, move) {
			if (move.flags['contact']) {
				let flipFlopBoosts = false;
				const invertedBoosts: SparseBoostsTable = {};
				for (const stat in attacker.boosts) {
					if (attacker.boosts[stat as BoostID] > 0) {
						// checks for boosts on attacker of move, inverts boosts and adds them to invertedBoosts table
						invertedBoosts[stat as BoostID] = -2 * attacker.boosts[stat as BoostID];
						if (!flipFlopBoosts) {
							this.add('-ability', defender, 'Flip Flop');
							flipFlopBoosts = true;
						}
					}
				}
				// applies boosts
				this.boost(invertedBoosts, attacker, defender);
			}
		},
		flags: {},
		name: "Flip Flop",
		rating: 5,
		num: -104,
		shortDesc: "When hit by contact move, invert attacker’s stat boosts.",
	},

	grasspelt: {
		inherit: true,
		onDamagingHit(damage, defender, attacker, move) {
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
			const unawareUser = this.effectState.defender;
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
		onTryHit(defender, attacker, move) {
			if (defender !== attacker && move.type === 'Water') {
				if (!this.heal(defender.baseMaxhp / 4)) {
					this.add('-immune', defender, '[from] ability: Still Water');
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
		onDamage(damage, defender, attacker, effect) {
			if (effect?.id === 'stealthrock') {
				return false;
			}
		},
		onTryHit(defender, attacker, move) {
			if (move.type === 'Rock' && !defender.activeTurns) {
				this.add('-immune', defender, '[from] ability: King of the Hill');
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
		shortDesc: "Mountaineer + Sharpness. Opponent cannot ignore hazard damage.",
	},
	// stockpile on hit
	omnivore: {
		onDamagingHitOrder: 1,
		onDamagingHit(damage, defender, attacker, move) {
			if (!defender.hp) return;
			this.add('-activate', defender, 'ability: Omnivore');
			defender.addVolatile('stockpile');
		},
		flags: {},
		name: "Omnivore",
		rating: 5,
		num: -109,
		shortDesc: "Gain Stockpile charge when hit by attack.",
	},
	// disguise clone
	pseudowoodo: {
		onDamagePriority: 1,
		onDamage(damage, defender, attacker, effect) {
			if (effect?.effectType === 'Move' && ['sudowoodo'].includes(defender.species.id)) {
				this.add('-activate', defender, 'ability: Pseudowoodo');
				this.effectState.rock = true;
				return 0;
			}
		},
		onCriticalHit(defender, attacker, move) {
			if (!defender) return;
			if (!['sudowoodo'].includes(defender.species.id)) {
				return;
			}
			const hitSub = defender.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
			if (hitSub) return;

			if (!defender.runImmunity(move.type)) return;
			return false;
		},
		onEffectiveness(typeMod, defender, type, move) {
			if (!defender || move.category === 'Status') return;
			if (!['sudowoodo'].includes(defender.species.id)) {
				return;
			}

			const hitSub = defender.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
			if (hitSub) return;

			if (!defender.runImmunity(move.type)) return;
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
		shortDesc: "Disguise. Becomes Rock type when it breaks.",
	},
	magicguard: {
		onDamage(damage, defender, attacker, effect) {
			// prevents magic guard from blocking hazard damage while King of the Hill is active
			if (defender.side.getSideCondition('kingofthehill')) {
				const hazards = ['stealthrock', 'spikes', 'toxicspikes', 'stickyweb'];
				if (effect && hazards.includes(effect.id)) {
					return;
				}
			}
			if (effect.effectType !== 'Move') {
				if (effect.effectType === 'Ability') this.add('-activate', attacker, 'ability: ' + effect.name);
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
		onDamage(damage, defender, attacker, effect) {
			if (effect?.effectType === 'Move' && ['mimikyu', 'mimikyutotem'].includes(defender.species.id)) {
				this.add('-activate', defender, 'ability: Disguise');
				this.effectState.busted = true;
				return 0;
			}
		},
		onCriticalHit(defender, attacker, move) {
			if (!defender) return;
			if (!['mimikyu', 'mimikyutotem'].includes(defender.species.id)) {
				return;
			}
			const hitSub = defender.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
			if (hitSub) return;

			if (!defender.runImmunity(move.type)) return;
			return false;
		},
		onEffectiveness(typeMod, defender, type, move) {
			if (!defender || move.category === 'Status') return;
			if (!['mimikyu', 'mimikyutotem'].includes(defender.species.id)) {
				return;
			}

			const hitSub = defender.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
			if (hitSub) return;

			if (!defender.runImmunity(move.type)) return;
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
		onTryHit(defender, attacker, move) {
			// Storm Drain effect while cramorant-gulping
			if (defender !== attacker && move.type === 'Water' && defender.species.id === 'cramorantgulping') {
				if (!this.boost({ spa: 1 })) {
					this.add('-immune', defender, '[from] ability: Gulp Missile');
				}
				return null;
			}
			// Lightning Rod effect while cramorant-gorging
			if (defender !== attacker && move.type === 'Electric' && defender.species.id === 'cramorantgorging') {
				if (!this.boost({ spa: 1 })) {
					this.add('-immune', defender, '[from] ability: Gulp Missile');
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
		onPrepareHit(attacker, defender, move) {
			if (move.hasBounced || move.flags['futuremove'] || move.sourceEffect === 'snatch' || move.callsMove) return;
			const type = move.type;
			if (type && type !== '???' && attacker.getTypes().join() !== type) {
				if (!attacker.setType(type)) return;
				this.add('-start', attacker, 'typechange', type, '[from] ability: Protean');
			}
		},
		rating: 4.5,
		shortDesc: "Gen 8 Protean.",
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
		onAfterMoveSecondarySelf(pokemon, attacker, move) {
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
			onResidual(defender) {
				if (defender.status === 'slp') {
					// don't lock, and bypass confusion for calming
					delete defender.volatiles['bloodsoakedcrescent'];
				}
				this.effectState.trueDuration--;
			},
			onStart(defender, attacker, effect) {
				this.effectState.trueDuration = this.random(2, 4);
				this.effectState.move = this.activeMove;
			},
			onRestart() {
				if (this.effectState.trueDuration >= 2) {
					this.effectState.duration = 2;
				}
			},
			onEnd(defender) {
				if (this.effectState.trueDuration > 1) return;
				defender.addVolatile('confusion');
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
		onChargeMove(pokemon, defender, move) {
			this.debug('power spot - remove charge turn for ' + move.id);
			this.attrLastMove('[still]');
			this.addMove('-anim', pokemon, move.name, defender);
			return false; // skip charge turn
		},
		onAfterMoveSecondarySelf(pokemon, defender, move) {
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
				if (newMove.isMax) continue;
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
					defender: moveData.defender,
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
				this.add('-activate', pokemon, 'Orichalcum Pulse', '[attacker]');
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
		onSourceModifyAccuracy(accuracy, defender, attacker, move) {
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
		onModifyCritRatio(critRatio, attacker, defender) {
			if (defender && (defender.status === 'frostbite' || this.field.isWeather('snowscape'))) return 5;
		},
		flags: {},
		name: "Brain Freeze",
		rating: 5,
		num: -114,
		shortDesc: "If Snowscape or defender is Frostbitten, attacks auto Crit.",
	},
	neutralizinggas: {
		inherit: true,
		onStart(pokemon) {
			// this makes Neutralizing Gas properly show as activated in the client when Typhlosion Mega evolves
			this.add('-ability', pokemon, 'Neutralizing Gas');
		},
	},
	terawheel: {
		onStart(pokemon) {
			pokemon.canTerastallize = null;
		},
		// copied from SSB High Performance Computing
		onResidualOrder: 6,
		onResidual(attacker) {
			const type = this.sample(this.dex.types.names().filter(i => i !== attacker.getTypes()[0]));
			if (attacker.setType(type)) {
				this.add('-start', attacker, 'typechange', type, '[from] ability: Tera Wheel');
			}
		},
		flags: {},
		name: "Tera Wheel",
		rating: 5,
		num: -115,
		shortDesc: "End of turn: this Pokemon switches to a random type (including Stellar).",
	},
	download: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.species.name === 'Genesect-Burn' && pokemon.terastallized) {
				pokemon.setAbility('Drought', null, null, true);
				pokemon.baseAbility = pokemon.ability;
				this.add('-ability', pokemon, 'Drought');
			}
			if (pokemon.species.name === 'Genesect-Chill' && pokemon.terastallized) {
				pokemon.setAbility('Snow Warning', null, null, true);
				pokemon.baseAbility = pokemon.ability;
				this.add('-ability', pokemon, 'Snow Warning');
			}
			if (pokemon.species.name === 'Genesect-Douse' && pokemon.terastallized) {
				pokemon.setAbility('Drizzle', null, null, true);
				pokemon.baseAbility = pokemon.ability;
				this.add('-ability', pokemon, 'Drizzle');
			}
			if (pokemon.species.name === 'Genesect-Shock' && pokemon.terastallized) {
				pokemon.setAbility('Electric Surge', null, null, true);
				pokemon.baseAbility = pokemon.ability;
				this.add('-ability', pokemon, 'Electric Surge');
			}
		},
		shortDesc: "Download + Gets weather setting move when Tera.",
	},
	battlerage: {
		onDamagingHit(damage, defender, attacker, effect) {
			this.boost({ atk: 1 });
		},
		flags: {},
		name: "Battle Rage",
		rating: 5,
		num: -116,
		shortDesc: "+1 Atk when hit by an attack.",
	},
	terrainshift: {
		onStart(attacker) {
			if (attacker.hp >= attacker.maxhp) {
				attacker.setType("Electric");
				this.field.setTerrain('electricterrain');
				this.add('-start', attacker, 'typechange', 'Electric', '[silent]');
			} else if (attacker.hp >= (2 * attacker.maxhp) / 3) {
				attacker.setType("Fairy");
				this.field.setTerrain('mistyterrain');
				this.add('-start', attacker, 'typechange', 'Fairy', '[silent]');
			} else if (attacker.hp >= attacker.maxhp / 3) {
				attacker.setType("Grass");
				this.field.setTerrain('grassyterrain');
				this.add('-start', attacker, 'typechange', 'Grass', '[silent]');
			} else {
				attacker.setType("Psychic");
				this.field.setTerrain('psychicterrain');
				this.add('-start', attacker, 'typechange', 'Psychic', '[silent]');
			}
		},
		flags: {},
		name: "Terrain Shift",
		rating: 5,
		num: -117,
		shortDesc: "Sets terrain depending on HP value.",
	},
	dragonsjaw: {
		onBasePower(basePower, attacker, defender, move) {
			if (defender.hasType('Dragon') && defender.hasType('Steel')) {
				return this.chainModify(1.5);
			} else if (defender.hasType('Dragon')) {
				return this.chainModify(2.25);
			} else if (defender.hasType('Steel')) {
				return;
			} else return this.chainModify(1.5);
		},
		onTryHit(defender, attacker, move) {
			if (defender.hasType('Fairy')) {
				return null;
			}
		},
		onModifyMovePriority: -2,
		onModifyMove(move) {
			if (move.secondaries) {
				this.debug('doubling secondary chance');
				for (const secondary of move.secondaries) {
					if (secondary.chance) secondary.chance *= 2;
				}
			}
			if (move.self?.chance) move.self.chance *= 2;
		},
		flags: {},
		name: "Dragon's Jaw",
		rating: 5,
		num: -118,
		shortDesc: "Serene Grace + Bite attacks are Dragon type.",
	},
	corrosivesoul: {
		onStart(attacker) {
			this.field.setTerrain('corrosivesoul');
		},
		condition: {
			effectType: 'Terrain',
			duration: 5,
			durationCallback(attacker, effect) {
				if (attacker?.hasItem('terrainextender')) {
					return 8;
				}
				return 5;
			},
			onFieldStart(field, attacker, effect) {
				if (effect?.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Corrosive Soul', '[from] ability: ' + effect.name, `[of] ${attacker}`);
				} else {
					this.add('-fieldstart', 'move: Corrosive Soul');
				}
			},
			onResidualOrder: 5,
			onResidualSubOrder: 2,
			onResidual(pokemon) {
				const move = this.dex.getActiveMove('smog');
				move.accuracy = 100;
				const defender = pokemon.foes()[0];
				if (defender && !defender.fainted) {
					this.actions.useMove(move, pokemon, { defender });
				}
			},
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 7,
			onFieldEnd() {
				this.add('-fieldend', 'move: Corrosive Soul');
			},
		},
		flags: {},
		name: "Corrosive Soul",
		rating: 5,
		num: -119,
		shortDesc: "Sets Corrosive Terrian: active Pokemon hit each other with Smog.",
	},
	oceanicblessing: {
		onSwitchInPriority: -2,
		onStart(pokemon) {
			this.singleEvent('WeatherChange', this.effect, this.effectState, pokemon);
		},
		onWeatherChange(pokemon) {
			if (!pokemon.isActive || pokemon.baseSpecies.baseSpecies !== 'Kyogre' || pokemon.transformed) return;
			if (!pokemon.hp) return;
			if (['raindance', 'primordialsea'].includes(pokemon.effectiveWeather())) {
				if (pokemon.species.id !== 'kyogreprimal') {
					pokemon.formeChange('Kyogre-Primal', this.effect, false);
				}
			} else {
				if (pokemon.species.id === 'kyogreprimal') {
					pokemon.formeChange('kyogre', this.effect, false);
				}
			}
		},
		onAllyModifyAtkPriority: 3,
		onAllyModifyAtk(atk, pokemon) {
			if (this.effectState.defender.baseSpecies.baseSpecies !== 'Kyogre') return;
			if (['raindance', 'primordialsea'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.5);
			}
		},
		onAllyModifySpDPriority: 4,
		onAllyModifySpD(spd, pokemon) {
			if (this.effectState.defender.baseSpecies.baseSpecies !== 'Kyogre') return;
			if (['raindance', 'primordialsea'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.5);
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, breakable: 1 },
		name: "Oceanic Blessing",
		rating: 5,
		num: -120,
		shortDesc: "Flower Gift but Kyogre",
	},
	autospin: {
		onResidual(pokemon, s, effect) {
			const move = this.dex.getActiveMove('metronome');
			const defender = pokemon.foes()[0];
			if (defender && !defender.fainted && (pokemon.hp >= pokemon.maxhp / 2)) {
				this.actions.useMove(move, pokemon, { defender, sourceEffect: effect });
			} else if (defender && !defender.fainted && (pokemon.hp <= pokemon.maxhp / 10)) {
				this.actions.useMove(move, pokemon, { defender, sourceEffect: effect });
				this.actions.useMove(move, pokemon, { defender, sourceEffect: effect });
				this.actions.useMove(move, pokemon, { defender, sourceEffect: effect });
			} else if (defender && !defender.fainted) {
				this.actions.useMove(move, pokemon, { defender, sourceEffect: effect });
				this.actions.useMove(move, pokemon, { defender, sourceEffect: effect });
			}
		},
		flags: {},
		name: "Auto Spin",
		rating: 5,
		num: -121,
		shortDesc: "Use Metronome at end of turn.",
	},
	corrosion: {
		inherit: true,
		onModifyMovePriority: -5,
		onModifyMove(move) {
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity['Poison'] = true;
			}
		},
		shortDesc: "This Pokemon can poison a Pokemon regardless of its typing and hit them with Poison moves.",
	},
	jellobody: {
		onTryHit(pokemon, defender, move) {
			if (move.selfSwitch) {
				this.add('-immune', pokemon, '[from] ability: Jello Body');
				this.heal(defender.baseMaxhp / 2);
				return null;
			}
		},
		onModifyMove(move, attacker, defender) {
			move.drain = [1, 2];
		},
		flags: { breakable: 1 },
		name: "Jello Body",
		rating: 5,
		num: -122,
		shortDesc: "Immune to pivot moves, heals 50% HP when hit by one. All moves drain 50%.",
	},
	nibblenibble: {
		onPrepareHit(attacker, defender, move) {
			if (move.category === 'Status' || move.multihit || move.flags['noparentalbond'] || move.flags['charge'] ||
				move.flags['futuremove'] || move.spreadHit || move.isZ || move.isMax || !move.flags['bite']) return;
			move.multihit = 2;
			move.multihitType = 'parentalbond';
		},
		// Damage modifier implemented in BattleActions#modifyDamage()
		onSourceModifySecondaries(secondaries, defender, attacker, move) {
			if (move.multihitType === 'parentalbond' && move.id === 'secretpower' && move.hit < 2) {
				// hack to prevent accidentally suppressing King's Rock/Razor Fang
				return secondaries.filter(effect => effect.volatileStatus === 'flinch');
			}
		},
		flags: {},
		name: "Nibble Nibble",
		rating: 5,
		num: -123,
		shortDesc: "Parental Bond but for Bite moves.",
	},
};
