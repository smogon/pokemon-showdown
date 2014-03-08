exports.bot = function(b){
var bot = ''
if(typeof b != "undefined")  bot = b
else  bot = {};


var botStuff = {
//This is the name of your bot. Edit as you please.
name: '~KazeBot',
//blahblahblah stuff for the bot
getRandjoke: function(){
var fs = require('fs');
var data = fs.readFileSync('./stuff/chatbot/jokes.txt','utf8'); 
var line = (''+data).split('/n');
var joke = line[Math.floor(Math.random()*line.length)]
return joke;
},
say: function(name,message,r,reply){
	if(!reply){
  return r.add('|c|' + name + '|' + message);
	}
	else {
		reply('|c|' + name + '|' + message)
	}
},
//By default u have to set the message of the day, but if you want to have one when your server first starts then edit it as you please.
MOTD: '',
//Also switch this to true if u want an MOTD to start automatically.
MOTDon: false,
//this is what your custom commands will start with, if u want it just as "/", then just put "/". Edit as you please
commandchar: '?',
//this is what you broadcast commands start with, if u want them as ! then just put !
brodcastchar: '$',
//The rest is of this is blahblah stuff edit if you know what you are doing.
Int: undefined,
spammers: new Array('gavigator','professorgavin','suk','ilikewangs','nharmoniag','gavgar','gym leader dukeeee','soles','soles shadow'),
//rated mature
spamwords: new Array('nigger','fag','feg','snen','wank','cunt','queef','fgt','kike','anal','cock','ann coulter','howard stern','cum','spamspamspam',"t1ts", "c0ck", "p0rn", "n1gger",'faggot','cumshot'),
cmds: {
  update: function(target, room, user){
  	try {
				CommandParser.uncacheTree('./stuff/chatbot/bot.js');
				bot = require('./stuff/chatbot/bot.js').bot(bot);
				return this.sendReply('Chatbot has been updaated.');
  	} catch (e) {
				return this.sendReply('Something failed while trying to update the bot: \n' + e.stack);
			}


  },
  //faze spruce this up with ur html skeelz
  credits: function(target, room, user) {
 	if(this.can('broadcast')) {
 		return this.add('|html|The creator of this bot is bandi, if you would like to use this for your server, please pm him. He is always on the <a href="http://rain.psim.us">Rain Server<a>. Some of these ideas were used from Quinella\'s chat bot. If you have any suggestions please tell him. Enjoy!');
 	}
 	else {
 	return false;	
 	}
 },
ask: function(target, user, room) {
 if(!this.canBroadcast()) return;
 var unanswerable = ['god']; //if anymore unanswered questions just add them
 if(!target){
 return this.sendReply('What would you like to know?')	
 } 
 if((spam.words.indexOf(target) && unanswerable.indexOf(target)) > -1){
 return this.sendReply('That question is unanswerable.');	
 } 
 else if(target === 'whois bandi') {
 	bot.say(bot.name,'My creator please do not disrepsect him.',room);
 }
 else{
 var r = 'That is not a question.'; 
 var yn = ['yes','no'];
 if(target.indexOf('how')||target.indexOf('why')){
 r = 'magik';
 }
 else if(target.indexOf('where')) {
 r = 'places';	
 }
 else if(target.indexOf('what')) {
 r = 'stuff';
 }
 else if(target.indexOf('who')) {
 r = 'a person';	
 }
 else if(target.indexOf('when')) {
 r = 'who knows';
 }
 else if(target.indexOf('why')) {
 r = 'reasons';
 }
 else if(target.indexOf('do')) {
 r = yn[Math.floor(Math.random()*2)];
 }
 bot.say(bot.name,r,room,this.sendReply)
 }
 },
 
 merp: function(target, room, user) {
 	if(!target){ 
 	this.sendReply('What user would you like to say this.'); return false;
 	}
 	else{
 	if(this.can('broadcast')){
 	bot.say(target,'/me merps',room);
 	}
 	else {
 	return false;
 	}
 	}
 },
 
  o3o: function(target, room, user) {
 	if(!target){ 
 	this.sendReply('What user would you like to say this.'); return false;
 	}
 	else{
 	if(this.can('broadcast')){
 	bot.say(target,'o3os',room);
 	}
 	else {
 	return false;
 	}
 	}
 },
 
  derp: function(target, room, user) {
 	if(!target){ 
 	this.sendReply('What user would you like to say this.'); return false;
 	}
 	else{
 	if(this.can('broadcast')){
 	bot.say(target,'/me derps in a pool :P',room);
 	}
 	else {
 	return false;
 	}
 	}
 },
  motd: function(target, room, user) {
    if(this.can('mute')) {
      if(!target){
      	if(bot.MOTD.length > 0) {
      	return bot.say(bot.name,bot.MOTD,room);	
      	}
      }
      if(!this.canTalk(target)) return false;
      else{
        return bot.say(bot.name,'The new Message Of the Day is: ' +target,room);	
        bot.MOTD = target;
		bot.MOTDon = true;
		if(bot.Int){
		clearInterval(bot.Int);
		}
		bot.Int = setInterval(function(){return bot.say(bot.name,bot.MOTD,room);},300000);
      }
    }
    else{ 
      return false;
    }
  },
  
  motdoff: function(target, room, user) {
    if(this.can('mute')) {
	if(bot.MOTDon){
      return this.add('The MOTD function is now off');
      bot.MOTD = undefined;
	  clearInterval(bot.Int)
	  }
	  else {
	  return this.sendReply('There is no MOTD on.')
	  }
  }
  else {
  return false;
  }
},


say: function(target, room, user){
  if(!this.can('broadcast')){ 
  if(!target) return this.sendReply('Please specify a message.');  
    this.logModCommand(user.name + ' used /say to say ' + target + '.');
    return bot.say(bot.name, target, room);
  } else { 
  	return false;
  }
},  


joke: function(target, room, user){
  if(!this.canBroadcast()) return;
    return bot.say(bot.name,bot.getRandjoke(),room,this.sendReply);
  }
}
}


Object.merge(bot, botStuff);
return bot;
};
