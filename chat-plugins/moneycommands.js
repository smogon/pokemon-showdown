var fs = require('fs');
// for heroku:
var MoneyList = exports.MoneyList = {};
var isMoneyLoaded = false;
function loadMoney(){
	DatabaseManager.Heroku.makeQuery('SELECT * FROM MONEY', {'sendReply':function( res ){
		res = JSON.parse(res);
		for(var i in res){
			MoneyList[res[i].userid] = parseInt( res[i].bucks ) || 0;
		}
		isMoneyLoaded = true;
	}});
};
function readMoney( userid ){
	userid = toId(userid);
	return MoneyList[userid] || 0;
};
function writeMoney( userid, change){
	userid = toId(userid);
	change = parseInt(change) || 0;
	if( !change ) return readMoney( userid );
	var query = '';
	if( !MoneyList[userid] ){
		MoneyList[userid] = change;
		query = "INSERT INTO MONEY VALUES('"+userid +"',"+change+")";
	} else {
		MoneyList[ userid ]+=change;
		if( MoneyList[ userid ]<=0 ){
			delete MoneyList[ userid ];
			query = "DELETE FROM MONEY WHERE USERID='"+userid+"'";
		} else {
			query = "UPDATE MONEY SET BUCKS = "+MoneyList[ userid ]+"  WHERE USERID='"+userid+"'";	
		}
	}
	DatabaseManager.Heroku.makeQuery( query );
	
	return readMoney( userid );
};
function logTransaction(filename , tolog){
	// will decide stuff later
	Rooms.get('bank',true).add('Transaction log : '+tolog ,true);
}
setTimeout( function(){
	loadMoney();
}, 1000*20 );



