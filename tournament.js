// TODO: Document this class

function Tournament(name, metagame, rooms, lobby, maxParticipants)
{
    if (!maxParticipants || !(maxParticipants = parseInt(maxParticipants)))
        maxParticipants = 0;
    if (!name || name.length < 2)
        throw Error("NameTooShortException");
    if (!rooms || !lobby || lobby.type !== "lobby")
        throw Error("InvalidArgumentsException");

    // Private variables and constructor. (A bit of the constructor is also at the very end of this function)
    // "Real" javascript private variables are too annoying, so we just make them public and hope no-one edits them ;)
    this.name_ = name;
    this.metagame_ = metagame;

    this.rooms_ = rooms;
    this.lobby_ = lobby;

    this.tournamentBuilder_ = new TournamentBuilder(maxParticipants);

    this.currentBattles_ = new Array();
    this.finishedBattleScores_ = new Array();

    this.publicTournamentTreeCache_;
    this.isNeedRebuildPublicTournamentTreeCache_ = true;

    this.actionOnDraw_ = "rematch"; // "rematch" or "bye"

    this.isAutopiloting_ = false;
    this.autopilotTimer_;

    // Public functions

    this.getName = function()
    {
        return this.name_;
    }

    this.getMetagame = function()
    {
        return this.metagame_;
    }

    this.addParticipant = function(user, errorSocket, isNotYourself)
    {
        if (!user || !user.getIdentity || !errorSocket)
            throw Error("InvalidArgumentsException");
        try
        {
            this.tournamentBuilder_.addParticipant(user);
            this.isNeedRebuildPublicTournamentTreeCache_ = true;
            this.writeMessage_(user.getIdentity() + " has joined the tournament named \"" + this.name_ + "\"!");
            return true;
        } catch (e)
        {
            switch (e.message)
            {
                case "JoinLockedException" :
                    errorSocket.emit("console", "Joining is locked because the tournament has already started.");
                    break;

                case "UserAlreadyParticipatingException" :
                    if (isNotYourself)
                        errorSocket.emit("console", "The user is already participating in the tournament.");
                    else
                        errorSocket.emit("console", "You are already participating in the tournament.");
                    break;

                case "TournamentFullException" :
                    errorSocket.emit("console", "The tournament is currently full.");
                    break;

                default :
                    throw e;
            }
        }
        return false;
    }

    this.removeParticipant = function(user, errorSocket, isNotYourself)
    {
        if (!user || !user.getIdentity || !errorSocket)
            throw Error("InvalidArgumentsException");
        try
        {
            this.tournamentBuilder_.removeParticipant(user);
            this.isNeedRebuildPublicTournamentTreeCache_ = true;
            this.writeMessage_(user.getIdentity() + " has left the tournament named \"" + this.name_ + "\".");
            return true;
        } catch (e)
        {
            switch (e.message)
            {
                case "JoinLockedException" :
                    errorSocket.emit("console", "Leaving is locked because the tournament has already started.");
                    break;

                case "UserNotFoundException" :
                    if (isNotYourself)
                        errorSocket.emit("console", "The user is currently not in the tournament.");
                    else
                        errorSocket.emit("console", "You are currently not in the tournament.");
                    break;

                default :
                    throw e;
            }
        }
        return false;
    }

    this.getParticipants = function()
    {
        return this.tournamentBuilder_.getParticipants();
    }

    this.getIsJoiningLocked = function()
    {
        return this.tournamentBuilder_.getIsJoiningLocked();
    }

    this.getMaxParticipants = function()
    {
        return this.tournamentBuilder_.getMaxParticipants();
    }

    this.setMaxParticipants = function(maxParticipants, errorSocket)
    {
        if (!errorSocket)
            throw Error("InvalidArgumentsException");
        if (!maxParticipants || !(maxParticipants = parseInt(maxParticipants)))
            maxParticipants = 0;
        try
        {
            var removedParticipants = this.tournamentBuilder_.setMaxParticipants(maxParticipants);
            this.isNeedRebuildPublicTournamentTreeCache_ = true;
            for (var p in removedParticipants)
                removedParticipants[p].emit("console", "You have been removed from the tournament named \"" + this.name_ + "\".");
            this.broadcast_("The maximum number of participants for the tournament named \"" + this.name_ + "\" has been set to " + maxParticipants + ".");
        } catch (e)
        {
            switch (e.message)
            {
                case "MaxParticipantsTooLowException" :
                    errorSocket.emit("console", "The maximum number of participants must be at least 2.");
                    break;

                default :
                    throw e;
            }
        }
    }

    this.startAutopilot = function(errorSocket)
    {
        if (this.isAutopiloting_)
        {
            errorSocket.emit("console", "Autopilot is already running for this tournament.");
            return;
        }

        // First check for anything that might stop autopilot in the first iteration
        if (this.tournamentBuilder_.getIsEnded())
        {
            errorSocket.emit("console", "The tournament has already ended. Please rebuild the tree if you wish to reuse the tournament.");
            return;
        }
        try
        {
            this.tournamentBuilder_.getTournamentTreeCopy();
        } catch (e)
        {
            if (e.message === "ParticipantsTooLowException")
            {
                errorSocket.emit("console", "There are less than two participants currently, so the tournament tree cannot be built.");
                return;
            }
            else
                throw e;
        }

        // Make a fake error socket and start the autopilot
        var fakeErrorSocket =
        {
            lobby_: this.lobby_,
            log: [],
            emit: function(command, data)
            {
                this.log.push(command + ": " + JSON.stringify(data));
            }
        };
        this.continueAutopilot(fakeErrorSocket);
    }

    // Internal use. Do not use this directly. Put as public so setTimeout can call it.
    this.continueAutopilot = function(fakeErrorSocket)
    {
        var isContinueAutopilot = true;
        try
        {
            var prevLogLength;
            do
            {
                prevLogLength = fakeErrorSocket.log.length;
                this.startNextBattle(fakeErrorSocket);
            } while (prevLogLength === fakeErrorSocket.log.length);
            if (fakeErrorSocket.log[prevLogLength] === "console: \"There are no more battles left in this tournament.\"" ||
                fakeErrorSocket.log[prevLogLength] === "console: \"There are less than two participants currently, so the tournament tree cannot be built.\"")
                isContinueAutopilot = false;
        }
        catch (e)
        {
            this.isAutopiloting_ = false;
            throw e;
        }

        if (isContinueAutopilot)
        {
            this.isAutopiloting_ = true;
            this.autopilotTimer_ = setTimeout(function(self, fakeErrorSocket) { self.continueAutopilot(fakeErrorSocket); }, 30000, this, fakeErrorSocket);
        }
        else
            this.isAutopiloting_ = false;
    }

    this.stopAutopilot = function(errorSocket)
    {
        if (!this.isAutopiloting_)
        {
            errorSocket.emit("console", "Autopilot is not currently running for this tournament.");
            return;
        }
        clearTimeout(this.autopilotTimer_);
        this.isAutopiloting_ = false;
    }

    this.startNextBattle = function(errorSocket)
    {
        if (!errorSocket)
            throw Error("InvalidArgumentsException");
        try
        {
            var isFirstBattle = !this.getIsJoiningLocked();
            var battle = this.tournamentBuilder_.getNextBattle();
            this.tournamentBuilder_.setBattleStatus(battle, TournamentBuilderTreeNodeBattleDataBattleStatus.WAITING);
            this.isNeedRebuildPublicTournamentTreeCache_ = true;
            if (isFirstBattle)
                this.broadcast_("The tournament named \"" + this.name_ + "\" has started!");

            // Both are online, I hope?
            if (!battle.a.connected || !battle.b.connected)
            {
                if (battle.a.connected)
                {
                    this.tournamentBuilder_.setBattleStatus(battle, TournamentBuilderTreeNodeBattleDataBattleStatus.A_WIN);
                    this.writeMessage_(battle.a.getIdentity() + " won a game in the tournament named \"" + this.name_ + "\" by default because " + battle.b.getIdentity() + " is offline.");
                }
                else if (battle.b.connected)
                {
                    this.tournamentBuilder_.setBattleStatus(battle, TournamentBuilderTreeNodeBattleDataBattleStatus.B_WIN);
                    this.writeMessage_(battle.b.getIdentity() + " won a game in the tournament named \"" + this.name_ + "\" by default because " + battle.a.getIdentity() + " is offline.");
                }
                else
                {
                    this.tournamentBuilder_.setBattleStatus(battle, TournamentBuilderTreeNodeBattleDataBattleStatus.DRAW);
                    this.writeMessage_("A game in the tournament named \"" + this.name_ + "\" was drawed because both " + battle.a.getIdentity() + " and " + battle.b.getIdentity() + " are offline.");
                }
                this.isNeedRebuildPublicTournamentTreeCache_ = true;
                return;
            }

            // Inject our javascript
            this.injectClientSideScript_();

            setTimeout(function(self, battle) { self.startNextBattleWorker(battle); }, 1000, this, battle); // Give one second for the script to be injected
        } catch (e)
        {
            switch (e.message)
            {
                case "ParticipantsTooLowException" :
                    errorSocket.emit("console", "There are less than two participants currently, so the tournament tree cannot be built.");
                    break;

                case "FinalsDefaultWinNonException" :
                    this.broadcast_("The finals for the tournament named \"" + this.name_ + "\" was skipped because either side had a draw.");
                    this.isNeedRebuildPublicTournamentTreeCache_ = true;
                    break;

                case "NoRemainingBattlesException" :
                    errorSocket.emit("console", "There are no more battles left in this tournament.");
                    break;

                case "NoAvailableBattlesException" :
                    errorSocket.emit("console", "No new battles can be started at the moment because of unfinished battles.");
                    break;

                default :
                    throw e;
            }
        }
    }

    // Internal use. Do not call this directly. Put as public so setTimeout can call it.
    this.startNextBattleWorker = function(battle)
    {
        // We use setTimeout and a lock to prevent more than one tournament challenge popping up at once
        if (battle.a.isTournamentChallenging || battle.b.isTournamentChallenging)
        {
            setTimeout(function(self, battle) { self.startNextBattleWorker(battle); }, 45000, this, battle)
            return;
        }

        battle.a.isTournamentChallenging = true;
        battle.b.isTournamentChallenging = true;
        var battleId = battle.offset;
        this.currentBattles_[battleId] = battle;

        this.beginBattle_(battleId);
    }

    // For use only by the incoming "tournamentChallenge" packet handler. Do not use anywhere else.
    this.handleTournamentChallengePacket = function(user, action, battleId)
    {
        if (!user || !action || battleId === undefined)
            throw Error("InvalidArgumentsException");
        if (this.currentBattles_[battleId] === undefined)
            return;
        var battle = this.currentBattles_[battleId];
        if (user !== battle.a && user !== battle.b)
            return;

        var otherUser;
        if (user === battle.a)
            otherUser = battle.b;
        else
            otherUser = battle.a;

        switch (action)
        {
            case "accept" :
                var problems = Tools.validateTeam(user.team, this.metagame_);
                if (problems)
                {
                    user.emit('message', "Your team was rejected for the following reasons:\n\n- "+problems.join("\n- "));
                    return;
                }
                if (!otherUser.connected)
                {
                    this.setBattleWinner_(battleId, user);
                    user.emit('message', "Your opponent is no longer online. You have won the battle by default.");
                    this.currentBattles_[battleId] = undefined;
                    return;
                }
                if (user === battle.a)
                    battle.aTeamConfirmed = true;
                else
                    battle.bTeamConfirmed = true;
                user.emit("tournament challenge", { action: "opponent select team wait" });
                if (battle.aTeamConfirmed && battle.bTeamConfirmed)
                {
                    user.emit("tournament challenge", { action: "close overlay" });
                    otherUser.emit("tournament challenge", { action: "close overlay" });
                    this.startBattle_(battleId);
                }
                break;

            case "forfeit" :
                battle.aTeamConfirmed = true;
                battle.bTeamConfirmed = true;
                this.setBattleWinner_(battleId, otherUser);
                this.currentBattles_[battleId] = undefined;
                otherUser.emit("tournament challenge", { action: "opponent forfeit", name: this.name_ });
                break;

            case "forfeit no teams" :
                battle.aTeamConfirmed = true;
                battle.bTeamConfirmed = true;
                this.setBattleWinner_(battleId, otherUser);
                this.currentBattles_[battleId] = undefined;
                otherUser.emit("tournament challenge", { action: "opponent forfeit no teams", name: this.name_ });
                break;
        }
    }

    // For use only by Room.update(). Do not use anywhere else.
    this.setBattleWinner = function(battleId, winner)
    {
        if (this.currentBattles_[battleId] === undefined)
            throw Error("InvalidArgumentsException");
        var battle = this.currentBattles_[battleId];
        if (winner !== battle.a && winner !== battle.b && this.actionOnDraw_ === "rematch")
        {
            var drawNotice = "The ";
            if (battle.isFinals)
                drawNotice += "<strong>finals</strong> ";
            drawNotice += "battle between " + battle.a.getIdentity() + " and " + battle.b.getIdentity() + " in the tournament named \"" + this.name_ + "\" was a draw. Requesting rematch in thirty seconds...";
            if (battle.isFinals)
                this.broadcast_(drawNotice);
            else
                this.writeMessage_(drawNotice);
            setTimeout(function(self, battleId) { self.beginBattle_(battleId); }, 30000, this, battleId);
        }
        else
        {
            this.setBattleWinner_(battleId, winner);
            this.currentBattles_[battleId] = undefined;
        }
        this.finishedBattleScores_[battleId] = { a: rooms[battle.roomId].battle.allySide.pokemonLeft, b: rooms[battle.roomId].battle.foeSide.pokemonLeft };
    }

    this.setActionOnDraw = function(action, errorSocket)
    {
        if (!action)
            throw Error("InvalidArgumentsException");
        if (action !== "rematch" && action !== "bye")
            errorSocket.emit("console", "The action must be either \"rematch\" or \"bye\".");
        else
            this.actionOnDraw_ = action;
    }

    this.getWinner = function(outputSocket, errorSocket)
    {
        if (!outputSocket || !errorSocket)
            throw Error("InvalidArgumentsException");
        try
        {
            var winnerUser = this.tournamentBuilder_.getWinner();
            if (winnerUser === null)
                outputSocket.emit("console", "Nobody won the tournament named \"" + this.name_ + "\" because it ended with a draw.");
            else
                outputSocket.emit("console", "\"" + winnerUser.getIdentity() + "\" won the tournament named \"" + this.name_ + "\".");
        } catch (e)
        {
            switch (e.message)
            {
                case "FinalsNotFinishedException" :
                    errorSocket.emit("console", "The finals have not started or finished yet.");
                    break;

                default :
                    throw e;
            }
        }
    }

    this.getTree = function(outputSocket, errorSocket)
    {
        if (!outputSocket)
            throw Error("InvalidArgumentsException");
        try
        {
            if (this.isNeedRebuildPublicTournamentTreeCache_)
            {
                var tree = this.tournamentBuilder_.getTournamentTreeCopy();

                // Preprocess the tree so the winners and losers themselves are marked
                var toScan = new Array();
                toScan.push(tree.rootNodeOffset);
                while (toScan.length !== 0)
                {
                    var currentNode = tree.nodeStorage[toScan.shift()];
                    if (currentNode.type !== TournamentBuilderTreeNodeType.BATTLE)
                        continue;
                    switch (currentNode.battle.status)
                    {
                        case TournamentBuilderTreeNodeBattleDataBattleStatus.A_WIN :
                            tree.nodeStorage[currentNode.battle.childAOffset].isNextBattleWon = true;
                            tree.nodeStorage[currentNode.battle.childBOffset].isNextBattleLost = true;
                            break;

                        case TournamentBuilderTreeNodeBattleDataBattleStatus.B_WIN :
                            tree.nodeStorage[currentNode.battle.childBOffset].isNextBattleWon = true;
                            tree.nodeStorage[currentNode.battle.childAOffset].isNextBattleLost = true;
                            break;

                        case TournamentBuilderTreeNodeBattleDataBattleStatus.DRAW :
                            tree.nodeStorage[currentNode.battle.childBOffset].isNextBattleDrawed = true;
                            tree.nodeStorage[currentNode.battle.childAOffset].isNextBattleDrawed = true;
                            break;

                        default:
                            break;
                    }
                    toScan.push(currentNode.battle.childAOffset);
                    toScan.push(currentNode.battle.childBOffset);
                }

                // Build the public tree
                var publicTree = { children: [] };
                var toBuild = new Array();
                toBuild.push({ parent: publicTree, offset: tree.rootNodeOffset });
                while (toBuild.length !== 0)
                {
                    var currentToBuild = toBuild.pop();
                    var currentNode = tree.nodeStorage[currentToBuild.offset];

                    var publicNode = { id: currentToBuild.offset, name: "", data: {}, children: [] };
                    if (currentNode.type === TournamentBuilderTreeNodeType.PARTICIPANT)
                        if (currentNode.participant === null)
                        {
                            publicNode.name = "Bye";
                            publicNode.data.isBye = true;
                        }
                        else
                            publicNode.name = currentNode.participant.getIdentity();
                    else
                    {
                        publicNode.data.isBattle = true;
                        publicNode.data.battleStatus = currentNode.battle.status;
                        if (this.finishedBattleScores_[currentToBuild.offset] !== undefined)
                            publicNode.data.battleScore = this.finishedBattleScores_[currentToBuild.offset];
                        else
                            publicNode.data.battleScore = null;

                        switch (currentNode.battle.status)
                        {
                            case TournamentBuilderTreeNodeBattleDataBattleStatus.A_WIN :
                            case TournamentBuilderTreeNodeBattleDataBattleStatus.B_WIN :
                                publicNode.name = currentNode.battle.winner.getIdentity();
                                break;

                            case TournamentBuilderTreeNodeBattleDataBattleStatus.DRAW :
                                publicNode.name = "Draw";
                                break;

                            case TournamentBuilderTreeNodeBattleDataBattleStatus.PENDING :
                                publicNode.name = "Pending...";
                                publicNode.data.battleRoomId = this.currentBattles_[currentToBuild.offset].roomId;
                                break;

                            case TournamentBuilderTreeNodeBattleDataBattleStatus.WAITING :
                                publicNode.name = "Waiting...";
                                break;

                            case TournamentBuilderTreeNodeBattleDataBattleStatus.NOT_STARTED :
                                publicNode.name = "Not Started";
                                break;
                        }
                        toBuild.push({ parent: publicNode, offset: currentNode.battle.childAOffset });
                        toBuild.push({ parent: publicNode, offset: currentNode.battle.childBOffset });
                    }

                    if (publicNode.data.isBye)
                        ;
                    else if (currentNode.isNextBattleWon)
                        publicNode.data.isNextBattleWon = true;
                    else if (currentNode.isNextBattleLost)
                        publicNode.data.isNextBattleLost = true;
                    else if (currentNode.isNextBattleDrawed)
                        publicNode.data.isNextBattleDrawed = true;

                    currentToBuild.parent.children.push(publicNode);
                }
                publicTree = publicTree.children[0];
                this.publicTournamentTreeCache_ = publicTree;
                this.isNeedRebuildPublicTournamentTreeCache_ = false;
            }

            this.injectClientSideScript_();
            setTimeout(function(outputSocket, name, tree) { outputSocket.emit("tournament challenge", { action: "receive tree", name: name, tree: tree }); }, 1000, outputSocket, this.name_, this.publicTournamentTreeCache_);
        } catch (e)
        {
            switch (e.message)
            {
                case "ParticipantsTooLowException" :
                    errorSocket.emit("console", "There are less than two participants currently, so the tree cannot be built.");
                    break;

                default :
                    throw e;
            }
        }
    }

    this.rebuildTree = function(errorSocket)
    {
        if (!errorSocket)
            throw Error("InvalidArgumentsException");
        try
        {
            this.tournamentBuilder_.rebuildTournamentTree();
            this.isNeedRebuildPublicTournamentTreeCache_ = true;
            this.writeMessage_("The tournament tree for the tournament named \"" + this.name_ + "\" has been (re)built!");
        } catch (e)
        {
            switch (e.message)
            {
                case "JoinLockedException" :
                    errorSocket.emit("console", "Tree rebuilding is locked because the tournament is currently in progress.");
                    break;

                case "ParticipantsTooLowException" :
                    errorSocket.emit("console", "There are less than two participants currently, so the tree cannot be (re)built.");
                    break;

                default :
                    throw e;
            }
        }
    }

    // Private functions.
    // Like the private variables, "real" javascript private functions are too annoying so we hope no-one uses these.

    this.injectClientSideScript_ = function(extraMessage, room)
    {
        if (!room)
            room = this.lobby_;
        if (!extraMessage)
            extraMessage = "";

        //var tournamentInjection = "<script type=\"application/javascript\" src=\""; // Doesn't seem to work
        var tournamentInjection = extraMessage;
        tournamentInjection += "<script type=\"text/javascript\" src=\"";
        tournamentInjection += "http://kotarou.x10.mx/pokemonshowdowntournament/tournament.js";
        tournamentInjection += "\"></script>";
        room.addRaw(tournamentInjection);
    }

    this.beginBattle_ = function(battleId)
    {
        var battle = this.currentBattles_[battleId];
        battle.aTeamConfirmed = false;
        battle.bTeamConfirmed = false;
        battle.a.emit("tournament challenge", { action: "select team", name: this.name_, metagame: this.metagame_, id: battleId, opponent: battle.b.getIdentity() });
        battle.b.emit("tournament challenge", { action: "select team", name: this.name_, metagame: this.metagame_, id: battleId, opponent: battle.a.getIdentity() });
        setTimeout(function(self, battleId) { self.beginBattleTimeout_(battleId); }, 60000, this, battleId); // One minute to select teams
    }

    this.beginBattleTimeout_ = function(battleId)
    {
        if (this.currentBattles_[battleId] === undefined)
            return;
        var battle = this.currentBattles_[battleId];
        if (!battle.aTeamConfirmed && !battle.bTeamConfirmed)
        {
            this.setBattleWinner_(battleId);
            battle.a.emit("tournament challenge", { action: "select team timeout", name: this.name_ });
            battle.b.emit("tournament challenge", { action: "select team timeout", name: this.name_ });
        }
        else if (!battle.aTeamConfirmed)
        {
            this.setBattleWinner_(battleId, battle.b);
            battle.a.emit("tournament challenge", { action: "select team timeout", name: this.name_ });
            battle.b.emit("tournament challenge", { action: "opponent select team timeout", name: this.name_ });
        }
        else if (!battle.bTeamConfirmed)
        {
            this.setBattleWinner_(battleId, battle.a);
            battle.b.emit("tournament challenge", { action: "select team timeout", name: this.name_ });
            battle.a.emit("tournament challenge", { action: "opponent select team timeout", name: this.name_ });
        }
        else
            return;
        this.currentBattles_[battleId] = undefined;
    }

    this.startBattle_ = function(battleId)
    {
        var battle = this.currentBattles_[battleId];

        // Get a unique room id
        var roomId = "battle-" + this.metagame_.toLowerCase() + "tournament" + stob(this.name_) + "00" + battleId + "0";
        var roomIdSuffix = 0;
        while (rooms[roomId + roomIdSuffix] !== undefined)
            ++roomIdSuffix;
        roomId += roomIdSuffix;
        battle.roomId = roomId;

        // Create the room and assign it to the lobby
        var room = newRoom(roomId, this.metagame_, battle.a, battle.b, this.lobby_, true, { name: this.name_, battleId: battleId });
        room.i[this.lobby_.id] = this.lobby_.rooms.length;
        this.lobby_.rooms.push(room);

        // Send the players in to the room
        battle.a.joinRoom(room);
        battle.b.joinRoom(room);
        room.joinBattle(battle.a);
        room.joinBattle(battle.b);
        this.lobby_.roomsChanged = true;

        // Update the battle status
        this.tournamentBuilder_.setBattleStatus(battle, TournamentBuilderTreeNodeBattleDataBattleStatus.PENDING);
        this.isNeedRebuildPublicTournamentTreeCache_ = true;

        // Notify everybody!
        var battleNotice = "<a class=\"battle-start\" onclick=\"selectTab('" + roomId + "'); return false\" href=\"" + roomId + "\">The ";
        if (battle.isFinals)
            battleNotice += "<strong>finals</strong> ";
        battleNotice += "battle between " + battle.a.getIdentity() + " and " + battle.b.getIdentity() + " for the tournament named \"" + this.name_ + "\" has started.";
        battleNotice += "</a>";
        if (battle.isFinals)
            this.broadcast_(battleNotice);
        else
            this.writeMessage_(battleNotice);
    }

    this.setBattleWinner_ = function(battleId, winner)
    {
        var battle = this.currentBattles_[battleId]
        var loser = undefined;
        if (winner === battle.a)
        {
            this.tournamentBuilder_.setBattleStatus(battle, TournamentBuilderTreeNodeBattleDataBattleStatus.A_WIN);
            loser = battle.b;
        }
        else if (winner === battle.b)
        {
            this.tournamentBuilder_.setBattleStatus(battle, TournamentBuilderTreeNodeBattleDataBattleStatus.B_WIN);
            loser = battle.a;
        }
        else
        {
            this.tournamentBuilder_.setBattleStatus(battle, TournamentBuilderTreeNodeBattleDataBattleStatus.DRAW);
            var drawNotice = "The ";
            if (battle.isFinals)
                drawNotice += "<strong>finals</strong> ";
            drawNotice += "battle between " + battle.a.getIdentity() + " and " + battle.b.getIdentity() + " in the tournament named \"" + this.name_ + "\" was a draw.";
            if (battle.isFinals)
                this.broadcast_(drawNotice);
            else
                this.writeMessage_(drawNotice);
        }
        if (loser !== undefined)
        {
            var winNotice = winner.getIdentity() + " won the ";
            if (battle.isFinals)
                winNotice += "<strong>finals</strong> ";
            winNotice += "battle against " + loser.getIdentity() + " in the tournament named \"" + this.name_ + "\".";
            if (battle.isFinals)
                this.broadcast_(winNotice);
            else
                this.writeMessage_(winNotice);
        }
        this.isNeedRebuildPublicTournamentTreeCache_ = true;
        battle.a.isTournamentChallenging = false;
        battle.b.isTournamentChallenging = false;
    }

    this.writeMessage_ = function(message, room)
    {
        if (!room)
            room = this.lobby_;
        this.injectClientSideScript_("<div class=\"tournament-message\">" + message + "</div>", room);
    }

    this.broadcast_ = function(message)
    {
        for (var r in this.rooms_)
            this.writeMessage_(message, this.rooms_[r]);
    }

    // The "bit of the constructor"
    this.broadcast_("A new " + (BattleFormats[metagame] && BattleFormats[metagame].name ? BattleFormats[metagame].name : metagame) + " tournament named \"" + name + "\" has been created. Maximum participants: " + maxParticipants + ".");
}

function stob(s)
{
    var result = "";
    for (var i in s)
        result += s.charCodeAt(i).toString(16);
    return result;
}

exports.Tournament = Tournament;
