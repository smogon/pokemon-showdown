export const Conditions: {[k: string]: ConditionData} = {
	par: {
		name: 'par',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.id === 'paraorb') {
				this.add('-status', target, 'par', '[from] item: Para Orb');
			}else if (sourceEffect && sourceEffect.effectType === 'Ability') {
				this.add('-status', target, 'par', '[from] ability: ' + sourceEffect.name, '[of] ' + source);
			} else {
				this.add('-status', target, 'par');
			}
		},
		onModifySpe(spe, pokemon) {
			if (!pokemon.hasAbility('quickfeet')) {
				return this.chainModify(0.5);
			}
		},
	},
	frz: {
		name: 'frz',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.effectType === 'Ability') {
				this.add('-status', target, 'frz', '[from] ability: ' + sourceEffect.name, '[of] ' + source);
			} else {
				this.add('-status', target, 'frz');
			}
			if (target.species.name === 'Shaymin-Sky' && target.baseSpecies.baseSpecies === 'Shaymin') {
				target.formeChange('Shaymin', this.effect, true);
			}
		},
		onModifyMove(move, pokemon) {
			if (move.flags['defrost']) {
				this.add('-curestatus', pokemon, 'frz', '[from] move: ' + move);
				pokemon.setStatus('');
			}
		},
		onModifyDefPriority: 4,
		onModifyDef(def, pokemon){
			if (!pokemon.hasAbility('marvelscale')) {
				return this.chainModify(0.67);
			}
		},
		onModifySpDPriority: 4,
		onModifySpD(spd, pokemon){
			if (!pokemon.hasAbility('marvelscale')) {
				return this.chainModify(0.67);
			}
		},
		onHit(target, source, move) {
			if (move.thawsTarget || move.type === 'Fire' && move.category !== 'Status') {
				target.cureStatus();
			}
		},
	},
	everlastingwinter: {
		name: 'EverlastingWinter',
		effectType: 'Weather',
		duration: 0,
		onModifyDefPriority: 10,
		onModifyDef(def, pokemon) {
			if (pokemon.hasType('Ice') && this.field.isWeather('everlastingwinter')) {
				return this.modify(def, 1.5);
			}
		},
		onFieldStart(field, source, effect) {
			this.add('-weather', 'EverlastingWinter', '[from] ability: ' + effect.name, '[of] ' + source);
		},
		onImmunity(type, pokemon) {
			if (pokemon.hasItem('utilityumbrella')) return;
			if (type === 'frz') return false;
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-weather', 'EverlastingWinter', '[upkeep]');
			this.eachEvent('Weather');
		},
		onWeather(target) {
			if (!target.hasType('Ice')) this.damage(target.baseMaxhp / 16);
		},
		onFieldEnd() {
			this.add('-weather', 'none');
		},
	},
	endlessdream: { 
		name: "Endless Dream",
		effectType: 'PseudoWeather',
		duration: 0,
		onFieldStart(field, source, effect) {
			this.add('-pseudoweather', 'EndlessDream', '[of] ' + source);
		},
		onSetStatus(status, target, source, effect) {
			if (target.hasAbility('vitalspirit') || target.hasAbility('insomnia')) return;
			if ((effect as Move)?.status || effect?.id === 'yawn') {
				this.add('-fail', target, '[from] Endless Dream');
			}
			return false;
		},
		onResidualOrder: 23,
		onEnd() {
			this.add('-fieldend', 'none');
		},
	},
};