exports.commands = {

       
      shop: function(target, room, user) {
        if (!this.canBroadcast()) return;
        var status = (!global.shopclosed) ? '<b>Shop status: <font color = "green">Open</font></b><br />To buy an item, type in /buy [item] in the chat, or simply click on one of the buttons.' : '<b>Shop status: <font color = "red">Closed</font></b>';
        this.sendReplyBox('<center><h3><b><u>Shop</u></b></h3><table border = "1" cellspacing = "0" cellpadding = "2"><tr><th>Item</th><th>Description</th><th>Price</th><th></th></tr>' +
            '<tr><td>Symbol</td><td>Buys a symbol to be placed in front of your username.</td><td>5</td><td><button name = "send", value = "/buy symbol"><b>Buy!</b></button></td></tr>' +
            '<tr><td>Lotto Ticket</td><td>Buys a lotto ticket.</td><td>15</td><td><button name = "send", value = "/buy lottoticket"><b>Buy!</b></button></td></tr>' +
            '<tr><td>Custom Avatar</td><td>Buys a custom avatar.</td><td>25</td><td><button name = "send", value = "/buy custom"><b>Buy!</b></button></td></tr>' +
            '<tr><td>Animated Avatar</td><td>Buys an animated custom avatar.</td><td>40</td><td><button name = "send", value = "/buy animated"><b>Buy!</b></button></td></tr>' +
            '<tr><td>Trainer Card</td><td>Buys a trainer card.</td><td>40</td><td><button name = "send", value = "/buy trainercard"><b>Buy!</b></button></td></tr>' +
            '<tr><td>Fix</td><td>Buys the ability to edit your custom avatar or trainer card</td><td>10</td><td><button name = "send", value = "/buy fix"><b>Buy!</b></button></td></tr>' +
            '<tr><td>Banhammer</td><td>Buys a ban dor 2 hours :D.</td><td>80</td><td><button name = "send", value = "/buy banhammer"><b>Buy!</b></button></td></tr>' +
            '<tr><td>Poof Message</td><td>Buys the ability to add a poof message of your choice into the list of poof messages.</td><td>15</td><td><button name = "send", value = "/buy poof"><b>Buy!</b></button></td></tr>' +
            '<tr><td>POTD</td><td>Buys the ability to set the Pokémon of the Day. Not purchasable if there is already a POTD for the day.</td><td>5</td><td><button name = "send", value = "/buy potd"><b>Buy!</b></button></td></tr>' +
            '</table><br />' + status + '</center>');
    },

	buy: function(target, room, user) {
		if (!target) return this.sendReply('|raw|Usage: /buy <i>command</i>');
		user.money = readMoney( user.userid );
		var price = 0;
			
		if (target === 'symbol') {
			price = 5;
			if (price <= user.money) {
				user.money = user.money - price;
				this.sendReply('You have purchased a custom symbol. You will have this until you log off for more than an hour.');
				this.sendReply('|raw|Use /customsymbol <i>symbol</i> to change your symbol now.');
				this.add(user.name + ' has purchased a custom symbol.');
				user.canCustomSymbol = true;
				logTransaction('logs/transactions.log','\n'+Date()+': '+user.name+' has bought a ' + target + ' for ' + price + ' bucks. ' + user.name + ' now has ' + user.money + ' bucks' + '.');
			} else {
				return this.sendReply('You do not have enough bucks for this. You need ' + (price - user.money) + ' more bucks to buy ' + target + '.');
			}
		}
		if (target === 'fix') {
			price = 10;
			if (price <= user.money) {
				user.money = user.money - price;
				this.sendReply('You have purchased a fix for a custom avatar or trainer card. Private Message an admin to alter it for you.');
				this.add(user.name + ' has purchased a fix for his custom avatar or trainer card.');
				logTransaction('logs/transactions.log','\n'+Date()+': '+user.name+' has bought a ' + target + ' for ' + price + ' bucks. ' + user.name + ' now has ' + user.money + ' bucks' + '.');
			} else {
				return this.sendReply('You do not have enough bucks for this. You need ' + (price - user.money) + ' more bucks to buy ' + target + '.');
			}
		}
		if (target === 'poof') {
			price = 15;
			if (price <= user.money) {
				user.money = user.money - price;
				this.sendReply('You have purchased a the ability to add a custom poof. Private Message an admin to add it in.');
				this.add(user.name + ' has purchased the ability to add a custom poof.');
				logTransaction('logs/transactions.log','\n'+Date()+': '+user.name+' has bought a ' + target + ' for ' + price + ' bucks. ' + user.name + ' now has ' + user.money + ' bucks' + '.');
			} else {
				return this.sendReply('You do not have enough bucks for this. You need ' + (price - user.money) + ' more bucks to buy ' + target + '.');
			}
		}
		if (target === 'custom') {
			price = 20;
			if (price <= user.money) {
				user.money = user.money - price;
				this.sendReply('You have purchased an Custom Avatar. Private Message an admin add it in.');
				this.add(user.name + ' has purchased a custom avatar.');
				logTransaction('logs/transactions.log','\n'+Date()+': '+user.name+' has bought a ' + target + ' for ' + price + ' bucks. ' + user.name + ' now has ' + user.money + ' bucks' + '.');
			} else {
				return this.sendReply('You do not have enough bucks for this. You need ' + (price - user.money) + ' more bucks to buy ' + target + '.');
			}
		}
		if (target === 'animated') {
			price = 40;
			if (price <= user.money) {
				user.money = user.money - price;
				this.sendReply('You have purchased an Animated Avatar. Private Message an admin add it in.');
				this.add(user.name + ' has purchased a animated avatar.');
				logTransaction('logs/transactions.log','\n'+Date()+': '+user.name+' has bought a ' + target + ' for ' + price + ' bucks. ' + user.name + ' now has ' + user.money + ' bucks' + '.');
			} else {
				return this.sendReply('You do not have enough bucks for this. You need ' + (price - user.money) + ' more bucks to buy ' + target + '.');
			}
		}
		
		if (target === 'banhammer') {
		        price = 80;
		        if (price <= user.money) {
		                user.money = user.money - price;
		                this.sendReply('You have purchased a banhammer. Contact an mod or leader or admin for receive')
		                this.add(user.name + 'has purchased a banhammer!.');
		                logTransaction('logs/transactions.log','\n'+Date()+': '+user.name+' has bought a ' + target + ' for ' + price + 'bucks. ' + user.name + ' now has ' + user.money + ' bucks ' + '.');
		        } else {
		                return this.sendReply('You do not have enough bucks for this. You need ' + (price - user.money) + ' more bucks to buy ' + target+ '.');
		        }
		}
		
	
	        if (target === 'potd') {
		        price = 5;
		        if (price <= user.money) {
		                user.money = user.money - price;
		                this.sendReply('You have purchased a POTD. Contact an admin for receive')
		                this.add(user.name + 'has purchased a POTD.');
		                logTransaction('logs/transactions.log','\n'+Date()+': '+user.name+' has bought a ' + target + ' for ' + price + 'bucks. ' + user.name + ' now has ' + user.money + ' bucks ' + '.');
		        } else {
		                return this.sendReply('You do not have enough bucks for this. You need ' + (price - user.money) + ' more bucks to buy ' + target+ '.');
		        }
		}
		
		if (target === 'lottoticket') {
		        price = 15;
		        if (price <= user.money) {
		                user.money = user.money - price;
		                this.sendReply('You have purchased a Lotto Ticket. Contact an admin for receive')
		                this.add(user.name + 'has purchased a lotto ticket.');
		                logTransaction('logs/transactions.log','\n'+Date()+': '+user.name+' has bought a ' + target + ' for ' + price + 'bucks. ' + user.name + ' now has ' + user.money + ' bucks ' + '.');
		        } else {
		                return this.sendReply('You do not have enough bucks for this. You need ' + (price - user.money) + ' more bucks to buy ' + target+ '.');
		        }
		}
		
		if (target === 'trainercard') {
			price = 30;
			if (price <= user.money) {
				user.money = user.money - price;
				this.sendReply('You have purchased a trainer card. You need to message an admin capable of adding this.');
				this.add(user.name + ' has purchased a trainer card.');
				logTransaction('logs/transactions.log','\n'+Date()+': '+user.name+' has bought a ' + target + ' for ' + price + ' bucks. ' + user.name + ' now has ' + user.money + ' bucks' + '.');
			} else {
				return this.sendReply('You do not have enough bucks for this. You need ' + (price - user.money) + ' more bucks to buy ' + target + '.');
			}
		}
		
		writeMoney( user.userid , -price );
	},

	transferb: 'transferbucks',
	transferbucks: function(target, room, user) {
		if(!target) return this.sendReply('|raw|Correct Syntax: /transferbucks <i>user</i>, <i>amount</i>');
		if (target.indexOf(',') >= 0) {
			var parts = target.split(',');
			if (parts[0].toLowerCase() === user.name.toLowerCase()) {
				return this.sendReply('You can\'t transfer Bucks to yourself.');
			}
			parts[0] = this.splitTarget(parts[0]);
			var targetUser = this.targetUser;
		}
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (isNaN(parts[1])) {
			return this.sendReply('Very funny, now use a real number.');
		}
		if (parts[1] < 0) {
			return this.sendReply('Number cannot be negative.');
		}
		if (parts[1] == 0) {
			return this.sendReply('No! You cannot transfer 0 bucks, you idiot!');
		}
		if (String(parts[1]).indexOf('.') >= 0) {
			return this.sendReply('You cannot transfer numbers with decimals.');
		}
		if (parts[1] > user.money) {
			return this.sendReply('You cannot transfer more money than what you have.');
		}
		var p = 'Bucks';
		var cleanedUp = parts[1].trim();
		var transferMoney = Number(cleanedUp);
		if (transferMoney === 1) {
			p = 'Buck';
		}
		writeMoney(user, -transferMoney);
		//set time delay because of node asynchronous so it will update both users' money instead of either updating one or the other
		setTimeout(function(){writeMoney(targetUser, transferMoney);logTransaction('logs/transactions.log','\n'+Date()+': '+user.name+' has transferred '+transferMoney+' '+p+' to ' + targetUser.name + '. ' +  user.name +' now has '+user.money + ' ' + p + ' and ' + targetUser.name + ' now has ' + targetUser.money +' ' + p +'.');},3000);
		this.sendReply('You have successfully transferred ' + transferMoney + ' to ' + targetUser.name + '. You now have ' + user.money + ' ' + p + '.');
		targetUser.popup(user.name + ' has transferred ' + transferMoney + ' ' +  p + ' to you.');
		this.logModCommand('('+user.name+'  has transferred ' + transferMoney + ' ' +  p + ' to ' + targetUser.name + '.)');
	},

 	purse: 'money',
	piggybank: 'money',
	backpocket: 'money',
	wallet: 'money',
	atm: 'money',
	money: function(target, room, user, connection, cmd) {
		if (!this.canBroadcast()) return;
		var broadcasting = false;
		if (this.broadcasting) broadcasting = true;
		var data = '';
		if (!target) {
			var money = readMoney( user.userid);
			var noun = money === 1 ? 'buck' : 'bucks';
			data += user.name + ' has '+money+' '+noun+'.<br />';
		} else {
			var target2 = this.splitTarget(target);
			var targetUser = this.targetUser;
			var userid = (targetUser) ? targetUser.userid : toId( target );
			var name = (targetUser) ? targetUser.name : userid ;
			var money = readMoney( userid);
			var noun = money === 1 ? 'buck' : 'bucks';
			data += name+' has '+money+' '+noun+'.<br />';

		}
		return this.sendReplyBox(data);
	},
	bucks : function(target, room, user, connection, cmd) {
		if (!this.canBroadcast()) return;
		var totbucks = 0, totnum = 0;
		for( var i in MoneyList ){
			if( MoneyList[i] <= 0 ) continue;
			totbucks += MoneyList[i];
			totnum++;
		}
		
		var data = '<b>Total bucks in circulation : '+totbucks+'</b><br/>'
			+ '<b>Users with atleast one buck : '+totnum+'</b><br/>';
		return this.sendReplyBox(data);
	},

        closeshop: function(target, room, user) {
        if (!this.can('hotpatch')) return false;
        if (global.shopclosed === true) return this.sendReply('The shop is already closed.');
        global.shopclosed = true;
        this.sendReply('The Johto shop is now closed.');
    },

        openshop: function(target, room, user) {
        if (!this.can('hotpatch')) return false;
        if (!global.shopclosed) return this.sendReply('The shop is already open.');
        global.shopclosed = false;
        this.sendReply('The Johto shop is now open.');
    },
        
        
        lottery: function(target, room, user) {
		if(!user.canLottery) return this.sendReply('You need to buy this item from the shop to use.');
		if(!target || target.length > 1) return this.sendReply('|raw|/lotto to get your lottery ticket.');
		user.canLottery = false;
		user.hasLottery = true;
	},

	savelottery: function(target, room, user) {
		if (!user.hasLottery) return this.sendReply('You don\'t have a Lottery ticket!');
		user.hasLottery = false;
		this.sendReply('Your lottery ticket has been saved.');
	},

	gb: 'givebucks',
	givebucks: function(target, room, user) {
		if(!user.can('givebucks')) return this.sendReply('You do not have enough authority to do this.');
		if(!target) return this.parse('/help givebucks');
		if (target.indexOf(',') != -1) {
			var parts = target.split(',');
			parts[0] = this.splitTarget(parts[0]);
			var targetUser = this.targetUser;
			if (!targetUser) {
				return this.sendReply('User '+this.targetUsername+' not found.');
			}
			if (isNaN(parts[1])) {
				return this.sendReply('Very funny, now use a real number.');
			}
			if (parts[1] < 1) {
				return this.sendReply('Number must be more than 0.')
			}
			var cleanedUp = parts[1].trim();
			var giveMoney = Number(cleanedUp);
			var amount = writeMoney( targetUser.userid, giveMoney);
			var noun = giveMoney === 1 ? 'buck' : 'bucks';
			targetUser.send('|popup|You were given '+giveMoney+' '+noun+' by '+user.name+'. You now have '+amount+' '+noun+'.');
			this.sendReply('You gave '+targetUser.name+' '+giveMoney+' '+noun+'. They now have '+amount+' '+noun+'.');
		} else {
			return this.parse('/help givebucks');
		}
	},

	tb: 'takebucks',
	takebucks: function(target, room, user) {
		if(!user.can('givebucks')) return this.sendReply('You do not have enough authority to do this.');
		if(!target) return this.parse('/help takebucks');
		if (target.indexOf(',') != -1) {
			var parts = target.split(',');
			parts[0] = this.splitTarget(parts[0]);
			var targetUser = this.targetUser;
			if (!targetUser) {
				return this.sendReply('User '+this.targetUsername+' not found.');
			}
			if (isNaN(parts[1])) {
				return this.sendReply('Very funny, now use a real number.');
			}
			var cleanedUp = parts[1].trim();
			var takeMoney = Number(cleanedUp);
			if( takeMoney > readMoney(targetUser.userid))
				takeMoney = readMoney(targetUser.userid);
			takeMoney = takeMoney * -1;
			var amount = writeMoney( targetUser.userid, takeMoney);
			var noun = takeMoney * -1 === 1 ? 'buck' : 'bucks';

			targetUser.send('|popup|'+user.name+' has taken '+(takeMoney*-1)+' '+noun+' from you. You now have '+amount+' bucks.');
			this.sendReply('You have taken '+(takeMoney*-1)+' '+noun+' from '+targetUser.name+'. They now have '+amount+' bucks.');
		} else {
			return this.parse('/help removebucks');
		}
	},

	customsymbol: function (target, room, user) {
		if (!user.canCustomSymbol) return this.sendReply('You need to buy this item from the shop to use it.');
		if (!target || target.length > 1) return this.sendReply('/customsymbol [symbol] - changes your symbol (usergroup) to the specified symbol. The symbol can only be one character');
		if (toId(target) === target || Config.groups[target] || target === '|') return this.sendReply('Sorry, but you cannot change your symbol to this for safety/stability reasons.');

		user.getIdentity = function () {
			var name = Object.getPrototypeOf(this).getIdentity.call(this);
			if (name[0] === this.group) return target + name.slice(1);
			return name;
		};
		user.updateIdentity();
		user.canCustomSymbol = false;
		user.hasCustomSymbol = true;
	},

	resetsymbol: function (target, room, user) {
		delete user.getIdentity;
		user.updateIdentity();
		user.hasCustomSymbol = false;

	}
	
};	
