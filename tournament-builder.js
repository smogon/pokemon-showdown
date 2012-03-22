// All these offsets are offsets from `nodeStorage'
var TournamentBuilderTreeNodeBattleDataBattleStatus = Object.freeze({ NOT_STARTED:0, WAITING: 1, PENDING:2, A_WIN:3, B_WIN:4, DRAW:5 });
function TournamentBuilderTreeNodeBattleData()
{
    this.childAOffset;
    this.childBOffset;
    this.status; // Of the type `TournamentBuilderTreeNodeBattleDataBattleStatus`
    this.winner; // null for a bye
}
var TournamentBuilderTreeNodeType = Object.freeze({ PARTICIPANT:0, BATTLE:1 });
function TournamentBuilderTreeNode()
{
    this.type; // Of the type `TournamentBuilderTreeNodeType`
    // If javascript supported unions, the next two members would be in a union
    this.battle = new TournamentBuilderTreeNodeBattleData();
    this.participant; // null for a bye

    this.parentOffset; // Points to itself if we are the root node
}
function TournamentBuilderTree()
{
    this.nodeStorage = new Array(); // For automatic garbage collection (Stores TournamentBuilderTreeNode objects)
    this.rootNodeOffset; // Is _always_ a battle node
    this.leafNodesOffsets = new Array();
}

function TournamentBuilderBattle()
{
    this.a; // Objects representing the users to battle
    this.b; // each other.
    this.isFinals;
    this.offset; // Used internally by the class. Do not modify.
}

