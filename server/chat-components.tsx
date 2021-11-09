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

// PS custom elements
export class Youtube extends preact.Component<{src: string}> {
	render() {
		return `<youtube src="${this.props.src}" />`;
	}
};

export class Twitch extends preact.Component<{src: string}> {
	render() {
		return <span dangerouslySetInnerHTML={{__html: `<twitch src="${this.props.src}" />`}} />;
	}
};

export class Spotify extends preact.Component<{src: string}> {
	render() {
		return <span dangerouslySetInnerHTML={{__html: `<spotify src="${this.props.src}" />`}} />;
	}
};

export class Username extends preact.Component<{name?: string}> {
	render() {
		return <span dangerouslySetInnerHTML={{
			__html: `<username>${this.props.name}</username>`
		}}>{this.props.children}</span>;
	}
}
