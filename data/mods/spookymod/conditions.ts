export const Conditions: import('../../../sim/dex-conditions').ModdedConditionDataTable = {
	brn: {
		inherit: true,
		duration: 10,
		onResidual(pokemon) {
			this.damage(pokemon.baseMaxhp / 12);
		},
		onModifyMove(move, pokemon) {
			if (move.type === "Water") {
				this.add('-curestatus', pokemon, 'brn', `[from] move: ${move}`);
				pokemon.clearStatus();
			}
		},
		onDamagingHit(damage, target, source, move) {
			if (move.type === 'Water' && move.category !== 'Status') {
				this.add('-curestatus', target, 'brn', `[from] move: ${move}`);
				target.cureStatus();
			}
		},
		onEnd(target) {
			this.add('-end', target, 'brn');
			target.clearStatus();
		},
	},
	psn: {
		inherit: true,
		duration: 5,
		onResidual(pokemon) {
			this.damage(pokemon.baseMaxhp / 12);
		},
		onEnd(target) {
			this.add('-end', target, 'psn');
			target.clearStatus();
		},
	},
	superjump: {
		name: 'Super Jump',
		effectType: 'Weather',
		duration: 5,
		onWeatherModifyDamage(damage, attacker, defender, move) {
			if ([
				'highjumpkick', 'jumpkick', 'axe kick', 'doublekick', 'thunderouskick', 'lowkick', 'megakick', 'triplekick',
				'tropkick', 'skyuppercut', 'stomp', 'stompingtantrum', 'bounce', 'fly', 'skyattack', 'blastjump',
			].includes(move.id)) {
				this.debug('Jump boost');
				return this.chainModify(1.5);
			}
		},
		onFieldStart(battle, source, effect) {
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectState.duration = 0;
				this.add('-weather', 'Super Jump', '[from] ability: ' + effect.name, `[of] ${source}`);
			} else {
				this.add('-weather', 'Super Jump', '-silent');
			}
		},
		onTryMovePriority: 1,
		onTryMove(attacker, defender, move) {
			if (move.type === 'Ground' && move.category !== 'Status') {
				this.debug('Super Jump suppress');
				this.add('-fail', attacker, move, '[from] Super Jump');
				this.attrLastMove('[still]');
				return null;
			}
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-weather', 'Super Jump', '[upkeep]');
			this.eachEvent('Weather');
		},
		onFieldEnd() {
			this.add('-weather', 'none');
		},
	},
	ubercharge: {
		name: 'ubercharge',
		duration: 1,
		// this is a volatile status
		onStart(target, source, sourceEffect) {
			this.add('-start', target, 'ubercharge', "[silent]");
			this.add('-message', `${target.name} was ubercharged!`);
		},
		onEnd(target) {
			this.add('-end', target, 'ubercharge', "[silent]");
			this.add('-message', `${target.name}'s ubercharge wore off!`);
		},
		onInvulnerability(target, source, move) {
			return false;
		},
	},
	jarate: {
		name: 'Jarate',
		duration: 1,
		// this is a volatile status
		onStart(target, source, sourceEffect) {
			this.add('-start', target, 'jarate', '[silent]');
			this.add('-message', `${target.name} was covered in Jarate!`);
		},
		onEnd(target) {
			this.add('-end', target, 'jarate', "[silent]");
			this.add('-message', `${target.name}'s Jarate wore off!`);
		},
		onSourceModifyDamage(damage, source, target, move) {
			this.add("-crit", target);
			return this.chainModify(1.35);
		},
	},
	flinch: {
		inherit: true,
		// flinches: true,
	},
	jumpscare: {
		name: 'jumpscare',
		// flinches: true,
		duration: 1,
		onBeforeMovePriority: 8,
		onBeforeMove(pokemon) {
			const rand = this.random(6);
			switch (rand) {
			case 0:
				this.add(`raw|<img src="https://pbs.twimg.com/media/E5tJ3LOWEAEuOx5.jpg" height="400" width="400">`);
				this.add('-message', `BOO! Did I scare you? I'm a job application 😂😂`);
				break;
			case 1:
				this.add(`raw|<img src="https://i.kym-cdn.com/photos/images/list/002/166/933/8a3.gif" height="400" width="400">`);
				break;
			case 2:
				this.add(`raw|<img src="https://i.pinimg.com/originals/68/12/4c/68124cdddd5615b4c11df6dcdbe1ff7f.gif" height="400" width="400">`);
				break;
			case 3:
				this.add(`raw|<img src="https://www.videomeme.in/wp-content/uploads/2022/12/1669720009775.jpg" height="400" width="400">`);
				this.add('-message', `Ghost, From That Game With The Ghost Guy In It (I Don't Remember What It Was Called)`);
				break;
			case 4:
				this.add(`raw|<img src="https://static.wikia.nocookie.net/slenderfortress/images/4/46/Zepheniah_Ghost.png" height="400" width="400">`);
				this.add('-message', `BOO`);
				break;
			case 5:
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/38ec8d41f26b57766acda4ab509659b7e134b4f8/data/mods/spookymod/sprites/front/talkinchu.png" height="4540" width="411">`);
				this.add('-message', `"Deez" ~ DuoM2`);
				break;
			default:
				this.add(`raw|<img src="https://steamuserimages-a.akamaihd.net/ugc/950713639436160734/A6DB24F241B8A496DED1033A4A345E05A8336DFA/?imw=637&imh=358&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true" height="400" width="400">`);
				this.hint("Connection Lost: Auto-disconnect in 24.7 seconds");
			}
			this.add('cant', pokemon, 'flinch');
			this.runEvent('Flinch', pokemon);
			return false;
		},
	},
	fakedynamax: {
		inherit: true,
		duration: 1,
		onStart(pokemon) {
			this.add('-start', pokemon, 'Dynamax', '[silent]');
			if (pokemon.species.id === 'gourgeistgigantic') {
				this.add('-message', `${pokemon.name} grew so large it exploded!`);
				this.actions.useMove('Explosion', pokemon);
			}
		},
		onEnd(pokemon) {
			this.add('-end', pokemon, 'Dynamax', '[silent]');
		},
	},
	summon: {
		// this is a slot condition
		onResidualOrder: 3,
		onResidual(target) {
			this.effectState.target = this.effectState.side.active[this.effectState.position];
			const data = this.effectState;
			const move = this.dex.moves.get(data.move);
			if (data.target.fainted || data.target === data.source) {
				this.hint(`${move.name} did not hit because the target is ${(data.fainted ? 'fainted' : 'the user')}.`);
				return;
			}
			this.add('-message', `${(data.target.illusion ? data.target.illusion.name : data.target.name)} took the ${move.name} attack!`);
			data.moveData.accuracy = true;
			data.moveData.isFutureMove = true;
			delete data.moveData.flags['protect'];
			const hitMove = new this.dex.Move(data.moveData) as ActiveMove;
			if (data.source.isActive) {
				this.add('-anim', data.source, hitMove, data.target);
			}
			this.actions.trySpreadMoveHit([data.target], data.source, hitMove);
		},
		onEnd(target) {
			this.effectState.target = this.effectState.side.active[this.effectState.position];
			const data = this.effectState;
			const move = this.dex.moves.get(data.move);
			if (data.target.fainted || data.target === data.source) {
				this.hint(`${move.name} did not hit because the target is ${(data.fainted ? 'fainted' : 'the user')}.`);
				return;
			}
			this.add('-message', `${(data.target.illusion ? data.target.illusion.name : data.target.name)} took the ${move.name} attack!`);
			data.moveData.accuracy = true;
			data.moveData.isFutureMove = true;
			delete data.moveData.flags['protect'];

			const hitMove = new this.dex.Move(data.moveData) as ActiveMove;
			if (data.source.isActive) {
				this.add('-anim', data.source, hitMove, data.target);
			}
			this.actions.trySpreadMoveHit([data.target], data.source, hitMove);
		},
	},
	shrunken: {
		name: 'Shrunken',
		duration: 1,
		// this is a volatile status
		onStart(target, source, sourceEffect) {
			this.add('-start', target, 'shrunken', '[silent]');
			this.add('-message', `${target.name} shrunk!`);
			target.formeChange(target.species.id + 'shrunken');
			if (target.species.id === 'gourgeisttinyshrunken') {
				this.add('-message', `${target.name} shrunk so small it disappeared from existence!`);
				target.faint();
			}
		},
		onEnd(target) {
			this.add('-end', target, 'shrunken', "[silent]");
			this.add('-message', `${target.name} returned to full size!`);
			target.formeChange(target.baseSpecies);
		},
	},
};
