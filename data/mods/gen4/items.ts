export const Items: {[k: string]: ModdedItemData} = {
	adamantorb: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move && user.species.name === 'Dialga' && (move.type === 'Steel' || move.type === 'Dragon')) {
				return this.chainModify(1.2);
			}
		},
	},
	bigroot: {
		inherit: true,
		onTryHeal(damage, target, source, effect) {
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
		onStart() {},
		onModifyMove() {},
		onAfterMove(pokemon) {
			pokemon.addVolatile('choicelock');
		},
	},
	choicescarf: {
		inherit: true,
		onStart() {},
		onModifyMove() {},
		onAfterMove(pokemon) {
			pokemon.addVolatile('choicelock');
		},
	},
	choicespecs: {
		inherit: true,
		onStart() {},
		onModifyMove() {},
		onAfterMove(pokemon) {
			pokemon.addVolatile('choicelock');
		},
	},
	chopleberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (move.causedCrashDamage) return damage;
			if (move.type === 'Fighting' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'];
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	custapberry: {
		inherit: true,
		onFractionalPriority() {},
		onBeforeTurn(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && pokemon.ability === 'gluttony')) {
				const action = this.queue.willMove(pokemon);
				if (!action) return;
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
			this.debug('custap action: ' + action);
			if (action && pokemon.eatItem()) {
				this.queue.cancelAction(pokemon);
				this.add('-message', "Custap Berry activated.");
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
	flameorb: {
		inherit: true,
		onResidualOrder: 10,
		onResidualSubOrder: 20,
	},
	focussash: {
		inherit: true,
		onDamage() { },
		onTryHit(target, source, move) {
			if (target !== source && target.hp === target.maxhp) {
				target.addVolatile('focussash');
			}
		},
		condition: {
			duration: 1,
			onDamage(damage, target, source, effect) {
				if (effect && effect.effectType === 'Move' && damage >= target.hp) {
					this.effectState.activated = true;
					return target.hp - 1;
				}
			},
			onAfterMoveSecondary(target) {
				if (this.effectState.activated) target.useItem();
				target.removeVolatile('focussash');
			},
		},
	},
	griseousorb: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (user.species.num === 487 && (move.type === 'Ghost' || move.type === 'Dragon')) {
				return this.chainModify(1.2);
			}
		},
	},
	ironball: {
		inherit: true,
		onEffectiveness() {},
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
	lifeorb: {
		inherit: true,
		onModifyDamage() {},
		onAfterMoveSecondarySelf() {},
		onBasePower(basePower, user, target) {
			if (!target.volatiles['substitute']) {
				user.addVolatile('lifeorb');
			}
			return basePower;
		},
		onModifyDamagePhase2(damage, source, target, move) {
			if (!move.isFutureMove) return damage * 1.3;
		},
		condition: {
			duration: 1,
			onAfterMoveSecondarySelf(source, target, move) {
				if (move && move.effectType === 'Move' && source && source.volatiles['lifeorb']) {
					this.damage(source.baseMaxhp / 10, source, source, this.dex.items.get('lifeorb'));
					source.removeVolatile('lifeorb');
				}
			},
		},
	},
	lightball: {
		inherit: true,
		onModifyAtk() {},
		onModifySpA() {},
		onBasePower(basePower, pokemon) {
			if (pokemon.species.name === 'Pikachu') {
				return this.chainModify(2);
			}
		},
	},
	luckypunch: {
		inherit: true,
		onModifyCritRatio(critRatio, user) {
			if (user.species.name === 'Chansey') {
				return critRatio + 2;
			}
		},
	},
	lustrousorb: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move && user.species.name === 'Palkia' && (move.type === 'Water' || move.type === 'Dragon')) {
				return this.chainModify(1.2);
			}
		},
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
			onStart(pokemon) {
				this.effectState.numConsecutive = 0;
				this.effectState.lastMove = '';
			},
			onTryMovePriority: -2,
			onTryMove(pokemon, target, move) {
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
			onModifyDamagePhase2(damage, source, target, move) {
				return damage * (1 + (this.effectState.numConsecutive / 10));
			},
		},
	},
	micleberry: {
		inherit: true,
		condition: {
			duration: 2,
			onSourceModifyAccuracyPriority: 3,
			onSourceModifyAccuracy(accuracy, target, source) {
				this.add('-enditem', source, 'Micle Berry');
				source.removeVolatile('micleberry');
				if (typeof accuracy === 'number') {
					return accuracy * 1.2;
				}
			},
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
	widelens: {
		inherit: true,
		onSourceModifyAccuracyPriority: 4,
		onSourceModifyAccuracy(accuracy) {
			if (typeof accuracy === 'number') {
				return accuracy * 1.1;
			}
		},
	},
	zoomlens: {
		inherit: true,
		onSourceModifyAccuracyPriority: 4,
		onSourceModifyAccuracy(accuracy, target) {
			if (typeof accuracy === 'number' && !this.queue.willMove(target)) {
				this.debug('Zoom Lens boosting accuracy');
				return accuracy * 1.2;
			}
		},
	},
};
