import preact from 'preact';
import render from 'preact-render-to-string';
import { Utils } from '../../lib';

export function html(
	strings: TemplateStringsArray, ...args: (preact.VNode | string | number | null | undefined)[]
) {
	let buf = strings[0];
	let i = 0;
	while (i < args.length) {
		buf += typeof args[i] === 'string' || typeof args[i] === 'number' ?
			(args[i] as string | number) :
			render(args[i] as preact.VNode);
		buf += strings[++i];
	}
	return buf;
}

export interface PSElements extends preact.JSX.IntrinsicElements {
	youtube: { src: string };
	twitch: { src: string, width?: number, height?: number };
	spotify: { src: string };
	username: { name?: string, class?: string, children?: preact.VNode | string };
	psicon: { pokemon: string } | { item: string } | { type: string } | { category: string };
	center: { class?: string };
	font: { size?: string, color?: string };
}

export { render };

export type VNode = preact.VNode;

export const h = preact.h;
export const Fragment = preact.Fragment;
export const Component = preact.Component;

export class FormatText extends preact.Component<{ isTrusted?: boolean, replaceLinebreaks?: boolean }> {
	render() {
		const child = this.props.children;
		if (typeof child !== 'string') throw new Error(`Invalid props.children type: ${!child ? child : typeof child}`);
		return <span
			dangerouslySetInnerHTML={{ __html: Chat.formatText(child, true, this.props.replaceLinebreaks) }}
		/>;
	}
}

export const commands = {
	testunsafepreact: function (target, room, user) {
		this.runBroadcast();

		// Test 1: Render a Preact VNode (should render as <psicon>)
		const icon = h('psicon', { pokemon: 'Mewtwo' });

		// Test 2: Inject a raw script string (should NOT be escaped due to your changes)
		const maliciousString = `<script>alert('Sanitization bypassed!');</script>`;

		const output = html`<div style="border: 1px solid red; padding: 10px; background: #222; color: #fff;">` +
				`<h3>Unsafe Preact Test</h3>` +
				`<p><strong>VNode Render:</strong> ${icon}</p>` +
				`<p><strong>String Injection:</strong> ${maliciousString}</p></div>`;

		this.sendReplyBox(output);
	},
};
