'use strict';

let TreeNode = require('./lib/closure-goog.structs.TreeNode-c8e0b2dcd892.min').goog.structs.TreeNode;

const nameMap = {
	'1': "Single",
	'2': "Double",
	'3': "Triple",
	'4': "Quadruple",
	'5': "Quintuple",
	'6': "Sextuple",
	// Feel free to add more
};

class Elimination {
	constructor(maxSubtrees) {
		this.name = "Elimination";
		this.isDrawingSupported = false;

		maxSubtrees = maxSubtrees || 1;
		if (typeof maxSubtrees === 'string' && maxSubtrees.toLowerCase() === 'infinity') {
			maxSubtrees = Infinity;
		} else if (typeof maxSubtrees !== 'number') {
			maxSubtrees = parseInt(maxSubtrees);
		}
		if (!maxSubtrees || maxSubtrees < 1) maxSubtrees = 1;

		this.maxSubtrees = maxSubtrees;
		this.isBracketFrozen = false;
		this.tree = null;
		this.users = new Map();

		if (nameMap[maxSubtrees]) {
			this.name = nameMap[maxSubtrees] + " " + this.name;
		} else if (maxSubtrees === Infinity) {
			this.name = "N-" + this.name;
		} else {
			this.name = maxSubtrees + "-tuple " + this.name;
		}
	}

	addUser(user) {
		if (this.isBracketFrozen) return 'BracketFrozen';
		this.users.set(user, {});
	}

	removeUser(user) {
		if (this.isBracketFrozen) return 'BracketFrozen';
		this.users.delete(user);
	}
	replaceUser(user, replacementUser) {
		this.users.delete(user);
		this.users.set(replacementUser, {});

		let targetNode;
		for (let n = 0; n < this.tree.currentLayerLeafNodes.length && !targetNode; ++n) {
			if (this.tree.currentLayerLeafNodes[n].getValue().user === user) {
				targetNode = this.tree.currentLayerLeafNodes[n];
			}
		}
		for (let n = 0; n < this.tree.nextLayerLeafNodes.length && !targetNode; ++n) {
			if (this.tree.nextLayerLeafNodes[n].getValue().user === user) {
				targetNode = this.tree.nextLayerLeafNodes[n];
			}
		}
		targetNode.getValue().user = replacementUser;
	}
	getUsers(remaining) {
		let users = [];
		for (const [key, value] of this.users) {
			if (remaining && (value.isEliminated || value.isDisqualified)) continue;
			users.push(key);
		}
		return users;
	}


