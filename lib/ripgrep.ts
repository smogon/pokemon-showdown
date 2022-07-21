/**
 * An easy wrapper around ripgrep-pkg.
 * Basically just to handle the case of it not being installed.
 * @author mia-pi-git
 */

import {FS} from './fs';
// @ts-ignore
import type {RipgrepOptions, RipgrepStream} from 'ripgrep-pkg';


export function hasRipgrep() {
	try {
		return require('ripgrep-pkg').ripgrep as typeof import('ripgrep-pkg').ripgrep;
	} catch {
		return null;
	}
}

export function ripgrep(opts: RipgrepOptions): RipgrepStream<string | string[]> | null {
	const rg = hasRipgrep();
	if (!opts.cwd) opts.cwd = FS('./').path;
	if (!rg) return null;
	return rg(opts as any);
}
