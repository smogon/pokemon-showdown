export const Scripts: ModdedBattleScriptsData = {
	gen: 9,
	init() {
		for (const i in this.data.Moves) {
			if (this.data.Moves[i].pp > 20) {
				this.modData('Moves', i).pp = 20;
			}
		}
	},
	statModify(baseStats, set, statName) {
		const tr = this.trunc;
		let stat = baseStats[statName];
		const evs = set.evs[statName] ? 4 + 8 * (set.evs[statName] - 1) : 0;
		if (statName === 'hp') {
			return tr(tr(2 * stat + set.ivs[statName] + tr(evs / 4) + 100) * set.level / 100 + 10);
		}
		stat = tr(tr(2 * stat + set.ivs[statName] + tr(evs / 4)) * set.level / 100 + 5);
		const nature = this.dex.natures.get(set.nature);
		// Natures are calculated with 16-bit truncation.
		// This only affects Eternatus-Eternamax in Pure Hackmons.
		if (nature.plus === statName) {
			stat = this.ruleTable.has('overflowstatmod') ? Math.min(stat, 595) : stat;
			stat = tr(tr(stat * 110, 16) / 100);
		} else if (nature.minus === statName) {
			stat = this.ruleTable.has('overflowstatmod') ? Math.min(stat, 728) : stat;
			stat = tr(tr(stat * 90, 16) / 100);
		}
		return stat;
	},
	calculatePP(move, ppUps) {
		return move.noPPBoosts ? move.pp : (move.pp / 5 + 1) * 4;
	},
	checkMoveBreaksProtect(move, attacker, defender, blockStatus = true) {
		if (move.flags['protect'] && (move.category !== 'Status' || blockStatus)) {
			return false;
		}
		if ((move.isZOrMaxPowered || attacker.hasAbility(['piercingdrill', 'unseenfist'])) &&
			!['gmaxoneblow', 'gmaxrapidflow'].includes(move.id)) {
			defender.getMoveHitData(move).brokeProtect = true;
		}
		return true;
	},
	pokemon: {
		// Disable Fake Out if the user has already acted since switching in
		getMoves(lockedMove, restrictData) {
			if (lockedMove) {
				lockedMove = toID(lockedMove);
				if (lockedMove === 'recharge') {
					return [{
						move: 'Recharge',
						id: 'recharge' as ID,
					}];
				}
				for (const moveSlot of this.moveSlots) {
					if (moveSlot.id !== lockedMove) continue;
					return [{
						move: moveSlot.move,
						id: moveSlot.id,
					}];
				}
				// does this happen?
				return [{
					move: this.battle.dex.moves.get(lockedMove).name,
					id: lockedMove,
				}];
			}
			const moves = [];
			let hasValidMove = false;
			for (const moveSlot of this.moveSlots) {
				let moveName = moveSlot.move;
				if (moveSlot.id === 'hiddenpower') {
					moveName = `Hidden Power ${this.hpType}`;
					if (this.battle.gen < 6) moveName += ` ${this.hpPower}`;
				} else if (moveSlot.id === 'return' || moveSlot.id === 'frustration') {
					const basePowerCallback = this.battle.dex.moves.get(moveSlot.id).basePowerCallback as (pokemon: Pokemon) => number;
					moveName += ` ${basePowerCallback(this)}`;
				}
				let target = moveSlot.target;
				switch (moveSlot.id) {
				case 'curse':
					if (!this.hasType('Ghost')) {
						target = this.battle.dex.moves.get('curse').nonGhostTarget;
					}
					break;
				case 'pollenpuff':
					// Heal Block only prevents Pollen Puff from targeting an ally when the user has Heal Block
					if (this.volatiles['healblock']) {
						target = 'adjacentFoe';
					}
					break;
				case 'terastarstorm':
					if (this.species.name === 'Terapagos-Stellar') {
						target = 'allAdjacentFoes';
					}
					break;
				}
				let disabled = moveSlot.disabled;
				if (this.volatiles['dynamax']) {
					// if each of a Pokemon's base moves are disabled by one of these effects, it will Struggle
					const canCauseStruggle = ['Encore', 'Disable', 'Taunt', 'Assault Vest', 'Belch', 'Stuff Cheeks'];
					disabled = this.maxMoveDisabled(moveSlot.id) || disabled && canCauseStruggle.includes(moveSlot.disabledSource!);
				} else if (moveSlot.pp <= 0 || (moveSlot.id === 'fakeout' && this.activeMoveActions > 0)) {
					disabled = true;
				}

				if (disabled === 'hidden') {
					disabled = !restrictData;
				}
				if (!disabled) {
					hasValidMove = true;
				}

				moves.push({
					move: moveName,
					id: moveSlot.id,
					pp: moveSlot.pp,
					maxpp: moveSlot.maxpp,
					target,
					disabled,
				});
			}
			return hasValidMove ? moves : [];
		},
	},
	actions: {
		// Announce 4x and 0.25x effectiveness
		modifyDamage(baseDamage, pokemon, target, move, suppressMessages) {
			const tr = this.battle.trunc;
			if (!move.type) move.type = '???';
			const type = move.type;

			baseDamage += 2;

			if (move.spreadHit) {
				// multi-target modifier (doubles only)
				const spreadModifier = this.battle.gameType === 'freeforall' ? 0.5 : 0.75;
				this.battle.debug(`Spread modifier: ${spreadModifier}`);
				baseDamage = this.battle.modify(baseDamage, spreadModifier);
			} else if (move.multihitType === 'parentalbond' && move.hit > 1) {
				// Parental Bond modifier
				const bondModifier = this.battle.gen > 6 ? 0.25 : 0.5;
				this.battle.debug(`Parental Bond modifier: ${bondModifier}`);
				baseDamage = this.battle.modify(baseDamage, bondModifier);
			}

			// weather modifier
			baseDamage = this.battle.runEvent('WeatherModifyDamage', pokemon, target, move, baseDamage);

			// crit - not a modifier
			const isCrit = target.getMoveHitData(move).crit;
			if (isCrit) {
				baseDamage = tr(baseDamage * (move.critModifier || (this.battle.gen >= 6 ? 1.5 : 2)));
			}

			// random factor - also not a modifier
			baseDamage = this.battle.randomizer(baseDamage);

			// STAB
			// The "???" type never gets STAB
			// Not even if you Roost in Gen 4 and somehow manage to use
			// Struggle in the same turn.
			// (On second thought, it might be easier to get a MissingNo.)
			if (type !== '???') {
				let stab: number | [number, number] = 1;

				const isSTAB = move.forceSTAB || pokemon.hasType(type) || pokemon.getTypes(false, true).includes(type);
				if (isSTAB) {
					stab = 1.5;
				}

				// The Stellar tera type makes this incredibly confusing
				// If the move's type does not match one of the user's base types,
				// the Stellar tera type applies a one-time 1.2x damage boost for that type.
				//
				// If the move's type does match one of the user's base types,
				// then the Stellar tera type applies a one-time 2x STAB boost for that type,
				// and then goes back to using the regular 1.5x STAB boost for those types.
				if (pokemon.terastallized === 'Stellar') {
					if (!pokemon.stellarBoostedTypes.includes(type) || move.stellarBoosted) {
						stab = isSTAB ? 2 : [4915, 4096];
						move.stellarBoosted = true;
						if (pokemon.species.name !== 'Terapagos-Stellar') {
							pokemon.stellarBoostedTypes.push(type);
						}
					}
				} else {
					if (pokemon.terastallized === type && pokemon.getTypes(false, true).includes(type)) {
						stab = 2;
					}
					stab = this.battle.runEvent('ModifySTAB', pokemon, target, move, stab);
				}

				baseDamage = this.battle.modify(baseDamage, stab);
			}

			// types
			let typeMod = target.runEffectiveness(move);
			typeMod = this.battle.clampIntRange(typeMod, -6, 6);
			target.getMoveHitData(move).typeMod = typeMod;
			if (typeMod > 0) {
				if (!suppressMessages) this.battle.add('-supereffective', target, Math.min(typeMod, 2));

				for (let i = 0; i < typeMod; i++) {
					baseDamage *= 2;
				}
			}
			if (typeMod < 0) {
				if (!suppressMessages) this.battle.add('-resisted', target, Math.min(-typeMod, 2));

				for (let i = 0; i > typeMod; i--) {
					baseDamage = tr(baseDamage / 2);
				}
			}

			if (isCrit && !suppressMessages) this.battle.add('-crit', target);

			if (pokemon.status === 'brn' && move.category === 'Physical' && !pokemon.hasAbility('guts')) {
				if (this.battle.gen < 6 || move.id !== 'facade') {
					baseDamage = this.battle.modify(baseDamage, 0.5);
				}
			}

			// Generation 5, but nothing later, sets damage to 1 before the final damage modifiers
			if (this.battle.gen === 5 && !baseDamage) baseDamage = 1;

			// Final modifier. Modifiers that modify damage after min damage check, such as Life Orb.
			baseDamage = this.battle.runEvent('ModifyDamage', pokemon, target, move, baseDamage);

			if (target.getMoveHitData(move).brokeProtect) {
				baseDamage = this.battle.modify(baseDamage, 0.25);
				if (move.isZOrMaxPowered) this.battle.add('-zbroken', target);
			}

			// Generation 6-7 moves the check for minimum 1 damage after the final modifier...
			if (this.battle.gen !== 5 && !baseDamage) return 1;

			// ...but 16-bit truncation happens even later, and can truncate to 0
			return tr(baseDamage, 16);
		},
		// Run `AfterHit` events even if the source fainted
		spreadMoveHit(targets, pokemon, moveOrMoveName, hitEffect?, isSecondary?, isSelf?) {
			// Hardcoded for single-target purposes
			// (no spread moves have any kind of onTryHit handler)
			const target = targets[0];
			let damage: (number | boolean | undefined)[] = [];
			for (const i of targets.keys()) {
				damage[i] = true;
			}
			const move = this.dex.getActiveMove(moveOrMoveName);
			let hitResult: boolean | number | null = true;
			let moveData = hitEffect as ActiveMove;
			if (!moveData) moveData = move;
			if (!moveData.flags) moveData.flags = {};
			if (move.target === 'all' && !isSelf) {
				hitResult = this.battle.singleEvent('TryHitField', moveData, {}, target || null, pokemon, move);
			} else if ((move.target === 'foeSide' || move.target === 'allySide' || move.target === 'allyTeam') && !isSelf) {
				hitResult = this.battle.singleEvent('TryHitSide', moveData, {}, target || null, pokemon, move);
			} else if (target) {
				hitResult = this.battle.singleEvent('TryHit', moveData, {}, target, pokemon, move);
			}
			if (!hitResult) {
				if (hitResult === false) {
					this.battle.add('-fail', pokemon);
					this.battle.attrLastMove('[still]');
				}
				return [[false], targets]; // single-target only
			}
	
			// 0. check for substitute
			if (!isSecondary && !isSelf) {
				if (move.target !== 'all' && move.target !== 'allyTeam' && move.target !== 'allySide' && move.target !== 'foeSide') {
					damage = this.tryPrimaryHitEvent(damage, targets, pokemon, move, moveData, isSecondary);
				}
			}
	
			for (const i of targets.keys()) {
				if (damage[i] === this.battle.HIT_SUBSTITUTE) {
					damage[i] = true;
					targets[i] = null;
				}
				if (targets[i] && isSecondary && !moveData.self) {
					damage[i] = true;
				}
				if (!damage[i]) targets[i] = false;
			}
			// 1. call to this.battle.getDamage
			damage = this.getSpreadDamage(damage, targets, pokemon, move, moveData, isSecondary, isSelf);
	
			for (const i of targets.keys()) {
				if (damage[i] === false) targets[i] = false;
			}
	
			// 2. call to this.battle.spreadDamage
			damage = this.battle.spreadDamage(damage, targets, pokemon, move);
	
			for (const i of targets.keys()) {
				if (damage[i] === false) targets[i] = false;
			}
	
			// 3. onHit event happens here
			damage = this.runMoveEffects(damage, targets, pokemon, move, moveData, isSecondary, isSelf);
	
			for (const i of targets.keys()) {
				if (!damage[i] && damage[i] !== 0) targets[i] = false;
			}
	
			// steps 4 and 5 can mess with this.battle.activeTarget, which needs to be preserved for Dancer
			const activeTarget = this.battle.activeTarget;
	
			// 4. self drops (start checking for targets[i] === false here)
			if (moveData.self && !move.selfDropped) this.selfDrops(targets, pokemon, move, moveData, isSecondary);
	
			// 5. secondary effects
			if (moveData.secondaries) this.secondaries(targets, pokemon, move, moveData, isSelf);
	
			this.battle.activeTarget = activeTarget;
	
			// 6. force switch
			if (moveData.forceSwitch) damage = this.forceSwitch(damage, targets, pokemon, move);
	
			for (const i of targets.keys()) {
				if (!damage[i] && damage[i] !== 0) targets[i] = false;
			}
	
			const damagedTargets: Pokemon[] = [];
			const damagedDamage = [];
			for (const [i, t] of targets.entries()) {
				if (typeof damage[i] === 'number' && t) {
					damagedTargets.push(t);
					damagedDamage.push(damage[i]);
				}
			}
			const pokemonOriginalHP = pokemon.hp;
			if (damagedDamage.length && !isSecondary && !isSelf) {
				if (this.battle.gen >= 5) {
					this.battle.runEvent('DamagingHit', damagedTargets, pokemon, move, damagedDamage);
				}
				if (moveData.onAfterHit) {
					for (const t of damagedTargets) {
						this.battle.singleEvent('AfterHit', moveData, {}, t, pokemon, move);
					}
				}
				if (this.battle.gen < 4) {
					this.battle.runEvent('DamagingHit', damagedTargets, pokemon, move, damagedDamage);
				}
				if (pokemon.hp && pokemon.hp <= pokemon.maxhp / 2 && pokemonOriginalHP > pokemon.maxhp / 2) {
					this.battle.runEvent('EmergencyExit', pokemon);
				}
			}
	
			return [damage, targets];
		},
	},
};
