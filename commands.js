/**

 * System commands
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * These are system commands - commands required for Pokemon Showdown
 * to run. A lot of these are sent by the client.
 *
 * If you'd like to modify commands, please go to config/commands.js,
 * which also teaches you how to use commands.
 *
 * @license MIT license
 */
var bank = exports.bank = {
			bucks: function(uid, amount, take) {

 
						var data = fs.readFileSync('config/money.csv','utf8')
				var match = false;
				var money = 0;
				var row = (''+data).split("\n");
				var line = '';
				for (var i = row.length; i > -1; i--) {
					if (!row[i]) continue;
					var parts = row[i].split(",");
					var userid = toUserid(parts[0]);
					if (uid.userid == userid) {
						var x = Number(parts[1]);
						var money = x;
						match = true;
						if (match === true) {
							line = line + row[i];
							break;
						}
					}
				}
				uid.money = money;
				if (take === true){if (amount <= uid.money){
				uid.money = uid.money - amount; take = false;}
				else return false;
				}
				else {uid.money = uid.money + amount;}
				if (match === true) {
					var re = new RegExp(line,"g");
					fs.readFile('config/money.csv', 'utf8', function (err,data) {
					if (err) {
						return console.log(err);
					}
					var result = data.replace(re, uid.userid+','+uid.money);
					fs.writeFile('config/money.csv', result, 'utf8', function (err) {
						if (err) return console.log(err);
					});
					});
				} else {
					var log = fs.createWriteStream('config/money.csv', {'flags': 'a'});
					log.write("\n"+uid.userid+','+uid.money);
				}
				return true;
				},
				
	    coins: function(uid, amount, take) {

	    var lore = fs.readFileSync('config/coins.csv','utf8')
                var match = false;
                var coins = 0;
                var spag = (''+lore).split("\n");
                var hetti = '';
                for (var i = spag.length; i > -1; i--) {
                    if (!spag[i]) continue;
                    var parts = spag[i].split(",");
                    var userid = toUserid(parts[0]);
					if (uid.userid == userid) {
                        var x = Number(parts[1]);
                        var coins = x;
                        match = true;
                        if (match === true) {
                            hetti = hetti + spag[i];
                            break;
                        }
                    }
                }
                uid.coins = coins;
						if (take === true){if (amount <= uid.coins){
				uid.coins = uid.coins - amount; take = false;}
				else return false;
				}
				else {uid.coins = uid.coins + amount;}
				
                if (match === true) {
                    var be = new RegExp(hetti,"g");
                    fs.readFile('config/coins.csv', 'utf8', function (err,lore) {
                        if (err) {
                            return console.log(err);
                        }
                        var result = lore.replace(be, uid.userid+','+uid.coins);
                        fs.writeFile('config/coins.csv', result, 'utf8', function (err) {
                            if (err) return console.log(err);
                        });
                    });
                } else {
                    var log = fs.createWriteStream('config/coins.csv', {'flags': 'a'});
                    log.write("\n"+uid.userid+','+uid.coins);
                } return true;
		}


	}
var crypto = require('crypto');
var poofeh = true;
var ipbans = fs.createWriteStream('config/ipbans.txt', {'flags': 'a'});
var logeval = fs.createWriteStream('logs/eval.txt', {'flags': 'a'});
var inShop = ['symbol', 'custom', 'animated', 'room', 'trainer', 'fix', 'declare'];
var closeShop = false;
var closedShop = 0;
var avatar = fs.createWriteStream('config/avatars.csv', {'flags': 'a'}); // for /customavatar
//spamroom
if (typeof spamroom == "undefined") {
        spamroom = new Object();
}
if (!Rooms.rooms.spamroom) {
        Rooms.rooms.spamroom = new Rooms.ChatRoom("spamroom", "spamroom");
        Rooms.rooms.spamroom.isPrivate = true;
}
if (typeof tells === 'undefined') {
	tells = {};
}

const MAX_REASON_LENGTH = 300;

