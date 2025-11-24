/*

Ratings and how they work:

-1: Detrimental
	  An ability that severely harms the user.
	ex. Defeatist, Slow Start

 0: Useless
	  An ability with no overall benefit in a singles battle.
	ex. Color Change, Plus

 1: Ineffective
	  An ability that has minimal effect or is only useful in niche situations.
	ex. Light Metal, Suction Cups

 2: Useful
	  An ability that can be generally useful.
	ex. Flame Body, Overcoat

 3: Effective
	  An ability with a strong effect on the user or foe.
	ex. Chlorophyll, Sturdy

 4: Very useful
	  One of the more popular abilities. It requires minimal support to be effective.
	ex. Adaptability, Magic Bounce

 5: Essential
	  The sort of ability that defines metagames.
	ex. Imposter, Shadow Tag

*/

export const Abilities: import('../sim/dex-abilities').AbilityDataTable = {
	noability: {
		isNonstandard: "Past",
		flags: {},
		name: "No Ability",
		rating: 0.1,
		num: 0,
	},
	adaptability: {
		onModifySTAB(stab, source, target, move) {
			if (move.forceSTAB || source.hasType(move.type)) {
				if (stab === 2) {
					return 2.25;
				}
				return 2;
			}
		},
		flags: {},
		name: "Adaptability",
		rating: 4,
		num: 91,
	},
	aerilate: {
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.type === 'Normal' && (!noModifyType.includes(move.id) || this.activeMove?.isMax) &&
				!(move.isZ && move.category !== 'Status') && !(move.name === 'Tera Blast' && pokemon.terastallized)) {
				move.type = 'Flying';
				move.typeChangerBoosted = this.effect;
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (move.typeChangerBoosted === this.effect) return this.chainModify([4915, 4096]);
		},
		flags: {},
		name: "Aerilate",
		rating: 4,
		num: 184,
	},
	aftermath: {
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) {
			if (!target.hp && this.checkMoveMakesContact(move, source, target, true)) {
				this.damage(source.baseMaxhp / 4, source, target);
			}
		},
		flags: {},
		name: "Aftermath",
		rating: 2,
		num: 106,
	},
	airlock: {
		onSwitchIn(pokemon) {
			// Air Lock does not activate when Skill Swapped or when Neutralizing Gas leaves the field
			this.add('-ability', pokemon, 'Air Lock');
			((this.effect as any).onStart as (p: Pokemon) => void).call(this, pokemon);
		},
		onStart(pokemon) {
			pokemon.abilityState.ending = false; // Clear the ending flag
			this.eachEvent('WeatherChange', this.effect);
		},
		onEnd(pokemon) {
			pokemon.abilityState.ending = true;
			this.eachEvent('WeatherChange', this.effect);
		},
		suppressWeather: true,
		flags: {},
		name: "Air Lock",
		rating: 1.5,
		num: 76,
	},
	analytic: {
		onBasePowerPriority: 21,
		onBasePower(basePower, pokemon) {
			let boosted = true;
			for (const target of this.getAllActive()) {
				if (target === pokemon) continue;
				if (this.queue.willMove(target)) {
					boosted = false;
					break;
				}
			}
			if (boosted) {
				this.debug('Analytic boost');
				return this.chainModify([5325, 4096]);
			}
		},
		flags: {},
		name: "Analytic",
		rating: 2.5,
		num: 148,
	},
	angerpoint: {
		onHit(target, source, move) {
			if (!target.hp) return;
			if (move?.effectType === 'Move' && target.getMoveHitData(move).crit) {
				this.boost({ atk: 12 }, target, target);
			}
		},
		flags: {},
		name: "Anger Point",
		rating: 1,
		num: 83,
	},
	angershell: {
		onDamage(damage, target, source, effect) {
			if (
				effect.effectType === "Move" &&
				!effect.multihit &&
				!(effect.hasSheerForce && source.hasAbility('sheerforce'))
			) {
				this.effectState.checkedAngerShell = false;
			} else {
				this.effectState.checkedAngerShell = true;
			}
		},
		onTryEatItem(item) {
			const healingItems = [
				'aguavberry', 'enigmaberry', 'figyberry', 'iapapaberry', 'magoberry', 'sitrusberry', 'wikiberry', 'oranberry', 'berryjuice',
			];
			if (healingItems.includes(item.id)) {
				return this.effectState.checkedAngerShell;
			}
			return true;
		},
		onAfterMoveSecondary(target, source, move) {
			this.effectState.checkedAngerShell = true;
			if (!source || source === target || !target.hp || !move.totalDamage) return;
			const lastAttackedBy = target.getLastAttackedBy();
			if (!lastAttackedBy) return;
			const damage = move.multihit ? move.totalDamage : lastAttackedBy.damage;
			if (target.hp <= target.maxhp / 2 && target.hp + damage > target.maxhp / 2) {
				this.boost({ atk: 1, spa: 1, spe: 1, def: -1, spd: -1 }, target, target);
			}
		},
		flags: {},
		name: "Anger Shell",
		rating: 3,
		num: 271,
	},
	anticipation: {
		onStart(pokemon) {
			for (const target of pokemon.foes()) {
				for (const moveSlot of target.moveSlots) {
					const move = this.dex.moves.get(moveSlot.move);
					if (move.category === 'Status') continue;
					const moveType = move.id === 'hiddenpower' ? target.hpType : move.type;
					if (
						this.dex.getImmunity(moveType, pokemon) && this.dex.getEffectiveness(moveType, pokemon) > 0 ||
						move.ohko
					) {
						this.add('-ability', pokemon, 'Anticipation');
						return;
					}
				}
			}
		},
		flags: {},
		name: "Anticipation",
		rating: 0.5,
		num: 107,
	},
	arenatrap: {
		onFoeTrapPokemon(pokemon) {
			if (!pokemon.isAdjacent(this.effectState.target)) return;
			if (pokemon.isGrounded()) {
				pokemon.tryTrap(true);
			}
		},
		onFoeMaybeTrapPokemon(pokemon, source) {
			if (!source) source = this.effectState.target;
			if (!source || !pokemon.isAdjacent(source)) return;
			if (pokemon.isGrounded(!pokemon.knownType)) { // Negate immunity if the type is unknown
				pokemon.maybeTrapped = true;
			}
		},
		flags: {},
		name: "Arena Trap",
		rating: 5,
		num: 71,
	},
	armortail: {
		onFoeTryMove(target, source, move) {
			const targetAllExceptions = ['perishsong', 'flowershield', 'rototiller'];
			if (move.target === 'foeSide' || (move.target === 'all' && !targetAllExceptions.includes(move.id))) {
				return;
			}

			const armorTailHolder = this.effectState.target;
			if ((source.isAlly(armorTailHolder) || move.target === 'all') && move.priority > 0.1) {
				this.attrLastMove('[still]');
				this.add('cant', armorTailHolder, 'ability: Armor Tail', move, `[of] ${target}`);
				return false;
			}
		},
		flags: { breakable: 1 },
		name: "Armor Tail",
		rating: 2.5,
		num: 296,
	},
	aromaveil: {
		onAllyTryAddVolatile(status, target, source, effect) {
			if (['attract', 'disable', 'encore', 'healblock', 'taunt', 'torment'].includes(status.id)) {
				if (effect.effectType === 'Move') {
					const effectHolder = this.effectState.target;
					this.add('-block', target, 'ability: Aroma Veil', `[of] ${effectHolder}`);
				}
				return null;
			}
		},
		flags: { breakable: 1 },
		name: "Aroma Veil",
		rating: 2,
		num: 165,
	},
	asoneglastrier: {
		onSwitchInPriority: 1,
		onStart(pokemon) {
			if (this.effectState.unnerved) return;
			this.add('-ability', pokemon, 'As One');
			this.add('-ability', pokemon, 'Unnerve');
			this.effectState.unnerved = true;
		},
		onEnd() {
			this.effectState.unnerved = false;
		},
		onFoeTryEatItem() {
			return !this.effectState.unnerved;
		},
		onSourceAfterFaint(length, target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				this.boost({ atk: length }, source, source, this.dex.abilities.get('chillingneigh'));
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
		name: "As One (Glastrier)",
		rating: 3.5,
		num: 266,
	},
	asonespectrier: {
		onSwitchInPriority: 1,
		onStart(pokemon) {
			if (this.effectState.unnerved) return;
			this.add('-ability', pokemon, 'As One');
			this.add('-ability', pokemon, 'Unnerve');
			this.effectState.unnerved = true;
		},
		onEnd() {
			this.effectState.unnerved = false;
		},
		onFoeTryEatItem() {
			return !this.effectState.unnerved;
		},
		onSourceAfterFaint(length, target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				this.boost({ spa: length }, source, source, this.dex.abilities.get('grimneigh'));
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
		name: "As One (Spectrier)",
		rating: 3.5,
		num: 267,
	},
	aurabreak: {
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Aura Break');
		},
		onAnyTryPrimaryHit(target, source, move) {
			if (target === source || move.category === 'Status') return;
			move.hasAuraBreak = true;
		},
		flags: { breakable: 1 },
		name: "Aura Break",
		rating: 1,
		num: 188,
	},
	baddreams: {
		onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			if (!pokemon.hp) return;
			for (const target of pokemon.foes()) {
				if (target.status === 'slp' || target.hasAbility('comatose')) {
					this.damage(target.baseMaxhp / 8, target, pokemon);
				}
			}
		},
		flags: {},
		name: "Bad Dreams",
		rating: 1.5,
		num: 123,
	},
	ballfetch: {
		flags: {},
		name: "Ball Fetch",
		rating: 0,
		num: 237,
	},
	battery: {
		onAllyBasePowerPriority: 22,
		onAllyBasePower(basePower, attacker, defender, move) {
			if (attacker !== this.effectState.target && move.category === 'Special') {
				this.debug('Battery boost');
				return this.chainModify([5325, 4096]);
			}
		},
		flags: {},
		name: "Battery",
		rating: 0,
		num: 217,
	},
	battlearmor: {
		onCriticalHit: false,
		flags: { breakable: 1 },
		name: "Battle Armor",
		rating: 1,
		num: 4,
	},
	battlebond: {
		onSourceAfterFaint(length, target, source, effect) {
			if (source.bondTriggered) return;
			if (effect?.effectType !== 'Move') return;
			if (source.species.id === 'greninjabond' && source.hp && !source.transformed && source.side.foePokemonLeft()) {
				this.boost({ atk: 1, spa: 1, spe: 1 }, source, source, this.effect);
				this.add('-activate', source, 'ability: Battle Bond');
				source.bondTriggered = true;
			}
		},
		onModifyMovePriority: -1,
		onModifyMove(move, attacker) {
			if (move.id === 'watershuriken' && attacker.species.name === 'Greninja-Ash' &&
				!attacker.transformed) {
				move.multihit = 3;
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
		name: "Battle Bond",
		rating: 3.5,
		num: 210,
	},
	beadsofruin: {
		onStart(pokemon) {
			if (this.suppressingAbility(pokemon)) return;
			this.add('-ability', pokemon, 'Beads of Ruin');
		},
		onAnyModifySpD(spd, target, source, move) {
			const abilityHolder = this.effectState.target;
			if (target.hasAbility('Beads of Ruin')) return;
			if (!move.ruinedSpD?.hasAbility('Beads of Ruin')) move.ruinedSpD = abilityHolder;
			if (move.ruinedSpD !== abilityHolder) return;
			this.debug('Beads of Ruin SpD drop');
			return this.chainModify(0.75);
		},
		flags: {},
		name: "Beads of Ruin",
		rating: 4.5,
		num: 284,
	},
	beastboost: {
		onSourceAfterFaint(length, target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				const bestStat = source.getBestStat(true, true);
				this.boost({ [bestStat]: length }, source);
			}
		},
		flags: {},
		name: "Beast Boost",
		rating: 3.5,
		num: 224,
	},
	berserk: {
		onDamage(damage, target, source, effect) {
			if (
				effect.effectType === "Move" &&
				!effect.multihit &&
				!(effect.hasSheerForce && source.hasAbility('sheerforce'))
			) {
				this.effectState.checkedBerserk = false;
			} else {
				this.effectState.checkedBerserk = true;
			}
		},
		onTryEatItem(item) {
			const healingItems = [
				'aguavberry', 'enigmaberry', 'figyberry', 'iapapaberry', 'magoberry', 'sitrusberry', 'wikiberry', 'oranberry', 'berryjuice',
			];
			if (healingItems.includes(item.id)) {
				return this.effectState.checkedBerserk;
			}
			return true;
		},
		onAfterMoveSecondary(target, source, move) {
			this.effectState.checkedBerserk = true;
			if (!source || source === target || !target.hp || !move.totalDamage) return;
			const lastAttackedBy = target.getLastAttackedBy();
			if (!lastAttackedBy) return;
			const damage = move.multihit && !move.smartTarget ? move.totalDamage : lastAttackedBy.damage;
			if (target.hp <= target.maxhp / 2 && target.hp + damage > target.maxhp / 2) {
				this.boost({ spa: 1 }, target, target);
			}
		},
		flags: {},
		name: "Berserk",
		rating: 2,
		num: 201,
	},
	bigpecks: {
		onTryBoost(boost, target, source, effect) {
			if (source && target === source) return;
			if (boost.def && boost.def < 0) {
				delete boost.def;
				if (!(effect as ActiveMove).secondaries && effect.id !== 'octolock') {
					this.add("-fail", target, "unboost", "Defense", "[from] ability: Big Pecks", `[of] ${target}`);
				}
			}
		},
		flags: { breakable: 1 },
		name: "Big Pecks",
		rating: 0.5,
		num: 145,
	},
	blaze: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Fire' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Blaze boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Fire' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Blaze boost');
				return this.chainModify(1.5);
			}
		},
		flags: {},
		name: "Blaze",
		rating: 2,
		num: 66,
	},
	bulletproof: {
		onTryHit(pokemon, target, move) {
			if (move.flags['bullet']) {
				this.add('-immune', pokemon, '[from] ability: Bulletproof');
				return null;
			}
		},
		flags: { breakable: 1 },
		name: "Bulletproof",
		rating: 3,
		num: 171,
	},
	cheekpouch: {
		onEatItem(item, pokemon) {
			this.heal(pokemon.baseMaxhp / 3);
		},
		flags: {},
		name: "Cheek Pouch",
		rating: 2,
		num: 167,
	},
	chillingneigh: {
		onSourceAfterFaint(length, target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				this.boost({ atk: length }, source);
			}
		},
		flags: {},
		name: "Chilling Neigh",
		rating: 3,
		num: 264,
	},
	chlorophyll: {
		onModifySpe(spe, pokemon) {
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(2);
			}
		},
		flags: {},
		name: "Chlorophyll",
		rating: 3,
		num: 34,
	},
	clearbody: {
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
		flags: { breakable: 1 },
		name: "Clear Body",
		rating: 2,
		num: 29,
	},
	cloudnine: {
		onSwitchIn(pokemon) {
			// Cloud Nine does not activate when Skill Swapped or when Neutralizing Gas leaves the field
			this.add('-ability', pokemon, 'Cloud Nine');
			((this.effect as any).onStart as (p: Pokemon) => void).call(this, pokemon);
		},
		onStart(pokemon) {
			pokemon.abilityState.ending = false; // Clear the ending flag
			this.eachEvent('WeatherChange', this.effect);
		},
		onEnd(pokemon) {
			pokemon.abilityState.ending = true;
			this.eachEvent('WeatherChange', this.effect);
		},
		suppressWeather: true,
		flags: {},
		name: "Cloud Nine",
		rating: 1.5,
		num: 13,
	},
	colorchange: {
		onAfterMoveSecondary(target, source, move) {
			if (!target.hp) return;
			const type = move.type;
			if (
				target.isActive && move.effectType === 'Move' && move.category !== 'Status' &&
				type !== '???' && !target.hasType(type)
			) {
				if (!target.setType(type)) return false;
				this.add('-start', target, 'typechange', type, '[from] ability: Color Change');

				if (target.side.active.length === 2 && target.position === 1) {
					// Curse Glitch
					const action = this.queue.willMove(target);
					if (action && action.move.id === 'curse') {
						action.targetLoc = -1;
					}
				}
			}
		},
		flags: {},
		name: "Color Change",
		rating: 0,
		num: 16,
	},
	comatose: {
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Comatose');
		},
		onSetStatus(status, target, source, effect) {
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Comatose');
			}
			return false;
		},
		// Permanent sleep "status" implemented in the relevant sleep-checking effects
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
		name: "Comatose",
		rating: 4,
		num: 213,
	},
	commander: {
		onAnySwitchInPriority: -2,
		onAnySwitchIn() {
			((this.effect as any).onUpdate as (p: Pokemon) => void).call(this, this.effectState.target);
		},
		onStart(pokemon) {
			((this.effect as any).onUpdate as (p: Pokemon) => void).call(this, pokemon);
		},
		onUpdate(pokemon) {
			if (this.gameType !== 'doubles') return;
			// don't run between when a Pokemon switches in and the resulting onSwitchIn event
			if (this.queue.peek()?.choice === 'runSwitch') return;

			const ally = pokemon.allies()[0];
			if (pokemon.switchFlag || ally?.switchFlag) return;
			if (!ally || pokemon.baseSpecies.baseSpecies !== 'Tatsugiri' || ally.baseSpecies.baseSpecies !== 'Dondozo') {
				// Handle any edge cases
				if (pokemon.getVolatile('commanding')) pokemon.removeVolatile('commanding');
				return;
			}

			if (!pokemon.getVolatile('commanding')) {
				// If Dondozo already was commanded this fails
				if (ally.getVolatile('commanded')) return;
				// Cancel all actions this turn for pokemon if applicable
				this.queue.cancelAction(pokemon);
				// Add volatiles to both pokemon
				this.add('-activate', pokemon, 'ability: Commander', `[of] ${ally}`);
				pokemon.addVolatile('commanding');
				ally.addVolatile('commanded', pokemon);
				// Continued in conditions.ts in the volatiles
			} else {
				if (!ally.fainted) return;
				pokemon.removeVolatile('commanding');
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1 },
		name: "Commander",
		rating: 0,
		num: 279,
	},
	competitive: {
		onAfterEachBoost(boost, target, source, effect) {
			if (!source || target.isAlly(source)) {
				return;
			}
			let statsLowered = false;
			let i: BoostID;
			for (i in boost) {
				if (boost[i]! < 0) {
					statsLowered = true;
				}
			}
			if (statsLowered) {
				this.boost({ spa: 2 }, target, target, null, false, true);
			}
		},
		flags: {},
		name: "Competitive",
		rating: 2.5,
		num: 172,
	},
	compoundeyes: {
		onSourceModifyAccuracyPriority: -1,
		onSourceModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			this.debug('compoundeyes - enhancing accuracy');
			return this.chainModify([5325, 4096]);
		},
		flags: {},
		name: "Compound Eyes",
		rating: 3,
		num: 14,
	},
	contrary: {
		onChangeBoost(boost, target, source, effect) {
			if (effect && effect.id === 'zpower') return;
			let i: BoostID;
			for (i in boost) {
				boost[i]! *= -1;
			}
		},
		flags: { breakable: 1 },
		name: "Contrary",
		rating: 4.5,
		num: 126,
	},
	corrosion: {
		// Implemented in sim/pokemon.js:Pokemon#setStatus
		flags: {},
		name: "Corrosion",
		rating: 2.5,
		num: 212,
	},
	costar: {
		onSwitchInPriority: -2,
		onStart(pokemon) {
			const ally = pokemon.allies()[0];
			if (!ally) return;

			let i: BoostID;
			for (i in ally.boosts) {
				pokemon.boosts[i] = ally.boosts[i];
			}
			const volatilesToCopy = ['dragoncheer', 'focusenergy', 'gmaxchistrike', 'laserfocus'];
			// we need to be sure to remove all the overlapping crit volatiles before trying to add any
			for (const volatile of volatilesToCopy) pokemon.removeVolatile(volatile);
			for (const volatile of volatilesToCopy) {
				if (ally.volatiles[volatile]) {
					pokemon.addVolatile(volatile);
					if (volatile === 'gmaxchistrike') pokemon.volatiles[volatile].layers = ally.volatiles[volatile].layers;
					if (volatile === 'dragoncheer') pokemon.volatiles[volatile].hasDragonType = ally.volatiles[volatile].hasDragonType;
				}
			}
			this.add('-copyboost', pokemon, ally, '[from] ability: Costar');
		},
		flags: {},
		name: "Costar",
		rating: 0,
		num: 294,
	},
	cottondown: {
		onDamagingHit(damage, target, source, move) {
			let activated = false;
			for (const pokemon of this.getAllActive()) {
				if (pokemon === target || pokemon.fainted) continue;
				if (!activated) {
					this.add('-ability', target, 'Cotton Down');
					activated = true;
				}
				this.boost({ spe: -1 }, pokemon, target, null, true);
			}
		},
		flags: {},
		name: "Cotton Down",
		rating: 2,
		num: 238,
	},
	cudchew: {
		onEatItem(item, pokemon, source, effect) {
			if (item.isBerry && (!effect || !['bugbite', 'pluck'].includes(effect.id))) {
				this.effectState.berry = item;
				this.effectState.counter = 2;
				// This is needed in case the berry was eaten during residuals, preventing the timer from decreasing this turn
				if (!this.queue.peek()) this.effectState.counter--;
			}
		},
		onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			if (!this.effectState.berry || !pokemon.hp) return;
			if (--this.effectState.counter <= 0) {
				const item = this.effectState.berry;
				this.add('-activate', pokemon, 'ability: Cud Chew');
				this.add('-enditem', pokemon, item.name, '[eat]');
				if (this.singleEvent('Eat', item, null, pokemon, null, null)) {
					this.runEvent('EatItem', pokemon, null, null, item);
				}
				if (item.onEat) pokemon.ateBerry = true;
				delete this.effectState.berry;
				delete this.effectState.counter;
			}
		},
		flags: {},
		name: "Cud Chew",
		rating: 2,
		num: 291,
	},
	curiousmedicine: {
		onStart(pokemon) {
			for (const ally of pokemon.adjacentAllies()) {
				ally.clearBoosts();
				this.add('-clearboost', ally, '[from] ability: Curious Medicine', `[of] ${pokemon}`);
			}
		},
		flags: {},
		name: "Curious Medicine",
		rating: 0,
		num: 261,
	},
	cursedbody: {
		onDamagingHit(damage, target, source, move) {
			if (source.volatiles['disable']) return;
			if (!move.isMax && !move.flags['futuremove'] && move.id !== 'struggle') {
				if (this.randomChance(3, 10)) {
					source.addVolatile('disable', this.effectState.target);
				}
			}
		},
		flags: {},
		name: "Cursed Body",
		rating: 2,
		num: 130,
	},
	cutecharm: {
		onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, source, target)) {
				if (this.randomChance(3, 10)) {
					source.addVolatile('attract', this.effectState.target);
				}
			}
		},
		flags: {},
		name: "Cute Charm",
		rating: 0.5,
		num: 56,
	},
	damp: {
		onAnyTryMove(target, source, effect) {
			if (['explosion', 'mindblown', 'mistyexplosion', 'selfdestruct'].includes(effect.id)) {
				this.attrLastMove('[still]');
				this.add('cant', this.effectState.target, 'ability: Damp', effect, `[of] ${target}`);
				return false;
			}
		},
		onAnyDamage(damage, target, source, effect) {
			if (effect && effect.name === 'Aftermath') {
				return false;
			}
		},
		flags: { breakable: 1 },
		name: "Damp",
		rating: 0.5,
		num: 6,
	},
	dancer: {
		flags: {},
		name: "Dancer",
		// implemented in runMove in scripts.js
		rating: 1.5,
		num: 216,
	},
	darkaura: {
		onStart(pokemon) {
			if (this.suppressingAbility(pokemon)) return;
			this.add('-ability', pokemon, 'Dark Aura');
		},
		onAnyBasePowerPriority: 20,
		onAnyBasePower(basePower, source, target, move) {
			if (target === source || move.category === 'Status' || move.type !== 'Dark') return;
			if (!move.auraBooster?.hasAbility('Dark Aura')) move.auraBooster = this.effectState.target;
			if (move.auraBooster !== this.effectState.target) return;
			return this.chainModify([move.hasAuraBreak ? 3072 : 5448, 4096]);
		},
		flags: {},
		name: "Dark Aura",
		rating: 3,
		num: 186,
	},
	dauntlessshield: {
		onStart(pokemon) {
			if (pokemon.shieldBoost) return;
			pokemon.shieldBoost = true;
			this.boost({ def: 1 }, pokemon);
		},
		flags: {},
		name: "Dauntless Shield",
		rating: 3.5,
		num: 235,
	},
	dazzling: {
		onFoeTryMove(target, source, move) {
			const targetAllExceptions = ['perishsong', 'flowershield', 'rototiller'];
			if (move.target === 'foeSide' || (move.target === 'all' && !targetAllExceptions.includes(move.id))) {
				return;
			}

			const dazzlingHolder = this.effectState.target;
			if ((source.isAlly(dazzlingHolder) || move.target === 'all') && move.priority > 0.1) {
				this.attrLastMove('[still]');
				this.add('cant', dazzlingHolder, 'ability: Dazzling', move, `[of] ${target}`);
				return false;
			}
		},
		flags: { breakable: 1 },
		name: "Dazzling",
		rating: 2.5,
		num: 219,
	},
	defeatist: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				return this.chainModify(0.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				return this.chainModify(0.5);
			}
		},
		flags: {},
		name: "Defeatist",
		rating: -1,
		num: 129,
	},
	defiant: {
		onAfterEachBoost(boost, target, source, effect) {
			if (!source || target.isAlly(source)) {
				return;
			}
			let statsLowered = false;
			let i: BoostID;
			for (i in boost) {
				if (boost[i]! < 0) {
					statsLowered = true;
				}
			}
			if (statsLowered) {
				this.boost({ atk: 2 }, target, target, null, false, true);
			}
		},
		flags: {},
		name: "Defiant",
		rating: 3,
		num: 128,
	},
	deltastream: {
		onStart(source) {
			this.field.setWeather('deltastream');
		},
		onAnySetWeather(target, source, weather) {
			const strongWeathers = ['desolateland', 'primordialsea', 'deltastream'];
			if (this.field.getWeather().id === 'deltastream' && !strongWeathers.includes(weather.id)) return false;
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
		},
		flags: {},
		name: "Delta Stream",
		rating: 4,
		num: 191,
	},
	desolateland: {
		onStart(source) {
			this.field.setWeather('desolateland');
		},
		onAnySetWeather(target, source, weather) {
			const strongWeathers = ['desolateland', 'primordialsea', 'deltastream'];
			if (this.field.getWeather().id === 'desolateland' && !strongWeathers.includes(weather.id)) return false;
		},
		onEnd(pokemon) {
			if (this.field.weatherState.source !== pokemon) return;
			for (const target of this.getAllActive()) {
				if (target === pokemon) continue;
				if (target.hasAbility('desolateland')) {
					this.field.weatherState.source = target;
					return;
				}
			}
			this.field.clearWeather();
		},
		flags: {},
		name: "Desolate Land",
		rating: 4.5,
		num: 190,
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

			if (!target.runImmunity(move)) return;
			return false;
		},
		onEffectiveness(typeMod, target, type, move) {
			if (!target || move.category === 'Status') return;
			if (!['mimikyu', 'mimikyutotem'].includes(target.species.id)) {
				return;
			}

			const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
			if (hitSub) return;

			if (!target.runImmunity(move)) return;
			return 0;
		},
		onUpdate(pokemon) {
			if (['mimikyu', 'mimikyutotem'].includes(pokemon.species.id) && this.effectState.busted) {
				const speciesid = pokemon.species.id === 'mimikyutotem' ? 'Mimikyu-Busted-Totem' : 'Mimikyu-Busted';
				pokemon.formeChange(speciesid, this.effect, true);
				this.damage(pokemon.baseMaxhp / 8, pokemon, pokemon, this.dex.species.get(speciesid));
			}
		},
		flags: {
			failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1,
			breakable: 1, notransform: 1,
		},
		name: "Disguise",
		rating: 3.5,
		num: 209,
	},
	download: {
		onStart(pokemon) {
			let totaldef = 0;
			let totalspd = 0;
			for (const target of pokemon.foes()) {
				totaldef += target.getStat('def', false, true);
				totalspd += target.getStat('spd', false, true);
			}
			if (totaldef && totaldef >= totalspd) {
				this.boost({ spa: 1 });
			} else if (totalspd) {
				this.boost({ atk: 1 });
			}
		},
		flags: {},
		name: "Download",
		rating: 3.5,
		num: 88,
	},
	dragonsmaw: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Dragon') {
				this.debug('Dragon\'s Maw boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Dragon') {
				this.debug('Dragon\'s Maw boost');
				return this.chainModify(1.5);
			}
		},
		flags: {},
		name: "Dragon's Maw",
		rating: 3.5,
		num: 263,
	},
	drizzle: {
		onStart(source) {
			if (source.species.id === 'kyogre' && source.item === 'blueorb') return;
			this.field.setWeather('raindance');
		},
		flags: {},
		name: "Drizzle",
		rating: 4,
		num: 2,
	},
	drought: {
		onStart(source) {
			if (source.species.id === 'groudon' && source.item === 'redorb') return;
			this.field.setWeather('sunnyday');
		},
		flags: {},
		name: "Drought",
		rating: 4,
		num: 70,
	},
	dryskin: {
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Water') {
				if (!this.heal(target.baseMaxhp / 4)) {
					this.add('-immune', target, '[from] ability: Dry Skin');
				}
				return null;
			}
		},
		onSourceBasePowerPriority: 17,
		onSourceBasePower(basePower, attacker, defender, move) {
			if (move.type === 'Fire') {
				return this.chainModify(1.25);
			}
		},
		onWeather(target, source, effect) {
			if (target.hasItem('utilityumbrella')) return;
			if (effect.id === 'raindance' || effect.id === 'primordialsea') {
				this.heal(target.baseMaxhp / 8);
			} else if (effect.id === 'sunnyday' || effect.id === 'desolateland') {
				this.damage(target.baseMaxhp / 8, target, target);
			}
		},
		flags: { breakable: 1 },
		name: "Dry Skin",
		rating: 3,
		num: 87,
	},
	earlybird: {
		flags: {},
		name: "Early Bird",
		// Implemented in statuses.js
		rating: 1.5,
		num: 48,
	},
	eartheater: {
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Ground') {
				if (!this.heal(target.baseMaxhp / 4)) {
					this.add('-immune', target, '[from] ability: Earth Eater');
				}
				return null;
			}
		},
		flags: { breakable: 1 },
		name: "Earth Eater",
		rating: 3.5,
		num: 297,
	},
	effectspore: {
		onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, source, target) && !source.status && source.runStatusImmunity('powder')) {
				const r = this.random(100);
				if (r < 11) {
					source.setStatus('slp', target);
				} else if (r < 21) {
					source.setStatus('par', target);
				} else if (r < 30) {
					source.setStatus('psn', target);
				}
			}
		},
		flags: {},
		name: "Effect Spore",
		rating: 2,
		num: 27,
	},
	electricsurge: {
		onStart(source) {
			this.field.setTerrain('electricterrain');
		},
		flags: {},
		name: "Electric Surge",
		rating: 4,
		num: 226,
	},
	electromorphosis: {
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) {
			target.addVolatile('charge');
		},
		flags: {},
		name: "Electromorphosis",
		rating: 3,
		num: 280,
	},
	embodyaspectcornerstone: {
		onStart(pokemon) {
			if (pokemon.baseSpecies.name === 'Ogerpon-Cornerstone-Tera' && pokemon.terastallized &&
				!this.effectState.embodied) {
				this.effectState.embodied = true;
				this.boost({ def: 1 }, pokemon);
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1 },
		name: "Embody Aspect (Cornerstone)",
		rating: 3.5,
		num: 304,
	},
	embodyaspecthearthflame: {
		onStart(pokemon) {
			if (pokemon.baseSpecies.name === 'Ogerpon-Hearthflame-Tera' && pokemon.terastallized &&
				!this.effectState.embodied) {
				this.effectState.embodied = true;
				this.boost({ atk: 1 }, pokemon);
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1 },
		name: "Embody Aspect (Hearthflame)",
		rating: 3.5,
		num: 303,
	},
	embodyaspectteal: {
		onStart(pokemon) {
			if (pokemon.baseSpecies.name === 'Ogerpon-Teal-Tera' && pokemon.terastallized &&
				!this.effectState.embodied) {
				this.effectState.embodied = true;
				this.boost({ spe: 1 }, pokemon);
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1 },
		name: "Embody Aspect (Teal)",
		rating: 3.5,
		num: 301,
	},
	embodyaspectwellspring: {
		onStart(pokemon) {
			if (pokemon.baseSpecies.name === 'Ogerpon-Wellspring-Tera' && pokemon.terastallized &&
				!this.effectState.embodied) {
				this.effectState.embodied = true;
				this.boost({ spd: 1 }, pokemon);
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1 },
		name: "Embody Aspect (Wellspring)",
		rating: 3.5,
		num: 302,
	},
	emergencyexit: {
		onEmergencyExit(target) {
			if (!this.canSwitch(target.side) || target.forceSwitchFlag || target.switchFlag) return;
			for (const side of this.sides) {
				for (const active of side.active) {
					active.switchFlag = false;
				}
			}
			target.switchFlag = true;
			this.add('-activate', target, 'ability: Emergency Exit');
		},
		flags: {},
		name: "Emergency Exit",
		rating: 1,
		num: 194,
	},
	fairyaura: {
		onStart(pokemon) {
			if (this.suppressingAbility(pokemon)) return;
			this.add('-ability', pokemon, 'Fairy Aura');
		},
		onAnyBasePowerPriority: 20,
		onAnyBasePower(basePower, source, target, move) {
			if (target === source || move.category === 'Status' || move.type !== 'Fairy') return;
			if (!move.auraBooster?.hasAbility('Fairy Aura')) move.auraBooster = this.effectState.target;
			if (move.auraBooster !== this.effectState.target) return;
			return this.chainModify([move.hasAuraBreak ? 3072 : 5448, 4096]);
		},
		flags: {},
		name: "Fairy Aura",
		rating: 3,
		num: 187,
	},
	filter: {
		onSourceModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).typeMod > 0) {
				this.debug('Filter neutralize');
				return this.chainModify(0.75);
			}
		},
		flags: { breakable: 1 },
		name: "Filter",
		rating: 3,
		num: 111,
	},
	flamebody: {
		onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, source, target)) {
				if (this.randomChance(3, 10)) {
					source.trySetStatus('brn', target);
				}
			}
		},
		flags: {},
		name: "Flame Body",
		rating: 2,
		num: 49,
	},
	flareboost: {
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if (attacker.status === 'brn' && move.category === 'Special') {
				return this.chainModify(1.5);
			}
		},
		flags: {},
		name: "Flare Boost",
		rating: 2,
		num: 138,
	},
	flashfire: {
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Fire') {
				move.accuracy = true;
				if (!target.addVolatile('flashfire')) {
					this.add('-immune', target, '[from] ability: Flash Fire');
				}
				return null;
			}
		},
		onEnd(pokemon) {
			pokemon.removeVolatile('flashfire');
		},
		condition: {
			noCopy: true, // doesn't get copied by Baton Pass
			onStart(target) {
				this.add('-start', target, 'ability: Flash Fire');
			},
			onModifyAtkPriority: 5,
			onModifyAtk(atk, attacker, defender, move) {
				if (move.type === 'Fire' && attacker.hasAbility('flashfire')) {
					this.debug('Flash Fire boost');
					return this.chainModify(1.5);
				}
			},
			onModifySpAPriority: 5,
			onModifySpA(atk, attacker, defender, move) {
				if (move.type === 'Fire' && attacker.hasAbility('flashfire')) {
					this.debug('Flash Fire boost');
					return this.chainModify(1.5);
				}
			},
			onEnd(target) {
				this.add('-end', target, 'ability: Flash Fire', '[silent]');
			},
		},
		flags: { breakable: 1 },
		name: "Flash Fire",
		rating: 3.5,
		num: 18,
	},
	flowergift: {
		onSwitchInPriority: -2,
		onStart(pokemon) {
			this.singleEvent('WeatherChange', this.effect, this.effectState, pokemon);
		},
		onWeatherChange(pokemon) {
			if (!pokemon.isActive || pokemon.baseSpecies.baseSpecies !== 'Cherrim' || pokemon.transformed) return;
			if (!pokemon.hp) return;
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				if (pokemon.species.id !== 'cherrimsunshine') {
					pokemon.formeChange('Cherrim-Sunshine', this.effect, false, '0', '[msg]');
				}
			} else {
				if (pokemon.species.id === 'cherrimsunshine') {
					pokemon.formeChange('Cherrim', this.effect, false, '0', '[msg]');
				}
			}
		},
		onAllyModifyAtkPriority: 3,
		onAllyModifyAtk(atk, pokemon) {
			if (this.effectState.target.baseSpecies.baseSpecies !== 'Cherrim') return;
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.5);
			}
		},
		onAllyModifySpDPriority: 4,
		onAllyModifySpD(spd, pokemon) {
			if (this.effectState.target.baseSpecies.baseSpecies !== 'Cherrim') return;
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.5);
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, breakable: 1 },
		name: "Flower Gift",
		rating: 1,
		num: 122,
	},
	flowerveil: {
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
				this.add('-block', target, 'ability: Flower Veil', `[of] ${effectHolder}`);
			}
		},
		onAllySetStatus(status, target, source, effect) {
			if (target.hasType('Grass') && source && target !== source && effect && effect.id !== 'yawn') {
				this.debug('interrupting setStatus with Flower Veil');
				if (effect.name === 'Synchronize' || (effect.effectType === 'Move' && !effect.secondaries)) {
					const effectHolder = this.effectState.target;
					this.add('-block', target, 'ability: Flower Veil', `[of] ${effectHolder}`);
				}
				return null;
			}
		},
		onAllyTryAddVolatile(status, target) {
			if (target.hasType('Grass') && status.id === 'yawn') {
				this.debug('Flower Veil blocking yawn');
				const effectHolder = this.effectState.target;
				this.add('-block', target, 'ability: Flower Veil', `[of] ${effectHolder}`);
				return null;
			}
		},
		flags: { breakable: 1 },
		name: "Flower Veil",
		rating: 0,
		num: 166,
	},
	fluffy: {
		onSourceModifyDamage(damage, source, target, move) {
			let mod = 1;
			if (move.type === 'Fire') mod *= 2;
			if (move.flags['contact']) mod /= 2;
			return this.chainModify(mod);
		},
		flags: { breakable: 1 },
		name: "Fluffy",
		rating: 3.5,
		num: 218,
	},
	forecast: {
		onSwitchInPriority: -2,
		onStart(pokemon) {
			this.singleEvent('WeatherChange', this.effect, this.effectState, pokemon);
		},
		onWeatherChange(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Castform' || pokemon.transformed) return;
			let forme = null;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				if (pokemon.species.id !== 'castformsunny') forme = 'Castform-Sunny';
				break;
			case 'raindance':
			case 'primordialsea':
				if (pokemon.species.id !== 'castformrainy') forme = 'Castform-Rainy';
				break;
			case 'hail':
			case 'snowscape':
				if (pokemon.species.id !== 'castformsnowy') forme = 'Castform-Snowy';
				break;
			default:
				if (pokemon.species.id !== 'castform') forme = 'Castform';
				break;
			}
			if (pokemon.isActive && forme) {
				pokemon.formeChange(forme, this.effect, false, '0', '[msg]');
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1 },
		name: "Forecast",
		rating: 2,
		num: 59,
	},
	forewarn: {
		onStart(pokemon) {
			let warnMoves: (Move | Pokemon)[][] = [];
			let warnBp = 1;
			for (const target of pokemon.foes()) {
				for (const moveSlot of target.moveSlots) {
					const move = this.dex.moves.get(moveSlot.move);
					let bp = move.basePower;
					if (move.ohko) bp = 150;
					if (move.id === 'counter' || move.id === 'metalburst' || move.id === 'mirrorcoat') bp = 120;
					if (bp === 1) bp = 80;
					if (!bp && move.category !== 'Status') bp = 80;
					if (bp > warnBp) {
						warnMoves = [[move, target]];
						warnBp = bp;
					} else if (bp === warnBp) {
						warnMoves.push([move, target]);
					}
				}
			}
			if (!warnMoves.length) return;
			const [warnMoveName, warnTarget] = this.sample(warnMoves);
			this.add('-activate', pokemon, 'ability: Forewarn', warnMoveName, `[of] ${warnTarget}`);
		},
		flags: {},
		name: "Forewarn",
		rating: 0.5,
		num: 108,
	},
	friendguard: {
		onAnyModifyDamage(damage, source, target, move) {
			if (target !== this.effectState.target && target.isAlly(this.effectState.target)) {
				this.debug('Friend Guard weaken');
				return this.chainModify(0.75);
			}
		},
		flags: { breakable: 1 },
		name: "Friend Guard",
		rating: 0,
		num: 132,
	},
	frisk: {
		onStart(pokemon) {
			for (const target of pokemon.foes()) {
				if (target.item) {
					this.add('-item', target, target.getItem().name, '[from] ability: Frisk', `[of] ${pokemon}`);
				}
			}
		},
		flags: {},
		name: "Frisk",
		rating: 1.5,
		num: 119,
	},
	fullmetalbody: {
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
				this.add("-fail", target, "unboost", "[from] ability: Full Metal Body", `[of] ${target}`);
			}
		},
		flags: {},
		name: "Full Metal Body",
		rating: 2,
		num: 230,
	},
	furcoat: {
		onModifyDefPriority: 6,
		onModifyDef(def) {
			return this.chainModify(2);
		},
		flags: { breakable: 1 },
		name: "Fur Coat",
		rating: 4,
		num: 169,
	},
	galewings: {
		onModifyPriority(priority, pokemon, target, move) {
			if (move?.type === 'Flying' && pokemon.hp === pokemon.maxhp) return priority + 1;
		},
		flags: {},
		name: "Gale Wings",
		rating: 1.5,
		num: 177,
	},
	galvanize: {
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.type === 'Normal' && (!noModifyType.includes(move.id) || this.activeMove?.isMax) &&
				!(move.isZ && move.category !== 'Status') && !(move.name === 'Tera Blast' && pokemon.terastallized)) {
				move.type = 'Electric';
				move.typeChangerBoosted = this.effect;
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (move.typeChangerBoosted === this.effect) return this.chainModify([4915, 4096]);
		},
		flags: {},
		name: "Galvanize",
		rating: 4,
		num: 206,
	},
	gluttony: {
		onStart(pokemon) {
			pokemon.abilityState.gluttony = true;
		},
		onDamage(item, pokemon) {
			pokemon.abilityState.gluttony = true;
		},
		flags: {},
		name: "Gluttony",
		rating: 1.5,
		num: 82,
	},
	goodasgold: {
		onTryHit(target, source, move) {
			if (move.category === 'Status' && target !== source) {
				this.add('-immune', target, '[from] ability: Good as Gold');
				return null;
			}
		},
		flags: { breakable: 1 },
		name: "Good as Gold",
		rating: 5,
		num: 283,
	},
	gooey: {
		onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, source, target, true)) {
				this.add('-ability', target, 'Gooey');
				this.boost({ spe: -1 }, source, target, null, true);
			}
		},
		flags: {},
		name: "Gooey",
		rating: 2,
		num: 183,
	},
	gorillatactics: {
		onStart(pokemon) {
			pokemon.abilityState.choiceLock = "";
		},
		onBeforeMove(pokemon, target, move) {
			if (move.isZOrMaxPowered || move.id === 'struggle') return;
			if (pokemon.abilityState.choiceLock && pokemon.abilityState.choiceLock !== move.id) {
				// Fails unless ability is being ignored (these events will not run), no PP lost.
				this.addMove('move', pokemon, move.name);
				this.attrLastMove('[still]');
				this.debug("Disabled by Gorilla Tactics");
				this.add('-fail', pokemon);
				return false;
			}
		},
		onModifyMove(move, pokemon) {
			if (pokemon.abilityState.choiceLock || move.isZOrMaxPowered || move.id === 'struggle') return;
			pokemon.abilityState.choiceLock = move.id;
		},
		onModifyAtkPriority: 1,
		onModifyAtk(atk, pokemon) {
			if (pokemon.volatiles['dynamax']) return;
			// PLACEHOLDER
			this.debug('Gorilla Tactics Atk Boost');
			return this.chainModify(1.5);
		},
		onDisableMove(pokemon) {
			if (!pokemon.abilityState.choiceLock) return;
			if (pokemon.volatiles['dynamax']) return;
			for (const moveSlot of pokemon.moveSlots) {
				if (moveSlot.id !== pokemon.abilityState.choiceLock) {
					pokemon.disableMove(moveSlot.id, false, this.effectState.sourceEffect);
				}
			}
		},
		onEnd(pokemon) {
			pokemon.abilityState.choiceLock = "";
		},
		flags: {},
		name: "Gorilla Tactics",
		rating: 4.5,
		num: 255,
	},
	grasspelt: {
		onModifyDefPriority: 6,
		onModifyDef(pokemon) {
			if (this.field.isTerrain('grassyterrain')) return this.chainModify(1.5);
		},
		flags: { breakable: 1 },
		name: "Grass Pelt",
		rating: 0.5,
		num: 179,
	},
	grassysurge: {
		onStart(source) {
			this.field.setTerrain('grassyterrain');
		},
		flags: {},
		name: "Grassy Surge",
		rating: 4,
		num: 229,
	},
	grimneigh: {
		onSourceAfterFaint(length, target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				this.boost({ spa: length }, source);
			}
		},
		flags: {},
		name: "Grim Neigh",
		rating: 3,
		num: 265,
	},
	guarddog: {
		onDragOutPriority: 1,
		onDragOut(pokemon) {
			this.add('-activate', pokemon, 'ability: Guard Dog');
			return null;
		},
		onTryBoostPriority: 2,
		onTryBoost(boost, target, source, effect) {
			if (effect.name === 'Intimidate' && boost.atk) {
				delete boost.atk;
				this.boost({ atk: 1 }, target, target, null, false, true);
			}
		},
		flags: { breakable: 1 },
		name: "Guard Dog",
		rating: 2,
		num: 275,
	},
	gulpmissile: {
		onDamagingHit(damage, target, source, move) {
			if (!source.hp || !source.isActive || target.isSemiInvulnerable()) return;
			if (['cramorantgulping', 'cramorantgorging'].includes(target.species.id)) {
				this.damage(source.baseMaxhp / 4, source, target);
				if (target.species.id === 'cramorantgulping') {
					this.boost({ def: -1 }, source, target, null, true);
				} else {
					source.trySetStatus('par', target, move);
				}
				target.formeChange('cramorant', move);
			}
		},
		// The Dive part of this mechanic is implemented in Dive's `onTryMove` in moves.ts
		onSourceTryPrimaryHit(target, source, effect) {
			if (effect?.id === 'surf' && source.hasAbility('gulpmissile') && source.species.name === 'Cramorant') {
				const forme = source.hp <= source.maxhp / 2 ? 'cramorantgorging' : 'cramorantgulping';
				source.formeChange(forme, effect);
			}
		},
		flags: { cantsuppress: 1, notransform: 1 },
		name: "Gulp Missile",
		rating: 2.5,
		num: 241,
	},
	guts: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, pokemon) {
			if (pokemon.status) {
				return this.chainModify(1.5);
			}
		},
		flags: {},
		name: "Guts",
		rating: 3.5,
		num: 62,
	},
	hadronengine: {
		onStart(pokemon) {
			if (!this.field.setTerrain('electricterrain') && this.field.isTerrain('electricterrain')) {
				this.add('-activate', pokemon, 'ability: Hadron Engine');
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (this.field.isTerrain('electricterrain')) {
				this.debug('Hadron Engine boost');
				return this.chainModify([5461, 4096]);
			}
		},
		flags: {},
		name: "Hadron Engine",
		rating: 4.5,
		num: 289,
	},
	harvest: {
		onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			if (this.field.isWeather(['sunnyday', 'desolateland']) || this.randomChance(1, 2)) {
				if (pokemon.hp && !pokemon.item && this.dex.items.get(pokemon.lastItem).isBerry) {
					pokemon.setItem(pokemon.lastItem);
					pokemon.lastItem = '';
					this.add('-item', pokemon, pokemon.getItem(), '[from] ability: Harvest');
				}
			}
		},
		flags: {},
		name: "Harvest",
		rating: 2.5,
		num: 139,
	},
	healer: {
		onResidualOrder: 5,
		onResidualSubOrder: 3,
		onResidual(pokemon) {
			for (const allyActive of pokemon.adjacentAllies()) {
				if (allyActive.status && this.randomChance(3, 10)) {
					this.add('-activate', pokemon, 'ability: Healer');
					allyActive.cureStatus();
				}
			}
		},
		flags: {},
		name: "Healer",
		rating: 0,
		num: 131,
	},
	heatproof: {
		onSourceModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				this.debug('Heatproof Atk weaken');
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				this.debug('Heatproof SpA weaken');
				return this.chainModify(0.5);
			}
		},
		onDamage(damage, target, source, effect) {
			if (effect && effect.id === 'brn') {
				return damage / 2;
			}
		},
		flags: { breakable: 1 },
		name: "Heatproof",
		rating: 2,
		num: 85,
	},
	heavymetal: {
		onModifyWeightPriority: 1,
		onModifyWeight(weighthg) {
			return weighthg * 2;
		},
		flags: { breakable: 1 },
		name: "Heavy Metal",
		rating: 0,
		num: 134,
	},
	honeygather: {
		flags: {},
		name: "Honey Gather",
		rating: 0,
		num: 118,
	},
	hospitality: {
		onSwitchInPriority: -2,
		onStart(pokemon) {
			for (const ally of pokemon.adjacentAllies()) {
				this.heal(ally.baseMaxhp / 4, ally, pokemon);
			}
		},
		flags: {},
		name: "Hospitality",
		rating: 0,
		num: 299,
	},
	hugepower: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk) {
			return this.chainModify(2);
		},
		flags: {},
		name: "Huge Power",
		rating: 5,
		num: 37,
	},
	hungerswitch: {
		onResidualOrder: 29,
		onResidual(pokemon) {
			if (pokemon.species.baseSpecies !== 'Morpeko' || pokemon.terastallized) return;
			const targetForme = pokemon.species.name === 'Morpeko' ? 'Morpeko-Hangry' : 'Morpeko';
			pokemon.formeChange(targetForme);
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1 },
		name: "Hunger Switch",
		rating: 1,
		num: 258,
	},
	hustle: {
		// This should be applied directly to the stat as opposed to chaining with the others
		onModifyAtkPriority: 5,
		onModifyAtk(atk) {
			return this.modify(atk, 1.5);
		},
		onSourceModifyAccuracyPriority: -1,
		onSourceModifyAccuracy(accuracy, target, source, move) {
			if (move.category === 'Physical' && typeof accuracy === 'number') {
				return this.chainModify([3277, 4096]);
			}
		},
		flags: {},
		name: "Hustle",
		rating: 3.5,
		num: 55,
	},
	hydration: {
		onResidualOrder: 5,
		onResidualSubOrder: 3,
		onResidual(pokemon) {
			if (pokemon.status && ['raindance', 'primordialsea'].includes(pokemon.effectiveWeather())) {
				this.debug('hydration');
				this.add('-activate', pokemon, 'ability: Hydration');
				pokemon.cureStatus();
			}
		},
		flags: {},
		name: "Hydration",
		rating: 1.5,
		num: 93,
	},
	hypercutter: {
		onTryBoost(boost, target, source, effect) {
			if (source && target === source) return;
			if (boost.atk && boost.atk < 0) {
				delete boost.atk;
				if (!(effect as ActiveMove).secondaries) {
					this.add("-fail", target, "unboost", "Attack", "[from] ability: Hyper Cutter", `[of] ${target}`);
				}
			}
		},
		flags: { breakable: 1 },
		name: "Hyper Cutter",
		rating: 1.5,
		num: 52,
	},
	icebody: {
		onWeather(target, source, effect) {
			if (effect.id === 'hail' || effect.id === 'snowscape') {
				this.heal(target.baseMaxhp / 16);
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'hail') return false;
		},
		flags: {},
		name: "Ice Body",
		rating: 1,
		num: 115,
	},
	iceface: {
		onSwitchInPriority: -2,
		onStart(pokemon) {
			if (this.field.isWeather(['hail', 'snowscape']) && pokemon.species.id === 'eiscuenoice') {
				this.add('-activate', pokemon, 'ability: Ice Face');
				this.effectState.busted = false;
				pokemon.formeChange('Eiscue', this.effect, true);
			}
		},
		onDamagePriority: 1,
		onDamage(damage, target, source, effect) {
			if (effect?.effectType === 'Move' && effect.category === 'Physical' && target.species.id === 'eiscue') {
				this.add('-activate', target, 'ability: Ice Face');
				this.effectState.busted = true;
				return 0;
			}
		},
		onCriticalHit(target, type, move) {
			if (!target) return;
			if (move.category !== 'Physical' || target.species.id !== 'eiscue') return;
			if (target.volatiles['substitute'] && !(move.flags['bypasssub'] || move.infiltrates)) return;
			if (!target.runImmunity(move)) return;
			return false;
		},
		onEffectiveness(typeMod, target, type, move) {
			if (!target) return;
			if (move.category !== 'Physical' || target.species.id !== 'eiscue') return;

			const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
			if (hitSub) return;

			if (!target.runImmunity(move)) return;
			return 0;
		},
		onUpdate(pokemon) {
			if (pokemon.species.id === 'eiscue' && this.effectState.busted) {
				pokemon.formeChange('Eiscue-Noice', this.effect, true);
			}
		},
		onWeatherChange(pokemon, source, sourceEffect) {
			// snow/hail resuming because Cloud Nine/Air Lock ended does not trigger Ice Face
			if ((sourceEffect as Ability)?.suppressWeather) return;
			if (!pokemon.hp) return;
			if (this.field.isWeather(['hail', 'snowscape']) && pokemon.species.id === 'eiscuenoice') {
				this.add('-activate', pokemon, 'ability: Ice Face');
				this.effectState.busted = false;
				pokemon.formeChange('Eiscue', this.effect, true);
			}
		},
		flags: {
			failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1,
			breakable: 1, notransform: 1,
		},
		name: "Ice Face",
		rating: 3,
		num: 248,
	},
	icescales: {
		onSourceModifyDamage(damage, source, target, move) {
			if (move.category === 'Special') {
				return this.chainModify(0.5);
			}
		},
		flags: { breakable: 1 },
		name: "Ice Scales",
		rating: 4,
		num: 246,
	},
	illuminate: {
		onTryBoost(boost, target, source, effect) {
			if (source && target === source) return;
			if (boost.accuracy && boost.accuracy < 0) {
				delete boost.accuracy;
				if (!(effect as ActiveMove).secondaries) {
					this.add("-fail", target, "unboost", "accuracy", "[from] ability: Illuminate", `[of] ${target}`);
				}
			}
		},
		onModifyMove(move) {
			move.ignoreEvasion = true;
		},
		flags: { breakable: 1 },
		name: "Illuminate",
		rating: 0.5,
		num: 35,
	},
	illusion: {
		onBeforeSwitchIn(pokemon) {
			pokemon.illusion = null;
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
			if (target.illusion) {
				this.singleEvent('End', this.dex.abilities.get('Illusion'), target.abilityState, target, source, move);
			}
		},
		onEnd(pokemon) {
			if (pokemon.illusion) {
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
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1 },
		name: "Illusion",
		rating: 4.5,
		num: 149,
	},
	immunity: {
		onUpdate(pokemon) {
			if (pokemon.status === 'psn' || pokemon.status === 'tox') {
				this.add('-activate', pokemon, 'ability: Immunity');
				pokemon.cureStatus();
			}
		},
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'psn' && status.id !== 'tox') return;
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Immunity');
			}
			return false;
		},
		flags: { breakable: 1 },
		name: "Immunity",
		rating: 2,
		num: 17,
	},
	imposter: {
		onSwitchIn(pokemon) {
			// Imposter does not activate when Skill Swapped or when Neutralizing Gas leaves the field
			// Imposter copies across in doubles/triples
			// (also copies across in multibattle and diagonally in free-for-all,
			// but side.foe already takes care of those)
			const target = pokemon.side.foe.active[pokemon.side.foe.active.length - 1 - pokemon.position];
			if (target) {
				pokemon.transformInto(target, this.dex.abilities.get('imposter'));
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1 },
		name: "Imposter",
		rating: 5,
		num: 150,
	},
	infiltrator: {
		onModifyMove(move) {
			move.infiltrates = true;
		},
		flags: {},
		name: "Infiltrator",
		rating: 2.5,
		num: 151,
	},
	innardsout: {
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) {
			if (!target.hp) {
				this.damage(target.getUndynamaxedHP(damage), source, target);
			}
		},
		flags: {},
		name: "Innards Out",
		rating: 4,
		num: 215,
	},
	innerfocus: {
		onTryAddVolatile(status, pokemon) {
			if (status.id === 'flinch') return null;
		},
		onTryBoost(boost, target, source, effect) {
			if (effect.name === 'Intimidate' && boost.atk) {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Inner Focus', `[of] ${target}`);
			}
		},
		flags: { breakable: 1 },
		name: "Inner Focus",
		rating: 1,
		num: 39,
	},
	insomnia: {
		onUpdate(pokemon) {
			if (pokemon.status === 'slp') {
				this.add('-activate', pokemon, 'ability: Insomnia');
				pokemon.cureStatus();
			}
		},
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'slp') return;
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Insomnia');
			}
			return false;
		},
		onTryAddVolatile(status, target) {
			if (status.id === 'yawn') {
				this.add('-immune', target, '[from] ability: Insomnia');
				return null;
			}
		},
		flags: { breakable: 1 },
		name: "Insomnia",
		rating: 1.5,
		num: 15,
	},
	intimidate: {
		onStart(pokemon) {
			let activated = false;
			for (const target of pokemon.adjacentFoes()) {
				if (!activated) {
					this.add('-ability', pokemon, 'Intimidate', 'boost');
					activated = true;
				}
				if (target.volatiles['substitute']) {
					this.add('-immune', target);
				} else {
					this.boost({ atk: -1 }, target, pokemon, null, true);
				}
			}
		},
		flags: {},
		name: "Intimidate",
		rating: 3.5,
		num: 22,
	},
	intrepidsword: {
		onStart(pokemon) {
			if (pokemon.swordBoost) return;
			pokemon.swordBoost = true;
			this.boost({ atk: 1 }, pokemon);
		},
		flags: {},
		name: "Intrepid Sword",
		rating: 4,
		num: 234,
	},
	ironbarbs: {
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, source, target, true)) {
				this.damage(source.baseMaxhp / 8, source, target);
			}
		},
		flags: {},
		name: "Iron Barbs",
		rating: 2.5,
		num: 160,
	},
	ironfist: {
		onBasePowerPriority: 23,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['punch']) {
				this.debug('Iron Fist boost');
				return this.chainModify([4915, 4096]);
			}
		},
		flags: {},
		name: "Iron Fist",
		rating: 3,
		num: 89,
	},
	justified: {
		onDamagingHit(damage, target, source, move) {
			if (move.type === 'Dark') {
				this.boost({ atk: 1 });
			}
		},
		flags: {},
		name: "Justified",
		rating: 2.5,
		num: 154,
	},
	keeneye: {
		onTryBoost(boost, target, source, effect) {
			if (source && target === source) return;
			if (boost.accuracy && boost.accuracy < 0) {
				delete boost.accuracy;
				if (!(effect as ActiveMove).secondaries) {
					this.add("-fail", target, "unboost", "accuracy", "[from] ability: Keen Eye", `[of] ${target}`);
				}
			}
		},
		onModifyMove(move) {
			move.ignoreEvasion = true;
		},
		flags: { breakable: 1 },
		name: "Keen Eye",
		rating: 0.5,
		num: 51,
	},
	klutz: {
		// Klutz isn't technically active immediately in-game, but it activates early enough to beat all items
		// we should keep an eye out in future gens for items that activate on switch-in before Unnerve
		onSwitchInPriority: 1,
		// Item suppression implemented in Pokemon.ignoringItem() within sim/pokemon.js
		onStart(pokemon) {
			this.singleEvent('End', pokemon.getItem(), pokemon.itemState, pokemon);
		},
		flags: {},
		name: "Klutz",
		rating: -1,
		num: 103,
	},
	leafguard: {
		onSetStatus(status, target, source, effect) {
			if (['sunnyday', 'desolateland'].includes(target.effectiveWeather())) {
				if ((effect as Move)?.status) {
					this.add('-immune', target, '[from] ability: Leaf Guard');
				}
				return false;
			}
		},
		onTryAddVolatile(status, target) {
			if (status.id === 'yawn' && ['sunnyday', 'desolateland'].includes(target.effectiveWeather())) {
				this.add('-immune', target, '[from] ability: Leaf Guard');
				return null;
			}
		},
		flags: { breakable: 1 },
		name: "Leaf Guard",
		rating: 0.5,
		num: 102,
	},
	levitate: {
		// airborneness implemented in sim/pokemon.js:Pokemon#isGrounded
		flags: { breakable: 1 },
		name: "Levitate",
		rating: 3.5,
		num: 26,
	},
	libero: {
		onPrepareHit(source, target, move) {
			if (this.effectState.libero) return;
			if (move.hasBounced || move.flags['futuremove'] || move.sourceEffect === 'snatch' || move.callsMove) return;
			const type = move.type;
			if (type && type !== '???' && source.getTypes().join() !== type) {
				if (!source.setType(type)) return;
				this.effectState.libero = true;
				this.add('-start', source, 'typechange', type, '[from] ability: Libero');
			}
		},
		flags: {},
		name: "Libero",
		rating: 4,
		num: 236,
	},
	lightmetal: {
		onModifyWeight(weighthg) {
			return this.trunc(weighthg / 2);
		},
		flags: { breakable: 1 },
		name: "Light Metal",
		rating: 1,
		num: 135,
	},
	lightningrod: {
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Electric') {
				if (!this.boost({ spa: 1 })) {
					this.add('-immune', target, '[from] ability: Lightning Rod');
				}
				return null;
			}
		},
		onAnyRedirectTarget(target, source, source2, move) {
			if (move.type !== 'Electric' || move.flags['pledgecombo']) return;
			const redirectTarget = ['randomNormal', 'adjacentFoe'].includes(move.target) ? 'normal' : move.target;
			if (this.validTarget(this.effectState.target, source, redirectTarget)) {
				if (move.smartTarget) move.smartTarget = false;
				if (this.effectState.target !== target) {
					this.add('-activate', this.effectState.target, 'ability: Lightning Rod');
				}
				return this.effectState.target;
			}
		},
		flags: { breakable: 1 },
		name: "Lightning Rod",
		rating: 3,
		num: 31,
	},
	limber: {
		onUpdate(pokemon) {
			if (pokemon.status === 'par') {
				this.add('-activate', pokemon, 'ability: Limber');
				pokemon.cureStatus();
			}
		},
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'par') return;
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Limber');
			}
			return false;
		},
		flags: { breakable: 1 },
		name: "Limber",
		rating: 2,
		num: 7,
	},
	lingeringaroma: {
		onDamagingHit(damage, target, source, move) {
			const sourceAbility = source.getAbility();
			if (sourceAbility.flags['cantsuppress'] || sourceAbility.id === 'lingeringaroma') {
				return;
			}
			if (this.checkMoveMakesContact(move, source, target, !source.isAlly(target))) {
				const oldAbility = source.setAbility('lingeringaroma', target);
				if (oldAbility) {
					this.add('-activate', target, 'ability: Lingering Aroma', this.dex.abilities.get(oldAbility).name, `[of] ${source}`);
				}
			}
		},
		flags: {},
		name: "Lingering Aroma",
		rating: 2,
		num: 268,
	},
	liquidooze: {
		onSourceTryHeal(damage, target, source, effect) {
			this.debug(`Heal is occurring: ${target} <- ${source} :: ${effect.id}`);
			const canOoze = ['drain', 'leechseed', 'strengthsap'];
			if (canOoze.includes(effect.id)) {
				this.damage(damage);
				return 0;
			}
		},
		flags: {},
		name: "Liquid Ooze",
		rating: 2.5,
		num: 64,
	},
	liquidvoice: {
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			if (move.flags['sound'] && !pokemon.volatiles['dynamax']) { // hardcode
				move.type = 'Water';
			}
		},
		flags: {},
		name: "Liquid Voice",
		rating: 1.5,
		num: 204,
	},
	longreach: {
		onModifyMove(move) {
			delete move.flags['contact'];
		},
		flags: {},
		name: "Long Reach",
		rating: 1,
		num: 203,
	},
	magicbounce: {
		onTryHitPriority: 1,
		onTryHit(target, source, move) {
			if (target === source || move.hasBounced || !move.flags['reflectable'] || target.isSemiInvulnerable()) {
				return;
			}
			const newMove = this.dex.getActiveMove(move.id);
			newMove.hasBounced = true;
			newMove.pranksterBoosted = false;
			this.actions.useMove(newMove, target, { target: source });
			return null;
		},
		onAllyTryHitSide(target, source, move) {
			if (target.isAlly(source) || move.hasBounced || !move.flags['reflectable'] || target.isSemiInvulnerable()) {
				return;
			}
			const newMove = this.dex.getActiveMove(move.id);
			newMove.hasBounced = true;
			newMove.pranksterBoosted = false;
			this.actions.useMove(newMove, this.effectState.target, { target: source });
			move.hasBounced = true; // only bounce once in free-for-all battles
			return null;
		},
		flags: { breakable: 1 },
		name: "Magic Bounce",
		rating: 4,
		num: 156,
	},
	magicguard: {
		onDamage(damage, target, source, effect) {
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
	magician: {
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
					this.add('-item', source, yourItem, '[from] ability: Magician', `[of] ${pokemon}`);
					return;
				}
			}
		},
		flags: {},
		name: "Magician",
		rating: 1,
		num: 170,
	},
	magmaarmor: {
		onUpdate(pokemon) {
			if (pokemon.status === 'frz') {
				this.add('-activate', pokemon, 'ability: Magma Armor');
				pokemon.cureStatus();
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'frz') return false;
		},
		flags: { breakable: 1 },
		name: "Magma Armor",
		rating: 0.5,
		num: 40,
	},
	magnetpull: {
		onFoeTrapPokemon(pokemon) {
			if (pokemon.hasType('Steel') && pokemon.isAdjacent(this.effectState.target)) {
				pokemon.tryTrap(true);
			}
		},
		onFoeMaybeTrapPokemon(pokemon, source) {
			if (!source) source = this.effectState.target;
			if (!source || !pokemon.isAdjacent(source)) return;
			if (!pokemon.knownType || pokemon.hasType('Steel')) {
				pokemon.maybeTrapped = true;
			}
		},
		flags: {},
		name: "Magnet Pull",
		rating: 4,
		num: 42,
	},
	marvelscale: {
		onModifyDefPriority: 6,
		onModifyDef(def, pokemon) {
			if (pokemon.status) {
				return this.chainModify(1.5);
			}
		},
		flags: { breakable: 1 },
		name: "Marvel Scale",
		rating: 2.5,
		num: 63,
	},
	megalauncher: {
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['pulse']) {
				return this.chainModify(1.5);
			}
		},
		flags: {},
		name: "Mega Launcher",
		rating: 3,
		num: 178,
	},
	merciless: {
		onModifyCritRatio(critRatio, source, target) {
			if (target && ['psn', 'tox'].includes(target.status)) return 5;
		},
		flags: {},
		name: "Merciless",
		rating: 1.5,
		num: 196,
	},
	mimicry: {
		onSwitchInPriority: -1,
		onStart(pokemon) {
			this.singleEvent('TerrainChange', this.effect, this.effectState, pokemon);
		},
		onTerrainChange(pokemon) {
			let types;
			switch (this.field.terrain) {
			case 'electricterrain':
				types = ['Electric'];
				break;
			case 'grassyterrain':
				types = ['Grass'];
				break;
			case 'mistyterrain':
				types = ['Fairy'];
				break;
			case 'psychicterrain':
				types = ['Psychic'];
				break;
			default:
				types = pokemon.baseSpecies.types;
			}
			const oldTypes = pokemon.getTypes();
			if (oldTypes.join() === types.join() || !pokemon.setType(types)) return;
			if (this.field.terrain || pokemon.transformed) {
				this.add('-start', pokemon, 'typechange', types.join('/'), '[from] ability: Mimicry');
				if (!this.field.terrain) this.hint("Transform Mimicry changes you to your original un-transformed types.");
			} else {
				this.add('-activate', pokemon, 'ability: Mimicry');
				this.add('-end', pokemon, 'typechange', '[silent]');
			}
		},
		flags: {},
		name: "Mimicry",
		rating: 0,
		num: 250,
	},
	mindseye: {
		onTryBoost(boost, target, source, effect) {
			if (source && target === source) return;
			if (boost.accuracy && boost.accuracy < 0) {
				delete boost.accuracy;
				if (!(effect as ActiveMove).secondaries) {
					this.add("-fail", target, "unboost", "accuracy", "[from] ability: Mind's Eye", `[of] ${target}`);
				}
			}
		},
		onModifyMovePriority: -5,
		onModifyMove(move) {
			move.ignoreEvasion = true;
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity['Fighting'] = true;
				move.ignoreImmunity['Normal'] = true;
			}
		},
		flags: { breakable: 1 },
		name: "Mind's Eye",
		rating: 0,
		num: 300,
	},
	minus: {
		onModifySpAPriority: 5,
		onModifySpA(spa, pokemon) {
			for (const allyActive of pokemon.allies()) {
				if (allyActive.hasAbility(['minus', 'plus'])) {
					return this.chainModify(1.5);
				}
			}
		},
		flags: {},
		name: "Minus",
		rating: 0,
		num: 58,
	},
	mirrorarmor: {
		onTryBoost(boost, target, source, effect) {
			// Don't bounce self stat changes, or boosts that have already bounced
			if (!source || target === source || !boost || effect.name === 'Mirror Armor') return;
			let b: BoostID;
			for (b in boost) {
				if (boost[b]! < 0) {
					if (target.boosts[b] === -6) continue;
					const negativeBoost: SparseBoostsTable = {};
					negativeBoost[b] = boost[b];
					delete boost[b];
					if (source.hp) {
						this.add('-ability', target, 'Mirror Armor');
						this.boost(negativeBoost, source, target, null, true);
					}
				}
			}
		},
		flags: { breakable: 1 },
		name: "Mirror Armor",
		rating: 2,
		num: 240,
	},
	mistysurge: {
		onStart(source) {
			this.field.setTerrain('mistyterrain');
		},
		flags: {},
		name: "Misty Surge",
		rating: 3.5,
		num: 228,
	},
	moldbreaker: {
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Mold Breaker');
		},
		onModifyMove(move) {
			move.ignoreAbility = true;
		},
		flags: {},
		name: "Mold Breaker",
		rating: 3,
		num: 104,
	},
	moody: {
		onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			let stats: BoostID[] = [];
			const boost: SparseBoostsTable = {};
			let statPlus: BoostID;
			for (statPlus in pokemon.boosts) {
				if (statPlus === 'accuracy' || statPlus === 'evasion') continue;
				if (pokemon.boosts[statPlus] < 6) {
					stats.push(statPlus);
				}
			}
			let randomStat: BoostID | undefined = stats.length ? this.sample(stats) : undefined;
			if (randomStat) boost[randomStat] = 2;

			stats = [];
			let statMinus: BoostID;
			for (statMinus in pokemon.boosts) {
				if (statMinus === 'accuracy' || statMinus === 'evasion') continue;
				if (pokemon.boosts[statMinus] > -6 && statMinus !== randomStat) {
					stats.push(statMinus);
				}
			}
			randomStat = stats.length ? this.sample(stats) : undefined;
			if (randomStat) boost[randomStat] = -1;

			this.boost(boost, pokemon, pokemon);
		},
		flags: {},
		name: "Moody",
		rating: 5,
		num: 141,
	},
	motordrive: {
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Electric') {
				if (!this.boost({ spe: 1 })) {
					this.add('-immune', target, '[from] ability: Motor Drive');
				}
				return null;
			}
		},
		flags: { breakable: 1 },
		name: "Motor Drive",
		rating: 3,
		num: 78,
	},
	moxie: {
		onSourceAfterFaint(length, target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				this.boost({ atk: length }, source);
			}
		},
		flags: {},
		name: "Moxie",
		rating: 3,
		num: 153,
	},
	multiscale: {
		onSourceModifyDamage(damage, source, target, move) {
			if (target.hp >= target.maxhp) {
				this.debug('Multiscale weaken');
				return this.chainModify(0.5);
			}
		},
		flags: { breakable: 1 },
		name: "Multiscale",
		rating: 3.5,
		num: 136,
	},
	multitype: {
		// Multitype's type-changing itself is implemented in statuses.js
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
		name: "Multitype",
		rating: 4,
		num: 121,
	},
	mummy: {
		onDamagingHit(damage, target, source, move) {
			const sourceAbility = source.getAbility();
			if (sourceAbility.flags['cantsuppress'] || sourceAbility.id === 'mummy') {
				return;
			}
			if (this.checkMoveMakesContact(move, source, target, !source.isAlly(target))) {
				const oldAbility = source.setAbility('mummy', target);
				if (oldAbility) {
					this.add('-activate', target, 'ability: Mummy', this.dex.abilities.get(oldAbility).name, `[of] ${source}`);
				}
			}
		},
		flags: {},
		name: "Mummy",
		rating: 2,
		num: 152,
	},
	myceliummight: {
		onFractionalPriorityPriority: -1,
		onFractionalPriority(priority, pokemon, target, move) {
			if (move.category === 'Status') {
				return -0.1;
			}
		},
		onModifyMove(move) {
			if (move.category === 'Status') {
				move.ignoreAbility = true;
			}
		},
		flags: {},
		name: "Mycelium Might",
		rating: 2,
		num: 298,
	},
	naturalcure: {
		onCheckShow(pokemon) {
			// This is complicated
			// For the most part, in-game, it's obvious whether or not Natural Cure activated,
			// since you can see how many of your opponent's pokemon are statused.
			// The only ambiguous situation happens in Doubles/Triples, where multiple pokemon
			// that could have Natural Cure switch out, but only some of them get cured.
			if (pokemon.side.active.length === 1) return;
			if (pokemon.showCure === true || pokemon.showCure === false) return;

			const cureList = [];
			let noCureCount = 0;
			for (const curPoke of pokemon.side.active) {
				// pokemon not statused
				if (!curPoke?.status) {
					// this.add('-message', "" + curPoke + " skipped: not statused or doesn't exist");
					continue;
				}
				if (curPoke.showCure) {
					// this.add('-message', "" + curPoke + " skipped: Natural Cure already known");
					continue;
				}
				const species = curPoke.species;
				// pokemon can't get Natural Cure
				if (!Object.values(species.abilities).includes('Natural Cure')) {
					// this.add('-message', "" + curPoke + " skipped: no Natural Cure");
					continue;
				}
				// pokemon's ability is known to be Natural Cure
				if (!species.abilities['1'] && !species.abilities['H']) {
					// this.add('-message', "" + curPoke + " skipped: only one ability");
					continue;
				}
				// pokemon isn't switching this turn
				if (curPoke !== pokemon && !this.queue.willSwitch(curPoke)) {
					// this.add('-message', "" + curPoke + " skipped: not switching");
					continue;
				}

				if (curPoke.hasAbility('naturalcure')) {
					// this.add('-message', "" + curPoke + " confirmed: could be Natural Cure (and is)");
					cureList.push(curPoke);
				} else {
					// this.add('-message', "" + curPoke + " confirmed: could be Natural Cure (but isn't)");
					noCureCount++;
				}
			}

			if (!cureList.length || !noCureCount) {
				// It's possible to know what pokemon were cured
				for (const pkmn of cureList) {
					pkmn.showCure = true;
				}
			} else {
				// It's not possible to know what pokemon were cured

				// Unlike a -hint, this is real information that battlers need, so we use a -message
				this.add('-message', `(${cureList.length} of ${pokemon.side.name}'s pokemon ${cureList.length === 1 ? "was" : "were"} cured by Natural Cure.)`);

				for (const pkmn of cureList) {
					pkmn.showCure = false;
				}
			}
		},
		onSwitchOut(pokemon) {
			if (!pokemon.status) return;

			// if pokemon.showCure is undefined, it was skipped because its ability
			// is known
			if (pokemon.showCure === undefined) pokemon.showCure = true;

			if (pokemon.showCure) this.add('-curestatus', pokemon, pokemon.status, '[from] ability: Natural Cure');
			pokemon.clearStatus();

			// only reset .showCure if it's false
			// (once you know a Pokemon has Natural Cure, its cures are always known)
			if (!pokemon.showCure) pokemon.showCure = undefined;
		},
		flags: {},
		name: "Natural Cure",
		rating: 2.5,
		num: 30,
	},
	neuroforce: {
		onModifyDamage(damage, source, target, move) {
			if (move && target.getMoveHitData(move).typeMod > 0) {
				return this.chainModify([5120, 4096]);
			}
		},
		flags: {},
		name: "Neuroforce",
		rating: 2.5,
		num: 233,
	},
	neutralizinggas: {
		// Ability suppression implemented in sim/pokemon.ts:Pokemon#ignoringAbility
		onSwitchInPriority: 2,
		onSwitchIn(pokemon) {
			this.add('-ability', pokemon, 'Neutralizing Gas');
			pokemon.abilityState.ending = false;
			const strongWeathers = ['desolateland', 'primordialsea', 'deltastream'];
			for (const target of this.getAllActive()) {
				if (target.hasItem('Ability Shield')) {
					this.add('-block', target, 'item: Ability Shield');
					continue;
				}
				// Can't suppress a Tatsugiri inside of Dondozo already
				if (target.volatiles['commanding']) {
					continue;
				}
				if (target.illusion) {
					this.singleEvent('End', this.dex.abilities.get('Illusion'), target.abilityState, target, pokemon, 'neutralizinggas');
				}
				if (target.volatiles['slowstart']) {
					delete target.volatiles['slowstart'];
					this.add('-end', target, 'Slow Start', '[silent]');
				}
				if (strongWeathers.includes(target.getAbility().id)) {
					this.singleEvent('End', this.dex.abilities.get(target.getAbility().id), target.abilityState, target, pokemon, 'neutralizinggas');
				}
			}
		},
		onEnd(source) {
			if (source.transformed) return;
			for (const pokemon of this.getAllActive()) {
				if (pokemon !== source && pokemon.hasAbility('Neutralizing Gas')) {
					return;
				}
			}
			this.add('-end', source, 'ability: Neutralizing Gas');

			// FIXME this happens before the pokemon switches out, should be the opposite order.
			// Not an easy fix since we cant use a supported event. Would need some kind of special event that
			// gathers events to run after the switch and then runs them when the ability is no longer accessible.
			// (If you're tackling this, do note extreme weathers have the same issue)

			// Mark this pokemon's ability as ending so Pokemon#ignoringAbility skips it
			if (source.abilityState.ending) return;
			source.abilityState.ending = true;
			const sortedActive = this.getAllActive();
			this.speedSort(sortedActive);
			for (const pokemon of sortedActive) {
				if (pokemon !== source) {
					if (pokemon.getAbility().flags['cantsuppress']) continue; // does not interact with e.g Ice Face, Zen Mode
					if (pokemon.hasItem('abilityshield')) continue; // don't restart abilities that weren't suppressed

					// Will be suppressed by Pokemon#ignoringAbility if needed
					this.singleEvent('Start', pokemon.getAbility(), pokemon.abilityState, pokemon);
					if (pokemon.ability === "gluttony") {
						pokemon.abilityState.gluttony = false;
					}
				}
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1 },
		name: "Neutralizing Gas",
		rating: 3.5,
		num: 256,
	},
	noguard: {
		onAnyInvulnerabilityPriority: 1,
		onAnyInvulnerability(target, source, move) {
			if (move && (source === this.effectState.target || target === this.effectState.target)) return 0;
		},
		onAnyAccuracy(accuracy, target, source, move) {
			if (move && (source === this.effectState.target || target === this.effectState.target)) {
				return true;
			}
			return accuracy;
		},
		flags: {},
		name: "No Guard",
		rating: 4,
		num: 99,
	},
	normalize: {
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
		name: "Normalize",
		rating: 0,
		num: 96,
	},
	oblivious: {
		onUpdate(pokemon) {
			if (pokemon.volatiles['attract']) {
				this.add('-activate', pokemon, 'ability: Oblivious');
				pokemon.removeVolatile('attract');
				this.add('-end', pokemon, 'move: Attract', '[from] ability: Oblivious');
			}
			if (pokemon.volatiles['taunt']) {
				this.add('-activate', pokemon, 'ability: Oblivious');
				pokemon.removeVolatile('taunt');
				// Taunt's volatile already sends the -end message when removed
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'attract') return false;
		},
		onTryHit(pokemon, target, move) {
			if (move.id === 'attract' || move.id === 'captivate' || move.id === 'taunt') {
				this.add('-immune', pokemon, '[from] ability: Oblivious');
				return null;
			}
		},
		onTryBoost(boost, target, source, effect) {
			if (effect.name === 'Intimidate' && boost.atk) {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Oblivious', `[of] ${target}`);
			}
		},
		flags: { breakable: 1 },
		name: "Oblivious",
		rating: 1.5,
		num: 12,
	},
	opportunist: {
		onFoeAfterBoost(boost, target, source, effect) {
			if (effect?.name === 'Opportunist' || effect?.name === 'Mirror Herb') return;
			if (!this.effectState.boosts) this.effectState.boosts = {} as SparseBoostsTable;
			const boostPlus = this.effectState.boosts;
			let i: BoostID;
			for (i in boost) {
				if (boost[i]! > 0) {
					boostPlus[i] = (boostPlus[i] || 0) + boost[i]!;
				}
			}
		},
		onAnySwitchInPriority: -3,
		onAnySwitchIn() {
			if (!this.effectState.boosts) return;
			this.boost(this.effectState.boosts, this.effectState.target);
			delete this.effectState.boosts;
		},
		onAnyAfterMega() {
			if (!this.effectState.boosts) return;
			this.boost(this.effectState.boosts, this.effectState.target);
			delete this.effectState.boosts;
		},
		onAnyAfterTerastallization() {
			if (!this.effectState.boosts) return;
			this.boost(this.effectState.boosts, this.effectState.target);
			delete this.effectState.boosts;
		},
		onAnyAfterMove() {
			if (!this.effectState.boosts) return;
			this.boost(this.effectState.boosts, this.effectState.target);
			delete this.effectState.boosts;
		},
		onResidualOrder: 29,
		onResidual(pokemon) {
			if (!this.effectState.boosts) return;
			this.boost(this.effectState.boosts, this.effectState.target);
			delete this.effectState.boosts;
		},
		onEnd() {
			delete this.effectState.boosts;
		},
		flags: {},
		name: "Opportunist",
		rating: 3,
		num: 290,
	},
	orichalcumpulse: {
		onStart(pokemon) {
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
	overcoat: {
		onImmunity(type, pokemon) {
			if (type === 'sandstorm' || type === 'hail' || type === 'powder') return false;
		},
		onTryHitPriority: 1,
		onTryHit(target, source, move) {
			if (move.flags['powder'] && target !== source && this.dex.getImmunity('powder', target)) {
				this.add('-immune', target, '[from] ability: Overcoat');
				return null;
			}
		},
		flags: { breakable: 1 },
		name: "Overcoat",
		rating: 2,
		num: 142,
	},
	overgrow: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Grass' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Overgrow boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Grass' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Overgrow boost');
				return this.chainModify(1.5);
			}
		},
		flags: {},
		name: "Overgrow",
		rating: 2,
		num: 65,
	},
	owntempo: {
		onUpdate(pokemon) {
			if (pokemon.volatiles['confusion']) {
				this.add('-activate', pokemon, 'ability: Own Tempo');
				pokemon.removeVolatile('confusion');
			}
		},
		onTryAddVolatile(status, pokemon) {
			if (status.id === 'confusion') return null;
		},
		onHit(target, source, move) {
			if (move?.volatileStatus === 'confusion') {
				this.add('-immune', target, 'confusion', '[from] ability: Own Tempo');
			}
		},
		onTryBoost(boost, target, source, effect) {
			if (effect.name === 'Intimidate' && boost.atk) {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Own Tempo', `[of] ${target}`);
			}
		},
		flags: { breakable: 1 },
		name: "Own Tempo",
		rating: 1.5,
		num: 20,
	},
	parentalbond: {
		onPrepareHit(source, target, move) {
			if (move.category === 'Status' || move.multihit || move.flags['noparentalbond'] || move.flags['charge'] ||
				move.flags['futuremove'] || move.spreadHit || move.isZ || move.isMax) return;
			move.multihit = 2;
			move.multihitType = 'parentalbond';
		},
		// Damage modifier implemented in BattleActions#modifyDamage()
		onSourceModifySecondaries(secondaries, target, source, move) {
			if (move.multihitType === 'parentalbond' && move.id === 'secretpower' && move.hit < 2) {
				// hack to prevent accidentally suppressing King's Rock/Razor Fang
				return secondaries.filter(effect => effect.volatileStatus === 'flinch');
			}
		},
		flags: {},
		name: "Parental Bond",
		rating: 4.5,
		num: 185,
	},
	pastelveil: {
		onStart(pokemon) {
			for (const ally of pokemon.alliesAndSelf()) {
				if (['psn', 'tox'].includes(ally.status)) {
					this.add('-activate', pokemon, 'ability: Pastel Veil');
					ally.cureStatus();
				}
			}
		},
		onUpdate(pokemon) {
			if (['psn', 'tox'].includes(pokemon.status)) {
				this.add('-activate', pokemon, 'ability: Pastel Veil');
				pokemon.cureStatus();
			}
		},
		onAnySwitchIn() {
			((this.effect as any).onStart as (p: Pokemon) => void).call(this, this.effectState.target);
		},
		onSetStatus(status, target, source, effect) {
			if (!['psn', 'tox'].includes(status.id)) return;
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Pastel Veil');
			}
			return false;
		},
		onAllySetStatus(status, target, source, effect) {
			if (!['psn', 'tox'].includes(status.id)) return;
			if ((effect as Move)?.status) {
				const effectHolder = this.effectState.target;
				this.add('-block', target, 'ability: Pastel Veil', `[of] ${effectHolder}`);
			}
			return false;
		},
		flags: { breakable: 1 },
		name: "Pastel Veil",
		rating: 2,
		num: 257,
	},
	perishbody: {
		onDamagingHit(damage, target, source, move) {
			if (!this.checkMoveMakesContact(move, source, target) || source.volatiles['perishsong']) return;
			this.add('-ability', target, 'Perish Body');
			source.addVolatile('perishsong');
			target.addVolatile('perishsong');
		},
		flags: {},
		name: "Perish Body",
		rating: 1,
		num: 253,
	},
	pickpocket: {
		onAfterMoveSecondary(target, source, move) {
			if (source && source !== target && move?.flags['contact']) {
				if (target.item || target.switchFlag || target.forceSwitchFlag || source.switchFlag === true) {
					return;
				}
				const yourItem = source.takeItem(target);
				if (!yourItem) {
					return;
				}
				if (!target.setItem(yourItem)) {
					source.item = yourItem.id;
					return;
				}
				this.add('-enditem', source, yourItem, '[silent]', '[from] ability: Pickpocket', `[of] ${source}`);
				this.add('-item', target, yourItem, '[from] ability: Pickpocket', `[of] ${source}`);
			}
		},
		flags: {},
		name: "Pickpocket",
		rating: 1,
		num: 124,
	},
	pickup: {
		onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			if (pokemon.item) return;
			const pickupTargets = this.getAllActive().filter(target => (
				target.lastItem && target.usedItemThisTurn && pokemon.isAdjacent(target)
			));
			if (!pickupTargets.length) return;
			const randomTarget = this.sample(pickupTargets);
			const item = randomTarget.lastItem;
			randomTarget.lastItem = '';
			this.add('-item', pokemon, this.dex.items.get(item), '[from] ability: Pickup');
			pokemon.setItem(item);
		},
		flags: {},
		name: "Pickup",
		rating: 0.5,
		num: 53,
	},
	pixilate: {
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.type === 'Normal' && (!noModifyType.includes(move.id) || this.activeMove?.isMax) &&
				!(move.isZ && move.category !== 'Status') && !(move.name === 'Tera Blast' && pokemon.terastallized)) {
				move.type = 'Fairy';
				move.typeChangerBoosted = this.effect;
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (move.typeChangerBoosted === this.effect) return this.chainModify([4915, 4096]);
		},
		flags: {},
		name: "Pixilate",
		rating: 4,
		num: 182,
	},
	plus: {
		onModifySpAPriority: 5,
		onModifySpA(spa, pokemon) {
			for (const allyActive of pokemon.allies()) {
				if (allyActive.hasAbility(['minus', 'plus'])) {
					return this.chainModify(1.5);
				}
			}
		},
		flags: {},
		name: "Plus",
		rating: 0,
		num: 57,
	},
	poisonheal: {
		onDamagePriority: 1,
		onDamage(damage, target, source, effect) {
			if (effect.id === 'psn' || effect.id === 'tox') {
				this.heal(target.baseMaxhp / 8);
				return false;
			}
		},
		flags: {},
		name: "Poison Heal",
		rating: 4,
		num: 90,
	},
	poisonpoint: {
		onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, source, target)) {
				if (this.randomChance(3, 10)) {
					source.trySetStatus('psn', target);
				}
			}
		},
		flags: {},
		name: "Poison Point",
		rating: 1.5,
		num: 38,
	},
	poisonpuppeteer: {
		onAnyAfterSetStatus(status, target, source, effect) {
			if (source.baseSpecies.name !== "Pecharunt") return;
			if (source !== this.effectState.target || target === source || effect.effectType !== 'Move') return;
			if (status.id === 'psn' || status.id === 'tox') {
				target.addVolatile('confusion');
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1 },
		name: "Poison Puppeteer",
		rating: 3,
		num: 310,
	},
	poisontouch: {
		onSourceDamagingHit(damage, target, source, move) {
			// Despite not being a secondary, Shield Dust / Covert Cloak block Poison Touch's effect
			if (target.hasAbility('shielddust') || target.hasItem('covertcloak')) return;
			if (this.checkMoveMakesContact(move, target, source)) {
				if (this.randomChance(3, 10)) {
					target.trySetStatus('psn', source);
				}
			}
		},
		flags: {},
		name: "Poison Touch",
		rating: 2,
		num: 143,
	},
	powerconstruct: {
		onResidualOrder: 29,
		onResidual(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Zygarde' || pokemon.transformed || !pokemon.hp) return;
			if (pokemon.species.id === 'zygardecomplete' || pokemon.hp > pokemon.maxhp / 2) return;
			this.add('-activate', pokemon, 'ability: Power Construct');
			pokemon.formeChange('Zygarde-Complete', this.effect, true);
			pokemon.canMegaEvo = pokemon.canMegaEvo === false ? false : this.actions.canMegaEvo(pokemon);
			pokemon.formeRegression = true;
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
		name: "Power Construct",
		rating: 5,
		num: 211,
	},
	powerofalchemy: {
		onAllyFaint(target) {
			if (!this.effectState.target.hp) return;
			const ability = target.getAbility();
			if (ability.flags['noreceiver'] || ability.id === 'noability') return;
			this.effectState.target.setAbility(ability, target);
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1 },
		name: "Power of Alchemy",
		rating: 0,
		num: 223,
	},
	powerspot: {
		onAllyBasePowerPriority: 22,
		onAllyBasePower(basePower, attacker, defender, move) {
			if (attacker !== this.effectState.target) {
				this.debug('Power Spot boost');
				return this.chainModify([5325, 4096]);
			}
		},
		flags: {},
		name: "Power Spot",
		rating: 0,
		num: 249,
	},
	prankster: {
		onModifyPriority(priority, pokemon, target, move) {
			if (move?.category === 'Status') {
				move.pranksterBoosted = true;
				return priority + 1;
			}
		},
		flags: {},
		name: "Prankster",
		rating: 4,
		num: 158,
	},
	pressure: {
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Pressure');
		},
		onDeductPP(target, source) {
			if (target.isAlly(source)) return;
			return 1;
		},
		flags: {},
		name: "Pressure",
		rating: 2.5,
		num: 46,
	},
	primordialsea: {
		onStart(source) {
			this.field.setWeather('primordialsea');
		},
		onAnySetWeather(target, source, weather) {
			const strongWeathers = ['desolateland', 'primordialsea', 'deltastream'];
			if (this.field.getWeather().id === 'primordialsea' && !strongWeathers.includes(weather.id)) return false;
		},
		onEnd(pokemon) {
			if (this.field.weatherState.source !== pokemon) return;
			for (const target of this.getAllActive()) {
				if (target === pokemon) continue;
				if (target.hasAbility('primordialsea')) {
					this.field.weatherState.source = target;
					return;
				}
			}
			this.field.clearWeather();
		},
		flags: {},
		name: "Primordial Sea",
		rating: 4.5,
		num: 189,
	},
	prismarmor: {
		onSourceModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).typeMod > 0) {
				this.debug('Prism Armor neutralize');
				return this.chainModify(0.75);
			}
		},
		flags: {},
		name: "Prism Armor",
		rating: 3,
		num: 232,
	},
	propellertail: {
		onModifyMovePriority: 1,
		onModifyMove(move) {
			// most of the implementation is in Battle#getTarget
			move.tracksTarget = move.target !== 'scripted';
		},
		flags: {},
		name: "Propeller Tail",
		rating: 0,
		num: 239,
	},
	protean: {
		onPrepareHit(source, target, move) {
			if (this.effectState.protean) return;
			if (move.hasBounced || move.flags['futuremove'] || move.sourceEffect === 'snatch' || move.callsMove) return;
			const type = move.type;
			if (type && type !== '???' && source.getTypes().join() !== type) {
				if (!source.setType(type)) return;
				this.effectState.protean = true;
				this.add('-start', source, 'typechange', type, '[from] ability: Protean');
			}
		},
		flags: {},
		name: "Protean",
		rating: 4,
		num: 168,
	},
	protosynthesis: {
		onSwitchInPriority: -2,
		onStart(pokemon) {
			this.singleEvent('WeatherChange', this.effect, this.effectState, pokemon);
		},
		onWeatherChange(pokemon) {
			// Protosynthesis is not affected by Utility Umbrella
			if (this.field.isWeather('sunnyday')) {
				pokemon.addVolatile('protosynthesis');
			} else if (!pokemon.volatiles['protosynthesis']?.fromBooster && !this.field.isWeather('sunnyday')) {
				pokemon.removeVolatile('protosynthesis');
			}
		},
		onEnd(pokemon) {
			delete pokemon.volatiles['protosynthesis'];
			this.add('-end', pokemon, 'Protosynthesis', '[silent]');
		},
		condition: {
			noCopy: true,
			onStart(pokemon, source, effect) {
				if (effect?.name === 'Booster Energy') {
					this.effectState.fromBooster = true;
					this.add('-activate', pokemon, 'ability: Protosynthesis', '[fromitem]');
				} else {
					this.add('-activate', pokemon, 'ability: Protosynthesis');
				}
				this.effectState.bestStat = pokemon.getBestStat(false, true);
				this.add('-start', pokemon, 'protosynthesis' + this.effectState.bestStat);
			},
			onModifyAtkPriority: 5,
			onModifyAtk(atk, pokemon) {
				if (this.effectState.bestStat !== 'atk' || pokemon.ignoringAbility()) return;
				this.debug('Protosynthesis atk boost');
				return this.chainModify([5325, 4096]);
			},
			onModifyDefPriority: 6,
			onModifyDef(def, pokemon) {
				if (this.effectState.bestStat !== 'def' || pokemon.ignoringAbility()) return;
				this.debug('Protosynthesis def boost');
				return this.chainModify([5325, 4096]);
			},
			onModifySpAPriority: 5,
			onModifySpA(spa, pokemon) {
				if (this.effectState.bestStat !== 'spa' || pokemon.ignoringAbility()) return;
				this.debug('Protosynthesis spa boost');
				return this.chainModify([5325, 4096]);
			},
			onModifySpDPriority: 6,
			onModifySpD(spd, pokemon) {
				if (this.effectState.bestStat !== 'spd' || pokemon.ignoringAbility()) return;
				this.debug('Protosynthesis spd boost');
				return this.chainModify([5325, 4096]);
			},
			onModifySpe(spe, pokemon) {
				if (this.effectState.bestStat !== 'spe' || pokemon.ignoringAbility()) return;
				this.debug('Protosynthesis spe boost');
				return this.chainModify(1.5);
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Protosynthesis');
			},
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1 },
		name: "Protosynthesis",
		rating: 3,
		num: 281,
	},
	psychicsurge: {
		onStart(source) {
			this.field.setTerrain('psychicterrain');
		},
		flags: {},
		name: "Psychic Surge",
		rating: 4,
		num: 227,
	},
	punkrock: {
		onBasePowerPriority: 7,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['sound']) {
				this.debug('Punk Rock boost');
				return this.chainModify([5325, 4096]);
			}
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.flags['sound']) {
				this.debug('Punk Rock weaken');
				return this.chainModify(0.5);
			}
		},
		flags: { breakable: 1 },
		name: "Punk Rock",
		rating: 3.5,
		num: 244,
	},
	purepower: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk) {
			return this.chainModify(2);
		},
		flags: {},
		name: "Pure Power",
		rating: 5,
		num: 74,
	},
	purifyingsalt: {
		onSetStatus(status, target, source, effect) {
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Purifying Salt');
			}
			return false;
		},
		onTryAddVolatile(status, target) {
			if (status.id === 'yawn') {
				this.add('-immune', target, '[from] ability: Purifying Salt');
				return null;
			}
		},
		onSourceModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Ghost') {
				this.debug('Purifying Salt weaken');
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(spa, attacker, defender, move) {
			if (move.type === 'Ghost') {
				this.debug('Purifying Salt weaken');
				return this.chainModify(0.5);
			}
		},
		flags: { breakable: 1 },
		name: "Purifying Salt",
		rating: 4,
		num: 272,
	},
	quarkdrive: {
		onSwitchInPriority: -2,
		onStart(pokemon) {
			this.singleEvent('TerrainChange', this.effect, this.effectState, pokemon);
		},
		onTerrainChange(pokemon) {
			if (this.field.isTerrain('electricterrain')) {
				pokemon.addVolatile('quarkdrive');
			} else if (!pokemon.volatiles['quarkdrive']?.fromBooster) {
				pokemon.removeVolatile('quarkdrive');
			}
		},
		onEnd(pokemon) {
			delete pokemon.volatiles['quarkdrive'];
			this.add('-end', pokemon, 'Quark Drive', '[silent]');
		},
		condition: {
			noCopy: true,
			onStart(pokemon, source, effect) {
				if (effect?.name === 'Booster Energy') {
					this.effectState.fromBooster = true;
					this.add('-activate', pokemon, 'ability: Quark Drive', '[fromitem]');
				} else {
					this.add('-activate', pokemon, 'ability: Quark Drive');
				}
				this.effectState.bestStat = pokemon.getBestStat(false, true);
				this.add('-start', pokemon, 'quarkdrive' + this.effectState.bestStat);
			},
			onModifyAtkPriority: 5,
			onModifyAtk(atk, pokemon) {
				if (this.effectState.bestStat !== 'atk' || pokemon.ignoringAbility()) return;
				this.debug('Quark Drive atk boost');
				return this.chainModify([5325, 4096]);
			},
			onModifyDefPriority: 6,
			onModifyDef(def, pokemon) {
				if (this.effectState.bestStat !== 'def' || pokemon.ignoringAbility()) return;
				this.debug('Quark Drive def boost');
				return this.chainModify([5325, 4096]);
			},
			onModifySpAPriority: 5,
			onModifySpA(spa, pokemon) {
				if (this.effectState.bestStat !== 'spa' || pokemon.ignoringAbility()) return;
				this.debug('Quark Drive spa boost');
				return this.chainModify([5325, 4096]);
			},
			onModifySpDPriority: 6,
			onModifySpD(spd, pokemon) {
				if (this.effectState.bestStat !== 'spd' || pokemon.ignoringAbility()) return;
				this.debug('Quark Drive spd boost');
				return this.chainModify([5325, 4096]);
			},
			onModifySpe(spe, pokemon) {
				if (this.effectState.bestStat !== 'spe' || pokemon.ignoringAbility()) return;
				this.debug('Quark Drive spe boost');
				return this.chainModify(1.5);
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Quark Drive');
			},
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1 },
		name: "Quark Drive",
		rating: 3,
		num: 282,
	},
	queenlymajesty: {
		onFoeTryMove(target, source, move) {
			const targetAllExceptions = ['perishsong', 'flowershield', 'rototiller'];
			if (move.target === 'foeSide' || (move.target === 'all' && !targetAllExceptions.includes(move.id))) {
				return;
			}

			const dazzlingHolder = this.effectState.target;
			if ((source.isAlly(dazzlingHolder) || move.target === 'all') && move.priority > 0.1) {
				this.attrLastMove('[still]');
				this.add('cant', dazzlingHolder, 'ability: Queenly Majesty', move, `[of] ${target}`);
				return false;
			}
		},
		flags: { breakable: 1 },
		name: "Queenly Majesty",
		rating: 2.5,
		num: 214,
	},
	quickdraw: {
		onFractionalPriorityPriority: -1,
		onFractionalPriority(priority, pokemon, target, move) {
			if (move.category !== "Status" && this.randomChance(3, 10)) {
				this.add('-activate', pokemon, 'ability: Quick Draw');
				return 0.1;
			}
		},
		flags: {},
		name: "Quick Draw",
		rating: 2.5,
		num: 259,
	},
	quickfeet: {
		onModifySpe(spe, pokemon) {
			if (pokemon.status) {
				return this.chainModify(1.5);
			}
		},
		flags: {},
		name: "Quick Feet",
		rating: 2.5,
		num: 95,
	},
	raindish: {
		onWeather(target, source, effect) {
			if (target.hasItem('utilityumbrella')) return;
			if (effect.id === 'raindance' || effect.id === 'primordialsea') {
				this.heal(target.baseMaxhp / 16);
			}
		},
		flags: {},
		name: "Rain Dish",
		rating: 1.5,
		num: 44,
	},
	rattled: {
		onDamagingHit(damage, target, source, move) {
			if (['Dark', 'Bug', 'Ghost'].includes(move.type)) {
				this.boost({ spe: 1 });
			}
		},
		onAfterBoost(boost, target, source, effect) {
			if (effect?.name === 'Intimidate' && boost.atk) {
				this.boost({ spe: 1 });
			}
		},
		flags: {},
		name: "Rattled",
		rating: 1,
		num: 155,
	},
	receiver: {
		onAllyFaint(target) {
			if (!this.effectState.target.hp) return;
			const ability = target.getAbility();
			if (ability.flags['noreceiver'] || ability.id === 'noability') return;
			this.effectState.target.setAbility(ability, target);
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1 },
		name: "Receiver",
		rating: 0,
		num: 222,
	},
	reckless: {
		onBasePowerPriority: 23,
		onBasePower(basePower, attacker, defender, move) {
			if (move.recoil || move.hasCrashDamage) {
				this.debug('Reckless boost');
				return this.chainModify([4915, 4096]);
			}
		},
		flags: {},
		name: "Reckless",
		rating: 3,
		num: 120,
	},
	refrigerate: {
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.type === 'Normal' && (!noModifyType.includes(move.id) || this.activeMove?.isMax) &&
				!(move.isZ && move.category !== 'Status') && !(move.name === 'Tera Blast' && pokemon.terastallized)) {
				move.type = 'Ice';
				move.typeChangerBoosted = this.effect;
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (move.typeChangerBoosted === this.effect) return this.chainModify([4915, 4096]);
		},
		flags: {},
		name: "Refrigerate",
		rating: 4,
		num: 174,
	},
	regenerator: {
		onSwitchOut(pokemon) {
			pokemon.heal(pokemon.baseMaxhp / 3);
		},
		flags: {},
		name: "Regenerator",
		rating: 4.5,
		num: 144,
	},
	ripen: {
		onTryHeal(damage, target, source, effect) {
			if (!effect) return;
			if (effect.name === 'Berry Juice' || effect.name === 'Leftovers') {
				this.add('-activate', target, 'ability: Ripen');
			}
			if ((effect as Item).isBerry) return this.chainModify(2);
		},
		onChangeBoost(boost, target, source, effect) {
			if (effect && (effect as Item).isBerry) {
				let b: BoostID;
				for (b in boost) {
					boost[b]! *= 2;
				}
			}
		},
		onSourceModifyDamagePriority: -1,
		onSourceModifyDamage(damage, source, target, move) {
			if (target.abilityState.berryWeaken) {
				target.abilityState.berryWeaken = false;
				return this.chainModify(0.5);
			}
		},
		onTryEatItemPriority: -1,
		onTryEatItem(item, pokemon) {
			this.add('-activate', pokemon, 'ability: Ripen');
		},
		onEatItem(item, pokemon) {
			const weakenBerries = [
				'Babiri Berry', 'Charti Berry', 'Chilan Berry', 'Chople Berry', 'Coba Berry', 'Colbur Berry', 'Haban Berry', 'Kasib Berry', 'Kebia Berry', 'Occa Berry', 'Passho Berry', 'Payapa Berry', 'Rindo Berry', 'Roseli Berry', 'Shuca Berry', 'Tanga Berry', 'Wacan Berry', 'Yache Berry',
			];
			// Record if the pokemon ate a berry to resist the attack
			pokemon.abilityState.berryWeaken = weakenBerries.includes(item.name);
		},
		flags: {},
		name: "Ripen",
		rating: 2,
		num: 247,
	},
	rivalry: {
		onBasePowerPriority: 24,
		onBasePower(basePower, attacker, defender, move) {
			if (attacker.gender && defender.gender) {
				if (attacker.gender === defender.gender) {
					this.debug('Rivalry boost');
					return this.chainModify(1.25);
				} else {
					this.debug('Rivalry weaken');
					return this.chainModify(0.75);
				}
			}
		},
		flags: {},
		name: "Rivalry",
		rating: 0,
		num: 79,
	},
	rkssystem: {
		// RKS System's type-changing itself is implemented in statuses.js
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
		name: "RKS System",
		rating: 4,
		num: 225,
	},
	rockhead: {
		onDamage(damage, target, source, effect) {
			if (effect.id === 'recoil') {
				if (!this.activeMove) throw new Error("Battle.activeMove is null");
				if (this.activeMove.id !== 'struggle') return null;
			}
		},
		flags: {},
		name: "Rock Head",
		rating: 3,
		num: 69,
	},
	rockypayload: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Rock') {
				this.debug('Rocky Payload boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Rock') {
				this.debug('Rocky Payload boost');
				return this.chainModify(1.5);
			}
		},
		flags: {},
		name: "Rocky Payload",
		rating: 3.5,
		num: 276,
	},
	roughskin: {
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, source, target, true)) {
				this.damage(source.baseMaxhp / 8, source, target);
			}
		},
		flags: {},
		name: "Rough Skin",
		rating: 2.5,
		num: 24,
	},
	runaway: {
		flags: {},
		name: "Run Away",
		rating: 0,
		num: 50,
	},
	sandforce: {
		onBasePowerPriority: 21,
		onBasePower(basePower, attacker, defender, move) {
			if (this.field.isWeather('sandstorm')) {
				if (move.type === 'Rock' || move.type === 'Ground' || move.type === 'Steel') {
					this.debug('Sand Force boost');
					return this.chainModify([5325, 4096]);
				}
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'sandstorm') return false;
		},
		flags: {},
		name: "Sand Force",
		rating: 2,
		num: 159,
	},
	sandrush: {
		onModifySpe(spe, pokemon) {
			if (this.field.isWeather('sandstorm')) {
				return this.chainModify(2);
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'sandstorm') return false;
		},
		flags: {},
		name: "Sand Rush",
		rating: 3,
		num: 146,
	},
	sandspit: {
		onDamagingHit(damage, target, source, move) {
			this.field.setWeather('sandstorm');
		},
		flags: {},
		name: "Sand Spit",
		rating: 1,
		num: 245,
	},
	sandstream: {
		onStart(source) {
			this.field.setWeather('sandstorm');
		},
		flags: {},
		name: "Sand Stream",
		rating: 4,
		num: 45,
	},
	sandveil: {
		onImmunity(type, pokemon) {
			if (type === 'sandstorm') return false;
		},
		onModifyAccuracyPriority: -1,
		onModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			if (this.field.isWeather('sandstorm')) {
				this.debug('Sand Veil - decreasing accuracy');
				return this.chainModify([3277, 4096]);
			}
		},
		flags: { breakable: 1 },
		name: "Sand Veil",
		rating: 1.5,
		num: 8,
	},
	sapsipper: {
		onTryHitPriority: 1,
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Grass') {
				if (!this.boost({ atk: 1 })) {
					this.add('-immune', target, '[from] ability: Sap Sipper');
				}
				return null;
			}
		},
		onAllyTryHitSide(target, source, move) {
			if (source === this.effectState.target || !target.isAlly(source)) return;
			if (move.type === 'Grass') {
				this.boost({ atk: 1 }, this.effectState.target);
			}
		},
		flags: { breakable: 1 },
		name: "Sap Sipper",
		rating: 3,
		num: 157,
	},
	schooling: {
		onSwitchInPriority: -1,
		onStart(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Wishiwashi' || pokemon.level < 20 || pokemon.transformed) return;
			if (pokemon.hp > pokemon.maxhp / 4) {
				if (pokemon.species.id === 'wishiwashi') {
					pokemon.formeChange('Wishiwashi-School');
				}
			} else {
				if (pokemon.species.id === 'wishiwashischool') {
					pokemon.formeChange('Wishiwashi');
				}
			}
		},
		onResidualOrder: 29,
		onResidual(pokemon) {
			if (
				pokemon.baseSpecies.baseSpecies !== 'Wishiwashi' || pokemon.level < 20 ||
				pokemon.transformed || !pokemon.hp
			) return;
			if (pokemon.hp > pokemon.maxhp / 4) {
				if (pokemon.species.id === 'wishiwashi') {
					pokemon.formeChange('Wishiwashi-School');
				}
			} else {
				if (pokemon.species.id === 'wishiwashischool') {
					pokemon.formeChange('Wishiwashi');
				}
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
		name: "Schooling",
		rating: 3,
		num: 208,
	},
	scrappy: {
		onModifyMovePriority: -5,
		onModifyMove(move) {
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity['Fighting'] = true;
				move.ignoreImmunity['Normal'] = true;
			}
		},
		onTryBoost(boost, target, source, effect) {
			if (effect.name === 'Intimidate' && boost.atk) {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Scrappy', `[of] ${target}`);
			}
		},
		flags: {},
		name: "Scrappy",
		rating: 3,
		num: 113,
	},
	screencleaner: {
		onStart(pokemon) {
			let activated = false;
			for (const sideCondition of ['reflect', 'lightscreen', 'auroraveil']) {
				for (const side of [pokemon.side, ...pokemon.side.foeSidesWithConditions()]) {
					if (side.getSideCondition(sideCondition)) {
						if (!activated) {
							this.add('-activate', pokemon, 'ability: Screen Cleaner');
							activated = true;
						}
						side.removeSideCondition(sideCondition);
					}
				}
			}
		},
		flags: {},
		name: "Screen Cleaner",
		rating: 2,
		num: 251,
	},
	seedsower: {
		onDamagingHit(damage, target, source, move) {
			this.field.setTerrain('grassyterrain');
		},
		flags: {},
		name: "Seed Sower",
		rating: 2.5,
		num: 269,
	},
	serenegrace: {
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
		name: "Serene Grace",
		rating: 3.5,
		num: 32,
	},
	shadowshield: {
		onSourceModifyDamage(damage, source, target, move) {
			if (target.hp >= target.maxhp) {
				this.debug('Shadow Shield weaken');
				return this.chainModify(0.5);
			}
		},
		flags: {},
		name: "Shadow Shield",
		rating: 3.5,
		num: 231,
	},
	shadowtag: {
		onFoeTrapPokemon(pokemon) {
			if (!pokemon.hasAbility('shadowtag') && pokemon.isAdjacent(this.effectState.target)) {
				pokemon.tryTrap(true);
			}
		},
		onFoeMaybeTrapPokemon(pokemon, source) {
			if (!source) source = this.effectState.target;
			if (!source || !pokemon.isAdjacent(source)) return;
			if (!pokemon.hasAbility('shadowtag')) {
				pokemon.maybeTrapped = true;
			}
		},
		flags: {},
		name: "Shadow Tag",
		rating: 5,
		num: 23,
	},
	sharpness: {
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['slicing']) {
				this.debug('Sharpness boost');
				return this.chainModify(1.5);
			}
		},
		flags: {},
		name: "Sharpness",
		rating: 3.5,
		num: 292,
	},
	shedskin: {
		onResidualOrder: 5,
		onResidualSubOrder: 3,
		onResidual(pokemon) {
			if (pokemon.hp && pokemon.status && this.randomChance(33, 100)) {
				this.debug('shed skin');
				this.add('-activate', pokemon, 'ability: Shed Skin');
				pokemon.cureStatus();
			}
		},
		flags: {},
		name: "Shed Skin",
		rating: 3,
		num: 61,
	},
	sheerforce: {
		onModifyMove(move, pokemon) {
			if (move.secondaries) {
				delete move.secondaries;
				// Technically not a secondary effect, but it is negated
				delete move.self;
				if (move.id === 'clangoroussoulblaze') delete move.selfBoost;
				// Actual negation of `AfterMoveSecondary` effects implemented in scripts.js
				move.hasSheerForce = true;
			}
		},
		onBasePowerPriority: 21,
		onBasePower(basePower, pokemon, target, move) {
			if (move.hasSheerForce) return this.chainModify([5325, 4096]);
		},
		flags: {},
		name: "Sheer Force",
		rating: 3.5,
		num: 125,
	},
	shellarmor: {
		onCriticalHit: false,
		flags: { breakable: 1 },
		name: "Shell Armor",
		rating: 1,
		num: 75,
	},
	shielddust: {
		onModifySecondaries(secondaries) {
			this.debug('Shield Dust prevent secondary');
			return secondaries.filter(effect => !!effect.self);
		},
		flags: { breakable: 1 },
		name: "Shield Dust",
		rating: 2,
		num: 19,
	},
	shieldsdown: {
		onSwitchInPriority: -1,
		onStart(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Minior' || pokemon.transformed) return;
			if (pokemon.hp > pokemon.maxhp / 2) {
				if (pokemon.species.forme !== 'Meteor') {
					pokemon.formeChange('Minior-Meteor');
				}
			} else {
				if (pokemon.species.forme === 'Meteor') {
					pokemon.formeChange(pokemon.set.species);
				}
			}
		},
		onResidualOrder: 29,
		onResidual(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Minior' || pokemon.transformed || !pokemon.hp) return;
			if (pokemon.hp > pokemon.maxhp / 2) {
				if (pokemon.species.forme !== 'Meteor') {
					pokemon.formeChange('Minior-Meteor');
				}
			} else {
				if (pokemon.species.forme === 'Meteor') {
					pokemon.formeChange(pokemon.set.species);
				}
			}
		},
		onSetStatus(status, target, source, effect) {
			if (target.species.id !== 'miniormeteor' || target.transformed) return;
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Shields Down');
			}
			return false;
		},
		onTryAddVolatile(status, target) {
			if (target.species.id !== 'miniormeteor' || target.transformed) return;
			if (status.id !== 'yawn') return;
			this.add('-immune', target, '[from] ability: Shields Down');
			return null;
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
		name: "Shields Down",
		rating: 3,
		num: 197,
	},
	simple: {
		onChangeBoost(boost, target, source, effect) {
			if (effect && effect.id === 'zpower') return;
			let i: BoostID;
			for (i in boost) {
				boost[i]! *= 2;
			}
		},
		flags: { breakable: 1 },
		name: "Simple",
		rating: 4,
		num: 86,
	},
	skilllink: {
		onModifyMove(move) {
			if (move.multihit && Array.isArray(move.multihit) && move.multihit.length) {
				move.multihit = move.multihit[1];
			}
			if (move.multiaccuracy) {
				delete move.multiaccuracy;
			}
		},
		flags: {},
		name: "Skill Link",
		rating: 3,
		num: 92,
	},
	slowstart: {
		onStart(pokemon) {
			this.add('-start', pokemon, 'ability: Slow Start');
			this.effectState.counter = 5;
		},
		onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			if (pokemon.activeTurns && this.effectState.counter) {
				this.effectState.counter--;
				if (!this.effectState.counter) {
					this.add('-end', pokemon, 'Slow Start');
					delete this.effectState.counter;
				}
			}
		},
		onModifyAtkPriority: 5,
		onModifyAtk(atk, pokemon) {
			if (this.effectState.counter) {
				return this.chainModify(0.5);
			}
		},
		onModifySpe(spe, pokemon) {
			if (this.effectState.counter) {
				return this.chainModify(0.5);
			}
		},
		flags: {},
		name: "Slow Start",
		rating: -1,
		num: 112,
	},
	slushrush: {
		onModifySpe(spe, pokemon) {
			if (this.field.isWeather(['hail', 'snowscape'])) {
				return this.chainModify(2);
			}
		},
		flags: {},
		name: "Slush Rush",
		rating: 3,
		num: 202,
	},
	sniper: {
		onModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).crit) {
				this.debug('Sniper boost');
				return this.chainModify(1.5);
			}
		},
		flags: {},
		name: "Sniper",
		rating: 2,
		num: 97,
	},
	snowcloak: {
		onImmunity(type, pokemon) {
			if (type === 'hail') return false;
		},
		onModifyAccuracyPriority: -1,
		onModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			if (this.field.isWeather(['hail', 'snowscape'])) {
				this.debug('Snow Cloak - decreasing accuracy');
				return this.chainModify([3277, 4096]);
			}
		},
		flags: { breakable: 1 },
		name: "Snow Cloak",
		rating: 1.5,
		num: 81,
	},
	snowwarning: {
		onStart(source) {
			this.field.setWeather('snowscape');
		},
		flags: {},
		name: "Snow Warning",
		rating: 4,
		num: 117,
	},
	solarpower: {
		onModifySpAPriority: 5,
		onModifySpA(spa, pokemon) {
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.5);
			}
		},
		onWeather(target, source, effect) {
			if (target.hasItem('utilityumbrella')) return;
			if (effect.id === 'sunnyday' || effect.id === 'desolateland') {
				this.damage(target.baseMaxhp / 8, target, target);
			}
		},
		flags: {},
		name: "Solar Power",
		rating: 2,
		num: 94,
	},
	solidrock: {
		onSourceModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).typeMod > 0) {
				this.debug('Solid Rock neutralize');
				return this.chainModify(0.75);
			}
		},
		flags: { breakable: 1 },
		name: "Solid Rock",
		rating: 3,
		num: 116,
	},
	soulheart: {
		onAnyFaintPriority: 1,
		onAnyFaint() {
			this.boost({ spa: 1 }, this.effectState.target);
		},
		flags: {},
		name: "Soul-Heart",
		rating: 3.5,
		num: 220,
	},
	soundproof: {
		onTryHit(target, source, move) {
			if (target !== source && move.flags['sound']) {
				this.add('-immune', target, '[from] ability: Soundproof');
				return null;
			}
		},
		onAllyTryHitSide(target, source, move) {
			if (move.flags['sound']) {
				this.add('-immune', this.effectState.target, '[from] ability: Soundproof');
			}
		},
		flags: { breakable: 1 },
		name: "Soundproof",
		rating: 2,
		num: 43,
	},
	speedboost: {
		onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			if (pokemon.activeTurns) {
				this.boost({ spe: 1 });
			}
		},
		flags: {},
		name: "Speed Boost",
		rating: 4.5,
		num: 3,
	},
	stakeout: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender) {
			if (!defender.activeTurns) {
				this.debug('Stakeout boost');
				return this.chainModify(2);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender) {
			if (!defender.activeTurns) {
				this.debug('Stakeout boost');
				return this.chainModify(2);
			}
		},
		flags: {},
		name: "Stakeout",
		rating: 4.5,
		num: 198,
	},
	stall: {
		onFractionalPriority: -0.1,
		flags: {},
		name: "Stall",
		rating: -1,
		num: 100,
	},
	stalwart: {
		onModifyMovePriority: 1,
		onModifyMove(move) {
			// most of the implementation is in Battle#getTarget
			move.tracksTarget = move.target !== 'scripted';
		},
		flags: {},
		name: "Stalwart",
		rating: 0,
		num: 242,
	},
	stamina: {
		onDamagingHit(damage, target, source, effect) {
			this.boost({ def: 1 });
		},
		flags: {},
		name: "Stamina",
		rating: 4,
		num: 192,
	},
	stancechange: {
		onModifyMovePriority: 1,
		onModifyMove(move, attacker, defender) {
			if (attacker.species.baseSpecies !== 'Aegislash' || attacker.transformed) return;
			if (move.category === 'Status' && move.id !== 'kingsshield') return;
			const targetForme = (move.id === 'kingsshield' ? 'Aegislash' : 'Aegislash-Blade');
			if (attacker.species.name !== targetForme) attacker.formeChange(targetForme);
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
		name: "Stance Change",
		rating: 4,
		num: 176,
	},
	static: {
		onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, source, target)) {
				if (this.randomChance(3, 10)) {
					source.trySetStatus('par', target);
				}
			}
		},
		flags: {},
		name: "Static",
		rating: 2,
		num: 9,
	},
	steadfast: {
		onFlinch(pokemon) {
			this.boost({ spe: 1 });
		},
		flags: {},
		name: "Steadfast",
		rating: 1,
		num: 80,
	},
	steamengine: {
		onDamagingHit(damage, target, source, move) {
			if (['Water', 'Fire'].includes(move.type)) {
				this.boost({ spe: 6 });
			}
		},
		flags: {},
		name: "Steam Engine",
		rating: 2,
		num: 243,
	},
	steelworker: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Steel') {
				this.debug('Steelworker boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Steel') {
				this.debug('Steelworker boost');
				return this.chainModify(1.5);
			}
		},
		flags: {},
		name: "Steelworker",
		rating: 3.5,
		num: 200,
	},
	steelyspirit: {
		onAllyBasePowerPriority: 22,
		onAllyBasePower(basePower, attacker, defender, move) {
			if (move.type === 'Steel') {
				this.debug('Steely Spirit boost');
				return this.chainModify(1.5);
			}
		},
		flags: {},
		name: "Steely Spirit",
		rating: 3.5,
		num: 252,
	},
	stench: {
		onModifyMovePriority: -1,
		onModifyMove(move) {
			if (move.category !== "Status") {
				this.debug('Adding Stench flinch');
				if (!move.secondaries) move.secondaries = [];
				for (const secondary of move.secondaries) {
					if (secondary.volatileStatus === 'flinch') return;
				}
				move.secondaries.push({
					chance: 10,
					volatileStatus: 'flinch',
				});
			}
		},
		flags: {},
		name: "Stench",
		rating: 0.5,
		num: 1,
	},
	stickyhold: {
		onTakeItem(item, pokemon, source) {
			if (!this.activeMove) throw new Error("Battle.activeMove is null");
			if (!pokemon.hp || pokemon.item === 'stickybarb') return;
			if ((source && source !== pokemon) || this.activeMove.id === 'knockoff') {
				this.add('-activate', pokemon, 'ability: Sticky Hold');
				return false;
			}
		},
		flags: { breakable: 1 },
		name: "Sticky Hold",
		rating: 1.5,
		num: 60,
	},
	stormdrain: {
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Water') {
				if (!this.boost({ spa: 1 })) {
					this.add('-immune', target, '[from] ability: Storm Drain');
				}
				return null;
			}
		},
		onAnyRedirectTarget(target, source, source2, move) {
			if (move.type !== 'Water' || move.flags['pledgecombo']) return;
			const redirectTarget = ['randomNormal', 'adjacentFoe'].includes(move.target) ? 'normal' : move.target;
			if (this.validTarget(this.effectState.target, source, redirectTarget)) {
				if (move.smartTarget) move.smartTarget = false;
				if (this.effectState.target !== target) {
					this.add('-activate', this.effectState.target, 'ability: Storm Drain');
				}
				return this.effectState.target;
			}
		},
		flags: { breakable: 1 },
		name: "Storm Drain",
		rating: 3,
		num: 114,
	},
	strongjaw: {
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['bite']) {
				return this.chainModify(1.5);
			}
		},
		flags: {},
		name: "Strong Jaw",
		rating: 3.5,
		num: 173,
	},
	sturdy: {
		onTryHit(pokemon, target, move) {
			if (move.ohko) {
				this.add('-immune', pokemon, '[from] ability: Sturdy');
				return null;
			}
		},
		onDamagePriority: -30,
		onDamage(damage, target, source, effect) {
			if (target.hp === target.maxhp && damage >= target.hp && effect && effect.effectType === 'Move') {
				this.add('-ability', target, 'Sturdy');
				return target.hp - 1;
			}
		},
		flags: { breakable: 1 },
		name: "Sturdy",
		rating: 3,
		num: 5,
	},
	suctioncups: {
		onDragOutPriority: 1,
		onDragOut(pokemon) {
			this.add('-activate', pokemon, 'ability: Suction Cups');
			return null;
		},
		flags: { breakable: 1 },
		name: "Suction Cups",
		rating: 1,
		num: 21,
	},
	superluck: {
		onModifyCritRatio(critRatio) {
			return critRatio + 1;
		},
		flags: {},
		name: "Super Luck",
		rating: 1.5,
		num: 105,
	},
	supersweetsyrup: {
		onStart(pokemon) {
			if (pokemon.syrupTriggered) return;
			pokemon.syrupTriggered = true;
			this.add('-ability', pokemon, 'Supersweet Syrup');
			for (const target of pokemon.adjacentFoes()) {
				if (target.volatiles['substitute']) {
					this.add('-immune', target);
				} else {
					this.boost({ evasion: -1 }, target, pokemon, null, true);
				}
			}
		},
		flags: {},
		name: "Supersweet Syrup",
		rating: 1.5,
		num: 306,
	},
	supremeoverlord: {
		onStart(pokemon) {
			if (pokemon.side.totalFainted) {
				this.add('-activate', pokemon, 'ability: Supreme Overlord');
				const fallen = Math.min(pokemon.side.totalFainted, 5);
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
				this.debug(`Supreme Overlord boost: ${powMod[this.effectState.fallen]}/4096`);
				return this.chainModify([powMod[this.effectState.fallen], 4096]);
			}
		},
		flags: {},
		name: "Supreme Overlord",
		rating: 4,
		num: 293,
	},
	surgesurfer: {
		onModifySpe(spe) {
			if (this.field.isTerrain('electricterrain')) {
				return this.chainModify(2);
			}
		},
		flags: {},
		name: "Surge Surfer",
		rating: 3,
		num: 207,
	},
	swarm: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Bug' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Swarm boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Bug' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Swarm boost');
				return this.chainModify(1.5);
			}
		},
		flags: {},
		name: "Swarm",
		rating: 2,
		num: 68,
	},
	sweetveil: {
		onAllySetStatus(status, target, source, effect) {
			if (status.id === 'slp') {
				this.debug('Sweet Veil interrupts sleep');
				const effectHolder = this.effectState.target;
				this.add('-block', target, 'ability: Sweet Veil', `[of] ${effectHolder}`);
				return null;
			}
		},
		onAllyTryAddVolatile(status, target) {
			if (status.id === 'yawn') {
				this.debug('Sweet Veil blocking yawn');
				const effectHolder = this.effectState.target;
				this.add('-block', target, 'ability: Sweet Veil', `[of] ${effectHolder}`);
				return null;
			}
		},
		flags: { breakable: 1 },
		name: "Sweet Veil",
		rating: 2,
		num: 175,
	},
	swiftswim: {
		onModifySpe(spe, pokemon) {
			if (['raindance', 'primordialsea'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(2);
			}
		},
		flags: {},
		name: "Swift Swim",
		rating: 3,
		num: 33,
	},
	swordofruin: {
		onStart(pokemon) {
			if (this.suppressingAbility(pokemon)) return;
			this.add('-ability', pokemon, 'Sword of Ruin');
		},
		onAnyModifyDef(def, target, source, move) {
			const abilityHolder = this.effectState.target;
			if (target.hasAbility('Sword of Ruin')) return;
			if (!move.ruinedDef?.hasAbility('Sword of Ruin')) move.ruinedDef = abilityHolder;
			if (move.ruinedDef !== abilityHolder) return;
			this.debug('Sword of Ruin Def drop');
			return this.chainModify(0.75);
		},
		flags: {},
		name: "Sword of Ruin",
		rating: 4.5,
		num: 285,
	},
	symbiosis: {
		onAllyAfterUseItem(item, pokemon) {
			if (pokemon.switchFlag) return;
			const source = this.effectState.target;
			const myItem = source.takeItem();
			if (!myItem) return;
			if (
				!this.singleEvent('TakeItem', myItem, source.itemState, pokemon, source, this.effect, myItem) ||
				!pokemon.setItem(myItem)
			) {
				source.item = myItem.id;
				return;
			}
			this.add('-activate', source, 'ability: Symbiosis', myItem, `[of] ${pokemon}`);
		},
		flags: {},
		name: "Symbiosis",
		rating: 0,
		num: 180,
	},
	synchronize: {
		onAfterSetStatus(status, target, source, effect) {
			if (!source || source === target) return;
			if (effect && effect.id === 'toxicspikes') return;
			if (status.id === 'slp' || status.id === 'frz') return;
			this.add('-activate', target, 'ability: Synchronize');
			// Hack to make status-prevention abilities think Synchronize is a status move
			// and show messages when activating against it.
			source.trySetStatus(status, target, { status: status.id, id: 'synchronize' } as Effect);
		},
		flags: {},
		name: "Synchronize",
		rating: 2,
		num: 28,
	},
	tabletsofruin: {
		onStart(pokemon) {
			if (this.suppressingAbility(pokemon)) return;
			this.add('-ability', pokemon, 'Tablets of Ruin');
		},
		onAnyModifyAtk(atk, source, target, move) {
			const abilityHolder = this.effectState.target;
			if (source.hasAbility('Tablets of Ruin')) return;
			if (!move.ruinedAtk) move.ruinedAtk = abilityHolder;
			if (move.ruinedAtk !== abilityHolder) return;
			this.debug('Tablets of Ruin Atk drop');
			return this.chainModify(0.75);
		},
		flags: {},
		name: "Tablets of Ruin",
		rating: 4.5,
		num: 284,
	},
	tangledfeet: {
		onModifyAccuracyPriority: -1,
		onModifyAccuracy(accuracy, target) {
			if (typeof accuracy !== 'number') return;
			if (target?.volatiles['confusion']) {
				this.debug('Tangled Feet - decreasing accuracy');
				return this.chainModify(0.5);
			}
		},
		flags: { breakable: 1 },
		name: "Tangled Feet",
		rating: 1,
		num: 77,
	},
	tanglinghair: {
		onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, source, target, true)) {
				this.add('-ability', target, 'Tangling Hair');
				this.boost({ spe: -1 }, source, target, null, true);
			}
		},
		flags: {},
		name: "Tangling Hair",
		rating: 2,
		num: 221,
	},
	technician: {
		onBasePowerPriority: 30,
		onBasePower(basePower, attacker, defender, move) {
			const basePowerAfterMultiplier = this.modify(basePower, this.event.modifier);
			this.debug(`Base Power: ${basePowerAfterMultiplier}`);
			if (basePowerAfterMultiplier <= 60) {
				this.debug('Technician boost');
				return this.chainModify(1.5);
			}
		},
		flags: {},
		name: "Technician",
		rating: 3.5,
		num: 101,
	},
	telepathy: {
		onTryHit(target, source, move) {
			if (target !== source && target.isAlly(source) && move.category !== 'Status') {
				this.add('-activate', target, 'ability: Telepathy');
				return null;
			}
		},
		flags: { breakable: 1 },
		name: "Telepathy",
		rating: 0,
		num: 140,
	},
	teraformzero: {
		onAfterTerastallization(pokemon) {
			if (pokemon.baseSpecies.name !== 'Terapagos-Stellar') return;
			if (this.field.weather || this.field.terrain) {
				this.add('-ability', pokemon, 'Teraform Zero');
				this.field.clearWeather();
				this.field.clearTerrain();
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1 },
		name: "Teraform Zero",
		rating: 3,
		num: 309,
	},
	terashell: {
		// effectiveness implemented in sim/pokemon.ts:Pokemon#runEffectiveness
		// needs two checks to reset between regular moves and future attacks
		onAnyBeforeMove() {
			delete this.effectState.resisted;
		},
		onAnyAfterMove() {
			delete this.effectState.resisted;
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, breakable: 1 },
		name: "Tera Shell",
		rating: 3.5,
		num: 308,
	},
	terashift: {
		onSwitchInPriority: 2,
		onSwitchIn(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Terapagos') return;
			if (pokemon.species.forme !== 'Terastal') {
				this.add('-activate', pokemon, 'ability: Tera Shift');
				pokemon.formeChange('Terapagos-Terastal', this.effect, true);
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1, notransform: 1 },
		name: "Tera Shift",
		rating: 3,
		num: 307,
	},
	teravolt: {
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Teravolt');
		},
		onModifyMove(move) {
			move.ignoreAbility = true;
		},
		flags: {},
		name: "Teravolt",
		rating: 3,
		num: 164,
	},
	thermalexchange: {
		onDamagingHit(damage, target, source, move) {
			if (move.type === 'Fire') {
				this.boost({ atk: 1 });
			}
		},
		onUpdate(pokemon) {
			if (pokemon.status === 'brn') {
				this.add('-activate', pokemon, 'ability: Thermal Exchange');
				pokemon.cureStatus();
			}
		},
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'brn') return;
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Thermal Exchange');
			}
			return false;
		},
		flags: { breakable: 1 },
		name: "Thermal Exchange",
		rating: 2.5,
		num: 270,
	},
	thickfat: {
		onSourceModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Ice' || move.type === 'Fire') {
				this.debug('Thick Fat weaken');
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Ice' || move.type === 'Fire') {
				this.debug('Thick Fat weaken');
				return this.chainModify(0.5);
			}
		},
		flags: { breakable: 1 },
		name: "Thick Fat",
		rating: 3.5,
		num: 47,
	},
	tintedlens: {
		onModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).typeMod < 0) {
				this.debug('Tinted Lens boost');
				return this.chainModify(2);
			}
		},
		flags: {},
		name: "Tinted Lens",
		rating: 4,
		num: 110,
	},
	torrent: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Water' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Torrent boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Water' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Torrent boost');
				return this.chainModify(1.5);
			}
		},
		flags: {},
		name: "Torrent",
		rating: 2,
		num: 67,
	},
	toughclaws: {
		onBasePowerPriority: 21,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['contact']) {
				return this.chainModify([5325, 4096]);
			}
		},
		flags: {},
		name: "Tough Claws",
		rating: 3.5,
		num: 181,
	},
	toxicboost: {
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if ((attacker.status === 'psn' || attacker.status === 'tox') && move.category === 'Physical') {
				return this.chainModify(1.5);
			}
		},
		flags: {},
		name: "Toxic Boost",
		rating: 3,
		num: 137,
	},
	toxicchain: {
		onSourceDamagingHit(damage, target, source, move) {
			// Despite not being a secondary, Shield Dust / Covert Cloak block Toxic Chain's effect
			if (target.hasAbility('shielddust') || target.hasItem('covertcloak')) return;

			if (this.randomChance(3, 10)) {
				target.trySetStatus('tox', source);
			}
		},
		flags: {},
		name: "Toxic Chain",
		rating: 4.5,
		num: 305,
	},
	toxicdebris: {
		onDamagingHit(damage, target, source, move) {
			const side = source.isAlly(target) ? source.side.foe : source.side;
			const toxicSpikes = side.sideConditions['toxicspikes'];
			if (move.category === 'Physical' && (!toxicSpikes || toxicSpikes.layers < 2)) {
				this.add('-activate', target, 'ability: Toxic Debris');
				side.addSideCondition('toxicspikes', target);
			}
		},
		flags: {},
		name: "Toxic Debris",
		rating: 3.5,
		num: 295,
	},
	trace: {
		onStart(pokemon) {
			this.effectState.seek = true;
			// n.b. only affects Hackmons
			// interaction with No Ability is complicated: https://www.smogon.com/forums/threads/pokemon-sun-moon-battle-mechanics-research.3586701/page-76#post-7790209
			if (pokemon.adjacentFoes().some(foeActive => foeActive.ability === 'noability')) {
				this.effectState.seek = false;
			}
			// interaction with Ability Shield is similar to No Ability
			if (pokemon.hasItem('Ability Shield')) {
				this.add('-block', pokemon, 'item: Ability Shield');
				this.effectState.seek = false;
			}
			if (this.effectState.seek) {
				this.singleEvent('Update', this.effect, this.effectState, pokemon);
			}
		},
		onUpdate(pokemon) {
			if (!this.effectState.seek) return;

			const possibleTargets = pokemon.adjacentFoes().filter(
				target => !target.getAbility().flags['notrace'] && target.ability !== 'noability'
			);
			if (!possibleTargets.length) return;

			const target = this.sample(possibleTargets);
			const ability = target.getAbility();
			pokemon.setAbility(ability, target);
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1 },
		name: "Trace",
		rating: 2.5,
		num: 36,
	},
	transistor: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Electric') {
				this.debug('Transistor boost');
				return this.chainModify([5325, 4096]);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Electric') {
				this.debug('Transistor boost');
				return this.chainModify([5325, 4096]);
			}
		},
		flags: {},
		name: "Transistor",
		rating: 3.5,
		num: 262,
	},
	triage: {
		onModifyPriority(priority, pokemon, target, move) {
			if (move?.flags['heal']) return priority + 3;
		},
		flags: {},
		name: "Triage",
		rating: 3.5,
		num: 205,
	},
	truant: {
		onStart(pokemon) {
			pokemon.removeVolatile('truant');
			if (pokemon.activeTurns && (pokemon.moveThisTurnResult !== undefined || !this.queue.willMove(pokemon))) {
				pokemon.addVolatile('truant');
			}
		},
		onBeforeMovePriority: 9,
		onBeforeMove(pokemon) {
			if (pokemon.removeVolatile('truant')) {
				this.add('cant', pokemon, 'ability: Truant');
				return false;
			}
			pokemon.addVolatile('truant');
		},
		condition: {},
		flags: {},
		name: "Truant",
		rating: -1,
		num: 54,
	},
	turboblaze: {
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Turboblaze');
		},
		onModifyMove(move) {
			move.ignoreAbility = true;
		},
		flags: {},
		name: "Turboblaze",
		rating: 3,
		num: 163,
	},
	unaware: {
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
		flags: { breakable: 1 },
		name: "Unaware",
		rating: 4,
		num: 109,
	},
	unburden: {
		onAfterUseItem(item, pokemon) {
			if (pokemon !== this.effectState.target) return;
			pokemon.addVolatile('unburden');
		},
		onTakeItem(item, pokemon) {
			pokemon.addVolatile('unburden');
		},
		onEnd(pokemon) {
			pokemon.removeVolatile('unburden');
		},
		condition: {
			onModifySpe(spe, pokemon) {
				if (!pokemon.item && !pokemon.ignoringAbility()) {
					return this.chainModify(2);
				}
			},
		},
		flags: {},
		name: "Unburden",
		rating: 3.5,
		num: 84,
	},
	unnerve: {
		onSwitchInPriority: 1,
		onStart(pokemon) {
			if (this.effectState.unnerved) return;
			this.add('-ability', pokemon, 'Unnerve');
			this.effectState.unnerved = true;
		},
		onEnd() {
			this.effectState.unnerved = false;
		},
		onFoeTryEatItem() {
			return !this.effectState.unnerved;
		},
		flags: {},
		name: "Unnerve",
		rating: 1,
		num: 127,
	},
	unseenfist: {
		onModifyMove(move) {
			if (move.flags['contact']) delete move.flags['protect'];
		},
		flags: {},
		name: "Unseen Fist",
		rating: 2,
		num: 260,
	},
	vesselofruin: {
		onStart(pokemon) {
			if (this.suppressingAbility(pokemon)) return;
			this.add('-ability', pokemon, 'Vessel of Ruin');
		},
		onAnyModifySpA(spa, source, target, move) {
			const abilityHolder = this.effectState.target;
			if (source.hasAbility('Vessel of Ruin')) return;
			if (!move.ruinedSpA) move.ruinedSpA = abilityHolder;
			if (move.ruinedSpA !== abilityHolder) return;
			this.debug('Vessel of Ruin SpA drop');
			return this.chainModify(0.75);
		},
		flags: {},
		name: "Vessel of Ruin",
		rating: 4.5,
		num: 284,
	},
	victorystar: {
		onAnyModifyAccuracyPriority: -1,
		onAnyModifyAccuracy(accuracy, target, source) {
			if (source.isAlly(this.effectState.target) && typeof accuracy === 'number') {
				return this.chainModify([4506, 4096]);
			}
		},
		flags: {},
		name: "Victory Star",
		rating: 2,
		num: 162,
	},
	vitalspirit: {
		onUpdate(pokemon) {
			if (pokemon.status === 'slp') {
				this.add('-activate', pokemon, 'ability: Vital Spirit');
				pokemon.cureStatus();
			}
		},
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'slp') return;
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Vital Spirit');
			}
			return false;
		},
		onTryAddVolatile(status, target) {
			if (status.id === 'yawn') {
				this.add('-immune', target, '[from] ability: Vital Spirit');
				return null;
			}
		},
		flags: { breakable: 1 },
		name: "Vital Spirit",
		rating: 1.5,
		num: 72,
	},
	voltabsorb: {
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Electric') {
				if (!this.heal(target.baseMaxhp / 4)) {
					this.add('-immune', target, '[from] ability: Volt Absorb');
				}
				return null;
			}
		},
		flags: { breakable: 1 },
		name: "Volt Absorb",
		rating: 3.5,
		num: 10,
	},
	wanderingspirit: {
		onDamagingHit(damage, target, source, move) {
			if (source.getAbility().flags['failskillswap'] || target.volatiles['dynamax']) return;

			if (this.checkMoveMakesContact(move, source, target)) {
				const targetCanBeSet = this.runEvent('SetAbility', target, source, this.effect, source.ability);
				if (!targetCanBeSet) return targetCanBeSet;
				const sourceAbility = source.setAbility('wanderingspirit', target);
				if (!sourceAbility) return;
				if (target.isAlly(source)) {
					this.add('-activate', target, 'Skill Swap', '', '', `[of] ${source}`);
				} else {
					this.add('-activate', target, 'ability: Wandering Spirit', this.dex.abilities.get(sourceAbility).name, 'Wandering Spirit', `[of] ${source}`);
				}
				target.setAbility(sourceAbility);
			}
		},
		flags: {},
		name: "Wandering Spirit",
		rating: 2.5,
		num: 254,
	},
	waterabsorb: {
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Water') {
				if (!this.heal(target.baseMaxhp / 4)) {
					this.add('-immune', target, '[from] ability: Water Absorb');
				}
				return null;
			}
		},
		flags: { breakable: 1 },
		name: "Water Absorb",
		rating: 3.5,
		num: 11,
	},
	waterbubble: {
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
		onUpdate(pokemon) {
			if (pokemon.status === 'brn') {
				this.add('-activate', pokemon, 'ability: Water Bubble');
				pokemon.cureStatus();
			}
		},
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'brn') return;
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Water Bubble');
			}
			return false;
		},
		flags: { breakable: 1 },
		name: "Water Bubble",
		rating: 4.5,
		num: 199,
	},
	watercompaction: {
		onDamagingHit(damage, target, source, move) {
			if (move.type === 'Water') {
				this.boost({ def: 2 });
			}
		},
		flags: {},
		name: "Water Compaction",
		rating: 1.5,
		num: 195,
	},
	waterveil: {
		onUpdate(pokemon) {
			if (pokemon.status === 'brn') {
				this.add('-activate', pokemon, 'ability: Water Veil');
				pokemon.cureStatus();
			}
		},
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'brn') return;
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Water Veil');
			}
			return false;
		},
		flags: { breakable: 1 },
		name: "Water Veil",
		rating: 2,
		num: 41,
	},
	weakarmor: {
		onDamagingHit(damage, target, source, move) {
			if (move.category === 'Physical') {
				this.boost({ def: -1, spe: 2 }, target, target);
			}
		},
		flags: {},
		name: "Weak Armor",
		rating: 1,
		num: 133,
	},
	wellbakedbody: {
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Fire') {
				if (!this.boost({ def: 2 })) {
					this.add('-immune', target, '[from] ability: Well-Baked Body');
				}
				return null;
			}
		},
		flags: { breakable: 1 },
		name: "Well-Baked Body",
		rating: 3.5,
		num: 273,
	},
	whitesmoke: {
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
				this.add("-fail", target, "unboost", "[from] ability: White Smoke", `[of] ${target}`);
			}
		},
		flags: { breakable: 1 },
		name: "White Smoke",
		rating: 2,
		num: 73,
	},
	wimpout: {
		onEmergencyExit(target) {
			if (!this.canSwitch(target.side) || target.forceSwitchFlag || target.switchFlag) return;
			for (const side of this.sides) {
				for (const active of side.active) {
					active.switchFlag = false;
				}
			}
			target.switchFlag = true;
			this.add('-activate', target, 'ability: Wimp Out');
		},
		flags: {},
		name: "Wimp Out",
		rating: 1,
		num: 193,
	},
	windpower: {
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) {
			if (move.flags['wind']) {
				target.addVolatile('charge');
			}
		},
		onSideConditionStart(side, source, sideCondition) {
			const pokemon = this.effectState.target;
			if (sideCondition.id === 'tailwind') {
				pokemon.addVolatile('charge');
			}
		},
		flags: {},
		name: "Wind Power",
		rating: 1,
		num: 277,
	},
	windrider: {
		onStart(pokemon) {
			if (pokemon.side.sideConditions['tailwind']) {
				this.boost({ atk: 1 }, pokemon, pokemon);
			}
		},
		onTryHit(target, source, move) {
			if (target !== source && move.flags['wind']) {
				if (!this.boost({ atk: 1 }, target, target)) {
					this.add('-immune', target, '[from] ability: Wind Rider');
				}
				return null;
			}
		},
		onSideConditionStart(side, source, sideCondition) {
			const pokemon = this.effectState.target;
			if (sideCondition.id === 'tailwind') {
				this.boost({ atk: 1 }, pokemon, pokemon);
			}
		},
		flags: { breakable: 1 },
		name: "Wind Rider",
		rating: 3.5,
		// We do not want Brambleghast to get Infiltrator in Randbats
		num: 274,
	},
	wonderguard: {
		onTryHit(target, source, move) {
			if (target === source || move.category === 'Status' || move.id === 'struggle') return;
			if (move.id === 'skydrop' && !source.volatiles['skydrop']) return;
			this.debug('Wonder Guard immunity: ' + move.id);
			if (target.runEffectiveness(move) <= 0 || !target.runImmunity(move)) {
				if (move.smartTarget) {
					move.smartTarget = false;
				} else {
					this.add('-immune', target, '[from] ability: Wonder Guard');
				}
				return null;
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, failskillswap: 1, breakable: 1 },
		name: "Wonder Guard",
		rating: 5,
		num: 25,
	},
	wonderskin: {
		onModifyAccuracyPriority: 10,
		onModifyAccuracy(accuracy, target, source, move) {
			if (move.category === 'Status' && typeof accuracy === 'number') {
				this.debug('Wonder Skin - setting accuracy to 50');
				return 50;
			}
		},
		flags: { breakable: 1 },
		name: "Wonder Skin",
		rating: 2,
		num: 147,
	},
	zenmode: {
		onResidualOrder: 29,
		onResidual(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Darmanitan' || pokemon.transformed) {
				return;
			}
			if (pokemon.hp <= pokemon.maxhp / 2 && !['Zen', 'Galar-Zen'].includes(pokemon.species.forme)) {
				pokemon.addVolatile('zenmode');
			} else if (pokemon.hp > pokemon.maxhp / 2 && ['Zen', 'Galar-Zen'].includes(pokemon.species.forme)) {
				pokemon.addVolatile('zenmode'); // in case of base Darmanitan-Zen
				pokemon.removeVolatile('zenmode');
			}
		},
		onEnd(pokemon) {
			if (!pokemon.volatiles['zenmode'] || !pokemon.hp) return;
			pokemon.transformed = false;
			delete pokemon.volatiles['zenmode'];
			if (pokemon.species.baseSpecies === 'Darmanitan' && pokemon.species.battleOnly) {
				pokemon.formeChange(pokemon.species.battleOnly as string, this.effect, false, '0', '[silent]');
			}
		},
		condition: {
			onStart(pokemon) {
				if (!pokemon.species.name.includes('Galar')) {
					if (pokemon.species.id !== 'darmanitanzen') pokemon.formeChange('Darmanitan-Zen');
				} else {
					if (pokemon.species.id !== 'darmanitangalarzen') pokemon.formeChange('Darmanitan-Galar-Zen');
				}
			},
			onEnd(pokemon) {
				if (['Zen', 'Galar-Zen'].includes(pokemon.species.forme)) {
					pokemon.formeChange(pokemon.species.battleOnly as string);
				}
			},
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
		name: "Zen Mode",
		rating: 0,
		num: 161,
	},
	zerotohero: {
		onSwitchOut(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Palafin') return;
			if (pokemon.species.forme !== 'Hero') {
				pokemon.formeChange('Palafin-Hero', this.effect, true);
				pokemon.heroMessageDisplayed = false;
			}
		},
		onSwitchIn(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Palafin') return;
			if (!pokemon.heroMessageDisplayed && pokemon.species.forme === 'Hero') {
				this.add('-activate', pokemon, 'ability: Zero to Hero');
				pokemon.heroMessageDisplayed = true;
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1, notransform: 1 },
		name: "Zero to Hero",
		rating: 5,
		num: 278,
	},

	// CAP
	mountaineer: {
		onDamage(damage, target, source, effect) {
			if (effect && effect.id === 'stealthrock') {
				return false;
			}
		},
		onTryHit(target, source, move) {
			if (move.type === 'Rock' && !target.activeTurns) {
				this.add('-immune', target, '[from] ability: Mountaineer');
				return null;
			}
		},
		isNonstandard: "CAP",
		flags: { breakable: 1 },
		name: "Mountaineer",
		rating: 3,
		num: -1,
	},
	rebound: {
		isNonstandard: "CAP",
		onTryHitPriority: 1,
		onTryHit(target, source, move) {
			if (this.effectState.target.activeTurns) return;

			if (target === source || move.hasBounced || !move.flags['reflectable'] || target.isSemiInvulnerable()) {
				return;
			}
			const newMove = this.dex.getActiveMove(move.id);
			newMove.hasBounced = true;
			newMove.pranksterBoosted = false;
			this.actions.useMove(newMove, target, { target: source });
			return null;
		},
		onAllyTryHitSide(target, source, move) {
			if (this.effectState.target.activeTurns) return;

			if (target.isAlly(source) || move.hasBounced || !move.flags['reflectable'] || target.isSemiInvulnerable()) {
				return;
			}
			const newMove = this.dex.getActiveMove(move.id);
			newMove.hasBounced = true;
			newMove.pranksterBoosted = false;
			this.actions.useMove(newMove, this.effectState.target, { target: source });
			move.hasBounced = true; // only bounce once in free-for-all battles
			return null;
		},
		flags: { breakable: 1 },
		name: "Rebound",
		rating: 3,
		num: -2,
	},
	persistent: {
		isNonstandard: "CAP",
		// implemented in the corresponding move
		flags: {},
		name: "Persistent",
		rating: 3,
		num: -3,
	},
	// A Golden Experience
	poisonousradula: {
		onSourceHit(target, source, move) {
			if (!move || !target) return;
			if (target !== source && move.category !== 'Status' && move.type === 'Poison' && !(target.getMoveHitData(move).typeMod < 0)) {
				if (!move.secondaries) move.secondaries = [];
				if (move.category === 'Physical') {
					move.secondaries.push({
						chance: 100,
						boosts: {
							def: -1,	
						},
						ability: this.dex.abilities.get('poisonousradula'),
					});
				} else if (move.category === 'Special') {
					move.secondaries.push({
						chance: 100,
						boosts: {
							spd: -1,
						},
						ability: this.dex.abilities.get('poisonousradula'),

					});
				}
			}
		},
		name: "Poisonous Radula",
		shortDesc: "Non resisted Poison moves lowers the target's corresponding defense by one stage.",
		rating: 2,
		num: -1,
	},
	daredevil: {
		onDamage(damage, target, source, effect) {
			if (effect.id === 'recoil') {
				if (!this.activeMove) throw new Error("Battle.activeMove is null");
				if (this.activeMove.id !== 'struggle') return null;
			}
		},
		name: "Daredevil",
		shortDesc: "This Pokemon does not take recoil damage besides Struggle/Life Orb/crash damage.",
		rating: 3,
		num: -2,
	},
	waterproof: {
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Water') {
				if (!this.boost({ spe: 1 })) {
					this.add('-immune', target, '[from] ability: Waterproof');
				}
				return null;
			}
		},
		name: "Waterproof",
		desc: "This Pokemon is immune to Water-type moves and raises its Speed by 1 stage when hit by an Water-type move.",
		shortDesc: "This Pokemon's Speed is raised 1 stage if hit by an Water move; Water immunity.",
		rating: 3,
		num: -3,
	},
	racketeering: {
		shortDesc: "Boosts the power of Knock Off, Thief and Pluck by 1.5x",
		onBasePowerPriority: 8,
		onBasePower(basePower, attacker, defender, move) {
			if (move.name === 'Knock Off' || move.name === 'Thief' || move.name === 'Pluck') {
				return this.chainModify(1.5);
			}
		},
		name: "Racketeering",
		rating: 3,
		num: -4,
	},
	snobbery: {
		onSourceModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Poison' || move.type === 'Bug' || move.type === 'Dark') {
				this.debug('Snobbery weaken');
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Poison' || move.type === 'Bug' || move.type === 'Dark') {
				this.debug('Snobbery weaken');
				return this.chainModify(0.5);
			}
		},
		name: "Snobbery",
		shortDesc: "This Pokemon gets half damages from Bug, Poison and Dark type moves.",
		rating: 3.5,
		num: -5,
	},
	starsforce: {
		desc: "When this Pokémon has 1/3 or less of its maximum HP, rounded down, all of its stats are x1.5.",
		shortDesc: "At 1/3 or less of max HP, all stats are x1.5.",
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (attacker.hp <= attacker.maxhp / 3) {
				this.debug('Stars Force boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (attacker.hp <= attacker.maxhp / 3) {
				this.debug('Stars Force boost');
				return this.chainModify(1.5);
			}
		},
		onModifyDefPriority: 6,
		onModifyDef(def, pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 3) {
				this.debug('Stars Force boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpDPriority: 6,
		onModifySpD(spd, pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 3) {
				this.debug('Stars Force boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpePriority: 6,
		onModifySpe(def, pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 3) {
				this.debug('Stars Force boost');
				return this.chainModify(1.5);
			}
		},
		name: "Star's Force",
		rating: 2,
		num: -6,
	},
	webweaver: {
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual(pokemon) {
			let activated = false;
			if (pokemon.activeTurns) {
				for (const target of pokemon.side.foe.active) {
					if (!target || !target.isAdjacent(pokemon) || !(target.isGrounded())) continue;
					if (!activated) {
						this.add('-ability', pokemon, 'Web Weaver', 'boost');
						activated = true;
					}
					if (target.volatiles['substitute']) {
						this.add('-immune', target);
					} else {
						//if (pokemon.isGrounded()){
						this.boost({ spe: -1 }, target, pokemon, null, true);
						//}
					}
				}
			}
		},
		name: "Web Weaver",
      shortDesc: "A the end of each turn, lowers by one stage the speed stat of every other grounded Pokemon.",
		rating: 4.5,
		num: -7,
	},
	perforating: {
		onModifyMovePriority: -5,
		onModifyMove(move) {
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity['Poison'] = true;
			}
		},
		onModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).typeMod < 0 && (move.type === 'Bug' || move.type === 'Poison')) {
				this.debug('Perforating boost');
				return this.chainModify(2);
			}
		},
		name: "Perforating",
		shortDesc: "Bug & Poison moves deal 2x damage if resisted, can poison Steel types, Poison moves hit Steel types",
		rating: 3,
		num: -8,
	},
	doublespirit: {
		shortDesc: "Switches to Nocturnal form before using a Physical move, and to Diurnal form before using a Special move.",
		onBeforeMovePriority: 0.5,
		onBeforeMove(attacker, defender, move) {
			if (attacker.species.baseSpecies !== 'Girafatak' || attacker.transformed) return;
			if (move.category === 'Status') return;
			const targetForme = (move.category === 'Special' ? 'Girafatak' : 'Girafatak-Nocturnal');
			if (attacker.species.name !== targetForme) attacker.formeChange(targetForme);
			const newatk = attacker.storedStats.spa;
			const newspa = attacker.storedStats.atk;
			attacker.storedStats.atk = newatk;
			attacker.storedStats.spa = newspa;
		},
		flags: {failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1},
		name: "Double Spirit",
		rating: 4,
		num: -9,
	},
	divination: {
		shortDesc: "Reveals a random move of each adjacent opponent on entry.",
		onStart(pokemon) {
			for (const target of pokemon.side.foe.active) {
				if (target.fainted) return;
				const temp = this.sample(target.moveSlots);
				this.add('-message', pokemon.name + "'s Divination revealed the move " + temp.move + "!");
			}
		},
		name: "Divination",
		rating: 3,
		num: -10,
	},
	arcanemastery: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Psychic' || move.type === 'Dark') {
				this.debug('Arcane Mastery boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Psychic' || move.type === 'Dark') {
				this.debug('Arcane Mastery boost');
				return this.chainModify(1.5);
			}
		},
		name: "Arcane Mastery",
		shortDesc: "This Pokemon's attacking stat is multiplied by 1.5 while using a Psychic/Dark type attack.",
		rating: 3.5,
		num: -11,
	},
	strangebody: {
		onEffectiveness(typeMod, target, type, move) {
			if (!target || move.category !== 'Physical') return;
			if (!target.runImmunity(move.type)) return;
			if (this.dex.getEffectiveness(move, target) === -1) return;
			return 0;
		},
		name: "Strange Body",
		rating: 4,
		shortDesc: "If this Pokemon is hit by a physical super effective move, it takes neutral damage.",
		num: -12,
	},
	mistymountain: { 
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.type === 'Rock' && !noModifyType.includes(move.id) &&
				!(move.isZ && move.category !== 'Status') && !(move.name === 'Tera Blast' && pokemon.terastallized)) {
				move.type = 'Ice';
				move.typeChangerBoosted = this.effect;
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (move.typeChangerBoosted === this.effect) return this.chainModify([4915, 4096]);
		},
		name: "Misty Mountain",
		shortDesc: "This Pokemon's Rock-type moves become Ice-type and have 1.2x power.",
		rating: 4,
		num: -13,
	},
	toymaker: {
		name: "Toymaker",
		desc: "At the end of each turn, if it doesn't have an held item, the user acquires a random item. (Leftovers, Sitrus Berry, Lum Berry, Figy Berry, Starf Berry, Choice Band, Choice Specs, Choice Scarf, Flame Orb, Para Orb, Toxic Orb, Light Ball, Iron Ball, Rocky Helmet, Heavy-Duty Boots)",
		shortDesc: "Gets a random item from a list at the end of the turn if the user doesn't already have one.",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual(pokemon) {
			const itemList = ['leftovers', 'sitrusberry', 'lumberry', 'figyberry', 'starfberry', 'choiceband', 'choicespecs', 'choicescarf', 'flameorb', 'paraorb', 'toxicorb', 'lightball', 'ironball', 'rockyhelmet', 'heavydutyboots'];
			const itemIndex = this.random(itemList.length);
			const itemMade = itemList[itemIndex];
			if (pokemon.hp && !pokemon.item) {
				pokemon.setItem(itemMade);
				this.add('-item', pokemon, pokemon.getItem(), '[from] ability: Toymaker');
			}
		},
		rating: 3,
		num: -14,
	},
	woodclearing: {
		onBasePowerPriority: 21,
		onBasePower(basePower, attacker, defender, move) {
			if (this.field.isTerrain('grassyterrain')) {
				this.debug('Wood Clearing boost');
				return this.chainModify([0x14CD, 0x1000]);
			}
		},
		onEffectiveness(typeMod, target, type, move) {
			if (type === 'Grass') return 1;
		},
		name: "Wood Clearing",
		shortDesc: "This Pokemon's attacks do 1.3x in Grassy Terrain. Always hits Grass targets for super effective.",
		rating: 2,
		num: -15,
	},
	rickroll: {
		desc: "This Pokémon does not suffer the drawbacks of recoil moves and sacrificial moves.All self-KO moves used by this Pokémon have x0.8 base power.",
		shortDesc: "Ignores recoil and self-KO effects of its moves. Self-KO moves have x0.8 BP.",
		onModifyMove(move) {
			if (move.recoil || move.mindBlownRecoil || (move.selfdestruct && move.selfdestruct === 'always')) {
				if (move.selfdestruct && move.selfdestruct === 'always') {
					move.flags.explosive = true;
					delete move.selfdestruct;
				}
				if (move.recoil) {
					delete move.recoil;
				}
				if (move.mindBlownRecoil) {
					move.mindBlownRecoil = false;
				}
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (move.flags['explosive'] && move.category !== 'Status') return this.chainModify(0.8);
		},
		name: "Rick Roll",
		rating: 4,
		num: -16,
	},
	microclimate: {
		onStart(pokemon) {
			if (this.field.isWeather('sunnyday')) {
			   this.field.setWeather('raindance');
			} else if (this.field.isWeather('raindance')) {
				this.field.setWeather('sunnyday');
			} else if (this.field.isWeather('desolateland')) {
				this.field.setWeather('primordialsea');
			} else if (this.field.isWeather('primodialsea')) {
				this.field.setWeather('desolateland');
			} else if (this.field.isWeather(['hail', 'snow', 'everlastingwinter']) || this.field.isWeather('sand')) {
				this.field.clearWeather();
			}
		},
		onEnd(pokemon) {
			if (this.field.isWeather('raindance')) {
			   this.field.setWeather('sunnyday');
			} else if (this.field.isWeather('sunnyday')) {
				this.field.setWeather('raindance');
			} else if (this.field.isWeather('primordialsea')) {
				this.field.setWeather('desolateland');
			} else if (this.field.isWeather('desolateland')) {
				this.field.setWeather('primordialsea');
			}
		},
		shortDesc: "Reverses effects of Sun and Rain; negates Sand and Hail.",
		name: "Microclimate",
		rating: 2,
		num: -17,
	},
	voidheart: {
		desc: "When it KOs an opponent with a direct move, it recovers 25% of its max HP.",
		shortDesc: "Heals 25% HP on KO.",
		onSourceAfterFaint(length, target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				this.heal(source.baseMaxhp / 4);
			}
		},
		name: "Void-Heart",
		rating: 3,
		num: -18,
	},
	convectioncurrent: {
		desc: "If Gravity is active, this Pokemon's Speed is doubled.",
		shortDesc: "Speed x2 on Gravity.",
		onModifySpe(spe, pokemon) {
			if (this.field.getPseudoWeather('gravity')) {
				return this.chainModify(2);
			}
		},
		name: "Convection Current",
		rating: 3,
		num: -19,
	},
	endlessdream: {
		desc: "While this Pokemon is active, every other Pokemon is treated as if it has the Comatose ability. Pokemon that are either affected by Sweet Veil, or have Insomnia or Vital Spirit as their abilities are immune this effect.",
		shortDesc: "All Pokemon are under Comatose effect.",
		onStart(source) {
			this.add('-ability', source, 'Endless Dream');
			this.field.addPseudoWeather('endlessdream');
			this.hint("All Pokemon are under Comatose effect!");
		},
		onResidualOrder: 21,
		onResidualSubOrder: 2,
		onEnd(pokemon) {
			this.field.removePseudoWeather('endlessdream');
		},
		name: "Endless Dream",
		rating: 3,
		num: -20,
	},
	evaporate: {
		desc: "If the Pokemon or the opponent uses a Water type move, it triggers the Haze effect. Immune to Water.",
		shortDesc: "Haze when any Pokemon uses a Water move; Water immunity.",
		onSourceHit(target, source, move) {
			if (!move || !target) return;
			if (move.type === 'Water') {
				for (const pokemon of this.getAllActive()) {
					pokemon.clearBoosts();
				   return null;
				}
			}
		},
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Water') {
				this.add('-immune', target, '[from] ability: Evaporate');
				for (const pokemon of this.getAllActive()) {
					pokemon.clearBoosts();
				   return null;
				}
			}
		},
		name: "Evaporate",
		rating: 4,
		num: -21,
	},
	desertsong: {
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			if (move.flags['sound'] && !pokemon.volatiles['dynamax']) { // hardcode
				move.type = 'Ground';
			}
		},
		name: "Desert Song",
		desc: "This Pokemon's sound-based moves become Ground-type moves. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's sound-based moves become Ground type.",
		rating: 1.5,
		num: -22,
	},
	sundownswitch: {
		name: "Sundown Switch",
		desc: "If Cacturne-Mega: Changes to Day form before using Grass move; to Night before using Dark move.",
		num: -23,
		onBeforeMovePriority: 0.5,
		onBeforeMove(attacker, defender, move) {
			if (attacker.species.baseSpecies !== 'Cacturne' || attacker.transformed) return;
			if (move.type !== 'Grass' && move.type !== 'Dark') return;
			const targetForme = (move.type === 'Grass' ? 'Cacturne-Mega' : 'Cacturne-Mega-Night');
			if (attacker.species.name !== targetForme) attacker.formeChange(targetForme);
			this.add('-start', attacker, 'typechange', attacker.getTypes(true).join('/'), '[silent]');
		},
		flags: {failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1},
	},
	coldvengeance: {
		desc: "When replacing a fainted party member, its next move has x1.5 BP.",
		shortDesc: "Its first move has x1.5 BP when replacing a fainted ally.",
		onAfterMega(pokemon) {
			if (!pokemon.side.faintedLastTurn) return;
			pokemon.addVolatile('coldvengeance');
		},
		onStart(pokemon) {
			if (!pokemon.side.faintedThisTurn) return;
			pokemon.addVolatile('coldvengeance');
		},
		onModifyDamage(damage, source, target, move) {
			if (source.volatiles['coldvengeance']) {
				return this.chainModify(1.5);
			}
		},
		name: "Cold Vengeance",
		rating: 3,
		num: -24,
	},
	blindrage: {
		onDamagingHit(damage, target, source, move) {
			if (!move.damage && !move.damageCallback && target.getMoveHitData(move).typeMod > 0) {
				this.boost({ atk: 1 });
			}
		},
		name: "Blind Rage",
		shortDesc: "This Pokemon's Atk is raised by 1 when hit by a super effective attack.",
		rating: 3.5,
		num: -25,
	},
	hardrock: {
		onModifyAtkPriority: 6,
		onModifyAtk(pokemon) {
			return this.chainModify(1.5);
		},
		onModifyDefPriority: 6,
		onModifyDef(pokemon) {
			return this.chainModify(2);
		},
		onModifySpDPriority: 6,
		onModifySpD(pokemon) {
			return this.chainModify(0.5);
		},
		name: "Hard Rock",
		shortDesc: "This Pokemon's Atk is boosted by 1.5 and Def by 2, but its SpD is halved.",
		rating: 1.5,
		num: -26,
	},
	forgery: {
		desc: "This Pokémon inherits the item of the last unfainted Pokemon in its party.",
		shortDesc: "Inherits the item of the last party member.",
		onStart(pokemon) {
			if (pokemon.species.name !== 'Zoroark-Mega') return;
			pokemon.addVolatile('forgery');
			let i;
			for (i = pokemon.side.pokemon.length - 1; i > pokemon.position; i--) {
				if (
					!pokemon.side.pokemon[i] || pokemon.side.pokemon[i].fainted ||
					!pokemon.side.pokemon[i].item || this.dex.items.get(pokemon.side.pokemon[i].item).zMove ||
					 this.dex.items.get(pokemon.side.pokemon[i].item).megaStone
				) continue;
				break;
			}
			if (!pokemon.side.pokemon[i]) return;
			if (pokemon === pokemon.side.pokemon[i]) return;
			const forgery = pokemon.side.pokemon[i];
			this.add('-ability', pokemon, 'Forgery');
			pokemon.item = forgery.item;
			this.add('-message', `${pokemon.name}'s Zoroarkite became a replica of the ${this.dex.items.get(forgery.item).name} belonging to ${forgery.name}!`);
		},
		onUpdate(pokemon) {
			if (pokemon.species.name !== 'Zoroark-Mega') return;
			if (!pokemon.item) {
				this.add('-ability', pokemon, 'Forgery');
				this.add('-message', `${pokemon.name}'s Zoroarkite returned to normal!`);
				pokemon.item = 'zoroarkite' as ID;
			}
		},
		onEnd(pokemon) {
			if (pokemon.species.name !== 'Zoroark-Mega') return;
			if (pokemon.item !== 'zoroarkite') {
				this.add('-ability', pokemon, 'Forgery');
				this.add('-message', `${pokemon.name}'s Zoroarkite returned to normal!`);
				pokemon.item = 'zoroarkite' as ID;
			}
		},
		flags: {failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1},
		name: "Forgery",
		rating: 3,
		num: -27,
	},
	clairvoyance: {
		desc: "This Pokémon's Psychic-type moves take effect two turns after being used. At the end of that turn, the damage is calculated at that time and dealt to the Pokémon at the position the target had when the move was used. Only one move can be delayed at a time. If the user is no longer active at the time an attacking move should hit, damage is calculated based on the user's natural Attack or Special Attack stat, types, and level, with no boosts from its held item or Ability. Status moves are used by the Pokémon at the position the user had when the move was used.",
		shortDesc: "Psychic-type moves delayed until two turns later, but only one at a time.",
		onBeforeMove(source, target, move) {
			if (
				move && move.type === 'Psychic' && source.hasAbility('clairvoyance') &&
				source.side.addSlotCondition(source, 'clairvoyance')
			) {
				Object.assign(source.side.slotConditions[source.position]['clairvoyance'], {
					duration: 3,
					source: source,
					target: null,
					move: move,
					position: target.position,
					side: target.side,
					moveData: this.dex.moves.get(move),
				});
				this.add('-ability', source, 'Clairvoyance');
				this.add('-message', `${source.name} cast ${move.name} into the future!`);
				source.deductPP(move.id, 1);
				return null;
			}
		},
		condition: {
			duration: 3,
			onResidualOrder: 3,
			onEnd(target) {
				this.effectState.target = this.effectState.side.active[this.effectState.position];
				const data = this.effectState;
				const move = this.dex.moves.get(data.move);
				this.add('-ability', this.effectState.source, 'Clairvoyance');
				if (!data.target) {
					this.hint(`${move.name} did not hit because there was no target.`);
					return;
				}

				this.add('-message', `${this.effectState.source.name}'s ${move.name} took effect!`);
				data.target.removeVolatile('Endure');

				if (data.source.hasAbility('infiltrator') && this.gen >= 6) {
					data.moveData.infiltrates = true;
				}
				if (data.source.hasAbility('normalize') && this.gen >= 6) {
					data.moveData.type = 'Normal';
				}
				if (data.source.hasAbility('adaptability') && this.gen >= 6) {
					data.moveData.stab = 2;
				}
				data.moveData.isFutureMove = true;
				delete data.moveData.flags['contact'];
				delete data.moveData.flags['protect'];

				if (move.category === 'Status') {
					this.actions.useMove(move, target, data.target);
				} else {
					const hitMove = new this.dex.Move(data.moveData) as ActiveMove;
					if (data.source.isActive) {
						this.add('-anim', data.source, hitMove, data.target);
					}
					this.actions.trySpreadMoveHit([data.target], data.source, hitMove);
				}
			},
		},
		name: "Clairvoyance",
		rating: 3,
		num: -28,
	},
	longtail: {
		shortDesc: "Gives a +1 priority to tail and whip moves.",
		onModifyPriority(priority, pokemon, target, move) {
			if (tailMoves.includes(move.id)) return priority + 1;
		},
		name: "Long Tail",
		num: -29,
	},
	boarding: {
		onBasePower(basePower, pokemon, target) {
			if (target.volatiles['trapped']) {
				return this.chainModify(1.25);
			}
		},
		name: "Boarding",
		shortDesc: "This Pokemon deals 1.25x damage to trapped opponents.",
		rating: 3,
		num: -30,
	},
	lasttoxin: {
		desc: "When this Pokemon brings an opponent to 50% or under using an attacking move, it badly poisons that opponent.",
		shortDesc: "Badly poison enemies brought under half health..",
		onAfterMove(source, target, move) {
			if (!source || source === target || !target.hp || !move.totalDamage) return;
			const lastAttackedBy = target.getLastAttackedBy();
			if (!lastAttackedBy) return;
			const damage = move.multihit ? move.totalDamage : lastAttackedBy.damage;
			if (target.hp <= target.maxhp / 2 && target.hp + damage > target.maxhp / 2) {
				target.setStatus('tox');
			}
		},
		name: "Last Toxin",
		rating: 4,
		num: -31,
	},
	chakrasurge: {
		onStart(source) {
			this.field.setTerrain('chakraterrain');
		},
		name: "Chakra Surge",
		shortDesc: "On switch-in, sets Chakra Terrain.",
		rating: 4,
		num: -32,
	},
	striker: {
		shortDesc: "Boosts the power of kicking moves by 1.3x",
		onBasePowerPriority: 8,
		onBasePower(basePower, attacker, defender, move) {
			if (kickMoves.includes(move.id)) {
				return this.chainModify(1.3);
			}
		},
		name: "Striker",
		num: -33,
	},
	deadlyblasts: {
		onBasePowerPriority: 8,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['bullet']) {
				return this.chainModify(1.3);
			}
		},
		name: "Deadly Blasts",
		shortDesc: "Boosts the power of bullet, bomb and ball moves by 1.3x",
		rating: 2.5,
		num: -34,
	},
	insectivorous: {
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Bug') {
				if (!this.heal(target.baseMaxhp / 4)) {
					this.add('-immune', target, '[from] ability: Insectivorous');
				}
				return null;
			}
		},
		name: "Insectivorous",
		shortDesc: "This Pokemon heals 1/4 HP when hit by a Bug type move. Immune to Bug type moves.",
		rating: 3.5,
		num: -35,
	},
	cosmicenergy: {
		desc: "This Pokemon's attacks do not have to charge or recharge, and can always be used twice in a row.",
		shortDesc: "Skip charging and recharging turns of moves.",
		onModifyMove(move) {
			delete move.flags['charge', 'recharge', 'cantusetwice'];
		},
		onChargeMove(pokemon, target, move) {
			this.debug('Cosmic Energy - remove charge turn for ' + move.id);
			this.attrLastMove('[still]');
			this.addMove('-anim', pokemon, move.name, target);
			return false; 
		},
		onUpdate(pokemon) {
			if (pokemon.volatiles['mustrecharge']) {
				pokemon.removeVolatile('mustrecharge');
			}
		},
		name: "Cosmic Energy",
		rating: 2,
		num: -36,
	},
	ignite: {
		desc: "This Pokémon's Normal-type moves become Fire-type moves and have their power multiplied by 1.2. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokémon's Normal-type moves become Fire-type and have 1.2x power.",
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.type === 'Normal' && !noModifyType.includes(move.id) && !(move.isZ && move.category !== 'Status')) {
				move.type = 'Fire';
				(move as any).igniteBoosted = true;
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if ((move as any).igniteBoosted) return this.chainModify([0x1333, 0x1000]);
		},
		name: "Ignite",
		rating: 4,
		num: -37,
	},
	nightlight: {
		desc: "This Pokemon takes halves damages against Ghost-type and Dark-type moves.",
		shortDesc: "This Pokemon takes halves damages against Ghost-type and Dark-type moves.",
		onSourceModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Ghost' || move.type === 'Dark') {
				this.debug('Night Light weaken');
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Ghost' || move.type === 'Dark') {
				this.debug('Night Light weaken');
				return this.chainModify(0.5);
			}
		},
		name: "Night Light",
		rating: 3.5,
		num: -38,
	},
	parasitism: {
		name: "Parasitism",
		desc: "When this Pokemon is KO, inflicts Yawn and Leech Seed to the opponent.",
		shortDesc: "Inflicts Yawn and Leech Seed on KO.",
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) {
			if (!target.hp) {
				if (!source.status && source.runStatusImmunity('slp')) {
					source.addVolatile('yawn');
				}
				if (!(source.hasType('Grass'))) {
					source.addVolatile('leechseed', source);
				}
			}
		},
		rating: 2.5,
		num: -39,
	},
	explosive: {
		desc: "This Pokémon does not suffer the drawbacks of recoil moves and sacrificial moves.All self-KO moves used by this Pokémon have x0.8 base power.",
		shortDesc: "Ignores recoil and self-KO effects of its moves. Self-KO moves have x0.8 BP.",
		onModifyMove(move) {
			if (move.recoil || move.mindBlownRecoil || (move.selfdestruct && move.selfdestruct === 'always')) {
				if (move.selfdestruct && move.selfdestruct === 'always') {
					move.flags.explosive = true;
					delete move.selfdestruct;
				}
				if (move.recoil) {
					delete move.recoil;
				}
				if (move.mindBlownRecoil) {
					move.mindBlownRecoil = false;
				}
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (move.flags['explosive'] && move.category !== 'Status') return this.chainModify(0.8);
		},
		name: "Explosive",
		rating: 4,
		num: -40,
	},
	accumulate: {
		desc: "At the end of each turn, this Pokemon gets 1 Stockpile.",
		shortDesc: "Stockpiles at the end of each turn.",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual(pokemon) {
			if (pokemon.activeTurns) {
				pokemon.addVolatile('stockpile');
			}
		},
		name: "Accumulate",
		rating: 4.5,
		num: -41,
	},
	angelicnature: {
		onModifyMove(move) {
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity['Dark'] = true;
			}
		},
		onEffectiveness(typeMod, target, type, move) {
			if (move.type !== 'Dark') return;
			if (move.type === 'Dark' && target.hasType('Fairy')) {
				this.debug('Angelic Nature boost');
				return 1;
			}
		},
		name: "Angelic Nature",
		desc: "This Pokemon can hit Fairy type opponents for super effective damages with Dark moves.",
		shortDesc: "Hits Fairy opponents for super effective damages with Dark moves.",
		rating: 3.5,
		num: -42,
	},
	blowhole: {
		desc: "Before this Pokemon uses any Water-type move, it sets Rain Dance.",
		shortDesc: "Sets Rain Dance before using a Water-type move.",
		onSourceHit(target, source, move) {
			if (!move || !target) return;
			if (move.type === 'Water' && this.field.getWeather().id !== 'raindance') {
				this.field.setWeather('raindance');
			}
		},
		name: "Blowhole",
		rating: 3,
		num: -43,
	},
	northwind: {
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual(pokemon) {
			let activated = false;
			if (pokemon.activeTurns) {
				for (const target of pokemon.side.foe.active) {
					if (!target || !target.isAdjacent(pokemon) || target.hasType('Ice')) continue;
					if (!activated) {
						this.add('-ability', pokemon, 'Web Weaver', 'boost');
						activated = true;
					}
					if (target.volatiles['substitute']) {
						this.add('-immune', target);
					} else {
						this.boost({ spe: -1 }, target, pokemon, null, true);
					}
				}
			}
		},
		name: "North Wind",
		shortDesc: "At the end of each turn, lowers all of the Pokemons' Speed by one stage.",
		rating: 4.5,
		num: -44,
	},
	everlastingwinter: {
		desc: "On switch-in, the weather becomes Snow Hail. This weather remains in effect until this Ability is no longer active for any Pokémon, or the weather is changed by Delta Stream, Desolate Land or Primordial Sea. Super effective moves only inflict 3/4 damages on this Pokemon.",
		shortDesc: "On switch-in, snow hail begins until this Ability is not active in battle. Filter effect.",
		onStart(source) {
			this.field.setWeather('everlastingwinter');
			this.add('-ability', source, 'Everlasting Winter');
			this.add('-message', `${source.name} created an unrelenting winter storm!`);
			this.hint("Everlasting Winter doesn't wear off until the user leaves the field!");
		},
		onAnySetWeather(target, source, weather) {
			const strongWeathers = ['desolateland', 'primordialsea', 'deltastream', 'everlastingwinter'];
			if (this.field.getWeather().id === 'everlastingwinter' && !strongWeathers.includes(weather.id)) return false;
		},
		onEnd(pokemon) {
			if (this.field.weatherState.source !== pokemon) return;
			for (const target of this.getAllActive()) {
				if (target === pokemon) continue;
				if (target.hasAbility('everlastingwinter')) {
					this.field.weatherState.source = target;
					return;
				}
			}
			this.field.clearWeather();
		},
		name: "Everlasting Winter",
		rating: 4.5,
		num: -45,
	},
	spikybody: {
		onDamagingHit(damage, target, source, move) {
			const side = source.isAlly(target) ? source.side.foe : source.side;
			const spikes = side.sideConditions['spikes'];
			if (move.category === 'Physical' && (!spikes || spikes.layers < 3)) {
				this.add('-activate', target, 'ability: Spiky Body');
				side.addSideCondition('spikes', target);
			}
		},
		name: "Spiky Body",
		shortDesc: "If this Pokemon is hit by a physical attack, Spikes are set on the opposing side.",
		rating: 2.5,
		num: -46,
	},
	disillusioned: {
		desc: "This Pokemon is immune to Fairy type moves, and can hit Fairy type opponents for neutral damages with Dark moves.",
		shortDesc: "Hits Fairy opponents for neutral damages with Dark moves; Fairy immune.",
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Fairy') {
				this.add('-immune', target, '[from] ability: Disillusioned');
				return null;
			}
		},
		onModifyMove(move) {

			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity['Dark'] = true;
			}
		},
		onModifyDamage(damage, source, target, move) {
			if (move.type !== 'Dark') return;
			if (move.type === 'Dark' && target.hasType('Fairy')) {
				this.debug('Disillusioned boost');
				return this.chainModify(2);
			}
		},
		name: "Disillusioned",
		rating: 3.5,
		num: -47,
	},
	leafdress: {
		onSourceModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (defender.hasType('Grass') && (move.type === 'Ice' || move.type === 'Fire' || move.type === 'Poison' || move.type === 'Flying' || move.type === 'Bug')) {
				this.debug('Leaf Dress weaken');
				return this.chainModify(0.5);
			}
			else if (!defender.hasType('Grass') && (move.type === 'Grass' || move.type === 'Water' || move.type === 'Electric' || move.type === 'Ground')) {
				this.debug('Leaf Dress weaken');
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (defender.hasType('Grass') && (move.type === 'Ice' || move.type === 'Fire' || move.type === 'Poison' || move.type === 'Flying' || move.type === 'Bug')) {
				this.debug('Leaf Dress weaken');
				return this.chainModify(0.5);
			}
			else if (!defender.hasType('Grass') && (move.type === 'Grass' || move.type === 'Water' || move.type === 'Electric' || move.type === 'Ground')) {
				this.debug('Leaf Dress weaken');
				return this.chainModify(0.5);
			}
		},
		onDamage(damage, target, source, effect) {
			if (target.hasType('Grass') && effect && (effect.id === 'stealthrock' || effect.id === 'spikes' || effect.id === 'toxicspikes' || effect.id === 'stickyweb' || effect.id === 'gmaxsteelsurge')) {
				return false;
			}
		},
		onSetStatus(status, target, source, effect) {
			if (target.hasType('Grass')) {
				if ((effect as Move)?.status) {
					this.add('-immune', target, '[from] ability: Leaf Dress');
				}
				return false;
			}
		},
		onTryAddVolatile(status, target) {
			if (status.id === 'yawn' && target.hasType('Grass')) {
				this.add('-immune', target, '[from] ability: Leaf Dress');
				return null;
			}
		},
		name: "Leaf Dress",
		shortDesc: "If not Grass: gives Grass resists; if Grass: negates Grass weaknesses, status and hazard damage.",
		rating: 3.5,
		num: -48,
	},
	invincible: {
		onModifyMovePriority: -5,
		onSetStatus(status, target, source, effect) {
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Invincible');
			}
			return false;
		},
		onTryAddVolatile(status, target) {
			if (status.id === 'yawn') {
				this.add('-immune', target, '[from] ability: Invincible');
				return null;
			}
		},
		onTryBoost(boost, target, source, effect) {
			if (effect.name === 'Intimidate' && boost.atk) {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Invincible', '[of] ' + target);
			}
		},
		name: "Invincible",
		shortDesc: "This Pokemon is immune to status condition. Immune to Intimidate.",
		rating: 3,
		num: -49,
	},
	sonar: {
		shortDesc: "Reveals a random move of each adjacent opponent when this Pokemon hits them with a Sound move.",
		onSourceHit(target, source, move){
			if (move.flags['sound']) {
				for (const targ of source.side.foe.active) {
					if (targ.fainted) return;
					const temp = this.sample(targ.moveSlots);
					this.add('-message', target.name + "'s Sonar revealed the move " + temp.move + "!");
				}
			}
		},
		name: "Sonar",
		rating: 3,
		num: -50,
	},
	unstableshell: {
		shortDesc: "If a pokemon makes contact to this pokemon, this Pokemon loses 25% max HP and returns doubles of lost HP.",
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) {
			if (move.flags['contact']) {
				this.damage(Math.round(target.maxhp / 4), target, target);
				this.damage(Math.round(target.maxhp / 2), source, target);
			}
		},
		name: "Unstable Shell",
		rating: 2.5,
		num: -51,
	},
	sleightofhand: {
		desc: "This Pokémon's contact moves become special attacks and do not make contact with the target.",
		shortDesc: "This Pokémon's contact moves become special and non-contact.",
		onModifyMove(move) {
			if (move.flags['contact']) {
				if (move.category !== 'Special') move.category = 'Special';
				delete move.flags['contact'];
			}
		},
		name: "Sleight of Hand",
		rating: 3,
		num: -52,
	},
	newtonslaw: {
		onModifySpe(spe, pokemon) {
			if (this.field.getPseudoWeather('gravity')) {
				return this.chainModify(2);
			}
		},
		name: "Newton's Law",
		shortDesc: "On Gravity, this Pokemon's Speed is doubled.",
		rating: 3,
		num: -53,
	},
	hyperthermia: {
		onSourceHit(target, source, move) {
			if (move.category !== 'Status') {
				if (source.volatiles['warming']) {
					delete source.volatiles['warming'];
					source.addVolatile('warm');
				}
				else {
					source.addVolatile('warming');
				}
			}
		},
		onAfterMove(pokemon) {
			if (pokemon.volatiles['warm']) {
				pokemon.clearBoosts();
				this.add('-clearboost', pokemon);
				delete pokemon.volatiles['warm'];
			}
		},
		name: "Hyperthermia",
		desc: "After this Pokemon used 2 offensive moves, all of its stat changes are reseted.",
		shortDesc: "Resets all stat changes after 2 offensive moves.",
		rating: 1,
		num: -54,
	},
	mentalfortitude: {
		onUpdate(pokemon) {
			if (pokemon.volatiles['attract']) {
				this.add('-activate', pokemon, 'ability: Mental Fortitude');
				pokemon.removeVolatile('attract');
				this.add('-end', pokemon, 'move: Attract', '[from] ability: Mental Fortitude');
			}
			if (pokemon.volatiles['taunt']) {
				this.add('-activate', pokemon, 'ability: Mental Fortitude');
				pokemon.removeVolatile('taunt');
			}
			if (pokemon.volatiles['encore']) {
				this.add('-activate', pokemon, 'ability: Mental Fortitude');
				pokemon.removeVolatile('encore');
			}
			if (pokemon.volatiles['torment']) {
				this.add('-activate', pokemon, 'ability: Mental Fortitude');
				pokemon.removeVolatile('torment');
			}
			if (pokemon.volatiles['disable']) {
				this.add('-activate', pokemon, 'ability: Mental Fortitude');
				pokemon.removeVolatile('disable');
			}
			if (pokemon.volatiles['healblock']) {
				this.add('-activate', pokemon, 'ability: Mental Fortitude');
				pokemon.removeVolatile('healblock');
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'attract') return false;
		},
		onTryHit(pokemon, target, move) {
			if (move.id === 'attract' || move.id === 'captivate' || move.id === 'taunt') {
				this.add('-immune', pokemon, '[from] ability: Oblivious');
				return null;
			}
		},
		name: "Mental Fortitude",
		shortDesc: "This Pokemon is immune to Attract, Disable, Encore, Heal Block, Taunt, Torment.",
		rating: 1.5,
		num: -55,
	},
	unconcerned: {
		name: "Unconcerned",
		onTryBoost(boost, target, source, effect) {
			if (boost.atk) {
				delete boost.atk;
				if (!(effect as ActiveMove).secondaries) {
					this.add("-fail", target, "unboost", "Attack", "[from] ability: Unconcerned", "[of] " + target);
				}
			}
			if (boost.def) {
				delete boost.def;
				if (!(effect as ActiveMove).secondaries) {
					this.add("-fail", target, "unboost", "Defense", "[from] ability: Unconcerned", "[of] " + target);
				}
			}
			if (boost.spa) {
				delete boost.spa;
				if (!(effect as ActiveMove).secondaries) {
					this.add("-fail", target, "unboost", "Special Attack", "[from] ability: Unconcerned", "[of] " + target);
				}
			}
			if (boost.spd) {
				delete boost.spd;
				if (!(effect as ActiveMove).secondaries) {
					this.add("-fail", target, "unboost", "Special Defense", "[from] ability: Unconcerned", "[of] " + target);
				}
			}
			if (boost.accuracy) {
				delete boost.accuracy;
				if (!(effect as ActiveMove).secondaries) {
					this.add("-fail", target, "unboost", "Accuracy", "[from] ability: Unconcerned", "[of] " + target);
				}
			}
			if (boost.evasion) {
				delete boost.evasion;
				if (!(effect as ActiveMove).secondaries) {
					this.add("-fail", target, "unboost", "Evasion", "[from] ability: Unconcerned", "[of] " + target);
				}
			}
		},
		shortDesc: "This Pokemon ignores its own stat stages when taking or doing damage.",
		rating: 4,
		num: -56,
	},
	hydrophilic: {
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
		onUpdate(pokemon) {
			if (pokemon.status === 'brn') {
				this.add('-activate', pokemon, 'ability: Water Bubble');
				pokemon.cureStatus();
			}
		},
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'brn') return;
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Water Bubble');
			}
			return false;
		},
		flags: {breakable: 1},
		name: "Hydrophilic",
		desc: "This Pokemon's offensive stat is doubled while using a Water-type attack. If a Pokemon uses a Fire-type attack against this Pokemon, that Pokemon's offensive stat is halved when calculating the damage to this Pokemon. This Pokemon cannot be burned. Gaining this Ability while burned cures it.",
		shortDesc: "This Pokemon's Water power is 2x; it can't be burned; Fire power against it is halved.",
		rating: 3.5,
		num: -57,
	},
	searingtouch: {
		onModifyMove(move) {
			if (!move || !move.flags['contact'] || move.target === 'self') return;
			if (!move.secondaries) {
				move.secondaries = [];
			}
			move.secondaries.push({
				chance: 30,
				status: 'brn',
				ability: this.dex.abilities.get('searingtouch'),
			});
		},
		name: "Searing Touch",
		shortDesc: "This Pokemon's contact moves have a 30% chance of burning.",
		rating: 2,
		num: -58,
	},
	virality: {
		name: "Virality",
		shortDesc: "Pokemon making contact with this Pokemon have their Ability changed to Mummy.",
		onDamagingHit(damage, target, source, move) {
			const sourceAbility = source.getAbility();
			if (sourceAbility.flags['cantsuppress'] || sourceAbility.id === 'virality') {
				return;
			}
			if (move.flags['contact']) {
				const oldAbility = source.setAbility('virality', target);
				if (oldAbility) {
					this.add('-activate', target, 'ability: Virality', this.dex.abilities.get(oldAbility).name, '[of] ' + source);
				}
			}
		},
		onBasePower(basePower, pokemon, target, move) {
			if (move.multihitType === 'parentalbond' && move.hit > 1) return this.chainModify(0.25);
		},
		rating: 2,
		num: -59,
	},
	oldschool: {
		shortDesc: "This Pokemon's high crit rate moves always crit, and deal damages x2 instead of x1.5. This Pokemon's special moves use SpD in calculation.",
		name: "Old School",
		onModifyMove(move, attacker) {
			if (move.category === 'Special') {
				move.overrideOffensiveStat = 'spd';
			}
		},
		onModifyCritRatio(critRatio, source, target) {
			if (critRatio >= 2) return 5;
		},
		onModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).crit) {
				this.debug('Old School boost');
				return this.chainModify(2 / 1.5);
			}
		},
		rating: 3.5,
		num: -60,
	},
	strongwill: {
		onSourceModifyDamage(damage, source, target, move) {
			if (move.category === 'Special') {
				return this.chainModify(0.5);
			}
		},
		name: "Strong Will",
		shortDesc: "This Pokemon receives 1/2 damage from special attacks.",
		desc: "This Pokemon receives 1/2 damage from special attacks.",
		rating: 4,
		num: -61,
	},
	smartguard: {
		desc: "On switch-in, this Pokémon's Defense or Special Defense is raised by 1 stage based on the weaker combined attacking stat of all opposing Pokémon. Special Defense is raised if their Special Attack is higher, and Defense is raised if their Attack is the same or higher.",
		shortDesc: "On switch-in, Defense or Sp. Def is raised 1 stage based on the foes' weaker Attack.",
		onStart(pokemon) {
			let totalatk = 0;
			let totalspa = 0;
			for (const target of pokemon.side.foe.active) {
				if (!target || target.fainted) continue;
				totalatk += target.getStat('atk', false, true);
				totalspa += target.getStat('spa', false, true);
			}
			if (totalatk && totalatk >= totalspa) {
				this.boost({def: 1});
			} else if (totalspa) {
				this.boost({spd: 1});
			}
		},
		name: "Smart Guard",
		rating: 4,
		num: -62,
	},
	dodge: {
		shortDesc: "When taking damages, this Pokemon adds 50% of its Speed to its corresponding defense.",
		name: "Dodge",
		onModifyDefPriority: 1,
		onModifyDef(def, pokemon) {
			const spe = pokemon.getStat('spe', false, true);
			const newDef = def + (spe / 2);
			return newDef;
		},
		onModifySpDPriority: 1,
		onModifySpD(spd, pokemon) {
			const spe = pokemon.getStat('spe', false, true);
			const newSpD = spd + (spe / 2);
			return newSpD;
		},
		rating: 3.5,
		num: -63,
	},
	reboundbelly: {
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) {
			if (target !== source && move?.category === 'Special' && !move.flags['sound']) {
				this.damage(source.baseMaxhp / 8, source, target);
			}
		},
		name: "Rebound Belly",
		shortDesc: "The opponent receives 1/8 recoil damage from special non-Sound moves.",
		rating: 2.5,
		num: -64,
	},
	faithfulcompanion: {
		onUpdate(pokemon) {
			if (this.gameType !== 'doubles') return;
			const ally = pokemon.allies()[0];
			if (!ally || pokemon.transformed ||
				pokemon.baseSpecies.baseSpecies !== 'Parrotnair' || ally.baseSpecies.baseSpecies !== 'Piratcy') {
				return;
			}
		},
		onAllyAfterUseItem(item, pokemon) {
			if (pokemon.switchFlag) return;
			const ally = pokemon.allies()[0];
			if (!ally || pokemon.transformed ||
				pokemon.baseSpecies.baseSpecies !== 'Parrotnair' || ally.baseSpecies.baseSpecies !== 'Piratcy') {
				return;
			}
			const source = this.effectState.target;
			const myItem = source.takeItem();
			if (!myItem) return;
			if (
				!this.singleEvent('TakeItem', myItem, source.itemState, pokemon, source, this.effect, myItem) ||
				!pokemon.setItem(myItem)
			) {
				source.item = myItem.id;
				return;
			}
			this.add('-activate', source, 'ability: Faithful Companion', myItem, '[of] ' + pokemon);
		},
		onAfterMoveSecondary(target, source, move) {
			if (source && source !== target && move?.flags['contact']) {
				if (target.item || target.switchFlag || target.forceSwitchFlag || source.switchFlag === true) {
					return;
				}
				const yourItem = source.takeItem(target);
				if (!yourItem) {
					return;
				}
				if (!target.setItem(yourItem)) {
					source.item = yourItem.id;
					return;
				}
				this.add('-enditem', source, yourItem, '[silent]', '[from] ability: Faithful Companion', '[of] ' + source);
				this.add('-item', target, yourItem, '[from] ability: Faithful Companion', '[of] ' + source);
			}
		},
		name: "Faithful Companion",
		shortDesc: "If the ally is Piratcy, gives to the ally this Pokemon's item, and steals an item from the opponent.",
		rating: 0,
		num: -65,
	},
	cheerleader: {
		onStart(pokemon) {
			this.boost({atk: 1}, pokemon);
		},
		shortDesc: "If the ally has Cheerleader: if Plusle, Atk, SpA and Speed x1.5; if Minun, Def, SpD and Speed x1.5.",
		desc: "If the ally has Cheerleader: if Plusle, its Atk, SpA and Speed are x1.5; if Minun, its Def, SpD and Speed are x1.5.",
		onModifyAtkPriority: 5,
		onModifyAtk(atk, pokemon) {
			for (const allyActive of pokemon.allies()) {
				if (allyActive.hasAbility(['cheerleader']) && pokemon.baseSpecies.baseSpecies === 'Plusle') {
					return this.chainModify(1.5);
				}
			}
		},
		onModifyDefPriority: 6,
		onModifyDef(def, pokemon) {
			for (const allyActive of pokemon.allies()) {
				if (allyActive.hasAbility(['cheerleader']) && pokemon.baseSpecies.baseSpecies === 'Minun') {
					return this.chainModify(1.5);
				}
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(spa, pokemon) {
			for (const allyActive of pokemon.allies()) {
				if (allyActive.hasAbility(['cheerleader']) && pokemon.baseSpecies.baseSpecies === 'Plusle') {
					return this.chainModify(1.5);
				}
			}
		},
		onModifySpDPriority: 5,
		onModifySpD(spd, pokemon) {
			for (const allyActive of pokemon.allies()) {
				if (allyActive.hasAbility(['cheerleader']) && pokemon.baseSpecies.baseSpecies === 'Minun') {
					return this.chainModify(1.5);
				}
			}
		},
		onModifySpePriority: 5,
		onModifySpe(spe, pokemon) {
			for (const allyActive of pokemon.allies()) {
				if (allyActive.hasAbility(['cheerleader'])) {
					return this.chainModify(1.5);
				}
			}
		},
		name: "Cheerleader",
		rating: 0,
		num: -66,
	},
	withering: {
		onModifyMove(move) {
			if (!move || !move.flags['contact'] || move.target === 'self') return;
			if (!move.secondaries) {
				move.secondaries = [];
			}
			move.secondaries.push({
				chance: 100,
				boosts: {
					spe: -1,
				},
				ability: this.dex.abilities.get('withering'),
			});
		},
		name: "Withering",
		shortDesc: "This Pokemon's contact moves lower the target's Speed by one stage.",
		rating: 2,
		num: -67,
	},
	lusterswap: { // taken from M4A
		desc: "On entry, this Pokémon's type changes to match its first move that's super effective against an adjacent opponent.",
		shortDesc: "On entry: type changes to match its first move that's super effective against an adjacent opponent.",
		onStart(pokemon) {
			for (const moveSlot of pokemon.moveSlots) {
				const move = this.dex.moves.get(moveSlot.move);
				if (move.category === 'Status') continue;
				const moveType = move.id === 'hiddenpower' ? pokemon.hpType : move.type;
				for (const target of pokemon.side.foe.active) {
					if (!target || target.fainted || !target.isAdjacent(pokemon)) continue;
					if (
						this.dex.getImmunity(moveType, target) && this.dex.getEffectiveness(moveType, target) > 0
					) {
						this.add('-ability', pokemon, 'Luster Swap');
						if (!pokemon.setType(moveType)) continue;
						this.add('-message', `${pokemon.name} changed its type to match its ${move.name}!`);
						this.add('-start', pokemon, 'typechange', moveType);
						return;
					}
				}
			}
			this.add('-ability', pokemon, 'Luster Swap');
			this.add('-message', `${pokemon.name} can't hit any opponent super effectively!`);
			return;
		},
		name: "Luster Swap",
		rating: 3,
		num: -68,
	},
	cacophony: {
		onBasePowerPriority: 7,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['sound']) {
				this.debug('Cacophony boost');
				return this.chainModify([5325, 4096]);
			}
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.flags['sound']) {
				this.debug('Cacophony weaken');
				return this.chainModify(0.5);
			}
		},
		flags: {breakable: 1},
		desc: "This Pokemon's sound-based moves have their power multiplied by 1.3. This Pokemon takes halved damage from sound-based moves.",
		shortDesc: "This Pokemon receives 1/2 damage from sound moves. Its own have 1.3x power.",
		name: "Cacophony",
		rating: 3.5,
		num: -69,
	},
	happygolucky: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, pokemon) {
			const newAtk = atk * (1 + (Math.floor(pokemon.happiness / 25)/100));
			return newAtk;
		},
		onModifyDefPriority: 5,
		onModifyDef(def, pokemon) {
			const newDef = def * (1 + (Math.floor(pokemon.happiness / 25)/100));
			return newDef;
		},
		onModifySpAPriority: 5,
		onModifySpA(spa, pokemon) {
			const newSpA = spa * (1 + (Math.floor(pokemon.happiness / 25)/100));
			return newSpA;
		},
		onModifySpDPriority: 5,
		onModifySpD(spd, pokemon) {
			const newSpD = spd * (1 + (Math.floor(pokemon.happiness / 25)/100));
			return newSpD;
		},
		flags: {},
		name: "Happy-Go-Lucky",
		desc: "This Pokemon's Attack, Defense, Special Attack, and Special Defense get a boost depending on the happiness of the Pokemon (maximum 10%).",
		shortDesc: "Boosts Attack, Defense, Special Attack, and Special Defense by 1% per 25 happiness.",
		rating: 4,
		num: -70,
	},
	mightywall: {
		onModifyDefPriority: 5,
		onModifyDef(def, pokemon) {
			return this.chainModify(1.5);
		},
		onModifySpDPriority: 5,
		onModifySpD(spd, pokemon) {
			return this.chainModify(1.5);
		},
		onSwitchOut(pokemon) {
			pokemon.addVolatile('mightywall');
		},
		condition: {
			onModifyDefPriority: 5,
			onModifyDef(def, pokemon) {
				return this.chainModify(0.5);
			},
			onModifySpDPriority: 5,
			onModifySpD(spd, pokemon) {
				return this.chainModify(0.5);
			},
		},
		desc: "This Pokemon's Defense and Special Defense are multiplied by 1.5, and by 0.5 when it switches out.",
		shortDesc: "This Pokemon's Defense and Special Defense are multiplied by 1.5, and by 0.5 when it switches out.",
		name: "Mighty Wall",
		rating: 4,
		num: -71,
	},
	karma: {
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['futuremove']) {
				return this.chainModify(1.5);
			}
		},
		flags: {},
		desc: "This Pokemon's delayed moves have their power multiplied by 1.5. Wish restores 50% more HP, rounded half down.",
		shortDesc: "This Pokemon's delayed moves have 1.5x power. Wish heals for 50% more HP.",
		name: "Karma",
		rating: 3,
		num: -72,
	},
	souldevourer: {
		onResidualOrder: 8,
		onResidual(pokemon) {
			if (!pokemon.hp) return;
			for (const target of pokemon.foes()) {
				if (target.volatiles['trapped']) {
					const damage = this.damage(pokemon.baseMaxhp / 8, target, pokemon);
					if (damage) {
						this.heal(damage, pokemon, pokemon);
					}
				}
			}
		},
		flags: {},
		desc: "If any target is trapped, this target loses 1/8 of its max HP, and this Pokemon heals for the same amount.",
		shortDesc: "If any target is trapped, this target loses 1/8 of its max HP, and this Pokemon heals for the same amount.",
		name: "Soul Devourer",
		rating: 3,
		num: -73,
	},
	tacticalescape: {
		onEmergencyExit(target) {
			if (!this.canSwitch(target.side) || target.forceSwitchFlag || target.switchFlag) return;
			for (const side of this.sides) {
				for (const active of side.active) {
					active.switchFlag = false;
				}
			}
			target.switchFlag = true;
			this.add('-activate', target, 'ability: Tactical Escape');
		},
		onDamage(damage, target, source, effect) {
			if (effect && (effect.id === 'stealthrock' || effect.id === 'spikes' || effect.id === 'toxicspikes' || effect.id === 'stickyweb' || effect.id === 'gmaxsteelsurge')) {
				return false;
			}
		},
		flags: {},
		name: "Tactical Escape",
		rating: 2,
		num: -74,
		desc: "This Pokemon is immune to hazards. When this Pokemon has more than 1/2 its maximum HP and takes damage bringing it to 1/2 or less of its maximum HP, it immediately switches out to a chosen ally. This effect applies after all hits from a multi-hit move. This effect is prevented if the move had a secondary effect removed by the Sheer Force Ability. This effect applies to both direct and indirect damage, except Curse and Substitute on use, Belly Drum, Pain Split, and confusion damage.",
		shortDesc: "Immune to hazards. This Pokemon switches out when it reaches 1/2 or less of its maximum HP.",
	},
	soothingfragrance: {
		onAnyModifyAtk(atk, source, target, move) {
			const abilityHolder = this.effectState.target;
			if (target.side === source.side) return;
			if (!move.ruinedAtk) move.ruinedAtk = abilityHolder;
			if (move.ruinedAtk !== abilityHolder) return;
			this.debug('Soothing Fragrance Atk drop');
			return this.chainModify(0.75);
		},
		onAllyModifyDefPriority: 3,
		onAllyModifyDef(def, pokemon) {
			return this.chainModify(1.25);
		},
		desc: "Opposing Pokemon have their Attack reduced by 25%, and allies have their Defense raised by 25%.",
		shortDesc: "Opposing Pokemon have their Attack reduced by 25%, and allies have their Defense raised by 25%.",
		flags: {},
		name: "Soothing Fragrance",
		rating: 2,
		num: -75,
	},
	tempestuous: {
		desc: "When replacing a fainted party member, this Pokémon's Special Defense is boosted, and it charges power to double the power of its Electric-type move on its first turn.",
		shortDesc: "Gains the effect of Charge when replacing a fainted ally.",
		onAfterMega(pokemon) {
			if (!pokemon.side.faintedLastTurn) return;
			this.boost({spd: 1}, pokemon);
			this.add('-activate', pokemon, 'move: Charge');
			pokemon.addVolatile('charge');
		},
		onStart(pokemon) {
			if (!pokemon.side.faintedThisTurn) return;
			this.boost({spd: 1}, pokemon);
			this.add('-activate', pokemon, 'move: Charge');
			pokemon.addVolatile('charge');
		},
		name: "Tempestuous",
		rating: 3,
		num: -76,
	},
	ambush: {
		shortDesc: "This Pokémon's attacks are critical hits if the user moves before the target.",
		onModifyCritRatio(critRatio, source, target) {
			if (target.newlySwitched || this.queue.willMove(target)) return 5;
		},
		name: "Ambush",
		rating: 4,
		num: -77,
	},
	steelbreaker: {
		shortDesc: "This Pokémon's attacks are critical hits if the target is a Steel-type Pokémon.",
		onModifyCritRatio(critRatio, source, target) {
			if (target && target.hasType('Steel')) return 5;
		},
		name: "Steelbreaker",
		rating: 3,
		num: -78,
	},
	ange: {
		onTryHit(pokemon, target, move) {
			if (move.ohko) {
				this.add('-immune', pokemon, '[from] ability: Ange');
				return null;
			}
		},
		onDamagePriority: -30,
		onDamage(damage, target, source, effect) {
			if (target.hp >= target.maxhp / 2 && damage >= target.hp && effect && effect.effectType === 'Move') {
				this.add('-ability', target, 'Ange');
				return target.hp - 1;
			}
			if (effect.id === 'recoil') {
				if (!this.activeMove) throw new Error("Battle.activeMove is null");
				if (this.activeMove.id !== 'struggle') return null;
			}
		},
		flags: {breakable: 1},
		name: "Ange",
		rating: 3,
		num: -79,
		desc: "This Pokemon does not take recoil damage, except Struggle. Does not affect Life Orb damage or crash damage. If this Pokemon is at more than half HP, it survives one hit with at least 1 HP. OHKO moves fail when used against this Pokemon.",
		shortDesc: "This Pokemon does not take recoil damage besides Struggle/Life Orb/crash damage. If this Pokemon is at >= 50% HP, it survives one hit with at least 1 HP. Immune to OHKO.",
	},
	seasonpass: {
		onPrepareHit(source, target, move) {
			if (move.hasBounced || move.flags['futuremove'] || move.sourceEffect === 'snatch' || move.callsMove) return;
			const allTypes = ['Ghost', 'Fire', 'Fairy', 'Ice'];
			const type = move.type;
			if (type && type !== '???' && source.getTypes()[0] !== type && allTypes.includes(type)) {
				if (!source.addType(type)) return;
				this.add('-start', source, 'typeadd', type, '[from] ability: Season Pass');
			}
		},
		rating: 4.5,
		flags: {},
		name: "Season Pass",
		num: -80,
		desc: "This Pokemon gets a new type when using a Ghost/Fire/Fairy/Ice type move. This effect comes after all effects that change a move's type.",
		shortDesc: "This Pokemon gets a type if using a Ghost/Fire/Fairy/Ice move.",
	},
	bitterhatred: {
		shortDesc: "Deal 10% bonus damage for each hit taken (up to 50%)",
		onStart(pokemon) {
			if (!pokemon.hp) return;
			let attacked = pokemon.timesAttacked;
			if (attacked > 0) {
				this.effectState.fallen = attacked > 5 ? 5 : attacked;
				this.add('-start', pokemon, `fallen${this.effectState.fallen}`, '[silent]');
			} else {
				this.effectState.fallen = 0;
			}
		},
		onDamagingHit(damage, target, source, move) {
			if (!target.hp || this.effectState.fallen >= 5) return;
			if (!move.isMax && !move.flags['futuremove'] && move.id !== 'struggle') {
				if (this.effectState.fallen) {
					this.add('-end', target, `fallen${this.effectState.fallen}`, '[silent]');
				}
				this.effectState.fallen++;
				this.add('-activate', target, 'ability: Emperor\'s Clothes');
				this.add('-start', target, `fallen${this.effectState.fallen}`, '[silent]');
			}
		},
		onBasePowerPriority: 21,
		onBasePower(basePower, attacker, defender, move) {
			if (this.effectState.fallen) {
				const powMod = [4096, 4506, 4915, 5325, 5734, 6144];
				this.debug(`Supreme Overlord boost: ${powMod[this.effectState.fallen]}/4096`);
				return this.chainModify([powMod[this.effectState.fallen], 4096]);
			}
		},
		flags: {},
		name: "Bitter Hatred",
		num: -81,
	},
	pollution: {
		onSourceModifyAtkPriority: 5,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Water') {
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Water') {
				return this.chainModify(0.5);
			}
		},
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Poison') {
				return this.chainModify(2);
			}
		},
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Poison') {
				return this.chainModify(2);
			}
		},
		onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, source, target)) {
				if (this.randomChance(3, 10)) {
					source.trySetStatus('psn', target);
				}
			}
		},
		flags: {breakable: 1},
		name: "Pollution",
		desc: "Poison Point. This Pokemon's offensive stat is doubled while using a Poison-type attack. If a Pokemon uses a Water-type attack against this Pokemon, that Pokemon's offensive stat is halved when calculating the damage to this Pokemon.",
		shortDesc: "Poison Point. This Pokemon's Poison power is 2x; Water power against it is halved.",
		rating: 4.5,
		num: -82,
	},
	freegullet: {
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if (move.id === 'surf' || move.id === 'dive') {
				return this.chainModify(1.5);
			}
		},
		onSourceHit(target, source, move) {
			if (!move || !target) return;
			if (move.id === 'surf' || move.id === 'dive') {
				source.addVolatile('stockpile');
			}
		},
		flags: {cantsuppress: 1, notransform: 1},
		name: "Free Gullet",
		rating: 2.5,
		num: -83,
		shortDesc: "If the user uses Surf/Dive, it gains the Stockpile effect. Surf/Dive has 1.5x power.",
	},
	gulp: {
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if (move.id === 'surf' || move.id === 'dive') {
				return this.chainModify(1.5);
			}
		},
      	onAfterMove(target, source, move) {
			if (target !== source && (move.id === 'surf' || move.id === 'dive')) {
				this.damage(source.baseMaxhp / 4, source, target);
			}
		},
		onModifyMove(move) {
			if (move.id === 'surf' || move.id === 'dive') delete move.flags['protect'];
		},
		flags: {cantsuppress: 1, notransform: 1},
		name: "Gulp",
		rating: 2.5,
		num: -84,
		shortDesc: "If the user uses Surf/Dive, the target takes 1/4 max HP on top of the damage. Surf/Dive has 1,5x power. Surf/Dive breaks protection.",
	},
	gorge: {
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if (move.id === 'surf' || move.id === 'dive') {
				return this.chainModify(1.5);
			}
		},
		onSourceHit(target, source, move) {
			if (!move || !target) return;
			if (move.id === 'surf' || move.id === 'dive') {
				target.addVolatile('charge');
			}
		},
		onSourceDamagingHit(damage, target, source, move) {
			// Despite not being a secondary, Shield Dust / Covert Cloak block the effect
			if (target.hasAbility('shielddust') || target.hasItem('covertcloak')) return;
			if (move.id === 'surf' || move.id === 'dive') {
				if (this.randomChance(2, 10)) {
					target.trySetStatus('par', source);
				}
			}
		},
		flags: {cantsuppress: 1, notransform: 1},
		name: "Gorge",
		rating: 2.5,
		num: -85,
		shortDesc: "If the user uses Surf/Dive, user gains the Charge effect. Surf/Dive has 1,5x power. Surf/Dive has an added 20% chance of paralysis",
	},
	blindeye: {
		onEffectiveness(typeMod, target, type, move) {
			if (move && this.dex.getImmunity(move, type) === false) return 3;
			return -typeMod;
		},
		flags: {breakable: 1},
		name: "Blind Eye",
		desc: "This Pokemon's affinities are reversed.",
		shortDesc: "This Pokemon's affinities are reversed.",
		rating: 4.5,
		num: -86,
	},
	counterstrike: {
		shortDesc: "This Pokemon reflects 50% of the damage it receives.",
		beforeTurnCallback(pokemon) {
			pokemon.addVolatile('counterstrike');
		},
		onTry(source) {
			if (!source.volatiles['counterstrike']) return false;
			if (source.volatiles['counterstrike'].slot === null) return false;
		},
		condition: {
			duration: 1,
			noCopy: true,
			onStart(target, source, move) {
				this.effectState.slot = null;
				this.effectState.damage = 0;
			},
			onRedirectTargetPriority: -1,
			onRedirectTarget(target, source, source2, move) {
				if (source !== this.effectState.target || !this.effectState.slot) return;
				return this.getAtSlot(this.effectState.slot);
			},
			onDamagingHit(damage, target, source, move) {
				if (!source.isAlly(target)) {
					this.effectState.slot = source.getSlot();
					this.effectState.damage = damage / 2;
				}
			},
		},
		name: "Counter Strike",
		rating: 3.5,
		num: -87,
	},
	climaticchange: {
		desc: "Upon using a Water, Fire, or Ice move, this Pokemon changes to that type and sets the corresponding weather.",
		shortDesc: "Changes type and weather when using Water/Fire/Ice moves.",
		onPrepareHit(source, target, move) {
			if (move.hasBounced) return;
			const type = move.type;
			if (type) {
				switch (type) {
				case "Water":
					this.field.setWeather('raindance');
					if (!source.setType(type)) return;
					this.add('-start', source, 'typechange', type, '[from] ability: Climatic Change');
					break;
				case "Fire":
					this.field.setWeather('sunnyday');
					if (!source.setType(type)) return;
					this.add('-start', source, 'typechange', type, '[from] ability: Climatic Change');
					break;
				case "Ice":
					this.field.setWeather('hail');
					if (!source.setType(type)) return;
					this.add('-start', source, 'typechange', type, '[from] ability: Climatic Change');
					break;
				}
			}
		},
		name: "Climatic Change",
		rating: 4,
		num: -88,
	},
	hyperglycemia: {
		desc: "At the end of each turn, every Pokemon gets 1 Stockpile. Reduces the damage taken by X*10%, with X the amount of Stockpiles this Pokemon has, and boosts this Pokemon's damage by Y*10%, Y being the amount of Stockpiles the target has.",
		shortDesc: "Every Pokemon Stockpiles at the end of each turn. Reduces damage by X*10%, and boosts damage by Y*10%.",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual(pokemon) {
			let activated = false;
			if (pokemon.activeTurns) {
				pokemon.addVolatile('stockpile');
				for (const target of pokemon.side.foe.active) {
					if (!target || !target.isAdjacent(pokemon)) continue;
					if (!activated) {
						this.add('-ability', pokemon, 'Hyperglycemia', 'boost');
						activated = true;
					}
					if (target.volatiles['substitute']) {
						this.add('-immune', target);
					} else {
						target.addVolatile('stockpile');
					}
				}
			}
		},
		onBasePowerPriority: 7,
		onBasePower(basePower, attacker, defender, move) {
			var bpBoost = 1 + 0.1 * attacker.volatiles['stockpile'].layers;
			return this.chainModify(bpBoost);
		},
		onSourceModifyDamage(damage, source, target, move) {
			var defBoost = 1 + 0.1 * target.volatiles['stockpile'].layers;
			return this.chainModify(defBoost);
		},
		flags: {breakable: 1},
		name: "Hyperglycemia",
		rating: 4.5,
		num: -89,
	},
	graviton: {
		shortDesc: "On switch-in, this Pokémon summons Gravity.",
		onStart(source) {
			this.field.addPseudoWeather('gravity');
		},
		name: "Graviton",
		rating: 4,
		num: -90,
	},
	solarenergy: {
		onModifySpe(spe, pokemon) {
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.5);
			}
		},
		onBasePowerPriority: 21,
		onBasePower(basePower, attacker, defender, move) {
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				if (move.type === 'Electric') {
					this.debug('Solar Energy boost');
					return this.chainModify([5325, 4096]);
				}
			}
		},
		flags: {},
		name: "Solar Energy",
		desc: "If Sunny Day is active, this Pokemon's Speed is multiplied by 1.5, and this Pokemon's Electric moves have x1.5. This effect is prevented if this Pokemon is holding a Utility Umbrella.",
		shortDesc: "If Sunny Day is active, Speed x1.5, and Electric moves x1.5.",
		rating: 3,
		num: -91,
	},
	punchprodigee: {
		shortDesc: "Gives a +1 priority to punch moves.",
		onModifyPriority(priority, pokemon, target, move) {
			if (move.flags['punch']) return priority + 1;
		},
		name: "Punch Prodigee",
		num: -92,
	},
	heavyweapon: {
		shortDesc: "Gives an ally Octillery +1 priority on all its moves.",
		onUpdate(pokemon) {
			if (this.gameType !== 'doubles') return;
			const ally = pokemon.allies()[0];
			if (!ally || pokemon.transformed ||
				pokemon.baseSpecies.baseSpecies !== 'Mantine' || ally.baseSpecies.baseSpecies !== 'Octillery') {
				return;
			}
			ally.addVolatile('heavyweapon');
		},
		condition: {
			onModifyPriority(priority, pokemon, target, move) {
				return priority + 1;
			},
		},
		name: "Heavy Weapon",
		num: -93,
	},
	multiheaded: {
		onPrepareHit(source, target, move) {
			if (move.category === 'Status' || move.multihit || move.flags['noparentalbond'] || move.flags['charge'] ||
				move.flags['futuremove'] || move.spreadHit || move.isZ || move.isMax) return;
			move.multihit = 3;
			move.multihitType = 'multiheaded' as 'parentalbond';
		},
		onTryBoost(boost, target, source, effect) {
			if (effect.effectType === 'Move' && effect.multihitType && effect.hit > 1 &&
				source && target === source) {
				let i: keyof BoostsTable;
				for (i in boost) {
					delete boost[i];
				}
			}
		},
		// Damage modifier implemented in BattleActions#modifyDamage()
		onSourceModifySecondaries(secondaries, target, source, move) {
			if (move.multihitType && move.hit > 1) {
				return [];
			}
		},
		flags: {},
		name: "Multiheaded",
		gen: 9,
		desc: "This Pokemon's damaging moves hit 3x. Successive hits do 15% damage without added effects.",
		shortDesc: "This Pokemon's damaging moves hit 3x. Successive hits do 15% damage without added effects.",
		num: -94
	},
	savagebite: {
		onModifyDamage(damage, source, target, move) {
			if (move.flags['bite'] && target.getMoveHitData(move).typeMod < 0) {
				this.debug('Tinted Lens boost');
				return this.chainModify(2);
			}
		},
		onModifyMovePriority: -5,
		onModifyMove(move) {
			if (move.flags['bite']) move.ignoreAbility = true;
		},
		flags: {},
		name: "Savage Bite",
		shortDesc: "This Pokemon's biting attacks ignore resistances and abilities.",
		rating: 4,
		num: -95,
	},
	lightpower: {
		onModifySpAPriority: 5,
		onModifySpA(spa) {
			return this.chainModify(2);
		},
		name: "Light Power",
		shortDesc: "This Pokemon's Special Attack is doubled.",
		rating: 5,
		num: -96,
	},
	thermalswitch: {
		onStart(pokemon) {
			this.singleEvent('WeatherChange', this.effect, this.effectState, pokemon);
		},
		onWeatherChange(pokemon) {
			if (!pokemon.isActive || pokemon.baseSpecies.baseSpecies !== 'Draggoyle' || pokemon.transformed) return;
			if (!pokemon.hp) return;
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				if (pokemon.species.id !== 'draggoyleactive') {
					pokemon.formeChange('Draggoyle-Active', this.effect, false, '[msg]');
				}
			}			
			if (['hail', 'snow', 'everlastingwinter'].includes(pokemon.effectiveWeather())) {
				if (pokemon.species.id !== 'draggoyle') {
					pokemon.formeChange('Draggoyle', this.effect, false, '[msg]');
				}
			}
		},
		onUpdate(pokemon) {
			if (pokemon.status === 'brn') {
				this.add('-activate', pokemon, 'ability: Thermal Switch');
				pokemon.cureStatus();
			}
			if (pokemon.status === 'frz') {
				if (pokemon.species.id !== 'draggoyle') {
					pokemon.formeChange('Draggoyle', this.effect, false, '[msg]');
				}
			}
		},
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'brn' && status.id !== 'frz') return;
			if ((effect as Move)?.status && status.id === 'brn') {
				this.add('-immune', target, '[from] ability: Thermal Switch');
			}
			if ((effect as Move)?.status && status.id === 'frz') {
				if (pokemon.species.id !== 'draggoyle') {
					pokemon.formeChange('Draggoyle', this.effect, false, '[msg]');
				}
			}
			return false;
		},
		onDamagingHit(damage, target, source, move) {
			if (move.type === 'Fire') {
				if (pokemon.species.id !== 'draggoyleactive') {
					pokemon.formeChange('Draggoyle-Active', this.effect, false, '[msg]');
				}
			}
			if (move.type === 'Ice') {
				if (pokemon.species.id !== 'draggoyle') {
					pokemon.formeChange('Draggoyle', this.effect, false, '[msg]');
				}
			}
		},
		flags: {failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1},
		name: "Thermal Switch",
		desc: "Immunity to Burn. This Pokemon has two forms, Passive and Active. It starts the fight with Passive form. If Sun is set or it's hit by a Fire-type move, it switches to Active form until it switches out. If Snow is set, it's frozen, or it's hit by an Ice-type move, it switches to Passive form.",
		shortDesc: "Burn immunity. Sun or Fire-type move: Active form; Snow, frozen or Ice-type move: Passive form.",
		rating: 4,
		num: -97,
	},
	ironbody: {
		num: -98,
		name: "Iron Body",
		shortDesc: "On switch in, adds Steel type to the user. Has no effect if the user is Steel-type.",
		onStart(pokemon) {
			if (pokemon.addType('Steel')) {
				this.add('-start', pokemon, 'typeadd', 'Steel', '[from] ability: Iron Body');
			}
		},
		rating: 3,
	},
	psychicprowess: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Psychic') {
				this.debug('Psychic Prowess boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Psychic') {
				this.debug('Psychic Prowess boost');
				return this.chainModify(1.5);
			}
		},
		name: "Psychic Prowess",
		shortDesc: "This Pokemon's attacking stat is multiplied by 1.5 while using a Psychic type attack. Amnesia also boosts SpA by 2.",
		rating: 3.5,
		num: -99,
	},
	rewind: {
		name: "Rewind",
		shortDesc: "When brought to 50% HP or less, restores lost items on user's side.",
		flags: {failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1},
		rating: 4,
		num: -100,
		onStart(pokemon) {
			pokemon.addVolatile('rewind');
		},
		onDamage(damage, target, source, effect) {
			const rewindState = target.volatiles['rewind'];
			if (!rewindState || typeof damage !== 'number') return;
			const hpBefore = target.hp;
			const hpAfter = hpBefore - damage;
			if (rewindState.triggeredThisTurn) return;
			if (hpBefore > target.maxhp / 2 && hpAfter <= target.maxhp / 2) {
				rewindState.shouldTrigger = true;
				rewindState.triggeredThisTurn = true;
			}
		},
		onResidualOrder: 29,
		onResidual(pokemon) {
			const rewindState = pokemon.volatiles['rewind'];
			if (rewindState) {
				rewindState.triggeredThisTurn = false;
				if (rewindState.shouldTrigger) {
					rewindState.shouldTrigger = false;
					this.add('-message', `${pokemon.name} has triggered Rewind!`);
					let itemRestored = false;
					if (pokemon.side && Array.isArray(pokemon.side.pokemon)) {
						for (const ally of pokemon.side.active) {
							if (ally && !ally.item) {
								this.actions.useMove('Recycle', ally);
								itemRestored = true;
							}
						}
						if (itemRestored) {
							this.add('-message', `${pokemon.name} rewound time to restore its team's items!`);
						}
					}
				}
			}
		},
		onUpdate(pokemon) {
			const rewindState = pokemon.volatiles['rewind'];
			if (!rewindState || !rewindState.shouldTrigger) return;
			rewindState.shouldTrigger = false;
			let itemRestored = false;
			this.add('-ability', pokemon, 'Rewind');
			if (pokemon.side && Array.isArray(pokemon.side.pokemon)) {
				for (const ally of pokemon.side.active) {
					if (ally && !ally.item) {
						this.actions.useMove('Recycle', ally);
						itemRestored = true;
					}
				}
				if (itemRestored) {
					this.add('-message', `${pokemon.name} rewound time to restore its team's items!`);
				}
			}
		},
		condition: {
			noCopy: true,
			onStart() {
				this.effectState.shouldTrigger = false;
				this.effectState.triggeredThisTurn = false;
			}
		},
	},
	hugeclamp: {
		onModifyAtkPriority: 6,
		onModifyAtk(pokemon) {
			return this.chainModify(1.5);
		},
		onModifySpePriority: 6,
		onModifySpe(pokemon) {
			return this.chainModify(0.5);
		},
		name: "Huge Clamp",
		shortDesc: "This Pokemon's Atk is boosted by 1.5, but its Speed is halved.",
		rating: 1.5,
		num: -101,
	},
	contrarian: {
		onStart(source) {
			this.add('-ability', source, 'Contrarian');
			this.field.addPseudoWeather('contrarian');
			this.hint("All Pokemon are under Contrary effect!");
		},
		onResidualOrder: 21,
		onResidualSubOrder: 2,
		onEnd(pokemon) {
			this.field.removePseudoWeather('contrarian');
		},
		name: "Contrarian",
		shortDesc: "As long as this Pokémon is on the field, every Pokémon on the field is under Contrary effect.",
		rating: 4.5,
		num: -102,
	},
	// Touhou
	hakkero: {
		//effect in conditions.ts
		flags: {},
		name: "Hakkero",
		shortDesc: "Fire moves not weakened by Rain.",
	},
	darkborder: {
		onSourceModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Fairy' || move.type === 'Fire') {
				this.debug('Dark Border weaken');
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Fairy' || move.type === 'Fire') {
				this.debug('Dark Border weaken');
				return this.chainModify(0.5);
			}
		},
		flags: {breakable: 1},
		name: "Dark Border",
		shortDesc: "Fairy and Fire damage taken is halved.",
	},
	mistystep: {
		onModifySpe(spe) {
			if (this.field.isTerrain('mistyterrain')) {
				return this.chainModify(2);
			}
		},
		flags: {},
		name: "Misty Step",
		shortDesc: "Speed is doubled in Misty Terrain.",
	},
	anemic: {
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if (move.category === 'Special') {
				for (const moveSlot of attacker.moveSlots) {
					if (moveSlot.id == move.id) moveSlot.pp --;
				}
				return this.chainModify(1.2);
			}
		},
		flags: {},
		name: "Anemic",
		shortDesc: "Special moves have 1.2x power, cost 2 PP.",
	},
	maidstrick: {
		onModifyPriority(priority, pokemon, target, move) {
			if (move.flags['slicing'] && pokemon.hp === pokemon.maxhp) return priority + 1;
		},
		flags: {},
		name: "Maid's Trick",
		shortDesc: "Slicing moves have priority at full HP.",
	},
	vampirism: {
		onModifyMove(move) {
			if (move.flags['bite']) { 
				move.drain ||= [1, 4];
			}
		},
		flags: {},
		name: "Vampirism",
		shortDesc: "Biting moves drain 25% of damage dealt.",
	},
	illusorybacking: {
		onAllyBasePowerPriority: 22,
		onAllyBasePower(basePower, attacker, defender, move) {
			if (move.flags['sound'] && attacker !== this.effectState.target) {
				this.debug('Power Spot boost');
				return this.chainModify([5325, 4096]);
			}
		},
		flags: {},
		name: "Illusory Backing",
		shortDesc: "Allies' Sound moves have 1.3x power.",
	},
	netherworldsspring: {
		onResidual(pokemon) {
			console.log(this.field.weather + " " + pokemon.hp + " " + pokemon.baseMaxhp);
			if (pokemon.hp && pokemon.hp < pokemon.baseMaxhp && this.field.isWeather('snow')) {
				if (this.field.clearWeather()) this.heal(pokemon.baseMaxhp / 3);
			}
		},
		flags: {},
		name: "Netherworld's Spring",
		shortDesc: "Clears Snow at the end of each turn to heal by 33%.",
	},
	demonparade: {
		onModifySpe(spe, pokemon) {
			if(pokemon.adjacentFoes().length == 0) return;
			let target = this.sample(pokemon.adjacentFoes());
			if (target.status === 'brn') {
				return this.chainModify(2);
			}
		},
		flags: {},
		name: "Demon Parade",
		shortDesc: "Speed is doubled if an opponent is burned.",
	},
	nightsong: {
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			if (move.flags['sound'] && !pokemon.volatiles['dynamax']) { // hardcode
				move.type = 'Dark';
			}
		},
		flags: {},
		name: "Night Song",
		shortDesc: "Sound moves become Dark-Type.",
	},
	werehakutaku: {
		onSourceAfterFaint(length, target, source, effect) {
			if (effect && effect.effectType === 'Move' && source.species.id === 'keine') {
				source.formeChange('Keine-Hakutaku', this.effect, true);
			}
		},
		flags: {failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1},
		name: "Were-Hakutaku",
		shortDesc: "Transforms Keine into Keine-Hakutaku after KO-ing an opponent.",
	},
	brainofthemoon: {
		onSourceModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Psychic' || move.type === 'Dark') {
				this.debug('Brain of the Moon weaken');
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Psychic' || move.type === 'Dark') {
				this.debug('Brain of the Moon weaken');
				return this.chainModify(0.5);
			}
		},
		flags: {breakable: 1},
		name: "Brain of the Moon",
		shortDesc: "Dark and Psychic damage taken is halved.",
	},
	blackandwhite: {
		// CHECK IF THIS WORKS
		onModifyDamage(damage, source, target, move) {
			if (move && target.getMoveHitData(move).typeMod > 0) {
				return this.chainModify(1.5);
			}
			else if (move && target.getMoveHitData(move).typeMod < 0) {
				return this.chainModify(0.5);
			}
		},
		flags: {},
		name: "Black and White",
		shortDesc: "Super effective moves deal 1.5x damage, not very effective deals half.",
	},
	cursegathering: {
		onAnyRedirectTarget(target, source, source2, move) {
			if (move.category !== 'Status' || move.flags['pledgecombo']) return;
			const redirectTarget = ['randomNormal', 'adjacentFoe'].includes(move.target) ? 'normal' : move.target;
			if (this.validTarget(this.effectState.target, source, redirectTarget)) {
				if (move.smartTarget) move.smartTarget = false;
				if (this.effectState.target !== target) {
					this.add('-activate', this.effectState.target, 'ability: Curse Gathering');
				}
				return this.effectState.target;
			}
		},
		flags: {},
		name: "Curse Gathering",
		shortDesc: "Redirects status moves targeting an ally to the user instead.",
	},
	swordofhisou: {
		onStart(pokemon) {
			this.singleEvent('WeatherChange', this.effect, this.effectState, pokemon);
		},
		onWeatherChange(pokemon) {
			if (pokemon.effectiveWeather()) {
				pokemon.addVolatile('ability:swordofruin');
			} else {
				pokemon.removeVolatile('ability:swordofruin');
			}
		},
		flags: {},
		name: "Sword of Hisou",
		shortDesc: "Activate Sword of Ruin while a weather effect is active.",
	},
	dexterity: {
		onDamage(damage, target, source, effect) {
			if (effect && ['stealthrock', 'spikes', 'gmaxsteelsurge'].includes (effect.id)) {
				return false;
			}
		},
		flags: {},
		name: "Dexterity",
		shortDesc: "Immunity to entry hazards.",
	},
	jealous: {
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if (move.target === 'normal' || move.target === 'any') {
				return this.chainModify(Math.min(2, 1 + 0.1 * defender.positiveBoosts()));
			}
		},
		flags: {},
		name: "Jealous",
		shortDesc: "Gain 10% extra damage per increased stat stage on the opponent, max 100%.",
	},
	recollection: {
		onSwitchIn(source) {
			const target = source.side.foe.active[source.side.foe.active.length - 1 - source.position];
			if (target) {
				for (let i = 0; i < Math.min(target.moveSlots.length, 4); i ++) {
					const moveSlot = target.moveSlots[i];
					if (source.moveSlots.filter(m => m.id === moveSlot.id).length) continue;
					if (moveSlot === null) break;
					this.attrLastMove('[still]');
					if (source.moveSlots.length < 0) return;
					const learnedMove = {
						move: this.dex.moves.get(moveSlot.id),
						id: moveSlot.id,
						pp: 5,
						maxpp: 5,
						target: moveSlot.target,
						disabled: false,
						used: false,
					};
					source.moveSlots[source.moveSlots.length] = learnedMove;
				}
			}
		},
		flags: {},
		name: "Recollection",
		shortDesc: "On switch-in, learn the opponent's moves in addition to your own.",
	},
	delusion: {
		onResidual(pokemon) {
			if (pokemon.volatiles['confusion'] || this.field.isTerrain('psychicterrain')) {
				this.heal(pokemon.baseMaxhp / 8);
			}
		},
		flags: {},
		name: "Delusion",
		shortDesc: "Heal 12.5% at the end of each turn while confused or in psychic terrain.",
	},
	surprise: {
		onStart(pokemon) {
			let activated = false;
			for (const target of pokemon.adjacentFoes()) {
				if (!activated) {
					this.add('-ability', pokemon, 'Surprise', 'boost');
					activated = true;
				}
				if (target.volatiles['substitute'] || target.hasType('Psychic')) {
					this.add('-immune', target);
				} else {
					this.boost({spa: -1}, target, pokemon, null, true);
				}
			}
		},
		flags: {},
		name: "Surprise",
		shortDesc: "On switch-in, lower opponent's Sp. Atk. by 1 stage, Psychic-Types are immune.",
	},
	summonnyuudou: {
		onSwitchOut(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Ichirin Kumoi') return;
			if (pokemon.species.forme !== 'Unzan') {
				pokemon.formeChange('Ichirin and Unzan', this.effect, true);
				pokemon.set.ability = 'Iron Fist';
			}
		},
		onSwitchIn(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Ichirin Kumoi') return;
			if (!this.effectState.heroMessageDisplayed && pokemon.species.forme === 'Ichirin and Unzan') {
				this.add('-activate', pokemon, 'ability: Summon Nyuudou');
				this.effectState.heroMessageDisplayed = true;
			}
		},
		flags: {failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1},
		name: "Summon Nyuudou",
		shortDesc: "Transforms Ichirin Kumoi into Ichirin and Unzan when switching out.",
	},
	waterygrave: {
		onSourceAfterFaint(length, target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				this.field.setWeather('raindance');
			}
		},
		flags: {},
		name: "Watery Grave",
		shortDesc: "Summons Rain for 5 turns after KO-ing an opponent.",
	},
	devilsrecitation: {
		onBasePower(basePower, attacker, defender, move) {
			if (move.type === 'Dark' && this.field.isTerrain('psychicterrain')) {
				return this.chainModify(1.5);
			}
		},
		flags: {},
		name: "Devil's Recitation",
		shortDesc: "Dark-Type moves have 1.5x power in Psychic Terrain.",
	},
	undefineddefense: {
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === target.teraType) {
				return this.chainModify(0.5);
			}
		},
		flags: {},
		name: "Undefined Defense",
		shortDesc: "Halves damage taken from moves of the Pokémon's Tera type.",
	},
	echo: {
		onTryHit(target, source, move) {
			if (target !== source && move.flags['sound']) {
				this.add('-immune', target, '[from] ability: Echo');
				return null;
			}
		},
		onAllyTryHitSide(target, source, move) {
			if (move.flags['sound']) {
				this.add('-immune', this.effectState.target, '[from] ability: Echo');
			}
		},
		// echo part implemented in runMove in scripts/actions
		flags: {},
		name: "Echo",
		shortDesc: "Sound immunity, repeats sound moves used.",
	},
	healbydesire: {
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Ghost') {
				if (!this.heal(target.baseMaxhp / 4)) {
					this.add('-immune', target, '[from] ability: Heal by Desire');
				}
				return null;
			}
		},
		flags: {breakable: 1},
		name: "Heal by Desire",
		shortDesc: "Ghost immunity, heals 25% when hit by Ghost.",
	},
	'100medicines': {
		onResidualOrder: 5,
		onResidualSubOrder: 3,
		onResidual(pokemon) {
			if (pokemon.status && this.field.isTerrain('grassyterrain')) {
				this.add('-activate', pokemon, 'ability: 100 Medicines');
				pokemon.cureStatus();
			}
		},
		flags: {},
		name: "100 Medicines",
		shortDesc: "Heals status conditions at the end of the turn while in grassy terrain.",
	},
	wickedpower: {
		// onModifyAtkPriority: 5,
		// onModifyAtk(atk, attacker, defender, move) {
		// 	if (move.type === 'Dark') {
		// 		this.debug('Wicked Power boost');
		// 		return this.chainModify(1.5);
		// 	}
		// },
		// onModifySpAPriority: 5,
		// onModifySpA(atk, attacker, defender, move) {
		// 	if (move.type === 'Dark') {
		// 		this.debug('Wicked Power boost');
		// 		return this.chainModify(1.5);
		// 	}
		// },
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) {
			target.addVolatile('wickedenergy');
		},
		flags: {},
		name: "Wicked Power",
		shortDesc: "When this Pokémon is hit, its next Dark-Type move has 2x power.",
	},
	growbigger: {
		//effects in scripts/battle, pokemon, etc
		flags: {},
		name: "Grow Bigger",
		shortDesc: "Once per battle the pokémon can Dynamax for one turn.",
	},
	pristinebeat: {
		onStart(pokemon) {
			pokemon.addVolatile('pristinebeat');
		},
		condition: {
			onStart(pokemon) {
				this.effectState.lastMove = '';
				this.effectState.numConsecutive = 0;
			},
			onTryMovePriority: -2,
			onTryMove(pokemon, target, move) {
				if (!pokemon.hasAbility('pristinebeat')) {
					pokemon.removeVolatile('pristinebeat');
					return;
				}
				if (move.callsMove) return;
				if (this.effectState.lastMove === move.id && pokemon.moveLastTurnResult) {
					this.effectState.numConsecutive++;
				} else if (pokemon.volatiles['twoturnmove']) {
					if (this.effectState.lastMove !== move.id) {
						this.effectState.numConsecutive = 1;
					} else {
						this.effectState.numConsecutive++;
					}
				} else {
					this.effectState.numConsecutive = 0;
				}
				this.effectState.lastMove = move.id;
			},
			onModifyDamage(damage, source, target, move) {
				const dmgMod = [4096, 4915, 5734, 6553, 7372, 8192];
				const numConsecutive = this.effectState.numConsecutive > 5 ? 5 : this.effectState.numConsecutive;
				this.debug(`Current Metronome boost: ${dmgMod[numConsecutive]}/4096`);
				return this.chainModify([dmgMod[numConsecutive], 4096]);
			},
		},
		flags: {},
		name: "Pristine Beat",
		shortDesc: "Moves used multiple times in a row get 20% stronger up to a 100% boost.",
	},
	dangoinfluence: {
		onEatItem(item, pokemon) {
			this.boost({ atk: 1 }, pokemon);
		},
		flags: {},
		name: "Dango Influence",
		shortDesc: "Consuming a berry increases Atk. by one stage.",
	},
	lunatictorch: {
		//effects in pokemon/effectiveWeather
		flags: {},
		name: "Lunatic Torch",
		shortDesc: "Gain the effects of Sun while in Psychic Terrain.",
	},
	foolsgold: {
		onTryHit(target, source, move) {
			if (move.category === 'Status' && target !== source) {
				this.add('-immune', target, '[from] ability: Fool\'s Gold');
				target.setAbility('defeatist');
				return null;
			}
		},
		flags: {},
		name: "Fool's Gold",
		shortDesc: "Immunity to Status moves, changes to Defeatist after activating.",
	},
	cutdeep: {
		onSourceDamagingHit(damage, target, source, move) {
			// Despite not being a secondary, Shield Dust / Covert Cloak block Toxic Chain's effect
			if (!move.flags['slicing'] || target.hasAbility('shielddust') || target.hasItem('covertcloak')) return;
			this.boost({ def: -1 }, target, source);
		},
		flags: {},
		name: "Cut Deep",
		shortDesc: "Slicing moves lower the target's Def. by one stage.",
	},
	winterhearth: {
		onBasePower(basePower, attacker, defender, move) {
			if (['snowscape'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(2);
			}
		},
		flags: {},
		name: "Winter Hearth",
		shortDesc: "Fire moves are twice as powerful during Snow.",
	},
	fourseasons: {
		onSwitchInPriority: -2,
		onStart(pokemon) {
			this.singleEvent('WeatherChange', this.effect, this.effectState, pokemon);
		},
		onWeatherChange(pokemon) {
			// switch (pokemon.effectiveWeather()) {
			// 	case 'sunnyday':
			// 	case 'desolateland':
			// 		pokemon.setType(['Fire', 'Dark']);
			// 		break;
			// 	case 'raindance':
			// 	case 'primordialsea':
			// 		pokemon.setType(['Water', 'Dark']);
			// 		break;
			// 	case 'sandstorm':
			// 		pokemon.setType(['Rock', 'Dark']);
			// 		break;
			// 	case 'hail':
			// 	case 'snowscape':
			// 		pokemon.setType(['Ice', 'Dark']);
			// 		break;
			// 	default:
			// 		// pokemon.setType(['Normal', 'Dark']);
			// 		pokemon.setType(pokemon.baseSpecies.types);
			// }

			let types;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				types = ['Fire, Dark'];
				break;
			case 'raindance':
			case 'primordialsea': 
				types = ['Water, Dark'];
				break;
			case 'sandstorm':
				types = ['Rock, Dark'];
				break;
			case 'hail':
			case 'snowscape':
				types = ['Ice, Dark'];
				break;
			default:
				types = pokemon.baseSpecies.types;
			}
			const oldTypes = pokemon.getTypes();
			if (oldTypes.join() === types.join() || !pokemon.setType(types)) return;
			if (pokemon.effectiveWeather() || pokemon.transformed) {
				this.add('-start', pokemon, 'typechange', types.join('/'), '[from] ability: Four Seasons');
				if (!pokemon.effectiveWeather()) this.hint("Transform Mimicry changes you to your original un-transformed types.");
			} else {
				this.add('-activate', pokemon, 'ability: Four Seasons');
				this.add('-end', pokemon, 'typechange', '[silent]');
			}
		},
		flags: {failroleplay: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1},
		name: "Four Seasons",
		shortDesc: "Okina Matara's primary typing changes to match the weather.",
	},
	heavystone: {
		onStart(source) {
			this.add('-activate', source, 'ability: Heavy Stone');
			this.field.addPseudoWeather('gravity');
		},
		flags: {},
		name: "Heavy Stone",
		shortDesc: "On switch-in, sets Gravity for 5 turns.",
	},
	marchingorders: {
		onAllyAfterMove(ally) {
			if (!ally.lastMove || ally.lastMove.priority > 0) return;
			const pokemon = this.effectState.target;
			if (!pokemon) return;
			const action = this.queue.willMove(pokemon);
			if (action) {
				this.add('-activate', pokemon, 'ability: Marching Orders');
				this.queue.prioritizeAction(action);
			} else {
				return;
			}
		},
		flags: {},
		name: "Marching Orders",
		shortDesc: "The Pokémon takes its turn immediately after an ally attacks, excludes priority moves.",
	},
	blacksmoke: {
		onAnyTryBoost(boost, target, source, effect) {
			if (target === this.effectState.target || !target.runStatusImmunity('powder')) return;
			let showMsg = false;
			let i: BoostID;
			for (i in boost) {
				if (boost[i]! > 0) {
					delete boost[i];
					showMsg = true;
				}
			}
			if (showMsg && !(effect as ActiveMove).secondaries && effect.id !== 'octolock') {
				this.add("-fail", target, "boost", "[from] ability: Black Smoke", `[of] ${this.effectState.target}`);
			}
		},
		flags: {},
		name: "Black Smoke",
		shortDesc: "Other Pokémon on the field cannot have their stats increased unless immune to Powder.",
	},
	property: {
		onTakeItem(item, pokemon, source) {
			if (!this.activeMove) throw new Error("Battle.activeMove is null");
			if (!pokemon.hp || pokemon.item === 'stickybarb') return;
			if ((source && source !== pokemon) || this.activeMove.id === 'knockoff') {
				this.add('-activate', pokemon, 'ability: Property');
				return false;
			}
		},
		flags: {breakable: 1},
		name: "Property",
		shortDesc: "Prevents the Pokémon's item from being removed.",
	},
	dragoneater: {
		onBasePower(basePower, attacker, defender, move) {
			if (defender.hasType('Dragon')) {
				return this.chainModify(1.5);
			}
		},
		flags: {},
		name: "Dragon Eater",
		shortDesc: "Attacks deal 1.5x damage against Dragon-Types.",
	},
	bloodsucker: {
		onAfterMoveSecondarySelf(pokemon, target, move) {
			if (move.flags['contact'] && (!target || target.fainted || target.hp <= 0)) pokemon.heal(pokemon.baseMaxhp / 3);
		},
		flags: {},
		name: "Bloodsucker",
		shortDesc: "KO-ing an opponent with a contact move heals 33%.",
	},
	void: {
		onSwitchIn(pokemon) {
			for (const foe of pokemon.foes()) {
				if (!foe.getAbility().flags['cantsuppress']) foe.addVolatile('gastroacid');
			}
		},
		flags: {},
		name: "Void",
		shortDesc: "On switch-in, opponent's abilities are suppressed.",
	},
	cactusdrive: {
		//this is just copied from Quark with the word changed to cactus
		onStart(pokemon) {
			this.singleEvent('TerrainChange', this.effect, this.effectState, pokemon);
		},
		onTerrainChange(pokemon) {
			if (this.field.isTerrain('grassyterrain')) {
				pokemon.addVolatile('cactusdrive');
			} else if (!pokemon.volatiles['cactusdrive']?.fromBooster) {
				pokemon.removeVolatile('cactusdrive');
			}
		},
		onEnd(pokemon) {
			delete pokemon.volatiles['cactusdrive'];
			this.add('-end', pokemon, 'Cactus Drive', '[silent]');
		},
		condition: {
			noCopy: true,
			onStart(pokemon, source, effect) {
				if (effect?.name === 'Booster Energy') {
					this.effectState.fromBooster = true;
					this.add('-activate', pokemon, 'ability: Cactus Drive', '[fromitem]');
				} else {
					this.add('-activate', pokemon, 'ability: Cactus Drive');
				}
				this.effectState.bestStat = pokemon.getBestStat(false, true);
				this.add('-start', pokemon, 'cactusdrive' + this.effectState.bestStat);
			},
			onModifyAtkPriority: 5,
			onModifyAtk(atk, pokemon) {
				if (this.effectState.bestStat !== 'atk' || pokemon.ignoringAbility()) return;
				this.debug('Cactus Drive atk boost');
				return this.chainModify([5325, 4096]);
			},
			onModifyDefPriority: 6,
			onModifyDef(def, pokemon) {
				if (this.effectState.bestStat !== 'def' || pokemon.ignoringAbility()) return;
				this.debug('Cactus Drive def boost');
				return this.chainModify([5325, 4096]);
			},
			onModifySpAPriority: 5,
			onModifySpA(spa, pokemon) {
				if (this.effectState.bestStat !== 'spa' || pokemon.ignoringAbility()) return;
				this.debug('Cactus Drive spa boost');
				return this.chainModify([5325, 4096]);
			},
			onModifySpDPriority: 6,
			onModifySpD(spd, pokemon) {
				if (this.effectState.bestStat !== 'spd' || pokemon.ignoringAbility()) return;
				this.debug('Cactus Drive spd boost');
				return this.chainModify([5325, 4096]);
			},
			onModifySpe(spe, pokemon) {
				if (this.effectState.bestStat !== 'spe' || pokemon.ignoringAbility()) return;
				this.debug('Cactus Drive spe boost');
				return this.chainModify(1.5);
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'cactusdriveatk', '[silent]');
				this.add('-end', pokemon, 'cactusdrivedef', '[silent]');
				this.add('-end', pokemon, 'cactusdrivespa', '[silent]');
				this.add('-end', pokemon, 'cactusdrivespd', '[silent]');
				this.add('-end', pokemon, 'cactusdrivespe', '[silent]');
			},
		},
		flags: {failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1},
		name: "Cactus Drive",
		shortDesc: "Grassy Terrain active or Booster Energy used: highest stat is 1.3x, or 1.5x if Speed.",
	},
};