	generateBracket() {
		for (const user of Dex.shuffle(this.getUsers())) {
			if (!this.tree) {
				this.tree = {
					tree: new TreeNode(null, {user: user}),
					currentLayerLeafNodes: [],
					nextLayerLeafNodes: [],
				};
				this.tree.currentLayerLeafNodes.push(this.tree.tree);
				continue;
			}
			let targetNode = this.tree.currentLayerLeafNodes.shift();

			let newNode = new TreeNode(null, {user: targetNode.getValue().user});
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
		}
	}
	getBracketData() {
		let rootNode = {children: []};
		if (this.tree) {
			let queue = [{fromNode: this.tree.tree, toNode: rootNode}];
			while (queue.length > 0) {
				let frame = queue.shift();
				let node = {children: []};

				frame.toNode.children.push(node);

				let fromNodeValues = frame.fromNode.getValue();
				if (frame.fromNode.isLeaf()) {
					node.team = fromNodeValues.user || null;
				} else {
					node.state = fromNodeValues.state || 'unavailable';
					if (node.state === 'finished') {
						node.team = fromNodeValues.user;
						node.result = fromNodeValues.result;
						node.score = fromNodeValues.score;
					}
				}

				frame.fromNode.forEachChild(child => {
					queue.push({fromNode: child, toNode: node});
				});
			}
		}

		let data = {};
		data.type = 'tree';
		data.rootNode = rootNode.children[0] || null;
		return data;
	}
	freezeBracket() {
		this.isBracketFrozen = true;
		for (const user of this.users.values()) {
			user.isBusy = false;
			user.isDisqualified = false;
			user.loseCount = 0;
		}

		this.maxSubtrees = Math.min(this.maxSubtrees, this.users.size - 1);
		for (let t = 1; t < this.maxSubtrees; ++t) {
			let matchesByDepth = {};
			let queue = [{node: this.tree.tree, depth: 0}];
			while (queue.length > 0) {
				let frame = queue.shift();
				if (frame.node.isLeaf() || frame.node.getValue().onLoseNode) continue;

				if (!matchesByDepth[frame.depth]) matchesByDepth[frame.depth] = [];
				matchesByDepth[frame.depth].push(frame.node);

				queue.push({node: frame.node.getChildAt(0), depth: frame.depth + 1});
				queue.push({node: frame.node.getChildAt(1), depth: frame.depth + 1});
			}

			let newTree = {
				tree: new TreeNode(null, {fromNode: matchesByDepth[0][0]}),
				currentLayerLeafNodes: [],
				nextLayerLeafNodes: [],
			};
			newTree.currentLayerLeafNodes.push(newTree.tree);

			for (let m in matchesByDepth) {
				if (m === '0') continue;
				let n = 0;
				for (; n < matchesByDepth[m].length - 1; n += 2) {
					// Replace old leaf with:
					//      old leaf --+
					//   new leaf --+  +-->
					//              +--+
					//   new leaf --+

					let oldLeaf = newTree.currentLayerLeafNodes.shift();
					oldLeaf.addChild(new TreeNode(null, {fromNode: oldLeaf.getValue().fromNode}));
					delete oldLeaf.getValue().fromNode;

					let newBranch = new TreeNode(null, {});
					oldLeaf.addChild(newBranch);

					let newLeaf = new TreeNode(null, {fromNode: matchesByDepth[m][n]});
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

					let oldLeaf = newTree.currentLayerLeafNodes.shift();
					oldLeaf.addChild(new TreeNode(null, {fromNode: oldLeaf.getValue().fromNode}));
					delete oldLeaf.getValue().fromNode;

					let newLeaf = new TreeNode(null, {fromNode: matchesByDepth[m][n]});
					oldLeaf.addChild(newLeaf);
					newTree.nextLayerLeafNodes.push(newLeaf);
				}

				newTree.currentLayerLeafNodes = newTree.nextLayerLeafNodes;
				newTree.nextLayerLeafNodes = [];
			}

			newTree.tree.traverse(node => {
				if (node.getValue().fromNode) {
					node.getValue().fromNode.getValue().onLoseNode = node;
					delete node.getValue().fromNode;
				}
			});

			let newRoot = new TreeNode(null, {});
			newRoot.addChild(this.tree.tree);
			newRoot.addChild(newTree.tree);
			this.tree.tree = newRoot;
		}

		this.tree.tree.traverse(node => {
			if (!node.isLeaf() && node.getChildAt(0).getValue().user && node.getChildAt(1).getValue().user) {
				node.getValue().state = 'available';
			}
		});
	}

	disqualifyUser(user) {
		if (!this.isBracketFrozen) return 'BracketNotFrozen';

		this.users.get(user).isDisqualified = true;
		user.destroy();

		// The user either has a single available battle or no available battles
		let match = null;
		let result;
		this.tree.tree.traverse(node => {
			if (node.getValue().state === 'available') {
				if (node.getChildAt(0).getValue().user === user) {
					match = [user, node.getChildAt(1).getValue().user];
					result = 'loss';
				} else if (node.getChildAt(1).getValue().user === user) {
					match = [node.getChildAt(0).getValue().user, user];
					result = 'win';
				}
			}

			return !match;
		});
		if (match) {
			let error = this.setMatchResult(match, result);
			if (error) {
				throw new Error(`Unexpected ${error} from setMatchResult([${match.join(', ')}], ${result})`);
			}
		}
	}
	getUserBusy(user) {
		if (!this.isBracketFrozen) return 'BracketNotFrozen';
		return this.users.get(user).isBusy;
	}
	setUserBusy(user, isBusy) {
		if (!this.isBracketFrozen) return 'BracketNotFrozen';
		this.users.get(user).isBusy = isBusy;
	}

