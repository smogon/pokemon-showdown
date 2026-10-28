'use strict';

// Compare two installed checkouts with the same Node executable. --clean removes
// each checkout's dist directory before every build; use disposable checkouts.
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');

const usage = 'Usage: node tools/benchmark-build.js <baseline> <candidate> [--clean] [--runs=7] [--warmups=2] [--json]';
const args = process.argv.slice(2);
if (args.includes('--help')) {
	console.log(usage);
	process.exit(0);
}

function main() {
	const directories = args.filter(arg => !arg.startsWith('--'));
	if (directories.length !== 2) throw new Error(usage);
	let runs = 7;
	let warmups = 2;
	for (const arg of args.filter(value => value.startsWith('--'))) {
		if (arg === '--clean' || arg === '--json') continue;
		const match = /^--(runs|warmups)=(\d+)$/.exec(arg);
		if (!match) throw new Error(`Unknown option: ${arg}\n${usage}`);
		const value = Number(match[2]);
		if (!Number.isSafeInteger(value) || (match[1] === 'runs' && value < 1)) {
			throw new Error(`Invalid count: ${arg}`);
		}
		if (match[1] === 'runs') runs = value;
		else warmups = value;
	}
	const clean = args.includes('--clean');
	const checkouts = directories.map((directory, index) => {
		const root = fs.realpathSync(directory);
		const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
		if (pkg.name !== 'pokemon-showdown' || !fs.statSync(path.join(root, 'build')).isFile()) {
			throw new Error(`Not a Pokemon Showdown checkout: ${root}`);
		}
		if (!fs.statSync(path.join(root, 'node_modules')).isDirectory()) {
			throw new Error(`Install dependencies before benchmarking: ${root}`);
		}
		const revision = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' });
		return {
			label: index ? 'candidate' : 'baseline',
			root,
			revision: revision.status === 0 ? revision.stdout.trim() : null,
			dependencies: pkg.dependencies,
			samplesMs: [],
		};
	});
	const [baseline, candidate] = checkouts;
	if (baseline.root === candidate.root || baseline.root.startsWith(candidate.root + path.sep) ||
		candidate.root.startsWith(baseline.root + path.sep)) {
		throw new Error('Use separate, non-nested checkouts.');
	}

	function build(checkout) {
		const dist = path.join(checkout.root, 'dist');
		// Check immediately before each removal; never follow a dist symlink.
		const stat = fs.lstatSync(dist, { throwIfNoEntry: false });
		if (stat && (!stat.isDirectory() || stat.isSymbolicLink())) {
			throw new Error(`Expected a regular dist directory: ${dist}`);
		}
		if (clean) fs.rmSync(dist, { recursive: true, force: true });
		const start = process.hrtime.bigint();
		const result = spawnSync(process.execPath, ['build'], {
			cwd: checkout.root, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024,
		});
		const elapsed = Number(process.hrtime.bigint() - start) / 1e6;
		if (result.error || result.status !== 0) {
			throw new Error(`${checkout.label} build failed: ${result.error || result.signal || result.status}\n` +
				result.stdout + result.stderr);
		}
		return elapsed;
	}

	for (let round = 0; round < warmups + runs; round++) {
		const order = round % 2 ? [...checkouts].reverse() : checkouts;
		for (const checkout of order) {
			const elapsed = build(checkout);
			if (round >= warmups) checkout.samplesMs.push(elapsed);
			console.error(`${round < warmups ? 'warmup' : 'sample'} ${checkout.label}: ${elapsed.toFixed(1)} ms`);
		}
	}

	for (const checkout of checkouts) {
		const sorted = [...checkout.samplesMs].sort((a, b) => a - b);
		checkout.medianMs = (sorted[Math.floor((runs - 1) / 2)] + sorted[Math.floor(runs / 2)]) / 2;
		checkout.minMs = sorted[0];
		checkout.maxMs = sorted[runs - 1];
	}
	const report = {
		command: `${process.execPath} build`,
		mode: clean ? 'clean build (dist removal excluded)' : 'rebuild (existing dist retained)',
		date: new Date().toISOString(),
		node: process.version,
		platform: `${os.platform()} ${os.release()} ${os.arch()}`,
		cpu: os.cpus()[0]?.model,
		logicalCpus: os.cpus().length,
		warmups,
		runs,
		checkouts,
		speedup: baseline.medianMs / candidate.medianMs,
		percentFaster: (1 - candidate.medianMs / baseline.medianMs) * 100,
	};
	if (args.includes('--json')) {
		console.log(JSON.stringify(report, null, 2));
	} else {
		console.log(`${report.mode}; ${runs} samples after ${warmups} warmups; alternating execution order`);
		for (const checkout of checkouts) {
			console.log(`${checkout.label}: median ${checkout.medianMs.toFixed(1)} ms ` +
				`(range ${checkout.minMs.toFixed(1)}–${checkout.maxMs.toFixed(1)} ms)`);
		}
		console.log(`Candidate: ${report.speedup.toFixed(2)}x baseline speed, ${report.percentFaster.toFixed(1)}% faster`);
	}
}

try {
	main();
} catch (error) {
	console.error(error.message);
	process.exitCode = 1;
}
