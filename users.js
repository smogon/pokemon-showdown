var users = {};
var numUsers = 0;
var people = {};
var numPeople = 0;

function getTime()
{
	return new Date().getTime();
}
function toId(text)
{
	text = text || '';
	return text.replace(/ /g, '');
}
function toUserid(name)
{
	return name.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function getUser(name, socket, token, room)
{
	if (name === '!') return null;
	if (!name && !socket) return null;
	if (name && name.userid) return name;
	var userid = toUserid(name);
	if (socket)
	{
		return connectUser(name, socket, token, room);
	}
	return users[userid];
}
function connectUser(name, socket, token, room)
{
	var userid = toUserid(name);
	var user;
	var person;
	if (users[userid])
	{
		user = users[userid];
		person = user.add(name, socket, token);
		if (!person)
		{
			console.log("NEW USER: [guest] (userid: "+userid+" taken) "+name);
			user = new User('', socket, token);
			person = user.people[0];
			user.rename(name, token);
		}
	}
	else
	{
		console.log("NEW USER: [guest] "+name);
		user = new User(name, socket, token);
		person = user.people[0];
	}
	if (room)
	{
		user.joinRoom(room, person);
	}
	return person;
}

function User(name, socket, token)
{
	var selfP = this;
	
	numUsers++;
	
	if (!token)
	{
		//token = ''+Math.floor(Math.random()*10000);
		token = ''+socket.id;
	}
	this.token = token;
	this.guestNum = numUsers;
	this.name = 'Guest '+numUsers;
	this.named = false;
	this.renamePending = false;
	this.authenticated = false;
	this.userid = toUserid(this.name);
	this.group = ' ';
	this.muted = false;
	
	var trainersprites = [1, 2, 101, 102, 169, 170];
	this.avatar = trainersprites[parseInt(Math.random()*trainersprites.length)];
	
	this.connected = true;
	
	console.log("NEW PERSON: "+socket.id);
	this.people = [new Person(name,socket,selfP)];
	this.ip = this.people[0].ip;
	
	this.sides = {};
	this.roomCount = {};
	
	this.emit = function(message, data) {
		var roomid = false;
		if (data && data.room)
		{
			roomid = data.room;
		}
		for (var i=0; i<selfP.people.length; i++)
		{
			if (roomid && !selfP.people[i].rooms[roomid]) continue;
			selfP.people[i].socket.emit(message, data);
		}
	};
	this.getIdentity = function() {
		if (selfP.muted)
		{
			return '!'+selfP.name;
		}
		return selfP.group+selfP.name;
	};
	this.isMod = function() {
		return (selfP.group === '&' || selfP.group === '@' || selfP.group === '%' /* || selfP.group === '+' */ );
	};
	this.canMod = function(group) {
		switch (selfP.group)
		{
		case '&':
			return true;
			break;
		case '@':
			return (group !== '&');
			break;
		case '%':
			return (group === '+' || group === ' ');
			break;
		case '+':
			//return (group === ' ');
			break;
		}
		return false;
	};
	this.forceRename = function(name, authenticated) {
		// skip the login server
		var userid = toUserid(name);
		
		if (users[userid] && users[userid] !== selfP) return false;
		if (typeof authenticated === 'undefined' && userid === selfP.userid)
		{
			authenticated = selfP.authenticated;
		}
		
		selfP.name = name;
		var oldid = selfP.userid;
		delete users[oldid];
		selfP.userid = userid;
		users[selfP.userid] = selfP;
		selfP.authenticated = (authenticated || false);
		
		if (config.localsysop && selfP.ip === '127.0.0.1')
		{
			selfP.group = '&';
		}
		
		for (var i=0; i<selfP.people.length; i++)
		{
			selfP.people[i].rename(name, oldid);
			console.log(''+name+' renaming: socket '+i+' of '+selfP.people.length);
			selfP.people[i].socket.emit('update', {
				name: name,
				userid: selfP.userid,
				named: true,
				token: token
			});
		}
		var joining = !selfP.named;
		selfP.named = true;
		for (var i in selfP.roomCount)
		{
			getRoom(i).rename(selfP, oldid, joining);
		}
		return true;
	};
	this.resetName = function() {
		var name = 'Guest '+selfP.guestNum;
		var userid = toUserid(name);
		
		var i = 0;
		while (users[userid] && users[userid] !== selfP)
		{
			selfP.guestNum++;
			name = 'Guest '+selfP.guestNum;
			userid = toUserid(name);
			if (i > 1000) return false;
		}
		
		selfP.name = name;
		var oldid = selfP.userid;
		delete users[oldid];
		selfP.userid = userid;
		users[selfP.userid] = selfP;
		selfP.authenticated = false;
		
		for (var i=0; i<selfP.people.length; i++)
		{
			selfP.people[i].rename(name, oldid);
			console.log(''+name+' renaming: socket '+i+' of '+selfP.people.length);
			selfP.people[i].socket.emit('update', {
				name: name,
				userid: selfP.userid,
				named: false,
				token: token
			});
		}
		selfP.named = false;
		for (var i in selfP.roomCount)
		{
			getRoom(i).rename(selfP, oldid, false);
		}
		return true;
	};
	this.rename = function(name, token) {
		if (!name) name = '';
		name = name.trim();
		if (name.length > 18) name = name.substr(0,18);
		var noStartChars = {'&':1,'@':1,'+':1,'!':1};
		while (noStartChars[name.substr(0,1)])
		{
			name = name.substr(1);
		}
		var userid = toUserid(name);
		
		if (!userid)
		{
			// technically it's not "taken", but if your client doesn't warn you
			// before it gets to this stage it's your own fault
			selfP.emit('nameTaken', {userid: '', reason: "You did not specify a name."});
			return false;
		}
		else if (userid === selfP.userid)
		{
			return selfP.forceRename(name, selfP.authenticated);
		}
		if (users[userid] && !users[userid].authenticated && users[userid].connected)
		{
			selfP.emit('nameTaken', {userid:selfP.userid, token:token, reason: "Someone is already using the name \""+users[userid].name+"\"."});
			return false;
		}
		selfP.renamePending = true;
		// todo: sanitize
		
		// This is ridiculous spaghetti code because I made a mistake in the authentication protocol earlier
		// this should hopefully fix it while remaining backwards-compatible
		var loginservertoken = 'novawave.ca';
		var tokens = [''];
		if (token) tokens = token.split('::');
		if (tokens[1]) loginservertoken = tokens[1];
		token = tokens[0];
		
		console.log('POSTING TO SERVER: loginserver/action.php?act=verifysessiontoken&servertoken='+loginservertoken+'&userid='+userid+'&token='+token);
		request({
			uri: config.loginserver+'action.php?act=verifysessiontoken&servertoken='+loginservertoken+'&userid='+userid+'&token='+token,
		}, function(error, response, body) {
			selfP.renamePending = false;
			if (body)
			{
				console.log('BODY: "'+body+'"');
				
				if (users[userid] && !users[userid].authenticated && users[userid].connected)
				{
					selfP.emit('nameTaken', {userid:selfP.userid, token:token, reason: "Someone is already using the name \""+users[userid].name+"\"."});
					return false;
				}
				var group = ' ';
				var avatar = 0;
				var authenticated = false;
				if (body !== '1')
				{
					authenticated = true;
					
					if (userid === "serei") avatar = 172;
					else if (userid === "hobsgoblin") avatar = 52;
					else if (userid === "etherealsol") avatar = 1001;
					else if (userid === "mortygymleader") avatar = 144;
					else if (userid === "leadermorty") avatar = 144;
					else if (userid === "leaderjasmine") avatar = 146;
					else if (userid === "championcynthia") avatar = 260;
					else if (userid === "elitefourlorelei") avatar = 1002;
					else if (userid === "aeo") avatar = 167;
					else if (userid === "aeo1") avatar = 167;
					else if (userid === "aeo2") avatar = 166;
					else if (userid === "sharktamer") avatar = 7;
					else if (userid === "bmelts") avatar = 226;
					
					try
					{
						var data = JSON.parse(body);
						switch (data.group)
						{
						case '2':
							group = '&';
							break;
						case '3':
							group = '+';
							break;
						case '4':
							group = '%';
							break;
						case '5':
							group = '@';
							break;
						}
						/* var userdata = JSON.parse(body.userdata);
						avatar = parseInt(userdata.trainersprite);
						if (!avatar || avatar > 263 || avatar < 1)
						{
							avatar = 0;
						} */
					}
					catch(e)
					{
					}
				}
				if (users[userid])
				{
					// This user already exists; let's merge
					if (selfP === users[userid])
					{
						// !!!
						return true;
					}
					for (var i in selfP.roomCount)
					{
						getRoom(i).leave(selfP);
					}
					for (var i=0; i<selfP.people.length; i++)
					{
						console.log(''+selfP.name+' preparing to merge: socket '+i+' of '+selfP.people.length);
						users[userid].merge(selfP.people[i]);
					}
					selfP.roomCount = {};
					selfP.people = [];
					selfP.connected = false;
					if (!selfP.authenticated)
					{
						selfP.group = ' ';
					}
					
					users[userid].group = group;
					if (avatar) users[userid].avatar = avatar;
					users[userid].authenticated = authenticated;
					return true;
				}
				
				// rename success
				selfP.token = token;
				selfP.group = group;
				if (avatar) selfP.avatar = avatar;
				return selfP.forceRename(name, authenticated);
			}
			else if (tokens[1])
			{
				console.log('BODY: ""');
				// rename failed, but shouldn't
				selfP.emit('nameTaken', {userid:userid, name:name, token:token, reason: "Your authentication token was invalid."});
			}
			else
			{
				console.log('BODY: ""');
				// rename failed
				selfP.emit('nameTaken', {userid:userid, name:name, token:token, reason: "The name you chose is registered"});
			}
			return false;
		});
	};
	this.add = function(name, socket, token) {
		// name is ignored - this is intentional
		if (selfP.token !== token)
		{
			return false;
		}
		selfP.connected = true;
		console.log("NEW PERSON: "+socket.id+" (add)");
		var newPerson = new Person(name, socket, selfP);
		selfP.people.push(newPerson);
		selfP.ip = newPerson.ip;
		return newPerson;
	};
	this.merge = function(person) {
		selfP.connected = true;
		var oldid = person.userid;
		selfP.people.push(person);
		person.rename(selfP.name, oldid);
		console.log(''+selfP.name+' merging: socket '+person.socket.id+' of ');
		person.socket.emit('update', {
			name: selfP.name,
			userid: selfP.userid,
			named: true,
			token: selfP.token
		});
		person.user = selfP;
		for (var i in person.rooms)
		{
			if (!selfP.roomCount[i])
			{
				person.rooms[i].join(selfP);
				selfP.roomCount[i] = 0;
			}
			selfP.roomCount[i]++;
		}
	};
	this.debugData = function() {
		var str = ''+selfP.group+selfP.name+' ('+selfP.userid+')';
		for (var i=0; i<selfP.people.length; i++)
		{
			var person = selfP.people[i];
			str += ' socket'+i+'[';
			var first = true;
			for (var j in person.rooms)
			{
				if (first) first=false;
				else str+=',';
				str += j;
			}
			str += ']';
		}
		if (!selfP.connected) str += ' (DISCONNECTED)';
		return str;
	};
	this.disconnect = function(socket) {
		var person = null;
		for (var i=0; i<selfP.people.length; i++)
		{
			if (selfP.people[i].socket === socket)
			{
				console.log('DISCONNECT: '+selfP.userid);
				if (selfP.people.length <= 1)
				{
					selfP.connected = false;
					if (!selfP.authenticated)
					{
						selfP.group = ' ';
					}
				}
				person = selfP.people[i];
				for (var j in person.rooms)
				{
					selfP.leaveRoom(person.rooms[j], socket);
				}
				person.user = null;
				selfP.people.splice(i,1);
				break;
			}
		}
		if (!selfP.people.length)
		{
			// cleanup
			for (var i in selfP.roomCount)
			{
				if (selfP.roomCount[i] > 0)
				{
					// should never happen.
					console.log('!! room miscount: '+i+' not left');
					getRoom(i).leave(selfP);
				}
			}
			selfP.roomCount = {};
		}
	};
	this.ban = function(noRecurse) {
		bannedIps[selfP.ip] = selfP.userid;
		// no need to recurse, since the root for-loop already bans everything with your IP
		if (!noRecurse) for (var i in users)
		{
			if (users[i].ip === selfP.ip)
			{
				users[i].ban(true);
			}
		}
		selfP.destroy();
	};
	this.destroy = function() {
		// banned!
		var person = null;
		selfP.connected = false;
		for (var i=0; i<selfP.people.length; i++)
		{
			console.log('DESTROY: '+selfP.userid);
			person = selfP.people[i];
			person.user = null;
			person.socket.emit('console', 'You were banned.');
			for (var j in person.rooms)
			{
				selfP.leaveRoom(person.rooms[j], person);
			}
		}
		selfP.people = [];
	};
	this.joinRoom = function(room, socket) {
		roomid = room?(room.id||room):'';
		room = getRoom(room);
		var person = null;
		//console.log('JOIN ROOM: '+selfP.userid+' '+room.id);
		if (!socket)
		{
			for (var i=0; i<selfP.people.length;i++)
			{
				// only join full clients, not pop-out single-room
				// clients
				if (selfP.people[i].rooms['lobby'])
				{
					selfP.joinRoom(room, selfP.people[i]);
				}
			}
			return;
		}
		else if (socket.socket)
		{
			person = socket;
			socket = person.socket;
		}
		if (!socket) return;
		else
		{
			var i=0;
			while (selfP.people[i].socket !== socket) i++;
			if (selfP.people[i].socket === socket)
			{
				person = selfP.people[i];
			}
		}
		if (person && !person.rooms[room.id])
		{
			person.rooms[room.id] = room;
			if (!selfP.roomCount[room.id])
			{
				selfP.roomCount[room.id]=1;
				room.join(selfP);
			}
			else
			{
				selfP.roomCount[room.id]++;
				room.initSocket(selfP, socket);
			}
		}
		else if (person && room.id === 'lobby')
		{
			person.socket.emit('init', {room: roomid, notFound: true});
		}
	};
	this.leaveRoom = function(room, socket) {
		room = getRoom(room);
		for (var i=0; i<selfP.people.length; i++)
		{
			if (selfP.people[i] === socket || selfP.people[i].socket === socket || !socket)
			{
				if (selfP.people[i].rooms[room.id])
				{
					if (selfP.roomCount[room.id])
					{
						selfP.roomCount[room.id]--;
						if (!selfP.roomCount[room.id])
						{
							room.leave(selfP);
							delete selfP.roomCount[room.id];
						}
					}
					delete selfP.people[i].rooms[room.id];
				}
				if (socket)
				{
					break;
				}
			}
		}
		if (!socket && selfP.roomCount[room.id])
		{
			room.leave(selfP);
			delete selfP.roomCount[room.id];
		}
	};
	
	// challenges
	this.challengesFrom = {};
	this.challengeTo = null;
	this.lastChallenge = 0;
	
	this.updateChallenges = function() {
		selfP.emit('update', {
			challengesFrom: selfP.challengesFrom,
			challengeTo: selfP.challengeTo,
		});
	};
	this.makeChallenge = function(user, format, isPrivate) {
		user = getUser(user);
		if (!user || selfP.challengeTo)
		{
			return false;
		}
		if (getTime() < selfP.lastChallenge + 10000)
		{
			// 10 seconds ago
			return false;
		}
		var time = getTime();
		var challenge = {
			time: time,
			from: selfP.userid,
			to: user.userid,
			format: ''+(format||''),
			isPrivate: !!isPrivate
		};
		selfP.lastChallenge = time;
		selfP.challengeTo = challenge;
		user.challengesFrom[selfP.userid] = challenge;
		selfP.updateChallenges();
		user.updateChallenges();
	};
	this.cancelChallengeTo = function() {
		if (!selfP.challengeTo) return true;
		var user = getUser(selfP.challengeTo.to);
		if (user) delete user.challengesFrom[selfP.userid];
		selfP.challengeTo = null;
		selfP.updateChallenges();
		if (user) user.updateChallenges();
	};
	this.rejectChallengeFrom = function(user) {
		var userid = toUserid(user);
		user = getUser(user);
		if (selfP.challengesFrom[userid])
		{
			delete selfP.challengesFrom[userid];
		}
		if (user)
		{
			delete selfP.challengesFrom[user.userid];
			if (user.challengeTo && user.challengeTo.to === selfP.userid)
			{
				user.challengeTo = null;
				user.updateChallenges();
			}
		}
		selfP.updateChallenges();
	};
	this.acceptChallengeFrom = function(user) {
		var userid = toUserid(user);
		user = getUser(user);
		if (!user || !user.challengeTo || user.challengeTo.to !== selfP.userid)
		{
			if (selfP.challengesFrom[userid])
			{
				delete selfP.challengesFrom[userid];
				selfP.updateChallenges();
			}
			return false;
		}
		getRoom('lobby').startBattle(selfP, user, user.challengeTo.format);
		delete selfP.challengesFrom[user.userid];
		user.challengeTo = null;
		selfP.updateChallenges();
		user.updateChallenges();
		return true;
	};
	
	// initialize
	users[selfP.userid] = selfP;
	if (name)
	{
		selfP.rename(name,token);
	}
}

function Person(name, socket, user)
{
	var selfP = this;
	
	this.named = true;
	this.name = name;
	this.userid = toUserid(name);
	
	this.socket = socket;
	this.rooms = {};
	
	this.user = user;
	
	{
		numPeople++;
		while (people['p'+numPeople])
		{
			// should never happen
			numPeople++;
		}
		this.id = 'p'+numPeople;
		people[this.id] = selfP;
	}
	
	this.rename = function(name) {
		selfP.name = name;
		selfP.userid = toUserid(selfP.name);
	};
	
	this.ip = '';
	if (socket.handshake && socket.handshake.address && socket.handshake.address.address)
	{
		this.ip = socket.handshake.address.address;
	}
	
	if (bannedIps[this.ip])
	{
		// gonna kill this
		this.banned = true;
	}
}

exports.getUser = getUser;
