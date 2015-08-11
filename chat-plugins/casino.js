const casinoAuthDataFile = DATA_DIR + 'authcasino.json';

var fs = require('fs');

if (!fs.existsSync(casinoAuthDataFile))
	fs.writeFileSync(casinoAuthDataFile, '{}');

var casinoOwners = JSON.parse(fs.readFileSync(casinoAuthDataFile).toString());
var defaultPermission = 'ban';

var tourBets = {};
var tourStatus = false;
var tourPrize = 0;

var wheelStatus = false;
var wheelOptions = [];
var wheelBets = {};
var prize = 0;

var bingoStatus = false;
var bingoNumbers = [];
var bingoSaidNumbers = {};
var actualValue = 0;
var tables = {};
var bingoPrize = 0;

function writeCasinoData() {
	fs.writeFileSync(casinoAuthDataFile, JSON.stringify(casinoOwners));
}

function getUserName (user) {
	var targetUser = Users.get (user);
	if (!targetUser) return toId(user);
	return targetUser.name;
}

function getBingoNumbers() {
	var data = [];
	for (var i = 0; i < 50; ++i) {
		data.push(i + 1);
	}
	return data;
}

function checkBingo(room) {
	var winners = [];
	var endGame = false;
	var targetTable;
	var tableComplete;
	for (var i in tables) {
		targetTable = tables[i];
		tableComplete = 0
		for (var j = 0; j < targetTable.length; ++j) {
			if (!bingoSaidNumbers[targetTable[j]]) break;
			++tableComplete;
		}
		if (tableComplete === targetTable.length) {
			endGame = true;
			winners.push(i);
		}
	}
	if (endGame) {
		var winData = '';
		for (var n = 0; n < (winners.length - 1); ++n) {
			Shop.giveMoney(toId(winners[n]), bingoPrize);
			if (n === 0) {
				winData += getUserName(winners[n]);
			} else {
				winData += ', ' + getUserName(winners[n]);
			}
		}
		Shop.giveMoney(toId(winners[winners.length - 1]), bingoPrize);
		if (winners.length > 1) winData += ' y ';
		winData += getUserName(winners[winners.length - 1]);
		room.addRaw("<div class=\"broadcast-blue\"><b>Han cantado Bingo!</b><br />Felicidades a " + winData + " por ganar. Premio: " + bingoPrize + " pd</div>");
		room.update();
		bingoStatus = false;
	}
}

function forceEndTourBets() {
	for (var i in tourBets) {
		Shop.giveMoney(i, tourBets[i].pd);
		tourPrize += (- tourBets[i].pd);
	}
	tourBets = {};
	tourPrize = 0;
}