var commands = exports.commands = {



	createpoints: function(target, room, user, connection) {
		if(!user.can('hotpatch')) return this.sendReply('You do not have enough authority to do this.');
		fs.exists('config/money.csv', function (exists) {
			if(exists){
				return connection.sendTo(room, 'Since this file already exists, you cannot do this.');
			} else {
				fs.writeFile('config/money.csv', 'elitefouruby,1e+999', function (err) {
					if (err) throw err;
					console.log('config/money.csv created.');
					connection.sendTo(room, 'config/money.csv created.');
				});
			}
		});
	},


	createcoins: function(target, room, user, connection) {
		if (!user.can('hotpatch')) return this.sendReply('You do not have enough authority to do this.');
		fs.exists('config/coins.csv', function (exists) {
			if (exists) {
				return connection.sendTo(room, 'This file already exists so you do not need to create it again.')
			} else {
				fs.writeFile('config/coins.csv', 'elitefouruby,1e+999', function (err) {
					if (err) throw err;
					console.log('config/coins.csv created.');
					connection.sendTo(room, 'config/coins.csv created,');
				});
			}
		});
	},

	

	/*********************************************************
	 * Money                                     
	 *********************************************************/

	bp: 'atm',
	wallet: 'atm',
	satchel: 'atm',
	fannypack: 'atm',
	purse: 'atm',
	bag: 'atm',
	atm: function(target, room, user, connection, cmd) {
	if (!this.canBroadcast()) return;
	var cMatch = false;
	var mMatch = false;
	var money = 0;
	var coins = 0;
	var total = '';
	if (!target) {
	var data = fs.readFileSync('config/money.csv','utf8')
		var row = (''+data).split("\n");
		for (var i = row.length; i > -1; i--) {
			if (!row[i]) continue;
			var parts = row[i].split(",");
			var userid = toUserid(parts[0]);
			if (user.userid == userid) {
			var x = Number(parts[1]);
			var money = x;
			mMatch = true;
			if (mMatch === true) {
				break;
			}
			}
		}
		if (mMatch === true) {
			var p = 'bucks';
			if (money < 2) p = 'leaf bucks';
			total += user.name + ' has ' + money + ' ' + p + '.<br />';
		}
		if (mMatch === false) {
			total += 'You have no bucks.<br />';
		}
		user.money = money;
		var data = fs.readFileSync('config/coins.csv','utf8')
		var row = (''+data).split("\n");
		for (var i = row.length; i > -1; i--) {
			if (!row[i]) continue;
			var parts = row[i].split(",");
			var userid = toUserid(parts[0]);
			if (user.userid == userid) {
			var x = Number(parts[1]);
			var coins = x;
			cMatch = true;
			if (cMatch === true) {
				break;
			}
			}
		}
		if (cMatch === true) {
			var p = 'coins';
			if (coins < 2) p = 'coin';
			total += user.name + ' has ' + coins + ' ' + p + '.'
		}
		if (cMatch === false) {
			total += 'You have no coins.'
		}
		user.coins = coins;
	} else {
		var data = fs.readFileSync('config/money.csv','utf8')
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		var money = 0;
		var row = (''+data).split("\n");
		for (var i = row.length; i > -1; i--) {
			if (!row[i]) continue;
			var parts = row[i].split(",");
			var userid = toUserid(parts[0]);
			if (targetUser.userid == userid || target == userid) {
			var x = Number(parts[1]);
			var money = x;
			mMatch = true;
			if (mMatch === true) {
				break;
			}
			}
		}
		if (mMatch === true) {
			var p = 'bucks';
			if (money < 2) p = 'buck';
			total += targetUser.name + ' has ' + money + ' ' + p + '.<br />';
		} 
		if (mMatch === false) {
			total += targetUser.name + ' has no bucks.<br />';
		}
		targetUser.money = money;
		var data = fs.readFileSync('config/coins.csv','utf8')
		var coins = 0;
		var row = (''+data).split("\n");
		for (var i = row.length; i > -1; i--) {
			if (!row[i]) continue;
			var parts = row[i].split(",");
			var userid = toUserid(parts[0]);
			if (targetUser.userid == userid || target == userid) {
			var x = Number(parts[1]);
			var coins = x;
			cMatch = true;
			if (cMatch === true) {
				break;
			}
			}
		}
		if (cMatch === true) {
			var p = 'coins';
			if (coins < 2) p = 'coin';
			total += targetUser.name + ' has ' + coins + ' ' + p + '.<br />';
		} 
		if (cMatch === false) {
			total += targetUser.name + ' has no coins.<br />';
		}
		targetUser.coins = coins;
	}
	return this.sendReplyBox(total);
	},

	awardbucks: 'givebucks',
	gb: 'givebucks',
	givebucks: function(target, room, user) {
		if(!user.can('hotpatch')) return this.sendReply('You do not have enough authority to do this.');
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
		var cleanedUp = parts[1].trim();
		var giveMoney = Number(cleanedUp);
		var data = fs.readFileSync('config/money.csv','utf8')
		var match = false;
		var money = 0;
		var line = '';
		var row = (''+data).split("\n");
		for (var i = row.length; i > -1; i--) {
			if (!row[i]) continue;
			var parts = row[i].split(",");
			var userid = toUserid(parts[0]);
			if (targetUser.userid == userid) {
			var x = Number(parts[1]);
			var money = x;
			match = true;
			if (match === true) {
				line = line + row[i];
				break;
			}
			}
		}
		targetUser.money = money;
		targetUser.money += giveMoney;
		if (match === true) {
			var re = new RegExp(line,"g");
			fs.readFile('config/money.csv', 'utf8', function (err,data) {
			if (err) {
				return console.log(err);
			}
			var result = data.replace(re, targetUser.userid+','+targetUser.money);
			fs.writeFile('config/money.csv', result, 'utf8', function (err) {
				if (err) return console.log(err);
			});
			});
		} else {
			var log = fs.createWriteStream('config/money.csv', {'flags': 'a'});
			log.write("\n"+targetUser.userid+','+targetUser.money);
		}
		var p = 'bucks';
		if (giveMoney < 2) p = 'buck';
		this.sendReply(targetUser.name + ' was given ' + giveMoney + ' ' + p + '. This user now has ' + targetUser.money + ' bucks.');
		targetUser.send(user.name + ' has given you ' + giveMoney + ' ' + p + '.');
		} else {
			return this.parse('/help givebucks');
		}
	},

	takebucks: 'removebucks',
	removebucks: function(target, room, user) {
		if(!user.can('hotpatch')) return this.sendReply('You do not have enough authority to do this.');
		if(!target) return this.parse('/help removebucks');
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
		var data = fs.readFileSync('config/money.csv','utf8')
		var match = false;
		var money = 0;
		var line = '';
		var row = (''+data).split("\n");
		for (var i = row.length; i > -1; i--) {
			if (!row[i]) continue;
			var parts = row[i].split(",");
			var userid = toUserid(parts[0]);
			if (targetUser.userid == userid) {
			var x = Number(parts[1]);
			var money = x;
			match = true;
			if (match === true) {
				line = line + row[i];
				break;
			}
			}
		}
		targetUser.money = money;
		targetUser.money -= takeMoney;
		if (match === true) {
			var re = new RegExp(line,"g");
			fs.readFile('config/money.csv', 'utf8', function (err,data) {
			if (err) {
				return console.log(err);
			}
			var result = data.replace(re, targetUser.userid+','+targetUser.money);
			fs.writeFile('config/money.csv', result, 'utf8', function (err) {
				if (err) return console.log(err);
			});
			});
		} else {
			var log = fs.createWriteStream('config/money.csv', {'flags': 'a'});
			log.write("\n"+targetUser.userid+','+targetUser.money);
		}
		var p = 'bucks';
		if (takeMoney < 2) p = 'buck';
		this.sendReply(targetUser.name + ' has had ' + takeMoney + ' ' + p + ' removed. This user now has ' + targetUser.money + ' bucks.');
		targetUser.send(user.name + ' has removed ' + takeMoney + ' bucks from you.');
		} else {
			return this.parse('/help removebucks');
		}
	},

	buy: function(target, room, user) {
		if (!target) return this.parse('/help buy');
		if (closeShop) return this.sendReply('The shop is currently closed and will open shortly.');
		var data = fs.readFileSync('config/money.csv','utf8')
		var match = false;
		var money = 0;
		var line = '';
		var row = (''+data).split("\n");
		for (var i = row.length; i > -1; i--) {
			if (!row[i]) continue;
			var parts = row[i].split(",");
			var userid = toUserid(parts[0]);
			if (user.userid == userid) {
			var x = Number(parts[1]);
			var money = x;
			match = true;
			if (match === true) {
				line = line + row[i];
				break;
			}
			}
		}
		user.money = money;
		var price = 0;
		if (target === 'symbol') {
			price = 5;
			if (price <= user.money) {
				user.money = user.money - price;
				this.sendReply('You have purchased a custom symbol. You will have this until you log off for more than an hour.');
				this.sendReply('Use /customsymbol [symbol] to change your symbol now!');
				user.canCustomSymbol = true;
				this.add(user.name + ' has purchased a custom symbol!');
			} else {
				return this.sendReply('You do not have enough bucks for this. You need ' + (price - user.money) + ' more bucks to buy ' + target + '.');
			}
		}
		if (target === 'custom') {
			price = 20;
			if (price <= user.money) {
				user.money = user.money - price;
				this.sendReply('You have purchased a custom avatar. You need to message an Admin capable of adding (Ask BlakJack or Skarr).');
				user.canCustomAvatar = true;
				this.add(user.name + ' has purchased a custom avatar!');
			} else {
				return this.sendReply('You do not have enough bucks for this. You need ' + (price - user.money) + ' more bucks to buy ' + target + '.');
			}
		}
		if (target === 'animated') {
			price = 35;
			if (price <= user.money) {
				user.money = user.money - price;
				this.sendReply('You have purchased a custom animated avatar. You need to message an Admin capable of adding (BlakJack or Skarr).');
				user.canAnimatedAvatar = true;
				this.add(user.name + ' has purchased a custom animated avatar!');
			} else {
				return this.sendReply('You do not have enough bucks for this. You need ' + (price - user.money) + ' more bucks to buy ' + target + '.');
			}
		}
		if (target === 'room') {
			price = 100;
			if (price <= user.money) {
				user.money = user.money - price;
				this.sendReply('You have purchased a chat room. You need to message an Admin so that the room can be made.');
				user.canChatRoom = true;
				this.add(user.name + ' has purchased a chat room!');
			} else {
				return this.sendReply('You do not have enough bucks for this. You need ' + (price - user.money) + ' more bucks to buy ' + target + '.');
			}
		}
		if (target === 'trainer') {
			price = 30;
			if (price <= user.money) {
				user.money = user.money - price;
				this.sendReply('You have purchased a trainer card. You need to message an Admin capable of adding this (BlakJack or Skarr).');
				user.canTrainerCard = true;
				this.add(user.name + ' has purchased a trainer card!');
			} else {
				return this.sendReply('You do not have enough bucks for this. You need ' + (price - user.money) + ' more bucks to buy ' + target + '.');
			}
		}
		if (target === 'fix') {
			price = 10;
			if (price <= user.money) {
				user.money = user.money - price;
				this.sendReply('You have purchased the ability to alter your avatar or trainer card. You need to message an Admin capable of adding this (BlakJack or Skarr).');
				user.canFixItem = true;
				this.add(user.name + ' has purchased the ability to set alter their card or avatar!');
			} else {
				return this.sendReply('You do not have enough bucks for this. You need ' + (price - user.money) + ' more bucks to buy ' + target + '.');
			}
		}
		if (target === 'declare') {
			price = 25;
			if (price <= user.money) {
				user.money = user.money - price;
				this.sendReply('You have purchased the ability to declare (from Admin). To do this message an Admin (~) with the message you want to send. Keep it sensible!');
				user.canDecAdvertise = true;
				this.add(user.name + ' has purchased the ability to declare from an Admin!');
			} else {
				return this.sendReply('You do not have enough bucks for this. You need ' + (price - user.money) + ' more bucks to buy ' + target + '.');
			}
		}
				if (match === true) {
			var re = new RegExp(line,"g");
			fs.readFile('config/money.csv', 'utf8', function (err,data) {
			if (err) {
				return console.log(err);
			}
			var result = data.replace(re, user.userid+','+user.money);
			fs.writeFile('config/money.csv', result, 'utf8', function (err) {
				if (err) return console.log(err);
			});
			});
		} else {
					var log = fs.createWriteStream('config/money.csv', {'flags': 'a'});
					log.write("\n"+user.userid+','+user.money);
				}
		
			var bunnywheel = 0;
		var stringbit = 0;
		if (target === 'coin') { 
		// change costV
		bunnywheel = 100;
		// change cost^
		take = true;
		hipe = user;
		amount = bunnywheel;
		checkatm = bank.bucks(hipe, amount, take);
		    if (checkatm == true) {

                  hipe = user;
                             //change payoutV
				  amount = 1;
		            // change payout^
				  take = false;
				  bank.coins(hipe, amount);
				this.sendReply('You put together ' +bunnywheel +' bucks and put it in change machine!');
				this.add('!!!' + user.name + ' has activated the change machine and through hardwork and the sacrifice of many innocent bucks has made one whole coin!');
			} else {
                return this.sendReply('You do not have enough bucks to do this! You need ' + (bunnywheel - user.money) + ' more bucks to make a coin!');
            } 
			}
			
			if (target == 'buck')
		{
		// change costV
		bitshredder = 1;
		//change cost^
		take = true;
		hipe = user;
		russianfunny = bitshredder;
		checkatm = bank.coins(hipe, russianfunny, take);
		    if (checkatm == true) {

                  hipe = user;    
                                   //change payoutV
				  russianfunny = 100;
				  // change payout^
				  take = false;
				  bank.bucks(hipe, russianfunny);
				this.sendReply('You put a coin into the change machine!');
				this.add('!!!' + user.name + ' has activated the change machine and dropped a coin into it! as it lets out a  faint scream and 100 bucks come out!');
			} else {
                return this.sendReply('You do not have enough coins to do this! You need ' + (bitshredder - user.coins) + ' more coins to make 100 bucks!');
            } 
			}
	
                        


				

	},

	customsymbol: function(target, room, user) {
		if(!user.canCustomSymbol) return this.sendReply('You need to buy this item from the shop to use.');
		if(!target || target.length > 1) return this.sendReply('/customsymbol [symbol] - changes your symbol (usergroup) to the specified symbol. The symbol can only be one character');
		var a = target;
		if (a === "+" || a === "$" || a === "%" || a === "@" || a === "&" || a === "~" || a === "#" || a === "a" || a === "b" || a === "c" || a === "d" || a === "e" || a === "f" || a === "g" || a === "h" || a === "i" || a === "j" || a === "k" || a === "l" || a === "m" || a === "n" || a === "o" || a === "p" || a === "q" || a === "r" || a === "s" || a === "t" || a === "u" || a === "v" || a === "w" || a === "x" || a === "y" || a === "z") {
			return this.sendReply('Sorry, but you cannot change your symbol to this for safety/stability reasons.');
		}
		user.getIdentity = function(){
			if(this.muted)	return '!' + this.name;
			if(this.locked) return '‽' + this.name;
			return target + this.name;
		};
		user.updateIdentity();
		user.canCustomSymbol = false;
	},



	
	shop: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><h4><b><u>Kill The Noise Shop</u></b></h4><table border="1" cellspacing ="0" cellpadding="3"><tr><th>Command</th><th>Description</th><th>Cost</th></tr>' +
			'<tr><td>Symbol</td><td>Buys a custom symbol to go infront of name and puts you at top of userlist (temporary until restart)</td><td>5</td></tr>' +
			'<tr><td>Custom</td><td>Buys a custom avatar to be applied to your name (you supply)</td><td>20</td></tr>' +
			'<tr><td>Animated</td><td>Buys an animated avatar to be applied to your name (you supply)</td><td>35</td></tr>' +
			'<tr><td>Room</td><td>Buys a chatroom for you to own (within reason, can be refused)</td><td>100</td></tr>' +
			'<tr><td>Trainer</td><td>Buys a trainer card which shows information through a command such as /blakjack (note: third image costs 10 bucks extra, ask for more details)</td><td>40</td></tr>' +
			'<tr><td>Fix</td><td>Buys the ability to alter your current custom avatar or trainer card (don\'t buy if you have neither)!</td><td>10</td></tr>' +
			'<tr><td>Declare</td><td>You get the ability to get two declares from an Admin in lobby. This can be used for league advertisement (not server)</td><td>25</td></tr>' +
			'</table><center><table border="1" cellspacing ="0" cellpadding="4"><tr><th>Command</th><th>change converter!</th><th>PAYOUT</th></tr>' +
		        '<tr><td>coin</td><td>Turns <b>100 bucks</b> into <b>1 coin</b>!</td><td>1 coin</td></tr>' +
		        '<tr><td>buck</td><td>Turns <b>1 coin</b> into <b>100 bucks</b>!</td><td>100 bucks</td></tr>' +
			'</table><br />To buy an item from the shop, use /buy [command]. <br />Also do /moneycommands to view money based commands.</center>'
			);
		if (closeShop) return this.sendReply('|raw|<center><h3><b>The shop is currently closed and will open shortly.</b></h3></center>');
	},

	lockshop: 'closeshop',
	closeshop: function(target, room, user) {
		if (!user.can('hotpatch')) return this.sendReply('You do not have enough authority to do this.');

		if(closeShop && closedShop === 1) closedShop--;

		if (closeShop) {
			return this.sendReply('The shop is already closed. Use /openshop to open the shop to buyers.');
		}
		else if (!closeShop) {
			if (closedShop === 0) {
				this.sendReply('Are you sure you want to close the shop? People will not be able to buy anything. If you do
