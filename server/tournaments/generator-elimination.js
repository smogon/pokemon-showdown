'use strict';

/**
 * There are two types of elim nodes, player nodes
 * and match nodes.
 *
 * Player nodes are leaf nodes: .children = none
 *
 * Match nodes are non-leaf nodes, and will always have two children.
 */
class ElimNode {
	constructor(/** @type {Partial<ElimNode>} */ options) {
		/** @type {[ElimNode, ElimNode]?} */
		this.children = null;
		/**
		 * In a player node, the player (null if it's an unfilled loser's bracket node).
		 *
		 * In a match node, the winner if it exists, otherwise null.
		 * @type {TournamentPlayer?} */
		this.user = options.user || null;
		/**
		 * Only relevant to match nodes. (Player nodes are always '')
		 *
		 * 'available' = ready for battles - will have two children, both with users; this.user is null
		 *
		 * 'finished' = battle already over - will have two children, both with users; this.user is winner
		 *
		 * '' = unavailable
		 * @type {'available' | 'finished' | ''}
		 */
		this.state = options.state || '';
		/** @type {'win' | 'loss' | ''} */
		this.result = options.result || '';
		/** @type {number[] | null} */
		this.score = options.score || null;
		/**
		 * Only relevant to match nodes in double+ elimination.
		 *
		 * The loser of this battle will be put in target player node.
		 * @type {ElimNode?}
		 */
		this.losersBracketNode = options.losersBracketNode || null;
		/**
		 * 0 = winner's bracket
		 * 1 = loser's bracket
		 * 2 = second loser's bracket
		 * etc
		 * (always 0 in single elimination)
		 * @type {number}
		 */
		this.losersBracketIndex = options.losersBracketIndex || 0;
		/** @type {ElimNode?} */
		this.parent = options.parent || null;
		/**
		 * Only used while building the tree
		 * @type {ElimNode?}
		 */
		this.fromNode = options.fromNode || null;
	}
	setChildren(/** @type {[ElimNode, ElimNode]?} */ children) {
		if (this.children) {
			for (const child of this.children) child.parent = null;
		}
		if (children) {
			for (const child of children) child.parent = this;
		}
		this.children = children;
	}
	traverse(/** @type {(node: ElimNode) => void} */ callback) {
		/** @type {ElimNode[]} */
		const queue = [this];
		let node;
		while ((node = queue.shift())) {
			// eslint-disable-next-line callback-return
			callback(node);
			if (node.children) queue.push(...node.children);
		}
	}
	/** @template T */
	find(/** @type {(node: ElimNode) => (T | void)} */ callback) {
		/** @type {ElimNode[]} */
		const queue = [this];
		let node;
		while ((node = queue.shift())) {
			// eslint-disable-next-line callback-return
			const value = callback(node);
			if (value) {
				return value;
			}
			if (node.children) queue.push(...node.children);
		}
		return undefined;
	}
	[Symbol.iterator]() { // eslint-disable-line no-restricted-globals
		/** @type {ElimNode[]} */
		let results = [this];
		for (let i = 0; i < results.length; i++) {
			// @ts-ignore
			if (results[i].children) results.push(...results[i].children);
		}
		return results[Symbol.iterator](); // eslint-disable-line no-restricted-globals
	}
	toJSON() {
		/** @type {any} */
		let node = {};

		if (!this.children) {
			node.team = this.user || (
				this.losersBracketIndex <= 1 ? `(loser's bracket)` : `(loser's bracket ${this.losersBracketIndex})`
			);
		} else {
			node.children = this.children.map(child => child.toJSON());
			node.state = this.state || 'unavailable';
			if (node.state === 'finished') {
				node.team = this.user;
				node.result = this.result;
				node.score = this.score;
			}
		}

		return node;
	}
}

/** @typedef {import('./index').TournamentPlayer} TournamentPlayer */

const nameMap = [
	"",
	"Single",
	"Double",
	"Triple",
	"Quadruple",
	"Quintuple",
	"Sextuple",
	// Feel free to add more
];

