export const Items: import('../../../sim/dex-items').ModdedItemDataTable = {
	adamantorb: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move && user.species.name === 'Dialga' && (move.type === 'Steel' || move.type === 'Dragon')) {
				return this.chainModify(1.2);
			}
		},
	},
	bigroot: {
		inherit: true,
		onTryHeal(damage, defender, attacker, effect) {
			const heals = ['drain', 'leechseed', 'ingrain', 'aquaring'];
			if (heals.includes(effect.id)) {
				return Math.floor(damage * 1.3);
			}
		},
	},
	blacksludge: {
		inherit: true,
		onResidualOrder: 10,
		onResidualSubOrder: 4,
	},
	brightpowder: {
		inherit: true,
		onModifyAccuracyPriority: 5,
		onModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			this.debug('brightpowder - decreasing accuracy');
			return accuracy * 0.9;
		},
	},
	choiceband: {
		inherit: true,
		onStart: undefined, // no inherit
		onModifyMove: undefined, // no inherit
		onAfterMove(pokemon) {
			pokemon.addVolatile('choicelock');
		},
	},
	choicescarf: {
		inherit: true,
		onStart: undefined, // no inherit
		onModifyMove: undefined, // no inherit
		onAfterMove(pokemon) {
			pokemon.addVolatile('choicelock');
		},
	},
	choicespecs: {
		inherit: true,
		onStart: undefined, // no inherit
		onModifyMove: undefined, // no inherit
		onAfterMove(pokemon) {
			pokemon.addVolatile('choicelock');
		},
	},
	chopleberry: {
		inherit: true,
		onSourceModifyDamage(damage, attacker, defender, move) {
			if (move.causedCrashDamage) return damage;
			if (move.type === 'Fighting' && defender.getMoveHitData(move).typeMod > 0) {
				const hitSub = defender.volatiles['substitute'] && !move.flags['bypasssub'];
				if (hitSub) return;

				if (defender.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', defender, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	custapberry: {
		inherit: true,
		onFractionalPriority: undefined, // no inherit
		onBeforeTurn(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && pokemon.ability === 'gluttony')) {
				const action = this.queue.willMove(pokemon);
				if (!action) return;
				const otherAction = this.queue.list.find(a => a.choice === 'move' && a.move && a.pokemon !== pokemon);
				if (!otherAction) return;
				this.queue.insertChoice({
					choice: 'event',
					event: 'Custap',
					priority: action.priority + 0.1,
					pokemon: action.pokemon,
					move: action.move,
					targetLoc: action.targetLoc,
				});
			}
		},
		onCustap(pokemon) {
			const action = this.queue.willMove(pokemon);
			this.debug(`custap action: ${action?.moveid as DebugOutput}`);
			if (action && pokemon.eatItem()) {
				this.queue.cancelAction(pokemon);
				this.add('-activate', pokemon, 'item: Custap Berry', '[consumed]');
				this.runAction(action);
			}
		},
	},
	deepseascale: {
		inherit: true,
		onModifySpD(spd, pokemon) {
			if (pokemon.species.name === 'Clamperl') {
				return this.chainModify(2);
			}
		},
	},
	deepseatooth: {
		inherit: true,
		onModifySpA(spa, pokemon) {
			if (pokemon.species.name === 'Clamperl') {
				return this.chainModify(2);
			}
		},
	},
	dracoplate: {
		inherit: true,
		onTakeItem: true,
	},
	dreadplate: {
		inherit: true,
		onTakeItem: true,
	},
	earthplate: {
		inherit: true,
		onTakeItem: true,
	},
	fastball: {
		inherit: true,
		isNonstandard: null,
	},
	fistplate: {
		inherit: true,
		onTakeItem: true,
	},
	flameorb: {
		inherit: true,
		onResidualOrder: 10,
		onResidualSubOrder: 20,
	},
	flameplate: {
		inherit: true,
		onTakeItem: true,
	},
	focussash: {
		inherit: true,
		onDamage: undefined, // no inherit
		onTryHit(defender, attacker, move) {
			if (defender !== attacker && defender.hp === defender.maxhp) {
				defender.addVolatile('focussash');
			}
		},
		condition: {
			duration: 1,
			onDamage(damage, defender, attacker, effect) {
				if (effect?.effectType === 'Move' && damage >= defender.hp) {
					this.effectState.activated = true;
					return defender.hp - 1;
				}
			},
			onAfterMoveSecondary(defender) {
				if (this.effectState.activated) defender.useItem();
				defender.removeVolatile('focussash');
			},
		},
	},
	fullincense: {
		inherit: true,
		onFractionalPriorityPriority: 1,
		onFractionalPriority: -0.2,
	},
	griseousorb: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (user.species.num === 487 && (move.type === 'Ghost' || move.type === 'Dragon')) {
				return this.chainModify(1.2);
			}
		},
		onTakeItem: false,
		onSetAbility: false,
	},
	heavyball: {
		inherit: true,
		isNonstandard: null,
	},
	icicleplate: {
		inherit: true,
		onTakeItem: true,
	},
	insectplate: {
		inherit: true,
		onTakeItem: true,
	},
	ironball: {
		inherit: true,
		onEffectiveness: undefined, // no inherit
	},
	ironplate: {
		inherit: true,
		onTakeItem: true,
	},
	kingsrock: {
		inherit: true,
		onModifyMove(move) {
			const affectedByKingsRock = [
				'aerialace', 'aeroblast', 'aircutter', 'airslash', 'aquajet', 'aquatail', 'armthrust', 'assurance', 'attackorder', 'aurasphere', 'avalanche', 'barrage', 'beatup', 'bide', 'bind', 'blastburn', 'bonerush', 'bonemerang', 'bounce', 'bravebird', 'brickbreak', 'brine', 'bugbite', 'bulletpunch', 'bulletseed', 'chargebeam', 'clamp', 'closecombat', 'cometpunch', 'crabhammer', 'crosschop', 'crosspoison', 'crushgrip', 'cut', 'darkpulse', 'dig', 'discharge', 'dive', 'doublehit', 'doublekick', 'doubleslap', 'doubleedge', 'dracometeor', 'dragonbreath', 'dragonclaw', 'dragonpulse', 'dragonrage', 'dragonrush', 'drainpunch', 'drillpeck', 'earthpower', 'earthquake', 'eggbomb', 'endeavor', 'eruption', 'explosion', 'extremespeed', 'falseswipe', 'feintattack', 'firefang', 'firespin', 'flail', 'flashcannon', 'fly', 'forcepalm', 'frenzyplant', 'frustration', 'furyattack', 'furycutter', 'furyswipes', 'gigaimpact', 'grassknot', 'gunkshot', 'gust', 'gyroball', 'hammerarm', 'headsmash', 'hiddenpower', 'highjumpkick', 'hornattack', 'hydrocannon', 'hydropump', 'hyperbeam', 'iceball', 'icefang', 'iceshard', 'iciclespear', 'ironhead', 'judgment', 'jumpkick', 'karatechop', 'lastresort', 'lavaplume', 'leafblade', 'leafstorm', 'lowkick', 'machpunch', 'magicalleaf', 'magmastorm', 'magnetbomb', 'magnitude', 'megakick', 'megapunch', 'megahorn', 'meteormash', 'mirrorshot', 'mudbomb', 'mudshot', 'muddywater', 'nightshade', 'nightslash', 'ominouswind', 'outrage', 'overheat', 'payday', 'payback', 'peck', 'petaldance', 'pinmissile', 'pluck', 'poisonjab', 'poisontail', 'pound', 'powergem', 'powerwhip', 'psychoboost', 'psychocut', 'psywave', 'punishment', 'quickattack', 'rage', 'rapidspin', 'razorleaf', 'razorwind', 'return', 'revenge', 'reversal', 'roaroftime', 'rockblast', 'rockclimb', 'rockthrow', 'rockwrecker', 'rollingkick', 'rollout', 'sandtomb', 'scratch', 'seedbomb', 'seedflare', 'seismictoss', 'selfdestruct', 'shadowclaw', 'shadowforce', 'shadowpunch', 'shadowsneak', 'shockwave', 'signalbeam', 'silverwind', 'skullbash', 'skyattack', 'skyuppercut', 'slam', 'slash', 'snore', 'solarbeam', 'sonicboom', 'spacialrend', 'spikecannon', 'spitup', 'steelwing', 'stoneedge', 'strength', 'struggle', 'submission', 'suckerpunch', 'surf', 'swift', 'tackle', 'takedown', 'thrash', 'thunderfang', 'triplekick', 'trumpcard', 'twister', 'uturn', 'uproar', 'vacuumwave', 'visegrip', 'vinewhip', 'vitalthrow', 'volttackle', 'wakeupslap', 'watergun', 'waterpulse', 'waterfall', 'weatherball', 'whirlpool', 'wingattack', 'woodhammer', 'wrap', 'wringout', 'xscissor', 'zenheadbutt',
			];
			if (affectedByKingsRock.includes(move.id)) {
				if (!move.secondaries) move.secondaries = [];
				move.secondaries.push({
					chance: 10,
					volatileStatus: 'flinch',
				});
			}
		},
	},
	laggingtail: {
		inherit: true,
		onFractionalPriorityPriority: 1,
		onFractionalPriority: -0.2,
	},
	laxincense: {
		inherit: true,
		onModifyAccuracyPriority: 5,
		onModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			this.debug('lax incense - decreasing accuracy');
			return accuracy * 0.9;
		},
	},
	leftovers: {
		inherit: true,
		onResidualOrder: 10,
		onResidualSubOrder: 4,
	},
	levelball: {
		inherit: true,
		isNonstandard: null,
	},
	lifeorb: {
		inherit: true,
		onModifyDamage: undefined, // no inherit
		onAfterMoveSecondarySelf: undefined, // no inherit
		onBasePower(basePower, user, defender) {
			if (!defender.volatiles['substitute']) {
				user.addVolatile('lifeorb');
			}
			return basePower;
		},
		onModifyDamagePhase2(damage, attacker, defender, move) {
			if (!move.flags['futuremove']) return damage * 1.3;
		},
		condition: {
			duration: 1,
			onAfterMoveSecondarySelf(attacker, defender, move) {
				if (move?.effectType === 'Move' && attacker?.volatiles['lifeorb']) {
					this.damage(attacker.baseMaxhp / 10, attacker, attacker, this.dex.items.get('lifeorb'));
					attacker.removeVolatile('lifeorb');
				}
			},
		},
	},
	lightball: {
		inherit: true,
		onModifyAtk: undefined, // no inherit
		onModifySpA: undefined, // no inherit
		onBasePower(basePower, pokemon) {
			if (pokemon.species.name === 'Pikachu') {
				return this.chainModify(2);
			}
		},
	},
	loveball: {
		inherit: true,
		isNonstandard: null,
	},
	luckypunch: {
		inherit: true,
		onModifyCritRatio(critRatio, user) {
			if (user.species.name === 'Chansey') {
				return critRatio + 2;
			}
		},
	},
	lureball: {
		inherit: true,
		isNonstandard: null,
	},
	lustrousorb: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move && user.species.name === 'Palkia' && (move.type === 'Water' || move.type === 'Dragon')) {
				return this.chainModify(1.2);
			}
		},
	},
	meadowplate: {
		inherit: true,
		onTakeItem: true,
	},
	mentalherb: {
		inherit: true,
		fling: {
			basePower: 10,
			effect(pokemon) {
				if (pokemon.removeVolatile('attract')) {
					this.add('-end', pokemon, 'move: Attract', '[from] item: Mental Herb');
				}
			},
		},
		onUpdate(pokemon) {
			if (pokemon.volatiles['attract'] && pokemon.useItem()) {
				pokemon.removeVolatile('attract');
				this.add('-end', pokemon, 'move: Attract', '[from] item: Mental Herb');
			}
		},
	},
	metronome: {
		inherit: true,
		condition: {
			inherit: true,
			onTryMove(pokemon, defender, move) {
				if (!pokemon.hasItem('metronome')) {
					pokemon.removeVolatile('metronome');
					return;
				}
				if (this.effectState.lastMove === move.id && pokemon.moveLastTurnResult) {
					this.effectState.numConsecutive++;
				} else {
					this.effectState.numConsecutive = 0;
				}
				this.effectState.lastMove = move.id;
			},
			onModifyDamage: undefined, // no inherit
			onModifyDamagePhase2(damage, attacker, defender, move) {
				return damage * (1 + (this.effectState.numConsecutive / 10));
			},
		},
	},
	micleberry: {
		inherit: true,
		condition: {
			inherit: true,
			onSourceModifyAccuracyPriority: 3,
			onSourceModifyAccuracy(accuracy, defender, attacker) {
				this.add('-enditem', attacker, 'Micle Berry');
				attacker.removeVolatile('micleberry');
				if (typeof accuracy === 'number') {
					return accuracy * 1.2;
				}
			},
		},
	},
	mindplate: {
		inherit: true,
		onTakeItem: true,
	},
	moonball: {
		inherit: true,
		isNonstandard: null,
	},
	quickclaw: {
		inherit: true,
		onFractionalPriority: undefined, // no inherit
		onBeforeTurn(pokemon) {
			if (this.randomChance(1, 5)) {
				const action = this.queue.willMove(pokemon);
				if (!action) return;
				const otherAction = this.queue.list.find(a => a.choice === 'move' && a.move && a.pokemon !== pokemon);
				if (!otherAction) return;
				this.queue.insertChoice({
					choice: 'event',
					event: 'Custap',
					priority: action.priority + 0.1,
					pokemon: action.pokemon,
					move: action.move,
					targetLoc: action.targetLoc,
				});
			}
		},
		onCustap(pokemon) {
			const action = this.queue.willMove(pokemon);
			if (action) {
				this.queue.cancelAction(pokemon);
				this.add('-activate', pokemon, 'item: Quick Claw');
				this.runAction(action);
			}
		},
	},
	quickpowder: {
		inherit: true,
		onModifySpe(spe, pokemon) {
			if (pokemon.species.name === 'Ditto') {
				return this.chainModify(2);
			}
		},
	},
	razorfang: {
		inherit: true,
		onModifyMove(move) {
			const affectedByRazorFang = [
				'aerialace', 'aeroblast', 'aircutter', 'airslash', 'aquajet', 'aquatail', 'armthrust', 'assurance', 'attackorder', 'aurasphere', 'avalanche', 'barrage', 'beatup', 'bide', 'bind', 'blastburn', 'bonerush', 'bonemerang', 'bounce', 'bravebird', 'brickbreak', 'brine', 'bugbite', 'bulletpunch', 'bulletseed', 'chargebeam', 'clamp', 'closecombat', 'cometpunch', 'crabhammer', 'crosschop', 'crosspoison', 'crushgrip', 'cut', 'darkpulse', 'dig', 'discharge', 'dive', 'doublehit', 'doublekick', 'doubleslap', 'doubleedge', 'dracometeor', 'dragonbreath', 'dragonclaw', 'dragonpulse', 'dragonrage', 'dragonrush', 'drainpunch', 'drillpeck', 'earthpower', 'earthquake', 'eggbomb', 'endeavor', 'eruption', 'explosion', 'extremespeed', 'falseswipe', 'feintattack', 'firefang', 'firespin', 'flail', 'flashcannon', 'fly', 'forcepalm', 'frenzyplant', 'frustration', 'furyattack', 'furycutter', 'furyswipes', 'gigaimpact', 'grassknot', 'gunkshot', 'gust', 'gyroball', 'hammerarm', 'headsmash', 'hiddenpower', 'highjumpkick', 'hornattack', 'hydrocannon', 'hydropump', 'hyperbeam', 'iceball', 'icefang', 'iceshard', 'iciclespear', 'ironhead', 'judgment', 'jumpkick', 'karatechop', 'lastresort', 'lavaplume', 'leafblade', 'leafstorm', 'lowkick', 'machpunch', 'magicalleaf', 'magmastorm', 'magnetbomb', 'magnitude', 'megakick', 'megapunch', 'megahorn', 'meteormash', 'mirrorshot', 'mudbomb', 'mudshot', 'muddywater', 'nightshade', 'nightslash', 'ominouswind', 'outrage', 'overheat', 'payday', 'payback', 'peck', 'petaldance', 'pinmissile', 'pluck', 'poisonjab', 'poisontail', 'pound', 'powergem', 'powerwhip', 'psychoboost', 'psychocut', 'psywave', 'punishment', 'quickattack', 'rage', 'rapidspin', 'razorleaf', 'razorwind', 'return', 'revenge', 'reversal', 'roaroftime', 'rockblast', 'rockclimb', 'rockthrow', 'rockwrecker', 'rollingkick', 'rollout', 'sandtomb', 'scratch', 'seedbomb', 'seedflare', 'seismictoss', 'selfdestruct', 'shadowclaw', 'shadowforce', 'shadowpunch', 'shadowsneak', 'shockwave', 'signalbeam', 'silverwind', 'skullbash', 'skyattack', 'skyuppercut', 'slam', 'slash', 'snore', 'solarbeam', 'sonicboom', 'spacialrend', 'spikecannon', 'spitup', 'steelwing', 'stoneedge', 'strength', 'struggle', 'submission', 'suckerpunch', 'surf', 'swift', 'tackle', 'takedown', 'thrash', 'thunderfang', 'triplekick', 'trumpcard', 'twister', 'uturn', 'uproar', 'vacuumwave', 'visegrip', 'vinewhip', 'vitalthrow', 'volttackle', 'wakeupslap', 'watergun', 'waterpulse', 'waterfall', 'weatherball', 'whirlpool', 'wingattack', 'woodhammer', 'wrap', 'wringout', 'xscissor', 'zenheadbutt',
			];
			if (affectedByRazorFang.includes(move.id)) {
				if (!move.secondaries) move.secondaries = [];
				move.secondaries.push({
					chance: 10,
					volatileStatus: 'flinch',
				});
			}
		},
	},
	skyplate: {
		inherit: true,
		onTakeItem: true,
	},
	splashplate: {
		inherit: true,
		onTakeItem: true,
	},
	spookyplate: {
		inherit: true,
		onTakeItem: true,
	},
	sportball: {
		inherit: true,
		isNonstandard: null,
	},
	stick: {
		inherit: true,
		onModifyCritRatio(critRatio, user) {
			if (user.species.id === 'farfetchd') {
				return critRatio + 2;
			}
		},
	},
	stickybarb: {
		inherit: true,
		onResidualOrder: 10,
		onResidualSubOrder: 20,
	},
	stoneplate: {
		inherit: true,
		onTakeItem: true,
	},
	thickclub: {
		inherit: true,
		onModifyAtk(atk, pokemon) {
			if (pokemon.species.name === 'Cubone' || pokemon.species.name === 'Marowak') {
				return this.chainModify(2);
			}
		},
	},
	toxicorb: {
		inherit: true,
		onResidualOrder: 10,
		onResidualSubOrder: 20,
	},
	toxicplate: {
		inherit: true,
		onTakeItem: true,
	},
	whiteherb: {
		inherit: true,
		onAnySwitchInPriority: undefined, // no inherit
	},
	widelens: {
		inherit: true,
		onSourceModifyAccuracyPriority: 4,
		onSourceModifyAccuracy(accuracy) {
			if (typeof accuracy === 'number') {
				return accuracy * 1.1;
			}
		},
	},
	zapplate: {
		inherit: true,
		onTakeItem: true,
	},
	zoomlens: {
		inherit: true,
		onSourceModifyAccuracyPriority: 4,
		onSourceModifyAccuracy(accuracy, defender) {
			if (typeof accuracy === 'number' && !this.queue.willMove(defender)) {
				this.debug('Zoom Lens boosting accuracy');
				return accuracy * 1.2;
			}
		},
	},
};