// Constructor(maxParticipants):
//  maxParticipants = Maximum number of participants. Can be changed later.
// Throws:
//  "MaxParticipantsTooLowException" = The max number of participants must be at least 2.
function TournamentBuilder(maxParticipants)
{
    // Private variables and the constructor.
    // "Real" javascript private variables are too annoying, so we just make them public and hope no-one edits them ;)

    this.maxParticipants_ = maxParticipants;
    this.participants_ = new Array();
    this.isJoiningLocked_ = false;
    this.isEnded_ = false;

    this.tournamentTree_ = new TournamentBuilderTree();
    this.isTournamentTreeBuilt_ = false;

    if (maxParticipants < 2)
        throw Error("MaxParticipantsTooLowException");

    // Public functions

    // getMaxParticipants() gets the maximum number of participants allowed to join the tournament.
    // Returns the maximum participants as a number.
    this.getMaxParticipants = function()
    {
        return this.maxParticipants_;
    }

    // setMaxParticipants(maxParticipants) sets the maximum number of participants allowed to join the tournament.
    //  maxParticipants = Maximum number of participants. If the current number of participants are over this number,
    //                    they get kicked starting with the latest joiner.
    // Returns an array of the participants removed.
    // Throws:
    //  "MaxParticipantsTooLowException" = The max number of participants must be at least 2.
    this.setMaxParticipants = function(maxParticipants)
    {
        this.testJoinNotLocked_();

        if (maxParticipants < 2)
            throw Error("MaxParticipantsTooLowException");

        this.maxParticipants_ = maxParticipants;
        if (this.participants_.length <= maxParticipants)
            return [];

        // Remove participants until we are equal to the max starting with the latest joiner
        var participantsRemoved = new Array();
        var participantOffset = this.participants_.length - 1;
        for (var p = this.participants_.length - maxParticipants; p > 0; --p)
            try
            {
                participantsRemoved.push(this.participants_[participantOffset]);
                participantOffset = this.removeParticipant_(participantOffset) - 1;
            } catch (e)
            {
                // Swallow the exception
            }
        return participantsRemoved;
    }

    // getIsJoiningLocked() gets whether it is currently possible for users to join or leave, or have the tournament tree rebuilt.
    // Returns a boolean value.
    this.getIsJoiningLocked = function()
    {
        return this.isJoiningLocked_;
    }

    // getIsEnded() gets whether the current tournament has ended. This gets reset to false every time a user joins or leaves and when the tree is rebuilt.
    // Returns a boolean value.
    this.getIsEnded = function()
    {
        return this.isEnded_;
    }

    // addParticipant(participant) adds a user to the tournament.
    //  participant = An object representing a user to be added to the tournament. The class does not care what the object is.
    // Returns nothing.
    // Throws:
    //  "JoinLockedException" = Joining is locked due to a previous call to nextBattle() telling the class that the tournament has started.
    //  "UserAlreadyParticipatingException" = The user is already participating in the tournament.
    //  "TournamentFullException" = The tournament is currently full.
    this.addParticipant = function(participant)
    {
        this.testJoinNotLocked_();
        this.addParticipant_(participant);
    }

    // removeParticipant(participant) removes a user from the tournament.
    //  participant = An object representing the user to be removed. It must be the same as the one passed to addParticipant().
    // Returns nothing.
    // Throws:
    //  "JoinLockedException" = Leaving is locked due to a previous call to nextBattle() telling the class that the tournament has started.
    //  "UserNotFoundException" = No such user was found participating in the tournament.
    this.removeParticipant = function(participant)
    {
        this.testJoinNotLocked_();
        this.removeParticipant_(this.getOffsetToParticipant_(participant));
    }

    // getParticipants() gets the users participating in the tournament.
    // Returns an array of the users currently participating in the tournament.
    this.getParticipants = function()
    {
        return this.participants_.slice(0);
    }

    // getTournamentTreeCopy() gets a copy of the internal tournament tree in a TournamentBuilderTree structure.
    // Returns a binary tree representing the tournament. How to use this tree is undocumented.
    //  "ParticipantsTooLowException" = There are less than two participants currently and therefore unable to build a tree.
    this.getTournamentTreeCopy = function()
    {
        if (!this.isTournamentTreeBuilt_)
            this.buildTournamentTree_();
        return Object.create(this.tournamentTree_);
    }

    // rebuildTournamentTree() rebuilds the tournament tree.
    // Returns nothing.
    // Throws:
    //  "JoinLockedException" = Rebuilding the tree is locked due to a previous call to nextBattle() telling the class that the tournament has started.
    //  "ParticipantsTooLowException" = There are less than two participants currently and therefore unable to build a tree.
    this.rebuildTournamentTree = function()
    {
        this.testJoinNotLocked_();
        this.buildTournamentTree_();
        this.isEnded_ = false;
    }

    // getNextBattle() gets the next available battle in a TournamentBuilderBattle structure.
    // Returns a TournamentBuilderBattle structure representing a tournament battle. Pass the return value to setBattleStatus() to set the battle status.
    // Throws:
    //  "ParticipantsTooLowException" = There are less than two participants currently and therefore unable to build a tree.
    //  "FinalsDefaultWinNonException" = The finals battle was skipped due to either side being a draw.
    //  "NoRemainingBattlesException" = There are no more battles left for this tournament.
    //  "NoAvailableBattlesException" = There are currently no battles that can be started due to previous battles that haven't finished.
    this.getNextBattle = function()
    {
        if (this.isEnded_)
            throw Error("NoRemainingBattlesException");

        if (!this.isTournamentTreeBuilt_)
            this.buildTournamentTree_();
        this.isJoiningLocked_ = true;

        try
        {
            var nodesToScanOffsets = this.tournamentTree_.leafNodesOffsets.slice(0);
            while (nodesToScanOffsets.length > 0 && nodesToScanOffsets[0] !== this.tournamentTree_.rootNodeOffset)
            {
                var currentNodeOffset = nodesToScanOffsets.shift();
                var currentNode = this.tournamentTree_.nodeStorage[currentNodeOffset];

                // Filter out the non-battle nodes and already started battle nodes
                if (currentNode.type !== TournamentBuilderTreeNodeType.BATTLE || currentNode.battle.status !== TournamentBuilderTreeNodeBattleDataBattleStatus.NOT_STARTED)
                {
                    if (nodesToScanOffsets.length === 0 || nodesToScanOffsets[nodesToScanOffsets.length - 1] !== currentNode.parentOffset)
                        if (currentNode.battle.status !== TournamentBuilderTreeNodeBattleDataBattleStatus.WAITING &&
                            currentNode.battle.status !== TournamentBuilderTreeNodeBattleDataBattleStatus.PENDING)
                            nodesToScanOffsets.push(currentNode.parentOffset);
                    continue;
                }

                try
                {
                    // If we have any byes in our participants, we automatically promote the non-bye or tie the game for double byes
                    if (this.getParticipantOfNode_(currentNode.battle.childAOffset) === null ||
                        this.getParticipantOfNode_(currentNode.battle.childBOffset) === null)
                    {
                        if (this.getParticipantOfNode_(currentNode.battle.childAOffset) === null &&
                            this.getParticipantOfNode_(currentNode.battle.childBOffset) === null)
                        {
                            // Double bye game
                            currentNode.battle.status = TournamentBuilderTreeNodeBattleDataBattleStatus.DRAW;
                            currentNode.battle.winner = null;
                        }
                        else if (this.getParticipantOfNode_(currentNode.battle.childAOffset) === null)
                        {
                            // Child A is a bye, so Child B automatically wins
                            currentNode.battle.status = TournamentBuilderTreeNodeBattleDataBattleStatus.B_WIN;
                            currentNode.battle.winner = this.getParticipantOfNode_(currentNode.battle.childBOffset);
                        }
                        else if (this.getParticipantOfNode_(currentNode.battle.childBOffset) === null)
                        {
                            // Child B is a bye, so Child A automatically wins
                            currentNode.battle.status = TournamentBuilderTreeNodeBattleDataBattleStatus.A_WIN;
                            currentNode.battle.winner = this.getParticipantOfNode_(currentNode.battle.childAOffset);
                        }
                        if (nodesToScanOffsets.length === 0 || nodesToScanOffsets[nodesToScanOffsets.length - 1] !== currentNode.parentOffset)
                            nodesToScanOffsets.push(currentNode.parentOffset);
                        continue;
                    }

                    var result = new TournamentBuilderBattle();
                    result.a = this.getParticipantOfNode_(currentNode.battle.childAOffset);
                    result.b = this.getParticipantOfNode_(currentNode.battle.childBOffset);
                    result.isFinals = false;
                    result.offset = currentNodeOffset;
                    return result;
                } catch (e)
                {
                    if (nodesToScanOffsets.length === 0 || nodesToScanOffsets[nodesToScanOffsets.length - 1] !== currentNode.parentOffset)
                        nodesToScanOffsets.push(currentNode.parentOffset);
                    continue;
                }
            }

            // If we get here, that means we are at the root node (Tournament finals)
            var rootNode = this.tournamentTree_.nodeStorage[this.tournamentTree_.rootNodeOffset];

            // Let's hope nobody got a draw in the semi-finals
            if (this.getParticipantOfNode_(rootNode.battle.childAOffset) === null ||
                this.getParticipantOfNode_(rootNode.battle.childBOffset) === null)
            {
                var battle = new TournamentBuilderBattle();
                battle.offset = this.tournamentTree_.rootNodeOffset;
                if (this.getParticipantOfNode_(rootNode.battle.childAOffset) === null &&
                    this.getParticipantOfNode_(rootNode.battle.childBOffset) === null)
                    // Both sides got a draw? :(
                    this.setBattleStatus(battle, TournamentBuilderTreeNodeBattleDataBattleStatus.DRAW);
                else if (this.getParticipantOfNode_(rootNode.battle.childAOffset) === null)
                    // Child A got a draw, so B wins by default
                    this.setBattleStatus(battle, TournamentBuilderTreeNodeBattleDataBattleStatus.B_WIN);
                else if (this.getParticipantOfNode_(rootNode.battle.childBOffset) === null)
                    // Child B got a draw, so A wins by default
                    this.setBattleStatus(battle, TournamentBuilderTreeNodeBattleDataBattleStatus.A_WIN);
                this.isJoiningLocked_ = false;
                this.isEnded_ = true;
                throw Error("FinalsDefaultWinNonException");
            }

            if (rootNode.battle.status !== TournamentBuilderTreeNodeBattleDataBattleStatus.NOT_STARTED)
                throw Error("NoRemainingBattlesException");

            var result = new TournamentBuilderBattle();
            result.a = this.getParticipantOfNode_(rootNode.battle.childAOffset);
            result.b = this.getParticipantOfNode_(rootNode.battle.childBOffset);
            result.isFinals = true;
            result.offset = this.tournamentTree_.rootNodeOffset;
            return result;
        } catch (e)
        {
            if (e.message === "NoRemainingBattlesException"||
                e.message === "FinalsDefaultWinNonException")
                throw e;
            throw Error("NoAvailableBattlesException");
        }
    }

    // setBattleStatus(battle, status) sets the status of a battle.
    //  battle = A TournamentBuilderBattle object returned by getNextBattle().
    //  status = A TournamentBuilderTreeNodeBattleDataBattleStatus enumeration representing the status to change the battle to.
    //           A status of WAITING tells the class that the information is received and should not be output by another call to
    //           getNextBattle(). A status of PENDING tells the class that the battle is currently in progress. A status of A_WIN
    //           tells the class than the A side has won. A status of B_WIN tells the class that the B side has won and a status
    //           of DRAW tells the class that the battle was a draw. If the finals battle status was set to one of the "finished"
    //           statuses, the join lock is cleared.
    // Returns nothing.
    // Throws:
    //  "InvalidArgumentsException" = Thrown when `battle' is not a valid TournamentBuilderBattle object.
    this.setBattleStatus = function(battle, status)
    {
        if (!this.isTournamentTreeBuilt_)
            this.buildTournamentTree_();

        if (battle.offset >= this.tournamentTree_.nodeStorage.length ||
            this.tournamentTree_.nodeStorage[battle.offset].type !== TournamentBuilderTreeNodeType.BATTLE)
            throw Error("InvalidArgumentsException");

        var battleNode = this.tournamentTree_.nodeStorage[battle.offset].battle;
        battleNode.status = status;

        // Update the winner
        switch (status)
        {
            case TournamentBuilderTreeNodeBattleDataBattleStatus.A_WIN :
                battleNode.winner = this.getParticipantOfNode_(battleNode.childAOffset);
                break;

            case TournamentBuilderTreeNodeBattleDataBattleStatus.B_WIN :
                battleNode.winner = this.getParticipantOfNode_(battleNode.childBOffset);
                break;

            case TournamentBuilderTreeNodeBattleDataBattleStatus.DRAW :
                battleNode.winner = null;
                break;

            case TournamentBuilderTreeNodeBattleDataBattleStatus.PENDING :
            case TournamentBuilderTreeNodeBattleDataBattleStatus.WAITING :
            case TournamentBuilderTreeNodeBattleDataBattleStatus.NOT_STARTED :
                break;
        }

        if (battle.offset === this.tournamentTree_.rootNodeOffset)
            if (status === TournamentBuilderTreeNodeBattleDataBattleStatus.A_WIN ||
                status === TournamentBuilderTreeNodeBattleDataBattleStatus.B_WIN ||
                status === TournamentBuilderTreeNodeBattleDataBattleStatus.DRAW)
            {
                this.isJoiningLocked_ = false;
                this.isEnded_ = true;
            }
    }

    // getWinner() gets the winner of the tournament.
    // Returns the object representing the user who won the tournament. If the finals was a draw, the object will be `null' instead.
    // Throws:
    //  "FinalsNotFinishedException" = The finals have either not started or not finished, therefore there is currently no winner.
    this.getWinner = function()
    {
        if (!this.isTournamentTreeBuilt_)
            throw Error("FinalsNotFinishedException");

        var rootNode = this.tournamentTree_.nodeStorage[this.tournamentTree_.rootNodeOffset];
        if (!this.isEnded_)
            throw Error("FinalsNotFinishedException");
        return rootNode.battle.winner;
    }

    // Private functions.
    // Like the private variables, "real" javascript private functions are too annoying so we hope no-one uses these.

    this.getOffsetToParticipantNoThrow_ = function(participant)
    {
        for (var result = 0; result < this.participants_.length; ++result)
            if (this.participants_[result] === participant)
                return result;
        return -1;
    }

    this.getOffsetToParticipant_ = function(participant)
    {
        var result = this.getOffsetToParticipantNoThrow_(participant);
        if (result === -1)
            throw Error("UserNotFoundException");
        return result;
    }

    this.addParticipant_ = function(participant)
    {
        if (this.getOffsetToParticipantNoThrow_(participant) !== -1)
            throw Error("UserAlreadyParticipatingException");
        if (this.participants_.length >= this.maxParticipants_)
            throw Error("TournamentFullException");
        this.isTournamentTreeBuilt_ = false;
        this.isEnded_ = false;
        this.participants_.push(participant);
    }

    this.removeParticipant_ = function(participantOffset)
    {
        this.participants_.splice(participantOffset, 1);
        this.isTournamentTreeBuilt_ = false;
        this.isEnded_ = false;
        return participantOffset;
    }

    this.testJoinNotLocked_ = function()
    {
        if (this.isJoiningLocked_)
            throw Error("JoinLockedException");
    }

    this.getParticipantOfNode_ = function(nodeOffset)
    {
        var node = this.tournamentTree_.nodeStorage[nodeOffset];
        if (node.type === TournamentBuilderTreeNodeType.PARTICIPANT)
            return node.participant;
        else
        {
            if (node.battle.status === TournamentBuilderTreeNodeBattleDataBattleStatus.NOT_STARTED ||
                node.battle.status === TournamentBuilderTreeNodeBattleDataBattleStatus.WAITING ||
                node.battle.status === TournamentBuilderTreeNodeBattleDataBattleStatus.PENDING)
                throw Error("BattleNotFinishedException");
            return node.battle.winner;
        }
    }

    // Builds a linked-list binary tree as the tournament tree
    this.buildTournamentTree_ = function()
    {
        this.isTournamentTreeBuilt_ = false;
        this.tournamentTree_.nodeStorage.length = 0;
        this.tournamentTree_.leafNodesOffsets.length = 0;

        var participantCount = this.participants_.length;
        if (participantCount < 2)
            throw Error("ParticipantsTooLowException");

        // First calculate how many byes we need
        var stages = Math.floor(Math.log(participantCount) / Math.log(2));
        if (Math.floor(Math.pow(2, stages)) < participantCount)
            ++stages;
        var byes = Math.floor(Math.pow(2, stages)) - participantCount;

        // Create a temporary vector of participants, including byes, and randomise it
        var participants = new Array();
        for (var p in this.participants_)
            participants.push(this.participants_[p]);
        for (var b = 0; b < byes; ++b)
            participants.push(null);
        function shuffle(array) // Pilfered off http://stackoverflow.com/a/962890/359653
        {
            var tmp, current, top = array.length;
            if(top) while(--top)
            {
                current = Math.floor(Math.random() * (top + 1));
                tmp = array[current];
                array[current] = array[top];
                array[top] = tmp;
            }
            return array;
        }
        shuffle(participants);

        // Allocate the tournament tree and get ready to build the nodes
        var previousStageNodesOffsets = new Array();
        var currentStageNodesOffsets = new Array();

        // Build the root node first
        var rootNode = new TournamentBuilderTreeNode();
        rootNode.parentOffset = 0;
        rootNode.type = TournamentBuilderTreeNodeType.BATTLE;
        rootNode.battle.status = TournamentBuilderTreeNodeBattleDataBattleStatus.NOT_STARTED;
        this.tournamentTree_.nodeStorage.push(rootNode);
        this.tournamentTree_.rootNodeOffset = 0;
        previousStageNodesOffsets.push(0);

        // Then the other internal nodes
        for (var stage = 1; stage < stages; ++stage)
        {
            for (var b = Math.floor(Math.pow(2, stage)), battle = 0; b > 0; --b, ++battle)
            {
                // Create the new node
                var node = new TournamentBuilderTreeNode();
                node.parentOffset = previousStageNodesOffsets[Math.floor(battle / 2)];
                node.type = TournamentBuilderTreeNodeType.BATTLE;
                node.battle.status = TournamentBuilderTreeNodeBattleDataBattleStatus.NOT_STARTED;
                this.tournamentTree_.nodeStorage.push(node);

                // Update the parent node
                var nodeOffset = this.tournamentTree_.nodeStorage.length - 1;
                if (battle % 2 === 0)
                    this.tournamentTree_.nodeStorage[node.parentOffset].battle.childAOffset = nodeOffset;
                else
                    this.tournamentTree_.nodeStorage[node.parentOffset].battle.childBOffset = nodeOffset;

                // Add the current node to the current nodes vector
                currentStageNodesOffsets.push(nodeOffset);
            }
            // Move the current nodes vector to the previous nodes vector
            previousStageNodesOffsets = currentStageNodesOffsets;
            currentStageNodesOffsets = new Array();
        }

        // And finally the leaf nodes
        for (var l = participantCount + byes, leaf = 0; l > 0; --l, ++leaf)
        {
            // Create the new node
            var node = new TournamentBuilderTreeNode();
            node.parentOffset = previousStageNodesOffsets[Math.floor(leaf / 2)];
            node.type = TournamentBuilderTreeNodeType.PARTICIPANT;
            node.participant = participants[leaf];
            this.tournamentTree_.nodeStorage.push(node);

            // Update the parent node
            var nodeOffset = this.tournamentTree_.nodeStorage.length - 1;
            if (leaf % 2 === 0)
                this.tournamentTree_.nodeStorage[node.parentOffset].battle.childAOffset = nodeOffset;
            else
                this.tournamentTree_.nodeStorage[node.parentOffset].battle.childBOffset = nodeOffset;

            // Add the current node to the leaf nodes vector
            this.tournamentTree_.leafNodesOffsets.push(nodeOffset);
        }

        this.isTournamentTreeBuilt_ = true;
    }
}

