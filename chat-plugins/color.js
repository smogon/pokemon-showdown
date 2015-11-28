        var style = "background:none;border:0;padding:0 5px 0 0;font-family:Arial Black,Verdana,Helvetica,sans-serif;font-size:9.5pt;cursor:pointer";
 
exports.commands = {
       
        namecolors: function(target, room, user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<center><font size = 3>Name Colors:</font><br />' +
                                  '<p> Change your nickname color<br /> Use /name[color] - Change your nickname color' +
                                  '<p> Available Colors: Rainbow, Blue, White, Black, Orange, Green, Red, Pink and Yellow. You can get your own Name Color by buying it from the shop. </p>' +
                                  '<font align="left" ><b>By: Darkero'
                                                );
        },
   
        rainbow: function (target, room, user){
          if (user.can('hotpatch', null, room)) {
                var colors = ['#ED1C24', '#F26522', '#F7941D', '#F0D200', '#8DC73F', '#39B54A', '#00A651', '#00A99D', '#00AEEF', '#0072BC', '#0054A6', '#2E3192', '#662D91', '#92278F', '#EC008C', '#ED145B'];
                if(!target) return this.sendReply('/rainbow message');
                        userColor = '',
                        currentDate = new Date(),
                        randomNumber = '';
                        for(var x = 0; x < user.name.length; x++){
                                randomNumber = Math.floor(Math.random() * colors.length);
                                if(user.name.substring(x, x + 1) !== undefined){
                                        userColor += '<font color="' + colors[randomNumber] + '">' + user.name.substring(x, x + 1) + '</font>';
                                } else {
                                        userColor += '<font color="' + colors[randomNumber] + '">:</font>';
                                }
                        }
                        if(target.indexOf('/me') > -1) {
                                room.add('|raw|<small>' + user.group + '</small><b>' + "<button name='parseCommand' value='/user " + user.name + "' style='" + style + "'>"  + userColor + '</b> <i>' + Tools.escapeHTML(target.substring(3, target.length)) + '</i>');
                        } else {
                                room.add('|raw|<small>' + user.group + '</small><b>' + "<button name='parseCommand' value='/user " + user.name + "' style='" + style + "'>"  + userColor + ':</b>' + target);
                        }
          }
          else return this.errorReply('You must be an Admin to use this command.');
        },
       
        nameblue: function (target, room, user){
          if (user.can('hotpatch', null, room)) {
                var colors = ['#0489B1'];
                if(!target) return this.sendReply('/rainbow message');
                        userColor = '',
                        currentDate = new Date(),
                        randomNumber = '';
                        for(var x = 0; x < user.name.length; x++){
                                randomNumber = Math.floor(Math.random() * colors.length);
                                if(user.name.substring(x, x + 1) !== undefined){
                                        userColor += '<font color="' + colors[randomNumber] + '">' + user.name.substring(x, x + 1) + '</font>';
                                } else {
                                        userColor += '<font color="' + colors[randomNumber] + '">:</font>';
                                }
                        }
                        if(target.indexOf('/me') > -1) {
                                room.add('|raw|<small>' + user.group + '</small><b>' + Tools.escapeHTML(target.substring(3, target.length)) + '</i>');
                        } else {
                                room.add('|raw|<small>' + user.group + '</small><b>' + "<button name='parseCommand' value='/user " + user.name + "' style='" + style + "'>"  + userColor + ':</b>' + target);
                        }
          }
          else return this.errorReply('You must be an Admin to use this command.');
        },
       
        namewhite: function (target, room, user){
          if (user.can('hotpatch', null, room)) {
                var colors = ['#FFFFFF'];
                if(!target) return this.sendReply('/rainbow message');
                        userColor = '',
                        currentDate = new Date(),
                        randomNumber = '';
                        for(var x = 0; x < user.name.length; x++){
                                randomNumber = Math.floor(Math.random() * colors.length);
                                if(user.name.substring(x, x + 1) !== undefined){
                                        userColor += '<font color="' + colors[randomNumber] + '">' + user.name.substring(x, x + 1) + '</font>';
                                } else {
                                        userColor += '<font color="' + colors[randomNumber] + '">:</font>';
                                }
                        }
                        if(target.indexOf('/me') > -1) {
                                room.add('|raw|<small>' + user.group + '</small><b>' + Tools.escapeHTML(target.substring(3, target.length)) + '</i>');
                        } else {
                                room.add('|raw|<small>' + user.group + '</small><b>' + "<button name='parseCommand' value='/user " + user.name + "' style='" + style + "'>"  + userColor + ':</b>' + target);
                        }
          }
          else return this.errorReply('You must be an Admin to use this command.');
        },
       
        nameblack: function (target, room, user){
                if (!this.can('hotpatch') && !user.vip && user.userid !== 'traineralain') return this.sendReply('/nameblack - Access denied.');
                var colors = ['#000000'];
                if (user.can('hotpatch', null, room)) {
                        userColor = '',
                        currentDate = new Date(),
                        randomNumber = '';
                        for(var x = 0; x < user.name.length; x++){
                                randomNumber = Math.floor(Math.random() * colors.length);
                                if(user.name.substring(x, x + 1) !== undefined){
                                        userColor += '<font color="' + colors[randomNumber] + '">' + user.name.substring(x, x + 1) + '</font>';
                                } else {
                                        userColor += '<font color="' + colors[randomNumber] + '">:</font>';
                                }
                        }
                        if(target.indexOf('/me') > -1) {
                                room.add('|raw|<small>' + user.group + '</small><b>' + Tools.escapeHTML(target.substring(3, target.length)) + '</i>');
                        } else {
                                room.add('|raw|<small>' + user.group + '</small><b>' + "<button name='parseCommand' value='/user " + user.name + "' style='" + style + "'>"  + userColor + ':</b>' + target);
                        }
                }
         
        },
       
        nameorange: function (target, room, user){
          if (user.can('hotpatch', null, room)) {
                var colors = ['#FF8000'];
                if(!target) return this.sendReply('/rainbow message');
                        userColor = '',
                        currentDate = new Date(),
                        randomNumber = '';
                        for(var x = 0; x < user.name.length; x++){
                                randomNumber = Math.floor(Math.random() * colors.length);
                                if(user.name.substring(x, x + 1) !== undefined){
                                        userColor += '<font color="' + colors[randomNumber] + '">' + user.name.substring(x, x + 1) + '</font>';
                                } else {
                                        userColor += '<font color="' + colors[randomNumber] + '">:</font>';
                                }
                        }
                        if(target.indexOf('/me') > -1) {
                                room.add('|raw|<small>' + user.group + '</small><b>' + "<button name='parseCommand' value='/user " + user.name + "' style='" + style + "'>"  + userColor + '</b> <i>' + Tools.escapeHTML(target.substring(3, target.length)) + '</i>');
                       } else {
                                room.add('|raw|<small>' + user.group + '</small><b>' + "<button name='parseCommand' value='/user " + user.name + "' style='" + style + "'>"  + userColor + ':</b>' + target);
                        }
          }
          else return this.errorReply('You must be an Admin to use this command.');
        },
       
        namegreen: function (target, room, user){
          if (user.can('hotpatch', null, room)) {
                var colors = ['#3ADF00'];
                if(!target) return this.sendReply('/rainbow message');
                        userColor = '',
                        currentDate = new Date(),
                        randomNumber = '';
                        for(var x = 0; x < user.name.length; x++){
                                randomNumber = Math.floor(Math.random() * colors.length);
                                if(user.name.substring(x, x + 1) !== undefined){
                                        userColor += '<font color="' + colors[randomNumber] + '">' + user.name.substring(x, x + 1) + '</font>';
                                } else {
                                        userColor += '<font color="' + colors[randomNumber] + '">:</font>';
                                }
                        }
                        if(target.indexOf('/me') > -1) {
                                room.add('|raw|<small>' + user.group + '</small><b>' + "<button name='parseCommand' value='/user " + user.name + "' style='" + style + "'>"  + userColor + '</b> <i>' + Tools.escapeHTML(target.substring(3, target.length)) + '</i>');
                        } else {
                                room.add('|raw|<small>' + user.group + '</small><b>' + "<button name='parseCommand' value='/user " + user.name + "' style='" + style + "'>"  + userColor + ':</b>' + target);
                        }
          }
          else return this.errorReply('You must be an Admin to use this command.');
        },
       
        namered: function (target, room, user){
          if (user.can('hotpatch', null, room)) {
                var colors = ['#FF0000'];
                if(!target) return this.sendReply('/rainbow message');
                        userColor = '',
                        currentDate = new Date(),
                        randomNumber = '';
                        for(var x = 0; x < user.name.length; x++){
                                randomNumber = Math.floor(Math.random() * colors.length);
                                if(user.name.substring(x, x + 1) !== undefined){
                                        userColor += '<font color="' + colors[randomNumber] + '">' + user.name.substring(x, x + 1) + '</font>';
                                } else {
                                        userColor += '<font color="' + colors[randomNumber] + '">:</font>';
                                }
                        }
                        if(target.indexOf('/me') > -1) {
                                room.add('|raw|<small>' + user.group + '</small><b>' + "<button name='parseCommand' value='/user " + user.name + "' style='" + style + "'>"  + userColor + '</b> <i>' + Tools.escapeHTML(target.substring(3, target.length)) + '</i>');
                       } else {
                                room.add('|raw|<small>' + user.group + '</small><b>' + "<button name='parseCommand' value='/user " + user.name + "' style='" + style + "'>"  + userColor + ':</b>' + target);
                        }
          }
          else return this.errorReply('You must be an Admin to use this command.');
        },
       
        namepink: function (target, room, user){
                if (user.can('hotpatch', null, room)) {
                var colors = ['#FF00FF'];
                if(!target) return this.sendReply('/rainbow message');
                        userColor = '',
                        currentDate = new Date(),
                        randomNumber = '';
                        for(var x = 0; x < user.name.length; x++){
                                randomNumber = Math.floor(Math.random() * colors.length);
                                if(user.name.substring(x, x + 1) !== undefined){
                                        userColor += '<font color="' + colors[randomNumber] + '">' + user.name.substring(x, x + 1) + '</font>';
                                } else {
                                        userColor += '<font color="' + colors[randomNumber] + '">:</font>';
                                }
                        }
                        if(target.indexOf('/me') > -1) {
                                room.add('|raw|<small>' + user.group + '</small><b>' + "<button name='parseCommand' value='/user " + user.name + "' style='" + style + "'>"  + userColor + '</b> <i>' + Tools.escapeHTML(target.substring(3, target.length)) + '</i>');
                        } else {
                                room.add('|raw|<small>' + user.group + '</small><b>' + "<button name='parseCommand' value='/user " + user.name + "' style='" + style + "'>"  + userColor + ':</b>' + target);
                        }
                }
        },
       
        namepurple: function (target, room, user){
                 if (user.can('hotpatch', null, room)) {
                var colors = ['#8000ff', '#39005e', '#c07bed'];
                if(!target) return this.sendReply('/rainbow message');
                        userColor = '',
                        currentDate = new Date(),
                        randomNumber = '';
                        for(var x = 0; x < user.name.length; x++){
                                randomNumber = Math.floor(Math.random() * colors.length);
                                if(user.name.substring(x, x + 1) !== undefined){
                                        userColor += '<font color="' + colors[randomNumber] + '">' + user.name.substring(x, x + 1) + '</font>';
                                } else {
                                        userColor += '<font color="' + colors[randomNumber] + '">:</font>';
                                }
                        }
                        if(target.indexOf('/me') > -1) {
                                room.add('|raw|<small>' + user.group + '</small><b>' + "<button name='parseCommand' value='/user " + user.name + "' style='" + style + "'>"  + userColor + '</b> <i>' + Tools.escapeHTML(target.substring(3, target.length)) + '</i>');
                      } else {
                                room.add('|raw|<small>' + user.group + '</small><b>' + "<button name='parseCommand' value='/user " + user.name + "' style='" + style + "'>"  + userColor + ':</b>' + target);
                        }
                 }
        },
       
       
        nameyellow: function (target, room, user){
          if (user.can('hotpatch', null, room)) {
                var colors = ['#FFFF00'];
                if(!target) return this.sendReply('/rainbow message');
                        userColor = '',
                        currentDate = new Date(),
                        randomNumber = '';
                        for(var x = 0; x < user.name.length; x++){
                                randomNumber = Math.floor(Math.random() * colors.length);
                                if(user.name.substring(x, x + 1) !== undefined){
                                        userColor += '<font color="' + colors[randomNumber] + '">' + user.name.substring(x, x + 1) + '</font>';
                                } else {
                                        userColor += '<font color="' + colors[randomNumber] + '">:</font>';
                                }
                        }
                        if(target.indexOf('/me') > -1) {
                                room.add('|raw|<small>' + user.group + '</small><b>' + "<button name='parseCommand' value='/user " + user.name + "' style='" + style + "'>"  + userColor + '</b> <i>' + Tools.escapeHTML(target.substring(3, target.length)) + '</i>');
                        } else {
                                 room.add('|raw|<small>' + user.group + '</small><b>' + "<button name='parseCommand' value='/user " + user.name + "' style='" + style + "'>"  + userColor + ':</b>' + target);
                        }
          }
          else return this.errorReply('You must be an Admin to use this command.');
        },
       
}
