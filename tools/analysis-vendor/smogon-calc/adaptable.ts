// By default, importing `@smogon/calc` provides a convenience wrapper that is roughly equivalent
// to importing `@smogon/calc/adaptable` and `import Generations from '@smogon/calc/data'` and
// using  `Generations` to populate the `Generation` param to these exports. Alternatively, an
// application may implement a different `@smogon/calc/data/interface` and pass a `Generation` from
// that to these exports.

export {calculate} from './calc';
export {Pokemon} from './pokemon';
export {Move} from './move';
export {Field, Side} from './field';
export {Result} from './result';
export {Stats} from './stats';
