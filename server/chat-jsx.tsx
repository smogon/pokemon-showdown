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
	center: Record<string, unknown>;
}

export {render};

export type VNode = preact.VNode;

export const h = preact.h;
export const Fragment = preact.Fragment;

function subRender(
	child: preact.ComponentChild, opts?: {isTrusted?: boolean, replaceLinebreaks?: boolean}
): preact.VNode {
	switch (typeof child) {
	case 'string':
		return <div dangerouslySetInnerHTML={{__html: Chat.formatText(child, opts?.isTrusted, opts?.replaceLinebreaks)}} />;
	case 'bigint':
	case 'number':
	case 'boolean':
	case 'object':
		return <>{child ? child.toString() : '' + child}</>;
	default:
		return preact.isValidElement(child) ? child : <>{'' + child}</>;
	}
}

export class FormatText extends preact.Component<{isTrusted?: boolean, replaceLinebreaks?: boolean}> {
	render() {
		if (Array.isArray(this.props.children)) {
			const buf = [];
			for (const child of this.props.children) {
				buf.push(subRender(child, {isTrusted: this.props.isTrusted, replaceLinebreaks: this.props.replaceLinebreaks}));
			}
			return <>{buf}</>;
		} else {
			return subRender(this.props.children, {
				isTrusted: this.props.isTrusted, replaceLinebreaks: this.props.replaceLinebreaks,
			});
		}
	}
}
