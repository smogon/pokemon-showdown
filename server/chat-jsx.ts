/**
 * PS custom HTML elements and Preact handling.
 * By Mia.
 * @author mia-pi-git
 */
import preact from 'preact';
import render from 'preact-render-to-string';
import {Utils} from '../lib';

/** For easy concenation of Preact nodes with strings. */
export function html(strings: TemplateStringsArray, ...args: (preact.VNode | string)[]) {
	let buf = strings[0];
	let i = 0;
	while (i < args.length) {
		buf += typeof args[i] === 'string' ?
			Utils.escapeHTML(args[i] as string) :
			render(args[i] as preact.VNode);
		buf += strings[++i];
	}
	return buf;
}

// misc preact props needed. this exists to make TS happy.
type Props<T> = T & {children: any};

// Typedefs for our client-side custom elements.
export interface PSElements {
	youtube: Props<{src: string}>;
	twitch: Props<{src: string}>;
	spotify: Props<{src: string}>;
	username: Props<{name?: string}>;
};
