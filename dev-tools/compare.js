'use strict';

const Stats = require('trakr').Stats;

function confidenceIntervals(control, test) {
	const N = 1000;
	const d50 = new Array(N);
	const d95 = new Array(N);
	const d99 = new Array(N);

	const cc = Math.floor(control.length / 3);
	const ct = Math.floor(test.length / 3);
	for (let i = 0; i < N; i++) {
		const qc = percentiles(sample(control, cc));
		const qt = percentiles(sample(test, ct));

		d50[i] = qc.p50 - qt.p50;
		d95[i] = qc.p95 - qt.p95;
		d99[i] = qc.p99 - qt.p99;
	}

	const md50 = Stats.mean(d50);
	const md95 = Stats.mean(d95);
	const md99 = Stats.mean(d99);

	return {
		d50: md50,
		d95: md95,
		d99: md99,
		ci50: 1.96 * Stats.standardDeviation(d50, true, md50),
		ci95: 1.96 * Stats.standardDeviation(d95, true, md95),
		ci99: 1.96 * Stats.standardDeviation(d99, true, md99),
	};
}

function percentiles(arr) {
	arr.sort((a, b) => a - b);
	return {
		p50: Stats.ptile(arr, 0.50),
		p95: Stats.ptile(arr, 0.95),
		p99: Stats.ptile(arr, 0.99),
	};
}

function sample(arr, n) {
	shuffle(arr);
	return arr.slice(0, n);
}

function shuffle(arr) {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
}

function compute(control, test) {
	return {
	  control: Stats.compute(control),
	  test: Stats.compute(test),
	  diff: confidenceIntervals(control, test),
	};
}

////////// DISPLAY //////////

const colors = require('colors/safe');
const table = require('table').table;

function compare(control, test) {
	const r = compute(control, test);
	console.log(table([
		['num', 'control', 'test', 'd50', 'd90', 'd99'].map(h => colors.bold(h)),
		[Math.min(r.control.cnt, r.test.cnt),
		 `${format(r.control.avg)} (${format(r.control.p50)})`,
		 `${format(r.test.avg)} (${format(r.test.p50)})`,
		 display(r.diff.d50, r.diff.ci50, r.control.p50),
		 display(r.diff.d95, r.diff.ci95, r.control.p95),
		 display(r.diff.d99, r.diff.ci99, r.control.p99)],
	]));
}

function display(diff, ci, percentile) {
	const diffp = percent(diff, percentile);
	const cip = percent(ci, percentile);
	return color(diff, ci)(`${format(diff)} \u00B1${format(ci)}\n(${diffp} \u00B1${cip})`);
}

function color(diff, ci) {
	return (diff - ci < 0 && diff + ci < 0) ? colors.red :
		(diff - ci > 0 && diff + ci > 0) ? colors.green :
			colors.gray;
}

////////// TRAKKR //////////

function format(ms) {
	const abs = Math.abs(ms);
	if (abs < 0.001) return `${decimal(ms * 1000 * 1000)}ns`;
	if (abs < 1) return `${decimal(ms * 1000)}\u03BCs`;
	if (abs < 1000) return `${decimal(ms)}ms`;
	return `${decimal(ms / 1000)}s`;
}

function decimal(n) {
	const abs = Math.abs(n);
	if (abs < 1) return n.toFixed(3);
	if (abs < 10) return n.toFixed(2);
	if (abs < 100) return n.toFixed(1);
	return n.toFixed();
}

function percent(n, d) {
	return `${(n * 100 / d).toFixed(2)}%`;
}


module.exports = compare;

////////// EXAMPLE //////////

/*
const control =
      [ 14.263228193,
        12.484283123,
        14.208075958,
        14.609645215,
        14.385263514,
        13.78584898,
        13.726714602,
        13.841229786,
        13.272724256,
        12.322733034,
        12.378393175,
        12.379924426,
        13.516055647,
        12.361581170000001,
        12.184468783,
        13.072292038,
        12.49451404,
        12.4531577,
        12.295841478,
        12.363465517,
        12.468226785,
        13.501018483,
        12.644068724,
        12.572693914,
        12.309550057,
        12.495619919,
        12.407185814,
        12.346910017,
        12.135651054,
        12.291034677,
        12.560355221,
        12.400846346,
        12.161508047,
        12.477344433,
        12.241549912,
        12.352429738,
        12.190990035,
        12.406618026,
        12.046695822,
        12.165769985,
        11.985625726,
        12.239210741,
        12.022407812,
        12.234322856 ].map(x => x * 1000);

const test = [
   14.562616824,
        12.466995437,
        12.43929698,
        12.283846642,
        12.787817013,
        12.419563231,
        12.201612859,
        12.675744176,
        12.329927116,
        12.459905986,
        12.342993249,
        12.105927825,
        12.37898265,
        12.394572757,
        12.604216941,
        12.598459537,
        12.323579154,
        12.558096538000001,
        12.59069114,
        12.587896739,
        12.353406791,
        12.20161858,
        12.390221811,
        12.388656501,
        13.386093099,
        13.010522894,
        12.911892545,
        12.680775522,
        12.374168384,
        12.622891632,
        12.537990888,
        12.677373734,
        12.62727996,
        12.607724978,
        14.103991399,
        13.756529126,
        15.810942431,
        16.453829447,
        15.253778786,
        14.21865537,
        13.69555687,
        13.885788967
].map(x => x * 1000);
*/

/*
const control =  [ 23.682297794,
        21.986746243,
        21.336716191,
        21.700634403,
        21.432295117,
        21.349417557,
        22.276218258,
        22.01032129,
        21.70067775,
        22.174993609,
        21.898897777,
        21.279320034,
        21.849252218,
        21.606051297,
        21.563833672,
        21.704465297,
        21.804350796,
        21.529497044,
        21.165106002,
        21.459562584,
        21.335992609,
        21.485916768,
        22.319378743,
        22.700387659,
        22.29449217,
        22.470881575,
        21.083555934,
        21.605404955,
        21.665567569,
        23.184020835,
        23.473350849,
        23.717231803,
        23.750647124 ].map(x => x* 1000);

const test = [ 14.608883417,
  13.193178896,
  12.856272656,
  12.369237972,
  12.545666167,
  12.352296264,
  12.508205608,
  12.501022415,
  12.413131071,
  12.190844115,
  12.534878128999999,
  12.55629025,
  12.512620373,
  12.436549662000001,
  12.422507201,
  12.470624191,
  12.334565571,
  12.49842971,
  12.607210334,
  12.926303134,
  12.731569318,
  12.814527363,
  12.89203277,
  12.675898334,
  12.704152464,
  12.63170397,
  12.771399694,
  12.585922077,
  12.631390014,
  12.147341634,
  12.568125682,
  12.510370997,
  12.398084347,
  12.281687675,
  12.183823788,
  12.424928215,
  12.218337312,
  12.403665168,
  12.339173932,
  12.561415869,
  12.274129968,
  12.420131144,
  12.397740732 ].map(x => x * 1000); */

//compare(control, test);
