/**
 * Search
 *
 * Basically just an improved version of utilichart
 *
 * Dependencies: jQuery, battledata, search-index
 * Optional dependencies: pokedex, moves, items, abilities
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 */

(function (exports, $) {
	'use strict';

	function Search(elem, viewport) {
		this.$el = $(elem);
		this.el = this.$el[0];
		this.$viewport = (viewport ? $(viewport) : $(window));

		this.urlRoot = '';
		this.q = undefined; // uninitialized
		this.qType = '';
		this.defaultResultSet = null;
		this.legalityFilter = null;
		this.legalityLabel = "Illegal";
		this.exactMatch = false;

		this.resultSet = null;
		this.filters = null;
		this.sortCol = null;
		this.renderedIndex = 0;
		this.renderingDone = true;
		this.externalFilter = false;
		this.cur = {};
		this.$inputEl = null;
		this.gen = 7;
		this.isDoubles = false;

		var self = this;
		this.$el.on('click', '.more button', function (e) {
			e.preventDefault();
			self.updateScroll(true);
		});
		this.$el.on('click', '.filter', function (e) {
			e.preventDefault();
			self.removeFilter(e);
			if (self.$inputEl) self.$inputEl.focus();
		});
		this.$el.on('click', '.sortcol', function (e) {
			e.preventDefault();
			e.stopPropagation();
			var sortCol = e.currentTarget.dataset.sort;
			if (self.sortCol === sortCol) {
				self.sortCol = null;
			} else {
				self.sortCol = sortCol;
			}
			self.q = undefined;
			self.find('');
		});
	}

	Search.prototype.$ = function (query) {
		return this.$el.find(query);
	};

	//
	// Search functions
	//

	var typeTable = {
		pokemon: 1,
		type: 2,
		tier: 3,
		move: 4,
		item: 5,
		ability: 6,
		egggroup: 7,
		category: 8,
		article: 9
	};
	var typeName = {
		pokemon: 'Pok&eacute;mon',
		type: 'Type',
		tier: 'Tiers',
		move: 'Moves',
		item: 'Items',
		ability: 'Abilities',
		egggroup: 'Egg group',
		category: 'Category',
		article: 'Article'
	};
	Search.prototype.find = function (query) {
		query = toId(query);

		if (query === this.q) {
			return false;
		}
		this.q = query;
		this.resultSet = null;
		this.exactMatch = false;
		var qType = this.qType;

		if (!query) {
			// search field is blank, display default results

			if (!this.filters && !this.sortCol && this.defaultResultSet) {
				this.renderedIndex = 0;
				this.renderingDone = false;
				this.updateScroll();
				return true;
			}
			if (qType === 'pokemon') {
				this.allPokemon();
				return true;
			} else if (qType === 'move') {
				this.allMoves();
				return true;
			}
			this.el.innerHTML = '';
			return true;
		}

		// If qType exists, we're searching mainly for results of that type.
		// We'll still search for results of other types, but those results
		// will only be used to filter results for that type.
		var qTypeIndex = (qType ? typeTable[qType] : -1);

		var qFilterType = '';
		if (query.slice(-4) === 'type') {
			if ((query.charAt(0).toUpperCase() + query.slice(1, -4)) in window.BattleTypeChart) {
				query = query.slice(0, -4);
				qFilterType = 'type';
			}
		}

		// i represents the location of the search index we're looking
		var i = Search.getClosest(query);
		this.exactMatch = (BattleSearchIndex[i][0] === query);

		// Even with output buffer buckets, we make multiple passes through
		// the search index. searchPasses is a queue of which pass we're on:
		// [passType, i, query]

		// pass types:
		// 0 - no pass: time to pop the next pass off the searchPasses queue
		// 1 - normal pass: start at i and stop when results no longer start with query
		// 2 - alias pass: like normal, but output aliases instead of non-alias results
		// 3 - fuzzy match pass: start at i and stop when you have two results
		// 4 - exact pass: like normal, but stop at i

		// By doing an alias pass after the normal pass, we ensure that
		// mid-word matches only display after start matches.
		var passType = 0;
		var searchPasses = [[1, i, query]];

		// For performance reasons, only do an alias pass if query is at
		// least 2 chars long
		if (query.length > 1) searchPasses.push([2, i, query]);

		// If the query matches an official alias in BattleAliases: These are
		// different from the aliases in the search index and are given
		// higher priority. We'll do a normal pass through the index with
		// the alias text before any other passes.
		var queryAlias;
		if (query in BattleAliases) {
			if (['sub', 'tr'].includes(query) || toId(BattleAliases[query]).slice(0, query.length) !== query) {
				queryAlias = toId(BattleAliases[query]);
				var aliasPassType = (queryAlias === 'hiddenpower' ? 4 : 1);
				searchPasses.unshift([aliasPassType, Search.getClosest(queryAlias), queryAlias]);
			}
			this.exactMatch = true;
		}

		// If there are no matches starting with query: Do a fuzzy match pass
		// Fuzzy matches will still be shown after alias matches
		if (!this.exactMatch && BattleSearchIndex[i][0].substr(0, query.length) !== query) {
			// No results start with this. Do a fuzzy match pass.
			var matchLength = query.length - 1;
			if (!i) i++;
			while (matchLength &&
				BattleSearchIndex[i][0].substr(0, matchLength) !== query.substr(0, matchLength) &&
				BattleSearchIndex[i - 1][0].substr(0, matchLength) !== query.substr(0, matchLength)) {
				matchLength--;
			}
			var matchQuery = query.substr(0, matchLength);
			while (i >= 1 && BattleSearchIndex[i - 1][0].substr(0, matchLength) === matchQuery) i--;
			searchPasses.push([3, i, '']);
		}

		// We split the output buffers into 8 buckets.
		// Bucket 0 is usually unused, and buckets 1-7 represent
		// pokemon, types, moves, etc (see typeTable).

		// When we're done, the buffers are concatenated together to form
		// our resultSet, with each buffer getting its own header, unlike
		// multiple-pass results, which have no header.

		// Notes:
		// - if we have a qType, that qType's buffer will be on top
		var bufs = [[], [], [], [], [], [], [], [], [], []];
		var topbufIndex = -1;

		var count = 0;
		var nearMatch = false;

		var instafilter = null;
		var instafilterSort = [0, 1, 2, 5, 4, 3, 6, 7, 8];

		// We aren't actually looping through the entirety of the searchIndex
		for (i = 0; i < BattleSearchIndex.length; i++) {
			if (!passType) {
				var searchPass = searchPasses.shift();
				if (!searchPass) break;
				passType = searchPass[0];
				i = searchPass[1];
				query = searchPass[2];
			}

			var entry = BattleSearchIndex[i];
			var id = entry[0];
			var type = entry[1];

			if (!id) break;

			if (passType === 3) {
				// fuzzy match pass; stop after 2 results
				if (count >= 2) {
					passType = 0;
					continue;
				}
				nearMatch = true;
			} else if (passType === 4) {
				// exact pass; stop after 1 result
				if (count >= 1) {
					passType = 0;
					continue;
				}
			} else if (id.substr(0, query.length) !== query) {
				// regular pass, time to move onto our next match
				passType = 0;
				continue;
			}

			if (entry.length > 2) {
				// alias entry
				if (passType !== 2) continue;
			} else {
				// normal entry
				if (passType === 2) continue;
			}

			var typeIndex = typeTable[type];

			// For performance, with a query length of 1, we only fill the first bucket
			if (query.length === 1 && typeIndex !== (qType ? qTypeIndex : 1)) continue;

			// For pokemon queries, accept types/tier/abilities/moves/eggroups as filters
			if (qType === 'pokemon' && (typeIndex === 5 || typeIndex > 7)) continue;
			if (qType === 'pokemon' && typeIndex === 3 && this.gen < 7) continue;
			// For move queries, accept types/categories as filters
			if (qType === 'move' && ((typeIndex !== 8 && typeIndex > 4) || typeIndex === 3)) continue;
			// For move queries in the teambuilder, don't accept pokemon as filters
			if (qType === 'move' && this.legalityFilter && typeIndex === 1) continue;
			// For ability/item queries, don't accept anything else as a filter
			if ((qType === 'ability' || qType === 'item') && typeIndex !== qTypeIndex) continue;
			// Query was a type name followed 'type'; only show types
			if (qFilterType === 'type' && typeIndex !== 2) continue;
			// hardcode cases of duplicate non-consecutive aliases
			if ((id === 'megax' || id === 'megay') && 'mega'.startsWith(query)) continue;

			var matchStart = 0;
			var matchLength = 0;
			if (passType === 2) {
				// alias entry
				// [aliasid, type, originalid, matchStart, originalindex]
				matchStart = entry[3];
				var originalIndex = entry[2];
				if (matchStart) {
					matchLength = matchStart + query.length;
					matchStart += (BattleSearchIndexOffset[originalIndex][matchStart] || '0').charCodeAt(0) - 48;
					matchLength += (BattleSearchIndexOffset[originalIndex][matchLength - 1] || '0').charCodeAt(0) - 48 - matchStart;
				}
				id = BattleSearchIndex[originalIndex][0];
			} else {
				matchLength = query.length;
				if (matchLength) matchLength += (BattleSearchIndexOffset[i][matchLength - 1] || '0').charCodeAt(0) - 48;
			}

			// some aliases are substrings
			if (queryAlias === id && query !== id) continue;

			if (qType && qTypeIndex !== typeIndex) {
				// This is a filter, set it as an instafilter candidate
				if (!instafilter || instafilterSort[typeIndex] < instafilterSort[instafilter[2]]) {
					instafilter = [type, id, typeIndex];
				}
			}

			// show types above Arceus formes
			if (topbufIndex < 0 && qTypeIndex < 2 && passType === 2 && !bufs[1].length && bufs[2].length) topbufIndex = 2;

			if (this.legalityFilter && typeIndex === qTypeIndex) {
				// Always show illegal results under legal results.
				// This is done by putting legal results (and the type header)
				// in bucket 0, and illegal results in the qType's bucket.
				// qType buckets are always on top (but under bucket 0), so
				// illegal results will be seamlessly right under legal results.
				if (!bufs[typeIndex].length && !bufs[0].length) bufs[0] = [['header', typeName[type]]];
				if (id in this.legalityFilter) typeIndex = 0;
			} else {
				if (!bufs[typeIndex].length) bufs[typeIndex] = [['header', typeName[type]]];
			}

			// don't match duplicate aliases
			var curBufLength = (passType === 2 && bufs[typeIndex].length);
			if (curBufLength && bufs[typeIndex][curBufLength - 1][1] === id) continue;

			bufs[typeIndex].push([type, id, matchStart, matchLength]);

			count++;
		}

		var topbuf = [];
		if (nearMatch) topbuf = [['html', '<p><em>No exact match found. The closest matches alphabetically are:</em></p></li>']];
		if (this.filters && !this.externalFilter) {
			topbuf.push(['html', this.getFilterText(1)]);
		}
		if (topbufIndex >= 0) {
			topbuf = topbuf.concat(bufs[topbufIndex]);
			bufs[topbufIndex] = [];
		}
		if (qTypeIndex >= 0) {
			topbuf = topbuf.concat(bufs[0]);
			topbuf = topbuf.concat(bufs[qTypeIndex]);
			bufs[qTypeIndex] = [];
			bufs[0] = [];
		}

		if (instafilter && count < 20) {
			// Result count is less than 20, so we can instafilter
			bufs.push(this.instafilter(qType, instafilter[0], instafilter[1]));
		}

		this.resultSet = Array.prototype.concat.apply(topbuf, bufs);
		this.renderedIndex = 0;
		this.renderingDone = false;
		this.updateScroll();
		return true;
	};
	Search.prototype.instafilter = function (qType, fType, fId) {
		var buf = [];
		var illegalBuf = [];
		var legal = this.legalityFilter;
		if (qType === 'pokemon') {
			switch (fType) {
			case 'type':
				var type = fId.charAt(0).toUpperCase() + fId.slice(1);
				buf.push(['header', "" + type + "-type Pok&eacute;mon"]);
				for (var id in BattlePokedex) {
					if (!BattlePokedex[id].types) continue;
					if (BattlePokedex[id].types[0] === type || BattlePokedex[id].types[1] === type) {
						(legal && !(id in legal) ? illegalBuf : buf).push(['pokemon', id]);
					}
				}
				break;
			case 'ability':
				var ability = Dex.getAbility(fId).name;
				buf.push(['header', "" + ability + " Pok&eacute;mon"]);
				for (var id in BattlePokedex) {
					if (!BattlePokedex[id].abilities) continue;
					if (Dex.hasAbility(id, ability, this.gen)) {
						(legal && !(id in legal) ? illegalBuf : buf).push(['pokemon', id]);
					}
				}
				break;
			}
		} else if (qType === 'move') {
			switch (fType) {
			case 'type':
				var type = fId.charAt(0).toUpperCase() + fId.slice(1);
				buf.push(['header', "" + type + "-type moves"]);
				for (var id in BattleMovedex) {
					if (BattleMovedex[id].type === type) {
						(legal && !(id in legal) ? illegalBuf : buf).push(['move', id]);
					}
				}
				break;
			case 'category':
				var category = fId.charAt(0).toUpperCase() + fId.slice(1);
				buf.push(['header', "" + category + " moves"]);
				for (var id in BattleMovedex) {
					if (BattleMovedex[id].category === category) {
						(legal && !(id in legal) ? illegalBuf : buf).push(['move', id]);
					}
				}
				break;
			}
		}
		return buf.concat(illegalBuf);
	};
	Search.prototype.addFilter = function (node) {
		if (!node.dataset.entry) return;
		var entry = node.dataset.entry.split('|');
		if (this.qType === 'pokemon') {
			if (entry[0] === this.sortCol) this.sortCol = null;
			if (entry[0] !== 'type' && entry[0] !== 'move' && entry[0] !== 'ability' && entry[0] !== 'egggroup' && entry[0] !== 'tier') return;
			if (entry[0] === 'move') entry[1] = toId(entry[1]);
			if (!this.filters) this.filters = [];
			this.q = undefined;
			for (var i = 0; i < this.filters.length; i++) {
				if (this.filters[i][0] === entry[0] && this.filters[i][1] === entry[1]) {
					return true;
				}
			}
			this.filters.push(entry);
			return true;
		} else if (this.qType === 'move') {
			if (entry[0] === this.sortCol) this.sortCol = null;
			if (entry[0] !== 'type' && entry[0] !== 'category' && entry[0] !== 'pokemon') return;
			if (entry[0] === 'pokemon') entry[1] = toId(entry[1]);
			if (!this.filters) this.filters = [];
			this.filters.push(entry);
			this.q = undefined;
			return true;
		}
	};
	Search.prototype.removeFilter = function (e) {
		if (!this.filters) return;
		if (e) {
			// delete filter
			for (var i = 0; i < this.filters.length; i++) {
				if (e.currentTarget.value === this.filters[i].join(':')) {
					this.filters.splice(i, 1);
					if (!this.filters.length) this.filters = null;
					this.q = undefined;
					this.find('');
					break;
				}
			}
			return;
		}
		this.filters.pop();
		if (!this.filters.length) this.filters = null;
		this.q = undefined;
		return true;
	};
	Search.prototype.allPokemon = function () {
		if (this.filters || this.sortCol) return this.filteredPokemon();
		var resultSet = [['sortpokemon', '']];
		for (var id in BattlePokedex) {
			switch (id) {
			case 'bulbasaur':
				resultSet.push(['header', "Generation 1"]);
				break;
			case 'chikorita':
				resultSet.push(['header', "Generation 2"]);
				break;
			case 'treecko':
				resultSet.push(['header', "Generation 3"]);
				break;
			case 'turtwig':
				resultSet.push(['header', "Generation 4"]);
				break;
			case 'victini':
				resultSet.push(['header', "Generation 5"]);
				break;
			case 'chespin':
				resultSet.push(['header', "Generation 6"]);
				break;
			case 'rowlet':
				resultSet.push(['header', "Generation 7"]);
				break;
			case 'missingno':
				resultSet.push(['header', "Glitch"]);
				break;
			case 'tomohawk':
				resultSet.push(['header', "CAP"]);
				break;
			case 'pikachucosplay':
				continue;
			}
			resultSet.push(['pokemon', id]);
		}
		this.resultSet = resultSet;
		this.renderedIndex = 0;
		this.renderingDone = false;
		this.updateScroll();
	};
	Search.prototype.allMoves = function () {
		if (this.filters || this.sortCol) return this.filteredMoves();
		var resultSet = [['sortmove', '']];
		resultSet.push(['header', "Moves"]);
		for (var id in BattleMovedex) {
			switch (id) {
			case 'paleowave':
				resultSet.push(['header', "CAP moves"]);
				break;
			case 'magikarpsrevenge':
				continue;
			}
			resultSet.push(['move', id]);
		}
		this.resultSet = resultSet;
		this.renderedIndex = 0;
		this.renderingDone = false;
		this.updateScroll();
	};
	Search.prototype.allTypes = function (resultSet) {
		if (!resultSet) resultSet = [];
		for (var id in window.BattleTypeChart) {
			resultSet.push(['type', id]);
		}
		this.resultSet = resultSet;
		this.renderedIndex = 0;
		this.renderingDone = false;
		this.updateScroll();
	};
	Search.prototype.allAbilities = function (resultSet) {
		if (!resultSet) resultSet = [];
		for (var id in BattleAbilities) {
			resultSet.push(['ability', id]);
		}
		this.resultSet = resultSet;
		this.renderedIndex = 0;
		this.renderingDone = false;
		this.updateScroll();
	};
	Search.prototype.allCategories = function (resultSet) {
		if (!resultSet) resultSet = [];
		resultSet.push(['category', 'physical']);
		resultSet.push(['category', 'special']);
		resultSet.push(['category', 'status']);
		this.resultSet = resultSet;
		this.renderedIndex = 0;
		this.renderingDone = false;
		this.updateScroll();
	};
	Search.prototype.getFilterText = function (q) {
		var buf = '<p>Filters: ';
		for (var i = 0; i < this.filters.length; i++) {
			var text = this.filters[i][1];
			if (this.filters[i][0] === 'move') text = Dex.getMove(text).name;
			if (this.filters[i][0] === 'pokemon') text = Dex.getTemplate(text).name;
			buf += '<button class="filter" value="' + BattleLog.escapeHTML(this.filters[i].join(':')) + '">' + text + ' <i class="fa fa-times-circle"></i></button> ';
		}
		if (!q) buf += '<small style="color: #888">(backspace = delete filter)</small>';
		return buf + '</p>';
	};
	Search.prototype.filteredPokemon = function () {
		var resultSet = [];
		var filters = this.filters || [];
		var sortCol = this.sortCol;

		this.resultSet = [['sortpokemon', '']];
		if (filters.length) {
			if (!this.externalFilter) this.resultSet.push(['html', this.getFilterText()]);
			this.resultSet.push(['header', "Filtered results"]);
		}
		if (sortCol === 'type') {
			return this.allTypes(this.resultSet);
		} else if (sortCol === 'ability') {
			return this.allAbilities(this.resultSet);
		}

		var illegalResultSet = [];
		var genChar = '' + this.gen;
		for (var id in BattlePokedex) {
			var template = BattlePokedex[id];
			if (template.exists === false) continue;
			for (var i = 0; i < filters.length; i++) {
				if (filters[i][0] === 'type') {
					var type = filters[i][1];
					if (template.types[0] !== type && template.types[1] !== type) break;
				} else if (filters[i][0] === 'egggroup') {
					var egggroup = filters[i][1];
					if (!template.eggGroups) continue;
					if (template.eggGroups[0] !== egggroup && template.eggGroups[1] !== egggroup) break;
				} else if (filters[i][0] === 'tier') {
					var tier = filters[i][1];
					if (template.tier !== tier) break;
				} else if (filters[i][0] === 'ability') {
					var ability = filters[i][1];
					if (!Dex.hasAbility(id, ability, this.gen)) break;
				} else if (filters[i][0] === 'move') {
					var learned = false;
					var learnsetid = this.nextLearnsetid(id);
					while (learnsetid) {
						var learnset = BattleTeambuilderTable.learnsets[learnsetid];
						if (learnset && (filters[i][1] in learnset) && learnset[filters[i][1]].indexOf(genChar) >= 0) {
							learned = true;
							break;
						}
						learnsetid = this.nextLearnsetid(learnsetid, id);
					}
					if (!learned) break;
				}
			}
			if (i < filters.length) continue;
			if (this.legalityFilter && !(id in this.legalityFilter)) {
				if (!sortCol) illegalResultSet.push(['pokemon', id]);
			} else {
				resultSet.push(['pokemon', id]);
			}
		}
		if (sortCol === 'hp' || sortCol === 'atk' || sortCol === 'def' || sortCol === 'spa' || sortCol === 'spd' || sortCol === 'spe') {
			resultSet = resultSet.sort(function (row1, row2) {
				var stat1 = BattlePokedex[row1[1]].baseStats[sortCol];
				var stat2 = BattlePokedex[row2[1]].baseStats[sortCol];
				return stat2 - stat1;
			});
		} else if (sortCol === 'bst') {
			resultSet = resultSet.sort(function (row1, row2) {
				var base1 = BattlePokedex[row1[1]].baseStats;
				var base2 = BattlePokedex[row2[1]].baseStats;
				var bst1 = base1.hp + base1.atk + base1.def + base1.spa + base1.spd + base1.spe;
				var bst2 = base2.hp + base2.atk + base2.def + base2.spa + base2.spd + base2.spe;
				return bst2 - bst1;
			});
		} else if (sortCol === 'name') {
			resultSet = resultSet.sort(function (row1, row2) {
				var name1 = row1[1];
				var name2 = row2[1];
				return name1 < name2 ? -1 : name1 > name2 ? 1 : 0;
			});
		}
		this.resultSet = this.resultSet.concat(resultSet, illegalResultSet);
		this.renderedIndex = 0;
		this.renderingDone = false;
		this.updateScroll();
	};
	Search.prototype.nextLearnsetid = function (learnsetid, speciesid) {
		if (!speciesid) {
			if (learnsetid in BattleTeambuilderTable.learnsets) return learnsetid;
			var baseLearnsetid = BattlePokedex[learnsetid] && toId(BattlePokedex[learnsetid].baseSpecies);
			if (!baseLearnsetid) {
				baseLearnsetid = toId(BattleAliases[learnsetid]);
			}
			if (baseLearnsetid in BattleTeambuilderTable.learnsets) return baseLearnsetid;
			return '';
		}

		if (learnsetid === 'lycanrocdusk' || (speciesid === 'rockruff' && learnsetid === 'rockruff')) return 'rockruffdusk';
		var template = BattlePokedex[learnsetid];
		if (!template) return '';
		if (template.prevo) return template.prevo;
		var baseSpecies = template.baseSpecies;
		if (baseSpecies !== template.species && (baseSpecies === 'Rotom' || baseSpecies === 'Pumpkaboo')) {
			return toId(template.baseSpecies);
		}
		return '';
	};
	Search.prototype.filteredMoves = function () {
		var resultSet = [];
		var filters = this.filters || [];
		var sortCol = this.sortCol;

		this.resultSet = [['sortmove', '']];
		if (filters.length) {
			if (!this.externalFilter) this.resultSet.push(['html', this.getFilterText()]);
			this.resultSet.push(['header', "Filtered results"]);
		}
		if (sortCol === 'type') {
			return this.allTypes(this.resultSet);
		} else if (sortCol === 'category') {
			return this.allCategories(this.resultSet);
		}

		var illegalResultSet = [];
		for (var id in BattleMovedex) {
			var move = BattleMovedex[id];
			if (move.exists === false) continue;
			for (var i = 0; i < filters.length; i++) {
				if (filters[i][0] === 'type') {
					if (move.type !== filters[i][1]) break;
				} else if (filters[i][0] === 'category') {
					if (move.category !== filters[i][1]) break;
				} else if (filters[i][0] === 'pokemon') {
					var learned = false;
					var speciesid = filters[i][1];
					var learnsetid = this.nextLearnsetid(speciesid);
					while (learnsetid) {
						var learnset = BattleTeambuilderTable.learnsets[learnsetid];
						if (learnset && (id in learnset)) {
							learned = true;
							break;
						}
						learnsetid = this.nextLearnsetid(learnsetid, speciesid);
					}
					if (!learned) break;
				}
			}
			if (i < filters.length) continue;
			if (this.legalityFilter && !(id in this.legalityFilter)) {
				if (!sortCol) illegalResultSet.push(['move', id]);
			} else {
				resultSet.push(['move', id]);
			}
		}
		if (sortCol === 'power') {
			var powerTable = {"return": 102, frustration: 102, spitup: 300, trumpcard: 200, naturalgift: 80, grassknot: 120, lowkick: 120, gyroball: 150, electroball: 150, flail: 200, reversal: 200, present: 120, wringout: 120, crushgrip: 120, heatcrash: 120, heavyslam: 120, fling: 130, magnitude: 150, beatup: 24, punishment: 1020, psywave: 1250, nightshade: 1200, seismictoss: 1200, dragonrage: 1140, sonicboom: 1120, superfang: 1350, endeavor: 1399, sheercold: 1501, fissure: 1500, horndrill: 1500, guillotine: 1500};
			resultSet = resultSet.sort(function (row1, row2) {
				var move1 = BattleMovedex[row1[1]];
				var move2 = BattleMovedex[row2[1]];
				var pow1 = move1.basePower || powerTable[row1[1]] || (move1.category === 'Status' ? -1 : 1400);
				var pow2 = move2.basePower || powerTable[row2[1]] || (move2.category === 'Status' ? -1 : 1400);
				return pow2 - pow1;
			});
		} else if (sortCol === 'accuracy') {
			resultSet = resultSet.sort(function (row1, row2) {
				var accuracy1 = BattleMovedex[row1[1]].accuracy || 0;
				var accuracy2 = BattleMovedex[row2[1]].accuracy || 0;
				if (accuracy1 === true) accuracy1 = 101;
				if (accuracy2 === true) accuracy2 = 101;
				return accuracy2 - accuracy1;
			});
		} else if (sortCol === 'pp') {
			resultSet = resultSet.sort(function (row1, row2) {
				var pp1 = BattleMovedex[row1[1]].pp || 0;
				var pp2 = BattleMovedex[row2[1]].pp || 0;
				return pp2 - pp1;
			});
		}
		this.resultSet = this.resultSet.concat(resultSet, illegalResultSet);
		this.renderedIndex = 0;
		this.renderingDone = false;
		this.updateScroll();
	};
	Search.prototype.updateScroll = function (forceAdd) {
		if (this.renderingDone) return;
		var top = this.$viewport.scrollTop();
		var bottom = top + this.$viewport.height();
		var windowHeight = $(window).height();
		var i = this.renderedIndex;
		var finalIndex = Math.floor(bottom / 33) + 1;
		if (!forceAdd && finalIndex <= i) return;
		if (finalIndex < i + 20) finalIndex = i + 20;
		if (bottom - top > windowHeight && !i) finalIndex = 20;
		if (forceAdd && finalIndex > i + 40) finalIndex = i + 40;

		var resultSet = this.resultSet || this.defaultResultSet;
		var buf = '';
		while (i < finalIndex) {
			if (!resultSet[i]) {
				this.renderingDone = true;
				break;
			}
			var row = resultSet[i];

			var errorMessage = '';
			if (this.qType && row[0] !== 'header' && row[0] !== 'html' && this.qType !== row[0]) {
				errorMessage = '<span class="col filtercol"><em>Filter</em></span>';
			} else if (this.legalityFilter && !(row[1] in this.legalityFilter)) {
				errorMessage = '<span class="col illegalcol"><em>' + this.legalityLabel + '</em></span>';
			}

			var mStart = 0;
			var mEnd = 0;
			if (row.length > 3) {
				mStart = row[2];
				mEnd = row[3];
			}
			buf += this.renderRow(row[1], row[0], mStart, mEnd, errorMessage, row[1] in this.cur ? ' class="cur"' : '');

			i++;
		}
		if (!this.renderedIndex) {
			this.el.innerHTML = '<ul class="utilichart" style="height:' + (resultSet.length * 33) + 'px">' + buf + (!this.renderingDone ? '<li class="result more"><p><button class="button big">More</button></p></li>' : '') + '</ul>';
			this.moreVisible = true;
		} else {
			if (this.moreVisible) {
				this.$el.find('.more').remove();
				if (!forceAdd) this.moreVisible = false;
			}
			$(this.el.firstChild).append(buf + (forceAdd && !this.renderingDone ? '<li class="result more"><p><button class="button big">More</button></p></li>' : ''));
		}
		this.renderedIndex = i;
	};
	Search.prototype.setType = function (qType, format, set, cur) {
		if (!format) format = '';
		if (this.qType !== qType) {
			this.filters = null;
			this.sortCol = null;
		}
		this.qType = qType;
		this.q = undefined;
		this.cur = cur || {};
		this.legalityFilter = {};
		this.legalityLabel = "Illegal";
		this.gen = 6;
		if (format.slice(0, 3) === 'gen') {
			this.gen = (Number(format.charAt(3)) || 6);
			format = format.slice(4);
		} else if (!format) {
			this.gen = 7;
		}
		if (format.includes('doubles')) this.isDoubles = true;
		var isLetsGo = format.startsWith('letsgo');
		if (isLetsGo) format = format.slice(6);
		var requirePentagon = (format === 'battlespotsingles' || format === 'battledoubles' || format.slice(0, 3) === 'vgc');
		var template;
		var isBH = (format === 'balancedhackmons' || format === 'bh');
		this.resultSet = null;
		this.defaultResultSet = null;

		switch (qType) {
		case 'pokemon':
			var table = BattleTeambuilderTable;
			var isDoublesOrBS = false;
			if (format.endsWith('cap') || format.endsWith('caplc')) {
				// CAP formats always use the singles table
				if (this.gen < 7) {
					table = table['gen' + this.gen];
				}
			} else if (this.gen === 7 && requirePentagon) {
				table = table['gen' + this.gen + 'vgc'];
				isDoublesOrBS = true;
			} else if (table['gen' + this.gen + 'doubles'] && (format.includes('doubles') || format.includes('vgc') || format.includes('triples') || format.endsWith('lc') || format.endsWith('lcuu')) && !isLetsGo) {
				table = table['gen' + this.gen + 'doubles'];
				isDoublesOrBS = true;
			} else if (this.gen < 7) {
				table = table['gen' + this.gen];
			} else if (isLetsGo) {
				table = table['letsgo'];
			}

			if (!table.tierSet) {
				table.tierSet = table.tiers.map(function (r) {
					if (typeof r === 'string') return ['pokemon', r];
					return [r[0], r[1]];
				});
				table.tiers = null;
			}
			var tierSet = table.tierSet;
			var slices = table.formatSlices;
			var agTierSet = [];
			if (this.gen >= 6) agTierSet = [['header', "AG"], ['pokemon', 'rayquazamega']];
			if (format === 'ubers' || format === 'uber') tierSet = tierSet.slice(slices.Uber);
			else if (format === 'vgc2017') tierSet = tierSet.slice(slices.Regular);
			else if (format === 'vgc2018') tierSet = tierSet.slice(slices.Regular);
			else if (format.startsWith('vgc2019')) tierSet = tierSet.slice(slices["Restricted Legendary"]);
			else if (format === 'battlespotsingles') tierSet = tierSet.slice(slices.Regular);
			else if (format === 'battlespotdoubles') tierSet = tierSet.slice(slices.Regular);
			else if (format === 'ou') tierSet = tierSet.slice(slices.OU);
			else if (format === 'uu') tierSet = tierSet.slice(slices.UU);
			else if (format === 'ru') tierSet = tierSet.slice(slices.RU || slices.UU);
			else if (format === 'nu') tierSet = tierSet.slice(slices.NU);
			else if (format === 'pu') tierSet = tierSet.slice(slices.PU || slices.NU);
			else if (format === 'zu') tierSet = tierSet.slice(slices.ZU || slices.PU || slices.NU);
			else if (format === 'lc' || format === 'lcuu') tierSet = tierSet.slice(slices.LC);
			else if (format === 'cap') tierSet = tierSet.slice(0, slices.Uber).concat(tierSet.slice(slices.OU));
			else if (format === 'caplc') tierSet = tierSet.slice(slices['CAP LC'], slices.Uber).concat(tierSet.slice(slices.LC));
			else if (format === 'anythinggoes' || format === 'ag') tierSet = agTierSet.concat(tierSet.slice(slices.Uber));
			else if (format === 'balancedhackmons' || format === 'bh') tierSet = agTierSet.concat(tierSet.slice(slices.Uber));
			else if (format === 'doublesou') tierSet = tierSet.slice(slices.DOU);
			else if (format === 'doublesuu') tierSet = tierSet.slice(slices.DUU);
			else if (format === 'doublesnu') tierSet = tierSet.slice(slices.Untiered || slices.DUU);
			else if (isLetsGo) tierSet = tierSet.slice(slices.Uber);
			// else if (isDoublesOrBS) tierSet = tierSet;
			else if (!isDoublesOrBS) tierSet = tierSet.slice(slices.OU, slices.UU).concat(agTierSet).concat(tierSet.slice(slices.Uber, slices.OU)).concat(tierSet.slice(slices.UU));

			if (format === 'vgc2016') {
				tierSet = tierSet.filter(function (r) {
					var banned = {deoxys:1, deoxysattack:1, deoxysdefense:1, deoxysspeed:1, mew:1, celebi:1, shaymin:1, shayminsky:1, darkrai:1, victini:1, keldeo:1, keldeoresolute:1, meloetta:1, arceus:1, genesect:1, jirachi:1, manaphy:1, phione:1, hoopa:1, hoopaunbound:1, diancie:1, dianciemega:1};
					if (r[1] in banned || r[1].substr(0, 6) === 'arceus') return false;
					return true;
				});
			}

			this.defaultResultSet = tierSet;
			this.legalityLabel = "Banned";
			break;

		case 'item':
			var table = BattleTeambuilderTable;
			if (this.gen < 7) table = table['gen' + this.gen];
			if (!table.itemSet) {
				table.itemSet = table.items.map(function (r) {
					if (typeof r === 'string') return ['item', r];
					return [r[0], r[1]];
				});
				table.items = null;
			}
			this.defaultResultSet = table.itemSet;
			break;

		case 'ability':
			template = Dex.getTemplate(set.species);
			var abilitySet = [['header', "Abilities"]];
			if (template.isMega) {
				abilitySet.unshift(['html', '<p>Will be <strong>' + BattleLog.escapeHTML(template.abilities['0']) + '</strong> after Mega Evolving.</p>']);
				template = Dex.getTemplate(template.baseSpecies);
			}
			var abilitiesInThisGen = Dex.getAbilitiesFor(template.id, this.gen);
			abilitySet.push(['ability', toId(abilitiesInThisGen['0'])]);
			if (abilitiesInThisGen['1']) {
				abilitySet.push(['ability', toId(abilitiesInThisGen['1'])]);
			}
			if (abilitiesInThisGen['H']) {
				abilitySet.push(['header', "Hidden Ability"]);
				abilitySet.push(['ability', toId(abilitiesInThisGen['H'])]);
			}
			if (abilitiesInThisGen['S']) {
				abilitySet.push(['header', "Special Event Ability"]);
				abilitySet.push(['ability', toId(abilitiesInThisGen['S'])]);
			}
			if (format === 'almostanyability' || isBH) {
				template = Dex.getTemplate(set.species);
				var abilities = [];
				if (template.isMega) {
					if (format === 'almostanyability') abilitySet.unshift(['html', '<p>Will be <strong>' + BattleLog.escapeHTML(template.abilities['0']) + '</strong> after Mega Evolving.</p>']);
					// template is unused after this, so no need to replace
				}
				for (var i in BattleAbilities) {
					if (BattleAbilities[i].isNonstandard) continue;
					if (BattleAbilities[i].gen > this.gen) continue;
					abilities.push(i);
				}

				abilities.sort();

				var goodAbilities = [['header', "Abilities"]];
				var poorAbilities = [['header', "Situational Abilities"]];
				var badAbilities = [['header', "Unviable Abilities"]];
				for (var i = 0; i < abilities.length; i++) {
					var id = abilities[i];
					var rating = BattleAbilities[id] && BattleAbilities[id].rating;
					if (id === 'normalize') rating = 3;
					if (rating >= 3) {
						goodAbilities.push(['ability', id]);
					} else if (rating >= 2) {
						poorAbilities.push(['ability', id]);
					} else {
						badAbilities.push(['ability', id]);
					}
				}
				abilitySet = goodAbilities.concat(poorAbilities).concat(badAbilities);
			}
			this.defaultResultSet = abilitySet;
			break;

		case 'move':
			template = Dex.getTemplate(set.species);
			var learnsetid = this.nextLearnsetid(template.id);
			var moves = [];
			var sMoves = [];
			var sketch = false;
			var gen = '' + this.gen;
			while (learnsetid) {
				var learnset = BattleTeambuilderTable.learnsets[learnsetid];
				if (isLetsGo) learnset = BattleTeambuilderTable['letsgo'].learnsets[learnsetid];
				if (learnset) {
					for (var moveid in learnset) {
						var learnsetEntry = learnset[moveid];
						/* if (requirePentagon && learnsetEntry.indexOf('p') < 0) {
							continue;
						} else */ if (learnsetEntry.indexOf(gen) < 0) {
							continue;
						}
						if (moves.indexOf(moveid) >= 0) continue;
						moves.push(moveid);
						if (moveid === 'sketch') sketch = true;
						if (moveid === 'hiddenpower') {
							moves.push('hiddenpowerbug', 'hiddenpowerdark', 'hiddenpowerdragon', 'hiddenpowerelectric', 'hiddenpowerfighting', 'hiddenpowerfire', 'hiddenpowerflying', 'hiddenpowerghost', 'hiddenpowergrass', 'hiddenpowerground', 'hiddenpowerice', 'hiddenpowerpoison', 'hiddenpowerpsychic', 'hiddenpowerrock', 'hiddenpowersteel', 'hiddenpowerwater');
						}
					}
				}
				learnsetid = this.nextLearnsetid(learnsetid, template.id);
			}
			if (sketch || isBH) {
				if (isBH) moves = [];
				for (var i in BattleMovedex) {
					if (i === 'chatter' && !isBH) continue;
					if (i === 'magikarpsrevenge') continue;
					if ((format.substr(0, 3) !== 'cap' && (i === 'paleowave' || i === 'shadowstrike'))) continue;
					if (!BattleMovedex[i].gen) {
						if (BattleMovedex[i].num >= 622) {
							BattleMovedex[i].gen = 7;
						} else if (BattleMovedex[i].num >= 560) {
							BattleMovedex[i].gen = 6;
						} else if (BattleMovedex[i].num >= 468) {
							BattleMovedex[i].gen = 5;
						} else if (BattleMovedex[i].num >= 355) {
							BattleMovedex[i].gen = 4;
						} else if (BattleMovedex[i].num >= 252) {
							BattleMovedex[i].gen = 3;
						} else if (BattleMovedex[i].num >= 166) {
							BattleMovedex[i].gen = 2;
						} else if (BattleMovedex[i].num >= 1) {
							BattleMovedex[i].gen = 1;
						} else {
							BattleMovedex[i].gen = 0;
						}
					}
					if (BattleMovedex[i].gen > this.gen) continue;
					if (BattleMovedex[i].isZ) continue;
					if (isBH) {
						moves.push(i);
					} else {
						sMoves.push(i);
					}
				}
			}
			if (format === 'stabmons') {
				for (var i in BattleMovedex) {
					var types = [];
					var baseTemplate = Dex.getTemplate(template.baseSpecies);
					for (var j = 0; j < template.types.length; j++) {
						if (template.battleOnly) continue;
						types.push(template.types[j]);
					}
					if (template.prevo) {
						for (var j = 0; j < Dex.getTemplate(template.prevo).types.length; j++) {
							types.push(Dex.getTemplate(template.prevo).types[j]);
						}
					}
					if (Dex.getTemplate(template.prevo).prevo) {
						for (var j = 0; j < Dex.getTemplate(Dex.getTemplate(template.prevo).prevo).types.length; j++) {
							types.push(Dex.getTemplate(Dex.getTemplate(template.prevo).prevo).types[j]);
						}
					}
					if (template.battleOnly) template = baseTemplate;
					if (baseTemplate.otherFormes) {
						for (var j = 0; j < baseTemplate.types.length; j++) {
							if (template.forme === 'Alola' || template.forme === 'Alola-Totem' || template.baseSpecies === 'Wormadam') continue;
							types.push(baseTemplate.types[j]);
						}
						for (var j = 0; j < baseTemplate.otherFormes.length; j++) {
							var forme = Dex.getTemplate(baseTemplate.otherFormes[j]);
							for (var h = 0; h < forme.types.length; h++) {
								if (forme.battleOnly || forme.forme === 'Alola' || forme.forme === 'Alola-Totem' || forme.baseSpecies === 'Wormadam') continue;
								types.push(forme.types[h]);
							}
						}
					}
					if (types.indexOf(BattleMovedex[i].type) < 0) continue;
					if (moves.indexOf(i) >= 0) continue;
					if (!BattleMovedex[i].gen) {
						if (BattleMovedex[i].num >= 622) {
							BattleMovedex[i].gen = 7;
						} else if (BattleMovedex[i].num >= 560) {
							BattleMovedex[i].gen = 6;
						} else if (BattleMovedex[i].num >= 468) {
							BattleMovedex[i].gen = 5;
						} else if (BattleMovedex[i].num >= 355) {
							BattleMovedex[i].gen = 4;
						} else if (BattleMovedex[i].num >= 252) {
							BattleMovedex[i].gen = 3;
						} else if (BattleMovedex[i].num >= 166) {
							BattleMovedex[i].gen = 2;
						} else if (BattleMovedex[i].num >= 1) {
							BattleMovedex[i].gen = 1;
						} else {
							BattleMovedex[i].gen = 0;
						}
					}
					if (BattleMovedex[i].gen > this.gen) continue;
					if (BattleMovedex[i].isZ || BattleMovedex[i].isNonstandard || BattleMovedex[i].isUnreleased) continue;
					moves.push(i);
				}
			}

			moves.sort();
			sMoves.sort();

			var usableMoves = [];
			var uselessMoves = [];
			var sketchedMoves = [];
			for (var i = 0; i < moves.length; i++) {
				var id = moves[i];
				var isViable = BattleMovedex[id] && BattleMovedex[id].isViable;
				if (id === 'aerialace') isViable = (toId(set.species) in {scyther:1, aerodactylmega:1, kricketune:1});
				if (id === 'ancientpower') isViable = (toId(set.ability) === 'technician' || (toId(set.ability) === 'serenegrace') || (template.types.indexOf('rock') > 0 && moves.indexOf('powergem') < 0));
				if (id === 'bellydrum') isViable = (toId(set.species) in {azumarill:1, linoone:1, slurpuff:1});
				if (id === 'blizzard') isViable = (toId(set.ability) === 'snowwarning');
				if (id === 'counter') isViable = (toId(set.species) in {chansey:1, skarmory:1, clefable:1, wobbuffet:1, alakazam:1});
				if (id === 'curse') isViable = (toId(set.species) === 'snorlax');
				if (id === 'drainingkiss') isViable = (toId(set.ability) === 'triage');
				if (id === 'dynamicpunch') isViable = (toId(set.ability) === 'noguard');
				if (id === 'electroball') isViable = (toId(set.ability) === 'surgesurfer');
				if (id === 'gyroball') isViable = (template.baseStats.spe <= 60);
				if (id === 'headbutt') isViable = (toId(set.ability) === 'serenegrace' && template.types.indexOf('normal') > 0);
				if (id === 'heartswap') isViable = (toId(set.species) === 'magearna');
				if (id === 'hiddenpowerelectric') isViable = (moves.indexOf('thunderbolt') < 0);
				if (id === 'hiddenpowerfighting') isViable = (moves.indexOf('aurasphere') < 0 && moves.indexOf('focusblast') < 0);
				if (id === 'hiddenpowerfire') isViable = (moves.indexOf('flamethrower') < 0);
				if (id === 'hiddenpowergrass') isViable = (moves.indexOf('energyball') < 0 && moves.indexOf('gigadrain') < 0);
				if (id === 'hiddenpowerice') isViable = (moves.indexOf('icebeam') < 0 && template.id !== 'xerneas');
				if (id === 'hypnosis') isViable = ((this.gen < 4 && moves.indexOf('sleeppowder') < 0) || (toId(set.species) === 'darkrai'));
				if (id === 'icywind') isViable = (toId(set.species).substr(0, 6) === 'keldeo');
				if (id === 'infestation') isViable = (toId(set.species) === 'shuckle');
				if (id === 'irontail') isViable = ((template.types.indexOf('steel') > 0 && moves.indexOf('ironhead') < 0) || ((template.types.indexOf('dark') > 0 || template.types.indexOf('dragon') > 0) && moves.indexOf('ironhead') < 0 && moves.indexOf('gunkshot') < 0));
				if (id === 'jumpkick') isViable = (moves.indexOf('highjumpkick') < 0);
				if (id === 'leechlife') isViable = (this.gen > 6);
				if (id === 'petaldance') isViable = (toId(set.ability) === 'owntempo');
				if (id === 'reflecttype') isViable = (toId(set.species) in {latias:1, starmie:1});
				if (id === 'rocktomb') isViable = (toId(set.species) === 'groudon' || toId(set.ability) === 'technician');
				if (id === 'selfdestruct') isViable = (this.gen < 5 && moves.indexOf('explosion') < 0);
				if (id === 'skyattack') isViable = (toId(set.species) === 'hawlucha');
				if (id === 'smackdown') isViable = (template.types.indexOf('ground') > 0);
				if (id === 'smartstrike') isViable = (template.types.indexOf('steel') > 0 && moves.indexOf('ironhead') < 0);
				if (id === 'solarbeam') isViable = (toId(set.abilities) in {drought:1, chlorophyll:1});
				if (id === 'stompingtantrum') isViable = ((moves.indexOf('earthquake') < 0 && moves.indexOf('drillrun') < 0) || (toId(set.ability) === 'toughclaws' && moves.indexOf('drillrun') < 0 && moves.indexOf('earthquake') < 0));
				if (id === 'storedpower') isViable = (toId(set.species) in {necrozma:1, espeon:1, sigilyph:1});
				if (id === 'stunspore') isViable = (moves.indexOf('thunderwave') < 0);
				if (id === 'thunder') isViable = (toId(set.ability) === 'drizzle' || (toId(set.ability) === 'primordialsea') || (toId(set.species) === 'xerneas'));
				if (id === 'trickroom') isViable = (template.baseStats.spe <= 100);
				if (id === 'waterpulse') isViable = (toId(set.ability) === 'megalauncher' && moves.indexOf('originpulse') < 0);
				if (format === 'mixandmega') {
					if (id === 'blizzard') isViable = (toId(set.item) === 'abomasite' || toId(set.item) === 'pidgeotite');
					if (id === 'feint') isViable = (toId(set.species) === 'weavile');
					if (id === 'grasswhistle') isViable = (toId(set.item) === 'pidgeotite');
					if (id === 'hypnosis') isViable = (toId(set.item) === 'pidgeotite');
					if (id === 'inferno') isViable = (toId(set.item) === 'pidgeotite' && moves.indexOf('fireblast') < 0);
					if (id === 'sing') isViable = (toId(set.item) === 'pidgeotite');
					if (id === 'thunder') isViable = (toId(set.item) === 'pidgeotite' && moves.indexOf('zapcannon') < 0);
					if (id === 'waterpulse') isViable = (toId(set.item) === 'blastoisinite' && moves.indexOf('originpulse') < 0);
					if (id === 'weatherball') isViable = (toId(set.item) === 'redorb');
					if (id === 'zapcannon') isViable = (toId(set.item) === 'pidgeotite');
				}
				if (isLetsGo) {
					if (id === 'megadrain') isViable = true;
				}
				if (this.gen === 1) {
					// Usually viable for Gen 1
					if (id === 'acidarmor' || id === 'amnesia' || id === 'barrier' || id === 'bind' || id === 'clamp' || id === 'confuseray' || id === 'counter' || id === 'firespin' || id === 'hyperbeam' || id === 'mirrormove' || id === 'pinmissile' || id === 'razorleaf' || id === 'sing' || id === 'slash' || id === 'sludge' || id === 'twineedle' || id === 'wrap') isViable = true;

					// Usually not viable for Gen 1
					if (id === 'disable' || id === 'firepunch' || id === 'icepunch' || id === 'leechseed' || id === 'quickattack' || id === 'roar' || id === 'thunderpunch' || id === 'toxic' || id === 'triattack' || id === 'whirlwind') isViable = false;

					// Viable only when certain moves aren't present
					if (id === 'bubblebeam') isViable = ((moves.indexOf('surf') < 0 && moves.indexOf('blizzard') < 0));
					if (id === 'doubleedge') isViable = (moves.indexOf('bodyslam') < 0);
					if (id === 'doublekick') isViable = (moves.indexOf('submission') < 0);
					if (id === 'megadrain') isViable = (moves.indexOf('razorleaf') < 0 && moves.indexOf('surf') < 0);
					if (id === 'megakick') isViable = (moves.indexOf('hyperbeam') < 0);
					if (id === 'reflect') isViable = (moves.indexOf('barrier') < 0 && moves.indexOf('acidarmor') < 0);
					if (id === 'submission') isViable = (moves.indexOf('highjumpkick') < 0);
				}
				if (isViable) {
					if (!usableMoves.length) usableMoves.push(['header', "Moves"]);
					usableMoves.push(['move', id]);
				} else {
					if (!uselessMoves.length) uselessMoves.push(['header', "Usually useless moves"]);
					uselessMoves.push(['move', id]);
				}
			}
			for (var i = 0; i < sMoves.length; i++) {
				var id = sMoves[i];
				if (!sketchedMoves.length) sketchedMoves.push(['header', "Sketched moves"]);
				sketchedMoves.push(['move', id]);
			}
			this.defaultResultSet = usableMoves.concat(uselessMoves).concat(sketchedMoves);
			break;
		}

		for (var i in cur) {
			if (i) this.defaultResultSet = [[qType, i]].concat(this.defaultResultSet);
			break;
		}
		if (qType === 'pokemon') this.defaultResultSet = [['sortpokemon', '']].concat(this.defaultResultSet);
		if (qType === 'move') this.defaultResultSet = [['sortmove', '']].concat(this.defaultResultSet);

		if (this.legalityFilter) {
			for (var i = 0; i < this.defaultResultSet.length; i++) {
				if (this.defaultResultSet[i][0] !== 'header') {
					this.legalityFilter[this.defaultResultSet[i][1]] = 1;
				}
			}
		}

		this.renderedIndex = 0;
		this.renderingDone = false;
		this.find('');
	};

	Search.getClosest = function (query) {
		// binary search through the index!
		var left = 0;
		var right = BattleSearchIndex.length - 1;
		while (right > left) {
			var mid = Math.floor((right - left) / 2 + left);
			if (BattleSearchIndex[mid][0] === query && (mid === 0 || BattleSearchIndex[mid - 1][0] !== query)) {
				// that's us
				return mid;
			} else if (BattleSearchIndex[mid][0] < query) {
				left = mid + 1;
			} else {
				right = mid - 1;
			}
		}
		if (left >= BattleSearchIndex.length - 1) left = BattleSearchIndex.length - 1;
		else if (BattleSearchIndex[left + 1][0] && BattleSearchIndex[left][0] < query) left++;
		if (left && BattleSearchIndex[left - 1][0] === query) left--;
		return left;
	};

	/*********************************************************
	 * Rendering functions
	 *********************************************************/

	// These all have static versions

	Search.prototype.renderRow = function (id, type, matchStart, matchLength, errorMessage, attrs) {
		// errorMessage = '<span class="col illegalcol"><em>' + errorMessage + '</em></span>';
		switch (type) {
		case 'html':
			return '<li class="result">' + id + '</li>';
		case 'header':
			return '<li class="result"><h3>' + id + '</h3></li>';
		case 'sortpokemon':
			return this.renderPokemonSortRow();
		case 'sortmove':
			return this.renderMoveSortRow();
		case 'pokemon':
			var pokemon = BattlePokedex[id];
			if (!pokemon) pokemon = BattlePokedex[toId(Dex.getTemplate(id).baseSpecies)];
			return this.renderPokemonRow(pokemon, matchStart, matchLength, errorMessage, attrs);
		case 'move':
			var move = BattleMovedex[id];
			return this.renderMoveRow(move, matchStart, matchLength, errorMessage, attrs);
		case 'item':
			var item = BattleItems[id];
			return this.renderItemRow(item, matchStart, matchLength, errorMessage, attrs);
		case 'ability':
			var ability = BattleAbilities[id];
			return this.renderAbilityRow(ability, matchStart, matchLength, errorMessage, attrs);
		case 'type':
			var type = {name: id[0].toUpperCase() + id.substr(1)};
			return this.renderTypeRow(type, matchStart, matchLength, errorMessage);
		case 'egggroup':
			// very hardcode
			var egName;
			if (id === 'humanlike') egName = 'Human-Like';
			else if (id === 'water1') egName = 'Water 1';
			else if (id === 'water2') egName = 'Water 2';
			else if (id === 'water3') egName = 'Water 3';
			if (egName) {
				if (matchLength > 5) matchLength++;
			} else {
				egName = id[0].toUpperCase() + id.substr(1);
			}
			var egggroup = {name: egName};
			return this.renderEggGroupRow(egggroup, matchStart, matchLength, errorMessage);
		case 'tier':
			// very hardcode
			var tierTable = {
				uber: "Uber",
				ou: "OU",
				uu: "UU",
				ru: "RU",
				nu: "NU",
				pu: "PU",
				zu: "(PU)",
				nfe: "NFE",
				lcuber: "LC Uber",
				lc: "LC",
				cap: "CAP",
				caplc: "CAP LC",
				capnfe: "CAP NFE",
				uubl: "UUBL",
				rubl: "RUBL",
				nubl: "NUBL",
				publ: "PUBL"
			};
			var tier = {name: tierTable[id]};
			return this.renderTierRow(tier, matchStart, matchLength, errorMessage);
		case 'category':
			var category = {name: id[0].toUpperCase() + id.substr(1), id: id};
			return this.renderCategoryRow(category, matchStart, matchLength, errorMessage);
		case 'article':
			var articleTitle = (window.BattleArticleTitles && BattleArticleTitles[id]) || (id[0].toUpperCase() + id.substr(1));
			var article = {name: articleTitle, id: id};
			return this.renderArticleRow(article, matchStart, matchLength, errorMessage);
		}
		return 'Error: not found';
	};
	Search.prototype.renderPokemonSortRow = function () {
		var buf = '<li class="result"><div class="sortrow">';
		buf += '<button class="sortcol numsortcol' + (!this.sortCol ? ' cur' : '') + '">' + (!this.sortCol ? 'Sort: ' : (this.defaultResultSet && !this.filters ? 'Tier' : 'Number')) + '</button>';
		buf += '<button class="sortcol pnamesortcol' + (this.sortCol === 'name' ? ' cur' : '') + '" data-sort="name">Name</button>';
		buf += '<button class="sortcol typesortcol' + (this.sortCol === 'type' ? ' cur' : '') + '" data-sort="type">Types</button>';
		buf += '<button class="sortcol abilitysortcol' + (this.sortCol === 'ability' ? ' cur' : '') + '" data-sort="ability">Abilities</button>';
		buf += '<button class="sortcol statsortcol' + (this.sortCol === 'hp' ? ' cur' : '') + '" data-sort="hp">HP</button>';
		buf += '<button class="sortcol statsortcol' + (this.sortCol === 'atk' ? ' cur' : '') + '" data-sort="atk">Atk</button>';
		buf += '<button class="sortcol statsortcol' + (this.sortCol === 'def' ? ' cur' : '') + '" data-sort="def">Def</button>';
		buf += '<button class="sortcol statsortcol' + (this.sortCol === 'spa' ? ' cur' : '') + '" data-sort="spa">SpA</button>';
		buf += '<button class="sortcol statsortcol' + (this.sortCol === 'spd' ? ' cur' : '') + '" data-sort="spd">SpD</button>';
		buf += '<button class="sortcol statsortcol' + (this.sortCol === 'spe' ? ' cur' : '') + '" data-sort="spe">Spe</button>';
		buf += '<button class="sortcol statsortcol' + (this.sortCol === 'bst' ? ' cur' : '') + '" data-sort="bst">BST</button>';
		buf += '</div></li>';
		return buf;
	};
	Search.prototype.renderMoveSortRow = function () {
		var buf = '<li class="result"><div class="sortrow">';
		buf += '<button class="sortcol movenamesortcol' + (this.sortCol === 'name' ? ' cur' : '') + '" data-sort="name">Name</button>';
		buf += '<button class="sortcol movetypesortcol' + (this.sortCol === 'type' ? ' cur' : '') + '" data-sort="type">Type</button>';
		buf += '<button class="sortcol movetypesortcol' + (this.sortCol === 'category' ? ' cur' : '') + '" data-sort="category">Cat</button>';
		buf += '<button class="sortcol powersortcol' + (this.sortCol === 'power' ? ' cur' : '') + '" data-sort="power">Pow</button>';
		buf += '<button class="sortcol accuracysortcol' + (this.sortCol === 'accuracy' ? ' cur' : '') + '" data-sort="accuracy">Acc</button>';
		buf += '<button class="sortcol ppsortcol' + (this.sortCol === 'pp' ? ' cur' : '') + '" data-sort="pp">PP</button>';
		buf += '</div></li>';
		return buf;
	};
	Search.prototype.renderPokemonRow = function (pokemon, matchStart, matchLength, errorMessage, attrs) {
		if (!attrs) attrs = '';
		if (!pokemon) return '<li class="result">Unrecognized pokemon</li>';
		var id = toId(pokemon.species);
		if (Search.urlRoot) attrs += ' href="' + Search.urlRoot + 'pokemon/' + id + '" data-target="push"';
		var buf = '<li class="result"><a' + attrs + ' data-entry="pokemon|' + BattleLog.escapeHTML(pokemon.species) + '">';

		// number
		// buf += '<span class="col numcol">' + (pokemon.num >= 0 ? pokemon.num : 'CAP') + '</span> ';
		var tier;
		if (pokemon.tier) {
			tier = Dex.getTier(pokemon, this.gen, this.isDoubles);
		} else if (pokemon.forme && pokemon.forme.endsWith('Totem')) {
			tier = Dex.getTier(BattlePokedex[toId(pokemon.species.slice(0, (pokemon.forme.startsWith('Alola') ? -6 : pokemon.baseSpecies.length + 1)))], this.gen, this.isDoubles);
		} else {
			tier = Dex.getTier(BattlePokedex[toId(pokemon.baseSpecies)], this.gen, this.isDoubles);
		}
		buf += '<span class="col numcol">' + tier + '</span> ';

		// icon
		buf += '<span class="col iconcol">';
		buf += '<span style="' + Dex.getPokemonIcon(pokemon) + '"></span>';
		buf += '</span> ';

		// name
		var name = pokemon.species;
		var tagStart = (pokemon.forme ? name.length - pokemon.forme.length - 1 : 0);
		if (tagStart) name = name.substr(0, tagStart);
		if (matchLength) {
			name = name.substr(0, matchStart) + '<b>' + name.substr(matchStart, matchLength) + '</b>' + name.substr(matchStart + matchLength);
		}
		if (tagStart) {
			if (matchLength && matchStart + matchLength > tagStart) {
				if (matchStart < tagStart) {
					matchLength -= tagStart - matchStart;
					matchStart = tagStart;
				}
				name += '<small>' + pokemon.species.substr(tagStart, matchStart - tagStart) + '<b>' + pokemon.species.substr(matchStart, matchLength) + '</b>' + pokemon.species.substr(matchStart + matchLength) + '</small>';
			} else {
				name += '<small>' + pokemon.species.substr(tagStart) + '</small>';
			}
		}
		buf += '<span class="col pokemonnamecol" style="white-space:nowrap">' + name + '</span> ';

		// error
		if (errorMessage) {
			buf += errorMessage + '</a></li>';
			return buf;
		}

		var gen = this.gen;
		var table = (gen < 7 ? BattleTeambuilderTable['gen' + gen] : null);

		// type
		buf += '<span class="col typecol">';
		var types = pokemon.types;
		if (table && id in table.overrideType) types = table.overrideType[id].split('/');
		for (var i = 0; i < types.length; i++) {
			buf += Dex.getTypeIcon(types[i]);
		}
		buf += '</span> ';

		// abilities
		if (gen >= 3) {
			var abilities = Dex.getAbilitiesFor(id, gen);
			if (abilities['1']) {
				buf += '<span class="col twoabilitycol">' + abilities['0'] + '<br />' +
					abilities['1'] + '</span>';
			} else {
				buf += '<span class="col abilitycol">' + abilities['0'] + '</span>';
			}
			if (gen >= 5) {
				if (abilities['S']) {
					buf += '<span class="col twoabilitycol' + (pokemon.unreleasedHidden ? ' unreleasedhacol' : '') + '">' + abilities['H'] + '<br />' + abilities['S'] + '</span>';
				} else if (abilities['H']) {
					buf += '<span class="col abilitycol' + (pokemon.unreleasedHidden ? ' unreleasedhacol' : '') + '">' + abilities['H'] + '</span>';
				} else {
					buf += '<span class="col abilitycol"></span>';
				}
			}
		}

		// base stats
		var stats = pokemon.baseStats;
		if (table) {
			var overrideStats = table.overrideStats[id];
			if (overrideStats || gen === 1) {
				stats = {
					hp: pokemon.baseStats.hp,
					atk: pokemon.baseStats.atk,
					def: pokemon.baseStats.def,
					spa: pokemon.baseStats.spa,
					spd: pokemon.baseStats.spd,
					spe: pokemon.baseStats.spe
				};
			}
			if (overrideStats) {
				if ('hp' in overrideStats) stats.hp = overrideStats.hp;
				if ('atk' in overrideStats) stats.atk = overrideStats.atk;
				if ('def' in overrideStats) stats.def = overrideStats.def;
				if ('spa' in overrideStats) stats.spa = overrideStats.spa;
				if ('spd' in overrideStats) stats.spd = overrideStats.spd;
				if ('spe' in overrideStats) stats.spe = overrideStats.spe;
			}
			if (gen === 1) stats.spd = 0;
		}
		buf += '<span class="col statcol"><em>HP</em><br />' + stats.hp + '</span> ';
		buf += '<span class="col statcol"><em>Atk</em><br />' + stats.atk + '</span> ';
		buf += '<span class="col statcol"><em>Def</em><br />' + stats.def + '</span> ';
		if (gen >= 2) {
			buf += '<span class="col statcol"><em>SpA</em><br />' + stats.spa + '</span> ';
			buf += '<span class="col statcol"><em>SpD</em><br />' + stats.spd + '</span> ';
		} else {
			buf += '<span class="col statcol"><em>Spc</em><br />' + stats.spa + '</span> ';
		}
		buf += '<span class="col statcol"><em>Spe</em><br />' + stats.spe + '</span> ';
		var bst = 0;
		for (i in stats) bst += stats[i];
		buf += '<span class="col bstcol"><em>BST<br />' + bst + '</em></span> ';

		buf += '</a></li>';

		return buf;
	};
	Search.prototype.renderTaggedPokemonRowInner = function (pokemon, tag, errorMessage) {
		var attrs = '';
		if (Search.urlRoot) attrs = ' href="' + Search.urlRoot + 'pokemon/' + toId(pokemon.species) + '" data-target="push"';
		var buf = '<a' + attrs + ' data-entry="pokemon|' + BattleLog.escapeHTML(pokemon.species) + '">';

		// tag
		buf += '<span class="col tagcol shorttagcol">' + tag + '</span> ';

		// icon
		buf += '<span class="col iconcol">';
		buf += '<span style="' + Dex.getPokemonIcon(pokemon) + '"></span>';
		buf += '</span> ';

		// name
		var name = pokemon.species;
		var tagStart = (pokemon.forme ? name.length - pokemon.forme.length - 1 : 0);
		if (tagStart) name = name.substr(0, tagStart) + '<small>' + pokemon.species.substr(tagStart) + '</small>';
		buf += '<span class="col shortpokemonnamecol" style="white-space:nowrap">' + name + '</span> ';

		// error
		if (errorMessage) {
			buf += errorMessage + '</a></li>';
			return buf;
		}

		// type
		buf += '<span class="col typecol">';
		for (var i = 0; i < pokemon.types.length; i++) {
			buf += Dex.getTypeIcon(pokemon.types[i]);
		}
		buf += '</span> ';

		// abilities
		buf += '<span style="float:left;min-height:26px">';
		if (pokemon.abilities['1']) {
			buf += '<span class="col twoabilitycol">';
		} else {
			buf += '<span class="col abilitycol">';
		}
		for (var i in pokemon.abilities) {
			var ability = pokemon.abilities[i];
			if (!ability) continue;

			if (i === '1') buf += '<br />';
			if (i === 'H') ability = '</span><span class="col abilitycol"><em>' + pokemon.abilities[i] + '</em>';
			buf += ability;
		}
		if (!pokemon.abilities['H']) buf += '</span><span class="col abilitycol">';
		buf += '</span>';
		buf += '</span>';

		// base stats
		buf += '<span style="float:left;min-height:26px">';
		buf += '<span class="col statcol"><em>HP</em><br />' + pokemon.baseStats.hp + '</span> ';
		buf += '<span class="col statcol"><em>Atk</em><br />' + pokemon.baseStats.atk + '</span> ';
		buf += '<span class="col statcol"><em>Def</em><br />' + pokemon.baseStats.def + '</span> ';
		buf += '<span class="col statcol"><em>SpA</em><br />' + pokemon.baseStats.spa + '</span> ';
		buf += '<span class="col statcol"><em>SpD</em><br />' + pokemon.baseStats.spd + '</span> ';
		buf += '<span class="col statcol"><em>Spe</em><br />' + pokemon.baseStats.spe + '</span> ';
		var bst = 0;
		for (i in pokemon.baseStats) bst += pokemon.baseStats[i];
		buf += '<span class="col bstcol"><em>BST<br />' + bst + '</em></span> ';
		buf += '</span>';

		buf += '</a>';

		return buf;
	};

	Search.prototype.renderItemRow = function (item, matchStart, matchLength, errorMessage, attrs) {
		if (!attrs) attrs = '';
		if (!item) return '<li class="result">Unrecognized item</li>';
		var id = toId(item.name);
		if (Search.urlRoot) attrs += ' href="' + Search.urlRoot + 'items/' + id + '" data-target="push"';
		var buf = '<li class="result"><a' + attrs + ' data-entry="item|' + BattleLog.escapeHTML(item.name) + '">';

		// icon
		buf += '<span class="col itemiconcol">';
		buf += '<span style="' + Dex.getItemIcon(item) + '"></span>';
		buf += '</span> ';

		// name
		var name = item.name;
		if (matchLength) {
			name = name.substr(0, matchStart) + '<b>' + name.substr(matchStart, matchLength) + '</b>' + name.substr(matchStart + matchLength);
		}
		buf += '<span class="col namecol">' + name + '</span> ';

		// error
		if (errorMessage) {
			buf += errorMessage + '</a></li>';
			return buf;
		}

		// desc
		var desc = (item.shortDesc || item.desc);
		if (this.gen < 7) {
			for (var i = this.gen; i < 7; i++) {
				if (id in BattleTeambuilderTable['gen' + i].overrideItemDesc) {
					desc = BattleTeambuilderTable['gen' + i].overrideItemDesc[id];
					break;
				}
			}
		}
		buf += '<span class="col itemdesccol">' + BattleLog.escapeHTML(desc) + '</span> ';

		buf += '</a></li>';

		return buf;
	};
	Search.prototype.renderAbilityRow = function (ability, matchStart, matchLength, errorMessage, attrs) {
		if (!attrs) attrs = '';
		if (!ability) return '<li class="result">Unrecognized ability</li>';
		var id = toId(ability.name);
		if (Search.urlRoot) attrs += ' href="' + Search.urlRoot + 'abilities/' + id + '" data-target="push"';
		var buf = '<li class="result"><a' + attrs + ' data-entry="ability|' + BattleLog.escapeHTML(ability.name) + '">';

		// name
		var name = ability.name;
		if (matchLength) {
			name = name.substr(0, matchStart) + '<b>' + name.substr(matchStart, matchLength) + '</b>' + name.substr(matchStart + matchLength);
		}
		buf += '<span class="col namecol">' + name + '</span> ';

		// error
		if (errorMessage) {
			buf += errorMessage + '</a></li>';
			return buf;
		}

		buf += '<span class="col abilitydesccol">' + BattleLog.escapeHTML(ability.shortDesc || ability.desc) + '</span> ';

		buf += '</a></li>';

		return buf;
	};
	Search.prototype.renderMoveRow = function (move, matchStart, matchLength, errorMessage, attrs) {
		if (!attrs) attrs = '';
		if (!move) return '<li class="result">Unrecognized move</li>';
		var id = toId(move.name);
		if (Search.urlRoot) attrs += ' href="' + Search.urlRoot + 'moves/' + id + '" data-target="push"';
		var buf = '<li class="result"><a' + attrs + ' data-entry="move|' + BattleLog.escapeHTML(move.name) + '">';

		// name
		var name = move.name;
		var tagStart = (name.substr(0, 12) === 'Hidden Power' ? 12 : 0);
		if (tagStart) name = name.substr(0, tagStart);
		if (matchLength) {
			name = name.substr(0, matchStart) + '<b>' + name.substr(matchStart, matchLength) + '</b>' + name.substr(matchStart + matchLength);
		}
		if (tagStart) {
			if (matchLength && matchStart + matchLength > tagStart) {
				if (matchStart < tagStart) {
					matchLength -= tagStart - matchStart;
					matchStart = tagStart;
				}
				name += '<small>' + move.name.substr(tagStart, matchStart - tagStart) + '<b>' + move.name.substr(matchStart, matchLength) + '</b>' + move.name.substr(matchStart + matchLength) + '</small>';
			} else {
				name += '<small>' + move.name.substr(tagStart) + '</small>';
			}
		}
		buf += '<span class="col movenamecol">' + name + '</span> ';

		// error
		if (errorMessage) {
			buf += errorMessage + '</a></li>';
			return buf;
		}

		var table = (this.gen < 7 ? BattleTeambuilderTable['gen' + this.gen] : null);

		// type
		buf += '<span class="col typecol">';
		var type = move.type;
		if (table && id in table.overrideMoveType) type = table.overrideMoveType[id];
		buf += Dex.getTypeIcon(type);
		var category = Dex.getCategory(move, this.gen, type);
		buf += '<img src="' + Dex.resourcePrefix + 'sprites/categories/' + category + '.png" alt="' + category + '" height="14" width="32" />';
		buf += '</span> ';

		// power, accuracy, pp
		var basePower = move.basePower;
		var accuracy = move.accuracy;
		var pp = move.pp;
		if (table) {
			if (id in table.overrideBP) basePower = table.overrideBP[id];
			if (id in table.overrideAcc) accuracy = table.overrideAcc[id];
			if (id in table.overridePP) pp = table.overridePP[id];
		}
		buf += '<span class="col labelcol">' + (move.category !== 'Status' ? ('<em>Power</em><br />' + (basePower || '&mdash;')) : '') + '</span> ';
		buf += '<span class="col widelabelcol"><em>Accuracy</em><br />' + (accuracy && accuracy !== true ? accuracy + '%' : '&mdash;') + '</span> ';
		buf += '<span class="col pplabelcol"><em>PP</em><br />' + (pp === 1 || move.noPPBoosts ? pp : pp * 8 / 5) + '</span> ';

		// desc
		var desc = (move.shortDesc || move.desc);
		if (this.gen < 7) {
			for (var i = this.gen; i < 7; i++) {
				if (id in BattleTeambuilderTable['gen' + i].overrideMoveDesc) {
					desc = BattleTeambuilderTable['gen' + i].overrideMoveDesc[id];
					break;
				}
			}
		}
		buf += '<span class="col movedesccol">' + BattleLog.escapeHTML(desc) + '</span> ';

		buf += '</a></li>';

		return buf;
	};
	Search.prototype.renderMoveRowInner = function (move, errorMessage) {
		var attrs = '';
		if (Search.urlRoot) attrs = ' href="' + Search.urlRoot + 'moves/' + toId(move.name) + '" data-target="push"';
		var buf = '<a' + attrs + ' data-entry="move|' + BattleLog.escapeHTML(move.name) + '">';

		// name
		var name = move.name;
		var tagStart = (name.substr(0, 12) === 'Hidden Power' ? 12 : 0);
		if (tagStart) name = name.substr(0, tagStart) + '<small>' + move.name.substr(tagStart) + '</small>';
		buf += '<span class="col movenamecol">' + name + '</span> ';

		// error
		if (errorMessage) {
			buf += errorMessage + '</a></li>';
			return buf;
		}

		// type
		buf += '<span class="col typecol">';
		buf += Dex.getTypeIcon(move.type);
		buf += '<img src="' + Dex.resourcePrefix + 'sprites/categories/' + move.category + '.png" alt="' + move.category + '" height="14" width="32" />';
		buf += '</span> ';

		// power, accuracy, pp
		buf += '<span class="col labelcol">' + (move.category !== 'Status' ? ('<em>Power</em><br />' + (move.basePower || '&mdash;')) : '') + '</span> ';
		buf += '<span class="col widelabelcol"><em>Accuracy</em><br />' + (move.accuracy && move.accuracy !== true ? move.accuracy + '%' : '&mdash;') + '</span> ';
		buf += '<span class="col pplabelcol"><em>PP</em><br />' + (move.pp === 1 || move.noPPBoosts ? move.pp : move.pp * 8 / 5) + '</span> ';

		// desc
		buf += '<span class="col movedesccol">' + BattleLog.escapeHTML(move.shortDesc || move.desc) + '</span> ';

		buf += '</a>';

		return buf;
	};
	Search.prototype.renderTaggedMoveRow = function (move, tag, errorMessage) {
		var attrs = '';
		if (Search.urlRoot) attrs = ' href="' + Search.urlRoot + 'moves/' + toId(move.name) + '" data-target="push"';
		var buf = '<li class="result"><a' + attrs + ' data-entry="move|' + BattleLog.escapeHTML(move.name) + '">';

		// tag
		buf += '<span class="col tagcol">' + tag + '</span> ';

		// name
		var name = move.name;
		if (name.substr(0, 12) === 'Hidden Power') name = 'Hidden Power';
		buf += '<span class="col shortmovenamecol">' + name + '</span> ';

		// error
		if (errorMessage) {
			buf += errorMessage + '</a></li>';
			return buf;
		}

		// type
		buf += '<span class="col typecol">';
		buf += Dex.getTypeIcon(move.type);
		buf += '<img src="' + Dex.resourcePrefix + 'sprites/categories/' + move.category + '.png" alt="' + move.category + '" height="14" width="32" />';
		buf += '</span> ';

		// power, accuracy, pp
		buf += '<span class="col labelcol">' + (move.category !== 'Status' ? ('<em>Power</em><br />' + (move.basePower || '&mdash;')) : '') + '</span> ';
		buf += '<span class="col widelabelcol"><em>Accuracy</em><br />' + (move.accuracy && move.accuracy !== true ? move.accuracy + '%' : '&mdash;') + '</span> ';
		buf += '<span class="col pplabelcol"><em>PP</em><br />' + (move.pp !== 1 ? move.pp * 8 / 5 : move.pp) + '</span> ';

		// desc
		buf += '<span class="col movedesccol">' + BattleLog.escapeHTML(move.shortDesc || move.desc) + '</span> ';

		buf += '</a></li>';

		return buf;
	};

	Search.prototype.renderTypeRow = function (type, matchStart, matchLength, errorMessage) {
		var attrs = '';
		if (Search.urlRoot) attrs = ' href="' + Search.urlRoot + 'types/' + toId(type.name) + '" data-target="push"';
		var buf = '<li class="result"><a' + attrs + ' data-entry="type|' + BattleLog.escapeHTML(type.name) + '">';

		// name
		var name = type.name;
		if (matchLength) {
			name = name.substr(0, matchStart) + '<b>' + name.substr(matchStart, matchLength) + '</b>' + name.substr(matchStart + matchLength);
		}
		buf += '<span class="col namecol">' + name + '</span> ';

		// type
		buf += '<span class="col typecol">';
		buf += Dex.getTypeIcon(type.name);
		buf += '</span> ';

		// error
		if (errorMessage) {
			buf += errorMessage + '</a></li>';
			return buf;
		}

		buf += '</a></li>';

		return buf;
	};
	Search.prototype.renderCategoryRow = function (category, matchStart, matchLength, errorMessage) {
		var attrs = '';
		if (Search.urlRoot) attrs = ' href="' + Search.urlRoot + 'categories/' + category.id + '" data-target="push"';
		var buf = '<li class="result"><a' + attrs + ' data-entry="category|' + BattleLog.escapeHTML(category.name) + '">';

		// name
		var name = category.name;
		if (matchLength) {
			name = name.substr(0, matchStart) + '<b>' + name.substr(matchStart, matchLength) + '</b>' + name.substr(matchStart + matchLength);
		}
		buf += '<span class="col namecol">' + name + '</span> ';

		// category
		buf += '<span class="col typecol">';
		buf += '<img src="' + Dex.resourcePrefix + 'sprites/categories/' + category.name + '.png" alt="' + category.name + '" height="14" width="32" />';
		buf += '</span> ';

		// error
		if (errorMessage) {
			buf += errorMessage + '</a></li>';
			return buf;
		}

		buf += '</a></li>';

		return buf;
	};
	Search.prototype.renderArticleRow = function (article, matchStart, matchLength, errorMessage) {
		var attrs = '';
		if (Search.urlRoot) attrs = ' href="' + Search.urlRoot + 'articles/' + article.id + '" data-target="push"';
		var isSearchType = (article.id === 'pokemon' || article.id === 'moves');
		if (isSearchType) attrs = ' href="' + article.id + '/" data-target="replace"';
		var buf = '<li class="result"><a' + attrs + ' data-entry="article|' + BattleLog.escapeHTML(article.name) + '">';

		// name
		var name = article.name;
		if (matchLength) {
			name = name.substr(0, matchStart) + '<b>' + name.substr(matchStart, matchLength) + '</b>' + name.substr(matchStart + matchLength);
		}
		buf += '<span class="col namecol">' + name + '</span> ';

		// article
		if (isSearchType) {
			buf += '<span class="col movedesccol">(search type)</span> ';
		} else {
			buf += '<span class="col movedesccol">(article)</span> ';
		}

		// error
		if (errorMessage) {
			buf += errorMessage + '</a></li>';
			return buf;
		}

		buf += '</a></li>';

		return buf;
	};
	Search.prototype.renderEggGroupRow = function (egggroup, matchStart, matchLength, errorMessage) {
		var attrs = '';
		if (Search.urlRoot) attrs = ' href="' + Search.urlRoot + 'egggroups/' + toId(egggroup.name) + '" data-target="push"';
		var buf = '<li class="result"><a' + attrs + ' data-entry="egggroup|' + BattleLog.escapeHTML(egggroup.name) + '">';

		// name
		var name = egggroup.name;
		if (matchLength) {
			name = name.substr(0, matchStart) + '<b>' + name.substr(matchStart, matchLength) + '</b>' + name.substr(matchStart + matchLength);
		}
		buf += '<span class="col namecol">' + name + '</span> ';

		// error
		if (errorMessage) {
			buf += errorMessage + '</a></li>';
			return buf;
		}

		buf += '</a></li>';

		return buf;
	};
	Search.prototype.renderTierRow = function (tier, matchStart, matchLength, errorMessage) {
		var attrs = '';
		if (Search.urlRoot) attrs = ' href="' + Search.urlRoot + 'tiers/' + toId(tier.name) + '" data-target="push"';
		var buf = '<li class="result"><a' + attrs + ' data-entry="tier|' + BattleLog.escapeHTML(tier.name) + '">';

		// name
		var name = tier.name;
		if (matchLength) {
			name = name.substr(0, matchStart) + '<b>' + name.substr(matchStart, matchLength) + '</b>' + name.substr(matchStart + matchLength);
		}
		buf += '<span class="col namecol">' + name + '</span> ';

		// error
		if (errorMessage) {
			buf += errorMessage + '</a></li>';
			return buf;
		}

		buf += '</a></li>';

		return buf;
	};

	Search.gen = 7;
	Search.renderRow = Search.prototype.renderRow;
	Search.renderPokemonRow = Search.prototype.renderPokemonRow;
	Search.renderTaggedPokemonRowInner = Search.prototype.renderTaggedPokemonRowInner;
	Search.renderItemRow = Search.prototype.renderItemRow;
	Search.renderAbilityRow = Search.prototype.renderAbilityRow;
	Search.renderMoveRow = Search.prototype.renderMoveRow;
	Search.renderMoveRowInner = Search.prototype.renderMoveRowInner;
	Search.renderTaggedMoveRow = Search.prototype.renderTaggedMoveRow;
	Search.renderTypeRow = Search.prototype.renderTypeRow;
	Search.renderCategoryRow = Search.prototype.renderCategoryRow;
	Search.renderEggGroupRow = Search.prototype.renderEggGroupRow;
	Search.renderTierRow = Search.prototype.renderTierRow;

	exports.BattleSearch = Search;

})(window, jQuery);