class Elimination {
	/**
	 * @param {number | string} maxSubtrees
	 */
	constructor(maxSubtrees) {
		/** @type {string} */
		this.name = "Elimination";
		this.isDrawingSupported = false;
		this.isBracketFrozen = false;
		/** @type {TournamentPlayer[]} */
		this.players = [];

		maxSubtrees = maxSubtrees || 1;
		if (typeof maxSubtrees === 'string' && maxSubtrees.toLowerCase() === 'infinity') {
			maxSubtrees = Infinity;
		} else if (typeof maxSubtrees !== 'number') {
			maxSubtrees = parseInt(maxSubtrees);
		}
		if (!maxSubtrees || maxSubtrees < 1) maxSubtrees = 1;

		/** @type {number} */
		this.maxSubtrees = maxSubtrees;
		/** @type {ElimNode} */
		this.treeRoot = /** @type {any} */ (null);

		if (nameMap[maxSubtrees]) {
			this.name = `${nameMap[maxSubtrees]} ${this.name}`;
		} else if (maxSubtrees === Infinity) {
			this.name = `N-${this.name}`;
		} else {
			this.name = `${maxSubtrees}-tuple ${this.name}`;
		}
	}

	/**
	 * @param {TournamentPlayer[]} players
	 */
	getPendingBracketData(players) {
		return {
			type: 'tree',
			rootNode: null,
		};
	}
	getBracketData() {
		return {
			type: 'tree',
			rootNode: this.treeRoot.toJSON(),
		};
	}
	/**
	 * @param {TournamentPlayer[]} players
	 */
	freezeBracket(players) {
		if (!players.length) throw new Error(`No players in tournament`);

		this.players = players;
		this.isBracketFrozen = true;

		/** @typedef {{root: ElimNode, currentLayerLeafNodes: ElimNode[], nextLayerLeafNodes: ElimNode[]}} ElimTree */

		// build the winner's bracket

		let tree = /** @type {ElimTree} */ (/** @type {never} */ (null));

		for (const user of Dex.shuffle(players)) {
			if (!tree) {
				tree = {
					root: new ElimNode({user: user}),
					currentLayerLeafNodes: [],
					nextLayerLeafNodes: [],
				};
				tree.currentLayerLeafNodes.push(tree.root);
				continue;
			}
			let targetNode = tree.currentLayerLeafNodes.shift();
			if (!targetNode) throw new Error(`TypeScript bug: no ! in checkJs`);

			let newLeftChild = new ElimNode({user: targetNode.user});
			tree.nextLayerLeafNodes.push(newLeftChild);

			let newRightChild = new ElimNode({user: user});
			tree.nextLayerLeafNodes.push(newRightChild);
			targetNode.setChildren([newLeftChild, newRightChild]);

			targetNode.user = null;

			if (tree.currentLayerLeafNodes.length === 0) {
				tree.currentLayerLeafNodes = tree.nextLayerLeafNodes;
				tree.nextLayerLeafNodes = [];
			}
		}

		// build the loser's brackets, if applicable

		this.maxSubtrees = Math.min(this.maxSubtrees, players.length - 1);
		for (let losersBracketIndex = 1; losersBracketIndex < this.maxSubtrees; losersBracketIndex++) {
			/** @type {{[depth: number]: ElimNode[]}} */
			let matchesByDepth = {};
			let queue = [{node: tree.root, depth: 0}];
			let frame;
			while ((frame = queue.shift())) {
				if (!frame.node.children || frame.node.losersBracketNode) continue;

				if (!matchesByDepth[frame.depth]) matchesByDepth[frame.depth] = [];
				matchesByDepth[frame.depth].push(frame.node);

				queue.push({node: frame.node.children[0], depth: frame.depth + 1});
				queue.push({node: frame.node.children[1], depth: frame.depth + 1});
			}

			/** @type {ElimTree} */
			let newTree = {
				root: new ElimNode({losersBracketIndex, fromNode: matchesByDepth[0][0]}),
				currentLayerLeafNodes: [],
				nextLayerLeafNodes: [],
			};
			newTree.currentLayerLeafNodes.push(newTree.root);

			for (let depth in matchesByDepth) {
				if (depth === '0') continue;
				const matchesThisDepth = matchesByDepth[depth];
				let n = 0;
				for (; n < matchesThisDepth.length - 1; n += 2) {
					// Replace old leaf with:
					//      old leaf --+
					//   new leaf --+  +-->
					//              +--+
					//   new leaf --+

					let oldLeaf = newTree.currentLayerLeafNodes.shift();
					if (!oldLeaf) throw new Error(`TypeScript bug: no ! in checkJs`);
					const oldLeafFromNode = oldLeaf.fromNode;
					oldLeaf.fromNode = null;

					/** @type {ElimNode} */
					let newBranch = new ElimNode({losersBracketIndex});
					oldLeaf.setChildren([new ElimNode({losersBracketIndex, fromNode: oldLeafFromNode}), newBranch]);

					let newLeftChild = new ElimNode({losersBracketIndex, fromNode: matchesThisDepth[n]});
					newTree.nextLayerLeafNodes.push(newLeftChild);

					let newRightChild = new ElimNode({losersBracketIndex, fromNode: matchesThisDepth[n + 1]});
					newTree.nextLayerLeafNodes.push(newRightChild);
					newBranch.setChildren([newLeftChild, newRightChild]);
				}
				if (n < matchesThisDepth.length) {
					// Replace old leaf with:
					//   old leaf --+
					//              +-->
					//   new leaf --+

					let oldLeaf = newTree.currentLayerLeafNodes.shift();
					if (!oldLeaf) throw new Error(`TypeScript bug: no ! in checkJs`);
					const oldLeafFromNode = oldLeaf.fromNode;
					oldLeaf.fromNode = null;

					let newLeaf = new ElimNode({fromNode: matchesThisDepth[n]});
					newTree.nextLayerLeafNodes.push(newLeaf);
					oldLeaf.setChildren([new ElimNode({fromNode: oldLeafFromNode}), newLeaf]);
				}

				newTree.currentLayerLeafNodes = newTree.nextLayerLeafNodes;
				newTree.nextLayerLeafNodes = [];
			}

			newTree.root.traverse(node => {
				if (node.fromNode) {
					node.fromNode.losersBracketNode = node;
					node.fromNode = null;
				}
			});

			/** @type {ElimNode} */
			let newRoot = new ElimNode({});
			newRoot.setChildren([tree.root, newTree.root]);
			tree.root = newRoot;
		}

		tree.root.traverse(node => {
			if (node.children && node.children[0].user && node.children[1].user) {
				node.state = 'available';
			}
		});

		this.treeRoot = tree.root;
	}

