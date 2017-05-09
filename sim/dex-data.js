/**
 * Simulator Battle
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * @license MIT license
 */
'use strict';

class Tools {
	/**
	 * Safely converts the passed variable into a string. Unlike '' + str,
	 * String(str), or str.toString(), Dex.getString is guaranteed not to
	 * crash.
	 *
	 * Specifically, the fear with untrusted JSON is an object like:
	 *
	 *     let a = {"toString": "this is not a function"};
	 *     console.log(`a is ${a}`);
	 *
	 * This will crash (because a.toString() is not a function). Instead,
	 * Dex.getString simply returns '' if the passed variable isn't a
	 * string or a number.
	 *
	 * @param {any} str
	 * @return {string}
	 */
	static getString(str) {
		if (typeof str === 'string' || typeof str === 'number') return '' + str;
		return '';
	}

	/**
	 * Converts anything to an ID. An ID must have only lowercase alphanumeric
	 * characters.
	 * If a string is passed, it will be converted to lowercase and
	 * non-alphanumeric characters will be stripped.
	 * If an object with an ID is passed, its ID will be returned.
	 * Otherwise, an empty string will be returned.
	 *
	 * Dex.getId is generally assigned to the global toId, because of how
	 * commonly it's used.
	 *
	 * @param {any} text
	 * @return {string}
	 */
	static getId(text) {
		if (text && text.id) {
			text = text.id;
		} else if (text && text.userid) {
			text = text.userid;
		}
		if (typeof text !== 'string' && typeof text !== 'number') return '';
		return ('' + text).toLowerCase().replace(/[^a-z0-9]+/g, '');
	}
}
const toId = Tools.getId;

class Effect {
	/**
	 * @param {AnyObject} data
	 * @param {?AnyObject} [moreData]
	 */
	constructor(data, moreData = null) {
		/**
		 * ID. This will be a lowercase version of the name with all the
		 * alphanumeric characters removed. So, for instance, "Mr. Mime"
		 * becomes "mrmime", and "Basculin-Blue-Striped" becomes
		 * "basculinbluestriped".
		 *
		 * @type {string}
		 */
		this.id = '';
		/**
		 * Name. Currently does not support Unicode letters, so "Flabébé"
		 * is "Flabebe" and "Nidoran♀" is "Nidoran-F".
		 *
		 * @type {string}
		 */
		this.name = '';
		/**
		 * Full name. Prefixes the name with the effect type. For instance,
		 * Leftovers would be "item: Leftovers", confusion the status
		 * condition would be "confusion", etc.
		 *
		 * @type {string}
		 */
		this.fullname = '';
		/**
		 * Effect type.
		 *
		 * @type {'Effect' | 'Pokemon' | 'Move' | 'Item' | 'Ability'}
		 */
		this.effectType = 'Effect';
		/**
		 * Does it exist? For historical reasons, when you use an accessor
		 * for an effect that doesn't exist, you get a dummy effect that
		 * doesn't do anything, and this field set to false.
		 *
		 * @type {boolean}
		 */
		this.exists = true;

		Object.assign(this, data);
		if (moreData) Object.assign(this, moreData);
		this.name = Tools.getString(data.name).trim();
		this.fullname = Tools.getString(data.fullname) || this.name;
		this.id = toId(this.name);
		this.effectType = Tools.getString(data.effectType) || "Effect";
		this.exists = !!(this.exists && this.id);
	}
	toString() {
		return this.name;
	}
}

exports.Tools = Tools;
exports.Effect = Effect;
