/*
 * Chromaloterie: Simple draw of lot. The winner wins a shiney Pokemon in the Official game Pokemon X or Y.
 *
 * Enchères FCL: Auction script used for the "French Community League". 
 */

//Chromaloterie resources
var status = false;
var votes = {hasvoted:{}, votes:{}};
var participants = [];
var winner = 'personne';

//Auctions resources
var checkauctions = 0;
var participants = {participe:{}};
var currentPrice;
var currentParticipant;
var currentCap;
var auctionTimer = 8000;
var outbid;
var teams = {nb:0};

function createTeam (alias, cap, money) {
	this.aliasid = alias.replace(/ /g,'').toLowerCase();
	this.alias = alias;
	this.capid = cap.replace(/ /g,'').toLowerCase();
	this.cap   = cap;
	this.money = money;
}


exports.commands = {
	
	/*****************************/
	/******* Chromaloterie *******/
	/*****************************/
	
	loterie: function (target, room, user) {
		if (room.id !== 'franais') return this.sendReply('This command is reserved to the room Français.');
		if (!this.can('ban', null, room)) return false;
		if (target === 'start'){
			status = true;
			Rooms.rooms.franais.addRaw('<div class="broadcast-blue"><strong>La loterie a commencé !</strong> <br/> Vous pouvez voter en faisant /loterievote 5 (par exemple). <br/> Et n\'oubliez pas, le nombre doit être compris entre 1 et 100.</div>');
		} else if (target === 'stop') {
			var resultat = Math.floor(Math.random() * 100);
			Rooms.rooms.franais.addRaw('<div class="broadcast-blue"><strong>Fin de la Chromaloterie, merci d\'avoir joué !</strong></div>');			
			for (var i=0;i<=participants.length;i++) {
				if (votes.votes[participants[i]] == resultat) {
					winner = participants[i];
				}
			}
			Rooms.rooms.franais.addRaw('<div class="broadcast-blue"><strong>Et le gagnant est... '+winner+' ! (numéro gagnant: '+resultat+')</strong></div>');
			votes = {hasvoted:{}, votes:{}};
			status = false;
			winner = 'personne';
		}
	},
	vote: function (target, room, user) {
		if (room.id !== 'franais') return;
		if (status == false) return this.sendReply('Il n\'y a pas de Chromaloterie en cours.');
		if (isNaN(target)) return this.sendReply("Le vote doit être un nombre entier valide.");
		if (target < 1 || target > 100) return this.sendReply("Le vote doit être un nombre compris entre 1 et 100.");
		//Voting process
		if (votes.hasvoted[user] != 1) {
			votes.hasvoted[user] = 1;
			votes.votes[user] = target;
			participants.push(user);
			this.sendReply('Vous avez voté: '+target);
		} else {
			this.sendReply('Vous avez déjà voté.');
		}	

	},

	 /*****************************/
	 /* Auctions (in development) */
	 /*****************************/
	//Initialization
 	auctions: 'auction',
 	auction: function (target, room, user) {
 		if (room.id !== 'franais') return this.sendReply('This command is reserved to the room Français.');
		if (!this.can('ban', null, room)) return false;
		if (target == 'start') {
			Rooms.rooms.franais.addRaw('<div class="broadcast-blue"><strong>Les enchères sont lancées ! Bonnes chance à tous !</strong></div>');
			checkauctions = 1;
		} else if (target == 'stop') {
			this.sendReply('<div class="broadcast-blue"><strong> Les enchères sont terminées ! Merci d\'avoir participé !</strong></div>');
			teams = {nb:0};
			checkauctions = 0;
			currentParticipant = '';
			currentPrice = 0;
			}
	},
	signup: function (target, room, user) {
		if (room.id !== 'franais') return this.sendReply('This command is reserved to the room Français.');
		if (checkauctions == 0) return this.sendReply('Il n\'y a pas d\'enchères en cours.');
		if (participants.participe[target] == 1) return this.sendReply('Vous êtes déjà inscrit.');
		participants.participe[target] = 1;
		Rooms.rooms.franais.addRaw(user+' est inscrit aux enchères !');
	},
	
	//Configuration
	//Ex: /maketeam TEAM NAME HERE, CAP NAME, MONEY
	maketeam: function (target, room, user) {
		if (room.id !== 'franais') return this.sendReply('This command is reserved to the room Français.');
		if (!this.can('ban', null, room)) return false;
		if (checkauctions == 0) return sendReply('Il n\'y a pas d\'enchère en cours');
		target = target.split(',');
		//We assume there will be no more than 20 teams (edit if necessary...)
		for (var i = 0; i<20; i++) {
			if (typeof teams[i] === 'undefined') {
				teams[i] = new createTeam(target[0], target[1], target[2]);
				teams.nb++;
				Rooms.rooms.franais.addRaw('La team a bien été créée. Capitaine: <b>'+target[1]+'</b>, Nom: <b>'+target[0]+'</b>, Crédit restant: <b>'+target[2]+'€</b>.');
				break;
			}
		}
	},
	
	// Ex: /settimer 5 (5 secondes added each outbid. Default is setted to 8 seconds)
	settimer: function (target, room, user) {
		if (room.id !== 'franais') return this.sendReply('This command is reserved to the room Français.');
		if (!this.can('ban', null, room)) return false;
		if (checkauctions == 0) return this.sendReply('Il n\'y a pas d\'enchères en cours.');
		if (isNaN(target)) return this.sendReply('Le timer doit être composé d\'un nombre entier valide.');
		auctionTimer = target*1000;
		Rooms.rooms.franais.addRawy(con, room, 'Le timer a été réglé sur <b>'+target+'</b> secondes.');
	},
	// Ex: /setcap TEAM NAME, Keb
	setcap: 'setcaptain',
	setcaptain: function (target, room, user) {
		if (room.id !== 'franais') return this.sendReply('This command is reserved to the room Français.');
		if (!this.can('ban', null, room)) return false;
		if (checkauctions == 0) return this.sendReply('Il n\'y a pas d\'enchères en cours.');
		target = target.split(',')
		for (i = 0; i<teams.nb; i++) {
			if (teams[i].aliasid == target[0].replace(/ /g,'').toLowerCase()) {
				teams[i].cap = target[1];
				Rooms.rooms.franais.addRaw('Le capitaine de l\'équipe '+teams[i].alias+' est désormais '+target[1]+' !')
			}
		}
	},
	// Ex: /setalias TEAM NAME, shoedrep 
	setalias: function (target, room, user) {
		if (room.id !== 'franais') return this.sendReply('This command is reserved to the room Français.');
		if (!this.can('ban', null, room)) return false;
		if (checkauctions == 0) return this.sendReply('Il n\'y a pas d\'enchères en cours.');
		target = target.split(',')
		for (i = 0; i<teams.nb; i++) {
			if (teams[i].aliasid == target[0].replace(/ /g,'').toLowerCase()) {
				Rooms.rooms.franais.addRaw('Le nouvel alias de l\'équipe '+teams[i].alias+' est désormais '+target[1]+' !');
				teams[i].alias = target[1];
				teams[i].aliasid = target[1].replace(/ /g,'').toLowerCase();
			}
		}		
	},
	// It works the same way
	setmoney: function (target, room, user) {
		if (room.id !== 'franais') return this.sendReply('This command is reserved to the room Français.');
		if (!this.can('ban', null, room)) return false;
		if (checkauctions == 0) return this.sendReply('Il n\'y a pas d\'enchères en cours.');
		target = target.split(',')
		for (i = 0; i<teams.nb; i++) {
			if (teams[i].aliasid == target[0].replace(/ /g,'').toLowerCase()) {
				teams[i].money = target[1];
				Rooms.rooms.franais.addRaw('L\'équipe '+teams[i].alias+' dispose maintenant de '+target[1]+'€ !')
			}
		}	
	},
	addmoney: function (target, room, user) {
		if (room.id !== 'franais') return this.sendReply('This command is reserved to the room Français.');
		if (!this.can('ban', null, room)) return false;
		if (checkauctions == 0) return this.sendReply('Il n\'y a pas d\'enchères en cours.');
		target = target.split(',')
		for (i = 0; i<teams.nb; i++) {
			if (teams[i].aliasid == target[0].replace(/ /g,'').toLowerCase()) {
				teams[i].money += target[1];
				Rooms.rooms.franais.addRaw('L\'équipe '+teams[i].alias+' a été créditée de '+target[1]+'€ !')
			}
		}	
	},
	//Informations
	teamstatus: function (target, room, user) {
		var status = '';
		for (i = 0; i < teams.nb; i++) {
			status += 'Team <b>'+teams[i].alias+'</b>: Capitaine: '+teams[i].cap+', Crédit restant, '+teams[i].money+', Joueurs: <br/>'
		}
		this.sendReplyBox(status);
	},
	//Auction
	nominate: function (target, room, user) {
		if (room.id !== 'franais') return this.sendReply('This command is reserved to the room Français.');
		if (!this.can('mute', null, room)) return false;
		if (checkauctions == 0) return this.sendReply('Il n\'y a pas d\'enchères en cours.');
		if (participants.participe[target] == 0) return this.sendReply('Ce joueur a déjà été vendu.');
		if (participants.participe[target] != 1) return this.sendReply('Ce joueur a déjà été vendu.');
		Rooms.rooms.franais.addRaw('<b>'+target+' a été nominé !</b>');
		currentParticipant = target;
		outbid = setTimeout(function() {
			for (var i = 0; i < teams.nb; i++) {
				if (user == teams[i].cap) {
					Rooms.rooms.franais.addRaw(currentParticipant+' a été vendu à la team '+teams[i].alias+' pour '+currentPrice+'€! Bravo !');
					teams[i].money -= currentPrice;
					Rooms.rooms.franais.addRaw('Il reste désormais '+teams[i].money+'€ à la team '+teams[i].alias+' !');
					teams[i].players.push(currentParticipant);
					Rooms.rooms.franais.addRaw('Voici la nouvelle composition de l\'équipe '+teams[i].alias+': '+JSON.stringify(teams[i].players));
				}
				break;
			}
			participants.participe[currentParticipant] = 0;
			currentParticipant = '';
			currentPrice = 0;
			}, auctionTimer);
		},
	s: 'outbid',
	outbid: function (target, room, user) {
		if (room.id !== 'franais') return this.sendReply('This command is reserved to the room Français.');
		if (!this.can('mute', null, room)) return false;
		if (checkauctions == 0) return this.sendReply('Il n\'y a pas d\'enchères en cours.');
		if (currentParticipant === '') return this.sendReply('Il n\'y a pas de joueur actuellement nominé.');
		if (isNaN(target)) return this.sendReply('Le vote doit être un nombre entier valide.');
		if (target <= currentPrice) return this.sendReply('Votre proposition doit être supérieure à '+currentPrice+'€.');
		if (participants.participe[target] == 0) return this.sendReply('Ce joueur a déjà été vendu.');
		//Not enough money ?
		for (var i = 0; i < teams.nb; i++) {
			if (user == teams[i].capid) {
				if (team[i].money - target < 0) return this.sendReply('Vous n\'avez pas assez de sous pour voter.');
			}
		}
		currentPrice = target;
		clearTimeout(outbid);
		outbid = setTimeout( function() {
			for (var i = 0; i < teams.nb; i++) {
				if (user == teams[i].cap) {
					Rooms.rooms.franais.addRaw(currentParticipant+' a été vendu à la team '+teams[i].alias+' pour '+currentPrice+'€! Bravo !');
					teams[i].money -= currentPrice;
					Rooms.rooms.franais.addRaw('Il reste désormais '+teams[i].money+'€ à la team '+teams[i].alias+' !');
					teams[i].players.push(currentParticipant);
					Rooms.rooms.franais.addRaw('Voici la nouvelle composition de l\'équipe '+teams[i].alias+': '+JSON.stringify(teams[i].players));
				}
				break;
			}
			participants.participe[currentParticipant] = 0;
			currentParticipant = '';
			currentPrice = 0;
		}, auctionTimer);
	}
 }
