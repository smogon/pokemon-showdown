/*
 * Chromaloterie: Simple draw of lot. The winner wins a shiney Pokemon in the Official game Pokemon X or Y.
 *
 * Enchères FCL: Auction script used for the "French Community League". 
 */

 /*****************************/
 /******* Chromaloterie *******/
 /*****************************/

var status       = false;
var votes        = {"hasvoted":{}, "votes":{}};
var participants = [];
var winner       = 'personne';

 exports.commands = {
	loterie: function(target, room, user){
		if(room.id !== 'franais') return;
		if (!this.can('mute', null, room)) return false;
		if(target === 'start'){
			status = true;
			Rooms.rooms.franais.addRaw('<div class="broadcast-blue"><strong>La loterie a commencé !</strong> <br/> Vous pouvez voter en faisant /loterievote 5 (par exemple). <br/> Et n\'oubliez pas, le nombre doit être compris entre 1 et 100.</div>');
		}else if(target === 'stop'){
			var resultat = 1;//Math.floor(Math.random() * 100);
			//Rooms.rooms.franais.addRaw('<div class="broadcast-blue"><strong>Fin de la Chromaloterie, merci d\'avoir joué !</strong></div>');			
			for(var i=0;i<=participants.length;i++){
				if(votes.votes[participants[i]] == resultat){
					winner = participants[i];
				}
			}
			Rooms.rooms.franais.addRaw('<div class="broadcast-blue"><strong>Et le gagnant est... '+winner+' ! (numéro gagnant: '+resultat+')</strong></div>');
			votes  = {"hasvoted":{}, "votes":{}};
			status = false;
			winner = 'personne';
		}
	},
	vote: function(target, room, user){
		if(room.id !== 'franais') return;
		if(status == false) return this.sendReply('Il n\'y a pas de Chromaloterie en cours.');
		if(isNaN(target)) return this.sendReply("Le vote doit être un nombre entier valide.");
		if(target < 1 || target > 100) 	return this.sendReply("Le vote doit être un nombre compris entre 1 et 100.");
		//Voting process
		if(votes.hasvoted[user] != 1){
			votes.hasvoted[user] = 1;
			votes.votes[user]    = target;
			participants.push(user);
			this.sendReply('Vous avez voté: '+target);
		}else{
			this.sendReply('Vous avez déjà voté.');
		}	

	}

	 /*****************************/
	 /* Auctions (in development) */
	 /*****************************/

 }
