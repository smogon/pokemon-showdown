require('es6-shim');

var TreeNode = require('./lib/closure-goog.structs.TreeNode-c8e0b2dcd892.min.js').goog.structs.TreeNode;

const nameMap = {
	'1': "Single",
	'2': "Double",
	'3': "Triple",
	'4': "Quadruple",
	'5': "Quintuple",
	'6': "Sextuple"
	// Feel free to add more
};

function fixSingleChildNode(parentNode) {
	if (parentNode.getParent()) {
		var newNode = parentNode.removeChildAt(0);
		parentNode.getParent().replaceChild(newNode, parentNode);
		return newNode;
	}

	var value = parentNode.getValue();
	for (var key in value)
		delete value[key];
	Object.merge(value, parentNode.removeChildAt(0).getValue());
	return parentNode;
}

var Elimination = (function () {
	function Elimination(maxSubtrees) {
		maxSubtrees = maxSubtrees || 1;
		if (typeof maxSubtrees === 'string' && maxSubtrees.toLowerCase() === 'infinity')
			maxSubtrees = Infinity;
		else if (typeof maxSubtrees !== 'number')
			maxSubtrees = parseInt(maxSubtrees, 10);
		if (!maxSubtrees || maxSubtrees < 1)
			maxSubtrees = 1;

		this.maxSubtrees = maxSubtrees;
		this.isBracketFrozen = false;
		this.tree = null;
		this.users = new Map();

		if (nameMap[maxSubtrees])
			this.name = nameMap[maxSubtrees] + " " + this.name;
		else if (maxSubtrees === Infinity)
			this.name = "N-" + this.name;
		else
			this.name = maxSubtrees + "-tuple " + this.name;
	}

	Elimination.prototype.name = "Elimination";
	Elimination.prototype.isDrawingSupported = false;

	Elimination.prototype.addUser = function (user) {
		if (this.isBracketFrozen)
			return 'BracketFrozen';

		if (this.users.has(user))
			return 'UserAlreadyAdded';
		this.users.set(user, {});

		if (!this.tree) {
			this.tree = {
				tree: new TreeNode(null, {user: user}),
				currentLayerLeafNodes: [],
				nextLayerLeafNodes: []
			};
			this.tree.currentLayerLeafNodes.push(this.tree.tree);
			return;
		}

		var targetNode = this.tree.currentLayerLeafNodes.shift();

		var newNode = new TreeNode(null, {user: targetNode.getValue().user});
		this.tree.nextLayerLeafNodes.push(newNode);
		targetNode.addChild(newNode);

		newNode = new TreeNode(null, {user: user});
		this.tree.nextLayerLeafNodes.push(newNode);
		targetNode.addChild(newNode);

		delete targetNode.getValue().user;

		if (this.tree.currentLayerLeafNodes.length === 0) {
			this.tree.currentLayerLeafNodes = this.tree.nextLayerLeafNodes;
			this.tree.nextLayerLeafNodes = [];
		}
	};
	Elimination.prototype.removeUser = function (user) {
		if (this.isBracketFrozen)
			return 'BracketFrozen';

		if (!this.users.has(user))
			return 'UserNotAdded';
		this.users.delete(user);

		var targetNode;
		for (var n = 0; n < this.tree.currentLayerLeafNodes.length && !targetNode; ++n)
			if (this.tree.currentLayerLeafNodes[n].getValue().user === user) {
				targetNode = this.tree.currentLayerLeafNodes[n];
				this.tree.currentLayerLeafNodes.splice(n, 1);
			}
		if (targetNode) {
			if (this.users.size === 0)
				this.tree = null;
			else if (this.tree.nextLayerLeafNodes.length === 0) {
				this.tree.nextLayerLeafNodes = this.tree.currentLayerLeafNodes;

				var parentNode = targetNode.getParent();
				parentNode.removeChild(targetNode);
				this.tree.nextLayerLeafNodes.splice(this.tree.nextLayerLeafNodes.indexOf(parentNode.getChildAt(0)), 1);
				this.tree.currentLayerLeafNodes = [fixSingleChildNode(parentNode)];
			} else {
				var newNode = this.tree.nextLayerLeafNodes.pop();

				var parentNode = newNode.getParent();
				parentNode.removeChild(newNode);
				this.tree.nextLayerLeafNodes.splice(this.tree.nextLayerLeafNodes.indexOf(parentNode.getChildAt(0)), 1);
				this.tree.currentLayerLeafNodes.push(fixSingleChildNode(parentNode));

				targetNode.getParent().replaceChild(newNode, targetNode);
				this.tree.currentLayerLeafNodes.push(newNode);
			}
			return;
		}

		for (var n = 0; n < this.tree.nextLayerLeafNodes.length && !targetNode; ++n)
			if (this.tree.nextLayerLeafNodes[n].getValue().user === user) {
				targetNode = this.tree.nextLayerLeafNodes[n];
				this.tree.nextLayerLeafNodes.splice(n, 1);
			}
		var parentNode = targetNode.getParent();
		parentNode.removeChild(targetNode);
		this.tree.nextLayerLeafNodes.splice(this.tree.nextLayerLeafNodes.indexOf(parentNode.getChildAt(0)), 1);
		this.tree.currentLayerLeafNodes.push(fixSingleChildNode(parentNode));
	};
	Elimination.prototype.replaceUser = function (user, replacementUser) {
		if (!this.users.has(user))
			return 'UserNotAdded';

		if (this.users.has(replacementUser))
			return 'UserAlreadyAdded';

		this.users.delete(user);
		this.users.set(user, {});

		var targetNode;
		for (var n = 0; n < this.tree.currentLayerLeafNodes.length && !targetNode; ++n)
			if (this.tree.currentLayerLeafNodes[n].getValue().user === user)
				targetNode = this.tree.currentLayerLeafNodes[n];
		for (var n = 0; n < this.tree.nextLayerLeafNodes.length && !targetNode; ++n)
			if (this.tree.nextLayerLeafNodes[n].getValue().user === user)
				targetNode = this.tree.nextLayerLeafNodes[n];
		targetNode.getValue().user = replacementUser;
	};
	Elimination.prototype.getUsers = function () {
		var users = [];
		this.users.forEach(function (value, key) {
			users.push(key);
		});
		return users;
	};

	Elimination.prototype.getBracketData = function () {
		var rootNode = {children: []};
		if (this.tree) {
			var queue = [{fromNode: this.tree.tree, toNode: rootNode}];
			while (queue.length > 0) {
				var frame = queue.shift();
				var node = {children: []};

				frame.toNode.children.push(node);

				var fromNodeValues = frame.fromNode.getValue();
				if (frame.fromNode.isLeaf())
					node.team = fromNodeValues.user || null;
				else {
					node.state = fromNodeValues.state || 'unavailable';
					if (node.state === 'finished') {
						node.team = fromNodeValues.user;
						node.result = fromNodeValues.result;
						node.score = fromNodeValues.score;
					}
				}

				frame.fromNode.forEachChild(function (child) {
					queue.push({fromNode: child, toNode: node});
				});
			}
		}

		var data = {};
		data.type = 'tree';
		data.rootNode = rootNode.children[0] || null;
		return data;
	};
	Elimination.prototype.freezeBracket = function () {
		this.isBracketFrozen = true;
		this.users.forEach(function (user) {
			user.isBusy = false;
			user.isDisqualified = false;
			user.loseCount = 0;
		});

		this.maxSubtrees = Math.min(this.maxSubtrees, this.users.size - 1);
		for (var t = 1; t < this.maxSubtrees; ++t) {
			var matchesByDepth = {};
			var queue = [{node: this.tree.tree, depth: 0}];
			while (queue.length > 0) {
				var frame = queue.shift();
				if (frame.node.isLeaf() || frame.node.getValue().onLoseNode)
					continue;

				if (!matchesByDepth[frame.depth])
					matchesByDepth[frame.depth] = [];
				matchesByDepth[frame.depth].push(frame.node);

				queue.push({node: frame.node.getChildAt(0), depth: frame.depth + 1});
				queue.push({node: frame.node.getChildAt(1), depth: frame.depth + 1});
			}

			var newTree = {
				tree: new TreeNode(null, {fromNode: matchesByDepth[0][0]}),
				currentLayerLeafNodes: [],
				nextLayerLeafNodes: []
			};
			newTree.currentLayerLeafNodes.push(newTree.tree);

			for (var m in matchesByDepth) {
				if (m === '0')
					continue;
				var n = 0;
				for (; n < matchesByDepth[m].length - 1; n += 2) {
					// Replace old leaf with:
					//      old leaf --+
					//   new leaf --+  +-->
					//              +--+
					//   new leaf --+

					var oldLeaf = newTree.currentLayerLeafNodes.shift();
					oldLeaf.addChild(new TreeNode(null, {fromNode: oldLeaf.getValue().fromNode}));
					delete oldLeaf.getValue().fromNode;

					var newBranch = new TreeNode(null, {});
					oldLeaf.addChild(newBranch);

					var newLeaf = new TreeNode(null, {fromNode: matchesByDepth[m][n]});
					newBranch.addChild(newLeaf);
					newTree.nextLayerLeafNodes.push(newLeaf);

					newLeaf = new TreeNode(null, {fromNode: matchesByDepth[m][n + 1]});
					newBranch.addChild(newLeaf);
					newTree.nextLayerLeafNodes.push(newLeaf);
				}
				if (n < matchesByDepth[m].length) {
					// Replace old leaf with:
					//   old leaf --+
					//              +-->
					//   new leaf --+

					var oldLeaf = newTree.currentLayerLeafNodes.shift();
					oldLeaf.addChild(new TreeNode(null, {fromNode: oldLeaf.getValue().fromNode}));
					delete oldLeaf.getValue().fromNode;

					var newLeaf = new TreeNode(null, {fromNode: matchesByDepth[m][n]});
					oldLeaf.addChild(newLeaf);
					newTree.nextLayerLeafNodes.push(newLeaf);
				}

				newTree.currentLayerLeafNodes = newTree.nextLayerLeafNodes;
				newTree.nextLayerLeafNodes = [];
			}

			newTree.tree.traverse(function (node) {
				if (node.getValue().fromNode) {
					node.getValue().fromNode.getValue().onLoseNode = node;
					delete node.getValue().fromNode;
				}
			});

			var newRoot = new TreeNode(null, {});
			newRoot.addChild(this.tree.tree);
			newRoot.addChild(newTree.tree);
			this.tree.tree = newRoot;
		}

		this.tree.tree.traverse(function (node) {
			if (!node.isLeaf() && node.getChildAt(0).getValue().user && node.getChildAt(1).getValue().user) {
				node.getValue().state = 'available';
			}
		});
	};

	Elimination.prototype.disqualifyUser = function (user) {
		if (!this.isBracketFrozen)
			return 'BracketNotFrozen';

		if (!this.users.has(user))
			return 'UserNotAdded';

		this.users.get(user).isDisqualified = true;

		// The user either has a single available battle or no available battles
		var match = null;
		var result;
		this.tree.tree.traverse(function (node) {
			if (node.getValue().state === 'available')
				if (node.getChildAt(0).getValue().user === user) {
					match = [user, node.getChildAt(1).getValue().user];
					result = 'loss';
				} else if (node.getChildAt(1).getValue().user === user) {
					match = [node.getChildAt(0).getValue().user, user];
					result = 'win';
				}

			return !match;
		});
		if (match) {
			var error = this.setMatchResult(match, result);
			if (error)
				throw new Error("Unexpected " + error + " from setMatchResult([" + match.join(", ") + "], " + result + ")");
		}
	};
	Elimination.prototype.getUserBusy = function (user) {
		if (!this.isBracketFrozen)
			return 'BracketNotFrozen';

		if (!this.users.has(user))
			return 'UserNotAdded';
		return this.users.get(user).isBusy;
	};
	Elimination.prototype.setUserBusy = function (user, isBusy) {
		if (!this.isBracketFrozen)
			return 'BracketNotFrozen';

		if (!this.users.has(user))
			return 'UserNotAdded';
		this.users.get(user).isBusy = isBusy;
	};

	Elimination.prototype.getAvailableMatches = function () {
		if (!this.isBracketFrozen)
			return 'BracketNotFrozen';

		var matches = [];
		this.tree.tree.traverse(function (node) {
			if (node.getValue().state === 'available') {
				var userA = node.getChildAt(0).getValue().user;
				var userB = node.getChildAt(1).getValue().user;
				if (!this.users.get(userA).isBusy && !this.users.get(userB).isBusy)
					matches.push([userA, userB]);
			}
		}, this);
		return matches;
	};
	Elimination.prototype.setMatchResult = function (match, result, score) {
		if (!this.isBracketFrozen) return 'BracketNotFrozen';

		if (!(result in {win:1, loss:1})) return 'InvalidMatchResult';

		if (!this.users.has(match[0]) || !this.users.has(match[1])) return 'UserNotAdded';

		var targetNode = null;
		this.tree.tree.traverse(function (node) {
			if (node.getValue().state === 'available' &&
				node.getChildAt(0).getValue().user === match[0] &&
				node.getChildAt(1).getValue().user === match[1])
				targetNode = node;
			return !targetNode;
		});
		if (!targetNode) return 'InvalidMatch';

		if (!score) {
			if (result === 'win') {
				score = [1, 0];
			} else {
				score = [0, 1];
			}
		}

		match = targetNode.getValue();
		match.state = 'finished';
		match.result = result;
		match.score = score.slice(0);

		var winner = targetNode.getChildAt(result === 'win' ? 0 : 1).getValue().user;
		var loser = targetNode.getChildAt(result === 'loss' ? 0 : 1).getValue().user;
		match.user = winner;

		var loserData = this.users.get(loser);
		++loserData.loseCount;

		if (targetNode.getParent()) {
			var userA = targetNode.getParent().getChildAt(0).getValue().user;
			var userB = targetNode.getParent().getChildAt(1).getValue().user;
			if (userA && userB) {
				targetNode.getParent().getValue().state = 'available';

				var error = '';
				if (this.users.get(userA).isDisqualified) {
					error = this.setMatchResult([userA, userB], 'loss');
				} else if (this.users.get(userB).isDisqualified) {
					error = this.setMatchResult([userA, userB], 'win');
				}

				if (error) {
					throw new Error("Unexpected " + error + " from setMatchResult([" + userA + ", " + userB + "], ...)");
				}
			}
		} else if (loserData.loseCount < this.maxSubtrees && !loserData.isDisqualified) {
			var newRoot = new TreeNode(null, {state: 'available'});
			newRoot.addChild(targetNode);
			newRoot.addChild(new TreeNode(null, {user: loser}));
			this.tree.tree = newRoot;
		}

		if (match.onLoseNode) {
			match.onLoseNode.getValue().user = loser;
			var userA = match.onLoseNode.getParent().getChildAt(0).getValue().user;
			var userB = match.onLoseNode.getParent().getChildAt(1).getValue().user;
			if (userA && userB) {
				match.onLoseNode.getParent().getValue().state = 'available';

				var error = '';
				if (this.users.get(userA).isDisqualified)
					error = this.setMatchResult([userA, userB], 'loss');
				else if (this.users.get(userB).isDisqualified)
					error = this.setMatchResult([userA, userB], 'win');

				if (error)
					throw new Error("Unexpected " + error + " from setMatchResult([" + userA + ", " + userB + "], ...)");
			}
		}
	};

	Elimination.prototype.isTournamentEnded = function () {
		return this.tree.tree.getValue().state === 'finished';
	};

	Elimination.prototype.getResults = function () {
		if (!this.isTournamentEnded())
			return 'TournamentNotEnded';

		var results = [];
		var currentNode = this.tree.tree;
		for (var n = 0; n < this.maxSubtrees; ++n) {
			results.push([currentNode.getValue().user]);
			currentNode = currentNode.getChildAt(currentNode.getValue().result === 'loss' ? 0 : 1);
			if (!currentNode)
				break;
		}

		if (this.users.size - 1 === this.maxSubtrees && currentNode)
			results.push([currentNode.getValue().user]);

		return results;
	};

	return Elimination;
})();

exports.Elimination = Elimination;
