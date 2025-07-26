export const Abilities: { [abilityid: string]: ModdedAbilityData } = {
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
			if (damage >= target.hp && effect) {
				// Keep the Pokémon at 1 HP instead of fainting immediately
				const finalHp = target.hp - 1;
				this.damage(target.hp - 1, target, source || target, effect);

				this.add('-activate', target, 'ability: Call Illumise');
				this.add('-message', `Volbeat calls upon Illumise for aid!`);
				// Define new moves
				const newMoves = ['bugbuzz', 'icebeam', 'thunderbolt', 'calmmind'];

				// Update move slots
				target.moveSlots = newMoves.map(move => {
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
				target.baseMoveSlots = target.moveSlots.slice();
				// removes status/boosts
				target.cureStatus();
				target.clearBoosts();
				// forces the UI to update part II
				this.add('-clearboost', target, '[from] ability: Call Illumise', '[silent]');
				for (const volatile in target.volatiles) {
					this.add('-end', target, volatile);
				}
				target.clearVolatile(true);
				// form change + heal
				target.formeChange('Illumise', target, true);
				this.heal(this.modify(target.maxhp, 1));
				// sets new ability
				target.setAbility('Tinted Lens');
				this.add('-activate', target, 'ability: Tinted Lens');
				target.baseAbility = target.ability;
				// prevents damage from reapplying after form change
				return damage - damage;
			}
		},
		flags: {},
		name: "Call Illumise",
		rating: 5,
		num: -100,
		shortDesc: "When Illumise gets low on HP, it calls Volbeat for aid.",
	},
	callvolbeat: {
		onTryHit(target, source, move) {
			target.clearBoosts();
		},
		onDamagePriority: -30, 
		onDamage(damage, target, source, effect) {
			if (damage >= target.hp && effect) {
		
				// Keep the Pokémon at 1 HP instead of fainting immediately
				const finalHp = target.hp - 1;
				this.damage(target.hp - 1, target, source || target, effect);

				this.add('-activate', target, 'ability: Call Volbeat');
				this.add('-message', `Illumise calls upon Volbeat for aid!`);
				// Define new moves
				const newMoves = ['dragondance', 'lunge', 'dragonhammer', 'earthquake'];

				// Update move slots
				target.moveSlots = newMoves.map(move => {
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
				target.baseMoveSlots = target.moveSlots.slice();
				// removes status/boosts
				target.clearStatus();
				target.clearBoosts();
				// forces the UI to update part II
				this.add('-clearboost', target, '[from] ability: Call Volbeat', `[silent]`);
				for (const volatile in target.volatiles) {
					this.add('-end', target, volatile);
				}
				target.clearVolatile(false);
				// form change + heal
				target.formeChange('Volbeat', target, true);
				this.heal(this.modify(target.maxhp, 1));
				// sets new ability
				target.setAbility('Swarm');
				target.baseAbility = target.ability;
				this.add('-activate', target, 'ability: Swarm');
				// prevents damage from reapplying after form change
				return damage - damage;
			}
		},
		flags: {},
		name: "Call Volbeat",
		rating: 5,
		num: -101,
		shortDesc: "When Volbeat gets low on HP, it calls Illumise for aid.",
	},
	shortfuse: {
		onDamagePriority: -30, 
		onDamage(damage, target, source, effect) {
			if (damage >= target.hp && effect) {
				this.add('-ability', target, 'Short Fuse');
		
				// Keep the Pokémon at 1 HP instead of fainting immediately
				const finalHp = target.hp - 1;
				this.damage(target.hp - 1, target, source, effect);
		
				// Force the Pokémon to use Explosion
				const explosion = this.dex.getActiveMove('explosion');
				this.actions.useMove(explosion, target);
					
				// Ensure the Pokémon properly faints afterward
				target.faint();
			}
		},
		flags: {breakable: 1},
		name: "Short Fuse",
		rating: 5,
		num: -102,
		shortDesc: "When this Pokemon would be KOed, it instead uses Explosion.",
	},
	hydroelectricdam: {
		//Copied from the code for Sand Spit
		onDamagingHit(damage, target, source, move) {
			this.field.setWeather('raindance');
			this.add('-message', `Archaludon releases a deluge!`);
		},
		flags: {},
		name: "Hydroelectric Dam",
		rating: 5,
		num: -103,
		shortDesc: "When this Pokemon is hit by an attack, the effect of Rain Dance begins.",
	},
	frozenarmor: {
		onTryHit(target, source, move) {
			if(move.category != 'Status') {
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
				if (pokemon.species !== 'Calyrex-Ice' && pokemon.ability === 'frozenarmor') {
					pokemon.formeChange('Calyrex-Ice', pokemon, true);
					this.add('-message', `Glastrier's Frozen Armor has shattered!`);
					//pokemon.setAbility('As One (Glastrier)');
					pokemon.baseAbility = pokemon.ability;
					//this.add('-ability', pokemon, 'As One');
				}
			}
		},
		flags: {failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1},
		name: "Frozen Armor",
		rating: 5,
		num: -105,
		shortDesc: "Incoming attacks have their BP reduced by 20. This Pokemon transforms into Calyrex-Ice below 50% HP.",
	},
	flipflop: {
		onDamagingHitOrder: 1,
		onTryHit(target, source, move) {
			if (move.flags['contact']) {
				let invertedBoosts: SparseBoostsTable = {};
				for (const stat in source.boosts) {
					if (source.boosts[stat] > 0) {
						// checks for boosts on source of move, inverts boosts and adds them to invertedBoosts table
						this.add('-message', `Boost detected`);
						invertedBoosts[stat] = -2 * source.boosts[stat]; 
					}
				}
				// applies boosts
				this.boost(invertedBoosts, source);
				this.add('-ability', target, 'Flip Flop');
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
		flags: {breakable: 1},
		name: "Still Water",
		rating: 5,
		num: -107,
		shortDesc: "Unaware + Water Absorb",
	},
	kingofthehill: {
		//sharpness + mountaineer + prevents hazard immunity
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
		flags: {breakable: 1},
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
			failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1,
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
			if (!pokemon.berserk) {
				pokemon.berserk = false;
			}
			if (pokemon.species.id !== 'infernape' || !pokemon.hp) return;
			if (pokemon.hp < pokemon.maxhp / 2 && pokemon.berserk === false) {
				this.boost({ spa: 1 }, pokemon, pokemon);
				pokemon.berserk = true;
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
			if (pokemon.volatiles['bloodsoakedcrescent'] && pokemon.volatiles['bloodsoakedcrescent'].duration === 1) {
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
				pokemon.removeVolatile('mustrecharge')
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
			if (pokemon.didRandomMoves === "yes") return;
			const moves = this.dex.moves.all();
			let randomMove1 = '';
			if (moves.length) {
				randomMove1 = this.sample(moves).id;
			}
			if (!randomMove1) return false;
			let randomMove2 = '';
			if (moves.length) {
				randomMove2 = this.sample(moves).id;
			}
			if (!randomMove2) return false;
			let randomMove3 = '';
			if (moves.length) {
				randomMove3 = this.sample(moves).id;
			}
			if (!randomMove3) return false;
			let randomMove4 = '';
			if (moves.length) {
				randomMove4 = this.sample(moves).id;
			}
			if (!randomMove4) return false;
			let randomMove5 = '';
			if (moves.length) {
				randomMove5 = this.sample(moves).id;
			}
			if (!randomMove5) return false;
			let randomMove6 = '';
			if (moves.length) {
				randomMove6 = this.sample(moves).id;
			}
			if (!randomMove6) return false;
			let randomMove7 = '';
			if (moves.length) {
				randomMove7 = this.sample(moves).id;
			}
			if (!randomMove7) return false;
			let randomMove8 = '';
			if (moves.length) {
				randomMove8 = this.sample(moves).id;
			}
			if (!randomMove8) return false;
			// Define new moves
			const newMoves = [randomMove1, randomMove2, randomMove3, randomMove4, randomMove5, randomMove6, randomMove7, randomMove8];
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
			pokemon.baseMoveSlots = pokemon.moveSlots.slice();
			pokemon.didRandomMoves = "yes";
		},
		onSwitchIn(pokemon) {
			this.add('-ability', pokemon, 'Biogenesis');
			this.add('-message', `Mew evolves into a new form with its Biogenesis!`);
			if (!pokemon) return; // Chat command
			const attackingMoves = pokemon.baseMoveSlots
  				.map(slot => this.dex.moves.get(slot.id))
  				.filter(move => move.category === 'Physical' || move.category === 'Special');

			// pick types of first 2 attacking moves (failsafe if there are none)
			const types = attackingMoves.length
  				? [...new Set(attackingMoves.slice(0, 2).map(move => move.type))]
  				: pokemon.types;
			pokemon.setType(types);
			this.add('-start', pokemon, 'typechange', (pokemon.illusion || pokemon).getTypes(true).join('/'), '[silent]');
		},
		flags: {failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1,
			breakable: 1, notransform: 1},
		name: "Biogenesis",
		rating: 5,
		num: -112,
		shortDesc: "This Pokemon receives 8 completely random moves at the start of the game.",
	},
	orichalcumpulse: {
		onStart(pokemon) {
			this.updateMaxHP();
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
};
