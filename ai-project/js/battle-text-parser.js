var BattleTextParser = function() {

  function BattleTextParser() {
   var perspective = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
   this.p1 = "Player 1";
   this.p2 = "Player 2";
   this.gen = 7;
   this.curLineSection = 'break';
   this.lowercaseRegExp = undefined;
   this.pokemonName = function(pokemon) {
    if (!pokemon) return '';
    if (!pokemon.startsWith('p1') && !pokemon.startsWith('p2')) return "???pokemon:" + pokemon + "???";
    if (pokemon.charAt(3) === ':') return pokemon.slice(4).trim();
    else
    if (pokemon.charAt(2) === ':') return pokemon.slice(3).trim();
    return "???pokemon:" + pokemon + "???";
   };
   this.perspective = perspective;
  }
  BattleTextParser.parseLine = function parseLine(line) {
   if (!line.startsWith('|')) {
    return {
     args: ['', line],
     kwArgs: {}
    };
   }
   if (line === '|') {
    return {
     args: ['done'],
     kwArgs: {}
    };
   }
   var index = line.indexOf('|', 1);
   var cmd = line.slice(1, index);
   switch (cmd) {
    case 'chatmsg':
    case 'chatmsg-raw':
    case 'raw':
    case 'error':
    case 'html':
    case 'inactive':
    case 'inactiveoff':
    case 'warning':
    case 'fieldhtml':
    case 'controlshtml':
    case 'bigerror':
    case 'debug':
    case 'tier':
     return {
      args: [cmd, line.slice(index + 1)],
      kwArgs: {}
     };
    case 'c':
    case 'chat':
    case 'uhtml':
    case 'uhtmlchange':
     var index2a = line.indexOf('|', index + 1);
     return {
      args: [cmd, line.slice(index + 1, index2a), line.slice(index2a + 1)],
      kwArgs: {}
     };
    case 'c:':
     var index2b = line.indexOf('|', index + 1);
     var index3b = line.indexOf('|', index2b + 1);
     return {
      args: [cmd, line.slice(index + 1, index2b), line.slice(index2b + 1, index3b), line.slice(index3b + 1)],
      kwArgs: {}
     };
   }
   var args = line.slice(1).split('|');
   var kwArgs = {};
   while (args.length > 1) {
    var lastArg = args[args.length - 1];
    if (lastArg.charAt(0) !== '[') break;
    var bracketPos = lastArg.indexOf(']');
    if (bracketPos <= 0) break;
    kwArgs[lastArg.slice(1, bracketPos)] = lastArg.slice(bracketPos + 1).trim() || '.';
    args.pop();
   }
   return BattleTextParser.upgradeArgs({
    args: args,
    kwArgs: kwArgs
   });
  };
  BattleTextParser.upgradeArgs = function upgradeArgs(_ref) {
   var args = _ref.args,
    kwArgs = _ref.kwArgs;
   switch (args[0]) {
    case '-activate':
     {
      if (kwArgs.item || kwArgs.move || kwArgs.number || kwArgs.ability) return {
       args: args,
       kwArgs: kwArgs
      };
      var _args = args,
       pokemon = _args[1],
       effect = _args[2],
       arg3 = _args[3],
       arg4 = _args[4];
      var target = kwArgs.of;
      var _id = BattleTextParser.effectId(effect);
      if (kwArgs.block) return {
       args: ['-fail', pokemon],
       kwArgs: kwArgs
      };
      if (_id === 'wonderguard') return {
       args: ['-immune', pokemon],
       kwArgs: {
        from: 'ability:Wonder Guard'
       }
      };
      if (['ingrain', 'quickguard', 'wideguard', 'craftyshield', 'matblock', 'protect', 'mist', 'safeguard', 'electricterrain', 'mistyterrain', 'psychicterrain', 'telepathy', 'stickyhold', 'suctioncups', 'aromaveil', 'flowerveil', 'sweetveil', 'disguise', 'safetygoggles', 'protectivepads'].includes(_id)) {
       return {
        args: ['-block', target || pokemon, effect, arg3],
        kwArgs: {}
       };
      }
      if (['bind', 'wrap', 'clamp', 'whirlpool', 'firespin', 'magmastorm', 'sandtomb', 'infestation', 'charge', 'trapped'].includes(_id)) {
       return {
        args: ['-start', pokemon, effect],
        kwArgs: { of: target
        }
       };
      }
      if (_id === 'fairylock') {
       return {
        args: ['-fieldactivate', effect],
        kwArgs: {}
       };
      }
      if (_id === 'symbiosis') {
       kwArgs.item = arg3;
      } else if (_id === 'magnitude') {
       kwArgs.number = arg3;
      } else if (_id === 'skillswap' || _id === 'mummy') {
       kwArgs.ability = arg3;
       kwArgs.ability2 = arg4;
      } else if (['spite', 'grudge', 'forewarn', 'sketch', 'leppaberry', 'mysteryberry'].includes(_id)) {
       kwArgs.move = arg3;
       kwArgs.number = arg4;
      }
      args = ['-activate', pokemon, effect, target || ''];
      return {
       args: args,
       kwArgs: kwArgs
      };
     }
    case 'move':
     {
      if (kwArgs.from === 'Magic Bounce') kwArgs.from = 'ability:Magic Bounce';
      return {
       args: args,
       kwArgs: kwArgs
      };
     }
    case '-nothing':
     return {
      args: ['-activate', '', 'move:Splash'],
      kwArgs: kwArgs
     };
   }
   return {
    args: args,
    kwArgs: kwArgs
   };
  };
  var _proto = BattleTextParser.prototype;
  _proto.extractMessage = function extractMessage(buf) {
   var out = '';
   for (var _i = 0, _buf$split = buf.split('\n'); _i < _buf$split.length; _i++) {
    var line = _buf$split[_i];
    var _BattleTextParser$par = BattleTextParser.parseLine(line),
     args = _BattleTextParser$par.args,
     kwArgs = _BattleTextParser$par.kwArgs;
    out += this.parseArgs(args, kwArgs) || '';
   }
   return out;
  };
  _proto.fixLowercase = function fixLowercase(input) {
   if (this.lowercaseRegExp === undefined) {
    var prefixes = ['pokemon', 'opposingPokemon', 'team', 'opposingTeam'].map(function(templateId) {
     var template = BattleText["default"][templateId];
     if (template.charAt(0) === template.charAt(0).toUpperCase()) return '';
     var bracketIndex = template.indexOf('[');
     if (bracketIndex >= 0) return template.slice(0, bracketIndex);
     return template;
    }).filter(function(prefix) {
     return prefix;
    });
    if (prefixes.length) {
     var buf = "((?:^|\n)(?:  |  \\(|  \\[)?)(" + prefixes.map(BattleTextParser.escapeRegExp).join('|') + ")";
     this.lowercaseRegExp = new RegExp(buf, 'g');
    } else {
     this.lowercaseRegExp = null;
    }
   }
   if (!this.lowercaseRegExp) return input;
   return input.replace(this.lowercaseRegExp, function(match, p1, p2) {
    return p1 + p2.charAt(0).toUpperCase() + p2.slice(1);
   });
  };
  BattleTextParser.escapeRegExp = function escapeRegExp(input) {
   return input.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
  };
  _proto.

  pokemon = function pokemon(_pokemon) {
   if (!_pokemon) return '';
   var side;
   switch (_pokemon.slice(0, 2)) {
    case 'p1':
     side = 0;
     break;
    case 'p2':
     side = 1;
     break;
    default:
     return "???pokemon:" + _pokemon + "???";
   }

   var name = this.pokemonName(_pokemon);
   var template = BattleText["default"][side === this.perspective ? 'pokemon' : 'opposingPokemon'];
   return template.replace('[NICKNAME]', name);
  };
  _proto.

  pokemonFull = function pokemonFull(pokemon, details) {
   var nickname = this.pokemonName(pokemon);

   var species = details.split(',')[0];
   if (nickname === species) return [pokemon.slice(0, 2), "**" + species + "**"];
   return [pokemon.slice(0, 2), nickname + " (**" + species + "**)"];
  };
  _proto.

  trainer = function trainer(side) {
   side = side.slice(0, 2);
   if (side === 'p1') return this.p1;
   if (side === 'p2') return this.p2;
   return "???side:" + side + "???";
  };
  _proto.

  team = function team(side) {
   side = side.slice(0, 2);
   if (side === (this.perspective === 0 ? 'p1' : 'p2')) {
    return BattleText["default"].team;
   }
   return BattleText["default"].opposingTeam;
  };
  _proto.

  own = function own(side) {
   side = side.slice(0, 2);
   if (side === (this.perspective === 0 ? 'p1' : 'p2')) {
    return 'OWN';
   }
   return '';
  };
  BattleTextParser.

  effectId = function effectId(effect) {
   if (!effect) return '';
   if (effect.startsWith('item:') || effect.startsWith('move:')) {
    effect = effect.slice(5);
   } else if (effect.startsWith('ability:')) {
    effect = effect.slice(8);
   }
   return toId(effect);
  };
  _proto.

  effect = function effect(_effect) {
   if (!_effect) return '';
   if (_effect.startsWith('item:') || _effect.startsWith('move:')) {
    _effect = _effect.slice(5);
   } else if (_effect.startsWith('ability:')) {
    _effect = _effect.slice(8);
   }
   return _effect.trim();
  };
  _proto.

  template = function template(type) {
   for (var _len = arguments.length, namespaces = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    namespaces[_key - 1] = arguments[_key];
   }
   for (var _i2 = 0; _i2 <
    namespaces.length; _i2++) {
    var namespace = namespaces[_i2];
    if (!namespace) continue;
    if (namespace === 'OWN') {
     return BattleText["default"][type + 'Own'] + '\n';
    }
    if (namespace === 'NODEFAULT') {
     return '';
    }
    var _id2 = BattleTextParser.effectId(namespace);
    if (BattleText[_id2] && type in BattleText[_id2]) {
     if (BattleText[_id2][type].charAt(1) === '.') type = BattleText[_id2][type].slice(2);
     if (BattleText[_id2][type].charAt(0) === '#') _id2 = BattleText[_id2][type].slice(1);
     if (!BattleText[_id2][type]) return '';
     return BattleText[_id2][type] + '\n';
    }
   }
   if (!BattleText["default"][type]) return '';
   return BattleText["default"][type] + '\n';
  };
  _proto.

  maybeAbility = function maybeAbility(effect, holder) {
   if (!effect) return '';
   if (!effect.startsWith('ability:')) return '';
   return this.ability(effect.slice(8).trim(), holder);
  };
  _proto.

  ability = function ability(name, holder) {
   if (!name) return '';
   return BattleText["default"].abilityActivation.replace('[POKEMON]', this.pokemon(holder)).replace('[ABILITY]', this.effect(name)) + '\n';
  };
  _proto.

  stat = function stat(_stat) {
   var entry = BattleText[_stat || "stats"];
   if (!entry || !entry.statName) return "???stat:" + _stat + "???";
   return entry.statName;
  };
  _proto.

  lineSection = function lineSection(args, kwArgs) {
   var cmd = args[0];
   switch (cmd) {
    case 'done':
    case 'turn':
     return 'break';
    case 'move':
    case 'cant':
    case 'switch':
    case 'drag':
    case 'upkeep':
    case 'start':
    case '-mega':
     return 'major';
    case 'switchout':
    case 'faint':
     return 'preMajor';
    case '-zpower':
     return 'postMajor';
    case '-damage':
     {
      var _id3 = BattleTextParser.effectId(kwArgs.from);
      if (_id3 === 'confusion') return 'major';
      return 'postMajor';
     }
    case '-curestatus':
     {
      var _id4 = BattleTextParser.effectId(kwArgs.from);
      if (_id4 === 'naturalcure') return 'preMajor';
      return 'postMajor';
     }
    case '-start':
     {
      var _id5 = BattleTextParser.effectId(kwArgs.from);
      if (_id5 === 'protean') return 'preMajor';
      return 'postMajor';
     }
    case '-activate':
     {
      var _id6 = BattleTextParser.effectId(args[2]);
      if (_id6 === 'confusion' || _id6 === 'attract') return 'preMajor';
      return 'postMajor';
     }
   }

   return cmd.charAt(0) === '-' ? 'postMajor' : '';
  };
  _proto.

  sectionBreak = function sectionBreak(args, kwArgs) {
   var prevSection = this.curLineSection;
   var curSection = this.lineSection(args, kwArgs);
   if (!curSection) return false;
   this.curLineSection = curSection;
   switch (curSection) {
    case 'break':
     if (prevSection !== 'break') return true;
     return false;
    case 'preMajor':
    case 'major':
     if (prevSection === 'postMajor' || prevSection === 'major') return true;
     return false;
    case 'postMajor':
     return false;
   }

  };
  _proto.

  parseArgs = function parseArgs(args, kwArgs, noSectionBreak) {
   var buf = !noSectionBreak && this.sectionBreak(args, kwArgs) ? '\n' : '';
   return buf + this.fixLowercase(this.parseArgsInner(args, kwArgs) || '');
  };
  _proto.

  parseArgsInner = function parseArgsInner(args, kwArgs) {
   var cmd = args[0];
   switch (cmd) {
    case 'player':
     {
      var
       side = args[1],
       name = args[2];
      if (side === 'p1' && name) {
       this.p1 = name;
      } else if (side === 'p2' && name) {
       this.p2 = name;
      }
      return '';
     }

    case 'gen':
     {
      var
       num = args[1];
      this.gen = parseInt(num, 10);
      return '';
     }

    case 'turn':
     {
      var
       _num = args[1];
      return this.template('turn').replace('[NUMBER]', _num) + '\n';
     }

    case 'start':
     {
      return this.template('startBattle').replace('[TRAINER]', this.p1).replace('[TRAINER]', this.p2);
     }

    case 'win':
    case 'tie':
     {
      var
       _name = args[1];
      if (cmd === 'tie' || !_name) {
       return this.template('tieBattle').replace('[TRAINER]', this.p1).replace('[TRAINER]', this.p2);
      }
      return this.template('winBattle').replace('[TRAINER]', _name);
     }

    case 'switch':
     {
      var
       pokemon = args[1],
       details = args[2];
      var _this$pokemonFull =
       this.pokemonFull(pokemon, details),
       _side = _this$pokemonFull[0],
       fullname = _this$pokemonFull[1];
      var template = this.template('switchIn', this.own(_side));
      return template.replace('[TRAINER]', this.trainer(_side)).replace('[FULLNAME]', fullname);
     }

    case 'drag':
     {
      var
       _pokemon2 = args[1],
       _details = args[2];
      var _this$pokemonFull2 =
       this.pokemonFull(_pokemon2, _details),
       _side2 = _this$pokemonFull2[0],
       _fullname = _this$pokemonFull2[1];
      var _template = this.template('drag');
      return _template.replace('[TRAINER]', this.trainer(_side2)).replace('[FULLNAME]', _fullname);
     }

    case 'detailschange':
    case '-transform':
    case '-formechange':
     {
      var
       _pokemon3 = args[1],
       arg2 = args[2],
       arg3 = args[3];
      var newSpecies = '';
      switch (cmd) {
       case 'detailschange':
        newSpecies = arg2.split(',')[0].trim();
        break;
       case '-transform':
        newSpecies = arg3;
        break;
       case '-formechange':
        newSpecies = arg2;
        break;
      }

      var newSpeciesId = toId(newSpecies);
      var _id7 = '';
      var _templateName = 'transform';
      if (cmd !== '-transform') {
       switch (newSpeciesId) {
        case 'greninjaash':
         _id7 = 'battlebond';
         break;
        case 'mimikyubusted':
         _id7 = 'disguise';
         break;
        case 'zygardecomplete':
         _id7 = 'powerconstruct';
         break;
        case 'necrozmaultra':
         _id7 = 'ultranecroziumz';
         break;
        case 'darmanitanzen':
         _id7 = 'zenmode';
         break;
        case 'darmanitan':
         _id7 = 'zenmode';
         _templateName = 'transformEnd';
         break;
        case 'aegislashblade':
         _id7 = 'stancechange';
         break;
        case 'aegislash':
         _id7 = 'stancechange';
         _templateName = 'transformEnd';
         break;
        case 'wishiwashischool':
         _id7 = 'schooling';
         break;
        case 'wishiwashi':
         _id7 = 'schooling';
         _templateName = 'transformEnd';
         break;
        case 'miniormeteor':
         _id7 = 'shieldsdown';
         break;
        case 'minior':
         _id7 = 'shieldsdown';
         _templateName = 'transformEnd';
         break;
       }

      } else if (newSpecies) {
       _id7 = 'transform';
      }
      var _template2 = this.template(_templateName, _id7, kwArgs.msg ? '' : 'NODEFAULT');
      var line1 = this.maybeAbility(kwArgs.from, kwArgs.of || _pokemon3);
      return line1 + _template2.replace('[POKEMON]', this.pokemon(_pokemon3)).replace('[SPECIES]', newSpecies);
     }

    case 'switchout':
     {
      var
       _pokemon4 = args[1];
      var _side3 = _pokemon4.slice(0, 2);
      var _template3 = this.template('switchOut', kwArgs.from, this.own(_side3));
      return _template3.replace('[TRAINER]', this.trainer(_side3)).replace('[NICKNAME]', this.pokemonName(_pokemon4)).replace('[POKEMON]', this.pokemon(_pokemon4));
     }

    case 'faint':
     {
      var
       _pokemon5 = args[1];
      var _template4 = this.template('faint');
      return _template4.replace('[POKEMON]', this.pokemon(_pokemon5));
     }

    case 'swap':
     {
      var
       _pokemon6 = args[1],
       target = args[2];
      if (!target || !isNaN(Number(target))) {
       var _template6 = this.template('swapCenter');
       return _template6.replace('[POKEMON]', this.pokemon(_pokemon6));
      }
      var _template5 = this.template('swap');
      return _template5.replace('[POKEMON]', this.pokemon(_pokemon6)).replace('[TARGET]', this.pokemon(target));
     }

    case 'move':
     {
      var
       _pokemon7 = args[1],
       move = args[2];
      var _line = this.maybeAbility(kwArgs.from, kwArgs.of || _pokemon7);
      if (kwArgs.zEffect) {
       _line = this.template('zEffect').replace('[POKEMON]', this.pokemon(_pokemon7));
      }
      var _template7 = this.template('move', kwArgs.from);
      return _line + _template7.replace('[POKEMON]', this.pokemon(_pokemon7)).replace('[MOVE]', move);
     }

    case 'cant':
     {
      var
       _pokemon8 = args[1],
       effect = args[2],
       _move = args[3];
      var _id8 = BattleTextParser.effectId(effect);
      switch (_id8) {
       case 'damp':
       case 'dazzling':
       case 'queenlymajesty':
        var _ref2 =

         [kwArgs.of, _pokemon8];
        _pokemon8 = _ref2[0];
        kwArgs.of = _ref2[1];
        break;
      }

      var _template8 = this.template('cant', effect, 'NODEFAULT') ||
       this.template(_move ? 'cant' : 'cantNoMove');
      var _line2 = this.maybeAbility(effect, kwArgs.of || _pokemon8);
      return _line2 + _template8.replace('[POKEMON]', this.pokemon(_pokemon8)).replace('[MOVE]', _move);
     }

    case 'message':
     {
      var
       message = args[1];
      return '' + message + '\n';
     }

    case '-start':
     {
      var
       _pokemon9 = args[1],
       _effect2 = args[2],
       _arg = args[3];
      var _line3 = this.maybeAbility(_effect2, _pokemon9) || this.maybeAbility(kwArgs.from, kwArgs.of || _pokemon9);
      var _id9 = BattleTextParser.effectId(_effect2);
      if (_id9 === 'typechange') {
       var _template10 = this.template('typeChange', kwArgs.from);
       return _line3 + _template10.replace('[POKEMON]', this.pokemon(_pokemon9)).replace('[TYPE]', _arg).replace('[SOURCE]', this.pokemon(kwArgs.of));
      }
      if (_id9 === 'typeadd') {
       var _template11 = this.template('typeAdd', kwArgs.from);
       return _line3 + _template11.replace('[POKEMON]', this.pokemon(_pokemon9)).replace('[TYPE]', _arg);
      }
      if (_id9.startsWith('stockpile')) {
       var _num2 = _id9.slice(9);
       var _template12 = this.template('start', 'stockpile');
       return _line3 + _template12.replace('[POKEMON]', this.pokemon(_pokemon9)).replace('[NUMBER]', _num2);
      }
      if (_id9.startsWith('perish')) {
       var _num3 = _id9.slice(6);
       var _template13 = this.template('activate', 'perishsong');
       return _line3 + _template13.replace('[POKEMON]', this.pokemon(_pokemon9)).replace('[NUMBER]', _num3);
      }
      var templateId = 'start';
      if (kwArgs.already) templateId = 'alreadyStarted';
      if (kwArgs.fatigue) templateId = 'startFromFatigue';
      if (kwArgs.zeffect) templateId = 'startFromZEffect';
      if (kwArgs.damage) templateId = 'activate';
      if (kwArgs.block) templateId = 'block';
      if (kwArgs.upkeep) templateId = 'upkeep';
      if (_id9 === 'reflect' || _id9 === 'lightscreen') templateId = 'startGen1';
      if (templateId === 'start' && kwArgs.from && kwArgs.from.startsWith('item:')) {
       templateId += 'FromItem';
      }
      var _template9 = this.template(templateId, _effect2);
      return _line3 + _template9.replace('[POKEMON]', this.pokemon(_pokemon9)).replace('[EFFECT]', this.effect(_effect2)).replace('[MOVE]', _arg).replace('[SOURCE]', this.pokemon(kwArgs.of)).replace('[ITEM]', this.effect(kwArgs.from));
     }

    case '-end':
     {
      var
       _pokemon10 = args[1],
       _effect3 = args[2];
      var _line4 = this.maybeAbility(_effect3, _pokemon10) || this.maybeAbility(kwArgs.from, kwArgs.of || _pokemon10);
      var _id10 = BattleTextParser.effectId(_effect3);
      if (_id10 === 'doomdesire' || _id10 === 'futuresight') {
       var _template15 = this.template('activate', _effect3);
       return _line4 + _template15.replace('[TARGET]', this.pokemon(_pokemon10));
      }
      var _templateId = 'end';
      var _template14 = '';
      if (kwArgs.from && kwArgs.from.startsWith('item:')) {
       _template14 = this.template('endFromItem', _effect3);
      }
      if (!_template14) _template14 = this.template(_templateId, _effect3);
      return _line4 + _template14.replace('[POKEMON]', this.pokemon(_pokemon10)).replace('[EFFECT]', this.effect(_effect3)).replace('[SOURCE]', this.pokemon(kwArgs.of));
     }

    case '-ability':
     {
      var
       _pokemon11 = args[1],
       ability = args[2],
       oldAbility = args[3],
       arg4 = args[4];
      var _line5 = '';
      if (oldAbility && (oldAbility.startsWith('p1') || oldAbility.startsWith('p2') || oldAbility === 'boost')) {
       arg4 = oldAbility;
       oldAbility = '';
      }
      if (oldAbility) _line5 += this.ability(oldAbility, _pokemon11);
      _line5 += this.ability(ability, _pokemon11);
      if (kwArgs.fail) {
       var _template17 = this.template('block', kwArgs.from);
       return _line5 + _template17;
      }
      if (kwArgs.from) {
       _line5 = this.maybeAbility(kwArgs.from, _pokemon11) + _line5;
       var _template18 = this.template('changeAbility', kwArgs.from);
       return _line5 + _template18.replace('[POKEMON]', this.pokemon(_pokemon11)).replace('[ABILITY]', this.effect(ability)).replace('[SOURCE]', this.pokemon(kwArgs.of));
      }
      var _id11 = BattleTextParser.effectId(ability);
      if (_id11 === 'unnerve') {
       var _template19 = this.template('start', ability);
       return _line5 + _template19.replace('[TEAM]', this.team(arg4));
      }
      var _templateId2 = 'start';
      if (_id11 === 'anticipation' || _id11 === 'sturdy') _templateId2 = 'activate';
      var _template16 = this.template(_templateId2, ability, 'NODEFAULT');
      return _line5 + _template16.replace('[POKEMON]', this.pokemon(_pokemon11));
     }

    case '-endability':
     {
      var
       _pokemon12 = args[1],
       _ability = args[2];
      if (_ability) return this.ability(_ability, _pokemon12);
      var _line6 = this.maybeAbility(kwArgs.from, kwArgs.of || _pokemon12);
      var _template20 = this.template('start', 'Gastro Acid');
      return _line6 + _template20.replace('[POKEMON]', this.pokemon(_pokemon12));
     }

    case '-item':
     {
      var
       _pokemon13 = args[1],
       item = args[2];
      var _id12 = BattleTextParser.effectId(kwArgs.from);
      var _target = '';
      if (['magician', 'pickpocket'].includes(_id12)) {
       var _ref3 = [kwArgs.of, ''];
       _target = _ref3[0];
       kwArgs.of = _ref3[1];
      }
      var _line7 = this.maybeAbility(kwArgs.from, kwArgs.of || _pokemon13);
      if (['thief', 'covet', 'bestow', 'magician', 'pickpocket'].includes(_id12)) {
       var _template22 = this.template('takeItem', kwArgs.from);
       return _line7 + _template22.replace('[POKEMON]', this.pokemon(_pokemon13)).replace('[ITEM]', this.effect(item)).replace('[SOURCE]', this.pokemon(_target || kwArgs.of));
      }
      if (_id12 === 'frisk') {
       var _template23 = this.template(kwArgs.of && _pokemon13 && kwArgs.of !== _pokemon13 ? 'activate' : 'activateNoTarget', "Frisk");
       return _line7 + _template23.replace('[POKEMON]', this.pokemon(kwArgs.of)).replace('[ITEM]', this.effect(item)).replace('[TARGET]', this.pokemon(_pokemon13));
      }
      if (kwArgs.from) {
       var _template24 = this.template('addItem', kwArgs.from);
       return _line7 + _template24.replace('[POKEMON]', this.pokemon(_pokemon13)).replace('[ITEM]', this.effect(item));
      }
      var _template21 = this.template('start', item, 'NODEFAULT');
      return _line7 + _template21.replace('[POKEMON]', this.pokemon(_pokemon13));
     }

    case '-enditem':
     {
      var
       _pokemon14 = args[1],
       _item = args[2];
      var _line8 = this.maybeAbility(kwArgs.from, kwArgs.of || _pokemon14);
      if (kwArgs.eat) {
       var _template26 = this.template('eatItem', kwArgs.from);
       return _line8 + _template26.replace('[POKEMON]', this.pokemon(_pokemon14)).replace('[ITEM]', this.effect(_item));
      }
      var _id13 = BattleTextParser.effectId(kwArgs.from);
      if (_id13 === 'gem') {
       var _template27 = this.template('useGem', _item);
       return _line8 + _template27.replace('[POKEMON]', this.pokemon(_pokemon14)).replace('[ITEM]', this.effect(_item)).replace('[MOVE]', kwArgs.move);
      }
      if (_id13 === 'stealeat') {
       var _template28 = this.template('removeItem', "Bug Bite");
       return _line8 + _template28.replace('[SOURCE]', this.pokemon(kwArgs.of)).replace('[ITEM]', this.effect(_item));
      }
      if (kwArgs.from) {
       var _template29 = this.template('removeItem', kwArgs.from);
       return _line8 + _template29.replace('[POKEMON]', this.pokemon(_pokemon14)).replace('[ITEM]', this.effect(_item)).replace('[SOURCE]', this.pokemon(kwArgs.of));
      }
      if (kwArgs.weaken) {
       var _template30 = this.template('activateWeaken');
       return _line8 + _template30.replace('[POKEMON]', this.pokemon(_pokemon14)).replace('[ITEM]', this.effect(_item));
      }
      var _template25 = this.template('end', _item, 'NODEFAULT');
      if (!_template25) _template25 = this.template('activateItem').replace('[ITEM]', this.effect(_item));
      return _line8 + _template25.replace('[POKEMON]', this.pokemon(_pokemon14)).replace('[TARGET]', this.pokemon(kwArgs.of));
     }

    case '-status':
     {
      var
       _pokemon15 = args[1],
       status = args[2];
      var _line9 = this.maybeAbility(kwArgs.from, kwArgs.of || _pokemon15);
      if (BattleTextParser.effectId(kwArgs.from) === 'rest') {
       var _template32 = this.template('startFromRest', status);
       return _line9 + _template32.replace('[POKEMON]', this.pokemon(_pokemon15));
      }
      var _template31 = this.template('start', status);
      return _line9 + _template31.replace('[POKEMON]', this.pokemon(_pokemon15));
     }

    case '-curestatus':
     {
      var
       _pokemon16 = args[1],
       _status = args[2];
      if (BattleTextParser.effectId(kwArgs.from) === 'naturalcure') {
       var _template34 = this.template('activate', kwArgs.from);
       return _template34.replace('[POKEMON]', this.pokemon(_pokemon16));
      }
      var _line10 = this.maybeAbility(kwArgs.from, kwArgs.of || _pokemon16);
      if (kwArgs.from && kwArgs.from.startsWith('item:')) {
       var _template35 = this.template('endFromItem', _status);
       return _line10 + _template35.replace('[POKEMON]', this.pokemon(_pokemon16)).replace('[ITEM]', this.effect(kwArgs.from));
      }
      if (kwArgs.thaw) {
       var _template36 = this.template('endFromMove', _status);
       return _line10 + _template36.replace('[POKEMON]', this.pokemon(_pokemon16)).replace('[MOVE]', this.effect(kwArgs.from));
      }
      var _template33 = this.template('end', _status, 'NODEFAULT');
      if (!_template33) _template33 = this.template('end').replace('[EFFECT]', _status);
      return _line10 + _template33.replace('[POKEMON]', this.pokemon(_pokemon16));
     }

    case '-cureteam':
     {
      return this.template('activate', kwArgs.from);
     }

    case '-singleturn':
    case '-singlemove':
     {
      var
       _pokemon17 = args[1],
       _effect4 = args[2];
      var _line11 = this.maybeAbility(_effect4, kwArgs.of || _pokemon17) || this.maybeAbility(kwArgs.from, kwArgs.of || _pokemon17);
      var _id14 = BattleTextParser.effectId(_effect4);
      if (_id14 === 'instruct') {
       var _template38 = this.template('activate', _effect4);
       return _line11 + _template38.replace('[POKEMON]', this.pokemon(kwArgs.of)).replace('[TARGET]', this.pokemon(_pokemon17));
      }
      var _template37 = this.template('start', _effect4, 'NODEFAULT');
      if (!_template37) _template37 = this.template('start').replace('[EFFECT]', this.effect(_effect4));
      return _line11 + _template37.replace('[POKEMON]', this.pokemon(_pokemon17)).replace('[SOURCE]', this.pokemon(kwArgs.of)).replace('[TEAM]', this.team(_pokemon17.slice(0, 2)));
     }

    case '-sidestart':
     {
      var
       _side4 = args[1],
       _effect5 = args[2];
      var _template39 = this.template('start', _effect5, 'NODEFAULT');
      if (!_template39) _template39 = this.template('startTeamEffect').replace('[EFFECT]', this.effect(_effect5));
      return _template39.replace('[TEAM]', this.team(_side4));
     }

    case '-sideend':
     {
      var
       _side5 = args[1],
       _effect6 = args[2];
      var _template40 = this.template('end', _effect6, 'NODEFAULT');
      if (!_template40) _template40 = this.template('endTeamEffect').replace('[EFFECT]', this.effect(_effect6));
      return _template40.replace('[TEAM]', this.team(_side5));
     }

    case '-weather':
     {
      var
       weather = args[1];
      if (!weather || weather === 'none') {
       var _template42 = this.template('end', kwArgs.from, 'NODEFAULT');
       if (!_template42) return this.template('endFieldEffect').replace('[EFFECT]', this.effect(weather));
       return _template42;
      }
      if (kwArgs.upkeep) {
       return this.template('upkeep', weather, 'NODEFAULT');
      }
      var _line12 = this.maybeAbility(kwArgs.from, kwArgs.of);
      var _template41 = this.template('start', weather, 'NODEFAULT');
      if (!_template41) _template41 = this.template('startFieldEffect').replace('[EFFECT]', this.effect(weather));
      return _line12 + _template41;
     }

    case '-fieldstart':
    case '-fieldactivate':
     {
      var
       _effect7 = args[1];
      var _line13 = this.maybeAbility(kwArgs.from, kwArgs.of);
      var _templateId3 = cmd.slice(6);
      if (BattleTextParser.effectId(_effect7) === 'perishsong') _templateId3 = 'start';
      var _template43 = this.template(_templateId3, _effect7, 'NODEFAULT');
      if (!_template43) _template43 = this.template('startFieldEffect').replace('[EFFECT]', this.effect(_effect7));
      return _line13 + _template43.replace('[POKEMON]', this.pokemon(kwArgs.of));
     }

    case '-fieldend':
     {
      var
       _effect8 = args[1];
      var _template44 = this.template('end', _effect8, 'NODEFAULT');
      if (!_template44) _template44 = this.template('endFieldEffect').replace('[EFFECT]', this.effect(_effect8));
      return _template44;
     }

    case '-sethp':
     {
      var _effect9 = kwArgs.from;
      return this.template('activate', _effect9);
     }

    case '-message':
     {
      var
       _message = args[1];
      return '  ' + _message + '\n';
     }

    case '-hint':
     {
      var
       _message2 = args[1];
      return '  (' + _message2 + ')\n';
     }

    case '-activate':
     {
      var
       _pokemon18 = args[1],
       _effect10 = args[2],
       _target2 = args[3];
      var _id15 = BattleTextParser.effectId(_effect10);
      if (_id15 === 'celebrate') {
       return this.template('activate', 'celebrate').replace('[TRAINER]', this.trainer(_pokemon18.slice(0, 2)));
      }
      if (!_target2 && ['hyperspacefury', 'hyperspacehole', 'phantomforce', 'shadowforce', 'feint'].includes(_id15)) {
       var _ref4 = [kwArgs.of, _pokemon18];
       _pokemon18 = _ref4[0];
       _target2 = _ref4[1];
       if (!_pokemon18) _pokemon18 = _target2;
      }
      if (!_target2) _target2 = kwArgs.of || _pokemon18;

      var _line14 = this.maybeAbility(_effect10, _pokemon18);

      if (_id15 === 'lockon' || _id15 === 'mindreader') {
       var _template46 = this.template('start', _effect10);
       return _line14 + _template46.replace('[POKEMON]', this.pokemon(kwArgs.of)).replace('[SOURCE]', this.pokemon(_pokemon18));
      }

      var _templateId4 = 'activate';
      if (_id15 === 'forewarn' && _pokemon18 === _target2) {
       _templateId4 = 'activateNoTarget';
      }
      var _template45 = this.template(_templateId4, _effect10, 'NODEFAULT');
      if (!_template45) {
       if (_line14) return _line14;
       _template45 = this.template('activate');
       return _line14 + _template45.replace('[EFFECT]', this.effect(_effect10));
      }

      if (_id15 === 'brickbreak') {
       _template45 = _template45.replace('[TEAM]', this.team(_target2.slice(0, 2)));
      }
      if (kwArgs.ability) {
       _line14 += this.ability(kwArgs.ability, _pokemon18);
      }
      if (kwArgs.ability2) {
       _line14 += this.ability(kwArgs.ability2, _target2);
      }
      if (_id15 === 'mummy') {
       _line14 += this.ability("Mummy", _target2);
       _template45 = this.template('changeAbility', "Mummy");
      }
      if (kwArgs.move || kwArgs.number || kwArgs.item) {
       _template45 = _template45.replace('[MOVE]', kwArgs.move).replace('[NUMBER]', kwArgs.number).replace('[ITEM]', kwArgs.item);
      }
      return _line14 + _template45.replace('[POKEMON]', this.pokemon(_pokemon18)).replace('[TARGET]', this.pokemon(_target2)).replace('[SOURCE]', this.pokemon(kwArgs.of));
     }

    case '-prepare':
     {
      var
       _pokemon19 = args[1],
       _effect11 = args[2],
       _target3 = args[3];
      var _template47 = this.template('prepare', _effect11);
      return _template47.replace('[POKEMON]', this.pokemon(_pokemon19)).replace('[TARGET]', this.pokemon(_target3));
     }

    case '-damage':
     {
      var
       _pokemon20 = args[1],
       percentage = args[3];
      var _template48 = this.template('damage', kwArgs.from, 'NODEFAULT');
      var _line15 = this.maybeAbility(kwArgs.from, kwArgs.of || _pokemon20);
      var _id16 = BattleTextParser.effectId(kwArgs.from);
      if (_template48) {
       return _line15 + _template48.replace('[POKEMON]', this.pokemon(_pokemon20));
      }

      if (!kwArgs.from) {
       _template48 = this.template(percentage ? 'damagePercentage' : 'damage');
       return _line15 + _template48.replace('[POKEMON]', this.pokemon(_pokemon20)).replace('[PERCENTAGE]', percentage);
      }
      if (kwArgs.from.startsWith('item:')) {
       _template48 = this.template(kwArgs.of ? 'damageFromPokemon' : 'damageFromItem');
       return _line15 + _template48.replace('[POKEMON]', this.pokemon(_pokemon20)).replace('[ITEM]', this.effect(kwArgs.from)).replace('[SOURCE]', this.pokemon(kwArgs.of));
      }
      if (kwArgs.partiallytrapped || _id16 === 'bind' || _id16 === 'wrap') {
       _template48 = this.template('damageFromPartialTrapping');
       return _line15 + _template48.replace('[POKEMON]', this.pokemon(_pokemon20)).replace('[MOVE]', this.effect(kwArgs.from));
      }

      _template48 = this.template('damage');
      return _line15 + _template48.replace('[POKEMON]', this.pokemon(_pokemon20));
     }

    case '-heal':
     {
      var
       _pokemon21 = args[1];
      var _template49 = this.template('heal', kwArgs.from, 'NODEFAULT');
      var _line16 = this.maybeAbility(kwArgs.from, _pokemon21);
      if (_template49) {
       return _line16 + _template49.replace('[POKEMON]', this.pokemon(_pokemon21)).replace('[SOURCE]', this.pokemon(kwArgs.of)).replace('[NICKNAME]', kwArgs.wisher);
      }

      if (kwArgs.from && !kwArgs.from.startsWith('ability:')) {
       _template49 = this.template('healFromEffect');
       return _line16 + _template49.replace('[POKEMON]', this.pokemon(_pokemon21)).replace('[EFFECT]', this.effect(kwArgs.from));
      }

      _template49 = this.template('heal');
      return _line16 + _template49.replace('[POKEMON]', this.pokemon(_pokemon21));
     }

    case '-boost':
    case '-unboost':
     {
      var
       _pokemon22 = args[1],
       stat = args[2],
       _num4 = args[3];
      if (stat === 'spa' && this.gen === 1) stat = 'spc';
      var amount = parseInt(_num4, 10);
      var _line17 = this.maybeAbility(kwArgs.from, kwArgs.of || _pokemon22);
      var _templateId5 = cmd.slice(1);
      if (amount >= 3) _templateId5 += '3';
      else
      if (amount >= 2) _templateId5 += '2';
      else
      if (amount === 0) _templateId5 += '0';
      if (amount && kwArgs.zeffect) {
       _templateId5 += kwArgs.multiple ? 'MultipleFromZEffect' : 'FromZEffect';
      } else if (amount && kwArgs.from && kwArgs.from.startsWith('item:')) {
       _templateId5 += 'FromItem';
      }
      var _template50 = this.template(_templateId5, kwArgs.from);
      return _line17 + _template50.replace('[POKEMON]', this.pokemon(_pokemon22)).replace('[STAT]', this.stat(stat));
     }

    case '-setboost':
     {
      var
       _pokemon23 = args[1];
      var _effect12 = kwArgs.from;
      var _line18 = this.maybeAbility(_effect12, kwArgs.of || _pokemon23);
      var _template51 = this.template('boost', _effect12);
      return _line18 + _template51.replace('[POKEMON]', this.pokemon(_pokemon23));
     }

    case '-swapboost':
     {
      var
       _pokemon24 = args[1],
       _target4 = args[2];
      var _line19 = this.maybeAbility(kwArgs.from, kwArgs.of || _pokemon24);
      var _id17 = BattleTextParser.effectId(kwArgs.from);
      var _templateId6 = 'swapBoost';
      if (_id17 === 'guardswap') _templateId6 = 'swapDefensiveBoost';
      if (_id17 === 'powerswap') _templateId6 = 'swapOffensiveBoost';
      var _template52 = this.template(_templateId6, kwArgs.from);
      return _line19 + _template52.replace('[POKEMON]', this.pokemon(_pokemon24)).replace('[TARGET]', this.pokemon(_target4));
     }

    case '-copyboost':
     {
      var
       _pokemon25 = args[1],
       _target5 = args[2];
      var _line20 = this.maybeAbility(kwArgs.from, kwArgs.of || _pokemon25);
      var _template53 = this.template('copyBoost', kwArgs.from);
      return _line20 + _template53.replace('[POKEMON]', this.pokemon(_pokemon25)).replace('[TARGET]', this.pokemon(_target5));
     }

    case '-clearboost':
    case '-clearpositiveboost':
    case '-clearnegativeboost':
     {
      var
       _pokemon26 = args[1],
       source = args[2];
      var _line21 = this.maybeAbility(kwArgs.from, kwArgs.of || _pokemon26);
      var _templateId7 = 'clearBoost';
      if (kwArgs.zeffect) _templateId7 = 'clearBoostFromZEffect';
      var _template54 = this.template(_templateId7, kwArgs.from);
      return _line21 + _template54.replace('[POKEMON]', this.pokemon(_pokemon26)).replace('[SOURCE]', this.pokemon(source));
     }

    case '-invertboost':
     {
      var
       _pokemon27 = args[1];
      var _line22 = this.maybeAbility(kwArgs.from, kwArgs.of || _pokemon27);
      var _template55 = this.template('invertBoost', kwArgs.from);
      return _line22 + _template55.replace('[POKEMON]', this.pokemon(_pokemon27));
     }

    case '-clearallboost':
     {
      return this.template('clearAllBoost', kwArgs.from);
     }

    case '-crit':
    case '-supereffective':
    case '-resisted':
     {
      var
       _pokemon28 = args[1];
      var _templateId8 = cmd.slice(1);
      if (_templateId8 === 'supereffective') _templateId8 = 'superEffective';
      if (kwArgs.spread) _templateId8 += 'Spread';
      var _template56 = this.template(_templateId8);
      return _template56.replace('[POKEMON]', this.pokemon(_pokemon28));
     }

    case '-block':
     {
      var
       _pokemon29 = args[1],
       _effect13 = args[2],
       _move2 = args[3];
      var _line23 = this.maybeAbility(_effect13, kwArgs.of || _pokemon29);
      var _template57 = this.template('block', _effect13);
      return _line23 + _template57.replace('[POKEMON]', this.pokemon(_pokemon29)).replace('[MOVE]', _move2);
     }

    case '-fail':
     {
      var
       _pokemon30 = args[1],
       _effect14 = args[2],
       _stat2 = args[3];
      var _id18 = BattleTextParser.effectId(_effect14);
      var blocker = BattleTextParser.effectId(kwArgs.from);
      var _line24 = this.maybeAbility(kwArgs.from, kwArgs.of || _pokemon30);
      var _templateId9 = 'block';
      if (['desolateland', 'primordialsea'].includes(blocker) &&
       !['sunnyday', 'raindance', 'sandstorm', 'hail'].includes(_id18)) {
       _templateId9 = 'blockMove';
      } else if (blocker === 'uproar' && kwArgs.msg) {
       _templateId9 = 'blockSelf';
      }
      var _template58 = this.template(_templateId9, kwArgs.from);
      if (_template58) {
       return _line24 + _template58.replace('[POKEMON]', this.pokemon(_pokemon30));
      }

      if (_id18 === 'unboost') {
       _template58 = this.template(_stat2 ? 'failSingular' : 'fail', 'unboost');
       if (BattleTextParser.effectId(kwArgs.from) === 'flowerveil') {
        _template58 = this.template('block', kwArgs.from);
        _pokemon30 = kwArgs.of;
       }
       return _line24 + _template58.replace('[POKEMON]', this.pokemon(_pokemon30)).replace('[STAT]', _stat2);
      }

      _templateId9 = 'fail';
      if (['brn', 'frz', 'par', 'psn', 'slp', 'substitute'].includes(_id18)) {
       _templateId9 = 'alreadyStarted';
      }
      if (kwArgs.heavy) _templateId9 = 'failTooHeavy';
      if (kwArgs.weak) _templateId9 = 'fail';
      if (kwArgs.forme) _templateId9 = 'failWrongForme';
      _template58 = this.template(_templateId9, _id18);
      return _line24 + _template58.replace('[POKEMON]', this.pokemon(_pokemon30));
     }

    case '-immune':
     {
      var
       _pokemon31 = args[1];
      var _line25 = this.maybeAbility(kwArgs.from, kwArgs.of || _pokemon31);
      var _template59 = this.template('block', kwArgs.from);
      if (!_template59) {
       var _templateId10 = kwArgs.ohko ? 'immuneOHKO' : 'immune';
       _template59 = this.template(_pokemon31 ? _templateId10 : 'immuneNoPokemon', kwArgs.from);
      }
      return _line25 + _template59.replace('[POKEMON]', this.pokemon(_pokemon31));
     }

    case '-miss':
     {
      var
       _source = args[1],
       _pokemon32 = args[2];
      var _line26 = this.maybeAbility(kwArgs.from, kwArgs.of || _pokemon32);
      if (!_pokemon32) {
       var _template61 = this.template('missNoPokemon');
       return _line26 + _template61.replace('[SOURCE]', this.pokemon(_source));
      }
      var _template60 = this.template('miss');
      return _line26 + _template60.replace('[POKEMON]', this.pokemon(_pokemon32));
     }

    case '-center':
    case '-ohko':
    case '-combine':
     {
      return this.template(cmd.slice(1));
     }

    case '-notarget':
     {
      return this.template('noTarget');
     }

    case '-mega':
    case '-primal':
     {
      var
       _pokemon33 = args[1],
       species = args[2],
       _item2 = args[3];
      var _id19 = '';
      var _templateId11 = cmd.slice(1);
      if (species === 'Rayquaza') {
       _id19 = 'dragonascent';
       _templateId11 = 'megaNoItem';
      }
      if (!_id19 && cmd === '-mega' && this.gen < 7) _templateId11 = 'megaGen6';
      if (!_item2 && cmd === '-mega') _templateId11 = 'megaNoItem';
      var _template62 = this.template(_templateId11);
      var _side6 = _pokemon33.slice(0, 2);
      var pokemonName = this.pokemon(_pokemon33);
      if (cmd === '-mega') {
       var template2 = this.template('transformMega');
       _template62 += template2.replace('[POKEMON]', pokemonName).replace('[SPECIES]', species);
      }
      return _template62.replace('[POKEMON]', pokemonName).replace('[ITEM]', _item2).replace('[TRAINER]', this.trainer(_side6));
     }

    case '-zpower':
     {
      var
       _pokemon34 = args[1];
      var _template63 = this.template('zPower');
      return _template63.replace('[POKEMON]', this.pokemon(_pokemon34));
     }

    case '-burst':
     {
      var
       _pokemon35 = args[1];
      var _template64 = this.template('activate', "Ultranecrozium Z");
      return _template64.replace('[POKEMON]', this.pokemon(_pokemon35));
     }

    case '-zbroken':
     {
      var
       _pokemon36 = args[1];
      var _template65 = this.template('zBroken');
      return _template65.replace('[POKEMON]', this.pokemon(_pokemon36));
     }

    case '-hitcount':
     {
      var
       _num5 = args[2];
      if (_num5 === '1') {
       return this.template('hitCountSingular');
      }
      return this.template('hitCount').replace('[NUMBER]', _num5);
     }

    case '-waiting':
     {
      var
       _pokemon37 = args[1],
       _target6 = args[2];
      var _template66 = this.template('activate', "Water Pledge");
      return _template66.replace('[POKEMON]', this.pokemon(_pokemon37)).replace('[TARGET]', this.pokemon(_target6));
     }

    case '-anim':
     {
      return '';
     }

    default:
     {
      return null;
     }
   }

  };
  return BattleTextParser;
 }();


if (typeof require === 'function') {

 global.BattleTextParser = BattleTextParser;
}