	getAvailableMatches() {
		if (!this.isBracketFrozen) return 'BracketNotFrozen';

		let matches = [];
		this.tree.tree.traverse(node => {
			if (node.getValue().state === 'available') {
				let userA = node.getChildAt(0).getValue().user;
				let userB = node.getChildAt(1).getValue().user;
				if (!this.users.get(userA).isBusy && !this.users.get(userB).isBusy) {
					matches.push([userA, userB]);
				}
			}
		});
		return matches;
	}
	setMatchResult(match, result, score) {
		if (!this.isBracketFrozen) return 'BracketNotFrozen';

		if (!['win', 'loss'].includes(result)) return 'InvalidMatchResult';

		if (!this.users.has(match[0]) || !this.users.has(match[1])) return 'UserNotAdded';

		let targetNode = null;
		this.tree.tree.traverse(node => {
			if (node.getValue().state === 'available' &&
				node.getChildAt(0).getValue().user === match[0] &&
				node.getChildAt(1).getValue().user === match[1]) {
				targetNode = node;
			}
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

		let winner = targetNode.getChildAt(result === 'win' ? 0 : 1).getValue().user;
		let loser = targetNode.getChildAt(result === 'loss' ? 0 : 1).getValue().user;
		match.user = winner;

		let loserData = this.users.get(loser);
		++loserData.loseCount;
		if (loserData.loseCount === this.maxSubtrees) {
			loserData.isEliminated = true;
			loser.destroy();
		}

		if (targetNode.getParent()) {
			let userA = targetNode.getParent().getChildAt(0).getValue().user;
			let userB = targetNode.getParent().getChildAt(1).getValue().user;
			if (userA && userB) {
				targetNode.getParent().getValue().state = 'available';

				let error = '';
				if (this.users.get(userA).isDisqualified) {
					error = this.setMatchResult([userA, userB], 'loss');
				} else if (this.users.get(userB).isDisqualified) {
					error = this.setMatchResult([userA, userB], 'win');
				}

				if (error) {
					throw new Error(`Unexpected ${error} from setMatchResult([${userA},${userB}], ...)`);
				}
			}
		} else if (loserData.loseCount < this.maxSubtrees && !loserData.isDisqualified) {
			let newRoot = new TreeNode(null, {state: 'available'});
			newRoot.addChild(targetNode);
			newRoot.addChild(new TreeNode(null, {user: loser}));
			this.tree.tree = newRoot;
		}

		if (match.onLoseNode) {
			match.onLoseNode.getValue().user = loser;
			let userA = match.onLoseNode.getParent().getChildAt(0).getValue().user;
			let userB = match.onLoseNode.getParent().getChildAt(1).getValue().user;
			if (userA && userB) {
				match.onLoseNode.getParent().getValue().state = 'available';

				let error = '';
				if (this.users.get(userA).isDisqualified) {
					error = this.setMatchResult([userA, userB], 'loss');
				} else if (this.users.get(userB).isDisqualified) {
					error = this.setMatchResult([userA, userB], 'win');
				}

				if (error) {
					throw new Error(`Unexpected ${error} from setMatchResult([${userA}, ${userB}], ...)`);
				}
			}
		}
	}

	isTournamentEnded() {
		return this.tree.tree.getValue().state === 'finished';
	}

	getResults() {
		if (!this.isTournamentEnded()) return 'TournamentNotEnded';

		let results = [];
		let currentNode = this.tree.tree;
		for (let n = 0; n < this.maxSubtrees; ++n) {
			results.push([currentNode.getValue().user]);
			currentNode = currentNode.getChildAt(currentNode.getValue().result === 'loss' ? 0 : 1);
			if (!currentNode) break;
		}

		if (this.users.size - 1 === this.maxSubtrees && currentNode) {
			results.push([currentNode.getValue().user]);
		}

		return results;
	}
}

module.exports = Elimination;