exports.TournamentBuilder = TournamentBuilder;
exports.TournamentBuilderBattle = TournamentBuilderBattle;
exports.TournamentBuilderTree = TournamentBuilderTree;
exports.TournamentBuilderTreeNode = TournamentBuilderTreeNode;
exports.TournamentBuilderTreeNodeType = TournamentBuilderTreeNodeType;
exports.TournamentBuilderTreeNodeBattleData = TournamentBuilderTreeNodeBattleData;
exports.TournamentBuilderTreeNodeBattleDataBattleStatus = TournamentBuilderTreeNodeBattleDataBattleStatus;

/* Original version converted from the following C++. Javascript source might have been modified since the conversion

//
//  NOTE: Time complexity and good C++ practice is sacrificed for javascript compatibility.
//        This shouldn't be a problem unless we have over 500,000 users joining the tournament.
//

#include <string>
#include <vector>
#include <list>
#include <algorithm>
#include <random>
#include <chrono>
#include <cmath>
#include <stdexcept>

/////////////////////////////////

struct User // Think of this as an opaque data structure
{
    std::string name;
};
std::vector<User> userlist =
{
    { "kota" },
    { "kupo" },
    { "kupo-windows8" },
    { "kupo-windows7" },
    { "kupo-xubuntu" },
    { "kupo-test" },
    { "sleeping kupo" },
    { "Deity" },
    { "StevoDuhHero" },
    { "aeo" },
    { "bmelts" },
    { "Elite Four Lorelei" },
    { "494" },
    { "Blue Kirby" },
    { "EspyOwner" }
};
User* getUser(std::string name)
{
    for (auto& user : userlist)
        if (user.name == name)
            return &user;
    throw std::logic_error("UserNotFoundException");
}

/////////////////////////////////

// This is the important part

class TournamentBuilder
{
    public:
        TournamentBuilder(size_t maxParticipants):
            this.maxParticipants_(maxParticipants),
            this.isJoiningLocked_(false),
            this.isTournamentTreeBuilt_(false)
        {
            if (maxParticipants < 2)
                throw std::logic_error("MaxParticipantsTooLowException");
            participants_.reserve(maxParticipants);
        }

        struct Tree
        {
            // All these offsets are offsets from `nodeStorage'
            struct Node
            {
                enum class BattleStatus { NOT_STARTED, WAITING, PENDING, A_WIN, B_WIN, DRAW };
                enum class Type { PARTICIPANT, BATTLE } type;
                // If javascript supported unions, the next two members would be in a union
                struct
                {
                    size_t childAOffset;
                    size_t childBOffset;
                    BattleStatus status;
                    User* winner; // nullptr for a bye
                } battle;
                User* participant; // nullptr for a bye

                size_t parentOffset; // Points to itself if we are the root node
            };
            std::vector<Node> nodeStorage; // For automatic garbage collection
            size_t rootNodeOffset; // Is _always_ a battle node
            std::vector<size_t> leafNodesOffsets;
        };

        size_t getMaxParticipants() const
        {
            return maxParticipants_;
        }

        std::vector<User*> setMaxParticipants(size_t maxParticipants)
        {
            this.testJoinNotLocked_();

            if (maxParticipants < 2)
                throw std::logic_error("MaxParticipantsTooLowException");

            maxParticipants_ = maxParticipants;
            if (participants_.size() <= maxParticipants)
                return {};

            // Remove participants until we are equal to the max starting with the latest joiner
            std::vector<User*> participantsRemoved;
            participantsRemoved.reserve(participants_.size() - maxParticipants);
            size_t participantOffset = participants_.size() - 1;
            for (size_t p = participants_.size() - maxParticipants; p > 0; --p)
                try
                {
                    participantsRemoved.push_back(participants_[participantOffset]);
                    participantOffset = this.removeParticipant_(participantOffset) - 1;
                } catch (const std::exception& e)
                {
                    // Swallow the exception
                }
            return participantsRemoved;
        }

        bool getIsJoiningLocked() const
        {
            return isJoiningLocked_;
        }

        void addParticipant(User* participant)
        {
            this.testJoinNotLocked_();
            this.addParticipant_(participant);
        }

        void removeParticipant(User* participant)
        {
            this.testJoinNotLocked_();
            this.removeParticipant_(this.getOffsetToParticipant_(participant));
        }

        std::vector<User*> getParticipants() const
        {
            return participants_;
        }

        Tree getTournamentTreeCopy()
        {
            if (!isTournamentTreeBuilt_)
                this.buildTournamentTree_();
            return tournamentTree_;
        }

        void rebuildTournamentTree()
        {
            this.testJoinNotLocked_();
            this.buildTournamentTree_();
        }

        struct Battle
        {
            User* a;
            User* b;
            bool isFinals;
            size_t offset;
        };
        Battle getNextBattle()
        {
            if (!isTournamentTreeBuilt_)
                this.buildTournamentTree_();
            isJoiningLocked_ = true;

            try
            {
                // This queue (list) can be implemented with a regular javascript array with push() and shift()
                std::list<size_t> nodesToScanOffsets(tournamentTree_.leafNodesOffsets.begin(), tournamentTree_.leafNodesOffsets.end());
                while (nodesToScanOffsets.size() > 1 && nodesToScanOffsets.front() != tournamentTree_.rootNodeOffset)
                {
                    size_t currentNodeOffset = nodesToScanOffsets.front();
                    nodesToScanOffsets.pop_front();
                    auto& currentNode = tournamentTree_.nodeStorage[currentNodeOffset];

                    // Filter out the non-battle nodes and already started battle nodes
                    if (currentNode.type != Tree::Node::Type::BATTLE || currentNode.battle.status != Tree::Node::BattleStatus::NOT_STARTED)
                    {
                        if (nodesToScanOffsets.empty() || nodesToScanOffsets.back() != currentNode.parentOffset)
                            nodesToScanOffsets.push_back(currentNode.parentOffset);
                        continue;
                    }

                    try
                    {
                        // If we have any byes in our participants, we automatically promote the non-bye or tie the game for double byes
                        if (this.getParticipantOfNode_(currentNode.battle.childAOffset) == nullptr ||
                            this.getParticipantOfNode_(currentNode.battle.childBOffset) == nullptr)
                        {
                            if (this.getParticipantOfNode_(currentNode.battle.childAOffset) == nullptr &&
                                this.getParticipantOfNode_(currentNode.battle.childBOffset) == nullptr)
                            {
                                // Double bye game
                                currentNode.battle.status = Tree::Node::BattleStatus::DRAW;
                                currentNode.battle.winner = nullptr;
                            }
                            else if (this.getParticipantOfNode_(currentNode.battle.childAOffset) == nullptr)
                            {
                                // Child A is a bye, so Child B automatically wins
                                currentNode.battle.status = Tree::Node::BattleStatus::B_WIN;
                                currentNode.battle.winner = this.getParticipantOfNode_(currentNode.battle.childBOffset);
                            }
                            else if (this.getParticipantOfNode_(currentNode.battle.childBOffset) == nullptr)
                            {
                                // Child B is a bye, so Child A automatically wins
                                currentNode.battle.status = Tree::Node::BattleStatus::A_WIN;
                                currentNode.battle.winner = this.getParticipantOfNode_(currentNode.battle.childAOffset);
                            }
                            if (nodesToScanOffsets.empty() || nodesToScanOffsets.back() != currentNode.parentOffset)
                                nodesToScanOffsets.push_back(currentNode.parentOffset);
                            continue;
                        }

                        Battle result;
                        result.a = this.getParticipantOfNode_(currentNode.battle.childAOffset);
                        result.b = this.getParticipantOfNode_(currentNode.battle.childBOffset);
                        result.isFinals = false;
                        result.offset = currentNodeOffset;
                        return result;
                    } catch (const std::exception& e)
                    {
                        if (nodesToScanOffsets.empty() || nodesToScanOffsets.back() != currentNode.parentOffset)
                            nodesToScanOffsets.push_back(currentNode.parentOffset);
                        continue;
                    }
                }

                // If we get here, that means we are at the root node (Tournament finals)
                auto& rootNode = tournamentTree_.nodeStorage[tournamentTree_.rootNodeOffset];

                // Let's hope nobody got a draw in the semi-finals
                if (this.getParticipantOfNode_(rootNode.battle.childAOffset) == nullptr ||
                    this.getParticipantOfNode_(rootNode.battle.childBOffset) == nullptr)
                {
                    Battle battle;
                    battle.offset = tournamentTree_.rootNodeOffset;
                    if (this.getParticipantOfNode_(rootNode.battle.childAOffset) == nullptr &&
                        this.getParticipantOfNode_(rootNode.battle.childBOffset) == nullptr)
                        // Both sides got a draw? :(
                        setBattleStatus(battle, Tree::Node::BattleStatus::DRAW);
                    else if (this.getParticipantOfNode_(rootNode.battle.childAOffset) == nullptr)
                        // Child A got a draw, so B wins by default
                        setBattleStatus(battle, Tree::Node::BattleStatus::B_WIN);
                    else if (this.getParticipantOfNode_(rootNode.battle.childBOffset) == nullptr)
                        // Child B got a draw, so A wins by default
                        setBattleStatus(battle, Tree::Node::BattleStatus::A_WIN);
                    isTournamentTreeBuilt_ = false;
                    isJoiningLocked_ = false;
                    throw std::logic_error("FinalsDefaultWinNonException");
                }

                if (rootNode.battle.status != Tree::Node::BattleStatus::NOT_STARTED)
                    throw std::logic_error("NoRemainingBattlesException");

                Battle result;
                result.a = this.getParticipantOfNode_(rootNode.battle.childAOffset);
                result.b = this.getParticipantOfNode_(rootNode.battle.childBOffset);
                result.isFinals = true;
                result.offset = tournamentTree_.rootNodeOffset;
                return result;
            } catch (const std::exception& e)
            {
                if (std::string(e.what()) == "NoRemainingBattlesException" ||
                    std::string(e.what()) == "FinalsDefaultWinNonException")
                    throw;
                throw std::logic_error("NoAvailableBattlesException");
            }
        }

        void setBattleStatus(Battle& battle, Tree::Node::BattleStatus status)
        {
            if (!isTournamentTreeBuilt_)
                this.buildTournamentTree_();

            if (battle.offset >= tournamentTree_.nodeStorage.size() ||
                tournamentTree_.nodeStorage[battle.offset].type != Tree::Node::Type::BATTLE)
                throw std::logic_error("InvalidArgumentsException");

            auto& battleNode = tournamentTree_.nodeStorage[battle.offset].battle;
            battleNode.status = status;

            // Update the winner
            switch (status)
            {
                case Tree::Node::BattleStatus::A_WIN :
                    battleNode.winner = this.getParticipantOfNode_(battleNode.childAOffset);
                    break;

                case Tree::Node::BattleStatus::B_WIN :
                    battleNode.winner = this.getParticipantOfNode_(battleNode.childBOffset);
                    break;

                case Tree::Node::BattleStatus::DRAW :
                    battleNode.winner = nullptr;
                    break;

                case Tree::Node::BattleStatus::PENDING :
                case Tree::Node::BattleStatus::WAITING :
                case Tree::Node::BattleStatus::NOT_STARTED :
                    break;
            }

            if (battle.offset == tournamentTree_.rootNodeOffset)
                if (status == Tree::Node::BattleStatus::A_WIN ||
                    status == Tree::Node::BattleStatus::B_WIN ||
                    status == Tree::Node::BattleStatus::DRAW)
                    isJoiningLocked_ = false;
        }

        User* getWinner()
        {
            if (!isTournamentTreeBuilt_)
                this.buildTournamentTree_();

            auto& rootNode = tournamentTree_.nodeStorage[tournamentTree_.rootNodeOffset];
            if (rootNode.battle.status == Tree::Node::BattleStatus::PENDING ||
            if (rootNode.battle.status == Tree::Node::BattleStatus::WAITING ||
                rootNode.battle.status == Tree::Node::BattleStatus::NOT_STARTED)
                throw std::logic_error("FinalsNotFinishedException");
            return rootNode.battle.winner;
        }

    private:
        size_t this.getOffsetToParticipantNoThrow_(User* participant) noexcept
        {
            for (size_t result = 0; result < participants_.size(); ++result)
                if (participants_[result] == participant)
                    return result;
            return -1;
        }

        size_t this.getOffsetToParticipant_(User* participant)
        {
            size_t result = this.getOffsetToParticipantNoThrow_(participant);
            if (result == -1)
                throw std::logic_error("UserNotFoundException");
            return result;
        }

        void this.addParticipant_(User* participant)
        {
            if (this.getOffsetToParticipantNoThrow_(participant) != -1)
                throw std::logic_error("UserAlreadyParticipatingException");
            if (participants_.size() >= maxParticipants_)
                throw std::logic_error("TournamentFullException");
            isTournamentTreeBuilt_ = false;
            participants_.push_back(participant);
        }

        size_t this.removeParticipant_(size_t participantOffset)
        {
            return participants_.erase(participants_.begin() + participantOffset) - participants_.begin();
        }

        void this.testJoinNotLocked_()
        {
            if (isJoiningLocked_)
                throw std::logic_error("JoinLockedException");
        }

        User* this.getParticipantOfNode_(size_t nodeOffset)
        {
            auto& node = tournamentTree_.nodeStorage[nodeOffset];
            if (node.type == Tree::Node::Type::PARTICIPANT)
                return node.participant;
            else
            {
                if (node.battle.status == Tree::Node::BattleStatus::NOT_STARTED ||
                    node.battle.status == Tree::Node::BattleStatus::WAITING ||
                    node.battle.status == Tree::Node::BattleStatus::PENDING)
                    throw std::logic_error("BattleNotFinishedException");
                return node.battle.winner;
            }
        }

        // Builds a linked-list binary tree as the tournament tree
        void this.buildTournamentTree_()
        {
            isTournamentTreeBuilt_ = false;
            tournamentTree_.nodeStorage.clear();
            tournamentTree_.leafNodesOffsets.clear();

            size_t participantCount = participants_.size();
            if (participantCount < 2)
                throw std::logic_error("ParticipantsTooLowException");

            // First calculate how many byes we need
            size_t stages = std::log2(participantCount);
            if ((size_t)std::exp2(stages) < participantCount)
                ++stages;
            size_t byes = (size_t)std::exp2(stages) - participantCount;

            // Create a temporary vector of participants, including byes, and randomise it
            std::vector<User*> participants;
            participants.reserve(participantCount + byes);
            for (auto& participant : participants_)
                participants.push_back(participant);
            for (size_t b = 0; b < byes; ++b)
                participants.push_back(nullptr);
            std::shuffle(participants.begin(), participants.end(), std::mt19937_64(std::chrono::system_clock::now().time_since_epoch().count()));

            // Allocate the tournament tree and get ready to build the nodes
            tournamentTree_.nodeStorage.reserve(2 * stages - 1);
            std::vector<size_t> previousStageNodesOffsets;
            std::vector<size_t> currentStageNodesOffsets;
            previousStageNodesOffsets.reserve(std::exp2(stages - 1));
            currentStageNodesOffsets.reserve(std::exp2(stages - 1));

            // Build the root node first
            Tree::Node rootNode;
            rootNode.parentOffset = 0;
            rootNode.type = Tree::Node::Type::BATTLE;
            rootNode.battle.status = Tree::Node::BattleStatus::NOT_STARTED;
            tournamentTree_.nodeStorage.push_back(rootNode);
            tournamentTree_.rootNodeOffset = 0;
            previousStageNodesOffsets.push_back(0);

            // Then the other internal nodes
            for (size_t stage = 1; stage < stages; ++stage)
            {
                for (size_t b = std::exp2(stage), battle = 0; b > 0; --b, ++battle)
                {
                    // Create the new node
                    Tree::Node node;
                    node.parentOffset = previousStageNodesOffsets[battle / 2];
                    node.type = Tree::Node::Type::BATTLE;
                    node.battle.status = Tree::Node::BattleStatus::NOT_STARTED;
                    tournamentTree_.nodeStorage.push_back(node);

                    // Update the parent node
                    size_t nodeOffset = tournamentTree_.nodeStorage.size() - 1;
                    if (battle % 2 == 0)
                        tournamentTree_.nodeStorage[node.parentOffset].battle.childAOffset = nodeOffset;
                    else
                        tournamentTree_.nodeStorage[node.parentOffset].battle.childBOffset = nodeOffset;

                    // Add the current node to the current nodes vector
                    currentStageNodesOffsets.push_back(nodeOffset);
                }
                // Move the current nodes vector to the previous nodes vector
                previousStageNodesOffsets.clear();
                std::swap(previousStageNodesOffsets, currentStageNodesOffsets);
            }

            // And finally the leaf nodes
            for (size_t l = participantCount + byes, leaf = 0; l > 0; --l, ++leaf)
            {
                // Create the new node
                Tree::Node node;
                node.parentOffset = previousStageNodesOffsets[leaf / 2];
                node.type = Tree::Node::Type::PARTICIPANT;
                node.participant = participants[leaf];
                tournamentTree_.nodeStorage.push_back(node);

                // Update the parent node
                size_t nodeOffset = tournamentTree_.nodeStorage.size() - 1;
                if (leaf % 2 == 0)
                    tournamentTree_.nodeStorage[node.parentOffset].battle.childAOffset = nodeOffset;
                else
                    tournamentTree_.nodeStorage[node.parentOffset].battle.childBOffset = nodeOffset;

                // Add the current node to the leaf nodes vector
                tournamentTree_.leafNodesOffsets.push_back(nodeOffset);
            }

            isTournamentTreeBuilt_ = true;
        }

        size_t maxParticipants_;
        std::vector<User*> participants_;
        bool isJoiningLocked_;

        Tree tournamentTree_;
        bool isTournamentTreeBuilt_;
};

///////////////////////////////

// Test run of the class

#include <cstdio>
#include <random>
#include <chrono>

int main()
{
    TournamentBuilder tournament(50);
    tournament.addParticipant(getUser("kota"));
    tournament.addParticipant(getUser("kupo"));
    tournament.addParticipant(getUser("sleeping kupo"));
    tournament.addParticipant(getUser("Deity"));
    tournament.addParticipant(getUser("EspyOwner"));
//    tournament.addParticipant(getUser("kupo-windows8"));
//    tournament.addParticipant(getUser("kupo-windows7"));
    tournament.addParticipant(getUser("kupo-xubuntu"));
    tournament.addParticipant(getUser("kupo-test"));
    tournament.addParticipant(getUser("aeo"));
    tournament.addParticipant(getUser("bmelts"));
    tournament.addParticipant(getUser("Blue Kirby"));
    tournament.addParticipant(getUser("Elite Four Lorelei"));

    std::mt19937 rng(std::chrono::system_clock::now().time_since_epoch().count());
    try
    {
        for (auto battle = tournament.getNextBattle(); !battle.isFinals; battle = tournament.getNextBattle())
        {
            tournament.setBattleStatus(battle, TournamentBuilder::Tree::Node::BattleStatus::PENDING);
            enum class Result { A_WIN, B_WIN, DRAW } result = (Result)(rng() % 3);
            std::printf("Battle (%zu) between %s and %s. Winner: ", battle.offset, battle.a->name.c_str(), battle.b->name.c_str());
            switch (result)
            {
                case Result::A_WIN :
                    std::printf("%s\n", battle.a->name.c_str());
                    tournament.setBattleStatus(battle, TournamentBuilder::Tree::Node::BattleStatus::A_WIN);
                    break;

                case Result::B_WIN :
                    std::printf("%s\n", battle.b->name.c_str());
                    tournament.setBattleStatus(battle, TournamentBuilder::Tree::Node::BattleStatus::B_WIN);
                    break;

                case Result::DRAW :
                    std::printf("Draw\n");
                    tournament.setBattleStatus(battle, TournamentBuilder::Tree::Node::BattleStatus::DRAW);
                    break;
            }
        }

        auto finalBattle = tournament.getNextBattle();
        tournament.setBattleStatus(finalBattle, TournamentBuilder::Tree::Node::BattleStatus::PENDING);
        enum class Result { A_WIN, B_WIN, DRAW } result = (Result)(rng() % 3);
        std::printf("Finals battle between %s and %s. Winner: ", finalBattle.a->name.c_str(), finalBattle.b->name.c_str());
        switch (result)
        {
            case Result::A_WIN :
                tournament.setBattleStatus(finalBattle, TournamentBuilder::Tree::Node::BattleStatus::A_WIN);
                break;

            case Result::B_WIN :
                tournament.setBattleStatus(finalBattle, TournamentBuilder::Tree::Node::BattleStatus::B_WIN);
                break;

            case Result::DRAW :
                tournament.setBattleStatus(finalBattle, TournamentBuilder::Tree::Node::BattleStatus::DRAW);
                break;
        }
    } catch (const std::exception& e)
    {
        if (std::string(e.what()) == "FinalsDefaultWinNonException")
            std::printf("Finals game skipped. Winner: ");
        else
            throw;
    }

    User* winner = tournament.getWinner();
    if (winner == nullptr)
        std::printf("Draw\n");
    else
        std::printf("%s\n", winner->name.c_str());

    return 0;
}
*/
