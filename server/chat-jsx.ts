/**
 * PS custom HTML elements and Preact handling.
 * By Mia and Zarel
 */
import preact from 'preact';
import render from 'preact-render-to-string';
import {Utils} from '../lib';

/** For easy concenation of Preact nodes with strings */
export function html(
	strings: TemplateStringsArray, ...args: (preact.VNode | string | number | null | undefined)[]
) {
	let buf = strings[0];
	let i = 0;
	while (i < args.length) {
		buf += typeof args[i] === 'string' || typeof args[i] === 'number' ?
			Utils.escapeHTML(args[i] as string | number) :
			render(args[i] as preact.VNode);
		buf += strings[++i];
	}
	return buf;
}

/** client-side custom elements */
export interface PSElements extends preact.JSX.IntrinsicElements {
	youtube: {src: string};
	twitch: {src: string, width?: number, height?: number};
	spotify: {src: string};
	username: {name?: string, class?: string};
	psicon: {pokemon: string} | {item: string} | {type: string} | {category: string};
}

export {render};

export type VNode = preact.VNode;

export const h = preact.h;
export const Fragment = preact.Fragment;
