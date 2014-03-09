exports.cmds = {
startmoney: function (target, room, user) {
if(this.can('derp')){
if(money.started == true){ 
this.sendReply('Money is already on.'); 
return false
}
if(money.started == false) {
money.started = true;
room.addRaw('<b>Money has been started, hopefully all the bugs have been fixed. If you have any bug reports please pm bandi or one of our tech support<b>')
} 
else { 
return false
}
}
},
givemoney: function (target, room, user) {
		if(money.started == false){ 
		this.sendReply('Money isn\'t on yet, we are fixing bugs'); 
		return false
		}
		else {
		money.read(user);
		if (user.bp.dollars < 1) {
			return this.sendReply('You do not have enough dollars to give.');
		} else {
		targets = target.split(',');
		target = toId(targets[0]);
		var targetUser = Users.get(target);
		if (!targetUser) return this.sendReply('The user ' + targetUser + ' was not found.');
		var givemoney = parseInt(targets[1]);
		if (isNaN(givemoney)) return this.sendReply('Invalid sum of dollars.');
		if (givemoney < 1) return this.sendReply('Invalid sum of dollars.');
		if (givemoney > user.bp.dollars) return this.sendReply('You cannot give more than your own BP.');
		targetUser.bp.dollars += givemoney;
		user.bp.dollars -= givemoney;
		money.save(user)
		this.sendReply(targetUser.name + ' has received ' + givemoney + ' dollars from you.');
		}
		}
	},

	givetkt: function (target, room, user) {
		if(money.started == false){ 
		this.sendReply('Money isn\'t on yet, we are fixing bugs'); 
		return false
		}
	    else {
		money.read(user);
		if (user.bp.tkts < 1) return this.sendReply('You do not have enough tickets to give.');
		targets = target.split(',');
		target = toId(targets[0]);
		var targetUser = Users.get(target);
		if (!targetUser) return this.sendReply('The user ' + target + ' was not found.');
		var givetkt = parseInt(targets[1]);
		if (isNaN(givetkt)) return this.sendReply('Invalid number of tickets.');
		if (givetkt < 1) return this.sendReply('Invalid number of tickets.');
		if (givetkt > user.bp.tkts) return this.sendReply('You cannot give more than your own tickets.');
		targetUser.bp.tkts += givetkt;
		user.bp.tkts -= givetkt;
		money.save(user)
		this.sendReply(targetUser.name + ' has received ' + givetkt + ' ticket(s) from you.');
		}
	},

	//money commands for admins
	
	award: 'awardmoney',
	awardmoney: function (target, room, user) {
		if(money.started == false){ this.sendReply('Money isn\'t on yet, we are fixing bugs'); 
		return false
		}
		else {
		if (!user.can('hotpatch')) return false;
		targets = target.split(',');
		target = toId(targets[0]);
		var targetUser = Users.get(target);
		if (!targetUser) return this.sendReply('The user ' + targetUser + ' was not found.');
		var addmoney = parseInt(targets[1]);
		if (isNaN(addmoney)) return this.sendReply('Invalid sum of money.');
		targetUser.bp.dollars += addmoney;
		money.save(targetUser);
		this.sendReply(targetUser.name + ' has received ' + addmoney + ' dollars.');
		if (Rooms.rooms.staff) Rooms.rooms.staff.addRaw(targetUser.name + ' has received ' + addmoney + ' dollars from ' + user.name);
	    }
	},

	rmvbp: 'removemoney',
	rmvmoney: 'removemoney',
	removemoney: function (target, room, user) {
		if(money.started == false){ 
		this.sendReply('Money isn\'t on yet, we are fixing bugs'); 
		return false;
		}
		else {
		if (!user.can('hotpatch')) return false;
		targets = target.split(',');
		target = toId(targets[0]);
		var targetUser = Users.get(target);
		if (!targetUser) return this.sendReply('The user ' + targetUser + ' was not found.');
		var removemoney = parseInt(targets[1]);
		if (isNaN(removemoney)) return this.sendReply('Invalid sum of dollars.');
		if (removemoney > targetUser.bp.dollars) return this.sendReply('Invalid sum of dollars.');
		targetUser.bp.dollars -= removemoney;
		money.save(targetUser)
		this.sendReply(targetUser.name + ' has had ' + removemoney + ' dollars removed from their bagpack.');
		if (Rooms.rooms.staff) Rooms.rooms.staff.addRaw(targetUser.name + ' has had ' + removemoney + ' dollars removed from their bagpack by ' + user.name);
	    }
	},
	awardtkt: function (target, room, user) {
		if(money.started == false){ 
		this.sendReply('Money isn\'t on yet, we are fixing bugs');
		return false;
        }		
		else {
		if (!user.can('hotpatch')) return false;
		targets = target.split(',');
		target = toId(targets[0]);
		var targetUser = Users.get(target);
		if (!targetUser) return this.sendReply('The user ' + targetUser + ' was not found.');
		var addtkt = parseInt(targets[1]);
		if (isNaN(addtkt)) return this.sendReply('Invalid number of tickets.');
		else
		targetUser.bp.tkts += addtkt;
		money.save(targetUser)
		this.sendReply(targetUser.name + ' has received ' + addtkt + ' ticket(s).');
		if (Rooms.rooms.staff) Rooms.rooms.staff.addRaw(targetUser.name + ' has received ' + addtkt + ' ticket(s) from ' + user.name);
	    }
	},

	rmvtkt: function (target, room, user) {
	    if(money.started == false){ 
		this.sendReply('Money isn\'t on yet, we are fixing bugs'); 
		return false
		}
	    else {
		if (!user.can('hotpatch')) return false;
		targets = target.split(',');
		target = toId(targets[0]);
		var targetUser = Users.get(target);
		if (!targetUser) return this.sendReply('The user ' + targetUser + ' was not found.');
		var removeticket = parseInt(targets[1]);
		if (isNaN(removemoney)) return this.sendReply('Invalid number of tickets.');
		if (removeticket > targetUser.bp.tkts) return this.sendReply('Invalid number of tickets.');
		targetUser.bp.tkts-= removeticket;
		money.save(targetUser)
		this.sendReply(targetUser.name + ' has had ' + removeticket + ' tickets removed from their bagpack.');
		if (Rooms.rooms.staff) Rooms.rooms.staff.addRaw(targetUser.name + ' has had ' + removeticket + ' tickets removed from their bagpack by ' + user.name);
	    }
	},

	//Check everyone on server if they have over a certain amount of money 
	checkallmoney: function (target, room, user) {
		if(money.started == false){ 
		this.sendReply('Money isn\'t on yet, we are fixing bugs'); 
		return false
		}
		else {
		if (!user.can('hotpatch')) return false;
		if(isNaN(target))
		if (!target) return this.sendReply('You need to enter in a value to search.');
        else
		var x = '';
		for (var i in Users.users) {
			if (Users.users[i].bp.dollars == target || Users.users[i].bp.dollars > target) {
				x += Users.users[i].name + ' : ' + Users.users[i].bp.dollars;
				x += ', ';
			}
			//if (i < room.users.length) x += ', ';
		}
		if (!x) return this.sendReply('No user has over that amount.');

		this.sendReply('Users in this room with over ' + target + ' Battle Points:');
		this.sendReply(x);
		}
	},

	//Check everyone on server if they have over a certain amount of tickets 
	checkalltickets: function (target, room, user) {
		if(money.started == false){ 
		this.sendReply('Money isn\'t on yet, we are fixing bugs'); 
		return false
		}
		else {
		if (!user.can('hotpatch')) return false;
		if(isNaN(target))
		if (!target) return this.sendReply('You need to enter in a value to search.');

		var x = '';
		for (var i in Users.users) {
			if (Users.users[i].bp.tkts === target || Users.users[i].bp.tkts > target) {
				x += Users.users[i].name + ' : ' + Users.users[i].bp.tkts;
				x += ',';
			}
			
		}
		if (!x) return this.sendReply('No user has over that amount.');

		this.sendReply('Users in this room with over ' + target + ' Tickets:');
		this.sendReply(x);
		}
	},

	//DO NOT USE UNLESS NEEDED OTHERWISE IT WILL WIPE EVERYONE'S MONEY AND TICKETS
	clearallbags: function (target, room, user) {
		if(money.started == false){ 
		this.sendReply('Money isn\'t on yet, we are fixing bugs'); 
		return false
		}
	    else {
		if (!user.can('hotpatch')) return false;
		if (!target) return this.sendReply('What you are about to do will clear EVERYONE\'S BAG of money and tickets. Do /clearallbags yes if you want to.');
		var target = target.toLowerCase();
		if (target !== 'yes') return this.sendReply('What you are about to do will clear EVERYONE\'S BAG of money and tickets. Do /clearallbags yes if you want to.');
		else
		money.reset(user)
		this.sendReply('All users bags have been emptied.');
		if (Rooms.rooms.staff) Rooms.rooms.staff.addRaw(user.name + ' has removed all tickets and Battle Points from everyones bags.');
	    }
	},
	wallet: 'backpack',
	bag: 'backpack',
	bp: 'backpack',
	backpack: function (target, room, user) {
		if(money.started == false){ 
		this.sendReply('Money isn\'t on yet, we are fixing bugs'); 
		return false
		}
		else {
		if(!this.canBroadcast()) return;
		var targetuser = Users.get(target);
		if (targetuser) {
		money.read(user);
			this.sendReply(targetuser.name + ' backpack contains:');
			this.sendReply('- Dollars: ' + targetuser.bp.dollars);
			this.sendReply('- Tickets: ' + targetuser.bp.tkts);
		} else {
		money.read(user);
			this.sendReply('Your backpack contains:');
			this.sendReply('- Dollars: ' + user.bp.dollars);
			this.sendReply('- Tickets: ' + user.bp.tkts);
		}
		}
	},

	moneyintro: function (target, room, user) {
		this.sendReplyBox('<h2>Money Commands</h2><br /><hr />' +
			'<h3>Every User Commands</h3><br /><hr />' +
			'/buy <em>Use this to buy a item\'s id</em><br />' +
			'/bet <em> Bet a color on the roulette.</em><br />' +
			'/scratchtkt <em> Not done but will allow you to scratch a ticket there will be chances to the amount you win. </em><br />'+
			'<h3>Voice And Up Commands</h3><br /><hr />' +
			'!shop <em>Allows a voiced user to show the shop.</em><br />' +
			'!moneyintro <em>Shows you this.</em><br />' +
			'!emotes <em>Shows the emote list.</em>' +
			'<h3>Driver And Up Commands</h3><br /><hr />' +
			'/roul <em> Starts a roulette this  will not work in lobby.</em><br />' +
			'/spin <em>Spins the roulette.</em><br />' +
			'<h3>VIP Commands</h3><br /><hr />' +
			'/emote <em>Use ths with the emote ID to display a emote.</em><br />' +
			'/mark <em>Allows you to give yourself a custom sign. (not done yet)</em><br />' +
			'<h3>Admin And Bandi Commands</h3><br /><hr />' +
			'/award <em>Lets you give a user a amount of PokeDollars.</em><br />' +
			'/awardtkt <em> gives the user a amount tickets</em><br />' +
			'/rmvmoney <em> removes an amount of money from a user</em><br />' +
			'/rmvtkt <em>removes an amount of tickets from a user</em><br />' +
			'/checkalltickets <em>check everyone of their amount of tickets</em><br />' +
			'/checkallmoney <em>Checks every users money</em><br />' +
			'<h3>FAQ</h3><br /><hr />' +
			'How do I get Battle Points?: Win a Tournament or a Roulette.<br />' +
			'How do I get tickets? Buy them. Check the shop with /shop<br />' +
			'What is a Roulette? A virtual machine that spins and if it lands on the color you bet you win Battle Points.<br />' +
			'How do i check my Battle Points?: /bp or /wallet or /bag');
	},
	

	shop: function (target, room, user) {
		if (!this.canBroadcast()) return;
		if(money.started == false) this.sendReply('Money isn\'t on yet, we are fixing bugs');
		else
		this.sendReplyBox('<center></h4><table border="1" cellspacing ="0" cellpadding="4"><b>Welcome to our Shop. Spend your Dollars here!</b>' +
			'<tr>' +
			'<th>Item</th>' +
			'<th>Price</th>' +
			'<th>Description</th>' +
			'<th>ID</th>' +
			'</tr>' +
			'<td>Ticket</td>' +
			'<td>50 Dollars</td>' +
			'<td>A ticket</td>' +
			'<td>tkt</td>' +
			'</tr>' +
			'<tr>' +
			'<td>Ticket Reel</td>' +
			'<td>500 Dollars</td>' +
			'<td>A reel of Tickets [10 tkts]</td>' +
			'<td>reel</td>' +
			'</tr>' +
			'<td>Ticket Box</td>' +
			'<td>2500 Dollars</td>' +
			'<td>A box of Tickets [50 tkts]</td>' +
			'<td>box</td>' +
			'</tr>' +
			'<tr>' +
			'<td>Ticket Chest</td>' +
			'<td>5000 Dollars</td>' +
			'<td>A chest of Tickets [100 tkts]</td>' +
			'<td>chest</td>' +
			'</tr>' +
			'<tr>' +
			'<td>Ticket Truck</td>' +
			'<td>50,000 Dollars</td>' +
			'<td>A TRUCKLOAD OF TICKETS!  [1000 tkts]</td>' +
			'<td>truck</td>' +
			'</tr>' +
			'<tr>' +
			'<td>Avatar</td>' +
			'<td>5 Coins</td>' +
			'<td>A custom avatar sized 80px x 80px</td>' +
			'<td>ava</td>' +
			'</tr>' +
			'<tr>' +
			'<td>Voice</td>' +
			'<td>50 Coins</td>' +
			'<td>A promotion to Voice. For more details, use /groups.(this can be taken away)</td>' +
			'<td>voice</td>' +
			'</tr>'
			);
	},

	buy: function (target, room, user) {
		if(money.started == false){ 
		this.sendReply('Money isn\'t on yet, we are fixing bugs'); 
		return false;
		}
		else {
		if(!target){ 
		this.sendReply('Please specify a item.');
		return false;
		}
		}
		var tar = target;
		if(money.checkItem(target) == false){ 
		return this.sendReply('That item doesn\'t exist');
		return false;
		}
		else {
	money.read(user);
	var taritem = money.shop[target];
	if(taritem.price < user.bp.dollars || user.bp.dollars == taritem.price){
	this.sendReply('You have successfully purchased a ' + taritem.name + '.You benefit ' + taritem.benefits + ' from ' + taritem.name +'.');
	user.bp.dollars -= taritem.price;
	if(taritem.add){
	room.add(taritem.add)
	}
	if(taritem.tkts){
	user.bp.tkts += taritem.tkts;
	}
	if(taritem.say){
	this.parse(taritem.say)
	}
	if(taritem.userproperties){
	Object.merge(user, taritem.userproperties);
	}
	if(taritem.promo && config.groupsranking.indexOf(user.group) < config.groupsranking.indexOf(taritem.promo)){
	  Users.setOfflineGroup(user.userid, taritem.promo);
	}
	else if(taritem.promo && config.groupsranking.indexOf(user.group) > config.groupsranking.betxOf(taritem.promo)){ 
	this.sendReply('You are already ' + taritem.promo + 'or higher, your purchase was canceled.');
	}
	money.save(user)
	}
	else{
	this.sendReply('You do not have enough money to purchase that item.');
	return false;
	}
	}
	}
};