exports.commands = {
	
	nuevobingo: 'newbingo',
	newbingo: function (target, room, user) {
		if (room.id !== 'casino') return this.sendReply("Este comando solo puede ser usado en una sala de Casino");
		if (!casinoOwners[user.userid] && !this.can(defaultPermission, room)) return false;
		if (bingoStatus) return this.sendReply("Ya hay un bingo en marcha.");
		bingoStatus = true;
		bingoNumbers = getBingoNumbers().randomize();
		bingoSaidNumbers = {};
		actualValue = 0;
		tables = {};
		bingoPrize = 0;
		this.privateModCommand('(' + user.name + ' ha iniciado un juego de Bingo)');
		room.addRaw("<div class=\"broadcast-blue\"><b>Se ha iniciado un nuevo juego de Bingo!</b><br />Puedes participar por 10 pd con /buytable.</div>");
		room.update();
		var loop = function () {
			setTimeout(function () {
				if (!bingoStatus) return;
				if (actualValue >= bingoNumbers.length) {
					bingoStatus = false;
					room.addRaw("<div class=\"broadcast-blue\"><b>El juego de Bingo ha terminado!</b><br />Lamentablemente nadie se había apuntado, así que no hay ganador!</div>");
					room.update();
					return;
				}
				room.add('|c|' + Bot.config.group + Bot.config.name + '|**Juego de Bingo:** Sale el número **' + bingoNumbers[actualValue] + '**');
				bingoSaidNumbers[bingoNumbers[actualValue]] = 1;
				++actualValue;
				room.update();
				checkBingo(room);
				loop();
			}, 1000 * 3);
		};
		loop();
	},
	
	comprartablilla: 'buytable',
	comprartabla: 'buytable',
	buytable: function (target, room, user) {
		if (room.id !== 'casino') return this.sendReply("Este comando solo puede ser usado en una sala de Casino");
		if (!bingoStatus) return this.sendReply("No hay ningún bingo en marcha.");
		if (tables[user.userid]) return this.sendReply("Ya habías comprado una tablilla.");
		if (Shop.getUserMoney(user.name) < 10) return this.sendReply("No tienes suficiente dinero.");
		Shop.removeMoney(user.name, 10);
		Shop.giveMoney('casino', 5);
		var numbers = getBingoNumbers().randomize();
		var cells = [];
		for (var i = 0; i < 5; ++i) {
			cells.push(numbers[i]);
		}
		tables[user.userid] = cells;
		bingoPrize += 15;
		this.sendReply("Has Comprado una tablilla. Para ver su estado usa /bingo");
		this.parse('/bingo');
		checkBingo(room);
	},
	
	vertablilla: 'bingo',
	tablilla: 'bingo',
	bingo: function (target, room, user) {
		if (room.id !== 'casino') return this.sendReply("Este comando solo puede ser usado en una sala de Casino");
		if (!this.canBroadcast()) return;
		if (!bingoStatus) return this.sendReply("No hay ningún bingo en marcha.");
		var targetUserId = user.userid;
		if (tables[toId(target)]) targetUserId = toId(target);
		if (tables[targetUserId]) {
			var html = '<b>Juego de bingo:</b> Tablilla de ' + getUserName(targetUserId) + '<br /><br />';
			html += '<table border="1" cellspacing="0" cellpadding="3" target="_blank"><tbody><tr>';
			for (var n = 0; n < tables[targetUserId].length; ++n) {
				if (!bingoSaidNumbers[tables[targetUserId][n]]) {
					html += '<td><center><b>' + tables[targetUserId][n] + '</b></center></td>';
				} else {
					html += '<td><center><font color="red"><b>' + tables[targetUserId][n] + '</b></font></center></td>';
				}
			}
			html += '</tr></tbody></table><br />';
		} else {
			var html = '<b>Juego de bingo:</b> No estás apuntado, puedes hacerlo con /buytable<br /><br />';
		}
		html += '<b>Actual premio: </b>' + bingoPrize + ' pd.';
		this.sendReplyBox(html);
	},
	
	abrirapuestas: 'openbets',
	openbets: function (target, room, user) {
		if (room.id !== 'casino') return this.sendReply("Este comando solo puede ser usado en una sala de Casino");
		if (!casinoOwners[user.userid] && !this.can(defaultPermission, room)) return false;
		if (tourStatus) return this.sendReply("Ya estaban abiertas las apuestas");
		if (!Tournaments.tournaments[room.id]) {
			forceEndTourBets();
			tourBets = {};
			return this.sendReply("No había ningún torneo en la Sala");
		}
		tourStatus = true;
		this.privateModCommand('(' + user.name + ' ha abierto las apuestas para el torneo)');
		room.addRaw("<div class=\"broadcast-green\"><b>Se han abierto las apuestas para este torneo!</b><br />Puedes apostar por tu favorito por 10, 20 o 30 pd con /tourbet [jugador], [10/20/30].</div>");
		room.update();
	},
	
	cerrarapuestas: 'closebets',
	closebets: function (target, room, user) {
		if (room.id !== 'casino') return this.sendReply("Este comando solo puede ser usado en una sala de Casino");
		if (!casinoOwners[user.userid] && !this.can(defaultPermission, room)) return false;
		if (!tourStatus) return this.sendReply("Las apuestas no estaban abiertas.");
		if (!Tournaments.tournaments[room.id]) {
			forceEndTourBets();
			tourStatus = false;
			tourBets = {};
			return this.sendReply("No había ningún torneo en la Sala. Se han eliminado las apuestas.")
		}
		tourStatus = false;
		this.privateModCommand('(' + user.name + ' ha cerrado las apuestas para el torneo)');
		room.addRaw("<div class=\"broadcast-green\"><b>Las apuestas para este torneo se han cerrado!</b><br />Al finalizar el torneo se comprobarán las apuestas.</div>");
		room.update();
	},
	
	apostartour: 'tourbet',
	tourbet: function (target, room, user) {
		if (room.id !== 'casino') return this.sendReply("Este comando solo puede ser usado en una sala de Casino");
		if (!tourStatus) return this.sendReply("Las apuestas no estaban abiertas.");
		if (!Tournaments.tournaments[room.id]) {
			forceEndTourBets();
			tourStatus = false;
			tourBets = {};
			return this.sendReply("No había ningún torneo en la Sala");
		}
		var params = target.split(',');
		if (!params || params.length !== 2) return this.sendReply("Usage: /tourbet [player], [10/20/30]");
		var money = parseInt(params[1]);
		if (!params[0]) return this.sendReply("No se ha especificado ganador.");
		var tourUsers = Tournaments.tournaments[room.id].generator.getUsers();
		var isInTour = false;
		for (var i = 0; i < tourUsers.length; ++i) {
			if (toId(params[0]) === toId(tourUsers[i])) {
				isInTour = true;
				break;
			}
		}
		if (!isInTour) return this.sendReply("Solo se puede apostar por un jugador del torneo.");
		if (tourBets[user.userid]) this.parse('/canceltourbet');
		if (!money || (money !== 10 && money !== 20 && money !== 30) || money > Shop.getUserMoney(user.name)) return this.sendReply("Solo se puede apostar 10, 20 o 30 pd. También puede que no tengas dinero suficiente.");
		tourBets[user.userid] = {
			pd: money,
			player: toId(params[0])
		};
		tourPrize += money;
		Shop.removeMoney(user.name, money);
		return this.sendReply("Has apostado " + money + " pd por el jugador " + getUserName(params[0]) + ". Puedes cambiar tu apuesta o cancelarla  con /canceltourbet.");
	},
	
	cancelarapuesta: 'canceltourbet',
	canceltourbet: function (target, room, user) {
		if (room.id !== 'casino') return this.sendReply("Este comando solo puede ser usado en una sala de Casino");
		if (!tourStatus) return this.sendReply("Las apuestas no estaban abiertas.");
		if (!Tournaments.tournaments[room.id]) {
			forceEndTourBets();
			tourStatus = false;
			tourBets = {};
			return this.sendReply("No había ningún torneo en la Sala");
		}
		if (!tourBets[user.userid]) return this.sendReply("No habías apostado.");
		Shop.giveMoney(user.name, tourBets[user.userid].pd);
		tourPrize += (- tourBets[user.userid].pd);
		delete tourBets[user.userid];
		return this.sendReply("Se ha cancelado la apuesta anterior.");
	},
	
	apuestas: 'tourbets',
	tourbets: function (target, room, user) {
		if (room.id !== 'casino') return this.sendReply("Este comando solo puede ser usado en una sala de Casino");
		if (!this.canBroadcast()) return;
		var betList = '';
		for (var i in tourBets) {
			betList += '<b>' + getUserName(i) + '</b> ha apostado <b>' + tourBets[i].pd + ' pd</b> por el jugador <b>' + getUserName(tourBets[i].player) + '</b>. <br />';
		}
		if (betList === '') {
			this.sendReplyBox('No había aninguna apuesta registrada.');
		} else {
			this.sendReplyBox(betList);
		}
	},
	
	endtourbets: function (target, room, user) {
		if (room.id !== 'casino') return this.sendReply("Este comando solo puede ser usado en una sala de Casino");
		if (toId(user.name) !== toId(Bot.config.name) && !this.can('casino')) return false;
		if (!target) return this.sendReply("No se ha especificado ganador.");
		var winners = [];
		var empty = true;
		for (var i in tourBets) {
			empty = false;
			if (toId(tourBets[i].player) === toId(target)) winners.push(i);
		}
		if (empty) return this.sendReply("No había apuestas.");
		if (!winners || winners.length < 1) {
			Shop.giveMoney('casino', tourPrize);
			room.addRaw("<div class=\"broadcast-green\"><b>El torneo con apuestas ha terminado!</b><br /> Lamentablemente nadie había apostado por " + getUserName(target) + "</div>");
			room.update();
		} else {
			var winData = '';
			var targetUser;
			for (var n = 0; n < (winners.length - 1); ++n) {
				Shop.giveMoney(toId(winners[n]), tourPrize * (tourBets[toId(winners[n])].pd / 10));
				targetUser = Users.get(winners[n]);
				if (targetUser && targetUser.connected) targetUser.popup('Felicidades, Has ganado ' + tourPrize * (tourBets[toId(winners[n])].pd / 10) + ' pd por acertar en las apuestas del torneo del casino!');
				if (n === 0) {
					winData += getUserName(winners[n]);
				} else {
					winData += ', ' + getUserName(winners[n]);
				}
			}
			Shop.giveMoney(toId(winners[winners.length - 1]), tourPrize * (tourBets[toId(winners[n])].pd / 10));
			targetUser = Users.get(winners[winners.length - 1]);
			if (targetUser && targetUser.connected) targetUser.popup('Felicidades, Has ganado ' + tourPrize * (tourBets[toId(winners[winners.length - 1])].pd / 10) + ' pd por acertar en las apuestas del torneo del casino!');
			if (winners.length > 1) winData += ' y ';
			winData += getUserName(winners[winners.length - 1]);
			room.addRaw("<div class=\"broadcast-green\"><b>El torneo con apuestas ha terminado!</b><br />Felicidades a " + winData + " por acertar. El premio depende de los pd apostados: " + tourPrize + " pd (x1/x2/x3)</div>");
			room.update();
		}
		tourBets = {};
		tourStatus = false;
		tourPrize = 0;
	},
	
	nr: 'newwheel',
	nuevaruleta: 'newwheel',
	newwheel: function (target, room, user) {
		if (room.id !== 'casino') return this.sendReply("Este comando solo puede ser usado en una sala de Casino");
		if (!casinoOwners[user.userid] && !this.can(defaultPermission, room)) return false;
		if (wheelStatus) return this.sendReply("Ya hay una ruleta en marcha.");
		var params = target.split(',');
		if (!params || params.length !== 2) return this.sendReply("Usage: /nuevaruleta [initprize], [size]");
		var initPrize = parseInt(params[0]);
		var wheelSize = parseInt(params[1]);
		if (initPrize && initPrize > 1000 && !casinoOwners[user.userid] && user.can('casino')) return this.sendReply("No tienes autoridad para apostar más de 1000 pd en una sola ruleta.");
		if (!wheelSize || wheelSize < 8 || wheelSize > 20) return this.sendReply("El tamaño debe ser de 8 a 20 casillas");
		if (initPrize && initPrize >= 10 && initPrize <= Shop.getUserMoney('casino')) {
			prize = initPrize;
			Shop.removeMoney('casino', initPrize);
		} else {
			return this.sendReply("Debes establecer un premio inicial superior a 10 pd pero inferior al total de beneficios del casino.");
		}
		var keys = [];
		var pokemonLeft = 0;
		var pokemon = [];
		wheelOptions = [];
		wheelStatus = true;
		for (var i in Tools.data.FormatsData) {
			if (Tools.data.FormatsData[i].randomBattleMoves) {
				keys.push(i);
			}
		}
		keys = keys.randomize();
		for (var i = 0; i < keys.length && pokemonLeft < wheelSize; i++) {
			var template = Tools.getTemplate(keys[i]);
			if (template.species.indexOf('-') > -1) continue;
			if (template.species === 'Pichu-Spiky-eared') continue;
			if (template.tier !== 'LC') continue;
			wheelOptions.push(template.species);
			++pokemonLeft;
		}
		var htmlDeclare = '';
		for (var j = 0; j < wheelOptions.length; j++) {
			htmlDeclare += '<img src="http://play.pokemonshowdown.com/sprites/xyani/' + toId(wheelOptions[j]) + '.gif" title="' + wheelOptions[j] +'" />&nbsp;';
		}
		htmlDeclare += '<br /><br /><b>Usa /apostar [pokemon] para jugar a la ruleta. Cuesta 10 pds.</b><br /><b>El ganador o ganadores se llevan un premio de ' + prize + ' pd + 20 pd por participante.</b></center></div>';
		this.privateModCommand('(' + user.name + ' ha iniciado un juego de ruleta. Premio inicial: ' + initPrize + ' pd ; Casillas: ' + wheelSize + ')');
		room.addRaw('<div class="broadcast-blue"><center><h1>Juego de Ruleta</h1><b>' + htmlDeclare);
		room.update();
	},
	
	finruleta: 'endwheel',
	endwheel: function (target, room, user) {
		if (room.id !== 'casino') return this.sendReply("Este comando solo puede ser usado en una sala de Casino");
		if (!casinoOwners[user.userid] && !this.can(defaultPermission, room)) return false;
		if (!wheelStatus) return this.sendReply("No hay ninguna ruleta en marcha.");
		var pkm = wheelOptions[Math.floor(Math.random() * wheelOptions.length)];
		var htmlDeclare = '<div class="broadcast-green"><center><h1>Juego de Ruleta Finalizado</h1><h3>La ruleta ha girado y el Pokemon elegido es ' + pkm + '</h3><img src="http://play.pokemonshowdown.com/sprites/xyani/' + toId(pkm) + '.gif" title="' + pkm + '" /> <br /><br /><b>';
		var winners = [];
		for (var i in wheelBets) {
			if (toId(wheelBets[i]) === toId(pkm)) winners.push(i);
		}
		if (!winners || winners.length < 1) {
			htmlDeclare += 'Lamentablemente nadie había apostado por este Pokemon.</b>';
			Shop.giveMoney('casino', prize);
		} else if (winners.length === 1) {
			htmlDeclare += '&iexcl;Felicidades a ' + getUserName(winners[0]) + ' por ganar en la ruleta!<b /> Premio entregado al ganador: ' + prize + ' pd.</b>';
			Shop.giveMoney(toId(winners[0]), prize);
		} else {
			htmlDeclare += '&iexcl;Felicidades a ';
			for (var n = 0; n < (winners.length - 1); ++n) {
				Shop.giveMoney(toId(winners[n]), prize);
				if (n === 0) {
					htmlDeclare += getUserName(winners[n]);
				} else {
					htmlDeclare += ', ' + getUserName(winners[n]);
				}
			}
			Shop.giveMoney(toId(winners[winners.length - 1]), prize);
			htmlDeclare += ' y ' + getUserName(winners[winners.length - 1]) + ' por ganar en la ruleta!<b /> Premio entregado a los ganadores: ' + prize + ' pd.</b>';
		}
		htmlDeclare += '</center></div>';
		wheelStatus = false;
		wheelOptions = [];
		wheelBets = {};
		prize = 0;
		this.privateModCommand('(' + user.name + ' ha finalizado el juego de ruleta)');
		room.addRaw(htmlDeclare);
		room.update();
	},
	
	ruleta: 'wheel',
	wheel: function (target, room, user) {
		if (room.id !== 'casino') return this.sendReply("Este comando solo puede ser usado en una sala de Casino");
		if (!wheelStatus) return this.sendReply("No hay ninguna ruleta en marcha.");
		if (!this.canBroadcast()) return;
		var optionsList = '';
		for (var j = 0; j < wheelOptions.length; j++) {
			optionsList += wheelOptions[j] + ", ";
		}
		return this.sendReplyBox("<b>Opciones de la ruleta:</b> " + optionsList + '<br /><b>Premio: </b>' + (prize) + ' pd.');
	},
	
	apostar: 'betwheel',
	betwheel: function (target, room, user) {
		if (room.id !== 'casino') return this.sendReply("Este comando solo puede ser usado en una sala de Casino");
		if (!wheelStatus) return this.sendReply("No hay ninguna ruleta en marcha.");
		var pokemonId = toId(target);
		var validPkm = false;
		for (var j = 0; j < wheelOptions.length; j++) {
			if (pokemonId === toId(wheelOptions[j])) validPkm = true;
		}
		if (!validPkm) return this.sendReply(pokemonId + " no es una opción de la ruleta. Para ver las opciones escribe /ruleta");
		if (wheelBets[user.userid]) {
			wheelBets[user.userid] = pokemonId;
			return this.sendReply("Has cambiado tu apuesta a " + pokemonId);
		} else {
			if (Shop.getUserMoney(user.name) < 10) return this.sendReply("No tienes suficiente dinero.");
			wheelBets[user.userid] = pokemonId;
			Shop.removeMoney(user.name, 10);
			prize += 20;
			return this.sendReply("Has apostado por " + pokemonId + ". Puedes cambiar tu apuesta tantas veces como quieras (sin coste) hasta que termine el juego de ruleta.");
		}
	},
	
	beneficios: 'casinomoney',
	casinomoney: function (target, room, user) {
		if (room.id !== 'casino') return this.sendReply("Este comando solo puede ser usado en una sala de Casino");
		if (!this.canBroadcast()) return;
		var money = Shop.getUserMoney('casino');
		if (money < 1) return this.sendReply("No había beneficios en el casino.");
		return this.sendReply("Beneficios del Casino: " + money + ' Pds');
	},
	
	darfondos: 'addcasinomoney',
	addcasinomoney: function (target, room, user) {
		if (room.id !== 'casino') return this.sendReply("Este comando solo puede ser usado en una sala de Casino");
		if (!casinoOwners[user.userid] && !this.can('givemoney')) return false;
		var money = Shop.getUserMoney(user.name);
		var targetMoney = parseInt(target);
		if (!targetMoney || targetMoney < 1) return this.sendReply("La cantidad especificada no es válida.");
		if (money < targetMoney) return this.sendReply("No tenías suficiente dinero.");
		Shop.transferMoney(user.name, 'casino', targetMoney);
		this.privateModCommand('(' + user.name + ' ha aportado fondos al casino: ' + targetMoney + ' Pds)');
	},

	retirarfondos: 'transfercasinomoney',
	obtenerfondos: 'transfercasinomoney',
	transfercasinomoney: function (target, room, user) {
		if (room.id !== 'casino') return this.sendReply("Este comando solo puede ser usado en una sala de Casino");
		if (!casinoOwners[user.userid] && !this.can('givemoney')) return false;
		var money = Shop.getUserMoney('casino');
		var targetMoney = parseInt(target);
		if (!targetMoney || targetMoney < 1) return this.sendReply("La cantidad especificada no es válida.");
		if (money < targetMoney) return this.sendReply("No había beneficios suficientes en el casino.");
		Shop.transferMoney('casino', user.name, targetMoney);
		this.privateModCommand('(' + user.name + ' ha retirado fondos del casino: ' + targetMoney + ' Pds)');
	},

	slot: 'tragaperras',
	slotmachine: 'tragaperras',
	tragaperras: function (target, room, user) {
		if (!this.canBroadcast()) return;
		if (room.id !== 'casino') return this.sendReply("Este comando solo puede ser usado en una sala de Casino");
		var money = parseInt(target);
		var now = Date.now();
		if (!money || money < 1 || money > 50) return this.sendReply("Solo se puede apostar de 1 a 50 pd");
		if (!user.lastSlotCmd) user.lastSlotCmd = 0;
		if ((now - user.lastSlotCmd) * 0.001 < 2) return this.sendReply("Por favor espera " + Math.floor(2 - (now - user.lastSlotCmd) * 0.001) + " segundos antes de volver a usar la tragaperras.");
		user.lastSlotCmd = now;
		if (Shop.getUserMoney(user.name) < money) return this.sendReply("No tienes suficiente dinero");
		Shop.removeMoney(user.name, money);
		var slotSymbols = ["\u2605", "\u2665", "@", "%", "$", "&", "#", "+", "~"];
		var symbolA = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
		var symbolB = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
		var symbolC = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
		if (symbolA === symbolB && symbolB === symbolC && symbolA === '\u2605') {
			Shop.giveMoney(user.name, money * 5);
			return this.sendReply("|html| <b>" + symbolA + symbolB + symbolC + "</b> - Felicidades! Tu apuesta se multiplica por 5!");
		} else if (symbolA === symbolB && symbolB === symbolC) {
			Shop.giveMoney(user.name, money * 4);
			return this.sendReply("|html| <b>" + symbolA + symbolB + symbolC + "</b> - Felicidades! Tu apuesta se multiplica por 4!");
		} else if ((symbolA === symbolB && symbolA === '\u2605') || (symbolA === symbolC && symbolA === '\u2605') || (symbolB === symbolC && symbolB === '\u2605')) {
			Shop.giveMoney(user.name, money * 3);
			return this.sendReply("|html| <b>" + symbolA + symbolB + symbolC + "</b> - Felicidades! Tu apuesta se multiplica por 3!");
		} else if ((symbolA === symbolB || symbolA === symbolC || symbolB === symbolC) && (symbolA === '\u2605' || symbolB === '\u2605' || symbolC === '\u2605')) {
			Shop.giveMoney(user.name, money * 3);
			return this.sendReply("|html| <b>" + symbolA + symbolB + symbolC + "</b> - Felicidades! Tu apuesta se multiplica por 3!");
		} else if (symbolA === symbolB || symbolB === symbolC || symbolA === symbolC) {
			Shop.giveMoney(user.name, money * 2);
			return this.sendReply("|html| <b>" + symbolA + symbolB + symbolC + "</b> - Felicidades! Tu apuesta se multiplica por 2!");
		} else if (symbolA === '\u2605' || symbolB === '\u2605' || symbolC === '\u2605') {
			Shop.giveMoney(user.name, money);
			return this.sendReply("|html| <b>" + symbolA + symbolB + symbolC + "</b> - Recuperas lo apostado!");
		} else {
			Shop.giveMoney('casino', money);
			return this.sendReply("|html| <b>" + symbolA + symbolB + symbolC + "</b> - Has perdido! Intentalo de nuevo.");
		}
	},
	
	casino: function (target, room, user) {
		if (room.id !== 'casino' && Rooms.rooms['casino'] && !Rooms.rooms['casino'].users[user.userid]) {
			user.joinRoom('casino');
			return;
		}
		var casinoInfo = 'Bienvenido al casino: En esta sala puedes apostar tus PokeDolares en diversos juegos de azar y ganar dinero fácil si tienes suerte. Los actuales juegos de azar son los siguientes:\n -Tragaperras: Usa /slot [1-50] | Puedes perder los Pd o que tu apuesta de multiplique hasta x5. \n -Ruleta: El staff del casino debe iniciarla con /nuevaruleta y hacerla girar con /finruleta. Nota: el premio inicial viene de los fondos del casino alimentados de las tragaperras y de las ruletas sin ganador. Para los usuarios se apuesta por un Pokemon con /apostar [pokemon] y para ver las opciones /ruleta \n -Bingo: Se inicia con /nuevobingo y se participa con /buytable. Se van diciendo números aleatorios y quien antes tenga una tablilla con todos sus números dichos gana. \n -Apuestas: Se inicia con /abrirapuestas y /cerrarapuestas pudiendo apostar por un jugador como posible ganador del torneo mediante el comando /tourbet. \n \n';
		var owners = Object.keys(casinoOwners);
		if (!owners || owners.length < 1) {
			casinoInfo += 'No hay dueños del casino aún.';
		} else if (owners.length === 1) {
			casinoInfo += 'Actual dueño del casino (con acceso a los fondos): ' + getUserName(owners[0]);
		} else {
			casinoInfo += 'Actuales dueños del casino (con acceso a los fondos): ' + getUserName(owners[0]);
			for (var n = 1; n < (owners.length - 1); ++n) {
				casinoInfo += ', ' + getUserName(owners[n]);
			}
			casinoInfo += ' y ' + getUserName(owners[owners.length - 1]);
		}
		user.popup(casinoInfo);
	},
	
	casinoowner: function (target, room, user) {
		if (room.id !== 'casino') return this.sendReply("Este comando solo puede ser usado en una sala de Casino");
		if (!this.can('casino')) return;
		if (!target) return this.sendReply("No has especificado ningún usuario.");
		var targetUser = Users.get(target);
		if (!targetUser) return this.sendReply("El usuario no existe o no está disponible.");
		casinoOwners[targetUser.userid] = 1;
		this.addModCommand(targetUser.name + " ha sido nombrado dueño del casino por " + user.name + '.');
		writeCasinoData();
	},
	
	casinodeowner: function (target, room, user) {
		if (room.id !== 'casino') return this.sendReply("Este comando solo puede ser usado en una sala de Casino");
		if (!this.can('casino')) return;
		if (!target) return this.sendReply("No has especificado ningún usuario.");
		var targetUser = Users.get(target);
		var userName;
		if (!targetUser) {
			userName = toId(target);
		} else {
			userName = targetUser.name;
		}
		if (!casinoOwners[toId(target)]) return this.sendReply("El usuario especificado no era dueño del casino.");
		delete casinoOwners[toId(target)];
		this.privateModCommand("(" + userName + " ha sido degradado del puesto de dueño del casino por " + user.name + '.)');
		if (targetUser && targetUser.connected) targetUser.popup(user.name + " te ha degradado del puesto de dueño del casino.");
		writeCasinoData();
	},
	
	permisoevento: 'eventspermission',
	permisoeventos: 'eventspermission',
	eventspermission: function (target, room, user) {
		if (room.id !== 'casino') return this.sendReply("Este comando solo puede ser usado en una sala de Casino");
		if (!target) return this.sendReply("No has especificado ningún rango.");
		if (defaultPermission === 'casino' && !casinoOwners[user.userid] && !this.can('casino')) return false;
		switch (target.trim()) {
			case '+':
				if (!casinoOwners[user.userid] && !this.can('declare', room) && !this.can('casino')) return false;
				defaultPermission = 'broadcast';
				this.privateModCommand("(" + user.name + " establecido el permiso mínimo para hacer eventos en el casino a +)");
				break;
			case '%':
				if (!casinoOwners[user.userid] && !this.can('declare', room) && !this.can('casino')) return false;
				defaultPermission = 'staff';
				this.privateModCommand("(" + user.name + " establecido el permiso mínimo para hacer eventos en el casino a %)");
				break;
			case '@':
				if (!casinoOwners[user.userid] && !this.can('declare', room) && !this.can('casino')) return false;
				defaultPermission = 'ban';
				this.privateModCommand("(" + user.name + " establecido el permiso mínimo para hacer eventos en el casino a @)");
				break;
			case '#':
				if (!casinoOwners[user.userid] && !this.can('declare', room) && !this.can('casino')) return false;
				defaultPermission = 'declare';
				this.privateModCommand("(" + user.name + " establecido el permiso mínimo para hacer eventos en el casino a #)");
				break;
			case '~':
			case 'OFF':
			case 'off':
				if (!casinoOwners[user.userid] && !this.can('casino')) return false;
				defaultPermission = 'casino';
				this.privateModCommand("(" + user.name + " establecido el permiso mínimo para hacer eventos en el casino a ~)");
				break;
			default:
				return this.sendReply("Rangos: +, %, @, # y ~");
		}
	}
}