	/**
	 * @param {TournamentPlayer} user
	 */
	disqualifyUser(user) {
		if (!this.isBracketFrozen) return 'BracketNotFrozen';

		/**
		 * The user either has a single available battle or no available battles
		 */
		const found = this.treeRoot.find(node => {
			if (node.state === 'available') {
				if (!node.children) throw new Error(`no children`);
				if (node.children[0].user === user) {
					return {
						match: [user, node.children[1].user],
						result: 'loss',
						score: [0, 1],
					};
				} else if (node.children[1].user === user) {
					return {
						match: [node.children[0].user, user],
						result: 'win',
						score: [1, 0],
					};
				}
			}
			return undefined;
		});
		if (found) {
			// @ts-ignore
			let error = this.setMatchResult(found.match, found.result, found.score);
			if (error) {
				throw new Error(`Unexpected ${error} from setMatchResult([${found.match.join(', ')}], ${found.result})`);
			}
		}

		user.unlinkUser();
	}

	getAvailableMatches() {
		if (!this.isBracketFrozen) return 'BracketNotFrozen';

		/** @type {[TournamentPlayer, TournamentPlayer][]} */
		let matches = [];
		this.treeRoot.traverse(node => {
			if (node.state !== 'available') return;
			// @ts-ignore
			let p1 = /** @type {TournamentPlayer} */ (node.children[0].user);
			// @ts-ignore
			let p2 = /** @type {TournamentPlayer} */ (node.children[1].user);
			if (!p1.isBusy && !p2.isBusy) {
				matches.push([p1, p2]);
			}
		});
		return matches;
	}
	/**
	 *
	 * @param {[TournamentPlayer, TournamentPlayer]} players
	 * @param {'win' | 'loss'} result
	 * @param {number[]} score
	 */
	setMatchResult([p1, p2], result, score) {
		if (!this.isBracketFrozen) return 'BracketNotFrozen';

		if (!['win', 'loss'].includes(result)) return 'InvalidMatchResult';

		if (!this.players.includes(p1) || !this.players.includes(p2)) return 'UserNotAdded';

		let targetNode = this.treeRoot.find(node => {
			if (node.state === 'available' && (
				// @ts-ignore
				node.children[0].user === p1 && node.children[1].user === p2
			)) {
				return node;
			}
			return undefined;
		});
		if (!targetNode) return 'InvalidMatch';
		if (!targetNode.children) throw new Error(`invalid available state`);

		targetNode.state = 'finished';
		targetNode.result = result;
		targetNode.score = score.slice();

		let winner = targetNode.children[result === 'win' ? 0 : 1].user;
		let loser = targetNode.children[result === 'loss' ? 0 : 1].user;
		targetNode.user = winner;
		if (!winner || !loser) throw new Error(`invalid available state`);

		if (loser.losses === this.maxSubtrees) {
			loser.isEliminated = true;
			loser.unlinkUser();
		}

		if (targetNode.parent) {
			// @ts-ignore
			let userA = targetNode.parent.children[0].user;
			// @ts-ignore
			let userB = targetNode.parent.children[1].user;
			if (userA && userB) {
				targetNode.parent.state = 'available';

				/** @type {string | undefined} */
				let error = '';
				if (userA.isDisqualified) {
					error = this.setMatchResult([userA, userB], 'loss', [0, 1]);
				} else if (userB.isDisqualified) {
					error = this.setMatchResult([userA, userB], 'win', [1, 0]);
				}

				if (error) {
					throw new Error(`Unexpected ${error} from setMatchResult([${userA},${userB}], ...)`);
				}
			}
		} else if (loser.losses < this.maxSubtrees && !loser.isDisqualified) {
			/** @type {ElimNode} */
			let newRoot = new ElimNode({state: 'available'});
			newRoot.setChildren([targetNode, new ElimNode({user: loser})]);
			this.treeRoot = newRoot;
		}

		if (targetNode.losersBracketNode) {
			targetNode.losersBracketNode.user = loser;
			// @ts-ignore
			let p1 = targetNode.losersBracketNode.parent.children[0].user;
			// @ts-ignore
			let p2 = targetNode.losersBracketNode.parent.children[1].user;
			if (p1 && p2) {
				// @ts-ignore
				targetNode.losersBracketNode.parent.state = 'available';

				/** @type {string | undefined} */
				let error = '';
				if (p1.isDisqualified) {
					error = this.setMatchResult([p1, p2], 'loss', [0, 1]);
				} else if (p2.isDisqualified) {
					error = this.setMatchResult([p1, p2], 'win', [1, 0]);
				}

				if (error) {
					throw new Error(`Unexpected ${error} from setMatchResult([${p1}, ${p2}], ...)`);
				}
			}
		}
	}

	isTournamentEnded() {
		return this.treeRoot.state === 'finished';
	}

	getResults() {
		if (!this.isTournamentEnded()) return 'TournamentNotEnded';

		let results = [];
		let currentNode = this.treeRoot;
		for (let n = 0; n < this.maxSubtrees; ++n) {
			results.push([currentNode.user]);

			if (!currentNode.children) break;
			currentNode = currentNode.children[currentNode.result === 'loss' ? 0 : 1];
			if (!currentNode) break;
		}

		if (this.players.length - 1 === this.maxSubtrees && currentNode) {
			results.push([currentNode.user]);
		}

		return results;
	}
}

module.exports = Elimination;
