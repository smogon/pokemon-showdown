import {Utils} from '../../lib/utils';

interface ElimTree {
	root: ElimNode;
	currentLayerLeafNodes: ElimNode[];
	nextLayerLeafNodes: ElimNode[];
}

import type {TournamentPlayer} from './index';

/**
 * There are two types of elim nodes, player nodes
 * and match nodes.
 *
 * Player nodes are leaf nodes: .children = none
 *
 * Match nodes are non-leaf nodes, and will always have two children.
 */
class ElimNode {
	children: [ElimNode, ElimNode] | null;
	/**
	 * In a player node, the player (null if it's an unfilled loser's bracket node).
	 *
	 * In a match node, the winner if it exists, otherwise null.
	 */
	user: TournamentPlayer | null;
	/**
	 * Only relevant to match nodes. (Player nodes are always '')
	 *
	 * 'available' = ready for battles - will have two children, both with users; this.user is null
	 *
	 * 'finished' = battle already over - will have two children, both with users; this.user is winner
	 *
	 * '' = unavailable
	 */
	state: 'available' | 'finished' | '';
	result: 'win' | 'loss' | '';
	score: number[] | null;
	/**
	 * Only relevant to match nodes in double+ elimination.
	 *
	 * The loser of this battle will be put in target player node.
	 */
	losersBracketNode: ElimNode | null;
	/**
	 * 0 = winner's bracket
	 * 1 = loser's bracket
	 * 2 = second loser's bracket
	 * etc
	 * (always 0 in single elimination)
	 */
	losersBracketIndex: number;
	parent: ElimNode | null;
	/**
	 * Only used while building the tree
	 */
	fromNode: ElimNode | null;
	constructor(options: Partial<ElimNode>) {
		this.children = null;
		this.user = options.user || null;
		this.state = options.state || '';
		this.result = options.result || '';
		this.score = options.score || null;
		this.losersBracketNode = options.losersBracketNode || null;
		this.losersBracketIndex = options.losersBracketIndex || 0;
		this.parent = options.parent || null;
		this.fromNode = options.fromNode || null;
	}
	setChildren(children: [ElimNode, ElimNode] | null) {
		if (this.children) {
			for (const child of this.children) child.parent = null;
		}
		if (children) {
			for (const child of children) child.parent = this;
		}
		this.children = children;
	}
	traverse(multiCallback: (node: ElimNode) => void) {
		const queue: ElimNode[] = [this];
		let node;
		while ((node = queue.shift())) {
			multiCallback(node);
			if (node.children) queue.push(...node.children);
		}
	}
	find<T>(multiCallback: (node: ElimNode) => (T | void)) {
		const queue: ElimNode[] = [this];
		let node;
		while ((node = queue.shift())) {
			const value = multiCallback(node);
			if (value) {
				return value;
			}
			if (node.children) queue.push(...node.children);
		}
		return undefined;
	}
	// eslint-disable-next-line no-restricted-globals
	[Symbol.iterator]() {
		const results: ElimNode[] = [this];
		for (const result of results) {
			if (result.children) results.push(...result.children);
		}
		// eslint-disable-next-line no-restricted-globals
		return results[Symbol.iterator]();
	}
	toJSON() {
		const node: any = {};

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

export class Elimination {
	readonly name: string;
	readonly isDrawingSupported: boolean;
	isBracketFrozen: boolean;
	players: TournamentPlayer[];
	maxSubtrees: number;
	treeRoot: ElimNode;
	constructor(maxSubtrees: number | string) {
		this.name = "Elimination";
		this.isDrawingSupported = false;
		this.isBracketFrozen = false;
		this.players = [];

		maxSubtrees = maxSubtrees || 1;
		if (typeof maxSubtrees === 'string' && maxSubtrees.toLowerCase() === 'infinity') {
			maxSubtrees = Infinity;
		} else if (typeof maxSubtrees !== 'number') {
			maxSubtrees = parseInt(maxSubtrees);
		}
		if (!maxSubtrees || maxSubtrees < 1) maxSubtrees = 1;

		this.maxSubtrees = maxSubtrees;
		this.treeRoot = null!;

		if (nameMap[maxSubtrees]) {
			this.name = `${nameMap[maxSubtrees]} ${this.name}`;
		} else if (maxSubtrees === Infinity) {
			this.name = `N-${this.name}`;
		} else {
			this.name = `${maxSubtrees}-tuple ${this.name}`;
		}
	}

	getPendingBracketData(players: TournamentPlayer[]) {
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
	freezeBracket(players: TournamentPlayer[]) {
		if (!players.length) throw new Error(`No players in tournament`);

		this.players = players;
		this.isBracketFrozen = true;

		// build the winner's bracket
		let tree: ElimTree = null!;

		for (const user of Utils.shuffle(players)) {
			if (!tree) {
				tree = {
					root: new ElimNode({user}),
					currentLayerLeafNodes: [],
					nextLayerLeafNodes: [],
				};
				tree.currentLayerLeafNodes.push(tree.root);
				continue;
			}
			const targetNode = tree.currentLayerLeafNodes.shift();
			if (!targetNode) throw new Error(`TypeScript bug: no ! in checkJs`);

			const newLeftChild = new ElimNode({user: targetNode.user});
			tree.nextLayerLeafNodes.push(newLeftChild);

			const newRightChild = new ElimNode({user});
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
			const matchesByDepth: {[depth: number]: ElimNode[]} = {};
			const queue = [{node: tree.root, depth: 0}];
			let frame;
			while ((frame = queue.shift())) {
				if (!frame.node.children || frame.node.losersBracketNode) continue;

				if (!matchesByDepth[frame.depth]) matchesByDepth[frame.depth] = [];
				matchesByDepth[frame.depth].push(frame.node);

				queue.push({node: frame.node.children[0], depth: frame.depth + 1});
				queue.push({node: frame.node.children[1], depth: frame.depth + 1});
			}

			const newTree: ElimTree = {
				root: new ElimNode({losersBracketIndex, fromNode: matchesByDepth[0][0]}),
				currentLayerLeafNodes: [],
				nextLayerLeafNodes: [],
			};
			newTree.currentLayerLeafNodes.push(newTree.root);

			for (const depth in matchesByDepth) {
				if (depth === '0') continue;
				const matchesThisDepth = matchesByDepth[depth];
				let n = 0;
				for (; n < matchesThisDepth.length - 1; n += 2) {
					// Replace old leaf with:
					//      old leaf --+
					//   new leaf --+  +-->
					//              +--+
					//   new leaf --+

					const oldLeaf = newTree.currentLayerLeafNodes.shift();
					if (!oldLeaf) throw new Error(`TypeScript bug: no ! in checkJs`);
					const oldLeafFromNode = oldLeaf.fromNode;
					oldLeaf.fromNode = null;

					const newBranch = new ElimNode({losersBracketIndex});
					oldLeaf.setChildren([new ElimNode({losersBracketIndex, fromNode: oldLeafFromNode}), newBranch]);

					const newLeftChild = new ElimNode({losersBracketIndex, fromNode: matchesThisDepth[n]});
					newTree.nextLayerLeafNodes.push(newLeftChild);

					const newRightChild = new ElimNode({losersBracketIndex, fromNode: matchesThisDepth[n + 1]});
					newTree.nextLayerLeafNodes.push(newRightChild);
					newBranch.setChildren([newLeftChild, newRightChild]);
				}
				if (n < matchesThisDepth.length) {
					// Replace old leaf with:
					//   old leaf --+
					//              +-->
					//   new leaf --+

					const oldLeaf = newTree.currentLayerLeafNodes.shift()!;
					const oldLeafFromNode = oldLeaf.fromNode;
					oldLeaf.fromNode = null;

					const newLeaf = new ElimNode({fromNode: matchesThisDepth[n]});
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

			const newRoot = new ElimNode({});
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

	disqualifyUser(user: TournamentPlayer) {
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
			const error = this.setMatchResult(found.match, found.result, found.score);
			if (error) {
				throw new Error(`Unexpected ${error} from setMatchResult([${found.match.join(', ')}], ${found.result})`);
			}
		}

		user.unlinkUser();
	}

	getAvailableMatches() {
		if (!this.isBracketFrozen) return 'BracketNotFrozen';

		const matches: [TournamentPlayer, TournamentPlayer][] = [];
		this.treeRoot.traverse(node => {
			if (node.state !== 'available') return;
			const p1 = node.children![0].user!;
			const p2 = node.children![1].user!;
			if (!p1.isBusy && !p2.isBusy) {
				matches.push([p1, p2]);
			}
		});
		return matches;
	}
	setMatchResult([p1, p2]: [TournamentPlayer, TournamentPlayer], result: 'win' | 'loss', score: number[]) {
		if (!this.isBracketFrozen) return 'BracketNotFrozen';

		if (!['win', 'loss'].includes(result)) return 'InvalidMatchResult';

		if (!this.players.includes(p1) || !this.players.includes(p2)) return 'UserNotAdded';

		const targetNode = this.treeRoot.find(node => {
			if (node.state === 'available' && (
				node.children![0].user === p1 && node.children![1].user === p2
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

		const winner = targetNode.children[result === 'win' ? 0 : 1].user;
		const loser = targetNode.children[result === 'loss' ? 0 : 1].user;
		targetNode.user = winner;
		if (!winner || !loser) throw new Error(`invalid available state`);

		if (loser.losses === this.maxSubtrees) {
			loser.isEliminated = true;
			loser.unlinkUser();
		}

		if (targetNode.parent) {
			const userA = targetNode.parent.children![0].user;
			const userB = targetNode.parent.children![1].user;
			if (userA && userB) {
				targetNode.parent.state = 'available';

				let error: string | undefined = '';
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
			const newRoot = new ElimNode({state: 'available'});
			newRoot.setChildren([targetNode, new ElimNode({user: loser})]);
			this.treeRoot = newRoot;
		}

		if (targetNode.losersBracketNode) {
			targetNode.losersBracketNode.user = loser;
			const userA = targetNode.losersBracketNode.parent!.children![0].user;
			const userB = targetNode.losersBracketNode.parent!.children![1].user;
			if (userA && userB) {
				targetNode.losersBracketNode.parent!.state = 'available';

				let error: string | undefined = '';
				if (userA.isDisqualified) {
					error = this.setMatchResult([userA, userB], 'loss', [0, 1]);
				} else if (userB.isDisqualified) {
					error = this.setMatchResult([userA, userB], 'win', [1, 0]);
				}

				if (error) {
					throw new Error(`Unexpected ${error} from setMatchResult([${userA}, ${userB}], ...)`);
				}
			}
		}
	}

	isTournamentEnded() {
		return this.treeRoot.state === 'finished';
	}

	getResults() {
		if (!this.isTournamentEnded()) return 'TournamentNotEnded';

		const results = [];
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
