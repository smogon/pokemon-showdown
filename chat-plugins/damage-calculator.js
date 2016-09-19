global.MOVEDEX = require('../data/moves.js').BattleMovedex;
global.POKEDEX = require('../data/pokedex.js').BattlePokedex;
global.TYPECHART = require('../data/typechart.js').BattleTypeChart;

global.isolate = function(data) {
	return JSON.parse(JSON.stringify(data));
};

exports.commands = {
'!calc': true,
damagecalculator: 'calc',
calculator: ' calc',
calculate: 'calc',
calc: function (target, room, user, connection, cmd, message) {
      	if (!this.runBroadcast()) return;
      	if (target == 'link' || target == 'url') {
      	this.sendReplyBox(
            "Pok&eacute;mon Showdown! damage calculator. (Courtesy of Honko)<br />" +
		       	"- <a href=\"https://pokemonshowdown.com/damagecalc/\">Damage Calculator</a>"
	    	);
	    	return false;
	     	}
        var parts = target.replace(/, /g, ',', '').split(',');
        if (parts.length < 2) return this.sendReply('/calc [attacker details], [defender details], [extras - weather, critical hit etc] - To add a berry that weakens a Super Effective attack just put \"berry\" as one of the defender\'s details. For a gem just put \"gem\" for the attacker details. To change the level to level 50 add VGC at the end and to change the level to level 5 add LC at then end.');
        var attackerDetails = parts[0].split(' ');
        var defenderDetails = parts[1].split(' ');
        if (parts.length === 3) {
            var extras = parts[2].split(' ');
        }

        function checkPoke(text) {
            text = toId(text);
            if (POKEDEX[text]) {
                return true;
            }
            return false;
        }

        function checkMove(text) {
            text = toId(text);
            if (MOVEDEX[text]) {
                return true;
            }
            return false;
        }
        var attacker = {};
        var defender = {};
        attacker.bonus = [];
        defender.bonus = [];
        attacker.multiplier = 1;
        defender.multiplier = 1;
        var basePowerMultiplier = 1;
        var finalMultiplier = 1;
        for (var i = 0; i < attackerDetails.length; i++) {
            var detail = attackerDetails[i];
            if (checkMove(detail)) {
                attacker.move = toId(detail);
                continue;
            }
            if (checkPoke(detail)) {
                attacker.id = toId(detail);
                continue;
            }
            if (detail.charAt(0) === '+' || detail.charAt(0) === '-') {
                var level = parseInt(detail);
                if (!level || isNaN(level)) continue;
                attacker.boosts = level;
                continue;
            }
            if (['gem'].indexOf(toId(detail)) > -1) {
                basePowerMultiplier *= 1.3;
                continue;
            }
            if (['lo', 'lifeorb'].indexOf(toId(detail)) > -1) {
                finalMultiplier *= 1.3;
                continue;
            }
            if (toId(detail) === 'technician') {
                attacker.technician = true;
            }
            if (['band', 'specs', 'choiceband', 'choicespecs', 'guts'].indexOf(toId(detail)) > -1) {
                attacker.multiplier *= 1.5;
                continue;
            }
            if (['hugepower', 'purepower'].indexOf(toId(detail)) > -1) {
                attacker.multiplier *= 2;
                continue;
            }
            if (['plate'].indexOf(toId(detail)) > -1) {
                basePowerMultiplier *= 1.2;
                continue;
            }
            if (toId(detail) === 'expertbelt') {
                attacker.expertBelt = true;
                continue;
            }
            if (toId(detail) === 'sheerforce') {
                attacker.ability = 'sheerforce';
                continue;
            }
            if (['toughclaws'].indexOf(toId(detail)) > -1) {
                attacker.toughclaws = true;
                continue;
            }
            if (['strongjaw'].indexOf(toId(detail)) > -1) {
                attacker.strongjaw = true;
                continue;
            }
            if (['megalauncher', 'launcher'].indexOf(toId(detail)) > -1) {
                attacker.megalauncher = true;
                continue;
            }
            if (toId(detail) === 'adaptability') {
                attacker.ability = 'adaptability';
                continue;
            }
            if (['refrigerate', 'aerilate', 'aerialate', 'pixilate'].indexOf(toId(detail)) > -1) {
                if (toId(detail) === 'aerialate') detail = 'aerilate';
                attacker.specialability = toId(detail);
                continue;
            }
            if (toId(detail) === 'reckless') {
                attacker.reckless = true;
                continue;
            }
            if (/[0-9]/i.test(detail) && toId(detail.charAt(0)) === 'l') {
                level = detail.replace(/[^0-9]/g, '');
                if (!level) continue;
                attacker.level = level;
                continue;
            }
            if ((toId(detail).indexOf('evs') || (!isNaN(parseInt(details)))) && toId(detail).indexOf('iv') === -1) {
                if (['+', '-'].indexOf(detail.charAt(detail.length - 1)) > -1) {
                    attacker.nature = detail.charAt(detail.length - 1);
                }
                detail = detail.replace(/[^0-9]/g, '');
                if (!detail) continue;
                attacker.evs = detail;
            }
            if (toId(detail).indexOf('ivs') > -1) {
                detail = detail.replace(/[^0-9]/g, '');
                if (!detail) continue;
                attacker.ivs = detail;
            }
        }

        if (!attacker.id || !attacker.move) return this.errorReply('You need to include an attacking Pokemon/Move.');
        for (var i = 0; i < defenderDetails.length; i++) {
            var detail = defenderDetails[i];
            if (checkPoke(detail)) {
                defender.id = toId(detail);
                continue;
            }
            if (detail.charAt(0) === '+' || detail.charAt(0) === '-') {
                var level = parseInt(detail);
                if (!level || isNaN(level)) continue;
                defender.boosts = level;
                continue;
            }
            if (/[0-9]/i.test(detail) && toId(detail.charAt(0)) === 'l') {
                level = detail.replace(/[^0-9]/g, '');
                if (!level) continue;
                defender.level = level;
                continue;
            }
            if (toId(detail) === 'eviolite') {
                defender.multiplier *= 1.5;
            }
            if (toId(detail) === 'multiscale') {
                finalMultiplier *= 0.5;
            }
            if (toId(detail) === 'furcoat') {
                if ((MOVEDEX[attacker.move] && MOVEDEX[attacker.move].category === 'Physical') || ['psyshock', 'psystrike', 'secretsword'].indexOf(attacker.move) > -1) {
                    defender.multiplier *= 2
                }
            }
            if (['assaultvest', 'av'].indexOf(toId(detail)) > -1) {
                if ((MOVEDEX[attacker.move] && MOVEDEX[attacker.move].category === 'Special') && ['psyshock', 'psystrike', 'secretsword'].indexOf(attacker.move) === -1) {
                    defender.multiplier *= 1.5;
                }
            }
            if (['dryskin', 'stormdrain', 'waterabsorb'].indexOf(toId(detail)) > -1 && MOVEDEX[attacker.move].type === 'Water') {
                finalMultiplier = 0;
            }
            if (['flashfire'].indexOf(toId(detail)) > -1 && MOVEDEX[attacker.move].type === 'Fire') {
                finalMultiplier = 0;
            }
            if (['levitate', 'airballoon'].indexOf(toId(detail)) > -1 && MOVEDEX[attacker.move].type === 'Ground') {
                finalMultiplier = 0;
            }
            if (['sapsipper'].indexOf(toId(detail)) > -1 && MOVEDEX[attacker.move].type === 'Grass') {
                finalMultiplier = 0;
            }
            if (['lightningrod', 'voltabsorb'].indexOf(toId(detail)) > -1 && MOVEDEX[attacker.move].type === 'Electric') {
                finalMultiplier = 0;
            }
            if (toId(detail) === 'wonderguard') {
                defender.wonderguard = true;
            }
            if (['heatproof'].indexOf(toId(detail)) > -1 && MOVEDEX[attacker.move].type === 'Fire') {
                basePowerMultiplier *= 0.5;
            }
            if (toId(detail) === 'berry') {
                finalMultiplier *= 0.5;
            }
            if (toId(detail).slice(toId(detail).length - 2) === 'hp') {
                detail = detail.replace(/[^0-9]/, '');
                if (!detail) continue;
                defender.hpev = detail;
                continue;
            }
            if ((toId(detail).indexOf('evs') || (!isNaN(parseInt(details)))) && toId(detail).indexOf('iv') === -1 && toId(detail).indexOf('hp') === -1) {
                if (['+', '-'].indexOf(detail.charAt(detail.length - 1)) > -1) {
                    defender.nature = detail.charAt(detail.length - 1);
                }
                detail = detail.replace(/[^0-9]/g, '');
                if (!detail) continue;
                defender.evs = detail;
            }
            if (toId(detail).indexOf('ivs') > -1) {
                detail = detail.replace(/[^0-9]/g, '');
                if (!detail) continue;
                defender.ivs = detail;
            }
        }
        if (!defender.id) return this.errorReply( 'You need to include an defending Pokemon/Move.');
        if (defender.wonderguard && effectiveFactor(attacker.move, defender.id) < 2) {
            finalMultiplier = 0;
        }

        var modifier = 1;
        if (extras) {
            if (extras.indexOf('helpinghand') > -1) {
                attacker.multiplier *= 1.5;
            }
            if (extras.indexOf('lc') > -1) {
                attacker.level = 5;
                defender.level = 5;
            }
            if (extras.indexOf('vgc') > -1) {
                attacker.level = 50;
                defender.level = 50;
            }
        }


        function isStab(move, user) {
            var Pokedex = isolate(POKEDEX);
            var Movedex = isolate(MOVEDEX);
            var types = Pokedex[user].types
            return types.indexOf(Movedex[move].type) > -1;
        }

        function effectiveFactor(move, target) {
            var Pokedex = isolate(POKEDEX);
            var Movedex = isolate(MOVEDEX);
            var TypeChart = isolate(TYPECHART);
            var attackType = Movedex[move].type;
            var types = Pokedex[target].types
            if (types.length === 2) {
                return TypeChart[types[0]].damageTaken[attackType] * TypeChart[types[1]].damageTaken[attackType];
            }
            return TypeChart[types[0]].damageTaken[attackType];
        }
        var effectiveness = effectiveFactor(attacker.move, defender.id);
        var stabMove = isStab(attacker.move, attacker.id);
        if (attacker.specialability && MOVEDEX[attacker.move].type === 'Normal') {
            switch (attacker.specialability) {
                case 'aerilate':
                    effectiveness = effectiveFactor('bravebird', defender.id);
                    var stabMove = isStab('bravebird', attacker.id);
                    break;
                case 'pixilate':
                    effectiveness = effectiveFactor('moonblast', defender.id);
                    var stabMove = isStab('moonblast', attacker.id);
                    break;
                case 'refrigerate':
                    effectiveness = effectiveFactor('blizzard', defender.id);
                    var stabMove = isStab('blizzard', attacker.id);
                    break;
            }
            basePowerMultiplier *= 1.3;
        }
        if (MOVEDEX[attacker.move].secondary && attacker.ability === 'sheerforce') {
            basePowerMultiplier *= 1.3;
        }
        if (attacker.toughclaws && MOVEDEX[attacker.move].flags && MOVEDEX[attacker.move].flags.contact) {
            basePowerMultiplier *= 1.3;
        }
        if (attacker.strongjaw && MOVEDEX[attacker.move].flags && MOVEDEX[attacker.move].flags.bite) {
            basePowerMultiplier *= 1.5;
        }
        if (attacker.megalauncher && MOVEDEX[attacker.move].flags && MOVEDEX[attacker.move].flags.pulse) {
            basePowerMultiplier *= 1.5;
        }
        if (attacker.expertBelt && effectiveness > 2) {
            finalMultiplier *= 1.2;
        }
        if (attacker.reckless && (MOVEDEX[attacker.move].recoil || MOVEDEX[attacker.move].hasCustomRecoil)) {
            basePowerMultiplier *= 1.2
        }
        if (attacker.technician && MOVEDEX[attacker.move].basePower <= 60) {
            basePowerMultiplier *= 1.5;
        }
        var tarLevel = defender.level || 100;
        var hpEvs = defender.hpev || 0;
        hpEvs = parseInt(hpEvs);
        var hp = ~~((POKEDEX[defender.id].baseStats.hp * 2 + (hpEvs / 4) + 31) * (tarLevel / 100) + parseInt(tarLevel) + 10);

        function calculateStat(mon, stat, boost) {
            var baseStat = POKEDEX[mon.id].baseStats[stat];
            var BSmodifier = 1
            if (boost && boost === '+') {
                BSmodifier = 1.1;
            }
            if (boost && boost === '-') {
                BSmodifier = 0.9;
            }
            if (mon.ivs) {
                var ivs = parseInt(mon.ivs);
            }
            else {
                ivs = 31;
            }
            if (mon.evs) {
                var evs = parseInt(mon.evs) / 4;
            }
            else {
                evs = 0;
            }
            level = mon.level || 100;
            var stat = (2 * baseStat) + ivs + evs;
            var levelRatio = level / 100
            return ~~((~~(stat * levelRatio) + 5) * BSmodifier);
        }
        if ((MOVEDEX[attacker.move] && MOVEDEX[attacker.move].category === 'Physical') || ['psyshock', 'psystrike', 'secretsword'].indexOf(attacker.move) > -1) {
            var defStat = 'def';
        }
        else {
            defStat = 'spd';
        }

        function convertStat(stat) {
            if (stat === "Special") return 'spa';
            return 'atk';
        }

        function getBoostValue(level) {
            if (!level) return 1;
            if (level < 0) {
                var negative = true;
                level *= -1
            }
            else {
                negative = false;
            }
            level += 2;
            if (negative) {
                return 2 / level;
            }
            return level / 2;
        }

        var atkBoost = getBoostValue(attacker.boosts) * attacker.multiplier;
        if (extras && (extras.indexOf('criticalhit') > -1 || extras.indexOf('crit') > -1)) {
            var boostmod = getBoostValue(defender.boosts);
            if (boostmod > 1) boostmod = 1;
        }
        else {
            boostmod = getBoostValue(defender.boosts);
        }
        var defBoost = boostmod * defender.multiplier;
        var def = pokeRound(calculateStat(defender, defStat, defender.nature) * defBoost);
        var atk = pokeRound(calculateStat(attacker, convertStat(MOVEDEX[attacker.move].category), attacker.nature) * atkBoost);
        var atkLevel = attacker.level || 100;
        var moveBP = pokeRound(MOVEDEX[attacker.move].basePower * basePowerMultiplier);

        function pokeRound(num) {
            return (num % 1 > 0.5) ? Math.ceil(num) : Math.floor(num);
        }

        var baseDamage = ~~(((((2 * atkLevel) / 5 + 2) * moveBP * atk) / def) / 50 + 2);
        if (extras) {
            var floor = false;
            if (extras.indexOf('criticalhit') > -1 || extras.indexOf('crit') > -1) {
                baseDamage = ~~(baseDamage * 1.5)
            }
            if ((extras.indexOf('criticalhit') > -1 || extras.indexOf('crit') > -1) && extras.indexOf('sniper') > -1) {
                finalMultiplier *= 1.5;
            }
            if (extras.indexOf('vgc') > -1 || extras.indexOf('doubles') > -1) {
                if (toId(MOVEDEX[attacker.move].target.slice(0, 3)) === 'all') baseDamage = ~~(baseDamage * 0.75)
            }
            if (MOVEDEX[attacker.move].type === 'Fire' && extras.indexOf('rain') > -1) {
                baseDamage = ~~(baseDamage * 0.5)
            }
            if (MOVEDEX[attacker.move].type === 'Water' && extras.indexOf('rain') > -1) {
                baseDamage = ~~(baseDamage * 1.5)
            }
            if (MOVEDEX[attacker.move].type === 'Fire' && extras.indexOf('sun') > -1) {
                baseDamage = ~~(baseDamage * 1.5)
            }
            if (MOVEDEX[attacker.move].type === 'Water' && extras.indexOf('sun') > -1) {
                baseDamage = ~~(baseDamage * 0.5)
            }
        }
        var damageRolls = [];
        for (var i = 0.85; i <= 1; i += 0.01) {
            damageRolls.push(~~(baseDamage * i));
        }

        if (stabMove) {
            if (attacker.ability === 'adaptability') {
                var STABmodifier = 2;
            }
            else {
                STABmodifier = 1.5;
            }
            for (var i = 0; i < damageRolls.length; i++) {
                damageRolls[i] = pokeRound(damageRolls[i] * STABmodifier);
            }
        }
        for (var i = 0; i < damageRolls.length; i++) {
            damageRolls[i] = ~~(damageRolls[i] * effectiveness);
        }
        if (MOVEDEX[attacker.move].category === 'Status') finalMultiplier = 0;
        for (var i = 0; i < damageRolls.length; i++) {
            damageRolls[i] = pokeRound(damageRolls[i] * finalMultiplier);
        }
        var minRoll = damageRolls[0];
        var maxRoll = damageRolls[15];
        var minPercent = Math.round((minRoll / hp) * 10000) / 100;
        var maxPercent = Math.round((maxRoll / hp) * 10000) / 100;


        var text = '<b>Damage: ' + minPercent + '% - ' + maxPercent + '%</b> ';

        text += '<i>(Rolls [' + minRoll + '-' + maxRoll + '/' + hp + 'HP]: ' + damageRolls.join(', ') + ')</i>'
        this.sendReplyBox(text);
    },
    calchelp: ["/calc - Provides a damage calculation",
		       "!calc - Shows everyone a damage calculation Requires: + % @ * # & ~"]
};
